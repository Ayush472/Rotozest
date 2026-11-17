#!/usr/bin/env bash
# Share the local site through the Cloudflare tunnel (develop.trueorfalse.dev → http://localhost:3100).
#
#   npm run tunnel   tunnel only (start the site yourself on port 3100)
#   npm run share    build, start the production site on port 3100, and open the tunnel; Ctrl+C stops both
#
# The token is read from .env.local (CLOUDFLARE_TUNNEL_TOKEN), never typed on the command line.
# The hostname → localhost:3100 route is set in the Cloudflare dashboard (Zero Trust → Networks → Tunnels),
# with Service Type HTTP.
set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v cloudflared >/dev/null; then
  echo "cloudflared is not installed. Run: brew install cloudflared" >&2
  exit 1
fi
TOKEN="$(grep -E '^CLOUDFLARE_TUNNEL_TOKEN=' .env.local 2>/dev/null | head -1 | cut -d= -f2-)"
if [ -z "$TOKEN" ]; then
  echo "CLOUDFLARE_TUNNEL_TOKEN missing in .env.local (restore it with ~/WORK/secrets/restore.sh rotozest)" >&2
  exit 1
fi

PORT=3100
if [ "${1:-}" = "--with-server" ]; then
  if lsof -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; then
    echo "Port $PORT is already in use; using the server that is running there."
  else
    npm run build
    npx next start -p $PORT &
    SERVER=$!
    trap 'kill $SERVER 2>/dev/null' EXIT
    for _ in $(seq 1 30); do curl -s -o /dev/null "http://localhost:$PORT/" && break; sleep 1; done
  fi
fi

echo "Tunnel up: https://develop.trueorfalse.dev → http://localhost:$PORT (Ctrl+C to stop)"
TUNNEL_TOKEN="$TOKEN" exec cloudflared tunnel --no-autoupdate run
