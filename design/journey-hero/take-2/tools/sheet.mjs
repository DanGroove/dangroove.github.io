// The second take's stills on one sheet: each scene in the hero's own layout, on a desktop and on a phone with the browser's bars showing.
// Needs Playwright with its Chromium, like the other review tools. Nothing here is published.
//
//   node design/journey-hero/take-2/tools/sheet.mjs <out.png> [scenes, as in 0,1,2]     (0 Photoshop, 1 Illustrator, 2 InDesign, 3 video, 4 motion, 5 UX/UI)
//
// The stills page is made from the built page's own markup (public/journey/index.html), so the layout and the words are the real ones.
// Generated pages and output stay inside take-2/.scratch/.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { writeStillsPage, outputPath, TAKE } from './page.mjs';
export { writeStillsPage } from './page.mjs';
import { serve, ROOT } from '../../tools/serve.mjs';

const require = createRequire(import.meta.url);
const out = process.argv[2] || path.join(TAKE, '.scratch', 'sheet.png');
const CAPTIONS = [
  ['01 Graphic design, in Photoshop', 'First, a photo edit of the building: as shot on the left of the split, graded on the right. Nothing lands on the floor when it exports. The photograph goes on into the next apps, and every later piece uses it'],
  ['01 Graphic design, in Illustrator', 'Second, the booklet\'s two maps, simplified. Above, King Street from the amenities page. Below, downtown from the location page, and beside it a closer view of the part in the red frame, where the subway\'s line is selected as a path. Landmarks and transit carry plain badges in place of their logos. Nothing lands on the floor here either: the maps go into the booklet'],
  ['01 Graphic design, in InDesign', 'Last, the 1 King Street W booklet, drawn very simply, with no agent names and with both logos as blobs, plus a LinkedIn post and an e-blast that follow it. This export is what lands: one stack of closed copies, the post in a phone and the e-blast in a tablet. One copy is taken off the top of the stack, opened and leafed through: here a page is landing on the location spread'],
  ['02 Video', 'The editing app with captions, a transition and an effect on the timeline, exported to three screens: wide on a tablet, tall as a reel, and square in a feed'],
  ['03 Motion', 'A SaaS style animation of words and shapes: its layers and keyframes on the timeline, the ball selected on its path, and the ease between its keyframes in the graph. Exported to the same three screens: in a player, as a story, and square in a feed'],
  ['04 UX/UI', 'Figma, with this page\'s own hero as the work. Wireframes above and the designs below: a desktop, and a phone in two states. A prototype link runs from the second craft in the phone\'s list to the state it leads to, and the panel on the right shows that link and its ease. Exported to the same three screens: the page in a browser on a tablet, and the phone\'s two states'],
];
// the moments of the booklet's story that the sheet shows under the InDesign still (see copy in stage.mjs), and which scene that is
const TURNS = [-0.7, 0.3, 1, 1.4, 2, 2.76], BOOKLET = 2;

// headless Chromium draws WebGL in software; these switches make sure it does
export const GL = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const destination = outputPath(out);
  const { chromium } = require('playwright');
  const scenes = (process.argv[3] || '0,1,2,3,4,5').split(',').map(Number);
  const address = writeStillsPage(), { server, url } = await serve(0), browser = await chromium.launch({ args: GL });
  const shots = { desk: [], phone: [] }, turns = [], errors = [];
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
    if (key === 'desk' && scenes.includes(BOOKLET)) for (const at of TURNS) {       // the copy that is taken off the stack and leafed through: the flat lay only
      await page.goto(`${url}${address}?s=${BOOKLET}&at=${at}`);
      await page.waitForFunction(() => window.__ready, null, { timeout: 20000 });
      await page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))));
      const [x0, y0, x1, y1] = await page.evaluate(() => window.__need.lay), pad = 16;
      turns.push((await page.screenshot({ clip: { x: x0 - pad, y: y0 - pad, width: x1 - x0 + 2 * pad, height: y1 - y0 + 2 * pad } })).toString('base64'));
    }
    await page.close();
  }
  const font = fs.readFileSync(path.join(ROOT, 'public/holding/fonts/outfit-latin-wght-normal.woff2')).toString('base64');
  const img = png => `<img src="data:image/png;base64,${png}">`;
  const strip = () => `<figure><div class="strip">${turns.map(img).join('')}</div><figcaption><b>One copy is taken off the top, opened and leafed through</b>It lifts off the stack and is set down in front. Its cover opens at The Offering, then the pages turn: to the location spread, to amenities, and on to the gallery. Each page bends as paper does: its edge peels up first, and it lands from the spine outward. Six moments, left to right</figcaption></figure>`;
  const row = (s, i) => `<figure><div class="pair">${img(shots.desk[i])}${img(shots.phone[i])}</div><figcaption><b>${CAPTIONS[s][0]}</b>${CAPTIONS[s][1]}</figcaption></figure>${s === BOOKLET && turns.length ? strip() : ''}`;
  const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Outfit;src:url(data:font/woff2;base64,${font}) format("woff2");font-weight:100 900}
body{margin:0;background:#0d0c0c;color:#B9B4AE;font-family:Outfit;padding:48px;width:2964px;box-sizing:content-box}
h1{font-weight:800;font-size:44px;letter-spacing:-.02em;color:#F7F6F3;margin:0 0 6px}p{font-size:20px;margin:0 0 36px;max-width:1900px;line-height:1.45}
figure{margin:0 0 56px}figure:last-child{margin:0}.pair{display:flex;gap:24px;align-items:flex-start}
img{display:block;outline:1px solid #2E2B29}.pair img:first-child{width:2160px}.pair img:last-child{width:780px}
.strip{display:flex;gap:18px}.strip img{width:calc((100% - ${18 * (TURNS.length - 1)}px) / ${TURNS.length})}
figcaption{font-weight:300;font-size:17px;letter-spacing:.12em;text-transform:uppercase;margin-top:14px}figcaption b{color:#F0484F;font-weight:300;margin-right:16px}
</style><h1>Journey hero: stills of the four crafts</h1><p>Each app is drawn simply on the same floating screen, with its own logo. The app builds a piece of real work and the cursor clicks Export. Photoshop and Illustrator pass their work on to the next app, so the floor stays empty until InDesign exports. What is exported lies flat in front of the screen, in one tidy block. Left: a 1440 wide desktop. Right: a phone with the browser's bars showing.</p>
${scenes.map(row).join('')}`;
  const page = await browser.newPage({ viewport: { width: 3060, height: 800 } });
  await page.setContent(html); await page.evaluate(() => document.fonts.ready); await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth)); await page.waitForTimeout(300);
  await page.screenshot({ path: destination, fullPage: true });
  if (errors.length) console.log('console:\n  ' + [...new Set(errors)].join('\n  '));
  await browser.close(); server.close();
  console.log('sheet', out);
}
