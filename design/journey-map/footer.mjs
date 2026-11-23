// The X, its supernova and the footer that settles over the glow.
import { C, COPY } from './data.mjs';
import { rnd, n1 } from './art.mjs';
import { VIEW, smooth, lerp, easeIO, clamp01 } from './trip.mjs';

const FT = { g: {}, items: [], name: null, el: null, rule: null };
const upRight = '<svg class="ne" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 8.5L8.5 1.5M3 1.5H8.5V7"/></svg>';
const arrowR = '<svg class="arr" viewBox="0 0 14 10" aria-hidden="true"><path d="M1 5h11M8 1l4 4l-4 4"/></svg>';

const xStroke = rot => `<g class="fx-s" transform="rotate(${rot})"><path class="fx-red" d="M-12.7 0H12.7" stroke="${C.red}" stroke-width="3.6" stroke-linecap="round" fill="none" filter="url(#rough)"/><path class="fx-white" d="M-12.7 0L0 -1.7L12.7 0L0 1.7Z" fill="url(#spike)" opacity="0"/></g>`;

export function footerBuildX(g) {
  const r = rnd(43); let streaks = '';
  for (let i = 0; i < 60; i++) { const a = r() * 6.283, d1 = .3 + r() * .5, d2 = d1 + .2 + r() * .6, c = Math.cos(a), sn = Math.sin(a); streaks += `<path d="M${n1(c * d1 * 10)} ${n1(sn * d1 * 10)}L${n1(c * d2 * 10)} ${n1(sn * d2 * 10)}" stroke="${r() < .3 ? C.red : C.paper}" stroke-opacity="${n1(.3 + r() * .6)}" stroke-width="${n1(.6 + r())}" vector-effect="non-scaling-stroke" stroke-linecap="round"/>`; }
  g.innerHTML = `<circle class="fx-rg" r="1" fill="url(#rglow)" opacity="0"/><circle class="fx-og" r="1" fill="url(#oglow)" opacity="0"/>`
    + `<g class="fx-streaks" opacity="0">${streaks}</g>`
    + `<circle class="fx-ringr" r="1" fill="none" stroke="${C.red}" stroke-width="8" vector-effect="non-scaling-stroke" opacity="0"/><circle class="fx-ring" r="1" fill="none" stroke="${C.paper}" stroke-width="2" vector-effect="non-scaling-stroke" opacity="0"/>`
    + `<circle class="fx-r1" r="1" fill="none" stroke="${C.paper}" stroke-width=".8" vector-effect="non-scaling-stroke" opacity="0"/><circle class="fx-r2" r="1" fill="none" stroke="${C.paper}" stroke-width=".6" vector-effect="non-scaling-stroke" opacity="0"/>`
    + `<circle class="fx-core" r="1" fill="url(#glow)" opacity="0"/>` + xStroke(45) + xStroke(-45);
  ['fx-rg', 'fx-og', 'fx-streaks', 'fx-ringr', 'fx-ring', 'fx-r1', 'fx-r2', 'fx-core'].forEach(k => FT.g[k] = g.querySelector('.' + k));
  FT.g.s = [...g.querySelectorAll('.fx-s')]; FT.g.red = [...g.querySelectorAll('.fx-red')]; FT.g.white = [...g.querySelectorAll('.fx-white')];
}

export function footerBuild(el) {
  const f = COPY.footer; FT.el = el;
  el.innerHTML = `<div class="ft-in">
<div class="ft-cta ft-r"><p class="ft-q">${f.cta}</p><button class="ft-talk" type="button">${f.talk}${arrowR}</button></div>
<div class="ft-sp"></div>
<p class="ft-name ft-r"><span>${f.name}</span></p>
<p class="ft-tag ft-r">${f.tagline}</p>
<div class="ft-rule" aria-hidden="true"></div>
<nav class="ft-links ft-r" aria-label="Footer"><span class="ft-big">${f.links.map(l => `<button type="button" class="ft-link">${l}${upRight}</button>`).join('')}</span><span class="ft-small">${f.small.split(' / ').map(l => `<button type="button" class="ft-link">${l}</button>`).join('<i>/</i>')}</span></nav></div>`;
  FT.items = [...el.querySelectorAll('.ft-r')]; FT.name = el.querySelector('.ft-name span'); FT.rule = el.querySelector('.ft-rule');
}
export function footerResize() {
  const s = FT.name; s.style.fontSize = '100px';
  const avail = FT.name.parentElement.clientWidth, w = s.getBoundingClientRect().width;
  s.style.fontSize = (100 * avail / w).toFixed(2) + 'px';
  return FT.rule.getBoundingClientRect();
}
const T = (el, x) => el.setAttribute('transform', x);
export function footerFrame(st) {
  const s = st.cam.s, rT = st.rushT, bT = st.blastT, sT = st.settleT, G = FT.g, u = px => px / s;
  const big = Math.max(VIEW.w, VIEW.h);
  // the two strokes: thin, whiten from the centre, stretch into spikes, then cool to a small star
  const out = b => 1 - Math.pow(1 - b, 3);
  let len = lerp(1, 2.4, easeIO(rT)), thin = lerp(1, .55, rT);
  if (bT > 0) len = bT < .3 ? lerp(2.4, 10, out(bT / .3)) : lerp(10, 5, easeIO((bT - .3) / .7));
  if (sT > 0) len = lerp(5, u(58) / 12.7, easeIO(sT));
  if (bT > 0) thin = lerp(.55, .8, out(clamp01(bT / .3)));
  if (sT > 0) thin = lerp(.8, .5, sT);
  G.s.forEach((g, i) => T(g, `rotate(${i ? -45 : 45}) scale(${len.toFixed(3)} ${thin.toFixed(3)})`));
  const heat = smooth(.05, .7, rT);
  G.white.forEach(w => w.setAttribute('opacity', heat.toFixed(3)));
  G.red.forEach(w => w.setAttribute('opacity', (1 - smooth(.2, .9, rT)).toFixed(3)));
  // glow
  let rg = lerp(0, 220, rT), rgo = .6 * rT;
  if (bT > 0) { rg = bT < .4 ? lerp(220, big * 1.1, out(bT / .4)) : lerp(big * 1.1, big * .62, easeIO((bT - .4) / .6)); rgo = 1; }
  if (sT > 0) rg = lerp(big * .62, big * .58, sT);
  T(G['fx-rg'], `scale(${u(rg).toFixed(2)} ${(u(rg) * .82).toFixed(2)})`); G['fx-rg'].setAttribute('opacity', rgo.toFixed(3));
  const og = bT > 0 ? lerp(120, 300, out(bT)) : lerp(0, 120, rT);
  T(G['fx-og'], `scale(${u(og).toFixed(2)})`); G['fx-og'].setAttribute('opacity', (bT > 0 ? .9 : .6 * rT).toFixed(3));
  const core = bT > 0 ? lerp(90, 60, bT) * (sT > 0 ? lerp(1, .5, sT) : 1) : lerp(0, 70, heat);
  T(G['fx-core'], `scale(${u(core).toFixed(2)})`); G['fx-core'].setAttribute('opacity', (heat).toFixed(3));
  // the blast: ring and streaks
  const ringR = lerp(30, big * .75, out(bT)), ringO = bT > 0 ? (1 - smooth(.2, .9, bT)) : 0;
  T(G['fx-ring'], `scale(${u(ringR).toFixed(2)})`); G['fx-ring'].setAttribute('opacity', (ringO * .9).toFixed(3));
  T(G['fx-ringr'], `scale(${u(ringR).toFixed(2)})`); G['fx-ringr'].setAttribute('opacity', (ringO * .35).toFixed(3));
  const stS = lerp(20, big * .09, out(bT));
  T(G['fx-streaks'], `scale(${u(stS).toFixed(3)})`); G['fx-streaks'].setAttribute('opacity', (bT > 0 ? smooth(0, .06, bT) * (1 - smooth(.25, .7, bT)) : 0).toFixed(3));
  // settled: two faint rings
  const ro = smooth(.2, .8, sT);
  T(G['fx-r1'], `scale(${u(VIEW.phone ? 120 : 200).toFixed(2)})`); G['fx-r1'].setAttribute('opacity', (.3 * ro).toFixed(3));
  T(G['fx-r2'], `scale(${u(VIEW.phone ? 190 : 330).toFixed(2)})`); G['fx-r2'].setAttribute('opacity', (.14 * ro).toFixed(3));
  // footer text rises in order
  FT.items.forEach((it, j) => { const o = smooth(.4 + j * .1, .62 + j * .1, sT); it.style.opacity = o; it.style.transform = `translateY(${((1 - o) * 24).toFixed(1)}px)`; });
  FT.el.style.visibility = sT > .3 ? 'visible' : 'hidden';
}
