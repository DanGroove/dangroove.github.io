# Polish round 2, part 10c: the X gives back control (M1 to M3)

Dan, 2026-11-26 4:33 AM ET, on preview 19: "when exploring the map and clicking a node then clicking the X, it wont allow me to zoom in/out or move the map. clicking X should give me back full control and should undim the map".

## What happens now

While exploring (the end-only free camera, `explore.mjs`), a press on a stop's shield or a mini-map stop runs `goStop(i)` in `main.mjs`, which calls `JOURNEY.go(STOPS[i].id, { jump: exploreActive() })`. `stepsJump` leaves explore (`exploreDepart`) and cuts to that stop's hold under the cover (`STEPS.cut`). The card opens and the map is dimmed to `CAMERA.holdDim` (trip.mjs sets `st.dim` at holds).

The X (`.c-close`) then only folds the card (`cardsClose` in `cards.mjs`). The journey stays at the guided stop: the map stays dimmed at 0.35 (nothing lifts `st.dim` when a card folds), and there is no drag, wheel, pinch or key camera, because explore is end-only. The only way back to exploring is Next, stop after stop, to the end. The same dim stays after the X in the guided tour.

## Items

**M1. A stop opened from explore remembers it (`steps.mjs`).** When `stepsJump` leaves explore for a stop's hold, remember that stop as opened from explore. It is still remembered through: the card folding and reopening at that stop, a find on that stop taking the camera and letting it go, a resize, and a press that goes straight to another stop (`JOURNEY.go` with a stop id: a shield, a mini-map stop or a timeline key), which then becomes the stop opened from explore. Everything else forgets it: Next, Back, Start, Back to the top, Dig, the timeline scrub, `JOURNEY.set`, a scroll or swipe that moves the journey, reduced motion, and the return in M2 itself.

**M2. Closing the card of a stop opened from explore goes back to exploring (`cards.mjs`, `steps.mjs`, `explore.mjs`).** Every way of closing that card does it: the X, the stop's own shield (its fold toggle), and Escape (`main.mjs` already calls `cardsClose()`). Put the decision in `cardsClose` so all three share it.

- At the press the card starts folding and the cut cover starts fading in, with the jump's timings (`STEPS.cut`).
- Under the opaque cover the journey lands on the end beat and explore is active again, with its camera exactly the camera the screen showed at the press (`CD.last.cam`: the same `s`, `tx`, `ty`, only passed through `exploreClamp`'s bounds). So the map under the card does not move: the card goes, the dim lifts, and the same view becomes Dan's to drag and zoom. Add an `explore.mjs` entry for this (for example `exploreResume(cam)`) that sets explore's state at once: `k` 1, the footer name at 0, no zoom-out motion from the end view, no hint, `jm-explore` on the root, the say line `COPY.explore.say`. The bar is as in explore (Back reads `COPY.explore.back`, Next hidden) and does not replay its reveal.
- The cover then lifts over `STEPS.cut[1]`. Drag, wheel, pinch and the explore keys work as soon as it starts lifting.
- The map is at full opacity (no hold dim), and the labels, trail and finds are as in explore.
- Focus: if focus was in the card, it goes to that stop's shield, as `cardsClose` does now (no ring after a pointer press: `jm-pointer-focus`, map.css).
- A second press of the X, or any press of it while the cover is moving, does nothing more. Reduced motion is unchanged (no explore, no X there).
- Trap: `exploreApply` resets explore whenever the journey is moving (`exploreAllowed`), so explore cannot simply start while the cut is still running. Either end the cut when it places the end beat and lift the cover on its own clock (then `stepsCancel` and any new cut must take that clock over from the cover's current opacity, never popping), or let explore accept a covered arrival, like the covered departure `exploreDepart` already has. Your choice; say which in the report.

**M3. Closing a card lifts the hold dim, everywhere (`cards.mjs`).** At any stop, opened from explore or in the guided tour: while the card folds, `st.dim` goes from its hold value to 1 by the fold's progress, and it comes back if the card reopens through its shield. In `cardsOverride`, which runs after `tripState` and before `tripApply`, that is `st.dim = lerp(1, st.dim, closed.k)`. Everything that reads `st.dim` (the map, the base map, the stars canvas) follows. Nothing else at holds changes.

## Checks

New `tools/comb-m-browser-test.mjs` (or more than one file), driving `dist/journey-joined.html` with real CDP input only. Read state through the page's existing test hooks, computed styles and classes; never move the journey by calling its functions.

1. 1920x950 at DPR 2, mouse: Next to the end, Explore, a real drag and wheel, a real click on a stop's shield, the card open, a real click on the X. Then: explore active, the camera within 0.5% in scale and 1 CSS px in position of the camera at the press, the map's opacity 1, no card open, Back reads `COPY.explore.back`, Next hidden. Then a real drag moves the map and a real wheel zooms it. The same with Escape, and with the shield's toggle, in place of the X.
2. Explore, stop A, then stop B's shield, then the X: explore at B's view.
3. Explore, a stop, then Next, then the X at the next stop: the card folds, no explore, the dim reaches 1 by the end of the fold, the shield reopens the card and the dim comes back, Next and Back still work.
4. The guided tour from the top, never explored: a stop, the X, the dim lifts; reopen, the dim comes back.
5. Explore, a stop, a find on that stop pressed and let go, then the X: explore.
6. 412x915 phone, touch only (`Input.dispatchTouchEvent`): check 1 with taps, then a one-finger drag and a two-finger pinch move the map.
7. Two quick presses of the X, and a press during the cover: one return, no console error.
8. The reduced motion page: unchanged.
9. Rerun the tests that touch cards, steps and explore (at least `steps-test`, `explore-test`, `comb-close-test`, `comb-reopen-test`, `comb-g-focus-test`, `comb-g3-interaction-test`, `comb-g3-press-test`, `comb-l-explore-test`, `comb-l2-explore-state-test`) and `node tools/check.mjs`. Change an existing assertion only where it encodes the old X behaviour (the dim staying, the X not going back to explore), and list each one with why.

## Rules

- You may write only these files, all under `design/journey-map/`: `steps.mjs` (M1, M2's return and cut), `cards.mjs` (M2's close path, M3), `explore.mjs` (M2's entry, and a covered arrival if you take that route), `main.mjs` only if M1 cannot work without changing the options `goStop` passes (nothing else in it), `tools/check.mjs` (`RUNTIME_KB` only, with a dated note), the test files in `tools/`, `joined.html`, `dist/journey-map.html` and `dist/journey-joined.html` (these three only through `node tools/pack.mjs` and `node tools/pack-joined.mjs`), and your report `COMB-M-BUILD.md`. The browser's profile, captures and full test logs go only in the run folder your prompt names.
- Never touch `trip.mjs`, `data.mjs`, `depth.mjs`, `stars.mjs`, `map.css`, the find modules, `hero-copy/`, the briefs, the other build reports, the audits, or anything outside `design/journey-map/`.
- Never run git, never install anything, never use the network (a local headless Edge or Chrome on 127.0.0.1 is not the network), never start reviewer agents or other agents.
- No timing measurements: tests check behaviour, state and pixels, never time.
- If a rule stops you from doing something this brief asks, leave it out and say so in your report. Do not work around a rule.
- Plain ASCII punctuation in `COMB-M-BUILD.md`.

## Report

`COMB-M-BUILD.md`, short: for each item, what you changed and why; which route you took for the trap in M2 and why; each test you changed or added and why; one table with the last exit of every test you ran; anything you left out and why; what the review should look at.
