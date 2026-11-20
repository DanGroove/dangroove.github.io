// Each deliberate fault edits one site, runs the actual targeted checker, then restores exact bytes.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const take = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const call = "      if (i === 0) {\n        spreadFrame(D, t >= action(s, 'frame0').end - 0.000500001 * PACE ? 1 : handed(s, 'frame0', t), !filled);";
const old = "      if (i === 0 && done(s, 'frame0', t)) {\n        for (const rect of [ID.left, ID.right]) D.push({ ...on('ink', ...rect, { lift: 0.06, t: 0.02 }), tones: FLYER.coal });\n        if (!filled) emptyFrame(D, ID.frame, false);";
const centre = 'return { ...view, cx: (textRight + view.W) / 2 - view.S * need.x };';
const tests = [
  ['old spread drawing', 'H1', 'stage.mjs', call, old, 'H1 spread: release swaps'],
  ['other draw changes', 'H1', 'stage.mjs', "else P.push(on(tone, ...growing, { lift: 0.06, t: 0.02 }));", "else P.push(on('red', ...growing, { lift: 0.06, t: 0.02 }));", 'H1 draw comparison:'],
  ['spread grows outside rectangle', 'H1', 'stage.mjs', 'pc.s[0] *= p; pc.s[1] *= p;', 'pc.s[0] *= 1; pc.s[1] *= p;', 'H1 spread: corner outside'],
  ['short InDesign hold', 'H2', 'stage.mjs', "{ id: 'land', kind: 'wait', duration: 3.0 }", "{ id: 'land', kind: 'wait', duration: 1.2 }", 'H2 loop'],
  ['old laptop direction', 'H3', 'stage.mjs', 'const lidU = [1, 0, 0], lidV = [0, Math.cos(LID_ANGLE), -Math.sin(LID_ANGLE)], lidN = [0, Math.sin(LID_ANGLE), Math.cos(LID_ANGLE)];', 'const lidU = [0, 0, -1], lidV = [-Math.sin(LID_ANGLE), Math.cos(LID_ANGLE), 0], lidN = [Math.cos(LID_ANGLE), Math.sin(LID_ANGLE), 0];', 'H3 orientation:'],
  ['laptop label misses corner', 'H3', 'stage.mjs', 'const local = [-face.s[0] + 0.08, face.s[1] - 0.06, face.s[2]];', 'const local = [0, 0, face.s[2]];', 'H3 laptop label top-left corner'],
  ['laptop enters from wrong side', 'H3', 'stage.mjs', 'const dx = -1.6 * (1 - EASE.enter(linear(t, ...spans[0])));', 'const dx = 1.6 * (1 - EASE.enter(linear(t, ...spans[0])));', 'H3 same-object x entry'],
  ['wide centring undone', 'H6', 'view.mjs', centre, 'return view;', 'H6 equal side spaces'],
  ['resize gutter jumps', 'H6', 'view.mjs', 'export const sideGutter = width => Math.min(64, Math.max(40, 0.3 * width - 296));', 'export const sideGutter = width => Math.min(64, Math.max(40, 0.3 * width - 296)) + (width >= 1200 ? 1 : 0);', 'H6 discontinuity at'],
  ['scene scale shrinks', 'H6', 'view.mjs', centre, 'return { ...view, S: view.S * 0.95, cx: (textRight + view.W) / 2 - view.S * need.x };', 'H6 scene shrank'],
  ['stage target stays behind', 'H6', 'view.mjs', 'return { left, width: right - left };', 'return { left: boxLeft, width: boxRight - boxLeft };', 'H6 stage target misses'],
  ['floor ray shifted', 'H7', 'view.mjs', 'return [(a * cam.u[2] - cam.r[2] * b) / d, 0, (cam.r[0] * b - cam.u[0] * a) / d];', 'return [1 + (a * cam.u[2] - cam.r[2] * b) / d, 0, (cam.r[0] * b - cam.u[0] * a) / d];', 'H7 current-view ray/floor point'],
  ['dot decided per fragment', 'H7', 'view.mjs', 'Math.hypot(centre[0] - pointer[0], centre[1] - pointer[2]) <= 0.75', 'Math.hypot(x - pointer[0], z - pointer[2]) <= 0.75', 'H7 whole dot centre/radius rule'],
  ['shader decided per fragment', 'H7', 'sq.mjs', 'distance(centre, uHover.xy) <= 0.75', 'distance(vW.xz, uHover.xy) <= 0.75', 'H7 shader must use centre distance'],
  ['hover redraws not coalesced', 'H7', 'floor-hover.mjs', 'if (!available() || running() || pending) return;', 'if (!available() || running()) return;', 'H7 hover redraws are not coalesced'],
  ['leave retains pointer', 'H7', 'floor-hover.mjs', 'function clear() { if (pointer) { pointer = null; redraw(); } }', 'function clear() {}', 'H7 leave retains red dots'],
  ['hover disconnected from renderer', 'H7', 'play.mjs', 'pointer: hover.point(view)', 'pointer: null', 'H7 player does not bind'],
];
const sources = new Map(tests.map(t => [t[2], fs.readFileSync(path.join(take, t[2]))]));
for (const [name, , file, search] of tests) assert.equal(sources.get(file).toString('utf8').replace(/\r\n/g, '\n').split(search).length - 1, 1, 'control must match exactly one place: ' + name);
if (process.argv.includes('--audit')) console.log(`H controls: all ${tests.length} exact edits match one place`);
else {
  const output = path.join(take, '.scratch/corrections5/controls'); fs.mkdirSync(output, { recursive: true });
  const records = [];
  for (const [name, rule, file, search, replace, gate] of tests) {
    const original = sources.get(file); let result;
    try {
      fs.writeFileSync(path.join(take, file), original.toString('utf8').replace(/\r\n/g, '\n').replace(search, replace));
      result = spawnSync(process.execPath, [path.join(take, 'tools/round5-checks.mjs'), '--only=' + rule], { encoding: 'utf8', windowsHide: true, timeout: 30000 });
    } finally { fs.writeFileSync(path.join(take, file), original); }
    assert.ok(fs.readFileSync(path.join(take, file)).equals(original), 'control did not restore source bytes');
    const outputText = (result.stdout || '') + (result.stderr || ''), caught = result.status === 1 && outputText.includes(gate);
    const record = { name, rule, file, search, replace, matches: 1, status: result.status, caught, gate };
    fs.writeFileSync(path.join(output, name.replaceAll(' ', '-') + '.txt'), JSON.stringify({ ...record, output: outputText }, null, 2));
    records.push(record); console.log(`${name}: ${caught ? 'caught' : 'MISSED'} (1 match; exit ${result.status})`);
    if (!caught) process.exitCode = 1;
  }
  fs.writeFileSync(path.join(output, 'controls.json'), JSON.stringify(records, null, 2));
}
