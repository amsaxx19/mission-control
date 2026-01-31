// Buyer/Order email services
import { render } from '@react-email/render';
import { sendEmail } from './resend';
import OrderConfirmationEmail from '../templates/OrderConfirmation';
import { OrderConfirmationData, EmailSendResult } from '../types/email';

export async function sendOrderConfirmation(
  data: OrderConfirmationData
): Promise<EmailSendResult> {
  const subject = `✅ Pembayaran Berhasil - Order ${data.orderId}`;

  try {
    const html = await render(OrderConfirmationEmail(data));

    return await sendEmail({
      to: data.to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Failed to send order confirmation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Render failed',
    };
  }
}

// Send order confirmation with retry logic
export async function sendOrderConfirmationWithRetry(
  data: OrderConfirmationData,
  maxRetries = 3
): Promise<EmailSendResult> {
  let lastError: string | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await sendOrderConfirmation(data);

    if (result.success) {
      return result;
    }

    lastError = result.error;

    if (attempt < maxRetries) {
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt - 1) * 1000;
      console.log(`Retry ${attempt}/${maxRetries} after ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return {
    success: false,
    error: `Failed after ${maxRetries} attempts: ${lastError}`,
  };
}

// Send bulk order confirmations (for batch processing)
export async function sendBulkOrderConfirmations(
  orders: OrderConfirmationData[],
  onProgress?: (completed: number, total: number) => void
): Promise<{ success: number; failed: number; errors: string[] }> {
  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  for (let i = 0; i < orders.length; i++) {
    const result = await sendOrderConfirmation(orders[i]);

    if (result.success) {
      success++;
    } else {
      failed++;
      errors.push(`${orders[i].to}: ${result.error}`);
    }

    onProgress?.(i + 1, orders.length);

    // Rate limiting
    if (i < orders.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return { success, failed, errors };
}
