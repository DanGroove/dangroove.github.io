// Local GPU Edge, an isolated profile, offline previews, and Playwright's controlled clock.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { previewMarkup } from './preview.mjs';
import { pageMarkup } from './page.mjs';
import { SHOW, SCRIPTS, playbackSpans } from '../stage.mjs';
const take = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(take, '.scratch/l13/browser'); fs.mkdirSync(out, { recursive: true });
const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch {
  const runtimes = path.join(process.env.LOCALAPPDATA, 'OpenAI/Codex/runtimes/cua_node');
  const installed = fs.readdirSync(runtimes).map(d => path.join(runtimes, d, 'bin/node_modules/playwright-core')).find(p => fs.existsSync(p));
  if (!installed) throw Error('Local Playwright is required; this tool never installs packages.');
  playwright = require(installed);
}
const source = file => fs.readFileSync(path.join(take, file), 'utf8').replace(/\r\n/g, '\n');
const profile = path.join(out, 'edge-profile');
const context = await playwright.chromium.launchPersistentContext(profile, {
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true,
  viewport: { width: 1440, height: 900 }, args: ['--disable-background-networking', '--disable-component-update', '--disable-sync', '--no-first-run', '--no-default-browser-check', '--disable-extensions'],
});
const requests = [], errors = [], results = {};
await context.route('**/*', route => { const u = route.request().url(); if (/^(file|data|blob):/.test(u)) return route.continue(); requests.push(u); return route.abort('blockedbyclient'); });
context.on('page', p => p.on('pageerror', e => errors.push(e.message)));
async function localPage(html, name) {
  const file = path.join(out, name + '.html'); fs.writeFileSync(file, html);
  const page = await context.newPage(); await page.goto(pathToFileURL(file).href); return page;
}
const selected = new Set(process.argv.slice(2));
const run = key => !selected.size || selected.has(key);
try {
  if (run('pixels')) {
    const page = await localPage('<!doctype html><title>L13 alpha gate</title>', 'pixels');
    const painter = source('tools/page.mjs').split('function canvasPainter(')[1].split('\nfunction loaderWorker(')[0];
    // Restore the original raw-triangle/non-multisampled failure in memory. No saved source is needed.
    const begin = painter.indexOf('  if (uStroke) {'), end = painter.indexOf('  } else {', begin);
    assert.ok(begin >= 0 && end > begin, 'L13 raw painter control: shader mutation site');
    const originalPainter = (painter.slice(0, begin) + '  if (uStroke) { coverage = 1.0;\n' + painter.slice(end))
      .replace('for (const p of [a, b, c, c, b, e]) vertexAt(p[0], p[1], d);', 'for (let i = 0; i < shape.triangle.length; i += 2) vertexAt(shape.triangle[i], shape.triangle[i + 1], d);');
    const pure = source('loader-stars.mjs').replace(/^export /gm, '');
    const paths = [...pageMarkup().match(/<a\b[^>]*data-mark[^>]*>[\s\S]*?<\/a>/)[0].matchAll(/<path\b[^>]*>/g)].map(([s]) => ({ d: s.match(/\bd="([^"]+)"/)[1], fill: s.match(/\bfill="([^"]+)"/)[1] }));
    results.pixels = [];
    for (const [W, H] of [[1440, 900], [390, 844]]) for (const dpr of [1, 2]) {
      const cdp = await context.newCDPSession(page);
      await cdp.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: dpr, mobile: W < 500 });
      for (const aa of [true, false]) {
        const row = await page.evaluate(({ W, H, dpr, paths, pure, painter, aa }) => {
          const api = new Function(pure + ';return {sampleMark, loaderScene, loaderAt, loaderDots, make: function canvasPainter(' + painter.replace('antialias: true', 'antialias: ' + aa) + '};')();
          const scene = api.loaderScene(api.sampleMark(paths), W, H), boot = { fonts: 0, atlas: 0, frame: 0 };
          const first = api.loaderAt(5, boot, { scene }), gpuCanvas = document.createElement('canvas'), cpuCanvas = document.createElement('canvas');
          const actual = gpuCanvas.getContext.bind(gpuCanvas);
          let gl;
          gpuCanvas.getContext = (...args) => { const ctx = actual(...args); if (args[0] === 'webgl2') gl = ctx; return ctx; };
          const fallback = cpuCanvas.getContext.bind(cpuCanvas);
          cpuCanvas.getContext = (type, ...args) => type === 'webgl2' ? null : fallback(type, ...args);
          const box = { width: W, height: H }, viewport = { ...box, left: 0, top: 0 };
          const gpu = api.make(gpuCanvas, paths, box, viewport, dpr), cpu = api.make(cpuCanvas, paths, box, viewport, dpr);
          const w = gpuCanvas.width, h = gpuCanvas.height, diffs = [], gaps = [], frameRows = [];
          // Read the alpha at the actual line point, between device-pixel centres.
          const pixel = (data, x, y, flip = false) => {
            x = x * dpr - .5; y = y * dpr - .5;
            const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
            const at = (x, y) => x < 0 || y < 0 || x >= w || y >= h ? 0 : data[((flip ? h - 1 - y : y) * w + x) * 4 + 3] / 255;
            return (1 - fy) * ((1 - fx) * at(ix, iy) + fx * at(ix + 1, iy)) + fy * ((1 - fx) * at(ix, iy + 1) + fx * at(ix + 1, iy + 1));
          };
          for (const elapsed of [.04, .1, .3, .7, 1.2]) {
            const state = api.loaderAt(first.burstStart + elapsed, boot, { scene });
            gpu.paint(state); cpu.paint(state);
            const a = new Uint8Array(w * h * 4); gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, a);
            const b = cpuCanvas.getContext('2d').getImageData(0, 0, w, h).data;
            let tested = 0, missing = 0, tapers = 0;
            for (const d of api.loaderDots(scene, state)) {
              if (!(d.streak > d.size)) continue;
              tapers++;
              const steps = Math.ceil(d.streak * dpr * 4);
              for (let i = 0; i <= steps; i++) {
                const t = i / steps, x = d.tail[0] + (d.x - d.tail[0]) * t, y = d.tail[1] + (d.y - d.tail[1]) * t;
                const canvas = pixel(b, x, y), webgl = pixel(a, x, y, true);
                if (canvas > .1) {
                  tested++; diffs.push(Math.abs(canvas - webgl));
                  if (webgl + 1e-8 < .5 * canvas) { missing++; if (gaps.length < 12) gaps.push({ elapsed, x, y, canvas, webgl }); }
                }
              }
            }
            frameRows.push({ elapsed, tapers, tested, missing });
          }
          diffs.sort((a, b) => a - b);
          const ext = gl.getExtension('WEBGL_debug_renderer_info');
          const record = { W, H, requestedDpr: dpr, actualDpr: devicePixelRatio, backing: [w, h], aa, attributes: gl.getContextAttributes(), renderer: ext && gl.getParameter(ext.UNMASKED_RENDERER_WEBGL), samples: diffs.length, gaps, missing: frameRows.reduce((n, f) => n + f.missing, 0), p99: diffs[Math.floor(.99 * (diffs.length - 1))], frames: frameRows };
          gl.getExtension('WEBGL_lose_context')?.loseContext(); return record;
        }, { W, H, dpr, paths, pure, painter: aa ? painter : originalPainter, aa });
        results.pixels.push(row); console.log(JSON.stringify(row));
      }
      await cdp.detach();
    }
    fs.writeFileSync(path.join(out, 'pixels.json'), JSON.stringify(results.pixels, null, 2));
    await page.close();
    assert.ok(results.pixels.filter(r => r.aa).every(r => r.missing === 0), 'L13 alpha gap: multisample painter has gaps');
    assert.ok(results.pixels.filter(r => !r.aa).every(r => r.missing > 0), 'L13 alpha gap control: antialias false escaped');
  }
  if (run('clock')) {
    results.clock = [];
    for (const control of [false, true]) {
      // Observe the renderer's actual submitted field, including both pass thresholds, without a product global.
      let html = '<script>history.replaceState(null,"","?t=0");</script>' + previewMarkup().replace('const field = stars?.frame(state ? starReach(state.stars, centre, W, H) : null, centre);', `const field = stars?.frame(state ? starReach(state.stars, centre, W, H) : null, centre); globalThis.__l13Observe?.(field);`);
      if (control) html = html.replace('const trails = field.gateTrails(history.record(now, positions));', 'const trails = history.record(now, positions);')
        .replace('positions[2 * i] = attrs[5 * i] + field.offsets[2 * i];', 'positions[2 * i] = attrs[5 * i] + field.offsets[2 * i] + parallaxOffset(f, s.d)[0];')
        .replace('positions[2 * i + 1] = attrs[5 * i + 1] + field.offsets[2 * i + 1];', 'positions[2 * i + 1] = attrs[5 * i + 1] + field.offsets[2 * i + 1] + parallaxOffset(f, s.d)[1] + scrollOffset(scroll, s.d);');
      const page = await localPage(html, control ? 'speed-control' : 'clock');
      await page.waitForFunction(() => window.__ready && !window.__hero.loading && window.__hero.entering === null);
      await page.evaluate(() => window.__hero.seek(0));
      await page.clock.install({ time: new Date('2026-11-24T12:00:00Z') });
      await page.clock.pauseAt(new Date('2026-11-24T12:00:01Z'));
      await page.evaluate(() => {
        window.__l13Rows = []; window.__l13Phase = 'stir';
        window.__l13Observe = st => {
          if (!st) return;
          const on = [];
          for (let i = 0; i < st.count; i++) {
            const own = st.attrs[5 * i + 3], m = st.flags[i] > 1.5 ? st.mixes[i] : 0, width = own + (Math.max(own, st.markSize) - own) * m;
            const length = Math.hypot(st.trails[4 * i], st.trails[4 * i + 1]);
            if (length > own || st.alpha[i] > 0 && length > width) on.push(i);
          }
          __l13Rows.push({ phase: __l13Phase, time: performance.now(), on });
        };
      });
      // A paused scene keeps the stars' pointer clock live, as in normal use.
      const move = async (x, y) => { await page.mouse.move(x, y); await page.clock.runFor(16); };
      for (let n = 0; n <= 45; n++) await move(300 + 20 * n, 450);
      await page.evaluate(() => { __l13Phase = 'parallax'; });
      for (const [x, y] of [[20, 20], [1420, 20], [1420, 880], [20, 880], [720, 450]]) { await move(x, y); await page.clock.runFor(400); }
      await page.evaluate(() => { __l13Phase = 'scroll'; const space = document.createElement('div'); space.style.height = '900px'; document.body.appendChild(space); scrollTo(0, 200); });
      await page.clock.runFor(250); await page.evaluate(() => scrollTo(0, 0)); await page.clock.runFor(1000);
      await page.evaluate(() => { __l13Phase = 'hold'; });
      await page.mouse.move(900, 430); await page.mouse.down(); await page.clock.runFor(3000);
      const threeSecondHold = await page.evaluate(() => __hero.stars.mark);
      assert.ok(threeSecondHold.formed, 'L13 controlled hold: mark formation exercised');
      await page.evaluate(() => { __l13Phase = 'release'; __l13Release = performance.now(); });
      await page.mouse.up(); await page.clock.runFor(10000);
      // The retained 600-point mark can consume every capture in a three-second hold.
      // Also cover the fully populated outer ring, without changing the required three-second run.
      await page.evaluate(() => { __l13Phase = 'ringHold'; });
      await page.mouse.move(720, 450); await page.mouse.down(); await page.clock.runFor(8000);
      const ringHold = await page.evaluate(() => __hero.stars.mark);
      assert.ok(ringHold.formed && ringHold.ring.count > 0, 'L13 controlled hold: outer ring exercised');
      const data = await page.evaluate(() => { const r = document.querySelector('[data-hero]').getBoundingClientRect(); return { rows: __l13Rows, release: __l13Release, mark: __hero.stars.mark, heroSize: [r.width, r.height], count: __hero.stars.count }; });
      assert.deepEqual(data.heroSize, [1440, 900], 'L13 controlled viewport: hero must retain its height while scrolling');
      assert.equal(data.count, 1200, 'L13 controlled viewport: field count');
      const totals = Object.fromEntries(['stir', 'parallax', 'scroll', 'hold', 'release'].map(p => [p, data.rows.filter(r => r.phase === p).reduce((n, r) => n + r.on.length, 0)]));
      const early = data.rows.filter(r => r.phase === 'release' && r.time - data.release <= 50).reduce((n, r) => n + r.on.length, 0);
      let revivals = 0; const seen = new Set(), gone = new Set();
      for (const r of data.rows.filter(r => r.phase === 'release' && r.time - data.release >= 50)) {
        for (const i of seen) if (!r.on.includes(i)) gone.add(i);
        for (const i of r.on) { if (gone.has(i)) revivals++; seen.add(i); }
      }
      const ringTapers = data.rows.filter(r => r.phase === 'ringHold').reduce((n, r) => n + r.on.length, 0);
      const row = { control, totals, early, revivals, frames: data.rows.length, threeSecondHold, ringHold, ringTapers };
      results.clock.push(row); fs.writeFileSync(path.join(out, control ? 'speed-control-frames.json' : 'clock-frames.json'), JSON.stringify(data));
      console.log(JSON.stringify(row)); await page.mouse.up(); await page.clock.resume(); await page.close();
      if (control) {
        row.gates = [];
        for (const phase of ['stir', 'hold']) {
          let failed = false;
          try { assert.equal(totals[phase], 0, 'L13 ' + phase + ': no taper'); }
          catch (e) { assert.ok(e.message.startsWith('L13 ' + phase + ':')); row.gates.push(e.message.split('\n')[0]); failed = true; }
          assert.ok(failed, 'L13 speed-only control escaped ' + phase);
        }
      }
      else { for (const phase of ['stir', 'parallax', 'scroll', 'hold']) assert.equal(totals[phase], 0, 'L13 ' + phase + ': taper'); assert.equal(ringTapers, 0, 'L13 outer ring: taper'); assert.ok(early > 0, 'L13 release: no early tapers'); assert.equal(revivals, 0, 'L13 return: taper revived'); }
    }
  }
  if (run('loaderclock')) {
    let html = previewMarkup().replace('if (gpu) { gpu(loaderDots(scene, state)); return; }', 'if (gpu) { const dots = loaderDots(scene, state); globalThis.__l13LoaderObserve?.(dots, state); gpu(dots); return; }');
    const file = path.join(out, 'loader-clock.html'); fs.writeFileSync(file, html);
    const page = await context.newPage();
    await page.clock.install({ time: new Date('2026-11-24T12:00:00Z') });
    await page.clock.pauseAt(new Date('2026-11-24T12:00:01Z'));
    await page.addInitScript(() => {
      window.Worker = undefined;
      window.__l13LoaderRows = [];
      window.__l13LoaderObserve = (dots, state) => __l13LoaderRows.push({ time: state.time, burst: state.burstTime, tapers: dots.filter(d => d.streak > d.size).length });
    });
    await page.goto(pathToFileURL(file).href);
    for (let i = 0; i < 120; i++) { await page.clock.runFor(100); if (await page.evaluate(() => window.__ready && !__hero.loading)) break; }
    const rows = await page.evaluate(() => __l13LoaderRows);
    assert.ok(rows.filter(r => r.burst === null).length > 20, 'L13 loader controlled clock: gather sampled');
    assert.ok(rows.filter(r => r.burst === null).every(r => r.tapers === 0), 'L13 loader controlled clock: gathering taper');
    assert.ok(rows.filter(r => r.burst !== null).some(r => r.tapers > 0), 'L13 loader controlled clock: burst taper');
    results.loaderclock = { frames: rows.length, gather: rows.filter(r => r.burst === null).length, burst: rows.filter(r => r.burst !== null).length, maxTapers: Math.max(...rows.map(r => r.tapers)) };
    fs.writeFileSync(path.join(out, 'loader-clock-frames.json'), JSON.stringify(rows));
    console.log(JSON.stringify(results.loaderclock)); await page.clock.resume(); await page.close();
  }
  if (run('sheets')) {
    const page = await localPage(previewMarkup(), 'exports');
    await page.waitForFunction(() => window.__ready);
    results.sheets = [];
    const offsets = [0, .3, .6, .9, 1.2, 1.4, 1.46, 1.6, 2];
    for (const [W, H] of [[412, 730], [390, 844], [1440, 900]]) {
      await page.setViewportSize({ width: W, height: H }); await page.evaluate(() => __hero.measure());
      const cells = [];
      for (const key of ['id', 'pr', 'ae', 'fig']) {
        const i = SHOW.findIndex(s => s.key === key), start = SHOW.slice(0, i).reduce((n, s) => n + s.len, 0), off = playbackSpans(SCRIPTS[key]).off[0];
        for (const v of offsets) {
          await page.evaluate(t => __hero.seek(t), start + off + v);
          const box = await page.locator('[data-stage-box]').boundingBox();
          const x = Math.max(0, Math.floor(box.x - 8)), y = Math.max(0, Math.floor(box.y - 8));
          const png = await page.screenshot({ clip: { x, y, width: Math.min(W - x, Math.ceil(box.width + 16)), height: Math.min(H - y, Math.ceil(box.height + 16)) } });
          const file = `${W}x${H}-${key}-${v.toFixed(2)}.png`; fs.writeFileSync(path.join(out, file), png);
          cells.push({ key, v, png: png.toString('base64') });
        }
      }
      const sheet = await localPage('<!doctype html><style>body{margin:0;background:#151314;color:#F7F6F3;font:14px Arial}main{display:grid;grid-template-columns:repeat(9,300px)}figure{margin:4px}img{width:292px}figcaption{padding:8px}</style><main>' + cells.map(c => `<figure><img src="data:image/png;base64,${c.png}"><figcaption>${c.key} exit +${c.v.toFixed(2)} s</figcaption></figure>`).join('') + '</main>', `sheet-${W}x${H}`);
      await sheet.setViewportSize({ width: 2700, height: 1000 });
      const image = `contact-${W}x${H}.png`; await sheet.screenshot({ path: path.join(out, image), fullPage: true }); await sheet.close();
      results.sheets.push({ W, H, image, cells: cells.length });
    }
    await page.close();
  }
  if (selected.has('comparison')) {
    const baseline = fs.readFileSync(path.join(take, '.scratch/review-out/r19/l12-l13-before/preview.html'), 'utf8');
    const skip = '<script>history.replaceState(null,"","?t=0");</script>';
    const before = await localPage(skip + baseline, 'reference'), after = await localPage(skip + previewMarkup(), 'comparison');
    const unclipped = await localPage(skip + baseline.replace('pc.clip = [0, 1, 0, 0]; pc.sink = true;', 'pc.clip = undefined; pc.sink = true;')
      .replace('pc.carryClip = [0, 1, 0, -Math.max(0, top(pc) - heights[j])]', 'pc.carryClip = undefined'), 'reference-without-sink-clips');
    await before.waitForFunction(() => window.__ready); await after.waitForFunction(() => window.__ready); await unclipped.waitForFunction(() => window.__ready);
    results.comparison = [];
    for (const [W, H] of [[412, 730], [390, 844], [1440, 900]]) {
      for (const page of [before, after, unclipped]) await page.setViewportSize({ width: W, height: H });
      const cells = [];
      for (const key of ['id', 'pr', 'ae', 'fig']) {
        const off = playbackSpans(SCRIPTS[key]).off[0], pair = [];
        for (const page of [before, after, unclipped]) {
          await page.evaluate(({ key, off }) => { const i = __hero.SHOW.findIndex(s => s.key === key); __hero.measure(); __hero.seek(__hero.SHOW.slice(0, i).reduce((n, s) => n + s.len, 0) + off); }, { key, off });
          const box = await page.locator('[data-stage-box]').boundingBox(), x = Math.max(0, Math.floor(box.x - 8)), y = Math.max(0, Math.floor(box.y - 8));
          pair.push((await page.screenshot({ clip: { x, y, width: Math.min(W - x, Math.ceil(box.width + 16)), height: Math.min(H - y, Math.ceil(box.height + 16)) } })).toString('base64'));
        }
        const changed = await after.evaluate(async pair => {
          const images = await Promise.all(pair.map(src => new Promise(resolve => { const i = new Image(); i.onload = () => resolve(i); i.src = 'data:image/png;base64,' + src; })));
          const pixels = images.map(i => { const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const x = c.getContext('2d'); x.drawImage(i, 0, 0); return x.getImageData(0, 0, c.width, c.height).data; });
          let changed = 0, max = 0, withoutSinkClips = 0;
          for (let i = 0; i < pixels[0].length; i += 4) { const error = Math.max(...[0, 1, 2, 3].map(k => Math.abs(pixels[0][i + k] - pixels[1][i + k]))); max = Math.max(max, error); if (error) changed++; }
          for (let i = 0; i < pixels[0].length; i += 4) if ([0, 1, 2, 3].some(k => pixels[2][i + k] !== pixels[1][i + k])) withoutSinkClips++;
          return { changed, max, withoutSinkClips, dimensions: images.map(i => [i.width, i.height]) };
        }, pair);
        results.comparison.push({ W, H, key, ...changed });
        cells.push(...pair.slice(0, 2).map((png, i) => `<figure><img src="data:image/png;base64,${png}"><figcaption>${key} exit 0 - ${i ? 'L13' : 'incoming L12'}</figcaption></figure>`));
      }
      const sheet = await localPage('<!doctype html><style>body{margin:0;background:#151314;color:#F7F6F3;font:16px Arial}main{display:grid;grid-template-columns:repeat(2,1fr)}figure{margin:4px}img{width:100%}figcaption{padding:8px}</style><main>' + cells.join('') + '</main>', `comparison-${W}x${H}`);
      await sheet.setViewportSize({ width: W < 500 ? 2 * W : 1440, height: 1000 });
      await sheet.screenshot({ path: path.join(out, `comparison-${W}x${H}.png`), fullPage: true }); await sheet.close();
    }
    await before.close(); await after.close(); await unclipped.close(); console.log(JSON.stringify(results.comparison));
  }
  assert.equal(requests.length, 0, 'L13 offline: attempted network request');
  assert.equal(errors.length, 0, 'L13 browser errors: ' + errors.join('; '));
} finally {
  fs.writeFileSync(path.join(out, 'result-' + ([...selected].join('-') || 'all') + '.json'), JSON.stringify({ ...results, requests, errors }, null, 2));
  await context.close();
}
