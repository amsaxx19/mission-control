# Quality Fixer Agent

Automatically fixes code quality issues identified during review.

## Purpose

Applies automated fixes for common code quality problems to maintain high standards.

## When to Use

- During `/review` when `--fix` flag is set
- After code review identifies issues
- As part of CI/CD quality gates
- For bulk formatting/style fixes

## Capabilities

### 1. Style Fixes

Automatic formatting:
- Linting errors (ESLint)
- Code formatting (Prettier)
- Import ordering
- Whitespace cleanup

### 2. Code Improvements

Simple refactoring:
- Remove unused imports/variables
- Simplify expressions
- Fix common anti-patterns
- Update deprecated APIs

### 3. Security Fixes

Auto-fixable security issues:
- Add missing security headers
- Fix regex DoS vulnerabilities
- Update vulnerable dependencies
- Add input validation

### 4. Test Fixes

Fix test issues:
- Update snapshots
- Fix async/await in tests
- Correct assertion syntax

## Fix Categories

### Safe Fixes (Auto-Apply)

These are safe to apply automatically:

```typescript
// Fix: Unused imports
import { useState, useEffect } from 'react'; // useEffect not used
// → Remove useEffect

// Fix: Double quotes to single
const message = "Hello";  
// → const message = 'Hello';

// Fix: Missing semicolon
const x = 1
// → const x = 1;

// Fix: Trailing whitespace
const name = 'John';   
// → const name = 'John';

// Fix: Console.log removal (in production code)
console.log('Debug:', data);
// → Remove or replace with logger
```

### Suggested Fixes (Manual Review)

These require human review:

```typescript
// Suggest: Complex function splitting
function processData(data) {
  // 100+ lines of code
  // Multiple responsibilities
}
// → Consider splitting into smaller functions

// Suggest: Add error handling
db.query('SELECT * FROM users');
// → Wrap in try-catch

// Suggest: Type safety
function add(a, b) { return a + b; }
// → function add(a: number, b: number): number
```

## Fix Process

```
Input: Code with issues
  ↓
[Analyze Issues]
  - Categorize by type
  - Assess safety
  - Estimate impact
  ↓
[Apply Safe Fixes]
  ├─ Formatting
  ├─ Linting
  ├─ Dead code removal
  └─ Simple refactoring
  ↓
[Generate Suggestions]
  - Complex fixes
  - Architecture changes
  - Security improvements
  ↓
[Report]
  - What was fixed
  - What needs review
  - Before/after comparison
  ↓
Output: Fixed code + suggestions
```

## Integration with Review

### During /review

```bash
/review --code="src/" --fix
```

The review process:
1. Identify issues
2. Apply safe fixes
3. Report remaining issues as suggestions
4. Show diff of changes

### Example Output

```markdown
# Quality Fix Report

## Applied Fixes (8)

| File | Issue | Fix |
|------|-------|-----|
| `auth.ts:12` | Unused import | Removed `lodash` |
| `auth.ts:45` | Double quotes | Changed to single |
| `user.ts:23` | Missing semicolon | Added semicolon |
| `api.ts:67` | Console.log | Replaced with logger |
| `utils.ts:5` | Trailing space | Removed |
| `utils.ts:12` | Unused variable | Removed `temp` |
| `db.ts:34` | Missing await | Added await |
| `test.ts:56` | Old snapshot | Updated snapshot |

## Suggested Fixes (3)

### S-001: Split large function
**File:** `service.ts:89`
**Issue:** Function has 80 lines, multiple responsibilities
**Suggestion:** Split into `validateInput()`, `processData()`, `formatOutput()`

### S-002: Add error handling
**File:** `routes.ts:45`
**Issue:** No try-catch around database call
**Suggestion:** Wrap in try-catch with proper error response

### S-003: Add type safety
**File:** `utils.ts:12`
**Issue:** Function missing TypeScript types
**Suggestion:** Add explicit parameter and return types

## Verification
✅ All auto-fixes applied
⚠️ 3 issues require manual review
✅ No breaking changes introduced
✅ Tests still pass
```

## Fix Rules

### ESLint Fixes

| Rule | Auto-Fix | Description |
|------|----------|-------------|
| `no-unused-vars` | ✅ | Remove unused variables |
| `prefer-const` | ✅ | Change `let` to `const` |
| `quotes` | ✅ | Normalize quote style |
| `semi` | ✅ | Add/remove semicolons |
| `indent` | ✅ | Fix indentation |
| `eqeqeq` | ✅ | Change `==` to `===` |
| `no-console` | ⚠️ | Flag for review |
| `complexity` | ❌ | Suggest refactoring |
| `no-any` | ❌ | Add types manually |

### Prettier Fixes

Always auto-fix:
- Line length
- Bracket spacing
- Trailing commas
- Arrow function parentheses
- JSX formatting

### TypeScript Fixes

| Issue | Auto-Fix | Action |
|-------|----------|--------|
| Unused import | ✅ | Remove |
| Missing return type | ⚠️ | Suggest type |
| Implicit any | ❌ | Manual fix |
| Unused parameter | ⚠️ | Prefix with `_` |

## Configuration

### Fix Preferences

```yaml
# .cuanbossrc
quality:
  auto_fix:
    - formatting      # Always fix
    - linting         # Fix safe issues
    - imports         # Remove unused
    
  suggest_only:
    - complexity      # High cyclomatic complexity
    - security        # Security issues
    - types           # Type improvements
    
  never_fix:
    - logic           # Logic changes
    - architecture    # Structural changes
```

## Safety Rules

### Never Auto-Fix

1. **Logic changes** - Could break functionality
2. **Architecture changes** - Need design review
3. **Public API changes** - Breaking changes
4. **Database migrations** - Too risky
5. **Configuration changes** - Could break deploy

### Flag for Review

1. **Security fixes** - Important to verify
2. **Performance changes** - May need testing
3. **Dependency updates** - Check compatibility
4. **Test changes** - Ensure correctness

## Integration

### Used By
- `/review` with `--fix` flag
- `/implement` (automatic after tasks)
- CI/CD pipelines

### Workflow

```
/implement "feature"
  ↓
[Task Executor] → Code
  ↓
[Code Reviewer] → Issues found
  ↓
[Quality Fixer] → Applies safe fixes
  ↓
[Report] → Remaining issues for manual fix
  ↓
Continue or stop for review
```

## Tips

1. **Always review auto-fixes** - Even "safe" ones
2. **Run tests after fixes** - Ensure nothing broke
3. **Don't fix logic** - Only style and structure
4. **Keep fixes small** - One issue type at a time
5. **Document exceptions** - When not to auto-fix

## Example Usage

```bash
# During review
/review --code="src/" --fix

# Standalone quality fix
/task "Apply code quality fixes to auth module"
```