import type { TestInfo, Page } from "@playwright/test";

/**
 * Both API routes rate-limit per client IP using an in-memory store that is
 * shared across every test in a run. Specs that fire many requests (the SSRF
 * matrix, the audit UI validation cases) would otherwise saturate a single
 * bucket and receive 429s where they assert 400s - a test-infrastructure
 * artefact, not a product fault.
 *
 * These helpers give every test its own synthetic client IP, drawn from the
 * TEST-NET-3 documentation range (203.0.113.0/24, reserved by RFC 5737 and
 * never routable), so each test's requests land in a private bucket.
 */

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** A stable, unique client IP for the given test. */
export function uniqueIpFor(testInfo: TestInfo): string {
  const seed = hash(`${testInfo.project.name}::${testInfo.titlePath.join("::")}`);
  // 203.0.113.x, avoiding .0 and .255
  const a = 1 + (seed % 254);
  const b = 1 + ((seed >> 8) % 254);
  return `203.0.${b}.${a}`;
}

/** Headers to attach to a request so it gets its own rate-limit bucket. */
export function isolatedHeaders(testInfo: TestInfo): Record<string, string> {
  return { "x-forwarded-for": uniqueIpFor(testInfo) };
}

/** Apply per-test isolation to every request a page makes. */
export async function isolatePage(page: Page, testInfo: TestInfo) {
  await page.setExtraHTTPHeaders(isolatedHeaders(testInfo));
}
