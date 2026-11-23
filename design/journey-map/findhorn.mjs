// Sound is represented by travelling rings and timed calls to the existing hear() kit.
import { FIND_PLAY, FIND_COPY, FINDS } from './data.mjs';
import { clamp01, lerp } from './trip.mjs';
import { starPath } from './art.mjs';
import { JOURNEY, stepsFocus } from './steps.mjs';
import { findPointer, FD, FIND_BY, ease, attr, fEsc, found, opened, press, showPop, closePop, attend, findSlot, findPlace, findView, findSvg } from './findkit.mjs';

export function findHorn(svg) {
  const f = FIND_BY.horn, el = svg.querySelector('#f-horn'), horn = el.querySelector('.hn-horn');
  const o = { id: f.id, el, stage: 'rest', kept: false, up: 0, v: 0, hold: false, sounded: 0, ts: -Infinity, heard: [], hearTs: -Infinity, glints: [] };
  const ringsGroup = findSvg('g', { id: 'hn-rings', 'pointer-events': 'none' }); svg.querySelector('#finds').appendChild(ringsGroup);
  const rings = Array.from({ length: FIND_PLAY.horn.rings }, () => { const c = findSvg('circle', { class: 'hn-ring', r: 1, opacity: 0 }); ringsGroup.appendChild(c); return c; });
  const glints = FINDS.map(d => { const g = findSvg('g'), star = findSvg('path', { class: 'pf', d: starPath(0, 0, FIND_PLAY.horn.glint[0]), opacity: 0 }); star.style.stroke = 'none'; g.appendChild(star); ringsGroup.appendChild(g); return { id: d.id, g, star, ts: -Infinity }; });
  const deliver = id => {
    const object = FD.list[id]; object?.hear?.();
    if (!FD.found.has(id) && !FD.rm) { const glint = glints.find(g => g.id === id), d = FIND_BY[id], p = d.mark || findPlace(id); attr(glint.g, 'transform', `translate(${p[0]} ${p[1]})`); glint.ts = FD.now; o.glints.push(id); }
    o.heard.push(id);
  };
  const sound = () => {
    if (o.stage === 'sounding' || o.stage === 'echo') return;
    const H = FIND_PLAY.horn; opened(o); o.stage = 'sounding'; o.ts = FD.now; o.sounded++; o.hold = false; o.heard = []; o.glints = []; o.up = 1;
    o.wide = stepsFocus(o.id, FIND_PLAY.focus.wide); if (FD.popOwner === o) closePop();
    if (FD.rm) { FINDS.forEach(d => deliver(d.id)); o.up = o.v = 0; o.stage = 'rest'; if (FD.popOwner === o) closePop(); }
  };
  const raise = () => {
    if (o.stage === 'sounding' || o.stage === 'echo') return;
    if (o.up) { sound(); return; }
    o.up = 1; o.stage = 'raised'; o.raiseTs = FD.now; opened(o); found(o.id);
    showPop(o, [f.x + FIND_PLAY.horn.anchor[0], f.y + FIND_PLAY.horn.anchor[1]], `<p class="pop-t pop-big">${fEsc(FIND_COPY.horn[0])}</p>${findSlot(FIND_COPY.horn[1])}`);
  };
  findPointer(el, e => { el.setPointerCapture(e.pointerId); raise(); o.hold = o.stage === 'raised'; o.holdTs = FD.now; el._dragged = true; }, { tap: raise, cancel: () => o.hold = false });
  el.addEventListener('pointerup', () => o.hold = false); el.addEventListener('pointercancel', () => o.hold = false);
  press(el, raise);
  o.onPopClose = () => { if (o.stage === 'raised') { o.up = 0; o.stage = 'rest'; o.hold = false; } };
  o.onEscape = () => { o.hold = false; if (o.stage === 'raised') { o.up = 0; o.stage = 'rest'; } };
  o.hear = () => { if (!FD.rm) { o.hearTs = FD.now; o.hearing = true; } };
  o.tick = (t, dt) => {
    const H = FIND_PLAY.horn;
    o.hearing = !FD.rm && t - o.hearTs < H.raise;
    if (o.hold && t - o.holdTs >= H.hold) { o.hold = false; queueMicrotask(sound); }
    o.v = FD.rm ? o.up : o.v + Math.sign(o.up - o.v) * Math.min(Math.abs(o.up - o.v), dt / H.raise);
    const p = attend(o, H.near), tip = o.awake && p ? H.tip * Math.max(-1, Math.min(1, (p[0] - f.x) / H.near)) : 0, q = ease(o.v), age = t - o.ts;
    const swell = !FD.rm && o.stage === 'sounding' && age < H.swell[2] ? (H.swell[0] - 1) * (1 - Math.cos(Math.PI * 2 * H.swell[1] * age)) / 2 : 0;
    const hear = FD.rm ? 0 : H.tip * Math.sin(Math.PI * clamp01((t - o.hearTs) / H.raise));
    attr(horn, 'transform', `translate(${H.lift[0] * q} ${H.lift[1] * q}) rotate(${H.turn * q + tip * (1 - q) + hear} ${H.pivot[0]} ${H.pivot[1]}) scale(${1 + swell})`);
    rings.forEach((r, i) => { const a = age - i * H.gap, radius = H.radius + H.speed * Math.max(0, Math.min(H.life, a)); attr(r, 'transform', `translate(${f.x + H.bell[0]} ${f.y + H.bell[1]}) scale(${radius})`); attr(r, 'opacity', !FD.rm && a >= 0 && a < H.life && o.stage === 'sounding' ? H.alpha * (1 - a / H.life) ** H.power : 0); });
    if (['sounding', 'echo'].includes(o.stage)) {
      FINDS.forEach(d => { if (o.heard.includes(d.id)) return; const p = findPlace(d.id); if (age >= Math.hypot(p[0] - f.x - H.bell[0], p[1] - f.y - H.bell[1]) / H.speed) { o.heard.push(d.id); queueMicrotask(() => { o.heard = o.heard.filter(id => id !== d.id); deliver(d.id); }); } });
      if (o.stage === 'sounding' && age >= H.life + (H.rings - 1) * H.gap) {
        o.stage = 'echo'; o.up = 0;
        queueMicrotask(() => { if (FD.popOwner === o) closePop(); if (o.wide && JOURNEY.focus === o.id) stepsFocus(o.id, findView(o.id)); });
      }
      if (o.stage === 'echo' && o.heard.length === FINDS.length && glints.every(g => t - g.ts >= H.glint[1])) o.stage = 'rest';
    }
    glints.forEach(g => { const k = FD.rm ? 1 : clamp01((t - g.ts) / H.glint[1]), pulse = Math.sin(Math.PI * k); attr(g.star, 'opacity', pulse); attr(g.star, 'transform', `rotate(${H.glint[2] * k}) scale(${pulse})`); });
    o.playing = o.hold || ['sounding', 'echo'].includes(o.stage) || o.v !== o.up;
  };
  return o;
}
