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
      "hero.sub": "Fast quotes, smarter routing, clean documentation, and real support when plans change — flights, hotels, cruises, transfers, visas, and insurance handled by one accountable team.",
      "hero.b1": "<strong>Save hours</strong> on planning + back‑and‑forth.",
      "hero.b2": "<strong>Corporate‑ready</strong> invoices & documentation.",
      "hero.b3": "<strong>Disruption rescue</strong> when flights change.",
      "hero.b4": "<strong>One point of contact</strong> end‑to‑end.",
      "hero.cta1": "Get a Quote",
      "hero.cta2": "WhatsApp",
      "hero.micro": "Licensed Cyprus travel agency · IATA Accredited · Tourism License 7775 · Reg. HE 181550",

      "tool.kicker": "Quick booking",
      "tool.title": "Quick booking",
      "tool.sub": "Book via our Trip.com partner widget. For corporate routing, changes, and complex trips — request a quote.",
      "tool.badge": "Partner offer",
      "tool.partnerLabel": "Partner offer",
      "tool.load": "Load quick booking",
      "tool.note": "Partner widget powered by Trip.com. For negotiated corporate rates and complex itineraries, request a quote.",
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
      "services.1b": "Smart routing, fare rules explained, and fast changes when needed.",
      "services.2t": "Corporate travel",
      "services.2b": "Policy‑friendly documentation, invoicing, and predictable support.",
      "services.3t": "Hotels & luxury stays",
      "services.3b": "From business hotels to 5★ resorts — matched to priorities and budget.",
      "services.4t": "Transfers & mobility",
      "services.4b": "Private transfers, chauffeurs, car rentals — aligned with your arrival times.",
      "services.5t": "Visas & insurance",
      "services.5b": "Guidance and coordination. Final decisions remain with consulates/insurers.",
      "services.6t": "Cruises & curated trips",
      "services.6b": "Cruises, multi‑stop journeys, and special occasions planned end‑to‑end.",

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
      "hero.sub": "Быстрые предложения, умные маршруты, корректные документы и реальная помощь при изменениях — авиабилеты, отели, круизы, трансферы, визы и страховки в одном месте.",
      "hero.b1": "<strong>Экономим часы</strong> на планировании и переписке.",
      "hero.b2": "<strong>Документы для компании</strong>: инвойсы, подтверждения, отчётность.",
      "hero.b3": "<strong>Срочные решения</strong> при отменах и переносах.",
      "hero.b4": "<strong>Один менеджер</strong> на весь процесс.",
      "hero.cta1": "Получить расчёт",
      "hero.cta2": "WhatsApp",
      "hero.micro": "Лицензия Кипра · IATA · Лицензия 7775 · Рег. HE 181550",

      "tool.kicker": "Быстрое бронирование",
      "tool.title": "Быстрое бронирование",
      "tool.sub": "Бронируйте через партнёрский виджет Trip.com. Для корпоративных маршрутов, изменений и сложных задач — запросите расчёт.",
      "tool.badge": "Партнёрское предложение",
      "tool.note": "Партнёрский виджет Trip.com. Для лучших решений и сложных поездок — запросите расчёт.",

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
      "services.1b": "Оптимальные стыковки, понятные правила тарифа и оперативные изменения.",
      "services.2t": "Корпоративные поездки",
      "services.2b": "Документы и инвойсы, удобные для бухгалтерии и политики компании.",
      "services.3t": "Отели и luxury размещение",
      "services.3b": "От бизнес‑отелей до 5★ — под ваши приоритеты и бюджет.",
      "services.4t": "Трансферы и транспорт",
      "services.4b": "Частные трансферы, водитель, аренда авто — всё под время прилёта.",
      "services.5t": "Визы и страховки",
      "services.5b": "Консультация и координация. Решение остаётся за консульством/страховой.",
      "services.6t": "Круизы и индивидуальные туры",
      "services.6b": "Круизы, multi‑stop поездки и особые события — полностью под ключ.",

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
      "tool.load": "Загрузить быстрый модуль бронирования",
      "form.errName": "Пожалуйста, укажите имя.",
      "form.errContact": "Укажите хотя бы телефон или email.",
      "form.errEmail": "Пожалуйста, укажите корректный email.",
      "form.errMessage": "Пожалуйста, добавьте короткое сообщение.",
      "form.sending": "Отправляем...",
      "form.sent": "✅ Отправлено! Мы скоро с вами свяжемся.",
      "form.fallback": "⚠️ Не удалось отправить форму. Открываем email...",
      "form.opening": "Открываем email...",
      "form.error": "⚠️ Ошибка. Открываем email...",

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

  function mailtoFallback(payload) {
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

    window.location.href = `mailto:${encodeURIComponent(EMAIL_TO)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
    if (status) status.textContent = "";
    if (btn) btn.disabled = true;

    if (!payload.name) { if (status) status.textContent = tr("form.errName", "Please enter your name."); if (btn) btn.disabled = false; return; }
    if (!payload.phone && !payload.email) { if (status) status.textContent = tr("form.errContact", "Please add at least a phone or email."); if (btn) btn.disabled = false; return; }
    if (payload.email && !isValidEmail(payload.email)) { if (status) status.textContent = tr("form.errEmail", "Please enter a valid email."); if (btn) btn.disabled = false; return; }
    if (!payload.message) { if (status) status.textContent = tr("form.errMessage", "Please write a short message."); if (btn) btn.disabled = false; return; }

    try {
      if (FORMSPREE_ENDPOINT) {
        if (status) status.textContent = tr("form.sending", "Sending...");
        const ok = await postFormspree(payload);
        if (ok) {
          if (status) status.textContent = tr("form.sent", "✅ Sent! We will contact you shortly.");
          $("#leadForm")?.reset();
        } else {
          if (status) status.textContent = tr("form.fallback", "⚠️ Could not send via form. Opening email instead...");
          setTimeout(() => mailtoFallback(payload), 400);
        }
      } else {
        if (status) status.textContent = tr("form.opening", "Opening email...");
        mailtoFallback(payload);
      }
    } catch (err) {
      if (status) status.textContent = tr("form.error", "⚠️ Error. Opening email instead...");
      setTimeout(() => mailtoFallback(payload), 400);
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
    const makeFrame = (width, height) => {
      const iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.width = String(width);
      iframe.height = String(height);
      iframe.loading = "lazy";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.style.border = "none";
      iframe.style.display = "block";
      iframe.style.width = "100%";
      iframe.title = "Trip.com partner booking";
      iframe.allow = "clipboard-write";
      return iframe;
    };
    if (desktop) desktop.appendChild(makeFrame(900, 200));
    if (mobile) mobile.appendChild(makeFrame(320, 320));
    holder.setAttribute("data-loaded", "1");
    const loadBtn = $("#loadTripWidget");
    if (loadBtn) loadBtn.classList.add("hidden");
  }

  function initSegmentTabs() {
    const tabs = $$('[data-segment-tab]');
    const panels = $$('[data-segment-panel]');
    if (!tabs.length || !panels.length) return;

    const setActive = (segment) => {
      tabs.forEach((tab) => {
        const isActive = tab.getAttribute('data-segment-tab') === segment;
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
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

    $("#darkToggle")?.addEventListener("click", () => setDark(!document.documentElement.classList.contains("dark")));
    $("#darkToggleMobile")?.addEventListener("click", () => setDark(!document.documentElement.classList.contains("dark")));

    $("#loadTripWidget")?.addEventListener("click", loadTripWidget);
    const widget = $("#tripWidget");
    if (widget && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadTripWidget();
            observer.disconnect();
          }
        });
      }, { rootMargin: "200px 0px" });
      observer.observe(widget);
    }
  });
})();
