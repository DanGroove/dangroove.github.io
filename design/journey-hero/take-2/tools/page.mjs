// The built hero's markup, with only its script swapped. Generated pages stay in this prototype.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const TAKE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const ROOT = path.resolve(TAKE, '../../..');

// Inline so the very first paint needs neither the module graph nor a stylesheet/font request.
export const LOADER_CSS = `
.hero-loader { display: none; }
.hero.is-loading .hero-loader { display: block; position: absolute; inset: 0; z-index: 20; background: #151314; }
html:not(.skip-loader) .hero.is-loading:not(.is-bursting) > :not(.hero-loader) { visibility: hidden !important; }
.hero.is-loading.is-bursting .hero-loader { background: transparent; pointer-events: none; }
.hero-loader canvas { display: block; width: 100%; height: 100%; }
.skip-loader .hero.is-loading .hero-loader { display: none; }
`;
export const LOADER_SKIP = `if (new URLSearchParams(location.search).has('t')) document.documentElement.classList.add('skip-loader');`;

export function outputPath(name) {
  const file = path.resolve(name);
  if (!file.startsWith(TAKE + path.sep)) {
    throw new Error('output must be inside design/journey-hero/take-2/');
  }
  const relative = path.relative(TAKE, file).toLowerCase().split(path.sep).join('/');
  if (['motion.md', 'motion-2.md', 'corrections-1.md', 'corrections-2.md', 'corrections-3.md', 'corrections-4.md', 'corrections-5.md'].includes(relative) || ['.scratch/crit', 'review/hardware'].some(p => relative === p || relative.startsWith(p + '/'))) throw new Error('the briefs and protected review records are read only');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  return file;
}

export function pageMarkup(kind = 'play') {
  if (!['play', 'stills'].includes(kind)) throw new Error('unknown page kind');
  let html = fs.readFileSync(path.join(ROOT, 'public/journey/index.html'), 'utf8');
  if (kind === 'play') {
    html = html.replace('</head>', `<style>${LOADER_CSS}</style>\n<script>${LOADER_SKIP}</script>\n</head>`);
    html = html.replace('class="hero is-entering" data-hero>', 'class="hero is-entering is-loading" data-hero>\n        <div class="hero-loader" data-loader role="status" aria-label="Loading portfolio"><canvas data-loader-stars aria-hidden="true"></canvas></div>');
    // Run immediately after the markup, before the page's module graph or atlas can block the main thread.
    html = html.replace('<script type="module" src="hero/hero.mjs"></script>', '');
    html = html.replace('</body>', `<script>${LOADER_SCRIPT}</script>\n<script type="module" src="hero/hero.mjs"></script>\n</body>`);
  }
  html = html.replace('<link rel="stylesheet" href="journey.css" />', '<link rel="stylesheet" href="journey.css" />\n    <link rel="stylesheet" href="/design/journey-hero/take-2/take-2.css" />');
  html = html.replace(/\s*<link rel="modulepreload"[^>]*>/g, '').replace(/<noscript>[\s\S]*?<\/noscript>/g, '');
  html = html.replace('<script type="module" src="hero/hero.mjs"></script>', `<script type="module" src="/design/journey-hero/take-2/${kind}.mjs"></script>`);
  // Dan, 21 November: his welcome under the name, the greeting on its own line. The first take in public/ keeps its own line.
  html = html.replace(/(<p class="hero-lede" data-lede>)[\s\S]*?(<\/p>)/, '$1\n            Hey, I&rsquo;m Dan! <span class="hero-lede-more">Welcome to my portfolio, where I show how I go from first sketch to final cut, and everything in between.</span>\n          $2');
  return html.replace('<meta charset="utf-8" />', '<meta charset="utf-8" />\n    <base href="/public/journey/" />');
}

export function writePage(kind = 'play') {
  const file = outputPath(path.join(TAKE, '.scratch', kind + '.html'));
  fs.writeFileSync(file, pageMarkup(kind));
  return '/' + path.relative(ROOT, file).split(path.sep).join('/');
}

export const writeStillsPage = () => writePage('stills');
export const writePlayerPage = () => writePage('play');


// Only the inline bootstrap is browser code. The source below is shared verbatim with the worker.
function canvasPainter(canvas, paths, box, viewport, ratio) {
  const sample = sampleMark(paths), ctx = canvas.getContext('2d');
  let scene, dpr;
  function resize(next, screen, scale) {
    dpr = Math.min(2, scale || 1, Math.sqrt(5.2e6 / (next.width * next.height)));
    canvas.width = Math.round(next.width * dpr); canvas.height = Math.round(next.height * dpr);
    scene = loaderScene(sample, next.width, next.height, screen);
  }
  resize(box, viewport, ratio);
  return { resize, paint(state) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, scene.W, scene.H);
    for (const dot of loaderDots(scene, state)) {
      if (!(dot.alpha > 0)) continue;
      // The shader's circular one-device-pixel fringe and subpixel diameter attenuation, in CSS coordinates.
      const r = dot.size / 2, fringe = 0.5 / dpr, outer = r + fringe;
      const colour = dot.colour.map(n => n.toFixed(4)).join(',');
      const alpha = dot.alpha * Math.min(1, dot.size * dpr);
      if (dot.streak > dot.size) {
        const dx = dot.x - dot.tail[0], dy = dot.y - dot.tail[1];
        const nx = -dy / dot.streak * r, ny = dx / dot.streak * r;
        ctx.fillStyle = `rgba(${colour},${alpha})`;
        ctx.beginPath(); ctx.moveTo(dot.tail[0], dot.tail[1]);
        ctx.lineTo(dot.x + nx, dot.y + ny); ctx.lineTo(dot.x - nx, dot.y - ny);
        ctx.closePath(); ctx.fill();
      }
      const ink = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, outer);
      ink.addColorStop(Math.max(0, r - fringe) / outer, `rgba(${colour},${alpha})`);
      ink.addColorStop(1, `rgba(${colour},0)`);
      ctx.fillStyle = ink; ctx.fillRect(dot.x - outer, dot.y - outer, 2 * outer, 2 * outer);
    }
  } };
}

function loaderWorker() {
  let painter, start = null, origin, boot = {}, reduced = false, request = 0;
  const now = () => (performance.timeOrigin + performance.now() - origin) / 1000;
  const animate = () => {
    const time = now();
    if (start === null) { start = time; postMessage({ start }); }
    const progress = Object.fromEntries(Object.entries(boot).map(([k, at]) => [k, Math.max(0, at - start)]));
    painter.paint(loaderAt(Math.max(0, time - start), progress, { reduced }));
    request = requestAnimationFrame(animate);
  };
  onmessage = ({ data }) => {
    if (data.init) {
      origin = data.origin; reduced = data.reduced;
      painter = canvasPainter(data.canvas, data.paths, data.box, data.viewport, data.ratio);
      // A real worker rAF is required; otherwise the main thread uses the retained-frame fallback.
      request = requestAnimationFrame(animate);
    } else if (data.boot) boot[data.boot] = data.at;
    else if (data.box) painter.resize(data.box, data.viewport, data.ratio);
    else if (data.motion !== undefined) reduced = data.motion;
    else if (data.stop) { cancelAnimationFrame(request); close(); }
  };
}

function earlyLoader(pure) {
  if (new URLSearchParams(location.search).has('t')) return;
  const hero = document.querySelector('[data-hero]'), overlay = hero.querySelector('[data-loader]');
  let canvas = overlay.querySelector('canvas'), worker = null, painter = null, start = null, request = 0, cleared = false;
  const paths = [...hero.querySelectorAll('[data-mark] path')].map(p => ({ d: p.getAttribute('d'), fill: p.getAttribute('fill') }));
  const media = matchMedia('(prefers-reduced-motion: reduce)'), boot = {};
  let reduced = media.matches;
  let box = hero.getBoundingClientRect();
  const viewport = () => ({ width: innerWidth, height: innerHeight, left: box.left, top: box.top });
  const state = now => loaderAt(start === null ? 0 : Math.max(0, now - start),
    Object.fromEntries(Object.entries(boot).map(([k, at]) => [k, start === null ? 0 : Math.max(0, at - start)])), { reduced });
  function fallback() {
    if (cleared || painter) return;
    worker?.terminate(); worker = null;
    // A transferred canvas cannot regain a main-thread context. Replace only that canvas on worker failure.
    const replacement = canvas.cloneNode(); canvas.replaceWith(replacement); canvas = replacement;
    painter = canvasPainter(canvas, paths, box, viewport(), devicePixelRatio);
    const animate = now => {
      if (cleared) return;
      if (start === null) start = now / 1000;
      painter.paint(state(now / 1000)); request = requestAnimationFrame(animate);
    };
    // Reduced motion is formed synchronously, before the first paint; no worker is needed.
    painter.paint(loaderAt(0, {}, { reduced }));
    request = requestAnimationFrame(animate);
  }
  const onScroll = () => bridge.measure(hero.getBoundingClientRect());
  const bridge = {
    state,
    boot(key) { const at = performance.now() / 1000; boot[key] = at; worker?.postMessage({ boot: key, at }); },
    apply(s) { hero.classList.toggle('is-bursting', s.entranceTime !== null); },
    measure(rect) {
      if (cleared) return;
      box = rect;
      const next = { box: { width: box.width, height: box.height }, viewport: viewport(), ratio: devicePixelRatio };
      if (worker) worker.postMessage(next); else painter?.resize(next.box, next.viewport, next.ratio);
    },
    motion(value) { reduced = value; worker?.postMessage({ motion: value }); },
    clear() {
      cleared = true; worker?.terminate(); cancelAnimationFrame(request);
      window.removeEventListener('scroll', onScroll);
      hero.classList.remove('is-bursting'); overlay.remove();
    },
    get mode() { return worker ? 'worker' : 'main'; },
  };
  window.__loaderStars = bridge;
  window.addEventListener('scroll', onScroll, { passive: true });
  media.addEventListener('change', () => bridge.motion(media.matches));
  if (!reduced && typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined' && canvas.transferControlToOffscreen) {
    try {
      const code = pure + '\n' + canvasPainter.toString() + '\n(' + loaderWorker.toString() + ')();';
      const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
      worker = new Worker(url); URL.revokeObjectURL(url);
      worker.onerror = fallback;
      worker.onmessage = ({ data }) => { if (data.start !== undefined) start = data.start; };
      const offscreen = canvas.transferControlToOffscreen();
      worker.postMessage({ init: true, canvas: offscreen, paths, box: { width: box.width, height: box.height }, viewport: viewport(),
        ratio: devicePixelRatio, reduced, origin: performance.timeOrigin }, [offscreen]);
    } catch { fallback(); }
  } else fallback();
}

// One import-free copy of the pure module is the inline runtime and the Blob worker's source.
const LOADER_PURE = fs.readFileSync(path.join(TAKE, 'loader-stars.mjs'), 'utf8').replace(/^export /gm, '');
export const LOADER_SCRIPT = `(function(){\nfunction loaderCore(){\n${LOADER_PURE}\nreturn { sampleMark, loaderScene, loaderDots, loaderAt };\n}\nconst { sampleMark, loaderScene, loaderDots, loaderAt } = loaderCore();\n${canvasPainter.toString()}\n${loaderWorker.toString()}\n(${earlyLoader.toString()})('const { sampleMark, loaderScene, loaderDots, loaderAt } = (' + loaderCore.toString() + ')();');\n})();`.replace(/<\/script/gi, '<\\/script');

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(writeStillsPage());
  console.log(writePlayerPage());
}
