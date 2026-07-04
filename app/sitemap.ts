import type { MetadataRoute } from "next";
import { articles } from "@/lib/articles";

/** Served at /sitemap.xml - every page, generated from the article data. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://deeprun.co.nz";
  const pages = ["", "/about", "/privacy", "/resources"].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
  const articlePages = articles.map((a) => ({
    url: `${base}/resources/${a.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));
  return [...pages, ...articlePages];
}
