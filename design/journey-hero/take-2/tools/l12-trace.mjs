// Local Edge/CDP performance evidence, without screenshots or third-party tools.
import fs from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { previewMarkup } from './preview.mjs';

const take = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tag = process.argv[2] || 'before';
if (!/^[a-z0-9-]+$/.test(tag)) throw new Error('plain run name required');
const out = path.join(take, '.scratch/review-out/r19', 'l12-' + tag);
await fs.mkdir(out, { recursive: true });
const preview = path.join(out, 'preview.html');
const sourcePreview = process.argv[3] && path.resolve(process.argv[3]);
if (sourcePreview && !sourcePreview.startsWith(path.join(take, '.scratch') + path.sep)) throw new Error('saved preview must be inside .scratch');
await fs.writeFile(preview, sourcePreview ? await fs.readFile(sourcePreview, 'utf8') : '<!doctype html>\n' + previewMarkup());
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const profile = path.join(out, 'edge-profile');
const child = spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', [
  '--headless=new', '--remote-debugging-port=0', '--remote-debugging-address=127.0.0.1',
  '--user-data-dir=' + profile, '--no-first-run', '--no-default-browser-check',
  '--disable-background-networking', '--disable-component-update', '--disable-sync',
  '--disable-extensions', '--metrics-recording-only', '--no-proxy-server',
  '--disable-renderer-backgrounding', '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows', 'about:blank',
], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
let stderr = ''; child.stderr.on('data', b => { stderr += b; });
let socket, session, id = 0;
const pending = new Map(), handlers = new Map();
function command(method, params = {}, target = session) {
  return new Promise((resolve, reject) => {
    const key = ++id, timer = setTimeout(() => { pending.delete(key); reject(new Error(method + ' timeout')); }, 60000);
    pending.set(key, { resolve, reject, timer });
    socket.send(JSON.stringify({ id: key, method, params, ...(target ? { sessionId: target } : {}) }));
  });
}
async function evaluate(expression) {
  const r = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
}
function on(method, fn) { handlers.set(method, fn); }
const instrument = `(${function () {
  const p = window.__perf = { frames: [], marks: {}, contexts: [], errors: [], phase: 'load' };
  addEventListener('error', e => p.errors.push(e.message));
  const original = HTMLCanvasElement.prototype.getContext, contexts = [];
  p.glErrors = () => contexts.map(gl => gl.getError());
  HTMLCanvasElement.prototype.getContext = function (...args) {
    const ctx = original.apply(this, args);
    if (args[0] === 'webgl2' && ctx) {
      contexts.push(ctx);
      const ext = ctx.getExtension('WEBGL_debug_renderer_info');
      p.contexts.push({ renderer: ext && ctx.getParameter(ext.UNMASKED_RENDERER_WEBGL), vendor: ext && ctx.getParameter(ext.UNMASKED_VENDOR_WEBGL), attributes: ctx.getContextAttributes() });
    }
    return ctx;
  };
  let landing = null, resolveLoad, resolveEntrance;
  p.loadDone = new Promise(r => { resolveLoad = r; });
  p.entranceDone = new Promise(r => { resolveEntrance = r; });
  const mark = key => { if (!(key in p.marks)) { p.marks[key] = performance.now(); console.timeStamp('L12:' + key); } };
  function frame(stamp) {
    const now = performance.now();
    p.frames.push({ stamp, now, phase: p.phase });
    if (p.frames.length === 1) mark('first-frame');
    if (window.__ready) mark('ready');
    if (window.__loaderStars?.mode) p.loaderMode = window.__loaderStars.mode;
    if (window.__hero && !window.__hero.loading) { mark('landing'); landing ??= now; }
    if (landing !== null && now - landing >= 2000) { mark('load-end'); resolveLoad(); }
    if (landing !== null && window.__hero.entering === null) { mark('entrance-end'); resolveEntrance(); }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}.toString()})()`;
const results = [];
try {
  let portInfo;
  for (let i = 0; i < 100; i++) {
    try { portInfo = (await fs.readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).trim().split(/\r?\n/); break; } catch { await sleep(100); }
  }
  if (!portInfo) throw new Error('Edge did not expose CDP: ' + stderr.slice(-2000));
  socket = new WebSocket('ws://127.0.0.1:' + portInfo[0] + portInfo[1]);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  socket.onmessage = ({ data }) => {
    const msg = JSON.parse(data);
    if (msg.id) {
      const q = pending.get(msg.id); if (!q) return;
      clearTimeout(q.timer); pending.delete(msg.id);
      if (msg.error) q.reject(new Error(JSON.stringify(msg.error))); else q.resolve(msg.result);
    } else handlers.get(msg.method)?.(msg.params, msg.sessionId);
  };
  const version = await command('Browser.getVersion', {}, null);
  const gpu = await command('SystemInfo.getInfo', {}, null);
  await fs.writeFile(path.join(out, 'system.json'), JSON.stringify({ version, gpu }, null, 2));
  for (const [W, H, mobile] of [[1440, 900, false], [412, 730, true]]) {
    const label = W + 'x' + H;
    const target = await command('Target.createTarget', { url: 'about:blank' }, null);
    session = (await command('Target.attachToTarget', { targetId: target.targetId, flatten: true }, null)).sessionId;
    await command('Page.enable'); await command('Runtime.enable');
    const workerSessions = [];
    on('Target.attachedToTarget', async p => {
      if (p.targetInfo.type !== 'worker') return;
      workerSessions.push(p.sessionId);
      await command('Profiler.enable', {}, p.sessionId);
      await command('Profiler.setSamplingInterval', { interval: 1000 }, p.sessionId);
      await command('Profiler.start', {}, p.sessionId);
    });
    await command('Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: false, flatten: true });
    await command('Profiler.enable');
    await command('Profiler.setSamplingInterval', { interval: 1000 });
    await command('Profiler.start');
    await command('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile });
    await command('Emulation.setTouchEmulationEnabled', { enabled: mobile, maxTouchPoints: mobile ? 5 : 1 });
    // Deny external requests even if a future preview accidentally introduces one.
    await command('Fetch.enable', { patterns: [{ urlPattern: 'http://*' }, { urlPattern: 'https://*' }] });
    on('Fetch.requestPaused', (p, s) => command('Fetch.failRequest', { requestId: p.requestId, errorReason: 'BlockedByClient' }, s));
    await command('Page.addScriptToEvaluateOnNewDocument', { source: instrument });
    const workerCpu = [];
    const trace = createWriteStream(path.join(out, label + '-trace.json'));
    trace.write('{"traceEvents":[');
    let eventCount = 0;
    on('Tracing.dataCollected', p => {
      if (p.value.length) trace.write((eventCount ? ',\n' : '\n') + p.value.map(e => JSON.stringify(e)).join(',\n'));
      eventCount += p.value.length;
    });
    let finish;
    const complete = new Promise(r => { finish = r; });
    on('Tracing.tracingComplete', finish);
    await command('Tracing.start', { categories: 'toplevel,devtools.timeline,disabled-by-default-devtools.timeline,disabled-by-default-devtools.timeline.frame,disabled-by-default-v8.cpu_profiler,v8.execute,gpu', options: 'record-as-much-as-possible', transferMode: 'ReportEvents' }, null);
    await command('Page.navigate', { url: pathToFileURL(preview).href });
    const workerSample = new Promise(resolve => setTimeout(async () => {
      for (const s of workerSessions) { try { workerCpu.push({ thread: 'worker', ...(await command('Profiler.stop', {}, s)) }); } catch {} }
      resolve();
    }, 4000));
    await sleep(200);
    await evaluate('window.__perf.loadDone');
    await evaluate('window.__perf.entranceDone');
    await sleep(150);
    const data = await evaluate('({ frames: __perf.frames, marks: __perf.marks, contexts: __perf.contexts, loaderMode: __perf.loaderMode, errors: __perf.errors, glErrors: __perf.glErrors(), dimensions: [innerWidth, innerHeight, devicePixelRatio], backing: [...document.querySelectorAll("canvas")].map(c => [c.width, c.height]) })');
    await workerSample;
    const cpu = [{ thread: 'main', ...(await command('Profiler.stop')) }, ...workerCpu];
    await fs.writeFile(path.join(out, label + '-cpu.json'), JSON.stringify(cpu));
    console.log(label + ' ending trace');
    await command('Tracing.end', {}, null); await complete;
    trace.end(']}'); await new Promise(r => trace.on('finish', r));
    await fs.writeFile(path.join(out, label + '-frames.json'), JSON.stringify(data, null, 2));
    results.push({ label, ...data, frames: data.frames.length, traceEvents: eventCount });
    console.log(JSON.stringify(results.at(-1)));
    await command('Target.closeTarget', { targetId: target.targetId }, null);
  }
  await fs.writeFile(path.join(out, 'summary.json'), JSON.stringify(results, null, 2));
} finally {
  if (socket?.readyState === WebSocket.OPEN) {
    try { await command('Browser.close', {}, null); } catch {}
    socket.close();
  }
  await Promise.race([new Promise(r => child.once('exit', r)), sleep(3000)]);
  if (child.exitCode === null) child.kill();
  await fs.writeFile(path.join(out, 'edge-stderr.txt'), stderr);
  for (const q of pending.values()) clearTimeout(q.timer);
}
