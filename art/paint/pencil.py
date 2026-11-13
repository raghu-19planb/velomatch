"""Turn a studio render (RGBA, transparent background) into a coloured-pencil sketch.

    python pencil.py <in-dir> <out-dir>        every size_*.png with a .json beside it

A coloured pencil drawing is made of three things, and this lays them down the way a hand does:
  1. colour: soft diagonal hatching in a pigment taken from the render, denser where the form is darker,
     with a second cross-hatch in the shadows, on a paper grain, so the page shows between the strokes;
  2. line: a wobbly graphite outline from the edges of the form, broken up like a lifted pencil;
  3. offset: the colour and the line are shifted a hair apart by different smooth distortions, which is
     what makes a sketch look drawn rather than traced.
Output keeps the transparent background, so the paper of the page is the paper of the drawing.
"""
import glob
import math
import os
import sys

if os.environ.get('PYLIBS'):
    sys.path.insert(0, os.environ['PYLIBS'])

import cv2
import numpy as np


def smooth_noise(h, w, cell, rng, amp):
    lo = rng.standard_normal((h // cell + 3, w // cell + 3)).astype(np.float32)
    return cv2.resize(lo, (w, h), interpolation=cv2.INTER_CUBIC) * amp


def warp(img, rng, amp, cell):
    h, w = img.shape[:2]
    dx, dy = smooth_noise(h, w, cell, rng, amp), smooth_noise(h, w, cell, rng, amp)
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    return cv2.remap(img, x + dx, y + dy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)


def seed_phase(rng):
    return float(rng.random() * 100)


def hatch(h, w, angle_deg, pitch, density, rng, wobble):
    """Soft parallel pencil lines; `density` (0..1 per pixel) is the fraction of each pitch that is covered."""
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    a = math.radians(angle_deg)
    u = (x * math.cos(a) + y * math.sin(a)) + smooth_noise(h, w, 38, rng, wobble)
    v = (x * -math.sin(a) + y * math.cos(a))
    # each stroke starts and stops at its own place along the line (a hand lifts the pencil)
    line_id = np.floor(u / pitch)
    rnd = np.sin(line_id * 12.9898 + seed_phase(rng)) * 43758.5453
    start = (rnd - np.floor(rnd))
    v = (x * -math.sin(a) + y * math.cos(a))
    along = (v / (26.0 + 60.0 * start) + start * 7.0) % 1.0
    gap = np.clip((along - 0.04) * 22.0, 0, 1) * np.clip((0.96 - along) * 22.0, 0, 1)
    phase = (u / pitch) % 1.0
    width = np.clip(density, 0, 1) * 0.95
    line = np.clip((width * 1.05 - np.abs(phase - 0.5) * 2 * 0.5) * 6.0, 0, 1)
    return line * (0.35 + 0.65 * gap)


def pencil(src, dst, seed=3):
    rng = np.random.default_rng(seed)
    im = cv2.imread(src, cv2.IMREAD_UNCHANGED).astype(np.float32) / 255.0
    h, w = im.shape[:2]
    rgb, a = im[..., :3], im[..., 3]
    solid = (a > 0.6).astype(np.float32)
    shadow = np.clip(a - solid * a, 0, 1)                                 # the soft floor shadow
    k = w / 1280.0

    # ---- colour: flatten the render, lift it toward pigment
    flat = cv2.bilateralFilter(rgb, 0, 0.10, 5 * k)
    flat = cv2.GaussianBlur(flat, (0, 0), 1.2 * k)
    hsv = cv2.cvtColor(flat, cv2.COLOR_BGR2HSV)
    hsv[..., 1] = np.clip(hsv[..., 1] * 1.10 + 0.04, 0, 1)
    pig = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
    lum = pig @ np.array([0.114, 0.587, 0.299], np.float32)
    dark = np.clip(1 - lum, 0, 1)
    dens = np.clip(0.30 + 0.80 * dark, 0, 0.98)
    pitch = 6.4 * k
    h1 = hatch(h, w, -48, pitch, dens, rng, 2.2 * k)
    h2 = hatch(h, w, 38, pitch * 1.15, np.clip((0.55 - lum) * 1.6, 0, 1), rng, 2.4 * k)   # cross-hatch only in the shadows
    grain = cv2.GaussianBlur(rng.random((h, w)).astype(np.float32), (0, 0), 0.7)
    grain = np.clip((grain - 0.5) * 2.4 + 0.62, 0, 1)                      # the tooth of the paper, in the pencil
    cov = np.clip(h1 + h2 * 0.85, 0, 1) * grain * (solid > 0)
    cov = np.clip(cov * 0.95 + solid * 0.16, 0, 1) * solid                # a little even tone under the hatching
    cov = warp(cov, rng, 1.6 * k, 40)
    col_rgb = warp(pig, rng, 1.6 * k, 40)
    col_a = np.clip(cov, 0, 1)

    # ---- line: graphite edges of the form
    comp = rgb * a[..., None] + (1 - a[..., None])
    g8 = cv2.cvtColor(np.clip(comp * 255, 0, 255).astype(np.uint8), cv2.COLOR_BGR2GRAY)
    g8 = cv2.GaussianBlur(g8, (0, 0), 1.0 * k)
    e_inner = cv2.Canny(g8, 38, 100).astype(np.float32) / 255.0
    sa = (solid * 255).astype(np.uint8)
    e_outer = cv2.Canny(cv2.GaussianBlur(sa, (0, 0), 1.0), 60, 140).astype(np.float32) / 255.0
    edges = np.maximum(e_inner * 0.8, e_outer)
    ink = cv2.dilate(edges, np.ones((2, 2), np.uint8)) if k < 1.4 else cv2.dilate(edges, np.ones((3, 3), np.uint8))
    ink = cv2.GaussianBlur(ink, (0, 0), 0.8 * k)
    ink = np.clip(ink * 2.2, 0, 1)
    lift = np.clip(0.55 + smooth_noise(h, w, 18, rng, 0.9), 0.15, 1)       # the pencil lifts and presses
    ink = warp(ink * lift * (0.65 + 0.35 * grain), rng, 1.3 * k, 30)
    line_rgb = np.empty_like(rgb)
    line_rgb[:] = (0.13, 0.15, 0.20)                                       # warm graphite (BGR)
    line_a = np.clip(ink * 0.92, 0, 1)

    # ---- ground: a hand-drawn line under the wheels, with a few light strokes beneath it
    import json
    meta = json.load(open(src + '.json'))
    vb = w / 640.0                                                         # the json is in the page diagram's 640-wide units
    gy = int(meta['ground_y'] * vb)
    x0 = int((meta['points']['rear'][0] - meta['wheel_r_px'] * 1.25) * vb)
    x1 = int((meta['points']['front'][0] + meta['wheel_r_px'] * 1.25) * vb)
    ground = np.zeros((h, w), np.float32)
    xs = x0
    while xs < x1:
        ln = int(rng.uniform(40, 150) * k)
        yy = gy + int(rng.normal(0, 1.2) * k)
        cv2.line(ground, (xs, yy), (min(x1, xs + ln), yy + int(rng.normal(0, 1.0))), 1.0, max(1, int(1.6 * k)), cv2.LINE_AA)
        xs += ln + int(rng.uniform(4, 26) * k)
    for j in range(1, 4):                                                   # soft shading strokes below
        xs = x0 + int(rng.uniform(0, 60) * k) + j * 20
        while xs < x1 - 30 * k:
            ln = int(rng.uniform(30, 110) * k)
            yy = gy + int((5 + j * 5) * k)
            cv2.line(ground, (xs, yy), (xs + ln, yy), 0.45 - j * 0.08, max(1, int(1.2 * k)), cv2.LINE_AA)
            xs += ln + int(rng.uniform(10, 46) * k)
    sh_a = np.clip(warp(ground, rng, 1.0 * k, 30) * (0.55 + 0.45 * grain), 0, 1) * 0.75
    sh_rgb = np.empty_like(rgb)
    sh_rgb[:] = (0.30, 0.32, 0.38)

    # ---- layer: shadow, then colour, then line on top
    out_a = sh_a
    out_c = sh_rgb * sh_a[..., None]
    for c_rgb, c_a in ((col_rgb, col_a), (line_rgb, line_a)):
        out_c = c_rgb * c_a[..., None] + out_c * (1 - c_a[..., None])
        out_a = c_a + out_a * (1 - c_a)
    safe = np.maximum(out_a, 1e-4)[..., None]
    out_rgb = np.where(out_a[..., None] > 1e-3, out_c / safe, 0)
    res = np.dstack([np.clip(out_rgb, 0, 1), np.clip(out_a, 0, 1)])
    cv2.imwrite(dst, (res * 255).astype(np.uint8))


if __name__ == '__main__':
    src_dir, dst_dir = sys.argv[1], sys.argv[2]
    os.makedirs(dst_dir, exist_ok=True)
    only = sys.argv[3:]                                                    # optional heights, for a quick test
    for p in sorted(glob.glob(os.path.join(src_dir, 'size_*.png'))):
        name = os.path.basename(p)
        if only and not any(name == 'size_%s.png' % o for o in only):
            continue
        pencil(p, os.path.join(dst_dir, name), seed=int(name.split('_')[1].split('.')[0]))
        print('sketched', name)
