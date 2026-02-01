# /task Command

Execute a single, well-defined task.

## Usage

```bash
# Basic usage
/task "Create the user authentication middleware"

# With context
/task "Add Stripe webhook handler" --design="docs/stripe-design.md"
/task "Create database migration" --plan="docs/plan.md" --task-id="T-005"

# With files
/task "Update the API" --files="src/api.js,src/routes.js"
```

## What It Does

Uses `task-executor` agent to:

1. **Understand Context** - Parse requirements from description, files, or design docs
2. **Plan Approach** - Determine the best way to implement
3. **Execute** - Write code, create files, make changes
4. **Verify** - Run tests, check for errors
5. **Report** - Summarize what was done

## Task Types

The `/task` command handles various types of work:

### Code Implementation

```bash
/task "Create Express route handler for user registration with validation"
```

### Database Work

```bash
/task "Create migration to add subscriptions table with indexes"
```

### Configuration

```bash
/task "Set up environment configuration for Stripe integration"
```

### Testing

```bash
/task "Write unit tests for the payment service"
```

### Documentation

```bash
/task "Document the authentication API endpoints"
```

### Refactoring

```bash
/task "Refactor the user service to use async/await instead of callbacks"
```

### Bug Fixes

```bash
/task "Fix the memory leak in the video processing worker"
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--design` | Path to design document | None |
| `--plan` | Path to work plan | None |
| `--task-id` | Specific task ID from plan | None |
| `--files` | Comma-separated list of files to modify | None |
| `--tech` | Tech stack to use | Project default |
| `--test` | Run tests after completion | true |
| `--review` | Auto-review the changes | false |

## Execution Process

```
Input: Task description + context
  ↓
[Parse Requirements]
  - What needs to be done?
  - What are the constraints?
  - What files are involved?
  ↓
[Analyze Existing Code]
  - Read relevant files
  - Understand patterns
  - Find integration points
  ↓
[Plan Implementation]
  - Design the solution
  - Identify files to create/modify
  - Consider edge cases
  ↓
[Execute]
  - Write code
  - Create files
  - Update dependencies
  ↓
[Verify]
  - Run tests
  - Check for syntax errors
  - Validate against requirements
  ↓
Output: Completed task + summary
```

## Example Tasks

### Web Development

```bash
/task "Create React component for subscription pricing cards"
/task "Add JWT authentication middleware to Express routes"
/task "Implement Redux store for user state management"
```

### Backend/API

```bash
/task "Create REST API endpoint for creating subscriptions"
/task "Implement rate limiting on the public API"
/task "Add request validation using Joi schema"
```

### Database

```bash
/task "Create migration for adding user preferences table"
/task "Add composite index on posts(user_id, created_at)"
/task "Write seed data for testing environments"
```

### DevOps/Infrastructure

```bash
/task "Create Docker Compose configuration for local development"
/task "Set up GitHub Actions workflow for CI/CD"
/task "Configure nginx reverse proxy with SSL"
```

### Marketing/Content

```bash
/task "Write email sequence for user onboarding (5 emails)"
/task "Create landing page copy for the new pricing tier"
/task "Generate 10 Facebook ad headline variations"
```

## Output

After execution, you'll get:

```markdown
## Task Completed: Create User Authentication Middleware

### Files Created/Modified
- `src/middleware/auth.js` - New authentication middleware
- `src/middleware/auth.test.js` - Unit tests
- `src/config/auth.js` - Auth configuration

### Summary
Created JWT-based authentication middleware that:
- Validates Bearer tokens from Authorization header
- Attaches user object to request
- Returns 401 for missing/invalid tokens
- Supports role-based access control

### Tests
✅ 5 tests passed
- Should allow valid tokens
- Should reject missing tokens
- Should reject expired tokens
- Should attach user to request
- Should check user roles

### Next Steps
- Integrate into protected routes
- Add refresh token logic
- Set up token blacklisting
```

## Best Practices

### Good Task Descriptions

✅ **Good:**
- "Create a React component that displays subscription pricing with three tiers"
- "Add API endpoint POST /api/users that creates a user with email validation"
- "Write a function that calculates affiliate commission based on tier and sales volume"

❌ **Vague:**
- "Fix the bug" (which bug?)
- "Make it better" (what's "it"? better how?)
- "Do the thing" (what thing?)

### Task Size

Ideal tasks are:
- **Completable in 2-4 hours**
- **Single responsibility**
- **Clear definition of done**

Break down larger work:
```bash
# Instead of:
/task "Build the entire subscription system"

# Do:
/task "Create database schema for subscriptions"
/task "Implement subscription creation API"
/task "Add Stripe integration for payments"
/task "Create subscription management UI"
```

## When to Use

✅ **Use for:**
- Well-defined implementation work
- Specific bug fixes
- Refactoring tasks
- Test writing
- Documentation

❌ **Don't use for:**
- Requirements gathering
- High-level planning
- Multi-day features (use `/implement`)

## Related Commands

- `/implement` - Multiple tasks with planning
- `/plan` - Generate task list
- `/review` - Review task output