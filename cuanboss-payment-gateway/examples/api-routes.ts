// Example API routes for Next.js App Router
// Copy these files to your src/app/api directory

// ============================================================================
// src/app/api/orders/create/route.ts
// ============================================================================

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { productId, sellerId, buyerId, amount, paymentMethod } = await req.json();

    // Validate input
    if (!productId || !sellerId || !buyerId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate fees
    const platformFee = Math.round(amount * 0.15);
    const sellerEarnings = amount - platformFee;

    // Create order
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        product_id: productId,
        seller_id: sellerId,
        buyer_id: buyerId,
        amount,
        platform_fee: platformFee,
        seller_earnings: sellerEarnings,
        payment_method: paymentMethod,
        status: 'pending_payment',
        payment_status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ orderId: order.id });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// src/app/api/payments/initiate/route.ts
// ============================================================================

import { MidtransClient, XenditClient } from '@cuanboss/payment-gateway';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const midtrans = new MidtransClient({
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
});

const xendit = new XenditClient({
  secretKey: process.env.XENDIT_SECRET_KEY!,
  isProduction: process.env.XENDIT_IS_PRODUCTION === 'true',
});

export async function POST(req: Request) {
  try {
    const { orderId, productName, amount, paymentMethod } = await req.json();

    // Get order details with buyer info
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        buyer:buyer_id (email, name)
      `)
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Determine which gateway to use
    // Use Xendit for QRIS, Retail
    // Use Midtrans for everything else
    const useXendit = ['qris', 'alfamart', 'indomaret'].includes(paymentMethod);

    if (useXendit) {
      const invoice = xendit.createCuanBossInvoice({
        orderId,
        productName,
        productPrice: amount,
        buyerEmail: order.buyer.email,
        buyerName: order.buyer.name,
        sellerId: order.seller_id,
      });

      const response = await xendit.createInvoice(invoice);

      // Store transaction ID
      await supabase
        .from('orders')
        .update({ transaction_id: response.id })
        .eq('id', orderId);

      return NextResponse.json({
        redirectUrl: response.invoiceUrl,
      });
    } else {
      // Use Midtrans Snap
      const snapTransaction = midtrans.createCuanBossOrder({
        orderId,
        productId: order.product_id,
        productName,
        productPrice: amount,
        platformFee: order.platform_fee,
        sellerEarnings: order.seller_earnings,
        buyerId: order.buyer_id,
        buyerEmail: order.buyer.email,
        buyerName: order.buyer.name,
        sellerId: order.seller_id,
        sellerEmail: '', // Fetch from sellers table
        sellerName: '', // Fetch from sellers table
      });

      const response = await midtrans.createSnapTransaction(snapTransaction);

      // Store transaction token
      await supabase
        .from('orders')
        .update({ transaction_id: response.token })
        .eq('id', orderId);

      return NextResponse.json({
        token: response.token,
        redirectUrl: response.redirectUrl,
      });
    }
  } catch (error: any) {
    console.error('Initiate payment error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// src/app/api/sellers/[id]/balance/route.ts
// ============================================================================

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('seller_balances')
      .select('*')
      .eq('seller_id', params.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return NextResponse.json({
      available: data?.available_balance || 0,
      pending: data?.pending_balance || 0,
      totalEarned: data?.total_earnings || 0,
      lastPayout: data?.last_payout_at,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// src/app/api/sellers/[id]/payouts/route.ts
// ============================================================================

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('payouts')
      .select('*')
      .eq('seller_id', params.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const payouts = data.map(p => ({
      id: p.id,
      date: p.created_at,
      amount: p.amount,
      status: p.status,
      method: 'Bank Transfer',
      reference: p.reference,
    }));

    return NextResponse.json(payouts);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// src/app/api/sellers/[id]/bank-accounts/route.ts
// ============================================================================

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('seller_bank_accounts')
      .select('*')
      .eq('seller_id', params.id)
      .order('is_primary', { ascending: false });

    if (error) throw error;

    const accounts = data.map(a => ({
      id: a.id,
      bankName: a.bank_name,
      accountNumber: a.account_number,
      accountHolderName: a.account_holder_name,
      isPrimary: a.is_primary,
    }));

    return NextResponse.json(accounts);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// src/app/api/payouts/request/route.ts
// ============================================================================

import { XenditClient } from '@cuanboss/payment-gateway';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const xendit = new XenditClient({
  secretKey: process.env.XENDIT_SECRET_KEY!,
  isProduction: process.env.XENDIT_IS_PRODUCTION === 'true',
});

export async function POST(req: Request) {
  try {
    const { sellerId, amount, bankAccountId } = await req.json();

    // Validate minimum amount
    if (amount < 50000) {
      return NextResponse.json(
        { error: 'Minimum payout is Rp50.000' },
        { status: 400 }
      );
    }

    // Check balance
    const { data: balance } = await supabase
      .from('seller_balances')
      .select('available_balance')
      .eq('seller_id', sellerId)
      .single();

    if (!balance || balance.available_balance < amount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Get bank account
    const { data: bankAccount } = await supabase
      .from('seller_bank_accounts')
      .select('*')
      .eq('id', bankAccountId)
      .single();

    if (!bankAccount) {
      return NextResponse.json(
        { error: 'Bank account not found' },
        { status: 404 }
      );
    }

    // Create payout record
    const { data: payout, error: payoutError } = await supabase
      .from('payouts')
      .insert({
        seller_id: sellerId,
        amount,
        bank_account_id: bankAccountId,
        status: 'processing',
      })
      .select()
      .single();

    if (payoutError) throw payoutError;

    // Process disbursement via Xendit
    const disbursement = await xendit.createDisbursement({
      externalId: payout.id,
      amount,
      bankCode: bankAccount.bank_code,
      accountHolderName: bankAccount.account_holder_name,
      accountNumber: bankAccount.account_number,
      description: `CuanBoss Payout - ${payout.id}`,
    });

    // Update payout with reference
    await supabase
      .from('payouts')
      .update({
        status: disbursement.status === 'COMPLETED' ? 'completed' : 'pending',
        reference: disbursement.id,
        processed_at: new Date().toISOString(),
      })
      .eq('id', payout.id);

    // Deduct from balance
    await supabase
      .from('seller_balances')
      .update({
        available_balance: balance.available_balance - amount,
        last_payout_at: new Date().toISOString(),
      })
      .eq('seller_id', sellerId);

    return NextResponse.json({
      payoutId: payout.id,
      status: disbursement.status,
      reference: disbursement.id,
    });
  } catch (error: any) {
    console.error('Payout request error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
