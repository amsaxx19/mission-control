#!/bin/bash
# Mark a ClickUp task as complete
# Usage: complete_task.sh "TASK_ID"

source .clickup.env 2>/dev/null || source ~/.clickup.env 2>/dev/null

TASK_ID="$1"

if [ -z "$TASK_ID" ]; then
    echo "Usage: complete_task.sh \"TASK_ID\""
    exit 1
fi

RESPONSE=$(curl -s -X PUT \
  "${CLICKUP_BASE_URL:-https://api.clickup.com/api/v2}/task/${TASK_ID}" \
  -H "Authorization: ${CLICKUP_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"status":"complete"}')

echo "Task marked complete: $TASK_ID"
echo "$RESPONSE" | head -c 300
