# Example: Business Operations Automation

This example shows how to use the workflow system for automating business operations in CuanBoss.

## Scenario

**Business Need:** Automate repetitive business operations to save time and reduce errors.

**Operations to Automate:**
1. Monthly revenue reporting
2. Customer onboarding emails
3. Failed payment recovery
4. Affiliate payout calculations
5. Usage limit warnings

## Workflow

### Operation 1: Monthly Revenue Reporting

```bash
/design "Design an automated monthly revenue reporting system. Should collect data from Stripe, calculate key metrics (MRR, churn, growth), generate PDF report, and email to stakeholders."
```

```bash
/plan --design="docs/design/revenue-reporting.md"
```

```bash
/implement --plan="docs/plans/revenue-reporting.md"
```

**Generated System:**

```typescript
// Monthly revenue report job
const revenueReportJob = new CronJob('0 9 1 * *', async () => {
  // Runs at 9 AM on 1st of each month
  
  const report = await generateRevenueReport({
    month: previousMonth(),
    includeMetrics: ['mrr', 'arr', 'churn', 'growth', 'ltv'],
    compareToPrevious: true
  });
  
  const pdf = await generatePDF(report);
  
  await sendEmail({
    to: ['amos@cuanboss.com', 'finance@cuanboss.com'],
    subject: `Revenue Report - ${report.month}`,
    attachments: [{ filename: 'revenue-report.pdf', content: pdf }]
  });
});

// Report includes:
// - MRR and growth rate
// - New customers vs churned
// - Revenue by plan tier
// - Top affiliate performers
// - Projections for next month
```

### Operation 2: Customer Onboarding Sequence

```bash
/task "Create automated email sequence for new CuanBoss customers. Emails at: welcome (immediate), getting started guide (day 1), first win tip (day 3), feature highlight (day 7), and check-in (day 14)."
```

**Implementation:**

```typescript
// Onboarding workflow
const onboardingWorkflow = {
  triggers: ['user.signup'],
  
  steps: [
    {
      delay: 0,
      email: 'welcome',
      condition: null
    },
    {
      delay: '1 day',
      email: 'getting-started',
      condition: null
    },
    {
      delay: '3 days',
      email: 'first-win',
      condition: 'no_first_post_scheduled'
    },
    {
      delay: '7 days',
      email: 'feature-highlight',
      condition: null
    },
    {
      delay: '14 days',
      email: 'check-in',
      condition: null,
      action: 'notify_customer_success'
    }
  ]
};
```

### Operation 3: Failed Payment Recovery (Dunning)

```bash
/task "Implement failed payment recovery system (dunning). When payment fails: retry 3 times with backoff, send email notifications at each stage, downgrade account after final failure, and preserve data for 30 days."
```

**Implementation:**

```typescript
// Dunning management
stripe.webhooks.on('invoice.payment_failed', async (event) => {
  const { customer, subscription, attempt_count } = event.data.object;
  
  const dunningFlow = [
    { attempt: 1, delay: '1 day', email: 'payment-failed-1' },
    { attempt: 2, delay: '3 days', email: 'payment-failed-2' },
    { attempt: 3, delay: '5 days', email: 'payment-failed-final' }
  ];
  
  const step = dunningFlow.find(s => s.attempt === attempt_count);
  
  if (step) {
    await scheduleRetry({
      subscription,
      delay: step.delay,
      onRetry: () => attemptPayment(subscription),
      onFailure: () => sendEmail(customer, step.email)
    });
  } else {
    // Final failure - downgrade but preserve data
    await downgradeToFree(subscription);
    await sendEmail(customer, 'account-downgraded');
    await scheduleDataDeletion(subscription, '30 days');
  }
});
```

### Operation 4: Affiliate Payout Calculations

```bash
/task "Build automated affiliate payout system. Calculate commissions based on tier and sales, generate payout reports, support multiple payment methods (PayPal, bank transfer), and handle tax documentation."
```

**Implementation:**

```typescript
// Monthly affiliate payouts
const calculateAffiliatePayouts = async (month: string) => {
  const affiliates = await getActiveAffiliates();
  
  const payouts = await Promise.all(
    affiliates.map(async (affiliate) => {
      const sales = await getMonthlySales(affiliate.id, month);
      const tier = await getAffiliateTier(affiliate.id);
      
      const commission = calculateCommission({
        sales,
        tier,
        baseRate: tier.baseRate,
        bonusThresholds: tier.bonuses
      });
      
      return {
        affiliateId: affiliate.id,
        name: affiliate.name,
        email: affiliate.email,
        paymentMethod: affiliate.paymentMethod,
        sales: sales.total,
        commission: commission.amount,
        taxWithholding: commission.tax,
        netPayout: commission.net,
        status: commission.net > 0 ? 'ready' : 'skipped'
      };
    })
  );
  
  // Generate payout batch
  const batch = await createPayoutBatch(payouts);
  
  // Generate tax documents
  await generate1099s(payouts);
  
  // Send notifications
  await notifyAffiliates(payouts);
  
  return batch;
};
```

### Operation 5: Usage Limit Warnings

```bash
/task "Create usage limit monitoring system. Track API calls, scheduled posts, and team seats. Send warnings at 80% and 100% of limits. Suggest upgrades at appropriate times."
```

**Implementation:**

```typescript
// Usage monitoring
const checkUsageLimits = async (userId: string) => {
  const user = await getUser(userId);
  const limits = PLAN_LIMITS[user.plan];
  const usage = await getCurrentUsage(userId);
  
  const alerts = [];
  
  if (usage.posts / limits.posts > 0.8) {
    alerts.push({
      type: 'warning',
      resource: 'scheduled_posts',
      usage: usage.posts,
      limit: limits.posts,
      message: `You've used ${Math.round(usage.posts/limits.posts*100)}% of your monthly posts`
    });
  }
  
  if (usage.apiCalls / limits.apiCalls > 0.8) {
    alerts.push({
      type: 'warning',
      resource: 'api_calls',
      usage: usage.apiCalls,
      limit: limits.apiCalls,
      message: `Approaching API rate limit`
    });
  }
  
  if (usage.teamSeats / limits.teamSeats > 0.8) {
    alerts.push({
      type: 'upgrade_suggestion',
      resource: 'team_seats',
      currentPlan: user.plan,
      suggestedPlan: getNextTier(user.plan),
      message: 'Need more team members? Upgrade to Pro'
    });
  }
  
  // Send notifications
  for (const alert of alerts) {
    await sendNotification(userId, alert);
    await createInAppAlert(userId, alert);
  }
};

// Run daily
new CronJob('0 0 * * *', () => {
  getActiveUsers().forEach(user => checkUsageLimits(user.id));
});
```

## Automation Dashboard

```bash
/task "Build admin dashboard to monitor all business operations. Include: scheduled job status, recent runs, error logs, manual trigger buttons, and configuration management."
```

**Dashboard Features:**

```typescript
interface AutomationDashboard {
  jobs: {
    name: string;
    schedule: string;
    lastRun: Date;
    nextRun: Date;
    status: 'healthy' | 'warning' | 'error';
    lastError?: string;
    runHistory: RunRecord[];
  }[];
  
  notifications: {
    failedPayments: number;
    pendingPayouts: number;
    usageAlerts: number;
    supportTickets: number;
  };
  
  actions: {
    triggerJob: (jobName: string) => Promise<void>;
    pauseJob: (jobName: string) => Promise<void>;
    updateSchedule: (jobName: string, cron: string) => Promise<void>;
    viewLogs: (jobName: string) => Promise<LogEntry[]>;
  };
}
```

## Integration: All Operations

```bash
/design "Create unified operations automation platform. Central scheduler, shared notification system, unified logging, and configurable workflows."
```

**Architecture:**

```
┌─────────────────────────────────────┐
│      Operations Platform            │
├─────────────────────────────────────┤
│  Scheduler │ Notifications │ Logs   │
└──────┬─────┴───────┬─────────┬─────┘
       │             │         │
   ┌───┴───┐   ┌────┴────┐  ┌─┴─────┐
   │ Jobs  │   │  Email  │  │ Slack │
   └───┬───┘   └────┬────┘  └───┬───┘
       │            │           │
   Revenue Reporting │        Alerts
   Dunning          │        Reports
   Payouts          │
   Usage Monitoring │
```

## Monitoring & Alerting

```bash
/task "Set up monitoring for all automated operations. Alert on: job failures, payment processing errors, API rate limit approaches, and unusual activity patterns."
```

```typescript
// Monitoring setup
const monitors = {
  jobFailures: {
    condition: 'failed_jobs > 0',
    severity: 'high',
    notify: ['slack', 'email']
  },
  
  paymentFailures: {
    condition: 'failed_payments_1h > 10',
    severity: 'critical',
    notify: ['slack', 'pagerduty']
  },
  
  apiRateLimits: {
    condition: 'rate_limit_hits > 100',
    severity: 'medium',
    notify: ['slack']
  },
  
  unusualRevenue: {
    condition: 'daily_revenue < avg * 0.5',
    severity: 'high',
    notify: ['email']
  }
};
```

## Documentation

```bash
/task "Document all business operations. Include: what each job does, when it runs, what it affects, how to troubleshoot, and how to manually intervene if needed."
```

**Operations Runbook:**

```markdown
# CuanBoss Operations Runbook

## Revenue Reporting Job
**Schedule:** 1st of month, 9 AM UTC
**Purpose:** Generate and send monthly revenue report
**Affected Systems:** Stripe, Email, S3

### Troubleshooting
- Check Stripe API status if no data
- Verify email service if reports not sent
- S3 bucket must have write access

### Manual Run
```bash
npm run ops:revenue-report -- --month=2024-01
```

### Rollback
Reports are idempotent - re-running is safe.

---

## Dunning Management
**Trigger:** Stripe webhook `invoice.payment_failed`
**Purpose:** Recover failed payments
**Affected Systems:** Stripe, Email, User accounts

### Troubleshooting
- Check webhook delivery in Stripe dashboard
- Verify email templates are rendering
- Review user account status

### Manual Actions
- Force retry: `POST /admin/dunning/retry`
- Skip to cancellation: `POST /admin/dunning/cancel`

---

## Affiliate Payouts
**Schedule:** 1st of month, 10 AM UTC
**Purpose:** Calculate and process affiliate commissions
**Affected Systems:** Database, PayPal API, Tax system

### Pre-conditions
- Previous month's data finalized
- Tax rates updated
- Payment methods verified

### Troubleshooting
- Check PayPal API status
- Verify tax calculation formulas
- Review flagged transactions

### Manual Process
1. Generate preview: `npm run ops:payouts -- --preview`
2. Review exceptions
3. Approve batch: `npm run ops:payouts -- --approve`
```

## Quick Commands

```bash
# Full operations platform
/implement "Build business operations automation platform with reporting, dunning, payouts, and monitoring"

# Individual operations
/task "Create monthly revenue report job with PDF generation"
/task "Implement failed payment recovery with 3 retry attempts"
/task "Build affiliate payout calculator with tax withholding"

# Troubleshooting
/diagnose "Revenue reports not being generated"
/diagnose "Affiliate payouts showing incorrect amounts"

# Review
/review --code="src/operations/" --security
```

## Best Practices

1. **Idempotency** - Jobs should be safe to re-run
2. **Observability** - Log everything, monitor everything
3. **Graceful failures** - Don't break other operations
4. **Manual overrides** - Always have a way to intervene
5. **Testing** - Test automation in staging first
6. **Documentation** - Document what, when, and why