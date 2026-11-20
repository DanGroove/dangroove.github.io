// H9/H10: real layout logic in a CSSOM model, and projected geometry. No browser.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateRawSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { HOME, dot } from '../../../../public/journey/hero/engine.mjs';
import * as current from '../stage.mjs';
import { corners } from '../kit.mjs';
import { createPageLayout } from '../page-layout.mjs';
import { sideGutter, sceneEnvelope, equivalent } from '../view.mjs';
import { fitCalloutView, labelLayout } from '../labels.mjs';
import { BROWSER_SIZES } from './browser-check.mjs';
import { visibleProjection, polygonsOverlap } from './correction-checks.mjs';

const take = new URL('../', import.meta.url);
import { handPatch } from './hand-patch.mjs';
const fixture = JSON.parse(fs.readFileSync(new URL('fixtures/round5-addendum-source.json', import.meta.url)));
const sha = source => createHash('sha256').update(source).digest('hex');
const close = (a, b, message, epsilon = 0.01) => assert.ok(Math.abs(a - b) <= epsilon, `${message}: ${a} != ${b}`);
const source = file => fs.readFileSync(new URL(file, take), 'utf8');
const decode = record => {
  const bytes = inflateRawSync(Buffer.from(record.deflateBase64, 'base64'));
  assert.equal(sha(bytes), record.sha256, 'incoming fixture hash');
  return bytes.toString('utf8');
};
const moduleURL = (code, file, replacements = {}) => 'data:text/javascript;base64,' + Buffer.from(code.replace(/from (['"])([^'"]+)\1/g, (_, q, ref) => 'from ' + q + (replacements[ref] || new URL(ref, new URL(file, take)).href) + q)).toString('base64');
const widthsFor = module => {
  const widths = { small: {}, large: {} };
  let start = 0;
  for (const scene of module.SHOW) {
    const time = start + (scene.key === 'id' ? module.SCRIPTS.id.actions.find(a => a.id === 'export').end + 0.41 : scene.still);
    for (const c of module.calloutsAt(time)) for (const [key, size] of [['small', 9], ['large', 11]]) widths[key][c.id] = c.words.length * size * 0.75;
    start += scene.len;
  }
  return widths;
};

// Exercise createPageLayout itself, including ink traversal and cover(), while modeling CSS
// boxes and glyph metrics. This deliberately does not claim real font/DOM measurements.
function layoutModel(factory, need, fit, widths, W, H, serialise = value => Math.floor(parseFloat(value) * 64) / 64 + 'px') {
  let width = W, height = H;
  const style = (shorten = false) => {
    const values = {};
    const s = { setProperty(key, value) { values[key] = value; }, removeProperty(key) { delete values[key]; }, getPropertyValue(key) { return values[key] || ''; } };
    for (const key of ['left', 'width']) Object.defineProperty(s, key, { get: () => values[key] || '', set: value => { values[key] = shorten ? serialise(value) : value; } });
    return s;
  };
  const rect = (left, top, w, h) => ({ left, top, right: left + w, bottom: top + h, width: w, height: h });
  const textEdge = () => ({ 768: 315, 1024: 408, 1440: 529, 1920: 531 }[width] || sideGutter(width) + Math.min(468, 0.36 * width - 1));
  const heroStyle = style();
  function node(kind = 'line') {
    const n = { kind, style: style(), children: [], replaceChildren(...children) { this.children = children; } };
    Object.defineProperty(n, 'textContent', { set(value) { this.children = [{ data: value, length: value.length, parentElement: this }]; } });
    n.getBoundingClientRect = () => {
      const rise = parseFloat(heroStyle.getPropertyValue('--say-rise')) || 0;
      const shift = parseFloat(n.style.getPropertyValue('--name-ink-shift')) || 0;
      const top = kind === 'lede' ? height / 2 + 30 : kind === 'number' ? height / 2 + 90 : height / 2 - 80;
      return rect(sideGutter(width) + shift, top - rise, textEdge() - sideGutter(width), 20);
    };
    n.textContent = 'X';
    return n;
  }
  const name = node('name'), lede = node('lede'), number = node('number'), crafts = node('crafts');
  name.innerHTML = 'D<br>E';
  const doc = {
    createElement(tag) { return tag === 'canvas' ? { getContext: () => ({ measureText: () => ({ fontBoundingBoxAscent: 15, fontBoundingBoxDescent: 5, actualBoundingBoxAscent: 15, actualBoundingBoxDescent: 5, actualBoundingBoxLeft: 0, actualBoundingBoxRight: textEdge() - sideGutter(width) }) }) } : node(); },
    createTreeWalker(n) {
      const texts = [], visit = n => { if ('data' in n) texts.push(n); else n.children.forEach(visit); }; visit(n);
      let i = 0; return { nextNode() { this.currentNode = texts[i++]; return this.currentNode; } };
    },
    createRange() { return { setStart(text) { this.text = text; }, setEnd() {}, getBoundingClientRect() { return this.text.parentElement.getBoundingClientRect(); } }; },
  };
  const hero = { ownerDocument: doc, style: heroStyle, querySelector: selector => ({ '[data-name]': name, '[data-lede]': lede, '[data-crafts]': crafts, '[data-mark]': { getBoundingClientRect: () => rect(40, 32, 40, 44) } })[selector], querySelectorAll: () => [number], getBoundingClientRect: () => rect(0, 0, width, height) };
  const stageStyle = style(true);
  const stage = { style: stageStyle, getBoundingClientRect() {
    const phoneHeights = { '390x664': 240, '390x844': 396, '360x780': 366.6, '375x667': 313.49, '412x915': 430.05 };
    const phone = width < 720, baseWidth = phone ? width : width * 0.56 - sideGutter(width);
    return rect(parseFloat(stageStyle.left) || (phone ? 0 : width * 0.44), phone ? 64 : 88, parseFloat(stageStyle.width) || baseWidth, phone ? (phoneHeights[width + 'x' + height] || Math.max(240, height * 0.47)) : Math.max(height, 640) - 160);
  } };
  const layout = factory(hero, stage, { measure() {}, fit: (view, need, left) => fit(view, need, left, widths) });
  return {
    resize(w, h) { width = w; height = h; },
    sample() {
      const m = layout.measure(), view = layout.view(need, HOME, 1);
      layout.cover(view, need);
      return { S: view.S, cx: view.cx, cy: view.cy, box: ['left', 'top', 'width', 'height'].map(key => m.b[key]) };
    },
  };
}

// Distance between convex projected outlines, including clipped thickness and containment.
const cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
function hull(points) {
  const sorted = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const half = list => { const h = []; for (const p of list) { while (h.length > 1 && cross(h.at(-2), h.at(-1), p) <= 1e-10) h.pop(); h.push(p); } return h; };
  return [...half(sorted).slice(0, -1), ...half(sorted.reverse()).slice(0, -1)];
}
function pointSegment(p, a, b) {
  const d = b.map((v, i) => v - a[i]), length = d[0] ** 2 + d[1] ** 2;
  const u = length ? Math.max(0, Math.min(1, d.reduce((sum, v, i) => sum + v * (p[i] - a[i]), 0) / length)) : 0;
  return Math.hypot(...p.map((v, i) => v - a[i] - u * d[i]));
}
function pointPolygon(p, poly) {
  const sides = poly.map((a, i) => cross(a, poly[(i + 1) % poly.length], p));
  if (sides.every(v => v >= -1e-10) || sides.every(v => v <= 1e-10)) return 0;
  return Math.min(...poly.map((a, i) => pointSegment(p, a, poly[(i + 1) % poly.length])));
}
function polygonGap(a, b) {
  if (polygonsOverlap(a, b)) return 0;
  return Math.min(...a.map(p => pointPolygon(p, b)), ...b.map(p => pointPolygon(p, a)));
}

export function laptopClearance(module) {
  const start = module.SHOW.slice(0, 5).reduce((n, s) => n + s.len, 0), duration = module.SHOW[5].len;
  const widths = widthsFor(module).large, view = { W: 1440, H: 900, S: 103.6, cx: 0, cy: 0, cam: HOME };
  let minimumGap = Infinity, minimumRing = Infinity, gapAt, ringAt, samples = 0, laptopSamples = 0, ringSamples = 0;
  const rows = [];
  // Integer steps avoid accumulated drift; include the last instant before the scene changes.
  const times = [...Array.from({ length: Math.ceil(duration / 0.02) }, (_, i) => i * 0.02), duration - 1e-7];
  for (const at of times) {
    const P = module.frameAt(start + at);
    // The actual shell is P[0]. Include all its visible app furniture/art too, conservatively
    // taking their convex outline; the independent cursor is excluded.
    const screen = hull(P.filter(pc => pc.where !== 'floor' && pc.art !== 'cursor').flatMap(pc => visibleProjection(pc)));
    let gap = Infinity;
    for (const pc of P.filter(pc => pc.deviceKind === 'laptop')) {
      const outline = visibleProjection(pc);
      if (outline.length >= 3) gap = Math.min(gap, polygonGap(outline, screen) * view.S);
    }
    if (Number.isFinite(gap)) { laptopSamples++; if (gap < minimumGap) { minimumGap = gap; gapAt = start + at; } }
    const labels = module.calloutsAt(start + at), c = labels.find(c => c.words === 'Laptop');
    let ring = Infinity;
    if (c) {
      const geometry = labelLayout(labels, P, view, widths, [], false, start + at).find(c => c.words === 'Laptop');
      const point = [dot(HOME.r, c.mark), dot(HOME.u, c.mark)];
      ring = pointPolygon(point, screen) * view.S - geometry.radius - geometry.stroke / 2;
      ringSamples++;
      if (ring < minimumRing) { minimumRing = ring; ringAt = start + at; }
    }
    rows.push({ at, global: start + at, gap: Number.isFinite(gap) ? gap : null, ring: Number.isFinite(ring) ? ring : null });
    samples++;
  }
  return { samples, laptopSamples, ringSamples, S: view.S, minimumGap, gapAt, minimumRing, ringAt, rows };
}

export async function checkRound5Addendum({ only = '', control = '' } = {}) {
  assert.equal(fixture.sources['stage.mjs'].sha256, '8bfd42a687f780f6e224f09a6a46c6fcb276b925745fc63c2ea2337ce7336cc8');
  assert.equal(fixture.sources['page-layout.mjs'].sha256, '3ad80e6ae74572a36079a9a050f8b54159f3794adb4209d5d1e61175f8b6eed1');
  // CORRECTIONS-7: the frozen incoming stage gets round 7's hand edit in memory, so H10 still proves nothing else moved.
  const oldStageURL = moduleURL(handPatch(decode(fixture.sources['stage.mjs'])), 'stage.mjs');
  const incoming = await import(oldStageURL), incomingLabels = await import(moduleURL(source('labels.mjs'), 'labels.mjs', { './stage.mjs': oldStageURL }));
  const need = sceneEnvelope(current.SCENES, corners, dot, HOME), beforeNeed = sceneEnvelope(incoming.SCENES, corners, dot, HOME);
  const report = { computedOnly: true, beforeEnvelope: beforeNeed, afterEnvelope: need };
  if (!only || only === 'H9') {
    let factory = createPageLayout;
    if (control === 'H9') {
      const search = "for (const key of ['left', 'width']) stage.style.removeProperty(key);";
      const replace = "for (const key of ['left', 'width']) if (stage.style[key] === target[key]) stage.style.removeProperty(key);";
      assert.equal(source('page-layout.mjs').split(search).length - 1, 1, 'H9 control one-site match');
      factory = (await import(moduleURL(source('page-layout.mjs').replace(search, replace), 'page-layout.mjs'))).createPageLayout;
    }
    const previousStyle = Object.getOwnPropertyDescriptor(globalThis, 'getComputedStyle');
    globalThis.getComputedStyle = () => ({ fontWeight: '800', fontSize: '20px', fontFamily: 'Outfit' });
    try {
      const widths = widthsFor(current), sizes = [];
      let measurements = 0;
      const stable = (a, b, context) => { for (const key of ['S', 'cx', 'cy']) close(a[key], b[key], 'H9 repeated measurement ' + context + '/' + key); a.box.forEach((n, i) => close(n, b.box[i], 'H9 repeated measurement ' + context + '/box' + i)); };
      const oldFactory = (await import(moduleURL(decode(fixture.sources['page-layout.mjs']), 'page-layout.mjs'))).createPageLayout;
      const round4 = JSON.parse(fs.readFileSync(new URL('fixtures/round5-source.json', import.meta.url)));
      const round4URL = moduleURL(decode(round4), 'stage.mjs'), prior = await import(round4URL);
      const priorLabels = await import(moduleURL(decode(round4.labels), 'labels.mjs', { './stage.mjs': round4URL }));
      const priorNeed = sceneEnvelope(prior.SCENES, corners, dot, HOME);
      for (const [W, H] of BROWSER_SIZES) {
        let final;
        // Exact storage, shorter decimal storage and Chromium-like 1/64 px quantisation.
        for (const serialise of [value => Math.floor(parseFloat(value) * 64) / 64 + 'px', value => value, value => Number(parseFloat(value).toFixed(3)) + 'px']) {
          const model = layoutModel(factory, need, fitCalloutView, widths, W, H, serialise);
          const first = model.sample(); measurements++;
          for (let i = 0; i < 10; i++) { final = model.sample(); measurements++; stable(first, final, W + 'x' + H + '/call' + (i + 1)); }
          model.resize(W + 37, H + 31); model.sample(); measurements++;
          model.resize(W, H); final = model.sample(); measurements++; stable(first, final, W + 'x' + H + '/away-back');
        }
        const old = layoutModel(oldFactory, beforeNeed, incomingLabels.fitCalloutView, widthsFor(incoming), W, H);
        const incomingFirst = old.sample(); let incomingTenth;
        for (let i = 0; i < 10; i++) incomingTenth = old.sample();
        const before = layoutModel(createPageLayout, beforeNeed, incomingLabels.fitCalloutView, widthsFor(incoming), W, H).sample();
        // Round four used the CSS box's centre, without H6's text-ink centring.
        const legacyFit = (view, envelope, left, words) => priorLabels.fitCalloutView({ ...view, cx: W < 720 ? view.cx : W * 0.44 + (W * 0.56 - sideGutter(W)) / 2 - view.S * envelope.x }, envelope, left, words);
        const round4View = layoutModel(createPageLayout, priorNeed, legacyFit, widthsFor(prior), W, H).sample();
        assert.ok(final.S >= round4View.S * 0.98, 'H9 scale loss exceeds 2% in CSS/word model');
        sizes.push({ W, H, round4S: round4View.S, incomingFirstS: incomingFirst.S, incomingTenthS: incomingTenth.S, beforeH10S: before.S, afterS: final.S, box: final.box });
      }
      report.H9 = { measurements, sizes, limits: 'CSS stage/word model only; actual font obstacles and browser sizes remain external' };
    } finally {
      if (previousStyle) Object.defineProperty(globalThis, 'getComputedStyle', previousStyle); else delete globalThis.getComputedStyle;
    }
  }
  if (!only || only.startsWith('H10')) {
    let module = current;
    if (control === 'H10') {
      const search = 'forward: 0.4', code = source('stage.mjs');
      assert.equal(code.split(search).length - 1, 1, 'H10 control one-site match');
      module = await import(moduleURL(code.replace(search, 'forward: 0'), 'stage.mjs'));
    }
    const before = laptopClearance(incoming), after = laptopClearance(module);
    if (only !== 'H10-ring') assert.ok(after.minimumGap >= 12, `H10 projected gap: ${after.minimumGap.toFixed(6)} px at ${after.gapAt.toFixed(6)}s < 12 px`);
    if (only !== 'H10-gap') assert.ok(after.minimumRing > 0, `H10 Laptop ring: ${after.minimumRing.toFixed(6)} px clearance at ${after.ringAt.toFixed(6)}s`);
    assert.ok(after.laptopSamples > 100 && after.ringSamples > 100, 'H10 sweep missed visible devices/labels');
    // Every emitted piece except the authorised Figma floor translation remains as incoming.
    let preservedFrames = 0;
    for (let t = 0; t < current.LOOP; t += 0.25) {
      const P = current.frameAt(t), old = incoming.frameAt(t);
      const expected = old.map(pc => pc.where === 'floor' && incoming.sceneAt(t).scene.key === 'fig' ? { ...pc, p: pc.p.map((n, i) => n + (i === 2 ? current.UI_ROW.forward : 0)), ...(pc.clip ? { clip: pc.clip.map((n, i) => n - (i === 3 ? current.UI_ROW.forward : 0)) } : {}) } : pc);
      equivalent([...P], expected, 'H10 retained round-5 pieces');
      for (const key of ['clock', 'action', 'pressed', 'tool']) equivalent(P[key], old[key], 'H10 retained round-5 ' + key);
      preservedFrames++;
    }
    report.H10 = { forward: current.UI_ROW.forward, preservedFrames, before, after };
  }
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const option = name => process.argv.find(a => a.startsWith('--' + name + '='))?.split('=')[1];
  const report = await checkRound5Addendum({ only: option('only'), control: option('control') });
  const out = option('out');
  if (out) {
    const target = path.resolve(out), allowed = fileURLToPath(new URL('../.scratch/corrections5-addendum/', import.meta.url));
    assert.ok(target.startsWith(allowed) && target.endsWith('.json'), 'output must stay in .scratch/corrections5-addendum/');
    fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, JSON.stringify(report, null, 2) + '\n');
  }
  if (report.H10) for (const phase of ['before', 'after']) { const { rows, ...summary } = report.H10[phase]; report.H10[phase] = summary; }
  console.log(JSON.stringify(report, null, 2));
}
