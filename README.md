# Deep Run

The website for Deep Run: fixed-price, managed websites for New Zealand trades, hospitality and local businesses.

This README explains what everything is and how it works, in plain terms. If you can run two commands in a terminal, you can run this project.

## Getting started

You need [Node.js](https://nodejs.org) version 20 or newer installed. Then, from this folder:

```bash
npm install    # downloads the project's dependencies (one-time)
npm run dev    # starts the site at http://localhost:3000
```

Open http://localhost:3000 in your browser. Edit any file and the page updates automatically.

Other commands:

```bash
npm run build       # production build (also catches type errors)
npm run start       # serve the production build
npm run test:audit  # test the audit scoring engine (see docs/AUDIT.md)
npm run test:copy   # check the copy rules (no em dashes, no city names)
```

## What's in each folder

```
app/                  The pages. Next.js turns each folder here into a URL.
  page.tsx            The homepage.
  layout.tsx          Wraps every page: loads fonts, sets metadata, skip link.
  globals.css         All the styling. Colours and fonts are set once at the top.
  api/audit/route.ts  The audit API endpoint (POST /api/audit).
  privacy/            The plain-English privacy page.
  resources/          The resources index page and individual article pages.

components/           Reusable pieces of the page. One file per piece.
lib/                  Shared logic and content (not visual).
  audit.mjs           The audit scoring engine. Plain JavaScript, heavily commented.
  articles.ts         Every resource article, written as data.

scripts/              Test scripts, run with npm run test:*.
test-fixtures/        Two sample web pages (one bad, one good) used by the tests.
docs/                 Deeper documentation (start with AUDIT.md).
```

## How each part of the site works

**The hero (components/Hero.tsx + ParticleField.tsx).** The background is a grid of about 5,000 dots drawn with Three.js. A slow wave ripples through them constantly, and dots near your cursor lift up and turn gold. The headline words rise in one by one on load. If a visitor's system asks for reduced motion, all animation stops automatically.

**The manifesto (components/Manifesto.tsx).** A paragraph where words start dim and light up as you scroll past. Key words (marked with asterisks in the text constant at the top of the file) light up gold. To change the text or which words are gold, edit that one constant.

**The AI site check (components/AuditModule.tsx + app/api/audit/route.ts + lib/audit.mjs).** A visitor types their website address and gets a score out of 100 across five categories (message, action, content, foundations, credibility), each shown as a row of dots that lights up in proportion to the score, with one "start here" finding per category. Full explanation, including how scoring works and how to test it: **docs/AUDIT.md**.

**The marquee (components/Marquee.tsx).** The strip of industry names that scrolls sideways. It drifts on its own and speeds up (and skews) when you scroll fast.

**Pricing (components/Pricing.tsx + TiltCard.tsx).** The tier cards tilt in 3D toward your cursor with a soft light glare. Prices and features are a plain list at the top of Pricing.tsx - edit them there.

**Resources (lib/articles.ts + app/resources/).** Every article lives in `lib/articles.ts` as data: title, excerpt, and body. To add an article, copy an existing entry, change the fields, and give it a unique `slug` (the URL) and `seed` (any number - it generates the little dot-pattern thumbnail). The site picks it up automatically. House rules for articles: no em dashes (use "-"), and every statistic must link to the primary source it came from.

**Buttons.** Every CTA uses the `.pill` class from globals.css. The hover language is deliberately minimal: the arrow slides right and the surface brightens very slightly. Ghost (outlined) pills warm to gold. Nothing moves, nothing glows - pure CSS, no component needed.

**The power-up system (components/DotObserver.tsx + [data-pw] in globals.css).** As the visitor scrolls, the page activates in stages: section label dots fill gold with a single pulse once well within view; cards flicker on like a filament catching, and their contents rise in with staggered delays (--pw-delay). One component runs two IntersectionObservers and renders nothing itself. Engineering rule worth knowing: reveals are CSS animations on the independent `translate` property - never `transition` or `transform` - so they can never collide with hover effects like the tilt cards or resource card lifts. Reduced-motion users and no-JS visitors see everything immediately.

**Favicon (app/icon.svg).** The browser tab icon: a gold dot with ripple rings on graphite - a stone dropped into deep water. Next.js serves any `app/icon.svg` automatically; no config needed.

**Contact (components/Contact.tsx).** The enquiry form at the bottom of the homepage. It opens the visitor's email app with their message pre-filled (a mailto link), so no backend is needed yet. When enquiry volume justifies it, swap the `handleSubmit` function for a POST to an API route that forwards to the inbox - the form itself won't need to change. Pricing card CTAs scroll here and pre-select the tier.

**Privacy (app/privacy/page.tsx).** A plain-English privacy page, linked from the footer. If the site ever starts collecting anything new, update this page to match.

## Design system

All colours live at the top of `app/globals.css` as CSS variables. The palette is deliberately small: warm near-black (`--bg`), bone text (`--ink`), and one gold accent (`--gold`) used sparingly. Fonts (Fraunces for display, Inter for body, IBM Plex Mono for labels) are loaded in `app/layout.tsx` via `next/font`, which self-hosts them - no requests to Google at runtime.

## Deploying

The project is a standard Next.js app. On Vercel: import the repo, keep the defaults, deploy. No environment variables are required. One optional variable exists for local testing (`AUDIT_ALLOW_LOCAL`, explained in docs/AUDIT.md) - never set it in production.

## House rules

- Single hyphens, never em dashes, in all copy.
- No city names in copy - the brand is nationwide.
- Every statistic in an article links to its primary source.
- Case studies are only published when they describe real clients with real numbers.

`npm run test:copy` enforces the first two automatically.
