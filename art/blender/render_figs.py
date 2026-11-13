"""Studio product shots of the five bikes, for the Fig. 001 diagram on each category page.

    blender -b -P art/blender/render_figs.py -- <kind> <out.png> [width height samples]
      kind: kids | commute | road | mtb | gravel

Writes <out.png> (transparent background, soft contact shadow) and <out.png>.json with the key points
of the bike in the page diagram's 640 x 410 coordinates, so the dimension lines can be laid over the
photo exactly. The camera is orthographic and square-on to the drive side, like a catalogue spec shot.
"""
import json
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bikelib as bl  # noqa: E402
import bikes  # noqa: E402
import bpy  # noqa: E402
from mathutils import Vector  # noqa: E402

args = sys.argv[sys.argv.index('--') + 1:]
kind, out = args[0], args[1]
W = int(args[2]) if len(args) > 3 else 1600
H = int(args[3]) if len(args) > 3 else 1025
S = int(args[4]) if len(args) > 4 else 96

COLOURS = {
    'kids': dict(frame=(0.80, 0.30, 0.06), accent=(0.95, 0.80, 0.20)),
    'commute': dict(frame=(0.05, 0.22, 0.20), accent=(0.89, 0.33, 0.11)),
    'road': dict(frame=(0.60, 0.04, 0.03), accent=(0.95, 0.95, 0.92)),
    'mtb': dict(frame=(0.02, 0.13, 0.09), accent=(0.95, 0.55, 0.06)),
    'gravel': dict(frame=(0.10, 0.30, 0.22), accent=(0.89, 0.33, 0.11)),
}

bl.reset()
key = bikes.build(kind, pedal_angle=-0.35, load='panniers' if kind == 'gravel' else None, **COLOURS[kind])
bl.studio_ground()

# studio world: a bright overhead sky fading to a darker floor, so polished metal has something to reflect
w = bpy.data.worlds.new('studio')
w.use_nodes = True
nt = w.node_tree
tc = nt.nodes.new('ShaderNodeTexCoord')
sep = nt.nodes.new('ShaderNodeSeparateXYZ')
ramp = nt.nodes.new('ShaderNodeValToRGB')
ramp.color_ramp.elements[0].position = 0.35
ramp.color_ramp.elements[0].color = (0.03, 0.03, 0.035, 1)
ramp.color_ramp.elements[1].position = 0.9
ramp.color_ramp.elements[1].color = (1.0, 1.0, 1.0, 1)
nt.links.new(tc.outputs['Generated'], sep.inputs['Vector'])
nt.links.new(sep.outputs['Z'], ramp.inputs['Fac'])
nt.links.new(ramp.outputs['Color'], nt.nodes['Background'].inputs['Color'])
nt.nodes['Background'].inputs['Strength'].default_value = 0.16
bpy.context.scene.world = w

bl.cycles(W, H, S, transparent=True)
sc = bpy.context.scene
sc.view_settings.view_transform = 'Standard'
sc.view_settings.exposure = 0.0

# ---- framing: bike spans 14% .. 88% of the width, the ground sits at 83% of the height
R = key['R']
left = key['rear'][0] - R
right = key['front'][0] + R
span = right - left
scale = span / 0.74
xc = left + (0.5 - 0.1375) * scale
H_m = scale * 410.0 / 640.0
PHI = math.radians(11)                       # the camera looks slightly down so the floor shows the bike's shadow
zc = 0.33 * H_m / math.cos(PHI)
cam = bpy.data.cameras.new('cam')
cam.type = 'ORTHO'
cam.ortho_scale = scale
cam.clip_end = 50
co = bpy.data.objects.new('cam', cam)
bpy.context.scene.collection.objects.link(co)
fwd = Vector((0, math.cos(PHI), -math.sin(PHI)))
co.location = Vector((xc, 0, zc)) - fwd * 8.0
co.rotation_euler = (math.radians(90) - PHI, 0, 0)
sc.camera = co

bl.area_light('key', (xc - 1.2, -3.0, 2.6), (xc, 0, 0.5), (2.4, 2.4), 260)
bl.area_light('fill', (xc + 1.6, -3.0, 1.0), (xc, 0, 0.5), (3.0, 3.0), 45)
bl.area_light('rim', (xc, 2.8, 2.4), (xc, 0, 0.5), (3.5, 1.5), 170, (1.0, 0.93, 0.85))
bl.area_light('top', (xc, 0.0, 3.4), (xc, 0, 0.5), (3.0, 2.0), 130)

bpy.context.scene.render.filepath = out
bpy.ops.render.render(write_still=True)


def px(p):
    """side-view (x, z) in metres -> the page diagram's 640 x 410 coordinates"""
    return [round(((p[0] - xc) / scale + 0.5) * 640, 1), round((0.5 + (zc - p[1]) * math.cos(PHI) / H_m) * 410, 1)]


pts = {k: px(v) for k, v in key.items() if isinstance(v, tuple) and len(v) == 2}
meta = {'kind': kind, 'points': pts, 'wheel_r_px': round(R / scale * 640, 1), 'ground_y': px((0, 0))[1],
        'top_y': px((0, 2 * R))[1], 'm_to_px': round(640 / scale, 2)}
with open(out + '.json', 'w') as f:
    json.dump(meta, f, indent=1)
print('WROTE', out)
