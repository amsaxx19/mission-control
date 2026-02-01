# /design Command

Create comprehensive design documentation for features.

## Usage

```bash
# Basic usage
/design "Description of what to design"

# With options
/design "User authentication system" --type="prd" --output="docs/auth-prd.md"
/design "API architecture" --type="technical" --tech="Node.js,GraphQL"
/design "Full design" --type="both" --template="detailed"
```

## What It Does

Creates design documents using specialized agents:

- **PRD (Product Requirements Document)** - What to build, why, and for whom
- **Technical Specification** - How to build it, architecture, data models

## Document Types

### PRD (Product Requirements Document)

Created by `prd-creator` agent. Includes:

- **Overview** - Summary of the feature
- **Goals** - What success looks like
- **User Stories** - Who uses it and why
- **Requirements** - Functional and non-functional
- **UI/UX** - Screens, flows, interactions
- **Acceptance Criteria** - Definition of done
- **Open Questions** - Things to resolve

### Technical Specification

Created by `technical-designer` agent. Includes:

- **Architecture** - System components and interactions
- **Data Models** - Database schema, API contracts
- **API Design** - Endpoints, request/response formats
- **Implementation Plan** - Key technical decisions
- **Security Considerations** - Auth, validation, protection
- **Performance** - Optimization strategies
- **Testing Strategy** - How to test the implementation

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--type` | Document type: `prd`, `technical`, `both` | `both` |
| `--output` | Output file path | Auto-generated |
| `--tech` | Tech stack constraints | Project default |
| `--template` | Template style: `minimal`, `standard`, `detailed` | `standard` |
| `--audience` | Target audience: `dev`, `stakeholder`, `both` | `both` |

## Workflow

```
Input: Design description
  ↓
[Requirement Analysis]
  ↓
[Create PRD] (if type=prd or both)
  - Analyze user needs
  - Define requirements
  - Create user stories
  - Specify acceptance criteria
  ↓
[Create Tech Spec] (if type=technical or both)
  - Design architecture
  - Define data models
  - Design APIs
  - Plan implementation
  ↓
Output: Design document(s)
```

## Example

```bash
/design "TikTok affiliate content scheduler with automated posting"
```

### Output: PRD

```markdown
# TikTok Content Scheduler - PRD

## Overview
Automated scheduling system for TikTok affiliate content...

## Goals
- Reduce manual posting time by 80%
- Increase content consistency
- Track performance automatically

## User Stories
- As an affiliate, I want to schedule posts...
- As a manager, I want to approve content before posting...

## Requirements
### Functional
- Upload videos with captions
- Schedule posts for optimal times
- Auto-post based on schedule
- Track engagement metrics

### Non-Functional
- 99.9% uptime for scheduler
- < 30s video processing time
- Support 1000+ scheduled posts

## UI/UX
[Wireframes and flow descriptions]

## Acceptance Criteria
- [ ] User can upload and schedule a video
- [ ] System posts at scheduled time
- [ ] Analytics are captured
- [ ] Failed posts are retried
```

### Output: Technical Specification

```markdown
# TikTok Content Scheduler - Technical Spec

## Architecture
[Diagram and component description]

## Data Models
```javascript
// ScheduledPost
{
  id: UUID,
  userId: UUID,
  videoUrl: String,
  caption: String,
  scheduledAt: DateTime,
  status: 'pending' | 'posted' | 'failed',
  tiktokPostId: String?
}
```

## API Design
### POST /api/schedule
Create a new scheduled post...

## Implementation Plan
1. Set up TikTok API integration
2. Create scheduler service
3. Build upload UI
4. Implement analytics tracking
```

## When to Use

✅ **Use for:**
- Features > 1 day of development
- Complex user interactions
- API design
- System architecture changes
- Features requiring stakeholder approval

❌ **Don't use for:**
- Bug fixes
- Simple UI tweaks
- Configuration changes
- Refactoring without behavior changes

## Tips

1. Start with a clear problem statement
2. Include user context - who is this for?
3. Define success metrics upfront
4. Note constraints and assumptions
5. Leave room for iteration

## Related Commands

- `/implement` - Build based on design
- `/plan` - Create work plan from design