// Part A: persistent beacon reading and a rub/read/flip sheet.
import { C, COPY, FIND_COPY, FIND_PLAY, FIND_TIMING } from './data.mjs';
import { VIEW, clamp01, lerp } from './trip.mjs';
import { rubbingSvg, rubbingRunes } from './art.mjs';
import { depthBeam } from './depth.mjs';
import { FD, FIND_BY, D, ease, out3, fEsc, attr, toMap, found, opened, press, closeSheet, attend, findBits, findSvg, findSheet, findSlot, findAngleDelta } from './findkit.mjs';

export function findBeacon(svg) {
  const f = FIND_BY.beacon, el = svg.querySelector('#f-beacon'), beam = el.querySelector('.bc-beam'), flame = el.querySelector('.bc-flame'), glow = el.querySelector('.bc-glow');
  const notes = [...svg.querySelectorAll('.bc-note')].map((g, i) => ({ g, inner: g.querySelector('.bc-note-in'), en: g.querySelector('.bc-en'), d: FIND_COPY.beaconNotes[i], time: 0, read: false, v: 0, ev: 0, flash: -Infinity }));
  const o = { id: f.id, el, stage: 'idle', head: FIND_PLAY.beacon.baseAngle, manualTs: -Infinity, fire: 0, read: notes.map(() => false), kept: false, drag: false, ember: 0, litTs: -Infinity, hearTs: -Infinity };
  const origin = () => [f.x + FIND_PLAY.beacon.origin[0] * FIND_PLAY.beacon.scale, f.y + FIND_PLAY.beacon.origin[1] * FIND_PLAY.beacon.scale];
  const aimAt = e => { const p = toMap([e.clientX, e.clientY]), O = origin(); o.head = Math.atan2(p[1] - O[1], p[0] - O[0]) * FIND_PLAY.kit.deg / Math.PI; o.snap = null; o.manualTs = FD.now; found(o.id); opened(o); };
  const read = (n, i) => {
    if (n.read) return; const B = FIND_PLAY.beacon; n.read = true; n.flash = FD.now; o.read[i] = true; o.fire++; o.kept = true;
    findBits('spark', n.d.x, n.d.y, B.sparkN, FIND_PLAY.bits.sparks);
    if (o.fire === notes.length) { o.litTs = FD.now; findBits('spark', ...origin(), B.burstN, FIND_PLAY.bits.sparks); }
  };
  const snapNext = () => {
    const i = notes.findIndex(n => !n.read), n = notes[i >= 0 ? i : 0], O = origin(), angle = Math.atan2(n.d.y - O[1], n.d.x - O[0]) * FIND_PLAY.kit.deg / Math.PI;
    o.snap = { from: o.head, to: o.head + findAngleDelta(o.head, angle), ts: FD.now };
    o.manualTs = FD.now; found(o.id); opened(o);
    if (FD.rm && i >= 0) { o.head = angle; read(n, i); o.snap = null; }
  };
  el.addEventListener('pointerdown', e => { o.drag = true; el.setPointerCapture(e.pointerId); aimAt(e); el._dragged = true; });
  el.addEventListener('pointermove', e => { if (o.drag) aimAt(e); });
  el.addEventListener('pointerup', () => o.drag = false); el.addEventListener('pointercancel', () => o.drag = false);
  press(el, e => { if (e.type === 'keydown' || !e.detail) snapNext(); else aimAt(e); });
  el.addEventListener('keydown', e => { if (!['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(e.key)) return; e.preventDefault(); o.head += FIND_PLAY.beacon.arrow * (['ArrowLeft', 'ArrowUp'].includes(e.key) ? -1 : 1); o.snap = null; o.manualTs = FD.now; found(o.id); opened(o); });
  o.undo = () => { o.manualTs = -Infinity; o.drag = false; }; o.hear = () => o.hearTs = FD.now;
  o.tick = (t, dt) => {
    const B = FIND_PLAY.beacon, manual = o.drag || t - o.manualTs < B.manual, lit = o.fire === notes.length;
    if (o.snap) { const q = FD.rm ? 1 : ease((t - o.snap.ts) / B.snap); o.head = lerp(o.snap.from, o.snap.to, q); if (q === 1) o.snap = null; }
    else if (!manual && !FD.rm) o.head = lit ? o.head + B.turn * dt : B.baseAngle + B.sweep * Math.sin(t * FIND_TIMING.beamSweep);
    const reach = B.baseReach * B.scale * (lit && !manual ? B.reach : 1), half = FIND_TIMING.beamCone / 2, O = origin();
    attr(beam, 'transform', `translate(${B.origin[0]} ${B.origin[1]}) rotate(${o.head - FIND_PLAY.kit.deg}) scale(${lit && !manual ? B.reach : 1})`); attr(beam, 'opacity', manual ? 1 : B.idle);
    notes.forEach((n, i) => {
      const dx = n.d.x - O[0], dy = n.d.y - O[1], angle = Math.atan2(dy, dx) * FIND_PLAY.kit.deg / Math.PI, diff = Math.abs(((angle - o.head + FIND_PLAY.kit.turn * 1.5) % FIND_PLAY.kit.turn) - FIND_PLAY.kit.deg), inside = diff < half && Math.hypot(dx, dy) < reach;
      if (inside && !o.snap) n.time += dt;
      if (!n.read && n.time >= B.read) read(n, i);
      n.v = FD.rm ? n.read || inside ? 1 : 0 : lerp(n.v, inside ? 1 : n.read ? B.rest : 0, Math.min(1, dt * B.noteEase));
      n.ev = FD.rm ? n.read || inside ? 1 : 0 : lerp(n.ev, n.read || inside && n.time >= FIND_TIMING.noteDelay ? 1 : 0, Math.min(1, dt * B.englishEase));
      attr(n.g, 'opacity', n.v); attr(n.en, 'opacity', n.ev);
      const flash = FD.rm ? 0 : Math.sin(Math.PI * clamp01((t - n.flash) / B.flash)); attr(n.inner, 'transform', `scale(${1 + (B.noteScale - 1) * flash})`);
    });
    const F = B.flicker, foot = B.flameFoot, burst = FD.rm ? 0 : Math.sin(Math.PI * clamp01((t - o.litTs) / B.leap[1]));
    const hearAge = t - o.hearTs, hear = FD.rm ? 1 : hearAge < B.hear[1] ? lerp(B.hear[0], 1, clamp01(hearAge / B.hear[1])) : 1 + (B.hear[2] - 1) * Math.sin(Math.PI * clamp01((hearAge - B.hear[1]) / B.hear[3]));
    const size = lerp(B.flame[o.fire], B.leap[0], burst) * hear, sx = FD.rm ? size : size * (1 + F[0] * Math.sin(F[1] * t) + F[2] * Math.sin(F[3] * t)), sy = FD.rm ? size : size * (1 + F[4] * Math.sin(F[5] * t));
    attr(flame, 'transform', `translate(${foot[0]} ${foot[1]}) scale(${sx} ${sy}) translate(${-foot[0]} ${-foot[1]})`); attr(glow, 'opacity', B.glowAlpha * o.fire);
    if (o.onScreen && !FD.rm) { o.ember += o.fire * B.embers * dt; const n = Math.floor(o.ember); o.ember -= n; if (n) findBits('spark', ...O, n, FIND_PLAY.bits.sparks); }
    o.stage = lit ? 'lit' : manual ? 'aiming' : 'idle';
    depthBeam(!FD.rm && o.onScreen && VIEW.depth && FD.st.pushT > 0 && FD.st.rushT === 0 ? { x: O[0], y: O[1], angle: o.head, half, reach, soft: B.soft, steps: B.wedgeSteps } : null);
  };
  return o;
}
export const beaconLit = () => FD.list.beacon?.fire === FIND_COPY.beaconNotes.length;

export function findRune(svg) {
  const f = FIND_BY.runestone, el = svg.querySelector('#f-runestone'), trace = el.querySelector('.rs-trace');
  const o = { id: f.id, el, stage: 'rest', kept: false, read: false, rubbed: [], rubs: 0, ts: -Infinity, dashTs: -Infinity, stamped: false, flipped: false };
  const dash = red => {
    const R = FIND_PLAY.rune; trace.classList.toggle('red', red); trace.style.stroke = red ? '' : C.paper; trace.style.opacity = red ? 1 : 0; trace.style.strokeDasharray = red ? 'none' : R.dash.join(' ');
    trace.getAnimations().forEach(a => a.cancel());
    if (red) trace.style.strokeDasharray = R.dash[1] + ' ' + R.dash[1];
    if (!FD.rm) trace.animate(red ? [{ strokeDashoffset: R.dash[1], opacity: 1 }, { strokeDashoffset: 0, opacity: 1 }] : [{ strokeDashoffset: 0, opacity: 0 }, { strokeDashoffset: -R.dash[1] / 2, opacity: 1 }, { strokeDashoffset: -R.dash[1], opacity: 0 }], { duration: (red ? R.carving : R.dashTime) * 1000, fill: red ? 'forwards' : 'none' });
  };
  const autoStart = () => { if (o.read) return; o.autoTs = FD.now; o.autoLast = null; };
  const rub = (x, y) => {
    if (o.read || o.stage !== 'sheet') return;
    const R = FIND_PLAY.rune, c = findSvg('circle', { cx: x, cy: y, r: R.r, fill: 'url(#rub-soft)' }); o.circles.appendChild(c); o.rubs++;
    const [x0, y0, x1, y1] = R.cells;
    o.cells.forEach((p, i) => { if (Math.hypot(p[0] - x, p[1] - y) <= R.cellR) o.rubbed[i] = true; });
    if (o.rubbed.filter(Boolean).length / o.cells.length >= R.done) complete();
  };
  const complete = () => { if (o.read) return; o.read = o.kept = true; o.readTs = FD.now; o.autoTs = null; o.fill = FD.sheet.querySelector('.rub-fill'); el.classList.add('rune-kept'); };
  const flip = () => {
    if (!o.read) return;
    o.flipped = !o.flipped; o.pin.classList.toggle('flip', o.flipped);
    if (o.flipped && !o.stamped) { o.stampTs = FD.now; o.stamped = true; }
  };
  const sheet = () => {
    const R = FIND_PLAY.rune, P = FIND_COPY.poster;
    const shown = findSheet(o, 'poster rubbing-sheet', `<div class="pz"><div class="pz-in"><div class="pz-front rubbing-front">${rubbingSvg()}</div><div class="pz-back poster-back"><span class="pz-pin"></span><span class="pz-pin r"></span><b class="pz-h">${fEsc(P.head)}</b><div class="pz-pic"><i></i><s></s></div><b class="pz-who">${fEsc(P.who)}</b><p>${fEsc(P.line1)}<br>${fEsc(P.line2)}</p><b class="pz-rw">${fEsc(P.reward)}</b><span class="pz-stamp">${fEsc(P.stamp)}</span><div class="poster-slot">${findSlot(P.foot)}</div><span class="pz-fold"></span></div></div></div><div class="pz-ctl"><button type="button" class="rub-do">${fEsc(FIND_COPY.rubDo)}</button><button type="button" class="pz-flip" hidden>${fEsc(COPY.flip)}</button><button type="button" class="pz-x" hidden>${fEsc(COPY.close)}</button></div>`, [f.x, f.y + R.anchor]);
    if (!shown) { o.stage = 'rest'; return; }
    o.pz = FD.sheet.querySelector('.pz'); o.pin = FD.sheet.querySelector('.pz-in'); o.rubbing = FD.sheet.querySelector('.rubbing'); o.circles = FD.sheet.querySelector('.rub-circles'); o.fill = FD.sheet.querySelector('.rub-fill'); o.letters = [...FD.sheet.querySelectorAll('.rub-letter')]; o.stamp = FD.sheet.querySelector('.pz-stamp');
    o.flipped = false; o.controls = false; o.stampTs = o.stamped ? -Infinity : Infinity; o.stage = 'sheet'; o.ts = FD.now; o.autoTs = null; o.lastRub = null; o.tilt = [0, 0];
    const bounds = R.cells; o.cells = [];
    for (let j = 0; j < R.grid[1]; j++) for (let i = 0; i < R.grid[0]; i++) o.cells.push([lerp(bounds[0], bounds[2], (i + 0.5) / R.grid[0]), lerp(bounds[1], bounds[3], (j + 0.5) / R.grid[1])]);
    if (!o.read) o.rubbed = o.cells.map(() => false); else { o.readTs = FD.now - R.fill - o.letters.length * R.letter[0] - R.letter[1]; attr(o.fill, 'opacity', 1); }
    const local = e => {
      const box = o.rubbing.getBoundingClientRect(); return [(e.clientX - box.left) / box.width * R.width, (e.clientY - box.top) / box.height * R.height];
    };
    const pointerRub = e => {
      const p = local(e); o.autoTs = null;
      if (!o.lastRub) rub(...p);
      else { const dx = p[0] - o.lastRub[0], dy = p[1] - o.lastRub[1], length = Math.hypot(dx, dy); for (let d = R.step; d <= length; d += R.step) rub(o.lastRub[0] + dx * d / length, o.lastRub[1] + dy * d / length); if (length < R.step) return; }
      o.lastRub = p;
    };
    o.rubbing.addEventListener('pointerdown', e => { o.rubDown = true; o.rubbing.setPointerCapture(e.pointerId); o.lastRub = null; pointerRub(e); e.preventDefault(); });
    o.rubbing.addEventListener('pointermove', e => { if (o.rubDown) pointerRub(e); });
    o.rubbing.addEventListener('pointerup', () => o.rubDown = false); o.rubbing.addEventListener('pointercancel', () => o.rubDown = false);
    o.pz.addEventListener('pointermove', e => { if (!FD.hover || FD.rm || o.rubDown) return; const box = o.pz.getBoundingClientRect(); o.tilt = [(0.5 - (e.clientY - box.top) / box.height) * 2 * R.tilt, ((e.clientX - box.left) / box.width - 0.5) * 2 * R.tilt]; });
    o.pz.addEventListener('pointerleave', () => o.tilt = [0, 0]);
    FD.sheet.querySelector('.rub-do').addEventListener('click', autoStart); FD.sheet.querySelector('.pz-flip').addEventListener('click', flip); FD.sheet.querySelector('.pz-x').addEventListener('click', () => closeSheet());
    found(o.id); if (o.keyboard) autoStart(); if (FD.rm) { o.cells.forEach(p => rub(...p)); complete(); }
  };
  press(el, e => { if (o.stage !== 'rest') return; opened(o); o.keyboard = e.type === 'keydown'; o.stage = 'trace'; o.ts = FD.now; dash(true); if (FD.rm) sheet(); });
  o.hear = () => { o.dashTs = FD.now; dash(false); };
  o.beginClose = () => { if (FD.rm) return false; if (o.stage !== 'closing') { o.stage = 'closing'; o.closeTs = FD.now; } return true; };
  o.onSheetClose = () => { o.stage = 'rest'; o.rubDown = false; trace.classList.remove('red'); trace.style.opacity = 0; trace.getAnimations().forEach(a => a.cancel()); };
  o.undo = () => { if (FD.sheetOwner === o) closeSheet(); };
  o.onEscape = () => { if (o.stage === 'trace') { o.stage = 'rest'; trace.classList.remove('red'); } };
  o.tick = t => {
    const R = FIND_PLAY.rune;
    if (o.stage === 'rest' && o.awake && !FD.rm && t - o.dashTs >= R.dashTime) { o.dashTs = t; queueMicrotask(() => dash(false)); }
    if (o.stage === 'trace' && t - o.ts >= D(R.carving)) { o.stage = 'opening'; queueMicrotask(sheet); return; }
    if (!['sheet', 'closing'].includes(o.stage) || FD.sheetOwner !== o) return;
    const q = FD.rm ? 1 : ease((t - o.ts) / R.grow), closing = o.stage === 'closing', out = closing ? 1 - ease((t - o.closeTs) / R.close) : q;
    const fit = Math.min(1, (VIEW.w - FIND_PLAY.kit.sheet.edge) / R.width, (VIEW.h - FIND_PLAY.kit.sheet.edge * 2) / (R.height + Math.abs(R.controlTop) - R.height / 2));
    const from = FD.sheetFrom;
    FD.sheet.style.transform = `translate(${lerp(from[0], VIEW.w / 2, out)}px,${lerp(from[1], VIEW.h / 2 - FIND_PLAY.kit.sheet.offset, out)}px) scale(${lerp(FIND_PLAY.kit.sheet.from, fit, out)})`;
    o.pz.style.transform = `rotateX(${o.tilt[0]}deg) rotateY(${o.tilt[1]}deg)`;
    if (closing) { if (out === 0) queueMicrotask(() => closeSheet(true)); return; }
    if (!o.read && !o.rubs && o.autoTs === null && t - o.ts >= R.auto[0]) o.autoTs = t;
    if (!o.read && o.autoTs !== null) {
      const p = FD.rm ? 1 : clamp01((t - o.autoTs) / R.auto[1]), count = R.auto[2], pass = Math.min(count - 1, Math.floor(p * count)), u = p * count - pass, b = R.cells;
      const point = [lerp(b[0], b[2], pass % 2 ? 1 - u : u), lerp(b[1], b[3], (pass + u) / count)];
      if (!o.autoLast || Math.hypot(point[0] - o.autoLast[0], point[1] - o.autoLast[1]) >= R.step) { o.autoLast = point; queueMicrotask(() => rub(...point)); }
      if (p === 1) { o.autoTs = null; queueMicrotask(() => { o.cells.forEach(p => rub(...p)); }); }
    }
    if (o.read) {
      attr(o.fill, 'opacity', FD.rm ? 1 : ease((t - o.readTs) / R.fill));
      o.letters.forEach((letter, i) => { const k = FD.rm ? 1 : out3((t - o.readTs - R.fill - i * R.letter[0]) / R.letter[1]); attr(letter, 'opacity', k); attr(letter, 'transform', `translate(0 ${R.letterRise * (1 - k)})`); });
      if (!o.controls && (FD.rm || t - o.readTs >= R.fill + (o.letters.length - 1) * R.letter[0] + R.letter[1])) { o.controls = true; queueMicrotask(() => { if (FD.sheetOwner !== o) return; FD.sheet.querySelector('.rub-do').hidden = true; FD.sheet.querySelector('.pz-flip').hidden = false; FD.sheet.querySelector('.pz-x').hidden = false; FD.sheet.querySelector('.pz-flip').focus({ preventScroll: true }); }); }
    }
    const stamp = FD.rm ? 1 : out3((t - o.stampTs - R.stamp[0]) / R.stamp[1]);
    o.stamp.style.opacity = stamp; o.stamp.style.transform = `rotate(${R.stampAngle}deg) scale(${lerp(R.stamp[2], 1, stamp)})`;
    const shakeAge = t - o.stampTs - R.stamp[0] - R.stamp[1], shake = FD.rm || shakeAge < 0 || shakeAge > R.shake[1] ? 0 : R.shake[0] * Math.sin(shakeAge / R.shake[1] * Math.PI * 4) * (1 - shakeAge / R.shake[1]);
    o.pin.style.transform = `translateX(${shake}px) rotateY(${o.flipped ? FIND_PLAY.kit.deg : 0}deg)`;
  };
  return o;
}
