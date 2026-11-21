import { sceneEnvelope } from '../view.mjs';
// Round 6 (E1/E2): the entrance's timetable and the player's handling of it, in Node. No browser; DOM and GL are stand-ins.
// checkEntrance() checks the real sources; ENTRANCE_CONTROLS are one-site faults that must each be caught.
//   node design/journey-hero/take-2/tools/entrance-checks.mjs [--controls]
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeCamera, dot } from '../../../../public/journey/hero/engine.mjs';
import { corners } from '../kit.mjs';
import { inflateRawSync } from 'node:zlib';
import { handPatch, r12Patch } from './hand-patch.mjs';
import { SHOW, LOOP, SCENES, BLOCK, POOL, SCREEN, sceneAt, frameAt, calloutsAt } from '../stage.mjs';
import { createCraftModel, followCraft } from '../craft-wipe.mjs';

const TAKE = new URL('../', import.meta.url);
const read = name => fs.readFileSync(new URL(name, TAKE), 'utf8');
const close = (a, b, message, epsilon = 1e-9) => assert.ok(Math.abs(a - b) <= epsilon, `${message}: ${a} != ${b}`);

export const ENTRANCE_CONTROLS = [
  { id: 'timetable', file: 'entrance.mjs', search: 'name: [[0.08, 0.4], [0.16, 0.48]],', replacement: 'name: [[0.08, 0.4], [0.08, 0.4]],', gate: 'E1 timetable: Endrawes' },
  { id: 'labels-cut', file: 'stage.mjs', search: 'grow: Math.min(growIn, growOut), text: Math.min(textIn, textOut) }];', replacement: 'grow: growIn, text: textIn }];', gate: 'E4 labels:' },
  { id: 'click', file: 'play.mjs', search: 'function choose(craft) {\n  endEntrance(); first = false;\n', replacement: 'function choose(craft) {\n', gate: 'E1 click: craft' },
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
  return loadStage(r12Patch(handPatch(inflateRawSync(Buffer.from(record.deflateBase64, 'base64')).toString('utf8'))));
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
  assert.ok(at(1e-6).mark > 0 && at(before(0.3)).mark < 1 && at(0.3).mark === 1, 'E1 timetable: DG mark 0 to 0.30');
  cut('Journey', s => s.nav[0], 0.24); cut('Contact', s => s.nav[1], 0.3);
  part('Danial', s => s.name[0].reveal, 0.08, 0.4);
  part('Endrawes', s => s.name[1].reveal, 0.16, 0.48);
  for (const i of [0, 1]) {
    const [a, b] = [[0.08, 0.4], [0.16, 0.48]][i];
    close(at(a).name[i].weight, 300, `E1 timetable: ${i ? 'Endrawes' : 'Danial'} weight starts at 300`);
    close(at(b).name[i].weight, 800, `E1 timetable: ${i ? 'Endrawes' : 'Danial'} weight ends at 800`);
  }
  for (const lines of [2, 3, 4, 5, 7]) {
    const spans = staggerSpans({ start: 0.4, end: 0.75, step: 0.06 }, lines);
    close(spans[0][0], 0.4, 'E1 timetable: lede starts'); close(spans.at(-1)[1], 0.75, 'E1 timetable: lede ends');
    for (let i = 1; i < lines; i++) close(spans[i][0] - spans[i - 1][0], Math.min(0.06, 0.35 / (lines + 1)), 'E1 timetable: lede line step');
    for (const [i, [a, b]] of spans.entries()) {
      const s = t => entranceAt(t, { ledeLines: lines }).lede[i];
      assert.ok(s(before(a)) === 0 && s(after(a)) > 0 && s(before(b)) < 1 && s(b) === 1, `E1 timetable: lede line ${i + 1} of ${lines}`);
    }
  }
  [0, 1, 2, 3, 4].forEach(i => part(`craft line ${i + 1}`, s => s.crafts[i], 0.55 + 0.05 * i, 0.75 + 0.05 * i));
  part('floor', s => s.floor, 0.2, 0.9);
  part('screen', s => s.screen, 0.5, 1.1);
  cut('Scroll for the journey', s => s.foot[0], 1.1); cut('Pause', s => s.foot[1], 1.2);
  cut('floor hover', s => s.hover, 0.9);
  assert.ok(!at(before(1.4)).done && at(1.4).done, 'E1 timetable: ends at 1.4');
  // The loop's clock starts at 0 when the screen's wipe ends.
  for (const time of [0, 0.5, 1.0999, 1.1]) assert.equal(loopAt(time), 0, 'E1 timetable: loop clock before the screen ends');
  close(loopAt(1.4), 0.3, 'E1 timetable: loop clock at the end');
  // The screen's clip plane: below everything on the screen at 0 and 0.5, partway at 0.8, gone at 1.1.
  const pieces = frameAt(0, { first: true });
  const lowest = Math.min(...pieces.flatMap(pc => corners(pc).map(p => p[1]))), highest = Math.max(...pieces.flatMap(pc => corners(pc).map(p => p[1])));
  const kept = (plane, p) => plane === null || dot(plane, p) + plane[3] >= 0;
  for (const time of [0, 0.5]) {
    const plane = screenPlane(at(time).screen);
    assert.ok(plane && pieces.every(pc => corners(pc).every(p => !kept(plane, p) || p[1] <= SCREEN.b)), `E1 timetable: screen plane at ${time} shows the screen`);
    assert.ok(plane[3] < lowest, `E1 timetable: screen plane at ${time} not below the screen`);
  }
  const mid = screenPlane(at(0.8).screen);
  assert.ok(mid && mid[1] === -1 && mid[3] > lowest && mid[3] < highest, 'E1 timetable: screen plane at 0.8 is not partway up');
  assert.equal(screenPlane(at(1.1).screen), null, 'E1 timetable: screen plane remains at 1.1');
  for (let time = 0.5, last = -Infinity; time < 1.1; time += 0.01) { const y = screenPlane(at(time).screen)[3]; assert.ok(y >= last, 'E1 timetable: screen plane falls'); last = y; }
  assert.ok(!pieces.some(pc => /Fig$/.test(pc.art || '')), 'E1 timetable: first pass shows Figma on the Photoshop screen');
  // The floor circle: radius 0 until 0.2, growing to the pool's edge at 0.9; each dot wholly on or off by its centre.
  const radius = 4.8, centre = POOL;
  let dots = 0;
  for (let time = 0, last = -1; time <= 1.4 + 1e-9; time += 0.05) {
    const reach = floorReach(at(time).floor, radius);
    if (time < 0.2) assert.equal(reach, 0, 'E1 timetable: floor circle before 0.2');
    else if (time >= 0.9) assert.equal(reach, null, 'E1 timetable: floor circle after 0.9');
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
async function runPlayer(playerSource, E) {
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
  const media = { matches: false, addEventListener(_name, f) { this.change = f; } }, win = {}, draws = [], view = { applied: [], clears: 0 };
  const wipe = { model: createCraftModel(), follows: [] };
  let tick = null, now = 0;
  const renderer = { setAtlas() {}, draw(pieces, v, look) { draws.push({ look }); } };
  const observer = class { observe() {} };
  const player = playerSource.replace(/^import\s+.*?;\s*$/gm, '');
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  await new AsyncFunction('env', `const { sceneEnvelope, location, document, window, matchMedia, createRenderer, makeCamera, dot, corners, makeAtlas, fontsReady, SHOW, LOOP, SCENES, BLOCK, POOL, sceneAt, frameAt, calloutsAt, createCallouts, createPageLayout, createNameReact, createStars, starReach, createCraftWipe, ENTRANCE, entranceAt, screenPlane, floorReach, createEntranceView, devicePixelRatio, requestAnimationFrame, cancelAnimationFrame, IntersectionObserver, ResizeObserver } = env;\n${player}`)({
    location: { search: '' }, document: { querySelector: () => hero, fonts: { ready: Promise.resolve(), addEventListener() {} }, hidden: false, addEventListener() {} }, window: win, matchMedia: () => media,
    createCraftWipe: () => ({ measure() {}, hold: () => null, follow(craft, o) { wipe.follows.push(!!o?.cut); followCraft(wipe.model, craft, now / 1000, { ...o, reduced: media.matches }); }, state: null }),
    createRenderer: () => renderer, makeCamera, dot, corners, makeAtlas: () => ({}), fontsReady: async () => {},
    sceneEnvelope, SHOW, LOOP, SCENES, BLOCK, POOL, sceneAt, frameAt, calloutsAt, createCallouts: () => ({ draw() {}, fit: v => v, layout: [] }),
    createNameReact: () => ({ measure() {}, setLive() {}, live: false, open: 0, letters: [] }), createStars: () => ({ measure() {}, frame: () => null, after() {}, swallowClick: () => false, field: null }), starReach: () => null, createPageLayout: () => ({ measure() {}, cover() {}, get metrics() { return { h: hero.rect, b: stage.rect, nameLines: [] }; }, view(need, cam, dpr) { const h = hero.rect, b = stage.rect, S = Math.min(b.width / need.w, b.height / need.h); return { W: h.width, H: h.height, S, cx: b.left + b.width / 2 - S * need.x, cy: b.top + b.height / 2 + S * need.y, cam, dpr }; } }),
    ENTRANCE: E.ENTRANCE, entranceAt: E.entranceAt, screenPlane: E.screenPlane, floorReach: E.floorReach,
    createEntranceView: () => ({ measure() {}, apply(s) { view.applied.push(s); }, clear() { view.clears++; }, lines: 3 }),
    devicePixelRatio: 1, requestAnimationFrame: f => { tick = f; return 1; }, cancelAnimationFrame() {}, IntersectionObserver: observer, ResizeObserver: observer,
  });
  const run = seconds => { for (let n = 0; n < Math.round(seconds / 0.05); n++) { now += 50; tick(now); } };
  tick(now);
  return { win, draws, view, crafts, pause, stage, media, run, wipe };
}

function near(a, b, message) { close(a, b, message, 1e-6); }

async function checkPlayer(playerSource, E) {
  const starts = SHOW.map((_, i) => SHOW.slice(0, i).reduce((sum, scene) => sum + scene.len, 0));
  // A whole entrance: held loop until 1.1, then the loop runs from 0; the floor hover waits for 0.9.
  let p = await runPlayer(playerSource, E);
  assert.equal(p.win.__ready, true);
  near(p.win.__hero.entering, 0, 'E1 player: entrance starts at the first frame');
  p.run(0.85); near(p.win.__hero.entering, 0.85, 'E1 player: entrance clock'); near(p.win.__hero.t, 0, 'E1 player: loop clock held before the screen ends');
  assert.equal(p.draws.at(-1).look.floor.pointer, undefined, 'F3 player: the floor has a hover point');
  assert.ok(p.draws.at(-1).look.reveal && p.draws.at(-1).look.floor.reveal > 0 && p.draws.at(-1).look.floor.reveal < 4.8, 'E1 player: renderer reveal values');
  p.run(0.35); near(p.win.__hero.t, 0.1, 'E1 player: loop clock starts at 0 when the screen wipe ends');
  assert.equal(p.draws.at(-1).look.floor.pointer, undefined, 'F3 player: the floor has a hover point');
  assert.equal(p.draws.at(-1).look.reveal, null, 'E1 player: screen clip after 1.1');
  p.run(0.2); assert.equal(p.win.__hero.entering, null, 'E1 player: entrance ends at 1.4'); near(p.win.__hero.t, 0.3, 'E1 player: loop clock at the entrance end');
  assert.ok(p.view.clears > 0 && p.draws.at(-1).look.floor.reveal === undefined, 'E1 player: entrance styles remain');
  p.run(1); near(p.win.__hero.t, 1.3, 'E1 player: loop keeps playing');
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
  p.win.__hero.entrance(1.3); near(p.win.__hero.t, 0.2, 'E2 hold loop clock after 1.1');
  p.win.__hero.entrance(null); assert.equal(p.win.__hero.entering, null, 'E2 release'); p.run(0.5); assert.ok(p.win.__hero.t > 0.2, 'E2 release does not play');
  // Reduced motion: no entrance at all.
  p = await runPlayer(playerSource, E); p.media.matches = true; p.media.change(); assert.equal(p.win.__hero.entering, null, 'E1 reduced motion keeps the entrance');
  return 6;
}

export async function checkEntrance({ entranceSource = read('entrance.mjs'), playerSource = read('play.mjs'), stageSource = read('stage.mjs') } = {}) {
  const E = await loadEntrance(entranceSource);
  const dots = checkTimetable(E);
  const runs = await checkPlayer(playerSource, E);
  const labelSamples = await checkLabelExit(stageSource);
  return `E4 computed: ${labelSamples} label samples at off-0.30/0.25/0.20/0.10/0.01 s in four scenes, all listed until off, none at off; LOOP and scene lengths as the pre-E4 stage under the same scheduler. E1/E2 computed: timetable of 11 parts and 5 lede line counts; screen plane at 0, 0.5, 0.8, 1.1; floor circle ${dots} dot samples; ${runs} player runs (loop clock, no floor hover, craft/stage/Pause clicks, hold, reduced motion). Frames UNRUN here.`;
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
