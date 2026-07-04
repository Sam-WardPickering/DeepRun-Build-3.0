# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: contact.spec.ts >> pricing CTA scrolls to contact and pre-selects the tier
- Location: tests\e2e\contact.spec.ts:27:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: /get started/i }).first()
    - locator resolved to <a href="#contact" class="pill tier-cta ghost">…</a>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="tilt">…</div> intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
      - waiting 100ms
    4 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="tilt">…</div> intercepts pointer events
    - retrying click action
      - waiting 500ms
    5 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="nav-inner">…</div> from <nav class="site-nav" aria-label="Main">…</nav> subtree intercepts pointer events
    - retrying click action
      - waiting 500ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="tilt">…</div> intercepts pointer events
    - retrying click action
      - waiting 500ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="tilt">…</div> intercepts pointer events
    - retrying click action
      - waiting 500ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="tilt">…</div> intercepts pointer events
    - retrying click action
      - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div class="nav-inner">…</div> from <nav class="site-nav" aria-label="Main">…</nav> subtree intercepts pointer events
  - retrying click action
    - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div class="tilt">…</div> intercepts pointer events
  - retrying click action
    - waiting 500ms

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to content" [ref=e2] [cursor=pointer]:
    - /url: "#main"
  - navigation "Main" [ref=e3]:
    - generic [ref=e4]:
      - link "deeprun." [ref=e5] [cursor=pointer]:
        - /url: /
      - generic [ref=e6]:
        - link "Site check" [ref=e7] [cursor=pointer]:
          - /url: /#audit
        - link "Pricing" [ref=e8] [cursor=pointer]:
          - /url: /#pricing
        - link "Resources" [ref=e9] [cursor=pointer]:
          - /url: /resources
        - link "About" [ref=e10] [cursor=pointer]:
          - /url: /about
        - link "Start a project →" [ref=e11] [cursor=pointer]:
          - /url: /#contact
          - text: Start a project
          - generic [ref=e12]: →
  - main [ref=e13]:
    - generic [ref=e14]:
      - generic:
        - generic: ●Web studio · New Zealand
        - heading "Websites that win work." [level=1]:
          - generic:
            - generic:
              - generic: Websites
          - generic:
            - generic:
              - generic: that
          - generic:
            - generic:
              - generic:
                - emphasis: win
          - generic:
            - generic:
              - generic:
                - emphasis: work.
        - paragraph: Deep Run builds fast, sharp, fixed-price websites for New Zealand's trades, hospitality and local businesses. Add a care plan and we manage everything - so your site never breaks, never dates, never disappears.
        - generic [ref=e17]:
          - button "Get your free site check →" [ref=e18] [cursor=pointer]:
            - text: Get your free site check
            - generic [ref=e19]: →
          - button "See pricing" [ref=e20] [cursor=pointer]
      - generic [ref=e22]: Scroll
    - generic [ref=e24]:
      - generic [ref=e25]: ●Why we exist
      - paragraph [ref=e26]:
        - generic [ref=e27]: Most
        - generic [ref=e28]: local
        - generic [ref=e29]: businesses
        - generic [ref=e30]: are
        - generic [ref=e31]: brilliant
        - generic [ref=e32]: at
        - generic [ref=e33]: what
        - generic [ref=e34]: they
        - generic [ref=e35]: do
        - generic [ref=e36]: and
        - generic [ref=e37]: let
        - generic [ref=e38]: down
        - generic [ref=e39]: by
        - generic [ref=e40]: a
        - generic [ref=e41]: website
        - generic [ref=e42]: that
        - generic [ref=e43]: isn't.
        - generic [ref=e44]: We
        - generic [ref=e45]: find
        - generic [ref=e46]: the
        - generic [ref=e47]: gap,
        - generic [ref=e48]: show
        - generic [ref=e49]: you
        - generic [ref=e50]: exactly
        - generic [ref=e51]: what
        - generic [ref=e52]: better
        - generic [ref=e53]: looks
        - generic [ref=e54]: like,
        - generic [ref=e55]: and
        - generic [ref=e56]: build
        - generic [ref=e57]: it
        - generic [ref=e58]: fast
        - generic [ref=e59]: at
        - generic [ref=e60]: a
        - generic [ref=e61]: fixed
        - generic [ref=e62]: price.
        - generic [ref=e63]: And
        - generic [ref=e64]: if
        - generic [ref=e65]: you
        - generic [ref=e66]: want
        - generic [ref=e67]: it
        - generic [ref=e68]: looked
        - generic [ref=e69]: after
        - generic [ref=e70]: for
        - generic [ref=e71]: good,
        - generic [ref=e72]: that's
        - generic [ref=e73]: exactly
        - generic [ref=e74]: what
        - generic [ref=e75]: our
        - generic [ref=e76]: care
        - generic [ref=e77]: plan
        - generic [ref=e78]: is
        - generic [ref=e79]: for.
    - generic [ref=e82]:
      - generic [ref=e83]:
        - generic [ref=e84]: ●AI site check
        - heading "How hard is your website working?" [level=2] [ref=e85]
        - paragraph [ref=e86]: Paste your address below and our AI reads the page the way a customer would. You get a score across five areas - what the site says, how easy it is to act, the words, the build underneath, and whether it earns trust - so you can see exactly where it's falling short.
        - generic [ref=e87]:
          - textbox "Your website address" [ref=e88]:
            - /placeholder: yourdomain.co.nz
          - button "Check my site →" [ref=e89] [cursor=pointer]:
            - text: Check my site
            - generic [ref=e90]: →
        - paragraph [ref=e91]: Free. Takes about 20 seconds. No email required.
      - generic [ref=e92]:
        - generic [ref=e93]:
          - generic [ref=e94]: –
          - generic [ref=e95]: /100
        - generic [ref=e96]: Example result - run your own site to see where it stands.
        - generic [ref=e97]:
          - generic [ref=e98]:
            - generic [ref=e99]: message
            - generic [ref=e123]: "48"
          - generic [ref=e124]:
            - generic [ref=e125]: action
            - generic [ref=e149]: "35"
          - generic [ref=e150]:
            - generic [ref=e151]: content
            - generic [ref=e175]: "51"
          - generic [ref=e176]:
            - generic [ref=e177]: foundations
            - generic [ref=e201]: "44"
          - generic [ref=e202]:
            - generic [ref=e203]: credibility
            - generic [ref=e227]: "32"
    - generic [ref=e229]: Trades ·Hospitality ·Health & wellness ·Local retail ·Trades ·Hospitality ·Health & wellness ·Local retail ·
    - generic [ref=e231]:
      - generic [ref=e232]:
        - generic [ref=e233]: ●Pricing
        - heading "Fixed price. No surprises. Live in days." [level=2] [ref=e234]
        - paragraph [ref=e235]: Every tier includes design, build, mobile-first QA and launch. Add the care plan and we host, maintain and update it for you - we're your web people.
      - generic [ref=e236]:
        - generic [ref=e237]:
          - heading "Starter" [level=3] [ref=e238]
          - generic [ref=e239]: FROM $800 NZD
          - list [ref=e240]:
            - listitem [ref=e241]: 1-3 pages, mobile-first
            - listitem [ref=e242]: Contact & click-to-call
            - listitem [ref=e243]: Live within a week
          - link "Get started →" [ref=e244] [cursor=pointer]:
            - /url: "#contact"
            - text: Get started
            - generic [ref=e245]: →
        - generic [ref=e246]:
          - generic [ref=e247]: Most popular
          - heading "Business" [level=3] [ref=e248]
          - generic [ref=e249]: FROM $1,500 NZD
          - list [ref=e250]:
            - listitem [ref=e251]: Up to 8 pages
            - listitem [ref=e252]: Forms & enquiry routing
            - listitem [ref=e253]: SEO foundations
          - link "Get started →" [ref=e254] [cursor=pointer]:
            - /url: "#contact"
            - text: Get started
            - generic [ref=e255]: →
        - generic [ref=e256]:
          - heading "Enhanced" [level=3] [ref=e257]
          - generic [ref=e258]: FROM $3,000 NZD
          - list [ref=e259]:
            - listitem [ref=e260]: Booking systems
            - listitem [ref=e261]: E-commerce lite
            - listitem [ref=e262]: Custom features
          - link "Get started →" [ref=e263] [cursor=pointer]:
            - /url: "#contact"
            - text: Get started
            - generic [ref=e264]: →
        - generic [ref=e265]:
          - heading "Care plan" [level=3] [ref=e266]
          - generic [ref=e267]: $150-200 / MONTH
          - list [ref=e268]:
            - listitem [ref=e269]: Hosting & domain
            - listitem [ref=e270]: Monthly updates
            - listitem [ref=e271]: Backups & security
          - link "Add to any build →" [ref=e272] [cursor=pointer]:
            - /url: "#contact"
            - text: Add to any build
            - generic [ref=e273]: →
    - generic [ref=e274]:
      - generic [ref=e275]:
        - generic [ref=e276]: ●Resources & case studies
        - heading "What we've learned, written down." [level=2] [ref=e277]
        - paragraph [ref=e278]: Plain-English guides on what actually makes a website earn its keep - with the research to back it up.
      - generic [ref=e279]:
        - link "●Resource Five signs your website is quietly costing you work" [ref=e280] [cursor=pointer]:
          - /url: /resources/five-signs-your-website-is-costing-you-work
          - generic [ref=e281]:
            - generic [ref=e282]: ●Resource
            - heading "Five signs your website is quietly costing you work" [level=3] [ref=e283]
          - img [ref=e285]
        - link "●Resource Why accessibility matters for every local business" [ref=e329] [cursor=pointer]:
          - /url: /resources/why-accessibility-matters-for-local-business
          - generic [ref=e330]:
            - generic [ref=e331]: ●Resource
            - heading "Why accessibility matters for every local business" [level=3] [ref=e332]
          - img [ref=e334]
        - 'link "●Resource Speed, trust and Google: what actually moves the needle" [ref=e384] [cursor=pointer]':
          - /url: /resources/speed-trust-and-google
          - generic [ref=e385]:
            - generic [ref=e386]: ●Resource
            - 'heading "Speed, trust and Google: what actually moves the needle" [level=3] [ref=e387]'
          - img [ref=e389]
        - link "●Resource What good UX looks like on a trade business website" [ref=e435] [cursor=pointer]:
          - /url: /resources/what-good-ux-looks-like-on-a-trade-website
          - generic [ref=e436]:
            - generic [ref=e437]: ●Resource
            - heading "What good UX looks like on a trade business website" [level=3] [ref=e438]
          - img [ref=e440]
        - generic [ref=e486]:
          - generic [ref=e487]:
            - generic [ref=e488]: ●Case study
            - heading "Coming soon - our first client stories, told with real numbers" [level=3] [ref=e489]
          - img [ref=e491]
    - generic [ref=e553]:
      - generic [ref=e554]:
        - generic [ref=e555]: ●Get in touch
        - heading "Let's talk about your site" [level=2] [ref=e556]
        - paragraph [ref=e557]: Tell us a bit about your business and what you need. We respond to every enquiry within 24 hours - usually much faster.
        - link "Email hello@deeprun.co.nz" [ref=e559] [cursor=pointer]:
          - /url: mailto:hello@deeprun.co.nz
          - generic [ref=e560]: Email
          - generic [ref=e561]: hello@deeprun.co.nz
      - generic [ref=e562]:
        - generic [ref=e563]:
          - generic [ref=e564]: Your name
          - textbox "Your name" [ref=e565]:
            - /placeholder: Jane Smith
        - generic [ref=e566]:
          - generic [ref=e567]:
            - generic [ref=e568]: Email
            - textbox "Email" [ref=e569]:
              - /placeholder: jane@example.co.nz
          - generic [ref=e570]:
            - generic [ref=e571]: Phone (optional)
            - textbox "Phone (optional)" [ref=e572]:
              - /placeholder: 021 123 4567
        - generic [ref=e573]:
          - generic [ref=e574]: What do you need?
          - textbox "What do you need?" [ref=e575]:
            - /placeholder: Tell us about your business and what you're looking for - a new site, a rebuild, or just some advice.
        - button "Send enquiry →" [disabled] [ref=e576]:
          - text: Send enquiry
          - generic [ref=e577]: →
  - contentinfo [ref=e578]:
    - generic [ref=e579]:
      - generic [ref=e580]:
        - generic [ref=e581]:
          - generic [ref=e582]: deeprun.
          - generic [ref=e583]: ●Aotearoa, New Zealand
        - generic [ref=e584]:
          - paragraph [ref=e585]: Ready when you are.
          - link "hello@deeprun.co.nz →" [ref=e586] [cursor=pointer]:
            - /url: mailto:hello@deeprun.co.nz
            - text: hello@deeprun.co.nz
            - generic [ref=e587]: →
      - navigation "Footer" [ref=e588]:
        - link "Site check" [ref=e589] [cursor=pointer]:
          - /url: /#audit
        - link "Pricing" [ref=e590] [cursor=pointer]:
          - /url: /#pricing
        - link "Resources" [ref=e591] [cursor=pointer]:
          - /url: /resources
        - link "Contact" [ref=e592] [cursor=pointer]:
          - /url: /#contact
        - link "About" [ref=e593] [cursor=pointer]:
          - /url: /about
        - link "Privacy" [ref=e594] [cursor=pointer]:
          - /url: /privacy
      - generic [ref=e595]:
        - generic [ref=e596]: © 2026 Deep Run. All rights reserved.
        - generic [ref=e597]: Fast, sharp, fixed-price websites.
  - button "Open Next.js Dev Tools" [ref=e603] [cursor=pointer]:
    - img [ref=e604]
  - alert [ref=e607]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test("submit stays disabled until required fields are filled", async ({ page }) => {
  4  |   await page.goto("/#contact");
  5  |   const submit = page.getByRole("button", { name: /send enquiry/i });
  6  |   await expect(submit).toBeDisabled();
  7  | 
  8  |   await page.getByLabel("Your name").fill("Test Person");
  9  |   await expect(submit).toBeDisabled();
  10 | 
  11 |   await page.getByLabel("Email", { exact: true }).fill("test@example.co.nz");
  12 |   await expect(submit).toBeDisabled();
  13 | 
  14 |   await page.getByLabel("What do you need?").fill("A new website please.");
  15 |   await expect(submit).toBeEnabled();
  16 | });
  17 | 
  18 | test("phone field is optional", async ({ page }) => {
  19 |   await page.goto("/#contact");
  20 |   await page.getByLabel("Your name").fill("Test Person");
  21 |   await page.getByLabel("Email", { exact: true }).fill("test@example.co.nz");
  22 |   await page.getByLabel("What do you need?").fill("Just testing.");
  23 |   // Submit should be enabled without phone
  24 |   await expect(page.getByRole("button", { name: /send enquiry/i })).toBeEnabled();
  25 | });
  26 | 
  27 | test("pricing CTA scrolls to contact and pre-selects the tier", async ({ page }) => {
  28 |   await page.goto("/");
  29 |   await page.locator("#pricing").scrollIntoViewIfNeeded();
> 30 |   await page.getByRole("link", { name: /get started/i }).first().click();
     |                                                                  ^ Error: locator.click: Test timeout of 30000ms exceeded.
  31 |   await expect(page.locator("#contact")).toBeInViewport();
  32 |   await expect(page.locator(".form-tier-badge")).toBeVisible();
  33 | });
  34 | 
  35 | test("contact form has accessible labels on all inputs", async ({ page }) => {
  36 |   await page.goto("/#contact");
  37 |   // Every input must have an associated label
  38 |   await expect(page.getByLabel("Your name")).toBeVisible();
  39 |   await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
  40 |   await expect(page.getByLabel("Phone (optional)")).toBeVisible();
  41 |   await expect(page.getByLabel("What do you need?")).toBeVisible();
  42 | });
  43 | 
  44 | test("contact section is reachable from the audit findings nudge", async ({ page }) => {
  45 |   await page.goto("/");
  46 |   // Mock a successful audit to get the findings + nudge
  47 |   await page.route("**/api/audit", (route) =>
  48 |     route.fulfill({
  49 |       status: 200,
  50 |       contentType: "application/json",
  51 |       body: JSON.stringify({
  52 |         url: "https://example.co.nz",
  53 |         https: true,
  54 |         total: 50,
  55 |         verdict: "Underperforming.",
  56 |         scores: { message: 50, action: 50, content: 50, foundations: 50, credibility: 50 },
  57 |         findings: [
  58 |           { category: "message", message: "Issues found." },
  59 |           { category: "action", message: "Issues found." },
  60 |           { category: "content", message: "Issues found." },
  61 |           { category: "foundations", message: "Issues found." },
  62 |           { category: "credibility", message: "Issues found." },
  63 |         ],
  64 |       }),
  65 |     })
  66 |   );
  67 |   await page.locator("#audit").scrollIntoViewIfNeeded();
  68 |   await page.getByLabel("Your website address").fill("example.co.nz");
  69 |   await page.getByRole("button", { name: /check my site/i }).click();
  70 |   await expect(page.locator(".finding")).toHaveCount(6, { timeout: 8_000 });
  71 |   await page.getByRole("link", { name: /get in touch/i }).click();
  72 |   await expect(page.locator("#contact")).toBeInViewport();
  73 | });
  74 | 
```