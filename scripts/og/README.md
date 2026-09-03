# Open Graph image

`client/public/og-image.png` (1200×630) is rendered from
`og-image.template.html` in this directory.

It exists because `og:image` previously pointed at `/logo-official.svg` — a
*relative* path (Open Graph requires an absolute URL) to an *SVG* (which
Facebook, LinkedIn, X and LINE all refuse to render). Every share of every page
therefore produced a card with no image (audit finding 4.5).

To regenerate after editing the template:

```sh
/opt/pw-browsers/chromium-1194/chrome-linux/chrome \
  --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1200,630 \
  --screenshot=client/public/og-image.png --allow-file-access-from-files \
  file://$PWD/scripts/og/og-image.template.html
```

Any headless Chrome works; the path above is the one available in CI sandboxes.
Check the output is exactly 1200×630 and that nothing is clipped at the bottom —
the template has no scroll, so overflow is silently cropped.
