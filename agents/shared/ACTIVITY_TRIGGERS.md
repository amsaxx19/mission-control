# Activity-Based Trigger System

## Overview

Agents wake up when there's work, not on a schedule.

## How It Works

1. When task assigned, create trigger file
2. Agent checks for triggers on natural interactions
3. No trigger = agent stays idle (saves tokens)

## Trigger Files

Location: `agents/shared/triggers/`

### Create Trigger

```bash
# When assigning task to agent
touch agents/shared/triggers/wake-<agent-name>

# Example: Wake Friday for coding task
touch agents/shared/triggers/wake-friday
```

### Agent Response

When agent sees trigger file:
1. Read the trigger
2. Check inbox for new tasks
3. Do the work
4. Delete trigger file when done

## Integration with Message Bus

Add to `send-message.sh`:

```bash
# After sending message, create trigger
if [ -n "$AGENT" ]; then
    touch "agents/shared/triggers/wake-$AGENT"
    echo "[$(date)] Trigger created for $AGENT" >> agents/shared/triggers/trigger.log
fi
```

## Manual Trigger

For urgent tasks:

```bash
# Immediate wake
touch agents/shared/triggers/wake-shuri
echo "URGENT: Need competitor analysis ASAP" > agents/shared/inbox/shuri/URGENT-$(date +%s).md
```

## Current Setup (Hybrid Model)

| Agent | Wake Method | Frequency |
|-------|-------------|-----------|
| **Jarvis** | Cron | Every 60 min |
| **Shuri** | Activity-based | When research task assigned |
| **Friday** | Activity-based | When dev task assigned |
| **Loki** | Activity-based | When content task assigned |
| **Wong** | Activity-based | When docs task assigned |

## Token Savings

**Before (all agents every 15 min):**
- 5 agents × 4/hour × 24 hours = 480 heartbeats/day

**After (hybrid):**
- Jarvis: 24 heartbeats/day
- Others: ~20 heartbeats/day (when active)
- **Total: ~44 heartbeats/day**

**Savings: 90% reduction** 🎉

## Trade-offs

**Pros:**
- Massive token savings
- Agents focus when needed
- No idle processing

**Cons:**
- Slight delay when waking (wait for next check)
- Requires manual trigger for urgent tasks

**Mitigation:**
- Jarvis still checks every hour for coordination
- Manual triggers work instantly
- Daily standup keeps visibility

## Status

✅ Implemented: Feb 1, 2026
✅ Jarvis: 60-min cron active
✅ Other agents: Activity-based (no cron)
✅ Trigger system: Ready for use