// Shared by the tools that look at the page in a real browser (measure, shots, compare, live, sheet).
// They need Playwright with its Chromium. It is not a dependency of the site: the review machine has it installed globally.
// Both pages have to offer the same review hooks: ?t=<seconds> in the address, and window.__hero = { seek(t), layout(), t }.
import { createRequire } from 'node:module';
import { serve, PAGES } from './serve.mjs';

const require = createRequire(import.meta.url);
export const SIZES = ['1440x900', '390x844', '360x640', '768x1024', '1024x768', '1920x1080', '600x960', '1280x720', '430x932', '820x1180', '2560x1440', '1366x768', '1536x864', '393x852', '412x915', '844x390',
  // screens as a browser shows them: the screen less the browser's own bars, which is the room the first screen really has
  '390x664', '393x659', '430x739', '412x775', '360x650', '375x629', '375x548', '1440x789', '1536x730', '1366x650', '1920x950', '1280x600'];

export async function studio() {
  const { chromium } = require('playwright');
  const { server, url } = await serve(0), browser = await chromium.launch(), errors = [];
  return {
    browser, errors,
    // which: 'built' | 'rough'. size: '1440x900', or '390x844@2' for a 2x screen. hold: the moment to hold, or null to let the page play.
    async open(which, size, { reducedMotion = false, hold = 0 } = {}) {
      const [dims, scale = '1'] = size.split('@'), [width, height] = dims.split('x').map(Number);
      const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: +scale, reducedMotion: reducedMotion ? 'reduce' : 'no-preference' });
      const page = await context.newPage();
      page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${which} ${size}: ${m.text()}`); });
      page.on('pageerror', e => errors.push(`${which} ${size}: ${e}`));
      page.on('requestfailed', r => errors.push(`${which} ${size}: could not load ${r.url()}`));
      await page.goto(url + PAGES[which] + (hold === null ? '' : `?t=${hold}`));
      await page.waitForFunction(() => window.__hero && window.__hero.layout(), null, { timeout: 15000 });
      if (hold !== null) await page.evaluate(() => Promise.all(document.getAnimations().map(a => a.finished)));   // the name settling to its weight
      return page;
    },
    async close() { await browser.close(); server.close(); },
  };
}

// hold a moment, and wait until it is on screen
export async function seek(page, t) {
  await page.evaluate(x => window.__hero.seek(x), +t);
  await page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))));
}

// where the page has put the text and the art, in px from the hero's top left corner
export const layoutOf = page => page.evaluate(() => {
  const hero = document.querySelector('[data-hero]'), h = hero.getBoundingClientRect();
  const box = r => ({ left: r.left - h.left, top: r.top - h.top, right: r.right - h.left, bottom: r.bottom - h.top });
  const rel = sel => box(hero.querySelector(sel).getBoundingClientRect());
  const tight = sel => { const g = document.createRange(); g.selectNodeContents(hero.querySelector(sel)); return box(g.getBoundingClientRect()); };
  return {
    late: hero.classList.contains('nav-late'),
    L: window.__hero.layout(),
    rects: { mark: rel('[data-mark]'), nav: rel('[data-nav]'), name: rel('[data-name]'), lede: rel('[data-lede]'), crafts: rel('[data-crafts]'), foot: tight('[data-cue]'), pause: rel('[data-pause]') },
  };
});
