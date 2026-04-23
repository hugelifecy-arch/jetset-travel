# JetSet Travel — Dependency & Maintainability Audit

_Audited: 2026-04-23 · Branch: `claude/audit-dependencies-maintainability-l08I7`_

This report covers the health of `package.json`, build/tooling config, CI, tests,
and the source tree from a pure maintenance perspective (SEO, content and UX
issues are tracked separately in `CLAUDE.md` and `docs/seo-health-check.md`).

---

## TL;DR

| Area | Finding | Severity |
| --- | --- | --- |
| `next` 16.1.6 | 6 open advisories (4 high, 2 moderate); 16.2.3+ fixes all | **High — upgrade now** |
| `next-intl` 4.8.3 | Open-redirect advisory GHSA-8f24-v5vv-gm5j; fixed in 4.9.1 | **Moderate — upgrade now** |
| `resend` 6.9.2 (unused) | Listed as direct dep but nothing imports it; pulls svix + uuid advisories | **Remove dependency** |
| `tsconfig.json target: ES2017` | Predates Node 20 and React 19 baseline | Low |
| Tests re-inline TS logic in JS | Drift risk acknowledged in comments | Medium |
| `archive/legacy-static-site/jetset-utils.js` | Imported by `tests/jetset-utils.test.js`, so "archive" is load-bearing | Low |
| Parallel EN / RU SEO-slug routes | 11 duplicate routes under `[locale]/` with redirect guards | Medium |
| Large page components | 5 files >500 lines (max 1006) | Medium |

`npm audit` summary: **9 vulnerabilities (0 critical · 4 high · 5 moderate · 0 low)**.
All have a fix available.

---

## 1. Dependency audit

### 1.1 Security advisories (`npm audit`)

Direct dependencies:

| Package | Current | Fixed in | Severity | Advisories |
| --- | --- | --- | --- | --- |
| `next` | 16.1.6 | 16.2.3 (non-breaking; latest 16.2.4) | **High** | GHSA-ggv3-7p47-pfv8 (HTTP-request-smuggling in rewrites), GHSA-3x4c-7xq6-9pq8 (unbounded `next/image` disk cache), GHSA-h27x-g6w4-24gq (postponed-resume DoS), GHSA-mq59-m269-xvcx (null-origin bypasses Server Actions CSRF), GHSA-jcc7-9wpm-mj36 (dev-HMR WebSocket CSRF bypass), GHSA-q4gf-8mx6-v5v3 (Server Components DoS) |
| `next-intl` | 4.8.3 | 4.9.1 (non-breaking) | Moderate | GHSA-8f24-v5vv-gm5j (open redirect via locale routing) |
| `resend` | 6.9.2 | Drop, or 6.1.3 (breaking) | Moderate | Transitively brings vulnerable `svix` 1.68.0-1.91.1 and `uuid` <14.0.0 |

Transitive-only (all dev, via `eslint-config-next` / `@typescript-eslint`):

| Package | Severity | Note |
| --- | --- | --- |
| `brace-expansion` | Moderate | ReDoS; `npm audit fix` resolves |
| `flatted` | High | Proto-pollution + parse DoS |
| `minimatch` | High | ReDoS in `matchOne` |
| `picomatch` | High | Method injection + ReDoS in POSIX classes |

None of the transitive advisories reach runtime (all dev-only tooling under ESLint),
but `npm audit fix` cleans them without manual intervention.

### 1.2 `resend` is an unused direct dependency

The `src/lib/email/resend.ts` helper calls `fetch("https://api.resend.com/emails", …)`
directly — the Resend SDK is never imported:

```
$ grep -rn "from .resend" src
(no matches)
```

The package sits in `package.json` for historical reasons only. Removing it:

- deletes three advisories (`resend`, `svix`, `uuid` transitive) in one step;
- shrinks `node_modules` and lockfile churn on every install;
- removes the largest `fixAvailable: isSemVerMajor: true` blocker from `npm audit`.

**Action:** `npm uninstall resend` and verify `npm run build` + tests still pass.

### 1.3 Version drift

Output of `npm outdated`:

| Package | Installed | Wanted | Latest | Notes |
| --- | --- | --- | --- | --- |
| `next` | 16.1.6 | 16.1.6 | **16.2.4** | Major-free; fixes advisories above. |
| `next-intl` | 4.8.3 | **4.9.1** | 4.9.1 | Fixes open redirect. |
| `@vercel/analytics` | 1.6.1 | 1.6.1 | **2.0.1** | Major; small API change around `<Analytics />` import path. |
| `lucide-react` | 0.575.0 | 0.575.0 | **1.8.0** | Major; icon set reorganisation — validate imports. |
| `framer-motion` | 12.34.3 | 12.38.0 | 12.38.0 | Minor, safe. |
| `react` / `react-dom` | 19.2.3 | 19.2.5 | 19.2.5 | Patch, safe. |
| `react-hook-form` | 7.71.2 | 7.73.1 | 7.73.1 | Minor, safe. |
| `resend` | 6.9.2 | 6.12.2 | 6.12.2 | Recommend removing (see §1.2) rather than bumping. |

No major version bumps are required to close the security gaps — `next` 16.2.4
and `next-intl` 4.9.1 are both in-range of the declared semver ranges and will
land on the next `npm install`.

### 1.4 Missing metadata in `package.json`

- No `engines` field. README promises Node 20+ but it is not enforced on `npm install` or in CI beyond the manually-pinned `setup-node@v4`.
- No `.nvmrc` / `.node-version`. Contributors on nvm/volta get no hint.
- No `packageManager` pin. npm is implied by `package-lock.json` but not declared.

Suggested addition:

```jsonc
"engines": { "node": ">=20.11" },
"packageManager": "npm@10.8.2"
```

and a `.nvmrc` containing `20`.

---

## 2. Build & tooling configuration

### 2.1 `tsconfig.json`

- `"target": "ES2017"` is outdated. Node 20 and every supported browser (per
  Next.js 16 baseline) support `ES2022`; bumping avoids needless down-levelling
  of async/optional-chaining/nullish-coalescing. Keep `lib` as-is.
- `"include": [..., "**/*.mts"]` without a matching `"**/*.cts"` — harmless
  but inconsistent; drop unused entries.

### 2.2 `eslint.config.mjs`

- `globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"])` with the
  comment "Override default ignores of eslint-config-next" re-states the defaults
  rather than overriding them. If the intent is genuinely "use the defaults",
  remove the call entirely; if the intent is to add ignores, add new entries.
- No project-specific rules at all. Given the size of the codebase, adding at
  least `"@typescript-eslint/consistent-type-imports"` and
  `"@next/next/no-html-link-for-pages"` would be cheap wins.
- No `lint:fix` script. Ship one.

### 2.3 `next.config.ts`

- CSP keeps `'unsafe-inline'` + `'unsafe-eval'` on `script-src`. Next.js
  currently requires `'unsafe-inline'` for the bootstrap script; `'unsafe-eval'`
  is only needed in dev. Split the policy with
  `process.env.NODE_ENV === 'production'` to drop `'unsafe-eval'` in prod.
- `securityHeaders` lives at module top-level but is only used by the catch-all
  `/(.*)`. That's fine; leave it.
- Two permanent redirects (`/en/luxury`, `/ru/luxury`). Confirm they are still
  hit — if no traffic in 90 days, prune.

### 2.4 `.gitignore`

Missing common noise: `.idea/`, `.vscode/`, `*.log` (beyond the npm/yarn
variants), `coverage/`, `.turbo/`. Add these to avoid accidental commits.

### 2.5 Empty scaffolding

- `src/types/` contains only `.gitkeep` — drop the directory.
- `src/lib/.gitkeep` and `src/messages/.gitkeep` are obsolete (both directories
  are populated).

---

## 3. CI / release pipeline

`.github/workflows/ci.yml`:

- Triggers only on `push` to `main` and `pull_request` → `main`. Feature
  branches pushed directly get no CI feedback until a PR is opened. Add
  `workflow_dispatch:` at minimum.
- No `.next/cache` restoration between runs — every build is cold (Next.js
  recommends caching this path).
- No `npm audit --omit=dev --audit-level=high` step. Today's 4 high advisories
  would have been caught on PR. Add a non-blocking audit job, or wire it as a
  weekly `schedule:` cron.
- No Lighthouse / `audit-check.js` run against a preview. The script exists in
  `scripts/audit-check.js` but nothing runs it automatically.

Recommended additions:

```yaml
- uses: actions/cache@v4
  with:
    path: .next/cache
    key: nextjs-${{ hashFiles('package-lock.json') }}-${{ hashFiles('src/**') }}
- name: Audit (non-blocking)
  run: npm audit --omit=dev --audit-level=high || true
```

---

## 4. Tests

`tests/` contains four files (~600 LOC). CI runs `node --test tests/*.test.js`.

### 4.1 Tests inline production logic instead of importing it

Three of four test files open with a comment along the lines of:

> We can't directly import TypeScript modules, so we inline the logic here.
> Any change to `src/lib/…` must be reflected here.

That is an explicit drift contract with no compiler to enforce it. Two
remediation paths:

1. **Import TS directly.** Node 20+ can load TS via `--import tsx/esm` (or
   Node 22 native type-stripping). Add `tsx` to devDependencies and change CI
   to `node --import tsx tests/*.test.ts`.
2. **Compile first.** Add `tsconfig.test.json`, build to `./dist-test/` in a
   pre-test step, and import from there.

Either approach eliminates the mirror. Option 1 is the cheaper first move.

### 4.2 `archive/` is load-bearing, not archival

`tests/jetset-utils.test.js` imports `../archive/legacy-static-site/jetset-utils.js`
for side effects (the file assigns to `globalThis.JetsetUtils`). Consequences:

- The README claims `archive/` is "legacy static-site files kept for reference"
  but deleting it would break CI.
- Old CommonJS-style `globalThis` assignment is used from an ES module; this
  only survives because Node's ESM loader is forgiving.
- The file under test has no production consumer — nothing in `src/` imports
  it. The tests therefore cover code that ships only in the archive.

Pick one: either relocate the utility into `src/lib/` and update the test to
point there, or delete both the archive file and its test.

### 4.3 Coverage gaps

- No tests for `src/lib/rate-limit.ts`, `src/lib/canonical.ts`, or any of the
  three API routes (`/api/contact`, `/api/quote`, `/api/cruise-enquiry`).
- No component tests — acceptable for a marketing site, but at least a smoke
  test for the lead-form submit flow would guard the most revenue-relevant path.

---

## 5. Source maintainability

### 5.1 Oversized page/content files

| File | LOC |
| --- | --- |
| `src/app/[locale]/cruises/CruisesContent.tsx` | 1 006 |
| `src/app/[locale]/quote/QuoteContent.tsx` | 676 |
| `src/app/[locale]/contact/ContactContent.tsx` | 582 |
| `src/app/[locale]/about/page.tsx` | 536 |
| `src/app/[locale]/visa-services/page.tsx` | 530 |
| `src/app/[locale]/privacy/page.tsx` | 455 |
| `src/app/[locale]/blog/[slug]/page.tsx` | 436 |

Most of the weight in these files is inline JSX content. Extract
static content blocks into `src/messages/*.json` (already doing this for most
of the site) or into co-located `*.content.ts` files; keep the `.tsx` file
focused on layout and data wiring. `CruisesContent.tsx` is the most urgent —
a reader has to scroll past 1 000 lines to find any logic change.

### 5.2 Parallel EN / RU SEO-slug routes

Eleven routes under `src/app/[locale]/` are slug variants of the seven core
services:

| Canonical | EN SEO slug | RU SEO slug |
| --- | --- | --- |
| `corporate-travel` | `corporate-travel-cyprus` | `korporativnye-poezdki-kipr` |
| `luxury-travel` | `luxury-travel-cyprus` | `luxusnyy-otdykh-kipr` |
| `visa-services` | `visa-services-cyprus` | `vizovye-uslugi-kipr` |
| `hotel-reservations` | `hotel-booking-cyprus` | `bronirovanie-otelej-kipr` |
| _(none)_ | `flight-tickets-cyprus` | `aviabilety-kipr` |
| `paphos-travel-agency` | — | `turisticheskoe-agentstvo-pafos` |

Each SEO-slug pair shares a `*PageContent.tsx` file behind a `locale !== "<expected>"`
guard that redirects cross-locale traffic. The pattern works but:

- Because every slug is mounted under `[locale]`, `/en/aviabilety-kipr/` and
  `/ru/flight-tickets-cyprus/` both compile into valid routes that immediately
  redirect. That's 6 unneeded prerenders and 6 redirect chains for bots.
- The two `page.tsx` shells in a pair carry near-duplicate `generateMetadata`
  exports with subtly different titles/descriptions; future copy edits risk
  drift (as demonstrated by the current diff between
  `flight-tickets-cyprus/page.tsx` and `aviabilety-kipr/page.tsx`).
- `languagePaths` is identical across both members of every pair — it should
  be a shared constant.

Either:
- lift the `languagePaths` + metadata into a single helper keyed on a
  `SlugPair` constant, or
- move the SEO slugs out of `[locale]` into top-level routes (so
  `aviabilety-kipr/page.tsx` lives at `src/app/aviabilety-kipr/page.tsx`) and
  hard-code the locale inside that file.

### 5.3 Code hygiene

- **Two open TODOs** that pre-date this audit:
  - `src/app/api/contact/route.ts:138` — "Connect to email service (Resend, SendGrid, or Nodemailer)" (superseded by `sendResendEmail`; comment is stale and misleading).
  - `src/app/[locale]/contact/ContactContent.tsx:444` — placeholder Calendly URL.
- **~18 `console.log` calls** inside API routes are structured operational logs (prefixed with `[contact]`, `[quote]`, etc.). They're fine for Vercel Functions but consider a single `src/lib/logger.ts` wrapper so they can be silenced in tests or forwarded to a real sink.
- **`sendResendEmail(apiKey, payload: Record<string, unknown>)`** accepts an untyped payload. Narrow to the fields Resend requires (`from`, `to`, `subject`, plus `html` or `text`) so callers can't silently omit required fields.
- **No `SECURITY.md`**. For a site that exposes three form endpoints and collects contact data under GDPR, a one-page disclosure policy is table stakes.
- **Five unused template SVGs** in `public/` (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) — no source references. Delete.

### 5.4 i18n catalogue

`ru.json` has three keys that `en.json` lacks:

```
flightsCyprusPage.faqSubtitle
hotelCyprusPage.faqSubtitle
luxuryCyprusPage.faqSubtitle
```

Either add the EN equivalents or remove the RU keys. A CI guard could keep
this from re-drifting — a 20-line node script that flattens both files and
fails if the symmetric difference is non-empty.

### 5.5 Assets

- `public/videos/hero.mp4` (2.0 MB) + `hero.webm` (2.9 MB) ship together; the
  browser only plays one. If the `<video>` tag provides `<source>` in order,
  keep the smaller first and confirm Safari fallback. Either way, 4.9 MB is
  heavy — see `docs/performance-audit.md`.
- `public/images/` (8.3 MB) is mostly blog hero imagery. A small `find public/images -type f` vs `grep -r` pass would identify any orphans — left as follow-up.

---

## 6. Prioritised action list

### Do this week (security)
1. `npm install next@16.2.4 next-intl@4.9.1` — closes 7 open advisories.
2. `npm uninstall resend` — closes 3 more advisories; confirm `sendResendEmail` (raw-fetch) is the only consumer.
3. `npm audit fix` — clears the remaining dev-only transitives.
4. Add `npm audit --audit-level=high` to CI as a non-blocking step.

### Do this month (health)
5. Decide the fate of `archive/`: either promote `jetset-utils.js` into `src/lib/` (and its test) or delete both.
6. Replace test mirrors with direct TS imports via `tsx` (or similar).
7. Add `engines`, `packageManager`, `.nvmrc`; raise `tsconfig` target to `ES2022`.
8. Consolidate the SEO-slug route pairs behind a shared helper.
9. Split `CruisesContent.tsx` (1 006 lines) and `QuoteContent.tsx` (676 lines) into content + shell.

### Nice to have
10. Add `SECURITY.md`.
11. Cache `.next/cache` in CI; split CSP by `NODE_ENV` to drop `'unsafe-eval'` in production.
12. `lint:fix` script; add `consistent-type-imports` rule.
13. Delete unused template SVGs in `public/` and empty `src/types/`.

---

## 7. What already looks good

- **`next.config.ts`** is careful: HSTS preload, CSP, frame/referrer policies,
  immutable cache headers on static assets, `X-Robots-Tag: noindex` on the
  Vercel preview host.
- **`src/middleware.ts`** documents the single-hop canonicalization contract
  and has an actual regression test backing it.
- **`docs/`** is genuinely useful — 10 well-structured audit/strategy files.
- **Bilingual i18n keys are in parity** (1 520 EN vs 1 523 RU, only 3 extras).
- **Alt text, aria-label, and hreflang coverage** is already enforced by
  `scripts/audit-check.js` and passes on every EXPECTED_PAGES entry.
- **Content-first architecture**: almost all copy lives in `src/messages/*.json`,
  which makes future Russian editorial passes tractable.
