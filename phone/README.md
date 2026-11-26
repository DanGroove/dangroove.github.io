# Phone testing kit (Dan's Galaxy S24 Ultra over Wireless debugging)

Tools for testing the site in Chrome on Dan's real Android phone from his Windows PC.
Nothing here is part of the site. Results and screenshots stay on the PC under `D:\phone-tests`.

## Setup on the PC (done 2026-11-26)
- adb: `D:\android\platform-tools\adb.exe` (Google platform-tools 37.0.3, signed by Google LLC). Not on PATH.
- The phone is paired over Wi-Fi (Settings > Developer options > Wireless debugging). adb finds it by mDNS:
  `adb mdns services` lists `_adb-tls-connect._tcp` with the current IP and port. `adb devices -l` shows it as
  `10.0.0.178:44099` and/or `adb-R3CX20JWVJK-yvvc5T._adb-tls-connect._tcp` (same phone). The port changes when
  Wireless debugging is turned off and on; mDNS auto-connect usually reconnects by itself.
- If pairing is ever lost: Dan opens Wireless debugging > Pair device with pairing code, then
  `adb pair <ip>:<pairing port> <code>` (mDNS also lists `_adb-tls-pairing._tcp` while the popup is open).

## Reaching the phone's Chrome
- Serve pages from the PC on 127.0.0.1 only (no firewall prompt): `node serve.mjs` serves this folder on port 8765.
- `adb -s SERIAL reverse tcp:8765 tcp:8765` lets phone Chrome open `http://localhost:8765/<page>.html`.
- Open a page: `adb -s SERIAL shell am start -a android.intent.action.VIEW -d http://localhost:8765/fps.html -n com.android.chrome/com.google.android.apps.chrome.Main`
- DevTools: `adb -s SERIAL forward tcp:9222 localabstract:chrome_devtools_remote`, then `http://127.0.0.1:9222/json/list`
  gives each tab's websocket (Chrome DevTools Protocol). Remove forwards when done.
- Real taps: `adb -s SERIAL shell input tap X Y` in screen pixels (calibrate from CSS pixels first). Pinch needs
  CDP `Input.dispatchTouchEvent` with two touch points.
- Screenshots: `adb shell screencap -p /data/local/tmp/x.png` then `adb pull` (PowerShell `>` corrupts binary output).
- Displayed frames: `adb shell dumpsys SurfaceFlinger --timestats -clear -enable`, run the gesture, `-dump`, `-disable`.

## What the first runs showed (2026-11-26, Chrome 158, Android 17, Adaptive motion smoothness)
- Viewport: DPR 2.625, CSS 411x750 with Chrome's toolbar showing (screen 412x892). Device px = CSS screen px x 2.625,
  and clientY = screenY - 92.95 CSS px (244 device px of status bar plus toolbar). Calibrate again if the toolbar hides.
- With no finger on the screen, Chrome runs pages at 60 Hz (rAF 60.1 fps; SurfaceFlinger 16 ms gaps). A single tap
  does not lift it (62.7 fps after a tap). A finger drag does: 120 Hz, Chrome about 105 fps over the window.
  So glides started by a tap top out at 60 fps in Chrome, while drags and pinches can reach 120. Dan views previews
  in the Claude app (Android WebView), which ran at 120 fps at rest in his recording.
- `dumpsys SurfaceFlinger --timestats` works without root. Chrome's layer is `com.android.chrome/ChromeChildSurface#N`,
  split into blocks by displayRefreshRate; the global presentToPresent histogram shows 8 ms (120 Hz) vs 16 ms (60 Hz).
- A tap on text opens Chrome's Touch to Search sheet; tap empty areas, or set user-select: none on test pages.

## Rules
- One session drives the phone at a time (two would fight over Chrome and skew timings).
- The phone must be unlocked with Chrome in front; Dan keeps it on the charger with Stay awake on during runs.
- Never try to unlock the phone or change its settings without Dan's say.

## Files
- `fps.html`: a live frames-per-second page (rAF) with a moving bar; records taps in `window.__fps`.
- `serve.mjs`: static server for this folder on 127.0.0.1:8765.
- `smoke.mjs`: reads frame timing, viewport, reduced motion and taps from fps.html over DevTools.
