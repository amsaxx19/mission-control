# 2nd Brain

A personal knowledge management system for Amos — built with Next.js, inspired by Obsidian and Linear.

## Features

- **📁 Folder-based organization** — daily, concepts, projects, people, ideas
- **🔍 Full-text search** — Find anything instantly
- **🔗 Wiki-style linking** — Connect ideas with `[[links]]`
- **📊 Connection visualization** — See what links to what
- **🌙 Dark mode** — Easy on the eyes, Linear-inspired design
- **⚡ Fast** — Static generation for instant load times

## Getting Started

```bash
cd second-brain
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Document Structure

Documents use YAML frontmatter:

```yaml
---
title: Document Title
date: 2026-02-01
tags: [tag1, tag2]
---

Your content here...

Link to other docs: [[Another Document]]
```

## Folders

| Folder | Purpose |
|--------|---------|
| `docs/daily/` | Daily journal entries |
| `docs/concepts/` | Deep dives into ideas, frameworks |
| `docs/projects/` | Project documentation |
| `docs/people/` | Notes about people |
| `docs/ideas/` | Brainstorming, hypotheses |

## For Amos

This is YOUR second brain. I (your AI assistant) will:
- Create daily journal entries of our conversations
- Extract important concepts into standalone docs
- Link related ideas together
- Keep project documentation updated

Just use it — I'll maintain it.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- remark (markdown processing)
- gray-matter (frontmatter parsing)
- date-fns (date formatting)
- lucide-react (icons)

## Roadmap

- [ ] Graph view visualization (D3.js or Force Graph)
- [ ] Daily note template generation
- [ ] Tag-based filtering
- [ ] Full-text content search (currently title only)
- [ ] Mobile responsiveness improvements
- [ ] Export to PDF/Markdown
- [ ] Sync with external sources

## License

Private — for Amos only.