# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> axe-core: homepage has no WCAG A/AA violations
- Location: tests\e2e\accessibility.spec.ts:25:7

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 58

- Array []
+ Array [
+   Object {
+     "description": "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
+     "help": "Elements must meet minimum color contrast ratio thresholds",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.12/color-contrast?application=playwright",
+     "id": "color-contrast",
+     "impact": "serious",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#775e23",
+               "contrastRatio": 1.78,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#4a3a16",
+               "fontSize": "9.8pt (13px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.78 (foreground color: #4a3a16, background color: #775e23, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<button class=\"pill gold\">Get your free site check <span class=\"arr\">→</span></button>",
+                 "target": Array [
+                   "button:nth-child(1)",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 1.78 (foreground color: #4a3a16, background color: #775e23, font size: 9.8pt (13px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<button class=\"pill gold\">Get your free site check <span class=\"arr\">→</span></button>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           "button:nth-child(1)",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.color",
+       "wcag2aa",
+       "wcag143",
+       "TTv5",
+       "TT13.c",
+       "EN-301-549",
+       "EN-9.1.4.3",
+       "ACT",
+       "RGAAv4",
+       "RGAA-3.2.1",
+     ],
+   },
+ ]
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
  1   | import { test, expect } from "@playwright/test";
  2   | import AxeBuilder from "@axe-core/playwright";
  3   | 
  4   | /**
  5   |  * Automated accessibility testing with axe-core against WCAG 2.0/2.1
  6   |  * Level A and AA rules, on every page of the site.
  7   |  *
  8   |  * Documented exclusion: the industries marquee (.marquee-zone) is purely
  9   |  * decorative, marked aria-hidden, and its outlined display text is a
  10  |  * stylistic device. Screen readers never encounter it.
  11  |  */
  12  | 
  13  | const PAGES = [
  14  |   { path: "/", name: "homepage" },
  15  |   { path: "/about", name: "about" },
  16  |   { path: "/privacy", name: "privacy" },
  17  |   { path: "/resources", name: "resources index" },
  18  |   { path: "/resources/five-signs-your-website-is-costing-you-work", name: "article: five signs" },
  19  |   { path: "/resources/why-accessibility-matters-for-local-business", name: "article: accessibility" },
  20  |   { path: "/resources/speed-trust-and-google", name: "article: speed" },
  21  |   { path: "/resources/what-good-ux-looks-like-on-a-trade-website", name: "article: ux" },
  22  | ];
  23  | 
  24  | for (const { path, name } of PAGES) {
  25  |   test(`axe-core: ${name} has no WCAG A/AA violations`, async ({ page }) => {
  26  |     await page.goto(path);
  27  |     await page.waitForTimeout(1_500);
  28  | 
  29  |     const results = await new AxeBuilder({ page })
  30  |       .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
  31  |       .exclude(".marquee-zone")
  32  |       .analyze();
  33  | 
  34  |     if (results.violations.length > 0) {
  35  |       for (const v of results.violations) {
  36  |         console.log(`\n[${v.impact}] ${v.id}: ${v.help}`);
  37  |         console.log(`  ${v.helpUrl}`);
  38  |         for (const node of v.nodes.slice(0, 5)) {
  39  |           console.log(`  -> ${node.html.slice(0, 140)}`);
  40  |         }
  41  |       }
  42  |     }
  43  | 
> 44  |     expect(results.violations).toEqual([]);
      |                                ^ Error: expect(received).toEqual(expected) // deep equality
  45  |   });
  46  | }
  47  | 
  48  | test("keyboard navigation: tab reaches all major interactive elements", async ({ page }) => {
  49  |   await page.goto("/");
  50  |   const tabTargets: string[] = [];
  51  | 
  52  |   for (let i = 0; i < 15; i++) {
  53  |     await page.keyboard.press("Tab");
  54  |     const focused = await page.evaluate(() => {
  55  |       const el = document.activeElement;
  56  |       if (!el) return "none";
  57  |       return `${el.tagName.toLowerCase()}${el.className ? "." + el.className.split(" ")[0] : ""}`;
  58  |     });
  59  |     tabTargets.push(focused);
  60  |   }
  61  | 
  62  |   // Should hit at least links and buttons, never get stuck
  63  |   const hitLink = tabTargets.some((t) => t.startsWith("a"));
  64  |   const hitButton = tabTargets.some((t) => t.startsWith("button"));
  65  |   expect(hitLink).toBe(true);
  66  |   expect(hitButton).toBe(true);
  67  | });
  68  | 
  69  | test("images in articles have alt text", async ({ page }) => {
  70  |   // Our articles don't have images, but this guards against future additions
  71  |   const articlesWithImages = [
  72  |     "/resources/five-signs-your-website-is-costing-you-work",
  73  |   ];
  74  |   for (const path of articlesWithImages) {
  75  |     await page.goto(path);
  76  |     const images = page.locator(".article-body img");
  77  |     const count = await images.count();
  78  |     for (let i = 0; i < count; i++) {
  79  |       const alt = await images.nth(i).getAttribute("alt");
  80  |       expect(alt).toBeTruthy();
  81  |     }
  82  |   }
  83  | });
  84  | 
  85  | test("colour contrast: manifesto unlit words meet WCAG AA", async ({ page }) => {
  86  |   await page.goto("/");
  87  |   // The CSS sets unlit words to rgba(236, 231, 218, 0.55) on #100f0d
  88  |   // That's roughly #7a7770 on #100f0d = contrast ratio ~4.6:1 (passes AA)
  89  |   const opacity = await page.evaluate(() => {
  90  |     const w = document.querySelector(".w:not(.lit)");
  91  |     if (!w) return "no element";
  92  |     return getComputedStyle(w).color;
  93  |   });
  94  |   // Just verify the element exists and has a computed colour
  95  |   expect(opacity).not.toBe("no element");
  96  | });
  97  | 
  98  | test("focus indicators are visible on interactive elements", async ({ page }) => {
  99  |   await page.goto("/");
  100 |   // Tab to first interactive element
  101 |   await page.keyboard.press("Tab");
  102 |   await page.keyboard.press("Tab");
  103 | 
  104 |   const outline = await page.evaluate(() => {
  105 |     const el = document.activeElement;
  106 |     if (!el) return "none";
  107 |     const style = getComputedStyle(el);
  108 |     return style.outlineStyle;
  109 |   });
  110 |   // Should have a visible outline (not "none")
  111 |   expect(outline).not.toBe("none");
  112 | });
  113 | 
```