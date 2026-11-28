// Part A: the instrument and the five persistent, hand-dug chests.
import { C, COPY, CRAFTS, STOPS, MAP, FIND_COPY, FIND_PLAY, PALETTES, COMB, EXPLORE, DEPTH } from './data.mjs';
import { clamp01, lerp, VIEW, TRIP_EL, labelScale } from './trip.mjs';
import { pieceIcon, hoardInside, mapLabelRows } from './art.mjs';
import { cardsSetCraft, arrowSvg } from './cards.mjs';
import { tlSetCraft } from './timeline.mjs';
import { JOURNEY, stepsFocus } from './steps.mjs';
import { findPointer, FD, FIND_BY, D, ease, out3, fEsc, attr, toMap, found, opened, press, showPop, closePop, attend, findBits, findSvg, findFormat, findRange, findLife, findAngleDelta, findReady, findHint, findStyle, findView, findIdleTime } from './findkit.mjs';

export const wayAllStops = () => STOPS.map(s => CRAFTS.every(c => s.crafts.includes(c)));
export function findWay(svg) {
  const f = FIND_BY.wayfinder, el = svg.querySelector('#f-wayfinder'), needle = el.querySelector('.wf-needle'), words = [...el.querySelectorAll('.wf-word')], arms = [...el.querySelectorAll('.wf-arm')], runes = el.querySelector('.wf-runes'), tally = el.querySelector('.wf-tally'), ring = el.querySelector('.wf-all');
  const o = { id: f.id, el, craft: -1, angle: 0, speed: 0, runesAngle: 0, drag: false, picked: [], mask: null, kept: false, stage: 'rest', lines: [], lineTs: 0, hearTs: -Infinity };
  // COMB-T: the original text nodes retain their fade writers and input semantics.
  const wordLayer=document.createElement('div');wordLayer.id='compass-words';svg.closest('#map-stack')?.appendChild(wordLayer);
  const screenWords=[...words,tally].map((text,i)=>{
    const shell=findSvg('svg',{class:'compass-word find','data-find-proxy':'wayfinder'}),group=text.parentElement;
    attr(text,'font-size',i<4?COMB.wordPx:FIND_PLAY.way.tally[1]);attr(text,'letter-spacing',i<4?COMB.wordTrack:FIND_PLAY.way.tally[2]);attr(text,'x',i===0||i===2?COMB.wordTrack/2:i===3?COMB.wordTrack:0);attr(text,'y',0);
    shell.appendChild(group);wordLayer.appendChild(shell);
    if(i<4)for(const type of ['pointerdown','pointermove','pointerup','pointercancel','click','keydown'])shell.addEventListener(type,e=>{
      e.stopPropagation();if(type==='click')el.dispatchEvent(new MouseEvent(type,{bubbles:true,detail:e.detail,clientX:e.clientX,clientY:e.clientY}));
      else if(type==='keydown')el.dispatchEvent(new KeyboardEvent(type,{bubbles:true,key:e.key}));
      else el.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerId:e.pointerId,pointerType:e.pointerType,clientX:e.clientX,clientY:e.clientY,button:e.button,buttons:e.buttons}));
    });
    return {text,shell};
  });
  // Part 17c: only this frame writes the shells, so a write is skipped when unchanged and never read back (T1 keeps every
  // word in place on every frame, on screen or not).
  const wordStyle=(q,key,value)=>{const text=String(value),w=q.w||(q.w={});if(w[key]===text)return;w[key]=text;q.shell.style[key]=text;};
  o.compassFrame=()=>{
    if(!FD.st)return;const W=FIND_PLAY.way,c=FD.st.cam,shown=TRIP_EL.raster?.layerCams?.finds||c;
    // Match the ring's actual held raster and outer compositor camera.
    const ringScale=c.s,centre=[f.x*c.s+c.tx,f.y*c.s+c.ty],out=W.wordRing*ringScale+W.wordGap,cap=COMB.wordPx*W.wordCap,seen=o.el.style.visibility||'inherit',fade=1-(o.cover||0);
    for(const [i,q] of screenWords.entries()){
      if(q.copy!==q.text.textContent){q.copy=q.text.textContent;const b=q.text.getBBox();q.box=b;attr(q.shell,'viewBox',[b.x-4,b.y-4,b.width+8,b.height+8].join(' '));attr(q.shell,'width',b.width+8);attr(q.shell,'height',b.height+8);}
      const k=i<4?1:Math.max(W.tally[1]*ringScale,W.tally[3])/W.tally[1],b=q.box;
      const x=centre[0]+(i===1?out:i===3?-out:i===4?W.tally[2]*ringScale/2:0),y=centre[1]+(i===0?-out:i===2?out+cap:i===4?-(out+cap+W.wordGap):cap/2);
      wordStyle(q,'transform','translate('+(x+(b.x-4)*k)+'px,'+(y+(b.y-4)*k)+'px) scale('+k+')');
      wordStyle(q,'opacity',fade);wordStyle(q,'visibility',seen);
    }
    findStyle(wordLayer,'opacity',TRIP_EL.finds.style.opacity||1);
  };
  const group = document.getElementById('wf-lines');
  STOPS.forEach(s => {
    const target = MAP.waypoints[s.w], dx = target[0] - f.x, dy = target[1] - f.y, distance = Math.hypot(dx, dy), length = Math.max(0, distance - FIND_PLAY.way.short);
    const g = findSvg('g', { transform: `translate(${f.x} ${f.y}) rotate(${Math.atan2(dy, dx) * FIND_PLAY.kit.deg / Math.PI})` }), line = findSvg('path', { d: `M0 0H${length}`, fill: 'none', stroke: C.paper, 'stroke-width': FIND_PLAY.way.lineWidth, 'stroke-dasharray': FIND_PLAY.way.dash.join(' '), 'vector-effect': 'non-scaling-stroke', transform: 'scale(0 1)' });
    const ping = findSvg('circle', { class: 't', r: FIND_PLAY.way.pingR[0], opacity: 0 });
    const pg = findSvg('g', { transform: `translate(${target[0]} ${target[1]})` }); pg.appendChild(ping); g.appendChild(line); group.append(g, pg); o.lines.push({ line, ping, v: 0, lit: false, arrived: false });
  });
  const applyMask = mask => {
    o.mask = mask; cardsSetCraft(mask); tlSetCraft(mask);
    FD.list.hoards?.items.forEach(h => { const i = STOPS.findIndex(s => s.id === h.d.stop); h.setCraftLit(!!mask?.[i]); });
    const veil = document.getElementById('map-veil');
    if (!veil) return;
    if (!o.veilUpdate) {
      const frame = DEPTH.frame.outer, holes = document.getElementById('veil-holes');
      // The dim lives in the fill's own alpha, so the veil shows at opacity 1 and the lines inside it keep their full strength.
      attr(document.getElementById('veil-fill'), 'fill-opacity', 1 - FIND_PLAY.way.dim);
      for (const rect of [document.getElementById('veil-fill'), document.getElementById('veil-mask-frame'), document.getElementById('veil-mask')])
        for (const [key, value] of Object.entries({ x: frame[0], y: frame[1], width: frame[2]-frame[0], height: frame[3]-frame[1] })) attr(rect, key, value);
      // Part 17d: the lines are cut under the compass and its words by an even-odd clip (the frame with one hole per cut)
      // instead of a mask, which made every redraw of the growing lines draw the whole layer twice. The cuts never overlap.
      const cuts = document.getElementById('veil-line-cuts'), frameCut = 'M' + frame[0] + ' ' + frame[1] + 'H' + frame[2] + 'V' + frame[3] + 'H' + frame[0] + 'Z';
      // Part 17g: the cuts are kept as shapes too, so the veil's canvas cuts its lines without a path clip.
      cuts.__shapes = { frame: frame.slice(0, 4), circle: null, boxes: [] }; attr(cuts, 'd', frameCut);
      o.veilUpdate = destination => {
        const s = destination?.s || FD.st?.cam.s || VIEW.s0;
        if (!o.mask) return;
        o.veilScale = s; holes.replaceChildren();
        const cr=FIND_PLAY.way.wordRing+1/s; let cut=frameCut+'M'+(f.x-cr)+' '+f.y+'a'+cr+' '+cr+' 0 1 0 '+2*cr+' 0a'+cr+' '+cr+' 0 1 0 '+(-2*cr)+' 0Z';
        const shapes={frame:frame.slice(0,4),circle:[f.x,f.y,cr],boxes:[]};
        const W = FIND_PLAY.way;
        let compassRadius=FIND_PLAY.way.wordRing+2/s;
        for(const [i,word] of [...words,tally].entries()) { let a,z,width;
          if (destination) {
            const b=word.getBBox(), old=+word.getAttribute('font-size')||1, size=i<words.length?COMB.wordPx/s:Math.max(W.tally[1],W.tally[3]/s), k=size/old, out=W.wordRing+W.wordGap/s, cap=COMB.wordPx/s*W.wordCap, ls=+word.getAttribute('letter-spacing')||0;
            const x=i<words.length?[ls/(2*s),out,ls/(2*s),ls/s-out][i]:W.tally[2]/2, y=i<words.length?[-out,cap/2,out+cap,cap/2][i]:-(out+cap+W.wordGap/s);
            a=[f.x+x+(b.x-(+word.getAttribute('x')||0))*k-3/s,f.y+y+(b.y-(+word.getAttribute('y')||0))*k-3/s]; z=[a[0]+b.width*k+6/s,a[1]+b.height*k+6/s]; width=b.width;
          } else { const b=word.getBoundingClientRect();a=toMap([b.left-3,b.top-3]);z=toMap([b.right+3,b.bottom+3]);width=b.width; }
          if(width){cut+='M'+a[0]+' '+a[1]+'H'+z[0]+'V'+z[1]+'H'+a[0]+'Z';shapes.boxes.push([a[0],a[1],z[0],z[1]]);for(const x of[a[0],z[0]])for(const y of[a[1],z[1]])compassRadius=Math.max(compassRadius,Math.hypot(x-f.x,y-f.y));}}
        cuts.__shapes=shapes;attr(cuts,'d',cut);
        const hole = (x,y,r) => holes.appendChild(findSvg('circle', { cx:x, cy:y, r, fill:'url(#veil-soft)' }));
        // The clear core contains the entire instrument, including screen-sized words and title.
        hole(f.x, f.y, compassRadius / W.veilCore);
        STOPS.forEach((stop,i) => {
          if (!o.mask[i]) return;
          const p = MAP.waypoints[stop.w], boxes = [[p[0]-8,p[1]-8,p[0]+8,p[1]+8]];
          const h = FIND_COPY.hoards.find(h => h.stop === stop.id);
          if (h) boxes.push([h.x-22,h.y-30,h.x+22,h.y+12]);
          // Labels use their actual displayed geometry, converted back through the shared camera.
          for (const row of mapLabelRows()) if (row.stop === stop.id) {
            if (destination) {
              const r=TRIP_EL.rows?.find(r=>r.row.i===row.i), b=r?.box, k=labelScale(row.kind,s), q=Math.max(0,Math.min(1,(s/VIEW.s0-1.05)/.65)), blend=1-q*q*(3-2*q), at=r?.base?r.base.map((v,i)=>lerp(v,r.overview[i],blend)):[row.x,row.y];
              if(b)boxes.push([at[0]+b.x*k,at[1]+b.y*k,at[0]+(b.x+b.width)*k,at[1]+(b.y+b.height)*k]);
            } else { const b = document.querySelector('.label-anchor[data-row="'+row.i+'"]').getBoundingClientRect(), a = toMap([b.left,b.top]), z = toMap([b.right,b.bottom]); boxes.push([...a,...z]); }
          }
          const x0=Math.min(...boxes.map(b=>b[0])),y0=Math.min(...boxes.map(b=>b[1])),x1=Math.max(...boxes.map(b=>b[2])),y1=Math.max(...boxes.map(b=>b[3]));
          hole((x0+x1)/2,(y0+y1)/2,(Math.hypot(x1-x0,y1-y0)/2 + W.veilPad/s)/W.veilCore);
        });
      };
      veil.addEventListener('transitionend', e => { if (e.propertyName === 'opacity' && !o.mask) { veil.style.visibility='hidden'; veil.style.willChange=svg.style.willChange; } });
    }
    o.veilDirty = true;
    if (mask) { veil.style.visibility='visible'; veil.style.willChange = svg.style.willChange || 'opacity'; }
    veil.style.opacity = mask ? 1 : 0;
    if (FD.rm && !mask) { veil.style.visibility='hidden'; veil.style.willChange=svg.style.willChange; }
    // Part 17f: the lines are drawn in the veil's canvas (tripVeil), so they show, fade and hide with it.
  };
  const wayResultView = mask => { const points = [[f.x - 70, f.y - 60], [f.x + 70, f.y + 105], ...STOPS.filter((s,i) => mask[i]).map(s => MAP.waypoints[s.w])], xs = points.map(p=>p[0]), ys = points.map(p=>p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys); return [(x0+x1)/2, (y0+y1)/2, Math.max(x1-x0,y1-y0)/2+40, 0]; };
  const startLines = () => { o.lineTs = FD.now; o.linePhase = 'grow'; o.lines.forEach((l, i) => { l.lit = !!o.mask?.[i]; l.arrived = false; attr(l.line, 'stroke-dasharray', o.craft === CRAFTS.length ? 'none' : FIND_PLAY.way.dash.join(' ')); }); };
  const set = i => {
    if (i === CRAFTS.length && (!o.unlocked || !wayAllStops().some(Boolean))) i = -1;
    if (o.craft === i) return;
    o.craft = i; o.pickTs = FD.now;
    words.forEach((w, j) => w.classList.toggle('on', j === i || i === CRAFTS.length));
    arms.forEach((a, j) => a.classList.toggle('on', j === i || i === CRAFTS.length));
    const mask = i < 0 ? null : i === CRAFTS.length ? wayAllStops() : STOPS.map(s => s.crafts.includes(CRAFTS[i]));
    if (i >= 0) { o.kept = true; if (i < CRAFTS.length && !o.picked.includes(i)) o.picked.push(i); const unlocked = o.picked.length === CRAFTS.length && wayAllStops().some(Boolean); if(unlocked&&!o.unlocked)o.ringTs=FD.now; o.unlocked=unlocked; found(o.id); opened(o); }
    applyMask(mask);
    // With a craft chosen the lines have to be seen arriving, so on a wide screen the camera pulls back for them.
    document.documentElement.classList.toggle('jm-way', i >= 0);
    if (JOURNEY.focus === o.id) { const view=i<0?findView(o.id):wayResultView(mask); TRIP_EL.focusAim={id:o.id,view,serial:(TRIP_EL.focusAim?.serial||0)+1}; stepsFocus(o.id,view); }
    if (FD.say) FD.say.textContent = i < 0 ? f.label : findFormat(COMB.waySay, { craft: FIND_COPY.crafts[i] || FIND_COPY.wayAll.split(':')[0], names: STOPS.filter((s,j) => mask?.[j]).map(s => s.short).join(', ') });
    tally.textContent = i < 0 ? '' : i === CRAFTS.length ? findFormat(FIND_COPY.wayAll, { names: STOPS.filter((s, j) => mask[j]).map(s => s.short + ', ' + s.dates).join('; ') }) : findFormat(FIND_COPY.wayTally, { craft: FIND_COPY.crafts[i], n: mask.filter(Boolean).length, t: STOPS.length });
    if (FD.hint) FD.hint.textContent = i < 0 ? FIND_COPY.hints.wayfinder : FIND_COPY.wayPickedHint;
    o.retract = o.lines.map(l => l.v); o.lineTs = FD.now; o.linePhase = 'retract'; if (FD.rm || o.retract.every(v => v === 0)) { startLines(); if (FD.rm) o.lines.forEach(l => l.v = l.lit ? 1 : 0); }
  };
  const pick = e => {
    if (!Number.isFinite(e.clientX) || !Number.isFinite(e.clientY) || e.clientX === 0 && e.clientY === 0) return;
    const p = toMap([e.clientX, e.clientY]), dx = p[0] - f.x, dy = p[1] - f.y;
    if (Math.hypot(dx, dy) < FIND_PLAY.way.hub) { set(o.craft >= 0 ? -1 : o.unlocked ? CRAFTS.length : -1); return; }
    const angle = Math.atan2(dx, -dy) * FIND_PLAY.kit.deg / Math.PI; o.angle = angle; o.speed = 0;
    set(Math.round((angle % FIND_PLAY.kit.turn + FIND_PLAY.kit.turn) % FIND_PLAY.kit.turn / (FIND_PLAY.kit.turn / CRAFTS.length)) % CRAFTS.length);
  };
  findPointer(el, e => { o.drag = true; el.setPointerCapture(e.pointerId); pick(e); el._dragged = true; }, { drag: true, tap: pick, cancel: () => o.drag = false });
  el.addEventListener('pointermove', e => { if (o.drag) pick(e); });
  el.addEventListener('pointerup', () => o.drag = false); el.addEventListener('pointercancel', () => o.drag = false);
  el.addEventListener('click', e => { if (el._dragged) el._dragged = false; else pick(e); });
  el.addEventListener('keydown', e => {
    const count = CRAFTS.length + (o.unlocked ? 1 : 0);
    if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) { e.preventDefault(); const forward = ['ArrowRight', 'ArrowDown'].includes(e.key); set((o.craft + (forward ? 1 : count - 1) + count) % count); }
    else if (['Enter', ' '].includes(e.key)) { e.preventDefault(); set(o.craft >= 0 ? -1 : o.unlocked ? CRAFTS.length : -1); }
  });
  o.undo = () => set(-1); o.onEscape = () => { if (o.craft >= 0) set(-1); };
  const taps = new Map();
  document.addEventListener('pointerdown', e => { if(taps.size)for(const p of taps.values())p.drag=true;taps.set(e.pointerId,{x:e.clientX,y:e.clientY,drag:taps.size>0}); },true);
  document.addEventListener('pointermove', e => {const p=taps.get(e.pointerId);if(p&&Math.hypot(e.clientX-p.x,e.clientY-p.y)>EXPLORE.slop)p.drag=true;},true);
  document.addEventListener('pointercancel', e => taps.delete(e.pointerId),true);
  document.addEventListener('pointerup', e => {const p=taps.get(e.pointerId);taps.delete(e.pointerId);if(!p||p.drag||e.target.closest?.('.find'))return;o.onEscape();},true);
  window.addEventListener('blur',()=>taps.clear());
  document.addEventListener('click',e=>{if(e.detail===0&&!e.target.closest?.('.find'))o.onEscape();});
  o.hear = () => { o.hearTs = FD.now; o.hearAngle = o.angle; };
  o.tick = (t, dt) => {
    const W = FIND_PLAY.way, p = attend(o, W.near);
    let target = o.craft >= 0 && o.craft < CRAFTS.length ? o.craft * FIND_PLAY.kit.turn / CRAFTS.length : o.craft === CRAFTS.length ? o.angle + W.allSpeed * dt : p && o.awake ? Math.atan2(p[0] - f.x, f.y - p[1]) * FIND_PLAY.kit.deg / Math.PI : 0;
    const hearing = t - o.hearTs < W.spin;
    if (hearing && !FD.rm) { o.angle = o.hearAngle + FIND_PLAY.kit.turn * ease((t - o.hearTs) / W.spin); o.speed = 0; }
    else if (o.craft === CRAFTS.length && !FD.rm) { o.angle += W.allSpeed * dt; o.speed = W.allSpeed; }
    else if (!o.drag) { const diff = findAngleDelta(o.angle, target); if (FD.rm) o.angle = target; else { o.speed += (W.stiff * diff - W.damp * o.speed) * dt; o.angle += o.speed * dt; if(Math.abs(findAngleDelta(o.angle,target))<.05&&Math.abs(o.speed)<.5){o.angle+=findAngleDelta(o.angle,target);o.speed=0;} } }
    attr(needle, 'transform', `rotate(${+(Math.round(o.angle/.05)*.05).toFixed(2)})`);
    const pulse = FD.rm ? 0 : Math.sin(Math.PI * clamp01((t - (o.pickTs ?? -Infinity)) / W.pulse[1]));
    arms.forEach((arm, i) => attr(arm, 'transform', `rotate(${i * FIND_PLAY.kit.turn / CRAFTS.length}) scale(${1 + (W.pulse[0] - 1) * pulse * (o.craft === i || o.craft === CRAFTS.length ? 1 : 0)})`));
    // The rune ring retains its angle, with no idle clock.
    if (o.mask && o.veilUpdate && (FD.st.rasterDestination || FD.st.veilRestCommit || o.veilDirty && !FD.st.gliding && !FD.st.exploreMoving)) { o.veilUpdate(FD.st.rasterDestination || null); o.veilDirty=false; }
    attr(ring, 'opacity', o.unlocked ? 1 : 0);
    if (o.unlocked && !FD.rm) attr(ring, 'transform', `scale(${lerp(W.ring[0], W.ring[1], Math.sin(Math.PI*clamp01((t-(o.ringTs??-Infinity))/W.ring[2]))) / W.ring[0]})`);
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
  const H = FIND_PLAY.hoard, o = { id: 'hoards', el: svg.querySelector('#f-hoards'), items: [], kept: false, stage: 'buried' };
  FIND_COPY.hoards.forEach(d => {
    const el = svg.querySelector('#f-' + d.id), h = { id: d.id, d, el, digs: 0, open: false, kept: false, stage: 'buried', lift: 0, liftFrom: 0, y: H.travel, lidAngle: 0, ts: -Infinity, glintAt: FD.now + findRange(H.glint), glintTs: -Infinity, hold: false, queued: false, clods: [], lastDig: -Infinity };
    for (const [key, cls] of Object.entries({ chest: 'chest', lid: 'lid', inside: 'inside', face: 'face', mouth: 'mouth', scratch: 'scratch', hole: 'hole', clipHole: 'clip-hole', pile: 'pile', glow: 'glow', glint: 'glint', rim: 'rim' })) h[key] = el.querySelector('.hd-' + cls);
    h.stars = [...el.querySelectorAll('.hd-star')];
    h.planks = [el.querySelector('.hd-plank-0'), el.querySelector('.hd-plank-1')];
    const group = el.querySelector('.hd-clods');
    for (let i = 0; i < H.clods * H.hole.length; i++) { const bit = findSvg('path', { class: 'g', d: FIND_PLAY.bits.kinds.clod[0], opacity: 0 }); group.appendChild(bit); h.clods.push({ el: bit, live: false }); }
    const hint = () => { h.hintLine = FIND_COPY.hoardHints[h.open ? H.hole.length + 1 : h.digs]; attr(h.el, 'aria-label', h.d.label.split('. ')[0] + '. ' + h.hintLine); if (JOURNEY.focus === h.id) findHint(h.id); };
    const stage = value => { h.stage = value; hint(); };
    hint();
    h.setCraftLit = on => {
      if (h.craftLit === on) return; h.craftLit = on;
      h.scratch.style.strokeWidth = on || h.awake ? H.scratchWidth : '';
      if (on && h.digs < H.hole.length) findBits('ring', d.x, d.y, 1, FIND_PLAY.bits.wake);
    };
    const show = () => {
      if (FD.popOwner === h) return true;
      const stop = STOPS.find(s => s.id === d.stop), n = h.number;
      const title = !d.image && d.title === COPY.pieceToCome ? '' : '<p class="pop-t">' + fEsc(d.title) + '</p>';
      const shown = showPop(h, [d.x, d.y - H.anchor], '<p class="pop-k">' + fEsc(stop.short) + '<br>' + fEsc(findFormat(FIND_COPY.hoardTally, { n, t: o.items.length })) + '</p>' + (d.image ? '<img src="' + d.image + '" alt="' + fEsc(d.title) + '">' : '<div class="piece-empty"><svg viewBox="' + H.iconBox.join(' ') + '" aria-hidden="true">' + pieceIcon(d.kind) + '</svg><span>' + fEsc(COPY.pieceToCome) + '</span></div>') + title + '<button class="pop-link" type="button">' + fEsc(COPY.caseStudy) + arrowSvg + '</button>', 'piece');
      if (shown) FD.pop.style.setProperty('--piece-mark', PALETTES[stop.palette].mark);
      return shown;
    };
    const ready = () => findReady(h.id) && ['buried', 'out', 'open'].includes(h.stage);
    const act = () => {
      if (h.digs < H.hole.length) {
        h.liftFrom = h.lift; h.digs++; h.ts = h.lastDig = FD.now; stage('rising');
        const rx = H.hole[h.digs - 1], ry = rx * H.holeRatio;
        for (const hole of [h.hole, h.clipHole]) { attr(hole, 'rx', rx); attr(hole, 'ry', ry); }
        attr(h.rim, 'transform', 'scale(' + rx + ' ' + ry + ')');
        attr(h.pile, 'opacity', 1); attr(h.pile, 'transform', 'scale(' + H.pile[h.digs - 1] + ')'); attr(h.scratch, 'opacity', 0);
        if (!FD.rm) for (let i = 0; i < H.clods; i++) {
          const b = h.clods[(h.digs - 1) * H.clods + i], side = i % 2 ? 1 : -1, up = findRange(H.clodUp);
          Object.assign(b, { live: true, ts: FD.now, x: side * rx, vx: side * findRange(H.clodSpeed), vy: -up, gravity: 2 * (H.clodFloor + up * H.clodLife) / H.clodLife ** 2, side });
        }
        if (FD.rm) { h.lift = H.lift[h.digs - 1]; h.y = H.travel * (1 - h.lift); attr(h.chest, 'transform', 'translate(0 ' + h.y + ')'); stage(h.digs === H.hole.length ? 'out' : 'buried'); }
      } else if (!h.open) {
        h.number = o.items.filter(item => item.open).length + 1;
        h.open = h.kept = o.kept = true; h.openTs = FD.now; stage('opening');
        found('hoards', d.id); findBits('star', d.x, d.y - H.anchor, H.stars, FIND_PLAY.bits.stars);
        h.pending = true;
        if (FD.rm) { h.lidAngle = H.lidRest; paintLid(); h.pending = false; stage('open'); show(); }
      } else {
        h.bounceTs = FD.now; stage(FD.rm ? 'open' : 'bouncing'); show();
      }
    };
    const request = () => {
      if (h.queued && h.overlayEpoch === FD.overlayEpoch) return;
      h.queued = false;
      opened(h);
      if (!ready()) { h.queued = true; return; }
      act();
    };
    const paintLid = () => {
      const a = h.lidAngle * Math.PI / FIND_PLAY.kit.deg, sn = Math.max(0, Math.sin(a)), c = Math.max(0, Math.cos(a)), lean = Math.max(0, h.lidAngle - H.lean[0]) / H.lean[1] * H.lean[2];
      attr(h.inside, 'transform', 'translate(0 ' + H.rim + ') scale(1 ' + sn + ')');
      attr(h.face, 'd', hoardInside(lean));
      h.planks.forEach((p, i) => attr(p, 'transform', 'matrix(1 0 ' + ((i ? 1 : -1) * lean * H.planks[1] / (H.depth + H.planks[2])) + ' 1 0 0)'));
      attr(h.mouth, 'transform', 'translate(0 ' + H.rim + ') scale(1 ' + clamp01(h.lidAngle / H.mouthAngle) + ')');
      attr(h.lid, 'transform', 'translate(0 ' + (H.rim - H.depth * sn) + ') scale(1 ' + c + ') translate(0 ' + -H.rim + ')');
    };
    findPointer(el, e => { e.stopPropagation(); h.hold = true; h.nextHold = FD.now + H.repeat; el.setPointerCapture(e.pointerId); request(); el._dragged = true; }, { tap: request, cancel: () => h.hold = false });
    el.addEventListener('pointerup', () => h.hold = false); el.addEventListener('pointercancel', () => h.hold = false);
    press(el, e => { e.stopPropagation(); request(); });
    h.reduce = () => {
      h.queued = h.hold = false; h.pending = false; h.lift = h.digs ? H.lift[h.digs-1] : 0; h.y = H.travel * (1-h.lift); h.lidAngle = h.open ? H.lidRest : 0;
      h.clods.forEach(b => { b.live = false; attr(b.el,'opacity',0); });
      attr(h.chest,'transform','translate(0 '+h.y+')'); paintLid(); stage(h.open ? 'open' : h.digs === H.hole.length ? 'out' : 'buried');
    };
    h.undo = () => { if (FD.popOwner === h) closePop(); };
    h.hear = () => { if (!h.open) h.glintTs = h.hearTs = FD.now; };
    h.tick = (t, dt) => {
      const idle=findIdleTime(h.glint);
      FD.idleOnly=!(['rising','rattling','opening','bouncing','waiting'].includes(h.stage)||h.hold||h.queued||h.pending||FD.sheetOwner===h);
      findLife(h, d.x, d.y, H.rad, H.near);
      if (!h.onScreen && !h.hold && !h.queued && !['rising', 'rattling', 'opening', 'bouncing'].includes(h.stage)) return;
      if (h.hold && t >= h.nextHold) { queueMicrotask(request); h.nextHold = t + (h.digs < H.hole.length ? H.repeat : H.openHold); if (h.open) h.hold = false; }
      if (h.awake !== h.wasAwake) { const awake = h.awake; queueMicrotask(() => { h.scratch.style.strokeWidth = awake || h.craftLit ? H.scratchWidth : ''; }); }
      h.wasAwake = h.awake;
      if (!FD.rm && idle >= h.glintAt && !h.digs) { h.idleGlintTs = idle; h.glintAt = idle + findRange(H.glint); }
      const glint = FD.rm ? 1 : clamp01(Math.min((t-h.glintTs)/H.glintTime,(idle-(h.idleGlintTs??-Infinity))/H.glintTime));
      attr(h.glint, 'opacity', Math.sin(Math.PI * glint)); attr(h.glint, 'transform', 'translate(0 ' + -H.scratchHop * Math.sin(Math.PI * glint) + ') rotate(' + H.glintTurn * glint + ') scale(' + Math.sin(Math.PI * glint) + ')');
      const heard = FD.rm ? 1 : clamp01((t - (h.hearTs ?? -Infinity)) / H.glintTime); attr(h.scratch, 'transform', 'translate(0 ' + -H.scratchHop * Math.sin(Math.PI * heard) + ')');
      h.clods.forEach(b => {
        if (!b.live) return; const age = Math.min(H.clodLife, t - b.ts), q = age / H.clodLife;
        attr(b.el, 'transform', 'translate(' + (b.x + b.vx * age) + ' ' + (b.vy * age + b.gravity * age * age / 2) + ') rotate(' + H.clodSpin * age * b.side + ')'); attr(b.el, 'opacity', 1 - q ** 2); if (q === 1) b.live = false;
      });
      let rock = 0;
      if (h.stage === 'rising') {
        const q = clamp01((t - h.ts) / H.rise[h.digs - 1]), z = q - 1, back = 1 + (H.backEase + 1) * z ** 3 + H.backEase * z ** 2;
        h.lift = lerp(h.liftFrom, H.lift[h.digs - 1], FD.rm ? 1 : back);
        if (q === 1) { h.lift = H.lift[h.digs - 1]; h.rattleTs = t; stage(h.digs === H.hole.length ? 'rattling' : 'buried'); }
      }
      if (h.stage === 'rattling') { const q = FD.rm ? 1 : clamp01((t - h.rattleTs) / H.rattle); rock = H.rattleAngle * Math.sin(Math.PI * 2 * H.rattleCycles * q); if (q === 1) { rock = 0; stage('out'); } }
      h.y = H.travel * (1 - h.lift); h.rock = rock; h.pivot = Math.sign(rock) * H.half;
      attr(h.chest, 'transform', 'translate(0 ' + h.y + ') rotate(' + rock + ' ' + h.pivot + ' 0)');
      if (h.stage === 'opening' || h.stage === 'bouncing') {
        if (h.stage === 'opening') {
          const e = t - h.openTs; h.lidAngle = e < H.lidTime ? H.lidPeak * ((1 - Math.cos(Math.PI * clamp01(e / H.lidTime))) / 2) : lerp(H.lidPeak, H.lidRest, (1 - Math.cos(Math.PI * clamp01((e - H.lidTime) / H.lidSettle))) / 2);
          if (FD.rm || e >= H.lidTime + H.lidSettle) { h.lidAngle = H.lidRest; stage('open'); if (h.pending) { h.pending = false; queueMicrotask(show); } }
        } else { const q = clamp01((t - h.bounceTs) / H.lidBounce); h.lidAngle = H.lidRest + (H.lidPeak - H.lidRest) * Math.sin(Math.PI * q) ** 2; if (q === 1) stage('open'); }
        paintLid();
      }
      const age = t - (h.openTs ?? -Infinity), glow = h.open ? age < H.glowTime ? H.glowPeak * clamp01(age / H.glowTime) : FD.popOwner === h ? H.glowRest : H.glowKept : 0;
      h.glowAlpha = h.digs < H.hole.length || h.stage === 'rising' ? 0 : Math.max(glow, h.craftLit ? 1 : 0); attr(h.glow, 'opacity', h.glowAlpha);
      const burst = FD.rm ? 1 : clamp01(age / D(H.glowTime + H.lidTime));
      h.stars.forEach((s, i) => { const a = i * Math.PI * 2 / h.stars.length - Math.PI / 2, distance = H.burstTravel[i % 2] * out3(burst); attr(s, 'transform', 'translate(' + Math.cos(a) * distance + ' ' + (Math.sin(a) * distance - H.burstLift * burst) + ')'); attr(s, 'opacity', FD.rm || !h.open ? 0 : 1 - burst); });
      if (h.queued && ready()) { h.queued = false; stage('waiting'); queueMicrotask(act); }
    };
    o.items.push(h);
  });
  o.tick = (t, dt) => { o.items.forEach(h => h.tick(t, dt)); o.stage = o.items.some(h => h.open) ? 'opened' : 'buried'; };
  o.reduce = () => o.items.forEach(h => h.reduce());
  o.hear = () => o.items.forEach(h => h.hear()); return o;
}
