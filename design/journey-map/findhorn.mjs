// Sound is represented by travelling rings and timed calls to the existing hear() kit.
import { FIND_PLAY, FIND_COPY, FINDS } from './data.mjs';
import { clamp01, lerp, TRIP_EL } from './trip.mjs';
import { starPath } from './art.mjs';
import { JOURNEY, stepsFocus } from './steps.mjs';
import { findPointer, FD, FIND_BY, ease, attr, fEsc, found, opened, press, showPop, closePop, attend, findSlot, findPlace, findView, findSvg, findHint } from './findkit.mjs';

export function findHorn(svg) {
  const f = FIND_BY.horn, el = svg.querySelector('#f-horn'), horn = el.querySelector('.hn-horn'), left=el.querySelector('.hn-cup-left'), right=el.querySelector('.hn-cup-right'), splash=el.querySelector('.hn-splash');
  const o = { id: f.id, el, stage: 'rest', kept: false, up: 0, v: 0, hold: false, sounded: 0, ts: -Infinity, heard: [], hearTs: -Infinity, glints: [] };
  const drips = [...el.querySelectorAll('.hn-kept')], spill = () => drips.forEach(d => attr(d, 'opacity', 1)); // the foam spills as the rims touch
  const ringsGroup = findSvg('g', { id: 'hn-rings', 'pointer-events': 'none' }); svg.querySelector('#finds').appendChild(ringsGroup);
  const rings = Array.from({ length: FIND_PLAY.horn.rings }, () => { const c = findSvg('circle', { class: 'hn-ring', r: 1, opacity: 0 }); ringsGroup.appendChild(c); return c; });
  const glints = FINDS.map(d => { const g = findSvg('g'), star = findSvg('path', { class: 'pf', d: starPath(0, 0, FIND_PLAY.horn.glint[0]), opacity: 0 }); star.style.stroke = 'none'; g.appendChild(star); ringsGroup.appendChild(g); return { id: d.id, g, star, ts: -Infinity }; });
  const deliver = id => {
    const object = FD.list[id]; object?.hear?.();
    if (!FD.found.has(id) && !FD.rm) { const glint = glints.find(g => g.id === id), d = FIND_BY[id], p = d.mark || findPlace(id); attr(glint.g, 'transform', `translate(${p[0]} ${p[1]})`); glint.ts = FD.now; o.glints.push(id); }
    o.heard.push(id);
  };
  const sound = () => {
    if (o.stage === 'sounding' || o.stage === 'echo') return;
    const H = FIND_PLAY.horn; opened(o); o.stage = 'sounding'; o.ts = FD.now; o.sounded++; o.hold = false; o.heard = []; o.glints = []; o.up = 1; o.contact=false; o.clinkPoint=[f.x+H.bell[0],f.y+H.bell[1]];
    o.kept = true; if (FD.rm) spill();
    TRIP_EL.focusAim={id:o.id,view:FIND_PLAY.focus.wide,serial:(TRIP_EL.focusAim?.serial||0)+1};
    o.wide = stepsFocus(o.id, FIND_PLAY.focus.wide); if (FD.popOwner === o) closePop();
    if (FD.rm) { FINDS.forEach(d => deliver(d.id)); o.up = o.v = 0; o.reducedPose=2; o.stage = 'rest'; if (FD.popOwner === o) closePop(); }
  };
  const raise = () => {
    if (o.stage === 'sounding' || o.stage === 'echo') return;
    if (o.up) { sound(); return; }
    o.up = 1; o.reducedPose=null; o.stage = 'raised'; o.raiseTs = FD.now; opened(o); found(o.id);
    showPop(o, [f.x + 60, f.y + 65], `<p class="pop-t pop-big">${fEsc(FIND_COPY.horn[0])}</p>${findSlot(FIND_COPY.horn[1])}`);
  };
  findPointer(el, e => { el.setPointerCapture(e.pointerId); raise(); o.hold = o.stage === 'raised'; o.holdTs = FD.now; el._dragged = true; }, { tap: raise, cancel: () => o.hold = false });
  el.addEventListener('pointerup', () => o.hold = false); el.addEventListener('pointercancel', () => o.hold = false);
  press(el, raise);
  o.reduce = () => { o.hold = false; if (['sounding','echo'].includes(o.stage)) { FINDS.filter(d => !o.heard.includes(d.id)).forEach(d => deliver(d.id)); o.up = o.v = 0; o.stage = 'rest'; o.playing = false; } };
  o.onPopClose = () => { if (o.stage === 'raised') { o.up = 0; o.stage = 'rest'; o.hold = false; } };
  o.onEscape = () => { o.hold = false; if (o.stage === 'raised') { o.up = 0; o.stage = 'rest'; } };
  o.hear = () => { if (!FD.rm) { o.hearTs = FD.now; o.hearing = true; } };
  o.tick = (t, dt) => {
    const H = FIND_PLAY.horn;
    o.hearing = !FD.rm && t - o.hearTs < H.raise;
    if (o.hold && t - o.holdTs >= H.hold) { o.hold = false; queueMicrotask(sound); }
    o.v = FD.rm ? o.up : o.v + Math.sign(o.up - o.v) * Math.min(Math.abs(o.up - o.v), dt / H.raise);
    const p=attend(o,H.near),tip=o.awake&&p?H.tip*Math.max(-1,Math.min(1,(p[0]-f.x)/H.near)):0,age=t-o.ts-H.clink,hear=FD.rm?0:H.tip*Math.sin(Math.PI*clamp01((t-o.hearTs)/H.raise));
    const mix=(a,b,k)=>a.map((v,i)=>i?lerp(v,b[i],k):a[0]);let pose=H.poses[0];
    if(FD.rm&&o.reducedPose===2)pose=H.poses[2];
    else if(o.stage==='sounding'){if(age<0)pose=mix(H.poses[1],H.poses[2],clamp01((age+H.clink)/H.clink)**2);else pose=mix(H.poses[2],H.poses[3],1-(1-clamp01(age/H.bounce))**3);}
    else pose=mix(H.poses[0],H.poses[1],ease(o.v));
    const [,tilt,lift,gap]=pose,a=tilt*Math.PI/180,[px,py]=H.rim,rx=px*Math.cos(a)-py*Math.sin(a),ry=px*Math.sin(a)+py*Math.cos(a),at={x:-rx-gap/2,y:4+lift,a:tilt,rimY:4+lift+ry},transform='translate('+at.x.toFixed(2)+' '+at.y+') rotate('+at.a+')';
    attr(left,'transform',transform);attr(right,'transform',transform);attr(horn,'transform','rotate('+(tip+hear)+')');o.pose=[tilt,lift,gap];
    const contact=H.poses[2],ca=contact[1]*Math.PI/180,cy=4+contact[2]+px*Math.sin(ca)+py*Math.cos(ca);
    if(age>=0&&!o.contact&&o.stage==='sounding'){const a=(tip+hear)*Math.PI/180;o.contact=true;spill();o.clinkPoint=[f.x-cy*Math.sin(a)*H.scale,f.y+cy*Math.cos(a)*H.scale];}
    attr(splash,'d','M-1.4 '+(cy-2)+'l-1.5 -2.2M0 '+(cy-2.6)+'v-2.6M1.4 '+(cy-2)+'l1.5 -2.2');attr(splash,'opacity',!FD.rm&&o.stage==='sounding'&&age>=0&&age<H.splash?Math.sin(Math.PI*age/H.splash):0);
    rings.forEach((r,i)=>{const a=age-i*H.gap,radius=H.radius+H.speed*Math.max(0,Math.min(H.life,a)),point=o.clinkPoint||[f.x+H.bell[0],f.y+H.bell[1]];attr(r,'transform','translate('+point.join(' ')+') scale('+radius+')');attr(r,'opacity',!FD.rm&&a>=0&&a<H.life&&o.stage==='sounding'?H.alpha*(1-a/H.life)**H.power:0);});
    if (['sounding', 'echo'].includes(o.stage)) {
      FINDS.forEach(d => { if (o.heard.includes(d.id)) return; const p = findPlace(d.id); if (age >= Math.hypot(p[0] - f.x - H.bell[0], p[1] - f.y - H.bell[1]) / H.speed) { o.heard.push(d.id); queueMicrotask(() => { o.heard = o.heard.filter(id => id !== d.id); deliver(d.id); }); } });
      if (o.stage === 'sounding' && age >= H.life + (H.rings - 1) * H.gap) {
        o.stage = 'echo'; o.up = 0;
        queueMicrotask(() => { if (FD.popOwner === o) closePop(); if (o.wide && JOURNEY.focus === o.id) { const view=findView(o.id);TRIP_EL.focusAim={id:o.id,view,serial:(TRIP_EL.focusAim?.serial||0)+1};stepsFocus(o.id,view); } });
      }
      if (o.stage === 'echo' && o.heard.length === FINDS.length && glints.every(g => t - g.ts >= H.glint[1])) o.stage = 'rest';
    }
    glints.forEach(g => { const k = FD.rm ? 1 : clamp01((t - g.ts) / H.glint[1]), pulse = Math.sin(Math.PI * k); attr(g.star, 'opacity', pulse); attr(g.star, 'transform', `rotate(${H.glint[2] * k}) scale(${pulse})`); });
    if (JOURNEY.focus === o.id && o.hintStage !== o.stage) { o.hintStage = o.stage; findHint(o.id); attr(el, 'aria-label', f.label.split('. ')[0] + '. ' + FD.hint.textContent); }
    o.playing = o.hold || ['sounding', 'echo'].includes(o.stage) || o.v !== o.up;
  };
  return o;
}
