# /diagnose Command

Deep investigation of bugs and issues.

## Usage

```bash
# Basic usage
/diagnose "Users can't log in after password reset"

# With context
/diagnose "Intermittent 500 errors" --logs="logs/app.log"
/diagnose "Memory leak" --code="src/worker.js" --profile

# Full investigation
/diagnose "Slow API responses" --trace --metrics --code="src/api/"
```

## What It Does

Systematically investigates issues:

1. **Understand Symptoms** - Clarify what's happening
2. **Gather Evidence** - Logs, metrics, code
3. **Form Hypotheses** - Possible causes
4. **Test Hypotheses** - Verify each theory
5. **Identify Root Cause** - Find the actual problem
6. **Recommend Fix** - Solution with implementation

## Investigation Areas

### Bug Investigation

```bash
/diagnose "User sessions expiring too quickly"
```

Process:
1. Check session configuration
2. Review token generation code
3. Examine session storage
4. Verify cookie settings
5. Test session lifecycle

### Performance Issues

```bash
/diagnose "API response time > 5 seconds"
```

Process:
1. Profile slow endpoints
2. Check database queries
3. Analyze external API calls
4. Review caching strategy
5. Identify bottlenecks

### Error Investigation

```bash
/diagnose "Intermittent 'Connection refused' errors"
```

Process:
1. Analyze error patterns
2. Check service health
3. Review connection pooling
4. Examine retry logic
5. Test network reliability

### Memory Issues

```bash
/diagnose "Memory usage growing over time"
```

Process:
1. Take heap snapshots
2. Identify growing objects
3. Check for leaks in closures
4. Review event listeners
5. Analyze garbage collection

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--logs` | Path to log files | Auto-detect |
| `--code` | Code to investigate | Auto-detect |
| `--trace` | Enable execution tracing | false |
| `--profile` | Enable profiling | false |
| `--metrics` | Include metrics data | Auto-detect |
| `--time-range` | Time range for logs | "last 24h" |
| `--reproduce` | Create reproduction script | false |

## Diagnostic Process

```
Input: Issue description
  ↓
[Clarify Symptoms]
  - What exactly is happening?
  - When does it occur?
  - Who is affected?
  ↓
[Gather Evidence]
  ├─ Read logs
  ├─ Check metrics
  ├─ Review code
  └─ Examine config
  ↓
[Form Hypotheses]
  - List possible causes
  - Rank by likelihood
  - Note evidence for/against
  ↓
[Test Hypotheses]
  - Check each theory
  - Gather more data if needed
  - Eliminate unlikely causes
  ↓
[Identify Root Cause]
  - Confirm the problem
  - Understand why it happens
  - Trace to origin
  ↓
[Recommend Solution]
  - Immediate fix
  - Long-term prevention
  - Testing approach
  ↓
Output: Diagnostic report + fix plan
```

## Example Output

```markdown
# Diagnostic Report: Session Timeout Issue

## Problem Statement
Users report being logged out after 15 minutes instead of the configured 24 hours.

## Symptoms
- Sessions expire at ~15 min consistently
- Affects all users
- Started after v2.3.0 deployment
- No errors in logs

## Investigation

### Log Analysis
```
[2024-01-15 14:23:45] Session created, TTL: 86400
[2024-01-15 14:38:45] Session expired  <-- 15 min later!
```

### Code Review
Found in `src/session/store.js:45`:
```javascript
// Redis TTL is in seconds, but we were passing milliseconds
redis.setex(key, ttl * 1000, data);  // BUG: 86400 * 1000 = too large
```

Redis max TTL is ~24 days in seconds. 86400000 exceeds this,
causing Redis to reject the SETEX command, session falls back
to default 15 min.

## Root Cause
**Redis SETEX with TTL in milliseconds instead of seconds**

Introduced in commit `a1b2c3d` during session refactor.

## Fix

### Immediate (1 line)
```javascript
redis.setex(key, ttl, data);  // Remove * 1000
```

### Verification
```bash
# Test with 1 hour TTL
npm test -- session.test.js
# Manually verify in Redis
redis-cli TTL session:test
```

### Prevention
1. Add unit test for TTL values
2. Add integration test for session duration
3. Document Redis TTL units in code
```

## Investigation Techniques

### 1. Log Analysis

```bash
# Find patterns
/diagnose "500 errors" --logs="logs/app.log"

# Looks for:
# - Error frequency
# - Stack traces
# - Correlation with events
# - User patterns
```

### 2. Code Analysis

```bash
# Review specific code
/diagnose "Race condition" --code="src/concurrent.js"

# Looks for:
# - Shared state
# - Async timing
# - Lock mechanisms
# - Synchronization
```

### 3. Performance Profiling

```bash
# Profile slow operations
/diagnose "Slow queries" --profile --code="src/db/"

# Analyzes:
# - Query execution time
# - Index usage
# - N+1 queries
# - Connection pooling
```

### 4. State Inspection

```bash
# Debug data issues
/diagnose "Data inconsistency" --trace

# Traces:
# - Data flow
# - Transformations
# - State changes
# - Side effects
```

## Common Issue Patterns

### Authentication Issues
```bash
/diagnose "Login not working"
# Checks: token validation, session storage, cookie settings, CORS
```

### Database Issues
```bash
/diagnose "Database connection failures"
# Checks: connection string, pool settings, network, credentials
```

### API Issues
```bash
/diagnose "API returning wrong data"
# Checks: request parsing, business logic, serialization, caching
```

### Integration Issues
```bash
/diagnose "Stripe webhook not received"
# Checks: endpoint registration, signature validation, error handling
```

## When to Use

✅ **Use for:**
- Bugs you can't solve quickly
- Recurring issues
- Performance problems
- Mysterious errors
- System degradation

❌ **Don't use for:**
- Syntax errors (obvious fix)
- Missing features
- Configuration typos
- Known issues with documented fixes

## Tips

1. **Be specific** - "It's slow" → "API X takes 5s for user Y"
2. **Gather data first** - Logs, metrics, reproduction steps
3. **Check recent changes** - Git log often reveals the culprit
4. **Test hypotheses quickly** - Don't get stuck on one theory
5. **Document findings** - Help future-you and the team

## Output Actions

After diagnosis, you can:

```bash
# Apply the recommended fix
/task "Apply the fix from diagnosis report"

# Create reproduction test
/task "Create test case for the bug"

# Update monitoring
/task "Add alert for this issue"
```

## Related Commands

- `/task` - Implement the fix
- `/review` - Check if fix introduces issues
- `/plan` - Plan comprehensive solution