"""Procedural road/gravel bike for Blender (bpy), plus studio helpers.

Everything is built from tubes, tori and a few primitives, with real proportions (700c wheels,
~985 mm wheelbase, 73 degree angles), so renders read as a believable bike without any
downloaded model. Units are metres. The bike points along +X, Z is up, and the drive side
(chainring, cassette) is on -Y, which is the side the studio camera looks at.

    import bikelib
    bikelib.reset()
    bikelib.build_bike(frame=(0.02, 0.22, 0.19))
    bikelib.studio(...)
"""
import math
import bpy
from mathutils import Vector

# ------------------------------------------------------------------ scene helpers

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def material(name, color, metallic=0.0, roughness=0.5, coat=0.0, coat_rough=0.03, specular=0.5):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (color[0], color[1], color[2], 1)
    b.inputs['Metallic'].default_value = metallic
    b.inputs['Roughness'].default_value = roughness
    if 'Coat Weight' in b.inputs:
        b.inputs['Coat Weight'].default_value = coat
        b.inputs['Coat Roughness'].default_value = coat_rough
    if 'Specular IOR Level' in b.inputs:
        b.inputs['Specular IOR Level'].default_value = specular
    return m


def _link(obj):
    bpy.context.scene.collection.objects.link(obj)
    return obj


def tube(name, pts, radius, mat, radii=None, kind='POLY', res=10):
    """A round tube through points. `radii` tapers it (multipliers of `radius`)."""
    cu = bpy.data.curves.new(name, 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth = radius
    cu.bevel_resolution = res
    cu.use_fill_caps = True
    sp = cu.splines.new(kind)
    sp.points.add(len(pts) - 1)
    for i, p in enumerate(pts):
        sp.points[i].co = (p[0], p[1], p[2], 1)
        sp.points[i].radius = radii[i] if radii else 1.0
    if kind == 'NURBS':
        sp.order_u = 4
        sp.use_endpoint_u = True
    obj = bpy.data.objects.new(name, cu)
    obj.data.materials.append(mat)
    return _link(obj)


def smooth(obj):
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.shade_smooth()
    obj.select_set(False)
    return obj


def torus(name, loc, major, minor, mat, axis='Y', segs=128, minor_segs=24):
    rot = (math.pi / 2, 0, 0) if axis == 'Y' else (0, 0, 0)
    bpy.ops.mesh.primitive_torus_add(location=loc, rotation=rot, major_radius=major, minor_radius=minor,
                                     major_segments=segs, minor_segments=minor_segs)
    o = bpy.context.active_object
    o.name = name
    o.data.materials.append(mat)
    return smooth(o)


def cyl(name, loc, radius, depth, mat, axis='Y', verts=48):
    rot = (math.pi / 2, 0, 0) if axis == 'Y' else (0, 0, 0)
    bpy.ops.mesh.primitive_cylinder_add(location=loc, rotation=rot, radius=radius, depth=depth, vertices=verts)
    o = bpy.context.active_object
    o.name = name
    o.data.materials.append(mat)
    return smooth(o)


def ellipsoid(name, loc, scale, mat, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_uv_sphere_add(location=loc, radius=1, segments=48, ring_count=24)
    o = bpy.context.active_object
    o.name = name
    o.scale = scale
    o.rotation_euler = rot
    o.data.materials.append(mat)
    return smooth(o)


def box(name, loc, size, mat, rot=(0, 0, 0), bevel=0.003):
    bpy.ops.mesh.primitive_cube_add(location=loc, rotation=rot)
    o = bpy.context.active_object
    o.name = name
    o.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
    o.data.materials.append(mat)
    bpy.ops.object.transform_apply(scale=True)
    if bevel:
        m = o.modifiers.new('bevel', 'BEVEL')
        m.width = bevel
        m.segments = 3
    return smooth(o)


# ------------------------------------------------------------------ the bike

WHEEL_R = 0.340          # outside radius of a 700x28 tyre
RIM_R = 0.3045
AXLE_Z = WHEEL_R
BB = Vector((0.0, 0.0, 0.270))
REAR_AXLE = Vector((-0.410, 0.0, AXLE_Z))
FRONT_AXLE = Vector((0.575, 0.0, AXLE_Z))


def _wheel(prefix, centre, mats, hub_w, disc_side=-1, cassette=False, spokes=28):
    cx, _, cz = centre
    torus(prefix + '_tyre', (cx, 0, cz), WHEEL_R - 0.0155, 0.0155, mats['tyre'])
    torus(prefix + '_rim', (cx, 0, cz), RIM_R + 0.004, 0.0075, mats['rim'])
    cyl(prefix + '_hub', (cx, 0, cz), 0.014, hub_w * 0.55, mats['alu'])
    for side in (-1, 1):
        cyl(prefix + '_flange%d' % side, (cx, side * hub_w * 0.42, cz), 0.026, 0.004, mats['alu'])
    # spokes: tangentially laced, alternating flanges
    n = spokes
    for i in range(n):
        side = -1 if i % 2 == 0 else 1
        th = 2 * math.pi * i / n
        rim_th = th + side * 0.86 + (0.0 if i % 4 < 2 else 0.0)
        hx, hz = cx + 0.026 * math.cos(th), cz + 0.026 * math.sin(th)
        rx, rz = cx + (RIM_R - 0.004) * math.cos(rim_th), cz + (RIM_R - 0.004) * math.sin(rim_th)
        tube('%s_spoke%d' % (prefix, i), [(hx, side * hub_w * 0.42, hz), (rx, side * 0.0045, rz)], 0.00075, mats['alu'], res=3)
    # brake rotor on the non-drive side
    cyl(prefix + '_rotor', (cx, hub_w * 0.5 + 0.004, cz), 0.080, 0.0018, mats['steel'])
    cyl(prefix + '_rotor_hub', (cx, hub_w * 0.5 + 0.004, cz), 0.026, 0.004, mats['dark'])
    if cassette:
        y0 = -hub_w * 0.5 - 0.006
        for k, r in enumerate([0.052, 0.047, 0.043, 0.039, 0.035, 0.032, 0.029, 0.026, 0.023, 0.021, 0.019]):
            cyl('cog%d' % k, (cx, y0 - k * 0.0034, cz), r, 0.0024, mats['steel'], verts=40)


def _chain(mats, ring_r, cog_r):
    c1 = Vector((BB.x, BB.z))
    c2 = Vector((REAR_AXLE.x, REAR_AXLE.z))
    d = (c2 - c1).length
    u = (c2 - c1) / d
    perp = Vector((-u.y, u.x))
    th = math.acos((ring_r - cog_r) / d)
    y = -0.040
    pts = []

    def pt(c, r, n):
        return (c.x + r * n.x, y, c.y + r * n.y)

    n_up = u * math.cos(th) + perp * math.sin(th)
    n_dn = u * math.cos(th) - perp * math.sin(th)
    a_up = math.atan2(n_up.y, n_up.x)
    a_dn = math.atan2(n_dn.y, n_dn.x)
    # around the chainring, front side, from upper tangent point down to lower tangent point
    steps = 26
    start, end = a_up, a_dn
    if end > start:
        end -= 2 * math.pi
    for i in range(steps + 1):
        a = start + (end - start) * i / steps
        pts.append((c1.x + ring_r * math.cos(a), y, c1.y + ring_r * math.sin(a)))
    # around the rear cog, rear side, from lower tangent point up to upper tangent point
    start, end = a_dn, a_up
    if end < start:
        end += 2 * math.pi
    # go the long way round the back of the cog (through angle pi)
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
    o.data.materials.append(mats['steel'])
    _link(o)


def build_bike(frame=(0.012, 0.19, 0.16), accent=(0.89, 0.33, 0.11), pedal_angle=-0.35):
    mats = {
        'frame': material('frame', frame, metallic=0.55, roughness=0.28, coat=1.0, coat_rough=0.015),
        'accent': material('accent', accent, roughness=0.35, coat=0.6),
        'tyre': material('tyre', (0.012, 0.012, 0.013), roughness=0.78),
        'rim': material('rim', (0.02, 0.02, 0.022), metallic=0.6, roughness=0.28),
        'alu': material('alu', (0.78, 0.79, 0.80), metallic=1.0, roughness=0.22),
        'steel': material('steel', (0.55, 0.56, 0.58), metallic=1.0, roughness=0.3),
        'dark': material('dark', (0.018, 0.018, 0.02), roughness=0.5),
        'tape': material('tape', (0.025, 0.025, 0.028), roughness=0.85),
        'saddle': material('saddle', (0.03, 0.03, 0.032), roughness=0.55),
    }
    # --- key frame points
    seat_top = Vector((-0.158, 0.0, 0.786))
    seat_tube_for_top = Vector((-0.150, 0.0, 0.742))
    head_top = Vector((0.385, 0.0, 0.832))
    head_bot = Vector((0.426, 0.0, 0.698))
    # --- frame tubes
    F = mats['frame']
    tube('seat_tube', [BB, seat_top], 0.0185, F, res=14)
    tube('top_tube', [seat_tube_for_top, head_top - Vector((0.0, 0, 0.026))], 0.0195, F, radii=[1.0, 1.1], res=14)
    tube('down_tube', [BB + Vector((0.012, 0, 0.0)), head_bot + Vector((-0.004, 0, 0.012))], 0.0275, F, radii=[1.0, 1.15], res=14)
    tube('head_tube', [head_bot, head_top], 0.0265, F, res=18)
    for s in (-1, 1):
        tube('chainstay%d' % s, [BB + Vector((0, s * 0.006, 0)), (-0.15, s * 0.045, 0.285), (REAR_AXLE.x, s * 0.062, REAR_AXLE.z)],
             0.0135, F, radii=[1.25, 1.0, 0.75], res=10)
        tube('seatstay%d' % s, [seat_tube_for_top + Vector((0, s * 0.012, -0.012)), (-0.28, s * 0.052, 0.52), (REAR_AXLE.x, s * 0.062, REAR_AXLE.z + 0.006)],
             0.0098, F, radii=[1.0, 0.9, 0.8], res=10)
        # fork leg, slightly curved forward at the dropout
        tube('fork%d' % s, [(head_bot.x + 0.002, s * 0.052, head_bot.z - 0.004), (0.490, s * 0.056, 0.52), (FRONT_AXLE.x - 0.004, s * 0.052, FRONT_AXLE.z + 0.01), (FRONT_AXLE.x, s * 0.050, FRONT_AXLE.z)],
             0.0130, F, radii=[1.3, 1.0, 0.8, 0.7], kind='NURBS', res=10)
    tube('fork_crown', [(head_bot.x + 0.002, -0.054, head_bot.z - 0.006), (head_bot.x + 0.002, 0.054, head_bot.z - 0.006)], 0.0125, F, res=10)
    # accent stripe near the head tube and seat tube cluster
    torus('accent_head', (head_top.x - 0.0105, 0, head_top.z - 0.030), 0.0247, 0.0016, mats['accent'], axis='Z')
    # --- steerer, stem, bars
    tube('steerer', [head_top, (0.372, 0.0, 0.884)], 0.0145, mats['dark'], res=10)
    tube('stem', [(0.372, 0, 0.880), (0.462, 0, 0.890)], 0.0185, mats['dark'], res=10)
    half = [(0.462, -0.026, 0.890), (0.462, -0.100, 0.890), (0.462, -0.198, 0.888), (0.488, -0.211, 0.882), (0.548, -0.215, 0.858),
            (0.588, -0.212, 0.822), (0.589, -0.207, 0.772), (0.552, -0.205, 0.734), (0.500, -0.205, 0.728), (0.472, -0.205, 0.733)]
    left = [(p[0], -p[1], p[2]) for p in half]
    bar = list(reversed(left)) + [(0.462, 0.0, 0.890)] + half
    tube('bar', bar, 0.0115, mats['tape'], kind='NURBS', res=10)
    for s in (-1, 1):
        ellipsoid('hood%d' % s, (0.548, s * 0.209, 0.846), (0.058, 0.0185, 0.031), mats['dark'], rot=(0, math.radians(24), 0))
    # --- seatpost, saddle
    tube('seatpost', [seat_top, (-0.166, 0.0, 0.842)], 0.0125, mats['dark'], res=10)
    ellipsoid('saddle', (-0.158, 0.0, 0.862), (0.130, 0.040, 0.026), mats['saddle'], rot=(0, math.radians(-4), 0))
    ellipsoid('saddle_nose', (-0.040, 0.0, 0.868), (0.045, 0.020, 0.015), mats['saddle'], rot=(0, math.radians(-4), 0))
    # --- wheels
    _wheel('rear', REAR_AXLE, mats, 0.130, disc_side=1, cassette=True)
    _wheel('front', FRONT_AXLE, mats, 0.100, disc_side=1, cassette=False)
    # --- drivetrain
    ring_r, cog_r = 0.096, 0.026
    torus('chainring', (BB.x, -0.040, BB.z), ring_r - 0.004, 0.0052, mats['steel'], segs=96, minor_segs=10)
    for k in range(5):
        a = 2 * math.pi * k / 5 + 0.3
        tube('spider%d' % k, [(BB.x, -0.046, BB.z), (BB.x + (ring_r - 0.004) * math.cos(a), -0.042, BB.z + (ring_r - 0.004) * math.sin(a))], 0.0065, mats['dark'], res=6)
    cyl('chainring_hub', (BB.x, -0.048, BB.z), 0.026, 0.008, mats['dark'])
    cyl('bb_cup', (BB.x, 0.0, BB.z), 0.020, 0.095, mats['alu'])
    _chain(mats, ring_r + 0.003, cog_r + 0.003)
    for s, ang in ((-1, pedal_angle), (1, pedal_angle + math.pi)):
        end = (BB.x + 0.172 * math.cos(ang), s * 0.072, BB.z + 0.172 * math.sin(ang))
        tube('crank%d' % s, [(BB.x, s * 0.052, BB.z), (BB.x, s * 0.072, BB.z), end], 0.0125, mats['dark'], radii=[1.2, 1.0, 0.8], res=8)
        box('pedal%d' % s, (end[0], s * 0.100, end[2]), (0.100, 0.060, 0.016), mats['dark'], bevel=0.004)
    # rear derailleur: body, cage, two jockey wheels
    d0 = Vector((REAR_AXLE.x - 0.012, -0.040, REAR_AXLE.z - 0.040))
    box('rd_body', tuple(d0), (0.034, 0.024, 0.050), mats['dark'], bevel=0.005)
    tube('rd_cage', [(d0.x - 0.004, -0.040, d0.z - 0.020), (d0.x - 0.016, -0.040, d0.z - 0.082)], 0.0045, mats['dark'], res=6)
    for k, z in enumerate((d0.z - 0.026, d0.z - 0.084)):
        cyl('jockey%d' % k, (d0.x - 0.010 - 0.012 * k, -0.040, z), 0.011, 0.006, mats['alu'], verts=24)
    box('front_hub_lever', (FRONT_AXLE.x, 0.058, FRONT_AXLE.z), (0.010, 0.012, 0.026), mats['alu'], bevel=0.002)
    return mats


# ------------------------------------------------------------------ studio

def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()


def camera(loc, target, lens=80):
    cam = bpy.data.cameras.new('cam')
    cam.lens = lens
    o = bpy.data.objects.new('cam', cam)
    _link(o)
    o.location = loc
    look_at(o, target)
    bpy.context.scene.camera = o
    return o


def area_light(name, loc, target, size, energy, color=(1, 1, 1)):
    ld = bpy.data.lights.new(name, 'AREA')
    ld.shape = 'RECTANGLE'
    ld.size = size[0]
    ld.size_y = size[1]
    ld.energy = energy
    ld.color = color
    o = bpy.data.objects.new(name, ld)
    _link(o)
    o.location = loc
    look_at(o, target)
    return o


def world(color=(0.8, 0.82, 0.85), strength=0.6):
    w = bpy.data.worlds.new('world')
    w.use_nodes = True
    bg = w.node_tree.nodes['Background']
    bg.inputs['Color'].default_value = (color[0], color[1], color[2], 1)
    bg.inputs['Strength'].default_value = strength
    bpy.context.scene.world = w


def cycles(width, height, samples=96, transparent=True):
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    sc.cycles.samples = samples
    sc.cycles.use_denoising = True
    sc.render.resolution_x = width
    sc.render.resolution_y = height
    sc.render.resolution_percentage = 100
    sc.render.film_transparent = transparent
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGBA' if transparent else 'RGB'
    try:
        sc.view_settings.view_transform = 'Khronos PBR Neutral'
    except TypeError:
        sc.view_settings.view_transform = 'Standard'


def studio_ground():
    bpy.ops.mesh.primitive_plane_add(size=30, location=(0, 0, 0))
    g = bpy.context.active_object
    g.name = 'ground'
    g.is_shadow_catcher = True
    return g
