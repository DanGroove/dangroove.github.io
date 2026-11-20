# Corrections, round 4: journey hero, second take

This brief is for the builder. The round 3 build (`e8cced5` + `50b51b8`) fixed everything in `CORRECTIONS-3.md`: the integrity critic passed every category, and the visual critic verified F1 to F4. One new fault came from F1's drawing-order change, and two records are stale. Everything in `CORRECTIONS-2.md` and `CORRECTIONS-3.md` still holds. Nothing here touches anything outside `design/journey-hero/take-2/`. Do not change `PACE`, the loop length, the scene starts or the still times.

## G1 (major). The dragged cover photo goes blank and the cursor disappears at 25.25 s; the photo also pops 2 px while it crosses the post's frame

Visual V16 and integrity M1, one cause. F1's block in `stage.mjs` ("Only InDesign carries photographs over other empty frames") lifts **each** travelling face on its own, by world z, to clear the empty-frame lines it overlaps: `pc.p[2] = Math.max(pc.p[2], line.p[2] + line.s[2] + LAYER_STEP * U + pc.s[2])`.
- The grey backing and the cover image have different thicknesses and bounds, so they are lifted by different amounts and can swap. At 25.2500 s the backing sits at z −1.551, the image at −1.578 and the cursor at −1.567: the backing covers both, and from 25.2490 to 25.2505 s the photo draws as a blank grey card with no cursor. The 60 Hz frame at 25.25 s falls in that window, so a viewer sees it about one loop in ten. At 25.2480 and 25.2510 s the order is right.
- The lift is along world z, which moves the picture on screen: about 2 px at 1440 x 900, on at about 25.227 s and off at about 25.249 s. `48aea47` has no such step.

Fix:
- The travelling picture's faces (its backing, its image) and the cursor riding it move as **one stack** with one offset, so their order never changes: cursor above image above backing.
- The lift that keeps the stack above the empty-frame lines it crosses must not move it on screen. Apply it along the camera's viewing direction (a point moved along it projects to the same pixel), or hold one constant lift from pick-up to drop if that cannot be done; say which in BUILD.md.
- Pass, in Node, every 0.0005 s over each of InDesign's five drags (`map`, `loc`, `photo`, `postPhoto`, `mailPhoto`): the stack's order is cursor, image, backing; each corner of the travelling image projects within 0.1 px at 1440 x 900 of where `48aea47` projects it; inside the stack's screen rectangle nothing but the cursor and the spread's guides (as in `48aea47`) is drawn above it; F1's rules still hold (no empty-frame line over the travelling picture, the crossed frames whole beneath it). Each with a negative control that fails it: the per-face lift of `e8cced5` must fail the first two.
- Pass, in frames at 1440 x 900: every 0.0005 s over 25.20 to 25.30 s, and at least every 0.002 s over all five drags, the picture and the cursor are drawn in every frame. Every 0.0005 s over 25.20 to 25.30 s the travelling picture's shadow on the wall stays within 1 px of where `48aea47` draws it (moving the stack along the viewing direction keeps its pixels but can move its shadow). With the constant-lift fallback, neither the picture nor its shadow steps at pick-up or at drop. The six stills are pixel-identical to `50b51b8`.

## G2 (minor). Stale records

Integrity M2: README says `tools/browser-check.mjs` checks "eight sizes"; it has ten. BUILD gives `e8cced5`'s pack size (361,587 bytes); state the size `tools/preview.mjs` reports for the final build, and note that a pack made on Windows can differ by line endings. Add a "CORRECTIONS-4" section to BUILD.md with what was done, any departure and its reason, the negative controls, and the `checks.mjs` output.

No hardware run. The browser check cannot run on the builder's machine; it is run elsewhere.

## The re-review (Dan's decision, 19 November, 8:51 PM ET)

Only what changed, with real frames, capped at 20 minutes: G1 and G2, F1's rules where G1 touches them, and a fine-time look at InDesign's five drags.

## Agreement

Both critics accepted this brief on 20 November at about 03:05 UTC (10:05 PM ET on 19 November), with conditions now written in: visual, the `loc` drag in the Node sweep and frames every 0.002 s over all five drags; integrity, the shadow test and no step at pick-up or drop under the fallback.
