// One entrance clock, from the loader's landing. Geometry is measured once; playback only paints.
// Hard-edged except the stars/name. Entrance times are seconds from the loader's burst landing.
import { EASE, makeCamera, dot } from '../../../public/journey/hero/engine.mjs';
import { SCREEN } from './stage.mjs';
import { LOADER, loaderAt, loaderLanding, loaderScene, sampleMark } from './loader-stars.mjs';
import { readStarLabels } from './star-labels.mjs';
export { LOADER, loaderAt };

export const ENTRANCE = {
  end: 4.6,
  mark: [[0, 0.7], [0.08, 0.78]],             // D, then both paths of the G
  nav: [[0.25, 0.85], [0.33, 0.93]],
  name: { starts: [0.3, 0.5], step: 0.055, len: 0.85 },
  lede: { start: 1.15, step: 0.028, len: 0.7, gap: 0.12 },
  crafts: { start: 3.1, end: 3.9, step: 0.1, lines: 5, rise: 0.6 },
  floor: [1.9, 2.9],
  starPointer: 0,                             // L5: entrance zero is the burst landing
  stars: null,                               // L4: the loader burst replaces the star entrance ring
  screen: [2.2, 3.5],
  lift: 4.5,
  camera: [1.9, 3.9],
  turn: { yaw: 12, pitch: 5, scale: 0.88 },
  foot: [[3.95, 4.5], [4.03, 4.58]],
};

const linear = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
const wipe = (t, a, b) => EASE.wipe(linear(t, a, b));

// The early inline canvas owns its clock and painting; the player owns the same-frame WebGL handover.
// Stand-alone/review harnesses can still exercise the pure timing without an inline bridge.
export function createLoaderView(hero, { sample: suppliedSample } = {}) {
  const win = hero.ownerDocument?.defaultView, bridge = win?.__loaderStars;
  let sample = null, scene = null;
  const measureScene = box => {
    if (!bridge) return;
    // Resolve the entrance to the painter's actual last ray, once layout is known.
    sample ??= suppliedSample?.() || sampleMark([...hero.querySelectorAll('[data-mark] path')].map(p => ({ d: p.getAttribute('d'), fill: p.getAttribute('fill') })));
    scene = loaderScene(sample, box.width, box.height, { width: win.innerWidth, height: win.innerHeight, left: box.left, top: box.top }, readStarLabels(hero, box));
  };
  // The early painter also remeasures on scroll. Keep its scene's landing clock in sync.
  const onScroll = () => measureScene(hero.getBoundingClientRect());
  if (bridge) win.addEventListener('scroll', onScroll, { passive: true });
  return {
    state: bridge ? now => loaderLanding(bridge.state(now), scene?.duration ?? LOADER.burst) : null,
    boot: key => bridge?.boot(key),
    measure(box) {
      bridge?.measure(box);
      measureScene(box);
    },
    motion: reduced => bridge?.motion(reduced),
    // The inline bridge's legacy entranceTime input only switches the burst's transparent backing.
    // Keep that switch at burst start while the page's entranceTime waits for the landing.
    apply(state) { bridge?.apply({ ...state, entranceTime: state.burstTime }); },
    clear() { if (bridge) win.removeEventListener('scroll', onScroll); bridge?.clear(); hero.classList.remove('is-loading'); },
  };
}
// The loop's clock starts at 0 when the screen's wipe ends.
export const loopAt = time => Math.max(0, time - ENTRANCE.screen[1]);

// Each part starts `step` after the one before and the last one ends at `end`, whatever the count.
export function staggerSpans({ start, end, step }, count) {
  const gap = Math.min(step, (end - start) / (count + 1)), length = end - start - gap * (count - 1);
  return Array.from({ length: count }, (_, i) => [start + i * gap, start + i * gap + length]);
}

export const quintOut = p => 1 - (1 - p) ** 5;
export const quartOut = p => 1 - (1 - p) ** 4;
export const cubicOut = p => 1 - (1 - p) ** 3;
export const nameSpan = (line, letter) => {
  const a = ENTRANCE.name.starts[line] + letter * ENTRANCE.name.step;
  return [a, a + ENTRANCE.name.len];
};
export const wordSpan = (index, more) => {
  const a = ENTRANCE.lede.start + index * ENTRANCE.lede.step + (more ? ENTRANCE.lede.gap : 0);
  return [a, a + ENTRANCE.lede.len];
};
export const craftSpan = index => {
  const [a, b] = staggerSpans(ENTRANCE.crafts, ENTRANCE.crafts.lines)[index];
  const start = a + 0.18 * (b - a);
  return [start, start + ENTRANCE.crafts.rise];
};
export function riseAt(time, span) {
  const p = linear(time, ...span);
  return { progress: p, reveal: quintOut(p) };
}

export function entranceAt(time) {
  const E = ENTRANCE;
  return {
    time,
    done: time >= E.end,
    mark: E.mark.map(span => riseAt(time, span).reveal),
    nav: E.nav.map(span => riseAt(time, span).reveal),
    name: [6, 8].map((count, line) => Array.from({ length: count }, (_, i) => riseAt(time, nameSpan(line, i)))),
    crafts: staggerSpans(E.crafts, E.crafts.lines).map(span => wipe(time, ...span)),
    floor: wipe(time, ...E.floor),
    stars: E.stars === null ? 1 : wipe(time, ...E.stars),
    screen: quartOut(linear(time, ...E.screen)),
    camera: quartOut(linear(time, ...E.camera)),
    foot: E.foot.map(span => riseAt(time, span).reveal),
    hover: time >= E.floor[1],
    loop: loopAt(time),
  };
}

// A fixed floor plane clips every colour/outline/shadow pass while the pieces rise through it.
export function screenPlane(p) {
  return p >= 1 ? null : [0, 1, 0, 0];
}
const shiftPlane = (plane, dy) => plane ? [plane[0], plane[1], plane[2], plane[3] - plane[1] * dy] : plane;
export function liftPieces(pieces, progress) {
  if (progress >= 1) return pieces;
  const dy = -ENTRANCE.lift * (1 - progress);
  const shifted = p => [p[0], p[1] + dy, p[2]];
  return pieces.map(pc => ({ ...pc, p: shifted(pc.p),
    ...(pc.shadowP ? { shadowP: shifted(pc.shadowP) } : {}),
    ...(pc.clip ? { clip: shiftPlane(pc.clip, dy) } : {}),
    ...(pc.carryClip ? { carryClip: shiftPlane(pc.carryClip, dy) } : {}),
  }));
}
export function settleView(view, progress, yaw = 0, pitch = 0) {
  if (progress >= 1) return view;
  const k = 1 - progress, turn = ENTRANCE.turn;
  const cam = makeCamera(yaw + turn.yaw * k, pitch + turn.pitch * k);
  const centre = [SCREEN.l + SCREEN.w / 2, SCREEN.b + SCREEN.h / 2, SCREEN.z];
  const x = view.cx + view.S * dot(view.cam.r, centre), y = view.cy - view.S * dot(view.cam.u, centre);
  const S = view.S * (1 - (1 - turn.scale) * k);
  return { ...view, S, cx: x - S * dot(cam.r, centre), cy: y + S * dot(cam.u, centre), cam };
}
// The floor's hard circle, in world units from the pool's centre. null once it has reached the pool's edge.
export const floorReach = (p, radius) => p >= 1 ? null : p * radius;
// Mirrors FRAG_FLOOR: a dot is decided by its grid centre alone, so it is wholly on or off.
export function revealDot(x, z, centre, reach, pitch = 0.5) {
  const cell = [Math.floor(x / pitch + 0.5) * pitch, Math.floor(z / pitch + 0.5) * pitch];
  return reach === null || Math.hypot(cell[0] - centre.x, cell[1] - centre.z) <= reach;
}
export const revealPool = (x, z, centre, reach) => reach === null || Math.hypot(x - centre.x, z - centre.z) <= reach;

// ---- the page. Geometry is read once (on start and on layout changes); each frame only writes styles.
const HIDDEN = 'inset(0 100% 0 0)';
const rect = (x0, y0, x1, y1) => `M${x0.toFixed(2)} ${y0.toFixed(2)}H${x1.toFixed(2)}V${y1.toFixed(2)}H${x0.toFixed(2)}Z`;
const clipPath = parts => parts.length ? `path('${parts.join('')}')` : HIDDEN;

export function createEntranceView(hero) {
  const doc = hero.ownerDocument, q = s => hero.querySelector(s);
  const mark = q('[data-mark]'), paths = [...mark.querySelectorAll('path')];
  const nav = q('[data-nav]'), links = [...nav.querySelectorAll('a')], lede = q('[data-lede]');
  const rows = [...hero.querySelectorAll('[data-crafts] li')], buttons = rows.map(li => li.querySelector('button'));
  const footer = q('[data-foot]'), foot = [q('[data-cue]'), q('[data-pause]')];
  let lines = [], geo = null, made = [], craftMasks = [];
  const layer = className => {
    const el = doc.createElement('span'); el.className = className;
    el.setAttribute('aria-hidden', 'true'); made.push(el); return el;
  };
  const px = n => n.toFixed(3) + 'px';
  const up = (el, distance) => { el.style.transform = distance === 0 ? '' : `translateY(${px(distance)})`; };
  function measure(nameInks) {
    clear();
    lines = [...hero.querySelectorAll('[data-name] .name-line')];
    const range = doc.createRange();
    const name = lines.map((line, i) => {
      const box = line.getBoundingClientRect(), ink = nameInks?.[i];
      const top = ink ? ink.top - box.top : 0, bottom = ink ? ink.bottom - box.top : box.height;
      const text = [...line.childNodes].find(n => n.nodeType === 3 && n.data.trim());
      const overlay = layer('entrance-name'), letters = [];
      // Range positions retain the flow's kerning. Generated content adds neither text nor flow boxes.
      if (text) for (let j = 0; j < text.data.length; j++) {
        range.setStart(text, j); range.setEnd(text, j + 1);
        const r = range.getBoundingClientRect(), el = layer('entrance-letter');
        el.dataset.ch = text.data[j];
        Object.assign(el.style, { left: px(r.left - box.left), top: px(r.top - box.top), width: px(r.width), height: px(r.height), lineHeight: px(r.height) });
        overlay.append(el); letters.push({ el, span: nameSpan(i, j) });
      }
      line.append(overlay);
      const mask = `polygon(-50% -80%, 150% -80%, 150% ${px(bottom + 3)}, -50% ${px(bottom + 3)})`;
      line.style.clipPath = mask; line.classList.add('has-entrance');
      return { line, overlay, letters, drop: bottom - top + 16, mask, landed: false };
    });
    const lb = lede.getBoundingClientRect(), walker = doc.createTreeWalker(lede, 4), words = [];
    while (walker.nextNode()) {
      const text = walker.currentNode, more = !!text.parentElement.closest('.hero-lede-more');
      for (const match of text.data.matchAll(/\S+/g)) {
        range.setStart(text, match.index); range.setEnd(text, match.index + match[0].length);
        const r = [...range.getClientRects()].find(r => r.width && r.height);
        if (r) words.push({ text: match[0], left: r.left - lb.left, top: r.top - lb.top, width: r.width, height: r.height, more });
      }
    }
    const ledeLines = [];
    for (const word of words) {
      let line = ledeLines.find(l => Math.abs(l.top - word.top) < word.height / 2);
      if (!line) ledeLines.push(line = { top: word.top, height: word.height, words: [] });
      line.words.push(word);
    }
    ledeLines.sort((a, b) => a.top - b.top);
    const ledeWords = [], masks = [];
    let index = 0;
    for (const line of ledeLines) {
      const mask = layer('entrance-lede-line');
      Object.assign(mask.style, { top: px(line.top - 2), height: px(line.height + 4) });
      for (const word of line.words.sort((a, b) => a.left - b.left)) {
        const el = layer('entrance-word'); el.dataset.ch = word.text;
        Object.assign(el.style, { left: px(word.left + 4), top: px(word.top - line.top + 2), width: px(word.width), height: px(word.height), lineHeight: px(word.height) });
        mask.append(el); ledeWords.push({ el, span: wordSpan(index++, word.more), drop: line.height + 6 });
      }
      lede.append(mask); masks.push(mask);
    }
    lede.classList.add('has-entrance');
    const crafts = rows.map((li, i) => {
      const box = li.getBoundingClientRect(), button = buttons[i], b = button.getBoundingClientRect();
      const mask = doc.createElement('span'); mask.className = 'entrance-craft-mask';
      mask.style.clipPath = `inset(${px(2 - (b.top - box.top))} -40px ${px(b.bottom - box.top - (box.height - 2))})`;
      button.before(mask); mask.append(button); craftMasks.push({ mask, button });
      return { w: box.width, h: box.height };
    });
    const nb = nav.getBoundingClientRect(), fb = footer.getBoundingClientRect();
    geo = { name, ledeWords, masks, ledeLines: ledeLines.length, ledeLanded: false, crafts,
      navDrop: links.map(a => nb.bottom - a.getBoundingClientRect().top + 6),
      footDrop: foot.map(el => fb.bottom - el.getBoundingClientRect().top + 6),
      paths: paths.map(el => ({ el, index: el.getAttribute('fill') === '#C0262E' ? 0 : 1 })),
      craftSpans: rows.map((_, i) => craftSpan(i)),
    };
    return geo;
  }
  function apply(s) {
    if (!geo) return;
    if (s.done) { clear(); return; }
    mark.style.clipPath = s.mark.every(p => p >= 1) ? '' : 'inset(0)';
    for (const { el, index } of geo.paths) up(el, (1 - s.mark[index]) * 830);
    nav.style.clipPath = s.nav.every(p => p >= 1) ? '' : 'inset(0 -40px)';
    links.forEach((el, i) => up(el, (1 - s.nav[i]) * geo.navDrop[i]));
    for (const g of geo.name) {
      if (g.landed) continue;
      let landed = true;
      for (const { el, span } of g.letters) {
        const p = riseAt(s.time, span); if (p.progress < 1) landed = false;
        up(el, (1 - p.reveal) * g.drop);
      }
      if (landed) { g.line.style.clipPath = ''; g.line.classList.remove('has-entrance'); g.overlay.remove(); g.landed = true; }
    }
    if (!geo.ledeLanded) {
      let landed = true;
      for (const w of geo.ledeWords) {
        const p = riseAt(s.time, w.span); if (p.progress < 1) landed = false;
        up(w.el, (1 - p.reveal) * w.drop);
      }
      if (landed) { lede.classList.remove('has-entrance'); for (const mask of geo.masks) mask.remove(); geo.ledeLanded = true; }
    }
    rows.forEach((li, i) => {
      const g = geo.crafts[i], p = s.crafts[i], last = i === rows.length - 1, bottom = last ? s.crafts[rows.length] ?? 1 : 1;
      const rp = riseAt(s.time, geo.craftSpans[i]);
      up(buttons[i], (1 - rp.reveal) * g.h);
      if (p >= 1 && bottom >= 1 && rp.progress >= 1) { li.style.clipPath = ''; return; }
      const parts = [];
      if (p > 0) parts.push(rect(0, -1, g.w * p, 1));
      parts.push(rect(-40, 2, g.w + 40, g.h - 2));
      if (last && bottom > 0) parts.push(rect(0, g.h - 1, g.w * bottom, g.h + 1));
      li.style.clipPath = clipPath(parts);
    });
    footer.style.clipPath = s.foot.every(p => p >= 1) ? '' : 'inset(0 -40px)';
    foot.forEach((el, i) => up(el, (1 - s.foot[i]) * geo.footDrop[i]));
  }
  function clear() {
    for (const { mask, button } of craftMasks) mask.replaceWith(button); craftMasks = [];
    for (const el of made) el.remove(); made = [];
    for (const line of lines) { line.style.clipPath = ''; line.classList.remove('has-entrance'); }
    lede.classList.remove('has-entrance');
    for (const el of [mark, nav, footer, ...rows]) el.style.clipPath = '';
    for (const el of [...paths, ...links, ...foot, ...buttons]) el.style.transform = '';
    geo = null;
  }
  return { measure, apply, clear, get lines() { return geo ? geo.ledeLines : 0; } };
}
