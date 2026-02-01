#!/bin/bash
# Message Bus Helper Script
# Usage: ./send-message.sh <from> <to> <type> <priority> <title>

FROM=$1
TO=$2
TYPE=$3
PRIORITY=$4
TITLE=$5
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
FILENAME=$(date +%Y%m%d-%H%M%S)-${FROM}.md
INBOX_DIR="../shared/inbox/${TO}"

# Create inbox if not exists
mkdir -p "${INBOX_DIR}"

# Create message file
cat > "${INBOX_DIR}/${FILENAME}" << EOF
---
from: ${FROM}
to: ${TO}
timestamp: ${TIMESTAMP}
type: ${TYPE}
priority: ${PRIORITY}
---

# ${TITLE}

$(cat)

---
Sent by ${FROM} at ${TIMESTAMP}
EOF

echo "✅ Message sent to ${TO}: ${TITLE}"
echo "📁 Location: ${INBOX_DIR}/${FILENAME}"