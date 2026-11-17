# Rotozest Industries website

Replaces the WordPress site at www.rotozest.com with a fast Next.js 16 site. It keeps the same URLs, titles, descriptions, H1s, schema and content, so Google rankings carry over.

## Run
```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Environment (Vercel → Settings → Environment Variables)
| Name | Example | Used by |
|---|---|---|
| `RESEND_API_KEY` | `re_…` | inquiry, careers and brochure emails |
| `MAIL_FROM` | `Rotozest Industries <info@rotozest.com>` (domain verified in Resend) | all emails |
| `MAIL_TO` | `info@rotozest.com` (optional) | team notifications |

Without these, the forms show a friendly "please email or call us" message.

## Scripts
- `npm run seo:diff`: compares every page with the scraped WordPress HTML (title, description, canonical, robots, H1, headings, schema, FAQs). Run it before each deploy against `npm start`.
- `npm run images`: rebuilds `public/images` and the 301 map from the scrape in `scrape/` (gitignored).
- `npm run content -- scrape/html`: re-imports page content from the scraped WordPress HTML.

## Docs
- `docs/migration/`: full scrape inventory (pages, SEO fields, images, baseline speed)
- `docs/decisions.md`: hosting, forms, tracking toggles and redirects (all changeable)
- `docs/brand.md`: colours, type, the gear mark, design rules
- `docs/3d-models-research.md`: how to make 3D models of the pumps for the product pages
- `docs/3d-pump-spec.md`: the SS pump 3D model spec, photo evidence and every review/correction round
- `docs/BUILD-NOTES.md`: what was built, checks run, and what is left before launch
