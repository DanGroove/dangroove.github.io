// Final scope audit against the recorded incoming checkout. Read-only git; output stays in r19.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as entrance from '../entrance.mjs';
import { checkL12Groups } from './l12-checks.mjs';
const root = new URL('../../../../', import.meta.url);
const take = 'design/journey-hero/take-2/';
const out = new URL('../.scratch/review-out/r19/', import.meta.url);
const before = JSON.parse(fs.readFileSync(new URL('l12-baseline.json', out), 'utf8'));
const allowed = ['entrance.mjs', 'play.mjs', 'take-2.css', 'tools/checks.mjs', 'tools/entrance-checks.mjs', 'tools/round8-checks.mjs', 'BUILD.md', 'README.md'].map(p => take + p);
const changed = [], unchanged = [];
for (const [p, hash] of Object.entries(before.sources)) {
  const current = crypto.createHash('sha256').update(fs.readFileSync(new URL(p, root))).digest('hex');
  (hash === current ? unchanged : changed).push(p);
  if (hash !== current) assert.ok(allowed.includes(p), 'L12 preservation: unauthorized tracked edit ' + p);
}
const newFiles = execFileSync('git', ['ls-files', '--others', '--exclude-standard', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
for (const p of newFiles) assert.ok(/^design\/journey-hero\/take-2\/tools\/l12-[\w-]*(checks|trace)[\w-]*\.mjs$/.test(p), 'L12 preservation: unauthorized new file ' + p);
const normalize = s => s.replace(/\r\n/g, '\n');
const oldEntrance = normalize(before.originals['entrance.mjs']), now = normalize(fs.readFileSync(new URL(take + 'entrance.mjs', root), 'utf8'));
const loader = s => s.slice(s.indexOf('export function createLoaderView'), s.indexOf('// The loop\'s clock'));
assert.equal(loader(now), loader(oldEntrance), 'L12 preservation: loader bridge changed');
const oldURL = new URL(take + 'entrance.mjs', root);
const oldModule = await import('data:text/javascript;base64,' + Buffer.from(oldEntrance.replace(/from (['"])(\.{1,2}\/[^'"]+)\1/g, (_, q, ref) => `from '${new URL(ref, oldURL).href}'`)).toString('base64'));
const oldCheck = execFileSync('git', ['show', '9236932:' + take + 'tools/entrance-checks.mjs'], { encoding: 'utf8' });
const groupSource = oldCheck.slice(oldCheck.indexOf('export function checkEntranceGroups('), oldCheck.indexOf('export function checkLoaderTiming'));
const oldGroups = new Function('assert', groupSource.replace('export function ', 'function ') + '; return checkEntranceGroups;')(assert)(oldModule);
const result = { incoming: '92369320af2dd46e947e27a8210c5959fd3766a8', tracked: Object.keys(before.sources).length, unchanged: unchanged.length, changed, newFiles, loaderBridgeIdentical: true, oldGroups, newGroups: checkL12Groups(entrance), protectedRuntime: ['loader-stars.mjs', 'stars.mjs', 'stage.mjs', 'art.mjs', 'sq.mjs', 'kit.mjs', 'stills.mjs', 'view.mjs', 'labels.mjs', 'craft-wipe.mjs', 'name-react.mjs', 'page-layout.mjs', 'tools/page.mjs', 'tools/preview.mjs'].map(p => ({ file: p, byteIdentical: unchanged.includes(take + p) })) };
assert.ok(result.protectedRuntime.every(r => r.byteIdentical), 'L12 preservation: earlier runtime changed');
fs.writeFileSync(new URL('l12-preservation.json', out), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result));
