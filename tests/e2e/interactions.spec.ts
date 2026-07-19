import { test, expect } from "@playwright/test";

/**
 * Interaction coverage: every element a visitor can click, type in, or
 * trigger gets exercised here. Organised by page region. Elements already
 * deeply tested elsewhere (audit input validation, contact form states,
 * security) are not duplicated - this file closes the gaps so that EVERY
 * interactive element has at least one test that proves it responds.
 */

// ---------------- Nav ----------------

test.describe("nav: every link responds", () => {
  test("logo links home", async ({ page }) => {
    await page.goto("/about");
    await page.locator(".site-nav .logo").click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("h1.hero-title")).toBeVisible();
  });

  test("Site Check link scrolls to the audit module", async ({ page }) => {
    await page.goto("/");
    await page.locator(".site-nav").getByRole("link", { name: "Site Check" }).click();
    await expect(page.locator("#audit")).toBeInViewport();
  });

  test("Pricing link scrolls to pricing", async ({ page }) => {
    await page.goto("/");
    await page.locator(".site-nav").getByRole("link", { name: "Pricing", exact: true }).click();
    await expect(page.locator("#pricing")).toBeInViewport();
  });

  test("Resources link navigates to the resources index", async ({ page }) => {
    await page.goto("/");
    await page.locator(".site-nav").getByRole("link", { name: "Resources" }).click();
    await expect(page).toHaveURL(/\/resources$/);
  });

  test("About link navigates to about", async ({ page }) => {
    await page.goto("/");
    await page.locator(".site-nav").getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about$/);
  });

  test("Start a project pill reaches the contact section", async ({ page }) => {
    await page.goto("/");
    await page.locator(".site-nav").getByRole("link", { name: /start a project/i }).click();
    await expect(page.locator("#contact")).toBeInViewport();
  });
});

// ---------------- Hero ----------------

test.describe("hero: both CTAs respond", () => {
  test("See pricing button scrolls to pricing", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /see pricing/i }).click();
    await expect(page.locator("#pricing")).toBeInViewport();
  });
  // (The gold "free site check" button is covered in homepage.spec, both
  // for scrolling and for its hover-visibility regression.)
});

// ---------------- Audit module ----------------

test.describe("audit module: control states", () => {
  test("check button shows Reading state and disables while a scan runs", async ({ page }) => {
    await page.route("**/api/audit", async (route) => {
      await new Promise((r) => setTimeout(r, 700));
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          url: "https://example.co.nz", https: true, total: 60,
          verdict: "ok",
          scores: { message: 60, action: 60, content: 60, foundations: 60, credibility: 60 },
          findings: [],
        }),
      });
    });
    await page.goto("/#audit");
    await page.getByLabel("Your website address").fill("example.co.nz");
    const btn = page.getByRole("button", { name: /check my site/i });
    await btn.click();
    // While in flight: label flips and the button refuses double-clicks.
    const reading = page.getByRole("button", { name: /reading/i });
    await expect(reading).toBeVisible();
    await expect(reading).toBeDisabled();
    // After it lands the button returns to normal.
    await expect(page.getByRole("button", { name: /check my site/i })).toBeEnabled();
  });

  test("typing in the URL input updates its value", async ({ page }) => {
    await page.goto("/#audit");
    const input = page.getByLabel("Your website address");
    await input.fill("mysite.co.nz");
    await expect(input).toHaveValue("mysite.co.nz");
  });
});

// ---------------- Pricing ----------------

test.describe("pricing: every tier CTA responds and pre-selects its tier", () => {
  for (const tier of ["Starter", "Business", "Enhanced", "Care plan"]) {
    test(`${tier} CTA scrolls to contact and selects the ${tier} tier`, async ({ page }) => {
      await page.goto("/#pricing");
      // Tier cards render as TiltCard -> .tilt; scope by the tier's name.
      const card = page.locator(".cards .tilt", { hasText: tier }).first();
      await card.scrollIntoViewIfNeeded();
      await card.locator("a.tier-cta").click();
      await expect(page.locator("#contact")).toBeInViewport();
      const badge = page.locator(".form-tier-badge");
      await expect(badge).toBeVisible();
      await expect(badge).toContainText(new RegExp(tier, "i"));
    });
  }
});

// ---------------- Contact form ----------------

test.describe("contact form: every field accepts input", () => {
  test("name, email, phone and message fields all hold typed values", async ({ page }) => {
    await page.goto("/#contact");
    await page.getByLabel(/your name/i).fill("Test Person");
    await page.getByLabel(/email/i).fill("test@example.co.nz");
    await page.getByLabel(/phone/i).fill("021 123 4567");
    await page.getByLabel(/what do you need/i).fill("A new site for my plumbing business.");
    await expect(page.getByLabel(/your name/i)).toHaveValue("Test Person");
    await expect(page.getByLabel(/email/i)).toHaveValue("test@example.co.nz");
    await expect(page.getByLabel(/phone/i)).toHaveValue("021 123 4567");
    await expect(page.getByLabel(/what do you need/i)).toHaveValue(
      "A new site for my plumbing business."
    );
  });

  test("send button enables once required fields are valid", async ({ page }) => {
    await page.goto("/#contact");
    const send = page.getByRole("button", { name: /send enquiry/i });
    await expect(send).toHaveClass(/disabled/);
    await page.getByLabel(/your name/i).fill("Test Person");
    await page.getByLabel(/email/i).fill("test@example.co.nz");
    await page.getByLabel(/what do you need/i).fill("Need a website.");
    await expect(send).not.toHaveClass(/disabled/);
  });
});

// ---------------- Footer ----------------

test.describe("footer: every link responds or targets correctly", () => {
  test("email pill carries the correct mailto address", async ({ page }) => {
    await page.goto("/");
    const email = page.locator(".foot-cta a.pill");
    await expect(email).toHaveAttribute("href", "mailto:hello@deeprun.co.nz");
  });

  test("phone link carries the correct E.164 tel target", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".foot-phone")).toHaveAttribute(
      "href",
      "tel:+642041343263"
    );
  });

  test("Site Check footer link scrolls to the audit module", async ({ page }) => {
    await page.goto("/");
    await page.locator(".foot-nav").getByRole("link", { name: "Site Check" }).click();
    await expect(page.locator("#audit")).toBeInViewport();
  });

  test("Pricing footer link scrolls to pricing", async ({ page }) => {
    await page.goto("/");
    await page.locator(".foot-nav").getByRole("link", { name: "Pricing" }).click();
    await expect(page.locator("#pricing")).toBeInViewport();
  });

  test("Resources footer link navigates to the index", async ({ page }) => {
    await page.goto("/");
    await page.locator(".foot-nav").getByRole("link", { name: "Resources" }).click();
    await expect(page).toHaveURL(/\/resources$/);
  });

  test("Contact footer link scrolls to contact", async ({ page }) => {
    await page.goto("/");
    await page.locator(".foot-nav").getByRole("link", { name: "Contact" }).click();
    await expect(page.locator("#contact")).toBeInViewport();
  });

  test("About footer link navigates to about", async ({ page }) => {
    await page.goto("/");
    await page.locator(".foot-nav").getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about$/);
  });

  test("Privacy footer link navigates to privacy", async ({ page }) => {
    await page.goto("/");
    await page.locator(".foot-nav").getByRole("link", { name: "Privacy" }).click();
    await expect(page).toHaveURL(/\/privacy$/);
  });
});

// ---------------- Back-links ----------------

test.describe("back-links: every one navigates", () => {
  test("article back-link returns to the resources index", async ({ page }) => {
    await page.goto("/resources/speed-trust-and-google");
    await page.locator(".back-link").click();
    await expect(page).toHaveURL(/\/resources$/);
  });

  test("about back-link returns home", async ({ page }) => {
    await page.goto("/about");
    await page.locator(".back-link").click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("privacy back-link returns home", async ({ page }) => {
    await page.goto("/privacy");
    await page.locator(".back-link").click();
    await expect(page).toHaveURL(/\/$/);
  });
});

// ---------------- Resource cards ----------------

test.describe("resource cards: every card responds appropriately", () => {
  test("first article card click navigates to its article", async ({ page }) => {
    await page.goto("/");
    const first = page.locator("a.res-card").first();
    await first.scrollIntoViewIfNeeded();
    const href = await first.getAttribute("href");
    await first.click();
    await expect(page).toHaveURL(new RegExp(href!.replace(/\//g, "\\/")));
    await expect(page.locator(".article h1")).toBeVisible();
  });

  test("coming-soon card does not navigate on click", async ({ page }) => {
    await page.goto("/");
    const soon = page.locator(".res-card-soon");
    await soon.scrollIntoViewIfNeeded();
    const urlBefore = page.url();
    await soon.click();
    await page.waitForTimeout(300);
    expect(page.url()).toBe(urlBefore);
  });
});

// ---------------- Mobile layout regressions ----------------

test.describe("mobile layout", () => {
  test("checker input and button stack full-width on small screens", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile project only");
    await page.goto("/#audit");
    const input = page.getByLabel("Your website address");
    const btn = page.getByRole("button", { name: /check my site/i });
    const ib = await input.boundingBox();
    const bb = await btn.boundingBox();
    expect(ib).not.toBeNull();
    expect(bb).not.toBeNull();
    // Stacked: button sits below the input, and both span nearly the full card.
    expect(bb!.y).toBeGreaterThan(ib!.y + ib!.height - 2);
    expect(Math.abs(ib!.width - bb!.width)).toBeLessThan(30);
  });

  test("footer email and phone are matched quiet text lines on mobile", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile project only");
    await page.goto("/");
    const email = page.locator(".foot-cta a.pill");
    await email.scrollIntoViewIfNeeded();
    // The email drops its pill costume on mobile: no background, mono type
    // matching the phone line.
    const emailStyle = await email.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { bg: cs.backgroundColor, size: cs.fontSize };
    });
    expect(emailStyle.bg).toBe("rgba(0, 0, 0, 0)");
    const phoneStyle = await page.locator(".foot-phone").evaluate((el) => {
      const cs = getComputedStyle(el);
      return { size: cs.fontSize };
    });
    // Same type size = balanced pair.
    expect(emailStyle.size).toBe(phoneStyle.size);
    // Both carry a proportional icon (the ::before mask box).
    for (const sel of [".foot-cta a.pill", ".foot-phone"]) {
      const iconW = await page.locator(sel).evaluate(
        (el) => getComputedStyle(el, "::before").width
      );
      expect(iconW).toBe("14px");
    }
  });
});
