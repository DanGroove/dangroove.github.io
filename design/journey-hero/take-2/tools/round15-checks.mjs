// CORRECTIONS-15: S1 (Export pops a ball that becomes the exports), S2 (the exports sink into the floor), N1 (no selection box on
// the amenities map) and N2 (a dragged picture slides flat across the screen). Pure Node geometry on the emitted pieces, sampled
// every 0.01 s through every export and every sink, and through every drag in every app.
// node design/journey-hero/take-2/tools/round15-checks.mjs [--controls]
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { inflateRawSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { HOME, dot } from '../../../../public/journey/hero/engine.mjs';
import { corners } from '../kit.mjs';
import { checkRound17Exports, checkRound17RetainedControls } from './round17-checks.mjs';

const stageURL = new URL('../stage.mjs', import.meta.url);
const moduleOf = code => import('data:text/javascript;base64,' + Buffer.from(code.replace(/from (['"])(\.{1,2}\/[^'"]+)\1/g, (_all, _q, ref) => `from '${new URL(ref, stageURL).href}'`)).toString('base64'));
async function load(edit) {
  if (!edit) return import(stageURL.href);
  const source = fs.readFileSync(stageURL, 'utf8'), changed = edit(source);
  assert.notEqual(changed, source, 'control edit did not apply');
  return moduleOf(changed);
}
// Round 13's stage (e1e55af), whose final poses the exports must keep at rest.
let round13;
const before = async () => round13 ??= await moduleOf(inflateRawSync(Buffer.from(JSON.parse(fs.readFileSync(new URL('fixtures/round13-stage.json', import.meta.url), 'utf8')).sources['stage.mjs'].deflateBase64, 'base64')).toString('utf8'));

const S = 103.6;   // px per unit at 1440 x 900 (HAND_PAGE.S)
const project = p => [S * dot(HOME.r, p), -S * dot(HOME.u, p)];
const bounds = pcs => { const c = pcs.flatMap(corners); return { x0: Math.min(...c.map(p => p[0])), x1: Math.max(...c.map(p => p[0])), y1: Math.max(...c.map(p => p[1])), z0: Math.min(...c.map(p => p[2])), z1: Math.max(...c.map(p => p[2])) }; };
const same = (a, b, tol = 1e-12) => a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
const steps = (from, to, dt) => { const out = []; for (let k = 0; from + k * dt < to - 1e-9; k++) out.push(from + k * dt); return out; };

export async function checkRound15(M) {
  M ??= await load();
  const { SHOW, SCRIPTS, PACE, SCENES, BALL, BALL_PATH, EXPORT_BUTTON, frameAt, playbackSpans, ballBeats, ballLength, calloutsAt } = M;
  const R13 = await before();
  const starts = []; let sum = 0; for (const s of SHOW) { starts.push(sum); sum += s.len; }
  let env = [Infinity, -Infinity, Infinity, -Infinity];
  for (const make of SCENES) for (const pc of make()) for (const c of corners(pc)) { const x = dot(HOME.r, c), y = dot(HOME.u, c); env = [Math.min(env[0], x), Math.max(env[1], x), Math.min(env[2], y), Math.max(env[3], y)]; }
  const report = { samples: 0, peak: 0, scenes: {} };
  for (const key of ['id', 'pr', 'ae', 'fig']) {
    const i = SHOW.findIndex(s => s.key === key), s = SCRIPTS[key], g0 = starts[i], at = t => frameAt(g0 + t), { spans, land, off } = playbackSpans(s);
    const a = s.actions.find(x => x.id === 'export').start, beats = j => { const b = ballBeats(key, j); for (const k in b) b[k] = a + b[k] * PACE; return b; }, b0 = beats(0);
    const floor = t => at(t).filter(pc => pc.where === 'floor'), info = {};
    assert.ok(Math.abs(land - a - ballLength(key) * PACE) < 1e-9, `${key}: land is not the end of the last become`);
    // No export piece exists anywhere before the Export click.
    for (const t of steps(0, a, 0.01 * PACE)) assert.ok(!floor(t).length, `${key}: an export piece exists before the Export click at ${t.toFixed(2)}`);
    // The three blocks, from the hold.
    const held = floor((b0.split + b0.hold) / 2).filter(pc => pc.morph === 'shape').sort((p, q) => p.part - q.part);
    assert.equal(held.length, 3, `${key}: expected three red blocks in the hold`);
    const foot = bounds(held), middle = [(foot.x0 + foot.x1) / 2, (foot.z0 + foot.z1) / 2];
    // ---- Pop, arc, rest: one red ball.
    const times = [...steps(a + 1e-9, b0.split, 0.01 * PACE), b0.pop + 1e-9, b0.arc + 1e-9, b0.rest + 1e-9].sort((x, y) => x - y);
    let touch = null, prevY = Infinity, arc = [];
    for (const t of times) {
      const list = floor(t); report.samples++;
      if (t < b0.rest) {
        assert.equal(list.length, 1, `${key} ${t.toFixed(3)}: expected the ball alone`);
        const [ball] = list, r = ball.s[0];
        assert.ok(ball.tone === 'red' && same(ball.e, [1, 1]) && same(ball.s, [r, r, r]), `${key}: the ball is not one red ball`);
        assert.ok(ball.p[1] - r >= -1e-9, `${key} ${t.toFixed(3)}: the ball goes below the floor`);
        // Never through the screen, the bar or the button: what is not clipped at the button's face lies in front of it.
        if (!ball.clip) assert.ok(ball.p[2] - r >= EXPORT_BUTTON.face - 1e-9, `${key} ${t.toFixed(3)}: the ball passes through the screen`);
        else assert.ok(same(ball.clip, [0, 0, 1, -EXPORT_BUTTON.face]) && t < b0.pop + 1e-9, `${key}: the ball is clipped other than at the button's face while it pops`);
        // Its projected box stays inside the stage's box (the stills' envelope and its 0.25 padding).
        const cx = dot(HOME.r, ball.p), cy = dot(HOME.u, ball.p);
        assert.ok(cx - r >= env[0] - 0.25 && cx + r <= env[1] + 0.25 && cy - r >= env[2] - 0.25 && cy + r <= env[3] + 0.25, `${key} ${t.toFixed(3)}: the ball leaves the stage's box`);
        if (t >= b0.pop && t <= b0.arc + 1e-12) arc.push([t, ...ball.p]);
        report.peak = Math.max(report.peak, ball.p[1]);
        if (t >= b0.arc) {
          if (touch === null) touch = ball.p.slice();
          assert.ok(ball.p[1] <= prevY + 1e-12, `${key} ${t.toFixed(3)}: the ball's height rises after touchdown (a bounce)`);
          prevY = ball.p[1];
        }
        if (t <= a + 1e-6) {
          // The pop starts inside the button: its silhouette (a circle in this orthographic view) lies within the face's projection.
          const [x0, y0, x1, y1] = EXPORT_BUTTON.rect, quad = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(([x, y]) => [dot(HOME.r, [x, y, EXPORT_BUTTON.face]), dot(HOME.u, [x, y, EXPORT_BUTTON.face])]);
          for (let k = 0; k < 4; k++) {
            const [p, q] = [quad[k], quad[(k + 1) % 4]], n = [q[1] - p[1], p[0] - q[0]], len = Math.hypot(...n), side = ((cx - p[0]) * n[0] + (cy - p[1]) * n[1]) / len;
            const inward = ((quad[(k + 2) % 4][0] - p[0]) * n[0] + (quad[(k + 2) % 4][1] - p[1]) * n[1]) / len;
            assert.ok(Math.sign(side) === Math.sign(inward) && Math.abs(side) >= r - 1e-9, `${key}: the ball's silhouette does not start inside the button`);
          }
          assert.ok(Math.abs(ball.p[2] - EXPORT_BUTTON.face) < 1e-9, `${key}: the ball does not start at the button's face`);
        }
        if (Math.abs(t - b0.pop - 1e-9) < 1e-12) assert.ok(Math.abs(r - BALL_PATH.size / 2) < 1e-12, `${key}: the ball is not at full size by the end of the pop`);
        if (t >= b0.arc) assert.ok(Math.abs(ball.p[1] - r) < 1e-6 && Math.abs(ball.p[0] - middle[0]) < 1e-6 && Math.abs(ball.p[2] - middle[1]) < 1e-6, `${key}: the ball does not rest on the floor at the middle of the blocks' footprint`);
      } else {
        // Split: from exact copies of the resting ball, each to its block, its bottom on the floor, never rising.
        const red = list.filter(pc => pc.solid);
        assert.equal(red.length, 3, `${key} ${t.toFixed(3)}: expected three pieces in the split`);
        for (const pc of red) {
          assert.ok(Math.abs(pc.p[1] - pc.s[2]) < 1e-12, `${key} ${t.toFixed(3)}: a piece leaves the floor in the split`);
          if (Math.abs(t - b0.rest - 1e-9) < 1e-12) assert.ok(same(pc.p, touch) && same(pc.s, Array(3).fill(BALL_PATH.size / 2)) && same(pc.e, [1, 1]) && same(pc.q, held[0].q), `${key}: at the split's first frame a piece is not the resting ball`);
        }
      }
    }
    // The arc: a true parabola in height, linear in x and z (constant first differences; constant second difference in y).
    // (only the samples on the 0.01 s grid from the arc's start, so the differences are over equal steps)
    const even = arc.filter((p, n) => Math.abs(((p[0] - b0.pop) / (0.01 * PACE)) - Math.round((p[0] - b0.pop) / (0.01 * PACE))) < 1e-6 && !arc.slice(0, n).some(q => Math.abs(q[0] - p[0]) < 1e-6));
    const e1 = k => even.slice(1).map((p, n) => p[k] - even[n][k]), e2 = e1(2).slice(1).map((v, n) => v - e1(2)[n]);
    assert.ok(e2.every(v => Math.abs(v - e2[0]) < 1e-7) && e2[0] < 0, `${key}: the ball's height does not have a constant (downward) second difference (${Math.min(...e2)} to ${Math.max(...e2)})`);
    for (const k of [1, 3]) assert.ok(e1(k).every(v => Math.abs(v - e1(k)[0]) < 1e-7), `${key}: the ball's ${k === 1 ? 'x' : 'z'} is not linear in time`);
    assert.ok(even.length > 50, `${key}: too few arc samples`);
    info.rise = Math.max(...arc.map(p => p[2])) - arc[0][2];
    // At the split's end each piece is its block: the format's footprint and thickness within 0.001, and its exact e.
    for (let j = 0; j < 3; j++) {
      const b = beats(j), formats = floor((b.wipe + b.wiped) / 2).filter(pc => pc.wiped === j);
      const fb = bounds(formats), width = fb.x1 - fb.x0, full = formats.filter(pc => { const q = bounds([pc]); return Math.abs(q.x1 - q.x0 - width) < 1e-6; });
      const body = full.sort((p, q) => bounds([p]).y1 - bounds([q]).y1)[0], top = Math.max(...full.map(pc => bounds([pc]).y1));
      const shape = floor(b.split).find(pc => pc.solid && pc.part === j), sb = bounds([shape]);
      assert.ok(Math.abs(sb.x0 - fb.x0) <= 0.001 && Math.abs(sb.x1 - fb.x1) <= 0.001 && Math.abs(sb.z0 - fb.z0) <= 0.001 && Math.abs(sb.z1 - fb.z1) <= 0.001, `${key}: piece ${j}'s block is not its format's footprint`);
      assert.ok(Math.abs(sb.y1 - top) <= 0.001 && same(shape.e, body.e), `${key}: piece ${j}'s block is not its format's thickness and e`);
      // Become: the block and the format on opposite sides of one plane, its edge moving monotonically left to right.
      let edge = -Infinity;
      for (const t of [...steps(b.wipe + 1e-9, b.wiped, 0.01 * PACE), b.wiped - 1e-9]) {
        const list = floor(t), red = list.filter(pc => pc.solid && pc.part === j), fmt = list.filter(pc => pc.wiped === j); report.samples++;
        assert.equal(red.length, 1, `${key}: piece ${j} has no block during its wipe`);
        const plane = red[0].clip;
        assert.ok(plane && plane[0] === 1 && plane[1] === 0 && plane[2] === 0, `${key}: piece ${j}'s block is not cut by a plane in x`);
        for (const pc of fmt) assert.ok(pc.clip && pc.clip.every((v, k) => v === -plane[k]), `${key} ${t.toFixed(3)}: the format and the block do not share one plane with opposite signs (gap or overlap)`);
        assert.ok(fmt.length > 0, `${key}: piece ${j} has no format behind its wipe`);
        assert.ok(-plane[3] >= edge - 1e-12 && -plane[3] >= sb.x0 - 1e-9 && -plane[3] <= sb.x1 + 1e-9, `${key} ${t.toFixed(3)}: piece ${j}'s wipe edge does not move monotonically left to right`);
        edge = -plane[3];
        // Every block's bottom stays on the floor.
        for (const pc of list.filter(pc => pc.solid)) assert.ok(Math.abs(pc.p[1] - pc.s[2]) < 1e-12, `${key}: a block leaves the floor`);
      }
      // No play starts before the piece's wipe has ended, nor before the laptop's lid has opened.
      for (const t of steps(a, spans[j][1], 0.01 * PACE)) {
        const list = at(t), mine = list.filter(pc => pc.where === 'floor' && pc.device === j);
        assert.ok(!mine.some(pc => pc.clock > 0 || pc.art === 'tapDot') && !(list.clock > 0), `${key} ${t.toFixed(3)}: device ${j} plays before its wipe has ended (or its lid has opened)`);
      }
    }
    // At rest: every piece equals round 13's final pose (e1e55af), in the plays and InDesign's land, pickup and reading.
    const ri = R13.SHOW.findIndex(x => x.key === key), r0 = R13.SHOW.slice(0, ri).reduce((n, x) => n + x.len, 0), old = R13.playbackSpans(R13.SCRIPTS[key]);
    const pose = list => list.filter(pc => pc.where === 'floor').map(pc => [pc.tone, pc.art, ...pc.p, ...pc.q, ...pc.s, ...pc.e, ...(pc.window || ['-', '-', '-', '-']), ...(pc.clip || ['-', '-', '-', '-'])]).sort((x, y) => x.map(v => typeof v === 'number' ? v.toFixed(5) : v).join('/') < y.map(v => typeof v === 'number' ? v.toFixed(5) : v).join('/') ? -1 : 1);   // the order of drawing is free
    const samePose = (x, y) => x.length === y.length && x.every((p, n) => p.length === y[n].length && p.every((v, k) => typeof v === 'number' ? Math.abs(v - y[n][k]) <= 1e-9 : v === y[n][k]));
    let rested = 0;
    for (const d of steps(1e-6 * PACE, off[0] - land, 0.05 * PACE)) {
      assert.ok(samePose(pose(at(land + d)), pose(R13.frameAt(r0 + old.land + d))), `${key}: a piece at rest differs from round 13's final pose ${d.toFixed(2)} s after land`);
      const mine = calloutsAt(g0 + land + d), theirs = R13.calloutsAt(r0 + old.land + d);
      if (d >= 0.4 * PACE) assert.deepEqual(mine.map(c => [c.id, c.mark.map(v => v.toFixed(9))]), theirs.map(c => [c.id, c.mark.map(v => v.toFixed(9))]), `${key}: a label's mark moved`);
      rested++;
    }
    // ---- S2: the sink. x and z fixed, clipped at y = 0 in every pass, nothing left above the floor at its end.
    const first = floor(off[0] + 1e-9);
    for (const t of [...steps(off[0] + 1e-9, off[1], 0.01 * PACE), off[1] - 1e-7 * PACE]) {
      const list = floor(t); report.samples++;
      assert.equal(list.length, first.length, `${key}: the exports changed during the sink`);
      list.forEach((pc, k) => {
        assert.ok(pc.clip && same(pc.clip, [0, 1, 0, 0]), `${key} ${t.toFixed(3)}: a piece is not clipped at the floor during the sink`);
        assert.ok(Math.abs(pc.p[0] - first[k].p[0]) < 1e-12 && Math.abs(pc.p[2] - first[k].p[2]) < 1e-12, `${key} ${t.toFixed(3)}: a sinking piece moves in x or z`);
        assert.ok(pc.p[1] <= first[k].p[1] + 1e-12, `${key}: a sinking piece rises`);
      });
      assert.ok(calloutsAt(g0 + t).length === 0, `${key}: a label is still out when the sink runs`);
    }
    const last = floor(off[1] - 1e-7 * PACE);
    assert.ok(Math.max(...last.flatMap(corners).map(c => c[1])) <= 1e-4, `${key}: something is left above the floor at the end of the sink`);
    assert.ok(!frameAt(g0 + s.len).some(pc => pc.where === 'floor'), `${key}: something stays on the floor after the sink`);
    // The cursor stays in front of the ball and the blocks, in depth only.
    for (const t of steps(a, b0.hold, 0.01 * PACE)) {
      const list = at(t), cursor = list.find(pc => pc.art === 'cursor'), solids = list.filter(pc => pc.solid);
      const box = pcs => { const c = pcs.flatMap(corners).map(project); return [Math.min(...c.map(p => p[0])), Math.min(...c.map(p => p[1])), Math.max(...c.map(p => p[0])), Math.max(...c.map(p => p[1]))]; };
      const cb = box([cursor]);
      for (const pc of solids) {
        const sb2 = box([pc]);
        if (cb[0] < sb2[2] && cb[2] > sb2[0] && cb[1] < sb2[3] && cb[3] > sb2[1]) assert.ok(dot(HOME.v, cursor.p) + (cursor.near || 0) - cursor.s[2] > Math.max(...corners(pc).map(c => dot(HOME.v, c))), `${key} ${t.toFixed(3)}: the ball is in front of the cursor`);
      }
      assert.ok(!list.pressed || t < a + 0.05 * PACE + 1e-9, `${key}: the cursor presses during the ball`);
    }
    info.rested = rested;
    report.scenes[key] = info;
  }
  return report;
}

// ---- N1: no outline bar or handle on the map frame's edges at any time in InDesign.
// A selection mark (a red overlay bar or a handle) lying on one of the map frame's (ID.frame) edges.
export function onMapFrame(M) {
  const { ID, SCREEN } = M, U = 1.15, [fx, fy, fw, fh] = ID.frame, edges = [[fx, fy, fx + fw, fy], [fx, fy + fh, fx + fw, fy + fh], [fx, fy, fx, fy + fh], [fx + fw, fy, fx + fw, fy + fh]];
  return pc => {
    if (!(pc.overlay && (pc.tone === 'red' || pc.art === 'anchor')) || pc.where === 'floor' || pc.art === 'cursor') return false;
    const c = corners(pc), x0 = (Math.min(...c.map(p => p[0])) - SCREEN.l) / U, x1 = (Math.max(...c.map(p => p[0])) - SCREEN.l) / U, y0 = (Math.min(...c.map(p => p[1])) - SCREEN.b) / U, y1 = (Math.max(...c.map(p => p[1])) - SCREEN.b) / U;
    return edges.some(([ax, ay, bx, by]) => {
      const along = ax === bx ? Math.min(y1, by) - Math.max(y0, ay) : Math.min(x1, bx) - Math.max(x0, ax);
      const on = ax === bx ? x0 <= ax + 0.02 && x1 >= ax - 0.02 : y0 <= ay + 0.02 && y1 >= ay - 0.02;
      return on && along >= -0.02;
    });
  };
}
// What round 15 changes on the screen on purpose, for the older checks that compare with frozen stages: the map's selection
// marks (N1), checked here instead. (N2's flat drags are applied to the frozen stages themselves: hand-patch.mjs, r15Patch.)
export const round15Changed = M => onMapFrame(M);
export async function checkMapFrame(M) {
  M ??= await load();
  const { SHOW, frameAt } = M, i = SHOW.findIndex(s => s.key === 'id'), g0 = SHOW.slice(0, i).reduce((n, s) => n + s.len, 0), mark = onMapFrame(M);
  let frames = 0;
  for (const t of steps(0, SHOW[i].len, 0.01)) {
    assert.ok(!frameAt(g0 + t).some(mark), `N1: an outline bar or handle lies on the map frame's edge at ${(g0 + t).toFixed(2)} s`);
    frames++;
  }
  return frames;
}

// ---- N2: through every drag in every app, the carried pictures' projected corners are those of the same rect lying at one
// constant height above the screen's face (moving on its straight line): within 0.1 px at 1440 x 900.
export async function checkDragsFlat(M) {
  M ??= await load();
  const { SHOW, SCRIPTS, frameAt } = M;
  let start = 0, drags = 0, samples = 0, worst = 0;
  for (const scene of SHOW) {
    for (const a of SCRIPTS[scene.key].actions.filter(a => a.kind === 'drag')) {
      const times = [...steps(a.start + 1e-7, a.end - 1e-7, 0.01), a.end - 1e-7];
      const tracks = times.map(t => frameAt(start + t).filter(pc => pc.where === 'travel' && pc.action === a.id && pc.art).map(pc => corners(pc).map(project)));
      const n = tracks[0].length;
      if (!n) continue;
      drags++;
      for (let k = 0; k < n; k++) {
        const first = tracks[0][k], last = tracks.at(-1)[k];
        if (!first || !last) continue;
        const d = first.map((p, c) => [last[c][0] - p[0], last[c][1] - p[1]]), dd = d.reduce((v, q) => v + q[0] ** 2 + q[1] ** 2, 0);
        let lambda = 0;
        for (const track of tracks) {
          const cs = track[k];
          if (!cs) continue;
          // the one fraction along the straight path that best fits all eight corners, then each corner's distance from it
          const l = dd > 1e-12 ? cs.reduce((v, p, c) => v + (p[0] - first[c][0]) * d[c][0] + (p[1] - first[c][1]) * d[c][1], 0) / dd : 0;
          const off = Math.max(...cs.map((p, c) => Math.hypot(p[0] - first[c][0] - l * d[c][0], p[1] - first[c][1] - l * d[c][1])));
          worst = Math.max(worst, off); samples++;
          assert.ok(off <= 0.1, `N2: ${scene.key}/${a.id}: the carried picture leaves its flat straight path by ${off.toFixed(3)} px`);
          assert.ok(l >= lambda - 1e-9, `N2: ${scene.key}/${a.id}: the carried picture goes back along its path`);
          lambda = l;
        }
      }
    }
    start += scene.len;
  }
  return { drags, samples, worst };
}

// The renderer keeps each piece's clip in every pass (shadow, picture and outline).
export function checkRendererClips() {
  const sq = fs.readFileSync(new URL('../sq.mjs', import.meta.url), 'utf8');
  for (const shader of ['FRAG', 'FRAG_FLAT', 'FRAG_NONE']) {
    const body = sq.split(`const ${shader} = \``)[1]?.split('`;')[0] || '';
    assert.ok(body.includes('${CLIP_FN}') && /void main\(\) \{\s*clipAt\(vW\)/.test(body), `S2: the ${shader} pass does not keep the clip`);
  }
  assert.ok(/gl\.uniform4fv\(u\.uClip, pc\.clip \|\| noClip\)/.test(sq), 'S2: a piece\'s clip is not given to every pass');
  return 'clipAt in the shadow, picture and outline passes';
}

export async function checkAll(M) {
  M ??= await load();
  const r = await checkRound15(M), n1 = await checkMapFrame(M), n2 = await checkDragsFlat(M), clips = checkRendererClips();
  const rises = Object.entries(r.scenes).map(([k, v]) => `${k} ${v.rise.toFixed(3)}`).join(', ');
  return `Round 15 S1/S2 computed: ${r.samples} samples at 0.01 s through four exports and sinks; nothing before Export; the pop inside the button, full size by its end; arc a true parabola (constant second difference), x and z linear, rising ${rises} above the pop's end, never below the floor or through the screen, inside the stage's box; resting on the floor at the blocks' centre; no bounce; the split from the ball to the blocks (footprint and thickness within 0.001, exact e); one wipe plane with two signs, monotonic left to right; no play before its wipe (or the lid); at rest equal to e1e55af (${Object.values(r.scenes).map(v => v.rested).join('/')} samples, label marks too); the sink straight down, clipped at y = 0 (${clips}), nothing left; the cursor in front of the ball. N1: no outline or handle on the map frame in ${n1} InDesign frames. N2: ${n2.drags} drags, ${n2.samples} carried-picture samples, worst ${n2.worst.toFixed(4)} px from the flat straight path (limit 0.1)`;
}

export async function checkRound15Controls() {
  const out = [];
  const control = async (name, edit, expected, run = checkAll) => {
    try { await run(await load(edit)); out.push(`${name}: MISSED`); }
    catch (error) { if (!String(error.message).includes(expected)) throw new Error(`${name}: wrong failure: ${error.message}`); out.push(`${name}: caught`); }
  };
  await control('a bounce after touchdown', s => s.replace('if (s >= T) return { c: end, r: R };', 'if (s >= T) return { c: [end[0], end[1] + 0.2 * Math.sin(Math.PI * clamp((s - T) / BALL.rest, 0, 1)), end[2]], r: R };'), 'a bounce', checkRound15);
  await control('a device plays before its wipe ends', s => s.replace('const clock = Math.max(0, (Math.min(t, off[0]) - land) / PACE) % 1.6 / 1.6, widths', 'const clock = Math.max(0, (Math.min(t, off[0]) - land + 0.3 * PACE) / PACE) % 1.6 / 1.6, widths'), 'plays before its wipe has ended', checkRound15);
  await control('one piece left unclipped in the sink', s => s.replace('for (const pc of all) { pc.p[1] -= depth * g; pc.clip = [0, 1, 0, 0]; pc.sink = true; }', 'for (const pc of all) { pc.p[1] -= depth * g; pc.clip = pc === all[0] ? undefined : [0, 1, 0, 0]; pc.sink = true; }'), 'not clipped at the floor during the sink', checkRound15);
  await control("the map's outline restored", s => s.replace("    // CORRECTIONS-15 N1: once placed, the map shows as it is, with no selection outline or handles.\n", "    if (done(s, 'map', t)) { const [x, y, w, h] = ID.frame; D.push(...outline(x, y, w, h, { line: 0.012 })); [[x, y + h], [x + w / 2, y + h], [x + w, y + h], [x, y + h / 2], [x + w, y + h / 2], [x, y], [x + w / 2, y], [x + w, y]].forEach(([x, y]) => D.push(handle(x, y))); }\n"), 'N1:', checkMapFrame);
  await control('the drag arc restored', s => s.replace('const pc = on(tone, ...rect, { lift: 0.08, t: 0.015, art });', 'const pc = on(tone, ...rect, { lift: 0.08 + 0.08 * Math.sin(Math.PI * p), t: 0.015, art });'), 'N2:', checkDragsFlat);
  if (out.some(line => line.endsWith('MISSED'))) throw new Error('Round 15 negative control missed: ' + out.join('; '));
  return out.join('; ');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // Register round 17's replacements for the changed pop, rest, sink and laptop dimensions, keeping N1/N2 and clip checks.
  if (!process.argv.includes('--controls')) console.log(await checkRound17Exports());
  console.log('Round 15 retained negative controls: ' + await checkRound17RetainedControls());
}
