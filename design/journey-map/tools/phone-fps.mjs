// Glide frame times on a real Android phone's Chrome, driven from the PC over adb and the DevTools protocol.
// Run from design/journey-map on Dan's PC (Node 22+, built-in WebSocket; nothing to install):
//   node tools/phone-fps.mjs --adb D:\android\platform-tools\adb.exe --serial 10.0.0.178:44099 \
//     --page be=<path to be25990's journey-map.html> --page new=dist/journey-map.html --beats hmc1,mohawk --runs 4 --out <folder>
// What it does: serves the pages from 127.0.0.1:<port> (adb reverse, so the phone opens http://localhost:<port>/...),
// forwards Chrome's DevTools socket to tcp:9222, and for each run (builds alternate) opens ?beat=<stop>, waits for the
// page to settle, records requestAnimationFrame times, presses Next (a click at the button's centre, see click below), and
// keeps recording for --window ms. It works in a Chrome tab of its own (never one of the person's tabs) and closes it,
// then removes the forward and the reverse at the end, also after an error. On Dan's Samsung in Adaptive mode Chrome
// runs at 60 Hz with no finger down (a tap does not lift it), so a Next-tap glide tops out at 60 fps there.
// --no-adb skips adb (for a desktop Chrome started with --remote-debugging-port=9222).
// --variants <file.json> serves named pages with small text swaps applied (see VARIANTS below), for A/B tests on one build.
// --click script|mouse picks how a press is made: script (a click event on the element, the phone's default) or mouse
// (a DevTools mouse click, the default with --no-adb).
// --trace also records a Chrome trace of each row's window (trace-<build>-<beat>-<run>.json.gz, opens in DevTools'
// Performance panel or ui.perfetto.dev) and adds a summary to the row's file: main-thread tasks over 8 ms with what
// fills them, and the busiest work on each thread (main, compositor, raster, GPU, Viz).
// --js (with --trace) adds V8's sampling profiler to the trace, so tools/trace-js.mjs can name the page functions that
// took the main thread's time in any stretch of the window (part 17d).
// A beat written press:<craft> (for example press:screen) measures a compass press instead of a glide: it opens ?beat=map,
// clicks the compass marker, waits for the compass to open, then records while it clicks that craft's word.
import { spawn, spawnSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import {Readable} from 'node:stream';
import {pipeline} from 'node:stream/promises';

const args = process.argv.slice(2), opt = { page: [] };
for (let i = 0; i < args.length; i++) {
  const k = args[i].replace(/^--/, '');
  if (k === 'no-adb') opt.noAdb = true; else if (k === 'touch') opt.touch = true; else if (k === 'unthrottled') opt.unthrottled = true; else if (k === 'trace') opt.trace = true; else if (k === 'js') opt.js = true; else if (k === 'page') opt.page.push(args[++i]); else opt[k] = args[++i];
}
if (opt.launch) opt.noAdb = true;
const ADB = opt.adb, SERIAL = opt.serial, PORT = +(opt.port || 8765), DEV = +(opt.devtools || 9222);
// Gestures: fingers (DevTools touch events) on the phone or with --touch, the mouse and wheel on a desktop Chrome.
const DESKTOP = !!opt.noAdb && !opt.touch;
const BEATS = (opt.beats || 'hmc1,mohawk').split(','), RUNS = +(opt.runs || 4), SETTLE = +(opt.settle || 9000), WINDOW = +(opt.window || 4500);
const OUT = opt.out || path.resolve('phone-fps-out'), CLICK = opt.click || (opt.noAdb ? 'mouse' : 'script');
const SERVED = opt.page.map(s => { const i = s.indexOf('='); return { name: s.slice(0, i), file: path.resolve(s.slice(i + 1)) }; });
const PAGES = SERVED.filter(p => !p.name.endsWith('-joined')).map(p => ({ ...p, joined: SERVED.find(q => q.name === p.name + '-joined')?.name || null }));
if (!PAGES.length || (!opt.noAdb && (!ADB || !SERIAL))) { console.error('usage: --adb <adb.exe> --serial <ip:port> --page name=file [--page ...] [--beats a,b] [--runs n] [--out dir]'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });
const note = s => { const line = new Date().toISOString().slice(11, 19) + 'Z ' + s; console.log(line); fs.appendFileSync(path.join(OUT, 'log.txt'), line + '\n'); };
const adb = (...a) => { const r = spawnSync(ADB, ['-s', SERIAL, ...a], { encoding: 'utf8', timeout: 20000 }); if (r.status !== 0) throw new Error('adb ' + a.join(' ') + ': ' + (r.stderr || r.stdout || r.error)); return r.stdout.trim(); };
const sleep = ms => new Promise(r => setTimeout(r, ms));

// --variants <file.json>: {"<page name>": [["exact old text", "new text"], ...]}. That page is served with each swap applied, so
// small source changes can be A/B tested on one packed build without new files; each old text must occur exactly once in
// the page's file, or the run stops before it starts.
const VARIANTS = opt.variants ? JSON.parse(fs.readFileSync(opt.variants, 'utf8')) : {};
const VARIANT_TEXT = new Map();
for (const [name, swaps] of Object.entries(VARIANTS)) {
  const p = SERVED.find(q => q.name === name);
  if (!p) { console.error(`--variants names page ${name}, which no --page gives`); process.exit(2); }
  let text = fs.readFileSync(p.file, 'utf8');
  for (const [from, to] of swaps) {
    const n = text.split(from).length - 1;
    if (n !== 1) { console.error(`--variants ${name}: ${JSON.stringify(from.slice(0, 80))} occurs ${n} times in ${p.file}, not once`); process.exit(2); }
    text = text.replace(from, () => to);
  }
  VARIANT_TEXT.set(name, text);
}
// Static server for the pages only (127.0.0.1, read-only, the listed files and nothing else).
const server = http.createServer((req, res) => {
  const name = decodeURIComponent((req.url || '/').split('?')[0]).replace(/^\/+/, '').replace(/\.html$/, '');
  if (name === 'blank') { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end('<!doctype html><title>phone-fps</title>'); return; }
  const p = SERVED.find(q => q.name === name);
  if (!p) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
  if (VARIANT_TEXT.has(name)) res.end(VARIANT_TEXT.get(name)); else fs.createReadStream(p.file).pipe(res);
});

let cdp = null, id = 0, ownTab = null, browser = null, profile = null; const waiters = new Map(), events = [];
const send = (method, params = {}) => new Promise((resolve, reject) => { const n = ++id; waiters.set(n, { resolve, reject }); cdp.send(JSON.stringify({ id: n, method, params })); });
const evaluate = async expr => { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error('page: ' + JSON.stringify(r.exceptionDetails).slice(0, 300)); return r.result.value; };
const waitEvent = (method, ms) => new Promise((resolve, reject) => { const t0 = Date.now(); const tick = () => { const i = events.findIndex(e => e.method === method); if (i >= 0) { resolve(events.splice(i, 1)[0]); return; } if (Date.now() - t0 > ms) { reject(new Error('timeout ' + method)); return; } setTimeout(tick, 50); }; tick(); });

async function connect() {
  const blank = `http://localhost:${PORT}/blank?t=${Date.now()}`; let page = null;
  const list = async () => { try { return await (await fetch(`http://127.0.0.1:${DEV}/json/list`, { signal: AbortSignal.timeout(3000) })).json(); } catch (e) { return null; } };
  if (!opt.noAdb) {
    // Never drive a tab the person has open: a VIEW intent opens a tab of our own (closed again at the end) and brings
    // Chrome to the front with it. Behind another app (phone-p23: the home screen) Android freezes Chrome, so its DevTools
    // socket does not answer, a tab made through /json/new stays hidden and requestAnimationFrame never runs.
    adb('shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', blank, 'com.android.chrome');
    for (let i = 0; i < 30 && !page; i++) { await sleep(500); page = (await list())?.find(t => t.type === 'page' && t.url === blank) || null; }
    if (!page) throw new Error('Chrome did not open our tab within 15 s (is the phone unlocked with the screen on?)');
  } else {
    if (!await list()) throw new Error('no DevTools at 127.0.0.1:' + DEV + ' (start Chrome with --remote-debugging-port)');
    try { const r = await fetch(`http://127.0.0.1:${DEV}/json/new?${blank}`, { method: 'PUT', signal: AbortSignal.timeout(5000) }); if (r.ok) page = await r.json(); } catch (e) {}
  }
  if (!page?.webSocketDebuggerUrl) throw new Error('could not open a tab of our own');
  ownTab = page.id;
  try { await fetch(`http://127.0.0.1:${DEV}/json/activate/${page.id}`, { signal: AbortSignal.timeout(3000) }); } catch (e) {}
  note('DevTools target (own tab): ' + page.id + ' ' + page.url);
  cdp = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { cdp.onopen = resolve; cdp.onerror = e => reject(new Error('websocket: ' + (e.message || e.type))); });
  cdp.onmessage = m => { const d = JSON.parse(typeof m.data === 'string' ? m.data : m.data.toString()); if (d.id && waiters.has(d.id)) { const w = waiters.get(d.id); waiters.delete(d.id); d.error ? w.reject(new Error(d.error.message)) : w.resolve(d.result); } else if (d.method) events.push(d); };
  await send('Page.enable'); await send('Runtime.enable');
  try { await send('Page.bringToFront'); } catch (e) {}
  await sleep(1000);
  const vis = await evaluate('document.visibilityState');
  if (vis !== 'visible') throw new Error('our tab is not on screen (visibilityState ' + vis + '): is the phone unlocked with the screen on?');
  note('our tab is on screen; presses by ' + CLICK + ' click');
}

// Kinds of beat (--beats takes any mix, comma separated):
//   <stop>            Next at that beat (top, map, laurier, hmc1, mohawk, hmc2, interkom, lennard, x, end; end enters explore)
//   back:<stop>       Back at that beat
//   press:<craft>     the compass: opens ?beat=map, presses the compass marker, then records while it presses the craft's word
//   find:<id>         presses a find from the map beat (its marker when it has one) and records the camera move, then
//                     records a second row, use:<id>, for one press on the find itself (wayfinder has press:<craft> instead)
//   jump:<from>-<to>  presses the minimap's <to> stop at <from>
//   swipe:<stop>      a one-finger swipe up at that beat (swipe:top scrolls from the top towards the map)
//   hero              a one-finger swipe up on the joined page's hero (needs --page <name>-joined=<file> for each build)
//   explore:pan       enters explore (Next at end), then a one-finger drag
//   explore:zoom      enters explore, then a two-finger pinch out
//   explore:pinch     enters explore, then pinches in and out eight times (centre, near the corners, slow and fast) over
//                     a 14 s window: Chrome's own synthetic pinch on the phone, a trackpad pinch (Ctrl + wheel) on a desktop
//   explore:wheel     enters explore, then wheels in and out four times (desktop)
//   pinch:<stop>      eight pinches in and out on the map at a stop of the journey, where the page lets the browser zoom
//                     (phone only); the fingers start on the open map above the card, below nothing else
//   pinchcard:<stop>  the same eight pinches with the fingers starting on the stop's card (phone only)
// A press or gesture that does not take effect no longer stops the run: its row says ok false and why, and the summary
// lists it. Fingers are DevTools touch events, which make pointer and touch events but no click on the phone (phone-p21).
const STOP_IDS = ['laurier', 'hmc1', 'mohawk', 'hmc2', 'interkom', 'lennard'];
const STATE = `(() => { const m = document.getElementById('map'), c = document.getElementById('cam'); return { P: +window.__jm.P.toFixed(1), moving: !!window.__jm.moving, focus: window.__jm.focus, cls: document.documentElement.className, cam: (c && c.getAttribute('transform') || '') + '|' + (m ? getComputedStyle(m).transform : ''), ui: (document.querySelector('.sheet.on') ? 'sheet ' : '') + (document.querySelector('.pop.on') ? 'pop' : ''), y: Math.round(scrollY), vv: +(window.__vvmax || 1).toFixed(2) }; })()`;
const touch = (type, pts) => send('Input.dispatchTouchEvent', { type, touchPoints: pts.map(([x, y], i) => ({ x: Math.round(x), y: Math.round(y), id: i + 1, radiusX: 3, radiusY: 3, force: 1 })) });
async function fingers(from, to, ms) {
  const n = Math.max(3, Math.round(ms / 16));
  await touch('touchStart', from);
  for (let k = 1; k <= n; k++) { await touch('touchMove', from.map((f, i) => [f[0] + (to[i][0] - f[0]) * k / n, f[1] + (to[i][1] - f[1]) * k / n])); await sleep(16); }
  await touch('touchEnd', []);
}

const mouse = (type, [x, y], buttons = 0) => send('Input.dispatchMouseEvent', { type, x: Math.round(x), y: Math.round(y), button: type === 'mouseMoved' && !buttons ? 'none' : 'left', buttons, clickCount: type === 'mouseMoved' ? 0 : 1 });
async function mouseDrag(from, to, ms) {
  const n = Math.max(3, Math.round(ms / 16));
  await mouse('mouseMoved', from); await mouse('mousePressed', from, 1);
  for (let k = 1; k <= n; k++) { await mouse('mouseMoved', [from[0] + (to[0] - from[0]) * k / n, from[1] + (to[1] - from[1]) * k / n], 1); await sleep(16); }
  await mouse('mouseReleased', to);
}
async function wheel([x, y], deltaY, n) { for (let k = 0; k < n; k++) { await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: Math.round(x), y: Math.round(y), deltaX: 0, deltaY }); await sleep(50); } }
// Pinches (Dan, 2026-11-27: "make sure you are zooming in and out with pinches, that's where i saw the most flashing and
// lag"): [x share, y share, scale, finger speed px/s]. In and out at the centre, near two corners, then fast; they end
// where they started (the scales multiply to 1).
const PINCHES = [[.5, .45, 2.5, 800], [.5, .45, .4, 800], [.3, .3, 2, 1400], [.3, .3, .5, 1400], [.7, .62, 2, 400], [.7, .62, .5, 400], [.5, .45, 3, 2000], [.5, .45, 1 / 3, 2000]];
async function pinch(x, y, scale, speed) {
  // x and y are screen points. DevTools multiplies the anchor by the browser zoom before it checks it is on screen
  // (phone-p24-pinch: "Position out of bounds" at a stop once the page had zoomed), so they are divided by it first.
  if (!DESKTOP) { const z = +(await evaluate('window.visualViewport ? visualViewport.scale : 1')) || 1; return send('Input.synthesizePinchGesture', { x: Math.round(x / z), y: Math.round(y / z), scaleFactor: scale, relativeSpeed: speed, gestureSourceType: 'touch' }); }
  const n = Math.max(3, Math.round(Math.abs(Math.log(scale)) / 0.05)), deltaY = scale > 1 ? -10 : 10;
  for (let k = 0; k < n; k++) { await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: Math.round(x), y: Math.round(y), deltaX: 0, deltaY, modifiers: 2 }); await sleep(Math.round(16 * 800 / speed)); }
}
async function pinches(W, H, list = PINCHES.map(([fx, fy, s, sp]) => [W * fx, H * fy, s, sp])) {
  await evaluate(`(() => { window.__vvmax = 1; if (window.visualViewport && !window.__vvOn) { window.__vvOn = true; visualViewport.addEventListener('resize', () => { window.__vvmax = Math.max(window.__vvmax || 1, visualViewport.scale); }); } return true; })()`);
  for (const [x, y, s, sp] of list) { await pinch(x, y, s, sp); await sleep(250); }
}
// Stop pinches (Dan: "on the map, not the cards", then "also the cards ... my point is just to be thorough"). Chrome's
// synthetic pinch puts both fingers on a vertical line through the anchor: a pinch in starts them about PINCH_REACH px
// each side of it (Android's smallest scaling span), a pinch out about PINCH_REACH / scale + PINCH_SLOP px each side.
// Each pair zooms in and back out at one anchor, so the next pair starts unzoomed; the pinch out is as wide as the box allows.
const PINCH_REACH = 90, PINCH_SLOP = 8;
function boxPinches([l, t, r, b]) {
  const half = (b - t) / 2 - 12, cy = (t + b) / 2, out = Math.max(.5, Math.min(.8, PINCH_REACH / Math.max(1, half - PINCH_SLOP)));
  return [[.5, 800], [.3, 1400], [.7, 400], [.5, 2000]].flatMap(([fx, sp]) => { const x = l + (r - l) * fx; return [[x, cy, +(1 / out).toFixed(3), sp], [x, cy, +out.toFixed(3), sp]]; });
}
// The box the fingers start in: the open map between the review strip and the stop's card (or the bar when there is no
// card), or the card.
const PINCH_BOX = where => `(() => { const R = e => e && e.getBoundingClientRect(), id = ${JSON.stringify(where.stop)}, card = R(document.getElementById('stop-' + id)?.querySelector('.c-card')), tl = R(document.querySelector('.tl')), go = R(document.getElementById('go')), rv = R(document.querySelector('.jm-review'));
  const bar = Math.min(tl ? tl.top : innerHeight, go ? go.top : innerHeight), open = card && card.height > 0 && card.top < bar, top = rv && rv.height && rv.bottom < bar / 2 ? rv.bottom : 0;
  const box = ${where.card ? 'open ? [card.left, card.top, card.right, Math.min(card.bottom, bar)] : null' : '[0, top, innerWidth, open ? Math.min(card.top, bar) : bar]'};
  if (!box) return null;
  const at = (x, y) => { const e = document.elementFromPoint(x, y); return !e ? 'nothing' : e.closest('.c-card') ? 'card' : e.closest('.tl,#go') ? 'bar' : e.closest('.jm-review') ? 'review bar' : e.closest('#map,#map-base,.stage') ? 'map' : e.tagName.toLowerCase(); };
  const cy = (box[1] + box[3]) / 2, half = (box[3] - box[1]) / 2 - 12, out = Math.max(.5, Math.min(.8, ${PINCH_REACH} / Math.max(1, half - ${PINCH_SLOP}))), d = ${PINCH_REACH} / out + ${PINCH_SLOP};
  return { box: box.map(Math.round), fingersOut: [at(innerWidth / 2, cy - d), at(innerWidth / 2, cy + d)], fingersIn: [at(innerWidth / 2, cy - ${PINCH_REACH}), at(innerWidth / 2, cy + ${PINCH_REACH})] }; })()`;

// Tracing for --trace: events arrive as Tracing.dataCollected while the window records.
const TRACE_CATS = ['toplevel', 'devtools.timeline', 'disabled-by-default-devtools.timeline', 'disabled-by-default-devtools.timeline.frame', 'blink', 'cc', 'gpu', 'viz', 'v8.execute', 'blink.rendering', 'benchmark'].concat(opt.js ? ['disabled-by-default-v8.cpu_profiler'] : []);
async function traceStart() { for (let i = events.length - 1; i >= 0; i--) if (/^Tracing\./.test(events[i].method)) events.splice(i, 1); await send('Tracing.start', { traceConfig: { includedCategories: TRACE_CATS, recordMode: 'recordAsMuchAsPossible' }, transferMode: 'ReportEvents' }); }
async function traceEnd() {
  await send('Tracing.end'); await waitEvent('Tracing.tracingComplete', 120000);
  const out = []; for (let i = 0; i < events.length; i++) if (events[i].method === 'Tracing.dataCollected') out.push(...events[i].params.value);
  for (let i = events.length - 1; i >= 0; i--) if (/^Tracing\./.test(events[i].method)) events.splice(i, 1);
  return out;
}
// COMB-T, 2026-11-27: bound each serialized piece; pinch traces may exceed V8's one-string limit.
async function saveTrace(file,ev){
  async function* pieces(){yield '{"traceEvents":[\n';for(let at=0;at<ev.length;at+=1000){yield (at?',\n':'')+ev.slice(at,at+1000).map(e=>JSON.stringify(e)).join(',\n');}yield '\n]}';}
  await pipeline(Readable.from(pieces()),zlib.createGzip(),fs.createWriteStream(file));
}
// Summary of a trace from the press on: main-thread tasks over 8 ms and self time by event on each thread group.
function traceSummary(ev, windowMs) {
  const names = {}, procs = {}; for (const e of ev) if (e.ph === 'M') { if (e.name === 'thread_name') names[e.pid + ':' + e.tid] = e.args.name; if (e.name === 'process_name') procs[e.pid] = e.args.name; }
  const press = ev.filter(e => e.name === 'EventDispatch' && e.args?.data?.type === 'click').sort((a, b) => a.ts - b.ts)[0];
  const mains = Object.keys(names).filter(k => names[k] === 'CrRendererMain'), count = k => ev.reduce((n, e) => n + (e.pid + ':' + e.tid === k ? 1 : 0), 0);
  const main = press ? press.pid + ':' + press.tid : mains.sort((a, b) => count(b) - count(a))[0];
  // A gesture beat has no click: its window starts at the first animation frame on the main thread, as in trace-hitches.
  // A loop, not Math.min(...all), since a 25 MB trace has too many events to spread (Maximum call stack size exceeded).
  let first = Infinity, firstRaf = Infinity; if (!press) for (const e of ev) { if (e.ts > 0 && e.ts < first) first = e.ts;
    if (e.name === 'FireAnimationFrame' && e.pid + ':' + e.tid === main && e.ts < firstRaf) firstRaf = e.ts; }
  const t0 = press ? press.ts : firstRaf < Infinity ? firstRaf : first, t1 = t0 + windowMs * 1e3;
  const spans = ev.filter(e => e.ph === 'X' && e.dur != null && e.ts >= t0 && e.ts + e.dur <= t1);
  const group = k => k === main ? 'main' : /^Compositor$/.test(names[k]) && k.split(':')[0] === main.split(':')[0] ? 'compositor' : /CompositorTileWorker|RasterWorker/.test(names[k] || '') ? 'raster' : names[k] === 'CrGpuMain' ? 'gpu' : names[k] === 'VizCompositorThread' ? 'viz' : null;
  const self = {}, byThread = {}; for (const e of spans) { const k = e.pid + ':' + e.tid; (byThread[k] ||= []).push(e); }
  for (const [k, list] of Object.entries(byThread)) { const g = group(k); if (!g) continue; list.sort((a, b) => a.ts - b.ts || b.dur - a.dur); const st = [];
    for (const e of list) { while (st.length && st[st.length - 1].ts + st[st.length - 1].dur <= e.ts) st.pop(); if (st.length) st[st.length - 1].child = (st[st.length - 1].child || 0) + e.dur; st.push(e); }
    const o = self[g] ||= {}; for (const e of list) o[e.name] = (o[e.name] || 0) + e.dur - (e.child || 0); }
  const top = (o, n) => Object.entries(o || {}).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => [k, +(v / 1000).toFixed(1)]);
  const threads = {}; for (const g of ['main', 'compositor', 'raster', 'gpu', 'viz']) if (self[g]) threads[g] = { total: +(Object.values(self[g]).reduce((a, b) => a + b, 0) / 1000).toFixed(0), top: top(self[g], 8) };
  const mainSpans = byThread[main] || [], wrap = /^(ThreadControllerImpl::RunTask|RunTask|ThreadPool_RunTask|SequenceManager.*)$/;
  const tasks = mainSpans.filter(e => (e.name === 'ThreadControllerImpl::RunTask' || e.name === 'RunTask') && e.dur > 8e3).filter((e, i, a) => !a.some(o => o !== e && o.ts <= e.ts && o.ts + o.dur >= e.ts + e.dur && o.dur > e.dur))
    .map(t => { const inner = {}; for (const e of mainSpans) if (e !== t && e.ts >= t.ts && e.ts + e.dur <= t.ts + t.dur && !wrap.test(e.name)) inner[e.name] = Math.max(inner[e.name] || 0, e.dur); return { at: +((t.ts - t0) / 1000).toFixed(0), ms: +(t.dur / 1000).toFixed(1), inner: top(inner, 5) }; });
  // What repaints: Blink's Paint events by node (devtools.timeline), with their clip size in CSS px.
  const paints = {}; for (const e of mainSpans) if (e.name === 'Paint' && e.args?.data) { const d = e.args.data, q = d.clip || [], w = q.length >= 8 ? Math.round(Math.max(q[0], q[2], q[4], q[6]) - Math.min(q[0], q[2], q[4], q[6])) : 0, h = q.length >= 8 ? Math.round(Math.max(q[1], q[3], q[5], q[7]) - Math.min(q[1], q[3], q[5], q[7])) : 0, k = (d.nodeId ?? '?') + ' ' + w + 'x' + h; const o = paints[k] ||= { n: 0, ms: 0 }; o.n++; o.ms += e.dur / 1000; }
  const paintTop = Object.entries(paints).sort((a, b) => b[1].ms - a[1].ms).slice(0, 8).map(([k, v]) => [k, v.n, +v.ms.toFixed(1)]);
  return { pressFound: !!press, mainTasksOver8: tasks.length, longest: tasks.slice().sort((a, b) => b.ms - a.ms).slice(0, 12), threads, paints: paintTop };
}

async function oneRun(p, beat, run) {
  events.length = 0;
  const colon = beat.indexOf(':'), kind = colon < 0 ? (beat === 'hero' ? 'hero' : 'next') : beat.slice(0, colon), arg = (colon < 0 ? beat : beat.slice(colon + 1)).toLowerCase();
  const start = (kind==='rest'&&arg==='beacon'||kind==='press'&&arg==='pyre')?'interkom':{ next: arg, back: arg, press: 'map', rest: 'map', find: 'map', explore: 'end', visit: 'end', swipe: arg, hero: null, jump: arg.split('-')[0], pinch: arg, pinchcard: arg }[kind];
  if (start === undefined) throw new Error('unknown beat ' + beat);
  if (kind === 'hero' && !p.joined) { note(`skipped hero for ${p.name}: no --page ${p.name}-joined=<file>`); return []; }
  await send('Page.navigate', { url: kind === 'hero' ? `http://localhost:${PORT}/${p.joined}.html` : `http://localhost:${PORT}/${p.name}.html?beat=${start}` });
  await waitEvent('Page.loadEventFired', 30000); await sleep(SETTLE);
  const env = await evaluate(`({ rm: matchMedia('(prefers-reduced-motion: reduce)').matches, dpr: devicePixelRatio, w: innerWidth, h: innerHeight, jm: !!window.__jm, P: window.__jm && +window.__jm.P.toFixed(1) })`);
  if (env.rm) throw new Error('prefers-reduced-motion is on: turn off "Remove animations" on the phone and run again');
  if (!env.jm) throw new Error('the page has no journey (window.__jm) at ' + beat);
  const centre = find => evaluate(`(() => { const e = (${find})(); if (!e) return null; const r = e.getBoundingClientRect(); return r.width && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth ? [r.left + r.width / 2, r.top + r.height / 2] : null; })()`);
  // On the phone neither DevTools touch events (phone-p21) nor DevTools mouse clicks (phone-p23) made a click, so there
  // the press is a click event sent to the element at its centre, which runs the same handlers a tap ends in. Desktop
  // Chrome (--no-adb) keeps the DevTools mouse click unless --click script asks for the phone's way.
  const click = async (find, xy) => {
    if (CLICK === 'mouse') { for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: xy[0], y: xy[1], button: 'left', buttons: type === 'mousePressed' ? 1 : 0, clickCount: type === 'mouseMoved' ? 0 : 1 }); return; }
    await evaluate(`(() => { const e = (${find})(); e.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window, detail: 1, button: 0, clientX: ${xy[0]}, clientY: ${xy[1]} })); return true; })()`);
  };
  // When a button is not on screen the row says why: its box, hidden and style flags, the viewport and the journey's state.
  const why = find => evaluate(`(() => { const e = (${find})(); if (!e) return 'no such element'; const b = x => (r => [r.left, r.top, r.width, r.height].map(Math.round))(x.getBoundingClientRect()), s = getComputedStyle(e), J = window.__jm, go = document.getElementById('go'); return JSON.stringify({ box: b(e), hidden: e.hidden, display: s.display, visibility: s.visibility, opacity: s.opacity, view: [innerWidth, innerHeight, visualViewport ? Math.round(visualViewport.height) : null], P: J ? +J.P.toFixed(2) : null, moving: J ? J.moving : null, mode: J ? J.mode : null, go: go ? { box: b(go), hidden: go.hidden, inert: go.inert, cls: go.className } : null, cls: document.documentElement.className }); })()`);
  const press = async (find, what) => { const xy = await centre(find); if (!xy) throw new Error(what + ' is not on screen: ' + await why(find)); await click(find, xy); };
  const sel = q => `() => document.querySelector(${JSON.stringify(q)})`;
  const findWord = `() => [...document.querySelectorAll('.wf-word')].find(w => w.textContent.trim().toLowerCase().startsWith(${JSON.stringify(arg)}))`;
  const findEl = id => sel(id === 'hoards' ? '#f-hoard-hmc2' : '#f-' + id), findOpen = id => `() => document.querySelector('#mk-${id}') || (${findEl(id)})()`;
  const state = () => evaluate(STATE);
  const rows = [];
  const fail = (label, why) => { const row = { build: p.name, beat: label, run, ok: false, why, frames: 0, fps: null, p50: null, p90: null, p99: null, max: null, over25: null, overMed: null, Pbefore: env.P, Pafter: null, dpr: env.dpr, w: env.w, h: env.h }; note(JSON.stringify(row)); rows.push(row); return rows; };
  const wait = async (test, ms) => { const t = Date.now(); while (Date.now() - t < ms) { if (await evaluate(test)) return true; await sleep(150); } return false; };
  const measure = async (label, act, check, win = WINDOW) => {
    await evaluate(`(() => { const tok = (window.__pfTok || 0) + 1, t = []; window.__pfTok = tok; window.__pf = t; const f = n => { if (window.__pfTok !== tok) return; t.push(n); if (t.length < 4000) requestAnimationFrame(f); }; requestAnimationFrame(f); return true; })()`);
    await sleep(400);
    if (opt.trace) await traceStart();
    const before = await state(), t0 = await evaluate('performance.now()');
    let why = null;
    try { await act(); } catch (e) { why = e.message; }
    await sleep(400);
    let early = null;
    if (!why && check) early = check(before, await state());
    await sleep(Math.max(300, win - 100 - (await evaluate('performance.now()') - t0)));
    const r = await evaluate(`(() => { const t0 = ${t0}, t = window.__pf.filter(x => x > t0 && x < t0 + ${win}); return { t, s: ${STATE} }; })()`);
    let trace = null;
    if (opt.trace) { const ev = await traceEnd(), base = `trace-${p.name}-${label.replace(/[:>]/g, '-')}-${run}`; await saveTrace(path.join(OUT, base + '.json.gz'),ev); trace = traceSummary(ev, win); trace.file = base + '.json.gz';
      // Name the repainted nodes (tag#id.class) while the page is still open.
      for (const row of trace.paints) { const id = +row[0].split(' ')[0]; if (!Number.isFinite(id)) continue; try { const { node } = await send('DOM.describeNode', { backendNodeId: id }); const a = node.attributes || [], at = k => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : ''; }; row[0] = (node.localName || node.nodeName) + (at('id') ? '#' + at('id') : '') + (at('class') ? '.' + at('class').trim().split(/\s+/).slice(0, 2).join('.') : '') + ' ' + row[0].split(' ')[1]; } catch (e) {} } }
    // A check passes if it holds 400 ms after the press (a move under way) or at the end of the window (a late camera).
    if (!why && early) why = check(before, r.s);
    const d = r.t.slice(1).map((x, i) => x - r.t[i]).sort((a, b) => a - b), q = k => d.length ? +d[Math.min(d.length - 1, Math.floor(d.length * k))].toFixed(1) : null;
    const med = q(0.5) || 16.7, row = { build: p.name, beat: label, run, ok: !why, why, frames: r.t.length, fps: +(r.t.length / (win / 1000)).toFixed(1), window: win, p50: med, p90: q(0.9), p99: q(0.99), max: d.length ? +d.at(-1).toFixed(1) : null,
      over25: d.filter(x => x > 25).length, overMed: d.filter(x => x > 1.5 * med).length, Pbefore: before.P, Pafter: r.s.P, changed: r.s.cam !== before.cam || r.s.cls !== before.cls || r.s.P !== before.P || r.s.ui !== before.ui, dpr: env.dpr, w: env.w, h: env.h };
    fs.writeFileSync(path.join(OUT, `${p.name}-${label.replace(/[:>]/g, '-')}-${run}.json`), JSON.stringify({ row, frames: r.t, trace }, null, 0));
    note(JSON.stringify(row)); rows.push(row);
    if (trace) note('trace ' + JSON.stringify({ build: p.name, beat: label, run, tasksOver8: trace.mainTasksOver8, longest: trace.longest.slice(0, 4), threads: Object.fromEntries(Object.entries(trace.threads).map(([g, v]) => [g, [v.total, v.top.slice(0, 4)]])), paints: trace.paints.slice(0, 4) }));
  };
  const moved = (b, a) => a.moving || a.P !== b.P ? null : `no move (P still ${a.P})`;
  const anything = (b, a) => a.moving || a.P !== b.P || a.y !== b.y || a.cam !== b.cam || a.cls !== b.cls || a.ui !== b.ui ? null : 'nothing moved';
  const W = env.w, H = env.h;
  const setupBeacon=async()=>{for(let i=0;i<3;i++){await press(sel('#f-beacon .hit:not(.touch-hit)'),'the beacon');await sleep(1600);}await sleep(4000);return evaluate('window.__jm.finds.state("beacon").fire');};
  // COMB-S rest beats record a settled view with no input in the window.
  if(kind==='rest'){
    if(arg==='compass'){try{await press(findOpen('wayfinder'),'the compass marker');}catch(e){return fail(beat,e.message);}if(!await wait('window.__jm.focus === "wayfinder"',5000))return fail(beat,'the compass did not open');await sleep(3000);}
    else if(arg==='beacon'){const count=await setupBeacon();note('beacon setup '+p.name+' notes '+count+'/3');}
    else if(arg!=='map')throw new Error('unknown rest beat '+beat);
    await measure(beat,async()=>{},null);
  } else if (kind === 'next') await measure(beat, () => press(sel('.go-next'), 'Next'), arg === 'end' ? (b, a) => a.cls.includes('jm-explore') ? null : 'explore did not start' : moved);
  else if (kind === 'back') await measure(beat, () => press(sel('.go-back'), 'Back'), moved);
  else if (kind === 'jump') {
    const to = STOP_IDS.indexOf(arg.split('-')[1]); if (to < 0) throw new Error('unknown stop in ' + beat);
    await measure(beat, () => press(sel(`.mm-stop[data-i="${to}"]`), 'the minimap stop'), moved);
  } else if (kind === 'press') {
    try { await press(findOpen('wayfinder'), 'the compass marker'); } catch (e) { return fail(beat, e.message); }
    if (!await wait('window.__jm.focus === "wayfinder"', 5000)) return fail(beat, 'the compass did not open');
    await sleep(800);
    await measure(beat, () => press(findWord, 'the compass word ' + arg), (b, a) => a.cls.includes('jm-way') ? null : `${arg} was not picked`);
  } else if (kind === 'visit') {
    const i=STOP_IDS.indexOf(arg);if(i<0)throw new Error('unknown stop in '+beat);
    try{await press(sel('.go-next'),'Next at end');}catch(e){return fail(beat,e.message);}
    if(!await wait("document.documentElement.classList.contains('jm-explore')",4000))return fail(beat,'explore did not start');
    await sleep(6000);
    await measure(beat,()=>press(sel('#stop-'+arg+' .st-btn'),'visit '+arg),(b,a)=>a.cam!==b.cam||a.ui!==b.ui?null:'the shield visit did not open');
  } else if (kind === 'find') {
    await measure(beat, () => press(findOpen(arg), 'find ' + arg), (b, a) => a.moving || a.focus || a.cam !== b.cam ? null : 'the camera did not go to it');
    if (arg !== 'wayfinder' && rows.at(-1).ok) {
      await wait('!window.__jm.moving', 5000); await sleep(1200);
      await measure('use:' + arg, () => press(findEl(arg), 'find ' + arg), null);
    }
  } else if (kind === 'pinch' || kind === 'pinchcard') {
    if (DESKTOP) return fail(beat, kind + ':<stop> is for the phone (a desktop Ctrl + wheel would change the browser zoom of later rows)');
    const aim = await evaluate(PINCH_BOX({ stop: arg, card: kind === 'pinchcard' }));
    if (!aim) return fail(beat, 'no open card at ' + arg);
    note('aim ' + JSON.stringify({ beat, run, ...aim }));
    await measure(beat, () => pinches(W, H, boxPinches(aim.box)), (b, a) => a.vv > 1.2 ? null : `the page did not zoom (largest browser zoom ${a.vv})`, 14000);
  } else if (kind === 'swipe' || kind === 'hero') await measure(beat, () => DESKTOP ? wheel([W / 2, H / 2], 120, 5) : fingers([[W / 2, H * .72]], [[W / 2, H * .3]], 300), anything);
  else if (kind === 'explore') {
    try { await press(sel('.go-next'), 'Next at end'); } catch (e) { return fail(beat, e.message); }
    if (!await wait(`document.documentElement.classList.contains('jm-explore')`, 4000)) return fail(beat, 'explore did not start');
    await sleep(6000);
    // Start on open map: a finger or press that lands on a find, a button or a card is that thing's, not the map's.
    const spot = await evaluate(`(() => { const busy = e => !e || e.closest('.find, button, a, .go, .sheet, .pop, .c-card, #cards, .mini, .tl, .explore-hint, .ft'); for (const fy of [.5, .62, .38, .72, .28]) for (const fx of [.5, .65, .35, .78, .22]) { const x = innerWidth * fx, y = innerHeight * fy; if (!busy(document.elementFromPoint(x, y)) && !busy(document.elementFromPoint(x - 160, y - 120))) return [x, y]; } return [innerWidth / 2, innerHeight / 2]; })()`);
    const [x, y] = spot;
    // At the explore fit the whole map is on screen and bounded, so a drag only moves it once it is zoomed in.
    // On the real phone (phone-p23d) two DevTools touch points made no zoom, so there the pinch is Chrome's own synthetic
    // pinch, which goes through the touch pipeline like real fingers. Desktop touch emulation (--touch) keeps the two fingers.
    const zoomIn = () => DESKTOP ? wheel([x, y], -100, 6) : opt.noAdb ? fingers([[x - 40, y], [x + 40, y]], [[x - 150, y], [x + 150, y]], 500) : send('Input.synthesizePinchGesture', { x: Math.round(x), y: Math.round(y), scaleFactor: 3, relativeSpeed: 600, gestureSourceType: 'touch' });
    if (arg === 'pan') { await zoomIn(); await sleep(2500); }
    if (arg === 'pinch') await measure(beat, () => pinches(W, H), (b, a) => a.cam !== b.cam ? null : 'the map did not zoom', 14000);
    else if (arg === 'wheel') await measure(beat, async () => { for (const d of [-100, 100, -100, 100, -100, 100, -100, 100]) { await wheel([x, y], d, 6); await sleep(300); } }, (b, a) => a.cam !== b.cam ? null : 'the map did not zoom', 12000);
    else if (arg === 'zoom') await measure(beat, zoomIn, (b, a) => a.cam !== b.cam ? null : 'the map did not zoom');
    else await measure(beat, () => DESKTOP ? mouseDrag([x, y], [x - 160, y - 120], 600) : fingers([[x, y]], [[x - 160, y - 120]], 450), (b, a) => a.cam !== b.cam ? null : 'the map did not move');
  }
  return rows;
}

let ok = false;
try {
  await new Promise(r => server.listen(PORT, '127.0.0.1', r)); note(`serving ${PAGES.map(p => p.name).join(', ')} on 127.0.0.1:${PORT}`);
  for (const [name, swaps] of Object.entries(VARIANTS)) note(`variant ${name}: ${swaps.map(([a, b]) => JSON.stringify(a) + ' -> ' + JSON.stringify(b)).join('; ')}`);
  if (!opt.noAdb) {
    note('adb devices: ' + spawnSync(ADB, ['devices'], { encoding: 'utf8' }).stdout.replace(/\s+/g, ' '));
    adb('reverse', `tcp:${PORT}`, `tcp:${PORT}`); adb('forward', `tcp:${DEV}`, 'localabstract:chrome_devtools_remote');
    note('model ' + adb('shell', 'getprop', 'ro.product.model') + ', refresh ' + (adb('shell', 'dumpsys', 'display').match(/mRefreshRate=?\s*([\d.]+)/)?.[1] || '?'));
  }
  if (opt.launch) {
    // --launch <chrome.exe>: a headless Chrome of our own at Dan's screen (1920x950 CSS px at DPR 2 by default, --size and
    // --dpr change it; the page gets exactly that viewport), held to the display's rate like pc-p23 unless --unthrottled
    // (then frame times show each frame's own cost), with a fresh profile deleted at the end.
    const [w, h] = (opt.size || '1920x950').split('x').map(Number);
    profile = path.join(OUT, 'profile-' + Date.now());
    browser = spawn(opt.launch, ['--headless=new', `--remote-debugging-port=${DEV}`, '--remote-debugging-address=127.0.0.1', `--user-data-dir=${profile}`, `--window-size=${w},${h}`, `--force-device-scale-factor=${opt.dpr || 2}`, '--no-first-run', '--no-default-browser-check', ...(opt.unthrottled ? ['--disable-gpu-vsync', '--disable-frame-rate-limit'] : []), '--hide-scrollbars', ...(opt['chrome-args'] ? opt['chrome-args'].split(' ') : []), 'about:blank'], { stdio: 'ignore' });
    for (let i = 0; i < 60; i++) { try { await fetch(`http://127.0.0.1:${DEV}/json/version`, { signal: AbortSignal.timeout(1000) }); break; } catch (e) { await sleep(500); } }
    note('launched ' + opt.launch + ` at ${w}x${h}, DPR ${opt.dpr || 2}`);
  }
  await connect();
  if (opt.launch) { const [w, h] = (opt.size || '1920x950').split('x').map(Number); await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: +(opt.dpr || 2), mobile: false }); }
  const rows = [];
  if (opt.touch) await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  for (let run = 1; run <= RUNS; run++) for (const beat of BEATS) for (const p of (run % 2 ? PAGES : [...PAGES].reverse())) rows.push(...await oneRun(p, beat, run));
  const sum = {};
  for (const r of rows) { const k = r.build + ' ' + r.beat; (sum[k] ??= []).push(r); }
  const lines = ['| Build | Move, press or gesture | Runs done | fps (mean) | p50 ms | p90 ms | max ms | frames > 25 ms | frames > 1.5x p50 |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- |'];
  const mean = (a, k) => a.length ? +(a.reduce((s, r) => s + r[k], 0) / a.length).toFixed(1) : '-';
  for (const [k, all] of Object.entries(sum)) { const a = all.filter(r => r.ok); lines.push(`| ${k.split(' ')[0]} | ${k.split(' ')[1]} | ${a.length} of ${all.length} | ${mean(a, 'fps')} | ${mean(a, 'p50')} | ${mean(a, 'p90')} | ${a.length ? Math.max(...a.map(r => r.max)) : '-'} | ${mean(a, 'over25')} | ${mean(a, 'overMed')} |`); }
  const failed = rows.filter(r => !r.ok);
  if (failed.length) lines.push('', 'Not done:', ...failed.map(r => `- ${r.build} ${r.beat} run ${r.run}: ${r.why}`));
  fs.writeFileSync(path.join(OUT, 'summary.md'), lines.join('\n') + '\n'); note('\n' + lines.join('\n'));
  ok = true;
} catch (e) { note('ERROR ' + e.message); }
finally {
  try { cdp?.close(); } catch (e) {}
  if (ownTab) { try { await fetch(`http://127.0.0.1:${DEV}/json/close/${ownTab}`, { signal: AbortSignal.timeout(5000) }); note('closed own tab ' + ownTab); } catch (e) { note('cleanup: tab ' + e.message); } }
  server.close();
  if (browser) { try { browser.kill(); } catch (e) {} await sleep(1500); try { fs.rmSync(profile, { recursive: true, force: true }); note('removed the browser profile'); } catch (e) { note('cleanup: profile ' + e.message); } }
  if (!opt.noAdb) { for (const a of [['forward', '--remove', `tcp:${DEV}`], ['reverse', '--remove', `tcp:${PORT}`]]) { try { adb(...a); note('removed ' + a.join(' ')); } catch (e) { note('cleanup: ' + e.message); } } }
  process.exit(ok ? 0 : 1);
}
