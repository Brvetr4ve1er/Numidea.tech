#!/usr/bin/env python3
"""Cuts the dock cast's three sprite strips (assets/cast/*.webp) from the bible's rig frames.

Run from the repo root: python3 scripts/cast-art.py   (Pillow only). The frame order is the
order cast.js reads (Y, KF, KR there): change both together. Every frame of a strip is one cell
of the same size, so a frame is one background-position away, with no load and no flash.
"""
from PIL import Image

ART = 'hub/bible/art/'
Y = ['base', 'blink', 'talk-a', 'talk-b', 'glance', 'glance-r', 'smirk', 'laugh', 'yawn', 'half', 'up', 'sip', 'glasses']
KF = ['base', 'blink', 'ear', 'left', 'right', 'wide', 'yawn']
KR = ['judge', 'loaf', 'smug', 'stamp', 'peek', 'shook', 'hiss', 'love', 'leave', 'mug']


def strip(frames, cell, out, q=84):
    s = Image.new('RGBA', (cell[0] * len(frames), cell[1]), (0, 0, 0, 0))
    for i, im in enumerate(frames):
        s.alpha_composite(im, (i * cell[0], 0))
    s.save(out, 'WEBP', quality=q, method=6)
    print(out, s.size)


# Yasser: head and shoulders of the 501x565 rig, 2x the 84x80 the dock draws
ys = [Image.open(f'{ART}rig-y-{n}.webp').convert('RGBA').crop((100, 0, 400, 286)).resize((168, 160), Image.LANCZOS) for n in Y]
strip(ys, (168, 160), 'assets/cast/yasser.webp')
# Kūro's face rig, 360x294 -> 2x the 60x49 the dock draws
ks = [Image.open(f'{ART}rig-k-{n}.webp').convert('RGBA').resize((120, 98), Image.LANCZOS) for n in KF]
strip(ks, (120, 98), 'assets/cast/kuro-face.webp')
# Kūro's reactions, each fitted bottom-centre into a 120x120 cell (2x the 60x60 drawn)
cells = []
for n in KR:
    im = Image.open(f'{ART}kuro-{n}.webp').convert('RGBA')
    im.thumbnail((120, 120), Image.LANCZOS)
    c = Image.new('RGBA', (120, 120), (0, 0, 0, 0))
    c.alpha_composite(im, ((120 - im.width) // 2, 120 - im.height))
    cells.append(c)
strip(cells, (120, 120), 'assets/cast/kuro-react.webp')
