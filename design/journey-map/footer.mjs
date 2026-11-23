// The X, its supernova and the footer that settles over the glow.
import { C, COPY, NOVA, DEPTH } from './data.mjs';
import { rnd, n1 } from './art.mjs';
import { VIEW, smooth, lerp, easeIO, clamp01 } from './trip.mjs';
import { JOURNEY } from './steps.mjs';
import { novaRingRadius, novaFlare, NOVA_LIVE } from './depth.mjs';

const FT = { g: {}, items: [], name: null, el: null, rule: null, rm: false, clock: 0, settled: false, hitState: '', rays: [], lobes: [], waves: [], config: '', pending: false };
const upRight = '<svg class="ne" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 8.5L8.5 1.5M3 1.5H8.5V7"/></svg>';
const arrowR = '<svg class="arr" viewBox="0 0 14 10" aria-hidden="true"><path d="M1 5h11M8 1l4 4l-4 4"/></svg>';

const xStroke = rot => `<g class="fx-s" transform="rotate(${rot})"><path class="fx-red" d="M-12.7 0H12.7" stroke="${C.red}" stroke-width="3.6" stroke-linecap="round" fill="none" filter="url(#rough)"/><path class="fx-white" d="M-12.7 0L0 -1.7L12.7 0L0 1.7Z" fill="url(#spike)" opacity="0"/></g>`;

export function footerBuildX(g, rm = false) {
  FT.rm = rm;
  const r = rnd(43); let streaks = '';
  for (let i = 0; i < 60; i++) { const a = r() * 6.283, d1 = .3 + r() * .5, d2 = d1 + .2 + r() * .6, c = Math.cos(a), sn = Math.sin(a); streaks += `<path d="M${n1(c * d1 * 10)} ${n1(sn * d1 * 10)}L${n1(c * d2 * 10)} ${n1(sn * d2 * 10)}" stroke="${r() < .3 ? C.red : C.paper}" stroke-opacity="${n1(.3 + r() * .6)}" stroke-width="${n1(.6 + r())}" vector-effect="non-scaling-stroke" stroke-linecap="round"/>`; }
  g.innerHTML = `<circle class="fx-rg" r="1" fill="url(#rglow)" opacity="0"/><circle class="fx-og" r="1" fill="url(#oglow)" opacity="0"/>`
    + `<g class="fx-rays" opacity="0"></g><g class="fx-lobes" opacity="0"></g><g class="fx-waves" opacity="0"></g><circle class="fx-flare" r="1" fill="none" stroke="${C.paper}" vector-effect="non-scaling-stroke" opacity="0"/>`
    + `<g class="fx-streaks" opacity="0">${streaks}</g>`
    + `<circle class="fx-ringr" r="1" fill="none" stroke="${C.red}" stroke-width="8" vector-effect="non-scaling-stroke" opacity="0"/><circle class="fx-ring" r="1" fill="none" stroke="${C.paper}" stroke-width="2" vector-effect="non-scaling-stroke" opacity="0"/>`
    + `<circle class="fx-r1" r="1" fill="none" stroke="${C.paper}" stroke-width=".8" vector-effect="non-scaling-stroke" opacity="0"/><circle class="fx-r2" r="1" fill="none" stroke="${C.paper}" stroke-width=".6" vector-effect="non-scaling-stroke" opacity="0"/>`
    + `<circle class="fx-core" r="1" fill="url(#glow)" opacity="0"/>` + xStroke(45) + xStroke(-45)
    + (rm ? '' : `<circle class="fx-hit hit" r="1" role="button" tabindex="-1" aria-label="${COPY.steps.dig}" aria-disabled="true"/>`);
  ['fx-rg', 'fx-og', 'fx-rays', 'fx-lobes', 'fx-waves', 'fx-flare', 'fx-streaks', 'fx-ringr', 'fx-ring', 'fx-r1', 'fx-r2', 'fx-core'].forEach(k => FT.g[k] = g.querySelector('.' + k));
  FT.g.s = [...g.querySelectorAll('.fx-s')]; FT.g.red = [...g.querySelectorAll('.fx-red')]; FT.g.white = [...g.querySelectorAll('.fx-white')];
  FT.hit = g.querySelector('.fx-hit');
  if (FT.hit) {
    const dig = () => {
      if (FT.hit.getAttribute('aria-disabled') === 'true') return;
      if (FT.settled) { NOVA_LIVE.flareAt = NOVA_LIVE.time; NOVA_LIVE.serial++; return; }
      if (JOURNEY.mode === 'scroll') JOURNEY.go('end');
      else if (Math.abs(JOURNEY.P - JOURNEY.beats.find(b => b.id === 'x').P) < NOVA.base.hitTolerance) JOURNEY.next();
      else JOURNEY.go('x');
    };
    FT.hit.addEventListener('click', dig);
    FT.hit.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dig(); } });
  }
  footerConfigure();
}

export function footerBuild(el) {
  const f = COPY.footer; FT.el = el;
  el.innerHTML = `<div class="ft-in">
<div class="ft-cta ft-r"><p class="ft-q">${f.cta}</p><button class="ft-talk" type="button">${f.talk}${arrowR}</button></div>
<div class="ft-sp"></div>
<p class="ft-name ft-r"><span>${f.name}</span></p>
<p class="ft-tag ft-r">${f.tagline}</p>
<div class="ft-rule" aria-hidden="true"></div>
<nav class="ft-links ft-r" aria-label="${f.label}"><span class="ft-big">${f.links.map(l => `<button type="button" class="ft-link">${l}${upRight}</button>`).join('')}</span><span class="ft-small">${f.small.split(' / ').map(l => `<button type="button" class="ft-link">${l}</button>`).join('<i>/</i>')}</span></nav></div>`;
  FT.items = [...el.querySelectorAll('.ft-r')]; FT.name = el.querySelector('.ft-name span'); FT.rule = el.querySelector('.ft-rule'); FT.inner = el.querySelector('.ft-in');
}
export function footerResize() {
  footerConfigure();
  const s = FT.name; s.style.fontSize = '100px';
  const avail = FT.name.parentElement.clientWidth, w = s.getBoundingClientRect().width;
  s.style.fontSize = (100 * avail / w).toFixed(2) + 'px';
  return FT.rule.getBoundingClientRect();
}
const T = (el, x) => el.setAttribute('transform', x);
export function footerFrame(st) {
  if (FT.hit) {
    FT.settled = st.settleT >= 1;
    const available = (st.handoffT >= 1 && st.rushT === 0) || FT.settled, state = `${available}/${FT.settled}`;
    if (state !== FT.hitState) {
      FT.hitState = state; FT.hit.tabIndex = available ? 0 : -1; FT.hit.setAttribute('aria-disabled', String(!available));
      FT.hit.setAttribute('aria-label', FT.settled ? COPY.nova : COPY.steps.dig);
    }
  }
  // Progress owns the text's reveal. All X transforms and opacities have one writer, footerMotion.
  const b = NOVA.base;
  FT.items.forEach((it, j) => { const o = smooth(b.textIn[0] + j * b.textGap, b.textIn[1] + j * b.textGap, st.settleT); it.style.opacity = o; it.style.transform = `translateY(${((1 - o) * b.textRise).toFixed(1)}px)`; });
  FT.el.style.visibility = st.settleT > b.textShow ? 'visible' : 'hidden';
}
const footerConfigKey = () => JSON.stringify([NOVA.rays.n, VIEW.phone ? NOVA.lobes.nPhone : NOVA.lobes.n, NOVA.waves.n, NOVA.rays.width, NOVA.waves.width, NOVA.shellDash]);
function footerConfigure() {
  if (FT.rm) return;
  const count = VIEW.phone ? NOVA.lobes.nPhone : NOVA.lobes.n, key = footerConfigKey();
  if (key === FT.config) return; FT.config = key;
  const add = (list, n, parent, type, cls) => {
    while (list.length < n) {
      const el = document.createElementNS('http://www.w3.org/2000/svg', type), i = list.length, r = rnd(NOVA.seed + i);
      el.setAttribute('class', cls); el.setAttribute('vector-effect', 'non-scaling-stroke');
      el.setAttribute('opacity', 0);
      if (type === 'circle') el.setAttribute('r', 1); else el.setAttribute('d', 'M0 0H1');
      el.setAttribute('fill', cls === 'fx-lobe' ? `url(#${i % 2 ? 'oglow' : 'rglow'})` : 'none');
      if (cls !== 'fx-lobe') el.setAttribute('stroke', C.paper);
      parent.appendChild(el); list.push({ el, u: Array.from({ length: 7 }, () => r()) });
    }
  };
  add(FT.rays, NOVA.rays.n, FT.g['fx-rays'], 'path', 'fx-ray');
  add(FT.lobes, count, FT.g['fx-lobes'], 'circle', 'fx-lobe');
  add(FT.waves, NOVA.waves.n, FT.g['fx-waves'], 'circle', 'fx-wave');
  FT.rays.forEach(ray => ray.el.setAttribute('stroke-width', NOVA.rays.width));
  FT.waves.forEach(wave => wave.el.setAttribute('stroke-width', NOVA.waves.width)); FT.g['fx-flare'].setAttribute('stroke-width', NOVA.waves.width);
  ['fx-r1', 'fx-r2'].forEach(k => FT.g[k].setAttribute('stroke-dasharray', NOVA.shellDash.join(' ')));
}
export function footerMotion(time, dt, st, look, moved) {
  if (FT.rm) return;
  NOVA_LIVE.time += dt;
  if (st.blastT > 0) FT.clock += dt; else { FT.clock = 0; NOVA_LIVE.flareAt = null; }
  if (footerConfigKey() !== FT.config && !FT.pending) { FT.pending = true; queueMicrotask(() => { footerConfigure(); FT.pending = false; }); }
  if (!moved && st.blastT <= 0) return;
  const s = st.cam.s, rT = st.rushT, bT = st.blastT, sT = st.settleT, G = FT.g, u = px => px / s, B = NOVA.base;
  const big = Math.max(VIEW.w, VIEW.h);
  const clock = FT.clock, strength = smooth(...NOVA.motionIn, bT), flare = Math.sin(Math.PI * novaFlare()) * strength;
  const wave = period => Math.sin(Math.PI * 2 * clock / period);
  const pulse = 1 + strength * (NOVA.pulse[1] * wave(NOVA.pulse[0]) + NOVA.pulse[3] * wave(NOVA.pulse[2])) + NOVA.flare.core * flare;
  // the two strokes: thin, whiten from the centre, stretch into spikes, then cool to a small star
  const out = b => 1 - Math.pow(1 - b, 3);
  let len = lerp(1, B.rushLen, easeIO(rT)), thin = lerp(B.thin[0], B.thin[1], rT);
  if (bT > 0) len = bT < B.spikePeak ? lerp(B.rushLen, B.peakLen, out(bT / B.spikePeak)) : lerp(B.peakLen, B.endLen, easeIO((bT - B.spikePeak) / (1 - B.spikePeak)));
  if (sT > 0) len = lerp(B.endLen, u(B.spikeEnd) / B.spikeLength, easeIO(sT));
  if (bT > 0) thin = lerp(B.thin[1], B.thin[2], out(clamp01(bT / B.spikePeak)));
  if (sT > 0) thin = lerp(B.thin[2], B.thin[3], sT);
  G.s.forEach((g, i) => T(g, `rotate(${B.angles[i]}) scale(${len * (1 + strength * NOVA.spike[1] * wave(NOVA.spike[0])) * pulse} ${thin})`));
  const heat = smooth(...B.heat, rT);
  G.white.forEach(w => w.setAttribute('opacity', heat.toFixed(3)));
  G.red.forEach(w => w.setAttribute('opacity', (1 - smooth(...B.redOut, rT)).toFixed(3)));
  // glow
  let rg = lerp(0, B.redGlow[0], rT), rgo = B.rushGlowAlpha * rT;
  if (bT > 0) { rg = bT < B.glowPeak ? lerp(B.redGlow[0], big * B.redGlow[1], out(bT / B.glowPeak)) : lerp(big * B.redGlow[1], big * B.redGlow[2], easeIO((bT - B.glowPeak) / (1 - B.glowPeak))); rgo = 1; }
  if (sT > 0) rg = lerp(big * B.redGlow[2], big * B.redGlow[3], sT);
  rg *= 1 + strength * NOVA.glow[1] * wave(NOVA.glow[0]);
  T(G['fx-rg'], `scale(${u(rg)} ${u(rg) * B.glowAspect})`); G['fx-rg'].setAttribute('opacity', rgo);
  const og = bT > 0 ? lerp(...B.orangeGlow, out(bT)) : lerp(0, B.orangeGlow[0], rT);
  T(G['fx-og'], `scale(${u(og)})`); G['fx-og'].setAttribute('opacity', bT > 0 ? B.orangeAlpha : B.rushGlowAlpha * rT);
  const core = bT > 0 ? lerp(B.core[0], B.core[1], bT) * (sT > 0 ? lerp(1, B.core[2], sT) : 1) : lerp(0, B.core[3], heat);
  T(G['fx-core'], `scale(${u(core * pulse)})`); G['fx-core'].setAttribute('opacity', heat);
  // the blast: ring and streaks
  const ringR = novaRingRadius(st), ringO = bT > 0 ? (1 - smooth(...B.ringFade, bT)) : 0;
  T(G['fx-ring'], `scale(${u(ringR)})`); G['fx-ring'].setAttribute('opacity', ringO * B.ringAlpha[0]);
  T(G['fx-ringr'], `scale(${u(ringR)})`); G['fx-ringr'].setAttribute('opacity', ringO * B.ringAlpha[1]);
  const stS = lerp(B.streak[0], big * B.streak[1], out(bT));
  T(G['fx-streaks'], `scale(${u(stS)})`); G['fx-streaks'].setAttribute('opacity', bT > 0 ? smooth(...B.streakIn, bT) * (1 - smooth(...B.streakOut, bT)) : 0);
  // settled: two faint rings
  const ro = smooth(...B.shellIn, sT);
  ['fx-r1', 'fx-r2'].forEach((key, i) => { T(G[key], `rotate(${clock * NOVA.shells[i]}) scale(${u((VIEW.phone ? B.shellPhone : B.shellR)[i])})`); G[key].setAttribute('opacity', B.shellAlpha[i] * ro); });
  G['fx-rays'].setAttribute('opacity', strength); T(G['fx-rays'], `rotate(${clock * NOVA.rays.turn * 180 / Math.PI})`);
  FT.rays.forEach((ray, i) => {
    if (i >= NOVA.rays.n) { ray.el.setAttribute('opacity', 0); return; }
    const a = i / NOVA.rays.n * Math.PI * 2, start = core * NOVA.rays.start, len = lerp(...NOVA.rays.len, ray.u[0]) * core;
    T(ray.el, `translate(${u(Math.cos(a) * start)} ${u(Math.sin(a) * start)}) rotate(${a * 180 / Math.PI}) scale(${u(len - start)} 1)`);
    ray.el.setAttribute('opacity', i < NOVA.rays.n ? lerp(...NOVA.rays.alpha, ray.u[1]) * (1 - NOVA.rays.breathe * (.5 + .5 * Math.sin(clock * Math.PI * 2 / lerp(...NOVA.rays.period, ray.u[3]) + ray.u[2] * Math.PI * 2))) : 0);
  });
  G['fx-lobes'].setAttribute('opacity', strength);
  FT.lobes.forEach((lobe, i) => {
    const L = NOVA.lobes, a = lobe.u[0] * Math.PI * 2 + clock * lerp(...L.speed, lobe.u[1]) * (i % 2 ? -1 : 1), orbit = lerp(...L.orbit, lobe.u[2]), r = lerp(...L.r, lobe.u[3]) * (1 + L.breathe * Math.sin(clock * lerp(...L.speed, lobe.u[4]) + lobe.u[5] * Math.PI * 2));
    T(lobe.el, `translate(${u(Math.cos(a) * orbit + look[0] * DEPTH.foot.lobes)} ${u(Math.sin(a) * orbit + look[1] * DEPTH.foot.lobes)}) scale(${u(r)})`);
    lobe.el.setAttribute('opacity', i < (VIEW.phone ? L.nPhone : L.n) ? lerp(...L.alpha, lobe.u[6]) : 0);
  });
  G['fx-waves'].setAttribute('opacity', strength);
  FT.waves.forEach((circle, i) => {
    if (i >= NOVA.waves.n) { circle.el.setAttribute('opacity', 0); return; }
    const age = clock / NOVA.waves.every - i, q = ((age / NOVA.waves.n) % 1 + 1) % 1;
    T(circle.el, `scale(${u(lerp(core, big * NOVA.waves.reach, q))})`);
    circle.el.setAttribute('opacity', i < NOVA.waves.n && age >= 0 ? NOVA.waves.alpha * (1 - q) : 0);
  });
  const fq = novaFlare(); T(G['fx-flare'], `scale(${u(lerp(core, big * NOVA.flare.reach, out(fq)))})`); G['fx-flare'].setAttribute('opacity', NOVA_LIVE.flareAt !== null ? NOVA.flare.alpha * (1 - fq) * strength : 0);
  if (FT.hit) T(FT.hit, `scale(${FT.settled ? u(NOVA.flare.hit) : B.digHit})`);
  FT.inner.style.translate = `${-look[0] * DEPTH.foot.text}px ${-look[1] * DEPTH.foot.text}px`;
}
