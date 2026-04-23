# TODO — Follow-ups for Month 1 Blog Content

Tracked from the Month 1 bilingual blog-post drop (branch `claude/add-bilingual-blog-posts-EkcBA`).

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
