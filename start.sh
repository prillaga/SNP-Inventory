#!/bin/bash
set -e
cd "$(dirname "$0")"
echo "Building..."
bash build.sh
PORT="${1:-8080}"
echo ""
echo "============================================"
echo "  Open in your browser:"
echo "  http://localhost:${PORT}/index.html"
echo "============================================"
echo ""
exec python3 -m http.server "$PORT"
