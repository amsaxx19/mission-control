# HEARTBEAT.md — Agent Wake-Up Protocol

## Overview

Agents are NOT always-on (burns API credits). Agents are NOT always-off (can't respond).  
**Solution:** Scheduled heartbeats every 15 minutes.

## Schedule

| Time | Agent | Action |
|------|-------|--------|
| :00 | Jarvis | Wake → Check → Work or HEARTBEAT_OK → Sleep |
| :03 | Shuri | Wake → Check → Work or HEARTBEAT_OK → Sleep |
| :06 | Friday | Wake → Check → Work or HEARTBEAT_OK → Sleep |
| :09 | Loki | Wake → Check → Work or HEARTBEAT_OK → Sleep |
| :12 | Wong | Wake → Check → Work or HEARTBEAT_OK → Sleep |

**Why 15 minutes?**
- Every 5 min = too expensive (agents wake too often)
- Every 30 min = too slow (work waits too long)
- 15 min = perfect balance

---

## Heartbeat Checklist

### Phase 1: Load Context (Always Do This)

```markdown
## On Wake — MUST DO
- [ ] Read `memory/WORKING.md` — What was I doing?
- [ ] Read `memory/YYYY-MM-DD.md` — What happened today?
- [ ] Check session memory if context unclear
```

**Purpose:** Remember who you are and what you're working on.

---

### Phase 2: Check Urgent Items

```markdown
## Urgent Checks
- [ ] Check `../shared/inbox/<your-name>/` — New messages?
- [ ] Check Mission Control — Tasks assigned to me?
- [ ] Check Supabase notifications — @mentions?
```

**If message/assignment found:**
1. Read it
2. Process it (do work or reply)
3. Archive message when done

---

### Phase 3: Scan Activity Feed

```markdown
## Activity Scan
- [ ] Mission Control activity feed — Relevant discussions?
- [ ] Other agents' WORKING.md — Anyone blocked?
- [ ] Daily notes — Decisions that affect my work?
```

**If relevant activity found:**
- Contribute if you have value to add
- Otherwise, just note it for context

---

### Phase 4: Take Action or Stand Down

```markdown
## Decision
**IF** work to do:
  → Do the work
  → Update WORKING.md with progress
  → Send reply if needed
  → Report completion to requestor

**IF** nothing to do:
  → Reply HEARTBEAT_OK
  → Go back to sleep
```

---

## HEARTBEAT_OK Response

When nothing needs attention, agents reply:

```
HEARTBEAT_OK
```

**This means:**
- I'm alive
- I checked everything
- No work to do
- I'll wake again in 15 minutes

---

## Example Heartbeat Flow

### Example 1: Friday (Nothing to do)

```
14:06:00 — Friday wakes up
14:06:01 — Reads WORKING.md: "Monitoring, no active tasks"
14:06:02 — Checks inbox: Empty
14:06:03 — Checks Mission Control: No new assignments
14:06:04 — Scans activity: Nothing relevant
14:06:05 — HEARTBEAT_OK
14:06:06 — Goes back to sleep
```

### Example 2: Shuri (Work to do)

```
14:03:00 — Shuri wakes up
14:03:01 — Reads WORKING.md: "Research TikTok competitors"
14:03:02 — Checks inbox: Message from Jarvis
14:03:03 — Reads message: "Need analysis by tomorrow 12pm"
14:03:04 — Continues research work
14:18:00 — Next heartbeat: Work still in progress
14:33:00 — Next heartbeat: Work complete!
14:33:01 — Updates WORKING.md: "Research done, compiling report"
14:33:02 — Sends message to Jarvis: "Research complete, report attached"
14:33:03 — Archives processed messages
14:33:04 — HEARTBEAT_OK
```

---

## Heartbeat Rules

### Rule 1: Always Load Context First
Never skip reading WORKING.md. You might have been in the middle of something important.

### Rule 2: Process All Messages
If inbox has messages, process them ALL before HEARTBEAT_OK. Don't leave messages unread.

### Rule 3: Update WORKING.md
If you made progress, update WORKING.md immediately. Don't wait.

### Rule 4: Archive When Done
Move processed messages to `../shared/archive/`. Keep inbox clean.

### Rule 5: HEARTBEAT_OK is OK
It's not lazy to report HEARTBEAT_OK. It means the system is working — no urgent work waiting.

---

## Cost Optimization

**Without heartbeats:** Agents always-on = expensive
**With heartbeats:** Agents sleep 96.25% of the time

**Math:**
- 15 min interval = 4 heartbeats/hour
- 24 hours = 96 heartbeats/day
- Each heartbeat = ~30 seconds of processing
- Total: ~48 min of API time per day per agent
- Sleep time: 23 hours 12 minutes

**Result:** 98% cost reduction vs always-on

---

## Troubleshooting

### "I missed a task because I was sleeping"
**Solution:** Tasks wait in inbox. You'll see them on next heartbeat (max 15 min delay).

### "Heartbeat took too long"
**Solution:** If work takes >15 min, next heartbeat will find you still working. That's fine.

### "Multiple heartbeats fired at once"
**Solution:** Check cron schedule. Agents should be staggered by 3 minutes each.

---

## Implementation Notes

**Current Status:**
- ✅ Jarvis heartbeat: Active (every 15 min)
- ✅ Cron schedule: Staggered (:00, :03, :06, :09, :12)
- ⚠️ Other agents: Blocked by cron timeout
- ✅ Workaround: File-based coordination working

**Future:**
- Fix cron timeout to enable all agent heartbeats
- Or: Keep file-based system (proven reliable)

---

*Follow this checklist strictly on every heartbeat.*