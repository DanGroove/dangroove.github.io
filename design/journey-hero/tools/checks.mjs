// Checks on the choreography. They need Node and nothing else.
//
//   node design/journey-hero/tools/checks.mjs            every saved layout: do bars pass through each other, does the paint
//                                                        order ever disagree with what is in front, does a bar come near the text
//   node design/journey-hero/tools/checks.mjs near 9     for one beat of the loop: when is each pair of bars close on screen
//   node design/journey-hero/tools/checks.mjs tilt       the motion check again from the eight extremes of the pointer tilt
//
// The layouts in layouts.json are measured from the page by measure.mjs. Run this after any change to timeline.mjs or layout.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HOME, HALO, makeCamera, barBoxes, hull2, project, dot, sub, mul, cross, norm } from '../../../public/journey/hero/engine.mjs';
import { stateAt, IDS, ENTRANCE, BEATS } from '../../../public/journey/hero/timeline.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const CLEAR = 8;                          // px every bar keeps from every piece of text
export const loadLayouts = () => JSON.parse(fs.readFileSync(path.join(here, 'layouts.json'), 'utf8'));

// separating axis test for two boxes: the largest gap along any of the 15 axes (negative when they intersect)
export function boxGap(A, B) {
  const axes = [...A.axes, ...B.axes];
  for (const a of A.axes) for (const b of B.axes) { const c = cross(a, b); if (Math.hypot(...c) > 1e-6) axes.push(norm(c)); }
  const d = sub(B.centre, A.centre);
  let best = -Infinity, bestAxis = null;
  for (const L of axes) {
    const rA = A.half[0] * Math.abs(dot(A.axes[0], L)) + A.half[1] * Math.abs(dot(A.axes[1], L)) + A.half[2] * Math.abs(dot(A.axes[2], L));
    const rB = B.half[0] * Math.abs(dot(B.axes[0], L)) + B.half[1] * Math.abs(dot(B.axes[1], L)) + B.half[2] * Math.abs(dot(B.axes[2], L));
    const s = dot(d, L), gap = Math.abs(s) - rA - rB;
    if (gap > best) { best = gap; bestAxis = s >= 0 ? L : mul(L, -1); }
  }
  return { gap: best, axis: bestAxis };                        // the axis points from A to B
}
const outline = (box, cam) => hull2(box.corners.map(p => [dot(cam.r, p), dot(cam.u, p)]));
// do the two bars overlap on screen, counting the knockout (the bar's outline grown by `halo`)?
export function screenOverlap(a, b, cam, halo = HALO) {
  for (const A of barBoxes(a).map(x => outline(x, cam))) for (const B of barBoxes(b).map(x => outline(x, cam))) {
    let sep = -Infinity;
    for (const [P, Q] of [[A, B], [B, A]]) for (let i = 0; i < P.length; i++) {
      const p = P[i], q = P[(i + 1) % P.length], n = [q[1] - p[1], -(q[0] - p[0])], l = Math.hypot(n[0], n[1]); if (l < 1e-9) continue;
      const nx = n[0] / l, ny = n[1] / l;
      const maxP = Math.max(...P.map(v => v[0] * nx + v[1] * ny)), minQ = Math.min(...Q.map(v => v[0] * nx + v[1] * ny));
      sep = Math.max(sep, minQ - maxP);
    }
    if (sep < halo - 1e-6) return true;                       // closer than one gap: the later bar's knockout cuts the earlier bar
  }
  return false;
}
// do two boxes' pictures actually overlap?
function picturesMeet(A, B, cam) {
  const P = outline(A, cam), Q = outline(B, cam);
  for (const [M, N] of [[P, Q], [Q, P]]) for (let i = 0; i < M.length; i++) {
    const p = M[i], q = M[(i + 1) % M.length], n = [q[1] - p[1], -(q[0] - p[0])], l = Math.hypot(n[0], n[1]); if (l < 1e-9) continue;
    const maxM = Math.max(...M.map(v => (v[0] * n[0] + v[1] * n[1]) / l)), minN = Math.min(...N.map(v => (v[0] * n[0] + v[1] * n[1]) / l));
    if (minN - maxM > -0.01) return false;
  }
  return true;
}

// Over a stretch of the run, at every frame and for every pair of bars:
//   hit    the two solids intersect
//   order  they overlap on screen and the one painted later is the one behind
//   pop    the paint order of the pair changed while they were closer than one gap on screen, so the change shows
// Returns one line per problem, with the times it lasts. An empty list is a clean run.
export function motionCheck(entrance, { from = 0, to = ENTRANCE + 2 * BEATS, step = 1 / 60, cam = HOME } = {}) {
  const issues = [];
  let prevOrder = null;
  for (let t = from; t < to; t += step) {
    const st = stateAt(t, entrance), bars = st.bars;
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
      const a = bars[IDS[i]], b = bars[IDS[j]];
      let worst = Infinity, front = 0;
      for (const A of barBoxes(a)) for (const B of barBoxes(b)) {
        const g = boxGap(A, B); worst = Math.min(worst, g.gap);
        if (g.gap > 0.02 && picturesMeet(A, B, cam)) { const s = dot(g.axis, cam.v); if (Math.abs(s) > 1e-3) front += s > 0 ? 1 : -1; }   // +: b is in front of a
      }
      const touch = screenOverlap(a, b, cam, 0.002), ia = st.order.indexOf(a.id), ib = st.order.indexOf(b.id), pair = a.id + '/' + b.id;
      if (worst < -1e-3) issues.push({ t, kind: 'hit', pair, depth: +(-worst).toFixed(3) });
      else if (touch && front !== 0 && (front > 0) !== (ib > ia)) issues.push({ t, kind: 'order', pair, want: front > 0 ? b.id + ' over ' + a.id : a.id + ' over ' + b.id });
      if (prevOrder && screenOverlap(a, b, cam, HALO - 0.01)) { const pa = prevOrder.indexOf(a.id), pb = prevOrder.indexOf(b.id); if ((pa < pb) !== (ia < ib)) issues.push({ t, kind: 'pop', pair }); }
    }
    prevOrder = st.order;
  }
  const ranges = [];
  for (const it of issues) {
    const key = it.kind + ' ' + it.pair + (it.want ? ' want ' + it.want : '');
    const last = ranges.find(r => r.key === key && it.t - r.t1 < step * 1.5);
    if (last) { last.t1 = it.t; if (it.depth) last.depth = Math.max(last.depth ?? 0, it.depth); }
    else ranges.push({ key, t0: it.t, t1: it.t, depth: it.depth });
  }
  return ranges.map(r => `${r.key.padEnd(34)} ${r.t0.toFixed(2)}s to ${r.t1.toFixed(2)}s${r.depth ? '  depth ' + r.depth : ''}  (loop beat ${(((r.t0 - ENTRANCE) % BEATS + BEATS) % BEATS).toFixed(2)})`);
}

// For one beat: a row per pair of bars, a character per 1/60s. "X" they overlap on screen, "o" they are closer than one gap, "." they are apart.
// A change of paint order between two bars has to fall on a "." of that pair.
export function near(entrance, beat, loop = 1, step = 1 / 120) {
  const out = {};
  for (let tau = 0; tau < 1 - 1e-9; tau += step) {
    const st = stateAt(ENTRANCE + loop * BEATS + beat + tau, entrance);
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
      const a = st.bars[IDS[i]], b = st.bars[IDS[j]];
      (out[a.id + '/' + b.id] ??= []).push(screenOverlap(a, b, HOME, 0.002) ? 'X' : screenOverlap(a, b, HOME, HALO - 0.005) ? 'o' : '.');
    }
  }
  return Object.entries(out).map(([k, v]) => k + '  ' + v.filter((_, i) => i % 2 === 0).join('')).join('\n');
}

// How near does any bar come to each piece of text on a measured layout? { L, rects, late } as saved by measure.mjs.
export function textCheck({ L, rects, late }, { step = 1 / 60 } = {}) {
  const worst = {};
  for (let t = 0; t < ENTRANCE + 2 * BEATS; t += step) {
    const st = stateAt(t, L.entrance, L.zoom), S = L.S * st.zoom;
    for (const bar of Object.values(st.bars)) for (const box of barBoxes(bar)) {
      const poly = hull2(box.corners.map(p => project(p, HOME, S, L.cx, L.cy)));
      for (const [name, r] of Object.entries(rects)) {
        if (t < ENTRANCE + 1 && (name === 'foot' || name === 'pause' || (late && name === 'nav'))) continue;       // not on the page yet
        const R = [[r.left, r.top], [r.right, r.top], [r.right, r.bottom], [r.left, r.bottom]];
        let sep = -Infinity;
        for (const [P, Q] of [[poly, R], [R, poly]]) for (let i = 0; i < P.length; i++) {
          const p = P[i], q = P[(i + 1) % P.length], n = [q[1] - p[1], -(q[0] - p[0])], l = Math.hypot(n[0], n[1]); if (l < 1e-9) continue;
          for (const s of [1, -1]) {
            const nx = s * n[0] / l, ny = s * n[1] / l;
            sep = Math.max(sep, Math.min(...Q.map(v => v[0] * nx + v[1] * ny)) - Math.max(...P.map(v => v[0] * nx + v[1] * ny)));
          }
        }
        if (!(name in worst) || sep < worst[name].sep) worst[name] = { sep, t, bar: bar.id };
      }
    }
  }
  return worst;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const layouts = loadLayouts(), [cmd, ...args] = process.argv.slice(2);
  let bad = 0;
  if (cmd === 'near') console.log(near(layouts[0].L.entrance, +args[0], +(args[1] ?? 1)));
  else if (cmd === 'tilt') {
    // from a tilted view a few grazing pairs in the window's build read "order" for a frame or two; they are under a pixel and expected
    for (const [yaw, pitch] of [[6, 0], [-6, 0], [0, 4], [0, -4], [6, 4], [-6, -4], [6, -4], [-6, 4]]) {
      const lines = motionCheck(layouts[0].L.entrance, { from: ENTRANCE + 1, to: ENTRANCE + BEATS + 1, cam: makeCamera(yaw, pitch) });
      console.log(`yaw ${yaw} pitch ${pitch}: ${lines.length ? '\n  ' + lines.join('\n  ') : 'clean'}`);
    }
  } else {
    layouts.forEach((lay, i) => {
      // the loop is the same on every layout: the whole run is checked once, then only each layout's own opening and first fold
      const motion = motionCheck(lay.L.entrance, i === 0 ? {} : { to: ENTRANCE + 1 + 1 / 60 });
      const text = textCheck(lay), close = Object.entries(text).filter(([, x]) => x.sep < CLEAR);
      const nearest = Object.entries(text).sort((a, b) => a[1].sep - b[1].sep)[0];
      bad += motion.length + close.length;
      console.log(`${lay.size.padEnd(10)} S ${lay.L.S.toFixed(1).padStart(5)}  opening at ${lay.L.zoom.toFixed(2)}${lay.late ? ', nav cuts in late' : ''}`);
      console.log(`  motion  ${motion.length ? '\n    ' + motion.join('\n    ') : i === 0 ? 'clean over the opening and two loops' : 'clean over the opening and the first fold'}`);
      console.log(`  text    ${close.length ? close.map(([n, x]) => `${n} ${x.sep.toFixed(0)} px at ${x.t.toFixed(2)}s (${x.bar})  TOO CLOSE`).join(', ') : `clear, nearest is ${nearest[0]} at ${nearest[1].sep.toFixed(0)} px (${nearest[1].t.toFixed(2)}s, ${nearest[1].bar})`}`);
    });
    console.log(bad ? `\n${bad} problem${bad > 1 ? 's' : ''}` : '\nall clean');
    process.exitCode = bad ? 1 : 0;
  }
}
