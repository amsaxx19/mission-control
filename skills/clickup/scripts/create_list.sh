#!/bin/bash
# Create a list in ClickUp (in space or folder)
# Usage: create_list.sh "FOLDER_ID" "List Name" OR create_list_space.sh "SPACE_ID" "List Name"

source .clickup.env 2>/dev/null || source ~/.clickup.env 2>/dev/null

PARENT_ID="$1"
LIST_NAME="$2"
PARENT_TYPE="${3:-folder}"  # "folder" or "space"

if [ -z "$PARENT_ID" ] || [ -z "$LIST_NAME" ]; then
    echo "Usage: create_list.sh \"FOLDER_ID\" \"List Name\" [folder|space]"
    exit 1
fi

if [ "$PARENT_TYPE" = "space" ]; then
    ENDPOINT="${CLICKUP_BASE_URL:-https://api.clickup.com/api/v2}/space/${PARENT_ID}/list"
else
    ENDPOINT="${CLICKUP_BASE_URL:-https://api.clickup.com/api/v2}/folder/${PARENT_ID}/list"
fi

curl -s -X POST \
  "$ENDPOINT" \
  -H "Authorization: ${CLICKUP_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$LIST_NAME\"}" | head -c 1000
