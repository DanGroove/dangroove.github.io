// Data sanity checks for the journey map. Run: node tools/check.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { STOPS, PALETTES, FINDS, FIND_COPY, COPY, ACTS, CRAFTS, MAP } from '../data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const errs = []; const ok = (c, m) => { if (!c) errs.push(m); };
const ym = v => v === 'now' ? Infinity : +v.slice(0, 4) * 12 + +v.slice(5, 7);

// six stops, spans in order
ok(STOPS.length === 6, 'there must be six stops');
ok(new Set(STOPS.map(s => s.id)).size === 6, 'stop ids must be unique');
let prevStart = -1;
STOPS.forEach(s => {
  ok(s.spans.length > 0, `${s.id}: no spans`);
  s.spans.forEach(([a, b], i) => { ok(ym(a) <= ym(b), `${s.id}: span ${i} ends before it starts`); if (i) ok(ym(a) >= ym(s.spans[i - 1][0]), `${s.id}: spans out of order`); });
  ok(ym(s.spans[0][0]) >= prevStart, `${s.id}: stops out of date order`); prevStart = ym(s.spans[0][0]);
  ok(['school', 'work'].includes(s.track), `${s.id}: bad track`);
  ok(s.crafts.every(c => CRAFTS.includes(c)), `${s.id}: unknown craft`);
  ok(PALETTES[s.palette], `${s.id}: no palette`);
  ok(s.copy.draft === true, `${s.id}: copy must be marked draft`);
  ok(s.w >= 0 && s.w < MAP.waypoints.length, `${s.id}: waypoint out of range`);
});
ok(STOPS.map(s => s.w).join() === '0,7,17,26,29,35' && MAP.xIdx === 37, 'stops must sit at W 0, 7, 17, 26, 29, 35 and the X at 37');

// palettes complete
const HEX = /^#[0-9A-Fa-f]{6}$/, PK = ['ground', 'text', 'sub', 'button', 'buttonText', 'pill', 'pillText', 'band', 'headline', 'mark', 'hairline'];
Object.entries(PALETTES).forEach(([k, p]) => { PK.forEach(f => ok(HEX.test(p[f] || ''), `palette ${k}: ${f} missing or not a colour`)); ok(/^assets\/logos\/\w+\.png$/.test(p.logo), `palette ${k}: logo`); ok(['ground', 'band'].includes(p.layout), `palette ${k}: layout`); });
ok(!/#0F151E|#1A1A1A|#000000/i.test(JSON.stringify(PALETTES.lennard)), 'lennard card must not use the old darks or black');

// eleven finds with unique ids and spoken labels
ok(FINDS.length === 11, 'there must be eleven finds');
ok(new Set(FINDS.map(f => f.id)).size === 11, 'find ids must be unique');
FINDS.forEach(f => ok(typeof f.label === 'string' && f.label.trim().length > 8, `find ${f.id}: no spoken label`));
ok(FINDS.filter(f => f.n).map(f => f.n).join() === '1,2,3,4,5,6', 'six main finds numbered 1 to 6');
ok(FIND_COPY.hoards.length === 5 && FIND_COPY.hoards.every(h => h.title && h.label), 'five hoards with titles and labels');
ok(FIND_COPY.serpentLines.length === 3 && FIND_COPY.beaconNotes.length === 4, 'three serpent lines and four beacon notes');

// ACTS adds up
const F = ACTS.footer;
ok(F.rush + F.blast + F.settle + F.rest === ACTS.footerTotal && ACTS.footerTotal === 320, 'footer acts must add up to 320');
ok(ACTS.hero === 100 && ACTS.handoff === 120 && ACTS.overview === 70 && ACTS.pushIn === 60 && ACTS.hold === 130 && ACTS.legPerUnit === .45, 'ACTS values differ from the brief');
const { SEQ, TOTAL_P } = await import('../trip.mjs');
ok(Math.abs(SEQ.reduce((a, s) => a + s.len, 0) - TOTAL_P) < 1e-9 && SEQ.filter(s => s.kind === 'hold').length === 6, 'act sequence does not add up');

// no empty copy
const walk = (v, path) => { if (typeof v === 'string') ok(v.trim().length > 0 || /caption$/.test(path), `empty copy at ${path}`); else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`)); else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, `${path}.${k}`)); };
walk(COPY, 'COPY'); walk(FIND_COPY, 'FIND_COPY'); STOPS.forEach(s => { walk(s.copy, `${s.id}.copy`); ok(!s.copy.piece || s.copy.caption, `${s.id}: piece without caption`); });

// module rules: unique top-level names, no default exports, no colour literals outside data.mjs
const mods = readdirSync(ROOT).filter(f => f.endsWith('.mjs')), names = {};
mods.forEach(f => {
  const src = readFileSync(join(ROOT, f), 'utf8');
  ok(!/export\s+default|import\s*\(|^\s*await\s/m.test(src), `${f}: default export, dynamic import or top-level await`);
  for (const m of src.matchAll(/^(?:export\s+)?(?:const|let|function|class)\s+([\w$]+)/gm)) { const n = m[1]; ok(!names[n], `top-level name ${n} in both ${names[n]} and ${f}`); names[n] = f; }
  if (f !== 'data.mjs') ok(!/['"`]#[0-9A-Fa-f]{3}(?:[0-9A-Fa-f]{3})?['"`]/.test(src), `${f}: colour literal outside data.mjs`);
});
ok(!/#[0-9A-Fa-f]{3,6}\b(?![\w-]*\))/.test(readFileSync(join(ROOT, 'map.css'), 'utf8').replace(/url\([^)]*\)/g, '')), 'map.css: colour literal');

if (errs.length) { console.error('FAIL\n' + errs.map(e => ' - ' + e).join('\n')); process.exit(1); }
console.log(`ok: 6 stops, ${Object.keys(PALETTES).length} palettes, 11 finds, acts total ${TOTAL_P.toFixed(1)} vh, ${mods.length} modules with unique top-level names`);
