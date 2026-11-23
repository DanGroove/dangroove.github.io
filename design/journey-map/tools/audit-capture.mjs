// Audit frames without Playwright: drives a local headless Edge or Chrome over the DevTools protocol (127.0.0.1 only)
// and saves full-screen PNGs of the journey page. No dependencies; Node 22 or later (global WebSocket).
//
//   node tools/audit-capture.mjs --page dist/journey-joined.html --size phone --out ../audit/phone [--plan beats,finds,explore]
//   node tools/audit-capture.mjs --page dist/journey-map.html --size desk --out ../audit/x --steps my-steps.json
//
// --browser  path to msedge.exe or chrome (default: Edge in Program Files, then Chrome, then $BROWSER)
// --size     desk 1440x900, phone 390x844, small 360x640, tablet 820x1180 (phone, small and tablet are touch)
// --plan     any of beats, finds, explore, card (default beats,finds,explore,card)
// --steps    a JSON file with your own steps instead of a plan, for example
//            [{"go":"mohawk"},{"wait":3000},{"shot":"mohawk"},{"press":"hoard-hmc1"},{"wait":2000},{"shot":"chest"},
//             {"key":"Escape"},{"tap":[200,400]},{"eval":"window.__jm.next()"},{"wheel":[720,450,300]}]
// Frames are real time (no fake clock): use waits of 2.5 s or more after a move before a shot.
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, all) => (v.startsWith('--') ? [...a, [v.slice(2), all[i + 1]?.startsWith('--') ? true : all[i + 1]]] : a), []));
const SIZES = { desk: [1440, 900, false], phone: [390, 844, true], small: [360, 640, true], tablet: [820, 1180, true] };
const [W, H, touch] = SIZES[args.size || 'desk'] || SIZES.desk;
const out = resolve(args.out || 'audit-frames'); mkdirSync(out, { recursive: true });
const page = resolve(args.page || 'dist/journey-map.html');
const tag = args.size || 'desk';
const sleep = ms => new Promise(r => setTimeout(r, ms));

function findBrowser() {
  const list = [args.browser, process.env.BROWSER,
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', '/usr/bin/microsoft-edge', '/usr/bin/google-chrome', '/usr/bin/chromium'];
  const hit = list.find(p => p && typeof p === 'string' && existsSync(p));
  if (!hit) throw new Error('no browser found: pass --browser <path to msedge.exe or chrome>');
  return hit;
}

const profile = mkdtempSync(join(tmpdir(), 'jm-audit-'));
const proc = spawn(findBrowser(), ['--headless=new', '--remote-debugging-port=0', '--remote-debugging-address=127.0.0.1', `--user-data-dir=${profile}`,
  '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--hide-scrollbars', '--mute-audio',
  ...(process.platform === 'linux' && process.getuid?.() === 0 ? ['--no-sandbox'] : []), 'about:blank'], { stdio: 'ignore' });
let ws, seq = 0, session = null; const waiting = new Map(), listeners = [];
const send = (method, params = {}, sid = session) => new Promise((ok, fail) => { const id = ++seq; waiting.set(id, { ok, fail }); ws.send(JSON.stringify({ id, method, params, ...(sid ? { sessionId: sid } : {}) })); });
const once = method => new Promise(ok => listeners.push({ method, ok }));
async function cleanup() { try { await send('Browser.close', {}, null); } catch {} try { proc.kill(); } catch {} await sleep(300); try { rmSync(profile, { recursive: true, force: true }); } catch {} }

async function connect() {
  const file = join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 100 && !existsSync(file); i++) await sleep(100);
  const [port, path] = readFileSync(file, 'utf8').trim().split('\n');
  ws = new WebSocket(`ws://127.0.0.1:${port}${path}`);
  await new Promise((ok, fail) => { ws.onopen = ok; ws.onerror = fail; });
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && waiting.has(m.id)) { const w = waiting.get(m.id); waiting.delete(m.id); m.error ? w.fail(new Error(m.error.message)) : w.ok(m.result); }
    else if (m.method) for (let i = listeners.length - 1; i >= 0; i--) if (listeners[i].method === m.method) { listeners[i].ok(m.params); listeners.splice(i, 1); }
  };
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' }, null);
  ({ sessionId: session } = await send('Target.attachToTarget', { targetId, flatten: true }, null));
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: touch });
  if (touch) await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
}

const evaluate = async expr => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' ' + (r.exceptionDetails.exception?.description || '')); return r.result.value; };
const shot = async name => { const { data } = await send('Page.captureScreenshot', { format: 'png' }); const f = join(out, `${tag}-${name}.png`); writeFileSync(f, Buffer.from(data, 'base64')); console.log('saved', f); };
async function tap(x, y) {
  if (touch) {
    await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] }); await sleep(60);
    await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } else {
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }); await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
    await sleep(40); await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
  }
}
async function key(k) { const code = { Escape: 27, Enter: 13, ArrowRight: 39, ArrowLeft: 37, ' ': 32 }[k] || 0; for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: k, code: k === ' ' ? 'Space' : k, windowsVirtualKeyCode: code }); }
const wheel = (x, y, dy) => send('Input.dispatchMouseEvent', { type: 'mouseWheel', x, y, deltaX: 0, deltaY: dy });
const press = async id => { const p = await evaluate(`window.__jm.finds.place(${JSON.stringify(id)})`); if (!p) { console.log('no place for', id); return false; } await tap(p[0], p[1]); return true; };

async function runSteps(steps) {
  for (const s of steps) {
    if (s.go) await evaluate(`window.__jm.go(${JSON.stringify(s.go)}, { instant: true })`);
    if (s.wait) await sleep(s.wait);
    if (s.press) await press(s.press);
    if (s.tap) await tap(...s.tap);
    if (s.key) await key(s.key);
    if (s.wheel) await wheel(...s.wheel);
    if (s.eval) console.log('eval', JSON.stringify(await evaluate(s.eval)));
    if (s.shot) await shot(s.shot);
  }
}

const FIND_PRESSES = { wayfinder: 2, 'hoard-hmc1': 5, 'hoard-laurier': 1, 'hoard-hmc2': 1, 'hoard-interkom': 1, 'hoard-lennard': 1, ravens: 3, serpent: 4, beacon: 2, runestone: 2, hammer: 1, mist: 3, horn: 3, well: 3, longship: 4 };
const STOPS = ['laurier', 'hmc1', 'mohawk', 'hmc2', 'interkom', 'lennard', 'x', 'map'];
async function plan(names) {
  if (names.includes('beats')) {
    const beats = await evaluate('window.__jm.beats.map(b => b.id || b)');
    for (const id of beats) await runSteps([{ go: id }, { wait: 3200 }, { shot: 'beat-' + id }]);
  }
  if (names.includes('card')) {
    await runSteps([{ go: 'mohawk' }, { wait: 3200 }]);
    const x = await evaluate(`(() => { const b = [...document.querySelectorAll('.c-close')].find(e => /Mohawk/.test(e.getAttribute('aria-label'))); if (!b) return null; const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; })()`);
    if (x) { await tap(...x); await sleep(1600); await shot('card-closed-mohawk'); }
  }
  if (names.includes('explore')) {
    await runSteps([{ go: 'end' }, { wait: 6000 }, { shot: 'end' }]);
    const b = await evaluate(`(() => { const e = document.querySelector('.go-next'); if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; })()`);
    if (b) { await tap(...b); await sleep(3000); await shot('explore-fit'); await key('Escape'); await sleep(2500); }
  }
  if (names.includes('finds')) {
    for (const [id, n] of Object.entries(FIND_PRESSES)) {
      let from = null;
      for (const stop of STOPS) {
        await runSteps([{ go: stop }, { wait: 2800 }, { key: 'Escape' }, { wait: 800 }]);
        const q = await evaluate(`window.__jm.finds.place(${JSON.stringify(id)})`);
        if (q && q[0] > 40 && q[0] < W - 40 && q[1] > 80 && q[1] < H - 120) { from = stop; break; }
      }
      if (!from) { console.log(id, 'not reachable from any stop'); continue; }
      for (let i = 0; i < n; i++) { if (!(await press(id))) break; await sleep(i === 0 ? 2600 : 2000); await shot(`find-${id}-${i + 1}`); }
      await runSteps([{ key: 'Escape' }, { wait: 900 }, { key: 'Escape' }, { wait: 900 }]);
    }
  }
}

try {
  await connect();
  const loaded = once('Page.loadEventFired'); await send('Page.navigate', { url: pathToFileURL(page).href }); await loaded; await sleep(2500);
  if (args.steps) await runSteps(JSON.parse(readFileSync(resolve(args.steps), 'utf8')));
  else await plan(String(args.plan || 'beats,finds,explore,card').split(','));
  const errors = await evaluate('(window.__auditErrors || []).length');
  console.log('done', tag, 'page errors seen by the page:', errors);
} catch (e) { console.error('audit-capture failed:', e.message); process.exitCode = 1; }
finally { await cleanup(); }
