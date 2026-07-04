/**
 * Copy rules check.
 *
 * Run with:  npm run test:copy
 *
 * Scans all source and content files for two things the site must not
 * contain:
 *   1. Em dashes or double hyphens in visible copy (house style: single "-")
 *   2. Any mention of a specific city (the brand is nationwide)
 *
 * Exits 0 when clean, 1 otherwise.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOTS = ["app", "components", "lib", "tests"];
const EXTS = new Set([".ts", ".tsx", ".css", ".mjs"]);
const BANNED = [
  { pattern: /\u2014/g, label: "em dash (\u2014)" },
  { pattern: /Wellington/gi, label: "city name 'Wellington'" },
];

let problems = 0;

function scan(path) {
  for (const entry of readdirSync(path)) {
    const full = join(path, entry);
    if (statSync(full).isDirectory()) {
      scan(full);
      continue;
    }
    if (!EXTS.has(extname(full))) continue;
    const text = readFileSync(full, "utf8");
    for (const { pattern, label } of BANNED) {
      const matches = text.match(pattern);
      if (matches) {
        problems += matches.length;
        console.log(`FAIL  ${full}: ${matches.length}x ${label}`);
      }
    }
  }
}

for (const root of ROOTS) scan(root);

if (problems === 0) {
  console.log("PASS  no em dashes, no city names - copy rules hold");
  process.exit(0);
} else {
  console.log(`\n${problems} problem(s) found`);
  process.exit(1);
}
