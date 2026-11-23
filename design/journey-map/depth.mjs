// The one layer model, plus its three render surfaces. Importing this module needs no DOM.
import { C, MAP, DEPTH, NOVA, STOPS } from './data.mjs';
import { rnd, COAST_A, COAST_B, depthCloudDrawing, depthRavenDrawing } from './art.mjs';
import { VIEW, toScreen, smooth, lerp, clamp01 } from './trip.mjs';

export const depthLift = st => Math.max(0, DEPTH.base + DEPTH.gain * (st.cam.s - VIEW.s0) / (VIEW.sT - VIEW.s0));
export const depthFactor = (st, a) => Math.max(DEPTH.minK, 1 + a * depthLift(st));
export const depthPoint = (st, p, a, look = [0, 0]) => {
  const k = depthFactor(st, a), g = toScreen(st, p), vx = st.cam.ax + look[0], vy = st.cam.ay + look[1];
  return { x: vx + (g[0] - vx) * k, y: vy + (g[1] - vy) * k, k, s: st.cam.s * k };
};
export const depthVisibility = (k, layer) => smooth(...layer.show, k) * (1 - smooth(...layer.pass, k));
export const depthCloudPass = (st, a) => 1 - smooth(...DEPTH.clouds.pass, depthFactor(st, a));
export const depthDeckAlpha = (st, a) => {
  const k = depthFactor(st, a), d = DEPTH.deck;
  return d.alpha * (1 + d.boost * smooth(...d.peak, k)) * depthVisibility(k, d);
};
export const depthBlastFade = st => 1 - smooth(...DEPTH.fade.blast, st.blastT) * (1 - (st.exploreK || 0));
export const depthSeaFade = st => smooth(...DEPTH.fade.sea, st.handoffT) * depthBlastFade(st);
export const depthFrameBox = (st, inner = false) => {
  const f = DEPTH.frame[inner ? 'inner' : 'outer'], a = toScreen(st, f.slice(0, 2)), b = toScreen(st, f.slice(2));
  return [a[0], a[1], b[0], b[1]];
};
export const depthFrameCovers = st => { const b = depthFrameBox(st); return b[0] <= 0 && b[1] <= 0 && b[2] >= VIEW.w && b[3] >= VIEW.h; };
export const novaRingRadius = st => lerp(NOVA.base.ringStart, Math.max(VIEW.w, VIEW.h) * NOVA.base.ringReach, 1 - (1 - st.blastT) ** 3);
export const NOVA_LIVE = { time: 0, flares: [], serial: 0 };
export const novaFlare = flare => clamp01((NOVA_LIVE.time - flare.at) / NOVA.flare.time);
export function novaPrune() { NOVA_LIVE.flares = NOVA_LIVE.flares.filter(f => f.at + NOVA.flare.time > NOVA_LIVE.time); }
export function novaPress() {
  novaPrune(); if (NOVA_LIVE.flares.length >= NOVA.flare.cap) return false;
  NOVA_LIVE.flares.push({ at: NOVA_LIVE.time, serial: ++NOVA_LIVE.serial }); return true;
}
export const novaShare = (share, cap) => Math.min(cap, NOVA_LIVE.flares.reduce((sum, f) => sum + Math.sin(Math.PI * novaFlare(f)) * share, 0));

const DP = { deep: null, air: null, sky: null, dc: null, ac: null, dpr: 1, rm: false, fine: false,
  look: [0, 0], clouds: [], birds: [], mist: [], deck: [], dust: [], waves: [], waveKey: '', sprite: null, spriteKey: '',
  lastDraw: -Infinity, wind: 0, light: null, beam: null, config: '', tuning: '', pending: false, force: true, mistVisible: false, cloudVisible: false, pointer: [0.5, 0.5] };
const depthCentres = [COAST_A, COAST_B].map(coast => coast.reduce((a, p) => [a[0] + p[0] / coast.length, a[1] + p[1] / coast.length], [0, 0]));
const depthRange = (range, u) => lerp(range[0], range[1], u);
const depthSamples = (list, n, seed) => { if (list.length >= n && list.seed === seed) return; const r = rnd(seed); list.length = 0; list.seed = seed; for (let i = 0; i < n; i++) list.push(Array.from({ length: 8 }, () => r())); };
const depthSvgGroup = () => { const el = document.createElementNS('http://www.w3.org/2000/svg', 'g'); el.style.opacity = 0; return el; };

export function depthBuild(deep, air, sky, rm) {
  Object.assign(DP, { deep, air, sky, rm, dc: deep.getContext('2d'), ac: air.getContext('2d') });
  DP.fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const media = window.matchMedia('(hover: hover) and (pointer: fine)');
  media.addEventListener('change', e => { DP.fine = e.matches; DP.force = true; });
  depthConfigure();
  DP.tuning = JSON.stringify(DEPTH);
}
function depthConfigure() {
  // Runs at build or in a configuration microtask, outside the animation callback.
  document.documentElement.style.setProperty('--depth-rule', DEPTH.review.rule + 'px'); document.documentElement.style.setProperty('--depth-gap', DEPTH.review.gap + 'px');
  const key = JSON.stringify([DEPTH.clouds.list.map(c => c[3]), DEPTH.drawings, DEPTH.field.sprite, DEPTH.field.spriteMid, DEPTH.field.spriteAlpha]);
  if (key !== DP.config) {
    DP.config = key;
    while (DP.clouds.length < DEPTH.clouds.list.length) { const el = depthSvgGroup(); DP.sky.insertBefore(el, DP.birds[0]?.el || null); DP.clouds.push({ el }); }
    DP.clouds.forEach((c, i) => {
      const row = DEPTH.clouds.list[i]; if (!row) return;
      const paths = DEPTH.drawings.clouds[row[3] - 1];
      if (!c.paths) { c.el.innerHTML = depthCloudDrawing(paths); c.paths = [...c.el.querySelectorAll('path')]; }
      else c.paths.forEach((path, j) => path.setAttribute('d', paths[j]));
    });
    if (!DP.birds.length) for (let i = 0; i < 2; i++) { const el = depthSvgGroup(); DP.sky.appendChild(el); DP.birds.push({ el }); }
    DP.birds.forEach(b => {
      const paths = DEPTH.drawings.raven;
      if (!b.wings) { b.el.innerHTML = depthRavenDrawing(paths); b.wings = [...b.el.querySelectorAll('.sky-wing')]; b.paths = [...b.el.querySelectorAll('path')]; }
      else [paths.wing, paths.wing, paths.tail, paths.body, paths.beak].forEach((d, i) => b.paths[i].setAttribute('d', d));
    });
    DP.force = true;
  }
  const f = DEPTH.field, spriteKey = JSON.stringify([f.sprite, f.spriteMid, f.spriteAlpha, C.paper]);
  if (spriteKey !== DP.spriteKey) {
    DP.spriteKey = spriteKey; DP.sprite = document.createElement('canvas'); DP.sprite.width = DP.sprite.height = f.sprite;
    const c = DP.sprite.getContext('2d'), r = f.sprite / 2, g = c.createRadialGradient(r, r, 0, r, r, r);
    g.addColorStop(0, C.paper); g.addColorStop(f.spriteMid, depthAlphaColour(C.paper, f.spriteAlpha)); g.addColorStop(1, depthAlphaColour(C.paper, 0));
    c.fillStyle = g; c.fillRect(0, 0, f.sprite, f.sprite); DP.force = true;
  }
}
const depthAlphaColour = (colour, alpha) => colour + Math.round(clamp01(alpha) * 255).toString(16).padStart(2, '0');
export function depthResize(w, h) {
  DP.dpr = Math.min(DEPTH.dpr, window.devicePixelRatio || 1);
  DP.deep.width = Math.round(w * DP.dpr); DP.deep.height = Math.round(h * DP.dpr);
  DP.air.width = w; DP.air.height = h;
  DP.sky.setAttribute('width', w); DP.sky.setAttribute('height', h); DP.sky.setAttribute('viewBox', `0 0 ${w} ${h}`);
  DP.force = true;
}
export function depthLook(dt, pointer) {
  const enabled = VIEW.depth && !DP.rm && !VIEW.phone && DP.fine;
  const target = enabled ? pointer.map(p => (p - 0.5) * 2 * DEPTH.look) : [0, 0];
  let changed = false;
  DP.look.forEach((v, i) => {
    let next = enabled ? v + (target[i] - v) * (1 - Math.exp(-dt / DEPTH.lookEase)) : 0;
    if (Math.abs(next - target[i]) < DEPTH.epsilon) next = target[i];
    changed ||= next !== v; DP.look[i] = next;
  });
  const pointerChanged = pointer.some((v, i) => v !== DP.pointer[i]); DP.pointer = pointer.slice();
  return { look: DP.look, changed, fine: enabled, pointerChanged };
}
export function depthInvalidate() { DP.force = true; }

// An additive hook: insert the beacon cut at the veil's existing compositing boundary.
// The beacon's beam: a third hole in the veil. b is null or { x, y, angle, half, reach, soft, steps } (map units, degrees).
export function depthBeam(b) {
  if (JSON.stringify(DP.beam) !== JSON.stringify(b)) DP.force = true;
  DP.beam = b;
}

function depthDeep(st, look) {
  const c = DP.dc, w = VIEW.w, h = VIEW.h, R = DEPTH.rings, O = DEPTH.outer;
  c.setTransform(DP.dpr, 0, 0, DP.dpr, 0, 0); c.clearRect(0, 0, w, h);
  if (R.on) {
    const b = depthFrameBox(st, true); c.save(); c.beginPath(); c.rect(b[0], b[1], b[2] - b[0], b[3] - b[1]); c.clip();
    c.strokeStyle = C[R.colour]; c.lineWidth = R.width;
    [COAST_A, COAST_B].forEach((coast, i) => R.scale.forEach((scale, j) => {
      c.globalAlpha = R.alpha[j]; c.setLineDash(j === R.scale.length - 1 ? R.dash : []); c.beginPath();
      coast.forEach((p, k) => { const ct = depthCentres[i], q = depthPoint(st, [ct[0] + (p[0] - ct[0]) * scale, ct[1] + (p[1] - ct[1]) * scale], R.a[j], look); if (!k) c.moveTo(q.x, q.y); else c.lineTo(q.x, q.y); });
      c.closePath(); c.stroke();
    })); c.restore();
  }
  if (!O.on) return;
  const key = JSON.stringify([O.cell, O.area, O.jitter, DEPTH.seed]);
  if (key !== DP.waveKey) {
    DP.waveKey = key; DP.waves = []; const r = rnd(DEPTH.seed), a = O.area;
    for (let y = a[1]; y < a[3]; y += O.cell[1]) for (let x = a[0]; x < a[2]; x += O.cell[0]) DP.waves.push([x + r() * O.cell[0] * O.jitter, y + r() * O.cell[1] * O.jitter, r()]);
  }
  c.save(); c.strokeStyle = C.paper; c.lineWidth = O.width; c.setLineDash([]);
  const f = DEPTH.frame.outer;
  for (const [x, y, chance] of DP.waves) {
    if (chance > O.fill || (x >= f[0] && x <= f[2] && y >= f[1] && y <= f[3])) continue;
    const g = toScreen(st, [x, y]), scale = st.cam.s, width = O.wave[2] * O.waveCount * scale;
    if (g[0] + width < 0 || g[0] > w || g[1] + Math.abs(O.wave[1]) * scale < 0 || g[1] - Math.abs(O.wave[1]) * scale > h) continue;
    const distance = Math.hypot(Math.max(f[0] - x, 0, x - f[2]), Math.max(f[1] - y, 0, y - f[3]));
    c.globalAlpha = lerp(O.alpha[0], O.alpha[1], clamp01(distance / O.fade)); c.beginPath(); c.moveTo(...g);
    for (let j = 0; j < O.waveCount; j++) c.quadraticCurveTo(g[0] + (O.wave[2] * j + O.wave[0]) * scale, g[1] + (j % 2 ? -O.wave[1] : O.wave[1]) * scale, g[0] + O.wave[2] * (j + 1) * scale, g[1]);
    c.stroke();
  }
  const b = depthFrameBox(st); c.beginPath(); c.rect(0, 0, w, h); c.rect(b[0], b[1], b[2] - b[0], b[3] - b[1]); c.clip('evenodd');
  c.globalAlpha = O.rays; c.beginPath(); const origin = toScreen(st, O.origin);
  for (let i = 0; i < O.n; i++) { const angle = i * Math.PI * 2 / O.n + O.angle, end = toScreen(st, [O.origin[0] + Math.cos(angle) * O.reach, O.origin[1] + Math.sin(angle) * O.reach]); c.moveTo(...origin); c.lineTo(...end); }
  c.stroke();
  const U = DEPTH.dust, show = U.on * smooth(...U.show, depthLift(st));
  if (show > 0) {
    depthSamples(DP.dust, Math.max(0, Math.floor(VIEW.phone ? U.nPhone : U.n)), DEPTH.seed + 2); c.fillStyle = C.paper;
    const vx = st.cam.ax + look[0], vy = st.cam.ay + look[1];
    for (const u of DP.dust) {
      const k = depthFactor(st, depthRange(U.a, u[2])), g = toScreen(st, [u[0] * U.tile[0], u[1] * U.tile[1]]);
      const dx = U.tile[0] * st.cam.s * k, dy = U.tile[1] * st.cam.s * k, r = depthRange(U.r, u[3]);
      c.globalAlpha = depthRange(U.alpha, u[4]) * show;
      for (let x = ((vx + (g[0] - vx) * k) % dx + dx) % dx; x < w; x += dx) for (let y = ((vy + (g[1] - vy) * k) % dy + dy) % dy; y < h; y += dy) c.fillRect(x - r, y - r, r * 2, r * 2);
    }
  }
  c.restore(); c.globalAlpha = 1;
}
const depthHole = (distance, radius, core) => radius > 0 ? 1 - clamp01((distance - core * radius) / (radius * (1 - core))) : 0;
// How much of the beam's light reaches a screen point: full at the tower, nothing at its reach, soft at each side.
const depthBeamAt = (m, x, y) => {
  if (!m || m.radius <= 0) return 0;
  const dx = x - m.p[0], dy = y - m.p[1], off = Math.abs((((Math.atan2(dy, dx) * 180 / Math.PI - m.angle) % 360) + 540) % 360 - 180);
  return (1 - clamp01(Math.hypot(dx, dy) / m.radius)) * clamp01((m.half - off) / m.soft);
};
export function lightAt(x, y) {
  const l = DP.light; if (!l) return 1;
  const a = depthHole(Math.hypot(x - l.trav[0], y - l.trav[1]), l.r, DEPTH.light.core);
  const b = l.pointer ? depthHole(Math.hypot(x - l.pointer[0], y - l.pointer[1]), l.pr, DEPTH.light.ptrCore) : 0;
  return 1 - l.v * (1 - DEPTH.light.amb) * (1 - Math.max(a, b, depthBeamAt(l.beam, x, y)));
}
function depthAir(st, look, pointer, fine) {
  const c = DP.ac, w = VIEW.w, h = VIEW.h, small = Math.min(w, h), L = DEPTH.light, M = DEPTH.mist, D = DEPTH.deck;
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, w, h);
  const trav = toScreen(st, st.trav || MAP.waypoints[0]), pt = fine ? [pointer[0] * w, pointer[1] * h] : null;
  const v = L.on ? smooth(0, 1, st.pushT) * (1 - L.card * st.cardOpen) * (1 - smooth(...L.rush, st.rushT)) * lerp(1, L.visit, st.focusK ?? (st.visiting ? 1 : 0)) : 0;
  const B = DP.beam, beam = B && v > 0 ? { p: toScreen(st, [B.x, B.y]), radius: B.reach * st.cam.s, angle: B.angle, half: B.half, soft: B.soft } : null;
  DP.light = { trav, pointer: pt, r: L.r * small, pr: L.ptrR * small, v, beam };
  if (v > 0) {
    c.globalAlpha = v * (VIEW.phone ? L.darkPhone : L.dark); c.fillStyle = C.ink; c.fillRect(0, 0, w, h); c.globalAlpha = 1;
    c.globalCompositeOperation = 'destination-out';
    for (const [p, radius, core] of [[trav, L.r * small, L.core], [pt, L.ptrR * small, L.ptrCore]]) {
      if (!p || radius <= 0) continue;
      const g = c.createRadialGradient(...p, radius * core, ...p, radius); g.addColorStop(0, C.paper); g.addColorStop(1, depthAlphaColour(C.paper, 0));
      c.fillStyle = g; c.beginPath(); c.arc(...p, radius, 0, Math.PI * 2); c.fill();
    }
    if (beam && beam.radius > 0) {
      const g = c.createRadialGradient(...beam.p, 0, ...beam.p, beam.radius); g.addColorStop(0, C.paper); g.addColorStop(1, depthAlphaColour(C.paper, 0)); c.fillStyle = g;
      for (let i = 0; i < B.steps; i++) {
        const from = B.angle - B.half + 2 * B.half * i / B.steps, to = from + 2 * B.half / B.steps;
        c.globalAlpha = clamp01((B.half - Math.abs((from + to) / 2 - B.angle)) / B.soft);
        c.beginPath(); c.moveTo(...beam.p); c.arc(...beam.p, beam.radius, from * Math.PI / 180, to * Math.PI / 180); c.closePath(); c.fill();
      }
      c.globalAlpha = 1;
    }
    c.globalCompositeOperation = 'source-over';
  }
  const field = DEPTH.field.area, width = field[2] - field[0]; DP.mistVisible = false;
  const drawField = (list, layer, deck) => {
    const n = Math.max(0, Math.floor(VIEW.phone ? layer.nPhone : layer.n)); depthSamples(list, n, DEPTH.seed + (deck ? 1 : 0));
    if (!layer.on) return;
    for (let i = 0; i < n; i++) {
      const u = list[i], a = depthRange(layer.a, u[2]);
      const start = lerp(field[0], field[2], u[0]), x = deck ? start : field[0] + ((start - field[0] + DP.wind * (0.5 + a)) % width + width) % width;
      const p = depthPoint(st, [x, lerp(field[1], field[3], u[1])], a, look), radius = depthRange(layer.r, u[3]) * p.s, rx = radius * depthRange(layer.stretch, u[4]);
      if (p.x + rx < 0 || p.x - rx > w || p.y + rx < 0 || p.y - rx > h) continue;
      let alpha = deck ? depthDeckAlpha(st, a) * (1 - (st.focusK || 0)) : depthRange(layer.alpha, u[6]) * depthVisibility(p.k, layer);
      if (!deck) {
        const wrap = DEPTH.field.wrapFade, fade = smooth(0, wrap, x - field[0]) * (1 - smooth(width - wrap, width, x - field[0]));
        alpha *= fade * lightAt(p.x, p.y) * st.dim * (M.thin + (1 - M.thin) * smooth(...M.near, Math.hypot(p.x - trav[0], p.y - trav[1]) / small));
      }
      if (alpha <= 0) continue;
      if (!deck) DP.mistVisible = true;
      c.save(); c.globalAlpha = alpha; c.translate(p.x, p.y); c.rotate((u[5] * 2 - 1) * M.turn); c.drawImage(DP.sprite, -rx, -radius, rx * 2, radius * 2); c.restore();
    }
  };
  drawField(DP.mist, M, false); drawField(DP.deck, D, true); c.globalAlpha = 1;
}
function depthSky(st, look, time) {
  const Cld = DEPTH.clouds, Rv = DEPTH.ravens, r = rnd(DEPTH.seed), fade = depthBlastFade(st);
  DP.cloudVisible = false;
  DP.clouds.forEach((c, i) => {
    const row = Cld.list[i], sway = depthRange(Cld.sway, r()), period = depthRange(Cld.period, r()), phase = r() * Math.PI * 2;
    if (!row) { c.el.style.opacity = 0; return; }
    const [x, y, size, drawing, flip, a] = row, p = depthPoint(st, [x + sway * Math.sin(Math.PI * 2 * time / period + phase), y], a, look);
    const alpha = Cld.on * smooth(...Cld.show, st.handoffT) * depthCloudPass(st, a) * fade;
    c.el.style.opacity = alpha;
    if (alpha > 0) DP.cloudVisible = true;
    if (alpha > 0) c.el.setAttribute('transform', `translate(${p.x} ${p.y}) scale(${flip * size * p.s} ${size * p.s})`);
  });
  const flight = Rv.on && st.kind === 'leg' && Rv.legs.includes(st.i) ? clamp01((st.t - Rv.from) / (Rv.to - Rv.from)) : 0;
  DP.birds.forEach((bird, i) => {
    const alpha = smooth(0, Rv.ramp, flight) * (1 - smooth(1 - Rv.ramp, 1, flight)) * depthSeaFade(st) * (1 - (st.focusK || 0));
    bird.el.style.opacity = alpha; if (!alpha) return;
    const A = MAP.waypoints[STOPS[st.i].w], B = MAP.waypoints[STOPS[st.i + 1].w], dx = B[0] - A[0], dy = B[1] - A[1], len = Math.hypot(dx, dy), d = [dx / len, dy / len], normal = [-d[1], d[0]];
    const start = [A[0] + normal[0] * Rv.side, A[1] + normal[1] * Rv.side], end = [B[0] - normal[0] * Rv.side, B[1] - normal[1] * Rv.side];
    const p = depthPoint(st, [lerp(start[0], end[0], flight) - i * Rv.gap * (d[0] - normal[0]), lerp(start[1], end[1], flight) - i * Rv.gap * (d[1] - normal[1])], Rv.a, look);
    const angle = Math.atan2(end[1] - start[1], end[0] - start[0]) * 180 / Math.PI + 90, wing = lerp(Rv.fold, 1, 0.5 + 0.5 * Math.sin(st.P * Rv.flap));
    bird.el.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${angle}) scale(${Rv.size * p.s})`);
    bird.wings.forEach((wingEl, j) => wingEl.setAttribute('transform', `scale(${j ? -wing : wing} 1)`));
  });
}
function depthMistEntering(st, look) {
  const m = DEPTH.mist, area = DEPTH.field.area, width = area[2] - area[0], n = VIEW.phone ? m.nPhone : m.n;
  return DP.mist.some((u, i) => {
    if (i >= n) return false;
    const a = depthRange(m.a, u[2]), x = area[0] + ((u[0] * width + DP.wind * (0.5 + a)) % width + width) % width;
    const p = depthPoint(st, [x, lerp(area[1], area[3], u[1])], a, look), r = depthRange(m.r, u[3]) * depthRange(m.stretch, u[4]) * p.s;
    return depthVisibility(p.k, m) > 0 && p.x + r >= 0 && p.x - r <= VIEW.w && p.y + r >= 0 && p.y - r <= VIEW.h;
  });
}
export function depthFrame(st, time, dt, pointer, aim, moved) {
  if (!DP.deep) return;
  DP.wind += dt * DEPTH.mist.wind;
  const tuning = JSON.stringify(DEPTH);
  if (tuning !== DP.tuning) {
    DP.tuning = tuning; DP.force = true;
    if (!DP.pending) { DP.pending = true; queueMicrotask(() => { depthConfigure(); DP.pending = false; DP.force = true; }); }
  }
  const on = !!VIEW.depth, active = on && !DP.rm, fade = depthSeaFade(st);
  DP.deep.style.opacity = on ? fade * st.dim : 0;
  DP.air.style.opacity = active ? fade : 0; DP.sky.style.opacity = active ? st.dim : 0;
  const force = DP.force; DP.force = false;
  if (on && fade > 0 && (force || moved || aim.changed)) depthDeep(st, aim.look);
  if (!active) return;
  const idle = time - DP.lastDraw >= 1 / DEPTH.idleFps;
  const mistDrifting = idle && DEPTH.mist.on && DEPTH.mist.wind !== 0 && (DP.mistVisible || depthMistEntering(st, aim.look));
  if (fade > 0 && (force || moved || aim.changed || aim.pointerChanged || mistDrifting)) depthAir(st, aim.look, pointer, aim.fine);
  if (force || moved || aim.changed || (idle && DP.cloudVisible)) depthSky(st, aim.look, time);
  if (idle) DP.lastDraw = time;
}
