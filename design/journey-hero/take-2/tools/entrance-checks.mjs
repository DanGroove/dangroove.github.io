import { sceneEnvelope } from '../view.mjs';
// Round 6 (E1/E2): the entrance's timetable and the player's handling of it, in Node. No browser; DOM and GL are stand-ins.
// checkEntrance() checks the real sources; ENTRANCE_CONTROLS are one-site faults that must each be caught.
//   node design/journey-hero/take-2/tools/entrance-checks.mjs [--controls]
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeCamera, dot, EASE } from '../../../../public/journey/hero/engine.mjs';
import { corners } from '../kit.mjs';
import { inflateRawSync } from 'node:zlib';
import { handPatch, r12Patch } from './hand-patch.mjs';
import { SHOW, LOOP, SCENES, BLOCK, POOL, SCREEN, sceneAt, frameAt, calloutsAt } from '../stage.mjs';
import { createCraftModel, followCraft } from '../craft-wipe.mjs';
import { pageMarkup, LOADER_CSS, LOADER_SKIP, LOADER_SCRIPT } from './page.mjs';
import { previewMarkup } from './preview.mjs';
import { checkL12, checkL12Groups, checkL12Controls } from './l12-checks.mjs';
import { checkLoaderLanding, checkLoaderMoves, checkLoaderRoundness, checkLoaderDurations, checkLoaderPop } from './loader-checks.mjs';

const TAKE = new URL('../', import.meta.url);
// Source mutations match lines, irrespective of this checkout's CRLF/LF convention.
const read = name => fs.readFileSync(new URL(name, TAKE), 'utf8').replace(/\r\n/g, '\n');
const close = (a, b, message, epsilon = 1e-9) => assert.ok(Math.abs(a - b) <= epsilon, `${message}: ${a} != ${b}`);

export const ENTRANCE_CONTROLS = [
  { id: 'timetable', file: 'entrance.mjs', search: 'starts: [0.3, 0.5]', replacement: 'starts: [0.3, 0.3]', gate: 'E1 timetable: Endrawes' },
  { id: 'labels-cut', file: 'stage.mjs', search: 'grow: Math.min(growIn, growOut), text: Math.min(textIn, textOut) }];', replacement: 'grow: growIn, text: textIn }];', gate: 'E4 labels:' },
  { id: 'click', file: 'play.mjs', search: 'function choose(craft) {\n  endEntrance(); first = false;\n', replacement: 'function choose(craft) {\n', gate: 'E1 click: craft' },
  { id: 'old-screen', file: 'entrance.mjs', search: 'screen: [2.2, 3.5],', replacement: 'screen: [0.5, 1.1],', gate: 'L12 groups:' },
  { id: 'fast-gather', file: 'loader-stars.mjs', search: 'gatherSeconds: 1.4', replacement: 'gatherSeconds: 0.7', gate: 'L4 timing:' },
  { id: 'wrong-mark', file: 'loader-stars.mjs', search: 'const x = centre[0] + p.x,', replacement: 'const x = centre[0] + p.x + 1,', gate: 'L4 consistency:' },
  { id: 'star-ring', file: 'entrance.mjs', search: 'stars: null,', replacement: 'stars: [1.8, 2.8],', gate: 'L4 entrance:' },
  { id: 'entrance-with-burst', file: 'loader-stars.mjs', search: 'const entranceStart = end;', replacement: 'const entranceStart = burstStart;', gate: 'L5 groups:' },
  { id: 'smoothstep-burst', file: 'loader-stars.mjs', search: 'blend = 1 - (1 - p) ** 3', replacement: 'blend = p * p * (3 - 2 * p)', gate: 'L7 explosion curve:' },
  { id: 'quartic-flight', file: 'loader-stars.mjs', search: 'const t = 1 - (1 - flight) ** 3,', replacement: 'const t = 1 - (1 - flight) ** 4,', gate: 'L7 flight curve:' },
  { id: 'v35-burst', file: 'loader-stars.mjs', search: 'burst: 1.8,', replacement: 'burst: 1.2,', also: [['blend = 1 - (1 - p) ** 3', 'blend = 1 - (1 - p) ** 4']], gate: 'L7 explosion curve:' },
  { id: 'no-shrink', file: 'loader-stars.mjs', search: '1 - 0.22 * cubicInOut(shrink)', replacement: '1', gate: 'L7 scale:' },
  { id: 'index-homes', file: 'loader-stars.mjs', search: '  for (let rank = 0; rank < paired; rank++) {\n    const i = markOrder[Math.floor(rank * points.length / paired)], home = homeOrder[Math.floor(rank * homes.length / paired)];\n    points[i].home = home; used.add(home);\n  }', replacement: '  for (let i = 0; i < points.length; i++) { points[i].home = i % homes.length; used.add(i % homes.length); }', gate: 'L7 angle order:' },
  { id: 'old-burst-entrance', file: 'loader-stars.mjs', search: 'const entranceStart = end;', replacement: 'const entranceStart = burstStart + 0.9;', gate: 'L5 groups:' },
  { id: 'early-entrance', file: 'loader-stars.mjs', search: 'const entranceStart = end;', replacement: 'const entranceStart = end - 0.05;', gate: 'L5 timing:' },
  { id: 'edge-leftovers', file: 'loader-stars.mjs', search: '  return { W, H, centre, weight, mark, points, homes, unpairedHomes, duration, wave };', replacement: '  if (homes.length < points.length) for (const i of markOrder.slice(homes.length)) { points[i].home = null; points[i].exit = [W + 5, H + 5]; }\n  return { W, H, centre, weight, mark, points, homes, unpairedHomes, duration, wave };', gate: 'L8 landing:' },
  { id: 'single-duration', file: 'loader-stars.mjs', search: '3 * length / (2 * longest * (0.8 + 0.4 * home.d) * (0.94 + 0.12 * hash(i, 21)))', replacement: '1.6', gate: 'L10 duration:' },
  { id: 'dots-without-streaks', file: 'loader-stars.mjs', search: 'dots.push({ x, y, ...trail(x, y, [previous.x, previous.y]),', replacement: 'dots.push({ x, y, streak: 0,', gate: 'L9 streak:' },
  { id: 'simultaneous-field-fade', file: 'loader-stars.mjs', search: 'clamp01((elapsed - start) / 0.2)', replacement: 'clamp01(elapsed / scene.duration)', gate: 'L9 wave:' },
  { id: 'no-depth-growth', file: 'loader-stars.mjs', search: '1.6 * Math.max(0, target.d - 0.4)', replacement: '0 * Math.max(0, target.d - 0.4)', gate: 'L9 size:' },
  { id: 'no-flare', file: 'loader-stars.mjs', search: '1 + 0.7 * (1 - clamp01(elapsed / 0.3)) ** 3', replacement: '1', gate: 'L9 size:' },
  { id: 'no-charge', file: 'loader-stars.mjs', search: '1 + 0.3 * cubicInOut(clamp01((time - shrinkStart) / (LOADER.shrink + LOADER.compressed)))', replacement: '1', gate: 'L9 size:' },
  { id: 'no-painted-streaks', file: 'tools/page.mjs', search: 'if (dot.streak > dot.size)', replacement: 'if (false)', gate: 'L9 painter:' },
  { id: 'unresolved-landing', file: 'entrance.mjs', search: 'state: bridge ? now => loaderLanding(bridge.state(now), scene?.duration ?? LOADER.burst) : null,', replacement: 'state: bridge ? now => bridge.state(now) : null,', gate: 'L5 scene:' },
  { id: 'l9-depth-only', file: 'loader-stars.mjs', search: 'Math.min(1.8, Math.max(0.6,\n  3 * length / (2 * longest * (0.8 + 0.4 * home.d) * (0.94 + 0.12 * hash(i, 21)))))', replacement: '(1 + 0.6 * (1 - home.d)) * (0.94 + 0.12 * hash(i, 21))', gate: 'L10 roundness:', check: 'roundness' },
  { id: 'handover-pop', file: 'loader-stars.mjs', search: 'clamp01((elapsed - (scene.duration - 0.3)) / 0.3)', replacement: '0', gate: 'L10 pop:', check: 'pop' },
];

async function loadEntrance(source, loaderSource) {
  const url = new URL('entrance.mjs', TAKE);
  const fixed = source.replace(/from (['"])(\.{1,2}\/[^'"]+)\1/g, (_all, _quote, ref) => `from '${loaderSource && ref === './loader-stars.mjs' ? 'data:text/javascript;base64,' + Buffer.from(loaderSource).toString('base64') : new URL(ref, url).href}'`);
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

// Table rows are the groups: both name lines together; the floor ring alone (the star ring is dropped).
// The loader burst is a separate group. Cuts count at their instant only.
export const checkEntranceGroups = checkL12Groups;

export function checkLoaderTiming({ loaderAt, LOADER }) {
  const all = { fonts: 0, atlas: 0, frame: 0 }, at = t => loaderAt(t, all);
  close(LOADER.launchEnd, 0.85, 'L4 timing: launch shares end at .85');
  close(LOADER.gatherSeconds, 1.4, 'L4 timing: gathering faster than 1.4 s');
  close(LOADER.flight, 1.0, 'L7 flight curve: duration'); close(LOADER.hold, 0.15, 'L7 timing: hold');
  close(LOADER.shrink, 0.35, 'L9 timing: shrink'); close(LOADER.compressed, 0.08, 'L9 timing: compressed hold'); close(LOADER.swell, 0.18, 'L9 timing: swell'); close(LOADER.burst, 1.8, 'L7 explosion curve: duration bound');
  close(at(0).fill, 0, 'L4 timing: first paint progress');
  close(at(0).formedAt, 2.4, 'L4 timing: launches plus last flight');
  close(at(0).holdAt, 2.4, 'L7 timing: hold start');
  close(at(0).shrinkStart, 2.55, 'L7 timing: .15 formed hold');
  close(at(0).compressedStart, 2.9, 'L9 timing: .35 shrink');
  close(at(0).swellStart, 2.98, 'L9 timing: .08 compressed hold');
  close(at(0).burstStart, 3.16, 'L9 timing: .18 swell');
  for (const [time, phase] of [[2.4, 'hold'], [2.55, 'shrink'], [2.9, 'compressed'], [2.98, 'swell'], [3.16, 'burst'], [4.96, 'entrance']]) {
    assert.equal(at(time).phase, phase, 'L7 timing: phase boundary');
  }
  close(at(0).end, 4.96, 'L9 timing: conservative explosion bound');
  close(at(0).entranceStart, 4.96, 'L5 timing: entrance starts at landing');
  assert.ok(at(3.16 - 1e-8).burstTime === null && at(3.16).phase === 'burst', 'L4 timing: burst boundary');
  assert.equal(at(3.16).entranceTime, null, 'L5 timing: entrance at burst start');
  assert.equal(at(4.96 - 1e-8).entranceTime, null, 'L5 timing: entrance before landing');
  assert.ok(!at(4.96 - 1e-8).done && at(4.96).done, 'L4 timing: endpoint handover');
  close(at(4.96).entranceTime, 0, 'L5 timing: entrance zero at landing');
  close(at(5.21).entranceTime, 0.25, 'L5 timing: entrance after landing');
  assert.ok(!at(4.96 - 1e-8).pointer && at(4.96).pointer, 'L4 timing: pointer handover');
  const launches = at(0).launches;
  close(launches[0], 0, 'L4 timing: first launch'); close(launches.at(-1), 1.4, 'L4 timing: last launch');
  assert.equal(launches.length, 600, 'L4 timing: count');
  for (let i = 1; i < 600; i++) assert.ok(launches[i] > launches[i - 1], 'L4 timing: launch order');
  let samples = 0;
  const boots = [all, {}, { fonts: 0.2 }, { fonts: 0.1, atlas: 1.2 }, { fonts: 0.13, atlas: 0.23, frame: 0.41 }, { fonts: 0.2, atlas: 1.7, frame: 3.01 }];
  for (const boot of boots) {
    let prev = loaderAt(0, boot);
    for (let n = 1; n <= 6000; n++) {
      const t = n / 1000, s = loaderAt(t, boot), delta = s.fill - prev.fill;
      assert.ok(s.fill >= 0 && s.fill <= s.target && s.target <= 1 && Number.isFinite(s.burst), 'L4 timing: finite bounded progress');
      assert.ok(delta >= -1e-12 && delta <= 0.001 * 0.85 / 1.4 + 1e-12, 'L4 timing: progress jumps, reverses or exceeds launch speed');
      assert.ok(s.arrived >= prev.arrived && s.arrived <= 600, 'L4 timing: arrived count reverses');
      if (s.done) assert.ok(s.arrived === 600 && s.fill === 1 && s.burst === 1 && t >= Math.max(...Object.values(boot)), 'L4 timing: ends before ready/arrivals');
      assert.equal(s.entranceTime !== null, s.done, 'L5 timing: entrance before burst ended');
      assert.equal(s.pointer, s.done, 'L5 timing: pointer differs from landing');
      assert.equal(s.entranceStart, s.end, 'L5 timing: entrance and handover differ');
      prev = s; samples++;
    }
    for (const time of Object.values(boot)) close(loaderAt(time - 1e-9, boot).fill, loaderAt(time, boot).fill, 'L4 timing: boot jumps progress', 2e-9);
  }
  // A plateau really pauses launches; flight already in progress still finishes.
  const paused = { fonts: 0 };
  assert.equal(loaderAt(1.5, paused).arrived, loaderAt(3, paused).arrived, 'L4 timing: progress invents launches at a plateau');
  assert.equal(loaderAt(20, paused).done, false, 'L4 timing: missing boot step');
  const late = { fonts: 0, atlas: 0, frame: 10 }, s = loaderAt(10, late);
  close(s.holdAt, 10 + 0.1 * 1.4 / 0.85 + 1.0, 'L4 timing: waits for last flight after final progress');
  for (const [time, target] of [[0, 0], [0.2, 0.25], [1.7, 0.75], [3.01, 1]]) {
    const state = loaderAt(time, { fonts: 0.2, atlas: 1.7, frame: 3.01 }, { reduced: true });
    assert.equal(state.fill, target, 'L4 timing: reduced real shares');
    assert.ok(state.reduced && state.arrived === 600 && state.burst === 0 && state.entranceStart === null, 'L4 timing: reduced formed still');
    assert.equal(state.done, time >= 3.01, 'L4 timing: reduced ready cut');
  }
  assert.ok(loaderAt(0, {}, { review: true }).done, 'L4 timing: review skip');
  return samples;
}

async function checkLoaderGeometry(P) {
  const S = await import('../stars.mjs');
  const header = pageMarkup().match(/<a[^>]*data-mark[^>]*>([\s\S]*?<\/svg>)/)[1];
  const paths = [...header.matchAll(/<path\b[^>]*>/g)].map(([p]) => ({ d: p.match(/\bd="([^"]+)"/)[1], fill: p.match(/\bfill="([^"]+)"/)[1] }));
  assert.equal(paths.length, 3, 'L4 consistency: actual header artwork');
  const sample = S.sampleMark(paths), all = { fonts: 0, atlas: 0, frame: 0 };
  assert.deepEqual(P.sampleMark(paths), sample, 'L4 consistency: sample order');
  let comparisons = 0;
  const moves = [], landings = [], blasts = [], roundness = [], pops = [];
  for (const [W, H] of [[1440, 900], [768, 1024], [390, 844]]) {
    const scene = P.loaderScene(sample, W, H), mark = S.placeMark(sample, W, H);
    assert.equal(scene.points.length, S.STARS.mark.count, 'L4 consistency: mark count');
    for (const [i, p] of scene.points.entries()) {
      close(p.x, W / 2 + mark.points[i].x, `L4 consistency: mark x ${W}/${i}`);
      close(p.y, H / 2 + mark.points[i].y, `L4 consistency: mark y ${W}/${i}`);
      assert.equal(p.size, S.STARS.mark.size, 'L4 consistency: size');
      assert.equal(p.flag, S.markFlag(mark.points[i].kind), 'L4 consistency: colour flag');
      const hex = S.FLAG_INK[p.flag];
      assert.deepEqual(p.colour, [1, 3, 5].map(k => parseInt(hex.slice(k, k + 2), 16)), 'L4 consistency: colour');
      assert.equal(p.edge, i % 4, 'L4 launch: four edges');
      const [x, y] = p.start;
      assert.ok(x < 0 || x > W || y < 0 || y > H, 'L4 launch: not outside screen'); comparisons++;
    }
    const formed = P.loaderDots(scene, P.loaderAt(2.4, all));
    formed.forEach((dot, i) => { close(dot.x, scene.points[i].x, 'L4 flight: endpoint x'); close(dot.y, scene.points[i].y, 'L4 flight: endpoint y'); });
    // Each flight has its own 1 s span, not 1 s from the global clock.
    for (const i of [0, 100, 300, 599]) {
      const launch = P.loaderAt(0, all).launches[i];
      assert.ok(P.loaderAt(launch + 1.0 - 1e-9, all).arrived <= i, 'L4 flight: early arrival');
      assert.ok(P.loaderAt(launch + 1.0 + 1e-9, all).arrived >= i + 1, 'L4 flight: late arrival');
    }
    landings.push(checkLoaderLanding(P, scene));
    pops.push(checkLoaderPop(P, scene));
    blasts.push(checkLoaderDurations(P, scene));
    if (W === 1440 || W === 390) moves.push(checkLoaderMoves(P, scene));
    const sceneAt = t => P.loaderLanding(P.loaderAt(t, all), scene.duration), landing = sceneAt(0).end;
    const end = P.loaderDots(scene, sceneAt(landing)), field = S.makeStars(W, H);
    assert.equal(end.filter(d => d.alpha > 0).length, field.length, 'L4 homes: changes field count');
    for (const d of end.filter(d => d.alpha > 0)) {
      const home = field[d.home];
      assert.equal(d.alpha, 1, 'L4 homes: alpha'); assert.equal(d.flag, 0, 'L4 homes: field flag');
      assert.equal(d.x, Math.fround(home.x), 'L4 homes: x'); assert.equal(d.y, Math.fround(home.y), 'L4 homes: y');
      close(d.size, Math.fround(home.size), 'L4 homes: size');
      assert.deepEqual(d.colour, scene.homes[d.home].colour, 'L4 homes: colour'); comparisons++;
    }
    const still = P.loaderDots(scene, P.loaderAt(0, {}, { reduced: true }));
    assert.equal(still.length, 600, 'L4 reduced: formed count');
    assert.deepEqual(still.map(p => [p.x, p.y]), scene.points.map(p => [p.x, p.y]), 'L4 reduced: formed geometry');
    // Shared phone trajectories meet the same single terminal dot at their home.
    const before = P.loaderDots(scene, sceneAt(landing - 1e-7));
    const byHome = new Map(end.map(d => [d.home, d]));
    before.forEach(d => {
      const landed = byHome.get(d.home);
      assert.ok(landed && Math.hypot(d.x - landed.x, d.y - landed.y) < 0.001, 'L4 homes: endpoint jump');
      assert.ok(Math.abs(d.alpha - landed.alpha) < 0.001, 'L4 homes: endpoint alpha jump');
    });
    roundness.push(scene);
  }
  const scrolled = P.loaderScene(sample, 390, 900, { width: 390, height: 664, left: 0, top: -120 });
  close(scrolled.points[0].y, 664 / 2 + 120 + S.placeMark(sample, 390, 900).points[0].y, 'L4 consistency: first screen centre');
  const landed = P.loaderDots(scrolled, P.loaderLanding(P.loaderAt(3.16 + scrolled.duration, all), scrolled.duration));
  const home = S.makeStars(390, 900)[0], dot = landed.find(d => d.home === 0);
  close(dot.y, Math.fround(home.y) - 120 * S.STARS.scroll * Math.fround(home.d), 'L4 homes: scroll offset');
  return { comparisons, moves, landings, blasts, roundness, pops };
}

function checkLoaderMarkup() {
  const html = pageMarkup(), offline = previewMarkup(), stills = pageMarkup('stills');
  for (const page of [html, offline]) {
    assert.ok(page.includes(LOADER_CSS) && page.includes(LOADER_SKIP) && page.includes(LOADER_SCRIPT), 'L4 markup: identical inline runtime/CSS');
    assert.ok(page.includes('hero is-entering is-loading') && page.includes('data-loader-stars'), 'L4 markup: first-paint canvas');
    assert.ok(page.indexOf(LOADER_CSS) < page.indexOf('data-loader-stars'), 'L4 markup: CSS before loader');
    assert.ok(page.indexOf('data-hero>') < page.indexOf(`<script>${LOADER_SCRIPT}`) && page.indexOf(`<script>${LOADER_SCRIPT}`) < page.indexOf('<script type="module"'), 'L4 markup: module-independent startup');
    assert.ok(!page.includes('data-loader-fill'), 'L4 markup: obsolete track');
  }
  assert.ok(!stills.includes('data-loader-stars'), 'L4 markup: still tools gained loader');
  assert.ok(!/transition:|animation:|opacity:|border-radius:/.test(LOADER_CSS), 'L4 markup: hard overlay');
  new Function(LOADER_SCRIPT);
  assert.ok(LOADER_SCRIPT.includes('transferControlToOffscreen') && LOADER_SCRIPT.includes('new Worker(url)') && LOADER_SCRIPT.includes('painter.paint(state('), 'L4 markup: worker and retained-frame fallback');
}

// Execute the actual inline bootstrap and Blob worker in isolated Node contexts. These record draw commands,
// not pixels: they prove independent clocks, messages, fallback, reduced motion and synchronous review bypass.
function checkInlineLoader(E, P, painterSource = read('tools/page.mjs')) {
  const painter = source => source.slice(source.indexOf('function canvasPainter('), source.indexOf('\nfunction loaderWorker(')).trim();
  const inlineScript = LOADER_SCRIPT.replace(/\r\n/g, '\n').replace(painter(read('tools/page.mjs')), painter(painterSource));
  const header = pageMarkup().match(/<a[^>]*data-mark[^>]*>([\s\S]*?<\/svg>)/)[1];
  const paths = [...header.matchAll(/<path\b[^>]*>/g)].map(([p]) => ({ d: p.match(/\bd="([^"]+)"/)[1], fill: p.match(/\bfill="([^"]+)"/)[1] }));
  let runs = 0;
  for (const mode of ['worker', 'main', 'worker-error', 'reduced', 'review']) {
    let now = 0, mainRAF, workerRAF, fills = 0, clears = 0, removed = 0, replaced = 0, workerInstance;
    const scrollListeners = new Set();
    const classes = new Set(), media = { matches: mode === 'reduced', addEventListener() {} };
    let triangles = [], heads = [], pathPoints = [];
    const context2d = {
      setTransform() {}, clearRect() { clears++; triangles = []; heads = []; }, fillRect() { fills++; },
      createRadialGradient(...args) { heads.push(args); return { addColorStop() {} }; },
      beginPath() { pathPoints = []; }, moveTo(x, y) { pathPoints.push([x, y]); }, lineTo(x, y) { pathPoints.push([x, y]); },
      closePath() {}, fill() { triangles.push({ points: pathPoints, colour: this.fillStyle }); },
    };
    const makeCanvas = () => ({ getContext: () => context2d, cloneNode: () => makeCanvas(), replaceWith() { replaced++; }, transferControlToOffscreen: () => makeCanvas() });
    const canvas = makeCanvas(), overlay = { querySelector: () => canvas, remove() { removed++; } };
    const hero = { querySelector: () => overlay, querySelectorAll: () => paths.map(p => ({ getAttribute: k => p[k] })),
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 1440, height: 900 }),
      classList: { toggle(k, v) { if (v) classes.add(k); else classes.delete(k); }, remove(k) { classes.delete(k); } } };
    const urls = new Map(), performance = { timeOrigin: 1000000, now: () => now * 1000 };
    const env = { console, URLSearchParams, location: { search: mode === 'review' ? '?t=0' : '' }, performance,
      document: { querySelector: () => hero }, window: { addEventListener(_name, f) { scrollListeners.add(f); }, removeEventListener(_name, f) { scrollListeners.delete(f); } }, innerWidth: 1440, innerHeight: 900, devicePixelRatio: 1,
      matchMedia: () => media, requestAnimationFrame: f => { mainRAF = f; return 1; }, cancelAnimationFrame() {},
      Blob: class { constructor(parts) { this.code = parts.join(''); } },
      URL: { createObjectURL(blob) { urls.set('blob:local', blob.code); return 'blob:local'; }, revokeObjectURL() {} },
    };
    if (mode === 'worker' || mode === 'worker-error' || mode === 'reduced') {
      env.OffscreenCanvas = function () {};
      env.Worker = class {
        constructor(url) {
          workerInstance = this;
          const workerEnv = { performance, postMessage: data => this.onmessage?.({ data }), close() {}, cancelAnimationFrame() {} };
          if (mode !== 'worker-error') workerEnv.requestAnimationFrame = f => { workerRAF = f; return 1; };
          this.context = vm.createContext(workerEnv);
          vm.runInContext(urls.get(url), this.context);
        }
        postMessage(data) { try { this.context.onmessage({ data }); } catch (e) { this.onerror?.(e); } }
        terminate() { this.terminated = true; }
      };
    }
    vm.runInNewContext(inlineScript, env);
    const bridge = env.window.__loaderStars;
    if (mode === 'review') { assert.ok(!bridge && fills === 0 && clears === 0, 'L4 inline: review bypass'); runs++; continue; }
    assert.equal(bridge.mode, mode === 'worker' ? 'worker' : 'main', 'L4 inline: backend');
    hero.ownerDocument = { defaultView: env.window };
    env.window.innerWidth = 1440; env.window.innerHeight = 900;
    const view = E.createLoaderView(hero); view.measure(hero.getBoundingClientRect());
    if (mode === 'reduced') {
      assert.ok(!workerInstance && fills === 600, 'L4 inline: reduced formed before first rAF');
      for (const k of ['fonts', 'atlas', 'frame']) bridge.boot(k);
      assert.ok(bridge.state(0).done, 'L4 inline: reduced ready cut');
    } else {
      for (const k of ['fonts', 'atlas', 'frame']) bridge.boot(k);
      const animate = () => mode === 'worker' ? workerRAF() : mainRAF(now * 1000);
      animate(); now = 0.35; animate();
      assert.ok(fills > 0, 'L4 inline: no stars fly');
      const scene = P.loaderScene(P.sampleMark(paths), 1440, 900);
      close(view.state(now).end, 3.16 + scene.duration, 'L5 scene: resolved landing');
      const checkPaint = () => {
        const dots = P.loaderDots(scene, P.loaderAt(now, { fonts: 0, atlas: 0, frame: 0 })).filter(d => d.alpha > 0);
        const streaks = dots.filter(d => d.streak > d.size);
        if (now < 3.16) assert.equal(streaks.length, 0, 'L13 painter: gathering dots only');
        else assert.ok(streaks.length > 0, 'L9 painter: vacuous burst frame');
        assert.equal(triangles.length, streaks.length, 'L9 painter: missing tapered strokes');
        assert.equal(heads.length, dots.length, 'L9 painter: missing round heads');
        streaks.forEach((d, i) => {
          const [tail, a, b] = triangles[i].points;
          close(tail[0], d.tail[0], 'L9 painter: tail x'); close(tail[1], d.tail[1], 'L9 painter: tail y');
          close(Math.hypot(a[0] - b[0], a[1] - b[1]), d.size, 'L9 painter: full head width');
          close((a[0] + b[0]) / 2, d.x, 'L9 painter: head x'); close((a[1] + b[1]) / 2, d.y, 'L9 painter: head y');
          close((a[0] - b[0]) * (d.x - tail[0]) + (a[1] - b[1]) * (d.y - tail[1]), 0, 'L9 painter: perpendicular taper', 1e-8);
          assert.equal(triangles[i].colour, `rgba(${d.colour.map(n => n.toFixed(4)).join(',')},${d.alpha * Math.min(1, d.size)})`, 'L9 painter: own colour');
        });
      };
      checkPaint();
      const frozen = clears;
      if (mode === 'worker') {
        now = 0.7; workerRAF();
        assert.ok(clears > frozen && !mainRAF, 'L4 inline: worker waits for main-thread rAF');
      } else assert.equal(clears, frozen, 'L4 inline: fallback did not retain its last frame');
      now = 3.16; animate(); view.apply(view.state(now));
      assert.ok(classes.has('is-bursting'), 'L4 inline: burst backing stays transparent');
      assert.equal(view.state(now).entranceTime, null, 'L5 inline: entrance starts with burst');
      now += 0.05; animate(); checkPaint();
      now = view.state(now).end - 0.05; animate();
      assert.ok(!view.state(now).done && view.state(now).entranceTime === null, 'L5 inline: early handover');
      now = view.state(now).end; const beforeLanding = fills; animate();
      assert.equal(fills - beforeLanding, 1200, 'L5 inline: terminal frame is the whole field');
      assert.ok(view.state(now).done && view.state(now).pointer, 'L4 inline: handover clock');
      near(view.state(now).entranceTime, 0, 'L5 inline: entrance zero at landing');
      hero.getBoundingClientRect = () => ({ left: 0, top: -120, width: 1440, height: 900 });
      for (const listener of scrollListeners) listener();
      const scrolled = P.loaderScene(P.sampleMark(paths), 1440, 900, { width: 1440, height: 900, left: 0, top: -120 });
      close(view.state(now).end, 3.16 + scrolled.duration, 'L5 scene: scrolled landing matches painter');
      env.innerWidth = env.window.innerWidth = 390; env.innerHeight = env.window.innerHeight = 844;
      bridge.measure({ left: 0, top: 0, width: 390, height: 844 });
      // Resize no longer guarantees phone landing precedes desktop; sample its own terminal frame.
      // One 240 Hz step clears the worker's epoch-subtraction rounding at the exact boundary.
      now = 3.16 + P.loaderScene(P.sampleMark(paths), 390, 844).duration + 1 / 240;
      const beforePhone = fills; animate();
      assert.equal(fills - beforePhone, 305, 'L8 inline: terminal phone draws each shared home once');
      bridge.motion(true);
    }
    view.clear();
    assert.ok(removed === 1 && scrollListeners.size === 0 && !classes.has('is-bursting'), 'L4 inline: disposal');
    if (mode === 'worker') assert.ok(workerInstance.terminated && replaced === 0, 'L4 inline: worker shutdown');
    if (mode === 'worker-error') assert.ok(replaced === 1, 'L4 inline: failed transfer fallback');
    runs++;
  }
  return runs;
}

function checkTimetable(E) {
  const { entranceAt, screenPlane, floorReach, revealDot, revealPool, loopAt, staggerSpans } = E;
  const at = time => entranceAt(time, { ledeLines: 3 }), before = t => t - 1e-3, after = t => t + 1e-6;
  // Each part: nothing before its start, something just after, complete at its end and not before.
  const part = (name, get, start, end) => {
    assert.equal(get(at(before(start))), 0, `E1 timetable: ${name} before ${start}`);
    assert.ok(get(at(after(start))) > 0, `E1 timetable: ${name} after ${start}`);
    assert.ok(get(at(before(end))) < 1, `E1 timetable: ${name} done before ${end}`);
    assert.equal(get(at(end)), 1, `E1 timetable: ${name} at ${end}`);
  };
  const cut = (name, get, time) => { assert.equal(get(at(before(time))), false, `E1 timetable: ${name} before ${time}`); assert.equal(get(at(time)), true, `E1 timetable: ${name} at ${time}`); };
  for (const [i, span] of [[0, [0, .7]], [1, [.08, .78]]]) part('mark ' + i, s => s.mark[i], ...span);
  part('Journey', s => s.nav[0], .25, .85); part('Contact', s => s.nav[1], .33, .93);
  for (const [line, count] of [[0, 6], [1, 8]]) for (let j = 0; j < count; j++) {
    const a = [0.3, 0.5][line] + j * .055, b = a + .85, label = line ? 'Endrawes' : 'Danial';
    part(label + ' letter ' + j, s => s.name[line][j].reveal, a, b);
    close(at(a).name[line][j].weight, 300, 'E1 timetable: ' + label + ' weight starts at 300');
    close(at(b).name[line][j].weight, 800, 'E1 timetable: ' + label + ' weight ends at 800');
  }
  for (let i = 0; i < 23; i++) {
    const a = 1.15 + i * .028 + (i >= 3 ? .12 : 0);
    assert.deepEqual(E.wordSpan(i, i >= 3), [a, a + .7], 'E1 timetable: lede word ' + i);
  }
  [0, 1, 2, 3, 4].forEach(i => part('craft line ' + (i + 1), s => s.crafts[i], 3.1 + .1 * i, 3.5 + .1 * i));
  for (let i = 0; i < 4; i++) {
    const a = 3.172 + .1 * i;
    const actual = E.craftSpan(i); close(actual[0], a, 'E1 timetable: craft rise start'); close(actual[1], a + .6, 'E1 timetable: craft rise end');
  }
  part('floor', s => s.floor, 1.9, 2.9);
  part('screen', s => s.screen, 2.2, 3.5);
  part('camera', s => s.camera, 1.9, 3.9);
  part('Scroll for the journey', s => s.foot[0], 3.95, 4.5); part('Pause', s => s.foot[1], 4.03, 4.58);
  cut('floor hover', s => s.hover, 2.9);
  assert.ok(!at(before(4.6)).done && at(4.6).done, 'E1 timetable: ends at 4.6');
  for (const time of [0, 2.2, 3.4999, 3.5]) assert.equal(loopAt(time), 0, 'E1 timetable: loop clock before the screen ends');
  close(loopAt(4.6), 1.1, 'E1 timetable: loop clock at the end');
  const pieces = frameAt(0, { first: true });
  for (const time of [0, 2.199, 2.2, 2.8, 3.499]) assert.deepEqual(screenPlane(at(time).screen), [0, 1, 0, 0], 'E1 timetable: fixed floor clip');
  assert.equal(screenPlane(at(3.5).screen), null, 'E1 timetable: screen plane remains at 3.5');
  assert.ok(!pieces.some(pc => /Fig$/.test(pc.art || '')), 'E1 timetable: first pass shows Figma on the Photoshop screen');
  // The floor circle: radius 0 until 1.8, growing to the pool's edge at 2.8; each dot wholly on or off by its centre.
  const radius = 4.8, centre = POOL;
  let dots = 0;
  for (let n = 0, last = -1; n <= 92; n++) {
    const time = n / 20;
    const reach = floorReach(at(time).floor, radius);
    if (time < 1.9) assert.equal(reach, 0, 'E1 timetable: floor circle before 1.9');
    else if (time >= 2.9) assert.equal(reach, null, 'E1 timetable: floor circle after 2.9');
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
async function runPlayer(playerSource, E, { review = false, reduced = false, withLoader = false, fonts = Promise.resolve(), pageFonts = Promise.resolve(), duringBoot, firstDrawSeconds = 0, inlineModel } = {}) {
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
  const media = { matches: reduced, addEventListener(_name, f) { this.change = f; } }, win = {}, draws = [], view = { applied: [], clears: 0 }, loaderStates = [], live = [], events = [], field = {};
  let starOptions;
  const wipe = { model: createCraftModel(), follows: [] };
  let tick = null, now = 0;
  if (inlineModel) {
    const { P, paths, W, H } = inlineModel;
    Object.assign(hero.rect, { width: W, height: H });
    win.innerWidth = W; win.innerHeight = H; win.addEventListener = () => {}; win.removeEventListener = () => {};
    hero.ownerDocument = { defaultView: win };
    hero.querySelectorAll = selector => selector === '[data-mark] path' ? paths.map(p => ({ getAttribute: k => p[k] })) : crafts;
    win.__loaderStars = { state: time => P.loaderAt(time, { fonts: 0, atlas: 0, frame: 0 }), boot() {}, measure() {}, apply() {}, clear() {} };
  }
  const renderer = { setAtlas() {}, draw(pieces, v, look) { if (!draws.length) now += firstDrawSeconds * 1000; draws.push({ look }); events.push({ kind: 'draw', look, now }); } };
  const observer = class { observe() {} };
  const player = playerSource.replace(/^import\s+.*?;\s*$/gm, '');
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  const execution = new AsyncFunction('env', `const { sceneEnvelope, exitBursts, sparkFrame, kickExportBursts, location, document, window, matchMedia, createRenderer, makeCamera, dot, corners, makeAtlas, fontsReady, SHOW, LOOP, SCENES, BLOCK, POOL, sceneAt, frameAt, calloutsAt, createCallouts, createPageLayout, createNameReact, createStars, starReach, createCraftWipe, ENTRANCE, entranceAt, screenPlane, floorReach, liftPieces, settleView, createEntranceView, loaderAt, createLoaderView, performance, devicePixelRatio, requestAnimationFrame, cancelAnimationFrame, IntersectionObserver, ResizeObserver } = env;\n${player}`)({
    location: { search: review ? '?t=12.5' : '' }, document: { querySelector: () => hero, fonts: { ready: pageFonts, addEventListener() {} }, hidden: false, addEventListener() {} }, window: win, matchMedia: () => media,
    createCraftWipe: () => ({ measure() {}, hold: () => null, follow(craft, o) { wipe.follows.push(!!o?.cut); followCraft(wipe.model, craft, now / 1000, { ...o, reduced: media.matches }); }, state: null }),
    createRenderer: () => renderer, makeCamera, dot, corners, makeAtlas: () => ({}), fontsReady: () => fonts,
    sceneEnvelope, exitBursts: () => [], sparkFrame: () => null, kickExportBursts() {}, SHOW, LOOP, SCENES, BLOCK, POOL, sceneAt, frameAt, calloutsAt, createCallouts: () => ({ measure() {}, draw() {}, fit: v => v, layout: [] }),
    createNameReact: () => ({ measure() {}, setLive(on) { live.push(on); }, live: false, open: 0, letters: [] }), createStars: (_hero, options) => { starOptions = options; return { measure() {}, frame: () => field, after() {}, swallowClick: () => false, field: null }; }, starReach: () => null, createPageLayout: () => ({ measure() {}, cover() {}, get metrics() { return { h: hero.rect, b: stage.rect, nameLines: [] }; }, view(need, cam, dpr) { const h = hero.rect, b = stage.rect, S = Math.min(b.width / need.w, b.height / need.h); return { W: h.width, H: h.height, S, cx: b.left + b.width / 2 - S * need.x, cy: b.top + b.height / 2 + S * need.y, cam, dpr }; } }),
    ENTRANCE: E.ENTRANCE, entranceAt: E.entranceAt, screenPlane: E.screenPlane, floorReach: E.floorReach, liftPieces: E.liftPieces, settleView: E.settleView, loaderAt: E.loaderAt, createLoaderView: h => { const v = E.createLoaderView(h); return { ...v, clear() { events.push({ kind: 'clear', now }); v.clear(); }, apply(s) { loaderStates.push({ ...s, now }); v.apply(s); } }; }, performance: { now: () => now },
    createEntranceView: () => ({ measure() {}, apply(s) { view.applied.push(s); }, clear() { view.clears++; }, lines: 3 }),
    devicePixelRatio: 1, requestAnimationFrame: f => { tick = f; return 1; }, cancelAnimationFrame() {}, IntersectionObserver: observer, ResizeObserver: observer,
  });
  const run = seconds => { const until = now + seconds * 1000; while (now < until - 1e-8) { now = Math.min(until, now + 50); tick?.(now); } };
  const result = { win, draws, view, crafts, pause, stage, media, run, wipe, loaderStates, live, starOptions, events, field };
  if (duringBoot) await duringBoot(result);
  await execution;
  tick?.(now);
  if (!withLoader && !review) run(4.96);
  return result;
}

function near(a, b, message) { close(a, b, message, 1e-6); }

async function checkPlayer(playerSource, E, P) {
  const starts = SHOW.map((_, i) => SHOW.slice(0, i).reduce((sum, scene) => sum + scene.len, 0));
  // The first frame is ready underneath the loader; no loop/name/star interaction before its exit.
  let loading = await runPlayer(playerSource, E, { withLoader: true });
  assert.equal(loading.win.__ready, true, 'L4 player: first-frame readiness');
  assert.ok(loading.win.__hero.loading && loading.win.__hero.entering === null && loading.win.__hero.t === 0, 'L4 player: entrance/loop starts during loader');
  assert.deepEqual(loading.loaderStates.slice(0, 3).map(s => s.target), [0.25, 0.75, 1], 'L4 player: real boot shares');
  assert.ok(loading.loaderStates.slice(0, 3).every(s => s.fill === 0), 'L4 player: boot target jumps drawn fill');
  assert.ok(!loading.live.at(-1) && !loading.starOptions.open() && !loading.starOptions.available(), 'L4 player: interactive while loading');
  loading.run(2.4); assert.equal(loading.loaderStates.at(-1).phase, 'hold', 'L4 player: full hold');
  loading.run(0.15); assert.equal(loading.loaderStates.at(-1).phase, 'shrink', 'L7 player: shrink boundary');
  loading.run(0.35); assert.equal(loading.loaderStates.at(-1).phase, 'compressed', 'L9 player: compressed boundary');
  loading.run(0.08); assert.equal(loading.loaderStates.at(-1).phase, 'swell', 'L9 player: swell boundary');
  loading.run(0.18); assert.ok(loading.loaderStates.at(-1).fill === 1 && loading.loaderStates.at(-1).burst < 1e-9, 'L4 player: burst boundary');
  assert.equal(loading.win.__hero.entering, null, 'L5 player: entrance starts with burst');
  loading.run(1.75); assert.equal(loading.win.__hero.entering, null, 'L5 player: entrance advances during burst');
  assert.ok(!loading.starOptions.open(), 'L4 player: pointer before burst ends');
  loading.run(0.05); near(loading.win.__hero.entering, 0, 'L5 player: entrance zero at burst handover');
  assert.ok(loading.starOptions.open(), 'L4 player: pointer at landing');
  assert.equal(loading.win.__hero.loading, false, 'L4 player: overlay remains');
  assert.ok(loading.starOptions.available() && !loading.live.at(-1), 'L5 player: field/name state at landing');
  near(loading.view.applied.at(-1).time, 0, 'L5 player: handover skipped entrance zero');
  const [handover, removal] = loading.events.slice(-2);
  assert.ok(handover.kind === 'draw' && handover.look.stars === loading.field && removal.kind === 'clear' && handover.now === removal.now, 'L5 player: field draw must precede loader removal in the landing frame');
  assert.ok(loading.draws.slice(0, -1).every(d => d.look.stars === null), 'L5 player: WebGL stars shown during burst');
  const review = await runPlayer(playerSource, E, { review: true, withLoader: true });
  assert.ok(review.win.__ready && !review.win.__hero.loading && review.win.__hero.entering === null && review.loaderStates.length === 0, 'L4 player: ?t= does not skip both');
  near(review.win.__hero.t, 12.5, 'L4 player: review loop hold');
  review.win.__hero.entrance(0);
  assert.ok(review.starOptions.open(), 'L5 player: pointer closed at entrance zero hold');
  review.win.__hero.entrance(2.8); near(review.win.__hero.entering, 2.8, 'L4 player: review entrance hold still works');
  assert.equal(review.starOptions.open(), true, 'L2 player: star pointer at 2.8');
  const cut = await runPlayer(playerSource, E, { reduced: true, withLoader: true });
  assert.deepEqual(cut.loaderStates.slice(0, 3).map(s => s.fill), [0.25, 0.75, 1], 'L4 player: reduced boot steps');
  assert.ok(!cut.win.__hero.loading && cut.win.__hero.entering === null, 'L4 player: reduced cut');
  near(cut.win.__hero.t, starts[2] + SHOW[2].still, 'L4 player: reduced finished still');
  let finishFonts, finishPageFonts;
  const fonts = new Promise(resolve => { finishFonts = resolve; }), pageFonts = new Promise(resolve => { finishPageFonts = resolve; });
  const late = await runPlayer(playerSource, E, { withLoader: true, fonts, pageFonts, duringBoot: async p => {
    p.run(1);
    assert.ok(!p.win.__ready && p.draws.length === 0 && p.loaderStates.at(-1).target === 0, 'L4 player: progress before fonts');
    finishFonts(); await Promise.resolve();
    p.run(1);
    assert.ok(!p.win.__ready && p.loaderStates.at(-1).target === 0, 'L4 player: progress before document fonts');
    finishPageFonts();
  } });
  assert.ok(late.win.__ready && late.win.__hero.loading && late.loaderStates.at(-1).fill === 0, 'L4 player: delayed readiness jumps fill');
  late.run(4.91); assert.equal(late.win.__hero.entering, null, 'L5 player: delayed entrance before landing');
  late.run(0.05); near(late.win.__hero.entering, 0, 'L5 player: delayed burst landing');
  const blocked = await runPlayer(playerSource, E, { withLoader: true, firstDrawSeconds: 2 });
  assert.ok(blocked.win.__ready && blocked.loaderStates.at(-1).fill === 0, 'L4 player: blocked boot consumes visible fill');
  blocked.run(4.91); assert.equal(blocked.win.__hero.entering, null, 'L5 player: blocked boot consumes minimum duration');
  blocked.run(0.05); near(blocked.win.__hero.entering, 0, 'L5 player: blocked boot burst landing');
  for (const release of ['seek', 'entrance']) {
    const p = await runPlayer(playerSource, E, { withLoader: true });
    const clears = p.view.clears;
    if (release === 'seek') p.win.__hero.seek(12.5); else p.win.__hero.entrance(null);
    assert.ok(!p.win.__hero.loading && p.view.clears > clears && p.draws.at(-1).look.reveal === null, `L4 player: ${release} leaves initial clips`);
  }
  const change = await runPlayer(playerSource, E, { withLoader: true });
  const clears = change.view.clears;
  change.media.matches = true; change.media.change(); change.run(0.05);
  assert.ok(!change.win.__hero.loading && change.win.__hero.entering === null && change.view.clears > clears, 'L4 player: media change leaves loader/initial clips');
  near(change.win.__hero.t, starts[2] + SHOW[2].still, 'L4 player: media change finished still');
  // A whole entrance after the loader: loop held until 3.5; the star pointer opens at entrance zero.
  let p = await runPlayer(playerSource, E);
  assert.equal(p.win.__ready, true);
  near(p.win.__hero.entering, 0, 'E1 player: entrance starts at the loader exit');
  p.run(2.75); near(p.win.__hero.entering, 2.75, 'E1 player: entrance clock'); near(p.win.__hero.t, 0, 'E1 player: loop clock held before the screen ends');
  assert.equal(p.starOptions.open(), true, 'L5 player: star pointer after landing');
  assert.equal(p.draws.at(-1).look.floor.pointer, undefined, 'F3 player: the floor has a hover point');
  assert.ok(p.draws.at(-1).look.reveal && p.draws.at(-1).look.floor.reveal > 0 && p.draws.at(-1).look.floor.reveal < 4.8, 'E1 player: renderer reveal values');
  p.run(0.85); near(p.win.__hero.t, 0.1, 'E1 player: loop clock starts at 0 when the screen wipe ends');
  assert.equal(p.draws.at(-1).look.floor.pointer, undefined, 'F3 player: the floor has a hover point');
  assert.equal(p.draws.at(-1).look.reveal, null, 'E1 player: screen clip after 3.5');
  p.run(1); assert.equal(p.win.__hero.entering, null, 'E1 player: entrance ends at 4.6'); near(p.win.__hero.t, 1.1, 'E1 player: loop clock at the entrance end');
  assert.ok(p.view.clears > 0 && p.draws.at(-1).look.floor.reveal === undefined, 'E1 player: entrance styles remain');
  p.run(1); near(p.win.__hero.t, 2.1, 'E1 player: loop keeps playing');
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
  p.win.__hero.entrance(3.7); near(p.win.__hero.t, 0.2, 'E2 hold loop clock after 3.5');
  p.win.__hero.entrance(null); assert.equal(p.win.__hero.entering, null, 'E2 release'); p.run(0.5); assert.ok(p.win.__hero.t > 0.2, 'E2 release does not play');
  // Reduced motion: no entrance at all.
  p = await runPlayer(playerSource, E); p.media.matches = true; p.media.change(); assert.equal(p.win.__hero.entering, null, 'E1 reduced motion keeps the entrance');
  const header = pageMarkup().match(/<a[^>]*data-mark[^>]*>([\s\S]*?<\/svg>)/)[1];
  const paths = [...header.matchAll(/<path\b[^>]*>/g)].map(([p]) => ({ d: p.match(/\bd="([^"]+)"/)[1], fill: p.match(/\bfill="([^"]+)"/)[1] }));
  const sample = P.sampleMark(paths);
  for (const [W, H] of [[1440, 900], [768, 1024], [390, 844]]) {
    const scene = P.loaderScene(sample, W, H), end = P.loaderAt(0, { fonts: 0, atlas: 0, frame: 0 }).burstStart + scene.duration;
    const live = await runPlayer(playerSource, E, { withLoader: true, inlineModel: { P, paths, W, H } });
    live.run(end - 1 / 240);
    assert.ok(live.win.__hero.loading && live.win.__hero.entering === null && !live.starOptions.open(), 'L5 scene: early player handover');
    live.run(1 / 240);
    assert.ok(!live.win.__hero.loading && live.starOptions.open(), 'L5 scene: last landing did not hand over');
    near(live.win.__hero.entering, 0, 'L5 scene: player entrance zero');
    const [draw, clear] = live.events.slice(-2);
    assert.ok(draw.kind === 'draw' && draw.look.stars === live.field && clear.kind === 'clear' && draw.now === clear.now, 'L5 scene: draw before removal');
  }
  return 17;
}

export async function checkEntrance({ loaderSource = read('loader-stars.mjs'), entranceSource = read('entrance.mjs'), playerSource = read('play.mjs'), stageSource = read('stage.mjs'), painterSource = read('tools/page.mjs') } = {}) {
  const E = await loadEntrance(entranceSource, loaderSource), P = await import('data:text/javascript;base64,' + Buffer.from(loaderSource).toString('base64'));

  const groups = checkEntranceGroups(E), loaderSamples = checkLoaderTiming(E);
  const geometry = await checkLoaderGeometry(P);
  checkLoaderMarkup();
  const inlineRuns = checkInlineLoader(E, P, painterSource);
  const dots = checkTimetable(E);
  const l12 = await checkL12(E, { entranceSource, playerSource });
  const runs = await checkPlayer(playerSource, E, P);
  const labelSamples = await checkLabelExit(stageSource);
  const roundness = geometry.roundness.map(scene => ({ viewport: `${scene.W}x${scene.H}`, samples: checkLoaderRoundness(P, scene) }));
  return `L4/L5/L7/L8/L9/L10 computed: ${loaderSamples} timing samples at 1 ms; 1.4 s launches + 1 s flight, .15 hold, .35 shrink, .08 compressed hold, .18 swell, shared launch-speed explosion; entrance/pointer start at actual scene landing (fallback bound 4.96 s); ${geometry.comparisons} mark/home comparisons at desktop/tablet/phone; ${inlineRuns} inline worker/fallback/reduced/review runs. L10 durations: ${JSON.stringify(geometry.blasts)}. L10 roundness: ${JSON.stringify(roundness)}. L10 pop: ${JSON.stringify(geometry.pops)}. L7 actual drawing at 240 Hz: ${JSON.stringify(geometry.moves)}. L8 landing/handover: ${JSON.stringify(geometry.landings)}. L12 timetable: ${groups.samples} samples, maximum ${groups.maximum} groups. L5 combined explosion + entrance: ${groups.combinedSamples} samples, maximum ${groups.withBurst} groups, no exceptions. E4: ${labelSamples} retained label samples. L12: ${JSON.stringify(l12)}. E1/E2: 4.6 s timetable, ${dots} floor dot samples, ${runs} player runs; review and reduced paths retained. Browser/pixels UNRUN.`;
}

// Each edit matches one exact site in memory; the v35 control restores both its duration and curve.
export async function checkEntranceControls() {
  const out = [];
  for (const c of ENTRANCE_CONTROLS) {
    const source = read(c.file);
    assert.equal(source.split(c.search).length - 1, 1, `E1 control ${c.id}: must match one site`);
    let edited = source.replace(c.search, c.replacement);
    for (const [search, replacement] of c.also || []) {
      assert.equal(edited.split(search).length - 1, 1, `E1 control ${c.id}: extra edit must match one site`);
      edited = edited.replace(search, replacement);
    }
    let message = null;
    try {
      if (c.check) {
        const P = await import('data:text/javascript;base64,' + Buffer.from(edited).toString('base64'));
        const header = pageMarkup().match(/<a[^>]*data-mark[^>]*>([\s\S]*?<\/svg>)/)[1];
        const paths = [...header.matchAll(/<path\b[^>]*>/g)].map(([p]) => ({ d: p.match(/\bd="([^"]+)"/)[1], fill: p.match(/\bfill="([^"]+)"/)[1] }));
        const sample = P.sampleMark(paths);
        for (const [W, H] of [[1440, 900], [768, 1024], [390, 844]]) {
          const scene = P.loaderScene(sample, W, H);
          (c.check === 'roundness' ? checkLoaderRoundness : checkLoaderPop)(P, scene);
        }
      } else await checkEntrance({ 'entrance.mjs': { entranceSource: edited }, 'play.mjs': { playerSource: edited }, 'stage.mjs': { stageSource: edited }, 'loader-stars.mjs': { loaderSource: edited }, 'tools/page.mjs': { painterSource: edited } }[c.file]);
    } catch (error) { message = error.message.split('\n')[0]; }
    assert.ok(message && message.startsWith(c.gate), `E1 control ${c.id}: missed (${message})`);
    out.push(`${c.id} caught: ${message}`);
  }
  out.push(...(await checkL12Controls()).map(c => c.id + ' caught: ' + c.message));
  return out.join('; ');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let failure;
  try { console.log(await checkEntrance()); } catch (error) { failure = error; }
  // A failing positive gate must not prevent the requested independent fault audits.
  if (process.argv.includes('--controls')) console.log(await checkEntranceControls());
  if (failure) throw failure;
}
