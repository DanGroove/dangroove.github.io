import { sceneEnvelope } from '../view.mjs';
// Round 6 (E1/E2): the entrance's timetable and the player's handling of it, in Node. No browser; DOM and GL are stand-ins.
// checkEntrance() checks the real sources; ENTRANCE_CONTROLS are one-site faults that must each be caught.
//   node design/journey-hero/take-2/tools/entrance-checks.mjs [--controls]
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeCamera, dot, EASE } from '../../../../public/journey/hero/engine.mjs';
import { corners } from '../kit.mjs';
import { inflateRawSync } from 'node:zlib';
import { handPatch, r12Patch } from './hand-patch.mjs';
import { SHOW, LOOP, SCENES, BLOCK, POOL, SCREEN, sceneAt, frameAt, calloutsAt } from '../stage.mjs';
import { createCraftModel, followCraft } from '../craft-wipe.mjs';
import { pageMarkup, LOADER_CSS, LOADER_SKIP } from './page.mjs';
import { previewMarkup } from './preview.mjs';

const TAKE = new URL('../', import.meta.url);
// Source mutations match lines, irrespective of this checkout's CRLF/LF convention.
const read = name => fs.readFileSync(new URL(name, TAKE), 'utf8').replace(/\r\n/g, '\n');
const close = (a, b, message, epsilon = 1e-9) => assert.ok(Math.abs(a - b) <= epsilon, `${message}: ${a} != ${b}`);

export const ENTRANCE_CONTROLS = [
  { id: 'timetable', file: 'entrance.mjs', search: 'name: [[0.4, 1.0], [0.6, 1.2]],', replacement: 'name: [[0.4, 1.0], [0.4, 1.0]],', gate: 'E1 timetable: Endrawes' },
  { id: 'labels-cut', file: 'stage.mjs', search: 'grow: Math.min(growIn, growOut), text: Math.min(textIn, textOut) }];', replacement: 'grow: growIn, text: textIn }];', gate: 'E4 labels:' },
  { id: 'click', file: 'play.mjs', search: 'function choose(craft) {\n  endEntrance(); first = false;\n', replacement: 'function choose(craft) {\n', gate: 'E1 click: craft' },
  { id: 'old-screen', file: 'entrance.mjs', search: 'screen: [2.4, 3.2],', replacement: 'screen: [0.5, 1.1],', gate: 'L2 groups:' },
  { id: 'half-second-loader', file: 'entrance.mjs', search: 'minimum: 0.8, fillSeconds: 0.8,', replacement: 'minimum: 0.05, fillSeconds: 0.05,', gate: 'L1 timing:' },
];

async function loadEntrance(source) {
  const url = new URL('entrance.mjs', TAKE);
  const fixed = source.replace(/from (['"])(\.{1,2}\/[^'"]+)\1/g, (_all, _quote, ref) => `from '${new URL(ref, url).href}'`);
  return import('data:text/javascript;base64,' + Buffer.from(fixed).toString('base64'));
}

// E4: each scene's labels leave as their entrance played backwards, ending at the old cut; nothing else moves.
async function loadStage(source) {
  const url = new URL('stage.mjs', TAKE);
  const fixed = source.replace(/from (['"])(\.{1,2}\/[^'"]+)\1/g, (_all, _quote, ref) => `from '${new URL(ref, url).href}'`);
  return import('data:text/javascript;base64,' + Buffer.from(fixed).toString('base64'));
}
async function preExit() {
  const record = JSON.parse(read('tools/fixtures/round5-addendum-source.json')).sources['stage.mjs'];
  // CORRECTIONS-12 I1: without InDesign's frame steps, as today.
  // C18 changes ROWS, but not the old cursor route or its derived approach durations.
  const source = inflateRawSync(Buffer.from(record.deflateBase64, 'base64')).toString('utf8')
    .replace('from: compPoint(ROWS[1]), to: compPoint(ROWS[2])', 'from: [2.5644, 2.13544], to: [2.6484, 1.93888]');
  return loadStage(r12Patch(handPatch(source)));
}
export async function checkLabelExit(stageSource = read('stage.mjs')) {
  const S = await loadStage(stageSource), { EASE } = await import('../../../../public/journey/hero/engine.mjs');
  const { SHOW: show, LOOP: loop, SCRIPTS, PACE, playbackSpans, calloutsAt: labelsAt } = S;
  // CORRECTIONS-7: derived, not typed. The pre-E4 stage (round-5 incoming, frozen) scheduled with round 7's hand
  // gives the loop and the lengths the exit must leave alone (83.04 s and 7.5/11.4/20.98/15.22/14.03/13.91 before round 7).
  const before = await preExit();
  // CORRECTIONS-12 D1 redraws Figma's canvas, which changes its own length; every other length is the frozen stage's.
  const figLen = scene => scene.SHOW.find(s => s.key === 'fig').len;
  // CORRECTIONS-13 E1/E2, then CORRECTIONS-15 S1/S2, lengthen the exporting scenes' tails on purpose: the entrance (InDesign's 'drop'
  // wait; the rows' become end at ballLength instead of round 12's 0.55 s first landing) and the sink (was 0.5 s InDesign, 0.4 s rows).
  const grow = { id: (S.ballLength('id') - 0.8 + S.BALL.sink - 0.5) * PACE, pr: (S.ballLength('pr') - 0.55 + S.BALL.sink - 0.4) * PACE, ae: (S.ballLength('ae') - 0.55 + S.BALL.sink - 0.4) * PACE };
  close(loop - figLen(S), before.LOOP - figLen(before) + grow.id + grow.pr + grow.ae, 'E4 labels: LOOP moved', 1e-9);
  const lens = Object.fromEntries(before.SHOW.map(scene => [scene.key, scene.len + (grow[scene.key] || 0)]));
  let start = 0, samples = 0;
  for (const scene of show) {
    if (scene.key !== 'fig') close(scene.len, lens[scene.key], `E4 labels: ${scene.key} length moved`, 1e-9);
    if (['id', 'pr', 'ae', 'fig'].includes(scene.key)) {
      const s = SCRIPTS[scene.key], off = start + (scene.key === 'id' ? s.actions.find(a => a.id === 'pickup').start : playbackSpans(s).off[0] - (scene.key === 'fig' ? 0.4 * PACE : 0));
      const expect = { 0.3: [1, 1], 0.25: [EASE.wipe(0.5), 1], 0.2: [0, 1], 0.1: [0, EASE.wipe(0.5)], 0.01: [0, EASE.wipe(0.05)] };
      for (const [before, [text, grow]] of Object.entries(expect)) {
        const labels = labelsAt(off - +before * PACE);
        assert.equal(labels.length, 3, `E4 labels: ${scene.key} has ${labels.length} labels at off-${before}`);
        for (const c of labels) { close(c.text, text, `E4 labels: ${scene.key} ${c.words} text at off-${before}`, 1e-6); close(c.grow, grow, `E4 labels: ${scene.key} ${c.words} grow at off-${before}`, 1e-6); samples++; }
      }
      assert.equal(labelsAt(off - 1e-6 * PACE).length, 3, `E4 labels: ${scene.key} label gone before off`);
      assert.equal(labelsAt(off).length, 0, `E4 labels: ${scene.key} label kept at off`);
      assert.ok(start + scene.still < off - 0.3 * PACE || start + scene.still >= off, `E4 labels: ${scene.key} still falls in the exit`);
    }
    start += scene.len;
  }
  return samples;
}

// Table rows are the groups: both name lines together, and floor/stars together. Cuts count at their instant only.
export function checkEntranceGroups({ ENTRANCE: e, staggerSpans }) {
  const groups = [
    { name: 'mark', spans: [e.mark] }, { name: 'nav', cuts: e.nav },
    { name: 'name', spans: e.name }, { name: 'lede', spans: staggerSpans(e.lede, 7) },
    { name: 'floor/stars', spans: [e.floor, e.stars] }, { name: 'screen', spans: [e.screen] },
    { name: 'crafts', spans: staggerSpans(e.crafts, e.crafts.lines) }, { name: 'foot', cuts: e.foot },
  ];
  const times = new Set(Array.from({ length: Math.ceil(e.end * 60) + 1 }, (_, i) => i / 60));
  for (const g of groups) for (const at of g.cuts || g.spans.flat()) times.add(at);
  let maximum = 0;
  for (const time of [...times].sort((a, b) => a - b)) {
    const moving = groups.filter(g => g.cuts ? g.cuts.some(t => Math.abs(time - t) < 1e-10) : g.spans.some(([a, b]) => time >= a && time < b));
    maximum = Math.max(maximum, moving.length);
    assert.ok(moving.length <= 2, `L2 groups: ${moving.map(g => g.name).join(', ')} at ${time.toFixed(6)} s`);
  }
  const bounds = groups.map(g => g.cuts ? [g.cuts[0], g.cuts.at(-1)] : [Math.min(...g.spans.map(s => s[0])), Math.max(...g.spans.map(s => s[1]))]);
  for (let i = 1; i < groups.length; i++) {
    assert.ok(bounds[i][0] >= bounds[i - 1][0] && bounds[i][1] >= bounds[i - 1][1], `L2 groups: ${groups[i].name} out of reading order`);
  }
  return { samples: times.size, maximum };
}

export function checkLoaderTiming({ loaderAt, createLoaderView }) {
  const all = { fonts: 0, atlas: 0, frame: 0 }, at = t => loaderAt(t, all);
  assert.ok(!at(0.5).done, 'L1 timing: loader ends at 0.5 s');
  close(at(0).fill, 0, 'L1 timing: empty at first paint');
  close(at(0.8).fill, 1, 'L1 timing: full at .8 when ready at once');
  assert.equal(at(0.8).phase, 'hold', 'L1 timing: hold starts at full');
  assert.equal(at(0.8 + 0.15).phase, 'wipe', 'L1 timing: .15 full hold');
  assert.ok(!at(1.25 - 1e-8).done && at(1.25).done, 'L1 timing: .3 wipe then entrance');
  close(at(1.25).entranceStart, 1.25, 'L1 timing: entrance boundary');
  close(at(1.5).entranceTime, 0.25, 'L1 timing: entrance clock');
  for (const p of [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1]) close(at(0.95 + p * 0.3).wipe, EASE.wipe(p), 'L1 timing: EASE.wipe', 1e-9);
  let samples = 0;
  const boots = [all, {}, { fonts: 0.2 }, { fonts: 0.1, atlas: 1.2 }, { fonts: 0.13, atlas: 0.23, frame: 0.41 }, { fonts: 0.2, atlas: 1.7, frame: 3.01 }];
  for (const boot of boots) {
    let previous = loaderAt(0, boot);
    for (let n = 1; n <= 6000; n++) {
      const t = n / 1000, s = loaderAt(t, boot), delta = s.fill - previous.fill;
      assert.ok(Number.isFinite(s.wipe) && s.fill >= 0 && s.fill <= s.target && s.target <= 1, 'L1 timing: finite bounded fill/wipe');
      assert.ok(delta >= -1e-12 && delta <= 0.001 / 0.8 + 1e-12, 'L1 timing: fill jumps, reverses or exceeds 1.25 widths/s');
      if (s.done) assert.ok(s.fill === 1 && s.wipe === 1 && t >= 0.8 && t >= Math.max(...Object.values(boot)), 'L1 timing: ends before boot/full/wipe');
      previous = s; samples++;
    }
    for (const time of Object.values(boot)) {
      close(loaderAt(time - 1e-9, boot).fill, loaderAt(time, boot).fill, 'L1 timing: boot completion jumps fill', 2e-9);
    }
  }
  const boot = { fonts: 0.2, atlas: 1.7, frame: 3.01 };
  for (const [time, fill] of [[0, 0], [0.199, 0], [0.2, 0.25], [1.699, 0.25], [1.7, 0.75], [3.009, 0.75], [3.01, 1]]) {
    const s = loaderAt(time, boot, { reduced: true });
    close(s.fill, fill, 'L1 timing: reduced motion hard steps');
    assert.equal(s.wipe, 0, 'L1 timing: reduced motion wipe');
    assert.equal(s.done, time >= 3.01, 'L1 timing: reduced motion cut');
    assert.equal(s.entranceStart, null, 'L1 timing: reduced motion starts entrance');
  }
  for (const reduced of [false, true]) {
    const s = loaderAt(0, {}, { review: true, reduced });
    assert.ok(s.done && s.phase === 'skipped' && s.entranceStart === null, 'L1 timing: ?t= path');
  }
  const group = { style: {} }, fill = { style: {} }, removed = [];
  const view = createLoaderView({ querySelector: s => s === '[data-loader]' ? group : fill, classList: { remove: c => removed.push(c) } });
  view.apply(at(1.1));
  assert.equal(fill.style.transform, 'scaleX(1)', 'L1 view: fill transform');
  assert.equal(group.style.clipPath, `inset(0 0 0 ${100 * at(1.1).wipe}%)`, 'L1 view: common left-to-right clip');
  view.clear(); assert.deepEqual(removed, ['is-loading'], 'L1 view: clear overlay');
  return samples;
}

function checkLoaderMarkup() {
  const html = pageMarkup(), offline = previewMarkup(), stills = pageMarkup('stills');
  const header = html.match(/<a[^>]*data-mark[^>]*>\s*(<svg[\s\S]*?<\/svg>)/)[1];
  const paper = header.replace(/fill="#[\da-f]+"/gi, 'fill="#F7F6F3"');
  for (const page of [html, offline]) {
    assert.ok(page.includes(LOADER_CSS) && page.includes(LOADER_SKIP) && page.includes(paper), 'L1 markup: inline CSS, review skip and exact paper header artwork');
    assert.ok(page.includes('hero is-entering is-loading') && page.includes('data-loader-fill'), 'L1 markup: first-paint loader');
    assert.ok(page.indexOf(LOADER_CSS) < page.indexOf('data-loader'), 'L1 markup: style precedes loader');
  }
  assert.ok(!stills.includes('data-loader'), 'L1 markup: still tools gained a loader');
  for (const rule of ['--loader-height: 44px', '--loader-height: 36px', 'height: 2px', 'margin-top: 20px', '#151314', '#2B2829', '#F0484F', '1080 / 797.3', 'visibility: hidden !important']) assert.ok(LOADER_CSS.includes(rule), `L1 markup: ${rule}`);
  assert.ok(!/transition:|animation:|opacity:|border-radius:/.test(LOADER_CSS), 'L1 markup: loader must be hard edged');
}

function checkTimetable(E) {
  const { entranceAt, screenPlane, floorReach, revealDot, revealPool, loopAt, staggerSpans } = E;
  const at = time => entranceAt(time, { ledeLines: 3 }), before = t => t - 1e-6, after = t => t + 1e-6;
  // Each part: nothing before its start, something just after, complete at its end and not before.
  const part = (name, get, start, end) => {
    assert.equal(get(at(before(start))), 0, `E1 timetable: ${name} before ${start}`);
    assert.ok(get(at(after(start))) > 0, `E1 timetable: ${name} after ${start}`);
    assert.ok(get(at(before(end))) < 1, `E1 timetable: ${name} done before ${end}`);
    assert.equal(get(at(end)), 1, `E1 timetable: ${name} at ${end}`);
  };
  const cut = (name, get, time) => { assert.equal(get(at(before(time))), false, `E1 timetable: ${name} before ${time}`); assert.equal(get(at(time)), true, `E1 timetable: ${name} at ${time}`); };
  assert.equal(at(0).mark, 0, 'E1 timetable: DG mark at 0');
  assert.ok(at(1e-6).mark > 0 && at(before(0.45)).mark < 1 && at(0.45).mark === 1, 'E1 timetable: DG mark 0 to 0.45');
  cut('Journey', s => s.nav[0], 0.35); cut('Contact', s => s.nav[1], 0.45);
  part('Danial', s => s.name[0].reveal, 0.4, 1.0);
  part('Endrawes', s => s.name[1].reveal, 0.6, 1.2);
  for (const i of [0, 1]) {
    const [a, b] = [[0.4, 1.0], [0.6, 1.2]][i];
    close(at(a).name[i].weight, 300, `E1 timetable: ${i ? 'Endrawes' : 'Danial'} weight starts at 300`);
    close(at(b).name[i].weight, 800, `E1 timetable: ${i ? 'Endrawes' : 'Danial'} weight ends at 800`);
  }
  for (const lines of [2, 3, 4, 5, 7]) {
    const spans = staggerSpans({ start: 1.05, end: 2.0, step: 0.15 }, lines);
    close(spans[0][0], 1.05, 'E1 timetable: lede starts'); close(spans.at(-1)[1], 2.0, 'E1 timetable: lede ends');
    for (let i = 1; i < lines; i++) close(spans[i][0] - spans[i - 1][0], Math.min(0.15, 0.95 / (lines + 1)), 'E1 timetable: lede line step');
    for (const [i, [a, b]] of spans.entries()) {
      const s = t => entranceAt(t, { ledeLines: lines }).lede[i];
      assert.ok(s(before(a)) === 0 && s(after(a)) > 0 && s(before(b)) < 1 && s(b) === 1, `E1 timetable: lede line ${i + 1} of ${lines}`);
    }
  }
  [0, 1, 2, 3, 4].forEach(i => part(`craft line ${i + 1}`, s => s.crafts[i], 3.0 + 0.1 * i, 3.2 + 0.1 * i));
  part('floor', s => s.floor, 1.8, 2.8);
  part('screen', s => s.screen, 2.4, 3.2);
  cut('Scroll for the journey', s => s.foot[0], 3.6); cut('Pause', s => s.foot[1], 3.7);
  cut('floor hover', s => s.hover, 2.8);
  assert.ok(!at(before(3.8)).done && at(3.8).done, 'E1 timetable: ends at 3.8');
  // The loop's clock starts at 0 when the screen's wipe ends.
  for (const time of [0, 2.4, 3.1999, 3.2]) assert.equal(loopAt(time), 0, 'E1 timetable: loop clock before the screen ends');
  close(loopAt(3.8), 0.6, 'E1 timetable: loop clock at the end');
  // The screen's clip plane: below everything on the screen at 0 and 2.4, partway at 2.8, gone at 3.2.
  const pieces = frameAt(0, { first: true });
  const lowest = Math.min(...pieces.flatMap(pc => corners(pc).map(p => p[1]))), highest = Math.max(...pieces.flatMap(pc => corners(pc).map(p => p[1])));
  const kept = (plane, p) => plane === null || dot(plane, p) + plane[3] >= 0;
  for (const time of [0, 2.4]) {
    const plane = screenPlane(at(time).screen);
    assert.ok(plane && pieces.every(pc => corners(pc).every(p => !kept(plane, p) || p[1] <= SCREEN.b)), `E1 timetable: screen plane at ${time} shows the screen`);
    assert.ok(plane[3] < lowest, `E1 timetable: screen plane at ${time} not below the screen`);
  }
  const mid = screenPlane(at(2.8).screen);
  assert.ok(mid && mid[1] === -1 && mid[3] > lowest && mid[3] < highest, 'E1 timetable: screen plane at 2.8 is not partway up');
  assert.equal(screenPlane(at(3.2).screen), null, 'E1 timetable: screen plane remains at 3.2');
  for (let n = 0, last = -Infinity; n < 80; n++) { const y = screenPlane(at(2.4 + n / 100).screen)[3]; assert.ok(y >= last, 'E1 timetable: screen plane falls'); last = y; }
  assert.ok(!pieces.some(pc => /Fig$/.test(pc.art || '')), 'E1 timetable: first pass shows Figma on the Photoshop screen');
  // The floor circle: radius 0 until 1.8, growing to the pool's edge at 2.8; each dot wholly on or off by its centre.
  const radius = 4.8, centre = POOL;
  let dots = 0;
  for (let n = 0, last = -1; n <= 76; n++) {
    const time = n / 20;
    const reach = floorReach(at(time).floor, radius);
    if (time < 1.8) assert.equal(reach, 0, 'E1 timetable: floor circle before 1.8');
    else if (time >= 2.8) assert.equal(reach, null, 'E1 timetable: floor circle after 2.8');
    else { assert.ok(reach >= last && reach < radius, 'E1 timetable: floor circle radius'); last = reach; }
    for (let ix = -12; ix <= 12; ix++) for (let iz = -12; iz <= 12; iz++) {
      const x = Math.round(centre.x / 0.5) * 0.5 + ix * 0.5, z = Math.round(centre.z / 0.5) * 0.5 + iz * 0.5, on = revealDot(x, z, centre, reach);
      for (const [dx, dz] of [[-0.03, 0], [0.03, 0], [0, -0.03], [0, 0.03], [0.02, 0.02]]) assert.equal(revealDot(x + dx, z + dz, centre, reach), on, 'E1 timetable: a dot is cut by the floor circle');
      if (on && reach !== null) assert.ok(revealPool(x, z, centre, reach), 'E1 timetable: a dot shows outside the pool circle');
      dots++;
    }
  }
  const shader = read('sq.mjs');
  assert.ok(shader.includes('distance(centre, uFloor.xy) <= uReach') && shader.includes('length(vW.xz - uFloor.xy) <= uReach'), 'E1 timetable: floor shader must decide dots by centre and cut the pool with the same circle');
  return dots;
}

// Run the real player with stand-ins, without ?t, so its entrance plays.
async function runPlayer(playerSource, E, { review = false, reduced = false, withLoader = false, fonts = Promise.resolve(), pageFonts = Promise.resolve(), duringBoot, firstDrawSeconds = 0 } = {}) {
  const node = rect => ({
    events: {}, attributes: {}, textContent: '', style: {}, classList: { remove() {} },
    rect, getBoundingClientRect() { return this.rect; },
    addEventListener(name, f) { this.events[name] = f; },
    setAttribute(name, value) { this.attributes[name] = value; },
    removeAttribute(name) { delete this.attributes[name]; },
  });
  const hero = node({ left: 0, top: 0, width: 1440, height: 900 }), stage = node({ left: 760, top: 80, width: 600, height: 700 }), pause = node(), crafts = [0, 1, 2, 3].map(() => node());
  hero.querySelector = s => s === '[data-stage-box]' ? stage : s === '[data-pause]' ? pause : node();
  hero.querySelectorAll = () => crafts;
  const media = { matches: reduced, addEventListener(_name, f) { this.change = f; } }, win = {}, draws = [], view = { applied: [], clears: 0 }, loaderStates = [], live = [];
  let starOptions;
  const wipe = { model: createCraftModel(), follows: [] };
  let tick = null, now = 0;
  const renderer = { setAtlas() {}, draw(pieces, v, look) { if (!draws.length) now += firstDrawSeconds * 1000; draws.push({ look }); } };
  const observer = class { observe() {} };
  const player = playerSource.replace(/^import\s+.*?;\s*$/gm, '');
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const execution = new AsyncFunction('env', `const { sceneEnvelope, location, document, window, matchMedia, createRenderer, makeCamera, dot, corners, makeAtlas, fontsReady, SHOW, LOOP, SCENES, BLOCK, POOL, sceneAt, frameAt, calloutsAt, createCallouts, createPageLayout, createNameReact, createStars, starReach, createCraftWipe, ENTRANCE, entranceAt, screenPlane, floorReach, createEntranceView, loaderAt, createLoaderView, performance, devicePixelRatio, requestAnimationFrame, cancelAnimationFrame, IntersectionObserver, ResizeObserver } = env;\n${player}`)({
    location: { search: review ? '?t=12.5' : '' }, document: { querySelector: () => hero, fonts: { ready: pageFonts, addEventListener() {} }, hidden: false, addEventListener() {} }, window: win, matchMedia: () => media,
    createCraftWipe: () => ({ measure() {}, hold: () => null, follow(craft, o) { wipe.follows.push(!!o?.cut); followCraft(wipe.model, craft, now / 1000, { ...o, reduced: media.matches }); }, state: null }),
    createRenderer: () => renderer, makeCamera, dot, corners, makeAtlas: () => ({}), fontsReady: () => fonts,
    sceneEnvelope, SHOW, LOOP, SCENES, BLOCK, POOL, sceneAt, frameAt, calloutsAt, createCallouts: () => ({ draw() {}, fit: v => v, layout: [] }),
    createNameReact: () => ({ measure() {}, setLive(on) { live.push(on); }, live: false, open: 0, letters: [] }), createStars: (_hero, options) => { starOptions = options; return { measure() {}, frame: () => null, after() {}, swallowClick: () => false, field: null }; }, starReach: () => null, createPageLayout: () => ({ measure() {}, cover() {}, get metrics() { return { h: hero.rect, b: stage.rect, nameLines: [] }; }, view(need, cam, dpr) { const h = hero.rect, b = stage.rect, S = Math.min(b.width / need.w, b.height / need.h); return { W: h.width, H: h.height, S, cx: b.left + b.width / 2 - S * need.x, cy: b.top + b.height / 2 + S * need.y, cam, dpr }; } }),
    ENTRANCE: E.ENTRANCE, entranceAt: E.entranceAt, screenPlane: E.screenPlane, floorReach: E.floorReach, loaderAt: E.loaderAt, createLoaderView: h => { const v = E.createLoaderView(h); return { clear: v.clear, apply(s) { loaderStates.push({ ...s, now }); v.apply(s); } }; }, performance: { now: () => now },
    createEntranceView: () => ({ measure() {}, apply(s) { view.applied.push(s); }, clear() { view.clears++; }, lines: 3 }),
    devicePixelRatio: 1, requestAnimationFrame: f => { tick = f; return 1; }, cancelAnimationFrame() {}, IntersectionObserver: observer, ResizeObserver: observer,
  });
  const run = seconds => { for (let n = 0; n < Math.round(seconds / 0.05); n++) { now += 50; tick?.(now); } };
  const result = { win, draws, view, crafts, pause, stage, media, run, wipe, loaderStates, live, starOptions };
  if (duringBoot) await duringBoot(result);
  await execution;
  tick?.(now);
  if (!withLoader && !review) run(1.25);
  return result;
}

function near(a, b, message) { close(a, b, message, 1e-6); }

async function checkPlayer(playerSource, E) {
  const starts = SHOW.map((_, i) => SHOW.slice(0, i).reduce((sum, scene) => sum + scene.len, 0));
  // The first frame is ready underneath the loader; no loop/name/star interaction before its exit.
  let loading = await runPlayer(playerSource, E, { withLoader: true });
  assert.equal(loading.win.__ready, true, 'L1 player: first-frame readiness');
  assert.ok(loading.win.__hero.loading && loading.win.__hero.entering === null && loading.win.__hero.t === 0, 'L1 player: entrance/loop starts during loader');
  assert.deepEqual(loading.loaderStates.slice(0, 3).map(s => s.target), [0.25, 0.75, 1], 'L1 player: real boot shares');
  assert.ok(loading.loaderStates.slice(0, 3).every(s => s.fill === 0), 'L1 player: boot target jumps drawn fill');
  assert.ok(!loading.live.at(-1) && !loading.starOptions.open() && !loading.starOptions.available(), 'L1 player: interactive while loading');
  loading.run(0.8); assert.equal(loading.loaderStates.at(-1).phase, 'hold', 'L1 player: full hold');
  loading.run(0.15); assert.ok(loading.loaderStates.at(-1).fill === 1 && loading.loaderStates.at(-1).wipe === 0, 'L1 player: wipe boundary');
  loading.run(0.25); assert.equal(loading.win.__hero.entering, null, 'L1 player: entrance before wipe end');
  loading.run(0.05); near(loading.win.__hero.entering, 0, 'L1 player: entrance at wipe end');
  assert.equal(loading.win.__hero.loading, false, 'L1 player: overlay remains');
  const review = await runPlayer(playerSource, E, { review: true, withLoader: true });
  assert.ok(review.win.__ready && !review.win.__hero.loading && review.win.__hero.entering === null && review.loaderStates.length === 0, 'L1 player: ?t= does not skip both');
  near(review.win.__hero.t, 12.5, 'L1 player: review loop hold');
  review.win.__hero.entrance(2.8); near(review.win.__hero.entering, 2.8, 'L1 player: review entrance hold still works');
  assert.equal(review.starOptions.open(), true, 'L2 player: star pointer at 2.8');
  const cut = await runPlayer(playerSource, E, { reduced: true, withLoader: true });
  assert.deepEqual(cut.loaderStates.slice(0, 3).map(s => s.fill), [0.25, 0.75, 1], 'L1 player: reduced boot steps');
  assert.ok(!cut.win.__hero.loading && cut.win.__hero.entering === null, 'L1 player: reduced cut');
  near(cut.win.__hero.t, starts[2] + SHOW[2].still, 'L1 player: reduced finished still');
  let finishFonts, finishPageFonts;
  const fonts = new Promise(resolve => { finishFonts = resolve; }), pageFonts = new Promise(resolve => { finishPageFonts = resolve; });
  const late = await runPlayer(playerSource, E, { withLoader: true, fonts, pageFonts, duringBoot: async p => {
    p.run(1);
    assert.ok(!p.win.__ready && p.draws.length === 0 && p.loaderStates.at(-1).target === 0, 'L1 player: progress before fonts');
    finishFonts(); await Promise.resolve();
    p.run(1);
    assert.ok(!p.win.__ready && p.loaderStates.at(-1).target === 0, 'L1 player: progress before document fonts');
    finishPageFonts();
  } });
  assert.ok(late.win.__ready && late.win.__hero.loading && late.loaderStates.at(-1).fill === 0, 'L1 player: delayed readiness jumps fill');
  late.run(1.2); assert.equal(late.win.__hero.entering, null, 'L1 player: delayed boot skips loader');
  late.run(0.05); near(late.win.__hero.entering, 0, 'L1 player: delayed loader exit');
  const blocked = await runPlayer(playerSource, E, { withLoader: true, firstDrawSeconds: 2 });
  assert.ok(blocked.win.__ready && blocked.loaderStates.at(-1).fill === 0, 'L1 player: blocked boot consumes visible fill');
  blocked.run(1.2); assert.equal(blocked.win.__hero.entering, null, 'L1 player: blocked boot consumes minimum duration');
  blocked.run(0.05); near(blocked.win.__hero.entering, 0, 'L1 player: blocked boot loader exit');
  for (const release of ['seek', 'entrance']) {
    const p = await runPlayer(playerSource, E, { withLoader: true });
    const clears = p.view.clears;
    if (release === 'seek') p.win.__hero.seek(12.5); else p.win.__hero.entrance(null);
    assert.ok(!p.win.__hero.loading && p.view.clears > clears && p.draws.at(-1).look.reveal === null, `L1 player: ${release} leaves initial clips`);
  }
  const change = await runPlayer(playerSource, E, { withLoader: true });
  const clears = change.view.clears;
  change.media.matches = true; change.media.change(); change.run(0.05);
  assert.ok(!change.win.__hero.loading && change.win.__hero.entering === null && change.view.clears > clears, 'L1 player: media change leaves loader/initial clips');
  near(change.win.__hero.t, starts[2] + SHOW[2].still, 'L1 player: media change finished still');
  // A whole entrance after the loader: loop held until 3.2; the star pointer waits for 2.8.
  let p = await runPlayer(playerSource, E);
  assert.equal(p.win.__ready, true);
  near(p.win.__hero.entering, 0, 'E1 player: entrance starts at the loader exit');
  p.run(2.75); near(p.win.__hero.entering, 2.75, 'E1 player: entrance clock'); near(p.win.__hero.t, 0, 'E1 player: loop clock held before the screen ends');
  assert.equal(p.starOptions.open(), false, 'L2 player: star pointer before 2.8');
  assert.equal(p.draws.at(-1).look.floor.pointer, undefined, 'F3 player: the floor has a hover point');
  assert.ok(p.draws.at(-1).look.reveal && p.draws.at(-1).look.floor.reveal > 0 && p.draws.at(-1).look.floor.reveal < 4.8, 'E1 player: renderer reveal values');
  p.run(0.55); near(p.win.__hero.t, 0.1, 'E1 player: loop clock starts at 0 when the screen wipe ends');
  assert.equal(p.draws.at(-1).look.floor.pointer, undefined, 'F3 player: the floor has a hover point');
  assert.equal(p.draws.at(-1).look.reveal, null, 'E1 player: screen clip after 3.2');
  p.run(0.5); assert.equal(p.win.__hero.entering, null, 'E1 player: entrance ends at 3.8'); near(p.win.__hero.t, 0.6, 'E1 player: loop clock at the entrance end');
  assert.ok(p.view.clears > 0 && p.draws.at(-1).look.floor.reveal === undefined, 'E1 player: entrance styles remain');
  p.run(1); near(p.win.__hero.t, 1.6, 'E1 player: loop keeps playing');
  // Round 11 (C1): the entrance sets the craft list (its rule draws with the hairline); the loop's start is no change.
  assert.ok(p.wipe.follows.length > 20 && p.wipe.follows.some(cut => cut) && p.wipe.follows.some(cut => !cut), 'C1 player: the craft list is not followed through and after the entrance');
  assert.ok(p.wipe.model.current === 0 && p.wipe.model.changes === 0, `C1 player: the entrance or the loop's start made a craft change (${p.wipe.model.changes})`);
  // A click during the entrance ends it at once and then does what the click does.
  p = await runPlayer(playerSource, E); p.run(0.5);
  p.crafts[2].events.click();
  assert.equal(p.win.__hero.entering, null, 'E1 click: craft click leaves the entrance running');
  near(p.win.__hero.t, starts[SHOW.findIndex(s => s.craft === 2)], 'E1 click: craft click did not choose Motion');
  assert.equal(p.draws.at(-1).look.reveal, null, 'E1 click: craft click left the screen clipped');
  p = await runPlayer(playerSource, E); p.run(0.3);
  p.stage.events.click(); assert.equal(p.win.__hero.entering, null, 'E1 click: stage click leaves the entrance running');
  near(p.win.__hero.t, starts[SHOW.findIndex(s => s.craft === 1)], 'E1 click: stage click did not move to the next craft');
  p = await runPlayer(playerSource, E); p.run(0.6);
  p.pause.events.click(); assert.equal(p.win.__hero.entering, null, 'E1 click: Pause leaves the entrance running');
  assert.equal(p.pause.textContent, 'Play', 'E1 click: Pause did not pause'); p.run(0.5); near(p.win.__hero.t, 0, 'E1 click: paused loop moved');
  // E2: the review hold, then back to normal.
  p = await runPlayer(playerSource, E); p.run(2);
  p.win.__hero.entrance(0.8); near(p.win.__hero.entering, 0.8, 'E2 hold'); near(p.win.__hero.t, 0, 'E2 hold loop clock');
  p.run(0.5); near(p.win.__hero.entering, 0.8, 'E2 hold moved');
  near(p.view.applied.at(-1).time, 0.8, 'E2 hold not drawn');
  p.win.__hero.entrance(3.4); near(p.win.__hero.t, 0.2, 'E2 hold loop clock after 3.2');
  p.win.__hero.entrance(null); assert.equal(p.win.__hero.entering, null, 'E2 release'); p.run(0.5); assert.ok(p.win.__hero.t > 0.2, 'E2 release does not play');
  // Reduced motion: no entrance at all.
  p = await runPlayer(playerSource, E); p.media.matches = true; p.media.change(); assert.equal(p.win.__hero.entering, null, 'E1 reduced motion keeps the entrance');
  return 14;
}

export async function checkEntrance({ entranceSource = read('entrance.mjs'), playerSource = read('play.mjs'), stageSource = read('stage.mjs') } = {}) {
  const E = await loadEntrance(entranceSource);
  const groups = checkEntranceGroups(E), loaderSamples = checkLoaderTiming(E);
  checkLoaderMarkup();
  const dots = checkTimetable(E);
  const runs = await checkPlayer(playerSource, E);
  const labelSamples = await checkLabelExit(stageSource);
  return `L1 computed: ${loaderSamples} loader samples at 1 ms; bounded linear fill, .8 minimum, .15 hold, .3 EASE.wipe, reduced steps and review skip; inline page/offline markup. L2 computed: ${groups.samples} timetable samples at 60 Hz plus boundaries/cuts, maximum ${groups.maximum} groups, reading order. E4 computed: ${labelSamples} unchanged label samples/scene clocks. E1/E2 computed: new 3.8 s timetable and 5 lede line counts; screen plane at 0, 2.4, 2.8, 3.2; floor circle ${dots} dot samples; ${runs} player runs including loader, review, reduced motion, loop/pointer gates, clicks and hold. Frames UNRUN here.`;
}

// Each control edits one exact site in memory and must fail at its gate.
export async function checkEntranceControls() {
  const out = [];
  for (const c of ENTRANCE_CONTROLS) {
    const source = read(c.file);
    assert.equal(source.split(c.search).length - 1, 1, `E1 control ${c.id}: must match one site`);
    const edited = source.replace(c.search, c.replacement);
    let message = null;
    try { await checkEntrance({ 'entrance.mjs': { entranceSource: edited }, 'play.mjs': { playerSource: edited }, 'stage.mjs': { stageSource: edited } }[c.file]); } catch (error) { message = error.message.split('\n')[0]; }
    assert.ok(message && message.startsWith(c.gate), `E1 control ${c.id}: missed (${message})`);
    out.push(`${c.id} caught: ${message}`);
  }
  return out.join('; ');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(await checkEntrance());
  if (process.argv.includes('--controls')) console.log(await checkEntranceControls());
}
