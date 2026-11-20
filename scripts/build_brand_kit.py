#!/usr/bin/env python3
"""Build the happyhunterdigital yellow-and-black brand kit.

1. Render the four editable HTML sheets to print-ready PDFs and PNG previews.
2. Regenerate the editable Word letterhead in the same design.

Run: python scripts/build_brand_kit.py
"""

import io
from pathlib import Path

from PIL import Image, ImageDraw
from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Mm, Pt, RGBColor
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
KIT = ROOT / "public" / "brand-kit"
FONTS = KIT / "fonts"
PREVIEWS = KIT / "previews"

INK = "0B0B0F"
YELLOW = "FACC15"
GOLD = "EAB308"
WHITE = "FAFAFA"
GREY = "A1A1AA"
MUTE = "71717A"


def ensure_fonts():
    target = FONTS / "Archivo-Variable.ttf"
    if not target.is_file():
        raise SystemExit("Missing " + str(target) + ". Restore the vendored font before rebuilding.")


def render_sheets():
    PREVIEWS.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel="msedge", headless=True)
        for name in ("letterhead", "flyer", "poster", "business-card"):
            page = browser.new_page(viewport={"width": 1500, "height": 1800}, device_scale_factor=2)
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


# ---------- DOCX helpers ----------
def mark_png(size=1024):
    s = size / 256.0
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((0, 0, 256 * s, 256 * s), radius=int(58 * s), fill="#0B0B0F")
    d.polygon([(94 * s, 168 * s), (78 * s, 198 * s), (122 * s, 168 * s)], fill="#FACC15")
    d.rounded_rectangle((56 * s, 82 * s, 200 * s, 170 * s), radius=int(26 * s), fill="#FACC15")
    d.rounded_rectangle((82 * s, 118 * s, 136 * s, 134 * s), radius=int(8 * s), fill="#0B0B0F")
    d.polygon([(132 * s, 106 * s), (172 * s, 126 * s), (132 * s, 146 * s)], fill="#0B0B0F")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf


def shade(cell, fill):
    tcPr = cell._tc.get_or_add_tcPr()
    el = OxmlElement("w:shd")
    el.set(qn("w:val"), "clear")
    el.set(qn("w:color"), "auto")
    el.set(qn("w:fill"), fill)
    tcPr.append(el)


def cell_border(cell, edge, color, sz):
    tcPr = cell._tc.get_or_add_tcPr()
    borders = tcPr.find(qn("w:tcBorders"))
    if borders is None:
        borders = OxmlElement("w:tcBorders")
        tcPr.append(borders)
    el = OxmlElement("w:" + edge)
    el.set(qn("w:val"), "single")
    el.set(qn("w:sz"), str(sz))
    el.set(qn("w:space"), "0")
    el.set(qn("w:color"), color)
    borders.append(el)


def cell_pad(cell, top=0, bottom=0):
    tcPr = cell._tc.get_or_add_tcPr()
    mar = tcPr.find(qn("w:tcMar"))
    if mar is None:
        mar = OxmlElement("w:tcMar")
        tcPr.append(mar)
    for side, value in (("top", top), ("start", 0), ("bottom", bottom), ("end", 0)):
        node = OxmlElement("w:" + side)
        node.set(qn("w:w"), str(value))
        node.set(qn("w:type"), "dxa")
        mar.append(node)


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


def run(p, text, size, color, bold=False, tracking=None, name="Archivo"):
    r = p.add_run(text)
    r.font.size = Pt(size)
    r.font.bold = bold
    r.font.name = name
    r.font.color.rgb = RGBColor.from_string(color)
    rPr = r._element.get_or_add_rPr()
    fonts = rPr.find(qn("w:rFonts"))
    if fonts is None:
        fonts = OxmlElement("w:rFonts")
        rPr.insert(0, fonts)
    for attr in ("ascii", "hAnsi", "cs"):
        fonts.set(qn("w:" + attr), name)
    if tracking is not None:
        sp = OxmlElement("w:spacing")
        sp.set(qn("w:val"), str(int(round(tracking * 20))))
        rPr.append(sp)
    return r


def build_docx():
    mark = mark_png()
    doc = Document()
    sec = doc.sections[0]
    sec.page_width, sec.page_height = Mm(210), Mm(297)
    sec.top_margin, sec.bottom_margin = Mm(44), Mm(20)
    sec.left_margin, sec.right_margin = Mm(20), Mm(20)
    sec.header_distance, sec.footer_distance = Mm(6), Mm(7)

    normal = doc.styles["Normal"]
    normal.font.name = "Archivo"
    normal.font.size = Pt(10.5)
    normal.font.color.rgb = RGBColor.from_string(INK)

    # yellow masthead
    header = sec.header
    t = header.add_table(rows=1, cols=2, width=Mm(170))
    t.autofit = False
    left, right = t.rows[0].cells
    left.width, right.width = Mm(96), Mm(74)
    for c in (left, right):
        shade(c, YELLOW)
        cell_pad(c, top=170, bottom=150)
    lp = left.paragraphs[0]
    r = lp.add_run()
    r.add_picture(mark, width=Mm(11))
    run(lp, "  happyhunterdigital", 19, INK, bold=True, tracking=-0.9)
    ld = left.add_paragraph()
    ld.paragraph_format.space_before = Pt(2)
    run(ld, "SMART MARKETING  /  AI-FIRST DIGITAL ENGINEERING", 7, INK, bold=True, tracking=1.6)
    rp = right.paragraphs[0]
    rp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run(rp, "motsumitl@happyhunterdigital.com", 8.5, INK, bold=True)
    rp.add_run().add_break()
    run(rp, "+27 (0) 60 101 6673", 8.5, INK, bold=True)
    rp.add_run().add_break()
    run(rp, "happyhunterdigital.com", 8.5, INK)
    rt = right.add_paragraph()
    rt.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run(rt, "CORRESPONDENCE  /  PRETORIA ZA", 7, INK, bold=True, tracking=1.4)

    strip = header.add_paragraph()
    strip.paragraph_format.space_before = Pt(4)
    para_border(strip, "bottom", INK, 18)

    # body
    date = doc.add_paragraph()
    date.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run(date, "19 NOVEMBER 2026", 8, MUTE, bold=True, tracking=1)
    rec = doc.add_paragraph()
    rec.paragraph_format.space_before = Pt(30)
    run(rec, "The Management", 9.5, INK, bold=True)
    rec.add_run().add_break()
    run(rec, "Pretoria, South Africa", 9.5, INK)
    subj = doc.add_paragraph()
    subj.paragraph_format.space_before = Pt(30)
    subj.paragraph_format.space_after = Pt(4)
    run(subj, "A COMPLETE SYSTEM FOR BEING FOUND, ASKED AND CHOSEN", 19, INK, bold=True, tracking=-0.7)
    bar = doc.add_paragraph()
    bar.paragraph_format.right_indent = Mm(148)
    bar.paragraph_format.space_after = Pt(16)
    para_border(bar, "bottom", GOLD, 20)
    sal = doc.add_paragraph()
    sal.paragraph_format.space_after = Pt(10)
    run(sal, "Dear Sir or Madam,", 10, INK, bold=True)

    copy = [
        "Most agencies optimise one channel. We engineer the whole path from search to conversation to appointment.",
        "It starts with a free online health check across your website, Google, Facebook, directories and reviews. We correct what is missing or inconsistent, add structured schema so Google and AI assistants understand the business, and publish service pages, articles and FAQs that ChatGPT, Gemini and Perplexity can read and cite.",
        "Then we connect AI-ready websites, smart chatbots and automated workflows across WhatsApp, email, SMS and direct messages that qualify leads and book appointments. The result is not more activity. It is a business that is discoverable on Google, recommended by AI and reachable on WhatsApp.",
    ]
    for text in copy:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(10)
        p.paragraph_format.line_spacing = 1.6
        run(p, text, 10.5, INK)

    sign = doc.add_paragraph()
    sign.paragraph_format.space_before = Pt(22)
    run(sign, "Kind regards,", 10, INK)
    sign.add_run().add_break()
    sign.add_run().add_break()
    run(sign, "Thabo Leslie Motsumi", 10, INK, bold=True)
    sign.add_run().add_break()
    run(sign, "GROWTH STRATEGIST AND FOUNDER", 8.5, MUTE, bold=True, tracking=1.2)

    # black footer
    foot = sec.footer
    fp = foot.paragraphs[0]
    para_border(fp, "top", YELLOW, 12)
    fp.paragraph_format.tab_stops.add_tab_stop(Mm(170), WD_TAB_ALIGNMENT.RIGHT)
    run(fp, "574 Fred Messenger Avenue, Andeon  /  Pretoria West, Pretoria, South Africa", 7.5, INK)
    fp.add_run("\t")
    run(fp, "motsumitl@happyhunterdigital.com", 7.5, INK, bold=True)
    fp2 = foot.add_paragraph()
    fp2.paragraph_format.tab_stops.add_tab_stop(Mm(170), WD_TAB_ALIGNMENT.RIGHT)
    run(fp2, "happyhunterdigital.com", 9, INK, bold=True)
    fp2.add_run("\t")
    run(fp2, "+27 (0) 60 101 6673  /  PRETORIA, SOUTH AFRICA", 7.5, MUTE, tracking=0.6)

    doc.core_properties.title = "happyhunterdigital letterhead"
    doc.core_properties.author = "happyhunterdigital"
    path = KIT / "letterhead.docx"
    doc.save(path)
    print("wrote", path.name, path.stat().st_size, "bytes")


if __name__ == "__main__":
    ensure_fonts()
    render_sheets()
    build_docx()
