"""Reusable landscape toolkit for the intro paintings (terrain, foliage, flowers, sky, the bike).

Everything is generated: no downloaded assets. Colours get atmospheric haze baked in by distance
from the camera, so far hills fade toward the sky the way they do in a painting.
"""
import math
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bikelib as bl  # noqa: E402
import bpy  # noqa: E402


def smooth(t):
    t = np.clip(t, 0, 1)
    return t * t * (3 - 2 * t)


# ------------------------------------------------------------------ noise
def vnoise(rng, nx, ny, grid):
    g = rng.random((grid + 1, grid + 1))
    xs = np.linspace(0, grid, nx, endpoint=False)
    ys = np.linspace(0, grid, ny, endpoint=False)
    ix, iy = xs.astype(int), ys.astype(int)
    tx, ty = smooth(xs - ix), smooth(ys - iy)
    a = g[:, ix] * (1 - tx) + g[:, ix + 1] * tx
    return a[iy, :] * (1 - ty)[:, None] + a[iy + 1, :] * ty[:, None]


def fbm(rng, nx, ny, octaves, base=3, gain=0.5, ridged=False):
    h = np.zeros((ny, nx))
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        n = vnoise(rng, nx, ny, base * 2 ** o)
        if ridged:
            n = 1 - np.abs(2 * n - 1)
        h += amp * n
        tot += amp
        amp *= gain
    return h / tot


# ------------------------------------------------------------------ haze
def haze_mix(col, dist, haze, scale=430.0, strength=0.80):
    f = (1 - np.exp(-np.asarray(dist) / scale)) * strength
    f = np.asarray(f)[..., None] if np.ndim(f) else f
    return np.asarray(col) * (1 - f) + np.asarray(haze) * f


# ------------------------------------------------------------------ terrain
class Terrain:
    def __init__(self, rng, cam, haze, extent=(-150, 150, -12, 340), n=(440, 330), mountains=125.0,
                 mountain_start=70.0, clearing=(0.3, 0.0, 5.0, 9.0), road=None, road_w=1.6, snow=66.0,
                 palette=None, flat_foreground=True, relief=2.2, stripe=False, road_end=90.0):
        self.rng, self.cam, self.haze = rng, np.array(cam), np.array(haze)
        X0, X1, Y0, Y1 = extent
        NX, NY = n
        self.NX, self.NY, self.X0, self.X1, self.Y0, self.Y1 = NX, NY, X0, X1, Y0, Y1
        xs = np.linspace(X0, X1, NX)
        ys = np.linspace(Y0, Y1, NY)
        gx, gy = np.meshgrid(xs, ys)
        # domain warp makes ridgelines look eroded instead of regular
        wx = gx + 22 * (fbm(rng, NX, NY, 3, base=3) - 0.5)
        low = fbm(rng, NX, NY, 5, base=4) * relief
        ridge = fbm(rng, NX, NY, 7, base=3, gain=0.56, ridged=True)
        far = smooth((gy - mountain_start) / 150.0)
        h = low * (0.35 + 0.65 * smooth((gy - 10) / 60)) + (ridge ** 1.3) * mountains * far \
            + 0.22 * mountains * far * fbm(rng, NX, NY, 3, base=2)
        cx, cy, r0, r1 = clearing
        h = h * smooth((np.hypot(gx - cx, gy - cy) - r0) / r1)
        self.road_mask = np.zeros_like(h)
        if road is not None:
            dr = np.abs(wx - road(gy)) if False else np.abs(gx - road(gy))
            self.road_mask = (1 - smooth((dr - road_w) / (road_w * 0.9))) * (1 - smooth((gy - road_end) / 25.0))   # the road fades out before the mountains, it does not cut a trench through them
            h = h * (1 - 0.96 * self.road_mask)
        self.h, self.xs, self.ys, self.gx, self.gy = h, xs, ys, gx, gy
        d_dy, d_dx = np.gradient(h, ys, xs)
        self.slope = np.hypot(d_dx, d_dy)
        pal = dict(grass=(0.14, 0.30, 0.06), gold=(0.56, 0.44, 0.10), rock=(0.27, 0.27, 0.32), snow=(0.93, 0.93, 0.96),
                   gravel=(0.55, 0.47, 0.35))
        if palette:
            pal.update(palette)
        tone = fbm(rng, NX, NY, 4, base=8)
        patch = fbm(rng, NX, NY, 3, base=20)
        col = np.array(pal['grass'])[None, None, :] * (1 - tone[..., None]) + np.array(pal['gold'])[None, None, :] * tone[..., None]
        col = col * (0.88 + 0.24 * patch[..., None])
        rock_w = np.clip(smooth((self.slope - 0.40) / 0.6) + smooth((h - 38) / 45) * 0.8, 0, 1)
        col = col * (1 - rock_w[..., None]) + np.array(pal['rock'])[None, None, :] * rock_w[..., None]
        snow_w = smooth((h - snow - 12 * fbm(rng, NX, NY, 3, base=6)) / 12) * (0.4 + 0.6 * smooth(1.2 - self.slope))
        col = col * (1 - snow_w[..., None]) + np.array(pal['snow'])[None, None, :] * snow_w[..., None]
        col = col * (1 - self.road_mask[..., None]) + np.array(pal['gravel'])[None, None, :] * self.road_mask[..., None]
        if stripe and road is not None:
            st = (np.abs(gx - road(gy)) < 0.13) & ((gy % 7.0) < 3.6) & (self.road_mask > 0.5)
            col[st] = (0.86, 0.76, 0.22)
            edge = (np.abs(np.abs(gx - road(gy)) - road_w * 0.88) < 0.09) & (self.road_mask > 0.3)
            col[edge] = (0.82, 0.82, 0.80)
        dist = np.sqrt((gx - cam[0]) ** 2 + (gy - cam[1]) ** 2 + (h - cam[2]) ** 2)
        self.col = haze_mix(col, dist, self.haze)
        self._mesh()

    def _mesh(self):
        NX, NY = self.NX, self.NY
        verts = np.dstack([self.gx, self.gy, self.h]).reshape(-1, 3)
        idx = np.arange(NX * NY).reshape(NY, NX)
        a, b, c, d = idx[:-1, :-1].ravel(), idx[:-1, 1:].ravel(), idx[1:, 1:].ravel(), idx[1:, :-1].ravel()
        faces = np.stack([a, b, c, d], axis=1)
        mesh = bpy.data.meshes.new('terrain')
        mesh.from_pydata(verts.tolist(), [], faces.tolist())
        mesh.update()
        ca = mesh.color_attributes.new('col', 'FLOAT_COLOR', 'POINT')
        rgba = np.dstack([self.col, np.ones((NY, NX))]).reshape(-1, 4).astype(np.float32)
        ca.data.foreach_set('color', rgba.ravel())
        for p in mesh.polygons:
            p.use_smooth = True
        o = bpy.data.objects.new('terrain', mesh)
        bpy.context.scene.collection.objects.link(o)
        self.material = _vcol_material('terrain', 0.92)
        mesh.materials.append(self.material)
        self.obj = o

    def at(self, x, y):
        i = int(np.clip((x - self.X0) / (self.X1 - self.X0) * (self.NX - 1), 0, self.NX - 1))
        j = int(np.clip((y - self.Y0) / (self.Y1 - self.Y0) * (self.NY - 1), 0, self.NY - 1))
        return self.h[j, i], self.slope[j, i], self.road_mask[j, i]


def _vcol_material(name, rough):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    attr = nt.nodes.new('ShaderNodeAttribute')
    attr.attribute_name = 'col'
    b = nt.nodes['Principled BSDF']
    b.inputs['Roughness'].default_value = rough
    nt.links.new(attr.outputs['Color'], b.inputs['Base Color'])
    return m


def _mesh_object(name, verts, faces, colors, material, smooth=False):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    ca = mesh.color_attributes.new('col', 'FLOAT_COLOR', 'POINT')
    ca.data.foreach_set('color', np.array([[c[0], c[1], c[2], 1.0] for c in colors], np.float32).ravel())
    for p in mesh.polygons:
        p.use_smooth = smooth
    o = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(o)
    mesh.materials.append(material)
    return o


# ------------------------------------------------------------------ foliage
class Foliage:
    """Trees as many small shapes with jittered size and colour, merged into one mesh."""

    def __init__(self, terrain):
        self.T = terrain
        self.v, self.f, self.c = [], [], []

    def _shade(self, base, var, dist):
        k = self.T.rng.uniform(1 - var, 1 + var)
        col = np.array(base) * k
        col = col * np.array([self.T.rng.uniform(0.92, 1.08), self.T.rng.uniform(0.94, 1.06), self.T.rng.uniform(0.9, 1.1)])
        return haze_mix(col, dist, self.T.haze)

    def conifer(self, x, y, z, h, base=(0.03, 0.10, 0.04)):
        """Drooping, ragged boughs: each tier is a fringe hanging from a raised inner ring to an apex."""
        rng = self.T.rng
        cam = self.T.cam
        dist = math.sqrt((x - cam[0]) ** 2 + (y - cam[1]) ** 2 + (z - cam[2]) ** 2)
        lean = rng.uniform(-0.05, 0.05)
        tiers = 10
        seg = 22
        phase = rng.uniform(0, 6.28)
        for lvl in range(tiers):
            t = lvl / (tiers - 1)
            cz = z + h * (0.07 + 0.78 * t)
            r = h * (0.28 * (1 - 0.84 * t) + 0.022) * rng.uniform(0.82, 1.18)
            hh = h * 0.17
            col = self._shade(base, 0.24, dist)
            b0 = len(self.v)
            lobes = rng.uniform(2.0, 4.0)
            for k in range(seg):
                a_ = 2 * math.pi * k / seg
                rr = r * (1 + 0.30 * rng.uniform(-1, 1)) * (1 + 0.22 * math.sin(a_ * lobes + phase + lvl))
                droop = hh * rng.uniform(0.9, 2.1)
                self.v.append((x + rr * math.cos(a_) + lean * (cz - z), y + rr * math.sin(a_), cz - droop))          # hanging tips
                self.c.append(col * rng.uniform(0.70, 0.95))
            for k in range(seg):
                a_ = 2 * math.pi * k / seg
                self.v.append((x + 0.42 * r * math.cos(a_) + lean * (cz - z), y + 0.42 * r * math.sin(a_), cz + hh * 0.2))   # raised inner ring
                self.c.append(np.clip(col * rng.uniform(1.0, 1.25), 0, 1))
            apex = len(self.v)
            self.v.append((x + lean * (cz + hh - z), y, cz + hh * 1.5))
            self.c.append(np.clip(col * 1.4, 0, 1))
            for k in range(seg):
                k2 = (k + 1) % seg
                self.f.append((b0 + k, b0 + k2, b0 + seg + k2, b0 + seg + k))
                self.f.append((b0 + seg + k, b0 + seg + k2, apex))
        # trunk
        b0 = len(self.v)
        tc = haze_mix(np.array((0.10, 0.07, 0.05)), dist, self.T.haze)
        for k in range(6):
            a_ = 2 * math.pi * k / 6
            self.v.append((x + 0.13 * math.cos(a_), y + 0.13 * math.sin(a_), z))
            self.c.append(tc)
        self.v.append((x, y, z + h * 0.3))
        self.c.append(tc)
        for k in range(6):
            self.f.append((b0 + k, b0 + (k + 1) % 6, b0 + 6))

    def broadleaf(self, x, y, z, h, base=(0.10, 0.28, 0.05)):
        rng = self.T.rng
        cam = self.T.cam
        dist = math.sqrt((x - cam[0]) ** 2 + (y - cam[1]) ** 2 + (z - cam[2]) ** 2)
        tc = haze_mix(np.array((0.16, 0.11, 0.07)), dist, self.T.haze)
        # trunk
        b = len(self.v)
        for k in range(6):
            a = 2 * math.pi * k / 6
            self.v.append((x + 0.18 * math.cos(a), y + 0.18 * math.sin(a), z))
            self.c.append(tc)
        self.v.append((x, y, z + h * 0.62))
        self.c.append(tc)
        for k in range(6):
            self.f.append((b + k, b + (k + 1) % 6, b + 6))
        # canopy: a cluster of lumpy blobs
        for _ in range(rng.integers(11, 18)):
            cx = x + rng.uniform(-0.34, 0.34) * h
            cy = y + rng.uniform(-0.34, 0.34) * h
            cz = z + h * rng.uniform(0.60, 0.98)
            r = h * rng.uniform(0.10, 0.19)
            col = self._shade(base, 0.30, dist) * np.array([rng.uniform(0.9, 1.15), rng.uniform(0.92, 1.08), rng.uniform(0.7, 1.0)])
            rings, seg = 7, 14
            b = len(self.v)
            for i in range(1, rings):
                phi = math.pi * i / rings
                for k in range(seg):
                    th = 2 * math.pi * k / seg
                    rr = r * (1 + 0.32 * rng.uniform(-1, 1))
                    self.v.append((cx + rr * math.sin(phi) * math.cos(th), cy + rr * math.sin(phi) * math.sin(th), cz + rr * math.cos(phi) * 0.78))
                    shade = 0.78 + 0.34 * (math.cos(phi) * 0.5 + 0.5)
                    self.c.append(np.clip(col * shade, 0, 1))
            top, bot = len(self.v), len(self.v) + 1
            self.v.append((cx, cy, cz + r * 0.8))
            self.c.append(np.clip(col * 1.15, 0, 1))
            self.v.append((cx, cy, cz - r * 0.78))
            self.c.append(col * 0.7)
            for i in range(rings - 2):
                for k in range(seg):
                    a = b + i * seg + k
                    a2 = b + i * seg + (k + 1) % seg
                    self.f.append((a, a2, a2 + seg, a + seg))
            for k in range(seg):
                self.f.append((b + k, b + (k + 1) % seg, top))
                self.f.append((b + (rings - 2) * seg + (k + 1) % seg, b + (rings - 2) * seg + k, bot))

    def finish(self):
        return _mesh_object('foliage', self.v, self.f, self.c, _vcol_material('foliage', 0.85), smooth=True)


def scatter(T, fol, rng, count, region, kind='conifer', size=(3.0, 6.0), avoid=(), road_clear=3.4, road=None,
            max_slope=0.62, max_z=48.0, tries=40000):
    placed = 0
    t = 0
    while placed < count and t < tries:
        t += 1
        x = rng.uniform(region[0], region[1])
        y = rng.uniform(region[2], region[3])
        z, sl, rd = T.at(x, y)
        if sl > max_slope or rd > 0.05 or z > max_z:
            continue
        if road is not None and abs(x - road(y)) < road_clear:
            continue
        if any(math.hypot(x - ax, y - ay) < ar for ax, ay, ar in avoid):
            continue
        h = rng.uniform(*size) * (1.0 + 0.25 * (y / 170.0))
        (fol.conifer if kind == 'conifer' else fol.broadleaf)(x, y, z, h)
        placed += 1
    return placed


def flowers(T, rng, count, region, size=(0.04, 0.08), height=0.2, avoid=()):
    v, f, c = [], [], []
    palette = [(0.95, 0.78, 0.18), (0.96, 0.96, 0.92), (0.88, 0.32, 0.12), (0.85, 0.55, 0.78)]
    n = 0
    t = 0
    while n < count and t < count * 8:
        t += 1
        x = rng.uniform(region[0], region[1])
        y = rng.uniform(region[2], region[3])
        if any(math.hypot(x - ax, y - ay) < ar for ax, ay, ar in avoid):
            continue
        z, sl, rd = T.at(x, y)
        if rd > 0.1:
            continue
        r = rng.uniform(*size)
        col = np.array(palette[rng.integers(0, 4)])
        dist = math.sqrt((x - T.cam[0]) ** 2 + (y - T.cam[1]) ** 2 + (z - T.cam[2]) ** 2)
        col = haze_mix(col, dist, T.haze)
        b = len(v)
        for k in range(7):
            a = 2 * math.pi * k / 7
            v.append((x + r * math.cos(a), y + r * math.sin(a), z + height))
            c.append(col)
        v.append((x, y, z + height + r * 0.5))
        c.append(col)
        for k in range(7):
            f.append((b + k, b + (k + 1) % 7, b + 7))
        # a blade of stem
        sb = len(v)
        gcol = haze_mix(np.array((0.10, 0.25, 0.05)), dist, T.haze)
        v.extend([(x, y, z), (x + 0.012, y, z), (x, y, z + height)])
        c.extend([gcol, gcol, gcol])
        f.append((sb, sb + 1, sb + 2))
        n += 1
    return _mesh_object('flowers', v, f, c, _vcol_material('flowers', 0.8))


def grass_tufts(T, rng, count, region, height=(0.25, 0.55), avoid=()):
    """Blades of grass as thin triangles: gives the foreground a texture for the brush to follow."""
    v, f, c = [], [], []
    n = 0
    while n < count:
        x = rng.uniform(region[0], region[1])
        y = rng.uniform(region[2], region[3])
        if any(math.hypot(x - ax, y - ay) < ar for ax, ay, ar in avoid):
            n += 1
            continue
        z, sl, rd = T.at(x, y)
        if rd > 0.2:
            n += 1
            continue
        base = np.array((0.17, 0.32, 0.07)) * rng.uniform(0.7, 1.35)
        dist = math.sqrt((x - T.cam[0]) ** 2 + (y - T.cam[1]) ** 2 + (z - T.cam[2]) ** 2)
        for _ in range(5):
            ang = rng.uniform(0, 2 * math.pi)
            hgt = rng.uniform(*height)
            lean = rng.uniform(0.05, 0.22)
            w = 0.022
            b = len(v)
            v.extend([(x - w, y, z), (x + w, y, z), (x + math.cos(ang) * lean, y + math.sin(ang) * lean, z + hgt)])
            c.extend([haze_mix(base * 0.8, dist, T.haze), haze_mix(base * 0.8, dist, T.haze), haze_mix(base * 1.25, dist, T.haze)])
            f.append((b, b + 1, b + 2))
        n += 1
    return _mesh_object('grass', v, f, c, _vcol_material('grass', 0.8))


# ------------------------------------------------------------------ sky
def sky(sun_elev_deg=6.5, sun_rot_deg=150, strength=0.22, cloud=(1.0, 0.5, 0.24), cloud_amount=(0.50, 0.74), sun_intensity=1.7):
    w = bpy.data.worlds.new('sky')
    w.use_nodes = True
    nt = w.node_tree
    s = nt.nodes.new('ShaderNodeTexSky')
    for t in ('MULTIPLE_SCATTERING', 'SINGLE_SCATTERING'):
        try:
            s.sky_type = t
            break
        except TypeError:
            continue
    s.sun_elevation = math.radians(sun_elev_deg)
    s.sun_rotation = math.radians(sun_rot_deg)
    s.sun_size = math.radians(1.6)
    s.sun_intensity = sun_intensity
    s.air_density = 1.15
    s.aerosol_density = 1.8
    tc = nt.nodes.new('ShaderNodeTexCoord')
    mp = nt.nodes.new('ShaderNodeMapping')
    mp.inputs['Scale'].default_value = (1.0, 1.0, 3.2)
    nz = nt.nodes.new('ShaderNodeTexNoise')
    nz.inputs['Scale'].default_value = 2.2
    nz.inputs['Detail'].default_value = 9.0
    nz.inputs['Roughness'].default_value = 0.62
    cr = nt.nodes.new('ShaderNodeValToRGB')
    cr.color_ramp.elements[0].position = cloud_amount[0]
    cr.color_ramp.elements[1].position = cloud_amount[1]
    hz = nt.nodes.new('ShaderNodeSeparateXYZ')
    hm = nt.nodes.new('ShaderNodeMath')
    hm.operation = 'MULTIPLY'
    hr = nt.nodes.new('ShaderNodeMapRange')
    hr.inputs['From Min'].default_value = 0.04
    hr.inputs['From Max'].default_value = 0.30
    mx = nt.nodes.new('ShaderNodeMix')
    mx.data_type = 'RGBA'
    nt.links.new(tc.outputs['Generated'], mp.inputs['Vector'])
    nt.links.new(mp.outputs['Vector'], nz.inputs['Vector'])
    nt.links.new(nz.outputs['Fac'], cr.inputs['Fac'])
    nt.links.new(tc.outputs['Generated'], hz.inputs['Vector'])
    nt.links.new(hz.outputs['Z'], hr.inputs['Value'])
    nt.links.new(cr.outputs['Color'], hm.inputs[0])
    nt.links.new(hr.outputs['Result'], hm.inputs[1])
    rgba = [i for i in mx.inputs if i.type == 'RGBA']
    rgba[1].default_value = (cloud[0], cloud[1], cloud[2], 1.0)
    nt.links.new(s.outputs['Color'], rgba[0])
    nt.links.new(hm.outputs['Value'], mx.inputs[0])
    nt.links.new([o for o in mx.outputs if o.type == 'RGBA'][0], nt.nodes['Background'].inputs['Color'])
    nt.nodes['Background'].inputs['Strength'].default_value = strength
    bpy.context.scene.world = w


# ------------------------------------------------------------------ the bike in the landscape
def place_bike(loc=(0, 0, 0), rot_z=-6, lean=-13, scale=1.0, frame=(0.012, 0.17, 0.15), bags=True):
    before = set(bpy.data.objects)
    bl.build_bike(frame=frame, accent=(0.89, 0.33, 0.11))
    if bags:
        orange = bl.material('bag_orange', (0.80, 0.26, 0.06), roughness=0.7)
        teal = bl.material('bag_teal', (0.02, 0.18, 0.15), roughness=0.75)
        bl.ellipsoid('frame_bag', (0.115, 0.0, 0.545), (0.215, 0.034, 0.105), teal, rot=(0, math.radians(16), 0))
        bl.cyl('bar_roll', (0.50, 0.0, 0.945), 0.058, 0.36, orange)
        bl.cyl('saddle_bag', (-0.30, 0.0, 0.84), 0.062, 0.34, orange, axis='Y')
        bpy.context.active_object.rotation_euler = (0, math.radians(90), math.radians(-6))
        bl.ellipsoid('bottle', (0.18, 0.0, 0.50), (0.035, 0.035, 0.10), teal)
    objs = [o for o in bpy.data.objects if o not in before]
    pivot = bpy.data.objects.new('bike_pivot', None)
    bpy.context.scene.collection.objects.link(pivot)
    for o in objs:
        o.parent = pivot
    pivot.scale = (scale, scale, scale)
    pivot.rotation_euler = (math.radians(lean), 0, math.radians(rot_z))
    pivot.location = loc
    return pivot


def boulder(loc, scale, seed=3):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=5, radius=1.0, location=loc)
    o = bpy.context.active_object
    o.name = 'boulder'
    o.scale = scale
    m = o.modifiers.new('d', 'DISPLACE')
    tex = bpy.data.textures.new('rocktex%d' % seed, 'CLOUDS')
    tex.noise_scale = 0.55
    m.texture = tex
    m.strength = 0.22
    bpy.ops.object.shade_smooth()
    o.data.materials.append(bl.material('rock', (0.30, 0.28, 0.27), roughness=0.95))
    return o


def _write_focus(out, cam):
    """Where the bike is in the frame (normalised), so the painter can spend its finest strokes there."""
    import json
    from bpy_extras.object_utils import world_to_camera_view
    bpy.context.view_layer.update()
    pivot = bpy.data.objects.get('bike_pivot')
    if pivot is None:
        return
    xs, ys = [], []
    for o in pivot.children:
        for c in o.bound_box:
            p = world_to_camera_view(bpy.context.scene, cam, o.matrix_world @ __import__('mathutils').Vector(c))
            xs.append(p.x)
            ys.append(1 - p.y)
    pad = 0.03
    box = [max(0, min(xs) - pad), max(0, min(ys) - pad), min(1, max(xs) + pad), min(1, max(ys) + pad)]
    with open(out + '.focus.json', 'w') as f:
        json.dump({'box': box}, f)


def finish_render(out, W, H, S, cam_loc, cam_target, lens=30, transparent=False, clip=(0.1, 1000), exposure=-0.2):
    bl.cycles(W, H, S, transparent=transparent)
    sc = bpy.context.scene
    try:
        sc.view_settings.view_transform = 'AgX'
    except TypeError:
        sc.view_settings.view_transform = 'Standard'
    sc.view_settings.exposure = exposure
    cam = bl.camera(cam_loc, cam_target, lens=lens)
    cam.data.clip_start, cam.data.clip_end = clip
    _write_focus(out, cam)
    sc.render.filepath = out
    bpy.ops.render.render(write_still=True)
    print('WROTE', out)
