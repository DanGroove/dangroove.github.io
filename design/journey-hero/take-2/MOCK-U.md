# MOCK-U: the ring wait, the fast-drag crossing fix (L13c)

This is the mock's change to `stars.mjs` as built at 9ef30e9, as a diff: **a reference for the rule and the numbers only** (CORRECTIONS-19.md, L13c). Build it properly; do not paste it. The `FIX:` comments are the mock's notes.

## How the numbers were measured

A probe copy of the page exposes `__hero.stars.field` and is polled once per 16 ms frame on the controlled clock (`page.clock.install`, `?t=1`) at 1440 x 900, while holding the mouse down for 9 s, either still at (900, 450) or along L13b check 4's fast path. The first frame in which stars have points is the first batch. After it, a star is counted the first time it has a point (ring stars given a point included): its flight is `c.e0`, its start is `s = p + e` about the mark's centre (p its point, e its offset when given the point), it crosses when `c.e0 > |s| + 1 px`, and it ends on the far side when the cosine between `s` and `p` is negative. The fill time is the first frame with `markState().assigned >= markState().points`, counted from the first frame with `formed`.

| run | build | later stars | cross | far side | flight p50 / p95 / max (px) | formed, filled (s) |
| --- | --- | --- | --- | --- | --- | --- |
| still | the mock (this diff) | 300 | 0 | 0 | 316 / 429 / 456 | 1.37, 2.28 |
| fast | the mock (this diff) | 286 | 0 | 0 | 275 / 380 / 428 | 0.25, 0.57 |
| fast | 9ef30e9 as built | 296 | 93 | 90 | 300 / 540 / 580 | 0.25, 0.48 |

Run 13's own check 4 gave 125 of 288 on the fast run and 6 of 300 on the still hold for 9ef30e9; its method differs a little from the probe's, so match the rule, not the exact counts.

## The diff (stars.mjs, 9ef30e9 to the mock)

```diff
@@ -138,7 +138,11 @@
       const pts = [...hold.freePoints].slice(0, k).sort((a, b) => Math.atan2(mark.points[a].y, mark.points[a].x) - Math.atan2(mark.points[b].y, mark.points[b].x));
       take.forEach((t, q) => { t.j = pts[q]; });
     } else {
-      rest = at; take = [];
+      // FIX: every star waiting in the ring is a candidate too, and a star takes only a free point nearer to it than the mark's
+      // centre is, so no flight crosses the mark. A captured star with no such point waits in the ring until the ring's turn
+      // (or the mark's motion) brings one to its side.
+      const ringers = ring.order.map(i => { const [x, y] = position(i); return { i, x, y, ring: true }; });
+      rest = at.concat(ringers); take = [];
       const nearest = t => {
         t.j = -1; t.distance = Infinity;
         for (const j of hold.freePoints) {
@@ -147,22 +151,27 @@
         }
       };
       rest.forEach(nearest);
-      while (take.length < k) {
-        let best = 0;
-        for (let q = 1; q < rest.length; q++) if (rest[q].distance < rest[best].distance) best = q;
+      const near = t => t.j >= 0 && t.distance < (t.x - C[0]) ** 2 + (t.y - C[1]) ** 2;
+      while (hold.freePoints.size) {
+        let best = -1;
+        for (let q = 0; q < rest.length; q++) if (near(rest[q]) && (best < 0 || rest[q].distance < rest[best].distance)) best = q;
+        if (best < 0) break;
         const t = rest.splice(best, 1)[0]; take.push(t); hold.freePoints.delete(t.j);
         // Only candidates whose nearest point was just taken need another search.
         for (const r of rest) if (r.j === t.j) nearest(r);
       }
+      rest = rest.filter(t => !t.ring);
+      const leaving = new Set(take.filter(t => t.ring).map(t => t.i));
+      if (leaving.size) leave(leaving);
     }
     take.forEach(t => {
       const c = cluster.get(t.i), p = mark.points[t.j];
       hold.freePoints.delete(t.j);
-      c.point = t.j; c.kind = p.kind; c.e = [t.x - C[0] - p.x, t.y - C[1] - p.y]; c.ev = [0, 0]; c.arrived = false;
+      c.ring = false; c.point = t.j; c.kind = p.kind; c.e = [t.x - C[0] - p.x, t.y - C[1] - p.y]; c.ev = [0, 0]; c.arrived = false;
       // R2: from here the front look eases from the star's own toward this point's (its colour code says which mark colour).
       c.e0 = Math.hypot(c.e[0], c.e[1]); c.given = true; flags[t.i] = markFlag(c.kind); mixes[t.i] = 0;
     });
-    hold.next += k;
+    hold.next += take.length;
     if (rest.length) join(rest.map(t => t.i), C);
   }
   // Round 16 (R2): stars join the ring. Each starts at the angle it was captured at, as its ring angle psi (its angle round
@@ -186,6 +195,14 @@
     let at = 0;
     for (const f of fresh) { while (at < merged.length && merged[at].a <= f.a) at++; merged.splice(at, 0, f); at++; }
     ring.order = merged.map(m => m.i);
+    respace();
+  }
+  // FIX: members that took a point leave the ring; the rest close up the way joiners are let in.
+  function leave(ids) {
+    ring.order = ring.order.filter(i => !ids.has(i));
+    if (ring.order.length) respace();
+  }
+  function respace() {
     const N = ring.order.length;
     let sx = 0, sy = 0;
     const slot = (k, c) => TURN * (k + 0.5 + c.jitter) / N;
@@ -258,7 +275,7 @@
       const fresh = [];
       for (const [i, c] of cluster) if (c.point === undefined && !c.ring) fresh.push(i);
       formed = true;
-      if (fresh.length) assign(hold, fresh, centre);
+      if (fresh.length || (hold.next && hold.freePoints.size && ring.order.length)) assign(hold, fresh, centre);
     }
     if (mark) turnRing(dt);
     for (const [i, c] of cluster) {
```
