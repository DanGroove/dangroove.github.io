// In-memory faults only; no source mutation and no browser.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { SECOND_ADDENDUM_CONTROLS } from './round5-second-addendum-checks.mjs';

const sourceURL = new URL('../page-layout.mjs', import.meta.url);
const bytes = fs.readFileSync(sourceURL);
const source = bytes.toString('utf8').replace(/\r\n/g, '\n');
const audit = process.argv.includes('--audit');
const out = new URL('../.scratch/corrections5-second-addendum/controls/', import.meta.url);
const records = [];
if (!audit) fs.mkdirSync(out, { recursive: true });
for (const edit of SECOND_ADDENDUM_CONTROLS) {
  assert.equal(source.split(edit.search).length - 1, 1, edit.id + ': exact edit must match one site');
  if (audit) continue;
  const result = spawnSync(process.execPath, [fileURLToPath(new URL('round5-second-addendum-checks.mjs', import.meta.url)), '--only=' + edit.id, '--control=' + edit.id], { encoding: 'utf8', windowsHide: true });
  assert.ok(fs.readFileSync(sourceURL).equals(bytes), edit.id + ': source changed');
  const output = (result.stdout || '') + (result.stderr || '');
  const caught = result.status === 1 && output.includes(edit.gate);
  records.push({ ...edit, matches: 1, status: result.status, caught, output });
  console.log(`${edit.id}: ${caught ? 'caught' : 'MISSED'} (1 match; exit ${result.status}; ${edit.gate})`);
  assert.ok(caught, edit.id + ': negative control missed its gate');
}
if (audit) console.log('H11/H12 controls: both exact edits match one place');
else fs.writeFileSync(new URL('controls.json', out), JSON.stringify(records, null, 2) + '\n');
