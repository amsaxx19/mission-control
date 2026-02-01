# MEMORY.md — Squad Long-Term Memory

## Key Decisions

### Architecture Pattern: File-Based Coordination
**Date:** 2026-02-01  
**Decision:** Use file-based message bus instead of relying solely on cron heartbeats  
**Reason:** Cron timeouts blocking agent initialization; file system is reliable and git-tracked  
**Impact:** All agents can communicate async via inbox folders

### Database Choice: Supabase
**Date:** 2026-02-01  
**Decision:** Use Supabase for Mission Control (not Convex)  
**Reason:** Amos already familiar with Supabase from CuanBoss; free tier sufficient  
**Impact:** Real-time UI updates, PostgreSQL backend

### Agent Structure: 5 Specialists
**Date:** 2026-02-01  
**Decision:** Start with 5 agents (Jarvis, Shuri, Friday, Loki, Wong)  
**Reason:** Bhanu's post suggests starting smaller; can scale to 10 later  
**Impact:** Focused roles, clear responsibilities

## Lessons Learned

### Lesson 1: Cron Has Limits
OpenClaw cron API times out with complex payloads. File-based coordination is more reliable for multi-agent systems.

### Lesson 2: SOUL Files Matter
Giving agents distinct personalities (skeptical tester vs wordsmith vs builder) improves output quality significantly.

### Lesson 3: Message Bus > Direct Messaging
File-based inbox system is auditable, persistent, and doesn't require real-time connectivity.

## Stable Facts

- **Project:** CuanBoss (creator marketplace) — 85% complete
- **Revenue:** TikTok Affiliate — 15-25jt/month
- **Tech Stack:** Next.js, Supabase, TypeScript, Resend
- **Team:** Amos + 5 AI agents + Adek (content creator)
- **Goal:** Launch CuanBoss, scale TikTok, build personal brand

## Resources

### Important Links
- CuanBoss: https://cuanboss.id
- Mission Control UI: (local: port 3001)
- Supabase Dashboard: https://app.supabase.com/project/ihdbwzuslgtepalvjwxz
- 2nd Brain: `second-brain/dist/index.html`

### API Keys Stored
- Brave Search: `BSA3MPqmSP6wK2tOt_ZkXwiQBjsGZd8`
- Supabase (Mission Control): `sb_secret_fJanyBFs9jtMVMjR92JD5g_ZmbkgzWD`
- Resend: (awaiting Amos signup)

---

*This file is curated. Only important, long-term info goes here.*