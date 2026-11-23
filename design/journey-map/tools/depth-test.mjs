// Node-only geometry checks. Importing depth.mjs must not need window or document.
import { DEPTH, C, NOVA, FINDS, FIND_COPY, FIND_PLAY, EXPLORE, CAMERA } from '../data.mjs';
import { VIEW, SEQ, tripResize, tripState, tripFocus } from '../trip.mjs';
import { depthFactor, depthVisibility, depthCloudPass, depthDeckAlpha, depthPoint, NOVA_LIVE, novaFlare, novaPress, novaPrune, novaShare, depthSeaFade } from '../depth.mjs';
import { starsBuild, starsResize, starsJoin, starsTick, starsFrame, novaGatherPoint } from '../stars.mjs';

const depthAssert = (condition, message) => { if (!condition) throw new Error(message); };
const depthNear = (a, b) => ['s', 'tx', 'ty'].every(k => Math.abs(a[k] - b[k]) <= 1e-6);
// Clouds come at two heights. High rows are passed on the way down and never seen during the trip.
// Low rows (last number under clouds.low) stay beside the chart for the whole trip, so they must lie outside its frame.
const depthHigh = DEPTH.clouds.list.filter(c => c[5] >= DEPTH.clouds.low), depthLow = DEPTH.clouds.list.filter(c => c[5] < DEPTH.clouds.low);
depthLow.forEach((c, i) => {
  const half = c[2] * Math.max(...DEPTH.drawings.clouds[c[3] - 1].join(' ').match(/-?[\d.]+/g).map(n => Math.abs(+n))), f = DEPTH.frame.outer, reach = half + DEPTH.clouds.sway[1];
  depthAssert(c[5] > 0 && (c[0] + reach < f[0] || c[0] - reach > f[2] || c[1] + half < f[1] || c[1] - half > f[3]), `low cloud ${i} can reach over the chart`);
});
const depthHeights = Array.from({ length: 101 }, (_, i) => DEPTH.deck.a[0] + (DEPTH.deck.a[1] - DEPTH.deck.a[0]) * i / 100);
for (const [w, h, bar] of [[1440, 900, 120], [390, 844, 96]]) {
  tripResize(w, h, bar); VIEW.depth = 1;
  const whole = tripState(SEQ.find(s => s.kind === 'overview').a), push = SEQ.find(s => s.kind === 'pushIn');
  DEPTH.clouds.list.forEach((c, i) => depthAssert(depthCloudPass(whole, c[5]) === 1, `${w}: whole-map cloud ${i} already passing`));
  depthLow.forEach((c, i) => depthAssert(depthCloudPass(tripState(SEQ.find(s => s.kind === 'hold').a + 60), c[5]) === 1, `${w}: low cloud ${i} fades at a stop`));
  depthHeights.forEach(a => depthAssert(depthDeckAlpha(whole, a) === 0, `${w}: whole-map deck ${a} visible`));
  const checkPassed = P => {
    const st = tripState(P);
    depthAssert(depthFactor(st, DEPTH.deck.a[0]) >= DEPTH.deck.pass[1] && depthFactor(st, DEPTH.deck.a[1]) >= DEPTH.deck.pass[1], `${w}: deck interval not entirely past pass window at P=${P}`);
    depthHigh.forEach((c, i) => depthAssert(depthCloudPass(st, c[5]) === 0, `${w}: cloud ${i} remains at P=${P}`));
    depthHeights.forEach(a => depthAssert(depthVisibility(depthFactor(st, a), DEPTH.deck) === 0, `${w}: deck ${a} remains at P=${P}`));
  };
  checkPassed(push.a + push.len);
  for (const seg of SEQ.filter(s => ['hold', 'leg', 'legX'].includes(s.kind))) {
    checkPassed(seg.a); checkPassed(seg.a + seg.len);
    for (let P = Math.ceil(seg.a); P < seg.a + seg.len; P++) checkPassed(P);
  }
  console.log(`ok ${w}x${h}: whole-map clouds intact/deck hidden; all high cloud/deck heights passed at dive end and every whole hold/leg/legX P; ${depthLow.length} low clouds stay, outside the frame`);
  const legs = SEQ.filter(s => ['leg', 'legX'].includes(s.kind));
  for (const seg of legs) {
    const mid = tripState(seg.a + seg.len / 2);
    depthAssert(depthVisibility(depthFactor(mid, 1), DEPTH.mist) > .5, `${w}: mist missing on leg ${seg.i}`);
    const hold = SEQ[SEQ.indexOf(seg) - 1], next = SEQ[SEQ.indexOf(seg) + 1];
    depthAssert(hold.kind === 'hold' && depthNear(tripState(hold.a + hold.len - 1e-9).cam, tripState(seg.a).cam), `${w}: hold/leg ${seg.i} camera discontinuity`);
    depthAssert(depthNear(tripState(seg.a + seg.len - 1e-9).cam, tripState(next.a).cam), `${w}: leg/next ${seg.i} camera discontinuity`);
  }
  const longest = legs.reduce((a, b) => a.len > b.len ? a : b), midScale = tripState(longest.a + longest.len / 2).cam.s;
  depthAssert(midScale < tripState(longest.a).cam.s && midScale < tripState(longest.a + longest.len).cam.s, `${w}: longest leg has no arc`);
  const layerGround = depthPoint(whole, [123, 456], 0, [26, -26]);
  depthAssert(Math.abs(layerGround.x - (123 * whole.cam.s + whole.cam.tx)) < 1e-9 && Math.abs(layerGround.y - (456 * whole.cam.s + whole.cam.ty)) < 1e-9, `${w}: pointer moves ground`);
  console.log(`ok ${w}x${h}: all 6 leg midpoints have mist visibility >0.5; camera boundaries agree within 1e-6; longest leg rises; pointer leaves ground fixed`);
  VIEW.depth = 0;
  for (const seg of legs.filter(seg => seg.kind !== 'legX')) {
    for (let P = Math.ceil(seg.a); P < seg.a + seg.len; P++) depthAssert(Math.abs(tripState(P).cam.s - VIEW.sT * CAMERA.holdZoom) < 1e-9, `${w}: depth-off scale at P=${P}`);
    depthAssert(Math.abs(tripState(seg.a).cam.s - VIEW.sT * CAMERA.holdZoom) < 1e-9 && Math.abs(tripState(seg.a + seg.len / 2).cam.s - VIEW.sT * CAMERA.holdZoom) < 1e-9, `${w}: depth-off endpoint/midpoint`);
  }
  console.log(`ok ${w}x${h}: D4 depth off keeps held scale continuously on ordinary glides; C1 X fit has its own camera`);
  VIEW.depth = 1;
  for (const P of [SEQ.find(s=>s.kind==='overview').a,SEQ.find(s=>s.kind==='hold').a+60]) {
    const base=tripState(P), chest=FIND_COPY.hoards[0], F=FIND_PLAY.focus, views=[...FINDS.flatMap(f=>f.view?[f.view,...(f.viewPhone?[f.viewPhone]:[])]:[]),[chest.x+F.chest[0],chest.y+F.chest[1],F.chest[2]],F.wide];
    for(const view of views)for(let i=0;i<=20;i++){const st=structuredClone(base);tripFocus(st,view,i/20);depthHeights.forEach(a=>depthAssert(depthDeckAlpha(st,a)<=depthDeckAlpha(base,a)+1e-12,'focus brightened deck'));}
    for(let i=0;i<=20;i++){const st=structuredClone(base);st.exploreK=1;st.cam.s=VIEW.s0+(EXPLORE.most*VIEW.sT-VIEW.s0)*i/20;depthHeights.forEach(a=>depthAssert(depthDeckAlpha(st,a)<=depthDeckAlpha(base,a)+1e-12,'explore brightened deck'));}
  }
  console.log('ok '+w+'x'+h+': every find/phone/chest/wide view and explore zoom, k in .05 steps, deck follows tripS');
}
VIEW.depth = 1;

// A recording canvas checks renderer commands without opening a browser or pretending to check pixels.
const depthTestWindow = globalThis.window;
try {
  globalThis.window = { devicePixelRatio: 1 };
  const records = [], ctx = { globalAlpha: 1, fillStyle: '',
    setTransform() {}, clearRect() { records.length = 0; }, beginPath() {}, moveTo() {}, lineTo() {}, quadraticCurveTo() {}, fill() {}, stroke() {},
    arc(x, y, r) { records.push([x, y, r, this.fillStyle, this.globalAlpha]); },
    fillRect(x, y, w, h) { records.push([x + w / 2, y + h / 2, w, this.fillStyle, this.globalAlpha]); },
  };
  const cv = { getContext: () => ctx }, snap = () => JSON.stringify(records.map(row => row.map(v => typeof v === 'number' ? +v.toFixed(6) : v)));
  for (const [w, h, n] of [[1440, 900, 1200], [390, 844, 240]]) {
    tripResize(w, h, w > 640 ? 120 : 96); starsBuild(cv); starsResize(w, h);
    let offset = 0;
    const src = { count: n, drawn(i, out) { out[0] = (i * 83 % w) + offset; out[1] = i * 137 % h; return out; }, look(i) { return { size: 2, alpha: .8, colour: i % 20 ? C.paper : C.red }; } };
    starsJoin(src);
    const atSwitch = tripState(SEQ.find(s => s.kind === 'handoff').a);
    starsTick(0, atSwitch);
    starsFrame(0, atSwitch, [.5, .5]);
    const positions = records.map(row => `${row[0]}/${row[1]}`).sort(), expected = Array.from({ length: n }, (_, i) => `${i * 83 % w}/${i * 137 % h}`).sort();
    depthAssert(JSON.stringify(positions) === JSON.stringify(expected), `${w}: switch lost, duplicated or moved a hero star`);
    const overview = tripState(SEQ.find(s => s.kind === 'overview').a);
    starsFrame(0, overview, [.5, .5]); const frozen = snap();
    offset = 1000; starsFrame(0, overview, [.5, .5]);
    depthAssert(snap() === frozen, `${w}: resting sky still reads moving hero positions`);
    if (n > 1000) {
      const box = DEPTH.frame.outer.map((v, i) => (i % 2 ? VIEW.oy : VIEW.ox) + v * VIEW.s0);
      depthAssert(records.some(row => row[0] < box[0] || row[0] > box[2] || row[1] < box[1] || row[1] > box[3]), 'desktop sky did not stay outside the map');
    }
    const rest = tripState(SEQ.find(s => s.kind === 'rest').a);
    starsFrame(0, rest, [.5, .5]); const before = snap(); starsTick(.25, rest); starsFrame(.25, rest, [.5, .5]);
    depthAssert(snap() !== before, `${w}: supernova canvas did not keep moving at rest`);
    starsFrame(0, rest, [.5, .5], { still: true }); const still = snap(); starsTick(.25, rest); starsFrame(0, rest, [.5, .5], { still: true });
    depthAssert(snap() === still, `${w}: reduced-motion renderer changed with its clocks`);
    console.log(`ok ${w}x${h}: recording canvas preserves all ${n} hero positions at switch; sky freezes; nova continues; still drawing ignores motion clocks`);
  }
  NOVA_LIVE.time = 10; NOVA_LIVE.flares = []; novaPress(); const first = NOVA_LIVE.flares[0];
  depthAssert(novaFlare(first) === 0, 'flare did not start'); NOVA_LIVE.time += NOVA.flare.time / 2; novaPress();
  const second = NOVA_LIVE.flares[1];
  depthAssert(NOVA_LIVE.flares.length === 2 && NOVA_LIVE.flares[0] === first && Math.abs(novaFlare(first) - .5) < 1e-9 && novaFlare(second) === 0, 'second press changed first flare');
  NOVA_LIVE.time = first.at + NOVA.flare.time; novaPrune();
  depthAssert(NOVA_LIVE.flares.length === 1 && NOVA_LIVE.flares[0] === second, 'first flare did not expire independently');
  while (NOVA_LIVE.flares.length < NOVA.flare.cap) novaPress();
  const serial = NOVA_LIVE.serial, flares = NOVA_LIVE.flares.slice();
  depthAssert(!novaPress() && NOVA_LIVE.serial === serial && flares.every((f, i) => f === NOVA_LIVE.flares[i]), 'cap must silently leave all live flares alone');
  NOVA_LIVE.time += NOVA.flare.time / 2;
  depthAssert(novaShare(NOVA.flare.core, NOVA.flare.coreMax) <= NOVA.flare.coreMax && novaShare(NOVA.flare.kick, NOVA.flare.kickMax) <= NOVA.flare.kickMax, 'additive flare shares exceed caps');
  NOVA_LIVE.time += NOVA.flare.time; novaPrune(); depthAssert(NOVA_LIVE.flares.length === 0, 'expired flares retained');
  console.log('ok: presses stack independently; first expires on time; cap rejects without mutation; additive shares clamp; expired flares leave the list');
  const centre = [700, 450], from = [100, 40], radius = 200, delta = 1e-6;
  for (let i = 0; i < 32; i++) {
    const angle = i * Math.PI / 16, start = novaGatherPoint(from, centre, angle, radius, 0), end = novaGatherPoint(from, centre, angle, radius, 1);
    depthAssert(Math.hypot(start[0] - from[0], start[1] - from[1]) < 1e-6 && Math.hypot(end[0] - centre[0], end[1] - centre[1]) < 1e-6, 'gather endpoints');
    const j = NOVA.gather.join, a = novaGatherPoint(from, centre, angle, radius, j - delta), b = novaGatherPoint(from, centre, angle, radius, j), c = novaGatherPoint(from, centre, angle, radius, j + delta);
    depthAssert(Math.hypot(...b.map((v, k) => (v - a[k]) / delta - (c[k] - v) / delta)) < .1, 'gather has a corner at ring');
  }
  const restored = tripState(SEQ.find(s => s.kind === 'rest').a); restored.exploreK = 1;
  depthAssert(depthSeaFade(restored) === 1, 'explore did not restore depth sea');
  console.log('ok: gather endpoints and continuous ring tangent for 32 arrival angles; explore restores depth fade');
} finally {
  if (depthTestWindow === undefined) delete globalThis.window; else globalThis.window = depthTestWindow;
  NOVA_LIVE.time = 0; NOVA_LIVE.flares = [];
}
