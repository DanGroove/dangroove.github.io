// The second take's stills on one sheet: each scene in the hero's own layout, on a desktop and on a phone with the browser's bars showing.
// Needs Playwright with its Chromium, like the other review tools. Nothing here is published.
//
//   node design/journey-hero/take-2/tools/sheet.mjs <out.png> [scenes, as in 0,1,2]     (0 Illustrator, 1 Photoshop, 2 InDesign, 3 video)
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
  ['01 Graphic design, in Illustrator', 'The logo and its brand guide are built as one piece. On Export the guide lands in front of the screen, lying flat'],
  ['01 Graphic design, in Photoshop', 'A photo edit of the building: as shot on the left of the split, graded on the right. The print lands beside the guide, and the next pieces all use it'],
  ['01 Graphic design, in InDesign', 'The 1 King Street W booklet, drawn very simply and with no agent names, plus a LinkedIn post and an e-blast that follow it. They land as a booklet (shut and open), a phone and a tablet'],
  ['02 Video', 'The editing app with captions, a transition and effects on the timeline, exported to wide, tall and square screens'],
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
  const scenes = (process.argv[3] || '0,1,2,3').split(',').map(Number);
  const address = writeStillsPage(), { server, url } = await serve(0), browser = await chromium.launch({ args: GL });
  const shots = { desk: [], phone: [] }, errors = [];
  for (const [key, width, height, scale] of [['desk', 1440, 900, 1.5], ['phone', 390, 664, 2]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale });
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(String(e)));
    for (const s of scenes) {
      await page.goto(`${url}${address}?s=${s}`);
      await page.waitForFunction(() => window.__ready, null, { timeout: 20000 });
      await page.evaluate(() => Promise.all(document.getAnimations().map(a => a.finished)));
      await page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))));
      shots[key].push((await page.screenshot()).toString('base64'));
    }
    await page.close();
  }
  const font = fs.readFileSync(path.join(ROOT, 'public/holding/fonts/outfit-latin-wght-normal.woff2')).toString('base64');
  const img = png => `<img src="data:image/png;base64,${png}">`;
  const row = (s, i) => `<figure><div class="pair">${img(shots.desk[i])}${img(shots.phone[i])}</div><figcaption><b>${CAPTIONS[s][0]}</b>${CAPTIONS[s][1]}</figcaption></figure>`;
  const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Outfit;src:url(data:font/woff2;base64,${font}) format("woff2");font-weight:100 900}
body{margin:0;background:#0d0c0c;color:#B9B4AE;font-family:Outfit;padding:48px;width:2964px;box-sizing:content-box}
h1{font-weight:800;font-size:44px;letter-spacing:-.02em;color:#F7F6F3;margin:0 0 6px}p{font-size:20px;margin:0 0 36px;max-width:1900px;line-height:1.45}
figure{margin:0 0 56px}figure:last-child{margin:0}.pair{display:flex;gap:24px;align-items:flex-start}
img{display:block;outline:1px solid #2E2B29}img:first-child{width:2160px}img:last-child{width:780px}
figcaption{font-weight:300;font-size:17px;letter-spacing:.12em;text-transform:uppercase;margin-top:14px}figcaption b{color:#F0484F;font-weight:300;margin-right:16px}
</style><h1>Journey hero: graphic design in three apps</h1><p>Each app is drawn simply on the same floating screen, with its own logo. The app builds a piece of real work, the cursor clicks Export, and the piece lands in front of the screen, lying flat. The flat lay fills up app by app into one tidy block. These are stills of the moment after each export. Left: a 1440 wide desktop. Right: a phone with the browser's bars showing.</p>
${scenes.map(row).join('')}`;
  const page = await browser.newPage({ viewport: { width: 3060, height: 800 } });
  await page.setContent(html); await page.evaluate(() => document.fonts.ready); await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth)); await page.waitForTimeout(300);
  await page.screenshot({ path: out, fullPage: true });
  if (errors.length) console.log('console:\n  ' + [...new Set(errors)].join('\n  '));
  await browser.close(); server.close();
  console.log('sheet', out);
}
