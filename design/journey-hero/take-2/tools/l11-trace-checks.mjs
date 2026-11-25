// Reduce local CDP traces to frame tables. Raw traces remain the attribution evidence.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const base = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.scratch/review-out/r19');
const run = process.argv[2] || 'baseline';
const out = path.join(base, 'l11-' + run);
const result = [];
const overlap = (a, b, x, y) => Math.max(0, Math.min(b, y) - Math.max(a, x));
for (const size of ['1440x900', '412x730']) {
  const frames = JSON.parse(await fs.readFile(path.join(out, size + '-frames.json'), 'utf8'));
  let raw = await fs.readFile(path.join(out, size + '-trace.json'), 'utf8');
  const trace = JSON.parse(raw).traceEvents; raw = null;
  const names = new Map(trace.filter(e => e.name === 'thread_name').map(e => [e.pid + ':' + e.tid, e.args.name]));
  const marker = trace.find(e => e.name === 'TimeStamp' && e.args?.data?.message === 'L11:first-frame');
  if (!marker) throw new Error('missing clock marker');
  const origin = marker.ts / 1000 - frames.marks['first-frame'];
  const main = marker.pid + ':' + marker.tid;
  const threads = new Map();
  const counts = new Map();
  for (const e of trace) {
    counts.set(e.name, (counts.get(e.name) || 0) + 1);
    if (e.ph !== 'X' || !e.dur) continue;
    const key = e.pid + ':' + e.tid;
    if (!threads.has(key)) threads.set(key, []);
    threads.get(key).push({ name: e.name, start: e.ts / 1000 - origin, end: (e.ts + e.dur) / 1000 - origin, args: e.args });
  }
  const profiles = new Map();
  const samples = [];
  try {
    const records = JSON.parse(await fs.readFile(path.join(out, size + '-cpu.json'), 'utf8'));
    for (const { thread, profile } of records) {
      const key = thread === 'main' ? main : [...names].find(([,n])=>/DedicatedWorker/.test(n))?.[0];
      const p = { thread: key, nodes: new Map(profile.nodes.map(n=>[n.id,n])), clock: profile.startTime };
      for (const n of profile.nodes) for (const child of n.children || []) p.nodes.get(child).parent = n.id;
      for (let i=0;i<profile.samples.length;i++) {
        const dt = profile.timeDeltas[i]; p.clock += dt;
        samples.push({p,node:profile.samples[i],start:(p.clock-dt)/1000-origin,end:p.clock/1000-origin});
      }
    }
  } catch (e) { if (e.code !== 'ENOENT') throw e; }
  for (const e of trace) {
    const data = e.args?.data;
    if (!data || !['Profile', 'ProfileChunk'].includes(e.name)) continue;
    const key = e.pid + ':' + e.tid + ':' + e.id;
    if (!profiles.has(key)) profiles.set(key, { nodes: new Map(), clock: 0, thread: e.pid + ':' + e.tid });
    const p = profiles.get(key);
    if (data.startTime) p.clock = data.startTime;
    for (const node of data.cpuProfile?.nodes || []) p.nodes.set(node.id, node);
    const ids = data.cpuProfile?.samples || [];
    for (let i = 0; i < ids.length; i++) {
      const dt = data.timeDeltas?.[i] || 0; p.clock += dt;
      samples.push({ p, node: ids[i], start: (p.clock - dt) / 1000 - origin, end: p.clock / 1000 - origin });
    }
  }
  const category = name => /Layout|Style|UpdateLayoutTree|PrePaint/.test(name) ? 'style/layout'
    : /Paint|Raster|Composite|Commit|DrawFrame|SubmitCompositor/.test(name) ? 'paint/raster/composite'
    : /Compile|Shader|Program/.test(name) ? 'compile'
    : /texImage|Texture|Upload/.test(name) ? 'texture/upload'
    : /GC|Garbage/.test(name) ? 'GC' : /gpu|D3D|commandbuffer|gles/i.test(name) ? 'GPU' : null;
  function attribution(a, b, key) {
    const own = threads.get(key) || [];
    const top = own.filter(e => e.start < b && e.end > a && !/RunTask|ThreadController|TaskQueue|ProcessTask|MainThreadTask/.test(e.name))
      .map(e => ({ ...e, ms: overlap(a, b, e.start, e.end) })).sort((p, q) => q.ms - p.ms);
    const cpu = new Map();
    for (const s of samples) {
      if (s.p.thread !== key || s.end <= a || s.start >= b) continue;
      let node = s.p.nodes.get(s.node), name = node?.callFrame?.functionName || '(anonymous)';
      if (name === '(idle)') continue;
      const stack = [name];
      for (let depth = 0; node?.parent && depth < 5; depth++) { node = s.p.nodes.get(node.parent); if (node?.callFrame?.functionName) stack.push(node.callFrame.functionName); }
      name = stack.join(' ← '); cpu.set(name, (cpu.get(name) || 0) + overlap(a, b, s.start, s.end));
    }
    const workers = [];
    for (const [k, list] of threads) {
      if (k === key || !/gpu|raster|compositor|dawn|grcontext|viz/i.test(names.get(k) || '')) continue;
      const sums = new Map();
      for (const e of list) { const c = category(e.name); if (!c) continue; const ms = overlap(a,b,e.start,e.end); if (ms) sums.set(e.name,(sums.get(e.name)||0)+ms); }
      const sorted=[...sums].sort((p,q)=>q[1]-p[1]);
      const detailed=sorted.filter(([name])=>/RasterDecoder|Shader|Compile|TexImage|Upload/.test(name)).slice(0,2);
      for (const [name, ms] of [...detailed,...sorted.filter(([name])=>!detailed.some(([n])=>n===name))].slice(0,4)) workers.push(`${names.get(k)} ${name} ${ms.toFixed(2)}`);
    }
    return {
      spans: top.slice(0, 7).map(e => `${e.name}${e.args?.data?.functionName ? ':' + e.args.data.functionName : ''} ${e.ms.toFixed(2)}`),
      cpu: [...cpu].sort((p,q)=>q[1]-p[1]).slice(0,6).map(([n,ms]) => n + ' ' + ms.toFixed(2)),
      parallel: workers.slice(0, 8),
    };
  }
  const inScope = t => (t <= frames.marks['load-end']) || (t >= frames.marks['hold-start'] && t <= frames.marks['release-end']);
  const phase = t => t <= frames.marks['load-end'] ? 'load' : t < frames.marks.release ? 'hold' : 'release';
  const rows = [];
  const workerGaps = [];
  for (let i = 1; i < frames.frames.length; i++) {
    const a = frames.frames[i-1].now, b = frames.frames[i].now;
    if (b-a > 20 && inScope(b)) rows.push({ thread: 'main', phase: phase(b), start: a, end: b, ms: b-a, ...attribution(a,b,main) });
  }
  // Worker animation callback intervals are independent of the main-thread sampling rAF.
  for (const [key, list] of threads) {
    if (!/DedicatedWorker/.test(names.get(key) || '')) continue;
    const ticks = list.filter(e => e.name === 'FireAnimationFrame').map(e=>e.start).filter((t,i,a)=>!i||t-a[i-1]>1);
    for (let i=1;i<ticks.length;i++) {
      const a=ticks[i-1], b=ticks[i];
      if (b <= frames.marks.landing) workerGaps.push(b-a);
      if (b-a > 20 && b <= frames.marks.landing) rows.push({thread:'loader worker',phase:'load',start:a,end:b,ms:b-a,...attribution(a,b,key)});
    }
  }
  rows.sort((a,b)=>a.start-b.start);
  const stats = {};
  for (const name of ['load','hold','release']) {
    const gaps=frames.frames.slice(1).filter(f=>inScope(f.now)&&phase(f.now)===name).map(f=>f.now-frames.frames[frames.frames.indexOf(f)-1].now).sort((a,b)=>a-b);
    stats[name]={count:gaps.length,max:gaps.at(-1),p95:gaps[Math.floor(.95*(gaps.length-1))],over20:gaps.filter(v=>v>20).length};
  }
  workerGaps.sort((a,b)=>a-b);
  stats.worker={count:workerGaps.length,max:workerGaps.at(-1),p95:workerGaps[Math.floor(.95*(workerGaps.length-1))],over20:workerGaps.filter(v=>v>20).length};
  const record = { size, origin, main, threads:[...names], marks:frames.marks, stats, rows, counts:[...counts].sort((a,b)=>b[1]-a[1]).slice(0,35) };
  result.push(record);
  await fs.writeFile(path.join(out,size+'-table.json'),JSON.stringify(record,null,2));
  console.log(size + ': ' + rows.length + ' frames >20ms ' + JSON.stringify(rows.map(r=>({thread:r.thread,phase:r.phase,ms:+r.ms.toFixed(2),at:+r.start.toFixed(2),spans:r.spans,cpu:r.cpu}))));
}
const markdown = ['# L11 '+run+' frames over 20 ms', '', 'Times are milliseconds since navigation. Main rows use actual rAF callback starts; worker rows use traced FireAnimationFrame starts. CPU samples are statistical, nested spans overlap, parallel GPU/raster work is not additive to main time.', ''];
for (const r of result) {
  markdown.push('## '+r.size,'','| Thread / phase | From–to ms | Gap ms | Trace spans; sampled functions | Parallel GPU/raster |','| --- | ---: | ---: | --- | --- |');
  for(const row of r.rows) markdown.push(`| ${row.thread} / ${row.phase} | ${row.start.toFixed(2)}–${row.end.toFixed(2)} | ${row.ms.toFixed(2)} | ${row.spans.join('; ')}. CPU: ${row.cpu.join('; ') || 'no sampled JS'} | ${row.parallel.join('; ') || 'no named GPU/raster span'} |`);
  if(!r.rows.length) markdown.push('| both measured paths | — | none | No interval over 20 ms | — |');
  markdown.push('');
  markdown.push('Main-frame statistics: '+JSON.stringify(r.stats),'');
}
await fs.writeFile(path.join(out,'frame-table.md'),markdown.join('\n'));
