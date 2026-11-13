#!/usr/bin/env bash
# Studio renders of the five bikes for the Fig. 001 diagrams (art/out/figs/fig_<kind>.png + .json),
# then art/paint/figs_post.py softens the floor shadow. Export with art/export-figs.mjs.
set -euo pipefail
cd "$(dirname "$0")/.."
BLENDER="${BLENDER:-/c/Program Files/Blender Foundation/Blender 5.3/blender.exe}"
OUT="${1:-art/out/figs}"
mkdir -p "$OUT"
OUT="$(cd "$OUT" && pwd -W 2>/dev/null || pwd)"
for k in kids commute road mtb gravel; do
  "$BLENDER" -b -P art/blender/render_figs.py -- "$k" "$OUT/fig_$k.png" 1600 1025 128 2>&1 | grep -E "WROTE|Error|Traceback" || true
done
