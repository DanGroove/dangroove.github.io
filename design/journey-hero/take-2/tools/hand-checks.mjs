// Round 7 (K1/K2/K3): the hand's pace and what it carries, in Node. No browser.
//   node design/journey-hero/take-2/tools/hand-checks.mjs [--controls]
// K3a  The cursor's tip, projected with HOME at S 103.6 (the 1440 x 900 fit), sampled every 1/120 s over the whole
//      loop, never moves faster than SPEED_LIMIT px/s. The tip is taken on the screen face (x, y of the authored
//      route): the press's 0.1-unit depth step is a cut, not travel, and the drag lift moves only along the view.
// K3b  Every drag, draw, slide and stroke has a piece that stays with the cursor: a feature (corner, edge middle or
//      centre) of a piece moved by that action keeps its grab offset to the cursor, or keeps the cursor's progress
//      along its own route, within TOGETHER units (screen-local), sampled at 19 phases. During every hand action,
//      runs included, the cursor is exactly on its route at HAND(phase); during every approach, at HAND(linear).
// HAND_CONTROLS are one-site faults, applied in memory, that must each be caught at their gate.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HOME, dot, quatRotate } from '../../../../public/journey/hero/engine.mjs';
import { corners } from '../kit.mjs';

const TAKE = new URL('../', import.meta.url);
const read = name => fs.readFileSync(new URL(name, TAKE), 'utf8');
export const S = 103.6, SPEED_LIMIT = 1500, TOGETHER = 0.002, STEP = 1 / 120;
const U = 1.15, KINDS = ['drag', 'draw', 'slide', 'stroke', 'run'], CARRIED = ['drag', 'draw', 'slide', 'stroke'];

export const HAND_CONTROLS = [
  { id: 'approach', search: 'point = rectMix(a.previous, a.from, HAND(linear(t, a.approach, a.start))); break; }', replacement: 'point = rectMix(a.previous, a.from, progress(t, a.approach, a.start)); break; }', gate: 'K3 speed:' },
  { id: 'reader', search: 'const p = handed(s, id, t), rect = rectMix(from, to, p);', replacement: 'const p = EASE.wipe(phase(s, id, t)), rect = rectMix(from, to, p);', gate: 'K3 together:' },
  { id: 'grade', search: "const g = handed(s, 'grade', t);", replacement: "const g = EASE.wipe(phase(s, 'grade', t));", gate: 'K3 together: ps/grade' },
];

async function loadStage(source) {
  const url = new URL('stage.mjs', TAKE);
  const fixed = source.replace(/from (['"])(\.{1,2}\/[^'"]+)\1/g, (_all, _quote, ref) => `from '${new URL(ref, url).href}'`);
  return import('data:text/javascript;base64,' + Buffer.from(fixed).toString('base64'));
}

export async function checkHand(source = read('stage.mjs'), { only = '' } = {}) {
  const M = await loadStage(source), { SHOW, LOOP, SCRIPTS, SCREEN, HAND, frameAt } = M;
  const ZF = SCREEN.z + SCREEN.t / 2, starts = SHOW.map((_, i) => SHOW.slice(0, i).reduce((n, s) => n + s.len, 0));
  const world = list => { const pc = list.find(pc => pc.art === 'cursor'), p = pc.shadowP || pc.p; return [p[0] - 0.46 * (0.5 - 10 / 96), p[1] + 0.46 * (0.5 - 6 / 96)]; };
  const local = p => [(p[0] - SCREEN.l) / U, (p[1] - SCREEN.b) / U];
  const page = w => { const p = [w[0], w[1], ZF]; return [S * dot(HOME.r, p), S * dot(HOME.u, p)]; };
  const report = {};

  if (!only || only === 'speed') {
    let previous = page(world(frameAt(0))), peak = 0, at = 0, samples = 0;
    for (let n = 1; n * STEP <= LOOP + 1e-9; n++) {
      const t = Math.min(LOOP, n * STEP), p = page(world(frameAt(t))), v = Math.hypot(p[0] - previous[0], p[1] - previous[1]) / STEP;
      if (v > peak) { peak = v; at = t; }
      previous = p; samples++;
    }
    let i = SHOW.length - 1; while (starts[i] > at - STEP) i--;
    const t = at - STEP / 2 - starts[i], a = SCRIPTS[SHOW[i].key].actions.find(a => t >= a.approach && t < a.end);
    report.speed = { peak, at, samples, where: `${SHOW[i].key}/${a ? a.id + (t < a.start ? ' approach' : ' ' + a.kind) : 'rest'}` };
    assert.ok(peak <= SPEED_LIMIT, `K3 speed: cursor peaks at ${peak.toFixed(1)} px/s at ${at.toFixed(4)} s (${report.speed.where}) > ${SPEED_LIMIT}`);
  }

  if (!only || only === 'together') {
    const key = pc => (pc.art || '') + '|' + pc.tone + '|' + (pc.overlay ? 1 : 0) + '|' + (pc.where || '');
    const features = pc => {
      if (pc.building) {
        const plan=pc.building.plan, clips=[plan.base,...Object.values(plan.marks)].flatMap(rule=>rule?.clips||[]);
        const plain={...pc,building:undefined};
        return [...features(plain),...clips.flatMap(artReveal=>features({...plain,artReveal,labelRegion:[0,0,1,1]}))];
      }
      // C3's margin quad is stationary; its original paint clip is the feature carried by the hand.
      const reveal = pc.artReveal, full = pc.labelRegion;
      const points = reveal && full ? [[reveal[0],reveal[1]],[reveal[2],reveal[1]],[reveal[0],reveal[3]],[reveal[2],reveal[3]]].map(([u,v]) => {
        const local=[(2*(u-full[0])/(full[2]-full[0])-1)*pc.s[0],(1-2*(v-full[1])/(full[3]-full[1]))*pc.s[1],pc.s[2]];
        return quatRotate(pc.q,local).map((n,i)=>n+pc.p[i]);
      }) : corners(pc.shadowP ? { ...pc, p: pc.shadowP } : pc), xs = points.map(p => p[0]), ys = points.map(p => p[1]);
      const l = Math.min(...xs), r = Math.max(...xs), b = Math.min(...ys), t = Math.max(...ys), out = [];
      for (const x of [l, (l + r) / 2, r]) for (const y of [b, (b + t) / 2, t]) out.push(local([x, y]));
      return out;
    };
    // Pieces are named by kind and order of appearance, so the same piece is found at the action's start, now and end.
    const pieces = list => { const seen = {}; return new Map(list.filter(pc => pc.art !== 'cursor').map(pc => { const k = key(pc); seen[k] = (seen[k] || 0) + 1; return [k + '#' + seen[k], features(pc)]; })); };
    let actions = 0, routeSamples = 0, worst = 0, worstAt = '';
    for (let i = 0; i < SHOW.length; i++) for (const a of SCRIPTS[SHOW[i].key].actions) {
      const T = x => starts[i] + a.start + (a.end - a.start) * x, name = `${SHOW[i].key}/${a.id}`;
      // The cursor itself: on its route at HAND(phase) during the action, and on HAND(linear) while approaching it.
      for (let n = 1; n < 10; n++) {
        const at = starts[i] + a.approach + (a.start - a.approach) * n / 10;
        if (a.start - a.approach > 1e-9) {
          const c = local(world(frameAt(at))), p = HAND((at - starts[i] - a.approach) / (a.start - a.approach)), e = a.previous.map((v, k) => v + (a.from[k] - v) * p);
          assert.ok(Math.hypot(c[0] - e[0], c[1] - e[1]) < 1e-9, `K3 together: ${name} approach is not on HAND at ${at.toFixed(4)} s`);
          routeSamples++;
        }
        if (KINDS.includes(a.kind)) {
          const c = local(world(frameAt(T(n / 10)))), e = routePoint(a, HAND(n / 10));
          assert.ok(Math.hypot(c[0] - e[0], c[1] - e[1]) < 1e-9, `K3 together: ${name} cursor is not on HAND at phase ${n / 10}`);
          routeSamples++;
        }
      }
      if (!CARRIED.includes(a.kind)) continue;
      // A path is judged one straight segment at a time: each segment's bar is its own piece.
      let best = 0;
      for (const [x0, x1] of spans(a, HAND)) best = Math.max(best, follower(x0, x1));
      function follower(x0, x1) {
        const X = f => T(x0 + (x1 - x0) * f);
        // The reference frames sit just inside the span: at its very end HAND is 1 and a finished part is swapped in.
        const L0 = frameAt(X(1e-3)), L1 = frameAt(X(1 - 1e-3)), c0 = local(world(L0)), c1 = local(world(L1)), m0 = pieces(L0), m1 = pieces(L1);
        const dc = [c1[0] - c0[0], c1[1] - c0[1]], length = dc[0] ** 2 + dc[1] ** 2;
        const gaps = new Map(), seen = new Map();
        for (let n = 1; n < 20; n++) {
          const L = frameAt(X(n / 20)), c = local(world(L)), q = ((c[0] - c0[0]) * dc[0] + (c[1] - c0[1]) * dc[1]) / length;
          for (const [id, f] of pieces(L)) {
            const f0 = m0.get(id), f1 = m1.get(id); if (!f0 || !f1) continue;
            for (let k = 0; k < Math.min(f0.length,f1.length,f.length); k++) {
              const [A, B, F] = [f0[k], f1[k], f[k]];
              if (Math.hypot(B[0] - A[0], B[1] - A[1]) < 1e-3) continue;   // not moved by this action
              const grab = Math.hypot(F[0] - c[0] - (A[0] - c0[0]), F[1] - c[1] - (A[1] - c0[1]));
              const along = Math.hypot(F[0] - A[0] - q * (B[0] - A[0]), F[1] - A[1] - q * (B[1] - A[1]));
              const g = id + '/' + k; gaps.set(g, Math.max(gaps.get(g) ?? 0, Math.min(grab, along))); seen.set(g, (seen.get(g) ?? 0) + 1);
            }
          }
        }
        // A feature seen moving at only some phases is not followed throughout; it must be seen at all 19.
        const closest = Math.min(...[...gaps].filter(([g]) => seen.get(g) === 19).map(([, d]) => d));
        assert.ok(closest <= TOGETHER, `K3 together: ${name} (${a.kind}) has no piece within ${TOGETHER} of the cursor: closest ${closest.toFixed(5)}${a.path ? ` on phases ${x0.toFixed(3)}-${x1.toFixed(3)}` : ''}`);
        return closest;
      }
      if (best > worst) { worst = best; worstAt = name; }
      actions++;
    }
    report.together = { actions, routeSamples, worst, worstAt };
  }
  return report;
}
// The phase spans of a path's segments (HAND reaches each joint at its share of the length); else the whole action.
// Segments under 0.05 units are too short to judge a follower on and are left out (the cursor's route is still checked).
function spans(a, HAND) {
  if (!a.path) return [[0, 1]];
  const lengths = a.path.slice(1).map((b, i) => Math.hypot(b[0] - a.path[i][0], b[1] - a.path[i][1])), total = lengths.reduce((n, d) => n + d, 0);
  const inverse = v => { let lo = 0, hi = 1; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (HAND(m) < v) lo = m; else hi = m; } return (lo + hi) / 2; };
  const out = []; let at = 0;
  for (const d of lengths) { if (d >= 0.05) out.push([inverse(at / total), inverse((at + d) / total)]); at += d; }
  return out;
}
function routePoint(a, p) {
  const mix = (x, y, f) => x.map((v, k) => v + (y[k] - v) * f);
  if (a.curve) return [0, 1].map(k => (1 - p) ** 2 * a.curve[0][k] + 2 * (1 - p) * p * a.curve[1][k] + p * p * a.curve[2][k]);
  if (a.path) {   // walked by length (round 7), so its speed does not jump between segments
    const lengths = a.path.slice(1).map((b, i) => Math.hypot(b[0] - a.path[i][0], b[1] - a.path[i][1]));
    let left = p * lengths.reduce((n, d) => n + d, 0), i = 0;
    while (i < lengths.length - 1 && left > lengths[i]) left -= lengths[i++];
    return mix(a.path[i], a.path[i + 1], Math.min(1, left / lengths[i]));
  }
  return mix(a.from, a.to, p);
}

export function describe(r) {
  return `K3 computed: cursor peak ${r.speed.peak.toFixed(1)} px/s at ${r.speed.at.toFixed(4)} s (${r.speed.where}), ${r.speed.samples} samples at 1/120 s, S=${S}, limit ${SPEED_LIMIT}; ${r.together.actions} drags/draws/slides/strokes carry a piece within ${TOGETHER} (worst ${r.together.worst.toExponential(2)}, ${r.together.worstAt}); cursor on HAND in ${r.together.routeSamples} approach/action samples.`;
}

export async function checkHandControls() {
  const source = read('stage.mjs'), out = [];
  for (const c of HAND_CONTROLS) {
    assert.equal(source.split(c.search).length - 1, 1, `K3 control ${c.id} must match one site`);
    let message = '';
    try { await checkHand(source.replace(c.search, c.replacement), { only: c.gate.startsWith('K3 speed') ? 'speed' : 'together' }); } catch (error) { message = error.message; }
    assert.ok(message.startsWith(c.gate), `K3 control ${c.id} not caught at ${c.gate} (${message || 'passed'})`);
    out.push(`${c.id} caught: ${message}`);
  }
  return out.join('; ');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(describe(await checkHand()));
  if (process.argv.includes('--controls')) console.log('K3 negative controls: ' + await checkHandControls());
}
