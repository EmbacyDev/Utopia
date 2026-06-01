#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOOK_SRC="$ROOT/scripts/git-hooks/commit-msg"
HOOK_DST="$ROOT/.git/hooks/commit-msg"

if [[ ! -d "$ROOT/.git" ]]; then
  echo "Run from the project root after git init."
  exit 1
fi

cp "$HOOK_SRC" "$HOOK_DST"
chmod +x "$HOOK_DST"
echo "Installed commit-msg hook (removes Cursor Co-authored-by)."
