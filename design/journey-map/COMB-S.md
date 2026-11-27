# Polish round 3, part 15: one big redraw per frame, idle animations off the big layers, and the Mohawk marker blink (COMB-S)

On commit `37557da` (COMB-R and its review fixes) and the brief's own commit. Keep everything COMB-R and `37557da` did.

As in COMB-R, you write the code, run the tests and run the PC measuring (S6). Claude reviews your build by hand afterwards, so report what you measured; do not sign anything off as "looks right".

## Why

- Dan, 2026-11-27 6:38 AM ET: "still the same 5 lag spikes when setting out". The phone films of Preview 27 and 28 (journey-map-runs\phone-p28) still show a stutter at each zoom step of Set out, with two frames of 50-69 ms in three runs on Preview 28.
- The same films show one real glitch on Preview 28: **the Mohawk marker vanishes for one frame as the traveller arrives at hmc1** (film row `b-hmc1-1` at 17.251 s; build a, `fa0a28a`, keeps it).
- comb-r9 (`journey-map-runs\comb-r9\COMB-R9-REPORT.md`, this PC, 1920x950 at DPR 2):
  - The compass presses have no frame over 25 ms, but run 206-228 fps with GPU main p90 4.05-6.51 ms. What is left is GPU raster of `svg#map-anim`, painted about 692 times per 4.5 s window with a 9920x8950 clip.
  - The explore visit glides: Laurier 180 fps with 9-10 frames over 25 ms, Lennard 205 fps with 4.
  - Journey rows: `map` (Set out) 198 fps, 9-10 frames over 25 ms, 0-1 over 50; `hmc1` 200 fps, 10 over 25, 0-1 over 50. During `hmc1`, `svg#map-live`, `div.c-shadow` and `div.tl-head` paint nearly every frame (about 525, 840 and 530 times per window), each with a clip bigger than the screen.
- What writes every frame with no input (counted in the cloud at `?beat=map`, nothing pressed, every piece on screen): both ravens' `rv-body` and `rv-head`, the serpent's file (`jg-file` transform, `jf-name` y), the beacon's beam sweep (`bc-beam`) and flame flicker (`bc-flame`), the longship's `ls-rock` and `ls-sail`, and every so often the hoard glints (`hd-glint`). COMB-R moved all of them into `svg#map-anim`, which is as big as the map, so each write repaints part of a map-sized layer.
- When `svg#map` redraws during a journey glide (`trip.mjs` `tripApply`, the `st.rasterRebased` block), it writes `#cam` and the cams of `svg#map-live`, `svg#map-finds`, `svg#map-anim` and `svg#map-lines` in the same frame, so five map-sized layers redraw together at every zoom step. `svg#map-base`, `svg#map-veil` and the sky already take their own frames. Find focus moves already redraw one layer per frame (`tripFocusRasters`, from COMB-R's R1).

## S1. One big redraw per frame, wherever the camera moves

- Journey glides (Set out, Next and Back, the timeline), explore's scripted opening, explore visit glides, wheel and pinch zooms and drags: every layer bigger than the screen (`svg#map`, `svg#map-base`, `svg#map-live`, `svg#map-finds`, `svg#map-anim` while it stays map-sized, `svg#map-lines`, `svg#map-veil`) gets its own raster camera and its own request for the frame's slot, as `svg#map-base` and the sky objects have today. A moving camera redraws at most one of them per frame, the one furthest past its hold range first.
- Between redraws, each layer rides its own held camera (its own matrix), so together they show the same picture in every frame. Build on what `tripFocusRasters` does for find focus moves; one code path for every kind of move is better than two.
- Keep the forced redraws (`FRAME_PERF.slack`) and the rule that the base always covers the screen. Never redraw ahead of the camera: that let parts of `svg#map` drop out for a frame on the phone (films phone-p25v).
- At rest, every layer still redraws sharp, one per frame, as now.

## S2. Idle animations stop repainting big layers

- **Off screen, nothing writes.** An idle loop (the ones above, and any other that writes with no input) writes nothing while its piece is off screen, with a small margin. Its clock pauses, so it carries on from the same pose when it comes back, with no jump.
- **On screen, no idle loop repaints a layer bigger than the screen.** Give the looping pieces small layers of their own: a small svg each (or for a few neighbours), sized to the piece and its motion, riding the map camera like the L5 layers, sharp at rest. Where a loop is a rigid motion (the beam's sweep, the longship's rock and sail, the ravens' bob, the flame's flicker), make it a compositor-only transform of its small layer if you can, so it repaints nothing; these may keep running while the camera moves. A loop that has to repaint (the serpent's file name) repaints only its own small layer, and holds its pose while the camera moves, then carries on from it.
- **What a press starts** (the needle, the beacon's notes, embers, ring and finale, the tankards and their rings and splash, the well's ripples, the sparks) may still write while it plays, in `svg#map-anim` or in small layers, whichever measures better. Nothing keeps writing after it settles (COMB-R's R1 rule).
- Everything looks as it does now, at rest and while playing (S5's picture check).

## S3. The overlay pieces that repaint during journey moves

- During `hmc1`, `div.c-shadow` (the card's shadow) and `div.tl-head` (the timeline's head) paint nearly every frame with clips bigger than the screen, and `svg#map-live` paints every frame. Find what each paint is (a style written every frame, a blur or shadow redrawn as it scales, a layer far bigger than what it draws, the trail or the names fading) and make it compositor-only (transform and opacity of a layer of its own, no bigger than what it draws), or stop the writes when nothing changes. Keep how each looks.

## S4. The Mohawk marker blink

- On Preview 28's phone film, the Mohawk marker vanishes for one frame as the traveller arrives at hmc1 (`journey-map-runs\phone-p28`, film row `b-hmc1-1` at 17.251 s; the `a-hmc1-1` row, `fa0a28a`, keeps it). Find what drops it: compare that film's frames around 17.251 s with the a row's, and take a trace of the same moment (a layer created, destroyed or redrawn at the arrival, a `will-change` or visibility switched, the stops placed a frame late, L5's visibility rules for `#map-stack`). Fix the cause, not the symptom.
- What Claude already ruled out, in the cloud (headless Chromium, no GPU raster, 412x915 at DPR 2.625, `?beat=mohawk`, Next tapped): a per-frame record of every stop's `.stop`, `.st-btn`, traveller ring and card shell (computed opacity, visibility, display and box) shows no change at the arrival. So the cause is likely a layer or raster change on the phone, not a style the code writes.
- S7's filmed phone pass must show every stop marker in every frame of the `hmc1` rows.

## S5. Checks

1. Rerun every suite COMB-R ran (`COMB-R-BUILD.md` lists them) and the `comb-r-*-test.mjs` tests. Change an existing assertion only where it encodes what this brief changes on purpose, and list each change. Source and picture pins are re-recorded with a dated note, as before.
2. New `tools/comb-s-raster-test.mjs` (real CDP input, deterministic clock, like `comb-r-fixture.mjs`): through Set out, `hmc1`, Back from hmc1, the explore opening, a visit glide, a wheel zoom and a pinch, at 1920x950 and 412x915, at most one map-sized layer's raster camera changes in any frame, except the forced redraws, which it lists; when each move ends, every layer's raster camera equals the shown camera.
3. New `tools/comb-s-idle-test.mjs`: at rest, idle loops write only to small layers (list each layer and its box), nothing writes for a piece off screen, repainting loops write nothing while the camera moves, and each loop resumes from its held pose (no jump over 0.5 map units or 2 degrees between the frames either side of the resume).
4. The picture check, as COMB-R's: at rest, at the overview, the explore fit, the compass, beacon and serpent close-ups, at 1920x950 and 412x915, the new build differs from the base by at most 3/255 everywhere, with both builds' idle clocks set to the same time. List the views and the largest difference.

## S6. Measuring on this PC (as COMB-R's R9)

- Before you change anything, copy the worktree's `dist\journey-map.html` (`37557da`) to `journey-map-runs\comb-s\base\journey-map.html`; that is the base.
- Tool: `node tools/phone-fps.mjs --launch "C:\Program Files\Google\Chrome\Application\chrome.exe" --size 1920x950 --dpr 2 --port 8766 --devtools 9333 --trace --runs 2`, from `design/journey-map`, with `--page base=..\..\..\journey-map-runs\comb-s\base\journey-map.html --page new=dist/journey-map.html` and `--out` folders in the run folder.
- Add a beat kind `rest:<what>` to `tools/phone-fps.mjs`: `rest:map` opens `?beat=map` and records the window with no input; `rest:compass` opens `?beat=map`, presses the compass's hit as the `press:` rows do before their word, waits 3 s, and records with no input.
- Rows, as three invocations so one broken row cannot stop the others: `press:print,press:screen,map,hmc1,end,explore:pinch`; `visit:laurier,visit:lennard`; `rest:map,rest:compass`.
- Summarise per row and build, as in R9: rAF fps, frames over 25 and 50 ms, max ms, GPU main p50/p90/max, and paints by node of layers bigger than the screen (late paints from +1.5 s for the moving rows, the whole window for the rest rows).
- **Bars** (new build):
  - `rest:map`, `rest:compass`: at least 236 fps, GPU main p90 at most 2 ms, no frame over 25 ms, and no paint of a layer bigger than the screen in the window.
  - `press:` rows: at least 230 fps, GPU main p90 at most 4 ms, at most one frame over 25 ms, none over 50, and no late paint of a layer bigger than the screen.
  - `visit:` rows: at least 215 fps, at most 2 frames over 25 ms, none over 50.
  - `map` and `hmc1`: no frame over 50 ms in any run, and at most half the base build's frames over 25 ms.
  - `end` and `explore:pinch`: no worse than the base in frames over 25 or 50 ms, in either run.
  - If a bar is missed, say by how much and what costs the time, from the traces.
- Keep raw traces only for this pass; leave browser profiles and older traces to the cleanup script that runs after you.

## S7. Stage the phone pass, do not run it

- A filmed pass like phone-p28 (its pass script, the screen recording loop and `rec-log.txt` are in `journey-map-runs\phone-p28`; `tools/film-scan.mjs` scans the films afterwards). Builds: base and new as fixed copies in `journey-map-runs\comb-s\phone\` (never the worktree). Rows: `map`, `hmc1`, `visit:laurier`, `press:screen`, `rest:map`, `--runs 2 --trace`, adb as in COMB-R (`D:\android\platform-tools\adb.exe`, serial `10.0.0.178:44099`).
- Write it as `journey-map-runs\comb-s\phone-pass.ps1` for `start-on-unlock.ps1` to start later, and say how long it takes. Never run it, never use adb yourself, never unlock the phone or touch its settings, and never use any of Dan's own Chrome tabs.

## Rules

- **You may write only the following, all under `design/journey-map/`:**
  - `trip.mjs`, `steps.mjs`, `explore.mjs`, `main.mjs`, `map.css` and `index.html` (layers, raster cameras and slots, S1 to S4);
  - `art.mjs` (the looping pieces' markup and layers only), `findkit.mjs`, `finds.mjs`, `findall.mjs`, `findhoards.mjs`, `findcreatures.mjs`, `findsheets.mjs`, `findwater.mjs`, `findhorn.mjs` (idle loops, their layers and their clocks only);
  - `cards.mjs` (the card shadow and the stop markers, S3 and S4 only) and `timeline.mjs` (the head's paint, S3 only);
  - `data.mjs` (`FRAME_PERF` and new keys this brief needs only);
  - `tools/phone-fps.mjs` (the `rest:` beat only), the tests in `tools/` as S5 says, and `tools/check.mjs` (`RUNTIME_KB` and the page budgets only, raised by what this part needs, with a dated note);
  - `dist/journey-map.html` and `dist/journey-joined.html`, only through `node tools/pack.mjs` and `node tools/pack-joined.mjs`;
  - your report `COMB-S-BUILD.md`.
- Browser profiles, captures, traces and full logs go only in the run folder `journey-map-runs\comb-s` (env `COMB_RUN=comb-s`).
- **Never touch:** `depth.mjs`, `stars.mjs`, `footer.mjs`, `footname.mjs`, `pace.mjs`, `hammer.mjs`, `findhammer.mjs`; `hero-copy/`; what any find does when pressed; `tools/skal-cups/`, `tools/jorm-carved/`, `tools/ygg-old-ash/`, `tools/sky-wolves/` (read only); the briefs, the other build reports or the audits; anything outside `design/journey-map/` except the run folder.
- Never run git, never install anything, and never use the network (a local headless Chrome or Edge on 127.0.0.1 is not the network). Never start reviewer agents or other agents. Do not delete anything; a cleanup script runs after you.
- Before you start, make sure no other `codex exec` run is going: look for another process whose command line runs `codex exec`, or the `run-codex.ps1` wrapper, besides your own. The ChatGPT desktop app's own Codex helpers (`codex.exe app-server`, `codex.exe exec-server`, `codex-computer-use-swift` and its node runtime, all under `ChatGPT.exe`) are an idle app, not a run: they do not count, so do not wait for them and never close them.
- rtk is not installed on this PC: run local commands (node, PowerShell) directly, without the rtk prefix, as in earlier runs; this is not getting round a rule.
- If a rule stops you from doing something this brief asks, leave it out and say so in your report. Do not work around a rule.
- Use plain ASCII punctuation in `COMB-S-BUILD.md`, and write Jormungandr, Skal and Skoll there.
- Finish within about 150 minutes. Start S6's measuring by about 110 minutes in (it takes about 25), and end by writing the report.

## Report

Write `COMB-S-BUILD.md`, kept short. It should cover:
- what you changed for each item and why, and anything you chose differently from this brief, with the measurement behind it;
- S4's cause, with the film frames and trace events that show it;
- S6's table: every row, both builds, the numbers above, and the paints by node of layers bigger than the screen;
- each test you changed or added, and why;
- one table with the last exit of every test you ran;
- the picture check's views and largest differences;
- the phone pass you staged, its rows and its running time;
- anything you left out, and why.
