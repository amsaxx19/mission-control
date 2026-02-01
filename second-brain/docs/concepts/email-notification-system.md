---
title: Email Notification System
date: 2026-02-01
tags: [concept, email, notifications, cuanboss, resend]
---

# Email Notification System

## Overview

CuanBoss uses **Resend** for transactional emails — the modern email API that delivers to inbox (not spam) with 3,000 free emails/month.

## Why Resend?

| Feature | Benefit |
|---------|---------|
| Deliverability | Reputation built on modern infrastructure |
| React Email | Write emails as React components |
| Free Tier | 3,000 emails/month covers our volume |
| TypeScript | Full type safety |
| Simple API | Easy integration |

## Email Templates

### 1. Order Confirmation
**Trigger:** Payment successful (Midtrans webhook)  
**Recipient:** Buyer  
**Purpose:** Instant product access + trust building

**Content:**
- Order summary
- Product download/access link
- Payment details
- Support contact

### 2. Product Sold
**Trigger:** Payment successful  
**Recipient:** Seller  
**Purpose:** "You made money!" dopamine hit

**Content:**
- Product name
- Sale amount
- Revenue breakdown (after fees)
- Wallet balance update

### 3. Payout Notification
**Trigger:** Admin processes withdrawal  
**Recipient:** Seller  
**Purpose:** Confirm money is on the way

**Content:**
- Withdrawal amount
- Bank account details
- Expected arrival
- Transaction reference

### 4. Welcome Seller
**Trigger:** Account created  
**Recipient:** New seller  
**Purpose:** Onboarding + reduce churn

**Content:**
- Welcome message
- Platform overview
- First steps guide
- Help resources

### 5. Password Reset
**Trigger:** User requests reset  
**Recipient:** User  
**Purpose:** Security + account recovery

**Content:**
- Reset link (expires in 1 hour)
- Security tips
- Support contact

## Technical Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Midtrans       │────▶│  Webhook        │────▶│  Email Service  │
│  Payment        │     │  Handler        │     │  (Resend API)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │                           │
                              ▼                           ▼
                       ┌─────────────────┐       ┌─────────────────┐
                       │  Update Order   │       │  Buyer Email    │
                       │  Status         │       │  Confirmation   │
                       └─────────────────┘       └─────────────────┘
                              │                           │
                              ▼                           ▼
                       ┌─────────────────┐       ┌─────────────────┐
                       │  Credit Seller  │       │  Seller Email   │
                       │  Wallet         │       │  Notification   │
                       └─────────────────┘       └─────────────────┘
```

## Integration Flow

### 1. Payment Success Webhook
```typescript
// /api/webhook/midtrans
import { handlePaymentSuccess } from '@/email/api/midtrans-integration';

// After verifying payment:
await handlePaymentSuccess(orderId);
```

This single call:
1. Sends order confirmation to buyer
2. Sends sale notification to seller
3. Logs email status

### 2. Direct API Usage
```typescript
import { sendOrderConfirmation } from '@/email/services/orderEmails';

await sendOrderConfirmation({
  to: buyerEmail,
  orderId: 'ORD-123',
  productName: 'Kelas TikTok Affiliate',
  amount: 150000,
  downloadLink: 'https://cuanboss.id/...'
});
```

## Cost Analysis

**Current Volume (estimated):**
- ~500 transactions/month
- 2 emails per transaction (buyer + seller)
- ~1,000 emails/month total

**Cost:** $0 (within Resend free tier)

**Scale to 10,000 transactions:**
- 20,000 emails/month
- Cost: ~$20/month
- Revenue at 15% fee: ~Rp 375jt ($24,000)
- Email cost: 0.08% of revenue

## Error Handling

- **Retry Logic:** 3 attempts with exponential backoff
- **Failed Emails:** Logged to database for retry
- **Monitoring:** Webhook logs track email status
- **Dead Letter Queue:** Manual review for persistent failures

## Security

- API keys in environment variables only
- No email content logged (privacy)
- Rate limiting per recipient (anti-spam)
- Domain verification required (DKIM/SPF)

## Files Location

```
cuanboss-email-service/
├── src/
│   ├── templates/          # React Email components
│   ├── services/           # Sending logic
│   ├── api/                # Integration helpers
│   └── types/              # TypeScript definitions
├── examples/               # Test scripts
└── docs/                   # Integration guides
```

## Related

- [[CuanBoss]] — Main project
- [[Payment Gateway Integration]] — Webhook triggers
- [[Resend Documentation]] — External API docs (resend.com)

---

*Documented: February 1, 2026 by Wong*
