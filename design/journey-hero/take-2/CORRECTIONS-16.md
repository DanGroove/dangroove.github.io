# Round 16: journey hero, second take: the star ring goes all the way round, centred by eye, and held stars tremble

This brief is for the builder. Dan, 21 November, in the thread:

- 7:42 AM ET: "can you make it so the extra stars after the DG logo is completed make a spinning ring that is consistent around it?"
- 7:44 AM ET: "the stars that circle around the logo rn are too close to the D btw so it needs to be visually centered, not just mathematically"
- 8:00 AM ET, after seeing a diagram of a ring one star thick: "good on the spacing, not a fan of the ring just being 1 thick. i liked the randomnness of it before but just wanted it centered and to fully encircle"

- 8:02 AM ET: "lets also have the stars vibrate a bit when held for a certain amount to show that a build up of energy is happening before they explode"

So the ring keeps today's scattered band and today's spin. Only two things change: it is centred by eye (R1), and it goes all the way round (R2). R4 adds the tremble before the blast.

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
- `ring`: `{ centre: weight, radius, band }`.

The ring is a band, as today, but measured from the weight centre:
- Its middle (`radius`) is the farthest placed point from the weight centre, plus `STARS.mark.ringGap` times the mark's height. This is the spacing Dan approved.
- Its depth (`band`) is `STARS.mark.ringBand` times the mark's height, centred on the middle.
- Each ring star keeps its own radius in the band, from the same hash as today: `radius + (hash(i, 6) - 0.5) * band`.
- Set `ringGap: 0.13` and `ringBand: 0.07` in `STARS.mark`, so Dan can tune them. They replace `STARS.mark.ring: [8, 22]`; today's band is also 14 px deep at this size.

The numbers at 1474 x 996:
- The mark is 199.2 px tall. Its weight centre is (-16.5, +1.1) px from the box centre, toward the D.
- That lies within 2 px of the centre of the smallest circle round the mark's outline (-18.3, 0). That is why it reads as centred: the D's corners and the G's outer edge end up about equally far from the ring.
- The band's middle is 153.5 + 25.9 = 179.4 px, and it runs 7 px either side (172.4 to 186.4).
- Clearance from the band to the D's top and bottom corners is 17 to 31 and 18 to 32 px. To the G's right edge it is 21 to 35 px. Today those are about 7 to 21 and 40 to 54.

## R2. The scattered ring goes all the way round

- **Scattered, as today.** Each star keeps its own radius in the band (R1).
- **All the way round.** Today a ring star keeps the angle it was captured at, so the ring bunches where the pointer swept. Instead, the stars are spread round the whole circle:
  - The circle is cut into N equal slots, one per ring star.
  - Each star sits off the middle of its slot by its own fixed fraction of a slot: `jitter = 0.7 * (hash(i, 7) - 0.5)`, so up to 0.35 of a slot either way. It reads as scattered, not as a dotted line.
  - With less than half a slot either way, neighbours never swap places.
- **Spin, as today.** The ring turns as one at `STARS.hold.turn` (a quarter turn a second, clockwise on screen), with a ring phase that advances by that much each second.
- **Work in the ring's turning frame.** Each ring star has a ring angle ψ, its angle round the ring centre less the phase.
  - Star k's target is `δ + (k + 0.5 + jitter) * 2π/N`.
  - When stars join, put them in order by ψ among the current members.
  - Choose δ as the circular mean of (ψ_k - (k + 0.5 + jitter_k) * 2π/N) over the new order. That way the stars already there move as little as possible, no more than about one slot.
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

## R4. The held stars tremble as the charge builds

Dan wants the captured stars to "vibrate a bit" once a hold has gone on a while, "to show that a build up of energy is happening before they explode".

- **When.** The tremble starts `STARS.charge.start` (1.5 s) after the formation starts (`hold.formedAt`), once the logo has had time to form. At Dan's view that is about 3.8 s held. Without a mark, it starts 1.5 s after `STARS.hold.full`.
- **How much.** Its amplitude rises from 0 to `STARS.charge.amp` (1.5 px) over `STARS.charge.ramp` (2 s), with the `smooth` curve, then stays there until the release. It never grows past that, so the logo stays readable however long the hold.
- **What.** Every captured star trembles: the mark's stars, the ring's and any still in the cluster.
  - Each star's offset is `a * [sin(2π f_x t + φ_x), sin(2π f_y t + φ_y)]`, where a is the amplitude and t is the time held.
  - Each star has its own frequencies, 10 to 16 Hz (hashed, so they differ between x and y), and its own phases (hashed).
  - The tremble rides on top of where the star would be. It does not change its target, its arrival, its mark weight or the ring's order.
- **Release.** The blast starts from where the star is shown, tremble included, so nothing jumps. After the release there is no tremble. The blast itself is unchanged.
- Name `STARS.charge = { start: 1.5, ramp: 2, amp: 1.5, hz: [10, 16] }` so Dan can tune it.

## Checks

**In Node.** Put the new checks in `tools/round16-checks.mjs` and call it from `tools/checks.mjs`.

R1:
- The weight is the mean of the points (1e-9).
- The ring centre is the mark's centre plus the weight (1e-9).
- The band's middle is the farthest point plus 0.13 h, and its depth is 0.07 h (1e-9).
- At 1474 x 996:
  - the weight's x is between -18 and -15 px;
  - the clearances to the D's two square corners and to the G's rightmost point (measured on the outline, `flattenPath`) differ by at most 5 px.

R2. Use a full 600-point mark. Hold at [700, 450], then sweep so that at least 150 stars join the ring. Also run round 9's 40-point case.
- 1.5 s after the last join:
  - every ring star is within 0.5 px of its own radius, and every radius lies in the band;
  - with 50 or more ring stars, the radii span at least 80 % of the band;
  - every star is within 0.002 rad of its target, so its offset from its slot is its jitter;
  - every gap between neighbours round the circle is between 0.3 and 1.7 slots (2π/N), so the ring goes all the way round with no bunching.
- The phase advances by exactly `STARS.hold.turn` x dt each frame.
- Every settled ring star's angle advances by that much, within 1 %.
- The ring's cyclic order never changes. Check every frame.
- On each join, no existing star's target moves by more than 1.5 slots.

R3:
- Hold at each edge and each corner, at 1474 x 996, 1280 x 800 and 1024 x 640.
- The ring circle and every mark point stay at least 16 px inside the hero, before and after the ring appears.
- The mark's centre never jumps when the ring appears.

R4:
- No star trembles before `formedAt + start`, and none after the release.
- The amplitude follows the ramp exactly (1e-9), never exceeds `amp`, and is `amp` from `formedAt + start + ramp` on.
- Each star's tremble is its own: the frequencies lie in 10 to 16 Hz and differ between x and y. No two stars of a sample of 100 share all four values.
- With the tremble taken out, every star's path equals the path without R4 (1e-9). So arrival, the mark weight, the ring and the R2 checks are untouched.
- At the release frame, every star's shown position equals the blast's start (1e-6 px).

**Negative controls.** Each must make its check fail:
- a tremble that starts at the press;
- a tremble that grows past `amp`;
- the box centre for the ring;
- one radius for every ring star (no band);
- no jitter (a plain dotted ring);
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
- Film the tremble from `formedAt + 1` s to `formedAt + 4` s every 0.05 s, cropped to the mark, and take one still at full tremble.

Put everything in `.scratch/review-out/r16/`.

## Records

Add a "CORRECTIONS-16" section to BUILD.md, and update README's star paragraph if it describes the ring.
