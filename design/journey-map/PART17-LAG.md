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
