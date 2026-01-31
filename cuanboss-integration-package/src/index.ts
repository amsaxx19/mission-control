// Main exports for CuanBoss Email Service

// Types
export * from './types/email';

// Services
export {
  sendEmail,
  sendBatchEmails,
  verifyEmailConfig,
  resend,
} from './services/resend';

export {
  sendOrderConfirmation,
  sendOrderConfirmationWithRetry,
  sendBulkOrderConfirmations,
} from './services/orderEmails';

export {
  sendProductSold,
  sendPayoutNotification,
  sendPaymentSuccessEmails,
} from './services/sellerEmails';

export {
  sendWelcomeSeller,
  sendOnboardingSequence,
  sendReengagementEmail,
} from './services/onboardingEmails';

// Templates (for custom rendering)
export { default as OrderConfirmationEmail } from './templates/OrderConfirmation';
export { default as ProductSoldEmail } from './templates/ProductSold';
export { default as PayoutNotificationEmail } from './templates/PayoutNotification';
export { default as WelcomeSellerEmail } from './templates/WelcomeSeller';
export { default as PasswordResetEmail } from './templates/PasswordReset';
export { default as EmailLayout } from './templates/components/EmailLayout';
