# Code Reviewer Agent

Comprehensive code review against design specifications and quality standards.

## Purpose

Evaluates code against design requirements, coding standards, security best practices, and test coverage.

## When to Use

- After implementation is complete
- Before merging code
- During `/implement` workflow
- For code quality gates
- When reviewing pull requests

## Capabilities

### 1. Design Compliance Review

Verifies implementation matches design:
- Requirements coverage
- API contract compliance
- UI/UX specification
- Data model accuracy

### 2. Code Quality Review

Evaluates code quality:
- Code style and conventions
- Complexity and maintainability
- Error handling
- Documentation

### 3. Security Review

Checks for vulnerabilities:
- Input validation
- Authentication/authorization
- Data exposure
- Injection attacks

### 4. Test Coverage Review

Analyzes test quality:
- Coverage percentage
- Test quality
- Edge cases
- Integration tests

## Review Dimensions

### Design Compliance

```markdown
## Design Compliance Review

### Requirements Checklist
| ID | Requirement | Status | Notes |
|----|-------------|--------|-------|
| FR-001 | User registration | ✅ PASS | Implemented correctly |
| FR-002 | Email validation | ✅ PASS | Uses regex + DNS check |
| FR-003 | Password hashing | ✅ PASS | bcrypt with salt rounds 12 |
| FR-004 | JWT tokens | ✅ PASS | Access + refresh tokens |
| FR-005 | Token refresh | ⚠️ PARTIAL | Refresh works but no rotation |
| FR-006 | Logout | ❌ MISSING | Not implemented |

### API Contract Compliance
| Endpoint | Spec | Implementation | Status |
|----------|------|----------------|--------|
| POST /auth/register | 201 + user | 201 + user | ✅ |
| POST /auth/login | 200 + tokens | 200 + tokens | ✅ |
| POST /auth/refresh | 200 + token | 200 + token | ✅ |
| POST /auth/logout | 204 | 404 | ❌ |
| GET /auth/me | 200 + user | 200 + user | ✅ |

### Coverage: 80% (4/5 requirements, 4/5 endpoints)
```

### Code Quality

```markdown
## Code Quality Review

### Metrics
| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| Lines of Code | 450 | < 1000 | ✅ |
| Cyclomatic Complexity | 8 | < 10 | ✅ |
| Cognitive Complexity | 12 | < 15 | ⚠️ |
| Function Length (avg) | 15 | < 20 | ✅ |
| File Length (max) | 180 | < 300 | ✅ |

### Issues Found

#### 🔴 High Priority (2)
| File | Line | Issue | Recommendation |
|------|------|-------|----------------|
| `auth.ts:78` | 78 | SQL injection risk | Use parameterized queries |
| `middleware.ts:23` | 23 | No error handling | Add try-catch wrapper |

#### 🟡 Medium Priority (5)
| File | Line | Issue | Recommendation |
|------|------|-------|----------------|
| `service.ts:45` | 45 | Deep nesting (4 levels) | Extract helper functions |
| `utils.ts:12` | 12 | Unused parameter `options` | Remove or use |
| `routes.ts:67` | 67 | Magic number (86400) | Extract as constant |
| `db.ts:34` | 34 | Missing return type | Add explicit type |
| `test.ts:89` | 89 | Test without assertion | Add expect() |

#### 🟢 Low Priority (3)
| File | Line | Issue | Recommendation |
|------|------|-------|----------------|
| `auth.ts:12` | 12 | Import order | Group by type |
| `user.ts:45` | 45 | Trailing whitespace | Remove |
| `api.ts:56` | 56 | Inconsistent naming | Use camelCase |

### Code Style
✅ Consistent formatting (Prettier)
✅ ESLint passes
⚠️ Some variable names unclear
✅ Good JSDoc on public functions
```

### Security Review

```markdown
## Security Review

### Authentication
✅ JWT uses secure algorithm (RS256)
✅ Tokens have expiration
⚠️ No token rotation on refresh
❌ Logout doesn't invalidate tokens

### Authorization
✅ Middleware checks authentication
⚠️ No role-based checks yet
✅ User can only access own data

### Input Validation
✅ Email format validated
✅ Password length enforced
❌ No rate limiting on login
⚠️ Error messages reveal user existence

### Data Protection
✅ Passwords hashed (bcrypt)
✅ No passwords in logs
✅ HTTPS only
⚠️ JWT stored in localStorage (XSS risk)

### Findings
| Severity | Category | Location | Issue | Fix |
|----------|----------|----------|-------|-----|
| 🔴 Critical | Injection | `auth.ts:78` | String concatenation in SQL | Use query params |
| 🔴 Critical | Auth | `auth.ts:156` | Hardcoded JWT secret | Use env var |
| 🟡 Medium | Validation | `routes.ts:45` | No rate limiting | Add express-rate-limit |
| 🟡 Medium | Exposure | `errors.ts:23` | Detailed error messages | Sanitize errors |
| 🟡 Medium | Storage | `client.ts:12` | localStorage for token | Use httpOnly cookies |
| 🟢 Low | Headers | `server.ts:34` | Missing security headers | Add helmet.js |

### Recommendations
1. Implement rate limiting (5 attempts per 15 min)
2. Use httpOnly cookies for refresh tokens
3. Add helmet.js for security headers
4. Sanitize all error responses
5. Implement proper logout with token blacklisting
```

### Test Coverage

```markdown
## Test Coverage Review

### Coverage Summary
| File | Lines | Covered | % | Status |
|------|-------|---------|---|--------|
| `auth.ts` | 156 | 140 | 90% | ✅ |
| `routes.ts` | 89 | 67 | 75% | ⚠️ |
| `service.ts` | 234 | 156 | 67% | ❌ |
| `utils.ts` | 45 | 45 | 100% | ✅ |
| **Total** | **524** | **408** | **78%** | ⚠️ |

### Test Quality
✅ Descriptive test names
✅ Proper setup/teardown
✅ Test isolation
⚠️ Missing edge cases
❌ No integration tests

### Missing Test Cases
| Function | Missing Cases |
|----------|---------------|
| `login()` | SQL injection attempt, locked account, concurrent requests |
| `register()` | Duplicate email race condition, very long inputs |
| `refresh()` | Expired refresh token, reused token, invalid signature |
| `validateToken()` | Malformed token, wrong algorithm, missing claims |

### Recommendations
1. Add integration tests for full auth flow
2. Test error scenarios (database down, network failure)
3. Add property-based tests for validation
4. Test with realistic data volumes
```

## Review Process

```
Input: Code + Design Doc (optional)
  ↓
[Parse Code]
  - Read all files
  - Build AST
  - Identify patterns
  ↓
[Analyze]
  ├─ Compare to design (if provided)
  ├─ Check code quality
  ├─ Scan for security issues
  └─ Analyze test coverage
  ↓
[Generate Report]
  - Compile findings
  - Prioritize issues
  - Calculate metrics
  - Suggest fixes
  ↓
Output: Comprehensive review report
```

## Scoring

### Overall Score Calculation

```
Design Compliance:  30% weight
Code Quality:       25% weight
Security:           25% weight
Test Coverage:      20% weight

Score = (Design * 0.3) + (Quality * 0.25) + (Security * 0.25) + (Tests * 0.2)

Grading:
90-100: A (Excellent)
80-89:  B (Good)
70-79:  C (Acceptable)
60-69:  D (Needs Work)
< 60:   F (Major Issues)
```

## Review Checklist

### Design Compliance
- [ ] All requirements implemented
- [ ] API matches specification
- [ ] Data models correct
- [ ] UI/UX matches design
- [ ] Business logic correct

### Code Quality
- [ ] Follows style guide
- [ ] Proper naming
- [ ] Functions are focused
- [ ] No code duplication
- [ ] Appropriate comments
- [ ] Documentation complete

### Security
- [ ] Input validated
- [ ] Output encoded
- [ ] AuthZ checks present
- [ ] No secrets in code
- [ ] SQL injection safe
- [ ] XSS prevented

### Testing
- [ ] Unit tests present
- [ ] Edge cases covered
- [ ] Integration tests
- [ ] > 80% coverage
- [ ] Tests are deterministic
- [ ] Mocking appropriate

## Report Format

```markdown
# Code Review Report
**Project:** CuanBoss Auth System  
**Reviewer:** Code Reviewer Agent  
**Date:** 2024-01-15  
**Overall Score:** 82/100 (B)

## Executive Summary
Good implementation with solid foundation. Main issues:
1. Missing logout functionality
2. Some security improvements needed
3. Test coverage below target on service layer

## Scores
| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Design Compliance | 85/100 | 30% | 25.5 |
| Code Quality | 88/100 | 25% | 22.0 |
| Security | 75/100 | 25% | 18.75 |
| Test Coverage | 78/100 | 20% | 15.6 |
| **Total** | | | **81.85** |

## Critical Issues (Must Fix)
1. **SQL Injection Risk** (`auth.ts:78`)
   - Current: `db.query(`SELECT * FROM users WHERE email = '${email}'`)`
   - Fix: Use parameterized queries

2. **Hardcoded Secret** (`auth.ts:156`)
   - Current: `const SECRET = 'my-secret-key'`
   - Fix: Use `process.env.JWT_SECRET`

## Action Items
- [ ] Fix SQL injection
- [ ] Move secrets to env
- [ ] Add rate limiting
- [ ] Implement logout
- [ ] Increase test coverage to 80%
- [ ] Add integration tests

## Positive Findings
✅ Good separation of concerns
✅ Proper use of async/await
✅ Comprehensive input validation
✅ Clean error handling pattern
```

## Integration

### Used By
- `/review` command
- `/implement` workflow
- CI/CD pipelines

### Workflow

```
/implement "feature"
  ↓
[Task Executor] → Implementation
  ↓
[Code Reviewer] → Review report
  ↓
├─ Score >= 90? → Done
└─ Score < 90? → [Quality Fixer] → Review again
```

## Tips

1. **Review against design** - Use `--design` when available
2. **Prioritize security** - Never compromise on security
3. **Be specific** - Point to exact lines and suggest fixes
4. **Balance feedback** - Note good patterns too
5. **Consider context** - Is this MVP or production?

## Example Usage

```bash
# Full review
/review --design="docs/design.md" --code="src/" --tests --security

# Quick review
/review --code="src/auth.ts"

# In implement workflow
/implement "feature"  # Auto-reviews after each task
```