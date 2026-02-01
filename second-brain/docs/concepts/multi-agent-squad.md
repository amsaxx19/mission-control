---
title: Multi-Agent AI Squad
date: 2026-02-01
tags: [system, ai-squad, architecture]
---

# Multi-Agent AI Squad

## Overview

A 5-agent autonomous AI system inspired by Bhanu Teja P's architecture, designed to help Amos manage his businesses (CuanBoss, TikTok Affiliate) and personal projects.

## The Squad

| Agent | Role | Specialty |
|-------|------|-----------|
| [[Jarvis]] | Squad Lead | System coordination, task assignment |
| [[Shuri]] | Product Analyst | Research, competitor analysis, data |
| [[Friday]] | Developer | Coding, technical implementation |
| [[Loki]] | Content Writer | Copywriting, marketing, SEO |
| [[Wong]] | Documentation | Knowledge management, 2nd Brain |

## System Architecture

### 1. Session Keys
Each agent has a unique identity:
- `agent:jarvis:main`
- `agent:shuri:main`
- `agent:friday:main`
- `agent:loki:main`
- `agent:wong:main`

### 2. Heartbeat System
- **Schedule:** Every 15 minutes (:00, :15, :30, :45)
- **Protocol:** Wake → Check Mission Control → Act or HEARTBEAT_OK
- **File-based coordination:** More reliable than cron timeouts

### 3. Memory Stack (4 Layers)
1. **Session** — Short-term conversation context
2. **Working** — Agent-specific current work (`WORKING.md`)
3. **Daily** — Date-stamped activity logs
4. **Long-term** — Curated knowledge in 2nd Brain

### 4. Message Bus
- Agents communicate via file-based inbox system
- Location: `agents/shared/inbox/<agent-name>/`
- Format: `YYYYMMDD-HHMMSS-<sender>.md`

### 5. Mission Control
- **Database:** Supabase (real-time updates)
- **UI:** React dashboard for task management
- **Features:** Task status, agent assignments, progress tracking

### 6. Notification System
- @mentions and thread subscriptions
- File-based delivery to inbox
- 15-minute latency (acceptable for async work)

### 7. Daily Standup
- **Time:** 7:00 AM daily
- **Channel:** Telegram
- **Content:** Agent updates, task summaries, blockers

## Key Principles

### Golden Rule
> "If you want to remember something, WRITE IT TO A FILE"

### Task Workflow
1. **Inbox** → New tasks arrive
2. **Assigned** → Agent claims task
3. **In Progress** → Active work
4. **Review** → Quality check
5. **Done** → Archive

### Auto-Subscription
- Comment on task = subscribe to all future updates
- Clear handoffs: What/Next/Who
- Evidence-based claims (screenshots, data, sources)

## Files & Documentation

| Document | Purpose |
|----------|---------|
| `SYSTEM_COMPLETE.md` | Full system overview |
| `THE_SQUAD.md` | Agent roster and personalities |
| `AGENTS.md` | Operating manual |
| `HEARTBEAT.md` | Wake protocol |
| `MESSAGE_BUS.md` | Communication system |
| `NOTIFICATION_SYSTEM.md` | @mentions system |
| `DAILY_STANDUP.md` | Morning reports |
| `TASK_WORKFLOW.md` | Collaboration patterns |

## Status

🟢 **OPERATIONAL** — All 11 parts complete (10 core + Task Workflow)

## Next Actions

1. Sign up Resend.com + verify cuanboss.id domain
2. Test morning briefing (tomorrow 7 AM)
3. Deploy Mission Control UI to Vercel
4. Assign tasks to idle agents (Loki, Wong)

---

*System built: February 1, 2026*
*Architecture by: Bhanu Teja P (inspired)*
*Implementation: AI Assistant + Amos*
