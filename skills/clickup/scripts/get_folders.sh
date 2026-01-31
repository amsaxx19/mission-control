#!/bin/bash
# Get folders in a space
# Usage: get_folders.sh "SPACE_ID"

source .clickup.env 2>/dev/null || source ~/.clickup.env 2>/dev/null

SPACE_ID="$1"

if [ -z "$SPACE_ID" ]; then
    echo "Usage: get_folders.sh \"SPACE_ID\""
    exit 1
fi

curl -s -X GET \
  "${CLICKUP_BASE_URL:-https://api.clickup.com/api/v2}/space/${SPACE_ID}/folder" \
  -H "Authorization: ${CLICKUP_API_KEY}" | head -c 2000
