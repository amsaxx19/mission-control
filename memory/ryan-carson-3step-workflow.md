# Ryan Carson's 3-Step AI Dev Workflow

**Source:** https://github.com/snarktank/ai-dev-tasks  
**Pelajari:** 2 Feb 2026

---

## Core Philosophy

Stop wrestling with monolithic AI requests. Start guiding AI collaborator step-by-step dengan structure, clarity, and control.

**Problem:** Building complex features with AI feels like black box.  
**Solution:** Structured workflow with checkpoints and verification.

---

## The 3-Step Workflow

### Step 1: Create Product Requirement Document (PRD)

**Purpose:** Blueprint untuk feature — clarify what, for whom, and why.

**Prompt:**
```
Use @create-prd.md
Here's the feature I want to build: [Describe feature in detail]
Reference these files: [Optional: @file1.py @file2.ts]
```

**Output:** `MyFeature-PRD.md`

**Key Sections:**
- Overview & objectives
- User stories
- Functional requirements
- Non-functional requirements
- Technical considerations
- Success criteria

---

### Step 2: Generate Task List from PRD

**Purpose:** Break down PRD into granular, actionable tasks.

**Prompt:**
```
Now take @MyFeature-PRD.md and create tasks using @generate-tasks.md
```

**Output:** `MyFeature-Tasks.md`

**Task Format:**
```markdown
## Task 1: [Name]
- [ ] Subtask 1.1
- [ ] Subtask 1.2
- [ ] Verification criteria

## Task 2: [Name]
- [ ] Subtask 2.1
- [ ] Verification criteria
```

---

### Step 3: Execute Tasks Systematically

**Purpose:** Guide AI tackle one task at a time with review & approval.

**Prompt:**
```
Use @process-task-list.md
Work on Task 1 from @MyFeature-Tasks.md
```

**Rules:**
- One task at a time
- Verification before moving on
- Human review at each checkpoint
- Update task list as completed

---

## Apply ke Mission Control / Agent System

### Current Kita:
- ❌ Monolithic requests ("build payment system")
- ❌ No structured PRD
- ❌ No task breakdown
- ❌ Agents work in black box

### With Ryan Carson Method:

#### For Human → Jarvis (Coordinator)
```
Amos: "I need payment gateway"

Jarvis (Step 1 - Create PRD):
- Analyzes request
- Creates PRD: "Payment Gateway Integration"
  - Overview: Midtrans + Xendit
  - Features: VA, E-wallet, QRIS
  - Success criteria: Working payments

Jarvis (Step 2 - Generate Tasks):
- Breaks into tasks:
  - Task 1: Midtrans client setup → Friday
  - Task 2: Xendit integration → Friday
  - Task 3: Webhook handlers → Friday
  - Task 4: UI components → Loki

Jarvis (Step 3 - Execute & Coordinate):
- Assigns Task 1 to Friday
- Friday completes → Verify → Task 2
- And so on...
```

#### Agent-to-Agent dengan Method Ini
```
Jarvis → Friday:
"@friday process Task 1 using @process-task-list.md"

Friday:
- Reads task
- Executes subtasks
- Verifies completion
- Reports: "Task 1 done, ready for Task 2"
```

---

## Tools/Files Needed

### 1. create-prd.md
Template untuk generate PRD dari ide/feature request.

### 2. generate-tasks.md  
Template untuk convert PRD → task list actionable.

### 3. process-task-list.md
Template untuk execute tasks satu per satu dengan verification.

---

## Key Lessons

1. **Slow down to speed up** — Proper context = faster execution
2. **One task at a time** — Review before proceeding
3. **Structured over chaotic** — PRD → Tasks → Execute
4. **Verification at each step** — Don't assume AI did it right
5. **Task lists save PMs** — Clear progress tracking

---

## Integration dengan Sistem Kita

### Workflow Baru:

```
Amos Request
    ↓
Jarvis (Coordinator) 
    ├── Step 1: Create PRD (using create-prd.md)
    ├── Step 2: Generate Tasks (using generate-tasks.md)
    └── Step 3: Assign & Coordinate
            ├── Friday: Dev tasks (using process-task-list.md)
            ├── Loki: Content tasks (using process-task-list.md)
            └── Shuri: Research tasks (using process-task-list.md)
    ↓
Verification & Review
    ↓
Deploy
```

### Benefits:
- ✅ Clear scope (no black box)
- ✅ Trackable progress
- ✅ Verification at each step
- ✅ Human review checkpoints
- ✅ Agents work systematically

---

**Next Action:** Implement 3 template files (create-prd.md, generate-tasks.md, process-task-list.md) ke agents/shared/templates/