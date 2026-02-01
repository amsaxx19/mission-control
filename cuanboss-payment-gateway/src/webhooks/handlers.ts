import { createClient } from '@supabase/supabase-js';
import { MidtransClient } from '../midtrans/client';
import { XenditClient, XenditWebhookPayload } from '../xendit/client';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Email notification function (integrates with existing email service)
async function sendPaymentNotifications(orderId: string, status: 'success' | 'failed') {
  try {
    // This integrates with the existing email service
    const { handlePaymentSuccess } = await import('@/email/api/midtrans-integration');
    
    if (status === 'success') {
      await handlePaymentSuccess(orderId);
    }
  } catch (error) {
    console.error('Failed to send payment notifications:', error);
    // Don't throw - webhook should succeed even if email fails
  }
}

/**
 * Midtrans Webhook Handler
 * 
 * Handles all Midtrans payment notifications
 * MUST be added to: src/app/api/webhook/midtrans/route.ts
 */
export async function handleMidtransWebhook(req: Request) {
  try {
    const body = await req.json();
    const signature = req.headers.get('x-signature') || '';
    
    // Verify signature for security
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const midtrans = new MidtransClient({
      serverKey,
      clientKey: process.env.MIDTRANS_CLIENT_KEY!,
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    });

    // Verify webhook signature
    const payload = JSON.stringify(body);
    const isValid = midtrans.verifyWebhookSignature(payload, signature);
    
    if (!isValid) {
      console.error('Invalid Midtrans webhook signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { 
      transaction_status, 
      order_id, 
      transaction_id,
      gross_amount,
      payment_type,
      fraud_status,
      settlement_time,
    } = body;

    console.log(`Midtrans webhook received: ${order_id} - ${transaction_status}`);

    // Determine CuanBoss order status
    let orderStatus: string;
    let paymentStatus: string;

    switch (transaction_status) {
      case 'capture':
        // Credit card payment captured
        if (fraud_status === 'challenge') {
          orderStatus = 'pending_review';
          paymentStatus = 'challenge';
        } else if (fraud_status === 'accept') {
          orderStatus = 'paid';
          paymentStatus = 'success';
        } else {
          orderStatus = 'pending';
          paymentStatus = 'pending';
        }
        break;

      case 'settlement':
        // Payment settled (funds received)
        orderStatus = 'paid';
        paymentStatus = 'success';
        break;

      case 'pending':
        orderStatus = 'pending_payment';
        paymentStatus = 'pending';
        break;

      case 'deny':
        orderStatus = 'payment_failed';
        paymentStatus = 'denied';
        break;

      case 'cancel':
        orderStatus = 'cancelled';
        paymentStatus = 'cancelled';
        break;

      case 'expire':
        orderStatus = 'expired';
        paymentStatus = 'expired';
        break;

      case 'refund':
        orderStatus = 'refunded';
        paymentStatus = 'refunded';
        break;

      default:
        orderStatus = 'unknown';
        paymentStatus = transaction_status;
    }

    // Update order in database
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: orderStatus,
        payment_status: paymentStatus,
        payment_method: payment_type,
        transaction_id: transaction_id,
        paid_at: settlement_time ? new Date(settlement_time).toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', order_id);

    if (updateError) {
      console.error('Failed to update order:', updateError);
      throw updateError;
    }

    // Log webhook for audit
    await supabase.from('payment_webhook_logs').insert({
      order_id: order_id,
      provider: 'midtrans',
      event_type: transaction_status,
      payload: body,
      processed: true,
      processed_at: new Date().toISOString(),
    });

    // Handle successful payment
    if (paymentStatus === 'success') {
      // Distribute revenue to seller (minus platform fee)
      await distributeRevenue(order_id);
      
      // Send email notifications
      await sendPaymentNotifications(order_id, 'success');
      
      // Grant access to digital product
      await grantProductAccess(order_id);
    }

    return new Response(JSON.stringify({ received: true, status: orderStatus }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Midtrans webhook error:', error);
    
    // Log error but return 200 to prevent retries
    await supabase.from('payment_webhook_logs').insert({
      provider: 'midtrans',
      event_type: 'error',
      error: error.message,
      processed: false,
      processed_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ error: error.message }), {
      status: 200, // Return 200 to prevent Midtrans retries
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Xendit Webhook Handler
 * 
 * Handles all Xendit payment notifications
 * MUST be added to: src/app/api/webhook/xendit/route.ts
 */
export async function handleXenditWebhook(req: Request) {
  try {
    const body = await req.json() as XenditWebhookPayload;
    const signature = req.headers.get('x-callback-token') || '';
    
    // Verify webhook token
    const webhookToken = process.env.XENDIT_WEBHOOK_TOKEN!;
    
    if (webhookToken && signature !== webhookToken) {
      console.error('Invalid Xendit webhook token');
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const {
      externalId: order_id,
      status,
      id: transaction_id,
      amount,
      paid_amount,
      payment_method,
      paid_at,
      payment_channel,
    } = body;

    console.log(`Xendit webhook received: ${order_id} - ${status}`);

    // Map Xendit status to CuanBoss status
    let orderStatus: string;
    let paymentStatus: string;

    switch (status) {
      case 'PAID':
        orderStatus = 'paid';
        paymentStatus = 'success';
        break;
      case 'SETTLED':
        orderStatus = 'paid';
        paymentStatus = 'settled';
        break;
      case 'EXPIRED':
        orderStatus = 'expired';
        paymentStatus = 'expired';
        break;
      default:
        orderStatus = 'pending';
        paymentStatus = 'pending';
    }

    // Update order
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: orderStatus,
        payment_status: paymentStatus,
        payment_method: payment_channel || payment_method,
        transaction_id: transaction_id,
        paid_at: paid_at ? new Date(paid_at).toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', order_id);

    if (updateError) {
      console.error('Failed to update order:', updateError);
      throw updateError;
    }

    // Log webhook
    await supabase.from('payment_webhook_logs').insert({
      order_id: order_id,
      provider: 'xendit',
      event_type: status,
      payload: body,
      processed: true,
      processed_at: new Date().toISOString(),
    });

    // Handle success
    if (paymentStatus === 'success' || paymentStatus === 'settled') {
      await distributeRevenue(order_id);
      await sendPaymentNotifications(order_id, 'success');
      await grantProductAccess(order_id);
    }

    return new Response(JSON.stringify({ received: true, status: orderStatus }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Xendit webhook error:', error);
    
    await supabase.from('payment_webhook_logs').insert({
      provider: 'xendit',
      event_type: 'error',
      error: error.message,
      processed: false,
      processed_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ error: error.message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Distribute revenue to seller
 * Calculates 15% platform fee, credits seller with 85%
 */
async function distributeRevenue(orderId: string) {
  try {
    // Get order details
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, product:product_id(seller_id, price)')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    const grossAmount = order.amount;
    const platformFee = Math.round(grossAmount * 0.15);
    const sellerEarnings = grossAmount - platformFee;
    const sellerId = order.product?.seller_id || order.seller_id;

    if (!sellerId) {
      throw new Error(`No seller found for order: ${orderId}`);
    }

    // Update seller balance
    const { error: balanceError } = await supabase.rpc('add_seller_balance', {
      p_seller_id: sellerId,
      p_amount: sellerEarnings,
      p_order_id: orderId,
    });

    if (balanceError) {
      // Fallback: direct update if RPC doesn't exist
      const { error: directError } = await supabase
        .from('seller_balances')
        .upsert({
          seller_id: sellerId,
          available_balance: supabase.rpc('increment', { amount: sellerEarnings }),
          total_earnings: supabase.rpc('increment', { amount: sellerEarnings }),
          updated_at: new Date().toISOString(),
        });

      if (directError) throw directError;
    }

    // Create transaction record
    await supabase.from('transactions').insert({
      order_id: orderId,
      seller_id: sellerId,
      gross_amount: grossAmount,
      platform_fee: platformFee,
      seller_earnings: sellerEarnings,
      type: 'sale',
      status: 'completed',
    });

    console.log(`Revenue distributed for order ${orderId}: ${sellerEarnings} to seller ${sellerId}`);

  } catch (error) {
    console.error('Revenue distribution error:', error);
    // Don't throw - we don't want to fail the webhook
    // Instead, queue for retry
    await supabase.from('failed_revenue_distributions').insert({
      order_id: orderId,
      error: error instanceof Error ? error.message : 'Unknown error',
      retry_count: 0,
      created_at: new Date().toISOString(),
    });
  }
}

/**
 * Grant access to digital product after payment
 */
async function grantProductAccess(orderId: string) {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, product:product_id(id, download_url, access_granted)')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    // Update order to grant access
    await supabase
      .from('orders')
      .update({
        access_granted: true,
        access_granted_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    // Create access record for download tracking
    await supabase.from('product_access').insert({
      order_id: orderId,
      buyer_id: order.buyer_id,
      product_id: order.product_id,
      granted_at: new Date().toISOString(),
      expires_at: null, // No expiration for digital products
    });

    console.log(`Product access granted for order ${orderId}`);

  } catch (error) {
    console.error('Grant access error:', error);
    await supabase.from('failed_access_grants').insert({
      order_id: orderId,
      error: error instanceof Error ? error.message : 'Unknown error',
      retry_count: 0,
      created_at: new Date().toISOString(),
    });
  }
}

export default {
  handleMidtransWebhook,
  handleXenditWebhook,
};
