// API Routes for Next.js App Router
// Copy these to your CuanBoss app/api/email/ folder

import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmation } from '../../../services/orderEmails';
import { sendProductSold, sendPayoutNotification } from '../../../services/sellerEmails';
import { sendWelcomeSeller } from '../../../services/onboardingEmails';

// POST /api/email/order-confirmation
export async function POST_orderConfirmation(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await sendOrderConfirmation({
      to: body.to,
      buyerName: body.buyerName,
      orderId: body.orderId,
      productName: body.productName,
      amount: body.amount,
      productImage: body.productImage,
      downloadLink: body.downloadLink,
      accessInstructions: body.accessInstructions,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}

// POST /api/email/product-sold
export async function POST_productSold(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await sendProductSold({
      to: body.to,
      productName: body.productName,
      productImage: body.productImage,
      buyerName: body.buyerName,
      amount: body.amount,
      yourEarnings: body.yourEarnings,
      platformFee: body.platformFee,
      orderId: body.orderId,
      dashboardLink: body.dashboardLink,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}

// POST /api/email/payout-notification
export async function POST_payoutNotification(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await sendPayoutNotification({
      to: body.to,
      sellerName: body.sellerName,
      amount: body.amount,
      payoutMethod: body.payoutMethod,
      accountNumber: body.accountNumber,
      referenceNumber: body.referenceNumber,
      processedAt: new Date(body.processedAt),
      estimatedArrival: body.estimatedArrival
        ? new Date(body.estimatedArrival)
        : undefined,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}

// POST /api/email/welcome-seller
export async function POST_welcomeSeller(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await sendWelcomeSeller({
      to: body.to,
      sellerName: body.sellerName,
      dashboardLink: body.dashboardLink,
      firstProductLink: body.firstProductLink,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
