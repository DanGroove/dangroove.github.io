<!-- Opus auditor's delta report on c8c1835 (everything changed since 7d81592), saved from the cloud review; its EV and SRC paths point at that session's scratchpad and are not in the repository. Re-checked in the cloud before queueing: B2b-1 reproduced (412x730 joined: X 1904.78, 1.5 s into the build-up 1942, a second ArrowRight reaches the end 2144.78 within 0.5 s); B2b-2 and B2b-3 seen in the auditor's frames (the map is a blurred raster at +800 ms after a wheel zoom and sharp at +1266 ms; no visible ring on a focused shield). -->

# Behaviour audit B, round 2b (Opus): build c8c1835, changes since 7d81592

Scope: ORIGIN 31112e8, WHIRL 5babf0c, FRAMES 97e7044, WHIRL2 39788a4, trail fix 6d59f14 and GLIDE e7296fe, as packed in c8c1835. Most runs used dist/journey-joined.html. dist/journey-map.html got spot runs only; both pages share this code.

How I tested: Playwright Chromium (swiftshader) with a fake clock set to 2026-11-23T17:00Z and 16 ms frames, network aborted. Dan's phone is 412 x 730 at dpr 2.625 with touch; desktop is 1440 x 900.

Evidence folder (abbreviated EV below): /tmp/claude-0/-home-user/86207fb3-ffda-5f53-a729-f4cab4e14e6f/scratchpad/audit-r2b/opus-behaviour/ (subfolders scripts/, notes/, frames/).

Source folder (abbreviated SRC below): /tmp/claude-0/-home-user/86207fb3-ffda-5f53-a729-f4cab4e14e6f/scratchpad/audit-r2b/build/design/journey-map/

I changed nothing in the worktree, used git only for log, show and diff, and used no network.

## 1. My own questions (32)

Q1. During the 3 s build-up, does a second Next (ArrowRight, ArrowDown, PageDown or Space) let the build-up and blast play, or skip them? -> B2b-1
Q2. During the build-up, does holding a key (auto-repeat), swiping or the wheel move the journey? -> clean (all are ignored after the map)
Q3. Does Back during the build-up turn the whirl round smoothly and land exactly on the X? -> clean
Q4. After Back, does the step bar come back the way it left, with focus where it was? -> clean (0.3 s goReveal fade; focus back on "Dig here")
Q5. Can the build-up be replayed exactly (Dig, Back, Dig gives the same frame at the same time)? -> clean
Q6. Does set(P) to one P mid build-up give the same picture coming from the X and from the end? -> clean
Q7. Is the sky's twinkle continuous on the glide into the X, at rest at the X, and into the build-up, however long the page has been open? -> B2b-6
Q8. With the tab hidden for 5 s mid build-up, does the page pause and resume at the same P? -> clean
Q9. After a rotation mid build-up, mid glide or with a card open, is everything re-placed with nothing stale? -> clean
Q10. Does a press on a closed card's shield answer within 0.1 s? -> B2b-4
Q11. When a card reopens, where does it first appear relative to its shield? -> B2b-4 (queued A10 still applies)
Q12. What does a press on the open card's own shield do? -> B2b-5
Q13. After X or Escape, where does focus land, and can a keyboard visitor see it? -> B2b-3
Q14. With focus on "See the case study", does Escape fold the card and return focus to the shield? -> clean (but the ring is invisible: B2b-3)
Q15. Is the X inert while the card moves or folds? -> clean
Q16. Does any card scroll inside itself, or touch the step bar or the review switch, at nine sizes? -> clean
Q17. Does the tail stay on the shield's rim through open, close, reopen and resize? -> clean
Q18. With reduced motion, are cards whole with no tail and no X, and is the Tab order sensible? -> clean
Q19. On phones, do the whole trail and sea stay through the whirl, and do the trail's dots run into the X before the flash? -> clean
Q20. Do the faint supply stars on phones arrive with no pop and no respawn? -> clean
Q21. In explore after the end, do the gathered stars go home and the other stars keep their map place? -> clean
Q22. After a wheel zoom, a drag fling or a pinch in explore, how soon is the map sharp, with its resting strokes and labels? -> B2b-2 (wheel); clean (pinch)
Q23. Do labels ease back after a gesture rather than snap? -> clean (after a wheel zoom they ease, but late: B2b-2)
Q24. After the one-layer move settles, are shields and finds still pressable where they are drawn? -> clean
Q25. Do GLIDE's change-only writes leave any stale aria-label, hidden, inert or style after resize, Back, explore or reduced motion? -> clean
Q26. Is the live text right after an interrupted move? -> clean ("The X" after Back; "The end of the trail: contact and links" after a hurry)
Q27. If fonts arrive late, do cards re-measure without a jump? -> clean
Q28. Does the hold camera ever move after the card has opened (ORIGIN's rule)? -> clean
Q29. Does ORIGIN's phone glide change (2.6 to 4.4 s, pullback 0.10) make any leg feel slow? -> observation: the longest phone leg is 4.4 s; the change is documented in ORIGIN-BUILD.md
Q30. Does the page log any console error? -> none (only GL ReadPixels and willReadFrequently warnings, caused by my own readbacks)
Q31. Do the repo's own checks pass on the frozen build? -> yes
Q32. Did these changes leave dead code or numbers behind? -> B2b-7

## 2. Inventory (verdict per question group A-M)

Key: p = pass; - = the look auditor's call or not applicable; B2b-n = finding; qAn = queued COMB-A item that still applies.

| # | Element (change) | A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Card opens on arrival, from its shield (ORIGIN) | p | qA10 | - | p | p | - | p | - | p | p | p | qA14 | p |
| 2 | Card closes by X or Escape (ORIGIN) | p | qA10 | - | p | p | - | p | - | p | p | p | B2b-3 | p |
| 3 | Card reopens from its shield (ORIGIN) | p | B2b-4 | - | B2b-4 | B2b-4 | - | p | - | p | p | B2b-4 | p | p |
| 4 | Shield of an open card (ORIGIN) | p | - | - | - | B2b-5 | - | B2b-5 | - | p | p | - | B2b-5 | p |
| 5 | Tail (ORIGIN) | p | p | - | p | p | - | p | - | p | p | p | - | p |
| 6 | X in the card header, 44 px (ORIGIN) | p | p | - | p | p | - | p | - | p | p | p | qA14 | p |
| 7 | Whole cards, compact layout (ORIGIN) | p | - | - | - | p | - | p | - | p | p | - | p | p |
| 8 | Shield button, 400 px box scaled (ORIGIN) | p | p | - | p | p | - | p | - | qA17 | p | p | B2b-3 | p |
| 9 | Hold anchor and phone glides (ORIGIN) | p | p | - | p | p | - | p | - | p | p | p | - | p |
| 10 | Reduced-motion stacked cards (ORIGIN) | p | p | - | p | p | - | p | - | p | p | p | p | p |
| 11 | Sky twinkle into and at the X (WHIRL) | p | - | - | B2b-6 | - | - | p | - | - | B2b-6 | B2b-6 | - | p |
| 12 | 3 s build-up whirl, 12 sectors (WHIRL, WHIRL2) | p | p | - | p | p | - | p | - | p | B2b-1 | p | qA11 | p |
| 13 | Trail dots run into the X (6d59f14) | p | p | - | p | - | - | p | - | p | p | p | - | p |
| 14 | Supply sky stars on phones (WHIRL2) | p | p | - | p | - | - | p | - | p | p | p | - | p |
| 15 | Blast, settle, end | p | p | - | p | p | - | p | - | p | B2b-1 | p | qA11 | p |
| 16 | Step bar around the build-up | p | qA9 | - | p | p | - | p | - | p | p | p | qA11 | p |
| 17 | Keys during the rush | - | - | - | B2b-1 | B2b-1 | - | - | - | - | B2b-1 | - | B2b-1 | p |
| 18 | Explore one-layer move and label settle (FRAMES) | p | p | B2b-2 | B2b-2 | p | - | p | - | p | p | B2b-2 | - | p |
| 19 | Stars home in explore (WHIRL, 6d59f14) | p | p | - | p | - | - | p | - | p | p | p | - | p |
| 20 | Shields and finds in explore | p | p | - | p | p | - | p | - | qA17 | p | p | p | p |
| 21 | Change-only writes (GLIDE) | p | p | - | p | p | - | p | - | p | p | p | p | p |
| 22 | Live text and names | p | - | - | - | p | - | p | - | - | p | - | p | p |

## 3. Findings (most visible first)

### B2b-1. A second Next during the build-up skips the build-up and the whole blast (fix now)

- **Where:** both pages and every size, because it is one key handler. Measured at 412 x 730 on the joined page: X beat, then Dig, then the 3 s build-up.
- **What is wrong:** a second ArrowRight 1.5 s into the build-up turns the X-to-end move into a hurry.
  - P went 1942.45, then 1958.5 (+100 ms), 2031.5 (+200), 2105.8 (+300), 2142.5 (+400), and reached the end at 2144.78 (+500).
  - So the rest of the build-up, the flash, the blast and the settle all pass in about 0.4 s, and the visitor lands on the end screen.
  - It works the same way with ArrowDown, PageDown and Space, and by the same code path during the blast and settle (not filmed).
  - Mouse and touch cannot do it: the bar is hidden, swipes and the wheel are ignored after the map, and auto-repeat is ignored.
  - WHIRL2's 3 s build-up widened the window for this. It is not queued.
  - Queued A11 moves focus to #nova-hit, and Space on that button is already excluded. Arrow keys and PageDown would still hurry.
- **Questions:** D24, E30, J56, K58.
- **Steps to see it:**
  1. Run go('x', {instant:true}) and wait 2 s.
  2. Press ArrowRight.
  3. After 1.5 s, press ArrowRight again.
- **Evidence:**
  - EV/notes/rush-interact-dan.txt (run2)
  - EV/frames/sheet-rushi-next2.jpg
  - EV/frames/rushi-dan-j/next2-200.png, next2-400.png, next2-600.png
  - EV/scripts/rush-interact.js
- **How bad:** fix now. One natural double press removes the page's signature moment.
- **Fix:** in SRC/steps.mjs, stepsNext (line 225) and stepsPlay (122-125), where `stepsCarry(SC.move, p, next && ...)` makes the hurry. While tripState(SC.P).kind is rush, blast or settle, a Next key does not hurry. Either ignore it or send it to the nova's flare, matching "presses on it stack flares". Home and End stay explicit jumps. Queued A19 (a second Back hurries) needs the same guard.

### B2b-2. After a desktop wheel zoom in explore, the map stays soft and fat-stroked for about 0.6 s after it stops, then pops sharp (fix now)

- **Where:** both pages, 1440 x 900. End, then "Explore the map", then six wheel ticks of -120 at 40 ms.
- **What is wrong:** FRAMES holds #map under a CSS matrix while st.exploreMoving. That flag stays true until the camera equals its target exactly. The snap only happens when s, tx and ty are all within DEPTH.epsilon (0.01 px) of the target, and with EXPLORE.ease 0.12 that takes a long time. Measured after the last wheel tick:
  - motion falls below 0.5 px per frame at 688 ms;
  - the raster hold clears at 1264 ms;
  - labels reach their final size at 1376 ms.
- **What the visitor sees:** between about 0.7 and 1.26 s the map is still but is a blurred raster at about 3x scale: strokes about 3x thick and soft, the trail's dots merged into a fuzzy line, the rune stone's writing illegible. Then it pops to crisp thin strokes and the labels re-size. FRAMES.md line 39 requires the map to be "sharp again within 150 ms of the gesture ending". The repo's checks pass, so they do not test this case.
- **Related measurements:**
  - A drag fling holds the raster until 2192 ms (motion under 0.5 px from 592 ms). That is not visibly soft, because a pan does not rescale.
  - The phone pinch settles in one frame, and labels ease from 1.78 to 1 over about 120 ms (pass).
  - Keyboard zoom (EXPLORE.key) probably behaves the same; not measured.
- **Questions:** C20, D22, K58.
- **Evidence:**
  - EV/notes/explore2-d1440.txt
  - EV/frames/sheet-explore2-hold-800-vs-rest.png
  - EV/frames/explore2-d1440-j/wheel-800.png
  - EV/frames/explore-d1440-j/04-zoomed-rest.png
  - EV/frames/sheet-explore-settle.jpg
  - EV/notes/explore-d1440.txt: its "after release" rows past 16 ms are really at cumulative 66, 116, 166, 216 and 266 ms.
  - EV/notes/explore-dan.txt (pinch)
- **How bad:** fix now. It is FRAMES's own gate, and it shows on every desktop wheel zoom.
- **Fix:** in SRC/explore.mjs:
  - Line 134: snap cam = target once the remaining motion is below a screen threshold (about 0.25 px in tx and ty, and |ds|/s < 1e-4) instead of DEPTH.epsilon.
  - Line 140: base exploreMoving on that same threshold.
  - Line 31: give the fling's velocity cut a px/s floor.

### B2b-3. A shield's focus ring is 0.1 to 0.2 px wide, so it is invisible (fix now)

- **Where:** both pages and every size. It shows wherever focus is on a shield: Tab at the overview, at a stop after X or Escape (cardsClose moves focus to the shield), and in explore.
- **What is wrong:** .st-btn is a 400 px box scaled by stonePx / MARK.box. The global 2 px outline (SRC/map.css:8) is scaled with it:
  - 2 x 34.3 / 400 = 0.17 px on desktop;
  - 2 x 22.2 / 400 = 0.11 px on Dan's phone.
- **History:** this already existed in kind before ORIGIN, because the whole stop used to be scaled by k of about 0.1. ORIGIN's new box keeps the problem. No queued item covers it: A14 covers only the X's ring, and A17 only the target size.
- **Questions:** L59, B12.
- **Steps to see it:** go('laurier'), Tab to the X, press Enter. Focus is on the shield, but no ring shows.
- **Evidence:**
  - EV/frames/sheet-shield-focus.png
  - EV/frames/shield-focus-crop.png
  - EV/notes/cards2-d1440.txt ("after Enter on X")
  - EV/notes/cards1-dan.txt
- **How bad:** fix now. The control that focus lands on has no visible focus (WCAG 2.4.7).
- **Fix:** draw a ring at screen size, either way:
  - `.st-btn:focus-visible` with an outline width of 2px x MARK.box / stonePx, written with cardsStyle in SRC/cards.mjs (the transform write is about line 120); or
  - a ring in the shield's SVG with vector-effect: non-scaling-stroke, like `.find:focus-visible .hit` (map.css:30).

  Build it with A17's hit padding, so the ring circles the drawn shield.

### B2b-4. Reopening a card from its shield shows nothing for about 0.2 s, then the card appears away from the shield (polish; extends queued A10)

- **Where:** both pages and every size. Close a card with X or Escape, then press the shield or press Enter on it.
- **What is wrong:** the grow starts at the shield's scale, k0 = stonePx / max(W, H), about 0.054. The face and tail stay at opacity 0 until k reaches 0.12 (CARD_GROW.face, SRC/data.mjs:311; SRC/cards.mjs:119).
  - **Desktop:** the face width stays flat until about 144 ms, the face is faint at about 192 ms (88 px wide), opaque at about 240 ms and full at about 330 ms.
  - **Phone:** frames from 50 to 200 ms after the tap are identical to the frame before it. At 250 ms a card about 85 px wide appears, about 40 px below the shield.
  - Where it appears follows from k = k0^(1-e): about 60 px clear of the rim on desktop, and about 35 px on the phone.
- **Relation to queued A10:** this is A10's complaint ("appears there", "fades out about 100 px short") and it still holds after ORIGIN. A10 is not made unneeded. Add to it: a visible answer within 0.1 s of a press on the shield. On first arrival the glide hides this delay.
- **Questions:** E32, D24, K58.
- **Evidence:**
  - EV/notes/cards2-d1440.txt ("reopen by Enter: face width per 16 ms")
  - EV/frames/sheet-cards-dan-reopen.jpg
  - EV/frames/cards-dan-j/d0050.png to d0250.png
- **How bad:** polish.
- **Fix:** let the position lead and the size lag (as A10 says), and start the face's opacity ramp at k0 instead of 0.12. Alternatively, give the shield an immediate pressed state (c.glow) within 0.1 s.

### B2b-5. Pressing the open card's own shield does nothing, and focus drops to the page (polish)

- **Where:** both pages, any stop with its card open.
- **What is wrong:** the shield has pointer-events only at rest (SRC/map.css:44). With the card open, the press falls through to a map path, shows the default cursor, and focus goes to BODY.
  - The card grows from this shield and its tail points at it, so visitors expect it to fold the card.
  - When the card is closed at its own stop, the shield is still named "Go to Wilfrid Laurier University, 2016 to 2017", but pressing it reopens the card.
- **Questions:** E29, E30, G42, L59.
- **Steps to see it:** go('laurier'), then click the shield at the root of the tail.
- **Evidence:**
  - EV/notes/cards2-d1440.txt ("element under the open card shield: path", "after clicking the open shield")
  - EV/frames/shield-open-crop.png
  - EV/frames/cards2-d1440-j/
- **How bad:** polish.
- **Fix:** make the shield a toggle. Give it pointer-events in the open state too, and have a press call cardsClose(i) (SRC/cards.mjs:75). Name it "Close the <place> card" while the card is open, and "Open the <place> card" when its card is closed at its own stop.

### B2b-6. The twinkle clock rewinds over the last 20 % of the glide into the X, and the sky is frozen at the X (polish, low)

- **Where:** both pages and every size. Measured at 1440 x 900 on the Lennard-to-X glide and at rest at the X.
- **What is wrong:** SRC/stars.mjs:303 sets `twinkleTime = time * (1 - smooth(...twinkleHome [0.8, 1], legXT))`, then rushT * pace from start.a. This came in with WHIRL 5babf0c.
  - After 4 minutes on the page, about 246 s of twinkle sweeps by in the last 13 frames (about 0.2 s). The frame-to-frame alpha change in a sky band doubles against a 5-second visit (10 to 16 per frame instead of 6 to 8), so the stars shimmer as the camera arrives. I measured this in numbers only, not seen in a frame.
  - At rest the sky band changes by 0.0 per second at the X, against 0.9 to 1.3 per second at Lennard, so the sky is frozen at the beat where the visitor waits.
- **Questions:** D22, D26, K58.
- **Evidence:**
  - EV/notes/strobe-ff0.txt and EV/notes/strobe-ff240.txt (columns: frame, P, alpha change, alpha sum, page time)
  - EV/notes/skyrest-d1440.txt
  - EV/scripts/strobe2.js and EV/scripts/skyrest.js
- **How bad:** polish, low.
- **Fix:** keep the live clock to the X and at the X. At Dig, blend from the live twinkle to the deterministic rush twinkle over the first 0.3 s of the build-up. Alternatively, fade only the twinkle's amplitude over twinkleHome rather than rewinding its clock. Either keeps replays exact.

### B2b-7. Leftovers (leave)

- NOVA.build.core[1] (13) is never read: SRC/trip.mjs:27 uses only core[0] and core[2] (SRC/data.mjs:374).
- Cards never scroll now, so stepsCanScroll (SRC/steps.mjs:291 and 296) and the '.face' exclusion in stepsTouchExcluded (313) are dead.
- At rest at the X, SK.rushPlan is rebuilt on every star frame (SRC/stars.mjs:293, because rushT === 0). That means every frame while the mouse moves, and 12 per second when idle. There is no visible effect.
- ORIGIN changed the phone glides (secondsPhone [2.6, 4.4], zoomOutPhone 0.10) outside its brief's letter. It is documented in ORIGIN-BUILD.md and fine.

### Queued items this build changes

- **A10:** still needed. Add the 0.1 s answer (B2b-4).
- **A9:** only the bar's exit at Dig is still a one-frame cut. Its return after Back already fades over 0.3 s and puts focus back on "Dig here" (EV/notes/barback-dan.txt).
- **A11:** must also stop arrow keys and PageDown from hurrying the rush (B2b-1).
- **A19:** needs the same no-hurry guard inside the rush (B2b-1).
- **A13:** still applies. With the Laurier card open, Tab goes Back, Next, then four finds before the card's X and case study (EV/notes/cards2-d1440.txt).
- **A14 / A17:** the shield ring (B2b-3) belongs with them.

## 4. The walk (fake-clock segments, times measured from each press)

**Phone, 412 x 730, joined page**

1. **Set out:** the map-to-Laurier glide takes about 4 s. The card grows in the last moment, and the camera is still once the card is open.
   - The sheet is at y 385-672, the shield is 22 px and centred above it, and the tail is attached. There is no scrolling.
2. **X (44 px):** the face is gone by about 0.3 s and the fold takes 0.45 s. Focus goes to the shield, which has no visible ring (B2b-3).
3. **Tap the shield:** 0 to 0.2 s nothing happens. At 0.25 s a small card appears; it is full at 0.4 s (B2b-4).
4. **Next to the X:** glides take 2.6 to 4.4 s.
5. **Dig:** a 3 s build-up with a 12-sector whirl. The whole trail and sea are visible and the dots run into the X. Then the flash, the blast and the settle, and the end at about 5.4 s.
6. **Back at 1.5 s into the build-up:** it turns at once, is home at the X at 0.85 s, the bar fades back in, and focus goes back to "Dig here".
7. **Next at 1.5 s instead (keyboard):** the end arrives at 0.5 s (B2b-1).
8. **Explore pinch:** sharp in one frame.
9. **Rotation to 390 x 844** (card open, mid glide, mid build-up): all re-placed.
10. **Reduced motion:** whole stacked cards.

**Desktop, 1440 x 900**

1. **Laurier:** shield at the left (34 px), a 40 px tail, and the card centred.
2. **Tab:** Back, Next, four finds (A13), then the X and the case study.
3. **Enter on X:** focus moves to an invisible ring (B2b-3).
4. **Enter on the shield:** the card is invisible for 0 to 190 ms and open at about 330 ms; focus goes to the X.
5. **Click the open shield:** nothing happens, and focus drops to the page (B2b-5).
6. **Escape from the case study:** folds the card, and focus goes to the shield.
7. **Resize to 1024 x 600 and back while held:** exact.
8. **Lennard to X after 4 minutes on the page:** the sky shimmers for about 0.2 s, then is frozen at the X (B2b-6).
9. **Dig:** build-up, blast, end.
10. **Explore, wheel zoom:** still at 0.7 s, soft until 1.26 s, labels done at 1.38 s (B2b-2).
11. **Drag fling:** the hold lasts until 2.19 s, not visibly soft.
12. **Shields in explore:** they hit-test on the shield itself.

## 5. Checked clean, and what I could not check

**Checked clean**

- **Repo tools, run read-only:** check, steps-test, nova-test, layout-test, motion-test, whirl2-test and frame-render-test all exit 0.
- **Build-up (Q3-Q6):**
  - Replay is exact; only the clock-driven depth ripples and the ship differ (EV/frames/rushi-run1-vs-run2.png).
  - set(P) gives the same picture from the X and from the end.
  - Back mid build-up settles exactly at P 1904.7776.
- **Tab hidden mid build-up:** P stays frozen and resumes from the same value.
- **Resize:** mid card, mid glide and mid build-up all re-place correctly (EV/notes/resize-dan.txt). Its 100 ms row is a fake-clock artifact: the resize event had not been delivered yet.
- **Reduced-motion cards:** EV/notes/rm-dan.txt.
- **Card fit, no inner scroll, clear of the bar and the review switch:** at 1366 x 768, 1280 x 800, 1536 x 864, 1024 x 600, 375 x 667 and 320 x 568 (EV/notes/fit.txt), plus 412 x 730 and 390 x 844.
- **Phone pinch settle.**
- **Fonts:** they settle before start, and loadingdone runs resize.
- **Console:** no page errors.
- **GLIDE writes:** they compare live values, and I found nothing stale.
- **Moving and inert rules:** Escape is ignored while moving, and the X is inert while moving or folding.

**Could not check**

- A real phone GPU, including softness on real compositors and Dan's phone lag.
- Screen readers. I read only names and live text from the DOM.
- Landscape 844 x 390 (queued A30).
- A one-finger fling on the phone: my synthetic drag did not pan.
- Leaving explore by its Back button. Arrow keys do not leave explore, so this was not filmed.
- A second Next during the blast and settle on film; it uses the same code path as B2b-1.
- A full walk of the map page.
- A side-by-side with version 14.
- Sky cover above 1440 px.

## 6. Top findings (under 300 words)

1. **B2b-1 (fix now):** during the 3 s build-up, a second ArrowRight, ArrowDown, PageDown or Space hurries the move. The rest of the build-up, the flash, the blast and the settle pass in about 0.4 s and the visitor lands on the end. It is keyboard only, it is not queued, and queued A11 alone does not stop it. Fix: no hurry while P is in the rush, blast or settle (steps.mjs stepsNext/stepsPlay), and the same guard for queued A19.
2. **B2b-2 (fix now):** after a desktop wheel zoom in explore, the map is still by 0.69 s but stays a blurred raster at about 3x scale until 1.26 s, then pops sharp; labels finish at 1.38 s. FRAMES required sharp within 150 ms. The cause is an exact-equality exploreMoving test and a 0.01 snap with a 0.12 s ease (explore.mjs:134 and 140). The pinch is fine.
3. **B2b-3 (fix now):** a shield's focus ring is scaled with the 400 px button down to 0.1 to 0.2 px, so it is invisible. Focus lands there after every X or Escape. It is not queued.
4. **B2b-4 (polish):** reopening a card from its shield shows nothing for about 0.2 s, then the card appears 35 to 60 px from the rim. Queued A10 still applies after ORIGIN; add a visible answer within 0.1 s.
5. **B2b-5 (polish):** a press on the open card's own shield does nothing and drops focus to the page. Make the shield a toggle with a matching name.
6. **B2b-6 (polish, low):** the twinkle clock rewinds over the last 20 % of the glide into the X, so the stars shimmer after long visits, and the sky is frozen at the X beat.

**Queued items:** A9's return path already works (the bar fades back and focus returns), so A9 needs only the exit. A13 still applies.
