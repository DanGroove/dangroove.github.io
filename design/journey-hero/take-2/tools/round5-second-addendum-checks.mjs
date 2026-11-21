// H11/H12: exercise the actual layout function and the browser assertions without a browser.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPageLayout } from '../page-layout.mjs';
import { HOME, dot } from '../../../../public/journey/hero/engine.mjs';
import { SCENES } from '../stage.mjs';
import { corners } from '../kit.mjs';
import { sceneEnvelope, sideGutter } from '../view.mjs';
import {
  ROUND5_LAYOUT_SIZES,
  checkCraftColumns,
  checkSceneTextEdge,
  checkResizeStep,
} from './browser-check.mjs';

export const SECOND_ADDENDUM_CONTROLS = [
  {
    id: 'H11',
    search: `    for (const number of numbers) {
      const column = number.getBoundingClientRect().left;
      // Only the text's first column shares the lede's ink edge; other columns keep their own start.
      const left = Math.abs(column - craftLeft) <= 1 ? lede.left : column;
      number.style.setProperty('--name-ink-shift', \`\${left - ink(number).left}px\`);
    }`,
    replacement: "    for (const number of numbers) number.style.setProperty('--name-ink-shift', `${lede.left - ink(number).left}px`);",
    gate: 'H11 overlapping numbers',
  },
  {
    id: 'H12',
    search: '    const textRight = Math.max(text[0].right, ledeNode.getBoundingClientRect().right, crafts.getBoundingClientRect().right) - h.left;',
    replacement: '    const textRight = Math.max(...text.map(r => r.right)) - h.left;',
    gate: 'H6 resize step (H12 wrapping continuity)',
  },
];

const rect = (left, top, width, height) => ({
  left, top, right: left + width, bottom: top + height, width, height,
});

// The four real number/label pairs, two-column phone grid, glyph bearings and one lede
// rewrap are modeled here. These are deterministic stand-ins, not Outfit measurements.
function layoutModel(factory, width, height) {
  const origin = { left: 17, top: 11 };
  const phone = () => width < 720;
  const gutter = () => phone() ? 16 : sideGutter(width);
  const left = () => origin.left + gutter();
  const sayWidth = () => phone() ? width - 32 : width * 0.36;
  const style = () => {
    const values = {};
    return {
      setProperty(key, value) { values[key] = value; },
      getPropertyValue(key) { return values[key] || ''; },
      removeProperty(key) { delete values[key]; },
    };
  };
  const heroStyle = style();
  const rise = () => parseFloat(heroStyle.getPropertyValue('--say-rise')) || 0;
  const top = () => origin.top + height / 2 - 140 - rise();
  function node(kind, text = '', index = 0) {
    const n = { kind, index, style: style(), children: [] };
    Object.defineProperty(n, 'textContent', {
      set(value) { this.children = [{ data: value, length: value.length, parentElement: this }]; },
    });
    n.textContent = text;
    n.replaceChildren = (...children) => {
      n.children = children;
      children.forEach((child, i) => { child.kind = 'line'; child.index = i; });
    };
    n.advance = () => {
      if (n.kind === 'line') return Math.min(466.7, width * 0.31) / 8;
      // Reproduce the supplied 357 -> 396 ink-edge change at 990 -> 1000 wide.
      if (n.kind === 'lede') return Math.min(sayWidth(), (width < 1000 ? 357 : 396) - gutter()) + 0.4;
      return 6;
    };
    n.getBoundingClientRect = () => {
      const shift = parseFloat(n.style.getPropertyValue('--name-ink-shift')) || 0;
      const columnWidth = (sayWidth() - 16) / 2;
      const column = phone() ? n.index % 2 : 0;
      const row = phone() ? Math.floor(n.index / 2) : n.index;
      const buttonLeft = left() + column * (columnWidth + 16);
      if (n.kind === 'number') return rect(buttonLeft + shift, top() + 230 + row * 44, 19.2, 18);
      if (n.kind === 'label') return rect(buttonLeft + 33.2, top() + 230 + row * 44, text.length * 6, 18);
      if (n.kind === 'button') return rect(buttonLeft, top() + 220 + row * 44, phone() ? columnWidth : Math.min(380, sayWidth()), 40);
      if (n.kind === 'line') return rect(left() + shift, top() + n.index * 60, n.advance() * n.children[0].length, 56);
      if (n.kind === 'lede') return rect(left(), top() + 170, Math.min(450, sayWidth()), 40);
      if (n.kind === 'crafts') return rect(left(), top() + 220, phone() ? sayWidth() : Math.min(380, sayWidth()), phone() ? 84 : 172);
      return rect(left(), top(), sayWidth(), 116);
    };
    return n;
  }
  const name = node('name'), lede = node('lede', 'L'), crafts = node('crafts');
  name.innerHTML = 'Danial<br>Endrawes';
  const buttons = ['Graphic design', 'Video', 'Motion', 'UX/UI'].map((text, i) => {
    const button = node('button', '', i);
    button.children = [node('number', '0' + (i + 1), i), node('label', text, i)];
    return button;
  });
  crafts.children = buttons;
  const numbers = buttons.map(button => button.children[0]);
  const doc = {
    createElement(tag) {
      if (tag !== 'canvas') return node('line');
      const context = {
        measureText() {
          const advance = Number(this.font.split(' ')[1].replace('px', ''));
          const bearing = this.font.endsWith('model-line') ? 5.6 : 0.6;
          return { fontBoundingBoxAscent: 14, fontBoundingBoxDescent: 4, actualBoundingBoxLeft: -bearing, actualBoundingBoxRight: advance - 1, actualBoundingBoxAscent: 14, actualBoundingBoxDescent: 0 };
        },
      };
      return { getContext: () => context };
    },
    createTreeWalker(n) {
      const texts = [];
      const visit = child => 'data' in child ? texts.push(child) : child.children.forEach(visit);
      visit(n);
      let i = 0;
      return { nextNode() { this.currentNode = texts[i++]; return this.currentNode; } };
    },
    createRange() {
      return {
        setStart(text, offset) { this.text = text; this.offset = offset; },
        setEnd() {},
        getBoundingClientRect() {
          const n = this.text.parentElement, r = n.getBoundingClientRect();
          return rect(r.left + this.offset * n.advance(), r.top, n.advance(), 18);
        },
      };
    },
  };
  const hero = {
    ownerDocument: doc, style: heroStyle,
    querySelector: selector => ({ '[data-name]': name, '[data-lede]': lede, '[data-crafts]': crafts, '[data-mark]': { getBoundingClientRect: () => rect(origin.left + 40, origin.top + 32, 40, 44) } })[selector],
    querySelectorAll: () => numbers,
    getBoundingClientRect: () => rect(origin.left, origin.top, width, height),
  };
  const stage = {
    style: style(),
    getBoundingClientRect: () => rect(origin.left + width * 0.44, origin.top + 88, width * 0.56 - gutter(), Math.max(height, 640) - 160),
  };
  const need = sceneEnvelope(SCENES, corners, dot, HOME);
  // Isolate layout/centring from label fitting, which has its own retained 555-sample suite.
  const layout = factory(hero, stage, { measure() {}, fit: view => view });
  return {
    computedStyle: n => ({ fontWeight: n.kind === 'line' ? '800' : '300', fontSize: n.advance() + 'px', fontFamily: 'model-' + n.kind }),
    resize(w, h) { width = w; height = h; },
    sample() {
      const m = layout.measure(), view = layout.view(need, HOME, 1);
      const craftBox = crafts.getBoundingClientRect();
      return {
        ...m, craftBox,
        crafts: buttons.map((button, i) => ({ ink: m.numberInks[i], button: button.getBoundingClientRect(), label: button.children[1].getBoundingClientRect() })),
        textEdgeRight: Math.max(m.text[0].right, lede.getBoundingClientRect().right, craftBox.right) - origin.left,
        S: view.S,
        left: view.cx + view.S * (need.x - need.w / 2 + 0.25),
        right: view.cx + view.S * (need.x + need.w / 2 - 0.25),
      };
    },
  };
}

export async function checkRound5SecondAddendum({ only = '', control = '' } = {}) {
  let factory = createPageLayout;
  if (control) {
    const edit = SECOND_ADDENDUM_CONTROLS.find(c => c.id === control);
    assert.ok(edit, 'unknown control');
    const url = new URL('../page-layout.mjs', import.meta.url);
    const source = fs.readFileSync(url, 'utf8').replace(/\r\n/g, '\n');
    assert.equal(source.split(edit.search).length - 1, 1, control + ': exact edit must match one site');
    const code = source.replace(edit.search, edit.replacement).replace("'./view.mjs'", JSON.stringify(new URL('../view.mjs', import.meta.url).href));
    factory = (await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'))).createPageLayout;
  }
  const previousStyle = Object.getOwnPropertyDescriptor(globalThis, 'getComputedStyle');
  let craftSamples = 0, resizeSamples = 0, maxStep = 0, wrapStep = 0;
  const model = (w, h) => {
    const m = layoutModel(factory, w, h);
    globalThis.getComputedStyle = m.computedStyle;
    return m;
  };
  try {
    if (!only || only === 'H11') {
      for (const [w, h] of [...ROUND5_LAYOUT_SIZES, [719, 844], [720, 844]]) {
        const m = model(w, h);
        for (let i = 0; i < 3; i++) {
          checkCraftColumns(m.sample(), w, `${w}x${h}/measure ${i + 1}`);
          craftSamples++;
        }
      }
    }
    if (!only || only === 'H12') {
      // Run this pair first so the negative control is caught by the resize gate itself.
      const m = model(990, 640), before = m.sample();
      m.resize(1000, 640);
      const after = m.sample();
      wrapStep = Math.abs((after.left + after.right - before.left - before.right) / 2);
      checkResizeStep(before, after, '1000x640');
      for (const h of [640, 900, 1440]) {
        const sweep = model(720, h);
        let previous;
        for (let w = 720; w <= 2560; w += 10) {
          sweep.resize(w, h);
          const r = sweep.sample();
          checkSceneTextEdge(r, `${w}x${h}`);
          if (previous) {
            checkResizeStep(previous, r, `${w}x${h}`);
            maxStep = Math.max(maxStep, Math.abs((r.left + r.right - previous.left - previous.right) / 2));
          }
          previous = r;
          resizeSamples++;
        }
      }
    }
  } finally {
    if (previousStyle) Object.defineProperty(globalThis, 'getComputedStyle', previousStyle);
    else delete globalThis.getComputedStyle;
  }
  return `H11/H12 computed: ${craftSamples} four-craft layout samples; ${resizeSamples} resize samples; 990/1000 centre step ${wrapStep.toFixed(3)} px, maximum step ${maxStep.toFixed(3)} px. DOM/glyph model only; browser/pixel checks UNRUN.`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const option = name => process.argv.find(arg => arg.startsWith('--' + name + '='))?.split('=')[1];
  console.log(await checkRound5SecondAddendum({ only: option('only'), control: option('control') }));
}
