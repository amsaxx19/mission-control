# Example: TikTok Affiliate Content Automation

This example shows how to build a TikTok content automation system for affiliate marketers.

## Scenario

**Business Need:** TikTok affiliates spend hours manually posting content. An automation system would save time and increase consistency.

**Key Features:**
- Schedule posts in advance
- Team collaboration with approvals
- Performance analytics
- Auto-posting at optimal times

**Timeline:** 4 weeks

## Complete Workflow

### Phase 1: Design (Week 1)

```bash
/design "Design a TikTok content automation system for affiliate marketers. Features: video upload and scheduling, content calendar, team collaboration with approval workflow, performance analytics, and automated posting."
```

**Output:**
- `docs/design/tiktok-automation-prd.md`
- `docs/design/tiktok-automation-tech.md`

### Phase 2: Plan (Week 1)

```bash
/plan --design="docs/design/tiktok-automation-prd.md"
```

**Generated Plan:**

| Epic | Tasks | Hours |
|------|-------|-------|
| Infrastructure | 6 | 16 |
| Authentication | 3 | 12 |
| Core Features | 10 | 40 |
| Team Features | 6 | 20 |
| Analytics | 5 | 16 |
| Polish | 5 | 16 |
| **Total** | **35** | **120** |

### Phase 3: Implement (Weeks 2-4)

```bash
/implement --plan="docs/plans/tiktok-automation.md"
```

Or task-by-task:

#### Week 2: Foundation

```bash
# Setup
/task "Initialize Node.js/Express backend with TypeScript, ESLint, and testing"
/task "Initialize React frontend with Vite, Tailwind CSS, and routing"
/task "Configure PostgreSQL with Prisma ORM and Redis for caching"
/task "Set up AWS S3 for video storage and GitHub Actions for CI/CD"

# Auth
/task "Implement JWT authentication with access and refresh tokens"
/task "Integrate TikTok OAuth for account connection"
/task "Build authentication UI components"

# Core
/task "Create database schema for scheduled posts with proper indexes"
/task "Implement video upload API with presigned S3 URLs"
/task "Build drag-drop video upload component with progress indicator"
```

#### Week 3: Scheduling & UI

```bash
# Scheduling
/task "Create scheduling API with timezone support and validation"
/task "Build calendar view with scheduled posts and drag-drop rescheduling"
/task "Implement TikTok posting worker with retry logic"
/task "Create post creation form with caption editor and hashtag input"
/task "Build dashboard with stats and recent posts"

# Team
/task "Add team schema and implement team management API"
/task "Build team management interface with member roles"
/task "Implement approval workflow for team posts"
/task "Create approval queue UI for managers"
```

#### Week 4: Analytics & Polish

```bash
# Analytics
/task "Create analytics schema and implement metrics collection from TikTok API"
/task "Build analytics API with overview and export functionality"
/task "Create analytics dashboard with charts and performance metrics"

# Polish
/task "Add mobile responsiveness to all components"
/task "Implement global error handling and toast notifications"
/task "Add rate limiting and security headers"
/task "Write comprehensive documentation and API reference"
```

### Phase 4: Review & Launch

```bash
/review --design="docs/design/tiktok-automation-prd.md" --code="src/" --tests --security
```

## Architecture Overview

```
Frontend (React + Tailwind)
    ↕
API Gateway (Express)
    ↕
┌──────────┬──────────┬──────────┐
│  Upload  │ Schedule │Analytics │
│  Service │ Service  │ Service  │
└────┬─────┘────┬─────┘────┬─────┘
     │          │          │
     ▼          ▼          ▼
   AWS S3    PostgreSQL   Redis
     │       (metadata)   (cache)
     │          │
     └──────────┼──────────┘
                ▼
           TikTok API
```

## Key Features Implementation

### Video Upload

```typescript
// Upload flow
1. User selects video → Frontend
2. Request presigned URL → Backend
3. Upload directly to S3 ← Frontend
4. Confirm upload → Backend
5. Store metadata in DB
6. Generate thumbnail
```

### Scheduling Engine

```typescript
// Bull queue setup
const postQueue = new Bull('post-queue', redis);

// Schedule job
await postQueue.add(
  { postId: '123' },
  { 
    delay: scheduledTime - Date.now(),
    attempts: 3,
    backoff: 'exponential'
  }
);

// Worker processing
postQueue.process(async (job) => {
  const post = await getPost(job.data.postId);
  await publishToTikTok(post);
  await updatePostStatus(post.id, 'posted');
});
```

### Team Approval Flow

```
Creator submits post
        ↓
  Status: PENDING_APPROVAL
        ↓
Manager receives notification
        ↓
  ├─ Approve → Status: SCHEDULED
  └─ Reject → Status: REJECTED (with feedback)
```

## Database Schema Highlights

```sql
-- Posts table
CREATE TABLE scheduled_posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  team_id UUID REFERENCES teams(id),
  video_url VARCHAR(500) NOT NULL,
  caption TEXT,
  hashtags TEXT[],
  scheduled_at TIMESTAMP NOT NULL,
  timezone VARCHAR(50),
  status VARCHAR(20), -- draft, pending_approval, scheduled, posted, failed
  approval_status VARCHAR(20), -- not_required, pending, approved, rejected
  tiktok_post_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics table
CREATE TABLE post_analytics (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES scheduled_posts(id),
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  last_synced_at TIMESTAMP
);
```

## User Workflows

### Individual Affiliate Workflow

1. **Connect TikTok** - OAuth authorization
2. **Upload Video** - Drag-drop or select file
3. **Add Details** - Caption, hashtags, thumbnail
4. **Schedule** - Pick date/time with timezone
5. **View Calendar** - See all scheduled content
6. **Track Performance** - View analytics after posting

### Team Workflow

1. **Create Team** - Invite members
2. **Set Roles** - Admin, Manager, Creator
3. **Submit for Approval** - Creator submits post
4. **Review Queue** - Manager reviews pending posts
5. **Approve/Reject** - With feedback
6. **Auto-publish** - Approved posts schedule automatically

## API Endpoints

```
POST   /api/v1/upload/presigned-url
POST   /api/v1/upload/complete

POST   /api/v1/posts
GET    /api/v1/posts
GET    /api/v1/posts/:id
PATCH  /api/v1/posts/:id
DELETE /api/v1/posts/:id
POST   /api/v1/posts/:id/schedule

GET    /api/v1/calendar?start=2024-01-01&end=2024-01-31

GET    /api/v1/teams
POST   /api/v1/teams
POST   /api/v1/teams/:id/members
POST   /api/v1/approvals/:id/approve

GET    /api/v1/analytics/overview
GET    /api/v1/analytics/posts
GET    /api/v1/analytics/export
```

## Testing Strategy

```bash
# Unit tests
npm test -- auth.test.ts
npm test -- posts.test.ts
npm test -- scheduler.test.ts

# Integration tests
npm test -- integration/upload.test.ts
npm test -- integration/schedule.test.ts

# E2E tests
npx playwright test e2e/schedule.spec.ts
```

## Lessons Learned

1. **TikTok API limitations** - Research capabilities early
2. **Video processing** - Generate thumbnails server-side
3. **Timezone handling** - Store in UTC, display in local
4. **Queue reliability** - Monitor and alert on failures
5. **Rate limiting** - TikTok has strict limits

## Quick Commands

```bash
# Full build
/implement "TikTok content automation with team features"

# Individual features
/task "Add TikTok OAuth integration"
/task "Create Bull queue for post scheduling"
/task "Build calendar component with drag-drop"

# Debug
/diagnose "Scheduled posts not publishing"

# Review
/review --code="src/scheduler/" --security
```