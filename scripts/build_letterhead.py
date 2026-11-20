#!/usr/bin/env python3
"""Build the editable Word letterhead from the brand tokens in the design system.

Run: python scripts/build_letterhead.py
Output: public/letterhead/happyhunterdigital-letterhead.docx

No external assets are downloaded. The mark is drawn from the geometry in
assets/brand/design-system.md so it stays vector-clean at print resolution.
"""

import io
import os

from PIL import Image, ImageDraw
from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Mm, Pt, RGBColor

INK = "0B0B0F"
INK_SOFT = "27272A"
WHITE = "FAFAFA"
GREY = "A1A1AA"
MUTED = "71717A"
AMBER = "EAB308"

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public", "letterhead")
OUT = os.path.join(OUT_DIR, "happyhunterdigital-letterhead.docx")


def logo_png(size=1024):
    """Draw the mark from the 256 viewBox in the design system."""
    s = size / 256.0
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    tile = (0, 0, int(256 * s), int(256 * s))
    d.rounded_rectangle(tile, radius=int(58 * s), fill="#EAB308")
    d.polygon([(94 * s, 168 * s), (78 * s, 198 * s), (122 * s, 168 * s)], fill="#0B0B0F")
    d.rounded_rectangle(
        (56 * s, 82 * s, 200 * s, 170 * s), radius=int(26 * s), fill="#0B0B0F"
    )
    d.rounded_rectangle(
        (82 * s, 118 * s, 136 * s, 134 * s), radius=int(8 * s), fill="#EAB308"
    )
    d.polygon([(132 * s, 106 * s), (172 * s, 126 * s), (132 * s, 146 * s)], fill="#EAB308")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf


def set_cell_shading(cell, fill):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), fill)
    tcPr.append(shd)


def set_cell_border(cell, edge, color, sz):
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


def set_cell_margins(cell, top=0, start=0, bottom=0, end=0):
    tcPr = cell._tc.get_or_add_tcPr()
    mar = tcPr.find(qn("w:tcMar"))
    if mar is None:
        mar = OxmlElement("w:tcMar")
        tcPr.append(mar)
    for side, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = OxmlElement("w:" + side)
        node.set(qn("w:w"), str(value))
        node.set(qn("w:type"), "dxa")
        mar.append(node)


def set_paragraph_border(paragraph, edge, color, sz, space=0):
    pPr = paragraph._p.get_or_add_pPr()
    borders = pPr.find(qn("w:pBdr"))
    if borders is None:
        borders = OxmlElement("w:pBdr")
        pPr.append(borders)
    el = OxmlElement("w:" + edge)
    el.set(qn("w:val"), "single")
    el.set(qn("w:sz"), str(sz))
    el.set(qn("w:space"), str(space))
    el.set(qn("w:color"), color)
    borders.append(el)


def style_run(run, size, color, bold=False, name="Archivo", italic=False, tracking=None):
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = RGBColor.from_string(color)
    run.font.name = name
    rPr = run._element.get_or_add_rPr()
    rFonts = rPr.find(qn("w:rFonts"))
    if rFonts is None:
        rFonts = OxmlElement("w:rFonts")
        rPr.insert(0, rFonts)
    for attr in ("ascii", "hAnsi", "cs"):
        rFonts.set(qn("w:" + attr), name)
    if tracking is not None:
        sp = OxmlElement("w:spacing")
        sp.set(qn("w:val"), str(int(round(tracking * 20))))
        rPr.append(sp)
    return run


def add_line(paragraph, text, size, color, bold=False, name="Archivo", tracking=None):
    return style_run(paragraph.add_run(text), size, color, bold=bold, name=name, tracking=tracking)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    mark = logo_png()

    doc = Document()
    sec = doc.sections[0]
    sec.page_width = Mm(210)
    sec.page_height = Mm(297)
    sec.top_margin = Mm(44)
    sec.bottom_margin = Mm(20)
    sec.left_margin = Mm(20)
    sec.right_margin = Mm(20)
    sec.header_distance = Mm(6)
    sec.footer_distance = Mm(7)

    normal = doc.styles["Normal"]
    normal.font.name = "Archivo"
    normal.font.size = Pt(10.5)
    normal.font.color.rgb = RGBColor.from_string(INK_SOFT)
    normal.paragraph_format.space_after = Pt(0)

    # ----- header band -----
    header = sec.header
    htable = header.add_table(rows=1, cols=2, width=Mm(170))
    htable.autofit = False
    htable.alignment = WD_TABLE_ALIGNMENT.LEFT
    left, right = htable.rows[0].cells
    left.width = Mm(96)
    right.width = Mm(74)
    for cell in (left, right):
        set_cell_shading(cell, INK)
        set_cell_margins(cell, top=170, start=0, bottom=140, end=0)
        set_cell_border(cell, "bottom", AMBER, 24)

    lp = left.paragraphs[0]
    lp.paragraph_format.space_after = Pt(0)
    lr = lp.add_run()
    lr.add_picture(mark, width=Mm(11))
    add_line(lp, "  ", 8, WHITE)
    add_line(lp, "happy", 19, WHITE, bold=True, tracking=-0.6)
    add_line(lp, "hunter", 19, AMBER, bold=True, tracking=-0.6)
    add_line(lp, "digital", 19, GREY, bold=True, tracking=-0.6)

    ld = left.add_paragraph()
    ld.paragraph_format.space_before = Pt(2)
    ld.paragraph_format.space_after = Pt(0)
    add_line(ld, "SMART MARKETING  /  AI-FIRST DIGITAL ENGINEERING", 7, AMBER, bold=True, tracking=1.7)

    rp = right.paragraphs[0]
    rp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    rp.paragraph_format.space_after = Pt(0)
    add_line(rp, "motsumitl@happyhunterdigital.com", 8, GREY)
    rp.add_run().add_break()
    add_line(rp, "+27 (0) 60 101 6673", 8, WHITE, bold=True)
    rp.add_run().add_break()
    add_line(rp, "happyhunterdigital.com", 8, GREY)

    rt = right.add_paragraph()
    rt.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    rt.paragraph_format.space_before = Pt(2)
    add_line(rt, "CORRESPONDENCE", 7, AMBER, bold=True, tracking=1.7)

    # ----- body -----
    date = doc.add_paragraph()
    date.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    add_line(date, "19 November 2026", 8.5, MUTED, tracking=0.8)

    rec = doc.add_paragraph()
    rec.paragraph_format.space_before = Pt(30)
    rec.paragraph_format.space_after = Pt(0)
    add_line(rec, "The Management", 9.5, INK, bold=True)
    rec.add_run().add_break()
    add_line(rec, "Pretoria, South Africa", 9.5, INK_SOFT)

    subj = doc.add_paragraph()
    subj.paragraph_format.space_before = Pt(30)
    subj.paragraph_format.space_after = Pt(4)
    add_line(subj, "A NOTE ON BEING THE ANSWER", 20, INK, bold=True, tracking=-0.6)

    rule = doc.add_paragraph()
    rule.paragraph_format.right_indent = Mm(148)
    rule.paragraph_format.space_after = Pt(16)
    set_paragraph_border(rule, "bottom", AMBER, 18)

    salutation = doc.add_paragraph()
    salutation.paragraph_format.space_after = Pt(10)
    add_line(salutation, "Dear Sir or Madam,", 10, INK, bold=True)

    paragraphs = [
        "Search has changed. A customer in Pretoria no longer works through a list of links. They ask a question, and Google or an AI assistant gives them one answer. If your business is not in that answer, the customer never sees you.",
        "We build the conditions for that answer. Correct business information, consistent across your website, your Google listing, your reviews and the places AI reads. The work is unglamorous and it compounds.",
        "This letterhead is one small part of that same idea: clear information, presented with care, so the next step is obvious. Replace this text with your letter, then save the document as a PDF.",
    ]
    for text in paragraphs:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(10)
        p.paragraph_format.line_spacing = 1.55
        add_line(p, text, 10.5, INK_SOFT, name="Gelasio")

    sign = doc.add_paragraph()
    sign.paragraph_format.space_before = Pt(22)
    add_line(sign, "Kind regards,", 10, INK_SOFT)
    sign.add_run().add_break()
    sign.add_run().add_break()
    add_line(sign, "Thabo Leslie Motsumi", 10, INK, bold=True)
    sign.add_run().add_break()
    add_line(sign, "GROWTH STRATEGIST AND FOUNDER", 8.5, MUTED, bold=True, tracking=1.2)

    # ----- footer -----
    footer = sec.footer
    fp = footer.paragraphs[0]
    set_paragraph_border(fp, "top", INK, 6)
    fp.paragraph_format.tab_stops.add_tab_stop(Mm(170), WD_TAB_ALIGNMENT.RIGHT)
    add_line(fp, "574 Fred Messenger Avenue, Andeon  /  Pretoria West, Pretoria, South Africa", 7.5, INK_SOFT)
    fp.add_run("\t")
    add_line(fp, "motsumitl@happyhunterdigital.com", 7.5, INK_SOFT)

    fp2 = footer.add_paragraph()
    fp2.paragraph_format.tab_stops.add_tab_stop(Mm(170), WD_TAB_ALIGNMENT.RIGHT)
    add_line(fp2, "happyhunterdigital.com", 7.5, INK, bold=True)
    fp2.add_run("\t")
    add_line(fp2, "+27 (0) 60 101 6673  /  PRETORIA, SOUTH AFRICA", 7.5, MUTED, tracking=0.6)

    doc.core_properties.title = "happyhunterdigital letterhead"
    doc.core_properties.subject = "Editable letterhead, Smart Marketing"
    doc.core_properties.author = "happyhunterdigital"
    doc.core_properties.keywords = "happyhunterdigital, letterhead, Pretoria, Smart Marketing"

    doc.save(OUT)
    print("wrote", OUT, os.path.getsize(OUT), "bytes")


if __name__ == "__main__":
    main()
