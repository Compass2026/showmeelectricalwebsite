#!/usr/bin/env node
/** Type-check against a brand: node scripts/qa/typecheck-brand.mjs harbor-lane */
import { unlinkSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { brandTsconfig } from "./brand-tsconfig.mjs";
const brand = process.argv[2] ?? process.env.COMPASS_BRAND ?? "showme";
const tmp = brandTsconfig(brand);
const r = spawnSync("npx", ["tsc", "--noEmit", "-p", tmp], { stdio: "inherit" });
unlinkSync(tmp);
console.log(r.status === 0 ? `typecheck ${brand}: OK` : `typecheck ${brand}: FAILED`);
process.exit(r.status ?? 1);
