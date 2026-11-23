// Eleven things to play with. Each runs on its own clock; the trip never waits for them.
import { C, FINDS, FIND_COPY, FIND_TIMING, COPY, CRAFTS, STOPS } from './data.mjs';
import { VIEW, toScreen, clamp01, lerp, easeIO, tripState, SEQ } from './trip.mjs';
import { cardsSetCraft } from './cards.mjs';
import { tlSetCount } from './timeline.mjs';
import { JOURNEY, stepsFind, stepsJumping } from './steps.mjs';

const FD = { st: null, now: 0, pointer: [-1e4, -1e4], found: new Set(), last: null, list: {}, pop: null, popAnchor: null, popP: 0, popOwner: null, sheet: null, sheetP: 0, sheetOwner: null, rm: false, base: null };
const D = s => FD.rm ? 1e-4 : s;
const ease = t => easeIO(clamp01(t));
const out3 = t => 1 - Math.pow(1 - clamp01(t), 3);
const fEsc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const attr = (el, k, v) => el.setAttribute(k, v);
const toMap = p => [(p[0] - FD.st.cam.tx) / FD.st.cam.s, (p[1] - FD.st.cam.ty) / FD.st.cam.s];
const FIND_BY = Object.fromEntries(FINDS.map(f => [f.id, f]));
const arrowHtml = '<svg class="arr" viewBox="0 0 14 10" aria-hidden="true"><path d="M1 5h11M8 1l4 4l-4 4"/></svg>';

function found(id) { if (FD.found.has(id)) return; FD.found.add(id); tlSetCount(FD.found.size, FINDS.length); }
function opened(f) { if (f.id !== 'well') FD.last = f; }

// ---- shared popups ----
function showPop(owner, anchor, html, cls = '') {
  FD.pop.className = 'pop on ' + cls; FD.pop.innerHTML = `<div class="pop-in">${html}</div>`;
  FD.popAnchor = anchor; FD.popOwner = owner; FD.popP = FD.st.P; placePop();
}
function closePop() { if (!FD.popOwner) return; const o = FD.popOwner; FD.popOwner = null; FD.pop.className = 'pop'; FD.pop.innerHTML = ''; if (o.onPopClose) o.onPopClose(); }
function placePop() { if (!FD.popOwner) return; const p = toScreen(FD.st, FD.popAnchor); FD.pop.style.transform = `translate(${p[0].toFixed(1)}px,${p[1].toFixed(1)}px)`; }
function closeSheet() { if (!FD.sheetOwner) return; const o = FD.sheetOwner; FD.sheetOwner = null; FD.sheet.className = 'sheet'; FD.sheet.innerHTML = ''; if (o.onSheetClose) o.onSheetClose(); }
export function findsCloseAll() { closePop(); closeSheet(); Object.values(FD.list).forEach(f => f.onEscape && f.onEscape()); }

const press = (el, fn) => { el.addEventListener('click', e => { if (el._dragged) { el._dragged = false; return; } fn(e); }); el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(e); } }); };

// ---- 1. the wayfinder ----
function find_wayfinder(svg) {
  const f = FIND_BY.wayfinder, el = svg.querySelector('#f-wayfinder'), needle = el.querySelector('.wf-needle'), words = [...el.querySelectorAll('.wf-word')];
  const o = { id: 'wayfinder', craft: -1, ang: 0, drag: false };
  const set = i => {
    o.craft = i; words.forEach((w, j) => w.classList.toggle('on', j === i));
    const craft = i >= 0 ? CRAFTS[i] : null; cardsSetCraft(craft);
    const dim = craft ? .55 : 1; FD.base.style.opacity = dim;
    svg.querySelectorAll('#finds > .find, #finds > #f-hoards, #bc-notes').forEach(g => { if (g !== el && g.id !== 'f-hoards') g.style.opacity = dim; });
    FD.list.hoards.items.forEach(h => { const lit = craft && STOPS.find(s => s.id === h.d.stop).crafts.includes(craft); h.glow.setAttribute('opacity', lit ? 1 : 0); h.el.style.opacity = craft && !lit ? .55 : 1; });
    if (i >= 0) { found('wayfinder'); opened(o); }
  };
  const pick = (e, release) => {
    const m = toMap([e.clientX, e.clientY]), dx = m[0] - f.x, dy = m[1] - f.y, d = Math.hypot(dx, dy);
    if (d < 6 && release) { set(-1); return; }
    const a = Math.atan2(dx, -dy) * 180 / Math.PI; o.ang = a;
    set(((Math.round(((a % 360) + 360) % 360 / 90)) % 4));
  };
  el.addEventListener('pointerdown', e => { o.drag = true; o.moved = false; el.setPointerCapture(e.pointerId); });
  el.addEventListener('pointermove', e => { if (!o.drag) return; o.moved = true; pick(e, false); });
  el.addEventListener('pointerup', e => { if (o.drag) pick(e, !o.moved); o.drag = false; });
  el.addEventListener('pointercancel', () => { o.drag = false; });
  el.addEventListener('click', e => { if (e === FD.replayEvent) pick(e, true); });
  el.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); set((o.craft + 1) % 4); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); set((o.craft + 3) % 4); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); set(-1); }
  });
  o.undo = () => set(-1);
  o.onEscape = () => { if (o.craft >= 0) set(-1); };
  o.tick = (t, dt) => {
    let target = o.craft >= 0 ? o.craft * 90 : (FD.rm ? 0 : Math.sin(t * .8) * 4 + Math.sin(t * .31) * 2);
    if (o.drag && o.moved) target = o.ang;
    let diff = ((target - o.cur + 540) % 360) - 180; if (isNaN(diff)) { o.cur = target; diff = 0; }
    o.cur += FD.rm ? diff : diff * Math.min(1, dt * 8);
    attr(needle, 'transform', `rotate(${o.cur.toFixed(2)})`);
  };
  o.cur = 0;
  return o;
}

// ---- 2. hoards ----
function find_hoards(svg) {
  const o = { id: 'hoards', items: [] };
  FIND_COPY.hoards.forEach(d => {
    const el = svg.querySelector('#f-' + d.id), h = { d, el, chest: el.querySelector('.hd-chest'), lid: el.querySelector('.hd-lid'), glow: el.querySelector('.hd-glow'), stars: [...el.querySelectorAll('.hd-star')], v: 0, target: 0, ts: -1 };
    const item = { id: 'hoards', onPopClose: null, undo: () => { h.target = 0; if (FD.popOwner === item) closePop(); } };
    press(el, () => {
      found('hoards'); opened(item); h.target = 1; if (h.ts < 0 || h.v < .01) h.ts = FD.now;
      const show = () => showPop(item, [d.x, d.y - 18], `<p class="pop-k">${fEsc(STOPS.find(s => s.id === d.stop).name)}</p>${d.image ? `<img src="${d.image}" alt="">` : ''}<p class="pop-t">${fEsc(d.title)}</p><button class="pop-link" type="button">${COPY.caseStudy}${arrowHtml}</button>`, 'card');
      h.pending = show;
    });
    h.tick = t => {
      const step = (FD.rm ? 1 : (1 / FIND_TIMING.dig) * FD.dt);
      h.v = h.target > h.v ? Math.min(1, h.v + step) : Math.max(0, h.v - step);
      attr(h.chest, 'transform', `translate(0 ${(60 * (1 - ease(h.v))).toFixed(2)})`);
      const lp = h.target === 1 ? clamp01((t - h.ts - D(FIND_TIMING.dig)) / D(.25)) : (h.v >= 1 ? 1 : 0) * h.v;
      attr(h.lid, 'transform', `rotate(${(-32 * out3(lp)).toFixed(2)} 30 -34) translate(0 ${(-6 * out3(lp)).toFixed(2)})`);
      const b = h.target === 1 ? clamp01((t - h.ts - D(FIND_TIMING.dig) - D(.1)) / D(FIND_TIMING.burst)) : 1;
      h.stars.forEach((s, i) => { const a = i * Math.PI / 4 - Math.PI / 2, dd = (i % 2 ? 34 : 48) * out3(b); attr(s, 'transform', `translate(${(Math.cos(a) * dd).toFixed(1)} ${(Math.sin(a) * dd - 14 * b).toFixed(1)})`); attr(s, 'opacity', FD.rm ? 0 : (b > 0 && b < 1 ? (1 - b) : 0).toFixed(2)); });
      if (h.pending && h.v >= 1 && lp >= 1) { h.pending(); h.pending = null; }
    };
    o.items.push(h);
  });
  o.tick = t => o.items.forEach(h => h.tick(t));
  return o;
}

// ---- 3. Huginn and Muninn ----
function find_ravens(svg) {
  const f = FIND_BY.ravens, el = svg.querySelector('#f-ravens'), a = el.querySelector('.rv-a'), heads = [...el.querySelectorAll('.rv-head')];
  const k = .72, perch = [[-5, -34], [6, -33]];
  const o = { id: 'ravens', ts: -1, phase: 'rest' };
  const land = [30, 30];
  const flyPos = p => [land[0] * p + 10 * Math.sin(2 * Math.PI * p), land[1] * p * p - 26 * Math.sin(Math.PI * p)];
  press(el, () => { if (o.phase !== 'rest') return; found('ravens'); opened(o); o.phase = 'fly'; o.ts = FD.now; });
  const stop = () => { if (o.phase === 'rest' || o.phase === 'back') return; if (FD.sheetOwner === o) closeSheet(); o.phase = 'back'; o.ts = FD.now; };
  o.undo = stop; o.onEscape = stop;
  o.onSheetClose = () => { if (o.phase === 'reel' || o.phase === 'iris') { o.phase = 'back'; o.ts = FD.now; } };
  const openReel = () => {
    const lp = [f.x + (perch[0][0] + land[0]) * k, f.y + (perch[0][1] + land[1]) * k];
    FD.sheetOwner = o; FD.sheetP = FD.st.P; FD.sheetFrom = toScreen(FD.st, lp);
    FD.sheet.className = 'sheet on reel';
    FD.sheet.innerHTML = `<div class="iris"><div class="iris-in"><div class="player" role="img" aria-label="Placeholder reel"><i class="sh sh1"></i><i class="sh sh2"></i><i class="sh sh3"></i><svg class="ring" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="16"/><circle class="ring-p" cx="20" cy="20" r="16" pathLength="100" stroke-dasharray="100 100" stroke-dashoffset="100"/></svg><span class="tc">${FIND_COPY.ravenTime[0]} / ${FIND_COPY.ravenTime[1]}</span></div></div></div>`;
    o.sh = [...FD.sheet.querySelectorAll('.sh')]; o.ring = FD.sheet.querySelector('.ring-p'); o.tc = FD.sheet.querySelector('.tc'); o.iris = FD.sheet.querySelector('.iris'); o.irisIn = FD.sheet.querySelector('.iris-in');
  };
  o.tick = (t) => {
    // heads follow the pointer
    const pm = toMap(FD.pointer);
    heads.forEach((h, i) => { const hx = f.x + (perch[i][0] + (i ? -5 : 5)) * k, hy = f.y + (perch[i][1] - 9) * k; let ang = Math.atan2(pm[1] - hy, pm[0] - hx) * 180 / Math.PI; if (i) ang = 180 - ang; ang = ((ang + 540) % 360) - 180; ang = Math.max(-35, Math.min(35, ang)); h._a = lerp(h._a || 0, ang, Math.min(1, FD.dt * 6)); attr(h, 'transform', `translate(5 -9) rotate(${h._a.toFixed(1)})`); });
    const e = t - o.ts;
    if (o.phase === 'fly') { const p = clamp01(e / D(FIND_TIMING.ravenLoop)), q = flyPos(ease(p)); attr(a, 'transform', `translate(${q[0].toFixed(1)} ${q[1].toFixed(1)})`); if (p >= 1) { o.phase = 'reel'; o.ts = t; openReel(); } }
    else if (o.phase === 'reel' || o.phase === 'iris') {
      const grow = out3(e / D(.35)), from = FD.sheetFrom, cx = VIEW.w / 2, cy = VIEW.h / 2 - 20;
      const ks = lerp(.08, 1, grow);
      FD.sheet.style.transform = `translate(${lerp(from[0], cx, grow).toFixed(1)}px,${lerp(from[1], cy, grow).toFixed(1)}px) scale(${ks.toFixed(3)})`;
      const pt = clamp01((e - .35) / FIND_TIMING.reel);
      o.ring.setAttribute('stroke-dashoffset', (100 * (1 - pt)).toFixed(1));
      o.tc.textContent = `00:0${Math.min(5, Math.floor(pt * 5))} / ${FIND_COPY.ravenTime[1]}`;
      if (!FD.rm) o.sh.forEach((s, i) => s.style.transform = `translate(${(Math.sin(e * (1.3 + i * .4) + i * 2) * 60).toFixed(1)}px,${(Math.cos(e * (1.1 + i * .3) + i) * 22).toFixed(1)}px) rotate(${(e * 40 * (i - 1)).toFixed(0)}deg)`);
      if (pt >= 1 && o.phase === 'reel') { o.phase = 'iris'; o.irisT = t; }
      if (o.phase === 'iris') { const q = clamp01((t - o.irisT) / D(FIND_TIMING.iris)), kk = Math.max(.001, 1 - ease(q)); o.iris.style.transform = `scale(${kk.toFixed(4)})`; o.irisIn.style.transform = `scale(${(1 / kk).toFixed(4)})`; if (q >= 1) { closeSheet(); o.phase = 'back'; o.ts = t; } }
    } else if (o.phase === 'back') { const p = clamp01(e / D(.5)), q = flyPos(1 - ease(p)); attr(a, 'transform', `translate(${q[0].toFixed(1)} ${(q[1] - Math.sin(Math.PI * p) * 6).toFixed(1)})`); if (p >= 1) o.phase = 'rest'; }
  };
  return o;
}

// ---- 4. the serpent ----
function find_serpent(svg) {
  const f = FIND_BY.serpent, el = svg.querySelector('#f-serpent'), loops = [...el.querySelectorAll('.sp-loop')], head = el.querySelector('.sp-head'), leaf = el.querySelector('.sp-leaf'), rips = [...el.querySelectorAll('.sp-rip ellipse')];
  const k = .52, o = { id: 'serpent', ts: -1, n: 0, phase: 'rest', ha: 0 };
  press(el, () => { if (o.phase === 'sink') return; found('serpent'); opened(o); o.phase = 'sink'; o.ts = FD.now; attr(leaf, 'opacity', 0); if (FD.popOwner === o) closePop(); });
  o.onPopClose = () => { attr(leaf, 'opacity', 0); };
  o.undo = () => { closePop(); attr(leaf, 'opacity', 0); };
  o.tick = t => {
    const pm = toMap(FD.pointer), hx = f.x - 86 * k, hy = f.y - 42 * k;
    let ang = Math.atan2(pm[1] - hy, pm[0] - hx) * 180 / Math.PI; ang = ((ang - 180 + 540) % 360) - 180; ang = Math.max(-25, Math.min(25, ang));
    o.ha = lerp(o.ha, ang, Math.min(1, FD.dt * 5)); attr(head, 'transform', `rotate(${o.ha.toFixed(1)} -72 -40)`);
    const e = t - o.ts, n = loops.length;
    if (o.phase === 'sink') {
      const sinkEnd = D(FIND_TIMING.serpentSink), surf = sinkEnd + D(FIND_TIMING.serpentSurface) * .5, up = D(.5);
      loops.forEach((g, j) => { const d = clamp01((e - j * D(.12)) / D(.35)), u = clamp01((e - surf - (n - 1 - j) * D(.08)) / up); attr(g, 'transform', `translate(0 ${(34 * ease(d) * (1 - ease(u))).toFixed(1)})`); });
      rips.forEach((r, j) => { const q = clamp01((e - .25 - j * .15) / .8); attr(r, 'transform', `translate(${(-40 + j * 40) * 0} 0) scale(${(1 + q * 1.6).toFixed(2)} ${(1 + q * .8).toFixed(2)})`); attr(r, 'opacity', FD.rm ? 0 : (q > 0 && q < 1 ? .8 * (1 - q) : 0).toFixed(2)); });
      if (e > surf + up + (n - 1) * D(.08)) { o.phase = 'rest'; attr(leaf, 'opacity', 1); showPop(o, [f.x - 60 * k, f.y - 70 * k], `<p class="pop-t">${fEsc(FIND_COPY.serpentLines[o.n % FIND_COPY.serpentLines.length])}</p>`); o.n++; }
    }
  };
  return o;
}

// ---- 5. the beacon ----
function find_beacon(svg) {
  const f = FIND_BY.beacon, el = svg.querySelector('#f-beacon'), beam = el.querySelector('.bc-beam'), notes = [...svg.querySelectorAll('.bc-note')].map((g, i) => ({ g, en: g.querySelector('.bc-en'), d: FIND_COPY.beaconNotes[i], v: 0, lit: 0 }));
  const O = [f.x, f.y - 50 * .6], R = 230 * .6, half = FIND_TIMING.beamCone / 2;
  const o = { id: 'beacon', head: 176, manualT: -99, drag: false };
  const aimAt = e => { const m = toMap([e.clientX, e.clientY]); o.head = Math.atan2(m[1] - O[1], m[0] - O[0]) * 180 / Math.PI; o.manualT = FD.now; found('beacon'); opened(o); };
  el.addEventListener('pointerdown', e => { o.drag = true; el.setPointerCapture(e.pointerId); aimAt(e); });
  el.addEventListener('pointermove', e => { if (o.drag) aimAt(e); });
  el.addEventListener('pointerup', () => { o.drag = false; }); el.addEventListener('pointercancel', () => { o.drag = false; });
  el.addEventListener('keydown', e => { const d = e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -6 : e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 6 : 0; if (!d) return; e.preventDefault(); o.head += d; o.manualT = FD.now; found('beacon'); opened(o); });
  el.addEventListener('click', e => { if (e === FD.replayEvent) aimAt(e); });
  el.addEventListener('keydown', e => { if (JOURNEY.mode === 'steps' && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); o.manualT = FD.now; found('beacon'); opened(o); } });
  o.undo = () => { o.manualT = -99; };
  o.tick = (t, dt) => {
    const manual = o.drag || t - o.manualT < 6;
    if (!manual) o.head = FD.rm ? 176 : 176 + 36 * Math.sin(t * FIND_TIMING.beamSweep);
    attr(beam, 'transform', `translate(0 -50) rotate(${(o.head - 180).toFixed(2)})`);
    notes.forEach(n => {
      const dx = n.d.x - O[0], dy = n.d.y - O[1], a = Math.atan2(dy, dx) * 180 / Math.PI, diff = Math.abs(((a - o.head + 540) % 360) - 180);
      const inL = diff < half + 2 && Math.hypot(dx, dy) < R;
      n.lit = inL ? n.lit + dt : 0;
      n.v = FD.rm ? (inL ? 1 : 0) : lerp(n.v, inL ? 1 : 0, Math.min(1, dt * 6));
      if (n.lit > FIND_TIMING.noteDelay) n.en.dataset.on = '1'; else if (!inL) n.en.dataset.on = '';
      n.ev = FD.rm ? (n.en.dataset.on ? 1 : 0) : lerp(n.ev || 0, n.en.dataset.on ? 1 : 0, Math.min(1, dt * 5));
      attr(n.g, 'opacity', n.v.toFixed(3)); attr(n.en, 'opacity', n.ev.toFixed(3));
    });
  };
  return o;
}

// ---- 6. the rune stone ----
function find_runestone(svg) {
  const f = FIND_BY.runestone, el = svg.querySelector('#f-runestone'), trace = el.querySelector('.rs-trace'), P = FIND_COPY.poster;
  const o = { id: 'runestone', phase: 'rest', ts: -1 };
  press(el, () => { if (o.phase !== 'rest') return; found('runestone'); opened(o); o.phase = 'trace'; o.ts = FD.now; o.len = trace.getTotalLength() * .55 * FD.st.cam.s; trace.classList.add('red'); trace.style.strokeDasharray = `${o.len} ${o.len}`; });
  const reset = () => { o.phase = 'rest'; trace.classList.remove('red'); trace.style.strokeDasharray = 'none'; };
  o.onSheetClose = reset; o.undo = () => { closeSheet(); reset(); }; o.onEscape = () => { if (o.phase === 'trace') reset(); };
  const openSheet = () => {
    FD.sheetOwner = o; FD.sheetP = FD.st.P; FD.sheetFrom = toScreen(FD.st, [f.x, f.y - 20]);
    FD.sheet.className = 'sheet on poster';
    FD.sheet.innerHTML = `<div class="pz"><div class="pz-in"><div class="pz-front"><span class="pz-pin"></span><span class="pz-pin r"></span><b class="pz-h">${P.head}</b><div class="pz-pic"><i></i><s></s></div><b class="pz-who">${P.who}</b><p>${P.line1}<br>${P.line2}</p><b class="pz-rw">${P.reward}</b><span class="pz-stamp">${P.stamp}</span><span class="pz-fold"></span></div><div class="pz-back"><p>${P.back[0]}</p><p>${P.back[1]}</p></div></div></div><div class="pz-ctl"><button type="button" class="pz-flip">${COPY.flip}</button><button type="button" class="pz-x">${COPY.close}</button></div>`;
    o.pz = FD.sheet.querySelector('.pz'); o.pin = FD.sheet.querySelector('.pz-in');
    FD.sheet.querySelector('.pz-flip').addEventListener('click', () => o.pin.classList.toggle('flip'));
    FD.sheet.querySelector('.pz-x').addEventListener('click', closeSheet);
    FD.sheet.querySelector('.pz-flip').focus({ preventScroll: true });
  };
  o.tick = t => {
    const e = t - o.ts;
    if (o.phase === 'trace') { const q = clamp01(e / D(FIND_TIMING.carving)); trace.style.strokeDashoffset = (o.len * (1 - q)).toFixed(1); if (q >= 1) { o.phase = 'sheet'; o.ts = t; openSheet(); } }
    else if (o.phase === 'sheet') {
      const q = clamp01(e / D(FIND_TIMING.unroll)), a = ease(q / .5), b = ease((q - .5) / .5), from = FD.sheetFrom;
      const cx = VIEW.w / 2, cy = VIEW.h / 2 - 14, k0 = .06;
      FD.sheet.style.transform = `translate(${lerp(from[0], cx, a).toFixed(1)}px,${lerp(from[1], cy, a).toFixed(1)}px) scale(${lerp(k0, 1, a).toFixed(3)})`;
      o.pz.style.transform = `rotate(${lerp(-10, 2, a).toFixed(1)}deg) scaleY(${lerp(.08, 1, b).toFixed(3)})`;
    }
  };
  return o;
}

// ---- small finds ----
function find_tafl(svg) {
  const f = FIND_BY.tafl, el = svg.querySelector('#f-tafl'), pc = el.querySelector('.tf-piece'), o = { id: 'tafl', pos: 0, v: 0 };
  press(el, () => { found('tafl'); opened(o); o.pos = o.pos ? 0 : 1; showPop(o, [f.x + 7, f.y - 2], `<p class="pop-t">${fEsc(FIND_COPY.tafl)}</p>`); });
  o.undo = () => { o.pos = 0; if (FD.popOwner === o) closePop(); };
  o.tick = (t, dt) => { o.v = FD.rm ? o.pos : o.v + Math.sign(o.pos - o.v) * Math.min(Math.abs(o.pos - o.v), dt / FIND_TIMING.slide); attr(pc, 'transform', `translate(0 ${(-3 * ease(o.v)).toFixed(2)})`); };
  return o;
}
function find_mist(svg) {
  const el = svg.querySelector('#f-mist'), wipes = svg.querySelector('#mistWipes'), o = { id: 'mist', lastW: null };
  const wipe = (m, r) => { if (o.lastW && Math.hypot(m[0] - o.lastW[0], m[1] - o.lastW[1]) < r * .4) return; o.lastW = m; const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c.setAttribute('cx', m[0].toFixed(1)); c.setAttribute('cy', m[1].toFixed(1)); c.setAttribute('r', r); c.setAttribute('fill', C.black); wipes.appendChild(c); found('mist'); opened(o); };
  el.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') wipe(toMap([e.clientX, e.clientY]), 9); });
  el.addEventListener('click', e => wipe(toMap([e.clientX, e.clientY]), 16));
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); for (let i = 0; i < 9; i++) { o.lastW = null; wipe([112 + i * 11, 432 + (i % 2) * 10], 14); } } });
  o.undo = () => { wipes.innerHTML = ''; o.lastW = null; };
  return o;
}
function find_horn(svg) {
  const f = FIND_BY.horn, el = svg.querySelector('#f-horn'), hn = el.querySelector('.hn-horn'), o = { id: 'horn', up: 0, v: 0, ts: 0 };
  press(el, () => { found('horn'); opened(o); o.up = 1; o.ts = FD.now; showPop(o, [f.x, f.y - 22], `<p class="pop-t pop-big">${fEsc(FIND_COPY.horn[0])}</p><p class="pop-t pop-late">${fEsc(FIND_COPY.horn[1])}</p>`); });
  o.onPopClose = () => { o.up = 0; }; o.undo = () => { o.up = 0; if (FD.popOwner === o) closePop(); };
  o.tick = (t, dt) => { o.v = FD.rm ? o.up : o.v + Math.sign(o.up - o.v) * Math.min(Math.abs(o.up - o.v), dt / .35); const q = ease(o.v); attr(hn, 'transform', `translate(${(3 * q).toFixed(2)} ${(-7 * q).toFixed(2)}) rotate(${(-30 * q).toFixed(1)} -8 -4)`); };
  return o;
}
function find_well(svg) {
  const f = FIND_BY.well, el = svg.querySelector('#f-well'), rips = [...el.querySelectorAll('.wl-rip ellipse')], o = { id: 'well', ts: -9 };
  press(el, () => { found('well'); o.ts = FD.now; const l = FD.last; FD.last = null; if (l && l.undo) l.undo(); });
  o.tick = t => { const e = t - o.ts; rips.forEach((r, j) => { const q = clamp01((e - j * .18) / FIND_TIMING.ripple); attr(r, 'transform', `scale(${(1.25 - q * 1.1).toFixed(3)})`); attr(r, 'opacity', FD.rm ? 0 : (q > 0 && q < 1 ? .9 * Math.sin(Math.PI * q) : 0).toFixed(2)); }); };
  return o;
}
function find_longship(svg) {
  const el = svg.querySelector('#f-longship'), ship = el.querySelector('.ls-ship'), o = { id: 'longship' };
  press(el, () => { found('longship'); opened(o); const tr = ship.getAttribute('transform').match(/translate\(([-\d.]+) ([-\d.]+)\)/); showPop(o, [+tr[1], +tr[2] - 24], `<p class="pop-t">${fEsc(FIND_COPY.longship)}</p>`); });
  o.undo = () => { if (FD.popOwner === o) closePop(); };
  return o;
}

// A keyboard press can reach a find even when the camera or an open card hides it.
function findNeedsVisit(el) {
  const st = tripState(JOURNEY.P), p = toScreen(st, [+el.dataset.x, +el.dataset.y]);
  return st.cam.s < VIEW.sT * .8 || st.cardOpen > .5 || p[0] < VIEW.w * .1 || p[0] > VIEW.w * .9 || p[1] < VIEW.h * .1 || p[1] > VIEW.h * .9;
}
function findVisitP(el) {
  const place = [+el.dataset.x, +el.dataset.y]; let best = JOURNEY.P, distance = Infinity;
  const sample = P => {
    const p = toScreen(tripState(P), place), d = Math.pow(p[0] - VIEW.w * .5, 2) + Math.pow(p[1] - VIEW.h * .46, 2);
    if (d < distance) { distance = d; best = P; }
  };
  SEQ.filter(s => s.kind === 'leg' || s.kind === 'legX').forEach(s => { for (let p = s.a; p < s.a + s.len; p += 2) sample(p); sample(s.a + s.len); });
  return best;
}
function findCapture(e) {
  if (FD.rm || JOURNEY.mode !== 'steps' || e === FD.replayEvent) return;
  if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
  const el = e.target.closest && e.target.closest('.find'); if (!el) return;
  if (stepsJumping()) { e.preventDefault(); e.stopImmediatePropagation(); return; }
  if (!findNeedsVisit(el)) return;
  e.preventDefault(); e.stopImmediatePropagation();
  const st = tripState(JOURNEY.P), point = e.type === 'click' ? [(e.clientX - st.cam.tx) / st.cam.s, (e.clientY - st.cam.ty) / st.cam.s] : null;
  const key = { key: e.key, code: e.code, shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, metaKey: e.metaKey, altKey: e.altKey };
  stepsFind(findVisitP(el), () => {
    const p = point ? toScreen(tripState(JOURNEY.P), point) : null;
    const pressEvent = p ? new MouseEvent('click', { bubbles: true, cancelable: true, clientX: p[0], clientY: p[1], detail: e.detail }) : new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...key });
    FD.replayEvent = pressEvent;
    try { el.dispatchEvent(pressEvent); } finally { FD.replayEvent = null; }
  });
}
export function findsBuild(svg, pop, sheet, base, rm) {
  FD.pop = pop; FD.sheet = sheet; FD.base = base; FD.rm = rm;
  const builders = { wayfinder: find_wayfinder, hoards: find_hoards, ravens: find_ravens, serpent: find_serpent, beacon: find_beacon, runestone: find_runestone, tafl: find_tafl, mist: find_mist, horn: find_horn, well: find_well, longship: find_longship };
  Object.entries(builders).forEach(([k, b]) => { FD.list[k] = b(svg); });
  if (!rm) {
    svg.addEventListener('click', findCapture, true); svg.addEventListener('keydown', findCapture, true);
    // These two finds use pointerdown/up for aiming; keep that from acting before the captured click's visit.
    svg.addEventListener('pointerdown', e => {
      const el = e.target.closest && e.target.closest('.find');
      if (JOURNEY.mode === 'steps' && el && (stepsJumping() || findNeedsVisit(el))) { e.preventDefault(); e.stopImmediatePropagation(); }
    }, true);
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') findsCloseAll(); });
  tlSetCount(0, FINDS.length);
}
export function findsPointer(x, y) { FD.pointer = [x, y]; }
export function findsFrame(time, st) {
  FD.dt = Math.min(.1, FD.now ? time - FD.now : 0); FD.now = time; FD.st = st;
  Object.values(FD.list).forEach(f => f.tick && f.tick(time, FD.dt));
  placePop();
  const far = FIND_TIMING.closeScroll;
  if (FD.popOwner && Math.abs(st.P - FD.popP) > far) closePop();
  if (FD.sheetOwner && Math.abs(st.P - FD.sheetP) > far) closeSheet();
}
