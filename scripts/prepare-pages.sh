#!/usr/bin/env bash
# Flatten symlinks and drop dev junk for GitHub Pages artifact.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${1:-$ROOT/.pages-build}"

rm -rf "$OUT"
mkdir -p "$OUT"

rsync -a --copy-links \
  --exclude node_modules \
  --exclude .git \
  --exclude .cursor \
  --exclude .pages-build \
  --exclude '.tmp*' \
  --exclude 'tmp-*' \
  "$ROOT/" "$OUT/"

echo "Pages build ready at $OUT ($(du -sh "$OUT" | cut -f1))"
