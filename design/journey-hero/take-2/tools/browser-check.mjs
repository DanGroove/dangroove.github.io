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

export const BROWSER_SIZES = [[390, 664], [390, 844], [360, 780], [375, 667], [412, 915], [768, 1024], [820, 1180], [1024, 768], [1440, 900], [1920, 1080]];
export const ROUND5_LAYOUT_SIZES = [...BROWSER_SIZES, [1280, 800], [1366, 657], [1680, 1050], [2560, 1440]];

// Shared with the Node layout model so controls exercise these exact browser assertions.
export function checkCraftColumns(r, width, context) {
  assert.equal(r.crafts.length, 4, `${context}: H11 four numbered crafts`);
  const inside = (a, b) => a.left >= b.left - 1 && a.right <= b.right + 1 && a.top >= b.top - 1 && a.bottom <= b.bottom + 1;
  const overlaps = (a, b) => Math.min(a.right, b.right) > Math.max(a.left, b.left) + 0.01 && Math.min(a.bottom, b.bottom) > Math.max(a.top, b.top) + 0.01;
  for (const [i, c] of r.crafts.entries()) {
    const second = width < 720 && i % 2 === 1;
    const edge = second ? c.button.left : r.ledeInk.left;
    assert.ok(Math.abs(c.ink.left - edge) <= 1, `${context}: H11 craft ${i + 1} column`);
    assert.ok(inside(c.ink, c.button), `${context}: H11 craft ${i + 1} number outside own button`);
    assert.ok(c.ink.right <= c.label.left && Math.min(c.ink.bottom, c.label.bottom) > Math.max(c.ink.top, c.label.top), `${context}: H11 craft ${i + 1} number beside own label`);
    if (second) {
      const first = r.crafts[i - 1].button;
      assert.ok(c.button.left > first.right && Math.abs(c.button.top - first.top) <= 1, `${context}: H11 phone grid columns`);
    } else assert.ok(Math.abs(c.button.left - r.craftBox.left) <= 1, `${context}: H11 first column starts at list edge`);
    for (const d of r.crafts.slice(i + 1)) assert.ok(!overlaps(c.ink, d.ink), `${context}: H11 overlapping numbers`);
  }
}

export function checkSceneTextEdge(r, context) {
  assert.ok(Math.abs(r.textRight - r.textEdgeRight) <= 0.01, `${context}: H12 text right must use name ink and lede/craft boxes`);
}

export function checkResizeStep(previous, r, context) {
  const scaleStep = Math.abs(r.S - previous.S);
  const centreStep = Math.abs((r.left + r.right - previous.left - previous.right) / 2);
  assert.ok(scaleStep < 2 && centreStep <= 14, `${context}: H6 resize step (H12 wrapping continuity); S step ${scaleStep.toFixed(3)}, centre step ${centreStep.toFixed(3)} px`);
}

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
    const vertical = c.level === 'up' ? -1 : 1;
    assert.ok(vertical * (start[1] - c.mark2[1]) > 0 && vertical * (elbow[1] - start[1]) >= 3 - 1e-7, `${context}: label route: leader goes in the wrong vertical direction`);
    assert.ok(Math.abs(Math.abs(elbow[0] - start[0]) - Math.abs(elbow[1] - start[1])) < 1e-7 && Math.abs(end[1] - elbow[1]) < 1e-7, `${context}: label route: expected a 45-degree diagonal then a horizontal run`);
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
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
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
          if (c.side === 'left' && c.box.top < r.bottom && c.box.bottom > r.top) assert.ok(c.box.left >= r.right + 16 - 0.01, `${width}/${time}: left words less than 16 px from page text`);
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
  await page.evaluate(() => { const box = document.querySelector('[data-stage-box]'); box.dataset.reviewStyle = box.getAttribute('style') || ''; box.style.width = '100px'; box.style.height = '100px'; __hero.measure(); __hero.seek(__hero.SHOW.slice(0, 3).reduce((n, s) => n + s.len, 0) + __hero.SHOW[3].still); });
  assert.ok(await page.evaluate(() => __need.S < 34 && __hero.callouts.length === 0 && [...document.querySelectorAll('[data-callouts] g')].every(n => getComputedStyle(n).display === 'none')), 'labels drawn below S=34');
  await page.evaluate(() => { const box = document.querySelector('[data-stage-box]'); box.setAttribute('style', box.dataset.reviewStyle); delete box.dataset.reviewStyle; __hero.measure(); __hero.seek(__hero.t); });
  await checkRound5Layout(page);
  return rows;
}

// External DOM/font checks only. Pixel-ink and frame review still belong to the reviewer.
export async function checkRound5Layout(page) {
  const sample = async (width, height) => {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    return page.evaluate(() => {
      __hero.measure();
      const m = __hero.layout, v = __hero.view, n = __need, h = document.querySelector('[data-hero]').getBoundingClientRect(), b = document.querySelector('[data-stage-box]').getBoundingClientRect();
      const box = r => ({ left: r.left, right: r.right, top: r.top, bottom: r.bottom });
      const craftBox = box(document.querySelector('[data-crafts]').getBoundingClientRect());
      const crafts = [...document.querySelectorAll('[data-crafts] button')].map((button, i) => {
        const range = document.createRange(); range.selectNodeContents(button.querySelector('.n').nextElementSibling);
        return { ink: m.numberInks[i], button: box(button.getBoundingClientRect()), label: box(range.getBoundingClientRect()) };
      });
      const textEdgeRight = Math.max(m.text[0].right, document.querySelector('[data-lede]').getBoundingClientRect().right, craftBox.right) - h.left;
      const textInkRight = Math.max(...m.text.map(r => r.right)) - h.left;
      return { ...m, crafts, craftBox, textEdgeRight, textInkRight, h: { left: h.left, top: h.top }, stage: { left: b.left - h.left, right: b.right - h.left, top: b.top - h.top, bottom: b.bottom - h.top }, measuredBox: [m.b.left, m.b.top, m.b.width, m.b.height], S: v.S, cx: v.cx, cy: v.cy, left: v.cx + v.S * (n.x - (n.w - 0.5) / 2), right: v.cx + v.S * (n.x + (n.w - 0.5) / 2), top: v.cy - v.S * (n.y + (n.h - 0.5) / 2), bottom: v.cy - v.S * (n.y - (n.h - 0.5) / 2) };
    });
  };
  const stable = (a, b, context) => {
    for (const key of ['S', 'cx', 'cy']) assert.ok(Math.abs(a[key] - b[key]) <= 0.01, context + ': H9 unstable ' + key);
    for (let i = 0; i < a.measuredBox.length; i++) assert.ok(Math.abs(a.measuredBox[i] - b.measuredBox[i]) <= 0.01, context + ': H9 unstable measured box');
  };
  for (const [w, h] of BROWSER_SIZES) {
    const first = await sample(w, h);
    for (let i = 0; i < 10; i++) stable(first, await sample(w, h), `${w}x${h}/measure ${i + 1}`);
    await sample(w + 37, h + 31);
    stable(first, await sample(w, h), `${w}x${h}/resize away-back`);
  }
  for (const [w, h] of ROUND5_LAYOUT_SIZES) {
    const r = await sample(w, h), column = r.ledeInk.left;
    for (const ink of r.nameLines) assert.ok(Math.abs(ink.left - column) <= 1, `${w}x${h}: H4 font-ink column`);
    checkCraftColumns(r, w, `${w}x${h}`);
    checkSceneTextEdge(r, `${w}x${h}`);
    const expectedRise = w < 720 ? 0 : Math.min(Math.max(0, r.gap), Math.max(0, r.baseNameTop - r.logoBottom - 48));
    assert.ok(Math.abs(r.rise - expectedRise) <= 1, `${w}x${h}: H5 rise/guard`);
    if (w >= 720) {
      assert.ok(r.nameLines[0].top - r.h.top >= r.logoBottom + 48 - 1, `${w}x${h}: H5 logo guard`);
      assert.ok(r.stage.left <= r.left && r.stage.right >= r.right && r.stage.top <= r.top && r.stage.bottom >= r.bottom, `${w}x${h}: H6 stage target`);
      if (w >= 1280) assert.ok(Math.abs((r.left - r.textInkRight) - (w - r.right)) <= 8, `${w}x${h}: H6 equal side spaces (H12 actual ink)`);
    }
  }
  for (const h of [640, 900, 1440]) {
    let previous;
    for (let w = 720; w <= 2560; w += 10) {
      const r = await sample(w, h);
      checkSceneTextEdge(r, `${w}x${h}`);
      if (previous) checkResizeStep(previous, r, `${w}x${h}`);
      previous = r;
    }
  }
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
    console.log(`browser-check all ${BROWSER_SIZES.length} sizes clean; network requests 0; page errors 0`);
  } finally { await browser.close(); }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await runBrowserCheck();
