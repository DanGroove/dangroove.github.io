// Local Edge/CDP fixture. All writes are confined to COMB-C's authorized run folder.
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
export const combRoot = resolve('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-f');
export const combWait = ms => new Promise(r => setTimeout(r, ms));
export async function combBrowser() {
  mkdirSync(combRoot, { recursive: true });
  const profile = join(combRoot, 'profile-' + Date.now());
  const process = spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', ['--headless=new', '--remote-debugging-port=0', '--remote-debugging-address=127.0.0.1', '--user-data-dir=' + profile, '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--disable-extensions', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
  const portFile = join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 100 && !existsSync(portFile); i++) await combWait(100);
  const [port, endpoint] = readFileSync(portFile, 'utf8').trim().split('\n'), url = `ws://127.0.0.1:${port}${endpoint}`;
  const socket = new WebSocket(url); await new Promise((ok, fail) => { socket.onopen = ok; socket.onerror = fail; });
  let seq = 0, sid; const pending = new Map(), errors = [];
  socket.onmessage = e => { const m = JSON.parse(e.data); if (m.id) { const p = pending.get(m.id); if (!p) return; pending.delete(m.id); clearTimeout(p.timer); m.error ? p.fail(Error(m.error.message)) : p.ok(m.result); } else if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text); };
  const send = (method, params = {}, sessionId = sid) => new Promise((ok, fail) => { const id = ++seq, timer = setTimeout(() => fail(Error(method + ' timeout')), 30000); pending.set(id, { ok, fail, timer }); socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) })); });
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' }, null); ({ sessionId: sid } = await send('Target.attachToTarget', { targetId, flatten: true }, null));
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable'); await send('Network.setBlockedURLs', { urls: ['http://*', 'https://*'] });
  const evaluate = async expression => { const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; };
  return { send, evaluate, errors, url,
    async size(w, h) { await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 900 }); await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 }); await combWait(160); },
    async page(file) { await send('Page.navigate', { url: pathToFileURL(resolve(file)).href }); for (let i = 0; i < 120; i++) { if (await evaluate('!!window.__jm')) break; await combWait(50); } await evaluate('document.fonts.ready.then(()=>true)'); await combWait(300); },
    async shot(name) { const { data } = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(join(combRoot, name + '.png'), Buffer.from(data, 'base64')); },
    async close() { try { await send('Browser.close', {}, null); } catch {} socket.close(); process.kill(); }
  };
}
