# Rotozest Industries website

Replaces the WordPress site at www.rotozest.com with a fast Next.js 16 site. It keeps the same URLs, titles, descriptions, H1s, schema and content, so Google rankings carry over.

- Repository: [AyushPatel0407/rotozest-web](https://github.com/AyushPatel0407/rotozest-web) (moved from `Ayush472/Rotozest` on 17 Nov 2026; full history kept). `main` is the new site; `master` is the old code, kept for reference.
- Hosting: Netlify (current preview, Trupal's account). Vercel also works with no changes.
- Node 20.9 or newer (`engines` in `package.json`).

## Run
```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Environment (Netlify → Site configuration → Environment variables, or Vercel → Settings → Environment Variables)
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

## Deploy
- **Netlify:** `netlify.toml` sets the build (`npm run build`, Node 22). Netlify detects Next.js and runs the API routes (`/api/*`) as functions. Deploy from the dashboard by linking this repo, or from the CLI: `netlify deploy --build --prod`.
- **Vercel:** import the repo; no settings needed.
- After the first deploy, set the three email variables above and redeploy.

## 3D pump viewer
`/ss-rotary-gear-pump/` has a "View in 3D" button. The model is built in code from the product photos (`src/components/pump3d/scene.ts`, three.js); there is no model file to download. It loads only after the click, and the code download starts as soon as a finger or pointer reaches the button. While idle it draws nothing, so phones stay cool. Details and timings: `docs/BUILD-NOTES.md`.

## Docs
- `docs/migration/`: full scrape inventory (pages, SEO fields, images, baseline speed)
- `docs/decisions.md`: hosting, forms, tracking toggles and redirects (all changeable)
- `docs/brand.md`: colours, type, the gear mark, design rules
- `docs/3d-models-research.md`: how to make 3D models of the pumps for the product pages
- `docs/3d-pump-spec.md`: the SS pump 3D model spec, photo evidence and every review/correction round
- `docs/BUILD-NOTES.md`: what was built, checks run, and what is left before launch
