// Plays a page for real and uses it: timing, the craft buttons, pause, the stage, the keyboard, reduced motion.
// It prints what it sees for a person to read. Needs Playwright (see browser.mjs).
//
//   node design/journey-hero/tools/live.mjs <built|rough> [folder for screenshots]
import fs from 'node:fs';
import path from 'node:path';
import { studio } from './browser.mjs';

const which = process.argv[2] === 'rough' ? 'rough' : 'built', folder = process.argv[3];
if (folder) fs.mkdirSync(folder, { recursive: true });
const st = await studio();
const shot = (page, name) => folder ? page.screenshot({ path: path.join(folder, `live-${which}-${name}.png`) }) : null;
const now = page => page.evaluate(() => ({
  t: +window.__hero.t.toFixed(2),
  craft: [...document.querySelectorAll('[data-craft]')].findIndex(b => b.hasAttribute('aria-current')),
  entering: document.querySelector('[data-hero]').classList.contains('is-entering'),
  pause: document.querySelector('[data-pause]').textContent.trim(),
}));
const say = (what, v) => console.log(what.padEnd(34), JSON.stringify(v));

let page = await st.open(which, '1440x900', { hold: null });
await page.waitForTimeout(1000); say('1s in (opening)', await now(page));
await page.waitForTimeout(2500); say('3.5s in (deck, craft 0)', await now(page)); await shot(page, 'a');
say('gaps between frames, ms', await page.evaluate(() => new Promise(done => {
  const at = []; let n = 0;
  const tick = time => { at.push(time); if (++n < 240) requestAnimationFrame(tick); else { const d = at.slice(1).map((x, i) => x - at[i]).sort((a, b) => a - b); done({ median: +d[120].toFixed(1), p95: +d[227].toFixed(1), worst: +d[238].toFixed(1) }); } };
  requestAnimationFrame(tick);
})));
await page.click('[data-craft="3"]'); await page.waitForTimeout(200); say('UX/UI pressed, 0.2s on', await now(page));
await page.waitForTimeout(1300); say('1.5s on (lands at 12.00)', await now(page)); await shot(page, 'b');
await page.click('[data-craft="0"]'); await page.waitForTimeout(1500); say('Graphic design pressed', await now(page));
await page.click('[data-pause]'); const p1 = await now(page); await page.waitForTimeout(500); say('paused, and 0.5s later', [p1, await now(page)]);
await page.click('[data-craft="1"]'); await page.waitForTimeout(1500); say('Video pressed while paused', await now(page));
await page.click('[data-pause]'); await page.waitForTimeout(300); say('playing again', await now(page));
await page.mouse.click(1000, 450); await page.waitForTimeout(1500); say('stage clicked (next craft)', await now(page));
await page.mouse.move(1400, 100); await page.waitForTimeout(600); await shot(page, 'c-tilted');
const order = [];
for (let i = 0; i < 8; i++) { await page.keyboard.press('Tab'); order.push(await page.evaluate(() => (document.activeElement.getAttribute('aria-label') || document.activeElement.textContent).trim().replace(/\s+/g, ' ').slice(0, 24))); }
say('tab order', order); await shot(page, 'd-focus');
await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(300);
say('resized to a phone', await page.evaluate(() => { const L = window.__hero.layout(); return { vw: L.vw, vh: L.vh, S: +L.S.toFixed(1), sideways: document.documentElement.scrollWidth > innerWidth }; })); await shot(page, 'e-phone');
await page.close();

page = await st.open(which, '1440x900', { hold: null, reducedMotion: true });
await page.waitForTimeout(600); const r1 = await now(page); await page.waitForTimeout(600);
say('reduced motion, 0.6s and 1.2s in', [r1, await now(page)]); await shot(page, 'r0');
await page.click('[data-craft="2"]'); await page.waitForTimeout(100); say('reduced motion, Motion pressed', await now(page)); await shot(page, 'r2');
say('reduced motion, pause shown', await page.evaluate(() => getComputedStyle(document.querySelector('[data-pause]')).display !== 'none'));
await page.close();

console.log(st.errors.length ? 'console:\n  ' + [...new Set(st.errors)].join('\n  ') : 'nothing in the console');
await st.close();
