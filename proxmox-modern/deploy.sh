#!/usr/bin/env bash
# Deploy proxmox-modern to deploy.21mv.com
#
# Usage:
#   DP_KEY="dp_..." ./deploy.sh                        # deploy as 'proxmox1'
#   DP_KEY="dp_..." SUB="my-name" ./deploy.sh          # deploy under a different subdomain
#
# This script bundles the project (excluding node_modules, .svelte-kit, build, .git, etc.)
# and POSTs the tarball to the platform's deploy API.

set -euo pipefail

DP_KEY="${DP_KEY:?Set DP_KEY env var to your dp_… key from https://deploy.21mv.com/dashboard/keys}"
SUB="${SUB:-proxmox1}"
SRC_DIR="$(cd "$(dirname "$0")" && pwd)"
TGZ="/tmp/${SUB}-deploy.tar.gz"

echo "▶ Tarring source from $SRC_DIR"
tar --exclude='./node_modules' \
    --exclude='./.svelte-kit' \
    --exclude='./build' \
    --exclude='./.git' \
    --exclude='./.env' \
    --exclude='./.env.*' \
    --exclude='./logs' \
    --exclude='./tsconfig.tsbuildinfo' \
    --exclude='./package-lock.json' \
    --exclude='./*.log' \
    -czf "$TGZ" -C "$SRC_DIR" .

SIZE=$(du -h "$TGZ" | cut -f1)
COUNT=$(tar -tzf "$TGZ" | wc -l)
echo "▶ Tarball ready: $TGZ ($SIZE, $COUNT files)"

echo "▶ Uploading to deploy.21mv.com (subdomain: $SUB)"
RESULT=$(curl -fsS -X POST --max-time 300 \
  -H "Authorization: Bearer $DP_KEY" \
  -H 'Origin: https://deploy.21mv.com' \
  -F "name=$SUB" \
  -F "file=@$TGZ" \
  https://deploy.21mv.com/api/v1/deploy) || {
    echo "✖ Deploy failed. If you saw a 524 from Cloudflare, the build may still be running — check:"
    echo "    curl -H \"Authorization: Bearer $DP_KEY\" https://deploy.21mv.com/api/v1/deployments"
    exit 1
  }

URL=$(echo "$RESULT" | grep -oP '"url":\s*"\K[^"]+' || true)
if [ -z "$URL" ]; then
  echo "$RESULT"
else
  echo "✓ Deployed: $URL"
  echo "  Allow 30–60 seconds for the container to build and start, then load it in your browser."
fi
