# Task Workflow System

## Task Lifecycle

Tasks move through clear stages from creation to completion.

```
┌─────────┐    ┌───────────┐    ┌─────────────┐    ┌─────────┐    ┌──────┐
│  INBOX  │ →  │ ASSIGNED  │ →  │ IN PROGRESS │ →  │ REVIEW  │ →  │ DONE │
└─────────┘    └───────────┘    └─────────────┘    └─────────┘    └──────┘
     ↑                                                    │
     └────────────────── BLOCKED ←───────────────────────┘
```

## Status Definitions

| Status | Description | Next Action |
|--------|-------------|-------------|
| **Inbox** | New, unassigned | Jarvis assigns to specialist |
| **Assigned** | Has owner, not started | Agent starts work on next heartbeat |
| **In Progress** | Being worked on | Agent updates WORKING.md, delivers output |
| **Review** | Done, needs approval | Amos reviews, approves or requests changes |
| **Done** | Finished | Agent archives task, updates documentation |
| **Blocked** | Stuck, needs something | Escalate to Jarvis/Amos for resolution |

---

## Real Example: Create Competitor Comparison Page

### Day 1: Task Creation

**Jarvis creates task and assigns:**

```markdown
# Task: Create Competitor Comparison Page

**ID:** TASK-007  
**Status:** assigned  
**Assignees:** @vision, @loki  
**Priority:** high  
**Due:** 2026-02-04

## Description
Create comprehensive comparison page for CuanBoss vs competitors.
Target: Whop.com, Gumroad, local Indonesian platforms.

## Roles
- @vision — SEO research, keywords
- @loki — Copywriting, page content

## Acceptance Criteria
- [ ] SEO keyword research complete
- [ ] Competitor analysis (features, pricing, UX)
- [ ] Draft copy with comparison table
- [ ] Review and approval
```

**Notification sent:**
- Message to Vision's inbox
- Message to Loki's inbox
- Both auto-subscribed to thread

---

### Day 1: Vision Starts Research

**Vision receives assignment, posts update:**

```markdown
# Comment on TASK-007

**From:** Vision  
**Time:** 2026-02-01 14:00

SEO research complete.

## Target Keywords
| Keyword | Volume | Difficulty | Priority |
|---------|--------|------------|----------|
| "creator marketplace Indonesia" | 1,200 | Medium | High |
| "sell digital products Indonesia" | 890 | Low | High |
| "platform jual ebook" | 450 | Low | Medium |

## Competitor SEO Analysis
- Whop.com: Ranking for "creator platform" (high competition)
- Local platforms: Weak SEO, opportunity gap

**Next:** Waiting for competitor intel from Fury/Shuri.

@fury @shuri — Need your research when ready.
```

**Status remains:** `in_progress`  
**Subscribers notified:** Loki, Jarvis

---

### Day 1-2: Fury Adds Intel

**Fury sees task in activity feed, contributes:**

```markdown
# Comment on TASK-007

**From:** Fury  
**Time:** 2026-02-02 10:30

Competitor intelligence gathered.

## G2 Review Analysis (50+ reviews)

### Whop.com
**Complaints:**
- "High platform fees (10%)" — 15 mentions
- "Payout delays" — 8 mentions
- "Limited Indonesia support" — 12 mentions

**Praise:**
- "Clean UI" — 20 mentions
- "Good for US creators" — 18 mentions

### Gumroad
**Complaints:**
- "Expensive for high volume" — 22 mentions
- "No local payment methods" — 30+ mentions

**Opportunity:** Both lack strong Indonesia presence.

## Pricing Intelligence
| Platform | Fee | Payout | Local Support |
|----------|-----|--------|---------------|
| Whop | 10% | 7 days | ❌ |
| Gumroad | 10% + processing | 7 days | ❌ |
| **CuanBoss** | **15%** | **3 days** | **✅** |

**Sources:** G2, Trustpilot, Twitter sentiment analysis
```

**Fury auto-subscribed to thread** (by commenting)

---

### Day 2: Shuri Tests UX

**Shuri tests both products, posts findings:**

```markdown
# Comment on TASK-007

**From:** Shuri  
**Time:** 2026-02-02 14:00

UX comparison complete.

## User Flow Analysis

### Whop.com
**Onboarding:**
- 5 steps, 3 min average
- Requires Stripe (Indonesia barrier)
- No local language

**Pain Points:**
- Currency in USD only
- No local payment methods
- Support ticket takes 24-48h

### Gumroad
**Onboarding:**
- 3 steps, 2 min average
- PayPal required (Indonesia limited)
- English only

**Pain Points:**
- No live chat
- Payout minimum $10
- No local tax support

### CuanBoss Advantage
✅ Local language (Bahasa Indonesia)
✅ Local payments (QRIS, Bank Transfer)
✅ Local support (WhatsApp)
✅ Tax compliance (Indonesia ready)

**Evidence:** Screen recordings, time-to-task metrics
```

---

### Day 2: Loki Starts Drafting

**Loki synthesizes all research into copy:**

```markdown
# Comment on TASK-007

**From:** Loki  
**Time:** 2026-02-02 16:00

First draft ready for review.

## Copy Preview

### Headline Options
**A:** "The Creator Marketplace Built for Indonesia"
**B:** "Sell Digital Products. Keep More. Get Paid Faster."
**C:** "Why Indonesian Creators Choose CuanBoss Over Global Platforms"

### Key Angles (from research)
1. **Faster Payouts** — 3 days vs 7 days (Vision's data)
2. **Local Support** — WhatsApp vs Email tickets (Shuri's UX test)
3. **Lower Fees** — After FX fees, CuanBoss wins (Fury's pricing intel)
4. **Local Payments** — QRIS, bank transfer (Shuri's findings)

### Comparison Table
| Feature | CuanBoss | Whop | Gumroad |
|---------|----------|------|---------|
| Payout Speed | 3 days | 7 days | 7 days |
| Indonesia Support | ✅ 24/7 WA | ❌ Ticket | ❌ Ticket |
| Local Language | ✅ Bahasa | ❌ English | ❌ English |
| Local Payment | ✅ QRIS | ❌ Stripe | ❌ PayPal |

**Full draft:** [Link to full document]

@jarvis @vision @fury @shuri — Need your review before final polish.
```

**Status changes to:** `review`  
**All subscribers notified:** Time to review

---

### Day 3: Review & Revision

**Amos reviews, gives feedback:**

> "Great work everyone. @loki use Headline B, emphasize the 3-day payout. @vision add one more keyword about 'jual ebook online'. @fury can you add one more competitor (local one)?"

**Loki revises:**
```markdown
# Comment on TASK-007

**From:** Loki  
**Time:** 2026-02-03 10:00

Revision complete.

**Changes made:**
- ✅ Headline B selected
- ✅ 3-day payout emphasized in hero
- ✅ Local competitor (KaryaKita) added to comparison
- ✅ SEO keywords integrated naturally

**Final copy:** [Link]

Ready for deployment.
```

**Amos approves:**
> "LGTM! Deploy it."

**Status changes to:** `done`

---

### Day 3: Completion

**Loki finalizes:**
- Deploys page to cuanboss.id/comparison
- Updates documentation
- Archives task thread
- Posts completion to activity feed

**Jarvis updates:**
- Daily notes with completion
- Agent stats (Loki: 1 task done today)
- Next standup will show this completion

---

## Key Principles

### 1. One Task, Full History
All discussion happens on ONE task. No scattered DMs or lost context.

### 2. Auto-Subscription
Comment = subscribed. Get all future updates without @mentions.

### 3. Clear Handoffs
Each comment includes:
- What was done
- What's next
- Who's responsible

### 4. Status Transparency
Everyone can see:
- What's being worked on
- Who's blocked
- What needs review

### 5. Evidence-Based
Every claim has receipts:
- Fury: Screenshots, review links
- Shuri: Screen recordings, time metrics
- Vision: Keyword data, search volume

---

## Workflow Commands

### Create Task
```bash
cd agents/shared
cat > threads/TASK-XXX.md << 'EOF'
---
task_id: TASK-XXX
title: "Task Title"
status: inbox
assignees: []
priority: high
created: 2026-02-01
---

# Task Title

## Description
...
EOF
```

### Assign Task
```bash
# Update task file
# Send message to assignee
./send-message.sh jarvis <agent> task_assignment high "Task Title"
```

### Update Status
Edit task file, change `status:` field, save.

### Comment on Task
Post message to task thread. All subscribers notified.

### Complete Task
1. Update status to `done`
2. Archive thread
3. Update daily notes
4. HEARTBEAT_OK

---

## Task Template

```markdown
---
task_id: TASK-XXX
title: "Task Title"
status: inbox | assigned | in_progress | review | done | blocked
assignees: ["agent-name"]
priority: low | medium | high
created: 2026-02-01
due: 2026-02-04
---

# Task Title

## Description
What needs to be done.

## Roles
- @agent1 — Responsibility A
- @agent2 — Responsibility B

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Comments

### @agent — Timestamp
Comment content...
```

---

## Summary

| Stage | Duration | Key Action |
|-------|----------|------------|
| **Inbox** | Hours | Jarvis triages and assigns |
| **Assigned** | Hours-days | Agent acknowledges and starts |
| **In Progress** | Days | Work happens, updates posted |
| **Review** | Hours-days | Feedback, revisions |
| **Done** | — | Complete, archived |

**Result:** Full visibility, clear accountability, preserved history.