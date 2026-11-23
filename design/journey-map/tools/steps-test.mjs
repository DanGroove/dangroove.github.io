// Node-only pace checks, including every neighbouring beat in both directions.
import { BEATS, paceT, paceP, paceMove, paceAt } from '../pace.mjs';
import { JOURNEY, stepsBuild, stepsFrame } from '../steps.mjs';
import { tripResize, tripState, toScreen, SEQ } from '../trip.mjs';
import { cardsBuild, cardsOverride, cardsClose, cardsList, cardsFrame } from '../cards.mjs';
import { CARD_CLOSE, CAMERA, MAP, STEPS } from '../data.mjs';
import { exploreBuild, exploreResize, exploreApply, exploreActive, exploreEnd } from '../explore.mjs';

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
  const a = BEATS[i - 1], b = BEATS[i], forward = paceMove(a.P, b.P), back = paceMove(b.P, a.P);
  for (const move of [forward, back]) {
    stepAssert(paceAt(move, 0) === move.P0 && Math.abs(move.P0 - (move === forward ? a.P : b.P)) < 1e-6, 'move start');
    stepAssert(paceAt(move, move.D) === move.P1 && Math.abs(move.P1 - (move === forward ? b.P : a.P)) < 1e-6, 'move end');
    let prev = move.P0;
    for (let n = 1; n <= 1000; n++) {
      const p = paceAt(move, move.D * n / 1000);
      stepAssert((p - prev) * Math.sign(move.P1 - move.P0) >= -1e-9, `move reversed: ${a.id}/${b.id}`); prev = p;
    }
  }
  stepAssert(forward.D >= 1.5 && forward.D <= 5, `forward duration outside 1.5-5 seconds: ${a.id}/${b.id}`);
  console.log(`${a.id} -> ${b.id} | ${forward.D.toFixed(3)} | ${back.D.toFixed(3)}`);
}
console.log('ok: all 18 moves start/end correctly and never turn back; all 9 forward durations are within 1.5-5 seconds');

// Recording nodes exercise controls, not rendered pixels. Any geometry read here fails.
class StepNode {
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
  fire(t, props = {}) { const e = { target: this, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...props }; (this.listeners[t] || []).forEach(f => f(e)); return e; }
  focus(options) { document.activeElement = this; this.focusOptions = options; }
  getBoundingClientRect() { throw new Error('unexpected layout read'); }
}
const stepWindow = new StepNode(), stepStage = new StepNode(), stepRoot = new StepNode(), stepBody = new StepNode();
globalThis.window = Object.assign(stepWindow, { location: { search: '?mode=scroll' }, scrollY: 0, scrollTo() {}, dispatchEvent() {} });
globalThis.document = { documentElement: stepRoot, body: stepBody, activeElement: null, createElement: tag => new StepNode(tag), getElementById: id => stepStage.children.find(n => n.id === id) };
globalThis.history = { scrollRestoration: 'auto' };
tripResize(1440, 900, 120); stepsBuild({ stage: stepStage, rm: false, resize() {}, joinedTop: () => false });
exploreBuild({ stage: stepStage, world: new StepNode(), journey: JOURNEY, rm: false }); exploreResize();
stepAssert(JOURNEY.mode === 'steps' && JOURNEY.setMode === undefined, 'removed Scroll mode remains callable or address selects it');
stepAssert(stepBody.children[0].querySelectorAll('button').length === 1 && stepBody.children[0].querySelector('[data-depth]'), 'review must have only Depth');
stepAssert(!stepWindow.listeners.touchstart && !stepWindow.listeners.touchmove && !stepWindow.listeners.touchend, 'swipe listeners remain');
const empty = new StepNode(); let stepClock = 0;
for (const beat of BEATS) {
  JOURNEY.set(beat.P); stepsFrame(stepClock += 50);
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
console.log('ok: address cannot select Scroll; review only Depth; no swipe listeners; wheel never steps any beat; only end CTA explores; two Back presses return then step; keyboard still advances');

const cardContainer = new StepNode(); let navigations = 0; cardsBuild(cardContainer, () => navigations++);
stepAssert(cardContainer.querySelectorAll('.c-close').length === 6, 'every motion card needs X');
const stopP = BEATS[2].P; JOURNEY.set(stopP); cardsList().forEach(c => c.H = 420); let cardState = tripState(stopP); cardsOverride(cardState, 0, false); cardsFrame(cardState); stepAssert(cardsClose(), 'card did not close');
cardState = tripState(stopP); cardsOverride(cardState, CARD_CLOSE.time / 2, false); stepAssert(cardState.cardK[0] > 0 && cardState.cardK[0] < 1 && cardState.P === stopP, 'card halfway fold');
cardState = tripState(stopP); cardsOverride(cardState, CARD_CLOSE.time / 2, false); stepAssert(cardState.cardK[0] === 0 && cardState.P === stopP, 'card fold changed P or failed');
cardsFrame(cardState); cardsList()[0].btn.focus(); cardsList()[0].btn.fire('click'); cardState = tripState(stopP); cardsOverride(cardState, CARD_CLOSE.time, false); cardsFrame(cardState); stepAssert(cardState.cardK[0] === 1 && navigations === 0, 'closed stop mark must reopen locally');
const cardX = cardsList()[0].el.querySelector('.c-close'); stepAssert(document.activeElement === cardX && cardX.focusOptions.preventScroll === true, 'reopened card must focus its X without scrolling');
JOURNEY.next(); stepAssert(JOURNEY.moving, 'mid-move X fixture must be moving'); cardX.focus(); cardX.fire('click'); stepAssert(document.activeElement !== cardsList()[0].btn, 'mid-move X focused departed stop mark'); stepAssert(cardsClose(0) === false, 'X must be ignored mid-move');
JOURNEY.set(stopP);
cardsClose(); cardsOverride(tripState(BEATS[3].P), 0, false); cardState = tripState(stopP); cardsOverride(cardState, 0, false); stepAssert(cardState.cardK[0] === 1, 'leaving stop must forget closed state');
const reducedCards = new StepNode(); cardsBuild(reducedCards, () => {}, true); stepAssert(reducedCards.querySelectorAll('.c-close').length === 0, 'reduced-motion cards must have no close button');
console.log('ok: six card X controls; local reopen focuses X without scrolling; mid-move X cannot focus departed mark; departure forgets override; reduced-motion list has no X');

for(const [w,h,tl] of [[1440,900,120],[390,844,96]]){
  tripResize(w,h,tl);const x=tripState(BEATS.find(b=>b.id==='x').P);
  if(w>640){const bottom=toScreen(x,[0,CAMERA.frameBottom])[1],top=h-56-STEPS.nav.gap-STEPS.nav.h;stepAssert(bottom<=top-12,'desktop X frame crosses stepper');}
  else{const b=CAMERA.xBoxPhone,A=toScreen(x,b.slice(0,2)),B=toScreen(x,b.slice(2));stepAssert(A[0]>=16-1e-8&&A[1]>=16&&B[0]<=w-16+1e-8&&B[1]<=h-STEPS.nav.bar-16,'phone X/Lennard/skyline fit');}
}
const rush=SEQ.find(s=>s.kind==='rush'),rest=SEQ.find(s=>s.kind==='rest');JOURNEY.set(rush.a);stepsFrame(stepClock+=50);stepAssert(!go.hidden,'X beat needs its Dig control');go.querySelector('.go-next').focus();JOURNEY.next();stepAssert(go.hidden,'rush start must hide stepper');
for(let P=rush.a+.001;P<rest.a;P+=1){JOURNEY.set(P);stepsFrame(stepClock+=50);stepAssert(go.hidden,'stepper shown during rush/blast/settle');}
JOURNEY.set(rest.a);stepsFrame(stepClock+=50);stepAssert(!go.hidden,'settle end must return stepper');stepAssert(document.activeElement===go.querySelector('.go-next'),'stepper main focus must return');
console.log('ok: X frame/phone box clear controls; rush through settle hides stepper and restores main focus');
