"""A procedural cyclist, seated on a bike built by bikes.py.

    import rider
    key = bikes.build('road', ...)
    rider.build(key, style='road', jersey=(0.9, 0.2, 0.1), pose='aero')

The body is built from tapered limbs and ellipsoids, then posed with two-bone inverse kinematics so the
feet land on the pedals, the hands on the bars and the hips on the saddle for whatever bike geometry
it is given. Seen at painting distance it reads as a person in a jersey, helmet and glasses, which is
all a painting needs. Units are metres; the rider faces +X (same as the bike); the drive side is -Y.
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bikelib as bl  # noqa: E402
import bpy  # noqa: E402
from mathutils import Vector  # noqa: E402

V = Vector


def ik(a, b, l1, l2, pole):
    """Two-bone IK: the joint between a limb of lengths l1, l2 reaching from a toward b, bending toward `pole`."""
    d = b - a
    dist = max(1e-4, min(d.length, l1 + l2 - 1e-4))
    u = d.normalized()
    x = (l1 * l1 - l2 * l2 + dist * dist) / (2 * dist)
    h = math.sqrt(max(l1 * l1 - x * x, 0.0))
    p = pole - a
    p = (p - u * p.dot(u))
    p = p.normalized() if p.length > 1e-6 else V((0, 0, 1))
    return a + u * x + p * h


def _blob(name, p0, p1, rx, ry, mat, taper=1.0):
    """An ellipsoid stretched from p0 to p1 (rx lateral, ry front-back radii)."""
    p0, p1 = V(p0), V(p1)
    mid = (p0 + p1) / 2
    L = (p1 - p0).length
    bpy.ops.mesh.primitive_uv_sphere_add(location=mid, radius=1, segments=40, ring_count=20)
    o = bpy.context.active_object
    o.name = name
    o.scale = (rx, ry, L / 2)
    o.rotation_euler = (p1 - p0).to_track_quat('Z', 'Y').to_euler()
    o.data.materials.append(mat)
    return bl.smooth(o)


def _limb(name, p0, p1, r0, r1, mat):
    return bl.tube(name, [tuple(p0), tuple(p1)], 1.0, mat, radii=[r0, r1], res=12)


def _ball(name, p, r, mat):
    return bl.ellipsoid(name, tuple(p), (r, r, r), mat)


STYLES = {
    # racing: tight lycra, aero helmet, thin glasses, shoes with a stiff sole
    'road': dict(helmet='aero', baggy=False, glasses=True, torso_lean=math.radians(38), grip='hoods', leg_w=1.0),
    # mountain: loose shorts, half-shell helmet and goggles, upright attack position
    'mtb': dict(helmet='shell', baggy=True, glasses=True, torso_lean=math.radians(58), grip='bars', leg_w=1.25),
}


def build(key, style='road', jersey=(0.9, 0.2, 0.1), shorts=(0.02, 0.02, 0.025), helmet_col=(0.95, 0.95, 0.95), skin=(0.52, 0.34, 0.24),
          pose='seated', lean_deg=None, scale=1.0, sock=(0.95, 0.95, 0.95), shoe=(0.9, 0.9, 0.9), name=''):
    """Seat a rider on the bike described by `key` (from bikes.build). Returns the list of new objects."""
    st = STYLES[style]
    before = set(bpy.data.objects)
    m = bl.material
    M = {
        'jersey': m(name + 'jersey', jersey, roughness=0.75),
        'jersey2': m(name + 'jersey2', tuple(min(1, c * 0.45 + 0.04) for c in jersey), roughness=0.75),
        'shorts': m(name + 'shorts', shorts, roughness=0.8),
        'skin': m(name + 'skin', skin, roughness=0.55),
        'helmet': m(name + 'helmet', helmet_col, roughness=0.35, coat=0.5),
        'glass': m(name + 'glass', (0.02, 0.02, 0.025), roughness=0.12, metallic=0.3),
        'sock': m(name + 'sock', sock, roughness=0.9),
        'shoe': m(name + 'shoe', shoe, roughness=0.5),
        'hair': m(name + 'hair', (0.05, 0.035, 0.025), roughness=0.9),
    }
    k = key
    sx = scale
    # --- body dimensions (metres), for a ~1.78 m rider
    thigh, shin = 0.43 * sx, 0.44 * sx
    torso_len, uarm, farm = 0.50 * sx, 0.30 * sx, 0.27 * sx
    hip_w, sh_w = 0.095 * sx, 0.185 * sx

    # --- anchor points on the bike
    saddle = V((k['saddle'][0], 0.0, k['saddle'][1]))
    standing = pose == 'standing'
    hip = saddle + V((0.005, 0, 0.085)) if not standing else saddle + V((-0.17, 0, 0.19))
    lean = math.radians(lean_deg) if lean_deg is not None else st['torso_lean']
    if standing:
        lean = math.radians(lean_deg if lean_deg is not None else 40)
    sh_mid = hip + V((math.cos(lean), 0, math.sin(lean))) * torso_len
    hand_xz = k['hand']
    pedal_near = V((k['pedal_near'][0], -0.100, k['pedal_near'][1]))
    pedal_far = V((k['pedal_far'][0], 0.100, k['pedal_far'][1]))

    # --- torso: pelvis and chest
    pelvis_c = hip + V((0.01, 0, 0.0))
    _blob(name + 'pelvis', hip + V((0, 0, -0.07)), hip + V((0.02, 0, 0.10)), hip_w * 1.9, 0.11 * sx, M['shorts'])
    chest_a = hip + (sh_mid - hip) * 0.30
    chest_b = hip + (sh_mid - hip) * 1.0 + V((0.0, 0, 0.0))
    _blob(name + 'torso', chest_a, chest_b, 0.150 * sx, 0.108 * sx, M['jersey'])
    _blob(name + 'back', hip + V((0, 0, 0.0)), hip + (sh_mid - hip) * 0.55, 0.138 * sx, 0.100 * sx, M['jersey2'])   # darker lower back panel
    neck_base = sh_mid + V((0.02, 0, 0.0))
    head_dir = V((math.cos(lean * 0.35 + 0.30), 0, math.sin(lean * 0.35 + 0.30)))
    head_c = neck_base + head_dir * 0.20 * sx
    _limb(name + 'neck', neck_base - V((0.01, 0, 0.02)), head_c - head_dir * 0.07, 0.048 * sx, 0.044 * sx, M['skin'])
    # --- head, helmet, glasses
    _blob(name + 'head', head_c - V((0.0, 0, 0.0)), head_c + V((0.02, 0, 0.012)), 0.075 * sx, 0.093 * sx, M['skin'])
    if st['helmet'] == 'aero':
        _blob(name + 'helmet', head_c + V((-0.07, 0, 0.012)), head_c + V((0.07, 0, 0.060)), 0.088 * sx, 0.098 * sx, M['helmet'])
        _blob(name + 'helmet_tail', head_c + V((-0.16, 0, 0.0)), head_c + V((-0.03, 0, 0.03)), 0.050 * sx, 0.065 * sx, M['helmet'])
    else:
        _blob(name + 'helmet', head_c + V((-0.03, 0, 0.012)), head_c + V((0.07, 0, 0.078)), 0.088 * sx, 0.10 * sx, M['helmet'])
        _blob(name + 'visor', head_c + V((0.055, 0, 0.060)), head_c + V((0.135, 0, 0.045)), 0.050 * sx, 0.075 * sx, M['helmet'])
    if st['glasses']:
        _blob(name + 'glasses', head_c + V((0.045, -0.0, 0.020)), head_c + V((0.090, 0, 0.018)), 0.078 * sx, 0.020 * sx, M['glass'])

    # --- legs: hip joints to pedals, knees bend forward (toward +x)
    ankle_off = V((-0.050, 0, 0.100)) * sx                                  # foot sits above the pedal axle
    for side, ped in ((-1, pedal_near), (1, pedal_far)):
        hj = hip + V((0.0, side * hip_w, -0.02))
        ankle = ped + ankle_off + V((0, side * 0.0, 0))
        ankle.y = side * 0.100
        knee = ik(hj, ankle, thigh, shin, hj + V((1.0, side * 0.12, 0.2)))
        L = M['shorts']
        r_th = 0.092 * sx * st['leg_w']
        _limb('%sthigh%d' % (name, side), hj, knee, r_th, r_th * 0.72, L)
        _ball('%sknee%d' % (name, side), knee, r_th * 0.72, M['skin'] if not st['baggy'] else L)
        _limb('%scalf%d' % (name, side), knee, ankle, 0.062 * sx, 0.042 * sx, M['skin'])
        _limb('%ssock%d' % (name, side), ankle + (knee - ankle).normalized() * 0.11, ankle, 0.046 * sx, 0.040 * sx, M['sock'])
        # shoe
        _blob('%sshoe%d' % (name, side), ankle + V((-0.045, 0, -0.045)), ankle + V((0.17, 0, -0.075)), 0.040 * sx, 0.052 * sx, M['shoe'])
        if st['baggy']:                                                      # loose shorts reaching to just above the knee
            _blob('%sbag%d' % (name, side), hj + V((0, 0, -0.02)), hj + (knee - hj) * 0.82, 0.118 * sx, 0.125 * sx, M['shorts'])

    # --- arms: shoulders to hands (hands hold the bars on both sides)
    for side in (-1, 1):
        shj = sh_mid + V((0.0, side * sh_w, -0.02))
        hand = V((hand_xz[0], side * (0.205 if st['grip'] == 'hoods' else 0.34), hand_xz[1]))
        if st['grip'] == 'hoods':
            hand = hand + V((0.0, 0, 0.0))
        elbow = ik(shj, hand, uarm, farm, shj + V((-0.10, side * 0.55, -0.05 if not standing else 0.18)))
        sleeve = M['jersey']
        _ball('%sshoulder%d' % (name, side), shj, 0.062 * sx, sleeve)
        _limb('%suarm%d' % (name, side), shj, elbow, 0.058 * sx, 0.048 * sx, sleeve)
        _limb('%sfarm%d' % (name, side), elbow, hand, 0.044 * sx, 0.032 * sx, M['skin'])
        _blob('%shand%d' % (name, side), hand + V((-0.03, 0, 0.0)), hand + V((0.05, 0, -0.02)), 0.034 * sx, 0.045 * sx, M['glass'])   # gloves

    return [o for o in bpy.data.objects if o not in before]
