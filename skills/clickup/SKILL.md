---
name: clickup
description: Manage ClickUp tasks and projects. Use when the user asks to create, update, complete, or track tasks in ClickUp; when logging completed work to ClickUp; when managing project workflows; or when integrating task management into workflows.
---

# ClickUp Task Management

Manage ClickUp tasks and projects through the API.

## Configuration

API key is stored in workspace root at `.clickup.env`:
- `CLICKUP_API_KEY` - Your ClickUp API token
- `CLICKUP_BASE_URL` - https://api.clickup.com/api/v2

Load it with: `source .clickup.env` or read directly in scripts.

## Common Workflows

### When User Asks You to Do Something

**ALWAYS:**
1. Create a task in ClickUp first (so it's tracked)
2. Do the work
3. Mark the task as complete when done

Example:
```bash
# 1. Create task
./skills/clickup/scripts/create_task.sh "Build kanban board" "90161463344" "Create HTML/CSS kanban board for project tracking"

# 2. Do the work...

# 3. Mark complete (using the task ID returned from create)
./skills/clickup/scripts/complete_task.sh "TASK_ID_HERE"
```

### Creating Tasks

Required: name, list_id
Optional: description, priority (1=urgent, 2=high, 3=normal, 4=low), due_date (Unix timestamp), assignees

```bash
./skills/clickup/scripts/create_task.sh "Task Name" "LIST_ID" "Description"
```

### Completing Tasks

```bash
./skills/clickup/scripts/complete_task.sh "TASK_ID"
```

### Getting Task Status

```bash
./skills/clickup/scripts/get_task.sh "TASK_ID"
```

### Listing Tasks

```bash
# List tasks in a list
./skills/clickup/scripts/list_tasks.sh "LIST_ID"

# List tasks assigned to me
./skills/clickup/scripts/my_tasks.sh
```

## Finding IDs

- **Team ID**: Run `./skills/clickup/scripts/get_teams.sh`
- **Space ID**: From team, run `./skills/clickup/scripts/get_spaces.sh "TEAM_ID"`
- **Folder ID**: From space, run `./skills/clickup/scripts/get_folders.sh "SPACE_ID"`
- **List ID**: From folder/space, run `./skills/clickup/scripts/get_lists.sh "FOLDER_ID"` or `./skills/clickup/scripts/get_space_lists.sh "SPACE_ID"`

## Default Workspace

Based on current setup:
- **Team**: Amos's Workspace (90161463344)
- **Space**: Team Space (90166199166)

### 📁 Folder Structure

**CuanBoss** (90168324520) — Primary focus, platform development
- 🚀 Development: 901613292359 ← Core product work
- 📢 Marketing & Launch: 901613292361 ← Growth & acquisition
- 💼 Operations: 901613292362 — Legal, finance, admin

**TikTok Affiliate** (90168324521) — Current income source
- 🎥 Content Production: 901613292363 ← Daily content tasks
- 📊 Analytics & Research: 901613292364 ← Kalodata, trending
- 👥 Team Management: 901613292365 ← Adek, SOPs

**Personal Branding** (90168324522) — Long-term asset building
- ✍️ Content Creation: 901613292366 ← Posts, videos, value
- 📈 Growth Strategy: 901613292367 — Platform growth
- 🤝 Collaborations: 901613292368 — Partnerships, deals

**Legacy Lists** (General tasks)
- Project 1: 901613291887
- Project 2: 901613291886

## Workflow

When user says "Do X":
1. Ask or determine: Which project? (CuanBoss/TikTok/Personal Brand)
2. Create task in appropriate list
3. Do the work
4. Mark complete

## Quick Commands

```bash
# CuanBoss Development (default for tech work)
./skills/clickup/scripts/create_task.sh "Task Name" "901613292359" "Description"

# TikTok Content
./skills/clickup/scripts/create_task.sh "Task Name" "901613292363" "Description"

# Personal Brand Content
./skills/clickup/scripts/create_task.sh "Task Name" "901613292366" "Description"

# Mark complete
./skills/clickup/scripts/complete_task.sh "TASK_ID"
```
