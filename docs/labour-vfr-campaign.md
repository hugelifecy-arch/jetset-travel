# Labour & VFR Flights Campaign: Handover (31 October 2026)

Campaign goal: make JetSet Travel the agency people find when an employee or employer in
Cyprus searches for special Labour/VFR fares to **Manila, Kathmandu, Dhaka and Delhi**, and
turn those visits into WhatsApp enquiries.

Nothing here has been published to production. The website changes are on a feature branch
and pull request; the Google Business Profile (GBP) content below is ready to paste manually.

---

## 1. New pages and URLs

| Page | English | Russian |
| --- | --- | --- |
| A. Labour & VFR service page | `/en/labour-vfr-flights-cyprus` | `/ru/labour-vfr-flights-cyprus` |
| B. Seasonal staff flights (employers) | `/en/seasonal-staff-travel-cyprus` | `/ru/seasonal-staff-travel-cyprus` |
| C. Winter 2026/27 blog article | `/en/blog/winter-staff-flights-cyprus-2026-2027` | `/ru/blog/aviabilety-domoj-s-kipra-zima-2026-2027` |

The service pages use the same Latin slug in both languages, like the other `*-cyprus`
landing pages (`corporate-travel-cyprus`, `hotel-booking-cyprus`). The Russian blog slug is
transliterated, like every other Russian post.

**Titles and H1s**

| URL | `<title>` | H1 |
| --- | --- | --- |
| /en/labour-vfr-flights-cyprus | Special Labour & VFR Flights from Cyprus \| JetSet Travel | Special Labour & VFR Flight Fares from Cyprus |
| /en/seasonal-staff-travel-cyprus | Seasonal Staff Flight Bookings for Cyprus Hotels \| JetSet Travel | Seasonal Staff Flight Bookings for Hotels and Restaurants in Cyprus |
| /en/blog/winter-staff-flights-cyprus-2026-2027 | Winter Flights Home from Cyprus for Overseas Workers 2026/27 | Travelling Home from Cyprus This Winter? Labour & VFR Flight Options |
| /ru/labour-vfr-flights-cyprus | Тарифы Labour и VFR с Кипра: Манила, Катманду, Дакка, Дели \| JetSet | Специальные тарифы Labour и VFR на перелёты с Кипра |
| /ru/seasonal-staff-travel-cyprus | Перелёты сезонного персонала для отелей Кипра \| JetSet Travel | Перелёты сезонного персонала для отелей и ресторанов Кипра |
| /ru/blog/aviabilety-domoj-s-kipra-zima-2026-2027 | Зимние перелёты домой с Кипра для иностранных работников 2026/27 | Летите домой с Кипра этой зимой? Тарифы Labour и VFR |

**What each page contains**

- **Page A:**
  - a summary that answers the question first
  - the six fare types defined: Labour, VFR, ethnic, published, promotional and private
  - who may qualify, and the documents a fare typically needs
  - one card per airline
  - one section per destination: Manila, Kathmandu, Dhaka and Delhi, each with its routing, return advice and its own WhatsApp button
  - planning the return to Cyprus, and the baggage and fare-condition checklist
  - why book through a local agency, and how it works
  - a callout for employers
  - 9 FAQs, including the AI-search questions from the brief
  - related articles and service cross-links
- **Page B:**
  - an answer-first summary
  - the seven employer services from the brief (flights home, returns, multiple bookings, Labour/VFR checks, baggage and conditions, itinerary coordination, employer invoicing)
  - the four staff routes, each linking to the destination section on page A
  - an end-of-season example, clearly labelled as illustrative
  - what to send us (with a note not to send passport copies)
  - steps, why use us, and 7 FAQs
  - CTA: "Arrange Staff Flights via WhatsApp"
- **Page C:**
  - covers all nine topics in the brief: the four routes, how to request a fare, when to book, the return to Cyprus, baggage and fare conditions
  - a table of airlines by route, and a short section for employers
  - links to pages A and B, and to the four destination sections

## 2. Files created or modified

**Created**
- `src/app/[locale]/labour-vfr-flights-cyprus/page.tsx`: page A.
- `src/app/[locale]/seasonal-staff-travel-cyprus/page.tsx`: page B.
- `content/blog/winter-staff-flights-cyprus-2026-2027.md` and `content/blog/aviabilety-domoj-s-kipra-zima-2026-2027.md`: page C in EN and RU.
- `public/images/blog/winter-flights-home-cyprus-2026-27.jpg`: header image for the article, a mirrored re-crop of the existing airport photo. Replace it with an original photo if you have one.
- `src/lib/labour-vfr.ts`: the four destinations and the WhatsApp prefilled messages.
- `src/components/ui/WhatsAppCtaLink.tsx`: the WhatsApp button.
- `src/components/ui/WhatsAppGlyph.tsx`: the WhatsApp icon, moved out of the blog CTA so both use it.
- `tests/labour-vfr.test.js`: 29 tests (messages, SEO registration, internal links, copy guards).
- `docs/labour-vfr-campaign.md`: this file.

**Modified**
- **SEO registries:**
  - `src/lib/canonical.ts` (hreflang pairs and the language switcher)
  - `src/app/sitemap.ts`
  - `src/components/seo/breadcrumb-names.ts`
  - `src/lib/blog-translation-pairs.ts`
  - `src/components/seo/ServiceSchema.tsx` (new optional `audience`)
- **Blog:**
  - `src/lib/blog.ts` and `src/app/[locale]/blog/[slug]/page.tsx`: optional `seoTitle` front matter, so a post's `<title>` can differ from its H1, as the brief asks. Also added related-service links for the `labour-vfr` and `seasonal-staff` tags.
  - `src/lib/blog-topic-cta.ts`: new `labour-vfr` topic for the in-article call to action.
- **WhatsApp:** `src/lib/whatsapp-message.ts`. The floating button and mobile bar now pre-fill a Labour/VFR or employer message on the new pages and the article.
- **Internal links:**
  - `HeaderClient.tsx` (Services menu: "Labour & VFR Fares")
  - `Footer.tsx` (both pages)
  - `ServicesGrid.tsx` (homepage strip under the service cards)
  - `CorporateTravelContent.tsx` (seasonal-staff section, as the brief requires)
  - `FlightPageContent.tsx` (Labour & VFR section on `/en/flight-tickets-cyprus` and `/ru/aviabilety-kipr`)
  - `services/page.tsx` (links under Flights and Corporate)
  - `ServicesCrossLinks.tsx` (two new cards, used only where a page asks for them)
  - the two Larnaca vs Paphos airport guides (EN and RU)
- **Copy:** `src/messages/en.json` and `ru.json`. Adds the new `labourVfrPage` and `seasonalStaffPage` namespaces, plus nav, footer, services and blog CTA keys.
- **AI discovery:** `public/llms.txt` and `public/llms-full.txt` now describe the service, the routings, the Kathmandu exception and the two new FAQs.
- **Tests:** `whatsapp-message.test.js`, `blog-topic-cta.test.js` and `seo-snippet-lengths.test.js` (the new pages' titles and descriptions are read from the message files).

## 3. Airline information verified (research on 31 Oct 2026)

**Owner-confirmed, not checkable publicly:** JetSet's commercial access to special Labour/VFR
fare arrangements with Qatar Airways, Emirates and Gulf Air.

**Publicly verified, and what the copy says:**

| Fact | Status | Source |
| --- | --- | --- |
| Emirates flies Larnaca–Dubai | Operating; daily EK109/110 (Dubai–Larnaca–Malta) | aeroroutes.com, 9 Oct 2026; Cyprus Mail, 9 Mar 2026 |
| Qatar Airways flies Larnaca–Doha | Operating. Not on Qatar's winter 2026/27 suspension list; current frequency unconfirmed | aeroroutes.com, 27 Mar and 5 Jul 2026 |
| Gulf Air flies Larnaca–Bahrain | Back since 1 Jun 2026; winter schedule lists Bahrain–Larnaca | tradearabia.com, 16 Apr 2026; aeroroutes.com, 19 Oct 2026 |
| None of the three flies from Paphos | Confirmed (secondary source) | Wikipedia (Paphos airport), 23 Oct 2026 |
| Qatar Airways: Doha to MNL, KTM, DAC, DEL | All four served | aeroroutes.com, Apr and Jul 2026 |
| Emirates: Dubai to MNL, DAC, DEL | Served | Wego (Sep 2026); Daily Star (May 2026); aeroroutes.com (Jul 2026) |
| **Emirates: Dubai to Kathmandu** | **Emirates flight numbers, operated by flydubai (codeshare)** | Gulf Business (2017); flight trackers (2026) |
| Gulf Air: Bahrain to MNL, DAC, DEL | Served (Delhi from 21 Apr 2026) | tradearabia.com; aeroroutes.com; Wego |
| **Gulf Air: Bahrain to Kathmandu** | **Not served; route ended** | myRepublica; Gulf Air's 2026 reinstatement list |
| Direct flights from Cyprus to the four cities | None | Larnaca and Paphos route lists; Cyprus–India direct flights only "under discussion" (May 2026) |
| Gulf disruption | Airspace closed after 28 Feb 2026; Emirates back 7 Mar; Bahrain reopened about 9 Apr | Boston Globe, Cyprus Mail, The National |

**Fare types.** In booking systems, Labour = passenger type **LBR** ("Laborer/Worker") and
VFR = **VFR** ("Visit friends/relatives"), per Travelport's ATPCO-compliant code table.
"Ethnic fare" is a trade term with no passenger code. Private and negotiated fares are sold
only through authorised agencies.

**Not publicly published by any of the three airlines:** Labour/VFR eligibility rules,
baggage allowances or extra baggage for labour passengers. The copy therefore states **no
prices, discounts, baggage allowances or guaranteed eligibility**. It says that conditions
are checked for each booking and that "typically" a valid Cyprus residence or work permit,
and sometimes an employment contract or employer letter, is needed. `tests/labour-vfr.test.js`
fails the build if a price, %, kg, "guarantee" or "24/7" claim appears in the new page copy.

**Demand context used in the article.** Deputy Ministry of Migration figures as of 30 Sep 2025, reported by Cyprus Mail on 17 Nov 2025:
- Residence permits: 15,607 Nepali, 14,237 Indian and 3,175 Bangladeshi nationals
- Domestic-work permits: 6,106 Filipino nationals

**Re-check before or after go-live:** schedules still change after the spring 2026
disruption. Before each GBP post or seasonal refresh, re-check:
- that Gulf Air still flies to Larnaca
- that Gulf Air still does not fly to Kathmandu
- that flydubai still operates the Dubai–Kathmandu leg

The airline websites blocked automated checks, so frequencies were not confirmed on the
airlines' own sites, and the copy deliberately states none.

## 4. SEO implementation

- **Metadata:** unique titles and descriptions (all titles 56–67 characters, descriptions
  151–158). Canonical URLs, Open Graph and Twitter tags come from the existing
  `buildPageMetadata`.
- **Hreflang:** en, en-GB, ru, ru-RU and x-default on both service pages and on the article
  pair. The language switcher resolves to the real counterpart.
- **Headings:** one H1 per page. H2 sections, with H3 for each destination, airline, step
  and service.
- **Structured data:**
  - `Service` on pages A and B, using the site's `#organization` provider identity, with a
    `PeopleAudience` / `BusinessAudience`
  - `FAQPage`, emitted once per page by the existing `FAQSection`
  - `BreadcrumbList`, generated site-wide from the URL
  - `BlogPosting` and `BreadcrumbList` on the article
  - No review ratings or offers were invented.
- **Sitemap:** six new URLs (pages A and B lastmod 2026-10-31, articles from front matter),
  each with alternates.
- **Speed:** static (SSG) pages with no new third-party scripts. The hero has no image, so
  there is no extra LCP weight.
- **AI search:** each page opens with a factual summary paragraph; the FAQs mirror the brief's
  questions; and `llms.txt` / `llms-full.txt` describe the service, including what is not
  offered (Gulf Air to Kathmandu, flights from Paphos).
- **Not done:** no keyword-volume research. There is no Keyword Planner or Search Console
  access from this environment, so the keyword sets in the brief were used as given. Check
  real queries in Search Console after 3–4 weeks (§7).

## 5. WhatsApp integration

All new calls to action are `wa.me/35799478073` deep links (the app on phones, WhatsApp Web
or Desktop on computers), opening in a new tab. Each has a screen-reader hint and a
`data-track-region` attribute. There are no forms and no CRM.

| Where | Button | Prefilled message (EN) |
| --- | --- | --- |
| Page A, hero, steps and closing | Request Labour/VFR Fare · Get Flight Quotation · Check Special Fare | "Hello JetSet Travel, I would like a special Labour/VFR flight quotation from Cyprus. Destination and dates: " |
| Page A, Manila card | Check Special Fare to Manila | "Hello JetSet Travel, I would like a special Labour/VFR flight quotation from Cyprus to Manila. Please advise the available fares." |
| Page A, Kathmandu / Dhaka / Delhi cards | Check Special Fare to … | The same wording with the city name |
| Page B, hero, "what to send" and closing | Arrange Staff Flights via WhatsApp · Arrange Employee Flights | "Hello JetSet Travel, I manage employees in Cyprus and would like a quotation for seasonal staff flights and return travel." |
| Article, inline and end CTA | Ask on WhatsApp | "Hello JetSet Travel, I read your winter flights guide and would like a special Labour/VFR flight quotation from Cyprus. Destination and dates: " |
| Floating button and mobile bar on pages A and B and the article | (icon) | Page A message / employer message |

Russian pages use Russian prefills, for example: «Здравствуйте, JetSet Travel! Прошу рассчитать
специальный тариф Labour/VFR на перелёт с Кипра в Манилу. Подскажите, пожалуйста, какие тарифы
доступны.»

**Click tracking.** The existing `ContactClickTracker` sends GA4 `click_whatsapp` with a
`link_region` parameter, only after analytics consent. Regions:
- page A: `labour_vfr_hero`, `labour_vfr_manila`, `labour_vfr_kathmandu`, `labour_vfr_dhaka`, `labour_vfr_delhi`, `labour_vfr_steps`, `labour_vfr_closing`
- page B: `seasonal_staff_hero`, `seasonal_staff_send`, `seasonal_staff_closing`
- article: `blog_inline_cta`

---

## 6. Google Business Profile: ready to publish

Use the **existing** profile. Do not create a second one. Google's rules checked on 31 Oct 2026:
- Custom service names must not contain prices, phone numbers or personal information.
  Google's API recommends names of 140 characters or fewer and descriptions of 250 or fewer.
- Posts with a phone number in the text may be rejected, so the posts below contain none.
  Use the WhatsApp/website link instead.
- "Learn more" needs a URL. Do not use link shorteners. UTM parameters are fine; both URLs
  below were checked to load directly with no redirect.
- Posts are archived after 6 months.
- Use **Update** posts. Do not use "Offer" posts: those are for a real sale with dates, and
  there is none.
- Do not post near-identical texts; the two posts below are distinct.

Note: Google does not confirm that the "Travel agency" category supports custom services.
If the Services editor is not available in the dashboard, put the same information in the
posts and the business description instead.

### 6.1 Services (Edit services → Add custom service)

| Service name | Description (≤ 250 characters) |
| --- | --- |
| Labour & VFR Flight Tickets | Special Labour and VFR (Visiting Friends and Relatives) fares from Cyprus with Qatar Airways, Emirates and Gulf Air, compared with published fares, including baggage and change rules. Eligibility depends on airline rules. |
| Special Flights from Cyprus to Manila | Labour and VFR fare checks from Larnaca to Manila with Qatar Airways (via Doha), Emirates (via Dubai) and Gulf Air (via Bahrain), plus the return flight to Cyprus. |
| Special Flights from Cyprus to Kathmandu | Labour and VFR fare checks from Larnaca to Kathmandu with Qatar Airways (via Doha) and Emirates (via Dubai, with the Dubai–Kathmandu flight operated by flydubai), plus the return to Cyprus. |
| Special Flights from Cyprus to Dhaka | Labour and VFR fare checks from Larnaca to Dhaka with Qatar Airways (via Doha), Emirates (via Dubai) and Gulf Air (via Bahrain), plus the return flight to Cyprus. |
| Special Flights from Cyprus to Delhi | Labour and VFR fare checks from Larnaca to Delhi with Qatar Airways (via Doha), Emirates (via Dubai) and Gulf Air (via Bahrain), plus the return flight to Cyprus. |
| Seasonal Employee Flight Bookings | For hotels and restaurants in Cyprus: flights home after the season and back before the next, for one employee or whole teams, with Labour/VFR fare checks where eligible and invoicing to the company. |

Leave **price** empty. Google marks it as optional, and the brief rules out invented prices.
The Kathmandu entry names only Qatar Airways and Emirates, because Gulf Air does not fly there.

### 6.2 Post 1: individuals (Add update)

**Headline / first line:** Special Labour & VFR Flights from Cyprus

**Text** (336 characters, owner wording unchanged):

```
Travelling home from Cyprus?

JetSet Travel in Paphos assists eligible passengers with special Labour and VFR flight options to Manila, Kathmandu, Dhaka and Delhi.

We can check Qatar Airways, Emirates and Gulf Air options according to the available fares and conditions.

Contact JetSet Travel on WhatsApp for a personalised quotation.
```

- **Button:** Learn more
- **Link:** `https://www.jetset-travel.com/en/labour-vfr-flights-cyprus?utm_source=google&utm_medium=organic&utm_campaign=gbp_post_labour_vfr`
- **Image:** a real photo (office, aircraft or airport), JPG or PNG, at least 720×720 px recommended and under 5 MB, with little or no text on it. Keep the subject centred, because Google crops post images.

### 6.3 Post 2: hotel managers (Add update)

**Headline / first line:** Seasonal Staff Flight Bookings from Cyprus

**Text** (296 characters, owner wording unchanged):

```
Are your hotel or restaurant employees travelling home for the winter?

JetSet Travel helps Cyprus employers arrange international staff flights and return journeys for the following working season.

Ask us about eligible Labour/VFR airfares, baggage conditions and coordinated employee bookings.
```

- **Button:** Learn more
- **Link:** `https://www.jetset-travel.com/en/seasonal-staff-travel-cyprus?utm_source=google&utm_medium=organic&utm_campaign=gbp_post_seasonal_staff`
- **Image:** a different photo from Post 1, for example a hotel team or a hotel exterior in Cyprus. Use only photos you own or have permission to use.

**Publishing order:** Post 1 first, then Post 2 a few days later, so the two do not appear as
duplicate same-day content. Publish a fresh update every 2–4 weeks during the season (for
example, ahead of Christmas departures for Manila, and ahead of the spring return to Cyprus).

### 6.4 Optional: business description addition

The business description allows up to 750 characters, with no URLs and no promotions. If
there is room, add:

> We also arrange flights for people working in Cyprus, including special Labour and VFR fares with Qatar Airways, Emirates and Gulf Air to Manila, Kathmandu, Dhaka and Delhi, and seasonal staff flights for hotels and restaurants.

Q&A: Google discontinued the Q&A API in Nov 2025 and is reported to have replaced public
Q&A with "Ask Maps". Do not plan Q&A content; the FAQs live on the website instead.

---

## 7. Measuring results: first 90 days

Use only the tools the site already has: GA4 (consent-gated), Search Console and GBP Performance.

**Day 0 (after deploy)**
1. In Search Console, run URL Inspection → Request indexing for the six new URLs.
   Resubmit `sitemap.xml`. Run `npm run indexnow` to notify Bing and Yandex.
2. Publish GBP Post 1 and add the six services. Publish Post 2 two to four days later.
3. In GA4, register `link_region` as an event-scoped custom dimension (Admin → Custom
   definitions). Without it, the per-destination WhatsApp clicks are not visible in reports.

**What to track**

| Goal | Where | How |
| --- | --- | --- |
| Organic traffic to page A and page B | GA4 → Reports → Pages and screens; Search Console → Performance → Page filter | Compare EN and RU separately (`/en/…` vs `/ru/…`) |
| Destination searches | Search Console → Performance → Query filter, Custom (regex): `labou?r\|vfr\|manila\|kathmandu\|nepal\|dhaka\|bangladesh\|delhi\|india\|philippin` | Watch impressions first; clicks follow once positions settle |
| Employer searches | Search Console query regex: `staff\|employee\|seasonal\|worker\|hotel\|персонал\|сотрудник` | Filter to page B |
| WhatsApp clicks | GA4 → Explore → event `click_whatsapp`, broken down by `link_region` and page path | Consent-gated, so this undercounts. Treat it as a trend, not a total |
| Real enquiries | WhatsApp Business: label chats that arrive with the prefilled Labour/VFR or employer text | The prefill identifies the source; log the destination and whether it was booked |
| GBP traffic | GBP Performance (views, website clicks); GA4 session campaign = `gbp_post_labour_vfr` / `gbp_post_seasonal_staff` | The UTM links separate post clicks from the main website button |
| AI-search referrals | GA4 → Traffic acquisition, session source contains `chatgpt\|perplexity\|copilot\|gemini` | Small numbers are normal at first |

**Checkpoints**
- **Week 2:** all six URLs show "URL is on Google" in URL Inspection. If not, check
  Search Console's Page indexing report.
- **Week 4:** first impressions for destination queries. Note which city brings impressions
  and which brings WhatsApp chats.
- **Day 45:**
  - Add the real questions customers ask on WhatsApp to the FAQ (page A or B).
  - Publish a new GBP update.
  - Re-check the airline facts in §3.
- **Day 60:** if one destination leads, consider a dedicated article for it, for example
  "Cyprus to Kathmandu flights for Nepali workers", linking back to page A.
- **Day 90:**
  - Compare WhatsApp enquiries and bookings by destination and by page against the cost of
    handling them.
  - Decide the spring push: return-to-Cyprus flights in February and March.
  - Update `LABOUR_VFR_LAST_UPDATED` in `src/lib/labour-vfr.ts` when the copy changes.

---

## 8. Testing completed

- `npm run lint`: clean.
- `npm test`: 656 tests, 656 pass. That is 599 existing tests plus 57 new ones: 29 in
  `labour-vfr.test.js`, the rest in the extended WhatsApp, blog-CTA, snippet and
  per-post suites.
- `npx tsc --noEmit`: clean.
- `npm run build`: succeeds. All six new URLs prerender as static HTML.
- On the production server (`next start`), checked the following:
  - All new and changed pages return 200.
  - Titles, descriptions, canonical URLs and hreflang render correctly.
  - Each page has one H1.
  - JSON-LD parses: `Service`, `FAQPage` and `BreadcrumbList` on pages A and B; `BlogPosting` and `BreadcrumbList` on the articles.
  - Every WhatsApp button decodes to the intended EN or RU message.
  - The sitemap lists all six URLs.
- Playwright check at 375 px mobile width: no horizontal overflow on the new pages, the
  articles, Corporate Travel, both flights pages, Services, `/en` and `/ru`. Desktop and
  mobile screenshots were reviewed.

## 9. Outstanding items for the owner

1. **Approve and publish.** Review the PR and its Vercel preview. Nothing goes to production
   without your approval.
2. **Article byline.** The article is attributed to Maro Kokkinou, like the existing flights
   guide. Change it in the front matter if someone else should be credited.
3. **Russian copy.** It is written to read naturally, but a quick read by a native speaker
   on the team is recommended before publishing.
4. **Invoicing wording.** Page B says bookings are "invoiced to the company", as the brief
   asked. Confirm this matches how you bill employers.
5. **Blog image.** It is a re-crop of the existing airport photo. Replace it with an original
   photo if you have one.
6. **Airline facts.** Re-check them before each seasonal refresh (§3), especially Gulf Air
   at Larnaca and the Kathmandu exceptions.
7. **GBP.** Publish manually (§6). There is no direct GBP access from this environment.
