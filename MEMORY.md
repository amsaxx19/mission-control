# MEMORY.md - Long-Term Memory

## Task Management System

### ClickUp Integration
- **API Key:** Stored in `.clickup.env` (chmod 600, never commit)
- **Skill Location:** `skills/clickup/SKILL.md`
- **Default List:** Project 1 (ID: 901613291887)

**Workflow (ALWAYS FOLLOW):**
1. User asks me to do something → Create ClickUp task first
2. Do the work
3. Mark task complete when done

**Scripts available:**
- `create_task.sh "name" "list_id" "description" [priority]`
- `complete_task.sh "task_id"`
- `get_task.sh`, `list_tasks.sh`, `my_tasks.sh`
- Navigation: `get_teams.sh`, `get_spaces.sh`, `get_lists.sh`

### Kanban Board
- **Location:** `kanban/board.html`
- **Features:** Drag-and-drop, 4 columns, localStorage, export/import
- **Usage:** `open kanban/board.html`

## User Preferences

### Communication
- Uses Telegram (@amsaxx) and webchat
- Wants proactive task tracking in ClickUp
- Likes dark-themed tools

### Projects
- **Current:** Project management tooling (kanban + ClickUp integration)
- **Workspace:** ClickUp Team Space with Project 1 & 2 lists

## Important Notes

- **Screen stays awake:** `caffeinate -d` running (PID 7816)
- **Telegram bot:** Connected and working
- **ClickUp:** Fully configured with working API

## To Remember

When user says:
- "Do X" → Create ClickUp task → Do X → Mark complete
- "Track this" → Create task in Project 1
- "What are my tasks?" → List ClickUp tasks
