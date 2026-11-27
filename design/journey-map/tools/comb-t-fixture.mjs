import {sBrowser,gRoot,save,begin,end} from './comb-s-fixture.mjs';
export {gRoot,save,begin,end};
export async function tBrowser(){const b=await sBrowser();return b;}
export const boxScript=`e=>{const r=e.getBoundingClientRect();return[r.left,r.top,r.right,r.bottom]}`;
