#!/bin/bash
# Create a folder in ClickUp
# Usage: create_folder.sh "SPACE_ID" "Folder Name"

source .clickup.env 2>/dev/null || source ~/.clickup.env 2>/dev/null

SPACE_ID="$1"
FOLDER_NAME="$2"

if [ -z "$SPACE_ID" ] || [ -z "$FOLDER_NAME" ]; then
    echo "Usage: create_folder.sh \"SPACE_ID\" \"Folder Name\""
    exit 1
fi

curl -s -X POST \
  "${CLICKUP_BASE_URL:-https://api.clickup.com/api/v2}/space/${SPACE_ID}/folder" \
  -H "Authorization: ${CLICKUP_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$FOLDER_NAME\"}" | head -c 1000
