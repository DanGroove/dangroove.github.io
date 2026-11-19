// Offline hardware evidence; only this process's isolated browser is controlled.
// node tools/measure.mjs [--browser <path>] [--out <folder>] [--size 1440x900]
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { randomUUID } from 'node:crypto';
import { inflateSync } from 'node:zlib';
import { previewMarkup } from './preview.mjs';
import { SHOW, SCRIPTS, LOOP, PACE } from '../stage.mjs';

const TAKE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WORK = path.join(TAKE, '.scratch', 'measure');
const options = { out: path.join(TAKE, 'review', 'hardware'), size: '1440x900' };
for (let i = 2; i < process.argv.length; i++) {
  const key = process.argv[i];
  if (!['--browser', '--out', '--size'].includes(key) || !process.argv[i + 1]) throw new Error('usage: measure.mjs [--browser <path>] [--out <folder>] [--size 1440x900]');
  options[key.slice(2)] = process.argv[++i];
}
const firstSize = options.size.match(/^(\d+)x(\d+)$/)?.slice(1).map(Number);
if (!firstSize || firstSize.some(n => n < 200 || n > 7680)) throw new Error('invalid --size');
const out = path.resolve(options.out);
const within = (root, file) => file === root || file.startsWith(root + path.sep);
if (!within(path.join(TAKE, 'review', 'hardware'), out) && !within(path.join(TAKE, '.scratch'), out)) throw new Error('--out must remain inside review/hardware/ or .scratch/');
await fs.mkdir(WORK, { recursive: true });
await fs.mkdir(out, { recursive: true });
const profile = path.join(WORK, 'profile-' + randomUUID());
await fs.mkdir(profile);
const file = path.join(WORK, 'preview.html'), fileURL = pathToFileURL(file).href;
await fs.writeFile(file, '<!doctype html>\n<html><head><meta charset="utf-8"></head><body>\n' + previewMarkup() + '\n</body></html>');
const candidates = options.browser ? [path.resolve(options.browser)] : process.platform === 'win32' ? [
  path.join(process.env['PROGRAMFILES(X86)'] || 'C:/Program Files (x86)', 'Microsoft/Edge/Application/msedge.exe'),
  path.join(process.env.PROGRAMFILES || 'C:/Program Files', 'Microsoft/Edge/Application/msedge.exe'),
  path.join(process.env.LOCALAPPDATA || '', 'Microsoft/Edge/Application/msedge.exe'),
] : [];
let executable;
for (const candidate of candidates) { try { await fs.access(candidate); executable = candidate; break; } catch {} }
if (!executable) throw new Error('Microsoft Edge not found; on Linux supply --browser /path/to/chromium');
const report = { started: new Date().toISOString(), browser: null, card: null, softwareRenderer: null, webgl2: false, readyMs: null, consoleErrors: [], networkViolations: [], sizes: [], windows: [], flicker: { frames: 0, repeatFailures: 0, blinkBlocks: 0, repeatDetails: [], blinkDetails: [] }, sheets: [], limitations: [
  'GPU allocations are arithmetic estimates from measured texture/buffer sizes, not resident memory or process working set; driver/compositor overhead is excluded.',
  'Blink scan uses a non-overlapping 8x8 grid. Every neighbour pixel must match within 3 per RGB channel; the middle block mean absolute difference must exceed 24 in a channel.',
  'Contact frames are half size, then fitted to the 1600-pixel sheet cap when necessary. Scan comparisons retain full stage resolution.',
] };
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
let child, socket, session, sequence = 0;
const pending = new Map(), deadline = Date.now() + 25 * 60 * 1000;
function checkDeadline() { if (Date.now() > deadline) throw new Error('25-minute measurement limit reached; partial evidence retained'); }
function command(method, params = {}, target = session) {
  return new Promise((resolve, reject) => {
    const id = ++sequence, timeout = setTimeout(() => { pending.delete(id); reject(new Error(method + ' timed out')); }, method === 'Runtime.evaluate' ? 8 * 60 * 1000 : 30000);
    pending.set(id, { resolve, reject, timeout });
    socket.send(JSON.stringify({ id, method, params, ...(target ? { sessionId: target } : {}) }));
  });
}
async function evaluate(expression) {
  const result = await command('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}
const instrumentation = '(' + (function () {
  const m = window.__measurement = { contexts: [], textures: [], readyMs: null };
  let ready = false;
  Object.defineProperty(window, '__ready', { configurable: true, get: () => ready, set(value) { ready = value; if (value && m.readyMs === null) m.readyMs = performance.now(); } });
  const getContext = HTMLCanvasElement.prototype.getContext, seen = new WeakSet();
  HTMLCanvasElement.prototype.getContext = function (...args) {
    const gl = getContext.apply(this, args);
    if (args[0] === 'webgl2' && gl && !seen.has(gl)) {
      seen.add(gl); m.contexts.push(gl);
      const image = gl.texImage2D.bind(gl), storage = gl.texStorage2D.bind(gl);
      gl.texImage2D = function (...a) { if (a.length === 6 && a[5]?.width) m.textures.push({ role: 'atlas', width: a[5].width, height: a[5].height, format: 'RGBA8' }); return image(...a); };
      gl.texStorage2D = function (...a) { m.textures.push({ role: a[2] === gl.DEPTH_COMPONENT24 ? 'shadow' : 'storage', width: a[3], height: a[4], levels: a[1], internalFormat: a[2] }); return storage(...a); };
    }
    return gl;
  };
}).toString() + ')()';

// Chromium page screenshots are 8-bit RGB/RGBA PNGs: decode with Node zlib alone.
function pngPixels(base64) {
  const b = Buffer.from(base64, 'base64');
  if (!b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) throw new Error('not PNG');
  let width, height, channels, at = 8;
  const chunks = [];
  while (at < b.length) {
    const n = b.readUInt32BE(at), type = b.toString('ascii', at + 4, at + 8), data = b.subarray(at + 8, at + 8 + n);
    if (type === 'IHDR') { width = data.readUInt32BE(0); height = data.readUInt32BE(4); channels = { 2: 3, 6: 4 }[data[9]]; if (data[8] !== 8 || !channels || data[12] !== 0) throw new Error('unsupported PNG layout'); }
    if (type === 'IDAT') chunks.push(data);
    at += n + 12;
  }
  const raw = inflateSync(Buffer.concat(chunks)), stride = width * channels, pixels = new Uint8Array(stride * height);
  const paeth = (a, b, c) => { const p = a + b - c, x = Math.abs(p - a), y = Math.abs(p - b), z = Math.abs(p - c); return x <= y && x <= z ? a : y <= z ? b : c; };
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)], input = y * (stride + 1) + 1, row = y * stride;
    for (let x = 0; x < stride; x++) {
      const left = x >= channels ? pixels[row + x - channels] : 0, up = y ? pixels[row + x - stride] : 0, ul = y && x >= channels ? pixels[row + x - stride - channels] : 0;
      const predictor = filter === 0 ? 0 : filter === 1 ? left : filter === 2 ? up : filter === 3 ? Math.floor((left + up) / 2) : filter === 4 ? paeth(left, up, ul) : NaN;
      if (!Number.isFinite(predictor)) throw new Error('unsupported PNG filter');
      pixels[row + x] = (raw[input + x] + predictor) & 255;
    }
  }
  return { width, height, channels, pixels };
}
function repeatDifference(a, b) {
  if (a.width !== b.width || a.height !== b.height) throw new Error('stage changed size during scan');
  let changed = 0, maximum = 0;
  for (let p = 0; p < a.width * a.height; p++) {
    let diff = 0;
    for (let c = 0; c < 3; c++) diff = Math.max(diff, Math.abs(a.pixels[p * a.channels + c] - b.pixels[p * b.channels + c]));
    maximum = Math.max(maximum, diff); if (diff > 2) changed++;
  }
  return { changed, total: a.width * a.height, fraction: changed / (a.width * a.height), maxChannelDifference: maximum };
}
function blinkBlocks(a, b, c) {
  const spans = [];
  let count = 0;
  for (let y = 0; y + 8 <= a.height; y += 8) {
    let span = null;
    for (let x = 0; x + 8 <= a.width; x += 8) {
      let match = true; const middle = [0, 0, 0];
      for (let dy = 0; dy < 8 && match; dy++) for (let dx = 0; dx < 8 && match; dx++) {
        const p = (y + dy) * a.width + x + dx;
        for (let k = 0; k < 3; k++) {
          const av = a.pixels[p * a.channels + k], bv = b.pixels[p * b.channels + k], cv = c.pixels[p * c.channels + k];
          if (Math.abs(av - cv) > 3) { match = false; break; }
          middle[k] += Math.abs(bv - (av + cv) / 2);
        }
      }
      if (match && Math.max(...middle) / 64 > 24) { count++; if (span && span[1] + span[2] * 8 === x) span[2]++; else { span = [y, x, 1]; spans.push(span); } } else span = null;
    }
  }
  return { count, spans };
}
function memoryAt(info) {
  const atlas = info.textures.filter(t => t.role === 'atlas').map((t, i) => ({ page: i, width: t.width, height: t.height, base: t.width * t.height * 4, mipmaps: t.width * t.height * 4 / 3, bytes: t.width * t.height * 4 * 4 / 3 }));
  const area = info.canvas.width * info.canvas.height, samples = info.samples, depthBytes = Math.ceil((info.depthBits + info.stencilBits) / 8 / 4) * 4;
  const terms = { atlasWithMipmaps: atlas.reduce((n, p) => n + p.bytes, 0), resolvedColour: area * 4, multisampleColour: area * 4 * samples, depth: area * depthBytes * Math.max(1, samples), shadow: info.textures.filter(t => t.role === 'shadow').reduce((n, t) => n + t.width * t.height * 4, 0) };
  return { atlas, canvas: info.canvas, samples, depthBits: info.depthBits, stencilBits: info.stencilBits, depthStorageBytesPerPixel: depthBytes, shadow: info.textures.filter(t => t.role === 'shadow'), terms, total: Object.values(terms).reduce((n, v) => n + v, 0), retainedAtlas2D: atlas.reduce((n, p) => n + p.base, 0), estimate: true };
}
const infoExpression = '(' + (function () {
  const m = window.__measurement, gl = m.contexts[0];
  if (!gl) return { webgl2: false, readyMs: m.readyMs };
  const ext = gl.getExtension('WEBGL_debug_renderer_info'), c = gl.canvas, r = c.getBoundingClientRect();
  return { webgl2: true, readyMs: m.readyMs, vendor: ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR), renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER), debugRendererInfo: !!ext, samples: gl.getParameter(gl.SAMPLES), depthBits: gl.getParameter(gl.DEPTH_BITS), stencilBits: gl.getParameter(gl.STENCIL_BITS), attributes: gl.getContextAttributes(), textures: m.textures, canvas: { width: gl.drawingBufferWidth, height: gl.drawingBufferHeight, cssWidth: r.width, cssHeight: r.height, devicePixelRatio } };
}).toString() + ')()';
async function resize(width, height) {
  await command('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  await evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
}
async function playLoop(width, height) {
  checkDeadline(); console.log('Playing one full loop at ' + width + 'x' + height);
  await resize(width, height);
  const timing = await evaluate('(' + (function () {
    return new Promise((resolve, reject) => {
      __hero.seek(0);
      const start = performance.now(), gaps = []; let previous = null, lastHero = 0, moved = 0, frames = 0, late50 = 0;
      const stop = document.querySelector('[data-pause]'); stop.click();
      const timeout = setTimeout(() => { stop.click(); reject(new Error('Full playback loop exceeded six minutes')); }, 360000);
      function sample(now) {
        frames++;
        if (previous !== null) { const gap = now - previous; gaps.push(gap); if (now - start > 1000 && gap > 50) late50++; }
        previous = now; const t = __hero.t; moved += (t - lastHero + __hero.LOOP) % __hero.LOOP; lastHero = t;
        if (moved >= __hero.LOOP - 1e-7) {
          clearTimeout(timeout); stop.click();
          const sorted = gaps.slice().sort((a, b) => a - b), percentile = p => sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * p) - 1)];
          resolve({ frames, gaps: gaps.length, medianMs: percentile(0.5), p95Ms: percentile(0.95), worstMs: Math.max(...gaps), gapsOver50AfterFirstSecond: late50, heroSeconds: moved, wallSeconds: (now - start) / 1000, clockDriftSeconds: moved - (now - start) / 1000 });
        } else requestAnimationFrame(sample);
      }
      requestAnimationFrame(sample);
    });
  }).toString() + ')()');
  const info = await evaluate(infoExpression), result = { width, height, timing, memory: memoryAt(info) };
  report.sizes.push(result); console.log(JSON.stringify({ size: width + 'x' + height, ...timing, memoryBytes: result.memory.total }));
}
async function capture(time, clip) {
  await evaluate('__hero.seek(' + JSON.stringify(time) + '); __measurement.contexts[0]?.finish(); new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
  return (await command('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false, clip })).data;
}
async function makeSheet(frames, clip, quality = 0.68) {
  return evaluate('(' + (async function (frames, clip, quality) {
    const k = Math.min(0.5, 1600 / (clip.width * 8)), w = Math.floor(clip.width * k), h = Math.floor(clip.height * k), label = 19;
    const c = document.createElement('canvas'); c.width = w * 8; c.height = Math.ceil(frames.length / 8) * (h + label);
    const ctx = c.getContext('2d'); ctx.fillStyle = '#151314'; ctx.fillRect(0, 0, c.width, c.height); ctx.font = '12px Outfit, sans-serif'; ctx.textBaseline = 'top';
    for (let i = 0; i < frames.length; i++) {
      const f = frames[i], img = new Image(); img.src = 'data:image/png;base64,' + f.png; await img.decode();
      const x = i % 8 * w, y = Math.floor(i / 8) * (h + label); ctx.drawImage(img, x, y, w, h); ctx.fillStyle = '#F7F6F3'; ctx.fillText(f.scene + '  ' + f.time.toFixed(3) + 's', x + 4, y + h + 3);
    }
    return { data: c.toDataURL('image/jpeg', quality).split(',')[1], width: c.width, height: c.height, frameScale: k };
  }).toString() + ')(' + JSON.stringify(frames) + ',' + JSON.stringify(clip) + ',' + quality + ')');
}

async function scanWindows() {
  await resize(...firstSize);
  const bounds = await evaluate('(() => { const r = document.querySelector("[data-stage-box]").getBoundingClientRect(); const x = Math.max(0, Math.floor(r.left - 16)), y = Math.max(0, Math.floor(r.top - 16)); return { x, y, width: Math.min(innerWidth - x, Math.ceil(r.right + 16) - x), height: Math.min(innerHeight - y, Math.ceil(r.bottom + 16) - y), scale: 1 }; })()');
  report.flicker.clip = bounds; report.flicker.size = firstSize;
  report.flicker.repeatCriterion = 'Fail a frame when >0.001 of pixels differ in any RGB channel by >2 after seeking elsewhere and back.';
  report.flicker.blinkEncoding = 'Each [y,x,count] span names count adjacent 8x8 blocks, starting at screenshot-local (x,y), stepping x by 8. Add clip.x/clip.y for page coordinates.';
  let globalStart = 0;
  for (const scene of SHOW) {
    const s = SCRIPTS[scene.key], action = id => s.actions.find(a => a.id === id);
    const local = scene.key === 'ps' ? [action('cone').start, action('grade').start] : scene.key === 'id' ? [action('map').start, scene.len] : ['pr', 'ae', 'fig'].includes(scene.key) ? [action('export').start, scene.len] : null;
    if (local) report.windows.push({ scene: scene.key, from: globalStart + local[0], to: globalStart + local[1], step: 0.05 * PACE, sheetStep: 0.2 * PACE });
    globalStart += scene.len;
  }
  for (const window of report.windows) {
    console.log('Scanning ' + window.scene + ' ' + window.from.toFixed(3) + '–' + window.to.toFixed(3));
    const n = Math.floor((window.to - window.from) / window.step + 1e-8), contact = [], rolling = [];
    let repeats = 0, blinks = 0;
    for (let i = -1; i <= n + 1; i++) {
      checkDeadline(); const t = window.from + i * window.step, first = await capture(t, bounds), image = pngPixels(first);
      rolling.push({ t, image }); if (rolling.length > 3) rolling.shift();
      if (i >= 0 && i <= n) {
        await evaluate('__hero.seek(' + ((t + LOOP / 2) % LOOP) + ')');
        const second = pngPixels(await capture(t, bounds)), diff = repeatDifference(image, second); report.flicker.frames++;
        if (diff.fraction > 0.001) { repeats++; report.flicker.repeatFailures++; report.flicker.repeatDetails.push({ scene: window.scene, time: t, ...diff }); }
        if (i % 4 === 0) contact.push({ time: t, scene: window.scene, png: first });
      }
      if (rolling.length === 3 && i >= 1 && i <= n + 1) {
        const result = blinkBlocks(...rolling.map(f => f.image));
        if (result.count) { blinks += result.count; report.flicker.blinkBlocks += result.count; report.flicker.blinkDetails.push({ scene: window.scene, time: rolling[1].t, count: result.count, spans: result.spans }); }
      }
      if (i >= 0 && i % 50 === 0) console.log(window.scene + ': ' + i + '/' + n + ' scan frames');
    }
    const name = window.scene + '-' + window.from.toFixed(3) + '-' + window.to.toFixed(3) + '.jpg', sheet = await makeSheet(contact, bounds);
    await fs.writeFile(path.join(out, name), Buffer.from(sheet.data, 'base64'));
    report.sheets.push({ file: name, scene: window.scene, from: window.from, to: window.to, frames: contact.length, width: sheet.width, height: sheet.height, frameScale: sheet.frameScale });
    window.frames = n + 1; window.repeatFailures = repeats; window.blinkBlocks = blinks;
    console.log(window.scene + ': ' + (n + 1) + ' frames, ' + repeats + ' repeat failures, ' + blinks + ' blink blocks');
  }
}
const mib = bytes => (bytes / 1048576).toFixed(2) + ' MiB';
function markdown() {
  const card = report.card || { vendor: 'unavailable', renderer: 'unavailable' };
  let s = '# Journey hero hardware measurement\n\nGraphics card: **' + card.vendor + ' / ' + card.renderer + '**\n\nBrowser: **' + (report.browser?.product || 'unavailable') + '** (' + (report.browser?.revision || '') + ')\n\n';
  s += report.softwareRenderer ? '**SOFTWARE RENDERER: these are software-rendering results, not real-GPU performance evidence.**\n\n' : report.softwareRenderer === false ? 'Software renderer: no known software-renderer name detected.\n\n' : 'Software renderer: unknown.\n\n';
  s += 'WebGL2: ' + report.webgl2 + '. Time from navigation to __ready: ' + (report.readyMs === null ? 'unavailable' : report.readyMs.toFixed(1) + ' ms') + '.\n\nStarted ' + report.started + '; ended ' + report.ended + '. Loop ' + LOOP.toFixed(3) + ' s.\n\n';
  if (report.error) s += '**Incomplete: ' + report.error + '**\n\n';
  s += '| CSS size | Frames | Median ms | P95 ms | Worst ms | Gaps >50 ms after 1 s | Hero / wall s | GPU allocation estimate |\n| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |\n';
  for (const size of report.sizes) { const t = size.timing; s += '| ' + size.width + ' × ' + size.height + ' | ' + t.frames + ' | ' + t.medianMs.toFixed(2) + ' | ' + t.p95Ms.toFixed(2) + ' | ' + t.worstMs.toFixed(2) + ' | ' + t.gapsOver50AfterFirstSecond + ' | ' + t.heroSeconds.toFixed(3) + ' / ' + t.wallSeconds.toFixed(3) + ' | ' + mib(size.memory.total) + ' |\n'; }
  for (const size of report.sizes) {
    const m = size.memory;
    s += '\n## Memory at ' + size.width + ' × ' + size.height + '\n\nMeasured canvas: ' + m.canvas.width + ' × ' + m.canvas.height + ' pixels; DPR ' + m.canvas.devicePixelRatio + '. MSAA samples: ' + m.samples + '; depth ' + m.depthBits + ' bits; stencil ' + m.stencilBits + ' bits. Depth storage is estimated at ' + m.depthStorageBytesPerPixel + ' bytes per sample.\n\n';
    for (const page of m.atlas) s += '- Atlas ' + page.page + ': ' + page.width + ' × ' + page.height + ', RGBA8 ' + mib(page.base) + ' + mipmaps ' + mib(page.mipmaps) + ' = ' + mib(page.bytes) + '.\n';
    for (const [name, bytes] of Object.entries(m.terms)) s += '- ' + name + ': ' + mib(bytes) + '.\n';
    s += '\nTotal GPU allocation estimate: **' + mib(m.total) + '**. Retained 2D atlas pixel storage adds about ' + mib(m.retainedAtlas2D) + ' outside this total. Shadow-map storage assumes 32 bits for DEPTH_COMPONENT24. This is allocation arithmetic, not measured resident memory.\n';
  }
  s += '\n## Flicker scan\n\n' + report.flicker.frames + ' frames; **' + report.flicker.repeatFailures + ' repeat failures; ' + report.flicker.blinkBlocks + ' blink blocks**.\n\n';
  for (const w of report.windows) s += '- ' + w.scene + ' ' + w.from.toFixed(3) + '–' + w.to.toFixed(3) + ' s: ' + (w.frames || 0) + ' frames, ' + (w.repeatFailures || 0) + ' repeat failures, ' + (w.blinkBlocks || 0) + ' blink blocks.\n';
  s += '\n' + (report.flicker.blinkEncoding || '') + '\n';
  for (const f of report.flicker.repeatDetails) s += '\nRepeat failure ' + f.scene + ' at ' + f.time.toFixed(3) + ': ' + f.changed + '/' + f.total + ' pixels, max channel difference ' + f.maxChannelDifference + '.\n';
  for (const f of report.flicker.blinkDetails) s += '\nBlink ' + f.scene + ' at ' + f.time.toFixed(3) + ' s: ' + f.spans.map(span => '[' + span.join(',') + ']').join(' ') + '.\n';
  s += '\n## Contact sheets\n\n';
  for (const sheet of report.sheets) s += '- [' + sheet.file + '](' + sheet.file + '): ' + sheet.frames + ' frames, ' + sheet.width + ' × ' + sheet.height + ', scale ' + sheet.frameScale.toFixed(3) + '.\n';
  s += '\n## Errors and limits\n\nConsole errors: ' + report.consoleErrors.length + '. Blocked/unexpected page network requests: ' + report.networkViolations.length + '.\n\n';
  for (const error of report.consoleErrors) s += '- ' + error.replace(/\n/g, ' ') + '\n';
  for (const limitation of report.limitations) s += '- ' + limitation + '\n';
  s += '\nOnly the packed local file was navigated. The unique throwaway profile lived under .scratch/measure/. The browser was closed through its own DevTools connection, with its spawned PID as the sole termination fallback; no browser-name termination is used.\n';
  return s;
}
async function writeReport() {
  report.ended = new Date().toISOString(); report.memoryTotal = Math.max(0, ...report.sizes.map(s => s.memory.total));
  await fs.writeFile(path.join(out, 'measure.json'), JSON.stringify(report, null, 2)); await fs.writeFile(path.join(out, 'measure.md'), markdown());
}
try {
  child = spawn(executable, ['--headless=new', '--remote-debugging-port=0', '--remote-debugging-address=127.0.0.1', '--user-data-dir=' + profile, '--disk-cache-dir=' + path.join(profile, 'cache'), '--crash-dumps-dir=' + path.join(profile, 'crashes'), '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--disable-component-update', '--disable-sync', '--disable-default-apps', '--disable-extensions', '--disable-breakpad', '--metrics-recording-only', '--disable-features=msEdgeSidebarV2,msImplicitSignin,OptimizationHints,MediaRouter,AutofillServerCommunication', '--hide-scrollbars', '--mute-audio', '--window-size=' + firstSize.join(','), fileURL], { stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true });
  report.spawnedPid = child.pid;
  let childError; child.on('error', error => { childError = error; });
  let stderr = ''; child.stderr.on('data', data => { stderr = (stderr + data).slice(-8000); });
  const portFile = path.join(profile, 'DevToolsActivePort'); let address;
  for (let n = 0; n < 150; n++) {
    if (childError) throw childError;
    if (child.exitCode !== null) throw new Error('Browser exited early: ' + stderr);
    try { const [port, endpoint] = (await fs.readFile(portFile, 'utf8')).trim().split(/\r?\n/); if (port && endpoint) { address = 'ws://127.0.0.1:' + port + endpoint; break; } } catch {}
    await pause(100);
  }
  if (!address) throw new Error('Browser did not expose its own debugging endpoint: ' + stderr);
  socket = new WebSocket(address);
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.id) { const waiter = pending.get(message.id); if (!waiter) return; clearTimeout(waiter.timeout); pending.delete(message.id); if (message.error) waiter.reject(new Error(JSON.stringify(message.error))); else waiter.resolve(message.result); }
    else if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') report.consoleErrors.push(message.params.args.map(a => a.value ?? a.description ?? a.type).join(' '));
    else if (message.method === 'Runtime.exceptionThrown') report.consoleErrors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
    else if (message.method === 'Network.requestWillBeSent') { const request = message.params.request.url; if (request !== fileURL && !request.startsWith('data:')) report.networkViolations.push(request); }
  });
  report.browser = await command('Browser.getVersion', {}, null);
  const targets = await command('Target.getTargets', {}, null), target = targets.targetInfos.find(t => t.type === 'page' && t.url === fileURL);
  if (!target) throw new Error('The only allowed preview target was not found');
  session = (await command('Target.attachToTarget', { targetId: target.targetId, flatten: true }, null)).sessionId;
  await command('Runtime.enable'); await command('Page.enable'); await command('Network.enable');
  await command('Network.setBlockedURLs', { urls: ['http://*', 'https://*', 'ws://*', 'wss://*', 'ftp://*'] });
  await command('Page.addScriptToEvaluateOnNewDocument', { source: instrumentation });
  await command('Emulation.setDeviceMetricsOverride', { width: firstSize[0], height: firstSize[1], deviceScaleFactor: 1, mobile: false });
  await command('Page.navigate', { url: fileURL });
  for (let n = 0; n < 300; n++) { if (await evaluate('!!window.__ready')) break; if (n === 299) throw new Error('Preview did not become ready within 30 seconds'); await pause(100); }
  const info = await evaluate(infoExpression); report.webgl2 = info.webgl2; report.readyMs = info.readyMs; report.card = { vendor: info.vendor, renderer: info.renderer, debugRendererInfo: info.debugRendererInfo };
  report.softwareRenderer = /swiftshader|llvmpipe|softpipe|basic render|software|lavapipe|warp\b/i.test((info.vendor || '') + ' ' + (info.renderer || ''));
  console.log('Browser: ' + report.browser.product); console.log('Graphics: ' + info.vendor + ' / ' + info.renderer);
  console.log(report.softwareRenderer ? 'SOFTWARE RENDERER — real graphics-card performance is still unmeasured.' : 'No known software renderer detected.'); console.log('Time to ready: ' + info.readyMs.toFixed(1) + ' ms');
  if (!info.webgl2) throw new Error('No WebGL2; controls and still unavailable in this prototype');
  await playLoop(...firstSize); await playLoop(1920, 1080); await scanWindows();
  if (report.networkViolations.length) throw new Error('Unexpected page network request was blocked; inspect report');
} catch (error) { report.error = error.stack || String(error); process.exitCode = 1; console.error(report.error); }
finally {
  if (socket?.readyState === WebSocket.OPEN) { try { await Promise.race([command('Browser.close', {}, null), pause(3000)]); } catch {} socket.close(); }
  if (child && child.exitCode === null) { await Promise.race([new Promise(resolve => child.once('exit', resolve)), pause(3000)]); if (child.exitCode === null) { report.terminationFallbackPid = child.pid; child.kill(); await Promise.race([new Promise(resolve => child.once('exit', resolve)), pause(3000)]); } }
  for (const waiter of pending.values()) clearTimeout(waiter.timeout); pending.clear();
  report.browserClosed = !child || child.exitCode !== null || child.signalCode !== null;
  await writeReport();
  // Verify the absolute deletion target; it was created by this run and is never an existing profile.
  if (within(WORK, profile) && path.basename(profile).startsWith('profile-') && report.browserClosed) await fs.rm(profile, { recursive: true, force: true, maxRetries: 3 }).catch(error => { report.profileCleanupError = String(error); });
  await writeReport();
  const files = await fs.readdir(out), total = (await Promise.all(files.map(async name => { const s = await fs.stat(path.join(out, name)); return s.isFile() ? s.size : 0; }))).reduce((n, v) => n + v, 0);
  report.outputBytes = total;
  if (total >= 3000000) { report.error = (report.error ? report.error + '\n' : '') + 'Output folder exceeds 3 MB'; process.exitCode = 1; }
  await writeReport();
  console.log('Measurement: ' + out); console.log('Memory total (peak estimate): ' + mib(report.memoryTotal)); console.log('Flicker: ' + report.flicker.frames + ' frames, ' + report.flicker.repeatFailures + ' repeat failures, ' + report.flicker.blinkBlocks + ' blink blocks; output ' + total + ' bytes');
}
