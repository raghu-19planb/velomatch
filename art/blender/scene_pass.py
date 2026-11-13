"""A golden-hour mountain pass with a loaded bikepacking bike leaning on a boulder (the raw 3D render
that gets painted into an oil painting by painterly.py).

    blender -b -P art/blender/scene_pass.py -- <out.png> [width height samples]
"""
import math
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bikelib as bl  # noqa: E402
import bpy  # noqa: E402
from mathutils import Vector  # noqa: E402

args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
out = args[0] if args else 'pass_raw.png'
W = int(args[1]) if len(args) > 2 else 1600
H = int(args[2]) if len(args) > 2 else 1200
S = int(args[3]) if len(args) > 3 else 96
rng = np.random.default_rng(11)

bl.reset()


# ---------------------------------------------------------------- terrain
def vnoise(nx, ny, grid):
    g = rng.random((grid + 1, grid + 1))
    xs = np.linspace(0, grid, nx, endpoint=False)
    ys = np.linspace(0, grid, ny, endpoint=False)
    ix, iy = xs.astype(int), ys.astype(int)
    tx, ty = xs - ix, ys - iy
    tx, ty = tx * tx * (3 - 2 * tx), ty * ty * (3 - 2 * ty)
    a = g[:, ix] * (1 - tx) + g[:, ix + 1] * tx
    return a[iy, :] * (1 - ty)[:, None] + a[iy + 1, :] * ty[:, None]


def fbm(nx, ny, octaves, base=3, gain=0.5, ridged=False):
    h = np.zeros((ny, nx))
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        n = vnoise(nx, ny, base * 2 ** o)
        if ridged:
            n = 1 - np.abs(2 * n - 1)
        h += amp * n
        tot += amp
        amp *= gain
    return h / tot


NX, NY = 420, 320
X0, X1, Y0, Y1 = -140.0, 140.0, -10.0, 330.0
xs = np.linspace(X0, X1, NX)
ys = np.linspace(Y0, Y1, NY)
gx, gy = np.meshgrid(xs, ys)
smooth = lambda t: np.clip(t, 0, 1) ** 2 * (3 - 2 * np.clip(t, 0, 1))  # noqa: E731

low = fbm(NX, NY, 5, base=4) * 2.2
ridge = fbm(NX, NY, 6, base=3, gain=0.55, ridged=True)
far = smooth((gy - 70) / 150.0)
heights = low * (0.35 + 0.65 * smooth((gy - 10) / 60)) + (ridge ** 1.25) * 125.0 * far + 30 * far * fbm(NX, NY, 3, base=2)
# a flat clearing around the bike
d0 = np.hypot(gx - 0.3, gy - 0.0)
heights = heights * smooth((d0 - 5.0) / 9.0)
# the road: a gravel ribbon that wanders from the right foreground to the far left
road_x = 5.5 - 0.10 * gy + 9.0 * np.sin(gy / 26.0)
dr = np.abs(gx - road_x)
road_mask = 1 - smooth((dr - 1.6) / 1.4)
heights = heights * (1 - 0.96 * road_mask) + 0.0

# vertex colours: grass, dry gold, rock, snow, gravel
d_dy, d_dx = np.gradient(heights, ys, xs)   # axis 0 is y (rows), axis 1 is x (columns)
slope = np.hypot(d_dx, d_dy)
tone = fbm(NX, NY, 4, base=8)
grass = np.array([0.15, 0.30, 0.06])
gold = np.array([0.58, 0.44, 0.10])
rock = np.array([0.27, 0.27, 0.32])
snow = np.array([0.93, 0.93, 0.96])
gravel = np.array([0.55, 0.47, 0.35])
col = grass[None, None, :] * (1 - tone[..., None]) + gold[None, None, :] * tone[..., None]
rock_w = smooth((slope - 0.40) / 0.6) + smooth((heights - 38) / 45) * 0.8
col = col * (1 - np.clip(rock_w, 0, 1)[..., None]) + rock[None, None, :] * np.clip(rock_w, 0, 1)[..., None]
snow_w = smooth((heights - 66 - 12 * fbm(NX, NY, 3, base=6)) / 12) * (0.4 + 0.6 * smooth(1.2 - slope))
col = col * (1 - snow_w[..., None]) + snow[None, None, :] * snow_w[..., None]
col = col * (1 - road_mask[..., None]) + gravel[None, None, :] * road_mask[..., None]

verts = np.dstack([gx, gy, heights]).reshape(-1, 3)
faces = []
for j in range(NY - 1):
    base = j * NX
    for i in range(NX - 1):
        a = base + i
        faces.append((a, a + 1, a + NX + 1, a + NX))
mesh = bpy.data.meshes.new('terrain')
mesh.from_pydata(verts.tolist(), [], faces)
mesh.update()
ca = mesh.color_attributes.new('col', 'FLOAT_COLOR', 'POINT')
rgba = np.dstack([col, np.ones((NY, NX))]).reshape(-1, 4).astype(np.float32)
ca.data.foreach_set('color', rgba.ravel())
terrain = bpy.data.objects.new('terrain', mesh)
bpy.context.scene.collection.objects.link(terrain)
for p in mesh.polygons:
    p.use_smooth = True
tm = bpy.data.materials.new('terrain')
tm.use_nodes = True
nt = tm.node_tree
attr = nt.nodes.new('ShaderNodeAttribute')
attr.attribute_name = 'col'
bsdf = nt.nodes['Principled BSDF']
bsdf.inputs['Roughness'].default_value = 0.92
nt.links.new(attr.outputs['Color'], bsdf.inputs['Base Color'])
mesh.materials.append(tm)

# ---------------------------------------------------------------- trees (low-poly conifers, one mesh)
tv, tf, tc = [], [], []


def height_at(x, y):
    i = int(np.clip((x - X0) / (X1 - X0) * (NX - 1), 0, NX - 1))
    j = int(np.clip((y - Y0) / (Y1 - Y0) * (NY - 1), 0, NY - 1))
    return heights[j, i], slope[j, i], road_mask[j, i]


def add_cone(cx, cy, cz, r, h, color, seg=9):
    base = len(tv)
    for k in range(seg):
        a = 2 * math.pi * k / seg
        tv.append((cx + r * math.cos(a), cy + r * math.sin(a), cz))
        tc.append(color)
    tv.append((cx, cy, cz + h))
    tc.append((color[0] * 1.25, color[1] * 1.25, color[2] * 1.2))
    for k in range(seg):
        tf.append((base + k, base + (k + 1) % seg, base + seg))


placed = 0
tries = 0
while placed < 260 and tries < 20000:
    tries += 1
    x = rng.uniform(-110, 110)
    y = rng.uniform(26, 170)
    z, sl, rd = height_at(x, y)
    if sl > 0.62 or rd > 0.05 or z > 48 or abs(x - (5.5 - 0.1 * y + 9 * math.sin(y / 26.0))) < 3.4:
        continue
    if np.hypot(x - 0.3, y) < 12:
        continue
    th = rng.uniform(3.0, 6.0) * (1.0 + 0.25 * (y / 170.0))
    shade = rng.uniform(0.75, 1.15)
    c = (0.055 * shade, 0.13 * shade, 0.06 * shade)
    for lvl in range(3):
        add_cone(x, y, z + th * (0.12 + 0.28 * lvl), th * (0.30 - 0.07 * lvl), th * 0.52, c)
    placed += 1
tmesh = bpy.data.meshes.new('trees')
tmesh.from_pydata(tv, [], tf)
tmesh.update()
tca = tmesh.color_attributes.new('col', 'FLOAT_COLOR', 'POINT')
tca.data.foreach_set('color', np.array([[c[0], c[1], c[2], 1.0] for c in tc], np.float32).ravel())
trees = bpy.data.objects.new('trees', tmesh)
bpy.context.scene.collection.objects.link(trees)
tmesh.materials.append(tm)

# ---------------------------------------------------------------- boulder, flowers
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=5, radius=1.0, location=(0.15, 0.95, 0.42))
rock_o = bpy.context.active_object
rock_o.name = 'boulder'
rock_o.scale = (0.85, 0.72, 0.62)
rmod = rock_o.modifiers.new('d', 'DISPLACE')
tex = bpy.data.textures.new('rocktex', 'CLOUDS')
tex.noise_scale = 0.55
rmod.texture = tex
rmod.strength = 0.22
bpy.ops.object.shade_smooth()
rm = bl.material('rock', (0.30, 0.28, 0.27), roughness=0.95)
rock_o.data.materials.append(rm)

fv, ff, fc = [], [], []
for _ in range(420):
    x = rng.uniform(-9, 9)
    y = rng.uniform(-6, 12)
    if abs(y) < 1.2 and -1.4 < x < 1.6:
        continue
    z, sl, rd = height_at(x, y)
    if rd > 0.1:
        continue
    r = rng.uniform(0.035, 0.07)
    colr = [(0.95, 0.78, 0.18), (0.96, 0.96, 0.92), (0.88, 0.32, 0.12), (0.85, 0.55, 0.78)][rng.integers(0, 4)]
    base = len(fv)
    for k in range(6):
        a = 2 * math.pi * k / 6
        fv.append((x + r * math.cos(a), y + r * math.sin(a), z + 0.18))
        fc.append(colr)
    fv.append((x, y, z + 0.20))
    fc.append(colr)
    for k in range(6):
        ff.append((base + k, base + (k + 1) % 6, base + 6))
    fv.append((x, y, z))
    fc.append((0.1, 0.25, 0.05))
    fv.append((x + 0.004, y, z))
    fc.append((0.1, 0.25, 0.05))
    fv.append((x, y, z + 0.18))
    fc.append((0.1, 0.25, 0.05))
    b2 = len(fv) - 3
    ff.append((b2, b2 + 1, b2 + 2))
fmesh = bpy.data.meshes.new('flowers')
fmesh.from_pydata(fv, [], ff)
fmesh.update()
fca = fmesh.color_attributes.new('col', 'FLOAT_COLOR', 'POINT')
fca.data.foreach_set('color', np.array([[c[0], c[1], c[2], 1.0] for c in fc], np.float32).ravel())
fl = bpy.data.objects.new('flowers', fmesh)
bpy.context.scene.collection.objects.link(fl)
fmesh.materials.append(tm)

# ---------------------------------------------------------------- the bike, with bags, leaning on the boulder
before = set(bpy.data.objects)
mats = bl.build_bike(frame=(0.012, 0.17, 0.15), accent=(0.89, 0.33, 0.11))
orange = bl.material('bag_orange', (0.80, 0.26, 0.06), roughness=0.7)
canvas_teal = bl.material('bag_teal', (0.02, 0.18, 0.15), roughness=0.75)
bl.ellipsoid('frame_bag', (0.115, 0.0, 0.545), (0.215, 0.034, 0.105), canvas_teal, rot=(0, math.radians(16), 0))
bl.cyl('bar_roll', (0.50, 0.0, 0.945), 0.058, 0.36, orange)
bl.cyl('saddle_bag', (-0.30, 0.0, 0.84), 0.062, 0.34, orange, axis='Y')
bag = bpy.context.active_object
bag.rotation_euler = (0, math.radians(90), math.radians(-6))
bl.ellipsoid('bottle', (0.18, 0.0, 0.50), (0.035, 0.035, 0.10), canvas_teal)
bike_objs = [o for o in bpy.data.objects if o not in before]
pivot = bpy.data.objects.new('bike_pivot', None)
bpy.context.scene.collection.objects.link(pivot)
for o in bike_objs:
    o.parent = pivot
pivot.rotation_euler = (math.radians(-13), 0, math.radians(-6))
pivot.location = (0, 0, 0)

# ---------------------------------------------------------------- sky, sun, camera, render
w = bpy.data.worlds.new('sky')
w.use_nodes = True
nt = w.node_tree
sky = nt.nodes.new('ShaderNodeTexSky')
for t in ('MULTIPLE_SCATTERING', 'SINGLE_SCATTERING', 'NISHITA'):
    try:
        sky.sky_type = t
        break
    except TypeError:
        continue
sky.sun_elevation = math.radians(6.5)
sky.sun_rotation = math.radians(150)
sky.sun_size = math.radians(1.6)
sky.sun_intensity = 1.7
sky.air_density = 1.15
sky.aerosol_density = 1.8
# clouds: stretched noise on the sky dome, fading out toward the horizon, tinted by the low sun
tc_ = nt.nodes.new('ShaderNodeTexCoord')
mp_ = nt.nodes.new('ShaderNodeMapping')
mp_.inputs['Scale'].default_value = (1.0, 1.0, 3.2)
nz_ = nt.nodes.new('ShaderNodeTexNoise')
nz_.inputs['Scale'].default_value = 2.2
nz_.inputs['Detail'].default_value = 9.0
nz_.inputs['Roughness'].default_value = 0.62
cr_ = nt.nodes.new('ShaderNodeValToRGB')
cr_.color_ramp.elements[0].position = 0.50
cr_.color_ramp.elements[1].position = 0.74
hz_ = nt.nodes.new('ShaderNodeSeparateXYZ')
hm_ = nt.nodes.new('ShaderNodeMath')
hm_.operation = 'MULTIPLY'
hr_ = nt.nodes.new('ShaderNodeMapRange')
hr_.inputs['From Min'].default_value = 0.04
hr_.inputs['From Max'].default_value = 0.30
mixc_ = nt.nodes.new('ShaderNodeMix')
mixc_.data_type = 'RGBA'
nt.links.new(tc_.outputs['Generated'], mp_.inputs['Vector'])
nt.links.new(mp_.outputs['Vector'], nz_.inputs['Vector'])
nt.links.new(nz_.outputs['Fac'], cr_.inputs['Fac'])
nt.links.new(tc_.outputs['Generated'], hz_.inputs['Vector'])
nt.links.new(hz_.outputs['Z'], hr_.inputs['Value'])
nt.links.new(cr_.outputs['Color'], hm_.inputs[0])
nt.links.new(hr_.outputs['Result'], hm_.inputs[1])
rgba_in = [i for i in mixc_.inputs if i.type == 'RGBA']
rgba_in[1].default_value = (1.0, 0.50, 0.24, 1.0)   # warm, sun-lit cloud
nt.links.new(sky.outputs['Color'], rgba_in[0])
nt.links.new(hm_.outputs['Value'], mixc_.inputs[0])
nt.links.new([o for o in mixc_.outputs if o.type == 'RGBA'][0], nt.nodes['Background'].inputs['Color'])
nt.nodes['Background'].inputs['Strength'].default_value = 0.22
bpy.context.scene.world = w

bl.cycles(W, H, S, transparent=False)
sc = bpy.context.scene
try:
    sc.view_settings.view_transform = 'AgX'
except TypeError:
    sc.view_settings.view_transform = 'Standard'
sc.view_settings.exposure = -0.2
bl.camera((-1.9, -3.6, 0.95), (4.6, 24.0, 3.9), lens=30)
sc.render.filepath = out
bpy.ops.render.render(write_still=True)
print('WROTE', out)
