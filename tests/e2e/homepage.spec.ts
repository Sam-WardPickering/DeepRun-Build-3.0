import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("hero headline renders with correct word spacing", async ({ page }) => {
  await expect(page.locator("h1")).toContainText("Websites that win work.");
});

test("hero sub-text frames care plan as optional", async ({ page }) => {
  const sub = page.locator(".hero-sub");
  await expect(sub).toContainText("Add a care plan");
  await expect(sub).not.toContainText("then manages them");
});

test("primary CTA scrolls to the site check module", async ({ page }) => {
  await page.getByRole("button", { name: /free site check/i }).click();
  await expect(page.locator("#audit")).toBeInViewport();
});

test("nav Start a project CTA scrolls to contact", async ({ page }) => {
  await page.getByRole("link", { name: /start a project/i }).click();
  await expect(page.locator("#contact")).toBeInViewport();
});

test("nav has aria-label for accessibility", async ({ page }) => {
  await expect(page.locator('nav[aria-label="Main"]')).toBeVisible();
});

test("manifesto words light up on scroll", async ({ page }) => {
  const firstWord = page.locator(".manifesto .w").first();
  await page.locator(".manifesto p").scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 80);
  await expect(firstWord).toHaveClass(/lit/, { timeout: 5_000 });
});

test("manifesto copy frames care plan as optional", async ({ page }) => {
  const manifesto = page.locator(".manifesto p");
  await expect(manifesto).toContainText("care plan");
  await expect(manifesto).not.toContainText("managed for good");
});

test("skip link is present for keyboard users", async ({ page }) => {
  const skipLink = page.locator(".skip-link");
  await expect(skipLink).toHaveAttribute("href", "#main");
});

test("footer contains email, privacy link, and about link", async ({ page }) => {
  const footer = page.locator("footer");
  await expect(footer.getByRole("link", { name: /hello@deeprun/i })).toBeVisible();
  await expect(footer.getByRole("link", { name: "Privacy" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "About" })).toBeVisible();
});

test("footer year is current", async ({ page }) => {
  const year = new Date().getFullYear().toString();
  await expect(page.locator("footer")).toContainText(`© ${year}`);
});

test("all five pricing cards are visible", async ({ page }) => {
  await page.locator("#pricing").scrollIntoViewIfNeeded();
  await expect(page.locator(".tilt")).toHaveCount(4);
});

test("resources grid shows article cards plus coming soon", async ({ page }) => {
  await page.locator("#resources").scrollIntoViewIfNeeded();
  // 4 article links + 1 coming soon card + the case study card
  const cards = page.locator(".res-card");
  expect(await cards.count()).toBeGreaterThanOrEqual(5);
});
