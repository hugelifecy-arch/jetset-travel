# Legacy static-site assets

These files predate the Next.js rewrite and are no longer served by the running
application. They are kept here for historical reference only — nothing in
`src/`, `public/`, `scripts/`, or `tests/` imports them.

Files:

- `app.js` — original landing-page bootstrap (dark mode, language switch, lead form)
- `index.html` — original single-page HTML shell
- `styles.css` — original minimal stylesheet
- `jetset-utils.js` — original pure helper functions (superseded by `src/lib/`)
- `yandex_c693997a9fde5229.html` — Yandex site verification file (the live copy
  is served from `public/yandex_c693997a9fde5229.html`)

The entire `archive/` directory is safe to delete.
