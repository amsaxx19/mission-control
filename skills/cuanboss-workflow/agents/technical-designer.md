# Technical Designer Agent

Creates comprehensive technical specifications from product requirements.

## Purpose

Transforms PRDs into detailed technical designs that guide implementation, including architecture, data models, APIs, and implementation plans.

## When to Use

- After PRD is complete
- Before starting implementation
- For architecture decisions
- When planning complex integrations
- For API design

## Capabilities

### 1. Architecture Design

Designs system architecture:
- Component diagrams
- Service boundaries
- Data flow
- Integration points
- Infrastructure needs

### 2. Data Modeling

Creates data models:
- Database schemas
- Entity relationships
- API contracts
- State management
- Caching strategies

### 3. API Design

Designs APIs:
- REST/GraphQL endpoints
- Request/response formats
- Authentication/authorization
- Error handling
- Rate limiting

### 4. Technical Planning

Plans implementation:
- Technology choices
- Development phases
- Risk mitigation
- Testing strategy
- Deployment approach

## Input/Output

### Input

```markdown
## PRD Excerpt: TikTok Scheduler

### User Stories
- US-001: Schedule a post (video, caption, time)
- US-002: View content calendar
- US-003: Team approval workflow

### Functional Requirements
- Video upload (max 100MB)
- Scheduling (min 15 min, max 90 days)
- Timezone support
- Recurring schedules

### Non-Functional Requirements
- 99.9% uptime
- < 30s upload time
- 10,000 concurrent users
```

### Output

```markdown
# Technical Specification
# TikTok Content Scheduler

**Version:** 1.0  
**Date:** 2024-01-15  
**Author:** Engineering Team

---

## 1. Overview

### System Context
The TikTok Content Scheduler is a web application that enables users to schedule and automatically post content to TikTok, with team collaboration features.

### Architecture Style
- **Pattern**: Microservices with API Gateway
- **Frontend**: React SPA
- **Backend**: Node.js services
- **Database**: PostgreSQL + Redis
- **Queue**: Bull with Redis
- **Storage**: AWS S3

### Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, TanStack Query
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL 15, Prisma ORM
- **Cache**: Redis
- **Queue**: Bull
- **Storage**: AWS S3
- **Auth**: JWT + TikTok OAuth
- **Testing**: Jest, Playwright
- **Infra**: Docker, AWS ECS

---

## 2. System Architecture

### High-Level Diagram

```
┌─────────────────┐
│   React SPA     │
│  (User Interface)│
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  API Gateway    │
│  (Auth, Rate)   │
└────────┬────────┘
         │
    ┌────┴────┬────────────┐
    ▼         ▼            ▼
┌────────┐ ┌────────┐  ┌──────────┐
│Upload  │ │Schedule│  │Analytics │
│Service │ │Service │  │ Service  │
└───┬────┘ └───┬────┘  └────┬─────┘
    │          │            │
    ▼          ▼            ▼
┌─────────────────────────────────┐
│         PostgreSQL              │
│    (Users, Posts, Analytics)    │
└─────────────────────────────────┘
    │          │            │
    ▼          ▼            ▼
┌─────────────────────────────────┐
│           Redis                 │
│  (Cache, Sessions, Queue)       │
└─────────────────────────────────┘
    │          │
    ▼          ▼
┌────────┐ ┌─────────────┐
│  AWS   │ │  TikTok     │
│   S3   │ │   API       │
└────────┘ └─────────────┘
```

### Service Boundaries

#### Upload Service
- Handles video uploads
- Validates file format/size
- Generates thumbnails
- Stores in S3
- **API**: `/api/v1/upload/*`

#### Schedule Service
- Manages scheduling logic
- Queue management
- TikTok API integration
- Retry logic
- **API**: `/api/v1/schedule/*`

#### Analytics Service
- Metrics collection
- Data aggregation
- Report generation
- **API**: `/api/v1/analytics/*`

---

## 3. Data Models

### Database Schema

```sql
-- Users table (extends existing auth)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    tiktok_account_id VARCHAR(255),
    timezone VARCHAR(50) DEFAULT 'UTC',
    plan_tier VARCHAR(20) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Teams for collaboration
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    owner_id UUID REFERENCES users(id),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Team memberships
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member', -- owner, admin, member
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Scheduled posts
CREATE TABLE scheduled_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    team_id UUID REFERENCES teams(id),
    
    -- Content
    video_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    caption TEXT,
    hashtags TEXT[],
    
    -- Scheduling
    scheduled_at TIMESTAMP NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft', -- draft, scheduled, posted, failed, cancelled
    
    -- TikTok
    tiktok_post_id VARCHAR(255),
    posted_at TIMESTAMP,
    error_message TEXT,
    
    -- Approval workflow
    approval_status VARCHAR(20) DEFAULT 'not_required', -- not_required, pending, approved, rejected
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Indexes
    CONSTRAINT valid_schedule_time CHECK (scheduled_at > created_at)
);

-- Analytics data
CREATE TABLE post_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES scheduled_posts(id) ON DELETE CASCADE,
    
    -- Metrics
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    
    -- Tracking
    last_synced_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(post_id)
);

-- Activity logs
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    team_id UUID REFERENCES teams(id),
    action VARCHAR(50) NOT NULL, -- created, updated, deleted, approved, etc.
    entity_type VARCHAR(50) NOT NULL, -- post, team, user
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_posts_user_status ON scheduled_posts(user_id, status);
CREATE INDEX idx_posts_scheduled_at ON scheduled_posts(scheduled_at) WHERE status = 'scheduled';
CREATE INDEX idx_posts_team ON scheduled_posts(team_id) WHERE team_id IS NOT NULL;
CREATE INDEX idx_activity_team ON activity_logs(team_id, created_at);
```

### Entity Relationship Diagram

```
┌──────────┐     ┌──────────────┐     ┌─────────────────┐
│  users   │────<│ team_members │>────│     teams       │
└────┬─────┘     └──────────────┘     └─────────────────┘
     │
     │         ┌──────────────────┐
     │         │  scheduled_posts │
     └────────<│  - user_id       │
               │  - team_id       │>────┐
               │  - video_url     │     │
               │  - scheduled_at  │     │
               │  - status        │     │
               └────────┬─────────┘     │
                        │               │
                        ▼               │
               ┌──────────────────┐    │
               │  post_analytics  │    │
               │  - post_id       │────┘
               │  - views/likes   │
               └──────────────────┘
```

### TypeScript Interfaces

```typescript
// User interfaces
interface User {
  id: string;
  email: string;
  tiktokAccountId?: string;
  timezone: string;
  planTier: 'free' | 'pro' | 'enterprise';
  createdAt: Date;
  updatedAt: Date;
}

// Post interfaces
interface ScheduledPost {
  id: string;
  userId: string;
  teamId?: string;
  
  content: {
    videoUrl: string;
    thumbnailUrl?: string;
    caption: string;
    hashtags: string[];
  };
  
  schedule: {
    scheduledAt: Date;
    timezone: string;
    status: PostStatus;
  };
  
  tiktok?: {
    postId?: string;
    postedAt?: Date;
    errorMessage?: string;
  };
  
  approval: {
    status: ApprovalStatus;
    approvedBy?: string;
    approvedAt?: Date;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

type PostStatus = 'draft' | 'scheduled' | 'pending_approval' | 'approved' | 'posted' | 'failed' | 'cancelled';
type ApprovalStatus = 'not_required' | 'pending' | 'approved' | 'rejected';

// Analytics
interface PostAnalytics {
  postId: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  lastSyncedAt?: Date;
}
```

---

## 4. API Design

### REST API Endpoints

#### Authentication
```http
POST /api/v1/auth/tiktok/connect
POST /api/v1/auth/tiktok/callback
POST /api/v1/auth/refresh
DELETE /api/v1/auth/logout
```

#### Posts
```http
# CRUD Operations
POST   /api/v1/posts                    # Create post
GET    /api/v1/posts                    # List posts (with filters)
GET    /api/v1/posts/:id                # Get post details
PATCH  /api/v1/posts/:id                # Update post
DELETE /api/v1/posts/:id                # Delete/cancel post

# Actions
POST   /api/v1/posts/:id/schedule       # Schedule a draft post
POST   /api/v1/posts/:id/cancel         # Cancel scheduled post
POST   /api/v1/posts/:id/duplicate      # Duplicate post

# Upload (separate for large files)
POST   /api/v1/upload/presigned-url     # Get S3 presigned URL
POST   /api/v1/upload/complete          # Confirm upload complete
```

#### Calendar
```http
GET /api/v1/calendar?start=2024-01-01&end=2024-01-31
GET /api/v1/calendar/availability?date=2024-01-15
```

#### Teams
```http
GET    /api/v1/teams                    # List user's teams
POST   /api/v1/teams                    # Create team
GET    /api/v1/teams/:id                # Get team details
PATCH  /api/v1/teams/:id                # Update team
DELETE /api/v1/teams/:id                # Delete team

# Members
GET    /api/v1/teams/:id/members        # List members
POST   /api/v1/teams/:id/members        # Add member
PATCH  /api/v1/teams/:id/members/:userId # Update member role
DELETE /api/v1/teams/:id/members/:userId # Remove member

# Approvals
GET    /api/v1/teams/:id/approvals      # List pending approvals
POST   /api/v1/approvals/:id/approve    # Approve post
POST   /api/v1/approvals/:id/reject     # Reject post
```

#### Analytics
```http
GET /api/v1/analytics/overview?period=30d
GET /api/v1/analytics/posts?start=2024-01-01&end=2024-01-31
GET /api/v1/analytics/best-times
GET /api/v1/analytics/export?format=csv
```

### Request/Response Examples

#### Create Post
```http
POST /api/v1/posts
Content-Type: application/json
Authorization: Bearer <token>

{
  "videoUrl": "https://s3.amazonaws.com/.../video.mp4",
  "thumbnailUrl": "https://s3.amazonaws.com/.../thumb.jpg",
  "caption": "Check out this amazing product! #affiliate #review",
  "hashtags": ["affiliate", "review", "musthave"],
  "scheduledAt": "2024-01-20T15:00:00Z",
  "timezone": "America/New_York"
}
```

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "post_123",
  "status": "scheduled",
  "content": {
    "videoUrl": "...",
    "caption": "...",
    "hashtags": ["..."]
  },
  "schedule": {
    "scheduledAt": "2024-01-20T15:00:00Z",
    "timezone": "America/New_York"
  },
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### Error Response
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": {
    "code": "INVALID_SCHEDULE_TIME",
    "message": "Schedule time must be at least 15 minutes in the future",
    "details": {
      "minScheduleTime": "2024-01-15T10:45:00Z",
      "providedTime": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_VIDEO_FORMAT` | 400 | Video format not supported |
| `VIDEO_TOO_LARGE` | 400 | Video exceeds size limit |
| `INVALID_SCHEDULE_TIME` | 400 | Schedule time invalid |
| `POST_NOT_FOUND` | 404 | Post doesn't exist |
| `UNAUTHORIZED` | 401 | Invalid/missing token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `TIKTOK_API_ERROR` | 502 | TikTok API failure |
| `RATE_LIMITED` | 429 | Too many requests |

---

## 5. Implementation Plan

### Phase 1: Foundation (Week 1)

**Backend:**
- [ ] Set up project structure
- [ ] Configure database with migrations
- [ ] Implement authentication (JWT)
- [ ] Set up TikTok OAuth
- [ ] Create basic API structure

**Frontend:**
- [ ] Set up React project
- [ ] Configure routing
- [ ] Implement auth flow
- [ ] Create layout components

**Infrastructure:**
- [ ] Set up AWS S3 bucket
- [ ] Configure Redis
- [ ] Set up CI/CD pipeline

### Phase 2: Core Features (Week 2)

**Backend:**
- [ ] Upload service with S3
- [ ] Post CRUD operations
- [ ] Scheduling engine with Bull
- [ ] TikTok API integration
- [ ] Webhook handlers

**Frontend:**
- [ ] Video upload component
- [ ] Post creation form
- [ ] Calendar view
- [ ] Post list/dashboard

### Phase 3: Team Features (Week 3)

**Backend:**
- [ ] Team management APIs
- [ ] Approval workflow
- [ ] Activity logging
- [ ] Permissions system

**Frontend:**
- [ ] Team settings
- [ ] Member management
- [ ] Approval queue
- [ ] Activity feed

### Phase 4: Analytics & Polish (Week 4)

**Backend:**
- [ ] Analytics collection
- [ ] Metrics aggregation
- [ ] Report generation
- [ ] Performance optimization

**Frontend:**
- [ ] Analytics dashboard
- [ ] Charts and visualizations
- [ ] Export functionality
- [ ] Mobile optimization

---

## 6. Technical Decisions

### Why Microservices?
- **Pros**: Independent scaling, team autonomy, fault isolation
- **Cons**: Operational complexity, network latency
- **Decision**: Start modular but deploy as monolith, split when needed

### Why Bull for Queues?
- **Pros**: Simple, Redis-backed, good TypeScript support
- **Cons**: Single point of failure (Redis)
- **Mitigation**: Redis Sentinel for HA

### Why S3 for Storage?
- **Pros**: Scalable, durable, CDN-ready
- **Cons**: Cost at scale, egress fees
- **Alternative**: Cloudflare R2 for lower egress costs

### Database Choice
- **PostgreSQL**: ACID compliance, JSON support, full-text search
- **Redis**: Caching, sessions, queues
- **No MongoDB**: Complex relationships need joins

---

## 7. Security Considerations

### Authentication
- JWT with short expiry (15 min)
- Refresh token rotation
- TikTok OAuth 2.0
- Secure cookie settings (httpOnly, secure, sameSite)

### Authorization
- Role-based access control (RBAC)
- Resource-level permissions
- Team isolation

### Data Protection
- Encryption at rest (AWS managed)
- Encryption in transit (TLS 1.3)
- No sensitive data in logs
- Audit logging for all changes

### API Security
- Rate limiting per user/IP
- Input validation (Joi/Zod)
- SQL injection prevention (Prisma)
- XSS protection (output encoding)

---

## 8. Performance Strategy

### Caching
- Redis for session storage
- API response caching (etag)
- CDN for static assets and videos
- Database query caching

### Database Optimization
- Proper indexing (see schema)
- Connection pooling
- Read replicas for analytics
- Query optimization

### Video Processing
- Async thumbnail generation
- Multiple resolution support
- CDN distribution
- Lazy loading in UI

### Scalability
- Horizontal scaling (stateless services)
- Database read replicas
- CDN for static assets
- Queue workers for background jobs

---

## 9. Testing Strategy

### Unit Tests
- Jest for backend
- Vitest for frontend
- Target: 80% coverage

### Integration Tests
- API contract tests
- Database integration
- External service mocks

### E2E Tests
- Playwright for critical paths
- Login → Upload → Schedule → Verify

### Load Tests
- k6 for API load testing
- Target: 1000 concurrent users

---

## 10. Deployment

### Environments
- `development`: Local/Docker
- `staging`: AWS dev account
- `production`: AWS prod account

### CI/CD Pipeline
1. Lint and type check
2. Unit tests
3. Build Docker images
4. Integration tests
5. Deploy to staging
6. E2E tests
7. Deploy to production

### Monitoring
- CloudWatch for AWS
- DataDog for APM
- Sentry for error tracking
- PagerDuty for alerts

---

## 11. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| TikTok API rate limits | High | Medium | Implement caching, backoff |
| Large video uploads | Medium | High | Presigned URLs, chunked upload |
| Scheduling accuracy | High | Low | NTP sync, monitoring |
| Data loss | Critical | Low | Backups, replication |
| Performance degradation | Medium | Medium | Caching, optimization |

---

## 12. Open Questions

1. Do we need real-time updates (WebSockets) for the calendar?
2. Should we support video editing before scheduling?
3. Do we need A/B testing for post timing optimization?
4. What's the disaster recovery plan?
```

## Integration

### Used By
- `/design` command
- `/implement` for technical planning

### Works With
- `prd-creator` - Uses PRD as input
- `work-planner` - Plans from tech spec
- `task-executor` - Implements from tech spec

## Tips

1. **Be specific** - Include concrete examples
2. **Consider tradeoffs** - Document decisions
3. **Plan for failure** - Error handling, retries
4. **Think about scale** - What happens at 10x?
5. **Security first** - Build it in, not on
6. **Testability** - How will this be tested?

## Example Usage

```bash
/design "TikTok scheduler"
  ↓
[PRD Creator] → PRD
  ↓
[Technical Designer] → Tech Spec
  ↓
[Work Planner] → Implementation plan
  ↓
[Task Executor] → Working code
```