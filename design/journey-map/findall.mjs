// A single completion accent, started by the eleventh count landing.
import { C, FINDS, FIND_PLAY } from './data.mjs';
import { clamp01 } from './trip.mjs';
import { FD, attr, ease, findSvg } from './findkit.mjs';

export function findAll(svg) {
  const A = FIND_PLAY.all, frame = svg.querySelector('rect[x="18"][y="18"]'), knots = [...svg.querySelectorAll('.chart-knot')], markers = FINDS.filter(f => f.n).map(f => ({ el: svg.querySelector('#mk-' + f.id), at: f.mark }));
  const comet = findSvg('rect', { class: 'l', x: A.frame[0], y: A.frame[1], width: A.frame[2], height: A.frame[3], pathLength: A.length, 'stroke-dasharray': A.dash.join(' '), 'stroke-dashoffset': A.length, 'pointer-events': 'none', opacity: 0 }); comet.style.strokeWidth = A.width; svg.querySelector('#finds').appendChild(comet);
  const o = { done: false, ts: null };
  o.start = () => {
    if (o.done) return; o.done = true; o.ts = FD.now;
    const Q = FIND_PLAY.all;
    if (FD.rm) attr(frame, 'stroke-opacity', Q.frameAlpha);
    else {
      comet.animate([{ strokeDashoffset: Q.length }, { strokeDashoffset: 0 }], { duration: Q.time * 1000, fill: 'forwards' });
      frame.animate([{ strokeOpacity: frame.getAttribute('stroke-opacity') }, { strokeOpacity: Q.frameAlpha }], { delay: Q.time * 1000, duration: Q.fade * 1000, fill: 'forwards' });
    }
  };
  o.tick = t => {
    if (o.ts === null || FD.rm) return;
    const Q = FIND_PLAY.all, age = t - o.ts, perimeter = 2 * (Q.frame[2] + Q.frame[3]);
    attr(comet, 'opacity', age <= Q.time ? 1 : 1 - clamp01((age - Q.time) / Q.fade));
    knots.forEach((knot, i) => { const q = clamp01((age - Q.time * Q.corners[i] / perimeter) / Q.knotTime), at = Q.knots[i]; attr(knot, 'transform', `translate(${at[0]} ${at[1]}) rotate(${FIND_PLAY.kit.turn * ease(q)})`); });
    const pulse = Math.sin(Math.PI * clamp01(age / Q.markerTime)); markers.forEach(m => { const p = m.at; attr(m.el, 'transform', `translate(${p[0]} ${p[1]}) scale(${1 + (Q.markerScale - 1) * pulse}) translate(${-p[0]} ${-p[1]})`); });
    if (age >= Q.time + Math.max(Q.fade, Q.knotTime)) o.ts = null;
  };
  return o;
}
