# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: audit.spec.ts >> private address (127.0.0.1) is refused
- Location: tests\e2e\audit.spec.ts:30:5

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.audit-error')
Expected substring: "Private or internal"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.audit-error')

```

```yaml
- link "Skip to content":
  - /url: "#main"
- navigation "Main":
  - link "deeprun.":
    - /url: /
  - link "Site check":
    - /url: /#audit
  - link "Pricing":
    - /url: /#pricing
  - link "Resources":
    - /url: /resources
  - link "About":
    - /url: /about
  - link "Start a project →":
    - /url: /#contact
- main:
  - text: ●Web studio · New Zealand
  - heading "Websites that win work." [level=1]:
    - text: Websites that
    - emphasis: win
    - emphasis: work.
  - paragraph: Deep Run builds fast, sharp, fixed-price websites for New Zealand's trades, hospitality and local businesses. Add a care plan and we manage everything - so your site never breaks, never dates, never disappears.
  - button "Get your free site check →"
  - button "See pricing"
  - text: Scroll ●Why we exist
  - paragraph: Most local businesses are brilliant at what they do and let down by a website that isn't. We find the gap, show you exactly what better looks like, and build it fast at a fixed price. And if you want it looked after for good, that's exactly what our care plan is for.
  - text: ●AI site check
  - heading "How hard is your website working?" [level=2]
  - paragraph: Paste your address below and our AI reads the page the way a customer would. You get a score across five areas - what the site says, how easy it is to act, the words, the build underneath, and whether it earns trust - so you can see exactly where it's falling short.
  - textbox "Your website address":
    - /placeholder: yourdomain.co.nz
    - text: 127.0.0.1
  - button "Reading… →" [disabled]
  - paragraph: Free. Takes about 20 seconds. No email required.
  - text: 42 /100 Reading 127.0.0.1… message – action – content – foundations – credibility – ●Pricing
  - heading "Fixed price. No surprises. Live in days." [level=2]
  - paragraph: Every tier includes design, build, mobile-first QA and launch. Add the care plan and we host, maintain and update it for you - we're your web people.
  - heading "Starter" [level=3]
  - text: FROM $800 NZD
  - list:
    - listitem: 1-3 pages, mobile-first
    - listitem: Contact & click-to-call
    - listitem: Live within a week
  - link "Get started →":
    - /url: "#contact"
  - text: Most popular
  - heading "Business" [level=3]
  - text: FROM $1,500 NZD
  - list:
    - listitem: Up to 8 pages
    - listitem: Forms & enquiry routing
    - listitem: SEO foundations
  - link "Get started →":
    - /url: "#contact"
  - heading "Enhanced" [level=3]
  - text: FROM $3,000 NZD
  - list:
    - listitem: Booking systems
    - listitem: E-commerce lite
    - listitem: Custom features
  - link "Get started →":
    - /url: "#contact"
  - heading "Care plan" [level=3]
  - text: $150-200 / MONTH
  - list:
    - listitem: Hosting & domain
    - listitem: Monthly updates
    - listitem: Backups & security
  - link "Add to any build →":
    - /url: "#contact"
  - text: ●Resources & case studies
  - heading "What we've learned, written down." [level=2]
  - paragraph: Plain-English guides on what actually makes a website earn its keep - with the research to back it up.
  - link "●Resource Five signs your website is quietly costing you work":
    - /url: /resources/five-signs-your-website-is-costing-you-work
    - text: ●Resource
    - heading "Five signs your website is quietly costing you work" [level=3]
  - link "●Resource Why accessibility matters for every local business":
    - /url: /resources/why-accessibility-matters-for-local-business
    - text: ●Resource
    - heading "Why accessibility matters for every local business" [level=3]
  - 'link "●Resource Speed, trust and Google: what actually moves the needle"':
    - /url: /resources/speed-trust-and-google
    - text: ●Resource
    - 'heading "Speed, trust and Google: what actually moves the needle" [level=3]'
  - link "●Resource What good UX looks like on a trade business website":
    - /url: /resources/what-good-ux-looks-like-on-a-trade-website
    - text: ●Resource
    - heading "What good UX looks like on a trade business website" [level=3]
  - text: ●Case study
  - heading "Coming soon - our first client stories, told with real numbers" [level=3]
  - text: ●Get in touch
  - heading "Let's talk about your site" [level=2]
  - paragraph: Tell us a bit about your business and what you need. We respond to every enquiry within 24 hours - usually much faster.
  - link "Email hello@deeprun.co.nz":
    - /url: mailto:hello@deeprun.co.nz
  - text: Your name
  - textbox "Your name":
    - /placeholder: Jane Smith
  - text: Email
  - textbox "Email":
    - /placeholder: jane@example.co.nz
  - text: Phone (optional)
  - textbox "Phone (optional)":
    - /placeholder: 021 123 4567
  - text: What do you need?
  - textbox "What do you need?":
    - /placeholder: Tell us about your business and what you're looking for - a new site, a rebuild, or just some advice.
  - button "Send enquiry →" [disabled]
- contentinfo:
  - text: deeprun. ●Aotearoa, New Zealand
  - paragraph: Ready when you are.
  - link "hello@deeprun.co.nz →":
    - /url: mailto:hello@deeprun.co.nz
  - navigation "Footer":
    - link "Site check":
      - /url: /#audit
    - link "Pricing":
      - /url: /#pricing
    - link "Resources":
      - /url: /resources
    - link "Contact":
      - /url: /#contact
    - link "About":
      - /url: /about
    - link "Privacy":
      - /url: /privacy
  - text: © 2026 Deep Run. All rights reserved. Fast, sharp, fixed-price websites.
- alert
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | test.beforeEach(async ({ page }) => {
  4   |   await page.goto("/");
  5   |   await page.locator("#audit").scrollIntoViewIfNeeded();
  6   | });
  7   | 
  8   | test("example scores animate in when scrolled into view", async ({ page }) => {
  9   |   await expect(page.locator(".score-num")).not.toHaveText("–", {
  10  |     timeout: 5_000,
  11  |   });
  12  |   await expect(page.locator(".bar-row")).toHaveCount(5);
  13  | });
  14  | 
  15  | test("empty input shows a friendly error", async ({ page }) => {
  16  |   await page.getByRole("button", { name: /check my site/i }).click();
  17  |   await expect(page.locator(".audit-error")).toContainText(
  18  |     "enter a website address"
  19  |   );
  20  | });
  21  | 
  22  | test("private address (localhost) is refused", async ({ page }) => {
  23  |   await page.getByLabel("Your website address").fill("localhost");
  24  |   await page.getByRole("button", { name: /check my site/i }).click();
  25  |   await expect(page.locator(".audit-error")).toContainText(
  26  |     "Private or internal"
  27  |   );
  28  | });
  29  | 
  30  | test("private address (127.0.0.1) is refused", async ({ page }) => {
  31  |   await page.getByLabel("Your website address").fill("127.0.0.1");
  32  |   await page.getByRole("button", { name: /check my site/i }).click();
> 33  |   await expect(page.locator(".audit-error")).toContainText(
      |                                              ^ Error: expect(locator).toContainText(expected) failed
  34  |     "Private or internal"
  35  |   );
  36  | });
  37  | 
  38  | test("cloud metadata address (169.254.169.254) is refused", async ({ page }) => {
  39  |   await page.getByLabel("Your website address").fill("169.254.169.254");
  40  |   await page.getByRole("button", { name: /check my site/i }).click();
  41  |   await expect(page.locator(".audit-error")).toContainText(
  42  |     "Private or internal"
  43  |   );
  44  | });
  45  | 
  46  | test("private address (10.0.0.1) is refused", async ({ page }) => {
  47  |   await page.getByLabel("Your website address").fill("10.0.0.1");
  48  |   await page.getByRole("button", { name: /check my site/i }).click();
  49  |   await expect(page.locator(".audit-error")).toContainText(
  50  |     "Private or internal"
  51  |   );
  52  | });
  53  | 
  54  | test("private address (192.168.1.1) is refused", async ({ page }) => {
  55  |   await page.getByLabel("Your website address").fill("192.168.1.1");
  56  |   await page.getByRole("button", { name: /check my site/i }).click();
  57  |   await expect(page.locator(".audit-error")).toContainText(
  58  |     "Private or internal"
  59  |   );
  60  | });
  61  | 
  62  | test("non-URL input is handled gracefully", async ({ page }) => {
  63  |   await page.getByLabel("Your website address").fill("not a url %%%");
  64  |   await page.getByRole("button", { name: /check my site/i }).click();
  65  |   await expect(page.locator(".audit-error")).toBeVisible();
  66  | });
  67  | 
  68  | test("enter key triggers the audit", async ({ page }) => {
  69  |   await page.getByLabel("Your website address").fill("localhost");
  70  |   await page.getByLabel("Your website address").press("Enter");
  71  |   await expect(page.locator(".audit-error")).toBeVisible({ timeout: 5_000 });
  72  | });
  73  | 
  74  | test("successful check renders scores, findings and contact nudge", async ({
  75  |   page,
  76  | }) => {
  77  |   await page.route("**/api/audit", (route) =>
  78  |     route.fulfill({
  79  |       status: 200,
  80  |       contentType: "application/json",
  81  |       body: JSON.stringify({
  82  |         url: "https://example.co.nz",
  83  |         https: true,
  84  |         total: 62,
  85  |         verdict: "Solid bones, but real opportunities are being left on the table.",
  86  |         scores: {
  87  |           message: 80,
  88  |           action: 45,
  89  |           content: 70,
  90  |           foundations: 60,
  91  |           credibility: 55,
  92  |         },
  93  |         findings: [
  94  |           { category: "message", message: "Looking solid here." },
  95  |           { category: "action", message: "No way for visitors to call." },
  96  |           { category: "content", message: "Content is thin." },
  97  |           { category: "foundations", message: "Missing structural elements." },
  98  |           { category: "credibility", message: "No phone number visible." },
  99  |         ],
  100 |       }),
  101 |     })
  102 |   );
  103 | 
  104 |   await page.getByLabel("Your website address").fill("example.co.nz");
  105 |   await page.getByRole("button", { name: /check my site/i }).click();
  106 | 
  107 |   await expect(page.locator(".score-num")).toHaveText("62", { timeout: 8_000 });
  108 |   // Five findings plus the "get in touch" nudge
  109 |   await expect(page.locator(".finding")).toHaveCount(6);
  110 |   // The nudge links to contact
  111 |   await page.getByRole("link", { name: /get in touch/i }).click();
  112 |   await expect(page.locator("#contact")).toBeInViewport();
  113 | });
  114 | 
  115 | test("findings do not contain prescriptive technical advice", async ({
  116 |   page,
  117 | }) => {
  118 |   await page.route("**/api/audit", (route) =>
  119 |     route.fulfill({
  120 |       status: 200,
  121 |       contentType: "application/json",
  122 |       body: JSON.stringify({
  123 |         url: "https://bad.example",
  124 |         https: false,
  125 |         total: 22,
  126 |         verdict: "Working against you.",
  127 |         scores: { message: 20, action: 10, content: 30, foundations: 25, credibility: 15 },
  128 |         findings: [
  129 |           { category: "message", message: "The page doesn't have a clear main heading." },
  130 |           { category: "action", message: "There's no way for mobile visitors to call." },
  131 |           { category: "content", message: "The amount of text is working against you." },
  132 |           { category: "foundations", message: "The page isn't configured for mobile." },
  133 |           { category: "credibility", message: "The site isn't secure." },
```