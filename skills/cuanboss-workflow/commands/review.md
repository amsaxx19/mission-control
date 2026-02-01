# /review Command

Verify code against design and quality standards.

## Usage

```bash
# Basic usage
/review --code="src/auth/"

# Against design
/review --design="docs/auth-design.md" --code="src/auth/"

# Specific files
/review --files="src/auth.js,src/middleware/auth.js"

# Full options
/review --design="design.md" --code="src/" --tests --security
```

## What It Does

Uses multiple agents to review code:

1. **Design Compliance** (`code-reviewer`) - Does code match the design?
2. **Quality Check** (`quality-fixer`) - Are there code quality issues?
3. **Security Review** - Are there security vulnerabilities?
4. **Test Coverage** - Are there adequate tests?

## Review Dimensions

### 1. Design Compliance

Checks if implementation matches design:

```markdown
## Design Compliance Review

### Requirements Coverage
| Requirement | Status | Notes |
|-------------|--------|-------|
| User registration | ✅ PASS | Implemented correctly |
| Email verification | ⚠️ PARTIAL | Missing resend logic |
| Password reset | ❌ MISSING | Not implemented |

### API Contract
| Endpoint | Spec | Implementation | Match |
|----------|------|----------------|-------|
| POST /auth/register | 201 + user | 201 + user | ✅ |
| POST /auth/login | 200 + token | 200 + token | ✅ |
| POST /auth/refresh | 200 + token | 404 | ❌ Missing |
```

### 2. Code Quality

Checks code standards:

```markdown
## Code Quality Review

### Issues Found
| Severity | File | Line | Issue | Suggestion |
|----------|------|------|-------|------------|
| 🔴 High | auth.js:45 | - | SQL injection risk | Use parameterized queries |
| 🟡 Medium | user.js:23 | - | Deep nesting | Refactor into smaller functions |
| 🟢 Low | utils.js:12 | - | Unused import | Remove `lodash` import |

### Code Style
- ✅ Consistent formatting
- ⚠️ Some variable names unclear (see line 34, 56)
- ✅ Good function documentation
```

### 3. Security Review

Checks for vulnerabilities:

```markdown
## Security Review

### Findings
| Severity | Category | Location | Issue | Fix |
|----------|----------|----------|-------|-----|
| 🔴 Critical | Auth | auth.js:78 | Hardcoded JWT secret | Use env variable |
| 🔴 Critical | Input | routes.js:45 | No input validation | Add Joi validation |
| 🟡 Medium | Headers | server.js:12 | Missing security headers | Add helmet.js |
| 🟡 Medium | CORS | server.js:34 | Overly permissive CORS | Restrict origins |

### Recommendations
1. Implement rate limiting on auth endpoints
2. Add request logging for security events
3. Use HTTPS-only cookies
```

### 4. Test Coverage

Analyzes test quality:

```markdown
## Test Coverage Review

### Coverage Report
| File | Lines | Covered | Percentage |
|------|-------|---------|------------|
| auth.js | 150 | 120 | 80% |
| user.js | 200 | 100 | 50% ⚠️ |
| utils.js | 50 | 50 | 100% ✅ |

### Test Quality
- ✅ Good test descriptions
- ⚠️ Missing edge case tests (empty input, special chars)
- ❌ No integration tests for auth flow
- ✅ Proper test isolation

### Missing Tests
- [ ] Rate limiting behavior
- [ ] Concurrent request handling
- [ ] Database connection failure
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--design` | Path to design document | None |
| `--code` | Path to code directory | Current directory |
| `--files` | Specific files to review | All in code path |
| `--tests` | Include test coverage analysis | true |
| `--security` | Include security review | true |
| `--fix` | Auto-fix issues where possible | false |
| `--format` | Output format: `markdown`, `json` | `markdown` |

## Review Process

```
Input: Code + Optional Design
  ↓
[Parse Design] (if provided)
  - Extract requirements
  - Identify contracts
  - Note constraints
  ↓
[Code Analysis]
  - Read implementation
  - Compare to design
  - Check patterns
  ↓
Parallel Reviews:
  ├─ [Design Compliance]
  ├─ [Code Quality]
  ├─ [Security Review]
  └─ [Test Coverage]
  ↓
[Aggregate Results]
  - Combine findings
  - Prioritize issues
  - Generate report
  ↓
[Auto-Fix] (if --fix)
  - Apply safe fixes
  - Report changes
  ↓
Output: Review report + fix suggestions
```

## Example Output

```markdown
# Code Review Report: Authentication System

**Overall Score: 72/100** 🟡

## Summary
- 12 issues found (2 critical, 5 medium, 5 low)
- 85% design compliance
- 65% test coverage

## Critical Issues (Must Fix)
1. **Hardcoded JWT Secret** (`auth.js:45`)
   - Security risk: credential exposure
   - Fix: Move to environment variable

2. **Missing Input Validation** (`routes.js:23`)
   - Security risk: injection attacks
   - Fix: Add validation middleware

## Medium Issues (Should Fix)
1. **Incomplete Error Handling** (`auth.js:67`)
   - Some errors not properly caught
   - Suggestion: Add try-catch blocks

## Recommendations
1. Add integration tests for full auth flow
2. Implement rate limiting
3. Add security headers

## Auto-Fixes Applied
✅ Removed unused imports (3 files)
✅ Fixed formatting issues (5 files)
✅ Added missing semicolons
```

## When to Use

✅ **Use for:**
- Before merging code
- After implementing features
- Code review preparation
- Finding bugs and issues
- Ensuring design compliance

❌ **Don't use for:**
- Exploration code
- Prototypes (unless checking security)
- Third-party code

## Integration with Workflow

### In `/implement`

```
/implement "feature"
  ↓
[Execute Tasks]
  ↓
[Auto Review] ← Uses /review internally
  ↓
[Fix Issues] ← Uses quality-fixer
  ↓
Done
```

### Standalone

```bash
# After manual implementation
/review --design="design.md" --code="src/" --fix

# Before PR
/review --code="src/" --security --tests
```

## Tips

1. **Always review against design** - Use `--design` when available
2. **Fix critical issues first** - Security > functionality > style
3. **Don't auto-fix everything** - Review suggested changes
4. **Run tests after fixes** - Ensure fixes don't break things
5. **Track issue patterns** - Update standards if same issues recur

## Related Commands

- `/implement` - Includes automatic review
- `/diagnose` - Deep dive into specific issues
- `/task` - Can include review flag