// Node-only pace checks, including every neighbouring beat in both directions.
import { BEATS, paceT, paceP, paceMove, paceAt } from '../pace.mjs';
import { JOURNEY, stepsBuild, stepsFrame } from '../steps.mjs';
import { tripResize, tripState, tripCardPlace, VIEW, toScreen, SEQ, glideMove, lerp } from '../trip.mjs';
import { cardsBuild, cardsOverride, cardsClose, cardsList, cardsFrame } from '../cards.mjs';
import { CARD_CLOSE, CAMERA, MAP, MARK, CARD_TAIL, STEPS } from '../data.mjs';
import { exploreBuild, exploreResize, exploreApply, exploreActive, exploreEnd } from '../explore.mjs';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const stepAssert = (condition, message) => { if (!condition) throw new Error(message); };
const stepEnd = BEATS[BEATS.length - 1].P;
let stepPrevious = -1;
for (let P = 0; P <= stepEnd; P++) {
  const t = paceT(P);
  stepAssert(t > stepPrevious, `paceT did not rise at ${P}`); stepPrevious = t;
  stepAssert(Math.abs(paceP(t) - P) < 1e-6, `inverse failed at ${P}`);
}
stepAssert(Math.abs(paceP(paceT(stepEnd)) - stepEnd) < 1e-6, 'inverse failed at rest');
console.log('ok: paceT strictly rises; paceP round trips every whole P and the rest boundary within 1e-6');
console.log('move | forward seconds | back seconds');
for (let i = 1; i < BEATS.length; i++) {
  const a = BEATS[i - 1], b = BEATS[i], forward = glideMove(a.P,b.P) || paceMove(a.P, b.P), back = glideMove(b.P,a.P) || paceMove(b.P, a.P);
  const at = (move,t) => move.glide ? lerp(move.P0,move.P1,Math.min(1,t/move.D)) : paceAt(move,t);
  for (const move of [forward, back]) {
    stepAssert(at(move, 0) === move.P0 && Math.abs(move.P0 - (move === forward ? a.P : b.P)) < 1e-6, 'move start');
    stepAssert(at(move, move.D) === move.P1 && Math.abs(move.P1 - (move === forward ? b.P : a.P)) < 1e-6, 'move end');
    let prev = move.P0;
    for (let n = 1; n <= 1000; n++) {
      const p = at(move, move.D * n / 1000);
      stepAssert((p - prev) * Math.sign(move.P1 - move.P0) >= -1e-9, `move reversed: ${a.id}/${b.id}`); prev = p;
    }
  }
  stepAssert(forward.D >= 1.5 && forward.D <= (a.id === 'x' ? STEPS.pace.rush + STEPS.pace.blast + STEPS.pace.settle : 5) + 1e-9, `forward duration outside beat timing: ${a.id}/${b.id}`);
  if(forward.glide)stepAssert(forward.D>=2.6&&forward.D<=4.4&&forward.D===back.D,'D4 glide durations must match both ways');
  console.log(`${a.id} -> ${b.id} | ${forward.D.toFixed(3)} | ${back.D.toFixed(3)}`);
}
console.log('ok: all 18 moves start/end correctly and never turn back; D4 glides use equal 2.6-4.4 s durations both ways; X-to-end keeps the 3 s rush plus blast/settle');

// Recording nodes exercise controls, not rendered pixels. Any geometry read here fails.
class StepNode {
  get firstElementChild() { return this.children[0] || null; }
  constructor(tag = 'div') { this.tagName = tag; this.children = []; this.attrs = {}; this.dataset = {}; this.style = { setProperty(k, v) { this[k] = v; } }; this.listeners = {}; this.className = ''; this.classList = { contains: c => this.className.split(' ').includes(c), add: c => this.classList.toggle(c, true), remove: c => this.classList.toggle(c, false), toggle: (c, on) => { const set = new Set(this.className.split(' ').filter(Boolean)); on = on ?? !set.has(c); if (on) set.add(c); else set.delete(c); this.className = [...set].join(' '); } }; }
  setAttribute(k, v) { this.attrs[k] = String(v); if (k === 'class') this.className = v; }
  getAttribute(k) { return this.attrs[k]; }
  appendChild(n) { this.children.push(n); n.parentElement = this; return n; }
  append(...ns) { ns.forEach(n => this.appendChild(n)); }
  prepend(...ns) { this.children.unshift(...ns); }
  set innerHTML(html) { const stack = [this]; this.children = []; for (const match of html.matchAll(/<\/?([\w-]+)([^>]*?)\/?\s*>/g)) { if (match[0].startsWith('</')) { if (stack.length > 1) stack.pop(); continue; } const n = new StepNode(match[1]); for (const a of match[2].matchAll(/([\w-]+)(?:="([^"]*)")?/g)) n.setAttribute(a[1], a[2] || ''); stack.at(-1).appendChild(n); if (!match[0].endsWith('/>') && match[1] !== 'img') stack.push(n); } }
  matches(s) { return s.startsWith('.') ? this.classList.contains(s.slice(1)) : s.startsWith('[') ? Object.hasOwn(this.attrs, s.slice(1, -1)) : this.tagName === s; }
  querySelectorAll(s) { return this.children.flatMap(n => [...(n.matches(s) ? [n] : []), ...n.querySelectorAll(s)]); }
  querySelector(s) { return this.querySelectorAll(s)[0] || null; }
  closest(s) { return s.split(',').some(c => this.matches(c.trim())) ? this : this.parentElement?.closest(s) || null; }
  contains(n) { return n === this || this.children.some(c => c.contains(n)); }
  addEventListener(t, f) { (this.listeners[t] ??= []).push(f); }
  fire(t, props = {}) { const e = { type: t, target: this, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, stopImmediatePropagation() { this.stopped = true; }, ...props }; if (!this.blocked()) (this.listeners[t] || []).forEach(f => { if(!e.stopped)f(e); }); return e; }
  blocked() { for(let n=this;n;n=n.parentElement)if(n.inert)return true;return false; }
  focus(options) { if(this.blocked())return;document.activeElement = this; this.focusOptions = options; }
  getBoundingClientRect() { throw new Error('unexpected layout read'); }
}
const stepWindow = new StepNode(), stepStage = new StepNode(), stepRoot = new StepNode(), stepBody = new StepNode();
globalThis.window = Object.assign(stepWindow, { location: { search: '?mode=scroll' }, scrollY: 0, scrollTo() {}, dispatchEvent() {} });
globalThis.document = { documentElement: stepRoot, body: stepBody, activeElement: null, createElement: tag => new StepNode(tag), createElementNS: (ns,tag) => new StepNode(tag), getElementById: id => stepStage.children.find(n => n.id === id), querySelector: s => stepStage.querySelector(s) };
globalThis.history = { scrollRestoration: 'auto' };
let stepJoined = false;
tripResize(1440, 900, 120); stepsBuild({ stage: stepStage, rm: false, resize() {}, joinedTop: () => stepJoined });
exploreBuild({ stage: stepStage, world: new StepNode(), journey: JOURNEY, rm: false }); exploreResize();
stepAssert(JOURNEY.mode === 'steps' && JOURNEY.setMode === undefined, 'removed Scroll mode remains callable or address selects it');
stepAssert(stepBody.children[0].querySelectorAll('button').length === 1 && stepBody.children[0].querySelector('[data-depth]'), 'review must have only Depth');
const empty = new StepNode(); let stepClock = 0;
const tick = ms => { for(let remaining=ms;remaining>0;){const dt=Math.min(16,remaining);stepClock+=dt;stepsFrame(stepClock);remaining-=dt;} };
const finish = () => { for(let n=0;JOURNEY.moving&&n<600;n++)tick(16);stepAssert(!JOURNEY.moving,'move did not finish'); };
const wheel = dy => stepWindow.fire('wheel',{target:empty,deltaY:dy,deltaMode:0,timeStamp:stepClock});
const mapP = BEATS[1].P, unit = 9;
// Run the joined page's actual leave function against its recording hero API.
const joinSource=readFileSync(new URL('../join.mjs',import.meta.url),'utf8');
stepAssert(/button\.addEventListener\('click', \(\) => JOURNEY\.next\(\)\)/.test(joinSource),'joined Start must use the locking next action');
let lift=0;const joinNodes=()=>({classList:{toggle(){}},style:{}}),JN={api:{setAway(){},setLeave(px){lift=px;}},hero:joinNodes(),svg:joinNodes(),ov:joinNodes(),hit:joinNodes()};
const joinPlace=runInNewContext(joinSource.slice(joinSource.indexOf('function place('),joinSource.indexOf('const setOp'))+'\nplace',{JN,LEAVE_END:100,JOIN_OVERLAP:28,stepsProgress:()=>JOURNEY.P,JOURNEY,unit:()=>unit,window:{dispatchEvent(){}},Event});
for(const joined of [false,true]) {
  stepJoined=joined;JOURNEY.set(0);tick(16);
  wheel(mapP*.1*unit);tick(120);const first=JOURNEY.P;
  stepAssert(first>0&&first<mapP,'F1 first wheel starts the complete move immediately');
  stepAssert(tripState(first).heroT===first/100,'title/hero leave follows P');
  if(joined){joinPlace();stepAssert(Math.abs(lift-first*unit)<1e-6,'real joined leave must follow P');}
  wheel(-mapP*.05*unit);tick(120);stepAssert(JOURNEY.P>first,'same-gesture reversal is ignored');
  tick(251);wheel(-100);finish();stepAssert(JOURNEY.P===0,'a fresh reverse gesture turns the move around');
  JOURNEY.set(0);wheel(100);finish();stepAssert(JOURNEY.P===mapP,'one notch reaches whole map');
  JOURNEY.set(0);for(let n=0;n<40;n++){wheel(3);tick(15);}finish();stepAssert(JOURNEY.P===mapP,'trackpad momentum starts only one move');
  JOURNEY.set(0);
  wheel(mapP*.3*unit);tick(401);finish();stepAssert(JOURNEY.P===mapP,'30 percent must finish at map');
  wheel(200);tick(700);stepAssert(JOURNEY.P===mapP&&!JOURNEY.moving,'wheel down at map must do nothing');
  wheel(-mapP*.3*unit);tick(401);finish();stepAssert(JOURNEY.P===0,'scroll from map must return to top');
  wheel(-200);tick(700);stepAssert(JOURNEY.P===0,'wheel up at top must do nothing');
  // Start button/API and Set out both disable scroll immediately, including during travel.
  for(const start of ['top','map']){
    JOURNEY.set(0);if(start==='map'){wheel(mapP*.3*unit);tick(401);finish();}
    JOURNEY.next();tick(100);const moving=JOURNEY.P;wheel(300);tick(0);stepAssert(JOURNEY.P===moving,'wheel changed P after Start/Set out');finish();
    for(const beat of BEATS.slice(1)){JOURNEY.set(beat.P);wheel(-100);tick(500);stepAssert(JOURNEY.P===beat.P&&!JOURNEY.moving,'locked wheel moved '+beat.id);}
    JOURNEY.go('top');finish();wheel(100);tick(120);stepAssert(JOURNEY.P>0,'Back to top must restore scroll');
  }
  JOURNEY.set(0);JOURNEY.next();finish();JOURNEY.back();finish();wheel(100);tick(120);stepAssert(JOURNEY.P>0,'Back steps to top must restore scroll');
  const touch=(type,y,time,props={})=>stepWindow.fire(type,{target:empty,timeStamp:time,cancelable:true,touches:type==='touchend'?[]:[{clientX:100,clientY:y}],...props});
  // Both fast and slow 24+ px swipes start before release and stay at the map.
  JOURNEY.set(0);touch('touchstart',300,0);touch('touchmove',240,40);tick(40);touch('touchend',240,60);finish();stepAssert(JOURNEY.P===mapP,'fast swipe must finish in its direction');
  JOURNEY.set(0);touch('touchstart',300,0);touch('touchmove',276,400);tick(16);stepAssert(JOURNEY.moving,'slow swipe starts at 24 px before release');touch('touchend',276,410);finish();stepAssert(JOURNEY.P===mapP,'slow swipe finishes at the map');
  // Respect default-prevented touch/pointer starts and hero-owned touch-action.
  const hero=new StepNode();hero.setAttribute('data-hero','');const drag=new StepNode();hero.appendChild(drag);stepWindow.getComputedStyle=el=>({touchAction:el===drag?'none':'auto'});
  for(const props of [{defaultPrevented:true},{target:drag}]){JOURNEY.set(0);touch('touchstart',300,0,props);touch('touchmove',100,40);touch('touchend',100,50);tick(1000);stepAssert(JOURNEY.P===0,'owned hero touch was stolen');}
  stepWindow.fire('pointerdown',{target:empty,pointerType:'touch',defaultPrevented:true});touch('touchstart',300,0);touch('touchmove',100,40);touch('touchend',100,50);tick(1000);stepAssert(JOURNEY.P===0,'prevented pointer start was stolen');
  JOURNEY.next();finish();const locked=JOURNEY.P;touch('touchstart',300,0);const swipe=touch('touchmove',100,40);touch('touchend',100,50);tick(600);stepAssert(swipe.defaultPrevented&&JOURNEY.P===locked,'locked swipe moved journey');
  JOURNEY.set(0);touch('touchstart',300,0);touch('touchend',300,50);stepAssert(!stepWindow.fire('click',{detail:1}).defaultPrevented,'tap on a button/link must survive');
  console.log('ok: F1 '+(joined?'joined hero':'map title')+' one-notch/burst/swipe, 250 ms gesture latch, fresh reverse, Start/Set out lock, owned drags and taps');
}
for (const beat of BEATS.slice(1)) {
  JOURNEY.go(beat.id,{instant:true}); stepsFrame(stepClock += 50);
  for (let i = 0; i < 12; i++) stepWindow.fire('wheel', { target: empty, deltaY: i % 2 ? -120 : 120 });
  stepAssert(JOURNEY.P === beat.P && !JOURNEY.moving, 'wheel moved journey');
}
JOURNEY.next(); stepAssert(!exploreActive(), 'Next key/API at end must not start explore');
stepWindow.fire('keydown', { target: empty, key: 'ArrowRight' }); stepAssert(!exploreActive(), 'arrow at end must not start explore');
const go = stepStage.children.find(n => n.classList.contains('go'));
go.querySelector('.go-next').fire('click'); stepAssert(exploreActive(), 'end CTA did not start explore');
const endP = JOURNEY.P; exploreApply(tripState(endP), 1.6); JOURNEY.back(); stepAssert(!exploreActive() && JOURNEY.P === endP, 'first Back must only end exploring');
exploreApply(tripState(endP), .9); JOURNEY.back(); stepAssert(JOURNEY.moving, 'second Back did not leave end');
JOURNEY.set(BEATS[1].P); stepWindow.fire('keydown', { target: empty, key: 'ArrowRight' });
stepAssert(JOURNEY.moving, 'key did not start a move'); const keyStart = JOURNEY.P; stepsFrame(stepClock += 50); stepAssert(JOURNEY.P > keyStart, 'key move did not progress');
console.log('ok: address cannot select Scroll; review only Depth; locked wheel never steps; only end CTA explores; two Back presses return then step; keyboard still advances');

for (const size of [[1440,900,120],[412,730,96]]) {
  tripResize(...size);
  const x=BEATS.find(b=>b.id==='x');
  JOURNEY.set(x.P);tick(16);let started=stepClock;JOURNEY.next();finish();const duration=stepClock-started;
  for(const ms of [500,1500,2500,3300,4400])for(const key of ['ArrowRight','ArrowDown','PageDown',' ']) {
    JOURNEY.set(x.P);tick(16);started=stepClock;JOURNEY.next();tick(ms);
    stepWindow.fire('keydown',{target:empty,key});finish();
    stepAssert(Math.abs(stepClock-started-duration)<17,'second '+key+' at '+ms+' shortened supernova');
  }
  JOURNEY.set(x.P);tick(16);JOURNEY.next();tick(1500);JOURNEY.back();tick(50);JOURNEY.back();finish();
  stepAssert(JOURNEY.P===x.P,'second Back crossed the X');
  JOURNEY.set(x.P);tick(16);JOURNEY.next();tick(500);stepWindow.fire('keydown',{target:empty,key:'End'});tick(800);
  stepAssert(JOURNEY.P===stepEnd&&!JOURNEY.moving,'explicit End must still jump');
  stepWindow.fire('keydown',{target:empty,key:'Home'});tick(800);stepAssert(JOURNEY.P===0&&!JOURNEY.moving,'explicit Home must still jump');
  console.log('ok: C1 '+size[0]+'x'+size[1]+' 20 repeated Next keys preserve '+duration+' ms arrival; repeated Back returns only to X');
}
tripResize(1440,900,120);

const cardContainer = new StepNode(); let navigations = 0; cardsBuild(cardContainer, () => navigations++);
stepAssert(cardContainer.querySelectorAll('.c-close').length === 6, 'every motion card needs X');
for (const c of cardsList()) {
  const x = c.el.querySelector('.c-close'), top = c.el.querySelector('.c-top');
  stepAssert(c.face.contains(x) && top.children.at(-1) === x, 'X must be the last control in the face header');
  stepAssert(c.card.contains(c.face) && !c.card.contains(c.btn) && !c.card.contains(c.tail), 'shield and tail must stay outside the growing/tilting face');
}
const stopP = BEATS[2].P; JOURNEY.set(stopP); cardsList().forEach(c => c.H = 420); let cardState = tripState(stopP); cardsOverride(cardState, 0, false); cardsFrame(cardState); stepAssert(cardsClose(), 'card did not close');
cardState = tripState(stopP); cardsOverride(cardState, CARD_CLOSE.time / 2, false); stepAssert(cardState.cardK[0] > 0 && cardState.cardK[0] < 1 && cardState.P === stopP, 'card halfway fold');
cardState = tripState(stopP); cardsOverride(cardState, CARD_CLOSE.time / 2, false); stepAssert(cardState.cardK[0] === 0 && cardState.P === stopP, 'card fold changed P or failed');
cardsFrame(cardState); cardsList()[0].btn.focus(); cardsList()[0].btn.fire('click'); cardState = tripState(stopP); cardsOverride(cardState, CARD_CLOSE.time, false); cardsFrame(cardState); stepAssert(cardState.cardK[0] === 1 && navigations === 0, 'closed stop mark must reopen locally');
const cardX = cardsList()[0].el.querySelector('.c-close'); stepAssert(document.activeElement === cardX && cardX.focusOptions.preventScroll === true, 'reopened card must focus its X without scrolling');
for(const[w,h]of [[1440,900],[390,844]]){
  tripResize(w,h,w<=640?96:120);
  cardsList().forEach((c,i)=>{c.W=tripCardPlace(c.H).w;c.place=tripCardPlace(c.H);VIEW.cards[i]=c.place;});
  for(const direction of [1,-1])for(let ms=0;ms<=500;ms+=50){
    const state=tripState(stopP);state.cardK.fill(0);state.cardK[0]=direction>0?ms/500:1-ms/500;cardsOverride(tripState(stopP),.05,false);cardsFrame(state,[15,-15],[0,0]);
    const c=cardsList()[0],m=c.tail.querySelector('path').getAttribute('d').match(/-?[\d.]+(?:e[+-]?\d+)?/g).map(Number),tip=[m[2],m[3]],size=Math.max(MARK.min,Math.min(MARK.max,MARK.k*state.cam.s));
    if(c.tail.style.opacity>0)stepAssert(Math.abs(Math.hypot(...tip)-size*(MARK.radius+MARK.rim/2)/MARK.box-CARD_TAIL.gap)<1e-7,'tail left rim during open/close/tilt');
    stepAssert(c.btn.style.opacity===1,'opening must never fade the shield');stepAssert(!c.el.style.transform.includes('scale'),'article must not scale its shield');
  }
}
tripResize(1440,900,120);VIEW.cards=[];
console.log('ok: ORIGIN 50 ms desktop/phone open and reverse-close recording: tail stays on rim through tilt; shield never scales with the face or fades; X is inside the header');
JOURNEY.next(); stepAssert(JOURNEY.moving, 'mid-move X fixture must be moving'); cardX.focus(); cardX.fire('click'); stepAssert(document.activeElement !== cardsList()[0].btn, 'mid-move X focused departed stop mark'); stepAssert(cardsClose(0) === false, 'X must be ignored mid-move');
JOURNEY.set(stopP);
// D3: model the browser's focus-on-pointerdown and loss when a face becomes inert.
const hmcP=BEATS.find(b=>b.id==='hmc1').P,hmc=cardsList()[1],hmcX=hmc.el.querySelector('.c-close');
JOURNEY.set(hmcP);let hmcState=tripState(hmcP);cardsOverride(hmcState,0,false);cardsFrame(hmcState);go.querySelector('.go-next').focus();JOURNEY.next();
for(let n=0;n<4;n++){stepsFrame(stepClock+=50);hmcState=tripState(JOURNEY.P);cardsOverride(hmcState,.05,true);cardsFrame(hmcState);}
stepAssert(hmcX.inert===true,'moving card X must be inert');hmcX.focus();hmcX.fire('click');
for(let n=0;JOURNEY.moving&&n<200;n++){stepsFrame(stepClock+=50);hmcState=tripState(JOURNEY.P);cardsOverride(hmcState,.05,JOURNEY.moving);cardsFrame(hmcState);if(hmc.face.inert&&hmc.el.contains(document.activeElement))document.activeElement=stepBody;}
stepAssert(!JOURNEY.moving&&document.activeElement!==stepBody&&!hmc.el.contains(document.activeElement),'200 ms HMC X press must leave focus outside departed card/body');
JOURNEY.set(stopP);
cardsClose(); cardsOverride(tripState(BEATS[3].P), 0, false); cardState = tripState(stopP); cardsOverride(cardState, 0, false); stepAssert(cardState.cardK[0] === 1, 'leaving stop must forget closed state');
const reducedCards = new StepNode(); cardsBuild(reducedCards, () => {}, true); stepAssert(reducedCards.querySelectorAll('.c-close').length === 0, 'reduced-motion cards must have no close button');
console.log('ok: six card X controls; local reopen focuses X without scrolling; mid-move X cannot focus departed mark; departure forgets override; reduced-motion list has no X');

for(const [w,h,tl] of [[1440,900,120],[390,844,96]]){
  tripResize(w,h,tl);const x=tripState(BEATS.find(b=>b.id==='x').P);
  if(w>640){const bottom=toScreen(x,[0,CAMERA.frameBottom])[1],top=h-56-STEPS.nav.gap-STEPS.nav.h;stepAssert(bottom<=top-12,'desktop X frame crosses stepper');}
  else{const g=CAMERA.xGroupPhone,X=toScreen(x,MAP.x),A=toScreen(x,[MAP.x[0]+g[0],MAP.x[1]]),B=toScreen(x,[MAP.x[0]+g[1],MAP.x[1]]),bottom=toScreen(x,[0,CAMERA.frameBottom])[1],floor=h-STEPS.nav.bar-CAMERA.timeline;stepAssert(A[0]>=16-1e-8&&B[0]<=w-16+1e-8,'phone X and words remain inside margins with Toronto in the group');stepAssert(X[1]>=CAMERA.xBand[0]*(h-STEPS.nav.bar)-1e-6&&X[1]<=CAMERA.xBand[1]*(h-STEPS.nav.bar)+1e-6&&bottom<=floor,'phone X in its band, map edge above the timeline');}
}
const rush=SEQ.find(s=>s.kind==='rush'),rest=SEQ.find(s=>s.kind==='rest');JOURNEY.set(rush.a);stepsFrame(stepClock+=50);stepAssert(!go.hidden,'X beat needs its Dig control');go.querySelector('.go-next').focus();JOURNEY.next();stepAssert(go.hidden||go.classList.contains('go-leaving'),'rush start must fade stepper');
for(let P=rush.a+.001;P<rest.a;P+=1){JOURNEY.set(P);stepsFrame(stepClock+=50);stepAssert(go.hidden||go.classList.contains('go-leaving'),'stepper shown during rush/blast/settle');}
JOURNEY.set(rest.a);stepsFrame(stepClock+=50);stepAssert(!go.hidden,'settle end must return stepper');stepAssert(document.activeElement===go.querySelector('.go-next'),'stepper main focus must return');
// D5: compare the cross-press 16 ms velocity change with the same uninterrupted
// move's largest 16 ms change. A tiny one-sided probe checks the new derivative
// independently of the runtime derivative and carry builder.
const continuityFailures=[];
for(const view of [[1440,900,120],[390,844,96]])for(const test of [{kind:'joined leave',from:'top',at:400},{kind:'joined fall',from:'top',at:1600},{kind:'X rush',from:'x',at:1280}]){
  stepJoined=true;tripResize(...view);const label=view[0]+' '+test.kind;
  const from=BEATS.find(b=>b.id===test.from), to=BEATS[BEATS.indexOf(from)+1];
  JOURNEY.set(from.P);tick(16);JOURNEY.next();
  let before=JOURNEY.P,lastV=0,largest=0;
  while(JOURNEY.moving){tick(16);const v=(JOURNEY.P-before)/.016;largest=Math.max(largest,Math.abs(v-lastV));before=JOURNEY.P;lastV=v;}
  JOURNEY.set(from.P);tick(16);JOURNEY.next();const positions=[JOURNEY.P];
  for(let ms=16;ms<=test.at;ms+=16){tick(16);positions.push(JOURNEY.P);}
  const p0=positions.at(-1),incoming=(11*p0-18*positions.at(-2)+9*positions.at(-3)-2*positions.at(-4))/(6*.016),vBefore=(p0-positions.at(-2))/.016;
  JOURNEY.back();tick(.0001);const outgoing=(JOURNEY.P-p0)/1e-7;tick(16-.0001);
  const cross=Math.abs((JOURNEY.P-p0)/.016-vBefore);
  const continuous=Math.abs(incoming-outgoing)<.002&&cross<=largest+1e-6;
  if(!continuous)continuityFailures.push(label);
  let high=p0,elapsed=16;for(let n=0;JOURNEY.moving&&n<2000;n++){tick(16);elapsed+=16;high=Math.max(high,JOURNEY.P);stepAssert(JOURNEY.P>=from.P&&JOURNEY.P<=to.P,'pace carry crossed a beat');}
  console.log(`D5 pace ${label}: incoming ${incoming.toFixed(6)}, outgoing ${outgoing.toFixed(6)} P/s; cross-frame change ${cross.toFixed(6)}, uninterrupted maximum ${largest.toFixed(6)} P/s; arrival ${(elapsed/1000).toFixed(3)} s; ${continuous?'PASS':'FAIL'}`);
  stepAssert(!JOURNEY.moving&&JOURNEY.P===from.P,'pace carry must arrive exactly');
  if(high<=p0)continuityFailures.push(label+' did not slow before returning');
  const settled=JOURNEY.P;tick(32);stepAssert(JOURNEY.P===settled,'pace carry arrival must stay settled');
}
stepAssert(continuityFailures.length===0,'D5 pace continuity failed: '+continuityFailures.join(', '));
console.log('ok: joined leave/fall and X rush Back carry exact dP/dt, meet the uninterrupted 16 ms continuity gate, turn within their beat and settle exactly');
const beforeRmTouch=stepWindow.listeners.touchstart.length;tripResize(1440,900,120);stepsBuild({stage:stepStage,rm:true,joinedTop:()=>stepJoined});
window.scrollY=900;stepsFrame(stepClock+=50);stepAssert(JOURNEY.mode==='scroll'&&JOURNEY.P===100,'reduced motion must read native scroll');
stepAssert(!wheel(100).defaultPrevented&&stepWindow.listeners.touchstart.length===beforeRmTouch,'reduced motion must leave native input alone');
console.log('ok: X frame/phone box clear controls; rush through settle hides stepper and restores main focus');
