# Polish round 2, part 8: Dan's notes on preview 16 (F)

Dan reviewed preview 16 on 2026-11-24 in the evening, in the thread and in comments pinned on the preview. His words are quoted with each item. Every item says what is wrong today and the result that must hold.

Read `BRIEF.md` first; its rules hold. Then `COMB-E.md` and `COMB-E-BUILD.md` (part 7). Keep everything parts 3b to 7 did unless an item here says otherwise, in particular part 7's label warm-up (sliced, idle only), part 6's idle-time label placement and batched shore stipple, and part 5's counter, focus and review switch.

The run folder your prompt names holds copies of this map's modules as they were at 6d71e9f (part 4b, before part 5) in `ref-6d71e9f\` and at 375cd6a (part 5) in `ref-375cd6a\`, and captures of the map at 6d71e9f in `ref-captures\`. Read them where an item points to them; never import them.

Do F1 and F3 first, then F8, then the rest in order. An item still marked WAITING ON DAN when you start is left out: say so in your report.

## 1. From the hero to the map

- **F1. One scroll.** Dan: "it needs many scrolls to go from the hero to the map when it should just be one". Today `steps.mjs` scrubs the page toward the map with each wheel event or swipe, and when the input stops it slides back unless the scrub passed 12% of the 220 vh stretch (`STEPS.scroll`): one wheel notch (100 px) moves about 11 vh and slides back to the hero, so it takes about three quick notches or a long swipe. The result that must hold, on both pages:
  - At the hero at rest, the first scroll down (a wheel notch, a trackpad flick, or a swipe up of 24 px or more on a touch screen) plays the whole move to the whole map as one animation: the move Start plays today, at its pace. It starts on that first input, not on release.
  - The rest of the same gesture is ignored: wheel or trackpad momentum, or a finger still moving, never adds to the move, starts a second one or turns it back. A gesture ends after 250 ms without input.
  - At the whole map, if scrolling brought you there, the first scroll up plays the move back to the hero the same way; a scroll down there does nothing. Once a start button or Set out has been pressed, scrolling does nothing, as today.
  - A new gesture the other way during the move turns it around from where it is, with no jump (the existing carry).
  - Keys keep their meaning (Next and Back). Reduced motion keeps its own scroll path unchanged.
  - The wheel and swipe no longer scrub the hero; the old scrub and its slide back go.
  Test: on both pages at 412 x 730 (touch) and 1440 x 900: one wheel notch, a trackpad-like burst (40 small wheel events over 600 ms), a quick swipe and a slow swipe each reach the whole map in one move and stay there; one scroll up comes back; momentum after arriving moves nothing; a reverse gesture mid-move turns it; after a start button, scrolling does nothing.

- **F2. The lag.** Dan: "very laggy when scrolling from the hero to the map". Through the move the hero's renderer and the map's star canvas both draw (the last 28 vh of the leave), layers under the opaque hero may repaint, and in preview 16 the label warm-up ran there too (part 7 moves it out). The result that must hold:
  - First measure the move as it is: a trace of the whole move, started with `__jm.next()` at the hero once its entrance has ended, on the joined page at 412 x 730 (DPR 2.625, touch, CPU x4) and 1440 x 900 (CPU x1): frame intervals (p50, p95, max), long tasks, and the main costs by name.
  - Then cut what is not seen: nothing draws or repaints under an opaque layer (the hero stops rendering once the map's canvas fully covers it, the map's layers stay unpainted until they can show), the move's per-frame tables are built while the page is idle before the first scroll, and no warm-up or glide build runs during the move.
  - The same trace after: p95 at 412 x 730 at CPU x4 at least a third lower than before, and no task over 50 ms during the move. If that is out of reach without touching the hero copy, say what is left and what the hero would need.
  - Add the move to `tools/frame-cost.mjs` as a scenario ("hero -> map", started with `__jm.next()` at the hero once its entrance has ended, measured until the whole map), so the timing pass can run it on older builds too. Do not run frame-cost.

## 2. Jormungandr

- **F3. Dan: "jormangandr looks so bad now, what did you do??"** Parts 5 (B3), 6 (D3) and 7 (E2) cut his body into separate humps, so he reads as fragments. Restore his drawing as it was at 6d71e9f (`ref-6d71e9f\`, `ref-captures\`): the ring's surfaced stretches as continuous scaled bands with chevron scales, the head, and the tail in his mouth, at the overview and in his view, with his rest motion and the find's animation as they were then. Keep from the later parts only: the calendar pad and its waterline clear of HERE BE DEADLINES, and every part of him 4 px clear of every label (the map's title and kicker included) at the eight sizes, getting there by moving a stretch along the ring rather than reshaping it. Remove part 6's humps, neck and tail fin and part 7's upright humps. The find's words stay as they are (Dan is choosing a new idea for this find).
  Test: his view and the overview at 412 x 730 and 1440 x 900, side by side with `ref-captures\`.

## 3. Drawings

- **F4. Mjolnir.** Dan: "why is this all the way over here?" Part 6 (D5) moved the stone and hammer from beside Laurier (112, 222) to (110, 288), to keep 4 px from Laurier's name and dates. Put them back beside Laurier, within 10 map units of (112, 222), keeping part 6's drawing of the hammer and the 4 px clearance at the eight sizes (another side of the label is fine); its view, marker and hit area go with it.
- **F5. The mountains.** Dan: "these mountains go off the map". The range west of the tree, beside Mohawk, crosses the west coast. Every peak stays on land, at least 3 map units inside the coast; move or trim the range, nothing else.
- **F6. Yggdrasil.** Dan: "ygdrasil is supposed to have its roots everywhere, it just looks like a normal tree here, also where did ratatoskr go?" Part 5 cut the roots to three short ones and Ratatoskr and Nidhogg went out of sight. Bring back long roots spreading out across the land as at 6d71e9f, one running into Urd's well, keeping part 6's canopy; put Ratatoskr back on the trunk and Nidhogg at the roots, each big enough to read as what it is in the tree's view at 412 x 730 (at least 18 CSS px long) and as a small creature at the overview. Roots, animals and the well keep clear of the well's labels (B1) and the trail.
- **F7. The rhumb lines.** Dan: "random line here", on one of the 16 faint lines that fan out from the wayfinder (7% opacity, the first path in the sea in `art.mjs`); out on open water a lone one reads as a stray line. WAITING ON DAN: remove them all, or keep the 8 main bearings as one visible set from the wayfinder's rose, ending at the coasts and the map's frame.

## 4. Find cards

- **F8. Cards beside their finds.** Dan: "this card is so far away from its treasure chest, all of the chests are like this", and of the horn: "its card is stuck to the top of the screen like others". A card aims at a fixed map point (a hoard: 18 map units above its dig spot, `H.anchor`; the horn: `[f.x + 60, f.y + 65]`), which drifts away from the drawing as the view zooms and can leave the screen, and `placePop` then pins the card to a screen edge with its tail pointing at nothing. The result that must hold for every find's card: it sits beside its drawing's box on screen (a hoard's open chest, the horn itself), 8 to 16 CSS px from it, on the side with room (above first, then the sides, then below), its tail pointing into the drawing; it never covers the drawing, the top controls or the bottom bar, and is never pinned to an edge away from its find. When the view moves, it follows its find.
  Test: every find's card at 412 x 730, 360 x 640 and 1440 x 900, at the find's own view and after one zoom in: the gap and the tail's aim, measured.
- **F9. The horn's facing.** Dan: the horn is "facing the wrong way". Part 6 (D4) aimed its bell west out to sea, and it also lies across the coastline. WAITING ON DAN for the direction. Whatever the direction, it lies on the beach, wholly on land, its view and card following it.

- **F11. The compass lets go.** Dan: "clicking off the compass should deselect". The wayfinder's chosen craft clears only with Escape or by picking again (`findWay` in `findhoards.mjs`). A tap or click anywhere off the wayfinder clears it the way Escape does; a pan, a drag or a pinch does not, and neither does a tap on another find (that find opens as usual).

## 5. Sharpness

- **F10. Blurry stars.** Dan: "some things like the stars here are blurry". The star, depth and nova canvases are capped at device scale 2 (`STARS.dprCap`, `DEPTH.dpr`, `NOVA_CANVAS.dpr` in `data.mjs`) and his phone is 2.625, so their stars are stretched. Draw them at the screen's own scale, up to 3. Report each canvas's frame cost before and after at 412 x 730, DPR 2.625, CPU x4 (at rest, in a glide, in the move from the hero); the timing pass judges it. `depth.mjs` stays untouched (its cap is read from `data.mjs`).

## Checks

- Time: aim to finish within 2.5 hours. If an item still fails after two real attempts, keep the better attempt, record what is left and move on; do not loop on one item.
- All tests pass, as listed in `COMB-D.md`'s Checks, plus the `comb-d-*` and `comb-e-*` tests. Update tests only where this brief changes what they pin, and say which and why; re-record the `finds-test` digests and the `comb-d-pins-test` pins that change.
- Do not run `tools/frame-cost.mjs` or the comb-b and comb-c cost launchers: the timing pass runs separately. Add no per-frame work.
- Screenshots before and after with the local headless Edge (127.0.0.1 only; its profile and captures in the run folder your prompt names) at device scale 2: the overview at 412 x 730 and 1440 x 900; the serpent's view, the tree's view, the horn's view with its card and one hoard's view with its card at 412 x 730; Mjolnir and the mountains at the 412 x 730 overview; and a strip of the move from the hero to the map every 200 ms at 412 x 730.
- The gzip budgets in `tools/check.mjs` hold.

## Rules

- You may write only these files, all under `design/journey-map/`: `steps.mjs` (the wheel, trackpad and swipe handling only), `join.mjs`, `main.mjs` (the frame loop's work during the move only), `stars.mjs` (the move's drawing and the canvases' scale only), `trip.mjs` (only to keep the warm-up and glide builds out of the move), `art.mjs`, `data.mjs` (the data of these items only), `findkit.mjs` (card placement only), `find*.mjs` (the serpent, the hammer, the hoards, the horn, the wayfinder's deselect and the cards only), `footer.mjs` (the nova canvas's scale only, if needed), `map.css` (a card's tail and side only, if needed), the test files in `tools/` (in `frame-cost.mjs` the new scenario only), `joined.html`, `dist/journey-map.html` and `dist/journey-joined.html` (these three only through `node tools/pack.mjs` and `node tools/pack-joined.mjs`), and your report `COMB-F-BUILD.md`. The browser's profile, captures and full test logs go only in the run folder your prompt names.
- Never touch `depth.mjs` (not even a comment), `cards.mjs`, `join.css`, `hero-copy/`, the briefs and other build reports, the audits, the reference copies in the run folder, or anything else outside `design/journey-map/`.
- Never run git, never install anything, never use the network (the local headless Edge on 127.0.0.1 is not the network), never start reviewer agents or other agents.
- If a rule stops you from doing something this brief asks, leave it out and say so in your report. Do not work around a rule.
- Plain ASCII punctuation in `COMB-F-BUILD.md`.

## Report

`COMB-F-BUILD.md`, short: for each item, what you changed and why, with the before and after screenshots; the move's trace before and after (F2) and each canvas's cost (F10); each test you changed or added and why; one table with the last exit of every test you ran; anything you left out and why; what the review should look at. Put full test output in a log file in the run folder, not in the report.
