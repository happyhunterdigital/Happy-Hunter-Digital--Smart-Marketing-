"""Verify the professional document kit: layout, logo, copy and print output."""
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
    "business-card": (340.16, 207.87, 2),
}

with sync_playwright() as pw:
    browser = pw.chromium.launch(channel="msedge", headless=True)
    for name, (w, h, sheets_expected) in EXPECTED.items():
        page = browser.new_page(viewport={"width": 1600, "height": 1800})
        requests = []
        page.on("request", lambda r: requests.append(r.url))
        page.goto((KIT / (name + ".html")).as_uri(), wait_until="networkidle")
        page.evaluate("document.fonts.ready")

        m = page.evaluate("""() => [].slice.call(document.querySelectorAll('.sheet')).map(s => ({
          w: s.getBoundingClientRect().width,
          h: s.getBoundingClientRect().height,
          sw: s.scrollWidth, sh: s.scrollHeight,
          cw: s.clientWidth, ch: s.clientHeight,
          editable: s.querySelectorAll('[contenteditable]').length
        }))""")
        assert len(m) == sheets_expected, (name, "sheet count", len(m))
        for i, s in enumerate(m, 1):
            assert abs(s["w"] - w) < 1.5, (name, i, "width", s["w"], w)
            assert abs(s["h"] - h) < 0.5, (name, i, "height", s["h"], h)
            assert s["sh"] <= s["ch"] + 1, (name, i, "vertical overflow", s["sh"], s["ch"])
            assert s["sw"] <= s["cw"] + 1, (name, i, "horizontal overflow", s["sw"], s["cw"])
            assert s["editable"] >= 3, (name, i, "editable fields")

        external = [u for u in requests if not u.startswith("file://")]
        assert not external, (name, "external requests", external)
        assert page.evaluate("() => document.fonts.check('400 11pt Inter')"), (name, "Inter did not load")

        images = page.evaluate("""() => [].slice.call(document.images).map(i => ({
          src: i.getAttribute('src'), w: i.naturalWidth, h: i.naturalHeight
        }))""")
        assert images and all(i["w"] > 300 for i in images), (name, "logo failed to decode", images)
        assert all("logo.png" in i["src"] for i in images), (name, "wrong logo", images)

        text = page.locator(".sheet").first.inner_text().lower()
        assert "web development" in text, (name, "web development copy missing")

        html = (KIT / (name + ".html")).read_text(encoding="utf-8")
        assert "assets/photos" not in html and "photo" not in html, (name, "photography found")
        assert "gradient" not in html and "blend" not in html and "glow" not in html, (name, "decorative effect found")
        assert "caveat" not in html.lower() and "jetbrains" not in html.lower(), (name, "extra font found")

        if name != "business-card":
            assert page.locator("h1").count() >= 1, (name, "no h1")
            assert page.locator("h2").count() >= 1, (name, "no h2")
            assert "page 1 of 1" in text, (name, "page number missing")
            assert page.locator("table.data").count() >= 1 or name == "letterhead", (name, "no labelled table")

        print(name, "OK", m[0]["editable"], "editable, real logo, web development copy, no overflow, no external requests")
        page.close()
    browser.close()

for name, (_, _, pages_expected) in EXPECTED.items():
    data = (KIT / (name + ".pdf")).read_bytes()
    pages = len(re.findall(rb"/Type\s*/Page\b", data))
    boxes = re.findall(rb"/MediaBox\s*\[([^\]]+)\]", data)
    assert pages == pages_expected, (name, "PDF pages", pages)
    print(name + ".pdf", "pages =", pages, "mediabox =", boxes[0].decode() if boxes else "n/a")

docx_path = KIT / "letterhead.docx"
with zipfile.ZipFile(docx_path) as z:
    assert z.testzip() is None
    names = z.namelist()
    assert any(n.startswith("word/media") and n.endswith(".png") for n in names), "transparent logo not embedded"
    xml = z.read("word/document.xml").decode()
    foot = z.read("word/footer1.xml").decode()
    assert "Inter" in xml, "Inter not set in Word document"
    assert "PAGE" in foot, "live page number missing from Word footer"
    for extra in ("Caveat", "Space Grotesk", "JetBrains Mono", "Archivo"):
        assert extra not in xml + foot, extra + " found in Word document"
doc = Document(docx_path)
assert abs(doc.sections[0].page_width.mm - 210) < 0.1
print("letterhead.docx OK, single Inter typeface, real logo, live page number")

print("ALL BRAND KIT CHECKS PASSED")
