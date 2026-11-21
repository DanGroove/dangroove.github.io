# Round 12: journey hero, second take: more stars before the logo, real phone sizes, no empty frames in InDesign, exports further left, and a new craft list change

This brief is for the builders. Dan, 21 November, 2:35 to 2:37 AM ET:

- "can we make it so the treshold of stars collected is higher before it turns into the logo?"
- "also the i just realized the phone is as big as the tablet."
- "can we do something more creative than the line for the table?"
- "also can we just get rid of the frames in the indesign section? they are confusing for the section"
- "I think the exports still look like they are a little too far to the right, probably need to be pushed to the left more"

Everything in `CORRECTIONS-2.md` to `CORRECTIONS-11.md` still holds unless it is changed here. Nothing here touches anything outside `design/journey-hero/take-2/`, and `public/` stays untouched.

## S1 (major). The logo forms only once enough stars are gathered

- **The rule:** the formation starts when the hold has captured 300 stars, not at 1.4 s held. Name it `STARS.mark.threshold`. With a still pointer in the middle of the hero at 1440 x 900, that is about 2.3 s held.
- **Holds near an edge:** a hold there catches fewer stars. When the capture radius reaches its full 2.5 s size and fewer than 300 are captured, the radius keeps growing at the same rate (104 px a second) until 300 are captured. If it reaches the hero's diagonal first, the logo forms with what it has. Once the formation starts, the radius stops growing.
- **Unchanged:**
  - the formation itself, its colours and fades (rounds 9 and 10);
  - the blast's impulse, which still scales with held time capped at 2.5 s;
  - the short click.
- **Checks:**
  - No star is given a point before 300 are captured.
  - At the middle, the threshold is reached at about 2.3 s.
  - In a corner, the radius grows past 340 px until 300 are caught, and then stops.
  - **Negative control:** go back to the 1.4 s start, and the threshold check fails.

## L2 (major). The craft list: the current row is selected like a layer in a design app

This replaces round 11's red rule. Dan has the choice; this is the recommended option, built while he decides.

- **At rest:** the current row is shown as selected, the way the big screen's apps show a selected frame.
  - A 1 px red `#F0484F` rectangle runs exactly round the row: its top and bottom on the row's own hairlines, and its sides at the row's left and right edges.
  - It has four small square handles centred on its corners: 5 px, solid red, square corners.
  - The current row's text is paper and its number red, as today. The other rows are as today.
  - On phones, the rectangle frames the current cell of the 2 x 2 grid.
- **When the craft changes:** the selection travels to the new row.
  - Its leading edge (the edge on the side it is moving toward) moves first, over 0.3 s. Its trailing edge follows from 0.1 s to 0.45 s. Both use `EASE.wipe`.
  - So the selection stretches across the rows in between, then closes up on the new row. The handles ride its corners.
  - The new row's text cuts to paper and its number to red when the leading edge reaches the far side of that row. The old row cuts back when the trailing edge leaves it. These are hard cuts, with no fades.
  - On phones the selection moves in both directions at once, by the same rule, edge by edge.
- **A change during a change:** each edge goes on from where it is to its new target, with the same timing.
- **Kept from round 11:**
  - it runs on its own clock;
  - `__hero.crafts(p)`;
  - every trigger, and the rule that it always starts from the craft that was actually current;
  - the entrance and loop start make no change;
  - reduced motion cuts at once;
  - no layout number changes;
  - hover, focus and `aria-current` keep working.
- **In the entrance:** the selection's top and bottom lines draw with the row's hairlines, and the handles cut in as their corners' lines arrive.
- Remove round 11's red rule.
- **Checks:**
  - a model of one change and of a change during a change;
  - the cuts happen at the right edges;
  - a jump from 04 to 01 across the whole list;
  - the phone grid;
  - **negative control:** move both edges together, and the "leading edge first" check fails.

## D1 (major). Phones in true proportion to the tablets beside them

Today every phone is as tall (deep, lying flat) as the tablet next to it:
- InDesign: the post's phone is 0.70 x 1.45 beside the e-blast's tablet of 0.936 x 1.45.
- Video and motion: the phones are 0.955 x 1.8 beside a 3.09 x 1.8 tablet on its side.
- UX/UI: the phone is 0.895 x 1.8 beside a 1.38 x 1.8 tablet standing up.

Make each phone the size it would be beside that tablet in life. Take today's phone and tablet bodies as the reference: phone 71.6 x 147.6 mm, tablet 179.5 x 248.6 mm.
- **Next to an upright tablet** (InDesign, UX/UI), the phone is 0.594 of the tablet's height.
- **Next to a tablet on its side** (video, motion), the phone is 0.822 of the tablet's height.
- **The phone's own shape** is 71.6 : 147.6.

Keep each tablet's size. InDesign's tablet may widen toward a real tablet's shape within the width the smaller phone frees. Keep the gaps. Align each phone's front edge (toward the viewer) with its tablet's front edge. Every group stays centred as it is, before X1's shift.

What plays on each phone must fit its new screen, as now. Labels and leader lines follow the new corners, with no new collisions.

In Figma's canvas on the big screen, the phone's frame must stay in the same proportion to the tablet's frame as the devices (Dan asked that the canvas mirror them). Keep canvas content clear of the bar and Export.

**Checks:**
- each phone's size against the rule, within 2 %;
- the front edges aligned;
- every group's centring;
- the labels' existing checks.

## I1 (major). InDesign without empty frames

Today InDesign starts with four draw steps (`frame0` to `frame3`, from about 1.17 to 3.45 s of the scene). They draw the spread, the cover, the post and the e-blast as empty frames with crossed lines, and the pictures are then dragged into them. Dan finds the frames confusing.

- **Remove** the four frame-draw steps and every empty frame (the crossed boxes, including the map's box inside the spread).
- **The document opens with its pages already there,** as plain blank pages, the way a new InDesign document opens: the spread's two pages, the cover, the post and the e-blast. Each looks as `frame0` to `frame3` left it once drawn, without the crossed lines. Each picture is then dragged straight onto its page, as now.
- The selection guides on placed pictures stay. Everything else in the scene stays.
- **Timing:** the scene gets shorter by the removed steps and their approaches. The loop's length follows. The hand rules of round 7 still hold, and so does every check that is retimed from the scripts.
- **Checks:**
  - no empty-frame piece anywhere in InDesign;
  - the pages are present from the scene's first frame;
  - every picture lands on its own page;
  - the new loop length is printed;
  - **negative control:** put one frame step back, and the check fails.

## X1 (major). The exports sit further left

The export groups are centred on the screen's middle in world space (round 2, Dan's rule). Dan still sees them a little too far right.

Add one named constant, `EXPORT_SHIFT` in world units. Apply it to the world x of every export group and of what goes with it:
- InDesign's block and the booklet's reading place;
- the video and motion mat;
- the UX/UI row, including the laptop's slide-in path;
- the light pool on the floor (`POOL`).

Set it to -0.5 for now. Dan may choose another value from a comparison sheet, so it must be a one-number change.

**Checks:**
- every group's world centre is the screen's middle plus `EXPORT_SHIFT`;
- the labels stay inside the hero at the ten browser-check sizes;
- the phone layout still fits the first screen (390 x 664).

This changes the scene's box, so the stage's layout numbers may change. Report them. Run `tools/browser-check.mjs` once at the end of this part only.

## Films and records

- **For S1 and L2:**
  - a hold in the middle and one in a corner, with frames at 1.0, 2.0, 2.5, 3.0 and 3.5 s held;
  - the craft list every 0.05 s for a change from 01 to 02, one from 04 to 01, and one in the phone grid, cropped at device pixel ratio 2.
- **For D1, I1 and X1:**
  - stills of each export group before and after at 1440 x 900 and 390 x 844;
  - InDesign's first 6 s at 0.25 s steps, before and after.
- Put them in `.scratch/review-out/r12/`.
- Add a "CORRECTIONS-12" section to BUILD.md and lines to README.
