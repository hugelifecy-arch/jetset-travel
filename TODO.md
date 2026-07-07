# TODO — Follow-ups for Month 1 Blog Content

Tracked from the Month 1 bilingual blog-post drop (branch `claude/add-bilingual-blog-posts-EkcBA`).

## July 2026 blog drop (branch `claude/cyprus-travel-blog-posts-edbwgm`)

Two new EN posts from the playbook's priority-topic queue:

- `larnaca-vs-paphos-airport-2026` — primary keyword "Larnaca vs Paphos airport"
- `travel-insurance-cyprus-visitors-guide` — primary keyword "travel insurance for Cyprus"

**Russian translations pending.** Both posts shipped EN-only (self-referential canonical + x-default per the untranslated-post handling). Per the playbook, RU versions need a native-speaker pass before publishing — once translated, add the RU file and set `translationSlug` on both sides so hreflang pairs up.

**Facts to sanity-check before requesting indexing:**

- Airport post: 2025 passenger figures (LCA 9.91M / PFO 3.84M / 13.75M total — Hermes Airports press data), route/airline lists as of June 2026 (Jet2/easyJet year-round UK routes, Ryanair focus-city status), and the approximate drive times table.
- Insurance post: "€2 million medical cover" and "under €15 single-trip" price guidance are defensible 2026 ranges, not quotes; the €30,000 visa insurance minimum and EHIC/GHIC/GeSY coverage claims are sourced (EC Visa Code, NHS/GOV.UK, gesy.org.cy).
- ~~Insurance copy contradiction~~ **Resolved 2026-07-06** (branch `claude/insurance-copy-contradiction-fh1nxz`): owner confirmed JetSet distributes travel insurance as a **sub-agent of licensed insurance providers** — it is not itself an insurance company. This is a recognised arrangement under Cyprus law implementing the EU Insurance Distribution Directive 2016/97 (the ICCS/Superintendent of Insurance keeps a register of insurance sub-agents, and IDD Art. 1(3) additionally exempts low-premium travel cover sold alongside a trip: ≤ €600/yr pro rata, or ≤ €200/person for trips ≤ 3 months). The wrong side of the contradiction was Terms §8 and this blog post, both now rewritten to state the sub-agent arrangement (insurer issues/underwrites the policy and handles claims). `visaServices.faq3A` and `luxury.included6` are consistent with this and stay unchanged. **Remaining owner action:** confirm the exact sub-agent registration details (partner insurer/agency name and ICCS register entry) so they can be named in Terms §8 — IDD point-of-sale disclosure also requires telling the customer which insurer issues the policy and that we may receive commission.

**Hero images:** bespoke 1600×900 progressive JPEGs added at `/images/blog/larnaca-vs-paphos-airport-2026.jpg` and `/images/blog/travel-insurance-cyprus-2026.jpg`. Source: Unsplash (photo IDs 1569154941061-e231b4725ef1, 1578894381163-e72c17f2d45f), Unsplash License.

## Hero images

The 4 new posts currently reuse existing blog hero images so they render cleanly in production. Replace each with a bespoke 1600×900 JPG when available:

| Post | Current image | Planned replacement path |
| --- | --- | --- |
| `luxury-travel-cyprus-2026-guide` / `lyuks-puteshestviya-s-kipra-2026-gid` | `/images/blog/luxury-mediterranean-2026.jpg` (reused) | `/images/blog/luxury-travel-cyprus-2026.jpg` |
| `corporate-travel-management-cyprus-cost-2026` / `korporativnye-komandirovki-kipr-stoimost-2026` | `/images/blog/business-guide-limassol.jpg` (reused) | `/images/blog/corporate-travel-cyprus-2026.jpg` |
| `private-villa-holidays-mykonos-santorini-crete` / `villy-mikonos-santorini-krit-s-kipra` | `/images/blog/luxury-mediterranean-2026.jpg` (reused) | `/images/blog/villa-greek-islands-2026.jpg` |
| `corporate-travel-policy-template-cyprus` / `shablon-politiki-komandirovok-kipr` | `/images/blog/corporate-travel-tips.jpg` (reused) | `/images/blog/corporate-travel-policy-cyprus-2026.jpg` |

After adding the new image files under `public/images/blog/`, update the `image:` frontmatter key on the 8 post files (EN + RU).

## Corporate travel policy template (DOCX)

Post `corporate-travel-policy-template-cyprus` (and its RU mirror) reference a downloadable DOCX template. The post currently routes readers to a waitlist CTA (`/en/corporate-travel/#contact` and `/ru/corporate-travel/#contact`) rather than a download link, so there is no 404.

When the template is produced:

1. Save it as `public/downloads/jetset-corporate-travel-policy-template-2026.docx`.
2. Update both posts' download CTA to point to `/downloads/jetset-corporate-travel-policy-template-2026.docx`.
3. Consider adding the download behind a lightweight form capture (name, company, email) via the existing quote API.

## Facts and numbers to verify before indexing

The following figures are author estimates informed by current industry norms but should be sanity-checked against your own pricing data before the posts are surfaced in Google Search Console → Request Indexing:

**`luxury-travel-cyprus-2026-guide` / `lyuks-puteshestviya-s-kipra-2026-gid`:**
- Private jet charter price ranges (Larnaca–London, Larnaca–Dubai, Larnaca–Mykonos).
- Worked-budget ranges for Maldives, Japan, and Greek-islands trips.
- Maldives villa weekly pricing (£28,000–£55,000).

**`corporate-travel-management-cyprus-cost-2026` / `korporativnye-komandirovki-kipr-stoimost-2026`:**
- Transaction-fee ranges (€15–€45), retainer ranges (€800–€3,500/month).
- IATA and consortium savings percentages (7–15% flights, 10–25% premium).
- Worked-example savings lines for the Limassol tech and Nicosia finance firm profiles.

**`private-villa-holidays-mykonos-santorini-crete` / `villy-mikonos-santorini-krit-s-kipra`:**
- Peak-season nightly villa ranges for each island.
- Cyprus booking-window recommendations (February deadlines).

**`corporate-travel-policy-template-cyprus` / `shablon-politiki-komandirovok-kipr`:**
- Per-diem ranges by city (Athens, Tel Aviv, Frankfurt, London, Dubai, New York).
- Class-of-travel threshold table.
- Approval-workflow thresholds (€800 / €3,000).

These were written as defensible 2026 ranges, but the CLAUDE playbook explicitly flags per-diem numbers, VAT rates, and specific villa prices as "needs source-backing before they can stay live." Recommend a single commercial review pass before requesting indexing.

## Russian copy — editor review required

Per the playbook's explicit instruction: "Do not auto-translate the RU versions with a script or LLM without human review." The 4 new RU posts should have a native-speaker editorial pass before they are surfaced in Google Search Console. Specific items to check:

- Register consistency (we use "вы" throughout).
- Brand term usage ("JetSet", "IATA", city names in Russian vs English form).
- Pricing currency formatting (€2 500 vs €2,500 — we used narrow-space, which is the Russian typographic standard).
- Any cultural phrasings that should be adjusted for Russian-speaking Cyprus residents.

## Validation after deploy

Once merged and deployed to production (`www.jetset-travel.com`):

- [ ] Google Rich Results Test on each of the 8 URLs
- [ ] Schema.org Validator on each URL
- [ ] Google Search Console: URL Inspection → Request Indexing for each
- [ ] Confirm all 8 live URLs return 200 and hreflang alternates are reciprocal
