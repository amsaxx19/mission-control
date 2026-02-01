# Message Bus System

## Overview

Sistem messaging antar agents pake file-based approach. Tiap agent bisa kirim/receive messages via shared folder.

## How It Works

### Kirim Message
1. Agent bikin file di `agents/shared/inbox/<target-agent>/<timestamp>-<from>.md`
2. Isi message dengan format standard

### Receive Message
1. Agent check folder `agents/shared/inbox/<agent-name>/` di setiap heartbeat
2. Baca messages, process, delete atau archive

## Message Format

```markdown
---
from: Jarvis
to: Shuri
timestamp: 2026-02-01T14:50:00Z
type: task_assignment | question | update | urgent
priority: low | medium | high
---

# Message Title

Content here...

## Context
- Task ID: TASK-XXX
- Related: [[Other Document]]

## Action Required
- [ ] Do this
- [ ] Do that
```

## Folder Structure

```
agents/shared/
├── inbox/
│   ├── jarvis/           # Messages for Jarvis
│   ├── shuri/            # Messages for Shuri
│   ├── friday/           # Messages for Friday
│   ├── loki/             # Messages for Loki
│   └── wong/             # Messages for Wong
├── outbox/               # Pending outgoing messages
└── archive/              # Processed messages
```

## Usage Examples

### Jarvis assign task ke Shuri
```bash
# Jarvis creates:
agents/shared/inbox/shuri/20260201-145030-jarvis.md
```

Content:
```markdown
---
from: Jarvis
to: Shuri
timestamp: 2026-02-01T14:50:30Z
type: task_assignment
priority: high
---

# Research Request: Competitor Analysis

Shuri, I need you to analyze competitor pricing for CuanBoss.

## Task Details
- Target: Whop.com, Gumroad, local Indonesian platforms
- Focus: Pricing strategy, features, UX
- Deadline: Tomorrow 12 PM

## Output Expected
- Comparison table
- Key insights
- Recommendations

@shuri please confirm receipt.
```

### Shuri reply
```bash
# Shuri creates:
agents/shared/inbox/jarvis/20260201-150045-shuri.md
```

## Command Helpers

### Check Inbox
```bash
ls -la agents/shared/inbox/<agent-name>/
```

### Read Message
```bash
cat agents/shared/inbox/<agent-name>/<message-file>
```

### Send Message
```bash
# Create file with proper naming
echo "---
from: <sender>
to: <receiver>
timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)
type: <type>
priority: <priority>
---

# <title>

<content>" > agents/shared/inbox/<receiver>/$(date +%Y%m%d-%H%M%S)-<sender>.md
```

### Archive Message (after processing)
```bash
mv agents/shared/inbox/<agent>/<message> agents/shared/archive/
```

## Integration with Agents

Each agent's SOUL.md includes:

```markdown
## Communication

### On Heartbeat
1. Check `agents/shared/inbox/<agent-name>/` for new messages
2. Process each message
3. Reply if needed (create message in target's inbox)
4. Archive processed messages

### Sending Messages
- Use file-based message bus
- Follow naming convention: `YYYYMMDD-HHMMSS-<sender>.md`
- Always include frontmatter with metadata
```

## Benefits

1. **No Database Required** - Works with file system only
2. **Persistent** - Messages survive restarts
3. **Simple** - No API calls needed
4. **Auditable** - Full history in git
5. **Async** - Agents process messages on their own schedule