# 🎭 AGENT MEMORY FILES

## Struktur Memory System

Setiap agent punya memory file sendiri. Saat di-spawn, mereka baca file ini dulu buat dapet context.

---

## AGENT SQUAD

| Agent | Role | Schedule | File |
|-------|------|----------|------|
| **Loki** | Content Researcher | 09:00 WIB daily | `memory/agents/loki-memory.md` |
| **Shuri** | Product/Market Analyst | 10:00 WIB daily | `memory/agents/shuri-memory.md` |
| **Friday** | Strategist | 11:00 WIB daily | `memory/agents/friday-memory.md` |
| **Wong** | Outreach Specialist | 14:00 WIB daily | `memory/agents/wong-memory.md` |

---

## Daily Research Tasks

### Loki (09:00 WIB) — OpenClaw + TikTok Affiliate Research
- Riset X/Twitter untuk OpenClaw/Clawdbot use cases
- Riset TikTok affiliate strategies
- Document findings dengan screenshots
- Report summary ke main session

### Shuri (10:00 WIB) — Competitor + Market Research
- Riset CuanBoss competitors
- Analyze creator marketplace trends
- Identify viral founder content patterns
- Document market opportunities

### Friday (11:00 WIB) — Strategy Synthesis
- Review Loki & Shuri findings
- Identify strategic opportunities
- Update CuanBoss strategy
- Report strategic insights

### Wong (14:00 WIB) — Outreach Research
- Identify 5 new collab partners daily
- Research creators on X/Twitter
- Document contact methods
- Prepare outreach plans

---

## Cara Kerja

1. **Cron trigger** agent setiap hari sesuai schedule
2. Agent baca memory file + WORKING.md
3. Execute daily research task
4. Update memory file dengan findings
5. Report summary ke main session

## Output Format

Setiap agent wajib:
- [ ] Document findings di memory file (Daily Research Log)
- [ ] Screenshot buat proof
- [ ] Log URLs & sources
- [ ] Report summary ke Telegram/Amos
- [ ] Update Notion database (jika ada)

---

*System created: Feb 2, 2025*  
*Daily research active: Yes*