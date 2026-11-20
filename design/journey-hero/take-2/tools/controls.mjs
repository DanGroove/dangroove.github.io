// Reversible source mutations against the real checker. No browser or measurement process is invoked.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const take = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), root = path.resolve(take, '../../..');
const files = Object.fromEntries(['stage.mjs', 'play.mjs', 'labels.mjs', 'tools/correction-checks.mjs', 'tools/measure-phases.mjs'].map(n => [n, fs.readFileSync(path.join(take, n), 'utf8')]));
const out = path.join(take, '.scratch', 'corrections3', 'controls'); fs.mkdirSync(out, { recursive: true });
const tests = [];
const change = (name, rule, file, before, after) => tests.push({ name, rule, file, before, after });
const inject = (name, rule, functionName, code) => change(name, rule, 'stage.mjs', `function ${functionName}(t) {\n  const P = [], D = [], s = SCRIPTS.${functionName === 'editedVideo' ? 'pr' : 'id'};`, `function ${functionName}(t) {\n  const P = [], D = [], s = SCRIPTS.${functionName === 'editedVideo' ? 'pr' : 'id'};\n  ${code}`);
change('R1 premature photo row', 'R1:', 'stage.mjs', 'if (!visible) return;\n      const echoStart', "if (!visible && !(i === 0 && done(s, 'spreadType', t))) return;\n      const echoStart");
change('R2 premature page row', 'R2:', 'stage.mjs', 'if (!visible) return;\n      const echoStart', "if (!visible && !(i === 1 && done(s, 'spreadType', t))) return;\n      const echoStart");
change('R3 independent premature composite', 'R3:', 'stage.mjs', "if (done(s, key + 'Blob', t) && done(s, key === 'mail' ? 'mailFlyer' : 'postButton', t)) {", "if (done(s, key + 'Photo', t)) {");
change('R4 whole captions', 'R4:', 'stage.mjs', "repeated || begun(s, 'play', t) ? 1 : phase(s, id, t)", '1');
inject('R5 lane from nowhere', 'R5:', 'editedVideo', "if (t >= 12.5 * PACE && t < 12.8 * PACE) P.push({ ...on('paper', 0.45, 0.20, 0.12, 0.12, { lift: 0.3 }), document: true });");
change('R5 panel from nowhere', 'R5:', 'stage.mjs', 'function editedInDesign(t, { at: pages } = {}) {\n  const P = [], D = [], s = SCRIPTS.id;', "function editedInDesign(t, { at: pages } = {}) {\n  const P = [], D = [], s = SCRIPTS.id;\n  if (t >= 6.5 * PACE && t < 6.7 * PACE) P.push({ ...on('paper', PANEL + 0.64, 0.12, 0.12, 0.12, { lift: 0.3 }), document: true });");
change('R6 buried map', 'R6:', 'stage.mjs', "...ID.frame, { lift: 0.08, t: 0.004, art: 'kMap' }", "...ID.frame, { lift: 0.04, t: 0.004, art: 'kMap' }");
change('R7 wrong accent tool', 'R7:', 'stage.mjs', "id: 'accent' + i, kind: 'set', from: centre(r), duration: 0.05, tool: 'arrow'", "id: 'accent' + i, kind: 'set', from: centre(r), duration: 0.05");
change('R8 unbacked press', 'R8:', 'stage.mjs', "  P.action = active?.id;", "  if (s === SCRIPTS.pr && t >= 12.5 * PACE && t < 12.8 * PACE) P.pressed = true;\n  P.action = active?.id;");
change('R9 picture over post', 'R9:', 'stage.mjs', "  for (const key of ['map', 'loc', 'photo']) if (!begun", "  if (t >= action(s, 'postButton').end && t < action(s, 'postButton').end + 0.3 * PACE) D.push(on('ink', ...ID.post, { lift: 0.4, t: 0.004, art: 'kPhoto' }));\n  for (const key of ['map', 'loc', 'photo']) if (!begun");
change('R9 A1 undone', 'R9:', 'stage.mjs', "if (!done(s, key + 'Photo', t)) dragPicture(D, s, key + 'Photo'", "dragPicture(D, s, key + 'Photo'");
change('R10 A3 undone', 'R10:', 'stage.mjs', "{ tail: 0, start: centre(DOCK.loc) }", '{ tail: 0 }');
change('R10 A4 undone', 'R10:', 'stage.mjs', "count: 6, duration: 0.3", 'count: 6, duration: 0.08');
change('R11 wrong words', 'R11:', 'stage.mjs', "pr: ['YouTube', 'TikTok', 'Instagram']", "pr: ['Video', 'TikTok', 'Instagram']");
change('R12 early label', 'R12:', 'stage.mjs', 'timing.spans.map(span => span[1]);', 'timing.spans.map(span => span[1] - 0.2 * PACE);');
change('R13 reversed growth', 'R13:', 'stage.mjs', 'const grow = progress(at, ends[i], ends[i] + 0.25 * PACE)', 'const grow = 1 - progress(at, ends[i], ends[i] + 0.25 * PACE)');
change('R14 wrong corner inset', 'R14:', 'stage.mjs', 'i === 0 ? x + 0.1', 'i === 0 ? x + 0');
change('Figma device count', 'Figma devices:', 'stage.mjs', "pc.deviceKind = ['laptop', 'tablet', 'phone'][i]", "pc.deviceKind = ['laptop', 'phone', 'phone'][i]");
change('Figma canvas tags beside top bar', 'canvas clearance:', 'stage.mjs', "if (done(s, 'frame' + i, t)) D.push({ ...on('grey', r[0], r[1] + r[3] + 0.015", "if (done(s, 'frame' + i, t)) D.push({ ...on('grey', r[0], r[1] + r[3] + 0.035");
change('canvas pixel ceiling', 'pixel ceiling:', 'play.mjs', 'Math.min(2, devicePixelRatio || 1, Math.sqrt(5.2e6 / (W * H)))', 'Math.min(2, devicePixelRatio || 1)');
change('frame contact undone', 'R15:', 'stage.mjs', 'const filled = frameContact(s, drag, t, from, to, frame)', 'const filled = false && frameContact(s, drag, t, from, to, frame)');
change('word side faces A5 undone', 'word side faces:', 'stage.mjs', "if (pc.art === 'wMake' || pc.art === 'wMove') pc.cut = true;", "if (pc.art === 'wMake' || pc.art === 'wMove') pc.cut = false;");
change('Figma canvas playback frozen', 'Figma motion:', 'stage.mjs', 'prototype(draw, i, clock, false);', 'prototype(draw, i, 0, false);');
change('Figma laptop playback frozen', 'Figma motion:', 'stage.mjs', 'prototype(lidPainter(pieces), 0, t < spans[0][1] ? -1 : clock);', 'prototype(lidPainter(pieces), 0, t < spans[0][1] ? -1 : 0);');
change('Figma lid clearance', 'laptop clearance:', 'stage.mjs', "...device(x, MAT.z, w, ROW, undefined, { rim: g.rim, round: 0.03 })[0], deviceBody: true", "...device(x, MAT.z, w, ROW, undefined, { rim: g.rim, round: 0.03 })[0], deviceBody: true, lid: i === 1");
change('Figma world centring', 'fig: footprint is not centred in world x', 'stage.mjs', 'left = screenMiddle - width / 2', 'left = screenMiddle + 0.1 - width / 2');
change('Figma tablet x drift', 'feed path:', 'stage.mjs', 'feed(P, pieces, t, ...spans[i]);\n    }', 'for (const pc of pieces) pc.p[0] += 0.1 * Math.sin(Math.PI * linear(t, ...spans[i]));\n      feed(P, pieces, t, ...spans[i]);\n    }');
change('photo registration', 'photo registration:', 'stage.mjs', "key === 'mail' ? ID.mailPhoto : rect, key + 'Image'", "key === 'mail' ? ID.mailPhoto : rect, 'kPhoto'");
change('label route fit undone', 'label route:', 'labels.mjs', 'const { S, cx } = fit;', 'const S = view.S, cx = view.cx;');
change('page text boundary fit undone', 'page labels 768x1024/', 'labels.mjs', 'export function fitCalloutView(view, need, boxLeft, widths, obstacles = []) {', 'export function fitCalloutView(view, need, boxLeft, widths, ignoredObstacles = []) {\n  const obstacles = [];');
tests.at(-1).checker = 'label-page-checks.mjs';
change('up label direction undone', 'label route: leader goes in the wrong vertical direction', 'labels.mjs', "const delta = Math.abs(elbowX - mx), signY = c.level === 'up' ? -1 : 1;", 'const delta = Math.abs(elbowX - mx), signY = 1;');
tests.at(-1).checker = 'label-page-checks.mjs';
change('label diagonal undone', 'label route: expected a 45-degree diagonal then a horizontal run', 'labels.mjs', 'const points = [start, [elbowX, endY], [endX, endY]];', 'const points = [start, [elbowX, endY + 1], [endX, endY]];');
tests.at(-1).checker = 'label-page-checks.mjs';
change('stage gutter fit undone', 'stage gutters:', 'labels.mjs', 'const { S, cx } = fit;', 'const S = view.S, cx = view.cx;');
change('R14 laptop wrong face', 'R14:', 'stage.mjs', "floor.find(pc => pc.lidPicture && pc.art === 'chromeLaptop')", "floor.filter(pc => pc.lidPicture).at(-1)");
change('Figma phone aspect', 'Figma device geometry:', 'stage.mjs', 'phoneW = (ROW - rim * 2) * 9 / 19.5 + rim * 2', 'phoneW = (ROW - rim * 2) * 9 / 18 + rim * 2');
change('measurement phase failure path', 'measurement phases:', 'tools/measure-phases.mjs', "  await phase('flicker scan', scan);", "  if (report.phases.some(p => !p.complete)) return false;\n  await phase('flicker scan', scan);");
tests.at(-1).checker = 'phase-checks.mjs';
change('Figma early tap clock', 'Figma clock:', 'stage.mjs', 'if (p < 0) return { at: 0, scroll: 0, video: 0, lifted: false, tap: null };', 'if (false) return { at: 0, scroll: 0, video: 0, lifted: false, tap: null };');
inject('R5 valid future action tag', 'R5: echo precedes source action music', 'editedVideo', "if (t >= 2 * PACE && t < 2.3 * PACE) P.push({ ...on('paper', 0.45, 0.20, 0.12, 0.12, { lift: 0.3 }), document: true, echo: 'music' });");
change('toolbar clearance undone', 'toolbar clearance:', 'stage.mjs', 'const designs = cols.map(([x, w]) => [x, 0.46, w, h])', 'const designs = cols.map(([x, w]) => [x, 0.459, w, h])');
change('R14 playback face undone', 'R14:', 'stage.mjs', "if (key !== 'id' && (!pc.deviceBody || pc.device !== i)) return false;", 'if (false) return false;');
change('fixed mark face undone', 'fixed marks:', 'stage.mjs', "if (key !== 'id' && (!pc.deviceBody || pc.device !== i)) return false;", 'if (false) return false;');
change('R15 old post disappearance', 'R15: postPhoto frame vanished before its own contact', 'stage.mjs', 'const filled = frameContact(s, drag, t, from, to, frame), placed = done(s, id, t), before = D.length;', "const filled = t >= 6.329 * PACE ? [['map', DOCK.map, ID.frame], ['photo', DOCK.photo, ID.photo], ['postPhoto', ID.photo, ID.post], ['mailPhoto', ID.photo, ID.mailPhoto]].some(([drag, from, to]) => frameContact(s, drag, t, from, to, frame)) : frameContact(s, drag, t, from, to, frame), placed = t >= 6.329 * PACE ? filled : done(s, id, t), before = D.length;");
change('R15 placement exception disabled', 'R15: photo plate disappeared without a same-frame replacement', 'tools/correction-checks.mjs', '&& !plates.length && !replacement)', '&& !plates.length && true)');
change('0.6 s content frozen rail still plays', 'Figma motion:', 'stage.mjs', 'const state = prototypeState(p), suffix', 'const state = prototypeState(-1), suffix');
change('Figma return boundary undone', 'Figma return:', 'stage.mjs', 'const at = p >= 1 ? 3 : ((p * 3) % 3 + 3) % 3;', 'const at = ((p * 3) % 3 + 3) % 3;');
change('report path sanitizing undone', 'report paths:', 'tools/measure-phases.mjs', 'const message = String(error?.message ?? error);', 'return error.stack || String(error);\n  const message = String(error?.message ?? error);');
tests.at(-1).checker = 'phase-checks.mjs';
const results = [];
if (process.argv.includes('--audit')) {
  for (const test of tests) {
    const matches = files[test.file].replace(/\r\n/g, '\n').split(test.before).length - 1;
    console.log(test.name + ': ' + matches + ' match');
    if (matches !== 1) process.exitCode = 1;
  }
  process.exit(process.exitCode || 0);
}
try {
  for (const test of tests.filter(test => !process.argv[2] || test.name.includes(process.argv[2]))) {
    const original = files[test.file];
    const normalized = original.replace(/\r\n/g, '\n'), matches = normalized.split(test.before).length - 1;
    if (matches !== 1) throw new Error('Control must match exactly one place (' + matches + '): ' + test.name);
    const mutated = normalized.replace(test.before, test.after);
    fs.writeFileSync(path.join(take, test.file), mutated);
    let result;
    try { result = spawnSync(process.execPath, [path.join(take, 'tools', test.checker || 'checks.mjs'), '--control'], { cwd: root, encoding: 'utf8', timeout: 90000, windowsHide: true }); }
    finally { fs.writeFileSync(path.join(take, test.file), original); }
    const output = (result.stdout || '') + (result.stderr || ''), caught = result.status === 1 && output.includes(test.rule);
    const evidence = { ...test, matches, status: result.status, caught, output };
    results.push(evidence); fs.writeFileSync(path.join(out, test.name.replace(/[^a-z0-9]+/gi, '-') + '.txt'), JSON.stringify(evidence, null, 2));
    console.log(test.name + ': ' + (caught ? 'caught' : 'MISSED') + ' (exit ' + result.status + ')');
  }
} finally {
  for (const [file, source] of Object.entries(files)) fs.writeFileSync(path.join(take, file), source);
}
// Exact edits and failures go into BUILD.md. No results.json is written into the repository.
if (results.some(r => !r.caught)) process.exitCode = 1;
