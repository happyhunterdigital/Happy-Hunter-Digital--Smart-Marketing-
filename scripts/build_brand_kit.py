#!/usr/bin/env python3
"""Build the happyhunterdigital professional document kit.

Renders the four editable HTML sheets to print-ready PDFs and HD previews,
then rebuilds the Word letterhead in the same clean design.

Run: python scripts/build_brand_kit.py
"""
from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Mm, Pt, RGBColor
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
KIT = ROOT / "public" / "brand-kit"
FONTS = KIT / "fonts"
PREVIEWS = KIT / "previews"

INK = "111114"
MUTE = "5B5B63"
FAINT = "8A8A93"
YELLOW = "FACC15"
AMBER = "EAB308"
LINE = "DCDCE1"


def ensure_assets():
    if not (FONTS / "Inter.ttf").is_file():
        raise SystemExit("Missing fonts/Inter.ttf")
    for name in ("logo.png", "logo-new.jpg"):
        if not (KIT / "assets" / name).is_file():
            raise SystemExit("Missing assets/" + name + ". Run make_transparent_logo.py first.")


def render_sheets():
    PREVIEWS.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel="msedge", headless=True)
        for name in ("letterhead", "flyer", "poster", "business-card"):
            page = browser.new_page(viewport={"width": 1500, "height": 1800}, device_scale_factor=3)
            page.goto((KIT / (name + ".html")).as_uri(), wait_until="networkidle")
            page.evaluate("document.fonts.ready")
            pdf = page.pdf(print_background=True, prefer_css_page_size=True)
            (KIT / (name + ".pdf")).write_bytes(pdf)
            sheets = page.locator(".sheet").all()
            for i, sheet in enumerate(sheets, start=1):
                suffix = "" if len(sheets) == 1 else "-" + ("front" if i == 1 else "back")
                sheet.screenshot(path=str(PREVIEWS / (name + suffix + ".png")))
            print("rendered", name, len(sheets), "sheet(s),", len(pdf), "PDF bytes")
            page.close()
        browser.close()


# ---------- Word helpers ----------
def para_border(p, edge, color, sz):
    pPr = p._p.get_or_add_pPr()
    borders = pPr.find(qn("w:pBdr"))
    if borders is None:
        borders = OxmlElement("w:pBdr")
        pPr.append(borders)
    el = OxmlElement("w:" + edge)
    el.set(qn("w:val"), "single")
    el.set(qn("w:sz"), str(sz))
    el.set(qn("w:space"), "0")
    el.set(qn("w:color"), color)
    borders.append(el)


def run(p, text, size, color, bold=False, tracking=None):
    r = p.add_run(text)
    r.font.size = Pt(size)
    r.font.bold = bold
    r.font.name = "Inter"
    r.font.color.rgb = RGBColor.from_string(color)
    rPr = r._element.get_or_add_rPr()
    fonts = OxmlElement("w:rFonts")
    for attr in ("ascii", "hAnsi", "cs"):
        fonts.set(qn("w:" + attr), "Inter")
    rPr.insert(0, fonts)
    if tracking is not None:
        sp = OxmlElement("w:spacing")
        sp.set(qn("w:val"), str(int(round(tracking * 20))))
        rPr.append(sp)
    return r


def add_page_number(p):
    r = p.add_run()
    begin = OxmlElement("w:fldChar")
    begin.set(qn("w:fldCharType"), "begin")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = " PAGE "
    sep = OxmlElement("w:fldChar")
    sep.set(qn("w:fldCharType"), "separate")
    text = OxmlElement("w:t")
    text.text = "1"
    end = OxmlElement("w:fldChar")
    end.set(qn("w:fldCharType"), "end")
    for node in (begin, instr, sep, text, end):
        r._r.append(node)
    r.font.size = Pt(8)
    r.font.name = "Inter"
    r.font.color.rgb = RGBColor.from_string(MUTE)


def build_docx():
    doc = Document()
    sec = doc.sections[0]
    sec.page_width, sec.page_height = Mm(210), Mm(297)
    sec.top_margin, sec.bottom_margin = Mm(26), Mm(20)
    sec.left_margin, sec.right_margin = Mm(22), Mm(22)
    sec.header_distance, sec.footer_distance = Mm(8), Mm(8)

    normal = doc.styles["Normal"]
    normal.font.name = "Inter"
    normal.font.size = Pt(10.5)
    normal.font.color.rgb = RGBColor.from_string(INK)

    h1 = doc.styles["Heading 1"]
    h1.font.name = "Inter"
    h1.font.size = Pt(18)
    h1.font.bold = True
    h1.font.color.rgb = RGBColor.from_string(INK)
    h1.paragraph_format.space_before = Pt(20)
    h1.paragraph_format.space_after = Pt(6)

    h2 = doc.styles["Heading 2"]
    h2.font.name = "Inter"
    h2.font.size = Pt(11.5)
    h2.font.bold = True
    h2.font.color.rgb = RGBColor.from_string(INK)
    h2.paragraph_format.space_before = Pt(12)
    h2.paragraph_format.space_after = Pt(6)

    # header: logo, wordmark, contact, thin yellow rule
    header = sec.header
    t = header.add_table(rows=1, cols=2, width=Mm(166))
    t.autofit = False
    left, right = t.rows[0].cells
    left.width, right.width = Mm(100), Mm(66)
    lp = left.paragraphs[0]
    lp.add_run().add_picture(str(KIT / "assets" / "logo.png"), width=Mm(14))
    run(lp, "  happyhunterdigital", 12.5, INK, bold=True, tracking=-0.4)
    ld = left.add_paragraph()
    ld.paragraph_format.space_before = Pt(2)
    run(ld, "WEB DEVELOPMENT AND AI-FIRST DIGITAL MARKETING", 7, MUTE, tracking=0.8)
    rp = right.paragraphs[0]
    rp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run(rp, "motsumitl@happyhunterdigital.com", 8.3, INK, bold=True)
    rp.add_run().add_break()
    run(rp, "+27 (0) 60 101 6673", 8.3, INK)
    rp.add_run().add_break()
    run(rp, "happyhunterdigital.com", 8.3, MUTE)
    rule = header.add_paragraph()
    rule.paragraph_format.space_before = Pt(6)
    para_border(rule, "bottom", YELLOW, 18)

    # meta line
    meta = doc.add_paragraph()
    meta.paragraph_format.tab_stops.add_tab_stop(Mm(166), WD_TAB_ALIGNMENT.RIGHT)
    run(meta, "19 NOVEMBER 2026", 8, MUTE, tracking=0.6)
    meta.add_run("\t")
    run(meta, "REF: HHD / 2026 / 019", 8, MUTE, tracking=0.6)

    rec = doc.add_paragraph()
    rec.paragraph_format.space_before = Pt(20)
    run(rec, "The Management", 10, INK, bold=True)
    rec.add_run().add_break()
    run(rec, "Pretoria, South Africa", 10, INK)

    subj = doc.add_paragraph(style="Heading 1")
    run(subj, "A complete system for being found, asked and chosen", 18, INK, bold=True, tracking=-0.5)
    bar = doc.add_paragraph()
    bar.paragraph_format.right_indent = Mm(140)
    bar.paragraph_format.space_after = Pt(14)
    para_border(bar, "bottom", YELLOW, 18)

    sal = doc.add_paragraph()
    sal.paragraph_format.space_after = Pt(8)
    run(sal, "Dear Sir or Madam,", 10.5, INK, bold=True)

    for text in (
        "Most agencies optimise one channel. We engineer the whole path, from search to conversation to appointment.",
        "It begins with a free online health check across your website, Google, Facebook, directories and reviews. We correct what is missing, standardise your business details and add structured schema so search engines and AI assistants understand the business.",
        "We then build the website, publish content that can be cited, and connect automated workflows that qualify leads and book appointments. Not just AI visibility.",
    ):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(8)
        p.paragraph_format.line_spacing = 1.5
        run(p, text, 10.5, INK)

    h2p = doc.add_paragraph(style="Heading 2")
    run(h2p, "Our system", 11.5, INK, bold=True)

    steps = (
        ("01", "Free online health check.", "Website, Google, Facebook, directories and reviews."),
        ("02", "Foundation and entity SEO.", "One consistent business record, backed by structured schema."),
        ("03", "Web development and engineering.", "Fast, mobile-friendly sites built to be understood."),
        ("04", "AI-ready content creation (AEO).", "Service pages, articles and FAQs written to be cited."),
        ("05", "Sales and WhatsApp automation.", "Chatbots and workflows that qualify leads and book appointments."),
    )
    for num, head, body in steps:
        p = doc.add_paragraph()
        p.paragraph_format.left_indent = Mm(10)
        p.paragraph_format.first_line_indent = Mm(-10)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.line_spacing = 1.4
        run(p, num + "  ", 9.5, AMBER, bold=True)
        run(p, head + " ", 10, INK, bold=True)
        run(p, body, 10, INK)

    sign = doc.add_paragraph()
    sign.paragraph_format.space_before = Pt(18)
    run(sign, "Kind regards,", 10.5, INK)
    sign.add_run().add_break()
    sign.add_run().add_break()
    run(sign, "Thabo Leslie Motsumi", 10.5, INK, bold=True)
    sign.add_run().add_break()
    run(sign, "GROWTH STRATEGIST AND FOUNDER", 8, MUTE, tracking=0.8)

    # footer: address, contact, live page number
    foot = sec.footer
    fp = foot.paragraphs[0]
    para_border(fp, "top", LINE, 6)
    fp.paragraph_format.tab_stops.add_tab_stop(Mm(166), WD_TAB_ALIGNMENT.RIGHT)
    run(fp, "574 Fred Messenger Avenue, Andeon  /  Pretoria West, Pretoria, South Africa", 8, MUTE)
    fp.add_run("\t")
    run(fp, "motsumitl@happyhunterdigital.com", 8, MUTE)
    fp2 = foot.add_paragraph()
    fp2.paragraph_format.tab_stops.add_tab_stop(Mm(166), WD_TAB_ALIGNMENT.RIGHT)
    run(fp2, "happyhunterdigital.com", 8, INK, bold=True)
    fp2.add_run("\t")
    run(fp2, "Page ", 8, MUTE)
    add_page_number(fp2)
    run(fp2, " of 1", 8, MUTE)

    doc.core_properties.title = "happyhunterdigital letterhead"
    doc.core_properties.author = "happyhunterdigital"
    path = KIT / "letterhead.docx"
    doc.save(path)
    print("wrote", path.name, path.stat().st_size, "bytes")


if __name__ == "__main__":
    ensure_assets()
    render_sheets()
    build_docx()
