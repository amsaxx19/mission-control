// Onboarding email services
import { render } from '@react-email/render';
import { sendEmail } from './resend';
import WelcomeSellerEmail from '../templates/WelcomeSeller';
import {
  WelcomeSellerData,
  EmailSendResult,
} from '../types/email';

// Welcome email for new sellers
export async function sendWelcomeSeller(
  data: WelcomeSellerData
): Promise<EmailSendResult> {
  const subject = `🚀 Selamat Datang di CuanBoss, ${data.sellerName}!`;

  try {
    const html = await render(WelcomeSellerEmail(data));

    return await sendEmail({
      to: data.to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Render failed',
    };
  }
}

// Onboarding sequence - sends a series of emails over time
export async function sendOnboardingSequence(
  data: WelcomeSellerData
): Promise<void> {
  // Day 0: Welcome email
  await sendWelcomeSeller(data);

  // Note: Day 3 and Day 7 emails should be triggered by a scheduled job
  // (e.g., using Supabase Edge Functions or a cron job)
  // For now, we just document what should happen

  console.log('Onboarding sequence started for:', data.to);
  console.log('Scheduled emails:');
  console.log('- Day 3: Tips upload produk pertama');
  console.log('- Day 7: Case studies seller sukses');
  console.log('- Day 14: Promo upgrade ke Pro plan');
}

// Re-engagement email for inactive sellers
export async function sendReengagementEmail({
  to,
  sellerName,
  dashboardLink,
}: {
  to: string;
  sellerName: string;
  dashboardLink: string;
}): Promise<EmailSendResult> {
  const subject = `${sellerName}, kami rindu! 🥺`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Halo ${sellerName},</h1>
      <p>Kami noticed kamu belum aktif di CuanBoss beberapa waktu ini.</p>
      <p>Punya digital product yang ingin dijual? Sekarang saatnya!</p>
      <p>Ayam yang diam ditambah lagi, ayam yang berkokok dapat emas (quote from CuanBoss).</p>
      <a href="${dashboardLink}" 
         style="background: #6366f1; color: white; padding: 12px 24px; 
                text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">
        Buka Dashboard
      </a>
      <p>Ada yang bisa kami bantu? Reply email ini atau chat kami di WhatsApp.</p>
      <p>Tim CuanBoss 💙</p>
    </div>
  `;

  return await sendEmail({
    to,
    subject,
    html,
  });
}
