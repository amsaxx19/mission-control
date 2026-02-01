# Daily Standup System

## Overview

Daily summary of squad activity, sent to Amos every morning. Accountability + visibility without constant monitoring.

## Schedule

**Time:** 07:00 AM Sydney Time (GMT+11)  
**Sender:** Jarvis (Squad Lead)  
**Channel:** Telegram (@amsaxx)  
**Format:** Markdown with emoji sections

## Why It Matters

1. **Visibility:** Amos can't watch Mission Control 24/7
2. **Accountability:** Agents show what they actually delivered
3. **Planning:** What's blocked, what needs review, what's next
4. **Peace of Mind:** One message = full squad status

## Standup Format

```markdown
📊 DAILY STANDUP — February 1, 2026

✅ COMPLETED YESTERDAY
• Friday: Deployed CuanBoss email notification system
• Shuri: Completed TikTok competitor research (ahead of deadline)
• Loki: Delivered landing page copy + content calendar

🔄 IN PROGRESS
• Jarvis: Setting up multi-agent infrastructure (85% complete)
• Friday: Morning briefing automation (script ready, cron pending)

🚫 BLOCKED
• All agents: Cron timeout preventing automated heartbeats
  → Workaround: File-based coordination active

👀 NEEDS REVIEW
• Email system deployment — needs Amos to verify Resend domain
• Multi-agent setup — ready for testing

📝 KEY DECISIONS
• Switched to file-based message bus (more reliable than cron)
• Using Supabase for Mission Control (not Convex)

📅 TODAY'S PRIORITIES
• [ ] Complete multi-agent system documentation
• [ ] Test morning briefing automation
• [ ] Assign tasks to idle agents (Loki, Wong)

---
💡 **Insight:** Shuri's research shows top TikTok creators in Indonesia hit Rp21-45B per day through live shopping. Opportunity for Amos to test this approach.
```

## How It Works

### Step 1: Data Collection (06:55 AM)

Jarvis reads:
1. Each agent's `memory/WORKING.md`
2. `agents/shared/memory/YYYY-MM-DD.md` (yesterday's notes)
3. `agents/shared/MEMORY.md` (key decisions)
4. Mission Control task status
5. Inbox message activity

### Step 2: Compile Summary (06:58 AM)

Jarvis categorizes:
- ✅ What got done yesterday
- 🔄 What's ongoing today
- 🚫 What's blocked
- 👀 What needs Amos's review
- 📝 Key decisions made
- 📅 Today's priorities

### Step 3: Send to Telegram (07:00 AM)

Deliver formatted message to @amsaxx.

## Implementation

### Option 1: Cron Job (Preferred)

```bash
# Add to crontab
0 7 * * * cd /Users/amosthiosa/.openclaw/workspace && node agents/jarvis/scripts/daily-standup.js
```

### Option 2: File-Based Trigger

Create `agents/shared/triggers/send-standup` file at 7 AM.
Jarvis's next heartbeat sees it and sends standup.

### Option 3: Manual

Amos types: `@jarvis send standup`
Jarvis compiles and sends immediately.

## Standup Generator Script

Location: `agents/jarvis/scripts/daily-standup.js`

**What it does:**
1. Reads all agent WORKING.md files
2. Reads yesterday's daily notes
3. Queries Mission Control for task updates
4. Compiles into formatted message
5. Sends via Telegram API

## Standup Checklist for Jarvis

Every morning at 7 AM:

```markdown
## Pre-Standup Checklist

- [ ] Read each agent's WORKING.md
- [ ] Read yesterday's daily notes
- [ ] Check Mission Control for task completions
- [ ] Identify blockers
- [ ] Identify items needing review
- [ ] Extract key decisions from MEMORY.md
- [ ] Compile formatted standup message
- [ ] Send to Amos via Telegram
- [ ] Log standup sent in daily notes
```

## Example Standups

### Day 1: Setup Complete

```markdown
📊 DAILY STANDUP — Feb 1, 2026

✅ COMPLETED TODAY
• Jarvis: Initialized 5-agent system
• Friday: Built email notification service
• Wong: Set up 2nd Brain documentation
• Loki: Created landing page copy

🔄 IN PROGRESS
• Shuri: TikTok competitor research (due tomorrow)
• Jarvis: Mission Control UI development

🚫 BLOCKED
• None

👀 NEEDS REVIEW
• Email templates — check branding

📝 KEY DECISIONS
• Using Supabase (not Convex) for database
• File-based message bus over complex queues

📅 TOMORROW
• Complete Mission Control UI
• Deploy multi-agent system
```

### Day 2: Research Delivered

```markdown
📊 DAILY STANDUP — Feb 2, 2026

✅ COMPLETED YESTERDAY
• Shuri: TikTok competitor analysis delivered
  — Top creators: dr. Richard Lee (Rp41B/day)
  — Opportunity: Live shopping for 100x growth
• Friday: Email system tested and ready

🔄 IN PROGRESS
• Jarvis: Finalizing heartbeat system

🚫 BLOCKED
• Email deployment: Waiting for Amos to verify Resend domain

👀 NEEDS REVIEW
• Shuri's competitor report — strategic insights

📝 KEY DECISIONS
• Shuri recommends testing 2-4 hour live sessions
• Dashboardly tool recommended alongside Kalodata

📅 TODAY
• Test morning briefing automation
• Assign new tasks to Loki and Wong
```

## Special Sections

### 🔥 URGENT
Use when something needs immediate attention:
```markdown
🔥 URGENT
• Friday: Production database issue — needs immediate fix
```

### 📊 METRICS
Include when relevant:
```markdown
📊 METRICS
• TikTok Affiliate: 15-25jt/month (current)
• Potential with live shopping: 100-500jt/month
• Email system: 5 templates ready, 0 cost (Resend free tier)
```

### 🎯 MILESTONES
Track progress toward goals:
```markdown
🎯 MILESTONES
• CuanBoss: 85% complete → Launch target: Feb 15
• Multi-Agent System: 90% complete → Testing today
```

## Troubleshooting

### "No standup received"
- Check if cron is running
- Check Telegram bot connectivity
- Jarvis: Check error logs

### "Standup is empty"
- Agents may not be updating WORKING.md
- Remind squad to log their work
- Check if yesterday's daily notes exist

### "Wrong information"
- Agents need to keep WORKING.md current
- Standup is only as good as the input data
- Enforce "update file after every task" rule

---

## Summary

| Aspect | Details |
|--------|---------|
| **When** | 7:00 AM Sydney Time |
| **Who** | Jarvis sends to Amos |
| **What** | Completed, in-progress, blocked, needs review |
| **Why** | Accountability + visibility + planning |
| **How** | Read files → Compile → Send Telegram |

**Result:** One message every morning = full squad status. No need to check Mission Control constantly.