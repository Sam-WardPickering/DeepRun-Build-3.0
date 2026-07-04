# Automated tests

## Quick start

One-time setup (downloads the test browser):

```bash
npx playwright install chromium
```

Then:

```bash
npm run test:e2e       # all tests, desktop + iPhone 13 viewports
npm run test:a11y      # accessibility scans only
npm run test:e2e:ui    # interactive mode with browser visible
npm run test:audit     # audit scoring engine (no browser needed)
npm run test:copy      # brand copy rules (no browser needed)
```

Playwright starts the dev server itself. If `npm run dev` is already running, it reuses it.

## What's covered

### homepage.spec.ts
- Headline renders with correct word spacing (regression guard)
- Hero copy frames care plan as optional (not bundled)
- Primary CTA scrolls to site check, nav CTA scrolls to contact
- Nav has aria-label for accessibility
- Manifesto words light up on scroll, copy frames care plan as optional
- Skip link present for keyboard users
- Footer contains email, privacy, and about links
- Footer year is current
- Pricing cards and resource cards render

### audit.spec.ts
- Example scores animate in on scroll
- Empty input, private addresses (localhost, 127.x, 10.x, 192.168.x, 169.254.x, ::1) all refused with friendly errors
- Non-URL input handled gracefully
- Enter key triggers audit
- Mocked successful check: scores render, five findings appear, contact nudge visible, nudge links to contact section
- Findings are diagnostic, not prescriptive (no free consulting)

### contact.spec.ts
- Submit disabled until name, email and message filled
- Phone field is optional
- Pricing CTA scrolls to contact with tier pre-selected
- All form inputs have accessible labels
- Contact reachable from audit findings nudge

### navigation.spec.ts
- Resources index lists all cards
- Article pages load, have external citations, back link works
- All four articles navigable
- Articles say "site check" not "audit" in visible text
- Privacy page has expected sections and NZ Privacy Act reference
- About page has expected content (experience, QA, care plan optional)
- About page links to site check and contact
- About reachable from nav
- Invalid routes return 404

### security.spec.ts
- SSRF guard: 13 private/internal addresses blocked
- Protocol blocking: file://, ftp://, javascript: all refused
- Input validation: empty, missing field, invalid JSON, extremely long URL
- Injection patterns: SQL injection strings, XSS payloads handled safely
- Response shape: errors are JSON not HTML, GET method rejected
- No raw input echoed in error messages

### accessibility.spec.ts
- axe-core WCAG 2.0/2.1 A/AA scan on all 8 pages
- Keyboard navigation: tab reaches links and buttons, no traps
- Article images have alt text (future-proofing)
- Manifesto unlit word contrast meets WCAG AA
- Focus indicators visible on interactive elements

## Documented exclusions

- The industries marquee (.marquee-zone) is excluded from axe scans:
  it is decorative, aria-hidden, and screen readers never encounter it.

## Reading a failure

Accessibility failures print the axe rule id, impact, help URL, and
offending HTML snippets into the terminal. The HTML report
(`playwright-report/`) has screenshots and traces for everything else.
Open it with `npx playwright show-report`.
