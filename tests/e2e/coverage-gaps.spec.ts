import { test, expect } from "@playwright/test";

/**
 * Closes gaps found in a full coverage audit of the existing suite:
 * SEO infrastructure (robots/sitemap), social meta tags, reduced-motion
 * behaviour, the contact form's own rate limiter (only the audit route's
 * limiter had a test), structured-data validity, and a console-error
 * smoke test across the main pages using the production server the E2E
 * suite already runs against.
 */

// ---------------- SEO infrastructure ----------------

test.describe("SEO: robots and sitemap are served correctly", () => {
  test("robots.txt allows crawling and points at the sitemap", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toMatch(/User-agent:\s*\*/i);
    expect(body).toMatch(/Allow:\s*\//i);
    expect(body).toContain("sitemap.xml");
  });

  test("sitemap.xml is valid XML and lists every page including all articles", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("<?xml");
    expect(body).toContain("<urlset");
    for (const path of [
      "https://deeprun.co.nz</loc>",
      "/about</loc>",
      "/privacy</loc>",
      "/resources</loc>",
      "/resources/five-signs-your-website-is-costing-you-work</loc>",
      "/resources/why-accessibility-matters-for-local-business</loc>",
      "/resources/speed-trust-and-google</loc>",
      "/resources/what-good-ux-looks-like-on-a-trade-website</loc>",
    ]) {
      expect(body).toContain(path);
    }
  });
});

// ---------------- Social / meta tags ----------------

test.describe("meta tags: pages share correctly on socials and search", () => {
  test("homepage has title, description and Open Graph tags", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Deep Run/i);
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute("content", /.{20,}/); // non-trivial description
    const ogTitle = page.locator('meta[property="og:title"]');
    const ogDesc = page.locator('meta[property="og:description"]');
    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogTitle).toHaveAttribute("content", /Deep Run/i);
    await expect(ogDesc).toHaveAttribute("content", /.{20,}/);
    await expect(ogType).toHaveAttribute("content", "website");
  });

  test("document declares an html lang and a viewport meta tag", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute("content", /width=device-width/);
  });

  test("an article page has its own distinct title (not a generic fallback)", async ({ page }) => {
    await page.goto("/resources/speed-trust-and-google");
    const title = await page.title();
    expect(title.toLowerCase()).not.toBe("deep run");
    expect(title.length).toBeGreaterThan(10);
  });
});

// ---------------- Structured data ----------------

test.describe("structured data", () => {
  test("LocalBusiness JSON-LD is present and parses as valid JSON", async ({ page }) => {
    await page.goto("/");
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    expect(count).toBeGreaterThan(0);
    let found = false;
    for (let i = 0; i < count; i++) {
      const raw = await scripts.nth(i).textContent();
      expect(() => JSON.parse(raw || "")).not.toThrow();
      const data = JSON.parse(raw || "{}");
      if (data["@type"] === "LocalBusiness" || data["@type"] === "ProfessionalService") {
        found = true;
        expect(data.telephone).toBe("+64 20 4134 3263");
        expect(data.areaServed).toBeTruthy();
      }
    }
    expect(found).toBe(true);
  });
});

// ---------------- Reduced motion ----------------

test.describe("prefers-reduced-motion is genuinely respected", () => {
  test("homepage renders cleanly with reduced motion emulated (no errors, content present)", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto("/");
    await expect(page.locator("h1.hero-title")).toBeVisible();
    // Give the ocean field / reveal system a moment to settle.
    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
  });

  test("scroll-reveal content is immediately visible under reduced motion (no reliance on animation to appear)", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    // The global reduced-motion rule forces [data-pw] opacity:1 and no
    // translate - content must not depend on the animation completing.
    const card = page.locator("[data-pw]").first();
    await expect(card).toHaveCSS("opacity", "1");
  });
});

// ---------------- Contact form's own rate limiter ----------------

test.describe("contact form rate limiting", () => {
  test("repeated rapid submissions eventually get a 429, not a crash", async ({ request }) => {
    // The contact route keys its limiter by IP. Every request in this test
    // run shares one Node process, and Playwright's local requests carry no
    // x-forwarded-for, so unrelated tests would otherwise share the same
    // "unknown" bucket as this one. Set a synthetic, unique IP header so
    // this test's deliberate saturation can't spill over and break other
    // contact-form tests running in the same server session.
    const syntheticIp = "203.0.113.77";
    let sawRateLimit = false;
    for (let i = 0; i < 9; i++) {
      const res = await request.post("/api/contact", {
        headers: { "x-forwarded-for": syntheticIp },
        data: {
          name: "Rate Test",
          email: "rate@example.co.nz",
          message: "Testing the limiter.",
        },
      });
      if (res.status() === 429) {
        sawRateLimit = true;
        const body = await res.json();
        expect(body.ok).toBe(false);
        break;
      }
    }
    expect(sawRateLimit).toBe(true);
  });

  test("whitespace-only name/message is treated as empty and rejected", async ({ request }) => {
    const res = await request.post("/api/contact", {
      headers: { "x-forwarded-for": "203.0.113.78" },
      data: { name: "   ", email: "test@example.co.nz", message: "   " },
    });
    expect(res.status()).toBe(400);
  });
});

// ---------------- Console-error smoke test across key pages ----------------

test.describe("no console errors on the main pages (production build)", () => {
  for (const path of ["/", "/pricing", "/resources", "/about", "/privacy"]) {
    test(`no console errors on ${path === "/" ? "homepage" : path}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });
      page.on("pageerror", (e) => errors.push(String(e)));
      await page.goto(path === "/pricing" ? "/#pricing" : path);
      await page.waitForTimeout(600);
      expect(errors).toEqual([]);
    });
  }
});
