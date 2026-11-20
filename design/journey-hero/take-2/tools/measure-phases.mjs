// A failed playback cannot skip the scan or the sheets. Kept separate so this can be tested without a browser.
export async function measurePhases(report, sizes, playback, scan, sheets) {
  report.phases ??= [];
  async function phase(name, work) {
    try { await work(); report.phases.push({ name, complete: true }); }
    catch (error) { report.phases.push({ name, complete: false, error: error.stack || String(error) }); }
  }
  for (const size of sizes) await phase('playback ' + size.join('x'), () => playback(...size));
  await phase('flicker scan', scan);
  await phase('sheets', sheets);
  report.playbackIncomplete = report.phases.some(p => p.name.startsWith('playback ') && !p.complete);
  return report.phases.every(p => p.complete);
}
