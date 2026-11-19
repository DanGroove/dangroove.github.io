// Journey hero rough cut: an SVG renderer. It is the picture the site's canvas renderer has to match.
import { HOME, HALO, T, TONES, INK, dot, add, mul, cross, project, barFaces, barBoxes, hull2 } from '../../../public/journey/hero/engine.mjs';

// ---- drawing. Bars are painted back to front in `order`. For each bar: its knockout, its edge faces, its labelled faces, its label.
// The knockout is the mark's gap in 3D: the silhouette of the bar grown by HALO on screen (square corners), painted in ink,
// so whatever the bar passes over is cut back by one gap.
let uid = 0;
export function renderSVG(bars, order, { S, cx, cy, cam = HOME, halo = HALO, labels }) {
  const f2 = n => n.toFixed(2), pr = p => project(p, cam, S, cx, cy);
  let out = '';
  for (const id of order) {
    const bar = bars.find(b => b.id === id);
    const faces = barFaces(bar, cam), ez = cross(bar.ex, bar.ey);
    out += `<g fill="${INK}" stroke="${INK}" stroke-width="${f2(2 * halo * S)}" stroke-linejoin="miter" stroke-miterlimit="6">`;
    for (const b of barBoxes(bar)) out += `<polygon points="${hull2(b.corners.map(pr)).map(p => p.map(f2).join(',')).join(' ')}"/>`;
    out += '</g>';
    for (const main of [false, true]) {
      const byTone = new Map();
      for (const f of faces) if (f.main === main) {
        const t = TONES[f.color], tone = main ? t.face : Math.abs(f.n[1]) > 0.7071 ? t.up : t.side;
        byTone.set(tone, (byTone.get(tone) ?? '') + 'M' + f.pts.map(p => pr(p).map(f2).join(',')).join('L') + 'Z');
      }
      for (const [tone, d] of byTone) out += `<path d="${d}" fill="${tone}" stroke="${tone}" stroke-width="0.6" stroke-linejoin="miter"/>`;
    }
    const front = dot(ez, cam.v) > 0.02;                     // the choreography never shows a back
    if (front && labels?.[id]) {
      const base = add(bar.c, add(mul(bar.ex, bar.lab), add(mul(bar.ey, -0.3), mul(ez, T / 2))));
      const [ox, oy] = pr(base);
      const m = [S * dot(cam.r, bar.ex), -S * dot(cam.u, bar.ex), -S * dot(cam.r, bar.ey), S * dot(cam.u, bar.ey)];
      const text = fill => `<text transform="matrix(${m.map(n => n.toFixed(4)).join(' ')} ${f2(ox)} ${f2(oy)})" font-family="Outfit" font-weight="800" font-size="${(0.6 / 0.7).toFixed(4)}" letter-spacing="0.027em" fill="${fill}">${labels[id]}</text>`;
      for (const col of new Set(faces.filter(f => f.main).map(f => f.color))) {     // the label is cut to the face it sits on, colour by colour, so it wipes with the bar
        const cid = `k${uid++}`;
        out += `<clipPath id="${cid}">${faces.filter(f => f.main && f.color === col).map(f => `<polygon points="${f.pts.map(p => pr(p).map(f2).join(',')).join(' ')}"/>`).join('')}</clipPath><g clip-path="url(#${cid})">${text(TONES[col].text)}</g>`;
      }
    }
  }
  return out;
}
