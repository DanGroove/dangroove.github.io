// The timeline bar: a quiet instrument pinned to the bottom; in the footer it becomes the rule under the name.
import { STOPS, PALETTES, COPY, FINDS, FIND_PLAY } from './data.mjs';
import { yearOf, DATE_NOW, progressForStop, progressForDate, holdStart, VIEW, smooth, lerp, easeIO } from './trip.mjs';

const TL = { el: null, track: null, head: null, rows: null, fades: [], blocks: [], tip: null, count: null, trackW: 1, viewW: 1, sx: 1, dx: 0, dy: 0, ox: 0, oy: 0, val: '', drag: null, off: 0, rm: false };
const Y0 = 2016;
const xOf = d => (d - Y0) / (DATE_NOW - Y0);
const fmt = (s, o) => s.replace(/\{(\w+)\}/g, (m, k) => o[k]);

export function tlBuild(el, hooks, rm) {
  TL.el = el; TL.hooks = hooks; TL.rm = rm;
  let ticks = ''; for (let y = Y0; y <= Math.floor(DATE_NOW); y++) ticks += `<i class="tl-tick" style="left:${(xOf(y) * 100).toFixed(3)}%"><b>'${String(y % 100).padStart(2, '0')}</b></i>`;
  let blocks = { school: '', work: '' };
  STOPS.forEach((s, i) => s.spans.forEach(sp => { const a = xOf(yearOf(sp[0])), b = xOf(yearOf(sp[1], 1)); blocks[s.track] += `<span class="tl-blk" data-i="${i}" style="left:${(a * 100).toFixed(3)}%;width:${((b - a) * 100).toFixed(3)}%;--mk:${PALETTES[s.palette].mark}"><em></em></span>`; }));
  el.innerHTML = `<div class="tl-bg tl-f"></div><div class="tl-view"><div class="tl-track"><div class="tl-ticks tl-f">${ticks}</div><div class="tl-rows tl-f"><div class="tl-row">${blocks.school}</div><div class="tl-row">${blocks.work}</div></div><div class="tl-head"><svg viewBox="-8 -8 16 16" aria-hidden="true"><path d="M0 -7Q0 0 7 0Q0 0 0 7Q0 0 -7 0Q0 0 0 -7Z"/></svg></div></div></div><div class="tl-base"></div><span class="tl-count tl-f" aria-live="polite"></span><div class="tl-tip" aria-hidden="true"></div>`;
  el.setAttribute('role', 'slider'); el.tabIndex = 0; el.setAttribute('aria-label', COPY.timeline);
  el.setAttribute('aria-valuemin', Y0); el.setAttribute('aria-valuemax', Math.floor(DATE_NOW));
  TL.track = el.querySelector('.tl-track'); TL.head = el.querySelector('.tl-head'); TL.rows = el.querySelector('.tl-rows');
  TL.fades = [...el.querySelectorAll('.tl-f')]; TL.tip = el.querySelector('.tl-tip'); TL.count = el.querySelector('.tl-count');
  TL.blocks = [...el.querySelectorAll('.tl-blk')].map(b => ({ el: b, em: b.firstChild, i: +b.dataset.i }));
  TL.view = el.querySelector('.tl-view'); TL.base = el.querySelector('.tl-base');
  TL.blocks.forEach(b => {
    b.el.addEventListener('pointerenter', () => tipFor(b.i, b.el));
    b.el.addEventListener('pointerleave', () => TL.tip.classList.remove('on'));
  });
  el.addEventListener('focus', () => { const i = currentStop(TL.lastP || 0); if (i >= 0) tipFor(i, null); });
  el.addEventListener('blur', () => TL.tip.classList.remove('on'));
  el.addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return; e.preventDefault();
    const P = TL.lastP || 0, cur = currentStop(P);
    let i = e.key === 'ArrowRight' ? cur + 1 : (P > progressForStop(Math.max(cur, 0)) + 1 ? cur : cur - 1);
    i = Math.max(0, Math.min(STOPS.length - 1, i)); TL.hooks.jump(i);
  });
  el.addEventListener('pointerdown', e => {
    TL.drag = { x: e.clientX, moved: false, P: TL.lastP || 0, blk: e.target.closest('.tl-blk') };
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener('pointermove', e => {
    const d = TL.drag; if (!d || TL.rm) return;
    if (!d.moved && Math.abs(e.clientX - d.x) < 4) return; d.moved = true;
    if (!d.started) { d.started = true; TL.dateStart = TL.lastDate; }
    const r = TL.viewRect; let date;
    if (VIEW.phone) date = TL.dateStart - (e.clientX - d.x) / TL.trackW * (DATE_NOW - Y0);
    else date = Y0 + (e.clientX - r.left) / TL.trackW * (DATE_NOW - Y0);
    TL.hooks.scrub(progressForDate(Math.max(Y0, Math.min(DATE_NOW, date))));
  });
  const end = () => { const d = TL.drag; TL.drag = null; if (d && !d.moved && d.blk) TL.hooks.jump(+d.blk.dataset.i); };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', () => { TL.drag = null; });
}
function tipFor(i, blk) {
  const s = STOPS[i]; TL.tip.textContent = fmt(COPY.timelineValue, { name: s.name, dates: s.dates });
  const r = blk ? blk.getBoundingClientRect() : null, er = TL.el.getBoundingClientRect();
  TL.tip.style.transform = `translateX(${Math.max(8, Math.min(er.width - 220, (r ? r.left - er.left : TL.headX + TL.viewRect.left - er.left) - 10)).toFixed(0)}px)`;
  TL.tip.classList.add('on');
}
const currentStop = P => { let c = -1; STOPS.forEach((s, i) => { if (P >= holdStart(i)) c = i; }); return c; };
export const tlSetCount = (n, t) => { TL.count.textContent = fmt(COPY.count, { n, t }); };
export const tlSetCraft = mask => TL.blocks.forEach(b => { b.el.classList.toggle('craft-lit', !!mask?.[b.i]); b.el.style.opacity = mask && !mask[b.i] ? FIND_PLAY.way.timelineDim : 1; });

export function tlResize(ruleRect) {
  const el = TL.el; el.style.transform = 'none';
  TL.viewRect = TL.view.getBoundingClientRect(); TL.viewW = TL.viewRect.width;
  TL.trackW = VIEW.phone ? TL.viewW * 2.4 : TL.viewW; TL.track.style.width = TL.trackW + 'px';
  if (ruleRect) {
    const b = TL.base.getBoundingClientRect(), er = el.getBoundingClientRect();
    TL.ox = b.left - er.left; TL.oy = b.top - er.top; el.style.transformOrigin = `${TL.ox}px ${TL.oy}px`;
    TL.sx = ruleRect.width / b.width; TL.dx = ruleRect.left - b.left; TL.dy = ruleRect.top - b.top;
  }
}
export function tlFrame(st) {
  TL.lastP = st.P; TL.lastDate = st.date;
  if (TL.rm) return;
  const show = easeIO(smooth(0, .4, st.overviewT));
  const m = easeIO(smooth(.3, .85, st.settleT)), fade = (1 - st.cardOpen * .9) * (1 - smooth(0, .6, st.rushT));
  const sx = lerp(1, TL.sx, m);
  TL.el.style.transform = `translate(${(TL.dx * m).toFixed(2)}px,${(TL.dy * m + (1 - show) * 80).toFixed(2)}px) scaleX(${sx.toFixed(4)})`;
  TL.el.style.opacity = show;
  TL.fades.forEach(f => f.style.opacity = fade);
  TL.rows.style.transform = `scaleY(${(1 - st.cardOpen * .85).toFixed(3)})`;
  const hx = xOf(st.date) * TL.trackW; TL.headX = hx;
  TL.off = VIEW.phone ? Math.max(TL.viewW - TL.trackW, Math.min(0, TL.viewW / 2 - hx)) : 0;
  TL.track.style.transform = `translateX(${TL.off.toFixed(2)}px)`;
  TL.headX = hx + TL.off;
  TL.head.style.transform = `translateX(${hx.toFixed(2)}px) scaleX(${(1 / sx).toFixed(4)})`;
  TL.blocks.forEach(b => b.em.style.opacity = st.visited[b.i] ? 1 : 0);
  const i = currentStop(st.P), v = i < 0 ? COPY.timelineStart : fmt(COPY.timelineValue, { name: STOPS[i].name, dates: STOPS[i].dates });
  if (v !== TL.val) { TL.val = v; TL.el.setAttribute('aria-valuetext', v); TL.el.setAttribute('aria-valuenow', Math.floor(st.date)); }
}
