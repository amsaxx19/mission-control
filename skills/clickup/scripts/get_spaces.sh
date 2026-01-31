#!/bin/bash
# Get spaces in a team
# Usage: get_spaces.sh "TEAM_ID"

source .clickup.env 2>/dev/null || source ~/.clickup.env 2>/dev/null

TEAM_ID="$1"

if [ -z "$TEAM_ID" ]; then
    echo "Usage: get_spaces.sh \"TEAM_ID\""
    exit 1
fi

curl -s -X GET \
  "${CLICKUP_BASE_URL:-https://api.clickup.com/api/v2}/team/${TEAM_ID}/space" \
  -H "Authorization: ${CLICKUP_API_KEY}" | head -c 2000
