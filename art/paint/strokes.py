"""A stroke-by-stroke oil painter.

    python strokes.py <in.png> <out.png> [--seed N] [--detail 1.0] [--height-out h.png]

Why not just a filter: a Kuwahara filter flattens an image into patches but every patch is the same
kind of mark. A painter builds a picture in passes, from a thin broad underpainting to small, loaded
touches at the end, and the marks follow the forms. This does the same, in software:

  1. The source render is first colour-graded the way a painter mixes a palette: greens are muted
     toward olive and ochre, shadows lean cool and violet, lights lean warm, blacks are lifted.
  2. A canvas is laid in with a broad blurred underpainting.
  3. Then several passes of strokes, big brush to small. Each stroke starts where the canvas is
     furthest from the picture, runs along the local edge direction (so it wraps a form instead of
     crossing it), and is drawn as a bundle of bristle lines of slightly different tone, with dry
     ragged ends. Foliage, where the direction field is noisy, becomes short dabs; skies and hills,
     where it is calm, become long sweeps.
  4. Every bristle line also writes to a paint-thickness map. Lighting that map from one side makes
     the ridges and edges of the strokes catch the light (impasto), and a woven canvas shows through
     where the paint is thin.
  5. A last glaze: soft vignette, a warm varnish cast, a trace of grain.

Needs numpy, opencv and scipy (see art/README or make_intro.sh for how they are installed).
"""
import argparse
import math
import os
import sys
import time

if os.environ.get('PYLIBS'):                      # a folder made with `pip install --target` (opencv, scipy)
    sys.path.insert(0, os.environ['PYLIBS'])

import cv2
import numpy as np
from scipy import ndimage as ndi


# ------------------------------------------------------------------ colour: a painter's palette
def grade(img, muted_greens=0.62, warm=0.05, cool_shadow=0.05, lift=0.045):
    """img: float32 BGR 0..1. Returns a graded copy."""
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)         # H 0..360, S 0..1, V 0..1
    h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    # greens (hue 70..160) lose saturation and slide toward yellow-olive: nature as painters mix it
    g = np.clip(1 - np.abs(h - 105) / 55.0, 0, 1)
    s = s * (1 - g * (1 - muted_greens)) * (1 + 0.28 * (1 - g))   # richer skies, earth and rock
    h = h - g * 9.0
    hsv = np.dstack([h, np.clip(s, 0, 1), v]).astype(np.float32)
    out = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
    lum = out @ np.array([0.114, 0.587, 0.299], np.float32)
    sh = np.clip(1 - lum * 2.2, 0, 1)[..., None]       # shadows: cooler, a touch violet
    hi = np.clip(lum * 2.0 - 0.9, 0, 1)[..., None]     # lights: warmer
    out = out + sh * np.array([cool_shadow * 0.8, -cool_shadow * 0.15, cool_shadow * 0.15], np.float32)  # B,G,R
    out = out + hi * np.array([-warm * 0.7, warm * 0.2, warm], np.float32)
    # lift the blacks toward a warm umber: oil paint never reaches true black
    out = lift * np.array([0.30, 0.38, 0.55], np.float32) + (1 - lift) * out
    out = np.clip(out, 0, 1)
    out = 0.5 * out + 0.5 * (out * out * (3 - 2 * out))        # a gentle S-curve: deeper darks, clearer lights
    return out


# ------------------------------------------------------------------ direction field
def direction_field(gray, sigma_d, sigma_t, seed=0):
    """Per-pixel stroke direction (unit vector) and coherence, from the smoothed structure tensor."""
    g = cv2.GaussianBlur(gray, (0, 0), sigma_d)
    gx = cv2.Sobel(g, cv2.CV_32F, 1, 0, ksize=3)
    gy = cv2.Sobel(g, cv2.CV_32F, 0, 1, ksize=3)
    jxx = cv2.GaussianBlur(gx * gx, (0, 0), sigma_t)
    jxy = cv2.GaussianBlur(gx * gy, (0, 0), sigma_t)
    jyy = cv2.GaussianBlur(gy * gy, (0, 0), sigma_t)
    tr = jxx + jyy
    vx, vy = jxx - jyy, 2 * jxy
    mag = np.sqrt(vx * vx + vy * vy)
    coh = mag / (tr + 1e-6)
    # where the image is flat there is no edge to follow: fall back to a slow wandering flow
    rng = np.random.default_rng(seed)
    h, w = gray.shape
    lo = cv2.resize(rng.standard_normal((6, 8)).astype(np.float32), (w, h), interpolation=cv2.INTER_CUBIC)
    default_ang = 0.35 * lo                               # mostly horizontal, +- ~20 degrees
    weight = np.clip(tr / (tr.max() * 0.004 + 1e-9), 0, 1) * np.clip(coh * 1.6, 0, 1)
    # stroke runs ALONG the edge = perpendicular to the gradient = doubled angle + pi
    ex = -vx / (mag + 1e-9) * weight + np.cos(2 * default_ang) * (1 - weight)
    ey = -vy / (mag + 1e-9) * weight + np.sin(2 * default_ang) * (1 - weight)
    ang = 0.5 * np.arctan2(ey, ex)
    return np.cos(ang).astype(np.float32), np.sin(ang).astype(np.float32), np.clip(coh * weight, 0, 1).astype(np.float32)


# ------------------------------------------------------------------ the painter
class Painter:
    def __init__(self, ref, seed=1, detail=1.0):
        self.rng = np.random.default_rng(seed)
        self.h, self.w = ref.shape[:2]
        self.ref = ref
        self.canvas = np.zeros((self.h, self.w, 3), np.uint8)
        self.height = np.zeros((self.h, self.w), np.float32)
        self.cover = np.zeros((self.h, self.w), np.float32)     # how much paint sits on each pixel
        self.detail = detail

    # one full pass with brush radius R
    def layer(self, R, err_thresh, grid=1.0, length=3.2, min_len=2, max_strokes=70000, force=False, bristle_amp=0.04, focus=None, focus_only=False):
        rng = self.rng
        h, w = self.h, self.w
        ref = cv2.GaussianBlur(self.ref, (0, 0), max(0.6, R * 0.38))
        gray = ref @ np.array([0.114, 0.587, 0.299], np.float32)
        cx, cy, coh = direction_field(gray, sigma_d=max(1.0, R * 0.45), sigma_t=max(2.5, R * 1.6), seed=int(R * 13))
        cur = self.canvas.astype(np.float32) / 255.0
        err = np.abs(cur - ref).sum(axis=2)
        cell = max(2, int(round(R * grid)))
        gh, gw = (h + cell - 1) // cell, (w + cell - 1) // cell
        # the worst-matching pixel in every cell is where a stroke starts
        pad = np.zeros((gh * cell, gw * cell), np.float32)
        pad[:h, :w] = cv2.GaussianBlur(err, (0, 0), max(0.8, R * 0.3))
        blocks = pad.reshape(gh, cell, gw, cell).transpose(0, 2, 1, 3).reshape(gh, gw, cell * cell)
        arg = blocks.argmax(axis=2)
        mx = blocks.max(axis=2)
        gy, gx = np.mgrid[0:gh, 0:gw]
        sy = np.minimum(gy * cell + arg // cell, h - 1)
        sx = np.minimum(gx * cell + arg % cell, w - 1)
        if focus is not None:
            fcell = focus[sy, sx]                              # 1 inside the area the eye should rest on (the bike)
            thr = err_thresh * (1 - 0.6 * fcell)               # a painter keeps working there, so lower the bar
            take = (mx > thr) | force
            if focus_only:
                take = take & (fcell > 0.5)
        else:
            take = (mx > err_thresh) | force
        pts = np.stack([sx[take], sy[take]], axis=1)
        if len(pts) > max_strokes:
            order = np.argsort(-mx[take])[:max_strokes]
            pts = pts[order]
        rng.shuffle(pts)
        step = max(1.0, R * 0.55)
        nsteps = int(length * 7)
        bristles = int(np.clip(R * 1.1, 3, 11))
        n_drawn = 0
        for sx0, sy0 in pts:
            col = ref[sy0, sx0]
            line = self._trace(sx0, sy0, cx, cy, coh, ref, col, step, nsteps, min_len, R)
            if line is None:
                continue
            self._draw(line, col, R, bristles, bristle_amp)
            n_drawn += 1
        return n_drawn

    def _trace(self, x0, y0, cx, cy, coh, ref, col, step, nsteps, min_len, R):
        h, w = self.h, self.w
        tol = 0.16 + 0.012 * R
        halves = []
        c0 = float(coh[y0, x0])
        lim = nsteps                                               # runs until the picture changes colour under it: calm areas give long sweeps
        for sign in (1.0, -1.0):
            x, y = float(x0), float(y0)
            pdx, pdy = cx[y0, x0] * sign, cy[y0, x0] * sign
            out = []
            for i in range(lim // 2 + 1):
                xi, yi = int(x), int(y)
                if xi < 0 or yi < 0 or xi >= w or yi >= h:
                    break
                dx, dy = cx[yi, xi], cy[yi, xi]
                if dx * pdx + dy * pdy < 0:
                    dx, dy = -dx, -dy
                # limit curvature a little so strokes don't kink
                dx, dy = 0.6 * dx + 0.4 * pdx, 0.6 * dy + 0.4 * pdy
                n = math.hypot(dx, dy) + 1e-9
                dx, dy = dx / n, dy / n
                x += dx * step
                y += dy * step
                xi, yi = int(x), int(y)
                if xi < 0 or yi < 0 or xi >= w or yi >= h:
                    break
                d = abs(ref[yi, xi] - col).sum()
                out.append((x, y))
                if d > tol and i >= 1:
                    break
                pdx, pdy = dx, dy
            halves.append(out)
        pts = halves[1][::-1] + [(float(x0), float(y0))] + halves[0]
        if len(pts) < min_len + 1:
            return None
        return np.array(pts, np.float32)

    def _draw(self, line, col, R, nb, amp):
        rng = self.rng
        n = len(line)
        # per-point unit normals
        t = np.gradient(line, axis=0) if n > 2 else np.diff(line, axis=0, append=line[-1:] + (line[-1:] - line[:1]))
        tn = t / (np.linalg.norm(t, axis=1, keepdims=True) + 1e-9)
        nrm = np.stack([-tn[:, 1], tn[:, 0]], axis=1)
        width = 2.0 * R
        base_h = rng.uniform(0.45, 0.6)
        paint_load = rng.uniform(0.75, 1.0)
        # one tone for the whole stroke (the mix on the brush), plus a little drift along it
        tone = 1 + rng.normal(0, 0.032)
        warm = rng.normal(0, 0.007, 3)
        base = np.clip(col * tone + warm, 0, 1)
        thick = max(1.0, width / nb * 1.35)
        for b in range(nb):
            off = (b / max(1, nb - 1) - 0.5) * width * 0.92
            # a bristle can run short at either end (dry brush, ragged edges)
            s0 = int(rng.uniform(0, 0.22) * n)
            s1 = n - int(rng.uniform(0, 0.28) * n)
            if s1 - s0 < 2:
                s0, s1 = 0, n
            seg = line[s0:s1] + nrm[s0:s1] * off + rng.normal(0, 0.18, (s1 - s0, 2)).astype(np.float32)
            bt = 1 + rng.normal(0, amp)                         # each bristle holds a slightly different load
            c = np.clip(base * bt, 0, 1) * 255
            ip = np.round(seg * 16).astype(np.int32).reshape(-1, 1, 2)
            cv2.polylines(self.canvas, [ip], False, (float(c[0]), float(c[1]), float(c[2])), int(round(thick)), cv2.LINE_AA, 4)
            edge = abs(b / max(1, nb - 1) - 0.5) * 2            # 0 mid-stroke .. 1 at the edge: paint ridges at the sides
            hv = base_h + 0.10 * edge * edge + rng.normal(0, 0.16)
            cv2.polylines(self.height, [ip], False, float(hv * paint_load), int(round(thick)), cv2.LINE_8, 4)


# ------------------------------------------------------------------ canvas, lighting, glaze
def weave(h, w, pitch=4.6, seed=3):
    rng = np.random.default_rng(seed)
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    a = np.sin(2 * math.pi * x / pitch) * np.sin(2 * math.pi * (y + pitch / 2) / (pitch * 2)) * 0.5
    b = np.sin(2 * math.pi * y / pitch) * np.sin(2 * math.pi * (x + pitch / 2) / (pitch * 2)) * 0.5
    over = ((np.floor(x / pitch) + np.floor(y / pitch)) % 2).astype(np.float32)
    v = a * over + b * (1 - over)
    slub = cv2.resize(rng.standard_normal((h // 40 + 2, w // 40 + 2)).astype(np.float32), (w, h), interpolation=cv2.INTER_CUBIC)
    return v * 0.5 + 0.18 * slub + 0.08 * rng.standard_normal((h, w)).astype(np.float32)


def finish(canvas, height, ref, impasto=0.42, canvas_tooth=0.10, vignette=0.18, varnish=0.035, seed=5):
    h, w = canvas.shape[:2]
    col = canvas.astype(np.float32) / 255.0
    # calm areas (sky, haze, distant hills) get scumbled: the strokes are blended into each other
    lum = ref @ np.array([0.114, 0.587, 0.299], np.float32)
    m1 = cv2.GaussianBlur(lum, (0, 0), 5 * w / 1500.0)
    var = cv2.GaussianBlur((lum - m1) ** 2, (0, 0), 5 * w / 1500.0)
    calm = np.clip(1 - np.sqrt(var) / 0.035, 0, 1)
    calm = cv2.GaussianBlur(calm, (0, 0), 6 * w / 1500.0)
    soft = cv2.GaussianBlur(col, (0, 0), 3.2 * w / 1500.0)
    col = col * (1 - 0.75 * calm[..., None]) + soft * 0.75 * calm[..., None]
    height = height * (1 - 0.7 * calm)
    cw = weave(h, w, pitch=max(3.2, w / 330.0), seed=seed)
    # thin paint (low height) shows the weave; thick paint hides it
    thin = np.clip(1 - height * 1.3, 0, 1)
    ht = cv2.GaussianBlur(height, (0, 0), 1.0) + cw * canvas_tooth * (0.25 + 0.75 * thin)
    gx = cv2.Sobel(ht, cv2.CV_32F, 1, 0, ksize=3) / 8.0
    gy = cv2.Sobel(ht, cv2.CV_32F, 0, 1, ksize=3) / 8.0
    k = impasto * 3.2
    nx, ny, nz = -gx * k, -gy * k, np.ones_like(gx)
    nn = np.sqrt(nx * nx + ny * ny + nz * nz)
    nx, ny, nz = nx / nn, ny / nn, nz / nn
    L = np.array([-0.55, -0.62, 0.56], np.float32)
    L /= np.linalg.norm(L)
    diff = nx * L[0] + ny * L[1] + nz * L[2]
    diff0 = L[2]
    shade = 1 + (diff - diff0) * 1.15
    Hh = L + np.array([0, 0, 1], np.float32)
    Hh /= np.linalg.norm(Hh)
    spec = np.clip(nx * Hh[0] + ny * Hh[1] + nz * Hh[2], 0, 1) ** 38 * 0.10
    out = col * np.clip(shade, 0.55, 1.5)[..., None] + spec[..., None]
    # varnish: a faint warm amber film, slightly deeper in the darks
    out = out + varnish * np.array([-0.5, 0.3, 1.0], np.float32)
    lum = out @ np.array([0.114, 0.587, 0.299], np.float32)
    out = out * (1 - 0.06 * (1 - lum[..., None]))
    # vignette
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    r = np.sqrt(((x - w / 2) / (w * 0.62)) ** 2 + ((y - h / 2) / (h * 0.70)) ** 2)
    out = out * (1 - vignette * np.clip(r - 0.55, 0, 1) ** 1.6)[..., None]
    return np.clip(out, 0, 1)


# ------------------------------------------------------------------ driver
def run(src, dst, seed=1, detail=1.0, scale=None, ref_blur=0.9, quiet=False, focus_json=None):
    t0 = time.time()
    raw = cv2.imread(src, cv2.IMREAD_COLOR).astype(np.float32) / 255.0
    h, w = raw.shape[:2]
    # facets of low-poly forms are noise to a painter: soften them before the paint goes on
    ref = grade(raw)
    ref = cv2.bilateralFilter(ref, 0, 0.09, max(2.0, w / 700.0))
    ref = cv2.GaussianBlur(ref, (0, 0), ref_blur * w / 1500.0)
    S = scale or (w / 1500.0)                                   # brush sizes are relative to image width
    p = Painter(ref, seed=seed, detail=detail)
    focus = None
    import json, os
    fj = focus_json or (src + '.focus.json')
    if os.path.exists(fj):
        x0, y0, x1, y1 = json.load(open(fj))['box']              # normalised box around the bike
        focus = np.zeros((h, w), np.float32)
        focus[int(y0 * h):int(y1 * h), int(x0 * w):int(x1 * w)] = 1
        focus = cv2.GaussianBlur(focus, (0, 0), 0.02 * w)
    # underpainting: a broad, thin lay-in over the whole canvas
    base = cv2.GaussianBlur(ref, (0, 0), 14 * S)
    p.canvas[:] = np.clip(base * 255, 0, 255).astype(np.uint8)
    p.height[:] = 0.2
    plan = [  # (brush radius px at 1500 wide, error threshold, length factor, grid)
        (30, 0.0, 3.6, 0.9, True),
        (18, 0.12, 3.6, 0.9, False),
        (11, 0.12, 3.2, 0.95, False),
        (7, 0.14, 2.8, 1.0, False),
        (4.4, 0.18, 2.4, 1.0, False),
        (2.8, 0.30, 2.0, 1.1, False),
    ]
    for R, thr, ln, grid, force in plan:
        Rs = max(1.4, R * S)
        n = p.layer(Rs, thr / max(0.4, detail), grid=grid, length=ln, force=force, max_strokes=90000, focus=focus)
        if not quiet:
            print('  layer R=%.1f strokes=%d  (%.0fs)' % (Rs, n, time.time() - t0), flush=True)
    if focus is not None:
        for R, thr, ln in ((1.9, 0.07, 3.2), (1.25, 0.06, 3.0)):
            n = p.layer(max(1.0, R * S), thr, grid=0.9, length=ln, max_strokes=60000, bristle_amp=0.03, focus=focus, focus_only=True)
            if not quiet:
                print('  focus R=%.1f strokes=%d  (%.0fs)' % (R * S, n, time.time() - t0), flush=True)
    out = finish(p.canvas, p.height, ref)
    cv2.imwrite(dst, np.clip(out * 255, 0, 255).astype(np.uint8))
    return dst


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('src')
    ap.add_argument('dst')
    ap.add_argument('--seed', type=int, default=1)
    ap.add_argument('--detail', type=float, default=1.0)
    ap.add_argument('--scale', type=float, default=None, help='brush size multiplier (default: relative to image width)')
    ap.add_argument('--no-focus', action='store_true')
    a = ap.parse_args()
    run(a.src, a.dst, a.seed, a.detail, scale=a.scale, focus_json='/nonexistent' if a.no_focus else None)
    print('PAINTED', a.dst)
