#!/usr/bin/env python3
"""Grade the brand photography for the stationery kit.

Produces compressed, cinematic JPGs with a warm amber shadow lift and a
soft vignette. The HTML adds gradients and blend modes on top of these.
"""
from pathlib import Path

from PIL import Image, ImageEnhance

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "brand-kit" / "assets" / "photos"
OUT = SRC / "graded"
OUT.mkdir(parents=True, exist_ok=True)


def grade(path):
    im = Image.open(path).convert("RGB")
    im.thumbnail((1800, 1800), Image.LANCZOS)
    im = ImageEnhance.Color(im).enhance(0.82)
    im = ImageEnhance.Contrast(im).enhance(1.16)
    im = ImageEnhance.Brightness(im).enhance(0.84)

    r, g, b = im.split()
    r = r.point(lambda v: min(255, int(v * 1.06 + 4)))
    g = g.point(lambda v: min(255, int(v * 1.00 + 1)))
    b = b.point(lambda v: int(v * 0.86))
    im = Image.merge("RGB", (r, g, b))

    # soft vignette
    w, h = im.size
    mask = Image.new("L", (w, h), 0)
    px = mask.load()
    cx, cy = w / 2, h / 2
    maxd = (cx * cx + cy * cy) ** 0.5
    for y in range(h):
        for x in range(w):
            d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5 / maxd
            px[x, y] = int(255 * max(0.25, 1 - 0.75 * d ** 2))
    dark = Image.new("RGB", (w, h), (11, 11, 15))
    im = Image.composite(im, dark, mask)

    dest = OUT / path.name
    im.save(dest, "JPEG", quality=84, optimize=True, progressive=True)
    print(dest.name, im.size, dest.stat().st_size)


for src in sorted(SRC.glob("*.jpg")):
    grade(src)
