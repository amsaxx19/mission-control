// Resend Email Service - Core sending functionality
import { Resend } from 'resend';
import { EmailSendResult } from '../types/email';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@cuanboss.id';
const FROM_NAME = process.env.EMAIL_FROM_NAME || 'CuanBoss';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: SendEmailOptions): Promise<EmailSendResult> {
  try {
    // Validate Resend API key
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not configured');
      return {
        success: false,
        error: 'Email service not configured',
      };
    }

    // Validate email
    if (!to || !to.includes('@')) {
      return {
        success: false,
        error: 'Invalid recipient email',
      };
    }

    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [to],
      subject,
      html,
      replyTo: replyTo || process.env.EMAIL_REPLY_TO,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log('✅ Email sent:', {
      to,
      subject,
      messageId: data?.id,
    });

    return {
      success: true,
      messageId: data?.id,
    };
  } catch (error) {
    console.error('❌ Email send failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Batch send with rate limiting
export async function sendBatchEmails(
  emails: SendEmailOptions[],
  options: { delayMs?: number } = {}
): Promise<EmailSendResult[]> {
  const { delayMs = 100 } = options;
  const results: EmailSendResult[] = [];

  for (const email of emails) {
    const result = await sendEmail(email);
    results.push(result);

    // Rate limiting to avoid hitting API limits
    if (delayMs > 0 && emails.indexOf(email) < emails.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return results;
}

// Verify email configuration
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    if (!process.env.RESEND_API_KEY) {
      return false;
    }

    // Try to get account info (lightweight check)
    await resend.apiKeys.list();
    return true;
  } catch {
    return false;
  }
}

export { resend };
