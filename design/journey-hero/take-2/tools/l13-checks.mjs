// L13 gates run the actual modules. Faults are injected in memory; fixtures stay immutable.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as M from '../stage.mjs';
import * as P from '../loader-stars.mjs';
import { createField, createTrailHistory } from '../stars.mjs';
import { SPARKS, sparkFrame, sparkAt, kickExportBursts } from '../export-sparks.mjs';
import { corners } from '../kit.mjs';
import { HOME, EASE } from '../../../../public/journey/hero/engine.mjs';
import { pageMarkup } from './page.mjs';
const read = f => fs.readFileSync(new URL('../' + f, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const near = (a, b, label, epsilon = 1e-8) => assert.ok(Math.abs(a - b) <= epsilon, `${label}: ${a} != ${b}`);
const paths = () => [...pageMarkup().match(/<a\b[^>]*data-mark[^>]*>[\s\S]*?<\/a>/)[0].matchAll(/<path\b[^>]*>/g)].map(([s]) => ({ d: s.match(/\bd="([^"]+)"/)[1], fill: s.match(/\bfill="([^"]+)"/)[1] }));
const startOf = (m, key) => m.SHOW.slice(0, m.SHOW.findIndex(s => s.key === key)).reduce((n, s) => n + s.len, 0);
const bounds = pieces => {
  const ps = pieces.flatMap(corners);
  return [0, 1, 2].flatMap(k => [Math.min(...ps.map(p => p[k])), Math.max(...ps.map(p => p[k]))]);
};
const floorAt = (m, key, time) => m.frameAt(startOf(m, key) + time).filter(p => p.where === 'floor');

export function checkExportExit(m = M) {
  const b = m.exitBeats();
  [b.wiped, b.merged, b.squashed, b.burst, b.end].forEach((v, i) => near(v, [.65, 1.15, 1.33, 1.45, 1.5][i], 'L13 exit clock'));
  near(m.LOOP, 101.49089474781469, 'L13 loop');
  let samples = 0, blocks = 0;
  for (const key of ['id', 'pr', 'ae', 'fig']) {
    const off = m.playbackSpans(m.SCRIPTS[key]).off, first = floorAt(m, key, off[0]);
    near(off[1] - off[0], 1.5, 'L13 tail');
    const groups = key === 'id' ? [first.filter(p => p.device === undefined && p.p[2] < m.BLOCK_ROW.stack[1] + m.BLOCK_ROW.stack[3]),
      first.filter(p => p.device === undefined && p.p[2] > m.BLOCK_ROW.stack[1] + m.BLOCK_ROW.stack[3] && p.p[0] < -.1),
      first.filter(p => p.device === undefined && p.p[2] > m.BLOCK_ROW.stack[1] + m.BLOCK_ROW.stack[3] && p.p[0] >= -.1),
      first.filter(p => p.device === 1), first.filter(p => p.device === 2)] : [0, 1, 2].map(j => first.filter(p => p.device === j));
    assert.ok(groups.every(g => g.length), 'L13 per-object: missing source object');
    const merged = floorAt(m, key, off[0] + .65 + 1e-9);
    assert.equal(merged.length, key === 'id' ? 5 : 3, 'L13 per-object: every object has a red piece');
    const reds = merged.toSorted((a, b) => a.part - b.part || a.object - b.object);
    for (const [i, red] of reds.entries()) {
      assert.equal(red.tone, 'red', 'L13 red only');
      bounds([red]).forEach((v, k) => near(v, bounds(groups[i])[k], 'L13 per-object: exact bounds', 1e-7));
      blocks++;
    }
    if (key === 'id') {
      near(bounds(groups[0])[3], .25, 'L13 stack: five copies');
      near(bounds(groups[1])[3], .04, 'L13 left reading half');
      near(bounds(groups[2])[3], .01, 'L13 right reading half');
    }
    const ball = floorAt(m, key, off[0] + 1.15 + 1e-9);
    assert.equal(ball.length, 1, 'L13 merge: one ball');
    const event = m.exitBursts().find(e => e.key === key);
    near(ball[0].p[0], event.centre[0], 'L13 merge: rest x'); near(ball[0].p[2], event.centre[2], 'L13 merge: rest z');
    near(ball[0].s[0], .3, 'L13 merge: radius');
    const click = m.SCRIPTS[key].actions.find(a => a.id === 'export').start;
    const arrival = floorAt(m, key, click + (m.BALL.pop + m.BALL.arc) * m.PACE)[0];
    near(ball[0].p[0], arrival.p[0], 'L13 merge: arriving ball rest x'); near(ball[0].p[2], arrival.p[2], 'L13 merge: arriving ball rest z');
    for (const v of [1.15, 1.24, 1.33, 1.4, 1.449]) {
      const p = floorAt(m, key, off[0] + v + 1e-10)[0];
      const scale = v < 1.33 ? 1 + (.78 - 1) * EASE.wipe((v - 1.15) / .18) : .78 + (1.15 - .78) * EASE.exit((v - 1.33) / .12);
      near(p.s[0], .3 * scale, 'L13 squash/swell'); near(p.p[1], p.s[0], 'L13 ball on floor');
    }
    for (let n = 0; n <= 360; n++) {
      const v = n / 240, pcs = floorAt(m, key, off[0] + v + 1e-10);
      assert.ok(pcs.every(p => !('sinkTop' in p) && !p.sink && !(p.clip?.join() === '0,1,0,0')), 'L13 no sink: old floor mechanism');
      assert.ok(pcs.every(p => Math.min(...corners(p).map(c => c[1])) >= -1e-9), 'L13 floor: piece below floor');
      if (v >= 1.45) assert.equal(pcs.length, 0, 'L13 burst: exports gone in burst frame');
      if (v >= .65 && v < 1.45) assert.ok(pcs.every(p => p.tone === 'red' && !p.art), 'L13 red only');
      if (v < .65) {
        for (const red of pcs.filter(p => p.morph === 'shape')) {
          const object = key === 'id' ? red.part === 0 ? red.object : red.part + 2 : red.part;
          bounds([red]).forEach((v, k) => near(v, bounds(groups[object])[k], 'L13 wipe: full per-object red bounds', 1e-7));
          if (red.edge !== undefined) assert.deepEqual(red.clip, [-1, 0, 0, red.edge], 'L13 exit wipe: red behind edge');
        }
        for (let j = 0; j < 3; j++) {
          const list = pcs.filter(p => p.device === (key === 'id' ? j === 0 ? undefined : j : j));
          // Until a format's clock starts, the entire emitted object retains its geometry.
          if (v < j * .1) {
            const before = first.filter(p => p.device === (key === 'id' ? j === 0 ? undefined : j : j));
            const geometry = g => g.map(({ exportSeparated, ...p }) => p);
            assert.deepEqual(geometry(list), geometry(before), 'L13 untouched: format before wipe');
          }
        }
        // Each source piece stays rigid, with one common x edge; every retained layer has the opposite red plane.
        for (const p of pcs.filter(p => p.edge !== undefined && p.tone !== 'red')) {
          const original = first.find(q => q.art === p.art && q.device === p.device && q.p.every((v, k) => Math.abs(v - p.p[k]) < 1e-10) && q.s.every((v, k) => Math.abs(v - p.s[k]) < 1e-10));
          assert.ok(original, 'L13 untouched: wipe changes source geometry');
          assert.deepEqual(p.q, original.q, 'L13 untouched: rotation');
          assert.deepEqual(p.clip, [1, 0, 0, -p.edge], 'L13 exit wipe: asset ahead of edge');
        }
      }
      samples++;
    }
  }
  return { samples, blocks };
}
export function checkExplosionGate(makeField = createField, historyFactory = createTrailHistory) {
  const F = makeField(1440, 900, P.placeMark(P.sampleMark(paths()), 1440, 900));
  const history = historyFactory(F.stars.length), pos = new Float64Array(F.stars.length * 2);
  let time = 0;
  const frame = () => {
    time += 1 / 240; F.step(1 / 240);
    F.stars.forEach((s, i) => { pos[2 * i] = s.x + F.offsets[2 * i]; pos[2 * i + 1] = s.y + F.offsets[2 * i + 1]; });
    const trails = F.gateTrails(history.record(time, pos));
    return F.stars.map((s, i) => Math.hypot(trails[4 * i], trails[4 * i + 1]) > s.size);
  };
  frame(); let stir = 0, hold = 0, release = 0;
  for (let n = 0; n < 120; n++) { F.push([200 + n * 8, 450], [208 + n * 8, 450], 1 / 240); stir += frame().filter(Boolean).length; }
  assert.equal(stir, 0, 'L13 stir: no taper');
  const held = F.press(720, 450);
  for (let n = 0; n < 720; n++) { F.gather(held, [720, 450], 1 / 240); hold += frame().filter(Boolean).length; }
  assert.equal(hold, 0, 'L13 hold: no taper');
  F.blast(held, [720, 450]);
  const gone = new Set(), seen = new Set();
  for (let n = 0; n < 2400; n++) {
    const on = frame();
    if (n < 12) release += on.filter(Boolean).length;
    for (let i = 0; i < on.length; i++) {
      if (F.exploding[i]) { assert.ok(!gone.has(i), 'L13 return: cleared explosion restarted'); seen.add(i); }
      else if (seen.has(i)) gone.add(i);
      if (gone.has(i)) assert.ok(!on[i], 'L13 return: taper returned');
    }
  }
  assert.ok(release > 0, 'L13 release: first .05 seconds taper');
  assert.ok(gone.size > 100, 'L13 return: nonvacuous');
  return { stir, hold, release, cleared: gone.size };
}
export async function checkSharedWindow() {
  const code = read('loader-stars.mjs'), names = ['STREAK_WINDOW', 'STARS', 'hash', 'makeStars', 'starCount', 'sampleMark', 'placeMark', 'loaderScene', 'loaderDots', 'loaderAt', 'streakGeometry', 'markFlag'];
  const loadPure = source => new Function(source.replace(/^export /gm, '') + '; return {' + names.join(',') + '};')();
  const readLengths = window => {
    const p = loadPure(code.replace('2 / 50', String(window))), scene = p.loaderScene(p.sampleMark(paths()), 1440, 900);
    const burst = p.loaderDots(scene, p.loaderAt(3.3, { fonts: 0, atlas: 0, frame: 0 }, { scene }));
    const starCode = read('stars.mjs').replace(/^import .*;$/gm, '').replace(/^export \{.*;$/gm, '').replace(/^export /gm, '');
    const H = new Function(...Object.keys(p), starCode + ';return createTrailHistory;')(...Object.values(p))(1);
    H.record(0, [0, 0]); H.record(.02, [20, 0]); H.record(.04, [40, 0]); H.record(.06, [60, 0]);
    const field = H.record(.08, [80, 0])[0];
    const sparks = new Function('STREAK_WINDOW', 'streakGeometry', read('export-sparks.mjs').replace(/^import .*;$/gm, '').replace(/^export /gm, '') + ';return sparkFrame;')(p.STREAK_WINDOW, p.streakGeometry);
    const st = sparks([{ at: 0, centre: [0, .3, 0] }], .2, 100, { S: 100, cx: 720, cy: 450, cam: HOME });
    return [burst.reduce((n, d) => n + (d.streak || 0), 0), field, st.trails.reduce((n, v, i) => i % 4 < 2 ? n + Math.abs(v) : n, 0)];
  };
  near(P.STREAK_WINDOW, .04, 'L13 window: exact');
  const before = readLengths(.04), changed = readLengths(.08);
  assert.ok(before.every((v, i) => v > 0 && changed[i] > v), 'L13 window: all three must read shared constant');
  return { before, changed };
}
export async function checkL13() {
  const sample = P.sampleMark(paths()), scene = P.loaderScene(sample, 1440, 900);
  let loader = 0;
  for (let n = 0; n < 760; n++) {
    const time = n / 240, state = P.loaderAt(time, { fonts: 0, atlas: 0, frame: 0 }, { scene });
    const dots = P.loaderDots(scene, state);
    if (state.burstTime === null) assert.ok(dots.every(d => !d.tail && !d.streak), 'L13 loader gather: dots only');
    else loader += dots.filter(d => d.streak > d.size).length;
  }
  assert.ok(loader > 0, 'L13 loader burst: nonvacuous');
  const exit = checkExportExit(), gate = checkExplosionGate(), window = await checkSharedWindow();
  assert.equal(SPARKS.length, 140, 'L13 sparks count'); assert.equal(SPARKS.filter(s => s.red).length, 98, 'L13 sparks colour');
  for (const s of SPARKS) {
    assert.ok(s.v >= 5 && s.v <= 16 && s.tau >= .13 && s.tau <= .24 && s.size >= 1.5 && s.size <= 3 && s.life >= .7 && s.life <= 1.25, 'L13 spark ranges');
    near(Math.hypot(...s.d), 1, 'L13 upper sphere'); assert.ok(s.d[1] >= 0, 'L13 spark floor');
    const centre = [0, .345, 0], p = sparkAt(s, centre, .2);
    p.forEach((v, i) => near(v, centre[i] + s.d[i] * s.v * s.tau * (1 - Math.exp(-.2 / s.tau)), 'L13 spark braking'));
  }
  const events = M.exitBursts(), view = { S: 100, cx: 720, cy: 450, cam: HOME };
  const spark = sparkFrame(events, events[0].at + .2, M.LOOP, view);
  assert.equal(spark.count, 140, 'L13 sparks continue after scene');
  assert.equal(sparkFrame(events, events[0].at + 1.26, M.LOOP, view).count, 0, 'L13 sparks lifetime');
  const kicks = [], field = { burstAt(...args) { kicks.push(args); } };
  for (const at of [events[0].at - .01, events[0].at + .01, events[0].at + .03]) kickExportBursts(events, at, .02, M.LOOP, view, field);
  assert.equal(kicks.length, 1, 'L13 export push: once'); near(kicks[0][2], 260, 'L13 push reach');
  const F = createField(1440, 900); F.burstAt(720, 450, 260);
  for (const [i, s] of F.stars.entries()) {
    const distance = Math.hypot(s.x - 720, s.y - 450), expected = distance < 260 ? .75 * P.STARS.hold.blast[0] * (1 - distance / 260) ** 2 / s.m : 0;
    near(Math.hypot(...F.velocity(i)), expected, 'L13 push falloff', 1e-4);
    assert.equal(!!F.exploding[i], expected > 0, 'L13 push explosion flag');
  }
  const player = read('play.mjs'), renderer = read('sq.mjs');
  assert.match(player, /sparks: loading \|\| intro \|\| reduced.matches \? null : sparkFrame/, 'L13 reduced: no exit sparks');
  assert.match(renderer, /starPass\(1, look.sparks, sparkBatch \|\|= starBatch\(\), true\)/, 'L13 sparks: front star pass');
  assert.ok(!/sinkTop/.test(renderer + read('stage.mjs')), 'L13 no sinkTop');
  for (const name of ['stage.mjs', 'stars.mjs', 'loader-stars.mjs', 'play.mjs', 'sq.mjs', 'tools/page.mjs']) assert.ok(!/__streakMock|__mockSpeed|playFrom|MOCK_HASH|sessionStorage|sparkCanvas/.test(read(name)), 'L13 review aids excluded');
  return { exit, gate, window, loader };
}
export async function checkL13Controls() {
  const url = new URL('../stage.mjs', import.meta.url), out = [];
  const stage = async (name, from, to, gate) => {
    const source = read('stage.mjs'); assert.ok(source.includes(from), name + ' mutation missing');
    const code = source.replace(from, to).replace(/from (['"])(\.{1,2}\/[^'"]+)\1/g, (_s, _q, ref) => `from '${new URL(ref, url).href}'`);
    try { checkExportExit(await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'))); }
    catch (e) { assert.match(e.message, gate); out.push(name + ' -> ' + e.message.split('\n')[0]); return; }
    throw Error(name + ' escaped');
  };
  await stage('old tail', 'sink: 1.5', 'sink: 1.0', /L13 loop|L13 tail/);
  await stage('late burst', 'v < b.burst - 1e-12', 'v < b.burst + .1', /L13 burst:/);
  await stage('missing reading halves', 'f.objects || [f.pieces]', '[f.pieces]', /L13 wipe: full per-object red bounds/);
  await stage('small red block', "red.object = object;", "red.object = object; red.s[0] *= .95;", /L13 wipe: full per-object red bounds/);
  await stage('sink restored', 'pc.object = object; P.push(pc);', 'pc.object = object; pc.p[1] -= .1; P.push(pc);', /L13 per-object:|L13 floor:/);
  return out.join('\n');
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(await checkL13()));
  if (process.argv.includes('--controls')) console.log(await checkL13Controls());
}
