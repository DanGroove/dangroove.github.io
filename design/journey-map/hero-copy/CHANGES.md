# Changes to the copy

Every change is marked `// JOIN:` in the code. Everything else is the source byte for byte. Nothing in `sq.mjs`, `stage.mjs`, `art.mjs`, the entrance, the labels, the CSS files or any timing changed.

| File | What | Why |
| --- | --- | --- |
| `design/journey-hero/take-2/play.mjs` | `lift` and `away` (a new `let` beside `intro`). | JOIN.md 5.1 and 5.2. |
| `play.mjs` | `draw()` returns at once while away. It hands `renderer.draw` and `callouts.draw` a copy of the view with `cy` less the lift (`shown`). The cached view, `layout.cover` and `__need` keep the unlifted view. | 5.1 and 5.2: the scene and its labels rise; nothing draws while away. |
| `play.mjs` | `running()` is false while away. The stars' `available()` is false while away. The stars get `lift: () => lift`. | 5.2 and 5.3. |
| `play.mjs` | `measure()` sets `--leave` to 0px on the hero while the layout reads geometry, then sets it back to the lift before the stars, the name's reaction and the craft roll take their own measures. | 5.1: the layout is read unlifted. The name's reaction places its red circle in viewport px, so it has to be measured where the name really is. |
| `play.mjs` | `setLeave(px)`: a lift above 0 first ends the entrance (`endEntrance()`, as Pause does) and releases any hold (`stars.letGo()`). Then it sets `--leave` and redraws at once when the loop is not running (paused or reduced motion). `setAway(on)`: sets the flag and calls `schedule()`. Coming back also draws once when the loop is not running, so a paused hero shows the current lift. | 5.1, 5.2. The draw on return is an addition, needed for a paused hero. |
| `play.mjs` | `window.__heroJoin = { setLeave, setAway, stars: { count (getter), drawn, look } }`, set right after `window.__ready`. | 5.5. |
| `design/journey-hero/take-2/stars.mjs` | `createStars` takes `lift` (default `() => 0`). The pointer's place is `clientY - box.top`. The scroll term handed to the renderer is `lift()`, still 0 under reduced motion as before. | 5.3: pinned. The hero no longer scrolls with the window. |
| `stars.mjs` | `frame()` keeps the parallax and scroll term it hands the renderer (`shownPar`, `shownScroll`). | They are needed by `drawn()`, so it returns what is on screen. |
| `stars.mjs` | `drawn(i, out)`: home plus the star's offset, less the parallax by `depthWeight(d)`, less `scroll * 0.12 * d`. This is `VERT_STARS`'s `p`. | 5.4. |
| `stars.mjs` | `look(i)`: `{ size, colour, alpha }`. The size is the star's own (0.6 to 2.2 px by depth). The colour is paper or red ink. The alpha is the depth mix (0.12 to 0.55), which on the ink ground is the colour the shader draws. A star still out after a hold also has its front copy. The two are folded into one look: the size goes toward the mark's 2.6 px by the mark weight, the colour becomes the mark's past half, and the opacity is the copy's laid over at its weight. | 5.4. The fold is an approximation of two passes as one disc. |
| `stars.mjs` | `letGo()` on the controller: runs its own `release(null)`. | 5.1 needs a way to release a hold. This small addition is outside 5.3 and 5.4. |

## Refresh to `3232c60` (2026-11-24)

The copy was refreshed from `0f38758` to `3232c60` (round 19: the loader, the entrance's letters and camera settle, streaks only in explosions, the exports' ball and burst, nothing highlighting, the held mark never streaking, no star crossing the mark even on a fast drag, the work popping out of its red and back with sparks, the name keeping its weight, and resting stars staying off the nav and footer labels). Every file is `3232c60`'s byte for byte, except `play.mjs` and `stars.mjs`, where a three-way merge kept each `// JOIN:` change above beside the hero's new code:

| File | What | Why |
| --- | --- | --- |
| `play.mjs` | The stars' `available()` keeps the hero's new `!loading` and adds JOIN's `!away`; `lift` is handed over as before. `running()` is false while away, and otherwise the hero's own (which now also runs while loading). The lifted copy of the view (`shown`) goes to `renderer.draw` and `callouts.draw` beside the hero's `stars: loading ? null : field`. `measure()` sets `--leave` to 0px around the hero's new `entrance.clear()`/`measure()` for `intro || loading`, and for the stars' and the loader's measure (their homes now keep off the labels, L15, so the labels are read at their resting places), and back to the lift before the name's reaction and the craft roll measure. | 5.1 to 5.3, unchanged in meaning. |
| `stars.mjs` | The frame's scroll term is the lift (0 under reduced motion), now also handed to the hero's new `field.setScroll()` and kept for `drawn()`; the trails and CPU positions are the hero's. The window's scroll listener keeps the pinned pointer (`clientY - box.top`) and hands the field the lift, not the window's scroll. `drawn`, `look` and `letGo()` sit beside the hero's new `prepare()` and `sample`. | 5.3 and 5.4: the hero is pinned in the map's stage; `drawn()` still matches `VERT_STARS` (home, own offset, less parallax by depth weight, less the scroll term times 0.12 times depth). |

Outside this folder, `design/journey-map/tools/pack-joined.mjs` now puts the loader where the copy's own page puts it: `LOADER_CSS` and `LOADER_SKIP` in the head, `LOADER_SCRIPT` right before the hero's script (the loader's markup comes inside the hero section from `pageMarkup('play')`).

## Refresh to `fca16c6` (2026-11-25)

The copy was refreshed from `3232c60` to `fca16c6` (round 19, L16: the loader's stars pour in as one stream instead of two batches). Among the copied files only `design/journey-hero/take-2/loader-stars.mjs` changed in the source, and it is now `fca16c6`'s byte for byte (`loaderAt` launches the stars on the loader's own clock; progress keeps its real shares and only the formed mark waits for readiness). `play.mjs` and `stars.mjs` keep their `// JOIN:` changes above unchanged.
