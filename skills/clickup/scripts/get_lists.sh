#!/bin/bash
# Get lists in a folder
# Usage: get_lists.sh "FOLDER_ID"

source .clickup.env 2>/dev/null || source ~/.clickup.env 2>/dev/null

FOLDER_ID="$1"

if [ -z "$FOLDER_ID" ]; then
    echo "Usage: get_lists.sh \"FOLDER_ID\""
    exit 1
fi

curl -s -X GET \
  "${CLICKUP_BASE_URL:-https://api.clickup.com/api/v2}/folder/${FOLDER_ID}/list" \
  -H "Authorization: ${CLICKUP_API_KEY}" | head -c 2000
