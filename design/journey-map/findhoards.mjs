// Part A: the instrument and the five persistent, hand-dug chests.
import { C, COPY, CRAFTS, STOPS, MAP, FIND_COPY, FIND_PLAY, PALETTES } from './data.mjs';
import { clamp01, lerp, toScreen, VIEW } from './trip.mjs';
import { pieceIcon } from './art.mjs';
import { cardsSetCraft, arrowSvg } from './cards.mjs';
import { tlSetCraft } from './timeline.mjs';
import { JOURNEY, stepsFocus } from './steps.mjs';
import { FD, FIND_BY, D, ease, out3, fEsc, attr, toMap, found, opened, press, showPop, closePop, attend, findBits, findSvg, findFormat, findRange, findLife, findAngleDelta } from './findkit.mjs';

export const wayAllStops = () => STOPS.map(s => CRAFTS.every(c => s.crafts.includes(c)));
export function findWay(svg) {
  const f = FIND_BY.wayfinder, el = svg.querySelector('#f-wayfinder'), needle = el.querySelector('.wf-needle'), words = [...el.querySelectorAll('.wf-word')], arms = [...el.querySelectorAll('.wf-arm')], runes = el.querySelector('.wf-runes'), tally = el.querySelector('.wf-tally'), ring = el.querySelector('.wf-all');
  const o = { id: f.id, el, craft: -1, angle: 0, speed: 0, runesAngle: 0, drag: false, picked: [], mask: null, kept: false, stage: 'rest', lines: [], lineTs: 0, hearTs: -Infinity };
  const group = svg.querySelector('#wf-lines');
  STOPS.forEach(s => {
    const target = MAP.waypoints[s.w], dx = target[0] - f.x, dy = target[1] - f.y, distance = Math.hypot(dx, dy), length = Math.max(0, distance - FIND_PLAY.way.short);
    const g = findSvg('g', { transform: `translate(${f.x} ${f.y}) rotate(${Math.atan2(dy, dx) * FIND_PLAY.kit.deg / Math.PI})` }), line = findSvg('path', { d: `M0 0H${length}`, fill: 'none', stroke: C.paper, 'stroke-width': FIND_PLAY.way.lineWidth, 'stroke-dasharray': FIND_PLAY.way.dash.join(' '), 'vector-effect': 'non-scaling-stroke', transform: 'scale(0 1)' });
    const ping = findSvg('circle', { class: 't', r: FIND_PLAY.way.pingR[0], opacity: 0 });
    const pg = findSvg('g', { transform: `translate(${target[0]} ${target[1]})` }); pg.appendChild(ping); g.appendChild(line); group.append(g, pg); o.lines.push({ line, ping, v: 0, lit: false, arrived: false });
  });
  const applyMask = mask => {
    o.mask = mask; cardsSetCraft(mask); tlSetCraft(mask);
    FD.base.style.opacity = mask ? FIND_PLAY.way.dim : 1;
    svg.querySelectorAll('#finds > .find, #bc-notes').forEach(g => { if (g !== el) g.style.opacity = mask ? FIND_PLAY.way.dim : 1; });
    FD.list.hoards?.items.forEach(h => { const i = STOPS.findIndex(s => s.id === h.d.stop); h.craftLit = !!mask?.[i]; h.el.style.opacity = mask && !mask[i] ? FIND_PLAY.way.dim : 1; });
  };
  const startLines = () => { o.lineTs = FD.now; o.linePhase = 'grow'; o.lines.forEach((l, i) => { l.lit = !!o.mask?.[i]; l.arrived = false; attr(l.line, 'stroke-dasharray', o.craft === CRAFTS.length ? 'none' : FIND_PLAY.way.dash.join(' ')); }); };
  const set = i => {
    if (i === CRAFTS.length && (!o.unlocked || !wayAllStops().some(Boolean))) i = -1;
    if (o.craft === i) return;
    o.craft = i; o.pickTs = FD.now;
    words.forEach((w, j) => w.classList.toggle('on', j === i || i === CRAFTS.length));
    arms.forEach((a, j) => a.classList.toggle('on', j === i || i === CRAFTS.length));
    const mask = i < 0 ? null : i === CRAFTS.length ? wayAllStops() : STOPS.map(s => s.crafts.includes(CRAFTS[i]));
    if (i >= 0) { o.kept = true; if (i < CRAFTS.length && !o.picked.includes(i)) o.picked.push(i); o.unlocked = o.picked.length === CRAFTS.length && wayAllStops().some(Boolean); found(o.id); opened(o); }
    applyMask(mask);
    // With a craft chosen the lines have to be seen arriving, so on a wide screen the camera pulls back for them.
    document.documentElement.classList.toggle('jm-way', i >= 0);
    if (JOURNEY.focus === o.id && !VIEW.phone) stepsFocus(o.id, i < 0 ? f.view : FIND_PLAY.way.wide);
    tally.textContent = i < 0 ? '' : i === CRAFTS.length ? findFormat(FIND_COPY.wayAll, { names: STOPS.filter((s, j) => mask[j]).map(s => s.short + ', ' + s.dates).join('; ') }) : findFormat(FIND_COPY.wayTally, { craft: FIND_COPY.crafts[i], n: mask.filter(Boolean).length, t: STOPS.length });
    o.retract = o.lines.map(l => l.v); o.lineTs = FD.now; o.linePhase = 'retract'; if (FD.rm || o.retract.every(v => v === 0)) { startLines(); if (FD.rm) o.lines.forEach(l => l.v = l.lit ? 1 : 0); }
  };
  const pick = e => {
    const p = toMap([e.clientX, e.clientY]), dx = p[0] - f.x, dy = p[1] - f.y;
    if (Math.hypot(dx, dy) < FIND_PLAY.way.hub) { set(o.craft >= 0 ? -1 : o.unlocked ? CRAFTS.length : -1); return; }
    const angle = Math.atan2(dx, -dy) * FIND_PLAY.kit.deg / Math.PI; o.angle = angle; o.speed = 0;
    set(Math.round((angle % FIND_PLAY.kit.turn + FIND_PLAY.kit.turn) % FIND_PLAY.kit.turn / (FIND_PLAY.kit.turn / CRAFTS.length)) % CRAFTS.length);
  };
  el.addEventListener('pointerdown', e => { o.drag = true; el.setPointerCapture(e.pointerId); pick(e); el._dragged = true; });
  el.addEventListener('pointermove', e => { if (o.drag) pick(e); });
  el.addEventListener('pointerup', () => o.drag = false); el.addEventListener('pointercancel', () => o.drag = false);
  el.addEventListener('click', e => { if (el._dragged) el._dragged = false; else pick(e); });
  el.addEventListener('keydown', e => {
    const count = CRAFTS.length + (o.unlocked ? 1 : 0);
    if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) { e.preventDefault(); const forward = ['ArrowRight', 'ArrowDown'].includes(e.key); set((o.craft + (forward ? 1 : count - 1) + count) % count); }
    else if (['Enter', ' '].includes(e.key)) { e.preventDefault(); set(o.craft >= 0 ? -1 : o.unlocked ? CRAFTS.length : -1); }
  });
  o.undo = () => set(-1); o.onEscape = () => { if (o.craft >= 0) set(-1); };
  o.hear = () => { o.hearTs = FD.now; o.hearAngle = o.angle; };
  o.tick = (t, dt) => {
    const W = FIND_PLAY.way, p = attend(o, W.near);
    let target = o.craft >= 0 && o.craft < CRAFTS.length ? o.craft * FIND_PLAY.kit.turn / CRAFTS.length : o.craft === CRAFTS.length ? o.angle + W.allSpeed * dt : p && o.awake ? Math.atan2(p[0] - f.x, f.y - p[1]) * FIND_PLAY.kit.deg / Math.PI : FD.rm ? 0 : Math.sin(t * W.drift[0]) * W.drift[1] + Math.sin(t * W.drift[2]) * W.drift[3];
    const hearing = t - o.hearTs < W.spin;
    if (hearing && !FD.rm) { o.angle = o.hearAngle + FIND_PLAY.kit.turn * ease((t - o.hearTs) / W.spin); o.speed = 0; }
    else if (o.craft === CRAFTS.length && !FD.rm) { o.angle += W.allSpeed * dt; o.speed = W.allSpeed; }
    else if (!o.drag) { const diff = findAngleDelta(o.angle, target); if (FD.rm) o.angle = target; else { o.speed += (W.stiff * diff - W.damp * o.speed) * dt; o.angle += o.speed * dt; } }
    attr(needle, 'transform', `rotate(${o.angle})`);
    const pulse = FD.rm ? 0 : Math.sin(Math.PI * clamp01((t - (o.pickTs ?? -Infinity)) / W.pulse[1]));
    arms.forEach((arm, i) => attr(arm, 'transform', `rotate(${i * FIND_PLAY.kit.turn / CRAFTS.length}) scale(${1 + (W.pulse[0] - 1) * pulse * (o.craft === i || o.craft === CRAFTS.length ? 1 : 0)})`));
    if (o.kept && !FD.rm) { o.runesAngle += W.runes * dt; attr(runes, 'transform', `rotate(${o.runesAngle})`); }
    // The tally is read from far out as well: it never falls under tally[3] px on screen, up to tally[4] units.
    attr(tally, 'font-size', Math.min(W.tally[4], Math.max(W.tally[1], W.tally[3] / FD.st.cam.s)));
    attr(ring, 'opacity', o.unlocked ? 1 : 0);
    if (o.unlocked && !FD.rm) attr(ring, 'transform', `scale(${lerp(W.ring[0], W.ring[1], (1 - Math.cos(t * Math.PI * 2 / W.ring[2])) / 2) / W.ring[0]})`);
    if (o.linePhase === 'retract') { const q = FD.rm ? 1 : clamp01((t - o.lineTs) / W.line); o.lines.forEach((l, i) => l.v = o.retract[i] * (1 - ease(q))); if (q === 1) queueMicrotask(startLines); }
    let order = 0;
    o.lines.forEach(l => {
      if (o.linePhase === 'grow') {
        if (l.lit) { const age = t - o.lineTs - order++ * W.gap; l.v = FD.rm ? 1 : ease(age / W.line); if (l.v === 1 && !l.arrived) { l.arrived = true; l.pingTs = t; } } else l.v = 0;
      }
      attr(l.line, 'transform', `scale(${l.v} 1)`); attr(l.line, 'opacity', o.craft === CRAFTS.length ? W.solidAlpha : W.alpha);
      const q = clamp01((t - (l.pingTs ?? -Infinity)) / W.ping); attr(l.ping, 'opacity', FD.rm ? 0 : W.pingAlpha * (1 - q)); attr(l.ping, 'transform', `scale(${lerp(W.pingR[0], W.pingR[1], q) / W.pingR[0]})`);
    });
    o.stage = o.craft === CRAFTS.length ? 'all-four' : o.craft >= 0 ? 'craft' : 'rest';
  };
  return o;
}
export function findHoards(svg) {
  const o = { id: 'hoards', el: svg.querySelector('#f-hoards'), items: [], kept: false, stage: 'buried' };
  FIND_COPY.hoards.forEach(d => {
    const el = svg.querySelector('#f-' + d.id), h = { id: d.id, d, el, digs: 0, open: false, kept: false, stage: 'buried', lift: 0, liftFrom: 0, ts: -Infinity, glintAt: FD.now + findRange(FIND_PLAY.hoard.glint), glintTs: -Infinity, hold: false, lastDig: -Infinity, chest: el.querySelector('.hd-chest'), lid: el.querySelector('.hd-lid'), scratch: el.querySelector('.hd-scratch'), hole: el.querySelector('.hd-hole'), pile: el.querySelector('.hd-pile'), glow: el.querySelector('.hd-glow'), glint: el.querySelector('.hd-glint'), stars: [...el.querySelectorAll('.hd-star')] };
    const show = () => {
      const H = FIND_PLAY.hoard, stop = STOPS.find(s => s.id === d.stop), n = o.items.filter(item => item.open).length;
      showPop(h, [d.x, d.y - H.anchor], `<p class="pop-k">${fEsc(stop.name)}<br>${fEsc(findFormat(FIND_COPY.hoardTally, { n, t: o.items.length }))}</p>${d.image ? `<img src="${d.image}" alt="${fEsc(d.title)}">` : `<div class="piece-empty"><svg viewBox="${H.iconBox.join(' ')}" aria-hidden="true">${pieceIcon(d.kind)}</svg><span>${fEsc(COPY.pieceToCome)}</span></div>`}<p class="pop-t">${fEsc(d.title)}</p><button class="pop-link" type="button">${fEsc(COPY.caseStudy)}${arrowSvg}</button>`, 'piece');
      FD.pop.style.setProperty('--piece-mark', PALETTES[stop.palette].mark);
    };
    const act = () => {
      const H = FIND_PLAY.hoard; opened(h);
      if (h.digs < H.hole.length) {
        h.liftFrom = h.lift; h.digs++; h.ts = FD.now; h.lastDig = FD.now; h.stage = 'rising';
        attr(h.hole, 'rx', H.hole[h.digs - 1]); attr(h.hole, 'ry', H.hole[h.digs - 1] * H.holeRatio);
        attr(h.pile, 'opacity', 1); attr(h.pile, 'transform', `scale(${H.pile[h.digs - 1]})`); attr(h.scratch, 'opacity', 0);
        findBits('clod', d.x, d.y, H.clods, FIND_PLAY.bits.clods); findBits('puff', d.x, d.y, H.puffs, FIND_PLAY.bits.puffs);
      } else if (!h.open) {
        h.open = h.kept = o.kept = true; h.stage = 'opening'; h.openTs = FD.now;
        found('hoards', d.id); findBits('star', d.x, d.y - H.anchor, H.stars, FIND_PLAY.bits.stars);
        h.pending = true;
      } else { h.bounceTs = FD.now; show(); }
    };
    el.addEventListener('pointerdown', e => { h.hold = true; h.nextHold = FD.now + FIND_PLAY.hoard.repeat; el.setPointerCapture(e.pointerId); act(); el._dragged = true; });
    el.addEventListener('pointerup', () => h.hold = false); el.addEventListener('pointercancel', () => h.hold = false);
    press(el, e => { e.stopPropagation(); act(); });
    h.undo = () => { if (FD.popOwner === h) closePop(); };
    h.hear = () => { if (!h.open) h.glintTs = h.hearTs = FD.now; };
    h.tick = (t, dt) => {
      const H = FIND_PLAY.hoard;
      findLife(h, d.x, d.y, H.rad, H.near);
      if (!h.onScreen && !h.hold && !['rising', 'opening'].includes(h.stage)) return;
      if (h.hold && t >= h.nextHold) { if (h.digs < H.hole.length || t - h.lastDig >= Math.max(H.openHold, H.rise)) { act(); h.nextHold = t + (h.digs < H.hole.length ? H.repeat : H.openHold); if (h.open) h.hold = false; } }
      if (h.awake !== h.wasAwake) { const awake = h.awake; queueMicrotask(() => { h.scratch.style.strokeWidth = awake ? H.scratchWidth : ''; }); if (awake && !h.digs) findBits('clod', d.x, d.y, H.hopClods, FIND_PLAY.bits.hop); }
      h.wasAwake = h.awake;
      if (!FD.rm && t >= h.glintAt && !h.digs) { h.glintTs = t; h.glintAt = t + findRange(H.glint); }
      const glint = FD.rm ? 1 : clamp01((t - h.glintTs) / H.glintTime); attr(h.glint, 'opacity', Math.sin(Math.PI * glint)); attr(h.glint, 'transform', `translate(0 ${-H.scratchHop * Math.sin(Math.PI * glint)}) rotate(${H.glintTurn * glint}) scale(${Math.sin(Math.PI * glint)})`);
      const heard = FD.rm ? 1 : clamp01((t - (h.hearTs ?? -Infinity)) / H.glintTime); attr(h.scratch, 'transform', `translate(0 ${-H.scratchHop * Math.sin(Math.PI * heard)})`);
      const q = FD.rm ? 1 : clamp01((t - h.ts) / H.rise), target = h.digs / H.hole.length;
      h.lift = lerp(h.liftFrom, target, ease(q));
      const overshoot = q === 1 || FD.rm ? 0 : Math.sin(Math.PI * q) * H.over;
      attr(h.chest, 'transform', `translate(0 ${H.travel * (1 - h.lift) - overshoot}) rotate(${h.digs === H.hole.length && !h.open && !FD.rm ? H.rattleAngle * Math.sin(Math.PI * 2 * H.rattleCycles * clamp01((t - h.ts - H.rise) / H.rattle)) : 0})`);
      if (q === 1 && h.stage === 'rising') h.stage = h.digs === H.hole.length ? 'out' : 'buried';
      const lp = !h.open ? 0 : FD.rm ? 1 : clamp01((t - h.openTs) / H.lidTime), back = 1 + (H.lidOver + 1) * (lp - 1) ** 3 + H.lidOver * (lp - 1) ** 2;
      const bounce = !FD.rm && h.bounceTs !== undefined ? Math.sin(Math.PI * clamp01((t - h.bounceTs) / H.lidTime)) : 0;
      attr(h.lid, 'transform', `rotate(${H.lidAngle * back * (h.open ? 1 : 0) + H.rattleAngle * bounce} ${H.lidPivot[0]} ${H.lidPivot[1]}) translate(0 ${H.lidLift * back * (h.open ? 1 : 0)})`);
      const age = t - (h.openTs ?? -Infinity), glow = h.open ? age < H.glowTime ? H.glowPeak * clamp01(age / H.glowTime) : FD.popOwner === h ? H.glowRest : H.glowKept : 0;
      attr(h.glow, 'opacity', Math.max(glow, h.craftLit ? 1 : 0));
      const burst = FD.rm ? 1 : clamp01(age / D(H.glowTime + H.lidTime));
      h.stars.forEach((s, i) => { const a = i * Math.PI * 2 / h.stars.length - Math.PI / 2, distance = H.burstTravel[i % 2] * out3(burst); attr(s, 'transform', `translate(${Math.cos(a) * distance} ${Math.sin(a) * distance - H.burstLift * burst})`); attr(s, 'opacity', FD.rm || !h.open ? 0 : 1 - burst); });
      if (h.pending && lp === 1) { h.pending = false; h.stage = 'open'; queueMicrotask(show); }
    };
    o.items.push(h);
  });
  press(o.el, e => { if (e.target === o.el) o.items[0].el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })); });
  o.tick = (t, dt) => { o.items.forEach(h => h.tick(t, dt)); o.stage = o.items.some(h => h.open) ? 'opened' : 'buried'; };
  o.hear = () => o.items.forEach(h => h.hear()); return o;
}
