// CORRECTIONS-7: the round-7 hand, applied in memory to a frozen earlier stage.mjs.
// The checks that compare today's frames with a snapshot (48aea47, 50b51b8, round 4, round-5 incoming)
// mean "nothing else moved". Round 7 deliberately moves the hand, so the snapshot gets the same edit:
//   K1  the cursor's approach, and every drag/draw/slide/stroke/run with what it carries, read HAND;
//   the lifted drag stack's cursor clears any guide it would otherwise tie with in depth;
//   K2  (when `k2`) the scheduler's approach and hand-action durations follow distance.
// Each edit must match exactly once, so a snapshot that no longer has the code fails loudly.
// The rest of the snapshot, including every non-hand EASE.wipe, is untouched.
export const HAND_SOURCE = 'x => Math.min(1, Math.max(0, x * x * x * (10 + x * (6 * x - 15))))';

function once(source, search, replace, label) {
  const n = source.split(search).length - 1;
  if (n !== 1) throw new Error(`hand patch: ${label} matched ${n} sites`);
  return source.replace(search, () => replace);
}

export function handPatch(source, { k2 = true, lift = true, g1 = true } = {}) {
  let s = source;
  // The snapshot reads hand actions through `eased`; dispatching on kind is the same edit as round 7's
  // explicit `handed` readers. Travel is only ever a drag's carrier, except Photoshop's export ('photo').
  s = once(s, 'const eased = (s, id, t) => EASE.wipe(phase(s, id, t));',
    `const HAND = ${HAND_SOURCE}, HAND_KINDS = ['drag', 'draw', 'slide', 'stroke', 'run'];\nconst eased = (s, id, t) => (HAND_KINDS.includes(action(s, id).kind) ? HAND : EASE.wipe)(phase(s, id, t));`, 'eased');
  s = once(s, 'point = rectMix(a.previous, a.from, progress(t, a.approach, a.start)); break; }',
    'point = rectMix(a.previous, a.from, HAND(linear(t, a.approach, a.start))); break; }', 'approach');
  s = once(s, 'actionPoint(a, EASE.wipe(phase(s, a.id, t)))', 'actionPoint(a, HAND(phase(s, a.id, t)))', 'cursor');
  s = once(s, 'function travel(P, key, from, to, t, a, b, endWindow = [0, 0, 1, 1]) {\n  const p = progress(t, a, b),',
    "function travel(P, key, from, to, t, a, b, endWindow = [0, 0, 1, 1]) {\n  const p = (key === 'photo' ? EASE.wipe : HAND)(linear(t, a, b)),", 'travel');
  if (lift && s.includes('function liftDragStack(P) {')) {
    s = once(s, '    if (rects.some(r => r[0] < b[2] && r[2] > b[0] && r[1] < b[3] && r[3] > b[1])) rise = Math.max(rise, pc.p[2] + pc.s[2] + LAYER_STEP * U - bottom);\n  }\n',
      `    if (rects.some(r => r[0] < b[2] && r[2] > b[0] && r[1] < b[3] && r[3] > b[1])) rise = Math.max(rise, pc.p[2] + pc.s[2] + LAYER_STEP * U - bottom);
  }
  const flat = pc => { const points = corners(pc); return [Math.min(...points.map(p => p[0])), Math.min(...points.map(p => p[1])), Math.max(...points.map(p => p[0])), Math.max(...points.map(p => p[1]))]; };
  if (cursor) {
    const c = flat(cursor), top = cursor.p[2] + cursor.s[2];
    const covered = P.filter(pc => !stack.includes(pc) && pc !== cursor && pc.where !== 'floor').filter(pc => { const b = flat(pc); return c[0] < b[2] - 1e-9 && c[2] > b[0] + 1e-9 && c[1] < b[3] - 1e-9 && c[3] > b[1] + 1e-9; }).map(pc => pc.p[2] + pc.s[2]);
    for (let k = 0; k < covered.length; k++) {
      const tie = covered.filter(h => Math.abs(top + rise - h) < LAYER_STEP * U);
      if (!tie.length) break;
      rise = Math.max(...tie) + LAYER_STEP * U - top;
    }
  }
`, 'lift');
  }
  if (k2) s = k2Patch(s);
  if (g1) s = g1Patch(s);
  return s;
}

// K2: the scheduler's distance rule with K3's projected-speed floor, paths walked by length, and the one run
// (InDesign's pages) that counted fixed 0.07 s steps now counting thirds of its own run. Same text as stage.mjs.
export function k2Patch(source) {
  let s = source;
  s = once(s, 'const move = distance < 1e-8 ? 0 : distance < 0.5 ? 0.12 : distance <= 1.5 ? 0.2 : 0.28;',
    'const move = distance < 1e-8 ? 0 : Math.max(Math.min(0.5, 0.18 + 0.07 * distance), handTime({ from: previous, to: from }));', 'approach time');
  s = once(s, "    if (def.kind === 'type') { duration = Math.max(typed ? 0.4 : 0.6, duration); typed = true; }\n",
    "    if (def.kind === 'type') { duration = Math.max(typed ? 0.4 : 0.6, duration); typed = true; }\n    if (HAND_KINDS.includes(def.kind)) duration = Math.max(duration, 0.12 + 0.08 * pathLength(def.path || [from, to]), handTime({ ...def, from, to }));\n", 'hand duration');
  s = once(s, '  if (a.path) { const f = p * (a.path.length - 1), i = Math.min(a.path.length - 2, Math.floor(f)); return rectMix(a.path[i], a.path[i + 1], f - i); }',
    '  if (a.path) { const [i, f] = alongPath(a.path, p); return rectMix(a.path[i], a.path[i + 1], f); }', 'path walk');
  s = once(s, "const p = eased(s, 'subway', t) * AI.segments.length;\n    AI.segments.forEach(([a, b], i) => { const f = clamp(p - i, 0, 1); if (f > 0) D.push(bar(AI.at(a), AI.at(rectMix(a, b, f)))); });",
    "const [reached, part] = alongPath(action(s, 'subway').path, eased(s, 'subway', t));\n    AI.segments.forEach(([a, b], i) => { const f = i < reached ? 1 : i === reached ? part : 0; if (f > 0) D.push(bar(AI.at(a), AI.at(rectMix(a, b, f)))); });", 'subway line');
  s = once(s, "begun(s, 'pages', t) && (t - action(s, 'pages').start) / PACE >= repeat * 0.07;", "begun(s, 'pages', t) && phase(s, 'pages', t) * action(s, 'pages').count >= repeat;", 'pages');
  s = once(s, 'const action = (s, id) => s.actions.find(a => a.id === id);', `function alongPath(points, p) {
  const lengths = points.slice(1).map((b, i) => Math.hypot(b[0] - points[i][0], b[1] - points[i][1])), total = lengths.reduce((n, d) => n + d, 0);
  let left = p * total;
  for (let i = 0; i < lengths.length; i++) { if (left <= lengths[i] || i === lengths.length - 1) return [i, lengths[i] ? clamp(left / lengths[i], 0, 1) : 1]; left -= lengths[i]; }
}
function handTime(route) {
  const d3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], page = ([x, y]) => [0, 1].map(k => 103.6 * U * d3([HOME.r, HOME.u][k], [x, y, 0])), n = 1000;
  let peak = 0, last = page(actionPoint(route, 0));
  for (let i = 1; i <= n; i++) { const p = page(actionPoint(route, HAND(i / n))); peak = Math.max(peak, Math.hypot(p[0] - last[0], p[1] - last[1]) * n); last = p; }
  if (!route.curve && !route.path) { const [a, b] = [page(route.from), page(route.to)]; peak = 1.875 * Math.hypot(b[0] - a[0], b[1] - a[1]); }
  return peak / 1500;
}
function pathLength(points) { let d = 0; for (let i = 1; i < points.length; i++) d += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]); return d; }
const action = (s, id) => s.actions.find(a => a.id === id);`, 'helpers');
  return s;
}

// K2 moves every later instant. A check that names an instant from the 83.04 s timetable (a drag's known fault
// time, a sampling window) maps it through the actions around it: each approach, action and hold is stretched
// linearly from its 83.04 s span to its span now. The 83.04 s timetable is the frozen round-5 incoming stage with
// round 7's hand (K1) but its own scheduler.
import fs from 'node:fs';
import { inflateRawSync } from 'node:zlib';
export async function retimer(current) {
  const take = new URL('../', import.meta.url);
  const record = JSON.parse(fs.readFileSync(new URL('fixtures/round5-addendum-source.json', import.meta.url), 'utf8')).sources['stage.mjs'];
  const raw = handPatch(inflateRawSync(Buffer.from(record.deflateBase64, 'base64')).toString('utf8'), { k2: false });
  const code = raw.replace(/from (['"])([^'"]+)\1/g, (_, q, ref) => 'from ' + q + new URL(ref, new URL('stage.mjs', take)).href + q);
  const old = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
  if (Math.abs(old.LOOP - 83.04) > 1e-9) throw new Error('retimer: the 83.04 s timetable is ' + old.LOOP);
  // CORRECTIONS-12 I1: actions are matched by id, so a step removed since (InDesign's frame0 to frame3) folds into the span
  // before the next action both timetables share.
  const shared = key => new Set(current.SCRIPTS[key].actions.map(a => a.id).filter(id => old.SCRIPTS[key].actions.some(a => a.id === id)));
  const events = (M, key) => { const ids = shared(key); return [0, ...M.SCRIPTS[key].actions.filter(a => ids.has(a.id)).flatMap(a => [a.approach, a.start, a.end]), M.SHOW.find(s => s.key === key).len]; };
  const starts = M => M.SHOW.map((_, i) => M.SHOW.slice(0, i).reduce((n, s) => n + s.len, 0));
  const local = (key, t) => {
    const a = events(old, key), b = events(current, key);
    for (let i = 1; i < a.length; i++) if (t <= a[i] + 1e-12 && a[i] > a[i - 1]) return b[i - 1] + (b[i] - b[i - 1]) * (t - a[i - 1]) / (a[i] - a[i - 1]);
    return b.at(-1) + t - a.at(-1);
  };
  const global = t => {
    const s = starts(old); let i = s.length - 1; while (s[i] > t) i--;
    return starts(current)[i] + local(old.SHOW[i].key, t - s[i]);
  };
  return { old, local, global };
}

// G1 (round 8): the carried stack leaves the page's separation. Applied to a frozen stage with the same text as stage.mjs, so
// a comparison with it still means "nothing else moved". Snapshots without the round-4 lift are left as they are.
import { readFileSync } from 'node:fs';
export function g1Patch(source) {
  const now = readFileSync(new URL('../stage.mjs', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  const call = '  separateFaces(P);\n  if (i === 2) liftDragStack(P);\n  return P;\n}\n';
  if (!source.includes(call)) return source;
  const block = now.slice(now.indexOf('  // G1 (round 8): the carried stack'), now.indexOf('// InDesign\'s carried faces and cursor keep'));
  let s = once(source, call, block, 'g1 build');
  s = once(s, "const pc = on('dark', ...r, { lift: 0.08, t: 0.02, art: 'wave' }); pc.where = 'travel'; D.push(pc); }", "const pc = on('dark', ...r, { lift: 0.08, t: 0.02, art: 'wave' }); pc.where = 'travel'; pc.action = 'music'; D.push(pc); }", 'g1 music');
  return s;
}

// CORRECTIONS-12 I1: InDesign no longer draws its four frames. A check that compares today's InDesign with a frozen stage at the
// same instant applies this to the frozen source in memory: the frame-draw steps leave its script (so its timetable is today's),
// and its pages count as drawn from the start. Its pictures, drags and cursor are otherwise its own. Floor geometry (D1, X1) is
// not patched; those checks compare the screen only.
export function r12Patch(source) {
  const line = /\n\s*\.\.\.\[ID\.spread, ID\.cover, ID\.post, ID\.mail\]\.map\(\(r, i\) => \(\{ id: 'frame' \+ i, kind: 'draw'[^\n]*/;
  if (!line.test(source)) throw new Error('r12Patch: InDesign frame steps not found');
  let s = source.replace(line, '');
  const from = s.indexOf('function editedInDesign('), to = s.indexOf('\nfunction ', from + 1);
  if (from < 0 || to < 0) throw new Error('r12Patch: editedInDesign not found');
  const body = s.slice(from, to)
    .replace(/begun\(s, 'frame' \+ i, t\)/g, 'true')
    .replace(/done\(s, 'frame0', t\)/g, 'true')
    .replace(/(?:eased|handed)\(s, 'frame(?:' \+ i|0'), t\)/g, '1')
    .replace(/action\(s, 'frame0'\)\.end/g, '0');
  if (/s, 'frame/.test(body)) throw new Error('r12Patch: a frame step is still read');
  return s.slice(0, from) + body + s.slice(to);
}

// CORRECTIONS-15 N2: a carried picture keeps one height from pickup to drop, with no arc toward the viewer. A check that compares
// today's drags with a frozen stage applies the same flattening to the frozen source in memory, so the comparison still means
// "nothing else moved". Sites a frozen source does not have are left as they are.
export function r15Patch(source) {
  return source
    .replace('lift = (dockStart ? mix(0.055, 0.06, p) : mix(0.06, 0.055, p)) + 0.08 * Math.sin(Math.PI * p)', 'lift = dockStart ? 0.06 : 0.055')
    .replace('{ lift: 0.08 + 0.08 * Math.sin(Math.PI * p), t: 0.015, art }', '{ lift: 0.08, t: 0.015, art }')
    .replace('{ lift: 0.06 + 0.08 * Math.sin(Math.PI * p), t: 0.012 }', '{ lift: 0.06, t: 0.012 }')
    .replace('const lift = 0.05 + 0.08 * Math.sin(Math.PI * p), clip = ', 'const lift = 0.05, clip = ')
    .replace('{ lift: 0.06 + 0.08 * Math.sin(Math.PI * p), t: 0.02, art }', '{ lift: 0.06, t: 0.02, art }');
}
