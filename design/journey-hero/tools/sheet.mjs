// One sheet of six moments from the loop, on a desktop and on a phone, with their times: the picture that goes out for comments.
// Needs Playwright (see browser.mjs).
//
//   node design/journey-hero/tools/sheet.mjs <built|rough> <out.png> ["Heading for the sheet"]
import fs from 'node:fs';
import path from 'node:path';
import { studio, seek } from './browser.mjs';
import { ROOT } from './serve.mjs';

const [which = 'built', out = 'sheet.png', heading = 'Journey hero'] = process.argv.slice(2);
const MOMENTS = [[1.5, 'Opening: the four stripes'], [2.4, 'They fold down into a deck'], [4.99, '01 Graphic design: the swatch fan'], [6, '02 Video: the clapperboard'], [8.3, '03 Motion: the stack turns'], [12, '04 UX/UI: the window']];

const st = await studio(), shots = {};
for (const [key, size] of [['desk', '1440x900'], ['phone', '390x664@2']]) {   // the phone as a browser shows it, with its bars up
  const page = await st.open(which, size);
  shots[key] = [];
  for (const [t] of MOMENTS) { await seek(page, t); shots[key].push((await page.screenshot()).toString('base64')); }
  await page.close();
}
const font = fs.readFileSync(path.join(ROOT, 'public/holding/fonts/outfit-latin-wght-normal.woff2')).toString('base64');
const figure = (png, t, caption = '') => `<figure><img src="data:image/png;base64,${png}"><figcaption><b>${t.toFixed(1)}s</b>${caption}</figcaption></figure>`;
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Outfit;src:url(data:font/woff2;base64,${font}) format("woff2");font-weight:100 900}
body{margin:0;background:#0d0c0c;color:#B9B4AE;font-family:Outfit;padding:48px;width:2904px;box-sizing:content-box}
h1{font-weight:800;font-size:44px;letter-spacing:-.02em;color:#F7F6F3;margin:0 0 6px}p{font-size:20px;margin:0 0 36px}
.g{display:grid;grid-template-columns:repeat(3,952px);gap:24px}.g.p{grid-template-columns:repeat(6,464px);margin-top:36px}
figure{margin:0}img{display:block;width:100%;outline:1px solid #2E2B29}
figcaption{font-weight:300;font-size:17px;letter-spacing:.12em;text-transform:uppercase;margin-top:10px}figcaption b{color:#F0484F;font-weight:300;margin-right:14px}
</style><h1>${heading}</h1><p>Six moments from the loop, on a 1440 wide desktop and on a phone with the browser's bars showing. Times are seconds from page load.</p>
<div class="g">${MOMENTS.map(([t, c], i) => figure(shots.desk[i], t, c)).join('')}</div>
<div class="g p">${MOMENTS.map(([t], i) => figure(shots.phone[i], t)).join('')}</div>`;
const page = await st.browser.newPage({ viewport: { width: 3000, height: 800 } });
await page.setContent(html); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(200);
await page.screenshot({ path: out, fullPage: true });
if (st.errors.length) console.log('console:\n  ' + [...new Set(st.errors)].join('\n  '));
await st.close();
console.log('sheet', out);
