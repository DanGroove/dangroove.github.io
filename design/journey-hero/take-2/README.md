# Journey hero, second take

The first take (four bars that fold into four objects, now in `public/journey/`) was judged "a little abstract and too simple".
This folder is the second take, as a prototype. Nothing here is published, and the built page does not use it yet.

## The idea

One big screen floats over the floor. Each craft is a real app on it, drawn simply but with its own logo, and the app builds a piece
of Dan's real work. The cursor clicks Export, and the piece lands in front of the screen, lying flat. The flat lay fills up, app by
app, into one tidy block.

Graphic design is three apps, in the order the work is really made:

1. Photoshop: a photo edit of the building, which the later pieces all use.
2. Illustrator: the map of King Street from the booklet's amenities page, simplified.
3. InDesign: the 1 King Street W booklet, and a LinkedIn post and an e-blast that follow it. One booklet lands, lying open, and it
   turns its own pages (The Offering, Amenities, the gallery). The post lands in a phone and the e-blast in a tablet.

Video is in (an editing app, exported to three screens). Motion and UX/UI are still to be drawn to the same rules.

## The rules Dan set

- Everything exported lies flat, in a tidy block. What belongs on a phone is shown inside a phone.
- The app is an abstract depiction, but it carries the app's own logo, so people know which app it is.
- The flyer is his 1 King Street W booklet for Lennard, drawn very simply. It is black, charcoal and gold.
- There is one booklet on the floor, not a pile of them, and its pages turn. One of the pages is the amenities page.
- The amenities map is simplified: about half as many squares as the flyer has, and the shops' names are bars.
- No agent's name or contact details appear anywhere.
- The flyer's source files are not in this repository and must not be added to it.

## What is here

- `sq.mjs` the prototype renderer. WebGL2, no dependencies. Every piece is one superquadric (a box, a cylinder, a ball, or anything
  between them), with one light, a shadow map and three hard tones per material. A piece can carry a picture on its face.
- `kit.mjs` the helpers that make pieces and move them.
- `art.mjs` every picture (a page, a logo, an icon), drawn with the 2D canvas into one atlas.
- `fonts/` Gelasio and Rokkitt, open faces under the SIL Open Font License, which stand in for the flyer's Georgia and Rockwell.
- `stage.mjs` the scenes, held still: the screen, each app, and what it has exported.
- `stage.html` one scene on its own. `?s=0..3` picks it, `?yaw=-25&pitch=8` turns the view, `?atlas=1` shows the pictures.
- `stills.mjs` and `tools/sheet.mjs` the scenes in the hero's own layout, on one sheet for comments. On the stills page `?at=1.5`
  sets where the booklet's pages are: 0 is The Offering, 1 is Amenities, 2 is the gallery, and a half is a leaf standing on the spine.

## Looking at it

    node design/journey-hero/tools/serve.mjs
    http://localhost:4173/design/journey-hero/take-2/stage.html?s=2

    node design/journey-hero/take-2/tools/sheet.mjs sheet.png 0,1,2,3

## What comes next

The motion and UX/UI apps. Then the motion itself: how the screen changes between apps, the Export click, the work landing,
the booklet's pages turning. Then a brief for the production build.
