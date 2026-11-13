// Turns the finished paintings in art/out into the web images in images/intro/.
//
//   SHARP_DIR=<folder containing node_modules/sharp> node art/export-webp.mjs [art/out]
//
// sharp is only needed for this export step, so it is not a dependency of the site.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const sharp = createRequire((process.env.SHARP_DIR || '.') + '/')('sharp');
const IN = process.argv[2] || 'art/out';
const OUT = 'images/intro';
fs.mkdirSync(OUT, { recursive: true });

const jobs = [
  // the three depth layers of the panorama (mid and near keep their transparency)
  ['layer_far.png', 'layer_far.webp', { quality: 80 }],
  ['layer_mid.png', 'layer_mid.webp', { quality: 80, alphaQuality: 92 }],
  ['layer_near.png', 'layer_near.webp', { quality: 80, alphaQuality: 92 }],
  // the five category paintings
  ...['kids', 'commute', 'mountain', 'bikepacking', 'racing'].map(k => [`p_${k}.png`, `${k}.webp`, { quality: 82 }]),
];
let total = 0;
for (const [src, dst, opts] of jobs) {
  const from = path.join(IN, src);
  if (!fs.existsSync(from)) { console.log('missing', from); continue; }
  const info = await sharp(from).webp({ effort: 5, ...opts }).toFile(path.join(OUT, dst));
  total += info.size;
  console.log(dst.padEnd(18), `${info.width}x${info.height}`, `${Math.round(info.size / 1024)}KB`);
}
console.log('total', Math.round(total / 1024), 'KB');
