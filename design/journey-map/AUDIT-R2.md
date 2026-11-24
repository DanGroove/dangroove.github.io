# Polish audit, round 2: a fine-toothed comb over the journey map, both pages

Four auditors work side by side on the same frozen build, each on its own, without reading the others' reports: two on Dan's PC (astra) and two in the cloud (Opus). Each pair has **L** (look: everything a visitor sees) and **B** (behaviour: everything a visitor does). Earlier reviews (a five-round critique loop, then polish audits fixed in commits a055414 and aadb2f7) passed this build. Dan still found real problems in minutes. This round exists to find the rest.

## Dan's words

- 2026-11-23: "we need to do a few cleanliness/polish passes on everything after this critique loop since im noticing a lot of odd things here and there still"; "have astra agents also assess"; "keep opus agents doing that as well".
- 2026-11-24, what he found on this build: "the cards need to showcase where they came from when opened like a leading line to the shield or a triangle; anything"; "the shields need to be have more brand colors, not just 1"; "why is the X not a part of the card?" (the card's close button); "why does the lennard card have a scroll? the whole thing should be visible"; "the pause before the supernova explosion should be replaced with something, not just a static pause"; "the stars still all come from above when they should come from 360"; and "This is the kind of thing i was hoping would be caught by the critique loop and the polish audits".
- 2026-11-24, on how to audit: it should consider "does this make sense?" "what is the purpose of this? and is it justified" "are the animations of opening and closing exist?" (for example the mjolnir minigame doesnt have a close animations) "does this drawing look nice or messy" (ygdrasil) "are these things intuitive?" and "nothing should be looked at only in a vacuum, needs to be both. etc etc. im sure there are other things im not mentioning so please be extremely thorough thorough. go with a fine-toothed comb so to speak"; "both you and astra"; and "not just those questions, you need to come up with more".

The earlier reviews checked each piece against its brief and hunted defects. They did not ask whether each piece makes sense, earns its place, enters and leaves properly, is well drawn, is understood at first sight, and works with everything around it. That is this audit.

## Method

1. **Your own questions first.** Before you look at anything, read the questions below, then write at least 25 more of your own that this page needs and that the list misses (think as a picky art director, a first-time visitor on a phone, a motion designer, a game designer, an accessibility tester, an engineer). Put them at the top of your report and use them with the list.
2. **The inventory.** List every element on both pages: each drawing on the map (land, coasts, sea, regions, every tree, mountain, building, creature, the Toronto skyline, Yggdrasil, the well, the ship, the clouds, the frame, the knots, the compass, the legend), every label and note, every stop (shield, label, card), the trail and the traveller, the X, each of the eleven finds in each of their states, every sheet, popup, hint and game screen, every button and control (Back, Next, Start, Set out, Explore, the mini-map, the timeline, the review switch, the card's X, the case study button), the build-up, the blast, the end screen, the footer and the name, explore's controls, the joined page's hero and its hand-over. Expect well over a hundred rows.
3. **The comb.** Go through the inventory one row at a time. Judge every row **alone** (zoomed in, on its own) **and in context** (at the zoom and moment a visitor meets it, beside its neighbours, during the move that brings it in and takes it away, and in the page's whole story). Record a verdict per question group: pass, or a finding. Your report carries the whole inventory with its verdicts, so the coverage shows.
4. **The walk.** Then go through the whole journey in order as someone who has never seen it, on desktop and on Dan's phone size: hero, scroll, the map, each stop, the X, the build-up, the blast, the end, explore, a few finds. Note every moment of doubt, confusion, boredom, waiting, surprise or delight, with its time.

## The questions

**A. Sense and purpose**
1. Does this make sense here, on a map of Dan's journey through school and work?
2. What is it for? Is it justified, or could it go with nothing lost?
3. Does it say something true about Dan (his crafts, his path, how he works), or is it filler?
4. Does it keep the world's logic (a Norse treasure map read as a journey), or break it?
5. Does it duplicate something else (two things doing one job, two words for one thing)?
6. Is its place in the story's order right (what comes before and after it)?

**B. Entrances and exits**
7. Does it have an opening animation and a closing animation? Every sheet, popup, card, hint, game, label, glow, marker and counter.
8. Does it leave the way it came, back to where it came from?
9. Closed mid-opening, or opened mid-closing: does it turn round smoothly from where it is?
10. Does anything appear or vanish in a single frame, however small?
11. Do similar things open and close alike (all sheets, all popups, all cards, all creatures)?
12. When something closes, do the visitor's eye and the keyboard focus land back where they came from?

**C. Drawing craft**
13. Does the drawing look nice or messy, at the size a visitor sees it and zoomed in?
14. Does it read as what it is at first glance, or as something else?
15. Are its line weights, detail and stroke style the same hand as its neighbours?
16. Is its size right for its importance and beside its neighbours?
17. Does it crowd anything, tangle with lines behind it, or leave awkward gaps?
18. Are related things aligned and evenly spaced? Is anything a pixel or two off?
19. Does it hold up at every zoom (no mush far out, no jagged curves, seams or gaps close in)?
20. Any rendering fault: blur, aliasing, seams between pieces, shimmer on moving lines?

**D. Motion**
21. Is every move eased, with weight that suits the object?
22. Any jerk, stutter, jump, snap or change of speed, above all where one animation hands over to another?
23. Do moves that happen together fight for the eye? Is there one lead move at a time?
24. Is anything too fast to follow, or too slow (dead time)?
25. Does anything move with no cause, or fail to respond when it should?
26. Do idle loops show a seam, or grow tiresome after 30 seconds?
27. Do things of a kind move alike (creatures breathing, chests opening, popups growing)?
28. Does every movement come from a believable place and go to a believable place?

**E. Intuition**
29. Is it obvious what can be pressed, and is nothing that cannot be pressed dressed up as if it can?
30. After a press, is it obvious what happened, and how to undo it or get out?
31. Is every hint where it is needed, absent where it is noise, and plain about what to do?
32. Does every press, hover and drag answer within a tenth of a second?
33. Is there always a visible way forward and back? Can anyone get lost or stuck?
34. Are touch gestures discoverable, and does everything that works with a mouse work by touch and by keys?
35. Are the same words used for the same thing everywhere, in the same case and style?

**F. Hierarchy and reading**
36. At each moment, where does the eye go first? Is that the right thing?
37. Does anything grab attention it does not deserve?
38. Is every text legible over what is behind it, at every moment, including over glows and moving stars?
39. Do type sizes, weights and cases form one system (titles, labels, kickers, buttons, notes)?
40. Does every piece of copy say one thing plainly, in Dan's own first-person voice, with no typo, no stray capital, no broken character?
41. Do dates, names and numbers agree between the cards, the labels, the timeline and the mini-map?

**G. Belonging and continuity**
42. Does everything show where it came from and what it belongs to? Is every control part of what it controls?
43. Does state carry over sensibly (leave a find and come back; go Back past a stop; explore after the end)?
44. Do the hero and the map read as one page across the hand-over (type, colour, motion, stars)?
45. Does each find feel like part of the same world as the others?

**H. Colour and brand**
46. Does each place carry its whole palette wherever it appears (card, shield, mini-map, timeline, wayfinder)?
47. Is Red only on the traveller, the X, find markers and the playhead?
48. Do the place colours sit well on the map's ink and paper, and beside each other?
49. Does it all stay inside Dan's own brand (Ink `#151314`, Paper `#F7F6F3`, Red, Outfit at 800 for names and titles; one motif at a time, no motifs merged, no giant strokes)?

**I. Layout and edges**
50. Is anything cut by a screen edge, its own box or another element; under the step bar, the timeline, the mini-map, the review switch or the phone's system bars?
51. Does any box scroll inside itself (compare `scrollHeight` with `clientHeight`)?
52. Does every size hold: 1440 x 900, 1280 x 720, 1024 x 600, 820 x 1180, 412 x 730 (Dan's phone), 390 x 844, 360 x 640, and a landscape phone (844 x 390) as a stretch?
53. Are touch targets at least 44 px, and does every hit area match what is drawn (no dead zones, no press landing on the wrong thing)?
54. Is the map's density even, or are there crowded and empty patches?

**J. States and edges of use**
55. First visit, a revisit, everything found, reduced motion, keyboard only, screen reader, a slow phone, a resize or rotation mid-move, the tab hidden and shown.
56. Pressing again and again, during moves, or two things at once (a pinch while a sheet opens).
57. The ends: Back at the start, Next at the end, explore's edges, the deepest and widest zoom.

**K. Felt speed**
58. Any delay between a press and its answer, dropped frames at key moments, a flash, a blank frame or a flicker?

**L. Accessibility**
59. Visible focus, a sensible focus order, meaningful names, live announcements where they help, text contrast at WCAG AA, reduced motion honoured everywhere.

**M. Dan's standing rules (check each is kept)**
60. An animation always moves the object that is already there; nothing respawns.
61. The journey moves only by buttons and keys; no scroll or swipe moves it; no text selection or dragging on the page.
62. The supernova's rhythm is in light only; nothing ratchets in steps.
63. His name at the end behaves like the one in the hero.
64. Nothing from any existing game or film; Norse mythology itself.

These are a start. Your own 25 or more come on top.

## The page

- **The journey:** Back and Next (and the arrow keys) move through the beats top, map, laurier, hmc1, mohawk, hmc2, interkom, lennard, x, end. On the joined page you can scroll between the hero and the map until the journey starts; after that scrolling does nothing. At the end "Explore the map" frees the camera (wheel or pinch zooms, drag pans). Eleven finds sit on the map, including a Norse shooter game. The supernova at the X builds up for 3 s, then blasts; presses on it stack flares.
- **What it is meant to be:** `design/journey-map/BRIEF.md`, then the round 7 briefs `EXPLORE.md`, `HAMMER.md`, `WORLD.md`, `CREATURES.md`, `FLASH.md`, `REVIEW2.md`, `REVIEW3.md` (its lines 20 to 22 are superseded: the build-up's rhythm lives in light only), `MOTION.md`, `REVIEW4.md`, and their `-BUILD.md` reports. Read them for intent, but judge the result as a visitor would: a thing that matches its brief can still be wrong.
- **Script hooks:** `window.__jm` (go(id, { instant: true }), next, back, set, beats, P, moving) and `window.__jm.finds` (place(id), state).

## How to look

**On Dan's PC (astra):** the frozen build is the worktree `C:\Users\Admin\Documents\Portfolio\journey-map-audit`; the pages are `design\journey-map\dist\journey-joined.html` and `design\journey-map\dist\journey-map.html` (they open from disk, no network). There is no Playwright. `design\journey-map\tools\audit-capture.mjs` drives a local headless Edge over the DevTools protocol (127.0.0.1 only) and saves full-screen PNGs; run it from `design\journey-map`. Its default plan captures every beat, every find through its presses, the end, explore and a card closed by its X; `--steps my-steps.json` runs your own steps (go, wait, press, tap, key, wheel, eval, shot; `eval` prints its value). For Dan's phone size, reduced motion or anything else it lacks, copy the tool into your own folder and change the copy (never the worktree). Frames are real time: wait 2.5 s after a move before a still; for motion, take shots every 100 to 200 ms. Look at the frames with your image viewing tool; if you cannot view images, say so at the top of your report and audit through `eval` state and the source.

**In the cloud (Opus):** the frozen build is the worktree named in your prompt; open its `design/journey-map/dist/` pages with the pre-installed Playwright Chromium (`require('playwright')`, `chromium.launch({ args: ['--enable-unsafe-swiftshader'] })`). For exact motion frames install a fake clock at a real date: `const T0 = Date.parse('2026-11-23T17:00:00Z'); await page.clock.install({ time: T0 })`, then after `goto` `await page.clock.pauseAt(T0 + 1500)` and `runFor(ms)` (a clock at time 0 breaks the timeline). CSS transitions run on real time. Measure the camera from `window.__jm.P`, not from the `#cam` attribute. Use device scale factor 2 where sharpness or drawing craft is the question.

## Your scope

**L (look):** everything seen, still and moving, through every question group, with C (drawing craft), D (motion), F (reading), H (colour) and I (layout) in the most depth.
**B (behaviour):** everything done, through every question group, with B (entrances and exits), E (intuition), J (states), K (felt speed) and L (accessibility) in the most depth, plus the code: dead code, leftovers, duplicated logic, numbers that do not match the briefs, console errors.
Both answer A (sense and purpose), G (belonging) and M (Dan's rules) from their side.

## Already known (do not count as findings)

- Being fixed now: Dan's six notes above (the card's link to its shield, the shields' colours, the card's X, scrolling cards, the static pause before the blast, stars arriving from above); in explore the blank map on a fast pinch and the lag on Dan's phone.
- Fixed in this build: the ravens' reel flashing full size for a frame; the map's title growing huge in explore.
- Dan's own examples: the hammer game (Mjolnir) has no closing animation. Yggdrasil: Dan named it as a drawing to judge; say specifically what makes it look nice or messy and how to clean it (this one is wanted, with detail).
- Still open from round 1: the embers after the blast; the horn's view; the wayfinder's "VIDEO" label cut at the tablet's X beat.

## Not findings

"YOURS TO WRITE" and "Piece to come" placeholders and other draft copy (but do flag copy that is wrong, unclear or off-voice); the review switch existing at all (preview only); anything inside Dan's hero itself (`hero-copy/`), except how it meets the map; the rune stone's arched top.

## Rules

- **Read-only.** Never change, add or delete anything in the frozen worktree or in any other checkout. Never run git other than `git log`, `git show` and `git diff`. Never install anything, never use the network, never start other agents or reviewers. If a rule stops you, leave that part out and say so in your report.
- **Write only** inside your own folder (named in your prompt): frames, your copies of tools, step files, scripts and the report. A browser's temporary profile in the system temp folder is fine.
- Plain ASCII punctuation in the report.
- Budget: up to 2 hours. Thoroughness over speed; spend the most time where a visitor spends the most attention.

## Report

`report.md` in your folder (in the cloud: your final message is saved as the report):

1. Your own questions (25 or more).
2. The inventory: one row per element, with a verdict per question group (pass, or the finding's id).
3. Findings, most visible first. Each: id (L-n or B-n), where (page, size, beat or find and state), what is wrong, the question it answers, how to see it again (steps), evidence (frame names), how bad (fix now, polish, or leave), and the fix you suggest, with the source location when you found it.
4. The walk: the timed notes from your first-time run on desktop and on Dan's phone size.
5. What you checked and found clean, and what you could not check.
6. At most 300 words naming your top findings.
