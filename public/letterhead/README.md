# happyhunterdigital letterhead

Two editable versions of the same A4 letterhead. Both use the brand tokens from
`assets/brand/design-tokens.json` in the content-engine repo: ink `#0B0B0F`,
amber `#EAB308`, Archivo display and body, Gelasio for letter copy. The mark is
drawn from the exact geometry in `design-system.md`, so it stays sharp at print
size. The wordmark is always one lowercase word: `happyhunterdigital`.

## Browser version

Open `index.html` in any modern browser.

- Click any text to edit it. Every field is `contenteditable`.
- **Print / Save PDF** opens the print dialog. Choose *Save as PDF*, leave
  margins at none and enable background graphics to keep the dark masthead.
- **New blank letter** clears the letter fields and inserts today's date.
- **Reset sample** restores the example copy.

Self-contained: fonts are in `fonts/` and there are no network requests, no
third-party scripts and no tracking. Long letters flow onto a second page
instead of being clipped.

## Word version

Open `happyhunterdigital-letterhead.docx` in Word or LibreOffice and replace the
sample text. The masthead band, mark, wordmark, contact block and footer are in
the document header and footer; the letter body is ordinary editable text.
Save as PDF to send.

The document requests the Archivo and Gelasio font families. For pixel-exact
rendering, install the TTF files in `fonts/` on the machine that opens it. Word
substitutes a sans/serif face if they are absent; the layout still holds.

## Regenerate the Word file

From the repo root:

```
python scripts/build_letterhead.py
python scripts/verify_letterhead.py
```

`verify_letterhead.py` checks the DOCX integrity and A4 setup, renders the HTML
in a real browser, asserts one A4 page with no overflow, confirms the fonts
load, checks both buttons, and fails if any external request is made.
