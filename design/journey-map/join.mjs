// The joined page: Dan's real hero (hero-copy/) sits in the map's sticky stage. Through the hero act its content rises with
// the scroll and its stars stay as the sky; over the last vh of that act the map's star canvas takes the same stars over,
// then the hero goes away and the fall (the handoff act) carries every one of them onto the map.
import { ACTS, COPY, COMB } from './data.mjs';
import { smooth, VIEW } from './trip.mjs';
import { starsJoin } from './stars.mjs';
import { JOIN } from './main.mjs';
import { JOURNEY, stepsProgress, stepsHoldTop } from './steps.mjs';

const JN = {
  hero: document.querySelector('[data-hero]'), stage: document.getElementById('stage'), cv: document.getElementById('stars'),
  api: null, away: null, op: '', lastP: -1, dirty: true, lift: null,
  rm: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
};
if (JN.rm) VIEW.mapReady = false;
JN.base = document.getElementById('map-base'); JN.svg = document.getElementById('map'); JN.hit = document.getElementById('nova-hit'); JN.ov = JN.stage.querySelector('.ov');
// vh of scroll: the leave ends at the end of the hero act; the canvas fades in over its last JOIN_OVERLAP vh
const LEAVE_END = ACTS.hero, JOIN_OVERLAP = COMB.handoverOverlap;

// the hero's box is the stage's box: first in the stage (so it comes first in the tab order), above the map, under the canvas
JN.stage.prepend(JN.hero);
document.documentElement.classList.add('jm-joined');
JOIN.heroStart = true;
JOIN.reduce = on => { JN.rm = on; JN.dirty = true; };
// Nothing leaves the hero while its loader runs: input at the top waits for the hero (its handle, then the end of its loader).
// If the hero never answers, input is let through after 15 s rather than held for good.
stepsHoldTop(() => JN.api ? window.__hero?.loading === true : performance.now() < 15000);

// Run before the hero's own entry script, without changing the copied hero files.
JN.cue = JN.hero.querySelector('[data-cue]');
function joinStart() {
  if (JN.rm || !JN.cue) return;
  const button = document.createElement('button'); button.type = 'button'; button.className = 'jm-start'; button.innerHTML = COPY.steps.start + '<svg class="arr" viewBox="0 0 14 10" aria-hidden="true"><path d="M1 5h11M8 1l4 4l-4 4"/></svg>';
  button.addEventListener('click', () => JOURNEY.next()); JN.cue.replaceChildren(button);
}
joinStart();

const unit = () => window.innerHeight / 100;
// The hero is present until the end of the leave, away from then on. Present, it takes every pointer and key and the map
// is inert; away, it is hidden, takes nothing, and draws nothing.
function place(P = stepsProgress()) {
  const away = P >= LEAVE_END, api = JN.api;
  if (api) {
    if (!away) api.setAway(false);
    const lift = Math.min(P, LEAVE_END) * unit();
    if (lift !== JN.lift) {
      JN.lift = lift; api.setLeave(lift);
      if (JOURNEY.mode === 'steps') window.dispatchEvent(new Event('scroll'));
    }
    if (away) api.setAway(true);
  }
  if (away !== JN.away) {
    JN.away = away;
    JN.hero.classList.toggle('jm-away', away);
    JN.svg.inert = !away; JN.ov.inert = !away; if (JN.base) JN.base.inert = !away;
    if (JN.hit) JN.hit.inert = !away;
    JN.dirty = true;
  }
}
const setOp = v => { const s = String(v); if (s !== JN.op) { JN.op = s; JN.cv.style.opacity = s; } };

JOIN.leave = place;
JOIN.frame = (st, moved, P) => {
  const a = smooth(LEAVE_END - JOIN_OVERLAP, LEAVE_END, P);
  if (!JN.rm) {
    if (P >= LEAVE_END) { setOp(st.dim); return undefined; }
    setOp(a);
    // the canvas is opaque while the hero is behind it, so its stars replace the hero's rather than adding to them
    return a > 0 && JN.api ? { ink: 1 } : false;
  }
  const mapAlpha = Math.max(0, Math.min(1, (P-LEAVE_END)/ACTS.handoff));
  VIEW.mapReady = mapAlpha === 1;
  if (JN.mapAlpha !== mapAlpha) { JN.mapAlpha = mapAlpha; document.documentElement.style.setProperty('--joined-map-alpha', mapAlpha); document.documentElement.classList.toggle('jm-rm-map', VIEW.mapReady); }
  const timeline = document.getElementById('tl'); if (timeline.inert !== !VIEW.mapReady) timeline.inert = !VIEW.mapReady;
  // reduced motion: the leave as above, then the fall is a cross-fade from the sky to the map's own still
  if (P === JN.lastP && !JN.dirty) return null;
  JN.lastP = P; JN.dirty = false;
  if (P < LEAVE_END) { setOp(a); return a > 0 && JN.api ? { ink: 1, sky: 1, map: 0 } : false; }
  setOp(1);
  const k = Math.min(1, (P - LEAVE_END) / ACTS.handoff);
  return JN.api && k < 1 ? { ink: 1 - k, sky: 1 - k, map: k } : { map: 1 };
};
JOIN.resize = (w, h) => {
  // reduced motion keeps the stage sticky through the leave and the cross-fade
  if (JN.rm) document.getElementById('trip').style.height = ((ACTS.hero + ACTS.handoff) * h / 100 + h) + 'px';
  JN.dirty = true; place();
};
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => { JN.rm = e.matches; JN.dirty = true; if (!JN.rm && !JN.cue?.querySelector('.jm-start')) joinStart(); JOIN.resize(window.innerWidth, window.innerHeight); });
window.addEventListener('scroll', () => { if (JN.rm) place(); }, { passive: true });
place();

// the hero's script has a top-level await: wait for its handle
(function wait() {
  const api = window.__heroJoin;
  if (!api) { setTimeout(wait, 50); return; }
  JN.api = api; starsJoin(api.stars); JN.dirty = true; place();
})();
