// The X, its supernova and the footer that settles over the glow.
import { C, COPY, MAP, NOVA, NOVA_CANVAS, DEPTH, FOOT_NAME, EXPLORE, CAMERA, PHONE_LAYOUT, STEPS } from './data.mjs';
import { rnd, n1, mapDefs } from './art.mjs';
import { VIEW, smooth, lerp, easeIO, clamp01, novaBuild } from './trip.mjs';
import { JOURNEY } from './steps.mjs';
import { novaRingRadius, novaFlare, novaPress, novaPrune, novaShare, NOVA_LIVE } from './depth.mjs';
import { footnameBuild, footnameMeasure, footnameReveal, footnameFrame } from './footname.mjs';

const FT = { items: [], name: null, el: null, rule: null, rm: false, clock: 0, settled: false, hitState: '', rays: [], lobes: [], waves: [], streaks: [], config: '', nextFlare: null, lastFlare: null, canvas: null, ctx: null, dpr: 1, drawing: false, sprites: {}, rough: null, roughPending: null };
const upRight = '<svg class="ne" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 8.5L8.5 1.5M3 1.5H8.5V7"/></svg>';
const arrowR = '<svg class="arr" viewBox="0 0 14 10" aria-hidden="true"><path d="M1 5h11M8 1l4 4l-4 4"/></svg>';

const xStroke = rot => `<g class="fx-s" transform="rotate(${rot})"><path class="fx-red" d="M-12.7 0H12.7" stroke="${C.red}" stroke-width="3.6" stroke-linecap="round" fill="none" filter="url(#rough)"/></g>`;

export function footerBuildX(g, rm = false, canvas = null, hit = null) {
  FT.rm = rm; FT.x = g; FT.canvas = canvas; FT.ctx = !rm && canvas ? canvas.getContext('2d') : null; FT.hit = rm ? null : hit;
  FT.drawing = false; FT.hitState = ''; FT.config = ''; FT.rays = []; FT.lobes = []; FT.waves = []; FT.streaks = [];
  g.innerHTML = xStroke(45) + xStroke(-45);
  g.setAttribute('pointer-events', 'none');
  const r = rnd(43);
  for (let i = 0; i < 60; i++) { const a = r() * 6.283, d1 = .3 + r() * .5, d2 = d1 + .2 + r() * .6, c = Math.cos(a), sn = Math.sin(a); FT.streaks.push({ from: [+n1(c * d1 * 10), +n1(sn * d1 * 10)], to: [+n1(c * d2 * 10), +n1(sn * d2 * 10)], colour: r() < .3 ? C.red : C.paper, alpha: +n1(.3 + r() * .6), width: +n1(.6 + r()) }); }
  if (FT.hit) {
    const dig = () => {
      if (FT.hit.getAttribute('aria-disabled') === 'true') return;
      if (FT.settled) { novaPress(); return; }
      if (Math.abs(JOURNEY.P - JOURNEY.beats.find(b => b.id === 'x').P) < NOVA.base.hitTolerance) JOURNEY.next();
      else JOURNEY.go('x');
    };
    FT.hit.addEventListener('click', dig);
  }
  footerConfigure();
}

export function footerBuild(el, rm = false) {
  const f = COPY.footer; FT.el = el; FT.rm = rm;
  el.innerHTML = `<div class="ft-in">
<div class="ft-cta ft-r"><p class="ft-q">${f.cta}</p><button class="ft-talk" type="button">${f.talk}${arrowR}</button></div>
<div class="ft-sp"></div>
<p class="ft-name ft-r"><span>${f.name}</span></p>
<p class="ft-tag ft-r">${f.tagline}</p>
<div class="ft-rule" aria-hidden="true"></div>
<nav class="ft-links ft-r" aria-label="${f.label}"><span class="ft-big">${f.links.map(l => `<button type="button" class="ft-link">${l}${upRight}</button>`).join('')}</span><span class="ft-small">${f.small.split(' / ').map(l => `<button type="button" class="ft-link">${l}</button>`).join('<i>/</i>')}</span></nav></div>`;
  FT.items = [...el.querySelectorAll('.ft-r')]; FT.name = el.querySelector('.ft-name span'); FT.rule = el.querySelector('.ft-rule'); FT.inner = el.querySelector('.ft-in');
  footnameBuild(FT.name, FT.rm);
}
export function footerResize() {
  footerConfigure();
  const s = FT.name, weight = s.style.fontWeight; s.style.fontWeight = FOOT_NAME.weight[1]; s.style.fontSize = FOOT_NAME.measureSize + 'px';
  const avail = FT.name.parentElement.clientWidth, w = s.getBoundingClientRect().width;
  s.style.fontSize = (FOOT_NAME.measureSize * avail / w).toFixed(2) + 'px'; footnameMeasure({ c: 1, dx: 0, dy: 0 }); s.style.fontWeight = weight;
  footerPhoneMeasure();
  return FT.rule.getBoundingClientRect();
}
// The same boxes drive resize layout and the Node gate. They describe the settled footer.
export function footerPhoneLayout({ w, h, goBottom, headlineH, talkW, talkH, nameTop }) {
  const L = PHONE_LAYOUT, top = Math.max(h * L.ctaShare, goBottom + L.gap), headline = [L.edge, top, w - L.edge, top + headlineH];
  const talk = [L.edge, headline[3] + L.headlineGap, L.edge + talkW, headline[3] + L.headlineGap + talkH];
  const novaY = Math.max(CAMERA.footerXPhone[1] * h, talk[3] + L.gap + NOVA.flare.hit), x = CAMERA.footerXPhone[0] * w;
  const target = [x - NOVA.flare.hit, novaY - NOVA.flare.hit, x + NOVA.flare.hit, novaY + NOVA.flare.hit];
  return { top, headline, talk, novaY, target, spacer: target[3] + L.gap - talk[3], nameTop: Math.max(nameTop, target[3] + L.gap), fits: target[3] + L.gap <= nameTop };
}
function footerPhoneMeasure() {
  FT.inner.style.paddingTop = '';
  const spacer = FT.el.querySelector('.ft-sp'); spacer.style.minHeight = '';
  if (!VIEW.phone || FT.rm) return;
  const go = document.getElementById('go'), root = document.documentElement;
  if (!go) return;
  // Measure the end bar even when it is hidden or currently showing another journey beat.
  const hidden = go.hidden, end = go.classList.contains('go-end'), exploring = root.classList.contains('jm-explore'), focused = root.classList.contains('jm-focus');
  const next = go.querySelector('.go-t'), nextText = next.textContent;
  const children = [...go.querySelectorAll('button')].map(el => [el, el.hidden]);
  go.hidden = false; go.classList.add('go-end'); root.classList.remove('jm-explore'); root.classList.remove('jm-focus'); next.textContent = COPY.explore.button; children.forEach(([el]) => el.hidden = false);
  const goBottom = go.getBoundingClientRect().bottom;
  go.hidden = hidden; go.classList.toggle('go-end', end); root.classList.toggle('jm-explore', exploring); root.classList.toggle('jm-focus', focused); next.textContent = nextText; children.forEach(([el, value]) => el.hidden = value);
  const headline = FT.el.querySelector('.ft-q').getBoundingClientRect(), talk = FT.el.querySelector('.ft-talk').getBoundingClientRect(), name = FT.name.parentElement.getBoundingClientRect();
  const layout = footerPhoneLayout({ w: VIEW.w, h: VIEW.h, goBottom, headlineH: headline.height, talkW: talk.width, talkH: talk.height, nameTop: name.top });
  FT.inner.style.paddingTop = layout.top + 'px'; spacer.style.minHeight = layout.spacer + 'px'; VIEW.footerY = layout.novaY;
}
const footerStyle = (el, key, value) => { const text = String(value); if (el && el.style[key] !== text) el.style[key] = text; };
export function footerFrame(st) {
  if (FT.hit) {
    FT.settled = st.settleT >= 1;
    const available = (st.handoffT >= 1 && st.rushT === 0) || FT.settled, state = `${available}/${FT.settled}`;
    if (state !== FT.hitState) {
      FT.hitState = state; FT.hit.tabIndex = available ? 0 : -1; FT.hit.setAttribute('aria-disabled', String(!available));
      FT.hit.setAttribute('aria-label', FT.settled ? COPY.nova : COPY.steps.dig);
    }
    const s = st.exploreK ? st.sEnd : st.cam.s, radius = FT.settled ? NOVA.flare.hit * st.cam.s / s : NOVA.base.digHit * st.cam.s;
    footerStyle(FT.hit, 'width', (radius * 2).toFixed(2) + 'px'); footerStyle(FT.hit, 'height', (radius * 2).toFixed(2) + 'px');
    footerStyle(FT.hit, 'transform', `translate(${(MAP.x[0] * st.cam.s + st.cam.tx).toFixed(2)}px,${(MAP.x[1] * st.cam.s + st.cam.ty).toFixed(2)}px) translate(-50%,-50%)`);
  }
  // Progress owns the text's reveal. All X transforms and opacities have one writer, footerMotion.
  const b = NOVA.base;
  FT.items.forEach((it, j) => { if (it.classList.contains('ft-name')) { it.style.opacity = 1; it.style.transform = ''; return; } const o = smooth(b.textIn[0] + j * b.textGap, b.textIn[1] + j * b.textGap, st.settleT); it.style.opacity = o; it.style.transform = `translateY(${((1 - o) * b.textRise).toFixed(1)}px)`; });
  footerStyle(FT.inner, 'opacity', st.exploreFooter ?? 1);
  const exploring = !!st.exploring || (st.exploreK || 0) > 0; if (FT.exploring !== exploring) { FT.exploring = exploring; FT.el.inert = exploring; }
  footnameReveal(st);
  FT.el.style.visibility = st.settleT > b.textShow ? 'visible' : 'hidden';
}
const footerConfigKey = () => JSON.stringify([NOVA.seed, NOVA.rays.n, VIEW.phone ? NOVA.lobes.nPhone : NOVA.lobes.n, NOVA.waves.n]);
function footerConfigure() {
  if (FT.rm) return;
  const count = VIEW.phone ? NOVA.lobes.nPhone : NOVA.lobes.n, key = footerConfigKey();
  if (key === FT.config) return; FT.config = key;
  const seeds = n => Array.from({ length: n }, (_, i) => { const r = rnd(NOVA.seed + i); return { u: Array.from({ length: 7 }, () => r()) }; });
  FT.rays = seeds(NOVA.rays.n); FT.lobes = seeds(count); FT.waves = seeds(NOVA.waves.n);
}
const footerColour = (colour, alpha) => `rgba(${colour.slice(1).match(/../g).map(n => parseInt(n, 16)).join(',')},${alpha})`;
const footerHeatColour = heat => { const a = C.warm.slice(1).match(/../g), b = C.white.slice(1).match(/../g); return 'rgb(' + a.map((n,i) => Math.round(lerp(parseInt(n,16),parseInt(b[i],16),smooth(.1,.9,heat)))).join(',') + ')'; };
function footerGlowSprite(key) {
  if (FT.sprites[key]) return FT.sprites[key];
  const cv = document.createElement('canvas'), size = NOVA_CANVAS.glowSprite; cv.width = cv.height = size;
  const ctx = cv.getContext('2d'), r = size / 2, gradient = ctx.createRadialGradient(r, r, 0, r, r, r);
  const stops = key === 'red' ? [[0, C.red, .75], [.55, C.red, .22], [1, C.red, 0]] : key === 'orange' ? [[0, C.warm, .6], [1, C.warm, 0]] : [[0, C.paper, .85], [1, C.paper, 0]];
  stops.forEach(([at, colour, alpha]) => gradient.addColorStop(at, footerColour(colour, alpha)));
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, size, size); FT.sprites[key] = cv; return cv;
}
// Rasterise the map's actual filter in its original user space, then scale that picture with the stroke.
// Keep the old sprite until the replacement finishes. A missing image uses the plain round line.
function footerRough(scale) {
  const density = Math.ceil(scale * FT.dpr);
  if (FT.rough?.density >= density || FT.roughPending?.density >= density || FT.roughFailed >= density || typeof Image === 'undefined') return;
  const cv = document.createElement('canvas'); cv.width = 40 * density; cv.height = 16 * density;
  const pending = { cv, density }, img = new Image(); FT.roughPending = pending;
  img.onload = () => {
    if (FT.roughPending !== pending) return;
    cv.getContext('2d').drawImage(img, 0, 0); FT.rough = pending; FT.roughPending = null;
  };
  img.onerror = () => { if (FT.roughPending === pending) { FT.roughPending = null; FT.roughFailed = density; } };
  const filter = mapDefs().match(/<filter id="rough"[^]*?<\/filter>/)[0];
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${cv.width}" height="${cv.height}" viewBox="-20 -8 40 16"><defs>${filter}</defs><path d="M-12.7 0H12.7" stroke="${C.red}" stroke-width="3.6" stroke-linecap="round" fill="none" filter="url(#rough)"/></svg>`);
}
export function footerNovaResize(w, h) {
  if (!FT.canvas) return;
  FT.dpr = Math.min(NOVA_CANVAS.dpr, window.devicePixelRatio || 1);
  FT.canvas.width = Math.round(w * FT.dpr); FT.canvas.height = Math.round(h * FT.dpr);
  FT.roughFailed = 0;
  if (!FT.rm) footerRough(Math.max(VIEW.s0, VIEW.sT * EXPLORE.most) * NOVA.base.rushLen);
}
function footerGlow(ctx, key, x, y, rx, ry, alpha) {
  if (!(rx > 0 && ry > 0 && alpha > 0)) return;
  ctx.globalAlpha = alpha; ctx.drawImage(footerGlowSprite(key), x - rx, y - ry, rx * 2, ry * 2);
}
function footerLine(ctx, from, to, colour, width, alpha, cap = 'round') {
  if (!(alpha > 0)) return;
  ctx.globalAlpha = alpha; ctx.strokeStyle = colour; ctx.lineWidth = width; ctx.lineCap = cap;
  ctx.beginPath(); ctx.moveTo(...from); ctx.lineTo(...to); ctx.stroke();
}
function footerRing(ctx, radius, colour, width, alpha, angle = 0, dash = []) {
  if (!(radius > 0 && alpha > 0)) return;
  ctx.save(); ctx.rotate(angle * Math.PI / 180); ctx.globalAlpha = alpha; ctx.strokeStyle = colour; ctx.lineWidth = width; ctx.lineCap = 'butt'; ctx.setLineDash(dash);
  ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
}
// SVG group opacity composites overlapping children together. Reuse one scratch layer for that same operation.
function footerGroup(ctx, alpha, paint) {
  if (!(alpha > 0)) return;
  if (!FT.layer) { FT.layer = document.createElement('canvas'); FT.layerCtx = FT.layer.getContext('2d'); }
  const layer = FT.layer, c = FT.layerCtx;
  if (layer.width !== FT.canvas.width || layer.height !== FT.canvas.height) { layer.width = FT.canvas.width; layer.height = FT.canvas.height; }
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, layer.width, layer.height);
  c.setTransform(FT.dpr, 0, 0, FT.dpr, ...FT.centre); paint(c);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = alpha; ctx.drawImage(layer, 0, 0); ctx.restore();
}
export function footerMotion(time, dt, st, look, moved) {
  if (FT.rm) return;
  footnameFrame(time, dt, [-look[0] * DEPTH.foot.text, -look[1] * DEPTH.foot.text]);
  NOVA_LIVE.time += dt;
  novaPrune();
  if (st.blastT > 0) FT.clock += dt; else { FT.clock = 0; NOVA_LIVE.flares = []; }
  if (st.settleT >= 1 && NOVA.flare.auto[1] > 0) {
    if (FT.nextFlare === null || NOVA_LIVE.serial !== FT.lastFlare) { FT.lastFlare = NOVA_LIVE.serial; FT.nextFlare = NOVA_LIVE.time + lerp(...NOVA.flare.auto, rnd(NOVA.seed + NOVA_LIVE.serial)()); }
    else if (NOVA_LIVE.time >= FT.nextFlare && NOVA_LIVE.flares.length < NOVA.flare.cap - EXPLORE.autoReserve) { novaPress(); FT.nextFlare = null; }
  } else FT.nextFlare = null;
  footerConfigure();
  const showing = st.rushT > 0 || st.blastT > 0 || st.settleT > 0 || st.exploreK > 0;
  if (showing !== FT.drawing) { FT.drawing = showing; footerStyle(FT.x, 'visibility', showing ? 'hidden' : 'visible'); }
  footerStyle(FT.canvas, 'opacity', st.dim);
  const ctx = FT.ctx;
  if (!showing) {
    if (FT.painted && ctx) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, FT.canvas.width, FT.canvas.height); FT.painted = false; }
    return;
  }
  if (!ctx) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, FT.canvas.width, FT.canvas.height); FT.painted = true;
  FT.centre = [(MAP.x[0] * st.cam.s + st.cam.tx) * FT.dpr, (MAP.x[1] * st.cam.s + st.cam.ty) * FT.dpr];
  ctx.setTransform(FT.dpr, 0, 0, FT.dpr, ...FT.centre);
  const s = st.exploreK ? st.sEnd : st.cam.s, rT = st.rushT, bT = st.blastT, sT = st.settleT, u = px => px / s, B = NOVA.base, z = st.cam.s;
  const big = Math.max(VIEW.w, VIEW.h), calm = lerp(1, EXPLORE.calmScale, st.exploreK || 0), calmAlpha = lerp(1, EXPLORE.calmAlpha, st.exploreK || 0);
  const clock = FT.clock, strength = smooth(...NOVA.motionIn, bT), flare = novaShare(NOVA.flare.core, NOVA.flare.coreMax) * strength;
  const wave = period => Math.sin(Math.PI * 2 * clock / period);
  const pulse = 1 + strength * (NOVA.pulse[1] * wave(NOVA.pulse[0]) + NOVA.pulse[3] * wave(NOVA.pulse[2])) + flare;
  // the two strokes: thin, whiten from the centre, stretch into spikes, then cool to a small star
  const out = b => 1 - Math.pow(1 - b, 3);
  const build = novaBuild(rT), held = novaBuild(1), blastJoin = out(clamp01(bT / B.spikePeak));
  let len = build.len, thin = build.thin;
  if (bT > 0) len = bT < B.spikePeak ? lerp(held.len, B.peakLen, out(bT / B.spikePeak)) : lerp(B.peakLen, B.endLen, easeIO((bT - B.spikePeak) / (1 - B.spikePeak)));
  if (sT > 0) len = lerp(B.endLen, u(B.spikeEnd) / B.spikeLength, easeIO(sT));
  if (bT > 0) thin = lerp(held.thin, B.thin[2], blastJoin);
  if (sT > 0) thin = lerp(B.thin[2], B.thin[3], sT);
  const heat = build.heat;
  // The veil is below every nova mark and below the separate stars canvas.
  const veil = build.veil * (1 - smooth(0, NOVA.build.veilOut / STEPS.pace.blast, bT));
  if (veil > 0) {
    const radius = build.hole * Math.min(VIEW.w, VIEW.h), gradient = ctx.createRadialGradient(0, 0, radius * .45, 0, 0, radius);
    gradient.addColorStop(0, footerColour(C.ink, 0)); gradient.addColorStop(1, C.ink);
    ctx.globalAlpha = veil; ctx.fillStyle = gradient; ctx.fillRect(-FT.centre[0] / FT.dpr, -FT.centre[1] / FT.dpr, VIEW.w, VIEW.h);
  }
  if (bT === 0) ctx.translate(...build.jitter);
  // glow
  let rg = build.glow, rgo = build.glowAlpha;
  if (bT > 0) { rg = bT < B.glowPeak ? lerp(B.redGlow[0], big * B.redGlow[1], out(bT / B.glowPeak)) : lerp(big * B.redGlow[1], big * B.redGlow[2], easeIO((bT - B.glowPeak) / (1 - B.glowPeak))); rgo = 1; }
  if (sT > 0) rg = lerp(big * B.redGlow[2], big * B.redGlow[3], sT);
  rg *= 1 + strength * NOVA.glow[1] * wave(NOVA.glow[0]);
  footerGlow(ctx, 'red', 0, 0, u(rg) * calm * z, u(rg) * B.glowAspect * calm * z, rgo * calmAlpha);
  const og = bT > 0 ? lerp(...B.orangeGlow, out(bT)) : build.glow * .6;
  footerGlow(ctx, 'orange', 0, 0, u(og) * calm * z, u(og) * calm * z, (bT > 0 ? B.orangeAlpha : heat * .35) * calmAlpha);
  const core = bT > 0 ? lerp(B.core[0], B.core[1], bT) * (sT > 0 ? lerp(1, B.core[2], sT) : 1) : build.core;
  // the blast: ring and streaks
  const ringR = novaRingRadius(st), ringO = bT > 0 ? (1 - smooth(...B.ringFade, bT)) : 0;
  const stS = lerp(B.streak[0], big * B.streak[1], out(bT));
  // settled: two faint rings
  const ro = smooth(...B.shellIn, sT);
  // Paint in the former SVG order. Widths below stay in screen pixels.
  footerGroup(ctx, strength * calmAlpha, ctx => {
  ctx.save(); ctx.rotate(clock * NOVA.rays.turn);
  FT.rays.forEach((ray, i) => {
    if (i >= NOVA.rays.n) return;
    const a = i / NOVA.rays.n * Math.PI * 2, start = core * NOVA.rays.start, len = lerp(...NOVA.rays.len, ray.u[0]) * core;
    const alpha = lerp(...NOVA.rays.alpha, ray.u[1]) * (1 - NOVA.rays.breathe * (.5 + .5 * Math.sin(clock * Math.PI * 2 / lerp(...NOVA.rays.period, ray.u[3]) + ray.u[2] * Math.PI * 2)));
    const from = [u(Math.cos(a) * start) * calm * z, u(Math.sin(a) * start) * calm * z], to = [u(Math.cos(a) * len) * calm * z, u(Math.sin(a) * len) * calm * z];
    const gradient = ctx.createLinearGradient(...from, ...to); gradient.addColorStop(0, footerColour(C.paper, 0)); gradient.addColorStop(NOVA.rays.peak, footerColour(C.paper, 1)); gradient.addColorStop(1, footerColour(C.paper, 0));
    footerLine(ctx, from, to, gradient, NOVA.rays.width, alpha, 'butt');
  });
  ctx.restore();
  });
  footerGroup(ctx, strength * calmAlpha, ctx => {
  FT.lobes.forEach((lobe, i) => {
    const L = NOVA.lobes, a = lobe.u[0] * Math.PI * 2 + clock * lerp(...L.speed, lobe.u[1]) * (i % 2 ? -1 : 1), orbit = lerp(...L.orbit, lobe.u[2]), r = lerp(...L.r, lobe.u[3]) * (1 + L.breathe * Math.sin(clock * lerp(...L.speed, lobe.u[4]) + lobe.u[5] * Math.PI * 2));
    footerGlow(ctx, i % 2 ? 'orange' : 'red', u(Math.cos(a) * orbit + look[0] * DEPTH.foot.lobes) * calm * z, u(Math.sin(a) * orbit + look[1] * DEPTH.foot.lobes) * calm * z, u(r) * calm * z, u(r) * calm * z, i < (VIEW.phone ? L.nPhone : L.n) ? lerp(...L.alpha, lobe.u[6]) : 0);
  });
  });
  footerGroup(ctx, strength, ctx => {
  FT.waves.forEach((circle, i) => {
    if (i >= NOVA.waves.n) return;
    const age = clock / NOVA.waves.every - i, q = ((age / NOVA.waves.n) % 1 + 1) % 1;
    footerRing(ctx, u(lerp(core, big * NOVA.waves.reach, q)) * z, C.paper, NOVA.waves.width, age >= 0 ? NOVA.waves.alpha * (1 - q) : 0);
  });
  });
  for (let i = 0; i < NOVA.flare.cap; i++) { const live = NOVA_LIVE.flares.find(f => f.serial % NOVA.flare.cap === i); if (!live) continue; const fq = novaFlare(live); footerRing(ctx, u(lerp(core, big * NOVA.flare.reach, out(fq))) * z, C.paper, NOVA.waves.width, NOVA.flare.alpha * (1 - fq) * strength); }
  const streakO = bT > 0 ? smooth(...B.streakIn, bT) * (1 - smooth(...B.streakOut, bT)) : 0;
  footerGroup(ctx, streakO, ctx => FT.streaks.forEach(line => footerLine(ctx, line.from.map(v => v * u(stS) * z), line.to.map(v => v * u(stS) * z), line.colour, line.width, line.alpha)));
  footerRing(ctx, u(ringR) * z, C.red, 8, ringO * B.ringAlpha[1]); footerRing(ctx, u(ringR) * z, C.paper, 2, ringO * B.ringAlpha[0]);
  [0, 1].forEach(i => footerRing(ctx, u((VIEW.phone ? B.shellPhone : B.shellR)[i]) * z, C.paper, i ? .6 : .8, B.shellAlpha[i] * ro, clock * NOVA.shells[i], NOVA.shellDash));
  footerGlow(ctx, 'core', 0, 0, u(core * pulse) * calm * z, u(core * pulse) * calm * z, build.coreAlpha * calmAlpha);
  B.angles.forEach((angle, i) => {
    const stretch = len * (1 + strength * NOVA.spike[1] * Math.sin(Math.PI * 2 * clock / NOVA.spike[0] + i * NOVA.spike[2])) * pulse;
    const red = bT > 0 ? 0 : 1, white = heat;
    if (red > 0) footerRough(Math.max(z * stretch, z * thin));
    ctx.save(); ctx.rotate(angle * Math.PI / 180); ctx.scale(stretch * z, thin * z);
    if (red > 0) {
      if (FT.rough) { ctx.globalAlpha = red; ctx.drawImage(FT.rough.cv, -20, -8, 40, 16); }
      else footerLine(ctx, [-12.7, 0], [12.7, 0], C.red, 3.6, red);
    }
    if (white > 0) {
      const gradient = ctx.createLinearGradient(-12.7, 0, 12.7, 0); gradient.addColorStop(0, footerColour(C.red, 0)); gradient.addColorStop(.5, footerHeatColour(heat)); gradient.addColorStop(1, footerColour(C.red, 0));
      ctx.globalAlpha = white; ctx.fillStyle = gradient; ctx.beginPath(); ctx.moveTo(-12.7, 0); ctx.lineTo(0, -1.7); ctx.lineTo(12.7, 0); ctx.lineTo(0, 1.7); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  });
  footerStyle(FT.inner, 'translate', `${-look[0] * DEPTH.foot.text}px ${-look[1] * DEPTH.foot.text}px`);
}
