#!/usr/bin/env python3
"""Check that every local src/href/srcset target in the site's HTML exists, and total the homepage bytes.

Usage: python3 tools/check-links.py
"""
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parent.parent
SKIP = {"elo", "tools", ".git", "node_modules"}
SKIP_FILES = {"googlee207b5895d6eb38a.html"}


class Refs(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []
        self.imgs = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        for k in ("src", "href", "poster"):
            if k in a and tag != "meta":
                self.refs.append(a[k])
        if "srcset" in a:
            cands = [c.strip().split() for c in a["srcset"].split(",") if c.strip()]
            for c in cands:
                self.refs.append(c[0])
        if tag == "img":
            self.imgs.append(a)


def local(ref):
    if not ref or ref.startswith(("#", "mailto:", "data:", "javascript:")):
        return None
    u = urlparse(ref)
    if u.scheme or u.netloc:
        return None
    return unquote(u.path)


def pages():
    for f in sorted(ROOT.rglob("*.html")):
        rel = f.relative_to(ROOT)
        if rel.parts[0] in SKIP or f.name in SKIP_FILES:
            continue
        yield f


def parse(f):
    p = Refs()
    p.feed(f.read_text(encoding="utf-8"))
    return p


def css_urls(f):
    return [m for m in re.findall(r"url\(\s*['\"]?([^'\")]+)['\"]?\s*\)", f.read_text())]


def resolve(base, ref):
    path = local(ref)
    if path is None:
        return None
    target = ROOT / path.lstrip("/") if path.startswith("/") else (base.parent / path)
    return target.resolve()


def main():
    missing = 0
    checked = 0
    queue = []
    for f in pages():
        p = parse(f)
        for r in p.refs:
            t = resolve(f, r)
            if t is None:
                continue
            checked += 1
            if t.is_dir():
                t = t / "index.html"
            if not t.exists():
                missing += 1
                print(f"MISSING  {f.relative_to(ROOT)} -> {r}")
            elif t.suffix == ".css":
                queue.append(t)
    for c in sorted(set(queue)):
        for r in css_urls(c):
            t = resolve(c, r)
            if t is None:
                continue
            checked += 1
            if not t.exists():
                missing += 1
                print(f"MISSING  {c.relative_to(ROOT)} -> {r}")
    print(f"{checked} local references checked, {missing} missing")

    home = parse(ROOT / "index.html")
    total = (ROOT / "index.html").stat().st_size
    files = []
    for r in home.refs:
        t = resolve(ROOT / "index.html", r)
        if t and t.suffix in (".css", ".js", ".woff2") and t not in files:
            files.append(t)
    for c in [f for f in files if f.suffix == ".css"]:
        for r in css_urls(c):
            t = resolve(c, r)
            if t and t not in files:
                files.append(t)
    base = total + sum(f.stat().st_size for f in files)
    print(f"homepage html+css+js+fonts+paper: {base} bytes")
    for label, vw, dpr in (("desktop 1280 @1x", 1280, 1), ("phone 390 @1x", 390, 1), ("phone 390 @3x", 390, 3)):
        imgs = 0
        for a in home.imgs:
            css_w = slot(a, vw)
            need = css_w * dpr
            cands = [c.strip().split() for c in a.get("srcset", "").split(",") if c.strip()]
            pick = a["src"]
            if cands:
                cands = sorted(((int(c[1][:-1]), c[0]) for c in cands))
                pick = next((u for w, u in cands if w >= need), cands[-1][1])
            imgs += (ROOT / pick).stat().st_size
        print(f"{label}: images {imgs} bytes, total {base + imgs} bytes ({(base + imgs) / 1024:.0f} KB)")
    return 1 if missing else 0


def slot(a, vw):
    """CSS width the browser lays an img out at: the sizes attribute's chosen length, evaluated at this viewport."""
    sizes = a.get("sizes", "")
    for part in [s.strip() for s in sizes.split(",")]:
        m = re.match(r"(?:\(max-width:\s*(\d+)px\)\s+)?(\d+)(px|vw)$", part)
        if not m:
            continue
        if m.group(1) and vw > int(m.group(1)):
            continue
        n = int(m.group(2))
        return n if m.group(3) == "px" else vw * n / 100
    return vw


if __name__ == "__main__":
    sys.exit(main())
