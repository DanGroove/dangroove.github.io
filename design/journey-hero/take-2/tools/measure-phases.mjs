// A failed playback cannot skip the scan or the sheets. Kept separate so this can be tested without a browser.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
export function reportError(error) {
  const message = String(error?.message ?? error);
  return message.replace(/(?:[A-Za-z]:[\\/]|\/)(?:[^\s<>"'`|():;,]+[\\/])*[^\s<>"'`|():;,]*/g, value => path.relative(repository, value).split(path.sep).join('/'));
}
export async function measurePhases(report, sizes, playback, scan, sheets) {
  report.phases ??= [];
  async function phase(name, work) {
    try { await work(); report.phases.push({ name, complete: true }); }
    catch (error) { report.phases.push({ name, complete: false, error: reportError(error) }); }
  }
  for (const size of sizes) await phase('playback ' + size.join('x'), () => playback(...size));
  await phase('flicker scan', scan);
  await phase('sheets', sheets);
  report.playbackIncomplete = report.phases.some(p => p.name.startsWith('playback ') && !p.complete);
  return report.phases.every(p => p.complete);
}
