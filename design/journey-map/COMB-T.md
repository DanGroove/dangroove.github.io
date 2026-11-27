# Polish round 3, part 16: Dan's notes on Preview 29 (COMB-T)

On the COMB-S build commit (part 15) and this brief's commit. Keep everything COMB-S and the parts before it did.

As before, you write the code, run the tests and run the PC measuring (T9). Claude reviews your build by hand afterwards, so report what you measured; do not sign anything off as "looks right".

## Why

Dan reviewed Preview 29 (`37557da`) on 2026-11-27 between 3:16 and 3:35 PM ET. His notes, in his words, each with what Claude measured in the cloud:

1. 3:16 PM, on the compass at the X view: "i feel like the labels for the compass shouldnt keep growing or shrinking based on zoom level. this is the size they should stay at for all zooms" (T1).
2. 3:17 PM, on the legend: "these need to be spaced out evenly", and "lets rename something to play with to point of interest" (T2).
3. 3:21 PM: "we need to rethink URD's well part since the point of interest is ygrdasil now. lets re-conceptualize this area with the tree being the POI". He picked option B, Shake the ash, from Claude's sketch sheet at 3:35 PM (T3).
4. 3:21 PM, on Mohawk's name in explore: "move mohawk down and to the left so its not on the trail" (T4).
5. 3:25 PM, on the beacon: "this note should be here", and "once you found all the notes, the beam should circle forever and on the pyre be interactable shooting fire and sparks up when you click it" (T5).
6. 3:28 PM, on the HMC Connections chest: "move this chest down so it doesnt overlap the path" (T6).
7. 3:29 PM: "the wolf is too close to the sun, pls fix" (T7).

Every value below comes from Dan's screenshots or Claude's renders of `37557da`. You cannot see those pictures, so use the numbers as given.

## T1. The compass words keep one screen size at every zoom

- **Now:** `compassFrame` (findhoards.mjs) sets each word's `font-size` to `COMB.wordPx` (10) over the scale and places it `FIND_PLAY.way.wordGap` (16) screen px off the ring, but only at rest or at a raster rebase, and the words' `letter-spacing="1.2"` is in map units. Measured at 1920x950: the tracking is 1.0 px at the overview, 3.3 px at the X view and 4.4 px at the stops, and during glides and explore moves the words grow and shrink with their layer between rebases.
- **Dan's size**, from his screenshot: 10 px type, about 2.7 px tracking, 16 px off the ring.
- **Want:** in every frame, at rest and through every move (glides, Back, Set out, the explore opening and visits, wheel, pinch and drag, the compass press and its focus), at every viewport: the four words are 10 px with 2.7 px letter-spacing, 16 px off the ring as the ring is shown in that frame, with the same anchors as now (Print above, Video right and starting there, Motion below, Screen left and ending there; a word's trailing letter-spacing left out). Add `COMB.wordTrack: 2.7`.
- **How:** move the four words, and the tally with them, into a screen-space layer, as main.mjs did for the numbered find markers (`marker-layer`), placed each frame from the compass centre's screen point and the shown scale with compositor-only moves. The text is drawn once at its size: no `font-size` or `letter-spacing` writes per frame, and no repaint of a map-sized layer from the words in any frame.
- Everything else stays as it is now: colours, weight, halo, every opacity and visibility rule (the label fades, card cover, the compass veil, focus fades, explore), the stacking against the veil, cards, timeline and hint, and the tally's own size rule, one word gap above Print. Pressing a word still picks its craft, with the pointer and the keyboard exactly as now.

## T2. The legend: even gaps at every zoom, and "point of interest"

- **Now** (trip.mjs, the one-row legend): the row is laid out once at `VIEW.s0` (symbol, 8 px, word, 16 px gap, centred on map x 300 at y 864). Symbols scale with the map and words by `labelScale('legend', s)`, so when zoomed in the gaps spread unevenly. Measured at 1920x950, the three gaps between items are 16/16/16 px at the overview, 110/129/220 px at Lennard and 81/96/163 px at the X view.
- **Want:** the three gaps equal at every zoom. Whenever the legend words' label scale is written, lay the row out again by the overview's rule: symbol, inside gap 8/`VIEW.s0` map units, word at its current label scale, gap 16/`VIEW.s0` map units, the row centred on map x 300 at y 864. Write the positions in the same frames as the label scale, with no extra frames and no extra map-sized repaints. Measure each word's width once and scale it by the label scale; no `getBBox` per frame. The short-landscape two-column legend keeps its own layout.
- Rename `COPY.legend.find` from "something to play with" to "point of interest".

## T3. Yggdrasil is the point of interest: Shake the ash

The well stops being a find and the tree becomes one, with a numbered marker.

**The find**
- Replace the `well` entry in `FINDS` with: `{ id: 'ash', n: 7, x: 304, y: 374, view: [306, 350, 72], mark: [374, 292], label: 'Yggdrasil, the world ash. Press to shake it, and each stop on the trail drops a leaf.' }`. The count stays 11.
- Marker 7 at [374, 292] sits above the crown's right side, in the screen-space marker layer like markers 1 to 6. Claude scanned the overview at 1920x950, 1440x900 and 412x915: a 17 px marker there touches no ink.
- The hit is the tree: the crown (`YGG.canopy`) and the trunk, not the well or the far roots. Pointer, touch, Enter and Space work as for the other finds, and so do the hint, focus, explore and count.
- Hint: "Shake the ash. Every place drops a leaf." (`FIND_COPY.hints.ash`). After the sixth leaf it reads "Every place has dropped its leaf."

**Each press**, until all six leaves are down:
1. **The crown shakes.** `.yg-crown` rotates about map (304, 344) in a damped wobble: 2.2 degrees at its peak, 5 Hz, at rest within 0.7 s. Two pairs of short arcs, "((" and "))", flash at the crown's left and right edges for 0.4 s, in the tree's line style.
2. **One leaf falls**, in trail order: Laurier, HMC Connections, Mohawk, HMC again, Interkom, Lennard.
   - The leaf is 8 map units long and 5.1 wide: two curves tip to tip, with a midrib from the base tip to 0.42 of the length. It is filled with the body colour, has its midrib in the second colour, and is outlined in `C.ink` at 0.6 units.
   - Colours from each place's shield:
     - Laurier `#EAA41E`, midrib `#330172`.
     - Both HMC stops `#0D7247`, midrib `#FFFFFF`.
     - Mohawk `#FB9632`, midrib `#991030`.
     - Interkom `#F7F3E2`, midrib `#242021`. Not its red, which is too close to the reserved red.
     - Lennard `#FF4C00`, midrib `#D8D1CA`.
   - The leaf leaves the crown on the side toward its stop and drifts down in a flutter to its resting spot: a sway of about 4 units over two or three swings, rotation up to 40 degrees easing out, 1.4 to 1.8 s. Map units, start to rest, with the resting angle:
     - Laurier (262, 326) to (258, 378), 14 degrees.
     - HMC Connections (350, 322) to (350, 377), -12 degrees.
     - Mohawk (248, 334) to (232, 383), -18 degrees.
     - HMC again (368, 330) to (374, 383), 20 degrees.
     - Interkom (340, 336) to (352, 398), -26 degrees.
     - Lennard (306, 338) to the well's water (`FIND_PLAY.well.water`, 300, 390), 8 degrees. It lands in the water with the well's ripple rings, as the pebble did, and bobs once.
   - Claude rendered these resting spots at the tree's close-up at 1920x950 and 412x915. Every leaf is clear of the trail, the labels and the other leaves.
3. **A pop names the place.** When the leaf lands, the find's pop shows that stop's map label, anchored at the leaf's resting spot, as the Norns' answer did (`showPop`): the kicker is the stop's `label.t` and the line is its `label.sub`, for example "HMC Connections" and "summers 2018 and 2020". It stays until the next press, the find closes, or 6 s pass.

**Before and after**
- Fallen leaves stay where they landed for the session, at every zoom and in explore. They live in the tree's layer, not in a map-sized layer that repaints.
- After the sixth leaf, a press still shakes the crown but no leaf falls.
- The find is found on the first press and kept from the first leaf, as the other finds.
- With reduced motion there is no shake and no fall: each press puts the next leaf at its resting spot at once and shows its pop.

**The well**
- The well keeps its art exactly where it is, its name label ("URD'S WELL", "was, is, shall be"), the root drip and its ring.
- The tree keeps its idle life: Ratatoskr's climb, the eagle's stretch, and the eagle's flight on `hear`.
- Remove the pebble, the Norns' answers, the crown's star batches and the well's hit. Also remove their copy and settings once nothing uses them: `FIND_COPY.norns`, `nornKicker`, `wellStop`, `wellNone`, `wellMap`, `wellNext` and `hints.well`.

**Layers:** the shake and the fall are press-started effects. They may write while they play (in `svg#map-anim` or small layers, whichever measures better), and nothing writes after they settle (COMB-R's R1, COMB-S's S2). The crown is drawn in the map's art. If shaking it in place repaints a map-sized layer, move the crown to a small layer of its own while it shakes, and keep the picture identical at rest.

## T4. Mohawk's name in explore: below and to the left

- **Now:** `COMB.exploreSides.mohawk` is `'right'`, and the name sits on the east trail. Claude's renders show `'left'` on the college drawing and `'below'` on the south trail.
- **Want:** a new side, `'below-left'`, for Mohawk: the name's box is left of the marker's centre line, and its top is below the marker's centre. Its top-right corner sits about 7 px from the ring, as the other sides do. It is clear of the college drawing, the east trail and the south trail, with its right edge at least 6 px clear of the south trail.
- This holds in both the seed (the constant-cost placement used when explore opens before the idle placement finishes; it does not test the trail today) and the idle placement, at all 13 explore scales, at 1920x950, 1440x900 and 412x915.
- List any other name whose seed or idle box touches the drawn trail at those sizes, but do not move it.

## T5. The beacon: note one moves up, the beam turns forever, and the pyre fires

- **Note one:** `COMB.readings[0]` moves from [442, 412] to [467.5, 385.4], into Dan's circle. Keep the phone rule that moves note two down only while it touches note one. The beam must still read note one. Report the box of each note at 1920x950 and 412x915, and check that note one touches neither the trail nor the other notes.
- **The endless beam:** once all three notes are read, the finale's turn runs on into an endless turn. It keeps the same direction and eases from the finale's speed to one turn every 8 s (`FIND_PLAY.beacon.spin: 8`) over about 1 s, with no stop and no snap back to `baseAngle`.
  - Its clock pauses off screen and while the camera moves, and resumes from its held angle (COMB-S's S2 rules).
  - The turn is compositor-only: the beam is on a small layer of its own, turned by a transform.
  - The beam's light on the depth layer (`depthBeam`) must not force the air layer every frame. Either draw the wedge once on a small layer and turn that, or keep the depth light for aiming and the finale only, so the endless turn shows the map beam alone. Report which you chose and why.
  - With reduced motion the beam rests lit at `baseAngle`, as now.
- **Aiming ends once lit:** drags and arrow keys no longer aim.
- **The pyre:** once lit, each press (click, tap, Enter or Space) fires the pyre.
  - The flame leaps to 3.4 times its lit size in 0.15 s and settles back over 0.55 s, and the glow flares with it.
  - A column of 16 sparks shoots up from the flame: direction -110 to -70 degrees, 40 to 80 units/s, g 40, life 0.7 to 1.2 s.
  - Five flame tongues (the `drop` bit, pointing up, in the flame's own colour and `DEPTH.wolves.spark`, never red) rise 20 to 30 units and fade.
  - A press during a flare starts it again.
  - With reduced motion there are no particles: the flame steps to its peak size for 0.4 s.
- `litHint` becomes "The beacon is lit. Press it for fire and sparks."

## T6. The HMC Connections chest moves off the trail

- `hoard-hmc1` moves from x 404, y 288 to **x 405.5, y 316** (its anchor is the chest's base centre), into Dan's circle. The trail crosses its lid today. Its shadow, its rock and any views of it move with it.
- Check that its ink touches neither trail and stays clear of the "HMC, again" name, at the overview, the hmc1 and hmc2 beats and the hoard's own view, at 1920x950 and 412x915.

## T7. Skoll's gap to the sun (and Hati's to the moon)

- **Measured** mid-chase, at the glide's halfway point, on `37557da`:
  - Skoll's nose overlaps the sun's rays by 25 px at 1920x950 and 17 px at 412x915.
  - Hati's nose is 14 px and 4 px from the moon. In Dan's words of 2026-11-26, the wolves "chase the sun/moon not catch them".
- **Claude's renders:**
  - Skoll at lag 100 clears the ray tips by 39 px at 1920x950 and 19 px at 412x915.
  - Hati at lag 80 clears the moon by 45 px and 22 px.
- **Change:** move `lag` into each wolf (`skoll.lag: 100`, `hati.lag: 80`) and remove the shared one. depth.mjs reads the wolf's own lag (one line), and `comb-n-wolves-test` and `comb-p-chase-test` read it too. Nothing else about the wolves changes.

## T8. Checks

1. Rerun the suites COMB-S ran that cover a file you change (`COMB-S-BUILD.md` lists them). Change an existing assertion only where it encodes what this brief changes on purpose, and list each change. Re-record source and picture pins with a dated note.
2. New tests, with real CDP input, at 1920x950 and 412x915:
   - `tools/comb-t-words-test.mjs` (T1): in every frame of Lennard to X, Back, Set out, the explore opening, a wheel zoom and a pinch over the compass, and the compass press, each word is 10 +/-0.05 px with 2.7 +/-0.05 px tracking and sits 16 +/-0.5 px off the ring. The words cause no map-sized raster change (use COMB-S's raster records). Pressing each word at its centre picks its craft.
   - `tools/comb-t-legend-test.mjs` (T2): at the overview, every stop beat and the X view, the three gaps are equal within 0.5 px, the inside gaps are equal within 0.5 px, and the row is centred on map x 300.
   - `tools/comb-t-ash-test.mjs` (T3):
     - Six presses on the tree land six leaves in order, at their spots within 0.5 units, each with its pop's text.
     - A seventh press shakes the crown and drops no leaf.
     - The well takes no press.
     - Marker 7 shows and opens the tree.
     - The count is still 11.
     - Reduced motion lands each leaf at once.
     - Enter and Space work.
     - After each effect settles, nothing writes.
   - `tools/comb-t-beacon-test.mjs` (T5):
     - The three notes are read.
     - The beam then turns on its own for 20 s, its angle always increasing, at one turn per 8 s within 5 %, and it writes nothing while off screen or while the camera moves.
     - After lit, presses fire the pyre (flame peak and sparks) and drags do not aim.
     - Note one's box.
   - T4, T6 and T7: extend the existing explore, hoard and wolf tests.
3. The picture check against the COMB-S build: outside what this brief changes, the new build differs by at most 3/255 at COMB-S's views. List the views and the largest difference.

## T9. Measuring on this PC (as COMB-S's S6)

- **Base:** before you change anything, copy the worktree's `dist\journey-map.html` (the COMB-S build) to `journey-map-runs\comb-t\base\journey-map.html`.
- **Tool and flags:** the same tool, flags and `--page base=... --page new=...` as COMB-S's S6, with `--out` folders in `journey-map-runs\comb-t`.
- **New beat kinds** in `tools/phone-fps.mjs`:
  - `press:ash` opens `?beat=map`, presses the tree's hit, and records.
  - `rest:beacon` opens `?beat=interkom`, presses the beacon three times 1.6 s apart so the notes are read, waits 4 s, and records with no input.
  - `press:pyre` does the same setup, then records a press on the beacon.
- **Rows,** as three invocations: `rest:map,rest:compass,rest:beacon`; `press:print,press:ash,press:pyre`; `x,end,explore:pinch`.
- **Bars** (new build):
  - `rest:` rows: at least 236 fps, GPU main p90 at most 2 ms, no frame over 25 ms, and no paint of a layer bigger than the screen.
  - `press:` rows: at least 230 fps, GPU main p90 at most 4 ms, at most one frame over 25 ms, none over 50, and no late paint of a layer bigger than the screen.
  - `x`, `end` and `explore:pinch`: no worse than the base in frames over 25 or 50 ms, in either run.
  - If a bar is missed, say by how much and what costs the time, from the traces.
- **The pinch trace:** for both builds' `explore:pinch`, report the trace's size, its 10 most frequent event names with their counts, and the layer count per frame. COMB-S's new build made a trace too big to save, so say what makes it bigger than the base's.
- **Traces:** keep raw traces only for this pass.

## T10. Stage the phone pass, do not run it

- As COMB-S's S7, written as `journey-map-runs\comb-t\phone-pass.ps1` for `start-on-unlock.ps1` to start later.
- **Builds,** as fixed copies in `journey-map-runs\comb-t\phone\`:
  - Base is Preview 29, the copy COMB-S made at `journey-map-runs\comb-s\base\journey-map.html`.
  - New is this build.
- **Rows:** `map`, `hmc1`, `visit:laurier`, `press:print`, `press:screen`, `press:ash`, `rest:map`, with `--runs 2 --trace`. Say how long it takes.
- **Recordings:** unlike COMB-S's staged script, record in 60 s chunks named `/sdcard/Download/jm-comb-t-<time>-<n>.mp4`, and delete each chunk from the phone right after it is pulled (only the files this script made). When the rows end, stop the recording within 60 s, so the phone is free again quickly.
- Never run it, never use adb yourself, never unlock the phone or touch its settings, and never use any of Dan's own Chrome tabs.

## Rules

- **You may write only the following, all under `design/journey-map/`:**
  - `data.mjs`: `FINDS`, `COPY.legend`, `FIND_COPY`, the `FIND_PLAY` well, ash, beacon and way keys, `COMB` (readings, explore sides, new keys), the hmc1 hoard's position, and the `DEPTH.wolves` lag keys only.
  - `art.mjs`: the tree's and the well's markup and hits, and the legend's markup only.
  - `trip.mjs`: the legend layout and the explore name sides and seed only.
  - `main.mjs`, `map.css` and `index.html`: the screen-space word layer, the marker layer and the new pieces' styles.
  - `findkit.mjs`, `finds.mjs`, `findall.mjs`, `findhoards.mjs` (the compass words and the hmc1 chest), `findsheets.mjs` (the beacon) and `findwater.mjs` (the well becomes the ash).
  - `depth.mjs`: the wolves' lag line and the beacon light's layer only.
  - `tools/phone-fps.mjs`: the new beat kinds, and saving a trace too big for one string in pieces (for example, streaming its events into the gzip). COMB-S's S6 lost the new build's `explore:pinch` twice to "Invalid string length" where the whole trace is stringified before gzipping.
  - The tests in `tools/` as T8 says, and `tools/check.mjs` (`RUNTIME_KB`, the page budgets and the find lists, changed only as this part needs, with a dated note).
  - `dist/journey-map.html`, `dist/journey-joined.html` and `joined.html`, only through `node tools/pack.mjs` and `node tools/pack-joined.mjs` (pack-joined writes `joined.html` too; run it, since COMB-S left the joined page stale).
  - Your report, `COMB-T-BUILD.md`.
- **The run folder:** browser profiles, captures, traces and full logs go only in `journey-map-runs\comb-t` (env `COMB_RUN=comb-t`).
- **Never touch:**
  - `stars.mjs`, `footer.mjs`, `footname.mjs`, `pace.mjs`, `hammer.mjs`, `findhammer.mjs`, `findcreatures.mjs`, `findhorn.mjs`, `cards.mjs`, `timeline.mjs`, `steps.mjs` or `explore.mjs`.
  - `hero-copy/`.
  - What any find not named here does when pressed.
  - `tools/skal-cups/`, `tools/jorm-carved/`, `tools/ygg-old-ash/` and `tools/sky-wolves/`, which are read only.
  - The briefs, the other build reports and the audits.
  - Anything outside `design/journey-map/` except the run folder.
- Never run git, never install anything, and never use the network (a local headless Chrome or Edge on 127.0.0.1 is not the network). Never start reviewer agents or other agents. Do not delete anything; a cleanup script runs after you.
- Before you start, make sure no other `codex exec` run is going: look for another process whose command line runs `codex exec`, or the `run-codex.ps1` wrapper, besides your own. The ChatGPT desktop app's own Codex helpers (`codex.exe app-server`, `codex.exe exec-server`, `codex-computer-use-swift` and its node runtime, all under `ChatGPT.exe`) are an idle app, not a run: they do not count, so do not wait for them and never close them.
- rtk is not installed on this PC: run local commands (node, PowerShell) directly, without the rtk prefix, as in earlier runs; this is not getting round a rule.
- If a rule stops you from doing something this brief asks, leave it out and say so in your report. Do not work around a rule.
- Use plain ASCII punctuation in `COMB-T-BUILD.md`, and write Jormungandr, Skal and Skoll there. Keep the accented names in the page's own text as they are.
- Order, if time runs short: T6, T2's rename, T7, T5's note one, T4, T2's gaps, T1, T3, then T5's beam and pyre. Finish within about 150 minutes. Start T9's measuring by about 115 minutes in (it takes about 25), and end by writing the report.

## Report

Write `COMB-T-BUILD.md`, kept short. It should cover:
- what you changed for each item and why, and anything you chose differently from this brief, with the measurement behind it;
- T1's layer and how the words follow the ring; T5's choice for the beam's depth light;
- T9's table: every row, both builds, the numbers above, and the paints by node of layers bigger than the screen;
- each test you changed or added, and why;
- one table with the last exit of every test you ran;
- the picture check's views and largest differences;
- note one's and the chest's boxes, and T4's list of other names on the trail;
- the phone pass you staged, its rows and its running time;
- anything you left out, and why.
