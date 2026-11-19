// Second take: the four crafts as objects. Each function returns the list of pieces for one object, standing on the floor y = 0.
import { box, cyl, ball, cone, wedge, stick, turn, move, add, sub, mul, cross, norm } from './kit.mjs';

// 01 Graphic design: a poster with a pen tool point on its circle, a letter, a swatch fan and a pencil
export function graphic() {
  const P = [], Z0 = -1.5, zf = Z0 + 0.06;
  P.push(box('paper', [0.35, 2.45, Z0], [3.3, 4.9, 0.12]));                       // the poster: x -1.3 .. 2.0
  P.push(cyl('red', [0.6, 3.2, zf + 0.05], 'z', 1.02, 0.1));                      // its circle
  P.push(box('ink', [0.15, 1.58, zf + 0.03], [2.3, 0.34, 0.06]));                 // headline
  P.push(box('grey', [-0.05, 1.1, zf + 0.03], [1.9, 0.11, 0.06]));                // two lines of text
  P.push(box('grey', [-0.3, 0.84, zf + 0.03], [1.4, 0.11, 0.06]));
  P.push(box('ink', [-0.87, 4.45, zf + 0.03], [0.26, 0.26, 0.06]));               // a mark in the corner
  P.push(box('grey', [-0.32, 4.45, zf + 0.03], [0.6, 0.09, 0.06]));
  // the pen tool: an anchor point on the circle with its two handles
  P.push(box('ink', [0.6, 4.22, zf + 0.12], [1.9, 0.05, 0.05]));
  P.push(box('paper', [0.6, 4.22, zf + 0.13], [0.2, 0.2, 0.1]));
  P.push(cyl('ink', [-0.35, 4.22, zf + 0.13], 'z', 0.1, 0.1));
  P.push(cyl('ink', [1.55, 4.22, zf + 0.13], 'z', 0.1, 0.1));
  // a letter A, standing
  const ax = -1.3, az = 0.6, ad = 0.5;
  P.push(box('paper', [ax - 0.41, 1.0, az], [0.42, 2.0, ad], { shear: 0.31 }));
  P.push(box('paper', [ax + 0.41, 1.0, az], [0.42, 2.0, ad], { shear: -0.31 }));
  P.push(box('paper', [ax, 0.6, az], [0.74, 0.3, ad - 0.02]));
  // a swatch fan on the floor
  const rivet = [1.6, 0, 1.3], chips = ['paper', 'grey', 'dark', 'red', 'paper'];
  chips.forEach((tone, i) => {
    const chip = box(tone, [rivet[0], 0.03 + i * 0.05, rivet[2] - 0.72], [0.5, 0.045, 1.7]);
    P.push(turn(chip, rivet, [0, 1, 0], (i - 2) * 17 + 8));
  });
  P.push(cyl('ink', [rivet[0], 0.15, rivet[2] - 0.02], 'y', 0.09, 0.32));
  // a pencil
  const pencil = [
    cyl('red', [0, 0.13, 0], 'x', 0.13, 1.8, { round: 0.6 }),
    cyl('grey', [1.0, 0.13, 0], 'x', 0.135, 0.2),
    cyl('paper', [1.22, 0.13, 0], 'x', 0.13, 0.24, { cap: 0.5 }),
    cone('paper', [-1.1, 0.13, 0], '-x', 0.13, 0.4, 0.3),
    cone('dark', [-1.36, 0.13, 0], '-x', 0.04, 0.12, 0),
  ];
  turn(pencil, [0, 0, 0], [0, 1, 0], -14); move(pencil, [-0.3, 0, 2.05]);
  P.push(...pencil);
  return P;
}

// 02 Video: a clapperboard with its stick open, and a film camera on a tripod behind it
export function video() {
  const P = [];
  // the camera, seen side on: body, two reels, the lens to the right
  const cx = 0.55, cy = 3.1, cz = -1.15;
  P.push(box('paper', [cx, cy, cz], [2.1, 1.3, 0.95]));
  P.push(cyl('paper', [cx - 0.48, cy + 0.65 + 0.6, cz], 'z', 0.68, 0.36));
  P.push(cyl('paper', [cx + 0.66, cy + 0.65 + 0.44, cz], 'z', 0.52, 0.36));
  P.push(cyl('red', [cx - 0.48, cy + 1.25, cz + 0.2], 'z', 0.2, 0.06));
  P.push(cyl('red', [cx + 0.66, cy + 1.09, cz + 0.2], 'z', 0.16, 0.06));
  P.push(cyl('grey', [cx + 1.3, cy + 0.05, cz], 'x', 0.34, 0.5));
  P.push(cone('paper', [cx + 1.76, cy + 0.05, cz], '-x', 0.52, 0.46, 0.66));
  P.push(cyl('ink', [cx + 1.99, cy + 0.05, cz], 'x', 0.43, 0.03));
  P.push(box('grey', [cx - 1.2, cy + 0.28, cz], [0.34, 0.42, 0.42]));
  P.push(cyl('red', [cx - 0.72, cy - 0.32, cz + 0.49], 'z', 0.09, 0.04));
  P.push(box('grey', [cx + 0.25, cy + 0.05, cz + 0.485], [0.9, 0.5, 0.03]));
  // the tripod
  const top = [cx, cy - 0.93, cz];
  P.push(cyl('grey', [cx, cy - 0.65 - 0.14, cz], 'y', 0.3, 0.28));
  for (const a of [80, 200, 320]) { const r = a * Math.PI / 180; P.push(stick('paper', top, [cx + Math.cos(r) * 1.05, 0, cz + Math.sin(r) * 1.05], 0.075)); }
  // the clapperboard
  const sx = -0.55, sz = 1.3, zf = sz + 0.07, left = sx - 1.5;
  P.push(box('paper', [sx, 1.15, sz], [3.0, 2.3, 0.14]));
  P.push(box('ink', [sx, 1.6, zf + 0.01], [2.7, 0.035, 0.02]));                  // the rules between its fields
  P.push(box('ink', [sx, 0.85, zf + 0.01], [2.7, 0.035, 0.02]));
  P.push(box('ink', [sx - 0.45, 0.48, zf + 0.01], [0.035, 0.7, 0.02]));
  P.push(box('ink', [sx + 0.45, 0.48, zf + 0.01], [0.035, 0.7, 0.02]));
  P.push(box('ink', [sx - 0.55, 1.95, zf + 0.02], [1.3, 0.3, 0.04]));            // what is written in them
  P.push(box('ink', [sx - 0.85, 1.22, zf + 0.02], [0.7, 0.3, 0.04]));
  P.push(box('red', [sx + 0.75, 1.22, zf + 0.02], [0.5, 0.3, 0.04]));
  P.push(box('grey', [sx - 0.95, 0.5, zf + 0.02], [0.5, 0.2, 0.04]));
  P.push(box('grey', [sx, 0.5, zf + 0.02], [0.5, 0.2, 0.04]));
  P.push(box('grey', [sx + 0.95, 0.5, zf + 0.02], [0.5, 0.2, 0.04]));
  const stripes = (y, lean) => [0, 1, 2, 3].map(i => box('paper', [left + 0.46 + i * 0.7, y, sz + 0.11], [0.34, 0.38, 0.04], { shear: lean }));
  const low = [box('dark', [sx, 2.3 + 0.19, sz], [3.0, 0.38, 0.2]), ...stripes(2.49, 0.7)];
  const high = [box('dark', [sx, 2.68 + 0.19, sz], [3.0, 0.38, 0.2]), ...stripes(2.87, -0.7)];
  turn(high, [left + 0.1, 2.68, sz], [0, 0, 1], 20);
  P.push(...low, ...high);
  P.push(cyl('grey', [left + 0.12, 2.68, sz + 0.12], 'z', 0.15, 0.06));
  return P;
}

// 03 Motion: a ball bouncing down a flight of steps along its dotted path, keyframes on a line, and the curve that eases it
export function motion() {
  const P = [], Z0 = -1.5, zf = Z0 + 0.06;
  P.push(box('paper', [0.6, 2.2, Z0], [3.0, 4.4, 0.12]));                         // the graph: x -0.9 .. 2.1
  for (const y of [1.55, 2.85]) P.push(box('grey', [0.6, y, zf + 0.01], [2.6, 0.03, 0.02]));
  for (const x of [-0.05, 1.25]) P.push(box('grey', [x, 2.2, zf + 0.01], [0.03, 4.0, 0.02]));
  // the brand's own easing, cubic-bezier(0.475, 0, 0.075, 1), drawn as a curve with its two handles
  const gx = -0.55, gy = 0.55, gw = 2.3, gh = 3.3, B = [0.475, 0, 0.075, 1];
  const at = s => [gx + gw * (3 * (1 - s) * (1 - s) * s * B[0] + 3 * (1 - s) * s * s * B[2] + s * s * s), gy + gh * (3 * (1 - s) * (1 - s) * s * B[1] + 3 * (1 - s) * s * s * B[3] + s * s * s)];
  P.push(box('ink', [gx + gw * B[0] / 2, gy, zf + 0.03], [gw * B[0], 0.04, 0.04]));
  P.push(box('ink', [gx + gw * (1 + B[2]) / 2, gy + gh, zf + 0.03], [gw * (1 - B[2]), 0.04, 0.04]));
  P.push(box('paper', [gx + gw * B[0], gy, zf + 0.05], [0.16, 0.16, 0.08]));
  P.push(box('paper', [gx + gw * B[2], gy + gh, zf + 0.05], [0.16, 0.16, 0.08]));
  for (let i = 1; i < 8; i++) { const [x, y] = at(i / 8); P.push(cyl('ink', [x, y, zf + 0.04], 'z', 0.06, 0.08)); }
  P.push(cyl('ink', [gx, gy, zf + 0.05], 'z', 0.12, 0.1));
  P.push(cyl('red', [gx + gw, gy + gh, zf + 0.05], 'z', 0.13, 0.1));
  // three steps coming toward us
  const sx = -1.5, steps = [[-0.6, 2.1], [0.5, 1.4], [1.6, 0.7]];
  for (const [z, h] of steps) P.push(box('paper', [sx, h / 2, z], [1.3, h, 1.1]));
  // the ball's path: one bounce on every step. Dots are equal steps of time, so they bunch up where it is slow.
  const r = 0.36, H = 0.85, hops = [[-0.6, 2.1, 0.5, 1.4], [0.5, 1.4, 1.6, 0.7]];
  const hop = ([z0, y0, z1, y1], u) => [sx, y0 + r + (y1 - y0) * u * u + H * 4 * u * (1 - u), z0 + (z1 - z0) * u];
  const path = { noShadow: true };
  for (let i = 1; i <= 6; i++) P.push(ball('paper', hop(hops[0], i / 7), 0.055, { more: path }));
  for (const u of [0.13, 0.27]) P.push(ball('paper', hop(hops[1], u), 0.055, { more: path }));
  // the ball on its way down, a little stretched along its speed, with three speed lines behind it
  const u = 0.56, c = hop(hops[1], u), ahead = hop(hops[1], u + 0.01), d = norm(sub(ahead, c)), k = 1.04;
  P.push(stick('red', sub(c, mul(d, r * k)), add(c, mul(d, r * k)), r / Math.sqrt(k), { cap: 1 }));
  const across = norm(cross(d, [0.596, 0.538, 0.596]));
  for (const [off, from, len] of [[-0.2, 0.5, 0.34], [0, 0.56, 0.52], [0.2, 0.5, 0.3]]) {
    const o = add(c, mul(across, off));
    P.push(stick('paper', sub(o, mul(d, from)), sub(o, mul(d, from + len)), 0.035, { more: path }));
  }
  // keyframes on a line
  const kz = 1.6;
  P.push(box('grey', [0.95, 0.04, kz], [2.7, 0.05, 0.05]));
  for (const [x, tone] of [[-0.15, 'paper'], [0.6, 'red'], [1.35, 'paper'], [2.1, 'paper']]) P.push(turn(box(tone, [x, 0.36, kz], [0.4, 0.4, 0.07]), [x, 0.36, kz], [0, 0, 1], 45));
  return P;
}

// 04 UX/UI: a screen and a phone with their layers lifted off, a cursor and a switch
export function ux() {
  const P = [], Z0 = -1.5, zf = Z0 + 0.07;
  P.push(box('paper', [0.3, 3.0, Z0], [3.6, 2.9, 0.14]));                         // the screen: x -1.5 .. 2.1, y 1.55 .. 4.45
  P.push(box('grey', [0.3, 0.85, Z0 - 0.05], [0.42, 1.5, 0.12]));                 // its stand
  P.push(box('paper', [0.3, 0.06, Z0 + 0.1], [1.6, 0.12, 0.9]));
  P.push(box('grey', [0.3, 4.28, zf + 0.01], [3.6, 0.34, 0.02]));                 // the window's bar and its three dots
  P.push(cyl('red', [-1.28, 4.28, zf + 0.04], 'z', 0.075, 0.05));
  P.push(cyl('ink', [-1.05, 4.28, zf + 0.04], 'z', 0.075, 0.05));
  P.push(cyl('ink', [-0.82, 4.28, zf + 0.04], 'z', 0.075, 0.05));
  P.push(box('grey', [-1.05, 2.83, zf + 0.02], [0.7, 2.3, 0.04]));                // the side bar
  P.push(box('dark', [0.75, 3.32, zf + 0.22], [2.3, 1.2, 0.06]));                 // a picture, lifted off the screen
  P.push(box('ink', [0.2, 2.3, zf + 0.02], [1.2, 0.12, 0.04]));                   // two lines
  P.push(box('ink', [0.0, 2.04, zf + 0.02], [0.8, 0.12, 0.04]));
  P.push(box('red', [1.42, 2.12, zf + 0.34], [0.85, 0.36, 0.1]));                 // the button, lifted further
  // the phone
  const px = -1.25, pz = 1.3, pf = pz + 0.08;
  P.push(box('dark', [px, 1.5, pz], [1.5, 3.0, 0.16], { round: 0.1 }));
  P.push(box('paper', [px, 1.5, pf], [1.32, 2.8, 0.03]));
  P.push(box('grey', [px, 2.68, pf + 0.03], [1.32, 0.34, 0.03]));
  P.push(cyl('red', [px - 0.4, 2.12, pf + 0.1], 'z', 0.17, 0.05));
  P.push(box('ink', [px + 0.15, 2.18, pf + 0.1], [0.6, 0.09, 0.05]));
  P.push(box('grey', [px + 0.05, 2.04, pf + 0.1], [0.4, 0.07, 0.05]));
  P.push(box('grey', [px, 1.3, pf + 0.18], [1.1, 0.8, 0.05]));                    // a card, lifted off
  P.push(box('red', [px, 0.6, pf + 0.28], [1.0, 0.3, 0.08]));                     // its button
  for (const dx of [-0.36, 0, 0.36]) P.push(cyl(dx === 0 ? 'ink' : 'grey', [px + dx, 0.22, pf + 0.03], 'z', 0.07, 0.03));
  // the cursor, pressing the button on the screen
  const tip = [1.6, 2.06, zf + 0.5];
  const arrow = [wedge('paper', [tip[0], tip[1] - 0.3, tip[2]], 'y', [0.48, 0.12, 0.6]), box('paper', [tip[0], tip[1] - 0.76, tip[2]], [0.16, 0.36, 0.12])];
  P.push(...turn(arrow, tip, [0, 0, 1], 28));
  // a switch on the floor
  const tx = 1.15, tz = 1.6;
  P.push(box('red', [tx, 0.15, tz], [0.7, 0.3, 0.62]));
  P.push(cyl('red', [tx - 0.35, 0.15, tz], 'y', 0.31, 0.3));
  P.push(cyl('red', [tx + 0.35, 0.15, tz], 'y', 0.31, 0.3));
  P.push(cyl('paper', [tx + 0.35, 0.33, tz], 'y', 0.24, 0.12));
  return P;
}

export const OBJECTS = [graphic, video, motion, ux];
