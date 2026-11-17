---
name: unslop-ui
description: "Removes the \"AI-generated website\" look from a UI: purple gradients, emoji icons, default Inter, italic-serif accent words, hero badges, glowing shadows, glassmorphism, identical card grids, stat banners, 1-2-3 step sections, fade-in on every section and stock shadcn. Use when building or polishing a landing page, marketing site or app screen, when a page \"looks like every other AI site\", or before a launch."
---

# Unslop the UI

AI tools converge on the same defaults, so their sites look alike. None of these
choices is wrong on its own. Together they read as "nobody decided anything".
The fix is never "remove it". Replace each default with a **decision** that comes from
the brand (see the `brand-guide` skill; if `docs/brand.md` exists, read it first).

## How to run it

1. Read `docs/brand.md` (or write one with `brand-guide` if there is none).
2. Run the detection commands below over `src/`.
3. Go through the 20 checks in order. For each one, mark it **pass**, **fixed** or
   **kept on purpose** (with a one-line reason, e.g. "the brand colour *is* violet").
4. Look at the page at 375 px and 1280 px, in light and dark, before calling it done.

Keeping something on purpose is fine. Keeping it by default is the problem.

## Quick detection

```bash
UI=src/
# 1, 17: gradients, purple/violet/indigo
grep -rnE "bg-gradient|linear-gradient|from-(purple|violet|indigo|fuchsia)|to-(purple|violet|indigo|pink)" $UI
# 2: emoji in markup (rocket, sparkles, lightning, check, fire…)
grep -rnP "[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]" $UI
# 2: more than one icon library
grep -rhoE "from ['\"](lucide-react|react-icons[^'\"]*|@heroicons[^'\"]*|@phosphor-icons[^'\"]*|@tabler[^'\"]*|@radix-ui/react-icons)['\"]" $UI | sort | uniq -c
# 3: Inter as the only font
grep -rnE "Inter\b|font-sans" $UI app/layout.* tailwind.config.* 2>/dev/null | head
# 4: italic accent word inside a heading
grep -rnE "<(em|i)[ >]|italic" $UI | grep -iE "h1|h2|heading|title" | head
# 9: glow shadows
grep -rnE "shadow-\[0_0_|shadow-(purple|violet|indigo|blue)-|drop-shadow-\[0_0_|box-shadow:\s*0 0 [0-9]+px" $UI
# 12: glassmorphism
grep -rnE "backdrop-blur|backdrop-filter|bg-white/(5|10|20)" $UI
# 13: tracked all-caps labels
grep -rnE "uppercase.*tracking-(wide|wider|widest)|tracking-(wide|wider|widest).*uppercase" $UI
# 18: untouched shadcn defaults (base colour, radius) – compare with the brand guide
grep -nE "--radius|--primary|baseColor" components.json app/globals.css src/app/globals.css 2>/dev/null
# 19: fade-in on scroll everywhere
grep -rnE "whileInView|data-aos|animate-fade|fadeIn|IntersectionObserver" $UI | wc -l
# 20: favicon and meta
ls public/favicon* app/icon* app/favicon* app/opengraph-image* 2>/dev/null; grep -rnE "metadata|<title>|og:image" app/layout.* 2>/dev/null | head
```

## The 20 checks

### Colour and surface

**1. Drop the purple gradient.** The violet-to-blue hero gradient is the strongest
tell of all. *Instead:* one solid brand colour used sparingly (buttons, links, one
highlight), on a neutral background. If you need depth, use a flat tint of the brand
colour or a real photo.

**8. Fix colour contrast.** Grey-on-grey body text and light-grey placeholders fail
WCAG. *Instead:* body text at 4.5:1 or better, large text and UI borders at 3:1. Check
both themes (`accessibility` skill).

**9. Cut the glowing shadows.** Coloured `0 0 40px` glows around cards and buttons look
like a template. *Instead:* one neutral shadow scale (e.g. `0 1px 2px` and `0 4px 12px`
at low opacity), or borders with no shadow at all.

**10. No coloured card borders.** A 1px border in the accent colour on every card
fights the content. *Instead:* neutral borders from the token scale. Use colour only
on the one card that has to stand out (the "recommended" plan).

**12. No glassmorphism.** Frosted panels over blurred blobs date a site instantly and
hurt contrast. *Instead:* solid surfaces from the token scale. Blur only where it does
a job, e.g. a sticky header over scrolling content.

**17. No gradient backgrounds.** Mesh and radial "aurora" backgrounds behind sections.
*Instead:* flat neutral sections, alternating at most between two surface tokens.

### Type

**3. Swap out Inter.** Inter is good, which is why every generated site uses it. *Instead:*
pick a typeface with character for headings (the brand guide names it) and keep a
readable sans for body. One display face and one text face is enough.

**4. No italic serif word.** "Build *faster* with AI": one word in italic serif inside a
sans headline is now a cliché. *Instead:* let the headline's wording carry the
emphasis. If the brand uses a serif, use it for the whole heading.

**13. Ease up on all-caps labels.** Tiny `UPPERCASE tracking-widest` eyebrows above every
heading. *Instead:* at most one level of eyebrow, in sentence case, or none at all.

**16. Fix text wrapping.** One orphan word on the last line of a headline, or ragged
paragraphs. *Instead:* `text-wrap: balance` on headings, `text-wrap: pretty` on
paragraphs, a max line length of about 60–75 characters (`max-w-prose`), and a
non-breaking space where a brand name must stay together.

### Icons and imagery

**2. Consistent icons, no emojis.** 🚀 ✨ ⚡ as feature icons, or icons from three
libraries with different stroke widths. *Instead:* one icon set at one stroke width
and size scale. Better still, use product screenshots or small illustrations made for
the brand.

**20. Custom favicon and meta tags.** The framework's default favicon, "Create Next App"
as the title, no share image. *Instead:* a favicon from the logo (SVG + 32px PNG + Apple
touch icon), a real `<title>` and description for each page, and an Open Graph image
that shows the product.

### Layout and components

**5. Lose the headline badge.** The pill above the hero ("✨ New: AI-powered") is on every
generated landing page. *Instead:* start with the headline. Put real news in a slim
banner or in the nav, and only if it's actually new.

**6. Skip the 2-button hero.** "Get started" plus "Learn more" side by side splits
attention. *Instead:* one primary action. A secondary action, if any, is a text link.

**7. Match outer and inner radius.** A `rounded-2xl` card holding `rounded-2xl` children
looks off because the gap isn't even. *Instead:* inner radius = outer radius minus the
padding between them (e.g. 24px card with 8px padding → 16px inner). Keep a 3–4 step
radius scale in tokens.

**11. Break up identical cards.** A grid of six same-sized cards, each with icon, title
and two lines. *Instead:* vary the layout by importance. Use one large feature with a real
screenshot, then a smaller row, or a list. Not everything deserves a card.

**14. Drop the stat banner.** "10k+ users · 99.9% uptime · 24/7 support" with made-up
or unverifiable numbers. *Instead:* one specific proof point you can back up (a named
customer, a real metric with its source, a quote with a name). If there are no real
numbers yet, leave the section out.

**15. Ditch the 1-2-3 steps.** Three numbered circles joined by a line ("Sign up →
Connect → Done") is filler on most products. *Instead:* show the product doing the
thing: a short screen recording, an annotated screenshot or an interactive demo.

**18. Restyle default shadcn.** Stock shadcn (zinc, `0.5rem` radius, default focus ring)
is recognisable on sight. *Instead:* set the base colour, radius, fonts and focus ring
from the brand guide in the theme file, then adjust the components you use most:
button, card, input, badge.

### Motion

**19. No fade-in on every section.** Everything fading up as you scroll slows reading and
says nothing. *Instead:* animate only what explains something (a state change, a
product demo, a transition between views). Respect `prefers-reduced-motion`. Rules are in
the `motion` skill.

## Also worth checking

- **Generic hero copy.** "Unlock the power of…", "Supercharge your workflow",
  "Seamless", "Revolutionize". Say what the product does, for whom, in plain words.
- **Placeholder content.** Lorem ipsum, "John Doe", fake logos in a "Trusted by" strip.
  Remove these until the content is real.
- **Default dark mode.** Pure `#000` with pure `#fff` text. Use a near-black surface and
  off-white text from tokens.
- **Same section rhythm.** Every section is centred heading → subheading → grid. Vary
  alignment and density.

## Report format

```
unslop-ui: <page or path>
 1 purple gradient     fixed   hero bg → solid --surface, brand colour on CTA only
 2 icons / emoji       fixed   6 emoji → lucide, one stroke width
 3 Inter               kept    brand guide sets Inter for body; display face added for headings
 …
20 favicon + meta      fixed   icon.svg, apple-icon.png, og image, titles per page
Kept on purpose: 3 (reasons above)
Checked at 375 / 1280 px, light + dark: yes
```
