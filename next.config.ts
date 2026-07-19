import type { NextConfig } from "next";

/**
 * Security headers applied to every response. These are standard hardening:
 * - HSTS: force HTTPS for a year (Vercel serves HTTPS; this tells browsers
 *   to never try HTTP).
 * - X-Content-Type-Options: stop MIME-sniffing.
 * - X-Frame-Options + frame-ancestors: block clickjacking (no embedding).
 * - Referrer-Policy: don't leak full URLs to other sites.
 * - Permissions-Policy: deny camera/mic/geolocation we never use.
 * - CSP: restrict where scripts/styles/images/connections can come from.
 *   'unsafe-inline'/'unsafe-eval' are needed for Next.js's inline runtime
 *   and the WebGL shader path; everything else is locked to self + the
 *   Google Fonts origins the site actually uses.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
