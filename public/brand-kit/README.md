# happyhunterdigital professional document kit

Clean, print-ready stationery. This replaces all earlier branded designs,
including the photographic and gradient versions.

## Design rules

- **No photography, gradients, glows, blend modes or decorative effects.**
- **One typeface throughout:** Inter variable, self-hosted in `fonts/`.
  Heading weights 750–800, body 400 at 10.5 pt with 1.5–1.62 line spacing.
- **Restrained colour:** white paper, ink `#111114`, grey `#5B5B63` for
  supporting text, `#FACC15` used only for thin rules and the flyer contact
  band, `#EAB308` only for list numbers.
- **Clear hierarchy:** document title as a real `h1`, sections as `h2`,
  numbered lists and a labelled table where information needs scanning.
- **Generous whitespace:** 20–24 mm side margins, consistent spacing between
  sections, left-aligned body copy with uniform paragraph spacing.
- **Page furniture:** every document has a header, a footer with contact
  details and a "Page 1 of 1" marker. The Word letterhead uses a live `PAGE`
  field.
- **Logo:** the supplied `logo-new.jpg` is keyed to a transparent
  `assets/logo.png` so it sits cleanly on white paper. Regenerate with
  `python scripts/make_transparent_logo.py`.

## The five moves

1. Free online health check — website, Google, Facebook, directories, reviews.
2. Foundation and entity SEO — one consistent record plus structured schema.
3. Web development and engineering — fast, mobile-friendly, AI-readable sites.
4. AI-ready content creation (AEO) — pages, articles and FAQs written to be cited.
5. Sales and WhatsApp automation — qualify leads and book appointments.

## Pieces

| Piece | Files |
| --- | --- |
| Letterhead A4, editable and print | `letterhead.html`, `letterhead.pdf`, `letterhead.docx` |
| Recommendation letter A4, Ludo League SA | `recommendation-ludoleaguesa.html`, `recommendation-ludoleaguesa.pdf`, `recommendation-ludoleaguesa.docx` |
| Capability sheet A4 | `flyer.html`, `flyer.pdf` |
| Poster A3 | `poster.html`, `poster.pdf` |
| Business card 90 x 55 mm, front and back | `business-card.html`, `business-card.pdf` |

Open any HTML file in a browser, click text to edit, then use **Print / Save
PDF** with margins set to none and background graphics on. PNG previews are in
`previews/`, rendered at roughly 290 DPI at final trim size.

## Copy standard

- motsumitl@happyhunterdigital.com
- +27 (0) 60 101 6673
- 574 Fred Messenger Avenue, Andeon, Pretoria West, Pretoria, South Africa
- happyhunterdigital.com
- Thabo Leslie Motsumi, Growth Strategist and Founder

`happyhunterdigital` is always one lowercase word.

## Regenerate and verify

From the repo root:

```
python scripts/make_transparent_logo.py   # only if the supplied JPG changes
python scripts/build_brand_kit.py
python scripts/verify_brand_kit.py
node scripts/consent-audit.mjs
```

Verification checks exact sheet dimensions, no overflow, the real logo
decoding on every sheet, "web development" copy present, a single Inter
typeface, no photographic or decorative effects, heading structure, page
numbers, zero external requests, correct PDF page counts and a valid DOCX
with a live page field.
