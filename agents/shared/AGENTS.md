# AGENTS.md — Operating Manual

**Version:** 1.0  
**Last Updated:** February 1, 2026  
**Owner:** Jarvis (Squad Lead)

---

## Quick Start

**For Amos (Human):**
- Chat with Jarvis directly in Telegram
- Use Mission Control UI to see all tasks
- Check daily standup every morning

**For Agents:**
1. Read your SOUL.md on every wake
2. Check WORKING.md for current task
3. Check Mission Control for assignments
4. Do work or report HEARTBEAT_OK
5. Update files when you learn something

---

## The Team

| Agent | Role | Session Key | Specialty |
|-------|------|-------------|-----------|
| Jarvis | Squad Lead | `agent:main:main` | Coordination |
| Shuri | Product Analyst | `agent:product-analyst:main` | Research & Testing |
| Friday | Developer | `agent:developer:main` | Code & Engineering |
| Loki | Content Writer | `agent:content-writer:main` | Copy & Content |
| Wong | Documentation | `agent:notion-agent:main` | Knowledge Management |

---

## File Structure

```
/workspace/agents/
├── jarvis/              # Squad Lead
│   ├── SOUL.md         # Personality & role
│   └── memory/         # Working memory, daily notes
├── shuri/              # Product Analyst
│   ├── SOUL.md
│   └── memory/
├── friday/             # Developer
│   ├── SOUL.md
│   └── memory/
├── loki/               # Content Writer
│   ├── SOUL.md
│   └── memory/
├── wong/               # Documentation
│   ├── SOUL.md
│   └── memory/
├── shared/             # Team shared resources
│   ├── mission-control/   # Task database
│   └── AGENTS.md         # This file
└── ui/                 # Mission Control UI
```

---

## Communication (Message Bus)

Agents communicate via **file-based message bus** — no database needed.

### How It Works
1. **Send:** Create file in `../shared/inbox/<target-agent>/`
2. **Receive:** Check `../shared/inbox/<agent-name>/` on heartbeat
3. **Archive:** Move processed messages to `../shared/archive/`

### Message Format
```markdown
---
from: Jarvis
to: Shuri
timestamp: 2026-02-01T14:50:00Z
type: task_assignment | question | update | urgent
priority: low | medium | high
---

# Message Title

Content here...

## Action Required
- [ ] Do this
```

### Quick Send Helper
```bash
# Usage: ./send-message.sh <from> <to> <type> <priority> <title>
cd /Users/amosthiosa/.openclaw/workspace/agents/shared
echo "Research competitor X" | ./send-message.sh jarvis shuri task_assignment high "Competitor Analysis Request"
```

### Message Types
| Type | Use When |
|------|----------|
| `task_assignment` | Delegating work |
| `question` | Need clarification |
| `update` | Progress report |
| `urgent` | Immediate attention needed |

---

## Memory System (The Stack)

AI sessions start fresh. No memory of yesterday. We solve this with a **memory stack** — four layers of persistence.

---

### Layer 1: Session Memory (Automatic)
OpenClaw stores conversation history in JSONL files. Agents can reference their own past conversations.

**Location:** `~/.openclaw/agents/main/sessions/`  
**Managed by:** OpenClaw (automatic)  
**Use for:** Searching past conversations, context retrieval

---

### Layer 2: Working Memory (/memory/WORKING.md)
**THE MOST IMPORTANT FILE.** Current task state. Updated constantly.

**Location:** `agents/<agent-name>/memory/WORKING.md`  
**Managed by:** Each agent (you)  
**Use for:** Resuming work after restart, tracking progress

**Template:**
```markdown
# WORKING.md

## Current Task
[What you're working on right now]

## Status
- [x] Completed step 1
- [ ] Working on step 2
- [ ] Step 3 pending

## Context
[Anything needed to resume work]
- Variable names, file paths, decisions made

## Blockers
[Anything blocking progress]

## Next Steps
1. Do X
2. Then Y
3. Finally Z
```

**Rule:** Update this file every time you make progress. "Mental notes" don't survive restarts.

---

### Layer 3: Daily Notes (/memory/YYYY-MM-DD.md)
Raw logs of what happened each day. The "journal" of the squad.

**Location:** `agents/shared/memory/2026-02-01.md`  
**Managed by:** Jarvis (or whoever is active)  
**Use for:** Reviewing what happened, finding when decisions were made

**Format:**
```markdown
# 2026-02-01

## 09:00 UTC
- Started competitor research
- Found 3 key insights
- Blocker: API rate limit

## 14:30 UTC
- Completed analysis
- Posted findings to Mission Control
```

---

### Layer 4: Long-Term Memory (MEMORY.md)
Curated important stuff. Lessons learned, key decisions, stable facts.

**Location:** `agents/shared/MEMORY.md`  
**Managed by:** Wong (Documentation) + Jarvis  
**Use for:** Looking up decisions, avoiding repeated mistakes

**What goes here:**
- Architecture decisions (and why)
- Lessons learned
- Stable facts (API endpoints, credentials)
- Important links

**What does NOT go here:**
- Daily logs (use Daily Notes)
- Temporary tasks (use WORKING.md)
- Conversations (use Session Memory)

---

### The Golden Rule

> **If you want to remember something, WRITE IT TO A FILE.**
> 
> "Mental notes" don't survive session restarts. Files do.

**Examples:**
- ❌ "I'll remember to update that later" → Forgotten
- ✅ "I'll update WORKING.md now" → Remembered

**When someone says "remember this":**
1. Ask: Which memory layer?
2. Working task → WORKING.md
3. Important decision → MEMORY.md
4. Daily context → Daily Notes

---

### Session Memory (Automatic)
- Conversation history stored by OpenClaw
- Each agent has their own history

### Working Memory (/memory/WORKING.md)
**Critical file.** Update constantly.

```markdown
# WORKING.md

## Current Task
[What you're working on now]

## Status
[Progress, blockers, next steps]

## Context
[Anything needed to resume work]
```

### Daily Notes (/memory/YYYY-MM-DD.md)
Log of what happened today.

```markdown
# 2026-02-01

## 09:00 UTC
- Started competitor research
- Found 3 key insights

## 14:30 UTC  
- Completed analysis
- Posted findings to Mission Control
```

### Long-term Memory (MEMORY.md)
Curated important information.
- Key decisions
- Lessons learned
- Stable facts

---

## Mission Control

**Location:** `../shared/mission-control/`

### Task Status

| Status | Meaning |
|--------|---------|
| `inbox` | New, unassigned |
| `assigned` | Has owner, not started |
| `in_progress` | Being worked on |
| `review` | Done, needs approval |
| `done` | Finished |
| `blocked` | Stuck, needs something |

### Communication

**@Mentions:**
- `@jarvis` → Alert Jarvis
- `@friday` → Alert Friday
- `@all` → Alert everyone

**Thread Subscriptions:**
- Comment on a task = subscribed
- Get @mentioned = subscribed
- Assigned to task = subscribed

### Task Format

```markdown
# Task: [Title]

**ID:** TASK-001  
**Status:** in_progress  
**Assignee:** @friday  
**Created:** 2026-02-01  
**Due:** 2026-02-03

## Description
[What needs to be done]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Comments

### @shuri - 2026-02-01 10:00
[Comment text]

### @friday - 2026-02-01 11:00
[Response]
```

---

## Heartbeat System

**Schedule:** Every 15 minutes

| Agent | Minute |
|-------|--------|
| Jarvis | :00 |
| Shuri | :03 |
| Friday | :06 |
| Loki | :09 |
| Wong | :12 |

### Heartbeat Checklist

On wake, every agent:

1. **Read WORKING.md** — Resume current task
2. **Check Mission Control** — New assignments?
3. **Check for @mentions** — Someone needs you?
4. **Scan activity feed** — Relevant discussions?
5. **Take action or stand down**

**If nothing to do:** Reply `HEARTBEAT_OK`

**If work to do:** Do it, then update status

---

## Tools Available

All agents have access to:

- **File system** — Read/write files
- **Shell commands** — Execute commands
- **Web search** — Brave Search API
- **Web fetch** — Read websites
- **Git** — Version control
- **ClickUp** — Task management
- **2nd Brain** — Knowledge base

---

## When to Speak vs Stay Quiet

**Speak when:**
- Directly mentioned or asked
- Assigned a task
- Have important update
- Found a blocker
- Can add genuine value

**Stay quiet (HEARTBEAT_OK) when:**
- Nothing new since last check
- Task is in progress, no update needed
- Someone already answered
- Would just say "working on it"

---

## Heartbeat System

**Schedule:** Every 15 minutes (staggered)

| Agent | Minute | Status |
|-------|--------|--------|
| Jarvis | :00 | ✅ Active |
| Shuri | :03 | ⚠️ File-based fallback |
| Friday | :06 | ⚠️ File-based fallback |
| Loki | :09 | ⚠️ File-based fallback |
| Wong | :12 | ⚠️ File-based fallback |

### Why Heartbeats?

**Problem:** Always-on agents = expensive. Always-off = can't respond.  
**Solution:** Wake every 15 min, check work, sleep.

**Cost savings:** 98% reduction vs always-on.

### What Happens During Heartbeat

1. **Load Context**
   - Read WORKING.md
   - Read daily notes
   - Check session memory

2. **Check Urgent Items**
   - Check inbox for messages
   - Check Mission Control assignments
   - Check @mentions

3. **Scan Activity**
   - Mission Control feed
   - Other agents' status
   - Relevant discussions

4. **Take Action**
   - Do work if found
   - Update WORKING.md
   - Reply to messages
   - Or: HEARTBEAT_OK

**Full protocol:** See `HEARTBEAT.md`

### HEARTBEAT_OK

When nothing needs attention:
```
HEARTBEAT_OK
```

This is GOOD — means no urgent work waiting.

---

## Daily Standup

**Time:** 07:00 AM Sydney Time  
**Channel:** Telegram (@amsaxx)  
**Format:**

```
📊 DAILY STANDUP — Feb 1, 2026

✅ COMPLETED YESTERDAY
• [Agent]: [What was done]

🔄 IN PROGRESS
• [Agent]: [Current task]

🚫 BLOCKED
• [Agent]: [What's blocking]

👀 NEEDS REVIEW
• [Task]: [Link/description]

📝 KEY DECISIONS
• [Decision made]
```

---

## Golden Rules

1. **Write it down** — Mental notes don't survive restarts
2. **Update status** — Keep Mission Control current
3. **Communicate blockers early** — Don't suffer in silence
4. **Trust the team** — Don't micromanage
5. **Results over process** — Ship things that matter

---

## Emergency Contacts

**If system broken:**
1. Check OpenClaw Gateway status
2. Review recent commits
3. Escalate to Jarvis → Amos

**If agent misbehaving:**
1. Check their WORKING.md
2. Review recent heartbeats
3. Restart session if needed

---

*This is how we work. Follow it. Improve it.*