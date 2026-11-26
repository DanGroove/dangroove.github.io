# Polish round 3, part 13: smooth moves on Dan's PC, chase only, the X centred on the traveller, a leader line to the card, and the phone's bottom bar (COMB-P)

On 31b60b2 (preview 22 plus part 12 and its review fixes; the packed pages are as at 8fa8c00). The old ash and the carved serpent are the next part (`COMB-Q.md`); leave them alone here. Dan's notes of 2026-11-26 (ET), in his words:

- 1:22 PM, Skoll and Hati: "the animation doesnt read well. just have them chase the sun/moon not catch them".
- 1:23 PM: "also lots of stutters on pc when clicking set out" (Next at the map beat, the map to Laurier move).
- 1:23 PM: "when going from the last node to the x, re-center around the traveller".
- 1:30 PM, on a screenshot of the Laurier stop: "can you show me a few variations of how we can show this area from the shield to the card?". At 1:44 PM he picked "B, Leader line".
- Measured on his Galaxy S24 Ultra (phone-p23d): the bottom bar (`#go`) sits at y 754 to 806 while `innerHeight` is 750, so Back and Next are below the screen whenever Chrome's address bar shows.

Priority if time runs short: P7, P5, P1, P2, P3. Finish within about 100 minutes.

## Items

**P7. The phone's bottom bar stays on screen (`main.mjs` `resize` only, `map.css` `.stage` only).** `.stage` is `height: 100vh`, which on Chrome for Android is the height with the address bar hidden (806 px on Dan's phone), while the page lays itself out to `innerHeight` (750 with the address bar showing). So the bar, at the stage's bottom, falls under the screen's edge. Make the stage exactly the visible height: in `resize` set the stage's height to `h + 'px'` (as `#trip` already is), and keep `100vh` in the CSS only as the value before the first resize. Nothing else moves. Desktop is unchanged (there `innerHeight` equals `100vh`).

**P5. Smooth moves on Dan's PC (P5a: `map.css` the `#sky[style*=...]` rule only and `depth.mjs` the line that sets `#sky`'s opacity; P5b: the parts named in each step below).**

*P5a, part 12's style recalculation.* Part 12 changed `#sky[style*="opacity: 0;"] > svg { display: none; }` to `> *`. A selector that tests the `style` attribute and ends in `*` makes Chrome recalculate the whole subtree of every element whose inline style changes, on every frame, wherever that element is. Measured:
- On Dan's PC (pc-p23-trace, Set out, Laurier and HMC moves), `Document::recalcStyle` is the main thread's biggest item in every move, 835 to 983 ms in 4.5 s; preview 22 does not have it in its top four. The moves have 22 to 57 main-thread tasks over 8 ms against 2 to 4 in preview 22.
- In a local trace of Set out at 1920x950, Recalculate Style touches about 2,070 elements per frame (367 ms in the window) against 73 per frame (80 ms) in preview 22. With only that rule replaced by a class, it is 67 per frame (55 ms).

Fix: no rule may test the `style` attribute.
- Replace the rule with `#sky.sky-off > * { display: none; }`.
- Where `depth.mjs` sets `DP.sky.style.opacity`, set the class with `DP.sky.classList.toggle('sky-off', <that opacity> <= 0)`, so it only changes when the state does.
- Search `map.css` and the modules for any other selector on `[style` and replace it the same way. Today there is only this one.

*P5b, the long frames.* Measured on Dan's PC with `tools/trace-hitches.mjs` over pc-p23-trace (Set out, the Laurier move and the HMC move, two runs each; preview 22 and the base build alike):
- Every frame over 25 ms is the GPU process rasterising. During the gap the main thread is nearly idle (2 to 12 ms in an 80 to 177 ms gap), the GPU process's main thread is busy for the whole gap (about 80% `RasterDecoderImpl::DoRasterCHROMIUM::Deserializing`, 20% `Flush`), and the frame waits in `SubmitCompositorFrameToPresentationCompositorFrame`.
- `svg#map` repaints on every main frame of a move (431 to 630 times in 4.5 s), so the GPU process is about 99% busy throughout. Locally, the writes inside `svg#map` in one move are, on every frame: the compass words' and tally's `font-size`, `x` and `y` and the needle (`findhoards.mjs`); the ravens; the serpent's pad and head; the beacon's beam and flame; the well's ripples and Yggdrasil's life; the horn's rings; the hoards' glints; `#f-bits`; the markers' `.mk-size` scale and the ticks' stroke width (`trip.mjs`, both from the camera's scale); the trail pieces; and the label fades.
- The worst gaps (100 to 177 ms) come when big layers re-raster in the same frame. Three sky clouds rebase together 10 to 15 times per move (their layers are up to 22,000 device px across in Set out), often in the same frame as `svg#map` and `svg#map-base`.

Fix, in this order:
1. **A quiet map while gliding (`finds.mjs` `findsFrame` only; `trip.mjs` `tripApply`'s markers and ticks and a new `tripGliding()`; `findhoards.mjs` the compass's per-frame writes only).** While the camera glides with `svg#map`'s raster held (`glideHold` with the camera moving, from the press to arrival, find focus moves included; not explore), nothing inside `svg#map` changes except: `#cam` at a rebase, the trail pieces, the labels (their scale at a rebase and their fade), the markers' cover fade, the longship on its crossing, and the find being pressed. So:
   - `findsFrame` skips `o.tick` for every find that is not playing, not `JOURNEY.focus` and not the sheet owner while `tripGliding()` is true. Their idle life picks up again on arrival. A small jump in an idle loop is fine; a jump in a state, such as a chest's lid, is not. When a tick is skipped only because of the glide, leave that find's sky-side pieces as they are (do not call `depthBeam(null)` for that reason).
   - The markers' `.mk-size` scale and the ticks' stroke width use the raster's scale (`paint.s`, as the labels do), so they change only at a rebase.
   - The compass words and tally are written only while they are visible, and while gliding only at a rebase, from the raster's scale.
2. **One big re-raster per frame (`trip.mjs` `tripApply`; `depth.mjs` `depthSkyPlace` and its callers).** In any one frame at most one of these rewrites its raster: `#cam` (`svg#map`), `#cam-base` (`svg#map-base`), or one sky object's `viewBox`. Whatever else is due waits for a following frame, the biggest overshoot first. The base never waits when its held raster would no longer cover the screen (`covers`). `svg#map` and a sky object may run up to 10% past their hold range while they wait.
3. **Fewer re-rasters on long zooms (`trip.mjs`, `depth.mjs`, `data.mjs` `FRAME_PERF`).**
   - `svg#map` rasters ahead while zooming in, as the base does: a rebase with the scale rising sets the raster's scale to `c.s / FRAME_PERF.scaleMin`, capped at the glide's end scale (as `baseAhead` is), so one raster lasts from ratio 0.87 to 1.15.
   - During a move, sky objects hold from 0.8 to 1.3 (new `FRAME_PERF.skyMin` and `skyMax`), and one that rebases while its scale rises rasters ahead to ratio 0.8. At rest they still rebase to the exact scale, one per frame.
4. In the report, give the number of rebases of each layer in one Set out before and after (base build, locally: about 11 for `svg#map`, 6 for the base and 15 per cloud).

**P1. Skoll and Hati chase, never catch (`depth.mjs` the sky only, `data.mjs` `DEPTH.wolves` and the sky drawings, `map.css` `#sky` children).** Remove the catch from part 12's E1 and keep everything else:
- Remove `k` and `release`: the wolf trails the lead by a constant `lag x ws` for the whole run, so it never reaches the sun or moon. The disc stays at `R = sunR x s`.
- Remove the bite (the `.sky-bite` circle and its clip path), the ring of light (`b.halo`), the sky dim (`b.dim`), Hati's sparkles (`b.sparkles`), Hati's ghost disc (`.sky-ghost`; the crescent stays at full opacity), and the fill blend toward `C.shade` (the wolves keep their own fills). Remove their elements, not just their opacity, and the `DEPTH.wolves` keys only they used.
- Keep: the run in the open sky right of the map at PC sizes with the per-leg windows, the phones' full-width arc, the fades in and out, the retire before the map's labels, the bigger sun and moon with their glow (`b.glow`), the motes from `u` 0.08 to 0.75, the gallop, forward moves only, never in explore.
- Keep a small test hook on each bird with `{ u, lead, wolf, R, alpha, gap }` (lead and wolf as screen points, `gap` their screen distance) in place of `b.eclipse`.

**P2. From Lennard to the X the camera stays on the traveller (`trip.mjs` `tripXCamera` and the `legX` branch of the camera only, `data.mjs` `CAMERA` x keys).** Today the `legX` move mixes the trail camera into `tripXCamera()`, which centres the X-and-Toronto group (`fitGroup`, `cx` = the group's middle). So the traveller drifts left of centre through the second half of the move and rests left of centre at the X, about 216 px at 1920x950. Only the next press (the rush) slides it to the middle.
- The X view (`tripXCamera`) puts the X, where the traveller rests, at the screen's horizontal centre: `cx = MAP.x[0]`, `ax = VIEW.w / 2`. The vertical rule stays as it is.
- Its scale still keeps the whole group in view, now measured around the X: the half-width needed is `max(MAP.x[0] - group[0], group[2] - MAP.x[0])`, with `xMargin` on each side.
- Phones: the same rule, except that the scale never drops below 0.8 x today's phone X scale. Where that clips the skyline's right end, let it clip, and say in the report how much is cut at 412x915 and 390x844.
- Through the whole `legX` move, the camera's map point is the traveller's own point each frame (`cx, cy` = the traveller). Only the scale and the screen anchor ease from the trail camera to the X view, on `CAMERA.xEase` as now. So the traveller glides smoothly from the trail anchor to the screen's centre and arrives with no jump.
- The footer acts start from the new X view, so the rush no longer has a sideways slide. Check that the nova build-up, the blast and the footer still look the same as before from that start.
- Back from the X to Lennard runs the same path in reverse.

**P3. A leader line from the shield to the card (`cards.mjs` the tail markup, `cardsTailLayout` and `cardsTailFrame`; `art.mjs` `cardTailSvg` only; `data.mjs` `CARD_TAIL`; `map.css` `.c-tail` rules).** This replaces the tail wedge (the triangle in the place's colour and its 18% edge line), drawn in screen pixels:
- **The line:** a straight `C.paper` line, 1.3 px wide, at opacity 0.8. It runs along the same ray the tail uses today (from the shield's centre toward the projected card edge midpoint, `mid` in `cardsTailLayout`). It starts 5 px outside the traveller ring's radius (O3's ring, radius `stonePx x (MARK.radius + MARK.rim / 2) / MARK.box` + its offset) and stops 9 px short of the card's edge.
- **The dot:** a `C.paper` dot of radius 2.8 px at the shield end.
- **The bar:** a `C.paper` bar 2.2 px wide with round caps, 32 px long, lying along the card's projected edge where the line meets it, 1 px outside the edge. It follows the card's tilt the way the tail's base does now.
- **Desktop:** the card sits 44 px further from the shield than today (the tail length cap `CARD_TAIL.len` grows by 44).
- **Phones:** the card stays where it is. The line runs the same way to the card's top (or bottom) edge. If the visible line would be shorter than 16 px, move the card out until it is 16 px.
- **Visibility:** the line, dot and bar fade with the card face exactly as the tail does now, and hide whenever the tail would be hidden. Reduced motion keeps today's rule.
- **Colour:** no place colour in the link any more, and nothing red.
- **Reference:** the leader line's look was approved from a mock drawn on the real Laurier stop at 1920x950: line from (ring centre x + ring radius + 5) to (card left edge - 9) at the ring's y, the dot at the line's start, the bar from y - 16 to y + 16 at the card's left edge - 1.

## Checks

New tests go in `tools/`:
- Use real CDP input only.
- Read state through computed styles, classes, attributes, `LayerTree`, `Animation`, trace event counts and the page's existing test hooks.
- Check behaviour, state, counts and pixels, never time.
- "The base build" means the packed pages from before your changes, saved in the run folder at the start.

1. `comb-p-bar-test.mjs`: at 412x915, 390x844 and 1920x950, the stage's height equals `innerHeight` after load and after a resize to a shorter height (emulate the address bar with a 56 px shorter window). In both states `#go`'s bottom is at or above `innerHeight`, and a real tap on Back at Laurier moves the journey back.
2. `comb-p-style-test.mjs`: at 1920x950, trace a real Next at the map beat (category `devtools.timeline`) and sum `UpdateLayoutTree`'s `elementCount` over the move. It must average under 150 elements per rAF frame (base build: about 2,070). No rule in `document.styleSheets` has `[style` in its selector.
3. `comb-p-quiet-test.mjs`: at 1920x950 with real presses: Set out, Next at Laurier and Next at HMC. Number a MutationObserver's records by rAF frame. Then:
   - during the glide, no element inside `svg#map` is written except those P5b step 1 allows (list them in the test);
   - `.mk-size`, the ticks, the label scales and the compass texts change only in frames where `#cam` changes;
   - in no frame do two of `#cam`, `#cam-base` and the sky objects' `viewBox` change;
   - one Set out rebases `svg#map` at most 7 times and each cloud at most 5 times.
4. `comb-p-chase-test.mjs`: at 1440x900 and 1920x950 mouse and 412x915 touch, do a real Next from Mohawk and from Interkom. Per frame, the wolf's distance to the lead stays within 3% of its median while both are fully visible. No element for the bite, halo, dim or sparkles exists, and the wolf's fills never change.
5. `comb-p-x-test.mjs`: at 1920x950, 1440x900 and 412x915, do a real Next at Lennard and record the traveller's screen point every frame.
   - It moves smoothly: no frame step over 1.5 times the median step after the start.
   - It ends within 2 px of the screen's horizontal centre at rest.
   - At the PC sizes the whole Toronto skyline is on screen at the X.
   - A Next at the X then shows no sideways slide of the traveller.
   - Back to Lennard returns the traveller to the trail anchor.
6. `comb-p-leader-test.mjs`: at Laurier on the map beat and at each stop after a real Next, at 1920x950 and 412x915:
   - the line, dot and bar exist and the old wedge does not;
   - the line starts 5 px outside the ring and ends 9 px short of the card;
   - the bar sits on the card's edge;
   - on desktop the card is 44 px further out than in the base build;
   - nothing in them is red.
7. Rerun `node tools/check.mjs`, `finds-test`, `steps-test`, `explore-test`, `depth-test`, `nova-test`, `whirl2-test`, `comb-n-wolves-test`, `comb-o-eclipse-test` (rewrite it as the chase test or retire it in favour of check 4, and say which), `comb-o-ring-test`, `comb-o-dim-test`, `comb-m-layers-test`, `comb-n-hold-test`, `comb-n-sky-test`, `comb-n-trail-test`, `comb-l2-all-finds-test` and every test that names `c-tail`, the X camera, `glideHold`, `FRAME_PERF` or the sky's rebases. Change an existing assertion only where it encodes what this brief changes on purpose (the eclipse, the X framing, the tail wedge, the rebase rules), and list each such change.

## Rules

- **You may write only the following, all under `design/journey-map/`:**
  - the files and parts named in each item above;
  - the tests in `tools/` as the checks say;
  - `tools/check.mjs` (`RUNTIME_KB` only, raised by what this part needs, with a dated note);
  - `dist/journey-map.html` and `dist/journey-joined.html`, only through `node tools/pack.mjs` and `node tools/pack-joined.mjs`;
  - your report `COMB-P-BUILD.md`.
- Browser profiles, captures and full logs go only in the run folder `journey-map-runs\comb-p` (env `COMB_RUN=comb-p`). Delete browser profiles when a test ends.
- **Never touch:**
  - `steps.mjs`, `explore.mjs`, `stars.mjs` or `footer.mjs`;
  - the find modules other than `finds.mjs` (`findsFrame` only) and `findhoards.mjs` (the compass's per-frame writes only);
  - Yggdrasil, the serpent and their art (that is part 13b);
  - `hero-copy/`, `tools/sky-wolves/`, `tools/ygg-old-ash/` or `tools/jorm-carved/`;
  - the briefs, the other build reports or the audits;
  - anything outside `design/journey-map/`.
- Never run git, never install anything, and never use the network (a local headless Edge or Chrome on 127.0.0.1 is not the network). Never start reviewer agents or other agents.
- No timing measurements: tests check behaviour, state, counts and pixels, never time.
- If a rule stops you from doing something this brief asks, leave it out and say so in your report. Do not work around a rule.
- Use plain ASCII punctuation in `COMB-P-BUILD.md`, and write Skoll there.

## Report

Write `COMB-P-BUILD.md`, kept short. It should cover:
- what you changed for each item and why;
- P2's skyline cut on phones;
- P5's rebase counts before and after, and which finds' ticks the glide pauses;
- each test you changed or added, and why;
- one table with the last exit of every test you ran;
- anything you left out, and why.
