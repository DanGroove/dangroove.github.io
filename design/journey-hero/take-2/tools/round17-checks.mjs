import { checkPixelHelpers } from './round17-pixel-checks.mjs';
import { laptopClearance, layoutModel, widthsFor } from './round5-addendum-checks.mjs';
import { DEFAULT_FIT, sceneEnvelope } from '../view.mjs';
import { fitCalloutView } from '../labels.mjs';
import { createPageLayout } from '../page-layout.mjs';
import { BROWSER_SIZES } from './browser-check.mjs';
// CORRECTIONS-17. Geometry and source checks only: no browser, rasterisation, file mutation or dependencies.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { HOME, dot, quatRotate, EASE, makeCamera } from '../../../../public/journey/hero/engine.mjs';
import { corners } from '../kit.mjs';
import { createRenderer } from '../sq.mjs';
import { ART, ART_TEXT, HISTOGRAM, AM_MARKERS, AM_LABEL_BARS, CITY_BLOCKS, CITY_PINS, makeAtlas, letterMask, maskLetterPictures, CUTOUTS, CUTOUT_MARGIN, CUTOUT_GUTTER, drawPictureParts, paintGroupName } from '../art.mjs';
import { checkMapFrame, checkDragsFlat, checkRendererClips, onMapFrame } from './round15-checks.mjs';

const url = new URL('../stage.mjs', import.meta.url);
const source = () => fs.readFileSync(url, 'utf8');
// Probe private painters in memory, without adding a testing API or writing a mutant into the prototype.
const painterProbe = `
export function round17PainterProbe(count, overlap, floor) {
  stacks = { screenCount: 0, floorCount: 0 };
  const P = [], painter = floor ? floorPainter : screenPainter;
  const first = floor ? painter(P, [0, 0, 1, 1], 0.09) : painter(P, [0, 0, 1, 1]);
  for (let i = 0; i < count; i++) first('paper', [0, 0, 1, 1]);
  const second = floor ? painter(P, [overlap ? 0 : 2, 0, 1, 1], 0.09) : painter(P, [overlap ? 0 : 2, 0, 1, 1]);
  second('paper', [0, 0, 1, 1]);
  if (floor) for (const pc of P) pc.where = 'floor';
  separateFaces(P); return P;
}
export function round17RevealProbe(source, id, region, amount, upward) {
  const P=[]; isolatedDraw(P,[0,0,1,1],source,id,region,amount,upward); return P;
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
  return Math.min((1474 * 0.56 - 64) / DEFAULT_FIT.w, (996 - 160) / DEFAULT_FIT.h);
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
let preparedAtlas;
export function prepareRound17Art() {
  if (preparedAtlas) return preparedAtlas;
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
  try { const atlas = preparedAtlas = makeAtlas(); assert.equal(atlas.pages.length, 7, 'C3 atlas: seven pages with isolated marks'); return atlas; }
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
  for (const [id, source, mark, nominal] of [
    ['badge','kMap','badge',[1273/2200,457/850,72/2200,146/850]],
    ['block','kLoc','block0',[660/1352,16/850,62/1352,68/850]],
  ]) {
    const a = action(M, 'ai', id), part = CUTOUTS[source+'Part'+mark], size=ART[source];
    const isDraw = pc => pc.cutoutSource === source && pc.cutoutId === mark;
    const final = at(M,'ai',a.end-1e-7).find(isDraw);
    assert.ok(final, `R2 draw: missing ${id}'s isolated region`);
    for (const t of grid(a.start + 0.01, a.end)) {
      const P=at(M,'ai',t), pc=P.find(isDraw), p=M.HAND((t-a.start)/(a.end-a.start));
      assert.ok(pc && pc.blend && !pc.cut, `R2 draw: ${id} is an untextured box`);
      const opaque=P.filter(q=>q.document&&!q.art&&!q.overlay&&q.s[0]>0.002&&q.s[1]>0.002&&top(q)>top(pc)-0.001);
      assert.ok(!opaque.some(q=>distance(front(q),front(pc),S)<10),'R2 draw: untextured opaque piece over map');
      assert.ok(distance(fullCorners(pc),fullCorners(final),S)<=0.1,`R2 draw: ${id} not registered`);
      const [u,v,w,h]=nominal,[l,y,r,b]=part.crop;
      const expected=[l/(size.w-1),y/(size.h-1),(r-1)/(size.w-1),(b-1)/(size.h-1)];
      pc.labelRegion.forEach((n,i)=>near(n,expected[i],'R2 isolated margin quad'));
      assert.ok(pc.artReveal,'R2 growing paint clip');
      [u,v,u+w*p,v+h*p].forEach((n,i)=>near(pc.artReveal[i],n,'R2 growing paint clip')); samples++;
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
    const fixed = P => P.filter(pc => pc.where === 'floor' && (pc.deviceBody || pc.lid || pc.art?.startsWith('chrome') || !pc.lidPicture && (/^paper(?:Tile|Tablet|Phone|Sq)$/.test(pc.art || '') || !pc.window && /^shot[A-C]/.test(pc.art || ''))));
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

export function checkLetterMasks(A = { letterMask, maskLetterPictures, CUTOUTS, CUTOUT_MARGIN, CUTOUT_GUTTER, drawPictureParts, paintGroupName }) {
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
  return /^(mapStreet|kMap)$/.test(art) ? 'map' : /^(locGround|locStreets|kLoc)$/.test(art) ? 'loc' : /^(coverPhoto|coverBlob|coverDecor|kCover)$/.test(art) ? 'cover' : /^(postPhoto|kPost)$/.test(art) ? 'post' : /^(mailPhoto|eblast)$/.test(art) ? 'mail' : art;
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

export async function checkLidAndSinks(M, behaviourOnly = false) {
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
      near(screen.s[0] * 2, 2.058, 'R10 retained screen width'); near(screen.s[1] * 2, 1.28625, 'R10 retained screen height');
      const v = quatRotate(opened.q, [0, 1, 0]), offset = screen.p.map((n, i) => n - opened.p[i]);
      near(opened.s[1] - dot(v, offset) - screen.s[1], 0.056, 'R10 retained top bezel');
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
    const first = floor(off[0]), group = pc => key !== 'id' ? pc.device : pc.device !== undefined ? pc.device + 2 : pc.p[2] > M.BLOCK_ROW.stack[1] + M.BLOCK_ROW.stack[3] ? pc.p[0] < -0.1 ? 1 : 2 : 0;
    const count = key === 'id' ? 5 : 3, groups = Array.from({length: count}, (_, j) => first.filter(pc => group(pc) === j));
    const bodies = groups.map(pieces => { const own = pieces.filter(pc => pc.deviceBody || pc.lid); return own.length ? own : pieces; });
    if(key==='id') {
      const left=bounds(groups[1]),right=bounds(groups[2]);
      near(left[4],.04,'C4 left height');near(right[4],.01,'C4 right height');
      near(left[2],-.1,'C4 left spine');near(right[0],-.1,'C4 right spine');
      assert.ok(groups[1].every(p=>bounds([p])[2]<=-.1+1e-9)&&groups[2].every(p=>bounds([p])[0]>=-.1-1e-9),'C4 piece spans both halves');
    }
    const heights = bodies.map(pieces => bounds(pieces)[4]), gone = Array(count).fill(null), last = Array(count).fill(null);
    for (const t of [...grid(off[0], off[1]), off[1] - 1e-8]) {
      const P = floor(t), progress = EASE.wipe((t - off[0]) / (off[1] - off[0]));
      assert.equal(P.length, first.length, 'R11 sink: piece list changes');
      if (!behaviourOnly) for (let i = 0; i < P.length; i++) {
        const pc = P[i], j = group(first[i]); near(pc.p[0], first[i].p[0], 'R11 sink x'); near(pc.p[2], first[i].p[2], 'R11 sink z');
        near(pc.p[1], first[i].p[1] - heights[j] * (1 + 0.02 / Math.max(...heights)) * progress, 'R11 own height sink ' + key + '/' + j + '/' + i + ' at ' + (t-off[0]), 1e-6);
        assert.deepEqual(pc.clip, [0, 1, 0, 0], 'R11 sink floor clip');
        const bodyTop = bounds(P.filter(q => group(q) === j && bodies[j].some(b => first.indexOf(b) === P.indexOf(q))))[4];
        near(pc.sinkTop, bodyTop, 'C2 body cull top', 1e-9);
        if (!bodies[j].includes(first[i])) {
          const offset = Math.max(0, bounds([first[i]])[4] - heights[j]);
          assert.deepEqual(pc.carryClip?.slice(0,3), [0,1,0], 'C2 carried clip: missing plane');
          near(pc.carryClip[3], -offset, 'C2 carried clip: rest height', 1e-9);
          assert.ok(bounds([pc])[4] + pc.carryClip[3] <= bodyTop + 1e-9, 'C2 carried clip: sliver after body');
        }
      }
      for (let j = 0; j < count; j++) {
        const visible = P.filter(pc => group(pc) === j && bounds([pc])[4] + (pc.carryClip?.[3] || 0) >= -1e-12 && pc.sinkTop >= -1e-12);
        const bodyVisible = bodies[j].some(pc => bounds([P[first.indexOf(pc)]])[4] >= -1e-12);
        assert.ok(bodyVisible || !visible.length, 'C2 carried lifetime: drawn after body');
        if (visible.length) last[j] = t; else if (gone[j] === null) gone[j] = t;
        if (t >= off[1] - 1e-7) assert.ok(P.filter(pc => group(pc) === j).every(pc => bounds([pc])[4] + (pc.carryClip?.[3] || 0) <= 0), 'C2 end: piece above its floor clip');
      }
      if (key === 'ae') assert.ok(P.every(pc => Math.abs(pc.clock - 1) < 1e-9), 'R9 AE final frame held through sink'); samples++;
    }
    assert.ok(gone.every(t => t !== null), 'R11 sink: something remains above floor');
    endTimes[key] = gone.map(t => +(t - off[0]).toFixed(3));
    assert.ok(Math.max(...gone) - Math.min(...gone) <= 0.01 + 1e-8, `R11 sink finish: exports gone at ${endTimes[key]}`);
    assert.ok(last.every(t => t !== null) && Math.max(...last) - Math.min(...last) <= 0.01 + 1e-8, 'C2 last drawn samples: objects disagree');
  }
  return { samples, endTimes };
}

// R12 uses the actual picture windows, conservative opaque canvas rectangles and emitted model geometry.
// Every art (including the correctly proportioned ground tiles, cropped chrome and captions) is measured.
const subtract = (a, b) => {
  const x = Math.max(a[0], b[0]), y = Math.max(a[1], b[1]), r = Math.min(a[2], b[2]), d = Math.min(a[3], b[3]);
  if (r <= x || d <= y) return [a];
  return [[a[0],a[1],a[2],y],[a[0],d,a[2],a[3]],[a[0],y,x,d],[r,y,a[2],d]].filter(q => q[2] > q[0] && q[3] > q[1]);
};
const artOpaque = new Map();
function opaqueRects(key) {
  if (artOpaque.has(key)) return artOpaque.get(key);
  const a = ART[key]; let rectangles = [], matrix = [1,1,0,0]; const stack = [];
  const ctx = new Proxy({
    getTransform() { return {a:matrix[0],b:0,c:0,d:matrix[1],e:matrix[2],f:matrix[3]}; },
    save() { stack.push(matrix.slice()); }, restore() { matrix = stack.pop(); },
    translate(x,y) { matrix[2] += x * matrix[0]; matrix[3] += y * matrix[1]; }, scale(x,y) { matrix[0] *= x; matrix[1] *= y; },
    fillRect(x,y,w,h) { if (String(this.fillStyle).startsWith('rgba')) return; rectangles.push([x*matrix[0]+matrix[2],y*matrix[1]+matrix[3],(x+w)*matrix[0]+matrix[2],(y+h)*matrix[1]+matrix[3]]); },
    clearRect(x,y,w,h) { const cut = [x,y,x+w,y+h]; rectangles = rectangles.flatMap(r => subtract(r,cut)); },
    measureText: s => ({width:s.length*10}), createLinearGradient: () => ({addColorStop(){}}),
  }, {get:(o,k)=>k in o ? o[k] : ()=>{}});
  a.draw(ctx,a.w,a.h);
  const result = rectangles.map(r => r.map((n,i)=>n/(i%2?a.h:a.w)));
  artOpaque.set(key,result); return result;
}
export function checkPhoneArt(code = fs.readFileSync(new URL('../art.mjs',import.meta.url),'utf8')) {
  assert.ok(!/\bisland\s*\(/.test(code), 'R12 one island: baked phone pill');
  const handset = code.slice(code.indexOf('  chromeHandset:'), code.indexOf('\n',code.indexOf('  chromeHandset:')));
  assert.ok(!/fill\(c, C\.ink/.test(handset), 'R12 one island: handset notch');
}
export async function checkDeviceModels(M) {
  M ??= await load(); prepareRound17Art(); checkPhoneArt();
  let samples=0, pictures=0, worstAspect=0;
  const expected = {tablet:{w:1.65*179.5/248.6,d:1.65,t:0.04,e:[0.35,0.1]},phone:{w:1.65*77.6/248.6,d:1.65*163/248.6,t:0.05,e:[0.35,0.16]}};
  for (const key of ['id','pr','ae','fig']) {
    const {land,off}=M.playbackSpans(M.SCRIPTS[key]);
    // Include wipe poses, all plays/restarts, close and sink. Coverage is checked before the floor starts clipping.
    for (const t of [...grid(action(M,key,'export').start,off[1]), land+1.599,land+1.601].filter(t=>t<off[1])) {
      const P=at(M,key,t), bodies=P.filter(pc=>pc.where==='floor'&&pc.model&&pc.deviceBody);
      const slabs=P.filter(pc=>pc.where==='floor'&&pc.deviceBody&&!(key==='fig'&&pc.device===0));
      assert.equal(bodies.length,slabs.length,'R12 identical models: unmodelled device');
      if(t>=land) assert.equal(bodies.length,key==='pr'||key==='ae'?3:2,'R12 identical models: missing device');
      for (const body of bodies) {
        const m=expected[body.model], b=bounds([body]), landscape=body.model==='tablet'&&['pr','ae'].includes(key), w=landscape?m.d:m.w,d=landscape?m.w:m.d;
        near(2*body.s[0],w,'R12 identical models: width'); near(2*body.s[1],d,'R12 identical models: depth'); near(2*body.s[2],m.t,'R12 identical models: thickness');
        assert.deepEqual(body.e,m.e,'R12 identical models: corners'); assert.deepEqual(body.tones,['#ABA59E','#121111','#4A4541'],'R12 identical models: tones');
        const rim=(m.w-m.d*(body.model==='phone'?9/19.5:1640/2360))/(2*(1-(body.model==='phone'?9/19.5:1640/2360)));
        const own=P.filter(pc=>pc.where==='floor'&&pc.device===body.device), arts=own.filter(pc=>pc.art);
        const screen=[b[0]+rim,b[1]+rim,b[2]-rim,b[3]-rim];
        [screen[0],screen[1],w-2*rim,d-2*rim].forEach((v,i)=>near(body.screenRect[i],v,'R12 identical models: rim'));
        if (body.model==='phone') {
          const island=own.filter(pc=>pc.island!==undefined), ib=bounds(island), iw=(m.w-2*rim)*88/300, id=(m.d-2*rim)*24/650;
          assert.equal(island.length,3,'R12 one island: capsule parts');
          near(ib[2]-ib[0],iw,'R12 one island: width'); near(ib[3]-ib[1],id,'R12 one island: depth'); near((ib[0]+ib[2])/2,(b[0]+b[2])/2,'R12 one island: centre');
          near(ib[1]-screen[1],(m.d-2*rim)*12/650,'R12 one island: top inset'); near(ib[4]-b[4],0.002+16*0.0008,'R12 one island: fixed height',1e-8);
          assert.ok(island.every(pc=>pc.tones.every(t=>t==='#121111')),'R12 one island: glass tone');
          assert.ok(arts.every(pc=>bounds([pc])[4]<ib[5]),`R12 one island: below picture layer ${key}/${t} ${JSON.stringify(arts.map(pc=>[pc.art,bounds([pc])[4]]))} island ${ib[5]}`);
        } else {
          const camera=own.filter(pc=>pc.camera); assert.equal(camera.length,1,'R12 identical models: one camera'); const c=camera[0];
          near(c.p[1]-b[4],0.0002,'R12 identical models: camera face'); near(2*c.s[0],0.018,'R12 identical models: camera size'); assert.deepEqual(c.tones,['#3C4A56','#26313A','#141A20'],'R12 identical models: lens');
          near(c.p[0],landscape?(b[0]+b[2])/2:b[2]-rim/2,'R12 identical models: camera x'); near(c.p[2],landscape?b[1]+rim/2:(b[1]+b[3])/2,'R12 identical models: camera z');
        }
        if (t>=off[0]) continue;
        const first=Math.min(...arts.filter(pc=>!pc.cut).map(pc=>bounds([pc])[5]));
        near(first,b[4],'R12 no gap: first picture underside on own glass',1e-9);
        let uncovered=[screen], aspectErrors=[];
        for (const pc of arts) {
          const a=ART[pc.art], uv=pc.window||[0,0,1,1], r=bounds([pc]);
          {
            const ratio=pc.s[0]/pc.s[1]/((a.w*(uv[2]-uv[0]))/(a.h*(uv[3]-uv[1]))), error=Math.abs(ratio-1);
            worstAspect=Math.max(worstAspect,error); if(error>0.005) aspectErrors.push(`R12 picture aspect: ${key}/${pc.art} ${(error*100).toFixed(4)}%`);
          }
          for (const op of opaqueRects(pc.art)) {
            const clip=[Math.max(op[0],uv[0]),Math.max(op[1],uv[1]),Math.min(op[2],uv[2]),Math.min(op[3],uv[3])];
            if (clip[2]<=clip[0]||clip[3]<=clip[1]) continue;
            const filled=clip.map((n,i)=>r[i%2]+(n-uv[i%2])/(uv[i%2+2]-uv[i%2])*(r[i%2+2]-r[i%2]));
            uncovered=uncovered.flatMap(q=>subtract(q,filled));
          }
          pictures++;
        }
        assert.ok(uncovered.every(r=>r[2]-r[0]<=0.001||r[3]-r[1]<=0.001),`R12 screen filled: ${key}/${body.device} gaps ${JSON.stringify(uncovered)}`);
        assert.equal(aspectErrors.length,0,aspectErrors.join('; '));
        samples++;
      }
    }
  }
  // Laptop pictures use a tilted local basis; UV-relative aspect is independent of its pose.
  const {land,off}=M.playbackSpans(M.SCRIPTS.fig);
  for(const t of grid(land,off[0])) for(const pc of at(M,'fig',t).filter(pc=>pc.lidPicture&&pc.art)) {
    const a=ART[pc.art],uv=pc.window||[0,0,1,1],error=Math.abs(pc.s[0]/pc.s[1]/(a.w/a.h*(uv[2]-uv[0])/(uv[3]-uv[1]))-1);
    assert.ok(error<=0.005,`R12 picture aspect: laptop/${pc.art}`);worstAspect=Math.max(worstAspect,error);pictures++;
  }
  const open=at(M,'fig',land+0.1), lid=open.find(pc=>pc.lid), deck=open.find(pc=>pc.device===0&&pc.deviceBody);
  const laptopTones=['#86807A','#3E3A37','#252220'];
  assert.deepEqual(lid.tones,laptopTones,'R12 laptop scale: lid metal'); assert.deepEqual(deck.tones,laptopTones,'R12 laptop scale: deck metal');
  const first=open.find(pc=>pc.lidPicture), normal=quatRotate(lid.q,[0,0,1]);
  near(dot(normal,first.p.map((n,i)=>n-lid.p[i]))+first.s[2],lid.s[2],'R12 no gap: laptop glass',1e-9);
  const well=open.find(pc=>pc.device===0&&pc.tones?.[1]==='#121111'), track=open.find(pc=>pc.device===0&&pc.tones?.[1]==='#4A4643'), keys=open.filter(pc=>pc.device===0&&pc.tones?.[1]==='#1B1918');
  near(2*well.s[0],1.42*1.4,'R12 laptop scale: keyboard well');near(2*track.s[0],0.55*1.4,'R12 laptop scale: trackpad');assert.equal(keys.length,45,'R12 laptop scale: keys');near(2*keys[0].s[0],0.115*1.4,'R12 laptop scale: key width');near(2*deck.s[2],0.08,'R12 laptop scale: deck thickness');
  near(M.UI_ROW.lidW,2.17,'R12 laptop scale: width'); near(M.UI_ROW.lidH,1.54,'R12 laptop scale: lid'); near(M.UI_ROW.deck,1.54,'R12 laptop scale: deck'); near(M.UI_ROW.bezel,0.056,'R12 laptop scale: bezel');
  near(M.FIG.designs[1][2]/M.FIG.designs[1][3],1640/2360,'R12 tablet canvas aspect');
  near(M.LOOP,99.49089474781469,'R12 unchanged loop');
  return {samples,pictures,worstAspect};
}

// Independent contact and clearance gates: the old coplanar top must fail both, not merely an island assertion.
export async function checkDeviceGlass(M, clearanceOnly = false) {
  M ??= await load(); let samples = 0, highestPhoneLayer = 0;
  for (const key of ['id','pr','ae','fig']) {
    const {off} = M.playbackSpans(M.SCRIPTS[key]);
    for (const t of grid(action(M,key,'export').start,off[0])) {
      const P = at(M,key,t).filter(pc => pc.where === 'floor');
      for (const body of P.filter(pc => pc.deviceBody && pc.model)) {
        const arts = P.filter(pc => pc.device === body.device && pc.art), glass = bounds([body])[4];
        const lowest = arts.filter(pc => !pc.cut).sort((a,b) => bounds([a])[4] - bounds([b])[4])[0];
        assert.ok(lowest,'C1 glass: missing first layer');
        if (clearanceOnly) assert.ok(bounds([lowest])[4] >= glass + 0.0008 - 1e-9, 'C1 glass clearance: coplanar picture top');
        else near(bounds([lowest])[5], glass, 'C1 glass underside: gap or penetration', 1e-9);
        if (body.model === 'phone') for (const pc of arts) highestPhoneLayer = Math.max(highestPhoneLayer,bounds([pc])[4]);
        samples++;
      }
    }
  }
  return {samples,highestPhoneLayer};
}

// A command recorder, not a rasterizer. It preserves path/state/transform/clip identities and paint order.
export function recordPicture(source, accept = null, offset = [0,0]) {
  const paints=[], saved=[]; let matrix=[1,0,0,1,...offset], path=[], clips=[];
  const defaults={fillStyle:'#000000',strokeStyle:'#000000',lineWidth:1,font:'10px sans-serif',letterSpacing:'0px',textAlign:'left',textBaseline:'alphabetic',globalAlpha:1,globalCompositeOperation:'source-over',lineCap:'butt',lineJoin:'miter',shadowBlur:0,shadowOffsetX:0,shadowOffsetY:0,shadowColor:'rgba(0,0,0,0)'};
  const point=(x,y)=>[matrix[0]*x+matrix[2]*y+matrix[4],matrix[1]*x+matrix[3]*y+matrix[5]];
  const ctx={...defaults,
    getTransform:()=>Object.fromEntries(['a','b','c','d','e','f'].map((k,i)=>[k,matrix[i]])),
    save(){saved.push({matrix:[...matrix],clips:[...clips],state:Object.fromEntries(Object.keys(defaults).map(k=>[k,this[k]]))});},
    restore(){const s=saved.pop();matrix=s.matrix;clips=s.clips;Object.assign(this,s.state);},
    translate(x,y){matrix[4]+=matrix[0]*x+matrix[2]*y;matrix[5]+=matrix[1]*x+matrix[3]*y;},
    scale(x,y){matrix[0]*=x;matrix[1]*=x;matrix[2]*=y;matrix[3]*=y;},
    rotate(a){const [x,y,z,w]=matrix,c=Math.cos(a),s=Math.sin(a);matrix[0]=x*c+z*s;matrix[1]=y*c+w*s;matrix[2]=-x*s+z*c;matrix[3]=-y*s+w*c;},
    measureText(s){const px=+(this.font.match(/([\d.]+)px/)?.[1]||10);return {width:s.length*px*0.55,actualBoundingBoxAscent:px*0.8,actualBoundingBoxDescent:px*0.2};},
    setLineDash(){},
    createLinearGradient(...args){return {args,stops:[],addColorStop(...stop){this.stops.push(stop);}};},
    beginPath(){path=[];},closePath(){path.push(['close']);},clip(){clips.push([...path]);},
  };
  for(const method of ['moveTo','lineTo','rect','roundRect','bezierCurveTo','quadraticCurveTo','arc','arcTo','ellipse']) ctx[method]=(...args)=>path.push([method,...args]);
  let ordinal=0;
  for(const method of ['fill','stroke','fillRect','strokeRect','fillText','strokeText','drawImage','clearRect','putImageData']) ctx[method]=(...args)=>{
    const group=paintGroupName(), n=ordinal++;
    const state=Object.fromEntries(Object.keys(defaults).map(k=>[k,ctx[k]]));
    const relevant=['globalAlpha','globalCompositeOperation','shadowBlur','shadowOffsetX','shadowOffsetY','shadowColor',method.startsWith('stroke')?'strokeStyle':'fillStyle'];
    if(method.startsWith('stroke'))relevant.push('lineWidth','lineCap','lineJoin');
    if(method.endsWith('Text'))relevant.push('font','letterSpacing','textAlign','textBaseline');
    const semantic=Object.fromEntries(relevant.map(k=>[k,state[k]]));
    paints.push({group,n,mode:ctx.globalCompositeOperation,clips:[...clips],key:JSON.stringify([method,args,method==='fill'||method==='stroke'?path:null,matrix,semantic,clips]),method,args,state,path:[...path],matrix:[...matrix]});
  };
  const previous=globalThis.Path2D;globalThis.Path2D=class {constructor(d){this.path=d;}};
  try {if(accept)drawPictureParts(ctx,source,accept);else ART[source].draw(ctx,ART[source].w,ART[source].h);}
  finally {if(previous===undefined)delete globalThis.Path2D;else globalThis.Path2D=previous;}
  return paints;
}

export async function checkCutouts(M) {
  M ??= await load();prepareRound17Art();
  const inventory={kMap:98,kLoc:44,kCover:1,kPost:1,eblast:2,wireWide:24,wireTablet:20,wireTall:20}, rows=[];
  for(const [source,count] of Object.entries(inventory)) {
    const full=recordPicture(source), parts=Object.entries(CUTOUTS).filter(([,p])=>p.source===source);
    assert.equal(parts.length,count,'C3 exactness: cutout inventory '+source);
    const assigned=new Map();let commands=0;
    assert.ok(full.every(p=>p.mode==='source-over'),'C3 exactness: source composite mode');
    for(const [key,part] of parts) {
      assert.ok(part.margin>=24&&part.gutter>=24,'C3 atlas: margin/gutter');
      const own=full.filter(p=>part.accept(p.group,p.method,p.n));
      assert.ok(own.length,'C3 exactness: empty mark '+key);
      const replay=recordPicture(key,null,[part.crop[0],part.crop[1]]);
      assert.deepEqual(replay.map(p=>p.key),own.map(p=>p.key),'C3 exactness: replay differs '+key);
      for(const p of own) {assert.ok(!assigned.has(p.n),'C3 exactness: repeated command '+source+'/'+p.n);assigned.set(p.n,key);assert.equal(p.mode,'source-over','C3 exactness: composite mode');commands++;}
      assert.ok(!own.some(p=>p.clips.length>1),'C3 exactness: shared internal clip');
      const [x,y,w,h]=part.rect,[l,t,r,b]=part.crop,a=ART[source];
      assert.ok((l===0||x-l>=24-1e-9)&&(t===0||y-t>=24-1e-9)&&(r===a.w||r-x-w>=24-1e-9)&&(b===a.h||b-y-h>=24-1e-9),'C3 atlas: transparent margin '+key);
    }
    const ordered=parts.slice().sort((a,b)=>a[1].order-b[1].order).flatMap(([,part])=>full.filter(p=>part.accept(p.group,p.method,p.n)).map(p=>p.n));
    assert.deepEqual(ordered,full.filter(p=>assigned.has(p.n)).map(p=>p.n),'C3 exactness: finished paint order '+source);
    const base=recordPicture(source,(g,k,n)=>!assigned.has(n));
    const sameCommands=(a,b,gate)=>assert.deepEqual(a.map(p=>p.key),b.map(p=>p.key),gate);
    if(['kMap','kLoc','wireWide','wireTablet','wireTall','eblast'].includes(source)) {
      const name={kMap:'mapStreet',kLoc:'locGround',eblast:'mailPhoto'}[source]||source+'Base';
      sameCommands(recordPicture(name),full.filter(p=>!assigned.has(p.n)&&!p.method.endsWith('Text')),'C3 exactness: actual base '+source);
    }
    if(source==='kCover')sameCommands(recordPicture('coverBlob'),[...recordPicture('coverPhoto'),...recordPicture('kCoverPartblob',null,CUTOUTS.kCoverPartblob.crop.slice(0,2))],'C3 exactness: actual cover base/blob');
    if(source==='kPost') {
      const actual=recordPicture('postPhoto'),remaining=new Map();for(const p of base)remaining.set(p.key,(remaining.get(p.key)||0)+1);
      for(const p of actual){const n=remaining.get(p.key)||0;assert.ok(n,'C3 exactness: actual post base');remaining.set(p.key,n-1);}
      const prefix=recordPicture('idPost21',null,[276,315.2]);
      for(const p of base.filter(p=>!p.method.endsWith('Text')))assert.ok(actual.some(q=>q.key===p.key)||prefix.some(q=>q.key===p.key),'C3 exactness: post tab prefix');
    }
    const composed=[...base,...parts.flatMap(([key])=>recordPicture(key,null,CUTOUTS[key].crop.slice(0,2)))];
    const multiset=xs=>xs.map(p=>p.key).sort();
    assert.deepEqual(multiset(composed),multiset(full),'C3 exactness: missing/repeated source paint '+source);
    const paintBounds=p=>{
      const pts=[],rect=(x,y,w,h)=>pts.push([x,y],[x+w,y],[x,y+h],[x+w,y+h]);
      if(p.method==='fillRect'||p.method==='strokeRect')rect(...p.args);
      else if(p.method.endsWith('Text')) {const px=+(p.state.font.match(/([\d.]+)px/)?.[1]||10),[words,x,y]=p.args,w=words.length*px*.55;rect(x-(p.state.textAlign==='center'?w/2:p.state.textAlign==='right'?w:0),y-px*.8,w,px);}
      else for(const [kind,...args] of p.path) {if(kind==='rect'||kind==='roundRect')rect(...args);else if(kind==='arc')rect(args[0]-args[2],args[1]-args[2],2*args[2],2*args[2]);else for(let i=0;i+1<args.length;i+=2)if(typeof args[i]==='number'&&typeof args[i+1]==='number')pts.push([args[i],args[i+1]]);}
      assert.ok(pts.length,'C3 exactness: unmeasured base command '+source+'/'+p.n);
      const m=p.matrix,world=pts.map(([x,y])=>[m[0]*x+m[2]*y+m[4],m[1]*x+m[3]*y+m[5]]),radius=p.method.startsWith('stroke')?p.state.lineWidth*Math.max(Math.hypot(m[0],m[1]),Math.hypot(m[2],m[3]))/2:0;
      return [Math.min(...world.map(p=>p[0]))-radius,Math.min(...world.map(p=>p[1]))-radius,Math.max(...world.map(p=>p[0]))+radius,Math.max(...world.map(p=>p[1]))+radius];
    };
    let letterCommands=0;
    if(ART_TEXT[source])for(const p of full.filter(p=>!assigned.has(p.n)&&p.method==='fillText')) {
      const matches=ART_TEXT[source].filter(part=>part.words===p.args[0]).map(part=>recordPicture(part.picture,null,part.crop.slice(0,2))).flat();
      assert.ok(matches.some(q=>q.key===p.key),'C3 exactness: missing original typed command '+source+'/'+p.n);letterCommands++;
    }
    let lateBaseCommands=0;
    for(const p of full.filter(p=>!assigned.has(p.n)&&!(ART_TEXT[source]&&p.method.endsWith('Text')))) for(const [key,part] of parts) {
      if(!full.some(q=>assigned.get(q.n)===key&&q.n<p.n))continue;
      lateBaseCommands++;const r=paintBounds(p),[x,y,w,h]=part.rect;
      assert.ok(!(Math.min(r[2],x+w)>Math.max(r[0],x)+1e-9&&Math.min(r[3],y+h)>Math.max(r[1],y)+1e-9),'C3 exactness: overlapping late base paint '+source+'/'+p.n+'/'+key);
    }
    rows.push({source,cutouts:count,commands,baseCommands:base.length-letterCommands,letterCommands,lateBaseComparisons:lateBaseCommands});
  }
  const probe=M.round17RevealProbe?M:await load();
  for(const [i,[x,y,w,h]] of AM_LABEL_BARS.entries())for(const amount of [.125,.5,.875,1]) {
    const pc=probe.round17RevealProbe('kMap','bar'+i,[x/2200,y/850,w/2200,h/850],amount,true)[0];
    assert.ok(pc.blend&&!pc.cut,'C3 bar blended reveal');
    if(amount===1)assert.equal(pc.artReveal,undefined,'C3 full bar uses isolated static picture');
    else [x/2200,(y+h*(1-amount))/850,(x+w)/2200,(y+h)/850].forEach((n,j)=>near(pc.artReveal[j],n,'C3 eight-step upward paint clip'));
  }
  const atlas=prepareRound17Art(), pixelRect=key=>{const [page,u,v,w,h]=atlas.places[key],canvas=atlas.pages[page];return [page,Math.round(u*canvas.width-.5),Math.round(v*canvas.height-.5),Math.round(w*canvas.width+1),Math.round(h*canvas.height+1)];};
  for(const [key,p] of Object.entries(CUTOUTS)) {
    const [page,x,y,w,h]=pixelRect(key),canvas=atlas.pages[page];
    assert.ok(x>=24&&y>=24&&canvas.width-x-w>=24&&canvas.height-y-h>=24,'C3 atlas: page gutter '+key);
    for(const other of Object.keys(atlas.places))if(other!==key) {const [q,l,t,r,b]=pixelRect(other);if(q!==page)continue;assert.ok(Math.max(l-x-w,x-l-r,t-y-h,y-t-b)>=24,'C3 atlas: neighbour gutter '+key+'/'+other);}
    const [,sx,sy]=pixelRect(p.source);near(((x-p.crop[0]-sx)%8+8)%8,0,'C3 atlas: mip x phase');near(((y-p.crop[1]-sy)%8+8)%8,0,'C3 atlas: mip y phase');
  }
  const releases=[['ai','badge','kMap'],['ai','cityLabels','kLoc'],['id','blob','kCover','coverBlob'],['id','postButton','kPost'],['id','mailFlyer','eblast'],...['wireWide','wireTablet','wireTall'].map(a=>['fig','details',a])];
  for(const [scene,id,source,finished=source] of releases) {
    const end=action(M,scene,id).end;
    const before=at(M,scene,end-1e-7),after=at(M,scene,end+1e-9);
    const emitted=new Set(before.filter(pc=>pc.cutoutSource===source).map(pc=>pc.art));
    const baseKeys={kMap:['mapStreet'],kLoc:['locGround'],kCover:['coverPhoto'],kPost:['postPhoto'],eblast:['mailPhoto'],wireWide:['wireWideBase'],wireTablet:['wireTabletBase'],wireTall:['wireTallBase']}[source];
    const base=before.find(pc=>baseKeys.includes(pc.art));assert.ok(base,'C3 depth: missing base '+source);
    for(const pc of before.filter(pc=>pc.cutoutSource===source)) {
      near(top(pc)-top(base),.0004*1.15,'C3 depth: blend must be above emitted base',1e-9);
      assert.ok(pc.blend&&!pc.cut&&pc.noShadow&&pc.noLine,'C3 depth: blended face contract');
    }
    for(const pc of before.filter(pc=>pc.labelSource===source))near(top(pc)-top(base),.0008*1.15,'C3 depth: letter must be above blend',1e-9);
    for(const [key,p] of Object.entries(CUTOUTS).filter(([,p])=>p.source===source)) assert.ok(emitted.has(key),'C3 exactness: missing emitted mark '+key);
    for(const dt of [0,1e-9,0.001,0.02]) assert.ok(!at(M,scene,end+dt).some(pc=>pc.cutoutSource===source),'C3 release: cutout after release '+source);
    assert.ok(after.some(pc=>pc.art===finished&&(!pc.window||pc.window.every((n,i)=>n===[0,0,1,1][i]))&&!pc.labelSource),'C3 release: finished picture missing '+source);
    assert.ok(!after.some(pc=>pc.labelSource===source),'C3 release: retained typed companion '+source);
  }
  return {pictures:rows,atlas:atlas.pages.map(p=>[p.width,p.height]),exceptions:{missing:0,repeated:0,compositeModes:0,sharedInternalClips:0}};
}
export const checkCropFringes = checkCutouts;

// Execute the renderer in a recording WebGL2 context; state, order and lifetime are observable without a GPU.
function rendererTrace(code = null) {
  let next=0,program,depthWrite=true,depthTest=false,blend=false,offset=false,factor=0,units=0;const calls=[],uniforms=new Map();
  const names=['uArtMode','uClip','uCarryClip','uPos'];
  const gl=new Proxy({}, {get:(_,key)=>{
    if(/^[A-Z_0-9]+$/.test(key))return key;
    if(key==='createProgram')return ()=>++next;
    if(key==='getProgramParameter')return (_,p)=>p==='ACTIVE_UNIFORMS'?names.length:true;
    if(key==='getShaderParameter')return ()=>true;
    if(key==='getActiveUniform')return (_,i)=>({name:names[i]});
    if(key==='getUniformLocation')return (_,name)=>({name});
    if(key==='useProgram')return p=>{program=p;};
    if(key==='uniform1f'||key==='uniform3fv'||key==='uniform4fv')return (u,p)=>{if(u)uniforms.set(u.name,Array.isArray(p)?[...p]:p);};
    if(key==='enable'||key==='disable')return state=>{if(state==='DEPTH_TEST')depthTest=key==='enable';if(state==='BLEND')blend=key==='enable';if(state==='POLYGON_OFFSET_FILL')offset=key==='enable';};
    if(key==='depthMask')return value=>{depthWrite=value;};
    if(key==='polygonOffset')return (f,u)=>{factor=f;units=u;};
    if(key==='drawElements'||key==='drawArrays')return ()=>calls.push({program,depthWrite,depthTest,blend,offset,factor,units,mode:uniforms.get('uArtMode'),position:uniforms.get('uPos')});
    return ()=>({});
  }});
  const make=code ? new Function('ART','CUTOUTS',code.replace(/^import .*;$/gm,'').replaceAll('export ','')+'; return createRenderer;')(ART,CUTOUTS) : createRenderer;
  const renderer=make({getContext:()=>gl});renderer.setAtlas({pages:[{}],places:{probe:[0,0,0,1,1]}});
  return {renderer,calls,state:()=>({depthWrite,blend,offset,factor,units})};
}
export function checkFloorOffset(code) {
  const {renderer,calls,state}=rendererTrace(code);
  const pc={tone:'paper',p:[0,0,0],q:[0,0,0,1],s:[.1,.1,.001],e:[.02,.02],art:'probe'};
  renderer.draw([pc,{...pc,cut:true},{...pc,blend:true}],{W:100,H:100,S:10,cx:50,cy:50,cam:HOME},{floor:{}});
  const floor=calls.filter(c=>c.program===4);
  assert.equal(floor.length,1,'C5 floor offset: floor draw missing');
  assert.ok(floor[0].offset&&floor[0].factor>=1&&floor[0].units>=2,'C5 floor offset: missing positive offset');
  assert.ok(calls.filter(c=>c.program!==4).every(c=>!c.offset),'C5 floor offset: leaked into pieces');
  assert.deepEqual(state(),{depthWrite:true,blend:false,offset:false,factor:0,units:0},'C5 floor offset: state not restored');
}
export function checkBlendedPass() {
  const shader=fs.readFileSync(new URL('../sq.mjs',import.meta.url),'utf8');
  assert.match(shader,/uArtMode > 2.5.*vFace < 0.999/,'C3 blended pass: only picture face');
  assert.match(shader,/o = vec4\(art.rgb \* k, art.a\)/,'C3 blended pass: premultiplied lit colour');
  const {renderer,calls}=rendererTrace(),pc={tone:'paper',p:[0,0,0],q:[0,0,0,1],s:[.1,.1,.001],e:[.02,.02],art:'probe'};
  renderer.draw([pc,{...pc,blend:true,paintOrder:2,p:[2,0,0]},{...pc,blend:true,paintOrder:1,p:[1,0,0]}],{W:100,H:100,S:10,cx:50,cy:50,cam:HOME},{floor:{}});
  const blended=calls.filter(c=>c.mode===3&&c.program===1);
  assert.deepEqual(blended.map(c=>c.position[0]),[1,2],'C3 blended pass: paint order');
  assert.ok(blended.every(c=>c.blend&&c.depthTest&&!c.depthWrite),'C3 blended pass: blend/depth state');
  assert.ok(calls.filter(c=>c.program===2||c.program===3).every(c=>c.position[0]===0),'C3 blended pass: shadow/outline');
  assert.ok(calls.indexOf(blended[0])>calls.findLastIndex(c=>c.program===2)&&calls.indexOf(blended.at(-1))<calls.findIndex(c=>c.program===4),'C3 blended pass: pass order');
}

function checkCarryClipRenderer() {
  const sq=fs.readFileSync(new URL('../sq.mjs',import.meta.url),'utf8');
  assert.match(sq,/dot\(uCarryClip, vec4\(w, 1.0\)\) < 0.0/,'C2 renderer: carried clip missing');
  assert.match(sq,/gl\.uniform4fv\(u\.uCarryClip, pc\.carryClip \|\| noClip\)/,'C2 renderer: carried plane not uploaded');
  assert.match(sq,/pc\.hide \|\| pc\.sinkTop < 0 \|\|/,'C2 renderer: sunk body outline not culled');
  checkRendererClips();
  let next=0,program,plane;const calls=[],names=['uClip','uCarryClip'];
  const gl=new Proxy({}, {get:(_,key)=>{
    if(/^[A-Z_0-9]+$/.test(key))return key;
    if(key==='createProgram')return ()=>++next;
    if(key==='getProgramParameter')return (_,p)=>p==='ACTIVE_UNIFORMS'?names.length:true;
    if(key==='getShaderParameter')return ()=>true;
    if(key==='getActiveUniform')return (_,i)=>({name:names[i]});
    if(key==='getUniformLocation')return (_,name)=>({name});
    if(key==='useProgram')return p=>{program=p;};
    if(key==='uniform4fv')return (u,p)=>{if(u?.name==='uCarryClip')plane=[...p];};
    if(key==='drawElements')return ()=>calls.push({program,plane});
    return ()=>({});
  }});
  const renderer=createRenderer({getContext:()=>gl}),pc={tone:'ink',p:[0,0.01,0],q:[0,0,0,1],s:[0.1,0.1,0.001],e:[0.03,0.03],sink:true,sinkTop:0.001,clip:[0,1,0,0],carryClip:[0,1,0,-0.0148]};
  const view={W:1474,H:996,S:100,cx:737,cy:498,cam:HOME};
  renderer.draw([pc],view);
  assert.ok([1,2,3].every(p=>calls.some(c=>c.program===p)),'C2 renderer: colour/outline/shadow not exercised');
  assert.ok(calls.every(c=>c.plane?.join()===pc.carryClip.join()),'C2 renderer: wrong carried plane in a pass');
  calls.length=0;renderer.draw([{...pc,sinkTop:-0.001}],view);
  assert.equal(calls.length,0,'C2 renderer: drawn after body under floor');
}
export function checkRevealPass() {
  const key='kMapPartbar0',part=CUTOUTS[key],events=[],doc=globalThis.document,previousPath=globalThis.Path2D;
  const context=new Proxy({getTransform:()=>({a:1,b:0,c:0,d:1,e:0,f:0}),measureText:s=>({width:s.length*10})},{get:(o,k)=>k in o?o[k]:(...args)=>{if(['rect','clip','fill','fillRect','stroke','fillText'].includes(k))events.push([k,...args]);},set:(o,k,v)=>(o[k]=v,true)});
  const images=[];
  globalThis.document={createElement:()=>{const c={width:0,height:0,getContext:()=>context};images.push(c);return c;}};globalThis.Path2D=class {};
  try {
    const {renderer}=rendererTrace();renderer.setAtlas({pages:[{width:2048,height:2048}],places:{kMap:[0,8.5/2048,8.5/2048,1099/2048,424/2048],[key]:[0,.5/2048,.5/2048,(ART[key].w-1)/2048,(ART[key].h-1)/2048]}});
    const [x,y,w,h]=AM_LABEL_BARS[0],pc={tone:'paper',p:[0,0,0],q:[0,0,0,1],s:[.1,.1,.001],e:[.02,.02],art:key,blend:true,artReveal:[x/2200,(y+h/2)/850,(x+w)/2200,(y+h)/850]};
    const view={W:100,H:100,S:10,cx:50,cy:50,cam:HOME};renderer.draw([pc],view);
    const clip=events.findIndex(e=>e[0]==='clip'),paint=events.findIndex(e=>e[0]==='fillRect');
    assert.ok(clip>=0&&paint>clip,'C3 reveal: paint must follow the reveal clip');
    assert.equal(events[clip-1][0],'rect','C3 reveal: nominal clip');[x/2-part.crop[0],(y+h/2)/2-part.crop[1],w/2,h/4].forEach((n,i)=>near(events[clip-1][i+1],n,'C3 reveal: nominal clip, no expanded paint'));
    assert.equal(events.filter(e=>['fill','stroke','fillText','fillRect'].includes(e[0])).length,1,'C3 reveal: another mark leaked');
    const count=events.length;renderer.draw([pc],view);assert.equal(events.length,count,'C3 reveal: identical step repainted');
    assert.ok(images[0].width>=ART[key].w+48&&images[0].height>=ART[key].h+48,'C3 reveal: transparent texture gutter');
  } finally {if(doc===undefined)delete globalThis.document;else globalThis.document=doc;if(previousPath===undefined)delete globalThis.Path2D;else globalThis.Path2D=previousPath;}
}

export async function checkPinnedCamera(M, envelope=sceneEnvelope) {
  M ??= await load();
  assert.deepEqual(envelope(M.SCENES,corners,dot,HOME),DEFAULT_FIT,'R12 pinned fit: computed instead');
  assert.notDeepEqual(envelope(M.SCENES,corners,dot,makeCamera(10,4)),DEFAULT_FIT,'R12 turned camera computes');
  for(const name of ['play.mjs','stills.mjs']) assert.match(fs.readFileSync(new URL('../'+name,import.meta.url),'utf8'),/sceneEnvelope\(SCENES, corners, dot, cam\)/,'R12 pinned fit: player wiring');
  const points=M.SCENES.flatMap(make=>make().flatMap(corners));
  for(const t of grid(0,M.SHOW[5].len)) points.push(...at(M,'fig',t).flatMap(corners));
  const edges=[DEFAULT_FIT.x-DEFAULT_FIT.w/2,DEFAULT_FIT.y-DEFAULT_FIT.h/2,DEFAULT_FIT.x+DEFAULT_FIT.w/2,DEFAULT_FIT.y+DEFAULT_FIT.h/2];
  let left=Infinity,right=Infinity,bottom=Infinity,top=Infinity;
  for(const p of points) { const [x,y]=project(p);left=Math.min(left,x-edges[0]);right=Math.min(right,edges[2]-x);bottom=Math.min(bottom,y-edges[1]);top=Math.min(top,edges[3]-y); }
  assert.ok(Math.min(left,right,bottom,top)>=-1e-9,'R12 pinned fit: piece outside box');
  const h10=laptopClearance(M);
  assert.ok(h10.minimumGap>=12,'R12 H10 clearance: '+h10.minimumGap); assert.ok(h10.minimumRing>0,'R12 Laptop ring: '+h10.minimumRing);
  const before=[34.15580618825121,48.88799614326756,40.717300409016715,44.61459867481197,54.87983968171818,60.266757372187996,64.76575238520613,82.41565589781574,105.31373574710791,130.93059038829634];
  const previous=globalThis.getComputedStyle;globalThis.getComputedStyle=()=>({fontWeight:'800',fontSize:'20px',fontFamily:'Outfit'});
  let scales;
  try { scales=BROWSER_SIZES.map(([W,H],i)=>{const S=layoutModel(createPageLayout,DEFAULT_FIT,fitCalloutView,widthsFor(M),W,H).sample().S; assert.ok(S>=before[i]-1e-8,'R12 scale shrank: '+W+'x'+H);return {W,H,before:before[i],after:S};}); }
  finally { if(previous===undefined)delete globalThis.getComputedStyle;else globalThis.getComputedStyle=previous; }
  const {rows,...clearance}=h10;
  return {left,right,bottom,top,scales,clearance};
}

export async function checkRound17(M) {
  M ??= await load();
  prepareRound17Art();
  const levels = await checkLevels(M), letters = await checkDrawsAndLetters(M), swaps = await checkSwaps(M), carries = await checkCarries(M), flight = await checkFlight(M), sinks = await checkLidAndSinks(M);
  const devices = await checkDeviceModels(M), camera = await checkPinnedCamera(M);
  const heights = await checkDocumentHeights(M), stable = await checkPlaybackStability(M), masks = checkLetterMasks();
  const contact = await checkDeviceGlass(M), clearance = await checkDeviceGlass(M,true), fringes = await checkCutouts(M);checkCarryClipRenderer();checkFloorOffset();checkBlendedPass();checkRevealPass();console.log('Pixel helper synthetic tests: '+JSON.stringify(checkPixelHelpers()));
  console.log(`Critique round 2: retained C1 ${JSON.stringify({contact,clearance})}; C2 own-body depths, carry clips and renderer cull; C3 ${JSON.stringify(fringes)} exact paint partition; C4 five InDesign objects; C5 floor offset 1/2.`);
  return `R12: ${JSON.stringify({devices,camera})}\nRound 17: G ${swaps.boundaries} action ends / ${swaps.comparisons} registrations, worst ${swaps.worst.toFixed(5)} px; R1 ${levels} levels samples; R2/R3 ${letters} draw/type samples; R4 ${carries.carries} carries / ${carries.samples} samples, flat worst ${carries.flat.worst.toFixed(5)} px; R6/R7 ${flight} flight samples; R8-R11 ${sinks.samples} sink samples (${JSON.stringify(sinks.endTimes)}).\nFollow-up: F1 ${heights.samples} height samples / ${heights.pages} pages / ${heights.layers} layers; F2 ${stable.samples} playback samples / ${stable.faces} fixed faces, worst ${stable.worst.toFixed(5)} px; F3 ${masks.pictures} masks / ${masks.texels} fixture texels / ${masks.covered} covered, exact finished RGB.`;
}

// Register round 17's changed surfaces with the earlier frozen-picture comparisons. These surfaces now have the explicit
// G/R1-R4 gates above; unchanged app furniture, footage, comp construction and clocks still compare with the frozen evidence.
export const round17Changed = M => pc => {
  if (pc.blend || ART[pc.art]?.cutout || /^(locGround|wire(?:Wide|Tablet|Tall)Base)$/.test(pc.art || '')) return true;
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
  await control('badge drawnFrame', s => s.replace("isolatedDraw(D, AI.upper, 'kMap', 'badge', [1273 / 2200, 457 / 850, 72 / 2200, 146 / 850], handed(s, 'badge', t))", "drawnFrame(D, inRect(AI.upper, [1273 / 2200, 457 / 850, 72 / 2200, 146 / 850]), handed(s, 'badge', t), 'grey')"), 'R2 draw:', checkDrawsAndLetters);
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
  await control('F2 shared floor stack', s => s.replace("const face = height = art?.startsWith('chrome') ? base + 0.002 + 8 * LAYER_STEP : height + LAYER_STEP;", 'const face = height = stacks.floor = Math.max(0.09, (stacks.floor ?? -Infinity) + LAYER_STEP);'), 'F2 stationary faces:', checkPlaybackStability);
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
  await control('R12 one old phone', s=>s.replace('PHONE_D = MODELS.phone.d, PHONE = MODELS.phone.w,','PHONE_D = 0.861, PHONE = 0.418,'), 'R12 identical models:', checkDeviceModels);
  await control('R12 letterboxed tablet',s=>s.replace("const frame = shape === 2 ?", "const frame = shape === 4 ? [0, (1 - 472 / (16 / 9) / 328) / 2, 1, 472 / (16 / 9) / 328] : shape === 2 ?"),'R12 screen filled:',checkDeviceModels);
  await control('R12 300x600 phone with bars',s=>s.replace("const frame = shape === 2 ?", "const frame = shape === 1 ? [0, 25 / 650, 1, 600 / 650] : shape === 2 ?"),'R12 screen filled:',checkDeviceModels);
  await control('R12 stretched picture',s=>s.replace("width * 74 / 352 / size[1]", "width * 74 / 352 / size[1] * 1.13"),'R12 picture aspect:',checkDeviceModels);
  let islandFailed=false;
  try { checkPhoneArt(oldArt.replace('ART.chromeTablet.draw(c, w, h); } },','ART.chromeTablet.draw(c, w, h); island(c, w); } },')); }
  catch(error) { assert.ok(error.message.includes('R12 one island:'),error.message);islandFailed=true; }
  assert.ok(islandFailed,'R12 art island: MISSED');out.push('R12 baked island: failed at R12 one island:');
  await control('R12 old row forward',s=>s.replace('forward: 0.93','forward: 0.46'),'R12 H10 clearance:',checkPinnedCamera);
  let pinFailed=false;
  try { await checkPinnedCamera(await load(), (scenes,corners,dot,cam)=>{
    const points=scenes.flatMap(f=>f().flatMap(corners)),xs=points.map(p=>dot(cam.r,p)),ys=points.map(p=>dot(cam.u,p));return {w:Math.max(...xs)-Math.min(...xs)+0.5,h:Math.max(...ys)-Math.min(...ys)+0.5,x:(Math.max(...xs)+Math.min(...xs))/2,y:(Math.max(...ys)+Math.min(...ys))/2};
  }); } catch(error) {assert.ok(error.message.includes('R12 pinned fit:'),error.message);pinFailed=true;}
  assert.ok(pinFailed,'R12 computed fit: MISSED');out.push('R12 computed fit: failed at R12 pinned fit:');
  const coplanar = s => s.replace("0.002, art, m.t)]", "0.002, art, m.t - 0.002)]").replace('let height = base + 0.002 - LAYER_STEP;', 'let height = base - LAYER_STEP;').replace('base + 0.002 + 8 * LAYER_STEP', 'base + 8 * LAYER_STEP');
  await control('C1 old placement, underside',coplanar,'C1 glass underside:',checkDeviceGlass);
  await control('C1 old placement, top',coplanar,'C1 glass clearance:',M=>checkDeviceGlass(M,true));
  await control('C1 old island height',s=>s.replace('face: 0.052 + 16 * 0.0008','face: 0.05 + 16 * 0.0008'),'R12 one island: fixed height',checkDeviceModels);
  await control('C6 carried layers without cull or clip',s=>s.replace('pc.carryClip = [0, 1, 0, -Math.max(0, top(pc) - heights[j])]', 'pc.carryClip = undefined').replace('pc.sinkTop = heights[j] - depth * g;', 'pc.sinkTop = Infinity;'),'C2 carried lifetime: drawn after body',M=>checkLidAndSinks(M,true));
  await control('C2 reading copy grouped with stack',s=>s.replace('formats[0].objects = [floor.slice(0, 10), reading.filter(pc => pc.p[0] < spine), reading.filter(pc => pc.p[0] >= spine)];','formats[0].objects = [formats[0].pieces];'),'C2 body cull top',checkLidAndSinks);
  await control('C2 heights from tallest piece',s=>s.replace('(bodies[j].length ? bodies[j] : pieces).filter', 'pieces.filter'),'C2 body cull top',checkLidAndSinks);
  await control('C3 missing marker cutout',s=>s.replace('AM_MARKERS.slice(0, n).forEach', 'AM_MARKERS.slice(1, n).forEach'),'C3 exactness: missing emitted mark',checkCutouts);
  await control('C4 reading halves grouped',s=>s.replace('formats[0].objects = [floor.slice(0, 10), reading.filter(pc => pc.p[0] < spine), reading.filter(pc => pc.p[0] >= spine)];','formats[0].objects = [floor.slice(0, 10), reading];'),'R11 sink finish:',M=>checkLidAndSinks(M,true));
  let offsetFailed=false;
  try {checkFloorOffset(fs.readFileSync(new URL('../sq.mjs',import.meta.url),'utf8').replace('gl.enable(gl.POLYGON_OFFSET_FILL); gl.polygonOffset(1, 2);',''));}
  catch(error) {assert.ok(error.message.includes('C5 floor offset:'),error.message);offsetFailed=true;}
  assert.ok(offsetFailed,'C5 no floor offset: MISSED');out.push('C5 no floor offset: failed at C5 floor offset:');
  return out.join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (!process.argv.includes('--controls')) console.log(await checkRound17());
  else console.log(await checkRound17Controls());
}
