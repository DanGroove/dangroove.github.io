# Polish round 2, part 9: the bug hunt's older bugs (G)

Dan, 2026-11-25: "do a thorough bug find on the entire page, especially clicking the buttons in different orders etc." Six workers explored preview 17 (a054373) with real taps, clicks, keys, wheel, drags and pinches in every mode. Their bugs that part 8 introduced were fixed in the cloud right after (the commit before this brief). This part fixes the rest: bugs that were already in part 7 (e00b996), plus two small new ones left over. Every item says what is wrong today and the result that must hold. Dan's standing rule for every check here: "ALWAYS do real exploring, this is the best way to find bugs".

Read `BRIEF.md` first; its rules hold. Then `COMB-F.md`. Keep everything parts 3b to 8 did unless an item here says otherwise, and keep the cloud fixes of the commit before this brief exactly as they are:
- `main.mjs`: the hero frame is skipped only once a full frame has tidied the map's layers (`mainHeroTidy`), so nothing of the map stays over the hero after a load, a resize, Home or "Back to the top".
- `findkit.mjs` `showPop`: a bar in the top half of the screen is a ceiling for a card, not its floor (desktop explore and end), and the horn's card measures the horn's sampled outline (`FD.popShape.pts`), 12 px from the drawing.
- `trip.mjs`: the map layer is promoted while the explore camera moves and released at rest after a zoom (`r.promo`, `r.soft`).
- `steps.mjs` and `join.mjs`: input at the top waits while the hero's loader runs (`stepsHoldTop`), and a vertical finger is the page's from the slop (6 px) while a swipe still counts from 24 px.
- `findsheets.mjs`: the rune stone's "Rub to reveal" goes once the rubbing is read.

Items marked WAITING ON DAN are left out unless the prompt says Dan has answered; say so in your report.

## 1. The hammer game

- **G1. Its buttons under the bar.** At 844 x 390 and 730 x 412 the sheet's "Keep throwing", "Pause" and "Close" sit under the step bar (`.go`): `elementFromPoint` at Pause is `.go-next`, so tapping Pause presses "Next" and the journey leaves the stop. `measure()` in `findhammer.mjs` reserves `COMB.target` under the field but not the bar, and centres the panel in the whole screen. The sheet must sit wholly between the top controls (the review switch) and the bar at every size, its own buttons on top.
  Test: at 844 x 390, 730 x 412, 360 x 640, 412 x 730 and 1440 x 900, open the hammer at a beat where it can be pressed, start a run, and tap each of the sheet's buttons where it is drawn: each does its own job and the journey does not move.
- **G2. The size after a rotation.** Rotated 412 x 730 to 844 x 390 and back with the sheet open, the sheet keeps the previous screen's size: in landscape it runs off the bottom, back in portrait it is about 200 px wide with 6 px text. `findhammer.mjs:159` listens to `resize` before `main.mjs` updates `VIEW`, so `measure()` reads the old size. Measure after the page's own resize (for example on the next frame, or when `VIEW.w`/`VIEW.h` change), so the sheet fits each new size at once.
  Test: open the sheet, rotate both ways twice and resize a desktop window; after each, the sheet's box equals a fresh open's box at that size.
- **G3. Keys after "Keep throwing".** After a click on "Keep throwing", the arrows stop moving the glove and Space switches "Keep throwing" off, because focus stays on that button. The game's keys work whatever control inside the sheet has focus (except Tab, Enter on a focused button, and Escape).
- **G4. Focus on open.** Opening the hammer from the keyboard puts focus on the sheet's top-right Close (`#sheet-dismiss`), so the next Enter closes the game. HAMMER.md puts it on Start. Do that.
- **G5. Tab during a run.** Tabbing to the sheet's Close during a run pauses the run and pulls focus back to Resume. Tab moves on normally; the run pauses only on Pause, P or leaving the sheet.
- **G6. The last heart.** When the last heart goes, the status line says the run is over before it says a heart was lost. The heart first, then the end.
- **G7. The rune choice.** While the rune choice shows, the disabled "Keep throwing" still looks pressed (filled, `aria-pressed` true). It shows as off while disabled, and comes back as it was.

## 2. The hero on small screens

- **G8. Start off screen.** At 360 x 640 the hero's "Start the journey" and Pause sit at y 646, below the screen; at 844 x 390 the name is cut at the top, Start sits on "02 Video", and Motion and UX/UI are off screen. `join.css` forces the hero to the stage's height (`height: 100%; min-height: 0`, JOIN.md 6, "one height"). On the joined page only, and without touching `hero-copy/`: below 680 px tall, the hero's content must fit (name whole, crafts, Start and Pause on screen, nothing overlapping), by scaling or tightening the joined page's own hero box in `join.css` / `join.mjs`. The hero's own page is not changed.
  Test: screenshots at 360 x 640, 375 x 667, 412 x 730, 844 x 390, 730 x 412 and 1440 x 900 after the entrance; every hero control's box inside the screen and none overlapping.

## 3. The wayfinder

- **G9. The result can be read.** Once a craft is picked, its words and the tally ("PRINT: 5 of 6 stops") vanish: `art.mjs` puts `.wf-word` and `.wf-tally` in the `map-tier2` group, which `trip.mjs` (about line 604) hides by `labelFade` when the camera is zoomed out, and `wayResultView` zooms out below that fade. Keep the picked craft's word and its tally visible at the result view, at every size, clear of the drawn lines by 4 px.
- **G10. The marker picks nothing.** Pressing the wayfinder's numbered map marker (1) focuses it with PRINT already picked: `finds.mjs` replays the marker's click on the find with no coordinates, and `findWay`'s `pick(e)` reads (0, 0) as the craft pointing at the screen's top-left corner. A press on the marker (or any replayed press without a position) takes the camera to the wayfinder and picks nothing.
- **G11. The hint after a pick.** After a pick the hint still says "Pick a craft to light the stops that used it." Change it while a craft is picked to say how to pick another or clear it (copy in `data.mjs`; plain words, no em dash).

## 4. Finds and presses

- **G12. A press left behind.** WAITING ON DAN (his question 1: should Next, Back or Top cancel a find pressed during a glide?). Today `findCapture` stores `FD.pendingPress` on any press while the camera moves and `findKitFrame` replays it once no move runs, even after Next, Back, Top, Home, End or a timeline jump, so the camera dives into a find the visitor left behind (at another beat, and a chest digs by itself). If Dan says cancel: any new destination drops the pending press; a press during a glide still opens on arrival when nothing else was asked for (A15).
- **G13. A chest without its card.** Dig a chest out (4 presses), Escape twice, press it and Escape within 150 ms, press it again: it opens with no card. `request()` in `findhoards.mjs` keeps `h.queued` across the overlay epoch change and returns early. A chest that opens always shows its card.
- **G14. Covered finds in landscape.** At the 844 x 390 overview the hammer and the ravens cannot be pressed: the Laurier and HMC stop buttons cover them completely (and at the Mohawk beat the hammer is only reachable at the screen's very edge, x 1). Every find that shows on screen can be pressed somewhere on its drawing at every size: give the stop buttons and the finds room (move the find's hit area or the stop button's box, not the drawings).
- **G15. The rune's carving.** Press another find while the rune stone's carving runs: the stone's red carving stays lit on the map. When the sheet is refused, reset the trace as `onSheetClose` does.
- **G16. Small questions.** WAITING ON DAN: whether a chest keeps its own number on a re-press (today "Hoard 1 of 5" becomes "2 of 5"), and whether the longship counts taps made during a pull (today three quick taps give one pull). Escape's two steps on a held find stay.

## 5. Keyboard and focus

- **G17. A shield goes inert with focus.** Close a stop's card with its x or Escape (focus goes to the shield), then press ArrowRight or PageDown: when the shield leaves the view, `cardsFrame` sets `c.btn.inert` and focus falls to the body. Hand focus to Next (or the new stop's shield) before making a focused shield inert. Same for a shield of another stop focused during a mini-map jump.
- **G18. Timeline taps.** A tap (touch) on a timeline block jumps correctly but leaves focus on the body; a mouse click leaves it on the timeline. Keep focus on the timeline for both.
- **G19. Shift+Space.** With focus on Next (where it sits after pressing it), Shift+Space goes forward: `stepsKey` skips Space on buttons, so the button's own click fires. Shift+Space goes back wherever focus is, at the stops and at the whole map.
- **G20. A hurried move to the map.** Press Next (or Start) at the hero, then Next again during the move: on arrival focus is on the body. `stepsButtons` focuses `.go-next` only on the frame the stepper is shown. Focus lands on Next.
- **G21. The red box after a touch round trip.** After a touch round trip (to the map and back) the hero shows a red focus box around "Start the journey". Hand focus back without a visible ring for touch and mouse (`:focus-visible` rules only for keyboard).
- **G22. Back's name at Interkom.** The Back button's accessible name at Interkom reads "Back: back to HMC" (the Next label's wording reused). It reads "Back: " and the previous stop's name, built the same way as at the other stops.
- **G23. The settled supernova.** At the settled end and in explore, `#nova-hit` has tabIndex -1 and the label "The supernova is building. Press to add a flare.": `main.mjs:176` rewrites both on every frame while `st.rushT > 0`, which is the whole end, over `footer.mjs`'s settled state. Once settled it is in the Tab order with `COPY.nova` ("The supernova. Press to add a flare.").

## 6. The end and explore

- **G24. The bar in landscape.** At 844 x 390 and 730 x 412 the end and explore bar wraps "Back to the top" onto a second row, 370 px wide, over the map's title ("The saga so far"). One row, clear of the title, at every landscape size.
- **G25. The touch hint.** A landscape phone in explore gets the mouse hint "Scroll to zoom. Drag to look around." because the hint is chosen by width. Choose it by input (touch, `pointer: coarse`), not width.
- **G26. Labels after a resize.** Resize the window while zoomed in in explore: every stop name sits over its shield, and "X marks the work" loses its X and its second line, until the next zoom. Place the labels again on resize, as at rest.
- **G27. The X pressed from afar.** WAITING ON DAN (his question 2). Today a press on the X at the overview jumps to the X, and on the way `#go-say` reads "The supernova is building. Press to add a flare.", the bar fades out (`go-leaving`) and focus moves to `#nova-hit` (`stepsButtons` reads a cut landing on the X as the rush). Until he answers: the jump keeps the bar, says "The X", and puts focus on "Dig here".

## 7. Motion

- **G28. A camera that backs up.** At Interkom press Next, Next again mid-glide, then tap Lennard's shield twice while arriving: P stops about 3 units short, runs backwards for 7 frames, then lurches into the stop (real clock too). A press on the arriving stop's shield never turns the camera back; it lands smoothly.
- **G29. The coast at the hand-over.** At the switch (P 100) a third of the east coast appears at once instead of drawing in: its draw-in starts before P 100 while the opaque hero still covers the map. Start the coast's draw-in from nothing at P 100 (or wherever the map first shows), so every part of it draws in.

## Checks

- Time: aim to finish within 2.5 hours. If an item still fails after two real attempts, keep the better attempt, record what is left and move on.
- Real input only: every item's test drives the page in the local headless Edge (127.0.0.1) with CDP input (`Input.dispatchMouseEvent`, `Input.dispatchTouchEvent`, `Input.dispatchKeyEvent`), never by calling the page's functions or dispatching DOM events. Add these tests as `tools/comb-g-*-test.mjs`.
- All tests pass, as in `COMB-F.md`'s Checks. Update tests only where this brief changes what they pin, and say which and why; re-record the `finds-test` digests and the `comb-d-pins-test` / `comb-f-pins-test` pins that change.
- Do not run `tools/frame-cost.mjs` or the cost launchers. Add no per-frame work.
- Screenshots before and after with the local headless Edge at device scale 2 for G1, G2, G8, G9, G14, G24 and G26, at the sizes their tests name.
- The gzip budgets in `tools/check.mjs` hold.

## Rules

- You may write only these files, all under `design/journey-map/`: `findhammer.mjs`, `hammer.mjs`, `findhoards.mjs`, `findsheets.mjs`, `findwater.mjs`, `finds.mjs`, `findkit.mjs` (the pending press for G12 and G13 only), `cards.mjs` (the focus hand-off for G17 and the stop buttons' boxes for G14 only), `steps.mjs` (keys, focus, labels and the move's landing for G19 to G22, G27 and G28 only), `timeline.mjs` (G18 only), `footer.mjs`, `main.mjs` (line 176's nova writes for G23 only), `explore.mjs` (G24 to G26 only), `trip.mjs` (the wayfinder's tier for G9, the labels on resize for G26 and the coast's draw-in for G29 only), `art.mjs`, `data.mjs` (the data and copy of these items only), `map.css`, `join.css` and `join.mjs` (G8 only), the test files in `tools/`, `joined.html`, `dist/journey-map.html` and `dist/journey-joined.html` (these three only through `node tools/pack.mjs` and `node tools/pack-joined.mjs`), and your report `COMB-G-BUILD.md`. The browser's profile, captures and full test logs go only in the run folder your prompt names.
- Never touch `depth.mjs` (not even a comment), `hero-copy/`, the briefs and other build reports, the audits, or anything else outside `design/journey-map/`. HERO-5 (a craft press during the hero's entrance drops focus) is in the hero's own code: leave it.
- Never run git, never install anything, never use the network (the local headless Edge on 127.0.0.1 is not the network), never start reviewer agents or other agents.
- If a rule stops you from doing something this brief asks, leave it out and say so in your report. Do not work around a rule.
- Plain ASCII punctuation in `COMB-G-BUILD.md`.

## Report

`COMB-G-BUILD.md`, short: for each item, what you changed and why, with the before and after screenshots where asked; each test you changed or added and why; one table with the last exit of every test you ran; anything you left out and why (the WAITING ON DAN items included); what the review should look at. Put full test output in a log file in the run folder, not in the report.
