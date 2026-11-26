#!/usr/bin/env python3
"""Rebuild img/*.webp from the sources listed in tools/images.txt.

Widths are never upscaled past the source; "-" keeps the source size.
Writes img/sizes.json (name -> {width: [w, h]}) so pages can carry exact width/height.
"""
import json
import pathlib

from PIL import Image, ImageOps

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "img"
QUALITY = 72


def rows():
    for line in (ROOT / "tools/images.txt").read_text().splitlines():
        if line.strip() and not line.startswith("#"):
            src, name, widths = line.split()
            yield ROOT / src, name, widths


def main():
    OUT.mkdir(exist_ok=True)
    sizes = {}
    for src, name, widths in rows():
        im = ImageOps.exif_transpose(Image.open(src))
        im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
        targets = [im.width] if widths == "-" else [min(int(w), im.width) for w in widths.split(",")]
        for w in targets:
            h = round(im.height * w / im.width)
            path = OUT / (f"{name}.webp" if widths == "-" else f"{name}-{w}.webp")
            im.resize((w, h), Image.LANCZOS).save(path, "WEBP", quality=QUALITY, method=6)
            sizes.setdefault(name, {})[w] = [w, h]
    (OUT / "sizes.json").write_text(json.dumps(sizes, indent=1))
    total = sum(p.stat().st_size for p in OUT.glob("*.webp"))
    print(f"{len(list(OUT.glob('*.webp')))} files, {total / 1024:.0f} KB total")


if __name__ == "__main__":
    main()
