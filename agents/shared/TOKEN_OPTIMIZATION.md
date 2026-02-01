# Token Optimization Guide

## The Problem

**Current setup (5 agents × every 15 min):**
- 5 agents × 4 heartbeats/hour × 24 hours = **480 heartbeats/day**
- Each heartbeat = 1-2 API calls (read files + respond)
- **~720 API calls/day minimum**

**With GPT-4 class models:**
- Input tokens: ~2k per heartbeat
- 480 × 2k = **960k tokens/day**
- Cost: ~$15-30/day depending on model

## Solutions

### Option 1: Longer Intervals (Recommended)

Change from 15 min to **60 min**:

```diff
- */15 * * * * (every 15 min)
+ 0 * * * * (every hour)
```

**Impact:**
- 480 → 120 heartbeats/day
- **75% cost reduction**
- Still responsive for async work

**Implementation:**
```bash
# Update cron for all agents
cron update <job-id> --schedule "0 * * * *"
```

---

### Option 2: Activity-Based Heartbeats

**Idea:** Only wake agents when there's actual work.

**How it works:**
1. File-based trigger system
2. When new message dropped in inbox → agent wakes
3. No activity = no heartbeat

**Implementation:**
```bash
# Instead of cron, use file watcher
# Create trigger file when work arrives
touch agents/shared/triggers/wake-<agent>

# Agent checks on natural interactions
```

**Impact:**
- Idle days: ~10 heartbeats (manual checks)
- Busy days: ~50-100 heartbeats
- **80-95% cost reduction**

---

### Option 3: Smart Batching

**Idea:** One consolidated heartbeat instead of 5 individual.

**How it works:**
1. Jarvis wakes every 30 min
2. Jarvis checks all agent WORKING.md
3. Jarvis posts ONE consolidated status
4. Other agents only wake when assigned task

**Impact:**
- 480 → 48 heartbeats/day (Jarvis only)
- Plus ~20 for active tasks
- **85% cost reduction**

**Implementation:**
```bash
# Disable individual agent crons
# Keep only Jarvis cron
cron disable shuri
cron disable friday
cron disable loki
cron disable wong

# Jarvis monitors all agents
```

---

### Option 4: Working Hours Only

**Idea:** Agents sleep during off-hours.

**Schedule:**
```cron
# Sydney working hours (9 AM - 6 PM)
*/30 9-18 * * *  # Every 30 min during work hours
```

**Impact:**
- 480 → 90 heartbeats/day
- **80% cost reduction**
- Aligns with Amos's active hours

---

### Option 5: Hybrid Model (Recommended for Amos)

**Combine the best approaches:**

| Agent | Schedule | Reason |
|-------|----------|--------|
| **Jarvis** | Every 30 min | Always needs to coordinate |
| **Friday** | Activity-based | Only when coding tasks |
| **Shuri** | Activity-based | Only when research tasks |
| **Loki** | Activity-based | Only when content tasks |
| **Wong** | Daily at 8 AM | Daily docs check sufficient |

**Impact:**
- Jarvis: 48/day
- Others: ~20/day combined
- **85% cost reduction**
- Still responsive

---

## Recommended Setup for Amos

Given your workflow (TikTok content, CuanBoss dev, research sporadically):

```bash
# Jarvis — Coordinator (frequent)
0,30 * * * *  # Every 30 min

# Friday — Developer (activity-based)
# Wake when: TASK assigned, code review needed
# Manual trigger or file watcher

# Shuri — Researcher (activity-based)
# Wake when: research task assigned

# Loki — Content (working hours)
0 9,12,15,18 * * *  # 4x daily during work hours

# Wong — Docs (daily)
0 8 * * *  # Once daily at 8 AM
```

**Total:** ~70 heartbeats/day
**Savings:** ~85% cost reduction

---

## Quick Implementation

### Step 1: Update Agent Crons

```bash
# Check current jobs
cron list

# Update Jarvis to 30 min
cron update <jarvis-job-id> --schedule "0,30 * * * *"

# Disable others (will use activity-based)
cron disable <shuri-job-id>
cron disable <friday-job-id>
cron disable <loki-job-id>
# Keep Wong at daily
```

### Step 2: Add Activity Triggers

When assigning task, create trigger:

```bash
# In send-message.sh or assignment script
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "agents/shared/triggers/wake-$AGENT"
```

Agent checks for trigger file on wake.

### Step 3: Jarvis Monitors All

Jarvis's heartbeat includes:
1. Check all agent WORKING.md
2. Check for trigger files
3. Post consolidated status
4. Wake specific agents if needed

---

## Cost Comparison

| Approach | Heartbeats/Day | Est. Cost/Month | Responsiveness |
|----------|---------------|-----------------|----------------|
| **Current (15 min)** | 480 | $450-900 | High |
| **60 min intervals** | 120 | $110-225 | Medium |
| **Activity-based** | 20-100 | $20-180 | High (when active) |
| **Hybrid (recommended)** | 70 | $65-130 | High |
| **Working hours only** | 90 | $85-170 | Medium |

*Estimates based on GPT-4 class models. Actual costs vary.*

---

## Bottom Line

**Current:** ~$15-30/day  
**With hybrid:** ~$2-4/day  
**Savings:** ~$400-800/month

**Trade-off:** Less frequent updates when idle, but same responsiveness when active.

Given your usage pattern (bursty, not constant), **hybrid model is optimal**.

---

## Next Steps

1. **Immediate:** Update Jarvis to 30 min, others to activity-based
2. **This week:** Implement trigger file system
3. **Monitor:** Check actual usage for 1 week
4. **Adjust:** Fine-tune based on real patterns

Want me to implement the hybrid model now?