// CORRECTIONS-17. Geometry and source checks only: no browser, rasterisation, file mutation or dependencies.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { HOME, dot, quatRotate, EASE } from '../../../../public/journey/hero/engine.mjs';
import { corners } from '../kit.mjs';
import { ART, ART_TEXT, HISTOGRAM, makeAtlas, letterMask, maskLetterPictures } from '../art.mjs';
import { checkMapFrame, checkDragsFlat, checkRendererClips, onMapFrame } from './round15-checks.mjs';

const url = new URL('../stage.mjs', import.meta.url);
const source = () => fs.readFileSync(url, 'utf8');
// Probe private painters in memory, without adding a testing API or writing a mutant into the prototype.
const painterProbe = `
export function round17PainterProbe(count, overlap, floor) {
  stacks = { screenCount: 0, floorCount: 0 };
  const P = [], painter = floor ? floorPainter : screenPainter;
  const first = painter(P, [0, 0, 1, 1]);
  for (let i = 0; i < count; i++) first('paper', [0, 0, 1, 1]);
  const second = painter(P, [overlap ? 0 : 2, 0, 1, 1]);
  second('paper', [0, 0, 1, 1]);
  if (floor) for (const pc of P) pc.where = 'floor';
  separateFaces(P); return P;
}
`;
const load = async edit => {
  const old = source(), changed = edit ? edit(old) : old;
  if (edit) assert.notEqual(changed, old, 'negative control did not apply');
  return import('data:text/javascript;base64,' + Buffer.from((changed + painterProbe).replace(/from (['"])(\.{1,2}\/[^'"]+)\1/g, (_, q, ref) => `from '${new URL(ref, url).href}'`)).toString('base64'));
};
const near = (a, b, gate, tolerance = 1e-9) => assert.ok(Math.abs(a - b) <= tolerance, `${gate}: ${a} versus ${b}`);
const starts = M => M.SHOW.map((_, i) => M.SHOW.slice(0, i).reduce((n, s) => n + s.len, 0));
const action = (M, key, id) => M.SCRIPTS[key].actions.find(a => a.id === id);
const at = (M, key, t) => M.frameAt(starts(M)[M.SHOW.findIndex(s => s.key === key)] + t);
const grid = (a, b) => Array.from({ length: Math.ceil((b - a) / 0.01) }, (_, i) => a + i * 0.01).filter(t => t < b - 1e-10);
const front = pc => corners(pc).filter((_, i) => i % 2 === 1);
const project = p => [dot(HOME.r, p), dot(HOME.u, p)];
// Conservative 1474 x 996 still-envelope fit and existing padding; the player's label fitting can only reduce this scale.
function scale(M) {
  const points = M.SCENES.flatMap(f => f().flatMap(corners)).map(project), xs = points.map(p => p[0]), ys = points.map(p => p[1]);
  return Math.min((1474 * 0.56 - 64) / (Math.max(...xs) - Math.min(...xs) + 0.5), (996 - 160) / (Math.max(...ys) - Math.min(...ys) + 0.5));
}
const top = pc => (pc.shadowP || pc.p)[2] + pc.s[2];
const distance = (a, b, S) => Math.max(...a.map((p, i) => Math.hypot(...project(p).map((v, k) => v - project(b[i])[k])) * S));
function fullCorners(pc) {
  const [u0, v0, u1, v1] = pc.labelRegion || pc.window || [0, 0, 1, 1];
  return [[0, 0], [0, 1], [1, 0], [1, 1]].map(([u, v]) => {
    const local = [(2 * (u - u0) / (u1 - u0) - 1) * pc.s[0], (1 - 2 * (v - v0) / (v1 - v0)) * pc.s[1], pc.s[2]];
    return quatRotate(pc.q, local).map((n, i) => n + pc.p[i]);
  });
}

// Canvas logic stand-in: transforms and text metrics only. It executes all atlas drawing paths, never renders a pixel.
export function prepareRound17Art() {
  if (ART_TEXT.kMap?.length) return;
  let matrix = [1, 0, 0, 1, 0, 0]; const stack = [];
  const ctx = new Proxy({
    font: '400 10px sans-serif', letterSpacing: '0px', textAlign: 'left',
    getTransform: () => Object.fromEntries(['a', 'b', 'c', 'd', 'e', 'f'].map((k, i) => [k, matrix[i]])),
    save() { stack.push({ matrix: matrix.slice(), font: this.font, letterSpacing: this.letterSpacing, textAlign: this.textAlign }); },
    restore() { const s = stack.pop(); matrix = s.matrix; Object.assign(this, { font: s.font, letterSpacing: s.letterSpacing, textAlign: s.textAlign }); },
    translate(x, y) { matrix[4] += matrix[0] * x + matrix[2] * y; matrix[5] += matrix[1] * x + matrix[3] * y; },
    scale(x, y) { matrix[0] *= x; matrix[1] *= x; matrix[2] *= y; matrix[3] *= y; },
    rotate(a) { const [x, y, z, w] = matrix, c = Math.cos(a), s = Math.sin(a); matrix[0] = x * c + z * s; matrix[1] = y * c + w * s; matrix[2] = -x * s + z * c; matrix[3] = -y * s + w * c; },
    measureText(s) { const px = +(this.font.match(/([\d.]+)px/)?.[1] || 10); return { width: s.length * px * 0.55, actualBoundingBoxAscent: px * 0.8, actualBoundingBoxDescent: px * 0.2 }; },
    createLinearGradient: () => ({ addColorStop() {} }),
  }, { get: (o, k) => k in o ? o[k] : () => {} });
  const doc = globalThis.document, path = globalThis.Path2D;
  globalThis.Path2D = class {}; globalThis.document = { createElement: () => ({ getContext: () => ctx }) };
  try { const atlas = makeAtlas(); assert.equal(atlas.pages.length, 5, 'R3 atlas: retain five pages'); }
  finally { if (doc === undefined) delete globalThis.document; else globalThis.document = doc; if (path === undefined) delete globalThis.Path2D; else globalThis.Path2D = path; }
}

// Old exact-site controls were authored with LF. Normalise their in-memory source reads on CRLF checkouts without changing files.
export async function withSourceLines(run) {
  const read = fs.readFileSync;
  fs.readFileSync = (...args) => { const result = read(...args); return typeof result === 'string' && String(args[0]).endsWith('.mjs') ? result.replaceAll('\r\n', '\n') : result; };
  try { return await run(); } finally { fs.readFileSync = read; }
}

export function sameRegisteredPicture(a, b) {
  const source = pc => pc.labelSource || ART[pc.art]?.source || pc.art;
  if (!a.registered || !b.registered || !a.art || source(a) !== source(b)) return false;
  return distance(fullCorners(a), fullCorners(b), 1) < 1e-7;
}

export async function checkLevels(M) {
  M ??= await load();
  const s = M.SCRIPTS.ps; let samples = 0;
  for (const id of ['black', 'white']) {
    const a = action(M, 'ps', id), expectedArts = id === 'black' ? ['photoRaw', 'photoHalf'] : ['photoHalf', 'photoLevels'];
    let last;
    for (const t of [a.start - 0.001, ...grid(a.start + 1e-9, a.end), a.end + 1e-9, a.end + 0.001]) {
      if (id === 'white' && t < a.start) {
        const photo = at(M, 'ps', t).find(pc => pc.art === 'photoRaw' && pc.artB === 'photoHalf');
        assert.ok(photo, 'R1 photo: half-levelled picture between slides'); near(photo.artMix, 1, 'R1 photo mix between slides'); continue;
      }
      const P = at(M, 'ps', t), photo = P.find(pc => pc.art === expectedArts[0] && pc.artB === expectedArts[1]);
      assert.ok(photo, `R1 photo: ${id} must mix its two neighbours on one piece`);
      const hand = M.HAND(Math.max(0, Math.min(1, (t - a.start) / (a.end - a.start))));
      near(photo.artMix, hand, 'R1 photo mix');
      const bars = P.filter(pc => pc.histogram !== undefined).sort((p, q) => p.histogram - q.histogram);
      assert.equal(bars.length, 48, 'R1 histogram: one set of 48 bars');
      const total = ((id === 'white' ? 1 : 0) + hand) / 2;
      bars.forEach((pc, i) => {
        const [dark, graded] = HISTOGRAM[i], h = 2 * pc.s[1];
        near(h, (dark + (graded - dark) * total) * 0.28 * 1.15, 'R1 histogram height');
        if (last) assert.ok(Math.abs(h - last.h[i]) <= Math.abs(graded - dark) * Math.abs(total - last.total) * 0.28 * 1.15 + 1e-12, 'R1 histogram: height jumps beyond handle step');
      });
      last = { h: bars.map(pc => pc.s[1] * 2), total }; samples++;
    }
  }
  const shader = fs.readFileSync(new URL('../sq.mjs', import.meta.url), 'utf8');
  assert.match(shader, /mix\(texture\(uAtlas,.*texture\(uAtlasB,.*uArtMix\)/, 'R1 shader: per-pixel adjacent-picture mix');
  assert.match(shader, /gl\.uniform1i\(u\.uAtlasB, 2\)/, 'R1 shader: independent atlas page sampler');
  return samples;
}

export async function checkDrawsAndLetters(M) {
  M ??= await load();
  prepareRound17Art(); const S = scale(M); let samples = 0;
  for (const [id, art] of [['badge', 'kMap'], ['block', 'locBlocks']]) {
    const origin = id === 'badge' ? [1273 / 2200, 457 / 850] : [660 / 1352, 16 / 850], isDraw = pc => pc.art === art && pc.window && origin.every((v, i) => Math.abs(v - pc.window[i]) < 1e-9);
    const a = action(M, 'ai', id), final = at(M, 'ai', a.end + 0.001).find(isDraw);
    assert.ok(final, `R2 draw: missing ${id}'s finished region`);
    for (const t of grid(a.start + 0.01, a.end)) {
      const P = at(M, 'ai', t), pc = P.find(isDraw), p = M.HAND((t - a.start) / (a.end - a.start));
      assert.ok(pc, `R2 draw: ${id} is an untextured box`);
      const opaque = P.filter(q => q.document && !q.art && !q.overlay && q.s[0] > 0.002 && q.s[1] > 0.002 && top(q) > top(pc) - 0.001);
      assert.ok(!opaque.some(q => distance(front(q), front(pc), S) < 10), 'R2 draw: untextured opaque piece over map');
      assert.ok(distance(fullCorners(pc), fullCorners(final), S) <= 0.1, `R2 draw: ${id} not registered`);
      near(pc.s[0] / final.s[0], p, 'R2 growing width'); near(pc.s[1] / final.s[1], p, 'R2 growing height'); samples++;
    }
  }
  for (const [key, ids] of [['ai', ['labels', 'title', 'cityLabels']], ['id', ['mailTitle']]]) for (const id of ids) {
    const a = action(M, key, id), art = a.textArt, final = at(M, key, a.end + 0.001);
    for (const t of grid(a.start + 0.01, a.end)) {
      const P = at(M, key, t), labels = P.filter(pc => pc.labelSource === art);
      assert.ok(labels.length, `R3 letters: ${key}/${id} missing letters`);
      const rect = a.textRect, ref = M.on('ink', ...rect, { lift: key === 'ai' ? 0.08 : 0.076, t: 0.004 });
      for (const pc of labels) {
        assert.ok(pc.cut && ART[pc.art]?.lettersOnly, 'R3 letters: label shows ground');
        const crop = ART[pc.art].sourceRect, size = ART[art], uv = [crop[0] / (size.w - 1), crop[1] / (size.h - 1), (crop[2] - 1) / (size.w - 1), (crop[3] - 1) / (size.h - 1)];
        uv.forEach((v, i) => near(pc.labelRegion[i], v, 'R3 texel-centre registration'));
        assert.ok(distance(fullCorners(pc), fullCorners(ref), S) <= 0.1, `R3 registration: ${id} at lift ${top(pc)}`);
      }
      assert.ok(P.some(pc => pc.caret === art), 'R3 letters: missing caret'); samples++;
    }
  }
  // Execute the companion drawings with a paint recorder: only fillText may reach the underlying context.
  for (const [key, picture] of Object.entries(ART).filter(([, a]) => a.lettersOnly)) {
    const log = [], ctx = new Proxy({ getTransform: () => ({a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}), measureText: s => ({ width: s.length * 10 }), createLinearGradient: () => ({ addColorStop() {} }) }, { get: (o, k) => k in o ? o[k] : (...args) => { if (['fill', 'stroke', 'fillRect', 'strokeRect', 'drawImage', 'fillText'].includes(k)) log.push([k, ...args]); }, set: (o, k, v) => (o[k] = v, true) });
    picture.draw(ctx, picture.w, picture.h);
    assert.ok(log.length === 1 && log[0][0] === 'fillText', `R3 letters: ${key} paints ground or a neighbouring label`);
    assert.equal(log[0][1], ART_TEXT[picture.source][picture.labelIndex].words, 'R3 letters: wrong individual label');
  }
  return samples;
}

export async function checkDocumentHeights(M) {
  M ??= await load(); prepareRound17Art();
  const end = action(M, 'id', 'mailFlyer').end, panelX = M.SCREEN.l + (M.SCREEN.w / 1.15 - 0.93) * 1.15;
  const face = pc => (top(pc) - M.SCREEN.z - M.SCREEN.t / 2) / 1.15;
  const pageArt = new Set(['kAmL', 'kAmR', 'coverPhoto', 'coverBlob', 'coverDecor', 'kCover', 'postPhoto', 'kPost', 'mailPhoto', 'eblast']);
  let samples = 0, pages = 0, layers = 0;
  for (const t of [...grid(0.800001, end), end + 0.001]) {
    const P = at(M, 'id', t);
    for (const pc of P.filter(pc => pc.document && pc.where !== 'travel' && !pc.overlay && !pc.caret && !pc.furniture)) {
      if (pc.page && !pc.pageEdge || pageArt.has(pc.art) && pc.p[0] < panelX && !pc.window) {
        near(face(pc), 0.080, 'F1 page face', 1e-9);
        near(pc.s[2] * 2 / 1.15, 0.02, 'F1 page thickness'); pages++;
      } else if (pc.art && pc.p[0] < panelX) {
        assert.ok(face(pc) >= 0.080 - 1e-9 && face(pc) <= 0.080 + 4 * 0.0008 + 1e-9, `F1 page layers: ${pc.art} at ${face(pc)}`); layers++;
      } else if (pc.art) near(face(pc), 0.073, `F1 panel thumbnails unchanged: ${pc.art} at ${t}`, 1e-9);
    }
    for (const pc of P.filter(pc => pc.where === 'travel' && pc.art && ['map', 'loc', 'photo', 'postPhoto', 'mailPhoto'].includes(pc.action))) {
      near(face(pc), pc.action === 'loc' ? 0.073 : 0.080, 'F1 carried landing face', 1e-9);
    }
    samples++;
  }
  assert.ok(pages > 100 && layers > 100, 'F1 height audit did not exercise pages and construction layers');
  return { samples, pages, layers };
}

// Replaces the old frame-global increasing-stack assertion: depth is monotone within each painter, and overlapping painters
// retain drawing order. Disjoint viewers/devices have no ordering requirement relative to one another.
export function checkPainterStacks(list, floor) {
  const axis = floor ? 1 : 2, unit = floor ? 1 : 1.15, previous = new Map(), placed = [];
  for (const pc of list.filter(pc => (pc.where === 'floor') === floor && pc.paintLayer !== undefined && !pc.overlay).sort((a, b) => a.paintLayer - b.paintLayer)) {
    const n = quatRotate(pc.q, [0, 0, 1]); if (n[axis] < 1 - 1e-9) continue;
    const height = (pc.p[axis] + pc.s[2]) / unit, before = previous.get(pc.paintStack);
    assert.ok(before === undefined || height >= before + 0.0008 - 1e-10, 'F2 own painter stack: layers out of order');
    const points = corners(pc), across = floor ? 2 : 1, r = [Math.min(...points.map(p => p[0])), Math.min(...points.map(p => p[across])), Math.max(...points.map(p => p[0])), Math.max(...points.map(p => p[across]))];
    for (const old of placed) if (overlaps(r, old.r)) assert.ok(height >= old.height + 0.0008 - 1e-10, 'F2 overlapping painters: drawing order changed');
    previous.set(pc.paintStack, height); placed.push({ r, height });
  }
}

export async function checkPlaybackStability(M) {
  M ??= await load();
  const S = scale(M); let samples = 0, faces = 0, worst = 0;
  for (const key of ['pr', 'ae', 'fig']) {
    const { land, off } = M.playbackSpans(M.SCRIPTS[key]), stop = key === 'fig' ? land + 3 * M.PACE : off[0];
    if (key !== 'fig') near((off[0] - land) / M.PACE, 3.2, 'F2 two plays: ' + key);
    const fixed = P => P.filter(pc => pc.where === 'floor' && (pc.deviceBody || pc.lid || pc.art?.startsWith('chrome') || !pc.lidPicture && (pc.art === 'paperTile' || !pc.window && /^shot[A-C]/.test(pc.art || ''))));
    const baseline = fixed(at(M, key, land + 1e-7));
    const times = [...grid(land + 1e-7, stop), stop - 1e-7];
    if (key !== 'fig') times.push(land + (1.6 - 0.001) * M.PACE, land + (1.6 + 0.001) * M.PACE);
    for (const t of times) {
      const P = at(M, key, t), now = fixed(P);
      assert.equal(now.length, baseline.length, 'F2 stationary faces: piece list changes');
      for (let i = 0; i < now.length; i++) {
        const pc = now[i], ref = baseline[i], error = distance(corners(pc), corners(ref), S);
        assert.equal(pc.device, ref.device, 'F2 stationary faces: device changes');
        assert.ok(error <= 0.1, `F2 stationary faces: ${key}/${pc.device}/${pc.art || 'body'} moves ${error.toFixed(5)} px`);
        near(pc.p[1], ref.p[1], 'F2 stationary faces: base height', 1e-9);
        worst = Math.max(worst, error); faces++;
      }
      checkPainterStacks(P, true); checkPainterStacks(P, false); samples++;
    }
    if (key !== 'fig') {
      near(at(M, key, land + 1.599 * M.PACE).clock, 1.599 / 1.6, 'F2 first play');
      near(at(M, key, land + 1.601 * M.PACE).clock, 0.001 / 1.6, 'F2 restart');
      near(at(M, key, off[0] + 0.001 * M.PACE).clock, 1, 'F2 final frame held');
    }
  }
  const probe = M.round17PainterProbe ? M : await load();
  for (const floor of [false, true]) {
    const axis = floor ? 1 : 2, a = probe.round17PainterProbe(1, false, floor), b = probe.round17PainterProbe(6, false, floor);
    near(a.at(-1).p[axis], b.at(-1).p[axis], 'F2 independent painter bases');
    const overlapping = probe.round17PainterProbe(6, true, floor);
    assert.ok(overlapping.at(-1).p[axis] + overlapping.at(-1).s[2] >= Math.max(...overlapping.slice(0, -1).map(pc => pc.p[axis] + pc.s[2])) + 0.0008 * (floor ? 1 : 1.15) - 1e-10, 'F2 overlapping painters: lost drawing order');
  }
  return { samples, faces, worst };
}

export function checkLetterMasks(A = { letterMask, maskLetterPictures }) {
  prepareRound17Art();
  const all = Object.entries(ART).filter(([, a]) => a.lettersOnly), sources = new Map();
  let texels = 0, covered = 0;
  for (const [key, a] of all) {
    const parent = ART[a.source], w = a.w, h = a.h, letters = new Uint8ClampedArray(w * h * 4);
    // Low-coverage islands separated from opaque ones reproduce the regression without pretending to rasterise a font.
    for (let y = 0; y < h; y += 7) for (let x = 0; x < w; x += 7) letters[(y * w + x) * 4 + 3] = 1 + (x + y * 17) % 127;
    letters[3] = 1; letters[letters.length - 1] = 127;
    if (!sources.has(a.source)) {
      const data = new Uint8ClampedArray(parent.w * parent.h * 4);
      for (let i = 0; i < data.length; i += 4) { data[i] = i / 4 % 251; data[i + 1] = Math.floor(i / 4 / parent.w) % 253; data[i + 2] = i / 4 * 17 % 255; data[i + 3] = 255; }
      sources.set(a.source, { data });
    }
    const original = letters.slice(); let written = null;
    const pages = [
      { getContext: () => ({ getImageData(x, y, W, H) { assert.deepEqual([x, y, W, H], [2, 3, w, h], 'F3 crop read'); return { data: letters }; }, putImageData(image, x, y) { assert.deepEqual([x, y], [2, 3], 'F3 crop write'); written = image.data; } }) },
      { getContext: () => ({ getImageData(x, y, W, H) { assert.deepEqual([x, y, W, H], [5, 7, parent.w, parent.h], 'F3 finished read'); return sources.get(a.source); } }) },
    ];
    A.maskLetterPictures(pages, [[a.source, parent, 5, 7, parent.w, parent.h, 1], [key, a, 2, 3, w, h, 0]]);
    assert.ok(written, `F3 mask wiring: ${key} was not masked`);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      let support = false;
      for (const dy of [-1, 0, 1]) for (const dx of [-1, 0, 1]) if (x + dx >= 0 && x + dx < w && y + dy >= 0 && y + dy < h && original[((y + dy) * w + x + dx) * 4 + 3] > 0) support = true;
      assert.equal(written[i + 3], support ? 255 : 0, `F3 mask coverage: ${key} texel ${x},${y}`);
      if (support) {
        const j = ((a.sourceRect[1] + y) * parent.w + a.sourceRect[0] + x) * 4, finished = sources.get(a.source).data;
        for (let c = 0; c < 3; c++) assert.equal(written[i + c], finished[j + c], `F3 finished pixels: ${key} texel ${x},${y}/${c}`);
        covered++;
      }
      texels++;
    }
  }
  const alpha = new Uint8ClampedArray(256 * 4), finished = new Uint8ClampedArray(alpha.length).fill(93);
  for (let i = 0; i < 256; i++) alpha[i * 4 + 3] = i;
  const mask = A.letterMask(alpha, finished, 256, 1);
  for (let i = 1; i < 256; i++) assert.equal(mask[i * 4 + 3], 255, 'F3 mask coverage: every nonzero alpha byte');
  assert.match(fs.readFileSync(new URL('../art.mjs', import.meta.url), 'utf8'), /maskLetterPictures\(pages, sheets\.flatMap/, 'F3 atlas: masks are not applied');
  assert.equal(all.length, 54, 'F3 inventory: all individual cut-outs covered');
  return { pictures: all.length, texels, covered };
}

const family = key => {
  const art = ART[key]?.source || key;
  return /^(mapStreet|kMap)$/.test(art) ? 'map' : /^(locStreets|kLoc)$/.test(art) ? 'loc' : /^(coverPhoto|coverBlob|coverDecor|kCover)$/.test(art) ? 'cover' : /^(postPhoto|kPost)$/.test(art) ? 'post' : /^(mailPhoto|eblast)$/.test(art) ? 'mail' : art;
};
export async function checkSwaps(M) {
  M ??= await load();
  prepareRound17Art(); const S = scale(M); let boundaries = 0, comparisons = 0, worst = 0;
  for (const scene of M.SHOW) for (const a of M.SCRIPTS[scene.key].actions) {
    const before = at(M, scene.key, a.end - 0.001), after = at(M, scene.key, a.end + 0.001);
    const pictures = P => P.filter(pc => pc.art && pc.art !== 'cursor' && (pc.document || pc.where === 'travel') && !pc.overlay && !pc.caret && !pc.playback);
    const A = pictures(before), B = pictures(after);
    for (const pc of A) {
      const candidates = B.filter(q => family(q.art) === family(pc.art));
      // A release may deliberately replace its photograph profile or fill a new frame. Those are additions, not swaps.
      if (!candidates.length) continue;
      const isMap = ['map', 'loc'].includes(family(pc.art)), points = fullCorners(pc);
      const choices = candidates.map(q => {
        const error = distance(points, fullCorners(q), S), uv = (pc.labelRegion || pc.window || [0, 0, 1, 1]).reduce((n, v, i) => n + Math.abs(v - (q.labelRegion || q.window || [0, 0, 1, 1])[i]), 0);
        return { q, error, score: error + uv * 1000 };
      }).sort((p, q) => p.score - q.score);
      const best = choices[0];
      // Different instances of the same artwork (a page thumbnail and a full page) must not be mistaken for a replacement.
      if (best.error > 20) continue;
      assert.ok(best.error <= 0.1, `G corners: ${scene.key}/${a.id} ${pc.art} moves ${best.error.toFixed(4)} px`);
      near(top(pc), top(best.q), `G face: ${scene.key}/${a.id} ${pc.art}`, 0.0008 * 1.15 + 1e-9);
      worst = Math.max(worst, best.error); comparisons++;
    }
    boundaries++;
  }
  // Known build-to-finished page swaps: compare full page anchors even where the source texture changes.
  for (const [id, arts] of [['coverTitle', ['coverDecor', 'kCover']], ['postButton', ['postPhoto', 'kPost']], ['mailFlyer', ['kPost', 'kPost']], ['mailFlyer', ['kCover', 'kCover']], ['mailFlyer', ['kAmL', 'kAmL']], ['mailFlyer', ['kAmR', 'kAmR']]]) {
    const a = action(M, 'id', id), pick = (t, art) => at(M, 'id', t).filter(pc => pc.art === art && !pc.window && pc.where === 'content').sort((p, q) => q.s[0] - p.s[0])[0];
    const p = pick(a.end - 0.001, arts[0]), q = pick(a.end + 0.001, arts[1]);
    assert.ok(p && q, `G page: ${id}/${arts} missing page`);
    assert.ok(distance(front(p), front(q), S) <= 0.1, `G page corners: ${id}/${arts}`); near(top(p), top(q), `G page face: ${id}/${arts}`, 0.0008 * 1.15 + 1e-9); comparisons++;
  }
  // The location map is split across two page thumbnails after release. Reconstruct its 1352/1100-page-wide footprint from
  // the emitted left page, rather than overlooking it because its texture key changes from kLoc to kLocL/R.
  const loc = action(M, 'id', 'loc'), incoming = at(M, 'id', loc.end - 0.001).find(pc => pc.art === 'kLoc' && pc.where === 'travel');
  const pages = at(M, 'id', loc.end + 0.001).filter(pc => ['kLocL', 'kLocR'].includes(pc.art)), left = pages.find(pc => pc.art === 'kLocL');
  assert.ok(incoming && left && pages.length === 2, 'G loc: missing map or thumbnail');
  const panelMap = [[0, 0], [0, 1], [1352 / 1100, 0], [1352 / 1100, 1]].map(([u, v]) => quatRotate(left.q, [(2 * u - 1) * left.s[0], (1 - 2 * v) * left.s[1], left.s[2]]).map((n, i) => n + left.p[i]));
  assert.ok(distance(fullCorners(incoming), panelMap, S) <= 0.1, 'G loc: map shifts into thumbnails'); near(top(incoming), top(left), 'G loc: drop face', 0.0008 * 1.15 + 1e-9); comparisons++;
  return { boundaries, comparisons, worst };
}

const rect = points => { const p = points.map(project); return [Math.min(...p.map(q => q[0])), Math.min(...p.map(q => q[1])), Math.max(...p.map(q => q[0])), Math.max(...p.map(q => q[1]))]; };
const overlaps = (a, b) => a[0] < b[2] - 1e-9 && a[2] > b[0] + 1e-9 && a[1] < b[3] - 1e-9 && a[3] > b[1] + 1e-9;
export async function checkCarries(M) {
  M ??= await load();
  let samples = 0, carries = 0;
  for (const scene of M.SHOW) for (const a of M.SCRIPTS[scene.key].actions) {
    if (!['drag', 'export'].includes(a.kind)) continue;
    let seen = false;
    for (const t of grid(a.start + 1e-7, a.end)) {
      const P = at(M, scene.key, t), moving = P.filter(pc => pc.where === 'travel' && pc.action);
      if (!moving.length) continue;
      const mine = moving.filter(pc => pc.art && pc.action === a.id);
      assert.ok(mine.length, `R4 tagging: ${scene.key}/${a.id} carry is invisible to carriedStack`);
      const stack = M.carriedStack(P); assert.ok(mine.every(pc => stack.includes(pc)), 'R4 tagging: carriedStack misses picture');
      for (const pc of mine) {
        const r = rect(front(pc)), depth = Math.min(...front(pc).map(p => dot(HOME.v, p)));
        for (const q of P.filter(q => !stack.includes(q) && q.where !== 'floor')) if (overlaps(r, rect(front(q)))) {
          const highest = Math.max(...front(q).map(p => dot(HOME.v, p)));
          assert.ok(depth >= highest + 0.0008 * 1.15 - 1e-8, `R4 clearance: ${scene.key}/${a.id} behind ${q.art || q.tone}`);
        }
        const n = quatRotate(pc.q, [0, 0, 1]); near(n[2], 1, 'R4 flat face');
      }
      samples++; seen = true;
    }
    if (seen) carries++;
  }
  const flat = await checkDragsFlat(M); return { samples, carries, flat };
}

const bounds = pcs => { const p = pcs.flatMap(corners); return [Math.min(...p.map(q => q[0])), Math.min(...p.map(q => q[2])), Math.max(...p.map(q => q[0])), Math.max(...p.map(q => q[2])), Math.max(...p.map(q => q[1])), Math.min(...p.map(q => q[1]))]; };
export async function checkFlight(M) {
  M ??= await load();
  let samples = 0;
  for (const key of ['id', 'pr', 'ae', 'fig']) {
    const a = action(M, key, 'export').start, b = M.ballBeats(key, 0), held = at(M, key, a + (b.split + b.hold) / 2).filter(pc => pc.morph === 'shape'), foot = bounds(held), to = [(foot[0] + foot[2]) / 2, (foot[1] + foot[3]) / 2], T = M.BALL.pop + M.BALL.arc;
    const flight = Array.from({ length: 111 }, (_, i) => M.ballAt(i * 0.01, to));
    const velocity = flight.slice(1).map((p, i) => p.c.map((v, k) => (v - flight[i].c[k]) / 0.01));
    const acceleration = velocity.slice(1).map((v, i) => v.map((n, k) => (n - velocity[i][k]) / 0.01));
    assert.ok(velocity[0][1] > 0, 'R6 flight: launch is not upward');
    assert.ok(Math.max(...flight.map(p => p.c[1])) > M.EXPORT_BUTTON.rect[3], 'R6 flight: peak below button top');
    for (const v of acceleration) { near(v[0], 0, 'R6 flight: x acceleration', 1e-6); near(v[2], 0, 'R6 flight: z acceleration', 1e-6); near(v[1], acceleration[0][1], 'R6 flight: constant gravity / continuous velocity', 1e-6); }
    for (let i = 0; i < 110; i++) {
      const p = flight[i], emitted = at(M, key, a + i * 0.01 + 1e-8).find(pc => pc.morph === 'ball');
      assert.ok(emitted, 'R6 flight: missing emitted ball');
      p.c.forEach((v, k) => near(v, emitted.p[k], 'R6 emitted trajectory', 1e-6));
      assert.ok(p.c[2] - p.r > M.EXPORT_BUTTON.face, 'R6 screen: ball touches screen/button/bar');
      if (i * 0.01 < M.BALL.pop && p.c[1] - p.r < M.EXPORT_BUTTON.rect[3]) assert.deepEqual(p.clip, [0, 1, 0, -M.EXPORT_BUTTON.rect[3]], 'R6 emergence: missing top-side clip');
      samples++;
    }
    const last = M.ballAt(T, to); near(last.c[1], last.r, 'R6 floor landing', 1e-6); near(last.c[0], to[0], 'R6 footprint x', 1e-6); near(last.c[2], to[1], 'R6 footprint z', 1e-6);
    near(M.BALL.rest, 0, 'R7 immediate split'); near(b.rest, T, 'R7 touchdown split');
    const first = at(M, key, a + b.rest + 1e-9).filter(pc => pc.morph === 'split'), next = at(M, key, a + b.rest + 0.01).filter(pc => pc.morph === 'split');
    assert.equal(first.length, 3, 'R7 split first frame');
    first.forEach(pc => { pc.p.forEach((v, i) => near(v, last.c[i], 'R7 split equals touchdown', 1e-6)); pc.s.forEach(v => near(v, last.r, 'R7 split starts as ball', 1e-6)); });
    assert.ok(next.every((pc, i) => distance(corners(pc), corners(first[i]), scale(M)) > 0.1), 'R7 split: first step does not visibly move');
    // Retained round-15 rules: red blocks and formats share opposite wipe planes; no play before complete.
    for (let j = 0; j < 3; j++) {
      const beat = M.ballBeats(key, j), shape = held.find(pc => pc.part === j);
      const format = at(M, key, a + (beat.wipe + beat.wiped) / 2).filter(pc => pc.wiped === j), f = bounds(format), block = bounds([shape]);
      f.slice(0, 4).forEach((v, i) => near(v, block[i], 'R15 retained: block footprint', 0.001));
      const fullWidth = format.filter(pc => Math.abs(bounds([pc])[2] - bounds([pc])[0] - (f[2] - f[0])) < 1e-6);
      near(block[4], Math.max(...fullWidth.map(pc => bounds([pc])[4])), 'R15 retained: block thickness', 0.001);
      for (const u of grid(beat.wipe + 1e-7, beat.wiped)) {
        const P = at(M, key, a + u), red = P.find(pc => pc.morph === 'shape' && pc.part === j), pieces = P.filter(pc => pc.wiped === j);
        assert.ok(red && pieces.length && pieces.every(pc => pc.clip.every((v, k) => v === -red.clip[k])), 'R15 retained: wipe planes disagree');
        assert.ok(!P.some(pc => pc.where === 'floor' && pc.clock > 0), 'R15 retained: play before built');
        near(bounds([red])[5], 0, 'R15 retained: block bottom');
      }
      assert.ok(shape, 'R15 retained: missing block');
    }
  }
  return samples;
}

export async function checkLidAndSinks(M) {
  M ??= await load();
  let samples = 0; const endTimes = {};
  for (const key of ['id', 'pr', 'ae', 'fig']) {
    const { land, off } = M.playbackSpans(M.SCRIPTS[key]), floor = t => at(M, key, t).filter(pc => pc.where === 'floor');
    near(off[1] - off[0], 1, 'R8 sink length');
    if (key === 'ae') near(off[0] - land, 3.2, 'R9 two AE cycles');
    if (key === 'pr') near(off[0] - land, 3.2, 'R9 two Premiere cycles');
    if (key === 'fig') {
      near(off[0] - land, 3 + M.BALL.lid, 'R11 close before sink');
      const open = floor(land + 0.1), opened = open.find(pc => pc.lid), screen = open.find(pc => pc.art === 'chromeLaptop'), deckOpen = open.find(pc => pc.deviceBody && pc.device === 0);
      const hinge = quatRotate(opened.q, [-opened.s[0], -opened.s[1], opened.s[2]]).map((n, i) => n + opened.p[i]), db = bounds([deckOpen]);
      [db[0], db[4], db[1]].forEach((v, i) => near(hinge[i], v, 'R10 hinge on back top edge', 1e-6));
      near(screen.s[0] * 2, 1.47, 'R10 retained screen width'); near(screen.s[1] * 2, 0.91875, 'R10 retained screen height');
      const v = quatRotate(opened.q, [0, 1, 0]), offset = screen.p.map((n, i) => n - opened.p[i]);
      near(opened.s[1] - dot(v, offset) - screen.s[1], 0.04, 'R10 retained top bezel');
      for (const t of [off[0], action(M, key, 'export').start + M.ballBeats(key, 0).wiped - 1e-7]) {
        const P = floor(t), lid = P.find(pc => pc.lid), deck = P.find(pc => pc.deviceBody && pc.device === 0);
        const l = bounds([lid]), d = bounds([deck]);
        l.slice(0, 4).forEach((v, i) => near(v, d[i], 'R10 shut footprint', 0.001)); near(l[5], d[4], 'R10 lid gap', 1e-6);
        const block = floor(action(M, key, 'export').start + M.ballBeats(key, 0).hold - 0.001).find(pc => pc.part === 0);
        bounds([block]).slice(0, 5).forEach((v, i) => near(v, i === 4 ? l[4] : d[i], 'R10 red block equals shut laptop', 0.001));
        assert.ok(!P.some(pc => pc.device === 0 && !pc.lid && !pc.lidPicture && !pc.deviceBody && bounds([pc])[4] > d[4] + 1e-6), 'R10 keys/trackpad above deck');
        near(Math.abs(quatRotate(lid.q, [0, 1, 0])[1]), 0, 'R11 lid shut before sink', 1e-6);
      }
      for (const t of grid(land + 3, off[0])) {
        const P = floor(t), lid = P.find(pc => pc.lid), p = (t - land - 3) / M.BALL.lid, theta = 12 + (-90 - 12) * EASE.wipe(p);
        const v = quatRotate(lid.q, [0, 1, 0]); near(Math.atan2(-v[2], v[1]) * 180 / Math.PI, theta, 'R11 reverse opening', 1e-6);
        assert.ok(P.filter(pc => pc.device > 0).every(pc => Math.abs(pc.clock - 1) < 1e-9), 'R11 other devices hold final frame');
      }
    }
    const first = floor(off[0]), group = pc => {
      if (key !== 'id') return pc.device;
      if (pc.art === 'post') return 1; if (pc.art === 'mail') return 2;
      if (pc.art || pc.tone === 'paper') return 0;
      return Math.abs(pc.p[0] - M.BLOCK_ROW.phone[0] - M.BLOCK_ROW.phone[2] / 2) < 1e-6 ? 1 : 2;
    };
    const heights = [0, 1, 2].map(j => bounds(first.filter(pc => group(pc) === j))[4]), gone = [null, null, null];
    for (const t of [...grid(off[0], off[1]), off[1] - 1e-8]) {
      const P = floor(t), progress = EASE.wipe((t - off[0]) / (off[1] - off[0]));
      assert.equal(P.length, first.length, 'R11 sink: piece list changes');
      for (let i = 0; i < P.length; i++) {
        const pc = P[i], j = group(first[i]); near(pc.p[0], first[i].p[0], 'R11 sink x'); near(pc.p[2], first[i].p[2], 'R11 sink z');
        near(pc.p[1], first[i].p[1] - heights[j] * (1 + 0.02 / Math.max(...heights)) * progress, 'R11 own height sink ' + key + '/' + j + '/' + i + ' at ' + (t-off[0]), 1e-6);
        assert.deepEqual(pc.clip, [0, 1, 0, 0], 'R11 sink floor clip');
      }
      for (let j = 0; j < 3; j++) if (bounds(P.filter(pc => group(pc) === j))[4] <= 0 && gone[j] === null) gone[j] = t;
      if (key === 'ae') assert.ok(P.every(pc => Math.abs(pc.clock - 1) < 1e-9), 'R9 AE final frame held through sink'); samples++;
    }
    assert.ok(gone.every(t => t !== null), 'R11 sink: something remains above floor');
    endTimes[key] = gone.map(t => +(t - off[0]).toFixed(3));
    assert.ok(Math.max(...gone) - Math.min(...gone) <= 0.01 + 1e-8, `R11 sink finish: exports gone at ${endTimes[key]}`);
  }
  return { samples, endTimes };
}

export async function checkRound17(M) {
  M ??= await load();
  prepareRound17Art();
  const levels = await checkLevels(M), letters = await checkDrawsAndLetters(M), swaps = await checkSwaps(M), carries = await checkCarries(M), flight = await checkFlight(M), sinks = await checkLidAndSinks(M);
  const heights = await checkDocumentHeights(M), stable = await checkPlaybackStability(M), masks = checkLetterMasks();
  return `Round 17: G ${swaps.boundaries} action ends / ${swaps.comparisons} registrations, worst ${swaps.worst.toFixed(5)} px; R1 ${levels} levels samples; R2/R3 ${letters} draw/type samples; R4 ${carries.carries} carries / ${carries.samples} samples, flat worst ${carries.flat.worst.toFixed(5)} px; R6/R7 ${flight} flight samples; R8-R11 ${sinks.samples} sink samples (${JSON.stringify(sinks.endTimes)}).\nFollow-up: F1 ${heights.samples} height samples / ${heights.pages} pages / ${heights.layers} layers; F2 ${stable.samples} playback samples / ${stable.faces} fixed faces, worst ${stable.worst.toFixed(5)} px; F3 ${masks.pictures} masks / ${masks.texels} fixture texels / ${masks.covered} covered, exact finished RGB.`;
}

// Register round 17's changed surfaces with the earlier frozen-picture comparisons. These surfaces now have the explicit
// G/R1-R4 gates above; unchanged app furniture, footage, comp construction and clocks still compare with the frozen evidence.
export const round17Changed = M => pc => {
  if (onMapFrame(M)(pc)) return true;
  if (pc.overlay || pc.caret || pc.histogram !== undefined || pc.where === 'travel') return true;
  if (/^(histo(?:Dark)?|photoRaw|photoHalf|photoLevels|mapStreet|locBlocks|locStreets|locPins|kMap(?:Letters\d+)?|kLoc(?:Letters\d+|Close)?|kAm[LR]|kCover|kPost|eblast(?:Letters\d+)?|cover(?:Photo|Blob|Decor)|postPhoto|mailPhoto|mailButtonStyle|id(?:Cover|Post|Mail|Flyer)\d+)$/.test(pc.art || '')) return true;
  if (pc.document && !pc.art) {
    const [x, y] = pc.p, boards = ['board0', 'board1'].map(id => action(M, 'ai', id));
    return boards.some(a => x >= M.SCREEN.l + a.from[0] * 1.15 - 0.01 && x <= M.SCREEN.l + a.to[0] * 1.15 + 0.01 && y >= M.SCREEN.b + a.to[1] * 1.15 - 0.01 && y <= M.SCREEN.b + a.from[1] * 1.15 + 0.01);
  }
  return false;
};

// Register F2's painter/separation change in the frozen screen comparisons. All picture content, rectangles, script actions
// and furniture still come from the hashed fixture; the independent F2 probes/controls hold these new height rules.
export function round17ScreenReference(frozen) {
  const live = source();
  for (const name of ['screenPainter', 'separateFaces']) {
    const body = code => { const a = code.indexOf('function ' + name + '('), b = code.indexOf('\n}', a) + 2; assert.ok(a >= 0 && b > a, 'F2 reference: missing ' + name); return code.slice(a, b); };
    frozen = frozen.replace(body(frozen), body(live));
  }
  return frozen;
}

export const round17CarryReference = source => round17ScreenReference(source
  .replace('lift = dockStart ? 0.06 : 0.055', "lift = dockStart ? (key === 'loc' ? 0.053 : 0.06) : 0.055")
  .replace('const pc = on(tone, ...rect, { lift: 0.08, t: 0.015, art });', 'const pc = on(tone, ...rect, { lift: s === SCRIPTS.id ? 0.065 : 0.08, t: 0.015, art });')
  .replace('{ lift: 0.06, t: 0.012 }), where:', '{ lift: s === SCRIPTS.id ? 0.045 : 0.06, t: 0.012 }), where:')
  // N2 applies to both picture and rim: the frozen stage's legacy separator must not raise their authored flat planes.
  .replace('  separateFaces(P);\n  return P;', "  const travelPlanes = P.filter(pc => pc.where === 'travel').map(pc => [pc, pc.p.slice()]);\n  separateFaces(P);\n  for (const [pc, p] of travelPlanes) pc.p = p;\n  return P;"));

// Round 15's old pop/rest, shared-depth sink and exact old laptop pose are superseded by R6-R11. Keep its independent N1/N2
// and renderer clip checks, and run the replacement export gates on the actual emitted pieces.
export async function checkRound17Exports(M) {
  M ??= await load();
  await checkFlight(M); await checkLidAndSinks(M);
  const n1 = await checkMapFrame(M), n2 = await checkDragsFlat(M);
  return `Round 15 retained N1/N2: ${n1} map frames; ${n2.drags} flat drags / ${n2.samples} samples, worst ${n2.worst.toFixed(5)} px; ${checkRendererClips()}. Export physics/poses/sinks: round 17 gates.`;
}

export async function checkRound17RetainedControls() {
  const out = [];
  for (const [name, edit, run, gate] of [
    ['map outline restored', s => s.replace('// CORRECTIONS-15 N1: once placed,', "if (done(s, 'map', t)) D.push(...outline(...ID.frame));\n    // CORRECTIONS-15 N1: once placed,"), checkMapFrame, 'N1:'],
    ['drag arc restored', s => s.replace('lift: s === SCRIPTS.id ? 0.065 : 0.08, t: 0.015, art', 'lift: (s === SCRIPTS.id ? 0.065 : 0.08) + 0.08 * Math.sin(Math.PI * p), t: 0.015, art'), checkDragsFlat, 'N2:'],
    ['early play', s => s.replace('const clock = playClock(t, land, off[0], key), widths', 'const clock = playClock(t + 0.3, land, off[0], key), widths'), checkFlight, 'R15 retained: play before built'],
    ['unclipped sink', s => s.replace('pc.clip = [0, 1, 0, 0]; pc.sink = true;', 'pc.clip = undefined; pc.sink = true;'), checkLidAndSinks, 'R11 sink floor clip'],
    ['landing bounce', s => s.replace('c: s === T ? end : c, r,', 'c: s === T ? [end[0], end[1] + 0.1, end[2]] : c, r,'), checkFlight, 'R6 flight:'],
  ]) {
    let failed = false;
    try { await run(await load(edit)); } catch (error) { assert.ok(error.message.includes(gate), `${name}: wrong gate ${error.message}`); failed = true; }
    assert.ok(failed, `${name}: MISSED`); out.push(`${name}: caught`);
  }
  return out.join('; ');
}

export async function checkRound17Controls() {
  prepareRound17Art(); const out = [];
  const control = async (name, edit, gate, run) => {
    let caught = false;
    try { await run(await load(edit)); }
    catch (error) { assert.ok(error.message.includes(gate), `${name}: wrong gate: ${error.message}`); caught = true; }
    assert.ok(caught, `${name}: MISSED`); out.push(`${name}: failed at ${gate}`);
  };
  await control('done() photo choice', s => s.replace("pc.artMix = handed(s, white ? 'white' : 'black', t);", "pc.artMix = done(s, white ? 'white' : 'black', t) ? 1 : 0;"), 'R1 photo mix', checkLevels);
  await control('badge drawnFrame', s => s.replace("drawnRegion(D, AI.upper, 'kMap', [1273 / 2200, 457 / 850, 72 / 2200, 146 / 850], handed(s, 'badge', t))", "drawnFrame(D, inRect(AI.upper, [1273 / 2200, 457 / 850, 72 / 2200, 146 / 850]), handed(s, 'badge', t), 'grey')"), 'R2 draw:', checkDrawsAndLetters);
  await control('label lift 0.09', s => s.replace("{ lift: 0.084, t: 0.004, art: part.picture, cut: true }", "{ lift: 0.09, t: 0.004, art: part.picture, cut: true }").replace('work.labelSource = art;', 'work.labelSource = art; work.unregistered = true;').replace("if (pc.art && !pc.overlay && pc.art !== 'kLocClose') registerPicture", "if (pc.art && !pc.overlay && pc.art !== 'kLocClose' && !pc.unregistered) registerPicture"), 'R3 registration:', checkDrawsAndLetters);
  await control('travel action:key', s => {
    const a = s.indexOf('function travel('), b = s.indexOf('\n}', a) + 2, body = s.slice(a, b);
    assert.equal(body.split("where: 'travel', action: id").length - 1, 2, 'travel control: both travelling pieces');
    return s.slice(0, a) + body.replaceAll("where: 'travel', action: id", "where: 'travel', action: key") + s.slice(b);
  }, 'R4 tagging:', checkCarries);
  await control('approved document raised at swap', s => {
    const a = s.indexOf('function approvedDocument('), b = s.indexOf('\n}', a) + 2;
    return s.slice(0, a) + s.slice(a, b).replaceAll('lift: 0.06, t: 0.02', 'lift: 0.064, t: 0.02') + s.slice(b);
  }, 'G ', checkSwaps);
  await control('F1 old raised heights', s => {
    const a = s.indexOf('function approvedDocument('), b = s.indexOf('\n}', a) + 2;
    const body = s.slice(a, b).replaceAll("lift: 0.06, t: 0.02, art: 'kAm", "lift: 0.08, t: 0.004, art: 'kAm").replaceAll('lift: 0.06, t: 0.02', 'lift: 0.084, t: 0.004');
    return s.slice(0, a) + body + s.slice(b);
  }, 'F1 page face', checkDocumentHeights);
  await control('F2 shared floor stack', s => s.replace("const face = height = art?.startsWith('chrome') ? 0.09 + 8 * LAYER_STEP : height + LAYER_STEP;", 'const face = height = stacks.floor = Math.max(0.09, (stacks.floor ?? -Infinity) + LAYER_STEP);'), 'F2 stationary faces:', checkPlaybackStability);
  await control('F2 shared screen stack', s => s.replace('const face = height = Math.max(lift + thickness, height + LAYER_STEP);', 'const face = height = stacks.screen = Math.max(lift + thickness, (stacks.screen ?? -Infinity) + LAYER_STEP);'), 'F2 independent painter bases', checkPlaybackStability);
  await control('F2 one After Effects play', s => s.replace("ae: ballLength('ae') + 3.2 - 0.7", "ae: ballLength('ae') + 1.6 - 0.7").replace("key === 'fig' ? 3 + BALL.lid : 3.2", "key === 'fig' ? 3 + BALL.lid : key === 'ae' ? 1.6 : 3.2").replace('cycles = 2;', "cycles = key === 'ae' ? 1 : 2;"), 'F2 two plays:', checkPlaybackStability);
  const artURL = new URL('../art.mjs', import.meta.url), oldArt = fs.readFileSync(artURL, 'utf8');
  const badArt = oldArt.replace('letters[(y * w + x) * 4 + 3] > 0', 'letters[(y * w + x) * 4 + 3] >= 127.5');
  assert.notEqual(badArt, oldArt, 'F3 threshold control did not apply');
  let maskFailed = false;
  try { checkLetterMasks(await import('data:text/javascript;base64,' + Buffer.from(badArt).toString('base64'))); }
  catch (error) { assert.ok(error.message.includes('F3 mask coverage:'), 'F3 threshold: wrong gate ' + error.message); maskFailed = true; }
  assert.ok(maskFailed, 'F3 0.5 threshold: MISSED'); out.push('F3 0.5 threshold: failed at F3 mask coverage:');
  await control('ease between pop and arc', s => s.replace('s = clamp(u, 0, T);', 's = u < BALL.pop ? BALL.pop * EASE.wipe(clamp(u / BALL.pop, 0, 1)) : clamp(u, 0, T);'), 'R6 flight:', checkFlight);
  await control('rest 0.15', s => s.replace('rest: 0, split:', 'rest: 0.15, split:'), 'R7 immediate split', checkFlight);
  await control('lid lift 0.03', s => s.replace('const by = 12 - theta, lift = 0;', 'const by = 12 - theta, lift = 0.03 * Math.max(0, -Math.sin(theta * Math.PI / 180));'), 'R10 lid gap', checkLidAndSinks);
  await control('one shared sink depth', s => s.replace('const depth = heights[j] * clearance;', 'const depth = Math.max(...heights) * clearance;'), 'R11 own height sink', checkLidAndSinks);
  return out.join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (!process.argv.includes('--controls')) console.log(await checkRound17());
  else console.log(await checkRound17Controls());
}
