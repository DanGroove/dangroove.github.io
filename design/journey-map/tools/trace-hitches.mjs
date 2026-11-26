// Where the long frames of a phone-fps --trace window go. For each rAF gap over --over ms (default 25) after the press it
// prints what each thread did inside the gap, the longest frame-pipeline stage overlapping it (Chrome's PipelineReporter:
// a long EndCommitToActivation is a commit waiting for raster, a long SendBeginMainFrameToCommit is the main thread, a long
// SubmitCompositorFrameToPresentationCompositorFrame is the GPU process), and the repaints just before it (by clip size,
// so svg#map's rebases show as its big clip). Reads the .json.gz files phone-fps --trace writes; no browser needed.
//   node tools/trace-hitches.mjs <trace.json.gz> [...more] [--over 25] [--window 4500]
import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';

const args = process.argv.slice(2), files = [], opt = { over: 25, window: 4500 };
for (let i = 0; i < args.length; i++) { if (args[i] === '--over') opt.over = +args[++i]; else if (args[i] === '--window') opt.window = +args[++i]; else files.push(args[i]); }
if (!files.length) { console.log('usage: node tools/trace-hitches.mjs <trace.json.gz> [...] [--over 25] [--window 4500]'); process.exit(1); }

const r1 = x => Math.round(x * 10) / 10;
for (const file of files) {
  const raw = fs.readFileSync(file), text = /\.gz$/.test(file) ? zlib.gunzipSync(raw).toString() : raw.toString(), parsed = JSON.parse(text);
  const ev = Array.isArray(parsed) ? parsed : parsed.traceEvents;
  const names = {}; for (const e of ev) if (e.ph === 'M' && e.name === 'thread_name') names[e.pid + ':' + e.tid] = e.args.name;
  const press = ev.filter(e => e.name === 'EventDispatch' && e.args?.data?.type === 'click').sort((a, b) => a.ts - b.ts)[0];
  if (!press) { console.log(path.basename(file) + ': no click in the trace'); continue; }
  const pid = press.pid, main = pid + ':' + press.tid, t0 = press.ts, t1 = t0 + opt.window * 1e3, ms = t => r1((t - t0) / 1e3);
  const key = e => e.pid + ':' + e.tid;
  const comp = Object.keys(names).find(k => names[k] === 'Compositor' && +k.split(':')[0] === pid);
  const gpu = Object.keys(names).filter(k => names[k] === 'CrGpuMain'), viz = Object.keys(names).filter(k => names[k] === 'VizCompositorThread');
  const raster = Object.keys(names).filter(k => /CompositorTileWorker|RasterWorker/.test(names[k]) && +k.split(':')[0] === pid);
  // Complete events per thread with self time, so nested events are not counted twice.
  const spans = {}; for (const e of ev) if (e.ph === 'X' && e.dur != null && e.ts + e.dur >= t0 && e.ts <= t1 + 1e6) (spans[key(e)] ||= []).push(e);
  for (const list of Object.values(spans)) { list.sort((a, b) => a.ts - b.ts || b.dur - a.dur); const st = []; for (const e of list) { while (st.length && st[st.length - 1].ts + st[st.length - 1].dur <= e.ts) st.pop(); e.parent = st[st.length - 1] || null; st.push(e); } }
  // Self time of a thread's events inside [a, b], by name.
  const busy = (k, a, b) => { const out = {}; let total = 0; for (const e of spans[k] || []) { const lo = Math.max(a, e.ts), hi = Math.min(b, e.ts + e.dur); if (hi <= lo) continue; let self = hi - lo; for (const c of spans[k]) if (c.parent === e) { const cl = Math.max(lo, c.ts), ch = Math.min(hi, c.ts + c.dur); if (ch > cl) self -= ch - cl; } if (self > 0) { out[e.name] = (out[e.name] || 0) + self; total += self; } } return { total, top: Object.entries(out).sort((x, y) => y[1] - x[1]).slice(0, 2).map(([n, v]) => n.replace(/^RasterDecoderImpl::/, 'RD::') + ' ' + r1(v / 1e3)) }; };
  const busyAll = (ks, a, b) => ks.map(k => busy(k, a, b)).reduce((s, x) => ({ total: s.total + x.total, top: s.top.length ? s.top : x.top }), { total: 0, top: [] });
  // Async frame-pipeline intervals (PipelineReporter and its stages), paired begin to end per id.
  const STAGES = /^(BeginImplFrameToSendBeginMainFrame|SendBeginMainFrameToCommit|Commit|EndCommitToActivation|Activation|EndActivateToSubmitCompositorFrame|SubmitCompositorFrameToPresentationCompositorFrame|SubmitToReceiveCompositorFrame|ReceiveCompositorFrameToStartDraw|StartDrawToSwapStart|SwapStartToBufferAvailable|BufferAvailableToBufferReady|BufferReadyToLatch|LatchToSwapEnd|SwapEndToPresentationCompositorFrame)$/;
  const open = {}, stages = [], reporters = [];
  for (const e of ev.filter(e => (e.ph === 'b' || e.ph === 'e') && e.pid === pid && /benchmark|devtools\.timeline\.frame/.test(e.cat || '')).sort((a, b) => a.ts - b.ts)) {
    const k = e.name + '|' + JSON.stringify(e.id2 || e.id);
    if (e.ph === 'b') (open[k] ||= []).push(e); else { const b = (open[k] || []).pop(); if (!b) continue; const iv = { name: e.name, ts: b.ts, end: e.ts, args: b.args?.frame_reporter || e.args?.frame_reporter }; if (e.name === 'PipelineReporter') reporters.push(iv); else if (STAGES.test(e.name)) stages.push(iv); }
  }
  const frames = (spans[main] || []).filter(e => e.name === 'FireAnimationFrame' && e.ts >= t0 && e.ts <= t1).map(e => e.ts).filter((t, i, a) => i === 0 || t - a[i - 1] > 500);
  const paints = (spans[main] || []).filter(e => e.name === 'Paint' && e.args?.data).map(e => { const q = e.args.data.clip || [], w = q.length >= 8 ? Math.round(Math.max(q[0], q[2], q[4], q[6]) - Math.min(q[0], q[2], q[4], q[6])) : 0, h = q.length >= 8 ? Math.round(Math.max(q[1], q[3], q[5], q[7]) - Math.min(q[1], q[3], q[5], q[7])) : 0; return { ts: e.ts, size: w + 'x' + h, area: w * h, node: e.args.data.nodeId }; });
  // Big finite repaints by node (svg#map's rebases are its whole-layer repaints; 16777215 clips are unbounded and left out).
  const bigPaints = paints.filter(p => p.area > 4096 * 2048 && !/16777215/.test(p.size) && p.ts >= t0 && p.ts <= t1), byNode = {};
  for (const p of bigPaints) (byNode[p.node] ||= []).push(p);
  const gaps = []; for (let i = 1; i < frames.length; i++) if ((frames[i] - frames[i - 1]) / 1e3 > opt.over) gaps.push([frames[i - 1], frames[i]]);
  const states = {}; for (const r of reporters) if (r.ts >= t0 && r.ts <= t1 && r.args) states[r.args.state] = (states[r.args.state] || 0) + 1;
  console.log(`${path.basename(file)}: ${frames.length} rAF frames, ${gaps.length} over ${opt.over} ms; frames presented ${JSON.stringify(states)}`);
  for (const [node, list] of Object.entries(byNode).sort((x, y) => y[1].length - x[1].length).slice(0, 4)) console.log(`  node ${node} (${list[0].size} first): ${list.length} big repaints at ms ${list.slice(0, 30).map(p => Math.round(ms(p.ts))).join(' ')}${list.length > 30 ? ' ...' : ''}`);
  for (const [a, b] of gaps) {
    const m = busy(main, a, b), c = comp ? busy(comp, a, b) : { total: 0, top: [] }, g = busyAll(gpu, a, b), v = busyAll(viz, a, b), r = busyAll(raster, a, b);
    const over = stages.filter(s => s.end > a && s.ts < b).map(s => ({ name: s.name, dur: s.end - s.ts, at: s.ts })).sort((x, y) => y.dur - x.dur)[0];
    const reps = reporters.filter(x => x.end > a && x.ts < b && x.args), flags = ['checkerboarded_needs_raster', 'checkerboarded_needs_record', 'has_missing_content'].filter(f => reps.some(x => x.args[f])).join(' ');
    const near = bigPaints.filter(p => p.ts >= a - 40e3 && p.ts <= b), before = near.length ? [near.length + ' big, nodes ' + [...new Set(near.map(p => p.node))].slice(0, 3).join(' ')] : [];
    console.log(`  at ${ms(a)} gap ${r1((b - a) / 1e3)} | longest stage ${over ? over.name + ' ' + r1(over.dur / 1e3) : '-'} | main ${r1(m.total / 1e3)} (${m.top.join(', ')}) | comp ${r1(c.total / 1e3)} (${c.top.join(', ')}) | raster ${r1(r.total / 1e3)} | gpu ${r1(g.total / 1e3)} (${g.top.join(', ')}) | viz ${r1(v.total / 1e3)}${flags ? ' | ' + flags : ''} | paints ${before.join(' ') || '-'}`);
  }
}
