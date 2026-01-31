#!/bin/bash
# Get lists directly in a space (no folder)
# Usage: get_space_lists.sh "SPACE_ID"

source .clickup.env 2>/dev/null || source ~/.clickup.env 2>/dev/null

SPACE_ID="$1"

if [ -z "$SPACE_ID" ]; then
    echo "Usage: get_space_lists.sh \"SPACE_ID\""
    exit 1
fi

curl -s -X GET \
  "${CLICKUP_BASE_URL:-https://api.clickup.com/api/v2}/space/${SPACE_ID}/list" \
  -H "Authorization: ${CLICKUP_API_KEY}" | head -c 2000
