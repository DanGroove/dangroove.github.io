// Single-site, reversible controls for CORRECTIONS-4. No browser or measurement.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { inflateRawSync } from 'node:zlib';

const take = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(take, '.scratch/corrections4/controls');
const files = Object.fromEntries(['stage.mjs', 'sq.mjs', 'tools/drag-checks.mjs', 'tools/checks.mjs'].map(name => [name, fs.readFileSync(path.join(take, name))]));
const sources = JSON.parse(fs.readFileSync(path.join(take, 'tools/fixtures/drag-sources.json'), 'utf8'));
const previous = inflateRawSync(Buffer.from(sources.incoming.deflateBase64, 'base64')).toString('utf8').replace(/\r\n/g, '\n');
const oldLift = previous.slice(previous.indexOf('  // Only InDesign carries photographs'), previous.indexOf('  return P;\n}\n// Keep legacy plates'));
assert.ok(oldLift.startsWith('  // Only InDesign') && oldLift.includes('pc.p[2] = Math.max'), 'missing exact round-three lift');
const call = '  if (i === 2) liftDragStack(P);\n';
const tests = [
  { name: 'old per-face lift breaks order', rule: 'order', file: 'stage.mjs', before: call, after: oldLift },
  { name: 'old per-face lift moves corners', rule: 'corners', file: 'stage.mjs', before: call, after: oldLift },
  { name: 'lift undone permits occlusion', rule: 'clearance', file: 'stage.mjs', before: call, after: '' },
  { name: 'lift undone permits frame lines', rule: 'frames', file: 'stage.mjs', before: call, after: '' },
  { name: 'cursor omitted from shared lift', rule: 'order', file: 'stage.mjs', before: 'for (const pc of [...stack, cursor]) {', after: 'for (const pc of stack) {' },
  { name: 'crossed post frame hidden', rule: 'frames', file: 'stage.mjs', before: call, after: call + "  for (const pc of P) if (pc.emptyFrame === 'postPhoto') pc.hide = true;\n" },
  { name: 'crossed post frame disappears', rule: 'frames', file: 'stage.mjs', before: 'const filled = frameContact(s, drag, t, from, to, frame), placed = done(s, id, t), before = D.length;', after: "const filled = i === 2 && t >= 6.329 * PACE ? [['map', DOCK.map, ID.frame], ['photo', DOCK.photo, ID.photo], ['postPhoto', ID.photo, ID.post], ['mailPhoto', ID.photo, ID.mailPhoto]].some(([drag, from, to]) => frameContact(s, drag, t, from, to, frame)) : frameContact(s, drag, t, from, to, frame), placed = done(s, id, t), before = D.length;" },
  { name: 'plate removed before placement', rule: 'frames', file: 'stage.mjs', before: 'placed = done(s, id, t), before = D.length;', after: 'placed = filled, before = D.length;' },
  { name: 'valid placement exception removed', rule: 'frames', file: 'tools/drag-checks.mjs', before: "plates.length || P.some(pc => pc.where === 'content' && !pc.echo && replacements[id].includes(pc.art))", after: 'plates.length' },
  { name: 'shadow caster follows colour lift', rule: 'shadow', file: 'stage.mjs', before: 'pc.shadowP = pc.p;', after: 'pc.shadowP = pc.p.map((n, axis) => n + offset[axis]);' },
  { name: 'renderer shadow override removed', rule: 'shadow', file: 'sq.mjs', before: '      if (prog === depth && pc.shadowP) gl.uniform3fv(prog.u.uPos, pc.shadowP);\n', after: '' },
  { name: 'authored cursor route transform removed', checker: 'checks.mjs', rule: 'differs from', file: 'tools/checks.mjs', before: 'const p = pc.shadowP || pc.p; // The drag\'s depth-only lift leaves its authored route intact.', after: 'const p = pc.p;' },
  { name: 'cursor beneath carried image', checker: 'checks.mjs', rule: 'an interaction mark is below a picture stack', file: 'stage.mjs', before: call, after: call + "  if (i === 2 && P.action === 'photo') P.find(pc => pc.art === 'cursor').p[2] -= 0.1;\n" },
  { name: 'R15 projected clearance lift undone', checker: 'checks.mjs', rule: 'frame clearance:', file: 'stage.mjs', before: call, after: '' },
];
for (const test of tests) {
  const text = files[test.file].toString('utf8').replace(/\r\n/g, '\n');
  test.matches = text.split(test.before).length - 1;
  assert.equal(test.matches, 1, 'control must match exactly one place: ' + test.name);
}
if (process.argv.includes('--audit')) {
  console.log(`G1 controls: all ${tests.length} exact edits match one place`);
} else {
  fs.mkdirSync(output, { recursive: true });
  for (const test of tests.filter(t => !process.argv[2] || t.name.includes(process.argv[2]))) {
    const file = path.join(take, test.file), original = files[test.file];
    let result;
    try {
      fs.writeFileSync(file, original.toString('utf8').replace(/\r\n/g, '\n').replace(test.before, test.after));
      result = spawnSync(process.execPath, [path.join(take, 'tools', test.checker || 'drag-checks.mjs'), ...(test.checker ? ['--control'] : ['--only=' + test.rule])], { encoding: 'utf8', timeout: 90000, windowsHide: true });
    } finally { fs.writeFileSync(file, original); }
    const text = (result.stdout || '') + (result.stderr || ''), gate = test.checker ? test.rule : 'G1 ' + test.rule + ':';
    const caught = result.status === 1 && text.includes(gate);
    const evidence = { ...test, status: result.status, caught, output: text };
    fs.writeFileSync(path.join(output, test.name.replace(/[^a-z0-9]+/gi, '-') + '.txt'), JSON.stringify(evidence, null, 2));
    console.log(test.name + ': ' + (caught ? 'caught' : 'MISSED') + ' (1 match; exit ' + result.status + ')');
    if (!caught) process.exitCode = 1;
  }
}
