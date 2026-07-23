import { test, expect } from "@playwright/test";

/**
 * Tests for /api/monitor, the scheduled health-check endpoint. These run
 * against the local dev/test server, where CRON_SECRET is unset - so the
 * route runs unauthenticated (by design, so it's testable before it's ever
 * deployed) and hits the local server's own pages.
 */

test.describe("monitor endpoint", () => {
  test("runs a full check battery and returns a structured report", async ({ request }) => {
    const res = await request.get("/api/monitor");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(typeof body.ok).toBe("boolean");
    expect(typeof body.checked).toBe("number");
    expect(body.checked).toBeGreaterThan(5);
    expect(Array.isArray(body.results)).toBe(true);
    for (const r of body.results) {
      expect(typeof r.name).toBe("string");
      expect(typeof r.ok).toBe("boolean");
      expect(typeof r.detail).toBe("string");
    }
  });

  test("checks include the self-audit score and security headers", async ({ request }) => {
    const res = await request.get("/api/monitor");
    const body = await res.json();
    const names: string[] = body.results.map((r: { name: string }) => r.name);
    expect(names).toContain("self-audit score");
    expect(names).toContain("security headers present");
    expect(names).toContain("homepage renders real headline");
  });

  test("contact dry-run check reports a graceful skip locally, not a false alarm (no CRON_SECRET in dev)", async ({ request }) => {
    const res = await request.get("/api/monitor");
    const body = await res.json();
    const dryRunCheck = body.results.find(
      (r: { name: string }) => r.name === "contact route (dry run)"
    );
    expect(dryRunCheck).toBeTruthy();
    // Locally, with no CRON_SECRET configured, this must read as healthy
    // (skipped) rather than failed - Vercel sets CRON_SECRET automatically
    // in every production deployment, so the real dry run only runs there.
    expect(dryRunCheck.ok).toBe(true);
    expect(dryRunCheck.detail).toContain("skipped");
  });

  test("does not require auth when CRON_SECRET is unset (local/dev testability)", async ({ request }) => {
    // No Authorization header sent at all - should still succeed locally.
    const res = await request.get("/api/monitor");
    expect(res.status()).not.toBe(401);
  });
});

test.describe("contact route dry-run safety", () => {
  test("without the correct secret, a dry-run header is ignored and the route behaves normally", async ({ request }) => {
    // A visitor could never know CRON_SECRET, so sending the header with a
    // wrong or missing value must NOT let anyone silently bypass sending -
    // it should fall through to normal handling (fallback/real-send path).
    const res = await request.post("/api/contact", {
      headers: { "x-monitor-dry-run": "guessed-wrong-secret" },
      data: {
        name: "Regular Visitor",
        email: "visitor@example.co.nz",
        message: "This should NOT be silently swallowed as a dry run.",
      },
    });
    const body = await res.json();
    // Normal path: either fallback (no Resend key configured) or a real
    // send attempt - never the dryRun flag, since the secret didn't match.
    expect(body.dryRun).not.toBe(true);
  });
});
