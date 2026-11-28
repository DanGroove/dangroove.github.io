// What the page's main thread does in a stretch of a phone-fps --trace window: for each slice of --step ms between --from and
// --to (ms after the press, or after the first animation frame for a gesture beat) the main thread's busy time and its
// top-level stages (script, style, layout, paint, layerize, commit); the script entry points in the stretch; and, when the
// trace was recorded with phone-fps --js (V8's sampling profiler in the trace), the page functions that took the time, by
// module and line of the packed page (--page, the html the run served). Reads the .json.gz files; no browser needed.
//   node tools/trace-js.mjs <trace.json.gz> [--page <served.html>] [--from 3500] [--to 9000] [--step 250] [--top 16]
import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';

const args = process.argv.slice(2), files = [], opt = { from: 3500, to: 9000, step: 250, top: 16, page: null };
for (let i = 0; i < args.length; i++) { const k = args[i].replace(/^--/, ''); if (k in opt && k !== args[i]) opt[k] = k === 'page' ? args[++i] : +args[++i]; else files.push(args[i]); }
if (!files.length) { console.log('usage: node tools/trace-js.mjs <trace.json.gz> [--page <served.html>] [--from 3500] [--to 9000] [--step 250] [--top 16]'); process.exit(1); }

// Line i of the packed page belongs to the module whose "// ---- name.mjs ----" marker is the last one at or above it (the
// pack keeps each module's lines, so the number printed is the line in the module's own file, give or take one).
const src = opt.page ? fs.readFileSync(opt.page, 'utf8').split('\n') : null, marks = [];
if (src) src.forEach((l, i) => { const m = l.match(/^\/\/ ---- (\S+\.mjs) ----/); if (m) marks.push([i, m[1]]); });
const where = (line, col) => { if (!src) return 'line ' + (line + 1) + ':' + (col + 1); let m = null; for (const k of marks) if (k[0] <= line) m = k; const s = src[line] || ''; return (m ? m[1] + ':' + (line - m[0] + 1) : 'line ' + (line + 1)) + ' ' + JSON.stringify(s.slice(Math.max(0, col), col + 48)); };
const r1 = x => Math.round(x * 10) / 10;
const STAGES = { FunctionCall: 'script', TimerFire: 'script', FireAnimationFrame: 'script', EventDispatch: 'script', 'v8.callFunction': 'script', UpdateLayoutTree: 'style', Layout: 'layout', PrePaint: 'prepaint', Paint: 'paint', Layerize: 'layerize', 'PaintArtifactCompositor::Update': 'layerize', Commit: 'commit', HitTest: 'hit test', MajorGC: 'gc', MinorGC: 'gc', 'V8.GC_SCAVENGER': 'gc', 'V8.GC_MARK_COMPACTOR': 'gc' };

for (const file of files) {
  const raw = fs.readFileSync(file), text = /\.gz$/.test(file) ? zlib.gunzipSync(raw).toString() : raw.toString(), parsed = JSON.parse(text);
  const ev = Array.isArray(parsed) ? parsed : parsed.traceEvents;
  let press = ev.filter(e => e.name === 'EventDispatch' && e.args?.data?.type === 'click').sort((a, b) => a.ts - b.ts)[0];
  if (!press) { const fires = ev.filter(e => e.name === 'FireAnimationFrame' && e.ph === 'X'), count = {}; for (const e of fires) count[e.pid + ':' + e.tid] = (count[e.pid + ':' + e.tid] || 0) + 1; const top = Object.entries(count).sort((x, y) => y[1] - x[1])[0]?.[0]; press = top ? fires.filter(e => e.pid + ':' + e.tid === top).sort((a, b) => a.ts - b.ts)[0] : null; }
  if (!press) { console.log(path.basename(file) + ': no click and no animation frames'); continue; }
  const main = press.pid + ':' + press.tid, t0 = press.ts, at = t => (t - t0) / 1e3, inWin = t => at(t) >= opt.from && at(t) < opt.to;
  const mine = ev.filter(e => e.pid + ':' + e.tid === main && e.ph === 'X' && e.dur != null).sort((a, b) => a.ts - b.ts || b.dur - a.dur);
  // Outermost events of each named stage only (a FunctionCall inside FireAnimationFrame counts once).
  const st = []; for (const e of mine) { while (st.length && st[st.length - 1].ts + st[st.length - 1].dur <= e.ts) st.pop(); e.outer = !st.some(p => STAGES[p.name] && STAGES[p.name] === STAGES[e.name]); st.push(e); }
  const tasks = mine.filter(e => e.name === 'RunTask' || e.name === 'ThreadControllerImpl::RunTask'), topTasks = tasks.filter(e => !tasks.some(p => p !== e && p.ts <= e.ts && p.ts + p.dur >= e.ts + e.dur));
  const frames = mine.filter(e => e.name === 'FireAnimationFrame');
  console.log(path.basename(file), 'from +' + opt.from, 'to +' + opt.to, 'ms after', press.name === 'EventDispatch' ? 'the press' : 'the first animation frame');
  console.log('  slice    rAF  busy  ' + ['script', 'style', 'layout', 'prepaint', 'paint', 'layerize', 'commit', 'gc'].map(s => s.padStart(8)).join(''));
  for (let a = opt.from; a < opt.to; a += opt.step) {
    const inS = e => at(e.ts) >= a && at(e.ts) < a + opt.step, by = {};
    for (const e of mine) if (e.outer && STAGES[e.name] && inS(e)) by[STAGES[e.name]] = (by[STAGES[e.name]] || 0) + e.dur / 1e3;
    const busy = topTasks.filter(inS).reduce((s, e) => s + e.dur / 1e3, 0);
    console.log('  +' + String(a).padStart(5), String(frames.filter(inS).length).padStart(5), String(Math.round(busy)).padStart(5), ['script', 'style', 'layout', 'prepaint', 'paint', 'layerize', 'commit', 'gc'].map(s => String(r1(by[s] || 0)).padStart(8)).join(''));
  }
  // Script entry points in the stretch.
  const entries = new Map();
  for (const e of mine) { if (!inWin(e.ts) || !/^(FunctionCall|TimerFire|EventDispatch|v8\.callFunction)$/.test(e.name)) continue; const d = e.args?.data || {}; const k = e.name + ' ' + (d.functionName || d.type || '') + (d.url ? ' ' + where((d.lineNumber || 1) - 1, (d.columnNumber || 1) - 1) : ''); const o = entries.get(k) || { n: 0, ms: 0, max: 0 }; o.n++; o.ms += e.dur / 1e3; o.max = Math.max(o.max, e.dur / 1e3); entries.set(k, o); }
  console.log('  script entries (calls, total ms, longest ms):');
  for (const [k, o] of [...entries].sort((x, y) => y[1].ms - x[1].ms).slice(0, opt.top)) console.log('   ', String(o.n).padStart(5), String(r1(o.ms)).padStart(8), String(r1(o.max)).padStart(7), k.slice(0, 200));
  // V8 samples (phone-fps --js): Profile + ProfileChunk events on the main thread.
  const prof = ev.filter(e => e.name === 'Profile' && e.pid + ':' + e.tid === main);
  if (!prof.length) { console.log('  no JS samples in this trace (record with phone-fps --trace --js)'); continue; }
  const self = new Map(), total = new Map();
  for (const p of prof) {
    const nodes = new Map(), chunks = ev.filter(e => e.name === 'ProfileChunk' && e.id === p.id).sort((a, b) => a.ts - b.ts);
    let t = p.args.data.startTime;
    for (const c of chunks) {
      const d = c.args.data || {}, cp = d.cpuProfile || {};
      for (const n of cp.nodes || []) nodes.set(n.id, n);
      (cp.samples || []).forEach((id, i) => { t += (d.timeDeltas || [])[i] || 0; if (!inWin(t)) return; const n = nodes.get(id); if (!n) return; const f = n.callFrame, k = (f.functionName || '(anonymous)') + ' ' + (f.url ? where(f.lineNumber, f.columnNumber) : '(' + (f.url || 'native') + ')'); self.set(k, (self.get(k) || 0) + 1);
        const seen = new Set(); for (let q = n; q; q = nodes.get(q.parent)) { const g = q.callFrame; if (!g.url) continue; const kk = (g.functionName || '(anonymous)') + ' ' + where(g.lineNumber, g.columnNumber); if (!seen.has(kk)) { seen.add(kk); total.set(kk, (total.get(kk) || 0) + 1); } } });
    }
  }
  const n = [...self.values()].reduce((s, v) => s + v, 0) || 1;
  console.log('  JS samples in the stretch: ' + n + '; self share:'); for (const [k, v] of [...self].sort((x, y) => y[1] - x[1]).slice(0, opt.top)) console.log('   ', (100 * v / n).toFixed(1).padStart(6) + '%', k.slice(0, 200));
  console.log('  page functions, share of samples inside them:'); for (const [k, v] of [...total].sort((x, y) => y[1] - x[1]).slice(0, opt.top)) console.log('   ', (100 * v / n).toFixed(1).padStart(6) + '%', k.slice(0, 200));
}
