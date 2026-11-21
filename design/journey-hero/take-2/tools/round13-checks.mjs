// CORRECTIONS-13 U1 and I2: the UX/UI row aligned, and InDesign's row behind squared up with the open copy. (Its E1/E2 drop checks
// are retired by CORRECTIONS-15; see below.) Pure Node geometry on the emitted pieces.
// node design/journey-hero/take-2/tools/round13-checks.mjs [--controls]
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { corners } from '../kit.mjs';

const stageURL = new URL('../stage.mjs', import.meta.url);
async function load(edit) {
  if (!edit) return import(stageURL.href);
  const source = fs.readFileSync(stageURL, 'utf8'), changed = edit(source);
  assert.notEqual(changed, source, 'control edit did not apply');
  const code = changed.replace(/from (['"])(\.{1,2}\/[^'"]+)\1/g, (_all, _q, ref) => `from '${new URL(ref, stageURL).href}'`);
  return import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
}
const flatRect = pcs => { const c = pcs.flatMap(corners); return [Math.min(...c.map(p => p[0])), Math.min(...c.map(p => p[2])), Math.max(...c.map(p => p[0])), Math.max(...c.map(p => p[2]))]; };

// CORRECTIONS-15 retires round 13's E1/E2 checks with the drop they checked (the copy over the work at the peel, the sheet's
// monotonic tilt, its landing on the footprint, the tipping sheet inside the stage's box, the parts' arrival before the bodies,
// and the return played backwards). Their lasting rules (nothing before Export, no play before a piece is built, every piece at
// its final place, nothing left after the exports leave) are checked again for the ball and the sink in round15-checks.mjs.

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
  assert.ok(Math.abs(depth(t) - depth(d) - 0.11) <= 0.001, `U1 depth: the tablet is ${depth(t).toFixed(4)} deep, the deck ${depth(d).toFixed(4)}`);
  assert.ok(Math.abs(t[3] - d[3]) <= 0.001 && Math.abs(p[3] - d[3]) <= 0.001, 'U1 front: the three front edges are not on one line');
  assert.ok(Math.abs(t[1] - d[1] + 0.11) <= 0.001, "U1 back: the tablet's back edge is not on the deck's");
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
  const slab = face => flatRect(floor.filter(pc => !pc.art && pc.tone === 'ink' && flatRect([pc])[0] <= face[0] + 1e-9 && flatRect([pc])[2] >= face[2] - 1e-9 && pc.deviceBody));
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
  await control('U1: the tablet back to 1.8 deep', s => s.replace('tabD = MODELS.tablet.d,', 'tabD = 1.8,'), 'U1 depth');
  await control('I2: the row back to centred with GUT gutters', s => s.replace('const ROW_GUT = GUT + BACK;', 'const ROW_GUT = GUT;').replace('stack: [BLOCK.x0, BLOCK.z0, LEAF, DEEP], phone: [BLOCK.x0 + LEAF', 'stack: [BLOCK.x0 + BACK, BLOCK.z0, LEAF, DEEP], phone: [BLOCK.x0 + BACK + LEAF').replace('tablet: [BLOCK.x0 + LEAF + 2 * ROW_GUT', 'tablet: [BLOCK.x0 + BACK + LEAF + 2 * ROW_GUT'), 'I2 right edge');
  if (out.some(line => line.endsWith('MISSED'))) throw new Error('U1/I2 negative control missed: ' + out.join('; '));
  return out.join('; ');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const M = await load();
  if (!process.argv.includes('--controls')) console.log(await checkRows(M));
  console.log('U1/I2 negative controls: ' + await checkRowsControls());
}
