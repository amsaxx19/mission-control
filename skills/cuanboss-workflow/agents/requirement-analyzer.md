# Requirement Analyzer Agent

Analyzes and clarifies business requirements to ensure clear understanding before development.

## Purpose

Transforms vague ideas into well-defined, actionable requirements that can guide design and implementation.

## When to Use

- At the start of `/implement` or `/design` workflows
- When requirements are unclear or incomplete
- Before estimating work
- When scoping new features

## Capabilities

### 1. Requirement Extraction

From various inputs:
- Natural language descriptions
- User stories
- Existing documentation
- Stakeholder interviews (transcripts)
- Support tickets / feature requests

### 2. Clarification

Identifies and resolves:
- Ambiguous terms
- Missing context
- Conflicting requirements
- Unstated assumptions
- Unclear priorities

### 3. Structuring

Organizes requirements into:
- Functional requirements (what it does)
- Non-functional requirements (how it performs)
- User stories (who, what, why)
- Acceptance criteria (definition of done)
- Constraints (limitations, must-haves)

### 4. Validation

Checks for:
- Completeness
- Consistency
- Feasibility
- Testability
- Measurability

## Input/Output

### Input

```markdown
## Raw Requirement
"We need a system for users to manage their subscriptions. They should be able to upgrade, downgrade, and cancel. Also handle payments."
```

### Output

```markdown
# Analyzed Requirements: Subscription Management

## User Stories

### US-001: Upgrade Subscription
**As a** user on a basic plan  
**I want to** upgrade to a premium plan  
**So that** I can access advanced features

**Acceptance Criteria:**
- [ ] User sees upgrade option when viewing current plan
- [ ] User can preview features they'll gain
- [ ] Payment is processed immediately
- [ ] Access to new features is immediate
- [ ] Prorated charge is calculated correctly

### US-002: Downgrade Subscription
**As a** user on a premium plan  
**I want to** downgrade to a basic plan  
**So that** I can reduce my monthly cost

**Acceptance Criteria:**
- [ ] Downgrade takes effect at end of billing period
- [ ] User retains premium features until then
- [ ] User is notified of feature loss
- [ ] No refund issued (policy)

### US-003: Cancel Subscription
**As a** user with an active subscription  
**I want to** cancel my subscription  
**So that** I'm not charged again

**Acceptance Criteria:**
- [ ] User can cancel from account settings
- [ ] Cancellation takes effect at period end
- [ ] User can reactivate before period ends
- [ ] User receives confirmation email

## Functional Requirements

### FR-001: Plan Management
- System must support multiple subscription tiers
- Each tier has distinct features and pricing
- Users can view all available plans

### FR-002: Payment Processing
- Integration with Stripe for payments
- Support for credit cards and PayPal
- Automatic invoice generation
- Failed payment retry logic

### FR-003: Access Control
- Features gated by subscription tier
- Grace period for expired subscriptions (7 days)
- API rate limits by tier

## Non-Functional Requirements

### NFR-001: Performance
- Plan change processing < 5 seconds
- Payment processing < 10 seconds

### NFR-002: Security
- PCI compliance for payment data
- Audit log for all subscription changes
- Idempotency keys for payments

### NFR-003: Reliability
- 99.9% uptime for subscription APIs
- Automatic retry for failed webhooks

## Open Questions

1. Should downgrades include refunds? (Currently: no)
2. How many plan tiers? (Assumption: 3 - Basic, Pro, Enterprise)
3. Support for annual billing with discount? (Not in MVP)

## Constraints

- Must use existing Stripe account
- Must integrate with current auth system
- Must support existing user base without migration

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Stripe API changes | Medium | High | Abstract payment layer |
| Complex proration logic | High | Medium | Extensive testing |
| User confusion on downgrade | Medium | Medium | Clear messaging |
```

## Analysis Process

```
Input: Raw requirement
  ↓
[Parse & Understand]
  - Identify actors (who)
  - Identify actions (what)
  - Identify purpose (why)
  ↓
[Ask Clarifying Questions]
  - What's ambiguous?
  - What's missing?
  - What are the constraints?
  ↓
[Structure Requirements]
  - Group by type
  - Define acceptance criteria
  - Note dependencies
  ↓
[Validate]
  - Check completeness
  - Test for consistency
  - Assess feasibility
  ↓
Output: Structured requirements document
```

## Question Bank

### Clarifying Questions to Ask

**For User Features:**
- Who are the users? (personas)
- What's their current workflow?
- What problem does this solve?
- How will they measure success?

**For Technical Features:**
- What are the performance requirements?
- What's the scale? (users, data, requests)
- What are the integration points?
- What are the security requirements?

**For Business Logic:**
- What are the edge cases?
- What are the error scenarios?
- What are the business rules?
- What are the legal/compliance requirements?

**For Prioritization:**
- What's the MVP?
- What can be deferred?
- What's the deadline?
- What are the dependencies?

## Integration

### Used By

- `/implement` - Analyze before building
- `/design` - Clarify before designing
- `/plan` - Scope before planning

### Feeds Into

- `prd-creator` - Creates PRD from analyzed requirements
- `work-planner` - Plans based on clear requirements
- `task-executor` - Implements with full context

## Tips

1. **Don't assume** - Ask when unclear
2. **Start with "why"** - Understanding motivation helps
3. **Find the user** - Who benefits? What's their context?
4. **Define done** - How do we know it's working?
5. **Note what's out of scope** - Prevents scope creep

## Example Usage

```bash
# In /implement workflow
/implement "Add subscription management"
  ↓
[Requirement Analyzer]
  "Clarifying: What subscription tiers? Payment methods? ..."
  ↓
[Output Requirements Doc]
  ↓
[Continue to design...]
```