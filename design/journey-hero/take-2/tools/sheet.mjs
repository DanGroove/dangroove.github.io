// The second take's stills on one sheet: the four objects in the hero's own layout, on a desktop and on a phone with the browser's bars showing.
// Needs Playwright with its Chromium, like the other review tools. Nothing here is published.
//
//   node design/journey-hero/take-2/tools/sheet.mjs <out.png>
//
// The stills page is made from the built page's own markup (public/journey/index.html), so the layout and the words are the real ones.
// It is written to design/journey-hero/.scratch/take-2/hero.html, which git ignores.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { serve, ROOT } from '../../tools/serve.mjs';

const require = createRequire(import.meta.url);
const out = process.argv[2] || 'take-2-sheet.png';
const CAPTIONS = [
  ['01 Graphic design', 'A poster with a pen tool point on its circle, a letter, a swatch fan and a pencil'],
  ['02 Video', 'A clapperboard with its stick open, and a film camera on a tripod'],
  ['03 Motion', 'A ball bouncing down three steps along its path, keyframes, and the easing curve behind it'],
  ['04 UX/UI', 'A screen and a phone with their layers lifted off, a cursor on the button, and a switch'],
];

// the built page, with its player swapped for the stills script
export function writeStillsPage() {
  const dir = path.join(ROOT, 'design/journey-hero/.scratch/take-2');
  let html = fs.readFileSync(path.join(ROOT, 'public/journey/index.html'), 'utf8');
  html = html.replace(/\s*<link rel="modulepreload"[^>]*>/g, '').replace(/<noscript>.*?<\/noscript>/s, '');
  html = html.replace('<script type="module" src="hero/hero.mjs"></script>', '<script type="module" src="/design/journey-hero/take-2/stills.mjs"></script>');
  html = html.replace('<meta charset="utf-8" />', '<meta charset="utf-8" />\n    <base href="/public/journey/" />');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'hero.html'), html);
  return '/design/journey-hero/.scratch/take-2/hero.html';
}

// headless Chromium draws WebGL in software; these switches make sure it does
export const GL = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];

if (process.argv[1] && path.resolve(process.argv[1]) === new URL(import.meta.url).pathname) {
  const { chromium } = require('playwright');
  const address = writeStillsPage(), { server, url } = await serve(0), browser = await chromium.launch({ args: GL });
  const shots = { desk: [], phone: [] }, errors = [];
  for (const [key, width, height, scale] of [['desk', 1440, 900, 1], ['phone', 390, 664, 2]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale });
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(String(e)));
    for (let o = 0; o < 4; o++) {
      await page.goto(`${url}${address}?o=${o}`);
      await page.waitForFunction(() => window.__ready, null, { timeout: 20000 });
      await page.evaluate(() => Promise.all(document.getAnimations().map(a => a.finished)));
      await page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))));
      shots[key].push((await page.screenshot()).toString('base64'));
    }
    await page.close();
  }
  const font = fs.readFileSync(path.join(ROOT, 'public/holding/fonts/outfit-latin-wght-normal.woff2')).toString('base64');
  const figure = (png, i, long) => `<figure><img src="data:image/png;base64,${png}"><figcaption><b>${CAPTIONS[i][0]}</b>${long ? CAPTIONS[i][1] : ''}</figcaption></figure>`;
  const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Outfit;src:url(data:font/woff2;base64,${font}) format("woff2");font-weight:100 900}
body{margin:0;background:#0d0c0c;color:#B9B4AE;font-family:Outfit;padding:48px;width:2904px;box-sizing:content-box}
h1{font-weight:800;font-size:44px;letter-spacing:-.02em;color:#F7F6F3;margin:0 0 6px}p{font-size:20px;margin:0 0 36px;max-width:1900px;line-height:1.45}
.g{display:grid;grid-template-columns:repeat(2,1440px);gap:40px 24px}.g.p{grid-template-columns:repeat(4,708px);margin-top:48px}
figure{margin:0}img{display:block;width:100%;outline:1px solid #2E2B29}
figcaption{font-weight:300;font-size:17px;letter-spacing:.12em;text-transform:uppercase;margin-top:12px}figcaption b{color:#F0484F;font-weight:300;margin-right:16px}
</style><h1>Journey hero, second take: stills</h1><p>Each craft is now an object you can recognise, lit and shadowed in real 3D, in paper, red and ink. These are stills: in the loop the pieces of one object rebuild into the next, and each object does one small thing (the clapper claps, the ball bounces, the cursor clicks). Top: a 1440 wide desktop. Bottom: a phone with the browser's bars showing.</p>
<div class="g">${shots.desk.map((s, i) => figure(s, i, true)).join('')}</div>
<div class="g p">${shots.phone.map((s, i) => figure(s, i, false)).join('')}</div>`;
  const page = await browser.newPage({ viewport: { width: 3000, height: 800 } });
  await page.setContent(html); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300);
  await page.screenshot({ path: out, fullPage: true });
  if (errors.length) console.log('console:\n  ' + [...new Set(errors)].join('\n  '));
  await browser.close(); server.close();
  console.log('sheet', out);
}
