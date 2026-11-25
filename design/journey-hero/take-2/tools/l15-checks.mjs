// L15: actual font-ready text line boxes, original seeded homes, and loader handover.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { previewMarkup } from './preview.mjs';
import * as P from '../loader-stars.mjs';
import { pageMarkup } from './page.mjs';
import { checkLoaderLanding, checkLoaderMoves, checkLoaderRoundness, checkLoaderDurations, checkLoaderPop } from './loader-checks.mjs';

const take = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), out = path.join(take, '.scratch/l15');
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
  assert.equal(text.split(from).length, 2, 'L15 instrumentation: unique site ' + from.slice(0, 60));
  return text.replace(from, to);
}
function instrument(html) {
  return replaceOnce(html, 'const field = stars?.frame(state ? starReach(state.stars, centre, W, H) : null, centre);',
    'const field = stars?.frame(state ? starReach(state.stars, centre, W, H) : null, centre); globalThis.__l15Field = stars?.field;');
}
// Independent oracle: rectangle vs the entire square pointer range, not only the current pointer.
const reaches = (s, r) => {
  const reach = 2 + s.size / 2 + .5 * P.STARS.parallax * (.12 + .88 * s.d ** 2);
  return s.x >= r.left - reach && s.x <= r.right + reach && s.y >= r.top - reach && s.y <= r.bottom + reach;
};
const hazards = (stars, rects) => stars.flatMap((s, i) => rects.some(r => reaches(s, r)) ? [i] : []);
function originalStars(W, H) {
  return Array.from({ length: P.starCount(W, H) }, (_, i) => {
    const d = P.hash(i, 2);
    return { x: P.hash(i, 0) * W, y: P.hash(i, 1) * H, d,
      size: P.STARS.size[0] + (P.STARS.size[1] - P.STARS.size[0]) * d,
      mix: P.STARS.mix[0] + (P.STARS.mix[1] - P.STARS.mix[0]) * d,
      red: P.hash(i, 3) < P.STARS.red, m: P.STARS.mass[0] + (P.STARS.mass[1] - P.STARS.mass[0]) * P.hash(i, 4) };
  });
}
export function labelGate(stars, rects) {
  assert.deepEqual(hazards(stars, rects), [], 'L15 resting labels: homes can reach a label');
}
function checkHomes(row) {
  const { W, H, stars, rects } = row, original = originalStars(W, H), bad = hazards(original, rects);
  assert.equal(stars.length, original.length, 'L15 count');
  labelGate(stars, rects);
  const moved = [];
  for (let i = 0; i < stars.length; i++) {
    const s = stars[i], old = original[i];
    assert.deepEqual([s.d, s.size, s.mix, s.red, s.m], [old.d, old.size, old.mix, old.red, old.m], 'L15 attributes ' + i);
    if (!bad.includes(i)) { assert.deepEqual(s, old, 'L15 unchanged home ' + i); continue; }
    let k = 0, next;
    do { next = { ...old, x: P.hash(i, 40 + 2 * k) * W, y: P.hash(i, 41 + 2 * k) * H }; k++; } while (rects.some(r => reaches(next, r)));
    assert.deepEqual(s, next, 'L15 first clear seeded draw ' + i);
    assert.ok(s.x >= 0 && s.x < W && s.y >= 0 && s.y < H, 'L15 inside hero ' + i);
    moved.push({ i, old: [old.x, old.y], new: [s.x, s.y], draw: k - 1 });
  }
  let control;
  try { labelGate(original, rects); } catch (e) { control = e.message.split('\n')[0]; }
  assert.ok(control?.startsWith('L15 resting labels:'), 'L15 original-generator control escaped');
  return { count: stars.length, before: bad, after: hazards(stars, rects), moved, control };
}
// Read the actual text nodes independently of the production measurement helper.
function readPage() {
  const hero = document.querySelector('[data-hero]'), box = hero.getBoundingClientRect(), rects = [];
  for (const el of hero.querySelectorAll('[data-nav] a, [data-cue], [data-pause]')) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const text = walker.currentNode;
      if (!text.data.trim()) continue;
      const range = document.createRange(); range.selectNodeContents(text);
      for (const r of range.getClientRects()) if (r.width && r.height) rects.push({ label: el.textContent.trim(), left: r.left - box.left, top: r.top - box.top, right: r.right - box.left, bottom: r.bottom - box.top });
    }
  }
  return { W: box.width, H: box.height, rects, stars: __l15Field.stars, scroll: scrollY, font: getComputedStyle(hero.querySelector('[data-nav]')).fontFamily };
}

function observeLoader(html) {
  html = replaceOnce(html, 'return { resize, paint(state) {', `return { resize, paint(state) {
    if (state.burstTime !== null) {
      const firstLanding = Math.min(...scene.points.map(p => p.duration));
      const phase = state.burstTime >= firstLanding ? 'landed' : 'burst';
      if (globalThis.__l15Phase !== phase) {
        globalThis.__l15Phase = phase;
        const evidence = { phase, time: state.time, burstTime: state.burstTime, firstLanding, labels, homes: scene.homes, duration: scene.duration };
        if (typeof document === 'undefined') postMessage({ l15: evidence });
        else (globalThis.__l15LoaderRows ??= []).push(evidence);
      }
    }`);
  return replaceOnce(html, 'worker.onmessage = ({ data }) => { if (data.start !== undefined) start = data.start; };',
    'worker.onmessage = ({ data }) => { if (data.l15) (window.__l15LoaderRows ??= []).push(data.l15); if (data.start !== undefined) start = data.start; };');
}
function scenes(W, H, rects) {
  const header = pageMarkup().match(/<a[^>]*data-mark[^>]*>([\s\S]*?<\/svg>)/)[1];
  const paths = [...header.matchAll(/<path\b[^>]*>/g)].map(([p]) => ({ d: p.match(/\bd="([^"]+)"/)[1], fill: p.match(/\bfill="([^"]+)"/)[1] }));
  const sample = P.sampleMark(paths), viewport = { width: W, height: H, left: 0, top: 0 };
  return { before: P.loaderScene(sample, W, H, viewport), after: P.loaderScene(sample, W, H, viewport, rects) };
}
function geometry(scene) {
  const duration = checkLoaderDurations(P, scene), roundness = checkLoaderRoundness(P, scene);
  const landing = checkLoaderLanding(P, scene), pop = checkLoaderPop(P, scene);
  const moves = checkLoaderMoves(P, scene);
  return { duration, roundness, landing, pop, moves, handover: 3.16 + scene.duration };
}

export async function checkL15({ baseline = false } = {}) {
  fs.mkdirSync(out, { recursive: true });
  const html = instrument(baseline ? fs.readFileSync(path.join(out, 'before.html'), 'utf8') : previewMarkup());
  const playwright = localPlaywright(), result = { baseline, sizes: [], loaders: [], geometry: [], requests: [], errors: [], closed: [] };
  for (const [W, H, expected] of [[1440, 900, 8], [390, 844, 14], [412, 730, 11]]) {
    const context = await playwright.chromium.launchPersistentContext(path.join(out, `edge-${baseline ? 'before' : 'after'}-${W}`), {
      executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true,
      viewport: { width: W, height: H }, deviceScaleFactor: 1, hasTouch: W < 500, isMobile: W < 500,
      args: ['--disable-background-networking', '--disable-component-update', '--disable-sync', '--no-first-run', '--no-default-browser-check', '--disable-extensions'],
    });
    try {
      await context.route('**/*', route => {
        const u = route.request().url(); if (/^(file|data|blob):/.test(u)) return route.continue();
        result.requests.push(u); return route.abort('blockedbyclient');
      });
      context.on('page', p => p.on('pageerror', e => result.errors.push(e.message)));
      const file = path.join(out, `${baseline ? 'before' : 'after'}-${W}.html`); fs.writeFileSync(file, html);
      const page = await context.newPage(); await page.goto(pathToFileURL(file).href + '?t=0');
      await page.waitForFunction(() => window.__ready && !__hero.loading && __hero.entering === null);
      const row = await page.evaluate(readPage);
      assert.equal(row.scroll, 0, 'L15 scroll zero'); assert.equal(row.rects.length, 4, 'L15 four text line boxes');
      assert.ok(row.font.includes('Outfit'), 'L15 hero font');
      const original = originalStars(W, H), bad = hazards(original, row.rects);
      if (baseline) assert.deepEqual(row.stars, original, 'L15 incoming generator equals independent original');
      assert.equal(bad.length, expected, 'L15 incoming count at ' + W);
      if (W === 412) assert.ok(bad.includes(198), 'L15 Contact punctuation regression');
      await page.screenshot({ path: path.join(out, `${baseline ? 'before' : 'after'}-${W}.png`) });
      result.sizes.push({ W, H, rects: row.rects, ...(baseline ? { count: row.stars.length, before: bad, actual: hazards(row.stars, row.rects) } : checkHomes(row)) });
      await page.close();
      if (!baseline) {
        // The old generator is reconstructed in memory, in the actual browser, on every suite run.
        const site = 'function makeStars(W, H, labels = []) {';
        assert.equal(html.split(site).length, 3, 'L15 control: inline and field copies');
        const oldFile = path.join(out, `control-${W}.html`);
        fs.writeFileSync(oldFile, html.replaceAll(site, site + '\n  labels = [];'));
        const controlPage = await context.newPage(); await controlPage.goto(pathToFileURL(oldFile).href + '?t=0');
        await controlPage.waitForFunction(() => window.__ready && !__hero.loading && __hero.entering === null);
        const control = await controlPage.evaluate(readPage);
        assert.deepEqual(control.stars, original, 'L15 browser control reproduces original homes and attributes');
        let caught; try { labelGate(control.stars, control.rects); } catch (e) { caught = e.message.split('\n')[0]; }
        assert.ok(caught?.startsWith('L15 resting labels:'), 'L15 browser control escaped');
        result.sizes.at(-1).browserControl = { caught, hazards: hazards(control.stars, control.rects) };
        await controlPage.close();
        for (const mode of W === 412 ? ['worker', 'main', 'reduced'] : ['worker']) {
          const liveFile = path.join(out, `loader-${W}-${mode}.html`);
          let live = observeLoader(html);
          // Exercise the real retained-frame painter, without changing its drawing or timing.
          if (mode === 'main') live = '<script>window.Worker = undefined;</script>' + live;
          const livePage = await context.newPage();
          if (mode === 'reduced') await livePage.emulateMedia({ reducedMotion: 'reduce' });
          fs.writeFileSync(liveFile, live); await livePage.goto(pathToFileURL(liveFile).href);
          await livePage.waitForFunction(() => window.__loaderStars && window.__ready);
          const backend = await livePage.evaluate(() => __loaderStars.mode);
          assert.equal(backend, mode === 'worker' ? 'worker' : 'main', 'L15 loader backend');
          await livePage.waitForFunction(() => !__hero.loading && __hero.entering === null);
          const landed = await livePage.evaluate(readPage), rows = await livePage.evaluate(() => window.__l15LoaderRows || []);
          const homeCheck = checkHomes(landed);
          if (mode === 'reduced') assert.deepEqual(rows, [], 'L15 reduced still/cut has no burst');
          else {
            assert.deepEqual(rows.map(r => r.phase), ['burst', 'landed'], 'L15 loader observed before and at first home landing');
            assert.ok(rows[0].burstTime < rows[0].firstLanding && rows[1].burstTime >= rows[1].firstLanding, 'L15 no premature landing');
            const expected = scenes(W, H, landed.rects).after;
            for (const r of rows) {
              assert.deepEqual(r.labels, landed.rects.map(({ label, ...rect }) => rect), 'L15 font-ready rectangles before any home landing');
              assert.deepEqual(r.homes, expected.homes, 'L15 actual painter homes equal guarded field upload');
            }
          }
          result.loaders.push({ W, H, mode, backend, before: homeCheck.before.length, after: homeCheck.after.length,
            phases: rows.map(r => ({ phase: r.phase, burstTime: r.burstTime, firstLanding: r.firstLanding, duration: r.duration })) });
          await livePage.close();
        }
        const pair = scenes(W, H, row.rects);
        result.geometry.push({ W, H, before: geometry(pair.before), after: geometry(pair.after) });
      }
    } finally { await context.close(); result.closed.push(W); fs.writeFileSync(path.join(out, baseline ? 'before.json' : 'after.json'), JSON.stringify(result, null, 2)); }
  }
  assert.deepEqual(result.requests, [], 'L15 no page network requests'); assert.deepEqual(result.errors, [], 'L15 no page errors');
  return result;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await checkL15({ baseline: process.argv.includes('--baseline') })));
