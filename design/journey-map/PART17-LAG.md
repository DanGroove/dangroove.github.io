# Part 17: lag (cloud, 28 Nov 2026)

Dan asked at 3:10 AM ET to keep cutting lag until it is as good as it can get. His PC was asleep, so this pass was found
and fixed in the cloud by Claude, not by Codex. Cloud Chromium rasters in software, so the numbers below compare builds
under the same fixed clock (240 Hz at 1920x950, 60 Hz at 412x915); real frame rates wait for the PC and the phone.

## Why part 15 slowed Set out (190 to 140 fps) and HMC1 to Mohawk (200 to 163 fps)

1. **Zoom-in glides stopped drawing ahead.** Part 15 drew every big layer at the shown camera, so a redraw lasted only
   k 1 to 1.15 instead of .87 to 1.15. Set out redrew each big layer 12 times (84 redraws in 84 frames) against
   Preview 29's 6. `tripRasters` (trip.mjs) draws ahead toward the end scale again in zoom-in journey glides: svg#map
   and the layers on its camera at up to 1/scaleMin, anchored at the camera's anchor; the base at up to baseAhead,
   anchored at the screen's centre. Explore and find focus stay at true scale, as before.
2. **The 33 small looping layers redrew almost every frame while moving.** Their hold check used the box snapped to
   device pixels, which outgrew the drawing by a fraction of a pixel, so the check failed each frame: 21,240 redraws
   in Set out, 19,837 in HMC1 to Mohawk. `findIdleFrame` (findkit.mjs) now checks the unsnapped box against the screen
   and, while moving, draws up to 128 px past the screen's edges so a piece sliding in is already drawn.
3. **The hidden compass veil was redrawn 12 times in each Set out.** It is skipped while hidden and moving; rest draws
   it sharp, and it redraws at once if it shows mid-move.
4. **The redraw lead applied on both sides of the band.** At 60 Hz a fast zoom made a layer just drawn at k = 1 due
   again at once. The lead now narrows only the side the zoom heads for.

## Results (cloud, same clock)

| Move | Measure | Preview 29 | Part 16 | Part 17 |
|---|---|---|---|---|
| Set out, 1920 | big-layer redraws | 37 | 84 | 40 |
| Set out, 1920 | small-layer redraws | n/a | 21,240 | 187 |
| Set out, 1920 | raster tiles / ms | 6,128 / 941 | 12,171 / 1,564 | 4,965 / 907 |
| Set out, 1920 | paints | 2,429 | 9,482 | 1,824 |
| HMC1 to Mohawk, 1920 | small-layer redraws | n/a | 19,837 | 213 |
| HMC1 to Mohawk, 1920 | raster tiles / ms | 6,117 / 3,144 | 10,965 / 4,334 | 6,206 / 2,899 |
| Set out, 412 | redraws per big layer | 5 | 12, veil 11 | 6 |
| HMC1 to Mohawk, 412 | redraws per big layer | 4 | 6, veil 7 | 5 |

## Checks

- Every layer stays locked to the map in every frame of every move at 1920 and 412: no misaligned frame, no afterimage,
  no clipping.
- Rest stills at every beat match part 16 (the 1920 stills of hmc2, interkom and after-setout vary run to run on the
  same build too; the 412 stills are identical).
- Pass: comb-s-raster, comb-s-idle, comb-t-words, comb-t-legend, comb-t-ash, comb-t-beacon, comb-t-spatial (556 cases),
  explore, steps, finds (trip.mjs pin re-recorded) and check (budgets +0.7 KB).
- comb-t-picture's new differences (wayfinder and serpent at 1920, beacon and serpent at 412) are the looping animations
  resuming one frame sooner once the camera settles on an opened find: the serpent's clock reads 4.85 s against 4.8667 s. Every camera matches
  at rest, and a forced fresh redraw changes nothing. comb-s-picture failed before this part as well.

## Next costs seen in HMC1 to Mohawk (part 17 build)

Nearly every frame still repaints: the stop markers (stone and traveller ring resized to the camera scale each frame,
six stop transforms that repaint the overlay), the find markers' layer, the minimap, the supernova hit button, the Next
fill, and transform writes to the hidden lines and veil. The largest raster costs are the base, the cards, the faces
and the timeline.

## Part 17b: less work per frame (cloud, 28 Nov 2026)

Also found and fixed in the cloud by Claude while the PC slept. Each change keeps the picture the same; the checks
below compare against part 17 frame by frame.

1. **Closed cards are hidden.** Six closed card faces and their shadows sat at opacity 0 but were still layers that got
   painted and grouped every frame. `cardsFrame` (cards.mjs) sets them `visibility: hidden` while closed; the first
   opening frame shows them with both transforms already written.
2. **Stones resize only when a device pixel is crossed while moving.** The stone, its hit box and the traveller ring were
   resized to the camera's scale every frame, so each stone repainted about 795 times in HMC1 to Mohawk. While the camera
   moves, the size snaps to whole device pixels (about 33 repaints per stone); at rest it is exact, as before.
3. **Live tuning is looked for every 16th frame.** `JSON.stringify` of DEPTH, NOVA and FIND_PLAY (about 31 KB) ran every
   frame to notice edits from the tuning panel; it now runs every 16th frame (main.mjs, depth.mjs, finds.mjs).
4. **The 33 looping layers skip unchanged writes.** `findIdleFrame` (findkit.mjs) remembers what it last wrote for each
   layer and its trail pieces, so an unchanged value no longer reads the style back. Only this loop writes these.
5. **Hidden compass veil and lines are left alone while moving** (trip.mjs). One shown mid-move fades in from 0 and is
   placed the next frame, as the veil already was in part 17.
6. **The supernova hit is left alone while off screen** (footer.mjs), unless it has focus.
7. **The sea rings' path is built without arrays per point** (depth.mjs `depthRing`): the same canvas calls.

### Results (cloud, HMC1 to Mohawk, 1920, two runs each, ms per frame)

| | JS | style | layout | prepaint | paint | layerize | hit test | total |
|---|---|---|---|---|---|---|---|---|
| Part 17 | 4.46 | 0.69 | 0.55 | 0.34 | 0.51 | 1.45 | 0.52 | 8.52 |
| Part 17b | 3.59 | 0.65 | 0.15 | 0.27 | 0.37 | 1.21 | 0.47 | 6.71 |

Paint events fell from 10,528 to 5,006 and composited layers from 109 to 85.

### Checks

- Pass: comb-s-raster, comb-s-idle, comb-t-words, comb-t-legend, comb-t-ash, comb-t-beacon, comb-t-spatial, explore,
  steps, finds (trip.mjs and depth.mjs pins re-recorded) and check (budgets +0.8 KB).
- Part 17 against 17b with comb-t-picture's own poses: identical within 4/255 except the red traveller ring at the
  overview, which is now drawn crisp where part 17 drew it slightly soft (the six closed shadow layers no longer sit
  beside it, so it rasters in a different layer group). comb-t-picture and comb-s-picture fail against their older
  bases as before; the 412 explore difference in this run is the X glow's real-time animation, and part 17 against
  17b shows none.
- Rest stills at every beat match part 17 on both sizes.
- Real clicks and keys, part 17 against 17b at 1920 and 412: a card closing, reopening, closing by its button, Tab
  and Enter, a glide, Lennard to the X and the X dig, a compass word and its veil. Every frame matches except stones a
  fraction of a pixel different in size while the camera moves, and the same crisper ring at rest.
- Every layer stays locked to the map in every move at 1920 and 412, with no afterimage, and no looping layer clips.

### Next costs seen in HMC1 to Mohawk (part 17b build)

Inline style writes every frame for off-screen compass words (16 a frame), stop transforms, labels and the HMC chest
hit; the seven find markers (SVG transform attributes) and the minimap repaint and relayout every frame; the trail
drawing in repaints by design. JS is led by `findsFrame` (1.0 ms in the cloud), `depthFrame` (0.8) and `starsFrame` (0.7).

## Part 17c: no layout per move from the markers and minimap (cloud, 28 Nov 2026)

Also found and fixed in the cloud by Claude while the PC slept, keeping the picture the same.

1. **The seven find markers move without a layout.** They sat in one screen-sized svg and moved by SVG transform
   attributes, and any change inside an svg makes the browser lay it out again; every layout then makes it hit-test the
   mouse again on the next frame. Each marker is now its own 96 px svg (its viewBox centred on the marker's map spot) in
   an HTML layer, moved by a CSS transform in px (main.mjs, map.css). The `.mk` elements, their hits, sizes and fades
   are unchanged.
2. **The minimap moves without a layout.** Its view box is four 1 px strips that tile the 1 px stroke the rect had (top
   and bottom take the corners) and add their light (`mix-blend-mode: plus-lighter` in an isolated group), so a pixel
   two strips share gets one stroke's coverage. The traveller dot is a small svg of its own with the map svg's box and
   viewBox. Both move by CSS transforms in px over the map svg, clipped to the same box (trip.mjs `tripApply`,
   map.css); the svg's meet mapping is measured once after each resize.
3. **The timeline's ink fades on a layer of its own** (`.tl-bg` gets `will-change: opacity` outside reduced motion), so
   a card opening no longer redraws the 1920 px bar each frame. The rows and years stay painted: a squeezed layer draws
   soft, and a layer for the years would lift the rows onto one.
4. **The finds re-read only what changed.** `findIdleFrame` (findkit.mjs) read the text of all 33 looping layers and
   their chains' transforms twice a frame to notice changes; MutationObservers now say when to read again. The copies
   of the looping finds' attributes (finds.mjs) are made only for sources that changed. Without MutationObserver (the
   node tests) both fall back to reading every frame.
5. **The compass words, the HMC chest hit and the Next bar's fill keep their last write** instead of reading the style
   back (findhoards.mjs, main.mjs, steps.mjs); only their own frame code writes them. Every word is still placed every
   frame, on screen or not (comb-t-words).

### Checks

- Pass: comb-s-raster, comb-s-idle, comb-t-words, comb-t-legend, comb-t-ash, comb-t-beacon, comb-t-spatial, explore,
  steps, finds (trip.mjs pin re-recorded) and check (budgets +1.7 KB).
- Rest stills at every beat: identical to part 17b at 412; at 1920 only the minimap's view box differs, at its corners
  (4 or 5 pixels a still, at most 54/255). Part 17b's SVG stroke drew each corner pixel about a third darker than the
  stroke's own coverage; the strips draw the exact coverage.
- Real clicks and keys at 1920 (a card closing, reopening, closing by its button, Tab and Enter, a glide, Lennard to
  the X and the X dig, a compass word and its veil), against part 17b and against part 17b run twice: every frame
  matches except the view box's edges (exact coverage now, where the stroke's was rounded to quarter pixels, at most
  50/255 on its 1 px lines), three pixels of a card's leader dot (at most 32/255) and the compass words' CSS fades,
  which differ as much between two runs of part 17b.
- Every layer stays locked to the map in every move at 1920 and 412 (worst 0.11 px), with no afterimage, and no
  looping layer clips. comb-t-picture's poses, part 17b against 17c: identical within 5/255 (a repeat of the 412
  overview, whose first run showed 14/255 on outer-space strokes, is identical).

### Results (cloud, ms per frame, part 17b against 17c)

| | JS | style | layout | prepaint | paint | layerize | hit test | total |
|---|---|---|---|---|---|---|---|---|
| HMC1 to Mohawk, 1920, two runs each: 17b | 3.59 | 0.64 | 0.16 | 0.27 | 0.37 | 1.24 | 0.45 | 6.72 |
| 17c | 3.26 | 0.68 | 0.11 | 0.25 | 0.31 | 1.25 | 0.20 | 6.06 |
| Set out, 1920: 17b | 3.53 | 0.61 | 0.26 | 0.27 | 0.37 | 1.25 | 0.45 | 6.74 |
| 17c | 3.23 | 0.62 | 0.24 | 0.25 | 0.23 | 1.28 | 0.26 | 6.11 |
| HMC1 to Mohawk, 412: 17b | 0.69 | 0.12 | 0.05 | 0.05 | 0.08 | 0.21 | 0.06 | 1.26 |
| 17c | 0.67 | 0.13 | 0.05 | 0.05 | 0.07 | 0.23 | 0.04 | 1.24 |

Layouts fell from 1,222 to 557 in HMC1 to Mohawk and from 1,219 to 754 in Set out, hit tests from 1,252 to 586 and
from 1,257 to 791, paint events from 5,006 to 3,555 and from 5,683 to 3,824. Tile rasters in HMC1 to Mohawk fell from
6,480 to 5,220. The phone size does about a fifth of the work and is flat in total.

### On the PC (Preview 29 against Preview 32, 1920x950 at DPR 2, 240 Hz, two runs each)

Moves got faster: Set out 186 to 201 fps, HMC1 to Mohawk 196 to 210 (frames over 25 ms 11 to 5), the explore opening
144 to 192, the visit to Laurier 170 to 203, the pinch 140 to 165. Lennard (201 to 208) and the X (217 to 214) are
flat, the presses are flat at about 200 fps with 2 to 4 frames over 25 ms, and rest stays at the runner's cap
(233 to 235) with no big layer redrawn at rest. The worst frames line up with the GPU process's longest tasks (54 to
58 ms in HMC1 to Mohawk): the big map layers drawn again at a new zoom.

### Next costs

- The big map layers (`svg#map-base`, `svg#map`, `svg#map-finds`, `svg#map-live`) are drawn again at each zoom step
  of a move; on the PC those redraws are the longest frames.
- In the pinch the compass words (`svg.compass-word.find`, inside `#map-stack`) are repainted at map size 1,100 to
  1,300 times.
- Small layers drawn again almost every frame of HMC1 to Mohawk: the tier-2 label groups (`g.t2b`, 758 tiles), the
  timeline track (476), the markers' size groups (about 300 each), the Next bar (296), `div.ov` (294) and a card face
  (180).
- The main thread still layerizes every frame (1.25 ms in the cloud), and the page's own frame code is 3.3 ms.

## Part 17d: the spikes first (cloud and phone, 28 Nov 2026)

Dan, 28 Nov 7:49 AM: "lets really hone in on the lag spikes, if we can remove those, a dropped frame here or there wont
be so noticeable". Done by Claude in the cloud, with the phone and PC measuring, keeping the picture the same.

### What the phone showed (Preview 29 against 17c, Galaxy S24 Ultra, two runs each)

17c is smoother in moves (Set out 7 frames over 25 ms to 2, HMC1 to Mohawk 6 and 5 to 2 and 1, the Laurier visit 8 to
2 and 1) and its compass presses no longer flash (Preview 29: 103 to 1,762 flashed frames), but the presses still have 5
to 10 frames over 25 ms and one stall of 167 ms. Every gap over 50 ms in the traces (17 of them, both builds) is the GPU
process, not the page: the main thread does 3 to 9 ms in each, and the GPU spends it creating new tile memory
(`SharedImageStub::OnCreateSharedImage`, up to 147 ms; 53 to 96 new 544x544 tiles in one press gap) or drawing tiles
(`DoEndRasterCHROMIUM`, up to 166 ms), at the start of a press or a move, often with tiles still missing.

The screen recordings show one more thing on both builds: when the Set out and HMC1 to Mohawk glides end (4.1 to 5.0 s
after Next), the picture changes only about every 98 ms (10 fps) for 2.5 to 3.3 s. Its first gaps are the page's own
work (main thread 26 to 61 ms: script 10 to 34, layerizing 8 to 12). The cloud does not show it (60 fps from 0.5 s after
a glide ends), and the traces stopped at 4.5 s, so the next phone pass records 9 s.

### Fixes

1. **The compass lines are cut by a clip, not a mask.** Under the compass and its words the growing lines were cut by
   a mask, so every redraw of the lines layer drew it twice and blended the two: in a press the cloud drew 4,362 tiles
   in 8.4 s for it, against 2,185 tiles in 0.7 s with no cut. The cut is now an even-odd clip path, the map frame with
   one hole per cut (the compass ring and each word's box; they never overlap), so the same pixels stay hidden:
   1,964 tiles in 1.2 s (main.mjs, findhoards.mjs).
2. **No forced layout when a move starts or ends.** The idle layers paused and resumed their one CSS stroke animation
   (the rune trace) by asking each of the 33 layers for its animations, and each ask forced a style and layout pass
   (30 ms in the cloud, at every start and end of a move). The animation is now listed when made (`findIdleAnim`,
   findkit.mjs and findsheets.mjs) and only it is paused or played.
3. **The next glide is worked out in a seventh of the time.** 0.1 s after a glide ends the page builds the path table
   of the glide ahead (2,049 camera samples) in one task, and each sample worked out the glide's two ends and its nine
   Bezier controls (81 trail lookups) again. They are now worked out once per table (`glidePrep`, trip.mjs): 14 ms to
   2 ms per table in the cloud (median of five, each glide), 35 ms to 12 ms in the first one after a glide.

### Checks

- Pass: finds (trip.mjs pin re-recorded), explore, steps, check (budgets +0.75 KB), comb-s-raster, comb-s-idle,
  comb-t-words, comb-t-legend, comb-t-ash, comb-t-beacon and comb-t-spatial (comb-o-dim needs Edge 158, on the PC).
- Every camera of 360 frames through five glides (Set out, HMC1 to Mohawk, Lennard to the X, Back from Laurier and
  from Mohawk), at 412 and 1920, is the same as 17c's to the last digit: fix 3 changes when the table's numbers are
  worked out, not the numbers.
- Real clicks against 17c at 1920 and 412 (cards, a glide, the X and its dig, a compass word, its veil and the compass
  off): rest, the cards, the glide and the X match within 18/255 on at most 12 pixels, the phone-size compass within
  6/255. In the first 0.3 s of a wide compass press some label and line edges differ by up to 62/255 while 17c run twice
  matches itself exactly, most likely because those layers' new tiles are ready sooner; from 0.7 s on, 3 pixels at one
  cut edge differ by at most 11/255. A first pass taken while other probes ran showed larger differences (the compass
  caption at 412, the X arriving at 1920) that quiet reruns did not, so captures are taken on a quiet machine.

### On the PC (Preview 32 against 17c, 1920x950 at DPR 2, two runs each)

Presses: print 194.8 to 200.7 fps (frames over 25 ms 5 to 2.5, worst 45.9 to 29.2 ms), screen 194.3 to 198 (4 to 2.5,
worst 33.4 to 54.2). Moves: Set out 191.4 to 197.2 (10 to 7.5 over 25 ms, worst 66.7 to 50), HMC1 to Mohawk 213.9 to
212.8 (worst 62.5 on both), the explore opening 189.6 to 191.8, Lennard to the X flat at 217. Another Codex run on the
PC (its own Chrome) used about one core from 13:09 to 13:12 UTC, during the moves; those rows are marked in the run's
summary.

The long frames are all on the graphics side: the GPU process's longest frame is 42 to 67 ms in Set out and HMC1 to
Mohawk, while the page's own frame (BeginMainFrame) never passes 18 ms and averages about 3 ms, half of it script. 17c
cut layout events by about 40% (545 against 864 in Set out, 400 against 971 in HMC1 to Mohawk), paints by 35% and hit
tests by 40%, which saves 0.15 to 0.25 ms of main thread a frame. In the moves the big layers are still redrawn at map
size (Set out: an unnamed svg 40 times, `svg#map-live` 19, `svg#map-base` 5), and each of those is a GPU raster.
Every gap over 25 ms in 17c's PC traces is the GPU process replaying the recorded drawing of map-sized layers
(`RD::DoRasterCHROMIUM::Deserializing`, 14 to 47 ms, then `DoEndRasterCHROMIUM` 3 to 14 ms) with the main thread at 1
to 15 ms; in the presses the compass words' map-sized svg is repainted almost every frame (about 180 times in 4.5 s).

### Tools

- `tools/phone-fps.mjs --js` (with `--trace`) records V8's sampling profiler in each row's trace.
- `tools/trace-js.mjs <trace> --page <served page> --from 3500 --to 9000` prints the main thread's stages per slice,
  the script entry points and, from those samples, the page functions by module and line. On a cloud trace of HMC1 to
  Mohawk it names the explore labels' idle warm-up (`tripMeasureExploreLabels`, trip.mjs), which runs in short idle
  tasks for seconds after the glide ends, beside the frame code.

### Next

- Phone pass of 17d against 17c: the presses with the veil's mask and with the whole veil left out (to price them),
  and Set out and HMC1 to Mohawk with a 9 s window and script samples, for the 10 fps stretch after a glide.
- Then the press-start tile memory (the veil, the lines and the pull-back's rebases) and the pinch's repaints.

## Part 17e: the compass veil as a canvas (cloud and phone, 28 Nov 2026)

Still for Dan's steer to remove the spikes first. Done by Claude in the cloud, with the phone measuring, keeping the
picture the same.

### What the phone showed (17c against 17d, Galaxy S24 Ultra, 13:44 to 13:58 UTC, two runs each)

| Row | Build | fps | frames over 25 ms | over 50 ms | worst ms |
| --- | --- | --- | --- | --- | --- |
| Compass press, print | 17c | 54 / 55.6 | 12 / 10 | 3 / 2 | 100.2 / 83.3 |
| | 17d | 55.1 / 54.2 | 12 / 9 | 0 / 4 | 50 / 116.7 |
| | 17d, veil without its mask | 56.4 / 56.7 | 7 / 10 | 2 / 0 | 75 / 50 |
| | 17d, no veil | 57.1 / 57.1 | 8 / 7 | 0 / 0 | 50 / 50 |
| | 17d, no lines | 56.9 / 57.6 | 8 / 5 | 0 / 0 | 49.9 / 49.9 |
| Compass press, screen | 17c | 51.3 / 54 | 20 / 12 | 2 / 3 | 91.6 / 83.1 |
| | 17d | 57.3 / 56.2 | 7 / 7 | 3 / 2 | 66.6 / 66.6 |
| | 17d, veil without its mask | 57.1 / 56.9 | 10 / 6 | 0 / 1 | 50 / 66.5 |
| | 17d, no veil | 58.2 / 57.1 | 7 / 7 | 0 / 0 | 50 / 50 |
| | 17d, no lines | 57.1 / 55.6 | 5 / 7 | 0 / 2 | 50 / 116.6 |
| Set out (9 s) | 17c | 59.6 / 59.3 | 2 / 2 | 0 / 0 | 33.3 / 33.4 |
| | 17d | 59.9 / 59.3 | 2 / 1 | 0 / 0 | 33.3 / 33.3 |
| HMC1 to Mohawk (9 s) | 17c | 59.9 / 60 | 1 / 1 | 0 / 0 | 49.9 / 33.4 |
| | 17d | 59.7 / 59.6 | 0 / 1 | 0 / 0 | 17.1 / 33.2 |

The glides have no frame over 50 ms on either build. The presses still do, and every one of those gaps is the GPU
process making new tile memory (`OnCreateSharedImage`) or flushing raster work. Only the press without the veil had none
in all four runs. A press pulls the camera back about 3x in 0.4 s (at 412 px the scale goes from 1.98 to 0.63), so
every map layer is drawn again at several scales, and the veil, a screen-sized svg whose shade is cut by a luminance
mask of soft holes, was the dearest of them per tile: in the cloud 87 tiles on 9 frames took 171 ms of a press's 892 ms
of raster, about 2 ms a tile against 0.3 ms for the names layer.

The 10 fps stretch after a glide is not a stall. rAF keeps 60 fps and the GPU is idle; the screen changes every 98 to
100 ms because the resting map's mist and sky (the depth layer) are redrawn at `DEPTH.idleFps` = 12, which at 60 Hz
falls on every sixth frame. That is the designed idle redraw and stays as it is.

### Fix

**The veil is one canvas drawn at the shown camera.** `#map-veil` is now a screen-sized `<canvas>` in device pixels,
drawn by `tripVeil` (trip.mjs) on each frame the veil is shown and its camera, holes or shade changed: the shade over
the map frame at the fill's alpha, then each soft hole taken out with `destination-out`, which leaves the shade's alpha
times the product of (1 - hole alpha) where holes overlap, as the luminance mask did. A zero-size svg, `#map-veil-defs`,
keeps the definitions that findhoards.mjs writes (the holes, the lines' cut, the fill's frame and alpha), so the compass
code is unchanged. The canvas has no raster camera of its own, so the veil leaves the scheduler's records (one layer
redrawn per frame), and its slot goes to the other layers and the sky.

The border is drawn as the svg drew it, to the pixel: the svg multiplied the fill's soft edge by the mask's white frame
(the same box) and cut both on whole device pixels at the mask's region (the same box again). The canvas takes the edge
in once with `destination-in` and clears outside the box rounded to whole device pixels. Without this the map's left
border line under the veil came out up to 21/255 darker.

In a press at 412 px the cloud now rasters 2,883 tiles in 809 ms, against 2,987 in 892 ms: the veil's 87 tiles are gone.

### Checks

- Real clicks against 17d (the compass press and its release, fixed clock, 1920 and 412): with a probe that keeps an
  empty veil slot, so every layer is redrawn on the same frames as in 17d, the canvas veil matches 17d within 3/255 on
  every pixel at rest at 1920, and at 412 differs by at most 5/255 on 19 pixels. Without the probe (the build) the
  resting frames differ only in idle animations caught at another phase (the longship's bob, Yggdrasil's ring, 10 to
  111 pixels), because the freed slot lets the idle layers redraw sooner, and mid-press frames differ in sharpness
  (another layer redrawn on that frame) and in the veil's fade, which runs on real time.
- Pass in the cloud: finds (trip.mjs pin re-recorded), explore, steps, check (budgets +1.31 KB: 226.73 KB runtime,
  343.03 KB map, 589.73 KB joined), comb-r-compass, comb-s-raster, comb-s-idle, comb-t-words, comb-t-legend,
  comb-t-ash, comb-t-beacon and comb-t-spatial.
- `comb-s-raster` counts six layer cameras now (the veil has none). `comb-o-dim` (PC only, Edge 158, not run in the
  cloud) asks that the canvas was drawn at the shown camera and is not moved; its veil opacity check still expected the
  CSS opacity .45 that moved into the fill's alpha in the part 12 review fixes (the veil shows at opacity 1), so it now
  checks both.

### Tools

- `p51/layerraster.cjs` (cloud scratch, not in the repo) counts the tiles each composited layer rasters in a pinch, a
  glide or a compass press, from the trace's raster tasks and the DevTools layer tree.

### Next

- Phone pass of 17e against 17d: both compass presses with traces.
- The lines layer is now the press's dearest: it is rastered on about 67 of a press's frames as its dashes grow.
- The pinch and glide repaints of the names and map layers (label easing, the legend).

## Part 17f: the compass lines in the veil's canvas (cloud and phone, 28 Nov 2026)

Still for Dan's steer to remove the spikes first. Done by Claude in the cloud, keeping the picture the same.

### What the phone showed (17d against 17e, Galaxy S24 Ultra, 15:02 to 15:07 UTC, three runs each)

17e halved the press spikes: frames over 50 ms went from 4 to 2 (print) and 5 to 2 (screen), and the worst frame from
133.3 to 66.6 ms; frames over 25 ms stayed about the same (print 26 against 25, screen 26 against 23). Every gap over
50 ms that is left is the GPU process making new 544 x 544 tiles (`OnCreateSharedImage`).

Read from the saved traces on the PC (no new phone run): the phone runs out of tile memory in the press's pull-back, from
about 275 to 480 ms after the tap (`DidPrepareTiles` reports oom, and its hard limit is 256 MB). From then on a freed tile
is thrown away instead of kept for the next one, so a press makes 800 to 1,000 new images, 500 to 700 of them 544 x 544
tiles (the rest are the small idle layers and the veil's canvas). The compass lines' svg was the single dearest layer: its
dashes grew on about 67 frames of a press while the camera pulled back, about 270 tile rasters a press, plus a burst of 24
to 33 new tiles the moment it was shown.

### Fix

**The lines are drawn in the veil's canvas.** There is no `#map-lines` svg any more. `#wf-lines` moved into the veil's
defs, where findhoards.mjs still writes it each frame, so the compass code is unchanged, and `tripVeil` draws it after
the veil's holes: each line and ring is taken to the svg's viewport by its own transform list and the camera the svg drew
at (scale to 4 decimals, offsets to 2), stroked there as a non-scaling stroke (width and dashes in CSS pixels), and cut by
the even-odd clip `#veil-line-cuts`. The two always show, fade and hide together, so one canvas holds both: no new layer,
no new canvas buffers, and the lines leave the scheduler (five layer cameras now, not six).

The canvas is now placed as the svgs are placed, through their viewBox (`xMidYMid meet`) at the device pixel ratio when
the backing store has the box's device pixels. The 17e veil used the backing's width over `VIEW.w`, half a device pixel
off at the right edge at 412 px on a 2.625 screen, and wrong in reduced motion where a classic scrollbar narrows the box.
A screen emulated by DevTools or Playwright reports CSS pixels for the device box; there the backing's own scale is used,
as before.

### Checks

- Real clicks against 17e (the compass press and its release, fixed clock): with a probe that keeps an empty slot for the
  lines, so every other layer is redrawn on the same frames as in 17e, every resting frame matches 17e within 3/255 at
  1920, and at 416 x 912 on a 2.625 screen (both canvases at device resolution) 24 pixels differ, by at most 5/255. At
  412 at 1x the probe's resting frames differ only in the tally ("PRINT: 5 of 6 stops"), from raster history: rendered
  without the mid-press screenshots all three builds draw it alike, and a fresh raster of its layer changes it the same
  way in each. Without the probe (the build) resting frames differ only in idle animations caught a frame apart (the
  longship's shields, a bird; 19 to 112 pixels), because the freed slot ends a move's resting redraws a frame sooner.
  Mid-press frames differ on the lines, now drawn at the shown camera instead of a scaled raster, and in the veil's
  fade, which runs on real time.
- Tiles, a print press at 412 on a 2.625 screen with the phone's 544 px tiles, the 1.5 s after the tap: 1,046 tiles
  against 1,199; the lines' 103 tiles, and 316 of 820 ms of the cloud's raster, are gone.
- Pass in the cloud: finds (trip.mjs pin re-recorded), explore, steps, check, comb-r-compass, comb-s-raster,
  comb-s-idle, comb-t-words, comb-t-legend, comb-t-ash, comb-t-beacon and comb-t-spatial.
- `comb-s-raster` counts five layer cameras now (neither the veil nor the lines has one).
- Budgets +1.37 KB (228.17 KB runtime, 344.53 KB map, 591.18 KB joined).

### Next

- Phone pass of 17f against 17e, with three measuring variants of 17f (no idle animation layers, no names layer, no
  veil canvas) to rank what is left in a press.
- In the cloud the names layer (`svg#map-live`) is now a press's dearest: 168 tiles on 40 frames.
- The small idle layers repaint one tile each per frame at rest after a press; their boxes are resized at each rebase.
