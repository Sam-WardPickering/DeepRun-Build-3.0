import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("hero headline renders with correct word spacing", async ({ page }) => {
  await expect(page.locator("h1")).toContainText("Websites that win work.");
});

test("hero sub-text sets honest expectations about ongoing care", async ({ page }) => {
  const sub = page.locator(".hero-sub");
  // "as long as you want us around" - ongoing care is the client's choice
  await expect(sub).toContainText("as long as you want us");
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

test("manifesto copy never implies bundled management", async ({ page }) => {
  const manifesto = page.locator(".manifesto p");
  await expect(manifesto).toContainText("fixed price");
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

test("favicon is served", async ({ page }) => {
  // Next.js injects a <link rel="icon"> for app/icon.svg automatically.
  const icon = page.locator('link[rel="icon"]').first();
  await expect(icon).toHaveAttribute("href", /icon/);
  const href = await icon.getAttribute("href");
  const res = await page.request.get(href!);
  expect(res.ok()).toBe(true);
});

test("section dots fill gold when scrolled into view", async ({ page }) => {
  const pricingDot = page.locator("#pricing .mono .dot").first();
  await expect(pricingDot).not.toHaveClass(/lit/);
  await page.locator("#pricing").scrollIntoViewIfNeeded();
  await expect(pricingDot).toHaveClass(/lit/);
});

test("pricing and resources sections share the same left edge", async ({ page }) => {
  // Regression guard for the alignment bug where .resources carried the
  // .wrap class directly and its own padding wiped out the gutters.
  await page.locator("#resources").scrollIntoViewIfNeeded();
  const pricingBox = await page.locator("#pricing .wrap").boundingBox();
  const resourcesBox = await page.locator("#resources .wrap").boundingBox();
  expect(pricingBox).not.toBeNull();
  expect(resourcesBox).not.toBeNull();
  expect(Math.abs(pricingBox!.x - resourcesBox!.x)).toBeLessThan(2);
});

test("audit card powers up when scrolled into view", async ({ page }) => {
  const card = page.locator(".audit-card");
  await expect(card).toHaveAttribute("data-pw", "flicker");
  await page.locator("#audit").scrollIntoViewIfNeeded();
  await expect(card).toHaveClass(/on/);
  // Its contents rise in after it
  await expect(page.locator(".audit-left")).toHaveClass(/on/);
});

test("resource cards power up with the section", async ({ page }) => {
  const firstCard = page.locator("#resources .res-card").first();
  await page.locator("#resources").scrollIntoViewIfNeeded();
  await expect(firstCard).toHaveClass(/on/);
});

test("contact card powers up when scrolled into view", async ({ page }) => {
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(page.locator(".contact-card")).toHaveClass(/on/);
});

test("browser tab title uses title case", async ({ page }) => {
  await expect(page).toHaveTitle("Deep Run - Websites That Win Work");
});

test("nav uses Site Check casing", async ({ page }) => {
  await expect(
    page.locator(".nav-links").getByRole("link", { name: "Site Check" })
  ).toHaveText("Site Check");
});

test("pricing tilt cards sit directly inside the perspective container", async ({ page }) => {
  // Regression guard: a wrapper div between .cards (which owns the CSS
  // perspective) and .tilt flattens the 3D hover effect - perspective
  // only applies to direct children.
  const count = await page.locator(".cards > .tilt").count();
  expect(count).toBe(4);
});

test("resource card hover lift still works after reveal", async ({ page }) => {
  // Regression guard: the reveal system must never override the hover
  // transform (this happened when reveals used transition + transform).
  await page.locator("#resources").scrollIntoViewIfNeeded();
  const card = page.locator("#resources .res-card").first();
  await expect(card).toHaveClass(/on/);
  const before = (await card.boundingBox())!.y;
  await card.hover();
  await page.waitForTimeout(500); // let the lift transition finish
  const after = (await card.boundingBox())!.y;
  expect(before - after).toBeGreaterThan(2); // lifted upward
});
