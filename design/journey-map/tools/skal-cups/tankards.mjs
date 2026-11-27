// The approved skal (Dan, 2026-11-27 10:32-10:37 AM ET: tankards, "thicker handles though please", then "good"). Writes tankards-approved.svg.
// Each cup is drawn in local map units with its base centre at 0,0; POSES and place() give the four states; the right cup mirrors the left.
import { writeFileSync } from 'node:fs';
const ink = '#151314', land = '#1F1C1D', paper = '#F7F6F3', dim = '#9A948D';
const G = d => `<path d="${d}" fill="${land}" stroke="${paper}" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`;
const T = d => `<path d="${d}" fill="none" stroke="${paper}" stroke-opacity=".5" stroke-width=".7" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`;
const L = d => `<path d="${d}" fill="none" stroke="${paper}" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
// The left cup, base centre at 0,0, standing (up is negative y); its handle on the outside (left). rim: the inner top corner.
const CUPS = {
  tankard: { name: 'Tankards of mead, with thicker handles', h: 14, rim: [5, -14],
    draw: () => G('M-5.2 -12.2C-12.2 -12.2 -12.2 -2.2 -5.5 -2.2L-5.45 -5.2C-8.7 -5.2 -8.7 -9.2 -5.3 -9.2Z') + G('M-5.6 0L-5 -14L5 -14L5.6 0Z') + T('M-5.45 -3.6H5.45M-5.15 -10.6H5.15M-1.7 -14V0M1.8 -14V0')
      + G('M-5.5 -14Q-5.6 -16.8 -3 -16.3Q-1.6 -18.6 1 -16.9Q3.4 -18.4 5.3 -15.8Q6.1 -14.3 5 -14Z') },
  goblet: { name: 'B  Goblets', h: 17, rim: [6, -17.2],
    draw: () => G('M-6 -17.2Q-6.2 -9.2 0 -8.4Q6.2 -9.2 6 -17.2Z') + T('M-5.7 -14.4H5.7M-3.4 -12.2l1.1 1.3l1.1 -1.3l1.1 1.3l1.1 -1.3l1.1 1.3') + L('M0 -8.4V-2.4M-1.2 -5.6H1.2') + G('M-4.6 0Q-4.6 -2.4 0 -2.4Q4.6 -2.4 4.6 0Z') },
};
// A pose: tilt in degrees (the top leans in), lift, and the gap left between the two rims.
const POSES = [['rest', 0, 0, 4.4], ['first press: raised', 12, -6, 3], ['second press: the clink', 22, -9, 0], ['after: back to raised', 12, -6, 3]];
const place = (cup, [, tilt, lift, gap]) => {
  const a = tilt * Math.PI / 180, [px, py] = cup.rim, rx = px * Math.cos(a) - py * Math.sin(a), ry = px * Math.sin(a) + py * Math.cos(a);
  return { x: -rx - gap / 2, y: 4 + lift, a: tilt, rimY: 4 + lift + ry };
};
const rings = (x, y) => [9, 15, 21].map((r, i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${paper}" stroke-opacity="${.5 - i * .15}" stroke-width="1" vector-effect="non-scaling-stroke"/>`).join('');
const drops = (x, y) => L(`M${x - 1.4} ${y - 2}l-1.5 -2.2M${x} ${y - 2.6}v-2.6M${x + 1.4} ${y - 2}l1.5 -2.2`);
let cells = '';
[CUPS.tankard].forEach((cup, row) => {
  POSES.forEach((pose, k) => {
    const p = place(cup, pose), cx = 42 + k * 46, cy = 46 + row * 58;
    const one = `<g transform="translate(${p.x.toFixed(2)} ${p.y}) rotate(${p.a})">${cup.draw()}</g>`;
    let g = `<g transform="translate(${cx} ${cy})">` + (k === 2 ? rings(0, p.rimY) : '') + L('M-18 4H18') + one + `<g transform="scale(-1 1)">${one}</g>`;
    if (k === 2) g += drops(0, p.rimY);
    cells += g + `</g>`;
  });
  cells += `<text x="8" y="${14 + row * 58}" fill="${dim}" font-family="Outfit, system-ui, sans-serif" font-size="3.8">${cup.name}</text>`;
});
POSES.forEach(([t], k) => cells += `<text x="${42 + k * 46}" y="62" fill="${dim}" text-anchor="middle" font-family="Outfit, system-ui, sans-serif" font-size="3.3">${t}</text>`);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 68" width="1260" height="408"><rect width="210" height="68" fill="${ink}"/>${cells}</svg>`;
writeFileSync(new URL('./tankards-approved.svg', import.meta.url), svg);

