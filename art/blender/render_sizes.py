"""A rider on a bike that fits them, at eight heights from a small child to a tall adult.

    blender -b -P art/blender/render_sizes.py -- <out-dir> [width samples] [only-height]

These are the pictures behind the home page's "Drag to any height" diagram: as the slider moves, the
page shows the one for the nearest height. All eight share one camera (orthographic, same scale, same
ground line), so the child really is smaller than the adult and the bike grows with them: wheel from 14"
up to 700c, frame, saddle height from the rider's inseam, crank length, a bigger head on the small riders.
Writes size_<height>.png and size_<height>.png.json (the numbers the page shows).
"""
import json
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bikelib as bl  # noqa: E402
import bikes  # noqa: E402
import bpy  # noqa: E402
import rider  # noqa: E402
from mathutils import Vector  # noqa: E402

args = sys.argv[sys.argv.index('--') + 1:]
OUT = args[0]
W = int(args[1]) if len(args) > 1 else 1280
S = int(args[2]) if len(args) > 2 else 64
ONLY = int(args[3]) if len(args) > 3 else None
H = int(W * 500 / 640)

# height cm, base bike, frame scale, tyre radius (m), wheel label, jersey, frame colour, helmet
LADDER = [
    (100, 'kids', 0.70, 0.178, '14in', (0.96, 0.78, 0.10), (0.15, 0.50, 0.55), (0.15, 0.50, 0.55)),
    (112, 'kids', 0.80, 0.203, '16in', (0.12, 0.55, 0.60), (0.89, 0.33, 0.11), (0.89, 0.33, 0.11)),
    (125, 'kids', 1.00, 0.254, '20in', (0.93, 0.34, 0.07), (0.10, 0.40, 0.62), (0.95, 0.95, 0.92)),
    (140, 'kids', 1.20, 0.305, '24in', (0.15, 0.40, 0.75), (0.80, 0.30, 0.06), (0.15, 0.40, 0.75)),
    (152, 'kids', 1.32, 0.335, '26in', (0.88, 0.35, 0.55), (0.10, 0.10, 0.12), (0.95, 0.95, 0.92)),
    (165, 'gravel', 0.93, 0.352, '700c', (0.12, 0.50, 0.30), (0.78, 0.07, 0.08), (0.12, 0.50, 0.30)),
    (178, 'gravel', 1.00, 0.352, '700c', (0.06, 0.28, 0.27), (0.89, 0.33, 0.11), (0.95, 0.95, 0.92)),
    (192, 'gravel', 1.07, 0.352, '700c', (0.50, 0.52, 0.58), (0.05, 0.25, 0.55), (0.10, 0.10, 0.12)),
]

W_M = 2.6                                   # width of the frame in metres, the same for every size
H_M = W_M * 500 / 640
PHI = math.radians(11)
XC = 0.10
ZC = (0.88 - 0.5) * H_M / math.cos(PHI)


def one(h, kind, geo, R, wheel_lbl, jersey, frame, helmet):
    bl.reset()
    s = h / 178.0
    saddle_z = (0.292 * geo if kind == 'gravel' else bikes.SPECS['kids']['bb'] * geo) + 0.4027 * h / 100.0   # bottom bracket + 0.885 x inseam
    crank = max(0.100, min(0.175, 0.175 * (h / 178.0) ** 0.7))
    key = bikes.build(kind, frame=frame, accent=(0.95, 0.9, 0.82), pedal_angle=0.55, geo=geo, R=R, saddle_z=saddle_z, crank=crank, extras=(kind != 'gravel'))
    rider.build(key, style='mtb', jersey=jersey, shorts=(0.10, 0.12, 0.18), helmet_col=helmet, skin=(0.50, 0.33, 0.23), pose='seated',
                lean_deg=44, scale=s, head_scale=1.0 + 0.55 * (1 - s), name='kid_')
    bl.studio_ground()
    w = bpy.data.worlds.new('studio')
    w.use_nodes = True
    nt = w.node_tree
    tc, sep, ramp = nt.nodes.new('ShaderNodeTexCoord'), nt.nodes.new('ShaderNodeSeparateXYZ'), nt.nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.elements[0].position = 0.35
    ramp.color_ramp.elements[0].color = (0.03, 0.03, 0.035, 1)
    ramp.color_ramp.elements[1].position = 0.9
    ramp.color_ramp.elements[1].color = (1, 1, 1, 1)
    nt.links.new(tc.outputs['Generated'], sep.inputs['Vector'])
    nt.links.new(sep.outputs['Z'], ramp.inputs['Fac'])
    nt.links.new(ramp.outputs['Color'], nt.nodes['Background'].inputs['Color'])
    nt.nodes['Background'].inputs['Strength'].default_value = 0.16
    bpy.context.scene.world = w
    bl.cycles(W, H, S, transparent=True)
    sc = bpy.context.scene
    sc.view_settings.view_transform = 'Standard'
    sc.view_settings.exposure = 0.0
    cam = bpy.data.cameras.new('cam')
    cam.type = 'ORTHO'
    cam.ortho_scale = W_M
    cam.clip_end = 50
    co = bpy.data.objects.new('cam', cam)
    sc.collection.objects.link(co)
    fwd = Vector((0, math.cos(PHI), -math.sin(PHI)))
    co.location = Vector((XC, 0, ZC)) - fwd * 8.0
    co.rotation_euler = (math.radians(90) - PHI, 0, 0)
    sc.camera = co
    bl.area_light('key', (XC - 1.2, -3.0, 2.6), (XC, 0, 0.5), (2.4, 2.4), 260)
    bl.area_light('fill', (XC + 1.6, -3.0, 1.0), (XC, 0, 0.5), (3.0, 3.0), 45)
    bl.area_light('rim', (XC, 2.8, 2.4), (XC, 0, 0.5), (3.5, 1.5), 170, (1.0, 0.93, 0.85))
    bl.area_light('top', (XC, 0.0, 3.4), (XC, 0, 0.5), (3.0, 2.0), 130)
    path = os.path.join(OUT, 'size_%d.png' % h)
    sc.render.filepath = path
    bpy.ops.render.render(write_still=True)

    def px(p):
        return [round(((p[0] - XC) / W_M + 0.5) * 640, 1), round((0.5 + (ZC - p[1]) * math.cos(PHI) / H_M) * 500, 1)]
    tt_mid = (key['tt_seat'][1] + key['head_top'][1] - 0.028) / 2
    meta = {'height_cm': h, 'wheel': wheel_lbl, 'standover_cm': round(tt_mid * 100), 'wheelbase_cm': round((key['front'][0] - key['rear'][0]) * 100),
            'points': {'rear': px(key['rear']), 'front': px(key['front'])}, 'wheel_r_px': round(key['R'] / W_M * 640, 1), 'ground_y': px((0, 0))[1],
            'px_per_m': round(640 / W_M, 2), 'saddle_cm': round(saddle_z * 100)}
    json.dump(meta, open(path + '.json', 'w'), indent=1)
    print('WROTE', path)


for row in LADDER:
    if ONLY and row[0] != ONLY:
        continue
    one(*row)
