# /implement Command

End-to-end feature development from requirements to working code.

## Usage

```bash
# Basic usage
/implement "Description of the feature to build"

# With options
/implement "Add user authentication" --design="docs/auth-design.md"
/implement "Create dashboard" --plan="docs/dashboard-plan.md"
/implement "Build API" --tech="Node.js,Express,PostgreSQL"
```

## What It Does

1. **Analyzes Requirements** - Uses `requirement-analyzer` to understand what needs to be built
2. **Creates Design** (optional) - Uses `prd-creator` and `technical-designer` for complex features
3. **Plans Work** - Uses `work-planner` to break down into tasks
4. **Executes Tasks** - Uses `task-executor` to implement each component
5. **Reviews Quality** - Uses `code-reviewer` and `quality-fixer` to ensure standards

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--design` | Path to existing design document | Auto-generate if complex |
| `--plan` | Path to existing work plan | Auto-generate |
| `--tech` | Tech stack to use | Project default |
| `--no-tests` | Skip test generation | false |
| `--no-docs` | Skip documentation | false |
| `--quick` | Skip design phase for simple features | false |

## Workflow

```
Input: Feature description
  ↓
[Requirement Analysis]
  ↓
Is feature complex?
  ├─ YES → [Create PRD] → [Create Tech Design]
  └─ NO  → (skip design)
  ↓
[Generate Work Plan]
  ↓
For each task:
  [Execute Task] → [Quick Review]
  ↓
[Final Review]
  ↓
Output: Working feature + tests + docs
```

## Example

```bash
/implement "Add user subscription system with Stripe integration"
```

This will:
1. Analyze the subscription requirements
2. Create design docs (PRD + Tech Spec)
3. Generate work plan with tasks like:
   - Set up Stripe SDK
   - Create subscription database models
   - Build subscription API endpoints
   - Create checkout UI
   - Add webhook handlers
   - Write tests
4. Execute each task
5. Review and fix any issues

## Output

- `docs/design/subscription-system-prd.md` - Product requirements
- `docs/design/subscription-system-tech.md` - Technical specification
- `docs/plans/subscription-implementation.md` - Work plan
- `src/subscription/` - Implementation
- `tests/subscription/` - Tests
- `docs/guides/subscription-usage.md` - Usage documentation

## When to Use

✅ **Use for:**
- New features (> few hours of work)
- Complex bug fixes
- Refactoring projects
- Integration work

❌ **Don't use for:**
- Quick one-liners
- Simple configuration changes
- Documentation-only updates

## Tips

1. Be specific in your description - include key requirements
2. Use `--quick` for features you understand well
3. Provide `--design` if you already have requirements defined
4. Check the generated plan before full execution
5. Review each task output as it completes

## Related Commands

- `/design` - Create design documents only
- `/plan` - Generate work plan only
- `/task` - Execute a single task