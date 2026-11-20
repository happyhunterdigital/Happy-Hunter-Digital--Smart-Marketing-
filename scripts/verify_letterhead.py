"""Render the letterhead in a real browser and assert layout + consent invariants."""
import os
import re
import zipfile
from pathlib import Path

from docx import Document
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
HTML = ROOT / "public" / "letterhead" / "index.html"
DOCX = ROOT / "public" / "letterhead" / "happyhunterdigital-letterhead.docx"

# 1. docx integrity
with zipfile.ZipFile(DOCX) as z:
    bad = z.testzip()
    assert bad is None, bad
    names = set(z.namelist())
    assert "word/document.xml" in names and "word/header1.xml" in names and "word/footer1.xml" in names
doc = Document(DOCX)
assert abs(doc.sections[0].page_width.mm - 210) < 0.1 and abs(doc.sections[0].page_height.mm - 297) < 0.1
header_text = " ".join(p.text for p in doc.sections[0].header.paragraphs)
for t in doc.sections[0].header.tables:
    for row in t.rows:
        for cell in row.cells:
            header_text += " " + cell.text
footer_text = " ".join(p.text for p in doc.sections[0].footer.paragraphs)
assert "happy" in header_text and "hunter" in header_text and "digital" in header_text
assert "motsumitl@happyhunterdigital.com" in footer_text
print("docx: valid zip, A4, header/footer contact present, body paragraphs:", len(doc.paragraphs))

# 2. browser render
with sync_playwright() as pw:
    browser = pw.chromium.launch(channel="msedge", headless=True)
    page = browser.new_page(viewport={"width": 1100, "height": 1300})
    requests = []
    page.on("request", lambda r: requests.append(r.url))
    page.goto(HTML.as_uri(), wait_until="networkidle")
    page.evaluate("document.fonts.ready")

    metrics = page.evaluate("""() => {
      const p = document.getElementById('page');
      const r = p.getBoundingClientRect();
      const m = document.querySelector('.masthead').getBoundingClientRect();
      const l = document.querySelector('.letter').getBoundingClientRect();
      const f = document.querySelector('.foot').getBoundingClientRect();
      const s = document.querySelector('.subject').getBoundingClientRect();
      return {
        pageW: r.width, pageH: r.height,
        mastH: m.height, letterH: l.height, footH: f.height,
        sumH: m.height + l.height + f.height,
        subjectBottom: s.bottom, letterBottom: l.bottom,
        editable: document.querySelectorAll('[contenteditable]').length,
        brand: document.querySelector('[data-field=brand]').textContent,
      };
    }""")
    for k, v in metrics.items():
        print(" ", k, "=", v)

    assert abs(metrics["pageW"] - 793.7) < 1.5, "page not A4 width"
    assert abs(metrics["pageH"] - 1122.5) < 1.5, "page not A4 height"
    assert metrics["sumH"] <= metrics["pageH"] + 0.5, "content taller than page"
    assert metrics["subjectBottom"] < metrics["letterBottom"], "subject overflow"
    assert metrics["editable"] >= 10
    assert metrics["brand"] == "happyhunterdigital"

    fonts = page.evaluate("() => [document.fonts.check('900 20px Archivo'), document.fonts.check('10.5px Gelasio')]")
    assert all(fonts), "brand fonts did not load: " + repr(fonts)

    # buttons behave
    page.click("#blankBtn")
    assert page.eval_on_selector('[data-field="subject"]', "el => el.textContent") == ""
    page.click("#resetBtn")
    assert page.eval_on_selector('[data-field="subject"]', "el => el.textContent") == "A note on being the answer"

    external = [u for u in requests if not u.startswith("file://")]
    assert not external, "external requests: " + repr(external)
    print("browser: single A4 page, no overflow,", metrics["editable"], "editable fields, zero external requests")

    pdf = page.pdf(format="A4", print_background=True, prefer_css_page_size=True)
    pages = len(re.findall(rb"/Type\s*/Page\b", pdf))
    print("print PDF: bytes =", len(pdf), "pages =", pages)
    assert pages == 1, "PDF should be one A4 page"
    browser.close()

print("ALL CHECKS PASSED")
