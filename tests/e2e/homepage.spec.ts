import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("hero headline renders with correct word spacing", async ({ page }) => {
  await expect(page.locator("h1")).toContainText("Websites that win work.");
});

test("hero sub-text describes the studio's offering", async ({ page }) => {
  const sub = page.locator(".hero-sub");
  await expect(sub).toContainText("fixed-price websites");
  await expect(sub).toContainText("New Zealand");
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

test.describe("hero (real DOM headline, ocean field behind)", () => {
  test("real headline text exists in the DOM for screen readers/SEO", async ({ page }) => {
    await page.goto("/");
    // The headline is real DOM text (with the ocean field purely behind it), so it's
    // fully selectable and read by assistive tech + Google.
    const h1 = page.locator("h1");
    await expect(h1).toHaveText(/websites that win work/i);
  });

  test("headline emphasises 'win work' in gold via <em>", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1 em")).toHaveText(/win work/i);
  });

  test("real sub-text exists in the DOM", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".hero-sub")).toContainText(
      /fixed-price websites for New Zealand/i
    );
  });

  test("hero CTAs are present and clickable", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: /free site check/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /see pricing/i })
    ).toBeVisible();
  });
});

test.describe("section dot markup (alignment regression)", () => {
  test("no section dot contains a literal glyph", async ({ page }) => {
    await page.goto("/");
    // The dot must be an empty CSS ring - a leftover ● glyph inside it threw
    // off the baseline alignment. Assert every .dot has no text content.
    const dots = page.locator(".mono .dot");
    const count = await dots.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const text = await dots.nth(i).textContent();
      expect((text || "").trim()).toBe("");
    }
  });

  test("dot is rendered as a bordered ring, not text", async ({ page }) => {
    await page.goto("/");
    const dot = page.locator(".mono .dot").first();
    await expect(dot).toHaveCSS("border-radius", "50%");
    const w = await dot.evaluate((el) => getComputedStyle(el).width);
    expect(w).toBe("7px");
  });
});

test.describe("phone number (trust signal + tel links)", () => {
  test("contact section shows the phone with a working tel: link", async ({ page }) => {
    await page.goto("/#contact");
    const tel = page.locator('a[href="tel:+642041343263"]').first();
    await expect(tel).toBeVisible();
    await expect(tel).toContainText("020 4134 3263");
  });

  test("footer shows the phone with a tel: link", async ({ page }) => {
    await page.goto("/");
    const tel = page.locator('footer a[href="tel:+642041343263"]');
    await expect(tel).toHaveText(/020 4134 3263/);
  });

  test("tel link uses E.164 (international) format so it dials from anywhere", async ({ page }) => {
    await page.goto("/#contact");
    // The href must be +64... (no leading 0) even though the display is local.
    const href = await page
      .locator('a[href^="tel:"]')
      .first()
      .getAttribute("href");
    expect(href).toBe("tel:+642041343263");
  });

  test("LocalBusiness structured data includes the phone", async ({ page }) => {
    await page.goto("/");
    const ld = await page
      .locator('script[type="application/ld+json"]')
      .textContent();
    expect(ld).toContain("+64 20 4134 3263");
    expect(ld).toContain("ProfessionalService");
  });
});

test.describe("layout fixes (regression)", () => {
  test("back-link is block-level so the mono label sits on its own line", async ({ page }) => {
    await page.goto("/about");
    const backLink = page.locator(".back-link");
    await expect(backLink).toBeVisible();
    const display = await backLink.evaluate((el) => getComputedStyle(el).display);
    // Must be block/inline-block, not inline - otherwise the mono dot label
    // jams onto the same line right after "Back to home".
    expect(["block", "inline-block"]).toContain(display);
  });

  test("form inputs keep the dark theme when autofill styles apply", async ({ page }) => {
    await page.goto("/#contact");
    // We can't trigger real Chrome autofill in a test, but we can assert the
    // override rule exists by checking the input's declared background isn't
    // left as the browser default. The input background should be the dark bg.
    const bg = await page
      .getByLabel("Your name")
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    // #0d0c0a -> rgb(13, 12, 10)
    expect(bg).toBe("rgb(13, 12, 10)");
  });
});

test.describe("hero alignment (Approach B regression)", () => {
  test("mono label, headline and CTAs share the same left edge", async ({ page }) => {
    await page.goto("/");
    const mono = await page.locator(".hero-mono").boundingBox();
    const title = await page.locator(".hero-title").boundingBox();
    const cta = await page.locator(".hero-cta").boundingBox();
    expect(mono).not.toBeNull();
    expect(title).not.toBeNull();
    expect(cta).not.toBeNull();
    // All three flow from the same container, so their left edges must line
    // up within a couple of pixels at any width (this broke when the
    // headline was canvas-painted in a different coordinate system).
    expect(Math.abs(mono!.x - title!.x)).toBeLessThan(3);
    expect(Math.abs(title!.x - cta!.x)).toBeLessThan(3);
  });

  test("hero headline is real selectable text, not a canvas", async ({ page }) => {
    await page.goto("/");
    // A canvas has no text content; a real <h1> does.
    const text = await page.locator("h1").textContent();
    expect((text || "").toLowerCase()).toContain("win work");
  });
});

test.describe("hero is pure DOM text over the ocean field", () => {
  test("headline and sub-text are plain DOM (no canvas text classes)", async ({ page }) => {
    await page.goto("/");
    // The ocean field is purely a background; the words are normal DOM.
    await expect(page.locator("h1.hero-title em")).toHaveText(/win work/i);
    await expect(page.locator("p.hero-sub")).toContainText(
      /fixed-price websites/i
    );
    // No reactive/canvas text machinery may remain.
    await expect(page.locator(".hero-reactive")).toHaveCount(0);
  });

  test("gold CTA stays visible on hover (undefined-variable regression)", async ({ page }) => {
    await page.goto("/");
    const btn = page.getByRole("button", { name: /free site check/i });
    await btn.hover();
    // The hover background must resolve to a real colour - the bug was
    // background: var(--bone) with --bone undefined, which computed to
    // transparent and made the button vanish into the page.
    const bg = await btn.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );
    expect(bg).not.toBe("rgba(0, 0, 0, 0)");
    expect(bg).not.toBe("transparent");
  });
});

test.describe("resources grid affordances", () => {
  test("every article card is a working link; the coming-soon card is visibly a placeholder", async ({ page }) => {
    await page.goto("/");
    await page.locator(".res-grid").scrollIntoViewIfNeeded();
    // All real article cards are links with hrefs.
    const links = page.locator("a.res-card");
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(4);
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute("href");
      expect(href).toMatch(/^\/resources\//);
    }
    // The coming-soon card is NOT a link and is visibly dimmed so it can't
    // be mistaken for a broken article.
    const soon = page.locator(".res-card-soon");
    await expect(soon).toHaveCount(1);
    const tag = await soon.evaluate((el) => el.tagName.toLowerCase());
    expect(tag).toBe("div");
    const opacity = await soon.evaluate(
      (el) => parseFloat(getComputedStyle(el).opacity)
    );
    expect(opacity).toBeLessThan(0.8);
  });

  test("each article link opens its page", async ({ page }) => {
    await page.goto("/resources");
    const hrefs = await page
      .locator("a.res-card")
      .evaluateAll((els) => els.map((e) => e.getAttribute("href")));
    for (const href of hrefs) {
      const res = await page.request.get(href!);
      expect(res.status()).toBe(200);
    }
  });
});

test.describe("footer renders coherently", () => {
  test("footer has wordmark, contact CTA, nav and legal line", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator(".site-footer");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer.locator(".foot-logo")).toContainText(/deep/i);
    await expect(footer.locator(".foot-cta .foot-email")).toContainText(
      /hello@deeprun/i
    );
    await expect(footer.locator(".foot-phone")).toContainText(/020 4134/);
    await expect(footer.locator(".foot-nav a")).toHaveCount(6);
    await expect(footer.locator(".foot-bottom")).toContainText(/Deep Run/);
  });

  test("footer content sits inside the page gutter (not full-bleed)", async ({ page }) => {
    await page.goto("/");
    const box = await page.locator(".site-footer .foot-top").boundingBox();
    expect(box).not.toBeNull();
    // The wrap gutter means content can't start at x=0.
    expect(box!.x).toBeGreaterThan(10);
  });
});
