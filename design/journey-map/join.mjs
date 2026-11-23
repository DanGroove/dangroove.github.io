// The joined page: Dan's real hero (hero-copy/) sits in the map's sticky stage. Through the hero act its content rises with
// the scroll and its stars stay as the sky; over the last vh of that act the map's star canvas takes the same stars over,
// then the hero goes away and the fall (the handoff act) carries every one of them onto the map.
import { ACTS, COPY } from './data.mjs';
import { smooth } from './trip.mjs';
import { starsJoin } from './stars.mjs';
import { JOIN } from './main.mjs';
import { JOURNEY, stepsProgress } from './steps.mjs';

const JN = {
  hero: document.querySelector('[data-hero]'), stage: document.getElementById('stage'), cv: document.getElementById('stars'),
  api: null, away: null, op: '', lastP: -1, dirty: true, lift: null,
  rm: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
};
JN.svg = document.getElementById('map'); JN.fxg = document.getElementById('fxg'); JN.fx = null; JN.ov = JN.stage.querySelector('.ov');
// vh of scroll: the leave ends at the end of the hero act; the canvas fades in over its last JOIN_OVERLAP vh
const LEAVE_END = ACTS.hero, JOIN_OVERLAP = 1;

// the hero's box is the stage's box: first in the stage (so it comes first in the tab order), above the map, under the canvas
JN.stage.prepend(JN.hero);
document.documentElement.classList.add('jm-joined');
JOIN.heroStart = true;

// Run before the hero's own entry script, without changing the copied hero files.
JN.cue = JN.hero.querySelector('[data-cue]'); JN.cueText = JN.cue ? JN.cue.textContent : '';
function joinStart() {
  if (JN.rm || !JN.cue) return;
  if (JOURNEY.mode === 'scroll') { JN.cue.textContent = JN.cueText; return; }
  const button = document.createElement('button'); button.type = 'button'; button.className = 'jm-start'; button.textContent = COPY.steps.start;
  button.addEventListener('click', () => JOURNEY.next()); JN.cue.replaceChildren(button);
}
joinStart(); window.addEventListener('jm-mode', joinStart);

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
    JN.svg.inert = !away; JN.ov.inert = !away;
    JN.dirty = true;
  }
}
const setOp = v => { const s = String(v); if (s !== JN.op) { JN.op = s; JN.cv.style.opacity = s; } };

JOIN.frame = (st, moved, P) => {
  place(P);
  const a = smooth(LEAVE_END - JOIN_OVERLAP, LEAVE_END, P);
  if (!JN.rm) {
    // the X is drawn from the start of the fall in the map as built; here it fades in with the sea, so the switch shows no pop
    const fx = st.handoffT < 1 ? smooth(.2, .7, st.handoffT).toFixed(3) : '';
    if (fx !== JN.fx) { JN.fx = fx; JN.fxg.style.opacity = fx; }
    if (P >= LEAVE_END) { setOp(st.dim); return undefined; }
    setOp(a);
    // the canvas is opaque while the hero is behind it, so its stars replace the hero's rather than adding to them
    return a > 0 && JN.api ? { ink: 1 } : false;
  }
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
window.addEventListener('scroll', () => { if (JOURNEY.mode === 'scroll') place(); }, { passive: true });
place();

// the hero's script has a top-level await: wait for its handle
(function wait() {
  const api = window.__heroJoin;
  if (!api) { setTimeout(wait, 50); return; }
  JN.api = api; starsJoin(api.stars); JN.dirty = true; place();
})();
