"""Cut the painted panorama into depth layers for the home-page parallax.

    python layers.py <dir>

Reads (in <dir>):   full_paint.png   the whole panorama, painted
                    far_paint.png    the sky and mountains only, painted (a clean plate to sit behind)
                    mid_alpha.png    a quick render of just the mid-distance, for its outline (alpha)
                    near_alpha.png   a quick render of just the foreground, for its outline (alpha)
Writes (in <dir>):  layer_far.png (opaque), layer_mid.png and layer_near.png (cut out, with alpha)

The mid and near layers are the painted panorama cut out by the other renders' outlines, so all three
layers share one painting and line up exactly.
"""
import os
import sys

import os
import sys

if os.environ.get('PYLIBS'):                      # a folder made with `pip install --target` (opencv, scipy)
    sys.path.insert(0, os.environ['PYLIBS'])

import cv2
import numpy as np

d = sys.argv[1]


def rgb(name):
    return cv2.imread(os.path.join(d, name), cv2.IMREAD_COLOR)


def alpha(name):
    a = cv2.imread(os.path.join(d, name), cv2.IMREAD_UNCHANGED)[..., 3].astype(np.float32) / 255.0
    a = cv2.GaussianBlur(a, (0, 0), 0.8)                 # the outline render is quick and a little noisy
    return np.clip((a - 0.5) * 1.6 + 0.5, 0, 1)          # ...so tighten the soft edge again


def save(bgr, a, name):
    out = np.dstack([bgr, (a * 255).astype(np.uint8)]) if a is not None else bgr
    cv2.imwrite(os.path.join(d, name), out)
    print('SAVED', name, out.shape[1], out.shape[0])


full, far = rgb('full_paint.png'), rgb('far_paint.png')
save(far, None, 'layer_far.png')
save(full, alpha('mid_alpha.png'), 'layer_mid.png')
save(full, alpha('near_alpha.png'), 'layer_near.png')
