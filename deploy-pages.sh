#!/usr/bin/env bash
# Deploy static site to Cloudflare Pages (not Workers).
# Requires: npx wrangler login (once)
set -euo pipefail
cd "$(dirname "$0")"
echo "Deploying to Cloudflare Pages…"
npx wrangler pages deploy . --project-name=utopia-sum --branch=main
