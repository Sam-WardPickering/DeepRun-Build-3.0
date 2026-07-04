# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: contact.spec.ts >> submit stays disabled until required fields are filled
- Location: tests\e2e\contact.spec.ts:3:5

# Error details

```
Error: expect(locator).toBeEnabled() failed

Locator:  getByRole('button', { name: /send enquiry/i })
Expected: enabled
Received: disabled
Timeout:  5000ms

Call log:
  - Expect "toBeEnabled" with timeout 5000ms
  - waiting for getByRole('button', { name: /send enquiry/i })
    13 × locator resolved to <button disabled class="pill gold form-submit disabled">…</button>
       - unexpected value "disabled"

```

```yaml
- button "Send enquiry →" [disabled]
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
> 15 |   await expect(submit).toBeEnabled();
     |                        ^ Error: expect(locator).toBeEnabled() failed
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
  30 |   await page.getByRole("link", { name: /get started/i }).first().click();
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