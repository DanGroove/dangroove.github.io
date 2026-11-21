// Journey hero: where the art sits on the page. Pure functions of the page's own measurements.
import { HOME, W, GAP, SA, add, mul } from './engine.mjs';

export const STRIPE = 0.105;                   // stripe width as a share of the hero's short side (the brand asks for 9 to 11%)
export const REACH = { w: 8.6, h: 9.0 };       // the room the loop needs around the stage centre, in stripe widths

// box: the stage box { x, y, w, h } in hero px. Returns the scale S (px per stripe width) and the stage centre.
export function fitStage(box, vw, vh) {
  return { S: Math.min(STRIPE * Math.min(vw, vh), box.w / REACH.w, box.h / REACH.h), cx: box.x + box.w / 2, cy: box.y + box.h / 2 };
}

// The opening: four stripes at 28.3deg, rising to the right, running off two edges of the hero.
// The band is placed against the text so that no text ever sits on a stripe:
//   under: boxes the band must pass under. Its top edge stays `gapUnder` px below the bottom right corner of each.
//   over:  boxes the band must pass over. Its bottom edge stays `gapOver` px above the top left corner of each.
// With only `under` boxes the band sits as high as they allow. With `over` boxes it sits as low as they allow, and if the room between
// the two sets is too small for full-size stripes the opening is drawn smaller (zoom < 1) and grows to full size as it folds into the deck.
// labelEnd: the x at which every label ends. Boxes are { left, top, right, bottom } in hero px.
export function planEntrance({ vw, vh, S, cx, cy, under = [], over = [], gapUnder = 36, gapOver = 0, labelEnd }) {
  const k = Math.tan(SA), band = (4 * W + 3 * GAP) / Math.cos(SA);           // the slope; the band's thickness measured straight down, in stripe widths
  // the top edge is the line y = a - k x
  const aMin = under.length ? Math.max(...under.map(r => r.bottom + gapUnder + k * r.right)) : null;
  let SE = S, a;
  if (over.length) {
    const aMax = Math.min(...over.map(r => r.top - gapOver + k * r.left));    // the same for the bottom edge
    if (aMin !== null) SE = Math.max(0.6 * S, Math.min(S, (aMax - aMin) / band));
    a = aMax - band * SE;
  } else a = aMin ?? vh / 2;
  const toWorld = (x, y) => add(mul(HOME.r, (x - cx) / SE), mul(HOME.u, -(y - cy) / SE));
  const dir = [Math.cos(SA), -Math.sin(SA)];
  const entrance = [0, 1, 2, 3].map(i => {
    const q = [0, a + (i * (W + GAP) + W / 2) * SE / Math.cos(SA)];           // where this stripe's centre line meets the left edge
    const t0 = Math.max((-SE - q[0]) / dir[0], (q[1] - (vh + SE)) / Math.sin(SA));   // it comes in at the left edge or the bottom edge
    const t1 = Math.min((vw + SE - q[0]) / dir[0], (q[1] + SE) / Math.sin(SA));      // and leaves at the right edge or the top edge
    const P = t => toWorld(q[0] + dir[0] * t, q[1] + dir[1] * t);
    return { from: P(t0), to: P(t1), labelEnd: ((labelEnd - q[0]) / dir[0] - t0) / SE };
  });
  return { entrance, zoom: SE / S };
}
