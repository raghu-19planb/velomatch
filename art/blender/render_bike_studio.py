"""Studio render of the bike on a transparent background with a soft contact shadow.

    blender -b -P art/blender/render_bike_studio.py -- <out.png> [width height samples]
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bikelib as bl  # noqa: E402
import bpy  # noqa: E402

args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
out = args[0] if args else 'bike_studio.png'
W = int(args[1]) if len(args) > 2 else 1600
H = int(args[2]) if len(args) > 2 else 1100
S = int(args[3]) if len(args) > 3 else 96

bl.reset()
bl.build_bike()
bl.studio_ground()
bl.world((0.80, 0.82, 0.86), 0.32)
bl.cycles(W, H, S, transparent=True)
bl.camera((3.4, -4.1, 1.15), (0.08, 0.0, 0.43), lens=78)
# big soft boxes: key from front-right-above, fill from the left, rim from behind, top
bl.area_light('key', (2.4, -3.2, 3.0), (0.1, 0, 0.45), (3.5, 3.5), 520)
bl.area_light('fill', (-2.8, -2.6, 1.6), (0.1, 0, 0.45), (3.0, 3.0), 150)
bl.area_light('rim', (-2.2, 3.0, 2.6), (0.1, 0, 0.45), (3.0, 2.0), 360, (1.0, 0.92, 0.82))
bl.area_light('top', (0.0, 0.0, 3.6), (0.1, 0, 0.45), (3.0, 3.0), 170)

bpy.context.scene.render.filepath = out
bpy.ops.render.render(write_still=True)
print('WROTE', out)
