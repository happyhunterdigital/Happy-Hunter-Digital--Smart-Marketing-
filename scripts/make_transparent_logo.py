#!/usr/bin/env python3
"""Key the supplied dark-backed logo JPG to a transparent PNG for print use."""
from pathlib import Path

from PIL import Image

ASSETS = Path(__file__).resolve().parent.parent / "public" / "brand-kit" / "assets"
src = Image.open(ASSETS / "logo-new.jpg").convert("RGB")
px = src.load()
w, h = src.size

# The supplied artwork is gold on near-black. Key on channel maximum so the
# darker gold shading in the mark survives while the black field disappears.
out = Image.new("RGBA", (w, h))
op = out.load()
for y in range(h):
    for x in range(w):
        r, g, b = px[x, y]
        v = max(r, g, b)
        if v <= 22:
            a = 0.0
        elif v >= 70:
            a = 1.0
        else:
            t = (v - 22) / 48.0
            a = t * t * (3 - 2 * t)
        if a <= 0.01:
            op[x, y] = (0, 0, 0, 0)
        else:
            op[x, y] = (
                min(255, int(r / a)),
                min(255, int(g / a)),
                min(255, int(b / a)),
                int(255 * a),
            )

bbox = out.getchannel("A").point(lambda v: 255 if v > 12 else 0).getbbox()
pad = 24
bbox = (max(0, bbox[0] - pad), max(0, bbox[1] - pad),
        min(w, bbox[2] + pad), min(h, bbox[3] + pad))
out = out.crop(bbox)
out.thumbnail((1000, 1000), Image.LANCZOS)
dest = ASSETS / "logo.png"
out.save(dest, optimize=True)
print("transparent logo", out.size, dest.stat().st_size, "bytes")
