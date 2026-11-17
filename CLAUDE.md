# Agent team (from skills.trueorfalse.dev)

Add this to your project's CLAUDE.md (keep the whole file under ~200 lines).

Route each ask to one owner, write a work order before code, verify before done, hand off when pausing. Brand guide: `docs/brand.md`. UI code: `src/`. Live domain: www.rotozest.com. Migration notes: `docs/migration/`.

| Item | Type | Does | Use when |
|---|---|---|---|
| `seo-audit` | skill | Run a comprehensive SEO audit — keyword research, on-page analysis, content gaps, technical checks, and competitor comparison. | assessing a site's SEO health; when finding keyword opportunities and content gaps competitors own |
| `launch-checklist` | workflow | Checks a site before launch (icons, share previews, SEO files, accessibility, speed, security) and reports what's missing with how to fix it. | "is the site ready to launch?", "go live", "pre-launch"; link previews in Slack/iMessage with no image or the wrong title |
| `web-perf` | skill | Audits and improves page load and interaction performance, Core Web Vitals and Lighthouse scores. | slow LCP, INP or CLS; Lighthouse performance below target |
| `react-performance` | skill | React and Next.js performance optimization patterns adapted from Vercel Engineering's React Best Practices… | writing; reviewing |
| `frontend-design` | skill | Guides distinctive, intentional visual design (aesthetic direction, typography) so UI does not read as a template. | building a new UI from scratch; a page that looks generic |
| `unslop-ui` | skill | Gives a 20-point checklist of the tells that make a site look AI-made, each with how to spot it in code and what to do instead. | a landing page or hero built by an AI tool; purple or violet gradients, glows or glass panels |
| `ui-slop-auditor` | agent | Scans UI code against the unslop-ui checklist and the brand guide and returns a ranked list of fixes. | a generated landing page or marketing site before launch; does this look like AI made it? |
