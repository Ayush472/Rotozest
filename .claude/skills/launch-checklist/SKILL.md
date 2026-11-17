---
name: launch-checklist
description: "Go through a pre-launch checklist for a new website or subdomain: domain and redirects, favicons and app icons, link-preview (Open Graph) images and tags, robots/sitemap/canonical/structured data, Search Console, llms.txt, WCAG 2.2 AA, Core Web Vitals, security headers, privacy and links. Use before launching a site, when link previews show no image, when a favicon is missing, or when someone asks \"is this site ready to go live?\"."
---

# Launch checklist

Check every item against the **deployed** site (previews and caches lie), and
report evidence, not impressions: the URL you fetched, the status code, the tag
value. Fix in this order: broken (404s, redirects, missing images) → wrong
(titles, colors, icons) → better (performance, extras).

## How to check fast

- Tags and icons: fetch the page and read `<head>` (`curl -s URL | sed -n '/<head/,/<\/head>/p'`),
  then fetch every icon and `og:image` URL and confirm **200** with an image content type.
- Headers: `curl -sI URL`.
- Crawler files: `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/favicon.ico`, `/manifest.webmanifest`.
- Accessibility: run axe on each page template; then keyboard through one full flow.
- Performance: Lighthouse (mobile) or PageSpeed Insights on the home page and one heavy page.

## 1. Domain, hosting, email

- [ ] Domain points at the host; **HTTPS** works (`.dev` requires it).
- [ ] `www` → apex with a **301** (or the other way round, but one home only).
- [ ] Old addresses **redirect (301/308)** to the new ones, page by page (keep `/privacy` URLs that app stores link to).
- [ ] Preview/staging URLs send `X-Robots-Tag: noindex` (Vercel does this for `*.vercel.app`).
- [ ] Email for the domain works: send a test to `hello@` and get it.
  Check: `curl -sI https://www.www.rotozest.com/` shows `301`; send a test email.

## 2. Icons and app identity (what tabs, bookmarks and home screens show)

- [ ] `icon.svg` favicon (crisp at any size).
- [ ] `/favicon.ico` at the root (16/32/48). Slack, readers and old browsers ask for this exact file.
- [ ] `apple-touch-icon.png` **180×180** on a solid background (iOS turns transparency black).
- [ ] `icon-192.png`, `icon-512.png` and a **maskable** 512 (10% padding) for Android.
- [ ] `manifest.webmanifest` with name, short name, colors and those icons.
- [ ] `theme-color` meta, light and dark if the site has both.
- [ ] Each product/subdomain has **its own** set, not the parent's.
  Generate them from one square SVG; most frameworks have an icons/metadata API (Next.js: `icons` in metadata, `app/manifest.ts`).

## 3. Link previews (what Slack, iMessage, WhatsApp, LinkedIn, X show)

- [ ] `<title>` ≤ ~60 characters, unique per page.
- [ ] Meta description ~120–160 characters, unique per page.
- [ ] `og:title`, `og:description`, `og:url`, `og:site_name`, `og:type`, `og:locale`.
- [ ] `og:image` **1200×630** PNG/JPG, under ~1 MB, with `og:image:alt`. Text readable at thumbnail size.
- [ ] A share image **per page type** (home, product, article…), not one for the whole site.
- [ ] Image URL is **absolute**, returns **200 with no redirect**, and isn't blocked by robots.txt.
- [ ] `twitter:card = summary_large_image`.
- [ ] Tested in the real tools (they cache, so test after deploy):
  [opengraph.xyz](https://www.opengraph.xyz), [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/),
  [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/), and a paste into Slack/iMessage.
  Next.js: an `opengraph-image.tsx` next to each page generates them at build time.

## 4. Search engines

- [ ] `robots.txt` allows crawling and lists the sitemap.
- [ ] `sitemap.xml`: every public page (pages only), absolute URLs, `lastmod`.
- [ ] `<link rel="canonical">` on every page, pointing at itself.
- [ ] `<html lang>` set.
- [ ] A real **404** page that returns status 404.
- [ ] Structured data (JSON-LD): Organization + WebSite on the home page; Product / SoftwareApplication /
  Article / FAQPage / BreadcrumbList where they fit. Check with
  [Rich Results Test](https://search.google.com/test/rich-results).
- [ ] **Google Search Console**: Domain property (one DNS TXT record covers all subdomains), every sitemap
  submitted and showing **Success**. Bing Webmaster Tools: import from Search Console.
- [ ] After a week: Search Console → Pages shows pages indexed, no unexpected "Excluded".

## 5. AI assistants

- [ ] `/llms.txt`: what the site is, key pages with one-line summaries, contact ([llmstxt.org](https://llmstxt.org)).
- [ ] Product subdomains have their own `llms.txt`, linked from the main one.

## 6. Accessibility (WCAG 2.2 AA)

- [ ] An automated scan (axe, e.g. `@axe-core/playwright`) on every page template shows **no violations**, in light and dark, desktop and phone.
- [ ] "Skip to content" link; one `<h1>`; headings in order.
- [ ] Everything works with the keyboard; focus is always visible.
- [ ] Text contrast ≥ 4.5:1 (3:1 for large text and UI borders) **in light and dark**.
- [ ] Images have `alt` (empty for decoration); icon buttons have a name.
- [ ] Forms: labels, errors tied to fields, focus moves to the first error.
- [ ] Targets ≥ 24×24 px; works at 200% zoom and at 375 px wide with no sideways scroll.
- [ ] `prefers-reduced-motion` turns animation off.

## 7. Performance

- [ ] Lighthouse mobile ≥ 90; Core Web Vitals: **LCP < 2.5 s, CLS < 0.1, INP < 200 ms**.
- [ ] Images sized and compressed (`next/image` or pre-sized), videos lazy and muted.
- [ ] Fonts self-hosted via `next/font`, no layout shift.
- [ ] Heavy libraries (3D, charts, Mermaid) load only on the pages that use them.

## 8. Security and privacy

- [ ] HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors`
  Check: `curl -sI https://www.rotozest.com/`.
- [ ] No secrets in client code or the repo; env vars set in the host, not committed.
- [ ] Forms have spam protection (honeypot, Turnstile) and server-side validation.
- [ ] Privacy policy (required for app store listings and any analytics/forms); terms if you sell.
- [ ] Cookieless analytics, or a consent banner if you set cookies.

## 9. Content and links

- [ ] No placeholder text, fake numbers or stock-photo filler; real screenshots.
- [ ] Every link works (internal and external); store badges point to the right listing.
- [ ] Contact email and forms actually deliver (send one).
- [ ] No personal or client data that shouldn't be public.

## 10. After launch

- [ ] Analytics receiving visits; uptime monitor on the home page; error tracking on.
- [ ] Share the link in Slack/iMessage once to warm caches and eyeball the preview.
- [ ] Re-run the share-tag and accessibility checks against production.
- [ ] Add the site to your portfolio/status page and its sitemap to Search Console.

## Report format

| Section | Status | Evidence | Fix |
|---|---|---|---|
| Link previews | ❌ | `og:image` 308 → redirect | serve the image directly |

## Customize for your project

- `www.rotozest.com`, your host's redirect and header config, which validators your audience's apps use.
