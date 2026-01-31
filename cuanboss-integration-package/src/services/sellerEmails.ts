// Seller notification email services
import { render } from '@react-email/render';
import { sendEmail } from './resend';
import ProductSoldEmail from '../templates/ProductSold';
import PayoutNotificationEmail from '../templates/PayoutNotification';
import {
  ProductSoldData,
  PayoutNotificationData,
  EmailSendResult,
} from '../types/email';

// Notify seller when their product is sold
export async function sendProductSold(
  data: ProductSoldData
): Promise<EmailSendResult> {
  const subject = `🎉 ${data.productName} Terjual! +${formatRupiah(
    data.yourEarnings
  )}`;

  try {
    const html = await render(ProductSoldEmail(data));

    return await sendEmail({
      to: data.to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Failed to send product sold email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Render failed',
    };
  }
}

// Notify seller when payout is processed
export async function sendPayoutNotification(
  data: PayoutNotificationData
): Promise<EmailSendResult> {
  const subject = `💰 Payout ${formatRupiah(data.amount)} Diproses`;

  try {
    const html = await render(PayoutNotificationEmail(data));

    return await sendEmail({
      to: data.to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Failed to send payout notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Render failed',
    };
  }
}

// Send both buyer and seller notifications after successful payment
export async function sendPaymentSuccessEmails({
  buyerData,
  sellerData,
}: {
  buyerData: {
    email: string;
    name: string;
    orderId: string;
    productName: string;
    amount: number;
    downloadLink?: string;
  };
  sellerData: {
    email: string;
    name: string;
    productName: string;
    amount: number;
    orderId: string;
    dashboardLink: string;
  };
}): Promise<{ buyer: EmailSendResult; seller: EmailSendResult }> {
  const platformFee = sellerData.amount * 0.15; // 15% fee
  const sellerEarnings = sellerData.amount - platformFee;

  // Send both emails in parallel
  const [buyerResult, sellerResult] = await Promise.all([
    sendOrderConfirmation({
      to: buyerData.email,
      buyerName: buyerData.name,
      orderId: buyerData.orderId,
      productName: buyerData.productName,
      amount: buyerData.amount,
      downloadLink: buyerData.downloadLink,
    }),
    sendProductSold({
      to: sellerData.email,
      productName: sellerData.productName,
      buyerName: buyerData.name,
      amount: sellerData.amount,
      yourEarnings: sellerEarnings,
      platformFee: platformFee,
      orderId: sellerData.orderId,
      dashboardLink: sellerData.dashboardLink,
    }),
  ]);

  return { buyer: buyerResult, seller: sellerResult };
}

// Helper function
function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
}
