// Part B plays retained for its later run; only the shared camera/popup/count kit changes.
import { C, FIND_COPY, FIND_TIMING } from './data.mjs';
import { clamp01 } from './trip.mjs';
import { FD, FIND_BY, press, found, opened, showPop, closePop, toMap, fEsc, ease, attr } from './findkit.mjs';
export function find_tafl(svg) {
  const f = FIND_BY.tafl, el = svg.querySelector('#f-tafl'), pc = el.querySelector('.tf-piece'), o = { id: 'tafl', pos: 0, v: 0 };
  press(el, () => { found('tafl'); opened(o); o.pos = o.pos ? 0 : 1; showPop(o, [f.x + 7, f.y - 2], `<p class="pop-t">${fEsc(FIND_COPY.tafl)}</p>`); });
  o.undo = () => { o.pos = 0; if (FD.popOwner === o) closePop(); };
  o.tick = (t, dt) => { o.v = FD.rm ? o.pos : o.v + Math.sign(o.pos - o.v) * Math.min(Math.abs(o.pos - o.v), dt / FIND_TIMING.slide); attr(pc, 'transform', `translate(0 ${(-3 * ease(o.v)).toFixed(2)})`); };
  return o;
}
export function find_mist(svg) {
  const el = svg.querySelector('#f-mist'), wipes = svg.querySelector('#mistWipes'), o = { id: 'mist', lastW: null };
  const wipe = (m, r) => { if (o.lastW && Math.hypot(m[0] - o.lastW[0], m[1] - o.lastW[1]) < r * .4) return; o.lastW = m; const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c.setAttribute('cx', m[0].toFixed(1)); c.setAttribute('cy', m[1].toFixed(1)); c.setAttribute('r', r); c.setAttribute('fill', C.black); wipes.appendChild(c); found('mist'); opened(o); };
  el.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') wipe(toMap([e.clientX, e.clientY]), 9); });
  el.addEventListener('click', e => wipe(toMap([e.clientX, e.clientY]), 16));
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); for (let i = 0; i < 9; i++) { o.lastW = null; wipe([112 + i * 11, 432 + (i % 2) * 10], 14); } } });
  o.undo = () => { wipes.innerHTML = ''; o.lastW = null; };
  return o;
}
export function find_horn(svg) {
  const f = FIND_BY.horn, el = svg.querySelector('#f-horn'), hn = el.querySelector('.hn-horn'), o = { id: 'horn', up: 0, v: 0, ts: 0 };
  press(el, () => { found('horn'); opened(o); o.up = 1; o.ts = FD.now; showPop(o, [f.x, f.y - 22], `<p class="pop-t pop-big">${fEsc(FIND_COPY.horn[0])}</p><p class="pop-t pop-late">${fEsc(FIND_COPY.horn[1])}</p>`); });
  o.onPopClose = () => { o.up = 0; }; o.undo = () => { o.up = 0; if (FD.popOwner === o) closePop(); };
  o.tick = (t, dt) => { o.v = FD.rm ? o.up : o.v + Math.sign(o.up - o.v) * Math.min(Math.abs(o.up - o.v), dt / .35); const q = ease(o.v); attr(hn, 'transform', `translate(${(3 * q).toFixed(2)} ${(-7 * q).toFixed(2)}) rotate(${(-30 * q).toFixed(1)} -8 -4)`); };
  return o;
}
export function find_well(svg) {
  const f = FIND_BY.well, el = svg.querySelector('#f-well'), rips = [...el.querySelectorAll('.wl-rip ellipse')], o = { id: 'well', ts: -9 };
  press(el, () => { found('well'); o.ts = FD.now; const l = FD.last; FD.last = null; if (l && l.undo) l.undo(); });
  o.tick = t => { const e = t - o.ts; rips.forEach((r, j) => { const q = clamp01((e - j * .18) / FIND_TIMING.ripple); attr(r, 'transform', `scale(${(1.25 - q * 1.1).toFixed(3)})`); attr(r, 'opacity', FD.rm ? 0 : (q > 0 && q < 1 ? .9 * Math.sin(Math.PI * q) : 0).toFixed(2)); }); };
  return o;
}
export function find_longship(svg) {
  const el = svg.querySelector('#f-longship'), ship = el.querySelector('.ls-ship'), o = { id: 'longship' };
  press(el, () => { found('longship'); opened(o); const tr = ship.getAttribute('transform').match(/translate\(([-\d.]+) ([-\d.]+)\)/); showPop(o, [+tr[1], +tr[2] - 24], `<p class="pop-t">${fEsc(FIND_COPY.longship)}</p>`); });
  o.undo = () => { if (FD.popOwner === o) closePop(); };
  return o;
}

