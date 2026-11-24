// Recording/model checks only; no pixels, real hero-count measurement or browser timing.
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import * as data from '../data.mjs';
import * as art from '../art.mjs';
import * as trip from '../trip.mjs';
import * as depth from '../depth.mjs';

const source = readFileSync(new URL('../stars.mjs', import.meta.url), 'utf8');
const deps = { ...data, ...art, ...trip, ...depth };
const segment = (kind, t) => { const q = trip.SEQ.find(s => s.kind === kind); return trip.tripState(q.a + t * q.len); };
const hash = v => createHash('sha256').update(JSON.stringify(v)).digest('hex');
function api(text) {
  const records = [], ctx = { globalAlpha: 1, fillStyle: '', strokeStyle: '', lineWidth: 1 };
  for (const k of ['setTransform','clearRect','beginPath','moveTo','lineTo','quadraticCurveTo','fill','stroke','arc','fillRect']) ctx[k] = () => {};
  const cv = { getContext: () => ctx };
  text = text.replace(/^import .*;\r?$/gm, '').replace(/^export /gm, '')
    .replace(/function put\(x, y, rad, al, col[^)]*\) \{/, "$& record(SK.testStar, 'dot', x, y, rad, al, col);")
    .replace(/function putTail\(x, y, tail, al, col[^)]*\) \{/, "$& record(SK.testStar, 'tail', x, y, tail, al, col);")
    .replace(/for \(const s of SK.list\) \{\s+let x/, 'for (const s of SK.list) { SK.testStar = s; let x')
    .replace('// the traveller: one red star', 'SK.testStar = null; // the traveller: one red star');
  const obj = new Function(...Object.keys(deps), 'record', text + '\nreturn {SK,starsBuild,starsResize,starsJoin,starsTick,starsFrame,starsRushSources};')
    (...Object.values(deps), (s, ...args) => { if (args[4] > 1 / 128) records.push({ s, args }); });
  return { ...obj, cv, ctx, records };
}
const current = api(source);
// Independent pre-reservation trip assignment: every trail/sea destination has a star.
// This is an algorithm fixture, not a copy of commit 466d5ac or a pixel comparison.
const reference = api(source.replace('starsReserveSky(list, at);', '').replace('if (!SK.supplied && !opt.still) starsSupplySky();', ''));
const noSupply = api(source.replace('if (!SK.supplied && !opt.still) starsSupplySky();', ''));
globalThis.window = { devicePixelRatio: 2.6 };
function build(a, w, h, n) {
  a.starsJoin(null); a.starsBuild(a.cv); a.starsResize(w, h);
  if (n) a.starsJoin({ count: n, drawn(i, out) { assert.ok(i >= 0 && i < n, 'synthetic stars never read a hero identity'); out[0] = i * 83 % w; out[1] = i * 137 % h; return out; }, look: i => ({ size: 2, alpha: .8, colour: i % 20 ? data.C.paper : data.C.red }) });
  a.starsTick(0, segment('handoff', 0));
  a.starsFrame(0, segment('handoff', 0), [.5, .5]);
}
function draw(a, st, opt = {}) {
  a.records.length = 0; a.starsFrame(3, structuredClone(st), [.5, .5], opt);
  return a.records;
}
const serial = rows => rows.map(r => r.args).map(v => JSON.stringify(v, (_, x) => typeof x === 'number' ? +x.toFixed(8) : x)).sort();
let stills = 0, blasts = 0;
const blastHashes = {};
for (const [w, h, n] of [[1440,900,0],[412,730,0],[390,844,0],[360,640,0],[1440,900,1200],[412,730,278],[390,844,305],[360,640,213],[390,844,240]]) {
  trip.tripResize(w, h, w > 640 ? 120 : 96);
  for (const a of [current, reference, noSupply]) build(a, w, h, n);
  const mapStar = s => s && ['trail','sea'].includes(s.kind);
  const states = trip.SEQ.filter(q => ['overview','hold','leg','legX'].includes(q.kind)).map(q => trip.tripState(q.a + q.len / 2));
  states.push(segment('rush', 0));
  const overview = segment('overview', .5), F = data.FIND_PLAY.focus;
  const views = [...data.FINDS.map(f => w <= 640 && f.viewPhone || f.view).filter(Boolean), ...data.FIND_COPY.hoards.map(c => [c.x + F.chest[0], c.y + F.chest[1], F.chest[2]]), F.wide];
  for (const view of views) { const st = structuredClone(overview); trip.tripFocus(st, view, 1); states.push(st); }
  for (const st of states) {
    const a = serial(draw(current, st).filter(r => mapStar(r.s))), b = serial(draw(reference, st).filter(r => mapStar(r.s)));
    assert.deepEqual(a, b, `${w}x${h}/${n}: trail and sea draws match full assignment at P=${st.P}`); stills++;
  }
  const ids = current.SK.list.filter(s => !s.added && s.i >= 0).map(s => s.i);
  if (n) assert.equal(new Set([...ids, current.SK.trav.i]).size, n, 'every hero identity used exactly once');
  const added = current.SK.list.filter(s => s.added);
  assert.ok(added.every(s => s.kind === 'sky' && s.fade === !!n && !s.burstGather));
  // A conservative CSS-pixel bounding box per square dot, including antialias coverage.
  // This bounds new still-state sky ink only; it is not a raster comparison against 466d5ac.
  assert.ok(added.length * Math.ceil(data.STARS.supply.radius * 1.7725 + 2) ** 2 < w * h * .01, 'new sky support exceeds 1% of the viewport');
  assert.ok(data.STARS.supply.alpha >= data.STARS.fieldAlpha[0] && data.STARS.supply.alpha <= data.STARS.fieldAlpha[1]);
  for (const look of [[0,0],[-data.DEPTH.look,-data.DEPTH.look],[-data.DEPTH.look,data.DEPTH.look],[data.DEPTH.look,-data.DEPTH.look],[data.DEPTH.look,data.DEPTH.look]]) {
    const counts = Array(12).fill(0); current.starsRushSources(look).filter(row => row.gather).forEach(row => counts[row.sector]++);
    assert.ok(counts.every(count => count === (w > 640 ? 14 : 8)), 'pointer look must not thin a sector');
  }
  const settled = new Map(added.map(s => [s, [s.hx, s.hy]]));
  for (const t of [0,.69,.7,.75,.8,.9,1]) {
    draw(current, segment('handoff', t));
    for (const [s, at] of settled) assert.deepEqual([s.hx,s.hy], at, 'added stars fade in place');
    if (n && segment('handoff', t).handoffT <= .7) assert.equal(current.records.filter(r => r.s?.added).length, 0, 'new sky is absent before late hand-over');
  }
  const rush = segment('rush', .8), calls = serial(draw(current, rush));
  draw(current, segment('rush', 0)); assert.deepEqual(serial(draw(current, rush)), calls, 'Back and replay are identical');
  draw(current, segment('rush',0));const cachedPlan=current.SK.rushPlan;
  for(let i=0;i<30;i++)draw(current,segment('rush',0));
  assert.equal(current.SK.rushPlan,cachedPlan,'C15 X rest reuses the camera/size plan');
  // Once outside the first flash, all existing blast/remnant drawing primitives are identical.
  for (const t of [.05,.1,.3,.7,1]) {
    const at = serial(draw(current, segment('blast', t)));
    assert.deepEqual(at, serial(draw(noSupply, segment('blast', t))), 'blast/remnant changed outside the hidden first flash'); blasts++;
    blastHashes[`${w}x${h}/${n}/${t}`] = hash(at);
  }
  for (const st of [overview, segment('rest', 0)]) assert.deepEqual(serial(draw(current, st, { still: true })), serial(draw(reference, st, { still: true })), 'reduced motion excludes new sky');
  window.devicePixelRatio = 1; current.starsResize(w,h);
  // Hero sprite light conversion is DPR dependent; the added sky uses the same CSS radius/alpha.
  const supplyDraw = () => serial(draw(current, segment('rush', .6)).filter(r => r.s?.added));
  const one = supplyDraw(); window.devicePixelRatio = 2.6; current.starsResize(w,h); const two = supplyDraw();
  assert.deepEqual(two, one, 'added star/tail positions, width and alpha do not shrink at phone DPR');
  assert.equal(current.ctx.lineWidth, .7, 'tails use CSS-pixel width after the DPR transform');
  console.log(`ok: ${w}x${h}/${n || 'map'} ${states.length} trip/find stills; added ${added.length}; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6`);
}
// Recorded from the untouched, starting packed stars module before either pack was rebuilt.
assert.equal(hash(blastHashes), 'e8869ea46198b38fa9b82b73e3eb74a5dd399180ad685e9f2d149c5969274c0e', 'pre-WHIRL2 blast/remnant baseline');
for (const [w,h] of [[1440,900],[412,730],[390,844],[360,640]]) for (const seconds of [1,5,30,120]) {
  trip.tripResize(w,h,w>640?120:96); build(current,w,h,0);
  const identities = current.SK.list.filter(s => s.added); current.starsTick(seconds,segment('hero',0));
  draw(current,segment('rush',0));
  assert.deepEqual(current.SK.list.filter(s => s.added),identities,'no star is created or replaced after dwelling on the hero');
  const counts = Array(12).fill(0); current.starsRushSources().filter(row => row.gather).forEach(row => counts[row.sector]++);
  assert.ok(counts.every(count => count === (w>640?14:8)),'hero dwell must not thin a sector');
}
console.log('ok: all sector targets survive full pointer look and 16 hero-dwell cases (1/5/30/120 s); no late creation or replacement');
console.log(`ok: WHIRL2 ${stills} trail/sea still comparisons; ${blasts} unchanged blast/remnant primitive comparisons (not pixels); source ${hash(source)}`);
