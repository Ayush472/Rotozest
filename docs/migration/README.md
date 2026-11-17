# rotozest.com: WordPress scrape and migration inventory

Scraped 2026-11-16 from https://www.rotozest.com (WordPress 6.7.11 + Elementor + Rank Math-style SEO, LiteSpeed cache).

Per-page JSON (meta, JSON-LD, headings, ordered content blocks, images, links, forms) is in `pages/`. All SEO fields are in `seo.csv`. Every image URL with alts and the pages using it is in `images.json`. Raw HTML and downloaded files are in `scrape/` (gitignored).

## Pages (sitemap)

| Path | Title | H1 | Words | Schema | Decision |
|---|---|---|---|---|---|
| `/` | Rotary Gear Pump Manufacturer in Ahmedabad | India | RotoZest (61) | Welcome to Rotozest Your Trusted Partner in Rotary Gear Pump Manufacturer in Ahmedabad | 1041 | FAQPage, LocalBusiness, Organization, Product | Keep same URL |
| `/about-us/` | About Rotozest Industries (25) | About Us | 597 | - | Keep same URL |
| `/ss-rotary-gear-pump/` | (Stainless Steel) SS Rotary Gear Pump Manufacturer in Ahmedabad | India (71) | SS Rotary Gear Pump Manufacturer | 1183 | FAQPage, Product | Keep same URL |
| `/ci-rotary-gear-pump/` | CI Rotary Gear Pump Manufacturer in India | Cast Iron Gear Pump | India (71) | CI Rotary Gear Pump | 1273 | FAQPage, Product | Keep same URL |
| `/applications/` | Industrial Applications of Rotary Gear Pumps | Rotozest (55) | Applications | 242 | - | Keep same URL |
| `/careers/` | Careers at Rotozest Industries | Join Our Team (46) | Careers | 212 | - | Keep same URL |
| `/blog/` | Blog - Rotozest Industries (26) | Blog | 84 | - | Keep same URL |
| `/contact-us/` | Contact Rotozest Industries | Get in Touch (42) | Contact Us | 65 | - | Keep same URL |
| `/chemical-transfer-pumps/` | Chemical Transfer Pumps | India | Rotozest Industries (53) | Chemical Transfer Pumps & Metered Chemical Transfer Solutions | 436 | FAQPage, Product | Keep same URL |
| `/liquid-tomato-paste-transfer-pump/` | Tomato Paste Transfer Pump - Liquid Transfer Pumps - India (58) | Tomato Paste Transfer Pump | 901 | FAQPage, Product | Keep same URL |
| `/fuel-oil-transfer-gear-pumps-manufacturer/` | Fuel Oil Pumps Manufacturer in India | Gear Pump for Oil Transfer (65) | Fuel Oil Pumps Manufacturer | 720 | Article, FAQPage, Product | Keep same URL |
| `/positive-displacement-gear-pump-manufacturer/` | Positive Displacement Gear Pump - Manufacturer and Supplier (59) | Positive Displacement Gear Pump | 592 | FAQPage, Product | Keep same URL |
| `/fluid-tech-systems-rotary-gear-pumps/` | Fluid Tech Systems Rotary Gear Pumps | Reliable Industrial Pumps (64) | Fluid Tech Systems Rotary Gear Pumps | 556 | Product | Keep same URL |
| `/ss-rotary-gear-pump-manufacturer-mumbai/` | SS Rotary Gear Pump Manufacturer & Supplier in Mumbai (53) | SS Rotary Gear Pump Manufacturer in Mumbai | 614 | Product | Keep same URL |
| `/external-rotary-gear-pump-manufacturer-india/` | External Gear Pump Manufacturers | India | Rotozest Industries (62) | External Gear Pump Manufacturers in India – Trusted Rotary Gear Pump Solutions | 642 | Product | Keep same URL |
| `/gear-pump-for-oil-transfer-complete-guide/` | Gear Pump for Oil Transfer: The Complete Guide (46) | Gear Pump for Oil Transfer: The Complete Guide | 2465 | Article | Keep same URL |
| `/best-rotary-gear-pump-manufacturer-for-viscous-liquids-india/` | Rotary Gear Pump for Viscous Liquid - Rotozest Industries (57) | Best Rotary Gear Pump Manufacturer for Viscous Liquids in India | 865 | Article, FAQPage | Keep same URL |
| `/benefits-of-using-ss-rotary-gear-pumps-in-chemical-industry/` | SS Rotary Gear Pump for Chemical Industry - Rotozest Industries (63) | Benefits of Using SS Rotary Gear Pumps in Chemical Industry | 810 | Article, FAQPage | Keep same URL |
| `/how-to-make-a-simple-and-quick-firewood/` | How To Make A Simple And Quick Firewood - Rotozest Industries (61) | How To Make A Simple And Quick Firewood | 503 | - | 301 → /blog/ (theme demo post, off-topic) |
| `/category/industry/` | Industry - Rotozest Industries (30) | Industry | 264 | - | Keep same URL |

Theme leftovers in the sitemap and robots.txt (`/home-classic/`, `/home-modern/`, `/home-main-copy/`, `/home-*-one-page/`, `/blog-grid-*`, `/about-us-2/`, `/header/*`, `/footer/*`, `/service/*`, `/portfolio/*`, `/tag/machinery/`, `/category/construction/`): 301 → `/`.

## Site-wide facts

- Host: `www.rotozest.com`. Apex, http and no-trailing-slash all 301 to `https://www.rotozest.com/<path>/`. The new site must keep trailing slashes.
- Phone +91 99740 17583, +91 99740 17582. Email info@rotozest.com.
- Address: Shed A/19 Parth Estate, Nr. Muktanand Society, Canal Road, Jamfalwadi, Ramol, Ahmedabad, Gujarat 382449, IN. Geo 22.994436, 72.639040. Opening hours Mo–Fr 09:00–19:00.
- Social: facebook.com/rotozest.industries, instagram.com/rotozest_industries_746. Map: maps.app.goo.gl/t8nkpCxRxevhKRcJ8 (schema) and maps.app.goo.gl/nCuzCyAH6anXUjVZA (footer).
- Brochure: `/wp-content/uploads/2025/06/rotozest-brochure.pdf` (keep at the same path).
- Tracking: GA4 `G-GLK4YTC4EE`, GTM `GTM-55ZFLFT4` (loads Hotjar, Microsoft Clarity, Apollo). Search Console meta `google-site-verification=f7oXrm8neJKLtApXqnSvCDKCZgVooLRixanrmHh-zp4`.
- Meta robots on every page: `index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large`.
- Forms (Contact Form 7 + Forge12 captcha): Inquiry (name, email, phone, requirement, message) on home, contact, SS and CI pages; Careers application on /careers/.
- Brand: logo blue `#00A0E3`, dark text `#363636`, headings Barlow, body Heebo. Logo `2022/05/logo.png` 1600×436, registered-mark version `2022/05/Registered-logo.png`, favicon `2025/01/favicon.png` 512².
- Loader: full-screen blue gear ("dial") spinner shown until the whole page loads.

## Speed baseline (home, measured in browser, 2026-11-16)

- 147 requests, about 1.9 MB transferred, 54 scripts, 13 CSS files, 1,658 DOM nodes.
- 13 third-party hosts: Google Fonts, GTM, GA, Hotjar (3), Clarity (3), Apollo (2).
- HTML alone is 130–290 KB per page. Server response 0.6–3.5 s from curl.
- The gear loader covers the content until all scripts finish, so the page looks blank for several seconds on slow connections.
- PageSpeed Insights API was over quota and local Lighthouse was not run. Re-measure at pagespeed.web.dev before launch.

## Images

- 202 unique image URLs (210 files, 19 MB raw). Mostly PNG, no WebP/AVIF.
- Missing alt text: 8 per blog post, 3 on home, 1 each on SS, CI and contact.
- Broken on the live site: `2025/05/elementor/thumbs/ci-rotary-gear-pump-*.png` (404).

## SEO issues to fix without changing rankings

- /blog/ meta description is just "Recent Articles". /category/industry/ has none.
- /about-us/, /applications/, /careers/, /contact-us/ have no structured data. Add BreadcrumbList everywhere and Organization/LocalBusiness site-wide.
- SS and CI pages repeat each feature heading twice as H2 (desktop + mobile copies). Keep one copy.
- `&amp;` is double-escaped inside JSON-LD text.
- Sidebar widgets (Recent Comments, Gallery, Tags) on blog posts are empty theme leftovers.
