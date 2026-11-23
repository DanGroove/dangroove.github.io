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
