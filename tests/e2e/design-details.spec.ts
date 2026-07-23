import { test, expect } from "@playwright/test";

/**
 * Design-detail regressions for the visual pass: the site-check panel's
 * defaults and report structure, the footer's two-column composition, the
 * contact card's column alignment, and the disciplined use of the gold
 * section dot (headers only, never on cards).
 */

// ---------------- Site check panel ----------------

test.describe("site check panel", () => {
  test("example score is the current default, and the old placeholder is gone", async ({ page }) => {
    await page.goto("/#audit");
    const score = page.locator(".score-num");
    await expect(score).toHaveText("58");
    // 42 was the previous placeholder and read as generic; it must not
    // reappear as the resting default.
    await expect(score).not.toHaveText("42");
  });

  test("a one-word verdict chip sits beside the score", async ({ page }) => {
    await page.goto("/#audit");
    const chip = page.locator(".score-chip");
    await expect(chip).toBeVisible();
    await expect(chip).toHaveText(/strong|decent|underperforming|losing work/i);
    // It sits on the same line as the number, to its right.
    const nb = await page.locator(".score-num").boundingBox();
    const cb = await chip.boundingBox();
    expect(cb!.x).toBeGreaterThan(nb!.x + nb!.width - 2);
  });

  test("category rows are hairline-separated so the panel reads as a report", async ({ page }) => {
    await page.goto("/#audit");
    const rows = page.locator(".bar-row");
    await expect(rows).toHaveCount(5);
    const border = await rows
      .first()
      .evaluate((el) => getComputedStyle(el).borderBottomWidth);
    expect(parseFloat(border)).toBeGreaterThan(0);
  });

  test("every category row shows a label, meter and score", async ({ page }) => {
    await page.goto("/#audit");
    for (const cat of [
      "message",
      "action",
      "content",
      "foundations",
      "credibility",
    ]) {
      const row = page.locator(".bar-row", { hasText: new RegExp(cat, "i") });
      await expect(row.locator(".bar-label")).toBeVisible();
      await expect(row.locator(".dotrow")).toBeVisible();
      await expect(row.locator(".bar-val")).toHaveText(/^\d+$/);
    }
  });
});

// ---------------- Footer composition ----------------

test.describe("footer composition", () => {
  test("nav links sit on a single clean row inside the brand block", async ({ page }, testInfo) => {
    await page.goto("/");
    const nav = page.locator(".foot-nav");
    await nav.scrollIntoViewIfNeeded();
    // The nav is a descendant of the brand block (wordmark + place + links).
    await expect(page.locator(".foot-brand .foot-nav")).toHaveCount(1);
    await expect(nav.locator("a")).toHaveCount(6);
    if (testInfo.project.name === "desktop") {
      // All six share one baseline - no ragged multi-row grid.
      const tops = await nav
        .locator("a")
        .evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
      const spread = Math.max(...tops) - Math.min(...tops);
      expect(spread).toBeLessThan(4);
    }
  });

  test("nav links align to the wordmark's left edge", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop composition");
    await page.goto("/");
    const logo = await page.locator(".foot-logo").boundingBox();
    const firstLink = await page.locator(".foot-nav a").first().boundingBox();
    expect(logo).not.toBeNull();
    expect(firstLink).not.toBeNull();
    // Same column, so the same left edge (within a couple of px).
    expect(Math.abs(logo!.x - firstLink!.x)).toBeLessThan(3);
  });

  test("the place line uses a location pin icon, not the section dot", async ({ page }) => {
    await page.goto("/");
    const place = page.locator(".foot-place");
    await place.scrollIntoViewIfNeeded();
    await expect(place).toContainText(/Aotearoa/i);
    await expect(place.locator("svg.foot-place-icon")).toBeVisible();
    // The gold section dot is reserved for section headers.
    await expect(place.locator(".dot")).toHaveCount(0);
  });

  test("the legal line is separated by a single closing hairline", async ({ page }) => {
    await page.goto("/");
    const bottom = page.locator(".foot-bottom");
    await bottom.scrollIntoViewIfNeeded();
    const border = await bottom.evaluate(
      (el) => getComputedStyle(el).borderTopWidth
    );
    expect(parseFloat(border)).toBeGreaterThan(0);
  });
});

// ---------------- Contact card alignment ----------------

test.describe("contact card alignment", () => {
  test("the send button hugs its content and does not stretch across the form", async ({ page }) => {
    await page.goto("/#contact");
    const submit = page.locator(".form-submit");
    await submit.scrollIntoViewIfNeeded();
    const sb = await submit.boundingBox();
    // The name field spans the form's full width; the button must be a
    // fraction of it, not stretched to match (a flex-stretch regression).
    const field = await page.getByLabel(/your name/i).boundingBox();
    expect(sb).not.toBeNull();
    expect(field).not.toBeNull();
    expect(sb!.width).toBeLessThan(field!.width * 0.6);
    // And it starts at the form's left edge.
    expect(Math.abs(sb!.x - field!.x)).toBeLessThan(3);
  });

  test("the direct contact cards bottom-align with the send button", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "two-column desktop layout");
    await page.goto("/#contact");
    const direct = page.locator(".contact-direct");
    const submit = page.locator(".form-submit");
    await direct.scrollIntoViewIfNeeded();
    const db = await direct.boundingBox();
    const sb = await submit.boundingBox();
    expect(db).not.toBeNull();
    expect(sb).not.toBeNull();
    // Their base lines should sit close together rather than the button
    // hanging noticeably below the phone card.
    const dBottom = db!.y + db!.height;
    const sBottom = sb!.y + sb!.height;
    expect(Math.abs(dBottom - sBottom)).toBeLessThan(24);
  });
});

// ---------------- Section dot discipline ----------------

test.describe("section dot is used sparingly", () => {
  test("section headers carry the gold dot", async ({ page }) => {
    await page.goto("/");
    // The audit, pricing and contact section labels each keep their dot.
    for (const id of ["#audit", "#pricing", "#contact"]) {
      const section = page.locator(id);
      await expect(section.locator(".mono .dot").first()).toBeAttached();
    }
  });

  test("resource cards do not repeat the dot on their tag", async ({ page }) => {
    await page.goto("/resources");
    const cards = page.locator("a.res-card");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i).locator(".dot")).toHaveCount(0);
    }
  });

  test("article page tag does not carry a dot", async ({ page }) => {
    await page.goto("/resources/speed-trust-and-google");
    await expect(page.locator(".article-topbar .dot")).toHaveCount(0);
    // The tag text itself is still there.
    await expect(page.locator(".article-topbar .mono")).toContainText(/\w/);
  });
});
