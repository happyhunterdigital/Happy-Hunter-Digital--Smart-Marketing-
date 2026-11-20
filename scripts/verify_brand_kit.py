"""Verify the brand kit: real browser layout, PDF geometry, DOCX integrity."""
import re
import zipfile
from pathlib import Path

from docx import Document
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
KIT = ROOT / "public" / "brand-kit"

EXPECTED = {
    "letterhead": (793.7, 1122.5, 1),
    "flyer": (793.7, 1122.5, 1),
    "poster": (1122.5, 1587.4, 1),
    "business-card": (340.16, 207.87, 2),  # 90 x 55 mm at 96 CSS px/inch
}

with sync_playwright() as pw:
    browser = pw.chromium.launch(channel="msedge", headless=True)
    for name, (w, h, sheets_expected) in EXPECTED.items():
        page = browser.new_page(viewport={"width": 1600, "height": 1800})
        requests = []
        page.on("request", lambda r: requests.append(r.url))
        page.goto((KIT / (name + ".html")).as_uri(), wait_until="networkidle")
        page.evaluate("document.fonts.ready")

        m = page.evaluate("""() => {
          return [].slice.call(document.querySelectorAll('.sheet')).map(s => ({
            w: s.getBoundingClientRect().width,
            h: s.getBoundingClientRect().height,
            sw: s.scrollWidth, sh: s.scrollHeight,
            cw: s.clientWidth, ch: s.clientHeight,
            editable: s.querySelectorAll('[contenteditable]').length
          }));
        }""")
        assert len(m) == sheets_expected, (name, "sheet count", len(m))
        for i, s in enumerate(m, 1):
            assert abs(s["w"] - w) < 1.5, (name, i, "width", s["w"], w)
            assert abs(s["h"] - h) < 0.5, (name, i, "height", s["h"], h)
            assert s["sh"] <= s["ch"] + 1, (name, i, "vertical overflow", s["sh"], s["ch"])
            assert s["sw"] <= s["cw"] + 1, (name, i, "horizontal overflow", s["sw"], s["cw"])
            assert s["editable"] >= 3, (name, i, "editable fields")

        external = [u for u in requests if not u.startswith("file://")]
        assert not external, (name, "external requests", external)
        fonts_ok = page.evaluate("""() =>
          document.fonts.check('700 20px "Space Grotesk"') &&
          document.fonts.check('600 14px "Inter"') &&
          document.fonts.check('700 10px "JetBrains Mono"') &&
          document.fonts.check('400 18px "Caveat"')""" )
        assert fonts_ok, (name, "locally hosted fonts did not load")

        images = page.evaluate("""() => [].slice.call(document.images).map(i => ({
          src: i.getAttribute('src'), w: i.naturalWidth
        }))""")
        assert images, (name, "no logo image found")
        assert all(i["w"] > 100 for i in images), (name, "logo failed to decode", images)
        assert all("site-logo.jpg" in i["src"] for i in images), (name, "wrong logo asset", images)

        text = page.locator(".sheet").first.inner_text().lower()
        assert "web development" in text, (name, "web development copy missing")

        reset = page.locator("#resetBtn")
        assert reset.count() == 1
        print(name, "OK", m[0]["editable"], "editable, real logo, web development copy, no overflow, zero external requests")
        page.close()
    browser.close()

# PDFs
for name, (_, _, pages_expected) in EXPECTED.items():
    data = (KIT / (name + ".pdf")).read_bytes()
    pages = len(re.findall(rb"/Type\s*/Page\b", data))
    boxes = re.findall(rb"/MediaBox\s*\[([^\]]+)\]", data)
    assert pages == pages_expected, (name, "PDF pages", pages)
    print(name + ".pdf", "pages =", pages, "mediabox =", boxes[0].decode() if boxes else "n/a")

# DOCX
docx_path = KIT / "letterhead.docx"
with zipfile.ZipFile(docx_path) as z:
    assert z.testzip() is None
    h = z.read("word/header1.xml").decode()
    f = z.read("word/footer1.xml").decode()
    assert 'w:fill="0B0B0F"' in h, "dark masthead missing"
    assert 'w:fill="0B0B0F"' in f, "dark footer missing"
    assert any(n.startswith("word/media") and n.endswith(".jpg") for n in z.namelist()), "logo not embedded"
doc = Document(docx_path)
assert abs(doc.sections[0].page_width.mm - 210) < 0.1
print("letterhead.docx OK, real logo embedded, dark masthead and footer")

print("ALL BRAND KIT CHECKS PASSED")
