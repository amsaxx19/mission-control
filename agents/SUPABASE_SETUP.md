# Mission Control — Supabase Setup

## Quick Setup (2 minutes)

### Step 1: Run SQL in Supabase Dashboard

1. Go to: https://app.supabase.com/project/ohgnjyeqdqahhxewhgwi
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy paste contents of `supabase-schema.sql`
5. Click **Run**

### Step 2: Seed Initial Data

```bash
cd /Users/amosthiosa/.openclaw/workspace/agents
npm install @supabase/supabase-js
node setup-mission-control.js
```

### Step 3: Verify

Check Supabase Table Editor — you should see:
- ✅ agents table (5 agents)
- ✅ tasks table (3 tasks)
- ✅ messages, activities, documents, notifications tables

---

## Tables Created

| Table | Purpose |
|-------|---------|
| `agents` | Agent profiles (Jarvis, Shuri, Friday, Loki, Wong) |
| `tasks` | Task database with status tracking |
| `task_assignees` | Many-to-many task assignments |
| `messages` | Comments on tasks |
| `activities` | Activity feed |
| `documents` | Deliverables and research docs |
| `notifications` | @mentions system |

---

## Real-time Subscriptions

All tables enabled for real-time updates.

Example usage in UI:
```javascript
supabase
  .channel('mission-control')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, callback)
  .subscribe()
```

---

## API Access

**URL:** https://ohgnjyeqdqahhxewhgwi.supabase.co  
**Anon Key:** (already in .env.local)  
**Service Key:** (already in .env.local)

---

## Next Steps

After setup:
1. Update Mission Control UI to use Supabase client
2. Connect agents to read/write from Supabase
3. Enable real-time updates in UI

Done! 🚀