// Fetches an image URL and reports whether it is a real, loadable image and its
// true pixel size, read from the file header (no image libraries needed).
// Used both when adding a bike to the showcase and by the quarterly health check,
// so "HQ" means something measurable: we never trust a URL just because it parses.

import fs from 'node:fs';

const UA = 'Mozilla/5.0 (compatible; BikeSpokeShowcaseCheck/1.0; +https://raghu-19planb.github.io/velomatch/)';

export function dimsFromBytes(b) {
  // PNG
  if (b.length > 24 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) {
    return { type: 'png', width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  }
  // GIF
  if (b.length > 10 && b.toString('ascii', 0, 3) === 'GIF') {
    return { type: 'gif', width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
  }
  // WebP
  if (b.length > 30 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const fmt = b.toString('ascii', 12, 16);
    if (fmt === 'VP8 ') return { type: 'webp', width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (fmt === 'VP8L') {
      const v = b.readUInt32LE(21);
      return { type: 'webp', width: (v & 0x3fff) + 1, height: ((v >> 14) & 0x3fff) + 1 };
    }
    if (fmt === 'VP8X') return { type: 'webp', width: (b.readUIntLE(24, 3) + 1), height: (b.readUIntLE(27, 3) + 1) };
  }
  // JPEG: walk segments to the first Start-Of-Frame marker
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
        return { type: 'jpeg', height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
      }
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return null;
}

// Same report for a file in the repo (used for photos we already host, e.g. images/kids/...).
export function localImageInfo(relPath) {
  try {
    const b = fs.readFileSync(relPath);
    const d = dimsFromBytes(b.subarray(0, 400000));
    return d ? { ok: true, bytes: b.length, ...d } : { ok: false, error: "could not read image size" };
  } catch (e) { return { ok: false, error: "missing file: " + relPath }; }
}

// Returns { ok, status, contentType, bytes, width, height, type, error? }
export async function imageInfo(url, { timeoutMs = 20000, referer } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const headers = { 'User-Agent': UA, Accept: 'image/avif,image/webp,image/*,*/*;q=0.8' };
    if (referer) headers.Referer = referer;
    const res = await fetch(url, { signal: ctrl.signal, headers, redirect: 'follow' });
    const contentType = res.headers.get('content-type') || '';
    const out = { ok: false, status: res.status, contentType, finalUrl: res.url };
    if (!res.ok) return { ...out, error: 'HTTP ' + res.status };
    if (!/^image\//i.test(contentType)) return { ...out, error: 'not an image: ' + contentType };
    // Only the header is needed; read the stream until we can parse dimensions.
    const reader = res.body.getReader();
    const chunks = []; let total = 0; let dims = null;
    while (total < 400000) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(Buffer.from(value)); total += value.length;
      dims = dimsFromBytes(Buffer.concat(chunks));
      if (dims) break;
    }
    try { await reader.cancel(); } catch {}
    if (!dims) return { ...out, error: 'could not read image size (format ' + contentType + ')' };
    return { ...out, ok: true, bytes: Number(res.headers.get('content-length')) || null, ...dims };
  } catch (e) {
    return { ok: false, error: e.name === 'AbortError' ? 'timeout' : String(e.message || e) };
  } finally {
    clearTimeout(timer);
  }
}

// CLI: node scripts/lib/imginfo.mjs <url> [<url> ...]
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` || process.argv[1]?.endsWith('imginfo.mjs')) {
  const urls = process.argv.slice(2);
  for (const u of urls) {
    const r = await imageInfo(u);
    console.log(r.ok ? `OK   ${r.width}x${r.height} ${r.type} ${r.bytes ? Math.round(r.bytes / 1024) + 'KB' : ''}  ${u}` : `FAIL ${r.error}  ${u}`);
  }
}
