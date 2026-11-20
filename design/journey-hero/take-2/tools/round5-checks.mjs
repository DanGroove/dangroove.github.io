// CORRECTIONS-5: computed evidence only. No browser, font rasterisation or pixel assertions.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { inflateRawSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { HOME, makeCamera, dot, quatRotate, EASE } from '../../../../public/journey/hero/engine.mjs';
import { HAND, SHOW, LOOP, SCRIPTS, SCENES, SCREEN, MAT, PACE, UI_ROW, frameAt, calloutsAt, playbackSpans } from '../stage.mjs';
import { corners } from '../kit.mjs';
import { centreScene, sideGutter, stageTarget, equivalent, pointerFloor, redDot, sceneEnvelope } from '../view.mjs';
import { fitCalloutView, labelLayout } from '../labels.mjs';
import { visibleProjection, polygonsOverlap } from './correction-checks.mjs';
import { BROWSER_SIZES, checkLabelRoutes } from './browser-check.mjs';
import { createFloorHover } from '../floor-hover.mjs';
import { handPatch } from './hand-patch.mjs';

const take = new URL('../', import.meta.url);
const fixture = JSON.parse(fs.readFileSync(new URL('fixtures/round5-source.json', import.meta.url)));
const starts = show => show.map((_, i) => show.slice(0, i).reduce((n, s) => n + s.len, 0));
const times = starts(SHOW);
const round = value => JSON.parse(JSON.stringify(value, (_k, v) => typeof v === 'number' ? Math.round(v * 1e8) / 1e8 : v));
const close = (a, b, message, epsilon = 1e-8) => assert.ok(Math.abs(a - b) <= epsilon, `${message}: ${a} != ${b}`);
const emitted = (module, time) => module.frameAt(time).filter(pc => pc.art !== 'cursor');
const stageSource = fs.readFileSync(new URL('../stage.mjs', import.meta.url), 'utf8');

async function reference() {
  const raw = inflateRawSync(Buffer.from(fixture.deflateBase64, 'base64')).toString('utf8');
  assert.equal(fixture.sha256, 'fc33a53c13659008a0d3c3b6a86ff4091c26e985e79402561cf3261b94815ec6');
  assert.equal(createHash('sha256').update(raw).digest('hex'), fixture.sha256, 'round 4 fixture hash');
  const resolve = source => source.replace(/from (['"])([^'"]+)\1/g, (_, q, ref) => 'from ' + q + new URL(ref, take).href + q);
  // CORRECTIONS-7: round 7's hand edit is applied in memory; the hash above is still of the frozen bytes.
  const stageURL = 'data:text/javascript;base64,' + Buffer.from(resolve(handPatch(raw))).toString('base64');
  const module = await import(stageURL);
  const labels = inflateRawSync(Buffer.from(fixture.labels.deflateBase64, 'base64')).toString('utf8');
  assert.equal(fixture.labels.sha256, 'f3b14cc19650b455e9a33bc8cf012b384aae2bd38c13b3c5d840567c582596a3');
  assert.equal(createHash('sha256').update(labels).digest('hex'), fixture.labels.sha256, 'round 4 labels hash');
  const labelURL = 'data:text/javascript;base64,' + Buffer.from(resolve(labels).replace(new URL('../stage.mjs', import.meta.url).href, stageURL)).toString('base64');
  return { module, labels: await import(labelURL) };
}

export async function checkRound5(only = '') {
  const enabled = key => !only || only === key;
  const before = await reference(), old = before.module, oldStarts = starts(old.SHOW);
  const report = { reference: fixture.sha256, computedOnly: true };
  if (enabled('H1')) {
    const a = SCRIPTS.id.actions.find(a => a.id === 'frame0'), start = times[2];
    // Literal identical pieces at the requested boundary; the cursor alone is excluded.
    assert.deepEqual(emitted({ frameAt }, start + a.end - 0.0005), emitted({ frameAt }, start + a.end + 0.0005), 'H1 spread: release swaps non-cursor pieces');
    const final = frameAt(start + a.end + 0.0005).filter(pc => pc.framePlate === 'map' || pc.emptyFrame === 'map');
    const pages = final.filter(pc => pc.framePlate), points = pages.flatMap(corners);
    const left = Math.min(...points.map(p => p[0])), right = Math.max(...points.map(p => p[0])), top = Math.max(...points.map(p => p[1])), bottom = Math.min(...points.map(p => p[1]));
    let samples = 0;
    for (let t = a.start + 0.005; t < a.end + 0.000001; t += 0.005) {
      const p = HAND((Math.min(t, a.end) - a.start) / (a.end - a.start)); // frame0 is drawn by the hand (CORRECTIONS-7 K1)
      const pieces = frameAt(start + t).filter(pc => pc.framePlate === 'map' || pc.emptyFrame === 'map');
      assert.equal(pieces.length, 8, 'H1 spread: missing lasting page/frame pieces');
      for (const pc of pieces) for (const c of corners(pc)) assert.ok(c[0] >= left - 1e-8 && c[0] <= left + (right - left) * p + 1e-8 && c[1] <= top + 1e-8 && c[1] >= top - (top - bottom) * p - 1e-8, 'H1 spread: corner outside growing rectangle');
      samples++;
    }
    let draws = 0;
    for (let i = 0; i < SHOW.length; i++) for (const a of SCRIPTS[SHOW[i].key].actions.filter(a => a.kind === 'draw')) {
      if (i === 2 && a.id === 'frame0') { draws++; continue; }
      const prior = old.SCRIPTS[SHOW[i].key].actions.find(b => b.id === a.id);
      for (const delta of [-0.005, -0.0005, 0.0005, 0.005]) {
        // The incoming build already substitutes some construction/echo representations at release.
        // Compare both actual piece arrays to that frozen evidence, rather than silently exempting them.
        equivalent(emitted({ frameAt }, times[i] + a.end + delta), emitted(old, oldStarts[i] + prior.end + delta), `H1 draw comparison: ${SHOW[i].key}/${a.id}/${delta}`);
      }
      draws++;
    }
    report.H1 = { draws, growingSamples: samples, spreadBoundary: 'exact non-cursor identity', otherDraws: 'both sides unchanged from round 4, numeric tolerance 1e-8' };
  }
  if (enabled('H2')) {
    // CORRECTIONS-7: derived, not typed. The round-4 scripts (scheduled with round 7's hand, in memory) plus
    // round 5's 1.8 s longer InDesign landing hold give the loop and the scene starts (83.04 s before round 7).
    close(LOOP, old.LOOP + 1.8 * PACE, 'H2 loop'); assert.equal(PACE, 1, 'H2 pace');
    close(LOOP, SHOW.reduce((n, s) => n + s.len, 0), 'H2 loop is the scenes');
    assert.deepEqual(round(times), round(oldStarts.map((t, i) => t + (i > 2 ? 1.8 * PACE : 0))), 'H2 starts');
    const land = SCRIPTS.id.actions.find(a => a.id === 'land');
    close(land.end - land.start, 3, 'H2 InDesign landing hold');
    for (let i = 0; i < SHOW.length; i++) {
      const key = SHOW[i].key;
      for (const a of SCRIPTS[key].actions) {
        const prior = old.SCRIPTS[key].actions.find(b => b.id === a.id), shift = key === 'id' && a.start >= land.end - 1e-8 ? 1.8 : 0;
        close(a.start, prior.start + shift, 'H2 action start ' + key + '/' + a.id);
        close(a.end, prior.end + (key === 'id' && a.end >= land.end - 1e-8 ? 1.8 : 0), 'H2 action end ' + key + '/' + a.id);
      }
      close(SHOW[i].still, old.SHOW[i].still + (i === 2 ? 1.8 : 0), 'H2 local still');
      if (i < 5) equivalent(SCENES[i](), old.SCENES[i](), 'H2 retained still picture');
      else equivalent(SCENES[i]().filter(pc => pc.where !== 'floor'), old.SCENES[i]().filter(pc => pc.where !== 'floor'), 'H2 Figma canvas still');
      if (i >= 3) assert.deepEqual(playbackSpans(SCRIPTS[key]), old.playbackSpans(old.SCRIPTS[key]), 'H2 row playback changed');
    }
    for (let t = land.start + 1e-7; t < land.end - 1e-8; t += 0.005) assert.equal(calloutsAt(times[2] + t).length, 3, 'H2 label hold shortened');
    assert.equal(calloutsAt(times[2] + land.end).length, 0, 'H2 labels survive pickup');
    report.H2 = { loop: LOOP, starts: times, stillLocal: SHOW.map(s => s.still), stillGlobal: SHOW.map((s, i) => times[i] + s.still), labelHold: land.end - land.start };
  }
  if (enabled('H3')) {
    const timing = playbackSpans(SCRIPTS.fig), t = times[5] + timing.spans[2][1] + 0.01;
    const P = frameAt(t), floor = P.filter(pc => pc.where === 'floor'), lid = floor.find(pc => pc.lid), face = floor.find(pc => pc.art === 'chromeLaptop');
    const u = quatRotate(lid.q, [1, 0, 0]), v = quatRotate(lid.q, [0, 1, 0]), n = quatRotate(lid.q, [0, 0, 1]);
    assert.ok(u[0] > 1 - 1e-8 && n[2] > 0.97 && Math.abs(n[0]) < 1e-8, 'H3 orientation: lid must face +z with unmirrored +x picture');
    close(Math.atan2(-v[2], v[1]) * 180 / Math.PI, 12, 'H3 lean');
    const c = calloutsAt(t).find(c => c.words === 'Laptop');
    const anchor = quatRotate(face.q, [-face.s[0] + 0.08, face.s[1] - 0.06, face.s[2]]).map((n, i) => n + face.p[i]);
    c.mark.forEach((n, i) => close(n, anchor[i], 'H3 laptop label top-left corner'));
    const previousFloor = old.SCENES[5]().filter(pc => pc.where === 'floor');
    const currentFloor = SCENES[5]().filter(pc => pc.where === 'floor');
    const rowShift = currentFloor.find(pc => pc.device === 1).p[0] - previousFloor.find(pc => pc.device === 1).p[0];
    for (const device of [1, 2]) {
      const prior = previousFloor.filter(pc => pc.device === device).map(pc => ({ ...pc, p: pc.p.map((n, i) => n + (i === 0 ? rowShift : i === 2 ? UI_ROW.forward : 0)), clip: pc.clip.map((n, i) => n - (i === 3 ? UI_ROW.forward : 0)) }));
      equivalent(currentFloor.filter(pc => pc.device === device), prior, 'H3 tablet/phone changed beyond shared row recentering and H10 forward shift');
    }
    let samples = 0;
    for (const [from, to] of [timing.spans[0], [timing.spans[2][1], timing.off[0]], timing.off]) for (let at = from; at <= to; at += 0.005) {
      const parts = frameAt(times[5] + at), body = parts.filter(pc => pc.device === 0), lid = body.find(pc => pc.lid);
      if (!lid) continue;
      const outline = visibleProjection(lid);
      for (const pc of parts.filter(pc => pc.canvas || pc.art === 'export' || pc.deviceKind === 'tablet' || pc.deviceKind === 'phone')) assert.ok(!polygonsOverlap(outline, visibleProjection(pc)), 'H3 lid hides canvas, toolbar or another device');
      if (at < timing.spans[0][1]) for (const pc of body) { assert.ok(!pc.clip, 'H3 entry clipped'); const landed = floor.find(q => q.device === 0 && q.art === pc.art && q.lid === pc.lid && q.deviceBody === pc.deviceBody && q.s.every((v, i) => Math.abs(v - pc.s[i]) < 1e-9)); if (pc.lid || pc.deviceBody) { close(pc.p[0] - landed.p[0], -1.6 * (1 - EASE.enter((at - from) / (to - from))), 'H3 same-object x entry'); close(pc.p[2], landed.p[2], 'H3 entry z'); } }
      if (at >= timing.spans[2][1] && at <= timing.off[0]) {
        const xs = parts.filter(pc => pc.where === 'floor').flatMap(corners).map(p => p[0]);
        close((Math.min(...xs) + Math.max(...xs)) / 2, SCREEN.l + SCREEN.w / 2, 'H3 complete row centre');
      }
      samples++;
    }
    report.H3 = { samples, lidU: u, lidV: v, lidNormal: n, labelMark: c.mark, tabletPhoneRowShift: rowShift };
  }
  if (enabled('H6')) {
    const need = sceneEnvelope(SCENES, corners, dot, HOME), priorNeed = sceneEnvelope(old.SCENES, corners, dot, HOME);
    const widths = { small: {}, large: {} };
    for (let i = 0; i < SHOW.length; i++) for (const c of calloutsAt(times[i] + (i === 2 ? SCRIPTS.id.actions.find(a => a.id === 'land').start + 0.41 : SHOW[i].still))) for (const [key, size] of [['small', 9], ['large', 11]]) widths[key][c.id] = c.words.length * size * 0.75;
    // These are CSS-derived stage boxes and conservative word models, not browser layout measurements.
    const textEdge = W => W < 720 ? W - 16 : sideGutter(W) + Math.min(468, 0.36 * W - 1);
    const model = (W, H, envelope, fit, centred, edge = textEdge(W)) => {
      const phoneHeights = { '390x664': 240, '390x844': 396, '360x780': 366.6, '375x667': 313.49, '412x915': 430.05 };
      const pad = centred ? sideGutter(W) : W < 1200 ? 40 : 64, b = W < 720 ? [0, 64, W, phoneHeights[W + 'x' + H]] : [W * 0.44, 88, W * 0.56 - pad, Math.max(H, 640) - 160];
      const S = Math.min(b[2] / envelope.w, b[3] / envelope.h), view = { W, H, S, cx: b[0] + b[2] / 2 - S * envelope.x, cy: b[1] + b[3] / 2 + S * envelope.y, cam: HOME };
      return fit(centred ? centreScene(view, envelope, edge) : view, envelope, b[0], widths);
    };
    const sizes = BROWSER_SIZES.map(([W, H]) => {
      const a = model(W, H, priorNeed, before.labels.fitCalloutView, false), b = model(W, H, need, fitCalloutView, true);
      assert.ok(b.S >= a.S * 0.98, 'H6 scene shrank more than 2% at ' + W + 'x' + H);
      return { W, H, beforeS: a.S, afterS: b.S, beforeScene: [(priorNeed.w - 0.5) * a.S, (priorNeed.h - 0.5) * a.S], afterScene: [(need.w - 0.5) * b.S, (need.h - 0.5) * b.S] };
    });
    const sideSpaces = [];
    for (const [W, H, edge] of [[1280, 800, 501], [1920, 1080, 531], [2560, 1440, 531]]) {
      const c = model(W, H, need, fitCalloutView, true, edge), left = c.cx + c.S * need.bounds[0], right = c.cx + c.S * need.bounds[1];
      close(left - edge, W - right, 'H6 equal side spaces');
      const target = stageTarget(c, need, W * 0.44, W - sideGutter(W));
      assert.ok(target.left <= left && target.left + target.width >= right, 'H6 stage target misses the scene');
      sideSpaces.push({ W, H, textRight: edge, left: left - edge, right: W - right });
    }
    let continuitySamples = 0, maxStep = 0;
    // Sweep the actual fit, including both columns. The take-two gutter removes the old CSS jump.
    for (const H of [640, 900, 1440]) {
      let previous;
      for (let W = 720; W <= 2560; W += 10) {
        const view = model(W, H, need, fitCalloutView, true), centre = view.cx + view.S * need.x;
        const a = model(Math.max(720, W - 0.0001), H, need, fitCalloutView, true), b = model(W + 0.0001, H, need, fitCalloutView, true);
        assert.ok(Math.abs(a.cx - b.cx) < 0.001 && Math.abs(a.S - b.S) < 0.001, 'H6 discontinuity at ' + W + 'x' + H);
        if (previous) { maxStep = Math.max(maxStep, Math.abs(centre - previous.centre)); assert.ok(Math.abs(centre - previous.centre) <= 12 && Math.abs(view.S - previous.S) < 2, 'H6 discontinuous 10px step'); }
        previous = { centre, S: view.S }; continuitySamples++;
      }
    }
    const css = fs.readFileSync(new URL('../take-2.css', import.meta.url), 'utf8');
    assert.ok(css.includes('--pad: clamp(40px, calc(30vw - 296px), 64px)'), 'H6 CSS gutter differs from continuous model');
    report.H6 = { beforeEnvelope: priorNeed, afterEnvelope: need, sizes, sideSpaces, continuitySamples, maxStep, limits: 'CSS/font ink and full label/DOM fitting need external browser review' };
  }
  if (enabled('H7')) {
    let rays = 0, dots = 0;
    for (const cam of [HOME, makeCamera(-23, 14), makeCamera(31, -12)]) for (const S of [35, 70, 130]) for (const x of [-4, -0.2, 0, 1.5, 4]) for (const z of [-3, 0, 2.2, 5]) {
      const p = [x, 0, z], view = { S, cx: 722, cy: 481, cam }, at = pointerFloor(view.cx + S * dot(cam.r, p), view.cy - S * dot(cam.u, p), view);
      at.forEach((n, i) => close(n, p[i], 'H7 current-view ray/floor point')); rays++;
    }
    for (const pointer of [null, [0, 0, 0], [0.21, 0, -0.14], [1.4, 0, 2.3]]) for (let ix = -8; ix <= 8; ix++) for (let iz = -8; iz <= 8; iz++) {
      const x = ix * 0.5, z = iz * 0.5, expected = !!pointer && Math.hypot(x - pointer[0], z - pointer[2]) <= 0.75;
      for (const dx of [-0.025, 0, 0.025]) for (const dz of [-0.025, 0, 0.025]) assert.equal(redDot(x + dx, z + dz, pointer), expected, 'H7 whole dot centre/radius rule');
      dots++;
    }
    const renderer = fs.readFileSync(new URL('../sq.mjs', import.meta.url), 'utf8');
    assert.ok(renderer.includes('distance(centre, uHover.xy) <= 0.75') && renderer.includes('mix(c, red ? uRed : uDot, dotv)'), 'H7 shader must use centre distance and the existing dot mask');
    assert.ok(renderer.includes("hex('#C0262E')"), 'H7 brand red');
    const media = matches => ({ matches, addEventListener(_name, callback) { this.change = callback; } });
    const fine = media(true), reduced = media(false), events = {}, queue = [];
    let playing = false, available = true, draws = 0;
    const view = { S: 100, cx: 400, cy: 350, cam: HOME };
    const hover = createFloorHover({ addEventListener(name, callback) { events[name] = callback; } }, fine, reduced, () => ({ h: { left: 10, top: 20 } }), () => playing, () => available, () => draws++, callback => queue.push(callback));
    const move = (x, y, pointerType = 'mouse') => events.pointermove({ clientX: x, clientY: y, pointerType });
    move(410, 370); move(411, 371); move(412, 372);
    assert.equal(queue.length, 1, 'H7 hover redraws are not coalesced'); queue.shift()(); assert.equal(draws, 1);
    assert.ok(hover.point(view)); move(412, 372); assert.equal(queue.length, 0, 'H7 unchanged pointer schedules a redraw');
    events.pointerleave(); assert.equal(hover.point(view), null, 'H7 leave retains red dots'); assert.equal(queue.length, 1); queue.shift()();
    playing = true; move(410, 370); assert.equal(queue.length, 0, 'H7 playback scheduled an extra draw'); assert.ok(hover.point(view));
    reduced.matches = true; reduced.change(); assert.equal(hover.point(view), null, 'H7 reduced motion retains red dots'); move(412, 372); assert.equal(hover.point(view), null);
    reduced.matches = false; fine.matches = false; fine.change(); move(414, 374); assert.equal(hover.point(view), null, 'H7 coarse pointer activates dots');
    fine.matches = true; move(414, 374, 'touch'); assert.equal(hover.point(view), null, 'H7 touch activates dots');
    playing = false; available = false; move(415, 375); assert.equal(queue.length, 0, 'H7 hidden hero schedules a redraw');
    const player = fs.readFileSync(new URL('../play.mjs', import.meta.url), 'utf8');
    assert.ok(player.includes('pointer: hover.point(view)'), 'H7 player does not bind floor hover to current view');
    report.H7 = { rays, dots, wholeDotSamples: dots * 9, inputScheduling: 'coalescing, playing, held, leave, identical move, fine/reduced/touch and hidden gates', limits: 'shader source and geometry; raster visibility not rendered' };
  }
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = await checkRound5(process.argv.find(a => a.startsWith('--only='))?.slice(7));
  console.log(JSON.stringify(report, null, 2));
}
