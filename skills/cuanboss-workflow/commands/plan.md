# /plan Command

Generate detailed work plans from requirements or designs.

## Usage

```bash
# Basic usage
/plan "Description of work to plan"

# From design document
/plan --design="docs/design/feature-prd.md"

# With options
/plan "Build auth system" --format="markdown" --estimate
/plan --tech="React,Node.js" --max-tasks=20
```

## What It Does

Breaks down work into actionable, sequenced tasks with:

- Clear task descriptions
- Estimated effort
- Dependencies between tasks
- Acceptance criteria
- Assigned agent (if applicable)

## Output Format

### Task Structure

```yaml
task:
  id: "T-001"
  title: "Set up database schema"
  description: "Create tables for users, subscriptions, payments"
  agent: "task-executor"
  estimated_hours: 2
  dependencies: []
  acceptance_criteria:
    - "Migration files created"
    - "Schema matches tech spec"
    - "Indexes added for performance"
  files_to_create:
    - "migrations/001_create_subscriptions.sql"
    - "src/models/subscription.ts"
  
epic:
  name: "Subscription System"
  tasks: [T-001, T-002, T-003, ...]
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--design` | Path to design document | None (use description) |
| `--format` | Output format: `markdown`, `yaml`, `json` | `markdown` |
| `--estimate` | Include time estimates | true |
| `--max-tasks` | Maximum number of tasks | 50 |
| `--group-by` | Grouping: `epic`, `component`, `phase` | `epic` |
| `--tech` | Tech stack to consider | Project default |

## Plan Structure

### By Epic (default)

```markdown
# Work Plan: Subscription System

## Epic: Database & Models
- [ ] T-001: Create migration files (2h)
- [ ] T-002: Define Sequelize models (2h)
- [ ] T-003: Add database indexes (1h)

## Epic: API Endpoints
- [ ] T-004: Create subscription routes (3h)
  - Depends: T-002
- [ ] T-005: Implement CRUD operations (4h)
  - Depends: T-004
- [ ] T-006: Add validation middleware (2h)
  - Depends: T-004

## Epic: Stripe Integration
- [ ] T-007: Set up Stripe SDK (1h)
- [ ] T-008: Create checkout session endpoint (3h)
  - Depends: T-007, T-005
- [ ] T-009: Implement webhook handlers (4h)
  - Depends: T-007
```

### By Phase

```markdown
# Work Plan: TikTok Automation

## Phase 1: Foundation (Week 1)
- [ ] Set up project structure
- [ ] Configure TikTok API credentials
- [ ] Create database schema

## Phase 2: Core Features (Week 2)
- [ ] Build video upload service
- [ ] Create scheduler engine
- [ ] Implement post queue

## Phase 3: Polish (Week 3)
- [ ] Add error handling & retries
- [ ] Create monitoring dashboard
- [ ] Write documentation
```

## Planning Process

```
Input: Requirements or Design Doc
  ↓
[Analyze Scope]
  - Identify components
  - Estimate complexity
  - Find dependencies
  ↓
[Break Down Tasks]
  - Create actionable items
  - Size appropriately (2-8h ideal)
  - Sequence dependencies
  ↓
[Organize & Format]
  - Group logically
  - Add metadata
  - Format for readability
  ↓
Output: Structured work plan
```

## Example

```bash
/plan "Build TikTok content automation with scheduling, analytics, and team collaboration"
```

### Generated Plan:

```markdown
# Work Plan: TikTok Content Automation
**Estimated Total: 45 hours**

## Epic: Core Infrastructure (8h)
- [ ] T-001: Initialize project structure (1h)
- [ ] T-002: Set up database and ORM (2h)
- [ ] T-003: Configure environment and secrets (1h)
- [ ] T-004: Set up logging and error handling (2h)
- [ ] T-005: Create base API structure (2h)

## Epic: TikTok Integration (12h)
- [ ] T-006: Research TikTok API capabilities (2h)
- [ ] T-007: Implement authentication flow (3h)
- [ ] T-008: Create video upload service (4h)
  - Depends: T-007
- [ ] T-009: Build content metadata management (3h)
  - Depends: T-008

## Epic: Scheduling Engine (10h)
- [ ] T-010: Design scheduler architecture (2h)
- [ ] T-011: Implement job queue with Bull (3h)
- [ ] T-012: Create scheduling logic (3h)
- [ ] T-013: Add timezone support (2h)

## Epic: Analytics (8h)
- [ ] T-014: Define metrics to track (1h)
- [ ] T-015: Create analytics data models (2h)
- [ ] T-016: Build metrics collection service (3h)
- [ ] T-017: Create dashboard API (2h)

## Epic: Team Features (7h)
- [ ] T-018: Add multi-user support (2h)
- [ ] T-019: Create approval workflow (3h)
- [ ] T-020: Add notification system (2h)
```

## When to Use

✅ **Use for:**
- Breaking down large features
- Sprint planning
- Estimating project timelines
- Delegating work to team members
- Tracking progress

❌ **Don't use for:**
- Simple one-off tasks
- Emergency fixes
- Exploration work

## Tips

1. **Keep tasks small** - Ideally 2-8 hours
2. **Define clear done criteria** - What does complete look like?
3. **Identify blockers early** - What could go wrong?
4. **Leave buffer time** - Plans always need adjustment
5. **Review and adjust** - Plans are living documents

## Integration with /implement

When `/implement` generates a plan, it:
1. Creates the work plan document
2. Executes tasks automatically
3. Updates progress as it goes
4. Generates a completion report

## Related Commands

- `/implement` - Execute the plan
- `/task` - Execute a single task from plan
- `/design` - Create design to plan from