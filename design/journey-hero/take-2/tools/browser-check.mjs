// Accept an existing page, or run locally with a repository-installed Playwright.
// The CLI opens only its own headless browser and blocks every non-file/data request.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SHOW, SCRIPTS, PACE, calloutsAt, playbackSpans } from '../stage.mjs';
import { visibleProjection, polygonsOverlap } from './correction-checks.mjs';
import { previewMarkup } from './preview.mjs';

export const BROWSER_SIZES = [[390, 664], [390, 844], [360, 780], [375, 667], [412, 915], [768, 1024], [1440, 900], [1920, 1080]];
export function checkLabelRoutes(labels, scale, context) {
  const crosses = (a, b, r, pad = 0.5) => {
    let lo = 0, hi = 1;
    for (const [p, q] of [[a[0] - b[0], a[0] - r.left + pad], [b[0] - a[0], r.right + pad - a[0]], [a[1] - b[1], a[1] - r.top + pad], [b[1] - a[1], r.bottom + pad - a[1]]]) {
      if (!p) { if (q < 0) return false; } else if (p < 0) lo = Math.max(lo, q / p); else hi = Math.min(hi, q / p);
    }
    return lo <= hi;
  };
  for (const c of labels) {
    const dir = c.side === 'left' ? -1 : 1, [start, elbow, end] = c.points, run = scale < 70 ? 8 : 12;
    assert.ok(dir * (elbow[0] - start[0]) >= 3 - 1e-7 && dir * (end[0] - elbow[0]) >= run - 1e-7, `${context}: label route: leader turns inward or has a short horizontal run`);
    const words = c.box || c.label;
    for (const d of labels) {
      const mark = d.mark2, dx = Math.max(words.left - mark[0], 0, mark[0] - words.right), dy = Math.max(words.top - mark[1], 0, mark[1] - words.bottom);
      assert.ok(Math.hypot(dx, dy) >= d.radius + 2 - 1e-7, `${context}: label route: words touch a ring or mark`);
      for (let k = 1; k < d.points.length; k++) assert.ok(!crosses(d.points[k - 1], d.points[k], words), `${context}: label route: line on label words`);
    }
  }
}

export async function checkBrowser(page) {
  const times = [], rows = [];
  let start = 0;
  for (const scene of SHOW) {
    times.push(start + scene.still);
    if (['id', 'pr', 'ae', 'fig'].includes(scene.key)) {
      const s = SCRIPTS[scene.key], ends = scene.key === 'id' ? [s.actions.find(a => a.id === 'export').end] : playbackSpans(s).spans.map(span => span[1]);
      for (const t of ends) times.push(start + t + 0.4 * PACE + 1e-6);
    }
    start += scene.len;
  }
  for (const [width, height] of BROWSER_SIZES) {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.waitForFunction(() => window.__ready);
    await page.evaluate(() => document.fonts.ready);
    for (const time of [...new Set(times)]) {
      const expected = calloutsAt(time);
      const result = await page.evaluate(time => {
        window.__hero.seek(time);
        const h = document.querySelector('[data-hero]').getBoundingClientRect(), view = __hero.view, labels = __hero.callouts;
        const project = p => [view.cx + view.S * p.reduce((sum, v, i) => sum + v * view.cam.r[i], 0), view.cy - view.S * p.reduce((sum, v, i) => sum + v * view.cam.u[i], 0)];
        const rect = n => { const r = n.getBoundingClientRect(); return { left: r.left - h.left, right: r.right - h.left, top: r.top - h.top, bottom: r.bottom - h.top, width: r.width, height: r.height }; };
        return { S: view.S, W: h.width, H: h.height, labels: labels.map(c => { const group = document.querySelector('[data-callout="' + c.id + '"]'), word = document.querySelector('[data-callout-word="' + c.id + '"]'), mark = group.querySelector('rect'); const range = document.createRange(); range.selectNodeContents(word); return { ...c, projected: project(c.mark), mark: [Number(mark.getAttribute('x')) + 1.5, Number(mark.getAttribute('y')) + 1.5], box: rect(word), textRects: range.getClientRects().length, ring: group.querySelector('circle').getAttribute('transform') }; }), obstacles: [...document.querySelectorAll('[data-name],[data-lede],[data-crafts],.hero-nav,[data-foot]')].map(rect).filter(r => r.width && r.height), visibleGroups: [...document.querySelectorAll('[data-callouts] g')].filter(n => getComputedStyle(n).display !== 'none').length };
      }, time);
      const overlaps = (a, b) => a.left < b.right - 0.01 && a.right > b.left + 0.01 && a.top < b.bottom - 0.01 && a.bottom > b.top + 0.01;
      // Segment versus rectangle, including a stroke's half-pixel width.
      const crosses = (a, b, r, pad = 0.5) => {
        let lo = 0, hi = 1;
        for (const [p, q] of [[a[0] - b[0], a[0] - r.left + pad], [b[0] - a[0], r.right + pad - a[0]], [a[1] - b[1], a[1] - r.top + pad], [b[1] - a[1], r.bottom + pad - a[1]]]) {
          if (!p) { if (q < 0) return false; } else if (p < 0) lo = Math.max(lo, q / p); else hi = Math.min(hi, q / p);
        }
        return lo <= hi;
      };
      assert.equal(result.labels.length, result.S < 34 ? 0 : expected.length, `${width}/${time}: label count`);
      checkLabelRoutes(result.labels, result.S, `${width}x${height}/${time}`);
      for (const [i, c] of result.labels.entries()) {
        assert.ok(Math.hypot(...c.mark.map((v, j) => v - c.projected[j])) <= 1, `${width}/${time}: projected mark`);
        assert.ok(c.box.left >= 16 - 0.01 && c.box.right <= result.W - 16 + 0.01, `${width}/${time}: word gutter`);
        assert.equal(c.textRects, 1, `${width}/${time}: wrapped words`);
        for (const p of c.points) assert.ok(p[0] >= 16 - 0.01 && p[0] <= result.W - 16 + 0.01 && p[1] >= 0 && p[1] <= result.H, `${width}/${time}: line gutter`);
        const ring = { left: c.mark[0] - c.radius - c.stroke / 2, right: c.mark[0] + c.radius + c.stroke / 2, top: c.mark[1] - c.radius - c.stroke / 2, bottom: c.mark[1] + c.radius + c.stroke / 2 };
        for (const r of result.obstacles) {
          assert.ok(!overlaps(c.box, r) && !overlaps(ring, r), `${width}/${time}: words/ring on page content`);
          for (let k = 1; k < c.points.length; k++) assert.ok(!crosses(c.points[k - 1], c.points[k], r), `${width}/${time}: line on page content`);
        }
        for (const d of result.labels.slice(i + 1)) assert.ok(!overlaps(c.box, d.box), `${width}/${time}: labels overlap`);
        for (const d of result.labels) for (let k = 1; k < c.points.length; k++) assert.ok(!crosses(c.points[k - 1], c.points[k], d.box), `${width}/${time}: line on label words`);
      }
      rows.push({ width, height, time, scale: result.S, labels: result.labels.length });
    }
    // Sample entry and withdrawal using the actual packed page's geometry and its real DOM boxes.
    const figStart = SHOW.slice(0, 5).reduce((n, s) => n + s.len, 0), spans = playbackSpans(SCRIPTS.fig);
    for (const [from, to] of [[spans.spans[0][0], spans.spans[0][1]], spans.off]) for (let at = from; at < to; at += 0.05 * PACE) {
      const result = await page.evaluate(time => {
        __hero.seek(time);
        const h = document.querySelector('[data-hero]').getBoundingClientRect();
        return { view: __hero.view, pieces: __hero.pieces.filter(pc => pc.lid || pc.canvas || pc.art === 'export' || pc.deviceKind === 'tablet'), obstacles: [...document.querySelectorAll('[data-name],[data-lede],[data-crafts],.hero-nav,[data-foot]')].map(n => { const r = n.getBoundingClientRect(); return [r.left - h.left, r.top - h.top, r.right - h.left, r.bottom - h.top]; }) };
      }, figStart + at);
      const { view } = result, project = pc => visibleProjection(pc, view.cam).map(([x, y]) => [view.cx + view.S * x, view.cy - view.S * y]);
      const lid = result.pieces.find(pc => pc.lid);
      if (!lid) continue;
      const outline = project(lid);
      for (const r of result.obstacles) assert.ok(!polygonsOverlap(outline, [[r[0], r[1]], [r[2], r[1]], [r[2], r[3]], [r[0], r[3]]]), `${width}/${at}: laptop covers page content`);
      for (const pc of result.pieces.filter(pc => pc !== lid && (pc.canvas || pc.art === 'export' || pc.deviceKind === 'tablet'))) assert.ok(!polygonsOverlap(outline, project(pc)), `${width}/${at}: laptop covers canvas, Export or tablet`);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const time = times.at(-1), a = await page.evaluate(t => { __hero.seek(t); return __hero.callouts.map(c => c.angle); }, time), b = await page.evaluate(t => { __hero.seek(t); return __hero.callouts.map(c => c.angle); }, time + 0.1 * PACE);
    assert.deepEqual(a, b, 'reduced-motion rings turned');
    assert.ok(a.every(n => n === 0));
  }
  await page.evaluate(() => { const box = document.querySelector('[data-stage-box]'); box.dataset.reviewStyle = box.getAttribute('style') || ''; box.style.width = '100px'; box.style.height = '100px'; __hero.seek(__hero.SHOW.slice(0, 3).reduce((n, s) => n + s.len, 0) + __hero.SHOW[3].still); });
  assert.ok(await page.evaluate(() => __need.S < 34 && __hero.callouts.length === 0 && [...document.querySelectorAll('[data-callouts] g')].every(n => getComputedStyle(n).display === 'none')), 'labels drawn below S=34');
  await page.evaluate(() => { const box = document.querySelector('[data-stage-box]'); box.setAttribute('style', box.dataset.reviewStyle); delete box.dataset.reviewStyle; __hero.seek(__hero.t); });
  return rows;
}

export async function runBrowserCheck() {
  const take = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), root = path.resolve(take, '../../..');
  const require = createRequire(path.join(root, 'package.json'));
  let playwright;
  for (const name of ['playwright', '@playwright/test', 'playwright-core']) {
    try {
      const resolved = require.resolve(name);
      if (resolved.startsWith(root + path.sep)) { playwright = require(resolved); break; }
    } catch (error) { if (error.code !== 'MODULE_NOT_FOUND') throw error; }
  }
  if (!playwright) {
    console.log('browser-check UNAVAILABLE: Playwright is not installed in the repository; no browser launched.');
    for (const [w, h] of BROWSER_SIZES) console.log(`${w}x${h}: UNRUN (Playwright unavailable)`);
    process.exitCode = 2; return;
  }
  let browser;
  try {
    browser = await playwright.chromium.launch({ headless: true });
  } catch (error) {
    console.log('browser-check UNAVAILABLE: Playwright could not launch its headless Chromium browser.');
    console.log(String(error.message).split('\n')[0]);
    for (const [w, h] of BROWSER_SIZES) console.log(`${w}x${h}: UNRUN (browser unavailable)`);
    process.exitCode = 2; return;
  }
  try {
    const context = await browser.newContext({ serviceWorkers: 'block' }), requests = [], errors = [];
    await context.route('**/*', route => {
      if (/^(?:file|data|blob):/.test(route.request().url())) return route.continue();
      requests.push(route.request().url()); return route.abort();
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    const packed = path.join(take, '.scratch/corrections3/browser-preview.html');
    fs.mkdirSync(path.dirname(packed), { recursive: true }); fs.writeFileSync(packed, previewMarkup());
    await page.goto(pathToFileURL(packed).href + '?t=0');
    const rows = await checkBrowser(page);
    for (const [w, h] of BROWSER_SIZES) console.log(`${w}x${h}: PASS (${rows.filter(r => r.width === w && r.height === h).length} held frames; laptop entry/return; reduced motion)`);
    assert.deepEqual(requests, [], 'packed preview attempted network requests');
    assert.deepEqual(errors, [], 'packed preview page errors');
    console.log('browser-check all eight sizes clean; network requests 0; page errors 0');
  } finally { await browser.close(); }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await runBrowserCheck();
