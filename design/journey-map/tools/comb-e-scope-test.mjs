// The E4 drawing belongs in art; hoard data permits position changes only.
import {strict as assert} from 'node:assert';
import {FIND_PLAY,FIND_COPY} from '../data.mjs';
import {bigMap} from '../art.mjs';
assert.equal(FIND_PLAY.hoard.scratchPath,'M-23 2H23M-19 2Q-1 -13 18 2M6 -4L9 -17M7 -17L8 -22L14 -21L13 -16ZM4 -5L10 -4L8 1L5 0ZM-27 3L-25 0L-22 3ZM23 4L26 0L29 3ZM-16 5L-13 3L-10 5Z','protected hoard drawing data must retain its pre-E value');
const original=[[208,266],[404,304],[372,368],[452,558],[228,728]];
FIND_COPY.hoards.forEach((h,i)=>assert.ok(Math.hypot(h.x-original[i][0],h.y-original[i][1])<=16,'E4 position allowance'));
const svg=bigMap().finds;let hash=2166136261;for(const ch of svg)hash=Math.imul(hash^ch.charCodeAt(0),16777619);
assert.equal(svg.length,46701);assert.equal(hash>>>0,4072679966,'F3/F6/F9 and G9 authorized drawing snapshot');
console.log('ok: original hoard drawing data retained; all hoard moves <=16 map units; F3/F6/F9 and G9 finds SVG snapshot '+svg.length+'/'+(hash>>>0));
