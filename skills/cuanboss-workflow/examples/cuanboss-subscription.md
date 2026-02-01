# Example: CuanBoss Subscription System

This example demonstrates the complete workflow for implementing a user subscription system in CuanBoss.

## Scenario

**Business Need:** CuanBoss needs a subscription system to monetize the platform with three tiers (Free, Pro, Enterprise).

**Timeline:** 2 weeks

**Team:** 2 developers

## Complete Workflow

### Step 1: Design

```bash
/design "Design a subscription system for CuanBoss with Free, Pro, and Enterprise tiers. Include Stripe integration for payments, team seats for Enterprise, and usage-based limits for each tier."
```

**Output:**
- `docs/design/subscription-prd.md` - Product requirements
- `docs/design/subscription-tech.md` - Technical specification

### Step 2: Plan

```bash
/plan --design="docs/design/subscription-prd.md" --estimate
```

**Output:**
- `docs/plans/subscription-work-plan.md` - 25 tasks, 80 hours estimated

### Step 3: Implement

```bash
/implement --plan="docs/plans/subscription-work-plan.md"
```

Or execute tasks individually:

```bash
# Week 1: Foundation
/task "Set up database schema for subscriptions with plans, subscriptions, and payments tables"
/task "Integrate Stripe SDK and create customer service"
/task "Create subscription API endpoints (create, update, cancel)"
/task "Build Stripe Checkout integration"
/task "Implement webhook handlers for payment events"

# Week 2: Features
/task "Create subscription management UI"
/task "Add usage tracking and limits enforcement"
/task "Build team seats management for Enterprise"
/task "Implement upgrade/downgrade logic with proration"
/task "Add subscription analytics dashboard"
```

### Step 4: Review

```bash
/review --design="docs/design/subscription-prd.md" --code="src/subscription/" --tests
```

## Key Decisions

### Pricing Tiers

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 1 user, 5 scheduled posts, basic analytics |
| Pro | $29/mo | 1 user, unlimited posts, advanced analytics |
| Enterprise | $99/mo | 5 users, unlimited posts, API access, priority support |

### Technical Decisions

1. **Stripe for Payments** - Industry standard, good API
2. **Proration on upgrade** - Fair billing
3. **End-of-period on downgrade** - Keep premium until paid period ends
4. **Soft delete for subscriptions** - Keep history
5. **Usage counters in Redis** - Fast, reset monthly

## Files Created

```
src/
├── subscription/
│   ├── models/
│   │   ├── plan.ts
│   │   ├── subscription.ts
│   │   └── payment.ts
│   ├── services/
│   │   ├── stripe.ts
│   │   ├── subscription.ts
│   │   └── usage.ts
│   ├── routes/
│   │   ├── subscriptions.ts
│   │   ├── webhooks.ts
│   │   └── usage.ts
│   └── middleware/
│       └── check-subscription.ts
├── components/
│   └── subscription/
│       ├── PricingCards.tsx
│       ├── SubscriptionManager.tsx
│       └── UsageDisplay.tsx
└── tests/
    └── subscription/
        ├── stripe.test.ts
        ├── subscription.test.ts
        └── webhooks.test.ts
```

## Lessons Learned

1. **Webhook handling is critical** - Must be idempotent
2. **Test with Stripe test mode** - Use test cards
3. **Handle edge cases** - Failed payments, disputes
4. **Keep billing simple** - Proration is complex enough
5. **Monitor usage limits** - Enforce at API level

## Next Steps

1. Add annual billing with discount
2. Implement referral program
3. Add invoice history
4. Create admin dashboard for support
5. Add dunning management for failed payments

## Quick Reference

### Common Commands

```bash
# Full implementation
/implement "Add subscription system with Stripe"

# Individual components
/task "Create Stripe webhook handler for subscription events"
/task "Add subscription middleware to protect premium features"
/task "Build pricing page with tier comparison"

# Review
/review --code="src/subscription/" --security
```