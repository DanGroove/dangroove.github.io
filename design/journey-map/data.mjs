// Every fact, date, colour, label, line of copy and timing for the journey map.

// Colours
export const C = {
  ink: '#151314', paper: '#F7F6F3', red: '#F0484F', line: '#2E2B29', mid: '#4A4541',
  dim: '#9A948D', note: '#C9C4BD', land: '#1F1C1D', landEdge: '#2B2728', halo: '#1A1819',
  warm: '#FF8A4C', white: '#FFFFFF', shade: '#0D0C0D', screenBg: '#1B1819',
  posterShade: '#D9D5CD', posterRed: '#C0262E', posterCorner: '#BFBAB1', black: '#000000',
};

// Card palettes, one row per stop. Every palette value lives here.
// headline: the headline colour. mark: the place's colour wherever it sits on the Ink ground
// (lit stop mark, timeline block, mini-map). hairline: rules and empty frames on the card.
export const PALETTES = {
  hmc: { logo: 'assets/logos/hmc.png', layout: 'ground', ground: '#1E345D', text: '#FFFFFF', sub: '#B8C4DA', button: '#0D7247', buttonText: '#FFFFFF', pill: '#0D7247', pillText: '#FFFFFF', band: '#FFFFFF', headline: '#FFFFFF', mark: '#0D7247', hairline: '#B8C4DA' },
  laurier: { logo: 'assets/logos/laurier.png', layout: 'band', ground: '#330172', text: '#FFFFFF', sub: '#CFC3E0', button: '#EAA41E', buttonText: '#330172', pill: '#EAA41E', pillText: '#330172', band: '#FFFFFF', headline: '#FFFFFF', mark: '#EAA41E', hairline: '#CFC3E0' },
  mohawk: { logo: 'assets/logos/mohawk.png', layout: 'ground', ground: '#030303', text: '#F4F4F4', sub: '#A3A3A3', button: '#FB9632', buttonText: '#030303', pill: '#991030', pillText: '#FFFFFF', band: '#FFFFFF', headline: '#F4F4F4', mark: '#FB9632', hairline: '#A3A3A3' },
  interkom: { logo: 'assets/logos/interkom.png', layout: 'ground', ground: '#F7F3E2', text: '#242021', sub: '#5E5A56', button: '#242021', buttonText: '#F7F3E2', arrow: '#E85155', pill: '#242021', pillText: '#F7F3E2', band: '#FFFFFF', headline: '#242021', mark: '#E85155', hairline: '#5E5A56' },
  // Lennard: white logo band over orange; Warm Gray 11 is its only dark, on the pill, button and chips.
  lennard: { logo: 'assets/logos/lennard.png', layout: 'band', ground: '#FF4C00', text: '#FFFFFF', sub: '#FFFFFF', button: '#FFFFFF', buttonText: '#706259', pill: '#706259', pillText: '#FFFFFF', band: '#FFFFFF', headline: '#FFFFFF', mark: '#FF4C00', hairline: '#FFFFFF', panel: '#FFFFFF', panelText: '#706259', panelHair: '#706259', panelButton: '#706259', panelButtonText: '#FFFFFF', smallWeight: 500, chip: '#FFFFFF', chipText: '#706259' },
};

export const CRAFTS = ['Print', 'Video', 'Motion', 'Screen'];

export const PIECE_IMAGE = 'assets/hmc-report.jpg';

// Stops: real facts. spans are [start, end] as 'YYYY-MM' (end month inclusive) or 'now'.
// crafts: draft for Dan to correct.
export const STOPS = [
  { id: 'laurier', palette: 'laurier', name: 'Wilfrid Laurier University', short: 'Laurier', dates: '2016 to 2017', spans: [['2016-09', '2017-12']], track: 'school', role: 'Game Design and Development', crafts: ['Screen'], w: 0, rune: 'l',
    label: { t: 'Laurier', sub: '2016 to 2017, game design', x: 158, y: 236, a: 'middle' },
    copy: { draft: true, headline: 'Where it started.', para: 'I went to Laurier for game design. Systems, rules and play came first, before I ever chose graphic design.', took: 'Think about how someone moves through it.', piece: null, caption: '' } },
  { id: 'hmc1', palette: 'hmc', name: 'HMC Connections', short: 'HMC Connections', dates: 'Summers 2018 and 2020', spans: [['2018-04', '2018-08'], ['2020-06', '2020-08']], track: 'work', role: 'Graphic designer, video editor, web designer', crafts: ['Print', 'Video', 'Screen'], w: 7, rune: 'h',
    label: { t: 'HMC Connections', sub: 'summers 2018 and 2020', x: 466, y: 250, a: 'start' },
    copy: { draft: true, headline: 'First job, three hats.', para: 'Two summers as the student who did design, video and web at once. I designed the SafetyDrivesUs logo and built its website, plus flyers and infographics.', took: 'One person can carry a job across print, video and web.', piece: null, caption: '' } },
  { id: 'mohawk', palette: 'mohawk', name: 'Mohawk College', short: 'Mohawk', dates: '2019 to 2021', spans: [['2019-01', '2021-04']], track: 'school', role: 'Advanced Diploma, Graphic Design', crafts: ['Print', 'Screen'], w: 17, rune: 'm',
    label: { t: 'Mohawk', sub: '2019 to 2021', x: 124, y: 387, a: 'middle' },
    copy: { draft: true, headline: 'Where the craft got formal.', para: 'Type, layout and critique, every week, until the reasons behind a good page became habit.', took: 'Type first.', piece: null, caption: '' } },
  { id: 'hmc2', palette: 'hmc', name: 'HMC Connections', short: 'HMC, again', dates: '2021 to 2022', spans: [['2021-06', '2022-03']], track: 'work', role: 'Graphic designer, on contract', crafts: ['Print', 'Screen'], w: 26, rune: 'h',
    label: { t: 'HMC, again', sub: 'on contract, 2021 to 2022', x: 458, y: 322, a: 'end' },
    copy: { draft: true, headline: 'Back as the designer.', para: 'I came back on contract, redesigned hmcconnections.com, designed the 2020/2021 annual report and built the HMC anti-racism movement website.', took: 'Long documents are where a system proves itself.', piece: PIECE_IMAGE, caption: 'Annual report, 2020 to 2021' } },
  { id: 'interkom', palette: 'interkom', name: 'Interkom', short: 'Interkom', dates: 'Autumn 2022', spans: [['2022-09', '2022-12']], track: 'work', role: 'Junior graphic designer, on contract', crafts: ['Print', 'Screen'], w: 29, rune: 'i',
    label: { t: 'Interkom', sub: 'autumn 2022', x: 498, y: 468, a: 'end' },
    copy: { draft: true, headline: 'Agency pace.', para: "Four months, several clients at once: social graphics for Flato Markham Theatre, Art Windsor-Essex and JNAAG, and a redesign of Melanoma Canada's sixth edition booklet.", took: 'Switch brands without dropping the thread.', piece: null, caption: '' } },
  { id: 'lennard', palette: 'lennard', name: 'Lennard Commercial Realty', short: 'Lennard', dates: '2023 to now', spans: [['2023-10', '2024-03'], ['2024-04', '2025-07'], ['2025-07', 'now']], track: 'work', role: 'Freelance, junior, now graphic designer', crafts: ['Print', 'Video', 'Motion', 'Screen'], w: 35, rune: 'l',
    label: { t: 'Lennard', sub: '2023 to now', x: 322, y: 706, a: 'end' },
    copy: { draft: true, headline: 'All four crafts, one job.', para: 'I started freelance, came on as a junior and became the graphic designer. I design the marketing for commercial listings, edit and animate LennieTV and the monthly Deal Board, and lay out The Q.', took: 'Carry the idea from first sketch to final cut.', piece: null, caption: '', steps: ['Freelance 2023', 'Junior 2024', 'Graphic designer 2025'] } },
];

// Map geometry (600 by 900 units), ported from reference/round2.cjs
export const MAP = {
  w: 600, h: 900,
  coastA: [[108, 196], [128, 150], [200, 132], [290, 146], [380, 128], [452, 150], [492, 196], [486, 236], [460, 266], [440, 294], [470, 322], [506, 342], [524, 392], [516, 452], [548, 504], [540, 540], [498, 566], [430, 590], [345, 578], [262, 606], [178, 592], [116, 540], [84, 462], [100, 392], [72, 322], [84, 250]],
  coastB: [[196, 690], [262, 660], [340, 668], [420, 656], [476, 684], [494, 736], [462, 784], [392, 806], [300, 800], [222, 796], [182, 750]],
  waypoints: [[158, 214], [186, 222], [214, 212], [252, 228], [300, 238], [352, 228], [402, 240], [452, 262], [420, 278], [372, 272], [330, 286], [284, 272], [244, 292], [226, 326], [198, 346], [216, 362], [182, 370], [150, 372], [160, 400], [150, 428], [190, 452], [250, 470], [318, 468], [378, 452], [428, 404], [452, 362], [470, 332], [496, 372], [508, 430], [508, 490], [506, 540], [474, 598], [440, 630], [404, 662], [376, 694], [330, 720], [290, 746], [256, 768]],
  xIdx: 37, trailSeg: 8, dotGap: 5.6,
  x: [256, 768],
  well: [302, 392],
  ygg: [304, 374],
  jorm: {"ring":[[500,101],[524,106],[546,122],[558,150],[563,190],[562,240],[560,290],[563,340],[563,390],[562,440],[563,490],[563,535],[552,572],[524,604],[484,622],[440,626],[396,622],[350,614],[300,618],[252,624],[204,618],[160,600],[124,572],[98,532],[80,490],[62,446],[56,400],[56,350],[56,300],[62,252],[76,206],[98,166],[128,132],[168,116],[214,112],[262,116],[312,120],[362,113],[410,108],[444,105],[468,102.5]],"surf":[[0,0.085],[0.235,0.29],[0.43,0.5],[0.655,0.715],[0.885,1]],"w":6.4,"seg":10,"tail":9,"taper":[0.9,0.1,0.7],"subAlpha":0.55,"edgeAlpha":0.22,"edgeWidth":0.8,"dash":"3 2.2","surfaceTaper":0.012,"edgeNarrow":[0.45,0.55],"scaleStep":2,"chevron":[1.8,0.6],"water":"q2.4 -2 4.8 0t4.8 0t4.8 0","waterAt":[-7,1],"waterAlpha":0.8,"swellPath":"M-7 -3.2Q0 -6.2 7 -3.2L7 3.2Q0 6.2 -7 3.2Z","hornPath":"M-7 -3.2Q0 -4.7 7 -3.2L7 3.2Q0 4.7 -7 3.2Z","swellLength":14,"swellExtra":3,"hornExtra":1.5,"swellSub":0.45,"swellRamp":3},
  toronto: {"at":[368,752],"k":0.105,"facts":{"cn":553.3,"cnMain":346,"cnSky":447,"cnMastFoot":457,"rogers":86,"fcp":298,"scotia":275,"cibc":241,"ccw":239,"td":223,"bac":218,"brookfield":207,"rbp":180},"box":[362,688,494,758],"width":114.4,"back":[[18.5,4,15],[30.5,4,18],[33.6,3.4,13.5],[40.5,4.2,23],[52,3.6,26.5],[60.5,4,21],[77,3.6,24],[86,4.2,20],[101,4,17.5],[111,3.6,14]],"buildings":[["rogers",0,20],["cn",26,8.4],["rbp",36,6.4],["brookfield",43.6,6],["td",50.8,7],["fcp",59,6.4],["ccw",66.6,6],["scotia",73.8,7.2],["bac",82.2,6],["cibc",89.4,6.4]],"east":[[97,4.2,12],[102.4,4.6,16],[108.2,5,10]],"drawing":"<path class=\"t\" d=\"M18.5 0V-15H22.5V0M30.5 0V-18H34.5V0M33.6 0V-13.5H37V0M40.5 0V-23H44.7V0M52 0V-26.5H55.6V0M60.5 0V-21H64.5V0M77 0V-24H80.6V0M86 0V-20H90.2V0M101 0V-17.5H105V0M111 0V-14H114.6V0\"/><path class=\"g\" d=\"M0 0V-4.6Q10 -13.4 20 -4.6V0Z\"/><path class=\"t\" d=\"M0 -4.6H20M3.4 -7Q10 -10.6 16.6 -7\"/><path class=\"g\" d=\"M21.8 0C23.4 -6 24.5 -16 24.8 -34.3H27.2C27.5 -16 28.6 -6 30.2 0Z\"/><path class=\"t\" d=\"M26 -1V-33.9\"/><path class=\"g\" d=\"M22.2 -35.099999999999994Q21.4 -36.9 23 -37.9H29Q30.6 -36.9 29.8 -35.099999999999994Z\"/><path class=\"t\" d=\"M21.9 -36.3H30.1\"/><path class=\"g\" d=\"M25.1 -37.9V-46.1H26.9V-37.9\"/><path class=\"g\" d=\"M24.3 -46.1H27.7V-47.9H24.3Z\"/><path class=\"l\" d=\"M26 -47.9V-48\"/><path class=\"l\" d=\"M26 -48V-58.1\" stroke-opacity=\".8\"/><path class=\"g\" d=\"M36 0V-18.3L37.6 -18.9L39.2 -18.3L40.8 -18.9L42.4 -18.3V0\"/><path class=\"t\" d=\"M37.6 -1V-18.9M40.8 -1V-18.9\"/><path class=\"g\" d=\"M43.6 0V-19.7H44.6V-21.7H48.6V-19.7H49.6V0\"/><path class=\"t\" d=\"M44.6 -2.4H48.6M44.6 -4.8H48.6M44.6 -7.2H48.6M44.6 -9.6H48.6M44.6 -12.0H48.6M44.6 -14.4H48.6M44.6 -16.8H48.6\"/><path class=\"o\" d=\"M50.800000000000004 0V-23.4H57.800000000000004V0\"/><path class=\"t\" d=\"M52.2 -1V-22.4M53.6 -1V-22.4M55.0 -1V-22.4M56.4 -1V-22.4\"/><path class=\"t\" d=\"M51.300000000000004 -1.8H57.3M51.300000000000004 -3.6H57.3M51.300000000000004 -5.4H57.3M51.300000000000004 -7.2H57.3M51.300000000000004 -9.0H57.3M51.300000000000004 -10.8H57.3M51.300000000000004 -12.6H57.3M51.300000000000004 -14.4H57.3M51.300000000000004 -16.2H57.3M51.300000000000004 -18.0H57.3M51.300000000000004 -19.8H57.3M51.300000000000004 -21.6H57.3\"/><path class=\"g\" d=\"M59 0V-30.5L59.8 -31.3H64.6L65.4 -30.5V0\"/><path class=\"t\" d=\"M59.8 -1V-31.3M64.6 -1V-31.3\"/><path class=\"g\" d=\"M66.6 0V-25.1H72.6V0\"/><path class=\"t\" d=\"M66.6 -23.5H72.6M66.6 -22.900000000000002H72.6\"/><path class=\"t\" d=\"M68.1 -1V-21.7M69.6 -1V-21.7M71.1 -1V-21.7\"/><path class=\"g\" d=\"M73.8 0V-25.9L75.2 -27.5V-28.9L77.39999999999999 -26.5L79.6 -28.9V-27.5L81 -25.9V0\"/><path class=\"t\" d=\"M76.2 -1V-24.9M78.6 -1V-24.9\"/><path class=\"g\" d=\"M82.2 0V-21.5H83V-22.9H87.4V-21.5H88.2V0\"/><path class=\"t\" d=\"M83.2 -2.2H87.2M83.2 -4.4H87.2M83.2 -6.6H87.2M83.2 -8.8H87.2M83.2 -11.0H87.2M83.2 -13.2H87.2M83.2 -15.4H87.2M83.2 -17.6H87.2M83.2 -19.8H87.2\"/><path class=\"g\" d=\"M89.4 0V-25.3H95.80000000000001V0\"/><path class=\"t\" d=\"M89.4 -2L95.80000000000001 -8M89.4 -9L95.80000000000001 -15M89.4 -16L95.80000000000001 -22\"/><path class=\"g\" d=\"M97 0V-12H101.2V0\"/><path class=\"t\" d=\"M97.6 -1.6H100.6M97.6 -3.2H100.6M97.6 -4.8H100.6M97.6 -6.4H100.6M97.6 -8.0H100.6M97.6 -9.6H100.6\"/><path class=\"g\" d=\"M102.4 0V-16H107V0\"/><path class=\"t\" d=\"M103 -1.6H106.4M103 -3.2H106.4M103 -4.8H106.4M103 -6.4H106.4M103 -8.0H106.4M103 -9.6H106.4M103 -11.2H106.4M103 -12.8H106.4M103 -14.4H106.4\"/><path class=\"g\" d=\"M108.2 0V-10H113.2V0\"/><path class=\"t\" d=\"M108.8 -1.6H112.6M108.8 -3.2H112.6M108.8 -4.8H112.6M108.8 -6.4H112.6M108.8 -8.0H112.6\"/><path class=\"l\" d=\"M-4 0H118.4\"/><path class=\"t\" d=\"M2 2.6q2.4 -1.8 4.8 0t4.8 0M94.4 2.6q2.4 -1.8 4.8 0t4.8 0t4.8 0\"/>"},
};

// Copy outside the cards
export const COPY = {
  docTitle: 'The saga so far: journey map prototype',
  heroCaption: 'The hero goes here',
  title: 'The saga so far',
  kicker: 'A MAP OF HOW I GOT HERE, 2016 TO NOW',
  cue: 'Scroll to set out',
  took: 'WHAT I TOOK WITH ME',
  caseStudy: 'See the case study',
  pieceToCome: 'Piece to come',
  count: '{n} of {t} found',
  todo: 'Yours to write', countAll: 'All {t} found',
  regions: [
    { t: 'LAURIERVIK', x: 150, y: 170, rune: 'lauriervik' },
    { t: 'THE IRONWOOD', x: 318, y: 198, rune: 'the ironwood' },
    { t: 'MOHAWKFJELL', x: 140, y: 258, rune: 'mohawkfjell' },
    { t: 'THE MARGINS', x: 172, y: 540 },
    { t: 'KERNING NARROWS', x: 300, y: 636, i: 1 },
    { t: 'LENNARDGARD', x: 412, y: 768, rune: 'lennardgard' },
    { t: 'HERE BE DEADLINES', x: 486, y: 132 },
  ],
  notes: [
    { t: 'the diploma climb', x: 238, y: 356, s: 6.5 },
    { t: 'the mist of 2020', x: 104, y: 464, s: 6.5 },
    { t: 'left intentionally blank', x: 172, y: 549, s: 5.6, a: 'middle', dim: 1 },
    { t: 'the 2023 crossing', x: 470, y: 613, s: 6.3 },
    { t: 'the road not taken: game dev', x: 268, y: 172, s: 6 },
  ],
  sea: 'SEA OF REVISIONS',
  xLabel: 'X marks the work', xSub: 'case studies and everything else',
  ygg: 'YGGDRASIL', well: "URD'S WELL", wellSub: 'was, is, shall be',
  legend: { stop: 'a stop', work: 'the work', find: 'something to play with', trail: 'the trail' },
  srMap: 'A map of how I got here, 2016 to now',
  stoneGo: 'Go to {name}, {dates}',
  miniMap: 'Mini-map. Choose a stop to jump there.',
  timeline: 'Timeline',
  timelineValue: '{name}, {dates}',
  timelineStart: 'Before the first stop',
  close: 'Close',
  flip: 'Flip it over',
  nova: 'The supernova. Press it.',
  steps: {
    group: 'Move through the journey', start: 'Start the journey', setOut: 'Set out', next: 'Next: {name}',
    toX: 'Next: the X', dig: 'Dig here', top: 'Back to the top', back: 'Back: {name}', returnTo: 'Back to the trail',
    names: { top: 'the top', map: 'the whole map', x: 'the X', end: 'the end' },
    say: { top: 'The top of the page', map: 'The whole map', stop: 'Stop {n} of {t}: {name}, {dates}', x: 'The X', end: 'The end of the trail: contact and links' },
    review: { label: 'Preview only', depth: 'Depth' },
  },
  explore: { button: 'Explore the map', back: 'Back to the end', hint: 'Scroll to zoom. Drag to look around.',
    hintPhone: 'Pinch to zoom. Drag to look around.', say: 'Exploring the map. Back returns to the end.' },
  cardClose: 'Close the {name} card',
  footer: {
    label: 'Footer',
    cta: 'Got an idea that needs carrying to the final cut?',
    talk: "Let's talk",
    name: 'Danial Endrawes',
    tagline: 'From first sketch to final cut, and everything in between.',
    links: ['Case studies', 'Work'],
    small: 'LINKEDIN / EMAIL / RESUME',
  },
};

// Finds. n is the number on the Red marker (main finds only). x, y are map units.
export const FINDS = [
  { id: 'wayfinder', n: 1, x: 102, y: 716, view: [250, 660, 150], viewPhone: [118, 716, 75, 0], mark: [148, 672], label: 'The wayfinder. Pick a craft to light up the stops that used it. Arrow keys turn it, Enter on the centre clears it.' },
  { id: 'hoards', n: 2, x: 366, y: 354, mark: [382, 346], label: 'Hoards. Five buried chests, each near a stop.' },
  { id: 'ravens', n: 3, x: 442, y: 200, view: [444, 180, 42], mark: [464, 192], label: 'Huginn and Muninn, two ravens in a bare tree. Press to send the next raven for a thought or memory.' },
  { id: 'serpent', n: 4, x: 500, y: 101, view: [478, 96, 50], mark: [550, 74], label: 'J?rmungandr, the world serpent. Poke it three times to feed it a deadline.' },
  { id: 'beacon', n: 5, x: 536, y: 514, view: [468, 498, 92], mark: [558, 478], label: 'The beacon. Drag or arrows aim; Enter finds the next unread note.' },
  { id: 'runestone', n: 6, x: 250, y: 516, view: [250, 500, 40], mark: [270, 492], label: 'The rune stone. Press, rub, read, then flip the sheet.' },
  { id: 'hammer', n: 0, x: 112, y: 222, view: [112, 218, 34], label: 'Mjölnir on a stone near Laurier. Press it to hold the bridge.' },
  { id: 'mist', n: 0, x: 156, y: 438, view: [154, 436, 62], label: 'The mist of 2020. Press or wipe to clear it.' },
  { id: 'horn', n: 0, x: 46, y: 476, view: [46, 470, 30], label: 'A horn on the shore. Press to raise it, press again to sound it.' },
  { id: 'well', n: 0, x: 302, y: 392, view: [306, 350, 72], label: "Urd's Well. Drop a pebble in. The Norns answer." },
  { id: 'longship', n: 0, x: 452, y: 622, label: 'The longship. Pull three times to fly its pennant.' },
];

// All hammer tuning, geometry and paths. Foe rows: columns, rows, weights, speed, shot interval, cap, gaps, elites.
export const HAMMER = {
  field: { w: 300, h: 400, margin: 16, top: 34, bridge: 378, line: 1.2, dpr: 2 },
  step: 1 / 120, steps: 8, limit: 1200, hearts: 3, most: 5, hurt: 1.75, waveBonus: 50, perfect: 35,
  pools: { foes: 60, shots: 80, hail: 12, sparks: 64, cells: 126 },
  seed: { first: 719, span: 2147483647, add: 0x6D2B79F5, div: 4294967296 },
  throw: { speed: 650, back: 720, turn: 14, radius: 5, catch: 9, spin: 13, pierce: 1, ride: 0.2, bend: 1.8 },
  glove: { x: 150, y: 378, min: 16, max: 284, speed: 148, follow: 190, radius: 9, horse: 0.2, flicker: 18 },
  march: { column: 26, row: 22, down: 10, boost: 1.3, chiefStop: 1.3 },
  waves: [
    { columns: [5, 7], rows: [2, 2], weights: [7, 2, 1, 0, 0], speed: 12, rate: 1.7, cap: 5, gaps: 0.08, elites: [0, 0] },
    { columns: [6, 8], rows: [2, 3], weights: [5, 3, 2, 0, 0], speed: 14, rate: 1.45, cap: 7, gaps: 0.1, elites: [0, 0] },
    { columns: [6, 8], rows: [3, 3], weights: [4, 3, 2, 3, 0], speed: 17, rate: 1.3, cap: 9, gaps: 0.12, elites: [0, 0] },
    { columns: [7, 9], rows: [3, 3], weights: [3, 3, 3, 3, 0], speed: 17, rate: 1.25, cap: 11, gaps: 0.12, elites: [1, 2] },
    { columns: [7, 9], rows: [3, 4], weights: [2, 4, 3, 4, 0], speed: 20, rate: 1.05, cap: 13, gaps: 0.14, elites: [1, 3] },
    { columns: [8, 10], rows: [3, 4], weights: [2, 4, 4, 4, 0], speed: 23, rate: 0.9, cap: 15, gaps: 0.14, elites: [2, 3] },
  ],
  kinds: ['draugr', 'rime', 'fire', 'wolf', 'chief'],
  foes: {
    draugr: { hearts: 1, silver: 10, speed: 88 }, rime: { hearts: 2, silver: 20, speed: 135 },
    fire: { hearts: 1, silver: 15, speed: 102 }, wolf: { hearts: 1, silver: 25, speed: 104 }, chief: { hearts: 4, silver: 60, speed: 124 },
  },
  foe: { rx: 10, ry: 8, bossRX: 56, bossRY: 23, clayRX: 21, clayRY: 27 },
  shot: { radius: 3, splitY: 202, splitAgain: 282, angle: 0.36, fan: 0.28, dead: 412 },
  wolf: { every: [10, 16], time: 3.4, curve: 24, pack: 3 },
  shield: { walls: 3, columns: 7, rows: 3, x: 47, gap: 100, y: 340, cell: 5, radius: 3.5, stagger: 2.5, double: 2 },
  valkyrie: { every: [14, 21], speed: 51, y: 18, silver: 75, rx: 14, ry: 7 },
  fates: { chance: 0.66, count: 5, cold: 0.72 },
  runes: [
    { key: 'th', max: 3 }, { key: 'r', max: 3 }, { key: 'k', max: 3 }, { key: 'g', max: 2 },
    { key: 'h', max: 3 }, { key: 'n', max: 2 }, { key: 'i', max: 3 }, { key: 'j', max: 3 },
    { key: 'ei', max: 3 }, { key: 'l', max: 3 }, { key: 'd', max: 3 }, { key: 'e', max: 3 },
  ],
  rune: { burn: 0.8, spread: 32, ice: 0.12, hail: 2, hailSpeed: 150, hailRise: 22, hailLife: 1.6 },
  boss: { hearts: 64, fan: 1.6, fans: 5, speed: 17, x: [72, 228], y: 59, shardSpeed: 124, aimSpread: 0.23, clay: 13, clayAt: 0.6, heartAt: 0.3, clayY: 203, claySpeed: 30, clayX: [72, 228], faster: 0.66, exposed: 2, heartRX: 13, heartRY: 15, heartY: 17, silver: 500, fall: 1.3, gravity: 90 },
  fx: { sparks: 4, life: 0.25, speed: 40, shake: 1.8, flash: 0.09, flashAlpha: 0.65, trail: 12 },
  map: { near: 20, scale: 0.7, hit: [-6, -6, 34, 34], centre: [10.5, 10.5], stone: 'M-3 23L0 20L24 20L27 23L25 25L-2 25Z', hammer: 'M8 14V3Q7 1 10 1Q13 1 12 3V14M8 4H12M8 7H12M8 10H12M2 12L5 14H15L18 12L20 13V21L18 22L15 20H5L2 22L0 21V13ZM4 15L8 18L12 15L16 18M4 18L8 15L12 18L16 15M2 13V21M18 13V21', spark: 'M-2 12L-5 10L-4 7M21 16L25 14L24 11M9 23L11 26', every: 4.3, sparkTime: 0.18, tremble: 0.55, trembleRate: 33, hop: 2, hopTime: 0.3 },
  ui: { w: 330, h: 550, fieldW: 300, fieldH: 400, pad: 14, border: 1, radius: 10, gap: 8, header: 24, status: 36, buttons: 36, font: 12, line: 17, small: 11, title: 22, titleWeight: '600', autoFlex: '2', waveShare: '50%', cardPad: 14, inset: 12, rune: 32, runeW: 18, mini: 17, miniW: 11, spritePad: 4, glyphLine: 1.4, heartW: 10, heartH: 9, heartGap: 2, notice: 1, bestKey: 'jm-hammer-best' },
  paths: {
    bridge: ['M0 386Q150 364 300 386', 'M0 391Q150 369 300 391', 'M0 396Q150 374 300 396'],
    heart: 'M0 3C-6 -3 -6 -7 -2 -7Q0 -7 0 -5Q0 -7 2 -7C6 -7 6 -3 0 3Z', heartBox: '-6 -8 12 12',
    crack: 'M-3 -6L1 -2L-2 1L3 6', stoneHeart: 'M0 -9L-9 7L10 6ZM0 -5L-3 2L5 3',
    shot: ['M-1 -3L1 3M-2 -2L1 -3M-1 3L2 2', 'M-2 -4L2 -4L0 5Z', 'M0 4Q-4 0 0 -4Q4 0 0 4Z'],
    shield: 'M-3 0A3 3 0 1 0 3 0A3 3 0 1 0 -3 0M-2 -2L2 2M-2 2L2 -2',
    spark: 'M-2 0H2M0 -2V2',
    sprites: {
      glove: [24, 20, 'M-10 7L-8 1L-7 -5L-3 -7L0 -5L3 -7L6 -5L8 -1L7 2L10 7ZM-8 2H8M-4 -5V0M0 -5V0M4 -5V0M-7 5H-5M0 5H2M6 5H7'],
      hammer: [20, 20, 'M-1 1V8Q-3 11 0 11Q3 11 1 8V1M-8 -7L-5 -5H5L8 -7L9 -6V1L8 2L5 0H-5L-8 2L-9 1V-6ZM-5 -4L0 -1L5 -4M-5 -1L0 -4L5 -1'],
      draugr: [24, 20, 'M-8 6L-6 -1L-4 -2L-4 -6L0 -7L4 -5L4 -2L7 0L9 6M-5 2H5M-3 -4H-1M2 -4H3M-2 -1H2M-3 3L-4 7M3 3L4 7M-8 0L-10 -3'],
      rime: [24, 20, 'M-9 7L-7 -2L-3 -4L-4 -7L1 -8L5 -5L4 -2L8 0L10 7ZM-3 -3L0 -1L3 -3M-5 2L-1 3M2 3L6 2M-5 5V7M5 5V7'],
      fire: [24, 20, 'M-8 7L-7 0L-3 -2Q-7 -7 -2 -8L0 -4L3 -8Q8 -4 4 -1L8 1L9 7ZM-3 1L0 3L3 1M-4 5L-5 8M4 5L5 8'],
      wolf: [26, 20, 'M-10 1L-7 -5L-4 -2L1 -3L4 -7L6 -3L10 -1L8 2L5 2L3 5H-4L-7 7M-3 4L-2 8M3 4L5 8M7 -1H8M-9 0L-12 -3'],
      chief: [26, 22, 'M-11 8L-9 -1L-5 -3L-5 -8L0 -10L5 -8L5 -3L9 -1L11 8ZM-4 -3L0 -1L4 -3M-4 1H4M-5 4V8M5 4V8M0 -8V-4M-2 -7L2 -5'],
      valkyrie: [36, 22, 'M-15 5L-9 1L-4 2L0 -1L5 0L8 -3L13 -2L16 1L12 4H6L4 8M-8 4L-9 8M-3 4L-1 8M1 -1V-8L4 -10L6 -7L4 -4L7 -1M2 -7L-6 -9L-2 -5L-8 -6L-2 -2M7 -7L13 -10'],
      hrungnir: [128, 62, 'M-60 27L-54 7L-28 -3L-23 -22L-7 -28L17 -26L27 -17L24 -3L53 8L60 27ZM-23 -13L-9 -8L-1 -10M8 -10L21 -14M-8 -3L9 -2M-17 9L-8 13L-13 21M23 4L15 9L20 17M-35 7L-31 20M40 11L35 24'],
      clay: [52, 64, 'M-22 28L-18 1L-10 -6L-11 -20L-2 -27L9 -22L11 -8L19 0L23 28ZM-7 -15L-3 -14M4 -14L7 -15M-5 -8L4 -7M-12 6L-6 9L-9 17M13 4L7 12M-6 23L-8 30M7 22L10 30'],
    },
    fragments: [[-32, -8, 'M-25 -9L-7 -14L5 0L-12 13Z'], [0, -14, 'M-18 -13L12 -12L23 2L0 17L-13 4Z'], [32, 1, 'M-8 -11L17 3L10 20L-17 6Z']],
  },
  tests: { quick: 60, full: 200, seeds: 1001, botStep: 1 / 120, think: 12, dodge: 0.5, dodgeX: 27, threat: 18, reach: 0.6, win: [0.15, 0.45], idle: 0.8, poolSteps: 10000, determinism: 3000, averageMS: 0.3 },
};

export const FIND_COPY = {
  crafts: ['PRINT', 'VIDEO', 'MOTION', 'SCREEN'],
  wayfinderRunes: 'print video motion screen',
  wayTally: '{craft}: {n} of {t} stops', wayAll: 'All four: {names}', hoardTally: 'Hoard {n} of {t}',
  hoardHints: ['Dig three times, then open it.', 'Dig twice more.', 'Dig once more.', 'Open it.', 'Press it to see the piece again.'],
  huginn: 'Huginn, thought', muninn: 'Muninn, memory', ravenFrom: 'Brought back from {name}',
  reelToCome: { t: 'Reel to come', todo: 1 }, reelLabel: 'Memory reel, piece to come', rubDo: 'Rub it for me',
  serpentLeaves: [['FRI', '5 PM'], ['TODAY', 'EOD'], ['NOW', 'ASAP']], serpentFed: 'Deadline met',
  hoards: [
    { id: 'hoard-laurier', kind: 'bundle', stop: 'laurier', x: 208, y: 266, title: 'Piece to come', image: null, label: 'A scratch in the ground near Laurier. Dig three times, then open it.' },
    { id: 'hoard-hmc1', kind: 'screen', stop: 'hmc1', x: 404, y: 304, title: 'SafetyDrivesUs logo and website', image: null, label: 'A scratch in the ground near HMC Connections. Dig three times, then open it.' },
    { id: 'hoard-hmc2', kind: 'book', stop: 'hmc2', x: 372, y: 368, title: '2020/2021 annual report', image: PIECE_IMAGE, label: 'A scratch in the ground near HMC, again. Dig three times, then open it.' },
    { id: 'hoard-interkom', kind: 'book', stop: 'interkom', x: 452, y: 558, title: 'Melanoma Canada booklet', image: null, label: 'A scratch in the ground near Interkom. Dig three times, then open it.' },
    { id: 'hoard-lennard', kind: 'sheet', stop: 'lennard', x: 228, y: 728, title: '1 King Street W flyer', image: null, label: 'A scratch in the ground near Lennard. Dig three times, then open it.' },
  ],
  ravenTime: ['00:00', '00:05'],
  serpentLines: [{ t: 'A deadline story goes here.', todo: 1 }, { t: 'A deadline story goes here.', todo: 1 }, { t: 'A deadline story goes here.', todo: 1 }],
  serpentLeaf: ['FRI', '5 PM'],
  beaconNotes: [
    { x: 442, y: 418, rune: 'note one', t: { t: 'A note in invisible ink goes here.', todo: 1 } },
    { x: 413, y: 454, rune: 'note two', t: { t: 'A note in invisible ink goes here.', todo: 1 } },
    { x: 410, y: 495, rune: 'note three', t: { t: 'A note in invisible ink goes here.', todo: 1 } },
    { x: 432, y: 533, rune: 'note four', t: { t: 'A note in invisible ink goes here.', todo: 1 } },
  ],
  runestoneRunes: 'first sketch final cut',
  poster: { head: 'WANTED', who: 'ONE DESIGNER', line1: 'who sees a job through, from', line2: 'first sketch to final cut', reward: 'REWARD: THE WORK', stamp: 'PRINT', back: ['Stock: to come', 'The brief: to come'], foot: { t: 'Stock: to come. The brief: to come.', todo: 1 } },
  hammerFact: { t: 'A fact from the game design year goes here.', todo: 1 },
  hammer: {
    title: 'Hold the bridge', intro: 'Giants march on Bifröst. Throw Mjölnir at them; it always flies back to your hand.',
    controls: 'Move: arrows or A/D, or point. Throw: hold Space, Up or W, or press. T or Keep throwing toggles automatic throws. P pauses.',
    controlsTouch: 'Drag anywhere to move Járngreipr. Keep a finger down to throw. Keep throwing toggles automatic throws. Pause takes a breath.',
    field: 'Hold the bridge playfield. Left/Right or A/D move; Space, Up or W throw; T keeps throwing; P pauses; 1, 2, 3 choose a rune; Escape closes.',
    start: 'Start a run', waveLine: 'Wave {n} of 7', waveStart: 'Wave {n} begins.',
    runeTitle: 'Wave {n} held. Take a rune.', runeKeys: 'Choose with 1, 2 or 3, or press a rune.',
    runeTaken: '{name}, level {n}, taken.', runeLevel: '{key}. {name}, level {n}. {line}',
    pause: 'Paused', pauseButton: 'Pause', resume: 'Resume', newRun: 'New run', close: 'Close', auto: 'Keep throwing',
    lost: 'The bridge fell at wave {n}.', lostHearts: 'Your hearts gave out at wave {n}.', won: 'Hrungnir falls. The bridge holds.',
    heartLost: 'A heart lost. {n} heart{s} left.', gift: 'A Valkyrie leaves a heart and silver.',
    stats: '{silver} silver. {foes} foes felled.', best: 'Best run: {silver} silver.', silver: '{n} silver', hearts: '{n} of {max} hearts', runes: 'Runes taken',
    boss: 'Hrungnir', clay: 'Mökkurkálfi rises.', heart: "Hrungnir's stone heart is bare.",
    foes: { draugr: 'Draugr', rime: 'Rime giant', fire: 'Son of Múspell', wolf: 'Wolf', chief: 'Giant chief' },
    fates: [
      ['Fimbulwinter', 'Everything moves slower in the cold, the glove too.'],
      ["Múspell's heat", 'Embers split twice.'], ['Wolf-age', 'Wolves run in packs.'],
      ['Shield-maidens', 'The shield wall stands doubled.'], ["Hel's tide", 'A fallen draugr rises once.'],
    ],
    runes: [
      ['Thurisaz, thorn', 'Pass through {n} more foe{s} on the way up.'], ['Raidho, ride', 'Fly {n}% faster, out and back.'],
      ['Kenaz, torch', 'Burn for 1 damage after 0.8 s; spread to {n} neighbour{s}.'], ['Gebo, gift', 'Gain one heart now; hold {n} heart{s} at most.'],
      ['Hagalaz, hail', 'Throw {n} hail shard{s} sideways when the hammer turns.'], ['Naudiz, need', 'With one heart, hit {n} time{s} as hard.'],
      ['Isa, ice', 'Foes and their shots move {n}% slower.'], ['Jera, harvest', 'Heal {n} heart{s} when a wave is held.'],
      ['Eihwaz, yew', 'Deal {n} more damage on the way back.'], ['Laguz, water', 'Bend toward the nearest foe at strength {n}.'],
      ['Dagaz, day', 'Survive {n} ending blow{s} per run; clear the falling shots.'], ['Ehwaz, horse', 'Move the glove {n}% faster.'],
    ],
  },
  horn: ['Skál.', { t: 'A line from someone I worked with goes here.', todo: 1 }],
  norns: [['Urd', 'what was'], ['Verdandi', 'what is'], ['Skuld', 'what shall be']],
  nornKicker: '{name}, {time}', wellStop: '{name}, {dates}',
  wellNone: 'nothing yet', wellMap: 'the whole map', wellNext: 'not yet carved',
  // One short line of what to do, shown above the step buttons while a find has the camera. Draft copy.
  hints: { wayfinder: 'Pick a craft to light the stops that used it.', hoards: 'Dig three times, then open it.', ravens: 'Press to send a raven out.',
    serpent: 'J?rmungandr, the world serpent. Poke it.', beacon: 'Press the tower for the next note, or drag to aim the beam.', runestone: 'Rub the stone to lift its carving.',
    hammer: 'Press the hammer to play.', mist: 'Wipe the mist away.', horn: 'Press to raise it, press again to sound it.',
    well: 'Drop a pebble in. The Norns answer.', longship: 'Press to pull the oars.' },
  shipLog: 'The 2023 crossing', longship: { t: '2023: Dan to write this line.', todo: 1 },
};

// Timing. Act lengths are in viewport heights.
export const ACTS = {
  hero: 100, handoff: 120, overview: 70, pushIn: 60, hold: 130, legPerUnit: 0.45,
  footer: { rush: 80, blast: 90, settle: 70, rest: 80 },
  footerTotal: 320,
};

export const CAMERA = {
  pushScale: 3.2, pushScalePhone: 2.6, holdZoom: 1.35, holdDim: 0.35, craftDim: 0.55,
  anchorX: 0.45, anchorY: 0.55, smooth: 30, phoneMax: 640,
  xEase: [0.5, 1], xAnchorY: 0.42, xFloor: 0.85, xBoxPhone: [244, 690, 494, 792], xMargin: 16, frameBottom: 885.5, xGap: 12, timeline: 56,
  footerX: [0.68, 0.3], footerXPhone: [0.66, 0.22],
};

export const HOLD = { zoomIn: [0, 0.18], zoomOut: [0.86, 1], open: [0.1, 0.32], fold: [0.72, 0.92], visited: 0.3 };

// Clock-driven journey. Pace and animation durations are seconds.
export const STEPS = {
  pace: { hero: 0.9, handoff: 2.8, overview: 0.8, pushIn: 1.6, holdIn: 1.0, holdOpen: 0.4, holdOut: 0.6,
    legBase: 0.8, legPerVh: 0.006, legMax: 2.4, legX: 1.2, rush: 1.3, blast: 1.6, settle: 1.3 },
  ramp: 0.35, back: 0.6, hurry: 0.3, minMove: 0.3, cut: [0.18, 0.32],
  nav: { h: 44, gap: 14, bar: 52 },
  frameMax: 0.05, reveal: 0.3,
};

export const EXPLORE = { in: 1.6, out: 0.9, most: 3, margin: 24, marginPhone: 12, wheel: 0.0016, wheelMax: 120, pinchWheel: 0.01,
  keyPan: 90, keyShift: 3, calmAlpha: 0.35, calmScale: 0.6, autoReserve: 2,
  ease: 0.12, slop: 6, friction: 5, velocityWindow: 0.08, key: 1.25, hintTime: 8, linePx: 16,
  bar: { edgePhone: 16, padStart: 14, padEnd: 34, arrowPhone: 12 } };
export const CARD_CLOSE = { time: 0.45, hit: 44, inset: 0, icon: 12, stroke: 1.6, radius: 14, radiusPhone: 16 };
// Copied from the hero's NAME table, entrance name renderer and EASE curves.
export const FOOT_NAME = { radius: 0.95, near: 1.2, hop: 0.16, rise: 0.07, feel: 1.3, wave: 55, open: 9,
  spring: 240, damp: 12, kick: 26, red: C.red, dy: 1.4, far: -1e5, fallbackEm: 16,
  weight: [300, 800], wipe: [0.475, 0, 0.075, 1], enter: [0.23, 1, 0.32, 1], name: [[0.08, 0.4], [0.16, 0.48]],
  clipBottom: 3, clipSlack: 7, clipLeft: -50, clipRight: 150, clipFloor: 200,
  openEpsilon: 0.003, radiusEpsilon: 0.5, paintEpsilon: 0.001, restEpsilon: 0.0005, speedEpsilon: 0.005,
  solveIterations: 40, solveEpsilon: 1e-7, measureSize: 100 };

export const STARS = { count: 420, red: 0.05, dprCap: 2, drift: 0.012, parallax: 14,
  sky: 300, skyShare: 0.38, skyLook: 0.5, skyFollow: 0.04, twinkle: 0.35, skyPush: 26,
  skyReserve: 200, skyMargin: 10, skyEdge: 14, skyShock: 90, skyF: [0.5, 1.6], skyMove: [0, 0.3], skyCover: [0.25, 0.75],
  skySeed: 157, fieldZ: [0.25, 1], fieldR: [0.5, 1.6], fieldAlpha: [0.35, 0.95],
};

// All new depth geometry, drawing paths and tuning values. Random identities are unit samples;
// the renderers turn them into these live ranges on each frame.
export const DEPTH = {
  base: 0.045, gain: 0.55, look: 26, lookEase: 0.22, idleFps: 12, arc: 0.26, arcLen: 160,
  minK: 0.05, epsilon: 0.01, seed: 137, dpr: 2,
  fade: { sea: [0.2, 0.7], blast: [0, 0.45] },
  frame: { inner: [22, 22, 578, 878], outer: [14.5, 14.5, 585.5, 885.5] },
  rings: { on: 1, scale: [1.05, 1.10, 1.16], a: [-0.12, -0.24, -0.36], alpha: [0.55, 0.36, 0.2], colour: 'mid', width: 1, dash: [2, 5] },
  outer: { on: 1, cell: [66, 48], fill: 0.8, alpha: [0.5, 0.2], fade: 420, rays: 0.1,
    area: [-1000, -200, 1600, 1100], jitter: 0.8, width: 0.7, wave: [2.5, -3, 5], waveCount: 3, origin: [92, 716], n: 16, angle: 0.2, reach: 1600 },
  light: { on: 1, dark: 0.45, darkPhone: 0.25, r: 0.55, core: 0.35, ptrR: 0.3, ptrCore: 0.3, amb: 0.35, card: 0.6, visit: 0.35, rush: [0, 0.5] },
  field: { area: [-100, -50, 700, 950], wrapFade: 60, sprite: 128, spriteMid: 0.4, spriteAlpha: 0.5 },
  mist: { on: 1, n: 120, nPhone: 60, a: [0.5, 1.8], r: [14, 36], stretch: [2.2, 3.4], turn: 0.2, alpha: [0.06, 0.14], near: [0.12, 0.42], thin: 0.35, show: [1.1, 1.3], pass: [2.4, 3.4], wind: 2.2 },
  deck: { on: 1, n: 60, nPhone: 34, a: [6.5, 11], r: [50, 120], stretch: [1.6, 2.6], alpha: 0.07, boost: 6, show: [1.6, 1.9], peak: [1.8, 2.3], pass: [2.3, 3.0] },
  clouds: { on: 1, show: [0.3, 0.8], pass: [2.0, 2.9], sway: [14, 26], period: [50, 90], low: 2,
    list: [[-150, 150, 1.5, 3, 1, 7.0], [-250, 520, 1.1, 1, -1, 6.4], [-90, 800, 0.9, 2, 1, 7.6], [760, 110, 1.2, 1, 1, 6.8], [860, 430, 1.6, 3, -1, 7.4],
      [720, 760, 1.0, 2, -1, 6.2], [30, 330, 0.8, 2, 1, 8.2], [575, 690, 0.8, 2, -1, 8.0], [300, -30, 1.3, 3, 1, 7.2], [330, 935, 1.2, 1, -1, 6.6],
      [-62, 150, 0.42, 2, 1, 0.5], [-96, 300, 0.5, 1, -1, 0.7], [-58, 452, 0.38, 2, -1, 0.4], [-104, 610, 0.5, 3, 1, 0.6], [-64, 770, 0.4, 1, 1, 0.5],
      [662, 120, 0.44, 1, -1, 0.6], [700, 270, 0.4, 2, 1, 0.4], [668, 420, 0.5, 3, -1, 0.7], [706, 570, 0.4, 2, -1, 0.5], [666, 730, 0.46, 1, 1, 0.6]] },
  dust: { on: 1, n: 240, nPhone: 120, tile: [800, 600], a: [-0.85, -0.2], r: [0.5, 1.1], alpha: [0.25, 0.75], show: [0.12, 0.4] },
  ravens: { on: 1, a: 2.2, size: 0.65, legs: [2, 4], from: 0.12, to: 0.88, side: 90, gap: 26, flap: 0.9, fold: 0.62, ramp: 0.1 },
  card: { tilt: 14, ptrTilt: [2.2, 1.6], shift: 8, shadow: 0.5, drop: 18, ease: 0.12,
    perspective: 1100, open: [0.1, 0.9], flat: 0.01, shadowShare: 3, blur: 28, spread: 10, radius: 14 },
  // Section 6 gives the sky one pointer gain. Both review names tune that same gain.
  foot: { get stars() { return STARS.skyLook; }, set stars(value) { STARS.skyLook = value; }, lobes: 0.25, text: 0.15 },
  review: { rule: 1, gap: 6 },
  drawings: {
    clouds: [
      ['M-52 12Q-64 12 -62 2Q-62 -9 -48 -9Q-46 -23 -29 -22Q-21 -35 -4 -30Q8 -41 23 -30Q38 -33 43 -18Q58 -17 56 -3Q62 10 50 12Z', 'M-34 -5Q-26 -14 -15 -8M5 -15Q15 -23 26 -14M-8 3Q0 -3 9 2', 'M-78 20H-36M-24 26H34M48 20H80'],
      ['M-40 10Q-52 10 -50 0Q-50 -10 -37 -9Q-34 -24 -17 -21Q-8 -33 8 -25Q22 -30 29 -16Q44 -16 42 -2Q46 10 36 10Z', 'M-24 -6Q-16 -14 -6 -8M8 -12Q16 -18 24 -11', 'M-62 18H-22M-10 23H30M40 17H64'],
      ['M-70 12Q-82 12 -80 3Q-79 -7 -66 -6Q-64 -19 -48 -17Q-40 -31 -23 -25Q-12 -38 5 -30Q18 -42 34 -31Q48 -35 54 -21Q68 -22 69 -9Q82 -8 80 3Q82 12 72 12Z', 'M-52 -3Q-44 -12 -33 -6M-12 -14Q-3 -23 9 -15M30 -16Q39 -23 48 -15M-22 4Q-13 -3 -3 3M20 2Q28 -4 37 2', 'M-98 20H-52M-40 27H42M56 20H100'],
    ],
    raven: { wing: 'M1.6 -3.4Q9.9 -10 19 -7.4L25.5 -4.6L21.4 -3.8L24.5 -1.8L20.1 -1.7L22.1 .4L17.2 -.2Q9.9 2.2 1.6 2.6Z', tail: 'M-1.7 6L-3.3 11.6L-1.1 10.7L0 13.2L1.1 10.7L3.3 11.6L1.7 6Z', body: 'M0 -10Q2.7 -7 2.2 -1Q2.4 5 0 8Q-2.4 5 -2.2 -1Q-2.7 -7 0 -10Z', beak: 'M-.8 -9.4L0 -13.2L.8 -9.4Z' },
  },
};

export const NOVA = {
  pulse: [2.6, 0.12, 0.9, 0.06], spike: [1.7, 0.2, 3.14], glow: [4.2, 0.07],
  rays: { n: 22, len: [4, 12], alpha: [0.3, 0.7], turn: 0.12, start: 1.1, width: 1, breathe: 0.7, period: [1.2, 3.2], peak: 0.16 },
  lobes: { n: 6, nPhone: 4, r: [120, 260], orbit: [40, 170], speed: [0.12, 0.3], alpha: [0.22, 0.42], breathe: 0.2 },
  waves: { n: 4, every: 2.2, reach: 0.7, alpha: 0.42, width: 1 },
  shells: [6, -4], shellDash: [2, 10],
  orbit: 0.06, embers: { n: 40, nPhone: 20, life: [2.5, 5], reach: [0.16, 0.45], alpha: 1, r: [1, 2.4], slow: 3, burst: 2, fade: [0.15, 1] },
  flare: { time: 1.6, core: 0.5, kick: 0.12, hit: 70, alpha: 0.9, reach: 0.85, auto: [7, 12], cap: 8, coreMax: 1.2, kickMax: 0.3 },
  gather: { ring: 0.32, swirl: 0.35, sky: 0.5, join: 0.5, stagger: 0.35, time: 0.6, tail: 0.02, tailGain: 0.08, golden: 0.6180339887498949 },
  motionIn: [0, 1], orbitIn: [0.5, 1], seed: 149,
  base: { spikeLength: 12.7, angles: [45, -45], rushLen: 2.4, peakLen: 10, endLen: 5, spikePeak: 0.3, spikeEnd: 58,
    thin: [1, 0.55, 0.8, 0.5], heat: [0.05, 0.7], redOut: [0.2, 0.9],
    redGlow: [220, 1.1, 0.62, 0.58], glowPeak: 0.4, glowAspect: 0.82, rushGlowAlpha: 0.6,
    orangeGlow: [120, 300], orangeAlpha: 0.9, core: [90, 60, 0.5, 70],
    ringStart: 30, ringReach: 0.75, ringFade: [0.2, 0.9], ringAlpha: [0.9, 0.35],
    streak: [20, 0.09], streakIn: [0, 0.06], streakOut: [0.25, 0.7],
    shellIn: [0.2, 0.8], shellR: [200, 330], shellPhone: [120, 190], shellAlpha: [0.3, 0.14],
    textIn: [0.4, 0.62], textGap: 0.1, textRise: 24, textShow: 0.3, digHit: 26, hitTolerance: 0.5,
    starInner: 60, starReach: 0.55, starAspect: 0.85, starBlast: 0.7, starSpeed: [0.3, 0.7],
  },
};

export const FIND_TIMING = { burst: 0.7, dig: 0.6, ravenLoop: 1.1, reel: 5, iris: 0.5, serpentSink: 0.9, serpentSurface: 1.0, beamSweep: 0.35, beamCone: 22, noteDelay: 0.4, carving: 1.0, unroll: 0.8, slide: 0.35, ripple: 0.9, closeScroll: 8 };

// Part A live tuning. Geometry, copy, dimensions and clocks are read by the find kit.
// Round 7 C2: reference rig geometry, with no runtime dependency on the reference.
export const RAVEN_RIG = (() => {
  const n1 = n => +(+n).toFixed(2);
  const P = a => a.map(([c, ...v]) => c + v.map(n1).join(' ')).join('');
// rounded bumps along a polyline (outward = left of travel), for feather edges
  const bumps = (pts, b) => { let d = ''; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i + 1], mx = (a[0] + c[0]) / 2, my = (a[1] + c[1]) / 2, dx = c[0] - a[0], dy = c[1] - a[1], L = Math.hypot(dx, dy) || 1; d += `Q${n1(mx + dy / L * b * L)} ${n1(my - dx / L * b * L)} ${n1(c[0])} ${n1(c[1])}`; } return d; };
// body and tail, one outline
  const BODY = P([['M', 6.4, -12.4], ['C', 7.4, -10.4, 6.9, -7.3, 4.5, -5.3], ['C', 2.7, -3.9, -0.8, -3.4, -4.0, -4.0],
  ['L', -8.8, -0.6], ['L', -13.4, 2.1], ['L', -12.9, -0.4], ['L', -12.4, -1.8], ['L', -7.6, -6.6],
  ['C', -6.2, -9.0, -3.2, -12.0, 0.6, -13.8], ['C', 2.4, -14.7, 4.2, -15.0, 5.6, -14.6], ['Z']]);
  const TAILLINES = P([['M', -8.6, -3.4], ['L', -12.6, 0.6], ['M', -9.0, -5.0], ['L', -12.5, -1.0]]);
// head, relative to the neck point N: a fill that reaches into the body, and an open outline (no seam at the neck)
  const N = [4.4, -14.2];
  const HEADLINE = [['M', -2.2, -0.6], ['C', -2.2, -2.0, -1.4, -3.2, 0.2, -3.7], ['C', 1.4, -4.0, 2.6, -3.8, 3.6, -3.2],
  ['C', 5.8, -3.1, 8.4, -2.3, 10.2, -0.7], ['C', 10.3, -0.4, 10.1, -0.1, 9.8, -0.1], ['C', 8.0, -0.1, 6.0, 0.1, 4.0, 0.3],
  ['L', 3.5, 0.2], ['L', 3.7, 1.1], ['L', 2.8, 0.8], ['L', 3.0, 1.9], ['L', 2.0, 1.5], ['L', 2.1, 2.6], ['L', 1.3, 2.1], ['L', 1.4, 3.0]];
  const HEADFILL = P([...HEADLINE, ['L', -1.0, 3.4], ['L', -3.0, 1.6], ['Z']]);
  const HEADOUT = P(HEADLINE);
  const BILL = P([['M', 3.4, -1.2], ['C', 5.2, -1.4, 7.2, -1.1, 8.8, -0.6], ['M', 3.6, -3.1], ['C', 4.3, -2.6, 4.9, -2.1, 5.3, -1.6]]);
  const EYE = [1.5, -2.2, 0.4];
// the wing, drawn open with its length straight up from the shoulder (origin), the hand's fingers at the top, the fan to the back (-x)
  const TIPS = [[-1.0, -20.0], [-3.3, -21.2], [-5.8, -20.8], [-8.0, -19.2], [-9.7, -16.6]];
  const HC = [-4.6, -10.0]; // the hand's centre, for the notches between fingers
  const fingers = () => {
  let d = ''; const dir = t => { const dx = t[0] - HC[0], dy = t[1] - HC[1], L = Math.hypot(dx, dy); return [dx / L, dy / L]; };
  TIPS.forEach((t, i) => {
    const [ux, uy] = dir(t), px = -uy, py = ux, w = 0.85, r = 1.1;
    const a = [t[0] - ux * r + px * w, t[1] - uy * r + py * w], b = [t[0] - ux * r - px * w, t[1] - uy * r - py * w];
    d += `L${n1(a[0])} ${n1(a[1])}Q${n1(t[0] + ux * 0.5)} ${n1(t[1] + uy * 0.5)} ${n1(b[0])} ${n1(b[1])}`;
    if (i < TIPS.length - 1) { const nx = (t[0] + TIPS[i + 1][0]) / 2, ny = (t[1] + TIPS[i + 1][1]) / 2, k = 0.42; d += `L${n1(nx + (HC[0] - nx) * k)} ${n1(ny + (HC[1] - ny) * k)}`; }
  });
  return d;
};
  const TRAIL = [[-10.0, -13.8], [-9.8, -10.6], [-9.0, -7.6], [-7.8, -4.8], [-5.8, -2.2], [-3.0, 0.0], [0.8, 0.6]];
  const WING = `M0.8 0.6C1.2 -3.6 1.0 -7.6 -0.2 -11.4` + fingers() + `L-10.0 -13.8` + bumps(TRAIL, 0.16) + 'Z';
  const WINGLINES = P([['M', -0.6, -11.2], ['C', -3.4, -10.0, -6.6, -10.2, -9.6, -11.6], ['M', -0.4, -6.2], ['C', -2.8, -5.4, -5.6, -5.4, -8.8, -6.6]]);
  const S = [0.4, -11.8]; // shoulder
  const LEGS = P([['M', -0.9, -3.8], ['L', -0.7, 0], ['M', 1.3, -3.9], ['L', 1.6, 0], ['M', -2.2, 0.1], ['L', 0.4, 0.1], ['M', 0.4, 0.1], ['L', 2.8, 0.2]]);
  const HIP = [0.2, -4.0], PIV = [-2.0, -8.0]; // the body group turns about PIV
  const POSES = {
  sit: { sq: [1, 1], body: 0, head: 0, wing: [-121, 0.3, 0.66], far: [-121, 0.26, 0.6], legs: 1 },
  unfold: { sq: [1.03, 0.94], body: 12, head: -6, wing: [-72, 0.66, 0.84], far: [-70, 0.58, 0.78], legs: 0.7 },
  up: { sq: [1.08, 0.84], body: 26, head: -18, wing: [-34, 1, 1], far: [-26, 0.86, 0.9], legs: 0 },
  mid: { sq: [1.08, 0.84], body: 28, head: -20, wing: [-92, 1, 0.55], far: [-88, 0.86, 0.5], legs: 0 },
  down: { sq: [1.08, 0.84], body: 28, head: -20, wing: [-150, 1, 0.82], far: [-148, 0.86, 0.75], legs: 0 },
  glide: { sq: [1.1, 0.82], body: 28, head: -22, wing: [-62, 1, 0.62], far: [-56, 0.86, 0.56], legs: 0 },
  flare: { sq: [1.02, 0.96], body: 4, head: -2, wing: [-22, 1, 1], far: [-14, 0.86, 0.92], legs: 0.8 },
};
  const spl = (Pt, seg = 8) => { const n = Pt.length, out = []; const g = i => Pt[Math.max(0, Math.min(n - 1, i))]; for (let i = 0; i < n - 1; i++) { const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2); for (let j = 0; j < seg; j++) { const t = j / seg, t2 = t * t, t3 = t2 * t; out.push([0, 1].map(k => .5 * (2 * p1[k] + (p2[k] - p0[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (3 * p1[k] - p0[k] - 3 * p2[k] + p3[k]) * t3))); } } out.push(Pt[n - 1]); return out; };
  const tube = (Pt, w0, w1) => { const S = spl(Pt), n = S.length, L = [], R = []; for (let i = 0; i < n; i++) { const a = S[Math.max(0, i - 1)], c = S[Math.min(n - 1, i + 1)], dx = c[0] - a[0], dy = c[1] - a[1], l = Math.hypot(dx, dy) || 1, t = i / (n - 1), w = (w0 + (w1 - w0) * t) / 2; L.push([S[i][0] - dy / l * w, S[i][1] + dx / l * w]); R.push([S[i][0] + dy / l * w, S[i][1] - dx / l * w]); } return 'M' + [...L, ...R.reverse()].map(p => n1(p[0]) + ' ' + n1(p[1])).join('L') + 'Z'; };
  const TK = 1.45; // the tree is drawn at 1/1.45 and scaled up
  const PERCHES = [[-11 * TK, -18.2 * TK], [11 * TK, -28.4 * TK]]; // Huginn (faces left), Muninn (faces right)
  const TREE = [
  tube([[0, 0.6], [0.4, -5], [0.6, -10], [0.8, -13.4]], 4.6, 2.8),
  tube([[0.4, -11.6], [-3, -15.2], [-7, -17.4], [-11, -18.2], [-15.6, -18.6]], 2.6, 0.5),
  tube([[0.8, -13], [2.6, -18], [5, -23.4], [8, -27], [11, -28.4], [15.4, -29.2]], 2.4, 0.5),
  tube([[-6.4, -17.1], [-7.4, -20.4], [-7.0, -23.6]], 1.0, 0.3),
  tube([[4.6, -22.6], [3.4, -27.4], [3.8, -31.2]], 1.0, 0.3),
  tube([[0.3, -7.6], [-2.6, -9.0], [-4.4, -9.2]], 1.2, 0.4),
];
  const TREELINES = 'M-1.6 0.6Q-3.6 1.2 -5.4 1.8M1.8 0.6Q3.8 1.2 5.6 1.6M-0.4 -2V-9M1.2 -3.2V-8.4M-15 2H15';
  return { BODY, TAILLINES, N, HEADFILL, HEADOUT, BILL, EYE, WING, WINGLINES, S, LEGS, HIP, PIV, POSES, TK, PERCHES, TREE, TREELINES,
    farOffset: [1.2, -0.8], treeLine: 2.2, itemAt: [10.2, -0.7],
    hit: [-31.4, -61, 63.8, 67], restBox: [-28.4, -58, 29.4, 3],
    gift: [4, -1], hopSlope: [-0.087, -0.174], shyTime: 0.25, hopHeight: 1.5,
    crouch: 0.12, unfold: 0.18, outPower: 1.6, backPower: 2, controls: [[10, -26], [55, -32]], endY: -29,
    turn: 0.12, hysteresis: 0.1, perchTurn: 0.16, settle: 0.2, land: 0.35, level: 0.3,
    dip: 0.15, dipAngle: 25, itemFade: 0.2, offFrame: 12, birdMargin: 18,
    loopRadius: 24, loopCentre: [20.8, -12], loopTakeoff: 0.2, loopTime: 1.1, loopGap: 0.55,
    returnBeat: 0.35, returnFlaps: 0.7, beat: ['up', 'mid', 'down', 'mid', 'up'],
    preenMove: [-1.5, 1.5], breathe: [0.012, 2.8], areaTolerance: 0.15,
  };
})();
export const FIND_PLAY = {
  fresh: 3, seed: 171,
  focus: { fill: 0.72, least: 0.85, most: 3, at: [0.5, 0.46], in: 0.7, out: 0.5, swap: 0.6, chest: [0, -16, 30], ship: [0, -10, 34], wide: [300, 450, 330, 0] },
  bits: { pool: 96, starSize: 2.2, puffAlpha: 0.22,
    kinds: { dot: ['M-.8 0a.8 .8 0 1 0 1.6 0a.8 .8 0 1 0 -1.6 0Z', 'pf'], clod: ['M-1.4 .6L-.6 -1.1L1.2 -.7L1.5 .8L-.2 1.3Z', 'g'], drop: ['M0 -1.6Q1.1 .2 0 1.1Q-1.1 .2 0 -1.6Z', 'pf'], spark: ['M0 0V-2.4', 'l'], feather: ['M0 -3Q1.5 0 0 3Q-1.5 0 0 -3Z', 'g'], puff: ['M-3.2 0a3.2 3.2 0 1 0 6.4 0a3.2 3.2 0 1 0 -6.4 0Z', 'pf'], wisp: ['M-6 0a6 3 0 1 0 12 0a6 3 0 1 0 -12 0Z', 'mist-wisp'], ring: ['M-3 0a3 1 0 1 0 6 0a3 1 0 1 0 -6 0Z', 't'] },
    base: { speed: [0, 0], dir: [-90, -90], g: 0, drag: 0, life: [0.6, 0.6], size: [1, 1], spin: 0, alpha: 1 },
    clods: { speed: [18, 34], dir: [-150, -30], g: 90, life: [0.6, 0.6], spin: 80 },
    puffs: { speed: [3, 7], dir: [-160, -20], life: [0.6, 0.6], size: [0.4, 1.5], alpha: 0.22 },
    feathers: { speed: [2, 6], dir: [20, 160], g: 12, drag: 2, life: [1.4, 1.4], spin: 25 },
    stars: { speed: [6, 12], dir: [-120, -60], life: [1.1, 1.1], size: [1, 0.2], spin: 20 },
    drops: { speed: [8, 18], dir: [-140, -40], g: 60, life: [0.5, 0.7] },
    wake: { speed: [0, 0], life: [0.6, 0.6], size: [1, 3.5], alpha: 0.7 },
    sparks: { speed: [10, 10], dir: [-100, -80], life: [1.2, 1.2], size: [1, 0.2] },
    hop: { speed: [8, 8], dir: [-100, -80], g: 40, life: [0.4, 0.4] },
  },
  star: { time: 0.75, arc: 46, bump: 0.3, size: 14, peak: 1.3 },
  kit: { margin: 40, rad: 70, shipY: 5, starZ: 7, dt: 0.05, popup: { scale: 0.6, over: 1.08, time: 0.22, edge: 8, tail: [10, 6], width: 240, radius: 10, pad: [10, 14], font: 13, line: 1.4, kicker: 9.5, gap: 4 }, slot: { font: 11, weight: 500, border: 1, pad: 6 }, target: 17, sheet: { from: 0.06, edge: 24, grow: 0.35, offset: 20 }, deg: 180, turn: 360 },
  way: { stiff: 90, damp: 9, near: 70, line: 0.45, gap: 0.1, short: 9, ping: 0.5, runes: 0.6, spin: 0.8, timelineDim: 0.35, lineWidth: 1, wide: [300, 480, 250, 0],
    drift: [0.8, 4, 0.31, 2], dim: 0.55, armWidth: 2.2, pulse: [1.12, 0.25], dash: [2, 4], alpha: 0.6, solidAlpha: 0.9, pingR: [6, 14], pingAlpha: 0.7, tally: [22, 5.2, 1, 10.5, 9], ring: [4, 9, 1.6], allSpeed: 40, hub: 6,
  },
  hoard: { hole: [16, 28, 38], lift: [0.18, 0.24, 1], rise: [0.28, 0.28, 0.5], backEase: 0.8, over: 1.2, repeat: 0.3, rattle: 0.36, openHold: 0.3, near: 26, glint: [5, 8],
    scale: 0.3, travel: 64, holeRatio: 0.28, pile: [0.5, 0.75, 1], scratchWidth: 1.6, glintAt: [0, -4], glintSize: 5, glintTime: 0.5, glintTurn: 45, clods: 7, rattleAngle: 4, rattleCycles: 3,
    lidTime: 0.4, lidSettle: 0.12, lidBounce: 0.25, lidPeak: 118, lidRest: 110, rim: -34, depth: 24, half: 30, lean: [90, 20, 2.4], mouthAngle: 60,
    glowR: 46, starCount: 8, starY: -44, starSizes: [6, 4], glowTime: 0.3, glowPeak: 1, glowRest: 0.6, glowKept: 0.35, stars: 6, burstTravel: [48, 34], burstLift: 14, anchor: 18, width: 260, top: 3, icon: 64, iconBox: [-32, -32, 64, 64], rad: 35, scratchHop: 2,
    hit: [0, -24, 40], clip: [-240, -200, 480, 200], pileAt: [48, 2], pilePath: 'M-7 0q6 -10 13 0z',
    clodLife: 0.6, clodSpeed: [18, 34], clodUp: [28, 44], clodSpin: 80, clodFloor: 2,
    scratchPath: 'M-12 -6l14 8M2 -6l-14 8M-24 2l-3 -6M-20 2l1 -7M14 2l3 -6M20 2l-1 -6',
    body: '<rect class="g" x="-30" y="-34" width="60" height="34" rx="2"/><path class="t" d="M-18 -34V0M18 -34V0M-30 -22H30"/><rect class="pf" x="-4.5" y="-27" width="9" height="10" rx="1.5"/>',
    dome: '<path class="g" d="M-30 -34Q0 -56 30 -34Z"/><path class="t" d="M-18 -42V-34M18 -42V-34"/>',
    mouth: 'M-29 0L-27 -4.5H27L29 0Z', mouthLine: 'M-22 -2.2H22', mouthAlpha: 0.7, mouthWidth: 1.2,
    insideLines: ['M-18 0V-26', 'M18 0V-26', 'M-29 -6H29'], inside: [30, 24, 6], planks: [18, 0.6, 2, 29, -6], rimPath: 'M-1 0A1 1 0 0 0 1 0',
  },
  raven: { near: 30, shy: 4, preen: [6, 10], out: 1.1, away: 0.4, back: 1, reach: 177, flap: 4,
    scale: 0.62, birdScale: 0.85, popupAt: 61, attend: 120, squash: 0.85, preenAngle: 20, preenTime: 0.5, ruffle: [1.1, 0.3], headLimit: 35, headEase: 6, idle: [0.7, 0.43], feathers: 2, tilt: 30, strip: [4, 1.6], frame: [4, 3], tallyAlpha: 0.9,
    tally: ['M6 -6V0', 'M8.5 -6V0', 'M11 -6V0', 'M13.5 -6V0', 'M6 -1L14 -5', 'M20 -6V0'],
    reel: { ringSvg: '<svg class="ring" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="16"/><circle class="ring-p" cx="20" cy="20" r="16" pathLength="100" stroke-dasharray="100 100"/></svg>', timeJoin: ' / ', iris: 440, width: 360, ratio: [16, 11], motion: [1.3, 0.4, 2, 60, 1.1, 0.3, 22, 40], ring: 100, tc: '00:0{n} / {end}', labelTop: 12, slotBottom: 36 },
  },
  serpent: {"near":34,"tongue":[0.25,0.7],"scale":1,"bounds":[-50,-30,12,12],"head":[-18,-4],"attend":140,"headLimit":10,"headEase":5,"bob":[2.5,0.5,3.4],"steps":[0.14,0.2,0.08,0.35,0.3],"jaw":20,"hungryJaw":6,"jawPivot":[-14,1.6],"lunge":24,"over":3,"overEase":1.94335,"tailOut":[3,1],"tailTwitch":[1.5,0.3],"flutter":[6,3],"mouth":[-32,1.5],"corner":[-24,-0.6],"pad":[-41,-20],"leafSize":[11,13],"leafOffset":0.6,"swallow":10,"swell":[2.4,2.1,1.8],"close":[0.1,0.25,0.08],"restAngle":-3,"breathe":[1,4.8],"wake":0.2,"padTime":0.6,"padSink":4,"hear":[8,0.8,4],"popup":[-65,-34],"drops":2,"tonguePath":"M-37 -1l-6 0m0 0l-3 -2m3 2l-3 2","shutPath":"M-22.6 -4.6Q-18 -1.8 -12 -4.2","snout":[-37,-1],"tailPath":"M-40.8 3.5L-39.3 3.3L-37 3.1L-35 2.8L-33.3 2.6L-31.9 2.5L-32.1 0.5L-33.5 0.7L-35.2 0.8L-37.2 1L-39.5 1.2L-41.1 1.4Z","padBoard":"M-6 -7H6V7H-6Z","leafPath":"M-5.5 -6.5H5.5V6.5H-5.5Z","padWave":"M-48 -10q3 -2 6 0t6 0t6 0","binding":[-5.5,-6.5,11,1.6],"rings":[-3,3,-5.7,0.45],"dayY":-0.5,"timeY":4,"daySize":3,"timeSize":3.6,"weight":700,"hit":[-50,-30,62,42]},
  beacon: { rad: 200, read: 1.2, flame: [1, 1.3, 1.6, 1.9, 2.3], leap: [3, 0.3], embers: 1.5, turn: 30, reach: 1.4, idle: 0.7, snap: 0.4,
    scale: 0.6, origin: [0, -50], flameFoot: [0, -47], glowR: 16, glowAlpha: 0.15, flicker: [0.08, 11, 0.05, 17.3, 0.12, 13.1], baseAngle: 176, sweep: 36, baseReach: 230, manual: 6, arrow: 6, slop: 6, notePhone: 1.7, soft: 4, wedgeSteps: 32, rest: 0.55, sparkN: 6, burstN: 14, noteScale: 1.12, flash: 0.3, hear: [0.6, 0.3, 1.3, 0.3], englishEase: 5, noteEase: 6, noteFont: 4.6, todoFont: 3.4, runeY: -7, lineY: 7, todoY: 1, runeSize: 4.2,
  },
  rune: { carving: 0.6, grow: 0.4, r: 34, step: 12, grid: [5, 7], done: 0.8, auto: [1.2, 1.6, 7], fill: 0.25,
    letter: [0.05, 0.18], stamp: [0.45, 0.12, 2.4], shake: [3, 0.16], tilt: 5, close: 0.3,
    width: 300, height: 400, outline: 'M40 392L28 150Q36 34 150 12Q264 34 272 156L260 392Z', outer: 'M60 380L50 152Q57 56 150 34Q243 56 250 158L240 380', inner: 'M74 380L64 154Q70 70 150 50Q230 70 236 160L226 380', feet: 'M60 380H74M226 380H240', dot: [67, 372, 2.2],
    hatch: [[-200, 520, 7, 231, 2.6, 0.42], [-100, 420, 11, 107, 1.6, 0.3]], jitter: 2, charcoal: 0.34, guide: 0.1, outlineAlpha: 0.45, outlineWidth: 1.5, carvingWidth: 4.4, maskCore: 0.6, runeHeight: 30, runeGap: 0.32, tops: [92, 158, 224, 290], cx: 150, cells: [40, 30, 260, 390], cellR: 30, letterSize: 13, letterWeight: 800, letterDown: 15, letterRise: 4, near: 24, dash: [6, 200], dashTime: 1.5, scale: 0.55, anchor: -20, stampAngle: -14, flipTime: 0.6, perspective: 1400, controlTop: 214,
  },
  drawings: {
    wayfinder: `<circle class="hit" r="58"/><circle class="o" r="42"/><circle class="t" r="34.4"/><g class="wf-runes"><path class="rn" transform="rotate(8) translate(-0.7 -40.5)" d="M0 0L0 4.6M0 0L1.4 1.2M1.4 1.2L0.8 1.7M0 4.6L1.4 3.5M1.4 3.5L0.8 2.9"/><path class="rn" transform="rotate(24.4) translate(-0.7 -40.5)" d="M0 4.6L0 0L1.4 1.2L0 2.3L1.4 4.6"/><path class="rn" transform="rotate(40.7) translate(0 -40.5)" d="M0 0L0 4.6"/><path class="rn" transform="rotate(57.1) translate(-0.7 -40.5)" d="M0.7 0L0.7 4.6M0 1.7L1.4 2.9"/><path class="rn" transform="rotate(73.5) translate(-0.7 -40.5)" d="M0.7 0L0.7 4.6M0 1.2L0.7 0L1.4 1.2"/><path class="rn" transform="rotate(89.8) translate(-0.7 -40.5)" d="M0 4.6L0 0L1.4 1.2L0 2.3"/><path class="rn" transform="rotate(106.2) translate(0 -40.5)" d="M0 0L0 4.6"/><path class="rn" transform="rotate(122.5) translate(-0.7 -40.5)" d="M0 0L0 4.6L1.4 0L1.4 4.6L0 0"/><path class="rn" transform="rotate(138.9) translate(-0.7 -40.5)" d="M0 4.6L0 0L0.7 1.2L1.4 0L1.4 4.6"/><path class="rn" transform="rotate(155.3) translate(-0.7 -40.5)" d="M0 4.6L1.4 2.3L0.7 0.9L0 2.3L1.4 4.6"/><path class="rn" transform="rotate(171.6) translate(-0.7 -40.5)" d="M0 4.6L0 0L1.4 1.7M1.4 4.6L1.4 0L0 1.7"/><path class="rn" transform="rotate(188) translate(-0.7 -40.5)" d="M0 4.6L1.4 2.3L0.7 0.9L0 2.3L1.4 4.6"/><path class="rn" transform="rotate(204.4) translate(-0.7 -40.5)" d="M0.7 0L0.7 4.6M0 1.2L0.7 0L1.4 1.2"/><path class="rn" transform="rotate(220.7) translate(0 -40.5)" d="M0 0L0 4.6"/><path class="rn" transform="rotate(237.1) translate(-0.7 -40.5)" d="M0 4.6L1.4 2.3L0.7 0.9L0 2.3L1.4 4.6"/><path class="rn" transform="rotate(253.5) translate(-0.7 -40.5)" d="M0.7 0L0.7 4.6M0 1.7L1.4 2.9"/><path class="rn" transform="rotate(269.8) translate(-0.7 -40.5)" d="M1.4 0L0 1.7L1.4 2.9L0 4.6"/><path class="rn" transform="rotate(286.2) translate(-0.6 -40.5)" d="M1.3 0L0 1.2L1.3 2.3"/><path class="rn" transform="rotate(302.5) translate(-0.7 -40.5)" d="M0 4.6L0 0L1.4 1.2L0 2.3L1.4 4.6"/><path class="rn" transform="rotate(318.9) translate(-0.7 -40.5)" d="M0 4.6L0 0L0.7 1.2L1.4 0L1.4 4.6"/><path class="rn" transform="rotate(335.3) translate(-0.7 -40.5)" d="M0 4.6L0 0L0.7 1.2L1.4 0L1.4 4.6"/><path class="rn" transform="rotate(351.6) translate(-0.7 -40.5)" d="M0.7 0L0.7 4.6M0 1.7L1.4 2.9"/></g><g class="wf-arm" data-i="0" transform="rotate(0)"><path class="l" d="M0 0V-31.08M0 -31.08l-4 -4M0 -31.08l4 -4M0 -31.08v-5"/></g><g class="wf-arm" data-i="1" transform="rotate(90)"><path class="l" d="M0 0V-31.08M0 -34.08m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/></g><g class="wf-arm" data-i="2" transform="rotate(180)"><path class="l" d="M0 0V-31.08M-4 -27.08L0 -33.08L4 -27.08"/></g><g class="wf-arm" data-i="3" transform="rotate(270)"><path class="l" d="M0 0V-31.08M-5 -31.08H5M-3 -35.08H3"/></g><g transform="rotate(45)"><path class="l" d="M0 0V-17.64M0 -17.64l-3 -3"/></g><g transform="rotate(135)"><path class="l" d="M0 0V-17.64M0 -17.64l3 -3"/></g><g transform="rotate(225)"><path class="l" d="M0 0V-17.64M-3 -17.64H3"/></g><g transform="rotate(315)"><path class="l" d="M0 0V-17.64M0 -17.64m-1.5 -2a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0"/></g><text x="0" y="-48" font-size="6.5" fill="${C.paper}" font-weight="700" text-anchor="middle" letter-spacing="1.2" class="wf-word h">${FIND_COPY.crafts[0]}</text><text x="46" y="2.5" font-size="6.5" fill="${C.paper}" font-weight="700" text-anchor="start" letter-spacing="1.2" class="wf-word h">${FIND_COPY.crafts[1]}</text><text x="0" y="54" font-size="6.5" fill="${C.paper}" font-weight="700" text-anchor="middle" letter-spacing="1.2" class="wf-word h">${FIND_COPY.crafts[2]}</text><text x="-46" y="2.5" font-size="6.5" fill="${C.paper}" font-weight="700" text-anchor="end" letter-spacing="1.2" class="wf-word h">${FIND_COPY.crafts[3]}</text><g class="wf-needle"><path class="pf" d="M0 -26L3 0L-3 0Z"/><path class="o" d="M0 26L3 0L-3 0Z"/></g><circle class="o wf-hub" r="3.4"/><circle class="t wf-all" r="{{way.ring.0}}" opacity="0"/><text x="0" y="64" font-size="{{way.tally.1}}" fill="${C.note}" font-weight="500" text-anchor="middle" letter-spacing="{{way.tally.2}}" class="wf-tally"></text>`,
    serpent: `<g class="jg-tail"><path class="o" d="{{serpent.tailPath}}"/></g><g class="jg-head"><g class="jg-skull"><path fill="${C.ink}" stroke="none" d="M0 -3.2C-3 -6.4 -7 -8.8 -12 -9.4C-16 -9.8 -20 -9.6 -23 -8.4C-26 -7.2 -29 -6.4 -32 -6.6C-34 -6.8 -35.6 -8 -36.6 -7.6C-37.8 -7 -37.6 -5 -36.2 -3.8C-35 -2.8 -33.4 -2.4 -32 -2.4L-24 -.6L4 1.6L4 -3.2Z"/><path class="l" d="M0 -3.2C-3 -6.4 -7 -8.8 -12 -9.4C-16 -9.8 -20 -9.6 -23 -8.4C-26 -7.2 -29 -6.4 -32 -6.6C-34 -6.8 -35.6 -8 -36.6 -7.6C-37.8 -7 -37.6 -5 -36.2 -3.8C-35 -2.8 -33.4 -2.4 -32 -2.4L-24 -.6"/><path class="l" d="M-7 -8.4C-4 -12.6 1 -15.4 7 -15C11 -14.6 13 -11.8 11.6 -9.4C10.4 -7.6 7.8 -7.8 7.4 -9.6C7.2 -10.8 8.6 -11.4 9.4 -10.6"/><g class="jg-eye"><path class="l" d="M-22.6 -4.6C-21 -6.4 -17.6 -6.6 -15.6 -5.2C-14.6 -4.6 -13.4 -4.2 -12 -4.2C-13.6 -3 -15.4 -2.6 -17.2 -2.8C-19.4 -3 -21.4 -3.6 -22.6 -4.6Z"/><circle class="pf" cx="-18.6" cy="-4.4" r="1"/></g><path class="l jg-shut" d="{{serpent.shutPath}}" opacity="0"/><path class="l" d="M-24 -.6C-20 1.6 -15 2.2 -11 1C-8.6 .2 -8 -2.2 -9.8 -2.8C-11.2 -3.2 -12 -1.8 -11 -1.2M-33.6 -6.6C-33 -5.6 -32.2 -5.2 -31.4 -5.4"/><path class="pf" d="M-30.6 -2.2L-29.6 .2L-28.8 -1.9ZM-27 -1.4L-26.2 .4L-25.4 -1.1Z"/><path class="t" d="M-6 -6.6C-4 -4.2 -2.6 -1.6 -2 1.2M-10 -8.6C-8 -6 -6.8 -3 -6.4 0"/></g><g class="jg-jaw"><path fill="${C.ink}" stroke="none" d="M-24 -.6L-33.6 1.8C-35 2.2 -35.6 3.4 -35 4.4C-33.6 6.4 -29.6 7.4 -25 7.6C-20 7.8 -14 8 -9 7C-5 6.2 -2 5 0 3.2L4 3.2L4 -.6Z"/><path class="l" d="M-24 -.6L-33.6 1.8C-35 2.2 -35.6 3.4 -35 4.4C-33.6 6.4 -29.6 7.4 -25 7.6C-20 7.8 -14 8 -9 7C-5 6.2 -2 5 0 3.2"/><path class="pf" d="M-31.6 1.6L-30.8 -.6L-29.9 1.3Z"/></g><path class="l jg-tongue" d="{{serpent.tonguePath}}" opacity="0"/></g><g class="jg-pad"><path class="g" d="{{serpent.padBoard}}"/><g class="jg-leaf" data-i="2"><path class="o" d="{{serpent.leafPath}}"/><rect class="pf" x="{{serpent.binding.0}}" y="{{serpent.binding.1}}" width="{{serpent.binding.2}}" height="{{serpent.binding.3}}"/><circle class="o" cx="{{serpent.rings.0}}" cy="{{serpent.rings.2}}" r="{{serpent.rings.3}}"/><circle class="o" cx="{{serpent.rings.1}}" cy="{{serpent.rings.2}}" r="{{serpent.rings.3}}"/><text text-anchor="middle" y="{{serpent.dayY}}" font-size="{{serpent.daySize}}" font-weight="{{serpent.weight}}" fill="${C.paper}">${FIND_COPY.serpentLeaves[2][0]}</text><text text-anchor="middle" y="{{serpent.timeY}}" font-size="{{serpent.timeSize}}" fill="${C.paper}">${FIND_COPY.serpentLeaves[2][1]}</text></g><g class="jg-leaf" data-i="1"><path class="o" d="{{serpent.leafPath}}"/><rect class="pf" x="{{serpent.binding.0}}" y="{{serpent.binding.1}}" width="{{serpent.binding.2}}" height="{{serpent.binding.3}}"/><circle class="o" cx="{{serpent.rings.0}}" cy="{{serpent.rings.2}}" r="{{serpent.rings.3}}"/><circle class="o" cx="{{serpent.rings.1}}" cy="{{serpent.rings.2}}" r="{{serpent.rings.3}}"/><text text-anchor="middle" y="{{serpent.dayY}}" font-size="{{serpent.daySize}}" font-weight="{{serpent.weight}}" fill="${C.paper}">${FIND_COPY.serpentLeaves[1][0]}</text><text text-anchor="middle" y="{{serpent.timeY}}" font-size="{{serpent.timeSize}}" fill="${C.paper}">${FIND_COPY.serpentLeaves[1][1]}</text></g><g class="jg-leaf" data-i="0"><path class="o" d="{{serpent.leafPath}}"/><rect class="pf" x="{{serpent.binding.0}}" y="{{serpent.binding.1}}" width="{{serpent.binding.2}}" height="{{serpent.binding.3}}"/><circle class="o" cx="{{serpent.rings.0}}" cy="{{serpent.rings.2}}" r="{{serpent.rings.3}}"/><circle class="o" cx="{{serpent.rings.1}}" cy="{{serpent.rings.2}}" r="{{serpent.rings.3}}"/><text text-anchor="middle" y="{{serpent.dayY}}" font-size="{{serpent.daySize}}" font-weight="{{serpent.weight}}" fill="${C.paper}">${FIND_COPY.serpentLeaves[0][0]}</text><text text-anchor="middle" y="{{serpent.timeY}}" font-size="{{serpent.timeSize}}" fill="${C.paper}">${FIND_COPY.serpentLeaves[0][1]}</text></g></g><path class="t" d="{{serpent.padWave}}"/><rect class="hit" x="{{serpent.hit.0}}" y="{{serpent.hit.1}}" width="{{serpent.hit.2}}" height="{{serpent.hit.3}}"/>`,
    beacon: `<circle class="bc-glow" cx="{{beacon.flameFoot.0}}" cy="{{beacon.flameFoot.1}}" r="{{beacon.glowR}}" fill="url(#glow)" opacity="0"/><g class="bc-beam" transform="translate(0 -50) rotate(0)"><path d="M0 0L-230 -44.7L-230 44.7Z" fill="url(#beam)"/></g><rect class="hit" x="-26" y="-66" width="52" height="70"/><path class="g" d="M-20 0q4 -9 11 -4q8 -7 15 0q7 -5 14 4z"/><path class="g" d="M-9 -3L-7 -40H7L9 -3Z"/><path class="t" d="M-8.4 -12H8.4M-8 -21H8M-7.6 -30H7.6M-2 -3V-12M3 -12V-21M-3 -21V-30M2 -30V-40"/><rect class="o" x="-1.8" y="-10" width="3.6" height="7"/><path class="l" d="M-10 -40H10"/><path class="l" d="M-4 -40L-6 -46M4 -40L6 -46"/><path class="o" d="M-7 -47L-5 -42H5L7 -47Z"/><path class="pf bc-flame" d="M-3 -47Q-4 -53 0 -58Q1 -53 3 -51Q4 -49 3 -47Z"/>`,
    runestone: `<rect class="hit" x="-20" y="-66" width="40" height="70"/><path class="g" d="M-14 0L-16 -40Q-12 -60 0 -62Q13 -60 15 -38L13 0Z"/><path d="M-10 -2L-11.5 -38Q-9 -53 0 -55Q10 -53 11 -36L9.5 -6Q9 -1 5 -3" fill="none" stroke="${C.paper}" stroke-width="4" stroke-linecap="round"/><path d="M-10 -2L-11.5 -38Q-9 -53 0 -55Q10 -53 11 -36L9.5 -6Q9 -1 5 -3" fill="none" stroke="${C.land}" stroke-width="2.2" stroke-linecap="round"/><path class="l rs-trace" d="M-10 -2L-11.5 -38Q-9 -53 0 -55Q10 -53 11 -36L9.5 -6Q9 -1 5 -3"/><circle class="pf" cx="5" cy="-3" r="1"/><g transform="translate(2.2 -9) rotate(-90)"><path class="rn" d="M0 0L0 3.4M0 1.4L1.1 0.4M0 2.3L1.1 1.4M2.2 0L2.2 3.4M3.2 3.4L3.2 0L4.3 0.8L3.2 1.7L4.3 3.4M6.5 0L5.4 1.3L6.5 2.1L5.4 3.4M8.1 0L8.1 3.4M7.5 0.8L8.1 0L8.6 0.8M13.1 0L12.1 1.3L13.1 2.1L12.1 3.4M15.2 0L14.2 0.8L15.2 1.7M16.2 3.4L16.2 0L16.8 0.8L17.3 0L17.3 3.4M18.9 0L18.9 3.4M18.4 0.8L18.9 0L19.5 0.8M21.5 0L20.5 0.8L21.5 1.7M22.6 0L22.6 3.4M23.6 0L23.6 3.4M22.6 1.3L23.6 2.1M27.1 0L27.1 3.4M27.1 1.4L28.2 0.4M27.1 2.3L28.2 1.4M29.2 0L29.2 3.4M30.9 0L30.9 3.4M30.3 1.3L31.4 2.1M32.5 0L32.5 3.4M32.5 0L33.5 0.8M32.5 1.1L33.5 2M34.6 3.4L34.6 0L35.7 0.8M40.1 0L39.2 0.8L40.1 1.7M41.2 3.4L41.2 0L42.3 1.1L42.3 3.4M43.9 0L43.9 3.4M43.3 0.8L43.9 0L44.4 0.8"/></g><path class="t" d="M-20 0H20"/>`,
  },
  icons: {
    sheet: '<rect class="l" x="-14" y="-20" width="28" height="40"/><rect class="t" x="-10" y="-16" width="20" height="12"/><path class="t" d="M-10 2H10M-10 7H10M-10 12H4"/>',
    book: '<path class="l" d="M0 -16Q-10 -20 -22 -17V15Q-10 12 0 16Q10 12 22 15V-17Q10 -20 0 -16Z"/><path class="t" d="M0 -16V16M-17 -10Q-9 -12 -4 -10M-17 -4Q-9 -6 -4 -4M-17 2Q-9 0 -4 2M4 -10Q9 -12 17 -10M4 -4Q9 -6 17 -4"/>',
    screen: '<rect class="l" x="-22" y="-16" width="44" height="32" rx="2"/><path class="t" d="M-22 -9H22"/><circle class="pf" cx="-18" cy="-12.5" r="1"/><circle class="pf" cx="-14.5" cy="-12.5" r="1"/><path class="t" d="M-16 -3H2M-16 3H10M-16 9H-2"/><rect class="t" x="8" y="-4" width="10" height="10"/>',
    bundle: '<rect class="l" x="-16" y="-12" width="32" height="26"/><path class="t" d="M0 -12V14M-16 1H16"/><path class="l" d="M0 -12q-6 -8 -9 -3q-1 4 9 3q10 1 9 -3q-3 -5 -9 3"/>',
  },
  mist: { near: 62, rad: 70, box: [102, 410, 104, 50], alpha: 0.62, grid: [8, 4], cellR: 10, done: 0.75, thirds: 3,
    wipe: 9, press: 16, finger: 14, soft: [1.7, 0.4], step: 0.4, traveller: 7, travellerEdge: 10, lift: 1.2, hear: [6, 0.8],
    ellipses: [[150, 428, 26, 11], [180, 444, 24, 10], [134, 446, 18, 8], [117, 426, 19, 12], [158, 450, 25, 10], [192, 429, 22, 12]],
    cairns: [[138, 418], [166, 452], [200, 440]], cairnScale: 0.8, glintAt: [0, -10.4], glintSize: 5, glintTime: 0.5, glintGap: 0.15, glintTurn: 45,
    cairn: '<path class="g" d="M-6.5 0L-5.6 -2.8L5.2 -3.2L6.8 0Z"/><path class="g" d="M-4.8 -3L-4.2 -5.6L4.6 -5.9L4 -3.1Z"/><path class="g" d="M-3.4 -5.7L-3 -8L2.6 -8.3L3.4 -5.9Z"/><path class="g" d="M-1.6 -8.1L-1 -10.2L1.6 -10.4L1.4 -8.2Z"/>',
    puffs: 8, puff: { speed: [6, 12], life: [0.8, 0.8], size: [0.6, 1.3], alpha: 0.3 }, east: [0, 0], wisps: [3, 35],
  },
  horn: { near: 24, scale: 0.7, rad: 40, soundRad: 700, tip: 6, raise: 0.35, lift: [3, -7], turn: -30, pivot: [-8, -4], anchor: [0, -42],
    hold: 0.45, swell: [1.12, 6, 0.9], bell: [7, -14], rings: 4, gap: 0.18, radius: 4, speed: 300, life: 2.2, alpha: 0.8, power: 0.7,
    glint: [11, 0.6, 90], hit: [-18, -30, 34, 38],
    paths: ['M-12 -4C-14 -16 -2 -24 10 -22L10 -16C0 -17 -6 -12 -5 -4Z', 'M5 -21.5L5.5 -16.5M0 -20L1.5 -15.5M-5 -16L-2.5 -12.5', 'M10 -22L10 -16', 'M-16 3q4 -3 8 0t8 0t8 0'],
  },
  well: { near: 38, rad: 116, hit: [38, 22], water: [300, 390], root: [303, 389], drip: [4, 7], dripTime: 0.35,
    pebbleR: 1.2, pebbleFrom: [-30, -34], pebbleTime: 0.45, arc: 16, anchor: [0, 26],
    rings: 3, ringR: [30, 15], ringTime: 0.9, ringGap: 0.18, ringScale: [0.2, 1.25], ringAlpha: 0.9,
    drops: 6, splash: { speed: [22, 22], dir: [-120, -60], g: 80, life: [0.45, 0.6] },
    trunk: [[304, 373], [304, 323]], trunkTime: 0.4, starSize: 2.4, starTime: 0.3, starGap: 0.06, starOver: 1.3,
    twinkle: [0.6, 1], twinkleTime: [3.1, 4.7, 5.3, 3.9, 6.1],
    stars: [[[-44,-46],[-24,-60],[-2,-64],[23,-61],[50,-48]],[[-48,-39],[-30,-53],[-10,-56],[29,-52],[58,-40]],[[-39,-57],[-17,-69],[8,-69],[37,-63],[43,-40]]],
  },
  ship: { near: 34, rad: 38, scale: 0.55, anchor: [0, -34], rock: [2.2, 1.3, 0.8, 1.9], breathe: [0.04, 1.7],
    pull: [-18, 14, 0.35, 0.5], rail: [0, -5], surge: 3, pulls: 3, window: 4, pennantTime: 0.4, ripple: [6, 2.5],
    hear: [1.12, 0.6, 2, 1], sailPivot: [0, -25], lamp: [0, -42, 1.5, 7], twinkle: [0.65, 1, 4.1], drops: 4, water: [0, 8],
    hit: [-36, -50, 72, 60], shields: [-18, -11, -4, 3, 10, 17], shieldY: -6, shieldR: 2.6, bossR: 0.6,
    paths: { hull: 'M-26 -6Q-20 5 -10 5H12Q22 5 26 -6Z', ends: 'M-26 -6Q-33 -13 -29 -20Q-25 -25 -22 -20Q-21 -16 -24.5 -16.5M26 -6Q31 -11 28 -15Q26 -17 25 -15', mast: 'M0 -6V-38', sail: 'M-12 -35H12V-15H-12Z', stripes: 'M-6 -35V-15M0 -35V-15M6 -35V-15', water: 'M-36 8q4 -3 8 0t8 0M16 9q4 -3 8 0t8 0',
      oars: 'M-18 -5L-25 8M-11 -5L-18 8M-4 -5L-11 8M3 -5L-4 8M10 -5L3 8M17 -5L10 8', pennant: 'M0 -39.5L24 -38L18 -36.5L24 -35L0 -33.5Z' },
  },
  all: { frame: [18, 18, 564, 864], length: 100, width: 2, dash: [6, 94], time: 2.6, fade: 0.4, wait: 0.6, knotTime: 0.8, markerTime: 0.4, markerScale: 1.25, frameAlpha: 0.5,
    knots: [[36, 36], [564, 36], [36, 864], [564, 864]], corners: [0, 564, 2286, 1428] },
};

// Round 7 C1: ported reference paths and independent layout/motion tuning.
export const YGG = {
  "crown": [
    [
      -50,
      -31
    ],
    [
      -59,
      -36
    ],
    [
      -64,
      -45
    ],
    [
      -61,
      -55
    ],
    [
      -53,
      -63
    ],
    [
      -43,
      -70
    ],
    [
      -31,
      -73
    ],
    [
      -17,
      -77
    ],
    [
      -2,
      -79
    ],
    [
      13,
      -78
    ],
    [
      27,
      -76
    ],
    [
      41,
      -71
    ],
    [
      54,
      -66
    ],
    [
      65,
      -57
    ],
    [
      71,
      -47
    ],
    [
      71,
      -38
    ],
    [
      63,
      -31
    ],
    [
      50,
      -28
    ],
    [
      37,
      -31
    ],
    [
      24,
      -34
    ],
    [
      12,
      -39
    ],
    [
      0,
      -41
    ],
    [
      -12,
      -38
    ],
    [
      -24,
      -34
    ],
    [
      -37,
      -30
    ]
  ],
  "layers": [
    [
      [
        -55,
        -48
      ],
      [
        -42,
        -55
      ],
      [
        -28,
        -58
      ],
      [
        -14,
        -60
      ],
      [
        -2,
        -63
      ]
    ],
    [
      [
        6,
        -66
      ],
      [
        20,
        -68
      ],
      [
        34,
        -65
      ],
      [
        48,
        -59
      ],
      [
        60,
        -51
      ]
    ],
    [
      [
        -48,
        -38
      ],
      [
        -34,
        -44
      ],
      [
        -20,
        -46
      ],
      [
        -6,
        -49
      ],
      [
        8,
        -50
      ],
      [
        22,
        -48
      ],
      [
        36,
        -45
      ],
      [
        50,
        -42
      ],
      [
        62,
        -40
      ]
    ],
    [
      [
        -30,
        -64
      ],
      [
        -18,
        -68
      ],
      [
        -4,
        -70
      ],
      [
        10,
        -70
      ],
      [
        24,
        -67
      ]
    ]
  ],
  "roots": [
    [
      [
        [
          -5,
          -7
        ],
        [
          -14,
          -4
        ],
        [
          -24,
          -1
        ],
        [
          -32,
          3
        ],
        [
          -41,
          5
        ]
      ],
      7,
      0.6,
      0.25,
      3
    ],
    [
      [
        [
          5,
          -7
        ],
        [
          15,
          -4
        ],
        [
          27,
          0
        ],
        [
          38,
          4
        ],
        [
          49,
          5
        ]
      ],
      7,
      0.6,
      0.25,
      4
    ],
    [
      [
        [
          -1,
          -2
        ],
        [
          -2,
          5
        ],
        [
          0,
          11
        ],
        [
          -1,
          17
        ]
      ],
      6,
      0.8,
      0.2,
      5
    ],
    [
      [
        [
          -4,
          -2
        ],
        [
          -10,
          3
        ],
        [
          -16,
          8
        ],
        [
          -20,
          11
        ]
      ],
      4,
      0.5,
      0.2,
      6
    ],
    [
      [
        [
          4,
          -2
        ],
        [
          9,
          3
        ],
        [
          14,
          7
        ],
        [
          18,
          9
        ]
      ],
      4,
      0.5,
      0.2,
      7
    ]
  ],
  "rootlets": "<path class=\"t\" d=\"M-1 17C-2 20 -1 23 1 25M0 16C2 19 4 21 7 22M-1 14C-4 16 -6 18 -7 21M-20 11C-22 13 -22 15 -21 17M18 9C20 11 21 13 21 15\"/>",
  "trunk": "<path class=\"g\" d=\"M-9 1C-6 -5 -5 -12 -5.5 -19C-6 -24 -9 -30 -15 -36C-19 -40 -23 -43 -27 -46L-22 -47C-18 -43 -13 -39 -8 -34C-6 -32 -4 -31 -3 -34C-3 -40 -3 -46 -2 -52L2.5 -52C3 -46 3 -40 3.5 -34C4.5 -31 6.5 -32 9 -35C13 -39 18 -43 23 -47L27 -45C22 -41 16 -36 11 -31C7 -27 5.5 -23 5.5 -18C5.5 -11 6.5 -5 9 1C3 -.5 -3 -.5 -9 1Z\"/><path class=\"t\" d=\"M-2.5 -3C-2.6 -10 -2.2 -18 -1.6 -26M1.8 -3C2 -10 1.8 -17 1.6 -24M-5 -1C-4 -5 -3.6 -8 -3.7 -11M5 -1C4.3 -4 4 -7 4 -10M-1 -14C0 -15.5 1 -15.5 1.6 -14C1 -12 -0.4 -12 -1 -14Z\"/>",
  "leaves": "<path class=\"t\" d=\"M9.4 -47.5q1.8 1.5 3.6 0M17.9 -79.3q1.8 1.5 3.6 0M-3.3 -44q1.8 1.5 3.6 0M-25.3 -53.9q1.8 1.5 3.6 0M-18.5 -44.4q1.8 1.5 3.6 0M-30.1 -43.9q1.8 1.5 3.6 0M46.6 -52.4q1.8 1.5 3.6 0M11.7 -74.4q1.8 1.5 3.6 0M-48 -67.9q1.8 1.5 3.6 0M44.5 -69.8q1.8 1.5 3.6 0M31.3 -55.2q1.8 1.5 3.6 0M10.1 -52.7q1.8 1.5 3.6 0M43.8 -50.4q1.8 1.5 3.6 0M-6.4 -50q1.8 1.5 3.6 0M49.2 -49.3q1.8 1.5 3.6 0M-14.2 -40.5q1.8 1.5 3.6 0M45.6 -55.9q1.8 1.5 3.6 0M11.9 -74.3q1.8 1.5 3.6 0M-8 -69.7q1.8 1.5 3.6 0M5.4 -43.1q1.8 1.5 3.6 0M-38.9 -39.8q1.8 1.5 3.6 0M16.5 -40.9q1.8 1.5 3.6 0M-10.6 -67.5q1.8 1.5 3.6 0M-47.3 -63.6q1.8 1.5 3.6 0M-49.1 -52.1q1.8 1.5 3.6 0M2.8 -67.9q1.8 1.5 3.6 0M-6.3 -45.4q1.8 1.5 3.6 0M33.2 -41.5q1.8 1.5 3.6 0M33.7 -45.8q1.8 1.5 3.6 0M-50.6 -55.3q1.8 1.5 3.6 0M38.6 -42.9q1.8 1.5 3.6 0M26.9 -47.3q1.8 1.5 3.6 0M-13.6 -37.8q1.8 1.5 3.6 0M-32 -59q1.8 1.5 3.6 0M-50.3 -56.8q1.8 1.5 3.6 0M-0.3 -43q1.8 1.5 3.6 0M-11.4 -57.6q1.8 1.5 3.6 0M-7.3 -58.4q1.8 1.5 3.6 0\"/>",
  "eagle": "<g class=\"yg-wings\" transform=\"scale(1.1 .78)\"><path class=\"g\" d=\"M-1.3 -7.6C-3.4 -9.6 -6.2 -12.4 -9.4 -15C-9.2 -13.8 -8.8 -13.2 -8.3 -12.8L-9.8 -12.6C-9.2 -11.6 -8.6 -11.2 -7.9 -11L-9.4 -10.4C-8.4 -9.6 -7.4 -9.3 -6.4 -9.2L-7.4 -8.4C-5.4 -7.8 -3.4 -6.8 -1.6 -5.6Z\"/><path class=\"g\" d=\"M1.2 -7.6C3.4 -9.8 6.4 -12.6 9.8 -15.2C9.6 -14 9.2 -13.4 8.7 -13L10.2 -12.8C9.6 -11.8 9 -11.4 8.3 -11.2L9.8 -10.6C8.8 -9.8 7.8 -9.5 6.8 -9.4L7.8 -8.6C5.8 -8 3.6 -6.9 1.6 -5.6Z\"/></g><path class=\"g\" d=\"M-1.4 0L1.4 0L1.8 -3C2.2 -5 1.9 -7 1.1 -8.4C1.6 -9.3 1.5 -10.6 .5 -11.3C-.6 -12 -2 -11.6 -2.6 -10.8C-3.4 -11 -4.4 -10.7 -4.7 -9.7C-4.3 -10 -3.7 -9.9 -3.2 -9.4C-2.7 -9 -2.1 -8.7 -1.5 -8.6C-2.1 -7 -2.2 -5 -1.9 -3Z\"/><circle class=\"pf\" cx=\"-1.3\" cy=\"-10.4\" r=\".35\"/><path class=\"t\" d=\"M-2 -1.5L-2.6 .8M2 -1.5L2.6 .8\"/>",
  "rat": "<g class=\"yg-tail\"><path class=\"g\" d=\"M.6 -.6C2.4 -.4 3.4 -1.8 3.2 -3.6C3 -5.2 3.8 -6.6 5 -6.6C4.4 -5.6 4.4 -4.6 4.6 -3.4C4.9 -1.4 3.2 .6 .8 .4Z\"/></g><path class=\"g\" d=\"M-.8 0C-1.4 -1.4 -1.4 -3 -.9 -4.2C-.6 -5 -.6 -5.6 -1 -6.2C-1.2 -6.8 -.9 -7.4 -.3 -7.5C.3 -7.6 .8 -7.2 .9 -6.6C1.4 -6.2 1.4 -5.4 1 -4.8C1.4 -3.6 1.4 -1.6 .8 0Z\"/><path class=\"l\" d=\"M.3 -7.4L.5 -8.2M-1 -3.4L-1.8 -2.8\"/><circle class=\"pf\" cx=\"-.2\" cy=\"-6.7\" r=\".25\"/>",
  "nid": "<path class=\"g\" d=\"M-9.3 -0.4L-9.5 -0.2L-9.7 0L-10.1 0.2L-10.5 0.5L-10.9 0.8L-11.3 1.1L-11.7 1.5L-12.1 1.9L-12.3 2.4L-12.5 2.8L-12.7 3.2L-12.8 3.7L-12.9 4.2L-12.9 4.6L-12.9 5.1L-12.9 5.5L-12.7 6L-12.5 6.4L-12.3 6.8L-12 7.2L-11.7 7.5L-11.4 7.8L-11 8L-10.7 8.2L-10.2 8.3L-9.8 8.3L-9.4 8.3L-9 8.2L-8.6 8.1L-8.3 7.9L-8 7.8L-7.7 7.6L-7.5 7.3L-7.3 7L-7.3 6.7L-7.3 6.4L-7.3 6.2L-7.3 5.9L-7.3 5.8L-7.3 5.6L-7.9 5.6L-7.9 5.7L-8 5.9L-8 6.1L-8 6.3L-8.1 6.5L-8.2 6.7L-8.2 6.8L-8.3 6.8L-8.4 6.9L-8.7 7L-8.9 7L-9.2 7.1L-9.5 7.1L-9.8 7.1L-10 7L-10.1 7L-10.3 6.9L-10.4 6.7L-10.6 6.5L-10.8 6.2L-10.9 6L-11 5.7L-11.1 5.5L-11.1 5.3L-11.1 5.1L-11.1 4.8L-11 4.5L-10.9 4.2L-10.8 4L-10.6 3.7L-10.5 3.5L-10.3 3.3L-10.2 3.1L-9.9 3L-9.6 2.8L-9.2 2.6L-8.8 2.4L-8.5 2.2L-8.1 2.1L-7.9 2Z\"/><g class=\"yg-nid-head\"><path class=\"g\" d=\"M1 -1.4C-.6 -2.6 -2.6 -3.4 -4.6 -3.4C-6.4 -3.4 -7.8 -2.8 -8.8 -1.8C-9.6 -1 -9.8 .2 -9.2 1.2C-8.6 2.2 -7.2 2.6 -5.6 2.4C-3.8 2.2 -1.6 1.6 .6 .8L-2.4 .2L.8 -.6Z\"/><path class=\"l\" d=\"M-6.8 -3L-8.6 -5.6M-5 -3.4L-5.8 -6.2M-.4 -.9L-.9 -.2L-1.4 -.8M-.4 .6L-.9 0L-1.4 .5\"/><circle class=\"pf\" cx=\"-5.2\" cy=\"-1.4\" r=\".45\"/></g>",
  "eagleAt": [
    -4,
    -77
  ],
  "ratAt": [
    0.6,
    -9
  ],
  "nidAt": [
    -40.5,
    5
  ],
  "fork": [
    304,
    336
  ],
  "label": [
    318,
    361
  ],
  "labelBox": [
    318,
    355,
    359,
    363
  ],
  "crownSeed": 7,
  "layerSeed": 20,
  "leafSeed": 33,
  "leafCount": 46,
  "crownBump": [
    0.42,
    0.16
  ],
  "layerBump": [
    0.38,
    0.15
  ],
  "layerAlpha": 0.75,
  "clearance": 6,
  "groveReach": 13,
  "labelGap": 2,
  "starInset": 5,
  "starSame": 7,
  "starOther": 4,
  "eagleClear": 6,
  "tube": {
    "seg": 8,
    "power": 0.8,
    "mult": 16807,
    "mod": 2147483647
  },
  "life": {
    "seed": 73,
    "ratEvery": [
      9,
      15
    ],
    "climb": 0.9,
    "pause": 1.2,
    "tail": 15,
    "tailRoot": [
      0.8,
      0
    ],
    "eagleEvery": [
      6,
      10
    ],
    "stretch": 0.7,
    "wingX": 1.1,
    "wingY": [
      0.78,
      0.95
    ],
    "gnawEvery": 2.5,
    "gnawTime": 0.3,
    "gnaw": 0.5,
    "flight": 2.6,
    "flightStops": [.1,.2,.8,.9],
    "rise": 6,
    "radius": 16,
    "centre": 14,
    "flap": 4,
    "flapY": [
      0.6,
      1
    ]
  }
};
export const MARK = { k: 10, min: 14, max: 36, stand: 3, box: 400, centre: 200, radius: 176, rim: 20, boss: 54, bossLine: 16, highlight: [186,186,12,.55], shadow: [200,392,120,10,.35], planks: [-120,-72,-24,24,72,120], plankLine: 7, plankAlpha: .28, paintAlpha: .35, studs: 8, stud: 9, studLine: 5, quarters: 'M200 200L200 24A176 176 0 0 1 376 200ZM200 200L200 376A176 176 0 0 1 24 200Z', legend: [68,836,4.6,.9,1.2,.45] };
export const LABELS = { name: { unit: 9.5, floor: 10, cap: 1.6, phone: 7.5, phoneCap: 1.4 }, x: { unit: 8.5, floor: 10, cap: 1.6, phone: 7.5, phoneCap: 1.4 }, sub: { unit: 6.3, floor: 7.6, cap: 1.6, phone: 7, phoneCap: 1.8 }, small: { unit: 6.5, floor: 8, cap: 1.6, phone: 7, phoneCap: 1.8 }, legend: { unit: 6.5, floor: 8, cap: 1.6, phone: 7, phoneCap: 1.8 }, fade: [1.3,1.5], epsilon: .005, width: .56, ascent: .8, descent: .2, halo: 1.5, nameDY: -4, subDY: 4, xSubDY: 3.5, hmcSubDX: -4.4, subOffset: 9.5, xAt: [16,8], xSubAt: [16,17.5], kicker: [45,95], plate: [-3,-9,204,13], rule: [0,8,196], legendAt: [[80,840.5],[80,859.5],[151,840.5],[151,859.5]] };
export const WORLD = { scrim: [150,190,.85], card: { w:640, edge:32, cap:420, phoneShare:.82, phoneBottom:6, slack:2, gap:12, panelRadius:10, panelPad:16, crafts:340, title:26, titleWeight:800, titleGap:14, footGap:16, footMargin:18, topPad:8, topPadX:14 } };
