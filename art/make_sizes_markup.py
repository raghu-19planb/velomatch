"""Writes the size table into index.html's "Drag to any height" diagram from the renders' json.

    python art/make_sizes_markup.py [art/out/sizes]

Between the radar-sizes markers in index.html's script it puts one row per rendered height: the image,
the wheel size, standover and wheelbase measured from the model, so the labels under the picture are
the picture's own numbers, not a formula.
"""
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SIZES = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'art', 'out', 'sizes')
rows = []
for p in sorted(glob.glob(os.path.join(SIZES, 'size_*.png.json')), key=lambda f: int(re.search(r'size_(\d+)', f).group(1))):
    m = json.load(open(p))
    rows.append("  {h:%d, wheel:'%s', standover:%d, wheelbase:%d, saddle:%d}" % (m['height_cm'], m['wheel'], m['standover_cm'], m['wheelbase_cm'], m['saddle_cm']))
    ppm = m['px_per_m']
    gy = m['ground_y']
table = 'const RADAR_SIZES = [\n' + ',\n'.join(rows) + '\n];\nconst RADAR_PX_PER_M = %s, RADAR_GROUND_Y = %s;' % (ppm, gy)
path = os.path.join(ROOT, 'index.html')
html = open(path, encoding='utf8', newline='').read()
new, n = re.subn(r'/\* radar-sizes:start \*/.*?/\* radar-sizes:end \*/', lambda _: '/* radar-sizes:start */\n' + table + '\n/* radar-sizes:end */', html, flags=re.S)
assert n == 1, 'markers not found'
open(path, 'w', encoding='utf8', newline='').write(new)
print('wrote', len(rows), 'sizes; ground y', gy)
