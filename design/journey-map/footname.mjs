// The hero's name model, copied locally. Only measure reads layout; the shared frame paints it.
import { FOOT_NAME, NOVA } from './data.mjs';
import { clamp01 } from './trip.mjs';
import { exploreLayerInverse, exploreTransform } from './explore.mjs';

const FN = { line: null, text: null, fx: null, red: null, letters: [], live: false, rm: false, em: 1, box: null,
  pointer: [FOOT_NAME.far, FOOT_NAME.far], open: 0, left: 0, top: 0, ink: null, pending: false, shift: [0, 0], measuredShift: [0, 0] };
const footSmooth = f => f * f * (3 - 2 * f);
export function footBezier(points, x) {
  const [x1, y1, x2, y2] = points, curve = (a, b, t) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t * t * b + t ** 3;
  if (x <= 0 || x >= 1) return clamp01(x);
  let lo = 0, hi = 1, t = x;
  for (let i = 0; i < FOOT_NAME.solveIterations; i++) { const error = curve(x1, x2, t) - x; if (Math.abs(error) < FOOT_NAME.solveEpsilon) break; if (error > 0) hi = t; else lo = t; t = (lo + hi) / 2; }
  return curve(y1, y2, t);
}
export const footOpenTarget = (x, y, box, em) => footSmooth(Math.max(0, 1 - Math.hypot(Math.max(box.left - x, 0, x - box.right), Math.max(box.top - y, 0, y - box.bottom)) / (FOOT_NAME.near * em)));
export const footRest = (dx, dy, em) => FOOT_NAME.rise * footSmooth(Math.max(0, 1 - Math.hypot(dx, dy * FOOT_NAME.dy) / (FOOT_NAME.feel * em)));
export function footLetterStep(letter, rest, dt, now) {
  if (letter.kick && now >= letter.kick) { letter.vy += FOOT_NAME.hop * FOOT_NAME.kick; letter.kick = 0; }
  letter.vy += (-(letter.y - rest) * FOOT_NAME.spring - letter.vy * FOOT_NAME.damp) * dt; letter.y += letter.vy * dt;
}
export function footnameMeasure(layer = exploreTransform()) {
  if (!FN.line || FN.rm) return;
  const b = FN.line.getBoundingClientRect();
  FN.measuredShift = FN.shift.slice();
  const a = exploreLayerInverse([b.left, b.top], layer), z = exploreLayerInverse([b.right, b.bottom], layer);
  FN.left = a[0]; FN.top = a[1]; FN.box = { left: a[0], top: a[1], right: z[0], bottom: z[1] };
  FN.em = parseFloat(window.getComputedStyle(FN.line).fontSize) || FOOT_NAME.fallbackEm;
  const range = document.createRange(); let inkTop = Infinity, inkBottom = -Infinity;
  FN.letters.forEach((letter, i) => {
    range.setStart(FN.text, i); range.setEnd(FN.text, i + 1);
    const r = range.getBoundingClientRect(), p = exploreLayerInverse([r.left, r.top], layer), q = exploreLayerInverse([r.right, r.bottom], layer);
    letter.cx = (p[0] + q[0]) / 2; letter.cy = (p[1] + q[1]) / 2;
    letter.els.forEach(el => el.style.left = (p[0] - FN.left).toFixed(3) + 'px');
    inkTop = Math.min(inkTop, p[1] - FN.top); inkBottom = Math.max(inkBottom, q[1] - FN.top);
  });
  FN.ink = { top: inkTop, bottom: inkBottom };
}
function footnameQueueMeasure() {
  if (FN.pending) return; FN.pending = true;
  queueMicrotask(() => { FN.pending = false; footnameMeasure(); });
}
export function footnameBuild(line, rm) {
  FN.line = line; FN.rm = rm; if (rm) return;
  FN.text = line.firstChild;
  FN.fx = document.createElement('span'); FN.fx.className = 'foot-name-fx'; FN.fx.setAttribute('aria-hidden', 'true');
  FN.red = document.createElement('span'); FN.red.className = 'foot-name-red';
  for (const ch of FN.text.data) {
    const plain = document.createElement('span'), red = document.createElement('span'); plain.className = red.className = 'foot-name-ch'; plain.dataset.ch = red.dataset.ch = ch;
    FN.fx.appendChild(plain); FN.red.appendChild(red); FN.letters.push({ els: [plain, red], y: 0, vy: 0, kick: 0, cx: 0, cy: 0 });
  }
  FN.fx.appendChild(FN.red); line.appendChild(FN.fx);
  window.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') FN.pointer = [e.clientX, e.clientY]; }, { passive: true });
  const away = () => { FN.pointer = [FOOT_NAME.far, FOOT_NAME.far]; };
  document.addEventListener('pointerleave', away); window.addEventListener('blur', away);
  line.addEventListener('pointerdown', e => {
    if (!FN.live || e.pointerType !== 'mouse') return;
    footnameMeasure(); const x = exploreLayerInverse([e.clientX, e.clientY], exploreTransform())[0], now = performance.now();
    FN.letters.forEach(letter => letter.kick = now + Math.abs(x - letter.cx) / FN.em * FOOT_NAME.wave);
  });
  window.addEventListener('jm-explore', footnameQueueMeasure);
  if (document.fonts?.ready) document.fonts.ready.then(() => footnameMeasure());
}
export function footnameReveal(st) {
  if (FN.rm || !FN.line) return;
  const b = NOVA.base, q = clamp01((st.settleT - b.textIn[0] - b.textGap) / (b.textIn[1] - b.textIn[0]));
  const reveal = footBezier(FOOT_NAME.wipe, q), weight = FOOT_NAME.weight[0] + (FOOT_NAME.weight[1] - FOOT_NAME.weight[0]) * footBezier(FOOT_NAME.enter, q);
  const ink = FN.ink, y = ink ? ink.bottom + FOOT_NAME.clipBottom - (ink.bottom - ink.top + FOOT_NAME.clipSlack) * reveal : 0;
  FN.line.style.clipPath = reveal >= 1 ? '' : ink ? `polygon(${FOOT_NAME.clipLeft}% ${y}px, ${FOOT_NAME.clipRight}% ${y}px, ${FOOT_NAME.clipRight}% ${FOOT_NAME.clipFloor}%, ${FOOT_NAME.clipLeft}% ${FOOT_NAME.clipFloor}%)` : 'inset(100% 0 0)';
  FN.line.style.fontWeight = q >= 1 ? '' : weight.toFixed(1);
  const live = q >= 1;
  if (FN.live !== live) {
    FN.live = live; FN.line.classList.toggle('is-live', live);
    if (live) footnameQueueMeasure();
    else { FN.open = 0; FN.letters.forEach(l => { l.y = l.vy = l.kick = 0; l.els.forEach(el => el.style.transform = ''); }); FN.red.style.clipPath = ''; }
  }
}
export function footnameFrame(time, dt, shift) {
  FN.shift = shift;
  if (!FN.live || !FN.box) return;
  const [mx, my] = exploreLayerInverse(FN.pointer, exploreTransform()).map((v, i) => v - shift[i] + FN.measuredShift[i]);
  const want = footOpenTarget(mx, my, FN.box, FN.em); FN.open += (want - FN.open) * Math.min(1, dt * FOOT_NAME.open);
  const radius = FOOT_NAME.radius * FN.em * FN.open;
  FN.red.style.clipPath = radius < FOOT_NAME.radiusEpsilon ? 'circle(0px at 0px 0px)' : `circle(${radius.toFixed(1)}px at ${(mx - FN.left).toFixed(1)}px ${(my - FN.top).toFixed(1)}px)`;
  FN.letters.forEach(letter => {
    footLetterStep(letter, footRest(mx - letter.cx, my - letter.cy, FN.em), dt, time * 1000);
    const tf = Math.abs(letter.y) > FOOT_NAME.paintEpsilon ? `translateY(${(-letter.y).toFixed(3)}em)` : '';
    letter.els.forEach(el => el.style.transform = tf);
  });
}
