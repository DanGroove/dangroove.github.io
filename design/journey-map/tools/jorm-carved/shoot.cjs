const { open } = require('../review9/lib.cjs');
const { build } = require('./draw.cjs');
const DIR = '/home/user/dangroove.github.io/design/journey-map/dist/';
async function inject(a, opt, st, extra = {}) {
  const b = build(opt, st);
  await a.page.evaluate(({ b, extra }) => {
    document.querySelectorAll('.jx').forEach(e => e.remove());
    const NS = 'http://www.w3.org/2000/svg', mk = (html, parent, before) => { const g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'jx'); g.innerHTML = html; parent.insertBefore(g, before || null); };
    const ring = document.querySelector('.jg-ring'); ring.style.display = 'none'; mk(b.body, ring.parentElement);
    const f = document.getElementById('f-serpent'); [...f.children].forEach(c => { if (!c.matches('.hit,.touch-hit')) c.style.display = 'none'; }); mk(b.head, f.parentElement, f);
    const lab = [...document.querySelectorAll('svg#map text')].find(t => t.textContent === 'HERE BE DEADLINES'); if (lab) lab.setAttribute('transform', 'translate(0 -14)');
    let s = document.getElementById('jx-style'); if (!s) { s = document.createElement('style'); s.id = 'jx-style'; document.head.appendChild(s); }
    s.textContent = (extra.far ? '.jd{display:none}' : '') + (extra.css || '');
    if (extra.say) { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) if (/^(Jörmungandr, the|Shipped\. Poke)/.test(n.nodeValue.trim())) n.nodeValue = extra.say; }
    document.querySelectorAll('.jx-card').forEach(e => e.remove());
    if (extra.card) { const d = document.createElement('div'); d.className = 'jx-card'; d.innerHTML = extra.card.html; d.style.cssText = extra.card.css; document.body.appendChild(d); }
  }, { b, extra });
}
async function session({ w = 1920, h = 950, touch = false, dpr = 1, out }) { return open({ page: 'journey-map.html', dir: DIR, w, h, dpr, touch, query: '?beat=map', out: out || __dirname + '/shots/' }); }
module.exports = { inject, session };
if (require.main === module) (async () => {
  const which = (process.argv[2] || 'ABC').split('');
  const a = await session({ dpr: 2 });
  await a.run(7000);
  for (const k of which) { await inject(a, k, {}, { far: true }); await a.run(50); await a.shot('map-' + k, { clip: { x: 700, y: 30, width: 520, height: 760 } }); }
  await a.press('#mk-serpent'); await a.run(4500);
  for (const k of which) { await inject(a, k, { file: { at: [434, 90], name: ['final.pdf'] } }, { say: 'Jörmungandr, the revision loop. Poke him.' }); await a.run(50); await a.shot('focus-' + k, { clip: { x: 320, y: 110, width: 1400, height: 700 } }); }
  console.log(a.errors.slice(0, 5)); await a.close();
})();
