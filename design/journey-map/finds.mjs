// Eleven finds share the camera/life/overlay kit.
import { FINDS, FIND_COPY, FIND_PLAY, FIND_TIMING } from './data.mjs';
import { toScreen } from './trip.mjs';
import { JOURNEY } from './steps.mjs';
import { depthBeam } from './depth.mjs';
import { FD, FIND_BY, findKitBuild, findKitFrame, findCapture, findPlace, findLife, closePop, closeSheet, findKitStyle, findHint } from './findkit.mjs';
import { findWay, findHoards } from './findhoards.mjs';
import { findRavens, findSerpent } from './findcreatures.mjs';
import { findBeacon, findRune } from './findsheets.mjs';
import { findBoard } from './findboard.mjs';
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
  const builders = { wayfinder: findWay, hoards: findHoards, ravens: findRavens, serpent: findSerpent, beacon: findBeacon, runestone: findRune, tafl: findBoard, mist: findMist, horn: findHorn, well: findWell, longship: findShip };
  Object.entries(builders).forEach(([id, build]) => { const o = build(svg); o.el ??= svg.querySelector('#f-' + id); o.stage ??= 'rest'; o.kept ??= false; FD.list[id] = o; });
  FD.all = findAll(svg);
  // Builders add non-interactive decorations. The one reusable bit pool remains last.
  const pool = svg.querySelector('#f-bits'); svg.querySelector('#finds').appendChild(pool);
  svg.addEventListener('click', findCapture, true); svg.addEventListener('keydown', findCapture, true); svg.addEventListener('pointerdown', findCapture, true);
  window.addEventListener('jm-find-release', findsCloseAll);
  window.addEventListener('jm-mode', () => { findsCloseAll(); FD.focusId = null; });
  window.__jm.finds = {
    found: () => [...FD.found],
    state: id => { const o = FD.list[id] || FD.list.hoards.items.find(h => h.id === id); return o ? findPlain(o) : null; },
    hear: () => Object.values(FD.list).forEach(o => o.hear?.()),
    place: id => { const p = findPlace(id); return FD.st && p ? toScreen(FD.st, p) : null; },
  };
  FD.styleKey = JSON.stringify(FIND_PLAY);
}
export function findsPointer(x, y) { FD.pointer = [x, y]; FD.pointerT = FD.now; }
export function findsFrame(time, st) {
  if (!st) return;
  FD.dt = Math.max(0, Math.min(FIND_PLAY.kit.dt, FD.now ? time - FD.now : 0)); FD.now = time; FD.st = st;
  const tuning = JSON.stringify(FIND_PLAY);
  if (tuning !== FD.styleKey) { FD.styleKey = tuning; queueMicrotask(findKitStyle); }
  Object.values(FD.list).forEach(o => {
    const f = FIND_BY[o.id], p = findPlace(o.id), rad = o.id === 'wayfinder' ? FIND_PLAY.focus.wide[2] * 2 : o.id === 'hoards' ? Math.max(...FIND_COPY.hoards.map(h => Math.hypot(h.x - f.x, h.y - f.y) + FIND_PLAY.hoard.rad)) : o.id === 'beacon' ? FIND_PLAY.beacon.rad : o.id === 'ravens' ? FIND_PLAY.raven.reach + f.view[2] : o.id === 'serpent' ? FIND_PLAY.serpent.near + Math.abs(FIND_PLAY.serpent.spots[1][0] - f.x) + f.view[2] : FIND_PLAY[o.id === 'longship' ? 'ship' : o.id]?.rad || f.view?.[2] || FIND_PLAY.kit.rad;
    const near = FIND_PLAY[o.id === 'wayfinder' ? 'way' : o.id === 'ravens' ? 'raven' : o.id === 'runestone' ? 'rune' : o.id === 'longship' ? 'ship' : o.id]?.near || rad;
    findLife(o, ...p, o.id === 'horn' && ['sounding', 'echo'].includes(o.stage) ? FIND_PLAY.horn.soundRad : rad, near);
    const playing = ['flight', 'hear', 'landing', 'reel', 'chase', 'eating', 'waking', 'trace', 'opening', 'sheet', 'closing', 'sliding', 'reply', 'pebble', 'sounding', 'echo', 'pull', 'lifting'].includes(o.stage) || o.drag || o.busy || o.playing || o.hearing;
    if (o.id === 'hoards' || o.onScreen || playing || FD.sheetOwner === o) o.tick?.(time, FD.rm ? 0 : FD.dt);
    else if (o.id === 'beacon') depthBeam(null);
  });
  findKitFrame(); FD.all.tick(time); if (JOURNEY.focus !== FD.focusId) findHint(JOURNEY.focus); FD.focusId = JOURNEY.focus;
}
