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
    "recommendation-ludoleaguesa": (793.7, 1122.5, 1),
    "discovery-questionnaire": (793.7, 1122.5, 2),
    "flyer": (793.7, 1122.5, 1),
    "poster": (1122.5, 1587.4, 1),
    "business-card": (340.16, 207.87, 2),
}

QUESTIONNAIRE_INTRO = (
    "To create effective content, you need to understand your client's business, "
    "audience, and goals before writing a single word. Ask questions organized "
    "into five core areas: goals, audience, brand voice, logistics, and competition."
)

QUESTIONNAIRE_SECTIONS = (
    "Business & Goals",
    "Target Audience",
    "Brand Voice & Messaging",
    "Content Specifics & Logistics",
    "Competitive Landscape",
)

QUESTIONNAIRE_QUESTIONS = (
    "What is the primary goal of this content? (e.g., brand awareness, lead generation, direct sales, or educating existing customers)",
    "What specific action do you want the reader to take after consuming the content? (e.g., book a call, sign up for a newsletter, buy a product)",
    "What are your main products or services, and which ones should we prioritize right now?",
    "How will we measure success? (e.g., website traffic, engagement rates, conversions)",
    "Who is your ideal customer? (Ask for demographics like age, location, and job title, as well as interests)",
    "What are their biggest pain points or challenges that your business solves?",
    "What common questions or objections do your customers have before buying from you?",
    "Where does your audience spend their time online? (e.g., LinkedIn, Instagram, TikTok, Google search)",
    "How would you describe your brand's personality in three to five words? (e.g., professional, witty, empathetic, bold)",
    "Do you have existing brand guidelines, a style guide, or examples of past content you love?",
    "Are there any competitors or other brands whose style or tone you admire?",
    "Are there specific words, phrases, or topics we should strictly avoid?",
    "What formats and platforms are we creating for? (e.g., weekly blog posts, LinkedIn articles, Instagram reels, email newsletters)",
    "What is your expected publishing frequency and turnaround time?",
    "Do you have internal subject matter experts (SMEs) I can interview, or existing research/data I should use?",
    "Who is the final decision-maker for approvals, and how many rounds of revisions are expected?",
    "Who are your top three direct competitors?",
    "What makes your business different from—or better than—those competitors?",
    "What is a common misconception about your industry that you want to clear up?",
)

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

        sheet_texts = [s.inner_text().lower() for s in page.locator(".sheet").all()]
        text = sheet_texts[0]
        if name == "recommendation-ludoleaguesa":
            assert "ludoleaguesa" in text and "key strengths" in text, (name, "recommendation copy missing")
        else:
            assert "web development" in text, (name, "web development copy missing")

        html = (KIT / (name + ".html")).read_text(encoding="utf-8")
        assert "assets/photos" not in html and "photo" not in html, (name, "photography found")
        assert "gradient" not in html and "blend" not in html and "glow" not in html, (name, "decorative effect found")
        assert "caveat" not in html.lower() and "jetbrains" not in html.lower(), (name, "extra font found")

        if name == "discovery-questionnaire":
            body = " ".join(sheet_texts)
            assert page.locator("h1").inner_text() == "happyhunterdigital Discovery Questionnaire", (name, "exact title missing")
            assert QUESTIONNAIRE_INTRO.lower() in body, (name, "exact intro missing")
            for section in QUESTIONNAIRE_SECTIONS:
                assert section.lower() in body, (name, "section missing", section)
            for question in QUESTIONNAIRE_QUESTIONS:
                assert question.lower() in body, (name, "question missing", question)
            assert page.locator("h2").count() == 5, (name, "section heading count")

        if name != "business-card":
            assert page.locator("h1").count() >= 1, (name, "no h1")
            assert page.locator("h2").count() >= 1, (name, "no h2")
            for i, sheet_text in enumerate(sheet_texts, 1):
                assert "page {} of {}".format(i, sheets_expected) in sheet_text, (name, i, "page number missing")
            assert page.locator("table.data").count() >= 1 or name in ("letterhead", "recommendation-ludoleaguesa", "discovery-questionnaire"), (name, "no labelled table")

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
    assert 'w:pStyle w:val="Heading1"' in xml, "Heading 1 style missing from Word document"
    assert 'w:pStyle w:val="Heading2"' in xml, "Heading 2 style missing from Word document"
    assert "PAGE" in foot, "live page number missing from Word footer"
    for extra in ("Caveat", "Space Grotesk", "JetBrains Mono", "Archivo"):
        assert extra not in xml + foot, extra + " found in Word document"
doc = Document(docx_path)
assert abs(doc.sections[0].page_width.mm - 210) < 0.1
print("letterhead.docx OK, single Inter typeface, real logo, live page number")

rec_path = KIT / "recommendation-ludoleaguesa.docx"
with zipfile.ZipFile(rec_path) as z:
    assert z.testzip() is None
    assert any(n.startswith("word/media") and n.endswith(".png") for n in z.namelist()), "logo missing from recommendation"
    xml = z.read("word/document.xml").decode()
    foot = z.read("word/footer1.xml").decode()
    assert "LudoLeagueSA" in xml, "recommendation content missing from Word file"
    assert "PAGE" in foot, "live page number missing from recommendation footer"
rec_doc = Document(rec_path)
assert abs(rec_doc.sections[0].page_width.mm - 210) < 0.1
print("recommendation-ludoleaguesa.docx OK, logo, full letter copy and live page number")

q_path = KIT / "discovery-questionnaire.docx"
with zipfile.ZipFile(q_path) as z:
    assert z.testzip() is None
    assert any(n.startswith("word/media") and n.endswith(".png") for n in z.namelist()), "logo missing from questionnaire"
    xml = z.read("word/document.xml").decode()
    foot = z.read("word/footer1.xml").decode()
    assert "happyhunterdigital Discovery Questionnaire" in xml, "questionnaire title missing from Word file"
    assert QUESTIONNAIRE_INTRO in xml, "questionnaire intro missing from Word file"
    for section in QUESTIONNAIRE_SECTIONS:
        assert section.replace("&", "&amp;") in xml, ("Word section missing", section)
    for question in QUESTIONNAIRE_QUESTIONS:
        assert question.replace("&", "&amp;") in xml, ("Word question missing", question)
    assert 'w:pStyle w:val="Heading1"' in xml, "Heading 1 style missing from questionnaire"
    assert xml.count('w:pStyle w:val="Heading2"') == 5, "five Heading 2 sections expected in questionnaire"
    assert "PAGE" in foot and " of 2" in foot, "live two-page number missing from questionnaire footer"
q_doc = Document(q_path)
assert abs(q_doc.sections[0].page_width.mm - 210) < 0.1
print("discovery-questionnaire.docx OK, logo, exact title and all 19 questions, live page number")

print("ALL BRAND KIT CHECKS PASSED")
