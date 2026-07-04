# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage.spec.ts >> nav uses Site Check casing
- Location: tests\e2e\homepage.spec.ts:125:5

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: locator('.nav-links').getByRole('link', { name: 'Site Check' })
Expected: "Site Check"
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toHaveText" with timeout 10000ms
  - waiting for locator('.nav-links').getByRole('link', { name: 'Site Check' })

```

```yaml
- link "Skip to content":
  - /url: "#main"
- navigation "Main":
  - link "deeprun.":
    - /url: /
  - link "Start a project →":
    - /url: /#contact
- main:
  - text: ● Web studio · New Zealand
  - heading "Websites that win work." [level=1]:
    - text: Websites that
    - emphasis: win
    - emphasis: work.
  - paragraph: Deep Run builds fast, sharp, fixed-price websites for New Zealand's trades, hospitality and local businesses. Live in days, built to last - and looked after for as long as you want us around.
  - button "Get your free site check →"
  - button "See pricing"
  - text: Scroll ● Why we exist
  - paragraph: Most local businesses are brilliant at what they do and let down by a website that isn't. We find the gap, show you exactly what better looks like, and build it fast at a fixed price.
  - text: ● AI site check
  - heading "How hard is your website working?" [level=2]
  - paragraph: Paste your address below and our AI reads the page the way a customer would. You get a score across five areas - what the site says, how easy it is to act, the words, the build underneath, and whether it earns trust - so you can see exactly where it's falling short.
  - textbox "Your website address":
    - /placeholder: yourdomain.co.nz
  - button "Check my site →"
  - paragraph: Free. Takes about 20 seconds. No email required.
  - text: – /100 Example result - run your own site to see where it stands. message 48 action 35 content 51 foundations 44 credibility 32 ● Pricing
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
  - text: ● Resources & case studies
  - heading "What we've learned, written down." [level=2]
  - paragraph: Plain-English guides on what actually makes a website earn its keep - with the research to back it up.
  - link "● Resource Five signs your website is quietly costing you work":
    - /url: /resources/five-signs-your-website-is-costing-you-work
    - text: ● Resource
    - heading "Five signs your website is quietly costing you work" [level=3]
  - link "● Resource Why accessibility matters for every local business":
    - /url: /resources/why-accessibility-matters-for-local-business
    - text: ● Resource
    - heading "Why accessibility matters for every local business" [level=3]
  - 'link "● Resource Speed, trust and Google: what actually moves the needle"':
    - /url: /resources/speed-trust-and-google
    - text: ● Resource
    - 'heading "Speed, trust and Google: what actually moves the needle" [level=3]'
  - link "● Resource What good UX looks like on a trade business website":
    - /url: /resources/what-good-ux-looks-like-on-a-trade-website
    - text: ● Resource
    - heading "What good UX looks like on a trade business website" [level=3]
  - text: ● Case study
  - heading "Coming soon - our first client stories, told with real numbers" [level=3]
  - text: ● Get in touch
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
  - text: deeprun. ● Aotearoa, New Zealand
  - paragraph: Ready when you are.
  - link "hello@deeprun.co.nz →":
    - /url: mailto:hello@deeprun.co.nz
  - navigation "Footer":
    - link "Site Check":
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
  28  | test("nav has aria-label for accessibility", async ({ page }) => {
  29  |   await expect(page.locator('nav[aria-label="Main"]')).toBeVisible();
  30  | });
  31  | 
  32  | test("manifesto words light up on scroll", async ({ page }) => {
  33  |   const firstWord = page.locator(".manifesto .w").first();
  34  |   await page.locator(".manifesto p").scrollIntoViewIfNeeded();
  35  |   await page.mouse.wheel(0, 80);
  36  |   await expect(firstWord).toHaveClass(/lit/, { timeout: 5_000 });
  37  | });
  38  | 
  39  | test("manifesto copy never implies bundled management", async ({ page }) => {
  40  |   const manifesto = page.locator(".manifesto p");
  41  |   await expect(manifesto).toContainText("fixed price");
  42  |   await expect(manifesto).not.toContainText("managed for good");
  43  | });
  44  | 
  45  | test("skip link is present for keyboard users", async ({ page }) => {
  46  |   const skipLink = page.locator(".skip-link");
  47  |   await expect(skipLink).toHaveAttribute("href", "#main");
  48  | });
  49  | 
  50  | test("footer contains email, privacy link, and about link", async ({ page }) => {
  51  |   const footer = page.locator("footer");
  52  |   await expect(footer.getByRole("link", { name: /hello@deeprun/i })).toBeVisible();
  53  |   await expect(footer.getByRole("link", { name: "Privacy" })).toBeVisible();
  54  |   await expect(footer.getByRole("link", { name: "About" })).toBeVisible();
  55  | });
  56  | 
  57  | test("footer year is current", async ({ page }) => {
  58  |   const year = new Date().getFullYear().toString();
  59  |   await expect(page.locator("footer")).toContainText(`© ${year}`);
  60  | });
  61  | 
  62  | test("all five pricing cards are visible", async ({ page }) => {
  63  |   await page.locator("#pricing").scrollIntoViewIfNeeded();
  64  |   await expect(page.locator(".tilt")).toHaveCount(4);
  65  | });
  66  | 
  67  | test("resources grid shows article cards plus coming soon", async ({ page }) => {
  68  |   await page.locator("#resources").scrollIntoViewIfNeeded();
  69  |   // 4 article links + 1 coming soon card + the case study card
  70  |   const cards = page.locator(".res-card");
  71  |   expect(await cards.count()).toBeGreaterThanOrEqual(5);
  72  | });
  73  | 
  74  | test("favicon is served", async ({ page }) => {
  75  |   // Next.js injects a <link rel="icon"> for app/icon.svg automatically.
  76  |   const icon = page.locator('link[rel="icon"]').first();
  77  |   await expect(icon).toHaveAttribute("href", /icon/);
  78  |   const href = await icon.getAttribute("href");
  79  |   const res = await page.request.get(href!);
  80  |   expect(res.ok()).toBe(true);
  81  | });
  82  | 
  83  | test("section dots fill gold when scrolled into view", async ({ page }) => {
  84  |   const pricingDot = page.locator("#pricing .mono .dot").first();
  85  |   await expect(pricingDot).not.toHaveClass(/lit/);
  86  |   await page.locator("#pricing").scrollIntoViewIfNeeded();
  87  |   await expect(pricingDot).toHaveClass(/lit/);
  88  | });
  89  | 
  90  | test("pricing and resources sections share the same left edge", async ({ page }) => {
  91  |   // Regression guard for the alignment bug where .resources carried the
  92  |   // .wrap class directly and its own padding wiped out the gutters.
  93  |   await page.locator("#resources").scrollIntoViewIfNeeded();
  94  |   const pricingBox = await page.locator("#pricing .wrap").boundingBox();
  95  |   const resourcesBox = await page.locator("#resources .wrap").boundingBox();
  96  |   expect(pricingBox).not.toBeNull();
  97  |   expect(resourcesBox).not.toBeNull();
  98  |   expect(Math.abs(pricingBox!.x - resourcesBox!.x)).toBeLessThan(2);
  99  | });
  100 | 
  101 | test("audit card powers up when scrolled into view", async ({ page }) => {
  102 |   const card = page.locator(".audit-card");
  103 |   await expect(card).toHaveAttribute("data-pw", "flicker");
  104 |   await page.locator("#audit").scrollIntoViewIfNeeded();
  105 |   await expect(card).toHaveClass(/on/);
  106 |   // Its contents rise in after it
  107 |   await expect(page.locator(".audit-left")).toHaveClass(/on/);
  108 | });
  109 | 
  110 | test("resource cards power up with the section", async ({ page }) => {
  111 |   const firstCard = page.locator("#resources .res-card").first();
  112 |   await page.locator("#resources").scrollIntoViewIfNeeded();
  113 |   await expect(firstCard).toHaveClass(/on/);
  114 | });
  115 | 
  116 | test("contact card powers up when scrolled into view", async ({ page }) => {
  117 |   await page.locator("#contact").scrollIntoViewIfNeeded();
  118 |   await expect(page.locator(".contact-card")).toHaveClass(/on/);
  119 | });
  120 | 
  121 | test("browser tab title uses title case", async ({ page }) => {
  122 |   await expect(page).toHaveTitle("Deep Run - Websites That Win Work");
  123 | });
  124 | 
  125 | test("nav uses Site Check casing", async ({ page }) => {
  126 |   await expect(
  127 |     page.locator(".nav-links").getByRole("link", { name: "Site Check" })
> 128 |   ).toHaveText("Site Check");
      |     ^ Error: expect(locator).toHaveText(expected) failed
  129 | });
  130 | 
  131 | test("pricing tilt cards sit directly inside the perspective container", async ({ page }) => {
  132 |   // Regression guard: a wrapper div between .cards (which owns the CSS
  133 |   // perspective) and .tilt flattens the 3D hover effect - perspective
  134 |   // only applies to direct children.
  135 |   const count = await page.locator(".cards > .tilt").count();
  136 |   expect(count).toBe(4);
  137 | });
  138 | 
  139 | test("resource card hover lift still works after reveal", async ({ page }) => {
  140 |   // Regression guard: the reveal system must never override the hover
  141 |   // transform (this happened when reveals used transition + transform).
  142 |   await page.locator("#resources").scrollIntoViewIfNeeded();
  143 |   const card = page.locator("#resources .res-card").first();
  144 |   await expect(card).toHaveClass(/on/);
  145 |   const before = (await card.boundingBox())!.y;
  146 |   await card.hover();
  147 |   await page.waitForTimeout(500); // let the lift transition finish
  148 |   const after = (await card.boundingBox())!.y;
  149 |   expect(before - after).toBeGreaterThan(2); // lifted upward
  150 | });
  151 | 
```