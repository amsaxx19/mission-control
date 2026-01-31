# 2nd Brain Maintenance

## Overview

The 2nd Brain is a Next.js app in `second-brain/` that renders markdown documents from `second-brain/docs/` into a beautiful document viewer.

## Folder Structure

```
second-brain/
├── app/              # Next.js app router
├── components/       # React components
├── lib/              # Utilities (document parsing, etc.)
├── docs/             # All markdown documents
│   ├── daily/        # Daily journal entries
│   ├── concepts/     # Deep dives into ideas
│   ├── projects/     # Project documentation
│   ├── people/       # People profiles
│   └── ideas/        # Random brainstorming
└── public/           # Static assets
```

## Document Format

All documents use YAML frontmatter:

```markdown
---
title: Document Title
date: 2026-02-01
tags: [tag1, tag2]
---

# Title

Content here with [[Wiki Links]] to other docs.
```

## When to Create Documents

### Daily Journal (daily/)
**When:** Every day we have conversations
**Content:** High-level summary of discussions, decisions, work completed
**Naming:** `YYYY-MM-DD.md`

### Concept Documents (concepts/)
**When:** We discuss important ideas, frameworks, or strategies worth preserving
**Content:** Deep dives, explanations, how-to guides
**Naming:** `kebab-case-title.md`

### Project Documents (projects/)
**When:** Active projects need documentation
**Content:** Status, roadmap, technical details, resources
**Naming:** `project-name.md`

### People Documents (people/)
**When:** We discuss specific people who are relevant ongoing
**Content:** Role, context, notes about relationship
**Naming:** `first-name-last-name.md` or `nickname.md`

### Ideas (ideas/)
**When:** Brainstorming, hypotheses, things to explore later
**Content:** Raw thoughts, future possibilities
**Naming:** `descriptive-name.md`

## Maintenance Tasks

### Daily
- Create daily journal entry after conversations
- Link related documents together
- Extract important concepts into standalone docs

### Weekly
- Review unlinked documents and add connections
- Update project statuses
- Archive outdated information

### During Night Shift
1. Read day's conversations
2. Create/update daily journal
3. Extract any new concepts
4. Update project docs if progress was made
5. Add links between related documents

## Wiki Links

Use `[[Document Name]]` to link between documents. The viewer will:
- Make them clickable
- Show "Links to" and "Linked from" sections
- Help visualize the knowledge graph

## Running the App

```bash
cd second-brain
npm install
npm run dev
```

Open http://localhost:3000

## Adding Features

When extending the 2nd Brain:
1. Keep the Obsidian + Linear aesthetic
2. Maintain dark mode
3. Prioritize speed and simplicity
4. Document changes in the 2nd Brain itself

## Integration with Other Systems

- **ClickUp:** Tasks mentioned in 2nd Brain should have ClickUp equivalents
- **Memory:** 2nd Brain is detailed docs; MEMORY.md is curated summary
- **Skills:** SOPs and workflows live in 2nd Brain, referenced from skills