# happyhunterdigital brand kit

A new yellow-and-black stationery system. This replaces the earlier letterhead.
It is built around one idea: **not just AI visibility**. The copy describes the
full four-step service, from the free health check to WhatsApp automation.

## The system

- Ink `#0B0B0F` and yellow `#FACC15`, with amber `#EAB308` only as a print rule.
- Archivo variable for everything, from 100 to 900 weight. Display is 900 with
  tight tracking; technical labels use a system monospace, uppercase, tracked.
- Corner reticle brackets, numbered steps `01` to `04`, hard rules, no gradients,
  no glows, no shadows.
- The mark is drawn from the geometry in the design system, so it stays sharp
  at any print size. The name is always one lowercase word: `happyhunterdigital`.

Each piece uses a different dominant field so the set does not feel like one
template repeated:

| Piece | Field | Files |
| --- | --- | --- |
| Letterhead A4 | white paper, yellow masthead, black footer | `letterhead.html`, `letterhead.pdf`, `letterhead.docx` |
| Flyer A4 | black paper, alternating yellow and black step cards | `flyer.html`, `flyer.pdf` |
| Poster A3 | full yellow, oversized black type, black footer block | `poster.html`, `poster.pdf` |
| Business card 90 x 55 mm | black front, yellow back | `business-card.html`, `business-card.pdf` |

## Edit and print

Open any `.html` file in a modern browser. Click any text to change it. Use
**Print / Save PDF**, leave margins at none, and keep background graphics on so
the colour fields print. **Reset content** restores the shipped copy. The
business card prints as two pages: front, then back.

The PDFs in this folder are print-ready versions of the shipped copy. PNG
previews are in `previews/`.

The Word letterhead has the same design: yellow masthead, mark, wordmark and
strip in the header; contact block and web line in the footer. Replace the
sample letter text in the body. Install the TTF in `fonts/` for exact type.

## Copy standard

Every piece carries the real details:

- motsumitl@happyhunterdigital.com
- +27 (0) 60 101 6673
- 574 Fred Messenger Avenue, Andeon, Pretoria West, Pretoria, South Africa
- happyhunterdigital.com
- Thabo Leslie Motsumi, Growth Strategist and Founder

The four steps are stated consistently: free online health check, foundation
and entity SEO, AI-ready content (AEO), sales and WhatsApp automation.

## Regenerate and verify

From the repo root:

```
python scripts/build_brand_kit.py
python scripts/verify_brand_kit.py
node scripts/consent-audit.mjs
```

`build_brand_kit.py` renders all four sheets to PDF at their exact page sizes,
writes PNG previews, and rebuilds the Word letterhead. `verify_brand_kit.py`
checks every sheet in a real browser for exact dimensions, overflow, editable
fields and zero external requests, then validates the PDF page counts and the
DOCX structure. The consent audit confirms no third-party script is present.

Keep the `.html` files, `system.css`, `fonts/` and the scripts together. Nothing is
loaded from a CDN: no Google Fonts, no trackers, no analytics.
