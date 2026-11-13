"""A person on a bike, modelled as a smooth body rather than a stack of primitives.

    import figure
    figure.build(key, height_cm=125, jersey=(...), shorts=(...), ...)

The body is a Skin-modifier mesh: a skeleton of joints with a thickness at each, which Blender wraps in
one continuous, subdivided surface, so shoulders flow into arms, hips into thighs and the neck into the
head, instead of ellipsoids poking out of each other. Clothes are second skins over the same skeleton
(a jersey with short sleeves, shorts to above the knee). The head is modelled with a face: brow, nose,
lips, chin, ears, eyes and hair, under a helmet with vents. The pose comes from two-bone IK onto the bike's
key points (saddle, pedals, bars), as in rider.py. Units are metres; the rider faces +X.
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bikelib as bl  # noqa: E402
import bmesh  # noqa: E402
import bpy  # noqa: E402
from mathutils import Vector  # noqa: E402

V = Vector


def ik(a, b, l1, l2, pole):
    d = b - a
    dist = max(1e-4, min(d.length, l1 + l2 - 1e-4))
    u = d.normalized()
    x = (l1 * l1 - l2 * l2 + dist * dist) / (2 * dist)
    h = math.sqrt(max(l1 * l1 - x * x, 0.0))
    p = pole - a
    p = p - u * p.dot(u)
    p = p.normalized() if p.length > 1e-6 else V((0, 0, 1))
    return a + u * x + p * h


def skin(name, pts, edges, radii, mat, root=0, levels=2):
    """One smooth surface through a skeleton: pts [(x,y,z)], edges [(i,j)], radii [r] (circular sections)."""
    bm = bmesh.new()
    layer = bm.verts.layers.skin.verify()                      # before the verts: adding a layer invalidates existing ones
    vs = [bm.verts.new(p) for p in pts]
    for i, j in edges:
        bm.edges.new((vs[i], vs[j]))
    for v, r in zip(vs, radii):
        v[layer].radius = (r, r)
    vs[root][layer].use_root = True
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    m = ob.modifiers.new('skin', 'SKIN')
    m.use_smooth_shade = True
    s = ob.modifiers.new('sub', 'SUBSURF')
    s.levels = levels
    s.render_levels = levels
    ob.data.materials.append(mat)
    return ob


def blob(name, loc, radii, mat, rot=(0, 0, 0), parent=None):
    bpy.ops.mesh.primitive_uv_sphere_add(location=loc, radius=1, segments=40, ring_count=24)
    o = bpy.context.active_object
    o.name = name
    o.scale = radii
    o.rotation_euler = rot
    o.data.materials.append(mat)
    bl.smooth(o)
    if parent is not None:
        o.parent = parent
    return o


def lerp(a, b, t):
    return a + (b - a) * t


def build(key, height_cm=125, jersey=(0.9, 0.4, 0.1), shorts=(0.16, 0.20, 0.30), helmet_col=(0.95, 0.95, 0.92), skin_col=(0.62, 0.43, 0.32),
          hair_col=(0.07, 0.045, 0.03), shoe_col=(0.95, 0.95, 0.95), sole_col=(0.9, 0.35, 0.1), lean_deg=52, name='p_', child=None):
    before = set(bpy.data.objects)
    m = bl.material
    s = height_cm / 178.0
    th = s ** 0.72                                     # limb thickness: children are chunkier for their height
    child = (height_cm < 150) if child is None else child
    hs = 1.0 + 0.50 * (1 - s) if child else 1.0
    M = {
        'skin': m(name + 'skin', skin_col, roughness=0.55),
        'jersey': m(name + 'jersey', jersey, roughness=0.8),
        'shorts': m(name + 'shorts', shorts, roughness=0.85),
        'helmet': m(name + 'helmet', helmet_col, roughness=0.3, coat=0.6),
        'vent': m(name + 'vent', (0.04, 0.04, 0.05), roughness=0.6),
        'hair': m(name + 'hair', hair_col, roughness=0.8),
        'eye': m(name + 'eye', (0.02, 0.015, 0.012), roughness=0.2),
        'lip': m(name + 'lip', tuple(min(1, c * 0.85 + 0.06) for c in (skin_col[0] * 1.2, skin_col[1] * 0.65, skin_col[2] * 0.7)), roughness=0.5),
        'shoe': m(name + 'shoe', shoe_col, roughness=0.55),
        'sole': m(name + 'sole', sole_col, roughness=0.7),
        'glove': m(name + 'glove', skin_col, roughness=0.55),
    }

    # ---- body dimensions
    thigh, shin = 0.43 * s, 0.44 * s
    torso_len, uarm, farm = 0.50 * s, 0.30 * s, 0.27 * s
    hip_w, sh_w = 0.090 * s, 0.170 * s

    saddle = V((key['saddle'][0], 0.0, key['saddle'][1]))
    hip = saddle + V((0.0, 0, 0.100 * s + 0.020))
    lean = math.radians(lean_deg)
    up = V((math.cos(lean), 0, math.sin(lean)))
    sh_mid = hip + up * torso_len
    waist = hip + up * (torso_len * 0.42)
    chest = hip + up * (torso_len * 0.78)
    neck_base = sh_mid + V((0.012 * s, 0, -0.012 * s))
    # the head sits in front of and above the neck base, looking ahead
    neck_dir = V((math.cos(lean * 0.32 + 0.55), 0, math.sin(lean * 0.32 + 0.55)))
    head_c = neck_base + neck_dir * (0.150 * s * (0.8 + 0.2 * hs)) + V((0.014 * s, 0, 0))
    neck_top = head_c - neck_dir * (0.085 * s * hs)
    hand_xz = key['hand']
    ped_near = V((key['pedal_near'][0], -0.100, key['pedal_near'][1]))
    ped_far = V((key['pedal_far'][0], 0.100, key['pedal_far'][1]))

    pts, edges, rad = [], [], []

    def add(p, r, link=None):
        pts.append(tuple(p))
        rad.append(r)
        i = len(pts) - 1
        if link is not None:
            edges.append((link, i))
        return i

    pelvis = add(hip, 0.108 * th)
    legs, arms = {}, {}
    for side in (-1, 1):
        hj = hip + V((0, side * hip_w, -0.012))
        ankle = (ped_near if side == -1 else ped_far) + V((-0.045 * s, 0, 0.095 * s))
        ankle.y = side * 0.100
        knee = ik(hj, ankle, thigh, shin, hj + V((1.0, side * 0.10, 0.25)))
        legs[side] = (hj, knee, ankle)
        h_i = add(hj, 0.092 * th, pelvis)
        k_i = add(knee, 0.056 * th, h_i)
        a_i = add(ankle, 0.038 * th, k_i)
        add(ankle + V((0.085 * s, 0, -0.035 * s)), 0.032 * th, a_i)
    w_i = add(waist, 0.104 * th, pelvis)
    c_i = add(chest, 0.122 * th, w_i)
    n_i = add(neck_base, 0.060 * th, c_i)
    t_i = add(neck_top, 0.048 * th * hs, n_i)
    for side in (-1, 1):
        shj = sh_mid + V((-0.006 * s, side * sh_w, -0.030 * s))
        hand = V((hand_xz[0], side * key.get('hand_y', 0.21), hand_xz[1]))
        elbow = ik(shj, hand, uarm, farm, shj + V((-0.15, side * 0.60, -0.12)))
        arms[side] = (shj, elbow, hand)
        sh_i = add(shj, 0.060 * th, c_i)
        e_i = add(elbow, 0.042 * th, sh_i)
        wr = hand - (hand - elbow).normalized() * 0.03 * s
        wr_i = add(wr, 0.031 * th, e_i)
        add(hand + (hand - elbow).normalized() * 0.040 * s, 0.036 * th, wr_i)
    body = skin(name + 'skeleton', pts, edges, rad, M['skin'], root=pelvis, levels=3)
    body.hide_render = True
    # the evaluated, smooth body becomes one mesh; every vertex gets a colour (skin, jersey or shorts) by where it sits
    import numpy as np
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(body.evaluated_get(dg), depsgraph=dg)
    nv = len(me.vertices)
    co = np.empty(nv * 3, np.float32)
    me.vertices.foreach_get('co', co)
    co = co.reshape(-1, 3)
    nrm = np.empty(nv * 3, np.float32)
    me.vertices.foreach_get('normal', nrm)
    nrm = nrm.reshape(-1, 3)
    segs = []   # (a, b, ra, rb, zone)

    def seg(a_, b_, ra, rb, zone):
        segs.append((np.array(a_, np.float32), np.array(b_, np.float32), ra, rb, zone))
    seg(hip, waist, 0.108 * th, 0.104 * th, 'trunk')
    seg(waist, chest, 0.104 * th, 0.122 * th, 'trunk')
    seg(chest, neck_base, 0.122 * th, 0.060 * th, 'collar')
    seg(neck_base, neck_top, 0.060 * th, 0.048 * th * hs, 'neck')
    for side in (-1, 1):
        hj, knee, ankle = legs[side]
        seg(hip, hj, 0.108 * th, 0.092 * th, 'hip')
        seg(hj, knee, 0.092 * th, 0.056 * th, 'thigh')
        seg(knee, ankle, 0.056 * th, 0.038 * th, 'shin')
        seg(ankle, ankle + V((0.085 * s, 0, -0.035 * s)), 0.038 * th, 0.032 * th, 'foot')
        shj, elbow, hand = arms[side]
        seg(chest, shj, 0.122 * th, 0.060 * th, 'shoulder')
        seg(shj, elbow, 0.060 * th, 0.042 * th, 'uarm')
        seg(elbow, hand, 0.042 * th, 0.034 * th, 'farm')
    best = np.full(nv, 1e9, np.float32)
    zone = np.empty(nv, dtype=object)
    tpar = np.zeros(nv, np.float32)
    for a_, b_, ra, rb, zn in segs:
        ab = b_ - a_
        t = np.clip(((co - a_) @ ab) / max(1e-9, float(ab @ ab)), 0, 1)
        d = np.linalg.norm(co - (a_ + t[:, None] * ab), axis=1) - (ra + (rb - ra) * t)
        better = d < best
        best = np.where(better, d, best)
        zone = np.where(better, zn, zone)
        tpar = np.where(better, t, tpar)
    upv = np.array(up, np.float32)
    u = (co - np.array(hip, np.float32)) @ upv
    body_z = np.isin(zone, ['trunk', 'shoulder', 'collar'])
    # the hem is a plane across the torso (so it is a clean line), the sleeves and shorts legs end at fixed points along the limb
    is_j = (body_z & (u > -0.030 * s)) | ((zone == 'uarm') & (tpar < 0.60))
    is_s = (zone == 'hip') | ((zone == 'trunk') & (u <= -0.030 * s)) | ((zone == 'thigh') & (tpar < 0.70))
    cols = np.empty((nv, 4), np.float32)
    cols[:] = (*skin_col, 1.0)
    cols[is_j] = (*jersey, 1.0)
    cols[is_s] = (*shorts, 1.0)
    puff = np.where(is_j | is_s, 0.012 * th, 0.0).astype(np.float32)          # clothes stand off the skin a little
    co2 = co + nrm * puff[:, None]
    me.vertices.foreach_set('co', co2.ravel())
    ca = me.color_attributes.new('col', 'FLOAT_COLOR', 'POINT')
    ca.data.foreach_set('color', cols.ravel())
    for p in me.polygons:
        p.use_smooth = True
    me.update()
    person = bpy.data.objects.new(name + 'body', me)
    bpy.context.scene.collection.objects.link(person)
    vm = bpy.data.materials.new(name + 'vcol')
    vm.use_nodes = True
    attr = vm.node_tree.nodes.new('ShaderNodeAttribute')
    attr.attribute_name = 'col'
    bsdf = vm.node_tree.nodes['Principled BSDF']
    bsdf.inputs['Roughness'].default_value = 0.62
    vm.node_tree.links.new(attr.outputs['Color'], bsdf.inputs['Base Color'])
    person.data.materials.clear()
    person.data.materials.append(vm)

    # ---- feet: trainers
    for side in (-1, 1):
        hj, knee, ankle = legs[side]
        blob(name + 'shoe%d' % side, ankle + V((0.06 * s, 0, -0.050 * s)), (0.105 * s, 0.040 * s, 0.040 * s), M['shoe'], rot=(0, math.radians(8), 0))
        blob(name + 'sole%d' % side, ankle + V((0.06 * s, 0, -0.082 * s)), (0.112 * s, 0.043 * s, 0.014 * s), M['sole'], rot=(0, math.radians(8), 0))
        blob(name + 'sock%d' % side, ankle + V((-0.006 * s, 0, 0.012 * s)), (0.044 * s, 0.040 * s, 0.050 * s), M['shoe'])
    # ---- hands: closed around the grips
    for side in (-1, 1):
        shj, elbow, hand = arms[side]
        blob(name + 'hand%d' % side, hand + V((0.012 * s, 0, -0.004 * s)), (0.046 * s, 0.036 * s, 0.040 * s), M['glove'])

    # ---- head: a face under a helmet
    hp = bpy.data.objects.new(name + 'head', None)
    bpy.context.scene.collection.objects.link(hp)
    hp.location = head_c
    hp.rotation_euler = (0, math.radians(14), 0)
    k = s * hs * 1.0

    def part(nm, loc, rr, mat, rot=(0, 0, 0)):
        return blob(name + nm, (loc[0] * k, loc[1] * k, loc[2] * k), (rr[0] * k, rr[1] * k, rr[2] * k), mat, rot=rot, parent=hp)
    part('cranium', (0.000, 0, 0.008), (0.098, 0.080, 0.100), M['skin'])
    part('jaw', (0.030, 0, -0.052), (0.066, 0.058, 0.064), M['skin'])
    part('brow', (0.082, 0, 0.032), (0.022, 0.058, 0.012), M['skin'])
    part('nose', (0.100, 0, -0.010), (0.030, 0.015, 0.034), M['skin'], rot=(0, math.radians(-14), 0))
    part('nosetip', (0.122, 0, -0.028), (0.014, 0.014, 0.012), M['skin'])
    part('chin', (0.066, 0, -0.094), (0.026, 0.030, 0.022), M['skin'])
    part('lips', (0.086, 0, -0.060), (0.016, 0.026, 0.008), M['lip'])
    for sd in (-1, 1):
        part('eye%d' % sd, (0.086, sd * 0.033, 0.014), (0.010, 0.010, 0.012), M['eye'])
        part('brow%d' % sd, (0.090, sd * 0.034, 0.034), (0.010, 0.024, 0.005), M['hair'])
        part('ear%d' % sd, (-0.008, sd * 0.085, -0.010), (0.018, 0.009, 0.030), M['skin'])
    part('hair', (-0.030, 0, 0.040), (0.096, 0.086, 0.085), M['hair'])
    part('helmet', (-0.010, 0, 0.058), (0.112, 0.094, 0.078), M['helmet'], rot=(0, math.radians(-6), 0))
    for i, y in enumerate((-0.040, 0.0, 0.040)):
        part('vent%d' % i, (0.002, y, 0.118), (0.060, 0.010, 0.010), M['vent'])
    return [o for o in bpy.data.objects if o not in before]
