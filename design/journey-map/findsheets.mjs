// Part A: persistent beacon reading and a rub/read/flip sheet.
import { C, COPY, FIND_COPY, FIND_PLAY, FIND_TIMING, COMB, DEPTH } from './data.mjs';
import { VIEW, clamp01, lerp } from './trip.mjs';
import { rubbingSvg } from './art.mjs';
import { depthBeam } from './depth.mjs';
import { findPointer, FD, FIND_BY, D, ease, out3, fEsc, attr, toMap, found, opened, press, closeSheet, findBits, findSvg, findSheet, findSlot, findAngleDelta, findStyle, findSheetFrame, findIdleTime } from './findkit.mjs';

export function findBeacon(svg) {
  const f=FIND_BY.beacon,el=svg.querySelector('#f-beacon'),beam=el.querySelector('.bc-beam'),flame=el.querySelector('.bc-flame'),glow=el.querySelector('.bc-glow');
  const notes=[...svg.querySelectorAll('.bc-note')].map((g,i)=>({g,inner:g.querySelector('.bc-note-in'),en:g.querySelector('.bc-en'),copy:g.querySelector('.bc-note-copy'),todo:g.querySelector('.bc-note-todo'),d:{...FIND_COPY.beaconNotes[i],x:COMB.readings[i][0],y:COMB.readings[i][1]},time:0,read:false,v:0,ev:0,flash:-Infinity}));
  notes.forEach(n=>{attr(n.g,'transform','translate('+n.d.x+' '+n.d.y+')');n.g.classList.add('reading-halo');});
  const o={id:f.id,el,stage:'idle',head:FIND_PLAY.beacon.baseAngle,manualTs:-Infinity,fire:0,level:0,read:notes.map(()=>false),kept:false,drag:false,ember:0,litTs:-Infinity,hearTs:-Infinity,embers:[],beamTurns:0,finalDone:false,stepTs:-Infinity};
  const origin=()=>[f.x+FIND_PLAY.beacon.origin[0]*FIND_PLAY.beacon.scale,f.y+FIND_PLAY.beacon.origin[1]*FIND_PLAY.beacon.scale],pool=svg.querySelector('#f-bits'),ring=findSvg('circle',{class:'l bc-finale-ring',r:0,opacity:0,'pointer-events':'none'});pool.appendChild(ring);
  // The endless turn has one bounded wedge backing, rotated by its HTML compositor layer.
  const spinClip=document.createElement('div'),spinPosition=document.createElement('div'),spinTurn=document.createElement('div');
  spinClip.className='bc-spin-clip';spinPosition.className='bc-spin-position';spinTurn.className='bc-spin-turn';
  const spinSvg=findSvg('svg',{viewBox:'-230 -44.7 230 89.4',width:230,height:89.4,class:'bc-spin-beam','aria-hidden':'true'});
  spinSvg.appendChild(beam.firstElementChild.cloneNode(true));spinTurn.appendChild(spinSvg);spinPosition.appendChild(spinTurn);spinClip.appendChild(spinPosition);document.getElementById('map-anim').before(spinClip);
  o.beamFrame=(advance=true)=>{
    if(!FD.st)return;const B=FIND_PLAY.beacon,c=FD.st.cam,O=origin(),on=o.finalDone&&o.fire===notes.length&&!FD.rm;
    const R=B.baseReach*B.scale*B.finaleReach*c.s,p=[O[0]*c.s+c.tx,O[1]*c.s+c.ty],a=o.head*Math.PI/180,dx=R*Math.cos(a),dy=R*Math.sin(a),cross=44.7/230,pts=[p,[p[0]+dx-dy*cross,p[1]+dy+dx*cross],[p[0]+dx+dy*cross,p[1]+dy-dx*cross]],visible=Math.max(...pts.map(p=>p[0]))>0&&Math.min(...pts.map(p=>p[0]))<VIEW.w&&Math.max(...pts.map(p=>p[1]))>0&&Math.min(...pts.map(p=>p[1]))<VIEW.h;
    findStyle(spinClip,'visibility',on&&visible?'inherit':'hidden');
    if(!on||!visible)return;
    const x=Math.max(0,23*c.s+c.tx),y=Math.max(0,23*c.s+c.ty),right=Math.min(VIEW.w,577*c.s+c.tx),bottom=Math.min(VIEW.h,877*c.s+c.ty);
    findStyle(spinClip,'left',x+'px');findStyle(spinClip,'top',y+'px');findStyle(spinClip,'width',Math.max(0,right-x)+'px');findStyle(spinClip,'height',Math.max(0,bottom-y)+'px');
    findStyle(spinClip,'opacity',1-(o.cover||0));findStyle(spinPosition,'transform','translate('+(p[0]-x)+'px,'+(p[1]-y)+'px) scale('+(B.scale*c.s*B.finaleReach)+')');
    if(advance&&!FD.st.gliding&&!FD.st.exploreMoving){o.spinTime=(o.spinTime||0)+FD.dt;const q=Math.min(1,o.spinTime),v0=360/B.finaleTurn,v1=360/B.spin;o.head=o.spinFrom+v0*q+(v1-v0)*(q*q*q-.5*q*q*q*q)+v1*Math.max(0,o.spinTime-1);}findStyle(spinTurn,'transform','rotate('+(o.head-180)+'deg)');
  };
  const firePyre=()=>{
    o.flareTs=FD.now;o.playing=true;found(o.id);opened(o);if(FD.rm)return;
    const O=origin(),colour=getComputedStyle(flame).fill;for(const bit of FD.bits)if(bit.live&&bit.owner==='pyre'){bit.live=false;attr(bit.el,'opacity',0);}
    findBits('spark',...O,16,{dir:[-110,-70],speed:[40,80],g:40,life:[.7,1.2],owner:'pyre',stroke:DEPTH.wolves.spark});
    for(let i=0;i<5;i++)findBits('drop',O[0],O[1],1,{dir:[-90,-90],speed:[30,37.5],life:[.7,.8],owner:'pyre',size:[1.6,.4],fill:i%2?DEPTH.wolves.spark:colour});
  };
  const wrap=()=>{
    const B=FIND_PLAY.beacon,key=[VIEW.phone,B.noteFont,B.noteScale,B.notePhone,B.noteWidths,B.noteGuard,B.noteGap].join('/');if(o.wrapKey===key)return;o.wrapKey=key;
    for(const[n,i]of notes.map((n,i)=>[n,i])){
      if(!n.copy)continue;const max=(B.noteWidths[i]-B.noteGuard)/((VIEW.phone?B.notePhone:1)*B.noteScale);
      const linesFor=(text,font,italic)=>{const words=text.split(/\s+/),candidates=new Map(),scratch=findSvg('g',{opacity:0,'pointer-events':'none'});for(let a=0;a<words.length;a++)for(let b=a+1;b<=words.length;b++){const text=words.slice(a,b).join(' '),e=findSvg('text',{'font-size':font,'font-style':italic?'italic':'normal','font-weight':500,'text-rendering':'geometricPrecision'});e.textContent=text;scratch.appendChild(e);candidates.set(text,e);}n.inner.appendChild(scratch);const widths=new Map([...candidates].map(([text,e])=>[text,e.getBBox?.().width??e.getComputedTextLength?.()??text.length*font*.55]));scratch.remove?.();const lines=[];let line='';for(const word of words){const next=line?line+' '+word:word;if(line&&widths.get(next)>max){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);return lines;};
      const caption=n.todo?linesFor(COPY.todo,B.todoFont,false):[],lines=linesFor(n.d.t.t,B.noteFont,true),copyY=B.lineY+Math.max(0,caption.length-1)*B.todoFont*B.noteLine;
      const put=(text,lines,y,step)=>{if(!text)return;text.replaceChildren();lines.forEach((line,i)=>{const t=findSvg('tspan',{x:0,y:y+i*step});t.textContent=line;text.appendChild(t);});};put(n.todo,caption,B.todoY,B.todoFont*B.noteLine);put(n.copy,lines,copyY,B.noteFont*B.noteLine);
      n.bottom=copyY+(lines.length-1)*B.noteFont*B.noteLine+B.noteFont*.25;
    }
    // Phones draw the notes 1.7 times larger than their spots are apart, so the second land note moves down until it clears the
    // first at their flash size, its reading spot with it (COMB-R review, 2026-11-27: notes one and two touched on phones).
    const peak=i=>(VIEW.phone?B.notePhone:1)*(VIEW.phone&&i===2?B.seaPhoneFlash:B.noteScale),[a,b]=notes,[,ay]=COMB.readings[0],[,by]=COMB.readings[1];
    b.d.y=by+Math.max(0,ay+(a.bottom??B.lineY)*peak(0)+B.noteGap-(by+B.runeY*peak(1)));b.d.y=+b.d.y.toFixed(2);attr(b.g,'transform','translate('+b.d.x+' '+b.d.y+')');
  };
  const arrived=(level,t)=>{o.level=Math.max(o.level,level);o.stepTs=t;if(level===notes.length){o.litTs=t+FIND_PLAY.beacon.swellTime;o.finaleFrom=Math.atan2(notes.at(-1).d.y-origin()[1],notes.at(-1).d.x-origin()[0])*180/Math.PI;notes.forEach(n=>n.finalFlash=false);}};
  const read=(n,i)=>{
    if(n.read)return;const B=FIND_PLAY.beacon;n.read=true;n.flash=FD.now;o.read[i]=true;o.fire++;o.kept=true;
    findBits('spark',n.d.x,n.d.y,B.sparkN,FIND_PLAY.bits.sparks);
    if(FD.rm){o.level=o.fire;if(o.fire===notes.length){o.finalDone=true;o.beamTurns=1;o.head=B.baseAngle;}return;}
    const ember=findSvg('circle',{class:'pf bc-ember',r:.9,opacity:1,'pointer-events':'none'});pool.appendChild(ember);o.embers.push({el:ember,from:[n.d.x,n.d.y],ts:FD.now,level:o.fire,done:false});
  };
  const snapNext=()=>{if(o.fire===notes.length){firePyre();return;}const i=notes.findIndex(n=>!n.read),n=notes[i<0?0:i],O=origin(),angle=Math.atan2(n.d.y-O[1],n.d.x-O[0])*180/Math.PI;o.snap={from:o.head,to:o.head+findAngleDelta(o.head,angle),ts:FD.now};o.manualTs=FD.now;o.playing=true;found(o.id);opened(o);if(FD.rm&&i>=0){o.head=angle;read(n,i);o.snap=null;}};
  const aimAt=e=>{if(o.fire===notes.length)return;const p=toMap([e.clientX,e.clientY]),O=origin();o.head=Math.atan2(p[1]-O[1],p[0]-O[0])*180/Math.PI;o.snap=null;o.manualTs=FD.now;found(o.id);opened(o);};
  findPointer(el,e=>{if(o.fire===notes.length)return;o.drag=true;o.downAt=[e.clientX,e.clientY];o.dragged=false;el.setPointerCapture(e.pointerId);},{drag:true,tap:snapNext,cancel:()=>o.drag=false});
  el.addEventListener('pointermove',e=>{if(!o.drag||!o.dragged&&Math.hypot(e.clientX-o.downAt[0],e.clientY-o.downAt[1])<FIND_PLAY.beacon.slop)return;o.dragged=el._dragged=true;aimAt(e);});
  el.addEventListener('pointerup',()=>o.drag=false);el.addEventListener('pointercancel',()=>o.drag=false);press(el,snapNext);
  el.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowUp','ArrowRight','ArrowDown'].includes(e.key))return;e.preventDefault();if(o.fire===notes.length)return;o.head+=FIND_PLAY.beacon.arrow*(['ArrowLeft','ArrowUp'].includes(e.key)?-1:1);o.snap=null;o.manualTs=FD.now;found(o.id);opened(o);});
  o.reduce=()=>{const B=FIND_PLAY.beacon;if(o.snap){o.head=o.snap.to;o.snap=null;}const O=origin();if(o.drag||FD.now-o.manualTs<B.manual)notes.forEach((n,i)=>{const angle=Math.atan2(n.d.y-O[1],n.d.x-O[0])*180/Math.PI;if(Math.abs(findAngleDelta(o.head,angle))<FIND_TIMING.beamCone/2)read(n,i);});o.level=o.fire;o.embers.forEach(e=>{e.done=true;attr(e.el,'opacity',0);});if(o.fire===notes.length){o.finalDone=true;o.beamTurns=1;o.head=B.baseAngle;}attr(ring,'opacity',0);};
  o.undo=()=>{o.manualTs=-Infinity;o.drag=false;};o.hear=()=>o.hearTs=FD.now;
  o.tick=(t,dt)=>{
    const B=FIND_PLAY.beacon,O=origin(),idleBeam=findIdleTime(beam),idleFlame=findIdleTime(flame);wrap();
    o.embers.forEach(e=>{if(e.done)return;const q=clamp01((t-e.ts)/B.emberTime);attr(e.el,'transform','translate('+lerp(e.from[0],O[0],q)+' '+(lerp(e.from[1],O[1],q)-B.emberArc*Math.sin(Math.PI*q))+')');if(q===1){e.done=true;attr(e.el,'opacity',0);arrived(e.level,t);}});
    let manual=o.drag||t-o.manualTs<B.manual,lit=o.fire===notes.length,finalAge=t-o.litTs,finale=lit&&o.level===notes.length&&!FD.rm&&!o.finalDone&&Number.isFinite(o.litTs)&&finalAge>=0;
    if(finale){const q=clamp01(finalAge/B.finaleTurn);o.head=o.finaleFrom+360*q;o.snap=null;notes.forEach(n=>{const angle=Math.atan2(n.d.y-O[1],n.d.x-O[0])*180/Math.PI,share=((angle-o.finaleFrom+360)%360)/360;if(!n.finalFlash&&q>=share){n.finalFlash=true;n.flash=t;}});if(q===1){o.beamTurns=1;o.finalDone=true;o.spinFrom=o.head;o.spinTime=0;o.manualTs=-Infinity;manual=false;o.beamFrame(false);}}
    else if(o.snap){const q=FD.rm?1:ease((t-o.snap.ts)/B.snap);o.head=lerp(o.snap.from,o.snap.to,q);if(q===1)o.snap=null;}
    else if(!manual&&!FD.rm&&!lit)o.head=B.baseAngle+B.sweep*Math.sin(idleBeam*FIND_TIMING.beamSweep);
    const strength=lit&&o.finalDone&&!manual?B.finaleReach:1,reach=B.baseReach*B.scale*strength,half=FIND_TIMING.beamCone/2;
    if(!lit||!o.finalDone||FD.rm)attr(beam,'transform','translate('+B.origin.join(' ')+') rotate('+(o.head-180)+') scale('+strength+')');attr(beam,'opacity',lit&&o.finalDone&&!FD.rm?0:manual||finale?1:Math.min(1,B.idle*strength));
    const approach=(a,b,k)=>Math.abs(a-b)<.0001?b:lerp(a,b,Math.min(1,k));
    notes.forEach((n,i)=>{const dx=n.d.x-O[0],dy=n.d.y-O[1],angle=Math.atan2(dy,dx)*180/Math.PI,inside=Math.abs(findAngleDelta(o.head,angle))<half&&Math.hypot(dx,dy)<reach;
      if(inside&&!o.snap&&manual&&!finale)n.time+=dt;if(!n.read&&n.time>=B.read)read(n,i);
      const target=lit&&n.read?1:inside?1:n.read?B.rest:0;n.v=FD.rm?target:approach(n.v,target,dt*B.noteEase);n.ev=FD.rm?(n.read||inside?1:0):approach(n.ev,n.read||inside&&n.time>=FIND_TIMING.noteDelay?1:0,dt*B.englishEase);
      attr(n.g,'opacity',n.v);attr(n.en,'opacity',n.ev);const flash=FD.rm?0:Math.sin(Math.PI*clamp01((t-n.flash)/B.flash)),peak=VIEW.phone&&i===2?B.seaPhoneFlash:B.noteScale;attr(n.inner,'transform','scale('+((1+(peak-1)*flash)*(VIEW.phone?B.notePhone:1))+')');
    });
    let size=B.flame[o.level],glowAlpha=B.glowLevels[o.level],radius=B.glowRadii[o.level];const step=clamp01((t-o.stepTs)/B.swellTime);
    if(!FD.rm&&step<1){const before=B.flame[Math.max(0,o.level-1)],over=size*(1+B.overshoot);size=step<.65?lerp(before,over,out3(step/.65)):lerp(over,size,ease((step-.65)/.35));}
    if(lit&&(o.finalDone||Number.isFinite(o.litTs)&&finalAge>=0)){const q=FD.rm?1:clamp01(finalAge/B.finaleTime);size=q<.45?lerp(B.finaleFlame[0],B.finaleFlame[1],out3(q/.45)):lerp(B.finaleFlame[1],B.finaleFlame[2],ease((q-.45)/.55));if(FD.rm)size=B.finaleFlame[2];glowAlpha=Math.max(glowAlpha,!FD.rm&&finalAge<B.finaleFlash?1-clamp01(finalAge/B.finaleFlash):0);}
    const hearAge=t-o.hearTs,hear=FD.rm?1:hearAge<B.hear[1]?lerp(B.hear[0],1,clamp01(hearAge/B.hear[1])):1+(B.hear[2]-1)*Math.sin(Math.PI*clamp01((hearAge-B.hear[1])/B.hear[3])),F=B.flicker,foot=B.flameFoot;
    const flareAge=t-(o.flareTs??-Infinity),flare=FD.rm?(flareAge<.4?B.flare[0]:1):flareAge<B.flare[1]?lerp(1,B.flare[0],out3(flareAge/B.flare[1])):lerp(B.flare[0],1,ease((flareAge-B.flare[1])/B.flare[2]));
    size*=flare;glowAlpha=Math.min(1,glowAlpha*flare);radius*=1+(flare-1)*.3;
    o.flameSize=size;o.glowStrength=glowAlpha;o.glowRadius=radius;
    const sx=FD.rm?size:size*(1+F[0]*Math.sin(F[1]*idleFlame)+F[2]*Math.sin(F[3]*idleFlame)),sy=FD.rm?size:size*(1+F[4]*Math.sin(F[5]*idleFlame));attr(flame,'transform','translate('+foot.join(' ')+') scale('+(sx*hear)+' '+(sy*hear)+') translate('+(-foot[0])+' '+(-foot[1])+')');attr(glow,'opacity',glowAlpha);attr(glow,'r',B.glowR*radius);
    const ringQ=FD.rm?1:clamp01(finalAge/B.finaleRing[1]);attr(ring,'cx',O[0]);attr(ring,'cy',O[1]);attr(ring,'r',B.finaleRing[0]*out3(ringQ));attr(ring,'opacity',finale&&ringQ<1?.8*(1-ringQ):0);
    if(o.onScreen&&!FD.rm&&o.playing){o.ember+=o.fire*B.embers*dt;const n=Math.floor(o.ember);o.ember-=n;if(n)findBits('spark',...O,n,FIND_PLAY.bits.sparks);}
    o.playing=flareAge<(FD.rm?.4:B.flare[1]+B.flare[2])||!FD.rm&&(!!o.snap||o.embers.some(e=>!e.done)||t-o.stepTs<B.swellTime||lit&&!o.finalDone||manual&&notes.some(n=>!n.read&&n.time>0));
    o.stage=lit?'lit':manual?'aiming':'idle';if(lit&&FD.focusId===o.id&&FD.hint?.textContent!==B.litHint)FD.hint.textContent=B.litHint;
    depthBeam(!(lit&&o.finalDone)&&!FD.rm&&o.onScreen&&VIEW.depth&&FD.st.pushT>0&&FD.st.rushT===0?{x:O[0],y:O[1],angle:o.head,half,reach,soft:B.soft,steps:B.wedgeSteps}:null,FD.st);
  };return o;
}
export const beaconLit = () => FD.list.beacon?.fire === FIND_COPY.beaconNotes.length;

export function findRune(svg) {
  const f = FIND_BY.runestone, el = svg.querySelector('#f-runestone'), trace = el.querySelector('.rs-trace');
  const o = { id: f.id, el, stage: 'rest', kept: false, read: false, rubbed: [], rubs: 0, ts: -Infinity, dashTs: -Infinity, stamped: false, flipped: false };
  const dash = red => {
    const R = FIND_PLAY.rune; trace.classList.toggle('red', red); trace.style.stroke = red ? '' : C.paper; trace.style.opacity = red ? 1 : 0; trace.style.strokeDasharray = red ? 'none' : R.dash.join(' ');
    trace.getAnimations().forEach(a => a.cancel());
    if (red) trace.style.strokeDasharray = R.dash[1] + ' ' + R.dash[1];
    if (!FD.rm) trace.animate(red ? [{ strokeDashoffset: R.dash[1], opacity: 1 }, { strokeDashoffset: 0, opacity: 1 }] : [{ strokeDashoffset: 0, opacity: 0 }, { strokeDashoffset: -R.dash[1] / 2, opacity: 1 }, { strokeDashoffset: -R.dash[1], opacity: 0 }], { duration: (red ? R.carving : R.dashTime) * 1000, fill: red ? 'forwards' : 'none' }).id = red ? '' : 'jm-idle';
  };
  const autoStart = () => { if (o.read) return; o.autoTs = FD.now; o.autoLast = null; };
  const rub = (x, y) => {
    if (o.read || o.stage !== 'sheet') return;
    const R = FIND_PLAY.rune, c = findSvg('circle', { cx: x, cy: y, r: R.r, fill: 'url(#rub-soft)' }); o.circles.appendChild(c); o.rubs++; o.lastRubTs=FD.now;
    const [x0, y0, x1, y1] = R.cells;
    o.cells.forEach((p, i) => { if (Math.hypot(p[0] - x, p[1] - y) <= R.cellR) o.rubbed[i] = true; });
    if (o.rubbed.filter(Boolean).length / o.cells.length >= R.done) complete();
  };
  const complete = () => { if (o.read) return; o.read = o.kept = true; o.readTs = FD.now; o.autoTs = null; o.fill = FD.sheet.querySelector('.rub-fill'); el.classList.add('rune-kept'); };
  const flip = () => {
    if (!o.read) return;
    o.flipped = !o.flipped; o.pin.classList.toggle('flip', o.flipped);
    if (o.flipped && !o.stamped) { o.stampTs = FD.now; o.stamped = true; }
  };
  const sheet = () => {
    const R = FIND_PLAY.rune, P = FIND_COPY.poster;
    const shown = findSheet(o, 'poster rubbing-sheet', `<div class="pz"><div class="pz-in"><div class="pz-front rubbing-front">${rubbingSvg()}</div><div class="pz-back poster-back"><span class="pz-pin"></span><span class="pz-pin r"></span><b class="pz-h">${fEsc(P.head)}</b><div class="pz-pic"><i></i><s></s></div><b class="pz-who">${fEsc(P.who)}</b><p>${fEsc(P.line1)}<br>${fEsc(P.line2)}</p><b class="pz-rw">${fEsc(P.reward)}</b><span class="pz-stamp">${fEsc(P.stamp)}</span><div class="poster-slot">${findSlot(P.foot)}</div><span class="pz-fold"></span></div></div></div><div class="pz-ctl"><button type="button" class="rub-do">${fEsc(FIND_COPY.rubDo)}</button><button type="button" class="pz-flip" hidden>${fEsc(COPY.flip)}</button><button type="button" class="pz-x">${fEsc(COPY.close)}</button></div>`, [f.x, f.y + R.anchor]);
    if (!shown) { o.onSheetClose(); return; }
    o.pz = FD.sheet.querySelector('.pz'); o.pin = FD.sheet.querySelector('.pz-in'); o.rubbing = FD.sheet.querySelector('.rubbing'); o.circles = FD.sheet.querySelector('.rub-circles'); o.fill = FD.sheet.querySelector('.rub-fill'); o.letters = [...FD.sheet.querySelectorAll('.rub-letter')]; o.stamp = FD.sheet.querySelector('.pz-stamp');
    o.flipped = false; o.controls = false; o.hinted=false; o.lastRubTs=FD.now; o.stampTs = o.stamped ? -Infinity : Infinity; o.stage = 'sheet'; o.ts = FD.now; o.autoTs = null; o.lastRub = null; o.tilt = [0, 0];
    const bounds = R.cells; o.cells = [];
    for (let j = 0; j < R.grid[1]; j++) for (let i = 0; i < R.grid[0]; i++) o.cells.push([lerp(bounds[0], bounds[2], (i + 0.5) / R.grid[0]), lerp(bounds[1], bounds[3], (j + 0.5) / R.grid[1])]);
    if (!o.read) o.rubbed = o.cells.map(() => false); else { o.readTs = FD.now - R.fill - o.letters.length * R.letter[0] - R.letter[1]; attr(o.fill, 'opacity', 1); }
    const local = e => {
      const box = o.rubbing.getBoundingClientRect(); return [(e.clientX - box.left) / box.width * R.width, (e.clientY - box.top) / box.height * R.height];
    };
    const pointerRub = e => {
      const p = local(e); o.autoTs = null;
      if (!o.lastRub) rub(...p);
      else { const dx = p[0] - o.lastRub[0], dy = p[1] - o.lastRub[1], length = Math.hypot(dx, dy); for (let d = R.step; d <= length; d += R.step) rub(o.lastRub[0] + dx * d / length, o.lastRub[1] + dy * d / length); if (length < R.step) return; }
      o.lastRub = p;
    };
    o.rubbing.addEventListener('pointerdown', e => { o.rubDown = true; o.rubbing.setPointerCapture(e.pointerId); o.lastRub = null; pointerRub(e); e.preventDefault(); });
    o.rubbing.addEventListener('pointermove', e => { if (o.rubDown) pointerRub(e); });
    o.rubbing.addEventListener('pointerup', () => o.rubDown = false); o.rubbing.addEventListener('pointercancel', () => o.rubDown = false);
    o.pz.addEventListener('pointermove', e => { if (!FD.hover || FD.rm || o.rubDown) return; const box = o.pz.getBoundingClientRect(); o.tilt = [(0.5 - (e.clientY - box.top) / box.height) * 2 * R.tilt, ((e.clientX - box.left) / box.width - 0.5) * 2 * R.tilt]; });
    o.pz.addEventListener('pointerleave', () => o.tilt = [0, 0]);
    FD.sheet.querySelector('.rub-do').addEventListener('click', autoStart); FD.sheet.querySelector('.pz-flip').addEventListener('click', flip); FD.sheet.querySelector('.pz-x').addEventListener('click', () => closeSheet());
    found(o.id); if (o.keyboard) autoStart();
  };
  press(el, e => { if (o.stage !== 'rest') return; opened(o); o.keyboard = e.type === 'keydown'; o.stage = 'trace'; o.ts = FD.now; dash(true); if (FD.rm) sheet(); });
  o.hear = () => { o.dashTs = FD.now; dash(false); };

  o.onSheetClose = () => { o.stage = 'rest'; o.rubDown = false; trace.classList.remove('red'); trace.style.opacity = 0; trace.getAnimations().forEach(a => a.cancel()); };
  o.undo = () => { if (FD.sheetOwner === o) closeSheet(); };
  o.onEscape = () => { if (o.stage === 'trace') { o.stage = 'rest'; trace.classList.remove('red'); } };
  o.tick = t => {
    const R = FIND_PLAY.rune, idle=findIdleTime(trace);
    if (o.stage === 'rest' && o.awake && !FD.rm && idle - (o.idleDashTs??-Infinity) >= R.dashTime) { o.idleDashTs = idle; queueMicrotask(() => dash(false)); }
    if (o.stage === 'trace' && t - o.ts >= D(R.carving)) { o.stage = 'opening'; queueMicrotask(sheet); return; }
    if (!['sheet', 'closing'].includes(o.stage) || FD.sheetOwner !== o) return;
    const closing = FD.sheetClosing;
    const fit = Math.min(1, (VIEW.w - FIND_PLAY.kit.sheet.edge) / R.width, (VIEW.h - FIND_PLAY.kit.sheet.edge * 2 - COMB.target) / (R.height + Math.abs(R.controlTop) - R.height / 2));
    findSheetFrame(o, fit, (VIEW.h - (R.controlTop - R.height / 2) * fit - COMB.target) / 2);
    findStyle(o.pz, 'transform', `rotateX(${o.tilt[0]}deg) rotateY(${o.tilt[1]}deg)`);
    if (closing) return;
    if (!o.read && !o.rubs && o.autoTs === null && o.keyboard && t - o.ts >= R.auto[0]) o.autoTs = t;
    if (!o.read && !o.keyboard && t-o.lastRubTs>=R.hintDelay && !o.hinted) { o.hinted=true;FD.sheet.querySelector('.rub-do').insertAdjacentHTML('beforebegin','<span class="rub-hint">'+fEsc(FIND_COPY.rubHint)+'</span>'); }
    if (!o.read && o.autoTs !== null) {
      const p = FD.rm ? 1 : clamp01((t - o.autoTs) / R.auto[1]), count = R.auto[2], pass = Math.min(count - 1, Math.floor(p * count)), u = p * count - pass, b = R.cells;
      const point = [lerp(b[0], b[2], pass % 2 ? 1 - u : u), lerp(b[1], b[3], (pass + u) / count)];
      if (!o.autoLast || Math.hypot(point[0] - o.autoLast[0], point[1] - o.autoLast[1]) >= R.step) { o.autoLast = point; queueMicrotask(() => rub(...point)); }
      if (p === 1) { o.autoTs = null; queueMicrotask(() => { o.cells.forEach(p => rub(...p)); }); }
    }
    if (o.read) {
      // the rubbing is read, so its hint goes with the rub button
      if (o.hinted) { o.hinted = false; queueMicrotask(() => { if (FD.sheetOwner === o) FD.sheet.querySelector('.rub-hint')?.remove(); }); }
      attr(o.fill, 'opacity', FD.rm ? 1 : ease((t - o.readTs) / R.fill));
      o.letters.forEach((letter, i) => { const k = FD.rm ? 1 : out3((t - o.readTs - R.fill - i * R.letter[0]) / R.letter[1]); attr(letter, 'opacity', k); attr(letter, 'transform', `translate(0 ${R.letterRise * (1 - k)})`); });
      if (!o.controls && (FD.rm || t - o.readTs >= R.fill + (o.letters.length - 1) * R.letter[0] + R.letter[1])) { o.controls = true; queueMicrotask(() => { if (FD.sheetOwner !== o) return; FD.sheet.querySelector('.rub-do').hidden = true; FD.sheet.querySelector('.pz-flip').hidden = false; FD.sheet.querySelector('.pz-x').hidden = false; FD.sheet.querySelector('.pz-flip').focus({ preventScroll: true }); }); }
    }
    const stamp = FD.rm ? 1 : out3((t - o.stampTs - R.stamp[0]) / R.stamp[1]);
    findStyle(o.stamp, 'opacity', stamp); findStyle(o.stamp, 'transform', `rotate(${R.stampAngle}deg) scale(${lerp(R.stamp[2], 1, stamp)})`);
    const shakeAge = t - o.stampTs - R.stamp[0] - R.stamp[1], shake = FD.rm || shakeAge < 0 || shakeAge > R.shake[1] ? 0 : R.shake[0] * Math.sin(shakeAge / R.shake[1] * Math.PI * 4) * (1 - shakeAge / R.shake[1]);
    findStyle(o.pin, 'transform', `translateX(${shake}px) rotateY(${o.flipped ? FIND_PLAY.kit.deg : 0}deg)`);
  };
  return o;
}
