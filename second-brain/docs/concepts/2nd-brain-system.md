---
title: 2nd Brain System
date: 2026-02-01
tags: [system, knowledge-management, meta]
---

# 2nd Brain System

## What Is This?

A personal knowledge management system built as a Next.js app. It combines the best of [[Obsidian]] (wiki-linking, graph thinking) with [[Linear]] (clean, fast, dark UI).

## Core Principles

### 1. Capture Everything
Every significant conversation, decision, or idea gets documented.

### 2. Link Relentlessly
Connect ideas using `[[Wiki Links]]`. The system visualizes connections between documents.

### 3. Daily Journaling
Each day gets its own entry — a high-level summary of discussions and work.

### 4. Concept Extraction
Important ideas get pulled out into standalone documents for deeper exploration.

## Folder Structure

```
docs/
├── daily/          # Daily journal entries
├── concepts/       # Deep dives into ideas
├── projects/       # Active project documentation  
├── people/         # People profiles
└── ideas/          # Random thoughts & hypotheses
```

## How I Use It

### During Conversations
- Take mental notes on important points
- Identify concepts worth documenting
- Note decisions and action items

### After Conversations
1. **Create daily entry** — High-level summary of what we discussed
2. **Extract concepts** — If we discussed something important, create a concept doc
3. **Update projects** — If we made progress on a project, update its docs
4. **Link everything** — Connect related documents with wiki links

### During Night Shift
- Review the day's conversations
- Fill in gaps in documentation
- Research and expand on concepts
- Create new connections between ideas

## Document Format

```markdown
---
title: Document Title
date: 2026-02-01
tags: [tag1, tag2]
---

# Title

Content here...

Link to [[Another Document]]
```

## Benefits for Amos

1. **Memory** — Never forget important context
2. **Continuity** — Each session starts with full context
3. **Pattern Recognition** — See connections between ideas over time
4. **Knowledge Building** — Accumulate expertise, not just tasks

## Benefits for Me

1. **Context** — Understand Amos better over time
2. **Consistency** — Maintain continuity across sessions
3. **Proactivity** — Spot patterns and suggest things
4. **Growth** — Document what I learn about his business

## Roadmap

- [ ] Graph visualization (force-directed graph of connections)
- [ ] Full-text search within document content
- [ ] Daily note templates
- [ ] Integration with ClickUp (sync tasks)
- [ ] Mobile app (PWA)
- [ ] AI-powered insights ("You mentioned X 3 months ago...")

---

*The 2nd Brain lives in `/second-brain/` — a Next.js app that renders these markdown files into a beautiful document viewer.*