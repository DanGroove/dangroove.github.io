# Polish round 2, part 1: cards that come from their shield

Dan's notes on preview version 14 (2026-11-24, 3:33 to 3:34 AM ET), verbatim:

- "also the cards need to showcase where they came from when opened like a leading line to the shield or a triangle; anything. the shields need to be have more brand colors, not just 1. why is the X not a part of the card? This is the kind of thing i was hoping would be caught by the critique loop and the polish audits"
- "why does the lennard card have a scroll? the whole thing should be visible"

Read `BRIEF.md` first; its rules still hold, including: an animation always moves the object that is already there; animate only transform and opacity; Red only for the traveller, the X, find markers and the playhead; never ratchet sizes or positions in steps.

## What is there now (version 14, commit aadb2f7)

- **No link between a card and its stop.** Each stop is one `article.stop` (`cards.mjs`): the shield button `.st-btn` and the card `.face`. The whole article scales from the shield's size to the card's (`cardsFrame`, `k = k0 ** (1 - e)`) and the shield fades out as the face fades in (`CARD_GROW.face`). The open card is centred on the screen (desktop) or is a bottom sheet (phone), and the hold camera puts the stop at 45 % across and 55 % down the screen (`camTrip`, `CAMERA.anchorX/anchorY`), which is under the card. Once a card is open, nothing shows which shield it came from.
- **The close X is not part of the card.** `.c-close` is a sibling of `.face` inside the article, positioned over the header's right end (`map.css`, `.jm-steps .c-close`). It is `display: none` until the card is fully open, so it pops in after the card has grown; it does not tilt with the face (the face tilts in 3D with the pointer on desktop); and when the face scrolls, the header scrolls away under it while the X stays put.
- **Cards scroll.** The face has `overflow-y: auto` (`map.css` lines 184 and 250). Its height is capped: desktop and tablet `WORLD.card.cap` 420 px; phone `phoneShare` 0.82 of the height less the step bar. Measured on version 14 (content height / cap, px):
  - 1440 x 900, 1280 x 720 and 820 x 1180: Lennard 428 / 420, so it scrolls by 8 px. The others fit.
  - 412 x 730 (Dan's phone, about): HMC 557 / 547, HMC again 576 / 547, Lennard 608 / 547 scroll.
  - 360 x 640: all six scroll (494 to 633 against 473).
- **Shields carry one colour.** A visited shield (`shieldSvg` in `art.mjs`, `.st-fill`) paints two opposite quarters in the palette's `mark` colour; the other two stay ink. Unvisited shields are ink with paper planks. The paint switches on with `c.fill.style.opacity = visited ? 1 : 0`, so it pops.

## 1. The card opens out of its shield and stays joined to it

**The shield stays.** The stop's shield stays on the map at its stop, at its rest size and fully visible, for the whole time its card is open (it no longer fades into the card). It is drawn above its own card's face and tail (so the card grows out from behind it), but no other stop's shield, label or find draws over an open card.

**The card grows out of the shield.** At the start of the open, the card's face is the shield's size, centred on the shield and hidden behind it; it grows and travels to its open place beside the shield as one continuous move, with today's timings (the hold's `HOLD.open`, the glide's open window, `CARD_GROW` for the face and words). Closing (Back, Next, a glide, the X) is the same move in reverse, back into the shield.

**The tail.** A solid tapered wedge joins the card to the shield, like the pointer of a callout: its base sits on the card's edge facing the shield (base width `CARD_TAIL.base` 28 px desktop, `basePhone` 24 px phone, centred on the line from the card to the shield's centre), and its point touches the shield's rim (a gap of `CARD_TAIL.gap` 2 px outside the rim's outer edge). Its colour is the colour of the card edge it leaves from: the card's ground (`--g`) on desktop and tablet; on phones, where it leaves from the sheet's top edge, the band colour for band layouts (Laurier and Lennard) and the ground otherwise. It has the card's opacity, grows with the card from zero length, and its point stays on the shield's rim at every frame of the open and the close, at rest, and while the face tilts with the pointer (draw it outside the tilting face if that is what keeps the point on the rim). No shadow of its own.

**Where the pair sits.**
- **Desktop and tablet (not phone):** the shield on the left, the tail running level to the right, then the card: [shield][tail][card]. The tail's length from the shield's rim to the card's edge is `CARD_TAIL.len` 40 px. The shield's centre is level with the card's vertical centre. The pair (shield, tail and card together) is centred across the screen; the card's vertical place is today's (between the top and the step bar). If the pair does not fit within `WORLD.card.edge` of both sides, the card narrows first.
- **Phone:** the card stays the bottom sheet (full width, today's place above the step bar). The shield sits centred across the screen above the sheet, its bottom rim `CARD_TAIL.lenPhone` 16 px above the sheet's top edge; the tail rises from the middle of the sheet's top edge to the shield. Above the shield, the map shows. The shield's top must stay clear of the review switch at the top of the screen (`[data-review]`, its bottom edge plus 8 px) while the switch is shown.

**The camera.** At a stop, the camera puts the shield's centre exactly where the pair puts it (this replaces the 0.45 / 0.55 anchor for holds and for the glide views of stops; the overview, the X and explore keep theirs). Every way into a hold (a glide from a neighbour, Back, a move carried mid-glide, a jump from the mini-map or a shield, the arrow keys, a resize or rotation while held, fonts loading late and changing a card's height) ends with the shield at that point, and nothing moves again once the card has opened. The glide's path cache must not reuse a table made for other anchors. The motion tests that pin the old hold anchor change on purpose; all their other gates (speed caps, one glide per move, the carry, no hurry jumps) must still pass.

## 2. The close X is part of the card

Move `.c-close` inside the card's header row (`.c-top`), after the dates pill, so it is part of the card's words: it grows, fades and tilts with the face and appears with the words (`CARD_GROW.words`), never on its own. Remove the header's right padding that made room for the old floating X. Keep: the 44 px target and the 12 px icon (`CARD_CLOSE`), its colours (the header's text colour; on band layouts the ground colour on the band), its name ("Close the {name} card"), pressable only while the card is open and the journey is still, focus moving to the shield when it closes, and `reopenFocus` landing on it when a card reopens.

## 3. No card ever scrolls

Remove the face's scrolling (`overflow-y: auto`, `overscroll-behavior` and the `pan-y` touch-action on `.face`). The card's height always follows its whole content; there is no cap below the content. At every size below, each card shows all of its content at once (the face's `scrollHeight` equals its `clientHeight`), and the card, its tail and its shield are wholly on screen, clear of the step bar and of the review switch:

- desktop 1440 x 900, 1280 x 720, 1024 x 600; tablet 820 x 1180;
- phones 390 x 844, 412 x 730, 360 x 640.

Where the content does not fit (phones, short desktops), use a compact layout. Choose and combine, but drop nothing from any card:

- the piece (the image or the "Piece to come" frame) moves beside the "What I took with me" lines as a smaller frame, keeping its aspect;
- the crafts row and the case study button share one row when they fit;
- tighter gaps and paddings, not below 8 px between blocks;
- the paragraph's line height down to 1.35.

Floors: body text 13 px, headline 22 px, role line 12 px, pill 11 px, kicker 9 px (as `check.mjs` already enforces); the button and the X keep 44 px targets. The reduced-motion list of cards (`.rm`) is a plain page that scrolls as a whole and keeps today's layout.

## 4. Shields in each place's colours

A visited shield paints all four quarters: the two quarters that carry the single colour today (top right and bottom left) in colour A, the other two in colour B, and the boss (its fill; the paper ring and highlight stay) in colour C. Add `shield: [A, B, C]` to each palette in `data.mjs`:

| Palette | A (quarters, top right and bottom left) | B (other quarters) | C (boss) |
|---|---|---|---|
| laurier | gold `#EAA41E` | purple `#330172` | white `#FFFFFF` |
| hmc | green `#0D7247` | white `#FFFFFF` | navy `#1E345D` |
| mohawk | orange `#FB9632` | maroon `#991030` | black `#030303` |
| interkom | coral `#E85155` | cream `#F7F3E2` | near-black `#242021` |
| lennard | orange `#FF4C00` | warm gray 1 `#D8D1CA` | warm gray 11 `#706259` |

The plank lines run across all four painted quarters (ink at today's `MARK.paintAlpha`). Unvisited shields stay as they are. The same paint shows wherever a shield is painted: on the map, under the wayfinder's light, and on the mini-map's visited stop dots (a quartered `conic-gradient` in A and B, same quarters as the shield). The timeline's blocks keep the single `mark` colour. The paint never pops: it fades in over about 0.4 s as the card opens on the first visit, and fades out the same way when Back takes the journey before that visit. Add `shield` to `check.mjs`'s allowed palette keys and check that each value is a 6-digit hex.

## 5. Weight

The combined gzip budget for the map's modules and CSS is now 160 KB (raised from 150 KB before this part; `tools/check.mjs` and `BRIEF.md` already say so). Stay within it; the other budgets stay.

## Checks

- All existing tests pass: `node tools/check.mjs`, `steps-test`, `nova-test`, `depth-test`, `layout-test`, `explore-test`, `finds-test`, `motion-test`, `hammer-test` (run from `design/journey-map`). Update tests only where this brief changes the behaviour they pin (the hold anchor, the X's place in the DOM, the card cap, the palette keys) and say which and why in your report. `finds-test.mjs` digests: re-record the `data.mjs` and `trip.mjs` digests if those files change. **Never change `depth.mjs` at all, not even a comment** (its digest is protected).
- Add `tools/origin-check.mjs`, a browser check in the manner of `tools/audit-capture.mjs` (local headless Edge or Chrome over the DevTools protocol, 127.0.0.1 only, no dependencies), run against `dist/journey-map.html` after `node tools/pack.mjs`. At each size in section 3 and for each stop (`window.__jm.go(id, { instant: true })`, then wait for the card to open) it fails unless: the face does not scroll; the card's and the shield's boxes are wholly on screen; the shield is not covered by the face, the step bar or the review switch; the tail's point is within 1.5 px of the shield's rim; the close button is inside the face. It also samples the tail's point every 50 ms through one open and one close at desktop and phone size and fails if it leaves the rim by more than 1.5 px. Print one line per size.

## Rules

- You may write only these files, all under `design/journey-map/`: `cards.mjs`, `art.mjs`, `map.css`, `data.mjs`, `trip.mjs`, `steps.mjs`, `main.mjs`, the test files in `tools/` named above, the new `tools/origin-check.mjs`, `dist/journey-map.html` and `dist/journey-joined.html` (only through `node tools/pack.mjs` and `node tools/pack-joined.mjs`), and your report `ORIGIN-BUILD.md`.
- Never touch `depth.mjs`, `hero-copy/`, the other briefs and build reports, or anything outside `design/journey-map/`.
- Never run git, never install anything, never use the network, never start reviewer agents or other agents. The review happens elsewhere, in a real browser.
- If a rule stops you from doing something this brief asks, leave it out and say so in your report. Do not work around a rule.
- Plain ASCII punctuation in `ORIGIN-BUILD.md`. Check any new copy for a "?" standing in for an accented letter.

## Report

`ORIGIN-BUILD.md`: what you changed and where, each test you changed and why, the output of every test run and of `origin-check.mjs` (one line per size), the card heights you measured at each size before and after, anything you left out and why, and anything you think the review should look at closely.
