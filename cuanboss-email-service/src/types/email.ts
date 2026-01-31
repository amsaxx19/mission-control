// Types for CuanBoss Email System

export interface EmailBase {
  to: string;
  subject?: string;
}

// Order-related emails
export interface OrderConfirmationData extends EmailBase {
  orderId: string;
  productName: string;
  productImage?: string;
  amount: number;
  buyerName: string;
  downloadLink?: string;
  accessInstructions?: string;
}

export interface ProductSoldData extends EmailBase {
  productName: string;
  productImage?: string;
  buyerName: string;
  amount: number;
  yourEarnings: number;
  platformFee: number;
  orderId: string;
  dashboardLink: string;
}

// Payout-related emails
export interface PayoutNotificationData extends EmailBase {
  sellerName: string;
  amount: number;
  payoutMethod: string;
  accountNumber: string;
  referenceNumber: string;
  processedAt: Date;
  estimatedArrival?: Date;
}

// Onboarding emails
export interface WelcomeSellerData extends EmailBase {
  sellerName: string;
  dashboardLink: string;
  firstProductLink?: string;
}

// Account emails
export interface PasswordResetData extends EmailBase {
  userName: string;
  resetLink: string;
  expiresAt: Date;
}

export interface EmailChangedData extends EmailBase {
  userName: string;
  newEmail: string;
  changedAt: Date;
}

// Alert emails
export interface LowBalanceAlertData extends EmailBase {
  sellerName: string;
  currentBalance: number;
  minimumThreshold: number;
  dashboardLink: string;
}

export interface SecurityAlertData extends EmailBase {
  userName: string;
  alertType: 'login' | 'password_change' | 'payout_initiated';
  deviceInfo?: string;
  location?: string;
  timestamp: Date;
  actionLink?: string;
}

// Resend API response
export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Email template props
export interface EmailLayoutProps {
  children: React.ReactNode;
  previewText?: string;
}
