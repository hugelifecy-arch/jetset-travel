# JetSet Travel — www.jetset-travel.com

Marketing website for **JetSet Travel Cyprus**, an IATA-accredited travel agency
based in Paphos. The site serves two audiences — corporate travel managers and
luxury leisure travellers — in English and Russian.

- **Production:** https://www.jetset-travel.com
- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · `next-intl`
- **Hosting:** Vercel
- **Languages:** English (`/en`) and Russian (`/ru`), with `x-default` hreflang

---

## Getting started

Requirements: Node.js 22.6+ and npm (CI uses Node.js 22).

```bash
npm install
cp .env.example .env.local   # fill in any required keys
npm run dev
```

Open http://localhost:3000.

### Available scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm run test:forms` | Check built form routes with synthetic data and mocked email/CAPTCHA providers; run after build |
| `npm run start` | Run the production server (after `build`) |
| `npm run lint` | Run ESLint |
| `npm run audit-check` | Run the custom audit script in `scripts/audit-check.js` |
| `node --test tests/*.test.js` | Run the Node test runner suite |
| `npm run verify:sitemap -- --base <url>` | Every sitemap URL: 200, self-canonical, indexable, reciprocal hreflang |
| `npm run verify:redirects -- --base <url>` | Every redirect in `src/lib/redirects.ts`: one 301 to a 200 page |
| `npm run verify:links -- --base <url>` | Every internal link on every sitemap page answers 200 (no redirect, no 404) |
| `npm run suggest:lastmod` | Per-page, per-locale last content change from git history (for `src/app/sitemap.ts`) |

---

## Project structure

```
.
├── src/
│   ├── app/              Next.js App Router (locale-segmented routes, API, sitemap, robots)
│   ├── components/       UI: analytics, blog, cookies, forms, layout, sections, seo, ui
│   ├── hooks/            React hooks
│   ├── lib/              Shared utilities (server + client)
│   ├── messages/         i18n message catalogues (EN / RU) for next-intl
│   ├── fonts/            Local font assets
│   ├── types/            Shared TypeScript types
│   ├── i18n.ts           next-intl configuration
│   └── middleware.ts     Edge middleware (host canonicalization, locale routing)
├── content/blog/         Markdown blog posts
├── public/               Static assets (icons, manifests, llms.txt, verification files)
├── scripts/              Operational scripts (audit, redirect verification)
├── tests/                Node test runner suites
├── docs/                 Audits, playbooks, and strategy documents
├── archive/              Legacy pre-Next.js static-site files (kept for reference)
└── .github/              Issue / PR templates and CI workflow
```

---

## Documentation

Audits, playbooks, and SEO strategy live under [`docs/`](./docs):

- `seo-health-check.md` — current SEO state
- `serp-analysis-and-seo-strategy.md` — keyword and SERP strategy
- `performance-audit.md` — Core Web Vitals and asset audit
- `vulnerability-report.md` — security findings
- `acceptance-criteria.md` / `release-checklist.md` — release process
- `website-renewal-plan.md` — broader renewal plan
- `jetset-claudecode-master-playbook.md` — master Claude Code playbook
- `jetset-seo-fix-playbook.md` — concrete SEO remediation steps
- `jetset-travel-indexing-fix-plan.md` — indexing remediation plan
- `labour-vfr-campaign.md` — Labour & VFR flights campaign: pages, airline verification, Google Business Profile posts, 90-day measurement plan

The day-to-day correction playbook used by the Claude Code agent lives in
[`CLAUDE.md`](./CLAUDE.md) at the repo root.

---

## Domain canonicalization and redirects

The proxy (`src/proxy.ts` → `src/lib/canonicalize.ts`) resolves every
non-canonical URL to `https://www.jetset-travel.com/<locale>/<path>` (no
trailing slash) in **one 301**: apex → www, trailing slash, `/en/en`,
`?lang=`, wrong-case locale, bare paths, and retired/merged URLs from the
table in `src/lib/redirects.ts` (e.g. `/en/visa-services-cyprus/` →
`/en/visa-services`). `next.config.ts` deliberately has no `redirects()` and
sets `skipTrailingSlashRedirect`, because both run before the proxy and
would add a second hop.

- Add a retired or merged URL to `src/lib/redirects.ts` (both locales);
  `tests/redirects.test.js` rejects chains and redirects to non-sitemap pages.
- `*.vercel.app`, `*.vercel-preview.app` and `localhost` are never host-redirected.
- `http://` always gets Vercel's own HTTPS 308 first (platform behaviour; the
  HSTS preload header means browsers skip it after the first visit).
- For apex → www to be a single hop, the `jetset-travel.com` domain in Vercel
  (Project → Settings → Domains) must be connected to the project **without**
  a domain-level redirect, so the proxy handles it. A Vercel domain redirect
  answers 308 and keeps the path as-is, so `https://jetset-travel.com/en/about/`
  would take two hops.

Verification:

```bash
npm run build && npm start
```

```bash
npm run verify:redirects -- --base http://localhost:3000
```

```bash
npm run verify:links -- --base http://localhost:3000
```

```bash
./scripts/verify-canonical-redirects.sh
```

The last one checks the host/protocol hops against production.

---

## Contributing

1. Branch from `main`.
2. Run `npm run lint`, `node --test tests/*.test.js`, and `npm run build` locally.
3. Open a PR using the template in `.github/PULL_REQUEST_TEMPLATE.md`.
4. CI runs lint + tests + build on every push and PR (see `.github/workflows/ci.yml`).
