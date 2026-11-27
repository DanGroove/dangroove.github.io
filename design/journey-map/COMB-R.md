# Polish round 3, part 14: Dan's Preview 28 notes, the compass lag, and measuring on this PC (COMB-R)

On commit `e927c22` and the brief's own commit. `e927c22` already did these of Dan's notes, so keep them: Skoll and Hati chase across the whole screen again; the traveller clears only its own path through the fog (the mouse still clears all of it); THE MARGINS at (258, 545); "the crossing of uncertainty"; no peak under the Mohawk building or hill under the skal; the stray tree off the left frame (`MAP.treeDrops`); the pine moved off the skal's mouth.

**New this time:** you also run the measuring passes on this PC (R9), not only the tests. Claude reviews your build by hand afterwards, so do not sign anything off as "looks right": report what you measured.

Dan's notes of 2026-11-27 (ET), in his words:
- 9:42 AM: "lets have more revisions before its shipped for jormy. also can you attach his head to the body properly? ... lets have the legend on the bottom all on one line and reduce the height of that section and make sure they center align vertically with those croner star things"
- 9:44 AM: "right now while in explore, clicking on a shield jumps the camera to the correct zoom and location and snap opens the card, please make it glide to the correct zoom/location and open the card naturally"
- 9:45 AM: "clicking X should just close the card with the same animation that opens it but in reverse and shouldnt move the camera or the zoom"
- 9:50 AM: "lets have only 3 notes in invisible ink and with each one found, the pyre grows large and brighter until the last one having a special animation signifying that it is complete. 2 of them to the left on land and one should be in the sea. ... insane amount of lag on the compass still. this hasnt been fixed yet???"
- 10:28 AM: "can we change the skal to an actual cheers with 2 cups toasting and clinqing? the vibration circle can be kept when they clinq". He picked tankards from a sketch, then "thicker handles though please", then "good" on `tools/skal-cups/`.

Priority if time runs short: R1, R2, R3, R5, R4, R6, R7, then R9 (always run R9 on whatever you finished). Finish within about 150 minutes.

## Items

**R1. The compass lag (`findhoards.mjs` `findWay`; `trip.mjs` `tripApply`'s raster camera and veil writes; `findsheets.mjs`, `findwater.mjs`, `findkit.mjs`, `finds.mjs` only for moving idle animations; `main.mjs` and `map.css` only for a new layer).**
What the PC pass `pc-compass28` (Preview 28, headless Chrome 1920x950 at DPR 2 on this PC, `tools/phone-fps.mjs` rows `press:print`, `press:video`, `press:motion`, `press:screen`, `--trace`) found:
- 194-221 fps against the 240 Hz display, 0-7 frames over 25 ms (max 46 ms), all in the first 0.65 s; 61-181 dropped frames per row. GPU raster (Deserializing plus Flush on the GPU main thread) is 2.1-2.9 s of each 4.5 s window.
- `svg#map-finds` (9922x8952) repaints on every frame from +2 ms to +4.4 s (873-990 repaints) and holds about 70 % of all raster.
- `svg#map` repaints on every frame from about +3 s (the squirrel, `.yg-rat`, starting a run).
- `svg#map-veil` repaints on every frame from +3 ms to +1-1.4 s.
- On Dan's phone (p26) `press:motion` ran 52-53 fps with about 20 frames over 25 ms.

Causes in the code:
- The needle writes `rotate(o.angle)` every frame forever: its spring keeps changing the angle by tiny amounts for seconds after it has visibly settled, and with no craft picked its target is an endless drift (`FIND_PLAY.way.drift`). Once kept, the rune ring turns forever at 0.6 degrees a second (`o.runesAngle += W.runes * dt`), which nobody can see but repaints the ring every frame.
- Other idle life writes every frame while on screen: the beacon's flame and beam, the longship's rocking, the hoard glints, the `f-bits` sparks, and the squirrel in `svg#map`.
- The veil rebuilds its holes whenever the scale moves by `FIND_PLAY.way.veilZoom` (0.1), measuring words, tally and `.label-anchor[data-row]` with `getBoundingClientRect` (forced layout), and a `MutationObserver` on `#cam`'s transform and the svg's style runs `veilUpdate` on every camera write. `#cam-veil` copies `#cam` at every rebase, and the lines grow inside the veil svg.
- A craft press moves the camera with a find focus move (`stepsFocus` to `wayResultView`). Focus moves rebase each layer as soon as it is due (`slot = r.gliding && !focusMove`), so the zoom out re-rasters `svg#map`, `svg#map-base`, the live and finds svgs and the veil several times during the move, often in the same frame.

Do this (the recommended way; if your measurements show a better one, use it and say why):
1. **Nothing map-sized repaints at rest.**
   - The needle: write its angle rounded to 0.05 degrees, and stop the spring (no more writes) once it is within 0.05 degrees of its target and slower than 0.5 degrees a second. It still follows the pointer when the pointer is near, swings to a picked craft, and spins on hear. Drop the idle drift: with no craft and no pointer near, the needle rests at 0.
   - The rune ring stops turning on its own. Remove the endless turn (`W.runes`); the ring keeps whatever angle it has.
   - The arms' and ring's pulses already end; make sure they write nothing once ended.
   - Every idle animation that keeps running at rest (the beacon's flame, glow and beam; the longship's rock and sail; the hoard glints; the `f-bits` sparks; the squirrel) moves into one new svg layer, `svg#map-anim`, placed after `svg#map-finds` in `div#map-stack`. It rides `r.base` exactly like the L5 svgs (the same `#cam-...` copy at each rebase, the same `mapTransform`, a cover clone, `visibility: inherit`). Their per-frame writes then repaint only that small layer. Hit targets stay where they are: move only the drawn parts, and keep each find's own group, ids and classes working (tests and CSS select them). Check at rest that the map looks the same (the picture check in the Checks).
2. **Find focus moves draw each layer once.** For a find focus move (`focus.k > 0`), hold every layer on the compositor through the move: when zooming out, redraw each layer once at the start at the destination's scale (ahead); when zooming in, keep the start's raster; then redraw sharp once at rest. Do not redraw two map-sized layers in the same frame: stagger them (`svg#map`, base, live, finds, anim, veil) one per frame. No layer may rebase more than twice in a find focus move, rest included.
3. **The veil.** Rebuild the holes only when the camera is at rest, plus once at the start of a move for the destination view. Remove the `MutationObserver`-driven updates. The veil keeps its own raster camera, held through moves like `svg#map`'s, instead of copying `#cam` at every rebase. The lines grow on a small layer of their own (not inside the veil's masked layer), still under the words.

Keep the look and the behaviour of the compass otherwise as it is (the words, the veil's dim and holes, the lines, the tally, keyboard and touch).

**R2. Explore: a shield press glides there and the card opens naturally (`steps.mjs`, `explore.mjs`, `cards.mjs`, `trip.mjs` only where cards and explore meet).**
Today a shield press in explore (`stepsGo` with `SC.exploreStop`) cuts with the cover to the stop's journey beat (`stepsJump`), and the card snaps open; its X (`cardsClose`, `stepsReturnFromExplore`) cuts back.
- Stay in explore. Glide the explore camera from wherever it is to the camera the journey uses for that stop's open card (`tripState(beat.P).cam` for that stop's hold, so the card lays out exactly as in the journey). Ease in and out (`easeIO`); 1.2 s plus 0.25 s for each screen width of travel at the start's scale, at most 2.2 s; scale moves geometrically (`exploreMix`).
- The card opens over the glide's last 0.5 s with the journey's own opening: `smooth()` over 0.5 s, growing from the shield (the same `cardK` path `cardsFrame` uses), and the map dims with it (`CAMERA.holdDim`).
- While it glides, the map is held on the compositor (`st.exploreMoving`), as for other explore moves.
- A drag, wheel or pinch while a card is open closes the card the R3 way and moves the camera as usual. A press on another shield closes the open card the R3 way while the glide to the new one starts.
- Esc and the card's X close it the R3 way. Next and Back keep their explore meaning.
- Reduced motion: no glide; the camera and the card are simply there.

**R3. X closes the card in reverse, camera untouched (`cards.mjs`; `steps.mjs` for explore).**
- In the journey and in explore, X (and Esc) runs the card's opening backwards: the same 0.5 s and the same `smooth()` curve, the card shrinking back into its shield along the path it grew on, the map's dim easing back with it.
- The camera and zoom do not change at all: no `stepsJump`, no return to the earlier explore view, no rebase.
- After an explore close, explore stays where the camera is, and the next gesture moves on from there.

**R4. Three invisible-ink notes, and the pyre (`findsheets.mjs` `findBeacon`; `data.mjs` `FIND_COPY.beaconNotes`, `COMB.readings`, `FIND_PLAY.beacon`; `art.mjs` the `bc-notes` markup; the finale's own layer).**
- Three notes, at map (442, 412) and (455, 458) on land left of the pyre, and (552, 372) in the sea right of it. Their runes: "note one", "note two", "note three". Their English stays a slot that is Dan's to write ("A note in invisible ink goes here.", `todo: 1`).
- Each note's English wraps by words so it is never wider on screen than 44 map units on land and 40 at sea, at every size. With the phone's note scale (`notePhone` 1.7) that means narrower lines and more of them. The sea note must stay 3 units clear of the coast line and of the map frame's lines at 1920x950, 1440x900 and 412x915 in the beacon's close-up.
- Order: a press on the tower turns the beam to the next unread note, land first (412, then 458), the sea last, so the finale happens out at sea.
- **The pyre grows with each note:** the flame to 1.35, 1.75, then 2.2 times its first size, and its glow brighter and wider (opacity 0.3, 0.55, 0.85; radius 1.3, 1.65, 2.1 times). Each step: a small ember flies in an arc from the note to the flame over 0.6 s, and when it arrives the flame swells to its new size with a 0.25 s overshoot of 15 %.
- **The finale, on the third note:** the flame surges (2.2 to 3.4 to 2.4 over 0.9 s) with a bright flash of the glow (0.2 s); a ring of light grows from the pyre to 150 map units over 1.4 s and fades; the beam makes one full turn over 1.8 s, starting at the sea note, and each note flashes once (the read flash) as the beam passes it; then the beam settles at its rest angle 25 % longer and brighter than before, and the three notes stay at full strength (not `rest` 0.55). The hint reads "The beacon is lit."
- Reduced motion: no ember, ring or turn; the flame and the notes go straight to their final state.
- The ring and the beam's turn must not repaint `svg#map-finds` (put them on `svg#map-anim`, or on a compositor-only element).
- `art.mjs`'s `KEEP` list no longer reads the notes (`e927c22` froze those four spots on purpose, so the groves never reseed). Leave it that way.

**R5. The skal becomes two tankards clinking (`findhorn.mjs`, `art.mjs` `horn()`, `data.mjs` `FIND_PLAY.horn`, the horn's `FIND_COPY`, label and hints, `map.css` horn rules).**
- The approved drawing is `tools/skal-cups/tankards-approved.svg`, written by `tools/skal-cups/tankards.mjs`. `reference-tankards.png` is the picture Dan approved. Port the tankard (`CUPS.tankard`: thick handle band, body, hoops and staves, foam), the four poses (`POSES`) and `place()` exactly: local map units, base centre at 0,0, the right cup mirrors the left, the ground line `M-18 4H18`. It replaces the horn drawing at the same spot (144, 520) and about the same footprint; scale it like the horn (`FIND_PLAY.horn.scale`). Keep the page's classes (`.g`, `.t`, `.l`).
- Same two presses as now. The first press raises them (rest to raised over the horn's `raise` time) and opens the card ("Skal." with its slot, unchanged). The second press, or holding, clinks: they tilt in fast (0.12 s, ease in) until the rims touch, then bounce back to raised over 0.3 s (ease out). At the touch, three short splash strokes flick up from the clink point, and the rings (`hn-ring`, the "vibration circle" Dan wants kept) start from the clink point instead of the old horn's bell. The other finds answer as they do now.
- The pointer tip (`attend`) leans both cups a little, as it tipped the horn.
- New words: label "Two tankards on the shore. Press to raise them, press again to clink them."; hint "Press to raise them, press again to clink them."; `hornHints` "Press to raise them.", "Press again to clink them.", "Listen as the other finds answer." Keep "Skal." (with its accent) as the card's title.
- Reduced motion: they swap to raised, then clinked, without travel; the finds answer at once, as now.
- The hit box covers both cups in every pose.

**R6. Jormungandr: more revisions, and his head joined to the body (`findcreatures.mjs` the serpent; `data.mjs` `FIND_PLAY.serpent`, `FIND_PLAY.drawings.serpent`, the serpent's `FIND_COPY`; `art.mjs` `jormSegment`/`joWidth` only at the neck).**
- **Revisions:** the names go `final`, `final_v2`, `final_v2_FINAL`, `final_v3_FINAL`, `final_v3_FINAL_real`, each with the round's extension, and he ships on the fifth poke (four bites and laps, then the loop opens). Keep the names in data (`FIND_COPY.serpentNames`) and the ship poke as `serpentNames.length`. Typing in: keep the common start of the old and new name, then type the rest in bold and underlined, as now. The longest name must keep the 4 px clearances to every label and marker at 1920x950, 1440x900 and 412x915; if it cannot, shrink the file's name tag only on the size where it fails, and say so.
- **The head joint:** today the head's ink fill ends with an unstroked vertical edge at local x 33 (map 533), from y -8 to 8; there the body ribbon (`jormSegment(0)`) shows its own outline, at about y 94.7 and 108.3 (map), so the head's top outline ends 1.7 units above the ribbon's top edge and the jaw's line 0.7 below its bottom edge, and between the collar's right ring (local x about 28) and x 33 there is plain fill with none of the body's stripes or studs. Make it one animal: the head's outlines run into the ribbon's edges with no step (ends within 0.2 units, tangents within 6 degrees), and the ribbon's two inner stripes and studs run up to the collar's right ring. Change the head drawing's last curves or the neck's width (`MAP.jorm.neck`, `joWidth`), whichever keeps the rest of the head and body unchanged. It must hold while the head turns (`headLimit`, the breathing, the hear swell).

**R7. The legend on one line (`art.mjs` the legend band, symbols and `.lg` labels; `trip.mjs`'s legend placement; `data.mjs` `LABELS.legendAt` and `MARK.legend` as needed).**
- The four items (symbol, then its words) in one row: "a stop", "the work", "something to play with", "the trail", in that order, centred on x 300, with equal gaps between items (within 0.5 px at the overview).
- The band is shorter: from y 851 to the inner frame at 877 (the rect at y 851, height 26, and its top line at y 851.5). Its middle is the corner knots' centre, y 864.
- The symbols' centres and the words' x-height middle sit on y 864, the knots' centre, within 0.5 px at the overview at 1920x950, 1440x900 and 412x915.
- Every size keeps one row between the knots, with at least 6 px from each knot. If 360x800 cannot fit it, lower the gaps to 4 px, then the legend words to 8.5 px on phones only, and say so. The short landscape layout (`short` in `trip.mjs`) keeps its side column.
- The sea that the old band covered (y 822 to 851) now shows: check nothing there was hidden on purpose.

## Checks

New tests go in `tools/`:
- Use real CDP input only.
- Read state through computed styles, classes, attributes, `LayerTree`, `Animation` and the page's existing test hooks.
- Tests check behaviour, state, counts and pixels, never time. (R9's passes measure time; they are not tests.)
- "The base build" means the packed pages of `e927c22`: before you change anything, copy `dist/journey-map.html` and `dist/journey-joined.html` (still `e927c22`'s, since the brief's commit leaves `dist/` alone) into `journey-map-runs\comb-r\base\`.

1. `comb-r-compass-test.mjs`: after a craft press, once the needle has settled, the needle, runes, arms and ring write nothing for 2 s (count attribute mutations); no idle drift; the veil holes rebuild only at rest; the animated parts of the beacon, longship, glints, sparks and squirrel live in `svg#map-anim` and nowhere else.
2. `comb-r-visit-test.mjs`: in explore, at 1920x950 mouse and 412x915 touch, a shield press glides (the camera passes through in-between scales and positions, no cover shown) and ends on the journey's hold camera for that stop with the card open; the card's `cardK` rises only in the last 0.5 s; X and Esc close it with the camera unchanged to 0.01 px and 0.0001 scale; a drag with the card open closes it; reduced motion has no glide.
3. `comb-r-close-test.mjs`: in the journey, X runs `cardK` back down the opening's path (sample the card's box at several points and compare with the opening's boxes at the same `cardK`), the camera unchanged.
4. `comb-r-beacon-test.mjs`: three notes at the given spots; wrap widths; the sea note's clearances; press order; the flame and glow at each level; the finale's states (ring, one beam turn, the notes at full strength, the hint); reduced motion.
5. `comb-r-skal-test.mjs`: the tankards' markup matches the approved svg's parts; the four poses by real presses; rings start at the clink point; the new words; the hit box; reduced motion.
6. `comb-r-serpent-test.mjs` (or extend `comb-q-serpent-test.mjs`): the five names in order, the ship on the fifth poke, the next round's names; the head joint's numbers above at rest and at both ends of the head's turn; the clearances.
7. `comb-r-legend-test.mjs`: one row, equal gaps, centre lines on y 864, the knot clearances, at the three sizes and 360x800.
8. `comb-b-art-test.mjs` has failed since before `e927c22`: the groves reseeded long ago, so its tree indices (41 and 59) no longer name the audited pines. Point its named trees at today's trees by their seeded positions (the audited pines are now index 5 at (357.8, 158.1) after its nudge, and index 40 at (403.0, 351.4)), not by bare indices. Do not change what it asserts.
9. Rerun `node tools/check.mjs`, `finds-test`, `steps-test`, `explore-test`, `layout-test`, `depth-test`, `whirl2-test`, `frame-render-test`, `comb-p-quiet-test`, `comb-p-style-test`, `comb-b-art-test`, `comb-d-drawings-test`, `comb-l2-all-finds-test`, `comb-m-layers-test`, `comb-n-hold-test`, `comb-q-serpent-test`, and every test that names the compass (`wf-`, `findWay`, the veil), the beacon (`bc-`), the horn (`hn-`), the serpent (`jg-`, `jo-`), the legend (`.lg`, `legend`), cards (`cardsClose`, `c-card`) or explore. Change an existing assertion only where it encodes what this brief changes on purpose, and list each change. Source and picture pins (`finds-test`'s digests, `frame-render-test`) are re-recorded with a dated note, as before.
10. **The picture check:** at rest, at the overview, the explore fit, the compass close-up, the beacon close-up and the serpent close-up, at 1920x950 and 412x915, the new build differs from the base build by at most 3/255 everywhere except the parts this brief changes. List the views and the largest difference outside them.

## R9. Measuring on this PC

Run these after the tests, with nothing else running on the PC (ask yourself first: is any other Codex run going? If so, wait for it to end and say so).
- Tool: `node tools/phone-fps.mjs --launch "C:\Program Files\Google\Chrome\Application\chrome.exe" --size 1920x950 --dpr 2 --port 8766 --devtools 9333 --trace`, with `--page base=..\..\..\journey-map-runs\comb-r\base\journey-map.html --page new=dist/journey-map.html` (run from `design/journey-map`), `--runs 2` (the builds alternate), `--out` a folder in the run folder, and the rows below as `--beats`.
- Rows: `press:print,press:video,press:motion,press:screen` (the compass), `map` (Set out), `hmc1`, `end`, `explore:pinch`, and a new row for R2: add a beat kind `visit:<stop>` to `tools/phone-fps.mjs` (open `?beat=end`, enter explore, wait, press that stop's shield, record) and run `visit:laurier,visit:lennard`.
- Summarise per row and build: rAF fps, frames over 25 ms and 50 ms, max ms, GPU main p50/p90/max, and repaints by node (with `tools/trace-hitches.mjs` and the trace summaries the tool writes).
- **The bar for R1:** in every `press:` row of the new build, no frame over 50 ms, at most one over 25 ms, GPU main p90 at most 4 ms, at least 230 fps on average, and from +1.5 s to the end of the window no repaint of `svg#map-finds`, `svg#map` or `svg#map-veil`. For R2: the `visit:` rows at least 200 fps with at most 2 frames over 25 ms. No other row may get worse than the base build in frames over 25 or 50 ms. If a bar is missed, say by how much and what costs the time.
- Keep raw traces only for this pass (delete older ones as `clean-runs.ps1` does), delete browser profiles when a run ends.

**Stage the phone pass, do not run it:** write `journey-map-runs\comb-r\phone-pass.ps1` with the same rows and builds for the phone (`--adb D:\android\platform-tools\adb.exe --serial 10.0.0.178:44099 --runs 2 --trace`, `--out` in the run folder), for the existing `start-on-unlock.ps1` watcher to start later. Never unlock the phone or touch its settings, and never use any of Dan's own Chrome tabs.

## Rules

- **You may write only the following, all under `design/journey-map/`:**
  - the files and parts named in each item above;
  - `tools/phone-fps.mjs` (the `visit:` beat only);
  - the tests in `tools/` as the checks say;
  - `tools/check.mjs` (`RUNTIME_KB` and the page budgets only, raised by what this part needs, with a dated note);
  - `dist/journey-map.html` and `dist/journey-joined.html`, only through `node tools/pack.mjs` and `node tools/pack-joined.mjs`;
  - your report `COMB-R-BUILD.md`.
- Browser profiles, captures, traces and full logs go only in the run folder `journey-map-runs\comb-r` (env `COMB_RUN=comb-r`).
- **Never touch:** `depth.mjs`, `stars.mjs`, `footer.mjs`, `footname.mjs`, `pace.mjs`, `timeline.mjs`, `hammer.mjs`, `findhammer.mjs`; `hero-copy/`; the other finds' behaviour; `tools/skal-cups/`, `tools/jorm-carved/`, `tools/ygg-old-ash/`, `tools/sky-wolves/` (read only); the briefs, the other build reports or the audits; anything outside `design/journey-map/` except the run folder.
- Never run git, never install anything, and never use the network (a local headless Chrome or Edge on 127.0.0.1 is not the network, and adb is used only by the staged phone script, not by you). Never start reviewer agents or other agents.
- rtk is not installed on this PC: run local commands (node, PowerShell) directly, without the rtk prefix, as in earlier runs; this is not getting round a rule.
- If a rule stops you from doing something this brief asks, leave it out and say so in your report. Do not work around a rule.
- Use plain ASCII punctuation in `COMB-R-BUILD.md`, and write Jormungandr, Skal and Skoll there.

## Report

Write `COMB-R-BUILD.md`, kept short. It should cover:
- what you changed for each item and why, and anything you chose differently from this brief, with the measurement behind it;
- R9's table: every row, both builds, the numbers above, and the repaint counts by node from +1.5 s;
- each test you changed or added, and why;
- one table with the last exit of every test you ran;
- the picture check's views and largest differences;
- anything you left out, and why.
