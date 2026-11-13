"""Builds the Fig. 001 <svg> for each category page: the studio render with the dimension lines laid over it.

    python art/make_fig_markup.py [art/out/figs]        rewrites the Fig. 001 svg in the five category pages

The dimension lines are placed from the key points the renderer wrote (fig_<kind>.png.json), so they
sit on the real wheels, axles and top tube of the picture instead of on a drawing.
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FIGS = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'art', 'out', 'figs')

PAGES = {
    'kids.html': dict(kind='kids', img='kids', wheel='⌀ 16–20″', standover='43–56 cm', wheelbase='WHEELBASE 84–102 cm', note=('seat_post_top', 'grows ~9cm', 28, -20, False),
                      alt="Studio render of a kids' bike, annotated with wheel diameter, standover height, wheelbase, and seat height range"),
    'commute.html': dict(kind='commute', img='commute', wheel='⌀ 700c', standover='76–86 cm', wheelbase='WHEELBASE 100–107 cm', note=('rack', 'rack-ready', -86, -36, False),
                         alt='Studio render of a commuter bike with fenders, a rear rack and a pannier, annotated with wheel diameter, standover height, wheelbase, and the rear rack'),
    'racing.html': dict(kind='road', img='road', wheel='⌀ 700c', standover='68–84 cm', wheelbase='WHEELBASE 97–102 cm', note=('bar_clamp', 'marginal gains', 30, -18, False),
                        alt='Studio render of a road racing bike, annotated with wheel diameter, standover height, and wheelbase'),
    'mountainbiking.html': dict(kind='mtb', img='mtb', wheel='⌀ 27.5 / 29', standover=None, wheelbase='WHEELBASE — stable at speed', note=('shock', 'rear shock', -24, -118, True),
                                travel=True,
                                alt='Studio render of a full-suspension mountain bike, annotated with wheel diameter, front and rear suspension travel, and wheelbase'),
    'bikepacking.html': dict(kind='gravel', img='gravel', wheel='⌀ 650b/700c', standover=None, wheelbase='WHEELBASE — loaded &amp; steady', note=('pannier', 'racks & panniers', -30, -128, True),
                             alt='Studio render of a loaded bikepacking bike with front and rear racks, panniers, a duffel and a handlebar bag, annotated with wheel diameter, standover height, and wheelbase'),
}


def f(v):
    return ('%.1f' % v).rstrip('0').rstrip('.')


def build(cfg):
    meta = json.load(open(os.path.join(FIGS, 'fig_%s.png.json' % cfg['img'])))
    P = meta['points']
    ground, top = meta['ground_y'], meta['top_y']
    rw, fw = P['rear'], P['front']
    wr = meta['wheel_r_px']
    left = rw[0] - wr
    out = ['<svg class="bike-diagram" viewBox="0 0 640 410" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="%s">' % cfg['alt'],
           '<image href="images/figs/fig_%s.webp" x="0" y="0" width="640" height="410" preserveAspectRatio="xMidYMid meet"/>' % cfg['img']]
    # wheel diameter, on the left of the rear wheel
    x = max(40, left - 22)
    out.append('<g class="dim-minor">'
               '<line class="dim-ext" x1="%s" y1="%s" x2="%s" y2="%s"/><line class="dim-ext" x1="%s" y1="%s" x2="%s" y2="%s"/>'
               '<line class="dim-line" x1="%s" y1="%s" x2="%s" y2="%s"/><line class="dim-tick" x1="%s" y1="%s" x2="%s" y2="%s"/><line class="dim-tick" x1="%s" y1="%s" x2="%s" y2="%s"/>'
               '<text class="dim-label" x="8" y="%s">WHEEL</text><text class="dim-label" x="8" y="%s">%s</text></g>' % (
                   f(x), f(top), f(left + 6), f(top), f(x), f(ground), f(left + 6), f(ground),
                   f(x), f(top), f(x), f(ground), f(x - 7), f(top), f(x + 7), f(top), f(x - 7), f(ground), f(x + 7), f(ground),
                   f(top - 24), f(top - 8), cfg['wheel']))
    # standover, between the wheels at the top tube
    tt = ((P['tt_seat'][0] * 0.45 + P['head_top'][0] * 0.55), (P['tt_seat'][1] * 0.45 + P['head_top'][1] * 0.55))
    sx = tt[0]
    out.append('<g class="dim-minor">'
               '<line class="dim-line" x1="%s" y1="%s" x2="%s" y2="%s"/><line class="dim-tick" x1="%s" y1="%s" x2="%s" y2="%s"/><line class="dim-tick" x1="%s" y1="%s" x2="%s" y2="%s"/>' % (
                   f(sx), f(tt[1]), f(sx), f(ground), f(sx - 7), f(tt[1]), f(sx + 7), f(tt[1]), f(sx - 7), f(ground), f(sx + 7), f(ground)))
    if cfg['standover']:
        ly = min(P['saddle'][1], P['bar_clamp'][1]) - 40
        out.append('<line class="dim-ext" x1="%s" y1="%s" x2="%s" y2="%s"/>' % (f(sx), f(tt[1] - 4), f(sx), f(ly + 6)))
        out.append('<text class="dim-label" x="%s" y="%s" text-anchor="middle">STANDOVER</text><text class="dim-label" x="%s" y="%s" text-anchor="middle">%s</text>' % (
            f(sx), f(ly - 14), f(sx), f(ly), cfg['standover']))
    out.append('</g>')
    # front suspension travel (mountain bike)
    if cfg.get('travel'):
        fm = P['fork_mid']
        out.append('<g class="dim-minor"><line class="dim-ext" x1="%s" y1="%s" x2="%s" y2="%s"/>'
                   '<text class="dim-label" x="%s" y="%s">FRONT</text><text class="dim-label" x="%s" y="%s">TRAVEL</text></g>' % (
                       f(fm[0] + 4), f(fm[1]), f(fm[0] + 34), f(fm[1] - 40), f(fm[0] + 36), f(fm[1] - 60), f(fm[0] + 36), f(fm[1] - 44)))
    # wheelbase along the bottom
    yb = ground + 25
    out.append('<line class="dim-ext" x1="%s" y1="%s" x2="%s" y2="%s"/><line class="dim-ext" x1="%s" y1="%s" x2="%s" y2="%s"/>'
               '<line class="dim-line" x1="%s" y1="%s" x2="%s" y2="%s"/><line class="dim-tick" x1="%s" y1="%s" x2="%s" y2="%s"/><line class="dim-tick" x1="%s" y1="%s" x2="%s" y2="%s"/>'
               '<text class="dim-label" x="%s" y="%s" text-anchor="middle">%s</text>' % (
                   f(rw[0]), f(rw[1]), f(rw[0]), f(yb + 6), f(fw[0]), f(fw[1]), f(fw[0]), f(yb + 6),
                   f(rw[0]), f(yb), f(fw[0]), f(yb), f(rw[0]), f(yb - 7), f(rw[0]), f(yb + 7), f(fw[0]), f(yb - 7), f(fw[0]), f(yb + 7),
                   f((rw[0] + fw[0]) / 2), f(yb + 27), cfg['wheelbase']))
    # a hand-drawn call-out
    key, text, dx, dy, leader = cfg['note']
    px, py = P[key]
    out.append('<ellipse class="hand-circle" cx="%s" cy="%s" rx="26" ry="17" transform="rotate(-8 %s %s)"/>' % (f(px), f(py), f(px), f(py)))
    if leader:
        out.append('<line x1="%s" y1="%s" x2="%s" y2="%s" style="stroke:var(--signal); stroke-width:1.4; stroke-dasharray:4 3;"/>' % (f(px + dx + 28), f(py + dy + 8), f(px), f(py - 17)))
    out.append('<text class="hand-note" x="%s" y="%s" transform="rotate(-4 %s %s)">%s</text>' % (f(px + dx), f(py + dy), f(px + dx), f(py + dy), text))
    out.append('</svg>')
    return ''.join(out)


for page, cfg in PAGES.items():
    path = os.path.join(ROOT, page)
    html = open(path, encoding='utf8', newline='').read()
    new_html, n = re.subn(r'<svg class="bike-diagram".*?</svg>', lambda m: build(cfg), html, count=1, flags=re.S)
    if n != 1:
        raise SystemExit('no diagram found in ' + page)
    open(path, 'w', encoding='utf8', newline='').write(new_html)
    print('updated', page)
