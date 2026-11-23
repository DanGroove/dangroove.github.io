// Part A: thought and memory return; deadlines become a three-poke chase.
import { C, STOPS, MAP, FIND_COPY, FIND_PLAY, FIND_TIMING } from './data.mjs';
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
  const f = FIND_BY.serpent, el = svg.querySelector('#f-serpent'), inner = el.querySelector('.sp-swim'), loops = [...el.querySelectorAll('.sp-loop')], head = el.querySelector('.sp-head'), leaf = el.querySelector('.sp-leaf'), eye = el.querySelector('.sp-eye'), shut = el.querySelector('.sp-shut'), tongue = el.querySelector('.sp-tongue');
  const o = { id: f.id, el, stage: 'up', pokes: 0, round: 0, spot: 0, kept: false, ts: -Infinity, headAngle: 0, current: FIND_PLAY.serpent.spots[0].slice(), hearTs: -Infinity, wakeTs: -Infinity };
  o.place = () => o.current.slice();
  const start = () => {
    if (!['up', 'asleep'].includes(o.stage)) return;
    if (o.stage === 'asleep') { o.stage = 'waking'; o.ts = FD.now; o.pokes = 0; o.round++; o.kept = false; return; }
    o.pokes++; o.stage = 'chase'; o.ts = FD.now; o.from = o.current.slice(); o.toSpot = (o.spot + 1) % FIND_PLAY.serpent.spots.length; o.to = FIND_PLAY.serpent.spots[o.toSpot].slice(); o.dropSent = new Set(); o.nextWake = 0;
    const texts = FIND_COPY.serpentLeaves[o.pokes - 1]; el.querySelector('.sp-day').textContent = texts[0]; el.querySelector('.sp-date').textContent = texts[1];
    attr(leaf, 'opacity', 0); closePop(); found(o.id); opened(o);
  };
  press(el, start); o.undo = () => { if (FD.popOwner === o) closePop(); };
  o.hear = () => o.hearTs = FD.now;
  o.tick = (t, dt) => {
    const S = FIND_PLAY.serpent, e = t - o.ts, asleep = o.stage === 'asleep', here = { x: o.current[0] + S.head[0] * S.scale, y: o.current[1] + S.head[1] * S.scale }, target = attend(here, S.attend);
    let angle = target ? Math.atan2(target[1] - here.y, target[0] - here.x) * FIND_PLAY.kit.deg / Math.PI - FIND_PLAY.kit.deg : 0;
    angle = ((angle + FIND_PLAY.kit.turn * 1.5) % FIND_PLAY.kit.turn) - FIND_PLAY.kit.deg; angle = Math.max(-S.headLimit, Math.min(S.headLimit, angle));
    o.headAngle = FD.rm ? angle : lerp(o.headAngle, angle, Math.min(1, dt * S.headEase));
    let headTurn = asleep ? S.restAngle : o.headAngle, offsets = loops.map((g, j) => FD.rm ? 0 : S.bob[0] * Math.sin(Math.PI * 2 * (t / S.bob[1] - j / loops.length))), gulpAge = -Infinity;
    if (o.stage === 'chase') {
      const speed = S.speed[o.pokes - 1], sinkTotal = ((loops.length - 1) * S.sinkStep + S.sinkTime) * speed, sinkEnd = S.flinch + sinkTotal, swimEnd = sinkEnd + S.swim[o.pokes - 1], end = swimEnd + ((loops.length - 1) * S.surfStep + S.surfTime) * speed;
      const swim = FD.rm ? 1 : ease((e - sinkEnd) / S.swim[o.pokes - 1]);
      o.current = [lerp(o.from[0], o.to[0], swim), lerp(o.from[1], o.to[1], swim) - S.bulge * Math.sin(Math.PI * swim)];
      headTurn += S.rear * Math.sin(Math.PI * clamp01(e / S.flinch));
      offsets = loops.map((g, j) => {
        const down = FD.rm ? 1 : ease((e - S.flinch - j * S.sinkStep * speed) / (S.sinkTime * speed)), up = FD.rm ? 1 : ease((e - swimEnd - (loops.length - 1 - j) * S.surfStep * speed) / (S.surfTime * speed));
        if (down === 1 && !o.dropSent.has(j)) { o.dropSent.add(j); findBits('drop', o.from[0] + (j - loops.length / 2) * S.sink * S.scale, o.from[1], S.drops, FIND_PLAY.bits.drops); }
        return S.sink * down * (1 - up);
      });
      if (e >= sinkEnd && e < swimEnd && t >= o.nextWake) { o.nextWake = t + S.wakeGap; findBits('ring', o.current[0], o.current[1], 1, FIND_PLAY.bits.wake); }
      attr(leaf, 'opacity', e >= swimEnd || FD.rm ? 1 : 0);
      if (FD.rm || e >= end) { o.current = o.to.slice(); o.spot = o.toSpot; o.stage = o.pokes === S.spots.length ? 'eating' : 'up'; o.ts = t; }
    }
    if (o.stage === 'eating') {
      const age = t - o.ts, q = FD.rm ? 1 : clamp01((age - S.eatWait) / S.eatTime); gulpAge = age - S.eatWait - S.eatTime;
      attr(leaf, 'transform', `translate(${lerp(S.leaf[0], S.head[0], q)} ${lerp(S.leaf[1], S.head[1], q)}) scale(${1 - q})`);
      if (FD.rm || gulpAge >= loops.length * S.gulp[0] + S.gulp[1]) {
        o.stage = 'asleep'; o.kept = true; o.ts = t; attr(leaf, 'opacity', 0);
        queueMicrotask(() => showPop(o, () => [o.current[0] + S.popup[0] * S.scale, o.current[1] + S.popup[1] * S.scale], `<p class="pop-k">${fEsc(FIND_COPY.serpentFed)}</p>${findSlot(FIND_COPY.serpentLines[o.round % FIND_COPY.serpentLines.length])}`));
      }
    } else attr(leaf, 'transform', `translate(${S.leaf[0]} ${S.leaf[1]}) rotate(${S.leaf[2] + (FD.rm ? 0 : S.flutter[0] * Math.sin(Math.PI * 2 * S.flutter[1] * t))})`);
    if (o.stage === 'waking' && (FD.rm || e >= S.wake)) o.stage = 'up';
    const sleeping = o.stage === 'asleep';
    const heard = t - o.hearTs; if (!FD.rm && heard < S.hear[1]) headTurn += S.hear[0] * Math.sin(Math.PI * heard / S.hear[1]);
    attr(eye, 'opacity', sleeping && heard >= S.hear[2] ? 0 : 1); attr(shut, 'opacity', sleeping && heard >= S.hear[2] ? 1 : 0);
    loops.forEach((g, j) => { const order = loops.length - 1 - j, pulse = FD.rm ? 0 : Math.sin(Math.PI * clamp01((gulpAge - order * S.gulp[0]) / S.gulp[1])); const settle = sleeping ? S.settle + (FD.rm ? 0 : S.breathe[0] * Math.sin(Math.PI * 2 * t / S.breathe[1])) : offsets[j]; attr(g, 'transform', `translate(0 ${settle}) scale(${1 + (S.gulp[2] - 1) * pulse})`); });
    attr(head, 'transform', `rotate(${sleeping ? S.restAngle : headTurn} ${S.pivot[0]} ${S.pivot[1]})`);
    const near = attend(here, S.near), tongueAge = t % S.tongue[1], flick = !FD.rm && !sleeping && near && tongueAge < S.tongue[0] ? Math.sin(Math.PI * tongueAge / S.tongue[0]) : 0;
    attr(tongue, 'opacity', flick > 0 ? 1 : 0); attr(tongue, 'transform', `translate(${S.snout[0]} ${S.snout[1]}) scale(${flick} 1) translate(${-S.snout[0]} ${-S.snout[1]})`);
    attr(inner, 'transform', `translate(${(o.current[0] - f.x) / S.scale} ${(o.current[1] - f.y) / S.scale})`);
  };
  return o;
}
