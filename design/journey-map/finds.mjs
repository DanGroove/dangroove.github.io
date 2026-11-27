// Eleven finds share the camera/life/overlay kit.
import { FIND_COPY, FIND_PLAY, COMB } from './data.mjs';
import { JOURNEY } from './steps.mjs';
import { depthBeam } from './depth.mjs';
import { FD, FIND_BY, findKitBuild, findKitFrame, findCapture, findPlace, findLife, closePop, closeSheet, findKitStyle, findHint, findSvg, attr, findScreen } from './findkit.mjs';
import { findWay, findHoards } from './findhoards.mjs';
import { findRavens, findSerpent } from './findcreatures.mjs';
import { findBeacon, findRune } from './findsheets.mjs';
import { findHammer } from './findhammer.mjs';
import { findMist, findWell, findShip } from './findwater.mjs';
import { findHorn } from './findhorn.mjs';
import { findAll } from './findall.mjs';

export function findsCloseAll() {
  FD.overlayEpoch++;
  closePop(); closeSheet(); Object.values(FD.list).forEach(f => f.onEscape?.());
}
function findPlain(value, seen = new Set()) {
  if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) return value;
  if (!value || typeof value !== 'object' || seen.has(value) || value.nodeType) return undefined;
  seen.add(value);
  if (value instanceof Set) return [...value];
  if (Array.isArray(value)) return value.map(v => findPlain(v, seen)).filter(v => v !== undefined);
  if (Object.getPrototypeOf(value) !== Object.prototype) return undefined;
  return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, findPlain(v, seen)]).filter(([k, v]) => v !== undefined));
}
export function findsBuild(svg, pop, sheet, base, rm) {
  findKitBuild(svg, pop, sheet, base, rm);
  const builders = { wayfinder: findWay, hoards: findHoards, ravens: findRavens, serpent: findSerpent, beacon: findBeacon, runestone: findRune, hammer: findHammer, mist: findMist, horn: findHorn, well: findWell, longship: findShip };
  Object.entries(builders).forEach(([id, build]) => { const o = build(svg); o.el ??= svg.querySelector('#f-' + id); o.stage ??= 'rest'; o.kept ??= false; FD.list[id] = o; });
  for (const o of [...Object.values(FD.list), ...FD.list.hoards.items]) {
    if (o.id === 'hoards') continue; o.el.tabIndex=-1; attr(o.el,'aria-hidden',true);
    o.hit = findSvg('circle', { class: 'hit touch-hit', r: .01 }); o.el.insertBefore ? o.el.insertBefore(o.hit, o.el.firstChild) : o.el.appendChild(o.hit);
    o.focusRing = findSvg('circle', { class: 'find-focus-ring', fill: 'none', 'pointer-events': 'none' }); o.el.appendChild(o.focusRing);
  }
  FD.markerHits = [];
  for (const f of Object.values(FIND_BY).filter(f => f.n)) {
    const marker = svg.querySelector('#mk-' + f.id); if (!marker) continue;
    const hit = findSvg('circle', { class: 'hit touch-hit', r: .01, cx: f.mark[0], cy: f.mark[1] }); marker.appendChild(hit); FD.markerHits.push(hit);
    marker.style.cursor = 'pointer'; marker.addEventListener('click', e => { e.stopPropagation(); const target = f.id === 'hoards' ? FD.list.hoards.items[2].el : FD.list[f.id].el; target.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  }
  FD.all = findAll(svg);
  // Builders add non-interactive decorations. The one reusable bit pool remains last.
  const pool = svg.querySelector('#f-bits'); svg.querySelector('#finds').appendChild(pool);
  const capture = e => { if (FD.st?.exploring) { const el = e.target.closest?.('.find'); if (el) el._focusBlocked = false; return; } findCapture(e); };
  for (const type of ['pointermove','pointerup','pointercancel','touchmove']) window.addEventListener(type, capture, {capture:true,passive:false});
  // L5: the finds have their own svg in div#map-stack, so the press capture listens on the stack.
  const root = svg.closest?.('#map-stack') || svg;
  root.addEventListener('click', capture, true); root.addEventListener('keydown', capture, true); root.addEventListener('pointerdown', capture, true);
  window.addEventListener('jm-find-release', findsCloseAll);
  window.addEventListener('jm-destination', () => { FD.pendingPress = null; });
  window.addEventListener('jm-explore', () => { if (!FD.st?.exploring || !document.documentElement.classList.contains('jm-explore')) findsCloseAll(); });
  window.__jm.finds = {
    found: () => [...FD.found],
    state: id => { const o = FD.list[id] || FD.list.hoards.items.find(h => h.id === id); return o ? findPlain(o) : null; },
    hear: () => Object.values(FD.list).forEach(o => o.hear?.()),
    place: id => { const p = findPlace(id); return FD.st && p ? findScreen(p) : null; },
  };
  FD.styleKey = JSON.stringify(FIND_PLAY);
}
export function findsPointer(x, y) { FD.pointer = [x, y]; FD.pointerT = FD.now; }
export function findsFrame(time, st) {
  if (!st) return;
  FD.dt = Math.max(0, Math.min(FIND_PLAY.kit.dt, FD.now ? time - FD.now : 0)); FD.now = time; FD.st = st;
  // A moving camera quiets the finds' idle life inside svg#map, in a glide and in explore alike: each idle write there
  // redrew the held map on every frame of a pinch, a drag or a wheel (phone and PC pinch passes, 2026-11-27).
  const quiet = st.gliding || !!st.exploreMoving;
  const tuning = JSON.stringify(FIND_PLAY);
  if (tuning !== FD.styleKey) { FD.styleKey = tuning; queueMicrotask(findKitStyle); }
  Object.values(FD.list).forEach(o => {
    const f = FIND_BY[o.id], p = findPlace(o.id), rad = o.id === 'wayfinder' ? FIND_PLAY.focus.wide[2] * 2 : o.id === 'hoards' ? Math.max(...FIND_COPY.hoards.map(h => Math.hypot(h.x - f.x, h.y - f.y) + FIND_PLAY.hoard.rad)) : o.id === 'beacon' ? FIND_PLAY.beacon.rad : o.id === 'ravens' ? FIND_PLAY.raven.reach + f.view[2] : o.id === 'serpent' ? FIND_PLAY.serpent.near + f.view[2] : FIND_PLAY[o.id === 'longship' ? 'ship' : o.id]?.rad || f.view?.[2] || FIND_PLAY.kit.rad;
    const near = FIND_PLAY[o.id === 'wayfinder' ? 'way' : o.id === 'ravens' ? 'raven' : o.id === 'runestone' ? 'rune' : o.id === 'longship' ? 'ship' : o.id]?.near || rad;
    const playing = ['flight', 'hear', 'landing', 'reel', 'chase', 'eating', 'waking', 'trace', 'opening', 'sheet', 'closing', 'sliding', 'reply', 'pebble', 'sounding', 'echo', 'pull', 'lifting'].includes(o.stage) || o.drag || o.busy || o.playing || o.hearing;
    const active = o => ['rising','rattling','opening','bouncing','waiting'].includes(o.stage) || o.hold || o.queued || o.pending;
    o.travel?.();
    const paused = quiet && !playing && JOURNEY.focus !== o.id && FD.sheetOwner !== o && !(o.id === 'longship' && o.x !== undefined && (p[0] !== o.x || p[1] !== o.y));
    if (paused && o.id !== 'hoards') { if (o.onScreen && st.rasterRebased) { if (o.id === 'wayfinder') o.compassFrame?.(); o.zoomFrame?.(); } return; } // Keep sky-side pieces, including the beacon beam, at their last state; zoom-led detail follows the map's redraws.
    findLife(o, ...p, o.id === 'horn' && ['sounding', 'echo'].includes(o.stage) ? FIND_PLAY.horn.soundRad : rad, near);
    if (o.id === 'hoards' && quiet) {
      o.items.forEach(h => { if (active(h) || JOURNEY.focus === h.id || FD.sheetOwner === h) h.tick(time, FD.rm ? 0 : FD.dt); });
    } else if (o.id === 'hoards' || o.onScreen || playing || FD.sheetOwner === o) o.tick?.(time, FD.rm ? 0 : FD.dt);
    else if (o.id === 'beacon') depthBeam(null);
  });
  const bits = FD.bits;
  if (quiet) FD.bits = [];
  try { findKitFrame(); } finally { FD.bits = bits; }
  if (!quiet || FD.all.playing) FD.all.tick(time); if (JOURNEY.focus !== FD.focusId) findHint(JOURNEY.focus); FD.focusId = JOURNEY.focus;
}
