// Measure only on layout/font/name-animation changes. Playback uses the cached view and obstacles.
import { centreScene, stageTarget } from './view.mjs';

export function createPageLayout(hero, stage, callouts) {
  const doc = hero.ownerDocument, name = hero.querySelector('[data-name]');
  const lines = name.innerHTML.split(/<br\s*\/?\s*>/i).map(text => {
    const line = doc.createElement('span'); line.className = 'name-line'; line.textContent = text.trim(); return line;
  });
  name.replaceChildren(...lines);
  const numbers = [...hero.querySelectorAll('.hero-crafts .n')];
  const context = doc.createElement('canvas').getContext('2d');
  let cached, target;
  function ink(node, fixedWeight) {
    const walker = doc.createTreeWalker(node, 4), range = doc.createRange(), rects = [];
    while (walker.nextNode()) {
      const text = walker.currentNode, style = getComputedStyle(text.parentElement);
      context.font = `${fixedWeight || style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      for (let i = 0; i < text.length; i++) {
        if (!text.data[i].trim()) continue;
        range.setStart(text, i); range.setEnd(text, i + 1);
        const r = range.getBoundingClientRect(), m = context.measureText(text.data[i]);
        const ascent = m.fontBoundingBoxAscent, descent = m.fontBoundingBoxDescent;
        const baseline = r.top + (r.height - ascent - descent) / 2 + ascent;
        rects.push({ left: r.left - m.actualBoundingBoxLeft, right: r.left + m.actualBoundingBoxRight, top: baseline - m.actualBoundingBoxAscent, bottom: baseline + m.actualBoundingBoxDescent });
      }
    }
    return { left: Math.min(...rects.map(r => r.left)), right: Math.max(...rects.map(r => r.right)), top: Math.min(...rects.map(r => r.top)), bottom: Math.max(...rects.map(r => r.bottom)) };
  }
  function measure() {
    if (target) {
      for (const key of ['left', 'width']) if (stage.style[key] === target[key]) stage.style.removeProperty(key);
      target = null;
    }
    hero.style.setProperty('--say-rise', '0px');
    for (const line of [...lines, ...numbers]) line.style.setProperty('--name-ink-shift', '0px');
    const h = hero.getBoundingClientRect(), b = stage.getBoundingClientRect();
    const lede = ink(hero.querySelector('[data-lede]'));
    for (const line of lines) line.style.setProperty('--name-ink-shift', `${lede.left - ink(line, '800').left}px`);
    for (const number of numbers) number.style.setProperty('--name-ink-shift', `${lede.left - ink(number).left}px`);
    const nameInk = ink(name), gap = lede.top - nameInk.bottom;
    const logo = hero.querySelector('[data-mark]').getBoundingClientRect();
    const rise = h.width < 720 ? 0 : Math.min(Math.max(0, gap), Math.max(0, nameInk.top - logo.bottom - 48));
    hero.style.setProperty('--say-rise', rise + 'px');
    const text = [name, hero.querySelector('[data-lede]'), hero.querySelector('[data-crafts]')].map(n => ink(n));
    const textRight = Math.max(...text.map(r => r.right)) - h.left;
    callouts.measure();
    cached = { h, b, textRight, gap, rise, text, baseNameTop: nameInk.top - h.top, logoBottom: logo.bottom - h.top, nameLines: lines.map(n => ink(n, '800')), ledeInk: ink(hero.querySelector('[data-lede]')), numberInks: numbers.map(n => ink(n)) };
    return cached;
  }
  return {
    measure,
    get metrics() { return cached; },
    view(need, cam, dpr) {
      const { h, b, textRight } = cached || measure();
      const S = Math.min(b.width / need.w, b.height / need.h);
      const initial = { W: h.width, H: h.height, S, cx: b.left - h.left + b.width / 2 - S * need.x, cy: b.top - h.top + b.height / 2 + S * need.y, cam, dpr };
      return callouts.fit(centreScene(initial, need, textRight), need, b.left - h.left);
    },
    cover(view, need) {
      // Extend the existing stage target to include the shifted scene. Keep its original sizing basis.
      if (view.W < 720) return;
      const { b, h } = cached, bounds = stageTarget(view, need, b.left - h.left, b.right - h.left);
      target = { left: bounds.left + 'px', width: bounds.width + 'px' };
      Object.assign(stage.style, target);
    },
  };
}
