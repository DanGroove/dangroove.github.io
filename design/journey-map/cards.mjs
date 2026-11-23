// Stop marks that grow into cards. Each card is one article: the standing stone at rest, the card when open.
import { STOPS, PALETTES, COPY, CRAFTS, MAP, STEPS, DEPTH } from './data.mjs';
import { stoneSvg } from './art.mjs';
import { VIEW, toScreen, smooth } from './trip.mjs';

const CD = { list: [], W: 640, H: 420, craft: null, onGo: null };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
export const arrowSvg = '<svg class="arr" viewBox="0 0 14 10" aria-hidden="true"><path d="M1 5h11M8 1l4 4l-4 4"/></svg>';

export function cardsBuild(container, onGo) {
  CD.onGo = onGo;
  STOPS.forEach((s, i) => {
    const p = PALETTES[s.palette], cp = s.copy, a = document.createElement('article');
    a.className = `stop lay-${p.layout}`; a.id = `stop-${s.id}`; a.setAttribute('aria-labelledby', `h-${s.id}`);
    const vars = { '--g': p.ground, '--tx': p.text, '--sub': p.sub, '--btn': p.button, '--btx': p.buttonText, '--pill': p.pill, '--ptx': p.pillText, '--band': p.band, '--hd': p.headline, '--mk': p.mark, '--hair': p.hairline };
    if (p.smallWeight !== undefined) vars['--sw'] = p.smallWeight;
    if (p.chip) vars['--chip'] = p.chip;
    if (p.chipText) vars['--chtx'] = p.chipText;
    Object.entries(vars).forEach(([k, v]) => a.style.setProperty(k, v));
    const piece = cp.piece ? `<img src="${cp.piece}" alt="${esc(cp.caption)}">` : `<div class="c-empty">${COPY.pieceToCome}</div>`;
    const steps = cp.steps ? `<ol class="c-steps">${cp.steps.map(t => `<li>${esc(t)}</li>`).join('')}</ol>` : '';
    a.innerHTML = `<button class="st-btn" type="button" aria-label="${esc(COPY.stoneGo.replace('{name}', s.name).replace('{dates}', s.dates))}">${stoneSvg(s.rune)}</button>
<div class="c-sh" aria-hidden="true"></div><div class="face"><div class="c-in">
<header class="c-top"><img class="c-logo" src="${p.logo}" alt="${esc(s.name)}"><span class="c-pill">${esc(s.dates)}</span></header>
<div class="c-body"><div class="c-main"><h2 class="c-h" id="h-${s.id}">${esc(cp.headline)}</h2><p class="c-role">${esc(s.role)}</p><p class="c-para">${esc(cp.para)}</p>${steps}
<p class="c-kick">${COPY.took}</p><p class="c-took">${esc(cp.took)}</p></div>
<div class="c-side"><figure class="c-piece">${piece}${cp.caption ? `<figcaption>${esc(cp.caption)}</figcaption>` : ''}</figure>
<ul class="c-crafts">${CRAFTS.map(c => `<li class="${s.crafts.includes(c) ? 'lit' : ''}"><i></i>${c}</li>`).join('')}</ul>
<button class="c-btn" type="button">${COPY.caseStudy}${arrowSvg}</button></div></div></div></div>`;
    a.querySelector('.st-btn').addEventListener('click', () => CD.onGo(i));
    container.appendChild(a);
    CD.list.push({ el: a, face: a.querySelector('.face'), shadow: a.querySelector('.c-sh'), inn: a.querySelector('.c-in'), btn: a.querySelector('.st-btn'), fill: a.querySelector('.st-fill'), glow: a.querySelector('.st-glow'), stop: s, state: '', tilt: [0, 0, 0, 0] });
  });
}
export function cardsResize(steps = false) {
  CD.steps = steps;
  if (VIEW.phone) {
    CD.W = VIEW.w; let hmax = 0;
    CD.list.forEach(c => { c.el.style.width = CD.W + 'px'; c.el.style.height = 'auto'; hmax = Math.max(hmax, c.inn.scrollHeight); });
    CD.H = Math.min(Math.round(VIEW.h * .82) - (steps ? STEPS.nav.bar : 0), hmax + 2);
  } else {
    CD.W = Math.min(640, VIEW.w - 32); CD.H = steps ? Math.max(1, Math.min(420, VIEW.h - 56 - STEPS.nav.gap - STEPS.nav.h - 24)) : 420;
  }
  CD.list.forEach(c => { c.el.style.width = CD.W + 'px'; c.el.style.height = CD.H + 'px'; cardsDepthConfig(c); });
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

export function cardsFrame(st, look = [0, 0], pointer = [0.5, 0.5]) {
  const W = CD.W, H = CD.H, op = smooth(.5, 1, st.handoffT) * (1 - smooth(0, .4, st.blastT));
  const stonePx = Math.max(15, Math.min(44, 12.5 * st.cam.s));
  const stepTop = VIEW.h - 56 - STEPS.nav.gap - STEPS.nav.h;
  const oc = VIEW.phone ? [VIEW.w / 2, VIEW.h - H / 2 - 6 - (CD.steps ? STEPS.nav.bar : 0)]
    : [VIEW.w / 2, CD.steps ? Math.max(12 + H / 2, Math.min(VIEW.h / 2 - 12, stepTop - 12 - H / 2)) : VIEW.h / 2 - 12];
  CD.list.forEach((c, i) => {
    const e = st.cardK[i], p = toScreen(st, MAP.waypoints[c.stop.w]);
    const k0 = stonePx / (H * .95), k = Math.pow(k0, 1 - e);
    const cx = p[0] + (oc[0] - p[0]) * e, ry = p[1] - stonePx * .5 - 5, cy = ry + (oc[1] - ry) * e;
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
  });
}
export const cardsList = () => CD.list;
