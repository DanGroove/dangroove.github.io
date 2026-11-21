// CORRECTIONS-13 E1, E2: the exports drop out of the screen and become their formats, and the return plays it backwards.
// Pure Node geometry on the emitted pieces, sampled every 0.01 s through every export's entrance and return.
// node design/journey-hero/take-2/tools/round13-checks.mjs [--controls]
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { HOME, dot, quatRotate } from '../../../../public/journey/hero/engine.mjs';
import { corners } from '../kit.mjs';

const stageURL = new URL('../stage.mjs', import.meta.url);
async function load(edit) {
  if (!edit) return import(stageURL.href);
  const source = fs.readFileSync(stageURL, 'utf8'), changed = edit(source);
  assert.notEqual(changed, source, 'control edit did not apply');
  const code = changed.replace(/from (['"])(\.{1,2}\/[^'"]+)\1/g, (_all, _q, ref) => `from '${new URL(ref, stageURL).href}'`);
  return import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
}
const EPS = 1e-6;
const flatRect = pcs => { const c = pcs.flatMap(corners); return [Math.min(...c.map(p => p[0])), Math.min(...c.map(p => p[2])), Math.max(...c.map(p => p[0])), Math.max(...c.map(p => p[2]))]; };
const screenRect = pcs => { const c = pcs.flatMap(corners); return [Math.min(...c.map(p => p[0])), Math.min(...c.map(p => p[1])), Math.max(...c.map(p => p[0])), Math.max(...c.map(p => p[1]))]; };
const close = (a, b, tol = EPS) => a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tol);
// The sheet's tilt from upright: 0 facing us, 90 lying face up.
const tilt = pc => { const n = quatRotate(pc.q, [0, 0, 1]); return Math.atan2(n[1], n[2]) * 180 / Math.PI; };

export async function checkRound13(M) {
  M ??= await load();
  const { SHOW, SCRIPTS, PACE, SCREEN, MAT, UI_ROW, BLOCK_ROW, EXPORT_SHIFT, DROP, frameAt, playbackSpans, dropBeats, dropLength, SCENES } = M;
  const starts = []; let sum = 0; for (const s of SHOW) { starts.push(sum); sum += s.len; }
  const front = SCREEN.z + SCREEN.t / 2, middle = SCREEN.l + SCREEN.w / 2 + EXPORT_SHIFT;
  // The stage's box: the six stills' projected envelope and its 0.25 padding on each side (play.mjs fits need with 0.5).
  let env = [Infinity, -Infinity, Infinity, -Infinity];
  for (const make of SCENES) for (const pc of make()) for (const c of corners(pc)) { const x = dot(HOME.r, c), y = dot(HOME.u, c); env = [Math.min(env[0], x), Math.max(env[1], x), Math.min(env[2], y), Math.max(env[3], y)]; }
  const report = { samples: 0, scenes: {} };
  for (const key of ['id', 'pr', 'ae', 'fig']) {
    const i = SHOW.findIndex(s => s.key === key), s = SCRIPTS[key], g0 = starts[i], at = t => frameAt(g0 + t), { spans, land, off } = playbackSpans(s);
    const a = s.actions.find(x => x.id === 'export').start, L = dropLength(key) * PACE, n = key === 'fig' ? 3 : 1;
    const beats = j => { const b = dropBeats(key, j); for (const k in b) b[k] = a + b[k] * PACE; return b; };
    const info = { tips: [], landed: [], parts: 0, maxTilt: [] };
    assert.ok(Math.abs(land - a - L) < 1e-9, `${key}: land is not the drop's end`);
    spans.forEach((span, j) => assert.ok(Math.abs(span[1] - beats(j).become) < 1e-9, `${key}: span ${j} does not end at its become`));
    // E1 timing: labels, plays and the cycle start from each piece's become end; the return is DROP.back long.
    assert.ok(Math.abs(off[1] - off[0] - DROP.back * PACE) < 1e-9, `${key}: the return is not ${DROP.back} s`);
    const done = at(land + 1e-6 * PACE).filter(pc => pc.where === 'floor');
    // Nothing appears without coming from the screen: before the peel, no export piece anywhere.
    for (let t = 0; t < a; t += 0.01 * PACE) assert.ok(!at(t).some(pc => pc.where === 'floor'), `${key}: an export piece exists before the peel at ${t.toFixed(3)}`);
    for (let j = 0; j < n; j++) if (key === 'fig') for (let t = a; t < beats(j).start - 1e-6; t += 0.005 * PACE) assert.ok(!at(t).some(pc => pc.where === 'floor' && pc.device === j), `fig: device ${j} exists before its frame peels`);
    const ranges = [[a, land + 0.4 * PACE, 'in'], [off[0] - 0.2 * PACE, off[1], 'back']];
    const lastTilt = new Map();
    for (const [from, to, way] of ranges) {
      const times = [];
      for (let t = from; t < to - 1e-9; t += 0.01 * PACE) times.push(t);
      for (let j = 0; j < n; j++) { const b = beats(j); times.push(b.start + 1e-7 * PACE, b.tip - 1e-7 * PACE, b.tip, b.split, b.become); }
      lastTilt.clear();
      for (const t of [...new Set(times)].filter(t => t >= from - 1e-9 && t < to).sort((x, y) => x - y)) {
        const P = at(t), drop = P.filter(pc => pc.where === 'floor'); report.samples++;
        // The cursor stays still and unpressed through the drop (after Export's click).
        if (t > a + 0.05 * PACE && t < land) assert.ok(!P.pressed, `${key}: the cursor presses during the drop`);
        for (const pc of drop) for (const c of corners(pc)) {
          assert.ok(c[1] >= -1e-9, `${key} ${t.toFixed(3)}: a dropping piece goes through the floor`);
          if (c[1] > SCREEN.b + 1e-9 && c[0] > SCREEN.l && c[0] < SCREEN.l + SCREEN.w) assert.ok(c[2] >= front - 1e-9, `${key} ${t.toFixed(3)}: a dropping piece goes through the screen`);
        }
        for (const pc of drop.filter(pc => pc.drop === 'sheet')) for (const c of corners(pc)) {
          const x = dot(HOME.r, c), y = dot(HOME.u, c);
          assert.ok(x >= env[0] - 0.25 && x <= env[1] + 0.25 && y >= env[2] - 0.25 && y <= env[3] + 0.25, `${key} ${t.toFixed(3)}: the tipping sheet leaves the stage's box`);
        }
        // Its tilt runs monotonically from upright to flat (the laptop's to its 12 degree lean), on the way in, and back on the return.
        const sheets = new Map();
        for (const pc of drop.filter(pc => pc.drop === 'sheet')) { const j = pc.device ?? 0; (sheets.get(j) || sheets.set(j, []).get(j)).push(pc); }
        for (const [j, list] of sheets) {
          const angles = list.map(tilt), angle = angles[0];
          assert.ok(angles.every(v => Math.abs(v - angle) < 1e-7), `${key}: the sheet is not one rigid piece`);
          const before = lastTilt.get(j);
          if (before !== undefined) assert.ok(way === 'in' ? angle >= before - 1e-9 : angle <= before + 1e-9, `${key} ${t.toFixed(3)}: the sheet's tilt is not monotonic (${before.toFixed(3)} then ${angle.toFixed(3)})`);
          lastTilt.set(j, angle);
          info.maxTilt[j] = Math.max(info.maxTilt[j] ?? 0, angle);
        }
        // No device plays before its body is built, and no body starts before its part has arrived.
        for (let d = 0; d < 3; d++) {
          const mine = drop.filter(pc => pc.device === d && pc.drop !== 'sheet'), body = mine.find(pc => pc.deviceBody), final = done.find(pc => pc.device === d && pc.deviceBody);
          const built = body && close(body.p, final.p, 1e-7) && close(body.s, final.s, 1e-7);
          if (t < off[0] && (mine.some(pc => pc.clock > 0 || pc.art === 'tapDot') || P.clock > 0 && mine.length && !built)) assert.ok(built, `${key} ${t.toFixed(3)}: device ${d} plays before its body is built`);
          if (body && key !== 'id') {
            const j = key === 'fig' ? d : 0, faces = mine.filter(pc => pc.drop === 'part');
            const finalFaces = done.filter(pc => pc.device === d && !pc.deviceBody && !pc.lid && pc.paintLayer !== undefined || (pc.device === d && pc.lidPicture));
            if (key !== 'fig' || d) assert.ok(t >= beats(j).split - 1e-9 && (!faces.length || close(flatRect(faces), flatRect(finalFaces), 1e-7)), `${key} ${t.toFixed(3)}: device ${d}'s body starts before its part has arrived`);
          }
        }
        if (key === 'id') for (const pc of drop.filter(pc => pc.drop === 'body')) assert.ok(t >= beats(0).split - 1e-9 || t > off[0], `id ${t.toFixed(3)}: a body starts before its part has arrived`);
      }
    }
    // The copy starts exactly over the screen's work: at the peel's first instant, every sheet piece lies on a screen piece.
    for (let j = 0; j < n; j++) {
      const t = beats(j).start + 1e-9 * PACE, P = at(t), sheet = P.filter(pc => pc.drop === 'sheet' && (pc.device ?? 0) === j), screen = P.filter(pc => pc.where === 'content');
      assert.ok(sheet.length > 0, `${key}: no copy at the peel`);
      for (const pc of sheet) assert.ok(screen.some(q => q.art === pc.art && q.tone === pc.tone && close(q.s, pc.s, 1e-9) && Math.abs(q.p[0] - pc.p[0]) < 1e-6 && Math.abs(q.p[1] - pc.p[1]) < 1e-6 && Math.abs(q.p[2] - pc.p[2]) < 1e-6), `${key}: the copy does not start exactly over the screen's work`);
      // It lands flat, exactly on the group's footprint (fitted, keeping the work's shape) or, in Figma, on its device's screen.
      const landed = at(beats(j).tip - 1e-9 * PACE).filter(pc => pc.drop === 'sheet' && (pc.device ?? 0) === j);
      assert.ok(landed.every(pc => Math.abs(tilt(pc) - (key === 'fig' && j === 0 ? 12 : 90)) < 1e-4), `${key}: the copy does not land flat (or at the lid's lean)`);
      if (key === 'fig' && j === 0) {
        const lid = done.filter(pc => pc.lidPicture), r = screenRect(landed), q = screenRect(lid);
        assert.ok(close(r, q, 2e-3), `fig: the laptop's copy does not land on the lid's screen (${r.map(v => v.toFixed(4))} vs ${q.map(v => v.toFixed(4))})`);
      } else {
        const r = flatRect(landed), footprint = key === 'pr' || key === 'ae' ? [MAT.x, MAT.z, MAT.x + MAT.w, MAT.z + 1.8] : key === 'id' ? [BLOCK_ROW.stack[0], BLOCK_ROW.stack[1], BLOCK_ROW.tablet[0] + BLOCK_ROW.tablet[2], BLOCK_ROW.stack[1] + BLOCK_ROW.stack[3]] : flatRect(done.filter(pc => pc.device === j && !pc.deviceBody));
        const cx = (r[0] + r[2]) / 2, cz = (r[1] + r[3]) / 2, fx = (footprint[0] + footprint[2]) / 2, fz = (footprint[1] + footprint[3]) / 2;
        assert.ok(Math.abs(cx - fx) < 2e-3 && Math.abs(cz - fz) < 2e-3, `${key}: the copy does not land centred on its footprint`);
        if (key !== 'fig') assert.ok(Math.abs(fx - middle) < 1e-6, `${key}: the footprint is not on the screen's middle plus EXPORT_SHIFT`);
        const fits = Math.abs((r[2] - r[0]) - (footprint[2] - footprint[0])) < 2e-3 || Math.abs((r[3] - r[1]) - (footprint[3] - footprint[1])) < 2e-3;
        assert.ok(fits && r[0] >= footprint[0] - 2e-3 && r[2] <= footprint[2] + 2e-3 && r[1] >= footprint[1] - 2e-3 && r[3] <= footprint[3] + 2e-3, `${key}: the copy does not fill its footprint`);
        info.landed.push([r[2] - r[0], r[3] - r[1], footprint[2] - footprint[0], footprint[3] - footprint[1]].map(v => +v.toFixed(3)));
      }
    }
    // Every part ends at its piece's final place and size: just before the drop completes, what is emitted is the built piece.
    const nearly = at(land - 1e-7 * PACE).filter(pc => pc.where === 'floor' && pc.art !== 'tapDot'), final = at(land).filter(pc => pc.where === 'floor' && pc.art !== 'tapDot');
    // A picture's height on its screen depends on how many layers the playing frame paints, so faces compare in x, z and size.
    const geometry = pcs => pcs.filter(pc => !pc.playback || !pc.progressRail).map(pc => [pc.art || pc.tone, pc.p[0], pc.art && !pc.lidPicture ? 'face' : pc.p[1], pc.p[2], ...pc.s].map(v => typeof v === 'number' ? +v.toFixed(5) : v).join('/')).sort();
    if (key !== 'fig') { const pick = list => list.filter(pc => key === 'id' || pc.deviceBody || /^chrome/.test(pc.art || '')); assert.deepEqual(geometry(pick(nearly)), geometry(pick(final)), `${key}: a part does not end at its piece's final place and size`); }
    else for (const d of [0, 1, 2]) {
      const pick = list => list.filter(pc => pc.device === d && (pc.deviceBody || pc.lid || pc.art?.startsWith('chrome')));
      assert.deepEqual(geometry(pick(nearly)), geometry(pick(final)), `fig: device ${d} does not end at its final place and size`);
    }
    for (let j = 0; j < 3; j++) info.parts++;
    // The return ends with nothing on the floor: its last instant holds only the copy on the screen's face, then nothing.
    const last = at(off[1] - 1e-7 * PACE).filter(pc => pc.where === 'floor');
    assert.ok(last.length && last.every(pc => pc.drop === 'sheet'), `${key}: the return's last instant is not the copy alone`);
    assert.ok(last.every(pc => Math.abs(tilt(pc)) < 1e-4), `${key}: the copy is not back upright at the end of the return`);
    assert.ok(!frameAt(g0 + s.len).some(pc => pc.where === 'floor'), `${key}: something stays on the floor after the return`);
    report.scenes[key] = info;
  }
  return report;
}

// ---- U1 (the UX/UI row aligned, the tablet as deep as the deck) and I2 (InDesign's row behind squared up with the open copy).
// Measured from the emitted pieces at each scene's still and landing, not from the constants.
export async function checkRows(M) {
  M ??= await load();
  const { SHOW, SCENES, SCRIPTS, BLOCK, MAT, UI_ROW, SCREEN, EXPORT_SHIFT, PHONE_BESIDE, BODY, FIG, frameAt, playbackSpans } = M;
  const starts = []; let sum = 0; for (const s of SHOW) { starts.push(sum); sum += s.len; }
  const middle = SCREEN.l + SCREEN.w / 2 + EXPORT_SHIFT, out = [];
  // U1
  const fig = SCENES[SHOW.findIndex(s => s.key === 'fig')]().filter(pc => pc.where === 'floor');
  const deck = fig.find(pc => pc.deviceBody && pc.device === 0), tab = fig.find(pc => pc.deviceBody && pc.device === 1), phone = fig.find(pc => pc.deviceBody && pc.device === 2);
  const [d, t, p] = [deck, tab, phone].map(pc => flatRect([pc]));
  const depth = r => r[3] - r[1];
  assert.ok(Math.abs(depth(t) / depth(d) - 1) <= 0.005, `U1 depth: the tablet is ${depth(t).toFixed(4)} deep, the deck ${depth(d).toFixed(4)}`);
  assert.ok(Math.abs(t[3] - d[3]) <= 0.001 && Math.abs(p[3] - d[3]) <= 0.001, 'U1 front: the three front edges are not on one line');
  assert.ok(Math.abs(t[1] - d[1]) <= 0.001, "U1 back: the tablet's back edge is not on the deck's");
  assert.ok(Math.abs(depth(p) / depth(t) / PHONE_BESIDE.upright - 1) <= 0.02 && Math.abs((p[2] - p[0]) / depth(p) / (BODY.phone[0] / BODY.phone[1]) - 1) <= 0.02, 'U1 phone: not D1 against the new tablet');
  const screens = [fig.find(pc => pc.art === 'chromeLaptop'), fig.find(pc => pc.art === 'chromeTablet'), fig.find(pc => pc.art === 'chromeHandset')];
  const lidH = screens[0].s[1] * 2, heights = [lidH, depth(flatRect([screens[1]])), depth(flatRect([screens[2]]))];
  const frames = FIG.designs.map(r => r[3]);
  for (const [i, j] of [[0, 1], [2, 1], [0, 2]]) assert.ok(Math.abs((frames[i] / frames[j]) / (heights[i] / heights[j]) - 1) <= 0.02, `U1 canvas: frame ${i} to frame ${j} is not as screen ${i} to screen ${j}`);
  const xs = fig.flatMap(corners).map(c => c[0]);
  assert.ok(Math.abs((Math.min(...xs) + Math.max(...xs)) / 2 - middle) <= 0.001, 'U1 centring: the row left the screen middle plus EXPORT_SHIFT');
  out.push(`U1 tablet ${(t[2] - t[0]).toFixed(4)} x ${depth(t).toFixed(4)} (deck ${depth(d).toFixed(4)}), phone ${(p[2] - p[0]).toFixed(4)} x ${depth(p).toFixed(4)}, front edges ${[d[3], t[3], p[3]].map(n => n.toFixed(4)).join('/')}, canvas frames ${frames.map(n => n.toFixed(3)).join('/')} high`);
  // I2
  const id = SHOW.findIndex(s => s.key === 'id'), at = starts[id] + playbackSpans(SCRIPTS.id).land + 0.1;
  const floor = frameAt(at).filter(pc => pc.where === 'floor');
  const stack = flatRect(floor.filter(pc => pc.art === 'kCover' || (!pc.art && pc.tone === 'paper'))), ph = flatRect(floor.filter(pc => pc.art === 'post')), tb = flatRect(floor.filter(pc => pc.art === 'mail'));
  const slab = face => flatRect(floor.filter(pc => !pc.art && pc.tone === 'ink' && flatRect([pc])[0] <= face[0] + 1e-9 && flatRect([pc])[2] >= face[2] - 1e-9 && pc.s[2] > 0.02));
  const phoneBody = slab(ph), tabletBody = slab(tb);
  assert.ok(Math.abs(tabletBody[2] - BLOCK.x1) <= 0.001, `I2 right edge: the tablet's right edge ${tabletBody[2].toFixed(4)} is not on the open copy's ${BLOCK.x1.toFixed(4)}`);
  assert.ok(Math.abs(stack[0] - BLOCK.x0) <= 0.001, `I2 left edge: the stack's left edge ${stack[0].toFixed(4)} is not on the open copy's ${BLOCK.x0.toFixed(4)}`);
  const g1 = phoneBody[0] - stack[2], g2 = tabletBody[0] - phoneBody[2];
  assert.ok(Math.abs(g1 - g2) <= 1e-6, `I2 gutters: ${g1.toFixed(4)} and ${g2.toFixed(4)} are not equal`);
  assert.ok(Math.abs((BLOCK.x0 + BLOCK.x1) / 2 - middle) <= 1e-9, "I2 centre: the block's centre moved");
  out.push(`I2 row ${stack[0].toFixed(4)} to ${tabletBody[2].toFixed(4)} (open copy ${BLOCK.x0.toFixed(4)} to ${BLOCK.x1.toFixed(4)}), gutters ${g1.toFixed(4)}/${g2.toFixed(4)}`);
  return out.join('; ');
}
export async function checkRowsControls() {
  const out = [];
  const control = async (name, edit, expected) => {
    try { await checkRows(await load(edit)); out.push(`${name}: MISSED`); }
    catch (error) { if (!String(error.message).includes(expected)) throw new Error(`${name}: wrong failure: ${error.message}`); out.push(`${name}: caught`); }
  };
  await control('U1: the tablet back to 1.8 deep', s => s.replace('rim = 0.06, tabD = deck,', 'rim = 0.06, tabD = ROW,'), 'U1 depth');
  await control('I2: the row back to centred with GUT gutters', s => s.replace('const ROW_GUT = GUT + BACK;', 'const ROW_GUT = GUT;').replace('stack: [BLOCK.x0, BLOCK.z0, LEAF, DEEP], phone: [BLOCK.x0 + LEAF', 'stack: [BLOCK.x0 + BACK, BLOCK.z0, LEAF, DEEP], phone: [BLOCK.x0 + BACK + LEAF').replace('tablet: [BLOCK.x0 + LEAF + 2 * ROW_GUT', 'tablet: [BLOCK.x0 + BACK + LEAF + 2 * ROW_GUT'), 'I2 right edge');
  if (out.some(line => line.endsWith('MISSED'))) throw new Error('U1/I2 negative control missed: ' + out.join('; '));
  return out.join('; ');
}

export function describe(r, M) {
  return `Round 13 E1/E2 computed: ${r.samples} samples at 0.01 s through four drops and returns; copy over the work, monotonic tilt, landing on the footprint (landed sheet vs footprint, w x d: ${['id', 'pr', 'ae'].map(k => k + ' ' + r.scenes[k].landed[0].join('/')).join(', ')}; Figma on each device's screen), parts at their final places, no play before a body, nothing before the peel or after the return, inside the stage's box; loop ${M.LOOP.toFixed(3)} s`;
}

// Negative control: start one device's body before its part has arrived (the grow runs from the tip, not the split's end).
export async function checkRound13Controls() {
  const out = [];
  const control = async (name, edit, expected) => {
    try { await checkRound13(await load(edit)); out.push(`${name}: MISSED`); }
    catch (error) { if (!String(error.message).includes(expected)) throw new Error(`${name}: wrong failure: ${error.message}`); out.push(`${name}: caught`); }
  };
  await control('a body starts before its part arrives', s => s.replace('g = EASE.wipe(linear(tau, b.split, b.become));', 'g = EASE.wipe(linear(tau, b.tip, b.become));'), 'body starts before its part has arrived');
  await control('a play starts before its body is built', s => s.replace("const clock = Math.max(0, (t - land) / PACE) % 1.6 / 1.6, widths", "const clock = Math.max(0, (t - land + 0.3 * PACE) / PACE) % 1.6 / 1.6, widths"), 'plays before its body is built');
  await control('the tilt goes back up on the way down', s => s.replace('k = mix(1, sheet.k, tip), deg = sheet.deg * tip;', 'k = mix(1, sheet.k, tip), deg = sheet.deg * (tip + 0.3 * Math.sin(2 * Math.PI * tip));'), 'tilt is not monotonic');
  if (out.some(line => line.endsWith('MISSED'))) throw new Error('Round 13 negative control missed: ' + out.join('; '));
  return out.join('; ');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const M = await load();
  if (!process.argv.includes('--controls')) { console.log(describe(await checkRound13(M), M)); console.log(await checkRows(M)); }
  console.log('Round 13 negative controls: ' + await checkRound13Controls());
  console.log('U1/I2 negative controls: ' + await checkRowsControls());
}
