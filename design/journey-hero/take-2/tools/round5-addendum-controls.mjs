// Negative controls change one exact source site in memory; source files are never mutated.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const tests = [
  ['old CSSOM string comparison', 'H9', 'H9', 'page-layout.mjs', "for (const key of ['left', 'width']) stage.style.removeProperty(key);", "for (const key of ['left', 'width']) if (stage.style[key] === target[key]) stage.style.removeProperty(key);", 'H9 repeated measurement'],
  ['row forward shift undone — outline', 'H10-gap', 'H10', 'stage.mjs', 'forward: 0.4', 'forward: 0', 'H10 projected gap:'],
  ['row forward shift undone — ring', 'H10-ring', 'H10', 'stage.mjs', 'forward: 0.4', 'forward: 0', 'H10 Laptop ring:'],
];
const out = new URL('../.scratch/corrections5-addendum/controls/', import.meta.url);
const audit = process.argv.includes('--audit'), records = [];
if (!audit) fs.mkdirSync(out, { recursive: true });
for (const [name, only, control, file, search, replacement, gate] of tests) {
  const url = new URL('../' + file, import.meta.url), bytes = fs.readFileSync(url);
  assert.equal(bytes.toString('utf8').split(search).length - 1, 1, name + ': exact edit must match one site');
  if (audit) continue;
  const result = spawnSync(process.execPath, [fileURLToPath(new URL('round5-addendum-checks.mjs', import.meta.url)), '--only=' + only, '--control=' + control], { encoding: 'utf8', windowsHide: true });
  assert.ok(fs.readFileSync(url).equals(bytes), name + ': source changed');
  const output = (result.stdout || '') + (result.stderr || '');
  const caught = result.status === 1 && output.includes(gate);
  const record = { name, only, control, file, search, replacement, matches: 1, status: result.status, caught, gate, output };
  records.push(record);
  fs.writeFileSync(new URL(control + '-' + only + '.json', out), JSON.stringify(record, null, 2) + '\n');
  console.log(`${name}: ${caught ? 'caught' : 'MISSED'} (1 match; exit ${result.status})`);
  assert.ok(caught, name + ': negative control missed its gate');
}
if (audit) console.log('H9/H10 controls: all 3 exact edits match one place');
else fs.writeFileSync(new URL('controls.json', out), JSON.stringify(records, null, 2) + '\n');
