// L13c replaces L13b check 4. Real offline Edge, exact assignment-time observations.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { previewMarkup } from './preview.mjs';

const take = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(take, '.scratch/l13c');
const require = createRequire(import.meta.url);
function localPlaywright() {
  try { return require('playwright'); } catch {
    const runtimes = path.join(process.env.LOCALAPPDATA, 'OpenAI/Codex/runtimes/cua_node');
    const installed = fs.readdirSync(runtimes).map(d => path.join(runtimes, d, 'bin/node_modules/playwright-core')).find(p => fs.existsSync(p));
    if (!installed) throw Error('Local Playwright is required; this tool never installs packages.');
    return require(installed);
  }
}
function replaceOnce(text, old, replacement) {
  assert.equal(text.split(old).length, 2, 'L13c instrumentation: unique site ' + old.slice(0, 60));
  return text.replace(old, replacement);
}
function instrument(html) {
  // Wrap assignment so e0 and e are observed before gather advances their damping.
  // This includes ring departures, even on frames that have no fresh capture.
  html = replaceOnce(html, '  function assign(hold, ids, C) {', `  function assign(hold, ids, C) {
    const first = hold.next === 0, before = new Set([...cluster].filter(([, c]) => c.point !== undefined).map(([i]) => i));
    const candidates = [...ids, ...ring.order].map(i => { const [x, y] = position(i); return { i, x, y, ring: !!cluster.get(i).ring }; });
    const free = [...hold.freePoints].map(j => ({ j, ...mark.points[j] }));
    const order = assignObserved(hold, ids, C);
    const rows = order.map(i => {
      const c = cluster.get(i);
      const p = mark.points[c.point], start = [p.x + c.e[0], p.y + c.e[1]];
      const candidate = candidates.find(t => t.i === i);
      return { i, point: c.point, flight: c.e0, distance: Math.hypot(...start),
        start, target: [p.x, p.y], dot: start[0] * p.x + start[1] * p.y, ring: candidate.ring };
    });
    globalThis.__l13cAssignment?.({ first, held: hold.held, centre: C.slice(), candidates, free, rows,
      next: hold.next, assigned: before.size + rows.length, ring: ring.order.slice(),
      waiting: [...cluster].filter(([, c]) => c.point === undefined).map(([i, c]) => ({ i, ring: c.ring })) });
  }
  function assignObserved(hold, ids, C) {`);
  html = replaceOnce(html, '    if (rest.length) join(rest.map(t => t.i), C);',
    '    if (rest.length) join(rest.map(t => t.i), C); return take.map(t => t.i);');
  return replaceOnce(html, 'const field = stars?.frame(state ? starReach(state.stars, centre, W, H) : null, centre);',
    'const field = stars?.frame(state ? starReach(state.stars, centre, W, H) : null, centre); globalThis.__l13cFrame?.(stars?.mark);');
}
export function flightGate(row, kind) {
  assert.ok(row.count > 100, 'L13c flights: later assignments exercised');
  assert.ok(row.fraction <= .01, `L13c flights: ${kind} ${row.crossings}/${row.count} cross the centre-distance limit`);
  assert.equal(row.farSide, 0, 'L13c near side: every destination angle must be under 90 degrees');
  assert.ok(row.formed !== null && row.filled !== null && row.assigned === row.points, 'L13c fill: every point taken');
  assert.ok(row.fillTime <= (kind === 'still' ? 1.25 : .5) + 1e-9, `L13c fill: ${kind} ${row.fillTime} s`);
}
function summarize(data) {
  const rows = data.batches.filter(b => !b.first).flatMap(b => b.rows);
  const flights = rows.map(r => r.flight).sort((a, b) => a - b);
  const crossings = rows.filter(r => r.flight > r.distance + 1e-8).length;
  return { count: rows.length, crossings, fraction: crossings / rows.length,
    farSide: rows.filter(r => r.dot <= 0).length,
    p50: flights[Math.floor(.5 * (flights.length - 1))], p95: flights[Math.floor(.95 * (flights.length - 1))], max: flights.at(-1),
    ringAssignments: rows.filter(r => r.ring).length,
    firstBatch: data.batches.filter(b => b.first).flatMap(b => b.rows).map(r => [r.i, r.point]),
    formed: data.formed, filled: data.filled, fillTime: data.filled === null || data.formed === null ? null : data.filled - data.formed,
    assigned: data.mark.assigned, points: data.mark.points, ring: data.mark.ring.count, centre: data.centre };
}
// Exhaustive oracle, independent of assign's nearest-point cache and greedy loop.
function assignmentGate(data) {
  let checked = 0, ringAssignments = 0, ringOnlyFrames = 0;
  const seen = new Set(), points = new Set();
  for (const batch of data.batches) {
    assert.equal(batch.next, batch.assigned, 'L13c count: hold.next counts actual assignments');
    for (const waiting of batch.waiting) assert.ok(waiting.ring && batch.ring.includes(waiting.i), 'L13c wait: unassigned captures join the ring');
    const candidates = new Map(batch.candidates.map(t => [t.i, t]));
    const free = new Map(batch.free.map(p => [p.j, p]));
    const eligible = (t, p) => (t.x - batch.centre[0] - p.x) ** 2 + (t.y - batch.centre[1] - p.y) ** 2 <
      (t.x - batch.centre[0]) ** 2 + (t.y - batch.centre[1]) ** 2;
    for (const row of batch.rows) {
      assert.ok(!seen.has(row.i) && !points.has(row.point), 'L13c assignment: star and point assigned once');
      seen.add(row.i); points.add(row.point);
      if (batch.first) continue;
      const chosen = candidates.get(row.i), target = free.get(row.point);
      assert.ok(chosen && target && eligible(chosen, target), 'L13c pairing: eligible point only');
      let minimum = Infinity;
      for (const t of candidates.values()) for (const p of free.values()) if (eligible(t, p)) {
        minimum = Math.min(minimum, (t.x - batch.centre[0] - p.x) ** 2 + (t.y - batch.centre[1] - p.y) ** 2);
      }
      assert.ok(Math.abs(row.flight ** 2 - minimum) < 1e-6, 'L13c pairing: closest eligible pair first');
      if (row.ring) { ringAssignments++; assert.ok(!batch.ring.includes(row.i), 'L13c departure: assigned star leaves the ring'); }
      candidates.delete(row.i); free.delete(row.point); checked++;
    }
    if (!batch.first) {
      for (const t of candidates.values()) for (const p of free.values()) assert.ok(!eligible(t, p), 'L13c pairing: eligible ring/capture left waiting');
      if (batch.candidates.length && batch.candidates.every(t => t.ring)) ringOnlyFrames++;
    }
  }
  assert.equal(seen.size, data.mark.assigned, 'L13c observation: all assignments recorded');
  return { checked, ringAssignments, ringOnlyFrames };
}
function oldRule(html) {
  // Reconstruct L13b's nearest-free-only behavior in memory; no fixture or git dependency.
  html = replaceOnce(html, '      for (const i of ring.order) {', '      for (const i of []) {');
  html = replaceOnce(html, '          if (d < t.limit && d < t.distance)', '          if (d < t.distance)');
  return replaceOnce(html, 'if (fresh.length || (hold.freePoints.size && ring.order.length))', 'if (fresh.length)');
}
export async function checkL13c({ baseline = false } = {}) {
  fs.mkdirSync(out, { recursive: true });
  const html = (baseline ? fs.readFileSync(path.join(out, 'preview-before.html'), 'utf8') : previewMarkup()).replace(/\r\n/g, '\n');
  const result = { baseline, runs: {}, controls: {}, requests: [], errors: [], positiveFailures: [], closedProfiles: [] };
  const profile = path.join(out, 'edge-' + (baseline ? 'before' : 'after'));
  const context = await localPlaywright().chromium.launchPersistentContext(profile, {
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true,
    viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1,
    args: ['--disable-background-networking', '--disable-component-update', '--disable-sync', '--no-first-run', '--no-default-browser-check', '--disable-extensions'],
  });
  async function run(markup, kind, name) {
    const file = path.join(out, name + '.html');
    fs.writeFileSync(file, instrument(markup));
    const page = await context.newPage();
    let clockInstalled = false;
    try {
      await page.goto(pathToFileURL(file).href + '?t=1');
      await page.bringToFront();
      await page.waitForFunction(() => window.__ready && !__hero.loading && __hero.entering === null);
      await page.clock.install({ time: new Date('2026-11-24T12:00:00Z') });
      clockInstalled = true;
      await page.clock.pauseAt(new Date('2026-11-24T12:00:01Z'));
      const box = await page.locator('[data-stage-box]').boundingBox();
      const centre = [box.x + box.width / 2, box.y + box.height / 2];
      await page.evaluate(() => {
        window.__l13cData = { batches: [], formed: null, filled: null };
        window.__l13cAssignment = batch => __l13cData.batches.push(batch);
        window.__l13cFrame = mark => {
          if (!mark || !window.__l13cStart) return;
          const t = (performance.now() - __l13cStart) / 1000;
          if (mark.formed && __l13cData.formed === null) __l13cData.formed = t;
          if (mark.formed && mark.assigned === mark.points && __l13cData.filled === null) __l13cData.filled = t;
        };
      });
      await page.mouse.move(...(kind === 'fast' ? [1320, 450] : centre));
      await page.mouse.down();
      await page.evaluate(() => { window.__l13cStart = performance.now(); });
      // Both paths advance once per 16 ms frame, including the final 8 ms to exactly 9 s.
      for (let ms = 16; ms <= 9000; ms += 16) {
        if (kind === 'fast') {
          const wt = 2 * Math.PI * 1.2 * ms / 1000;
          await page.mouse.move(900 + 420 * Math.cos(wt) + 120 * Math.sin(3.1 * wt), 450 + 315 * Math.sin(wt));
        }
        await page.clock.runFor(16);
      }
      await page.clock.runFor(8);
      const data = await page.evaluate(() => ({ ...__l13cData, mark: __hero.stars.mark }));
      data.centre = centre;
      const row = summarize(data);
      if (!baseline && !name.startsWith('nearest-control')) row.pairing = assignmentGate(data);
      fs.writeFileSync(path.join(out, name + '-flights.json'), JSON.stringify(data, null, 2));
      await page.mouse.up();
      return row;
    } finally {
      if (clockInstalled) await page.clock.resume();
      await page.close();
    }
  }
  try {
    await context.route('**/*', route => {
      const url = route.request().url();
      if (/^(file|data|blob):/.test(url)) return route.continue();
      result.requests.push(url); return route.abort('blockedbyclient');
    });
    context.on('page', p => p.on('pageerror', e => result.errors.push(e.message)));
    for (const kind of ['still', 'fast']) result.runs[kind] = await run(html, kind, (baseline ? 'before-' : 'after-') + kind);
    if (!baseline) {
      const control = await run(oldRule(html), 'fast', 'nearest-control-fast');
      let failure;
      try { flightGate(control, 'fast'); } catch (error) { failure = error.message.split('\n')[0]; }
      assert.ok(failure?.startsWith('L13c flights: fast'), 'L13c negative control escaped the fast flight gate: ' + failure);
      result.controls.nearest = { ...control, gate: failure };
      for (const kind of ['still', 'fast']) {
        try { flightGate(result.runs[kind], kind); } catch (error) { result.positiveFailures.push(error.message.split('\n')[0]); }
      }
    }
    assert.deepEqual(result.requests, [], 'L13c offline: attempted network request');
    assert.deepEqual(result.errors, [], 'L13c page errors');
    assert.deepEqual(result.positiveFailures, [], 'L13c positive gates failed: ' + result.positiveFailures.join('; '));
  } finally {
    await context.close(); result.closedProfiles.push(profile);
    fs.writeFileSync(path.join(out, baseline ? 'before.json' : 'after.json'), JSON.stringify(result, null, 2));
  }
  return result;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log('L13c: ' + JSON.stringify(await checkL13c({ baseline: process.argv.includes('--baseline') })));
}
