import { checkPixelHelpers } from './round17-pixel-checks.mjs';
import { laptopClearance, layoutModel, widthsFor } from './round5-addendum-checks.mjs';
import { DEFAULT_FIT, sceneEnvelope } from '../view.mjs';
import { fitCalloutView } from '../labels.mjs';
import { createPageLayout } from '../page-layout.mjs';
import { BROWSER_SIZES } from './browser-check.mjs';
// CORRECTIONS-17. Geometry and source checks only: no browser, rasterisation, file mutation or dependencies.
import assert from 'node:assert/strict';
import { inflateRawSync } from 'node:zlib';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { HOME, dot, quatRotate, EASE, makeCamera } from '../../../../public/journey/hero/engine.mjs';
import { corners } from '../kit.mjs';
import { createRenderer } from '../sq.mjs';
import { ART, ART_TEXT, C, MOTION_LAYOUTS, motionCards, HISTOGRAM, AM_MARKERS, AM_LABEL_BARS, CITY_BLOCKS, CITY_PINS, makeAtlas, letterMask, maskLetterPictures, CUTOUTS, CUTOUT_MARGIN, CUTOUT_GUTTER, drawPictureParts, paintGroupName, BUILDING_PICTURES, buildingSize, buildingCommand, paintBuilding, buildingChanges, buildingPaint, buildingReveal, buildingRevealSpec, buildingRevealInventory, measureBuildingPaint, typingReveal } from '../art.mjs';
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
  const P=[],previous=reviewActionEnd;reviewActionEnd={};
  try {isolatedDraw(P,[0,0,1,1],source,id,region,amount,upward);return P;}
  finally {reviewActionEnd=previous;}
}
export function round17WireRevealProbe(source, id, region) {
  const P=[]; wireRegion(P,[0,0,1,1],source,region,1); return P.find(pc=>pc.cutoutId===id);
}
`;
const consistencyProbe = `
var round18OutlineCalls;
function outline(...args) {
  const pieces = round18Outline(...args);
  round18OutlineCalls?.push({rect:args.slice(0,4),pieces}); return pieces;
}
export function round18DrawProbe(key, id, fraction) {
  const i=SHOW.findIndex(s=>s.key===key),s=SCRIPTS[key],a=action(s,id),t=a.start+(a.end-a.start)*fraction;
  round18OutlineCalls=[];
  try {const frame=build(i,t,{});return {frame,outlines:round18OutlineCalls};}
  finally {round18OutlineCalls=null;}
}
export function round18CompProbe(shape, clock) {
  const pieces = [], draw = (tone, rect, art, window) => { const pc = {tone, rect, art, window}; pieces.push(pc); return pc; };
  draw.size = [480, 270]; animatedComp(draw, shape, clock); return pieces;
}
export function round18ViewerRects() { return [VIEW, [0.14, TOP - 0.5, 0.74, 0.416]]; }
`;
const load = async edit => {
  const old = source(), changed = edit ? edit(old) : old;
  if (edit) assert.notEqual(changed, old, 'negative control did not apply');
  return import('data:text/javascript;base64,' + Buffer.from((changed.replace('const outline =', 'const round18Outline =') + painterProbe + consistencyProbe).replace(/from (['"])(\.{1,2}\/[^'"]+)\1/g, (_, q, ref) => `from '${new URL(ref, url).href}'`)).toString('base64'));
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
  try { const atlas = preparedAtlas = makeAtlas(); assert.equal(atlas.pages.length, 5, 'C3 atlas: original five pages'); return atlas; }
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
  M ??= await load(); prepareRound17Art(); let samples=0;
  for(const [id,source,mark,nominal] of [['badge','kMap','badge',[1273/2200,457/850,72/2200,146/850]],['block','kLoc','block0',[660/1352,16/850,62/1352,68/850]]]) {
    const a=action(M,'ai',id),ref=at(M,'ai',a.end+.001).find(pc=>pc.building?.source===source);
    for(const t of grid(a.start+.01,a.end)) {
      const P=at(M,'ai',t),pc=P.find(pc=>pc.building?.source===source),p=M.HAND((t-a.start)/(a.end-a.start));
      assert.ok(pc&&!pc.cut&&!pc.blend,'R2 draw: missing ordinary building face');
      assert.ok(distance(fullCorners(pc),fullCorners(ref),scale(M))<=.1,'R2 draw: unregistered face');
      const [u,v,w,h]=nominal,clip=pc.building.plan.marks[mark]?.clips?.[0];
      const pad=source==='kMap'?[2.5/1100,2.5/425]:[1/541,1/340];
      assert.ok(clip,'R2 draw: missing canvas reveal');[u-pad[0],v-pad[1],u+w*p+pad[0],v+h*p+pad[1]].forEach((n,i)=>near(clip[i],n,'R2 growing paint clip'));samples++;
    }
  }
  for(const [key,ids] of [['ai',['labels','title','cityLabels']],['id',['mailTitle']]])for(const id of ids) {
    const a=action(M,key,id),source=a.textArt;
    for(const t of grid(a.start+.01,a.end)) {
      const P=at(M,key,t),pc=P.find(pc=>pc.building?.source===source&&pc.where==='content');
      assert.ok(pc&&!pc.cut&&!pc.blend,'R3 letters: missing ordinary building');
      assert.ok(P.some(pc=>pc.caret===source),'R3 letters: missing caret');samples++;
    }
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
  for (const [id, arts] of [['coverTitle', ['kCover', 'kCover']], ['postButton', ['kPost', 'kPost']], ['mailFlyer', ['kPost', 'kPost']], ['mailFlyer', ['kCover', 'kCover']], ['mailFlyer', ['kAmL', 'kAmL']], ['mailFlyer', ['kAmR', 'kAmR']]]) {
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
export function recordPicture(source, accept = null, offset = [0,0], plan = undefined) {
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
    setTransform(m){matrix=Array.isArray(m)?m.slice():['a','b','c','d','e','f'].map(k=>m[k]);},
    setLineDash(){},
    createLinearGradient(...args){return {args,stops:[],addColorStop(...stop){this.stops.push(stop);}};},
    beginPath(){path=[];},closePath(){path.push(['close']);},clip(p){clips.push(p?.rects||[...path]);},
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
  const previous=globalThis.Path2D;globalThis.Path2D=class {constructor(d){this.path=d;this.rects=[];}rect(...r){this.rects.push(['rect',...r]);}};
  try {if(plan!==undefined)paintBuilding(ctx,source,plan);else if(accept)drawPictureParts(ctx,source,accept);else ART[source].draw(ctx,ART[source].w,ART[source].h);}
  finally {if(previous===undefined)delete globalThis.Path2D;else globalThis.Path2D=previous;}
  return paints;
}

export function checkAtlasPacking(atlas=prepareRound17Art()) {
  const before=JSON.parse(inflateRawSync(Buffer.from('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','base64')));
  assert.deepEqual(atlas.pages.map(p=>[p.width,p.height]),before.pages,'C3 atlas packing: page heights');
  assert.deepEqual(atlas.places,before.places,'C3 atlas packing: places/sizes/phases');
  return {pages:before.pages,places:Object.keys(before.places).length};
}
export async function checkCutouts(M) {
  M ??= await load();prepareRound17Art();const rows=[];
  const unchanged={base:true,marks:{marker0:true},text:{},tab:true};
  assert.deepEqual(buildingChanges('kMap',unchanged,unchanged),[],'C3 identical plan has no dirty region');
  const dirty=buildingChanges('kMap',{...unchanged,marks:{}},unchanged),r=CUTOUTS.kMapPartmarker0.rect;
  assert.deepEqual(dirty,[[(r[0]-24)/1100,(r[1]-24)/425,(r[0]+r[2]+24)/1100,(r[1]+r[3]+24)/425]],'C3 changed mark region plus 24 texels');
  const normalized=p=>{const key=JSON.parse(p.key);key.at(-1).shift();return JSON.stringify(key);};
  for(const use of M.BUILDING_USES) {
    const end=action(M,use.scene,use.last).end,pc=at(M,use.scene,end+.002).find(p=>p.building?.id===use.id);
    assert.ok(pc,'C3 release exactness: missing building '+use.id);
    const full=recordPicture(use.source),built=recordPicture(use.source,null,[0,0],pc.building.plan);
    assert.equal(built.length,full.length,'C3 release exactness: command count '+use.id);
    assert.deepEqual(built.map(normalized),full.map(p=>p.key),'C3 release exactness: ordered unclipped source commands '+use.id);
    const size=buildingSize(use.source);
    assert.ok(size.x>=24&&size.y>=24&&size.width-size.x-size.w>=24&&size.height-size.y-size.h>=24,'C3 building margin');
    assert.ok([size.x,size.y,size.width,size.height].every(n=>n%8===0),'C3 building grid');
    const first=action(M,use.scene,use.first).start;
    for(let t=first;t<=end+.002;t+=1/60) {
      const P=at(M,use.scene,t),groups=new Map();
      for(const q of P.filter(p=>p.building)) {
        const uses=groups.get(q.building.id)||new Set();uses.add(q.building.source);groups.set(q.building.id,uses);
        assert.ok(!q.cut&&!q.blend,'C3 alpha-tested building: '+q.building.id);
      }
      assert.ok(!P.some(p=>p.labelSource===use.source||p.cutoutSource===use.source),'C3 retained construction piece');
      assert.ok([...groups.values()].every(g=>g.size===1),'C3 shared building texture');
      const q=P.find(p=>p.building?.source===use.source);if(!q)continue;
      // The scheduler's ownership boundaries are independent of the paint list's final-state equality.
      const markAction=id=>use.scene==='ai'?(use.source==='kMap'?(id.startsWith('marker')||id==='north'?'markers':id.startsWith('bar')?'labels':'badge'):id==='block0'?'block':id.startsWith('block')?'blocks':id==='roads'?'streets':'pins'):use.scene==='id'?(id==='button'?'mailButton':use.source==='kCover'?'blob':use.source==='kPost'?'postBlob':'mailBlob'):null;
      for(const [id,value] of Object.entries(q.building.plan.marks))if(value){const owner=markAction(id);if(owner)assert.ok(t>=action(M,use.scene,owner).start-1e-9,'C3 early mark: '+use.id+'/'+id);}
      const original=recordPicture(use.source).filter(p=>p.method.endsWith('Text'));
      const actual=recordPicture(use.source,null,[0,0],q.building.plan).filter(p=>p.method.endsWith('Text'));
      for(const p of actual){assert.ok(original.some(ref=>JSON.stringify(p.args)===JSON.stringify(ref.args)&&p.state.font===ref.state.font&&p.state.textAlign===ref.state.textAlign&&p.state.letterSpacing===ref.state.letterSpacing&&JSON.stringify(p.matrix)===JSON.stringify(ref.matrix)),'C3 typed command: font/position/alignment/spacing');}
    }
    rows.push({...use,...size,commands:full.length,release:end+starts(M)[M.SHOW.findIndex(s=>s.key===use.scene)]});
  }
  const atlas=checkAtlasPacking();return {pictures:rows,atlas};
}
export const checkCropFringes=checkCutouts;
export async function checkRevealBounds(M) {
  M ??=await load();prepareRound17Art();const probe=M.round17RevealProbe?M:await load();let commands=0,clipped=0,textPlanes=0;
  assert.deepEqual(buildingRevealSpec('kMap','badge',[1273/2200,457/850,72/2200,146/850]).ink,[634,226,675,304],'C8 badge command bounds: 6-unit stroke plus one texel');
  // Exercise transformed centred strokes/caps and glyph overhang without a canvas or pixel buffer.
  ART.__c8={w:100,h:100,draw(c){c.scale(2,2);c.lineWidth=4;c.lineCap='round';c.beginPath();c.moveTo(10,10);c.lineTo(20,10);c.stroke();c.lineCap='square';c.beginPath();c.moveTo(10,10);c.lineTo(20,20);c.stroke();}};
  try {
    const paints=measureBuildingPaint('__c8');assert.deepEqual(paints[0].ink,[15,15,45,25],'C8 transformed cap/stroke/AA support');
    const extra=4*Math.SQRT2+1;assert.deepEqual(paints[1].ink,[20-extra,20-extra,40+extra,40+extra],'C8 diagonal square caps');
  }
  finally {delete ART.__c8;}
  const metrics={textAlign:'center',measureText:s=>({width:s.length*10,actualBoundingBoxRight:s.length*5+3}),getTransform:()=>({a:0,b:.5})};
  assert.deepEqual(typingReveal(metrics,['abcd',100,20],4),{edge:120,padding:5,right:125},'C8 glyph overhang plus one texel');
  for(const use of M.BUILDING_USES) {
    // Every authored reveal endpoint is sampled, including intermediate blobs, base wipes and the stepped bars.
    const script=M.SCRIPTS[use.scene];
    for(const a of script.actions.filter(a=>a.end>=action(M,use.scene,use.first).end&&a.end<=action(M,use.scene,use.last).end)) M.buildingLastState(use.id,a.id);
    const plan=M.buildingLastState(use.id).plan,paints=buildingPaint(use.source),full=recordPicture(use.source);let ti=0;
    assert.equal(paints.length,full.length,'C8 own command inventory');
    for(const p of paints) {
      assert.equal(p.method,full[p.n].method,'C8 measured source command');
      const isText=p.method.endsWith('Text'),rule=buildingCommand(use.source,plan,p.group,p.method,p.n,isText?ti++:-1);
      assert.notEqual(rule,false,'C8 missing endpoint command '+use.id+'/'+p.n);
      if(rule?.clips&&p.ink) {
        const a=ART[use.source],clips=rule.clips.map(r=>r.map((v,i)=>v*(i%2?a.h:a.w)));
        const missing=clips.reduce((remaining,r)=>remaining.flatMap(q=>subtract(q,r)),[p.ink]);
        assert.ok(missing.every(r=>r[2]-r[0]<=1e-8||r[3]-r[1]<=1e-8),'C8 reveal contains ink: '+use.id+'/'+p.owner+'/'+p.n+' '+JSON.stringify(missing));clipped++;
      }
      if(isText&&rule?.count!==undefined) {
        assert.equal(rule.count,full[p.n].args[0].length,'C8 full text at endpoint');
        const rec=full[p.n],px=+(rec.state.font.match(/([\d.]+)px/)?.[1]||10),ctx={textAlign:rec.state.textAlign,measureText:s=>({width:s.length*px*.55}),getTransform:()=>({a:rec.matrix[0],b:rec.matrix[1]})};
        const reveal=typingReveal(ctx,rec.args,rule.count);
        assert.ok(reveal.right>=reveal.edge+1/Math.hypot(rec.matrix[0],rec.matrix[1])-1e-9,'C8 full typing half-plane');textPlanes++;
      }
      commands++;
    }
  }
  const inventory=buildingRevealInventory();
  for(const spec of inventory) {
    if(!spec.ink)continue;
    const pc=spec.id==='base'?null:spec.source.startsWith('wire')?probe.round17WireRevealProbe(spec.source,spec.id,spec.region):probe.round17RevealProbe(spec.source,spec.id,spec.region,1,false)[0];
    const a=ART[spec.source],end=(pc?.artReveal||buildingReveal(spec.source,spec.id,spec.region,1)).map((v,i)=>v*(i%2?a.h:a.w));
    assert.ok(spec.id==='base'||pc?.artReveal,'C8 reveal contains ink: missing endpoint clip');
    assert.ok(end[0]<=spec.ink[0]+1e-8&&end[1]<=spec.ink[1]+1e-8&&end[2]>=spec.ink[2]-1e-8&&end[3]>=spec.ink[3]-1e-8,'C8 reveal contains ink: '+spec.source+'/'+spec.id+' endpoint support');
    for(const p of [.125,.5]) {
      const [u,v,w,h]=spec.region,clip=buildingReveal(spec.source,spec.id,spec.region,p,'up'),pad=spec.padding;
      near(clip[1],Math.max(0,v+h*(1-p)-pad[1]/a.h),'C8 upward pace');
      near(buildingReveal(spec.source,spec.id,spec.region,p)[2],Math.min(1,u+w*p+pad[2]/a.w),'C8 corner pace');
    }
  }
  return {commands,clipped,textPlanes,reveals:inventory.length,padded:inventory.filter(s=>s.padding.some(p=>p>1e-8)).map(s=>({source:s.source,id:s.id,region:s.region,padding:s.padding}))};
}
export function checkBuildingMode(code=fs.readFileSync(new URL('../sq.mjs',import.meta.url),'utf8')) {
  const start=code.indexOf('if (pc.building && u.uArtMode)'),end=code.indexOf('\n\n  };',start),body=code.slice(start,end);
  assert.match(body,/gl\.uniform1f\(u\.uArtMode,1\)/,'C3 alpha-tested building: ordinary mode 1 required');
  assert.ok(!/gl\.uniform1f\(u\.uArtMode,[23]\)/.test(body),'C3 alpha-tested building: cut/blend mode');
}
export async function checkSpine(M) {
  M ??=await load();const [start,end]=M.playbackSpans(M.SCRIPTS.id).off;let samples=0,worst=0,pieces=0;
  for(let n=0;n<=Math.ceil((end-start)*1000);n++) {
    const P=at(M,'id',Math.min(end-1e-9,start+n/1000)).filter(p=>p.sink&&p.device===undefined&&p.p[2]>M.BLOCK_ROW.stack[1]+M.BLOCK_ROW.stack[3]);
    const edges=P.map(pc=>{const xs=corners(pc).map(p=>p[0]);return {pc,l:Math.min(...xs),r:Math.max(...xs)};});
    const left=edges.filter(e=>e.pc.p[0]<-.1),right=edges.filter(e=>e.pc.p[0]>=-.1);
    assert.ok(left.length&&right.length,'C7 spine: missing half');
    for(const e of [...left,...right]) {const x=e.pc.p[0]<-.1?e.r:e.l;worst=Math.max(worst,Math.abs(x+.1));near(x,-.1,'C7 spine gap',1e-12);pieces++;}
    samples++;
  }
  return {samples,pieces,worst,spine:-.1};
}

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
  const make=code ? new Function('ART','buildingSize','paintBuilding','buildingChanges',code.replace(/^import .*;$/gm,'').replaceAll('export ','')+'; return createRenderer;')(ART,buildingSize,paintBuilding,buildingChanges) : createRenderer;
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
  const contact = await checkDeviceGlass(M), clearance = await checkDeviceGlass(M,true), fringes = await checkCutouts(M);checkBuildingMode();checkCarryClipRenderer();checkFloorOffset();
  const {padded,...reveals}=await checkRevealBounds(M);console.log('C8 reveals: '+JSON.stringify({...reveals,padded:padded.length}));
  console.log('C7 spine: '+JSON.stringify(await checkSpine(M)));console.log('Pixel helper synthetic tests: '+JSON.stringify(checkPixelHelpers()));
  console.log(`Critique round 2: retained C1 ${JSON.stringify({contact,clearance})}; C2 own-body depths, carry clips and renderer cull; C3 ${JSON.stringify(fringes)} exact paint partition; C4 five InDesign objects; C5 floor offset 1/2.`);
  return `R12: ${JSON.stringify({devices,camera})}\nRound 17: G ${swaps.boundaries} action ends / ${swaps.comparisons} registrations, worst ${swaps.worst.toFixed(5)} px; R1 ${levels} levels samples; R2/R3 ${letters} draw/type samples; R4 ${carries.carries} carries / ${carries.samples} samples, flat worst ${carries.flat.worst.toFixed(5)} px; R6/R7 ${flight} flight samples; R8-R11 ${sinks.samples} sink samples (${JSON.stringify(sinks.endTimes)}).\nFollow-up: F1 ${heights.samples} height samples / ${heights.pages} pages / ${heights.layers} layers; F2 ${stable.samples} playback samples / ${stable.faces} fixed faces, worst ${stable.worst.toFixed(5)} px; F3 ${masks.pictures} masks / ${masks.texels} fixture texels / ${masks.covered} covered, exact finished RGB.`;
}

// Register round 17's changed surfaces with the earlier frozen-picture comparisons. These surfaces now have the explicit
// G/R1-R4 gates above; unchanged app furniture, footage, comp construction and clocks still compare with the frozen evidence.
export const round17Changed = M => pc => {
  if (pc.building || pc.blend || ART[pc.art]?.cutout || /^(locGround|wire(?:Wide|Tablet|Tall)Base)$/.test(pc.art || '')) return true;
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
  // C18: the rest rectangles move, but the established copies cursor anchors and timetable do not.
  frozen = frozen.replace('from: compPoint(ROWS[1]), to: compPoint(ROWS[2])', 'from: [2.5644, 2.13544], to: [2.6484, 1.93888]');
  frozen = frozen.replace('const l = rx + [0, 0.09, 0.24][i] * rw - parked * 0.75 * rw + (1 - f) * 0.75 * rw;', 'const l = rx + (1 - f) * 0.75 * rw;');
  // Only these two authored post-play holds change; the independent consistency gate covers their new endpoints.
  frozen = frozen.replaceAll("clock = exported ?? (playing ? phase(s, 'play', t) : null)", "clock = exported ?? (playing ? phase(s, 'play', t) : begun(s, 'play', t) ? 1 : null)");
  const live = source();
  for (const name of ['screenPainter', 'separateFaces']) {
    const body = code => { const a = code.indexOf('function ' + name + '('), b = code.indexOf('\n}', a) + 2; assert.ok(a >= 0 && b > a, 'F2 reference: missing ' + name); return code.slice(a, b); };
    frozen = frozen.replace(body(frozen), body(live));
  }
  // r15Patch copies the live build tail. Historical fixtures have none of the new building scheduler's helpers.
  if (!frozen.includes('function released(')) {
    frozen=frozen.replaceAll('buildingFaces(P, SHOW[i].key, at);','');
    const a=frozen.indexOf('export const BUILDING_USES'),b=frozen.indexOf('// G1: with the stack out',a);
    if(a>=0&&b>a)frozen=frozen.slice(0,a)+frozen.slice(b);
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

// C18: compare actual emitted rectangles in each picture's own coordinates, without rendering pixels.
export async function checkDrawAnchors(M) {
  if (!M?.round18DrawProbe) M=await load();
  prepareRound17Art();
  const gate='consistency: draw anchors', U=1.15, inventory=[], fractions=[.2,.35,.5,.65,.8];
  let samples=0,clips=0,worst=0;
  const localRect=pc=>[(pc.p[0]-pc.s[0]-M.SCREEN.l)/U,(pc.p[1]-pc.s[1]-M.SCREEN.b)/U,2*pc.s[0]/U,2*pc.s[1]/U];
  const compare=(a,b,scale,label)=>a.forEach((v,i)=>{const error=Math.abs(v-b[i])*scale[i%2];worst=Math.max(worst,error);assert.ok(error<=.5,`${gate} ${label} axis ${i}: ${error} px`);});
  const painted={
    'ai/badge':['kMap','badge'],'ai/block':['kLoc','block0'],
    'id/blob':['kCover','blob'],'id/postBlob':['kPost','blob'],'id/mailBlob':['eblast','blob'],'id/mailButton':['eblast','button'],
    'fig/frame0':['wireWide','base'],'fig/frame1':['wireTablet','base'],'fig/frame2':['wireTall','base'],
    'fig/pictureBox':['wireWide',null],'fig/button':['wireWide',null],
  };
  for(const scene of M.SHOW) {
    const actions=M.SCRIPTS[scene.key].actions.filter(a=>a.kind==='draw');
    inventory.push({scene:scene.key,actions:actions.map(a=>a.id)});
    for(const a of actions) for(const fraction of fractions) {
      const name=scene.key+'/'+a.id,{frame,outlines}=M.round18DrawProbe(scene.key,a.id,fraction),p=M.HAND(fraction);
      const cursor=frame.find(pc=>pc.art==='cursor'),position=cursor.shadowP||cursor.p;
      const tip=[(position[0]-.46*(.5-10/96)-M.SCREEN.l)/U,(position[1]+.46*(.5-6/96)-M.SCREEN.b)/U];
      const expectedTip=a.from.map((v,i)=>v+(a.to[i]-v)*p);
      compare(tip,expectedTip,[480,480],name+' cursor route');
      const growing=[a.from[0],tip[1],tip[0]-a.from[0],a.from[1]-tip[1]],paint=painted[name];
      if(paint) {
        const [source,mark]=paint,pc=frame.find(pc=>pc.building?.source===source&&pc.where==='content');
        assert.ok(pc,`${gate} ${name} missing building face`);
        const rect=localRect(pc),art=ART[source],region=[(a.from[0]-rect[0])/rect[2],(rect[1]+rect[3]-a.from[1])/rect[3],(a.to[0]-a.from[0])/rect[2],(a.from[1]-a.to[1])/rect[3]];
        const [u,v,w,h]=region,nominal=[u,v,u+w*p,v+h*p],plan=pc.building.plan;
        const ids=mark?[mark]:Object.values(CUTOUTS).filter(part=>part.source===source&&part.rect[0]+part.rect[2]>=u*art.w&&part.rect[0]<=(u+w)*art.w&&part.rect[1]+part.rect[3]>=v*art.h&&part.rect[1]<=(v+h)*art.h).map(part=>part.id);
        assert.ok(ids.length,`${gate} ${name} empty paint inventory`);
        for(const id of ids) {
          const rule=id==='base'?plan.base:plan.marks[id],actual=rule?.clips;
          assert.ok(actual?.length,`${gate} ${name}/${id} missing moving paint clip`);
          // C8's stroke/cap/AA support is deliberate. Check the actual padded clip against an independent
          // top-left-to-tip rectangle; never mistake that fringe for a different drag anchor.
          const spec=buildingRevealInventory().find(spec=>spec.source===source&&spec.id===id&&spec.region.every((n,i)=>Math.abs(n-region[i])<1e-9));
          assert.ok(spec,`${gate} ${name}/${id} measured fringe`);
          const {padding}=spec;
          const expected=nominal.map((n,i)=>Math.max(0,Math.min(1,n+(i<2?-1:1)*padding[i]/(i%2?art.h:art.w))));
          assert.equal(actual.length,1,`${gate} ${name}/${id} single drag clip`);
          compare(actual[0],expected,[art.w,art.h],name+'/'+id);clips++;
        }
      } else {
        const scale=scene.key==='ae'?[480/M.round18ViewerRects()[0][2],270/M.round18ViewerRects()[0][3]]:[480/(M.SCREEN.w/U),480/(M.SCREEN.w/U)];
        let rect;
        if(a.id==='marquee'||name==='id/postButton') {
          const candidates=outlines.filter(o=>Math.abs(o.rect[2]-growing[2])<1e-8&&Math.abs(o.rect[3]-growing[3])<1e-8);
          assert.equal(candidates.length,1,`${gate} ${name} one selection box`);
          const o=candidates[0];rect=o.rect;
          assert.equal(o.pieces.length,4,`${gate} ${name} four selection edges`);
          // Check the emitted outer edges too, even when a very small box's strokes overlap.
          const edges=o.pieces.map(localRect),actual=[edges[2][0],edges[0][1],edges[3][0]+edges[3][2]-edges[2][0],edges[1][1]+edges[1][3]-edges[0][1]];
          compare(actual,rect,scale,name+' emitted edges');
        } else {
          const candidates=frame.filter(pc=>pc.where==='content'&&(name==='ae/ball'?pc.art==='redBall':!pc.art&&!pc.overlay)).map(localRect).filter(r=>Math.abs(r[2]-growing[2])<1e-8&&Math.abs(r[3]-growing[3])<1e-8);
          assert.equal(candidates.length,1,`${gate} ${name} one growing shape`);rect=candidates[0];
        }
        compare([rect[0],rect[1]+rect[3]],a.from,scale,name+' fixed corner');
        compare([rect[0]+rect[2],rect[1]],tip,scale,name+' opposite corner');
      }
      samples++;
    }
  }
  assert.equal(samples,95,`${gate} all 19 draw actions at five points (including inherited tools and marquees)`);
  return {samples,clips,worst,inventory};
}

export function checkExportMarks(M) {
  const gate='consistency: exported artwork',forbidden=new Set(['motWide','motTall','motSq','compWide','playerWide','reel','feedSq']);
  let frames=0,pictures=0;
  for(const key of ['pr','ae']) {
    const s=M.SCRIPTS[key],times=[...Array.from({length:Math.ceil(s.len*30)},(_,i)=>i/30),...s.actions.flatMap(a=>[a.start,a.end])];
    for(const t of times) {
      for(const pc of at(M,key,t).filter(pc=>pc.where==='floor'&&pc.art)) {
        assert.ok(!forbidden.has(pc.art),`${gate} ${key} directly exports ${pc.art}`);pictures++;
      }
      frames++;
    }
  }
  // These two chrome recipes draw a legacy still, then clear its whole picture area. Prove that every
  // editor mark / burned caption is inside a LATER clear, including its stroke and one AA texel.
  const rectBounds=(command,rect,fringe=0)=>{
    const [x,y,w,h]=rect,m=command.matrix,points=[[x-fringe,y-fringe],[x+w+fringe,y-fringe],[x-fringe,y+h+fringe],[x+w+fringe,y+h+fringe]].map(([x,y])=>[m[0]*x+m[2]*y+m[4],m[1]*x+m[3]*y+m[5]]);
    return [Math.min(...points.map(p=>p[0])),Math.min(...points.map(p=>p[1])),Math.max(...points.map(p=>p[0])),Math.max(...points.map(p=>p[1]))];
  };
  const erased=(commands,command,bounds,label)=>{
    assert.ok(commands.some(c=>c.n>command.n&&c.method==='clearRect'&&(()=>{const b=rectBounds(c,c.args);return bounds[0]>=b[0]&&bounds[1]>=b[1]&&bounds[2]<=b[2]&&bounds[3]<=b[3];})()),`${gate} surviving ${label}`);
  };
  const motion=recordPicture('chromeMotionFeed'),dots=motion.filter(c=>c.method==='fill'&&c.state.fillStyle===C.slate&&c.path.some(p=>p[0]==='arc'&&Math.abs(p[3]-MOTION_LAYOUTS[2].px*.028)<1e-9));
  assert.equal(dots.length,11,`${gate} motion dotted path inventory`);
  for(const c of dots) {const [,x,y,r]=c.path.find(p=>p[0]==='arc');erased(motion,c,rectBounds(c,[x-r,y-r,2*r,2*r],1),'motion path dot');}
  const keys=motion.filter(c=>c.method==='strokeRect'&&Math.abs(c.args[2]-MOTION_LAYOUTS[2].px*.16)<1e-9);
  assert.equal(keys.length,1,`${gate} motion start-key inventory`);
  for(const c of keys)erased(motion,c,rectBounds(c,c.args,c.state.lineWidth/2+1),'motion start key');
  const feed=recordPicture('chromeFeed'),captions=feed.filter(c=>c.method==='fillText'&&c.args[0]==='Move well.');
  assert.equal(captions.length,1,`${gate} feed poster caption inventory`);
  for(const c of captions) {
    const plate=feed.find(q=>q.n===c.n-1&&q.method==='fillRect'&&q.state.fillStyle===C.paper);
    assert.ok(plate,`${gate} feed caption's own measured plate`);
    erased(feed,plate,rectBounds(plate,plate.args,1),'feed poster caption plate');
    const px=+(c.state.font.match(/([\d.]+)px/)?.[1]||10),[words,x,y]=c.args,w=words.length*px*.55;
    erased(feed,c,rectBounds(c,[x-w/2,y-px*.8,w,px],1),'feed poster caption');
  }
  for(const key of ['chromePlayer','chromeReel'])assert.ok(recordPicture(key).every(c=>!c.method.endsWith('Text')),`${gate} ${key} has no poster caption`);
  return {frames,pictures,erasedMotionMarks:dots.length+keys.length,erasedPosterCaptions:captions.length,visiblePosters:0};
}

export async function consistency(M) {
  if (!M?.round18CompProbe) M = await load();
  const gate = 'consistency:', arts = new Set(['wMake', 'wMove', 'redBall', 'rowA', 'rowB']);
  let comparisons = 0, worst = 0, headSamples = 0, prePlaySamples = 0;
  const equalRect = (a, b, label) => {
    assert.equal(a.length, b.length, `${gate} ${label} rectangle count`);
    a.forEach((pc, i) => {
      assert.equal(pc.art, b[i].art, `${gate} ${label} art ${i}`);
      pc.rect.forEach((v, k) => { const error = Math.abs(v - b[i].rect[k]); worst = Math.max(worst, error); assert.ok(error <= 0.5, `${gate} ${label} ${pc.art}/${i} axis ${k}: ${v} versus ${b[i].rect[k]}`); });
      comparisons++;
    });
  };
  const pixels = (shape, clock) => {
    const { w, h } = MOTION_LAYOUTS[shape];
    return M.round18CompProbe(shape, clock).filter(pc => arts.has(pc.art)).map(pc => ({ ...pc, rect: pc.rect.map((n, i) => n * (i % 2 ? h : w)) }));
  };
  const onScreen = (list, rect) => list.filter(pc => arts.has(pc.art) && pc.where === 'content' &&
    pc.p[0] > M.SCREEN.l + rect[0] * 1.15 && pc.p[0] < M.SCREEN.l + (rect[0] + rect[2]) * 1.15).map(pc => ({ art: pc.art, rect: [
      ((pc.p[0] - pc.s[0] - M.SCREEN.l) / 1.15 - rect[0]) / rect[2] * 480,
      (rect[1] + rect[3] - (pc.p[1] + pc.s[1] - M.SCREEN.b) / 1.15) / rect[3] * 270,
      2 * pc.s[0] / 1.15 / rect[2] * 480, 2 * pc.s[1] / 1.15 / rect[3] * 270,
    ] }));
  const last = pixels(3, 1), s = M.SCRIPTS.ae, play = action(M, 'ae', 'play'), exp = action(M, 'ae', 'export');
  const rects = M.round18ViewerRects(), builtTime = Math.max(action(M, 'ae', 'copies').end, action(M, 'ae', 'path').end) + 1e-6;
  assert.equal(last.length, 6, `${gate} clip's last frame has six pieces`);
  for (const rect of rects) equalRect(onScreen(at(M, 'ae', builtTime), rect), last, 'built/last');
  for (const clock of [2 / 2.4, 1, 1.1]) equalRect(pixels(3, clock), last, '2.0 s and after');
  for (const shape of [0, 4, 1, 2]) for (const clock of [2 / 2.4, 1]) {
    const expected = motionCards(MOTION_LAYOUTS[shape]).map((rect, i) => ({ art: i ? 'rowB' : 'rowA', rect }));
    equalRect(pixels(shape, clock).filter(pc => /^row[AB]$/.test(pc.art)), expected, `shape ${shape} rest`);
  }
  // Preserve each stagger, EASE.enter and the .75-row entrance distance, including clipping at the frame's right edge.
  for (const shape of [0, 1, 2, 3, 4]) motionCards(MOTION_LAYOUTS[shape]).forEach(([x, y, w, h], i) => {
    const [start, end] = M.LAYERS[i + 3][5], layout = MOTION_LAYOUTS[shape];
    for (const fraction of [0.2, 0.5, 0.8]) {
      const clock = (start + fraction * (end - start)) / 2.4;
      const left = x + (1 - EASE.enter(fraction)) * .75 * w, visible = Math.max(0, Math.min(1, (layout.w - left) / w));
      const pc = pixels(shape, clock).filter(pc => /^row[AB]$/.test(pc.art)).find(pc => Math.abs(pc.rect[1] - y) < 1e-8);
      if (!visible) assert.ok(!pc, `${gate} off-frame entrance`);
      else { assert.ok(pc, `${gate} staggered entrance`); equalRect([pc], [{art:i?'rowB':'rowA',rect:[left,y,w*visible,h]}], `shape ${shape} row ${i} entrance`); }
    }
  });
  // A fresh return value cannot mutate the table or the next caller's rest rectangles.
  const saved = JSON.stringify(MOTION_LAYOUTS), changed = motionCards(MOTION_LAYOUTS[3]); changed[0][0]++;
  assert.equal(JSON.stringify(MOTION_LAYOUTS), saved, `${gate} pure rest table`);
  assert.equal(motionCards(MOTION_LAYOUTS[3])[0][0], 296, `${gate} independent rest results`);

  // Read the actual still drawing commands, including the feed translation and the row tiles' crops.
  const stillCards = (key, width, height) => {
    let matrix = [1, 1, 0, 0], fillStyle; const stack = [], out = [];
    const c = new Proxy({
      save() { stack.push({ matrix: matrix.slice(), fillStyle }); },
      restore() { const state = stack.pop(); matrix = state.matrix; fillStyle = state.fillStyle; },
      translate(x, y) { matrix[2] += matrix[0] * x; matrix[3] += matrix[1] * y; },
      scale(x, y) { matrix[0] *= x; matrix[1] *= y; },
      measureText: words => ({ width: words.length * 20 }),
      fillRect(x, y, w, h) { if (fillStyle === C.ink && Math.abs(w - width) < 1e-8 && Math.abs(h - height) < 1e-8) out.push([matrix[2] + matrix[0] * x, matrix[3] + matrix[1] * y, matrix[0] * w, matrix[1] * h]); },
    }, { get: (o, k) => k === 'fillStyle' ? fillStyle : k in o ? o[k] : () => {}, set: (o, k, v) => { if (k === 'fillStyle') fillStyle = v; else o[k] = v; return true; } });
    ART[key].draw(c, ART[key].w, ART[key].h); return out;
  };
  for (const [key, shape] of [['compWide', 3], ['motWide', 4], ['motTall', 1], ['motSq', 2]]) {
    const expected = motionCards(MOTION_LAYOUTS[shape]), [,, w, h] = expected[0];
    equalRect(stillCards(key, w, h).map(rect => ({ art: 'card', rect })), expected.map(rect => ({ art: 'card', rect })), key);
  }
  for (const key of ['rowA', 'rowB']) equalRect(stillCards(key, 140, 37.8).filter(r => Math.abs(r[1]) < 1e-8).map(rect => ({ art: key, rect })), [{ art: key, rect: [0, 0, 140, 37.8] }], key);

  const lane = (P, origin) => {
    const heads = P.filter(pc => pc.where === 'content' && pc.tone === 'red' && !pc.art && Math.abs(pc.s[0] * 2 - 0.03 * 1.15) < 1e-9 && Math.abs(pc.s[1] * 2 - 0.95 * 1.15) < 1e-9);
    assert.equal(heads.length, 1, `${gate} one timeline head`);
    return (heads[0].p[0] - M.SCREEN.l) / 1.15 - origin;
  };
  const { land, off } = M.playbackSpans(s), head = action(M, 'ae', 'head');
  assert.deepEqual(head.to, [3.34, 1.06], `${gate} head reaches 2.0 s`);
  near(head.start,5.045305029997129,`${gate} head keeps start`);near(head.end-head.start,.25,`${gate} head keeps duration`);
  const path=action(M,'ae','path');
  near(path.start,5.576539105853828,`${gate} ball path keeps start`);near(path.end,5.926539105853828,`${gate} ball path keeps end`);
  assert.deepEqual(path.previous,head.to,`${gate} continuous approach after head`);
  near(M.LOOP,99.49089474781469,`${gate} unchanged loop`);
  for (const t of [head.start, (head.start + head.end) / 2, head.end + 0.001, builtTime, play.start - 0.001]) {
    const hand = M.HAND(Math.max(0, Math.min(1, (t - head.start) / (head.end - head.start))));
    near(lane(at(M, 'ae', t), 1.34), 2.0 * hand, `${gate} pre-play head`); prePlaySamples++;
  }
  const samples = [play.start, ...[0.23, 0.47, 0.73, 0.91].map(f => play.start + f * (play.end - play.start)), play.end,
    exp.start - 0.001, exp.end + 0.001, land - 0.001, ...[0, 0.51, 1.599, 1.6, 1.601, 3.199, 3.2].map(t => land + t * M.PACE), off[1] - 0.301 * M.PACE];
  for (const t of samples) {
    const P = at(M, 'ae', t), local = M.sceneAt(starts(M)[4] + t).at;
    const clock = local >= land ? P.clock : local < play.end ? (local - play.start) / (play.end - play.start) : 1;
    near(lane(P, 1.34), clock * 2.4, `${gate} head/frame time`, 1e-8);
    const expected = pixels(3, clock);
    for (const rect of rects) equalRect(onScreen(P, rect), expected, `viewer/thumbnail at head, AE ${t.toFixed(6)} s`);
    headSamples++;
  }
  const floor = at(M, 'ae', off[0]);
  for (const [device, shape] of [[0, 4], [1, 1], [2, 2]]) {
    const body = floor.find(pc => pc.where === 'floor' && pc.device === device && pc.deviceBody);
    assert.ok(body, `${gate} exported device ${device}`);
    const [x, z, w, h] = body.screenRect, o = MOTION_LAYOUTS[shape];
    const cards = floor.filter(pc => pc.device === device && /^row[AB]$/.test(pc.art)).map(pc => ({ art: pc.art, rect: [
      (pc.p[0] - pc.s[0] - x) / w * o.w, (pc.p[2] - pc.s[1] - z) / h * o.h, 2 * pc.s[0] / w * o.w, 2 * pc.s[1] / h * o.h,
    ] }));
    equalRect(cards, motionCards(o).map((rect, i) => ({ art: i ? 'rowB' : 'rowA', rect })), `device ${device} rest`);
  }
  // C18 audit: Premiere's post-play monitor was rewound to .9 s while its export held 3.9 s.
  const videoPlay = action(M, 'pr', 'play'), videoLand = M.playbackSpans(M.SCRIPTS.pr).land;
  for (const t of [videoPlay.end, action(M, 'pr', 'export').start - 0.001, videoLand - 0.001, M.playbackSpans(M.SCRIPTS.pr).off[0]]) {
    const P = at(M, 'pr', t), pictures = P.filter(pc => pc.where === 'content' && pc.playback && /^(shot|cap)/.test(pc.art));
    assert.equal(pictures.length, 1, `${gate} Premiere last frame piece count`);
    assert.equal(pictures[0].art, 'shotCfx', `${gate} Premiere last frame content`);
    near(lane(P, 0.44), 3.9, `${gate} Premiere last frame head`, 1e-8);
    headSamples++;
  }
  const videoFloor = at(M, 'pr', M.playbackSpans(M.SCRIPTS.pr).off[0]);
  for (const [device, suffix] of [[0, 'Tablet'], [1, 'Tall'], [2, 'Sq']]) {
    const pictures = videoFloor.filter(pc => pc.device === device && /^(shot|cap)/.test(pc.art));
    assert.deepEqual(pictures.map(pc => pc.art), ['shotCfx' + suffix], `${gate} Premiere exported last frame ${device}`);
  }
  return { comparisons, worst, headSamples, prePlaySamples,draws:await checkDrawAnchors(M),exports:checkExportMarks(M) };
}

export async function checkRound17Controls() {
  prepareRound17Art(); const out = [];
  const control = async (name, edit, gate, run) => {
    let caught = false;
    try { await run(await load(edit)); }
    catch (error) { assert.ok(error.message.includes(gate), `${name}: wrong gate: ${error.message}`); caught = true; }
    assert.ok(caught, `${name}: MISSED`); out.push(`${name}: failed at ${gate}`);
  };
  await control('C18 one card offset 0.09 rw', s => s.replace('const l = rx + (1 - f) * 0.75 * rw;', 'const l = rx + (i === 1 ? 0.09 * rw : 0) + (1 - f) * 0.75 * rw;'), 'consistency:', consistency);
  await control('C18 frame grows from opposite corner',s=>s.replace("buildingReveal(source,'base',[0,0,1,1],p,'corner')","buildingReveal(source,'base',[0,0,1,1],p,i===0?'upCorner':'corner')"),'consistency: draw anchors fig/frame0',checkDrawAnchors);
  await control('C18 picture box grows at full height',s=>s.replace("handed(s, 'pictureBox', t), 'corner'","handed(s, 'pictureBox', t), 'x'"),'consistency: draw anchors fig/pictureBox',checkDrawAnchors);
  await control('C18 pre-play head fallback restored',s=>s.replace('motionHead.to = [3.34, 1.06]','motionHead.to = [2.79, 1.06]'),'consistency: head reaches 2.0 s',consistency);
  await control('done() photo choice', s => s.replace("pc.artMix = handed(s, white ? 'white' : 'black', t);", "pc.artMix = done(s, white ? 'white' : 'black', t) ? 1 : 0;"), 'R1 photo mix', checkLevels);
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
  await control('C4 reading halves grouped',s=>s.replace('formats[0].objects = [floor.slice(0, 10), reading.filter(pc => pc.p[0] < spine), reading.filter(pc => pc.p[0] >= spine)];','formats[0].objects = [floor.slice(0, 10), reading];'),'R11 sink finish:',M=>checkLidAndSinks(M,true));
  let offsetFailed=false;
  try {checkFloorOffset(fs.readFileSync(new URL('../sq.mjs',import.meta.url),'utf8').replace('gl.enable(gl.POLYGON_OFFSET_FILL); gl.polygonOffset(1, 2);',''));}
  catch(error) {assert.ok(error.message.includes('C5 floor offset:'),error.message);offsetFailed=true;}
  assert.ok(offsetFailed,'C5 no floor offset: MISSED');out.push('C5 no floor offset: failed at C5 floor offset:');
  await control('C3 one command short',s=>s.replace('if (finished) {full();','if (finished) {full(); delete marks.marker0;'),'C3 release exactness:',checkCutouts);
  await control('C3 one action early',s=>s.replace('const full = () =>', "if(source==='kMap')marks.badge=true; const full = () =>"),'C3 early mark:',checkCutouts);
  let alphaFailed=false;try {checkBuildingMode(fs.readFileSync(new URL('../sq.mjs',import.meta.url),'utf8').replace('gl.uniform1f(u.uArtMode,1);gl.uniform4f','gl.uniform1f(u.uArtMode,2);gl.uniform4f'));}catch(e){assert.ok(e.message.includes('C3 alpha-tested building:'),e.message);alphaFailed=true;}assert.ok(alphaFailed,'C3 alpha-tested type MISSED');out.push('C3 alpha-tested typed letters: failed at C3 alpha-tested building:');
  await control('C3 shared texture',s=>s.replace("id:use.id,source,plan", "id:'shared',source,plan"),'C3 shared building texture',async M=>{
    const P=at(M,'ai',action(M,'ai','cityLabels').end+.002),groups=new Map();
    for(const pc of P.filter(p=>p.building)){const g=groups.get(pc.building.id)||new Set();g.add(pc.building.source);groups.set(pc.building.id,g);}
    assert.ok([...groups.values()].every(g=>g.size===1),'C3 shared building texture');
  });
  let packingFailed=false;try {const atlas=prepareRound17Art();checkAtlasPacking({...atlas,pages:atlas.pages.map((p,i)=>i===1?{...p,height:1704}:p)});}catch(e){assert.ok(e.message.includes('C3 atlas packing:'),e.message);packingFailed=true;}assert.ok(packingFailed,'C3 repadded page MISSED');out.push('C3 page 1 1704: failed at C3 atlas packing:');
  await control('C7 0.0001 gap',s=>s.replace('const reading = floor.slice(18), spine = -0.1;', 'const reading = floor.slice(18), spine = -0.1; for(const pc of reading)if(pc.p[0]>=spine)pc.p[0]+=.0001;'),'C7 spine gap',checkSpine);
  await control('C8 badge without padding',s=>s.replace("buildingReveal(source, id, region, p, upward ? 'up' : 'corner')", "source === 'kMap' && id === 'badge' ? (([u,v,w,h]) => [u,v,u+w*p,v+h*p])(region) : buildingReveal(source, id, region, p, upward ? 'up' : 'corner')"),'C8 reveal contains ink:',checkRevealBounds);
  await control('C8 details without padding',s=>s.replace("buildingReveal(source, part.id, [u,v,w,h], amount, direction)", "[u,v,u+w*amount,v+h]"),'C8 reveal contains ink:',checkRevealBounds);
  return out.join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (!process.argv.includes('--controls')) console.log(await checkRound17());
  else console.log(await checkRound17Controls());
}
