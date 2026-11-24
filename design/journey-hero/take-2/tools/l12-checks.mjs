// L12 pure geometry and real DOM-view code with a deterministic range/kerning model.
// Browser geometry is a separate exported gate for the external review machine.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { makeCamera, dot, EASE } from '../../../../public/journey/hero/engine.mjs';
import { SCREEN, frameAt } from '../stage.mjs';
import { corners } from '../kit.mjs';

const take = new URL('../', import.meta.url);
const read = p => fs.readFileSync(new URL(p, take), 'utf8').replace(/\r\n/g, '\n');
const near = (a, b, gate, eps = 1e-9) => assert.ok(Math.abs(a - b) <= eps, `${gate}: ${a} != ${b}`);
const box = (left, top, width, height) => ({ left, top, width, height, right: left + width, bottom: top + height });
const moved = (b, dx, dy) => box(b.left + dx, b.top + dy, b.width, b.height);

export function checkL12Groups({ ENTRANCE: e, staggerSpans, loaderAt, LOADER }) {
  assert.equal(e.stars, null, 'L4 entrance: star ring still runs');
  const groups = [
    { name: 'mark/nav', spans: [...e.mark, ...e.nav] },
    { name: 'name', spans: [6, 8].flatMap((n, i) => Array.from({ length: n }, (_, j) => [e.name.starts[i] + j * e.name.step, e.name.starts[i] + j * e.name.step + e.name.len])) },
    { name: 'lede', spans: Array.from({ length: 23 }, (_, i) => { const a = e.lede.start + i * e.lede.step + (i >= 3 ? e.lede.gap : 0); return [a, a + e.lede.len]; }) },
    { name: 'world', spans: [e.floor, e.screen, e.camera] },
    { name: 'crafts', spans: [...staggerSpans(e.crafts, e.crafts.lines), ...staggerSpans(e.crafts, e.crafts.lines).slice(0, 4).map(([a, b]) => [a + .18 * (b - a), a + .18 * (b - a) + e.crafts.rise])] },
    { name: 'foot', spans: e.foot },
  ];
  const times = new Set(Array.from({ length: Math.ceil(e.end * 60) + 1 }, (_, i) => i / 60));
  for (const g of groups) for (const at of g.cuts || g.spans.flat()) times.add(at);
  let maximum = 0;
  for (const time of [...times].sort((a, b) => a - b)) {
    const moving = groups.filter(g => g.cuts ? g.cuts.some(t => Math.abs(time - t) < 1e-10) : g.spans.some(([a, b]) => time >= a && time < b));
    maximum = Math.max(maximum, moving.length);
    assert.ok(moving.length <= 2, `L12 groups: ${moving.map(g => g.name).join(', ')} at ${time.toFixed(6)} s`);
  }
  const bounds = groups.map(g => g.cuts ? [g.cuts[0], g.cuts.at(-1)] : [Math.min(...g.spans.map(s => s[0])), Math.max(...g.spans.map(s => s[1]))]);
  for (let i = 1; i < groups.length; i++) {
    assert.ok(bounds[i][0] >= bounds[i - 1][0] && bounds[i][1] >= bounds[i - 1][1], `L12 groups: ${groups[i].name} out of reading order`);
  }
  // L5: measure from burst start, shifting every page group by the actual pure entrance boundary.
  // Include 60 Hz samples and every exact cut/span/loader boundary. No collision exemptions.
  const loader = loaderAt(0, { fonts: 0, atlas: 0, frame: 0 });
  const offset = loader.entranceStart - loader.burstStart;
  const combined = new Set(Array.from({ length: Math.ceil((offset + e.end) * 60) + 1 }, (_, i) => i / 60));
  for (const time of times) combined.add(offset + time);
  combined.add(0); combined.add(LOADER.burst); combined.add(offset);
  let withBurst = 0;
  for (const time of [...combined].sort((a, b) => a - b)) {
    // Snap only numerical boundary residue, so an end and a simultaneous cut cannot overlap by an ulp.
    const active = groups.filter(g => g.cuts ? g.cuts.some(t => Math.abs(time - offset - t) < 1e-10)
      : g.spans.some(([a, b]) => time >= offset + a - 1e-10 && time < offset + b - 1e-10));
    const burst = time >= 0 && time < LOADER.burst - 1e-10;
    const n = active.length + (burst ? 1 : 0);
    withBurst = Math.max(withBurst, n);
    assert.ok(n <= 2, `L5 groups: ${[...(burst ? ['burst'] : []), ...active.map(g => g.name)].join(', ')} at ${time.toFixed(6)} s from burst start`);
  }
  return { samples: times.size, maximum, combinedSamples: combined.size, withBurst };
}

export function checkL12World(E) {
  const original = frameAt(0, { first: true });
  const kept = (plane, p) => !plane || dot(plane, p) + plane[3] >= 0;
  let samples = 0;
  for (let n = 0; n <= 528; n++) {
    const time = n / 240, state = E.entranceAt(time);
    const pieces = E.liftPieces(original, state.screen), plane = E.screenPlane(state.screen);
    for (const pc of pieces) {
      assert.ok(corners(pc).every(p => !kept(plane, p)), `L12 floor clip: screen visible before 2.20 at ${time}`);
      if (pc.shadowP) assert.ok(corners({ ...pc, p: pc.shadowP }).every(p => !kept(plane, p)), 'L12 floor clip: shadow caster visible');
    }
    samples++;
  }
  for (let n = 0; n <= 312; n++) {
    const p = E.entranceAt(2.2 + n / 240).screen, dy = -4.5 * (1 - p);
    const specimen = { ...original[0], clip: [0.2, 0.7, -0.3, 1.1], carryClip: [0, -1, 0, 2], shadowP: [1, 2, 3] };
    const result = E.liftPieces([specimen], p)[0];
    near(result.p[1], specimen.p[1] + dy, 'L12 lift: piece');
    near(result.shadowP[1], 2 + dy, 'L12 lift: shadow');
    for (const key of ['clip', 'carryClip']) {
      for (const point of corners(specimen)) near(dot(result[key], [point[0], point[1] + dy, point[2]]) + result[key][3], dot(specimen[key], point) + specimen[key][3], 'L12 lift: attached plane');
    }
    samples++;
  }
  assert.strictEqual(E.liftPieces(original, E.entranceAt(3.5).screen), original, 'L12 lift: exact frameAt(0) at 3.50');
  const centre = [SCREEN.l + SCREEN.w / 2, SCREEN.b + SCREEN.h / 2, SCREEN.z];
  for (const [W, H, S] of [[1440, 900, 105.313735747], [390, 844, 48.887996143]]) {
    for (const [yaw, pitch] of [[0, 0], [7, -3]]) {
      const home = { W, H, S, cx: W * .7, cy: H * .6, cam: makeCamera(yaw, pitch), dpr: 1 };
      for (let n = 0; n <= 480; n++) {
        const p = E.entranceAt(1.9 + n / 240).camera, v = E.settleView(home, p, yaw, pitch);
        near(v.cx + v.S * dot(v.cam.r, centre), home.cx + S * dot(home.cam.r, centre), 'L12 camera: fixed screen x');
        near(v.cy - v.S * dot(v.cam.u, centre), home.cy - S * dot(home.cam.u, centre), 'L12 camera: fixed screen y');
        near(v.S, S * (.88 + .12 * p), 'L12 camera: scale');
        assert.equal(v.W, W); assert.equal(v.H, H); samples++;
      }
      assert.strictEqual(E.settleView(home, E.entranceAt(3.9).camera, yaw, pitch), home, 'L12 camera: exact home at 3.90');
    }
  }
  return samples;
}

// Deliberately kerned flow; an inline-block countermodel loses those pair adjustments.
function modelDOM({ inlineBlocks = false } = {}) {
  let playing = false, reads = 0;
  const nodes = [];
  const readLayout = () => { reads++; assert.ok(!playing, 'L12 frame: layout read during apply'); };
  const style = () => new Proxy({}, { set(target, key, value) {
    if (playing) assert.ok(['transform', 'clipPath', 'fontWeight'].includes(key), 'L12 frame: wrote ' + key);
    target[key] = value; return true;
  } });
  class Node {
    constructor(tag = 'span', b = box(0, 0, 0, 0)) {
      this.tagName = tag; this.nodeType = 1; this.childNodes = []; this.style = style(); this.dataset = {}; this.b = b; this.attrs = {}; this.className = '';
      this.classList = { add: c => this.classes(c, true), remove: c => this.classes(c, false) };
      nodes.push(this);
    }
    classes(c, add) { const classes = new Set(this.className.split(' ').filter(Boolean)); if (add) classes.add(c); else classes.delete(c); this.className = [...classes].join(' '); }
    append(...children) { for (const c of children) { c.remove?.(); this.childNodes.push(c); c.parentElement = this; } }
    before(c) { c.remove(); const p = this.parentElement, i = p.childNodes.indexOf(this); p.childNodes.splice(i, 0, c); c.parentElement = p; }
    remove() { if (!this.parentElement) return; const p = this.parentElement; p.childNodes.splice(p.childNodes.indexOf(this), 1); this.parentElement = null; }
    replaceWith(c) { const p = this.parentElement, i = p.childNodes.indexOf(this); c.remove(); p.childNodes.splice(i, 1, c); c.parentElement = p; this.parentElement = null; }
    setAttribute(k, v) { this.attrs[k] = v; }
    getAttribute(k) { return this.attrs[k]; }
    getBoundingClientRect() {
      readLayout();
      if (this.className.startsWith('entrance-') && this.className !== 'entrance-craft-mask') {
        const parent = this.parentElement.getBoundingClientRect();
        const dy = +(this.style.transform?.match(/translateY\(([-\d.]+)/)?.[1] || 0);
        return box(parent.left + (parseFloat(this.style.left) || 0), parent.top + (parseFloat(this.style.top) || 0) + dy,
          parseFloat(this.style.width) || parent.width, parseFloat(this.style.height) || parent.height);
      }
      return this.b;
    }
    querySelectorAll(sel) { return this.childNodes.filter(n => n.nodeType === 1).flatMap(n => [n, ...n.querySelectorAll(sel)]).filter(n => sel === 'path' ? n.tagName === 'path' : sel === 'a' ? n.tagName === 'a' : n.className.split(' ').includes(sel.slice(1))); }
    querySelector(sel) { return this.querySelectorAll(sel)[0]; }
    closest(sel) { return this.className.split(' ').includes(sel.slice(1)) ? this : this.parentElement?.closest(sel); }
  }
  const text = (parent, data, b, name = false) => {
    const n = { nodeType: 3, data, parentElement: parent, b, name }; parent.childNodes.push(n); return n;
  };
  const hero = new Node('main', box(0, 0, 1440, 900)), mark = new Node('a', box(64, 32, 60, 44)), nav = new Node('nav', box(1100, 40, 250, 22));
  const paths = ['#C0262E', '#F7F6F3', '#F7F6F3'].map(fill => { const p = new Node('path'); p.attrs.fill = fill; mark.append(p); return p; });
  const links = [new Node('a', box(1100, 40, 70, 22)), new Node('a', box(1250, 40, 70, 22))]; nav.append(...links);
  const name = new Node('h1'), lines = ['Danial', 'Endrawes'].map((data, i) => { const l = new Node('span', box(64, 170 + 100 * i, 480, 100)); l.className = 'name-line'; text(l, data, box(64, 182 + 100 * i, 480, 96), true); name.append(l); return l; });
  const lede = new Node('p', box(64, 390, 450, 120)); lede.className = 'hero-lede';
  text(lede, 'Hey, I’m Dan!', box(64, 391, 115, 22));
  const more = new Node('span'); more.className = 'hero-lede-more'; lede.append(more);
  text(more, 'Welcome to my portfolio, where I show how I go from first sketch to final cut, and everything in between.', box(64, 430, 450, 22));
  const rows = Array.from({ length: 4 }, (_, i) => { const li = new Node('li', box(64, 530 + 42 * i, 380, 42)); const b = new Node('button', box(64, 531 + 42 * i, 380, 41)); li.append(b); return li; });
  const footer = new Node('footer', box(64, 850, 1312, 24)), foot = [new Node('p', box(64, 852, 180, 20)), new Node('button', box(1320, 850, 56, 24))]; footer.append(...foot);
  hero.append(mark, nav, name, lede, ...rows, footer);
  const selectors = { '[data-mark]': mark, '[data-nav]': nav, '[data-lede]': lede, '[data-foot]': footer, '[data-cue]': foot[0], '[data-pause]': foot[1] };
  hero.querySelector = s => selectors[s];
  hero.querySelectorAll = s => s.includes('.name-line') ? lines : s === '[data-crafts] li' ? rows : [];
  rows.forEach(li => { li.querySelector = () => li.childNodes[0].tagName === 'button' ? li.childNodes[0] : li.childNodes[0].childNodes[0]; });
  const advance = (n, i, split = inlineBlocks) => {
    if (!n.name) return i * 7;
    return i * 52 - (split ? 0 : Math.max(0, i - 1) * 1.35);
  };
  function flowRect(n, a, b, split = inlineBlocks) {
    if (n.name) return box(n.b.left + advance(n, a, split), n.b.top, advance(n, b, split) - advance(n, a, split), n.b.height);
    const line = Math.floor(a / 42), x = a % 42;
    return box(n.b.left + x * 7, n.b.top + line * 27, (b - a) * 7, n.b.height);
  }
  const doc = {
    createElement: tag => new Node(tag),
    createTreeWalker(root) { const list = []; const walk = n => { for (const c of n.childNodes) { if (c.nodeType === 3) list.push(c); else walk(c); } }; walk(root); let i = -1; return { nextNode() { this.currentNode = list[++i]; return this.currentNode; } }; },
    createRange() { let n, a, b; return { setStart(node, i) { n = node; a = i; }, setEnd(_node, i) { b = i; }, getBoundingClientRect() { readLayout(); return flowRect(n, a, b); }, getClientRects() { return [this.getBoundingClientRect()]; } }; },
  };
  hero.ownerDocument = doc;
  return { hero, nodes, lines, lede, rows, paths, links, foot, nav, footer, flowRect, set playing(v) { playing = v; }, get reads() { return reads; } };
}

export function checkL12DOM(E, options) {
  const dom = modelDOM(options), view = E.createEntranceView(dom.hero);
  const inks = dom.lines.map(l => ({ top: l.b.top + 12, bottom: l.b.top + 90 }));
  let geo = view.measure(inks), samples = 0;
  assert.deepEqual(dom.lines.map(l => l.childNodes.filter(n => n.nodeType === 3).map(n => n.data).join('')), ['Danial', 'Endrawes'], 'L12 overlay: flow text unchanged');
  for (const [i, g] of geo.name.entries()) {
    assert.equal(g.letters.length, [6, 8][i], 'L12 overlay: character count');
    for (const [j, { el }] of g.letters.entries()) {
      const expected = dom.flowRect(dom.lines[i].childNodes[0], j, j + 1, false);
      const b = el.getBoundingClientRect();
      for (const key of ['left', 'top', 'width', 'height']) near(b[key], expected[key], 'L12 overlay: kerned landing ' + key, .5);
      assert.equal(el.childNodes.length, 0, 'L12 overlay: generated content only');
    }
    near(g.drop, 94, 'L12 masks: ink height +16');
    assert.ok(g.mask.includes('93.000px'), 'L12 masks: bottom ink +3');
  }
  assert.equal(geo.ledeWords.length, 23, 'L12 overlay: lede word count');
  assert.deepEqual(geo.ledeWords.at(-1).span, E.wordSpan(22, true), 'L12 overlay: reading order and second-part gap');
  for (let n = 0; n <= 276; n++) {
    const time = n / 60, before = dom.reads;
    dom.playing = true; view.apply(E.entranceAt(time)); dom.playing = false;
    assert.equal(dom.reads, before, 'L12 frame: no layout reads'); samples++;
    if (time === 0) {
      assert.equal(dom.paths[0].style.transform, 'translateY(830.000px)', 'L12 masks: mark distance');
      assert.equal(dom.nav.style.clipPath, 'inset(0 -40px)', 'L12 masks: fixed nav bar');
      assert.equal(dom.links[0].style.transform, 'translateY(28.000px)', 'L12 masks: nav top below bar +6');
      assert.equal(geo.masks[0].style.top, '-1.000px', 'L12 masks: lede top -2');
      assert.equal(geo.masks[0].style.height, '26.000px', 'L12 masks: lede bottom +2');
      assert.equal(dom.rows[0].childNodes[0].style.clipPath, 'inset(1.000px -40px 2.000px)', 'L12 masks: craft text clear of both lines');
    }
    if (time >= 1.75) assert.ok(geo.name.every(g => !g.overlay.parentElement && !g.line.className.includes('has-entrance')), 'L12 handover: name overlay not removed with flow restored');
    if (time >= 2.6) assert.ok(geo.masks.every(m => !m.parentElement) && !dom.lede.className.includes('has-entrance'), 'L12 handover: lede overlay not removed with flow restored');
  }
  assert.equal(view.lines, 0, 'L12 cleanup: exact held endpoint');
  view.clear();
  assert.equal(view.lines, 0, 'L12 cleanup: cached geometry');
  const live = n => n === dom.hero || (n.parentElement && live(n.parentElement));
  assert.ok(dom.nodes.filter(live).every(n => !n.className.startsWith('entrance-')), 'L12 cleanup: overlay remains');
  for (const el of [...dom.paths, ...dom.links, ...dom.foot, ...dom.rows.map(li => li.childNodes[0])]) assert.equal(el.style.transform || '', '', 'L12 cleanup: transform remains');
  for (const el of [...dom.lines, dom.lede, dom.nav, dom.footer, ...dom.rows]) assert.equal(el.style.clipPath || '', '', 'L12 cleanup: clip remains');
  geo = view.measure(inks); view.apply(E.entranceAt(.2)); view.clear();
  assert.ok(geo.name.every(g => !g.overlay.parentElement), 'L12 cleanup: resize/hold rebuild');
  return samples;
}

export async function checkL12(E, { entranceSource = read('entrance.mjs'), playerSource = read('play.mjs') } = {}) {
  let curves = 0;
  for (let n = 0; n <= 240; n++) {
    const p = n / 240;
    near(E.quintOut(p), 1 - (1 - p) ** 5, 'L12 curves: quint');
    near(E.quartOut(p), 1 - (1 - p) ** 4, 'L12 curves: quart');
    near(E.cubicOut(p), 1 - (1 - p) ** 3, 'L12 curves: weight');
    const state = E.entranceAt(1.9 + 2 * p);
    near(state.camera, 1 - (1 - p) ** 4, 'L12 curves: camera clock');
    const name = E.riseAt(.3 + .85 * p, E.nameSpan(0, 0));
    near(name.reveal, E.quintOut(p), 'L12 curves: letter rise'); near(name.weight, 300 + 500 * E.cubicOut(p), 'L12 curves: letter weight');
    near(E.entranceAt(1.9 + p).floor, EASE.wipe(p), 'L12 curves: floor wipe'); curves++;
  }
  assert.ok(playerSource.includes('layout.cover(base, need)') && playerSource.includes('settleView(base, state.camera') && playerSource.includes('liftPieces(frameNow(), state.screen)'), 'L12 integration: home coverage, camera and lift');
  assert.ok(!/MOCK_SPEED|mock-a-speed|Slow motion/.test(entranceSource + playerSource), 'L12 integration: mock review aids');
  const shader = read('sq.mjs');
  for (const pass of ['depth', 'piece', 'flat']) assert.ok(shader.includes(`gl.uniform4fv(${pass}.u.uReveal, reveal)`), 'L12 floor clip: shared ' + pass + ' pass');
  return { curves, world: checkL12World(E), dom: checkL12DOM(E) };
}

async function load(source) {
  const url = new URL('entrance.mjs', take);
  return import('data:text/javascript;base64,' + Buffer.from(source.replace(/from (['"])(\.{1,2}\/[^'"]+)\1/g, (_, q, ref) => `from '${new URL(ref, url).href}'`)).toString('base64'));
}

export async function checkL12Controls() {
  const E = await load(read('entrance.mjs')), results = [];
  const attempt = async (id, gate, fn) => {
    let message;
    try { await fn(); } catch (e) { message = e.message.split('\n')[0]; }
    assert.ok(message?.startsWith(gate), `${id} control missed: ${message}`); results.push({ id, gate, message });
  };
  const camera = await load(read('entrance.mjs').replace('camera: [1.9, 3.9]', 'camera: [1.9, 4.1]'));
  await attempt('camera-to-4.10', 'L12 groups:', () => checkL12Groups(camera));
  await attempt('inline-block-kerning', 'L12 overlay:', () => checkL12DOM(E, { inlineBlocks: true }));
  const noClip = await load(read('entrance.mjs').replace('return p >= 1 ? null : [0, 1, 0, 0];', 'return null;'));
  await attempt('lift-without-floor-clip', 'L12 floor clip:', () => checkL12World(noClip));
  return results;
}

// External browser gate. Does not capture images or run the pixel gate. Pass a Playwright Browser.
// The caller owns installing/launching it on the review machine, never on this restricted PC.
export async function checkL12Browser(browser, previewPath, { controls = false } = {}) {
  const results = [];
  for (const [width, height] of [[1440, 900], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'no-preference' });
    try {
      await page.goto(pathToFileURL(previewPath).href + '?t=0'); await page.waitForFunction(() => window.__ready);
      const result = await page.evaluate(() => {
        const h = window.__hero, q = s => document.querySelector(s), rect = n => { const r = n.getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; };
        const flow = () => {
          const r = document.createRange(), name = [...document.querySelectorAll('.name-line')].map(line => {
            const n = line.firstChild; return Array.from(n.data, (_, i) => { r.setStart(n, i); r.setEnd(n, i + 1); return rect(r); });
          });
          const words = [], walker = document.createTreeWalker(q('[data-lede]'), 4);
          while (walker.nextNode()) for (const m of walker.currentNode.data.matchAll(/\S+/g)) { r.setStart(walker.currentNode, m.index); r.setEnd(walker.currentNode, m.index + m[0].length); words.push(rect(r)); }
          return { name, words };
        };
        const selectors = ['[data-mark]', '[data-nav]', '.name-line', '[data-lede]', '[data-crafts] li', '[data-cue]', '[data-pause]'];
        const boxes = () => selectors.flatMap(s => [...document.querySelectorAll(s)].map(rect));
        const expected = flow(), rest = boxes(), errors = [], compare = (a, b, label) => {
          if (a.length !== b.length || a.some((n, i) => Math.abs(n - b[i]) > .5)) errors.push(label + ': ' + JSON.stringify([a, b]));
        };
        for (const [i, end] of [[0, 1.425], [1, 1.735]]) {
          h.entrance(end - 1e-5);
          const letters = [...document.querySelectorAll('.name-line')][i].querySelectorAll('.entrance-letter');
          if (letters.length !== expected.name[i].length) errors.push('L12 overlay: missing letters');
          letters.forEach((el, j) => compare(rect(el), expected.name[i][j], 'L12 overlay: letter ' + i + '/' + j));
          h.entrance(end + 1e-8);
          if ([...document.querySelectorAll('.name-line')][i].querySelector('.entrance-name')) errors.push('L12 handover: name');
        }
        h.entrance(2.586 - 1e-5);
        const words = [...document.querySelectorAll('.entrance-word')];
        if (words.length !== expected.words.length) errors.push('L12 overlay: missing words');
        words.forEach((el, i) => compare(rect(el), expected.words[i], 'L12 overlay: word ' + i));
        h.entrance(2.586 + 1e-8);
        if (q('.entrance-lede-line')) errors.push('L12 handover: lede');
        h.entrance(4.6);
        if (document.querySelector('[class*="entrance-"], .has-entrance')) errors.push('L12 cleanup: held endpoint');
        h.entrance(null);
        boxes().forEach((b, i) => compare(b, rest[i], 'L12 cleanup: box ' + i));
        if (document.querySelector('[class*="entrance-"], .has-entrance')) errors.push('L12 cleanup: overlay');
        for (const sel of [...selectors, '[data-mark] path', '[data-nav] a', '[data-crafts] button']) for (const el of document.querySelectorAll(sel)) {
          if (el.style.transform || el.style.clipPath || el.style.fontWeight) errors.push('L12 cleanup: inline style ' + sel);
        }
        return { letters: expected.name.flat().length, words: expected.words.length, boxes: rest.length, errors };
      });
      assert.deepEqual(result.errors, [], 'L12 browser geometry/cleanup: ' + width + 'x' + height);
      if (controls) {
        // The fault actually splits the flow into inline blocks, losing kerning. Compare to its own prior flow.
        const fault = await page.evaluate(() => {
          const range = document.createRange(), differences = [];
          for (const line of document.querySelectorAll('.name-line')) {
            const text = line.firstChild;
            const before = Array.from(text.data, (_, i) => { range.setStart(text, i); range.setEnd(text, i + 1); const r = range.getBoundingClientRect(); return [r.left, r.width]; });
            const spans = Array.from(text.data, ch => { const s = document.createElement('span'); s.textContent = ch; s.style.display = 'inline-block'; return s; });
            text.replaceWith(...spans);
            spans.forEach((span, i) => { range.selectNodeContents(span); const r = range.getBoundingClientRect(); differences.push(Math.abs(r.left - before[i][0]), Math.abs(r.width - before[i][1])); });
          }
          return Math.max(...differences);
        });
        assert.ok(fault > .5, 'L12 overlay: inline-block negative control did not fail the .5 px gate');
      }
      results.push({ width, height, ...result, browserControl: controls ? 'caught at L12 overlay' : 'not run' });
    } finally { await page.close(); }
  }
  return results;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(await checkL12(await load(read('entrance.mjs')))));
  if (process.argv.includes('--controls')) console.log(JSON.stringify(await checkL12Controls()));
}
