# CuanBoss Email Notification Service

Complete email system for CuanBoss marketplace - order confirmations, payout notifications, seller onboarding.

## 🚀 Quick Start

```bash
# Install dependencies
npm install resend react-email @react-email/components

# Set environment variables
RESEND_API_KEY=re_xxxxxxxx
EMAIL_FROM=noreply@cuanboss.id
EMAIL_FROM_NAME="CuanBoss"
```

## 📧 Email Templates Included

| Template | Purpose | Trigger |
|----------|---------|---------|
| `OrderConfirmation` | Buyer receives after successful payment | Midtrans webhook - payment success |
| `PayoutNotification` | Seller receives when payout is sent | Admin payout action |
| `WelcomeSeller` | New seller onboarding | Account creation |
| `ProductSold` | Seller notification of sale | Payment success |
| `PasswordReset` | Password reset link | User request |
| `LowBalanceAlert` | Seller wallet low balance | Scheduled check |

## 🔧 Integration

### 1. Install into CuanBoss

Copy `src/` folder to your CuanBoss project:
```
cuanboss/
├── src/
│   └── email/           # <-- Copy here
│       ├── templates/
│       ├── services/
│       ├── api/
│       └── types/
```

### 2. Environment Variables

Add to your `.env.local`:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@cuanboss.id
EMAIL_FROM_NAME="CuanBoss"
EMAIL_REPLY_TO=support@cuanboss.id
```

### 3. Update Midtrans Webhook

Add email trigger to your webhook handler:

```typescript
// In your /api/webhook/midtrans route
import { sendOrderConfirmation } from '@/email/services/orderEmails';
import { sendProductSold } from '@/email/services/sellerEmails';

// After payment success:
await sendOrderConfirmation({
  to: buyer.email,
  orderId: order.id,
  productName: product.name,
  amount: order.amount,
  downloadLink: product.downloadUrl
});

await sendProductSold({
  to: seller.email,
  productName: product.name,
  buyerName: buyer.name,
  amount: order.amount,
  yourEarnings: order.amount * 0.85 // 85% to seller
});
```

## 📖 API Reference

### sendOrderConfirmation
Send order confirmation to buyer after purchase.

```typescript
import { sendOrderConfirmation } from '@/email/services/orderEmails';

await sendOrderConfirmation({
  to: 'buyer@email.com',
  orderId: 'ORD-2024-001',
  productName: 'TikTok Affiliate Course',
  amount: 299000,
  downloadLink: 'https://cuanboss.id/download/abc123'
});
```

### sendPayoutNotification
Notify seller when payout is processed.

```typescript
import { sendPayoutNotification } from '@/email/services/sellerEmails';

await sendPayoutNotification({
  to: 'seller@email.com',
  sellerName: 'John Doe',
  amount: 1500000,
  payoutMethod: 'Bank Transfer - BCA',
  referenceNumber: 'PYT-2024-045',
  processedAt: new Date()
});
```

### sendWelcomeSeller
Welcome email for new sellers.

```typescript
import { sendWelcomeSeller } from '@/email/services/onboardingEmails';

await sendWelcomeSeller({
  to: 'new@seller.com',
  sellerName: 'Jane Smith',
  dashboardLink: 'https://cuanboss.id/seller/dashboard'
});
```

## 🎨 Customization

### Brand Colors
Edit `src/templates/components/EmailLayout.tsx`:
```typescript
const colors = {
  primary: '#6366f1',    // Change to your brand color
  secondary: '#8b5cf6',
  background: '#fafafa',
  text: '#1f2937'
};
```

### Logo
Replace logo URL in `EmailLayout.tsx`:
```typescript
<Img
  src="https://cuanboss.id/logo.png"  // Your logo
  alt="CuanBoss"
  width={120}
/>
```

## 📊 Monitoring

Resend dashboard shows:
- Delivery rates
- Open rates
- Click rates
- Bounce/spam tracking

URL: https://resend.com/emails

## 🧪 Testing

```typescript
// Test email
import { sendTestEmail } from '@/email/services/test';

await sendTestEmail({
  to: 'amos@cuanboss.id',
  template: 'order-confirmation'
});
```

## 📝 Changelog

### v1.0.0 (Night 2 Build)
- ✅ Order confirmation emails
- ✅ Payout notification emails  
- ✅ Welcome seller emails
- ✅ Product sold notifications
- ✅ Password reset emails
- ✅ Low balance alerts
- ✅ Resend API integration
- ✅ TypeScript types
- ✅ Full documentation

---
Built by Night Shift Employee 🌙
