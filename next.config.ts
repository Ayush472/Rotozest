import type { NextConfig } from "next";
import imageRedirects from "./src/data/image-redirects.json";

// Old WordPress URLs that are not carried over → 301 (see docs/migration/README.md).
const legacy: { source: string; destination: string }[] = [
  { source: "/how-to-make-a-simple-and-quick-firewood/", destination: "/blog/" },
  { source: "/sitemap_index.xml", destination: "/sitemap.xml" },
  { source: "/page-sitemap.xml", destination: "/sitemap.xml" },
  { source: "/post-sitemap.xml", destination: "/sitemap.xml" },
  { source: "/category-sitemap.xml", destination: "/sitemap.xml" },
  { source: "/wp-sitemap.xml", destination: "/sitemap.xml" },
  { source: "/feed/", destination: "/blog/" },
  { source: "/comments/feed/", destination: "/blog/" },
  { source: "/:slug/feed/", destination: "/:slug/" },
  { source: "/category/industry/feed/", destination: "/category/industry/" },
  { source: "/author/:name/", destination: "/blog/" },
  { source: "/category/construction/", destination: "/blog/" },
  { source: "/tag/:tag/", destination: "/blog/" },
  { source: "/blog/page/:n/", destination: "/blog/" },
  { source: "/about-us-2/", destination: "/about-us/" },
  { source: "/contact/", destination: "/contact-us/" },
  { source: "/about/", destination: "/about-us/" },
  ...["/home-classic/", "/home-modern/", "/home-main-copy/", "/home-main-one-page/", "/home-modern-one-page/", "/home-classic-one-page/", "/blog-grid-2-columns/", "/blog-grid-2-columns-left-sidebar/", "/blog-grid-2-columns-right-sidebar/", "/blog-grid-3-columns/"].map((s) => ({ source: s, destination: "/" })),
  { source: "/header/:path*", destination: "/" },
  { source: "/footer/:path*", destination: "/" },
  { source: "/service/:path*", destination: "/" },
  { source: "/service-category/:path*", destination: "/" },
  { source: "/portfolio/:path*", destination: "/" },
  { source: "/wp-admin/:path*", destination: "/" },
  { source: "/wp-login.php", destination: "/" },
];

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const config: NextConfig = {
  trailingSlash: true, // WordPress URLs all end in "/"
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600],
    qualities: [75, 82],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  async redirects() {
    return [
      ...legacy,
      // Old image URLs (incl. resized and Elementor thumbs) → new optimized files.
      ...imageRedirects.filter((r) => r.destination !== "/").map((r) => ({ source: r.source, destination: r.destination })),
      // Any other uploaded file (icons, theme demo images) → home, except the brochure which is still served.
      { source: "/wp-content/uploads/:y(\\d{4})/:m(\\d{2})/:file((?!rotozest-brochure\\.pdf).*)", destination: "/" },
      { source: "/wp-content/uploads/elementor/:path*", destination: "/" },
    ].map((r) => ({ ...r, permanent: true }));
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/wp-content/uploads/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }] },
    ];
  },
};

export default config;
