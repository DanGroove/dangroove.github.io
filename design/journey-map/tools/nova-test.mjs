// Node recording fakes only. No pixels, browser, layout, or device performance are checked.
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { C, MAP, NOVA, DEPTH, EXPLORE, STEPS } from '../data.mjs';
import { mapDefs } from '../art.mjs';
import { tripBuild, tripResize, tripState, tripApply, SEQ, VIEW, TRAIL_DOTS, X_U, pointAt, toScreen, smooth, novaBuild, novaBuildGather } from '../trip.mjs';
import { starsBuild, starsResize, starsJoin, starsTick, starsFrame, starsRushSources, novaGatherPoint, novaGatherSources } from '../stars.mjs';
import { footerBuild, footerBuildX, footerNovaResize, footerFrame, footerMotion } from '../footer.mjs';

class NovaNode {
  constructor() {
    this.attrs = {}; this.writes = 0; this.listeners = {}; this.classList = { contains: () => false };
    this.style = new Proxy({}, { set: (o, k, v) => { this.writes++; o[k] = String(v); return true; } });
  }
  setAttribute(k, v) { this.writes++; this.attrs[k] = String(v); }
  getAttribute(k) { return this.attrs[k] ?? null; }
  addEventListener(k, fn) { this.listeners[k] = fn; }
  appendChild() {}
  querySelectorAll() { return []; }
  querySelector() { return new NovaNode(); }
  set tabIndex(v) { this.writes++; this.tab = v; }
  get tabIndex() { return this.tab; }
}
const contexts = [], images = [], canvases = [];
function novaContext() {
  const calls = [], state = [], ctx = { calls, globalAlpha: 1, lineWidth: 1, strokeStyle: '', fillStyle: '' };
  for (const name of ['setTransform','clearRect','drawImage','fillRect','translate','rotate','scale','setLineDash','beginPath','moveTo','lineTo','quadraticCurveTo','closePath','arc','stroke','fill']) ctx[name] = (...args) => calls.push({ name, args, alpha: ctx.globalAlpha, width: ctx.lineWidth, colour: ctx.strokeStyle });
  ctx.save = () => { state.push({ globalAlpha:ctx.globalAlpha, lineWidth:ctx.lineWidth, strokeStyle:ctx.strokeStyle, fillStyle:ctx.fillStyle }); };
  ctx.restore = () => Object.assign(ctx,state.pop());
  for (const name of ['createLinearGradient','createRadialGradient']) ctx[name] = (...args) => { const gradient = { stops:[], addColorStop(at, colour) { this.stops.push([at,colour]); } }; calls.push({ name,args,gradient }); return gradient; };
  contexts.push(ctx); return ctx;
}
function novaCanvas() { const cv = new NovaNode(), ctx = novaContext(); cv.getContext = () => ctx; cv.ctx = ctx; canvases.push(cv); return cv; }
globalThis.window = { devicePixelRatio: 3, addEventListener() {} };
globalThis.document = { createElement: tag => tag === 'canvas' ? novaCanvas() : new NovaNode() };
globalThis.Image = class { constructor() { images.push(this); } set src(v) { this.source = v; } };

// Build the footer with the independent name renderer disabled, then enable only the nova writer.
const inner = new NovaNode(), span = new NovaNode(), rule = new NovaNode(), footer = new NovaNode();
footer.querySelector = s => s === '.ft-in' ? inner : s === '.ft-name span' ? span : rule;
footerBuild(footer,true);
const x = new NovaNode(), canvas = novaCanvas(), hit = new NovaNode();
footerBuildX(x,false,canvas,hit);
assert.equal((x.innerHTML.match(/class="fx-red"/g)||[]).length,2);
assert.ok(!/fx-(?:rg|og|rays|lobes|waves|flares|streaks|ringr|ring|r1|r2|core|white|hit)\b|fxray/.test(x.innerHTML));
assert.equal(hit.listeners.keydown,undefined,'native button owns keyboard activation');
const main = readFileSync(new URL('../main.mjs',import.meta.url),'utf8');
assert.match(main,/<svg id="map"[^]*?<\/svg>\s*<canvas id="nova" aria-hidden="true"><\/canvas>\s*<canvas id="stars"/);
assert.ok(main.indexOf('id="nova-hit"') < main.indexOf('class="cards"'),'press target precedes cards/footer');
assert.match(main, /<button type="button" class="fx-hit" id="nova-hit"/);
assert.ok(main.includes("addEventListener('change', e => mainReduced(e.matches))"), 'retained native hit supports live reduced-motion changes');
console.log('ok: SVG X retains only rough red strokes; nova canvas follows map; native HTML hit precedes cards and is available for live reduced-motion switching');

const all = [], node = () => { const n = new NovaNode(); all.push(n); return n; };
const svg=node(), cam=node(), sea=node(), fill=node(), coastG=node(), detail=node(), finds=node(), done=node(), mini=node(), tier=node(), subs=node(), subHome=node(), ship=node(), coasts=[node(),node()];
subs.parentElement=subHome;svg.parentElement=node();
svg.querySelector = s => ({'.map-tier2':tier,'.map-subs':subs,'.ls-ship':ship})[s];
svg.querySelectorAll = s => s === '.coast' ? coasts : [];
tripBuild({svg,cam,sea,fill,coastG,detail,finds,done,mini,caption:node(),cue:node()});
tripResize(1440,900,120);footerNovaResize(1440,900);
assert.equal(canvas.width,2880);assert.equal(canvas.height,1800);
assert.equal(images.length,1,'rough stroke image is prepared at resize');
let rough = decodeURIComponent(images[0].source.split(',').slice(1).join(','));
assert.ok(rough.includes(mapDefs().match(/<filter id="rough"[^]*?<\/filter>/)[0]));
assert.match(rough,/viewBox="-20 -8 40 16"/);assert.match(rough,/d="M-12.7 0H12.7"/);
const segment = (kind,t) => { const q=SEQ.find(s=>s.kind===kind);return tripState(q.a+q.len*t); };
const run = (st,dt=0) => { tripApply(st);footerFrame(st);footerMotion(1,dt,st,[0,0],false); };
const count = name => canvas.ctx.calls.filter(c=>c.name===name).length;
run(segment('rush',0));assert.equal(canvas.ctx.calls.length,0,'before rush canvas stays empty');
run(segment('rush',.001));assert.equal(count('clearRect'),1);assert.equal(x.style.visibility,'hidden');
assert.ok(canvas.ctx.calls.some(c=>c.name==='stroke'&&c.colour===C.red&&c.width===3.6),'plain round stroke is available before image loads');
images[0].onload();
for (const [kind,t] of [['rush',.2],['blast',.2],['settle',.6]]) {
  const st=segment(kind,t), before=count('clearRect');run(st,.016);run(st,.016);assert.equal(count('clearRect'),before+2,kind+' draws every frame');
  const mapping=canvas.ctx.calls.filter(c=>c.name==='setTransform'&&c.args[0]===2).at(-1).args;
  assert.deepEqual(mapping,[2,0,0,2,(MAP.x[0]*st.cam.s+st.cam.tx)*2,(MAP.x[1]*st.cam.s+st.cam.ty)*2]);
  all.forEach(n=>n.writes=0);x.writes=hit.writes=0;run(st,0);
  assert.equal(all.reduce((sum,n)=>sum+n.writes,0)+x.writes,0,kind+' identical frame does not write SVG');
  assert.equal(hit.writes,0,kind+' identical frame does not write press target');
}
assert.ok(canvas.ctx.calls.some(c=>c.name==='drawImage'&&c.args[0].ctx?.calls.some(call=>call.name==='drawImage'&&call.args[0]===images[0])),'ready rough sprite is drawn');
assert.equal(hit.getAttribute('aria-disabled'),'true');assert.equal(hit.tabIndex,-1);
const before=count('clearRect');run(segment('rush',0));assert.equal(count('clearRect'),before+1);assert.equal(x.style.visibility,'visible');
run(segment('rush',0));assert.equal(count('clearRect'),before+1,'hidden nova clears once then stops');
const partial=segment('blast',.2);run(partial);assert.equal(+svg.style.opacity,partial.dim*(1-smooth(...DEPTH.fade.blast,partial.blastT)));
for(const g of [sea,fill,coastG,detail,finds,done])assert.equal(g.style.opacity,'1','blast does not fade individual groups');
assert.equal(svg.style.willChange,'opacity');
run(segment('blast',.8));assert.equal(svg.style.opacity,'0');assert.equal(svg.style.visibility,'hidden');assert.equal(svg.style.willChange,'');
const explored=segment('rest',0);explored.exploreK=.5;explored.sEnd=explored.cam.s*2;explored.cam.s/=2;explored.dim=.6;
run(explored);assert.equal(svg.style.visibility,'visible');assert.equal(svg.style.willChange,'transform, opacity');assert.equal(canvas.style.opacity,'0.6');
assert.equal(hit.getAttribute('aria-disabled'),'false');assert.equal(hit.tabIndex,0);
assert.equal(hit.style.width,(NOVA.flare.hit*explored.cam.s/explored.sEnd*2).toFixed(2)+'px');
explored.exploreK=1;run(explored);assert.equal(svg.style.willChange,'transform, opacity');
console.log('ok: dpr cap, original rough filter, fallback then sprite, rush/blast/settle continuous drawing, screen mapping, no still-frame SVG/button writes, clear-once rest, one-layer map fade');

// Grow after a ready sprite, and verify that its raster density covers the largest visible red stroke.
const imageCount=images.length;tripResize(2400,1600,120);footerNovaResize(2400,1600);assert.ok(images.length>imageCount);
rough=decodeURIComponent(images.at(-1).source.split(',').slice(1).join(','));
const rasterWidth=+rough.match(/width="(\d+)"/)[1];assert.ok(rasterWidth>=40*Math.max(VIEW.s0,VIEW.sT*EXPLORE.most)*NOVA.base.rushLen*2);
// D3: sample the real score, renderer and gathering stars. Recording only, no pixels.
assert.equal(STEPS.pace.rush,3);
const scoreFrames=Array.from({length:3001},(_,i)=>novaBuild(i/3000));
assert.ok(scoreFrames.every(frame=>Math.hypot(...frame.jitter)<=2),'screen jitter magnitude stays within 2 px');
for(let i=scoreFrames.length-1;i>=0;i--)assert.deepEqual(novaBuild(i/3000),scoreFrames[i],'reverse score must reproduce forward values');
const maxima=[];
for(let i=601;i<2280;i++)if(scoreFrames[i].glow>scoreFrames[i-1].glow&&scoreFrames[i].glow>scoreFrames[i+1].glow)maxima.push(i);
assert.equal(maxima.length,4);maxima.forEach((at,i)=>{assert.ok(Math.abs(at/3000-NOVA.build.throbs[i])<.001);if(i){assert.ok((at-maxima[i-1])/1000>=.34);assert.ok(scoreFrames[at].glow>scoreFrames[maxima[i-1]].glow);}});
for(const phone of [false,true])for(let ms=0;ms<=2984;ms++){
  const a=novaBuild(ms/3000,phone),b=novaBuild((ms+16)/3000,phone);
  for(const key of ['glowAlpha','veil','coreAlpha','heat'])assert.ok(Math.abs(a[key]-b[key])<=.08+1e-9,key+' 16 ms delta at '+ms);
}
// Dan, 2026-11-23: the stepped build-up looked staggered. Before the draw-in the stars' gather and the spikes' growth only speed up,
// and no 16 ms frame moves a star more than 2 % of its way in (the old throbs lurched about 4 % in a frame, then nearly froze).
for(const order of [0,.5,1]){let last=0;for(let ms=16;ms<=3000;ms+=16){const v=novaBuildGather(ms/3000,order)-novaBuildGather((ms-16)/3000,order);assert.ok(v<=.02,'gather lurch at '+ms+' ms, order '+order);if(ms/3000<=NOVA.build.draw){assert.ok(v>=last-2e-4,'gather slows before the draw-in at '+ms+' ms, order '+order);last=v;}}}
{let last=0;for(let ms=16;ms/3000<=NOVA.build.draw;ms+=16){const v=novaBuild(ms/3000).len-novaBuild((ms-16)/3000).len;assert.ok(v>=last-1e-9,'spike growth slows before the draw-in at '+ms+' ms');last=v;}}
assert.ok(novaBuild(.93).len<novaBuild(.72).len);assert.equal(novaBuild(1).len,NOVA.build.compressed);
assert.ok(Math.hypot(...novaBuild(.93).jitter)>0&&Math.hypot(...novaBuild(1).jitter)>0,'tremble continues into the blast');
for(let order=0;order<=1;order+=.01){const q=novaBuildGather(1,order);assert.equal(q,1);assert.deepEqual(novaGatherPoint([10,20],[500,400],order*6,150,q),[500,400]);}
for(const size of [[1440,900,120],[390,844,96]]){
  tripResize(...size);footerNovaResize(size[0],size[1]);
  const rush=segment('rush',.76), blast=segment('blast',.4/STEPS.pace.blast);
  const savedPush=NOVA.build.push,savedPhone=NOVA.build.pushPhone;NOVA.build.push=NOVA.build.pushPhone=0;
  const base=segment('rush',.76),recoiled=segment('blast',.4/STEPS.pace.blast);NOVA.build.push=savedPush;NOVA.build.pushPhone=savedPhone;
  assert.ok(Math.abs(rush.cam.s/base.cam.s-1-(VIEW.phone?savedPhone:savedPush))<1e-9);
  assert.deepEqual(blast.cam,recoiled.cam);
  assert.ok(Math.hypot(...[0,1].map(i=>MAP.x[i]*rush.cam.s+(i?rush.cam.ty:rush.cam.tx)-MAP.x[i]*base.cam.s-(i?base.cam.ty:base.cam.tx)))<1e-9,'push anchors on X');
}
tripResize(1440,900,120);footerNovaResize(1440,900);
const canvasSnapshot=t=>{canvas.ctx.calls.length=0;run(segment('rush',t),.017);return JSON.stringify(canvas.ctx.calls.map(c=>[c.name,c.args.map(a=>typeof a==='number'?+a.toFixed(8):a?.stops||a?.constructor?.name||a),/^(drawImage|fill|fillRect|stroke)$/.test(c.name)?c.alpha:null]));};
const recorded=[.001,.16,.26,.45,.60,.72,.82,.92,.96].map(t=>[t,canvasSnapshot(t)]);
for(const [t,frame] of recorded.slice().reverse())assert.equal(canvasSnapshot(t),frame,'actual canvas repeats and reverses');
canvas.ctx.calls.length=0;run(segment('blast',.00001));
const scale=canvas.ctx.calls.find(c=>c.name==='scale');assert.ok(scale.args[0]/segment('blast',.00001).cam.s>=NOVA.build.compressed&&scale.args[0]/segment('blast',.00001).cam.s<.602,'blast starts compressed');
for(const dpr of [1,3]){
  window.devicePixelRatio=dpr;footerNovaResize(1440,900);canvas.ctx.calls.length=0;run(segment('rush',.00000001));
  const redScale=canvas.ctx.calls.find(c=>c.name==='scale').args;
  assert.ok(Math.abs(redScale[0]-segment('rush',.00000001).cam.s)<1e-8&&Math.abs(redScale[1]-segment('rush',.00000001).cam.s)<1e-8,'handoff keeps SVG length/3.6 width');
  assert.ok(canvas.ctx.calls.some(c=>c.name==='drawImage'&&c.args[1]===-20&&c.args[2]===-8),'handoff uses rough sprite in original user space');
}
// V4-1 (critique round 4): the hand-over sprite is the map's own X, both rough strokes, at the exact camera scale on the screen's
// own pixel grid (not the nova canvas's capped DPR), in a canvas of its own. It is made once at rest at the X, shown 1:1 in place
// of the SVG X from the first rush frame while the canvas X fades in under it, then fades out, and is freed once the X is gone.
{
  const H=NOVA.handover, filter=mapDefs().match(/<filter id="rough"[^]*?<\/filter>/)[0];
  for(const dpr of [1,3]){
    window.devicePixelRatio=dpr;footerNovaResize(1440,900);
    const restX=segment('rush',0),made=images.length;run(restX);assert.equal(images.length,made+1,'exact sprite is made at rest at the X');
    run(restX);assert.equal(images.length,made+1,'the same rest makes it once');
    const img=images.at(-1),text=decodeURIComponent(img.source.split(',').slice(1).join(','));
    const k=restX.cam.s*dpr,cx=(MAP.x[0]*restX.cam.s+restX.cam.tx)*dpr,cy=(MAP.x[1]*restX.cam.s+restX.cam.ty)*dpr;
    const R=Math.ceil(H.reach*k)+2,size=2*R+1,x0=Math.floor(cx)-R,y0=Math.floor(cy)-R;
    assert.ok(text.includes(`width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"`),'sprite raster is 1:1 with device pixels at DPR '+dpr);
    assert.ok(text.includes(`translate(${cx-x0} ${cy-y0}) scale(${k})`),'sprite keeps the X beat scale times the screen DPR '+dpr);
    assert.equal((text.match(/class="fx-red"/g)||[]).length,2);assert.ok(text.includes(filter),'sprite uses the map rough filter');
    img.onload();
    const native=canvases.find(c=>/pointer-events:none/.test(c.style.cssText||''));
    assert.ok(native,'hand-over canvas exists');assert.equal(native.width,1440*dpr);assert.equal(native.height,900*dpr);
    assert.deepEqual(native.ctx.calls.filter(c=>c.name==='drawImage').at(-1).args,[img,x0,y0],'sprite drawn at whole device pixels');
    assert.equal(native.style.visibility,'hidden');assert.equal(x.style.visibility,'visible');
    canvas.ctx.calls.length=0;run(segment('rush',1e-6),.016);
    assert.equal(x.style.visibility,'hidden');assert.equal(native.style.visibility,'visible');assert.equal(native.style.opacity,'1');
    const red=canvas.ctx.calls.filter(c=>c.name==='drawImage'&&c.args[1]===-20);assert.ok(red.length&&red.every(c=>c.alpha<.001),'canvas X starts faint under the sprite');
    run(segment('rush',(H.fadeIn+H.fadeOut/2)/STEPS.pace.rush));assert.ok(Math.abs(+native.style.opacity-.5)<1e-9,'sprite fades out after the canvas X is in');
    run(segment('rush',(H.fadeIn+H.fadeOut)/STEPS.pace.rush+1e-6));assert.equal(native.style.visibility,'hidden');assert.equal(native.style.opacity,'0');
    run(restX);assert.equal(x.style.visibility,'visible');assert.equal(native.style.visibility,'hidden');assert.equal(native.width,1440*dpr,'kept for a Back into the rest');
    run(segment('blast',.2));assert.equal(native.width,0,'freed once the X is gone');
  }
  // A sprite that decodes only after the rush has started waits for the next rest: no switch, so no edge drawn twice, mid-hand-over.
  window.devicePixelRatio=1;footerNovaResize(1440,900);
  const restX=segment('rush',0);run(restX);const late=images.at(-1),native=canvases.find(c=>/pointer-events:none/.test(c.style.cssText||''));
  canvas.ctx.calls.length=0;run(segment('rush',1e-6),.016);assert.equal(native.style.visibility,'hidden');
  assert.ok(canvas.ctx.calls.some(c=>c.name==='drawImage'&&c.args[1]===-20&&c.alpha===1),'without a ready sprite the canvas X takes over at once');
  late.onload();canvas.ctx.calls.length=0;run(segment('rush',.02),.016);assert.equal(native.style.visibility,'hidden','late sprite stays out of a running hand-over');
  assert.ok(canvas.ctx.calls.some(c=>c.name==='drawImage'&&c.args[1]===-20&&c.alpha===1));
  run(restX);run(segment('rush',1e-6),.016);assert.equal(native.style.visibility,'visible','late sprite serves the next hand-over');
  window.devicePixelRatio=3;footerNovaResize(1440,900);
}
console.log('ok: V4-1 hand-over sprite at DPR 1/3: map X strokes and rough filter at exact scale, 1:1 device pixels in its own canvas, shown in place of the SVG X on the first rush frame, canvas X fades in under it, then it fades out; kept for Back, freed at the blast');
const starCanvas=novaCanvas();starsBuild(starCanvas);starsResize(1440,900);
const starSnapshot=(t,time)=>{starCanvas.ctx.calls.length=0;const st=segment('rush',t);starsTick(.1,st);starsFrame(time,st,[.5,.5]);return JSON.stringify(starCanvas.ctx.calls.map(c=>[c.name,c.args,/^(fill|fillRect|stroke)$/.test(c.name)?c.alpha:null]));};
const starForward=[.01,.26,.45,.60,.72,.83,.93,.97].map(t=>[t,starSnapshot(t,3)]);
const positionsOnly = frame => JSON.stringify(JSON.parse(frame).filter(c=>['fillRect','arc','moveTo','lineTo','quadraticCurveTo'].includes(c[0])).map(c=>JSON.stringify(c.slice(0,2))).sort());
for(const [t,frame] of starForward.slice().reverse())assert.ok(t*STEPS.pace.rush<.3 ? positionsOnly(starSnapshot(t,200))===positionsOnly(frame) : starSnapshot(t,200)===frame,'rush replay at '+t);
starSnapshot(0,800);
for(const [t,frame] of starForward)assert.equal(t*STEPS.pace.rush<.3 ? positionsOnly(starSnapshot(t,900)) : starSnapshot(t,900),t*STEPS.pace.rush<.3 ? positionsOnly(frame) : frame,'replay positions during first .3 s; positions and light thereafter at '+t);
const xLight=starSnapshot(0,40),xLater=starSnapshot(0,41);
assert.notEqual(xLight,xLater,'X sky keeps twinkling');assert.equal(positionsOnly(xLight),positionsOnly(xLater),'X twinkle does not move stars');
// V4-1: the stars carry straight on through the first rush frame (no twinkle phase switch, no release of the pull toward the X, no alpha jump).
{
  const dots=(st,time)=>{starCanvas.ctx.calls.length=0;starsTick(.016,st);starsFrame(time,st,[.5,.5]);return starCanvas.ctx.calls.filter(c=>(c.name==='fillRect'||c.name==='arc')&&c.alpha>.004).map(c=>[c.args[0],c.args[1],c.alpha]);};
  starSnapshot(0,1);const rest=dots(segment('rush',0),40),first=dots(segment('rush',1e-6),40.016);
  let far=0,fade=0;
  for(const [x0,y0,a0] of rest){let best=null;for(const d of first){const gap=Math.hypot(d[0]-x0,d[1]-y0);if(!best||gap<best[0])best=[gap,Math.abs(d[2]-a0)];}far=Math.max(far,best[0]);fade=Math.max(fade,best[1]);}
  assert.ok(Math.abs(first.length-rest.length)<=rest.length*.02,'visible stars either side of the rush start: '+rest.length+' then '+first.length);
  assert.ok(far<.5&&fade<.02,'first rush frame moves a star '+far.toFixed(3)+' px and changes its alpha '+fade.toFixed(4));
}
// The actual writer already has zero identical-frame map writes; reject new SVG effects too.
assert.ok(!/createElementNS|findSvg\(/.test(readFileSync(new URL('../footer.mjs',import.meta.url),'utf8')));
console.log('ok: D3 3 s reversible canvas/star score; four increasing throbs >=340 ms apart (light only); stars and spikes speed up without lurches; 16 ms alpha deltas <=.08; tremble to the blast; compressed blast, anchored push/recoil and rough 3.6-width handoff at DPR 1/3');
// WHIRL: use the same source planner and position model as the actual canvas, at the X beat.
for(const [w,h,n] of [[1440,900,0],[412,730,0],[390,844,0],[360,640,0],[1440,900,1200],[412,730,278],[390,844,305],[360,640,213],[390,844,240]]){
  tripResize(w,h,w>640?120:96);starsJoin(null);starsBuild(starCanvas);starsResize(w,h);
  if(n){starsJoin({count:n,drawn(i,out){out[0]=i*83%w;out[1]=i*137%h;return out;},look(i){return {size:2,alpha:.8,colour:i%20?C.paper:C.red};}});starsFrame(0,segment('handoff',0),[.5,.5]);}
  starsFrame(0,segment('rush',0),[.5,.5]);
  const st=segment('rush',0),centre=[MAP.x[0]*st.cam.s+st.cam.tx,MAP.x[1]*st.cam.s+st.cam.ty];
  const rows=starsRushSources(),gather=rows.filter(row=>row.gather),counts=Array(NOVA.gather.sectors).fill(0);
  const trail=rows.filter(row=>row.s.kind==='trail'),seaStars=rows.filter(row=>row.s.kind==='sea');
  assert.equal(trail.length,TRAIL_DOTS.length,'every trail destination retains its own star');
  assert.equal(new Set(trail.map(row=>row.s.map)).size,TRAIL_DOTS.length,'trail destinations are unique');
  assert.ok(TRAIL_DOTS.every(dot=>trail.some(row=>row.s.map===dot)),'no trail destination is missing');
  assert.ok(seaStars.length>0&&[...trail,...seaStars].every(row=>!row.s.skyHome),'no trail or sea identity may be reserved for sky');
  assert.equal(new Set([...trail,...seaStars].map(row=>row.s)).size,trail.length+seaStars.length,'destinations have distinct identities');
  assert.ok(rows.filter(row=>row.s.skyHome).every(row=>row.s.kind==='coast'),'only coast identities may stay in the sky');
  for(const row of gather){counts[row.sector]++;assert.ok(row.from[0]>=0&&row.from[0]<=w&&row.from[1]>=0&&row.from[1]<=h,'source starts on screen');}
  console.log(`WHIRL ${w}x${h} ${n?'joined '+n:'standalone'}: sectors ${counts.join(', ')}; ${gather.length} gathering`);
  assert.ok(counts.every(count=>count===(VIEW.phone?8:14)),'each sector meets its full phone/desktop target');
  console.log(`WHIRL2 ${w}x${h} ${n?'joined '+n:'standalone'}: added ${rows.filter(row=>row.s.added).length}; trail ${trail.length}/${TRAIL_DOTS.length}; sea ${seaStars.length}; coast-only reservation`);
  assert.ok(gather.length>0,'a visible source in every sector is required');assert.ok(Math.max(...counts)-Math.min(...counts)<=1);
  assert.deepEqual(starsRushSources(),rows,'seeded sources repeat');
  const replanned=novaGatherSources(rows.map(({s,from,visible})=>({s,from,visible})),centre,w,h,VIEW.phone);
  assert.deepEqual(replanned.filter(row=>row.gather).map(row=>row.s),gather.map(row=>row.s),'renderer uses the sector selector');
  for(let sector=0;sector<counts.length;sector++){
    const pool=rows.filter(row=>row.sector===sector&&row.visible&&row.from[0]>=0&&row.from[0]<=w&&row.from[1]>=0&&row.from[1]<=h&&row.distance>0).sort((a,b)=>a.distance-b.distance);
    const selected=pool.filter(row=>row.gather);
    for(let i=0;i<selected.length;i++)assert.ok(pool.indexOf(selected[i])>=Math.floor(i*pool.length/selected.length)&&pool.indexOf(selected[i])<Math.floor((i+1)*pool.length/selected.length),'one stable source from every depth stratum');
  }
  const dots=t=>{starCanvas.ctx.calls.length=0;starsFrame(3,segment('rush',t),[.5,.5]);return starCanvas.ctx.calls.filter(c=>(c.name==='fillRect'||c.name==='arc')&&c.alpha>.004).map(c=>c.name==='arc'?c.args.slice(0,2):[c.args[0]+c.args[2]/2,c.args[1]+c.args[3]/2]);};
  const restDots=dots(0),rushDots=dots(.6),has=(dots,p)=>dots.some(d=>Math.hypot(d[0]-p[0],d[1]-p[1])<1e-6);
  // Dan, 2026-11-24: "the trail stays while the supernova explodes". Nothing that does not gather is pinned to the screen while the
  // rush camera centres the X: the sea keeps its own place on the map, and the trail runs down its own route into the X, the nearest
  // dots first, all of it gone by the blast. (Until then a non-gathering star stayed at its rush-start screen position.)
  {
    const reach=trail[0].reach,pull=(st,m)=>{const X=toScreen(st,MAP.x),dx=X[0]-m[0],dy=X[1]-m[1],d=Math.hypot(dx,dy),k=st.legXT>0&&d<260?.12*st.legXT*(1-d/260):0;return [m[0]+dx*k,m[1]+dy*k];};
    const on=p=>p[0]>=-10&&p[0]<=w+10&&p[1]>=-10&&p[1]<=h+10;
    assert.ok(trail.every(row=>row.reach===reach&&!row.gather),'the trail does not whirl; it has one run');
    assert.ok(trail.some(row=>X_U-row.s.u<reach&&on(row.from)),'the trail on screen at the X takes part in the run');
    let ran=0,beyond=0;
    for(const t of [.2,.6,.9]){
      const st=segment('rush',t),drawn=dots(t),run=reach*t**NOVA.build.pull;
      for(const row of rows.filter(row=>!row.gather&&row.s.kind==='sea')){const p=pull(st,toScreen(st,row.s.map));if(on(p))assert.ok(has(drawn,p),'a sea star that does not gather keeps its own place on the map at '+t);}
      for(const row of trail){
        const d0=X_U-row.s.u,left=d0-run;
        if(d0>=reach){const q=pull(st,toScreen(st,row.s.map));if(on(q)){assert.ok(t<.9&&has(drawn,q),'the trail beyond the run keeps its place on the map, and the camera takes it off screen before the blast');beyond++;}continue;}
        const p=pull(st,toScreen(st,pointAt(X_U-left)));
        if(left>0&&on(p)&&.9*smooth(0,Math.min(MAP.dotGap,d0),left)>.01){assert.ok(has(drawn,p),'a trail dot runs down its route at '+t);ran++;}
      }
    }
    assert.ok(ran>0);if(beyond)console.log(`TRAIL ${w}x${h} ${n||'map'}: ${beyond} draws of an earlier leg at the top edge leave with the camera before t .9`);
    assert.ok(trail.every(row=>X_U-row.s.u>=reach||X_U-row.s.u-reach*.999**NOVA.build.pull<MAP.dotGap*.05),'the whole trail on screen has run into the X by the blast');
  }
  for(const row of gather){
    for(let k=0;k<=300;k++){
      const q=NOVA.gather.join*k/300,at=novaGatherPoint(row.from,centre,row.angle,row.radius,q),r=Math.hypot(at[0]-centre[0],at[1]-centre[1]);
      assert.ok(r>=row.radius-1e-6,'approach cuts inside its own ring');
    }
    const at=novaGatherPoint(row.from,centre,row.angle,row.radius,NOVA.gather.join);
    assert.ok(Math.hypot(at[0]-centre[0]-row.radius*Math.cos(row.angle),at[1]-centre[1]-row.radius*Math.sin(row.angle))<1e-6,'own bearing plus swirl meets the ring');
  }
  const point=(row,seconds)=>{const s=segment('rush',seconds/STEPS.pace.rush),c=[MAP.x[0]*s.cam.s+s.cam.tx,MAP.x[1]*s.cam.s+s.cam.ty];return novaGatherPoint(row.from,row.centre,row.angle,row.radius,novaBuildGather(seconds/STEPS.pace.rush,row.order)).map((v,i)=>v+c[i]-row.centre[i]);};
  for(const row of gather){let last=row.distance;for(let frame=1;frame<=180;frame++){const seconds=frame/60,s=segment('rush',seconds/3),c=[MAP.x[0]*s.cam.s+s.cam.tx,MAP.x[1]*s.cam.s+s.cam.ty],p=point(row,seconds),r=Math.hypot(p[0]-c[0],p[1]-c[1]);assert.ok(r<=last+1e-6,'radius must never travel backwards');last=r;}}
  const speed=seconds=>{const active=gather.filter(row=>novaBuildGather(seconds/STEPS.pace.rush,row.order)<1),delta=1/60;return {active:active.length,mean:active.reduce((sum,row)=>{const a=point(row,seconds-delta),b=point(row,seconds);return sum+Math.hypot(b[0]-a[0],b[1]-a[1])/delta;},0)/active.length};};
  const base=speed(1);let least=Infinity,leastOnWay=1;
  for(let frame=60;frame<180;frame++){const seconds=frame/60,v=speed(seconds);least=Math.min(least,v.mean);leastOnWay=Math.min(leastOnWay,v.active/gather.length);assert.ok(v.mean>=base.mean-1e-6,`mean speed falls below 1 s: ${seconds}s ${v.mean} < ${base.mean}`);assert.ok(v.active/gather.length>=.05,`under 5% on the way at ${seconds}s`);}
  for(const seconds of [1,2,2.5,2.9,2.98]){const v=speed(seconds);console.log(`WHIRL ${w}x${h} ${n?'joined':'standalone'} ${seconds.toFixed(2)}s: ${v.mean.toFixed(2)} px/s, ${v.active}/${gather.length} on way`);}
  const arrivals=gather.map(row=>{let lo=0,hi=1;for(let k=0;k<40;k++){const mid=(lo+hi)/2;if(novaBuildGather(mid,row.order)<1)lo=mid;else hi=mid;}return hi;});
  assert.ok((1-Math.max(...arrivals))*STEPS.pace.rush<=1/60+1e-9,'last arrival must land within one frame of the blast');
  assert.ok(gather.every(row=>novaBuildGather(1,row.order)===1));
  console.log(`WHIRL ${w}x${h} ${n?'joined':'standalone'}: minimum ${least.toFixed(2)} px/s vs ${base.mean.toFixed(2)} at 1s; minimum on way ${(leastOnWay*100).toFixed(2)}%; last ${(Math.max(...arrivals)*STEPS.pace.rush).toFixed(6)}s`);
}
for(const phone of [false,true])for(const key of ['heat','core','glowAlpha']){
  let flat=0;
  for(let frame=120;frame<180;frame++){const a=novaBuild(frame/180,phone),b=novaBuild((frame+1)/180,phone),throb=NOVA.build.throbs.some(t=>frame/180>=t&&(frame+1)/180<=t+NOVA.build.fall/3);
    if(throb&&key==='glowAlpha')continue;assert.ok(b[key]>=a[key]-1e-9,key+' falls after 2s');flat=b[key]-a[key]<1e-10?flat+1:0;assert.ok(flat<=6,key+' flat for more than .1s');}
}
console.log('ok: WHIRL balanced visible sectors, own-side ring approach, continuous drain through last frame, speed/5%/last-arrival gates and rising late heat/core/glow alpha');
const rmX=new NovaNode(),rmCanvas=novaCanvas();footerBuildX(rmX,true,rmCanvas,hit);footerNovaResize(390,844);footerMotion(2,.016,segment('rest',0),[0,0],true);
assert.equal(rmCanvas.ctx.calls.length,0);assert.equal(rmX.style.visibility,undefined);assert.ok(!/fx-hit|fx-white/.test(rmX.innerHTML));
console.log('ok: rough sprite grows on resize; reduced motion leaves canvas empty and static SVG X unchanged');
