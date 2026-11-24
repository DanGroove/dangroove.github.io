# Polish round 2, part 3b: a lighter stop-to-stop glide on a phone

Dan, 2026-11-24, 3:26 AM ET, sending a screen recording from their phone: "another recording, please go through it as ive showcased a lot of flickering and lag".

Read `BRIEF.md` first; its performance rules hold (animate only transform and opacity, one frame loop, read layout only on load and resize). Then `FRAMES.md` and `FRAMES-BUILD.md` (part 3, commit 97e7044). Part 3 removed the blank frames and moves explore as one layer. It left the glide between stops, the move every visitor makes most, as the slowest thing on the page. This part makes that glide lighter without changing anything anyone sees.

## What was measured

On this PC after part 3 (`tools/frame-cost.mjs`, 412 x 730, device scale 2.625, mobile, touch, 4x CPU slowdown): the stop glide runs at p50 54 ms and p95 71 ms a frame on the map page and p95 92 ms on the joined page, with 33 to 44 ms of style and layout in every frame. Explore's pinch is at p95 54 to 58 ms and the rush at 54 to 71 ms.

In the cloud (Chromium, the same size and slowdown, the glide from the whole map to Laurier, a trace of the main thread divided by the frames): layout 16 to 19 ms a frame, paint 15 to 18, layerize 8 to 9, pre-paint 4, style 2 to 3, hit testing 2, script 11 to 14 (spread thinly, no function above 2 % of the time), commit 18 to 22 (that browser draws its canvases in software; check commit here on a real GPU). Switching parts of the page off one at a time showed where the map's share goes:

- **The map's words.** Hiding `.map text` cut layout from 19 to 6 ms a frame: each time the camera's scale changes, the browser lays every SVG text out again at its new screen size. `text-rendering: geometricPrecision` on `.map text` alone cut layout from 16 to 8.7 ms, and its still frames matched today's (no pixel changed at the stop holds; 0.16 % of pixels at the overview at device scale 2.625, none of it visible).
- **The strokes that keep their screen width** (`vector-effect: non-scaling-stroke` on `.l, .o, .g, .pf, .t, .rn, .done`): without them layout fell by 3.5 ms and paint by 7 ms a frame.
- **The whole map SVG hidden:** layout 0.8, paint 1, layerize 1.6 ms. So the map's SVG costs about 45 ms of each glide frame at 4x.
- **Writes that change nothing, every frame, even when nothing moves:** every card's close button has `inert` set (6 a frame), `.go-top` its `hidden` and `.go-back` its `aria-label` (1 a frame each), `#nova-hit` its style about 3 times a frame in a glide. Each queues a mutation and can invalidate style.

## The goal

- The stop glide at 412 x 730 with 4x slowdown on this PC: p95 at most 50 ms (33 ms if you can reach it) and style plus layout at most 12 ms a frame, on both pages. At 1440 x 900 with no slowdown, no glide frame over 33 ms.
- Explore's gestures, the rush and the blast no worse than part 3's table, and no blank frames anywhere.
- **Nothing anyone sees changes:**
  - every still frame (each beat at rest, each card open, each find at rest, explore at rest) matches today's: at most 0.5 % of pixels changed, and none of the changes form a shape you can see (count the changed pixels and look at where they are);
  - at the same moment of a glide, every label has the screen size and place it has today (within 0.5 px), every stroke keeps its screen width (nothing thickens, thins or blurs mid-glide, not for one frame), and the order things draw in holds (words over drawings, shields and cards over words);
  - the trip still moves only by its buttons and keys; Back and a scrub replay exactly; reduced motion is unchanged.

## How

Take the cheap, safe steps first and measure after each:

1. Every per-frame write happens only when its value changes (the ones above and any others you find).
2. `text-rendering: geometricPrecision` on the map's text; check it at device scale 1 and 2.625 against the still frames and the glide frames.
3. Then the screen-width strokes and the rest of the map's paint and layerize. Ways to look at, none required: draw the words in a layer that the camera only moves, with their screen size set as today; carry the screen-width strokes on fewer, merged paths; find what makes the whole map re-layerize every frame. Keep each find's idle motion (the ravens, the beacon, the ship, the needle); it may only stop costing more than its own box.

Write each change in the report with the before and after of its own measurement. Leave out any change that alters a still frame or a glide frame as described above, and say what it would have saved.

## Measure

Measure `tools/frame-cost.mjs` on both packed pages before you change anything and after each step. Add to it: a per-frame breakdown from a trace (layout, paint, layerize, pre-paint, style, script, commit), and stop glides as scenarios: the whole map to Laurier, Laurier to HMC, HMC again to Interkom, and Interkom back to HMC again with Back. Use the local headless Edge on 127.0.0.1 only; its profile and captures go in the run folder your prompt names, never in the repository.

## Checks

- All tests pass: `node tools/check.mjs`, `steps-test`, `nova-test`, `depth-test`, `layout-test`, `explore-test`, `finds-test`, `motion-test`, `hammer-test`, `frame-cost-test`, `frame-performance-test`, `frame-render-test` and `tools/origin-check.mjs`. Update tests only where this brief changes what they pin, and say which and why; re-record the `finds-test` digests that change, and say which.
- Still frames: every beat at rest, each card open and explore at rest, at 1440 x 900 and 412 x 730, before and after, with the counts of changed pixels.
- Glide frames: 12 frames of the whole-map-to-Laurier glide at fixed times on the fake clock (`Date.parse('2026-11-23T17:00:00Z')`), before and after: each label's box within 0.5 px, stroke widths unchanged.
- The gzip budgets in `tools/check.mjs` hold.

## Rules

- You may write only these files, all under `design/journey-map/`: `art.mjs` (how the map's words and strokes are built, never how they look), `trip.mjs` (`tripApply`, `tripLabels` and the camera's writing), `cards.mjs`, `steps.mjs`, `footer.mjs`, `timeline.mjs` and `find*.mjs` (only to make writes change-only), `main.mjs` (the frame loop), `explore.mjs` (only to keep its composited moves working with what this part changes), `map.css`, `data.mjs` (new performance numbers only), the test files in `tools/`, `dist/journey-map.html`, `dist/journey-joined.html` and `joined.html` (the last three only through `node tools/pack.mjs` and `node tools/pack-joined.mjs`), and your report `GLIDE-BUILD.md`. The browser's profile and captures go only in the run folder your prompt names.
- Never touch `depth.mjs` (not even a comment), `stars.mjs`, `hero-copy/`, the briefs and other build reports, or anything else outside `design/journey-map/`.
- Never run git, never install anything, never use the network (the local headless Edge on 127.0.0.1 is not the network), never start reviewer agents or other agents.
- If a rule stops you from doing something this brief asks, leave it out and say so in your report. Do not work around a rule.
- Plain ASCII punctuation in `GLIDE-BUILD.md`.

## Report

`GLIDE-BUILD.md`: each change, where it is and what it saved; the before and after `frame-cost` tables on both pages with the per-frame breakdown; the still-frame and glide-frame comparisons; each test you changed and why; the output of every test run; anything you left out and why; what to look at on a real phone.
