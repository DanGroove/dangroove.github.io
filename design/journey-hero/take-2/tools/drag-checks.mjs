// CORRECTIONS-4: geometry and renderer-call evidence, never a pixel/shadow render.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { inflateRawSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { HOME, dot } from '../../../../public/journey/hero/engine.mjs';
import { corners } from '../kit.mjs';
import { createRenderer } from '../sq.mjs';
import { SHOW, LOOP, PACE, SCRIPTS, SCENES, frameAt } from '../stage.mjs';
import { visibleProjection, polygonsOverlap } from './correction-checks.mjs';
import { equivalent } from '../view.mjs';
import { handPatch, retimer, r12Patch } from './hand-patch.mjs';

const take = new URL('../', import.meta.url);
const sources = JSON.parse(fs.readFileSync(new URL('fixtures/drag-sources.json', import.meta.url), 'utf8'));
const arts = { map: 'kMap', loc: 'kLoc', photo: 'coverImage', postPhoto: 'postImage', mailPhoto: 'mailImage' };
const start = SHOW.slice(0, 2).reduce((n, s) => n + s.len, 0);
const rect = pc => { const p = corners(pc); return [Math.min(...p.map(p => p[0])), Math.min(...p.map(p => p[1])), Math.max(...p.map(p => p[0])), Math.max(...p.map(p => p[1]))]; };
const overlap = (a, b) => Math.min(a[2], b[2]) > Math.max(a[0], b[0]) + 1e-8 && Math.min(a[3], b[3]) > Math.max(a[1], b[1]) + 1e-8;
const near = (a, b) => Math.abs(a - b) < 1e-8;
async function snapshot(name) {
  const raw = inflateRawSync(Buffer.from(sources[name].deflateBase64, 'base64')).toString('utf8');
  // The saved source used paths relative to take-2. Resolve imports there, in memory.
  // CORRECTIONS-7: round 7's hand edit is applied in memory; the hash below is still of the frozen bytes.
  // CORRECTIONS-12 I1: and without InDesign's frame steps, so its drags fall at today's instants.
  const source = r12Patch(handPatch(raw)).replace(/from (['"])([^'"]+)\1/g, (_, q, ref) => 'from ' + q + new URL(ref, take).href + q);
  return { module: await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64')), hash: createHash('sha256').update(raw).digest('hex') };
}
function stack(P, id) {
  const image = P.find(pc => pc.where === 'travel' && pc.art === arts[id]);
  const before = P[P.indexOf(image) - 1];
  return { image, backing: before?.where === 'travel' && !before.art ? before : null, cursor: P.find(pc => pc.art === 'cursor') };
}
// A WebGL call recorder exercises the real renderer's position selection only.
// It cannot validate rasterisation, alpha, lighting or the rendered wall shadow.
function rendererPositions(pc) {
  let current, pos, next = 0; const draws = [];
  const gl = new Proxy({}, { get: (_, key) => {
    if (/^[A-Z_0-9]+$/.test(key)) return key;
    if (key === 'createProgram') return () => ++next;
    if (key === 'getProgramParameter') return (_, p) => p === 'ACTIVE_UNIFORMS' ? 1 : true;
    if (key === 'getShaderParameter') return () => true;
    if (key === 'getActiveUniform') return () => ({ name: 'uPos' });
    if (key === 'getUniformLocation') return (_, name) => ({ name });
    if (key === 'useProgram') return p => { current = p; };
    if (key === 'uniform3fv') return (u, p) => { if (u?.name === 'uPos') pos = [...p]; };
    if (key === 'drawElements') return () => draws.push({ program: current, p: pos });
    return () => ({});
  } });
  createRenderer({ getContext: () => gl }).draw([pc], { W: 1440, H: 900, S: 100, cx: 720, cy: 450, cam: HOME }, { outline: 0 });
  return { shadow: draws.find(d => d.program === 3).p, colour: draws.find(d => d.program === 1).p };
}

export async function checkDrags(only = '') {
  const original = await snapshot('original');
  const incoming = await snapshot('incoming');
  assert.equal(original.hash, '2df6ef35ad20837ad73d5c181cef1a404e4023545adeab99f8070c63697b195d', '48aea47 snapshot changed');
  assert.equal(incoming.hash, '1cb6842044168b12c4c4bf551e389b7adf31c2faf8b28f927a4282972ebb55ab', '50b51b8 snapshot changed');
  const base = original.module;
  const enabled = rule => !only || only === rule;
  const require = (rule, ok, time, message) => { if (enabled(rule)) assert.ok(ok, `G1 ${rule}: ${time.toFixed(6)}s: ${message}`); };
  assert.equal(PACE, incoming.module.PACE);
  // H2 moves later clocks; H3 rotates only the Figma laptop and recentres its footprint.
  // CORRECTIONS-12 D1/X1 move the floor on purpose; the screen at each still is compared as before.
  const screen = list => list.filter(pc => pc.where !== 'floor');
  for (let i = 0; i < 5; i++) equivalent(screen(SCENES[i]()), screen(incoming.module.SCENES[i]()), 'G1 retained still differs from incoming 50b51b8');
  const points = SCENES.flatMap(make => make().flatMap(corners));
  const xs = points.map(p => dot(HOME.r, p)), ys = points.map(p => dot(HOME.u, p));
  // The player's initial 1440 x 900 desktop fit. Label fitting can only reduce S.
  const S = Math.min(742.4 / (Math.max(...xs) - Math.min(...xs) + 0.5), 740 / (Math.max(...ys) - Math.min(...ys) + 0.5));
  let samples = 0, maxCorner = 0, maxOffset = 0, minGap = Infinity;
  const times = new Set(), drags = SCRIPTS.id.actions.filter(a => arts[a.id]);
  for (const a of drags) {
    for (let n = 0; n <= Math.ceil((a.end - a.start) / (0.0005 * PACE)); n++) times.add(start + Math.min(a.end, a.start + n * 0.0005 * PACE));
    for (const at of [a.start, a.end]) for (const d of [-1e-8, 1e-8]) times.add(start + at + d * PACE);
  }
  // Instants named from the 83.04 s timetable are mapped to now through the actions around them (CORRECTIONS-7 K2).
  const { global: retime, local: retimeLocal } = await retimer({ SHOW, SCRIPTS });
  for (let n = 0; n <= 200; n++) times.add(retime(25.20 + n * 0.0005 * PACE));
  for (const time of [...times].sort((a, b) => a - b)) {
    const at = time - start, a = drags.find(a => at >= a.start && at < a.end);
    if (!a) continue;
    const P = frameAt(time), Q = base.frameAt(time), p = stack(P, a.id), q = stack(Q, a.id);
    require('order', !!p.image && !!q.image && !p.image.hide && !p.cursor.hide && !!p.backing === !!q.backing && !p.backing?.hide, time, 'missing or hidden carried face');
    if (!p.image || !q.image) continue;
    samples++;
    const gap = p.cursor.p[2] - p.cursor.s[2] - p.image.p[2] - p.image.s[2];
    minGap = Math.min(minGap, gap);
    require('order', gap >= 0.0008 * 1.15 - 1e-9 && (!p.backing || p.image.p[2] - p.image.s[2] > p.backing.p[2] + p.backing.s[2]), time, 'expected cursor above image above backing');
    const shift = p.image.p.map((v, i) => v - q.image.p[i]);
    maxOffset = Math.max(maxOffset, Math.hypot(...shift));
    for (const key of ['image', 'backing', 'cursor']) if (p[key] && q[key]) {
      require('order', p[key].p.every((v, i) => near(v - q[key].p[i], shift[i])), time, 'faces and cursor did not share one offset');
      require('shadow', (p[key].shadowP || p[key].p).every((v, i) => near(v, q[key].p[i])), time, 'shadow caster differs from 48aea47');
    }
    const before = corners(q.image), after = corners(p.image);
    for (let i = 0; i < before.length; i++) {
      const delta = after[i].map((v, k) => v - before[i][k]);
      const error = S * Math.hypot(dot(HOME.r, delta), dot(HOME.u, delta));
      maxCorner = Math.max(maxCorner, error);
      require('corners', error <= 0.1, time, `corner moved ${error.toFixed(6)} px from 48aea47`);
    }
    if (enabled('clearance') || enabled('frames')) {
      const guides = Q.filter(pc => pc.overlay && (pc.art === 'anchor' || (!pc.art && pc.tone === 'red')));
      const guide = pc => guides.some(q => pc.art === q.art && pc.tone === q.tone && pc.s.every((v, i) => near(v, q.s[i])) && pc.q.every((v, i) => near(v, q.q[i])) && pc.p.slice(0, 2).every((v, i) => near(v, q.p[i])));
      for (const face of [p.image, p.backing].filter(Boolean)) {
        const image = visibleProjection(face);
        for (const pc of P) {
          if (pc === p.image || pc === p.backing || pc === p.cursor || guide(pc)) continue;
          const outline = visibleProjection(pc);
          if (!polygonsOverlap(image, outline)) continue;
          // HOME.v.z is positive. If the whole other box is below this whole
          // box in z, every shared viewing ray meets the carried face first.
          // Visible convex hulls (including clips) supply the overlap test.
          const above = Math.max(...corners(pc).map(p => p[2])) >= Math.min(...corners(face).map(p => p[2])) - 1e-8;
          require('clearance', !above, time, `${pc.art || pc.page || pc.tone} drawn above carried image`);
          if (pc.page) require('frames', !above, time, 'blank page above carried image');   // CORRECTIONS-12 I1: pages, not frames
        }
      }
    }
  }
  // CORRECTIONS-12 I1: no crossed frames. Each blank page is whole (not hidden, never moved) from the document's opening until
  // its own picture is placed, and the placement leaves no bare wall.
  if (enabled('frames')) for (const [i, id] of ['map', 'photo', 'postPhoto', 'mailPhoto'].entries()) {
    const place = drags.find(a => a.id === id), opened = frameAt(start + 0.8 * PACE + 1e-7).filter(pc => pc.page === id);
    const samples = new Set(times);
    for (let n = 0; n <= 2180; n++) samples.add(retime(19.9 + n * 0.005 * PACE));
    for (const time of [...samples].sort((a, b) => a - b)) {
      const at = time - start; if (at <= 0.8 * PACE + 1e-9 || at > retimeLocal('id', 11.9 * PACE)) continue;
      const P = frameAt(time), plates = P.filter(pc => pc.page === id);
      require('frames', !P.some(pc => pc.emptyFrame), time, 'an empty frame is drawn');
      require('frames', at >= place.end - 1e-9 || (plates.filter(pc => !pc.pageEdge).length === (i ? 1 : 2) && plates.filter(pc => !pc.pageEdge).every((pc, j) => !pc.hide && pc.s.every((v, k) => near(v, opened[j].s[k])) && pc.p.slice(0, 2).every((v, k) => near(v, opened[j].p[k])))), time, `${id} page vanished or moved before placement`);
      const replacements = { map: ['kMap', 'kAmL'], photo: ['coverPhoto', 'coverBlob', 'coverDecor', 'kCover'], postPhoto: ['postPhoto', 'kPost'], mailPhoto: ['mailPhoto', 'eblast'] };
      require('frames', at < place.end - 1e-9 || plates.length || P.some(pc => pc.where === 'content' && !pc.echo && replacements[id].includes(pc.art)), time, `${id} placement left bare wall`);
    }
  }
  if (enabled('shadow')) for (const time of [22.144, 25.227, 25.25, 25.251, 27.2, 29.1].map(retime)) {
    for (const pc of frameAt(time).filter(pc => pc.shadowP)) {
      const positions = rendererPositions(pc);
      require('shadow', positions.shadow.every((v, i) => near(v, pc.shadowP[i])) && positions.colour.every((v, i) => near(v, pc.p[i])), time, 'renderer did not retain shadow position and lifted colour position');
    }
  }
  return `G1 drags: ${samples} samples at 0.0005 s, five drags including loc; order/one offset, projected occlusion and F1 lifetimes clean; max corner error=${maxCorner.toExponential(3)} px (S=${S.toFixed(6)}); minimum cursor gap=${minGap.toFixed(6)}; max offset=${maxOffset.toFixed(6)}; shadow positions/uniforms unchanged; five retained emitted stills unchanged (H2 timing/H3 Figma checked separately).\n48aea47 snapshot SHA256 ${original.hash}; incoming 50b51b8 snapshot SHA256 ${incoming.hash}. Rendered frames, shadows and pixel still identity UNRUN.`;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log(await checkDrags(process.argv.find(a => a.startsWith('--only='))?.slice(7)));
