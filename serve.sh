#!/bin/bash
cd "$(dirname "$0")"
PORT="${1:-8080}"
echo "Serving POS Inventory at http://localhost:${PORT}"
echo "Open: http://localhost:${PORT}/index.html"
python3 -m http.server "$PORT"
