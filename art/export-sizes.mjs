// Turns the size renders in art/out/sizes into the web images in images/sizes/.
//
//   SHARP_DIR=<folder containing node_modules/sharp> node art/export-sizes.mjs [art/out/sizes]
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const sharp = createRequire((process.env.SHARP_DIR || '.') + '/')('sharp');
const IN = process.argv[2] || 'art/out/sizes';
const OUT = 'images/sizes';
fs.mkdirSync(OUT, { recursive: true });
let total = 0;
for (const f of fs.readdirSync(IN).filter(n => /^size_\d+\.png$/.test(n)).sort()) {
  const info = await sharp(path.join(IN, f)).webp({ quality: 86, alphaQuality: 95, effort: 5 }).toFile(path.join(OUT, f.replace('.png', '.webp')));
  total += info.size;
  console.log(f.replace('.png', '.webp').padEnd(18), `${info.width}x${info.height}`, `${Math.round(info.size / 1024)}KB`);
}
console.log('total', Math.round(total / 1024), 'KB');
