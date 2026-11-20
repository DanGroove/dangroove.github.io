// External review only. Supply an already-open Playwright page displaying the packed file.
// This module neither launches nor closes a browser, serves a page, nor installs anything.
import assert from 'node:assert/strict';
import { SHOW, SCRIPTS, PACE, calloutsAt, playbackSpans } from '../stage.mjs';
import { visibleProjection, polygonsOverlap } from './correction-checks.mjs';

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
  for (const [width, height] of [[390, 664], [390, 844], [1440, 900], [1920, 1080]]) {
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
