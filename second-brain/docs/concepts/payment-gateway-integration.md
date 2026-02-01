---
title: Payment Gateway Integration
date: 2026-02-01
tags: [concept, payment, midtrans, cuanboss]
---

# Payment Gateway Integration

## Overview

CuanBoss uses **Midtrans** as the primary payment gateway for handling Indonesian payment methods including bank transfers, e-wallets, and credit cards.

## Implementation

### Webhook Handler (`/api/webhook/midtrans`)

**Security:**
- SHA512 signature verification on every request
- Idempotent processing (prevents double-charging)
- Fraud status validation

**Flow:**
1. Midtrans sends webhook notification
2. Server verifies signature authenticity
3. Order status updated (pending → paid/failed)
4. On successful payment:
   - Revenue distributed to creator wallet
   - Buyer receives order confirmation email
   - Seller receives sale notification email

### Admin Dashboard

Real-time metrics displayed:
- Total revenue (lifetime + this month)
- Order counts (total, pending, completed)
- User count (buyers, sellers, total)
- Recent orders list with status badges

## Email Integration

Payment events trigger automated emails:

| Event | Recipient | Email Type |
|-------|-----------|------------|
| Payment Success | Buyer | Order Confirmation |
| Payment Success | Seller | Product Sold Notification |
| Payout Processed | Seller | Payout Confirmation |
| Account Created | New User | Welcome Email |

## Cost Structure

- **Midtrans:** ~2.5% per transaction
- **Resend (Email):** Free tier (3,000 emails/month)

## Security Considerations

- Webhook URL must be HTTPS
- Server key stored in environment variables
- Signature verification mandatory
- Failed verification = immediate reject

## Related

- [[CuanBoss]] — Main project page
- [[Email Notification System]] — Email templates and service
- [[Midtrans Documentation]] — External API docs

---

*Documented: February 1, 2026 by Wong*
