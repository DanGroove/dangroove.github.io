// Does the built page show the same pictures as the rough cut? Needs Playwright (see browser.mjs).
//
//   node design/journey-hero/tools/compare.mjs [folder]                                 the usual sizes and moments
//   SIZES=1440x900,390x844@2 TIMES=6,12 node design/journey-hero/tools/compare.mjs out  your own
//
// For each size and moment it screenshots both pages and counts the pixels that differ. Edge smoothing differs by a pixel between
// the rough cut's SVG and the site's canvas, and that is expected. So the count that matters is "solid": what still differs once
// lines of difference thinner than 3px are worn away. A solid patch means something is drawn in a different place, size or colour.
// For every pair that fails, a picture (rough cut, built page, difference) is written to the folder.
import fs from 'node:fs';
import path from 'node:path';
import { studio, seek } from './browser.mjs';
import { ROOT } from './serve.mjs';

const folder = process.argv[2] || path.join(ROOT, 'design/journey-hero/.scratch/compare');
const sizes = (process.env.SIZES || '1440x900,390x844@2,768x1024').split(',');
const times = (process.env.TIMES || '0.5,1.5,2.3,2.6,3.5,4.6,4.99,5.5,6,6.85,7.9,8.3,9.5,10.6,11.3,12,12.9,13.4,14.3,14.6').split(',').map(Number);
const ALLOW = 4;                                  // solid px a pair may differ by and still pass (a faithful canvas port scores 0 everywhere)

// runs in a page: both screenshots in, the counts and a picture of the difference out
async function diff({ a, b }) {
  const load = src => new Promise((ok, no) => { const im = new Image(); im.onload = () => ok(im); im.onerror = no; im.src = 'data:image/png;base64,' + src; });
  const [A, B] = await Promise.all([load(a), load(b)]), w = A.width, h = A.height;
  if (B.width !== w || B.height !== h) return { mismatch: `${w}x${h} against ${B.width}x${B.height}` };
  const read = im => { const c = new OffscreenCanvas(w, h), x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0); return x.getImageData(0, 0, w, h).data; };
  const da = read(A), db = read(B), mask = new Uint8Array(w * h);
  let differ = 0;
  for (let i = 0; i < w * h; i++) {
    const o = i * 4;
    if (Math.max(Math.abs(da[o] - db[o]), Math.abs(da[o + 1] - db[o + 1]), Math.abs(da[o + 2] - db[o + 2])) > 32) { mask[i] = 1; differ++; }
  }
  const over = new ImageData(w, h);
  let solid = 0, x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x; if (!mask[i]) continue;
    const core = x > 0 && y > 0 && x < w - 1 && y < h - 1 && mask[i - 1] && mask[i + 1] && mask[i - w] && mask[i + w] && mask[i - w - 1] && mask[i - w + 1] && mask[i + w - 1] && mask[i + w + 1];
    over.data.set(core ? [255, 221, 0, 255] : [240, 72, 79, 255], i * 4);
    if (core) { solid++; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  }
  const pw = Math.min(w, 960), ph = Math.round(h * pw / w), sheet = document.createElement('canvas'), g = sheet.getContext('2d');
  sheet.width = pw * 3 + 16; sheet.height = ph;
  g.fillStyle = '#333'; g.fillRect(0, 0, sheet.width, ph);
  g.drawImage(A, 0, 0, pw, ph); g.drawImage(B, pw + 8, 0, pw, ph);
  g.fillStyle = '#151314'; g.fillRect(2 * pw + 16, 0, pw, ph);
  g.globalAlpha = 0.3; g.drawImage(B, 2 * pw + 16, 0, pw, ph); g.globalAlpha = 1;
  const oc = new OffscreenCanvas(w, h); oc.getContext('2d').putImageData(over, 0, 0);
  g.drawImage(oc, 2 * pw + 16, 0, pw, ph);
  return { differ, solid, box: solid ? [x0, y0, x1, y1] : null, png: sheet.toDataURL('image/png').split(',')[1] };
}

fs.mkdirSync(folder, { recursive: true });
const st = await studio(), lab = await st.browser.newPage();
let failed = 0;
for (const size of sizes) {
  const rough = await st.open('rough', size), built = await st.open('built', size), scale = +(size.split('@')[1] || 1), rows = [];
  for (const t of times) {
    await seek(rough, t); await seek(built, t);
    const [a, b] = await Promise.all([rough.screenshot(), built.screenshot()]);
    const d = await lab.evaluate(diff, { a: a.toString('base64'), b: b.toString('base64') });
    const ok = !d.mismatch && d.solid <= ALLOW * scale * scale;
    if (!ok) { failed++; if (d.png) fs.writeFileSync(path.join(folder, `differs-${size.replace('@', '-at')}-${t.toFixed(2)}.png`), Buffer.from(d.png, 'base64')); }
    rows.push(`  ${t.toFixed(2).padStart(6)}s  ${d.mismatch ? 'sizes differ: ' + d.mismatch : `${String(d.differ).padStart(7)} px differ, ${String(d.solid).padStart(6)} solid${d.box ? `  inside ${d.box.map(v => Math.round(v / scale)).join(', ')}` : ''}`}${ok ? '' : '   FAILS'}`);
  }
  await rough.close(); await built.close();
  console.log(`${size}\n${rows.join('\n')}`);
}
if (st.errors.length) console.log('\nconsole:\n  ' + [...new Set(st.errors)].join('\n  '));
await st.close();
console.log(failed ? `\n${failed} of ${sizes.length * times.length} pairs differ. Pictures are in ${folder}` : `\nall ${sizes.length * times.length} pairs match`);
process.exitCode = failed ? 1 : 0;
