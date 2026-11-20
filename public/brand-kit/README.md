# happyhunterdigital brand kit v3

The current stationery set. It replaces every earlier letterhead design.

It is built around three corrections to the previous version:

1. **The real logo.** The actual `site-logo.jpg` lockup from the site is used
   on every piece, and embedded in the Word letterhead. On dark fields it is
   blended with `screen` so the logo's own dark backing disappears; on the
   yellow card back it sits on a dark plate. No redrawn approximation is used.
2. **Web development is named explicitly.** It is step 03 in the flyer and
   poster, it leads the letterhead body copy, and it appears in the language
   line and the card strap. The kit no longer reduces the work to AI search
   visibility.
3. **Professional colour grading and high-quality type.** Brand photography
   is colour-graded, then composited with radial amber glows, linear gradients,
   luminosity and screen blend modes, and dark scrims so type stays legible.
   Five variable fonts are self-hosted. Previews render at 3x device scale
   (roughly 290 DPI at final trim size).

Everything is first-party. No CDN, no Google Fonts request, no tracker.

## Colour and type system

- Ink `#0B0B0F`, ink-2 `#16161B`, ink-3 `#232329`.
- Yellow `#FACC15`, pale yellow `#FDE047`, amber `#EAB308`. Yellow to amber
  linear gradients are used for rules, footer bands and display text.
- Space Grotesk for display, Inter for body, JetBrains Mono for technical
  labels, Caveat for the handwritten wordmark, Archivo kept for compatibility.
- All fonts are variable TTFs in `fonts/`, loaded with `font-display:block` so
  print never captures a fallback.
- Graded source photographs are in `assets/photos/graded/`. Originals are in
  `assets/photos/`. `scripts/grade_photos.py` regenerates the graded set.

## The five moves

| # | Move |
| --- | --- |
| 01 | Free online health check, website, Google, Facebook, directories and reviews |
| 02 | Foundation and entity SEO, one consistent business record plus structured schema |
| 03 | Web development and engineering, fast, mobile-friendly sites built to be understood |
| 04 | AI-ready content (AEO), service pages, articles and FAQs written to be cited |
| 05 | Sales and WhatsApp automation, chatbots and workflows that qualify leads and book appointments |

## Pieces

| Piece | Treatment | Files |
| --- | --- | --- |
| Letterhead A4 | white body, dark photo masthead with the real logo, amber footer band | `letterhead.html`, `letterhead.pdf`, `letterhead.docx` |
| Flyer A4 | dark graded image field, five numbered cards plus a logo plate, gradient footer | `flyer.html`, `flyer.pdf` |
| Poster A3 | full dark photographic field, gradient display type, five-step strip, dark footer | `poster.html`, `poster.pdf` |
| Business card 90 x 55 mm | black front with graded founder photo and logo, gradient yellow back | `business-card.html`, `business-card.pdf` |

Each HTML file is click-to-edit. Use **Print / Save PDF**, leave margins at
none, and keep background graphics on so the gradients and blends print. The
business card prints front, then back, as two pages.

PNG previews in `previews/` are rendered at 3x scale: A4 at 2382 x 3369 px,
A3 at 3372 x 4764 px, card at 1026 x 627 px.

## Copy standard

Every piece carries the real details:

- motsumitl@happyhunterdigital.com
- +27 (0) 60 101 6673
- 574 Fred Messenger Avenue, Andeon, Pretoria West, Pretoria, South Africa
- happyhunterdigital.com
- Thabo Leslie Motsumi, Growth Strategist and Founder

`happyhunterdigital` is always one lowercase word.

## Regenerate and verify

From the repo root:

```
python scripts/grade_photos.py     # only needed if source photos change
python scripts/build_brand_kit.py
python scripts/verify_brand_kit.py
node scripts/consent-audit.mjs
```

`build_brand_kit.py` renders exact-size PDFs and 3x PNG previews, then rebuilds
the Word letterhead with the real logo. `verify_brand_kit.py` confirms exact
sheet dimensions, no overflow, decoded logo images, locally loaded fonts, web
development copy in every piece, zero external requests, correct PDF page
counts and a valid DOCX. The consent audit confirms no third-party script.
