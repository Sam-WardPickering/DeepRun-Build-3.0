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
 * Security notes (see docs/AUDIT.md for the full write-up):
 * - Only http/https URLs are accepted.
 * - Requests to private/internal hosts are refused (basic SSRF guard),
 *   unless AUDIT_ALLOW_LOCAL=1 is set - which the test script uses to
 *   audit fixture pages on 127.0.0.1.
 * - The fetch is capped at 10 seconds and 500 KB of HTML.
 */

const FETCH_TIMEOUT_MS = 10_000;
const MAX_HTML_BYTES = 500_000;

function isPrivateHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".local") || h === "[::1]") return true;
  if (/^127\./.test(h) || /^10\./.test(h) || /^192\.168\./.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) return true;
  if (/^169\.254\./.test(h)) return true; // link-local / cloud metadata
  return false;
}

export async function POST(request: Request) {
  let raw: string;
  try {
    const body = await request.json();
    raw = String(body?.url ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!raw) {
    return NextResponse.json({ error: "Please enter a website address." }, { status: 400 });
  }

  // Be forgiving about input: "example.co.nz" becomes "https://example.co.nz".
  if (!/^https?:\/\//i.test(raw)) raw = "https://" + raw;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return NextResponse.json({ error: "That doesn't look like a valid web address." }, { status: 400 });
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return NextResponse.json({ error: "Only http and https addresses can be audited." }, { status: 400 });
  }

  const allowLocal = process.env.AUDIT_ALLOW_LOCAL === "1";
  if (!allowLocal && isPrivateHost(url.hostname)) {
    return NextResponse.json({ error: "Private or internal addresses can't be audited." }, { status: 400 });
  }

  // Fetch the page with a hard timeout.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "DeepRunAudit/1.0 (+https://deeprun.co.nz)",
        Accept: "text/html",
      },
    });
  } catch {
    clearTimeout(timer);
    return NextResponse.json(
      { error: "We couldn't reach that site. Check the address and try again." },
      { status: 502 }
    );
  }
  clearTimeout(timer);

  if (!response.ok) {
    return NextResponse.json(
      { error: `The site responded with an error (HTTP ${response.status}).` },
      { status: 502 }
    );
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) {
    return NextResponse.json(
      { error: "That address doesn't return a web page." },
      { status: 400 }
    );
  }

  const html = (await response.text()).slice(0, MAX_HTML_BYTES);

  // Note: response.url reflects the final URL after redirects, so a site
  // that redirects http -> https is correctly credited for HTTPS.
  const https = response.url.startsWith("https:");

  const result = auditPage({ html, https });

  return NextResponse.json({
    url: response.url,
    https,
    total: result.total,
    verdict: verdictFor(result.total),
    scores: result.scores,
    findings: result.findings,
  });
}
