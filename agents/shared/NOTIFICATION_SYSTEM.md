# Notification System

## Overview

How agents get notified of mentions, assignments, and updates — adapted for file-based architecture.

## Original Approach (Bhanu with Convex)

- **@Mentions:** Type @Vision → daemon detects → delivers notification
- **Daemon:** Polls database every 2 seconds
- **Thread Subscriptions:** Auto-subscribe on interaction

## Our Approach (File-Based)

- **@Mentions:** Parse message content → auto-create notification in inbox
- **No Daemon:** Agents check inbox on heartbeat (every 15 min)
- **Thread Subscriptions:** Track subscriptions in files

---

## @Mentions

### How It Works

When composing a message, include @mentions:

```markdown
---
from: Jarvis
to: shuri
timestamp: 2026-02-01T15:00:00Z
type: task_assignment
priority: high
mentions: ["shuri", "friday"]
---

# Research Request

@shuri I need competitor analysis.
@friday Prepare the backend for this feature.

Let me know when you start.
```

### Auto-Routing

The send-message script automatically:
1. Parses `mentions:` field
2. Creates copy in each mentioned agent's inbox
3. Original goes to primary recipient (`to:`)

### Notification Format

```markdown
---
from: Jarvis
to: shuri
timestamp: 2026-02-01T15:00:00Z
type: mention
priority: high
thread: "TASK-003"
---

# You were mentioned

**Jarvis mentioned you in:**
"Research Request" (TASK-003)

**Message:**
"@shuri I need competitor analysis."

**Action:** Reply to Jarvis when you start.

---
[View Full Thread](../shared/threads/TASK-003.md)
```

---

## Thread Subscriptions

### The Problem

5 agents discussing 1 task. Do you @mention all 5 every time? No.

### The Solution

**Auto-subscribe when:**
- You comment on a task
- You get @mentioned
- You get assigned to the task
- You create the task

### Subscription Tracker

File: `agents/shared/subscriptions/<task-id>.md`

```markdown
# Subscriptions: TASK-003

**Task:** Setup Multi-Agent System
**Created:** 2026-02-01

## Subscribers

- [x] Jarvis (creator)
- [x] Shuri (assigned)
- [x] Friday (mentioned)
- [ ] Loki
- [ ] Wong

## Auto-Subscribe Rules

Any comment on this task auto-subscribes the commenter.

## Notifications

When someone comments on this task, notify all subscribers.
```

### Notification Flow

1. Agent posts comment to task
2. System reads subscription file
3. Creates notification in each subscriber's inbox
4. No @mention needed!

---

## Notification Types

| Type | Trigger | Urgency |
|------|---------|---------|
| `mention` | Someone @'d you | High |
| `assignment` | Task assigned to you | High |
| `thread_update` | Subscribed thread has new comment | Medium |
| `deadline` | Task due soon | High |
| `blocker` | Someone blocked on your work | High |
| `completion` | Task you subscribed to is done | Low |

---

## Delivery Mechanism

### No Daemon Needed

Unlike Bhanu's Convex approach (daemon polling every 2 sec), we use **pull-based delivery**:

```
Agent wakes up (heartbeat)
  ↓
Checks inbox folder
  ↓
Processes notifications
  ↓
Does work or HEARTBEAT_OK
  ↓
Sleeps for 15 minutes
```

### Trade-offs

| Approach | Latency | Complexity | Cost |
|----------|---------|------------|------|
| Bhanu (Daemon) | ~2 sec | High (needs pm2) | Medium |
| **Ours (Pull)** | ~15 min max | Low (file system) | Very Low |

**Why 15 min is OK:**
- Most tasks don't need <15 min response
- Urgent? Use @mention + high priority
- Cost savings > speed for most use cases

---

## Implementation

### 1. Send Message with Mentions

```bash
# Using helper script
cd agents/shared
echo "@shuri @friday need your help" | ./send-message.sh \
  jarvis shuri task_assignment high "Multi-Agent Setup"
```

Or manual:
```bash
cat > inbox/shuri/$(date +%Y%m%d-%H%M%S)-jarvis.md << 'EOF'
---
from: Jarvis
to: shuri
mentions: ["shuri", "friday"]
type: task_assignment
priority: high
---

# Multi-Agent Setup

@shuri need research
@friday need backend
EOF

# Copy to mentioned agents
cp inbox/shuri/20260201-150000-jarvis.md inbox/friday/
```

### 2. Check Inbox (On Heartbeat)

```bash
ls inbox/<agent-name>/
```

### 3. Process Notifications

Read each file, act on it, archive when done.

---

## Best Practices

### For Task Creators
- Always @mention assignees
- Set priority appropriately
- Include clear next steps

### For Agents
- Check inbox EVERY heartbeat
- Process high priority first
- Archive when done (don't leave unread)

### For Urgency
- **Low:** No mention, normal message
- **Medium:** @mention in message
- **High:** @mention + `priority: high` + follow up in 15 min

---

## Example Workflows

### Scenario 1: Simple Assignment

1. Jarvis assigns task to Shuri
2. Message goes to `inbox/shuri/`
3. Shuri's next heartbeat: finds message
4. Shuri updates WORKING.md and starts work

### Scenario 2: Thread Discussion

1. Task TASK-003 created, Shuri assigned (auto-subscribed)
2. Friday comments on task
3. System detects comment, reads subscriptions
4. Notification sent to Shuri (subscriber)
5. Shuri sees update on next heartbeat

### Scenario 3: Urgent Blocker

1. Friday hits blocker, sends urgent message
2. `@jarvis URGENT: Need API key`
3. Priority: high
4. Jarvis sees it on next heartbeat (~15 min max)
5. Jarvis resolves or escalates

---

## Summary

| Feature | Implementation |
|---------|---------------|
| @Mentions | Parse `mentions:` field, copy to inbox |
| Delivery | Pull-based (heartbeat check) |
| Thread Subs | Subscription files, auto-notify |
| Latency | Max 15 minutes |
| Cost | Minimal (file ops only) |

**Result:** Simple, reliable, git-tracked notifications without daemon complexity.