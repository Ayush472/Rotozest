# Rotozest brand guide (website)

## Colour
| Token | Hex | Use |
|---|---|---|
| `brand` | `#00A0E3` | Logo blue. Buttons, links, icons, the brochure band, rules. The client wants the exact logo blue everywhere. |
| `brand-deep` | `#0088C2` | Hover/pressed state of the blue only. |
| `steel` | `#0E2A3B` | Headings, page title bands, footer. |
| `body` | `#363636` | Body text (same as the WordPress site). |
| `muted` | `#5B6770` | Secondary text. |
| `surface` | `#EEF3F6` | Alternating section background. |
| `iron` | `#1B1D1F` | Dark product sections (cast-iron feel). |

Note: white text on `#00A0E3` is about 2.9:1 contrast, below WCAG AA for small text. Buttons use 18 px semibold text to compensate. The client chose the exact logo blue over a darker variant.

## Type
- Headings: Barlow Semi Condensed 500/600/700. Body: Heebo 400/500/600. Both are self-hosted through `next/font`.
- Sentence case. No all-caps labels and no italic accent words in headings.

## Marks
- Logo: `public/images/registered-logo.webp` (header), `public/images/rotozest-logo.png` (schema.org, inverted in the footer).
- The gear: `src/components/Gear.tsx`. Solid gear = page loader (the old site's "dial"), process steps and the 404 page. Line gears = a slow drawing behind product photos. It is the one recurring motif, so don't add other decorative shapes.

## Rules (unslop-ui)
- No gradients, glass, glow shadows or emoji. One icon set (lucide-react).
- Real product photos over icons. Product photos sit on `#ECEFF1`/`#E9ECEE` with `mix-blend-multiply` so the studio grey melts into the panel.
- Motion: only the loader and the slow hero gear. Everything is static with `prefers-reduced-motion`.
- Layout: left-aligned, 72-character prose width, hairline `line` borders instead of shadows.
