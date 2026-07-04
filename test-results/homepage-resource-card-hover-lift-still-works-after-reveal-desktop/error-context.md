# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage.spec.ts >> resource card hover lift still works after reveal
- Location: tests\e2e\homepage.spec.ts:139:5

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 2
Received:   -236
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
        - link "Site Check" [ref=e7] [cursor=pointer]:
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
        - generic:
          - generic: ●
          - text: Web studio · New Zealand
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
        - paragraph: Deep Run builds fast, sharp, fixed-price websites for New Zealand's trades, hospitality and local businesses. Live in days, built to last - and looked after for as long as you want us around.
        - generic [ref=e17]:
          - button "Get your free site check →" [ref=e18] [cursor=pointer]:
            - text: Get your free site check
            - generic [ref=e19]: →
          - button "See pricing" [ref=e20] [cursor=pointer]
      - generic [ref=e22]: Scroll
    - generic [ref=e24]:
      - generic [ref=e25]:
        - generic [ref=e26]: ●
        - text: Why we exist
      - paragraph [ref=e27]:
        - generic [ref=e28]: Most
        - generic [ref=e29]: local
        - generic [ref=e30]: businesses
        - generic [ref=e31]: are
        - generic [ref=e32]: brilliant
        - generic [ref=e33]: at
        - generic [ref=e34]: what
        - generic [ref=e35]: they
        - generic [ref=e36]: do
        - generic [ref=e37]: and
        - generic [ref=e38]: let
        - generic [ref=e39]: down
        - generic [ref=e40]: by
        - generic [ref=e41]: a
        - generic [ref=e42]: website
        - generic [ref=e43]: that
        - generic [ref=e44]: isn't.
        - generic [ref=e45]: We
        - generic [ref=e46]: find
        - generic [ref=e47]: the
        - generic [ref=e48]: gap,
        - generic [ref=e49]: show
        - generic [ref=e50]: you
        - generic [ref=e51]: exactly
        - generic [ref=e52]: what
        - generic [ref=e53]: better
        - generic [ref=e54]: looks
        - generic [ref=e55]: like,
        - generic [ref=e56]: and
        - generic [ref=e57]: build
        - generic [ref=e58]: it
        - generic [ref=e59]: fast
        - generic [ref=e60]: at
        - generic [ref=e61]: a
        - generic [ref=e62]: fixed
        - generic [ref=e63]: price.
    - generic [ref=e66]:
      - generic [ref=e67]:
        - generic [ref=e68]:
          - generic [ref=e69]: ●
          - text: AI site check
        - heading "How hard is your website working?" [level=2] [ref=e70]
        - paragraph [ref=e71]: Paste your address below and our AI reads the page the way a customer would. You get a score across five areas - what the site says, how easy it is to act, the words, the build underneath, and whether it earns trust - so you can see exactly where it's falling short.
        - generic [ref=e72]:
          - textbox "Your website address" [ref=e73]:
            - /placeholder: yourdomain.co.nz
          - button "Check my site →" [ref=e74] [cursor=pointer]:
            - text: Check my site
            - generic [ref=e75]: →
        - paragraph [ref=e76]: Free. Takes about 20 seconds. No email required.
      - generic [ref=e77]:
        - generic [ref=e78]:
          - generic [ref=e79]: –
          - generic [ref=e80]: /100
        - generic [ref=e81]: Example result - run your own site to see where it stands.
        - generic [ref=e82]:
          - generic [ref=e83]:
            - generic [ref=e84]: message
            - generic [ref=e108]: "48"
          - generic [ref=e109]:
            - generic [ref=e110]: action
            - generic [ref=e134]: "35"
          - generic [ref=e135]:
            - generic [ref=e136]: content
            - generic [ref=e160]: "51"
          - generic [ref=e161]:
            - generic [ref=e162]: foundations
            - generic [ref=e186]: "44"
          - generic [ref=e187]:
            - generic [ref=e188]: credibility
            - generic [ref=e212]: "32"
    - generic [ref=e214]: Trades ·Hospitality ·Health & wellness ·Local retail ·Trades ·Hospitality ·Health & wellness ·Local retail ·
    - generic [ref=e216]:
      - generic [ref=e217]:
        - generic [ref=e218]:
          - generic [ref=e219]: ●
          - text: Pricing
        - heading "Fixed price. No surprises. Live in days." [level=2] [ref=e220]
        - paragraph [ref=e221]: Every tier includes design, build, mobile-first QA and launch. Add the care plan and we host, maintain and update it for you - we're your web people.
      - generic [ref=e222]:
        - generic [ref=e223]:
          - heading "Starter" [level=3] [ref=e224]
          - generic [ref=e225]: FROM $800 NZD
          - list [ref=e226]:
            - listitem [ref=e227]: 1-3 pages, mobile-first
            - listitem [ref=e228]: Contact & click-to-call
            - listitem [ref=e229]: Live within a week
          - link "Get started →" [ref=e230] [cursor=pointer]:
            - /url: "#contact"
            - text: Get started
            - generic [ref=e231]: →
        - generic [ref=e232]:
          - generic [ref=e233]: Most popular
          - heading "Business" [level=3] [ref=e234]
          - generic [ref=e235]: FROM $1,500 NZD
          - list [ref=e236]:
            - listitem [ref=e237]: Up to 8 pages
            - listitem [ref=e238]: Forms & enquiry routing
            - listitem [ref=e239]: SEO foundations
          - link "Get started →" [ref=e240] [cursor=pointer]:
            - /url: "#contact"
            - text: Get started
            - generic [ref=e241]: →
        - generic [ref=e242]:
          - heading "Enhanced" [level=3] [ref=e243]
          - generic [ref=e244]: FROM $3,000 NZD
          - list [ref=e245]:
            - listitem [ref=e246]: Booking systems
            - listitem [ref=e247]: E-commerce lite
            - listitem [ref=e248]: Custom features
          - link "Get started →" [ref=e249] [cursor=pointer]:
            - /url: "#contact"
            - text: Get started
            - generic [ref=e250]: →
        - generic [ref=e251]:
          - heading "Care plan" [level=3] [ref=e252]
          - generic [ref=e253]: $150-200 / MONTH
          - list [ref=e254]:
            - listitem [ref=e255]: Hosting & domain
            - listitem [ref=e256]: Monthly updates
            - listitem [ref=e257]: Backups & security
          - link "Add to any build →" [ref=e258] [cursor=pointer]:
            - /url: "#contact"
            - text: Add to any build
            - generic [ref=e259]: →
    - generic [ref=e261]:
      - generic [ref=e262]:
        - generic [ref=e263]:
          - generic [ref=e264]: ●
          - text: Resources & case studies
        - heading "What we've learned, written down." [level=2] [ref=e265]
        - paragraph [ref=e266]: Plain-English guides on what actually makes a website earn its keep - with the research to back it up.
      - generic [ref=e267]:
        - link "● Resource Five signs your website is quietly costing you work" [ref=e268] [cursor=pointer]:
          - /url: /resources/five-signs-your-website-is-costing-you-work
          - generic [ref=e269]:
            - generic [ref=e270]:
              - generic [ref=e271]: ●
              - text: Resource
            - heading "Five signs your website is quietly costing you work" [level=3] [ref=e272]
          - img [ref=e274]
        - link "● Resource Why accessibility matters for every local business" [ref=e318] [cursor=pointer]:
          - /url: /resources/why-accessibility-matters-for-local-business
          - generic [ref=e319]:
            - generic [ref=e320]:
              - generic [ref=e321]: ●
              - text: Resource
            - heading "Why accessibility matters for every local business" [level=3] [ref=e322]
          - img [ref=e324]
        - 'link "● Resource Speed, trust and Google: what actually moves the needle" [ref=e374] [cursor=pointer]':
          - /url: /resources/speed-trust-and-google
          - generic [ref=e375]:
            - generic [ref=e376]:
              - generic [ref=e377]: ●
              - text: Resource
            - 'heading "Speed, trust and Google: what actually moves the needle" [level=3] [ref=e378]'
          - img [ref=e380]
        - link "● Resource What good UX looks like on a trade business website" [ref=e426] [cursor=pointer]:
          - /url: /resources/what-good-ux-looks-like-on-a-trade-website
          - generic [ref=e427]:
            - generic [ref=e428]:
              - generic [ref=e429]: ●
              - text: Resource
            - heading "What good UX looks like on a trade business website" [level=3] [ref=e430]
          - img [ref=e432]
        - generic [ref=e478]:
          - generic [ref=e479]:
            - generic [ref=e480]:
              - generic [ref=e481]: ●
              - text: Case study
            - heading "Coming soon - our first client stories, told with real numbers" [level=3] [ref=e482]
          - img [ref=e484]
    - generic [ref=e546]:
      - generic [ref=e547]:
        - generic [ref=e548]:
          - generic [ref=e549]: ●
          - text: Get in touch
        - heading "Let's talk about your site" [level=2] [ref=e550]
        - paragraph [ref=e551]: Tell us a bit about your business and what you need. We respond to every enquiry within 24 hours - usually much faster.
        - link "Email hello@deeprun.co.nz" [ref=e553] [cursor=pointer]:
          - /url: mailto:hello@deeprun.co.nz
          - generic [ref=e554]: Email
          - generic [ref=e555]: hello@deeprun.co.nz
      - generic [ref=e556]:
        - generic [ref=e557]:
          - generic [ref=e558]: Your name
          - textbox "Your name" [ref=e559]:
            - /placeholder: Jane Smith
        - generic [ref=e560]:
          - generic [ref=e561]:
            - generic [ref=e562]: Email
            - textbox "Email" [ref=e563]:
              - /placeholder: jane@example.co.nz
          - generic [ref=e564]:
            - generic [ref=e565]: Phone (optional)
            - textbox "Phone (optional)" [ref=e566]:
              - /placeholder: 021 123 4567
        - generic [ref=e567]:
          - generic [ref=e568]: What do you need?
          - textbox "What do you need?" [ref=e569]:
            - /placeholder: Tell us about your business and what you're looking for - a new site, a rebuild, or just some advice.
        - button "Send enquiry →" [disabled] [ref=e570]:
          - text: Send enquiry
          - generic [ref=e571]: →
  - contentinfo [ref=e572]:
    - generic [ref=e573]:
      - generic [ref=e574]:
        - generic [ref=e575]:
          - generic [ref=e576]: deeprun.
          - generic [ref=e577]:
            - generic [ref=e578]: ●
            - text: Aotearoa, New Zealand
        - generic [ref=e579]:
          - paragraph [ref=e580]: Ready when you are.
          - link "hello@deeprun.co.nz →" [ref=e581] [cursor=pointer]:
            - /url: mailto:hello@deeprun.co.nz
            - text: hello@deeprun.co.nz
            - generic [ref=e582]: →
      - navigation "Footer" [ref=e583]:
        - link "Site Check" [ref=e584] [cursor=pointer]:
          - /url: /#audit
        - link "Pricing" [ref=e585] [cursor=pointer]:
          - /url: /#pricing
        - link "Resources" [ref=e586] [cursor=pointer]:
          - /url: /resources
        - link "Contact" [ref=e587] [cursor=pointer]:
          - /url: /#contact
        - link "About" [ref=e588] [cursor=pointer]:
          - /url: /about
        - link "Privacy" [ref=e589] [cursor=pointer]:
          - /url: /privacy
      - generic [ref=e590]:
        - generic [ref=e591]: © 2026 Deep Run. All rights reserved.
        - generic [ref=e592]: Fast, sharp, fixed-price websites.
  - alert [ref=e593]
```

# Test source

```ts
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
  128 |   ).toHaveText("Site Check");
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
> 149 |   expect(before - after).toBeGreaterThan(2); // lifted upward
      |                          ^ Error: expect(received).toBeGreaterThan(expected)
  150 | });
  151 | 
```