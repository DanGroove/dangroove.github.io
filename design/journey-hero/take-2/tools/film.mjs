// Held moments, eight to a row at half size. Run only where Playwright and Chromium are installed.
// node design/journey-hero/take-2/tools/film.mjs <out.png> <from> <to> <step> [--phone]
import { createRequire } from 'node:module';
import { serve } from '../../tools/serve.mjs';
import { writePlayerPage, outputPath } from './page.mjs';
import { GL } from './sheet.mjs';
import { sceneAt } from '../stage.mjs';

const [out, first, last, interval] = process.argv.slice(2);
const from = Number(first), to = Number(last), step = Number(interval);
if (!out || [first, last, interval].some(v => v === undefined) || ![from, to, step].every(Number.isFinite) || step <= 0 || to < from) {
  throw new Error('usage: film.mjs <out.png> <from> <to> <step> [--phone]');
}
const destination = outputPath(out), phone = process.argv.includes('--phone');
const { chromium } = createRequire(import.meta.url)('playwright');
const address = writePlayerPage(), { server, url } = await serve(0);
let browser;
try {
  browser = await chromium.launch({ args: GL });
  const viewport = phone ? { width: 390, height: 664 } : { width: 1440, height: 900 };
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(`${url}${address}?t=${from}`);
  await page.waitForFunction(() => window.__ready, null, { timeout: 20000 });
  const box = await page.locator('[data-stage-box]').boundingBox();
  const x = Math.max(0, Math.floor(box.x - 16)), y = Math.max(0, Math.floor(box.y - 16));
  const right = Math.min(viewport.width, Math.ceil(box.x + box.width + 16));
  const bottom = Math.min(viewport.height, Math.ceil(box.y + box.height + 16));
  const clip = { x, y, width: right - x, height: bottom - y }, frames = [];
  for (let i = 0; from + i * step <= to + 1e-9; i++) {
    const t = from + i * step;
    await page.evaluate(time => window.__hero.seek(time), t);
    const png = (await page.screenshot({ clip })).toString('base64');
    frames.push(`<figure><img src="data:image/png;base64,${png}"><figcaption>${t.toFixed(3)}s · ${sceneAt(t).scene.key}</figcaption></figure>`);
  }
  if (errors.length) throw new Error([...new Set(errors)].join('\n'));
  const sheet = await browser.newPage({ viewport: { width: Math.ceil(8 * (clip.width / 2 + 16) + 32), height: 800 }, deviceScaleFactor: 1 });
  await sheet.setContent(`<!doctype html><meta charset="utf-8"><style>
body{margin:0;padding:16px;background:#151314;color:#F7F6F3;font:14px monospace}
main{display:grid;grid-template-columns:repeat(8,${clip.width / 2}px);gap:16px}
figure{margin:0}img{display:block;width:100%}figcaption{padding-top:6px}
</style><main>${frames.join('')}</main>`);
  await sheet.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
  await sheet.screenshot({ path: destination, fullPage: true });
  console.log(`film ${destination} (${frames.length} frames)`);
} finally {
  await browser?.close();
  server.close();
}
