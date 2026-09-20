/**
 * One place that finds Chromium for every browser-driven QA script.
 *
 * Resolution order:
 *   1. CHROMIUM_PATH (an executable path)              — always honoured
 *   2. /opt/pw-browsers/chromium                         — the bundled build in Compass's runner
 *   3. common system installs (chromium, chromium-browser, google-chrome)
 * If none exists the script exits with setup instructions instead of a
 * stack trace. Run `node scripts/qa/browser-launch.mjs --check` to see
 * which executable would be used.
 */
import { existsSync } from "node:fs";
import { chromium } from "playwright-core";

const CANDIDATES = [
  process.env.CHROMIUM_PATH,
  "/opt/pw-browsers/chromium",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);

export const SETUP_HELP = `No Chromium executable found.
Set CHROMIUM_PATH to a Chromium/Chrome executable, e.g.
  npx playwright@1.56.1 install chromium   # then point CHROMIUM_PATH at the printed executable
  export CHROMIUM_PATH=/usr/bin/chromium   # or a system install
Checked: ${CANDIDATES.join(", ")}`;

export function resolveChromium() {
  if (process.env.CHROMIUM_PATH && !existsSync(process.env.CHROMIUM_PATH)) {
    throw new Error(`CHROMIUM_PATH is set to "${process.env.CHROMIUM_PATH}" but no file exists there.\n${SETUP_HELP}`);
  }
  const found = CANDIDATES.find((p) => existsSync(p));
  if (!found) throw new Error(SETUP_HELP);
  return found;
}

export async function launchChromium(options = {}) {
  return chromium.launch({ executablePath: resolveChromium(), ...options });
}

if (process.argv[1] && process.argv[1].endsWith("browser-launch.mjs")) {
  try {
    const exe = resolveChromium();
    const b = await launchChromium();
    console.log(`chromium: ${exe} (${b.version()})`);
    await b.close();
  } catch (e) {
    console.error(e.message);
    process.exit(2);
  }
}
