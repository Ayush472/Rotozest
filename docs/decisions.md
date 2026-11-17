# Decisions (can be changed later)

| # | Decision | Current choice | How to change |
|---|---|---|---|
| 1 | Hosting | **Vercel** (Next.js 16, static pages + one API route, Mumbai region) | Any Node host works. For a static host, drop `/api/inquiry` and use a form service. |
| 2 | Form email | **Resend**, sending to info@rotozest.com. Env: `RESEND_API_KEY`, `MAIL_FROM` (verified domain), optional `MAIL_TO`. | `src/app/api/inquiry/route.ts` |
| 3 | Google Tag Manager | **On**, `GTM-55ZFLFT4` (same container as WordPress). It still loads Hotjar, Microsoft Clarity and Apollo, so turn those on or off inside GTM. | `tracking.gtmId` in `src/lib/site.ts` (set to `null` to remove) |
| 4 | Google Analytics 4 | **On**, `G-GLK4YTC4EE`, loaded after the page is interactive | `tracking.ga4Id` in `src/lib/site.ts` |
| 5 | Search Console verification | **Kept**, same HTML tag as WordPress | `tracking.googleSiteVerification` |
| 6 | Gear loader | **On**, first page view per session only, about 0.8 s, never blocks clicks, off with reduced motion | Remove `<GearLoader />` in `src/app/layout.tsx` |
| 7 | Primary colour | **Logo blue `#00A0E3`** for buttons and links (client request), even though it is below AA contrast for small text | `--color-brand*` in `src/app/globals.css` |
| 8 | Firewood demo blog post | **Removed**, 301 to /blog/ | `legacy` list in `next.config.ts` |
| 9 | Theme demo pages and stock photos | **Removed**, 301 to the closest page | `next.config.ts`, `scripts/optimize-images.mjs` (SKIP list) |
| 10 | Old image URLs | **301 to the new WebP** with the same name (200 URLs) | Regenerate with `npm run images` |
| 11 | Brochure PDF | **Same URL** `/wp-content/uploads/2025/06/rotozest-brochure.pdf` | Replace the file in `public/wp-content/uploads/2025/06/` |
| 12 | Captcha | **Honeypot + time check** instead of the WordPress math captcha | Add Cloudflare Turnstile if spam gets through |
| 13 | Logo in header | **WebP of the existing PNG**. Not traced to SVG, which needs the original vector from the client. | Swap the file in `Header.tsx` |
