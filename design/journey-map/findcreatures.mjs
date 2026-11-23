// Part A: thought and memory return; deadlines become a three-poke chase.
import { C, STOPS, MAP, FIND_COPY, FIND_PLAY, FIND_TIMING, RAVEN_RIG } from './data.mjs';
import { JORM, jormPoint, ravenPose, ravenPoseTransforms } from './art.mjs';
import { clamp01, lerp, VIEW } from './trip.mjs';
import { FD, FIND_BY, D, ease, out3, fEsc, attr, toMap, found, opened, press, showPop, closePop, closeSheet, attend, findBits, findFormat, findRange, findSheet, findSlot, findReady } from './findkit.mjs';

export function findRavens(svg) {
  const R = FIND_PLAY.raven, G = RAVEN_RIG, f = FIND_BY.ravens, el = svg.querySelector('#f-ravens'), gifts = el.querySelector('.rv-gifts');
  const birds = [...el.querySelectorAll('.rv-a, .rv-b')].map((g, i) => ({ g, i, side: i ? 1 : -1, head: g.querySelector('.rv-head'), body: g.querySelector('.rv-body'), near: g.querySelector('.rv-near'), far: g.querySelector('.rv-far'), legs: g.querySelector('.rv-legs'), item: g.querySelector('.rv-item'), angle: 0, landTs: -Infinity, shy: 0, shyTo: 0, shyFrom: 0, shyTs: -Infinity, mirror: i ? 1 : -1, face: i ? 1 : -1, faceTs: -Infinity, turnTs: -Infinity, giftAlpha: 0, giftTs: -Infinity }));
  const scratches = [...el.querySelectorAll('.rv-tally path')];
  const o = { id: f.id, el, birds, stage: 'rest', next: 0, thoughts: 0, tally: 0, kept: false, ts: -Infinity, queued: false, preenAt: FD.now + findRange(R.preen), preenBird: 0, preenTs: -Infinity, ruffleTs: -Infinity };
  const rigEase = value => { const q = clamp01(value); return q * q * (3 - 2 * q); };
  birds.forEach(b => { const size = b.i ? R.frame : R.strip; b.item.innerHTML = '<rect class="' + (b.i ? 'o' : 'pf') + '" width="' + size[0] + '" height="' + size[1] + '"/>'; attr(b.item, 'transform', 'translate(' + G.itemAt.join(' ') + ')'); });
  const baseAt = b => [G.PERCHES[b.i][0] + b.side * b.shy, G.PERCHES[b.i][1] + b.shy * G.hopSlope[b.i]];
  const setFacing = (b, sign, t, force = false) => {
    if (b.want !== sign) { b.want = sign; b.faceTs = t; }
    if (sign !== b.face && (force || t - b.faceTs >= G.hysteresis)) { b.face = sign; b.turnFrom = b.mirror; b.turnTs = t; }
    b.mirror = lerp(b.turnFrom ?? b.side, b.face, rigEase((t - b.turnTs) / G.turn));
  };
  const start = (kind, index) => {
    o.stage = kind; o.activeBird = index; o.ts = FD.now;
    if (kind === 'flight' && index === 1 && FD.popOwner === o) closePop();
    birds.forEach(b => { b.lockedXY = b.xy?.slice() || baseAt(b); });
    birds.forEach(b => {
      if (kind !== 'hear' && b.i !== index) return;
      b.flightBase = b.lockedXY.slice(); b.touchdown = false; b.done = false; b.giftAlpha = 0; b.giftDown = false;
      b.head.appendChild(b.item); attr(b.item, 'opacity', 0); attr(b.item, 'transform', 'translate(' + G.itemAt.join(' ') + ')');
      const cam = FD.st.cam, mapX = f.x + b.flightBase[0] * R.scale;
      const edge = ((b.side < 0 ? 0 : VIEW.w) - cam.tx) / cam.s;
      b.range = Math.max(R.reach, (b.side * (edge - mapX) + G.offFrame) / R.scale + G.birdMargin);
      b.startTs = FD.now + (kind === 'hear' ? b.i * G.loopGap : 0);
      findBits('feather', mapX, f.y + b.flightBase[1] * R.scale, R.feathers, FIND_PLAY.bits.feathers);
    });
  };
  const request = () => {
    if (o.stage !== 'rest' || o.queued) return;
    opened(o);
    if (!findReady(o.id)) { o.queued = true; return; }
    found(o.id);
    const index = o.next; o.next = 1 - index;
    if (FD.rm) { if (index === 1 && FD.popOwner === o) closePop(); landed(index); }
    else start('flight', index);
  };
  press(el, request);
  o.hear = () => { if (FD.rm) return; if (o.stage === 'rest') start('hear', 0); else o.hearPending = true; };
  o.onSheetClose = () => { o.stage = 'rest'; };
  o.undo = () => { if (FD.sheetOwner === o) closeSheet(true); if (FD.popOwner === o) closePop(); };
  const reel = anchor => {
    const shown = findSheet(o, 'reel', '<div class="iris"><div class="iris-in"><div class="player" role="img" aria-label="' + fEsc(FIND_COPY.reelLabel) + '"><p class="reel-k pop-k">' + fEsc(FIND_COPY.muninn) + '</p><i class="sh sh1"></i><i class="sh sh2"></i><i class="sh sh3"></i><div class="reel-slot">' + findSlot(FIND_COPY.reelToCome) + '</div>' + R.reel.ringSvg + '<span class="tc">' + FIND_COPY.ravenTime.join(R.reel.timeJoin) + '</span></div></div></div>', anchor);
    if (!shown) { o.stage = 'rest'; return; }
    o.iris = FD.sheet.querySelector('.iris'); o.irisIn = FD.sheet.querySelector('.iris-in'); o.sh = [...FD.sheet.querySelectorAll('.sh')]; o.tc = FD.sheet.querySelector('.tc');
    if (!FD.rm) FD.sheet.querySelector('.ring-p').animate([{ strokeDashoffset: R.reel.ring }, { strokeDashoffset: 0 }], { duration: FIND_TIMING.reel * 1000, fill: 'forwards' });
    o.stage = 'reel'; o.ts = FD.now;
  };
  const landed = index => {
    birds[index].lockedXY = birds[index].flightBase?.slice() || baseAt(birds[index]);
    o.stage = 'rest';
    if (index === 0) {
      const stop = STOPS[o.thoughts % STOPS.length];
      if (showPop(o, [f.x, f.y - R.popupAt * R.scale], '<p class="pop-k">' + fEsc(FIND_COPY.huginn) + '<br>' + fEsc(findFormat(FIND_COPY.ravenFrom, { name: stop.short })) + '</p><p class="pop-t">' + fEsc(stop.copy.took) + '</p><p class="pop-k">' + fEsc(stop.dates) + '</p>', '', 'above')) {
        o.thoughts++; o.tally = Math.min(STOPS.length, o.thoughts); o.kept = true;
        scratches.forEach((s, i) => attr(s, 'opacity', i < o.tally ? R.tallyAlpha : 0));
      }
    } else { const p = birds[index].giftPos || G.PERCHES[index]; reel([f.x + p[0] * R.scale, f.y + p[1] * R.scale]); }
  };
  const flap = age => { const q = ((age * R.flap) % 1 + 1) % 1 * (G.beat.length - 1), i = Math.floor(q); return ravenPose(G.beat[i], G.beat[i + 1], rigEase(q - i)); };
  const curve = (b, q) => {
    const A = b.flightBase, pts = [A, ...G.controls.map(p => [A[0] + b.side * p[0], A[1] + p[1]]), [A[0] + b.side * b.range, A[1] + G.endY]];
    return { p: [0, 1].map(k => (1-q)**3*pts[0][k]+3*(1-q)**2*q*pts[1][k]+3*(1-q)*q*q*pts[2][k]+q**3*pts[3][k]), v: [0, 1].map(k => 3*(1-q)**2*(pts[1][k]-pts[0][k])+6*(1-q)*q*(pts[2][k]-pts[1][k])+3*q*q*(pts[3][k]-pts[2][k])) };
  };
  o.tick = (t, dt) => {
    const p = attend(o, R.attend), flying = o.stage === 'flight', hearing = o.stage === 'hear';
    if (o.awake && !o.wasAwake) o.ruffleTs = t; o.wasAwake = o.awake;
    if (!FD.rm && t >= o.preenAt && (o.stage === 'rest' || o.stage === 'reel')) { o.preenTs = t; o.preenBird = 1 - o.preenBird; o.preenAt = t + findRange(R.preen); }
    birds.forEach(b => {
      const active = hearing || flying && b.i === o.activeBird, age = t - b.startTs, duration = hearing ? G.loopTakeoff + G.loopTime : G.crouch + R.out + R.away + R.back;
      let xy = active ? b.flightBase.slice() : (flying || hearing || o.stage === 'reel') && b.lockedXY ? b.lockedXY.slice() : baseAt(b), q = ravenPose('sit', 'sit', 0), rotate = 0, headMove = [0, 0], mode = 'sit';
      if (active && age >= 0 && !b.done) {
        const liftTime = hearing ? G.loopTakeoff : G.crouch;
        if (age < liftTime) { mode = 'crouch'; q = ravenPose('sit', 'unfold', ease(age / liftTime)); }
        else if (age < duration) {
          let velocity = [b.side, 0], landing = 0;
          if (hearing) {
            mode = 'loop'; const u = clamp01((age - G.loopTakeoff) / G.loopTime), a = b.side * Math.PI * 2 * u, [cx, cy] = G.loopCentre, vx = -b.side * cx, vy = -cy;
            xy = [b.flightBase[0] + b.side * cx + vx * Math.cos(a) - vy * Math.sin(a), b.flightBase[1] + cy + vx * Math.sin(a) + vy * Math.cos(a)];
            velocity = [(-vx * Math.sin(a) - vy * Math.cos(a)) * b.side, (vx * Math.cos(a) - vy * Math.sin(a)) * b.side];
            const launched = age - G.loopTakeoff;
            q = launched < G.unfold ? ravenPose('unfold', 'up', rigEase(launched / G.unfold)) : flap(launched - G.unfold); landing = clamp01((age - duration + G.land) / G.land);
          } else {
            const outEnd = G.crouch + R.out, backStart = outEnd + R.away, back = age >= backStart;
            mode = age < outEnd ? 'out' : back ? 'back' : 'away';
            const u = age < outEnd ? clamp01((age - G.crouch) / R.out) ** G.outPower : back ? (1 - clamp01((age - backStart) / R.back)) ** G.backPower : 1;
            const trace = curve(b, u); xy = trace.p; velocity = trace.v.map(v => back ? -v : v);
            if (mode === 'away') { velocity = [-b.side, 0]; setFacing(b, -b.side, t); }
            q = age - G.crouch < G.unfold ? ravenPose('unfold', 'up', ease((age - G.crouch) / G.unfold)) : flap(age - G.crouch - G.unfold);
            if (back) { const be = age - backStart, beat = be % G.returnBeat; q = be < G.returnFlaps ? ravenPose('glide', flap(beat / G.returnBeat / R.flap), Math.sin(Math.PI * beat / G.returnBeat) ** 2) : ravenPose('glide', 'glide', 0); landing = clamp01((age - duration + G.land) / G.land); attr(b.item, 'opacity', 1); }
          }
          setFacing(b, velocity[0] < 0 ? -1 : 1, t);
          const tilt = Math.max(-R.tilt, Math.min(R.tilt, Math.atan2(velocity[1], Math.abs(velocity[0])) * FIND_PLAY.kit.deg / Math.PI));
          rotate = tilt * b.mirror * (1 - ease((age - duration + G.level) / G.level));
          if (landing > 0) q = ravenPose(q, 'flare', ease(landing));
        } else {
          if (!b.touchdown) { b.touchdown = true; b.landTs = t; }
          const settleEnd = duration + G.settle, turnEnd = settleEnd + G.perchTurn, end = turnEnd + (hearing ? 0 : G.dip * 2);
          if (age < settleEnd) { mode = 'settle'; const k = ease((age - duration) / G.settle); q = ravenPose('flare', 'sit', k); q.sq = q.sq.map(v => v * lerp(R.squash, 1, k)); }
          else if (age < turnEnd) { mode = 'turn'; const u = clamp01((age - settleEnd) / G.perchTurn); xy[1] -= G.hopHeight * Math.sin(Math.PI * u); setFacing(b, b.side, t, true); }
          else {
            setFacing(b, b.side, t, true);
            if (!hearing) {
              mode = 'setdown'; const u = clamp01((age - turnEnd) / (G.dip * 2)); q.head = G.dipAngle * Math.sin(Math.PI * u);
              const k = R.birdScale, bill = [xy[0] + b.side * (G.N[0] + G.itemAt[0]) * k, xy[1] + (G.N[1] + G.itemAt[1]) * k], target = [xy[0] + b.side * G.gift[0], xy[1] + G.gift[1]];
              if (!b.giftDown) { b.giftDown = true; gifts.appendChild(b.item); b.giftTs = t; b.giftAlpha = 1; }
              b.giftPos = bill.map((v, j) => lerp(v, target[j], ease(u)));
              attr(b.item, 'transform', 'translate(' + b.giftPos.join(' ') + ') scale(' + b.side * k + ' ' + k + ')'); attr(b.item, 'opacity', 1);
            }
            if (age >= end) { b.done = true; mode = 'sit'; }
          }
        }
      } else {
        const locked = flying || hearing || o.stage === 'reel';
        if (!locked) {
          const pointer = FD.hover && t - FD.pointerT <= FIND_PLAY.fresh ? toMap(FD.pointer) : null, base = G.PERCHES[b.i], bx = f.x + base[0] * R.scale, by = f.y + base[1] * R.scale;
          const shy = !FD.rm && pointer && o.awake && (pointer[0] - bx) * b.side < 0 && Math.hypot(pointer[0] - bx, pointer[1] - by) < R.near ? R.shy : 0;
          if (shy !== b.shyTo) { b.shyFrom = b.shy; b.shyTo = shy; b.shyTs = t; }
          const u = clamp01((t - b.shyTs) / G.shyTime); b.shy = lerp(b.shyFrom, b.shyTo, ease(u)); xy = baseAt(b); xy[1] -= Math.abs(b.shyTo - b.shyFrom) / R.shy * G.hopHeight * Math.sin(Math.PI * u);
        }
        let angle = p ? Math.atan2(p[1] - f.y - xy[1] * R.scale, (p[0] - f.x - xy[0] * R.scale) * b.side) * FIND_PLAY.kit.deg / Math.PI : Math.sin(t * R.idle[0] + b.i) * R.headLimit * R.idle[1];
        angle = Math.max(-R.headLimit, Math.min(R.headLimit, angle));
        b.angle = FD.rm ? 0 : lerp(b.angle, angle, Math.min(1, dt * R.headEase));
        const tuck = b.i === o.preenBird && !FD.rm ? Math.sin(Math.PI * clamp01((t - o.preenTs) / R.preenTime)) : 0;
        q.head = lerp(b.angle, R.preenAngle, tuck); headMove = G.preenMove.map(v => v * tuck);
        const ruffle = FD.rm ? 0 : Math.sin(Math.PI * clamp01((t - o.ruffleTs) / R.ruffle[1])), breathe = FD.rm ? 0 : G.breathe[0] * Math.sin(t * Math.PI * 2 / G.breathe[1] + b.i);
        q.sq = q.sq.map(v => v * (1 + (R.ruffle[0] - 1) * ruffle + breathe));
      }
      if (b.giftDown && !active) {
        // Only the overlay this bird brought keeps its item: Huginn's popup, Muninn's reel. The other bird's old item stays faded.
        if (b.i ? FD.sheetOwner === o : FD.popOwner === o) b.giftTs = t;
        b.giftAlpha = FD.rm ? 0 : 1 - clamp01((t - b.giftTs) / G.itemFade); attr(b.item, 'opacity', b.giftAlpha);
      }
      const T = ravenPoseTransforms(q);
      for (const part of ['body', 'near', 'far', 'legs']) attr(b[part], 'transform', T[part]);
      attr(b.head, 'transform', 'translate(' + G.N.map((v, i) => v + headMove[i]).join(' ') + ') rotate(' + q.head + ')');
      attr(b.g, 'transform', 'translate(' + xy.join(' ') + ') rotate(' + rotate + ') scale(' + b.mirror * R.birdScale + ' ' + R.birdScale + ')');
      Object.assign(b, { xy, rotate, pose: q, mode });
    });
    if (flying && birds[o.activeBird].done) { o.stage = 'landing'; const index = o.activeBird; queueMicrotask(() => landed(index)); }
    if (hearing && birds.every(b => b.done)) o.stage = 'rest';
    if (o.stage === 'rest' && o.hearPending) { o.hearPending = false; start('hear', 0); }
    if (o.queued && o.stage === 'rest' && findReady(o.id)) {
      o.queued = false; o.stage = 'waiting';
      queueMicrotask(() => { o.stage = 'rest'; found(o.id); const index = o.next; o.next = 1 - index; if (FD.rm) landed(index); else start('flight', index); });
    }
    if (o.stage === 'reel') {
      if (FD.sheetOwner !== o) o.stage = 'rest';
      else {
        const e = t - o.ts, grow = FD.rm ? 1 : out3(e / FIND_PLAY.kit.sheet.grow), from = FD.sheetFrom;
        const fit = Math.min(1, (Math.min(VIEW.w, VIEW.h) - FIND_PLAY.kit.sheet.edge) / R.reel.iris);
        FD.sheet.style.transform = 'translate(' + lerp(from[0], VIEW.w / 2, grow) + 'px,' + lerp(from[1], VIEW.h / 2 - FIND_PLAY.kit.sheet.offset, grow) + 'px) scale(' + lerp(FIND_PLAY.kit.sheet.from, fit, grow) + ')';
        const q = clamp01((e - (FD.rm ? 0 : FIND_PLAY.kit.sheet.grow)) / FIND_TIMING.reel), digits = Math.min(FIND_TIMING.reel, Math.floor(q * FIND_TIMING.reel));
        if (digits !== o.digits) { o.digits = digits; const tc = o.tc; queueMicrotask(() => { if (tc.isConnected) tc.textContent = findFormat(R.reel.tc, { n: digits, end: FIND_COPY.ravenTime[1] }); }); }
        if (!FD.rm) o.sh.forEach((s, i) => { const M = R.reel.motion; s.style.transform = 'translate(' + Math.sin(e * (M[0] + i * M[1]) + i * M[2]) * M[3] + 'px,' + Math.cos(e * (M[4] + i * M[5]) + i) * M[6] + 'px) rotate(' + e * M[7] * (i - 1) + 'deg)'; });
        const end = FD.rm ? q === 1 ? 1 : 0 : clamp01((e - FIND_PLAY.kit.sheet.grow - FIND_TIMING.reel) / FIND_TIMING.iris), iris = Math.max(Number.EPSILON, 1 - ease(end));
        o.iris.style.transform = 'scale(' + iris + ')'; o.irisIn.style.transform = 'scale(' + 1 / iris + ')';
        if (end === 1) queueMicrotask(() => closeSheet(true));
      }
    }
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
