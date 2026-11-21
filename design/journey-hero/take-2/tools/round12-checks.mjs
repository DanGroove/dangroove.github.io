// Round 12 (CORRECTIONS-12): D1 phones in true proportion to their tablets, I1 InDesign without empty frames, X1 the exports
// further left by EXPORT_SHIFT. Node only, on the emitted pieces of the real stage.
//   node design/journey-hero/take-2/tools/round12-checks.mjs [--controls]
// Each negative control edits one exact site of stage.mjs in memory and must fail at its gate.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { corners } from '../kit.mjs';

const TAKE = new URL('../', import.meta.url);
const read = name => fs.readFileSync(new URL(name, TAKE), 'utf8');
async function load(name, source = read(name)) {
  const url = new URL(name, TAKE);
  const fixed = source.replace(/from (['"])(\.{1,2}\/[^'"]+)\1/g, (_all, _quote, ref) => `from '${new URL(ref, url).href}'`);
  return import('data:text/javascript;base64,' + Buffer.from(fixed).toString('base64'));
}
const near = (a, b, message, e = 1e-9) => assert.ok(Math.abs(a - b) <= e, `${message}: ${a} != ${b}`);
const within = (a, b, message, share = 0.02) => assert.ok(Math.abs(a / b - 1) <= share, `${message}: ${a.toFixed(5)} is not within ${share * 100} % of ${b.toFixed(5)}`);
// a piece's footprint on the floor: [x0, z0, x1, z1]
const foot = pc => { const c = corners(pc); return [Math.min(...c.map(p => p[0])), Math.min(...c.map(p => p[2])), Math.max(...c.map(p => p[0])), Math.max(...c.map(p => p[2]))]; };
// a picture's own size on the screen or the floor: [width, depth or height]
const size = (pc, floor) => { const f = floor ? foot(pc) : (() => { const c = corners(pc); return [Math.min(...c.map(p => p[0])), Math.min(...c.map(p => p[1])), Math.max(...c.map(p => p[0])), Math.max(...c.map(p => p[1]))]; })(); return [f[2] - f[0], f[3] - f[1]]; };
const inside = (a, b, e = 1e-9) => a[0] >= b[0] - e && a[1] >= b[1] - e && a[2] <= b[2] + e && a[3] <= b[3] + e;
// The reference bodies Dan's brief gives, in mm.
const PHONE = [77.6, 163.0], TABLET = [179.5, 248.6];

// ---- D1: each phone's size against the rule, each front edge on its tablet's, each screen's picture in its own shape.
export function checkPhones(M) {
  const { SHOW, SCENES, BLOCK, SCRIPTS } = M, out = [];
  const starts = SHOW.map((_, i) => SHOW.slice(0, i).reduce((n, s) => n + s.len, 0));
  const shape = PHONE[0] / PHONE[1], upright = PHONE[1] / TABLET[1], side = PHONE[1] / TABLET[0];
  // InDesign: the devices are the slabs under the 'post' and 'mail' screens, during the landing hold.
  const id = SHOW.findIndex(s => s.key === 'id'), land = SCRIPTS.id.actions.find(a => a.id === 'land');
  const floor = M.frameAt(starts[id] + land.start + 0.1).filter(pc => pc.where === 'floor');
  const body = art => { const face = floor.find(pc => pc.art === art), f = foot(face); return { face, body: floor.filter(pc => pc !== face && !pc.art && inside(f, foot(pc))).sort((a, b) => (foot(a)[2] - foot(a)[0]) * (foot(a)[3] - foot(a)[1]) - (foot(b)[2] - foot(b)[0]) * (foot(b)[3] - foot(b)[1]))[0] }; };
  const phone = body('post'), tablet = body('mail');
  assert.ok(phone.body && tablet.body, 'D1 InDesign: no phone or tablet body under the post or the e-blast');
  const [pw, pd] = size(phone.body, true), [tw, td] = size(tablet.body, true);
  near(td, 1.65, 'D1 InDesign tablet: its depth changed', 1e-9);
  within(pd / td, upright, 'D1 InDesign phone: depth against the upright tablet');
  within(pw / pd, shape, 'D1 InDesign phone: its own shape');
  within(tw / td, TABLET[0] / TABLET[1], 'D1 InDesign tablet: a real tablet\'s shape');
  assert.ok(tw <= 1.45 * 440 / 340 - pw - 2 * M.BLOCK_ROW.gutter + 1e-9, 'D1 InDesign tablet: wider than the width the smaller phone frees');
  near(foot(phone.body)[3], foot(tablet.body)[3], 'D1 InDesign: the phone\'s front edge is not on the tablet\'s');
  // the pictures keep their own shapes on the new screens
  within(size(phone.face, true)[0] / size(phone.face, true)[1], 300 / 650, 'D1 InDesign phone: the post does not fit its screen', 0.005);
  within(size(tablet.face, true)[0] / size(tablet.face, true)[1], M.ART_SIZES.mail[0] / M.ART_SIZES.mail[1], 'D1 InDesign tablet: the e-blast does not fit its screen', 0.005);
  out.push(`InDesign phone ${pw.toFixed(4)} x ${pd.toFixed(4)} (${(pd / td).toFixed(4)} of the tablet), tablet ${tw.toFixed(4)} x ${td.toFixed(4)}`);
  // Video, motion and UX/UI: device bodies at each still.
  for (const [key, kind] of [['pr', 'side'], ['ae', 'side'], ['fig', 'upright']]) {
    const i = SHOW.findIndex(s => s.key === key), list = SCENES[i]().filter(pc => pc.where === 'floor');
    const bodyOf = d => list.find(pc => pc.deviceBody && pc.device === d);
    const tab = bodyOf(key === 'fig' ? 1 : 0), phones = key === 'fig' ? [bodyOf(2)] : [bodyOf(1), bodyOf(2)];
    const [tW, tD] = size(tab, true);
    // CORRECTIONS-13 U1 makes Figma's tablet as deep as the laptop's deck (1.1, 0.855 wide) on purpose; round13-checks checks it.
    near(tD, key === 'fig' ? M.UI_ROW.tabD : M.MODELS.tablet.w, `D1 ${key} tablet: its depth changed`);
    near(tW, key === 'fig' ? M.UI_ROW.tabW : M.MODELS.tablet.d, `D1 ${key} tablet: its width changed`, 1e-6);
    for (const p of phones) {
      const [w, d] = size(p, true);
      within(d / tD, kind === 'side' ? side : upright, `D1 ${key} phone: depth against the tablet ${kind === 'side' ? 'on its side' : 'upright'}`);
      within(w / d, shape, `D1 ${key} phone: its own shape`);
      near(foot(p)[3], foot(tab)[3], `D1 ${key}: a phone's front edge is not on the tablet's`);
      // what plays on it keeps its picture's shape: the chrome is drawn over the whole picture
      const chrome = list.find(pc => pc.device === p.device && /^chrome/.test(pc.art || ''));
      const [cw, cd] = size(chrome, true), art = M.ART_SIZES[chrome.art];
      within(cw / cd, art[0] / art[1], `D1 ${key} phone: ${chrome.art} does not fit its screen`, 0.005);
    }
    const [w, d] = size(phones[0], true);
    out.push(`${key} phone ${w.toFixed(4)} x ${d.toFixed(4)} (${(d / tD).toFixed(4)} of the tablet)`);
  }
  // Figma's canvas: the phone's frame is to the tablet's frame as the phone's screen is to the tablet's on the floor.
  const fig = SHOW.findIndex(s => s.key === 'fig'), details = SCRIPTS.fig.actions.find(a => a.id === 'details');
  const canvas = M.frameAt(starts[fig] + details.end + 0.01);
  const frame = art => size(canvas.find(pc => pc.art === art && pc.canvas), false);
  const still = SCENES[fig]().filter(pc => pc.where === 'floor'), screen = art => size(still.find(pc => pc.art === art), true);
  const canvasShare = frame('wireTall')[1] / frame('wireTablet')[1], floorShare = screen('chromeHandset')[1] / screen('chromeTablet')[1];
  within(canvasShare, floorShare, 'D1 Figma canvas: the phone\'s frame is not in the devices\' proportion');
  within(frame('wireTall')[0] / frame('wireTall')[1], 9 / 19.5, 'D1 Figma canvas: the phone frame\'s shape');
  out.push(`Figma phone frame ${canvasShare.toFixed(4)} of the tablet frame's height (screens on the floor ${floorShare.toFixed(4)})`);
  return out.join('; ');
}

// ---- I1: no frame steps and no empty frames; the pages are there from the first frame; each picture lands on its page.
export function checkPages(M) {
  const { SHOW, SCRIPTS, LOOP, PACE } = M, s = SCRIPTS.id;
  const start = SHOW.slice(0, SHOW.findIndex(sc => sc.key === 'id')).reduce((n, sc) => n + sc.len, 0);
  assert.ok(!s.actions.some(a => a.tool === 'frame' || /^frame\d$/.test(a.id)), 'I1 steps: InDesign still draws a frame');
  // The content appears after the shell's 0.5 s change; from its first frame the pages are whole.
  const first = M.frameAt(start + 0.5 * PACE + 1e-6).filter(pc => pc.page);
  const want = { map: 2, photo: 5, postPhoto: 5, mailPhoto: 5 };
  for (const [id, n] of Object.entries(want)) assert.equal(first.filter(pc => pc.page === id).length, n, `I1 first frame: the ${id} page is not there whole`);
  const pageRect = id => { const f = first.filter(pc => pc.page === id && !pc.pageEdge).map(foot2); return [Math.min(...f.map(r => r[0])), Math.min(...f.map(r => r[1])), Math.max(...f.map(r => r[2])), Math.max(...f.map(r => r[3]))]; };
  let frames = 0;
  const end = s.actions.find(a => a.id === 'export').start;
  for (let at = 0.5 * PACE + 1e-6; at < end; at += 0.01 * PACE) {
    const P = M.frameAt(start + at); frames++;
    for (const pc of P.filter(pc => pc.where === 'content')) {
      assert.ok(!pc.emptyFrame && !pc.framePlate, `I1 frames: an empty-frame piece at ${at.toFixed(3)} s`);
      // a crossed line is a dark bar turned off the screen's axes
      const z = Math.abs(pc.q[2]), w = Math.abs(pc.q[3]);
      assert.ok(!(pc.tone === 'dark' && z > 1e-6 && Math.abs(z - w) > 1e-6 && w > 1e-6), `I1 frames: a crossed line at ${at.toFixed(3)} s`);
    }
  }
  // Each picture lands on its own page: what is placed lies within that page.
  const placed = { map: 'kMap', photo: 'coverPhoto', postPhoto: 'postPhoto', mailPhoto: 'mailPhoto' };
  for (const [id, art] of Object.entries(placed)) {
    const a = s.actions.find(a => a.id === id), P = M.frameAt(start + a.end + 1e-6), pc = P.find(pc => pc.art === art && pc.where === 'content' && !pc.echo);
    assert.ok(pc, `I1 placing: ${id} left no ${art}`);
    assert.ok(inside(foot2(pc), pageRect(id), 1e-6), `I1 placing: ${id} did not land on its own page`);
  }
  return `I1 pages: no frame step and no empty-frame or crossed piece in ${frames} InDesign frames at 0.01 s; the spread's two pages and the cover, post and e-blast pages whole from the first content frame; the map, photo, post photo and e-blast photo each land on their own page. InDesign ${SHOW.find(sc => sc.key === 'id').len.toFixed(3)} s, loop ${LOOP.toFixed(3)} s`;
}
const foot2 = pc => { const c = corners(pc); return [Math.min(...c.map(p => p[0])), Math.min(...c.map(p => p[1])), Math.max(...c.map(p => p[0])), Math.max(...c.map(p => p[1]))]; };

// ---- X1: every group's centre is the screen's middle plus EXPORT_SHIFT, and the shift is one number.
export async function checkShift(M, source = read('stage.mjs')) {
  const { SHOW, SCENES, SCREEN, EXPORT_SHIFT, BLOCK, POOL, MAT, SCRIPTS } = M, middle = SCREEN.l + SCREEN.w / 2 + EXPORT_SHIFT;
  const starts = SHOW.map((_, i) => SHOW.slice(0, i).reduce((n, s) => n + s.len, 0));
  near((BLOCK.x0 + BLOCK.x1) / 2, middle, 'X1 centre: InDesign block');
  near(MAT.x + MAT.w / 2, middle, 'X1 centre: the mat');
  near(POOL.x, middle, 'X1 centre: the light pool');
  const centre = list => { const xs = list.filter(pc => pc.where === 'floor').flatMap(corners).map(p => p[0]); return (Math.min(...xs) + Math.max(...xs)) / 2; };
  for (const i of [2, 3, 4, 5]) near(centre(SCENES[i]()), middle, `X1 centre: ${SHOW[i].key} at its still`, 1e-6);
  // InDesign's landing hold, with the copy still on the stack: the row behind is centred too.
  const id = SHOW.findIndex(s => s.key === 'id'), land = SCRIPTS.id.actions.find(a => a.id === 'land');
  near(centre(M.frameAt(starts[id] + land.start + 0.1)), middle, 'X1 centre: InDesign while landing', 1e-6);
  // One number: move EXPORT_SHIFT, and every floor piece, the pool and the laptop's slide move by exactly that, nothing else.
  const search = `export const EXPORT_SHIFT = ${EXPORT_SHIFT};`, d = -0.4;
  assert.equal(source.split(search).length - 1, 1, 'X1 one number: EXPORT_SHIFT must be one constant');
  const N = await load('stage.mjs', source.replace(search, `export const EXPORT_SHIFT = ${EXPORT_SHIFT + d};`));
  near(N.POOL.x - POOL.x, d, 'X1 one number: the pool'); near(N.BLOCK.x0 - BLOCK.x0, d, 'X1 one number: the block');
  const fig = SHOW.findIndex(s => s.key === 'fig'), b0 = M.ballBeats('fig', 0), exp = starts[fig] + M.playbackSpans(SCRIPTS.fig).spans[0][0], entry = [exp + (b0.split + b0.hold) / 2 * M.PACE, exp + (b0.wiped + b0.become) / 2 * M.PACE];   // CORRECTIONS-15: the red blocks in their places during the hold, and the laptop's lid half open
  let pieces = 0;
  for (const t of [...[2, 3, 4, 5].map(i => starts[i] + SHOW[i].still), starts[id] + land.start + 0.1, ...entry]) {
    const a = M.frameAt(t), b = N.frameAt(t);
    assert.equal(a.length, b.length, 'X1 one number: the pieces changed');
    a.forEach((pc, k) => {
      const q = b[k], shift = pc.where === 'floor' ? d : 0;
      pc.p.forEach((v, j) => near(q.p[j] - v, j === 0 ? shift : 0, `X1 one number: piece ${k} (${pc.where}) at ${t.toFixed(3)} s`, 1e-9));
      pieces++;
    });
  }
  return `X1 shift: EXPORT_SHIFT ${EXPORT_SHIFT}; block, mat, pool and the floor at the four stills and InDesign's landing centred on ${middle.toFixed(4)}; moving the one number by ${d} moves ${pieces} pieces' floor exactly and nothing else, the ball's red blocks and the laptop's opening lid included`;
}

export async function checkRound12(source = read('stage.mjs')) {
  const stage = await load('stage.mjs', source), art = await import(new URL('art.mjs', TAKE));
  const M = { ...stage, ART_SIZES: Object.fromEntries(Object.entries(art.ART).map(([k, v]) => [k, [v.w, v.h]])) };
  return ['D1 phones: ' + checkPhones(M), checkPages(M), await checkShift(M, source)].join('\n');
}

const ROUND12_CONTROLS = [
  { id: 'old InDesign phone', search: 'PHONE_D = MODELS.phone.d, PHONE = MODELS.phone.w,', replacement: 'PHONE_D = DEEP, PHONE = 0.7,', gate: 'D1 InDesign phone' },
  // CORRECTIONS-13 U1: phoneZ is now measured from the tablet's back edge (tabZ), not MAT.z.
  { id: 'phone set back', search: 'phoneZ = tabZ + tabD - phoneD;', replacement: 'phoneZ = tabZ;', gate: 'D1 fig: a phone\'s front edge' },
  { id: 'one frame step back', search: "    // CORRECTIONS-12 I1: no frames are drawn.", replacement: "    { id: 'frame1', kind: 'draw', from: topLeft(ID.cover), to: bottomRight(ID.cover), duration: 0.3, tool: 'frame' },\n    // CORRECTIONS-12 I1: no frames are drawn.", gate: 'I1 steps' },
  { id: 'pool left behind', search: 'export const POOL = { x: exportMiddle,', replacement: 'export const POOL = { x: screenMiddle,', gate: 'X1 centre: the light pool' },
];
export async function checkRound12Controls() {
  const out = [], source = read('stage.mjs');
  for (const c of ROUND12_CONTROLS) {
    assert.equal(source.split(c.search).length - 1, 1, `round 12 control ${c.id} must match one site`);
    let message = '';
    try { await checkRound12(source.replace(c.search, c.replacement)); } catch (error) { message = error.message; }
    assert.ok(message.startsWith(c.gate), `round 12 control ${c.id} not caught at ${c.gate} (${message || 'passed'})`);
    out.push(`${c.id} caught: ${message.split('\n')[0]}`);
  }
  return out.join('; ');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(await checkRound12());
  if (process.argv.includes('--controls')) console.log('Round 12 negative controls: ' + await checkRound12Controls());
}
