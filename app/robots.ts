import type { MetadataRoute } from "next";

/** Served at /robots.txt - allows all crawlers, points to the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://deeprun.co.nz/sitemap.xml",
  };
}
