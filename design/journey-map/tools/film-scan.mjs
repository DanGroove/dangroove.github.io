// Flash and frame-time scan of screen films made during a phone-fps run (Dan's PC, nothing to install):
//   node tools/film-scan.mjs --dir <run folder> --chrome <chrome.exe> [--rate 0.4] [--threshold 10] [--top 3]
// The run folder holds phone-fps's log.txt (one line per row, written as each row's window ends), the phone's screen
// recordings (adb screenrecord chunks, *rec-<n>.mp4) and rec-log.txt (one line per chunk: its start time as UTC ISO and n).
// For each row it plays the matching stretch of film in a headless Chrome of its own (Chrome decodes the H.264), looks at
// every frame the phone showed, and finds flashes: places whose brightness jumps away and back within one or two frames
// (A, B, A or A, B, B, A), which smooth motion never does. It also times the shown frames while things move.
// Out: <dir>/scan/summary.md, scan/rows.json, and for the strongest flashes of each row a picture (whole screen before,
// during and after, with the place boxed, and the place enlarged): scan/<row>-<k>.png.
// --whole scans every chunk from start to end instead of the rows' windows.
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2), opt = {};
for (let i = 0; i < args.length; i++) { const a = args[i].replace(/^--/, ''), eq = a.indexOf('='); if (eq > 0) { opt[a.slice(0, eq)] = a.slice(eq + 1); continue; } if (args[i + 1] !== undefined && !args[i + 1].startsWith('--')) opt[a] = args[++i]; else opt[a] = true; }
const DIR = path.resolve(opt.dir || '.'), CHROME = opt.chrome, PORT = +(opt.port || 8767), DEV = +(opt.devtools || 9334);
const RATE = +(opt.rate || 0.4), T = +(opt.threshold || 10), TB = +(opt['big-threshold'] || 5), TOP = +(opt.top || 3), BEFORE = +(opt.before || 7), AFTER = +(opt.after || 0.8);
if (!CHROME || !fs.existsSync(DIR)) { console.error('usage: node tools/film-scan.mjs --dir <run folder> --chrome <chrome.exe> [--rate 0.4] [--threshold 10] [--top 3] [--whole]'); process.exit(2); }
const OUT = path.join(DIR, 'scan'); fs.mkdirSync(OUT, { recursive: true });
const note = s => { const line = new Date().toISOString().slice(11, 19) + 'Z ' + s; console.log(line); fs.appendFileSync(path.join(OUT, 'log.txt'), line + '\n'); };
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Chunks: *rec-<n>.mp4 with their start times from rec-log.txt (any line with an ISO time and the chunk's number).
const files = fs.readdirSync(DIR).filter(f => /rec-?\d+\.mp4$/i.test(f)).map(f => ({ file: f, n: +f.match(/(\d+)\.mp4$/i)[1] })).sort((a, b) => a.n - b.n);
const iso = /\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z?/;
const recLog = fs.existsSync(path.join(DIR, 'rec-log.txt')) ? fs.readFileSync(path.join(DIR, 'rec-log.txt'), 'utf8').split(/\r?\n/).filter(l => iso.test(l)) : [];
for (const c of files) {
  const line = recLog.find(l => { const rest = l.replace(iso, ' '); return (rest.match(/\d+/g) || []).map(Number).includes(c.n); }) || recLog[c.n - 1];
  if (line) { const s = line.match(iso)[0]; c.start = Date.parse(s.endsWith('Z') ? s : s + 'Z'); }
}
if (!files.length) { console.error('no *rec-<n>.mp4 films in ' + DIR); process.exit(2); }
const day = files.find(c => c.start)?.start;
// Rows: phone-fps log lines "HH:MM:SSZ {row}", stamped when the row's window ended.
const rows = [];
if (!opt.whole) {
  const lines = fs.existsSync(path.join(DIR, 'log.txt')) ? fs.readFileSync(path.join(DIR, 'log.txt'), 'utf8').split(/\r?\n/) : [];
  for (const l of lines) {
    const m = l.match(/^(\d\d):(\d\d):(\d\d)Z (\{.*\})$/); if (!m || !day) continue;
    let row; try { row = JSON.parse(m[4]); } catch (e) { continue; }
    if (!row.beat || row.frames === undefined) continue;
    const d = new Date(day); d.setUTCHours(+m[1], +m[2], +m[3], 999); const end = d.getTime();
    const c = files.filter(f => f.start && f.start <= end - 1000).at(-1); if (!c) continue;
    rows.push({ label: `${row.build}-${row.beat}-${row.run}`.replace(/[:>]/g, '-'), beat: row.beat, ok: row.ok, fps: row.fps, file: c.file, from: Math.max(0, (end - c.start) / 1000 - Math.max(BEFORE, (row.window || 0) / 1000 + 2.5)), to: (end - c.start) / 1000 + AFTER });
  }
} else for (const c of files) rows.push({ label: c.file.replace(/\.mp4$/i, ''), beat: c.file, file: c.file, from: 0, to: 1e9 });
note(`${files.length} films, ${rows.length} stretches to scan at ${RATE}x`);

// The page: plays one stretch, reads every shown frame through requestVideoFrameCallback, returns flashes and frame times.
function pageMain() {
  // Cells: small (6 px of a 360 px wide frame, about 7 CSS px on the phone) for things the size of a label or marker, big
  // (24 px) for layers and tiles. A thin line that sweeps across a cell also reads as away-and-back, but it does so in every
  // frame along its path, so a flash counts only when the frames either side have no flagged cells near it.
  const W = 360, CELL = 6, BIG = 4, NEAR = 8, NEARB = 2;
  window.scan = async ({ src, from, to, T, TB, rate, top }) => {
    const v = document.createElement('video'); v.muted = true; v.playsInline = true; v.preload = 'auto'; v.src = src; document.body.appendChild(v);
    await new Promise((res, rej) => { v.onloadedmetadata = res; v.onerror = () => rej(new Error('video: ' + (v.error && v.error.message))); });
    to = Math.min(to, v.duration); if (!(to > from)) return { frames: 0, why: 'stretch outside the film (' + v.duration.toFixed(1) + ' s)' };
    const H = Math.round(v.videoHeight * W / v.videoWidth), CW = Math.ceil(W / CELL), CH = Math.ceil(H / CELL), NC = CW * CH, BW = Math.ceil(CW / BIG), BH = Math.ceil(CH / BIG), NB = BW * BH;
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const ctx = cv.getContext('2d', { willReadFrequently: true });
    const ring = [], f1 = new Map(), f2 = new Map(), out = { frames: 0, missed: 0, t: [], motion: [], events: [], pics: [], size: [v.videoWidth, v.videoHeight], scale: v.videoWidth / W };
    let n = -1, picMin = 0;
    const take = t => {
      const img = ctx.getImageData(0, 0, W, H), d = img.data, cells = new Float32Array(NC), cnt = new Float32Array(NC), big = new Float32Array(NB), bcnt = new Float32Array(NB);
      for (let y = 0; y < H; y++) { const row = ((y / CELL) | 0) * CW; for (let x = 0; x < W; x++) { const i = (y * W + x) * 4, c = row + ((x / CELL) | 0); cells[c] += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]; cnt[c]++; } }
      for (let c = 0; c < NC; c++) { const b = ((((c / CW) | 0) / BIG) | 0) * BW + (((c % CW) / BIG) | 0); big[b] += cells[c]; bcnt[b] += cnt[c]; cells[c] /= cnt[c]; }
      for (let b = 0; b < NB; b++) big[b] /= bcnt[b];
      const prev = ring.at(-1); let m = 0; if (prev) { for (let c = 0; c < NC; c++) m += Math.abs(cells[c] - prev.cells[c]); m /= NC; }
      n++; ring.push({ n, t, cells, big, img }); if (ring.length > 6) ring.shift();
      out.frames++; out.t.push(+t.toFixed(4)); out.motion.push(+m.toFixed(2));
      const at = k => ring.find(f => f.n === k);
      // flags for the newest possible middles: one frame (n-1) and two frames (n-2, n-1)
      if (n >= 2) f1.set(n - 1, { s: flags([at(n - 1)], at(n - 2), at(n), 'cells', NC, T), b: flags([at(n - 1)], at(n - 2), at(n), 'big', NB, TB) });
      if (n >= 3) f2.set(n - 2, { s: flags([at(n - 2), at(n - 1)], at(n - 3), at(n), 'cells', NC, T), b: flags([at(n - 2), at(n - 1)], at(n - 3), at(n), 'big', NB, TB) });
      // decide on a middle once the flags of the frames either side are known
      if (f1.has(n - 2) && f1.has(n - 1)) decide(f1, n - 2, [at(n - 3), at(n - 2), at(n - 1)]);
      if (f2.has(n - 3) && f2.has(n - 2)) decide(f2, n - 3, [at(n - 4), at(n - 3), at(n - 2), at(n - 1)]);
      for (const m of [f1, f2]) for (const k of [...m.keys()]) if (k < n - 5) m.delete(k);
    };
    const flags = (mid, a, b, key, N, th) => {
      const amp = new Float32Array(N); let any = 0;
      for (let c = 0; c < N; c++) {
        let m = mid[0][key][c];
        if (mid.length === 2) { if (Math.abs(mid[0][key][c] - mid[1][key][c]) > th / 2) continue; m = (mid[0][key][c] + mid[1][key][c]) / 2; }
        const d1 = m - a[key][c], d2 = m - b[key][c]; if (d1 * d2 <= 0) continue;
        const s = Math.min(Math.abs(d1), Math.abs(d2)); if (s < th || Math.abs(a[key][c] - b[key][c]) > s / 2) continue;
        amp[c] = d1 > 0 ? s : -s; any++;
      }
      return any ? amp : null;
    };
    const near = (amp, cw, ch, x0, y0, x1, y1, r) => { if (!amp) return false; for (let y = Math.max(0, y0 - r); y <= Math.min(ch - 1, y1 + r); y++) for (let x = Math.max(0, x0 - r); x <= Math.min(cw - 1, x1 + r); x++) if (amp[y * cw + x]) return true; return false; };
    const decide = (map, k, frames) => {
      const me = map.get(k), before = map.get(k - 1), after = map.get(k + 1);
      for (const [key, cw, ch, cell, r, th] of [['s', CW, CH, CELL, NEAR, T], ['b', BW, BH, CELL * BIG, NEARB, TB]]) {
        const amp = me[key]; if (!amp) continue;
        const seen = new Uint8Array(cw * ch);
        for (let c0 = 0; c0 < cw * ch; c0++) {
          if (!amp[c0] || seen[c0]) continue;
          const q = [c0]; seen[c0] = 1; let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1, cnt = 0, max = 0, sum = 0, up = 0;
          while (q.length) {
            const c = q.pop(), cx = c % cw, cy = (c / cw) | 0, s = Math.abs(amp[c]); cnt++; sum += s; if (s > max) max = s; if (amp[c] > 0) up++;
            if (cx < x0) x0 = cx; if (cy < y0) y0 = cy; if (cx > x1) x1 = cx; if (cy > y1) y1 = cy;
            for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const nx = cx + dx, ny = cy + dy; if (nx < 0 || ny < 0 || nx >= cw || ny >= ch) continue; const j = ny * cw + nx; if (amp[j] && !seen[j]) { seen[j] = 1; q.push(j); } }
          }
          if (key === 's' && cnt < 2 && max < 2 * th) continue;
          if (near(before && before[key], cw, ch, x0, y0, x1, y1, r) || near(after && after[key], cw, ch, x0, y0, x1, y1, r)) continue;
          // Moving content around it (the frames either side differ there) makes a stalled or sweeping edge, not a flash.
          const A = frames[0][key === 's' ? 'cells' : 'big'], B = frames.at(-1)[key === 's' ? 'cells' : 'big']; let ctxSum = 0, ctxN = 0;
          for (let y = Math.max(0, y0 - 2); y <= Math.min(ch - 1, y1 + 2); y++) for (let x = Math.max(0, x0 - 2); x <= Math.min(cw - 1, x1 + 2); x++) { ctxSum += Math.abs(A[y * cw + x] - B[y * cw + x]); ctxN++; }
          const around = ctxSum / ctxN; if (sum / cnt < 2 * around + th / 2) continue;
          const box = [x0 * cell, y0 * cell, Math.min(W, (x1 + 1) * cell), Math.min(H, (y1 + 1) * cell)], area = (box[2] - box[0]) * (box[3] - box[1]) / (CELL * CELL), score = Math.round(area * max);
          const ev = { t: +frames[1].t.toFixed(3), frames: frames.length - 2, scale: key === 's' ? 'small' : 'big', box, frac: [+(box[0] / W).toFixed(3), +(box[1] / H).toFixed(3), +(box[2] / W).toFixed(3), +(box[3] / H).toFixed(3)], cells: cnt, max: +max.toFixed(1), mean: +(sum / cnt).toFixed(1), brighter: up > cnt / 2, around: +around.toFixed(1), score };
          out.events.push(ev);
          if (out.pics.length < top || score > picMin) { out.pics.push({ score, ev, url: picture(frames, box) }); out.pics.sort((p, q) => q.score - p.score); if (out.pics.length > top) out.pics.length = top; picMin = out.pics.at(-1).score; }
        }
      }
    };
    // Whole screens (frame before, the flash, frame after) with the place boxed, and the place enlarged under each.
    const picture = (fr, box) => {
      const tw = 170, th = Math.round(H * tw / W), pad = 24, bx = Math.max(0, box[0] - pad), by = Math.max(0, box[1] - pad), bw = Math.min(W, box[2] + pad) - bx, bh = Math.min(H, box[3] + pad) - by;
      const z = Math.min(tw / bw, 260 / bh, 6), zw = Math.round(bw * z), zh = Math.round(bh * z);
      const c = document.createElement('canvas'); c.width = fr.length * (tw + 8); c.height = th + zh + 30; const g = c.getContext('2d');
      g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
      const one = document.createElement('canvas'); one.width = W; one.height = H; const o = one.getContext('2d');
      fr.forEach((f, i) => {
        o.putImageData(f.img, 0, 0); const x = i * (tw + 8);
        g.drawImage(one, x, 0, tw, th); g.strokeStyle = '#f0f'; g.lineWidth = 2; g.strokeRect(x + box[0] * tw / W - 2, box[1] * th / H - 2, (box[2] - box[0]) * tw / W + 4, (box[3] - box[1]) * th / H + 4);
        g.drawImage(one, bx, by, bw, bh, x, th + 4, zw, zh);
        g.fillStyle = '#000'; g.font = '11px sans-serif'; g.fillText((i === 0 ? 'before ' : i === fr.length - 1 ? 'after ' : 'flash ') + f.t.toFixed(3) + ' s', x + 2, th + zh + 20);
      });
      return c.toDataURL('image/png');
    };
    // Seek to the stretch, then play slowly so that every frame the film holds is shown and read once.
    v.currentTime = from; await new Promise(r => { v.onseeked = r; });
    let last = -1;
    await new Promise((res, rej) => {
      const stop = setTimeout(() => { v.pause(); res(); }, ((to - from) / rate + 20) * 1000);
      const cb = (now, md) => {
        if (last >= 0 && md.presentedFrames - last > 1) out.missed += md.presentedFrames - last - 1; last = md.presentedFrames;
        if (md.mediaTime > to) { v.pause(); clearTimeout(stop); res(); return; }
        ctx.drawImage(v, 0, 0, W, H); take(md.mediaTime);
        if (v.ended) { clearTimeout(stop); res(); return; }
        v.requestVideoFrameCallback(cb);
      };
      v.requestVideoFrameCallback(cb); v.onended = () => setTimeout(() => { clearTimeout(stop); res(); }, 300);
      v.playbackRate = rate; v.play().catch(rej);
    });
    v.remove();
    return out;
  };
}
const PAGE = `<!doctype html><meta charset="utf-8"><title>film-scan</title><body style="margin:0;background:#888"><script>(${pageMain.toString()})();</script>`;

// Static server: the page and the films (with byte ranges, so the video element can seek in a long film).
const server = http.createServer((req, res) => {
  const name = decodeURIComponent((req.url || '/').split('?')[0]).replace(/^\/+/, '');
  if (name === 'scan.html') { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(PAGE); return; }
  const c = files.find(f => f.file === name); if (!c) { res.writeHead(404); res.end(); return; }
  const p = path.join(DIR, c.file), size = fs.statSync(p).size, r = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
  if (!r) { res.writeHead(200, { 'content-type': 'video/mp4', 'content-length': size, 'accept-ranges': 'bytes' }); fs.createReadStream(p).pipe(res); return; }
  const a = r[1] === '' ? size - +r[2] : +r[1], b = r[1] !== '' && r[2] !== '' ? Math.min(+r[2], size - 1) : size - 1;
  res.writeHead(206, { 'content-type': 'video/mp4', 'content-length': b - a + 1, 'content-range': `bytes ${a}-${b}/${size}`, 'accept-ranges': 'bytes' }); fs.createReadStream(p, { start: a, end: b }).pipe(res);
});

let browser = null, profile = null, cdp = null, id = 0; const waiters = new Map();
const send = (method, params = {}) => new Promise((resolve, reject) => { const n = ++id; waiters.set(n, { resolve, reject }); cdp.send(JSON.stringify({ id: n, method, params })); });
let ok = false;
try {
  await new Promise(r => server.listen(PORT, '127.0.0.1', r));
  profile = path.join(OUT, 'profile-' + Date.now());
  browser = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${DEV}`, '--remote-debugging-address=127.0.0.1', `--user-data-dir=${profile}`, '--autoplay-policy=no-user-gesture-required', '--no-first-run', '--no-default-browser-check', '--window-size=800,1200', ...(opt['chrome-args'] ? String(opt['chrome-args']).split(' ') : []), 'about:blank'], { stdio: 'ignore' });
  for (let i = 0; i < 60; i++) { try { await fetch(`http://127.0.0.1:${DEV}/json/version`, { signal: AbortSignal.timeout(1000) }); break; } catch (e) { await sleep(500); } }
  const page = await (await fetch(`http://127.0.0.1:${DEV}/json/new?http://127.0.0.1:${PORT}/scan.html`, { method: 'PUT' })).json();
  cdp = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { cdp.onopen = resolve; cdp.onerror = e => reject(new Error('websocket: ' + (e.message || e.type))); });
  cdp.onmessage = m => { const d = JSON.parse(typeof m.data === 'string' ? m.data : m.data.toString()); if (d.id && waiters.has(d.id)) { const w = waiters.get(d.id); waiters.delete(d.id); d.error ? w.reject(new Error(d.error.message)) : w.resolve(d.result); } };
  await send('Runtime.enable'); await sleep(1500);
  const results = [];
  for (const [i, r] of rows.entries()) {
    const spec = { src: `http://127.0.0.1:${PORT}/${encodeURIComponent(r.file)}`, from: r.from, to: r.to, T, TB, rate: RATE, top: TOP };
    const res = await send('Runtime.evaluate', { expression: `scan(${JSON.stringify(spec)})`, awaitPromise: true, returnByValue: true });
    if (res.exceptionDetails) { note(`${r.label}: ERROR ${JSON.stringify(res.exceptionDetails).slice(0, 300)}`); results.push({ ...r, error: true }); continue; }
    const o = res.result.value || {};
    // Frame times while things move: intervals between shown frames whose screens both changed.
    const gaps = []; for (let k = 1; k < (o.t || []).length; k++) if (o.motion[k] > 0.25 && (k + 1 >= o.t.length || o.motion[k + 1] > 0.25)) gaps.push({ at: o.t[k], ms: (o.t[k] - o.t[k - 1]) * 1000 });
    const ms = gaps.map(g => g.ms).sort((a, b) => a - b), q = f => ms.length ? +ms[Math.min(ms.length - 1, Math.floor(ms.length * f))].toFixed(1) : null;
    const flashes = o.events || [];
    const pics = (o.pics || []).map((p, k) => { const f = `${String(i).padStart(2, '0')}-${r.label}-${k + 1}.png`; fs.writeFileSync(path.join(OUT, f), Buffer.from(p.url.split(',')[1], 'base64')); return { file: f, ...p.ev }; });
    const row = { ...r, frames: o.frames || 0, missed: o.missed || 0, why: o.why, film: o.size, moving: ms.length, p50: q(0.5), p90: q(0.9), max: ms.length ? +ms.at(-1).toFixed(1) : null, over25: ms.filter(x => x > 25).length, over50: ms.filter(x => x > 50).length,
      longest: gaps.sort((a, b) => b.ms - a.ms).slice(0, 5).map(g => [+g.at.toFixed(3), +g.ms.toFixed(1)]), flashes: flashes.length, flashFrames: new Set(flashes.map(e => e.t)).size, biggest: flashes.sort((a, b) => b.score - a.score).slice(0, 8), pics };
    results.push(row);
    note(`${r.label}: ${row.frames} frames (${row.missed} missed), moving ${row.moving}, p50 ${row.p50} ms, max ${row.max} ms, >25 ms ${row.over25}, flashes ${row.flashes} in ${row.flashFrames} frames`);
    fs.writeFileSync(path.join(OUT, 'rows.json'), JSON.stringify(results, null, 1));
  }
  const lines = ['| Row | Film stretch (s) | Frames read (missed) | Moving frames | p50 ms | p90 ms | max ms | > 25 ms | > 50 ms | Flashes (frames) | Biggest flash: when, where (share of screen), cells x strength |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |'];
  for (const r of results) { const b = r.biggest?.[0]; lines.push(`| ${r.label} | ${r.file} ${r.from.toFixed(1)}-${Math.min(r.to, 9999).toFixed(1)} | ${r.frames ?? '-'} (${r.missed ?? '-'}) | ${r.moving ?? '-'} | ${r.p50 ?? '-'} | ${r.p90 ?? '-'} | ${r.max ?? '-'} | ${r.over25 ?? '-'} | ${r.over50 ?? '-'} | ${r.flashes ?? '-'} (${r.flashFrames ?? '-'}) | ${b ? `${b.t} s, x ${b.frac[0]}-${b.frac[2]} y ${b.frac[1]}-${b.frac[3]}, ${b.cells} x ${b.max}` : '-'} |`); }
  fs.writeFileSync(path.join(OUT, 'summary.md'), lines.join('\n') + '\n'); note('\n' + lines.join('\n'));
  ok = true;
} catch (e) { note('ERROR ' + e.message); }
finally {
  try { cdp?.close(); } catch (e) {}
  server.close();
  if (browser) { try { browser.kill(); } catch (e) {} await sleep(1500); try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { note('cleanup: profile ' + e.message); } }
  process.exit(ok ? 0 : 1);
}
