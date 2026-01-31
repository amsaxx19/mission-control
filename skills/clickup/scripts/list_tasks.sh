#!/bin/bash
# List tasks in a list
# Usage: list_tasks.sh "LIST_ID"

source .clickup.env 2>/dev/null || source ~/.clickup.env 2>/dev/null

LIST_ID="$1"

if [ -z "$LIST_ID" ]; then
    echo "Usage: list_tasks.sh \"LIST_ID\""
    exit 1
fi

curl -s -X GET \
  "${CLICKUP_BASE_URL:-https://api.clickup.com/api/v2}/list/${LIST_ID}/task" \
  -H "Authorization: ${CLICKUP_API_KEY}" | head -c 3000
