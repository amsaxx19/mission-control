// Integration guide for Midtrans webhook
// Add this to your existing /api/webhook/midtrans route

import { sendOrderConfirmation } from '@/email/services/orderEmails';
import { sendProductSold } from '@/email/services/sellerEmails';
import { createClient } from '@supabase/supabase-js';

// Add this function to your webhook handler
export async function handlePaymentSuccess(orderId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Get order details with buyer and seller info
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      buyer:buyer_id (email, name),
      seller:seller_id (email, name),
      product:product_id (name, image_url, download_url)
    `)
    .eq('id', orderId)
    .single();

  if (error || !order) {
    console.error('Failed to get order details:', error);
    return { success: false, error: 'Order not found' };
  }

  // 2. Calculate earnings
  const platformFee = order.amount * 0.15; // 15% fee
  const sellerEarnings = order.amount - platformFee;

  // 3. Send emails in parallel
  const [buyerEmail, sellerEmail] = await Promise.all([
    // Order confirmation to buyer
    sendOrderConfirmation({
      to: order.buyer.email,
      buyerName: order.buyer.name,
      orderId: order.id,
      productName: order.product.name,
      amount: order.amount,
      productImage: order.product.image_url,
      downloadLink: order.product.download_url,
    }),

    // Product sold notification to seller
    sendProductSold({
      to: order.seller.email,
      productName: order.product.name,
      buyerName: order.buyer.name,
      amount: order.amount,
      yourEarnings: sellerEarnings,
      platformFee: platformFee,
      orderId: order.id,
      dashboardLink: `https://cuanboss.id/seller/orders`,
    }),
  ]);

  // 4. Log email results
  await supabase.from('email_logs').insert({
    order_id: orderId,
    buyer_email_sent: buyerEmail.success,
    seller_email_sent: sellerEmail.success,
    buyer_message_id: buyerEmail.messageId,
    seller_message_id: sellerEmail.messageId,
    errors: [
      !buyerEmail.success && `Buyer: ${buyerEmail.error}`,
      !sellerEmail.success && `Seller: ${sellerEmail.error}`,
    ].filter(Boolean),
  });

  return {
    success: buyerEmail.success && sellerEmail.success,
    buyer: buyerEmail,
    seller: sellerEmail,
  };
}

// Example webhook handler integration:
/*
export async function POST(req: Request) {
  const body = await req.json();
  
  // Verify Midtrans signature...
  
  if (body.transaction_status === 'settlement') {
    // Update order status
    await updateOrderStatus(body.order_id, 'paid');
    
    // Distribute revenue
    await distributeRevenue(body.order_id);
    
    // ✅ SEND EMAIL NOTIFICATIONS (add this)
    const emailResult = await handlePaymentSuccess(body.order_id);
    
    if (!emailResult.success) {
      console.error('Email notifications failed:', emailResult);
      // Don't fail the webhook, just log the error
    }
  }
  
  return Response.json({ received: true });
}
*/
