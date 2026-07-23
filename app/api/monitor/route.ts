import { NextResponse } from "next/server";
import { auditPage } from "@/lib/audit.mjs";

/**
 * GET /api/monitor
 *
 * A scheduled health check for the live site, triggered by Vercel Cron
 * three times a week (see vercel.json). It is NOT a public-facing feature -
 * it isn't linked anywhere, and it authenticates the caller before doing
 * any work.
 *
 * What it checks, and why each one earns its place:
 *  - Every real page returns 200 (homepage, resources index, about,
 *    privacy, all four articles) - catches a bad deploy or a broken route.
 *  - The homepage still contains its real headline text - catches a build
 *    that "succeeds" but renders blank or broken content.
 *  - Security headers are present (HSTS, CSP, X-Frame-Options) - catches a
 *    next.config regression that silently drops hardening.
 *  - robots.txt and sitemap.xml still serve - catches an SEO regression.
 *  - The homepage's self-audit score hasn't dropped below a floor - this
 *    reuses the exact same scoring engine the public site-check tool uses,
 *    so it catches accessibility/structural regressions (missing alt text,
 *    a dropped viewport meta tag, etc.) using a number Sam already trusts.
 *  - The contact API route is reachable and its validation logic still
 *    runs correctly, WITHOUT sending a real email (a "dry run" flag, only
 *    honoured when this same secret is present, exercises the code path
 *    safely).
 *  - The audit API route can complete a real, harmless scan against the
 *    site's own homepage.
 *
 * On any failure, one alert email is sent via Resend to a personal inbox
 * (MONITOR_ALERT_TO) that is never shown on the site and is separate from
 * CONTACT_TO. On a clean run, no email is sent at all - this endpoint is
 * silent unless something is actually broken, by design.
 *
 * Auth: Vercel automatically sets CRON_SECRET in the project's production
 * environment and sends it as `Authorization: Bearer <CRON_SECRET>` on
 * every cron invocation (https://vercel.com/docs/cron-jobs/manage-cron-jobs).
 * This route requires that header to match in production. In local/dev use
 * (no CRON_SECRET configured), the check runs unauthenticated so it can be
 * tested before it's ever deployed.
 */

export const runtime = "nodejs";
// Give this route the room it needs: several sequential fetches plus one
// live audit scan comfortably fit inside Vercel's default limits, but the
// explicit ceiling avoids a slow network hiccup timing the whole run out.
export const maxDuration = 60;

const BASE_URL =
  process.env.MONITOR_BASE_URL || "https://deeprun.co.nz";

const PAGES = [
  "/",
  "/resources",
  "/about",
  "/privacy",
  "/resources/five-signs-your-website-is-costing-you-work",
  "/resources/why-accessibility-matters-for-local-business",
  "/resources/speed-trust-and-google",
  "/resources/what-good-ux-looks-like-on-a-trade-website",
];

const REQUIRED_SECURITY_HEADERS = [
  "strict-transport-security",
  "content-security-policy",
  "x-frame-options",
];

// If the site's own self-audit score ever falls below this, something
// structural broke (alt text stripped, viewport meta dropped, etc).
const SCORE_FLOOR = 85;

type CheckResult = { name: string; ok: boolean; detail: string };

async function checkPagesRespond(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  for (const path of PAGES) {
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        redirect: "manual",
        signal: AbortSignal.timeout(10_000),
      });
      results.push({
        name: `page ${path}`,
        ok: res.status === 200,
        detail: `HTTP ${res.status}`,
      });
    } catch (err) {
      results.push({
        name: `page ${path}`,
        ok: false,
        detail: `fetch failed: ${(err as Error).message}`,
      });
    }
  }
  return results;
}

async function checkHomepageContentAndHeaders(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  try {
    const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(10_000) });
    const html = await res.text();

    results.push({
      name: "homepage renders real headline",
      ok: /Websites that/i.test(html) && /win work/i.test(html),
      detail: /Websites that/i.test(html) ? "found" : "headline text missing",
    });

    const missingHeaders = REQUIRED_SECURITY_HEADERS.filter(
      (h) => !res.headers.get(h)
    );
    results.push({
      name: "security headers present",
      ok: missingHeaders.length === 0,
      detail:
        missingHeaders.length === 0
          ? "all present"
          : `missing: ${missingHeaders.join(", ")}`,
    });

    const { total } = auditPage({ html, https: BASE_URL.startsWith("https") });
    results.push({
      name: "self-audit score",
      ok: total >= SCORE_FLOOR,
      detail: `${total}/100 (floor ${SCORE_FLOOR})`,
    });
  } catch (err) {
    results.push({
      name: "homepage content + headers",
      ok: false,
      detail: `fetch failed: ${(err as Error).message}`,
    });
  }
  return results;
}

async function checkSeoFiles(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  for (const path of ["/robots.txt", "/sitemap.xml"]) {
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        signal: AbortSignal.timeout(10_000),
      });
      results.push({
        name: `seo file ${path}`,
        ok: res.status === 200,
        detail: `HTTP ${res.status}`,
      });
    } catch (err) {
      results.push({
        name: `seo file ${path}`,
        ok: false,
        detail: `fetch failed: ${(err as Error).message}`,
      });
    }
  }
  return results;
}

async function checkContactRouteDryRun(secret: string | null): Promise<CheckResult> {
  if (!secret) {
    // No CRON_SECRET configured (local/dev, or a manual curl outside
    // Vercel's cron infrastructure). Vercel sets this automatically in
    // every production deployment, so in real scheduled runs the dry run
    // always executes - this branch only exists so a local test run
    // doesn't report a false alarm for an expected local-only condition.
    return {
      name: "contact route (dry run)",
      ok: true,
      detail: "skipped - no CRON_SECRET (expected outside Vercel production)",
    };
  }
  try {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-monitor-dry-run": secret,
      },
      body: JSON.stringify({
        name: "Deep Run Monitor",
        email: "monitor@deeprun.co.nz",
        message: "Automated health check - dry run, not a real enquiry.",
      }),
      signal: AbortSignal.timeout(10_000),
    });
    const body = await res.json().catch(() => ({}));
    return {
      name: "contact route (dry run)",
      ok: res.status === 200 && body?.dryRun === true,
      detail: `HTTP ${res.status}, dryRun=${body?.dryRun}`,
    };
  } catch (err) {
    return {
      name: "contact route (dry run)",
      ok: false,
      detail: `fetch failed: ${(err as Error).message}`,
    };
  }
}

async function checkAuditRouteLive(): Promise<CheckResult> {
  try {
    const res = await fetch(`${BASE_URL}/api/audit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: BASE_URL }),
      signal: AbortSignal.timeout(15_000),
    });
    const body = await res.json().catch(() => ({}));
    return {
      name: "audit route (live scan of own homepage)",
      ok: res.status === 200 && typeof body?.total === "number",
      detail: `HTTP ${res.status}, total=${body?.total}`,
    };
  } catch (err) {
    return {
      name: "audit route (live scan)",
      ok: false,
      detail: `fetch failed: ${(err as Error).message}`,
    };
  }
}

async function sendAlertEmail(failures: CheckResult[], allResults: CheckResult[]) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.MONITOR_ALERT_TO;
  if (!apiKey || !to) {
    // No email configured for monitoring - log loudly so it's still
    // visible in Vercel's function logs even without an inbox.
    console.error(
      "[monitor] ALERT (no MONITOR_ALERT_TO/RESEND_API_KEY configured):",
      JSON.stringify(failures)
    );
    return;
  }
  const from = process.env.CONTACT_FROM || "Deep Run Monitor <onboarding@resend.dev>";
  const rows = allResults
    .map(
      (r) =>
        `<tr><td style="padding:4px 10px 4px 0">${r.ok ? "✅" : "❌"}</td><td style="padding:4px 10px 4px 0">${r.name}</td><td style="color:#666">${r.detail}</td></tr>`
    )
    .join("");
  const html = `
    <h2>Deep Run site monitor - ${failures.length} check(s) failed</h2>
    <p>Run at ${new Date().toISOString()} against ${BASE_URL}</p>
    <table>${rows}</table>
  `;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Deep Run site alert: ${failures.length} check(s) failed`,
        html,
      }),
    });
  } catch (err) {
    console.error("[monitor] failed to send alert email:", err);
  }
}

export async function GET(request: Request) {
  // Auth: require the Vercel-issued CRON_SECRET in production. If it isn't
  // configured (local/dev), skip the check so this route stays testable.
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  const results: CheckResult[] = [];
  results.push(...(await checkPagesRespond()));
  results.push(...(await checkHomepageContentAndHeaders()));
  results.push(...(await checkSeoFiles()));
  results.push(await checkContactRouteDryRun(cronSecret ?? null));
  results.push(await checkAuditRouteLive());

  const failures = results.filter((r) => !r.ok);

  if (failures.length > 0) {
    await sendAlertEmail(failures, results);
  }

  return NextResponse.json({
    ok: failures.length === 0,
    checked: results.length,
    failed: failures.length,
    results,
    ranAt: new Date().toISOString(),
  });
}
