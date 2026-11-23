# Journey map, joined to the real hero

`joined.html` (development) and `dist/journey-joined.html` (one offline file) show Dan's real hero, from `hero-copy/`, inside the map's sticky stage. The map follows it. `node tools/pack-joined.mjs` writes both files.

To run `joined.html`, serve the repository root and open `/design/journey-map/joined.html`. The dist file opens straight from disk.

## What was built

- `join.mjs` is the entry module of the joined page. It imports `main.mjs`, so the whole map is built first. Then it moves the hero `section` into the stage, first in the stage so it comes first in the tab order. It drives the join through two hooks in `main.mjs` and waits for `window.__heroJoin`.
  - **The leave** (P 0 to 100 vh): it calls `setLeave(min(scrollY, stage height))` from its own scroll listener, so the DOM and the canvas move in the same frame.
  - **The switch**: over the last 1 vh of the leave, the map's star canvas fades in. It sits above the hero and paints an opaque ink ground under the same stars, so its picture replaces the hero's instead of adding to it. At 100 vh the hero gets `setAway(true)` and `.jm-away` (`visibility: hidden !important` on it and every descendant).
  - **Pointer and focus**: while the hero is present, the map's SVG and overlay are `inert`. While it is away, the hero takes no pointer and no focus.
- `join.css`: the hero fills the stage (`min-height: 0`, the stage's height). It sets the z order (hero 1, star canvas 2, overlay 3) and hides the stand-in caption. `.hero-nav`, `.hero-say`, `.hero-foot` and the invisible `.hero-box` (the click and hold target) rise by `translate: 0 calc(-1 * var(--leave))`. The stage stays sticky under reduced motion.
- `main.mjs`: one addition, the exported `JOIN = { frame, resize }` hooks. On the stand-in page they stay null, and nothing else changes.
- `stars.mjs`:
  - `starsJoin(src)` builds the list from the hero's stars, up to 2000. The list is rebuilt when the hero's count changes.
  - The traveller is the red star nearest the middle of the view. It grows from that star's look into the four-point star and its glow, from 2 % to 60 % of the fall, and moves on the build's own curve.
  - The other stars, non-red first, are shuffled onto the 308 trail dots, then 112 sea points (the build's sea count).
  - All the rest fall onto the coasts: spread evenly along both outlines by length, matched by angle so each lands on its own side. Each arrives 2 % of the fall before the coast line's dash reaches it, then dissolves over the next 6 %.
  - Trail and sea stars start at 2 % of the fall in place of the stand-in's 5 %.
  - Missing places fade up in place: on phones (240 stars), 69 trail dots and all 112 sea points.
  - Each star's start is `drawn(i)`, read on every frame of the fall. Its start look is `look(i)`, turned into a disc (or a square) with the same total light as the hero's point sprite.
  - The footer's keep share is `0.3 * stand-in count / (dots + sea)`. That is 0.3, because the coast stars are gone before the footer.
  - Drawing is batched for both pages. Stars are grouped by colour and opacity in 64 steps. Under 1.5 px across they are `fillRect` squares; the rest are one arc path per group, with tails grouped the same way.
- `join.mjs` also fades the map's red X (`#fxg`) in with the sea (20 % to 70 % of the fall). In the build it shows from the start of the fall, and there it would pop in at the switch. From the overview on it is as built.
- Reduced motion: the leave follows the scroll as above, and the switch works the same way. Over the 120 vh of the fall, the canvas cross-fades. It goes from the sky (ink ground plus the hero's stars where they are) to the map's own still (the overview stars over the overview SVG). The trip section is 220 vh plus a view tall. After it come the reduced-motion cards.
- `tools/pack-joined.mjs`:
  - The hero section comes from the copy's `pageMarkup('play')`.
  - The hero half follows `previewMarkup()`: `journey.css` with Outfit inlined, `take-2.css`, `globalThis.__heroFonts`, the copy's `pack()` for `play.mjs`, and every `href` removed.
  - The map half follows `tools/pack.mjs`, with `join.mjs` as the entry.
  - Two module scripts, map first.
  - It fails on `mailto`, on an `href` with an address, on any `http` address but the SVG namespace, and on a left-over outside reference.
  - It leaves out `previewMarkup()`'s `html, body, main { height: 100% }` rules, which would break the map's scroller.

## Checked

Headless Chromium through Playwright, at device scale 1. The scripts are in the scratch folder (`join/run.cjs`, `join/base.cjs`). Software WebGL is slow there, so frame rates were not judged.

1. Scroll 0 with `__hero.seek(6)` against the copy's own page with `?t=6`: identical, a largest difference of 0 levels, at both 1440 x 900 and 390 x 664.
2. The leave, at 0, 25, 50, 75 and 100 %: the name's top equals its start less the scroll to 0.01 px at every step, on both sizes. No star moved sideways. Each star rose between 0 and 0.12 px per px of scroll, which is the depth drift.
3. The switch, 1 px of scroll before and after:
   - Largest pixel difference: 32 levels at 1440 (962 pixels over 8 levels, a mean of 0.017) and 49 at 390 (158 pixels).
   - For scale, 1 px of ordinary scroll in the hero alone changes up to 16 levels at 1440 (838 pixels).
   - The two renderers alone at the same scroll differ by at most 29 levels (1440) and 21 levels (390), all in single star pixels.
   - Before the X fade, the X popped in (219 levels). That is fixed.
4. The fall, at 3, 25, 50, 75 and 100 %: the stars leave from the hero's sky, the coasts take shape dotted ahead of their lines, and the trail forms. The overview against the stand-in build at the same scroll: at 1440, a mean difference of 0.06 levels, 1719 pixels over 8 levels. At 390, a mean of 0.41 and 2695 pixels. The differences are the sea sparkle's places and fade-ins and the beacon find's animated text.
5. Back at scroll 0 after the overview:
   - The hero is present.
   - After Play (the seek had paused it), its clock advanced 0.5 s (1440) and 1.1 s (390) in 1.5 s of slow software frames.
   - A 1.5 s hold on the stage gathered stars: `holding` read 0.10 and 0.80 s, with 28 and 96 captured. The hero's hold clock advances at most 0.05 s a frame, and the software frames were slow.
   - A craft button changed the current craft from 0 to 2.
6. While away (1.5 s at the switch, then through the whole fall): 0 WebGL draw calls (counted on the context's prototype), and the hero's clock did not move.
7. Every check above was also run at 390 x 664.
8. `dist/journey-joined.html` from `file://`, with every request outside `file:` and `data:` aborted: no console errors, no outside requests, 1200 stars. `dist/journey-map.html` likewise: no errors. Reduced motion from the dist file: no errors, screenshots through the leave and the cross-fade.

`node tools/check.mjs`, `node tools/pack.mjs` and `node tools/pack-joined.mjs` pass.

## Left open

- On a view shorter than 640 px the hero is squeezed to the stage's height, as the brief asks. It is not solved.
- The name's pointer reaction and the craft roll were tested under a lift after the build. With the hero lifted 300 px, the name's red circle sits under the pointer; with it lifted 150 px, a craft change lights its row in place. The name's reaction re-measures itself on every scroll, and it does so after the join has set the lift because the join's scroll listener is registered first (the map's script comes before the hero's in both pages). `measure()` now also puts the lift back before the name is measured, so the same holds after a resize.
- `look()` folds a star's front copy into one disc. That only matters if a hold's stars are still flying home at the switch.
- `drawn()` reports the hero's last drawn frame. If the hero's tick and the map's frame fall in one animation frame in the other order, the two can be one frame apart in parallax.
- The batched drawing (squares under 1.5 px, 64 opacity steps) also applies to the stand-in page. It is not visibly different, but it is not the same pixels.
- Not tried: real touch, real hardware frame rate at 2000 stars, and browsers other than Chromium.
