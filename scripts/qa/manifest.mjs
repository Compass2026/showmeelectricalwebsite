#!/usr/bin/env node
/** Route manifest for the active brand (COMPASS_BRAND, default showme): runs route-manifest.ts with the brand's alias. */
import { unlinkSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { brandTsconfig } from "./brand-tsconfig.mjs";
const brand = process.env.COMPASS_BRAND ?? "showme";
const tmp = brandTsconfig(brand);
const r = spawnSync("npx", ["tsx", "--tsconfig", tmp, "scripts/qa/route-manifest.ts"], { stdio: "inherit", env: { ...process.env, COMPASS_BRAND: brand } });
unlinkSync(tmp);
process.exit(r.status ?? 1);
