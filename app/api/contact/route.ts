import { NextResponse } from "next/server";

/**
 * POST /api/contact
 * Body: { name, email, phone?, tier?, message, website? }
 *
 * Sends the enquiry to hello@deeprun.co.nz.
 *
 * Delivery uses Resend (https://resend.com) via a plain fetch to its REST
 * API - no SDK dependency. Configure two env vars in Vercel:
 *   RESEND_API_KEY   - your Resend API key
 *   CONTACT_TO       - destination inbox (defaults to hello@deeprun.co.nz)
 *   CONTACT_FROM     - a verified sender on your domain
 *                      (e.g. "Deep Run <enquiries@deeprun.co.nz>")
 *
 * If RESEND_API_KEY is not set, the route returns { ok:false, fallback:true }
 * and the form falls back to opening the visitor's mail client (mailto), so
 * enquiries are never lost even before email is configured.
 *
 * Security:
 * - Honeypot field ("website") - if filled, silently accept and drop (bot).
 * - Basic validation + length caps on every field.
 * - Per-instance rate limit.
 * - Header-injection safe: values go in the JSON body / HTML, never headers.
 */

export const runtime = "nodejs";

const MAX = { name: 120, email: 200, phone: 40, tier: 60, message: 4000 };

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 6;
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
    }
  }
  return arr.length > RATE_MAX;
}

function clean(v: unknown, max: number): string {
  return String(v ?? "").trim().slice(0, max);
}
function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= MAX.email;
}
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages in a short time. Please wait a minute." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never see or fill this field.
  if (clean(body.website, 200)) {
    return NextResponse.json({ ok: true }); // pretend success, drop silently
  }

  const name = clean(body.name, MAX.name);
  const email = clean(body.email, MAX.email);
  const phone = clean(body.phone, MAX.phone);
  const tier = clean(body.tier, MAX.tier);
  const message = clean(body.message, MAX.message);

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Please fill in your name, email, and message." },
      { status: 400 }
    );
  }
  if (!isEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "That email address doesn't look right." },
      { status: 400 }
    );
  }

  // Monitoring dry run: the health-check endpoint (app/api/monitor) proves
  // this route's full validation path works - required fields, email
  // format, honeypot - without ever sending a real email. It is only
  // honoured when the caller supplies the server's own CRON_SECRET, which
  // is never exposed to the public site, so a visitor cannot use this to
  // silently swallow a real enquiry.
  const cronSecret = process.env.CRON_SECRET;
  const dryRunHeader = request.headers.get("x-monitor-dry-run");
  if (cronSecret && dryRunHeader === cronSecret) {
    return NextResponse.json({ ok: true, dryRun: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO || "hello@deeprun.co.nz";
  const from = process.env.CONTACT_FROM || "Deep Run <onboarding@resend.dev>";

  // Not configured yet -> tell the client to use its mailto fallback.
  if (!apiKey) {
    return NextResponse.json({ ok: false, fallback: true });
  }

  const subject = tier
    ? `New enquiry - ${tier} tier`
    : "New enquiry from deeprun.co.nz";
  const html = `
    <h2>New enquiry from deeprun.co.nz</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
    ${tier ? `<p><strong>Interested in:</strong> ${escapeHtml(tier)}</p>` : ""}
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject,
        html,
      }),
    });
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: "We couldn't send that just now. Please email us directly." },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "We couldn't send that just now. Please email us directly." },
      { status: 502 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed." }, { status: 405 });
}
