// The fixed map shield, its growing callout and the join are one article throughout.
import { STOPS, PALETTES, COPY, CRAFTS, MAP, DEPTH, CARD_CLOSE, CARD_GROW, CARD_TAIL, MARK, WORLD } from './data.mjs';
import { shieldSvg, cardTailSvg } from './art.mjs';
import { VIEW, STOP_U, tripCardPlace, toScreen, smooth, easeIO, lerp } from './trip.mjs';
import { JOURNEY } from './steps.mjs';

const CD = { list: [], W: 640, craft: null, onGo: null, rm: false, closed: null, last: null, dt: 0 };
const cardsWrites = new WeakMap();
function cardsStyle(el, key, value) {
  const text = String(value), cache = cardsWrites.get(el) || {}, old = cache[key];
  if (old?.text === text && el.style[key] === old.value) return;
  el.style[key] = value; cache[key] = { text, value: el.style[key] }; cardsWrites.set(el, cache);
}
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
export const arrowSvg = '<svg class="arr" viewBox="0 0 14 10" aria-hidden="true"><path d="M1 5h11M8 1l4 4l-4 4"/></svg>';

export function cardsBuild(container, onGo, rm = false) {
  CD.onGo = onGo; CD.rm = rm;
  const root = document.documentElement;
  Object.entries({ hit: CARD_CLOSE.hit, inset: CARD_CLOSE.inset, icon: CARD_CLOSE.icon, stroke: CARD_CLOSE.stroke }).forEach(([k, v]) => root.style.setProperty('--card-close-' + k, v + 'px'));
  const Q = WORLD.card; Object.entries({ 'card-panel-radius': Q.panelRadius, 'card-panel-pad': Q.panelPad, 'card-crafts': Q.crafts, 'card-title': Q.title, 'card-title-gap': Q.titleGap, 'card-foot-gap': Q.footGap, 'card-foot-margin': Q.footMargin }).forEach(([k, v]) => root.style.setProperty('--' + k, v + 'px')); root.style.setProperty('--card-title-weight', Q.titleWeight);
  STOPS.forEach((s, i) => {
    const p = PALETTES[s.palette], cp = s.copy, a = document.createElement('article');
    a.className = `stop lay-${p.layout}${p.panel ? ' has-panel' : ''}`; a.id = `stop-${s.id}`; a.setAttribute('aria-labelledby', `h-${s.id}`);
    const vars = { '--g': p.ground, '--tx': p.text, '--sub': p.sub, '--btn': p.button, '--btx': p.buttonText, '--pill': p.pill, '--ptx': p.pillText, '--band': p.band, '--hd': p.headline, '--mk': p.mark, '--hair': p.hairline };
    p.shield.forEach((v, j) => { vars['--shield-' + 'abc'[j]] = v; });
    if (p.panel) Object.assign(vars, { '--panel': p.panel, '--panel-text': p.panelText, '--panel-hair': p.panelHair, '--panel-btn': p.panelButton, '--panel-btx': p.panelButtonText });
    if (p.arrow) vars['--arrow'] = p.arrow;
    if (p.smallWeight !== undefined) vars['--sw'] = p.smallWeight;
    if (p.chip) vars['--chip'] = p.chip;
    if (p.logoH) vars['--logo-h'] = p.logoH + 'px';
    if (p.chipText) vars['--chtx'] = p.chipText;
    Object.entries(vars).forEach(([k, v]) => a.style.setProperty(k, v));
    const piece = cp.piece ? `<img src="${cp.piece}" alt="${esc(cp.caption)}">` : `<div class="c-empty">${COPY.pieceToCome}</div>`;
    const steps = cp.steps ? `<ol class="c-steps">${cp.steps.map(t => `<li>${esc(t)}</li>`).join('')}</ol>` : '';
    a.innerHTML = `<button class="st-btn" type="button" aria-label="${esc(COPY.stoneGo.replace('{name}', s.name).replace('{dates}', s.dates))}">${shieldSvg()}</button>
${rm ? '' : cardTailSvg()}<div class="c-card"><div class="c-sh" aria-hidden="true"></div><div class="face"><div class="c-in">
<header class="c-top"><img class="c-logo" src="${p.logo}" alt="${esc(s.name)}"><span class="c-pill">${esc(s.dates)}</span>${rm ? '' : `<button class="c-close" type="button" aria-label="${esc(COPY.cardClose.replace('{name}', s.name))}"><i aria-hidden="true"></i></button>`}</header>
<h2 class="c-h" id="h-${s.id}">${esc(cp.headline)}</h2><div class="c-panel"><div class="c-body"><div class="c-main"><p class="c-role">${esc(s.role)}</p><p class="c-para">${esc(cp.para)}</p>${steps}
 </div><div class="c-take"><p class="c-kick">${COPY.took}</p><p class="c-took">${esc(cp.took)}</p></div>
<div class="c-side"><figure class="c-piece">${piece}${cp.caption ? `<figcaption>${esc(cp.caption)}</figcaption>` : ''}</figure></div></div>
<div class="c-foot"><ul class="c-crafts">${CRAFTS.map(c => `<li class="${s.crafts.includes(c) ? 'lit' : ''}"><i></i>${c}</li>`).join('')}</ul>
<button class="c-btn" type="button" aria-label="${esc(COPY.caseStudy + ': ' + s.name)}">${COPY.caseStudy}${arrowSvg}</button></div></div></div></div></div>`;
    a.querySelector('.st-btn').addEventListener('click', () => {
      if (CD.closed?.i === i && CD.last?.P === CD.closed.P && !JOURNEY.moving) { CD.closed = { ...CD.closed, from: CD.closed.k, to: 1, elapsed: 0 }; CD.list[i].reopenFocus = true; return; }
      CD.onGo(i);
    });
    a.querySelector('.c-close')?.addEventListener('click', () => cardsClose(i));
    container.appendChild(a);
    CD.list.push({ el: a, card: a.querySelector('.c-card'), tail: a.querySelector('.c-tail'), face: a.querySelector('.face'), shadow: a.querySelector('.c-sh'), inn: a.querySelector('.c-in'), btn: a.querySelector('.st-btn'), fill: a.querySelector('.st-fill'), boss: a.querySelector('.st-boss-paint'), glow: a.querySelector('.st-glow'), mini: document.getElementById('mini')?.querySelectorAll('.mm-stop')[i], stop: s, state: '', paint: 0, tilt: [0, 0, 0, 0] });
  });
}
export function cardsResize(steps = false) {
  CD.steps = steps;
  CD.W = tripCardPlace(0, steps).w;
  const review = document.querySelector('[data-review]'), reviewFloor = review && !review.hidden && getComputedStyle(review).display !== 'none' ? review.getBoundingClientRect().bottom + CARD_TAIL.reviewGap : WORLD.card.gap;
  CD.list.forEach((c, i) => {
    c.W = CD.W; c.el.style.width = c.W + 'px'; c.el.style.height = '0px'; c.card.style.width = c.W + 'px'; c.card.style.height = 'auto'; c.face.style.position = 'relative'; c.inn.style.minHeight = '0';
    c.el.classList.toggle('c-compact', VIEW.phone || VIEW.h <= 720);
    c.H = c.inn.scrollHeight;
    c.place = tripCardPlace(c.H, steps, reviewFloor);
    VIEW.cards[i] = c.place; c.card.style.height = c.H + 'px'; cardsDepthConfig(c);
    // Layout is observed only at resize/fonts/image boundaries, never in the frame callback.
  });
}
function cardsDepthConfig(c) {
  const cfg = DEPTH.card, lift = !!VIEW.depth && !VIEW.phone;
  c.depthConfig = lift ? `${cfg.perspective}/${cfg.blur}/${cfg.spread}/${cfg.radius}` : '';
  c.card.style.perspective = lift ? cfg.perspective + 'px' : '';
  c.shadow.style.boxShadow = `0 0 ${cfg.blur}px ${cfg.spread}px var(--shade)`; c.shadow.style.borderRadius = cfg.radius + 'px';
  c.depthPending = false;
}
export const cardsSetCraft = mask => { CD.craft = mask; };

export function cardsClose(index = CD.last?.i) {
  const st = CD.last;
  if (CD.rm || JOURNEY.moving || !st || st.kind !== 'hold' || st.cardK[index] <= 0 || (CD.closed?.to === 0)) return false;
  CD.closed = { i: index, P: st.P, k: st.cardK[index], from: st.cardK[index], to: 0, elapsed: 0 };
  if (CD.list[index].el.contains(document.activeElement)) CD.list[index].btn.focus({ preventScroll: true });
  return true;
}
export function cardsOverride(st, dt, moving) {
  CD.dt = dt;
  const closed = CD.closed; let changed = false;
  if (closed) {
    if (st.kind !== 'hold' || st.i !== closed.i || (closed.leaving && !moving && st.P === closed.P)) { CD.closed = null; changed = true; }
    else {
      if (moving || st.P !== closed.P) closed.leaving = true;
      const before = closed.k;
      closed.elapsed = Math.min(CARD_CLOSE.time, closed.elapsed + dt); closed.k = lerp(closed.from, closed.to, easeIO(closed.elapsed / CARD_CLOSE.time));
      st.cardK[closed.i] *= closed.k; st.cardOpen = Math.max(...st.cardK); changed = before !== closed.k;
      if (closed.to === 1 && closed.elapsed === CARD_CLOSE.time) CD.closed = null;
    }
  }
  CD.last = st; return changed;
}

export function cardsFrame(st, look = [0, 0], pointer = [0.5, 0.5]) {
  const op = smooth(.5, 1, st.handoffT) * (1 - smooth(0, .4, st.blastT) * (1 - (st.exploreK || 0)));
  const stonePx = Math.max(MARK.min, Math.min(MARK.max, MARK.k * st.cam.s));
  CD.list.forEach((c, i) => {
    const close = c.el.querySelector('.c-close');
    if (close) {
      if (JOURNEY.moving && document.activeElement === close) document.getElementById('go')?.querySelector('.go-next')?.focus({ preventScroll: true });
      const inert = JOURNEY.moving || st.cardK[i] < .96;
      if (close.inert !== inert) close.inert = inert;
    }
    const W = c.W || CD.W, H = c.H, oc = c.place || { x: VIEW.w / 2, y: VIEW.h / 2 };
    const e = st.cardK[i], p = toScreen(st, MAP.waypoints[c.stop.w]);
    const k0 = stonePx / Math.max(W, H), k = Math.pow(k0, 1 - e), py = p[1] - stonePx / 2 - MARK.stand;
    const cx = lerp(p[0], oc.x, e), cy = lerp(py, oc.y, e);
    cardsStyle(c.el, 'transform', `translate(${p[0]}px,${py}px)`);
    cardsStyle(c.card, 'transform', `translate(${cx - W * k / 2 - p[0]}px,${cy - H * k / 2 - py}px) scale(${k})`);
    cardsStyle(c.btn, 'transform', `translate(-50%,-50%) scale(${stonePx / MARK.box})`);
    const lit = CD.craft ? CD.craft[i] : false;
    cardsStyle(c.el, 'opacity', op * (CD.craft && !lit ? .55 : 1));
    // Size, not the score, hands the mark over to the card: the face and its words come in together as it grows (no flat slab).
    cardsStyle(c.btn, 'opacity', 1);
    cardsStyle(c.face, 'opacity', smooth(...CARD_GROW.face, k));
    const cfg = DEPTH.card, lift = !!VIEW.depth && !VIEW.phone;
    // Apply live style configuration after this frame callback; animation only writes transform/opacity.
    const config = lift ? `${cfg.perspective}/${cfg.blur}/${cfg.spread}/${cfg.radius}` : '';
    if (config !== c.depthConfig && !c.depthPending) { c.depthPending = true; queueMicrotask(() => cardsDepthConfig(c)); }
    const lx = DEPTH.look ? look[0] / DEPTH.look : 0, ly = DEPTH.look ? look[1] / DEPTH.look : 0;
    const inside = pointer[0] * VIEW.w >= cx - W * k / 2 && pointer[0] * VIEW.w <= cx + W * k / 2 && pointer[1] * VIEW.h >= cy - H * k / 2 && pointer[1] * VIEW.h <= cy + H * k / 2;
    const plate = inside ? 0 : e;
    const target = [cfg.tilt * (1 - smooth(...cfg.open, e)) - ly * cfg.ptrTilt[1] * plate, lx * cfg.ptrTilt[0] * plate, -lx * cfg.shift * plate, -ly * cfg.shift * plate];
    c.tilt.forEach((v, j) => { c.tilt[j] = lift ? v + (target[j] - v) * cfg.ease : 0; if (Math.abs(c.tilt[j]) < cfg.flat) c.tilt[j] = 0; });
    const [rx, ryTilt, sx, sy] = c.tilt;
    cardsStyle(c.face, 'transform', lift ? `${sx || sy ? `translate(${sx}px,${sy}px) ` : ''}${rx ? `rotateX(${rx}deg) ` : ''}${ryTilt ? `rotateY(${ryTilt}deg)` : ''}`.trim() : '');
    cardsStyle(c.shadow, 'opacity', lift ? cfg.shadow * e : 0);
    cardsStyle(c.shadow, 'transform', `translate(${-sx / cfg.shadowShare}px,${cfg.drop * e - sy / cfg.shadowShare}px)`);
    cardsStyle(c.inn, 'opacity', smooth(...CARD_GROW.words, k));
    const paint = st.visited[i] && (e > 0 || st.u >= STOP_U[i]) || lit ? 1 : 0, step = CD.dt / CARD_TAIL.paintTime;
    c.paint = Math.max(0, Math.min(1, c.paint + Math.sign(paint - c.paint) * Math.min(step, Math.abs(paint - c.paint))));
    cardsStyle(c.fill, 'opacity', c.paint); cardsStyle(c.boss, 'opacity', c.paint);
    cardsStyle(c.glow, 'opacity', lit ? 1 : 0);
    if (c.mini && c.miniPaint !== c.paint) { c.miniPaint = c.paint; c.mini.style.setProperty('--paint', c.paint); }
    if (c.tail) cardsTailFrame(c, { W, H, k, cx: cx - p[0], cy: cy - py, stonePx, rx, ryTilt, sx, sy, lift });
    const state = e > .96 ? 'open' : e < .02 ? 'rest' : 'moving';
    if (state !== c.state) { c.state = state; c.el.dataset.state = state; c.face.inert = state !== 'open'; }
    // A stone mark is in the tab order only at rest and on screen (the keyboard never lands on a stop it cannot see).
    const tab = state === 'rest' && (document.activeElement === c.btn || p[0] >= 0 && p[0] <= VIEW.w && p[1] >= 0 && p[1] <= VIEW.h) ? 0 : -1;
    if (c.btn.tabIndex !== tab) c.btn.tabIndex = tab;
    if (c.reopenFocus && (JOURNEY.moving || st.kind !== 'hold' || st.i !== i)) c.reopenFocus = false;
    if (c.reopenFocus && state === 'open') { c.reopenFocus = false; c.el.querySelector('.c-close').focus({ preventScroll: true }); }
  });
}

// Project the actual face edge through its existing tilt, without a DOM layout read.
function cardsTailFrame(c, f) {
  const { W, H, k, cx, cy, stonePx, rx, ryTilt, sx, sy, lift } = f, cfg = DEPTH.card;
  const project = (x, y) => {
    const a = rx * Math.PI / 180, b = ryTilt * Math.PI / 180, z = -x * Math.sin(b), yy = y * Math.cos(a) - z * Math.sin(a), zz = y * Math.sin(a) + z * Math.cos(a);
    const perspective = lift ? cfg.perspective / (cfg.perspective - zz) : 1;
    return [cx + (x * Math.cos(b) + sx) * perspective * k, cy + (yy + sy) * perspective * k];
  };
  const base = VIEW.phone ? CARD_TAIL.basePhone : CARD_TAIL.base;
  const corners = [[-W/2,-H/2],[W/2,-H/2],[W/2,H/2],[-W/2,H/2]].map(p => project(...p)), centre = project(0,0), ray = centre.map(v => -v), cross = (a,b) => a[0]*b[1]-a[1]*b[0];
  let edge = VIEW.phone ? 0 : 3, along = .5, nearest = Infinity;
  for(let i=0;i<4;i++) {
    const a = corners[i], delta = corners[(i+1)%4].map((v,j) => v-a[j]), offset = a.map((v,j) => v-centre[j]), den = cross(ray,delta);
    if(Math.abs(den)<1e-9) continue;
    const travel = cross(offset,delta)/den, t = cross(offset,ray)/den;
    if(travel>=0 && travel<nearest && t>=0 && t<=1) { edge=i;along=t;nearest=travel; }
  }
  const a = corners[edge], delta = corners[(edge+1)%4].map((v,j) => v-a[j]), half = base / (2 * (edge%2 ? H : W));
  let b0 = a.map((v,j) => v + delta[j]*(along-half)), b1 = a.map((v,j) => v + delta[j]*(along+half));
  const mid = [(b0[0] + b1[0]) / 2, (b0[1] + b1[1]) / 2], distance = Math.hypot(...mid), rim = stonePx * (MARK.radius + MARK.rim / 2) / MARK.box + CARD_TAIL.gap;
  const tip = distance ? mid.map(v => v / distance * rim) : [rim, 0];
  if (distance < rim) { b0 = tip; b1 = tip; }
  const dx = b1[0] - b0[0], dy = b1[1] - b0[1];
  cardsStyle(c.tail, 'transform', `matrix(${tip[0] - b0[0] - dx / 2},${tip[1] - b0[1] - dy / 2},${dx},${dy},${b0[0]},${b0[1]})`);
  cardsStyle(c.tail, 'opacity', c.face.style.opacity);
}
export const cardsList = () => CD.list;
