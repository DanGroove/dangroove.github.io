// Node-only geometry and source-preservation gates for FINDS Part A.
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { bigMap, rubbingRunes, pieceIcon } from '../art.mjs';
import { STARS, DEPTH, NOVA, FINDS, FIND_PLAY, FIND_COPY, STOPS, HAMMER, RAVEN_RIG, FOOT_NAME } from '../data.mjs';
import { tripFocus, tripState, tripResize, tripBuild, tripApply, toScreen, VIEW, SEQ, WATER, pointAt, longshipPoint } from '../trip.mjs';
import { BEATS } from '../pace.mjs';
import { wayAllStops } from '../findhoards.mjs';
import { mapDefs } from '../art.mjs';
import { tlBuild } from '../timeline.mjs';
import { JOURNEY, stepsBuild, stepsFrame, stepsFocus, stepsFocusNow, stepsRelease } from '../steps.mjs';
import { findsBuild, findsFrame } from '../finds.mjs';
import { FD, closeSheet, closePop, findReady, findView, attr } from '../findkit.mjs';
import { findRavens } from '../findcreatures.mjs';
import { findHoards } from '../findhoards.mjs';
import { hammerBestRead, hammerBestWrite } from '../findhammer.mjs';
import { footnameBuild, footnameMeasure, footnameReveal, footnameFrame } from '../footname.mjs';



const digest = s => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
const close = (a, b, label, tolerance = 0.000001) => assert.ok(Math.abs(a - b) <= tolerance, `${label}: ${a} != ${b}`);
const chart = bigMap();
assert.ok(!/undefined|\{\{/.test(chart.finds), 'all live drawing tokens must resolve');
// COMB-B records the surfaced serpent drawing; fill and coasts retain their earlier baselines.
// COMB-N (2026-11-26): sky wolves/local SVGs and held map/trail writer re-record their source/data pins.
const original = { sea: [92983, 2278239991], fill: [12999, 2682309966], coast: [4401, 2408021381] };
for (const [key, [length, hash]] of Object.entries(original)) { assert.equal(chart[key].length, length); assert.equal(digest(chart[key]), hash); }
console.log('ok: COMB-D body/stipple sea digest recorded; coast and fill unchanged');
// D3 adds NOVA.build; the full data digest is re-recorded for that authorized table (and again for the continuous pull, 2026-11-23,
// and for polish round 1: the held breath's white cross and halo, the softer cloud deck, the traveller's size at the overview
// and the gather ring's spread).
// WHIRL2 adds only STARS.supply; DEPTH and NOVA remain unchanged.
assert.equal(digest(JSON.stringify([STARS, DEPTH, NOVA])), 3612511009); // COMB-P removes eclipse-only sky keys.
// D10: restore only the moved cloud to verify all other sky data.
const beforeD = structuredClone(DEPTH); beforeD.clouds.list[9][0] = 330; beforeD.dpr=2; beforeD.field.sprite=128;const beforeFStars=structuredClone(STARS);beforeFStars.dprCap=2;delete beforeFStars.fall;
assert.equal(digest(JSON.stringify([beforeFStars,beforeD,NOVA])),2324343636);
console.log('ok: D10 cloud pin recorded; restoring that cloud verifies original STARS/DEPTH/NOVA');
// D4 authorizes the pure rest-to-rest glide in trip. Depth remains protected.
// Line endings are evened out so the numbers are the same on Windows and in the cloud.
const sourceDigest = name => digest(readFileSync(new URL('../' + name, import.meta.url), 'utf8').replace(/\r\n/g, '\n'));
// Polish round 1 (2026-11-23) re-records both: trip.mjs for the X view on phones and portrait tablets and the map title's fade,
// depth.mjs for the lantern's darkness the nova canvas holds through the rush; its second batch re-records trip.mjs for the
// labels that give way, the coasts' draw-on, the X's fade-in with the sea and the mini-map's targets.
// FRAMES: compositor camera writer and label recovery only; geometry/score remain pinned by the motion tests.
// Part 8 cloud fixes: explore keeps the map promoted while its camera moves, and releases it at rest after a zoom (F10 lag).
// Part 10b cloud fixes: the held base on whole device pixels with a margin (blur), and the find press fades on each name, not its group.
// COMB-M2 (2026-11-26): N2 changes only the old longship line and ship kit keys; the M2 scope test pins the exact edits.
assert.equal(sourceDigest('trip.mjs'), 906771568, 'trip.mjs changed'); // COMB-P authorized changes and the part 13 review fixes (2026-11-26).
// COMB-B re-records only drawing/view data and explore label placement. Protected depth stays pinned.
assert.equal(sourceDigest('data.mjs'), 2000277628, 'data.mjs changed'); // COMB-P authorized changes and the part 13 review fixes (2026-11-26).
assert.equal(sourceDigest('depth.mjs'), 2916876570, 'depth.mjs changed'); // COMB-P authorized changes and the part 13 review fixes (2026-11-26).
console.log('ok: COMB-D camera/labels/tripS digests recorded; depth source remains pinned');
const levels = [0, 0.1, 0.25, 0.5, 0.75, 1];
const mapP = BEATS.find(b => b.id === 'map').P, stopP = BEATS.find(b => b.id === STOPS[2].id).P, leg = SEQ.find(q => q.kind === 'leg' && q.i === 2), legP = leg.a + leg.len / 2;
for (const [w, h] of [[1440, 900], [390, 664]]) {
  tripResize(w, h, h > 800 ? 120 : 96);
  let cases = 0;
  for (const P of [mapP, stopP, legP]) {
    const base = tripState(P), chest = FIND_COPY.hoards[0], ship = longshipPoint(base.u), F = FIND_PLAY.focus;
    const views = [...FINDS.filter(f => f.view).map(f => f.view), [chest.x + F.chest[0], chest.y + F.chest[1], F.chest[2]], [ship[0] + F.ship[0], ship[1] + F.ship[1], F.ship[2]], F.wide];
    for (const view of views) {
      const zero = structuredClone(base); tripFocus(zero, view, 0); assert.deepEqual(zero, base);
      const least = view[3] ?? F.least, scale = Math.max(Math.max(VIEW.s0, least * VIEW.sT), Math.min((view.slice(0,3).every((v,i)=>v===FINDS.find(f=>f.id==='horn').view[i])?FINDS.find(f=>f.id==='horn').viewCap:F.most) * VIEW.sT, F.fill * Math.min(w, h) / (2 * view[2])));
      let previous = base.cam.s;
      for (const k of levels) {
        const st = structuredClone(base); tripFocus(st, view, k);
        assert.equal(st.P, P); assert.deepEqual(st.trav, base.trav);
        assert.ok(scale >= base.cam.s ? st.cam.s >= previous - 1e-9 : st.cam.s <= previous + 1e-9, 'focus scale must be monotone'); previous = st.cam.s;
        if (k === 1) { const p = toScreen(st, view); close(p[0], w * F.at[0], 'focus x', 0.01); close(p[1], h * F.at[1], 'focus y', 0.01); close(st.cam.s, scale, 'clamped focus scale'); assert.ok(st.cardK.every(v => v === 0)); assert.equal(st.cardOpen, 0); assert.equal(st.dim, 1); }
      }
      cases++;
    }
  }
  console.log(`ok ${w}x${h}: ${cases} views/cameras, k=0 deep-equal, k=1 centred/clamped/cards folded, monotone scale, P/traveller unchanged`);
}
for (const f of FINDS) {
  const tag = chart.finds.match(new RegExp(`<g\\b[^>]*id="f-${f.id}"[^>]*>`))?.[0];
  assert.ok(tag, `${f.id}: group missing`);
  for (const required of [...(f.id === 'hoards' ? ['role="group"'] : ['role="button"', 'tabindex="0"']), 'aria-label="', 'data-x="', 'data-y="']) assert.ok(tag.includes(required), `${f.id}: ${required}`);
}
assert.equal((chart.detail.match(/id="mk-[^"]+"/g) || []).length, 6);
assert.equal((chart.detail.match(/class="mk(?: legend-symbol)?"/g) || []).length, 7);
assert.ok(/class="mk legend-symbol"[^>]*data-x="140"/.test(chart.detail));
console.log('ok: eleven accessible find groups, six marker ids and unnumbered legend id');
assert.deepEqual(STOPS.filter((s, i) => wayAllStops()[i]).map(s => s.id), ['lennard']);
assert.equal(rubbingRunes().map(r => r.letter).join(''), 'FIRSTSKETCHFINALCUT');
assert.equal(rubbingRunes().length, 19);
assert.ok(FIND_COPY.hoards.every(h => pieceIcon(h.kind).length));
console.log('ok: all-four mask derived from STOPS is Lennard alone; nineteen rune middles/letters; all piece icons available');

// A small recording DOM, not a browser: exercise state transitions and reject NaN writes/layout reads in frame callbacks.
class TestHammerContext {
  constructor() { this.commands = 0; this.clipPaths = []; this.strokePaths = []; }
  record(...args) { this.commands++; for (const a of args) if (typeof a === 'number') assert.ok(Number.isFinite(a), 'nonfinite canvas command'); }
  setTransform(...args) { this.record(...args); } scale(...args) { this.record(...args); } translate(...args) { this.record(...args); }
  rotate(...args) { this.record(...args); } fillRect(...args) { this.record(...args); } drawImage(...args) { this.record(...args); }
  stroke(...args) { this.record(...args); this.strokePaths.push(args[0]?.path || ''); } clip(...args) { this.record(...args); this.clipPaths.push(args[0].path); } fill(...args) { this.record(...args); } save() {} restore() {}
}
const testObservers = new Set();
// Node recording implementation of the attribute MutationObserver protocol.
class TestMutationObserver {
  constructor(callback) { this.callback=callback;this.records=[]; }
  observe(target,options) { this.target=target;this.options=options;testObservers.add(this); }
  takeRecords() { const records=this.records;this.records=[];return records; }
  disconnect() { testObservers.delete(this); }
}
class TestNode {
  constructor(tag = 'div') { this.tagName = tag; this.attrs = {}; this.children = []; this.listeners = {}; this.nodeType = 1; this.style = { setProperty(k, v) { this[k] = v; } }; this.dataset = {}; this.hidden = false; this.classList = { add: (...xs) => xs.forEach(x => this.toggleClass(x, true)), remove: (...xs) => xs.forEach(x => this.toggleClass(x, false)), toggle: (x, force) => this.toggleClass(x, force), contains: x => this.className.split(/\s+/).includes(x) }; }
  get id() { return this.attrs.id || ''; } set id(v) { this.attrs.id = v; }
  get className() { return this.attrs.class || ''; } set className(v) { this.attrs.class = v; }
  get firstElementChild() { return this.children[0]; } get firstChild() { return this.children[0]; }
  get isConnected() { return true; }
  toggleClass(x, force) { const set = new Set(this.className.split(/\s+/).filter(Boolean)); const on = force ?? !set.has(x); if (on) set.add(x); else set.delete(x); this.className = [...set].join(' '); return on; }
  setAttribute(k, v) { assert.ok(!/NaN/.test(String(v)), `NaN attribute ${this.id}/${k}: ${v}`); for(const o of testObservers)if(o.target===this||o.options.subtree&&o.target.contains(this))o.records.push({target:this,attributeName:k,oldValue:this.getAttribute(k)});this.attrs[k] = String(v); if (k.startsWith('data-')) this.dataset[k.slice(5)] = String(v); }
  getAttribute(k) { return this.attrs[k] ?? null; }
  appendChild(node) { if (node.parentElement) node.parentElement.children = node.parentElement.children.filter(c => c !== node); this.children.push(node); node.parentElement = this; return node; }
  append(...nodes) { nodes.forEach(n => this.appendChild(n)); }
  remove() { if (this.parentElement) this.parentElement.children = this.parentElement.children.filter(c => c !== this); this.parentElement = null; }
  prepend(...nodes) { nodes.reverse().forEach(n => { this.children.unshift(n); n.parentElement = this; }); }
  set innerHTML(html) {
    this.recordedHTML = String(html); this.children = []; const stack = [this];
    for (const token of String(html).matchAll(/<\/?([\w:-]+)([^>]*?)\/?\s*>/g)) {
      if (token[0].startsWith('</')) { if (stack.length > 1) stack.pop(); continue; }
      const node = new TestNode(token[1]);
      for (const a of token[2].matchAll(/([\w:-]+)(?:="([^"]*)"|='([^']*)')?/g)) { node.setAttribute(a[1], a[2] ?? a[3] ?? ''); if (a[1] === 'hidden') node.hidden = true; }
      stack[stack.length - 1].appendChild(node);
      if (!/\/\s*>$/.test(token[0]) && !['img', 'input', 'br', 'hr', 'meta', 'link'].includes(token[1])) stack.push(node);
    }
  }
  matches(selector) {
    if (selector.includes(':not([hidden])')) { if (this.hidden) return false; selector = selector.replace(':not([hidden])', ''); }
    const tag = selector.match(/^[\w-]+/); if (tag && this.tagName !== tag[0]) return false;
    for (const m of selector.matchAll(/#([\w-]+)/g)) if (this.id !== m[1]) return false;
    for (const m of selector.matchAll(/\.([\w-]+)/g)) if (!this.classList.contains(m[1])) return false;
    for (const m of selector.matchAll(/\[([\w-]+)(?:="([^"]*)")?\]/g)) if (!Object.hasOwn(this.attrs, m[1]) || m[2] !== undefined && this.attrs[m[1]] !== m[2]) return false;
    return true;
  }
  querySelectorAll(selector) {
    const results = [], nodes = []; const collect = node => node.children.forEach(c => { nodes.push(c); collect(c); }); collect(this);
    for (const node of nodes) {
      const matched = selector.split(',').some(choice => {
        const parts = choice.trim().split(/\s+/); let current = node;
        if (!current.matches(parts.pop())) return false;
        while (parts.length) {
          const part = parts.pop(); if (part === '>') { const parent = parts.pop(); current = current.parentElement; if (!current?.matches(parent)) return false; }
          else { do { current = current.parentElement; } while (current && !current.matches(part)); if (!current) return false; }
        }
        return true;
      });
      if (matched) results.push(node);
    }
    return results;
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  closest(selector) { for (let node = this; node; node = node.parentElement) if (selector.split(',').some(s => node.matches(s.trim()))) return node; return null; }
  contains(node) { for (let n = node; n; n = n.parentElement) if (n === this) return true; return false; }
  getContext() { return this.context ??= new TestHammerContext(); }
  addEventListener(type, fn, capture = false) { (this.listeners[type] ??= []).push({ fn, capture: capture === true }); }
  dispatchEvent(event) {
    event.target = this; const path = []; for (let p = this; p; p = p.parentElement) path.push(p);
    for (const node of path.slice().reverse()) for (const l of node.listeners[event.type] || []) { if (l.capture && !event.stopped) l.fn(event); }
    for (const node of path) { if (event.stopped) break; for (const l of node.listeners[event.type] || []) { if (event.immediate) break; if (!l.capture) l.fn(event); } if (!event.bubbles) break; }
    return !event.defaultPrevented;
  }
  focus() { document.activeElement = this; }
  setPointerCapture() {}
  getAnimations() { return []; }
  animate() { return { cancel() {} }; }
  getBoundingClientRect() { assert.equal(testInFrame, false, 'layout read in frame callback'); const width = this.classList.contains('tl-count') ? 90 : 240, height = this.classList.contains('tl-count') ? 20 : 140; return { left: 30, top: 40, right: 30 + width, bottom: 40 + height, width, height }; }
}
class TestEvent {
  constructor(type, props = {}) { Object.assign(this, { type, bubbles: true, detail: 0, preventDefault() { this.defaultPrevented = true; }, stopPropagation() { this.stopped = true; }, stopImmediatePropagation() { this.stopped = this.immediate = true; } }, props); }
}
let testInFrame = false;
const htmlNode = new TestNode('html'), bodyNode = new TestNode('body'); htmlNode.appendChild(bodyNode);
const testDocument = new TestNode('document'); testDocument.appendChild(htmlNode);
Object.assign(testDocument, { documentElement: htmlNode, body: bodyNode, activeElement: bodyNode, createElement: tag => new TestNode(tag), createElementNS: (ns, tag) => new TestNode(tag), getElementById: id => htmlNode.querySelector('#' + id) });
const testWindow = new TestNode('window');
Object.assign(testWindow, { location: { search: '' }, innerWidth: 1440, innerHeight: 900, scrollY: 0, scrollTo() {}, matchMedia: () => ({ matches: true, addEventListener() {} }) });
let storageReads = 0, storageWrites = 0;
Object.assign(globalThis, { window: testWindow, document: testDocument, history: { scrollRestoration: 'auto' }, sessionStorage: { getItem() { return null; }, setItem() {} }, localStorage: { getItem() { storageReads++; throw Error('storage blocked'); }, setItem() { storageWrites++; throw Error('storage blocked'); } }, Path2D: class { constructor(path) { assert.ok(typeof path === 'string'); this.path = path; } }, matchMedia: testWindow.matchMedia, innerWidth: 1440, innerHeight: 900, Event: TestEvent, KeyboardEvent: TestEvent });
async function testPlays() {
const testStage = new TestNode('div'), testSvg = new TestNode('svg'), testBase = new TestNode('g'), testPop = new TestNode('div'), testSheet = new TestNode('div'), testTl = new TestNode('div');
bodyNode.appendChild(testStage); testStage.append(testSvg, testPop, testSheet, testTl); testBase.id = 'b-all';
testSvg.innerHTML = '<g id="wf-lines"></g><g id="trail-pieces"></g>' + mapDefs() + '<g id="b-sea">' + chart.sea + '</g><g id="b-all">' + chart.detail + '</g><g id="finds">' + chart.finds + '</g>';
stepsBuild({ stage: testStage, rm: false, resize() {}, joinedTop: () => false });
tlBuild(testTl, { jump() {}, scrub() {} }, false);
findsBuild(testSvg, testPop, testSheet, testSvg.querySelector('#b-all'), false);
tripResize(1440, 900, 120); JOURNEY.set(mapP);
const dummy=()=>new TestNode();tripBuild({svg:testSvg,cam:dummy(),sea:dummy(),fill:dummy(),detail:testSvg.querySelector('#b-all'),finds:dummy(),coastG:dummy(),done:dummy(),mini:dummy(),caption:dummy(),cue:dummy()});
for(const k of [0,1,0]){const st=tripState(mapP);tripFocus(st,FINDS[0].view,k);tripApply(st);for(const selector of ['.map-tier1','.map-subs']){const el=testSvg.querySelector(selector),rows=el.querySelectorAll('.label-anchor');assert.ok(!el.style.opacity,'the group itself never fades: the fade rides on each label (cloud review of part 10b)');assert.equal(el.style.visibility,k?'hidden':'visible');assert.ok(rows.length>0);if(k)for(const row of rows)assert.equal(Number(row.style.opacity),0);else for(const row of rows)assert.notEqual(row.style.opacity,'0.000');}}
// The wayfinder and the all-found chart keep the names, also when one takes over straight from a find that hid them.
for(const id of ['wayfinder','all-found']){const other=tripState(mapP);tripFocus(other,FINDS[0].view,1);other.focusId='ravens';tripApply(other);assert.equal(testSvg.querySelector('.map-tier1').style.visibility,'hidden');const st=tripState(mapP);tripFocus(st,FINDS[0].view,1);st.focusId=id;tripApply(st);for(const selector of ['.map-tier1','.map-subs']){const el=testSvg.querySelector(selector);assert.equal(el.style.visibility,'visible',id+' keeps '+selector);for(const row of el.querySelectorAll('.label-anchor'))assert.notEqual(row.style.opacity,'0.000',id+' keeps every name');}}
{const st=tripState(mapP);tripApply(st);}
console.log('ok: D2 tier-1 and sub-line labels fade to exact zero at find focus and return (the fade rides on each label, the groups only hide); the wayfinder and all-found keep them');
let fadeWrites=0;for(const selector of ['.map-tier1','.map-subs']){const el=testSvg.querySelector(selector);el.style=new Proxy(el.style,{set(o,k,v){if(k==='opacity'||k==='visibility')fadeWrites++;o[k]=v;return true;}});}
for(const k of [.0001,.4,1,.3999,0,0]){const st=tripState(mapP);st.focusK=k;tripApply(st);}assert.equal(fadeWrites,4,'focus fade ignores sub-.01 changes, writes no still frame and snaps both endpoints (visibility only, never group opacity)');
let testClock = 1, testObserve = null;
async function tick(seconds) {
  const frames = Math.ceil(seconds / 0.016);
  for (let i = 0; i < frames; i++) {
    testClock += seconds / frames; const P = stepsFrame(testClock * 1000), st = tripState(P), focus = stepsFocusNow();
    if (focus) tripFocus(st, focus.view, focus.k);
    testInFrame = true; try { findsFrame(testClock, st); testObserve?.(st); } finally { testInFrame = false; }
    await Promise.resolve();
  }
}
function key(id, value = 'Enter') { testSvg.querySelector('#f-' + id).dispatchEvent(new TestEvent('keydown', { key: value })); }
await tick(0.1);
const fixedP = JOURNEY.P;
key('wayfinder', 'ArrowRight'); await tick(0.6);
key('wayfinder', 'ArrowRight'); key('wayfinder', 'ArrowRight'); key('wayfinder', 'ArrowRight'); await tick(0.6);
assert.equal(window.__jm.finds.state('wayfinder').unlocked, true);
key('wayfinder'); key('wayfinder'); await tick(0.6);
assert.equal(window.__jm.finds.state('wayfinder').stage, 'all-four');
for (let i = 0; i < 4; i++) { key('hoard-laurier'); await tick(1.1); }
assert.equal(window.__jm.finds.state('hoard-laurier').digs, 3); assert.equal(window.__jm.finds.state('hoard-laurier').open, true);
key('ravens'); await tick(4.1); assert.equal(window.__jm.finds.state('ravens').tally, 1);
key('ravens'); await tick(4.1); assert.equal(window.__jm.finds.state('ravens').stage, 'reel'); await tick(5.9); assert.equal(window.__jm.finds.state('ravens').stage, 'rest');
const serpentState = () => window.__jm.finds.state('serpent');
// COMB-Q: the first press focuses, two revisions return a named file, the third ships.
assert.equal(serpentState().stage,'ready'); key('serpent'); await tick(2); assert.equal(serpentState().pokes,0);
for (const filename of ['final_v2.pdf','final_v2_FINAL.pdf']) { key('serpent'); await tick(4.5); assert.equal(serpentState().fileName,filename); assert.equal(serpentState().stage,'ready'); }
key('serpent'); await tick(1); assert.equal(serpentState().stage,'asleep'); assert.equal(serpentState().openAmount,1); assert.equal(serpentState().stamped,true);
assert.equal(testSvg.querySelector('.jg-eye').getAttribute('opacity'),'0'); assert.equal(testSvg.querySelector('.jg-shut').getAttribute('opacity'),'1'); assert.ok(testPop.recordedHTML.includes('Shipped')&&testPop.recordedHTML.includes('A shipped story goes here.')); assert.equal(FD.popOwner.id,'serpent');
assert.equal([...FD.found].filter(id=>id==='serpent').length,1);
key('serpent'); await tick(1); assert.equal(serpentState().stage,'ready'); assert.equal(serpentState().round,1); assert.equal(serpentState().fileName,'final.mp4'); assert.equal(serpentState().openAmount,0);
for(let i=0;i<3;i++){key('serpent');await tick(4.5);}assert.equal(serpentState().stage,'asleep');
const eagle=testSvg.querySelector('.yg-eagle'), eagleRest=eagle.getAttribute('transform'); FD.list.well.hear();await tick(1);assert.notEqual(eagle.getAttribute('transform'),eagleRest);assert.equal(FD.list.well.playing,true);await tick(1.8);assert.equal(eagle.getAttribute('transform'),eagleRest);
console.log('ok: revision names, shipped slot, open loop, next file and one found count; eagle returns to perch');
for (let i = 0; i < 4; i++) { key('beacon'); await tick(1.9); }
assert.equal(window.__jm.finds.state('beacon').fire, 4);
key('runestone'); await tick(5);
assert.equal(window.__jm.finds.state('runestone').read, true); assert.equal(window.__jm.finds.state('runestone').controls, true);
assert.equal(JOURNEY.P, fixedP); assert.equal(JOURNEY.focus, 'runestone');
const copyState = window.__jm.finds.state('runestone'); copyState.rubbed[0] = false; assert.equal(window.__jm.finds.state('runestone').rubbed[0], true);
const beforeBack = JOURNEY.P; JOURNEY.back(); assert.equal(JOURNEY.P, beforeBack); assert.equal(JOURNEY.focus, null); await tick(0.7); assert.equal(stepsFocusNow(), null);
assert.equal(stepsFocus('horn', FIND_PLAY.focus.wide), true); await tick(0.8); assert.equal(JOURNEY.P, beforeBack); stepsRelease(); await tick(0.6);
assert.equal(window.__jm.finds.found().length, 6);
JOURNEY.set(mapP); await tick(0.1); key('ravens'); await tick(0.9); JOURNEY.back(); await tick(3.5); assert.equal(FD.popOwner, null); assert.equal(window.__jm.finds.state('ravens').tally, 1);
JOURNEY.set(0); assert.equal(stepsFocus('horn', FIND_PLAY.focus.wide), false); JOURNEY.set(mapP);
JOURNEY.go('lennard'); assert.equal(stepsFocus('horn', FIND_PLAY.focus.wide), false); await tick(0.7); JOURNEY.set(mapP);
console.log('ok: recording DOM runs six Part A plays, kept state, all-four unlock, reel, chase, four notes, rubbing, copied review state and Back focus rules; no NaN attributes or frame layout reads');
JOURNEY.set(mapP); await tick(0.1);
assert.equal(FD.found.has('hammer'), false); key('hammer'); await tick(1.2);
assert.equal(FD.sheetOwner.id, 'hammer'); assert.equal(FD.found.has('hammer'), true);
assert.ok(testSheet.querySelector('.find-slot')); assert.ok(document.activeElement === testSheet.querySelector('.hm-start'), 'focus remains on the expected control');
for (const k of [' ', 'Enter']) { const e = new TestEvent('keydown', { key: k }); testSheet.querySelector('.hm-start').dispatchEvent(e); assert.ok(!e.defaultPrevented, 'button activation stays native'); assert.equal(e.stopped, true); }
testSheet.querySelector('.hm-start').dispatchEvent(new TestEvent('click')); await tick(0.2);
const hammerFind = FD.list.hammer, game = hammerFind.game, field = testSheet.querySelector('.hm-canvas'), hammerP = JOURNEY.P;
assert.ok(document.activeElement === field, 'focus remains on the expected control'); assert.equal(field.getAttribute('tabindex'), '0'); assert.equal(field.getAttribute('role'), 'img'); assert.ok(field.getAttribute('aria-label').includes('T'));
for (const k of ['ArrowLeft', 'ArrowRight', 'a', 'd', ' ', 'ArrowUp', 'w', 'p', 'p', 't', '1', '2', '3', '0', '+', '-', '=', 'PageDown', 'Home', 'End', 'ArrowDown']) {
  const e = new TestEvent('keydown', { key: k }); field.dispatchEvent(e); assert.equal(e.defaultPrevented, true, `hammer key ${k} default`); assert.equal(e.stopped, true, `hammer key ${k} propagation`);
  field.dispatchEvent(new TestEvent('keyup', { key: k })); assert.equal(JOURNEY.P, hammerP);
}
assert.equal(hammerFind.auto, true); assert.equal(testSheet.querySelector('.hm-auto').getAttribute('aria-pressed'), 'true');
await tick(0.2); assert.ok(game.throwId > 0); assert.ok(field.context.commands > 0);
const shieldCell=game.cells.find(c=>c.live),cellGlyph=hammerFind.wallCells[game.cells.indexOf(shieldCell)];
assert.ok(field.context.strokePaths.some(p=>p.includes(cellGlyph)));field.context.strokePaths.length=0;shieldCell.live=false;await tick(.016);assert.ok(field.context.strokePaths.every(p=>!p.includes(cellGlyph)),'B7: destroyed cell removes its complete rim and boss');shieldCell.live=true;
const sprites = hammerFind.sprites; closeSheet(); assert.equal(FD.sheetClosing, true); const heldTime = game.time; await tick(0.25); assert.equal(game.paused, true); assert.equal(game.time, heldTime);
key('hammer'); assert.equal(hammerFind.game, game); assert.equal(hammerFind.sprites, sprites); assert.ok(testSheet.querySelector('.hm-resume'));
const resumeHammer = () => testSheet.querySelector('.hm-resume').dispatchEvent(new TestEvent('click'));
resumeHammer(); testWindow.dispatchEvent(new TestEvent('blur')); assert.equal(game.paused, true);
resumeHammer(); testDocument.hidden = true; testDocument.dispatchEvent(new TestEvent('visibilitychange')); assert.equal(game.paused, true); testDocument.hidden = false;
resumeHammer(); bodyNode.focus(); testSheet.querySelector('.hm-canvas').dispatchEvent(new TestEvent('focusout', { relatedTarget: bodyNode })); await new Promise(r => setTimeout(r, 0)); assert.equal(game.paused, true);
// Chrome and Edge also send focusout when the pressed button is removed (Start, a rune, Resume); focus that ends inside the sheet does not pause.
resumeHammer(); testSheet.querySelector('.hm-canvas').focus(); testSheet.querySelector('.hm-canvas').dispatchEvent(new TestEvent('focusout', { relatedTarget: null })); await new Promise(r => setTimeout(r, 0)); assert.equal(game.paused, false);
// A cleared formation opens three named, keyboard-pickable rune buttons and focuses the first.
game.foes.forEach(f => f.live = false); game.count = 0; await tick(0.1);
const runeButtons = testSheet.querySelectorAll('.hm-rune'); assert.equal(runeButtons.length, 3); assert.ok(document.activeElement === runeButtons[0], 'focus remains on the expected control');
runeButtons.forEach((b, i) => assert.ok(b.getAttribute('aria-label').startsWith(`${i + 1}.`)));
runeButtons[0].dispatchEvent(new TestEvent('keydown', { key: '1' })); assert.equal(game.wave, 2); assert.ok(document.activeElement === testSheet.querySelector('.hm-canvas'), 'focus remains on the expected control');
// Pointer input follows at the configured maximum speed, never jumps, and holds throw.
const playCanvas = testSheet.querySelector('.hm-canvas'), xBefore = game.x;
playCanvas.dispatchEvent(new TestEvent('pointerdown', { pointerType: 'touch', pointerId: 8, clientX: 265 })); await tick(0.05); assert.ok(Math.abs(game.x - xBefore) <= HAMMER.glove.follow * 0.05 + 1e-6); assert.equal(hammerFind.held, true);
playCanvas.dispatchEvent(new TestEvent('pointercancel', { pointerId: 8 })); assert.equal(hammerFind.held, false);
// Force a finished run to exercise the end-slot and storage write in the recording DOM.
Object.assign(game, { phase: 'end', reason: 'hearts', silver: 123, version: game.version + 1 }); game.events.end++; await tick(0.05);
assert.ok(testSheet.querySelector('.hm-end-close')); assert.ok(testSheet.querySelector('.find-slot')); assert.equal(hammerFind.best, 123);
assert.equal(hammerBestRead(123), 123); assert.equal(hammerBestWrite(111, 123), 123); assert.ok(storageReads > 0 && storageWrites > 0);
testSheet.querySelector('.hm-new').dispatchEvent(new TestEvent('click')); assert.equal(hammerFind.game.wave, 1); assert.notEqual(hammerFind.game.seed, game.seed);
testSheet.querySelector('.hm-canvas').dispatchEvent(new TestEvent('keydown', { key: 'Escape' })); await tick(.25); assert.ok(FD.sheetOwner === null); assert.equal(hammerFind.game.paused, true);
assert.ok(HAMMER.ui.w + FIND_PLAY.kit.sheet.edge * 2 <= 390); assert.ok(HAMMER.ui.h + FIND_PLAY.kit.sheet.edge * 2 <= 664);
console.log('ok: hammer press/found/sheet; start/end fact; real button/rune focus; every game/explore key isolated, P unchanged; auto throwing; pointer speed; close/blur/hidden/focusout pause; resume/new seed; cached sprites; throwing storage reads/writes survive');
const autoState = tripState(mapP); autoState.trav = [154, 436]; findsFrame(testClock + 0.01, autoState); await Promise.resolve(); assert.ok(!FD.found.has('mist'));
key('mist'); key('mist'); key('mist'); await tick(2); assert.equal(window.__jm.finds.state('mist').lifted, true); assert.equal(window.__jm.finds.state('mist').stage, 'lifted');
key('horn'); assert.equal(window.__jm.finds.state('horn').up, 1); key('horn'); await tick(5.5); assert.equal(window.__jm.finds.state('horn').heard.length, 11); assert.equal(window.__jm.finds.state('horn').up, 0);
for (let i = 0; i < 3; i++) { key('well'); await tick(1.3); assert.equal(window.__jm.finds.state('well').norn, i); assert.equal(FD.popSide, 'below'); assert.ok(FD.popOrigin.every(Number.isFinite),'F8 selected side owns the popup origin'); }
assert.equal(window.__jm.finds.state('well').watered, 3); assert.equal(window.__jm.finds.state('well').answer, FIND_COPY.wellStop.replace('{name}', STOPS[0].short).replace('{dates}', STOPS[0].dates));
assert.ok(testSvg.querySelector('#wl-crown').children.every(g => !/NaN/.test(g.getAttribute('transform') || '')));
const shipOuter = testSvg.querySelector('.ls-ship'), shipTransform = shipOuter.getAttribute('transform');
for (let i = 0; i < 3; i++) { key('longship'); await tick(1); }
assert.equal(window.__jm.finds.state('longship').pennant, true); assert.equal(window.__jm.finds.state('longship').lamp, true); assert.equal(shipOuter.getAttribute('transform'), shipTransform);
await tick(8); assert.equal(window.__jm.finds.found().length, 11); assert.equal(FD.landed, 11); assert.equal(testTl.querySelector('.tl-count').textContent, 'All 11 found'); assert.equal(FD.all.done, false); stepsRelease(); closePop(); await tick(.3); assert.equal(FD.all.done, true);
assert.equal(testSvg.querySelector('#finds').children.at(-1).id, 'f-bits'); assert.equal(testSvg.querySelector('#hn-rings').getAttribute('pointer-events'), 'none'); assert.equal(testSvg.querySelector('#wl-crown').getAttribute('pointer-events'), 'none');
JOURNEY.set(mapP); await tick(0.2); key('horn'); key('horn'); await tick(0.7); assert.deepEqual(stepsFocusNow().view, FIND_PLAY.focus.wide); JOURNEY.back(); await tick(5); assert.equal(JOURNEY.focus, null);
key('horn'); closePop(); testSvg.querySelector('#f-horn').dispatchEvent(new TestEvent('pointerdown', { pointerId: 1 })); await tick(0.6); assert.equal(window.__jm.finds.state('horn').stage, 'sounding'); testSvg.querySelector('#f-horn').dispatchEvent(new TestEvent('pointerup')); JOURNEY.back(); await tick(5);
console.log('ok: traveller wipes without finding; three mist thirds; all eleven hear timed horn; hold sounds, wide view and release; three Norns/stars/below tail; ship pennant/lamp; all-eleven landing/count/frame; overlays do not take pointers');

// C2 uses the actual SVG path points and transforms, with a fake clock and no layout engine.
const rig = RAVEN_RIG, ravenFind = FINDS.find(f => f.id === 'ravens'), savedRavens = FD.list.ravens, savedHoards = FD.list.hoards;
const mul = (a,b) => [a[0]*b[0]+a[2]*b[1],a[1]*b[0]+a[3]*b[1],a[0]*b[2]+a[2]*b[3],a[1]*b[2]+a[3]*b[3],a[0]*b[4]+a[2]*b[5]+a[4],a[1]*b[4]+a[3]*b[5]+a[5]];
const identity = [1,0,0,1,0,0], tx = (x,y=0)=>[1,0,0,1,x,y], point = (a,p)=>[a[0]*p[0]+a[2]*p[1]+a[4],a[1]*p[0]+a[3]*p[1]+a[5]];
const matrix = text => {
  let m=identity;
  for(const a of (text||'').matchAll(/(translate|rotate|scale|matrix)\(([^)]+)\)/g)) {
    const n=a[2].trim().split(/[ ,]+/).map(Number);let q;
    if(a[1]==='translate')q=tx(...n);
    if(a[1]==='scale')q=[n[0],0,0,n[1]??n[0],0,0];
    if(a[1]==='matrix')q=n;
    if(a[1]==='rotate'){const r=n[0]*Math.PI/180,c=Math.cos(r),s=Math.sin(r);q=[c,s,-s,c,0,0];if(n.length===3)q=mul(mul(tx(n[1],n[2]),q),tx(-n[1],-n[2]));}
    m=mul(m,q);
  }return m;
};
const pathCache = new Map();
function pathPoints(path) {
  if(pathCache.has(path))return pathCache.get(path);
  const tok=path.match(/[a-zA-Z]|[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/g),points=[];let i=0,cmd='',p=[0,0],home=p;
  const num=()=>Number(tok[i++]),pair=rel=>{const q=[num(),num()];return rel?q.map((v,k)=>v+p[k]):q;};
  while(i<tok.length){if(/[a-zA-Z]/.test(tok[i]))cmd=tok[i++];const rel=cmd===cmd.toLowerCase(),c=cmd.toUpperCase(),start=p.slice();
    if(c==='Z'){p=home.slice();points.push(p);cmd='';continue;}
    if(c==='M'||c==='L'){p=pair(rel);if(c==='M'){home=p.slice();cmd=rel?'l':'L';}points.push(p);}
    else if(c==='H'){p=[num()+(rel?p[0]:0),p[1]];points.push(p);}
    else if(c==='V'){p=[p[0],num()+(rel?p[1]:0)];points.push(p);}
    else if(c==='Q'||c==='C'){const a=pair(rel),b=c==='C'?pair(rel):null,end=pair(rel);for(let j=1;j<=24;j++){const t=j/24;points.push(start.map((v,k)=>c==='C'?(1-t)**3*v+3*(1-t)**2*t*a[k]+3*(1-t)*t*t*b[k]+t**3*end[k]:(1-t)**2*v+2*(1-t)*t*a[k]+t*t*end[k]));}p=end;}
    else throw Error('unexpected rig path command '+cmd);
  }pathCache.set(path,points);return points;
}
const birdPoints = (b, unturned=false) => b.g.querySelectorAll('path').flatMap(node=>{
  if(node.closest('.rv-item'))return [];
  let m=identity;
  for(let n=node;n&&n!==b.g.parentElement;n=n.parentElement){const a=n===b.g&&unturned?tx(...b.xy):matrix(n.getAttribute('transform'));m=mul(a,m);}
  return pathPoints(node.getAttribute('d')).map(p=>point(m,p));
});
const boxOf = p => [Math.min(...p.map(p=>p[0])),Math.min(...p.map(p=>p[1])),Math.max(...p.map(p=>p[0])),Math.max(...p.map(p=>p[1]))];
const overlap = (a,b)=>a[0]<b[2]&&a[2]>b[0]&&a[1]<b[3]&&a[3]>b[1];
const transformText = b=>b.g.getAttribute('transform');
const tracks = [], ravenGate = { gap: Infinity, step: 0 }, partFade = b => [b.g, ...b.g.querySelectorAll('*')].filter(n => !n.closest('.rv-item')).map(n => (n.getAttribute('opacity') ?? '') + (n.style.opacity ?? '')).join('');
for(const [w,h] of [[1440,900],[390,844]]) {
  closePop();closeSheet(true);JOURNEY.set(mapP);tripResize(w,h,w>640?120:96);globalThis.innerWidth=w;globalThis.innerHeight=h;
  const surface=new TestNode('svg');surface.innerHTML='<g id="finds">'+chart.finds+'</g>';
  const rv=FD.list.ravens=findRavens(surface), hd=FD.list.hoards=findHoards(surface);
  const pressFind=id=>surface.querySelector('#f-'+id).dispatchEvent(new TestEvent('keydown',{key:'Enter'}));
  // The tree is drawn before both birds and every filled part of a bird is opaque, so a bird in front of a bough hides it.
  assert.deepEqual(surface.querySelectorAll('#f-ravens .rv-tree, #f-ravens .rv-a, #f-ravens .rv-b').map(n=>n.className),['rv-tree','rv-a','rv-b'],'tree drawn before the birds');
  for(const b of rv.birds)for(const sel of ['.rv-body > path','.rv-far > path','.rv-near > path','.rv-head > path']){const fills=b.g.querySelectorAll(sel).filter(n=>!n.matches('.l')&&!n.matches('.t'));assert.ok(fills.length&&fills.every(n=>n.matches('.g')||n.matches('.o')),'opaque raven part '+sel);}
  await tick(.1);stepsFocus('ravens',ravenFind.view);pressFind('ravens');pressFind('ravens');
  assert.equal(rv.queued,true);await tick(.2);assert.equal(rv.stage,'rest');assert.equal(findReady('ravens'),false);
  const snapshots=[],featherTracks=new Map(),wingBox=boxOf(pathPoints(rig.WING)),wingScale=FIND_PLAY.raven.scale*FIND_PLAY.raven.birdScale;
  testObserve=st=>{
    snapshots.push({t:testClock,stage:rv.stage,cam:{...st.cam},birds:rv.birds.map(b=>({mode:b.mode,xy:b.xy.slice(),mirror:b.mirror,rotate:b.rotate,pose:structuredClone(b.pose),landTs:b.landTs,text:transformText(b),fade:partFade(b),points:birdPoints(b),local:birdPoints(b,true).map(p=>[p[0]-b.xy[0],p[1]-b.xy[1]])}))});
    for(const bit of FD.bits.filter(b=>b.live&&b.kind==='feather')){
      const points=pathPoints(bit.el.getAttribute('d')).map(p=>point(matrix(bit.el.getAttribute('transform')),p)),box=boxOf(points),owner=bit.x<ravenFind.x?0:1,other=boxOf(birdPoints(rv.birds[1-owner])).map((v,i)=>v*FIND_PLAY.raven.scale+(i%2?ravenFind.y:ravenFind.x));
      const track=featherTracks.get(bit.serial)||[];if(track.length)assert.ok(bit.y>track.at(-1).y,'quill drifts down every frame');
      else assert.ok((bit.x-ravenFind.x-rv.birds[owner].xy[0]*FIND_PLAY.raven.scale)*rv.birds[owner].side<0,'quill starts behind the bird');
      // Compare each dimension with the same rig wing opened at its uniform map scale.
      assert.ok(box[2]-box[0]<=(wingBox[2]-wingBox[0])*wingScale/3&&box[3]-box[1]<=(wingBox[3]-wingBox[1])*wingScale/3,'quill is at most a third of an open wing box');
      assert.ok(!overlap(box,other),'quill never overlaps the other bird');assert.ok(bit.life<=.8&&bit.age<.8);
      track.push({y:bit.y,t:testClock,age:bit.age});featherTracks.set(bit.serial,track);
    }
  };
  await tick(4.3);assert.equal(rv.tally,1);assert.equal(rv.thoughts,1);assert.equal(rv.stage,'rest');assert.equal(FD.popOwner,rv);
  const bRest=transformText(rv.birds[1]), land0=rv.birds[0].landTs;
  assert.ok(snapshots.filter(s=>['flight','landing'].includes(s.stage)).every(s=>s.birds[1].text===bRest));assert.equal(rv.birds[1].landTs,-Infinity);
  pressFind('ravens');assert.equal(FD.popOwner,null);await tick(3.6);assert.equal(rv.stage,'reel');assert.equal(rv.birds[0].landTs,land0);
  assert.equal(Number(rv.birds[1].item.getAttribute('opacity')),1,'Muninn keeps its frame while its reel is open');assert.equal(Number(rv.birds[0].item.getAttribute('opacity')),0,'Huginn\'s old strip stays faded while the reel is open');
  const aRest=transformText(rv.birds[0]), aHead=rv.birds[0].head.getAttribute('transform');await tick(1);
  assert.equal(transformText(rv.birds[0]),aRest);assert.notEqual(rv.birds[0].head.getAttribute('transform'),aHead,'resting head remains live during reel');
  assert.ok(document.documentElement.classList.contains('jm-sheet-open'));await tick(5);
  assert.ok(snapshots.filter(s=>s.stage==='reel').every(s=>s.birds[0].text===aRest),'other bird stays perched for the whole reel');
  assert.equal(rv.stage,'rest');assert.ok(!document.documentElement.classList.contains('jm-sheet-open'));await tick(.3);
  const thoughtBefore=rv.thoughts,tallyBefore=rv.tally;pressFind('ravens');await tick(.5);FD.overlayEpoch++;await tick(3);
  assert.equal(rv.thoughts,thoughtBefore);assert.equal(rv.tally,tallyBefore);assert.equal(FD.popOwner,null);
  rv.hear();await tick(.3);assert.equal(rv.birds[1].mode,'sit');await tick(2.2);assert.equal(rv.stage,'rest');
  assert.ok(featherTracks.size>=8,'both takeoffs and staggered hear loops shed quills');assert.ok(FD.bits.every(b=>b.kind!=='feather'||!b.live),'all takeoff quills are gone by .8 s');
  for(const track of featherTracks.values())assert.ok(track.at(-1).t-track[0].t<=.8);
  testObserve=null;
  // The near pointer is on the trunk side. Only outward bough travel is allowed, at <= 1 unit/tick.
  const shyBird=rv.birds[0], shyPath=[];
  FD.pointer=[(ravenFind.x+rig.PERCHES[0][0]*FIND_PLAY.raven.scale+2)*FD.st.cam.s+FD.st.cam.tx,(ravenFind.y+rig.PERCHES[0][1]*FIND_PLAY.raven.scale)*FD.st.cam.s+FD.st.cam.ty];FD.pointerT=testClock;
  testObserve=()=>shyPath.push(shyBird.xy.slice());await tick(.3);
  assert.equal(shyBird.shy,FIND_PLAY.raven.shy);assert.ok(shyPath.every((p,i)=>!i||p[0]<=shyPath[i-1][0]+1e-8));
  FD.pointer=[-Infinity,-Infinity];await tick(.3);testObserve=null;assert.equal(shyBird.shy,0);
  shyPath.forEach((p,i)=>{if(i)assert.ok(Math.hypot(...p.map((v,k)=>v-shyPath[i-1][k]))<=1);assert.ok(p[0]<=rig.PERCHES[0][0]+1e-8);});
  for(let i=0;i<snapshots.length;i++)for(let j=0;j<2;j++){
    const s=snapshots[i],b=s.birds[j],prev=snapshots[i-1]?.birds[j];
    if(b.mode==='sit')assert.equal(b.rotate,0,'sit is level in the same frame');
    if(prev)assert.ok(Math.abs(b.mirror-prev.mirror)<=2*1.5*.016/rig.turn+1e-6,'continuous facing '+JSON.stringify({j,mode:b.mode,prev:prev.mode,t:s.t,dt:s.t-snapshots[i-1].t,a:prev.mirror,b:b.mirror}));
    if(prev&&snapshots[i+1]?.birds[j].mode===b.mode&&snapshots[i+1].birds[j].xy[1]<prev.xy[1]-.01&&['out','back','loop'].includes(b.mode)&&Math.abs(b.mirror)>.99)assert.ok(b.rotate*b.mirror<=1e-7,'climbing beak points up '+JSON.stringify({j,mode:b.mode,rotate:b.rotate,mirror:b.mirror,dy:b.xy[1]-prev.xy[1]}));
    const ownBox=boxOf(b.points);
    // One drawing per bird: no part fades, and the bird is never stretched (only the turn narrows it).
    assert.equal(b.fade,'','raven parts never change opacity');{const sc=b.text.match(/scale\(([-\d.e]+) ([-\d.e]+)\)$/);close(Number(sc[2]),FIND_PLAY.raven.birdScale,'raven scale');assert.ok(Math.abs(Number(sc[1]))<=FIND_PLAY.raven.birdScale+1e-9);}
    // The two birds' outlines stay at least 1 rig unit apart, whatever they are doing.
    if(!j){const A=s.birds[0].points,B=s.birds[1].points,a=boxOf(A),b2=boxOf(B);if(a[0]-2<b2[2]&&a[2]+2>b2[0]&&a[1]-2<b2[3]&&a[3]+2>b2[1]){let d=Infinity;for(const p of A)for(const q of B)d=Math.min(d,Math.hypot(p[0]-q[0],p[1]-q[1]));ravenGate.gap=Math.min(ravenGate.gap,d);assert.ok(d>=1,'raven outlines '+d.toFixed(2)+' apart at '+s.birds.map(x=>x.mode).join('/'));}}
    const mapBox=ownBox.map((v,k)=>v*FIND_PLAY.raven.scale+(k%2?ravenFind.y:ravenFind.x)),serpent=FINDS.find(f=>f.id==='serpent'),hit=FIND_PLAY.serpent.hit;
    assert.ok(!overlap(mapBox,[serpent.x+hit[0],serpent.y+hit[1],serpent.x+hit[0]+hit[2],serpent.y+hit[1]+hit[3]]),'raven clears serpent hit box');
    const screen=mapBox.map((v,k)=>v*s.cam.s+(k%2?s.cam.ty:s.cam.tx));assert.ok(screen[3]<(h-(w>640?56+14+44:52)),'raven clears stepper band');
    if(b.mode==='loop')assert.ok(mapBox[1]>=serpent.y+hit[1]+hit[3]+5,'hear loop 5 units below serpent');
    // The pose moves on in small steps: no point of the drawing jumps more than 9 rig units in one frame.
    if(prev){let m=0;b.local.forEach((p,k)=>{const q=prev.local[k];if(q)m=Math.max(m,Math.hypot(p[0]-q[0],p[1]-q[1]));});ravenGate.step=Math.max(ravenGate.step,m);assert.ok(m<=9,'pose step '+m.toFixed(2)+' from '+prev.mode+' to '+b.mode);}
  }
  // Count sign changes per contiguous leg, excluding zero at the edge-on instant.
  for(let j=0;j<2;j++) {let mode='',sign=0,changes=0;for(const s of snapshots){const b=s.birds[j];if(b.mode!==mode){mode=b.mode;sign=0;changes=0;}const next=Math.sign(b.mirror);if(sign&&next&&next!==sign)changes++;if(next)sign=next;assert.ok(changes<=(mode==='loop'?2:1),'facing reversals in '+mode);}}
  for(let j=0;j<2;j++) {
    let active=false,outside=0;const flights=[];
    for(const s of snapshots){const b=s.birds[j];if(b.mode==='crouch'&&!active){active=true;outside=0;}if(!active)continue;
      const bmap=boxOf(b.points).map((v,k)=>(v*FIND_PLAY.raven.scale+(k%2?ravenFind.y:ravenFind.x))*s.cam.s+(k%2?s.cam.ty:s.cam.tx)),visible=bmap[2]>=0&&bmap[0]<=w&&bmap[3]>=0&&bmap[1]<=h;
      if(b.mode==='crouch'||b.mode==='settle')assert.ok(visible,'takeoff and landing in view');if(!visible)outside+=.016;
      if(b.mode==='setdown'){flights.push(outside);active=false;}
    }flights.forEach(time=>assert.ok(time<=1.2,'out of view for '+time));
  }
  tracks.push(w+'x'+h+': '+snapshots.length+' raven ticks');
  // Fresh chest: five rapid presses during focus cannot skip to opening.
  const chest=hd.items[0];stepsFocus(chest.id,findView(chest.id));
  for(let i=0;i<5;i++){pressFind(chest.id);await tick(.06);assert.ok(chest.digs<=1);assert.equal(chest.open,false);}
  const chestFrames=[];testObserve=()=>chestFrames.push({t:testClock,openTs:chest.openTs,digs:chest.digs,stage:chest.stage,y:chest.y,lift:chest.lift,angle:chest.lidAngle,rock:chest.rock||0,pivot:chest.pivot||0,rx:Number(chest.hole.getAttribute('rx')),rattleTs:chest.rattleTs});
  await tick(1);assert.ok(chest.digs<=2);assert.equal(chest.open,false);assert.equal(chest.digs,1);assert.equal(chest.hintLine,FIND_COPY.hoardHints[1]);
  assert.ok(chest.y-45>Number(chest.hole.getAttribute('ry')),'first lid remains buried');
  pressFind(chest.id);await tick(.4);assert.equal(chest.hintLine,FIND_COPY.hoardHints[2]);
  pressFind(chest.id);await tick(1);assert.equal(chest.stage,'out');assert.equal(chest.hintLine,FIND_COPY.hoardHints[3]);pressFind(chest.id);await tick(.75);assert.equal(chest.stage,'open');assert.equal(chest.hintLine,FIND_COPY.hoardHints[4]);
  const popup=FD.popInner;assert.equal(FD.popOwner,chest);await tick(.3);assert.equal(FD.popBody.style.opacity,1);
  assert.equal((testPop.recordedHTML.match(/Piece to come/g)||[]).length,1);
  for(let i=0;i<4;i++){pressFind(chest.id);await tick(.32);assert.equal(FD.popInner,popup);assert.equal(FD.popBody.style.opacity,1);}
  for(let i=0;i<4;i++){pressFind(chest.id);await tick(.06);assert.equal(FD.popInner,popup);assert.equal(FD.popBody.style.opacity,1);}await tick(.6);
  testObserve=null;
  for(let i=0;i<chestFrames.length;i++){
    const s=chestFrames[i],p=chestFrames[i-1];
    if(s.digs<3||['rising','rattling','out'].includes(s.stage))assert.equal(s.angle,0);
    if(s.angle>0)assert.ok(s.t>=s.rattleTs+FIND_PLAY.hoard.rattle);
    if(p)assert.ok(Math.abs(s.angle-p.angle)<=25);assert.ok(s.angle<=118+1e-8);
    if(s.digs===3&&s.stage==='rising')assert.ok(s.rx>=FIND_PLAY.hoard.half+6);
    if(s.rock){const a=s.rock*Math.PI/180;for(const x of [-30,30])assert.ok(s.y+(x-s.pivot)*Math.sin(a)<=1e-8,'bottom corner above ground');}
    if(p&&s.stage==='rising'&&p.stage==='rising'&&s.digs===p.digs){const target=FIND_PLAY.hoard.travel*(1-FIND_PLAY.hoard.lift[s.digs-1]);assert.ok(s.y<=p.y+1e-8||s.y<=target,'rise reverses only after target');assert.ok(s.y>=target-1.2);}
  }
  close(chest.lidAngle,110,'lid at rest');
  const opening=chestFrames.filter(s=>s.stage==='opening'),first=opening[0],peak=opening.reduce((a,b)=>a.angle>b.angle?a:b);assert.ok(first.angle<2,'lid starts gently');assert.ok(Math.abs(peak.t-peak.openTs-.5)<=.016,'lid peaks at .5 s');assert.ok(peak.angle-FIND_PLAY.hoard.lidRest<=8);assert.ok(FIND_PLAY.hoard.lidTime===.5);
  const clipIds=surface.querySelectorAll('clipPath').map(n=>n.id);assert.equal(new Set(clipIds).size,6);
  assert.equal(clipIds.filter(id=>id.startsWith('clip-hoard-')).length,5);assert.ok(clipIds.includes('beacon-frame'),'E3 adds only the static map-frame beam clip');
  assert.equal(surface.querySelector('#f-hoards').tabIndex,-1);assert.equal(surface.querySelector('#f-hoards').getAttribute('role'),'group');assert.equal(surface.querySelector('#f-hoards').listeners.keydown,undefined);
  const under=hd.items[1];stepsFocus(under.id,findView(under.id));await tick(.7);assert.equal(under.hintLine,FIND_COPY.hoardHints[0]);
  for(const item of hd.items)item.setCraftLit(true);await tick(.1);hd.items.filter(item=>item.digs<3).forEach(item=>{assert.equal(item.glowAlpha,0);assert.equal(Number(item.glow.getAttribute('opacity')),0);assert.equal(item.scratch.style.strokeWidth,FIND_PLAY.hoard.scratchWidth);});
  closePop();stepsRelease();await tick(.6);
}
FD.list.ravens=savedRavens;FD.list.hoards=savedHoards;tripResize(1440,900,120);globalThis.innerWidth=1440;globalThis.innerHeight=900;
console.log('ok: C2 ravens (tree drawn first, opaque birds, one drawing each, flights out of frame and back, facing, landing, reel and its kept items, epoch, shy hop, hear loop; outlines at least '+ravenGate.gap.toFixed(2)+' units apart, largest pose step '+ravenGate.step.toFixed(2)+') and chests (staged dig, rattle, back lid, craft light, hints, kept popup): '+tracks.join('; '));
console.log('ok: D2 falling quills fit one third of an open wing, stay behind takeoff/clear the other bird and expire by .8 s; 16 ms lid steps <=25 degrees, gentle start, .5 s peak, <=8 degree overshoot');

const liveAttr=new TestNode();liveAttr.setAttribute('opacity','1');let attrWrites=0;const originalSet=liveAttr.setAttribute.bind(liveAttr);liveAttr.setAttribute=(k,v)=>{attrWrites++;originalSet(k,v);};
attr(liveAttr,'opacity',1);assert.equal(attrWrites,0);originalSet('opacity','0');attr(liveAttr,'opacity',1);assert.equal(attrWrites,1,'compare against live attribute after external mutation');
let observedWrites=0;const observer=new TestMutationObserver(records=>{
  records.forEach((record,i)=>{const next=records.slice(i+1).find(r=>r.target===record.target&&r.attributeName===record.attributeName),value=next?next.oldValue:record.target.getAttribute(record.attributeName);assert.notEqual(value,record.oldValue,'same-value attribute write '+record.target.id+'/'+record.attributeName);observedWrites++;});
});observer.observe(testSvg,{attributes:true,attributeOldValue:true,subtree:true});
for(const mode of ['stop','blast'])for(let ms=0;ms<2000;ms+=16){
  const P=mode==='stop'?stopP:SEQ.find(s=>s.kind==='blast').a+SEQ.find(s=>s.kind==='blast').len*Math.min(1,ms/1600);
  testClock+=.016;findsFrame(testClock,tripState(P));await Promise.resolve();observer.callback(observer.takeRecords());
}
observer.disconnect();assert.ok(observedWrites>0);console.log('ok: D3 live attribute equality skips stale/same values; attribute MutationObserver recording rejects every redundant write over 2 s at a stop and 2 s of blast ('+observedWrites+' writes)');

// Fresh nodes for a reduced-motion visit; no browser or pixel rendering is involved.
const rmSvg = new TestNode('svg'), rmPop = new TestNode('div'), rmSheet = new TestNode('div'), rmTl = new TestNode('div');
testStage.append(rmSvg, rmPop, rmSheet, rmTl); rmSvg.innerHTML = mapDefs() + '<g id="b-all">' + chart.detail + '</g><g id="finds">' + chart.finds + '</g>';
FD.found = new Set(); FD.list = {}; FD.bits = []; FD.flights = []; FD.flight = null;
stepsBuild({ stage: testStage, rm: true, resize() {}, joinedTop: () => false }); tlBuild(rmTl, { jump() {}, scrub() {} }, true);
findsBuild(rmSvg, rmPop, rmSheet, rmSvg.querySelector('#b-all'), true);
const rmCamera = tripState(mapP).cam;
async function rmTick(seconds = 0.05) { testClock += seconds; const st = tripState(mapP); testInFrame = true; try { findsFrame(testClock, st); } finally { testInFrame = false; } await Promise.resolve(); assert.deepEqual(st.cam, rmCamera); }
const rmKey = (id, key = 'Enter') => rmSvg.querySelector('#f-' + id).dispatchEvent(new TestEvent('keydown', { key }));
await rmTick(); rmKey('wayfinder', 'ArrowRight'); await rmTick();
for (let i = 0; i < 4; i++) { rmKey('hoard-hmc1'); await rmTick(); }
assert.equal(window.__jm.finds.state('hoard-hmc1').open, true);
rmKey('ravens'); await rmTick(); assert.equal(window.__jm.finds.state('ravens').tally, 1);
rmKey('ravens'); await rmTick(); await rmTick(0.1); assert.equal(window.__jm.finds.state('ravens').stage, 'reel'); await rmTick(5.1); assert.equal(window.__jm.finds.state('ravens').stage, 'rest');
{ const b = FD.list.ravens.birds[0], before = b.g.getAttribute('transform'); FD.pointer = [(ravenFind.x + rig.PERCHES[0][0] * FIND_PLAY.raven.scale + 2) * rmCamera.s + rmCamera.tx, (ravenFind.y + rig.PERCHES[0][1] * FIND_PLAY.raven.scale) * rmCamera.s + rmCamera.ty]; for (let i = 0; i < 8; i++) { FD.pointerT = testClock; await rmTick(0.05); } assert.ok(FD.list.ravens.awake, 'pointer reaches Huginn'); assert.equal(b.shy, 0, 'no shy hop under reduced motion'); assert.equal(b.g.getAttribute('transform'), before); FD.pointer = [-Infinity, -Infinity]; }
for (let i = 0; i < 4; i++) { rmKey('serpent'); await rmTick(); }
assert.equal(window.__jm.finds.state('serpent').stage, 'asleep');
assert.ok(FD.list.serpent.swells.every(s=>!s.live));assert.equal(rmSvg.querySelector('.jg-eye').getAttribute('opacity'),'0');assert.equal(FD.list.serpent.tailOut,1);
const rmActors=['.yg-eagle','.yg-wings','.yg-rat','.yg-tail'].map(s=>rmSvg.querySelector(s)), rmTransforms=rmActors.map(n=>n.getAttribute('transform'));FD.list.well.hear();await rmTick(3);assert.deepEqual(rmActors.map(n=>n.getAttribute('transform')),rmTransforms);
console.log('ok: reduced-motion serpent swaps names and ships with no swell; no shy hop; all tree actors stay still on hear');
for (let i = 0; i < 4; i++) { rmKey('beacon'); await rmTick(); }
assert.equal(window.__jm.finds.state('beacon').fire, 4);
rmKey('runestone'); await rmTick(); assert.equal(window.__jm.finds.state('runestone').read, true);
assert.ok(FD.bits.every(b => !b.live)); assert.equal(FD.flight, null); assert.equal(stepsFocus('horn', FIND_PLAY.focus.wide), false);
console.log('ok: reduced-motion Part A plays land immediately, memory remains readable for five seconds, no live bits/flights/focus, camera unchanged');
closeSheet(); rmKey('hammer'); rmSheet.querySelector('.hm-start').dispatchEvent(new TestEvent('click')); const rmHammer = FD.list.hammer; rmHammer.hear(); await rmTick(); assert.equal(rmHammer.game.reduced, true); assert.equal(rmSvg.querySelector('.hm-spark').getAttribute('opacity'), '0'); assert.equal(rmSvg.querySelector('.hm-lift').getAttribute('transform'), 'translate(0 0)'); assert.equal(rmHammer.game.sparks.some(p => p.live), false); closeSheet(); assert.equal(rmHammer.game.paused, true);
for (let i = 0; i < 3; i++) rmKey('mist'); rmKey('horn'); rmKey('horn');
for (let i = 0; i < 3; i++) { rmKey('well'); await rmTick(); rmKey('longship'); await rmTick(); }
assert.equal(window.__jm.finds.state('mist').lifted, true); assert.equal(window.__jm.finds.state('well').watered, 3); assert.equal(window.__jm.finds.state('longship').pennant, true); assert.equal(window.__jm.finds.state('horn').heard.length, 11);
assert.equal(FD.landed, 11); assert.equal(FD.allPending, true); closePop(); closeSheet(); await rmTick(); assert.equal(FD.all.done, true); assert.equal(rmTl.querySelector('.tl-count').textContent, 'All 11 found'); assert.ok(FD.bits.every(b => !b.live)); assert.equal(FD.flight, null);
console.log('ok: reduced-motion hammer plays/pauses without map sparks/tremble/hop; mist, horn, Norns, stars, pennant and all-eleven feedback land immediately with no bits, flights or camera change');
// Count the name's actual layout reads over a complete reveal, idle, knock and explore visit.
const nameLine = new TestNode('span'); nameLine.appendChild({ data: 'Danial Endrawes' });
let nameReads = 0, nameReason = 'resize'; const nameCounts = {};
const nameRead = () => { assert.ok(['resize', 'fonts', 'settle-end', 'explore'].includes(nameReason), 'footer name layout read from ' + nameReason); nameReads++; nameCounts[nameReason] = (nameCounts[nameReason] || 0) + 1; return { left: 0, top: 0, right: 400, bottom: 40, width: 400, height: 40 }; };
nameLine.getBoundingClientRect = nameRead;
testWindow.getComputedStyle = () => { nameRead(); return { fontSize: '30px' }; };
testDocument.createRange = () => ({ setStart() {}, setEnd() {}, getBoundingClientRect: nameRead });
footnameBuild(nameLine, false); footnameMeasure();
nameReason = 'fonts'; footnameMeasure();
for (let i = 0; i <= 100; i++) {
  nameReason = i === 100 ? 'settle-end' : 'frame';
  testInFrame = true; try { footnameReveal({ settleT: i / 100 }); footnameFrame(i * .016, .016, [0, 0]); } finally { testInFrame = false; }
  await Promise.resolve();
}
nameReason = 'knock'; nameLine.dispatchEvent(new TestEvent('pointerdown', { pointerType: 'mouse', clientX: 100 }));
for (let i = 0; i < 500; i++) { nameReason = 'idle'; footnameFrame(i * .016, .016, [0, 0]); await Promise.resolve(); }
for (let i = 0; i < 2; i++) { nameReason = 'explore'; testWindow.dispatchEvent(new TestEvent('jm-explore')); await Promise.resolve(); }
assert.equal(nameReads, ('Danial Endrawes'.length + 2) * 5);
console.log('ok: footer name layout reads ' + nameReads + ' total, only resize/fonts/settle-end/two explore boundaries; none in idle frames or knock: ' + JSON.stringify(nameCounts));
const keyTimeline = new TestNode(), keyJumps = []; tlBuild(keyTimeline, { jump: i=>keyJumps.push(i), scrub() {} }, false);
for(const key of ['Home','End']){const e=new TestEvent('keydown',{key});keyTimeline.dispatchEvent(e);assert.equal(e.defaultPrevented,true);}assert.deepEqual(keyJumps,[0,STOPS.length-1]);
console.log('ok: actual timeline Home and End handlers select first and last stops');
}
testPlays().catch(error => { console.error(error); process.exitCode = 1; });
