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
