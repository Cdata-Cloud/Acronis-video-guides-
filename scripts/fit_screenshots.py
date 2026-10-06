#!/usr/bin/env python3
"""Fit screenshots of any size onto 1920x1080 frames for the video.

Scales each image to fit, centers it on the brand background, and keeps the top
(step badge) and bottom (caption bar) clear. Also writes a *-grid.png copy with
percent gridlines for measuring highlight positions.

Usage: python fit_screenshots.py OUT_DIR IMG [IMG ...] [--bg #0E1726] [--no-grid]
"""
import os, sys
from PIL import Image, ImageDraw

W, H, TOP, BOTTOM, SIDE = 1920, 1080, 110, 190, 80
args = sys.argv[1:]
bg = args[args.index("--bg") + 1] if "--bg" in args else "#0E1726"
grid = "--no-grid" not in args
files = [a for a in args if not a.startswith("--") and a != bg]
out, imgs = files[0], files[1:]
os.makedirs(out, exist_ok=True)
for path in imgs:
    im = Image.open(path).convert("RGB")
    s = min((W - 2 * SIDE) / im.width, (H - TOP - BOTTOM) / im.height)
    im2 = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    c = Image.new("RGB", (W, H), bg)
    c.paste(im2, ((W - im2.width) // 2, TOP + (H - TOP - BOTTOM - im2.height) // 2))
    name = os.path.splitext(os.path.basename(path))[0]
    c.save(os.path.join(out, name + ".png"))
    note = " (upscaled, may look soft; a larger screenshot is better)" if s > 1.3 else ""
    print(f"{name}.png  scale {s:.2f}{note}")
    if grid:
        d = ImageDraw.Draw(c)
        for p in range(0, 101, 5):
            col = (255, 0, 0) if p % 10 == 0 else (255, 160, 160)
            d.line([(p * W / 100, 0), (p * W / 100, H)], fill=col)
            d.line([(0, p * H / 100), (W, p * H / 100)], fill=col)
            if p % 10 == 0:
                d.text((p * W / 100 + 3, 3), str(p), fill="yellow")
                d.text((3, p * H / 100 + 3), str(p), fill="yellow")
        c.save(os.path.join(out, name + "-grid.png"))
