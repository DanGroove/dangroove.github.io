# Journey hero, second take

Round 17, critique round 1 applies C1–C3: phone/tablet picture undersides rest on the glass and their tops sit 0.002 above it; the phone island's top is 0.0648. Each separate object's body sets its sink depth, and carried layers clip and disappear with that body. Finished-picture crops include their raster fringe (and any outer stroke), including the Illustrator maps, InDesign's drawn regions and Figma's wireframe fragments. BUILD.md records all heights, depths, before/after crossings, crop padding and controls. The loop and every action clock remain unchanged.

This is the unpublished prototype. `CORRECTIONS-17.md` controls the current revision: registered construction, continuous levels, carried exports in front, one ballistic launch, immediate split, slower sinks, two After Effects plays on stationary device faces, and the laptop flush and closed before sinking. R12 unifies the phone and tablet models, enlarges the space-grey laptop 1.4 times, redraws the exported screens without bars or stretching, and pins the default camera fit. The round 17 follow-up restores InDesign’s finished page face to 0.080 from placement onward and preserves antialiased typed lettering with masks coloured from the finished artwork. `CORRECTIONS-16.md` (the star ring round the logo is centred by eye and goes all the way round, held stars tremble before the blast, and a hold keeps gathering), `CORRECTIONS-15.md` (Export pops a red ball that arcs to the floor, splits into one red block per format and is wiped into the formats; the exports sink into the floor at the end; no selection outline on InDesign's map; dragged pictures slide flat), `CORRECTIONS-13.md` (U1 and I2; its drop and backwards return are replaced by round 15's ball and sink; U1 aligns the UX/UI front edges (R12 makes the tablet reach 0.11 behind the enlarged deck); I2 squares InDesign's row behind with the open copy), `CORRECTIONS-14.md` (the craft list changes with a letter roll, replacing round 12's selection box and round 11's red hairline wipe) and `CORRECTIONS-12.md` (300 stars before the logo; phones in true proportion to their tablets, InDesign without frame drawing, and one export shift) control this revision, on top of `CORRECTIONS-10.md` (gathered stars ease into the mark's look and blasted stars ease back to their own), `CORRECTIONS-9.md` (a long hold draws the DG mark in stars), `CORRECTIONS-8.md` (the name reacts as the live page's headline does, a star field behind the hero with hold-and-blast, no floor hover, and no frames lifting while a picture is carried), `CORRECTIONS-7.md` (one hand easing for the cursor, longer moves taking longer), `CORRECTIONS-6.md` (the one-time entrance and the labels' exit), `CORRECTIONS-5.md` and its second addendum after `d7e0de5`; rounds 1–4 and the motion briefs supply the retained rules. The allowed range is 70–100 seconds (raised from 86 for round 7's K2, and from 92 for round 15's ball). The screen's middle is world x 0.200; every export group and the light pool sit `EXPORT_SHIFT` (-0.3) to its left, at -0.100 (round 12, X1). Waits never click. The loop is **99.490895 seconds at PACE 1** (97.890895 in the first round 17 build; 97.691 in rounds 15–16; 91.591 in rounds 13–14, 88.500 in round 12, 91.498 in rounds 7-11, 83.040 before round 7; scenes 8.046, 13.148, 20.788, 17.581, 15.982 and 16.045 s; round 13's drop and its 0.6 s return lengthened the four exporting scenes; round 15's ball and 0.5 s sink lengthen them again, to 22.238, 19.031, 17.432 and 17.795 s). Every document opens empty and is built by one cursor, except InDesign's, which opens with its blank pages already there (round 12, I1). Round 5 adds the lasting spread draw, longer InDesign labels, lower-left-facing laptop, measured text offsets, wide-screen centring and floor hover. The supplied browser review accepts H9/H10 and the rest of round 5. H11 keeps phone craft numbers in their own columns; H12 centres from the name's ink and lede/craft-list boxes, independently of word wrapping. Those two fixes have Node evidence and exact negative controls in BUILD.md; their browser checks remain external. The committed hardware reports measure incoming `48aea47`.

## The design being carried forward

The approved six stills and the earlier browser review are the reference. The screen stays large and detailed enough to read as a real app. Its rails, panel hierarchy, document proportions, square corners, Outfit, ink, paper and red stay. The flyer's landscape pages keep their black, charcoal, two golds, woven grounds, asymmetric photographs and dense map structure. The firm's mark and the building's mark are blobs. No contact details or names from the source flyer are included.

Graphic design is one pipeline: Photoshop's photograph goes to the dock; Illustrator's two maps join it; InDesign places those same assets into the spread, cover, post and e-blast. Only the finished InDesign group reaches the floor. A closed stack sits behind the reading copy, alongside a phone and tablet. The reading copy still bends through fourteen strips per leaf, through The Offering, Location, Amenities and the gallery.

Video and motion retain their landscape tablet and two phones. UX/UI uses an open laptop facing world +z (lower left), a portrait tablet and one phone. Every complete footprint, including the laptop deck and lid, is centred on `SCREEN.l + SCREEN.w / 2 + EXPORT_SHIFT` in world x (`EXPORT_SHIFT` = -0.3 in `stage.mjs`, round 12 X1: one number moves the InDesign block and its booklet's reading place, both device mats, the UX/UI row, the ball's resting place and its red blocks, and the light pool). The light pool shares that middle. R12 uses one 77.6:163.0 phone (0.515044 × 1.081858, 0.05 thick, rim 0.014602) and one 179.5:248.6 tablet (1.191372 × 1.65, 0.04 thick, rim 0.073359). Phone screens are 9:19.5; tablet screens are 1640:2360, turned for landscape. Both have metal sides and black glass, tones `#ABA59E / #121111 / #4A4541`, e-up 0.35 and e-around 0.16 / 0.1 respectively. The tablet has one 0.018 lens on its long-side bezel; the phone has one 0.142513 × 0.038867 hardware island, 0.019434 inside the top of its screen, at a fixed face 0.0628. Pictures contain no islands. The phone is 0.655672 of the portrait tablet's depth and 0.908078 of its landscape depth; front edges align and groups stay centred. The slot remains the undrawn plane at `MAT.z`, shifted with the Figma row to `MAT.z + UI_ROW.forward` for H10; since round 15 nothing enters in x: every export is made on its own footprint from the ball, and every export leaves by sinking straight down through the floor.

| Middle | World x |
| --- | ---: |
| Screen | 0.200 |
| InDesign block | -0.100 |
| Premiere Pro row | -0.100 |
| After Effects row | -0.100 |
| Figma row | -0.100 |
| Light pool | -0.100 |

The prior build was reviewed in Chromium on 19 November 2026, with held frames on desktop and phone, a pixel comparison of its stills, and an offline preview checked for requests. The second pass was then reviewed in a real browser: stacked pictures flickered, the comp's construction was hidden, typing was too fast, and Photoshop needed clearer, better-paced edits. Those findings are the evidence for this correction. The corrective revision was then reviewed the same way on 19 November 2026 (Chromium with software rendering): held frames at each corrected moment (Photoshop's sky, both healed distractions and the graded photo; Premiere Pro's typed caption; After Effects' typed words; the playing devices of the last three apps) show no flicker, ghost or garbled text; a film of the whole loop reads cleanly; and the offline preview runs at desktop and phone size with no requests and no errors. The committed hardware runs below measure incoming `48aea47`; they do not measure round 3. **Still unmeasured:** phones, Safari and Firefox.

## What runs the show

- `stage.mjs`: PACE, the action scheduler, six scripts, shell, dock, floor and shared finished-piece players. `SHOW`, `LOOP`, `sceneAt`, `frameAt`, `SCENES`, `CRAFT`, `BLOCK`, `SCREEN`, `MAT` and `floorAt` keep their meanings. `SCRIPTS` exposes the derived action times for checks and review; `POOL` supplies the light's centre.
- `art.mjs`: the approved pictures, staged photograph and map drawings, letter-only companions with opaque support masks coloured from the finished picture, opaque text prefixes and measured text regions and device chrome. Fonts are measured when the atlas is made, including rotated map lettering. The atlas occupies five pages, each no larger than 2048 square.
- `sq.mjs`: the existing WebGL2 renderer. A carried InDesign stack's colour lift retains its original shadow-caster position through `shadowP`. Its world clip plane covers colour, outline and shadow; its light mesh handles sharp pieces; its atlas supports pages and a second independently addressed page for per-pixel picture mixing.
- `kit.mjs`: the existing piece geometry helpers, unchanged.
- `play.mjs`, `stills.mjs`, `stage.html`: player, approved-pose entry points, and individual scene/atlas inspection. Both players read `view.mjs`'s `DEFAULT_FIT` at the default camera: w 6.472556630033903, h 7.02662378036781, x 0.4431895737378033, y 1.9701472394822923. Turned yaw/pitch cameras still fit the six stills with 0.5-unit padding. A shared fit solves both label columns at the largest feasible scale and keeps the stage within 16 px side gutters down to 280 px. The backing store is capped at 2x and 5.2 million device pixels. Node checks cover the whole loop and dense booklet poses at 1440 × 900 and 390 × 664, including the leaves at their widest. A paused craft choice now uses its finished still; graphic design uses InDesign. Reduced motion never starts playback. Hidden/off-screen states stop drawing.
- `tools/checks.mjs`: Node geometry, actions, clocks, atlas, player logic and offline-module checks. Every sampled frame checks at least 0.0006 height separation between overlapping screen/floor faces, independent viewer/device stacks with 0.0008 painter steps and interaction marks above the pictures. Regression checks cover typing minimums, comp/thumbnail construction, heal coverage, completed photo stacks, sky colours and Photoshop timings. Its canvas and DOM stand-ins are logic checks, not pixel renders.
- `tools/preview.mjs`: the offline frame packer, titled **Journey hero take two**, with stylesheet, four local font files and all modules embedded. No bundler, network or installation is needed.
- `labels.mjs`: one reused SVG/text overlay, projected by the canvas camera, with measured word widths, content avoidance and deterministic hero-time rings. Both players use it.
- `take-2.css`, `page-layout.mjs`, `view.mjs`: take-two-only text alignment, guarded upward offset and scene placement. The stylesheet loads after the borrowed `journey.css` and is inlined by the preview packer. Font ink is measured with actual glyph metrics and DOM character positions, including wrapped text. Both name lines use weight 800 for their left offset. First-column craft numbers share the lede's ink edge; other columns remove only their own number's side bearing. The scene's text-right input is the maximum of name ink and lede/craft-list box rights. The name's weight animates only in the round 6 entrance (`entrance.mjs`); the CSS `name-in` animation is switched off in `take-2.css`. Text and word measurements are cached; playback performs no layout reads. Resize, font loading and the name's weight animation refresh the cache. The side gutter ramps continuously from 40 to 64 px between widths 1120 and 1200 to avoid the inherited breakpoint jump.
- `entrance.mjs` (round 6, `CORRECTIONS-6.md`): the one-time entrance on first load, about 1.4 s, timed from the first frame that can draw. The DG mark wipes in (0–0.30), Journey and Contact cut in (0.24, 0.30), each name line wipes up from its baseline while its weight goes 300→800 (Danial 0.08–0.40, Endrawes 0.16–0.48), the lede wipes in line by line (0.40–0.75), the craft hairlines draw with each row's number and word cutting in as the line passes (0.55–0.95), the floor's dots and pool switch on inside a hard circle growing from the pool's centre (0.20–0.90), the app screen and its shadow are revealed by a world clip plane rising from its bottom edge (0.50–1.10), and Scroll for the journey and Pause cut in (1.10, 1.20). The loop's clock starts at 0 at 1.10; on that first pass the Photoshop shell starts as itself (`frameAt(t, { first: true })`). Only clip-path, the name's weight and renderer uniforms (`look.reveal`, `floor.reveal`) change per frame. A click on a craft, the stage or Pause ends it at once and then acts; seek, reduced-motion change and `__hero.entrance(null)` also end it. The floor hover starts at 0.90. Reduced motion and `?t=` get no entrance. Until the first frame, `take-2.css` hides the entering parts only under `(scripting: enabled)` and no reduced-motion preference. `window.__hero.entrance(time)` holds the entrance at `time` (0–1.4) and draws it; `__hero.entrance(null)` ends the hold and plays on; `__hero.entering` reads the entrance clock (null when none). `tools/entrance-checks.mjs` checks the timetable and the player in Node, with two negative controls; `checks.mjs` runs both.
- Labels' exit (round 6, E4): each label leaves as its entrance played backwards, ending at the old cut (`off`): the word wipes back toward its line's end over off−0.30…off−0.20 s, then the line retracts into its mark until `off`, where the ring and mark cut out as before (`calloutsAt` in `stage.mjs`; values are the smaller of entrance and exit). No timing or the loop moves.
- Floor hover (round 5's `floor-hover.mjs`): removed in round 8 (F3). The floor's dots, pool and click are otherwise as before; the floor reacts to nothing on hover.
- `name-react.mjs` (round 8, N1): the name reacts as the live page's headline (`public/holding/title.js`) does, with its numbers. A red copy (`#F0484F`) shows inside a circle of 0.95 em around a mouse pointer, opening within 1.2 em of the name's box; the letters within 1.3 em lift up to 0.07 em on title.js's spring; a click or tap knocks them up 0.16 em in a wave (55 ms per em from where it landed). The flow text in each `.name-line` is never split: once live it is painted transparent and an overlay of the same letters (CSS generated content at each letter's measured pen position, so no new text reaches the page's ink measurement or screen readers) and its red copy draw it. Only transform and clip-path change per frame; geometry is read on resize, scroll and fonts ready. Live only after the entrance ends (off while it plays or is held with `__hero.entrance(t)`) and never with reduced motion. A click on the name does not change the craft. `window.__hero.name` reads `{ live, open, lift }`.
- `stars.mjs` (round 8, B1/B2): the star field behind the whole hero, drawn by the renderer as its first pass (one `gl.POINTS` draw, `sq.mjs`), under the scene and the page's text. About 1,200 stars at 1440 × 900 (scaled with the area, at most 2,000), depth 0–1: 0.6–2.2 px, paper (3 % red `#F0484F`) mixed 12–55 % into ink, no fades. Mouse parallax: −(pointer fraction) × 28 px × (0.12 + 0.88 d²), followed critically damped (0.3 s); scroll parallax: near stars up to 12 % faster than the page. Stirring: the pointer's path since the last frame pushes stars within 60 px along it, `(1 − smoothstep(0, 60, r))²`, with its speed capped at 1,500 px/s; each star (hashed mass 0.6–1.6) coasts (drag 2.3/√mass) and returns home on e^−age, under 40 px. Hold to gather: a mouse or pen press anywhere in the hero except links, buttons and the name captures stars within 80 + 260 × min(1, held/2.5) px into a slowly turning cluster; release blasts them out at (300 + 1700 × min(1, held/2.5))/mass px/s, weaker for stars within twice the radius; offsets stay under 45 % of the hero's width. Round 9 (L1): from 1.4 s held the cluster stops turning and the captured stars form the DG mark, sampled from the page's own `[data-mark]` SVG paths (`sampleMark`, farthest-point order, 600 points prepared at measure time; paper paths are G, the red path D), 20 % of the hero's height (180 px at 1440 × 900), centred on the hold's anchor and clamped 16 px inside the hero; each star goes to its point critically damped from rest (τ 0.12 s) and, within 1 px, cuts to paper `#F7F6F3` (G) or red `#F0484F` (D) at 2.6 px, cutting back only at home; stars beyond the points turn in a ring outside the mark; captured stars draw in front of the scene (a second POINTS draw while any is out). A star that starts falling home after a kick never grows or swings past home again. A stage press under 0.25 s that moves under 6 px is still a click (next craft); a longer press does not change the craft. The stars switch on in rings from the stage's centre at 0.20–0.90 s of the entrance. Reduced motion: static; touch: scroll parallax only; Pause stops the loop, not the field. The floor shader now writes its colour premultiplied, unchanged over ink, so the field shows only where the floor adds nothing. `?stars=0` turns the field off for review; `window.__hero.stars` reads its state (round 9 adds `flags` and `mark`: points, height, formed, assigned, arrived, ring, front, centre). Round 10 (R1, R2): no more cuts in the stars' look. The pass behind now draws every star in its own look, and the pass in front draws each star that is out again over it: a captured star's front copy fades in over 0.4 s, eases from its own colour and size to the mark's by m = 1 − (distance to its point past 1 px) / (that distance when given the point), exactly 1 on arrival (ring stars keep their own look), keeps that mix at the release, and fades out on the way home by w = offset / largest offset since the release (1 until the offset falls), at most 0.09 a frame for either weight, so a star comes home at w ≤ 0.02 and leaves the front pass with no pop (`__hero.stars` adds `weights`, `alpha` and `mixes`). Round 12 (S1): the formation starts once the hold has captured `STARS.mark.threshold` (300) stars, not at 1.4 s: about 2.4 s held in the middle at 1440 × 900. Short of 300 at 2.5 s (near an edge), the capture radius keeps growing at 104 px/s until 300 are caught (about 5.4 s and 640 px in a corner), or to the hero's diagonal, where the logo forms with what it has; once formed it stops. The blast's impulse is still capped at 2.5 s (`__hero.stars` adds `radius`; `mark` adds `captured`). Round 16 (R1–R5): the growth no longer stops at the formation, so a still hold completes the mark and then fills the ring, up to the hero's diagonal. The ring is centred on the mark's weight (the mean of its points; at 1474 × 996, 16.5 px toward the D from the box centre), a band from the farthest point + `ringGap` (0.095) × the mark's height, `ringBand` (0.10) × the height deep (172.5–192.4 px there), each star at its own hashed radius in it. It goes all the way round: N equal slots in the ring's turning frame, each star off its slot's middle by its own jitter (under 0.35 slot), joiners put in order by angle and the slots placed by a circular mean so members move least; no star passes another; it turns at `STARS.hold.turn`. The mark is clamped so the mark and the whole band stay 16 px inside the hero. From 5.6 s after the formation, about 8 s into a hold in the middle (1.5 s as round 16 built it; Dan found that too soon and chose about 8 s), every captured star trembles, rising with `smooth` to 1.5 px over 2 s, each at its own 10–16 Hz on x and y (`STARS.charge`); the blast starts from where it is shown. `mark.ring` is now `{ centre, radius, phase, count }` and `mark.charge` the tremble's amplitude.
- `stage.mjs` G1 (round 8): while a drag carries pieces (`carriedStack`: the current action's travel pieces and the cursor), `separateFaces()` places everything else as if the stack were not there, so nothing it passes over moves; the stack keeps its own place, InDesign's `liftDragStack` runs as before, and `clearCarried` lifts the stack along the view (no move on the page) only where it would tie with a face it passes over. `frameAt(t, { withoutCarried: true })` builds a frame without the stack, for the check. Premiere's music drag now names its action like the other drags.
- `tools/round8-checks.mjs` (run by `checks.mjs`): N1's model against title.js's numbers and the player's gate, F3, B1, B2, G1 and one negative control each.
- `tools/round9-checks.mjs` (run by `checks.mjs`; `--controls` alone): L1's sampler on the mark read from `public/journey/index.html` (inside its own path, gaps, D share), timing, formation, colour, overflow, release and clicks, with three negative controls.
- `tools/round10-checks.mjs` (run by `checks.mjs`; `--controls` alone): R2's fade-in and mark weight during the hold, R1's return weight after the release, and the two passes through a WebGL call recorder on the real renderer, with two negative controls (round 9's cut on arrival; w held at 1 until home).
- `craft-wipe.mjs` (round 14, K1; replaces round 12's selection box and round 11's red rule, keeping the file name and its seams): the craft list changes with a letter roll. At rest the current row's number is red `#F0484F` and its text paper, the others muted, the hairlines bare. Every glyph of a row (two digits, then the label's letters, spaces included) has an out copy (the button's own colour: muted, or paper under hover) and an in copy (paper; red for the digits) stacked in a hard mask the height of the line box with 0.2 em of slack either side. A glyph's roll moves the out copy up by 110 % and brings the in copy up from 110 % to 0, 0.38 s with `EASE.wipe`, glyph i starting i × 0.018 s after the change ("Graphic design", 16 glyphs, ends at 0.65 s); the old row rolls back down at once on the same timetable. A change during a change sends each glyph of a row whose target changed on from where it is. The glyphs are an `aria-hidden` overlay at pen positions measured from the flow text (as `name-react.mjs` does), so kerning and tracking are kept; the flow text keeps the layout and is what screen readers read, painted transparent only while the overlay is live. Per frame only the copies' `transform` is written; geometry on measure. Own clock; runs from the craft actually current; the entrance sets it (the current row appears lit as its row cuts in); reduced motion cuts (overlay off, journey.css's `aria-current` colours). `__hero.crafts(p)` holds the latest change at p (0–1 over its whole length), `null` lets it run; `__hero.craftWipe` reads `{ current, changes, held, busy, length, live, rolls, lit, touched, shown }`.
- `tools/round12-stars-list-checks.mjs` (run by `checks.mjs`; `--controls` alone; replaces `round11-checks.mjs`): S1 (no point before 300 captured, the middle's start, the corner radius growing on at 104 px/s, past the formation since round 16, a hero short of 300 forming at its diagonal, the blast unchanged), with its negative control. Its L2 checks went with the selection box in round 14.
- `tools/round17-checks.mjs` (run by `checks.mjs`; `--controls` alone): retained R1–R11/G gates plus F1’s absolute page/landing heights, F2’s stationary bodies and screen faces through both plays/restarts and independent painter probes, and F3’s mask coverage/finished-RGB data path for all 54 companions. Fourteen in-memory controls include raised pages, shared floor/screen stacks, one AE play and a 0.5 mask threshold. Pixel fixtures do not rasterise fonts or replace the external browser review.
- `tools/round16-checks.mjs` (run by `checks.mjs`; `--controls` alone): R1 (weight, band, centre, clearances at 1474 × 996), R2 (a sweep and round 9's 40-point hold: order every frame, each join's moves, the phase, the spin, then the band, slots, jitter and gaps), R3 (24 still holds at the edges and corners of three sizes, and the fallbacks), R4 (the tremble's ramp, its own frequencies, the untouched model, the release) and R5 (the radius every frame; the ring's count at 4–8 s), with ten negative controls.
- `tools/round14-checks.mjs` (run by `checks.mjs`; `--controls` alone): K1 on the pure model (one change against the timetable and exactly at rest, the glyph order, a change 0.2 s into a change with no copy moving more per 60 fps frame than `EASE.wipe` allows, 01 to 03 touching only its two rows, reduced motion, the entrance and the loop's first start, the loop's changes, the sources), with two negative controls (every glyph together; a restart from rest).
- `tools/round13-checks.mjs` (run by `checks.mjs`; `--controls` alone): U1 and I2 row geometry with one negative control each. Its E1/E2 drop and return sweeps and their three controls were retired in round 15 with the drop they checked.
- `tools/round15-checks.mjs` (run by `checks.mjs`; `--controls` alone): S1/S2 every 0.01 s through each export and sink (nothing before Export; the pop inside the button and full size at its end; a true parabola with x and z linear, never below the floor or through the screen, inside the stage's box; resting on the floor at the blocks' centre; no bounce; the split from the ball to the exact blocks; one wipe plane with two signs moving left to right; no play before its wipe or the lid; the rest pose equal to `e1e55af`'s, from `tools/fixtures/round13-stage.json`; the sink straight down, clipped at y = 0 in every pass, nothing left), N1 (no outline or handle on the map frame) and N2 (every carried picture's projected corners on its flat straight path within 0.1 px at S 103.6), with five negative controls.
- `tools/round12-checks.mjs` (run by `checks.mjs`; `--controls` alone): D1's phone and tablet sizes in all four apps against `PHONE_BESIDE` (within 2 %), front edges, art aspect and the Figma canvas phone frame; I1's InDesign without frame steps or empty/crossed frames, its pages whole from the open and each picture on its own page; X1's centres on `SCREEN.l + SCREEN.w / 2 + EXPORT_SHIFT` and a one-number move that moves only floor pieces (the laptop's slide-in included). Four negative controls: the old InDesign phone, a phone set back, one frame step put back, and the pool left behind.
- `tools/hand-patch.mjs` `r12Patch` (round 12): removes InDesign's frame steps from the frozen earlier sources in memory, so the older snapshot checks compare like with like; the retimer matches actions by id.
- `tools/correction-checks.mjs`: R9–R15, full 240 Hz cursor continuity, landed-face and fixed-mark checks, 0.005 s frame/plate lifetimes, Figma geometry and canvas/toolbar/lid clearance, frozen withdrawal, photograph registration and parametric label routes.
- `tools/controls.mjs`: reversible negative controls against the real checker, restoring source in `finally`; each exact edit must match one location; round-three evidence is in `.scratch/corrections3/controls/` and BUILD.md. The tool writes no results.json.
- `tools/browser-check.mjs`: actual marks/fonts, gutters, outward routes, words clear of every ring/mark/line, page overlap, reduced motion and laptop entry/return at ten sizes. Its new `checkRound5Layout(page)` adds font-ink/guard/target checks, four wider reference sizes and the 555-size resize sweep. `checkBrowser(page)` accepts a review page; its CLI is for the external review machine only. These checks were not run here.
- `tools/hand-checks.mjs` (round 7, K3, run by `checks.mjs`): the cursor's projected peak speed at S 103.6 every 1/120 s over the loop (limit 1,500 px/s), a carried piece within 0.002 units of the cursor in every drag/draw/slide/stroke, the cursor on `HAND` in every approach and hand action, and three in-memory negative controls. `tools/hand-patch.mjs` applies round 7's hand edit to the frozen snapshots the older checks compare with, and maps instants named from the 83.04 s timetable to now.
- `tools/drag-checks.mjs`: round-four Node sweeps every 0.0005 s over all five InDesign drags and the old 25.20–25.30 s window (mapped to now through the actions around it). They compare stack offsets and projected corners with the saved incoming `48aea47` source, check projected box occlusion and F1's frame lifetimes, record shadow-pass position uniforms, and compare the five retained emitted stills with incoming `50b51b8` (numeric tolerance 1e-8). H2 timing and H3's Figma change are checked separately. These are computed checks, not rendered frames or shadows. `checks.mjs` includes them.
- `tools/round5-checks.mjs`, `tools/round5-controls.mjs`: H1's exact spread boundary, 0.005 s growing bounds and all 23 draw-end comparisons; H2 clocks and still poses; H3 geometry/anchor/entry; H6 centring, target, modeled sizes and continuity; H7 rays, whole-dot rule and input scheduling. The frozen round-four source/labels are in `tools/fixtures/round5-source.json`. Every deliberate fault matches one site and is restored byte-for-byte. Model size results are not browser measurements.
- `tools/round5-addendum-checks.mjs`, `tools/round5-addendum-controls.mjs`: H9 exercises the real page-layout logic with exact, shorter decimal and 1/64 px CSSOM storage through ten measurements and an away/back resize at all ten sizes. H10 samples the complete laptop and app outlines every 0.02 s, including clipped withdrawal, and the Laptop ring's outer stroke at S=103.6. Frozen incoming sources let it check retained pieces and report before/after. Three one-site negative controls run entirely in memory. The main checks include these gates; the browser checker also includes real repeated-measure/away-back assertions.
- `tools/round5-second-addendum-checks.mjs`, `tools/round5-second-addendum-controls.mjs`: H11 exercises all four craft pairs at fourteen review sizes plus the 719/720 breakpoint, three measurements each. H12 exercises a 357→396 px modeled lede rewrap and 555 resize samples through the actual layout function. Shared browser assertions test column ownership, number/label placement, overlaps, the stable text-right input and resize steps. Both incoming faults are rejected by exact one-site in-memory controls. These are DOM/glyph stand-ins, not real Outfit or browser evidence; the existing label-fit suite and external browser/pixel gates remain necessary.
- `tools/drag-controls.mjs`: fourteen reversible single-site controls for those gates, plus the changed cursor-route and legacy clearance checks; source bytes are restored in `finally`. Evidence is in `.scratch/corrections4/controls/` and BUILD.md. The frozen reference sources in `tools/fixtures/drag-sources.json` let the checks run without `.scratch` snapshots.
- `tools/measure-phases.mjs`, `tools/phase-checks.mjs`: isolated phase orchestration and its browser-free failure-path fixture.
- `tools/page.mjs`: writes the existing page markup with the prototype's player or still script and the take-two stylesheet. Its output guard protects all seven briefs and the protected review records. `tools/sheet.mjs` and `tools/film.mjs` remain the external browser review tools.
- `BUILD.md`: this pass's decisions, acceptance criteria, stage checkpoints and limits.

## The six scenes

Times below are seconds at PACE 1. The first 0.5 seconds change shell; the next 0.3 wipe on the furniture. The last 0.3 wipe the content off. Every action's approach is computed from its cursor distance d: min(0.5, 0.18 + 0.07 d) seconds, and a drag, draw, slide, stroke or run of path length d lasts at least 0.12 + 0.08 d seconds; either is lengthened further where needed to keep the cursor's projected peak under 1,500 px/s at the 1440 x 900 fit (round 7, K2/K3). The hand (the cursor's approaches, and every drag, draw, slide, stroke and run with everything it carries) uses `HAND`, the minimum-jerk curve in `stage.mjs`; a path is walked by its length. Every other move uses the engine's wipe, enter or exit curve; playheads run at constant speed. The booklet keeps its approved pickup and bending law.

| App | Global start | Length | Local still | What is built |
| --- | ---: | ---: | ---: | --- |
| Photoshop | 0.000 | 8.046 | 7.095311 | Raw photo; levels; sky; seamless heals; grade; photograph to dock |
| Illustrator | 8.046 | 13.148 | 10.835164 | Empty artboards; maps, close-up and subway; maps to dock |
| InDesign | 21.194 | 22.588 | 19.186277 | Blank pages from the open; styled photo drops onto them, typed titles and drawn blobs; labels during the 3.0 s landing hold; four bending leaves |
| Premiere Pro | 43.782 | 19.381 | 15.731291 | Clips, voice, captions and sound; shared playback; fully revealed export labels |
| After Effects | 63.164 | 17.782 | 14.132090 | Words, shapes, keys and graph; shared playback; fully revealed export labels |
| Figma | 80.946 | 18.545 | 15.245163 | Laptop/tablet/phone wireframes and designs; tap/change-state/instant interaction; scrolled Video still |

The scripts contain lengths, never hand-authored start times. `script()` derives each approach, start and end. PACE scales those lengths, cursor approaches, shell transition, the ball, the sink and device clocks together. The first typed text in each app takes at least 0.6 seconds; every later text takes at least 0.4 seconds. Repeat runs retain their brisk timings. The resulting scene lengths supersede the second pass's individual targets and fit the revised loop (70–92 seconds since round 7, 70–100 since round 15). After Effects also visibly moves the first ball key from zero to 0.75, so the new stopwatch operation can create its key at zero while the finished animation keeps the approved stagger.

InDesign's four leaf turns still last 0.6 seconds each, separated by 0.3 seconds, and its pickup lasts 0.7 seconds. Its landing hold is 3.0 seconds; the final reading hold remains 0.3 seconds. `spreadType` runs for 0.476 seconds (0.3 authored, lengthened by round 7's distance rule). Photoshop's levels slides each take 0.5 seconds, its sky wipe 0.7 seconds, and each healing scrub 0.25 seconds with the patch cutting in at release. Its closing wipe finishes 0.3 seconds after the photograph docks, removing the former 1.4-second empty hold.

Every action start and end follows. These are local times; multiply by PACE and add the scene's global start. Gaps are the scheduler's cursor approaches. Wait actions cover physical work or a deliberate hold, with the cursor still and unpressed at its previous point. Export is clicked once; the cursor rests through landing, pickup, the leaf turns, reading and return. A wait never sinks the Export button; any already-running export progress continues. InDesign's `drop` and `return` waits keep their round 13 ids: since round 15 `drop` covers the ball after the click (1.85 s, so every piece is built at the end of `drop`) and `return` is the 1.0 s sink.

| App | Action | Kind | Start | End |
| --- | --- | --- | ---: | ---: |
| ps | open | click | 1.171 | 1.471 |
| ps | black | slide | 1.796 | 2.296 |
| ps | white | slide | 2.491 | 2.991 |
| ps | sky | click | 3.302 | 4.002 |
| ps | cone | stroke | 4.331 | 4.581 |
| ps | crane | stroke | 4.909 | 5.159 |
| ps | grade | slide | 5.382 | 6.482 |
| ps | shrink | wait | 6.482 | 6.632 |
| ps | export | export | 7.096 | 7.746 |
| ai | board0 | draw | 1.251 | 1.727 |
| ai | board1 | draw | 2.132 | 2.432 |
| ai | street | stroke | 2.793 | 3.293 |
| ai | markers | run | 3.682 | 4.014 |
| ai | labels | type | 4.380 | 4.980 |
| ai | title | type | 5.194 | 5.594 |
| ai | badge | draw | 5.855 | 6.035 |
| ai | block | draw | 6.302 | 6.482 |
| ai | blocks | run | 6.669 | 6.859 |
| ai | streets | stroke | 7.105 | 7.605 |
| ai | pins | run | 7.889 | 8.102 |
| ai | cityLabels | type | 8.360 | 8.760 |
| ai | marquee | draw | 8.965 | 9.265 |
| ai | close | wait | 9.265 | 9.765 |
| ai | subway | stroke | 10.035 | 10.385 |
| ai | inspect | wait | 10.385 | 10.525 |
| ai | export | export | 10.836 | 10.886 |
| ai | closeBack | wait | 10.886 | 11.136 |
| ai | mapExport | drag | 11.488 | 11.988 |
| ai | locExport | drag | 12.348 | 12.848 |
| id | map | drag | 1.023 | 1.473 |
| id | heading | type | 1.768 | 2.368 |
| id | spreadType | run | 2.814 | 3.290 |
| id | loc | drag | 3.589 | 4.039 |
| id | photo | drag | 4.406 | 4.856 |
| id | blob | draw | 5.093 | 5.276 |
| id | coverTitle | type | 5.472 | 5.872 |
| id | pages | run | 6.275 | 6.516 |
| id | postPhoto | drag | 6.901 | 7.201 |
| id | postTitle | type | 7.407 | 7.807 |
| id | postBlob | draw | 8.035 | 8.215 |
| id | postButton | draw | 8.405 | 8.585 |
| id | mailPhoto | drag | 8.877 | 9.177 |
| id | mailTitle | type | 9.390 | 9.790 |
| id | mailBlob | draw | 9.987 | 10.167 |
| id | mailButton | draw | 10.382 | 10.562 |
| id | mailFlyer | type | 10.756 | 11.156 |
| id | export | export | 11.538 | 12.338 |
| id | drop | wait | 12.338 | 14.188 |
| id | land | wait | 14.188 | 17.188 |
| id | pickup | wait | 17.188 | 17.888 |
| id | open | wait | 17.888 | 17.988 |
| id | leaf1 | wait | 17.988 | 18.588 |
| id | pause1 | wait | 18.588 | 18.888 |
| id | leaf2 | wait | 18.888 | 19.488 |
| id | pause2 | wait | 19.488 | 19.788 |
| id | leaf3 | wait | 19.788 | 20.388 |
| id | pause3 | wait | 20.388 | 20.688 |
| id | leaf4 | wait | 20.688 | 21.288 |
| id | read | wait | 21.288 | 21.588 |
| id | return | wait | 21.588 | 22.588 |
| pr | bin | run | 1.271 | 1.551 |
| pr | clipA | drag | 1.765 | 2.165 |
| pr | clipB | drag | 2.469 | 2.869 |
| pr | clipC | drag | 3.262 | 3.818 |
| pr | cut | click | 4.061 | 4.111 |
| pr | offcut | click | 4.301 | 4.421 |
| pr | closeGap | wait | 4.421 | 4.671 |
| pr | transition | drag | 4.920 | 5.370 |
| pr | effect | drag | 5.733 | 6.133 |
| pr | caption | type | 6.481 | 7.081 |
| pr | caption2 | type | 7.081 | 7.481 |
| pr | caption3 | type | 7.481 | 7.881 |
| pr | captions | run | 8.145 | 8.335 |
| pr | music | drag | 8.777 | 9.177 |
| pr | duck | slide | 9.382 | 9.632 |
| pr | fade | slide | 9.971 | 10.221 |
| pr | play | play | 10.568 | 12.168 |
| pr | export | export | 12.531 | 13.231 |
| ae | comp | click | 1.142 | 1.442 |
| ae | make | type | 1.681 | 2.281 |
| ae | move | type | 2.478 | 2.878 |
| ae | ball | draw | 3.127 | 3.377 |
| ae | row | draw | 3.569 | 3.819 |
| ae | copies | run | 4.034 | 4.174 |
| ae | select | click | 4.520 | 4.570 |
| ae | stopwatch | click | 4.781 | 4.831 |
| ae | head | drag | 5.045 | 5.295 |
| ae | path | drag | 5.577 | 5.927 |
| ae | marquee | draw | 6.192 | 6.503 |
| ae | keys | run | 6.834 | 7.184 |
| ae | staggerBall | drag | 7.507 | 7.707 |
| ae | graph | slide | 8.054 | 8.654 |
| ae | play | play | 8.969 | 10.569 |
| ae | export | export | 10.932 | 11.632 |
| fig | frame0 | draw | 1.214 | 1.514 |
| fig | frame1 | draw | 1.751 | 2.051 |
| fig | frame2 | draw | 2.292 | 2.592 |
| fig | pictureBox | draw | 2.907 | 3.157 |
| fig | heading | type | 3.424 | 4.024 |
| fig | button | draw | 4.223 | 4.423 |
| fig | details | run | 4.649 | 4.983 |
| fig | marquee | draw | 5.340 | 5.694 |
| fig | copies | drag | 5.965 | 6.365 |
| fig | fill0 | set | 6.586 | 6.636 |
| fig | fill1 | set | 6.893 | 6.943 |
| fig | fill2 | set | 7.166 | 7.216 |
| fig | hero | drag | 7.478 | 7.878 |
| fig | name | type | 8.120 | 8.520 |
| fig | accent0 | set | 8.744 | 8.794 |
| fig | accent1 | set | 9.051 | 9.101 |
| fig | accent2 | set | 9.324 | 9.374 |
| fig | hotspot | click | 9.691 | 9.741 |
| fig | link | drag | 9.741 | 10.341 |
| fig | panel | run | 10.670 | 10.937 |
| fig | export | export | 11.295 | 11.995 |

## Exports that play

Round 17 refines round 15's ball export. One table in stage.mjs times all four exporting scenes: `{ pop: 0.3, arc: 0.8, rest: 0, split: 0.6, hold: 0.15, become: 0.6, stagger: 0.1, lid: 0.4, sink: 1.0 }`. From the Export click through touchdown at +1.1 s, the centre follows one ballistic parabola in height and linear x/z, without an ease or a restart. It starts small just below the button's top, in front of its face, grows to 0.6 diameter during pop and is clipped by the top-side plane until clear. The peak is one diameter above that top. It lands on the floor at the combined footprint's centre, without bouncing; the existing shadow follows it.

The split starts at touchdown, +1.1–1.7 s, with `EASE.enter`: its first pose is the ball and its first step visibly moves. Hold is +1.7–1.85. The three hard wipes run +1.85–2.45, +1.95–2.55 and +2.05–2.65 s. Figma's laptop opens after its wipe, +2.45–2.85 s. Plays and labels start at `land`, when everything is built: +2.65 s for InDesign, Premiere and After Effects, +2.85 s for Figma. Nothing plays before its wipe or lid opening. The screen retains its completed work; the cursor rests after Export and stays in front.

Premiere and After Effects each play twice (2 × 1.6 s), sink at land + 3.2 s, and hold the second play’s last frame throughout the sink. Each device’s content starts at its own base; its chrome occupies a fixed slot above that device’s content. Bodies and screen faces stay fixed through both plays and the restart. Viewer stacks are independent too, with overlapping pictures kept in drawing order. Figma keeps its 3 s shared cycle: tap Video, wipe, scroll, lift the card, return, tap Graphic design, wipe back and hold. Its still stays at cycle +1.10 s. After the cycle its lid closes over 0.4 s with the opening's wipe reversed, while the tablet and phone hold their last frame. Only then does the whole row sink.

All four sinks last 1.0 s with `EASE.wipe`, x/z fixed and y ≥ 0 clipped in colour, outline and shadow. Each object's body supplies its own height: InDesign's open reading copy and closed stack are separate objects. Depth is `H × (1 + 0.02 / max H)` within each scene. Device pictures, chrome, overlays, tap dots, island and camera additionally clip at their rest top above that body; the renderer omits the entire object in every pass once its body's top is below the floor. Every object starts together and crosses the floor together; nothing fades. Video/motion labels end at the sink's start; Figma's finish before closing, and InDesign's before pickup as before.

R12's laptop is space-grey aluminium: deck/lid `#86807A / #3E3A37 / #252220`, keyboard well top `#121111`, keys `#2C2928 / #1B1918 / #111010`, trackpad `#86807A / #4A4643 / #252220`. It grows by 1.4 about the hinge's left end: lid/deck width 2.17, lid height and deck depth 1.54, with the deck still 0.08 thick. Its screen is 2.058 × 1.28625 (16:10), top/side bezels 0.056 and chin 0.19775. R10's flush closed lid and R11's close-before-sink remain. The row stays centred at x -0.1 with 0.3 gaps; `forward` is 0.93. The shared tablet and phone have their fronts on the deck's, the tablet extending 0.11 behind it. H10 measures 12.403420 px app clearance and 59.576001 px ring clearance at S 103.6.

InDesign's booklet stays the approved size. Its stack/phone/tablet row still spans the open copy exactly, with two equal 0.085027 gutters and fronts at z 0.05; the tablet reaches z -1.6. Premiere/After Effects have the landscape tablet then two portrait phones, 0.25 gaps, on a centred mat 3.180088 wide.

Exports fill the model screens, with each first picture on its own glass. The tablet players, motion and new tablet shots are 472 × 328 (2360:1640); the phones' reel, feed, story, chrome and tall shots are 300 × 650. Top chrome stays fixed; foot chrome moves down 50 px; feeds keep their square picture and reveal another post's avatar/name. Captions retain 352:74. InDesign's post is 300 × 650 and mail app 328 × 472, with the complete e-blast fitted below its header. Figma's tablet canvas/design/wire/chrome/build states are 164 × 236; its scroll pages are 164 × 330 and work cards 156 × 236 (raster rounding under 0.13%); laptop and phone art keep 16:10 and 9:19.5. The program monitor and AE comp remain 16:9. No action time changes: `FIG_BEATS` retains every previous approach/action clock despite the new frame positions. BUILD's **Round 17, R12** records the full picture inventory, placements, fit, ten layout-model scales and checks.

## Labels on the exports

`calloutsAt(t)` is pure and returns the specified world marks, words, side, level and two wipe progresses. Photoshop and Illustrator return none. InDesign labels Flyer / LinkedIn post / Email; video labels YouTube / TikTok / Instagram; motion labels Website / Story / Feed post; UX/UI labels Laptop / Tablet / Phone.

Marks are on the top-left, bottom-middle and top-right faces, respectively; the laptop uses the top-left of its actual lid screen. Corner insets are 0.1 units, bottom middles 0.06; the laptop uses 0.08 along and 0.06 down. Each mark is a 3 px bright-red square surrounded by six equal dashes, turning at 60 degrees per hero second and stationary under reduced motion. Radius/stroke are 8/1.25 px, or 5.5/1 px below S=70. Paper leaders start 3 px outside the ring, run diagonally at 45 degrees, bend once and end horizontally. Upper elbows are 0.45 S above the mark; lower leaders share a level 0.45 S below the lowest low mark. Left/right word columns use the group’s left edge and screen’s right edge, with 0.35 S / 0.27 S offsets and 7 px word gaps. Both columns constrain the view fit. All left labels share one end x, moved outward as necessary; horizontal runs are at least 12 px, or 8 px below S=70. Elbows stay at least 3 px outward from line starts. Words clear all rings by radius + 2 px and all marks and lines. Page content can shorten a diagonal while keeping the run outward. Device anchors use their own new landed corners or fixed lid-screen face, independent of playback layers. The existing fit solver moves the Laptop and Tablet columns farther left as needed, while keeping text and edge clearance.

Words are real uppercase Outfit 400, 11 px (9 below S=70), 1.2 line height, 0.12em spacing, without wrapping. The pointer-free, aria-hidden SVG/text overlay is above the canvas and below controls. Nothing is drawn below S=34. Nodes are reused. A mark/ring cuts in once every piece of its row is built (round 15: `land`, the last become end; the laptop's lid is open by then), a line wipes for 0.25 seconds, then its words wipe for 0.15 seconds. Rows cut all labels at `off[0]`; InDesign holds its landing for 3.0 seconds (35.532–38.532 globally) and cuts labels at pickup. The InDesign reading still has none; all three later stills have complete labels. Seeks redraw immediately, including the overlay.

## Still changes to compare in the browser

This inventory describes known changes from the incoming motion build and the approved sheet; it is not a claim of a completed pixel comparison.

- **All six stills:** C15 permits only the floor groups and light pool to move in world x, to the screen's own middle at 0.200. Relative to the incoming build, InDesign's complete block moves left by 1.860 units and each three-device row by 1.250. That statement describes the incoming C15 change. This round adds labels and the three Figma device layouts; its small-screen framing may also shift/reduce the common view to clear the label column. R12 now pins the common default framing to the pre-R12 fit; yaw/pitch still recompute it. This correction adds the small height separations needed by rounded picture/plate faces and raises selections, carets, handles, taps and the cursor above picture stacks; the still times in the tables follow the longer typing actions.
- **Photoshop:** Round 17 mixes raw → half-levelled and half-levelled → levelled per pixel on one piece, exactly with the corresponding handle; one persistent set of 48 histogram bars follows both slides. Sky, heals and grade retain their actions. Its still is now the finished graded photograph, before Export, rather than a split edit. The split bar and handle are gone; the sliders finish at 0.55 and 0.30; the cursor is on Export. The last rail icon is the wand needed by the sky step. The completed four layer rows and today's histogram remain. This correction draws the graded photograph alone at the still, removing the cone and patch ghosts. During construction the raw sky stays flat grey; the replacement and clean base both use the graded blue sky, so the grade does not change it again. Each completed heal switches the whole base: photoNoCone retains the crane after the cone/barrier are gone; photoClean removes the crane.
- **Illustrator:** Round 17 draws the finished badge and block as registered growing crops, and types only cut-out letters from companions drawn by the finished maps’ own code. Their masks cover every nonzero-alpha texel, grown by one texel, and take RGB from the matching finished map, preserving the finished letter weight, colour and antialiased edges. Persistent region layers stay in their depth slots when the full map fills underneath. Export travels are tagged by action id and clear everything they overlap along the view. The finished maps, close-up, selected path, points and handles keep their approved measures. The cursor is now on Export, rather than still approaching it. The photo chip stays in the bar as introduced by MOTION.md; the inspect beat returns the lit tool to the arrow.
- **InDesign:** all five page bodies use the finished reference’s lift 0.06 and thickness 0.02 (face 0.080) from placement onward; construction sits a few layer steps above that face. Carried pictures use their destination’s height; panel thumbnails stay at 0.073. The spread’s finished-page patches and overlapping mail lettering retain their slots across the final-page swap. Mail letters use the same finished-pixel masks as Illustrator. Its leaf pose at exactly 1.82 stays. The horizontal centring and moved pool are the changes; the booklet and stack keep their approved sizes. R12 uses the same phone/tablet as all other scenes: 300 × 650 post and 328 × 472 mail, with the full e-blast below its header. Round 12 (X1) moves the whole block and reading place by `EXPORT_SHIFT`.
- **Premiere:** the bin now contains three source shots and music. The timeline adds three attached voice strips, a music lane, level line, square keys, ducked waveform and stepped taper; the clip/voice/caption lanes and preset landing heights fit those into the existing plate. A small lit timeline-tool tile shows the blade/type/arrow actions. The still is 0.550001 seconds into export playback: the viewer/playhead and the three devices show that live phase rather than the parked shot A and burned-in caption. Device progress follows that phase. The two effects sliders from MOTION.md remain.
- **After Effects:** the still is one third through playback, so its word reveal, ball/outline position, list visibility, playhead and exported pictures differ from the old parked 1.6 pose. This correction makes the project thumbnail show that same live phase instead of its former baked picture. While building, both comp and thumbnail show typed words, the growing and dragged ball, and whole rows at their authored positions; the keyed reveal applies only during playback. There is now a visible stopwatch beside the ball row and a small lit tool tile. The graph grid and end keys, finished timeline keys, project list and layer measures stay. The third list row remains solid, as MOTION.md required. The ball now uses the permitted engine wipe ease; the old separate ball curve is gone. Its graph handles finish at (115.2,176) and (38.4,24), rather than (128,176) and (112,24), so the graph describes the actual engine wipe. This departure resolves MOTION-2's three-curve rule over MOTION.md's separate ball curve.
- **Figma:** the 1.10-second scrolled Video phase replaces the former parked desktop/two-phone arrangement. Both canvas rows are laptop/tablet/phone layouts; the floor is an open laptop, portrait tablet and phone. Each plays the same sequence with its own viewport and fixed chrome. All three labels are complete. The card tap has not happened at this still.
- **Device pictures:** the last three apps' picture areas are live pieces instead of baked stills. Their chrome, feed/browser surroundings and original aspect-specific layout remain; live progress and solid utility-bar colours are deliberate changes. This correction separates captions, words and rows from their underlying pictures to remove the browser's garbled overlaps. Small text stays on opaque plates; the two large motion-word plates use face-only cut mode to remove their side faces while preserving their opaque fronts.

## Checking and sharing this prototype

From the repository root, the two commands used in this pass are:

```
node design/journey-hero/take-2/tools/checks.mjs
node design/journey-hero/take-2/tools/preview.mjs design/journey-hero/take-2/.scratch/preview.html
node design/journey-hero/take-2/tools/round5-checks.mjs
node design/journey-hero/take-2/tools/round5-controls.mjs --audit
node design/journey-hero/take-2/tools/round5-controls.mjs
node design/journey-hero/take-2/tools/round5-addendum-checks.mjs --out=design/journey-hero/take-2/.scratch/corrections5-addendum/report.json
node design/journey-hero/take-2/tools/round5-addendum-controls.mjs
node design/journey-hero/take-2/tools/round5-second-addendum-checks.mjs
node design/journey-hero/take-2/tools/round5-second-addendum-controls.mjs
node design/journey-hero/take-2/tools/round5-second-addendum-controls.mjs --audit
```

`checks.mjs --timeline` also prints the derived action table. `round5-checks.mjs --only=H1` (also H2, H3, H6, H7) isolates a computed gate. The addendum checker accepts `--only=H9`, `H10`, `H10-gap` or `H10-ring`; its optional report includes every Figma sample. `frameAt(t)` wraps positive and negative times. `SCENES[i]()` builds the new still; `SCENES[2]({ at })` still gives any booklet reading pose with the complete group out. The player supports `?t=12.5` and `window.__hero.seek(t)`, and exposes its clock, SHOW, LOOP and cached layout metrics. `window.__hero.measure()` clears the expanded target's inline left/width before reading the CSS stage; it then refreshes the view and target. `stage.html?s=0..5` holds a scene, `?t=` holds a loop time, `?atlas=1` shows every atlas page, and yaw/pitch inspect the geometry.

The external browser review can continue using `tools/sheet.mjs` and `tools/film.mjs`, including phone frames and the 0–97.891-second range. They were not run in the build itself; the browser review recorded under "The design being carried forward" ran them afterwards. The retained hardware reports describe incoming `48aea47`, including both D2 runs. Round 3 was not remeasured on hardware because it changes which pieces are drawn and where labels sit, not the renderer.

All authored changes and the packed output are confined to this folder. Neither brief, the first take, public files, source site, dependencies nor deployment was changed.

## Round-one corrections and acceptance

CORRECTIONS-1.md supplies the ground rules; the owner's C15/C16 instructions supersede its still restriction for floor centring. In C1–C14, a structural comparison of every piece's tone, picture, position, rotation, size, window and clip found only five added paperTile picture bindings in After Effects (screen, thumbnail and three devices); all geometry was unchanged within 1e-8. For C15/C16, a fresh comparison of 4,821 loop/still frames finds only the specified floor-x translations and released wait-cursor lifts. The six stills differ only by floor-x translation. Neither comparison is a pixel comparison. The devices now use the same paper colour as the opaque word plates; the screen and thumbnail retain their paper appearance.

Frame style arrives exactly on each photo release, not on a title, blob or button action:

- Cover: the woven ground and the firm's small blob arrive with photo. Its building blob is drawn separately; the gold title tab starts with coverTitle's text-frame click.
- Post: the woven top band, dark foot and firm's small blob arrive with postPhoto. postTitle supplies its final-looking tag while typing; postBlob draws the large gold building mark. postButton touches only its button/tag area.
- E-blast: the top band, gold photo frame, divider and firm's small blob arrive with mailPhoto. mailTitle types the body text, mailBlob draws its large building mark, mailButton draws the button, and mailFlyer types View the flyer with a caret for 0.4 seconds.

Amenities, Location and cover thumbnails follow their own completion. Offering, Gallery and back cover are a three-row pages run at 0.07-second intervals. No photo-bearing thumbnail precedes photo's release. Finished pictures replace their construction only after all their parts exist. The landed amenities map sits above the spread plates and retains its selection/handles. Round 12 (I1): no frames are drawn. The spread's two pages and the cover, post and e-blast pages are there from the open; each blank page's thin edge stops only at its own picture's first contact and never returns. Its plate remains until placement; that page contains the styled replacement immediately. InDesign travelling pictures draw above other pages' intact edges. Each carried photograph is cropped to its destination’s framing before release; the cover’s photo aperture now matches the full-height photo already printed in the approved cover. Finished post and e-blast pictures replace their construction pieces, which stop in that same frame.

Premiere types Look good., Move well. and Work right. separately, with growing lane blocks and the correct viewer shot. Only the two repeated captions use a run. Figma's hero source belongs to the panel's opening furniture; its own slot empties during the drag. Fills and accents explicitly name the arrow. tick clamps one time step to 0.1 seconds; seeking still draws the requested time exactly.

R1–R15 check photo releases, page births, drawn blobs, typed ancestry, cursor-owned births, placed-image clearance, tools, legitimate press windows, action-end occlusion, 240 Hz cursor continuity and labels’ words/poses/wipes/face anchors. Echo exemptions require an explicit source-action tag whose action has started; there are no region exemptions. R9 also checks plain document pieces and excludes only identical atlas mappings, named echoes, playback and overlays. Every final negative control exits 1 with its intended rule. Figma checks additionally cover the actual device count/ratios/gaps/band/centre, the x-path exception, projected lid intersections, canvas/toolbar clearance and changes on every viewport between 0.6-second samples, excluding progress rails. R15 checks frame and plate persistence through their own contact/placement; its same-frame replacement exception is controlled. Fixed marks and low levels are checked at 60 Hz to 1e-9. These are numeric/logic gates; they do not replace pixel or whole-loop browser review.

## Cost and production work

The Node font-metric model packs five RGBA8 pages, all within 2048 square: 2048 × 1880, 2048 × 1700, 2048 × 1800, 2048 × 1992 and 2048 × 1492. With R12's screen art and round 17's 54 letter-only crops, the modelled cost is 69.25 MiB before mipmaps and 92.33 MiB with them. Browser fonts determine the crops' final measured sizes; no new browser atlas or GPU resident-memory measurement is claimed. Old baked UX/UI device pictures remain as code references but are not packed. Retained 2D canvases add their base pixel storage outside the GPU estimate.

The canvas covers the hero. Both players use `dpr = Math.min(2, devicePixelRatio || 1, Math.sqrt(5.2e6 / (W * H)))`: a nominal ceiling of 5.2 million device pixels; renderer integer rounding can add fewer than one row/column of pixels. 1440 × 900 stays at 2x (2880 × 1800). At 1920 × 1080 and requested DPR 2 the ratio is about 1.584, rather than 2. The review must report the real rounded backing dimensions.

Allocation at that cap, term by term: the modelled atlas with mipmaps **92.33 MiB**, shadow **16 MiB**, resolved RGBA8 colour **4 bytes/device pixel**, 4x multisample colour **16 bytes/device pixel**, 4x depth **16 bytes/device pixel**. The 36-byte pixel term is **178.53 MiB**, for **286.86 MiB** total before integer-rounding overhead. Antialiasing's real sample count/depth bits must be queried; browser/compositor buffers, mesh/driver overhead and the **69.25 MiB** retained 2D canvases are outside the GPU estimate. This is allocation arithmetic, not a new hardware measurement.

preserveDrawingBuffer: true exists so external review tools can seek, draw once and capture that held WebGL frame after compositing. It is a review convenience, with a memory/performance cost. The production build switches it off; this prototype keeps it on for those captures.

Production work still required:

- Handle a lost WebGL context: this prototype has no restoration path, so its canvas stays blank.
- Handle no WebGL2: renderer creation throws, leaving dead controls and no still.
- Measure actual phones, battery/thermal behaviour, Safari and Firefox; desktop headless timing does not establish phone performance.
- Ship a fallback to approved stills for unsupported/lost WebGL and constrained devices, with usable craft controls and reduced-motion behaviour.

The external reviewer runs the local-only `tools/measure.mjs` with `--dpr <n>` (default 1). Each playback, scan and sheets phase records its own failure; failed playback cannot skip the scan/sheets, marks the report **playback incomplete**, and yields exit 1. `--playback-limit <milliseconds>` enables the forced-timeout review. It was not run in this build; the Node-only phase fixture exercised the coordinator and actual report formatter. It uses an isolated headless browser, the packed file and no page network requests; the graphics card, software-renderer warning, frame timing, allocation estimate and flicker scan belong in review/hardware/measure.md.

## Committed hardware runs of `48aea47`

[Default report](review/hardware/measure.md): 2026-11-20 01:01:12.463–01:05:26.701 UTC, Edge 157.0.4341.60, RTX 4090 through D3D11, WebGL2, no software renderer reported, ready in 153.9 ms. DPR 1: 1440 × 900 recorded 19,486 frames, median/P95 4.20/4.30 ms, worst 16.80 ms, zero gaps over 50 ms, allocation estimate 148.66 MiB. 1920 × 1080 recorded 19,489 frames, median/P95 4.20/4.30 ms, worst 5.20 ms, zero gaps over 50 ms, allocation estimate 175.36 MiB. Both playback phases, scan and sheets completed. Scan: 587 frames, zero repeat failures, 1,342 flagged blink blocks (46/882/261/129/24 in scene order excluding Illustrator).

[DPR-2 report](review/hardware/dpr2/measure.md): 01:05:29.680–01:13:06.347 UTC, same browser/GPU, ready in 164.6 ms. Requested 1920 × 1080 at DPR 2; actual backing 3040 × 1710, ratio 1.5833. 19,487 frames, median/P95 4.20/4.30 ms, worst 8.30 ms, zero gaps over 50 ms, allocation estimate 282.64 MiB. Scan: 587 frames, zero repeat failures, 11,535 flagged blink blocks (356/7080/2090/1430/579). Both reports record zero console errors and zero network violations. Both use four MSAA samples and 24-bit depth; allocation estimates exclude driver/compositor overhead and 66.13 MiB retained 2D atlas storage.

These are the committed incoming-build runs. Their flags retain the external review’s classification. Rounds 3–5 were not remeasured on hardware; round 8 removed the floor-hover shader, and its star field pass has no hardware performance evidence. The protected reports and sheets are unchanged. The earlier contact-sheet scale departure remains in those reports: frames are fitted to the 1600 px sheet cap; scan comparisons keep full capture resolution.

## Round-three computed checks and browser limit

`tools/browser-check.mjs` checks the labels at ten sizes: 390 × 664, 390 × 844, 360 × 780, 375 × 667, 412 × 915, 768 × 1024, 820 × 1180, 1024 × 768, 1440 × 900 and 1920 × 1080. Its command needs Playwright installed in the repository; without it, it reports the sizes as UNRUN and launches nothing. Its exported `checkBrowser(page)` can be run on a page from any Playwright. The builder's machine has no Playwright, so the reviewers ran `checkBrowser` on the packed preview of `50b51b8` and `7590b44` in the cloud: it passed at all ten sizes (150 rows). The exported route assertions also run in Node against parametric layout geometry, including their negative control. BUILD.md contains exact outputs and control edits.

Those round-three/four reviews used the historical 81.240-second loop. Round 5 used 83.040 seconds; round 7 used 91.498 seconds, round 12 88.500, round 13 91.591 and rounds 15-16 used 97.691; the round 17 follow-up uses 99.490895, with starts/stills in the current table above. The supplied review accepted the rest of round 5; the H9/H10 fixes await external browser/frame review. Numeric tests cover frame/plate continuity, drawing order, fixed marks, playback content, toolbar clearance, narrow-stage gutters, measurement stability and the full laptop/app gap. No hardware rerun or measurement entry point was invoked.


## Round 17, critique round 2

The construction pictures now use **210 transparent source-paint cutouts**, with **24-texel margins and gutters**, a separate premultiplied blended-face pass, and original paint clipped before mip filtering during partial reveals. The first five atlas pages and their 303 old placements stay fixed; two added pages are 2048 x 1984 and 2048 x 412 in the Node model. F3 letter masks and font drawing remain in use; completed pictures retire their construction companions at release.

InDesign's reading copy sinks as separate **0.040/0.010** halves, depths **0.0432/0.0108**, crossing with its other three objects at **+0.637731481 s**. The floor alone has polygon offset **1/2**; carried clips and whole-object culling remain. The combined missing-clip/cull control fails the carried-lifetime gate.

Run the Node suite and its 30 in-memory negative controls:

```
node design/journey-hero/take-2/tools/checks.mjs
node design/journey-hero/take-2/tools/round17-checks.mjs --controls
```

The browser pixel gate is **external review only**. On the machine with Playwright/Chromium:

```
node design/journey-hero/take-2/tools/round17-pixel-checks.mjs [packed-preview.html]
```

No argument packs this build. The export `checkRound17Pixels(chromium, previewPath)` returns its rows and failures. It tests desktop dpr 1/2 and phone dpr 2 releases, and desktop sinks at 1 ms. Missing Playwright prints UNAVAILABLE and exits 2; failures exit 1. Full measurements, original/new check numbers, cutout pages, release times, choices and local-verification limits are in BUILD.md's **Round 17, critique round 2** and `.scratch/review-out/r17/critique2-audit.json`. The pixel gate has syntax and synthetic PNG/mask/count coverage locally; it has not been run in a browser here.
