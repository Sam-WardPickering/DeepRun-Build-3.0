/**
 * Audit engine test suite.
 *
 * Run with:  npm run test:audit
 *
 * What it does:
 *  1. Serves the two fixture pages (a deliberately bad site and a
 *     deliberately good one) from a local web server.
 *  2. Fetches them the same way the API route does.
 *  3. Runs the scoring engine on each and asserts the results make sense.
 *
 * Exits with code 0 when every assertion passes, 1 otherwise - so it can
 * run in CI.
 */

import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { auditPage, verdictFor } from "../lib/audit.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const PORT = 4310;

const pages = {
  "/bad": readFileSync(join(here, "../test-fixtures/bad-site.html"), "utf8"),
  "/good": readFileSync(join(here, "../test-fixtures/good-site.html"), "utf8"),
};

const server = createServer((req, res) => {
  const body = pages[req.url];
  if (!body) {
    res.writeHead(404);
    res.end("not found");
    return;
  }
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(body);
});

let passed = 0;
let failed = 0;

function assert(name, condition, detail = "") {
  if (condition) {
    passed++;
    console.log(`  PASS  ${name}`);
  } else {
    failed++;
    console.log(`  FAIL  ${name}${detail ? "  ->  " + detail : ""}`);
  }
}

function printResult(label, result) {
  console.log(`\n${label}: total ${result.total}/100  "${verdictFor(result.total)}"`);
  for (const [cat, score] of Object.entries(result.scores)) {
    const bar = "#".repeat(Math.round(score / 5)).padEnd(20, ".");
    console.log(`  ${cat.padEnd(11)} ${String(score).padStart(3)}  ${bar}`);
  }
}

server.listen(PORT, "127.0.0.1", async () => {
  console.log(`Fixture server on http://127.0.0.1:${PORT}\n`);

  // Fetch fixtures over HTTP, exactly like the API route fetches real sites.
  const badHtml = await (await fetch(`http://127.0.0.1:${PORT}/bad`)).text();
  const goodHtml = await (await fetch(`http://127.0.0.1:${PORT}/good`)).text();

  // The bad fixture is served over http (https: false); the good fixture
  // simulates a properly configured https site.
  const bad = auditPage({ html: badHtml, https: false });
  const good = auditPage({ html: goodHtml, https: true });

  printResult("BAD SITE", bad);
  printResult("GOOD SITE", good);
  console.log("\nAssertions:");

  // --- core behaviour ---
  assert("good site outscores bad site overall", good.total > bad.total,
    `good=${good.total} bad=${bad.total}`);
  assert("good site outscores bad in every category",
    Object.keys(good.scores).every((c) => good.scores[c] >= bad.scores[c]));
  assert("bad site lands in the bottom half", bad.total < 50, `got ${bad.total}`);
  assert("good site lands in the top third", good.total >= 67, `got ${good.total}`);

  // --- specific signals the fixtures were designed to trip ---
  assert("bad site is punished for missing h1", bad.scores.message < 60);
  assert("bad site is punished for no tel: link", bad.scores.action < 40);
  assert("bad site credibility reflects http + stale copyright", bad.scores.credibility < 40);
  assert("bad site content catches lorem ipsum + generic title", bad.scores.content < 60);
  assert("good site message is strong", good.scores.message >= 90);
  assert("good site action is strong", good.scores.action >= 90);
  assert("good site credibility is strong", good.scores.credibility >= 90);

  // --- findings ---
  assert("one finding per category", bad.findings.length === 5 && good.findings.length === 5);
  assert("bad site message finding mentions the heading problem",
    bad.findings.find((f) => f.category === "message").message.includes("heading"));

  // --- verdict copy ---
  assert("verdicts exist for all bands",
    [verdictFor(90), verdictFor(65), verdictFor(45), verdictFor(20)].every(
      (v) => typeof v === "string" && v.length > 10
    ));

  console.log(`\n${passed} passed, ${failed} failed`);
  server.close();
  process.exit(failed === 0 ? 0 : 1);
});
