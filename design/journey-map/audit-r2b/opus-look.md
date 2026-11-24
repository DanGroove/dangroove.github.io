<!-- Opus auditor's delta look report on c8c1835 (everything changed since 7d81592), saved from the cloud review; its evidence paths point at that session's scratchpad and are not in the repository. Seen in the cloud before queueing: L2b-1 (pinch frames heavy with the trail fused, snapping thin at release; the opening hairline then heavy), L2b-2 (the phone tail's point over the red traveller), L2b-3 (the tail darkening into the card's edge on Interkom and Lennard), L2b-4 (a faint card about 60 px from the shield joined by a needle at 231-330 ms), L2b-6 (Mohawk's black tail on the ink map). -->

# Look audit L, round 2b (Opus): journey map at c8c1835, compared with v14 (aadb2f7)

How I looked: Playwright Chromium (swiftshader) with the fake clock as briefed. Films at 33 to 300 ms steps, at 412x730 dpr 2.625 with touch (Dan's phone), 390x844, 360x640, 1024x600 and 1440x900, plus stills at 1280x720, 820x1180 and 844x390. I put v14 next to the new build with git show. In 35+ runs there were no console errors and no network requests.

Evidence folder (EV below): /tmp/claude-0/-home-user/86207fb3-ffda-5f53-a729-f4cab4e14e6f/scratchpad/audit-r2b/opus-look. It holds frames/<run>/*.png, sheets/*.png, the logs at its top level, and scripts/.

## 1. My own questions (33)

ORIGIN (cards, tails, shields)
- Q1. When the card is first visible, where is it relative to its shield? Does it come out of the shield or appear in mid-air?
- Q2. Is the tail ever longer or thinner than at rest during the open or the close? In other words, does it stretch?
- Q3. Is the tail's colour continuous with the card edge it leaves from, with no seam, shadow band or gap, at 1x and 2x?
- Q4. Does the tail's point stay on the shield's rim at rest, mid-open, mid-close and while the face tilts?
- Q5. Does the tail cover anything that matters: the traveller, a label, a find, the beacon?
- Q6. Can you see the tail against the ink map for every palette: black Mohawk, navy HMC, purple Laurier, cream Interkom, orange Lennard?
- Q7. Is the tail's base in proportion to the shield it points at, at every size and so at every shield size?
- Q8. Do the three-colour shields read as Viking shields (not beach balls, pie charts or targets) at 12-36 px and in explore?
- Q9. Does the paint fade in with the first open and out on Back, never popping? Does the mini-map dot follow in step?
- Q10. Does the X inside the header line up with the date pill, carry the header's colour and arrive with the words, never alone?
- Q11. Does every card fit with no inner scroll at all seven sizes plus 844x390, clear of the step bar, review switch and timeline?
- Q12. Is the compact type (crafts, kicker) still legible, and does it form one system with the roomy layout?
- Q13. Does the camera put the shield at the same point after a glide, Back, a jump and a reopen, with nothing moving after the open?
- Q14. On a phone, the open sheet covers the timeline and the find counter. Is that sensible?
- Q15. Do closing by the X, Back, Next and the shield all fold the card the same way into the shield?

WHIRL, WHIRL2 and the trail fix
- Q16. Do stars gather from every side at once (no quiet quadrant), and does the whirl speed up smoothly into the blast with no pause or step?
- Q17. Does every trail dot stay on its route while it runs into the X, with none sliding off as the camera re-centres?
- Q18. After the dots have run in, what is left of the trail (the solid done-line), and does it make sense until the blast?
- Q19. Do the stars that do not gather stay fixed to the map while the camera centres the X?
- Q20. Are the phones' supply sky stars faint enough to read as sky rather than noise, and do they go with the blast?
- Q21. At 360 px wide, can you read the X's compression, white cross and tremble through the whirl?
- Q22. What else is on screen during the rush (legend, wayfinder words, step bar, timeline)? Does it leave, or does it compete?
- Q23. Is the end view clean after the flash, with no leftover trail line, stars or legend?

FRAMES
- Q24. During a pinch, a wheel zoom and the explore opening, do strokes keep their weight and labels their size, or does the map read as a stretched picture?
- Q25. How long after the last input is the map sharp again, and does anything snap at that moment (line weight, label tier, text sharpness)?
- Q26. During drag and fling, do the layers outside the SVG (stars canvas, find markers, labels) stay locked to the map?
- Q27. Is a drag or a fling (translation only) as crisp as the map at rest?

GLIDE
- Q28. After a full round trip (end, explore, Back to the top, stops again), is every stop the same as on a fresh load, with no stale cached write?
- Q29. Are the overview and the hand-over unchanged against v14, measured in pixels?

Whole journey
- Q30. On a 4 s phone glide that ends in a card opening, where does the eye go: the moving map, the shield or the card?
- Q31. Does Back un-paint a shield in step with the trail retracting?
- Q32. In reduced motion, do the cards keep the new design (no scroll, X inside the header, painted shields) without a tail?
- Q33. At 844x390, does the pair (shield, tail, card) still fit, or does something give?

## 2. Inventory, with a verdict per question group (A-M of AUDIT-R2.md)

Key: ok = checked and clean. L2b-n = my finding. Ax = already queued in COMB-A (not re-reported). pre = unchanged from v14 and outside these changes. nc = not checked (B auditor's depth). Groups not named for a row are ok or do not apply.

ORIGIN
1. Stop card, desktop pair (1440x900, 1280x720, 1024x600, 820x1180): A ok, B L2b-4 (with A10), C ok, D L2b-4, E ok, F ok, G ok, H ok, I ok (scrollHeight = clientHeight, clear of the step bar and the review switch), J ok (closing by X, Back, Next and shield fold alike; reopen is symmetric), K ok, L nc, M ok (the card is the object that moves; nothing respawns).
2. Stop card, phone sheet (412x730, 390x844, 360x640): A ok, B L2b-4, D L2b-4, F L2b-10, G ok, H ok, I ok (fits at all three; covering the timeline and the found counter is pre), J ok, M ok.
3. Compact layout (phones, 1024x600, 1280x720, 844x390): F L2b-10 (9 px), I ok except 844x390 (L2b-8).
4. Card at 844x390: I L2b-8 (A30). The other groups are as in row 1.
5. Tail, desktop: A ok (reads as a callout pointer), B L2b-4, C L2b-3 (shadow band) and L2b-5 (wide base on small shields), D L2b-4, G ok (point on the rim at rest, mid-move and through tilt), H L2b-6.
6. Tail, phone: B L2b-4, C L2b-5, G L2b-2 (covers the traveller), H L2b-6 (Mohawk).
7. Card drop shadow (.c-sh): C L2b-3.
8. X inside the header: B ok (arrives with the words), C ok (aligned with the pill, in the header colour), E ok (44 px target), I ok.
9. Painted shields (A/B quarters, C boss): A ok, B ok (0.4 s fade in on the first open, fade out on Back as the trail retracts, per ORIGIN section 4), C ok at 1x, 2x and in explore, H ok on ink, I ok. Interkom placement is L2b-7.
10. Unvisited shields: ok, unchanged.
11. Mini-map stop dots (quartered paint): B ok (follow the paint), C L2b-11.
12. Traveller (red star and glow) at an open stop: G and H L2b-2 on phones. Desktop ok.
13. Labels beside a card: G A3 (queued: labels show through the growing card on phone and desktop), otherwise ok.
14. Hold camera (shield at the pair point): D ok (the shield's rectangle stays constant from the open to +1.5 s; Back and reopen land on the same point), J ok.
15. Step bar and review switch beside a card: I ok at seven sizes, L2b-8 at 844x390.
16. Beacon find at Interkom: C L2b-7.
17. Reduced-motion cards: A ok, I ok (scrollHeight = clientHeight, no tail), J ok (scroll positions identical to v14).

WHIRL, WHIRL2 and the trail fix
18. Gathering stars: A ok, C ok, D ok (from every side from about 0.2 s, accelerating, no pause or step), F ok, M62 ok (rhythm in light only).
19. Supply sky stars (joined, phones): C ok (faint, read as sky), B ok (gone with the blast).
20. Stars that do not gather: G ok (keep their map place while the camera centres the X).
21. Trail dots running in: G ok (on route, nearest first, last at the blast), D ok.
22. Trail done-line (solid) after the dots: A ok (reads as a lit fuse to the X), B ok (goes with the blast).
23. X compression, white cross, tremble: ok at 360 to 1440.
24. "X marks the work": ok (fades before the flash).
25. Legend on phones during the rush and blast: F L2b-9 (A25 incomplete).
26. Wayfinder word and marker cut at the left edge (VIDEO, 1) during the rush: A27 (queued).
27. Timeline and step bar leaving at "Dig here": B ok (fade). The step bar's cut is A9 (queued).
28. Rush camera re-centre: D ok.
29. Blast (flash, ring, streaks) and the end view: ok. The remnant is A31 (queued).

FRAMES
30. Explore opening zoom-out: C, D and F L2b-1.
31. Wheel zoom (desktop): C, D, F and K L2b-1.
32. Pinch zoom (phone): C and D L2b-1, K ok (sharp within 50 ms of release).
33. Drag and fling: C ok (crisp), D ok, G ok (stars, find markers and labels stay locked).
34. Labels settling after motion: D and F L2b-1.

GLIDE
35. Stop-to-stop glides, phone and desktop: D ok (one eased move of about 4.05 s per Next).
36. Back glide (hmc1 to Laurier): ok. The card folds in 0.3 s, the paint fades over 0.45 s, Laurier reopens at 4.05 s.
37. Round-trip state: J ok (same as a fresh load; 48 px differ, all in the Next arrow's idle nudge).
38. Overview and hand-over: G ok (unchanged against v14). The black gap is A32 (queued).

## 3. Findings, most visible first

### L2b-1. Explore draws the map as a stretched picture whenever the zoom changes, then snaps. FIX NOW.

- Where: both pages, every size, in explore only. It shows in the opening zoom-out after "Explore the map" (every visitor who explores sees it), in every desktop wheel zoom and in every phone pinch.
- What is wrong: FRAMES moves the map SVG as one CSS-scaled layer, scaled from the camera at the start of the motion, and holds #cam and the labels until the camera is exactly at its target.
  - That is right for a drag, which only translates.
  - When the scale changes, the weights go wrong. Zooming in, every constant-width stroke thickens with the scale: 1.78x after three wheel notches, about 3x in a pinch. Coasts and the frame go heavy, the dotted trail fuses into a solid bar, the rune glyphs blob, label text swells and goes soft, and the labels the new zoom should add are missing.
  - Zooming out (the opening is a 0.31 CSS scale), strokes thin to hairlines and the beat's labels shrink to specks.
  - At the settle everything changes in one frame. Line weights jump (about 3.2x heavier at the end of the opening), label tiers appear or vanish over only 0.12 s, and soft text turns crisp.
  - v14 kept weights and label tiers live through the same moves.
- Timing (EV/wheelprobe.log):
  - The opening stays composited from 100 to 1500 ms; #cam is written at about 1550 ms.
  - Three wheel notches stay composited until about 1250 ms, although after 800 ms the scale changes by less than 0.1 % (1.7779, then 1.7789). The cause is in explore.mjs: motion only ends when EX.cam equals EX.target exactly.
  - A phone pinch snaps within 50 ms of release, but the whole pinch is drawn heavy.
- Questions: C15, C19, C20, D22, F38, K58. It also breaks FRAMES.md's own acceptance: "sharp again within 150 ms of the gesture ending" and labels "must ease back, never snap". FRAMES-BUILD.md says those device gates were never run.
- Steps to see it:
  - journey-map.html at 1440x900: reach the end and press "Explore the map". The map goes hairline, then jumps to bold at about 1.6 s.
  - Give the wheel three notches: about 1.3 s of blurred, heavy lines with no small labels, then a snap.
  - Phone: pinch out and hold. The lines go heavy and the trail turns solid; release and it snaps.
- Evidence: EV/sheets/ex1440j-open.png, ex1440j-openzoom.png, ex1440j-wheel.png, ex1440j-wheelzoom.png, ex412j-pinch.png, ex412j-pinchsnap.png; v14: EV/sheets/ex1440v14-zoom.png; drag is fine: EV/sheets/ex1440j-drag.png. Frames EV/frames/ex1440j/open-1200.png, open-1500.png, open-1800.png, wheel-0200.png to wheel-0900.png and wheel-rest.png; EV/frames/ex412j/pinch-8.png, pinchend-0000.png and pinchend-0050.png. Log EV/wheelprobe.log.
- Fix, in trip.mjs tripApply (the moving branch, lines 314-326: `tripWrite(E.svg, 'transform', matrix(k,...))`, which holds #cam and the labels) and explore.mjs line 140 (`st.exploreMoving = ...`):
  1. The scripted opening (EX.motion) is not a gesture. Drive it through #cam as v14 did.
  2. During a gesture, composite translation only. Re-write #cam (one re-raster) whenever the composited scale leaves about 0.85-1.18, so weights are never more than about 15 % off.
  3. End the motion on an epsilon (0.1 px and 0.1 % scale) rather than exact equality.
  4. At the settle, let labels ease over 0.25-0.3 s (data.mjs FRAME_PERF.labelSettle, now 0.12).

### L2b-2. On phones the tail's point hides the red traveller under every open shield. FIX NOW (small).

- Where: both pages, 412x730, 390x844 and 360x640, every stop with its card open (Dan's phone).
- What is wrong: the phone tail runs up from the sheet to the shield's lower rim, which is exactly where the traveller stands (the red four-point star and its glow, drawn on the #stars canvas below the stop layer). With the card open the star disappears under the tail, and its glow leaks out on both sides as a red smudge. The one Red mark on screen becomes a stain beside the shield. With the card closed, the traveller is back.
- Questions: G42, H47, C17.
- Steps: 412x730, Next to Laurier, look just under the shield. Close the card with its X and compare.
- Evidence: EV/sheets/laurier412-tail.png; card closed, for comparison: EV/sheets/laurier412-closed-tail.png; EV/sheets/hmc412-tail.png; EV/sheets/mohawk412-tail.png.
- Fix: stars.mjs, the traveller draw (lines 425-436). On phones, while a card is open, fade the traveller and its glow out with the tail's opacity (the shield already marks the place). Or stand it on the side of the shield away from the tail for the hold.

### L2b-3. On desktop the card's drop shadow lies over its tail, so every tail goes dark where it meets the card. FIX NOW.

- Where: both pages, the pair layout (1440x900, 1280x720, 1024x600, 820x1180, 844x390), all six cards, at rest and through the open, the close and the tilt.
- What is wrong: the shadow element .c-sh sits inside .c-card (z 2), above the tail (.c-tail, z 1). Its box-shadow blur (cards.mjs line 70) covers the last third of the tail. The wedge fades from its colour to a brown-black band at the card's edge, so it reads as a separate piece in the shade, not the card's own edge drawn out to the shield. ORIGIN asked for the tail to be "the colour of the card edge it leaves from" with "No shadow of its own". It is worst on the light grounds, Interkom cream and Lennard orange.
- Questions: C17, C20, G42.
- Steps: 1440x900, Next to any stop, look where the tail meets the card's left edge.
- Evidence: EV/sheets/tail2x.png, tail2x-interkom-rest.png, tail2x-lennard-rest.png, tails1440.png; frames in EV/frames/stops1440j/.
- Fix: in cards.mjs, move .c-sh out of .c-card (markup at line 37; styles at lines 70 and 131-132) into a sibling painted below the tail, so the order is shadow, then tail, then face. Or clip the shadow away on the tail's side. map.css lines 54 and 405-406.

### L2b-4. The tail stretches into a long needle while the card opens and closes. POLISH; also makes queued A10 incomplete.

- Where: both pages, every card, every size.
- What is wrong: the card only becomes visible once it is already away from its shield (A10), and the tail bridges the gap.
  - Desktop opening: between 198 and 363 ms the tail is 61-113 px long and 5-12 px wide, at full opacity. At rest it is 38 by 28.
  - Phone opening: 28-47 px long and 4-8 px wide (rest 14 by 24). On Laurier it is a white stem, because the phone tail takes the band colour.
  - Closing mirrors it: phone 14 to 47 px, desktop 38 to 112 px.
  - ORIGIN wanted a tail that "grows with the card from zero length". Instead it overshoots to about 3x its rest length first.
- Note on A10: once A10 brings the card's centre into the shield while it is visible, the card's box will cover the shield near the end of a close, and the tail length goes to zero or below. A10 should also say that the tail never exceeds its rest length, grows and shrinks monotonically with the card, and hides (rather than flips) while the shield is inside the card's box.
- Questions: D21, D28, C13.
- Evidence: EV/sheets/open1440j.png, open412j.png, card1440j-open-needle.png, card412j-closex.png, card1440j-closex.png; logs EV/open1440j.log, EV/open412j.log, EV/card412j.log, EV/card1440j.log.
- Fix: cards.mjs cardsTailFrame (line 151). Length = min(the measured gap, CARD_TAIL.len or lenPhone times the open fraction). Base = the base times the card's scale. Do this along with A10.

### L2b-5. The tail's base is a fixed number of pixels while the shield shrinks, so on small shields the wedge becomes a cone. POLISH.

- Where: 1024x600: 17 px shield, 28 px base. 844x390: 12 px shield, 28 px base. Phones: 16-20 px shields, 24 px base. It is fine at 1440x900 (30 px shield) and 820x1180 (31 px).
- What is wrong: the shield follows the camera (MARK min 14 to max 36), but CARD_TAIL.base and basePhone do not. The tail reads as a megaphone or spotlight aimed at a token, wider than the thing it points at.
- Questions: C16, C13.
- Evidence: EV/sheets/tailbase-short.png; EV/stops1024j.log, stops844j.log, stops360j.log, stops412j.log.
- Fix: cards.mjs cardsTailFrame and data.mjs CARD_TAIL (line 313). Base = min(base, 0.8 x the shield's diameter). Length = min(len, about 1.5 x the diameter).

### L2b-6. Dark cards lose their tail on the ink map; Mohawk's link to its shield is invisible. POLISH.

- Where: both pages. Mohawk at every size, worst on phones. The HMC navy and Laurier purple tails are low-contrast on desktop.
- What is wrong: the tail takes the card's ground colour. Mohawk's black ground sits on ink (#151314), so the tail and the card's edge vanish and the card floats with no visible link to its shield.
- Questions: H48, G42, C14.
- Evidence: EV/sheets/mohawk412-tail.png, mohawk1440-tail.png, stops412j.png, stops360j.png.
- Fix: map.css .c-tail (line 406) and the card's edge. On dark grounds, give the tail's two long sides and the card a 1 px paper hairline at low alpha (about rgba(247,246,243,.18)). Or add a light edge colour per palette in data.mjs.

### L2b-7. At Interkom the shield sits on the beacon's flame, and on desktop the tail lies across it. POLISH.

- Where: both pages, the Interkom beat, desktop and phone.
- What is wrong: the stop's shield is drawn on top of the beacon find's fire, so the beam seems to shine out of the shield, and on desktop the cream tail runs over the flame. Two drawings tangle at the one place the eye rests.
- Questions: C17, A4.
- Evidence: EV/sheets/interkom1440-left.png, interkom1440-shield.png, interkom412-shield.png.
- Fix: data.mjs line 135 (beacon, x 536, y 514). Move the beacon a little along the coast, away from the Interkom waypoint [508, 490] (line 58), so the shield and the light stand side by side.

### L2b-8. At 844x390 (landscape phone), cards that no longer scroll now run under the step bar and the timeline. NOTE on queued A30; the new build makes it bigger.

- Where: joined page at 844x390, every stop.
- What is wrong: v14 capped the face above the step bar (252 px tall, scrolling inside). Now the face is 269-333 px tall from y 40 and ends at y 309-373. The Back and Next pills (y 276-320) sit on every card's crafts row and on Lennard's takeaway line, and the timeline (y 334-390) is hidden. A30 asks for "the compact card layout with no scrolling"; it must also keep the card above the step bar at 390 px tall.
- Evidence: EV/sheets/land844j.png; EV/land-new.log, compared with EV/land-v14.log; frames in EV/frames/land-new/ and EV/frames/land-v14/.

### L2b-9. On phones the legend rises during the rush and stays through the blast. NOTE on queued A25 (incomplete).

- Where: 412x730, 390x844 and 360x640, from about 1.8 s into the rush to the end of the flash.
- What is wrong: A25 dims the legend only "at the X beat". It also comes up in the lower third while the stars whirl in, and its words sit under the flash. A25 should dim or hide it from "Dig here" until the end view.
- Evidence: EV/sheets/rush412j-a.png (from t01800), rush412j-b.png, rush412j-full4.png.

### L2b-10. Compact cards set the crafts labels and the kicker at 9 px. NOTE on queued A4.

- Where: every compact card (phones, 1024x600, 1280x720, 844x390). The roomy cards at 1440x900 and 820x1180 are 9.5 px.
- What is wrong: A4 lifts the labels "from 9.5 px to 11 px", but compact is at 9 px (map.css lines 432 and 437). On desktop pairs the crafts row is shared with the case-study button, and at 360x640 an 11 px row has to be re-fitted without breaking the no-scroll rule.
- Evidence ("crafts":"9px","compact":true in each): EV/stops360j.log, stops412j.log, stops1024j.log, stops1280j.log.

### L2b-11. The mini-map's quartered paint on 6 px dots reads as speckle at 1x. LEAVE or POLISH.

- Evidence: EV/sheets/mini1440-hmc.png.
- Fix: map.css line 91. At this size paint halves, or use an A-colour dot with a B ring.

Seen, but not findings:
- The map stays dimmed after a card closes (pre).
- The step bar says "Next: Mohawk" through the whole Back glide until arrival (pre; for B).
- The trail's done-line remains as a fuse after the dots run in. Acceptable.
- In explore, all six cards' X and case-study buttons stay laid out in the DOM. B should confirm they are inert.

## 4. Timed first-time walk

Phone, 412x730 dpr 2.625 with touch, journey-joined.html (times from each press):
- Start: the hand-over to the settled overview takes 4.05-4.2 s. It goes dim from about 0.9 s (A32). It matches v14 frame for frame (P curve and brightness).
- Set out, to Laurier: 4.0 s glide.
  - At 3.66 s the card appears, faint, 29 px under the shield.
  - At 3.73-3.80 s a white 43-47 px stem joins it to the shield (L2b-4).
  - Open at 3.93 s, still at 3.99 s.
  - The tail hides the traveller (L2b-2). Otherwise it reads well: the sheet fits and the X sits in the header.
- Each later Next: the card folds into its shield in 0.3 s, then a glide of about 4.05 s, then the next card grows. Mohawk's card has no visible link to its shield (L2b-6). Interkom's shield sits on the beacon (L2b-7).
- Back (hmc1 to Laurier): fold 0.3 s, paint fades 0.45 s, 4.05 s glide, Laurier reopens. Fine.
- X beat, then "Dig here" (a 3.0 s rush). This is the strongest moment of the page and it is clean apart from the legend.
  - The whirl comes from every side from about 0.2 s.
  - The trail dots run down the route into the X, nearest first.
  - The legend rises at about 1.8 s (L2b-9).
  - The X whitens at about 2.6 s and the blast comes at 3.0 s.
  - The end words are up by about 5.6 s.
- Explore:
  - The 1.55 s zoom-out is drawn as a shrinking picture (hairlines), then line weights jump at about 1.6 s (L2b-1).
  - A pinch is heavy throughout and snaps on release (L2b-1).
  - A drag is crisp.
- In all: about 4 s hand-over + 7 glides x 4.05 s + 3 s rush + 2.6 s end = about 38 s of motion, plus reading.

Desktop, 1440x900, journey-joined.html:
- Hand-over: the same as v14.
- Next to Laurier: 4.0 s glide.
  - At 3.50 s a faint purple slab appears about 60 px right of the shield, joined by a needle of 61-113 px (L2b-4 / A10).
  - Open at 3.76 s, still at 3.83 s.
  - The tail's base goes dark against the card (L2b-3).
  - The pair is centred, and tilt keeps the point on the rim.
- Later stops: about 4.05 s per glide. Labels show through the growing card (A3).
- Rush and blast: as on the phone, clean.
- Explore: the same jump at the end of the opening. Three wheel notches give 1.3 s of blurred, heavy lines without the small labels, then a snap (L2b-1). Drag and fling are crisp.

## 5. Checked clean, and not checked

Clean:
- Fit: every card shows all its content (scrollHeight = clientHeight) at 1440x900, 1280x720, 1024x600, 820x1180, 412x730, 390x844, 360x640 and 844x390, and in reduced motion. Cards stay clear of the step bar and the review switch everywhere except 844x390.
- The X inside the header: aligned with the pill, in the header colour, 44 px, arrives with the words.
- Fold and grow: the card goes into and comes out of the shield the same way by X, Back, Next and the shield. Reopen is symmetric (apart from L2b-4).
- The tail's point stays on the rim at rest, mid-move and through tilt (EV/sheets/tilt.png).
- The pair is centred, and the shield sits at the pair point; nothing moves after the card opens.
- Painted shields read as round Viking shields at 1x, 2x and in explore (EV/sheets/ex1440j-rest-map.png). The paint fades in over 0.4 s and out on Back, and the mini-map follows.
- Build-up and blast at 1440, 1024, 412, 390 (map page) and 360 are all clean: the whirl comes from every side and accelerates with no pause; the trail dots stay on their route and arrive in order; stars that do not gather stay fixed to the map; the supply stars are faint and go with the blast; the X's compression, cross and tremble read clearly; the end view is clean after the flash.
- Explore drag and fling are crisp, with the layers locked together.
- GLIDE changes nothing visible: the overview at 412 differs from v14 in 0.004 % of pixels; the hand-over's P curve and brightness are the same as v14; a full round trip (end, explore, Back to the top, stops) matches a fresh load apart from a 1 px Next-arrow nudge.
- No console errors and no network requests in any run.
- Reduced motion: unchanged from v14 apart from the card design.

Not checked:
- Real-device GPU raster: true blank frames, frame pacing, and whether Chrome re-rasters the promoted layer. The weight and label snaps in L2b-1 are geometric and will show on any device; the blur may differ.
- The 150 ms gate in real time on a phone (I measured the logic, not a device).
- Real touch: my pinches were synthesised.
- Screen reader and focus (B auditor).
- Safari and Firefox.
- Rotation mid-move, and a hidden tab.
- Real-mouse hover tilt (I used scripted pointer positions).
- At 820x1180, 1280x720 and 844x390 I took stills only, no films.
- The rush at 390x844 was filmed on the map page only.

## 6. Top findings (under 300 words)

1. L2b-1, fix now. Explore's new one-layer motion draws the map as a stretched picture whenever the zoom changes: the opening zoom-out goes hairline, then jumps to full weight in one frame at about 1.6 s; a desktop wheel zoom stays blurred and heavy, without the small labels, for about 1.3 s, then snaps; a phone pinch thickens every line about 3x and fuses the dotted trail into a bar until release. v14 kept weights and labels live. FRAMES's own gates (sharp within 150 ms, labels never snap) were never run, and they fail for the wheel and the opening. Fix: composite translation only, re-raster when the scale drifts, drive the scripted opening through #cam, and settle on an epsilon.
2. L2b-2, fix now. On Dan's phone the tail's point covers the red traveller under every open shield and leaves a red smudge.
3. L2b-3, fix now. On desktop the card's drop shadow lies over its tail, so every tail darkens into a brown-black band where it meets the card. It reads as a seam, not the card's edge drawn out.
4. L2b-4, polish. The tail stretches to about 3x its rest length (113 px on desktop, 47 px on phone) while the card opens and closes. Queued A10 must also bound the tail.
5. L2b-5 and L2b-6, polish. The tail's fixed 24-28 px base is wider than small shields (17 px at 1024x600, 12 px at 844x390), so it reads as a cone. Mohawk's black tail vanishes on the ink map.
6. Notes on queued fixes: A30 (cards at 844x390 now run under the step bar), A25 (the phone legend also shows during the rush and blast), A4 (compact labels start at 9 px, not 9.5).

Clean: cards fit with no scroll at eight sizes, the X in the header, the tail's point through tilt, the shield paint, and the whole build-up and blast (whirl from every side, the trail running in on its route, the other stars staying put). The hand-over and overview are unchanged, and GLIDE changes nothing visible.
