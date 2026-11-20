// Screen-space callouts share the renderer's projection. Geometry is pure; DOM nodes live for the player.
import { dot } from '../../../public/journey/hero/engine.mjs';
import { corners } from './kit.mjs';
import { SCREEN, SHOW, SCRIPTS, PACE, calloutsAt, sceneAt } from './stage.mjs';

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const intersects = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
const box = (x, y, w, h) => ({ left: x, top: y, right: x + w, bottom: y + h });
const padded = (r, n) => ({ left: r.left - n, top: r.top - n, right: r.right + n, bottom: r.bottom + n });
export const projectMark = (p, { S, cx, cy, cam }) => [cx + S * dot(cam.r, p), cy - S * dot(cam.u, p)];
const fitting = new WeakMap();

// Solve both word columns and the stage gutters together. The feasible interval is linear in S.
export function fitCalloutView(view, need, boxLeft, widths) {
  let scenes = fitting.get(view.cam);
  if (!scenes) {
    let start = 0; scenes = [];
    for (const scene of SHOW) {
      const time = start + (scene.key === 'id' ? SCRIPTS.id.actions.find(a => a.id === 'export').end + 0.41 * PACE : scene.still), labels = calloutsAt(time);
      if (labels.length) scenes.push(labels);
      start += scene.len;
    }
    fitting.set(view.cam, scenes);
  }
  const solve = small => {
    const run = small ? 8 : 12, lower = [[16, -(need.x - need.w / 2 + 0.249)]], upper = [[view.W - 16, -(need.x + need.w / 2 - 0.249)]];
    for (const labels of scenes) {
      const lowest = Math.min(...labels.filter(c => c.level === 'low').map(c => dot(view.cam.u, c.mark)));
      const word = c => typeof widths === 'number' ? widths : widths[small ? 'small' : 'large'][c.id];
      const leftWidth = Math.max(...labels.filter(c => c.side === 'left').map(word));
      for (const c of labels) {
        const x = dot(view.cam.r, c.mark), diagonal = c.level === 'up' ? 0.45 : 0.45 + dot(view.cam.u, c.mark) - lowest;
        if (c.side === 'left') lower.push([16 + leftWidth + 7 + run, diagonal - x]);
        else upper.push([view.W - 16 - word(c) - 7 - run, -diagonal - x]);
      }
    }
    let S = Math.min(view.S, small ? 70 - 1e-8 : Infinity);
    for (const [a, b] of lower) for (const [c, d] of upper) if (b > d) S = Math.min(S, (c - a) / (b - d));
    const lo = Math.max(...lower.map(([a, b]) => a + b * S)), hi = Math.min(...upper.map(([a, b]) => a + b * S));
    return { S, cx: clamp(view.cx + (view.S - S) * need.x, lo, hi) };
  };
  let fit = solve(false);
  if (fit.S < 70) fit = solve(true);
  const { S, cx } = fit;
  // Preserve the original vertical fit's centre when reducing the scale.
  return { ...view, S, cx, cy: view.cy + (S - view.S) * need.y };
}

export function labelLayout(data, pieces, view, widths, obstacles = [], reduced = false, time = 0, anchors = data) {
  const { W, H, S } = view;
  if (S < 34 || !data.length) return [];
  const small = S < 70, radius = small ? 5.5 : 8, size = small ? 9 : 11, height = size * 1.2;
  const marks = data.map(c => projectMark(c.mark, view));
  const floor = pieces.filter(pc => pc.where === 'floor').flatMap(corners).map(p => projectMark(p, view));
  const screen = [[SCREEN.l, SCREEN.b, SCREEN.z], [SCREEN.l + SCREEN.w, SCREEN.b + SCREEN.h, SCREEN.z]].map(p => projectMark(p, view));
  const low = Math.max(...anchors.filter(c => c.level === 'low').map(c => projectMark(c.mark, view)[1])) + 0.45 * S;
  const leftWidth = Math.max(0, ...data.filter(c => c.side === 'left').map(c => widths[c.id]));
  const run = small ? 8 : 12;
  const leftLimit = Math.min(...anchors.filter(c => c.side === 'left').map(c => { const [x, y] = projectMark(c.mark, view); return x - (c.level === 'up' ? 0.45 * S : low - y) - run; }));
  const rightLimit = Math.max(...anchors.filter(c => c.side === 'right').map(c => { const [x, y] = projectMark(c.mark, view); return x + (c.level === 'up' ? 0.45 * S : low - y) + run; }));
  let leftEnd = clamp(Math.min(Math.min(...floor.map(p => p[0])) - 0.35 * S, leftLimit), 16 + leftWidth + 7, W - 16);
  let rightEnd = clamp(Math.max(Math.max(...screen.map(p => p[0])) + 0.27 * S, rightLimit), 16, W - 16 - Math.max(0, ...data.filter(c => c.side === 'right').map(c => widths[c.id])) - 7);
  const occupied = obstacles.map(r => padded(r, 2));
  const result = [];
  // Clamp the common low level before solving the horizontal ends. The marks stay attached to their assets.
  let lowY = Math.min(H - 16 - height / 2, low);
  for (const r of occupied) if (r.left < W - 16 && r.right > 16 && lowY + height / 2 > r.top && lowY - height / 2 < r.bottom && r.top > Math.max(...marks.map(p => p[1]))) lowY = Math.min(lowY, r.top - height / 2 - 1);
  for (let pass = 0; pass < 2; pass++) for (let i = 0; i < data.length; i++) {
    const c = data[i], y = c.level === 'low' ? lowY : marks[i][1] - 0.45 * S, w = widths[c.id];
    for (const r of occupied) if (y + height / 2 > r.top && y - height / 2 < r.bottom) {
      if (c.side === 'left' && intersects(box(leftEnd - 7 - w, y - height / 2, w, height), r)) leftEnd = clamp(r.right + 7 + w + 1, 16 + leftWidth + 7, W - 16);
      if (c.side === 'right' && intersects(box(rightEnd + 7, y - height / 2, w, height), r)) rightEnd = clamp(r.left - 7 - w - 1, 16, W - 16 - w - 7);
    }
  }
  for (let i = 0; i < data.length; i++) {
    const c = data[i], [mx, my] = marks[i], dir = c.side === 'left' ? -1 : 1, w = widths[c.id];
    let endX = c.side === 'left' ? leftEnd : rightEnd, endY = c.level === 'low' ? lowY : clamp(my - 0.45 * S, 16 + height / 2, H - 16 - height / 2);
    let elbowX = mx + dir * Math.abs(endY - my);
    // If a page block clips a route, shorten its diagonal while preserving its 45-degree angle.
    for (let pass = 0; pass < 4; pass++) {
      const label = box(c.side === 'left' ? endX - 7 - w : endX + 7, endY - height / 2, w, height);
      const hit = occupied.find(r => intersects(label, r));
      if (!hit) break;
      endY = c.level === 'up' ? Math.min(endY, hit.top - height / 2 - 1) : Math.max(my + radius + 4, Math.min(endY, hit.top - height / 2 - 1));
      elbowX = mx + dir * Math.abs(endY - my);
    }
    // Content can shorten the diagonal, but never reverse the outward horizontal run.
    elbowX = c.side === 'left' ? Math.max(elbowX, endX + run) : Math.min(elbowX, endX - run);
    const delta = Math.abs(elbowX - mx), signY = c.level === 'up' ? -1 : 1;
    if (Math.abs(endY - my) > delta) endY = my + signY * delta;
    const start = [mx + dir * (radius + 3) / Math.SQRT2, my + signY * (radius + 3) / Math.SQRT2];
    const points = [start, [elbowX, endY], [endX, endY]];
    const length = Math.hypot(elbowX - start[0], endY - start[1]) + Math.abs(endX - elbowX);
    result.push({ ...c, mark2: [mx, my], points, length, radius, size, height, stroke: small ? 1 : 1.25, angle: reduced ? 0 : 60 * time, label: box(c.side === 'left' ? endX - 7 - w : endX + 7, endY - height / 2, w, height) });
  }
  return result;
}

export function createCallouts(hero) {
  const doc = hero.ownerDocument, ns = hero.querySelector('svg').namespaceURI;
  const element = (name, attrs = {}) => { const n = doc.createElementNS(ns, name); for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); return n; };
  const overlay = doc.createElement('div'); overlay.setAttribute('data-callouts', ''); overlay.setAttribute('aria-hidden', 'true');
  Object.assign(overlay.style, { position: 'absolute', inset: '0', pointerEvents: 'none', zIndex: '2' });
  const svg = element('svg', { width: '100%', height: '100%', 'aria-hidden': 'true' }); Object.assign(svg.style, { position: 'absolute', inset: '0', overflow: 'hidden' }); overlay.append(svg);
  const nodes = Array.from({ length: 3 }, () => {
    const group = element('g'), line = element('polyline', { fill: 'none', stroke: '#F7F6F3', 'stroke-width': 1 }), ring = element('circle', { fill: 'none', stroke: '#F0484F' }), mark = element('rect', { width: 3, height: 3, fill: '#F0484F' });
    group.append(line, ring, mark); svg.append(group);
    const word = doc.createElement('span'); Object.assign(word.style, { position: 'absolute', color: '#F7F6F3', fontFamily: 'Outfit, sans-serif', fontWeight: '400', lineHeight: '1.2', letterSpacing: '0.12em', whiteSpace: 'nowrap', textTransform: 'uppercase' }); overlay.append(word);
    return { group, line, ring, mark, word };
  });
  hero.append(overlay);
  for (const n of hero.querySelectorAll('.hero-nav,.hero-say,.hero-foot')) n.style.zIndex = '3';
  let last = [];
  let wordWidths;
  return {
    fit(view, need, boxLeft) {
      if (!wordWidths) {
        const word = nodes[2].word;
        word.style.display = ''; wordWidths = { small: {}, large: {} };
        let start = 0;
        for (const scene of SHOW) {
          const time = start + (scene.key === 'id' ? SCRIPTS.id.actions.find(a => a.id === 'export').end + 0.41 * PACE : scene.still);
          for (const c of calloutsAt(time)) for (const [key, size] of [['small', 9], ['large', 11]]) {
            word.style.fontSize = size + 'px'; word.textContent = c.words; wordWidths[key][c.id] = word.getBoundingClientRect().width;
          }
          start += scene.len;
        }
      }
      return fitCalloutView(view, need, boxLeft, wordWidths);
    },
    draw(data, pieces, view, time, reduced) {
      const h = hero.getBoundingClientRect(), obstacles = [...hero.querySelectorAll('[data-name],[data-lede],[data-crafts],.hero-nav,[data-foot]')].map(n => n.getBoundingClientRect()).filter(r => r.width && r.height).map(r => ({ left: r.left - h.left, right: r.right - h.left, top: r.top - h.top, bottom: r.bottom - h.top }));
      const widths = {};
      nodes.forEach((n, i) => { const c = data[i]; n.word.style.display = c ? '' : 'none'; n.word.style.fontSize = (view.S < 70 ? 9 : 11) + 'px'; if (c) { n.word.textContent = c.words; widths[c.id] = n.word.getBoundingClientRect().width; } });
      let anchors = data;
      if (data.length > 0 && data.length < 3) {
        const { scene, at } = sceneAt(time), full = calloutsAt(time - at + scene.still);
        anchors = [...data, ...full.filter(c => !data.some(p => p.id === c.id))];
      }
      last = labelLayout(data, pieces, view, widths, obstacles, reduced, time, anchors);
      nodes.forEach((n, i) => {
        const c = last[i]; n.group.style.display = n.word.style.display = c ? '' : 'none';
        if (!c) return;
        n.group.setAttribute('data-callout', c.id); n.word.setAttribute('data-callout-word', c.id);
        const [x, y] = c.mark2, sixth = 2 * Math.PI * c.radius / 6;
        n.mark.setAttribute('x', x - 1.5); n.mark.setAttribute('y', y - 1.5);
        for (const [k, v] of Object.entries({ cx: x, cy: y, r: c.radius, 'stroke-width': c.stroke, 'stroke-dasharray': `${sixth * 0.62} ${sixth * 0.38}`, transform: `rotate(${c.angle} ${x} ${y})` })) n.ring.setAttribute(k, v);
        n.line.setAttribute('points', c.points.map(p => p.join(',')).join(' ')); n.line.setAttribute('stroke-dasharray', c.length); n.line.setAttribute('stroke-dashoffset', c.length * (1 - c.grow));
        Object.assign(n.word.style, { left: c.label.left + 'px', top: c.label.top + 'px', clipPath: c.side === 'left' ? `inset(0 0 0 ${(1 - c.text) * 100}%)` : `inset(0 ${(1 - c.text) * 100}% 0 0)` });
      });
    },
    get layout() { return last; },
  };
}
