// Node-only geometry checks. Importing depth.mjs must not need window or document.
import { DEPTH, C, NOVA } from '../data.mjs';
import { VIEW, SEQ, tripResize, tripState } from '../trip.mjs';
import { depthFactor, depthVisibility, depthCloudPass, depthDeckAlpha, depthPoint, NOVA_LIVE, novaFlare } from '../depth.mjs';
import { starsBuild, starsResize, starsJoin, starsTick, starsFrame } from '../stars.mjs';

const depthAssert = (condition, message) => { if (!condition) throw new Error(message); };
const depthNear = (a, b) => ['s', 'tx', 'ty'].every(k => Math.abs(a[k] - b[k]) <= 1e-6);
const depthHeights = Array.from({ length: 101 }, (_, i) => DEPTH.deck.a[0] + (DEPTH.deck.a[1] - DEPTH.deck.a[0]) * i / 100);
for (const [w, h, bar] of [[1440, 900, 120], [390, 844, 96]]) {
  tripResize(w, h, bar); VIEW.depth = 1;
  const whole = tripState(SEQ.find(s => s.kind === 'overview').a), push = SEQ.find(s => s.kind === 'pushIn');
  DEPTH.clouds.list.forEach((c, i) => depthAssert(depthCloudPass(whole, c[5]) === 1, `${w}: whole-map cloud ${i} already passing`));
  depthHeights.forEach(a => depthAssert(depthDeckAlpha(whole, a) === 0, `${w}: whole-map deck ${a} visible`));
  const checkPassed = P => {
    const st = tripState(P);
    depthAssert(depthFactor(st, DEPTH.deck.a[0]) >= DEPTH.deck.pass[1] && depthFactor(st, DEPTH.deck.a[1]) >= DEPTH.deck.pass[1], `${w}: deck interval not entirely past pass window at P=${P}`);
    DEPTH.clouds.list.forEach((c, i) => depthAssert(depthCloudPass(st, c[5]) === 0, `${w}: cloud ${i} remains at P=${P}`));
    depthHeights.forEach(a => depthAssert(depthVisibility(depthFactor(st, a), DEPTH.deck) === 0, `${w}: deck ${a} remains at P=${P}`));
  };
  checkPassed(push.a + push.len);
  for (const seg of SEQ.filter(s => ['hold', 'leg', 'legX'].includes(s.kind))) {
    checkPassed(seg.a); checkPassed(seg.a + seg.len);
    for (let P = Math.ceil(seg.a); P < seg.a + seg.len; P++) checkPassed(P);
  }
  console.log(`ok ${w}x${h}: whole-map clouds intact/deck hidden; all cloud/deck heights passed at dive end and every whole hold/leg/legX P`);
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
  for (const seg of legs) {
    for (let P = Math.ceil(seg.a); P < seg.a + seg.len; P++) depthAssert(tripState(P).cam.s === VIEW.sT, `${w}: depth-off scale at P=${P}`);
    depthAssert(tripState(seg.a).cam.s === VIEW.sT && tripState(seg.a + seg.len / 2).cam.s === VIEW.sT, `${w}: depth-off endpoint/midpoint`);
  }
  console.log(`ok ${w}x${h}: depth off gives VIEW.sT at every whole leg/legX P and at starts/midpoints`);
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
  NOVA_LIVE.time = 10; NOVA_LIVE.flareAt = 10;
  depthAssert(novaFlare() === 0, 'flare did not start'); NOVA_LIVE.time += NOVA.flare.time / 2;
  depthAssert(Math.abs(novaFlare() - .5) < 1e-9, 'flare midpoint'); NOVA_LIVE.flareAt = NOVA_LIVE.time;
  depthAssert(novaFlare() === 0, 'second flare did not restart'); NOVA_LIVE.time += NOVA.flare.time;
  depthAssert(Math.abs(novaFlare() - 1) < 1e-9, 'flare did not finish');
  console.log('ok: flare starts, reaches halfway, restarts on a second press and finishes');
} finally {
  if (depthTestWindow === undefined) delete globalThis.window; else globalThis.window = depthTestWindow;
  NOVA_LIVE.time = 0; NOVA_LIVE.flareAt = null;
}
