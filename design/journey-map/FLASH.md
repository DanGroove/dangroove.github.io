# Round 7 part D1: the supernova on its own layer, and gestures that start anywhere

Read this whole file before you change anything. Then read the files in section 5.

## 1. Why

Dan opened the page on his Android phone, inside the Claude app (an Android WebView). Through the supernova's explosion, and again at the start of explore, the screen flashes: in his screen recording, frame after frame shows the map missing, whole or in rectangles, while the blast is drawn on top. The stars canvas and the HTML buttons never drop out.

The cause is how the stage is layered:
- The supernova (screen-sized gradient glows, lobes, rays, waves, flares, streaks, rings, shells, core and the X's spikes) is drawn inside `svg#map`, in `g#fxg` inside `g#cam`, and `footerMotion` rewrites its transforms and opacities every frame.
- In the same frames the map's five groups and the trail fade by group opacity (`tripApply`, the `fade` term), and in explore the camera moves.
- So the whole map SVG must re-raster every frame. The WebView's GPU raster misses its deadline and composites frames with missing or stale tiles. Headless Chromium rasters synchronously, which is why no test here shows it.

Dan also found that in explore a pinch that starts on the supernova does not zoom. `exploreExcluded` in `explore.mjs` skips any pointer that lands on `[role="button"]` (the nova's hit circle), `.find`, `.stop`, buttons and links, so with one finger on the nova the stage sees one pointer, a drag, never a pinch. The same kills pinches that start on a find or a stop mark, which cover much of the zoomed map.

A related defect from the critique (D2-3): `EX.suppress`, the flag that eats the click after a drag, is cleared only by the next stage pointerdown. After a pinch, the next keyboard or screen-reader click anywhere on the stage (for example Enter on "Explore the map") is swallowed.

## 2. What to build

### 2a. The supernova on its own canvas
1. Add `<canvas id="nova" aria-hidden="true">` to the stage markup in `main.mjs`, directly after `svg#map` and before `canvas#stars`. Style it like `#stars` (absolute, full stage, `pointer-events: none`), with no z-index of its own, so it paints right above the map and under `#stars`, `#air`, `#sky` and `.ov`, where `g#fxg` paints today. Size it in `resize()` with `dpr = min(devicePixelRatio, 2)`, like `starsResize`.
2. Everything `footerMotion` animates moves to that canvas: the red glow (`fx-rg`, an ellipse with `glowAspect`), the orange glow (`fx-og`), the core (`fx-core`, the `glow` gradient), the rays (each with the `fxray` gradient along its length), the lobes (alternating `rglow` and `oglow`), the waves, the flares, the 60 seeded streaks (same seed, colours, opacities and widths), the red and paper rings (`fx-ringr`, `fx-ring`), the two dashed rotating shells (`fx-r1`, `fx-r2`, `NOVA.shellDash`), and, from the rush on, the X itself: both red strokes and both white spikes, with today's rotate, length, wobble, pulse, thinning and opacities.
3. Keep the maths and every number exactly as they are, and the paint order of today's SVG: rg, og, rays, lobes, waves, flares, streaks, ringr, ring, r1, r2, core, then each stroke (red under white).
4. Screen mapping. The centre is `[MAP.x[0] * cam.s + cam.tx, MAP.x[1] * cam.s + cam.ty]`, from the `st.cam` that `tripApply` writes (after `tripFocus` and explore). Today a size in px goes through `u(px) = px / s`, where `s = st.exploreK ? st.sEnd : st.cam.s`; on screen that is `px * cam.s / s` (just px outside explore, smaller as explore zooms out). Sizes in map units (the strokes' half-length 12.7 and width 3.6, the spike's half-height 1.7) become `units * cam.s`. Non-scaling stroke widths stay screen px. Everything is times dpr on the canvas.
5. Gradients: copy the stops of `glow`, `rglow`, `oglow` and `spike` (art.mjs) and `fxray` (footer.mjs) exactly. For the radial glows, prefer sprites made once (an offscreen canvas per gradient, drawn scaled with `drawImage`); a gradient made per draw is fine too if it looks the same.
6. The red strokes are rough: they use `filter="url(#rough)"` (feTurbulence fractalNoise, baseFrequency .05, 2 octaves, seed 3, displacement 2.2, user-space units). On the canvas draw each red stroke from a sprite made once by rasterising that same SVG stroke with that same filter (an SVG image from a data URL drawn into an offscreen canvas, at least as many pixels as its largest on-screen size times dpr; remake it on resize if it would be too small). Until the sprite is ready, draw a plain round-capped red line.
7. The X at rest stays in `svg#map`. Before the rush, the two red rough strokes in `g#fxg` are part of the map's picture: through the journey, in reduced motion, and on the joined page, where `join.mjs` fades `#fxg` in during the fall. From the first frame with anything of the footer acts or explore showing (`rushT`, `blastT` or `settleT` above 0, or `exploreK` above 0), the canvas draws the X and the SVG strokes are hidden with one write. When all of those are back at 0, the canvas clears and the SVG X shows again with one write. The switch must not show: just after it, the canvas X matches the SVG X in place, size, colour and roughness.
8. What leaves the SVG: `fx-rg`, `fx-og`, `fx-rays`, `fx-lobes`, `fx-waves`, `fx-flares`, `fx-streaks`, `fx-ringr`, `fx-ring`, `fx-r1`, `fx-r2`, `fx-core`, the `fx-white` spike paths and the `fxray` gradient. Nothing in `svg#map` is written per frame by the supernova.
9. The press target moves out of `svg#map` (section 2b fades the whole SVG to 0, and a hidden parent would hide its focus ring). Make it an HTML `<button type="button">` with today's label logic (`COPY.steps.dig`, then `COPY.nova` once settled), `aria-disabled` and tabIndex rules (`footerFrame`), its click behaviour (`dig`), and no keydown handler of its own (a button clicks on Enter and Space). Keep it where it is in the tab order (after the map's finds, before the cards and the footer). Keep its size: before the settle a circle of radius `B.digHit` map units, so `B.digHit * cam.s` px; once settled `NOVA.flare.hit` px times `cam.s / s`. Centre it on the nova with a transform. Write its style only when the rounded value changes, never on a still frame. Round, with a visible focus ring (paper, 2 px) on `:focus-visible`, `pointer-events: none` while `aria-disabled` is true, no tap highlight. It must be inert whenever the map is: on the joined page `join.mjs` sets `JN.svg.inert` while the hero is present, so set the button inert at the same time. No press target in reduced motion, as now.
10. Drawing policy: draw every frame while anything of it shows; clear once and stop drawing when nothing shows. The canvas opacity follows `st.dim` (the SVG's opacity carried the nova until now), written only on change.
11. Reduced motion is unchanged: `footerMotion` returns early, the canvas stays empty, and the static SVG X shows.

### 2b. The map fades as one layer
1. In `tripApply`, the blast fade (`fade = 1 - smooth(...DEPTH.fade.blast, st.blastT) * (1 - (st.exploreK || 0))`) moves off the five groups and the trail onto the SVG element: `E.svg.style.opacity = st.dim * fade`. The groups keep only their own fade-ins from the fall (sea, fill, detail, finds as now without `* fade`, the coast group at 1, the trail at `st.inTrip ? 1 : 0`).
2. Write every one of these styles only when its value changes, so a still frame writes nothing.
3. While that opacity is 0, set `visibility: hidden` on `svg#map`, and back to visible above 0.
4. `will-change: opacity` on `svg#map` only while the fade is between 0 and 1 (during the blast's fade-out and explore's fade-in), removed when it ends.

### 2c. Explore
1. The map keeps moving in explore exactly as now, through `g#cam`'s matrix (the journey's legs move the camera the same way and do not flash on Dan's phone). Do not change that.
2. `EX.world` (`#ft-world`) gets `will-change: transform` only while the explore entry or exit motion, a glide or a gesture runs, and none at rest.
3. The footer text (`FT.inner`) is gone by 600 ms after explore starts: it fades out over about the first 0.5 s of the entry in linear time (`st.exploreK` is eased, so at 600 ms it is only about 0.2, too early for this), stays at 0 while exploring, and comes back over about the last 0.5 s of the exit. Update explore-test's footer assertion to match.

### 2d. Gestures start anywhere
1. Track pointers in the capture phase on the stage, so a find's own capture handler (`findkit.mjs`) cannot hide them from explore. Track every pointer whatever its target, except in an open sheet (`.sheet.on`), inputs, textarea, select, the timeline (`.tl`) and the review switch (`[data-review]`).
2. A single pointer that starts on an element with a drag or hold of its own never pans the map; it stays that element's gesture. These are the elements with `touch-action: none` in map.css (`#f-wayfinder`, `#f-beacon`, `.find.hoard`, `.rubbing`, `#f-mist`, `#f-horn`, `.hm-canvas`) and the footer name line (`footname.mjs`). When a second pointer comes down while it is held, the two become a pinch. Then that element's press must not fire; cancelling its own hold or drag as well is welcome if it takes a small change, otherwise leave it and say so in the report.
3. A pointer on anything else (the nova button, stop marks, other finds, buttons, links) pans once it passes `EXPLORE.slop`. A tap under the slop stays a press, and its click fires as now.
4. Capture pointers on the stage only once a pan or pinch begins (past the slop, or when the second pointer lands), never at pointerdown, so a tap's click still reaches its target.
5. Click suppression (D2-3): only the click that ends a drag is eaten. A click with `e.detail === 0` (keyboard, screen reader, `el.click()`) is never eaten. The flag clears at the next pointerdown (as now), at any keydown, in `exploreEnd`, `exploreDepart` and `exploreReset`, and 500 ms after the release that set it.
6. Wheel, keyboard and the rest of explore stay as they are.

## 3. Tests (node, as the tools already do; no browser here)
- `tools/explore-test.mjs`, new cases with synthetic pointer events and fake targets:
  - a two-pointer pinch that starts with one or both pointers on the nova button, on a `.stop` and on `#f-horn` changes `EX.cam.s` by at least 20 percent, and the click after it is eaten;
  - a tap under the slop on the nova button is not eaten;
  - a drag, then a click with `detail` 1: eaten; a drag, then a click with `detail` 0: not eaten;
  - after a pinch, a keydown, then a click with `detail` 1 is not eaten; after a pinch and `exploreEnd`, the flag is clear;
  - a single-pointer drag that starts on `#f-wayfinder` does not move the camera;
  - the footer opacity follows 2c.3 (0 at 600 ms into the entry).
- A test of the new nova layer, in a new file or an existing one, with a fake canvas context that records calls and fake elements that count writes:
  - the X group's built markup holds none of the removed classes, and the stage markup has `canvas#nova` right after `svg#map`;
  - at rest before the rush nothing is drawn; through rush, blast and settle the canvas draws every frame; back at rest before the rush it clears once and stops;
  - with a still camera, a second identical frame writes no attribute or style in the SVG and none on the press button;
  - `tripApply` at a blast frame puts the fade on the SVG element and none on the groups.
- `tools/check.mjs`: a static check that no removed class name appears in footer.mjs's SVG build string, and that `main.mjs` places `canvas#nova` right after `svg#map`.
- Every existing test must still pass. Where an existing assertion reads something that moved (the footer curve, the hit target), change it to the new behaviour and say so in the report.

## 4. Files
You may write only these, all under `design/journey-map/`: `footer.mjs`, `main.mjs`, `trip.mjs`, `explore.mjs`, `join.mjs`, `map.css`, `data.mjs` (new numbers only, no change to existing ones), `art.mjs` (only to export the filter or gradient definitions for reuse; what the map draws must not change), `tools/check.mjs`, `tools/explore-test.mjs`, `tools/depth-test.mjs`, `tools/steps-test.mjs`, `tools/finds-test.mjs` (only where an existing check must follow the moved press target), a new `tools/nova-test.mjs` if you want one, the files the two pack tools write (`joined.html`, `dist/journey-map.html`, `dist/journey-joined.html`), and your report `FLASH-BUILD.md` (new). If check.mjs holds digests of files you changed, re-record them and list them in the report.

## 5. Read first
`footer.mjs` (all), `main.mjs`, `trip.mjs` (`tripApply`, `tripFocus`), `explore.mjs` (all), `join.mjs`, `art.mjs` (`mapDefs`: the gradients and the `rough` filter), `map.css` (stage, `.hit`, `.fx-hit`, touch-action rules), `stars.mjs` (`starsResize`, for the dpr pattern), `findkit.mjs` (the capture handler near the end), `tools/explore-test.mjs` (its fakes), `data.mjs` (`NOVA`, `EXPLORE`, `DEPTH.fade`).

## 6. Done means
All tests in `tools/` pass, both pack tools have run, and `FLASH-BUILD.md` says what you built, what you left out and why, and each test's last line. Do not claim any visual or browser check: the review happens elsewhere in a real browser, against stills of the current supernova, with a layer check and a frame-by-frame recording on Dan's phone.
