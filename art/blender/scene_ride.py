"""The paintings for the home-page intro. One script, several scenes.

    blender -b -P art/blender/scene_ride.py -- <scene> <out.png> [width height samples]
      scene: pano-far | pano-mid | pano-near | pano-full | bikepacking | kids | mountain | racing | commute

The pano-* scenes are the same landscape rendered in depth slices (so the page can slide them at
different speeds for parallax); the others are the five category vignettes.
"""
import math
import os
import sys
import zlib

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bikelib as bl  # noqa: E402
import bpy  # noqa: E402
import landscape as ls  # noqa: E402

args = sys.argv[sys.argv.index('--') + 1:]
which, out = args[0], args[1]
W = int(args[2]) if len(args) > 4 else 1200
H = int(args[3]) if len(args) > 4 else 900
S = int(args[4]) if len(args) > 4 else 64
rng = np.random.default_rng({'pano-far': 11, 'pano-mid': 11, 'pano-near': 11, 'pano-full': 11}.get(which, zlib.crc32(which.encode()) % 997))
bl.reset()
# look-dev override: SV_SUN="elevation,rotation" re-aims the sun without editing the scene
_sun = os.environ.get('SV_SUN')
if _sun:
    _e, _r = [float(v) for v in _sun.split(',')]
    _orig_sky = ls.sky
    ls.sky = lambda e, r, *a, **k: _orig_sky(_e, _r, *a, **k)
warm_haze = (0.60, 0.64, 0.78)   # cool, blue-violet air: far ridges read as distance


def road_pass(y):
    return 5.5 - 0.10 * y + 9.0 * np.sin(y / 26.0)


# ------------------------------------------------------------------ the home-page panorama and the bikepacking vignette
if which.startswith('pano') or which == 'bikepacking':
    if which == 'bikepacking':
        cam, tgt, lens, clip = (-1.9, -3.6, 0.95), (4.6, 24.0, 3.9), 30, (0.1, 1000)
    else:
        cam, tgt, lens = (-1.0, -8.0, 1.3), (6.0, 30.0, 4.6), 18
        clip = {'pano-far': (115, 1000), 'pano-mid': (16, 130), 'pano-near': (0.1, 24), 'pano-full': (0.1, 1000)}[which]
    T = ls.Terrain(rng, cam, warm_haze, road=road_pass, mountains=92, mountain_start=105, extent=(-170, 170, -12, 420), snow=40,
                   palette=dict(rock=(0.20, 0.20, 0.27)))
    fol = ls.Foliage(T)
    ls.scatter(T, fol, rng, 330, (-120, 120, 26, 175), 'conifer', (3.2, 6.5), avoid=[(0.3, 0, 12)], road=road_pass)
    ls.scatter(T, fol, rng, 60, (-110, 110, 22, 120), 'broadleaf', (3.5, 6.0), avoid=[(0.3, 0, 12)], road=road_pass, max_z=14)
    fol.finish()
    ls.flowers(T, rng, 520, (-12, 12, -9, 16), avoid=[(0.2, 0.0, 1.7)])
    ls.grass_tufts(T, rng, 700, (-12, 12, -9, 16), avoid=[(0.2, 0.0, 1.5)])
    ls.boulder((0.15, 0.95, 0.42), (0.85, 0.72, 0.62))
    ls.place_bike(lean=-13, rot_z=-6)
    ls.sky(8, 100, 0.22, sun_intensity=1.6)
    transparent = which in ('pano-mid', 'pano-near')
    ls.finish_render(out, W, H, S, cam, tgt, lens=lens, transparent=transparent, clip=clip)

# ------------------------------------------------------------------ kids: a bright meadow, a small bike
elif which == 'kids':
    cam, tgt = (-1.5, -3.4, 0.72), (1.1, 14.0, 1.2)
    T = ls.Terrain(rng, cam, (0.62, 0.68, 0.74), mountains=40, mountain_start=110, snow=999, relief=1.2,
                   palette=dict(grass=(0.13, 0.30, 0.06), gold=(0.46, 0.40, 0.09)), road=lambda y: 40 - 0.0 * y, clearing=(0.0, 0.0, 5.0, 8.0))
    fol = ls.Foliage(T)
    ls.scatter(T, fol, rng, 36, (-60, 60, 22, 90), 'broadleaf', (6.0, 10.0), avoid=[(0, 0, 14)], max_z=12)
    ls.scatter(T, fol, rng, 26, (-60, 60, 34, 140), 'conifer', (6, 10), avoid=[(0, 0, 14)], max_z=30)
    fol.finish()
    ls.flowers(T, rng, 900, (-8, 8, -5, 18), size=(0.028, 0.055), height=0.24, avoid=[(0.1, 0, 1.2)])
    ls.grass_tufts(T, rng, 700, (-8, 8, -5, 18), height=(0.16, 0.34), avoid=[(0.1, 0, 1.2)])
    ls.boulder((0.40, 0.62, 0.14), (0.40, 0.30, 0.20), seed=5)
    ls.place_bike(loc=(0.0, 0, 0), rot_z=-14, lean=-10, scale=0.62, frame=(0.66, 0.11, 0.03), bags=False)
    ls.sky(13, 105, 0.26, cloud=(1.0, 0.78, 0.62), cloud_amount=(0.46, 0.70), sun_intensity=1.7)
    ls.finish_render(out, W, H, S, cam, tgt, lens=30, exposure=-0.55)

# ------------------------------------------------------------------ mountain: a forest trail
elif which == 'mountain':
    cam, tgt = (-1.6, -4.4, 1.25), (1.0, 18.0, 2.6)

    def trail(y):
        return 1.8 + 2.6 * np.sin(y / 9.0)
    T = ls.Terrain(rng, cam, (0.58, 0.66, 0.62), mountains=60, mountain_start=40, snow=999, relief=2.4, road=trail, road_w=0.9,
                   palette=dict(grass=(0.09, 0.22, 0.05), gold=(0.28, 0.28, 0.07), gravel=(0.36, 0.26, 0.17)), clearing=(0.0, 0.0, 4.0, 6.0), road_end=60)
    fol = ls.Foliage(T)
    ls.scatter(T, fol, rng, 130, (-34, 34, 9, 70), 'conifer', (5.5, 10.0), avoid=[(0, 0, 3.0), (cam[0], cam[1], 9.0)], road=trail, road_clear=2.2, max_slope=0.9, max_z=60)
    ls.scatter(T, fol, rng, 24, (-24, 24, 9, 45), 'broadleaf', (4.5, 7.0), avoid=[(0, 0, 3.0), (cam[0], cam[1], 9.0)], road=trail, road_clear=2.2, max_slope=0.9, max_z=60)
    fol.finish()
    ls.grass_tufts(T, rng, 700, (-6, 6, -4, 14), height=(0.15, 0.4), avoid=[(0.1, 0, 0.9)])
    ls.flowers(T, rng, 120, (-6, 6, -4, 14), avoid=[(0.1, 0, 1.0)])
    ls.boulder((0.2, 0.75, 0.30), (0.62, 0.55, 0.38), seed=7)
    ls.place_bike(loc=(0, 0, 0), rot_z=-8, lean=-12, scale=1.0, frame=(0.012, 0.17, 0.15), bags=False)
    ls.sky(11, 115, 0.20, cloud=(1.0, 0.7, 0.5), cloud_amount=(0.5, 0.8), sun_intensity=2.0)
    ls.finish_render(out, W, H, S, cam, tgt, lens=28, exposure=-0.2)

# ------------------------------------------------------------------ racing: an empty road at sunrise
elif which == 'racing':
    cam, tgt = (-1.0, -5.0, 0.95), (3.5, 40.0, 3.0)

    def straight(y):
        return 3.0 + 7.0 * np.sin(y / 70.0)
    T = ls.Terrain(rng, cam, (0.62, 0.64, 0.78), mountains=90, mountain_start=70, snow=36, relief=2.0, road=straight, road_w=3.4, stripe=True, road_end=70,
                   palette=dict(gravel=(0.10, 0.10, 0.12), rock=(0.20, 0.20, 0.27)), clearing=(0.0, 0.0, 2.0, 4.0))
    fol = ls.Foliage(T)
    ls.scatter(T, fol, rng, 120, (-90, 90, 24, 200), 'conifer', (3.5, 7.0), road=straight, road_clear=5.5, max_z=30)
    fol.finish()
    ls.grass_tufts(T, rng, 800, (-9, 9, -6, 12), avoid=[(0.0, 0.0, 1.2)])
    # the bike leans on a roadside stone on the shoulder, not stood in the road
    ls.boulder((-2.6, 0.4, 0.34), (0.5, 0.42, 0.36), seed=9)
    ls.place_bike(loc=(-2.3, 0.0, 0.0), rot_z=-10, lean=-12, scale=1.0, frame=(0.012, 0.17, 0.15), bags=False)
    ls.sky(4.0, 160, 0.26, cloud=(1.0, 0.45, 0.22), cloud_amount=(0.45, 0.72), sun_intensity=2.0)
    ls.finish_render(out, W, H, S, cam, tgt, lens=34, exposure=-0.25)

# ------------------------------------------------------------------ commute: a city street at dawn
elif which == 'commute':
    cam, tgt = (-1.6, -4.2, 1.0), (1.8, 20.0, 3.4)
    # ground
    bpy.ops.mesh.primitive_plane_add(size=300, location=(0, 60, 0))
    g = bpy.context.active_object
    g.data.materials.append(bl.material('asphalt', (0.07, 0.07, 0.08), roughness=0.55))
    for x0, x1 in ((-7.2, -3.8), (3.8, 7.2)):  # pavements
        bpy.ops.mesh.primitive_cube_add(location=((x0 + x1) / 2, 60, 0.07), scale=((x1 - x0) / 2, 120, 0.07))
        bpy.context.active_object.data.materials.append(bl.material('pave', (0.30, 0.28, 0.26), roughness=0.8))
    win_on, win_off, wb = [], [], []
    bmat = [bl.material('brick%d' % i, c, roughness=0.9) for i, c in enumerate(
        [(0.36, 0.17, 0.12), (0.44, 0.30, 0.20), (0.30, 0.30, 0.34), (0.52, 0.40, 0.28), (0.26, 0.20, 0.18)])]
    y = -4.0
    for side in (-1, 1):
        y = -6.0
        while y < 110:
            d = rng.uniform(7, 12)
            hgt = rng.uniform(9, 24)
            x = side * (8.0 + 5.0)
            bpy.ops.mesh.primitive_cube_add(location=(x, y + d / 2, hgt / 2), scale=(5.0, d / 2, hgt / 2))
            b = bpy.context.active_object
            b.data.materials.append(bmat[rng.integers(0, len(bmat))])
            face_x = x - side * 5.0
            for zz in np.arange(2.2, hgt - 1.0, 3.0):
                for yy in np.arange(y + 1.2, y + d - 0.8, 2.4):
                    (win_on if rng.random() < 0.4 else win_off).append((face_x - side * 0.02, yy, zz))
            y += d + rng.uniform(0, 0.6)
    for lst, mat in ((win_on, bl.material('win_on', (1.0, 0.7, 0.3), roughness=0.3)), (win_off, bl.material('win_off', (0.05, 0.07, 0.10), roughness=0.2, metallic=0.2))):
        verts, faces = [], []
        for (wx, wy, wz) in lst:
            b0 = len(verts)
            verts += [(wx, wy - 0.7, wz - 0.9), (wx, wy + 0.7, wz - 0.9), (wx, wy + 0.7, wz + 0.9), (wx, wy - 0.7, wz + 0.9)]
            faces.append((b0, b0 + 1, b0 + 2, b0 + 3))
        m = bpy.data.meshes.new('win')
        m.from_pydata(verts, [], faces)
        m.update()
        o = bpy.data.objects.new('win', m)
        bpy.context.scene.collection.objects.link(o)
        if mat.name == 'win_on':
            em = mat.node_tree.nodes['Principled BSDF']
            em.inputs['Emission Color'].default_value = (1.0, 0.62, 0.22, 1.0)
            em.inputs['Emission Strength'].default_value = 2.2
        m.materials.append(mat)
    # lamp post and the bike leaning on the kerb
    bl.cyl('lamp', (-3.6, 1.6, 2.4), 0.06, 4.8, bl.material('lampm', (0.02, 0.02, 0.02), roughness=0.4), axis='Z')
    ls.place_bike(loc=(-2.4, 0.5, 0.0), rot_z=-14, lean=-8, scale=1.0, frame=(0.012, 0.17, 0.15), bags=False)
    ls.sky(3.0, 170, 0.45, cloud=(1.0, 0.45, 0.35), cloud_amount=(0.40, 0.70), sun_intensity=1.2)
    ls.finish_render(out, W, H, S, cam, tgt, lens=30, exposure=0.1)
else:
    raise SystemExit('unknown scene ' + which)
