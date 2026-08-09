# Portfolio site

Static site, no framework. Tailwind is the only build step.

```sh
npm run watch:css   # rebuild src/css/output.css while editing
npm run build:css   # one-off build
```

Serve `src/` with any static file server.

## Fonts

`src/fonts/FiraMono-Regular.woff2` is a subset of Fira Mono, cut down from the
full 170kB TTF to ~17kB. It covers Latin-1 (so `åäö` work) plus common
punctuation. To rebuild it from an upstream Fira Mono TTF:

```sh
pip install fonttools brotli
pyftsubset FiraMono-Regular.ttf \
  --unicodes='U+0020-007E,U+00A0-00FF,U+2010-2015,U+2018-201A,U+201C-201E,U+2026,U+20AC,U+2122' \
  --flavor=woff2 --layout-features='*' \
  --output-file=src/fonts/FiraMono-Regular.woff2
```

If you add content outside those ranges, extend `--unicodes` or the glyphs will
fall back to the system monospace font.

## Images

The skill icons in `src/images/` are optimised with
[SVGO](https://github.com/svg/svgo). Run it with `removeViewBox` disabled — the
icons are sized by CSS class, so dropping the `viewBox` breaks their scaling:

```sh
npx svgo --config=svgo.config.js src/images/*.svg
```

## TODO

-   [ ] Serve compressed (`encode zstd gzip` in Caddy) and set `Cache-Control`
-   [ ] Convert project screenshots from PNG to WebP
