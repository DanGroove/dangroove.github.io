import {
  HALO,
  T,
  TONES,
  INK,
  dot,
  add,
  mul,
  cross,
  project,
  barFaces,
  barBoxes,
  hull2,
} from './engine.mjs';

const labelMeasurements = new Map();

function measureLabel(ctx, text) {
  if (!labelMeasurements.has(text)) {
    labelMeasurements.set(
      text,
      Array.from(text, (glyph, i) => ({
        glyph,
        x: ctx.measureText(text.slice(0, i + 1)).width - ctx.measureText(glyph).width + i * 2.7,
      }))
    );
  }
  return labelMeasurements.get(text);
}

function polygon(ctx, points) {
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
}

// The player has already sized and cleared the canvas, with CSS pixels as its units.
export function drawHero(ctx, bars, order, { S, cx, cy, cam, labels }) {
  const pr = point => project(point, cam, S, cx, cy);
  ctx.save();
  ctx.lineJoin = 'miter';

  for (const id of order) {
    const bar = bars[id];
    const faces = barFaces(bar, cam);
    const ez = cross(bar.ex, bar.ey);

    // Ink around each solid cuts the same square gap wherever bars overlap.
    ctx.fillStyle = ctx.strokeStyle = INK;
    ctx.lineWidth = 2 * HALO * S;
    ctx.miterLimit = 6;
    for (const box of barBoxes(bar)) {
      ctx.beginPath();
      polygon(ctx, hull2(box.corners.map(pr)));
      ctx.fill();
      ctx.stroke();
    }

    ctx.lineWidth = 0.6;
    ctx.miterLimit = 4;
    for (const main of [false, true]) {
      const byTone = new Map();
      for (const face of faces) {
        if (face.main !== main) continue;
        const tone = TONES[face.color];
        const color = main ? tone.face : Math.abs(face.n[1]) > 0.7071 ? tone.up : tone.side;
        if (!byTone.has(color)) byTone.set(color, []);
        byTone.get(color).push(face);
      }
      for (const [color, group] of byTone) {
        ctx.beginPath();
        for (const face of group) polygon(ctx, face.pts.map(pr));
        ctx.fillStyle = ctx.strokeStyle = color;
        ctx.fill();
        ctx.stroke();
      }
    }

    if (dot(ez, cam.v) <= 0.02 || !labels?.[id]) continue;
    const base = add(bar.c, add(mul(bar.ex, bar.lab), add(mul(bar.ey, -0.3), mul(ez, T / 2))));
    const [ox, oy] = pr(base);
    const m = [
      S * dot(cam.r, bar.ex),
      -S * dot(cam.u, bar.ex),
      -S * dot(cam.r, bar.ey),
      S * dot(cam.u, bar.ey),
    ];

    // Clip in screen space first so the text changes colour with the face's wipe.
    for (const color of new Set(faces.filter(face => face.main).map(face => face.color))) {
      ctx.save();
      ctx.beginPath();
      for (const face of faces) {
        if (face.main && face.color === color) polygon(ctx, face.pts.map(pr));
      }
      ctx.clip();
      ctx.transform(m[0], m[1], m[2], m[3], ox, oy);
      ctx.scale(0.6 / 0.7 / 100, 0.6 / 0.7 / 100);
      ctx.font = '800 100px Outfit';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = TONES[color].text;
      for (const { glyph, x } of measureLabel(ctx, labels[id])) ctx.fillText(glyph, x, 0);
      ctx.restore();
    }
  }
  ctx.restore();
}

// Fallback-font widths must not survive a late arrival of Outfit.
drawHero.clearMeasurements = () => labelMeasurements.clear();
