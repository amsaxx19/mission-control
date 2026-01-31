#!/bin/bash
# Get task details
# Usage: get_task.sh "TASK_ID"

source .clickup.env 2>/dev/null || source ~/.clickup.env 2>/dev/null

TASK_ID="$1"

if [ -z "$TASK_ID" ]; then
    echo "Usage: get_task.sh \"TASK_ID\""
    exit 1
fi

curl -s -X GET \
  "${CLICKUP_BASE_URL:-https://api.clickup.com/api/v2}/task/${TASK_ID}" \
  -H "Authorization: ${CLICKUP_API_KEY}" | head -c 2000
