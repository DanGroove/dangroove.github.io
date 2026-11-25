# Mock V: the loader's stars on one clock (L16)

The mock is 3232c60's preview pack with two lines of `loaderAt` changed, in both of the pack's copies (the inline loader, which is also the worker's source, and the module):

```diff
-  const launches = Array.from({ length: count }, (_, i) => crossing(launchShare(i, count)));
+  const launches = Array.from({ length: count }, (_, i) => launchShare(i, count) / rate);
-  const fullAt = ready ? crossing(1) : Infinity;
+  const fullAt = ready ? events.at(-1)[0] : Infinity;
```

`holdAt` stays `Math.max(formedAt, fullAt, events.at(-1)[0])`, which is now the later of the last landing and the last boot step. This is a sketch of the rule, not the build: name and structure it as you see fit.

## How it was measured

Chromium (the repo's Playwright), the pack opened from a file with every non-file request aborted, `deviceScaleFactor` 1 at 1440 x 900 and 3 with touch at the phone sizes, real time (no `?t`).

- An init script redefines `window.__loaderStars` with a setter, so that when the inline loader sets its bridge, `bridge.boot` is wrapped to record `bridge.state(performance.now() / 1000).time` as each boot step arrives. That is the step's time on the loader's own clock.
- A `requestAnimationFrame` loop reads `bridge.state(performance.now() / 1000)` every frame until its phase is `entrance`, keeping the last `launches`, `formedAt`, `holdAt` and `burstStart`.
- Batches: the sorted launch times, split wherever two neighbours are more than 0.12 s apart.
- Slowed runs: `context.newCDPSession(page)` and `Emulation.setCPUThrottlingRate` with rate 4, sent before `page.goto`.
- Late atlas: a probe copy of the pack with `await new Promise(resolve => setTimeout(resolve, 2500));` added on the line before `bootDone('atlas');`.

## Numbers

| Load | Batches | Largest launch gap | Last boot step | Hold | Burst |
| --- | --- | --- | --- | --- | --- |
| 3232c60, 1440 x 900 (x2) | 177 in 0 to 0.41 s, then 423 from 1.15 / 1.05 s | 0.74 / 0.64 s | 1.31 / 1.18 s | 3.14 / 3.04 s | 3.90 / 3.80 s |
| 3232c60, 390 x 844 (x2) | 177, then 423 from 1.15 / 1.30 s | 0.74 / 0.89 s | 1.30 / 1.45 s | 3.14 / 3.29 s | 3.90 / 4.05 s |
| 3232c60, 412 x 730 (x2) | 177, then 423 from 1.11 / 1.13 s | 0.70 / 0.72 s | 1.27 / 1.28 s | 3.10 / 3.12 s | 3.86 / 3.88 s |
| 3232c60, 1440 x 900, CPU / 4 | 177, then 423 from 3.31 s | 2.90 s | 3.58 s | 5.30 s | 6.06 s |
| 3232c60, 390 x 844, CPU / 4 | 177, then 423 from 3.24 s | 2.83 s | 3.53 s | 5.22 s | 5.98 s |
| 3232c60, 1440 x 900, atlas 2.5 s late | 177, then 423 from 3.77 s | 3.36 s | 3.94 s | 5.76 s | 6.52 s |
| Mock, 1440 x 900 (x2) | 600 in 0 to 1.40 s | 2 ms | 1.37 / 1.19 s | 2.40 s | 3.16 s |
| Mock, 390 x 844 (x2) | 600 in 0 to 1.40 s | 2 ms | 1.39 / 1.38 s | 2.40 s | 3.16 s |
| Mock, 412 x 730 (x2) | 600 in 0 to 1.40 s | 2 ms | 1.34 / 1.44 s | 2.40 s | 3.16 s |
| Mock, 1440 x 900, CPU / 4 | 600 in 0 to 1.40 s | 2 ms | 3.62 s | 3.63 s | 4.39 s |
| Mock, 390 x 844, CPU / 4 | 600 in 0 to 1.40 s | 2 ms | 3.26 s | 3.26 s | 4.02 s |
| Mock, 1440 x 900, atlas 2.5 s late (x2) | 600 in 0 to 1.40 s | 2 ms | 3.93 / 3.82 s | 3.93 / 3.82 s | 4.69 / 4.58 s |

Eleven earlier loads of 3232c60 the same evening split the same way (177, then 423), with gaps of 0.75 to 0.90 s. The boot steps on 3232c60 at 1440 x 900, from marks added to a probe copy: the fonts land before the loader's first frame (clamped to 0), the mark's sampling ends at about 0.03 s, the atlas is drawn in 56 to 58 slices of about 17 ms until about 0.96 s, its six pages upload by about 1.15 s, and the first frame follows at about 1.32 s.
