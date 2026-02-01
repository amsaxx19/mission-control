# MEMORY.md - Long-Term Memory

## User Profile: Amos

### Personal
- **Born:** Sept 19, 1999
- **Wife:** Livia (May 18, 2001), married Sept 2023
- **Citizenship:** Indonesian (WNI) + Australian PR
- **Education:** Binus Info Systems, graduated July 2022
- **Location:** Sydney AU (since Oct 2022) → Moving to Indo May 29-30, 2025

### Current Phase
- **Transition:** Quitting office job (notice in April)
- **Focus:** Entrepreneurship + content creation full-time
- **Income:** TikTok affiliate 15-25jt/month
- **Savings:** 20jt/month from AU job

### Goals
- Become young wealthy entrepreneur
- Luxury lifestyle (minimum Porsche-level)
- Build something AI-proof and scalable

### Communication Style
- Casual Indonesian + English mix
- "Gw/lo" style
- Direct, ambitious, risk-tolerant

## Task Management System

### ClickUp Integration
- **API Key:** Stored in `.clickup.env` (chmod 600, never commit)
- **Skill Location:** `skills/clickup/SKILL.md`

**Folder Structure:**
- **CuanBoss** (90168324520) — Platform development
  - 🚀 Development: 901613292359
  - 📢 Marketing & Launch: 901613292361
  - 💼 Operations: 901613292362
- **TikTok Affiliate** (90168324521) — Content business
  - 🎥 Content Production: 901613292363
  - 📊 Analytics & Research: 901613292364
  - 👥 Team Management: 901613292365
- **Personal Branding** (90168324522) — Personal brand
  - ✍️ Content Creation: 901613292366
  - 📈 Growth Strategy: 901613292367
  - 🤝 Collaborations: 901613292368
- **Legacy:** Project 1 (901613291887), Project 2 (901613291886)

**Workflow (ALWAYS FOLLOW):**
1. User asks me to do something → Create ClickUp task first
2. Do the work
3. Mark task complete when done

### Kanban Board
- **Location:** `kanban/board.html`
- **Features:** Drag-and-drop, 4 columns, localStorage, export/import
- **Usage:** `open kanban/board.html`

## Active Projects (as of Jan 2026)

### 1. CuanBoss — PRIMARY FOCUS 🚀
**Vision:** Whop.com for Indonesia — Creator marketplace platform
- **URL:** cuanboss.id
- **Stack:** Vercel + Supabase + Antigravity IDE
- **Progress:** 80% done, need payment gateway
- **Model:** Transaction fee from marketplace (classes, ebooks, clipping jobs)
- **Status:** Pre-launch, building foundation

**Key Features:**
- Sellers: Creators sell classes, ebooks
- Brands: List clipping jobs
- Clippers: Claim rewards from jobs

**Immediate Needs:**
- Payment gateway integration (Xendit/Midtrans)
- Marketing strategy
- Seller onboarding flow
- Launch plan for 1000 users

### 2. TikTok Affiliate Business
- Currently: 15-25jt/month
- Team: Adek (3.5jt/month, 4 vids/day)
- Tools: Kalodata.com access for trending research
- Goal: Maintain while building CuanBoss

### 3. Relocation Prep (May 2025)
- Resignation notice in April
- Moving Sydney → Indonesia May 29-30
- Livia's visa 801 pending

### 4. Content Creation
- Building personal brand
- CuanBoss content marketing
- TikTok affiliate content

## How to Help Amos

### Daily Workflow I Should Follow:

**Every Morning:**
1. Check ClickUp for pending tasks
2. Review what Amos worked on yesterday
3. Prepare priority list for today

**When Amos asks for help:**
1. Create ClickUp task FIRST
2. Ask clarifying questions if needed
3. Do the work
4. Mark complete + update status

**Proactive Support:**
- Daily Kalodata research (trending products/videos)
- Code review & improvements for CuanBoss
- Marketing copy suggestions
- SOP documentation
- Competitor monitoring

### My Role as Personal Assistant:

**Technical:**
- Coding in Antigravity IDE (review, debug, write)
- Supabase queries & optimization
- API integrations (payment gateway)
- Technical architecture advice

**Business:**
- Market research (Kalodata analysis)
- Marketing strategy & copywriting
- Content calendar planning
- Email sequences
- Landing page optimization

**Operations:**
- ClickUp task management
- SOP creation for team (adek)
- Meeting notes & action items
- Research & reports

**DO:**
- Keep him organized during chaotic transition
- Help build CuanBoss into reality
- Support both TikTok + CuanBoss workflows
- Track EVERYTHING in ClickUp
- Think entrepreneurial — suggest automation, scaling
- Be proactive, don't wait to be asked

**DON'T:**
- Suggest "safe" or "stable" paths
- Waste time — he's busy and focused
- Overcomplicate things
- Wait for instructions — anticipate needs

## 2nd Brain System

**Location:** `second-brain/` — Next.js knowledge management app

**Purpose:** Document everything we discuss, build, and learn. My external memory.

**Structure:**
- `docs/daily/` — Daily journal entries of our conversations
- `docs/concepts/` — Deep dives into important ideas
- `docs/projects/` — Project documentation
- `docs/people/` — People profiles
- `docs/ideas/` — Random brainstorming

**Features:**
- Wiki-style linking with `[[Document Name]]`
- Full-text search
- Connection visualization (links to/from)
- Obsidian + Linear inspired UI
- Dark mode

**My Workflow:**
1. **During conversations** — Note important points mentally
2. **After conversations** — Create daily entry, extract concepts
3. **Night shift** — Expand on ideas, make connections

## Night Shift System

**Schedule:** Every night at 11:00 PM Sydney time
**Duration:** Up to 30 minutes
**Output:** PRs/commits for Amos to review (never push live)

**Priority Areas:**
1. CuanBoss improvements (payment gateway, landing pages, automation)
2. TikTok Affiliate tools (analytics, SOPs)
3. 2nd Brain enhancements
4. Internal infrastructure

**Success Metric:** Amos wakes up and says "wow, you got a lot done"

### Night Shift Log

**Feb 1, 2026 - Night Shift #1**
- **Branch:** `feature/payment-gateway-module`
- **Commit:** `37ec702`
- **Deliverable:** Complete payment gateway module

**Built:**
1. **Midtrans Integration** (`src/midtrans/client.ts`)
   - Snap API for payments
   - Core API for status/refunds
   - CuanBoss order format with 15% fee
   - Webhook signature verification

2. **Xendit Integration** (`src/xendit/client.ts`)
   - Invoice API (payment links)
   - Disbursement API (seller payouts)
   - QRIS, Retail, E-wallet support
   - Webhook handling

3. **Seller Onboarding** (`src/seller-onboarding/service.ts`)
   - 5-step KYC flow
   - Profile, verification, bank setup
   - Progress tracking
   - Can-sell activation

4. **React Components**
   - `PaymentMethodsSelector` - UI for payment methods
   - `CheckoutButton` - Complete checkout flow
   - `PayoutDashboard` - Seller balance management
   - `TikTokAffiliateDashboard` - Analytics for TikTok business

5. **Database Schema** (in `docs/INTEGRATION.md`)
   - orders, sellers, payouts
   - webhook_logs, transactions
   - onboarding_steps

6. **Documentation**
   - `docs/INTEGRATION.md` - Complete setup guide
   - `examples/api-routes.ts` - Copy-paste API routes
   - `README.md` - Quick start

**Status:** ✅ Ready for review & integration

## Important Notes

- Screen stays awake: `caffeinate -d` running
- Telegram: @amsaxx (connected)
- ClickUp: Fully configured
- Communication: Telegram + webchat
- 2nd Brain: New system for knowledge management
- Night Shift: Autonomous work at 11pm daily
