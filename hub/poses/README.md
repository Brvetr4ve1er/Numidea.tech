# Portrait pose frames

Drop 1–4 images here, then uncomment the `<img class="pose">` block in
`hub/index.html` (search for `POSE SLOTS`).

- **Names:** `pose-0.webp` … `pose-3.webp`
- **Ratio:** 5:6 portrait (the frame is `aspect-ratio:5/6`); 840×1008 is ideal
- **Format:** WebP, background removed or bled to near-black
- `pose-0` needs `class="pose on"`; the rest are just `class="pose"`

The drawn placeholder silhouette hides itself automatically as soon as any
`.pose` element exists (`.portrait:has(.pose) .bust{display:none}`), and the
scroll-driven pose count adapts to however many frames are present.
