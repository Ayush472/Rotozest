import type { Metadata } from "next";
import { getPage, plain, type Faq, type PageData } from "./content";
import { SITE_URL, site, tracking } from "./site";
import imageRedirects from "@/data/image-redirects.json";

const ROBOTS = "index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large";

// Blanks on the WordPress site, filled once (everything else is copied verbatim).
const FIXES: Record<string, { description?: string }> = {
  "/blog/": { description: "Guides and articles from Rotozest Industries on rotary gear pumps, oil transfer, viscous liquids and chemical handling." },
  "/category/industry/": { description: "Rotozest Industries articles on rotary gear pumps for the oil, chemical and food industries." },
};

/** New local path for an old /wp-content/uploads URL, if the image was carried over. */
export function newImagePath(oldUrl: string | null | undefined): string | null {
  if (!oldUrl) return null;
  const hit = imageRedirects.find((r) => r.source === new URL(oldUrl, SITE_URL).pathname);
  return hit && hit.destination !== "/" ? hit.destination : null;
}

/** 1200×630 JPG link-preview image built per page by scripts/og-images.mjs. */
function ogImage(p: PageData): string {
  return `${SITE_URL}/og/${p.path.replace(/^\/|\/$/g, "").replace(/\//g, "__") || "home"}.jpg`;
}

/** Next.js metadata for a migrated URL: same title, description, canonical, robots and social tags as WordPress. */
export function pageMetadata(urlPath: string): Metadata {
  const p = getPage(urlPath);
  const m = p.meta;
  const description = FIXES[urlPath]?.description ?? m.description ?? undefined;
  const image = ogImage(p);
  const isArticle = m.ogType === "article";
  return {
    title: { absolute: m.title },
    description,
    alternates: { canonical: m.canonical.replace("https://rotozest.com", SITE_URL) },
    robots: m.robots ?? ROBOTS,
    openGraph: {
      locale: "en_US",
      type: isArticle ? "article" : "website",
      title: m.ogTitle ?? m.title,
      description: m.ogDescription ?? description,
      url: SITE_URL + urlPath,
      siteName: site.name,
      images: [{ url: image, width: 1200, height: 630, type: "image/jpeg", alt: m.ogImageAlt ?? p.h1 }],
      ...(isArticle ? { publishedTime: m.published ?? undefined, modifiedTime: m.modified ?? undefined } : {}),
    },
    twitter: { card: "summary_large_image", title: m.ogTitle ?? m.title, description: m.ogDescription ?? description, images: [image] },
  };
}

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: site.name,
  verification: { google: tracking.googleSiteVerification },
  formatDetection: { telephone: false },
};

export function websiteJsonLd() {
  return { "@context": "https://schema.org", "@type": "WebSite", "@id": `${SITE_URL}#WebSite`, name: site.name, url: `${SITE_URL}/`, publisher: { "@id": `${SITE_URL}#Organization` }, inLanguage: "en-US" };
}

// ---------- JSON-LD ----------
const decodeEntities = (v: unknown): unknown =>
  typeof v === "string"
    ? v.replace(/&amp;/g, "&").replace(/&#039;|&#8217;/g, "’").replace(/&quot;/g, '"')
    : Array.isArray(v)
      ? v.map(decodeEntities)
      : v && typeof v === "object"
        ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, decodeEntities(x)]))
        : v;

/** Keep every JSON-LD block WordPress published for this URL (entity-escaping fixed). Organization/LocalBusiness are emitted site-wide instead. */
export function legacyJsonLd(urlPath: string): unknown[] {
  const p = getPage(urlPath);
  return p.jsonld
    .flatMap((b) => (Array.isArray(b) ? b : [b]))
    .filter((b) => {
      const t = (b as { "@type"?: string })["@type"];
      return t !== "Organization" && t !== "LocalBusiness";
    })
    .map(decodeEntities);
}

export function organizationJsonLd() {
  return [
    { "@context": "https://schema.org/", "@type": "Organization", "@id": `${SITE_URL}#Organization`, name: site.name, url: SITE_URL, logo: SITE_URL + site.logo, sameAs: [site.social.facebook, site.social.instagram] },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: site.name,
      url: `${SITE_URL}/`,
      logo: SITE_URL + site.logo,
      image: `${SITE_URL}/images/ss-rotary-gear-pump-600.webp`,
      description: "Looking for a trusted rotary gear pump manufacturer in Ahmedabad? Rotozest delivers high-quality CI & SS pumps with all-India supply for every industry need. Call us now!",
      telephone: "+91-9974017583",
      email: site.email,
      address: { "@type": "PostalAddress", streetAddress: site.address.street, addressLocality: site.address.city, addressRegion: site.address.region, postalCode: site.address.postalCode, addressCountry: site.address.country },
      openingHours: "Mo,Tu,We,Th,Fr 09:00-19:00",
      geo: { "@type": "GeoCoordinates", latitude: String(site.geo.lat), longitude: String(site.geo.lng) },
      hasMap: "https://maps.app.goo.gl/t8nkpCxRxevhKRcJ8",
      sameAs: [site.social.facebook, site.social.instagram],
      paymentAccepted: ["Cash", "Credit Card", "Bank Transfer"],
      priceRange: "₹",
    },
  ];
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: SITE_URL + it.path })),
  };
}

/** FAQPage from visible FAQ items (used where WordPress had no FAQPage block but showed FAQs). */
export function faqJsonLd(faq: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: plain(f.a) } })),
  };
}

export function hasType(blocks: unknown[], type: string) {
  return blocks.some((b) => (b as { "@type"?: string })["@type"] === type);
}
