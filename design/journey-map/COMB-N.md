# Polish round 3, part 11: glides held on the compositor, the sky in small layers, and Sköll and Hati (COMB-N)

On part 10d (be25990). Two notes from Dan:

- Preview 19 on his phone (Android, the Claude app's browser, 120 Hz): 120 fps at rest but mostly 40 to 60 fps in every glide ("A TON of lag, stutter"). On his PC: "going from node to node is better but still stutters", and "laggy while zooming through the clouds".
- 2026-11-26 8:00 AM ET, on the sketch of Sköll chasing the sun and Hati chasing the moon in place of the two sky ravens: "ok lets include them, i think my only comment is to make them different so people dont think they are the same wolf". Sketch 2 (two clearly different wolves) is what this brief builds.

## What was measured

Cloud, Chromium 157 headless, 412x915 at DPR 2.625, touch, a real tap on Next at HMC Connections, the 3.6 s after the tap:

- be25990: svg#map re-rasters on every glide frame (1056 tiles, about 1 s of raster), because a glide writes the camera into `#cam` inside svg#map every frame (`tripApply`'s rebase branch); only explore (`st.exploreMoving`) and the base map (L3) hold a raster on the compositor. The walked trail `#trail-done` rewrites a whole-trail dash every frame. svg#sky re-rasters every frame too (299 to 356 tiles) because the clouds' transforms are attributes inside one full-screen SVG. Frames: 41 to 51 fps, 29 to 63 frames over 25 ms.
- A prototype of G1 and G2 below (behind test flags, code in the appendix): 53 to 59 fps, 3 to 24 frames over 25 ms; svg#map's raster time about halves. But with svg#map promoted its content split into extra layers (`g` 597x897 inside `#b-rest-detail`, `g.ygg` 505x409, and two `rect` layers up to 2657x2657), so the total tile count went up (2134 to 2827). G1 has to stop that split.
- Keeping svg#map promoted at rest (0969810, flag `__keepPromo`): rest screenshots match the unpromoted ones (no channel off by more than 24), so a kept promotion does not blur the map.

## Items

**G1. Glides hold svg#map's raster and move it on the compositor (`trip.mjs` `tripApply`; switch `FRAME_PERF.glideHold`, on).**
- While the steps journey's camera moves (not explore, not reduced motion, after the hero's hand-off: `st.handoffT >= 1`), use explore's held move: write the camera as svg#map's CSS transform relative to the held camera `r.base`, and rewrite `#cam` only on a rebase (no base yet, a resize, or the scale ratio outside `[FRAME_PERF.scaleMin, FRAME_PERF.scaleMax]`), the rule explore already uses. On the first frame the camera is still (arrival, a stop's hold, the end beat), rebase at the exact camera so the map is drawn sharp at rest, as explore does when its held frame was scaled.
- Keep svg#map promoted (`will-change: transform, opacity`, and `overflow: visible` while held, as explore does) for the whole steps journey after the hand-off, through glides and holds, so starting and ending a glide builds and destroys no layer. Explore keeps its own promotion rules.
- Stop the split: while svg#map is promoted, everything it draws must stay in svg#map's own layer during glides. Find what splits `g` (in `#b-rest-detail`), `g.ygg` and the rects into their own layers (CDP `LayerTree.compositingReasons` and the layer's node; part 10's L4 found fractional group opacity on big sparse groups doing the same in the first glide) and remove the cause without changing what is drawn. If the only cure is outside your files, leave it and report the cause.
- Labels inside svg#map are drawn at the held scale during held frames (at most 15% off) and rewritten at rebases, as in explore. The base map (`#map-base`, L3) already holds its raster; leave it.

**G2. The walked trail in short pieces (`main.mjs` map markup, `trip.mjs`, `map.css`; switch `FRAME_PERF.trailPieces`, on).** Draw the walked trail as pieces about 40 map units long, built once from `TRAIL` (the prototype's `DONE_PIECES`): pieces behind the traveller fully drawn, pieces ahead hidden, and only the piece the traveller is on dashed up to the traveller (`(u - u0) * paint.s` drawn). In explore and at the end the whole trail is drawn, as now. Same stroke (paper, 1.3, round caps, non-scaling). `#trail-done` goes, or stays hidden for good. At rest, at every stop, in explore and at the end, the walked trail looks as it does now.

**G3. The sky in small layers (`depth.mjs`, the sky only; `main.mjs`'s `#sky` element; `map.css`'s `#sky` rules; switch `FRAME_PERF.skyLayers`, on).** Make every sky object its own small element: each cloud, and each flyer from W1 (the lead and the wolf), is its own absolutely positioned `svg` sized to its drawing, moved by a CSS transform (translate, rotate, scale) with `will-change: transform` while it is visible, and hidden (display none or visibility hidden) at alpha 0. Only drawings that really change inside (the wolf's legs and bob) touch attributes per frame, so only that small layer re-rasters. A cloud's size follows the camera: hold its raster as G1 does (its CSS scale stays within `[scaleMin, scaleMax]` of the scale it was last drawn at; past that, redraw it at the new scale), so clouds stay sharp. The joined page's fall from the hero ("zooming through the clouds") uses the same sky, so check it on both pages. Same look: each cloud and flyer within a few pixels of now at rest and mid-glide.

**W1. Sköll and Hati replace the two sky ravens (`data.mjs` `DEPTH`, `depth.mjs` the sky only).** The ravens find (Huginn and Muninn in the tree) stays as it is.
- Drawings: `tools/sky-wolves/skoll-hati-paths.json` (made by `tools/sky-wolves/make-json.mjs` from `wolves.mjs` and `wolf-base.mjs`; read them, do not edit them). Copy the strings into `DEPTH.drawings` as `skoll`, `hati`, `sun` and `moon`, in place of `raven`. Each wolf is facing +x, y down, about 100 units nose to tail tip, with `front`, `hind`, `farFront` and `farHind` (the far legs' transforms), `body`, `lines`, `marks` and `eye`.
- Tuning, in place of `DEPTH.ravens`:
  ```js
  wolves: { on: 1, legs: [2, 4], from: 0.06, to: 0.94, ramp: 0.1, size: [1.05, 1.8, 860], margin: [0.06, 70], yTop: 0.16, arcH: [0.24, 0.16], lag: 64,
    skoll: { k: 1, gallop: 2.4, swing: 24, bob: 0.5 }, hati: { k: 1.12, gallop: 1.7, swing: 20, bob: 1.3 } },
  ```
- Who: on leg 2 (Mohawk to HMC, again) Sköll chases the sun; on leg 4 (Interkom to Lennard, the 2023 crossing) Hati chases the moon.
- Look, colours from `C`, every stroke 1.1 with round joins and caps and non-scaling unless said: Sköll's legs and body filled `C.ink` with a `C.warm` outline; his detail `lines` `C.warm` at opacity .5 and width .7; his two `marks` (sun spirals) `C.warm`, no fill; his `eye` filled `C.warm`. Hati's legs and body filled `C.mid` with a `C.paper` outline; his `lines` `C.paper` at opacity .5 and width .7; his two `marks` (crescents) `C.paper` at opacity .85 and width .9, no fill; his `eye` filled `C.paper`. Sun: `disc` filled `C.paper`, `rays` filled `C.warm`. Moon: `ghost` ring `C.paper` at opacity .5 and width .7, no fill; `crescent` filled `C.paper`. Draw order in a wolf: far front leg (with `farFront`), far hind leg (with `farHind`), body, near hind leg, near front leg, then lines, marks and eye. No red anywhere.
- Path, in screen space, right to left on a low arc. With W and H the stage's size: `s = clamp(W / size[2], size[0], size[1])`, `m = margin[0] * W + margin[1] * s`, `span = W + 2m`, `arcH = min(arcH[0] * H, arcH[1] * span)`, `yTop = yTop * H`, and `arc(f) = [W + m - span * f, yTop + arcH * (1 - sin(PI * f))]`. The lead sits at `arc(f)` at scale `s`; the sun turns `f * 40` degrees, the moon stays at -24 degrees. The wolf (scale `ws = s * k`) sits at `arc(f - lag * ws / span)` as `translate(x y) rotate(atan2(-ty, -tx)) scale(-ws, ws) translate(0, -bob * sin(ph))`, where (tx, ty) is the arc's unit tangent in the direction of travel there: mirrored to face left, turned with the arc, and bobbing in drawing units. Legs: `ph = time * 2 * PI * gallop`, `g = 0.5 - 0.5 cos(ph)`, `g2 = 0.5 - 0.5 cos(ph - 0.6)`; both front legs rotate `swing * g2` about (12.6, -2.6), both hind legs `-swing * g` about (-19.4, -3.2).
- When: over the whole glide between the two stops, not only the leg part (`st.t`) the ravens used (that gave 1.4 to 2.0 s on screen, too quick to see on a PC). For leg L the glide is `GLIDES[L + 1]` in `trip.mjs` (from stop L's rest to stop L + 1's rest); `f = clamp01(((st.P - g.a) / (g.b - g.a) - from) / (to - from))`, so the pair is on screen for about 3.5 s of a 4 s move on every screen. Only while the journey moves forward over that glide (Next, or a forward hurry); a Back over it shows neither, and if a move turns back mid-flight the pair fades out over about a third of a second. Alpha: `smooth(0, ramp, f) * (1 - smooth(1 - ramp, 1, f)) * depthSeaFade(st) * (1 - (st.focusK || 0))`, as the ravens'. Reduced motion has no sky, as now.
- Dan approved the look from a picture (cloud path `/mnt/project-files/journey-page/skoll-hati/skoll-hati-sketch-2.png`, not on the PC); the drawings and numbers above are that sketch's.

**T1 to T4. Test fixes found in part 10d's review.**
- T1. `comb-m-layers-test.mjs`: on phones the timeline's count chip (`span.tl-count`, about 92x21) gets its own layer while `.tl-count-screen` runs its `translate .3s` transition when a stop opens or a move starts (by design since part 4, d56e70d; seen in Edge 158, not Chromium 157). Skip layers whose node is `.tl-count` or inside `.tl-count-screen`, and report how many were skipped.
- T2. `comb-m2-ship-test.mjs`: the far berth's stern curl is 9.86 from the serpent ring's edge (13.06 from its centreline); the gate said 10. Make it 9.5 from the ring's edge and report the measured clearances.
- T3. `comb-m-fixture.mjs`: take the run folder's name from the env `COMB_RUN` (default `comb-n`) under the same `journey-map-runs` root, so a run writes to its own folder.
- T4. `comb-m2-scope-test.mjs` checks part 10d against its own starting hashes, so it fails on any later change: make it exit 0 with a one-line note that it belonged to part 10d. Write this run's own scope check if you want one.

## Checks

New tests in `tools/` (real CDP input only; read state through computed styles, classes, attributes, `LayerTree` and the page's existing test hooks; behaviour, state and pixels, never time). "be25990" means the packed pages from before your changes, saved in the run folder at the start.

1. `comb-n-hold-test.mjs`: at 412x915 DPR 2.625 touch and 1920x950 DPR 2 mouse, a real Next from Laurier, HMC Connections, Mohawk, HMC again and Interkom. During each glide a MutationObserver counts `#cam`'s transform writes (at most 14 per glide; report each; be25990 writes it every frame, the prototype 3 to 9) and svg#map's inline transform changes on most frames while the camera moves. After each arrival `#cam`'s transform equals be25990's at that stop within 0.01 and svg#map's transform is none. A screenshot at each stop and at the end beat matches be25990's (at most 0.2% of pixels with any channel off by more than 24; report the counts). During each glide no layer's node is inside svg#map except svg#map itself (in the 1920x950 Mohawk glide the runestone's known split is allowed and reported). svg#map's `will-change` does not change at any glide's start or end after the first glide.
2. `comb-n-trail-test.mjs`: during each of those glides at most 2 trail pieces change any attribute per frame; at each stop, in explore and at the end a crop around the walked trail matches be25990's within the same tolerance; the pieces cover `TRAIL` with their lengths summing to `TRAIL_LEN` within 0.01.
3. `comb-n-sky-test.mjs`: on both pages during the fall (real wheel input from the hero) and during the Mohawk and Interkom glides, a cloud's drawing changes only at its redraws (report counts), each visible cloud's CSS scale stays within `[scaleMin, scaleMax]` of the scale it was last drawn at, and inside a flyer only the legs' transforms and the bob change per frame. At rest at each stop and at the end beat, each visible cloud's crop matches be25990's within check 1's tolerance. No full-screen sky layer is built.
4. `comb-n-wolves-test.mjs`: at 412x915 touch, 1440x900 and 1920x950 mouse, a real Next from Mohawk shows Sköll (warm outline) and the sun (warm rays) and not Hati; from Interkom, Hati (`C.mid` fill) and the moon and not Sköll; neither on the other legs, on a Back over legs 2 or 4, at rest or in explore. Along the arc the wolf trails the lead by `lag * ws`. Measured in journey place (not time), the pair is visible for at least 80% of the glide.
5. Rerun `node tools/check.mjs`, `finds-test`, `steps-test`, `explore-test`, `comb-f-geometry-test`, `comb-m-state-test`, `comb-m-browser-test`, `comb-m-layers-test`, `comb-m2-bar-test`, `comb-m2-ship-test` and COMB-M.md's item 9 list. Change an existing assertion only where it encodes the old walked trail element, svg#sky as one SVG, the sky ravens, the old fixture folder or the layer gate T1 changes, and list each.

## Rules

- You may write only, all under `design/journey-map/`: `data.mjs` (`DEPTH.drawings`' sky entries, `DEPTH.ravens` becoming `DEPTH.wolves`, and `FRAME_PERF`'s three new switches), `depth.mjs` (the sky only: `depthConfigure`'s sky part, `depthSky`, the sky's drawing helpers, the sky lines of `depthResize` and `depthBuild`), `trip.mjs` (`tripApply`'s map hold, promotion and walked trail), `main.mjs` (the map markup's walked trail and the `#sky` element), `map.css` (`#sky` and its children, the walked trail), `joined.html` (only if it holds the sky element), the tests in `tools/` as the checks say, `tools/check.mjs` (`RUNTIME_KB` only, raised by what this part needs, with a dated note), `dist/journey-map.html` and `dist/journey-joined.html` (only through `node tools/pack.mjs` and `node tools/pack-joined.mjs`), and your report `COMB-N-BUILD.md`. Browser profiles, captures and full logs go only in the run folder your prompt names; delete each browser profile when its test ends.
- Never touch `steps.mjs`, `cards.mjs`, `explore.mjs`, `stars.mjs`, `footer.mjs`, the find modules, `art.mjs`, `hero-copy/`, `tools/sky-wolves/`, the briefs, the other build reports or the audits, or anything outside `design/journey-map/`.
- Never run git, never install anything, never use the network (a local headless Edge or Chrome on 127.0.0.1 is not the network), never start reviewer agents or other agents.
- No timing measurements: tests check behaviour, state and pixels, never time.
- If a rule stops you from doing something this brief asks, leave it out and say so in your report. Do not work around a rule.
- Plain ASCII punctuation in `COMB-N-BUILD.md` (write Skoll for the name there).

## Report

`COMB-N-BUILD.md`, short: what you changed for each item and why; what split svg#map's layers and how you stopped it; per glide in check 1, the `#cam` writes and layers seen, before and after; the pixel counts; each test you changed or added and why; one table with the last exit of every test you ran; anything you left out and why.

## Appendix: the measuring prototype for G1 and G2 (be25990, test flags `__holdGlide` and `__pieces`)

Not the build: it shows where the hooks are. It leaves the split G1 asks you to fix.

```diff
--- a/design/journey-map/main.mjs
+++ b/design/journey-map/main.mjs
@@ -13,2 +13,3 @@ import { exploreBuild, exploreResize, exploreApply, exploreActive, exploreReduced } from './explore.mjs';
+const DONE_PIECES = (() => { const L = 40, out = []; let cur = [TRAIL[0]], acc = 0, u0 = 0; for (let i = 1; i < TRAIL.length; i++) { const a = TRAIL[i - 1], b = TRAIL[i], seg = Math.hypot(b[0] - a[0], b[1] - a[1]); let t0 = 0; while (seg > 0 && acc + seg * (1 - t0) >= L) { const t = t0 + (L - acc) / seg, q = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; cur.push(q); out.push({ pts: cur, u0, u1: u0 + L }); u0 += L; cur = [q]; acc = 0; t0 = t; } acc += seg * (1 - t0); cur.push(b); } if (cur.length > 1) out.push({ pts: cur, u0, u1: u0 + acc }); return out; })();
(the map markup gains, after #trail-done:)
+<g id="trail-pieces">${DONE_PIECES.map(q => `<path class="done-p" data-u0="${q.u0}" data-u1="${q.u1}" d="${pathD(q.pts)}"/>`).join('')}</g>
--- a/design/journey-map/map.css
+.done-p { fill: none; stroke: var(--paper); stroke-width: 1.3; stroke-linecap: round; vector-effect: non-scaling-stroke; } #trail-pieces { opacity: 0; }
--- a/design/journey-map/trip.mjs (tripApply)
-  const moving = free && !!st.exploreMoving && !st.exploreScripted && !(zooming && st.exploreSharp);
+  const camMoved = !!r.lastCam && (r.lastCam.s !== c.s || r.lastCam.tx !== c.tx || r.lastCam.ty !== c.ty);
+  r.lastCam = { s: c.s, tx: c.tx, ty: c.ty };
+  const HG = !!globalThis.__holdGlide && !free && !st.reduced && st.handoffT >= 1, glideHold = HG && camMoved;
+  const moving = free && !!st.exploreMoving && !st.exploreScripted && !(zooming && st.exploreSharp) || glideHold;
...
-  if (!free) r.promo = r.soft = false;
+  if (!free) { r.promo = HG; r.soft = false; }
...
-  const L = TRAIL_LEN * paint.s; tripWrite(E.done, 'strokeDasharray', ...); tripWrite(E.done, 'strokeDashoffset', ...);
-  tripWrite(E.done, 'opacity', st.inTrip ? 1 : 0);
+  if (!globalThis.__pieces) { (the old two lines) } else {
+    tripWrite(E.done, 'opacity', 0);
+    const G = E.pieceG ??= document.getElementById('trail-pieces'), list = E.pieceList ??= [...G.querySelectorAll('.done-p')].map(el => ({ el, u0: +el.dataset.u0, u1: +el.dataset.u1 }));
+    tripWrite(G, 'opacity', st.inTrip ? 1 : 0);
+    for (const q of list) {
+      let vis = '', dash = 'none';
+      if (!(st.exploreK || st.u >= q.u1)) { if (st.u <= q.u0) vis = '0'; else dash = `${((st.u - q.u0) * paint.s).toFixed(1)} ${((q.u1 - q.u0) * paint.s + 20).toFixed(1)}`; }
+      tripWrite(q.el, 'opacity', vis); tripWrite(q.el, 'strokeDasharray', dash);
+    }
+  }
...
-  tripWrite(E.svg, 'overflow', free ? 'visible' : '');
+  tripWrite(E.svg, 'overflow', free || HG ? 'visible' : '');
```
