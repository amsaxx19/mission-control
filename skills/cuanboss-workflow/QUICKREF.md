# CuanBoss Workflow - Quick Reference

## Commands Cheat Sheet

| Command | Purpose | Example |
|---------|---------|---------|
| `/implement` | Full feature development | `/implement "Add Stripe subscriptions"` |
| `/design` | Create design docs | `/design "Design the analytics dashboard"` |
| `/plan` | Generate work plan | `/plan --design="docs/prd.md"` |
| `/task` | Execute single task | `/task "Create user API endpoint"` |
| `/review` | Verify code quality | `/review --design="docs/prd.md" --code="src/"` |
| `/diagnose` | Debug issues | `/diagnose "Login not working"` |

## Workflow Selection

### Starting a New Feature

```bash
# Option 1: Full automation (for features > 1 week)
/implement "Add user authentication with email and social login"

# Option 2: Step by step (more control)
/design "Design auth system"          # Creates PRD + Tech Spec
/plan --design="docs/auth-prd.md"     # Creates work plan
/task "Create login endpoint"         # Execute individual tasks
/task "Create register endpoint"
/review --design="docs/auth-prd.md" --code="src/auth/"
```

### Quick Fixes

```bash
# Bug fix with clear scope
/task "Fix the password reset email not sending"

# Debug mysterious issue
/diagnose "Intermittent 500 errors on user login"

# Refactoring
/task "Refactor user service to use async/await"
```

### Marketing & Content

```bash
# Copywriting
/task "Write landing page copy for new pricing tier"
/task "Create 5 email subject line variations"

# Full campaign
/implement "Create marketing campaign for course launch"
```

## Agent Quick Reference

| Agent | What It Does | Used When |
|-------|--------------|-----------|
| `requirement-analyzer` | Clarifies requirements | Start of design/implement |
| `prd-creator` | Creates product requirements | Design phase |
| `technical-designer` | Creates technical specs | Design phase |
| `work-planner` | Breaks work into tasks | Planning phase |
| `task-executor` | Implements code | Execution phase |
| `code-reviewer` | Reviews quality | Review phase |
| `quality-fixer` | Fixes code issues | After review |

## Options Reference

### /implement
```bash
/implement "description" \
  --design="path/to/design.md" \     # Use existing design
  --plan="path/to/plan.md" \         # Use existing plan
  --tech="React,Node.js" \           # Specify tech stack
  --quick                            # Skip design for simple features
```

### /design
```bash
/design "description" \
  --type="both" \                    # prd, technical, or both
  --output="docs/design.md" \        # Output path
  --template="standard"              # minimal, standard, detailed
```

### /plan
```bash
/plan "description" \
  --design="docs/prd.md" \           # Source design
  --estimate \                       # Include time estimates
  --max-tasks=50                     # Limit task count
```

### /task
```bash
/task "description" \
  --design="docs/design.md" \        # Context
  --files="src/file.js" \            # Files to modify
  --review                           # Auto-review after
```

### /review
```bash
/review \
  --design="docs/prd.md" \           # Compare to design
  --code="src/" \                    # Code to review
  --tests \                          # Include test analysis
  --security \                       # Include security review
  --fix                              # Auto-fix issues
```

### /diagnose
```bash
/diagnose "description" \
  --logs="logs/app.log" \            # Log files
  --code="src/" \                    # Code to examine
  --trace                            # Enable tracing
```

## Business-Specific Patterns

### CuanBoss Feature Development

```bash
# New feature
/implement "Add team collaboration features"

# Database change
/task "Create migration for adding team invitations"

# API endpoint
/task "Create API for managing team members with role-based access"

# Frontend component
/task "Build team management UI with member list and invite form"
```

### TikTok Affiliate Automation

```bash
# Full system
/implement "Build TikTok content scheduler with analytics"

# Specific integration
/task "Integrate TikTok API for video posting"

# Background job
/task "Create Bull worker for processing scheduled posts"

# Analytics
/task "Build analytics dashboard with views, likes, and engagement metrics"
```

### Marketing Workflows

```bash
# Copywriting
/task "Write email sequence for product launch (5 emails)"

# Ad variations
/task "Create 10 Facebook ad headline variations"

# Landing page
/task "Write landing page copy with hero, features, testimonials, pricing"

# Full campaign
/implement "Create complete marketing campaign for affiliate course"
```

### Business Operations

```bash
# Reporting
/task "Create monthly revenue report job with Stripe integration"

# Automation
/task "Build failed payment recovery system with 3 retry attempts"

# Monitoring
/task "Set up usage limit alerts with 80% and 100% thresholds"
```

## Common File Patterns

```
project/
├── docs/
│   ├── design/
│   │   ├── feature-prd.md
│   │   └── feature-tech.md
│   └── plans/
│       └── feature-plan.md
├── src/
│   ├── routes/
│   ├── services/
│   ├── models/
│   └── middleware/
├── tests/
└── .cuanbossrc
```

## Tips

1. **Start with design for complex features** - Saves time later
2. **Use `/task` for focused work** - More control than `/implement`
3. **Always review before merging** - Catch issues early
4. **Iterate with feedback** - `/implement`, review, fix, repeat
5. **Keep tasks small** - 2-4 hours is ideal
6. **Save designs** - Reuse for similar features

## Troubleshooting

### Issue: Task is too vague
**Fix:** Be specific - include what, where, and acceptance criteria
```bash
# Bad
/task "Fix the bug"

# Good
/task "Fix the login 500 error caused by null user object in auth middleware"
```

### Issue: Review found many issues
**Fix:** Use `--fix` flag, then review remaining issues
```bash
/review --code="src/" --fix
```

### Issue: Not sure where to start
**Fix:** Use `/design` first to clarify scope
```bash
/design "Design the feature"  # Clarifies what to build
/plan --design="docs/design.md"  # Breaks into steps
```

## Configuration (.cuanbossrc)

```yaml
project:
  name: "CuanBoss"
  type: "web-app"
  
defaults:
  docs_folder: "docs"
  design_folder: "docs/design"
  plans_folder: "docs/plans"
  
agents:
  code_style: "modern"
  testing: true
  documentation: true
```

## Getting Help

- Read the SKILL: `skills/cuanboss-workflow/SKILL.md`
- Check examples: `skills/cuanboss-workflow/examples/`
- Review command docs: `skills/cuanboss-workflow/commands/`
- See agent details: `skills/cuanboss-workflow/agents/`