# Mission Control — Supabase Project Setup (NEW PROJECT)

## Step 1: Create New Supabase Project (2 menit)

1. Go to: https://app.supabase.com
2. Click **New Project**
3. **Organization:** (your org)
4. **Project Name:** `amos-ai-squad` (or any name)
5. **Database Password:** (create strong password)
6. **Region:** Singapore (closest to you)
7. Click **Create New Project**

Tunggu 1-2 menit sampe project ready.

---

## Step 2: Get API Keys

Setelah project ready:

1. Go to **Project Settings** (gear icon)
2. Click **API** in sidebar
3. Copy these values:

```
SUPABASE_URL: https://xxxxx.supabase.co
SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
SUPABASE_SERVICE_ROLE_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
```

4. Send ke gw (atau update file `agents/.env.mission-control`)

---

## Step 3: Run SQL Schema

1. Go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy paste contents of `agents/supabase-schema.sql`
4. Click **Run**

---

## Step 4: Seed Data

```bash
cd /Users/amosthiosa/.openclaw/workspace/agents
npm install @supabase/supabase-js
node setup-mission-control.js
```

---

## Done! 🎉

Mission Control sekarang di **project terpisah** dari CuanBoss.

CuanBoss = aman, ga kena otak-atik.