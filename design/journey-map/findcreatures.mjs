// Part A: thought and memory return; deadlines become a three-poke chase.
import { STOPS, MAP, FIND_COPY, FIND_PLAY, FIND_TIMING, RAVEN_RIG, COPY } from './data.mjs';
import { JORM, jormPoint, jormSegment, jormSubTail, ravenPose, ravenPoseTransforms } from './art.mjs';
import { clamp01, lerp, VIEW } from './trip.mjs';
import { FD, FIND_BY, ease, out3, fEsc, attr, toMap, found, opened, press, showPop, closePop, closeSheet, attend, findBits, findFormat, findRange, findSheet, findSlot, findReady, findStyle, findSheetFrame, findIdleTime, findIdleDelta, findIdleVisible } from './findkit.mjs';

export function findRavens(svg) {
  const R = FIND_PLAY.raven, G = RAVEN_RIG, f = FIND_BY.ravens, el = svg.querySelector('#f-ravens'), gifts = el.querySelector('.rv-gifts');
  const birds = [...el.querySelectorAll('.rv-a, .rv-b')].map((g, i) => ({ g, i, side: i ? 1 : -1, head: g.querySelector('.rv-head'), body: g.querySelector('.rv-body'), near: g.querySelector('.rv-near'), far: g.querySelector('.rv-far'), legs: g.querySelector('.rv-legs'), item: g.querySelector('.rv-item'), angle: 0, landTs: -Infinity, shy: 0, shyTo: 0, shyFrom: 0, shyTs: -Infinity, mirror: i ? 1 : -1, face: i ? 1 : -1, faceTs: -Infinity, turnTs: -Infinity, giftAlpha: 0, giftTs: -Infinity }));
  const scratches = [...el.querySelectorAll('.rv-tally path')];
  const o = { id: f.id, el, birds, stage: 'rest', next: 0, thoughts: 0, tally: 0, kept: false, ts: -Infinity, queued: false, preenAt: FD.now + findRange(R.preen), preenBird: 0, preenTs: -Infinity, ruffleTs: -Infinity };
  const rigEase = value => { const q = clamp01(value); return q * q * (3 - 2 * q); };
  birds.forEach(b => { b.item.innerHTML = b.i ? R.frameArt : R.thoughtArt; attr(b.item, 'transform', 'translate(' + G.itemAt.join(' ') + ')'); });
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
      b.shed = false;
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
  o.reduce = () => {
    if (!['flight','hear','landing'].includes(o.stage) && !o.queued) return;
    if (o.stage === 'flight' || o.stage === 'landing') o.next = o.activeBird;
    o.stage = 'rest'; o.queued = o.hearPending = false;
    birds.forEach(b => { b.done = true; b.shy = b.shyTo = b.shyFrom = 0; b.face = b.mirror = b.want = b.side; b.lockedXY = null; b.giftDown = false; attr(b.item,'opacity',0); });
  };
  o.hear = () => { if (FD.rm) return; if (o.stage === 'rest') start('hear', 0); else o.hearPending = true; };
  o.onSheetClose = () => { o.stage = 'rest'; };
  o.onSheetReopen = () => { if (FD.now-o.ts < FIND_PLAY.kit.sheet.grow+FIND_TIMING.reel) return; o.ts=FD.now-FIND_PLAY.kit.sheet.grow; if (!FD.rm) { const ring=FD.sheet.querySelector('.ring-p'); ring.getAnimations().forEach(a=>a.cancel()); ring.animate([{strokeDashoffset:R.reel.ring},{strokeDashoffset:0}],{duration:FIND_TIMING.reel*1000,fill:'forwards'}); } };
  o.undo = () => { if (FD.sheetOwner === o) closeSheet(); if (FD.popOwner === o) closePop(); };
  const reel = anchor => {
    const shown = findSheet(o, 'reel', '<div class="iris"><div class="iris-in"><div class="player" role="img" aria-label="' + fEsc(FIND_COPY.reelLabel) + '"><p class="reel-k pop-k">' + fEsc(FIND_COPY.muninn) + '</p><i class="sh sh1"></i><i class="sh sh2"></i><i class="sh sh3"></i><div class="reel-slot">' + findSlot(FIND_COPY.reelToCome) + '</div>' + R.reel.ringSvg + '<span class="tc">' + FIND_COPY.ravenTime.join(R.reel.timeJoin) + '</span></div></div></div><button type="button" class="reel-close">' + fEsc(COPY.close) + '</button>', anchor);
    if (!shown) { o.stage = 'rest'; return; }
    FD.sheet.querySelector('.reel-close')?.addEventListener('click', () => closeSheet());
    o.iris = FD.sheet.querySelector('.iris'); o.irisIn = FD.sheet.querySelector('.iris-in'); o.sh = [...FD.sheet.querySelectorAll('.sh')]; o.tc = FD.sheet.querySelector('.tc');
    if (!FD.rm) FD.sheet.querySelector('.ring-p').animate([{ strokeDashoffset: R.reel.ring }, { strokeDashoffset: 0 }], { duration: FIND_TIMING.reel * 1000, fill: 'forwards' });
    o.stage = 'reel'; o.ts = o.motionTs = FD.now;
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
    const idle=findIdleTime(birds[0].g);
    const p = attend(o, R.attend), flying = o.stage === 'flight', hearing = o.stage === 'hear';
    if (o.awake && !o.wasAwake) o.ruffleTs = t; o.wasAwake = o.awake;
    if (!FD.rm && idle >= o.preenAt && (o.stage === 'rest' || o.stage === 'reel')) { o.preenTs = idle; o.preenBird = 1 - o.preenBird; o.preenAt = idle + findRange(R.preen); }
    birds.forEach(b => {
      if(FD.idleOnly&&!findIdleVisible(b.g))return;
      const idle=findIdleTime(b.g),idleDt=findIdleDelta(b.g);
      const active = hearing || flying && b.i === o.activeBird, age = t - b.startTs, duration = hearing ? G.loopTakeoff + G.loopTime : G.crouch + R.out + R.away + R.back;
      let xy = active ? b.flightBase.slice() : (flying || hearing || o.stage === 'reel') && b.lockedXY ? b.lockedXY.slice() : baseAt(b), q = ravenPose('sit', 'sit', 0), rotate = 0, headMove = [0, 0], mode = 'sit';
      if (active && age >= 0 && !b.done) {
        const liftTime = hearing ? G.loopTakeoff : G.crouch;
        if (age < liftTime) { mode = 'crouch'; q = ravenPose('sit', 'unfold', ease(age / liftTime)); }
        else if (age < duration) {
          if (!b.shed) {
            b.shed = true;
            // The tail is behind the outward-facing bird; shed only when its wings actually lift.
            const tail = G.featherAt;
            findBits('feather', f.x + (b.flightBase[0] - b.side * tail[0]) * R.scale, f.y + (b.flightBase[1] + tail[1]) * R.scale, R.feathers, FIND_PLAY.bits.feathers);
          }
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
        let angle = p ? Math.atan2(p[1] - f.y - xy[1] * R.scale, (p[0] - f.x - xy[0] * R.scale) * b.side) * FIND_PLAY.kit.deg / Math.PI : Math.sin(idle * R.idle[0] + b.i) * R.headLimit * R.idle[1];
        angle = Math.max(-R.headLimit, Math.min(R.headLimit, angle));
        b.angle = FD.rm ? 0 : lerp(b.angle, angle, Math.min(1, (FD.idleOnly?idleDt:dt) * R.headEase));
        const tuck = b.i === o.preenBird && !FD.rm ? Math.sin(Math.PI * clamp01((idle - o.preenTs) / R.preenTime)) : 0;
        q.head = lerp(b.angle, R.preenAngle, tuck); headMove = G.preenMove.map(v => v * tuck);
        const ruffle = FD.rm ? 0 : Math.sin(Math.PI * clamp01((t - o.ruffleTs) / R.ruffle[1])), breathe = FD.rm ? 0 : G.breathe[0] * Math.sin(idle * Math.PI * 2 / G.breathe[1] + b.i);
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
        const e = t - o.ts;
        const fit = Math.min(1, (Math.min(VIEW.w, VIEW.h) - FIND_PLAY.kit.sheet.edge) / R.reel.iris);
        findSheetFrame(o, fit, VIEW.h / 2 - FIND_PLAY.kit.sheet.offset, o.iris, o.irisIn);
        const q = clamp01((e - (FD.rm ? 0 : FIND_PLAY.kit.sheet.grow)) / FIND_TIMING.reel), digits = Math.min(FIND_TIMING.reel, Math.floor(q * FIND_TIMING.reel));
        if (digits !== o.digits) { o.digits = digits; const tc = o.tc; queueMicrotask(() => { if (tc.isConnected) tc.textContent = findFormat(R.reel.tc, { n: digits, end: FIND_COPY.ravenTime[1] }); }); }
        if (!FD.rm) o.sh.forEach((s, i) => { const M = R.reel.motion, mt = t - (o.motionTs ?? o.ts); findStyle(s, 'transform', 'translate(' + Math.sin(mt * (M[0] + i * M[1]) + i * M[2]) * M[3] + 'px,' + Math.cos(mt * (M[4] + i * M[5]) + i) * M[6] + 'px) rotate(' + mt * M[7] * (i - 1) + 'deg)'); });
        if (q === 1 && !FD.sheetClosing) queueMicrotask(() => closeSheet());
      }
    }
  };
  return o;
}
export function findSerpent(svg) {
  const f = FIND_BY.serpent, S = FIND_PLAY.serpent, el = svg.querySelector('#f-serpent'), head = el.querySelector('.jg-head'), jaw = el.querySelector('.jg-jaw'), eye = el.querySelector('.jg-eye'), shut = el.querySelector('.jg-shut');
  const file = el.querySelector('.jg-file'), name = el.querySelector('.jf-name'), base = name.querySelector('.jf-base'), added = name.querySelector('.jf-added'), ext = name.querySelector('.jf-ext'), stamp = file.querySelector('.jf-stamp');
  const body = (document.getElementById('b-sea') || svg).querySelector('.jo-body'), segments = [...body.querySelectorAll('.jo-surface')], ripple = body.querySelector('.jo-release-ripple');
  const swells = [...body.querySelectorAll('.jg-swell')].map(g => ({ g, gulp: g.querySelector('.jg-gulp'), lines: g.querySelector('.jg-file-lines'), hearPath: g.querySelector('.jg-hear'), live: false, u: 0 }));
  const o = { id: f.id, el, stage: 'ready', pokes: 0, round: 0, kept: false, ts: -Infinity, headAngle: 0, headTurn: 0, jawAngle: 0, tailOut: 0, queued: 0, held: false, hearTs: -Infinity, openAmount: 0, stamped: false, fileName: '', version: 0, swells };
  let neck=jormSegment(0).neck;const skin=head.querySelector('.jg-skin'),crown=head.querySelector('.jg-crown'),neckEdge=head.querySelector('.jg-neck-edge'),stripes=head.querySelector('.jg-neck-stripes'),stud=head.querySelector('.jg-neck-stud'),skinD=skin.getAttribute('d'),crownD=crown.getAttribute('d');
  const joinNeck=angle=>{const a=-angle*Math.PI/180,c=Math.cos(a),s=Math.sin(a),rotate=p=>[p[0]*c-p[1]*s,p[0]*s+p[1]*c],point=p=>p.map(v=>+v.toFixed(4)).join(' '),edge=p=>({p:rotate(p),v:rotate(p.slice(2))}),top=edge(neck.upper),bottom=edge(neck.lower),control=e=>e.p.map((v,i)=>v-e.v[i]*3.5),upper=rotate(neck.stripeUpper),lower=rotate(neck.stripeLower);
    attr(skin,'d',skinD.replace('M33 -8C25 -14.6','M'+point(top.p)+'C'+point(control(top))).replace('L33 8Z','L'+point(bottom.p)+'Z'));
    attr(crown,'d',crownD.replace('M33 -8C25 -14.6','M'+point(top.p)+'C'+point(control(top))));
    attr(neckEdge,'d','M16 9C22 8.6 '+point(control(bottom))+' '+point(bottom.p));
    attr(stripes,'d','M28.5 -3.1Q30 -3.1 '+point(upper)+'M28.1 3.7Q30 3.7 '+point(lower));const middle=upper.map((v,i)=>(v+lower[i])/2),at=middle.map((v,i)=>lerp([28.5,.3][i],v,.55));attr(stud,'cx',at[0]);attr(stud,'cy',at[1]);
  };
  let dirty = new Set(), tailPose = 0;
  o.place = () => [f.x, f.y];
  const rename = (version, q = 1) => {
    const names=FIND_COPY.serpentNames,target=names[Math.min(version,names.length-1)],old=names[Math.max(0,version-1)];let common=0;while(common<old.length&&common<target.length&&old[common]===target[common])common++;
    const a=version?target.slice(0,common):target,suffix=version?target.slice(common):'',part=suffix.slice(0,Math.floor(suffix.length*clamp01(q))),extension='.'+S.files[o.round%S.files.length];
    if(base.textContent!==a)base.textContent=a;if(added.textContent!==part)added.textContent=part;if(ext.textContent!==extension)ext.textContent=extension;o.fileName=a+part+extension;if(q===1)o.version=version;
  };
  const caption = () => { const text = o.stage === 'asleep' ? FIND_COPY.serpentShippedHint : FIND_COPY.hints.serpent; if (FD.hint && FD.focusId === o.id && FD.hint.textContent !== text) FD.hint.textContent = text; };
  const reward = () => {
    o.stage = 'asleep'; o.kept = true; o.openAmount = o.tailOut = 1; o.stamped = true; o.shippedAt = FD.now; o.held = false; o.playing = false; caption();
    queueMicrotask(() => showPop(o, [f.x + S.popup[0], f.y + S.popup[1]], '<p class="pop-k">' + fEsc(FIND_COPY.serpentFed) + '</p>' + findSlot(FIND_COPY.serpentLines[o.round % FIND_COPY.serpentLines.length]), '', 'above'));
  };
  const swell = (duration, horn = false) => { const slot = swells.find(s => !s.live); if (slot && !FD.rm) Object.assign(slot, { live: true, ts: FD.now, duration, horn, u: 0 }); };
  const consumeQueue = () => { if (!o.queued) return; o.queued--; queueMicrotask(start); };
  const start = () => {
    // The capture listener brings him into view. This press never also feeds him.
    if (!findReady(o.id)) return;
    if (FD.rm && !o.rmFocused) { o.rmFocused = true; return; }
    if (['bite','lap','spit','typing','opening','waking'].includes(o.stage)) { o.queued++; return; }
    closePop(); opened(o);
    if (o.stage === 'asleep') {
      o.round++; o.pokes = 0; o.kept = false; o.stamped = false; o.ts = FD.now; o.stage = FD.rm ? 'ready' : 'waking'; rename(0); if (FD.rm) o.openAmount = o.tailOut = 0; o.playing = !FD.rm; return;
    }
    found(o.id); o.pokes++; o.ts = FD.now; o.held = o.pokes < FIND_COPY.serpentNames.length; o.playing = !FD.rm;
    if (o.pokes === FIND_COPY.serpentNames.length) { o.stage = 'opening'; if (FD.rm) reward(); }
    else { o.stage = FD.rm ? 'ready' : 'bite'; if (FD.rm) rename(o.pokes); }
  };
  press(el, start); rename(0);
  o.undo = () => { if (FD.popOwner === o) closePop(); };
  o.reduce = keep => {
    swells.forEach(s => s.live = false); o.queued = 0; o.held = false; o.playing = false;
    if (o.stage === 'opening') { if (keep) opened(o); reward(); }
    else if (o.stage === 'waking') { o.stage = 'ready'; o.openAmount = o.tailOut = 0; rename(0); }
    else if (['bite','lap','spit','typing'].includes(o.stage)) { o.stage = 'ready'; o.openAmount = o.tailOut = 0; rename(o.pokes); }
  };
  o.hear = () => { if (!FD.rm) { o.hearTs = FD.now; swell(S.hear[2], true); o.playing = true; } };
  const lapPlace = q => {
    const X = S.lapStops, Y = S.lapPlaces, M = S.lapSlopes; let i = 0; while (i < X.length - 2 && q > X[i + 1]) i++;
    const width = X[i + 1] - X[i], t = (q - X[i]) / width;
    return (2*t**3-3*t*t+1)*Y[i] + (t**3-2*t*t+t)*width*M[i] + (-2*t**3+3*t*t)*Y[i+1] + (t**3-t*t)*width*M[i+1];
  };
  const updateBody = lumps => {
    const next = new Set(); for (const p of lumps) MAP.jorm.surf.forEach(([a, b], i) => { if (p.u >= a - .015 && p.u <= b + .015) next.add(i); });
    if (o.openAmount !== tailPose) { next.add(4); const p = jormSubTail(o.openAmount); attr(body.querySelector('.jo-sub-fill.jo-tail-sub'), 'd', p.fill); attr(body.querySelector('.jo-sub-edge.jo-tail-sub'), 'd', p.edge); }
    for (const i of new Set([...dirty, ...next])) { const p = jormSegment(i, i === 4 ? o.openAmount : 0, lumps); if(i===0)neck=p.neck; for (const [selector, key] of [['.jo-outline','outer'],['.jo-inner','inner'],['.jo-bands','bands'],['.jo-studs','studs']]) attr(segments[i].querySelector(selector), 'd', p[key]); }
    dirty = next; tailPose = o.openAmount;
  };
  o.tick = (t, dt) => {
    const idle=findIdleTime(file),headIdle=findIdleTime(head);
    const e = t - o.ts, target = attend({x:f.x+S.head[0],y:f.y+S.head[1]}, S.attend), here = [f.x+S.head[0],f.y+S.head[1]];
    let aim = target ? Math.atan2(-(target[1]-here[1]),-(target[0]-here[0]))*180/Math.PI : 0; aim = Math.max(-S.headLimit,Math.min(S.headLimit,aim));
    o.headAngle = FD.rm ? 0 : lerp(o.headAngle,aim,Math.min(1,(FD.idleOnly?findIdleDelta(head):dt)*S.headEase));
    let angle = o.stage === 'asleep' ? (FD.rm ? 0 : S.breathe[0]*Math.sin(Math.PI*2*headIdle/S.breathe[1])) : o.headAngle, jawTurn = o.stage === 'asleep' ? S.shippedJaw : 0, at = S.fileAt.slice(), rotation = 0, scale = 1, alpha = 1, nameAlpha = 1;
    if (o.stage === 'bite') { const q = clamp01(e/S.bite); jawTurn = S.jaw*Math.sin(Math.PI*q); at = S.fileAt.map((v,i)=>lerp(v,[-40,5][i],ease(q))); scale = 1-ease(q); rotation = -8*q; nameAlpha = 1-q; if(q===1){o.stage='lap';o.ts=t;o.held=false;swell(S.lap);} }
    if (o.stage === 'lap') { alpha = nameAlpha = 0; jawTurn = 2; }
    if (o.stage === 'spit') { const q = clamp01(e/S.spit); at = [-38,5].map((v,i)=>lerp(v,S.returnAt[i],out3(q))); rotation = -8*Math.sin(Math.PI*q); jawTurn = 8*Math.sin(Math.PI*q); nameAlpha = q; if(q===1){o.stage='typing';o.ts=t;} }
    if (o.stage === 'typing') { at = S.returnAt.map((v,i)=>lerp(v,S.fileAt[i],ease(e/S.type))); rename(o.pokes,clamp01(e/S.type)); if(e>=S.type){rename(o.pokes);o.stage='ready';consumeQueue();} }
    if (o.stage === 'opening') { const q = FD.rm ? 1 : ease(e/S.open); o.openAmount=o.tailOut=q; at=S.fileAt.map((v,i)=>lerp(v,S.shipAt[i],q));jawTurn=S.shippedJaw*q;if(q===1)reward(); }
    if (o.stage === 'asleep') { at=S.shipAt.slice();jawTurn=S.shippedJaw; }
    if (o.stage === 'waking') { const q=clamp01(e/S.wake);o.openAmount=o.tailOut=1-ease(q);at=S.enterAt.map((v,i)=>lerp(v,S.fileAt[i],out3(q)));alpha=q;nameAlpha=q;jawTurn=S.shippedJaw*(1-ease(q));if(q===1){o.stage='ready';consumeQueue();} }
    const lumps=[];
    swells.forEach(s=>{
      if(!s.live){attr(s.g,'opacity',0);return;}
      const q=clamp01((t-s.ts)/s.duration),u=s.horn?ease(q):lapPlace(q),p=jormPoint(u*JORM.L),surface=Math.max(0,...MAP.jorm.surf.map(([a,b])=>Math.max(0,Math.min(1,(u-a)*JORM.L/MAP.jorm.swellRamp,(b-u)*JORM.L/MAP.jorm.swellRamp))));s.u=u;lumps.push({u,horn:s.horn});
      attr(s.g,'transform','translate('+p.x+' '+p.y+') rotate('+p.angle+')');attr(s.g,'data-u',u);attr(s.g,'opacity',Math.min(1,u*JORM.L/3,(1-u)*JORM.L/3)*lerp(MAP.jorm.swellSub,1,surface));attr(s.gulp,'opacity',s.horn?0:1);attr(s.lines,'opacity',s.horn?0:1);attr(s.hearPath,'opacity',s.horn?1:0);
      if(q===1){s.live=false;if(!s.horn){o.stage='spit';o.ts=t;rename(o.pokes,0);} }
    });
    updateBody(lumps);attr(ripple,'opacity',FD.rm||o.openAmount===0?0:.55*Math.sin(Math.PI*o.openAmount));
    const heard=FD.rm?1:clamp01((t-o.hearTs)/S.hear[1]);angle+=S.hear[0]*Math.sin(Math.PI*heard);
    const sleeping=o.stage==='asleep';o.headTurn=angle;o.jawAngle=jawTurn;attr(head,'transform','rotate('+angle+')');joinNeck(angle);attr(jaw,'transform','rotate('+(-jawTurn)+' '+S.jawPivot.join(' ')+')');attr(eye,'opacity',sleeping?0:1);attr(shut,'opacity',sleeping?1:0);
    const bob=FD.rm||!['ready','typing'].includes(o.stage)?0:Math.sin(Math.PI*2*idle/S.bob[2]);at[1]+=S.bob[1]*bob;rotation+=S.bob[0]*bob;const phoneScale=VIEW.phone?Math.min(1,S.filePhone/(15*FD.st.cam.s)):1;
    attr(file,'transform','translate('+at.join(' ')+') rotate('+rotation+') scale('+(scale*phoneScale)+')');attr(file,'opacity',alpha);attr(stamp,'opacity',o.stamped?1:0);attr(stamp,'transform','translate(.5 1.2) rotate(-14) scale('+(1/phoneScale)+')');attr(name,'x',at[0]+S.shipName[0]*o.openAmount);attr(name,'y',at[1]+S.nameDy+S.shipName[1]*o.openAmount);attr(name,'font-size',lerp(S.nameSize,S.shipName[2],o.openAmount)*(VIEW.phone&&(o.version>=4||o.pokes>=4&&['spit','typing'].includes(o.stage))?S.namePhone:1));attr(name,'opacity',nameAlpha);
    o.zoomFrame();
    attr(el,'data-revision-state',o.stage);attr(el,'data-loop-open',o.openAmount);attr(el,'data-file',o.fileName);caption();if(o.stage==='asleep'&&o.queued&&t-o.shippedAt>=S.queueRest)consumeQueue();o.playing=['bite','lap','spit','typing','opening','waking'].includes(o.stage)||swells.some(s=>s.live)||o.stage==='asleep'&&o.queued>0;
  };
  // The carved detail follows the zoom. While a moving camera quiets the finds (finds.mjs), it is redrawn only with the map's
  // own redraws, so it never adds one.
  o.zoomFrame = part => { const F=FIND_PLAY.focus,close=Math.max(Math.max(VIEW.s0,F.least*VIEW.sT),Math.min(F.most*VIEW.sT,F.fill*Math.min(VIEW.w,VIEW.h)/(2*f.view[2]))),detail=clamp01((FD.st.cam.s-VIEW.s0)/(close-VIEW.s0||1));if(part!=='head')findStyle(body,'--jo-detail',detail);if(part!=='body')findStyle(head,'--jo-detail',detail); };
  return o;
}
