#!/usr/bin/env bash
# Eight riders on bikes that fit them (95-195 cm), for the home page's "Drag to any height" diagram.
#   art/make_sizes.sh [out-dir]   -> art/out/sizes/size_<cm>.png + .json, then export with art/export-sizes.mjs
set -euo pipefail
cd "$(dirname "$0")/.."
BLENDER="${BLENDER:-/c/Program Files/Blender Foundation/Blender 5.3/blender.exe}"
OUT="${1:-art/out/sizes}"
mkdir -p "$OUT"
OUT="$(cd "$OUT" && pwd -W 2>/dev/null || pwd)"
"$BLENDER" -b -P art/blender/render_sizes.py -- "$OUT" 1280 64 2>&1 | grep -E "WROTE|Error|Traceback" || true
# the renders become coloured-pencil sketches (art/paint/pencil.py), which is what the page shows
"${PYTHON:-/c/Program Files/Blender Foundation/Blender 5.3/5.3/python/bin/python.exe}" art/paint/pencil.py "$OUT" "${OUT}_pencil"
