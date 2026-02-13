/* JetSet Landing v2
   - Dark mode toggle (localStorage)
   - EN/RU language switch
   - Lead form: Formspree (optional) or mailto fallback
*/

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

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
      "top.licensed": "Licensed Cyprus travel agency · Tourism License <strong>7775</strong>",
      "top.iata": "IATA Accredited <strong>14200130</strong>",
      "top.support": "24/7 disruption support for time‑critical trips",

      "nav.services": "Services",
      "nav.trust": "Trust",
      "nav.reviews": "Reviews",
      "nav.contact": "Contact",
      "nav.cta": "Get a Quote",

      "hero.kicker": "Corporate & luxury travel · Paphos, Cyprus",
      "hero.title": "Corporate Travel Agency in Paphos, Cyprus.<br class='hidden sm:block'><span class='text-jetgoldSoft'>Luxury Travel Concierge Cyprus</span>.",
      "hero.sub": "Executive itineraries, corporate invoices, and clear fare rules from one senior team. When disruption hits, we rebook fast and keep your plans moving.",
      "hero.b1": "<strong>Executive speed</strong> from brief to confirmed itinerary.",
      "hero.b2": "<strong>Finance‑ready</strong> invoices and supporting documents.",
      "hero.b3": "<strong>Fare-rule clarity</strong> before ticketing and during changes.",
      "hero.b4": "<strong>24/7 disruption handling</strong> for delays, cancellations, missed links.",
      "hero.cta1": "Get a Quote",
      "hero.cta2": "WhatsApp",
      "hero.micro": "Licensed Cyprus travel agency · IATA Accredited · Tourism License 7775 · Reg. HE 181550",

      "tool.kicker": "Quick booking",
      "tool.title": "Quick booking",
      "tool.sub": "Book via our Trip.com partner widget. For corporate routing, changes, and complex trips — request a quote.",
      "tool.badge": "Partner offer",
      "tool.partnerLabel": "Partner offer",
      "tool.load": "Load offers",
      "tool.note": "Partner offer powered by Trip.com (affiliate). Availability and pricing are managed on Trip.com.",
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
      "proof.badgesK": "Accreditations",
      "proof.googleT": "Google reviews",
      "proof.googleB": "Open verified reviews and directions on Google.",
      "proof.googleBtn1": "Read Reviews",
      "proof.googleBtn2": "Open Maps",
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
      "cta.btn1": "Request a Quote",
      "cta.btn2": "WhatsApp (Fast)",
      "cta.note": "For urgent changes during travel, WhatsApp is the fastest channel.",

      "contact.kicker": "Contact",
      "contact.title": "Let’s plan your next journey.",
      "contact.sub": "Share your request — we’ll respond with a tailored proposal.",
      "contact.visit": "Visit us",
      "contact.maps": "Open in Google Maps",
      "contact.call": "Call",
      "contact.email": "Email",
      "contact.disclaimer": "Visa assistance is informational/coordination only — final decisions remain with consulates/authorities.",

      "form.title": "Request a quote",
      "form.sub": "Fill this in — we’ll reply fast with 2–3 best options and next steps.",
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
      "form.submit": "Send Request",
      "form.hint": "Tip: for urgent changes during travel, WhatsApp us — we respond faster during disruptions.",

      "m.quote": "Get a Quote",
      "m.wa": "WhatsApp",

      "footer.line": "Corporate & Luxury Travel from Paphos.",
      "footer.services": "Services",
      "footer.trust": "Trust",
      "footer.contact": "Contact",
      "footer.nap": "26A Agapinoros Street, Paphos 8049, Cyprus · +357 99 478073 · +357 99 310993 · info@jetset.com.cy"
    },

    ru: {
      "top.licensed": "Лицензированное турагентство Кипра · Лицензия Туризма <strong>7775</strong>",
      "top.iata": "Аккредитация IATA <strong>14200130</strong>",
      "top.support": "Поддержка 24/7 при срочных изменениях и сбоях",

      "nav.services": "Услуги",
      "nav.trust": "Доверие",
      "nav.reviews": "Отзывы",
      "nav.contact": "Контакты",
      "nav.cta": "Получить предложение",

      "hero.kicker": "Корпоративные и luxury поездки · Пафос, Кипр",
      "hero.title": "Корпоративное турагентство в Пафосе, Кипр.<br class='hidden sm:block'><span class='text-jetgoldSoft'>Luxury Travel Concierge Cyprus</span>.",
      "hero.sub": "Маршруты для руководителей, корпоративные инвойсы и понятные правила тарифов — всё у одной сильной команды. Если в пути сбой, быстро перестраиваем поездку и держим вас в графике.",
      "hero.b1": "<strong>Максимальная скорость</strong> от брифа до подтверждённого маршрута.",
      "hero.b2": "<strong>Документы для финансов</strong>: инвойсы и полный пакет подтверждений.",
      "hero.b3": "<strong>Прозрачные правила тарифов</strong> до выписки и при изменениях.",
      "hero.b4": "<strong>24/7 при сбоях</strong>: задержки, отмены, сорванные стыковки.",
      "hero.cta1": "Получить расчёт",
      "hero.cta2": "WhatsApp",
      "hero.micro": "Лицензия Кипра · IATA · Лицензия 7775 · Рег. HE 181550",

      "tool.kicker": "Быстрое бронирование",
      "tool.title": "Быстрое бронирование",
      "tool.sub": "Бронируйте через партнёрский виджет Trip.com. Для корпоративных маршрутов, изменений и сложных задач — запросите расчёт.",
      "tool.badge": "Партнёрское предложение",
      "tool.note": "Партнёрское предложение Trip.com (affiliate). Наличие и цены управляются на стороне Trip.com.",

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

      "proof.kicker": "Доверие",
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
      "proof.badgesK": "Аккредитации",
      "proof.googleT": "Отзывы Google",
      "proof.googleB": "Откройте проверенные отзывы и маршрут на Google.",
      "proof.googleBtn1": "Читать отзывы",
      "proof.googleBtn2": "Открыть карты",
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
      "cta.btn1": "Запросить расчёт",
      "cta.btn2": "WhatsApp (быстро)",
      "cta.note": "Если срочно — WhatsApp самый быстрый канал.",

      "contact.kicker": "Контакты",
      "contact.title": "Спланируем вашу поездку.",
      "contact.sub": "Опишите запрос — ответим с персональным предложением.",
      "contact.visit": "Адрес",
      "contact.maps": "Открыть в Google Maps",
      "contact.call": "Телефон",
      "contact.email": "Email",
      "contact.disclaimer": "Помощь по визам — консультация/координация. Решение принимает консульство/власти.",

      "form.title": "Запросить расчёт",
      "form.sub": "Заполните форму — быстро отправим 2–3 лучших варианта и шаги.",
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
      "form.submit": "Отправить",
      "form.hint": "Если срочно во время поездки — пишите в WhatsApp, отвечаем быстрее.",

      "m.quote": "Запросить расчёт",
      "m.wa": "WhatsApp",
      "service.areaTitle": "Зона обслуживания:",
      "service.areaBody": "Пафос • Кипр (поддержка по всей стране)",
      "tool.partnerLabel": "Партнёрское предложение",
      "tool.load": "Загрузить предложения",
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

  function setLanguage(lang) {
    const safe = T[lang] ? lang : "en";
    document.documentElement.lang = safe === "ru" ? "ru" : "en";
    localStorage.setItem("jetset_lang", safe);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", safe);
    window.history.replaceState({}, "", url);

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
      el.innerHTML = val;
    });
  }

  $$(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => setLanguage(btn.getAttribute("data-lang")));
  });

  function initLanguage() {
    const param = new URLSearchParams(window.location.search).get("lang");
    if (param && T[param]) return setLanguage(param);
    const saved = localStorage.getItem("jetset_lang");
    if (saved) return setLanguage(saved);
    const nav = (navigator.language || "").toLowerCase();
    setLanguage(nav.startsWith("ru") ? "ru" : "en");
  }

  // =========================
  // Lead form (Formspree or mailto)
  // =========================
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function postFormspree(payload) {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  }

  function getMailtoHref(payload) {
    const subject = `WEBSITE ENQUIRY: ${payload.type || "Travel"} — ${payload.name || ""}`.trim();
    const body = [
      `Name: ${payload.name || ""}`,
      `Phone/WhatsApp: ${payload.phone || ""}`,
      `Email: ${payload.email || ""}`,
      `Type: ${payload.type || ""}`,
      `Route: ${payload.route || ""}`,
      `Dates: ${payload.dates || ""}`,
      "",
      "Message:",
      payload.message || "",
    ].join("\n");

    return `mailto:${encodeURIComponent(EMAIL_TO)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
        statusEl.innerHTML = `${text} ${tr("form.manual", "If your email app did not open, use this link:")} <a class="underline font-bold" href="${mailtoHref}">${tr("form.mailLink", "Open email app")}</a>`;
        return;
      }
    }

    statusEl.classList.add("text-slate-700", "dark:text-slate-200");
    statusEl.textContent = text;
  }

  $("#leadForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
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

    const status = $("#formStatus");
    const btn = $("#submitBtn");
    const mailtoHref = getMailtoHref(payload);
    const fieldRefs = [$("#name"), $("#phone"), $("#email"), $("#message")];
    fieldRefs.forEach((field) => setFieldError(field, false));
    if (status) status.textContent = "";
    if (btn) btn.disabled = true;

    if (!payload.name) { setFieldError($("#name"), true); setFormStatus(status, "warn", tr("form.errName", "Please enter your name.")); if (btn) btn.disabled = false; return; }
    if (!payload.phone && !payload.email) { setFieldError($("#phone"), true); setFieldError($("#email"), true); setFormStatus(status, "warn", tr("form.errContact", "Please add at least a phone or email.")); if (btn) btn.disabled = false; return; }
    if (payload.email && !isValidEmail(payload.email)) { setFieldError($("#email"), true); setFormStatus(status, "warn", tr("form.errEmail", "Please enter a valid email.")); if (btn) btn.disabled = false; return; }
    if (!payload.message) { setFieldError($("#message"), true); setFormStatus(status, "warn", tr("form.errMessage", "Please write a short message.")); if (btn) btn.disabled = false; return; }

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


  function loadTripWidget() {
    const holder = $("#tripWidget");
    if (!holder || holder.getAttribute("data-loaded") === "1") return;
    const src = holder.getAttribute("data-trip-src");
    if (!src) return;
    const desktop = holder.querySelector("[data-trip-desktop]");
    const mobile = holder.querySelector("[data-trip-mobile]");
    const makeFrame = (width, height, id) => {
      const iframe = document.createElement("iframe");
      iframe.setAttribute("border", "0");
      iframe.src = src;
      iframe.id = id;
      iframe.width = String(width);
      iframe.height = String(height);
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("scrolling", "no");
      iframe.loading = "lazy";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.style.border = "none";
      iframe.style.display = "block";
      iframe.style.width = "100%";
      iframe.title = "Trip.com partner booking";
      iframe.allow = "clipboard-write; geolocation *";
      return iframe;
    };
    if (desktop) desktop.appendChild(makeFrame(900, 200, "S11839970"));
    if (mobile) mobile.appendChild(makeFrame(320, 320, "S11839970m"));
    holder.setAttribute("data-loaded", "1");
    const loadBtn = $("#loadTripWidget");
    if (loadBtn) loadBtn.classList.add("hidden");
  }

  function initSegmentTabs() {
    const tabs = $$('[data-segment-tab]');
    const panels = $$('[data-segment-panel]');
    if (!tabs.length || !panels.length) return;

    const getIndexBySegment = (segment) => tabs.findIndex((tab) => tab.getAttribute('data-segment-tab') === segment);

    const setActive = (segment) => {
      tabs.forEach((tab) => {
        const isActive = tab.getAttribute('data-segment-tab') === segment;
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tab.setAttribute('tabindex', isActive ? '0' : '-1');
        tab.classList.toggle('bg-jetgold', isActive);
        tab.classList.toggle('text-slate-900', isActive);
        tab.classList.toggle('shadow-soft', isActive);
        tab.classList.toggle('text-slate-500', !isActive);
        tab.classList.toggle('dark:text-slate-300', !isActive);
      });

      panels.forEach((panel) => {
        const isActive = panel.getAttribute('data-segment-panel') === segment;
        panel.classList.toggle('hidden', !isActive);
        panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });
    };

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => setActive(tab.getAttribute('data-segment-tab')));
      tab.addEventListener('keydown', (event) => {
        const currentSegment = tab.getAttribute('data-segment-tab');
        const currentIndex = getIndexBySegment(currentSegment);
        if (currentIndex < 0) return;

        let nextIndex = currentIndex;
        if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
        if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = tabs.length - 1;
        if (nextIndex === currentIndex) return;

        event.preventDefault();
        const nextTab = tabs[nextIndex];
        const segment = nextTab.getAttribute('data-segment-tab');
        setActive(segment);
        nextTab.focus();
      });
    });

    setActive('corporate');
  }

  // =========================
  // Image fallbacks
  // =========================
  function setImgFallback(img, paths) {
    if (!img) return;
    let i = 0;
    function tryNext() { if (i >= paths.length) return; img.src = paths[i++]; }
    img.addEventListener("error", () => tryNext());
  }

  setImgFallback($("#brandLogo"), ["./jetset-logo.jpg", "./logo.jpg", "./logo.png"]);
  setImgFallback($("#iataBadge"), ["./iata-logo.jpg", "./iata.jpg", "./iata.png"]);
  setImgFallback($("#tourismBadge"), ["./tourism-logo.jpg", "./tourism.jpg", "./tourism.png"]);

  // =========================
  // Footer year
  // =========================
  function setYear() {
    const y = $("#year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  async function setBuildStamp() {
    const stamp = $("#buildStamp");
    if (!stamp) return;

    try {
      const res = await fetch("./version.json", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const version = data.version || "unknown";
      const deployedAt = data.deployedAt ? new Date(data.deployedAt).toISOString().slice(0, 16).replace("T", " ") + " UTC" : "unknown";
      stamp.textContent = `${version} · ${deployedAt}`;
    } catch (_err) {
      stamp.textContent = "local";
    }
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
    initSegmentTabs();
    setYear();
    setBuildStamp();

    $("#darkToggle")?.addEventListener("click", () => setDark(!document.documentElement.classList.contains("dark")));
    $("#darkToggleMobile")?.addEventListener("click", () => setDark(!document.documentElement.classList.contains("dark")));

    $("#loadTripWidget")?.addEventListener("click", loadTripWidget);
  });
})();
