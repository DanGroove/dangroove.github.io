# Journey page: the treasure map (prototype, build 1)

Read this whole file before writing anything.

## 1. What you are building

The part of Dan's journey page that comes after the hero: a tall treasure map of his schooling and career. A visitor sees the whole map first. As they scroll, the view pushes in and one red star travels a winding dotted trail from stop to stop. Each stop opens into a card in that place's own brand. Things along the trail can be played with. A timeline bar rides along the bottom. The trail ends at a red X that turns into a supernova, and the footer settles over its glow with Dan's name set giant.

This is a prototype for Dan to review: a static page, no dependencies, no build step, all inside `design/journey-map/`. A later build joins it to the real hero, which lives on another branch and is not in this checkout. Do not look for it. A stand-in hero block opens the page.

Dan approved these sketches: `reference/sheet-map.jpg` and `reference/sheet-cards-footer.jpg`. The script that drew them is `reference/round2.cjs`. It is reference only (do not run it), and it is your source for geometry, glyph drawings, colours and copy. Names from it are cited below.

## 2. Hard rules

The sandbox on this machine is off, so these matter.

- Create and change files only inside `design/journey-map/`. Never change `design/journey-map/reference/`, `design/journey-map/assets/` or this brief.
- Never touch any other path on the machine. Never run git. Never install anything. No network access, at build time or at run time.
- Do not start reviewer agents or sub-agents, even if your global instructions say to. The review of this work happens elsewhere. Do not leave a server running.
- You may run `node` on files inside `design/journey-map/` (syntax checks, the check tool, the pack tool).
- No frameworks, libraries or CDNs. Plain HTML, CSS and ES modules.
- Nothing from any game, film or show: no characters, names, logos, weapons, interface or art from God of War or anything else. The Norse lean in section 8 draws on the mythology itself, in this map's own line style.
- Never invent a testimonial, a client quote or a fact about Dan. Where copy is missing, use the placeholder lines given here.

## 3. Files to deliver

```
design/journey-map/
  index.html      loads map.css and main.mjs by relative path; <meta name="robots" content="noindex">
  map.css
  data.mjs        every fact, date, colour, label, line of copy and timing. No copy or colour literals anywhere else.
  art.mjs         every drawing as a function that returns an SVG string (map, glyphs, runes)
  stars.mjs       the star canvas
  trip.mjs        scroll progress, acts, camera, traveller
  cards.mjs  finds.mjs  timeline.mjs  footer.mjs
  main.mjs        wires it together
  tools/check.mjs data sanity checks (section 14)
  tools/pack.mjs  writes dist/journey-map.html, one offline file
  dist/journey-map.html
  BUILD.md        what you built, where it differs from this brief and why, known gaps
```

Module style, so that packing stays trivial: named exports only, named imports only and only from sibling files, no default exports, no dynamic imports, no top-level await, and every top-level name unique across all modules. `tools/pack.mjs` (Node, no dependencies) joins the modules in dependency order into one inline `<script type="module">` with import lines and `export` keywords removed, inlines `map.css`, and inlines the font and every image as base64 data URIs. The packed file must work opened straight from disk and must make no network request.

Font: Outfit, the variable file already in the repository at `public/holding/fonts/outfit-latin-wght-normal.woff2`. Read it from there; do not copy or change it. Titles are weight 800 with -0.02em tracking.

## 4. Look and motion rules

Tokens (CSS custom properties): Ink `#151314` (ground), Paper `#F7F6F3`, Red `#F0484F`, Line `#2E2B29`, Mid `#4A4541`, Dim `#9A948D`, Note `#C9C4BD`, Land `#1F1C1D`.

- The map is thin Paper lines on Ink, strokes about 1.1 px that do not thicken with zoom (`vector-effect: non-scaling-stroke`). Red is only for the traveller, the X, the numbered find markers and the timeline playhead. No other colour appears until a card opens, and then only that place's colours, inside the card.
- No giant strokes: no ring, band or border motif at the scale of the whole page. Keep every motif object-sized. Do not blend motifs into one device.
- An animation always moves the object that is already there. Nothing fades out to be replaced by a copy, and nothing respawns.
- Everything on the trip is a pure function of scroll progress, so it plays backwards when the visitor scrolls back. Only the finds run on their own clocks.

## 5. Data (`data.mjs`)

### Stops (real facts from Dan's resume; do not change them)

| id | name on the card | dates label | timeline spans | track | role line | crafts lit |
|---|---|---|---|---|---|---|
| laurier | Wilfrid Laurier University | 2016 to 2017 | 2016-09 to 2017-12 | school | Game Design and Development | screen |
| hmc1 | HMC Connections | Summers 2018 and 2020 | 2018-04 to 2018-08; 2020-06 to 2020-08 | work | Graphic designer, video editor, web designer | print, video, screen |
| mohawk | Mohawk College | 2019 to 2021 | 2019-01 to 2021-04 | school | Advanced Diploma, Graphic Design | print, screen |
| hmc2 | HMC Connections | 2021 to 2022 | 2021-06 to 2022-03 | work | Graphic designer, on contract | print, screen |
| interkom | Interkom | Autumn 2022 | 2022-09 to 2022-12 | work | Junior graphic designer, on contract | print, screen |
| lennard | Lennard Commercial Realty | 2023 to now | 2023-10 to 2024-03; 2024-04 to 2025-07; 2025-07 to now | work | Freelance, junior, now graphic designer | print, video, motion, screen |

The map is 600 by 900 units. Coasts are `A` and `Bz`, the trail is the spline `TR` through waypoints `W` (port `spline`). Stops sit at `W` indices 0 (laurier), 7 (hmc1), 17 (mohawk), 26 (hmc2), 29 (interkom), 35 (lennard); the X is at index 37. The trail crosses open water between the two islands at about indices 31 to 33: that is 2023.

"Crafts lit" is a draft for Dan to correct. Keep it in data.

### Card palettes

| id | logo file (`assets/logos/`) | layout | ground | text | sub text | button / button text | date pill / pill text |
|---|---|---|---|---|---|---|---|
| hmc1, hmc2 | `hmc.png` (white, transparent) | logo on the ground | `#1E345D` | `#FFFFFF` | `#B8C4DA` | `#0D7247` / `#FFFFFF` | `#0D7247` / `#FFFFFF` |
| laurier | `laurier.png` (on white) | white top band holds the logo, field below | `#330172` | `#FFFFFF` | `#CFC3E0` | `#EAA41E` / `#330172` | `#EAA41E` / `#330172` |
| mohawk | `mohawk.png` (on black) | logo on the ground | `#030303` | `#F4F4F4` | `#A3A3A3` | `#FB9632` / `#030303` | `#991030` / `#FFFFFF` |
| interkom | `interkom.png` (on cream) | logo on the ground | `#F7F3E2` | `#242021` | `#5E5A56` | `#E85155` / `#F7F3E2` | `#242021` / `#F7F3E2` |
| lennard | `lennard.png` (on white) | logo on the ground | `#FFFFFF` | `#706259` | `#706259` | `#706259` / `#FFFFFF` | `#F1EFEF` / `#706259` |

Lennard's card follows Lennard's own design system (Dan agreed to this on 22 Nov): a white ground, Warm Gray 11 (`#706259`) for all text, and one orange idea in PMS 1655 (`#FF4C00`), which is the headline, set at 22 px or larger. Nothing else on that card is orange except the logo. Its hairlines are Warm Gray 1 (`#D8D1CA`). Never use `#0F151E`, `#1A1A1A` or black on it.

Each palette therefore carries two more values. `headline`: the headline's colour, which is the text colour on the other five cards. `mark`: the colour used wherever a place's colour sits on the Ink ground (the lit stop mark, its timeline block, the mini-map), because several grounds are too dark or too light to show there: `#0D7247` for HMC, `#EAA41E` for Laurier, `#FB9632` for Mohawk, `#E85155` for Interkom, `#FF4C00` for Lennard.

HMC's navy and green were sampled from Dan's annual report and will be checked against HMC's brand guide. Every palette value must be changeable in this one table.

### Card copy (drafts in Dan's voice; he will rewrite them; keep them in data with `draft: true`)

- laurier. Headline "Where it started." Paragraph "I went to Laurier for game design. Systems, rules and play came first, before I ever chose graphic design." Took with me "Think about how someone moves through it." Piece: none yet.
- hmc1. Headline "First job, three hats." Paragraph "Two summers as the student who did design, video and web at once. I designed the SafetyDrivesUs logo and built its website, plus flyers and infographics." Took with me "One person can carry a job across print, video and web." Piece: none yet.
- mohawk. Headline "Where the craft got formal." Paragraph "Type, layout and critique, every week, until the reasons behind a good page became habit." Took with me "Type first." Piece: none yet.
- hmc2. Headline "Back as the designer." Paragraph "I came back on contract, redesigned hmcconnections.com, designed the 2020/2021 annual report and built the HMC anti-racism movement website." Took with me "Long documents are where a system proves itself." Piece: `assets/hmc-report.jpg`, caption "Annual report, 2020 to 2021".
- interkom. Headline "Agency pace." Paragraph "Four months, several clients at once: social graphics for Flato Markham Theatre, Art Windsor-Essex and JNAAG, and a redesign of Melanoma Canada's sixth edition booklet." Took with me "Switch brands without dropping the thread." Piece: none yet.
- lennard. Headline "All four crafts, one job." Paragraph "I started freelance, came on as a junior and became the graphic designer. I design the marketing for commercial listings, edit and animate LennieTV and the monthly Deal Board, and lay out The Q." Took with me "Carry the idea from first sketch to final cut." Three small steps on the card: Freelance 2023, Junior 2024, Graphic designer 2025. Piece: none yet.

Where a piece is missing, draw an empty frame in the card's sub text colour with the words "Piece to come".

### Acts (scroll lengths in viewport heights; keep them in one `ACTS` table so they are easy to retune)

hero 100, handoff 120, overview 70, push in 60, then for each stop a hold of 130, between stops a leg whose length is 0.45 times its trail length in map units, last leg to the X, then footer 320 (rush 80, morph and blast 90, settle 70, rest 80).

## 6. The page, act by act

One tall scrolling page. A sticky stage fills the viewport and everything inside it is driven by scroll progress.

1. **Stand-in hero.** Ink ground, a field of about 420 stars on a canvas (a few Red), slow drift, slight parallax to the pointer. Small Dim caption "The hero goes here". One Red star among them is the traveller.
2. **Hand-off.** The stars fall and settle as the dots of the trail: every trail dot is a star, and it stays that star for the rest of the page (draw the trail's dots on the star canvas through the camera transform; do not replace them with an SVG dotted line). The coasts draw themselves on, the landmarks and labels fade up, and the Red star lands on the first stop. Stars without a place on the trail stay as faint sparkle on the sea.
3. **Overview.** The whole map sits inside the viewport (contain, with margin) so the shape of the journey reads at once. Title "The saga so far", small caps line "A MAP OF HOW I GOT HERE, 2016 TO NOW". The timeline bar slides up. Quiet cue: "Scroll to set out".
4. **Push in.** The camera scales to about 3.2 times the overview scale (2.6 on phones), centred near the first stop. A mini-map appears in a corner: coasts, trail, stops, the traveller, and a frame showing the current view. Tapping a stop on it jumps there.
5. **The trip.** The traveller follows the trail. Behind it the trail is a solid Paper line (an SVG path revealed by dash offset), ahead of it only the star dots. The camera keeps the traveller near 45 percent across and 55 percent down, and is smoothed by averaging the path over a small window of progress, never by a time-based spring. During the water crossing the traveller rides the longship (section 9, find 11).
6. **A stop.** The camera pushes in a further 1.35 times and the map dims to 35 percent. The stop's mark grows into the card: the card is the same element as the mark, scaled up from the mark's position, and its content fades in once it is past 40 percent of its size. Scrolling on folds it back into the mark, which then stays filled in that place's `mark` colour.
7. **The X and the footer.** Section 11.

## 7. Cards

Real HTML text. About 640 by 420 on desktop, centred on the stage. One skeleton for all six:

1. The place's logo, and a date pill.
2. Headline (Outfit 800), then the role line.
3. The paragraph.
4. A small caps label "WHAT I TOOK WITH ME" and its line.
5. The piece (image or empty frame) with its caption.
6. Four small stripes, one per craft (Print, Video, Motion, Screen), lit for that stop's crafts.
7. A button "See the case study" with an arrow. It does nothing in the prototype.

Ground, text, button and pill colours come from the palette table. The page's own frame (map, timeline, traveller) stays Ink, Paper and Red around the card.

## 8. The Norse lean

Dan asked to lean into Norse mythology. Start from the map as drawn in `bigMap()` and make these changes, all in the same thin-line style as the reference glyphs:

- Title becomes "The saga so far".
- Each stop's mark is a small standing stone carved with the Elder Futhark rune of its initial (L, H, M, H, I, L). The stop labels keep the real names and dates.
- Region labels: "LAURIER LANDING" becomes "LAURIERVIK", "THE NORTH WOODS" becomes "THE IRONWOOD", "MOUNT MOHAWK" becomes "MOHAWKFJELL", "LENNARD CITY" becomes "LENNARDGARD". Keep "THE MARGINS, left intentionally blank", "KERNING NARROWS", "SEA OF REVISIONS", "the road not taken: game dev", "the diploma climb" and "the 2023 crossing". "the fog of 2020" becomes "the mist of 2020".
- Yggdrasil: one great ash beside the well in the middle of the main island, about 70 units tall, roots reaching toward the water. Small label "YGGDRASIL". It is a landmark, not a frame for the page.
- The frame keeps its ruler ticks. Add one small interlace knot (about 22 units) in each corner. No continuous knotwork border.
- Runes: `art.mjs` exports the 24 Elder Futhark runes as straight strokes on a small grid, and a function that sets a word in them (c, k, q to kaunan; v, w to wunjo; j, y to jera; x to kaunan plus sowilo; th to thurisaz; ng to ingwaz; spaces as gaps). Use them on the stones, around the wayfinder, on the rune stone, for the beacon's notes, and as a tiny second line under the four renamed regions.
- The finds change as listed in section 9.
- The footer takes no Norse dressing. The star left above the name is enough.

## 9. Finds

Eleven things to play with. Each is keyboard focusable with a spoken label, takes under five seconds, never blocks scrolling, and closes with Escape or by scrolling on. Keep each where its counterpart sits in `bigMap()`. Numbered Red markers sit beside the six main ones. A count, "0 of 11 found", sits at the right end of the timeline bar.

Main finds:

1. **The wayfinder** (was the compass). An eight-armed stave inside a ring of runes: four long arms for Print, Video, Motion and Screen, four short arms between them, each arm ending in a different small terminal. At rest the needle drifts a few degrees. Drag it, tap an arm, or use the arrow keys to pick a craft: that word turns Red, every stop and hoard of that craft lights up, and the rest of the map dims to 55 percent. Tap the centre to clear.
2. **Hoards** (the chests). Five, each near a stop, marked by a small scratch in the ground. Tap: the chest digs itself up, the lid pops, eight stars burst out, and a small card floats up with the title of a piece from that stop and a "See the case study" link that does nothing yet. Titles: "SafetyDrivesUs logo and website" (hmc1), "2020/2021 annual report" with `assets/hmc-report.jpg` (hmc2), "Melanoma Canada booklet" (interkom), "1 King Street W flyer" (lennard), "Piece to come" (the fifth).
3. **Huginn and Muninn** (was the spyglass). Two ravens on a standing stone on the north-east headland. Their heads follow the pointer. Tap: one flies a short loop and lands with a small frame that opens into a 16:9 player for five seconds, then closes like an iris, and the raven hops back. There is no video file yet: play a placeholder (a progress ring, a timecode from 00:00 to 00:05, three moving shapes).
4. **The serpent** (Jörmungandr), in the north-east sea under the label "HERE BE DEADLINES". Loops rising from the waves, with one simple over-and-under knot in its coils, about 110 units wide. Its head turns up to 25 degrees toward the pointer. Poke it: the loops sink in turn, ripples spread, and it surfaces about a second later with a calendar leaf in its teeth and one line. Three placeholder lines in data, in rotation: "A deadline story goes here."
5. **The beacon** (was the lighthouse), on Interkom's headland: a stone watchtower with a fire basket. Its beam, a soft 22 degree cone, sweeps slowly by itself. Drag to aim it. Where the light lands, notes carved in runes show on the map, and after 0.4 seconds in the light the same line appears in plain English beneath them. Four notes in data, placeholders: "A note in invisible ink goes here."
6. **The rune stone** (was the wanted poster). A standing stone with a carved serpent band and one line of runes. Tap: the carving traces itself in Red, then a sheet peels off the face like a rubbing and unrolls to full size as a printed piece. Use the poster from the reference (`p6`): "WANTED", "ONE DESIGNER", "who sees a job through, from first sketch to final cut", "REWARD: THE WORK". A flip control shows the back, with two placeholder lines: "Stock: to come" and "The brief: to come".

Small finds:

7. **Hnefatafl board** at Laurier (was the dice): a small 7 by 7 board. Tap and one piece slides a square, with a line beneath. Placeholder: "A fact from the game design year goes here."
8. **The mist of 2020** over the trail south of Mohawk: wipe it away with the pointer or a finger. It stays wiped.
9. **A horn** on the west shore (was the bottle): tap to raise it. "Skál." Then the placeholder "A line from someone I worked with goes here."
10. **Urd's Well** (was Lake Undo), beside Yggdrasil, sub-label "what was, again": tap and its ripples run inward, and the last find you opened closes itself.
11. **The longship** (was the ship): a square sail, a curled prow, shields along the rail. It carries the traveller across the water as part of the trip. Tap it for the placeholder "2023: Dan to write this line."

## 10. Timeline bar

Pinned to the bottom from the overview to the footer. About 56 px tall on desktop and 44 on phones. A quiet instrument, never the focus.

- A ruler from 2016 to now with a tick and a two-digit label per year. Two tracks: school above, work below (the 2020 HMC summer overlaps Mohawk, and two tracks show that honestly).
- One block per timeline span, Mid until its stop has been visited, then that place's `mark` colour.
- A Red playhead locked to the traveller. Map progress to dates piecewise: a stop's hold covers its spans, a leg covers the gap between them.
- Drag the playhead to scrub (it scrolls the page). Click a block to jump to that stop. Left and right arrow keys step between stops. Hover or focus shows the name and dates. Expose it as a slider with a spoken value such as "Mohawk College, 2019 to 2021".
- While a card is open it thins to a hairline. In the footer the same element moves and becomes the rule under the name.

## 11. The X, the supernova and the footer

Follow the four frames and the morph strip on `reference/sheet-cards-footer.jpg` (`f1` to `f4`, `morph`, `fx`).

1. The traveller reaches the red X on the south island. Nearby stars begin to lean toward it.
2. Every star on the page rushes in on curved paths. The two strokes of the X thin, turn white from the centre and stretch into four long tapered spikes. These are the same two stroke elements throughout.
3. It blows: a ring expands, streaks fly out, the stars are thrown past the edges of the screen. This is the page's one loud moment. No full-screen white flash.
4. It settles. A Red glow with a warmer core (`#FF8A4C`) stays up and to the right of centre, with a small four-spiked star and two faint rings. The footer rises 24 px and fades in, in this order:
   - "Got an idea that needs carrying to the final cut?" in Outfit 800, with a Red pill button "Let's talk" (Ink text, arrow).
   - "Danial Endrawes" in Outfit 800 with -0.02em tracking, fitted so it runs the full content width, edge to edge. Refit on resize.
   - "From first sketch to final cut, and everything in between." under the name.
   - The rule (the timeline, settled), with a Red dot at its right end.
   - Links on the row below: "Case studies" and "Work" with small up-right arrows at the left, "LINKEDIN / EMAIL / RESUME" in small caps at the right.

Every link and button here is inert in the prototype: no `href` to anywhere, no `mailto:`, no web addresses in the file.

## 12. Phones, reduced motion, keyboard

- Up to 640 px wide: the overview still shows the whole map. Cards open as bottom sheets, full width, up to 82 percent of the height, scrolling inside if they must. The mini-map is hidden. The timeline is a strip you can swipe. Finds work by tap. Check 390 by 844.
- `prefers-reduced-motion: reduce`: no camera travel and no flying stars. The page is the map at overview, then the six cards as ordinary stacked sections, with the timeline as a sticky jump menu, then the footer with its glow already settled. Finds change state without motion.
- Semantics: one `main`, each card an `article` with an `h2`, finds as buttons, visible focus rings (2 px Paper, 2 px offset).

## 13. Performance floor

Animate only transform and opacity on DOM and SVG nodes. One `requestAnimationFrame` loop, paused when the tab is hidden. The star canvas uses the device pixel ratio, capped at 2. Build the map SVG once. Read layout only on load and resize, never inside the frame loop. Aim for a steady 60 frames a second on an ordinary laptop. Keep the unpacked CSS and JavaScript under 300 KB.

## 14. Checks to run before you finish

1. `node --check` on every `.mjs` file.
2. `node tools/check.mjs`: six stops with their spans in order, every palette complete, eleven finds with unique ids and spoken labels, the `ACTS` table adds up, no empty copy.
3. `node tools/pack.mjs` exits cleanly, and the packed file contains none of: `src="http`, `url(http`, `@import`, `fetch(`, `mailto:`, `href="http`.
4. Read your own modules once more against sections 2, 4 and 9.

## 15. BUILD.md

Short and plain: what each file does, the sizes of the unpacked code and of the packed file, every place you departed from this brief and why, and what you could not finish or could not check without a browser. Do not claim a visual check you did not make.
