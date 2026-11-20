// Round-two numeric gates. These inspect emitted geometry, never rendered pixels.
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { HOME, EASE, dot, quatRotate } from '../../../../public/journey/hero/engine.mjs';
import { corners } from '../kit.mjs';
import { labelLayout, fitCalloutView } from '../labels.mjs';
import { checkLabelRoutes } from './browser-check.mjs';

const rect = pc => { const p = corners(pc); return [Math.min(...p.map(p => p[0])), Math.min(...p.map(p => p[1])), Math.max(...p.map(p => p[0])), Math.max(...p.map(p => p[1]))]; };
const overlap = (a, b) => Math.min(a[2], b[2]) > Math.max(a[0], b[0]) + 1e-8 && Math.min(a[3], b[3]) > Math.max(a[1], b[1]) + 1e-8;
const contains = (a, p) => p[0] > a[0] + 1e-8 && p[0] < a[2] - 1e-8 && p[1] > a[1] + 1e-8 && p[1] < a[3] - 1e-8;
function samePicture(a, b) {
  if (a.art !== b.art) return false;
  const mapping = pc => { const r = rect(pc), [u, v, right, bottom] = pc.window || [0, 0, 1, 1], w = (r[2] - r[0]) / (right - u), h = (r[3] - r[1]) / (bottom - v); return [w, h, r[0] - u * w, r[3] + v * h]; };
  const x = mapping(a), y = mapping(b); return x.every((n, i) => Math.abs(n - y[i]) < 1e-7);
}
const near = (a, b, eps = 1e-7) => Math.abs(a - b) <= eps;
const projection = pc => { const p = corners(pc).map(p => [dot(HOME.r, p), dot(HOME.u, p)]); return [Math.min(...p.map(p => p[0])), Math.min(...p.map(p => p[1])), Math.max(...p.map(p => p[0])), Math.max(...p.map(p => p[1]))]; };
function hull(points) {
  const p = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]), cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  const half = list => { const h = []; for (const p of list) { while (h.length > 1 && cross(h.at(-2), h.at(-1), p) <= 1e-10) h.pop(); h.push(p); } return h; };
  return [...half(p).slice(0, -1), ...half(p.reverse()).slice(0, -1)];
}
export function visibleProjection(pc, cam = HOME) {
  const p = corners(pc), visible = p.filter(p => !pc.clip || dot(pc.clip, p) + pc.clip[3] >= 0);
  if (pc.clip) for (let i = 0; i < 8; i++) for (const bit of [1, 2, 4]) {
    const j = i ^ bit, a = dot(pc.clip, p[i]) + pc.clip[3], b = dot(pc.clip, p[j]) + pc.clip[3];
    if (i < j && a * b < 0) visible.push(p[i].map((v, k) => v + (p[j][k] - v) * a / (a - b)));
  }
  return hull(visible.map(p => [dot(cam.r, p), dot(cam.u, p)]));
}
export function polygonsOverlap(a, b) {
  if (a.length < 3 || b.length < 3) return false;
  for (const poly of [a, b]) for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length], axis = [p[1] - q[1], q[0] - p[0]], values = ps => ps.map(p => p[0] * axis[0] + p[1] * axis[1]), x = values(a), y = values(b);
    if (Math.min(Math.max(...x), Math.max(...y)) - Math.max(Math.min(...x), Math.min(...y)) <= 1e-9) return false;
  }
  return true;
}

export function runCorrections({ fail, frameAt, calloutsAt, SHOW, LOOP, SCREEN, MAT, SCRIPTS, PACE, UI_ROW, playbackSpans, prototypeState, tip }) {
  let previous = tip(frameAt(LOOP - PACE / 240));
  for (let n = 0; n <= Math.ceil(LOOP * 240 / PACE); n++) {
    const time = Math.min(LOOP, n * PACE / 240), p = tip(frameAt(time));
    if (Math.hypot(...p.map((v, i) => v - previous[i])) > 0.3 + 1e-8) fail(time, 'R10: cursor step exceeds 0.3 at 1/240 s');
    previous = p;
  }
  const expected = { id: ['Flyer', 'LinkedIn post', 'Email'], pr: ['YouTube', 'TikTok', 'Instagram'], ae: ['Website', 'Story', 'Feed post'], fig: ['Laptop', 'Tablet', 'Phone'] };
  let start = 0;
  for (const scene of SHOW) {
    const s = SCRIPTS[scene.key], byId = Object.fromEntries(s.actions.map(a => [a.id, a])), spans = playbackSpans(s), isId = scene.key === 'id';
    const ends = isId ? Array(3).fill(byId.export.end) : spans.spans.map(a => a[1]), off = isId ? byId.pickup.start : spans.off[0];
    const seenLabels = new Map(), vanishedFrames = new Set();
    if (isId) for (const [id, profile, style, crop] of [['photo', 'cover', 'coverPhoto', [380 / 1100, 0, 720 / 1100, 1]], ['postPhoto', 'post', 'postPhoto', [0, 0, 1, 1]], ['mailPhoto', 'mail', 'mailPhoto', [300 / 800, 168 / 1180, 456 / 800, 470 / 1180]]]) {
      const a = byId[id], before = frameAt(start + a.end - 1e-7 * PACE).find(pc => pc.photoProfile === profile), after = frameAt(start + a.end + 1e-7 * PACE).find(pc => pc.art === style && !pc.echo);
      if (!before || !after) { fail(start + a.end, 'photo registration: missing carried or styled photograph'); continue; }
      const point = (pc, u, v) => { const r = rect(pc), window = pc.window || [0, 0, 1, 1]; return [r[0] + (u - window[0]) / (window[2] - window[0]) * (r[2] - r[0]), r[3] - (v - window[1]) / (window[3] - window[1]) * (r[3] - r[1]), pc.p[2] + pc.s[2]]; };
      for (const [u, v] of [[0.3, 0.3], [0.7, 0.3], [0.3, 0.7], [0.7, 0.7]]) {
        const p = point(before, u, v), q = point(after, crop[0] + u * crop[2], crop[1] + v * crop[3]);
        if (Math.hypot(dot(HOME.r, p) - dot(HOME.r, q), dot(HOME.u, p) - dot(HOME.u, q)) * 130 > 2) fail(start + a.end, 'photo registration: release shifts the photograph by more than 2 px at 130 px/unit');
      }
    }
    const samples = new Set(Array.from({ length: Math.ceil(scene.len * 120 / PACE) }, (_, i) => i * PACE / 120));
    // R9 records real face births, then revisits every action end and its following 0.1-second frame.
    // Echoes and playback are named at their creation sites; overlays never count as covering artwork.
    const identity = pc => [pc.text?.key || pc.art || pc.tone, ...rect(pc).map(n => n.toFixed(5))].join('/');
    const documentFaces = P => P.filter(pc => !pc.echo && !pc.overlay && !pc.playback && pc.where === 'content' && quatRotate(pc.q, [0, 0, 1])[2] > 1 - 1e-8);
    const births = new Map(), birthTimes = new Set(Array.from({ length: Math.ceil(scene.len * 120 / PACE) }, (_, i) => i * PACE / 120));
    for (const a of s.actions) for (const t of [a.start, a.end, a.end + 0.1 * PACE]) birthTimes.add(t);
    for (const at of [...birthTimes].sort((a, b) => a - b)) {
      if (at >= scene.len - 0.3 * PACE) continue;
      const maker = s.actions.find(a => at >= a.start - 1e-8 && at <= a.end + 1e-8) || s.actions.filter(a => at >= a.end).at(-1);
      for (const pc of documentFaces(frameAt(start + at))) if (!births.has(identity(pc))) births.set(identity(pc), { time: at, action: maker?.id });
    }
    for (const a of s.actions) for (const at of [a.end, a.end + 0.1 * PACE]) {
      if (at >= scene.len - 0.3 * PACE) continue;
      const faces = documentFaces(frameAt(start + at));
      for (const victim of faces.filter(pc => pc.document)) {
        const born = births.get(identity(victim));
        if (born?.action !== a.id) continue;
        const centre = [victim.p[0], victim.p[1]];
        for (const cover of faces.filter(pc => pc.art)) if (cover !== victim && !samePicture(cover, victim) && cover.p[2] + cover.s[2] > victim.p[2] + victim.s[2] + 1e-8 && contains(rect(cover), centre)) {
          const later = births.get(identity(cover));
          if (later && later.time >= born.time - 1e-8) fail(start + at, 'R9: ' + cover.art + ' covers the centre of ' + victim.art + ' made by ' + a.id);
        }
      }
    }
    for (const t of [...ends, off, ...ends.map(t => t + 0.4 * PACE)]) for (const d of [-1e-7, 0, 1e-7]) samples.add(t + d * PACE);
    for (const at of [...samples].filter(t => t >= 0 && t < scene.len).sort((a, b) => a - b)) {
      const time = start + at, P = frameAt(time), labels = calloutsAt(time);
      for (const pc of P) if (['wMake', 'wMove'].includes(pc.art) && !pc.cut && pc.s[2] > 0.0005) fail(time, 'word side faces: opaque word plate retains a visible side');
      if (!expected[scene.key] && labels.length) fail(time, 'R11: labels in a scene with no exports');
      for (const c of labels) {
        const i = expected[scene.key]?.indexOf(c.words);
        if (i < 0 || i === undefined || c.side !== (i === 2 ? 'right' : 'left') || c.level !== (i === 0 ? 'up' : 'low')) { fail(time, 'R11: incorrect label words, side or level'); continue; }
        if (at < ends[i] - 1e-8 || at >= off - 1e-9) fail(time, 'R12: label while its asset moves or is absent');
        const floor = P.filter(pc => pc.where === 'floor' && (isId || pc.device === i));
        if (!floor.length) fail(time, 'R12: label has no asset');
        const landed = frameAt(start + Math.max(...ends) + 0.0001 * PACE).filter(pc => pc.where === 'floor' && (isId || pc.device === i));
        const body = isId ? floor.filter(pc => pc.art === 'kCover' || pc.art === 'post' || pc.art === 'mail') : floor.filter(pc => pc.deviceBody || pc.lid);
        for (const pc of body) if (!landed.some(q => q.art === pc.art && q.s.every((v, j) => near(v, pc.s[j])) && q.p.every((v, j) => near(v, pc.p[j])))) fail(time, 'R12: labelled asset is not in its landed pose');
        const before = seenLabels.get(c.id);
        // E4: the line may only retract during its exit, the last 0.20 s before off; it never grows back there.
        const leaving = at >= off - 0.2 * PACE - 1e-9;
        if (before && !leaving && c.grow < before.grow - 1e-8) fail(time, 'R13: label growth decreased');
        if (before && leaving && c.grow > before.grow + 1e-8) fail(time, 'R13: label grows during its exit');
        if (c.text > 0 && !near(c.grow, 1)) fail(time, 'R13: words precede the completed line');
        if (!(c.grow >= 0 && c.grow <= 1 && c.text >= 0 && c.text <= 1)) fail(time, 'R13: invalid wipe');
        seenLabels.set(c.id, c);
        // Independently reconstruct the specified corner from the actual slab or lid's front face.
        let mark;
        if (scene.key === 'fig' && i === 0) {
          const lid = floor.find(pc => pc.lid), face = floor.find(pc => pc.art === 'chromeLaptop');
          const p = quatRotate(lid.q, [-lid.s[0] + 0.04 + 0.08, lid.s[1] - 0.04 - 0.06, face.s[2]]); mark = p.map((v, j) => v + face.p[j]);
        } else {
          let asset;
          if (isId) asset = floor.filter(pc => pc.art === ['kCover', 'post', 'mail'][i]).sort((a, b) => b.p[1] - a.p[1])[0];
          else asset = floor.find(pc => pc.deviceBody);
          if (!asset) { fail(time, 'R14: no anchor face'); continue; }
          const points = corners(asset), xs = points.map(p => p[0]), zs = points.map(p => p[2]);
          // Closed copies use their full cover; device chrome sits inside the slab rim.
          const left = Math.min(...xs), right = Math.max(...xs), back = Math.min(...zs), front = Math.max(...zs);
          const inset = isId && i > 0 ? (i === 1 ? 0.04 : 0.05) : 0;
          const x = i === 0 ? left + 0.1 : i === 1 ? (left + right) / 2 : right + inset - 0.1, z = i === 1 ? front + inset - 0.06 : back - inset + 0.1;
          const faces = floor.filter(pc => (isId || pc.deviceBody) && quatRotate(pc.q, [0, 0, 1])[1] > 1 - 1e-8 && corners(pc).some(p => near(p[0], x, pc.s[0] * 2 + 1e-7))).filter(pc => { const cs = corners(pc); return x >= Math.min(...cs.map(p => p[0])) - 1e-8 && x <= Math.max(...cs.map(p => p[0])) + 1e-8 && z >= Math.min(...cs.map(p => p[2])) - 1e-8 && z <= Math.max(...cs.map(p => p[2])) + 1e-8; });
          mark = [x, Math.max(...faces.map(pc => pc.p[1] + pc.s[2])), z];
        }
        if (c.mark.some((n, j) => !near(n, mark[j]))) fail(time, 'R14: anchor misses its specified face/corner');
      }
      if (expected[scene.key] && at >= Math.max(...ends) + 0.4 * PACE && at < off && labels.length !== 3) fail(time, 'R11: expected three labels');
      if (isId) for (const id of ['map', 'photo', 'postPhoto', 'mailPhoto']) {
        const overlays = P.filter(pc => pc.emptyFrame === id), moving = P.filter(pc => pc.where === 'travel');
        if (overlays.some(pc => moving.some(q => polygonsOverlap(visibleProjection(pc), visibleProjection(q)) && pc.p[2] + pc.s[2] >= q.p[2] - q.s[2] - 1e-8))) fail(time, 'frame clearance: outline crosses a travelling picture');
        if (at > byId['frame' + ['map', 'photo', 'postPhoto', 'mailPhoto'].indexOf(id)].end && !overlays.length) vanishedFrames.add(id);
        if (vanishedFrames.has(id) && overlays.length) fail(time, 'frame clearance: empty outline returned');
      }
      if (scene.key === 'fig') {
        if (at < spans.land && P.some(pc => pc.art === 'tapDot')) fail(time, 'Figma clock: prototype taps before the shared export clock starts');
        const U = 1.15, panel = SCREEN.w / U - 0.93, top = SCREEN.h / U - 0.54;
        for (const pc of P.filter(pc => pc.canvas)) {
          const r = rect(pc).map((v, i) => (v - (i % 2 ? SCREEN.b : SCREEN.l)) / U);
          if (r[1] < 0.36 + 0.1 - 1e-8) fail(time, 'toolbar clearance: canvas is less than 0.1 above bottom toolbar');
          if (r[0] < 0.9 - 1e-8 || r[2] > panel - 0.1 + 1e-8 || r[3] > top - 0.1 + 1e-8 || r[1] < 0.36 + 0.1 - 1e-8) fail(time, 'canvas clearance: piece reaches a bar or side panel or bottom toolbar');
        }
        const floor = P.filter(pc => pc.where === 'floor'), kinds = new Set(floor.map(pc => pc.deviceKind));
        if (at >= Math.max(...ends) && at < off && (floor.filter(pc => pc.deviceBody).length !== 3 || [...kinds].sort().join(',') !== 'laptop,phone,tablet')) fail(time, 'Figma devices: expected laptop, tablet, phone');
        if (at >= Math.max(...ends) && at < off) {
          const xs = floor.flatMap(corners).map(p => p[0]);
          if (Math.abs((Math.min(...xs) + Math.max(...xs)) / 2 - (SCREEN.l + SCREEN.w / 2)) > 0.001) fail(time, 'Figma centring: complete footprint left the screen middle');
          const bodies = [0, 1, 2].map(i => floor.find(pc => pc.device === i && pc.deviceBody)), lid = floor.find(pc => pc.art === 'chromeLaptop');
          const widths = [lid.s[0] * 2, ...bodies.slice(1).map(pc => pc.s[0] * 2 - 0.12)];
          if (!near(lid.s[0] / lid.s[1], 1.6) || !near(widths[1] / (bodies[1].s[1] * 2 - 0.12), 3 / 4) || !near(widths[2] / (bodies[2].s[1] * 2 - 0.12), 9 / 19.5) || widths[0] <= Math.max(...widths.slice(1))) fail(time, 'Figma device geometry: wrong screen ratios or picture sizes');
          const gaps = [bodies[1].p[0] - bodies[1].s[0] - bodies[0].p[0] - bodies[0].s[0], bodies[2].p[0] - bodies[2].s[0] - bodies[1].p[0] - bodies[1].s[0]];
          const zs = floor.flatMap(corners).map(p => p[2]);
          if (!near(gaps[0], gaps[1]) || Math.min(...zs) < MAT.z + UI_ROW.forward - 1e-8 || Math.max(...zs) > MAT.z + UI_ROW.forward + 1.8 + 1e-8 || Math.min(...xs) < MAT.x - 1e-8 || Math.max(...xs) > MAT.x + MAT.w + 1e-8) fail(time, 'Figma device geometry: unequal gaps or excessive footprint');
        }
        for (const lid of floor.filter(pc => pc.lid)) {
          // Clip the returning lid's box at the slot before testing its visible outline.
          const p = visibleProjection(lid);
          if (p.length) {
            const targets = P.filter(pc => pc.canvas || pc.art === 'export' || pc.deviceKind === 'tablet');
            if (targets.some(pc => polygonsOverlap(p, visibleProjection(pc)))) fail(time, 'laptop clearance: lid overlaps canvas, Export or tablet');
          }
        }
      }
    }
    if (expected[scene.key]) {
      if (calloutsAt(start + off).length || calloutsAt(start + off - 1e-7 * PACE).length !== 3) fail(start + off, 'R13: labels do not cut out together');
      if (seenLabels.size !== 3) fail(start, 'R11: missing label identities');
    }
    start += scene.len;
  }
  const figStart = SHOW.slice(0, 5).reduce((sum, s) => sum + s.len, 0), timing = playbackSpans(SCRIPTS.fig);
  // R15 follows each cursor-made frame through its own contact and same-frame placement.
  const idStart = SHOW.slice(0, 2).reduce((sum, s) => sum + s.len, 0), idScript = SCRIPTS.id;
  for (const [i, id, profile, arts] of [[0, 'map', null, ['kMap']], [1, 'photo', 'cover', ['coverPhoto', 'coverBlob', 'coverDecor', 'kCover']], [2, 'postPhoto', 'post', ['postPhoto', 'kPost']], [3, 'mailPhoto', 'mail', ['mailPhoto', 'eblast']]]) {
    const draw = idScript.actions.find(a => a.id === 'frame' + i), place = idScript.actions.find(a => a.id === id);
    const made = frameAt(idStart + draw.end + 1e-7 * PACE).filter(pc => pc.emptyFrame === id).map(rect);
    const target = [Math.min(...made.map(r => r[0])), Math.min(...made.map(r => r[1])), Math.max(...made.map(r => r[2])), Math.max(...made.map(r => r[3]))].map((n, k) => n + (k < 2 ? 1 : -1) * 0.005 * 1.15);
    const samples = new Set(Array.from({ length: 2181 }, (_, n) => (1 + n * 0.005) * PACE));
    samples.add(6.329 * PACE); // The incoming post-frame fault at global 25.229 s.
    for (const t of [draw.start, draw.end, place.start, place.end]) for (const d of [-1e-7, 0, 1e-7]) samples.add(t + d * PACE);
    let contacted = false;
    for (const at of [...samples].sort((a, b) => a - b)) {
      if (at <= draw.start + 1e-9 || at > 11.9 * PACE) continue;
      const time = idStart + at, P = frameAt(time), overlays = P.filter(pc => pc.emptyFrame === id), plates = P.filter(pc => pc.framePlate === id);
      const own = P.filter(pc => pc.where === 'travel' && (profile ? pc.photoProfile === profile : pc.art === 'kMap'));
      const padded = target.map((n, k) => n + (k < 2 ? -1 : 1) * 0.03 * 1.15);
      contacted ||= at >= place.end - 1e-9 || own.some(pc => overlap(rect(pc), padded));
      if (!contacted && overlays.length !== 6) fail(time, 'R15: ' + id + ' frame vanished before its own contact');
      if (contacted && overlays.length) fail(time, 'R15: ' + id + ' frame survives its own contact');
      const plateCount = i === 0 ? 2 : 1;
      const validPlates = plates.length === plateCount;
      if (at < place.end - 1e-9 && !validPlates) fail(time, 'R15: ' + id + ' plate vanished before placement');
      const replacement = P.some(pc => pc.where === 'content' && !pc.echo && arts.includes(pc.art));
      if (at >= place.end - 1e-9 && !plates.length && !replacement) fail(time, 'R15: ' + id + ' plate disappeared without a same-frame replacement');
      for (const line of P.filter(pc => pc.emptyFrame)) for (const moving of P.filter(pc => pc.where === 'travel')) if (polygonsOverlap(visibleProjection(line), visibleProjection(moving)) && line.p[2] + line.s[2] >= moving.p[2] - moving.s[2] - 1e-8) fail(time, 'frame clearance: overlay above travelling InDesign picture');
    }
  }
  let fixedSamples = 0, windowStart = 0;
  for (const scene of SHOW) {
    if (['id', 'pr', 'ae', 'fig'].includes(scene.key)) {
      const s = SCRIPTS[scene.key], spans = playbackSpans(s), end = scene.key === 'id' ? s.actions.find(a => a.id === 'pickup').start : spans.off[0];
      const begin = scene.key === 'id' ? s.actions.find(a => a.id === 'export').end : spans.land;
      const reference = new Map(); let low;
      for (let at = begin; at < end - 1e-9; at += PACE / 60) {
        const labels = calloutsAt(windowStart + at); fixedSamples++;
        for (const c of labels) {
          const prior = reference.get(c.id);
          if (prior && c.mark.some((n, j) => !near(n, prior[j], 1e-9))) fail(windowStart + at, 'fixed marks: playback moved an asset anchor');
          reference.set(c.id, c.mark);
        }
        if (labels.length === 3) {
          const level = Math.min(...labels.filter(c => c.level === 'low').map(c => dot(HOME.u, c.mark)));
          if (low !== undefined && !near(low, level, 1e-9)) fail(windowStart + at, 'fixed marks: common low level moved');
          low = level;
        }
      }
    }
    windowStart += scene.len;
  }
  const held = frameAt(figStart + timing.off[0]);
  const pose = (P, offset) => P.filter(pc => pc.device !== undefined).map(pc => ({ art: pc.art, window: pc.window, s: pc.s, p: pc.p.map((n, i) => i === 2 ? n - offset : n) }));
  for (let at = timing.off[0]; at < timing.off[1] - 1e-8; at += PACE / 60) {
    const P = frameAt(figStart + at), base = held.find(pc => pc.deviceBody), body = P.find(pc => pc.deviceBody);
    const a = pose(held, 0), b = pose(P, body.p[2] - base.p[2]);
    if (P.some(pc => pc.device !== undefined && pc.art === 'tapDot')) fail(figStart + at, 'Figma return: a new prototype tap started during withdrawal');
    if (a.length !== b.length || a.some((pc, i) => pc.art !== b[i].art || JSON.stringify(pc.window) !== JSON.stringify(b[i].window) || pc.s.some((n, j) => !near(n, b[i].s[j])) || pc.p.some((n, j) => !near(n, b[i].p[j])))) fail(figStart + at, 'Figma return: a new prototype frame started during withdrawal');
  }
  const picture = pieces => JSON.stringify(pieces.filter(pc => pc.playback && !pc.progressRail).map(pc => [pc.art, pc.tone, pc.window, pc.p, pc.s]));
  for (let n = 0; n < 300; n++) {
    const at = n / 100, first = frameAt(figStart + timing.land + at * PACE), second = frameAt(figStart + timing.land + ((at + 0.6) % 3) * PACE);
    for (let i = 0; i < 3; i++) {
      if (picture(first.filter(pc => pc.device === i)) === picture(second.filter(pc => pc.device === i))) fail(figStart + timing.land + at, 'Figma motion: device picture unchanged after 0.6 s');
      // Each canvas design is a distinct viewport, not a single changed frame standing in for the group.
      const left = SCREEN.l + (i === 0 ? 1.020821070234 : i === 1 ? 2.536821070234 : 3.321821070234) * 1.15;
      const right = left + [1.376, 0.645, 0.86 * 9 / 19.5][i] * 1.15;
      const inDesign = pc => pc.canvas && pc.p[0] >= left - 1e-5 && pc.p[0] <= right + 1e-5 && pc.p[1] < SCREEN.b + 1.4 * 1.15;
      if (picture(first.filter(inDesign)) === picture(second.filter(inDesign))) fail(figStart + timing.land + at, 'Figma motion: canvas design unchanged after 0.6 s');
    }
  }
  const points = SHOW.flatMap((scene, i) => frameAt(SHOW.slice(0, i).reduce((n, s) => n + s.len, 0) + scene.still).flatMap(corners)).map(p => [dot(HOME.r, p), dot(HOME.u, p)]);
  const xs = points.map(p => p[0]), ys = points.map(p => p[1]), need = { w: Math.max(...xs) - Math.min(...xs) + 0.5, h: Math.max(...ys) - Math.min(...ys) + 0.5, x: (Math.max(...xs) + Math.min(...xs)) / 2, y: (Math.max(...ys) + Math.min(...ys)) / 2 };
  // These are parametric layout checks, including conservative word widths. Actual DOM/font boxes belong to browser-check.
  for (const [W, H, b] of [[390, 664, [0, 64, 390, 240]], [390, 664, [0, 64, 390, 280]], [390, 844, [0, 64, 390, 396]], [360, 780, [0, 64, 360, 366.6]], [375, 667, [0, 64, 375, 313.49]], [412, 915, [0, 64, 412, 430.05]], [768, 1024, [337.92, 88, 390.08, 864]], [1440, 900, [633.6, 88, 742.4, 740]], [1920, 1080, [844.8, 88, 1011.2, 920]]]) for (const widthFactor of [0.55, 0.65, 0.75]) {
    const S = Math.min(b[2] / need.w, b[3] / need.h), size = S < 70 ? 9 : 11;
    const initial = { W, H, S, cx: b[0] + b[2] / 2 - S * need.x, cy: b[1] + b[3] / 2 + S * need.y, cam: HOME };
    const view = fitCalloutView(initial, need, b[0], 9 * size * widthFactor);
    let start = 0;
    for (const scene of SHOW) {
      const time = start + (scene.key === 'id' ? SCRIPTS.id.actions.find(a => a.id === 'export').end + 0.41 * PACE : scene.still), data = calloutsAt(time), pieces = frameAt(time);
      const widths = Object.fromEntries(data.map(c => [c.id, c.words.length * size * widthFactor]));
      const obstacles = W < 720 ? [{ left: 16, right: W - 16, top: b[1] + b[3] + 8, bottom: H - 35 }] : [];
      const layout = labelLayout(data, pieces, view, widths, obstacles, false, time);
      try { checkLabelRoutes(layout, view.S, 'parametric ' + W + '/' + time); } catch (error) { fail(time, error.message); }
      for (const c of layout) {
        if (c.label.left < 16 - 1e-7 || c.label.right > W - 16 + 1e-7 || c.points.some(p => p[0] < 16 - 1e-7 || p[0] > W - 16 + 1e-7)) fail(time, 'label layout: word or line crosses a side gutter');
        const elbow = c.points[1], end = c.points[2];
        if (c.side === 'right' ? Math.max(elbow[0], end[0]) > c.label.left - 0.5 : Math.min(elbow[0], end[0]) < c.label.right + 0.5) fail(time, 'label layout: horizontal leader crosses its own words');
        if (obstacles.some(r => c.label.left < r.right && c.label.right > r.left && c.label.top < r.bottom && c.label.bottom > r.top)) fail(time, 'label layout: words overlap modelled page content');
      }
      const still = labelLayout(data, pieces, view, widths, obstacles, true, time);
      if (still.some(c => c.angle !== 0)) fail(time, 'label layout: reduced-motion ring rotates');
      start += scene.len;
    }
  }
  const allPoints = [];
  for (let at = 0; at < LOOP; at += PACE / 30) for (const pc of frameAt(at)) for (const p of corners(pc)) if (!pc.clip || p.reduce((sum, n, i) => sum + n * pc.clip[i], pc.clip[3]) >= 0) allPoints.push(dot(HOME.r, p));
  const leftmost = allPoints.reduce((n, v) => Math.min(n, v), Infinity), rightmost = allPoints.reduce((n, v) => Math.max(n, v), -Infinity);
  for (let W = 280; W <= 720; W++) {
    const S = Math.min(W / need.w, 396 / need.h);
    const view = fitCalloutView({ W, H: 844, S, cx: W / 2 - S * need.x, cy: 262 + S * need.y, cam: HOME }, need, 0, 65);
    if (view.cx + view.S * leftmost < 16 - 1e-7 || view.cx + view.S * rightmost > W - 16 + 1e-7) fail(0, 'stage gutters: stage crossed a 16 px side gutter at width ' + W);
  }
  console.log('R9–R15 sampled: occlusion, cursor continuity, labels, landed faces, wipes; R15 frames/plates at 0.005 s; fixed marks at 60 Hz (' + fixedSamples + ' samples); Figma devices, 0.6 s pictures, frozen return, canvas/toolbar/lid clearance; stage gutters 280–720');
}
// Direct use initializes the same atlas/player fixtures in a child to avoid an ESM entry-point cycle.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const run = spawnSync(process.execPath, [fileURLToPath(new URL('./checks.mjs', import.meta.url)), ...process.argv.slice(2)], { stdio: 'inherit', windowsHide: true });
  process.exitCode = run.status ?? 1;
}
