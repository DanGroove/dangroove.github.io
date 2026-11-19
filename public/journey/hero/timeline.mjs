// Journey hero: the move list. state = stateAt(seconds, entrance, zoomE) and nothing else: no hidden state, so any moment can be drawn on its own.
// This file is the choreography. Its numbers are design decisions: change them only on the design lead's say.
import { W, T, HOME, dot, add, sub, mul, cross, norm, lerp, lerp3, rotY, rotAxis, quatFromBasis, quatSlerp, quatRotate, EASE, barBoxes } from './engine.mjs';

export const IDS = ['B0', 'B1', 'B2', 'B3'];
export const LABELS = { B0: 'GRAPHIC', B1: 'VIDEO', B2: 'MOTION', B3: 'UX/UI' };
export const LL = { B0: 4.04, B1: 2.87, B2: 3.70, B3: 2.52 };     // label lengths in W (Outfit 800, cap height 0.6 W, tracking 0.027em)
export const CRAFTS = ['Graphic design', 'Video', 'Motion', 'UX/UI'];
export const ENTRANCE = 2, BEATS = 12;                            // seconds: stripes draw on, hold; then the loop, one beat a second
export const ARRIVED = [1, 4, 7, 10];                             // loop beat at which each craft has arrived and is about to act: where a jump to that craft lands
export const STILL = [2.99, 4, 6.3, 10];                          // loop time of each craft's still picture, for reduced motion
const RAD = Math.PI / 180, SAD = 28.3;

const LEVEL = { B3: 0, B2: 1, B1: 2, B0: 3 };                     // the deck on the floor, bottom to top
const FAN = { B0: 0, B1: 1, B2: 2, B3: 3 };                       // the fan: steps of 28.3deg away from the deck's axis
const ROW = { B3: 0.5, B2: 1.8, B0: 3.1, B1: 4.4 };               // the stack on a wall: centre heights
const TURN = { B1: 0, B0: 1, B2: 2, B3: 3 };                      // the twist runs down the stack from the top
const mapIds = f => Object.fromEntries(IDS.map(id => [id, f(id)]));

// ---- three planes. Every object is a flat layout on one of them: a frame, and for each bar a place in that frame.
//      place = { x, y, a, z, len, lab }: centre (x along, y across), in-plane angle a in degrees, layer z off the plane.
let OG = [0, 0, 0], OW = [0, 0, 0];                               // set by centreOnStage() so every picture is centred
const FRAME = {
  floor: () => ({ o: OG, ex: [0, 0, -1], ey: [-1, 0, 0] }),       // origin at the deck's rivet, looking along the deck
  right: () => ({ o: OW, ex: [0, 0, -1], ey: [0, 1, 0] }),        // the right-hand wall, origin at the foot of the stack's axis
  left: () => ({ o: OW, ex: [1, 0, 0], ey: [0, 1, 0] }),          // the left-hand wall, same origin
};
function put(frame, id, p, col) {
  const ez = cross(frame.ex, frame.ey), c = Math.cos(p.a * RAD), s = Math.sin(p.a * RAD);
  const ex = add(mul(frame.ex, c), mul(frame.ey, s)), ey = add(mul(frame.ex, -s), mul(frame.ey, c));
  return { id, c: add(frame.o, add(mul(frame.ex, p.x), add(mul(frame.ey, p.y), mul(ez, p.z)))), ex, ey, len: p.len, lab: p.lab, col, arms: p.arms ?? 0, drop: p.drop ?? 0, half: p.half ?? 0, wipe: null };
}
const build = (frame, layout, red) => mapIds(id => put(frame, id, layout[id], id === red ? 'red' : 'paper'));

// 01 graphic design: a swatch deck on the floor, riveted at one end. open 0..1 fans it, slide 0..1 draws the red chip out.
export const SLIDE = 1.3, SHUT = 0.15;                            // the shut deck stays a touch fanned, so all four chips show
const layG = ({ open = 1, slide = 0 } = {}) => mapIds(id => {
  const a = -SAD * FAN[id] * open, d = 2.7 + (id === 'B0' ? slide * SLIDE : 0);
  return { x: d * Math.cos(a * RAD), y: d * Math.sin(a * RAD), a, z: T / 2 + LEVEL[id] * T, len: 6.2, lab: 3.2 - LL[id] };
});
export const actG = p => build(FRAME.floor(), layG(p), 'B0');

// 02 video: a clapperboard on the right-hand wall. open = angle of the stick in degrees (28.3 open, 0 shut), hinged at its lower left corner.
const layV = ({ open = SAD } = {}) => mapIds(id => {
  if (id !== 'B1') return { x: 0, y: ROW[id], a: 0, z: 0, len: 4, lab: -2 };
  const c = Math.cos(open * RAD), s = Math.sin(open * RAD);
  return { x: -2.5 + 2.5 * c - 0.5 * s, y: ROW.B1 - 0.5 + 2.5 * s + 0.5 * c, a: open, z: 0, len: 4, lab: -2 };
});
export const actV = p => build(FRAME.right(), layV(p), 'B1');

// 03 motion: the same stack, each bar turned about the vertical axis by its own angle (0 = right-hand wall, -90 = left-hand wall)
export function actM(angle) {
  return mapIds(id => ({ id, c: add(OW, [0, ROW[id], 0]), ex: rotY([0, 0, -1], angle[id]), ey: [0, 1, 0], len: 4, lab: -2, col: id === 'B2' ? 'red' : 'paper', arms: 0, drop: 0, half: 0, wipe: null }));
}

// 04 UX/UI: a window on the left-hand wall. B1 is the frame (arms 0..1 draw it), B0 and B2 are rows set flush in it, B3 is the button floating in front.
// press 0..1 pushes the button in. swap 0..1 trades the two rows, B0 swinging out toward the viewer to pass in front.
// The margins are chosen so the knockout leaves one even gap all round: 0.3 at the sides and under the lower row, 0.45 where a row's top face shows.
const NEAR = [HOME.v[0] / HOME.v[2], HOME.v[1] / HOME.v[2]];      // a layer z nearer the viewer, slid by z * NEAR in the plane, has not moved as seen from the home view
const layU = ({ arms = 1, press = 0, swap = 0 } = {}) => {
  const rowY = k => lerp(3.25, 1.8, k), pass = 0.6 * Math.min(1, 5 * swap, 5 * (1 - swap));
  return {
    B1: { x: 0, y: 4.7, a: 0, z: 0, len: 6.5, lab: -3.2, arms, drop: 4.2, half: 3.25 },
    B0: { x: 0, y: rowY(swap), a: 0, z: pass, len: 3.9, lab: -1.95 },
    B2: { x: -0.15, y: rowY(1 - swap), a: 0, z: 0, len: 3.6, lab: -1.8 },
    B3: { x: 3.5, y: 0.8, a: 0, z: 1.35 - 0.6 * press, len: 2.4, lab: -1.26 },
  };
};
export const actU = p => build(FRAME.left(), layU(p), 'B3');
const layStackLeft = () => mapIds(id => ({ x: 0, y: ROW[id], a: 0, z: 0, len: 4, lab: -2 }));     // the stack as it lands after the last turn

// the opening: the flat four-stripe motif. It lies in the screen plane, so the type is undistorted.
// entrance = [{ from, to, labelEnd }] per stripe, in world units: the centre line runs from `from` to `to` (both off screen),
// and the label ends `labelEnd` along it. The page works these out from its own layout.
const frameE = entrance => { const ex = norm(sub(entrance[0].to, entrance[0].from)); return { o: mul(add(add(entrance[0].from, entrance[0].to), add(entrance[3].from, entrance[3].to)), 0.25), ex, ey: cross(HOME.v, ex) }; };
const layE = (entrance, drawn = [1, 1, 1, 1]) => { const f = frameE(entrance);
  return mapIds(id => { const i = IDS.indexOf(id), e = entrance[i], full = Math.hypot(...sub(e.to, e.from)), len = Math.max(full * drawn[i], 1e-4);
    const c = sub(add(e.from, mul(f.ex, len / 2)), f.o);
    return { x: dot(c, f.ex), y: dot(c, f.ey), a: 0, z: 0, len, lab: e.labelEnd - LL[id] - len / 2 }; }); };
export const actE = (entrance, drawn) => build(frameE(entrance), layE(entrance, drawn), 'B0');

// centre the pictures: slide the deck, and the walls, along the floor until each outline is centred on the world origin's picture
function centreOnStage() {
  const box = sets => { let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const s of sets) for (const b of Object.values(s)) for (const bx of barBoxes(b)) for (const p of bx.corners) {
      const x = dot(HOME.r, p), y = dot(HOME.u, p); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 }; };
  const floorShift = (sx, sy) => { const a = sx / HOME.r[0], s = sy / HOME.u[0]; return [(a + s) / 2, 0, (s - a) / 2]; };   // r = (k, 0, -k), u = (-m, n, -m)
  const g = box([actG({ open: 1 })]), w = box([actV(), actU()]);
  OG = floorShift(-g.x, -g.y); OW = floorShift(-w.x, -w.y);
  return { g: box([actG({ open: 1 })]), v: box([actV()]), u: box([actU()]), wall: box([actV(), actU()]) };
}
export const STAGE = centreOnStage();

// ---- moving
const clamp01 = x => Math.min(1, Math.max(0, x));
const win = (tau, t0, t1, ease = EASE.wipe) => ease(clamp01((tau - t0) / (t1 - t0)));
// a whole layout from one plane to another: the plane swings over (sFrame) while each bar finds its new place in it (sPlace),
// and the layers are timed on their own (sLayer). Two bars can only touch if they share a layer, so keeping the layers apart
// until the places are clear is what lets bars pass each other.
// The plane turns about the point of it that sits at the middle of the stage, so the picture turns over where it stands
// instead of swinging out on an arm; places are measured from that point.
const eye = f => { const ez = cross(f.ex, f.ey), q = mul(HOME.v, dot(f.o, ez) / dot(HOME.v, ez)), d = sub(q, f.o); return { p: q, x: dot(d, f.ex), y: dot(d, f.ey) }; };
// how the plane turns from one frame to the other. Two ways:
//   tumble: one straight turn, the shortest there is.
//   hinge:  two turns at once. The bars' own direction swings round about the first plane's across axis, and the plane rolls about the
//           bars' direction. The bars keep to one flat sweep, so long stripes do not wave about on the way. It needs the second
//           frame's bar direction to be square to the first frame's across axis.
const tumble = (fa, fb) => { const qa = quatFromBasis(fa.ex, fa.ey), qb = quatFromBasis(fb.ex, fb.ey);
  return s => { const q = quatSlerp(qa, qb, s); return { ex: quatRotate(q, [1, 0, 0]), ey: quatRotate(q, [0, 1, 0]) }; }; };
const hinge = (fa, fb) => { const n = fa.ey, alpha = Math.atan2(dot(cross(fa.ex, fb.ex), n), dot(fa.ex, fb.ex)), beta = Math.atan2(dot(cross(fa.ey, fb.ey), fb.ex), dot(fa.ey, fb.ey));
  return s => { const ex = rotAxis(fa.ex, n, alpha * s); return { ex, ey: rotAxis(fa.ey, ex, beta * s) }; }; };
// frame: how far the plane has turned. along(id): how far the bar has come in length and in place along itself. across(id): the same across
// itself, and in angle. layer(id): how far it has come in depth. All 0..1.
function swing(fa, la, fb, lb, { frame: sFrame, along, across = along, layer, red, turn = tumble }) {
  const ea = eye(fa), eb = eye(fb), frame = { o: lerp3(ea.p, eb.p, sFrame), ...turn(fa, fb)(sFrame) };
  return mapIds(id => { const a = la[id], b = lb[id], p = along(id), c = across(id), len = lerp(a.len, b.len, p);
    return put(frame, id, { x: lerp(a.x - ea.x, b.x - eb.x, p), y: lerp(a.y - ea.y, b.y - eb.y, c), a: lerp(a.a, b.a, c), len, lab: lerp(a.lab, b.lab, p), z: lerp(a.z, b.z, layer(id)),
      arms: a.arms ?? 0, drop: a.drop ?? 0, half: len / 2 }, id === red ? 'red' : 'paper'); });
}
// the red moves to the next craft: a hard edge wipes along both bars in the first 0.4s of the act
function handOver(bars, from, to, tau) {
  const x = win(tau, 0, 0.4);
  if (x >= 1) { bars[from].col = 'paper'; bars[to].col = 'red'; return; }
  bars[from].col = 'red'; bars[from].wipe = { to: 'paper', x };
  bars[to].col = 'paper'; bars[to].wipe = { to: 'red', x };
}
const ORDER = {                                                   // painted back to front
  E: ['B0', 'B1', 'B2', 'B3'],
  G: ['B3', 'B2', 'B1', 'B0'],                                    // the deck: bottom chip first
  V: ['B3', 'B2', 'B0', 'B1'],                                    // a stack on a wall: lowest first
  U: ['B1', 'B2', 'B0', 'B3'],                                    // the window: frame, rows, button
};
// the paint order changes part way through three of the moves. Each change is timed for a moment when the bars it reorders are apart.
export const SWITCH = {
  down: [[0.35, ORDER.G]],
  up: [[0.33, ORDER.V]],
  window: [[0.29, ORDER.U]],
};
// timings inside the three moves that change plane or shape, as [start, end] within the beat. Each bar finds its place on its own clock.
export const FOLD = { frame: [0, 1], along: [0, 0.6], across: [0.3, 1], layer: [0, 0.3] };                                                    // the opening fold: the stripes draw in to deck length before they close up
export const DOWN = { undraw: [0, 0.25], layers: [0.05, 0.25], frame: [0.2, 1], place: { B0: [0.2, 1], B1: [0.3, 1], B2: [0.2, 1], B3: [0.2, 1] } };   // the frame's bar lets go last
export const UP = { frame: [0, 0.8], place: { B0: [0.15, 0.85], B1: [0, 0.5], B2: [0, 0.8], B3: [0, 0.8] }, press: [0.7, 1] };              // the stick leads, the bar that was red follows last
export const TWIST = { stops: [0, -90, 0, -90], step: 0.08 };                                                                                     // each bar starts a step after its neighbour
export const WINDOW = { B1: [0, 0.26], B3: [0.05, 0.7], B2: [0, 0.55], B0: [0.3, 0.64], arms: [0.38, 1] };                                      // the top bar rises clear before the row under it follows
const pick = (tau, start, ...steps) => { let o = start; for (const [at, next] of steps) if (tau >= at) o = next; return o; };

// entrance: the opening stripes, planned by the page (see layout.mjs). zoomE: the scale of the opening relative to the loop (1 unless the page is short of room).
export function stateAt(t, entrance, zoomE = 1) {
  if (t < ENTRANCE) {                                             // stripes wipe on, 50ms apart, then hold for a beat
    const drawn = IDS.map((_, i) => win(t, 0.05 * i, 0.85 + 0.05 * i));
    return { bars: actE(entrance, drawn), order: ORDER.E, act: -1, beat: -1, tau: t, zoom: zoomE };
  }
  const L = (t - ENTRANCE) % BEATS, first = t - ENTRANCE < BEATS, beat = Math.floor(L), tau = L - beat;
  let bars, order;
  switch (beat) {
    case 0:                                                       // 01 the deck lands, shut
      if (first)                                                  // first time: the stripes step apart in depth, then fold down into the deck
        bars = swing(frameE(entrance), layE(entrance), FRAME.floor(), layG({ open: SHUT }), { frame: win(tau, ...FOLD.frame), along: () => win(tau, ...FOLD.along), across: () => win(tau, ...FOLD.across), layer: () => win(tau, ...FOLD.layer), red: 'B0', turn: hinge });
      else {                                                      // every other time: the window lets go and swings down onto the floor
        const la = layU({ press: 1, swap: 1 }), lb = layG({ open: SHUT });
        la.B1.arms = 1 - win(tau, ...DOWN.undraw);                // the frame undraws first
        const k = win(tau, ...DOWN.layers);                       // then the layers reshuffle into deck order, along the line of sight so nothing appears to move
        for (const id of IDS) { const dz = (lb[id].z - la[id].z) * k; la[id].z += dz; la[id].x += dz * NEAR[0]; la[id].y += dz * NEAR[1]; }
        bars = swing(FRAME.left(), la, FRAME.floor(), lb, { frame: win(tau, ...DOWN.frame), along: id => win(tau, ...DOWN.place[id]), layer: () => 0, red: 'B3', turn: hinge });
        handOver(bars, 'B3', 'B0', tau); }
      order = first ? ORDER.G : pick(tau, ORDER.U, ...SWITCH.down); break;
    case 1: bars = actG({ open: lerp(SHUT, 1, win(tau, 0, 1)) }); order = ORDER.G; break;        // the fan opens
    case 2: bars = actG({ slide: win(tau, 0, 0.6) }); order = ORDER.G; break;                    // the red chip slides out
    case 3: {                                                     // 02 the fan stands up on the right-hand wall as a clapperboard
      const la = layG({ slide: 1 }), lb = layV(), k = 1 - win(tau, ...UP.press);     // it arrives still layered like the deck, then presses flat along the line of sight
      for (const id of IDS) { const z = la[id].z * k; lb[id].z = z; lb[id].x -= z; lb[id].y += z * HOME.v[1] / HOME.v[0]; }
      bars = swing(FRAME.floor(), la, FRAME.right(), lb, { frame: win(tau, ...UP.frame), along: id => win(tau, ...UP.place[id]), layer: () => 1, red: 'B0' });
      handOver(bars, 'B0', 'B1', tau); order = pick(tau, ORDER.G, ...SWITCH.up); break; }
    case 4: bars = actV({ open: SAD * (1 - win(tau, 0.68, 1, EASE.exit)) }); order = ORDER.V; break;   // waits, then claps on the beat
    case 5: bars = actV({ open: tau < 0.5 ? SAD * win(tau, 0, 0.4, EASE.enter) : SAD * (1 - win(tau, 0.68, 1, EASE.exit)) }); order = ORDER.V; break;
    case 6: case 7: case 8: {                                     // 03 three quarter turns between the two walls. The turn runs down the stack, back up it, then down again
      const k = beat - 6, lag = id => (k === 1 ? 3 - TURN[id] : TURN[id]) * TWIST.step, d = 1 - 3 * TWIST.step;
      bars = actM(mapIds(id => lerp(TWIST.stops[k], TWIST.stops[k + 1], win(tau, lag(id), lag(id) + d))));
      if (beat === 6) { bars.B2.col = 'paper'; handOver(bars, 'B1', 'B2', tau); }
      order = ORDER.V; break; }
    case 9: {                                                     // 04 the top bar draws a window, the others become its rows and button
      const w = WINDOW, lb = layU({ arms: 0 });
      bars = swing(FRAME.left(), layStackLeft(), FRAME.left(), lb, { frame: 1, along: id => win(tau, ...w[id]), layer: id => win(tau, ...w[id]), red: 'B2' });
      bars.B1.arms = win(tau, ...w.arms); bars.B1.drop = 4.2;
      handOver(bars, 'B2', 'B3', tau); order = pick(tau, ORDER.V, ...SWITCH.window); break; }
    case 10: bars = actU({ press: win(tau, 0.84, 1, EASE.exit) }); order = ORDER.U; break;       // waits, then the button goes in on the beat
    case 11: bars = actU({ press: tau < 0.5 ? 1 - win(tau, 0, 0.2, EASE.enter) : win(tau, 0.84, 1, EASE.exit), swap: win(tau, 0, 0.8) }); order = ORDER.U; break;
  }
  return { bars, order, act: Math.floor(beat / 3), beat, tau, zoom: first && beat === 0 ? lerp(zoomE, 1, win(tau, 0, 1)) : 1 };
}
