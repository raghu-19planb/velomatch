// Turns the studio renders in art/out/figs into the web images in images/figs/.
//
//   SHARP_DIR=<folder containing node_modules/sharp> node art/export-figs.mjs [art/out/figs]
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const sharp = createRequire((process.env.SHARP_DIR || '.') + '/')('sharp');
const IN = process.argv[2] || 'art/out/figs';
const OUT = 'images/figs';
fs.mkdirSync(OUT, { recursive: true });
const names = { kids: 'kids', commute: 'commute', road: 'road', mtb: 'mtb', gravel: 'gravel' };
let total = 0;
for (const k of Object.keys(names)) {
  const from = path.join(IN, `fig_${k}.png`);
  if (!fs.existsSync(from)) { console.log('missing', from); continue; }
  const info = await sharp(from).resize({ width: 1400 }).webp({ quality: 88, alphaQuality: 95, effort: 5 }).toFile(path.join(OUT, `fig_${k}.webp`));
  total += info.size;
  console.log(`fig_${k}.webp`.padEnd(18), `${info.width}x${info.height}`, `${Math.round(info.size / 1024)}KB`);
}
console.log('total', Math.round(total / 1024), 'KB');
