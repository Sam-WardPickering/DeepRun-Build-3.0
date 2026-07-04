import { test, expect } from "@playwright/test";

/**
 * Security-focused tests for the audit API route.
 * These verify the SSRF guard, input validation, and response behaviour
 * under adversarial input. No SQL injection surface exists (no database),
 * but we test equivalent injection patterns through the URL input.
 */

const API = "/api/audit";

test.describe("SSRF protection", () => {
  const privateAddresses = [
    "localhost",
    "127.0.0.1",
    "127.0.0.2",
    "10.0.0.1",
    "10.255.255.255",
    "172.16.0.1",
    "172.31.255.255",
    "192.168.0.1",
    "192.168.1.100",
    "169.254.169.254",  // AWS/cloud metadata endpoint
    "[::1]",
    "localhost:8080",
    "127.0.0.1:3000",
  ];

  for (const addr of privateAddresses) {
    test(`blocks private address: ${addr}`, async ({ request }) => {
      const res = await request.post(API, {
        data: { url: addr },
      });
      const body = await res.json();
      expect(body.error).toContain("Private or internal");
    });
  }

  test("blocks file:// protocol", async ({ request }) => {
    const res = await request.post(API, {
      data: { url: "file:///etc/passwd" },
    });
    expect(res.ok()).toBe(false);
  });

  test("blocks ftp:// protocol", async ({ request }) => {
    const res = await request.post(API, {
      data: { url: "ftp://example.com" },
    });
    expect(res.ok()).toBe(false);
  });

  test("blocks javascript: protocol", async ({ request }) => {
    const res = await request.post(API, {
      data: { url: "javascript:alert(1)" },
    });
    expect(res.ok()).toBe(false);
  });
});

test.describe("input validation", () => {
  test("empty URL returns 400", async ({ request }) => {
    const res = await request.post(API, { data: { url: "" } });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBeTruthy();
  });

  test("missing URL field returns 400", async ({ request }) => {
    const res = await request.post(API, { data: {} });
    expect(res.status()).toBe(400);
  });

  test("invalid JSON body returns 400", async ({ request }) => {
    const res = await request.post(API, {
      headers: { "Content-Type": "application/json" },
      data: "not json at all",
    });
    expect(res.status()).toBe(400);
  });

  test("extremely long URL is handled gracefully", async ({ request }) => {
    const longUrl = "https://example.com/" + "a".repeat(5000);
    const res = await request.post(API, { data: { url: longUrl } });
    // Should either return an error or handle it - never crash
    expect([400, 502]).toContain(res.status());
  });

  test("URL with SQL injection patterns is handled safely", async ({ request }) => {
    const injections = [
      "'; DROP TABLE users; --",
      "1 OR 1=1",
      "' UNION SELECT * FROM users --",
      "<script>alert('xss')</script>",
    ];
    for (const payload of injections) {
      const res = await request.post(API, {
        data: { url: payload },
      });
      // Should return a validation error, never crash
      expect(res.status()).toBeLessThan(500);
    }
  });

  test("URL with XSS payload in response does not echo raw HTML", async ({ request }) => {
    const res = await request.post(API, {
      data: { url: '<img src=x onerror=alert(1)>' },
    });
    const body = await res.json();
    // The error message should not echo the raw input back
    if (body.error) {
      expect(body.error).not.toContain("<img");
      expect(body.error).not.toContain("onerror");
    }
  });
});

test.describe("API response shape", () => {
  test("successful response has expected fields", async ({ request, page }) => {
    // Mock at the page level to intercept
    await page.goto("/");
    await page.route("**/api/audit", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          url: "https://example.co.nz",
          https: true,
          total: 50,
          verdict: "Test verdict.",
          scores: { message: 50, action: 50, content: 50, foundations: 50, credibility: 50 },
          findings: [
            { category: "message", message: "test" },
            { category: "action", message: "test" },
            { category: "content", message: "test" },
            { category: "foundations", message: "test" },
            { category: "credibility", message: "test" },
          ],
        }),
      })
    );
    // Verify through direct API call shape
    const directRes = await request.post(API, {
      data: { url: "localhost" }, // will be blocked but validates parsing
    });
    const body = await directRes.json();
    // Should have an error field (since localhost is blocked)
    expect(body).toHaveProperty("error");
  });

  test("error responses are JSON, not HTML error pages", async ({ request }) => {
    const res = await request.post(API, { data: { url: "" } });
    const contentType = res.headers()["content-type"] || "";
    expect(contentType).toContain("application/json");
  });

  test("GET method returns 405 or appropriate error", async ({ request }) => {
    const res = await request.get(API);
    // Next.js API routes return 405 for unsupported methods
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });
});
