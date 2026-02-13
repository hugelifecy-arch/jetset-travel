# Release Checklist

This project is deployed with **GitHub Pages** (custom domain via `CNAME` in repo root).

## 1) Pre-merge checks

- [ ] Confirm the change is scoped and reviewed (at least 1 reviewer for production-impacting updates).
- [ ] Verify no secrets/credentials were committed.
- [ ] Run a local static sanity check:
  - `python3 -m http.server 4173`
  - Open `http://localhost:4173` and verify navigation, contact section, and translations.
- [ ] Validate key files still exist in the root deploy artifact:
  - `index.html`
  - `app.js`
  - `styles.css`
  - `CNAME`
  - `robots.txt` / `sitemap.xml`
- [ ] Confirm the GitHub Actions workflow `.github/workflows/deploy-pages.yml` has no unintended edits.
- [ ] If migrating to Vite in future, set `base` correctly for GitHub Pages pathing:
  - Custom domain/root deploy: `base: "/"`
  - Project pages deploy (`<owner>.github.io/<repo>/`): `base: "/<repo>/"`

## 2) Post-deploy smoke tests

After merge to `main` and successful "Deploy static site to GitHub Pages" workflow:

- [ ] Open production homepage and verify HTTP 200.
- [ ] Hard refresh (disable cache) and verify latest content is visible.
- [ ] Confirm footer build marker is updated (build SHA/time).
- [ ] Check core journey:
  - [ ] Hero + CTA buttons render
  - [ ] Mobile menu opens/closes
  - [ ] Language switch EN/RU works
  - [ ] Dark mode toggle works
  - [ ] Contact form fallback (`mailto`) still opens correctly
- [ ] Verify SEO essentials:
  - [ ] `https://<domain>/robots.txt`
  - [ ] `https://<domain>/sitemap.xml`
  - [ ] Canonical URL remains correct

## 3) Rollback steps (fast path)

1. Identify last known good commit on `main`.
2. Revert the bad commit(s):
   - Single commit: `git revert <bad_sha>`
   - Multiple commits: `git revert --no-commit <oldest_bad_sha>^..<newest_bad_sha> && git commit`
3. Push to `main`.
4. Watch GitHub Actions deploy run until success.
5. Re-run post-deploy smoke tests, especially footer build marker and key CTAs.

### Emergency rollback (history rewrite, use sparingly)

If revert is not feasible and team agrees:

1. Reset locally to good SHA: `git reset --hard <good_sha>`
2. Force push with lease: `git push --force-with-lease origin main`
3. Confirm Pages deploy succeeds.
4. Announce rollback in incident channel with SHA + reason.
