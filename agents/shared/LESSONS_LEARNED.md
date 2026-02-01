# Lessons Learned — Running a Multi-Agent Squad

Based on Bhanu Teja P's real-world experience + our implementation.

---

## 1. Start Smaller

### What Went Wrong

Bhanu went from 1 to 10 agents too fast. Chaos ensued.

### What We Did Right

Started with **5 agents**, not 10:
- Jarvis (coordinator)
- Shuri (research/testing)
- Friday (developer)
- Loki (content)
- Wong (documentation)

### Why This Works

- Easier to debug when things break
- Clearer communication patterns
- Agents learn the system before scaling
- You understand each agent's quirks

### When to Add More

Add agents when:
- Current squad is consistently at capacity
- Specific expertise gaps emerge
- Workflow is smooth, not chaotic

**Signal to add:** "I wish someone could handle X" happening repeatedly.

---

## 2. Use Cheaper Models for Routine Work

### The Mistake

Running heartbeats on GPT-4 class models = expensive.

### The Fix

**Tier your models:**

| Task Type | Model | Why |
|-----------|-------|-----|
| **Heartbeats** | Cheap/fast (claude-haiku, gpt-3.5) | Just checking status |
| **Research** | Mid-tier (claude-sonnet) | Needs reasoning |
| **Creative work** | Best (claude-opus, gpt-4) | Quality matters |
| **Code** | Code-optimized (kimi-code) | Specialization |

### Example Savings

**Before:**
- All agents on GPT-4 = $15-30/day

**After:**
- Heartbeats: Haiku ($0.50/day)
- Creative: GPT-4 ($5/day)
- **Total: $5-10/day** (70% savings)

### Our Setup

Currently using `kimi-code` for everything (good balance).

**Future optimization:**
```yaml
jarvis_heartbeat:
  model: claude-haiku  # Cheap, fast
  
friday_coding:
  model: kimi-code  # Specialized
  
loki_copywriting:
  model: claude-sonnet  # Creative quality
```

---

## 3. Memory Is Hard

### The Problem

Agents forget. Context windows fill up. Important details get lost.

### The Golden Rule

> **"If you want to remember something, WRITE IT TO A FILE"**

Mental notes don't survive restarts. Files do.

### Our Solution: 4-Layer Memory

```
┌─────────────────────────────────────────┐
│  Layer 1: Session Memory                │
│  (current conversation)                 │
│  Lost when session ends                 │
├─────────────────────────────────────────┤
│  Layer 2: WORKING.md                    │
│  (active task state)                    │
│  Survives restarts                      │
├─────────────────────────────────────────┤
│  Layer 3: Daily Notes                   │
│  (YYYY-MM-DD.md)                        │
│  Day-by-day log                         │
├─────────────────────────────────────────┤
│  Layer 4: MEMORY.md                     │
│  (long-term knowledge)                  │
│  Persistent, curated                    │
└─────────────────────────────────────────┘
```

### What to Write Where

| What | Where | Example |
|------|-------|---------|
| Current task | WORKING.md | "Researching TikTok trends" |
| Daily progress | YYYY-MM-DD.md | "Completed competitor analysis" |
| Key decisions | MEMORY.md | "Chose Supabase over Convex" |
| SOPs | Shared docs | "How to deploy email system" |

### Pre-Compaction Flushes

Before context resets, agents dump important info to `memory/YYYY-MM-DD.md`.

**This saved us multiple times.**

---

## 4. Let Agents Surprise You

### What Happens

Agents sometimes contribute to tasks they weren't assigned.

### Real Example from Bhanu

- Task: Create comparison page
- Assigned: Vision (SEO) + Loki (copy)
- **Fury jumped in** with G2 research
- **Shuri added** UX testing notes
- Result: Better output than planned

### Why This Is Good

- Agents read the activity feed
- They add value where they can
- Cross-pollination of ideas
- Emergent collaboration

### How to Enable It

1. **Public activity feed** — All tasks visible
2. **Auto-subscription** — Comment = follow thread
3. **@mentions** — Can pull in experts
4. **No silos** — Information flows freely

### When to Guide It

If an agent is **too** helpful (distracting from main work):
- Gently redirect
- Or embrace it — maybe they should be assigned

---

## 5. File-Based > Complex Infrastructure

### What We Tried

Cron-based heartbeats for all agents → Timeouts, failures.

### What Worked

File-based coordination:
- Drop message in inbox
- Agent picks up on next wake
- Simple, reliable, debuggable

### Lesson

**Choose reliability over elegance.**

A simple system that works beats a complex system that's broken.

---

## 6. Clear Ownership Matters

### The Problem

When multiple agents could do the work, sometimes nobody does.

### The Fix

**One primary owner per task.**

```markdown
## Roles
- @friday — Primary: Build the feature
- @shuri — Support: Test and review
```

Friday owns it. Shuri helps. No confusion.

---

## 7. Status Updates Are Critical

### The Anti-Pattern

Agent working silently for days → nobody knows progress.

### The Fix

**Heartbeat protocol:**
- Update WORKING.md every session
- Comment on task thread with progress
- HEARTBEAT_OK when idle

**If we don't know status, we assume it's stuck.**

---

## 8. Expect Breakage

### Reality

Things will break. Agents will hallucinate. Tasks will get lost.

### Mitigation

1. **Git history** — Can roll back anything
2. **Daily standups** — Catch issues early
3. **Jarvis monitoring** — Central oversight
4. **Pre-compaction flushes** — Preserve context

---

## 9. Human-in-the-Loop Required

### What Doesn't Work

Full autonomy without oversight. Agents need direction.

### What Works

**You as editor, not writer:**
- Agents do research → You decide strategy
- Agents write drafts → You approve final
- Agents suggest ideas → You pick direction

**The compound effect:** You do 10% of the work, get 100% of the output.

---

## 10. Documentation Saves Future You

### Invest in:

- **AGENTS.md** — How the system works
- **SOUL.md** — Who each agent is
- **TASK_WORKFLOW.md** — How tasks flow
- **MEMORY.md** — What you've learned

**Future you will thank present you.**

---

## Summary: Lessons Applied

| Lesson | How We Applied It |
|--------|-------------------|
| Start small | 5 agents, not 10 |
| Cheaper models | Using kimi-code (balanced cost/quality) |
| Memory is hard | 4-layer system + pre-compaction flushes |
| Let agents surprise | Public activity feed, auto-subscription |
| File-based | Simple inbox system vs complex queues |
| Clear ownership | One primary per task |
| Status updates | WORKING.md + heartbeat protocol |
| Expect breakage | Git + standups + monitoring |
| Human-in-loop | You approve, agents execute |
| Documentation | 12 docs in agents/shared/ |

---

## The Meta-Lesson

> **"Build the system. Run it. Break it. Fix it. Document what you learned."**

Every implementation is different. These lessons are starting points, not rules.

Adapt them to your workflow. Your agents. Your goals.

---

*Documented: February 1, 2026*  
*Based on: Bhanu Teja P's experience + our implementation*