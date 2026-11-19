import { drawHero } from './render.mjs';
import { makeCamera } from './engine.mjs';
import { stateAt, ENTRANCE, BEATS, ARRIVED, STILL, LABELS } from './timeline.mjs';
import { fitStage, planEntrance } from './layout.mjs';

const hero = document.querySelector('[data-hero]');
const art = hero.querySelector('[data-art]');
const box = hero.querySelector('[data-stage-box]');
const crafts = [...hero.querySelectorAll('[data-craft]')];
const pauseBtn = hero.querySelector('[data-pause]');
const ctx = art.getContext('2d');
const still = matchMedia('(prefers-reduced-motion: reduce)');
const pointer = matchMedia('(hover: hover) and (pointer: fine)');
const LOOP0 = ENTRANCE + BEATS;
const SCRUB = 8;
const TILT = { yaw: 6, pitch: 4, ease: 0.14 };
const held = new URLSearchParams(location.search).get('t');

let L = null;
let bounds = null;
let ratio = 1;
let t = 0;
let playing = true;
let goal = null;
let last = null;
let raf = 0;
let ready = false;
// Read changes from the event, rather than polling the query ahead of its notification.
let reduced = still.matches;
let onScreen = true;
let pageActive = true;
let reviewHold = held !== null;
let entering = true;
let lateNav = false;
let activeCraft = -1;
const cam = { yaw: 0, pitch: 0, toYaw: 0, toPitch: 0 };

// The hooks exist even while the font is loading. Seeking paints synchronously.
window.__hero = {
  seek(value) {
    stop();
    playing = false;
    goal = null;
    reviewHold = true;
    t = +value;
    flatten();
    if (ctx) {
      measure();
      draw();
    }
  },
  layout: () => L,
  get t() {
    return t;
  },
};

function measure() {
  const h = hero.getBoundingClientRect();
  bounds = h;
  const rel = el => {
    const r = el.getBoundingClientRect();
    return {
      left: r.left - h.left,
      top: r.top - h.top,
      right: r.right - h.left,
      bottom: r.bottom - h.top,
    };
  };
  const q = selector => rel(hero.querySelector(selector));
  const b = rel(box);
  const stacked = getComputedStyle(hero).getPropertyValue('--stacked').trim() === '1';
  const fit = fitStage(
    { x: b.left, y: b.top, w: b.right - b.left, h: b.bottom - b.top },
    h.width,
    h.height
  );
  const text = stacked ? [] : [q('[data-name]'), q('[data-lede]'), q('[data-crafts]')];
  const nav = [q('[data-nav]'), q('[data-mark]')];
  const ask = under =>
    planEntrance({
      vw: h.width,
      vh: h.height,
      ...fit,
      under,
      over: stacked ? [q('[data-name]')] : [],
      gapUnder: stacked ? 14 : 36,
      gapOver: 12,
      labelEnd: h.width - (stacked ? 20 : 112),
    });
  let plan = ask([...nav, ...text]);
  const late = plan.zoom < 0.7;
  if (late) plan = ask(text);
  if (late !== lateNav) {
    hero.classList.toggle('nav-late', late);
    lateNav = late;
  }
  L = { vw: h.width, vh: h.height, ...fit, ...plan };

  // Limit both density and total area on large or high-density screens.
  ratio = Math.min(window.devicePixelRatio || 1, 3, Math.sqrt(16000000 / (h.width * h.height)));
  const width = Math.max(1, Math.floor(h.width * ratio));
  const height = Math.max(1, Math.floor(h.height * ratio));
  if (art.width !== width) art.width = width;
  if (art.height !== height) art.height = height;
}

function draw() {
  if (!L || !ctx) return;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, art.width / ratio, art.height / ratio);
  const state = stateAt(t, L.entrance, L.zoom);
  drawHero(ctx, state.bars, state.order, {
    S: L.S * state.zoom,
    cx: L.cx,
    cy: L.cy,
    cam: makeCamera(cam.yaw, cam.pitch),
    labels: LABELS,
  });

  const nextEntering = t < ENTRANCE + 1;
  if (entering !== nextEntering) {
    hero.classList.toggle('is-entering', nextEntering);
    entering = nextEntering;
  }
  if (activeCraft !== state.act) {
    if (activeCraft >= 0) crafts[activeCraft].removeAttribute('aria-current');
    if (state.act >= 0) crafts[state.act].setAttribute('aria-current', 'true');
    activeCraft = state.act;
  }
}

function flatten() {
  cam.yaw = cam.pitch = cam.toYaw = cam.toPitch = 0;
}

function stop() {
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
  last = null;
}

function visible() {
  return onScreen && pageActive && !document.hidden;
}

function tiltPending() {
  const flat = t < ENTRANCE + 1;
  return (
    Math.abs(cam.yaw - (flat ? 0 : cam.toYaw)) +
      Math.abs(cam.pitch - (flat ? 0 : cam.toPitch)) >
    0.01
  );
}

function wake() {
  if (ready && !raf && visible() && !reduced && (playing || goal !== null || tiltPending())) {
    raf = requestAnimationFrame(frame);
  }
}

function frame(now) {
  raf = 0;
  if (!visible() || reduced) {
    last = null;
    return;
  }
  const dt = last === null ? 0 : Math.min(0.05, (now - last) / 1000);
  last = now;
  if (goal !== null) {
    const step = SCRUB * dt * Math.sign(goal - t);
    if (Math.abs(goal - t) <= Math.abs(step)) {
      t = goal;
      goal = null;
    } else {
      t += step;
    }
  } else if (playing) {
    t += dt;
  }
  if (t >= LOOP0 + BEATS && goal === null) t -= BEATS;
  const settle = 1 - Math.exp(-dt / TILT.ease);
  const flat = t < ENTRANCE + 1;
  cam.yaw += ((flat ? 0 : cam.toYaw) - cam.yaw) * settle;
  cam.pitch += ((flat ? 0 : cam.toPitch) - cam.pitch) * settle;
  draw();
  wake();
  if (!raf) last = null;
}

function jumpTo(k) {
  if (!ready) return;
  reviewHold = false;
  if (reduced) {
    t = LOOP0 + STILL[k];
    draw();
    return;
  }
  if (t < ENTRANCE + 1) {
    goal = ENTRANCE + ARRIVED[k];
  } else {
    while (t < LOOP0 + BEATS) t += BEATS;
    const at = (t - ENTRANCE) % BEATS;
    const ahead = (ARRIVED[k] - at + BEATS) % BEATS;
    goal = ahead <= BEATS / 2 ? t + ahead : t - (BEATS - ahead);
  }
  wake();
}

function updatePause() {
  const word = playing ? 'Pause' : 'Play';
  if (pauseBtn.textContent !== word) pauseBtn.textContent = word;
}

function refresh() {
  if (!ready) return;
  measure();
  draw();
}

function syncVisibility() {
  stop();
  wake();
}

function start() {
  ready = true;
  drawHero.clearMeasurements();
  measure();
  if (reviewHold) {
    window.__hero.seek(held === null ? t : held);
  } else if (reduced) {
    t = LOOP0 + STILL[0];
    draw();
  } else {
    draw();
    wake();
  }
}

if (ctx) {
  crafts.forEach((button, i) => button.addEventListener('click', () => jumpTo(i)));
  box.addEventListener('click', () => {
    if (!ready) return;
    const state = stateAt(goal ?? t, L.entrance, L.zoom);
    jumpTo((state.act + 1 + 4) % 4);
  });
  pauseBtn.addEventListener('click', () => {
    playing = !playing;
    reviewHold = false;
    updatePause();
    wake();
  });
  hero.addEventListener('pointermove', event => {
    if (!ready || reviewHold || reduced || !pointer.matches) return;
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    cam.toYaw = TILT.yaw * (x * 2 - 1);
    cam.toPitch = -TILT.pitch * (y * 2 - 1);
    wake();
  });
  hero.addEventListener('pointerleave', () => {
    cam.toYaw = cam.toPitch = 0;
    wake();
  });
  pointer.addEventListener('change', () => {
    if (!pointer.matches) {
      cam.toYaw = cam.toPitch = 0;
      wake();
    }
  });
  still.addEventListener('change', event => {
    reduced = event.matches;
    if (!ready) return;
    stop();
    goal = null;
    flatten();
    if (!reviewHold && event.matches) {
      const state = stateAt(t, L.entrance, L.zoom);
      t = LOOP0 + STILL[Math.max(0, state.act)];
    }
    if (!reviewHold && !event.matches) {
      playing = true;
      updatePause();
    }
    draw();
    wake();
  });

  document.addEventListener('visibilitychange', syncVisibility);
  window.addEventListener('pagehide', () => {
    pageActive = false;
    stop();
  });
  window.addEventListener('pageshow', () => {
    pageActive = true;
    refresh();
    syncVisibility();
  });
  new IntersectionObserver(entries => {
    onScreen = entries[0].isIntersecting;
    syncVisibility();
  }).observe(hero);
  const resize = new ResizeObserver(refresh);
  resize.observe(hero);
  resize.observe(box);
  window.addEventListener('resize', refresh);
  // Scrolling changes pointer coordinates without changing the hero's dimensions.
  window.addEventListener(
    'scroll',
    () => {
      if (ready) bounds = hero.getBoundingClientRect();
    },
    { passive: true }
  );

  const fonts = Promise.all([
    document.fonts.load('800 16px Outfit'),
    document.fonts.load('300 16px Outfit'),
  ]).catch(() => {});
  let timer;
  const timeout = new Promise(resolve => {
    timer = setTimeout(resolve, 3000);
  });
  Promise.race([fonts, timeout]).then(() => {
    clearTimeout(timer);
    start();
  });
  fonts.then(() => {
    if (ready) {
      drawHero.clearMeasurements();
      refresh();
    }
  });
}
