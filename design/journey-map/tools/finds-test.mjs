// Node-only geometry and source-preservation gates for FINDS Part A.
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { bigMap, rubbingRunes, pieceIcon } from '../art.mjs';
import { STARS, DEPTH, NOVA, FINDS, FIND_PLAY, FIND_COPY, STOPS } from '../data.mjs';
import { tripFocus, tripState, tripResize, toScreen, VIEW, SEQ, WATER, pointAt } from '../trip.mjs';
import { BEATS } from '../pace.mjs';
import { wayAllStops } from '../findhoards.mjs';
import { mapDefs } from '../art.mjs';
import { tlBuild } from '../timeline.mjs';
import { JOURNEY, stepsBuild, stepsFrame, stepsFocus, stepsFocusNow, stepsRelease } from '../steps.mjs';
import { findsBuild, findsFrame } from '../finds.mjs';
import { FD, closeSheet, closePop } from '../findkit.mjs';
import { taflPanelHeight } from '../findboard.mjs';



const digest = s => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
const close = (a, b, label, tolerance = 0.000001) => assert.ok(Math.abs(a - b) <= tolerance, `${label}: ${a} != ${b}`);
const chart = bigMap();
assert.ok(!/undefined|\{\{/.test(chart.finds), 'all live drawing tokens must resolve');
// Recorded before any art edits in this run.
const original = { sea: [73566, 1305240864], fill: [12855, 3665486802], coast: [4401, 2408021381] };
for (const [key, [length, hash]] of Object.entries(original)) { assert.equal(chart[key].length, length); assert.equal(digest(chart[key]), hash); }
console.log('ok: original sea/fill/coast lengths and hashes unchanged');
// The review tunes these three tables in a browser and records their digest here afterwards; a build never changes them.
assert.equal(digest(JSON.stringify([STARS, DEPTH, NOVA])), 3766120675);
console.log('ok: STARS, DEPTH and NOVA values unchanged');
// A build never changes these two files. The review records their digests here after each tuning pass (a failure
// prints the new number); line endings are evened out first, so the numbers are the same on Windows and in the cloud.
const sourceDigest = name => digest(readFileSync(new URL('../' + name, import.meta.url), 'utf8').replace(/\r\n/g, '\n'));
assert.equal(sourceDigest('trip.mjs'), 1263348541, 'trip.mjs changed');
assert.equal(sourceDigest('depth.mjs'), 2687768251, 'depth.mjs changed');
console.log('ok: trip.mjs and depth.mjs unchanged since the review');
const levels = [0, 0.1, 0.25, 0.5, 0.75, 1];
const mapP = BEATS.find(b => b.id === 'map').P, stopP = BEATS.find(b => b.id === STOPS[2].id).P, leg = SEQ.find(q => q.kind === 'leg' && q.i === 2), legP = leg.a + leg.len / 2;
for (const [w, h] of [[1440, 900], [390, 664]]) {
  tripResize(w, h, h > 800 ? 120 : 96);
  let cases = 0;
  for (const P of [mapP, stopP, legP]) {
    const base = tripState(P), chest = FIND_COPY.hoards[0], ship = pointAt(Math.max(WATER[0], Math.min(WATER[1], base.u))), F = FIND_PLAY.focus;
    const views = [...FINDS.filter(f => f.view).map(f => f.view), [chest.x + F.chest[0], chest.y + F.chest[1], F.chest[2]], [ship[0] + F.ship[0], ship[1] + 5 + F.ship[1], F.ship[2]], F.wide];
    for (const view of views) {
      const zero = structuredClone(base); tripFocus(zero, view, 0); assert.deepEqual(zero, base);
      const least = view[3] ?? F.least, scale = Math.max(Math.max(VIEW.s0, least * VIEW.sT), Math.min(F.most * VIEW.sT, F.fill * Math.min(w, h) / (2 * view[2])));
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
  for (const required of ['role="button"', 'tabindex="0"', 'aria-label="', 'data-x="', 'data-y="']) assert.ok(tag.includes(required), `${f.id}: ${required}`);
}
assert.equal((chart.detail.match(/id="mk-[^"]+"/g) || []).length, 6);
assert.equal((chart.detail.match(/class="mk"/g) || []).length, 7);
assert.ok(/<g class="mk"><circle cx="140"/.test(chart.detail));
console.log('ok: eleven accessible find groups, six marker ids and unnumbered legend id');
assert.deepEqual(STOPS.filter((s, i) => wayAllStops()[i]).map(s => s.id), ['lennard']);
assert.equal(rubbingRunes().map(r => r.letter).join(''), 'FIRSTSKETCHFINALCUT');
assert.equal(rubbingRunes().length, 19);
assert.ok(FIND_COPY.hoards.every(h => pieceIcon(h.kind).length));
console.log('ok: all-four mask derived from STOPS is Lennard alone; nineteen rune middles/letters; all piece icons available');

// A small recording DOM, not a browser: exercise state transitions and reject NaN writes/layout reads in frame callbacks.
class TestNode {
  constructor(tag = 'div') { this.tagName = tag; this.attrs = {}; this.children = []; this.listeners = {}; this.nodeType = 1; this.style = { setProperty(k, v) { this[k] = v; } }; this.dataset = {}; this.hidden = false; this.classList = { add: (...xs) => xs.forEach(x => this.toggleClass(x, true)), remove: (...xs) => xs.forEach(x => this.toggleClass(x, false)), toggle: (x, force) => this.toggleClass(x, force), contains: x => this.className.split(/\s+/).includes(x) }; }
  get id() { return this.attrs.id || ''; } set id(v) { this.attrs.id = v; }
  get className() { return this.attrs.class || ''; } set className(v) { this.attrs.class = v; }
  get firstElementChild() { return this.children[0]; } get firstChild() { return this.children[0]; }
  get isConnected() { return true; }
  toggleClass(x, force) { const set = new Set(this.className.split(/\s+/).filter(Boolean)); const on = force ?? !set.has(x); if (on) set.add(x); else set.delete(x); this.className = [...set].join(' '); return on; }
  setAttribute(k, v) { assert.ok(!/NaN/.test(String(v)), `NaN attribute ${this.id}/${k}: ${v}`); this.attrs[k] = String(v); if (k.startsWith('data-')) this.dataset[k.slice(5)] = String(v); }
  getAttribute(k) { return this.attrs[k] ?? null; }
  appendChild(node) { if (node.parentElement) node.parentElement.children = node.parentElement.children.filter(c => c !== node); this.children.push(node); node.parentElement = this; return node; }
  append(...nodes) { nodes.forEach(n => this.appendChild(n)); }
  remove() { if (this.parentElement) this.parentElement.children = this.parentElement.children.filter(c => c !== this); this.parentElement = null; }
  prepend(...nodes) { nodes.reverse().forEach(n => { this.children.unshift(n); n.parentElement = this; }); }
  set innerHTML(html) {
    this.children = []; const stack = [this];
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
  addEventListener(type, fn, capture = false) { (this.listeners[type] ??= []).push({ fn, capture: capture === true }); }
  dispatchEvent(event) {
    event.target = this; const path = []; for (let p = this; p; p = p.parentElement) path.push(p);
    for (const node of path.slice().reverse()) for (const l of node.listeners[event.type] || []) { if (l.capture && !event.stopped) l.fn(event); }
    for (const node of path) { for (const l of node.listeners[event.type] || []) if (!l.capture && !event.stopped) l.fn(event); if (!event.bubbles) break; }
    return !event.defaultPrevented;
  }
  focus() { document.activeElement = this; }
  setPointerCapture() {}
  getAnimations() { return []; }
  animate() { return { cancel() {} }; }
  getBoundingClientRect() { assert.equal(testInFrame, false, 'layout read in frame callback'); return { left: 30, top: 40, width: this.classList.contains('tl-count') ? 90 : 240, height: this.classList.contains('tl-count') ? 20 : 140 }; }
}
class TestEvent {
  constructor(type, props = {}) { Object.assign(this, { type, bubbles: true, detail: 0, preventDefault() { this.defaultPrevented = true; }, stopPropagation() { this.stopped = true; }, stopImmediatePropagation() { this.stopped = true; } }, props); }
}
let testInFrame = false;
const htmlNode = new TestNode('html'), bodyNode = new TestNode('body'); htmlNode.appendChild(bodyNode);
const testDocument = new TestNode('document'); testDocument.appendChild(htmlNode);
Object.assign(testDocument, { documentElement: htmlNode, body: bodyNode, activeElement: bodyNode, createElement: tag => new TestNode(tag), createElementNS: (ns, tag) => new TestNode(tag), getElementById: id => htmlNode.querySelector('#' + id) });
const testWindow = new TestNode('window');
Object.assign(testWindow, { location: { search: '' }, innerWidth: 1440, innerHeight: 900, scrollY: 0, scrollTo() {}, matchMedia: () => ({ matches: true, addEventListener() {} }) });
Object.assign(globalThis, { window: testWindow, document: testDocument, history: { scrollRestoration: 'auto' }, sessionStorage: { getItem() { return null; }, setItem() {} }, matchMedia: testWindow.matchMedia, innerWidth: 1440, innerHeight: 900, Event: TestEvent, KeyboardEvent: TestEvent });
async function testPlays() {
const testStage = new TestNode('div'), testSvg = new TestNode('svg'), testBase = new TestNode('g'), testPop = new TestNode('div'), testSheet = new TestNode('div'), testTl = new TestNode('div');
bodyNode.appendChild(testStage); testStage.append(testSvg, testPop, testSheet, testTl); testBase.id = 'b-all';
testSvg.innerHTML = mapDefs() + '<g id="b-all">' + chart.detail + '</g><g id="finds">' + chart.finds + '</g>';
stepsBuild({ stage: testStage, rm: false, resize() {}, joinedTop: () => false });
tlBuild(testTl, { jump() {}, scrub() {} }, false);
findsBuild(testSvg, testPop, testSheet, testSvg.querySelector('#b-all'), false);
tripResize(1440, 900, 120); JOURNEY.set(mapP);
let testClock = 1;
async function tick(seconds) {
  const frames = Math.ceil(seconds / FIND_PLAY.kit.dt);
  for (let i = 0; i < frames; i++) {
    testClock += seconds / frames; const P = stepsFrame(testClock * 1000), st = tripState(P), focus = stepsFocusNow();
    if (focus) tripFocus(st, focus.view, focus.k);
    testInFrame = true; try { findsFrame(testClock, st); } finally { testInFrame = false; }
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
for (let i = 0; i < 4; i++) { key('hoard-laurier'); await tick(0.4); }
assert.equal(window.__jm.finds.state('hoard-laurier').digs, 3); assert.equal(window.__jm.finds.state('hoard-laurier').open, true);
key('ravens'); await tick(2.7); assert.equal(window.__jm.finds.state('ravens').tally, 1);
key('ravens'); await tick(2.7); assert.equal(window.__jm.finds.state('ravens').stage, 'reel'); await tick(5.9); assert.equal(window.__jm.finds.state('ravens').stage, 'rest');
for (let i = 0; i < 3; i++) { key('serpent'); await tick(3.2); }
await tick(0.5);
assert.equal(window.__jm.finds.state('serpent').stage, 'asleep');
for (let i = 0; i < 4; i++) { key('beacon'); await tick(1.9); }
assert.equal(window.__jm.finds.state('beacon').fire, 4);
key('runestone'); await tick(5);
assert.equal(window.__jm.finds.state('runestone').read, true); assert.equal(window.__jm.finds.state('runestone').controls, true);
assert.equal(JOURNEY.P, fixedP); assert.equal(JOURNEY.focus, 'runestone');
const copyState = window.__jm.finds.state('runestone'); copyState.rubbed[0] = false; assert.equal(window.__jm.finds.state('runestone').rubbed[0], true);
const beforeBack = JOURNEY.P; JOURNEY.back(); assert.equal(JOURNEY.P, beforeBack); assert.equal(JOURNEY.focus, null); await tick(0.7); assert.equal(stepsFocusNow(), null);
assert.equal(stepsFocus('horn', FIND_PLAY.focus.wide), true); await tick(0.8); assert.equal(JOURNEY.P, beforeBack); stepsRelease(); await tick(0.6);
JOURNEY.setMode('scroll'); assert.equal(stepsFocus('horn', FIND_PLAY.focus.wide), false);
assert.equal(window.__jm.finds.found().length, 6);
JOURNEY.setMode('steps'); JOURNEY.set(mapP); await tick(0.1); key('ravens'); JOURNEY.back(); await tick(2.7); assert.equal(FD.popOwner, null); assert.equal(window.__jm.finds.state('ravens').tally, 2);
JOURNEY.set(0); assert.equal(stepsFocus('horn', FIND_PLAY.focus.wide), false); JOURNEY.set(mapP);
JOURNEY.go('lennard'); assert.equal(stepsFocus('horn', FIND_PLAY.focus.wide), false); await tick(0.7); JOURNEY.set(mapP);
JOURNEY.setMode('scroll');
console.log('ok: recording DOM runs six Part A plays, kept state, all-four unlock, reel, chase, four notes, rubbing, copied review state and Back/Scroll focus rules; no NaN attributes or frame layout reads');
window.scrollY = mapP * VIEW.unit; JOURNEY.set(mapP); await tick(0.1);
const mapBoard = testSvg.querySelector('.tf-board'), mapPieces = [...mapBoard.querySelectorAll('.tf-piece')];
key('tafl'); await tick(0.5); assert.equal(FD.sheetOwner.id, 'tafl'); assert.equal(testSheet.querySelector('.tf-board'), mapBoard);
const cellClick = sq => testSheet.querySelectorAll('.tf-cell')[sq].dispatchEvent(new TestEvent('click'));
cellClick(17); assert.equal(window.__jm.finds.state('tafl').selected, 17); cellClick(16); await tick(1.5);
assert.equal(window.__jm.finds.state('tafl').game.moves, 2); assert.equal(window.__jm.finds.state('tafl').game.turn, 'king');
assert.deepEqual([...mapBoard.querySelectorAll('.tf-piece')], mapPieces);
const keptBoard = window.__jm.finds.state('tafl').game.board; closeSheet(); assert.equal(testSvg.querySelector('.tf-board'), mapBoard);
key('tafl'); assert.deepEqual(window.__jm.finds.state('tafl').game.board, keptBoard);
const cursor = window.__jm.finds.state('tafl').cursor; testSheet.querySelectorAll('.tf-cell')[cursor].dispatchEvent(new TestEvent('keydown', { key: 'ArrowLeft' })); assert.equal(window.__jm.finds.state('tafl').cursor, cursor - 1);
testSheet.querySelector('.tf-new').dispatchEvent(new TestEvent('click')); await tick(0.4); assert.equal(window.__jm.finds.state('tafl').game.moves, 0);
FD.list.tafl.game.moves = FIND_PLAY.tafl.rules.limit - 1; cellClick(17); cellClick(16); await tick(0.4); assert.equal(window.__jm.finds.state('tafl').game.winner, 'draw'); assert.equal(testSheet.querySelector('.tf-slot').hidden, false); closeSheet();
const T = FIND_PLAY.tafl; assert.equal(T.cell * T.rules.size, T.board); assert.equal(T.width - 2 * (T.pad + T.border), T.board); assert.equal(taflPanelHeight(), 574); assert.ok(taflPanelHeight() + FIND_PLAY.kit.sheet.edge * 2 <= 664); assert.ok(T.width + FIND_PLAY.kit.sheet.edge * 2 <= 390);
console.log('ok: same board/pieces lift, slide, reply, persist, restart and end; keyboard cursor and end slot; 312x574 sheet fits 390x664 with separate 324/54/34/70/36 px rows');
// Regression: a captured king shares the defenders' tray, including their occupied slots.
key('tafl');
const captureBoard = FD.list.tafl; captureBoard.pieces.forEach(p => p.sq = p.start); captureBoard.pieces[0].sq = 1; captureBoard.pieces[1].sq = -1; captureBoard.pieces[5].sq = 16;
const priorDefender = captureBoard.pieces[1]; priorDefender.point = priorDefender.to = [T.trayInset, -T.tray / 2, T.capturedScale]; priorDefender.from = priorDefender.to.slice();
captureBoard.game = { ...captureBoard.game, board: Array(49).fill(null), turn: 'attackers', winner: null, moves: 10 }; captureBoard.pieces.filter(p => p.sq >= 0).forEach(p => captureBoard.game.board[p.sq] = p.kind);
captureBoard.busy = false; captureBoard.stage = 'reply'; captureBoard.replyAt = FD.now; await tick(1.2);
assert.equal(captureBoard.game.winner, 'attackers');
const topCaptures = captureBoard.pieces.filter(p => p.sq < 0 && p.kind !== 'a'); assert.ok(topCaptures.some(p => p.kind === 'k')); assert.ok(topCaptures.some(p => p.kind === 'd')); assert.equal(new Set(topCaptures.map(p => p.to.slice(0, 2).join())).size, topCaptures.length); closeSheet();
console.log('ok: captured king and defenders occupy distinct positions in their shared upper tray');
const autoState = tripState(mapP); autoState.trav = [154, 436]; findsFrame(testClock + 0.01, autoState); await Promise.resolve(); assert.ok(!FD.found.has('mist'));
key('mist'); key('mist'); key('mist'); await tick(2); assert.equal(window.__jm.finds.state('mist').lifted, true); assert.equal(window.__jm.finds.state('mist').stage, 'lifted');
key('horn'); assert.equal(window.__jm.finds.state('horn').up, 1); key('horn'); await tick(5.5); assert.equal(window.__jm.finds.state('horn').heard.length, 11); assert.equal(window.__jm.finds.state('horn').up, 0);
for (let i = 0; i < 3; i++) { key('well'); await tick(1.3); assert.equal(window.__jm.finds.state('well').norn, i); assert.equal(FD.popSide, 'below'); assert.equal(FD.popOrigin[1], 0); }
assert.equal(window.__jm.finds.state('well').watered, 3); assert.equal(window.__jm.finds.state('well').answer, FIND_COPY.wellStop.replace('{name}', STOPS[0].short).replace('{dates}', STOPS[0].dates));
assert.ok(testSvg.querySelector('#wl-crown').children.every(g => !/NaN/.test(g.getAttribute('transform') || '')));
const shipOuter = testSvg.querySelector('.ls-ship'), shipTransform = shipOuter.getAttribute('transform');
for (let i = 0; i < 3; i++) { key('longship'); await tick(1); }
assert.equal(window.__jm.finds.state('longship').pennant, true); assert.equal(window.__jm.finds.state('longship').lamp, true); assert.equal(shipOuter.getAttribute('transform'), shipTransform);
await tick(8); assert.equal(window.__jm.finds.found().length, 11); assert.equal(FD.landed, 11); assert.equal(testTl.querySelector('.tl-count').textContent, 'All 11 found'); assert.equal(FD.all.done, true);
assert.equal(testSvg.querySelector('#finds').children.at(-1).id, 'f-bits'); assert.equal(testSvg.querySelector('#hn-rings').getAttribute('pointer-events'), 'none'); assert.equal(testSvg.querySelector('#wl-crown').getAttribute('pointer-events'), 'none');
JOURNEY.setMode('steps'); JOURNEY.set(mapP); await tick(0.2); key('horn'); key('horn'); await tick(0.7); assert.deepEqual(stepsFocusNow().view, FIND_PLAY.focus.wide); JOURNEY.back(); await tick(5); assert.equal(JOURNEY.focus, null);
key('horn'); closePop(); testSvg.querySelector('#f-horn').dispatchEvent(new TestEvent('pointerdown', { pointerId: 1 })); await tick(0.6); assert.equal(window.__jm.finds.state('horn').stage, 'sounding'); testSvg.querySelector('#f-horn').dispatchEvent(new TestEvent('pointerup')); JOURNEY.back(); await tick(5);
console.log('ok: traveller wipes without finding; three mist thirds; all eleven hear timed horn; hold sounds, wide view and release; three Norns/stars/below tail; ship pennant/lamp; all-eleven landing/count/frame; overlays do not take pointers');

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
for (let i = 0; i < 3; i++) { rmKey('serpent'); await rmTick(); }
assert.equal(window.__jm.finds.state('serpent').stage, 'asleep');
for (let i = 0; i < 4; i++) { rmKey('beacon'); await rmTick(); }
assert.equal(window.__jm.finds.state('beacon').fire, 4);
rmKey('runestone'); await rmTick(); assert.equal(window.__jm.finds.state('runestone').read, true);
assert.ok(FD.bits.every(b => !b.live)); assert.equal(FD.flight, null); assert.equal(stepsFocus('horn', FIND_PLAY.focus.wide), false);
console.log('ok: reduced-motion Part A plays land immediately, memory remains readable for five seconds, no live bits/flights/focus, camera unchanged');
rmKey('tafl'); const rmCells = rmSheet.querySelectorAll('.tf-cell'); rmCells[17].dispatchEvent(new TestEvent('click')); rmCells[16].dispatchEvent(new TestEvent('click')); assert.equal(window.__jm.finds.state('tafl').game.moves, 2); closeSheet();
for (let i = 0; i < 3; i++) rmKey('mist'); rmKey('horn'); rmKey('horn');
for (let i = 0; i < 3; i++) { rmKey('well'); await rmTick(); rmKey('longship'); await rmTick(); }
assert.equal(window.__jm.finds.state('mist').lifted, true); assert.equal(window.__jm.finds.state('well').watered, 3); assert.equal(window.__jm.finds.state('longship').pennant, true); assert.equal(window.__jm.finds.state('horn').heard.length, 11);
assert.equal(FD.landed, 11); assert.equal(FD.all.done, true); assert.equal(rmTl.querySelector('.tl-count').textContent, 'All 11 found'); assert.ok(FD.bits.every(b => !b.live)); assert.equal(FD.flight, null);
console.log('ok: reduced-motion Part B game/reply, mist, horn, Norns, stars, pennant and all-eleven feedback land immediately with no bits, flights or camera change');
}
testPlays().catch(error => { console.error(error); process.exitCode = 1; });
