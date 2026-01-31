#!/bin/bash
# Get all teams/workspaces

source .clickup.env 2>/dev/null || source ~/.clickup.env 2>/dev/null

curl -s -X GET \
  "${CLICKUP_BASE_URL:-https://api.clickup.com/api/v2}/team" \
  -H "Authorization: ${CLICKUP_API_KEY}" | head -c 2000
