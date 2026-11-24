// L13b checks 1-3 (check 4 is replaced by l13c-checks.mjs). Real offline Edge pages, using the same local Playwright/GPU setup as L13.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { previewMarkup } from './preview.mjs';
import { pageMarkup } from './page.mjs';

const take = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(take, '.scratch/l13b');
const source = file => fs.readFileSync(path.join(take, file), 'utf8').replace(/\r\n/g, '\n');
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
  assert.equal(text.split(old).length, 2, 'L13b instrumentation: unique mutation site ' + old.slice(0, 60));
  return text.replace(old, replacement);
}
function instrument(html) {
  return replaceOnce(html, 'const field = stars?.frame(state ? starReach(state.stars, centre, W, H) : null, centre);',
    'const field = stars?.frame(state ? starReach(state.stars, centre, W, H) : null, centre); globalThis.__l13bObserve?.(field);');
}
function streakGate(row) {
  assert.ok(row.formed, 'L13b check 3: mark formed before drag');
  assert.equal(row.holdTapers, 0, 'L13b check 3: held mark must not streak');
  assert.equal(row.dragTapers, 0, 'L13b check 3: dragged mark must not streak');
  assert.ok(row.early > 0, 'L13b check 3: release must streak within 0.05 s');
}
function failsAt(run, gate) {
  let message;
  try { run(); } catch (e) { message = e.message; }
  assert.ok(message?.startsWith(gate), 'L13b negative control escaped ' + gate + (message ? ': ' + message : ''));
  return message.split('\n')[0];
}

export async function checkL13b({ baseline = false } = {}) {
  fs.mkdirSync(out, { recursive: true });
  const html = (baseline ? fs.readFileSync(path.join(out, 'preview-before.html'), 'utf8') : previewMarkup()).replace(/\r\n/g, '\n');
  const results = { baseline, selection: [], interaction: [], motion: {}, controls: {}, visual: [], requests: [], errors: [], positiveFailures: [], closedProfiles: [] };
  const playwright = localPlaywright();
  // Snapshots are evidence for this run only. Controls are reconstructed in memory on every invocation.
  const css = source('take-2.css');
  const originalCss = css.replace(/\/\* L13b: whole-page interaction policy\. \*\/[\s\S]*?\/\* End L13b policy\. \*\/\n?/, '');
  for (const [W, H] of baseline ? [[1440, 900]] : [[1440, 900], [390, 844]]) {
    const context = await playwright.chromium.launchPersistentContext(path.join(out, `edge-${baseline ? 'before' : 'after'}-${W}`), {
      executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true,
      viewport: { width: W, height: H }, hasTouch: W < 500, isMobile: W < 500,
      args: ['--disable-background-networking', '--disable-component-update', '--disable-sync', '--no-first-run', '--no-default-browser-check', '--disable-extensions'],
    });
    await context.route('**/*', route => {
      const u = route.request().url();
      if (/^(file|data|blob):/.test(u)) return route.continue();
      results.requests.push(u); return route.abort('blockedbyclient');
    });
    context.on('page', page => page.on('pageerror', e => results.errors.push(e.message)));
    async function localPage(markup, name) {
      const file = path.join(out, `${baseline ? 'before' : 'after'}-${W}-${name}.html`);
      fs.writeFileSync(file, '<script>history.replaceState(null,"","?t=0");</script>' + markup);
      const page = await context.newPage(); await page.goto(pathToFileURL(file).href);
      await page.waitForFunction(() => window.__ready && !__hero.loading && __hero.entering === null);
      return page;
    }
    async function clockPage(markup, name) {
      const page = await localPage(instrument(markup), name);
      await page.clock.install({ time: new Date('2026-11-24T12:00:00Z') });
      await page.clock.pauseAt(new Date('2026-11-24T12:00:01Z'));
      await page.evaluate(() => {
        window.__l13bRows = []; window.__l13bPhase = 'hold';
        window.__l13bObserve = st => {
          if (!st) return;
          let tapers = 0;
          for (let i = 0; i < st.count; i++) {
            const own = st.attrs[5 * i + 3], m = st.flags[i] > 1.5 ? st.mixes[i] : 0;
            const width = own + (Math.max(own, st.markSize) - own) * m;
            const length = Math.hypot(st.trails[4 * i], st.trails[4 * i + 1]);
            // Count the actual back and front submissions separately, with their renderer thresholds.
            if (length > own) tapers++;
            if (st.alpha[i] > 0 && length > width) tapers++;
          }
          __l13bRows.push({ phase: __l13bPhase, time: performance.now(), tapers });
        };
      });
      return page;
    }
    async function motion(markup, kind, name) {
      const page = await clockPage(markup, name);
      const box = await page.locator('[data-stage-box]').boundingBox();
      const centre = [box.x + box.width / 2, box.y + box.height / 2];
      await page.mouse.move(...(kind === 'fast' ? [1320, 450] : centre));
      await page.mouse.down();
      if (kind === 'eight') {
        await page.clock.runFor(3000);
        const formed = await page.evaluate(() => __hero.stars.mark.formed);
        await page.evaluate(() => { __l13bPhase = 'drag'; });
        for (let ms = 16; ms <= 2500; ms += 16) {
          const t = ms / 1000, a = 2 * Math.PI * t / 2.5;
          await page.mouse.move(centre[0] + 130 * Math.sin(a), centre[1] + 70 * Math.sin(2 * a));
          await page.clock.runFor(16);
        }
        await page.clock.runFor(4);
        await page.evaluate(() => { __l13bPhase = 'release'; window.__l13bRelease = performance.now(); });
        await page.mouse.up(); await page.clock.runFor(50);
        const rows = await page.evaluate(() => __l13bRows);
        const release = await page.evaluate(() => __l13bRelease);
        const sum = phase => rows.filter(r => r.phase === phase).reduce((n, r) => n + r.tapers, 0);
        const row = { formed, holdTapers: sum('hold'), dragTapers: sum('drag'), early: rows.filter(r => r.phase === 'release' && r.time - release <= 50).reduce((n, r) => n + r.tapers, 0), frames: rows.length, centre };
        await page.clock.resume(); await page.close(); return row;
      }
    }
    try {
      if (!baseline) {
        // previewMarkup removes addresses to keep its output offline. Restore the real page's addresses in the test DOM.
        const links = [...pageMarkup().matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/g)].map(m => m[1]);
        let revision;
        for (const control of [false, true]) {
          const markup = control ? replaceOnce(html, css, originalCss) : html;
          const page = await localPage(markup, control ? 'selection-control' : 'selection');
          const image = await page.screenshot({ path: path.join(out, `${control ? 'reference' : 'revision'}-${W}.png`) });
          if (!control) revision = image;
          else {
            const difference = await page.evaluate(async images => {
              const pixels = await Promise.all(images.map(src => new Promise(resolve => {
                const image = new Image(); image.onload = () => {
                  const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
                  const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0); resolve(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
                }; image.src = 'data:image/png;base64,' + src;
              })));
              let changed = 0;
              for (let i = 0; i < pixels[0].length; i += 4) if ([0, 1, 2, 3].some(k => pixels[0][i + k] !== pixels[1][i + k])) changed++;
              return changed;
            }, [revision.toString('base64'), image.toString('base64')]);
            results.visual.push({ W, H, changedPixels: difference });
          }
          const selection = [];
          async function empty(label) {
            selection.push({ label, text: await page.evaluate(() => getSelection().toString()) });
            await page.evaluate(() => getSelection().removeAllRanges());
          }
          await page.locator('body').click({ position: { x: 10, y: 10 } });
          await page.keyboard.press('Control+a'); await empty('Ctrl+A');
          await page.keyboard.press('Meta+a'); await empty('Meta+A');
          const lede = await page.locator('[data-lede]').boundingBox(), craft = await page.locator('[data-craft="2"]').boundingBox();
          await page.mouse.move(lede.x - 8, lede.y + 6); await page.mouse.down();
          await page.mouse.move(craft.x + craft.width - 3, craft.y + craft.height / 2, { steps: 20 }); await page.mouse.up(); await empty('drag');
          for (const selector of ['[data-lede]', '[data-craft="2"]']) for (const clickCount of [2, 3]) {
            await page.locator(selector).click({ clickCount }); await empty(selector + ' clicks ' + clickCount);
          }
          // A touch long press complements the specified desktop mouse gestures.
          if (W < 500) {
            const cdp = await context.newCDPSession(page), x = lede.x + 20, y = lede.y + 8;
            await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
            await page.waitForTimeout(650);
            await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
            await cdp.detach(); await empty('long press');
          }
          const styles = await page.evaluate(() => {
            const visible = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
            return { text: [...document.querySelectorAll('body *')].filter(e => visible(e) && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())).map(e => ({ tag: e.tagName, text: e.textContent.trim(), select: getComputedStyle(e).userSelect })),
              taps: [...document.querySelectorAll('a,button,canvas')].map(e => getComputedStyle(e).webkitTapHighlightColor),
              textContent: document.querySelector('[data-hero]').textContent.trim() };
          });
          const row = { W, H, control, selection, ...styles };
          const gate = () => {
            for (const s of selection) assert.equal(s.text, '', 'L13b check 1: selection after ' + s.label);
            assert.ok(styles.text.length >= 17, 'L13b check 1: visible text coverage');
            assert.ok(styles.text.every(s => s.select === 'none'), 'L13b check 1: computed user-select');
            assert.ok(styles.taps.every(s => s === 'rgba(0, 0, 0, 0)'), 'L13b check 1: tap highlight');
          };
          if (control) results.controls['selection-' + W] = failsAt(gate, 'L13b check 1: selection after Ctrl+A');
          else { gate(); results.selection.push(row); await page.screenshot({ path: path.join(out, `page-${W}.png`) }); }
          await page.close();
        }
        for (const control of [false, true]) {
          const markup = control ? replaceOnce(html, "crafts.forEach((button, i) => button.addEventListener('click', () => choose(i)));", "crafts.forEach((button, i) => button.addEventListener('click', () => {}));") : html;
          const page = await localPage(markup, control ? 'interaction-control' : 'interaction');
          await page.evaluate(links => {
            document.querySelectorAll('a').forEach((a, i) => a.setAttribute('href', links[i]));
            window.__linkActivations = [];
            document.addEventListener('click', e => { const a = e.target.closest('a'); if (a) { __linkActivations.push({ text: a.textContent.trim(), href: a.getAttribute('href'), prevented: e.defaultPrevented }); e.preventDefault(); } });
          }, links);
          async function activate(selector, method) {
            const el = page.locator(selector);
            if (method === 'click') await el.click();
            else if (method === 'tap') await el.tap();
            else { await el.focus(); await page.keyboard.press(method); }
          }
          const methods = W < 500 ? ['click', 'tap', 'Enter', 'Space'] : ['click', 'Enter', 'Space'];
          const checked = [];
          try {
            for (const method of methods) {
              for (let i = 0; i < 4; i++) {
                await page.evaluate(i => {
                  const other = __hero.SHOW.findIndex(s => s.craft !== i);
                  __hero.seek(__hero.SHOW.slice(0, other).reduce((n, s) => n + s.len, 0));
                }, i);
                await activate(`[data-craft="${i}"]`, method);
                const current = await page.locator(`[data-craft="${i}"]`).getAttribute('aria-current');
                assert.ok(current === 'true', 'L13b check 2: craft ' + i + ' ' + method);
                checked.push('craft ' + i + ' ' + method);
              }
              await activate('[data-pause]', method);
              assert.equal(await page.locator('[data-pause]').textContent(), 'Pause', 'L13b check 2: Play ' + method);
              await activate('[data-pause]', method);
              assert.equal(await page.locator('[data-pause]').textContent(), 'Play', 'L13b check 2: Pause ' + method);
              checked.push('Play/Pause ' + method);
              // Native anchors activate with Enter. Space remains their native scrolling key.
              if (method !== 'Space') for (const name of ['Journey', 'Contact']) {
                const selector = '.hero-links a:nth-child(' + (name === 'Journey' ? 1 : 2) + ')';
                const before = await page.evaluate(() => __linkActivations.length);
                await activate(selector, method);
                const activated = await page.evaluate(() => __linkActivations.at(-1));
                assert.equal(await page.evaluate(() => __linkActivations.length), before + 1, 'L13b check 2: ' + name + ' ' + method);
                assert.ok(activated.href && !activated.prevented, 'L13b check 2: native link default');
                checked.push(name + ' ' + method);
              }
            }
            assert.ok(!control, 'L13b check 2: disabled craft control escaped');
          } catch (e) {
            if (!control || !e.message.startsWith('L13b check 2: craft 0 click')) throw e;
            results.controls['interaction-' + W] = e.message.split('\n')[0];
          }
          if (!control) {
            await page.locator('[data-pause]').focus();
            const focus = await page.locator('[data-pause]').evaluate(e => ({ visible: e.matches(':focus-visible'), style: getComputedStyle(e).outlineStyle, width: getComputedStyle(e).outlineWidth }));
            assert.ok(focus.visible && focus.style !== 'none' && parseFloat(focus.width) > 0, 'L13b check 2: keyboard focus outline');
            const aria = await page.locator('[data-hero]').ariaSnapshot();
            assert.ok(aria.includes('Hey, I') && aria.includes('Welcome to my portfolio') && aria.toLowerCase().includes('graphic design'), 'L13b check 2: accessible text retained');
            results.interaction.push({ W, H, checked, focus, aria });
          }
          await page.close();
        }
      }
      if (W === 1440) {
        results.motion.eight = await motion(html, 'eight', 'eight');
        streakGate(results.motion.eight);
        if (!baseline) {
          const speed = replaceOnce(html, 'const trails = field.gateTrails(history.record(now, positions));', 'const trails = history.record(now, positions);');
          const row = await motion(speed, 'eight', 'speed-control');
          results.controls.speed = { ...row, gate: failsAt(() => assert.equal(row.dragTapers, 0, 'L13b check 3: dragged mark must not streak'), 'L13b check 3: dragged mark') };
        }
      }
    } finally {
      await context.close();
      results.closedProfiles.push(`edge-${baseline ? 'before' : 'after'}-${W}`);
      fs.writeFileSync(path.join(out, baseline ? 'before.json' : 'after.json'), JSON.stringify(results, null, 2));
    }
  }
  assert.equal(results.requests.length, 0, 'L13b offline: attempted network request');
  assert.equal(results.errors.length, 0, 'L13b page error: ' + results.errors.join('; '));
  assert.deepEqual(results.positiveFailures, [], 'L13b positive gates failed: ' + results.positiveFailures.join('; '));
  return results;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await checkL13b({ baseline: process.argv.includes('--baseline') });
  console.log('L13b: ' + JSON.stringify(result));
}
