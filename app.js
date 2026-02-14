/* JetSet Landing v2
   - Dark mode toggle (localStorage)
   - EN/RU language switch
   - Lead form: Formspree (optional) or mailto fallback
*/

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const {
    buildMailtoHref,
    sanitizeRichText,
    validateLeadPayload,
  } = window.JetsetUtils || {};

  // =========================
  // Config (EDIT THESE)
  // =========================
  // If you want real form submissions (recommended), create a Formspree form and paste endpoint:
  // Example: https://formspree.io/f/abcdwxyz
  const FORMSPREE_ENDPOINT = ""; // <- paste your Formspree endpoint here (optional)

  const EMAIL_TO = "info@jetset.com.cy";

  // =========================
  // Dark mode
  // =========================
  function setDark(enabled) {
    document.documentElement.classList.toggle("dark", !!enabled);
    localStorage.setItem("jetset_dark", enabled ? "1" : "0");
  }

  function initDark() {
    const saved = localStorage.getItem("jetset_dark");
    if (saved === "1") return setDark(true);
    if (saved === "0") return setDark(false);
    setDark(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }

  // =========================
  // Mobile menu
  // =========================
  const menuBtn = $("#menuBtn");
  const mobileMenu = $("#mobileMenu");

  function closeMenu() {
    mobileMenu?.classList.add("hidden");
    menuBtn?.setAttribute("aria-expanded", "false");
  }

  function toggleMenu() {
    const isOpen = mobileMenu?.classList.toggle("hidden") === false;
    menuBtn?.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  menuBtn?.addEventListener("click", toggleMenu);
  $$("#mobileMenu a").forEach((a) => a.addEventListener("click", closeMenu));

  // =========================
  // i18n (EN/RU)
  // =========================
  const T = {
    en: {
      "top.licensed": "Licensed Cyprus travel agency · License 7775",
      "top.iata": "IATA Accreditation 14200130",
      "top.support": "24/7 support for urgent travel changes and disruptions",

      "nav.services": "Services",
      "nav.trust": "Trust",
      "nav.reviews": "Reviews",
      "nav.contact": "Contact",
      "nav.cta": "Get a Quote",

      "hero.kicker": "Corporate and premium travel · Paphos, Cyprus",
      "hero.title": "Corporate Travel Management in Cyprus — Fast Quotes, Clean Invoices, 24/7 Support",
      "hero.sub": "From executive trips to urgent changes, we deliver fast quotes, compliant paperwork, and always-on support.",
      "hero.b1": "Fast quotes for executive and team trips.",
      "hero.b2": "Clean invoices ready for finance processing.",
      "hero.b3": "Transparent fare rules before approval.",
      "hero.b4": "24/7 support during delays and cancellations.",
      "hero.cta1": "Get a Quote",
      "hero.cta2": "WhatsApp (Fast)",
      "hero.micro": "Licensed Cyprus travel agency · IATA Accredited · Tourism License 7775 · Reg. HE 181550",

      "service.areaTitle": "Service Area:",
      "service.areaBody": "Paphos • Cyprus (Nationwide support)",
      "form.errName": "Please enter your name.",
      "form.errContact": "Please add at least a phone or email.",
      "form.errEmail": "Please enter a valid email.",
      "form.errMessage": "Please write a short message.",
      "form.sending": "Sending...",
      "form.sent": "✅ Sent! We will contact you shortly.",
      "form.fallback": "⚠️ Could not send via form. Opening email instead...",
      "form.opening": "Opening email...",
      "form.error": "⚠️ Error. Opening email instead...",
      "form.manual": "If your email app did not open, use this link:",
      "form.mailLink": "Open email app",

      "trusted.kicker": "Trusted by",
      "trusted.title": "Busy teams who can’t afford travel mistakes.",
      "trusted.sub": "We support executives, SMEs, and premium travellers — with speed, documentation, and accountability.",
      "trusted.1": "Law firms",
      "trusted.2": "Real estate",
      "trusted.3": "Clinics",
      "trusted.4": "IT teams",
      "trusted.5": "Finance",
      "trusted.6": "Sports travel",

      "services.kicker": "Services",
      "services.title": "Everything you need — handled by one accountable team.",
      "services.sub": "Corporate control + luxury detail. Clear itineraries. Clean documentation. Fast support when plans change.",
      "services.1t": "Flights & complex itineraries",
      "services.1b": "We design efficient routes so your team lands on time, with fare rules explained before you approve.",
      "services.2t": "Corporate travel",
      "services.2b": "We align each trip with your travel policy and deliver invoices your finance team can process immediately.",
      "services.3t": "Hotels & luxury stays",
      "services.3b": "We secure hotels that match your priorities—location, standards, and negotiated value for each stay.",
      "services.4t": "Transfers & mobility",
      "services.4b": "We coordinate transfers to your exact schedule, so every arrival and departure runs without friction.",
      "services.5t": "Visas & insurance",
      "services.5b": "We prepare document checklists and application guidance; final visa and insurance decisions remain with authorities and insurers.",
      "services.6t": "Cruises & curated trips",
      "services.6b": "We plan complex leisure itineraries with premium pacing, private add-ons, and one accountable coordinator.",

      "faq.kicker": "FAQ",
      "faq.title": "Practical answers before you book.",
      "faq.sub": "Clear terms. Fast communication. No surprises.",
      "faq.q1": "Do you issue corporate invoices?",
      "faq.a1": "Yes. We issue corporate invoices with the details your finance team needs, including passenger and route references.",
      "faq.q2": "Can you split invoices by traveler, project, or cost center?",
      "faq.a2": "Yes. Tell us your structure in advance, and we format invoices for your internal workflow.",
      "faq.q3": "What happens if a flight changes or is cancelled?",
      "faq.a3": "We manage disruption handling: rebooking options, fare-rule checks, and clear next steps for each traveler.",
      "faq.q4": "Can you help with voluntary flight changes?",
      "faq.a4": "Absolutely. We explain penalties and fare differences first, then process the best available change option.",
      "faq.q5": "Do you provide visa support?",
      "faq.a5": "Yes, as an informational service: we guide documents and process steps. Final visa decisions are made only by consulates or migration authorities.",
      "faq.q6": "How fast do you respond?",
      "faq.a6": "Most requests get an initial response the same business day. Urgent in-trip issues are prioritized on WhatsApp.",
      "faq.q7": "Can you work within our corporate travel policy?",
      "faq.a7": "Yes. Share your policy rules and approval flow, and we propose options that match your compliance requirements.",

      "proof.kicker": "Trust",
      "proof.title": "Licensed, accountable, and documentation‑ready.",
      "proof.sub": "For corporate travel, we keep everything clean: invoices, receipts, fare rules, and clear itineraries.",
      "proof.iataT": "IATA Accredited",
      "proof.iataB": "IATA License No.: <strong>14200130</strong>",
      "proof.regT": "Registered Company",
      "proof.regB": "Reg. No.: <strong>HE 181550</strong>",
      "proof.tourT": "Tourism License",
      "proof.tourB": "Deputy Ministry of Tourism: <strong>7775</strong>",
      "proof.supportT": "Real support",
      "proof.supportB": "24/7 help for time‑critical travel and disruptions.",
      "proof.badgesK": "What this means for your team",
      "proof.note": "Tip: for urgent changes during travel, WhatsApp is the fastest channel.",

      "rev.kicker": "Testimonials",
      "rev.title": "What clients value most",
      "rev.sub": "Short, believable feedback — speed, clarity, and support when it matters.",
      "rev.1q": "“We had a cancellation on a meeting week. JetSet rerouted the team the same day and kept finance happy with clean documentation.”",
      "rev.1b": "Operations Manager · Corporate client",
      "rev.2q": "“They understood our preferences instantly — hotel, transfers, and details. We arrived relaxed, everything was handled.”",
      "rev.2b": "Private client · Luxury leisure",
      "rev.3q": "“Fast response on WhatsApp, clear options, no confusion. When plans changed, the solution was already in motion.”",
      "rev.3b": "Founder · SME client",
      "rev.ctaT": "Want to see verified reviews? Open Google and browse recent feedback.",
      "rev.ctaB": "Open Google Reviews",

      "cta.title": "Ready for a trip that runs smoothly?",
      "cta.sub": "Send route + dates + budget. We’ll reply with the best options and clear rules — no confusion.",
      "cta.btn1": "Get a Quote",
      "cta.btn2": "WhatsApp (Fast)",
      "cta.note": "For urgent changes during travel, WhatsApp is the fastest channel.",

      "contact.kicker": "Contact",
      "contact.title": "Let’s plan your next journey.",
      "contact.sub": "Share your request — we’ll respond with a tailored proposal.",
      "contact.visit": "Visit us",
      "contact.maps": "Open in Google Maps",
      "contact.call": "Call",
      "contact.email": "Email",
      "contact.disclaimer": "Visa support is informational/coordination only — final decisions are made by consulates/authorities.",

      "form.title": "Request a quote",
      "form.sub": "Fill this in — we’ll reply quickly with 2–3 best options and terms.",
      "form.name": "Name",
      "form.phone": "Phone / WhatsApp",
      "form.email": "Email",
      "form.type": "Travel type",
      "form.type1": "Corporate",
      "form.type2": "Luxury / Leisure",
      "form.type3": "Group / Event",
      "form.route": "Route",
      "form.dates": "Dates",
      "form.msg": "Message",
      "form.submit": "Get a Quote",
      "form.hint": "For urgent travel changes, WhatsApp is the fastest channel.",

      "m.quote": "Get a Quote",
      "m.wa": "WhatsApp (Fast)",

      "quick.title": "Quick Quote",
      "quick.name": "Name",
      "quick.phone": "Phone / WhatsApp",
      "quick.route": "Route + Dates",
      "quick.namePlaceholder": "Your name",
      "quick.phonePlaceholder": "+357...",
      "quick.routePlaceholder": "LCA-LON · 12-15 Mar",
      "quick.errorPhone": "Please enter phone or WhatsApp.",
      "how.kicker": "How it works",
      "how.title": "Simple process. Fast decisions.",
      "how.s1": "Step 1",
      "how.s1t": "Send your request",
      "how.s1b": "Share route, dates, traveller count, and preferences.",
      "how.s2": "Step 2",
      "how.s2t": "Receive 2–3 options",
      "how.s2b": "We return clear options with pricing and fare rules.",
      "how.s3": "Step 3",
      "how.s3t": "Confirm + documentation",
      "how.s3b": "Approve your choice and receive booking details and paperwork.",
      "form.namePlaceholder": "Your name",
      "form.phonePlaceholder": "+357...",
      "form.emailPlaceholder": "you@company.com",
      "form.routePlaceholder": "e.g., LCA-LON-NYC",
      "form.datesPlaceholder": "e.g., 12-15 Mar",
      "form.msgPlaceholder": "Passengers, baggage, budget, flexibility, hotel preferences, invoicing requirements...",
      "meta.title": "Corporate Travel Management in Cyprus — Fast Quotes, Clean Invoices, 24/7 Support",
      "meta.description": "Corporate travel management in Cyprus with fast quotes, clean invoices, and 24/7 support for urgent changes.",
      "footer.line": "Corporate & Luxury Travel from Paphos.",
      "footer.services": "Services",
      "footer.trust": "Trust",
      "footer.contact": "Contact",
      "footer.nap": "26A Agapinoros Street, Paphos 8049, Cyprus · +357 99 478073 · +357 99 310993 · info@jetset.com.cy"
    },

    ru: {
      "top.licensed": "Лицензированное туристическое агентство Кипра · Лицензия 7775",
      "top.iata": "Аккредитация IATA 14200130",
      "top.support": "Поддержка 24/7 при срочных поездках и сбоях",

      "nav.services": "Услуги",
      "nav.trust": "Доверие",
      "nav.reviews": "Отзывы",
      "nav.contact": "Контакты",
      "nav.cta": "Получить расчёт",

      "hero.kicker": "Корпоративные и премиальные поездки · Пафос, Кипр",
      "hero.title": "Корпоративные поездки на Кипре — быстрые расчёты, корректные счета, поддержка 24/7",
      "hero.sub": "Мы ведём маршруты, документы и срочные изменения, чтобы ваша команда путешествовала без сбоев.",
      "hero.b1": "Быстрые расчёты для команд и руководителей.",
      "hero.b2": "Корректные счета для бухгалтерии.",
      "hero.b3": "Прозрачные тарифные правила до подтверждения.",
      "hero.b4": "Поддержка 24/7 при задержках и отменах.",
      "hero.cta1": "Получить расчёт",
      "hero.cta2": "WhatsApp (быстро)",
      "hero.micro": "Лицензия Кипра · IATA · Лицензия 7775 · Рег. HE 181550",


      "trusted.kicker": "Нам доверяют",
      "trusted.title": "Команды, которые не могут позволить себе ошибки в поездках.",
      "trusted.sub": "Работаем с руководителями, компаниями и VIP‑клиентами — быстро, чётко и с ответственностью.",
      "trusted.1": "Юристы",
      "trusted.2": "Недвижимость",
      "trusted.3": "Клиники",
      "trusted.4": "IT",
      "trusted.5": "Финансы",
      "trusted.6": "Спорт-поездки",

      "services.kicker": "Услуги",
      "services.title": "Всё необходимое — под ключ и с одним ответственным менеджером.",
      "services.sub": "Корпоративная точность + luxury детализация. Понятные маршруты. Чистые документы. Быстрая поддержка.",
      "services.1t": "Авиабилеты и сложные маршруты",
      "services.1b": "Проектируем эффективные маршруты, чтобы команда прилетала вовремя, а правила тарифа были понятны до оплаты.",
      "services.2t": "Корпоративные поездки",
      "services.2b": "Подстраиваем поездки под вашу корпоративную политику и выдаём инвойсы, удобные для быстрой обработки в бухгалтерии.",
      "services.3t": "Отели и luxury размещение",
      "services.3b": "Подбираем отели под ваши приоритеты: локация, уровень сервиса и выгодные условия по бюджету.",
      "services.4t": "Трансферы и транспорт",
      "services.4b": "Собираем трансферы под ваш точный график, чтобы каждое прибытие и выезд проходили без задержек.",
      "services.5t": "Визы и страховки",
      "services.5b": "Готовим чек-листы документов и сопровождаем процесс; финальное решение по визам и страховкам принимают только консульства и страховые компании.",
      "services.6t": "Круизы и индивидуальные туры",
      "services.6b": "Планируем сложные leisure-маршруты с премиальным темпом, приватными опциями и единым ответственным менеджером.",

      "faq.kicker": "FAQ",
      "faq.title": "Коротко о важном перед бронированием.",
      "faq.sub": "Чёткие условия. Быстрая связь. Без сюрпризов.",
      "faq.q1": "Вы выставляете корпоративные инвойсы?",
      "faq.a1": "Да. Мы выставляем корпоративные инвойсы со всеми деталями, которые нужны вашей финансовой команде, включая данные пассажиров и маршрутов.",
      "faq.q2": "Можно разделить инвойсы по сотрудникам, проектам или cost center?",
      "faq.a2": "Да. Сообщите структуру заранее, и мы оформим инвойсы под ваш внутренний процесс.",
      "faq.q3": "Что происходит, если рейс перенесли или отменили?",
      "faq.a3": "Мы берём на себя работу со сбоями: варианты перебронирования, проверка правил тарифа и чёткие дальнейшие шаги для каждого пассажира.",
      "faq.q4": "Помогаете с добровольными изменениями рейсов?",
      "faq.a4": "Да. Сначала объясняем штрафы и разницу в тарифах, затем оформляем оптимальный вариант изменения.",
      "faq.q5": "Вы помогаете с визами?",
      "faq.a5": "Да, как информационный сервис: подсказываем по документам и этапам подачи. Финальное решение по визе принимает только консульство или миграционные органы.",
      "faq.q6": "Как быстро вы отвечаете?",
      "faq.a6": "По большинству запросов даём первичный ответ в тот же рабочий день. Срочные вопросы в поездке приоритетно ведём в WhatsApp.",
      "faq.q7": "Работаете по нашей корпоративной travel policy?",
      "faq.a7": "Да. Передайте правила политики и схему согласования, и мы предложим варианты в рамках ваших требований.",

      "proof.kicker": "Надёжность",
      "proof.title": "Лицензия, ответственность и документы — всё официально.",
      "proof.sub": "Для корпоративных клиентов: инвойсы, подтверждения, правила тарифа и понятный маршрут.",
      "proof.iataT": "Аккредитация IATA",
      "proof.iataB": "Номер IATA: <strong>14200130</strong>",
      "proof.regT": "Регистрация компании",
      "proof.regB": "Рег. №: <strong>HE 181550</strong>",
      "proof.tourT": "Лицензия Туризма",
      "proof.tourB": "Лицензия: <strong>7775</strong>",
      "proof.supportT": "Поддержка",
      "proof.supportB": "Помощь 24/7 при срочных ситуациях и сбоях.",
      "proof.badgesK": "Что это даёт вашей команде",
      "proof.note": "Если нужно срочно — WhatsApp самый быстрый канал.",

      "rev.kicker": "Отзывы",
      "rev.title": "Что клиенты ценят больше всего",
      "rev.sub": "Коротко и по делу — скорость, ясность и поддержка в нужный момент.",
      "rev.1q": "“Во время важной недели отменили рейс. JetSet в тот же день перестроили маршрут и подготовили документы для бухгалтерии.”",
      "rev.1b": "Операционный менеджер · корпоративный клиент",
      "rev.2q": "“Сразу поняли наши предпочтения — отель, трансферы, детали. Мы приехали спокойно: всё было организовано.”",
      "rev.2b": "Частный клиент · luxury отдых",
      "rev.3q": "“Быстрые ответы в WhatsApp, понятные варианты, без путаницы. При изменениях решение уже было в работе.”",
      "rev.3b": "Владелец бизнеса · SME",
      "rev.ctaT": "Хотите увидеть проверенные отзывы? Откройте Google и посмотрите свежие.",
      "rev.ctaB": "Открыть отзывы Google",

      "cta.title": "Готовы к поездке без стресса?",
      "cta.sub": "Отправьте маршрут + даты + бюджет. Мы быстро вернём 2–3 лучших варианта и правила тарифа.",
      "cta.btn1": "Получить расчёт",
      "cta.btn2": "WhatsApp (быстро)",
      "cta.note": "Если срочно — WhatsApp самый быстрый канал.",

      "contact.kicker": "Контакты",
      "contact.title": "Спланируем вашу поездку.",
      "contact.sub": "Опишите запрос — ответим с персональным предложением.",
      "contact.visit": "Адрес",
      "contact.maps": "Открыть в Google Maps",
      "contact.call": "Телефон",
      "contact.email": "Email",
      "contact.disclaimer": "Визовая поддержка носит информационный/координационный характер — окончательные решения принимают консульства/органы.",

      "form.title": "Запросить расчёт",
      "form.sub": "Заполните — ответим быстро с 2–3 лучшими вариантами и условиями.",
      "form.name": "Имя",
      "form.phone": "Телефон / WhatsApp",
      "form.email": "Email",
      "form.type": "Тип поездки",
      "form.type1": "Корпоративная",
      "form.type2": "Luxury / отдых",
      "form.type3": "Группа / событие",
      "form.route": "Маршрут",
      "form.dates": "Даты",
      "form.msg": "Сообщение",
      "form.submit": "Получить расчёт",
      "form.hint": "Для срочных изменений в поездке быстрее всего писать в WhatsApp.",

      "m.quote": "Получить расчёт",
      "m.wa": "WhatsApp (быстро)",
      "service.areaTitle": "Зона обслуживания:",
      "service.areaBody": "Пафос • Кипр (поддержка по всей стране)",
      "form.errName": "Пожалуйста, укажите имя.",
      "form.errContact": "Укажите хотя бы телефон или email.",
      "form.errEmail": "Пожалуйста, укажите корректный email.",
      "form.errMessage": "Пожалуйста, добавьте короткое сообщение.",
      "form.sending": "Отправляем...",
      "form.sent": "✅ Отправлено! Мы скоро с вами свяжемся.",
      "form.fallback": "⚠️ Не удалось отправить форму. Открываем email...",
      "form.opening": "Открываем email...",
      "form.error": "⚠️ Ошибка. Открываем email...",
      "form.manual": "Если почтовое приложение не открылось, используйте ссылку:",
      "form.mailLink": "Открыть почтовое приложение",

      "quick.title": "Быстрый расчёт",
      "quick.name": "Имя",
      "quick.phone": "Телефон / WhatsApp",
      "quick.route": "Маршрут + даты",
      "quick.namePlaceholder": "Ваше имя",
      "quick.phonePlaceholder": "+357...",
      "quick.routePlaceholder": "LCA-LON · 12-15 Мар",
      "quick.errorPhone": "Укажите телефон или WhatsApp.",
      "how.kicker": "Как это работает",
      "how.title": "Простой процесс. Быстрые решения.",
      "how.s1": "Шаг 1",
      "how.s1t": "Отправьте запрос",
      "how.s1b": "Укажите маршрут, даты, число пассажиров и пожелания.",
      "how.s2": "Шаг 2",
      "how.s2t": "Получите 2–3 варианта",
      "how.s2b": "Мы вернём понятные варианты с ценами и правилами тарифа.",
      "how.s3": "Шаг 3",
      "how.s3t": "Подтверждение + документы",
      "how.s3b": "Утверждаете вариант и получаете бронирования и документы.",
      "form.namePlaceholder": "Ваше имя",
      "form.phonePlaceholder": "+357...",
      "form.emailPlaceholder": "you@company.com",
      "form.routePlaceholder": "например, LCA-LON-NYC",
      "form.datesPlaceholder": "например, 12-15 Мар",
      "form.msgPlaceholder": "Пассажиры, багаж, бюджет, гибкость, пожелания по отелю, требования к инвойсам...",
      "meta.title": "Корпоративные поездки на Кипре — быстрые расчёты, корректные счета, поддержка 24/7",
      "meta.description": "Корпоративные и премиальные поездки на Кипре: быстрые расчёты, корректные счета и поддержка 24/7.",
      "footer.line": "Корпоративные и luxury поездки из Пафоса.",
      "footer.services": "Услуги",
      "footer.trust": "Доверие",
      "footer.contact": "Контакты",
      "footer.nap": "ул. Агапинорос 26A, Пафос 8049, Кипр · +357 99 478073 · +357 99 310993 · info@jetset.com.cy"
    }
  };


  function tr(key, fallback = "") {
    const lang = document.documentElement.lang === "ru" ? "ru" : "en";
    return T[lang]?.[key] || fallback;
  }

  function updateLanguageLinks(lang) {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState({}, "", url);

    const enUrl = new URL(window.location.href);
    enUrl.searchParams.set("lang", "en");
    const ruUrl = new URL(window.location.href);
    ruUrl.searchParams.set("lang", "ru");

    const links = document.querySelectorAll('nav[aria-label="Language versions"] a');
    if (links[0]) links[0].setAttribute("href", `${enUrl.pathname}${enUrl.search}${enUrl.hash}`);
    if (links[1]) links[1].setAttribute("href", `${ruUrl.pathname}${ruUrl.search}${ruUrl.hash}`);
  }

  function setLanguage(lang) {
    const safe = T[lang] ? lang : "en";
    document.documentElement.lang = safe;
    localStorage.setItem("jetset_lang", safe);
    updateLanguageLinks(safe);

    $$(".lang-btn").forEach((b) => {
      const isActive = b.getAttribute("data-lang") === safe;
      b.classList.toggle("bg-jetgold", isActive);
      b.classList.toggle("text-slate-900", isActive);
      if (isActive) b.classList.add("shadow-soft");
      else b.classList.remove("shadow-soft");
      b.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = T[safe][key];
      if (val == null) return;
      el.innerHTML = typeof sanitizeRichText === "function" ? sanitizeRichText(val) : val;
    });

    $$("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const val = T[safe][key];
      if (val != null) el.setAttribute("placeholder", val);
    });

    document.title = tr("meta.title", document.title);
    const descEl = document.getElementById("pageDescription") || document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute("content", tr("meta.description", descEl.getAttribute("content") || ""));
  }

  $$(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => setLanguage(btn.getAttribute("data-lang")));
  });

  function initLanguage() {
    const param = new URLSearchParams(window.location.search).get("lang");
    if (param && T[param]) return setLanguage(param);
    setLanguage("en");
  }

  // =========================
  // Lead form (Formspree or mailto)
  // =========================
  async function postFormspree(payload) {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  }

  function getMailtoHref(payload) {
    return typeof buildMailtoHref === "function"
      ? buildMailtoHref(EMAIL_TO, payload)
      : `mailto:${encodeURIComponent(EMAIL_TO)}`;
  }

  function setFieldError(field, hasError) {
    if (!field) return;
    field.setAttribute("aria-invalid", hasError ? "true" : "false");
    field.classList.toggle("border-jetcoral", hasError);
    field.classList.toggle("ring-2", hasError);
    field.classList.toggle("ring-jetcoral/30", hasError);
  }

  function setFormStatus(statusEl, type, text, mailtoHref = "") {
    if (!statusEl) return;
    statusEl.classList.remove("text-emerald-700", "dark:text-emerald-300", "text-amber-700", "dark:text-amber-300", "text-slate-700", "dark:text-slate-200");

    if (type === "success") {
      statusEl.classList.add("text-emerald-700", "dark:text-emerald-300");
      statusEl.textContent = text;
      return;
    }

    if (type === "warn") {
      statusEl.classList.add("text-amber-700", "dark:text-amber-300");
      if (mailtoHref) {
        statusEl.textContent = `${text} ${tr("form.manual", "If your email app did not open, use this link:")} `;
        const link = document.createElement("a");
        link.className = "underline font-bold";
        link.href = mailtoHref;
        link.textContent = tr("form.mailLink", "Open email app");
        statusEl.appendChild(link);
        return;
      }
    }

    statusEl.classList.add("text-slate-700", "dark:text-slate-200");
    statusEl.textContent = text;
  }

  function getLeadPayload() {
    return {
      name: ($("#name")?.value || "").trim(),
      phone: ($("#phone")?.value || "").trim(),
      email: ($("#email")?.value || "").trim(),
      type: ($("#type")?.value || "").trim(),
      route: ($("#route")?.value || "").trim(),
      dates: ($("#dates")?.value || "").trim(),
      message: ($("#message")?.value || "").trim(),
      page: location.href,
      timestamp: new Date().toISOString(),
    };
  }

  function applyValidationErrors(errorKey, status, btn) {
    const fieldMap = {
      "form.errName": ["#name"],
      "form.errContact": ["#phone", "#email"],
      "form.errEmail": ["#email"],
      "form.errMessage": ["#message"],
    };

    (fieldMap[errorKey] || []).forEach((selector) => setFieldError($(selector), true));
    setFormStatus(status, "warn", tr(errorKey));
    if (btn) btn.disabled = false;
  }

  function initHeroQuickForm() {
    const form = $("#heroQuickForm");
    if (!form) return;

    const quickName = $("#quickName");
    const quickPhone = $("#quickPhone");
    const quickRoute = $("#quickRoute");
    const errorEl = $("#heroQuickError");
    const waBtn = $("#quickWhatsApp");

    const updateWhatsAppLink = () => {
      const message = [
        "Hello JetSet, I need a quote.",
        `Name: ${(quickName?.value || "").trim() || "-"}`,
        `Phone/WhatsApp: ${(quickPhone?.value || "").trim() || "-"}`,
        `Route + Dates: ${(quickRoute?.value || "").trim() || "-"}`,
      ].join("\n");
      if (waBtn) waBtn.href = `https://wa.me/35799478073?text=${encodeURIComponent(message)}`;
    };

    [quickName, quickPhone, quickRoute].forEach((input) => input?.addEventListener("input", updateWhatsAppLink));
    updateWhatsAppLink();

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!quickPhone?.value.trim()) {
        if (errorEl) errorEl.textContent = tr("quick.errorPhone", "Please enter phone or WhatsApp.");
        quickPhone?.focus();
        return;
      }

      if (errorEl) errorEl.textContent = "";
      if ($("#name") && quickName?.value.trim()) $("#name").value = quickName.value.trim();
      if ($("#phone")) $("#phone").value = quickPhone.value.trim();
      if ($("#route") && quickRoute?.value.trim()) $("#route").value = quickRoute.value.trim();

      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  $("#leadForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = getLeadPayload();

    const status = $("#formStatus");
    const btn = $("#submitBtn");
    const mailtoHref = getMailtoHref(payload);
    const fieldRefs = [$("#name"), $("#phone"), $("#email"), $("#message")];
    fieldRefs.forEach((field) => setFieldError(field, false));
    if (status) status.textContent = "";
    if (btn) btn.disabled = true;

    const errorKey = typeof validateLeadPayload === "function" ? validateLeadPayload(payload) : "";
    if (errorKey) {
      applyValidationErrors(errorKey, status, btn);
      return;
    }

    try {
      if (FORMSPREE_ENDPOINT) {
        setFormStatus(status, "default", tr("form.sending", "Sending..."));
        const ok = await postFormspree(payload);
        if (ok) {
          setFormStatus(status, "success", tr("form.sent", "✅ Sent! We will contact you shortly."));
          $("#leadForm")?.reset();
        } else {
          setFormStatus(status, "warn", tr("form.fallback", "⚠️ Could not send via form. Opening email instead..."), mailtoHref);
          setTimeout(() => { window.location.href = mailtoHref; }, 400);
        }
      } else {
        setFormStatus(status, "warn", tr("form.opening", "Opening email..."), mailtoHref);
        window.location.href = mailtoHref;
      }
    } catch (err) {
      setFormStatus(status, "warn", tr("form.error", "⚠️ Error. Opening email instead..."), mailtoHref);
      setTimeout(() => { window.location.href = mailtoHref; }, 400);
    } finally {
      if (btn) btn.disabled = false;
    }
  });


  // =========================
  // Image fallbacks
  // =========================
  function setImgFallback(img, paths) {
    if (!img) return;
    let i = 0;
    function tryNext() { if (i >= paths.length) return; img.src = paths[i++]; }
    img.addEventListener("error", () => tryNext());
  }

  setImgFallback($("#brandLogo"), ["./jetset-logo.svg", "./jetset-logo.jpg", "./logo.png", "./logo.jpg"]);
  setImgFallback($("#iataBadgeHero"), ["./iata-logo.jpg", "./iata.jpg", "./iata.png"]);
  setImgFallback($("#tourismBadgeHero"), ["./tourism-logo.jpg", "./tourism.jpg", "./tourism.png"]);

  // =========================
  // Footer year
  // =========================
  function setYear() {
    const y = $("#year");
    if (y) y.textContent = String(new Date().getFullYear());
  }


  // =========================
  // Track clicks (optional)
  // =========================
  function track(eventName, params) {
    try { if (typeof gtag === "function") gtag("event", eventName, params || {}); } catch (_) {}
  }

  [
    "ctaQuoteTop","ctaWhatsAppTop","ctaQuoteMid","ctaWhatsAppMid",
    "ctaWhatsAppSide","ctaViberSide","ctaTelegramSide",
    "fabWA","fabViber","fabTG","mQuote","mWA"
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("click", () => track("cta_click", { id }));
  });

  // =========================
  // Init
  // =========================
  document.addEventListener("DOMContentLoaded", () => {
    initDark();
    initLanguage();
    setYear();
    initHeroQuickForm();

    $("#darkToggle")?.addEventListener("click", () => setDark(!document.documentElement.classList.contains("dark")));
    $("#darkToggleMobile")?.addEventListener("click", () => setDark(!document.documentElement.classList.contains("dark")));
  });
})();
