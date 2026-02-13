# Acceptance Criteria — JetSet Website Renewal

This checklist defines done criteria for the planned 3-PR modernization sequence.

## Global constraints (apply to all PRs)
- [ ] Official identifiers remain unchanged and accurate everywhere they appear: Tourism License 7775, IATA 14200130, Reg HE 181550.
- [ ] Brand tone remains corporate + luxury and location context remains Cyprus/Paphos.
- [ ] EN/RU language behavior remains functional for all newly added or changed UI copy.
- [ ] No broken links in top navigation, CTA buttons, social proof links, or footer links.

---

## PR 1 — CRO + Trip.com

## Functional checklist
- [ ] Hero section clearly presents two user paths: managed quote flow and quick booking flow.
- [ ] Primary CTA hierarchy is consistent across desktop/mobile (Quote > WhatsApp > Quick Booking support link).
- [ ] Trip.com partner area remains accessible and clearly labeled as partner booking.
- [ ] Contact/quote form validates required fields and shows explicit success/fallback states.

## Analytics checklist
- [ ] GA4 (or selected analytics) is enabled for production with no placeholder IDs.
- [ ] Events are tracked for: primary CTA click, WhatsApp click, Trip widget interaction, form start, form submit success/failure.
- [ ] Event names and parameters are documented in PR notes.

## UX quality checklist
- [ ] Response-time/SLA microcopy is visible near primary conversion actions.
- [ ] Mobile sticky/quick-contact behavior (if introduced) does not overlap key content.
- [ ] Accessibility: form fields have labels, status messages are screen-reader friendly, and keyboard navigation remains intact.

---

## PR 2 — SEO + Brand Assets

## SEO checklist
- [ ] Service-focused landing pages are indexable and linked from primary IA.
- [ ] Each page has unique title, meta description, canonical, and correct language targeting.
- [ ] Structured data is valid and relevant (Organization/TravelAgency retained, plus any new FAQ/Service schema where used).
- [ ] Sitemap includes all intended indexable pages and matches canonical URLs.

## Brand/content checklist
- [ ] Brand visuals (logo/favicon/OG assets) are consistent and production-ready.
- [ ] Hero and CTA copy preserve corporate-luxury voice and Cyprus/Paphos positioning.
- [ ] Trust blocks keep compliance-safe phrasing and do not modify official numbers.

## QA checklist
- [ ] No duplicate or conflicting canonical tags.
- [ ] No missing OG/Twitter image references on key landing pages.
- [ ] Internal links between service pages and contact flow are valid.

---

## PR 3 — Performance + QA

## Performance checklist
- [ ] CSS delivery is moved from runtime CDN dependency to optimized build output.
- [ ] Critical assets are compressed/optimized and properly sized for target breakpoints.
- [ ] Lighthouse targets (mobile) meet agreed threshold (recommended: Performance >= 85, SEO >= 90, Best Practices >= 90, Accessibility >= 90).
- [ ] Core Web Vitals are monitored (or approximated in lab) with no major regressions vs baseline.

## Engineering quality checklist
- [ ] CI checks run on PR (lint/format/link check and Lighthouse or equivalent).
- [ ] Release checklist is documented and repeatable.
- [ ] Rollback plan is documented for risky production regressions.

## Regression checklist
- [ ] All key CTAs function (Quote, WhatsApp, Trip.com, maps/reviews links).
- [ ] Form submission still works across supported devices/browsers.
- [ ] EN/RU and dark mode toggles still work after build/performance refactor.
