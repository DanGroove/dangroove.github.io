// Reversible source mutations against the real checker. No browser or measurement process is invoked.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const take = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), root = path.resolve(take, '../../..');
const files = Object.fromEntries(['stage.mjs', 'play.mjs', 'labels.mjs', 'tools/measure-phases.mjs'].map(n => [n, fs.readFileSync(path.join(take, n), 'utf8').replace(/\r\n/g, '\n')]));
const out = path.join(take, '.scratch', 'corrections2', 'controls'); fs.mkdirSync(out, { recursive: true });
const tests = [];
const change = (name, rule, file, before, after) => tests.push({ name, rule, file, before, after });
const inject = (name, rule, functionName, code) => change(name, rule, 'stage.mjs', `function ${functionName}(t) {\n  const P = [], D = [], s = SCRIPTS.${functionName === 'editedVideo' ? 'pr' : 'id'};`, `function ${functionName}(t) {\n  const P = [], D = [], s = SCRIPTS.${functionName === 'editedVideo' ? 'pr' : 'id'};\n  ${code}`);
change('R1 premature photo row', 'R1:', 'stage.mjs', 'if (!visible) return;\n      const echoStart', "if (!visible && !done(s, 'spreadType', t)) return;\n      const echoStart");
change('R2 premature page row', 'R2:', 'stage.mjs', 'if (!visible) return;\n      const echoStart', "if (!visible && !done(s, 'spreadType', t)) return;\n      const echoStart");
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
change('Figma canvas tags beside top bar', 'canvas clearance:', 'stage.mjs', 'r[1] + r[3] + 0.015', 'r[1] + r[3] + 0.035');
change('canvas pixel ceiling', 'pixel ceiling:', 'play.mjs', 'Math.min(2, devicePixelRatio || 1, Math.sqrt(5.2e6 / (W * H)))', 'Math.min(2, devicePixelRatio || 1)');
change('frame clearance A2 undone', 'frame clearance:', 'stage.mjs', 'const filled = [[', 'const filled = false && [[');
change('word side faces A5 undone', 'word side faces:', 'stage.mjs', "if (pc.art === 'wMake' || pc.art === 'wMove') pc.cut = true;", "if (pc.art === 'wMake' || pc.art === 'wMove') pc.cut = false;");
change('Figma canvas playback frozen', 'Figma motion:', 'stage.mjs', 'prototype(draw, i, clock, false);', 'prototype(draw, i, 0, false);');
change('Figma laptop playback frozen', 'Figma motion:', 'stage.mjs', 'prototype(lidPainter(pieces), 0, t < spans[0][1] ? -1 : clock);', 'prototype(lidPainter(pieces), 0, t < spans[0][1] ? -1 : 0);');
change('Figma lid clearance', 'laptop clearance:', 'stage.mjs', "...device(x, MAT.z, w, ROW, undefined, { rim: g.rim, round: 0.03 })[0], deviceBody: true", "...device(x, MAT.z, w, ROW, undefined, { rim: g.rim, round: 0.03 })[0], deviceBody: true, lid: i === 1");
change('Figma world centring', 'fig: footprint is not centred in world x', 'stage.mjs', 'left = screenMiddle - width / 2', 'left = screenMiddle + 0.1 - width / 2');
change('Figma tablet x drift', 'feed path:', 'stage.mjs', 'feed(P, pieces, t, ...spans[i]);\n    }', 'for (const pc of pieces) pc.p[0] += 0.1 * Math.sin(Math.PI * linear(t, ...spans[i]));\n      feed(P, pieces, t, ...spans[i]);\n    }');
change('photo registration', 'photo registration:', 'stage.mjs', "key === 'mail' ? ID.mailPhoto : rect, key + 'Image'", "key === 'mail' ? ID.mailPhoto : rect, 'kPhoto'");
change('label gutter framing', 'label layout:', 'labels.mjs', 'if (view.W >= 720) return view;', 'if (view.W >= 0) return view;');
change('R14 laptop wrong face', 'R14:', 'stage.mjs', "floor.find(pc => pc.lidPicture && pc.art === 'chromeLaptop')", "floor.filter(pc => pc.lidPicture).at(-1)");
change('Figma phone aspect', 'Figma device geometry:', 'stage.mjs', 'phoneW = (ROW - rim * 2) * 9 / 19.5 + rim * 2', 'phoneW = (ROW - rim * 2) * 9 / 18 + rim * 2');
change('measurement phase failure path', 'measurement phases:', 'tools/measure-phases.mjs', "  await phase('flicker scan', scan);", "  if (report.phases.some(p => !p.complete)) return false;\n  await phase('flicker scan', scan);");
tests.at(-1).checker = 'phase-checks.mjs';
change('Figma early tap clock', 'Figma clock:', 'stage.mjs', 'if (p < 0) return { at: 0, scroll: 0, video: 0, lifted: false, tap: null };', 'if (false) return { at: 0, scroll: 0, video: 0, lifted: false, tap: null };');
const results = [];
try {
  for (const test of tests.filter(test => !process.argv[2] || test.name.includes(process.argv[2]))) {
    const original = files[test.file];
    if (!original.includes(test.before)) throw new Error('Control source not found: ' + test.name);
    const mutated = original.replace(test.before, test.after);
    fs.writeFileSync(path.join(take, test.file), mutated);
    let result;
    try { result = spawnSync(process.execPath, [path.join(take, 'tools', test.checker || 'checks.mjs'), '--control'], { cwd: root, encoding: 'utf8', timeout: 90000, windowsHide: true }); }
    finally { fs.writeFileSync(path.join(take, test.file), original); }
    const output = (result.stdout || '') + (result.stderr || ''), caught = result.status === 1 && output.includes(test.rule);
    const evidence = { ...test, status: result.status, caught, output };
    results.push(evidence); fs.writeFileSync(path.join(out, test.name.replace(/[^a-z0-9]+/gi, '-') + '.json'), JSON.stringify(evidence, null, 2));
    console.log(test.name + ': ' + (caught ? 'caught' : 'MISSED') + ' (exit ' + result.status + ')');
  }
} finally {
  for (const [file, source] of Object.entries(files)) fs.writeFileSync(path.join(take, file), source);
}
const prior = process.argv[2] && fs.existsSync(path.join(out, 'results.json')) ? JSON.parse(fs.readFileSync(path.join(out, 'results.json'), 'utf8')) : [];
fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify([...prior.filter(p => !results.some(r => r.name === p.name)), ...results], null, 2));
if (results.some(r => !r.caught)) process.exitCode = 1;
