import { test, expect } from "@playwright/test";

test("resources index lists all article cards", async ({ page }) => {
  await page.goto("/resources");
  const cards = page.locator(".res-card");
  expect(await cards.count()).toBeGreaterThanOrEqual(5);
});

test("article page opens, has citations, and links back", async ({ page }) => {
  await page.goto("/resources");
  await page.getByRole("link", { name: /five signs/i }).click();
  await expect(page).toHaveURL(/five-signs-your-website-is-costing-you-work/);
  await expect(page.locator("h1")).toContainText("Five signs");
  // Every article must cite at least one external primary source
  expect(
    await page.locator('.article-body a[target="_blank"]').count()
  ).toBeGreaterThan(0);
  // Back link works
  await page.getByRole("link", { name: /all resources/i }).click();
  await expect(page).toHaveURL(/\/resources$/);
});

test("all four articles are navigable", async ({ page }) => {
  const slugs = [
    "five-signs-your-website-is-costing-you-work",
    "why-accessibility-matters-for-local-business",
    "speed-trust-and-google",
    "what-good-ux-looks-like-on-a-trade-website",
  ];
  for (const slug of slugs) {
    await page.goto(`/resources/${slug}`);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".article-body")).toBeVisible();
  }
});

test("articles use site check not audit in visible text", async ({ page }) => {
  const slugs = [
    "five-signs-your-website-is-costing-you-work",
    "why-accessibility-matters-for-local-business",
    "speed-trust-and-google",
    "what-good-ux-looks-like-on-a-trade-website",
  ];
  for (const slug of slugs) {
    await page.goto(`/resources/${slug}`);
    const text = await page.locator(".article-body").innerText();
    expect(text).not.toContain("free AI audit");
    expect(text).not.toContain("the free audit");
  }
});

test("privacy page loads and has expected sections", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.locator("h1")).toContainText("Privacy");
  const body = page.locator(".article-body");
  await expect(body).toContainText("site check tool");
  await expect(body).toContainText("contact form");
  await expect(body).toContainText("Privacy Act 2020");
});

test("privacy page is reachable from the footer", async ({ page }) => {
  await page.goto("/");
  await page.locator("footer").getByRole("link", { name: "Privacy" }).click();
  await expect(page.locator("h1")).toContainText("Privacy");
});

test("about page loads with expected content", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator("h1")).toContainText("Built by an engineer");
  const body = page.locator(".article-body");
  await expect(body).toContainText("four years");
  await expect(body).toContainText("quality assurance");
  await expect(body).toContainText("care plan");
  await expect(body).toContainText("optional");
});

test("about page links to site check and contact", async ({ page }) => {
  await page.goto("/about");
  await expect(
    page.locator('.article-body').getByRole("link", { name: /site check/i })
  ).toBeVisible();
  await expect(
    page.locator('.article-body').getByRole("link", { name: /get in touch/i })
  ).toBeVisible();
});

test("about page is reachable from nav", async ({ page }) => {
  await page.goto("/");
  await page.locator(".nav-links").getByRole("link", { name: "About" }).click();
  await expect(page.locator("h1")).toContainText("Built by an engineer");
});

test("404 page returns for invalid routes", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
});
