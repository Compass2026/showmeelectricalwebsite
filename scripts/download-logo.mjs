/**
 * Downloads the white Show Me Electrical logo into /public at build time.
 * Runs as `prebuild` (works on Vercel, where outbound network is open).
 * Skips silently if the file already exists or the network is unavailable,
 * so a committed copy of public/logo-white.png always wins.
 */
import { existsSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const LOGO_URL =
  "https://showmeelectrical.com/wp-content/uploads/2024/08/Show-me-electric-white-logo-4.png";

const dest = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "logo-white.png"
);

if (existsSync(dest)) {
  console.log("[download-logo] public/logo-white.png already exists — skipping.");
  process.exit(0);
}

try {
  const res = await fetch(LOGO_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
  console.log(`[download-logo] Saved logo (${buf.length} bytes) to public/logo-white.png`);
} catch (err) {
  console.warn(
    `[download-logo] Could not download logo (${err.message}). ` +
      "The site will fall back to the text wordmark. " +
      "Download it manually to public/logo-white.png if needed."
  );
}
