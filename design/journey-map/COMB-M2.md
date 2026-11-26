# Polish round 2, part 10d: the bar stops flipping its end style, and the longship carries you across (N1, N2)

Two small fixes on part 10c (0c6a8ec), found in its review.

## Items

**N1. `stepsButtons`' `end` is a boolean again (`steps.mjs`).** Part 10c made it `(!JOURNEY.moving || SC.cut?.resume && SC.cut.placed) && Math.abs(SC.P - stepsEnd) < 1e-6`. While the journey moves with no cut, that is `undefined`, so `SC.go.classList.contains('go-end') !== end` is always true and `SC.go.classList.toggle('go-end', end)` flips `go-end` on every frame of every glide (`classList.toggle` with an undefined force toggles). That is the `.go-light` churn `comb-m-layers-test` found: the light's 242x86 layer is built and destroyed every other frame. Make the second operand boolean: `(!JOURNEY.moving || !!(SC.cut?.resume && SC.cut.placed))`. Nothing else in `steps.mjs`.

Measured in the cloud (Chromium 157, real input on Next, painted layers built from 100 ms after the press to 1 s after arrival) on 0c6a8ec's packed page with only this change: 360x660 at DPR 3, touch, from Laurier, HMC Connections and Mohawk: 2 painted layers built in each, none with a side over 48 CSS px. Without it: about 90 builds of the 242x86 light per glide (Codex's Edge 158 run: 279 to 341). At 1920x950 DPR 2, mouse: one 44x44 stop shield (Overlap) per glide, and in the Mohawk glide also a 24x56 `path.l.rs-trace` and a 1920x950 layer at about +0.8 to +1.1 s; that last pair is the runestone's split and is also there on 0969810 (part 10b).

**N2. The longship waits on the trail where you reach the water, and carries you across (`trip.mjs`, `data.mjs`).** Dan, 4:35 AM: "the ship doesntn't start where it's supposed to". Since part 8 (F14) `longshipPoint` keeps the ship on a fixed water line (`FIND_PLAY.kit.shipWaterY`, y 645), so before the crossing it waits out in the strait about 78 map units below and to the right of where the trail meets the water, and slides sideways to meet the traveller. Put it on the trail instead:

```js
export const longshipPoint = u => { const B = FIND_PLAY.kit.shipBerth, p = pointAt(Math.max(WATER[0] + B[0], Math.min(WATER[1] - B[1], u))); return [p[0], p[1] + B[2]]; };
```

with `shipBerth: [40, 11, 0]` in `FIND_PLAY.kit` in place of the unused `shipY` and `shipWaterY`. Its berths are then about (472.0, 600.5) before the crossing and (417.0, 649.9) after it: the first and last trail points where the whole hull, prow and stern curls included, clears the land by 3 map units. The trail runs through the ship on purpose: you board where the trail meets it, ride across, and walk on from the far berth. The find's focus view, marker, hit area and popup already follow `longshipPoint`. Measured in a cloud copy: `comb-f-geometry-test` passes (hull clear by 3.04 at its closest), the serpent's ring is 16.7 and 20.8 map units from the hull at the berths (the hull crosses the ring mid-crossing, as the trail does). A before-and-after picture Dan has seen: `/mnt/project-files/journey-page/ship-crossing/ship-now-vs-fix.png` (cloud path; not on the PC).

## Checks

New tests in `tools/` (real CDP input only; read state through computed styles, classes, attributes and the page's existing test hooks):

1. `comb-m2-bar-test.mjs`: at 360x660 DPR 3 touch and 1920x950 DPR 2 mouse, a real Next from Laurier, HMC Connections and Mohawk, and Explore's entry: with a MutationObserver the test installs on `#go`, `go-end` never changes during a glide, and it is on at the end beat and off elsewhere, as before part 10c.
2. Change `comb-m-layers-test.mjs`'s gate: a large layer is one with a side over 48 CSS px (bigger than a marker); in the Laurier, HMC Connections and Mohawk windows with the rule on, none may be built, except in the 1920x950 Mohawk window the runestone's split (`path.l.rs-trace` and the full-screen layer built with it), which it reports. Keep its counts and its rule-on/off runs.
3. `comb-m2-ship-test.mjs`: the ship's transform at the start beat, at Interkom's hold, at Lennard's hold and at the end beat equals the two berths within 0.5 map units; during the Interkom to Lennard glide (real Next) the ship's place stays within 0.5 of `pointAt(u)` while the traveller is between the berths; the hull (these art points, scaled 0.55 about the ship's place: [-26,-6], [-20,1], [-10,5], [0,5], [12,5], [20,1], [26,-6], [-29,-20], [-33,-13], [-25,-25], [28,-15], [31,-11]) clears both islands by 3 and the serpent's ring by 10 at both berths; at the eight sizes F14 used, the ship at each berth is clear of every map label by 4 px, or the test reports which (do not move labels for it).
4. `comb-m-scope-test.mjs` checks part 10c's run against its own starting hashes, so it fails on any later change: make it exit 0 with a one-line note that it belonged to part 10c, and write this run's own scope check if you want one.
5. Rerun `node tools/check.mjs`, `finds-test`, `steps-test`, `explore-test`, `comb-f-geometry-test`, `comb-m-state-test`, `comb-m-browser-test`, `comb-m-layers-test`, and the item 9 list from COMB-M.md. Change an existing assertion only where it encodes the ship's old water line or the old layer gate, and list each one.

## Rules

- You may write only: `steps.mjs` (N1's line only), `trip.mjs` (`longshipPoint` only), `data.mjs` (`FIND_PLAY.kit`'s ship keys only), the test files in `tools/` (as the checks say), `tools/check.mjs` (`RUNTIME_KB` only, with a dated note), `joined.html`, `dist/journey-map.html` and `dist/journey-joined.html` (only through `node tools/pack.mjs` and `node tools/pack-joined.mjs`), and your report `COMB-M2-BUILD.md`, all under `design/journey-map/`. Browser profiles, captures and full logs go only in the run folder your prompt names.
- Never touch `cards.mjs`, `explore.mjs`, `map.css`, `main.mjs`, `depth.mjs`, `stars.mjs`, the find modules, `art.mjs`, `hero-copy/`, the briefs, the other build reports or the audits, or anything outside `design/journey-map/`.
- Never run git, never install anything, never use the network (a local headless Edge or Chrome on 127.0.0.1 is not the network), never start reviewer agents or other agents.
- No timing measurements: tests check behaviour, state and pixels, never time.
- If a rule stops you from doing something this brief asks, leave it out and say so in your report. Do not work around a rule.
- Plain ASCII punctuation in `COMB-M2-BUILD.md`.

## Report

`COMB-M2-BUILD.md`, short: what you changed for N1 and N2 and why; the layer counts per window before and after N1; the ship's berths and clearances (and any label it is closer than 4 px to, by size); each test you changed or added and why; one table with the last exit of every test you ran; anything you left out and why.
