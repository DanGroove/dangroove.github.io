import { sceneEnvelope } from '../view.mjs';
// Browser-free regression for CORRECTIONS-3's measured 768 x 1024 page.
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HOME, dot } from '../../../../public/journey/hero/engine.mjs';
import { SCENES, SHOW, SCRIPTS, PACE, frameAt, calloutsAt, playbackSpans } from '../stage.mjs';
import { corners } from '../kit.mjs';
import { fitCalloutView, labelLayout } from '../labels.mjs';
import { checkLabelRoutes } from './browser-check.mjs';

export function checkPageLabels() {
  const need = sceneEnvelope(SCENES, corners, dot, HOME);
  const obstacles = [[40, 32, 728, 76], [40, 332, 316, 439], [40, 463, 316, 544], [40, 584, 316, 723], [40, 980, 728, 996]].map(([left, top, right, bottom]) => ({ left, top, right, bottom }));
  const widths = { small: {}, large: {} };
  let start = 0;
  for (const scene of SHOW) {
    const time = start + (scene.key === 'id' ? playbackSpans(SCRIPTS.id).land + 0.41 * PACE : scene.still);   // CORRECTIONS-13: after InDesign's drop
    for (const c of calloutsAt(time)) {
      // Only the Figma widths are measured in the addendum; the others are conservative models.
      widths.small[c.id] = c.id.startsWith('fig-') ? [40.4, 38.6, 36.0][Number(c.id.at(-1))] : c.words.length * 9 * 0.75;
      widths.large[c.id] = widths.small[c.id] * 11 / 9;
    }
    start += scene.len;
  }
  const S = Math.min(390.08 / need.w, 864 / need.h);
  const initial = { W: 768, H: 1024, S, cx: 337.92 + 390.08 / 2 - S * need.x, cy: 88 + 864 / 2 + S * need.y, cam: HOME };
  const view = fitCalloutView(initial, need, 337.92, widths, obstacles);
  assert.ok(view.S >= 34 && view.S <= initial.S, 'page labels: fit must keep the labels visible');
  let samples = 0, minimumGap = Infinity;
  const landing = SHOW.slice(0, 5).reduce((n, s) => n + s.len, 0) + playbackSpans(SCRIPTS.fig).land;
  const times = [...new Set([0.4, 0.5, 0.55, 1.1, ...Array.from({ length: 181 }, (_, i) => i / 60)].map(offset => landing + offset * PACE))];
  for (const time of times) {
    const data = calloutsAt(time), anchors = calloutsAt(landing + 1.1 * PACE);
    const layout = labelLayout(data, frameAt(time), view, widths[view.S < 70 ? 'small' : 'large'], obstacles, false, time, anchors);
    assert.equal(layout.length, data.length, 'page labels: missing label');
    checkLabelRoutes(layout, view.S, 'page labels 768x1024/' + time.toFixed(6));
    const ends = layout.filter(c => c.side === 'left').map(c => c.points[2][0]);
    assert.ok(ends.every(x => Math.abs(x - ends[0]) < 1e-7), 'page labels: left column is not aligned');
    for (const c of layout) {
      assert.ok(c.label.left >= 16 - 1e-7 && c.label.right <= 752 + 1e-7, 'page labels: word gutter');
      for (const p of c.points) assert.ok(p[0] >= 16 - 1e-7 && p[0] <= 752 + 1e-7 && p[1] >= 0 && p[1] <= 1024, 'page labels: route gutter');
      for (const r of obstacles) if (c.side === 'left' && c.label.top < r.bottom && c.label.bottom > r.top) {
        const gap = c.label.left - r.right;
        minimumGap = Math.min(minimumGap, gap);
        assert.ok(gap >= 16 - 1e-7, 'page labels: left words are less than 16 px from page text');
      }
    }
    samples++;
  }
  return `page labels 768x1024: ${samples} frames; S=${view.S.toFixed(6)}; minimum text gap=${minimumGap.toFixed(3)} px; routes clean`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log(checkPageLabels());
