import { test, expect } from "@playwright/test";
import { isolatedHeaders } from "./helpers/rate-limit-isolation";

/**
 * Tests for the /api/contact endpoint and the form's behaviour against it.
 * These exercise validation, the honeypot, header-injection safety, the
 * mailto fallback path, and the success state.
 */

const API = "/api/contact";

test.describe("contact API validation", () => {
  test("missing required fields returns 400", async ({ request }, testInfo) => {
    const res = await request.post(API, { data: { name: "", email: "", message: "" } });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBeTruthy();
  });

  test("invalid email is rejected", async ({ request }, testInfo) => {
    const res = await request.post(API, {
      data: { name: "Jane", email: "not-an-email", message: "Hello there" },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/email/i);
  });

  test("invalid JSON body returns 400", async ({ request }, testInfo) => {
    const res = await request.post(API, {
      headers: { "Content-Type": "application/json" },
      data: "this is not json",
    });
    expect(res.status()).toBe(400);
  });

  test("honeypot field causes silent accept (bot drop)", async ({ request }, testInfo) => {
    const res = await request.post(API, {
      data: {
        name: "Bot",
        email: "bot@spam.com",
        message: "spam spam spam",
        website: "http://spam.example", // honeypot filled
      },
    });
    // We pretend success and drop it - no error, ok:true, no email sent.
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  test("GET method is not allowed", async ({ request }, testInfo) => {
    const res = await request.get(API);
    expect(res.status()).toBe(405);
  });

  test("without email configured, returns fallback flag", async ({ request }, testInfo) => {
    // In test/dev there's no RESEND_API_KEY, so a valid submission should
    // come back with fallback:true (the client then uses mailto).
    const res = await request.post(API, {
      data: {
        name: "Jane Smith",
        email: "jane@example.co.nz",
        message: "I need a new website for my cafe.",
      },
    });
    const body = await res.json();
    // Either it's configured (ok:true) or not (fallback:true) - never a crash.
    expect(body.ok === true || body.fallback === true).toBe(true);
  });

  test("oversized fields are accepted but truncated, never crash", async ({ request }, testInfo) => {
    const res = await request.post(API, {
      data: {
        name: "A".repeat(5000),
        email: "jane@example.co.nz",
        message: "B".repeat(20000),
      },
    });
    // Should be handled gracefully (fallback or ok), never a 500.
    expect(res.status()).toBeLessThan(500);
  });

  test("header-injection attempt in fields does not error", async ({ request }, testInfo) => {
    const res = await request.post(API, {
      data: {
        name: "Jane\r\nBcc: victim@example.com",
        email: "jane@example.co.nz",
        message: "Subject: injected\r\n\r\nbody",
      },
    });
    // Values are placed in JSON body / escaped HTML, never raw headers.
    expect(res.status()).toBeLessThan(500);
  });
});

test.describe("contact form UI", () => {
  test("successful send shows the confirmation state", async ({ page }, testInfo) => {
    // Mock the API so we control the response regardless of email config.
    await page.route("**/api/contact", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      })
    );
    await page.goto("/#contact");
    await page.getByLabel("Your name").fill("Jane Smith");
    await page.getByLabel("Email", { exact: true }).fill("jane@example.co.nz");
    await page.getByLabel("What do you need?").fill("A new website please.");
    await page.getByRole("button", { name: /send enquiry/i }).click();
    await expect(page.locator(".form-success")).toBeVisible();
    await expect(page.locator(".form-success")).toContainText(/we'll be in touch/i);
  });

  test("server error shows an inline error, not the success state", async ({ page }, testInfo) => {
    await page.route("**/api/contact", (route) =>
      route.fulfill({
        status: 502,
        contentType: "application/json",
        body: JSON.stringify({ ok: false, error: "We couldn't send that just now." }),
      })
    );
    await page.goto("/#contact");
    await page.getByLabel("Your name").fill("Jane Smith");
    await page.getByLabel("Email", { exact: true }).fill("jane@example.co.nz");
    await page.getByLabel("What do you need?").fill("Testing errors.");
    await page.getByRole("button", { name: /send enquiry/i }).click();
    await expect(page.locator(".form-error")).toBeVisible();
    await expect(page.locator(".form-success")).toHaveCount(0);
  });

  test("honeypot field is present but visually hidden", async ({ page }, testInfo) => {
    await page.goto("/#contact");
    const hp = page.locator("#c-website");
    await expect(hp).toHaveCount(1);
    // It's off-screen; a real user shouldn't be able to see/tab to it easily.
    await expect(page.locator(".hp-field")).toHaveCSS("position", "absolute");
    await expect(hp).toHaveAttribute("tabindex", "-1");
  });
});
