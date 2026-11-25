// Retained N1 (no map selection frame), N2 (flat drags), and clip submission.
// Arrival physics routes to round 17; L13 replaces the former sink with its reversible wipe, merge and burst.
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

// L13: arrival physics is retained by round 17; its exit is now checked by L13.
export async function checkRound15(M) { return checkRound17Exports(M); }

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

export async function checkAll(M) { return checkRound17Exports(M); }
export async function checkRound15Controls() { return checkRound17RetainedControls(); }

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // Retained export/plane controls; the L13 exit has its own gates.
  if (!process.argv.includes('--controls')) console.log(await checkRound17Exports());
  console.log('Round 15 retained negative controls: ' + await checkRound17RetainedControls());
}
