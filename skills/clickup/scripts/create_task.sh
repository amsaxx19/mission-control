#!/bin/bash
# Create a new task in ClickUp
# Usage: create_task.sh "Task Name" "LIST_ID" ["Description"] [PRIORITY:1-4]

source .clickup.env 2>/dev/null || source ~/.clickup.env 2>/dev/null

NAME="$1"
LIST_ID="$2"
DESCRIPTION="${3:-}"
PRIORITY="${4:-3}"

if [ -z "$NAME" ] || [ -z "$LIST_ID" ]; then
    echo "Usage: create_task.sh \"Task Name\" \"LIST_ID\" [\"Description\"] [PRIORITY]"
    exit 1
fi

JSON_PAYLOAD=$(cat <<EOF
{
  "name": "$NAME",
  "description": "$DESCRIPTION",
  "priority": $PRIORITY
}
EOF
)

RESPONSE=$(curl -s -X POST \
  "${CLICKUP_BASE_URL:-https://api.clickup.com/api/v2}/list/${LIST_ID}/task" \
  -H "Authorization: ${CLICKUP_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD")

TASK_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
TASK_URL=$(echo "$RESPONSE" | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4)

echo "Task created: $TASK_ID"
echo "URL: $TASK_URL"
echo "$RESPONSE" | head -c 500
