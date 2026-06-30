#!/bin/bash
# Sync desktop_v2 to /tmp/desktop_v2 for preview server
rsync -a --delete \
  /Users/irina/Desktop/embacy/utopia/Utopia/desktop_v2/ \
  /tmp/desktop_v2/ \
  --exclude sync.sh
echo "Synced to /tmp/desktop_v2"
