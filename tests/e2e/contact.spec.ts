import { test, expect } from "@playwright/test";

test("submit stays disabled until required fields are filled", async ({ page }) => {
  await page.goto("/#contact");
  const submit = page.getByRole("button", { name: /send enquiry/i });
  await expect(submit).toBeDisabled();

  await page.getByLabel("Your name").fill("Test Person");
  await expect(submit).toBeDisabled();

  await page.getByLabel("Email", { exact: true }).fill("test@example.co.nz");
  await expect(submit).toBeDisabled();

  await page.getByLabel("What do you need?").fill("A new website please.");
  await expect(submit).toBeEnabled();
});

test("phone field is optional", async ({ page }) => {
  await page.goto("/#contact");
  await page.getByLabel("Your name").fill("Test Person");
  await page.getByLabel("Email", { exact: true }).fill("test@example.co.nz");
  await page.getByLabel("What do you need?").fill("Just testing.");
  // Submit should be enabled without phone
  await expect(page.getByRole("button", { name: /send enquiry/i })).toBeEnabled();
});

test("pricing CTA scrolls to contact and pre-selects the tier", async ({ page }) => {
  await page.goto("/");
  await page.locator("#pricing").scrollIntoViewIfNeeded();
  await page.getByRole("link", { name: /get started/i }).first().click();
  await expect(page.locator("#contact")).toBeInViewport();
  await expect(page.locator(".form-tier-badge")).toBeVisible();
});

test("contact form has accessible labels on all inputs", async ({ page }) => {
  await page.goto("/#contact");
  // Every input must have an associated label
  await expect(page.getByLabel("Your name")).toBeVisible();
  await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Phone (optional)")).toBeVisible();
  await expect(page.getByLabel("What do you need?")).toBeVisible();
});

test("contact section is reachable from the audit findings nudge", async ({ page }) => {
  await page.goto("/");
  // Mock a successful audit to get the findings + nudge
  await page.route("**/api/audit", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        url: "https://example.co.nz",
        https: true,
        total: 50,
        verdict: "Underperforming.",
        scores: { message: 50, action: 50, content: 50, foundations: 50, credibility: 50 },
        findings: [
          { category: "message", message: "Issues found." },
          { category: "action", message: "Issues found." },
          { category: "content", message: "Issues found." },
          { category: "foundations", message: "Issues found." },
          { category: "credibility", message: "Issues found." },
        ],
      }),
    })
  );
  await page.locator("#audit").scrollIntoViewIfNeeded();
  await page.getByLabel("Your website address").fill("example.co.nz");
  await page.getByRole("button", { name: /check my site/i }).click();
  await expect(page.locator(".finding")).toHaveCount(6, { timeout: 8_000 });
  await page.getByRole("link", { name: /get in touch/i }).click();
  await expect(page.locator("#contact")).toBeInViewport();
});
