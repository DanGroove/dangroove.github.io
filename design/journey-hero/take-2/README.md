# Journey hero, second take

The first take (four bars that fold into four objects, now in `public/journey/`) was judged "a little abstract and too simple".
This folder is the second take, as a prototype. Nothing here is published, and the built page does not use it yet.

## The idea

One big screen floats over the floor. Each craft is a real app on it, drawn simply but with its own logo, and the app builds a piece
of Dan's real work. The cursor clicks Export, and what is exported lands in front of the screen, lying flat, in one tidy block.

Graphic design is three apps, in the order the work is really made:

1. Photoshop: a photo edit of the building, which the later pieces all use.
2. Illustrator: the booklet's two maps, simplified: King Street from the amenities page, and downtown from the location page.
3. InDesign: the 1 King Street W booklet, and a LinkedIn post and an e-blast that follow it.

Nothing lands on the floor when Photoshop and Illustrator export: their work goes on into the next app. InDesign's export is what
lands. Behind: one stack of closed copies of the booklet, the post in a phone, the e-blast in a tablet. In front: one copy is taken
off the top of the stack, set down, opened, and leafed through (The Offering, Location, Amenities, the gallery).

Video (an editing app) and motion (words and shapes, the way a SaaS promo moves) are in, each exported to three screens. UX/UI is
still to be drawn to the same rules.

## The rules Dan set

- Everything exported lies flat, in a tidy block. What belongs on a phone is shown inside a phone.
- The app is an abstract depiction, but it carries the app's own logo, so people know which app it is.
- The flyer is his 1 King Street W booklet, drawn very simply. It is black, charcoal and gold.
- No assets appear on the floor when Photoshop and Illustrator export.
- The booklets land as one stack of closed copies. One is taken off the top and its pages are flipped through, and one of those
  pages is the amenities page. A page must turn like real paper, which bends, and not like a stiff slab.
- The amenities map is simplified: about half as many squares as the flyer has, and the shops' names are bars.
- The location map is shown in Illustrator too, and the Location spread is one of the spreads the booklet is flipped through.
  It is simplified as well: its streets, its transit lines and its landmarks are there, and each landmark and each transit
  company is a plain badge with bars, not its logo.
- The firm's logo and the building's logo are each drawn as a blob, not as the real logo.
- No agent's name or contact details appear anywhere.
- The flyer's source files are not in this repository and must not be added to it.

## What is here

- `sq.mjs` the prototype renderer. WebGL2, no dependencies. Every piece is one superquadric (a box, a cylinder, a ball, or anything
  between them), with one light, a shadow map and three hard tones per material. A piece can carry a picture on its face.
- `kit.mjs` the helpers that make pieces and move them.
- `art.mjs` every picture (a page, a logo, an icon), drawn with the 2D canvas into one atlas.
- `fonts/` Gelasio and Rokkitt, open faces under the SIL Open Font License, which stand in for the flyer's Georgia and Rockwell.
- `stage.mjs` the scenes, held still: the screen, each app, and what it has exported.
- `stage.html` one scene on its own. `?s=0..4` picks it, `?yaw=-25&pitch=8` turns the view, `?atlas=1` shows the pictures.
- `stills.mjs` and `tools/sheet.mjs` the scenes in the hero's own layout, on one sheet for comments. On the stills page `?at=` sets
  where the copy that is being read has got to: -1 is on the stack, 0 is set down and still shut, 1 is open at The Offering,
  2 at Location, 3 at Amenities, 4 at the gallery, and anything between is a leaf part of the way over.

## How a page turns

A leaf is a row of narrow strips, each hinged on the one before (`leaf` in `stage.mjs`). Its free edge runs ahead of its root on the
way up and behind it on the way down, so the edge peels up first, the leaf swings over the spine in a shallow arc, and it lands
from the spine outward. The renderer dims a strip's picture where the strip turns from the light, with the same hard edge the
tones have, so the bend shows.

## Looking at it

    node design/journey-hero/tools/serve.mjs
    http://localhost:4173/design/journey-hero/take-2/stage.html?s=2

    node design/journey-hero/take-2/tools/sheet.mjs sheet.png 0,1,2,3,4

## What comes next

The UX/UI app. Then the motion itself: how the screen changes between apps, the Export click, the work landing, the copy leaving
the stack and its pages turning. Then a brief for the production build.
