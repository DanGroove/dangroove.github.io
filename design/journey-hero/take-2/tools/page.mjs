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
  const sample = sampleMark(paths);
  // Per-star Canvas gradients created native garbage every frame. Keep the same circular fringe and shared
  // triangles in two batched GPU draws; Canvas remains the retained-frame fallback where WebGL2 is absent.
  const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: true });
  const gpu = gl && typeof gl.createShader === 'function' ? makeGPU() : null;
  const ctx = gpu ? null : canvas.getContext('2d');
  let scene, dpr;
  function makeGPU() {
    const vertex = `#version 300 es
precision highp float;
layout(location=0) in vec2 aPosition;
layout(location=1) in float aSize;
layout(location=2) in vec4 aColour;
layout(location=3) in vec4 aEnds;
uniform vec2 uSize;
uniform float uDpr;
out float vR;
out vec4 vColour;
flat out vec4 vEnds;
void main() {
  vR = aSize * uDpr / 2.0; vColour = aColour; vEnds = aEnds * uDpr;
  gl_PointSize = ceil(2.0 * vR) + 2.0;
  gl_Position = vec4(2.0 * aPosition.x / uSize.x - 1.0, 1.0 - 2.0 * aPosition.y / uSize.y, 0.0, 1.0);
}`;
    const fragment = `#version 300 es
precision highp float;
in float vR;
in vec4 vColour;
flat in vec4 vEnds;
uniform vec2 uSize;
uniform float uDpr;
uniform bool uStroke;
out vec4 o;
void main() {
  float coverage = 1.0;
  if (uStroke) {
    // Coverage of the original taper's three edges, in device pixels. The padded raster
    // quad only invokes this shader; it never supplies the taper's painted width.
    vec2 p = vec2(gl_FragCoord.x, uSize.y * uDpr - gl_FragCoord.y);
    vec2 head = vEnds.xy - p, tail = vEnds.zw - p, d = head - tail;
    vec2 n = vec2(-d.y, d.x) / max(length(d), 0.00001);
    vec2 triangle[3] = vec2[3](tail, head - n * vR, head + n * vR);
    float distance = 1e9;
    for (int edge = 0; edge < 3; edge++) {
      vec2 a = triangle[edge], line = triangle[(edge + 1) % 3] - a;
      distance = min(distance, (line.y * a.x - line.x * a.y) / max(length(line), .00001));
    }
    coverage = clamp(distance / 1.2 + .5, 0.0, 1.0);
  } else {
    float dist = length(gl_PointCoord - 0.5) * (ceil(2.0 * vR) + 2.0);
    coverage = clamp(vR + 0.5 - dist, 0.0, 1.0);
  }
  float a = vColour.a * coverage;
  o = vec4(vColour.rgb * a, a);
}`;
    const program = gl.createProgram();
    for (const [type, source] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]]) {
      const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    const buffer = gl.createBuffer(), vao = gl.createVertexArray(); gl.bindVertexArray(vao); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    for (const [index, count, offset] of [[0, 2, 0], [1, 1, 8], [2, 4, 12], [3, 4, 28]]) {
      gl.enableVertexAttribArray(index); gl.vertexAttribPointer(index, count, gl.FLOAT, false, 44, offset);
    }
    const size = gl.getUniformLocation(program, 'uSize'), ratio = gl.getUniformLocation(program, 'uDpr'), stroke = gl.getUniformLocation(program, 'uStroke');
    let data = new Float32Array(0);
    return dots => {
      if (data.length < dots.length * 77) data = new Float32Array(dots.length * 77);
      let at = 0;
      const vertexAt = (x, y, d) => {
        data[at++] = x; data[at++] = y; data[at++] = d.size;
        for (const c of d.colour) data[at++] = c / 255;
        data[at++] = d.alpha * Math.min(1, d.size * dpr);
        data[at++] = d.x; data[at++] = d.y; data[at++] = d.tail?.[0] ?? d.x; data[at++] = d.tail?.[1] ?? d.y;
      };
      for (const d of dots) if (d.alpha > 0) {
        const shape = streakGeometry(d.x, d.y, d.size, d.tail || [d.x, d.y]);
        if (!shape.triangle.length) continue;
        const [nx, ny] = shape.normal, dx = d.x - d.tail[0], dy = d.y - d.tail[1], length = Math.hypot(dx, dy);
        const pad = 2 / dpr, radius = d.size / 2 + pad, ux = dx / length * pad, uy = dy / length * pad;
        const a = [d.tail[0] - ux + nx * radius, d.tail[1] - uy + ny * radius], b = [d.tail[0] - ux - nx * radius, d.tail[1] - uy - ny * radius];
        const c = [d.x + ux + nx * radius, d.y + uy + ny * radius], e = [d.x + ux - nx * radius, d.y + uy - ny * radius];
        for (const p of [a, b, c, c, b, e]) vertexAt(p[0], p[1], d);
      }
      const triangles = at / 11;
      for (const d of dots) if (d.alpha > 0) vertexAt(d.x, d.y, d);
      gl.viewport(0, 0, canvas.width, canvas.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program); gl.bindVertexArray(vao); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, data.subarray(0, at), gl.DYNAMIC_DRAW);
      gl.uniform2f(size, scene.W, scene.H); gl.uniform1f(ratio, dpr);
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.uniform1i(stroke, 1); gl.drawArrays(gl.TRIANGLES, 0, triangles);
      gl.uniform1i(stroke, 0); gl.drawArrays(gl.POINTS, triangles, at / 11 - triangles);
    };
  }
  function resize(next, screen, scale) {
    dpr = Math.min(2, scale || 1, Math.sqrt(5.2e6 / (next.width * next.height)));
    canvas.width = Math.round(next.width * dpr); canvas.height = Math.round(next.height * dpr);
    scene = loaderScene(sample, next.width, next.height, screen);
  }
  resize(box, viewport, ratio);
  if (gpu) {
    // Compile the first real point draw during worker setup, before its animation clock/first canvas commit.
    // Clear in the same command stream: no warm-up pixel is ever presented.
    gpu([{ x: 0, y: 0, tail: [20, 0], size: 2, colour: [21, 19, 20], alpha: 1 }]);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
  return { resize, paint(state) {
    if (gpu) { gpu(loaderDots(scene, state)); return; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, scene.W, scene.H);
    for (const dot of loaderDots(scene, state)) {
      if (!(dot.alpha > 0)) continue;
      // The shader's circular one-device-pixel fringe and subpixel diameter attenuation, in CSS coordinates.
      const r = dot.size / 2, fringe = 0.5 / dpr, outer = r + fringe;
      const colour = dot.colour.map(n => n.toFixed(4)).join(',');
      const alpha = dot.alpha * Math.min(1, dot.size * dpr);
      if (dot.streak > dot.size) {
        const triangle = streakGeometry(dot.x, dot.y, dot.size, dot.tail).triangle;
        ctx.fillStyle = `rgba(${colour},${alpha})`;
        ctx.beginPath(); ctx.moveTo(triangle[0], triangle[1]);
        ctx.lineTo(triangle[2], triangle[3]); ctx.lineTo(triangle[4], triangle[5]);
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
export const LOADER_SCRIPT = `(function(){\nfunction loaderCore(){\n${LOADER_PURE}\nreturn { sampleMark, loaderScene, loaderDots, loaderAt, streakGeometry };\n}\nconst { sampleMark, loaderScene, loaderDots, loaderAt, streakGeometry } = loaderCore();\n${canvasPainter.toString()}\n${loaderWorker.toString()}\n(${earlyLoader.toString()})('const { sampleMark, loaderScene, loaderDots, loaderAt, streakGeometry } = (' + loaderCore.toString() + ')();');\n})();`.replace(/<\/script/gi, '<\\/script');

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(writeStillsPage());
  console.log(writePlayerPage());
}
