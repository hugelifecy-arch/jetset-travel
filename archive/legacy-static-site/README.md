# Legacy static-site assets

These files predate the Next.js rewrite and are no longer served by the running
application. They are kept here for historical reference and because a small
number of unit tests and audit documents still reference the original utility
module (`jetset-utils.js`).

Files:

- `app.js` — original landing-page bootstrap (dark mode, language switch, lead form)
- `index.html` — original single-page HTML shell
- `styles.css` — original minimal stylesheet
- `jetset-utils.js` — pure helper functions (still exercised by `tests/jetset-utils.test.js`)
- `yandex_c693997a9fde5229.html` — Yandex site verification file (the live copy
  is served from `public/yandex_c693997a9fde5229.html`)

If you confirm nothing else references these files, the entire `archive/`
directory is safe to delete.
