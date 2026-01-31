// Example: Testing email templates
// Run with: npx tsx examples/test-emails.ts

import {
  sendOrderConfirmation,
  sendProductSold,
  sendPayoutNotification,
  sendWelcomeSeller,
  verifyEmailConfig,
} from '../src/index';

// Test configuration
const TEST_EMAIL = 'amos@cuanboss.id'; // Change to your test email

async function runTests() {
  console.log('🧪 CuanBoss Email Service - Test Suite\n');

  // 1. Verify configuration
  console.log('1️⃣ Checking email configuration...');
  const isConfigured = await verifyEmailConfig();
  if (!isConfigured) {
    console.error('❌ Email service not configured. Check RESEND_API_KEY.');
    process.exit(1);
  }
  console.log('✅ Configuration OK\n');

  // 2. Test Order Confirmation
  console.log('2️⃣ Testing Order Confirmation email...');
  const orderResult = await sendOrderConfirmation({
    to: TEST_EMAIL,
    buyerName: 'Amos',
    orderId: 'ORD-TEST-001',
    productName: 'TikTok Affiliate Masterclass',
    amount: 299000,
    downloadLink: 'https://cuanboss.id/download/test123',
  });
  console.log(orderResult.success ? '✅ Sent' : `❌ Failed: ${orderResult.error}`);

  // 3. Test Product Sold
  console.log('3️⃣ Testing Product Sold email...');
  const soldResult = await sendProductSold({
    to: TEST_EMAIL,
    productName: 'TikTok Affiliate Masterclass',
    buyerName: 'Buyer Test',
    amount: 299000,
    yourEarnings: 254150,
    platformFee: 44850,
    orderId: 'ORD-TEST-001',
    dashboardLink: 'https://cuanboss.id/seller/dashboard',
  });
  console.log(soldResult.success ? '✅ Sent' : `❌ Failed: ${soldResult.error}`);

  // 4. Test Payout Notification
  console.log('4️⃣ Testing Payout Notification email...');
  const payoutResult = await sendPayoutNotification({
    to: TEST_EMAIL,
    sellerName: 'Amos',
    amount: 1500000,
    payoutMethod: 'Bank Transfer - BCA',
    accountNumber: '****1234',
    referenceNumber: 'PYT-TEST-001',
    processedAt: new Date(),
    estimatedArrival: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
  console.log(payoutResult.success ? '✅ Sent' : `❌ Failed: ${payoutResult.error}`);

  // 5. Test Welcome Email
  console.log('5️⃣ Testing Welcome Seller email...');
  const welcomeResult = await sendWelcomeSeller({
    to: TEST_EMAIL,
    sellerName: 'Amos',
    dashboardLink: 'https://cuanboss.id/seller/dashboard',
    firstProductLink: 'https://cuanboss.id/seller/products/new',
  });
  console.log(welcomeResult.success ? '✅ Sent' : `❌ Failed: ${welcomeResult.error}`);

  console.log('\n✨ Test complete! Check your inbox.');
}

// Run tests
runTests().catch(console.error);
