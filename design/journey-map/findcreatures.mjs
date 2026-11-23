// Part A: thought and memory return; deadlines become a three-poke chase.
import { C, STOPS, MAP, FIND_COPY, FIND_PLAY, FIND_TIMING } from './data.mjs';
import { JORM, jormPoint } from './art.mjs';
import { clamp01, lerp } from './trip.mjs';
import { FD, FIND_BY, D, ease, out3, fEsc, attr, toMap, found, opened, press, showPop, closePop, closeSheet, attend, findBits, findFormat, findRange, findSheet, findSlot } from './findkit.mjs';

export function findRavens(svg) {
  const f = FIND_BY.ravens, el = svg.querySelector('#f-ravens'), birds = [...el.querySelectorAll('.rv-a, .rv-b')].map((g, i) => ({ g, sit: g.querySelector('.rv-sit'), fly: g.querySelector('.rv-fly'), head: g.querySelector('.rv-head'), body: g.querySelector('.rv-body'), near: g.querySelector('.rv-near'), far: g.querySelector('.rv-far'), item: g.querySelector('.rv-item'), i, angle: 0, landTs: -Infinity })), scratches = [...el.querySelectorAll('.rv-tally path')];
  const o = { id: f.id, el, stage: 'rest', next: 0, thoughts: 0, tally: 0, kept: false, ts: -Infinity, preenAt: FD.now + findRange(FIND_PLAY.raven.preen), preenBird: 0, preenTs: -Infinity, ruffleTs: -Infinity };
  birds.forEach((b, i) => { const R = FIND_PLAY.raven; b.item.innerHTML = i === 0 ? `<rect class="pf" x="${R.beak[0]}" y="${R.beak[1]}" width="${R.strip[0]}" height="${R.strip[1]}"/>` : `<rect class="o" x="${R.beak[0]}" y="${R.beak[1]}" width="${R.frame[0]}" height="${R.frame[1]}"/>`; attr(b.item, 'opacity', 0); });
  const start = (kind, index) => {
    const R = FIND_PLAY.raven; o.stage = kind; o.activeBird = index; o.ts = FD.now;
    const perch = R.perches[index], A = [f.x + perch[0] * R.scale, f.y + perch[1] * R.scale];
    const target = index === 0 ? MAP.waypoints[STOPS[o.thoughts % STOPS.length].w] : MAP.x;
    const dx = target[0] - A[0], dy = target[1] - A[1], length = Math.hypot(dx, dy) || 1;
    o.unit = [dx / length, dy / length];
    birds.forEach(b => { if (kind === 'hear' || b.i === index) { attr(b.sit, 'opacity', 0); attr(b.fly, 'opacity', 1); findBits('feather', f.x + R.perches[b.i][0] * R.scale, f.y + R.perches[b.i][1] * R.scale, R.feathers, FIND_PLAY.bits.feathers); } });
  };
  press(el, () => { if (o.stage !== 'rest') return; found(o.id); opened(o); start('flight', o.next); o.next = 1 - o.next; });
  o.hear = () => { if (FD.rm) return; if (o.stage === 'rest') start('hear', 0); else o.hearPending = true; };
  o.onSheetClose = () => { o.stage = 'rest'; };
  o.undo = () => { if (FD.sheetOwner === o) closeSheet(true); if (FD.popOwner === o) closePop(); };
  const reel = () => {
    const R = FIND_PLAY.raven;
    const shown = findSheet(o, 'reel', `<div class="iris"><div class="iris-in"><div class="player" role="img" aria-label="${fEsc(FIND_COPY.reelLabel)}"><p class="reel-k pop-k">${fEsc(FIND_COPY.muninn)}</p><i class="sh sh1"></i><i class="sh sh2"></i><i class="sh sh3"></i><div class="reel-slot">${findSlot(FIND_COPY.reelToCome)}</div>${R.reel.ringSvg}<span class="tc">${FIND_COPY.ravenTime.join(R.reel.timeJoin)}</span></div></div></div>`, [f.x, f.y]);
    if (!shown) { o.stage = 'rest'; return; }
    o.iris = FD.sheet.querySelector('.iris'); o.irisIn = FD.sheet.querySelector('.iris-in'); o.sh = [...FD.sheet.querySelectorAll('.sh')]; o.tc = FD.sheet.querySelector('.tc');
    if (!FD.rm) FD.sheet.querySelector('.ring-p').animate([{ strokeDashoffset: R.reel.ring }, { strokeDashoffset: 0 }], { duration: FIND_TIMING.reel * 1000, fill: 'forwards' });
    o.stage = 'reel'; o.ts = FD.now;
  };
  const landed = index => {
    const R = FIND_PLAY.raven; birds.forEach(b => { attr(b.sit, 'opacity', 1); attr(b.fly, 'opacity', 0); attr(b.item, 'opacity', 0); b.landTs = FD.now; });
    o.stage = 'rest';
    if (index === 0) {
      const stop = STOPS[o.thoughts % STOPS.length]; o.thoughts++; o.tally = Math.min(STOPS.length, o.thoughts); o.kept = true;
      scratches.forEach((s, i) => attr(s, 'opacity', i < o.tally ? R.tallyAlpha : 0));
      showPop(o, [f.x, f.y - R.popupAt * R.scale], `<p class="pop-k">${fEsc(FIND_COPY.huginn)}<br>${fEsc(findFormat(FIND_COPY.ravenFrom, { name: stop.short }))}</p><p class="pop-t">${fEsc(stop.copy.took)}</p><p class="pop-k">${fEsc(stop.dates)}</p>`);
    } else reel();
  };
  o.tick = (t, dt) => {
    const R = FIND_PLAY.raven, e = t - o.ts, p = attend(o, R.attend);
    if (o.awake && !o.wasAwake) o.ruffleTs = t; o.wasAwake = o.awake;
    if (!FD.rm && t >= o.preenAt && o.stage === 'rest') { o.preenTs = t; o.preenBird = 1 - o.preenBird; o.preenAt = t + findRange(R.preen); }
    if (o.stage === 'reel') {
      if (FD.sheetOwner !== o) { o.stage = 'rest'; return; }
      const grow = FD.rm ? 1 : out3(e / FIND_PLAY.kit.sheet.grow), from = FD.sheetFrom;
      const fit = Math.min(1, (Math.min(FD.st ? innerWidth : R.reel.iris, innerHeight) - FIND_PLAY.kit.sheet.edge) / R.reel.iris);
      FD.sheet.style.transform = `translate(${lerp(from[0], innerWidth / 2, grow)}px,${lerp(from[1], innerHeight / 2 - FIND_PLAY.kit.sheet.offset, grow)}px) scale(${lerp(FIND_PLAY.kit.sheet.from, fit, grow)})`;
      const q = clamp01((e - (FD.rm ? 0 : FIND_PLAY.kit.sheet.grow)) / FIND_TIMING.reel), digits = Math.min(FIND_TIMING.reel, Math.floor(q * FIND_TIMING.reel));
      if (digits !== o.digits) { o.digits = digits; const tc = o.tc; queueMicrotask(() => { if (tc.isConnected) tc.textContent = findFormat(R.reel.tc, { n: digits, end: FIND_COPY.ravenTime[1] }); }); }
      if (!FD.rm) o.sh.forEach((s, i) => { const M = R.reel.motion; s.style.transform = `translate(${Math.sin(e * (M[0] + i * M[1]) + i * M[2]) * M[3]}px,${Math.cos(e * (M[4] + i * M[5]) + i) * M[6]}px) rotate(${e * M[7] * (i - 1)}deg)`; });
      const end = FD.rm ? q === 1 ? 1 : 0 : clamp01((e - FIND_PLAY.kit.sheet.grow - FIND_TIMING.reel) / FIND_TIMING.iris), iris = Math.max(Number.EPSILON, 1 - ease(end));
      o.iris.style.transform = `scale(${iris})`; o.irisIn.style.transform = `scale(${1 / iris})`;
      if (end === 1) queueMicrotask(() => closeSheet(true));
      return;
    }
    const total = R.out + R.away + R.back, hearing = o.stage === 'hear', flying = o.stage === 'flight';
    birds.forEach(b => {
      const perch = R.perches[b.i], active = hearing || flying && b.i === o.activeBird;
      let x = perch[0], y = perch[1], scale = R.birdScale, turn = 0, mirror = b.i === 0 ? -1 : 1, alpha = 1, sy = 1;
      if (active) {
        const q = FD.rm ? 1 : clamp01(e / (hearing ? R.loop : total));
        if (hearing) { const angle = q * Math.PI * 2; x += R.hearReach * Math.sin(angle) / R.scale; y -= R.hearReach * (1 - Math.cos(angle)) / R.scale; turn = Math.atan2(-Math.sin(angle), Math.cos(angle)) * FIND_PLAY.kit.deg / Math.PI; mirror = Math.cos(angle) < 0 ? -1 : 1; if (mirror < 0) turn -= FIND_PLAY.kit.deg; }
        else {
          const returning = e >= R.out + R.away;
          const s = FD.rm ? 0 : e < R.out ? (clamp01(e / R.out)) ** 2 : returning ? (1 - clamp01((e - R.out - R.away) / R.back)) ** 2 : 1;
          const u = o.unit, normal = [-u[1], u[0]], sign = returning ? -1 : 1;
          x += (u[0] * R.reach * s + normal[0] * R.bend * Math.sin(Math.PI * s) * sign) / R.scale;
          y += (u[1] * R.reach * s + normal[1] * R.bend * Math.sin(Math.PI * s) * sign) / R.scale;
          const tangent = [u[0] * R.reach + normal[0] * R.bend * Math.PI * Math.cos(Math.PI * s) * sign, u[1] * R.reach + normal[1] * R.bend * Math.PI * Math.cos(Math.PI * s) * sign].map(v => returning ? -v : v);
          mirror = tangent[0] < 0 ? -1 : 1; turn = Math.atan2(tangent[1], tangent[0]) * FIND_PLAY.kit.deg / Math.PI - (mirror < 0 ? FIND_PLAY.kit.deg : 0);
          scale *= lerp(1, R.rise, clamp01(s * 2)); alpha = 1 - clamp01((s - R.fade) / (1 - R.fade));
          const land = returning ? clamp01((e - total + R.land) / R.land) : 0; turn -= R.tilt * land; attr(b.item, 'opacity', returning ? 1 : 0);
        }
        const beat = !hearing && e >= total - R.land ? 0 : (1 - Math.cos(t * Math.PI * 2 * R.flap)) / 2;
        attr(b.near, 'transform', `translate(${R.wingNearX} ${R.wingY}) scale(1 ${lerp(R.wingNear[0], R.wingNear[1], beat)}) translate(${-R.wingNearX} ${-R.wingY})`);
        attr(b.far, 'transform', `translate(0 ${R.wingY}) scale(1 ${lerp(R.wingFar[0], R.wingFar[1], beat)}) translate(0 ${-R.wingY})`);
      } else {
        const pointer = FD.hover ? toMap(FD.pointer) : null;
        if (o.awake && pointer && Math.sign(pointer[0] - f.x) === (b.i === 0 ? -1 : 1)) x += (b.i === 0 ? 1 : -1) * R.shy;
        let angle = p ? Math.atan2(p[1] - (f.y + perch[1] * R.scale), (p[0] - (f.x + perch[0] * R.scale)) * mirror) * FIND_PLAY.kit.deg / Math.PI : Math.sin(t * R.idle[0] + b.i) * R.headLimit * R.idle[1];
        angle = Math.max(-R.headLimit, Math.min(R.headLimit, angle));
        const preen = b.i === o.preenBird && !FD.rm ? Math.sin(Math.PI * clamp01((t - o.preenTs) / R.preenTime)) : 0;
        b.angle = FD.rm ? 0 : lerp(b.angle, angle + preen * R.preenAngle, Math.min(1, dt * R.headEase)); attr(b.head, 'transform', `translate(${R.headAt[0]} ${R.headAt[1]}) rotate(${b.angle})`);
        const ruffle = FD.rm ? 0 : Math.sin(Math.PI * clamp01((t - o.ruffleTs) / R.ruffle[1])); attr(b.body, 'transform', `scale(${1 + (R.ruffle[0] - 1) * ruffle})`);
        sy = FD.rm ? 1 : lerp(R.squash, 1, ease((t - b.landTs) / R.land));
      }
      attr(b.g, 'transform', `translate(${x} ${y}) rotate(${turn}) scale(${mirror * scale} ${scale * sy})`); attr(b.g, 'opacity', alpha);
    });
    if ((flying && (FD.rm || e >= total)) || (hearing && e >= R.loop)) {
      if (hearing) { o.stage = 'rest'; birds.forEach(b => { attr(b.sit, 'opacity', 1); attr(b.fly, 'opacity', 0); b.landTs = t; }); }
      else { o.stage = 'landing'; const index = o.activeBird; queueMicrotask(() => landed(index)); }
    }
    if (o.stage === 'rest' && o.hearPending) { o.hearPending = false; queueMicrotask(() => start('hear', 0)); }
  };
  return o;
}

export function findSerpent(svg) {
  const f = FIND_BY.serpent, el = svg.querySelector('#f-serpent'), head = el.querySelector('.jg-head'), jaw = el.querySelector('.jg-jaw'), tail = el.querySelector('.jg-tail'), pad = el.querySelector('.jg-pad'), eye = el.querySelector('.jg-eye'), shut = el.querySelector('.jg-shut'), tongue = el.querySelector('.jg-tongue'), joint = head.parentElement;
  const leaves = [...el.querySelectorAll('.jg-leaf')].sort((a, b) => +a.dataset.i - +b.dataset.i);
  const swells = [...svg.querySelectorAll('.jg-swell')].map(g => ({ g, gulp: g.querySelector('.jg-gulp'), hearPath: g.querySelector('.jg-hear'), live: false }));
  const o = { id: f.id, el, stage: 'ready', pokes: 0, round: 0, kept: false, ts: -Infinity, headAngle: 0, headTurn: 0, jawAngle: 0, tailOut: 0, queued: false, held: false, hearTs: -Infinity, padTs: -Infinity, swells };
  o.place = () => [f.x, f.y];
  const remaining = () => leaves.forEach((leaf, i) => { if (i >= o.pokes) { attr(leaf, 'opacity', 1); const offset = (i - o.pokes) * FIND_PLAY.serpent.leafOffset; attr(leaf, 'transform', 'translate(' + offset + ' ' + offset + ')'); } });
  const reward = () => { o.stage = 'asleep'; o.kept = true; o.held = false; o.tailOut = 0; o.jawAngle = 0; attr(tail, 'transform', 'translate(0 0)'); attr(eye, 'opacity', 0); attr(shut, 'opacity', 1); queueMicrotask(() => showPop(o, [f.x + FIND_PLAY.serpent.popup[0], f.y + FIND_PLAY.serpent.popup[1]], '<p class="pop-k">' + fEsc(FIND_COPY.serpentFed) + '</p>' + findSlot(FIND_COPY.serpentLines[o.round % FIND_COPY.serpentLines.length]), '', 'above')); };
  const swell = (duration, horn = false) => { if (FD.rm) return; const slot = swells.find(s => !s.live); if (slot) Object.assign(slot, { live: true, ts: FD.now, duration, horn, last: !horn && o.pokes === leaves.length }); };
  const start = () => {
    if (o.stage === 'step') { o.queued = true; return; }
    if (o.stage === 'waking' || o.stage === 'closing') return;
    if (o.stage === 'asleep') {
      o.round++; o.pokes = 0; o.kept = false; o.queued = false; o.ts = o.padTs = FD.now; o.stage = FD.rm ? 'ready' : 'waking'; closePop(); opened(o);
      leaves.slice().reverse().forEach(leaf => pad.appendChild(leaf)); remaining();
      if (!FD.rm) findBits('ring', f.x + FIND_PLAY.serpent.pad[0], f.y + FIND_PLAY.serpent.pad[1], 1, FIND_PLAY.bits.wake);
      attr(eye, 'opacity', 1); attr(shut, 'opacity', 0); return;
    }
    if (o.pokes >= leaves.length) return;
    closePop(); found(o.id); opened(o); o.pokes++; o.ts = FD.now; o.stepPart = -1; o.stage = 'step'; o.bitten = false; o.gulped = false; o.leaf = leaves[o.pokes - 1];
    if (FD.rm) { attr(o.leaf, 'opacity', 0); remaining(); o.tailOut = o.pokes === leaves.length ? 0 : 1; o.jawAngle = o.pokes === leaves.length ? 0 : FIND_PLAY.serpent.hungryJaw; o.stage = 'hungry'; if (o.pokes === leaves.length) { attr(pad, 'opacity', 0); reward(); } }
    o.playing = !FD.rm;
  };
  press(el, start); remaining(); attr(pad, 'transform', 'translate(' + FIND_PLAY.serpent.pad.join(' ') + ')');
  o.undo = () => { if (FD.popOwner === o) closePop(); };
  o.hear = () => { if (!FD.rm) { o.hearTs = FD.now; swell(FIND_PLAY.serpent.hear[2], true); o.playing = true; } };
  o.tick = (t, dt) => {
    const S = FIND_PLAY.serpent, J = MAP.jorm, e = t - o.ts, asleep = o.stage === 'asleep', here = { x: f.x + S.head[0], y: f.y + S.head[1] }, target = attend(here, S.attend);
    let aim = target ? Math.atan2(-(target[1] - here.y), -(target[0] - here.x)) * FIND_PLAY.kit.deg / Math.PI : 0; aim = Math.max(-S.headLimit, Math.min(S.headLimit, aim));
    o.headAngle = FD.rm ? 0 : lerp(o.headAngle, aim, Math.min(1, dt * S.headEase));
    let angle = asleep ? S.restAngle + (FD.rm ? 0 : S.breathe[0] * Math.sin(Math.PI * 2 * t / S.breathe[1])) : o.headAngle;
    let jawTurn = o.stage === 'hungry' ? S.hungryJaw : 0, tailK = o.stage === 'hungry' ? 1 : 0, padK = o.pokes === leaves.length && o.gulped ? clamp01((t - o.padTs) / S.padTime) : 0;
    if (o.stage === 'step') {
      let part = 0, age = e; while (part < S.steps.length - 1 && age >= S.steps[part]) { age -= S.steps[part]; part++; }
      const q = clamp01(age / S.steps[part]); o.stepPart = part;
      const turn = S.lunge;
      if (part === 0) { jawTurn = lerp(o.pokes > 1 ? S.hungryJaw : 0, S.jaw, ease(q)); tailK = lerp(o.pokes > 1 ? 1 : 0, 1, ease(q)); }
      if (part === 1) { const back = S.overEase, z = q - 1; angle = turn * (1 + (back + 1) * z ** 3 + back * z ** 2); jawTurn = S.jaw; tailK = 1; }
      if (part >= 2 && !o.bitten) { o.bitten = true; o.held = true; joint.appendChild(o.leaf); remaining(); findBits('drop', f.x + S.pad[0], f.y + S.pad[1], S.drops, FIND_PLAY.bits.drops); }
      if (part === 2) { angle = turn; jawTurn = S.jaw * (1 - ease(q)); tailK = 1; }
      if (part === 3) { angle = turn * (1 - ease(q)); tailK = 1; }
      if (part === 4) {
        angle = S.swallow * Math.sin(Math.PI * q); tailK = 1;
        if (!o.gulped) { o.gulped = true; swell(S.swell[o.pokes - 1]); if (o.pokes === leaves.length) { o.padTs = t; findBits('ring', f.x + S.pad[0], f.y + S.pad[1], 1, FIND_PLAY.bits.wake); } }
        padK = o.pokes === leaves.length ? clamp01((t - o.padTs) / S.padTime) : 0;
      }
      if (o.held) {
        const shrink = part === 4 ? 1 - ease(q) : 1, flutter = S.flutter[0] * Math.sin(Math.PI * 2 * S.flutter[1] * t), at = part === 4 ? S.mouth.map((v, i) => lerp(v, S.corner[i], ease(q))) : S.mouth;
        attr(o.leaf, 'transform', 'rotate(' + angle + ') translate(' + at.join(' ') + ') rotate(' + flutter + ') scale(' + shrink + ')'); attr(o.leaf, 'opacity', shrink > 0 ? 1 : 0); o.leafTurn = angle;
      }
      if (e >= S.steps.reduce((sum, v) => sum + v, 0)) { attr(o.leaf, 'opacity', 0); o.held = false; o.stage = 'hungry'; if (o.queued && o.pokes < leaves.length) { o.queued = false; start(); } else o.queued = false; }
    }
    if (o.stage === 'waking') { const q = clamp01(e / S.padTime); padK = 1 - q; if (e >= S.wake) attr(eye, 'opacity', 1); if (q === 1) o.stage = 'ready'; }
    swells.forEach(s => {
      if (!s.live) { attr(s.g, 'opacity', 0); return; }
      const q = clamp01((t - s.ts) / s.duration), u = JORM.L * ease(q), p = jormPoint(u), fade = Math.min(1, u / J.swellRamp, (JORM.L - u) / J.swellRamp);
      const surface = Math.max(0, ...J.surf.map(([a, b]) => Math.max(0, Math.min(1, (u - a * JORM.L) / J.swellRamp, (b * JORM.L - u) / J.swellRamp))));
      attr(s.g, 'transform', 'translate(' + p.x + ' ' + p.y + ') rotate(' + p.angle + ')'); attr(s.g, 'opacity', fade * lerp(J.swellSub, 1, surface)); attr(s.gulp, 'opacity', s.horn ? 0 : 1); attr(s.hearPath, 'opacity', s.horn ? 1 : 0);
      if (q === 1) { s.live = false; if (!s.horn) o.twitchTs = t; if (s.last) { o.stage = 'closing'; o.ts = t; } }
    });
    if (o.stage === 'closing') {
      const age = t - o.ts, A = S.close, q = age < A[0] ? age / A[0] : age < A[0] + A[1] ? (age - A[0]) / A[1] : (age - A[0] - A[1]) / A[2];
      jawTurn = age < A[0] ? lerp(S.hungryJaw, S.jaw, ease(q)) : age < A[0] + A[1] ? S.jaw : S.jaw * (1 - ease(q)); tailK = age < A[0] ? 1 : 1 - ease((age - A[0]) / A[1]); angle = 0;
      if (age >= A.reduce((sum, v) => sum + v, 0)) reward();
    }
    const heard = FD.rm ? 1 : clamp01((t - o.hearTs) / S.hear[1]); angle += S.hear[0] * Math.sin(Math.PI * heard);
    if (o.stage === 'asleep') { jawTurn = 0; tailK = 0; }
    o.headTurn = angle; o.jawAngle = jawTurn; o.tailOut = tailK;
    attr(head, 'transform', 'rotate(' + angle + ')'); attr(jaw, 'transform', 'rotate(' + (-jawTurn) + ' ' + S.jawPivot.join(' ') + ')');
    const twitch = FD.rm ? 0 : S.tailTwitch[0] * Math.sin(Math.PI * clamp01((t - (o.twitchTs ?? -Infinity)) / S.tailTwitch[1]));
    attr(tail, 'transform', 'translate(' + (tailK * S.tailOut[0]) + ' ' + (tailK * S.tailOut[1] + twitch) + ')');
    const sleeping = o.stage === 'asleep'; attr(eye, 'opacity', sleeping ? 0 : 1); attr(shut, 'opacity', sleeping ? 1 : 0);
    const pointer = FD.hover && FD.now - FD.pointerT <= FIND_PLAY.fresh ? toMap(FD.pointer) : null, near = pointer && Math.hypot(pointer[0] - here.x, pointer[1] - here.y) <= S.near, ta = t % S.tongue[1], flick = !FD.rm && !sleeping && near && ta < S.tongue[0] ? Math.sin(Math.PI * ta / S.tongue[0]) : 0;
    attr(tongue, 'opacity', flick > 0 ? 1 : 0); attr(tongue, 'transform', 'translate(' + S.snout.join(' ') + ') scale(' + flick + ' 1) translate(' + S.snout.map(v => -v).join(' ') + ')');
    const bob = FD.rm || sleeping || o.stage === 'waking' ? 0 : Math.sin(Math.PI * 2 * t / S.bob[2]);
    attr(pad, 'transform', 'translate(' + S.pad[0] + ' ' + (S.pad[1] + S.padSink * padK + S.bob[1] * bob) + ') rotate(' + S.bob[0] * bob + ')'); attr(pad, 'opacity', 1 - padK);
    o.playing = ['step', 'waking', 'closing'].includes(o.stage) || swells.some(s => s.live) || t - (o.twitchTs ?? -Infinity) < S.tailTwitch[1];
  };
  return o;
}
