import { test, expect } from "@playwright/test";

/**
 * Interaction coverage: every element a visitor can click, type in, or
 * trigger gets exercised here. Organised by page region. Elements already
 * deeply tested elsewhere (audit input validation, contact form states,
 * security) are not duplicated - this file closes the gaps so that EVERY
 * interactive element has at least one test that proves it responds.
 */

// ---------------- Nav ----------------
// Below 900px (tablet and mobile), the four secondary links move behind a
// hamburger toggle; the CTA pill stays visible at every width. Each test
// below opens the panel first when the project is narrower than desktop,
// so the same intent is verified correctly on every device rather than
// assuming the desktop-only inline layout.

async function openMobileNavIfNeeded(page: import("@playwright/test").Page, isDesktop: boolean) {
  if (isDesktop) return;
  const toggle = page.locator(".nav-toggle");
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(page.locator(".nav-panel")).toHaveClass(/open/);
}

test.describe("nav: every link responds", () => {
  test("logo links home", async ({ page }) => {
    await page.goto("/about");
    await page.locator(".site-nav .logo").click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("h1.hero-title")).toBeVisible();
  });

  test("Site Check link scrolls to the audit module", async ({ page }, testInfo) => {
    const isDesktop = testInfo.project.name === "desktop";
    await page.goto("/");
    await openMobileNavIfNeeded(page, isDesktop);
    const scope = isDesktop ? page.locator(".site-nav") : page.locator(".nav-panel");
    await scope.getByRole("link", { name: "Site Check" }).click();
    await expect(page.locator("#audit")).toBeInViewport();
  });

  test("Pricing link scrolls to pricing", async ({ page }, testInfo) => {
    const isDesktop = testInfo.project.name === "desktop";
    await page.goto("/");
    await openMobileNavIfNeeded(page, isDesktop);
    const scope = isDesktop ? page.locator(".site-nav") : page.locator(".nav-panel");
    await scope.getByRole("link", { name: "Pricing", exact: true }).click();
    await expect(page.locator("#pricing")).toBeInViewport();
  });

  test("Resources link navigates to the resources index", async ({ page }, testInfo) => {
    const isDesktop = testInfo.project.name === "desktop";
    await page.goto("/");
    await openMobileNavIfNeeded(page, isDesktop);
    const scope = isDesktop ? page.locator(".site-nav") : page.locator(".nav-panel");
    await scope.getByRole("link", { name: "Resources" }).click();
    await expect(page).toHaveURL(/\/resources$/);
  });

  test("About link navigates to about", async ({ page }, testInfo) => {
    const isDesktop = testInfo.project.name === "desktop";
    await page.goto("/");
    await openMobileNavIfNeeded(page, isDesktop);
    const scope = isDesktop ? page.locator(".site-nav") : page.locator(".nav-panel");
    await scope.getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about$/);
  });

  test("Start a project CTA reaches the contact section", async ({ page }, testInfo) => {
    const isDesktop = testInfo.project.name === "desktop";
    await page.goto("/");
    if (isDesktop) {
      // Desktop: the CTA pill sits in the top bar.
      await page.locator(".site-nav").getByRole("link", { name: /start a project/i }).click();
    } else {
      // Tablet/mobile: the top bar is just wordmark + menu icon; the CTA
      // lives inside the hamburger panel (keeps the top bar uncrowded).
      await openMobileNavIfNeeded(page, false);
      await page.locator(".nav-panel").getByRole("link", { name: /start a project/i }).click();
    }
    await expect(page.locator("#contact")).toBeInViewport();
  });
});

// ---------------- Hamburger menu (tablet + mobile) ----------------

test.describe("hamburger menu (tablet + mobile only)", () => {
  test("toggle opens and closes the panel, and every link is present", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "desktop", "desktop shows inline links, no hamburger");
    await page.goto("/");
    const toggle = page.locator(".nav-toggle");
    const panel = page.locator(".nav-panel");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toHaveClass(/open/);
    for (const label of ["Site Check", "Pricing", "Resources", "About"]) {
      await expect(panel.getByRole("link", { name: label })).toBeVisible();
    }
    // The primary CTA now lives in the panel too (moved out of the top bar
    // so tablet/mobile top bars stay uncrowded).
    await expect(panel.getByRole("link", { name: /start a project/i })).toBeVisible();
    // Toggling again closes it.
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(panel).not.toHaveClass(/open/);
  });

  test("Escape key closes the open panel", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "desktop", "desktop shows inline links, no hamburger");
    await page.goto("/");
    await page.locator(".nav-toggle").click();
    await expect(page.locator(".nav-panel")).toHaveClass(/open/);
    await page.keyboard.press("Escape");
    await expect(page.locator(".nav-panel")).not.toHaveClass(/open/);
  });

  test("clicking a link inside the panel closes it and navigates", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "desktop", "desktop shows inline links, no hamburger");
    await page.goto("/");
    await page.locator(".nav-toggle").click();
    await page.locator(".nav-panel").getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about$/);
    // Panel should not still be forced open on the new page.
    await expect(page.locator(".nav-panel")).not.toHaveClass(/open/);
  });

  test("desktop shows the full link row directly, with no hamburger toggle", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop-only assertion");
    await page.goto("/");
    await expect(page.locator(".nav-toggle")).not.toBeVisible();
    for (const label of ["Site Check", "Pricing", "Resources", "About"]) {
      await expect(page.locator(".site-nav").getByRole("link", { name: label })).toBeVisible();
    }
    // Desktop top bar keeps the CTA pill inline.
    await expect(
      page.locator(".site-nav .nav-links").getByRole("link", { name: /start a project/i })
    ).toBeVisible();
  });

  test("tablet/mobile top bar is uncrowded: only wordmark + menu icon, no inline links or pill", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "desktop", "narrow-viewport assertion");
    await page.goto("/");
    // The whole inline link group (secondary links AND the CTA pill) is
    // hidden in the top bar; navigation is via the toggle.
    await expect(page.locator(".site-nav .nav-links")).not.toBeVisible();
    await expect(page.locator(".nav-toggle")).toBeVisible();
    await expect(page.locator(".site-nav .logo")).toBeVisible();
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
    const email = page.locator(".foot-cta a.foot-email");
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
    const email = page.locator(".foot-cta a.foot-email");
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
    // The email carries its icon via a ::before mask box; the phone now
    // carries an inline SVG in markup (more robust than a mask).
    const emailIconW = await page
      .locator(".foot-cta a.foot-email")
      .evaluate((el) => getComputedStyle(el, "::before").width);
    expect(emailIconW).toBe("14px");
    await expect(page.locator(".foot-phone svg.foot-phone-icon")).toBeVisible();
  });

  test("desktop footer email and phone are a matched, equal-width pill pair", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop-only layout");
    await page.goto("/");
    const email = page.locator(".foot-cta a.foot-email");
    const phone = page.locator(".foot-cta a.foot-phone");
    await email.scrollIntoViewIfNeeded();
    // Still a working tel: link.
    await expect(phone).toHaveAttribute("href", "tel:+642041343263");
    // Carries an inline SVG handset icon (rendered from markup, not a CSS
    // mask - masks with raw inline SVG were silently failing to render).
    await expect(phone.locator("svg.foot-phone-icon")).toBeVisible();
    // Both are pills - the phone matches the email's shape language rather
    // than hanging beneath it as bare text.
    for (const el of [email, phone]) {
      const border = await el.evaluate((n) => getComputedStyle(n).borderTopWidth);
      expect(parseFloat(border)).toBeGreaterThan(0);
    }
    const eb = await email.boundingBox();
    const pb = await phone.boundingBox();
    expect(eb).not.toBeNull();
    expect(pb).not.toBeNull();
    // Equal width and aligned edges: one deliberate contact block.
    expect(Math.abs(eb!.width - pb!.width)).toBeLessThan(2);
    expect(Math.abs(eb!.x - pb!.x)).toBeLessThan(2);
    // Phone sits below the email, not beside it.
    expect(pb!.y).toBeGreaterThan(eb!.y + eb!.height - 2);
    // The icon must sit INLINE with the number, not wrap onto its own line:
    // the pill's height stays close to a single line of content.
    expect(pb!.height).toBeLessThan(60);
  });
});
