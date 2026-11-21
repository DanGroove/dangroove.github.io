# Round 16: journey hero, second take: the extra stars make one even ring, centred by eye

This brief is for the builder. Dan, 21 November, in the thread:

- 7:42 AM ET: "can you make it so the extra stars after the DG logo is completed make a spinning ring that is consistent around it?"
- 7:44 AM ET: "the stars that circle around the logo rn are too close to the D btw so it needs to be visually centered, not just mathematically"

Everything in `CORRECTIONS-8.md` to `CORRECTIONS-15.md` still holds unless it is changed here. This round touches only the star field (`stars.mjs`) and its checks. Nothing here touches anything outside `design/journey-hero/take-2/`, and `public/` stays untouched.

## What happens today

- A hold forms the DG mark once it has captured `STARS.mark.threshold` (300) stars. The mark has 600 points, and later captures take the free points.
- Once all 600 are taken, each further star becomes a ring star (`assign`'s `rest`):
  - it keeps the angle it was captured at;
  - it goes to its own radius, `ringRadius(i, mark)`: the mark's `reach` plus 8 to 22 px, hashed per star;
  - it turns at `STARS.hold.turn` (a quarter turn a second) round `centre`, the mark's bounding-box centre.
- So the ring is a patchy band, bunched where the stars were captured.
- It also hugs the D. The D's square corners are the farthest points from the box centre, so the ring passes them at 8 to 22 px, while the G's right edge gets about 47 px (at Dan's 1474 x 996).

## R1. The ring is centred on the mark's weight, not its box

`placeMark` also returns:
- `weight`: the mean of the placed points, in px from the box centre. The sampler spreads the points evenly over the fill, so this is the fill's centroid.
- `ring`: `{ centre: weight, radius }`.

The radius is the farthest placed point from the weight centre, plus `STARS.mark.ringGap` times the mark's height. Set `ringGap: 0.13` in `STARS.mark`, so Dan can tune it. Remove `STARS.mark.ring: [8, 22]` and the hashed per-star radius.

The numbers at 1474 x 996:
- The mark is 199.2 px tall. Its weight centre is (-16.5, +1.1) px from the box centre, toward the D.
- That lies within 2 px of the centre of the smallest circle round the mark's outline (-18.3, 0). That is why it reads as centred: the D's corners and the G's outer edge end up about equally far from the ring.
- The radius is 153.5 + 25.9 = 179.4 px.
- Clearance from the ring to the D's top and bottom corners is 24.0 and 25.4 px. To the G's right edge it is 28.0 px. Today those are about 14 and 47.

## R2. One even ring that turns steadily

- **One radius.** Every ring star shares it.
- **Even spacing.** Once settled, the stars are evenly spaced round the circle. Every gap between neighbours is 2π/N.
- **Steady spin.** The ring turns as one, with a ring phase that advances at `STARS.mark.spin`.
  - Set it to one turn every 8 s (2π/8 rad a second), in the same direction as today's turn (clockwise on screen). Today's quarter turn a second is about 280 px a second at this radius. A turn every 8 s is calmer and still plainly spinning.
  - Name it in `STARS.mark` so Dan can tune it.
- **Work in the ring's turning frame.** Each ring star has a ring angle ψ, its angle round the ring centre less the phase.
  - The slots are `δ + 2πk/N`.
  - When stars join, put them in order by ψ among the current members.
  - Choose δ as the circular mean of (ψ_k - 2πk/N) over the new order. That way the stars already there move as little as possible, no more than about one slot.
  - Each star's ψ and radius follow their targets with the existing critically damped `follow` (tau `1 / STARS.hold.pull`, 0.2 s), from rest in the turning frame. Unwrap each target to the nearest equivalent of the star's ψ.
- **No passing.** Once a star is in the ring, the ring's cyclic order by ψ never changes.
- **Joiners** come in from where they were captured, straight to their slot, as today. They may cross the mark on the way, and that is fine.
- **Look.** Ring stars keep their own look (size, mix, red; m stays 0, as round 10 checks), so the spin shows.
- **Release.** Ring stars blast with the rest, exactly as today.
- **State.** `markState()` also reports the ring: `{ centre, radius, phase, count }`. `__hero.stars.mark` carries it.

## R3. The ring stays on the screen

- `markCentre` clamps the mark so that both the whole mark and the whole ring circle stay inside the hero, with the 16 px margin.
  - If the ring cannot fit on an axis, fall back to today's mark-only clamp on that axis.
  - If even the mark cannot fit, fall back to the middle, as today.
- The clamp applies from the press, so nothing jumps when the ring appears.
- Near an edge, the mark now forms up to about 45 px further in than today. Everywhere else it is unchanged.

## Checks

**In Node.** Put the new checks in `tools/round16-checks.mjs` and call it from `tools/checks.mjs`.

R1:
- The weight is the mean of the points (1e-9).
- The ring centre is the mark's centre plus the weight (1e-9).
- The radius is the farthest point plus 0.13 h (1e-9).
- At 1474 x 996:
  - the weight's x is between -18 and -15 px;
  - the clearances to the D's two square corners and to the G's rightmost point (measured on the outline, `flattenPath`) differ by at most 5 px.

R2. Use a full 600-point mark. Hold at [700, 450], then sweep so that at least 150 stars join the ring. Also run round 9's 40-point case.
- 1.5 s after the last join:
  - every ring star is within 0.5 px of the radius;
  - every gap between neighbours is within 0.002 rad of 2π/N.
- The phase advances by exactly spin x dt each frame.
- Every settled ring star's angle advances by spin x dt, within 1 %.
- The ring's cyclic order never changes. Check every frame.
- On each join, no existing star's target moves by more than 1.5 slots.

R3:
- Hold at each edge and each corner, at 1474 x 996, 1280 x 800 and 1024 x 640.
- The ring circle and every mark point stay at least 16 px inside the hero, before and after the ring appears.
- The mark's centre never jumps when the ring appears.

**Negative controls.** Each must make its check fail:
- the box centre for the ring;
- today's hashed radius band;
- ring stars kept at their capture angles;
- a join that orders by star index;
- the old mark-only clamp.

**Existing checks:**
- Update round 9's overflow check ("outside the mark") to measure from the ring centre, against the farthest point from it.
- Keep every other check clean. Say which ones changed and why.
- `node design/journey-hero/take-2/tools/checks.mjs` must print all clean.

**In a browser** (Playwright is preinstalled; `.scratch/review-out/r9/film-hold.mjs` shows how a hold was filmed). At 1474 x 996:
- Script a mouse hold right of the stage's middle, sweep until more than 600 stars are captured, then hold still.
- Film from the formation until 3 s after the last join, every 0.1 s, cropped to the ring.
- Take one still of the settled ring, and the same still from today's code, for a before and after.
- From the still, fit a circle to the ring's stars. Its centre must be within 2 px of the mark's weight centre.

Put everything in `.scratch/review-out/r16/`.

## Records

Add a "CORRECTIONS-16" section to BUILD.md, and update README's star paragraph if it describes the ring.
