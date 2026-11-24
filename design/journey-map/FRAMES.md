# Polish round 2, part 3: no blank frames, less lag on a phone

Dan, 2026-11-24, 3:26 AM ET, sending a screen recording from his phone: "another recording, please go through it as ive showcased a lot of flickering and lag".

Read `BRIEF.md` first. Its performance rules still hold: animate only transform and opacity; one `requestAnimationFrame` loop, paused when the tab is hidden; star canvas at the device pixel ratio capped at 2; build the map SVG once; read layout only on load and resize, never inside the frame loop; the gzip budgets in `tools/check.mjs`.

## What the recording shows

Android phone, the page inside the Claude app's viewer: 1080 x 2340 pixels, about 412 x 730 CSS px at a device pixel ratio of about 2.6. Two minutes, all of it in explore after the end (pinch zooms, drags, the wayfinder, a few finds). Frame by frame:

- **Blank map.** At 1.15 s, in a fast two-finger zoom, the whole map drawing (land, coasts, details, finds, labels) is missing for two frames while the canvases (stars, the supernova's glow) and the buttons stay. The map SVG was not drawn in time for those frames.
- **Stalls.** 54 frames held for 60 ms or more; the worst held for 150 to 300 ms at 0.67, 2.51, 11.64, 41.46, 107.93 and 115.10 s, each during a pinch or a drag in explore.
- **Low frame rate.** From 108 s to 121 s (turning the wayfinder's compass, then panning with the supernova's glow on screen) only 10 to 17 new frames a second.

## Likely causes (check them; do not assume)

1. In explore every camera change rewrites the map's camera (`#cam`'s `matrix(...)`, `tripApply`) at a new scale, so the browser re-rasterises the whole visible map, a large SVG, every frame. A fast pinch outruns the rasteriser: frames go out with the map's tiles missing.
2. The full-screen canvases redraw every frame in explore at up to 2x resolution: the stars (`stars.mjs`, about 1,200 to 2,000 on the joined page, with tails) and the supernova's after-glow (`footer.mjs`: glow sprites, rays, lobes, waves, embers).
3. Per-frame DOM writes (label opacities, find animations inside the SVG, which invalidate parts of the map's raster).

## Measure first

Write `tools/frame-cost.mjs` in the manner of `tools/audit-capture.mjs` (local headless Edge or Chrome over the DevTools protocol, 127.0.0.1 only, no dependencies), run against `dist/journey-joined.html` and `dist/journey-map.html` after packing (`node tools/pack.mjs`, `node tools/pack-joined.mjs`). Emulate the phone: 412 x 730, device scale factor 2.625, mobile, touch, and a CPU slowdown of 4x (`Emulation.setCPUThrottlingRate`). Scenarios, each after reaching explore (the end, then "Explore the map"):

1. a fast pinch out and back in (two touch points, scale x3 over 300 ms, then back over 300 ms), three times;
2. a fling drag across the map and its glide;
3. the wayfinder: press it, then drag its dial round once in 1.5 s;
4. a slow pan with the supernova's after-glow on screen;
5. for comparison, outside explore: a glide between two stops and the rush into the blast.

For each: frame intervals (p50, p95, max, and the count over 33 ms and over 100 ms), main-thread time per frame split into script, style and layout, paint, and raster where the trace shows it (`Tracing` with the `devtools.timeline` categories), and long tasks. Also count **blank frames**: take screenshots through each gesture (`Page.startScreencast` or repeated `Page.captureScreenshot`) and flag any frame where the map's line drawing covers less than half of what the frames either side of it show (decode the PNG with `node:zlib`; no dependencies). Print a table per scenario. Keep the tool in the repository so the review can run it again.

## Then fix the worst

Fix the largest costs first, with these results:

- **Never a blank frame** in scenarios 1 to 4 at the phone emulation above.
- **Aim:** at the 4x slowdown, scenarios 1 to 4 keep their p95 frame interval at or under 33 ms and never hold a frame over 100 ms. If that cannot be reached without changing the look, get as close as you can and report the numbers before and after.
- **The look does not change.** Every still frame (at rest at each beat, in explore at rest at three zooms, each find at rest) must match the version before your change (screenshot difference at most 1 % of pixels, and none of them in text). During a fast gesture the map may be momentarily softer, but never blank, never jumping, and it must be sharp again within 150 ms of the gesture ending. Labels keep their constant screen size at rest; if a gesture scales them for a moment, they must ease back, never snap.

Directions worth trying (your call after measuring): during an explore gesture or glide, move the map as one composited layer (a CSS transform on the map's SVG element relative to the camera at the gesture's start, with the element kept promoted for the whole time explore is open so promotion itself never costs a blank frame) and write the camera into `#cam` once the motion settles, one re-raster per gesture instead of one per frame; draw soft things (the after-glow's sprites, lobes and waves) at a lower canvas resolution on phones, where blur hides it; skip a canvas redraw when nothing in it moved; cut per-frame writes that do not change anything.

## Checks

- All existing tests pass: `node tools/check.mjs`, `steps-test`, `nova-test`, `depth-test`, `layout-test`, `explore-test`, `finds-test`, `motion-test`, `hammer-test`, and `tools/origin-check.mjs` if part 1 added it. Update tests only where this brief changes what they pin, and say which and why. `finds-test.mjs` digests: re-record the data and `trip.mjs` digests if they change. **Never change `depth.mjs` at all, not even a comment.**
- Run `tools/frame-cost.mjs` before your first change and after your last, and put both tables in your report.

## Rules

- You may write only these files, all under `design/journey-map/`: `explore.mjs`, `trip.mjs` (`tripApply`, `tripLabels` and the camera's writing only), `stars.mjs` and `footer.mjs` (drawing and redraw decisions only, not what is drawn), `main.mjs` (the frame loop), `map.css`, `data.mjs` (new performance numbers only), the find modules (`find*.mjs`) only to stop writes that change nothing, the test files in `tools/`, the new `tools/frame-cost.mjs`, `dist/journey-map.html` and `dist/journey-joined.html` (only through the pack tools), and your report `FRAMES-BUILD.md`.
- Never touch `depth.mjs`, `hero-copy/`, the briefs and build reports, or anything outside `design/journey-map/`.
- Never run git, never install anything, never use the network, never start reviewer agents or other agents. The review happens elsewhere, in a real browser.
- If a rule stops you from doing something this brief asks, leave it out and say so in your report. Do not work around a rule.
- Plain ASCII punctuation in `FRAMES-BUILD.md`.

## Report

`FRAMES-BUILD.md`: the measurements before (the table per scenario), what you changed and why, the measurements after, the blank-frame counts before and after, the still-frame comparison results, each test you changed and why, the output of every test run, anything you left out and why, and anything the review should check on a real phone.
