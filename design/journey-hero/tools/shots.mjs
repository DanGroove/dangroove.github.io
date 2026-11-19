// Screenshots of a page at held moments. Needs Playwright (see browser.mjs).
//
//   node design/journey-hero/tools/shots.mjs <built|rough> <size> <folder> <seconds> [<seconds> ...]
//   node design/journey-hero/tools/shots.mjs built 1440x900 /tmp/shots 1.5 2.4 4.99 6 8.3 12
//
// A size is WIDTHxHEIGHT, with @2 on the end for a 2x screen. REDUCE=1 asks for reduced motion.
import fs from 'node:fs';
import path from 'node:path';
import { studio, seek } from './browser.mjs';

const [which, size, folder, ...times] = process.argv.slice(2);
if (!times.length) { console.log('usage: shots.mjs <built|rough> <size> <folder> <seconds> ...'); process.exit(1); }
fs.mkdirSync(folder, { recursive: true });
const st = await studio(), page = await st.open(which, size, { reducedMotion: !!process.env.REDUCE });
for (const t of times) {
  await seek(page, t);
  await page.screenshot({ path: path.join(folder, `${which}-${size.replace('@', '-at')}-${(+t).toFixed(2)}.png`) });
}
const L = await page.evaluate(() => window.__hero.layout());
console.log(`${which} ${size}: S ${L.S.toFixed(1)}, opening at ${L.zoom.toFixed(2)}, ${times.length} shots in ${folder}`);
if (st.errors.length) console.log('console:\n  ' + [...new Set(st.errors)].join('\n  '));
await st.close();
