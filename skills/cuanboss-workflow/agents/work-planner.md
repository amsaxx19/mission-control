# Work Planner Agent

Generates detailed, actionable work plans from requirements or designs.

## Purpose

Breaks down features into sequenced, estimated tasks that can be executed by developers or agents.

## When to Use

- After design is complete
- Before starting implementation
- For sprint planning
- When delegating work
- For project estimation

## Capabilities

### 1. Task Breakdown

Decomposes work into:
- Specific, actionable tasks
- Clear acceptance criteria
- Estimated effort
- Dependencies
- File references

### 2. Sequencing

Orders tasks by:
- Dependencies (what blocks what)
- Priority (must-have vs nice-to-have)
- Logic (foundation before features)
- Risk (hard stuff first)

### 3. Estimation

Provides effort estimates:
- Hours for each task
- Total project duration
- Critical path identification
- Buffer for unknowns

### 4. Organization

Groups tasks by:
- Epic/Feature
- Component
- Phase/Milestone
- Assignee

## Input/Output

### Input

```markdown
## Design: TikTok Scheduler

### Technical Spec Excerpt
- Database: PostgreSQL with tables for posts, teams, analytics
- API: REST with Express, JWT auth
- Frontend: React with calendar view
- Integrations: TikTok API, AWS S3
- Features: Upload, schedule, team approval, analytics
```

### Output

```markdown
# Work Plan: TikTok Content Scheduler
**Estimated Duration: 4 weeks (160 hours)**

---

## Epic 1: Project Setup & Infrastructure (16h)

### T-001: Initialize Backend Project
**Duration:** 2h | **Dependencies:** None | **Agent:** task-executor

**Description:**
Set up Node.js/TypeScript project with Express, configure linting, testing, and development environment.

**Tasks:**
- [ ] Initialize npm project with TypeScript
- [ ] Configure ESLint + Prettier
- [ ] Set up Jest for testing
- [ ] Create folder structure (src/routes, src/models, src/services)
- [ ] Add development scripts (dev, test, build)
- [ ] Create .env.example

**Acceptance Criteria:**
- [ ] `npm run dev` starts server
- [ ] `npm test` runs tests
- [ ] `npm run build` compiles TypeScript
- [ ] Project follows folder structure conventions

**Files to Create:**
- `package.json`
- `tsconfig.json`
- `.eslintrc.js`
- `.prettierrc`
- `jest.config.js`
- `src/index.ts`
- `src/app.ts`
- `.env.example`

---

### T-002: Initialize Frontend Project
**Duration:** 2h | **Dependencies:** None | **Agent:** task-executor

**Description:**
Set up React project with TypeScript, Tailwind CSS, and routing.

**Tasks:**
- [ ] Create React app with Vite + TypeScript
- [ ] Configure Tailwind CSS
- [ ] Set up React Router
- [ ] Configure Vitest for testing
- [ ] Add Axios for API calls
- [ ] Create folder structure

**Acceptance Criteria:**
- [ ] `npm run dev` starts dev server
- [ ] Tailwind classes work
- [ ] Routing configured
- [ ] Example test passes

**Files to Create:**
- `package.json`
- `vite.config.ts`
- `tailwind.config.js`
- `src/main.tsx`
- `src/App.tsx`
- `src/router.tsx`

---

### T-003: Configure Database
**Duration:** 3h | **Dependencies:** T-001 | **Agent:** task-executor

**Description:**
Set up PostgreSQL with Prisma ORM, create initial schema and migrations.

**Tasks:**
- [ ] Install Prisma
- [ ] Initialize Prisma schema
- [ ] Configure database connection
- [ ] Create user table migration
- [ ] Set up migration scripts
- [ ] Add seed data for development

**Acceptance Criteria:**
- [ ] `npx prisma migrate dev` works
- [ ] `npx prisma db seed` populates data
- [ ] Database connection successful
- [ ] TypeScript types generated

**Files to Create:**
- `prisma/schema.prisma`
- `prisma/migrations/`
- `prisma/seed.ts`

---

### T-004: Set up Redis & Queue
**Duration:** 2h | **Dependencies:** T-001 | **Agent:** task-executor

**Description:**
Configure Redis for caching and Bull for job queues.

**Tasks:**
- [ ] Install Bull and ioredis
- [ ] Configure Redis connection
- [ ] Create queue service abstraction
- [ ] Add queue monitoring
- [ ] Test queue job processing

**Acceptance Criteria:**
- [ ] Redis connection successful
- [ ] Jobs can be added to queue
- [ ] Workers process jobs
- [ ] Failed jobs are retried

**Files to Create:**
- `src/config/redis.ts`
- `src/services/queue.ts`
- `src/workers/scheduler.ts`

---

### T-005: Configure AWS S3
**Duration:** 2h | **Dependencies:** T-001 | **Agent:** task-executor

**Description:**
Set up S3 bucket and SDK for video storage.

**Tasks:**
- [ ] Create S3 bucket with CORS
- [ ] Configure IAM permissions
- [ ] Install AWS SDK
- [ ] Create upload service
- [ ] Generate presigned URLs

**Acceptance Criteria:**
- [ ] S3 bucket accessible
- [ ] Presigned URLs generated
- [ ] Files can be uploaded
- [ ] CORS configured correctly

**Files to Create:**
- `src/config/s3.ts`
- `src/services/upload.ts`

---

### T-006: Set up CI/CD
**Duration:** 3h | **Dependencies:** T-001, T-002 | **Agent:** task-executor

**Description:**
Create GitHub Actions workflow for testing and deployment.

**Tasks:**
- [ ] Create test workflow
- [ ] Create build workflow
- [ ] Configure deployment to staging
- [ ] Add status checks
- [ ] Set up secrets

**Acceptance Criteria:**
- [ ] Tests run on PR
- [ ] Build succeeds
- [ ] Deployment to staging works
- [ ] Status checks required

**Files to Create:**
- `.github/workflows/test.yml`
- `.github/workflows/deploy.yml`
- `docker-compose.yml`

---

## Epic 2: Authentication (12h)

### T-007: Implement JWT Authentication
**Duration:** 3h | **Dependencies:** T-001, T-003 | **Agent:** task-executor

**Description:**
Create JWT-based authentication system with access and refresh tokens.

**Tasks:**
- [ ] Install JWT libraries
- [ ] Create auth service
- [ ] Implement login endpoint
- [ ] Implement token refresh
- [ ] Create auth middleware
- [ ] Add logout functionality

**Acceptance Criteria:**
- [ ] Login returns tokens
- [ ] Middleware validates tokens
- [ ] Refresh works with valid token
- [ ] Logout invalidates tokens

**Files to Create:**
- `src/services/auth.ts`
- `src/middleware/auth.ts`
- `src/routes/auth.ts`

---

### T-008: Integrate TikTok OAuth
**Duration:** 4h | **Dependencies:** T-007 | **Agent:** task-executor

**Description:**
Implement TikTok OAuth flow for connecting accounts.

**Tasks:**
- [ ] Register TikTok app
- [ ] Create OAuth routes
- [ ] Handle OAuth callback
- [ ] Store access tokens
- [ ] Refresh tokens automatically
- [ ] Handle errors

**Acceptance Criteria:**
- [ ] OAuth flow completes
- [ ] Tokens stored securely
- [ ] Account linking works
- [ ] Token refresh automatic

**Files to Create:**
- `src/services/tiktok.ts`
- `src/routes/oauth.ts`

---

### T-009: Build Auth UI
**Duration:** 3h | **Dependencies:** T-002, T-008 | **Agent:** task-executor

**Description:**
Create login and account connection UI components.

**Tasks:**
- [ ] Create login form
- [ ] Create TikTok connect button
- [ ] Handle auth state
- [ ] Add protected route wrapper
- [ ] Create logout button

**Acceptance Criteria:**
- [ ] Login form submits to API
- [ ] TikTok OAuth opens popup
- [ ] Auth state persists
- [ ] Protected routes redirect

**Files to Create:**
- `src/components/LoginForm.tsx`
- `src/components/TikTokConnect.tsx`
- `src/hooks/useAuth.ts`
- `src/components/ProtectedRoute.tsx`

---

## Epic 3: Core Features (40h)

### T-010: Create Post Database Schema
**Duration:** 2h | **Dependencies:** T-003 | **Agent:** task-executor

**Description:**
Add scheduled_posts table to database schema.

**Tasks:**
- [ ] Define Post model in Prisma
- [ ] Create migration
- [ ] Add indexes
- [ ] Generate types
- [ ] Add seed data

**Acceptance Criteria:**
- [ ] Migration runs successfully
- [ ] Table created with indexes
- [ ] TypeScript types available

**Files to Modify:**
- `prisma/schema.prisma`

---

### T-011: Implement Video Upload API
**Duration:** 3h | **Dependencies:** T-005, T-010 | **Agent:** task-executor

**Description:**
Create API for video upload with presigned URLs.

**Tasks:**
- [ ] Create upload endpoint
- [ ] Generate presigned URL
- [ ] Handle upload completion
- [ ] Validate file type/size
- [ ] Store metadata

**Acceptance Criteria:**
- [ ] Presigned URL generated
- [ ] Upload to S3 works
- [ ] Metadata stored in DB
- [ ] Validation rejects bad files

**Files to Create:**
- `src/routes/upload.ts`
- `src/services/video.ts`

---

### T-012: Build Video Upload UI
**Duration:** 4h | **Dependencies:** T-009, T-011 | **Agent:** task-executor

**Description:**
Create drag-drop video upload component with progress.

**Tasks:**
- [ ] Create upload component
- [ ] Add drag-drop support
- [ ] Show upload progress
- [ ] Generate thumbnail preview
- [ ] Handle errors

**Acceptance Criteria:**
- [ ] Drag-drop works
- [ ] Progress shown
- [ ] Thumbnail generated
- [ ] Errors displayed

**Files to Create:**
- `src/components/VideoUpload.tsx`
- `src/hooks/useUpload.ts`

---

### T-013: Implement Scheduling API
**Duration:** 4h | **Dependencies:** T-010, T-004 | **Agent:** task-executor

**Description:**
Create API endpoints for post scheduling and management.

**Tasks:**
- [ ] Create post CRUD endpoints
- [ ] Validate schedule times
- [ ] Add posts to queue
- [ ] Handle timezone
- [ ] Implement cancellation

**Acceptance Criteria:**
- [ ] Posts can be created
- [ ] Validation works
- [ ] Jobs added to queue
- [ ] Timezone handled
- [ ] Cancellation works

**Files to Create:**
- `src/routes/posts.ts`
- `src/services/scheduler.ts`

---

### T-014: Build Calendar UI
**Duration:** 5h | **Dependencies:** T-012, T-013 | **Agent:** task-executor

**Description:**
Create calendar view for scheduled posts.

**Tasks:**
- [ ] Install calendar library
- [ ] Fetch posts for date range
- [ ] Display posts on calendar
- [ ] Add drag-drop rescheduling
- [ ] Show post details on click

**Acceptance Criteria:**
- [ ] Calendar renders
- [ ] Posts displayed correctly
- [ ] Date range works
- [ ] Rescheduling works

**Files to Create:**
- `src/components/Calendar.tsx`
- `src/components/PostCard.tsx`
- `src/hooks/useCalendar.ts`

---

### T-015: Implement TikTok Posting Worker
**Duration:** 4h | **Dependencies:** T-004, T-008, T-013 | **Agent:** task-executor

**Description:**
Create worker that processes scheduled posts and publishes to TikTok.

**Tasks:**
- [ ] Create posting worker
- [ ] Integrate TikTok API
- [ ] Handle success/failure
- [ ] Implement retry logic
- [ ] Update post status

**Acceptance Criteria:**
- [ ] Worker processes queue
- [ ] TikTok API called
- [ ] Success updates status
- [ ] Failures retried
- [ ] Errors logged

**Files to Create:**
- `src/workers/posting.ts`
- `src/services/tiktok-api.ts`

---

### T-016: Create Post Creation Form
**Duration:** 4h | **Dependencies:** T-012, T-013 | **Agent:** task-executor

**Description:**
Build form for creating and editing posts with caption, hashtags, schedule.

**Tasks:**
- [ ] Create post form component
- [ ] Add caption editor
- [ ] Add hashtag input
- [ ] Add schedule datetime picker
- [ ] Add timezone selector
- [ ] Handle form submission

**Acceptance Criteria:**
- [ ] Form validates inputs
- [ ] Caption editor works
- [ ] Hashtags formatted
- [ ] Schedule validated
- [ ] Submission creates post

**Files to Create:**
- `src/components/PostForm.tsx`
- `src/components/HashtagInput.tsx`

---

### T-017: Build Dashboard
**Duration:** 4h | **Dependencies:** T-014, T-016 | **Agent:** task-executor

**Description:**
Create main dashboard with stats and recent posts.

**Tasks:**
- [ ] Create dashboard layout
- [ ] Show stats cards
- [ ] List recent posts
- [ ] Add quick actions
- [ ] Fetch dashboard data

**Acceptance Criteria:**
- [ ] Stats display correctly
- [ ] Recent posts shown
- [ ] Quick actions work
- [ ] Data refreshes

**Files to Create:**
- `src/pages/Dashboard.tsx`
- `src/components/StatCard.tsx`

---

### T-018: Add Error Handling & Notifications
**Duration:** 3h | **Dependencies:** T-017 | **Agent:** task-executor

**Description:**
Implement global error handling and toast notifications.

**Tasks:**
- [ ] Create error boundary
- [ ] Add toast notification system
- [ ] Handle API errors
- [ ] Show user-friendly messages
- [ ] Log errors for debugging

**Acceptance Criteria:**
- [ ] Errors caught gracefully
- [ ] Toasts displayed
- [ ] API errors handled
- [ ] Messages clear

**Files to Create:**
- `src/components/ErrorBoundary.tsx`
- `src/components/Toast.tsx`
- `src/hooks/useToast.ts`

---

### T-019: Write API Tests
**Duration:** 3h | **Dependencies:** T-013 | **Agent:** task-executor

**Description:**
Write comprehensive tests for API endpoints.

**Tasks:**
- [ ] Set up test database
- [ ] Test post CRUD
- [ ] Test scheduling logic
- [ ] Test auth middleware
- [ ] Test validation

**Acceptance Criteria:**
- [ ] All endpoints tested
- [ ] Auth scenarios covered
- [ ] Validation tested
- [ ] >80% coverage

**Files to Create:**
- `tests/posts.test.ts`
- `tests/auth.test.ts`

---

## Epic 4: Team Features (20h)

### T-020: Create Team Schema
**Duration:** 2h | **Dependencies:** T-003 | **Agent:** task-executor

**Description:**
Add teams and memberships tables.

**Tasks:**
- [ ] Define Team model
- [ ] Define TeamMember model
- [ ] Create migration
- [ ] Add relationships

**Acceptance Criteria:**
- [ ] Tables created
- [ ] Relations defined
- [ ] Types generated

**Files to Modify:**
- `prisma/schema.prisma`

---

### T-021: Implement Team API
**Duration:** 3h | **Dependencies:** T-020 | **Agent:** task-executor

**Description:**
Create team management endpoints.

**Tasks:**
- [ ] CRUD team endpoints
- [ ] Member management
- [ ] Role-based permissions
- [ ] Invite system

**Acceptance Criteria:**
- [ ] Teams can be created
- [ ] Members added/removed
- [ ] Roles enforced
- [ ] Invites work

**Files to Create:**
- `src/routes/teams.ts`
- `src/services/teams.ts`

---

### T-022: Build Team UI
**Duration:** 4h | **Dependencies:** T-021 | **Agent:** task-executor

**Description:**
Create team management interface.

**Tasks:**
- [ ] Team settings page
- [ ] Member list component
- [ ] Invite form
- [ ] Role selector

**Acceptance Criteria:**
- [ ] Team settings editable
- [ ] Members displayed
- [ ] Invites sent
- [ ] Roles changed

**Files to Create:**
- `src/pages/TeamSettings.tsx`
- `src/components/MemberList.tsx`

---

### T-023: Implement Approval Workflow
**Duration:** 4h | **Dependencies:** T-013, T-021 | **Agent:** task-executor

**Description:**
Add approval workflow for team posts.

**Tasks:**
- [ ] Add approval status to posts
- [ ] Create approval endpoints
- [ ] Enforce workflow logic
- [ ] Add notifications

**Acceptance Criteria:**
- [ ] Posts can be submitted
- [ ] Approvers notified
- [ ] Approval/rejection works
- [ ] Workflow enforced

**Files to Create:**
- `src/services/approval.ts`
- `src/routes/approvals.ts`

---

### T-024: Build Approval Queue UI
**Duration:** 3h | **Dependencies:** T-023 | **Agent:** task-executor

**Description:**
Create interface for reviewing and approving posts.

**Tasks:**
- [ ] Approval queue page
- [ ] Post review component
- [ ] Approve/reject actions
- [ ] Feedback input

**Acceptance Criteria:**
- [ ] Queue displays posts
- [ ] Posts reviewable
- [ ] Actions work
- [ ] Feedback recorded

**Files to Create:**
- `src/pages/ApprovalQueue.tsx`
- `src/components/ApprovalCard.tsx`

---

### T-025: Add Activity Logging
**Duration:** 2h | **Dependencies:** T-021 | **Agent:** task-executor

**Description:**
Implement activity tracking for teams.

**Tasks:**
- [ ] Create activity log table
- [ ] Log key actions
- [ ] Create activity feed API
- [ ] Build activity feed UI

**Acceptance Criteria:**
- [ ] Activities logged
- [ ] API returns feed
- [ ] UI displays feed

**Files to Create:**
- `src/services/activity.ts`
- `src/components/ActivityFeed.tsx`

---

## Epic 5: Analytics (16h)

### T-026: Create Analytics Schema
**Duration:** 2h | **Dependencies:** T-003 | **Agent:** task-executor

**Description:**
Add analytics tables for metrics.

**Tasks:**
- [ ] Define Analytics model
- [ ] Create migration
- [ ] Add indexes

**Files to Modify:**
- `prisma/schema.prisma`

---

### T-027: Implement Metrics Collection
**Duration:** 3h | **Dependencies:** T-026, T-015 | **Agent:** task-executor

**Description:**
Collect metrics from TikTok API.

**Tasks:**
- [ ] Create metrics sync job
- [ ] Fetch TikTok stats
- [ ] Store metrics
- [ ] Schedule periodic sync

**Files to Create:**
- `src/workers/metrics-sync.ts`

---

### T-028: Build Analytics API
**Duration:** 3h | **Dependencies:** T-027 | **Agent:** task-executor

**Description:**
Create endpoints for analytics data.

**Tasks:**
- [ ] Overview endpoint
- [ ] Post metrics endpoint
- [ ] Best times endpoint
- [ ] Export functionality

**Files to Create:**
- `src/routes/analytics.ts`
- `src/services/analytics.ts`

---

### T-029: Build Analytics Dashboard
**Duration:** 5h | **Dependencies:** T-028 | **Agent:** task-executor

**Description:**
Create analytics visualization dashboard.

**Tasks:**
- [ ] Install chart library
- [ ] Create overview charts
- [ ] Build post performance table
- [ ] Add date range filter
- [ ] Implement export

**Files to Create:**
- `src/pages/Analytics.tsx`
- `src/components/Charts.tsx`
- `src/components/MetricsTable.tsx`

---

### T-030: Add Reporting
**Duration:** 2h | **Dependencies:** T-028 | **Agent:** task-executor

**Description:**
Implement report generation and scheduling.

**Tasks:**
- [ ] Create report templates
- [ ] Generate PDF reports
- [ ] Email scheduled reports
- [ ] Store report history

**Files to Create:**
- `src/services/reports.ts`

---

## Epic 6: Polish & Launch (16h)

### T-031: Add Mobile Responsiveness
**Duration:** 3h | **Dependencies:** T-017 | **Agent:** task-executor

**Description:**
Ensure all components work on mobile devices.

**Tasks:**
- [ ] Test on mobile
- [ ] Fix layout issues
- [ ] Optimize touch targets
- [ ] Test calendar on mobile

---

### T-032: Performance Optimization
**Duration:** 3h | **Dependencies:** All above | **Agent:** task-executor

**Description:**
Optimize frontend and backend performance.

**Tasks:**
- [ ] Add lazy loading
- [ ] Optimize images
- [ ] Add caching
- [ ] Optimize database queries

---

### T-033: Security Hardening
**Duration:** 3h | **Dependencies:** All above | **Agent:** task-executor

**Description:**
Implement security best practices.

**Tasks:**
- [ ] Add rate limiting
- [ ] Configure security headers
- [ ] Add input sanitization
- [ ] Security audit

---

### T-034: Documentation
**Duration:** 3h | **Dependencies:** All above | **Agent:** task-executor

**Description:**
Write user and developer documentation.

**Tasks:**
- [ ] API documentation
- [ ] User guide
- [ ] README updates
- [ ] Deployment guide

---

### T-035: Final Testing & Bug Fixes
**Duration:** 4h | **Dependencies:** All above | **Agent:** task-executor

**Description:**
End-to-end testing and bug fixes.

**Tasks:**
- [ ] Run full test suite
- [ ] Manual testing
- [ ] Fix bugs
- [ ] Performance testing

---

## Summary

| Epic | Hours | Tasks |
|------|-------|-------|
| Infrastructure | 16 | 6 |
| Authentication | 12 | 3 |
| Core Features | 40 | 10 |
| Team Features | 20 | 6 |
| Analytics | 16 | 5 |
| Polish & Launch | 16 | 5 |
| **Total** | **120** | **35** |

**Critical Path:**
T-001 → T-003 → T-007 → T-008 → T-010 → T-013 → T-015 → T-019

**Risk Areas:**
- TikTok API integration (external dependency)
- Video upload (file handling complexity)
- Scheduling accuracy (time-critical)
```

## Planning Process

```
Input: Design/Requirements
  ↓
[Understand Scope]
  - What needs to be built?
  - What are the components?
  - What are the dependencies?
  ↓
[Identify Tasks]
  - Break down by component
  - Identify implementation steps
  - Note file changes
  ↓
[Sequence Tasks]
  - Find dependencies
  - Order by priority
  - Identify parallel work
  ↓
[Estimate Effort]
  - Time per task (2-8h ideal)
  - Total duration
  - Critical path
  ↓
[Format Plan]
  - Group into epics
  - Add acceptance criteria
  - Link to agents
  ↓
Output: Work Plan
```

## Integration

### Used By
- `/plan` command
- `/implement` for task generation

### Works With
- `requirement-analyzer` - Understands requirements
- `technical-designer` - Uses tech spec
- `task-executor` - Plans tasks for execution

## Tips

1. **Keep tasks small** - 2-8 hours is ideal
2. **Define done clearly** - Acceptance criteria matter
3. **Note dependencies** - What blocks what?
4. **Include file hints** - Helps execution
5. **Pad estimates** - Things take longer than expected
6. **Identify risks** - What could go wrong?

## Example Usage

```bash
/plan --design="docs/design/tiktok-prd.md"
  ↓
[Work Planner]
  Analyzes design...
  Breaks into tasks...
  Estimates effort...
  Sequences work...
  ↓
Output: work-plan.md
```