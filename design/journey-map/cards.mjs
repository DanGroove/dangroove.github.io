// Stop marks that grow into cards. Each card is one article: the standing stone at rest, the card when open.
import { STOPS, PALETTES, COPY, CRAFTS, MAP, STEPS, DEPTH, CARD_CLOSE, MARK, WORLD } from './data.mjs';
import { shieldSvg } from './art.mjs';
import { VIEW, toScreen, smooth, easeIO, lerp } from './trip.mjs';
import { JOURNEY } from './steps.mjs';

const CD = { list: [], W: 640, H: 420, craft: null, onGo: null, rm: false, closed: null, last: null };
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
    if (p.panel) Object.assign(vars, { '--panel': p.panel, '--panel-text': p.panelText, '--panel-hair': p.panelHair, '--panel-btn': p.panelButton, '--panel-btx': p.panelButtonText });
    if (p.arrow) vars['--arrow'] = p.arrow;
    if (p.smallWeight !== undefined) vars['--sw'] = p.smallWeight;
    if (p.chip) vars['--chip'] = p.chip;
    if (p.chipText) vars['--chtx'] = p.chipText;
    Object.entries(vars).forEach(([k, v]) => a.style.setProperty(k, v));
    const piece = cp.piece ? `<img src="${cp.piece}" alt="${esc(cp.caption)}">` : `<div class="c-empty">${COPY.pieceToCome}</div>`;
    const steps = cp.steps ? `<ol class="c-steps">${cp.steps.map(t => `<li>${esc(t)}</li>`).join('')}</ol>` : '';
    a.innerHTML = `<button class="st-btn" type="button" aria-label="${esc(COPY.stoneGo.replace('{name}', s.name).replace('{dates}', s.dates))}">${shieldSvg()}</button>
<div class="c-sh" aria-hidden="true"></div><div class="face"><div class="c-in">
<header class="c-top"><img class="c-logo" src="${p.logo}" alt="${esc(s.name)}"><span class="c-pill">${esc(s.dates)}</span></header>
<h2 class="c-h" id="h-${s.id}">${esc(cp.headline)}</h2><div class="c-panel"><div class="c-body"><div class="c-main"><p class="c-role">${esc(s.role)}</p><p class="c-para">${esc(cp.para)}</p>${steps}
<p class="c-kick">${COPY.took}</p><p class="c-took">${esc(cp.took)}</p></div>
<div class="c-side"><figure class="c-piece">${piece}${cp.caption ? `<figcaption>${esc(cp.caption)}</figcaption>` : ''}</figure></div></div>
<div class="c-foot"><ul class="c-crafts">${CRAFTS.map(c => `<li class="${s.crafts.includes(c) ? 'lit' : ''}"><i></i>${c}</li>`).join('')}</ul>
<button class="c-btn" type="button">${COPY.caseStudy}${arrowSvg}</button></div></div></div></div>${rm ? '' : `<button class="c-close" type="button" aria-label="${esc(COPY.cardClose.replace('{name}', s.name))}"><i aria-hidden="true"></i></button>`}`;
    a.querySelector('.st-btn').addEventListener('click', () => {
      if (CD.closed?.i === i && CD.last?.P === CD.closed.P && !JOURNEY.moving) { CD.closed = { ...CD.closed, from: CD.closed.k, to: 1, elapsed: 0 }; CD.list[i].reopenFocus = true; return; }
      CD.onGo(i);
    });
    a.querySelector('.c-close')?.addEventListener('click', () => cardsClose(i));
    container.appendChild(a);
    CD.list.push({ el: a, face: a.querySelector('.face'), shadow: a.querySelector('.c-sh'), inn: a.querySelector('.c-in'), btn: a.querySelector('.st-btn'), fill: a.querySelector('.st-fill'), glow: a.querySelector('.st-glow'), stop: s, state: '', tilt: [0, 0, 0, 0] });
  });
  if (!rm) document.fonts?.ready.then(() => cardsResize(CD.steps));
}
export function cardsResize(steps = false) {
  CD.steps = steps;
  document.documentElement.style.setProperty('--card-close-radius', (VIEW.phone ? CARD_CLOSE.radiusPhone : CARD_CLOSE.radius) + 'px');
  const Q = WORLD.card; CD.W = VIEW.phone ? VIEW.w : Math.min(Q.w, VIEW.w - Q.edge);
  const cap = VIEW.phone ? Math.round(VIEW.h * Q.phoneShare) - (steps ? STEPS.nav.bar : 0) : steps ? Math.max(1, Math.min(Q.cap, VIEW.h - 56 - STEPS.nav.gap - STEPS.nav.h - Q.gap * 2)) : Q.cap;
  CD.list.forEach(c => { c.el.style.width = CD.W + 'px'; c.el.style.height = 'auto'; c.inn.style.minHeight = '0'; c.H = Math.min(cap, c.inn.scrollHeight + Q.slack); c.el.style.height = c.H + 'px'; cardsDepthConfig(c); });

}
function cardsDepthConfig(c) {
  const cfg = DEPTH.card, lift = !!VIEW.depth && !VIEW.phone;
  c.depthConfig = lift ? `${cfg.perspective}/${cfg.blur}/${cfg.spread}/${cfg.radius}` : '';
  c.el.style.perspective = lift ? cfg.perspective + 'px' : '';
  c.shadow.style.boxShadow = `0 0 ${cfg.blur}px ${cfg.spread}px var(--shade)`; c.shadow.style.borderRadius = cfg.radius + 'px';
  c.depthPending = false;
}
export const cardsSetCraft = mask => { CD.craft = mask; };
export const cardsLitBy = craft => STOPS.map(s => s.crafts.includes(craft));

export function cardsClose(index = CD.last?.i) {
  const st = CD.last;
  if (CD.rm || JOURNEY.moving || !st || st.kind !== 'hold' || st.cardK[index] <= 0 || (CD.closed?.to === 0)) return false;
  CD.closed = { i: index, P: st.P, k: st.cardK[index], from: st.cardK[index], to: 0, elapsed: 0 };
  if (CD.list[index].el.contains(document.activeElement)) CD.list[index].btn.focus({ preventScroll: true });
  return true;
}
export function cardsOverride(st, dt, moving) {
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
  const W = CD.W, op = smooth(.5, 1, st.handoffT) * (1 - smooth(0, .4, st.blastT) * (1 - (st.exploreK || 0)));
  const stonePx = Math.max(MARK.min, Math.min(MARK.max, MARK.k * st.cam.s));
  const stepTop = VIEW.h - 56 - STEPS.nav.gap - STEPS.nav.h;
  CD.list.forEach((c, i) => {
    const H = c.H, oc = VIEW.phone ? [VIEW.w / 2, VIEW.h - H / 2 - WORLD.card.phoneBottom - (CD.steps ? STEPS.nav.bar : 0)] : [VIEW.w / 2, CD.steps ? Math.max(WORLD.card.gap + H / 2, Math.min(VIEW.h / 2 - WORLD.card.gap, stepTop - WORLD.card.gap - H / 2)) : VIEW.h / 2 - WORLD.card.gap];
    const e = st.cardK[i], p = toScreen(st, MAP.waypoints[c.stop.w]);
    const k0 = stonePx / (H * .95), k = Math.pow(k0, 1 - e);
    const cx = p[0] + (oc[0] - p[0]) * e, ry = p[1] - stonePx * .5 - MARK.stand, cy = ry + (oc[1] - ry) * e;
    c.el.style.transform = `translate(${(cx - W * k / 2).toFixed(2)}px,${(cy - H * k / 2).toFixed(2)}px) scale(${k.toFixed(5)})`;
    const lit = CD.craft ? CD.craft[i] : false;
    c.el.style.opacity = op * (CD.craft && !lit ? .55 : 1);
    c.btn.style.opacity = 1 - smooth(0, .3, e);
    c.face.style.opacity = smooth(.01, .1, e);
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
    c.face.style.transform = lift ? `${sx || sy ? `translate(${sx}px,${sy}px) ` : ''}${rx ? `rotateX(${rx}deg) ` : ''}${ryTilt ? `rotateY(${ryTilt}deg)` : ''}`.trim() : '';
    c.shadow.style.opacity = lift ? cfg.shadow * e : 0;
    c.shadow.style.transform = `translate(${-sx / cfg.shadowShare}px,${cfg.drop * e - sy / cfg.shadowShare}px)`;
    c.inn.style.opacity = smooth(.4, .62, k);
    c.fill.style.opacity = st.visited[i] || lit ? 1 : 0;
    c.glow.style.opacity = lit ? 1 : 0;
    const state = e > .96 ? 'open' : e < .02 ? 'rest' : 'moving';
    if (state !== c.state) { c.state = state; c.el.dataset.state = state; c.face.inert = state !== 'open'; c.btn.tabIndex = state === 'rest' ? 0 : -1; }
    if (c.reopenFocus && (JOURNEY.moving || st.kind !== 'hold' || st.i !== i)) c.reopenFocus = false;
    if (c.reopenFocus && state === 'open') { c.reopenFocus = false; c.el.querySelector('.c-close').focus({ preventScroll: true }); }
  });
}
export const cardsList = () => CD.list;
