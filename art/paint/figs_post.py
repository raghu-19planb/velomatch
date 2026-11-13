"""Tidy the studio renders for the page: confine the floor shadow to a soft pool under the bike.

    python figs_post.py <dir>        (every png with a .json beside it: fig_*.png, size_*.png; rewrites the png)

The shadow catcher darkens the whole floor a little; on the cream page that reads as a grey slab. This
keeps the contact shadow right under the wheels and fades it out sideways and downward.
"""
import json
import os
import sys

if os.environ.get('PYLIBS'):
    sys.path.insert(0, os.environ['PYLIBS'])

import cv2
import numpy as np

d = sys.argv[1]
import glob
for path in sorted(glob.glob(os.path.join(d, '*.png'))):
    if not os.path.exists(path + '.json'):
        continue
    kind = os.path.basename(path)
    im = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    h, w = im.shape[:2]
    meta = json.load(open(path + '.json'))
    k = w / 640.0
    ground = meta['ground_y'] * k
    rear, front = meta['points']['rear'][0] * k, meta['points']['front'][0] * k
    cx, half = (rear + front) / 2, (front - rear) / 2 + meta['wheel_r_px'] * k
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    horiz = np.exp(-(((x - cx) / (half * 0.95)) ** 4))                    # flat across the bike, falling off past the wheels
    fy = np.clip((y - (ground - 10)) / (0.10 * h), 0, 1)
    vert = 1 - fy * fy * (3 - 2 * fy)                                     # 1 at the contact line, 0 a short way below
    edge = np.clip(np.minimum(x, w - 1 - x) / (0.10 * w), 0, 1)
    edge = edge * edge * (3 - 2 * edge)                                  # and never a hard edge at the picture's border
    keep = np.where(y < ground - 10, 1.0, horiz * vert) * edge
    a = im[..., 3].astype(np.float32) / 255.0
    solid = a > 0.985                                                    # the bike itself is left alone
    a2 = np.where(solid, a, a * keep)
    im[..., 3] = np.clip(a2 * 255, 0, 255).astype(np.uint8)
    cv2.imwrite(path, im)
    print('tidied', kind)
