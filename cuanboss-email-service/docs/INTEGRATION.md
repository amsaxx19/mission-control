# CuanBoss Email Service - Integration Checklist

## Pre-Integration

- [ ] Sign up at https://resend.com
- [ ] Verify your domain (cuanboss.id)
- [ ] Create API key
- [ ] Copy `.env.example` to `.env.local` and fill in values

## Integration Steps

### 1. Install Dependencies
```bash
cd cuanboss-project
npm install resend react-email @react-email/components
```

### 2. Copy Files
Copy these folders to your CuanBoss project:
```
cuanboss-email-service/src/ → cuanboss/src/email/
```

### 3. Update Midtrans Webhook
Add email triggers to your existing webhook handler:

```typescript
// In /api/webhook/midtrans/route.ts
import { handlePaymentSuccess } from '@/email/api/midtrans-integration';

// In your POST handler, after payment success:
if (body.transaction_status === 'settlement') {
  // ... existing code ...
  
  // Send email notifications
  const emailResult = await handlePaymentSuccess(body.order_id);
  
  if (!emailResult.success) {
    console.error('Email notifications failed:', emailResult);
  }
}
```

### 4. Add Welcome Email to Signup
```typescript
// In your signup/auth flow
import { sendWelcomeSeller } from '@/email/services/onboardingEmails';

await sendWelcomeSeller({
  to: newUser.email,
  sellerName: newUser.name,
  dashboardLink: `https://cuanboss.id/seller/dashboard`,
});
```

### 5. Add Payout Email to Payout Flow
```typescript
// In your payout processing
import { sendPayoutNotification } from '@/email/services/sellerEmails';

await sendPayoutNotification({
  to: seller.email,
  sellerName: seller.name,
  amount: payout.amount,
  payoutMethod: payout.method,
  accountNumber: maskAccountNumber(payout.accountNumber),
  referenceNumber: payout.reference,
  processedAt: new Date(),
});
```

## Testing

- [ ] Run test suite: `npm run test:email`
- [ ] Place test order, verify buyer receives confirmation
- [ ] Verify seller receives "product sold" email
- [ ] Process test payout, verify notification sent
- [ ] Create test account, verify welcome email

## Production Checklist

- [ ] Domain verified in Resend
- [ ] API key is production key (not test)
- [ ] `EMAIL_FROM` uses verified domain
- [ ] Error handling logs to monitoring
- [ ] Email delivery monitored in Resend dashboard

## Monitoring

Check Resend dashboard weekly:
- https://resend.com/emails

Watch metrics:
- Delivery rate > 95%
- Bounce rate < 2%
- Spam rate < 0.1%
