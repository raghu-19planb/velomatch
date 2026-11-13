"""Five procedural bikes for Blender: kids, commute, road, mountain (full suspension), gravel/bikepacking.

    import bikes
    info = bikes.build('mtb', frame=(0.55, 0.06, 0.02), accent=(0.95, 0.75, 0.1))

Everything is built from tubes, tori and a few primitives with believable proportions, so a studio
render reads as a real product shot with no downloaded model. Units are metres, the bike points along
+X, Z is up, the drive side (chainring, cassette) is on -Y. `build` returns a dict of key points
(side-view x, z) that the figure renderer projects to place the dimension lines, and that rider.py
uses to seat a rider on the bike.
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bikelib as bl  # noqa: E402
import bpy  # noqa: E402
from mathutils import Vector  # noqa: E402

V = Vector

# Side-view geometry: (x, z) pairs. R = outside radius of the tyre, t = tyre section radius.
SPECS = {
    'road': dict(R=0.340, t=0.0155, bb=0.270, rear=-0.410, front=0.575, seat_top=(-0.158, 0.790), tt_seat=(-0.150, 0.745),
                 head_top=(0.385, 0.832), head_bot=(0.426, 0.698), bars='drop', fork='rigid', spokes=28, ring=0.096, cogs=0.052, crank=0.172,
                 stem=(0.090, 0.058), saddle=0.130, post=0.050),
    'gravel': dict(R=0.352, t=0.0205, bb=0.272, rear=-0.428, front=0.600, seat_top=(-0.168, 0.805), tt_seat=(-0.160, 0.755),
                   head_top=(0.398, 0.858), head_bot=(0.444, 0.712), bars='drop', fork='rigid', spokes=28, ring=0.090, cogs=0.052, crank=0.172,
                   stem=(0.085, 0.045), saddle=0.130, post=0.055),
    'commute': dict(R=0.352, t=0.019, bb=0.292, rear=-0.445, front=0.600, seat_top=(-0.190, 0.835), tt_seat=(-0.178, 0.775),
                    head_top=(0.370, 0.905), head_bot=(0.415, 0.780), bars='swept', fork='rigid', spokes=32, ring=0.088, cogs=0.046, crank=0.170,
                    stem=(0.060, 0.115), saddle=0.150, post=0.060),
    'mtb': dict(R=0.375, t=0.031, bb=0.336, rear=-0.438, front=0.655, seat_top=(-0.150, 0.805), tt_seat=(-0.140, 0.775),
                head_top=(0.395, 0.975), head_bot=(0.442, 0.852), bars='riser', fork='suspension', spokes=32, ring=0.068, cogs=0.052, crank=0.175,
                stem=(0.048, 0.030), saddle=0.120, post=0.130),
    'kids': dict(R=0.254, t=0.024, bb=0.222, rear=-0.320, front=0.560, seat_top=(-0.128, 0.620), tt_seat=(-0.122, 0.505),
                 head_top=(0.350, 0.640), head_bot=(0.388, 0.530), bars='kids', fork='rigid', spokes=28, ring=0.062, cogs=0.034, crank=0.125,
                 stem=(0.040, 0.060), saddle=0.105, post=0.080),
}


def _tyre(mat):
    """Rubber with a fine tread-like bump, so tyres do not read as smooth rubber rings."""
    nt = mat.node_tree
    vor = nt.nodes.new('ShaderNodeTexVoronoi')
    vor.inputs['Scale'].default_value = 420.0
    bump = nt.nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = 0.55
    bump.inputs['Distance'].default_value = 0.002
    coord = nt.nodes.new('ShaderNodeTexCoord')
    nt.links.new(coord.outputs['Object'], vor.inputs['Vector'])
    nt.links.new(vor.outputs['Distance'], bump.inputs['Height'])
    nt.links.new(bump.outputs['Normal'], nt.nodes['Principled BSDF'].inputs['Normal'])
    return mat


def _mats(frame, accent):
    m = bl.material
    return {
        'frame': m('frame', frame, metallic=0.35, roughness=0.30, coat=1.0, coat_rough=0.02),
        'accent': m('accent', accent, roughness=0.38, coat=0.6),
        'tyre': _tyre(m('tyre', (0.012, 0.012, 0.013), roughness=0.82)),
        'rim': m('rim', (0.025, 0.025, 0.028), metallic=0.7, roughness=0.3),
        'alu': m('alu', (0.80, 0.81, 0.82), metallic=1.0, roughness=0.2),
        'steel': m('steel', (0.55, 0.56, 0.58), metallic=1.0, roughness=0.3),
        'dark': m('dark', (0.018, 0.018, 0.02), roughness=0.5),
        'tape': m('tape', (0.025, 0.025, 0.028), roughness=0.88),
        'saddle': m('saddle', (0.03, 0.03, 0.032), roughness=0.55),
        'leather': m('leather', (0.30, 0.15, 0.07), roughness=0.5, coat=0.3),
        'stanchion': m('stanchion', (0.86, 0.72, 0.30), metallic=1.0, roughness=0.18),
        'coil': m('coil', (0.85, 0.12, 0.08), metallic=0.6, roughness=0.3),
        'canvas': m('canvas', (0.07, 0.15, 0.17), roughness=0.9),
        'bagorange': m('bagorange', (0.78, 0.24, 0.05), roughness=0.85),
        'bagteal': m('bagteal', (0.03, 0.20, 0.17), roughness=0.85),
        'glass': m('glass', (0.9, 0.9, 0.9), roughness=0.1, metallic=0.0),
        'light': m('light', (0.95, 0.95, 0.85), roughness=0.15),
        'red': m('red', (0.8, 0.03, 0.03), roughness=0.2),
    }


def _strip(name, pts_xz, y0, y1, mat, thickness=0.002):
    """A thin curved sheet (a mudguard) following a polyline in the x-z plane, from y0 to y1."""
    verts, faces = [], []
    for i, (x, z) in enumerate(pts_xz):
        verts += [(x, y0, z), (x, y1, z)]
        if i:
            b = 2 * i
            faces.append((b - 2, b - 1, b + 1, b))
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    o = bpy.data.objects.new(name, mesh)
    o.data.materials.append(mat)
    bpy.context.scene.collection.objects.link(o)
    sol = o.modifiers.new('s', 'SOLIDIFY')
    sol.thickness = thickness
    return bl.smooth(o)


def _wheel(prefix, cx, R, t, hub_w, mats, spokes, cassette=None, rotor=0.080, knobs=False):
    cz = R
    rim_major = R - 2 * t - 0.003
    bl.torus(prefix + '_tyre', (cx, 0, cz), R - t, t, mats['tyre'], segs=160, minor_segs=28)
    bl.torus(prefix + '_rim', (cx, 0, cz), rim_major, 0.0085 + (0.004 if t > 0.025 else 0), mats['rim'], segs=128, minor_segs=16)
    bl.cyl(prefix + '_hub', (cx, 0, cz), 0.014, hub_w * 0.55, mats['alu'])
    for side in (-1, 1):
        bl.cyl('%s_flange%d' % (prefix, side), (cx, side * hub_w * 0.42, cz), 0.026, 0.004, mats['alu'])
    for i in range(spokes):
        side = -1 if i % 2 == 0 else 1
        th = 2 * math.pi * i / spokes
        rim_th = th + side * 0.86
        hx, hz = cx + 0.026 * math.cos(th), cz + 0.026 * math.sin(th)
        rx, rz = cx + (rim_major - 0.004) * math.cos(rim_th), cz + (rim_major - 0.004) * math.sin(rim_th)
        bl.tube('%s_spoke%d' % (prefix, i), [(hx, side * hub_w * 0.42, hz), (rx, side * 0.0045, rz)], 0.0011, mats['alu'], res=3)
    if rotor:
        bl.cyl(prefix + '_rotor', (cx, hub_w * 0.5 + 0.004, cz), rotor, 0.0018, mats['steel'])
        bl.cyl(prefix + '_rotor_hub', (cx, hub_w * 0.5 + 0.004, cz), 0.026, 0.004, mats['dark'])
    if cassette:
        y0 = -hub_w * 0.5 - 0.006
        n = 11
        for k in range(n):
            r = cassette * (1 - 0.64 * k / (n - 1))
            bl.cyl('cog%d' % k, (cx, y0 - k * 0.0034, cz), r, 0.0024, mats['steel'], verts=40)


def _chain(bb, rear, ring_r, cog_r, mat, y=-0.040):
    c1, c2 = V((bb.x, bb.z)), V((rear.x, rear.z))
    d = (c2 - c1).length
    u = (c2 - c1) / d
    perp = V((-u.y, u.x))
    th = math.acos((ring_r - cog_r) / d)
    n_up = u * math.cos(th) + perp * math.sin(th)
    n_dn = u * math.cos(th) - perp * math.sin(th)
    a_up, a_dn = math.atan2(n_up.y, n_up.x), math.atan2(n_dn.y, n_dn.x)
    pts, steps = [], 26
    start, end = a_up, a_dn
    if end > start:
        end -= 2 * math.pi
    for i in range(steps + 1):
        a = start + (end - start) * i / steps
        pts.append((c1.x + ring_r * math.cos(a), y, c1.y + ring_r * math.sin(a)))
    start, end = a_dn, a_up
    if end < start:
        end += 2 * math.pi
    for i in range(steps + 1):
        a = start + (end - start) * i / steps
        pts.append((c2.x + cog_r * math.cos(a), y, c2.y + cog_r * math.sin(a)))
    cu = bpy.data.curves.new('chain', 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth = 0.0034
    cu.bevel_resolution = 4
    sp = cu.splines.new('POLY')
    sp.points.add(len(pts) - 1)
    for i, p in enumerate(pts):
        sp.points[i].co = (p[0], p[1], p[2], 1)
    sp.use_cyclic_u = True
    o = bpy.data.objects.new('chain', cu)
    o.data.materials.append(mat)
    bpy.context.scene.collection.objects.link(o)


def _bars(kind, x0, z0, mats):
    """Handlebar half-curve points from the stem clamp (centre) outward on the -Y side; returns (curve points, grip centre, hand point)."""
    if kind == 'drop':
        half = [(0.0, -0.026, 0.0), (0.0, -0.100, 0.0), (0.0, -0.198, -0.002), (0.026, -0.211, -0.008), (0.086, -0.215, -0.032),
                (0.126, -0.212, -0.068), (0.127, -0.207, -0.118), (0.090, -0.205, -0.156), (0.038, -0.205, -0.162), (0.010, -0.205, -0.157)]
        hand = (0.082, -0.209, -0.040)
        mat = mats['tape']
        rad = 0.0115
    elif kind == 'riser':
        half = [(0.0, -0.026, 0.0), (0.0, -0.10, 0.0), (-0.004, -0.22, 0.022), (-0.020, -0.34, 0.044), (-0.032, -0.390, 0.050)]
        hand = (-0.020, -0.340, 0.048)
        mat = mats['dark']
        rad = 0.0115
    elif kind == 'swept':
        half = [(0.0, -0.026, 0.0), (0.0, -0.10, 0.004), (-0.020, -0.200, 0.012), (-0.080, -0.262, 0.020), (-0.150, -0.290, 0.026)]
        hand = (-0.115, -0.280, 0.024)
        mat = mats['dark']
        rad = 0.0115
    else:  # kids
        half = [(0.0, -0.026, 0.0), (0.0, -0.10, 0.0), (-0.004, -0.17, 0.016), (-0.014, -0.235, 0.030), (-0.022, -0.275, 0.034)]
        hand = (-0.014, -0.235, 0.030)
        mat = mats['dark']
        rad = 0.011
    return [(x0 + p[0], p[1], z0 + p[2]) for p in half], (x0 + hand[0], hand[1], z0 + hand[2]), mat, rad


def build(kind, frame=(0.012, 0.19, 0.16), accent=(0.89, 0.33, 0.11), pedal_angle=-0.35, extras=True):
    S = SPECS[kind]
    mats = _mats(frame, accent)
    R, t = S['R'], S['t']
    BB = V((0.0, 0.0, S['bb']))
    REAR = V((S['rear'], 0.0, R))
    FRONT = V((S['front'], 0.0, R))
    seat_top = V((S['seat_top'][0], 0.0, S['seat_top'][1]))
    tt_seat = V((S['tt_seat'][0], 0.0, S['tt_seat'][1]))
    head_top = V((S['head_top'][0], 0.0, S['head_top'][1]))
    head_bot = V((S['head_bot'][0], 0.0, S['head_bot'][1]))
    F, T, M = mats['frame'], mats['tyre'], mats
    big = kind in ('mtb',)
    tw = 1.35 if big else 1.0                         # tube thickness
    key = {'R': R, 'rear': (REAR.x, REAR.z), 'front': (FRONT.x, FRONT.z), 'bb': (BB.x, BB.z), 'seat_top': (seat_top.x, seat_top.z),
           'tt_seat': (tt_seat.x, tt_seat.z), 'head_top': (head_top.x, head_top.z), 'head_bot': (head_bot.x, head_bot.z), 'crank': S['crank'],
           'ring': S['ring'], 'kind': kind}

    # --- main triangle
    bl.tube('seat_tube', [BB, seat_top], 0.0185 * tw, F, res=14)
    bl.tube('top_tube', [tt_seat, head_top - V((0.0, 0, 0.028))], 0.0195 * tw, F, radii=[1.0, 1.1], res=14)
    bl.tube('down_tube', [BB + V((0.012, 0, 0.0)), head_bot + V((-0.004, 0, 0.012))], 0.0285 * tw, F, radii=[1.0, 1.15], res=14)
    bl.tube('head_tube', [head_bot, head_top], 0.0265 * (1.1 if big else 1.0), F, res=18)
    bl.torus('accent_head', (head_top.x - 0.0105, 0, head_top.z - 0.030), 0.0247, 0.0016, mats['accent'], axis='Z')
    # --- rear triangle (full-suspension gets a pivot, rocker link and shock)
    for s in (-1, 1):
        bl.tube('chainstay%d' % s, [BB + V((0, s * 0.006, 0.0)), (REAR.x * 0.35, s * 0.045, (BB.z + REAR.z) / 2), (REAR.x, s * 0.062, REAR.z)],
                0.0135 * tw, F, radii=[1.25, 1.0, 0.8], res=10)
    if kind == 'mtb':
        piv = V((-0.100, 0.0, 0.640))
        for s in (-1, 1):
            bl.tube('seatstay%d' % s, [(REAR.x, s * 0.062, REAR.z + 0.008), (-0.30, s * 0.055, 0.50), (piv.x, s * 0.034, piv.z)], 0.0125, F, radii=[0.9, 1.0, 1.1], res=10)
        bl.tube('rocker_bridge', [(piv.x, -0.034, piv.z), (piv.x, 0.034, piv.z)], 0.012, F, res=10)
        mount_a = V((-0.058, 0.0, 0.618))
        mount_b = V((0.168, 0.0, 0.505))
        bl.tube('rocker', [piv, mount_a], 0.014, mats['accent'], res=8)
        d = (mount_b - mount_a)
        n = d.normalized()
        mid = mount_a + d * 0.5
        bl.cyl('shock_body', tuple(mid + n * 0.025), 0.0155, d.length * 0.52, mats['dark'], axis='Z')
        bpy.context.active_object.rotation_euler = (0, math.atan2(n.x, n.z), 0)
        # spring: a helix around the shock axis
        pts = []
        L = d.length * 0.62
        for k in range(120):
            a = k / 119
            ang = a * 2 * math.pi * 9
            c = mount_a + n * (a * L + 0.01)
            side = V((0, 1, 0))
            up = n.cross(side).normalized()
            pts.append(tuple(c + side * 0.030 * math.cos(ang) + up * 0.030 * math.sin(ang)))
        bl.tube('spring', pts, 0.0034, mats['coil'], res=4)
        bl.cyl('pivot_main', (BB.x - 0.045, 0, BB.z + 0.040), 0.016, 0.115, mats['alu'])
    else:
        for s in (-1, 1):
            bl.tube('seatstay%d' % s, [tt_seat + V((0, s * 0.012, -0.012)), (REAR.x * 0.68, s * 0.052, (tt_seat.z + REAR.z) / 2 + 0.03), (REAR.x, s * 0.062, REAR.z + 0.006)],
                    0.0098, F, radii=[1.0, 0.9, 0.8], res=10)
    # --- fork
    if S['fork'] == 'suspension':
        axis = (head_bot + V((0.002, 0, -0.012)) - FRONT)
        crown = head_bot + V((0.002, 0, -0.012))
        u = axis.normalized()
        low_end = FRONT + u * 0.20
        for s in (-1, 1):
            bl.tube('lower%d' % s, [(FRONT.x, s * 0.058, FRONT.z), (low_end.x, s * 0.058, low_end.z)], 0.0200, mats['dark'], radii=[1.0, 1.05], res=14)
            bl.tube('stanchion%d' % s, [(low_end.x, s * 0.058, low_end.z), (crown.x, s * 0.058, crown.z + 0.004)], 0.0165, mats['stanchion'], res=14)
        bl.tube('arch', [(FRONT.x + u.x * 0.15, -0.058, FRONT.z + u.z * 0.15), (FRONT.x + u.x * 0.15, 0.058, FRONT.z + u.z * 0.15)], 0.012, mats['frame'], res=10)
        bl.tube('crown', [(crown.x, -0.066, crown.z), (crown.x, 0.066, crown.z)], 0.0165, mats['dark'], res=12)
    else:
        for s in (-1, 1):
            mid = FRONT + (head_bot - FRONT) * 0.5
            bl.tube('fork%d' % s, [(head_bot.x + 0.002, s * 0.052, head_bot.z - 0.004), (mid.x + 0.028, s * 0.056, mid.z), (FRONT.x - 0.004, s * 0.052, FRONT.z + 0.01), (FRONT.x, s * 0.050, FRONT.z)],
                    0.0130, mats['frame'], radii=[1.3, 1.0, 0.8, 0.7], kind='NURBS', res=10)
        bl.tube('fork_crown', [(head_bot.x + 0.002, -0.054, head_bot.z - 0.006), (head_bot.x + 0.002, 0.054, head_bot.z - 0.006)], 0.0125, mats['frame'], res=10)
    # --- steerer, stem, bars
    ste_top = head_top + V((-0.012, 0, S['stem'][1]))
    bl.tube('steerer', [head_top, ste_top], 0.0145, mats['dark'], res=10)
    clamp = ste_top + V((S['stem'][0], 0, -0.004))
    bl.tube('stem', [ste_top - V((0, 0, 0.004)), clamp], 0.0185, mats['dark'], res=10)
    pts, hand, bmat, brad = _bars(S['bars'], clamp.x, clamp.z, mats)
    half = pts
    left = [(p[0], -p[1], p[2]) for p in half]
    bl.tube('bar', list(reversed(left)) + [(clamp.x, 0.0, clamp.z)] + half, brad, bmat, kind='NURBS', res=10)
    key['hand'] = (hand[0], hand[2])
    key['bar_clamp'] = (clamp.x, clamp.z)
    for s in (-1, 1):
        if S['bars'] == 'drop':
            bl.ellipsoid('hood%d' % s, (clamp.x + 0.066, s * 0.209, clamp.z - 0.050), (0.058, 0.0185, 0.031), mats['dark'], rot=(0, math.radians(24), 0))
        else:
            gx, gy, gz = hand
            bl.cyl('grip%d' % s, (gx, s * abs(gy), gz), 0.0165, 0.125, mats['dark'], axis='Y')
            bl.tube('lever%d' % s, [(gx + 0.015, s * (abs(gy) - 0.05), gz + 0.012), (gx + 0.085, s * (abs(gy) - 0.05), gz - 0.012)], 0.0048, mats['alu'], res=6)
    # --- seatpost, saddle
    post_top = seat_top + V((-0.012, 0, S['post']))
    bl.tube('seatpost', [seat_top, post_top], 0.0125, mats['dark'], res=10)
    sad_len = S['saddle']
    smat = mats['leather'] if kind == 'commute' else mats['saddle']
    bl.ellipsoid('saddle', (post_top.x, 0.0, post_top.z + 0.020), (sad_len, 0.040 if kind != 'commute' else 0.075, 0.026), smat, rot=(0, math.radians(-4), 0))
    bl.ellipsoid('saddle_nose', (post_top.x + sad_len * 0.8, 0.0, post_top.z + 0.026), (0.045, 0.020 if kind != 'commute' else 0.030, 0.015), smat, rot=(0, math.radians(-4), 0))
    key['saddle'] = (post_top.x, post_top.z + 0.046)
    # --- wheels
    _wheel('rear', REAR.x, R, t, 0.135 if big else 0.130, mats, S['spokes'], cassette=S['cogs'], rotor=0.090 if big else 0.080)
    _wheel('front', FRONT.x, R, t, 0.110 if big else 0.100, mats, S['spokes'], rotor=0.090 if big else 0.080)
    # --- drivetrain
    ring_r, cog_r = S['ring'], S['cogs'] * 0.36
    bl.torus('chainring', (BB.x, -0.040, BB.z), ring_r - 0.004, 0.0052, mats['steel'], segs=96, minor_segs=10)
    for k in range(5):
        a = 2 * math.pi * k / 5 + 0.3
        bl.tube('spider%d' % k, [(BB.x, -0.046, BB.z), (BB.x + (ring_r - 0.004) * math.cos(a), -0.042, BB.z + (ring_r - 0.004) * math.sin(a))], 0.0065, mats['dark'], res=6)
    bl.cyl('chainring_hub', (BB.x, -0.048, BB.z), 0.026, 0.008, mats['dark'])
    bl.cyl('bb_cup', (BB.x, 0.0, BB.z), 0.020, 0.095, mats['alu'])
    _chain(BB, REAR, ring_r + 0.003, cog_r + 0.003, mats['steel'])
    cr = S['crank']
    for s, ang in ((-1, pedal_angle), (1, pedal_angle + math.pi)):
        end = (BB.x + cr * math.cos(ang), s * 0.072, BB.z + cr * math.sin(ang))
        bl.tube('crank%d' % s, [(BB.x, s * 0.052, BB.z), (BB.x, s * 0.072, BB.z), end], 0.0125, mats['dark'], radii=[1.2, 1.0, 0.8], res=8)
        bl.box('pedal%d' % s, (end[0], s * 0.100, end[2]), (0.100 if kind != 'kids' else 0.085, 0.060, 0.016), mats['dark'], bevel=0.004)
    key['pedal_far'] = (BB.x + cr * math.cos(pedal_angle + math.pi), BB.z + cr * math.sin(pedal_angle + math.pi))   # +Y side (away from camera)
    key['pedal_near'] = (BB.x + cr * math.cos(pedal_angle), BB.z + cr * math.sin(pedal_angle))
    d0 = V((REAR.x - 0.012, -0.040, REAR.z - 0.040))
    bl.box('rd_body', tuple(d0), (0.034, 0.024, 0.050), mats['dark'], bevel=0.005)
    bl.tube('rd_cage', [(d0.x - 0.004, -0.040, d0.z - 0.020), (d0.x - 0.016, -0.040, d0.z - 0.082)], 0.0045, mats['dark'], res=6)
    for k, z in enumerate((d0.z - 0.026, d0.z - 0.084)):
        bl.cyl('jockey%d' % k, (d0.x - 0.010 - 0.012 * k, -0.040, z), 0.011, 0.006, mats['alu'], verts=24)
    bl.box('qr', (FRONT.x, 0.058, FRONT.z), (0.010, 0.012, 0.026), mats['alu'], bevel=0.002)

    if extras:
        _extras(kind, S, mats, key, BB, REAR, FRONT, seat_top, tt_seat, head_top, head_bot, clamp, post_top)
    return key


def _extras(kind, S, mats, key, BB, REAR, FRONT, seat_top, tt_seat, head_top, head_bot, clamp, post_top):
    R = S['R']
    if kind == 'commute':
        # mudguards
        arc_r = R + 0.014
        rear_pts = [(REAR.x + arc_r * math.cos(math.radians(a)), REAR.z + arc_r * math.sin(math.radians(a))) for a in range(-20, 135, 6)]
        front_pts = [(FRONT.x + arc_r * math.cos(math.radians(a)), FRONT.z + arc_r * math.sin(math.radians(a))) for a in range(-15, 130, 6)]
        _strip('fender_r', rear_pts, -0.032, 0.032, mats['frame'])
        _strip('fender_f', front_pts, -0.030, 0.030, mats['frame'])
        # rear rack: platform, stays, and a pannier on the near side
        top = post_top.z - 0.055
        rack_z = REAR.z + 0.405
        bl.box('rack', (REAR.x + 0.075, 0, rack_z), (0.30, 0.115, 0.012), mats['alu'], bevel=0.003)
        for s in (-1, 1):
            bl.tube('rack_leg%d' % s, [(REAR.x, s * 0.058, REAR.z + 0.01), (REAR.x + 0.055, s * 0.050, rack_z - 0.006), (REAR.x + 0.225, s * 0.050, rack_z - 0.006)], 0.0045, mats['alu'], res=6)
            bl.tube('rack_stay%d' % s, [(REAR.x + 0.10, s * 0.050, rack_z - 0.004), (tt_seat.x - 0.02, s * 0.030, tt_seat.z - 0.05)], 0.0045, mats['alu'], res=6)
        bl.box('pannier', (REAR.x + 0.085, -0.165, rack_z - 0.155), (0.300, 0.115, 0.300), mats['canvas'], bevel=0.02)
        bl.box('pannier_flap', (REAR.x + 0.085, -0.225, rack_z - 0.05), (0.280, 0.010, 0.120), mats['accent'], bevel=0.004)
        bl.box('taillight', (REAR.x - 0.060, 0, rack_z - 0.02), (0.020, 0.040, 0.040), mats['red'], bevel=0.005)
        # front light, bell, kickstand
        bl.cyl('headlight', (head_top.x + 0.075, 0, head_top.z - 0.010), 0.034, 0.060, mats['alu'], axis='Y')
        bl.cyl('headlight_lens', (head_top.x + 0.108, 0, head_top.z - 0.010), 0.026, 0.006, mats['light'], axis='Z')
        bl.cyl('bell', (clamp.x - 0.01, 0.075, clamp.z + 0.025), 0.022, 0.016, mats['alu'], axis='Z')
        bl.tube('kickstand', [(BB.x - 0.14, 0.055, BB.z - 0.01), (BB.x - 0.20, 0.10, 0.0)], 0.005, mats['dark'], res=6)
        key['rack'] = (REAR.x + 0.075, rack_z)
    if kind == 'gravel':
        bl.ellipsoid('frame_bag', (0.115, 0.0, 0.560), (0.225, 0.036, 0.115), mats['bagteal'], rot=(0, math.radians(14), 0))
        bl.cyl('bar_roll', (clamp.x + 0.015, 0.0, clamp.z - 0.020), 0.060, 0.36, mats['bagorange'], axis='Y')
        bl.cyl('saddle_bag', (post_top.x - 0.145, 0.0, post_top.z + 0.015), 0.066, 0.36, mats['bagorange'], axis='Y')
        bpy.context.active_object.rotation_euler = (0, math.radians(90 - 8), 0)
        bl.cyl('bottle', (0.165, 0.0, 0.505), 0.035, 0.205, mats['bagteal'], axis='Y')
        bpy.context.active_object.rotation_euler = (0, math.radians(14), 0)
        key['frame_bag'] = (0.115, 0.560)
        key['seat_pack'] = (post_top.x - 0.145, post_top.z + 0.015)
        key['bar_roll'] = (clamp.x + 0.015, clamp.z - 0.020)
    if kind == 'mtb':
        key['shock'] = (0.055, 0.565)
        key['fork_mid'] = ((FRONT.x + head_bot.x) / 2, (FRONT.z + head_bot.z) / 2)
    if kind == 'kids':
        # training-style bell and a little bag on the bars, small chainguard disc
        bl.cyl('bell', (clamp.x - 0.01, 0.075, clamp.z + 0.025), 0.020, 0.014, mats['accent'], axis='Z')
        key['seat_post_top'] = (post_top.x, post_top.z)
