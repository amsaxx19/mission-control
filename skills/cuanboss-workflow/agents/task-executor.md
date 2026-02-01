# Task Executor Agent

Executes implementation tasks with code generation, file creation, and quality verification.

## Purpose

Takes a specific task definition and implements it completely, including code, tests, and documentation.

## When to Use

- When a clear, specific task is defined
- For individual work items from a plan
- For bug fixes with clear scope
- For refactoring tasks
- As part of `/implement` workflow

## Capabilities

### 1. Code Generation

Writes production-quality code:
- Follows project conventions
- Includes error handling
- Adds appropriate comments
- Uses modern best practices

### 2. File Management

Creates and modifies:
- Source files
- Configuration files
- Test files
- Documentation

### 3. Integration

Connects with existing code:
- Imports and dependencies
- API integration
- Database models
- External services

### 4. Verification

Ensures quality:
- Runs tests
- Checks for syntax errors
- Validates against requirements
- Reports what was done

## Input/Output

### Input

```markdown
## Task T-007: Implement JWT Authentication

**Duration:** 3h  
**Dependencies:** T-001, T-003

**Description:**
Create JWT-based authentication system with access and refresh tokens.

**Tasks:**
- [ ] Install JWT libraries
- [ ] Create auth service
- [ ] Implement login endpoint
- [ ] Implement token refresh
- [ ] Create auth middleware
- [ ] Add logout functionality

**Acceptance Criteria:**
- [ ] Login returns tokens
- [ ] Middleware validates tokens
- [ ] Refresh works with valid token
- [ ] Logout invalidates tokens

**Files to Create:**
- `src/services/auth.ts`
- `src/middleware/auth.ts`
- `src/routes/auth.ts`

**Context:**
- Using Express + TypeScript
- PostgreSQL with Prisma
- JWT secret from env
```

### Output

```markdown
## Task Completed: T-007 - JWT Authentication

### Files Created

#### src/services/auth.ts
Created authentication service with:
- `generateTokens(user)` - Creates access + refresh tokens
- `verifyAccessToken(token)` - Validates access tokens
- `verifyRefreshToken(token)` - Validates refresh tokens
- `revokeRefreshToken(token)` - Invalidates tokens on logout

#### src/middleware/auth.ts
Created authentication middleware:
- Extracts Bearer token from header
- Validates JWT signature
- Attaches user to request
- Returns 401 for invalid tokens

#### src/routes/auth.ts
Created authentication routes:
- POST /auth/login - Validates credentials, returns tokens
- POST /auth/refresh - Returns new access token
- POST /auth/logout - Revokes refresh token

### Dependencies Added
```json
{
  "jsonwebtoken": "^9.0.0",
  "@types/jsonwebtoken": "^9.0.0"
}
```

### Tests Created
- `tests/auth.test.ts` - 8 tests covering:
  - Login with valid credentials
  - Login with invalid credentials
  - Token generation
  - Token verification
  - Token refresh
  - Token revocation
  - Protected route access
  - Expired token handling

### Environment Variables Required
```bash
JWT_SECRET=your-secret-key-min-32-characters
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

### Usage Example
```typescript
// Protect a route
import { authenticate } from '../middleware/auth';

app.get('/api/protected', authenticate, (req, res) => {
  // req.user is available here
  res.json({ user: req.user });
});
```

### Verification Results
✅ All tests pass (8/8)
✅ TypeScript compiles without errors
✅ No linting errors
✅ Code follows project conventions

### Next Steps
1. Add rate limiting to auth endpoints
2. Implement password reset flow
3. Add email verification
```

## Execution Process

```
Input: Task definition
  ↓
[Analyze Task]
  - Understand requirements
  - Identify files needed
  - Check dependencies
  - Review existing code
  ↓
[Plan Implementation]
  - Design solution
  - Identify patterns
  - Plan file structure
  - Consider edge cases
  ↓
[Execute]
  ├─ Install dependencies
  ├─ Create/modify files
  ├─ Write tests
  └─ Add documentation
  ↓
[Verify]
  ├─ Run tests
  ├─ Check compilation
  ├─ Run linter
  └─ Validate against criteria
  ↓
[Report]
  - Summarize changes
  - Note any issues
  - Suggest next steps
  ↓
Output: Completed task
```

## Task Types

### Backend Implementation

```markdown
## Task: Create User API Endpoints

**Requirements:**
- CRUD operations for users
- Input validation
- Pagination on list
- Search by email

**Context:**
- Express + TypeScript
- Prisma ORM
- PostgreSQL
```

Agent will:
1. Read existing user model
2. Create service layer
3. Create route handlers
4. Add validation middleware
5. Write tests
6. Update API docs

### Frontend Implementation

```markdown
## Task: Build User Profile Form

**Requirements:**
- Edit name, email, avatar
- Validation
- Auto-save
- Responsive design

**Context:**
- React + TypeScript
- Tailwind CSS
- React Hook Form
- TanStack Query
```

Agent will:
1. Create form component
2. Add validation schema
3. Integrate with API
4. Add loading states
5. Handle errors
6. Add tests

### Database Work

```markdown
## Task: Add User Preferences

**Requirements:**
- Add preferences table
- Link to users
- Store notification settings
- Store theme preference

**Context:**
- Prisma ORM
- PostgreSQL
```

Agent will:
1. Update schema
2. Create migration
3. Add relations
4. Update types
5. Create seed data
6. Add tests

### Integration Work

```markdown
## Task: Integrate Stripe Payments

**Requirements:**
- Create checkout session
- Handle webhook
- Update subscription status
- Send confirmation email

**Context:**
- Existing subscription system
- Express backend
```

Agent will:
1. Install Stripe SDK
2. Create checkout endpoint
3. Implement webhook handler
4. Add signature verification
5. Update database on events
6. Add tests with mocks

## Code Style Guidelines

### TypeScript/JavaScript

```typescript
// Good: Explicit types, error handling
async function getUserById(id: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    logger.error('Failed to get user', { id, error });
    throw new DatabaseError('Failed to retrieve user');
  }
}

// Bad: Missing types, no error handling
function getUser(id) {
  return db.user.find(id);
}
```

### Error Handling

```typescript
// Good: Specific errors, logging
class AuthenticationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

// In route handler
try {
  const user = await authService.login(email, password);
  res.json({ user });
} catch (error) {
  if (error instanceof AuthenticationError) {
    return res.status(401).json({ 
      error: error.message,
      code: error.code 
    });
  }
  logger.error('Login failed', { error });
  res.status(500).json({ error: 'Internal server error' });
}
```

### Testing

```typescript
// Good: Descriptive tests, setup/teardown
describe('AuthService', () => {
  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      await createUser({ email, password });

      // Act
      const result = await authService.login(email, password);

      // Assert
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw for invalid password', async () => {
      await expect(
        authService.login('test@example.com', 'wrong')
      ).rejects.toThrow(AuthenticationError);
    });
  });
});
```

## Verification Checklist

Before completing a task, the agent verifies:

- [ ] **Code Quality**
  - [ ] Follows project conventions
  - [ ] Properly typed (TypeScript)
  - [ ] No console.logs (use logger)
  - [ ] Consistent formatting

- [ ] **Functionality**
  - [ ] Meets acceptance criteria
  - [ ] Handles edge cases
  - [ ] Proper error handling
  - [ ] Input validation

- [ ] **Testing**
  - [ ] Unit tests written
  - [ ] Tests pass
  - [ ] Edge cases covered
  - [ ] >80% coverage (target)

- [ ] **Integration**
  - [ ] Works with existing code
  - [ ] No breaking changes
  - [ ] Dependencies resolved
  - [ ] Configuration documented

- [ ] **Documentation**
  - [ ] Code comments where needed
  - [ ] JSDoc for public APIs
  - [ ] Usage examples
  - [ ] README updated if needed

## Error Handling

When a task cannot be completed:

1. **Partial Completion**
   - Report what was completed
   - Note what remains
   - Explain blockers

2. **Issues Found**
   - Document the problem
   - Suggest solutions
   - Recommend next steps

3. **Needs Clarification**
   - Ask specific questions
   - Note assumptions made
   - Request more context

## Integration

### Used By
- `/task` command
- `/implement` workflow

### Works With
- `work-planner` - Receives tasks to execute
- `code-reviewer` - Can request review
- `quality-fixer` - Can request fixes

## Tips

1. **Read existing code first** - Understand patterns
2. **Start simple** - Add complexity incrementally
3. **Test as you go** - Don't leave it to the end
4. **Handle errors** - Plan for failure
5. **Document assumptions** - Note when unclear
6. **Verify before done** - Run tests, check compilation

## Example Usage

```bash
/task "Create API endpoint for user registration with email validation and password hashing"

# Agent will:
# 1. Check existing auth code
# 2. Create registration route
# 3. Add validation (Joi/Zod)
# 4. Hash password (bcrypt)
# 5. Save to database
# 6. Return tokens
# 7. Write tests
# 8. Report completion
```