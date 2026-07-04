# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage.spec.ts >> section dots fill gold when scrolled into view
- Location: tests\e2e\homepage.spec.ts:83:5

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#pricing .mono .dot').first()
Expected pattern: /lit/
Received string:  "dot"
Timeout: 10000ms

Call log:
  - Expect "toHaveClass" with timeout 10000ms
  - waiting for locator('#pricing .mono .dot').first()
    17 × locator resolved to <span class="dot">●</span>
       - unexpected value "dot"

```

```yaml
- text: ●
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | test.beforeEach(async ({ page }) => {
  4   |   await page.goto("/");
  5   | });
  6   | 
  7   | test("hero headline renders with correct word spacing", async ({ page }) => {
  8   |   await expect(page.locator("h1")).toContainText("Websites that win work.");
  9   | });
  10  | 
  11  | test("hero sub-text sets honest expectations about ongoing care", async ({ page }) => {
  12  |   const sub = page.locator(".hero-sub");
  13  |   // "as long as you want us around" - ongoing care is the client's choice
  14  |   await expect(sub).toContainText("as long as you want us");
  15  |   await expect(sub).not.toContainText("then manages them");
  16  | });
  17  | 
  18  | test("primary CTA scrolls to the site check module", async ({ page }) => {
  19  |   await page.getByRole("button", { name: /free site check/i }).click();
  20  |   await expect(page.locator("#audit")).toBeInViewport();
  21  | });
  22  | 
  23  | test("nav Start a project CTA scrolls to contact", async ({ page }) => {
  24  |   await page.getByRole("link", { name: /start a project/i }).click();
  25  |   await expect(page.locator("#contact")).toBeInViewport();
  26  | });
  27  | 
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
> 87  |   await expect(pricingDot).toHaveClass(/lit/);
      |                            ^ Error: expect(locator).toHaveClass(expected) failed
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
  149 |   expect(before - after).toBeGreaterThan(2); // lifted upward
  150 | });
  151 | 
```