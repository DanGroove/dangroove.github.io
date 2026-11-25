// L16: real-time launch schedules and readiness on the inline loader's own clock.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { previewMarkup } from './preview.mjs';

const take = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(take, '.scratch/l16');
const require = createRequire(import.meta.url);
function localPlaywright() {
  try { return require('playwright'); } catch {
    const runtimes = path.join(process.env.LOCALAPPDATA, 'OpenAI/Codex/runtimes/cua_node');
    const installed = fs.readdirSync(runtimes).map(d => path.join(runtimes, d, 'bin/node_modules/playwright-core')).find(p => fs.existsSync(p));
    if (!installed) throw Error('Local Playwright required. This check never installs packages.');
    return require(installed);
  }
}
function replaceOnce(text, from, to) {
  assert.equal(text.split(from).length, 2, 'L16 probe: unique site ' + from);
  return text.replace(from, to);
}
function legacyLaunches(html) {
  // Recreate 3232c60's continuous progress crossing, including its boot plateaus.
  // Apply to both packed copies; the inline copy is also the worker's source.
  const site = 'const launches = Array.from({ length: count }, (_, i) => launchShare(i, count) / rate);';
  assert.equal(html.split(site).length, 3, 'L16 control: inline and module copies');
  html = html.replaceAll(site, `const legacyCrossing = share => {
    let value = 0, goal = 0, previous = 0;
    for (const [at, amount] of events) {
      const reached = Math.min(goal, value + rate * (at - previous));
      if (goal > 0 && share <= reached) return previous + Math.max(0, share - value) / rate;
      value = reached; goal += amount; previous = at;
    }
    return goal > 0 && share <= goal ? previous + Math.max(0, share - value) / rate : Infinity;
  };
  const launches = Array.from({ length: count }, (_, i) => legacyCrossing(launchShare(i, count)));`);
  const readySite = 'const fullAt = ready ? events.at(-1)[0] : Infinity;';
  assert.equal(html.split(readySite).length, 3, 'L16 control: both readiness copies');
  return html.replaceAll(readySite, 'const fullAt = ready ? legacyCrossing(1) : Infinity;');
}
function observeLoader() {
  const data = window.__l16 = { boot: {}, frames: [], schedules: [], firstObserved: {}, complete: false };
  let current, previous;
  Object.defineProperty(window, '__loaderStars', {
    configurable: true,
    get: () => current,
    set(bridge) {
      current = bridge;
      const boot = bridge.boot;
      bridge.boot = function (key) {
        const result = boot.call(this, key);
        // Same clock and pre-first-frame clamp as the inline bridge; no runtime edits.
        data.boot[key] = bridge.state(performance.now() / 1000).time;
        return result;
      };
    },
  });
  const tick = () => {
    if (current) {
      const s = current.state(performance.now() / 1000);
      const launches = s.launches.map(t => t);
      if (!previous || launches.some((t, i) => t !== previous[i])) {
        data.schedules.push({ time: s.time, launches }); previous = launches;
      }
      const frame = { time: s.time, phase: s.phase, formedAt: s.formedAt, holdAt: s.holdAt,
        shrinkStart: s.shrinkStart, compressedStart: s.compressedStart, swellStart: s.swellStart,
        burstStart: s.burstStart, entranceStart: s.entranceStart, arrived: s.arrived, fill: s.fill, target: s.target };
      data.frames.push(frame);
      data.firstObserved[s.phase] ??= s.time;
      data.last = { ...frame, launches };
      data.backend = current.mode;
      if (s.phase === 'entrance') { data.complete = true; return; }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
function launchStats(launches) {
  const sorted = [...launches].sort((a, b) => a - b), batches = [];
  let maxGap = 0;
  for (let i = 0; i < sorted.length; i++) {
    const gap = i ? sorted[i] - sorted[i - 1] : 0;
    maxGap = Math.max(maxGap, gap);
    if (!i || gap > .12) batches.push({ count: 0, first: sorted[i], last: sorted[i] });
    batches.at(-1).count++; batches.at(-1).last = sorted[i];
  }
  return { count: sorted.length, first: sorted[0], last: sorted.at(-1), maxGap, batches };
}
const near = (actual, expected, gate, epsilon = 1e-9) => assert.ok(Math.abs(actual - expected) <= epsilon, `${gate}: ${actual} versus ${expected}`);
export function l16BrowserGate(row) {
  const { data, stats } = row, last = data.last;
  assert.ok(data.complete && data.frames.length > 1, 'L16 observation: sampled through entrance');
  assert.ok(last.launches.length === 600 && last.launches.every(Number.isFinite), 'L16 stream: 600 finite launches');
  assert.ok(stats.maxGap <= .010, `L16 stream: launch gap ${(stats.maxGap * 1000).toFixed(3)} ms exceeds 10 ms`);
  near(stats.last, 1.4, 'L16 stream: last launch');
  for (let i = 0; i < 600; i++) near(last.launches[i], 1.4 * i / 599, 'L16 stream: star ' + i);
  assert.deepEqual(Object.keys(data.boot).sort(), ['atlas', 'fonts', 'frame'], 'L16 boot: three observed steps');
  const readyAt = Math.max(...Object.values(data.boot)), holdAt = Math.max(2.4, readyAt);
  near(last.formedAt, 2.4, 'L16 formation: last landing');
  near(last.holdAt, holdAt, 'L16 hold: later of formation and readiness', .017);
  near(last.burstStart, last.holdAt + .15 + .35 + .08 + .18, 'L16 burst: retained wind-up');
  for (const s of data.frames) {
    if (s.time >= 2.4) assert.equal(s.arrived, 600, 'L16 formation: all arrived by 2.40 s');
    if (s.phase === 'hold') assert.ok(s.time >= holdAt - .017, 'L16 hold: before readiness');
  }
  if (row.lateAtlas) assert.ok(readyAt > 2.4, 'L16 late atlas: final step after 2.40 s');
  return { id: row.id, W: row.W, H: row.H, cpuRate: row.cpuRate, lateAtlas: row.lateAtlas,
    backend: data.backend, frames: data.frames.length, boot: data.boot, ...stats,
    formedAt: last.formedAt, holdAt: last.holdAt, burstStart: last.burstStart,
    firstObserved: data.firstObserved };
}
const cases = [
  ...[[1440, 900], [390, 844], [412, 730]].flatMap(([W, H]) => [1, 2].map(repeat => ({ id: `${W}-${H}-${repeat}`, W, H, cpuRate: 1, lateAtlas: false }))),
  { id: '1440-cpu4', W: 1440, H: 900, cpuRate: 4, lateAtlas: false },
  { id: '1440-late-atlas', W: 1440, H: 900, cpuRate: 1, lateAtlas: true },
];
export async function checkL16({ baseline = false } = {}) {
  fs.mkdirSync(out, { recursive: true });
  const html = baseline ? fs.readFileSync(path.join(out, 'before.html'), 'utf8') : previewMarkup();
  const playwright = localPlaywright(), stamp = `${process.pid}-${Date.now()}`;
  const result = { baseline, loads: [], legacyLoads: [], controls: [], requests: [], errors: [], closed: [] };
  const evidence = path.join(out, baseline ? 'before-browser.json' : 'after-browser.json');
  for (const variant of baseline ? ['before'] : ['current', 'legacy']) {
    for (const spec of cases) {
      const id = variant + '-' + spec.id;
      let content = variant === 'legacy' ? legacyLaunches(html) : html;
      if (spec.lateAtlas) content = replaceOnce(content, "bootDone('atlas');", "await new Promise(resolve => setTimeout(resolve, 2500));\nbootDone('atlas');");
      const file = path.join(out, id + '.html'); fs.writeFileSync(file, content);
      const context = await playwright.chromium.launchPersistentContext(path.join(out, `edge-${stamp}-${id}`), {
        executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true,
        viewport: { width: spec.W, height: spec.H }, deviceScaleFactor: spec.W < 500 ? 3 : 1,
        hasTouch: spec.W < 500, isMobile: spec.W < 500,
        args: ['--disable-background-networking', '--disable-component-update', '--disable-sync', '--no-first-run', '--no-default-browser-check', '--disable-extensions'],
      });
      try {
        await context.route('**/*', route => {
          const url = route.request().url();
          if (/^(file|data|blob):/.test(url)) return route.continue();
          result.requests.push({ id, url }); return route.abort('blockedbyclient');
        });
        await context.addInitScript(observeLoader);
        const page = await context.newPage();
        page.on('pageerror', e => result.errors.push({ id, message: e.message }));
        const cdp = await context.newCDPSession(page);
        await cdp.send('Emulation.setCPUThrottlingRate', { rate: spec.cpuRate });
        await page.goto(pathToFileURL(file).href);
        await page.waitForFunction(() => window.__l16?.complete, null, { timeout: 60000 });
        const data = await page.evaluate(() => __l16);
        const row = { ...spec, id, data, stats: launchStats(data.last.launches) };
        // Save observations before asserting, including any unexpectedly failing run.
        result.loads.push(row); fs.writeFileSync(evidence, JSON.stringify(result, null, 2));
        if (variant === 'legacy') {
          let caught;
          try { l16BrowserGate(row); } catch (e) { caught = e.message.split('\n')[0]; }
          if (caught) assert.ok(caught.startsWith('L16 stream: launch gap'), 'L16 legacy control failed at another gate: ' + caught);
          result.legacyLoads.push({ id, caught: caught || null, boot: data.boot, ...row.stats, holdAt: data.last.holdAt, burstStart: data.last.burstStart });
        } else if (!baseline) row.summary = l16BrowserGate(row);
      } finally {
        await context.close(); result.closed.push(id);
        fs.writeFileSync(evidence, JSON.stringify(result, null, 2));
      }
    }
  }
  assert.deepEqual(result.requests, [], 'L16 no page network requests');
  assert.deepEqual(result.errors, [], 'L16 no page errors');
  // A fast machine can finish its ordinary boot before the first progress plateau.
  // The delayed-atlas member of the same check guarantees the old rule is exposed.
  if (!baseline) {
    const late = result.legacyLoads.find(r => r.id === 'legacy-1440-late-atlas');
    assert.ok(late?.caught?.startsWith('L16 stream: launch gap'), 'L16 legacy control escaped check 2');
    result.controls.push({ id: '3232c60-progress-launches', caught: late.caught,
      failingLoads: result.legacyLoads.filter(r => r.caught).map(r => r.id), loads: result.legacyLoads });
    fs.writeFileSync(evidence, JSON.stringify(result, null, 2));
  }
  return { loads: result.loads.filter(r => !r.id.startsWith('legacy-')).map(r => r.summary || { id: r.id, boot: r.data.boot, ...r.stats, holdAt: r.data.last.holdAt, burstStart: r.data.last.burstStart }), controls: result.controls, closed: result.closed };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await checkL16({ baseline: process.argv.includes('--baseline') })));
