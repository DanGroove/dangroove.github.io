import { sceneEnvelope } from '../view.mjs';
// Round 8 (CORRECTIONS-8): N1 the name, F3 the plain floor, B1/B2 the star field, G1 the carried stack. Node only.
//   node design/journey-hero/take-2/tools/round8-checks.mjs [--controls]
// Each part reads the real modules; the negative controls edit one exact site in memory and must fail at their gate.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { corners } from '../kit.mjs';

const TAKE = new URL('../', import.meta.url);
// Source mutations match lines, irrespective of this checkout's CRLF/LF convention.
const read = name => fs.readFileSync(new URL(name, TAKE), 'utf8').replace(/\r\n/g, '\n');
async function load(name, source = read(name)) {
  const url = new URL(name, TAKE);
  const fixed = source.replace(/from (['"])(\.{1,2}\/[^'"]+)\1/g, (_all, _quote, ref) => `from '${new URL(ref, url).href}'`);
  return import('data:text/javascript;base64,' + Buffer.from(fixed).toString('base64'));
}
const near = (a, b, message, e = 1e-9) => assert.ok(Math.abs(a - b) <= e, `${message}: ${a} != ${b}`);

// ---- G1: while a drag carries pieces, nothing it passes over moves.
export async function checkCarried(source = read('stage.mjs')) {
  const M = await load('stage.mjs', source), { SHOW, SCRIPTS, LOOP, frameAt, carriedStack } = M;
  const starts = SHOW.map((_, i) => SHOW.slice(0, i).reduce((n, s) => n + s.len, 0));
  let samples = 0, carriedFrames = 0, drags = 0;
  const per = {};
  for (const [i, scene] of SHOW.entries()) for (const a of SCRIPTS[scene.key].actions) {
    // Every drag, and every action that carries pieces (Figma's copies), sampled every 0.01 s through its span.
    const times = [];
    for (let at = a.start; at < a.end; at += 0.01) times.push(starts[i] + at);
    const carries = a.kind === 'drag' || times.some(t => carriedStack(frameAt(t)).length);
    if (!carries) continue;
    drags++;
    for (const t of times) {
      const P = frameAt(t), carried = carriedStack(P), rest = P.filter(pc => !carried.includes(pc));
      const Q = frameAt(t, { withoutCarried: true });
      assert.equal(rest.length, Q.length, `G1 carried: ${scene.key}/${a.id} at ${t.toFixed(3)}: piece count`);
      rest.forEach((pc, k) => {
        for (let axis = 0; axis < 3; axis++) if (Math.abs(pc.p[axis] - Q[k].p[axis]) > 1e-12) throw new Error(`G1 carried: ${scene.key}/${a.id} at ${t.toFixed(3)} s: piece ${P.indexOf(pc)} (${pc.art || pc.tone}) moves by ${(pc.p[axis] - Q[k].p[axis]).toFixed(5)} on axis ${axis} because of the carried stack`);
      });
      samples++;
      if (carried.length) {
        carriedFrames++; per[scene.key + '/' + a.id] = (per[scene.key + '/' + a.id] || 0) + 1;
        // Visual order: the cursor stays in front of every carried picture.
        const cursor = carried.find(pc => pc.art === 'cursor');
        for (const pc of carried) if (pc !== cursor && pc.where !== 'floor') assert.ok(cursor.p[2] - cursor.s[2] > pc.p[2] + pc.s[2], `G1 order: ${scene.key}/${a.id} at ${t.toFixed(3)}: cursor behind its carried picture`);
      }
    }
  }
  assert.ok(Math.abs(LOOP - 101.49089) < 1e-4, 'G1: LOOP moved ' + LOOP);   // CORRECTIONS-17 F2 timing; 97.89089 in the first build, 97.69089 in round 15.
  return { drags, samples, carriedFrames, per, loop: LOOP };
}

// ---- N1: the name, as a pure model, against title.js's own numbers; and the player's gate.
export async function checkName(source = read('name-react.mjs'), playerSource = read('play.mjs')) {
  const N = await load('name-react.mjs', source), { NAME, openTarget, stepOpen, circleRadius, restHeight, knockDelays, stepLetter, nameLive } = N;
  const title = fs.readFileSync(new URL('../../../public/holding/title.js', TAKE), 'utf8');
  const constant = name => +title.match(new RegExp(`const ${name} = ([\\d.]+);`))[1];
  for (const [key, name] of [['radius', 'RADIUS'], ['near', 'NEAR'], ['hop', 'HOP'], ['rise', 'RISE'], ['feel', 'FEEL']]) near(NAME[key], constant(name), `N1 numbers: ${key} differs from title.js`);
  for (const [key, text] of [['wave', '/ em) * 55'], ['open', 'dt * 9'], ['spring', '* 240'], ['damp', 'l.vy * 12'], ['kick', 'HOP * 26']]) assert.ok(title.includes(text) && text.includes(String(NAME[key])), `N1 numbers: ${key} differs from title.js`);
  assert.equal(NAME.red, '#F0484F', 'N1 red');
  // The circle: target openness and steady radius as the pointer nears the box (em 100 px, box 0..400 x 0..200).
  const em = 100, box = { left: 0, right: 400, top: 0, bottom: 200 }, circle = [];
  for (const gap of [1.5, 1.2, 0.9, 0.6, 0.3, 0, -0.5]) {
    const want = openTarget(400 + gap * em, 100, box, em), f = Math.max(0, 1 - Math.max(0, gap) / 1.2);
    near(want, f * f * (3 - 2 * f), `N1 circle: openness ${gap} em from the box`);
    let open = 0; const seen = [];
    for (let k = 0; k < 240; k++) { open = stepOpen(open, want, 1 / 60); seen.push(open); }
    assert.ok(seen.every((v, k) => v <= want + 1e-12 && (k === 0 || v >= seen[k - 1] - 1e-15)), `N1 circle: the opening overshoots at ${gap} em`);
    near(circleRadius(open, em), 0.95 * em * want, `N1 circle: radius ${gap} em from the box`, 1e-6);
    circle.push([gap, +circleRadius(open, em).toFixed(2)]);
  }
  // Rest heights against distance: 0.07 em under the pointer, nothing from 1.3 em, vertical distance counts 1.4 times.
  const rests = [];
  for (const d of [0, 0.26, 0.65, 1.04, 1.3, 2]) {
    const g = Math.max(0, 1 - d / 1.3), expected = 0.07 * g * g * (3 - 2 * g);
    near(restHeight(d * em, 0, em), expected, `N1 lift: rest height ${d} em away`);
    near(restHeight(0, d * em / 1.4, em), expected, `N1 lift: vertical distance ${d} em`);
    rests.push([d, +expected.toFixed(4)]);
  }
  // A knock's wave: 55 ms per em of horizontal distance from where it landed; the letter jumps and drops back.
  const delays = knockDelays(250, [50, 150, 250, 350, 550], em);
  [110, 55, 0, 55, 165].forEach((ms, k) => near(delays[k], ms, `N1 knock: wave delay of letter ${k}`));
  const letter = { y: 0, vy: 0, kick: 10 }, path = [];
  for (let k = 0; k < 120; k++) { stepLetter(letter, 0, 1 / 60, 10 + k * 1000 / 60); path.push(letter.y); }
  const peak = Math.max(...path);
  assert.ok(peak > 0.05 && peak < 0.16 && Math.abs(path.at(-1)) < 0.002, `N1 knock: the letter does not jump and settle (peak ${peak}, end ${path.at(-1)})`);
  // Off during the entrance (playing or held) and with reduced motion.
  assert.equal(nameLive({ ready: true, entering: 0.6, reduced: false }), false, 'N1 gate: live during the entrance');
  assert.equal(nameLive({ ready: true, entering: null, reduced: true }), false, 'N1 gate: live with reduced motion');
  assert.equal(nameLive({ ready: true, entering: null, reduced: false }), true, 'N1 gate: not live after the entrance');
  const p = await runPlayer(playerSource);
  assert.equal(p.live.at(-1), false, 'N1 player: live at the first frame of the entrance');
  p.run(4.55); assert.equal(p.live.at(-1), false, 'N1 player: live during the entrance');
  p.run(0.1); assert.equal(p.live.at(-1), true, 'N1 player: not live after the entrance');
  p.win.__hero.entrance(0.8); assert.equal(p.live.at(-1), false, 'N1 player: live during a held entrance');
  p.win.__hero.entrance(null); assert.equal(p.live.at(-1), true, 'N1 player: not live after the hold');
  p.media.matches = true; p.media.change(); assert.equal(p.live.at(-1), false, 'N1 player: live with reduced motion');
  // The stage's click: a hold's release (swallowed) does not change the craft; a click does.
  const q = await runPlayer(playerSource), craft = () => q.win.__hero.t;
  q.run(2); q.swallow = true; const before = craft(); q.stage.events.click(); near(craft(), before, 'B2 click: a long hold changed the craft', 0.2);
  q.swallow = false; q.stage.events.click(); assert.ok(Math.abs(craft() - before) > 1, 'B2 click: a short click did not change the craft');
  return { circle, rests, delays };
}

// The real player, with DOM/GL stand-ins (as in entrance-checks.mjs), recording the name's live state.
async function runPlayer(playerSource) {
  const E = await load('entrance.mjs'), M = await import(new URL('stage.mjs', TAKE).href), engine = await import(new URL('../../../public/journey/hero/engine.mjs', TAKE).href), kit = await import(new URL('kit.mjs', TAKE).href);
  const node = rect => ({ events: {}, attributes: {}, textContent: '', style: {}, classList: { remove() {} }, rect, getBoundingClientRect() { return this.rect; }, addEventListener(name, f) { this.events[name] = f; }, setAttribute(name, value) { this.attributes[name] = value; }, removeAttribute(name) { delete this.attributes[name]; } });
  const hero = node({ left: 0, top: 0, width: 1440, height: 900 }), stage = node({ left: 760, top: 80, width: 600, height: 700 }), pause = node(), crafts = [0, 1, 2, 3].map(() => node());
  hero.querySelector = s => s === '[data-stage-box]' ? stage : s === '[data-pause]' ? pause : node();
  hero.querySelectorAll = () => crafts;
  const media = { matches: false, addEventListener(_name, f) { this.change = f; } }, win = {}, live = [];
  let tick = null, now = 0;
  const observer = class { observe() {} };
  const player = playerSource.replace(/^import\s+.*?;\s*$/gm, '');
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const out = { win, live, media, stage, swallow: false };
  await new AsyncFunction('env', `const { sceneEnvelope, exitBursts, popBursts, sparkFrame, kickExportBursts, location, document, window, matchMedia, createRenderer, makeCamera, dot, corners, makeAtlas, fontsReady, SHOW, LOOP, SCENES, BLOCK, POOL, sceneAt, frameAt, calloutsAt, createCallouts, createPageLayout, createNameReact, createStars, starReach, createCraftWipe, ENTRANCE, entranceAt, screenPlane, floorReach, liftPieces, settleView, createEntranceView, loaderAt, createLoaderView, performance, devicePixelRatio, requestAnimationFrame, cancelAnimationFrame, IntersectionObserver, ResizeObserver } = env;\n${player}`)({
    sceneEnvelope, exitBursts: () => [], popBursts: () => [], sparkFrame: () => null, kickExportBursts() {}, location: { search: '' }, document: { querySelector: () => hero, fonts: { ready: Promise.resolve(), addEventListener() {} }, hidden: false, addEventListener() {} }, window: win, matchMedia: () => media,
    createRenderer: () => ({ setAtlas() {}, draw() {} }), makeCamera: engine.makeCamera, dot: engine.dot, corners: kit.corners, makeAtlas: () => ({}), fontsReady: async () => {},
    SHOW: M.SHOW, LOOP: M.LOOP, SCENES: M.SCENES, BLOCK: M.BLOCK, POOL: M.POOL, sceneAt: M.sceneAt, frameAt: M.frameAt, calloutsAt: M.calloutsAt, createCallouts: () => ({ measure() {}, draw() {}, fit: v => v, layout: [] }),
    createPageLayout: () => ({ measure() {}, cover() {}, get metrics() { return { h: hero.rect, b: stage.rect, nameLines: [] }; }, view(need, cam, dpr) { const h = hero.rect, b = stage.rect, S = Math.min(b.width / need.w, b.height / need.h); return { W: h.width, H: h.height, S, cx: b.left + b.width / 2 - S * need.x, cy: b.top + b.height / 2 + S * need.y, cam, dpr }; } }),
    createNameReact: () => ({ measure() {}, setLive(on) { live.push(!!on); return !!on; }, live: false, open: 0, letters: [] }),
    createCraftWipe: () => ({ measure() {}, follow() {}, hold: () => null, state: null }),
    createStars: () => ({ measure() {}, frame: () => null, after() {}, swallowClick: () => out.swallow, field: null }), starReach: E.starReach || (() => null),
    ENTRANCE: E.ENTRANCE, entranceAt: E.entranceAt, screenPlane: E.screenPlane, floorReach: E.floorReach, liftPieces: E.liftPieces, settleView: E.settleView, loaderAt: E.loaderAt, createLoaderView: E.createLoaderView, performance: { now: () => now },
    createEntranceView: () => ({ measure() {}, apply() {}, clear() {}, lines: 3 }),
    devicePixelRatio: 1, requestAnimationFrame: f => { tick = f; return 1; }, cancelAnimationFrame() {}, IntersectionObserver: observer, ResizeObserver: observer,
  });
  out.run = seconds => { const until = now + seconds * 1000; while (now < until - 1e-8) { now = Math.min(until, now + 50); tick?.(now); } };
  tick?.(now);
  out.run(4.96);
  return out;
}

// ---- B1 and B2: the star field's model, simulation and controller.
function stub(reducedMotion = false) {
  const handlers = {}, add = target => (name, f) => { (handlers[target + name] ||= []).push(f); };
  const win = { scrollY: 0, addEventListener: add('win:'), performance: { now: () => 0 } };
  const hero = { addEventListener: add('hero:'), ownerDocument: { addEventListener: add('doc:') } };
  const reduced = { matches: reducedMotion, addEventListener() {} };
  const fire = (name, e) => (handlers[name] || []).forEach(f => f(e));
  return { win, hero, reduced, fire };
}
export async function checkStars(source = read('stars.mjs'), entranceSource = read('entrance.mjs'), rendererSource = read('sq.mjs')) {
  const M = await load('stars.mjs', source), E = await load('entrance.mjs', entranceSource);
  const { STARS, parallaxOffset, pointerFraction, follow, createField, starCount, starOn, starReach, captureRadius, blastImpulse, scrollOffset, createStars, orbitRadius } = M;
  const report = {};
  // Look: about 1,200 stars at 1440 x 900, scaled with the area; sizes, mixes and 3 % red.
  const F = createField(1440, 900);
  assert.equal(F.stars.length, 1200, 'B1 look: star count at 1440 x 900');
  assert.equal(starCount(720, 900), 600, 'B1 look: count scales with area');
  const reds = F.stars.filter(s => s.red).length / F.stars.length;
  assert.ok(reds > 0.02 && reds < 0.04, 'B1 look: red share ' + reds);
  assert.ok(F.stars.every(s => s.size >= 0.6 - 1e-9 && s.size <= 2.2 + 1e-9 && s.mix >= 0.12 - 1e-9 && s.mix <= 0.55 + 1e-9 && s.m >= 0.6 && s.m <= 1.6), 'B1 look: size, mix or mass out of range');
  report.count = F.stars.length; report.red = +(reds * 100).toFixed(1);
  // Parallax for set pointer positions and depths.
  const parallax = [];
  for (const [x, y] of [[0, 0], [720, 450], [1440, 900], [1080, 225]]) for (const d of [0, 0.5, 1]) {
    const f = pointerFraction(x, y, 1440, 900), o = parallaxOffset(f, d), k = 28 * (0.12 + 0.88 * d * d);
    near(o[0], -(x / 1440 - 0.5) * k, `B1 parallax: x at (${x}, ${y}) depth ${d}`); near(o[1], -(y / 900 - 0.5) * k, `B1 parallax: y at (${x}, ${y}) depth ${d}`);
    parallax.push([x, y, d, +o[0].toFixed(3), +o[1].toFixed(3)]);
  }
  near(parallaxOffset([0.5, 0.5], 1)[0], -14, 'B1 parallax: nearest star at the corner');
  near(scrollOffset(100, 1), -12, 'B1 scroll: nearest star'); near(scrollOffset(100, 0), 0, 'B1 scroll: farthest star');
  report.parallax = parallax;
  // The follow: critically damped, time constant 0.3 s, no overshoot.
  let x = 0, v = 0; const trace = [];
  for (let k = 0; k < 240; k++) { [x, v] = follow(x, v, 0.5, 1 / 60); trace.push(x); }
  assert.ok(trace.every((n, k) => n <= 0.5 + 1e-12 && (k === 0 || n >= trace[k - 1] - 1e-15)), 'B1 follow: overshoots or turns back');
  near(trace[17], 0.5 * (1 - 2 * Math.exp(-1)), 'B1 follow: not critically damped at 0.3 s', 1e-9);
  report.follow = { at03: +trace[17].toFixed(4), at1: +trace[59].toFixed(4) };
  // Stirring: a still pointer moves nothing; a sweep moves only stars near its path, along it; they coast home monotonically.
  const still = createField(1440, 900);
  assert.equal(still.push([700, 400], [700, 400], 1 / 60), 0, 'B1 stir: a still pointer pushes');
  for (let k = 0; k < 60; k++) still.step(1 / 60);
  assert.ok(Array.from(still.offsets).every(n => n === 0), 'B1 stir: a still pointer moved a star');
  const sweep = createField(1440, 900), a = [300, 450], b = [1100, 450];
  const steps = 40, home = sweep.stars.map((s, i) => sweep.position(i));
  for (let k = 0; k < steps; k++) { sweep.push([a[0] + (b[0] - a[0]) * k / steps, 450], [a[0] + (b[0] - a[0]) * (k + 1) / steps, 450], 1 / 60); sweep.step(1 / 60); }
  const moved = sweep.stars.map((_, i) => i).filter(i => sweep.offsets[2 * i] || sweep.offsets[2 * i + 1]);
  assert.ok(moved.length > 20, 'B1 stir: the sweep moved too few stars ' + moved.length);
  for (const i of moved) {
    const [hx, hy] = home[i], r = Math.min(...[0, 1].map(() => (hx >= a[0] - 60 && hx <= b[0] + 60) ? Math.abs(hy - 450) : Infinity));
    assert.ok(r < 60 + STARS.push.max, `B1 stir: star ${i} far from the path moved`);
    assert.ok(sweep.offsets[2 * i] > 0 && Math.abs(sweep.offsets[2 * i + 1]) < 1e-6 * Math.abs(sweep.offsets[2 * i]) + 1e-9, `B1 stir: star ${i} not moved along the path`);
  }
  const histories = new Map(moved.map(i => [i, []]));
  for (let k = 0; k < 60 * 20; k++) { sweep.step(1 / 60); for (const i of moved) histories.get(i).push(sweep.offsets[2 * i]); }
  let largest = 0;
  for (const [i, h] of histories) {
    const peak = h.indexOf(Math.max(...h)); largest = Math.max(largest, ...h);
    for (let k = peak + 1; k < h.length; k++) assert.ok(h[k] <= h[k - 1] + 1e-9 && h[k] >= 0, `B1 coast: star ${i} does not return home monotonically`);
    assert.equal(h.at(-1), 0, `B1 coast: star ${i} did not settle home`);
  }
  assert.ok(largest < 40, 'B1 coast: an offset reached ' + largest);
  assert.equal(sweep.awake, false, 'B1 coast: the field does not sleep');
  // Two stars of different mass in the same sweep end up different.
  const pair = createField(1440, 900);
  const i1 = pair.stars.findIndex(s => s.m < 0.8), i2 = pair.stars.findIndex(s => s.m > 1.4);
  pair.stars[i1].x = pair.stars[i2].x = 700; pair.stars[i1].y = pair.stars[i2].y = 450;
  for (let k = 0; k < 10; k++) { pair.push([600 + 20 * k, 450], [620 + 20 * k, 450], 1 / 60); pair.step(1 / 60); }
  assert.ok(Math.abs(pair.offsets[2 * i1] - pair.offsets[2 * i2]) > 1, 'B1 mass: two masses moved alike');
  report.stir = { moved: moved.length, largest: +largest.toFixed(2), masses: [+pair.offsets[2 * i1].toFixed(2), +pair.offsets[2 * i2].toFixed(2)] };
  // L4 drops the entrance's star ring; keep the independent whole-star ring helper and shader probes.
  assert.equal(E.ENTRANCE.stars, null, 'B1 entrance: L4 still runs star ring');
  for (const time of [0, 0.9, 1.79, 1.8, 2.8, 3.8]) assert.equal(E.entranceAt(time).stars, 1, 'B1 entrance: stars hidden after burst');
  const centre = [1060, 455]; let shown = -1;
  for (let n = 0; n <= 20; n++) {
    const reach = starReach(n / 20, centre, 1440, 900), on = F.stars.filter(s => starOn(s.x, s.y, centre, reach)).length;
    assert.ok(on >= shown, 'B1 rings helper: rings shrink'); shown = on;
  }
  assert.equal(shown, F.stars.length, 'B1 rings helper: not every star on at 1');
  assert.equal(F.stars.filter(s => starOn(s.x, s.y, centre, starReach(0, centre, 1440, 900))).length, 0, 'B1 rings helper: stars before ring');
  // Round 9 (L1) adds the pass in front for captured stars: one POINTS draw, called once behind and once more only while a star is out.
  // Round 10 (R1): the pass behind draws every star; the pass in front only stars that are out, at their weights.
  assert.ok(rendererSource.includes('bool on = distance(aHome, uRings.xy) <= uRings.z && (!front || (aFlag > 0.5 && aWeight > 0.0));') && rendererSource.split('gl.drawArrays(gl.POINTS, 0, st.count);').length === 2
    && rendererSource.includes('if (look.stars && look.stars.count) starPass(0);') && rendererSource.includes('if (look.stars && look.stars.count && look.stars.front > 0) starPass(1);'), 'B1 entrance: shader rule or one draw call missing');
  // The controller: reduced motion is static (no parallax, no stir, no hold); touch does not stir.
  for (const reducedMotion of [true, false]) {
    const t = stub(reducedMotion); let now = 0;
    const c = createStars(t.hero, { reduced: t.reduced, win: t.win, raf: () => 0, draw() {}, running: () => true, available: () => true, clock: () => now });
    c.measure({ left: 0, top: 0, width: 1440, height: 900 }, 0);
    const look = () => { now += 1 / 60; return c.frame(null, centre); };
    look();
    for (let k = 0; k <= 30; k++) { t.fire('win:pointermove', { pointerType: 'mouse', clientX: 300 + 25 * k, clientY: 450 }); look(); }
    t.win.scrollY = 200; t.fire('win:scroll', {});
    t.fire('hero:pointerdown', { pointerType: 'mouse', button: 0, clientX: 700, clientY: 450, target: { closest: s => s === '[data-stage-box]' ? {} : null } });
    for (let k = 0; k < 30; k++) look();
    const l = look(), moved2 = Array.from(c.field.offsets).some(n => n !== 0);
    if (reducedMotion) {
      assert.ok(l.par[0] === 0 && l.par[1] === 0 && l.scroll === 0 && !moved2 && c.holding === null, 'B1 reduced motion: the field moves');
    } else assert.ok(l.par[0] !== 0 && l.scroll === 200 && moved2 && c.holding > 0, 'B1 controller: a mouse does not move the field');
  }
  const touch = stub(); let tnow = 0;
  const tc = createStars(touch.hero, { reduced: touch.reduced, win: touch.win, raf: () => 0, draw() {}, running: () => true, available: () => true, clock: () => tnow });
  tc.measure({ left: 0, top: 0, width: 390, height: 844 }, 0); tc.frame(null, centre);
  for (let k = 0; k <= 20; k++) { touch.fire('win:pointermove', { pointerType: 'touch', clientX: 20 + 15 * k, clientY: 400 }); tnow += 1 / 60; tc.frame(null, centre); }
  touch.fire('hero:pointerdown', { pointerType: 'touch', button: 0, clientX: 200, clientY: 400, target: { closest: () => null } });
  touch.win.scrollY = 100; touch.fire('win:scroll', {}); tnow += 1 / 60;
  const tl = tc.frame(null, centre);
  assert.ok(Array.from(tc.field.offsets).every(n => n === 0) && tc.holding === null && tl.par[0] === 0 && tl.scroll === 100, 'B1 touch: a finger stirs or gathers, or scroll parallax is off');
  return report;
}

export async function checkHold(source = read('stars.mjs')) {
  const M = await load('stars.mjs', source), { STARS, createField, captureRadius, blastImpulse, orbitRadius, createStars } = M;
  const report = {};
  // The capture radius against hold time.
  for (const [held, r] of [[0, 80], [0.5, 132], [1.25, 210], [2.5, 340], [4, 340]]) near(captureRadius(held), r, `B2 capture: radius after ${held} s`);
  // The blast impulse scales with hold time.
  near(blastImpulse(0, 1), 300, 'B2 blast: impulse at 0 s'); near(blastImpulse(2.5, 1), 2000, 'B2 blast: impulse at 2.5 s'); near(blastImpulse(1.25, 0.5), 2300, 'B2 blast: impulse by mass');
  const runs = {};
  for (const held of [0.3, 2.5]) {
    const F = createField(1440, 900), P = [700, 450], hold = F.press(...P), dt = 1 / 60;
    const start = new Map(), minimum = new Map();
    for (let k = 0; k < Math.round(held / dt); k++) {
      F.gather(hold, P, dt); F.step(dt);
      for (const i of F.cluster.keys()) {
        const [x, y] = F.position(i), r = Math.hypot(x - P[0], y - P[1]);
        if (!start.has(i)) start.set(i, r);
        minimum.set(i, Math.min(minimum.get(i) ?? Infinity, r));
      }
    }
    const captured = F.cluster.size;
    // Captured stars never cross the pointer: each stays at least as far as the nearer of where it started and its smallest orbit.
    for (const [i, r] of minimum) assert.ok(r >= Math.min(start.get(i), orbitRadius(i, 0)) - 0.5, `B2 gather: star ${i} crosses the pointer (${r.toFixed(2)} px)`);
    if (held >= 2.5) {
      // Hold longer, still: settled, every captured star within its orbit radius plus 2 px.
      for (let k = 0; k < 120; k++) { F.gather(hold, P, dt); F.step(dt); }
      for (const i of F.cluster.keys()) { const [x, y] = F.position(i); assert.ok(Math.abs(Math.hypot(x - P[0], y - P[1]) - orbitRadius(i, F.cluster.size)) <= 2, `B2 gather: star ${i} not settled on its orbit`); }
    }
    const ids = [...F.cluster.keys()];
    F.blast(hold, P);
    const traces = new Map(ids.map(i => [i, []])), peakAt = new Map();
    let largest = 0;
    for (let k = 0; k < 60 * 25; k++) {
      F.step(dt);
      for (const i of ids) { const v = [F.offsets[2 * i], F.offsets[2 * i + 1]]; traces.get(i).push(v); largest = Math.max(largest, Math.hypot(...v)); }
    }
    assert.ok(largest < 0.45 * 1440, `B2 blast: an offset reached ${largest}`);
    for (const [i, h] of traces) {
      const lengths = h.map(v => Math.hypot(...v)), peak = lengths.indexOf(Math.max(...lengths)), dir = h[peak];
      for (let k = peak + 1; k < h.length; k++) assert.ok(lengths[k] <= lengths[k - 1] + 1e-3 && h[k][0] * dir[0] + h[k][1] * dir[1] >= -1e-9, `B2 blast: star ${i} does not return home monotonically`);
      assert.equal(lengths.at(-1), 0, `B2 blast: star ${i} did not settle`);
    }
    runs[held] = { captured, largest: +largest.toFixed(1), radius: captureRadius(held) };
  }
  assert.ok(runs[2.5].captured > 2 * runs[0.3].captured && runs[2.5].largest > runs[0.3].largest, 'B2 blast: a longer hold does not gather more or blast further');
  report.runs = runs;
  // The stage's click: a short still press is a click; a long or moving press is a hold, whose release keeps the craft.
  const outcomes = [];
  for (const [held, moved, click] of [[0.1, 0, true], [0.24, 5, true], [0.3, 0, false], [0.1, 8, false], [2.5, 0, false]]) {
    const t = stub(); let now = 0;
    const c = createStars(t.hero, { reduced: t.reduced, win: t.win, raf: () => 0, draw() {}, running: () => true, available: () => true, clock: () => now });
    c.measure({ left: 0, top: 0, width: 1440, height: 900 }, 0); c.frame(null, [0, 0]);
    t.fire('hero:pointerdown', { pointerType: 'mouse', button: 0, clientX: 900, clientY: 400, target: { closest: s => s === '[data-stage-box]' ? {} : null } });
    t.fire('win:pointermove', { pointerType: 'mouse', clientX: 900 + moved, clientY: 400 });
    now += held; c.frame(null, [0, 0]);
    t.fire('win:pointerup', { pointerType: 'mouse', clientX: 900 + moved, clientY: 400 });
    assert.equal(c.swallowClick(), !click, `B2 click: ${held} s, ${moved} px ${click ? 'is not a click' : 'a long hold changed the craft'}`);
    outcomes.push([held, moved, click ? 'next craft' : 'hold']);
  }
  report.clicks = outcomes;
  return report;
}

export const ROUND8_CONTROLS = [
  { id: 'N1', file: 'play.mjs', search: 'const nameOn = () => nameReact.setLive(ready && !loading && !intro && !held && !reduced.matches);', replacement: 'const nameOn = () => nameReact.setLive(ready && !reduced.matches);', gate: 'N1 player: live', run: s => checkName(undefined, s) },
  { id: 'B1', file: 'stars.mjs', search: 'export const depthWeight = d => 0.12 + 0.88 * d * d;', replacement: 'export const depthWeight = d => 0.12 + 0.88 * d;', gate: 'B1 parallax:', run: s => checkStars(s) },
  { id: 'B2', file: 'stars.mjs', search: 'swallow = holdStart.stage && !click;', replacement: 'swallow = false;', gate: 'B2 click:', run: s => checkHold(s) },
  { id: 'G1', file: 'stage.mjs', search: '    separateFaces(P.filter(pc => !carried.includes(pc)));\n', replacement: '    separateFaces(P);\n', gate: 'G1 carried:', run: s => checkCarried(s) },
];

export async function checkRound8Controls(only) {
  const out = [];
  for (const c of ROUND8_CONTROLS.filter(c => !only || c.id === only)) {
    const source = read(c.file);
    assert.equal(source.split(c.search).length - 1, 1, `round 8 control ${c.id} must match one site`);
    let message = '';
    try { await c.run(source.replace(c.search, c.replacement)); } catch (error) { message = error.message; }
    assert.ok(message.startsWith(c.gate), `round 8 control ${c.id} not caught at ${c.gate} (${message || 'passed'})`);
    out.push(`${c.id} caught: ${message.split('\n')[0]}`);
  }
  return out.join('; ');
}

export async function checkRound8() {
  const n1 = await checkName(), b1 = await checkStars(), b2 = await checkHold(), g1 = await checkCarried();
  return `N1 computed: numbers equal title.js's; circle radius (px at em 100) by gap ${n1.circle.map(([g, r]) => g + ' em ' + r).join(', ')}; rest height ${n1.rests.map(([d, h]) => d + ' em ' + h).join(', ')} em; knock delays ${n1.delays.join('/')} ms; off during the entrance, a held entrance and reduced motion.
F3 computed: no floor hover (round5 H7).
B1 computed: ${b1.count} stars at 1440 x 900 (${b1.red} % red); parallax at 12 pointer/depth samples; follow 0.3 s critically damped (${b1.follow.at03} of 0.5 at 0.3 s, no overshoot); a still pointer moves nothing; a sweep moved ${b1.stir.moved} stars along it, largest ${b1.stir.largest} px, all home monotonically; two masses ${b1.stir.masses.join(' vs ')} px; reduced motion static, touch scroll-only; L4 entrance ring dropped; independent ring helper still sampled 21 times.
B2 computed: capture 80/132/210/340/340 px at 0/0.5/1.25/2.5/4 s; 0.3 s hold ${b2.runs[0.3].captured} stars, blast largest ${b2.runs[0.3].largest} px; 2.5 s hold ${b2.runs[2.5].captured} stars, largest ${b2.runs[2.5].largest} px; none crosses the pointer, settled on orbit, all home monotonically; stage presses ${b2.clicks.map(c => c.join('/')).join(', ')}.
G1 computed: ${g1.drags} drags/carries every 0.01 s, ${g1.samples} samples, ${g1.carriedFrames} with a carried stack (${Object.keys(g1.per).length} actions); no non-carried piece moves; cursor in front of its carried picture; LOOP ${g1.loop.toFixed(3)} s.`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(await checkRound8());
  if (process.argv.includes('--controls')) console.log('Round 8 negative controls: ' + await checkRound8Controls());
}
