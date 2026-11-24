// Run the existing read-only ORIGIN audit against a permitted local profile.
import {combBBrowser} from './comb-d-browser-test.mjs';
import {combDRun} from './comb-d-suite-test.mjs';
const b=await combBBrowser();
try{process.exitCode=await combDRun(['tools/origin-check.mjs','--cdp',b.url]);}finally{await b.close();}
