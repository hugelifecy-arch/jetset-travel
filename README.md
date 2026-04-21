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

Requirements: Node.js 20+ and npm.

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
| `npm run start` | Run the production server (after `build`) |
| `npm run lint` | Run ESLint |
| `npm run audit-check` | Run the custom audit script in `scripts/audit-check.js` |
| `node --test 'tests/*.test.js'` | Run the Node test runner suite |

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

The day-to-day correction playbook used by the Claude Code agent lives in
[`CLAUDE.md`](./CLAUDE.md) at the repo root.

---

## Domain canonicalization

Edge middleware enforces canonical host redirects in production:

- `jetset-travel.com` (apex) permanently redirects to `www.jetset-travel.com` with HTTP **308**
- Pathname and query string (including UTM parameters) are preserved
- `*.vercel.app`, `*.vercel-preview.app`, and `localhost` are not redirected

Quick verification:

```bash
curl -I https://jetset-travel.com/en
# Expect: HTTP/2 308 + Location: https://www.jetset-travel.com/en

curl -I 'https://jetset-travel.com/?utm_source=test'
# Expect: HTTP/2 308 + Location: https://www.jetset-travel.com/?utm_source=test

curl -I https://www.jetset-travel.com/
# Expect: no host-canonical redirect (locale handling is managed by i18n middleware)
```

A scripted version is available at `scripts/verify-canonical-redirects.sh`.

---

## Contributing

1. Branch from `main`.
2. Run `npm run lint`, `node --test 'tests/*.test.js'`, and `npm run build` locally.
3. Open a PR using the template in `.github/PULL_REQUEST_TEMPLATE.md`.
4. CI runs lint + tests + build on every push and PR (see `.github/workflows/ci.yml`).
