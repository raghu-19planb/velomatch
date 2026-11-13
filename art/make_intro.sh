#!/usr/bin/env bash
# Regenerates every painting used by the home-page intro, from nothing but the scripts in art/.
#
#   art/make_intro.sh [work-dir]      (default: art/out, which is git-ignored)
#
# Two stages: Blender renders each scene (art/blender/), then art/paint/strokes.py repaints the render
# stroke by stroke as oil on canvas. Needs Blender (set BLENDER if it is not at the Windows default)
# and a Python with numpy, opencv-python-headless and scipy (set PYLIBS to a folder installed with
# `pip install --target`, and PYTHON to the interpreter; Blender's own works). Run art/export-webp.mjs
# afterwards to turn the finished PNGs into the web images in images/intro/. Roughly an hour.
set -euo pipefail
cd "$(dirname "$0")/.."
BLENDER="${BLENDER:-/c/Program Files/Blender Foundation/Blender 5.3/blender.exe}"
PYTHON="${PYTHON:-/c/Program Files/Blender Foundation/Blender 5.3/5.3/python/bin/python.exe}"
OUT="${1:-art/out}"
mkdir -p "$OUT"
# Blender resolves a relative output path from the drive root (not the current folder), so always pass an absolute one
OUT="$(cd "$OUT" && pwd -W 2>/dev/null || pwd)"
export PYLIBS="${PYLIBS:-}"
render() { "$BLENDER" -b -P art/blender/scene_ride.py -- "$@" 2>&1 | grep -E "WROTE|Error|Traceback" || true; }
paint()  { "$PYTHON" art/paint/strokes.py "$@"; }

echo "== renders"
render pano-full "$OUT/full_raw.png" 3000 1000 96
render pano-far  "$OUT/far_raw.png"  3000 1000 64
render pano-mid  "$OUT/mid_alpha.png"  3000 1000 6
render pano-near "$OUT/near_alpha.png" 3000 1000 6
for s in kids commute bikepacking mountain racing; do render "$s" "$OUT/v_$s.png" 1200 900 80; done

echo "== painting (in parallel)"
pids=()
paint "$OUT/full_raw.png" "$OUT/full_paint.png" --scale 1.5 & pids+=($!)
paint "$OUT/far_raw.png"  "$OUT/far_paint.png"  --scale 1.5 --no-focus & pids+=($!)
for s in kids commute bikepacking mountain racing; do
  paint "$OUT/v_$s.png" "$OUT/p_$s.png" --scale 1.4 & pids+=($!)
done
for p in "${pids[@]}"; do wait "$p"; done

echo "== depth layers"
"$PYTHON" art/paint/layers.py "$OUT"
echo "done: $OUT"
