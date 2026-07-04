/**
 * Deep Run audit engine.
 *
 * Takes the raw HTML of a page (plus whether it was served over HTTPS)
 * and returns a score out of 100 for five categories, a total, and one
 * "start here" finding per category.
 *
 * This file is deliberately plain JavaScript (not TypeScript) so it can be
 * imported by BOTH the Next.js API route and the standalone test script
 * (scripts/test-audit.mjs) without any build step.
 *
 * How scoring works:
 * Each category is a list of signals. Every signal has a weight (points)
 * and a check. If the check passes, the page earns the points. Category
 * score = points earned / points available * 100. The signal messages
 * double as the findings: the failed signal with the biggest weight
 * becomes that category's "start here" recommendation.
 */

import * as cheerio from "cheerio";

// Words that suggest a link or button is a call to action.
const CTA_WORDS = [
  "quote",
  "book",
  "contact",
  "call",
  "enquire",
  "inquire",
  "get in touch",
  "estimate",
  "get started",
  "free",
];

/**
 * Analyse one page.
 * @param {object} input
 * @param {string} input.html - the raw HTML of the page
 * @param {boolean} input.https - was the page served over HTTPS?
 * @returns {{ scores: Record<string, number>, total: number, findings: Array<{category: string, message: string}> }}
 */
export function auditPage({ html, https }) {
  const $ = cheerio.load(html);

  // Remove non-visible elements before reading any text. Without this,
  // cheerio's .text() includes the contents of script tags, and digit
  // sequences inside JavaScript payloads can false-positive the phone
  // number check (and inflate word counts) on script-heavy sites.
  $("script, style, noscript, template").remove();

  // ---- shared measurements, computed once ----
  const title = ($("title").first().text() || "").trim();
  const metaDescription = (
    $('meta[name="description"]').attr("content") || ""
  ).trim();
  const hasViewport = $('meta[name="viewport"]').length > 0;
  const h1s = $("h1");
  const h1Text = h1s.first().text().trim();
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText ? bodyText.split(" ").length : 0;

  const images = $("img");
  const imagesWithAlt = $("img[alt]").filter(
    (_, el) => ($(el).attr("alt") || "").trim().length > 0
  );
  const altCoverage =
    images.length === 0 ? 1 : imagesWithAlt.length / images.length;

  const linkAndButtonText = $("a, button")
    .map((_, el) => $(el).text().toLowerCase())
    .get()
    .join(" | ");
  const hasCtaWording = CTA_WORDS.some((w) => linkAndButtonText.includes(w));
  const hasTelLink = $('a[href^="tel:"]').length > 0;
  const hasMailto = $('a[href^="mailto:"]').length > 0;
  const hasForm = $("form").length > 0;
  const hasContactLink = $("a").filter((_, el) =>
    ($(el).attr("href") || "").toLowerCase().includes("contact")
  ).length > 0;

  const pageTextLower = bodyText.toLowerCase();
  const phonePattern = /(\+?\d[\d\s\-()]{7,}\d)/;
  const hasPhoneNumber = phonePattern.test(bodyText);
  const currentYear = new Date().getFullYear();
  const copyrightMatch = bodyText.match(/(?:©|\(c\)|copyright)\s*(\d{4})/i);
  const copyrightYear = copyrightMatch ? parseInt(copyrightMatch[1], 10) : null;
  const hasPrivacyLink = $("a").filter((_, el) => {
    const t = $(el).text().toLowerCase();
    return t.includes("privacy") || t.includes("terms");
  }).length > 0;
  const hasInsecureResources = /\ssrc=["']http:\/\//i.test(html);

  // Heading order: collect levels in document order, flag skipped levels
  // (e.g. an h1 followed directly by an h4).
  const headingLevels = $("h1, h2, h3, h4, h5, h6")
    .map((_, el) => parseInt(el.tagName[1], 10))
    .get();
  let headingsSkipLevel = false;
  for (let i = 1; i < headingLevels.length; i++) {
    if (headingLevels[i] - headingLevels[i - 1] > 1) headingsSkipLevel = true;
  }

  // ---- category definitions ----
  // Each signal: [weight, passed, "message shown when it fails"]
  const categories = {
    message: [
      [25, h1s.length >= 1, "The page doesn't have a clear main heading, so visitors can't immediately tell what the business does."],
      [20, title.length >= 10 && title.length <= 65, "The page title isn't working hard enough for you in search results."],
      [20, metaDescription.length >= 50 && metaDescription.length <= 160, "The site is missing the summary text that Google shows under your name in search results."],
      [15, h1Text.length > 0 && h1Text.split(" ").length <= 12, "The main heading isn't landing - it's either missing or not saying enough in few enough words."],
      [20, hasViewport, "The page isn't set up for mobile screens, so it's showing visitors a shrunken version of the desktop site."],
    ],
    action: [
      [30, hasTelLink, "There's no way for mobile visitors to call with a single tap - and that's how most local customers want to reach you."],
      [25, hasForm || hasContactLink, "Visitors don't have a clear next step - there's no obvious way to get in touch."],
      [25, hasCtaWording, "The page doesn't tell visitors what to do next - there's no clear prompt to take action."],
      [20, hasMailto || pageTextLower.includes("@"), "There's no email address visible anywhere on the page."],
    ],
    content: [
      [30, wordCount >= 150 && wordCount <= 2500, "The amount of text on the page is working against you - either too thin to be useful or so dense that visitors won't read it."],
      [20, $("h2").length >= 2, "The content reads as one long block - visitors scanning on their phone will bounce."],
      [20, title.length > 0 && !/^(home|index|untitled|welcome)$/i.test(title), "The page title is generic, which wastes the single most valuable line of text on the site."],
      [15, metaDescription.length > 0, "The site has no summary for search engines, so Google is guessing what to show for you."],
      [15, !pageTextLower.includes("lorem ipsum"), "There's placeholder text still visible on the page - visitors will notice."],
    ],
    foundations: [
      [25, hasViewport, "The page isn't configured for mobile devices, which affects both visitors and search rankings."],
      [20, $("nav").length > 0 && $("footer").length > 0, "The page is missing structural elements that search engines and accessibility tools rely on."],
      [15, !headingsSkipLevel && headingLevels.length > 0, "The page structure has gaps that affect how screen readers and search engines understand it."],
      [25, altCoverage >= 0.8, "A significant number of images can't be understood by screen readers or search engines."],
      [15, ($("html").attr("lang") || "").length > 0, "The page is missing a basic accessibility setting that assistive technology depends on."],
    ],
    credibility: [
      [30, https, "The site isn't secure - browsers are warning visitors before they even see your content."],
      [20, copyrightYear === null || currentYear - copyrightYear <= 2, "Small details on the page are quietly signalling that nobody is actively looking after the site."],
      [20, hasPhoneNumber, "There's no phone number visible, which is the strongest trust signal a local business can have."],
      [15, hasPrivacyLink, "The site is missing links that established businesses are expected to have."],
      [15, !hasInsecureResources, "Some page elements are loading insecurely, which can trigger browser warnings."],
    ],
  };

  // ---- score each category and pick its "start here" finding ----
  const scores = {};
  const findings = [];

  for (const [name, signals] of Object.entries(categories)) {
    let earned = 0;
    let available = 0;
    let worstFailed = null;

    for (const [weight, passed, message] of signals) {
      available += weight;
      if (passed) {
        earned += weight;
      } else if (!worstFailed || weight > worstFailed.weight) {
        worstFailed = { weight, message };
      }
    }

    scores[name] = Math.round((earned / available) * 100);
    findings.push({
      category: name,
      message: worstFailed
        ? worstFailed.message
        : "Looking solid here - no major issues in this area.",
    });
  }

  const values = Object.values(scores);
  const total = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

  return { scores, total, findings };
}

/** One-line verdict for a given total score, shown next to the number. */
export function verdictFor(total) {
  if (total >= 80) return "In good shape - the fundamentals are working for you.";
  if (total >= 60) return "Solid bones, but real opportunities are being left on the table.";
  if (total >= 40) return "Underperforming - this site is quietly costing the business work.";
  return "Working against you - visitors are being turned away before they ever call.";
}
