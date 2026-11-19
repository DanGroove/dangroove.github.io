// Geometry and clock checks. No browser, filesystem writes or dependencies.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { ART, ART_TEXT, BALL, BALL_FROM, BALL_VIA, ROWS, makeAtlas } from '../art.mjs';
import { HOME, EASE, dot, makeCamera, quatRotate } from '../../../../public/journey/hero/engine.mjs';
import { corners } from '../kit.mjs';
import { TONES } from '../sq.mjs';
import { SHOW, LOOP, SCENES, SCREEN, MAT, BLOCK, POOL, PACE, SCRIPTS, frameAt, sceneAt } from '../stage.mjs';
import { previewMarkup } from './preview.mjs';

let frames = 0, pieces = 0, largest = 0;
const errors = [];
function fail(time, message) {
  if (errors.length < 30) errors.push(`${time.toFixed(6)}s (${sceneAt(time).scene.key}): ${message}`);
}
function finite(value, name, time) {
  if (typeof value === 'number' && !Number.isFinite(value)) fail(time, `${name} is not finite`);
  else if (value && typeof value === 'object') {
    for (const [key, v] of Object.entries(value)) finite(v, `${name}.${key}`, time);
  }
}
function check(time) {
  const { scene, at } = sceneAt(time), list = frameAt(time);
  frames++; pieces += list.length; largest = Math.max(largest, list.length);
  if (list.filter(pc => pc.art === 'cursor').length !== 1) fail(time, 'expected exactly one cursor');
  list.forEach((pc, i) => {
    finite(pc, `piece ${i}`, time);
    for (const [key, length] of [['p', 3], ['q', 4], ['s', 3], ['e', 2]]) {
      if (!Array.isArray(pc[key]) || pc[key].length !== length) fail(time, `piece ${i}: invalid ${key}`);
    }
    if (pc.s.some(n => n < 0)) fail(time, `piece ${i}: negative size`);
    if (!Object.hasOwn(TONES, pc.tone)) fail(time, `piece ${i}: unknown tone ${pc.tone}`);
    if (pc.tones && (pc.tones.length !== 3 || pc.tones.some(t => !/^#[\da-f]{6}$/i.test(t)))) fail(time, `piece ${i}: invalid custom tones`);
    if (pc.art && !Object.hasOwn(ART, pc.art)) fail(time, `piece ${i}: unknown picture ${pc.art}`);
    if (pc.window) {
      const [l, t, r, b] = pc.window;
      if (!pc.art || pc.window.length !== 4 || l < 0 || t < 0 || r > 1 || b > 1 || l > r || t > b) fail(time, `piece ${i}: invalid picture window`);
    }
    if (pc.clip && pc.clip.length !== 4) fail(time, `piece ${i}: invalid clip plane`);
    if (pc.where === 'content' && !pc.clip) fail(time, `piece ${i}: content has no wipe plane`);
    if ('opacity' in pc || 'alpha' in pc) fail(time, `piece ${i}: transparency is not a motion tool`);
    if (pc.where === 'floor') {
      if (scene.key === 'ps' || scene.key === 'ai' || at < 0.1) fail(time, `piece ${i}: floor must be empty`);
      if (!pc.clip || pc.clip.some((n, j) => n !== [0, 0, 1, -MAT.z][j])) fail(time, `piece ${i}: floor slot plane changed`);
      const s = SCRIPTS[scene.key], exp = s?.actions.find(a => a.id === 'export');
      if (exp && at < exp.start) fail(time, `piece ${i}: floor before export`);
      if (pc.device !== undefined && list.clock !== null && list.clock !== undefined && Math.abs(pc.clock - list.clock) > 1e-8) fail(time, `piece ${i}: device and viewer clocks differ`);
    }
  });
  // Check actual face geometry, including plates made outside the painters and selection joins.
  for (const floor of [false, true]) {
    const axis = floor ? 1 : 2, across = floor ? 2 : 1, unit = floor ? 1 : 1.15;
    const faces = list.flatMap((pc, i) => {
      if ((pc.where === 'floor') !== floor || quatRotate(pc.q, [0, 0, 1])[axis] < 1 - 1e-9) return [];
      const points = corners(pc), x = points.map(p => p[0]), y = points.map(p => p[across]);
      return [{ i, pc, height: (pc.p[axis] + pc.s[2]) / unit, rect: [Math.min(...x), Math.min(...y), Math.max(...x), Math.max(...y)] }];
    });
    for (let i = 0; i < faces.length; i++) for (let j = 0; j < i; j++) {
      const a = faces[i], b = faces[j];
      const overlap = Math.min(a.rect[2], b.rect[2]) - Math.max(a.rect[0], b.rect[0]) > 1e-9 && Math.min(a.rect[3], b.rect[3]) - Math.max(a.rect[1], b.rect[1]) > 1e-9;
      if (overlap && Math.abs(a.height - b.height) < 0.0006 - 1e-10) fail(time, `${floor ? 'floor' : 'screen'} faces ${a.i}/${b.i} overlap with less than 0.0006 clearance`);
    }
    const painted = faces.filter(f => f.pc.paintLayer !== undefined && !f.pc.overlay).sort((a, b) => a.pc.paintLayer - b.pc.paintLayer);
    for (let i = 1; i < painted.length; i++) if (painted[i].height - painted[i - 1].height < 0.0008 - 1e-10) fail(time, 'painters did not share one increasing stack');
    const top = Math.max(-Infinity, ...faces.filter(f => !f.pc.overlay && (f.pc.art || f.pc.paintLayer !== undefined)).map(f => f.height));
    for (const f of faces.filter(f => f.pc.overlay)) if ((f.pc.p[axis] - f.pc.s[2]) / unit < top + 0.0008 - 1e-10) fail(time, 'an interaction mark is below a picture stack');
  }
}

let start = 0;
for (let i = 0; i < SHOW.length; i++) {
  const scene = SHOW[i];
  assert.equal(sceneAt(start).i, i, 'scene boundary');
  assert.equal(sceneAt(start + scene.len - 1e-8).i, i, 'scene end');
  assert.deepEqual(SCENES[i](), frameAt(start + scene.still), `${scene.key}: still differs`);
  for (let n = 0; n < Math.ceil(scene.len * 60); n++) check(start + n / 60);
  for (const at of [0, 0.05, 0.1, 0.5, scene.still, scene.len - 1e-8]) check(start + at);
  start += scene.len;
}
if (Object.keys(SCRIPTS).length === 6) assert.ok(LOOP / PACE >= 70 && LOOP / PACE <= 78, `loop is ${LOOP / PACE}s`);
assert.equal(sceneAt(LOOP).i, 0);
assert.equal(sceneAt(-0.01).scene.key, 'fig');
assert.deepEqual(frameAt(-0.01), frameAt(LOOP - 0.01));
assert.deepEqual(frameAt(0), frameAt(LOOP));
assert.throws(() => frameAt(NaN), TypeError);
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} differs from ${b}`);
const tip = list => {
  const pc = list.find(pc => pc.art === 'cursor');
  return [pc.p[0] - 0.46 * (0.5 - 10 / 96), pc.p[1] + 0.46 * (0.5 - 6 / 96)];
};
// The cursor must reach every action's start before pressing, then its end before releasing.
let sceneStart = 0;
for (const scene of SHOW) {
  const s = SCRIPTS[scene.key];
  if (s) {
    assert.ok(frameAt(sceneStart + s.first - 1e-6).every(pc => !pc.document), `${scene.key}: document starts populated`);
    let end = 0.8 * PACE;
    let typed = false;
    for (const a of s.actions) {
      near(a.approach, end); assert.ok(a.end > a.start);
      if (a.kind === 'type') {
        assert.ok((a.end - a.start) / PACE >= (typed ? 0.4 : 0.6) - 1e-9, `${scene.key}/${a.id}: typing is too fast`);
        typed = true;
      }
      const first = tip(frameAt(sceneStart + a.start + 1e-8));
      near(first[0], SCREEN.l + a.from[0] * 1.15); near(first[1], SCREEN.b + a.from[1] * 1.15);
      const last = tip(frameAt(sceneStart + a.end - 1e-8));
      near(last[0], SCREEN.l + a.to[0] * 1.15); near(last[1], SCREEN.b + a.to[1] * 1.15);
      end = a.end;
    }
    assert.ok(frameAt(sceneStart + actionStart(s, 'export') - 1e-6).every(pc => pc.where !== 'floor'), `${scene.key}: floor before export`);
  }
  sceneStart += scene.len;
}
function actionStart(s, id) { return s.actions.find(a => a.id === id).start; }
// The new slide law must leave the approved parked list in exactly its old place.
const rows = frameAt(SHOW.slice(0, 4).reduce((n, s) => n + s.len, 0) + (SCRIPTS.ae ? actionStart(SCRIPTS.ae, 'export') - 1e-6 : 4.4)).filter(pc => pc.where === 'content' && pc.p[0] > SCREEN.l + 1.33 * 1.15 && (pc.art === 'rowA' || pc.art === 'rowB'));
assert.equal(rows.length, 3);
ROWS.forEach(([x, y, w, h], i) => {
  near(rows[i].p[0], SCREEN.l + (1.33 + (x + w / 2) * 1.92 / 480) * 1.15);
  near(rows[i].p[1], SCREEN.b + (1.5 + 1.08 - (y + h / 2) * 1.08 / 270) * 1.15);
  assert.deepEqual(rows[i].window || [0, 0, 1, 1], [0, 0, 1, 1]);
});
// The comp and its thumbnail build together, without applying playback's reveal or row offsets.
const aeStart = SHOW.slice(0, 4).reduce((n, s) => n + s.len, 0), ae = SCRIPTS.ae;
const atAction = (s, id, f) => { const a = s.actions.find(a => a.id === id); return a.start + (a.end - a.start) * f; };
for (const [id, art] of [['make', 'wMake'], ['move', 'wMove']]) {
  for (const f of [0.5, 1]) {
    const words = frameAt(aeStart + atAction(ae, id, f) + (f === 1 ? 1e-7 : 0)).filter(pc => pc.art === art);
    assert.equal(words.length, 2, `${id}: word missing from comp or thumbnail`);
    for (const pc of words) if (f === 1) assert.deepEqual(pc.window || [0, 0, 1, 1], [0, 0, 1, 1]);
    else assert.ok(pc.window[2] > 0 && pc.window[2] < 1, `${id}: typing prefix missing`);
  }
}
const halfway = EASE.wipe(0.5);
for (const [id, f, pos] of [['ball', 1, BALL_FROM], ['path', 0.5, BALL_FROM.map((v, i) => (1 - halfway) ** 2 * v + 2 * (1 - halfway) * halfway * BALL_VIA[i] + halfway ** 2 * BALL[i])], ['path', 1, BALL]]) {
  const balls = frameAt(aeStart + atAction(ae, id, f) + (f === 1 ? 1e-7 : 0)).filter(pc => pc.art === 'redBall');
  assert.equal(balls.length, 2, `${id}: ball missing from comp or thumbnail`);
  for (const [i, rect] of [[0, [1.33, 1.5, 1.92, 1.08]], [1, [0.14, SCREEN.h / 1.15 - 0.44 - 0.1 - 0.5, 0.74, 0.416]]]) {
    near(balls[i].p[0], SCREEN.l + (rect[0] + pos[0] / 480 * rect[2]) * 1.15);
    near(balls[i].p[1], SCREEN.b + (rect[1] + (1 - pos[1] / 270) * rect[3]) * 1.15);
  }
}
const builtRows = frameAt(aeStart + atAction(ae, 'copies', 1) + 1e-7).filter(pc => pc.art === 'rowA' || pc.art === 'rowB');
assert.equal(builtRows.length, 6, 'constructed rows missing from comp or thumbnail');
assert.ok(builtRows.every(pc => !pc.window), 'constructed rows are revealed as if playing');
// Photoshop's heals cut on release, then completed edits replace their construction stack.
const ps = SCRIPTS.ps, photoArt = pc => pc.document && pc.p[0] < SCREEN.l + 3.8 * 1.15 && /^(?:photo|kPhoto)/.test(pc.art || '');
for (const [id, duration] of [['black', 0.5], ['white', 0.5], ['sky', 0.7], ['cone', 0.25], ['crane', 0.25]]) near((atAction(ps, id, 1) - atAction(ps, id, 0)) / PACE, duration);
near((SHOW[0].len - atAction(ps, 'export', 1)) / PACE, 0.3);
for (const id of ['cone', 'crane']) {
  const before = frameAt(atAction(ps, id, 1) - 1e-6).filter(photoArt);
  assert.ok(before.some(pc => pc.art === 'photoSky'), `${id}: distraction disappeared during scrub`);
}
const conePatch = frameAt(atAction(ps, 'cone', 1)).filter(photoArt).find(pc => pc.art === 'photoClean');
assert.ok(conePatch.window[0] * 526 < 28 && conePatch.window[1] * 360 < 245 && conePatch.window[2] * 526 > 104 && conePatch.window[3] * 360 > 293, 'cone patch misses barrier/posts');
for (const [id, art] of [['crane', 'photoClean'], ['grade', 'kPhoto']]) {
  const pictures = frameAt(atAction(ps, id, 1)).filter(photoArt);
  assert.equal(pictures.length, 1, `${id}: completed picture still has its construction layers`);
  assert.equal(pictures[0].art, art);
  assert.deepEqual(pictures[0].window || [0, 0, 1, 1], [0, 0, 1, 1]);
}
// The booklet strip is a reading pose, while the rest of InDesign stays at its still time.
for (const at of [-1, -0.7, 0, 0.3, 1, 1.4, 2, 2.76, 4]) {
  const list = SCENES[2]({ at });
  assert.ok(list.some(pc => pc.where === 'floor'));
  assert.ok(list.filter(pc => pc.where === 'floor').every(pc => pc.p[2] >= MAT.z));
}
assert.ok(SCREEN.w > 0);
const middle = dot(HOME.r, [SCREEN.l + SCREEN.w / 2, 0, SCREEN.z + SCREEN.t / 2]);
near(dot(HOME.r, [(BLOCK.x0 + BLOCK.x1) / 2, 0, (BLOCK.z0 + BLOCK.z1) / 2]), middle);
near(dot(HOME.r, [POOL.x, 0, POOL.z]), middle);
// Canvas stand-ins exercise all picture functions and atlas packing, without pretending to render pixels.
let matrix = [1, 0, 0, 1, 0, 0];
const stack = [];
const gradients = [];
const context = new Proxy({
  font: '400 10px sans-serif', letterSpacing: '0px', textAlign: 'left',
  getTransform: () => Object.fromEntries(['a', 'b', 'c', 'd', 'e', 'f'].map((k, i) => [k, matrix[i]])),
  save() { stack.push({ matrix: matrix.slice(), font: this.font, letterSpacing: this.letterSpacing, textAlign: this.textAlign }); },
  restore() { const s = stack.pop(); matrix = s.matrix; this.font = s.font; this.letterSpacing = s.letterSpacing; this.textAlign = s.textAlign; },
  translate(x, y) { matrix[4] += matrix[0] * x + matrix[2] * y; matrix[5] += matrix[1] * x + matrix[3] * y; },
  scale(x, y) { matrix[0] *= x; matrix[1] *= x; matrix[2] *= y; matrix[3] *= y; },
  rotate(a) { const [x, y, z, w] = matrix, c = Math.cos(a), s = Math.sin(a); matrix[0] = x * c + z * s; matrix[1] = y * c + w * s; matrix[2] = -x * s + z * c; matrix[3] = -y * s + w * c; },
  measureText(s) { const px = +(this.font.match(/([\d.]+)px/)?.[1] || 10); return { width: s.length * px * 0.55, actualBoundingBoxAscent: px * 0.8, actualBoundingBoxDescent: px * 0.2 }; },
  createLinearGradient() { const stops = []; gradients.push(stops); return { addColorStop(at, colour) { stops.push([at, colour]); } }; },
}, { get: (o, k) => k in o ? o[k] : () => {} });
globalThis.Path2D = class {};
globalThis.document = { createElement: () => ({ getContext: () => context }) };
const atlas = makeAtlas();
assert.ok(atlas.pages.length <= 6, 'atlas exceeds six pages');
assert.ok(atlas.pages.every(p => p.width <= 2048 && p.height <= 2048));
assert.ok(ART_TEXT.kMap.length > 10 && ART_TEXT.kLoc.length > 20, 'map lettering was not recorded');
const skyColours = key => { const first = gradients.length, art = ART[key]; art.draw(context, art.w, art.h); return gradients[first]; };
for (const key of ['photoRaw', 'photoHalf', 'photoLevels']) assert.deepEqual(skyColours(key), [[0, '#C1C2BF'], [1, '#C1C2BF']], `${key}: sky must stay flat grey`);
for (const key of ['photoSky', 'photoClean', 'kPhoto']) assert.deepEqual(skyColours(key), [[0, '#6E9CD6'], [1, '#D9E6F1']], `${key}: replaced sky must stay blue through the grade`);
// Revisit every action after atlas-time font measurement, including rotated map type and carets.
sceneStart = 0;
for (const scene of SHOW) {
  const s = SCRIPTS[scene.key];
  for (const a of s.actions) for (const f of [0, 0.25, 0.5, 0.75, 0.999999]) check(sceneStart + a.start + (a.end - a.start) * f);
  if (['pr', 'ae', 'fig'].includes(scene.key)) {
    const exp = s.actions.find(a => a.id === 'export'), land = exp.start + 0.55 * PACE;
    for (const f of [0.01, 0.2, 0.333333, 0.5, 0.7, 0.99, 1.2, 1.7, 1.99]) {
      const at = land + f * 1.6 * PACE, list = frameAt(sceneStart + at);
      near(list.clock, f % 1);
      assert.ok(list.some(pc => pc.device === 0));
      for (const pc of list.filter(pc => pc.device !== undefined)) near(pc.clock, list.clock);
    }
    const list = frameAt(sceneStart + exp.end + 0.01 * PACE);
    const bodies = [0, 1, 2].map(i => list.find(pc => pc.where === 'floor' && pc.device === i));
    assert.ok(bodies.every(Boolean), 'device row did not land');
    const footprint = bodies.flatMap(corners), xs = footprint.map(p => p[0]), zs = footprint.map(p => p[2]);
    near(dot(HOME.r, [(Math.min(...xs) + Math.max(...xs)) / 2, 0, (Math.min(...zs) + Math.max(...zs)) / 2]), middle);
    near(Math.min(...zs), MAT.z);
    assert.ok(list.some(pc => pc.where === 'content' && ['shotA', 'shotB', 'shotCfx', 'wMake', 'uiBoard0', 'uiBoard1', 'uiBoard2', 'uiBoard3'].includes(pc.art)), 'viewer is not playing with the devices');
  }
  sceneStart += scene.len;
}
// Changing PACE must stretch time alone, including the shell and every exported device clock.
const stageURL = new URL('../stage.mjs', import.meta.url);
const stretchedSource = fs.readFileSync(stageURL, 'utf8').replace('export const PACE = 1;', 'export const PACE = 2;').replace(/from (['"])(\.{1,2}\/[^'"]+)\1/g, (_all, _quote, ref) => `from '${new URL(ref, stageURL).href}'`);
const stretched = await import('data:text/javascript;base64,' + Buffer.from(stretchedSource).toString('base64'));
near(stretched.LOOP, LOOP * 2);
sceneStart = 0;
for (let i = 0; i < SHOW.length; i++) {
  near(stretched.SHOW[i].len, SHOW[i].len * 2);
  for (const f of [0.134, 0.3337, 0.7169, 0.981]) {
    const time = sceneStart + SHOW[i].len * f, normal = frameAt(time), slow = stretched.frameAt(time * 2);
    assert.equal(normal.length, slow.length, 'PACE changed the pieces');
    normal.forEach((pc, j) => {
      assert.equal(pc.art, slow[j].art);
      for (const field of ['p', 'q', 's', 'e']) pc[field].forEach((n, k) => near(n, slow[j][field][k]));
      if (pc.clock !== undefined) near(pc.clock, slow[j].clock);
    });
  }
  sceneStart += SHOW[i].len;
}
const readme = fs.readFileSync(new URL('../README.md', import.meta.url), 'utf8');
for (const scene of SHOW) for (const a of SCRIPTS[scene.key].actions) assert.ok(readme.includes(`| ${scene.key} | ${a.id} | ${a.kind} | ${(a.start / PACE).toFixed(3)} | ${(a.end / PACE).toFixed(3)} |`), `README action table is stale at ${scene.key}/${a.id}`);
// Exercise the real player with drawing and DOM stand-ins. This is a logic check, never a browser review.
const node = rect => ({
  events: {}, attributes: {}, textContent: '', classList: { remove() {} },
  getBoundingClientRect: () => rect,
  addEventListener(name, f) { this.events[name] = f; },
  setAttribute(name, value) { this.attributes[name] = value; },
  removeAttribute(name) { delete this.attributes[name]; },
});
const hero = node({ left: 0, top: 0, width: 1440, height: 900 }), stage = node({ left: 760, top: 80, width: 600, height: 700 }), pause = node(), crafts = [0, 1, 2, 3].map(() => node());
hero.querySelector = s => s === '[data-stage-box]' ? stage : s === '[data-pause]' ? pause : {};
hero.querySelectorAll = () => crafts;
const media = { matches: false, addEventListener(_name, f) { this.change = f; } }, win = {}, draws = [];
const playerDocument = { querySelector: () => hero, fonts: { ready: Promise.resolve() }, hidden: false, addEventListener() {} };
const renderer = { setAtlas() {}, draw(pieces, view) { draws.push({ pieces, view }); } };
const observer = class { observe() {} };
const player = fs.readFileSync(new URL('../play.mjs', import.meta.url), 'utf8').replace(/^import\s+.*?;\s*$/gm, '');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
await new AsyncFunction('env', `const { location, document, window, matchMedia, createRenderer, makeCamera, dot, corners, makeAtlas, fontsReady, SHOW, LOOP, SCENES, BLOCK, POOL, sceneAt, frameAt, devicePixelRatio, requestAnimationFrame, cancelAnimationFrame, IntersectionObserver, ResizeObserver } = env;\n${player}`)({
  location: { search: '?t=0' }, document: playerDocument, window: win, matchMedia: () => media,
  createRenderer: () => renderer, makeCamera, dot, corners, makeAtlas: () => atlas, fontsReady: async () => {},
  SHOW, LOOP, SCENES, BLOCK, POOL, sceneAt, frameAt, devicePixelRatio: 3,
  requestAnimationFrame: () => 1, cancelAnimationFrame() {}, IntersectionObserver: observer, ResizeObserver: observer,
});
assert.equal(win.__ready, true);
assert.ok(draws.at(-1).view.dpr <= 2);
crafts[0].events.click();
near(sceneAt(win.__hero.t).at, SHOW[2].still); // A paused graphic-design choice uses the InDesign still.
crafts[2].events.click();
near(sceneAt(win.__hero.t).at, SHOW[4].still);
pause.events.click(); crafts[0].events.click(); near(win.__hero.t, 0);
pause.events.click(); stage.events.click(); near(sceneAt(win.__hero.t).at, SHOW[3].still);
media.matches = true; media.change(); near(sceneAt(win.__hero.t).at, SHOW[3].still);
win.__hero.seek(-0.01); near(win.__hero.t, LOOP - 0.01);
// Parse the offline module without running it. All font URLs and page links must be self-contained.
const preview = previewMarkup(), moduleSource = preview.match(/<script type="module">([\s\S]*)<\/script>/)[1];
new AsyncFunction(moduleSource.replace(/import\.meta\.url/g, '"offline"'));
assert.ok(preview.startsWith('<title>Journey hero take two</title>'));
assert.ok(!/<!doctype|<html\b|<head\b|<body\b/i.test(preview));
assert.ok(!/\b(?:src|href)=/.test(preview.split('<script>')[0]));
assert.ok(!/url\((?!data:)/.test(preview.split('<script>')[0]));
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`checked ${frames} frames, ${pieces} pieces (max ${largest}); ${atlas.pages.length} atlas pages; loop ${LOOP.toFixed(3)}s`);
  console.log(SHOW.map(s => `${s.key}: ${s.len.toFixed(3)}s`).join(', '));
  console.log('all clean');
  if (process.argv.includes('--timeline')) {
    console.log('| App | Action | Kind | Start | End |\n| --- | --- | --- | ---: | ---: |');
    for (const scene of SHOW) for (const a of SCRIPTS[scene.key].actions) console.log(`| ${scene.key} | ${a.id} | ${a.kind} | ${(a.start / PACE).toFixed(3)} | ${(a.end / PACE).toFixed(3)} |`);
  }
}
