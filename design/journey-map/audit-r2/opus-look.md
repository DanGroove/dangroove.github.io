<!-- Opus auditor's report on 7d81592, saved from the cloud review; its frame paths point at that session's scratchpad and are not in the repository. -->

# Polish audit round 2: auditor L (look), Opus in the cloud

Build: worktree commit 7d81592, `design/journey-map/dist/journey-joined.html` (hero then map) and `dist/journey-map.html` (map alone), opened from disk in the pre-installed Playwright Chromium (SwiftShader). I viewed every cited frame myself. Motion frames were taken on the fake clock (installed at 2026-11-23T17:00:00Z, paused at T0 + 1500, stepped with runFor). Drawing craft was judged at device scale 2. Both pages ran with no console errors and no network requests in every run.

Every evidence path below is absolute. P stands for `/tmp/claude-0/-home-user/86207fb3-ffda-5f53-a729-f4cab4e14e6f/scratchpad/polish/r2/look/`, so `P/frames/x.png` means `/tmp/claude-0/-home-user/86207fb3-ffda-5f53-a729-f4cab4e14e6f/scratchpad/polish/r2/look/frames/x.png`. My scripts are in `P/scripts/`, frames in `P/frames/`, contact sheets in `P/sheets/` and logs in `P/*.log`.

Note on time: this machine's software renderer runs the page at a low frame rate, and the page caps one frame at 0.05 s, so in real time every move here takes two to three times its designed length. All timings below come from the fake clock, not from real time.

Rules: nothing in the worktree was changed. I ran no git commands, installed nothing and used no network. The harness refused my attempt to save `report.md` in my folder, so this message is the report.

## 1. My own questions (42, written before looking)

- Q1. Do stroke widths stay in one family at every zoom (no hairlines far out, no fat strokes close in)? Which strokes scale and which do not?
- Q2. Is the map's visual weight balanced across its halves at the overview, or does one corner hold all the detail?
- Q3. Does the trail's dash pattern stay continuous where segments meet and through each stop?
- Q4. Does the traveller face its direction of travel and turn believably at corners?
- Q5. Is any text under about 11 CSS px on Dan's phone?
- Q6. Do any two labels, or a label and a drawing, overlap at any beat or zoom?
- Q7. Is there one light source (shadows, glows, highlights)?
- Q8. Is every colour from the declared palette, or are there stray greys or browns?
- Q9. Are any two neighbouring place colours too close to tell apart, or loud enough to clash?
- Q10. Do card titles and hints break well at phone width?
- Q11. Does the camera's path between stops read as travelling the trail, or as an unrelated zoom out and back in?
- Q12. Does any glide end with an overshoot, a settling wobble or a last small jump?
- Q13. Do idle loops compete with a card the visitor is reading?
- Q14. Is there any z-order fault (a plate over text, a cloud over UI, a glow over text)?
- Q15. Are UI boxes and text crisp at device scale 2?
- Q16. Do uppercase kickers, labels and buttons share one tracking rule?
- Q17. Does the first painted frame look intentional?
- Q18. Do the hero's last frame and the map's first frame match in paper tone, ink tone and star style?
- Q19. After the blast, does every layer come back to full, clean colour?
- Q20. Is the end screen balanced (name, buttons, footer) at every size?
- Q21. Do all find popups and sheets share one container language?
- Q22. Are the icons drawn at one stroke weight and one optical size?
- Q23. Does the progress shown agree with the actual position?
- Q24. Are dates and ranges written one way everywhere?
- Q25. Do labels and markers stay on their targets at every viewport size?
- Q26. Is the text halo over the map the same for every label, and does it read on sea as well as on paper?
- Q27. Are the creatures drawn in the same hand as the land?
- Q28. Is there one depth logic (far things smaller and lighter), or do background drawings shout?
- Q29. At phone size, how much of the screen does the chrome take, and is the map left squeezed?
- Q30. Is there a moment where nothing moves and nothing says what to do next?
- Q31. Does every hover and press give a visible change, and the same kind of change on similar controls?
- Q32. Do non-text UI graphics reach 3:1 contrast?
- Q33. Does anything flash more than three times a second, or wash the whole screen white?
- Q34. Does explore give a soft stop at its edges, or does it hard-clamp?
- Q35. At the deepest zoom, does any raster or filtered layer pixelate or band?
- Q36. Do the eleven finds share one marker style, and is found versus not found obvious?
- Q37. When two moves overlap, is the eye given one lead move?
- Q38. Do gradients band on the sea, the glows or the blast?
- Q39. Does any element use a font weight or family outside the system?
- Q40. Is the copy free of the tells of machine writing, and in Dan's own voice?
- Q41. Does every animated scale grow from its anchor?
- Q42. Does a card, popup or sheet ever sit over the very thing it describes, or over another label?

## 2. Inventory (140 rows)

Legend: p = pass; L-n = my finding; k = an item on the "already known" list, seen again; `-` = behaviour I did not judge (left to auditor B); `.` = does not apply. Columns are the brief's question groups A to M.

| # | Element | A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Hero (Dan's hero-copy; only its meeting with the map judged) | . | . | . | . | . | . | p | p | . | . | . | . | . |
| 2 | Hero's "Start the journey" control (joined page) | p | - | . | . | - | p | p | p | L-22 | - | - | - | p |
| 3 | Review switch (preview only) | . | . | . | . | . | . | . | . | . | . | . | . | . |
| 4 | Hand-over: the hero lifts away | p | - | . | p | . | . | p | p | p | - | - | - | p |
| 5 | Hand-over: near-black stretch after the hero leaves | L-5 | - | . | L-5 | . | . | L-5 | . | . | - | L-5 | - | . |
| 6 | Hand-over: stars fall into the trail | p | - | p | L-5 | . | . | L-5 | p | . | - | - | - | p |
| 7 | Hand-over: coasts draw on | p | - | p | p | . | . | p | p | p | - | - | - | p |
| 8 | Hand-over: land, details, labels, clouds fade up | p | - | p | p | . | p | p | p | p | - | - | - | p |
| 9 | Stand-in hero (map page, top beat) | p | - | p | p | - | p | p | p | p | - | - | - | p |
| 10 | Sky stars and their twinkle | p | . | L-29 | p | . | . | p | p | p | - | - | - | p |
| 11 | Sea waves beyond the chart | p | . | p | p | . | . | p | p | p | . | . | . | p |
| 12 | Rhumb lines | p | . | p | . | . | . | p | p | p | . | . | . | p |
| 13 | Depth rings on the sea | p | . | p | p | . | . | p | p | p | . | . | . | p |
| 14 | Clouds | p | - | p | p | . | . | p | p | L-27 | - | - | . | p |
| 15 | Air: light and vignette | p | . | p | p | . | p | p | p | p | . | . | . | p |
| 16 | Chart frame and ruler ticks | p | . | L-8 | . | . | . | p | p | p | . | . | . | p |
| 17 | Corner knots | p | . | p | . | . | . | p | p | p | . | . | . | p |
| 18 | Map title | p | - | p | p | . | p | p | p | L-21 | - | . | - | p |
| 19 | Kicker, plate and rule under the title | p | - | p | . | . | p | p | p | L-2 | - | . | - | p |
| 20 | Legend | p | . | p | . | . | L-14 | p | p | L-13 | . | . | - | p |
| 21 | Main island (land fill) | p | . | p | p | . | . | p | p | p | . | . | . | p |
| 22 | South island | p | . | p | p | . | . | p | p | p | . | . | . | p |
| 23 | Coast lines and coast hatching | p | . | L-8 | p | . | . | p | p | p | . | . | . | p |
| 24 | Shore dots | p | . | p | p | . | . | p | p | p | . | . | . | p |
| 25 | Region label LAURIERVIK | p | - | p | p | . | p | p | p | p | . | . | . | p |
| 26 | Region label THE IRONWOOD | p | - | p | p | . | p | p | p | p | . | . | . | p |
| 27 | Region label MOHAWKFJELL and runes | p | - | p | p | . | L-3 | L-3 | p | L-3 | . | . | . | p |
| 28 | Region label LENNARDGARD | p | - | p | p | . | p | p | p | p | . | . | . | p |
| 29 | Sea label THE MARGINS | p | - | p | . | . | p | p | p | p | . | . | . | p |
| 30 | Sea label KERNING NARROWS | p | - | p | . | . | p | p | p | p | . | . | . | p |
| 31 | Sea label SEA OF REVISIONS | p | - | p | . | . | p | p | p | p | . | . | . | p |
| 32 | Sea label HERE BE DEADLINES | p | - | p | . | . | L-26 | p | p | L-26 | . | . | . | p |
| 33 | Note "the road not taken", its path and signpost | p | - | p | . | . | p | p | p | p | . | . | . | p |
| 34 | Note "the diploma climb" | p | - | p | . | . | L-3 | L-3 | p | L-3 | . | . | . | p |
| 35 | Note "the 2023 crossing" | p | - | p | . | . | p | p | p | p | . | . | . | p |
| 36 | Mist label | p | - | p | . | . | p | p | p | p | . | . | . | p |
| 37 | YGGDRASIL label | p | - | p | . | . | p | p | p | p | . | . | . | p |
| 38 | URD'S WELL label and leader line | p | - | p | . | . | L-4 | p | p | L-4 | . | . | . | p |
| 39 | Grove trees | p | . | p | . | . | . | p | p | p | . | . | . | p |
| 40 | Mountains | p | . | p | . | . | . | p | p | p | . | . | . | p |
| 41 | Hills | p | . | p | . | . | . | p | p | p | . | . | . | p |
| 42 | Laurier house | p | . | p | . | . | . | p | p | p | . | . | . | p |
| 43 | Hammer find's drawing on the map (stone and hammer) | p | - | L-12 | . | - | . | p | p | p | - | - | - | p |
| 44 | Signpost | p | . | p | . | . | . | p | p | p | . | . | . | p |
| 45 | Mohawk building | p | . | p | . | . | . | p | p | p | . | . | . | p |
| 46 | HMC piers | p | . | p | . | . | . | L-19 | p | p | . | . | . | p |
| 47 | Sailboats | p | . | p | p | . | . | p | p | p | . | . | . | p |
| 48 | River and bridge | p | . | p | . | . | . | p | p | p | . | . | . | p |
| 49 | Toronto skyline | p | . | p | . | . | . | p | p | p | . | . | . | p |
| 50 | Landing post | p | . | p | . | . | . | p | p | p | . | . | . | p |
| 51 | Yggdrasil: crown, limbs, trunk, roots | p | . | L-4 | p | . | . | p | p | L-4 | . | . | . | p |
| 52 | Yggdrasil's eagle | p | . | p | p | . | . | p | p | p | . | . | . | p |
| 53 | Ratatoskr | p | . | L-4 | p | . | . | p | p | p | . | . | . | p |
| 54 | Nidhogg | p | . | L-4 | p | . | . | p | p | p | . | . | . | p |
| 55 | Urd's well pool | p | . | p | p | . | . | p | p | p | . | . | . | p |
| 56 | Jormungandr's surfaced stretches | p | . | L-10 | p | . | . | p | p | p | . | . | . | p |
| 57 | Jormungandr's submerged body | p | . | p | p | . | . | p | p | p | . | . | . | p |
| 58 | Jormungandr's head and pad | p | - | L-10 | p | - | . | p | p | p | - | - | - | p |
| 59 | Stop shields, not yet visited | p | - | k | . | - | p | k | k | L-31 | - | - | - | p |
| 60 | Stop shields, visited | p | - | k | k | - | p | k | k | p | - | - | - | p |
| 61 | Stop names (six) | p | - | p | . | . | p | p | p | L-2 | . | . | - | p |
| 62 | Stop sub-lines (dates and roles) | p | - | p | . | . | L-19 | L-3 | p | L-3 | . | . | - | p |
| 63 | Trail ahead (dashed) | p | - | p | p | . | p | p | p | p | - | - | - | p |
| 64 | Trail behind (walked) | p | - | p | p | . | p | p | p | p | - | - | - | p |
| 65 | Traveller (red star) | p | - | p | p | . | p | p | p | p | - | - | - | p |
| 66 | Longship carrying the traveller over the sea | p | - | p | p | . | p | p | p | p | - | - | - | p |
| 67 | The X | p | - | L-8 | p | - | p | p | p | L-8 | - | - | - | p |
| 68 | "X marks the work" and its sub-line | p | - | p | p | . | p | p | p | p | - | - | - | p |
| 69 | X hit area | p | - | . | . | - | . | p | . | p | - | - | - | p |
| 70 | Laurier card | p | k | p | p | - | p | k | p | k | - | - | - | p |
| 71 | HMC card | p | k | p | p | - | p | k | p | p | - | - | - | p |
| 72 | Mohawk card | p | k | p | p | - | p | k | p | p | - | - | - | p |
| 73 | HMC again card | p | k | p | p | - | p | k | p | k | - | - | - | p |
| 74 | Interkom card | p | k | p | p | - | p | k | p | p | - | - | - | p |
| 75 | Lennard card (band and white panel) | p | k | p | p | - | p | k | p | k | - | - | - | p |
| 76 | Card logos | p | . | p | . | . | p | p | p | p | . | . | . | p |
| 77 | Date pills | p | . | p | . | . | p | p | p | p | . | . | . | p |
| 78 | Card headlines (26 px, 800, -0.02em) | p | . | p | . | . | p | p | p | p | . | . | . | p |
| 79 | Role lines | p | . | p | . | . | p | p | p | p | . | . | . | p |
| 80 | Card paragraphs | p | . | p | . | . | p | p | p | p | . | . | . | p |
| 81 | "WHAT I TOOK WITH ME" heading | p | . | p | . | . | p | p | p | p | . | . | . | p |
| 82 | Piece frame and HMC report image | p | . | p | . | . | p | p | p | p | . | . | . | p |
| 83 | Craft stripes and craft labels | p | . | p | . | . | L-20 | p | p | p | . | . | . | p |
| 84 | "See the case study" button | p | - | p | . | - | p | p | p | L-31 | - | - | - | p |
| 85 | Card close X | p | k | p | k | k | p | k | p | p | - | - | - | p |
| 86 | Card grows from and folds into its shield | p | k | p | k | . | k | k | p | p | - | - | - | p |
| 87 | Map dims under an open card | p | - | . | p | . | p | p | p | p | - | - | - | p |
| 88 | Lennard step chips | p | . | p | . | . | p | p | p | p | . | . | . | p |
| 89 | Stepper (Back, Next) on desktop | p | - | p | p | - | p | p | p | p | - | - | - | p |
| 90 | Stepper bar on phone | p | - | p | p | - | p | p | p | p | - | - | - | p |
| 91 | Stepper at the end (Back, Explore the map, Back to the top) | p | - | p | p | - | L-18 | p | p | L-21, L-31 | - | - | - | p |
| 92 | Jump cover (.jm-cut) | - | - | - | - | - | - | - | - | - | - | - | - | - |
| 93 | Mini-map | p | - | p | p | - | p | p | L-6 | p | - | - | - | p |
| 94 | Timeline blocks and playhead | p | - | p | p | - | p | p | L-6 | p | - | - | - | p |
| 95 | Timeline thinning at the X and the end | p | - | . | p | . | p | p | p | p | - | - | - | p |
| 96 | Find counter ("0 of 11 found") | p | - | . | - | L-1 | L-1 | L-1 | p | L-1 | - | - | - | p |
| 97 | Timeline plate (ink gradient behind the strip) | p | - | p | . | . | L-1 | p | p | L-1 | - | - | - | p |
| 98 | Phone timeline strip | p | - | p | p | - | p | p | p | L-15 | - | - | - | p |
| 99 | Find hints (.find-hint) | p | - | . | p | - | L-28 | L-28 | p | L-28 | - | - | - | p |
| 100 | Explore hint ("Scroll to zoom. Drag to look around.") | p | L-16 | . | L-16 | - | p | p | p | L-16 | - | - | - | p |
| 101 | Find markers (red rings with numbers) | p | - | L-7 | p | - | L-7 | p | p | L-7, L-31 | - | - | - | p |
| 102 | Wayfinder (the compass find) | p | - | p | p | - | p | p | p | p | - | - | - | p |
| 103 | Wayfinder's craft words | p | - | p | . | - | k | p | p | k | - | - | - | p |
| 104 | Hoards: the five scratches | p | - | L-11 | . | L-11 | L-11 | p | p | L-31 | - | - | - | p |
| 105 | Hoards: dig states and chests | p | - | p | p | - | p | p | p | p | - | - | - | p |
| 106 | Ravens (Huginn and Muninn) | p | - | p | p | - | p | p | p | p | - | - | - | p |
| 107 | Ravens' gift on the branch | p | - | L-25 | . | - | p | p | p | p | - | - | - | p |
| 108 | Ravens' popup | p | - | p | p | - | p | p | p | L-16 | - | - | - | p |
| 109 | Serpent find (pad leaves) | p | - | p | p | - | p | p | p | p | - | - | - | p |
| 110 | Beacon and its beam | p | - | p | p | - | p | p | p | p | - | - | - | p |
| 111 | Beacon's notes | p | - | p | p | - | p | p | p | p | - | - | - | p |
| 112 | Rune stone and rubbing sheet | p | - | p | p | - | p | p | p | p | - | - | - | p |
| 113 | Rubbing sheet buttons ("Rub it for me") | p | - | p | . | - | p | p | p | L-31 | - | - | - | p |
| 114 | Hammer game sheet (Mjolnir) | p | k | p | p | - | p | p | p | p | - | - | - | L-30 |
| 115 | Mist of 2020 | p | - | L-9 | p | - | p | L-9 | p | p | - | - | - | p |
| 116 | Horn on the shore | p | - | L-12 | . | - | p | p | p | p | - | - | - | p |
| 117 | Horn's "Skal." popup | p | - | p | p | - | p | p | p | L-17 | - | - | - | p |
| 118 | Horn's sounding view | p | - | p | k | - | p | p | p | k | - | - | - | p |
| 119 | Well: rings, stars, Norns | p | - | p | p | - | p | p | p | p | - | - | - | p |
| 120 | Longship find | p | - | p | p | - | p | p | p | p | - | - | - | p |
| 121 | Popups as a family | p | - | p | p | - | p | p | p | p | - | - | - | p |
| 122 | Sheets as a family | p | k | p | p | - | p | p | p | p | - | - | - | p |
| 123 | Find bits (small reward pieces) | - | - | - | - | - | - | - | - | - | - | - | - | - |
| 124 | Build-up: lean and streams | p | - | p | k | . | p | p | p | p | - | - | - | k |
| 125 | Near-still stretch before the blast | k | - | . | k | . | . | . | . | . | - | k | - | k |
| 126 | X strokes thin, whiten, spike | p | - | p | p | . | p | p | p | p | - | - | - | p |
| 127 | Blast: ring, streaks, red wash | p | - | p | p | . | p | p | p | p | - | - | - | p |
| 128 | Embers after the blast | . | . | k | k | . | . | . | . | . | . | . | . | . |
| 129 | Settled glow, star, rings, rays | p | - | p | p | . | p | p | p | p | - | - | - | p |
| 130 | Footer heading | p | - | . | p | . | p | p | p | L-21 | - | - | - | p |
| 131 | "Let's talk" button | p | - | p | p | - | p | p | p | p | - | - | - | p |
| 132 | Name (footer) | p | - | . | p | . | p | p | p | p | - | - | - | - |
| 133 | Tagline | p | - | . | p | . | p | p | p | p | - | - | - | p |
| 134 | Rule with the Red dot | p | - | p | p | . | . | p | p | p | - | - | - | p |
| 135 | Links row (Case studies, Work, LinkedIn, Email, Resume) | p | - | . | p | - | p | p | p | L-31 | - | - | - | p |
| 136 | Explore: camera pull-out and footer fade | p | L-16 | . | p | - | p | p | p | p | - | - | - | p |
| 137 | Explore controls (Back to the end, Back to the top) | p | - | p | p | - | L-18 | p | p | L-27 | - | - | - | p |
| 138 | Remnant glow and rings in explore | p | - | L-24 | p | . | p | p | p | L-24 | - | - | - | p |
| 139 | Explore zoom range and edges | L-23 | - | p | p | - | p | L-23 | p | p | - | k | - | p |
| 140 | Reduced motion page (desktop) | p | - | p | p | - | p | p | p | p | - | - | - | p |

## 3. Findings, most visible first

The ids are numbered in the order I found them. The list itself runs from most visible to least, so L-31 sits after L-8.

### L-1. The find counter never shows (fix now)
- **Where:** both pages, at every size I checked (1440x900, 412x730). It is missing at the map beat, at the X beat, at rest at every stop and at the end of every glide.
- **What:** "0 of 11 found", at the right end of the timeline, is never visible at rest. `.tl-bg`, the ink gradient plate behind the strip, is `position: absolute` and paints after the static `.tl-count`, so it covers the counter. During glides there is at most a trace of it in about 10 percent of frames at stops. Hide `.tl-bg` and the count appears where it should. The visitor never learns that there are eleven finds or how many they have found, and this is the finds' only running score.
- **Questions:** F38, I50, G42; my Q14 and Q23.
- **Steps:**
  1. Open journey-map.html at 1440x900.
  2. Run `__jm.go('map', { instant: true })` and wait 3 s. The timeline's right end is empty ink. Every pixel in the counter's box was Ink (21,19,20), on both pages at both sizes.
  3. Set `.tl-bg { display: none }` and the count appears.
- **Evidence:** P/frames/count/1440-join-3000.png, P/frames/count/412-join-3000.png, P/frames/count/desk-bg-hidden.png, P/frames/beats/joined-phone-map.png
- **Fix:** in map.css line 178, give `.tl-count` `position: relative; z-index: 1`. Another way is `z-index: -1` on `.tl-bg` inside an isolated `.tl`. Check the phone rule at line 197 too.

### L-2. At 1280x720 the kicker and its rule run into the serpent (fix now)
- **Where:** both pages, 1280x720, map overview.
- **What:** at this size the overview's camera scale is lower and the kicker under the title sits at its floor size:
  - The kicker runs into Jormungandr's head and his white pad.
  - The rule runs into the serpent's body.
  - The "Laurier" stop name touches the hammer drawing.

  The tier-1 label check in WORLD section 7 covers only 1440x900 and 390x844, so it never saw this. 1280x720 is a common laptop size.
- **Questions:** I50, I52, C17, F38.
- **Steps:** open journey-map.html at 1280x720, run `go('map', { instant: true })` and wait 3 s. Look under the title (top left) and at the Laurier stop.
- **Evidence:** P/sheets/1280-title.png, P/frames/sizes/1280x720-map.png
- **Fix:**
  - In data.mjs line 1013 (LABELS: kicker at [45,101], the plate, the rule [0,8,196]), cap the kicker's floored size or shorten the rule so it ends before the serpent.
  - Move the Laurier name off the hammer.
  - Extend the WORLD section 7 label check to 1280x720, 1024x600, 820x1180 and 360x640.

### L-3. Laurier's sub-line stacks onto MOHAWKFJELL; "the diploma climb" floats beside Yggdrasil (fix now)
- **Where:** both pages, every size. It shows at the overview, at the Laurier and Mohawk stops, during the Laurier to HMC glide and in explore.
- **What:**
  - "Laurier" and its sub-line "2016 to 2017, game design" sit 14 px above "MOHAWKFJELL" and its runes. Stop name, sub-line, region name and runes read as one four-line block, and the eye cannot tell the stop from the land.
  - "the diploma climb" sits beside Yggdrasil's crown, about 60 map units from the stair band it names, so it reads as a caption for the tree.
- **Questions:** A1, F36, G42, C17.
- **Steps:** open journey-map.html at 1440x900 at the map beat. Then press Next to Laurier, then Next to HMC, and look at the first frames of the glide.
- **Evidence:** P/frames/motion/lau-hmc1/f002.png, P/frames/survey/desk-fjell.png, P/frames/survey/desk-ygg.png, P/frames/finds/desk-hammer-2.png
- **Fix:**
  - In data.mjs line 82, move MOHAWKFJELL (140, 258) about 12 units down and left so a clear line's gap separates it from Laurier's sub-line.
  - In data.mjs line 89, move "the diploma climb" (238, 356) onto the stair band (x about 205 to 215) and set it along the band.

### L-4. Yggdrasil, as Dan asked: what makes it messy and how to clean it (polish)
- **Where:** both pages, every size. Seen at the overview, at the Mohawk and HMC again stops, in the well find, and in explore at its deepest zoom.
- **What works:** the eagle at the top, the well pool and its rings, the trunk's own hatching, and the tree's size against the land.
- **What makes it messy,** most costly first:
  1. The crown is five separate scalloped blobs with gaps between them. It reads as a cluster of clouds or broccoli, not one crown.
  2. The hatch strokes inside the crown radiate in each blob from limb to centre, every blob in its own direction, so together they read as rain or scribble.
  3. The trunk ends in a flat-topped lid under the crown instead of forking into limbs.
  4. Limb lines run into and through the blob outlines.
  5. The rootlets on the well side cross the letters of "URD'S WELL".
  6. Nidhogg at the roots reads as a snail and Ratatoskr on the trunk as a squiggle. Neither is legible at any zoom a visitor can reach: explore's deepest zoom is 2.76 px per map unit at 1440x900 (see L-23).
  7. The right root runs far out into empty land and ends in a spike.
  8. "the diploma climb" beside the crown (L-3) gives the tree a caption that is not its own.
- **Questions:** C13, C14, C15, C17, C19; my Q27.
- **Steps:** open journey-map.html at 1440x900 and run `go('mohawk', { instant: true })`. Or go to the end, press "Explore the map" and zoom on the tree. Or press the well find (`__jm.finds.place('well')`).
- **Evidence:** P/frames/survey/desk-ygg.png, P/frames/survey/desk-east.png, P/frames/survey/desk-find-well.png, P/frames/over2/ov-north.png
- **Fix** (art.mjs `yggdrasil()` lines 108 to 125; YGG data in data.mjs near line 566):
  - Draw the crown as one silhouette (the union of the five blobs), with the inner scallops kept only as short overlap arcs.
  - Use one hatch direction across the whole crown, or short arcs that follow the scallops.
  - Fork the trunk into the limbs in a Y and drop the flat cap.
  - Clip the limb lines to the crown's fill so they never cross an outline.
  - Move the rootlets out of the label's box, or set the label under the pool.
  - Shorten the right root and taper it like the others.
  - Draw Nidhogg and Ratatoskr about twice as big, with one clear silhouette each (a coiled dragon biting a root; a squirrel with a big tail mid-run), or leave them out.

### L-5. Hand-over: a near-black gap, and the falling stars cannot be followed (polish)
- **Where:** journey-joined.html, 1440x900 and 412x730, after pressing "Start the journey".
- **What:**
  - The hero has gone by about 0.75 s.
  - Then the screen is near-black for about 0.3 s on desktop (frames 6 and 7) and about 0.45 s on the phone. The hero's last row is left behind before it lifts: "START THE JOURNEY ... PAUSE", and on the phone also "03 MOTION".
  - The first coast arcs arrive only at about 1.2 s.
  - The falling stars that should become the trail are too small and dim to follow.

  So "the hero's stars become the map" is lost, and it reads as hero, black, then map.
- **Questions:** D24, A6, G44, K58; my Q18 and Q30.
- **Steps:** open journey-joined.html on the fake clock, press Start, and take frames every 150 ms for 2 s.
- **Evidence:** P/sheets/handover-gap.png, P/sheets/handover-desk.png, P/sheets/handover-phone.png
- **Fix:**
  - Start the coast draw-on and the visible part of the fall earlier, so they overlap the hero's exit (WORLD.coastDraw [.04, .72], data.mjs line 1020).
  - Give the falling stars a short bright tail, or a brief size boost while they fall (the hand-off in stars.mjs), so the eye can follow them home.

### L-6. The playhead is lost in Lennard's block; Interkom's coral reads as the brand Red (polish)
- **Where:** both pages, every size. The timeline at the X beat and the end; the mini-map at every beat.
- **What:**
  - At the X beat the Red playhead star sits on Lennard's orange-red block and vanishes into it.
  - Interkom's timeline block (#E85155) and its mini-map dot read as the brand Red (#F0484F), so Red no longer means only the traveller, the X, the find markers and the playhead.
  - On the mini-map the traveller's dot is smaller than Lennard's place dot beside it.
  - Laurier's gold and Mohawk's orange are near twins on the timeline.
- **Questions:** H46, H47, H48, F37.
- **Steps:** open journey-map.html at 1440x900, run `go('x', { instant: true })`, and look at the timeline's right end and at the mini-map.
- **Evidence:** P/frames/over2/mini-tl.png, P/frames/beats/joined-desk-x.png
- **Fix:**
  - In map.css line 176 (`.tl-head`), give the playhead a 2 px Ink ring and a Paper core so it reads on any block, or end the last block 6 px short of the head.
  - Draw Interkom's timeline block and mini-map mark away from Red (for example in its cream #F7F3E2 with a coral outline).
  - Give the mini-map traveller a Paper ring and make it at least as big as a place dot.

### L-7. Find markers scale with the map and outshine the stops (polish)
- **Where:** both pages, every size, every stop.
- **What:**
  - The red find markers are drawn in map units (r 6.2, stroke 1.2). They are about 8 px at the overview but about 42 px at the stops, where they are louder than the stop shields (about 30 px).
  - At the Lennard beat the "1" marker is cut by the left edge.
  - At HMC one marker peeks out above the card.
- **Questions:** F37, C16, I50.
- **Steps:** open journey-map.html at 1440x900, run `go('hmc1')`, then `go('lennard')`.
- **Evidence:** P/frames/beats/joined-desk-hmc1.png, P/frames/beats/joined-desk-lennard.png, P/frames/motion/lau-hmc1/f024.png
- **Fix:** in art.mjs line 91 (`marker()`), size the markers in screen px with a floor and a cap. The floor exists already (LABELS.marker unit 7.5, floor 6, data.mjs line 1013); add a cap near 16 to 18 px. Keep markers out of the open card's rectangle.

### L-8. Strokes that scale: ticks turn into combs and the X into a brush stroke (polish)
- **Where:** both pages, at stop and find zooms (above about 3 px per map unit).
- **What:**
  - The coast hatch ticks and the frame's ruler ticks scale into grey combs and rails 5 px thick.
  - The X's strokes (3.6 map units) grow to about 25 px brush strokes.
  - At the Lennard hoard view the X sits half hidden behind "Set out" and reads as a red check mark.
- **Questions:** C15, C19, I50, H49 ("no giant strokes"); my Q1.
- **Steps:** open journey-map.html at 1440x900, run `go('laurier')` and look at the coast. Then press the Lennard hoard, the ravens or the horn.
- **Evidence:** P/frames/finds/desk-hoard-lennard-1.png, P/frames/finds/desk-ravens-2.png, P/frames/finds/desk-horn-1.png, P/frames/beats/joined-desk-laurier.png
- **Fix:**
  - Give the hatch and ruler ticks `vector-effect: non-scaling-stroke`, with their lengths clamped in screen px, or fade them above the stop zoom.
  - Clamp the X's stroke width in px (footer.mjs line 13, `xStroke`, stroke-width 3.6).
  - Reframe the Lennard hoard view so the X stays clear of the stepper.

### L-31. Touch targets under 44 px at Dan's phone size (polish)
- **Where:** both pages, 412x730 with touch.
- **What** (measured CSS px):

  | Target | Size |
  |---|---|
  | Stop shields at the overview (buttons, "Go to ...") | 14x14 |
  | Rune stone at the overview | 14x24 |
  | Hammer at the overview | 15x15 |
  | Horn at the overview | 15x17 |
  | Each hoard scratch at the overview | 21x33 |
  | Ravens at the overview | 25x26 |
  | Longship at the overview | 25x23 |
  | Serpent at the overview | 39x27 |
  | The X at the overview | 33x33 |
  | "See the case study" | 36 tall |
  | "Rub it for me" | 99x29 |
  | "Back to the top" | 152x32 |
  | Footer links "Case studies", "Work" | 21 tall |
  | Footer links LinkedIn, Email, Resume | 14 tall |

  The hammer (84,165) and the Laurier shield (109,146) are 25 px apart, so a fingertip lands on either. The stepper (52), the card's X (44) and "Let's talk" (46) are fine.
- **Questions:** I53, E29.
- **Steps:** open journey-map.html at 412x730 with touch, go to each beat, and list every visible button and role=button with its rect.
- **Evidence:** P/targets.log (script P/scripts/targets.js)
- **Severity:** polish. The main path, the stepper, is 52 px tall; the small targets are the side paths a phone visitor plays with.
- **Fix:**
  - `.st-btn` (map.css line 46): add a centred transparent ::after at least 44 px square.
  - Floor the finds' `.hit` shapes in screen px (scale each by max(1, 22 / its on-screen radius) as the camera moves).
  - `.c-btn` (map.css line 78): more padding on phones, to reach 44.
  - `.go-top` (lines 272 and 395): the stepper's height.
  - The rubbing sheet's buttons: 44.
  - The footer's small links (lines 160 and 161): vertical padding to at least 24 px.

### L-9. The mist of 2020 is drawn in another hand (polish)
- **Where:** both pages, every size. At the overview, and close in at the mist find.
- **What:**
  - The mist is Gaussian-blurred white blobs. At the overview it reads as a smudge on the chart.
  - Close in, it is airbrushed fog whose blur box shows hard edges, in a different hand from every other drawing, which is ink line work.
  - The stepped glyphs inside it cannot be identified.
- **Questions:** C13, C14, C15, G45; my Q27.
- **Steps:** open journey-map.html at 1440x900 at the map beat, then press the mist.
- **Evidence:** P/frames/over2/ov-north.png, P/frames/survey/desk-find-mist.png, P/frames/finds/desk-mist-1.png
- **Fix:** in art.mjs line 177 (`mist()`) and the blur filter at line 194, draw the mist as layered wavy Paper strokes over a faint fill and keep the wipe mask. Label the glyphs or drop them.

### L-10. Jormungandr's surfaced stretches read as rods (polish)
- **Where:** both pages. At the overview, and close in at the serpent find and the 2023 crossing.
- **What:**
  - The surfaced stretches are flat, parallel, round-ended bands. At the overview they read as rods or capsules beside the island; close in, as zipper belts.
  - The pad above the head reads as an empty checkbox.
- **Questions:** C13, C14.
- **Steps:** open journey-map.html at 1440x900 at the map beat, then press the serpent.
- **Evidence:** P/frames/over2/ov-north.png, P/frames/over2/ov-south.png, P/frames/survey/desk-find-serpent.png, P/frames/survey/desk-crossing.png
- **Fix:** in art.mjs line 330 (`jormungandr()`), draw each stretch as an arched hump rising from the water, with a broken waterline at its feet, tapering into the sea. Draw the pad as a small calendar, or drop it.

### L-11. The hoard scratches look like a tiny garbled word (polish)
- **Where:** both pages, overview and Ironwood views.
- **What:** the five scratches marking the hoards read as a tiny garbled word ("u x ^"), like a typo on the chart. One "2" marker stands for all five.
- **Questions:** C14, E29, F37.
- **Evidence:** P/frames/over2/ov-north.png, P/frames/survey/desk-ygg.png
- **Fix:** draw each scratch as a small mound with crossed scratch strokes and a spade nick, never letter-shaped (the hoards in data.mjs lines 214 to 219 and their drawing).

### L-12. The horn reads as a pipe and the hammer's map drawing as a jetty (polish)
- **Where:** both pages: the horn on the west shore, and the hammer on its stone near Laurier.
- **What:**
  - The horn is a curved band of constant width with square ends, so it reads as a pipe elbow or a boomerang.
  - The hammer's map drawing reads as a jetty or a cake stand.
- **Question:** C14.
- **Evidence:** P/frames/finds/desk-horn-1.png, P/frames/over2/ov-north.png, P/frames/over2/ov-south.png
- **Fix:**
  - Horn (FIND_PLAY.horn, data.mjs line 541): taper to a curled tip, add a rim at the mouth and two bands.
  - Hammer (HAMMER.map, data.mjs line 180): a recognisable hammer head standing on the block.

### L-13. At the X beat the legend competes with "X marks the work" (polish)
- **Where:** both pages, 1440x900 and 1280x720, X beat.
- **What:** the legend box fills the lower 40 percent of the view, and its 16 px words compete with "X marks the work", the one line that should lead.
- **Questions:** F36, F37.
- **Evidence:** P/frames/beats/joined-desk-x.png, P/frames/sizes/1280x720-x.png
- **Fix:** fade the legend at the X beat (the tier-2 rule, reversed), or frame the X differently (CAMERA.xAnchorY 0.42, data.mjs line 283).

### L-14. The phone legend's two columns crowd (polish)
- **Where:** both pages, 412x730, map beat.
- **What:** at the 9 px floor, "the work" runs into the trail dots, so the legend reads "the work... the trail", and "a stop" crowds "something to play with".
- **Questions:** C17, F38, I52.
- **Evidence:** P/frames/beats/joined-phone-map.png
- **Fix:** on phones, move the second column from 151 to about 170 (LABELS.legendAt, data.mjs line 1013), or use one column.

### L-15. The phone timeline strip is cropped through a block (polish)
- **Where:** both pages, 412x730.
- **What:** the strip is hard-cropped at x 300, cutting through a block and leaving an empty gap on the right, where the counter of L-1 should be.
- **Question:** I50.
- **Evidence:** P/frames/beats/joined-phone-map.png
- **Fix:** fade the right edge of `.tl-view` with a mask on phones, and fix L-1.

### L-16. The explore hint pops onto the fading name; a raven popup lands on the title (polish)
- **Where:** both pages, every size, the start of explore.
- **What:**
  - "Scroll to zoom. Drag to look around." appears at once, at full strength, over the name while the name is still fading (first 0.4 s).
  - On the phone, the ravens' popup at the explore fit lands on "The saga so far" and the kicker.
- **Questions:** B10, D23, F38, I50.
- **Evidence:** P/sheets/explore-name.png, P/frames/walk/phone-29-explore-ravens-4.png
- **Fix:** in explore.mjs `exploreStart` (line 74), show the hint only after EXPLORE.footerFade, with an opacity ease (map.css line 303). Keep popups clear of the title at the fit.

### L-17. The horn's "Skal." popup is pinned under the review switch, far from the horn (polish)
- **Where:** both pages, desktop and phone, horn find.
- **What:** the popup sits 18 px from the top, half under the review switch, far above the horn it belongs to.
- **Questions:** I50, G42.
- **Evidence:** P/frames/finds/desk-horn-1.png, P/frames/finds/phone-horn-1.png
- **Fix:** place it beside the horn, at least 56 px from the top.

### L-18. Two button systems in one row at the end and in explore (polish)
- **Where:** both pages, the end and explore.
- **What:** one row mixes 44 px pills set at 14 px, sentence case, weight 700 ("Explore the map", "Back to the end") with a 32 px button set at 11 px, uppercase, 0.18em tracking, Note colour ("BACK TO THE TOP").
- **Questions:** F39, E35.
- **Evidence:** P/frames/beats/joined-desk-end.png, P/frames/survey/desk-fit.png
- **Fix:** set `.go-top` (map.css lines 272 and 395) in the stepper's type, at the same height, as a quieter outline pill.

### L-19. HMC's sub-line sits above its name, and "HMC, again" is ambiguous (polish)
- **Where:** both pages, overview.
- **What:** HMC's sub-line sits above its name, while the other five stops have theirs below. "HMC, again" sits between two piers, so it is unclear which pier it names.
- **Questions:** F36, G42, C18.
- **Evidence:** P/frames/over2/ov-north.png, P/frames/survey/desk-hmc1.png
- **Fix:** put both HMC labels on the sea side, with the sub-line below the name (LABELS.hmcSubDY and hmcAgainSubDX, data.mjs line 1013).

### L-20. The smallest type is 9.5 px (polish)
- **Where:** cards at every size; the timeline.
- **What:** the cards' craft labels are 9.5 px, and warm grey on Lennard's panel. The timeline's year labels are also 9.5 px in Dim, and the phone counter is 10 px.
- **Questions:** F38, F39; my Q5.
- **Evidence:** P/frames/beats/joined-desk-laurier.png, P/frames/beats/joined-desk-lennard.png
- **Fix:** 11 px for `.c-crafts` (map.css line 75) and `.tl-tick b` (line 174).

### L-21. 844x390 landscape phone (polish, stretch)
- **Where:** both pages, 844x390.
- **What:**
  - At the overview the labels pile up, the kicker runs past the frame and the title is lost.
  - At the end, the explore row sits over the heading ("BACK TO THE TOP" over "needs carrying").
  - The cards fill the screen and scroll. 844x390 is not on ORIGIN's list of sizes for the scrolling-cards fix.
- **Questions:** I50, I51, I52.
- **Evidence:** P/sheets/sz-844.png, P/sheets/844-title.png, P/frames/sizes/844x390-end.png
- **Fix:** treat a short landscape screen as a phone for labels and for the end row (REVIEW3 V3-5, two rows), and add 844x390 to the fix's list.

### L-22. 360x640, joined page: the start control is half off-screen (polish)
- **Where:** journey-joined.html, 360x640, top.
- **What:**
  - "START THE JOURNEY" spans y 633 to 648 on a 640 px screen, so it is half off-screen, and the stepper is hidden at the top on this page.
  - At every size the control takes the hero cue's style: 11 px tracked caps at the bottom left, the same as "PAUSE". So it reads as a caption, not as the way in. That part is Dan's cue style: leave it, or mark it as pressable with the stepper's arrow.
- **Questions:** I50, I52, E29.
- **Evidence:** P/frames/sizes/360x640-top.png, P/frames/beats/joined-desk-top.png
- **Fix:** a bottom inset of at least 16 px for the cue on short screens (join.css), or the phone bar at the top on short screens.

### L-23. Explore cannot zoom as close as the journey did (polish)
- **Where:** both pages, explore.
- **What:** explore's deepest zoom is 2.76 px per unit at 1440x900, against 3.43 at a stop hold. A visitor free to look cannot get as close as the journey took them, and the creatures never become legible.
- **Questions:** J57, A2, C19.
- **Evidence:** P/frames/survey/desk-ygg.png (camera scales measured from `__jm.P`)
- **Fix:** raise EXPLORE.most (data.mjs line 303) from 3 to about 4.5.

### L-24. In explore the remnant's rings cross the south island (leave, or polish)
- **What:** the remnant's big, faint rings cross the south island, the legend, the frame and the sea.
- **Questions:** C17, F37.
- **Evidence:** P/frames/survey/desk-fit.png, P/frames/survey/desk-find-runestone.png
- **Fix:** clip the rings to the X's island, or fade them as the camera zooms out.

### L-25. The ravens' gift is a plain white bar (leave)
- **What:** the gift on the branch is a plain white bar, which reads as a glitch.
- **Question:** C14.
- **Evidence:** P/frames/finds/desk-ravens-2.png
- **Fix:** draw it as a small frame, or fade it once the popup shows.

### L-26. "HERE BE DEADLINES" crosses the coast hatching (leave)
- **Questions:** C17, F38.
- **Evidence:** P/frames/finds/desk-serpent-1.png
- **Fix:** move the label onto open sea.

### L-27. Clouds cut by edges, over the frame, under UI (leave)
- **What:**
  - At the overview the right edge cuts the clouds.
  - In explore the clouds straddle the chart frame and run behind "Back to the top".
  - On the phone, a cloud under the timeline shows through the stepper during the fade-in.
- **Questions:** I50, C17; my Q14.
- **Evidence:** P/frames/beats/joined-desk-map.png, P/frames/survey/desk-fit.png, P/frames/motion/handover-phone/f030.png

### L-28. Find hints are small and far from their find (polish)
- **What:** the find hints are 12 px, in Dim, on a pill 124 px above the bottom edge, about 300 px from the find they explain.
- **Questions:** E31, F38, F39, G42.
- **Evidence:** P/frames/finds/desk-hoard-lennard-1.png, P/frames/finds/desk-ravens-2.png
- **Fix:** in map.css line 300 (`.find-hint`), use 13 to 14 px in Note, and place the hint under the find.

### L-29. In the horn's view, sky stars read as TV static (leave)
- **What:** sky stars at a fixed screen density, next to sea dots enlarged by the zoom, read as TV static west of the frame.
- **Questions:** C14, F37.
- **Evidence:** P/frames/finds/desk-horn-1.png
- **Fix:** thin the sky stars by zoom whenever the chart's edge is on screen.

### L-30. The hammer game's first wave reads as a classic arcade layout (leave; Dan to judge)
- **What:** two rows of marching foes, three blocks of shield wall and the thrower at the bottom make the layout of a classic arcade shooter (rule M64).
- **Question:** M64.
- **Evidence:** P/frames/finds/desk-hammer-2.png
- **Fix, if Dan minds:** a staggered column of foes on the bridge and one continuous shield wall.

### Already known, seen again, not counted
- The card sits over its stop, with no link to its shield.
- The shields are one colour.
- The card's X sits outside the card.
- Cards scroll: Lennard on desktop; HMC, HMC again and Lennard at 412x730; all six at 360x640.
- The static stretch before the blast.
- The streams arrive from above.
- The wayfinder's VIDEO word. It is also cut, and is the biggest word, at the desktop Lennard beat and the Lennard hoard view, for the same cause: the wayfinder's words scale with the map.
- The horn's sounding view.
- The embers.

## 4. The walk (designed times, fake clock)

**Desktop, 1440x900, journey-joined.html**
- **0 s, the hero.** The eye goes to the name, then to the Photoshop window.
  - Doubt: "START THE JOURNEY" is 11 px tracked caps at the bottom left, in the same style as "PAUSE" at the bottom right. It reads as a caption, not as the way in (Dan's cue style; scrolling works too).
- **Press Start.**
  - 0 to 0.75 s: the hero lifts away smoothly. Delight: it moves as one page.
  - 0.75 to 1.05 s: near-black, with the hero's last row left behind. "Did it break?" (L-5)
  - 1.2 to 2.5 s: the coasts draw on. Delight.
  - 2.5 to 4.1 s: land, labels and clouds fade up.
  - 4.2 to 4.5 s: "Set out" fades in.
- **Map at rest.** The eye goes to the title, then the Red X, then the Red traveller.
  - Doubts: the mist reads as a smudge (L-9), the hoard scratches look like typos (L-11), and the rods beside the island puzzle (L-10).
  - Nothing says how many finds there are (L-1).
- **Set out.** A 3.2 s push-in, smooth. About 10 s reading the Laurier card.
- **Laurier to HMC, about 4 s.**
  - The card folds into its shield in about 0.4 s; the camera rises and glides, with no jerk in 150 ms frames.
  - At the start of the glide the labels stack (L-3).
  - The HMC card begins growing over the "HMC Connections" label (known).
  - The red marker rings catch the eye before the shields do (L-7).
- **The five glides.** Each takes 3.3 to 4 s, all in one rhythm; by the fourth it feels a little long. HMC again's report image lifts that card.
- **Next: the X, 2 s.** The legend fills the bottom (L-13); the playhead vanishes into Lennard's block (L-6).
- **Dig here.**
  - 0 to 0.7 s: the X warms.
  - 0.7 to 2.4 s: the streams arrive from above (known).
  - 2.4 to 3.0 s: near-still (known).
  - 3.0 s: the blast. A real surprise, with no white flash.
  - 3.4 to 5.0 s: the whole screen is red. "Is that it?"
  - 5.0 to 5.9 s: the footer rises and the name lands. Delight at the settled glow.
- **The end.** The eye goes to the name, then the heading, then "Let's talk". The control row mixes two button systems (L-18).
- **Explore.**
  - 0 to 0.4 s: the hint pops onto the fading name (L-16).
  - 0.5 to 1.6 s: the camera pulls out to the whole chart with its clouds. Delight.
  - Zooming in stops short of the journey's own close-ups (L-23), so the tree's creatures never become legible (L-4).
  - The remnant's rings cross the island (L-24).
- **Finds tried** (all eleven on desktop):
  - The horn's popup lands at the top, under the review switch (L-17).
  - The hints are small and far from their finds (L-28).
  - The hammer game's first wave reads as an arcade layout (L-30).
  - The ravens', serpent's, beacon's, rune stone's, well's and longship's plays read well.

**Dan's phone, 412x730, journey-joined.html**
- **Hero.** It fits. The review switch sits on the hero's "JOURNEY" link (preview only, not counted).
- **Start.** The foot rows hang for about 0.3 s, then about 0.45 s of black (L-5).
- **Map.**
  - It fits, and the 9 px labels are readable.
  - The legend reads "the work... the trail" (L-14).
  - The timeline strip stops at x 300 and there is no count (L-15, L-1).
  - Finds at the overview are 14 to 25 px targets (L-31).
- **Laurier.** The bottom sheet is clean (its empty piece frame is draft).
- **HMC.** The card's X closes it in about 0.45 s, the map undims and the stepper keeps "Next: Mohawk". Clear.
- **HMC again and Lennard.** The buttons are cut at the sheet's bottom (known: scrolling cards).
- **X and blast.** As on desktop. The end screen sits well and the name runs edge to edge.
- **Explore.** The whole map appears with "Pinch to zoom. Drag to look around."; a raven popup lands on the title (L-16).

## 5. Checked and clean; could not check

**Clean:**
- **Glides:** stop-to-stop glides are eased, with no end jump or wobble in 150 ms frames. A card's fold and grow are continuous.
- **Build-up and blast:** the X's strokes stay continuous through the build-up. There is no white flash, and the map comes back clean in explore.
- **Drawings clean at every zoom:** the Toronto skyline, the ravens and their tree, the wayfinder, the beacon and its beam, the longship, the rune stone and its rubbing sheet, the coast's double line, the trail, the traveller, the corner knots, the house, the signpost, the mountains.
- **Cards** at 1440x900, 1280x720, 1024x600 and 820x1180 form one type system: headline 26 px, 800, -0.02em; body 13.5 px; role 12.5 px. The logos share one height, the palettes are as specified, and Lennard's band and panel are as specified.
- **Footer:** the name runs edge to edge at 1440, 1280, 1024, 820, 412, 390 and 360. The heading wraps cleanly and the phone end is balanced.
- **Containers:** the popups share one container style, and so do the sheets.
- **Controls:** the card's X (44), the stepper (52 on phone) and "Let's talk" (46) are large enough.
- **Reduced motion** on desktop, at a glance: fine.
- **Console and network:** no errors, no requests.

**Could not check:**
- Real-time feel and frame rate on real hardware.
- Real touch gestures (pinch, swipe, wiping the mist), rotation mid-move, and the tab hidden and shown.
- Screen readers and keyboard focus order (auditor B's side).
- Other browsers.
- The hammer game past wave 1, and every foe up close.
- The serpent, longship and hoards on the phone.
- Whether the Next pill's focus ring shows after a real mouse press. It showed in my captures because focus moved there with no user input yet.

## 6. Top findings (under 300 words)

1. **L-1 (fix now):** the find counter is never visible. The timeline's ink plate (`.tl-bg`, `position: absolute`) paints over it on both pages at every size. One CSS rule (map.css line 178) brings it back.
2. **L-2 (fix now):** at 1280x720 the overview's kicker runs into Jormungandr's head and pad, and its rule into his body. The label check covers only 1440x900 and 390x844.
3. **L-3 (fix now):** Laurier's name and sub-line stack onto MOHAWKFJELL and its runes as one four-line block, and "the diploma climb" captions Yggdrasil instead of its stairs.
4. **L-4 (Dan's ask), Yggdrasil:**
   - What makes it messy: the crown is five separate cloud-like blobs and the hatching changes direction per blob. The trunk ends in a flat lid, limbs cross outlines and rootlets cross URD'S WELL. Nidhogg reads as a snail, Ratatoskr as a squiggle, and the right root trails off.
   - How to clean it: one crown silhouette, one hatch direction, a forked trunk, clipped limbs and roots, and bigger creatures (or none).
5. **L-8 and L-7:** strokes and markers scale with the map. At stops the ticks become combs and the X a fat brush stroke (a red check mark under "Set out" at Lennard's hoard), and the find markers outshine the stop shields.
6. **L-5:** the hand-over has 0.3 to 0.45 s of near-black, and the falling stars cannot be followed, so the hero and the map read as two pages.
7. **L-6:** the playhead vanishes into Lennard's block at the X, and Interkom's coral reads as the brand Red.
8. **L-31:** on Dan's phone, the shields (14 px) and the finds (14 to 25 px) at the overview are too small to tap.
9. **L-9 to L-12:** the mist, the serpent's coils, the hoard scratches, the horn and the hammer drawing read as a smudge, capsules, typos, a pipe and a jetty.
