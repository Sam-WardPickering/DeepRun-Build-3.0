import { NextResponse } from "next/server";
// lib/audit.mjs is plain JavaScript shared with the test script; the
// tsconfig has allowJs enabled so it imports cleanly here.
import { auditPage, verdictFor } from "@/lib/audit.mjs";

/**
 * POST /api/audit
 * Body: { "url": "example.co.nz" }
 *
 * Fetches the page server-side, runs the scoring engine, and returns:
 * { url, https, total, verdict, scores, findings }
 *
 * Security posture:
 * - Only http/https URLs are accepted.
 * - Private/internal hosts are refused (SSRF guard).
 * - CRITICAL: redirects are followed MANUALLY, re-validating the host at
 *   every hop, so a public URL cannot redirect into a private one (the
 *   classic redirect-based SSRF bypass). Capped at 4 hops.
 * - The fetch is capped by time (10s) and body size (500 KB).
 * - A lightweight in-memory rate limit throttles abusive callers.
 * - AUDIT_ALLOW_LOCAL=1 relaxes the host check for the local test suite
 *   only; it must never be set in production.
 */

export const runtime = "nodejs";

const FETCH_TIMEOUT_MS = 10_000;
const MAX_HTML_BYTES = 500_000;
const MAX_REDIRECTS = 4;
const MAX_URL_LEN = 2048;

// --- lightweight rate limit (per-instance, best-effort) -------------------
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 12; // requests per window per IP
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  // opportunistic cleanup so the map can't grow unbounded
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
    }
  }
  return arr.length > RATE_MAX;
}

function isPrivateHost(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (h === "localhost" || h.endsWith(".local") || h === "::1") return true;
  if (/^0\./.test(h)) return true; // 0.0.0.0/8
  if (/^127\./.test(h)) return true;
  if (/^10\./.test(h)) return true;
  if (/^192\.168\./.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) return true;
  if (/^169\.254\./.test(h)) return true; // link-local / cloud metadata
  if (/^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(h)) return true; // CGNAT 100.64/10
  // IPv6 private / unique-local / link-local
  if (/^f[cd][0-9a-f]{2}:/i.test(h)) return true;
  if (/^fe80:/i.test(h)) return true;
  if (h === "::" || h === "::ffff:127.0.0.1") return true;
  return false;
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function normalise(raw: string): URL | { error: string } {
  if (raw.length > MAX_URL_LEN) return { error: "That address is too long." };
  if (!/^https?:\/\//i.test(raw)) raw = "https://" + raw;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return { error: "That doesn't look like a valid web address." };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { error: "Only http and https addresses can be audited." };
  }
  return url;
}

export async function POST(request: Request) {
  const allowLocal = process.env.AUDIT_ALLOW_LOCAL === "1";

  // Rate limit by best-effort client IP.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (!allowLocal && rateLimited(ip)) {
    return jsonError("Too many checks in a short time. Please wait a minute.", 429);
  }

  let raw: string;
  try {
    const body = await request.json();
    raw = String(body?.url ?? "").trim();
  } catch {
    return jsonError("Invalid request body.", 400);
  }
  if (!raw) return jsonError("Please enter a website address.", 400);

  const first = normalise(raw);
  if ("error" in first) return jsonError(first.error, 400);
  if (!allowLocal && isPrivateHost(first.hostname)) {
    return jsonError("Private or internal addresses can't be audited.", 400);
  }

  // Follow redirects MANUALLY, re-validating the host at each hop so a
  // public URL cannot bounce us into the private network.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  let current = first;
  let response: Response;
  try {
    for (let hop = 0; ; hop++) {
      response = await fetch(current.toString(), {
        signal: controller.signal,
        redirect: "manual",
        headers: {
          "User-Agent": "DeepRunAudit/1.0 (+https://deeprun.co.nz)",
          Accept: "text/html",
        },
      });
      const isRedirect = response.status >= 300 && response.status < 400;
      if (!isRedirect) break;
      if (hop >= MAX_REDIRECTS) {
        clearTimeout(timer);
        return jsonError("That site redirected too many times.", 502);
      }
      const location = response.headers.get("location");
      if (!location) break;
      const next = normalise(new URL(location, current).toString());
      if ("error" in next) {
        clearTimeout(timer);
        return jsonError("That site redirected somewhere we can't follow.", 502);
      }
      if (!allowLocal && isPrivateHost(next.hostname)) {
        clearTimeout(timer);
        return jsonError("That site redirected to a private address.", 400);
      }
      current = next;
    }
  } catch {
    clearTimeout(timer);
    return jsonError("We couldn't reach that site. Check the address and try again.", 502);
  }
  clearTimeout(timer);

  if (!response.ok) {
    return jsonError(`The site responded with an error (HTTP ${response.status}).`, 502);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) {
    return jsonError("That address doesn't return a web page.", 400);
  }

  // Read the body with a hard byte cap, streaming so a malicious server
  // can't force us to buffer gigabytes.
  let html = "";
  const reader = response.body?.getReader();
  if (reader) {
    const decoder = new TextDecoder();
    let total = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      html += decoder.decode(value, { stream: true });
      if (total >= MAX_HTML_BYTES) {
        try { await reader.cancel(); } catch { /* ignore */ }
        break;
      }
    }
    html = html.slice(0, MAX_HTML_BYTES);
  } else {
    html = (await response.text()).slice(0, MAX_HTML_BYTES);
  }

  const https = current.protocol === "https:";
  const result = auditPage({ html, https });

  return NextResponse.json(
    {
      url: current.toString(),
      https,
      total: result.total,
      verdict: verdictFor(result.total),
      scores: result.scores,
      findings: result.findings,
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    }
  );
}

// Reject non-POST methods explicitly.
export async function GET() {
  return jsonError("Method not allowed. Use POST.", 405);
}
