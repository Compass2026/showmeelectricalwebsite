/** Shared helper: a temporary tsconfig whose @brand alias points at `brand`. Returns its path; caller removes it. */
import { writeFileSync, existsSync } from "node:fs";
export function brandTsconfig(brand) {
  if (!existsSync(`brands/${brand}`)) throw new Error(`no such brand: brands/${brand}`);
  const tmp = `tsconfig.${brand}.tmp.json`;
  writeFileSync(tmp, JSON.stringify({ extends: "./tsconfig.json", compilerOptions: { paths: { "@/*": ["./*"], "@brand/*": [`./brands/${brand}/*`] }, incremental: false }, exclude: ["node_modules", ".next"] }, null, 2));
  return tmp;
}
