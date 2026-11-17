import type { MetadataRoute } from "next";
import { blogPosts, getPage, landingPages } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

const pages = ["/", "/about-us/", "/ss-rotary-gear-pump/", "/ci-rotary-gear-pump/", "/applications/", "/careers/", "/blog/", "/contact-us/", ...landingPages, ...blogPosts, "/category/industry/"];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((p) => {
    const m = getPage(p).meta;
    return {
      url: SITE_URL + p,
      lastModified: m.modified ?? m.published ?? undefined,
      changeFrequency: p === "/" ? "weekly" : "monthly",
      priority: p === "/" ? 1 : p.includes("rotary-gear-pump/") && !p.includes("-manufacturer") ? 0.9 : 0.7,
    };
  });
}
