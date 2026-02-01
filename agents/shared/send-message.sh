#!/bin/bash
# Enhanced Message Bus with @Mentions Support
# Usage: ./send-message.sh <from> <to> <type> <priority> <title> [mentions]

FROM=$1
TO=$2
TYPE=$3
PRIORITY=$4
TITLE=$5
MENTIONS=$6  # Comma-separated: "shuri,friday"
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
FILENAME=$(date +%Y%m%d-%H%M%S)-${FROM}.md

echo "📨 Sending message from ${FROM} to ${TO}..."

# Create main message
cat > /tmp/message.tmp << EOF
---
from: ${FROM}
to: ${TO}
timestamp: ${TIMESTAMP}
type: ${TYPE}
priority: ${PRIORITY}
EOF

# Add mentions if provided
if [ ! -z "$MENTIONS" ]; then
  echo "mentions: [${MENTIONS}]" >> /tmp/message.tmp
fi

cat >> /tmp/message.tmp << EOF
---

# ${TITLE}

$(cat)

---
Sent by ${FROM} at ${TIMESTAMP}
EOF

# Send to primary recipient
INBOX_DIR="../shared/inbox/${TO}"
mkdir -p "${INBOX_DIR}"
cp /tmp/message.tmp "${INBOX_DIR}/${FILENAME}"
echo "✅ Delivered to ${TO}: ${FILENAME}"

# Send to mentioned agents
if [ ! -z "$MENTIONS" ]; then
  IFS=',' read -ra MENTION_ARRAY <<< "$MENTIONS"
  for AGENT in "${MENTION_ARRAY[@]}"; do
    # Skip if mention is same as primary recipient
    if [ "$AGENT" != "$TO" ]; then
      MENTION_INBOX="../shared/inbox/${AGENT}"
      mkdir -p "${MENTION_INBOX}"
      
      # Create mention notification
      cat > "${MENTION_INBOX}/${FILENAME}" << EOF
---
from: ${FROM}
to: ${AGENT}
timestamp: ${TIMESTAMP}
type: mention
priority: ${PRIORITY}
original_to: ${TO}
---

# You were mentioned by ${FROM}

**In:** "${TITLE}"

**Message excerpt:**
$(head -5 /tmp/message.tmp | tail -1)

**Action:** Check full message in ${TO}'s thread or reply to ${FROM}.

---
[Reply to ${FROM}](../shared/inbox/${FROM}/)
EOF
      echo "📢 Notified @${AGENT} (mention)"
    fi
  done
fi

# Create activity trigger for recipient (wake them up)
TRIGGER_DIR="../shared/triggers"
mkdir -p "${TRIGGER_DIR}"
touch "${TRIGGER_DIR}/wake-${TO}"
echo "🔔 Trigger created for ${TO}"

# Also trigger mentioned agents
if [ ! -z "$MENTIONS" ]; then
  IFS=',' read -ra MENTION_ARRAY <<< "$MENTIONS"
  for AGENT in "${MENTION_ARRAY[@]}"; do
    touch "${TRIGGER_DIR}/wake-${AGENT}"
    echo "🔔 Trigger created for ${AGENT}"
  done
fi

# Clean up
rm /tmp/message.tmp

echo "✨ Message sent successfully!"