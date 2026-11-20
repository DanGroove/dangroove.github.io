// Node-only failure-path fixture. It does not import or execute the measurement entry point.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { measurePhases } from './measure-phases.mjs';

const report = { phases: [], sizes: [], sheets: [], flicker: { frames: 0, repeatFailures: 0, blinkBlocks: 0, repeatDetails: [], blinkDetails: [] }, windows: [], limitations: [], consoleErrors: [], networkViolations: [], requestedDpr: 2, readyMs: null };
const attempted = [];
const ok = await measurePhases(report, [[1440, 900], [1920, 1080]], async (w, h) => { attempted.push('play ' + w); throw new Error('fixture playback limit reached'); }, async () => { attempted.push('scan'); report.flicker.frames = 4; }, async () => { attempted.push('sheets'); report.sheets.push({ file: 'fixture.jpg', frames: 1, width: 200, height: 100, frameScale: 0.5 }); });
assert.equal(ok, false);
assert.ok(report.flicker.frames > 0 && report.sheets.length > 0, 'measurement phases: failed playback skipped scan/sheets');
assert.equal(report.playbackIncomplete, true);
assert.deepEqual(attempted, ['play 1440', 'play 1920', 'scan', 'sheets']);
assert.ok(report.flicker.frames > 0 && report.sheets.length > 0);
const source = fs.readFileSync(new URL('./measure.mjs', import.meta.url), 'utf8');
const body = source.slice(source.indexOf('function markdown() {') + 'function markdown() {'.length, source.indexOf('\nasync function writeReport()')).trim().replace(/\}$/, '');
const markdown = new Function('report', 'LOOP', 'mib', body)(report, 81.44, bytes => bytes + ' bytes');
assert.ok(markdown.includes('playback incomplete') && markdown.includes('flicker scan: complete') && markdown.includes('Requested device scale factor: 2'));
assert.ok(source.includes('if (!await measurePhases(report, sizes, playLoop, scanWindows, writeSheets)) process.exitCode = 1;'));
const success = {};
assert.equal(await measurePhases(success, [[390, 664]], async () => {}, async () => {}, async () => {}), true);
assert.equal(success.playbackIncomplete, false);
console.log('phase fixture: both failed playbacks recorded; scan 4 frames; sheets attempted; report says playback incomplete; failed result maps to exit 1');
console.log('phase checks clean (no browser or hardware measurement run)');
