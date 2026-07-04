# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> privacy page is reachable from the footer
- Location: tests\e2e\navigation.spec.ts:61:5

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('h1')
Expected substring: "Privacy"
Received string:    "Websites that win work. "
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('h1')
    13 × locator resolved to <h1>…</h1>
       - unexpected value "Websites that win work. "

```

```yaml
- heading "Websites that win work." [level=1]:
  - text: Websites that
  - emphasis: win
  - emphasis: work.
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test("resources index lists all article cards", async ({ page }) => {
  4  |   await page.goto("/resources");
  5  |   const cards = page.locator(".res-card");
  6  |   expect(await cards.count()).toBeGreaterThanOrEqual(5);
  7  | });
  8  | 
  9  | test("article page opens, has citations, and links back", async ({ page }) => {
  10 |   await page.goto("/resources");
  11 |   await page.getByRole("link", { name: /five signs/i }).click();
  12 |   await expect(page).toHaveURL(/five-signs-your-website-is-costing-you-work/);
  13 |   await expect(page.locator("h1")).toContainText("Five signs");
  14 |   // Every article must cite at least one external primary source
  15 |   expect(
  16 |     await page.locator('.article-body a[target="_blank"]').count()
  17 |   ).toBeGreaterThan(0);
  18 |   // Back link works
  19 |   await page.getByRole("link", { name: /all resources/i }).click();
  20 |   await expect(page).toHaveURL(/\/resources$/);
  21 | });
  22 | 
  23 | test("all four articles are navigable", async ({ page }) => {
  24 |   const slugs = [
  25 |     "five-signs-your-website-is-costing-you-work",
  26 |     "why-accessibility-matters-for-local-business",
  27 |     "speed-trust-and-google",
  28 |     "what-good-ux-looks-like-on-a-trade-website",
  29 |   ];
  30 |   for (const slug of slugs) {
  31 |     await page.goto(`/resources/${slug}`);
  32 |     await expect(page.locator("h1")).toBeVisible();
  33 |     await expect(page.locator(".article-body")).toBeVisible();
  34 |   }
  35 | });
  36 | 
  37 | test("articles use site check not audit in visible text", async ({ page }) => {
  38 |   const slugs = [
  39 |     "five-signs-your-website-is-costing-you-work",
  40 |     "why-accessibility-matters-for-local-business",
  41 |     "speed-trust-and-google",
  42 |     "what-good-ux-looks-like-on-a-trade-website",
  43 |   ];
  44 |   for (const slug of slugs) {
  45 |     await page.goto(`/resources/${slug}`);
  46 |     const text = await page.locator(".article-body").innerText();
  47 |     expect(text).not.toContain("free AI audit");
  48 |     expect(text).not.toContain("the free audit");
  49 |   }
  50 | });
  51 | 
  52 | test("privacy page loads and has expected sections", async ({ page }) => {
  53 |   await page.goto("/privacy");
  54 |   await expect(page.locator("h1")).toContainText("Privacy");
  55 |   const body = page.locator(".article-body");
  56 |   await expect(body).toContainText("site check tool");
  57 |   await expect(body).toContainText("contact form");
  58 |   await expect(body).toContainText("Privacy Act 2020");
  59 | });
  60 | 
  61 | test("privacy page is reachable from the footer", async ({ page }) => {
  62 |   await page.goto("/");
  63 |   await page.locator("footer").getByRole("link", { name: "Privacy" }).click();
> 64 |   await expect(page.locator("h1")).toContainText("Privacy");
     |                                    ^ Error: expect(locator).toContainText(expected) failed
  65 | });
  66 | 
  67 | test("about page loads with expected content", async ({ page }) => {
  68 |   await page.goto("/about");
  69 |   await expect(page.locator("h1")).toContainText("Built by an engineer");
  70 |   const body = page.locator(".article-body");
  71 |   await expect(body).toContainText("four years");
  72 |   await expect(body).toContainText("quality assurance");
  73 |   await expect(body).toContainText("care plan");
  74 |   await expect(body).toContainText("optional");
  75 | });
  76 | 
  77 | test("about page links to site check and contact", async ({ page }) => {
  78 |   await page.goto("/about");
  79 |   await expect(
  80 |     page.locator('.article-body').getByRole("link", { name: /site check/i })
  81 |   ).toBeVisible();
  82 |   await expect(
  83 |     page.locator('.article-body').getByRole("link", { name: /get in touch/i })
  84 |   ).toBeVisible();
  85 | });
  86 | 
  87 | test("about page is reachable from nav", async ({ page }) => {
  88 |   await page.goto("/");
  89 |   await page.locator(".nav-links").getByRole("link", { name: "About" }).click();
  90 |   await expect(page.locator("h1")).toContainText("Built by an engineer");
  91 | });
  92 | 
  93 | test("404 page returns for invalid routes", async ({ page }) => {
  94 |   const response = await page.goto("/this-page-does-not-exist");
  95 |   expect(response?.status()).toBe(404);
  96 | });
  97 | 
```