# SPEC: "Private & Family Office Travel" Page — jetset-travel.com

**Deliverable:** A new trilingual (EN / EL / RU) page targeting UHNW individuals, family offices, and their professional intermediaries (law firms, fiduciaries, corporate service providers).
**Tone:** Quiet, principal-led, discretion-first. This page must NOT reuse the mass-market conversion patterns of the main site (free quotes, budget dropdowns, urgency badges, emoji/checkmark comparisons).

---

## 0. PRE-FLIGHT — Detect and follow existing conventions

Before writing any code:

1. Inspect the repo structure. Identify:
   - Framework and router type (expected: Next.js App Router).
   - i18n mechanism (expected: route-based `/en`, `/ru` — extend to `/el` if the locale exists; if EL locale does NOT yet exist, implement this page in EN + RU only and add EL translations to whatever i18n dictionary system is in place, flagging in the PR/summary that site-wide EL is not enabled).
   - Styling system (expected: Tailwind). Reuse existing design tokens, fonts, container widths, button components.
   - Existing shared components: `Header`, `Footer`, nav config, SEO/meta helper, translation JSON files, section components.
2. **Follow the site's existing component and translation conventions exactly.** Do not introduce new styling paradigms, new UI libraries, or new translation systems.
3. Reuse the existing contact-form infrastructure ONLY if it can be stripped down (see §5.10). No budget dropdowns on this page under any circumstances.

---

## 1. ROUTE, NAV, SEO

### 1.1 Route
- Slug: `/private` → `/en/private`, `/el/private`, `/ru/private` (match existing locale routing).
- Page name: **Private & Family Office Travel**.

### 1.2 Navigation placement (decided)
- **Header:** add one link, last position before the CTA/contact button, styled slightly muted (e.g. same nav style, no highlight). Labels:
  - EN: `Private Clients`
  - EL: `Ιδιώτες Πελάτες`
  - RU: `Частным клиентам`
- **Footer:** add the same link under the services/company column.
- No banners, popups, or homepage hero changes promoting this page. Discovery is deliberate: nav, footer, direct URL shared by referrers.

### 1.3 Meta / SEO (per locale)
- EN title: `Private & Family Office Travel Services in Cyprus | JetSet Travel`
- EN description: `Discreet, principal-led travel management for private clients, families and family offices in Cyprus. Private aviation, yacht charter, VIP airport services, consolidated billing. Limassol & Paphos.`
- EL title: `Ταξιδιωτικές Υπηρεσίες για Ιδιώτες & Family Offices στην Κύπρο | JetSet Travel`
- EL description: `Διακριτική, προσωπική διαχείριση ταξιδιών για ιδιώτες πελάτες, οικογένειες και family offices στην Κύπρο. Ιδιωτική αεροπλοΐα, ναύλωση σκαφών, υπηρεσίες VIP στα αεροδρόμια, ενοποιημένη τιμολόγηση. Λεμεσός & Πάφος.`
- RU title: `Тревел-услуги для частных клиентов и семейных офисов на Кипре | JetSet Travel`
- RU description: `Конфиденциальное персональное управление поездками для частных клиентов, семей и семейных офисов на Кипре. Частная авиация, аренда яхт, VIP-услуги в аэропортах, консолидированные счета. Лимассол и Пафос.`
- Add `hreflang` alternates per existing site pattern.
- Schema.org: `Service` + existing `TravelAgency` org schema; `areaServed: Cyprus`; do not add `priceRange`.

---

## 2. DESIGN RULES FOR THIS PAGE (overrides where they conflict with homepage patterns)

1. **Quiet layout.** Generous whitespace, larger type, fewer elements per viewport. No emojis, no ✓/✗ comparison tables, no countdowns, no "reply within 2 hours" badges, no "FREE" anywhere.
2. **Palette:** stay within the site's existing brand palette but bias toward its darkest neutral / navy tones; minimal accent color usage (CTA only).
3. **Imagery:** use restrained, high-end imagery — private jet cabin/apron at dusk, yacht deck detail, hotel suite detail. Prefer dark, low-saturation photography. If suitable licensed images are not available in the repo, use elegant abstract/dark gradient blocks instead of stock clichés; leave a `TODO(images)` comment listing the three image slots (hero, aviation, marine) for the owner to supply.
4. **CTAs on this page:** exactly two styles — primary `Request an introduction` and secondary `Call the principal`. Never "Get a Free Quote".
5. All copy below is final and trilingual. Do not machine-shorten it; implement as written. Keys/structure of translation files follow existing conventions.

---

## 3. PAGE STRUCTURE (top → bottom)

1. Hero
2. Discretion statement (3 pillars)
3. Principal-led service (named)
4. Scope of services (10 items)
5. Family office operating model
6. Selected situations (3 anonymized cases)
7. Professional intermediaries
8. How engagement works (4 steps)
9. References note
10. Contact / Request an introduction
11. Quiet footer note

---

## 4. FULL COPY — ENGLISH (`/en/private`)

### 4.1 Hero
- Eyebrow: `PRIVATE & FAMILY OFFICE TRAVEL`
- H1: `Travel, handled quietly.`
- Sub: `Principal-led travel management for private clients, families and family offices — from scheduled first class to private aviation, yachts and everything around them. Based in Cyprus. Available worldwide.`
- Primary CTA: `Request an introduction` (anchors to §4.10)
- Secondary CTA: `Call the principal` → `tel:+35799478073`

### 4.2 Discretion
- H2: `Discretion is the service.`
- Intro line: `Before itineraries, before aircraft, before hotels — confidentiality. Our private client practice is built on three commitments:`
- Three pillars (cards or simple columns, no icons or very minimal line icons):
  1. **Confidentiality as standard.** `Non-disclosure agreements are available as a standard part of engagement. We never publish client names, destinations or arrangements — no testimonials, no case studies with identities, no social media.`
  2. **Controlled information.** `Travel details are shared strictly on a need-to-know basis — with airlines, operators and hotels receiving only what is required to deliver the service, and nothing more.`
  3. **Compliant data handling.** `Personal data, passport and payment information are processed under GDPR, retained only as long as necessary, and never shared with third parties for marketing.`

### 4.3 Principal-led
- H2: `One principal. One line. One relationship.`
- Body: `Private client accounts at JetSet are not routed through a call centre or a rotating team. Every engagement is handled personally by Nontari Kalaitsidis, the firm's principal — an IATA-accredited travel professional based in Cyprus, working in English, Greek and Russian.`
- Body 2: `You and your office deal with one person who knows your preferences, your family, your aircraft seating, your dietary notes and your definition of urgent. Out-of-hours, the same person answers.`
- Contact line (styled, understated): `Nontari Kalaitsidis · Principal · +357 99 478073 · info@jetset.com.cy`

### 4.4 Scope of services
- H2: `Scope`
- Intro: `A single relationship covering the full breadth of private travel — delivered directly where we are accredited, and through vetted specialist partners where the mission requires it.`
- Ten items (two-column list on desktop; title + one line each):
  1. **Private aviation** — `Jet charter, empty-leg sourcing and repositioning opportunities, helicopter transfers.`
  2. **Scheduled premium travel** — `First and business class on commercial airlines, complex multi-city routings, last-minute changes handled end to end.`
  3. **Yacht charter** — `Crewed motor and sailing yachts in the Mediterranean and beyond, with provisioning and berth coordination.`
  4. **VIP airport services** — `Fast-track, meet-and-greet, private terminals and tarmac transfers at departure, transit and arrival airports.`
  5. **Ground transport** — `Chauffeured vehicles and, where required, security-vetted drivers and executive protection coordination.`
  6. **Accommodation** — `Suites, villas and private residences, including properties not publicly listed.`
  7. **Concierge arrangements** — `Restaurant tables, private events, performances and access that does not appear on booking platforms.`
  8. **Medical travel coordination** — `Discreet logistics around treatment abroad: flights, accommodation for accompanying family, ground arrangements.`
  9. **Family & household logistics** — `Multi-generational family trips, travelling staff, nannies, tutors and crew — managed under the same account, to the same standard.`
  10. **Documentation & formalities** — `Visa support, notarised parental travel consents, and travel documentation prepared correctly the first time.`

### 4.5 Family office operating model
- H2: `Built for the way a family office works.`
- Intro: `We structure the relationship the way your office already runs:`
- Four items:
  1. **One relationship, many travellers.** `Principals, family members, household staff and advisors — all travel under a single engagement, with clear internal separation.`
  2. **Pre-approval workflows.** `Fare options and costs are presented for sign-off before ticketing, in the format your office prefers. Nothing is issued without authorisation.`
  3. **Consolidated statements.** `Monthly statements structured per family member, entity or cost centre — ready for your bookkeeping, in EUR.`
  4. **Continuity.** `Preferences, loyalty programmes, seating, documentation validity and visa expiries are tracked so your office does not have to.`

### 4.6 Selected situations
- H2: `Selected situations`
- Intro: `Names, destinations and identifying details are never disclosed. The following are representative of the work:`
- Three cases (quiet cards, no photos):
  1. `A principal's family of five was mid-stay at a resort when their return carrier cancelled operations on the route. Alternative routing on two airlines was secured and ticketed within the evening, with connecting VIP transit arranged — the family kept their original arrival day.`
  2. `A family office required quarterly travel for a principal, two family members and accompanying staff across three countries, with every cost pre-approved by the office before issue. A standing pre-approval and consolidated monthly statement structure was put in place; the office now signs off by email in minutes.`
  3. `A client required urgent travel for medical treatment abroad for a family member: flights for the patient and accompanying relatives, long-stay accommodation near the clinic and ground transport were arranged within 48 hours, and adjusted twice as the treatment schedule changed.`

### 4.7 Professional intermediaries
- H2: `For lawyers, fiduciaries and corporate service providers`
- Body: `Much of our private client work arrives through the professionals who already hold the family's trust — law firms, fiduciary and corporate service providers, and relocation advisors in Limassol, Paphos and Nicosia. We work comfortably alongside your engagement: communication through your office where preferred, confidentiality undertakings extended to your firm, and travel arrangements that reflect well on the professionals who introduced us.`
- Line: `If you advise clients who need travel handled properly and quietly, we would welcome an introduction.`

### 4.8 How engagement works
- H2: `How engagement works`
- Four numbered steps (horizontal on desktop):
  1. **Introduction.** `A conversation — by phone or in person in Limassol or Paphos — about how your family or office travels and what you expect.`
  2. **Agreement.** `A written service agreement covering scope, confidentiality, service standards and fees. NDA included where required.`
  3. **Dedicated line.** `Direct access to the principal — phone, WhatsApp or email — for requests, changes and out-of-hours matters.`
  4. **Consolidated billing.** `Pre-approved costs, transparent fees, and monthly statements structured for your office.`

### 4.9 References
- Single centered line, small type: `References from professional intermediaries and long-standing clients are available on request, subject to their consent.`

### 4.10 Contact
- H2: `Request an introduction`
- Body: `Tell us briefly who is enquiring and how you prefer to be contacted. We reply personally.`
- Form fields (ONLY these — reuse existing form infra, strip everything else):
  - Name
  - Organisation / family office *(optional)*
  - Email
  - Phone *(optional)*
  - Preferred contact method: Phone / Email / WhatsApp
  - Message *(optional, textarea)*
- Submit button: `Request an introduction`
- No budget field. No travel-date field. No dropdown of trip types.
- Beside/below the form, direct contact block:
  - `Nontari Kalaitsidis — Principal`
  - `+357 99 478073` (tel link; also WhatsApp link `https://wa.me/35799478073`)
  - `info@jetset.com.cy`
  - `Limassol · Paphos · Cyprus`
- Anti-spam: reuse the site's existing mechanism.

### 4.11 Quiet footer note
- Small line above the standard footer: `JetSet K&K Travel Ltd is an IATA-accredited travel agency (IATA 14200130) licensed by the Deputy Ministry of Tourism of the Republic of Cyprus (Licence 7775).`

---

## 5. FULL COPY — GREEK (`/el/private`)

### 5.1 Hero
- Eyebrow: `ΤΑΞΙΔΙΑ ΓΙΑ ΙΔΙΩΤΕΣ & FAMILY OFFICES`
- H1: `Τα ταξίδια σας, με απόλυτη διακριτικότητα.`
- Sub: `Προσωπική διαχείριση ταξιδιών για ιδιώτες πελάτες, οικογένειες και family offices — από πρώτη θέση σε τακτικές πτήσεις έως ιδιωτική αεροπλοΐα, σκάφη και κάθε συνοδευτική υπηρεσία. Με έδρα την Κύπρο. Διαθέσιμοι παγκοσμίως.`
- Primary CTA: `Ζητήστε μια γνωριμία`
- Secondary CTA: `Καλέστε τον υπεύθυνο` → `tel:+35799478073`

### 5.2 Διακριτικότητα
- H2: `Η διακριτικότητα είναι η υπηρεσία.`
- Intro: `Πριν από τα δρομολόγια, τα αεροσκάφη και τα ξενοδοχεία — η εμπιστευτικότητα. Η υπηρεσία ιδιωτών πελατών μας στηρίζεται σε τρεις δεσμεύσεις:`
- Pillars:
  1. **Εμπιστευτικότητα ως πρότυπο.** `Συμφωνίες εμπιστευτικότητας (NDA) διατίθενται ως τυπικό μέρος της συνεργασίας. Δεν δημοσιεύουμε ποτέ ονόματα πελατών, προορισμούς ή λεπτομέρειες — καμία μαρτυρία, καμία δημοσίευση, καμία ανάρτηση.`
  2. **Ελεγχόμενη πληροφόρηση.** `Οι λεπτομέρειες των ταξιδιών κοινοποιούνται αυστηρά όπου είναι απαραίτητο — αεροπορικές εταιρείες, διαχειριστές και ξενοδοχεία λαμβάνουν μόνο ό,τι απαιτείται για την παροχή της υπηρεσίας.`
  3. **Σύννομη διαχείριση δεδομένων.** `Προσωπικά δεδομένα, διαβατήρια και στοιχεία πληρωμών επεξεργάζονται σύμφωνα με τον GDPR, διατηρούνται μόνο για όσο είναι αναγκαίο και δεν διαβιβάζονται ποτέ σε τρίτους για εμπορικούς σκοπούς.`

### 5.3 Προσωπική εξυπηρέτηση
- H2: `Ένας υπεύθυνος. Μία γραμμή. Μία σχέση.`
- Body: `Οι λογαριασμοί ιδιωτών πελατών της JetSet δεν περνούν από τηλεφωνικά κέντρα ή εναλλασσόμενες ομάδες. Κάθε συνεργασία διαχειρίζεται προσωπικά ο Νοντάρι Καλαϊτσίδης, επικεφαλής της εταιρείας — επαγγελματίας του ταξιδιωτικού κλάδου με διαπίστευση IATA, με έδρα την Κύπρο, σε αγγλικά, ελληνικά και ρωσικά.`
- Body 2: `Εσείς και το γραφείο σας συνεργάζεστε με ένα πρόσωπο που γνωρίζει τις προτιμήσεις σας, την οικογένειά σας, τις θέσεις σας στο αεροσκάφος, τις διατροφικές σας σημειώσεις και τον δικό σας ορισμό του επείγοντος. Και εκτός ωραρίου, απαντά το ίδιο πρόσωπο.`
- Contact line: `Νοντάρι Καλαϊτσίδης · Επικεφαλής · +357 99 478073 · info@jetset.com.cy`

### 5.4 Υπηρεσίες
- H2: `Εύρος υπηρεσιών`
- Intro: `Μία σχέση που καλύπτει όλο το φάσμα των ιδιωτικών ταξιδιών — απευθείας όπου διαθέτουμε διαπίστευση, και μέσω αξιολογημένων εξειδικευμένων συνεργατών όπου το απαιτεί η αποστολή.`
- Items:
  1. **Ιδιωτική αεροπλοΐα** — `Ναύλωση jet, αναζήτηση empty legs και ευκαιριών επανατοποθέτησης, μεταφορές με ελικόπτερο.`
  2. **Premium τακτικές πτήσεις** — `Πρώτη και business θέση σε αεροπορικές εταιρείες, σύνθετα δρομολόγια πολλαπλών πόλεων, αλλαγές τελευταίας στιγμής από την αρχή έως το τέλος.`
  3. **Ναύλωση σκαφών** — `Επανδρωμένα μηχανοκίνητα και ιστιοπλοϊκά σκάφη στη Μεσόγειο και πέραν αυτής, με τροφοδοσία και συντονισμό ελλιμενισμού.`
  4. **Υπηρεσίες VIP στα αεροδρόμια** — `Fast-track, meet-and-greet, ιδιωτικοί τερματικοί σταθμοί και μεταφορές στην πίστα, σε αναχώρηση, ανταπόκριση και άφιξη.`
  5. **Οδικές μετακινήσεις** — `Οχήματα με οδηγό και, όπου απαιτείται, οδηγοί με έλεγχο ασφαλείας και συντονισμός συνοδείας.`
  6. **Διαμονή** — `Σουίτες, επαύλεις και ιδιωτικές κατοικίες, συμπεριλαμβανομένων καταλυμάτων που δεν διατίθενται δημόσια.`
  7. **Υπηρεσίες concierge** — `Τραπέζια σε εστιατόρια, ιδιωτικές εκδηλώσεις, παραστάσεις και πρόσβαση που δεν εμφανίζεται σε πλατφόρμες κρατήσεων.`
  8. **Ιατρικά ταξίδια** — `Διακριτική οργάνωση γύρω από θεραπεία στο εξωτερικό: πτήσεις, διαμονή συνοδών μελών της οικογένειας, μετακινήσεις.`
  9. **Οικογενειακή υποστήριξη** — `Ταξίδια πολλών γενεών, προσωπικό, νταντάδες, δάσκαλοι και πληρώματα — υπό τον ίδιο λογαριασμό, με το ίδιο επίπεδο.`
  10. **Έγγραφα & διατυπώσεις** — `Υποστήριξη σε θεωρήσεις, συμβολαιογραφικές συναινέσεις γονέων για ταξίδια ανηλίκων και ταξιδιωτικά έγγραφα σωστά με την πρώτη.`

### 5.5 Μοντέλο λειτουργίας για family offices
- H2: `Σχεδιασμένο για τον τρόπο που λειτουργεί ένα family office.`
- Intro: `Δομούμε τη συνεργασία όπως ήδη λειτουργεί το γραφείο σας:`
- Items:
  1. **Μία σχέση, πολλοί ταξιδιώτες.** `Επικεφαλής, μέλη της οικογένειας, προσωπικό και σύμβουλοι — όλοι ταξιδεύουν υπό ενιαία συνεργασία, με σαφή εσωτερικό διαχωρισμό.`
  2. **Ροές προέγκρισης.** `Οι επιλογές ναύλων και το κόστος παρουσιάζονται προς έγκριση πριν από την έκδοση, στη μορφή που προτιμά το γραφείο σας. Τίποτα δεν εκδίδεται χωρίς εξουσιοδότηση.`
  3. **Ενοποιημένες καταστάσεις.** `Μηνιαίες καταστάσεις ανά μέλος οικογένειας, οντότητα ή κέντρο κόστους — έτοιμες για τη λογιστική σας, σε ευρώ.`
  4. **Συνέχεια.** `Προτιμήσεις, προγράμματα πιστότητας, θέσεις, ισχύς εγγράφων και λήξεις θεωρήσεων παρακολουθούνται, ώστε να μη χρειάζεται να το κάνει το γραφείο σας.`

### 5.6 Ενδεικτικές περιπτώσεις
- H2: `Ενδεικτικές περιπτώσεις`
- Intro: `Ονόματα, προορισμοί και στοιχεία ταυτοποίησης δεν αποκαλύπτονται ποτέ. Τα παρακάτω είναι αντιπροσωπευτικά της δουλειάς μας:`
- Cases:
  1. `Πενταμελής οικογένεια πελάτη βρισκόταν σε θέρετρο όταν ο αερομεταφορέας της επιστροφής ακύρωσε τη γραμμή. Εναλλακτικό δρομολόγιο με δύο αεροπορικές εξασφαλίστηκε και εκδόθηκε το ίδιο βράδυ, με VIP υπηρεσία ανταπόκρισης — η οικογένεια επέστρεψε την αρχικά προγραμματισμένη ημέρα.`
  2. `Family office χρειαζόταν τριμηνιαία ταξίδια για τον επικεφαλής, δύο μέλη της οικογένειας και συνοδευτικό προσωπικό σε τρεις χώρες, με προέγκριση κάθε κόστους πριν από την έκδοση. Δημιουργήθηκε πάγια δομή προέγκρισης και ενοποιημένης μηνιαίας κατάστασης — το γραφείο πλέον εγκρίνει με email μέσα σε λίγα λεπτά.`
  3. `Πελάτης χρειάστηκε επείγον ταξίδι για ιατρική θεραπεία μέλους της οικογένειας στο εξωτερικό: πτήσεις για τον ασθενή και τους συνοδούς, μακροχρόνια διαμονή κοντά στην κλινική και μετακινήσεις οργανώθηκαν εντός 48 ωρών — και αναπροσαρμόστηκαν δύο φορές καθώς άλλαζε το πρόγραμμα της θεραπείας.`

### 5.7 Για επαγγελματίες συμβούλους
- H2: `Για δικηγόρους, διαχειριστές εμπιστευμάτων και παρόχους εταιρικών υπηρεσιών`
- Body: `Μεγάλο μέρος της δουλειάς μας με ιδιώτες πελάτες προέρχεται από τους επαγγελματίες που ήδη έχουν την εμπιστοσύνη της οικογένειας — δικηγορικά γραφεία, παρόχους διαχείρισης εμπιστευμάτων και εταιρικών υπηρεσιών, και συμβούλους μετεγκατάστασης σε Λεμεσό, Πάφο και Λευκωσία. Συνεργαζόμαστε άνετα στο πλαίσιο της δικής σας εντολής: επικοινωνία μέσω του γραφείου σας όπου προτιμάται, δεσμεύσεις εμπιστευτικότητας που επεκτείνονται και στην εταιρεία σας, και ταξιδιωτικές υπηρεσίες που τιμούν όσους μας σύστησαν.`
- Line: `Εάν συμβουλεύετε πελάτες που χρειάζονται τα ταξίδια τους οργανωμένα σωστά και διακριτικά, θα χαρούμε μια γνωριμία.`

### 5.8 Πώς ξεκινά η συνεργασία
- H2: `Πώς ξεκινά η συνεργασία`
- Steps:
  1. **Γνωριμία.** `Μια συζήτηση — τηλεφωνικά ή από κοντά σε Λεμεσό ή Πάφο — για το πώς ταξιδεύει η οικογένεια ή το γραφείο σας και τι περιμένετε.`
  2. **Συμφωνία.** `Γραπτή σύμβαση υπηρεσιών που καλύπτει εύρος, εμπιστευτικότητα, επίπεδο εξυπηρέτησης και αμοιβές. NDA όπου απαιτείται.`
  3. **Απευθείας γραμμή.** `Άμεση πρόσβαση στον επικεφαλής — τηλέφωνο, WhatsApp ή email — για αιτήματα, αλλαγές και εκτός ωραρίου.`
  4. **Ενοποιημένη τιμολόγηση.** `Προεγκεκριμένα κόστη, διαφανείς αμοιβές και μηνιαίες καταστάσεις δομημένες για το γραφείο σας.`

### 5.9 Συστάσεις
- `Συστάσεις από επαγγελματίες συμβούλους και μακροχρόνιους πελάτες διατίθενται κατόπιν αιτήματος, με τη συγκατάθεσή τους.`

### 5.10 Επικοινωνία
- H2: `Ζητήστε μια γνωριμία`
- Body: `Πείτε μας εν συντομία ποιος ενδιαφέρεται και πώς προτιμάτε να επικοινωνήσουμε. Απαντάμε προσωπικά.`
- Fields: `Ονοματεπώνυμο` / `Οργανισμός / family office (προαιρετικό)` / `Email` / `Τηλέφωνο (προαιρετικό)` / `Προτιμώμενος τρόπος επικοινωνίας: Τηλέφωνο / Email / WhatsApp` / `Μήνυμα (προαιρετικό)`
- Submit: `Ζητήστε μια γνωριμία`
- Direct block: `Νοντάρι Καλαϊτσίδης — Επικεφαλής` · `+357 99 478073` · `info@jetset.com.cy` · `Λεμεσός · Πάφος · Κύπρος`

### 5.11 Υποσημείωση
- `Η JetSet K&K Travel Ltd είναι ταξιδιωτικό γραφείο με διαπίστευση IATA (IATA 14200130), αδειοδοτημένο από το Υφυπουργείο Τουρισμού της Κυπριακής Δημοκρατίας (Άδεια 7775).`

---

## 6. FULL COPY — RUSSIAN (`/ru/private`)

### 6.1 Hero
- Eyebrow: `ПОЕЗДКИ ДЛЯ ЧАСТНЫХ КЛИЕНТОВ И СЕМЕЙНЫХ ОФИСОВ`
- H1: `Ваши поездки — без лишнего шума.`
- Sub: `Персональное управление поездками для частных клиентов, семей и семейных офисов — от первого класса на регулярных рейсах до частной авиации, яхт и всего, что с этим связано. Базируемся на Кипре. Работаем по всему миру.`
- Primary CTA: `Запросить знакомство`
- Secondary CTA: `Позвонить руководителю` → `tel:+35799478073`

### 6.2 Конфиденциальность
- H2: `Конфиденциальность — это и есть услуга.`
- Intro: `Прежде маршрутов, самолётов и отелей — конфиденциальность. Наша работа с частными клиентами строится на трёх обязательствах:`
- Pillars:
  1. **Конфиденциальность как стандарт.** `Соглашения о неразглашении (NDA) — стандартная часть сотрудничества. Мы никогда не публикуем имена клиентов, направления и детали поездок — никаких отзывов, кейсов с именами, публикаций в соцсетях.`
  2. **Контроль информации.** `Детали поездок передаются строго по принципу необходимости: авиакомпании, операторы и отели получают только то, что требуется для оказания услуги, и ничего сверх.`
  3. **Работа с данными по закону.** `Персональные данные, паспортные и платёжные сведения обрабатываются в соответствии с GDPR, хранятся только необходимый срок и никогда не передаются третьим лицам в маркетинговых целях.`

### 6.3 Персональное ведение
- H2: `Один руководитель. Одна линия. Одни отношения.`
- Body: `Счета частных клиентов JetSet не проходят через колл-центр и не передаются между менеджерами. Каждым сотрудничеством лично занимается Нонтари Калаицидис, руководитель компании — аккредитованный IATA специалист по путешествиям, базирующийся на Кипре и работающий на русском, английском и греческом языках.`
- Body 2: `Вы и ваш офис работаете с одним человеком, который знает ваши предпочтения, вашу семью, ваши места в самолёте, ваши пожелания по питанию и ваше понимание слова «срочно». В нерабочее время отвечает тот же человек.`
- Contact line: `Нонтари Калаицидис · Руководитель · +357 99 478073 · info@jetset.com.cy`

### 6.4 Услуги
- H2: `Спектр услуг`
- Intro: `Одни отношения, покрывающие весь спектр частных поездок — напрямую там, где у нас есть аккредитация, и через проверенных профильных партнёров там, где этого требует задача.`
- Items:
  1. **Частная авиация** — `Чартер джетов, подбор empty legs и перегоночных рейсов, вертолётные трансферы.`
  2. **Премиальные регулярные рейсы** — `Первый и бизнес-класс на регулярных авиалиниях, сложные маршруты с несколькими городами, изменения в последний момент — под ключ.`
  3. **Аренда яхт** — `Моторные и парусные яхты с экипажем в Средиземноморье и за его пределами, включая провизию и согласование стоянок.`
  4. **VIP-услуги в аэропортах** — `Fast-track, meet-and-greet, частные терминалы и трансферы по перрону — при вылете, пересадке и прилёте.`
  5. **Наземный транспорт** — `Автомобили с водителем и, при необходимости, проверенные водители и координация сопровождения.`
  6. **Размещение** — `Люксы, виллы и частные резиденции, включая объекты, не представленные в открытом доступе.`
  7. **Консьерж-сервис** — `Столики в ресторанах, закрытые мероприятия, спектакли и доступ, которого нет на платформах бронирования.`
  8. **Медицинские поездки** — `Деликатная организация лечения за рубежом: перелёты, размещение сопровождающих членов семьи, наземная логистика.`
  9. **Семья и персонал** — `Поездки нескольких поколений, персонал, няни, преподаватели и экипажи — в рамках одного счёта и на одном уровне.`
  10. **Документы и формальности** — `Визовая поддержка, нотариальные согласия родителей на выезд ребёнка и корректно оформленные документы с первого раза.`

### 6.5 Модель работы с семейным офисом
- H2: `Так, как работает ваш семейный офис.`
- Intro: `Мы выстраиваем сотрудничество так, как уже устроен ваш офис:`
- Items:
  1. **Одни отношения — много путешественников.** `Принципалы, члены семьи, персонал и советники — все поездки в рамках одного сотрудничества, с чётким внутренним разделением.`
  2. **Предварительное согласование.** `Варианты тарифов и стоимость представляются на утверждение до выписки, в удобном вашему офису формате. Ничего не оформляется без авторизации.`
  3. **Консолидированные отчёты.** `Ежемесячные выписки по членам семьи, компаниям или центрам затрат — готовые для вашей бухгалтерии, в евро.`
  4. **Преемственность.** `Предпочтения, программы лояльности, места, сроки действия документов и виз отслеживаются нами — чтобы вашему офису не пришлось.`

### 6.6 Примеры ситуаций
- H2: `Примеры ситуаций`
- Intro: `Имена, направления и любые идентифицирующие детали никогда не раскрываются. Ниже — характерные примеры нашей работы:`
- Cases:
  1. `Семья клиента из пяти человек находилась на курорте, когда обратный перевозчик отменил рейсы по маршруту. Альтернативный маршрут двумя авиакомпаниями был подобран и выписан в тот же вечер, с VIP-сопровождением на пересадке — семья вернулась в изначально запланированный день.`
  2. `Семейному офису требовались ежеквартальные поездки принципала, двух членов семьи и сопровождающего персонала по трём странам с предварительным согласованием каждой суммы. Была выстроена постоянная схема согласования и консолидированной ежемесячной отчётности — теперь офис утверждает поездки по email за считанные минуты.`
  3. `Клиенту потребовалась срочная поездка на лечение члена семьи за рубеж: перелёты для пациента и сопровождающих, длительное размещение рядом с клиникой и трансферы были организованы за 48 часов — и дважды скорректированы по мере изменения графика лечения.`

### 6.7 Для профессиональных консультантов
- H2: `Юристам, фидуциарным и корпоративным провайдерам`
- Body: `Значительная часть нашей работы с частными клиентами приходит через профессионалов, которым семья уже доверяет — юридические фирмы, фидуциарных и корпоративных провайдеров, консультантов по релокации в Лимассоле, Пафосе и Никосии. Мы комфортно работаем в рамках вашего мандата: коммуникация через ваш офис, если так предпочтительнее, обязательства о конфиденциальности, распространяющиеся и на вашу фирму, и уровень сервиса, который делает честь тем, кто нас рекомендовал.`
- Line: `Если вы консультируете клиентов, которым нужны поездки, организованные грамотно и без лишней огласки, — будем рады знакомству.`

### 6.8 Как начинается сотрудничество
- H2: `Как начинается сотрудничество`
- Steps:
  1. **Знакомство.** `Разговор — по телефону или лично в Лимассоле или Пафосе — о том, как путешествует ваша семья или офис и чего вы ожидаете.`
  2. **Договор.** `Письменный договор об оказании услуг: объём, конфиденциальность, стандарты сервиса и вознаграждение. NDA — по требованию.`
  3. **Прямая линия.** `Прямой доступ к руководителю — телефон, WhatsApp или email — для запросов, изменений и вопросов в нерабочее время.`
  4. **Консолидированные счета.** `Согласованные заранее расходы, прозрачное вознаграждение и ежемесячные отчёты в удобной вашему офису структуре.`

### 6.9 Рекомендации
- `Рекомендации от профессиональных консультантов и постоянных клиентов предоставляются по запросу, с их согласия.`

### 6.10 Контакт
- H2: `Запросить знакомство`
- Body: `Коротко напишите, кто обращается и как с вами удобнее связаться. Отвечаем лично.`
- Fields: `Имя и фамилия` / `Организация / семейный офис (необязательно)` / `Email` / `Телефон (необязательно)` / `Предпочтительный способ связи: Телефон / Email / WhatsApp` / `Сообщение (необязательно)`
- Submit: `Запросить знакомство`
- Direct block: `Нонтари Калаицидис — Руководитель` · `+357 99 478073` · `info@jetset.com.cy` · `Лимассол · Пафос · Кипр`

### 6.11 Примечание
- `JetSet K&K Travel Ltd — туристическое агентство с аккредитацией IATA (IATA 14200130), лицензированное Заместительным министерством туризма Республики Кипр (лицензия 7775).`

---

## 7. FORM HANDLING

- POST to the site's existing form endpoint/handler. Subject line for notification email: `Private Clients — Introduction Request`.
- Send notifications to `info@jetset.com.cy`.
- Success state (inline, no redirect):
  - EN: `Thank you. You will hear from us personally, usually within the day.`
  - EL: `Ευχαριστούμε. Θα επικοινωνήσουμε μαζί σας προσωπικά, συνήθως εντός της ημέρας.`
  - RU: `Спасибо. Мы свяжемся с вами лично — как правило, в течение дня.`
- Validation: name + email required; preferred contact method required; everything else optional. Reuse existing anti-spam (honeypot/captcha) exactly as elsewhere on the site.

---

## 8. HOMEPAGE / SITE-WIDE CHANGES (minimal)

1. Add the nav + footer links per §1.2 in all three locales.
2. Do NOT alter homepage hero, pricing sections, or corporate messaging.
3. If the site has a services overview/listing page, add one quiet card linking to `/private` titled per locale: `Private & Family Office Travel` / `Ταξίδια για Ιδιώτες & Family Offices` / `Поездки для частных клиентов и семейных офисов`, one-line description: EN `Discreet, principal-led travel management for private clients and family offices.` (translate consistently with the page copy).
4. Add `/private` (all locales) to the sitemap.

---

## 9. QA CHECKLIST (verify before finishing)

- [ ] Page renders at `/en/private`, `/el/private`, `/ru/private` (or EN+RU if EL locale unavailable — flagged in summary).
- [ ] No "free", "quote", budget dropdowns, emojis, urgency badges, or ✓/✗ tables anywhere on the page in any language.
- [ ] `tel:` and `wa.me` links work; email is `info@jetset.com.cy` everywhere.
- [ ] Phone renders as `+357 99 478073` visually, `+35799478073` in href.
- [ ] hreflang alternates + sitemap entries present.
- [ ] Meta titles/descriptions per §1.3.
- [ ] Form submits via existing infra; success messages per §7; anti-spam active.
- [ ] Mobile: hero, 10-item services list (single column), 4-step engagement (stacked) all readable.
- [ ] Lighthouse: no regressions vs. the rest of the site; images lazy-loaded and optimized per site convention.
- [ ] Header/footer links appear in all locales with correct labels.

---

## 10. OPEN ITEMS FOR THE OWNER (leave as TODO comments in code)

- `TODO(images)`: supply 2–3 licensed dark/low-saturation images (hero, aviation, marine) or approve gradient-block fallback.
- `TODO(name)`: confirm public spelling **"Nontari Kalaitsidis"** (spec uses "Kalaitsidis" to match kalaitsidis.com / GN Kalaitsidis Capital branding; owner wrote "KALAISTIDIS" — verify against preferred public form). Greek: `Νοντάρι Καλαϊτσίδης`; Russian: `Нонтари Калаицидис` — confirm preferred transliterations.
- `TODO(photo)`: optional principal photo for §4.3 — recommended but not required for launch.
