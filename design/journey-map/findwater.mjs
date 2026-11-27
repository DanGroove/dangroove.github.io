// Fog reveals path markers; the well reads the existing journey; the ship keeps its own inner motion.
import { C, STOPS, MAP, FIND_COPY, FIND_PLAY, YGG } from './data.mjs';
import { clamp01, lerp } from './trip.mjs';
import { starPath, rnd } from './art.mjs';
import { beaconLit } from './findsheets.mjs';
import { findPointer, FD, FIND_BY, ease, out3, attr, fEsc, found, opened, press, showPop, toMap, findBits, findSvg, findRange, findFormat, findSlot, findPlace, findIdleTime, findIdleVisible } from './findkit.mjs';

export function findMist(svg) {
  const el = svg.querySelector('#f-mist'), cloud = el.querySelector('.mist-cloud'), drift = el.querySelector('.mist-drift'), wipes = svg.querySelector('#mistWipes'), glints = [...el.querySelectorAll('.mist-glint')];
  const M = FIND_PLAY.mist, o = { id: 'mist', el, stage: 'rest', kept: false, cleared: Array(M.grid[0] * M.grid[1]).fill(false), lifted: false, lastW: null, down: false, hearTs: -Infinity, travellerLast: null };
  const centres = () => { const Q = FIND_PLAY.mist, b = Q.box; return Array.from({ length: Q.grid[0] * Q.grid[1] }, (_, i) => [b[0] + (i % Q.grid[0] + 0.5) * b[2] / Q.grid[0], b[1] + (Math.floor(i / Q.grid[0]) + 0.5) * b[3] / Q.grid[1]]); };
  const lift = () => {
    if (o.lifted) return;
    const Q = FIND_PLAY.mist; o.lifted = o.kept = true; o.liftTs = FD.now; o.stage = FD.rm ? 'lifted' : 'lifting';
    for (let i = 0; i < Q.puffs; i++) findBits('wisp', Q.box[0] + (i + 0.5) * Q.box[2] / Q.puffs, Q.box[1] + Q.box[3] / 2, 1, { ...Q.puff, dir: Q.east });
    if (FD.rm) attr(cloud, 'opacity', 0);
  };
  const wipe = (p, r, manual, previous = null) => {
    if (manual) found(o.id);
    if (o.lifted) return;
    const Q = FIND_PLAY.mist;
    wipes.appendChild(findSvg('circle', { cx: p[0], cy: p[1], r: r * Q.soft[0], fill: 'url(#find-mist-wipe)' }));
    centres().forEach((c, i) => { if (Math.hypot(c[0] - p[0], c[1] - p[1]) <= Q.cellR) o.cleared[i] = true; });
    const dir = previous ? Math.atan2(p[1] - previous[1], p[0] - previous[0]) * FIND_PLAY.kit.deg / Math.PI : Q.east[0];
    o.wipes = (o.wipes || 0) + 1; if (o.wipes % Q.wisps[0] === 0) findBits('wisp', ...p, 1, { ...Q.puff, dir: [dir - Q.wisps[1], dir + Q.wisps[1]] });
    // Only hands lift the whole bank; the traveller clears its path (Dan, 2026-11-27).
    if (manual && o.cleared.filter(Boolean).length / o.cleared.length >= Q.done) lift();
  };
  const pointer = (e, r) => {
    if (!FD.st) return;
    const p = toMap([e.clientX, e.clientY]), b = FIND_PLAY.mist.box;
    if (p[0] < b[0] || p[0] > b[0] + b[2] || p[1] < b[1] || p[1] > b[1] + b[3]) return;
    if (o.lastW && Math.hypot(p[0] - o.lastW[0], p[1] - o.lastW[1]) < r * FIND_PLAY.mist.step) return;
    wipe(p, r, true, o.lastW); o.lastW = p;
  };
  findPointer(el, e => { o.down = true; o.lastW = null; el.setPointerCapture(e.pointerId); pointer(e, FIND_PLAY.mist.press); el._dragged = true; }, { drag: true, tap: e => { o.lastW = null; pointer(e, FIND_PLAY.mist.press); }, cancel: () => o.down = false });
  el.addEventListener('pointermove', e => { if (e.pointerType === 'mouse' || o.down) pointer(e, o.down && e.pointerType !== 'mouse' ? FIND_PLAY.mist.finger : FIND_PLAY.mist.wipe); });
  el.addEventListener('pointerup', () => o.down = false); el.addEventListener('pointercancel', () => o.down = false);
  const third = () => { found(o.id); const cells = centres(), n = Math.ceil(cells.length / FIND_PLAY.mist.thirds), remaining = o.cleared.map((v, i) => v ? -1 : i).filter(i => i >= 0); remaining.slice(0, n).forEach(i => wipe(cells[i], FIND_PLAY.mist.finger, true)); };
  press(el, e => { if (e.type === 'keydown' || !e.detail) third(); else { o.lastW = null; pointer(e, FIND_PLAY.mist.press); } });
  o.hear = () => { if (!FD.rm) { o.hearTs = FD.now; o.hearing = true; } };
  o.onEscape = () => o.down = false;
  // Every frame from findsFrame, even while a moving camera pauses the finds.
  o.travel = () => {
    const Q = FIND_PLAY.mist, b = Q.box, p = FD.st?.trav;
    if (!o.lifted && p && p[0] >= b[0] - Q.travellerEdge && p[0] <= b[0] + b[2] + Q.travellerEdge && p[1] >= b[1] - Q.travellerEdge && p[1] <= b[1] + b[3] + Q.travellerEdge && (!o.travellerLast || Math.hypot(p[0] - o.travellerLast[0], p[1] - o.travellerLast[1]) >= Q.traveller * Q.step)) { const previous = o.travellerLast; o.travellerLast = p.slice(); queueMicrotask(() => wipe(p, Q.traveller, false, previous)); }
  };
  o.tick = t => {
    const Q = FIND_PLAY.mist;
    const q = FD.rm ? 1 : clamp01((t - o.hearTs) / Q.hear[1]); attr(drift, 'transform', `translate(${Q.hear[0] * Math.sin(Math.PI * q)} 0)`); if (q === 1) o.hearing = false;
    if (o.lifted) {
      const age = t - o.liftTs, fade = FD.rm ? 1 : clamp01(age / Q.lift); attr(cloud, 'opacity', Q.alpha * (1 - fade));
      if (fade === 1) o.stage = 'lifted';
      glints.forEach((g, i) => { const k = FD.rm ? 1 : clamp01((age - Q.lift - i * Q.glintGap) / Q.glintTime), pulse = Math.sin(Math.PI * k); attr(g, 'opacity', pulse); attr(g, 'transform', `translate(${Q.glintAt[0]} ${Q.glintAt[1]}) rotate(${Q.glintTurn * k}) scale(${pulse}) translate(${-Q.glintAt[0]} ${-Q.glintAt[1]})`); });
      o.playing = !FD.rm && age < Q.lift + (glints.length - 1) * Q.glintGap + Q.glintTime;
    }
  };
  return o;
}

export function findWell(svg) {
  const f = FIND_BY.well, el = svg.querySelector('#f-well'), pebble = el.querySelector('.wl-pebble'), rings = [...el.querySelectorAll('.wl-rip ellipse')];
  const o = { id: f.id, el, stage: 'rest', kept: false, presses: 0, norn: -1, cur: -1, watered: 0, starBatches: [], ringTs: -Infinity, ringCount: 0, dripAt: FD.now + findRange(FIND_PLAY.well.drip), dripLand: null };
  const crown = findSvg('g', { id: 'wl-crown', 'pointer-events': 'none' }); svg.querySelector('#finds').appendChild(crown);
  const batches = FIND_PLAY.well.stars.map(row => {
    const stream = findSvg('circle', { class: 'pf', r: FIND_PLAY.well.pebbleR, opacity: 0 }); crown.appendChild(stream);
    const stars = row.map(p => { const g = findSvg('g', { transform: `translate(${MAP.ygg[0] + p[0]} ${MAP.ygg[1] + p[1]})` }), star = findSvg('path', { class: 'pf', d: starPath(0, 0, FIND_PLAY.well.starSize), opacity: 0 }); star.style.stroke = 'none'; g.appendChild(star); crown.appendChild(g); return star; }); return { stream, stars };
  });
  // idle: a root drip's ring. It is idle life like the rat's climb and the eagle's stretch, so it never keeps the well playing
  // (finds.mjs pauses idle life while the camera glides; the drip, its ring and the tree's creatures carry on at arrival).
  const ring = (count, idle = false) => { o.ringTs = idle ? findIdleTime(rings[0]) : FD.now; o.ringCount = count; o.ringIdle = idle; };
  const answer = () => {
    const names = FIND_COPY.norns[o.norn], index = o.cur + o.norn - 1, stop = STOPS[index];
    const line = o.norn === 0 && index < 0 ? FIND_COPY.wellNone : o.norn === 1 && o.cur < 0 ? FIND_COPY.wellMap : o.norn === 2 && index >= STOPS.length ? FIND_COPY.wellNext : stop ? findFormat(FIND_COPY.wellStop, { name: stop.short, dates: stop.dates }) : FIND_COPY.wellNone;
    o.answer = line;
    showPop(o, [f.x + FIND_PLAY.well.anchor[0], f.y + FIND_PLAY.well.anchor[1]], `<p class="pop-k">${fEsc(findFormat(FIND_COPY.nornKicker, { name: names[0], time: names[1] }))}</p><p class="pop-t">${fEsc(line)}</p>`, '', 'below');
  };
  const land = () => {
    const W = FIND_PLAY.well; o.stage = 'rest'; attr(pebble, 'opacity', 0); ring(W.rings); findBits('drop', ...W.water, W.drops, W.splash);
    if (o.presses <= W.stars.length) { o.watered = o.presses; o.starBatches[o.presses - 1] = FD.now; o.kept = true; }
    answer();
  };
  press(el, e => {
    if (o.stage === 'pebble') return;
    const W = FIND_PLAY.well; opened(o); found(o.id); o.presses++; o.norn = (o.presses - 1) % FIND_COPY.norns.length; o.cur = FD.st.visited.lastIndexOf(true);
    o.pebbleFrom = e.type === 'keydown' || !e.detail ? [W.water[0] + W.pebbleFrom[0], W.water[1] + W.pebbleFrom[1]] : toMap([e.clientX, e.clientY]); o.ts = FD.now; o.stage = 'pebble';
    if (FD.rm) land(); else attr(pebble, 'opacity', 1);
  });
  const eagle = svg.querySelector('.yg-eagle'), wings = svg.querySelector('.yg-wings'), rat = svg.querySelector('.yg-rat'), tail = svg.querySelector('.yg-tail');
  const treeRandom = rnd(YGG.life.seed), treeInterval = pair => lerp(pair[0], pair[1], treeRandom());
  o.ratAt = FD.now + treeInterval(YGG.life.ratEvery); o.eagleAt = FD.now + treeInterval(YGG.life.eagleEvery); o.ratTs = o.eagleTs = o.flightTs = -Infinity;
  o.reduce = keep => { if (['pebble','landing'].includes(o.stage)) { if (keep) opened(o); land(); } o.playing = false; };
  o.hear = () => { if (FD.rm) return; ring(1); o.flightTs = FD.now; o.playing = true; };
  o.tick = t => {
    const W = FIND_PLAY.well, Y = YGG, L = Y.life, idleRat=findIdleTime(rat),idleEagle=findIdleTime(eagle),idleWell=findIdleTime(rings[0]),idleCrown=findIdleTime(crown);
    if (!FD.rm && idleRat >= o.ratAt) { o.ratTs = idleRat; o.ratAt = idleRat + treeInterval(L.ratEvery); }
    if (!FD.rm && idleEagle >= o.eagleAt) { o.eagleTs = idleEagle; o.eagleAt = idleEagle + treeInterval(L.eagleEvery); }
    const ratAge = idleRat - o.ratTs, run = FD.rm ? 0 : ratAge < L.climb ? ease(ratAge / L.climb) : ratAge < L.climb + L.pause ? 1 : 1 - ease((ratAge - L.climb - L.pause) / L.climb);
    const restRat = Y.ratAt, fork = Y.fork.map((v, i) => v - MAP.ygg[i]);
    attr(rat, 'transform', 'translate(' + lerp(restRat[0], fork[0], run) + ' ' + lerp(restRat[1], fork[1], run) + ')');
    const flick = FD.rm || ratAge < L.climb || ratAge > L.climb + L.pause ? 0 : L.tail * Math.sin(Math.PI * 2 * (ratAge - L.climb) / L.pause) ** 2;
    attr(tail, 'transform', 'rotate(' + flick + ' ' + L.tailRoot.join(' ') + ')');
    let ex = Y.eagleAt[0], ey = Y.eagleAt[1], wingY = L.wingY[0]; const flightAge = t - o.flightTs;
    const flying = !FD.rm && flightAge < L.flight;
    if (flying) {
      const q = clamp01(flightAge / L.flight), F = L.flightStops; let dy;
      if (q < F[0]) dy = -L.rise * ease(q / F[0]);
      else if (q < F[1]) dy = lerp(-L.rise, -L.centre - L.radius, ease((q - F[0]) / (F[1] - F[0])));
      else if (q <= F[2]) { const a = Math.PI * 2 * (q - F[1]) / (F[2] - F[1]); ex += L.radius * Math.sin(a); dy = -L.centre - L.radius * Math.cos(a); }
      else if (q < F[3]) dy = lerp(-L.centre - L.radius, -L.rise, ease((q - F[2]) / (F[3] - F[2])));
      else dy = -L.rise * (1 - ease((q - F[3]) / (1 - F[3])));
      ey += dy; wingY = lerp(...L.flapY, (1 + Math.sin(Math.PI * 2 * L.flap * flightAge)) / 2);
    } else if (!FD.rm) wingY = lerp(...L.wingY, Math.sin(Math.PI * clamp01((idleEagle - o.eagleTs) / L.stretch)));
    attr(eagle, 'transform', 'translate(' + ex + ' ' + ey + ')'); attr(wings, 'transform', 'scale(' + L.wingX + ' ' + wingY + ')');
    if (!FD.rm && o.onScreen && findIdleVisible(rings[0]) && idleWell >= o.dripAt && o.dripLand === null && o.stage !== 'pebble') { findBits('drop', ...W.root, 1, { speed: [(W.water[1] - W.root[1]) / W.dripTime, (W.water[1] - W.root[1]) / W.dripTime], dir: [FIND_PLAY.kit.deg / 2, FIND_PLAY.kit.deg / 2], life: [W.dripTime, W.dripTime] }); o.dripLand = idleWell + W.dripTime; o.dripAt = idleWell + findRange(W.drip); }
    if (o.dripLand !== null && idleWell >= o.dripLand) { o.dripLand = null; ring(1, true); }
    if (o.stage === 'pebble') {
      const q = clamp01((t - o.ts) / W.pebbleTime), p = [lerp(o.pebbleFrom[0], W.water[0], q), lerp(o.pebbleFrom[1], W.water[1], q) - W.arc * Math.sin(Math.PI * q)];
      attr(pebble, 'transform', `translate(${p[0] - f.x} ${p[1] - f.y})`);
      if (q === 1) { o.stage = 'landing'; queueMicrotask(land); }
    }
    rings.forEach((r, i) => { const age = (o.ringIdle?idleWell:t) - o.ringTs - i * W.ringGap, q = FD.rm ? 1 : clamp01(age / W.ringTime); attr(r, 'transform', `scale(${lerp(W.ringScale[0], W.ringScale[1], q)})`); attr(r, 'opacity', i < o.ringCount && age >= 0 ? W.ringAlpha * (1 - q) : 0); });
    batches.forEach((batch, i) => {
      if (o.starBatches[i] === undefined) return;
      const age = t - o.starBatches[i], q = FD.rm ? 1 : clamp01(age / W.trunkTime), p = W.trunk;
      attr(batch.stream, 'transform', `translate(${lerp(p[0][0], p[1][0], ease(q))} ${lerp(p[0][1], p[1][1], ease(q))})`); attr(batch.stream, 'opacity', !FD.rm && q < 1 ? 1 : 0);
      batch.stars.forEach((s, j) => { const k = FD.rm ? 1 : clamp01((age - W.trunkTime - j * W.starGap) / W.starTime), scale = k < 0.5 ? lerp(0, W.starOver, ease(k * 2)) : lerp(W.starOver, 1, ease((k - 0.5) * 2)); attr(s, 'transform', `scale(${scale})`); attr(s, 'opacity', k === 0 ? 0 : FD.rm ? 1 : lerp(W.twinkle[0], W.twinkle[1], (1 + Math.sin(Math.PI * 2 * idleCrown / W.twinkleTime[(i + j) % W.twinkleTime.length] + i + j)) / 2)); });
    });
    const last = o.starBatches[o.starBatches.length - 1]; o.playing = flying || o.stage === 'pebble' || o.stage === 'landing' || !o.ringIdle && t - o.ringTs < W.ringTime + (o.ringCount - 1) * W.ringGap || last !== undefined && t - last < W.trunkTime + W.starGap * (W.stars[0].length - 1) + W.starTime;
  };
  return o;
}

export function findShip(svg) {
  const el = svg.querySelector('#f-longship'), rock = el.querySelector('.ls-rock'), sail = el.querySelector('.ls-sail'), oars = el.querySelector('.ls-oars'), pennant = el.querySelector('.ls-pennant'), lamp = el.querySelector('.ls-lamp'), shields = [...el.querySelectorAll('.ls-shield')];
  const o = { id: 'longship', el, stage: 'rest', kept: false, pulls: [], queued: [], pennant: false, lamp: false, shieldMask: [], pullTs: -Infinity, pennantTs: -Infinity, hearTs: -Infinity };
  const startPull = (fly, ts = FD.now) => {
    const S = FIND_PLAY.ship; o.pullTs = ts; o.stage = 'pull';
    if (!o.pennant && fly) { o.pennant = o.kept = true; o.pennantTs = ts; }
    const p = findPlace(o.id); findBits('ring', p[0] + S.water[0] * S.scale, p[1] + S.water[1] * S.scale, 1, FIND_PLAY.bits.wake); findBits('drop', p[0], p[1] + S.water[1] * S.scale, S.drops, FIND_PLAY.bits.drops);
  };
  press(el, () => {
    const S = FIND_PLAY.ship;
    opened(o); found(o.id); o.pulls = o.pulls.filter(t => FD.now - t <= S.window); o.pulls.push(FD.now);
    const fly = o.pulls.length >= S.pulls;
    if (!FD.rm && o.stage === 'pull') { if (o.queued.length < S.pulls) o.queued.push(fly); }
    else startPull(fly);
    showPop(o, () => { const here = findPlace(o.id); return [here[0] + FIND_PLAY.ship.anchor[0], here[1] + FIND_PLAY.ship.anchor[1]]; }, `<p class="pop-k">${fEsc(FIND_COPY.shipLog)}</p>${findSlot(FIND_COPY.longship)}`);
  });
  o.hear = () => { if (!FD.rm) { o.hearTs = FD.now; o.hearing = true; } };
  o.tick = t => {
    const idle=findIdleTime(rock);
    const S = FIND_PLAY.ship, total = S.pull[2] + S.pull[3], hearing = !FD.rm && t - o.hearTs < S.hear[3]; o.hearing = hearing;
    while (o.stage === 'pull' && (FD.rm || t - o.pullTs >= total)) {
      if (o.queued.length) startPull(o.queued.shift(), FD.rm ? t : o.pullTs + total);
      else o.stage = 'rest';
    }
    const age = t - o.pullTs;
    const pull = o.stage === 'pull' && !FD.rm ? age < S.pull[2] ? ease(age / S.pull[2]) : 1 - ease((age - S.pull[2]) / S.pull[3]) : 0;
    attr(oars, 'opacity', o.stage === 'pull' && !FD.rm ? 1 : 0); attr(oars, 'transform', `rotate(${lerp(S.pull[0], S.pull[1], pull)} ${S.rail[0]} ${S.rail[1]})`);
    attr(rock, 'transform', `translate(${S.surge * pull} ${FD.rm ? 0 : S.rock[2] * Math.sin(S.rock[3] * idle)}) rotate(${FD.rm ? 0 : S.rock[0] * Math.sin(S.rock[1] * idle) * (hearing ? S.hear[2] : 1)})`);
    const fill = FD.rm ? 1 : t - o.hearTs < S.hear[1] ? 1 + (S.hear[0] - 1) * Math.sin(Math.PI * clamp01((t - o.hearTs) / S.hear[1])) : 1;
    attr(sail, 'transform', `translate(${S.sailPivot[0]} ${S.sailPivot[1]}) scale(${fill * (FD.rm ? 1 : 1 + S.breathe[0] * Math.sin(S.breathe[1] * idle))} 1) translate(${-S.sailPivot[0]} ${-S.sailPivot[1]})`);
    shields.forEach((s, i) => { const lit = !!FD.st.visited[i]; if (lit !== o.shieldMask[i]) { o.shieldMask[i] = lit; queueMicrotask(() => s.style.fill = lit ? C.paper : C.ink); } });
    if (beaconLit()) o.lamp = o.kept = true;
    attr(lamp, 'opacity', o.lamp ? FD.rm ? 1 : lerp(S.twinkle[0], S.twinkle[1], (1 + Math.sin(S.twinkle[2] * idle)) / 2) : 0);
    attr(pennant, 'opacity', o.pennant ? 1 : 0); attr(pennant, 'transform', `scale(${o.pennant ? FD.rm ? 1 : out3((t - o.pennantTs) / S.pennantTime) : 0} 1) skewY(${o.pennant && !FD.rm ? S.ripple[0] * Math.sin(Math.PI * 2 * S.ripple[1] * idle) : 0})`);
    o.playing = o.stage === 'pull' || hearing || o.pennant && t - o.pennantTs < S.pennantTime;
  };
  return o;
}
