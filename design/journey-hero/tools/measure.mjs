// Measures where a page puts the text and the art, at a list of screen sizes. Needs Playwright (see browser.mjs).
//
//   node design/journey-hero/tools/measure.mjs rough --write    save the rough cut's layouts to layouts.json (checks.mjs reads them)
//   node design/journey-hero/tools/measure.mjs built            measure the built page and say where it differs from layouts.json
//   node design/journey-hero/tools/measure.mjs built 844x390    the same at sizes of your own
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { studio, layoutOf, SIZES } from './browser.mjs';

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), 'layouts.json');
const args = process.argv.slice(2), which = args[0] === 'built' ? 'built' : 'rough', write = args.includes('--write');
const sizes = args.filter(a => /^\d+x\d+$/.test(a));
const saved = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
const round = (v, n = 4) => typeof v === 'number' ? +v.toFixed(n) : Array.isArray(v) ? v.map(x => round(x, n)) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, round(x, n)])) : v;

// the largest difference between two layouts, in px, and where it is
function differ(a, b) {
  let worst = { px: 0, at: '' };
  const see = (px, at) => { if (px > worst.px) worst = { px, at }; };
  for (const [name, r] of Object.entries(a.rects)) for (const side of ['left', 'top', 'right', 'bottom']) see(Math.abs(r[side] - b.rects[name][side]), `${name} ${side}`);
  for (const k of ['vw', 'vh', 'S', 'cx', 'cy']) see(Math.abs(a.L[k] - b.L[k]), `the stage (${k})`);
  see(Math.abs(a.L.zoom - b.L.zoom) * a.L.S * 8, 'the size of the opening');
  a.L.entrance.forEach((e, i) => {
    for (const end of ['from', 'to']) e[end].forEach((v, j) => see(Math.abs(v - b.L.entrance[i][end][j]) * a.L.S, `opening stripe ${i + 1}`));
    see(Math.abs(e.labelEnd - b.L.entrance[i].labelEnd) * a.L.S, `opening label ${i + 1}`);
  });
  if (a.late !== b.late) see(Infinity, 'whether the nav cuts in late');
  return worst;
}

const st = await studio(), out = [];
let off = 0;
for (const size of sizes.length ? sizes : SIZES) {
  const page = await st.open(which, size), now = { size, ...(await layoutOf(page)) };
  await page.close();
  out.push(round(now));
  const was = saved.find(s => s.size === size), d = was && differ(now, was);
  const verdict = !was ? 'not in layouts.json' : d.px < 0.5 ? 'same as saved' : `DIFFERS from saved by ${d.px.toFixed(1)} px at ${d.at}`;
  if (was && d.px >= 0.5) off++;
  console.log(`${size.padEnd(10)} S ${now.L.S.toFixed(1).padStart(5)}  opening at ${now.L.zoom.toFixed(2)}${now.late ? ', nav cuts in late' : ''}   ${verdict}`);
}
if (st.errors.length) console.log('\nconsole:\n  ' + [...new Set(st.errors)].join('\n  '));
await st.close();
if (write) { fs.writeFileSync(file, '[\n' + out.map(o => JSON.stringify(o)).join(',\n') + '\n]\n'); console.log(`\nsaved ${out.length} layouts`); }
else if (off) process.exitCode = 1;
