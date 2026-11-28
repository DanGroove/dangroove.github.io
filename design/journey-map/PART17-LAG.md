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
