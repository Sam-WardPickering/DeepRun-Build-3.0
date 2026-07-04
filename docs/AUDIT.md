# The AI audit: how it works and how to test it

This document explains the audit feature end to end: what happens when a visitor clicks "Check my site", how the score is calculated, the security decisions behind it, and how to test it yourself.

## The flow, step by step

1. **The visitor types a URL** into the module on the homepage (`components/AuditModule.tsx`) and clicks "Check my site". The card enters a "scanning" state: the golden aurora shader fades in behind the content, the dot rows reset, and the big number shows a dash.

2. **The browser POSTs to `/api/audit`** with `{ "url": "whatever they typed" }`. The audit runs on the server, never in the browser - a browser can't fetch other people's websites directly (browsers block cross-site reads), and we don't want to expose scoring logic anyway.

3. **The API route (`app/api/audit/route.ts`) validates the input.** It adds `https://` if the visitor left the scheme off, rejects anything that isn't a valid http/https URL, and refuses private or internal addresses (see Security below).

4. **The route fetches the page** with a 10-second timeout, follows redirects, and reads at most 500 KB of HTML. If the site can't be reached, returns an error status, or isn't HTML, the visitor gets a plain-English error message.

5. **The scoring engine runs** (`lib/audit.mjs`). It parses the HTML and checks a list of signals in five categories. The response goes back as JSON.

6. **The module animates to the result**: each category's row of dots lights up left to right in proportion to its score (an echo of the particle field in the hero), the total counts up, the verdict line updates, and one "start here" finding per category appears underneath.

## How scoring works

Each category is a list of weighted signals. Pass a signal, earn its points. The category score is points earned out of points available, as a percentage. The total is the average of the five categories.

| Category | What it measures | Example signals (weight) |
|---|---|---|
| Message | Can a stranger tell what this business is, instantly? | Has an h1 (25) · sensible title length (20) · meta description (20) · concise h1 (15) · mobile viewport tag (20) |
| Action | Is there an obvious way to become a customer? | Tap-to-call tel: link (30) · contact form or contact page (25) · call-to-action wording (25) · visible email (20) |
| Content | Is there real, scannable content? | Reasonable word count (30) · at least two subheadings (20) · non-generic title (20) · meta description (15) · no lorem ipsum (15) |
| Foundations | Is the page built properly underneath? | Viewport tag (25) · nav + footer landmarks (20) · no skipped heading levels (15) · alt text on 80%+ of images (25) · declared language (15) |
| Credibility | Does the site read as looked-after and legitimate? | HTTPS (30) · copyright year within 2 years (20) · visible phone number (20) · privacy/terms link (15) · no insecure http:// resources (15) |

The "start here" finding for each category is simply the failed signal with the highest weight - i.e. the most valuable thing to fix.

**A note on the taxonomy.** These five names are deliberately our own. Site-audit tools conventionally converge on similar underlying checks (headings, CTAs, HTTPS, alt text - Lighthouse, SEO auditors and studio tools all measure variations of the same fundamentals), but category names and copy are expression, and ours must never mirror another studio's.

**Honest limitations.** This is a static HTML analysis. It doesn't execute JavaScript, so a fully client-rendered site (some Wix/Squarespace/React sites) may under-score because its content isn't in the initial HTML. It doesn't measure real load speed. Two good future upgrades, both documented here so we don't forget: pull real performance data from Google's PageSpeed Insights API, and have the Claude API write the qualitative findings from the page text. The engine's category structure was designed so those can slot in without changing the response shape.

## Security decisions

- **SSRF guard.** The route refuses to fetch private and internal addresses (`localhost`, `127.x`, `10.x`, `172.16-31.x`, `192.168.x`, `169.254.x` link-local/cloud-metadata, `.local`, `[::1]`). Without this, someone could use our server as a proxy to probe internal networks. The env var `AUDIT_ALLOW_LOCAL=1` disables the guard so the test script can audit fixture pages on 127.0.0.1 - never set it in production. Note this is a hostname-level guard; a hostile DNS setup could still resolve a public name to a private IP (DNS rebinding). Acceptable risk at our scale, worth revisiting if the tool gets popular.
- **Timeout and size cap.** 10 seconds and 500 KB, so a slow or enormous page can't tie up the server.
- **Only http/https.** No `file:`, no `ftp:`, nothing else.
- **The response contains no visitor data** and the route stores nothing. There is intentionally no email gate.

## How to test it

### 1. The automated engine tests (no server needed)

```bash
npm run test:audit
```

This starts a tiny local web server, serves two fixture pages from `test-fixtures/` (one deliberately terrible site, one deliberately good one), fetches them the same way the API route fetches real sites, scores both, and runs 14 assertions - including that the good site beats the bad site overall and in every category, that specific weaknesses are punished, and that findings and verdicts come back correctly. Exit code 0 means all passed, so it can run in CI.

### 2. The full end-to-end test (through the real API route)

```bash
AUDIT_ALLOW_LOCAL=1 npm run dev
```

Then in a second terminal, serve a fixture and audit it through the API:

```bash
npx serve test-fixtures -l 4310          # or any static server
curl -s -X POST http://localhost:3000/api/audit \
  -H "Content-Type: application/json" \
  -d '{"url":"http://127.0.0.1:4310/bad-site.html"}'
```

You should get JSON with `total`, `verdict`, `scores`, and five `findings`.

### 3. In the browser

Run `npm run dev`, open http://localhost:3000, scroll to the audit module, and enter any real website address. Watch for: the shader glow during the scan, bars animating to the result, the total counting up, and findings appearing. Try garbage input ("not a url"), an unreachable domain, and a private address ("localhost") - each should produce a friendly error, not a crash.

## Known engine behaviours

Non-visible elements (script, style, noscript, template) are stripped before any text is read. Without this, digit sequences inside JavaScript payloads on script-heavy sites could false-positive the phone number check and inflate word counts - this was caught by auditing our own homepage and fixed.

## Current test results

Last full round (pre-handover):

- **Engine tests:** all 14 assertions passing. Bad fixture 3/100 (it fails almost every signal by design); good fixture 100/100 when credited with HTTPS. Real-world sites land in between - partial passes are the normal case.
- **End-to-end through the production server:** both fixtures audited successfully via `POST /api/audit`. Correctly detected that the fixture server runs plain http and docked the good site's credibility score (94 total, credibility 70) - the https signal reflects how the page was actually served, after redirects.
- **Error handling:** garbage input, empty input, and an unreachable domain each returned a friendly JSON error, no crashes.
- **SSRF guard:** with `AUDIT_ALLOW_LOCAL` unset, requests to `localhost` and to the cloud metadata address `169.254.169.254` were both refused.
- **Copy rules:** `npm run test:copy` passing (no em dashes, no city names).
- **Type check and production build:** `tsc --noEmit` clean; `next build` compiles with all four article pages statically generated.

- **Self-audit:** running the engine against our own production homepage scores 90/100 (message 100, action 70, content 100, foundations 100, credibility 80). Both deductions come from having no phone number on the site - once a business number exists, adding a tap-to-call link takes the score to the high 90s.

One environment note: `next/font` downloads the Google fonts at build time, so the very first `npm run dev` or `npm run build` needs an internet connection. After that the fonts are cached and self-hosted.
