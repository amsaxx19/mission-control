# CuanBoss Workflow System

A Claude Code-inspired workflow system for CuanBoss and TikTok Affiliate businesses.

## Quick Start

Use these commands to run workflows:

```bash
# End-to-end feature development
/implement "Add user authentication system"

# Create design documentation
/design "Design the affiliate dashboard"

# Generate work plan
/plan "Plan the TikTok content automation feature"

# Execute single task
/task "Create the database schema for users"

# Review code against design
/review --design="design.md" --code="src/"

# Diagnose a bug
/diagnose "Users can't log in after password reset"
```

## Commands Overview

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/implement` | Full feature development from requirements to code | Starting a new feature |
| `/design` | Create design docs (PRD, Tech Spec) | Before implementing complex features |
| `/plan` | Generate detailed work plan | Breaking down large features |
| `/task` | Execute a single, well-defined task | Specific implementation work |
| `/review` | Verify code matches design | After implementation |
| `/diagnose` | Investigate bugs | When something is broken |

## Specialized Agents

Agents are specialized skills that handle specific parts of the workflow:

| Agent | Purpose | Used By |
|-------|---------|---------|
| `requirement-analyzer` | Analyze and clarify requirements | `/implement`, `/design` |
| `prd-creator` | Create Product Requirements Docs | `/design` |
| `technical-designer` | Create technical specifications | `/design` |
| `work-planner` | Generate detailed task plans | `/plan` |
| `task-executor` | Execute implementation tasks | `/task`, `/implement` |
| `quality-fixer` | Fix quality issues | `/review` |
| `code-reviewer` | Review code quality | `/review` |

## Business Workflows

### CuanBoss Feature Development

```bash
# 1. Design the feature
/design "Design user subscription system for CuanBoss"

# 2. Plan the work
/plan --design="docs/design/subscription-system.md"

# 3. Implement
/implement --plan="docs/plans/subscription-plan.md"

# 4. Review
/review --design="docs/design/subscription-system.md" --code="src/subscription/"
```

### TikTok Affiliate Content Automation

```bash
# Full automation workflow
/implement "Create TikTok content scheduler that auto-posts affiliate videos"

# Or step by step:
/design "Design TikTok content automation system"
/plan --design="docs/design/tiktok-automation.md"
/task "Create video upload API client"
/task "Build content calendar scheduler"
/task "Implement analytics tracking"
```

### Marketing/Copywriting Workflows

```bash
# Generate marketing copy
/task "Create landing page copy for CuanBoss subscription feature"

# Email campaign
/task "Write email sequence for new affiliate onboarding"

# Ad copy
/task "Generate Facebook ad copy variations for TikTok Affiliate course"
```

### Business Operations

```bash
# Analytics dashboard
/implement "Create revenue analytics dashboard"

# User management
/task "Add bulk user import functionality"

# Reporting
/task "Generate monthly business report"
```

## File Structure

```
skills/cuanboss-workflow/
├── SKILL.md                      # This file
├── commands/
│   ├── implement.md             # /implement command
│   ├── design.md                # /design command
│   ├── plan.md                  # /plan command
│   ├── task.md                  # /task command
│   ├── review.md                # /review command
│   └── diagnose.md              # /diagnose command
├── agents/
│   ├── requirement-analyzer.md  # Requirement analysis agent
│   ├── prd-creator.md           # PRD creation agent
│   ├── technical-designer.md    # Technical design agent
│   ├── work-planner.md          # Work planning agent
│   ├── task-executor.md         # Task execution agent
│   ├── quality-fixer.md         # Quality fixing agent
│   └── code-reviewer.md         # Code review agent
└── examples/
    ├── cuanboss-subscription.md # Full subscription feature example
    ├── tiktok-automation.md     # TikTok content automation example
    └── marketing-campaign.md    # Marketing campaign example
```

## Tips

1. **Start with `/design`** for complex features (>2 days of work)
2. **Use `/plan`** to break down features into manageable chunks
3. **Iterate with `/task`** for incremental progress
4. **Always `/review`** before considering a feature complete
5. **Use `/diagnose`** when stuck on bugs

## Configuration

Create a `.cuanbossrc` file in your project root for defaults:

```yaml
# .cuanbossrc
project:
  name: "CuanBoss"
  type: "web-app"  # web-app, mobile-app, automation, marketing
  
defaults:
  docs_folder: "docs"
  design_folder: "docs/design"
  plans_folder: "docs/plans"
  
agents:
  code_style: "modern"  # modern, classic, minimal
  testing: true
  documentation: true
```

## Getting Help

- Read the specific command docs in `commands/`
- Check examples in `examples/`
- Review agent capabilities in `agents/`

---

**Workflow Philosophy:** Start with clarity (design), break into steps (plan), execute with quality (implement), verify thoroughly (review).