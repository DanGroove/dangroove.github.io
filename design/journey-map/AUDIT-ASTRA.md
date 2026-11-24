# Polish and cleanliness audit, the astra half: the journey map, both pages

Dan's words, 2026-11-23: "we need to do a few cleanliness/polish passes on everything after this critique loop since im noticing a lot of odd things here and there still", and "have astra agents also assess" (meant for these audits). Two auditors work side by side on the same frozen build, each on its own, without reading the other's report: **L** (look) and **B** (behaviour). Two other auditors already audited an earlier build; their findings were fixed in polish batches 1 and 2 (commits a055414 and aadb2f7), which is the build you audit.

## Why this round matters

On 2026-11-24, after the strict critique loop and the first polish audits had passed the build, Dan still found these in minutes (his words):

- "the cards need to showcase where they came from when opened like a leading line to the shield or a triangle; anything"
- "the shields need to be have more brand colors, not just 1"
- "why is the X not a part of the card?" (the card's close button sits outside the card's face: it pops in after the card has opened, does not tilt with it, and stays put while the card's content scrolls)
- "why does the lennard card have a scroll? the whole thing should be visible"
- "the pause before the supernova explosion should be replaced with something, not just a static pause"
- "the stars still all come from above when they should come from 360"
- and, on the audits: "This is the kind of thing i was hoping would be caught by the critique loop and the polish audits"

Those six are already being fixed (do not report them). They show what the earlier reviews missed: they checked each thing against its brief and looked for defects, but did not ask whether the design holds together for a first-time visitor. **Ask those questions everywhere else on both pages:**

1. **Belonging.** Does everything that appears show where it came from and what it belongs to? Is every control part of the thing it controls? Does anything float loose, sit apart from its owner, or appear with no link to what caused it?
2. **Colour.** Does each place carry its whole brand (all its colours, not one), wherever that place appears? Is Red kept for the traveller, the X, find markers and the playhead only?
3. **Dead time.** Is there any stretch, still or moving, where nothing happens and the visitor waits (a held frame, a pause before something, an empty beat, a slow fade with nothing else going on)?
4. **Cut, clipped or hidden.** Is anything cut by a screen edge, by its own box, by another element, or only reachable by scrolling inside a box?
5. **Direction and physics.** Does every movement come from a believable place and go to a believable place (not all from one side, not crossing over its target, not popping in)?
6. **First look.** Would someone who has never seen the page understand each thing at first sight: what it is, that it can be pressed, what pressing did?

## The page

- **Frozen build under audit:** this worktree, `C:\Users\Admin\Documents\Portfolio\journey-map-audit`, at a fixed commit (it never changes while you work). The pages: `design\journey-map\dist\journey-joined.html` (Dan's hero, then the map) and `design\journey-map\dist\journey-map.html` (the map alone). They open from disk and make no network request.
- **Source, read-only:** `design\journey-map\`. What it is meant to be: `BRIEF.md`, then the round 7 briefs `EXPLORE.md`, `HAMMER.md`, `WORLD.md`, `CREATURES.md`, `FLASH.md`, `REVIEW2.md`, `REVIEW3.md` (its lines 20 to 22 are superseded: the build-up's rhythm lives in light only), `MOTION.md`, `REVIEW4.md`, and their `-BUILD.md` reports.
- **The journey:** Back and Next (and the arrow keys) move through the beats top, map, laurier, hmc1, mohawk, hmc2, interkom, lennard, x, end. On the joined page you can scroll between the hero and the map until the journey starts; after that scrolling does nothing. At the end "Explore the map" frees the camera (wheel or pinch zooms, drag pans). Eleven finds (things to play with) sit on the map, including a Norse shooter game. The supernova at the X builds up for 3 s, then blasts; presses on it stack flares.
- **Script hooks:** `window.__jm` (go(id, { instant: true }), next, back, set, beats, P, moving) and `window.__jm.finds` (place(id), state).
- **Sizes:** desktop 1440 x 900, phone 390 x 844, Dan's phone about 412 x 730 (Android, the Claude app's viewer), small phone 360 x 640, tablet 820 x 1180 (touch on the last four).

## How to look

There is no Playwright here. `design\journey-map\tools\audit-capture.mjs` drives a local headless Edge over the DevTools protocol (127.0.0.1 only) and saves full-screen PNGs. Run it from `design\journey-map`:

- `node tools/audit-capture.mjs --page dist/journey-map.html --size phone --out <your frames folder>\phone` captures every beat, every find through its presses, the end, explore's fit view and a card closed by its X (`--plan beats,finds,explore,card`, the default).
- `--steps my-steps.json` runs your own steps instead (go, wait, press, tap, key, wheel, eval, shot; see the file's header). `eval` prints the value, so you can read state (for example `window.__jm.P`, element boxes, `scrollHeight` against `clientHeight`).
- Sizes: `desk`, `phone`, `small`, `tablet`. For Dan's phone pass your own size by copying the tool into your frames folder and adding `dan: [412, 730, true]` to its `SIZES` (the copy is yours; never edit the worktree).
- Frames are real time: wait 2.5 s or more after a move before a shot; for motion, take shots every 100 to 200 ms with short waits.
- Look at the frames with your image viewing tool. If you cannot view images, say so at the top of your report and audit through the page's state from `eval` steps and the source instead.

## Your scope

**Look (L):** everything a visitor sees, still and moving: overlaps and collisions, clipping at the screen edges, text over drawings, misaligned or unevenly spaced things, sizes and stroke weights that do not match their neighbours, colours outside the brand, things that pop in or out instead of moving, jerks, stalls and dead stops, flashes, elements left behind after a state ends, empty or cramped areas, drawings that read as something else, labels at every zoom, the cards, the end screen and footer, every size above. Plus the six questions.

**Behaviour (B):** everything a visitor does: every button, key, tap, drag, pinch and wheel at every beat and in every find state; pressing things during moves, twice quickly, or mid-animation; Back during the build-up and the blast; explore's edges; the sheets and the game; keyboard focus order and visible focus; screen-reader names and announcements; reduced motion (`prefers-reduced-motion` through `Emulation.setEmulatedMedia` in your own copy of the tool); console errors; and in the code, dead code, leftovers, duplicated logic, and numbers that do not match what the briefs say. Plus the six questions, from the side of someone using it.

## Already known (do not count as findings)

- Dan's six notes above.
- From Dan's phone recording of 2026-11-24: in explore a fast two-finger zoom left the map drawing blank for two frames; Muninn's reel sheet flashed once at full size in the screen's centre before growing from the ravens; the map's title "The saga so far" grows huge and runs off the screen when you zoom in during explore; explore pans and zooms and the wayfinder's turning drop to 10 to 17 frames a second on that phone.
- Still open from the first audits: the phone's held stop sits under its card; the embers after the blast; the horn's view; frame cost on real devices; the wayfinder's "VIDEO" label cut at the tablet's X beat.

## Not findings (owned elsewhere)

"YOURS TO WRITE" and "Piece to come" placeholders and other draft copy; the review switch in the top bar (preview only); anything inside Dan's hero itself (`hero-copy\`); the rune stone's arched top.

## Rules

- **Read-only.** Never change, add or delete anything in this worktree or in `C:\Users\Admin\Documents\Portfolio\journey-map`. Never run git (other than read-only `git log`, `git show`, `git diff`), never install anything, never use the network, never start other agents or reviewers. If a rule stops you from doing something, leave it out and say so in your report.
- **Write only** inside your own folder: `C:\Users\Admin\Documents\Portfolio\journey-map-runs\astra-look\` for L, `...\astra-behaviour\` for B (frames, your copies of the tool, step files, the report). The tool's own temporary browser profile in the system temp folder is fine.
- Plain ASCII punctuation in the report.
- Budget: about 60 minutes. Spend it on what a visitor would notice first.

## Report

`report.md` in your folder, findings most visible first. Each finding: id (L-n or B-n), where (page, size, beat or find and state), what is odd, which of the six questions it answers (if any), how to see it again (your step file or the plan), evidence (frame file names), how bad (fix now, polish, or leave), and the fix you suggest, with the source location when you found it. Then a short list of what you checked and found clean, and what you could not check. Finish with at most 250 words naming your top findings.
