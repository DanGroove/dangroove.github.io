// Glide frame times on a real Android phone's Chrome, driven from the PC over adb and the DevTools protocol.
// Run from design/journey-map on Dan's PC (Node 22+, built-in WebSocket; nothing to install):
//   node tools/phone-fps.mjs --adb D:\android\platform-tools\adb.exe --serial 10.0.0.178:44099 \
//     --page be=<path to be25990's journey-map.html> --page new=dist/journey-map.html --beats hmc1,mohawk --runs 4 --out <folder>
// What it does: serves the pages from 127.0.0.1:<port> (adb reverse, so the phone opens http://localhost:<port>/...),
// forwards Chrome's DevTools socket to tcp:9222, and for each run (builds alternate) opens ?beat=<stop>, waits for the
// page to settle, records requestAnimationFrame times, presses Next with a DevTools touch at the button's centre, and
// keeps recording for --window ms. It removes the forward and the reverse at the end, also after an error.
// --no-adb skips adb (for a desktop Chrome started with --remote-debugging-port=9222).
import { spawnSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2), opt = { page: [] };
for (let i = 0; i < args.length; i++) {
  const k = args[i].replace(/^--/, '');
  if (k === 'no-adb') opt.noAdb = true; else if (k === 'page') opt.page.push(args[++i]); else opt[k] = args[++i];
}
const ADB = opt.adb, SERIAL = opt.serial, PORT = +(opt.port || 8765), DEV = +(opt.devtools || 9222);
const BEATS = (opt.beats || 'hmc1,mohawk').split(','), RUNS = +(opt.runs || 4), SETTLE = +(opt.settle || 9000), WINDOW = +(opt.window || 4500);
const OUT = opt.out || path.resolve('phone-fps-out');
const PAGES = opt.page.map(s => { const i = s.indexOf('='); return { name: s.slice(0, i), file: path.resolve(s.slice(i + 1)) }; });
if (!PAGES.length || (!opt.noAdb && (!ADB || !SERIAL))) { console.error('usage: --adb <adb.exe> --serial <ip:port> --page name=file [--page ...] [--beats a,b] [--runs n] [--out dir]'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });
const note = s => { const line = new Date().toISOString().slice(11, 19) + 'Z ' + s; console.log(line); fs.appendFileSync(path.join(OUT, 'log.txt'), line + '\n'); };
const adb = (...a) => { const r = spawnSync(ADB, ['-s', SERIAL, ...a], { encoding: 'utf8', timeout: 20000 }); if (r.status !== 0) throw new Error('adb ' + a.join(' ') + ': ' + (r.stderr || r.stdout || r.error)); return r.stdout.trim(); };
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Static server for the pages only (127.0.0.1, read-only, the listed files and nothing else).
const server = http.createServer((req, res) => {
  const name = decodeURIComponent((req.url || '/').split('?')[0]).replace(/^\/+/, '').replace(/\.html$/, '');
  const p = PAGES.find(q => q.name === name);
  if (!p) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }); fs.createReadStream(p.file).pipe(res);
});

let cdp = null, id = 0; const waiters = new Map(), events = [];
const send = (method, params = {}) => new Promise((resolve, reject) => { const n = ++id; waiters.set(n, { resolve, reject }); cdp.send(JSON.stringify({ id: n, method, params })); });
const evaluate = async expr => { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error('page: ' + JSON.stringify(r.exceptionDetails).slice(0, 300)); return r.result.value; };
const waitEvent = (method, ms) => new Promise((resolve, reject) => { const t0 = Date.now(); const tick = () => { const i = events.findIndex(e => e.method === method); if (i >= 0) { resolve(events.splice(i, 1)[0]); return; } if (Date.now() - t0 > ms) { reject(new Error('timeout ' + method)); return; } setTimeout(tick, 50); }; tick(); });

async function connect() {
  let list = null;
  for (let i = 0; i < 20 && !list; i++) { try { list = await (await fetch(`http://127.0.0.1:${DEV}/json/list`)).json(); } catch (e) { await sleep(500); } }
  if (!list) throw new Error('no DevTools at 127.0.0.1:' + DEV + ' (is Chrome open on the phone?)');
  let page = list.find(t => t.type === 'page' && /localhost:/.test(t.url)) || list.find(t => t.type === 'page');
  if (!page) { page = await (await fetch(`http://127.0.0.1:${DEV}/json/new?about:blank`, { method: 'PUT' })).json(); }
  note('DevTools target: ' + page.title + ' ' + page.url);
  cdp = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { cdp.onopen = resolve; cdp.onerror = e => reject(new Error('websocket: ' + (e.message || e.type))); });
  cdp.onmessage = m => { const d = JSON.parse(typeof m.data === 'string' ? m.data : m.data.toString()); if (d.id && waiters.has(d.id)) { const w = waiters.get(d.id); waiters.delete(d.id); d.error ? w.reject(new Error(d.error.message)) : w.resolve(d.result); } else if (d.method) events.push(d); };
  await send('Page.enable'); await send('Runtime.enable');
  try { await send('Page.bringToFront'); } catch (e) {}
  if (opt.noAdb) await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
}

async function oneRun(p, beat, run) {
  events.length = 0;
  await send('Page.navigate', { url: `http://localhost:${PORT}/${p.name}.html?beat=${beat}` });
  await waitEvent('Page.loadEventFired', 30000); await sleep(SETTLE);
  const env = await evaluate(`({ rm: matchMedia('(prefers-reduced-motion: reduce)').matches, dpr: devicePixelRatio, w: innerWidth, h: innerHeight, jm: !!window.__jm, P: window.__jm && +window.__jm.P.toFixed(1) })`);
  if (env.rm) throw new Error('prefers-reduced-motion is on: turn off "Remove animations" on the phone and run again');
  const box = await evaluate(`(() => { const e = document.querySelector('.go-next'); if (!e) return null; const r = e.getBoundingClientRect(); return r.width ? [r.left + r.width / 2, r.top + r.height / 2] : null; })()`);
  if (!box) throw new Error('no visible Next button at ' + beat);
  await evaluate(`(() => { const t = []; window.__pf = t; const f = n => { t.push(n); if (t.length < 4000) requestAnimationFrame(f); }; requestAnimationFrame(f); return true; })()`);
  await sleep(400);
  const t0 = await evaluate('performance.now()');
  await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box[0], y: box[1] }] });
  await sleep(60);
  await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await sleep(WINDOW + 300);
  const r = await evaluate(`(() => { const t0 = ${t0}, t = window.__pf.filter(x => x > t0 && x < t0 + ${WINDOW}); return { t, P: +window.__jm.P.toFixed(1), moving: window.__jm.moving }; })()`);
  const d = r.t.slice(1).map((x, i) => x - r.t[i]).sort((a, b) => a - b), q = k => d.length ? +d[Math.min(d.length - 1, Math.floor(d.length * k))].toFixed(1) : null;
  const med = q(0.5) || 16.7, row = { build: p.name, beat, run, frames: r.t.length, fps: +(r.t.length / (WINDOW / 1000)).toFixed(1), p50: med, p90: q(0.9), p99: q(0.99), max: d.length ? +d.at(-1).toFixed(1) : null,
    over25: d.filter(x => x > 25).length, overMed: d.filter(x => x > 1.5 * med).length, Pafter: r.P, dpr: env.dpr, w: env.w, h: env.h };
  fs.writeFileSync(path.join(OUT, `${p.name}-${beat}-${run}.json`), JSON.stringify({ row, frames: r.t }, null, 0));
  note(JSON.stringify(row));
  return row;
}

let ok = false;
try {
  await new Promise(r => server.listen(PORT, '127.0.0.1', r)); note(`serving ${PAGES.map(p => p.name).join(', ')} on 127.0.0.1:${PORT}`);
  if (!opt.noAdb) {
    note('adb devices: ' + spawnSync(ADB, ['devices'], { encoding: 'utf8' }).stdout.replace(/\s+/g, ' '));
    adb('reverse', `tcp:${PORT}`, `tcp:${PORT}`); adb('forward', `tcp:${DEV}`, 'localabstract:chrome_devtools_remote');
    note('model ' + adb('shell', 'getprop', 'ro.product.model') + ', refresh ' + (adb('shell', 'dumpsys', 'display').match(/mRefreshRate=?\s*([\d.]+)/)?.[1] || '?'));
  }
  await connect();
  const rows = [];
  for (let run = 1; run <= RUNS; run++) for (const beat of BEATS) for (const p of (run % 2 ? PAGES : [...PAGES].reverse())) rows.push(await oneRun(p, beat, run));
  const sum = {};
  for (const r of rows) { const k = r.build + ' ' + r.beat; (sum[k] ??= []).push(r); }
  const lines = ['| Build | Glide | Runs | fps (mean) | p50 ms | p90 ms | max ms | frames > 25 ms | frames > 1.5x p50 |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- |'];
  const mean = (a, k) => +(a.reduce((s, r) => s + r[k], 0) / a.length).toFixed(1);
  for (const [k, a] of Object.entries(sum)) lines.push(`| ${k.split(' ')[0]} | ${k.split(' ')[1]} | ${a.length} | ${mean(a, 'fps')} | ${mean(a, 'p50')} | ${mean(a, 'p90')} | ${Math.max(...a.map(r => r.max))} | ${mean(a, 'over25')} | ${mean(a, 'overMed')} |`);
  fs.writeFileSync(path.join(OUT, 'summary.md'), lines.join('\n') + '\n'); note('\n' + lines.join('\n'));
  ok = true;
} catch (e) { note('ERROR ' + e.message); }
finally {
  try { cdp?.close(); } catch (e) {}
  server.close();
  if (!opt.noAdb) { for (const a of [['forward', '--remove', `tcp:${DEV}`], ['reverse', '--remove', `tcp:${PORT}`]]) { try { adb(...a); note('removed ' + a.join(' ')); } catch (e) { note('cleanup: ' + e.message); } } }
  process.exit(ok ? 0 : 1);
}
