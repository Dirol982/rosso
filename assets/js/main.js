// Language and currency come from the page: <html lang="en" data-currency="BYN">. Russian is the source text.
const LANG = (document.documentElement.lang || "ru").slice(0, 2) === "en" ? "en" : "ru";
const CUR = document.documentElement.dataset.currency || "руб.";
const EN = {
  "Открыто до {h}:00": "Open until {h}:00",
  "Закрыто · откроемся в {h}:00": "Closed · opens at {h}:00",
  "{i} из {n}": "{i} of {n}",
  "Выберите марку автомобиля — так мастер сразу поймёт, с чем работать.": "Choose your car make so the technician knows what to expect.",
  "Напишите коротко, что нужно сделать: например, «ТО» или «рывки при переключении».": "Tell us briefly what is needed, e.g. “service” or “jerky gear changes”.",
  "Здравствуйте! Хочу записаться на СТО.": "Hello! I'd like to book a service.",
  "Марка: {v}": "Make: {v}",
  "Модель: {v}": "Model: {v}",
  "Задача: {v}": "Job: {v}",
  "Открываем WhatsApp с готовым текстом заявки. Остаётся нажать «Отправить».": "Opening WhatsApp with your request filled in. Just press Send.",
  "Запись на СТО: {v}": "Service booking: {v}",
  "Открываем Viber с готовой заявкой — остаётся нажать «Отправить».": "Opening Viber with your request — just press Send.",
  "Открываем Viber. Заявка длинная, поэтому мы её скопировали — вставьте в чат (Ctrl+V или долгое нажатие) и отправьте.": "Opening Viber. The request is long, so we copied it — paste it into the chat (Ctrl+V or long press) and send.",
  "Открываем Viber. Напишите марку, модель и задачу — ответим в рабочее время.": "Opening Viber. Write your make, model and job — we reply during opening hours.",
  "Текст заявки скопирован. Вставьте его в открывшийся чат Telegram и отправьте.": "Request copied. Paste it into the Telegram chat that opens and send.",
  "Открываем Telegram. Напишите марку, модель и задачу — ответим в рабочее время.": "Opening Telegram. Write your make, model and job — we reply during opening hours.",
  "Найдено: {n}": "Found: {n}",
  "результатов": "results",
  "работ в разделе": "jobs in this section",
  "от": "from",
  "По запросу «{q}» ничего не нашли. Попробуйте другое слово — «колодки», «ГРМ», «сцепление» — или выберите раздел выше.": "Nothing found for “{q}”. Try another word — “pads”, “timing”, “clutch” — or pick a section above.",
  "Ещё": "Show",
  "Свернуть": "Show less",
  "Не видите нужную работу?": "Can't see the job you need?",
  "Найдите поиском": "Search for it",
  "или спросите мастера": "or ask the technician",
  "Меньше": "Fewer",
  "Больше": "More",
  "Удалить": "Remove",
  "Отметьте работы слева или нажмите на то, что беспокоит.": "Tick jobs on the left or tap what's wrong.",
  "работ": "jobs",
  "Добавили в расчёт: {v}": "Added to the estimate: {v}",
  "Убрали: {v}": "Removed: {v}",
  "Записаться с этим расчётом": "Book with this estimate",
  "Расчёт очищен": "Estimate cleared",
  "Цены пересчитаны для {m}. Нет в прайсе марки: {v}": "Prices updated for {m}. Not in this make's list: {v}",
  "Цены пересчитаны для {m}": "Prices updated for {m}",
  "Прайс {m}": "{m} price list",
  "Сегодня": "Today",
  "Завтра": "Tomorrow",
  "Утро 9–12": "Morning 9–12",
  "День 12–16": "Day 12–16",
  "Вечер 16–21": "Evening 16–21",
  "Здравствуйте! Расчёт с сайта Rosso-Corsa.": "Hello! An estimate from the Rosso-Corsa website.",
  "Авто: {v}": "Car: {v}",
  "Утро": "Morning",
  "День": "Afternoon",
  "Вечер": "Evening",
  "Итого работы: от {v}": "Labour total: from {v}",
  "Удобно: {v}": "Preferred time: {v}",
  "Подскажите точную стоимость и подтвердите время записи.": "Please confirm the exact price and the booking time.",
  "Сначала добавьте работы в расчёт": "Add some jobs to the estimate first",
  "Расчёт скопирован — вставьте его в мессенджер": "Estimate copied — paste it into your messenger",
  "Не получилось скопировать автоматически": "Couldn't copy automatically",
  "Отправить расчёт мастеру": "Send the estimate",
  "Открываем WhatsApp с расчётом — остаётся нажать «Отправить»": "Opening WhatsApp with the estimate — just press Send",
  "Расчёт с сайта: {m}, работ {n}, от {v}. Список ниже:": "Website estimate: {m}, {n} jobs, from {v}. List below:",
  "Открываем Viber. Полный расчёт скопирован — вставьте его в чат (Ctrl+V или долгое нажатие) и отправьте": "Opening Viber. The full estimate is copied — paste it into the chat (Ctrl+V or long press) and send",
  "Открываем Viber. Скопируйте расчёт кнопкой «Скопировать расчёт» и вставьте в чат": "Opening Viber. Copy the estimate with the Copy button and paste it into the chat",
  "Расчёт скопирован — вставьте его в открывшийся чат Telegram": "Estimate copied — paste it into the Telegram chat that opens",
  "Открываем Telegram": "Opening Telegram",
  "Открываем Telegram с готовой заявкой — остаётся нажать «Отправить».": "Opening Telegram with your request filled in — just press Send.",
  "Открываем Telegram с готовым расчётом — остаётся нажать «Отправить»": "Opening Telegram with the estimate filled in — just press Send",
  "Открываем Viber с готовым расчётом — остаётся нажать «Отправить»": "Opening Viber with the estimate filled in — just press Send",
  "Открываем Viber с кратким расчётом. Полный тоже скопирован — можно вставить следом": "Opening Viber with a short estimate. The full one is copied too — paste it after if you like",
  "Открываем Viber с кратким расчётом — остаётся нажать «Отправить»": "Opening Viber with a short estimate — just press Send",
  "Видео": "Video",
  "В заказ": "Add",
  "В заказе": "Added",
  "Заказ": "Order",
  "Подытог заказа": "Order subtotal",
  "Ваш заказ": "Your order",
  "Добавьте работы из прайса": "Add jobs from the price list",
  "Оформить": "Check out",
  "заказ": "",
  "Очистить": "Clear",
  "Галерея цеха": "Workshop gallery",
  "Предыдущее фото": "Previous photo",
  "Следующее фото": "Next photo",
  "Закрыть галерею": "Close gallery",
  "Открыть фото на весь экран": "Open photo full screen",
  "фото": "photo",
  "Пора на ТО": "Service due",
  "Горит Check Engine": "Check Engine light",
  "Стучит подвеска": "Suspension knocks",
  "Скрипят тормоза": "Squeaky brakes",
  "Гремит выхлоп": "Exhaust rattles",
  "Не заводится": "Won't start",
  "Вибрация после смены колёс": "Vibration after a wheel change",
};
const T = (s, v = {}) => (LANG === "en" && EN[s] !== undefined ? EN[s] : s).replace(/\{(\w+)\}/g, (_, k) => (v[k] ?? ""));
// Work and section names on an English page come from the page's own dictionary: <script type="application/json" data-i18n-works>
const WORKS = (() => {
  try {
    return JSON.parse(document.querySelector("[data-i18n-works]")?.textContent || "{}");
  } catch (_) {
    return {};
  }
})();
const W = (s) => (LANG === "en" && WORKS[s]) || s;

// Search finds the same work however it is written: DSG / ДСГ / S tronic, ТО / техобслуживание and so on.
const SEARCH_ALIASES = [
  ["дсг", "dsg s tronic stronic s-tronic коробка робот"],
  ["акпп", "автомат коробка"],
  ["мкпп", "механика коробка"],
  ["кпп", "коробка"],
  ["грм", "ремень цепь"],
  ["то ", "техобслуживание обслуживание"],
  ["кондиционер", "климат ac"],
  ["абс", "abs"],
  ["шрус", "граната"],
  ["грм", "ремень цепь"],
  ["гур", "гидроусилитель руль"],
  ["шрус", "граната"],
  ["двс", "двигатель мотор"],
  ["шин", "колесо колеса резина"],
];
const searchText = (name) => {
  let t = (" " + name.toLowerCase().replace(/ё/g, "е") + " ");
  for (const [k, v] of SEARCH_ALIASES) if (t.includes(k)) t += " " + v;
  return t;
};
const searchQuery = (q) => q.toLowerCase().replace(/ё/g, "е").trim();

// Motion, header, mobile menu, open sign, reveals, springs, gallery
(() => {
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector("[data-header]");
const dock = document.querySelector(".dock");
let lastY = window.scrollY;
const onScroll = () => {
  const y = window.scrollY;
  header?.classList.toggle("is-scrolled", y > 24);
  const menuOpen = header?.querySelector("[data-menu-toggle]")?.getAttribute("aria-expanded") === "true";
  dock?.classList.toggle("is-shown", y > window.innerHeight * 0.9);
  lastY = y;
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
const toggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
const setMenu = (open) => {
  if (!toggle || !menu) return;
  toggle.setAttribute("aria-expanded", String(open));
  menu.hidden = !open;
  document.body.style.overflow = open ? "hidden" : "";
  header?.classList.toggle("is-scrolled", open || window.scrollY > 24);
};
toggle?.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
menu?.querySelectorAll("[data-menu-link]").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    toggle.focus();
  }
});
const minskHour = () => {
  const parts = new Intl.DateTimeFormat("ru-RU", { timeZone: "Europe/Minsk", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(/* @__PURE__ */ new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return h + m / 60;
};
const paintSigns = () => {
  const now = minskHour();
  document.querySelectorAll("[data-open-sign]").forEach((el) => {
    const open = Number(el.dataset.open);
    const close = Number(el.dataset.close);
    const isOpen = now >= open && now < close;
    el.classList.toggle("is-open", isOpen);
    el.classList.toggle("is-closed", !isOpen);
    const text = el.querySelector("[data-open-text]");
    if (text) text.textContent = isOpen ? T("Открыто до {h}:00", { h: close }) : T("Закрыто · откроемся в {h}:00", { h: open });
  });
};
paintSigns();
setInterval(paintSigns, 6e4);
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    }
  },
  { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
);
document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
// A jump past a section (menu link, fast scroll) never makes it intersect; reveal everything already above the fold line.
let revealTick = false;
const revealPassed = () => {
  revealTick = false;
  const line = window.innerHeight * 0.9;
  document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => {
    if (el.getBoundingClientRect().top < line) {
      el.classList.add("is-in");
      io.unobserve(el);
    }
  });
  // figures jumped past show their true value instead of a frozen zero
  document.querySelectorAll("[data-count]:not([data-done]), [data-gauge]:not([data-done])").forEach((el) => {
    if (el.getBoundingClientRect().bottom < 0) {
      el.dataset.done = "1";
      if (el.dataset.count) el.textContent = new Intl.NumberFormat("ru-RU").format(Number(el.dataset.count));
      else el.style.setProperty("--g", el.dataset.gauge);
    }
  });
};
window.addEventListener("scroll", () => {
  if (!revealTick) {
    revealTick = true;
    requestAnimationFrame(revealPassed);
  }
}, { passive: true });
window.addEventListener("hashchange", revealPassed);
const springs = /* @__PURE__ */ new Set();
let raf = 0;
const step = () => {
  const k = 120;
  const c = 17;
  const dt = 1 / 60;
  for (const s of springs) {
    const a = -k * (s.x - s.target) - c * s.v;
    s.v += a * dt;
    s.x += s.v * dt;
    if (Math.abs(s.x - s.target) < 5e-4 && Math.abs(s.v) < 5e-4) {
      s.x = s.target;
      springs.delete(s);
    }
    s.render(s.x);
  }
  raf = springs.size ? requestAnimationFrame(step) : 0;
};
const animateTo = (s) => {
  springs.add(s);
  if (!raf) raf = requestAnimationFrame(step);
};
const fmt = new Intl.NumberFormat("ru-RU");
const springIO = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target;
      springIO.unobserve(el);
      el.dataset.done = "1";
      const to = Number(el.dataset.count ?? el.dataset.gauge ?? 1);
      if (el.dataset.count) {
        // a figure never reads past its true value, however the spring overshoots
        const render = (x) => el.textContent = fmt.format(Math.max(0, Math.round(Math.min(1, x) * to)));
        if (reduce) render(1);
        else animateTo({ x: 0, v: 0, target: 1, el, render });
      } else {
        const render = (x) => el.style.setProperty("--g", String(Math.max(0, x * to)));
        if (reduce) render(1);
        else animateTo({ x: 0, v: 0, target: 1, el, render });
      }
    }
  },
  { threshold: 0.4 }
);
document.querySelectorAll("[data-count], [data-gauge]").forEach((el) => {
  if (!reduce) {
    if (el.dataset.count) el.textContent = "0";
    else el.style.setProperty("--g", "0");
  }
  springIO.observe(el);
});
const hero = document.querySelector("[data-hero]");
const drift = document.querySelectorAll("[data-drift]");
const rail = document.querySelector("[data-rail]");
const railTrack = rail?.querySelector("[data-rail-track]");
const railMq = matchMedia("(min-width: 900px)");
const sizeRail = () => {
  if (!rail || !railTrack) return;
  if (!railMq.matches || reduce) {
    rail.style.height = "";
    railTrack.style.transform = "";
    return;
  }
  const overflow = railTrack.scrollWidth - window.innerWidth;
  rail.style.height = `${window.innerHeight + Math.max(0, overflow)}px`;
};
let ticking = false;
const onFrame = () => {
  ticking = false;
  const vh = window.innerHeight;
  if (hero) {
    const p = Math.min(1, Math.max(0, window.scrollY / vh));
    hero.style.setProperty("--p", p.toFixed(4));
  }
  drift.forEach((el) => {
    const r = el.getBoundingClientRect();
    const p = (vh - r.top) / (vh + r.height);
    const dir = Number(el.dataset.drift || 1);
    el.style.transform = `translate3d(${(-(p - 0.5) * 30 * dir).toFixed(2)}%,0,0)`;
  });
  if (rail && railTrack && railMq.matches) {
    const r = rail.getBoundingClientRect();
    const total = rail.offsetHeight - vh;
    const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
    const overflow = railTrack.scrollWidth - window.innerWidth;
    railTrack.style.transform = `translate3d(${(-p * overflow).toFixed(1)}px,0,0)`;
    rail.style.setProperty("--rp", p.toFixed(4));
  }
};
if (!reduce) {
  sizeRail();
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onFrame);
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", () => {
    sizeRail();
    onFrame();
  });
  window.addEventListener("load", () => {
    sizeRail();
    onFrame();
  });
  onFrame();
}
document.querySelectorAll("[data-quotes]").forEach((root) => {
  const items = Array.from(root.querySelectorAll("[data-quote]"));
  const counter = root.querySelector("[data-quote-n]");
  let i = 0;
  const show = (n) => {
    i = (n + items.length) % items.length;
    items.forEach((q, k) => {
      q.classList.toggle("is-on", k === i);
      q.setAttribute("aria-hidden", String(k !== i));
    });
    if (counter) counter.textContent = T("{i} из {n}", { i: i + 1, n: items.length });
  };
  root.querySelector("[data-quote-prev]")?.addEventListener("click", () => show(i - 1));
  root.querySelector("[data-quote-next]")?.addEventListener("click", () => show(i + 1));
  show(0);
});
})();

// Booking configurator in the first viewport
(() => {
  const tel = '+375295072150';
  const tg = 'https://t.me/%2B375295072150';
  const wa = 'https://wa.me/375295072150';

  (() => {
    const form = document.querySelector('[data-booking]');
    if (!form) return;
    const status = form.querySelector('[data-booking-status]');
    const initial = status.innerHTML;

    const say = (html, kind) => {
      status.innerHTML = html;
      status.dataset.kind = kind || '';
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const make = data.get('make');
      const model = (data.get('model') || '').toString().trim();
      const task = (data.get('task') || '').toString().trim();
      const channel = data.get('channel') || 'telegram';

      if (!make) {
        say(T('Выберите марку автомобиля — так мастер сразу поймёт, с чем работать.'), 'error');
        form.querySelector('input[name="make"]').focus();
        return;
      }
      if (!task) {
        say(T('Напишите коротко, что нужно сделать: например, «ТО» или «рывки при переключении».'), 'error');
        form.querySelector('#b-task').focus();
        return;
      }

      const lines = [
        T('Здравствуйте! Хочу записаться на СТО.'),
        T('Марка: {v}', { v: make }),
        model && T('Модель: {v}', { v: model }),
        T('Задача: {v}', { v: task }),
      ].filter(Boolean);
      const text = lines.join('\n');
      const enc = encodeURIComponent(text);

      let copied = false;
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch (_) {}

      if (channel === 'whatsapp') {
        window.open(`${wa}?text=${enc}`, '_blank', 'noopener');
        say(T('Открываем WhatsApp с готовым текстом заявки. Остаётся нажать «Отправить».'), 'ok');
      } else if (channel === 'viber') {
        // Viber cuts a draft at 100 characters: send one compact line, or no draft and the copied full text
        const short = T('Запись на СТО: {v}', { v: `${make}${model ? ' ' + model : ''} — ${task}` });
        const fits = short.length <= 100;
        window.location.href = `viber://chat?number=${encodeURIComponent(tel)}` + (fits ? `&draft=${encodeURIComponent(short)}` : '');
        say(
          fits
            ? T('Открываем Viber с готовой заявкой — остаётся нажать «Отправить».')
            : copied
              ? T('Открываем Viber. Заявка длинная, поэтому мы её скопировали — вставьте в чат (Ctrl+V или долгое нажатие) и отправьте.')
              : T('Открываем Viber. Напишите марку, модель и задачу — ответим в рабочее время.'),
          'ok'
        );
      } else {
        // t.me/+phone?text= puts the request into the input bar (Telegram deep-link "text" parameter)
        window.open(`https://t.me/+${tel.replace(/\D/g, '')}?text=${enc}`, '_blank', 'noopener');
        say(T('Открываем Telegram с готовой заявкой — остаётся нажать «Отправить».'), 'ok'
        );
      }
    });

    form.addEventListener('input', () => {
      if (status.dataset.kind === 'error') say(initial, '');
    });

    // Any [data-pick-make] on the page loads that make into the configurator.
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-pick-make], [data-pick-task]');
      if (!t) return;
      e.preventDefault();
      const id = t.getAttribute('data-pick-make');
      const task = t.getAttribute('data-pick-task');
      if (id) {
        const r = form.querySelector(`input[data-make-id="${id}"]`);
        if (r) r.checked = true;
      }
      if (task) form.querySelector('#b-task').value = task;
      form.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
      form.classList.remove('is-pinged');
      void form.offsetWidth;
      form.classList.add('is-pinged');
      setTimeout(() => form.querySelector(id && !task ? '#b-task' : '#b-model').focus({ preventScroll: true }), 650);
    });
  })();
})();

// Order calculator and pre-check. Rosso Corsa has one price list for every make.
(() => {
  const root = document.querySelector('[data-calc]');
  if (!root) return;

  const SERVICE_TEL = '+375295072150';
  const TG = 'https://t.me/%2B375295072150';
  const WA = 'https://wa.me/375295072150';
  const STORE = 'rosso-precheck-v1' + (LANG === 'en' ? '-en' : '');
  const MAKE_NAMES = { all: T('Все марки') }; // цены у Rosso Corsa одни для всех марок
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LIMIT = matchMedia('(max-width: 720px)').matches ? 4 : 8;
  const fmt = new Intl.NumberFormat('ru-RU');

  // One tap adds the usual works for a complaint (only works present in the selected make's price list)
  const SYM = [
    ['Пора на ТО', [['Замена масла двигателя', 1], ['Замена масляного фильтра', 1], ['Замена воздушного фильтра', 1], ['Замена салонного фильтра', 1]], 'Техническое обслуживание'],
    ['Горит Check Engine', [['Компьютерная диагностика', 1], ['Диагностика ДВС', 1]], 'Ремонт двигателя'],
    ['Стучит подвеска', [['Диагностика подвески', 1], ['Замена стоек стабилизатора', 1]], 'Ремонт подвески'],
    ['Скрипят тормоза', [['Замена дисковых тормозных колодок', 1], ['Проточка тормозных дисков', 1]], 'Ремонт тормозной системы'],
    ['Гремит выхлоп', [['Диагностика выхлопной системы', 1], ['Замена хомутов/резинок', 1]], 'Ремонт выхлопной системы'],
    ['Не заводится', [['Компьютерная диагностика', 1], ['Ремонт стартеров и генераторов', 1]], 'Ремонт автоэлектрики'],
    ['Вибрация после смены колёс', [['Балансировка колёс', 1], ['Правка и прокатка дисков', 1]], 'Колёса и шины'],
  ];

  SYM.forEach((s) => { s[0] = T(s[0]); s[1] = s[1].map(([n, q]) => [W(n), q]); s[2] = W(s[2]); });
  const data = JSON.parse(root.querySelector('[data-calc-data]').textContent || '[]');
  const $ = (s, el = root) => el.querySelector(s);
  const itemsEl = $('[data-calc-items]');
  const catsEl = $('[data-calc-cats]');
  const symEl = $('[data-calc-sym]');
  const footEl = $('[data-calc-foot]');
  const foundEl = $('[data-calc-found]');
  const search = $('[data-calc-search]');
  const check = $('[data-check]');
  const linesEl = $('[data-check-lines]');
  const sumEl = $('[data-check-sum]');
  const metaEl = $('[data-check-meta]');
  const clearBtn = $('[data-check-clear]');
  const bookEl = $('[data-check-book]');
  const submitBtn = $('[data-check-submit]');
  const backdrop = $('[data-check-backdrop]');
  const toastEl = $('[data-toast]');
  const dockSum = document.querySelector('[data-dock-sum]');
  const dockEmpty = document.querySelector('[data-dock-empty]');
  const dockFull = document.querySelector('[data-dock-full]');

  let make = 'all';
  let cat = '';
  let query = '';
  let expanded = false;
  let picked = new Map(); // name → qty
  let shown = 0;

  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
    if (saved && MAKE_NAMES[saved.make]) {
      make = saved.make;
      picked = new Map(saved.picked || []);
    }
  } catch (_) {}

  const book = () => data.find((m) => m.id === make);
  const priceMap = () => new Map(book().cats.flatMap((c) => c.items.map((i) => [i.name, i.price])));
  const total = () => {
    const pm = priceMap();
    let s = 0;
    picked.forEach((q, n) => (s += (pm.get(n) || 0) * q));
    return s;
  };
  const save = () => {
    try {
      localStorage.setItem(STORE, JSON.stringify({ make, picked: [...picked] }));
    } catch (_) {}
  };
  const esc = (t) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const norm = (t) => t.toLowerCase().replace(/ё/g, 'е');
  const toast = (m) => {
    toastEl.textContent = m;
    toastEl.classList.add('is-on');
    clearTimeout(toastEl._h);
    toastEl._h = setTimeout(() => toastEl.classList.remove('is-on'), 2600);
  };

  const allCount = () => new Set(data.flatMap((m) => m.cats.flatMap((c) => c.items.map((i) => i.name)))).size;
  const countEl = $('[data-calc-count]');
  if (countEl) countEl.textContent = String(allCount());

  /* ── complaints ── */
  const renderSym = () => {
    const pm = priceMap();
    symEl.innerHTML = SYM.map(([label, works], i) => {
      const ok = works.some(([n]) => pm.has(n));
      const done = ok && works.filter(([n]) => pm.has(n)).every(([n]) => picked.has(n));
      return ok ? `<button type="button" data-i="${i}" class="${done ? 'is-done' : ''}">+ ${esc(label)}</button>` : '';
    }).join('');
  };

  /* ── categories ── */
  const renderCats = () => {
    catsEl.innerHTML = book()
      .cats.map((c) => {
        const n = c.items.filter((it) => picked.has(it.name)).length;
        const sel = c.name === cat && !query;
        return `<button type="button" role="tab" aria-selected="${sel}" data-c="${esc(c.name)}">${esc(c.name)}${
          n ? `<i class="is-picked">${n}</i>` : `<i>${c.items.length}</i>`
        }</button>`;
      })
      .join('');
  };

  /* ── works ── */
  const renderItems = () => {
    const q = norm(query.trim());
    let list;
    let label;
    if (q) {
      const stems = q.split(/\s+/).filter(Boolean).map((w) => (w.length > 5 ? w.slice(0, -2) : w));
      const seen = new Set();
      list = book()
        .cats.flatMap((c) => c.items)
        .filter((it) => !seen.has(it.name) && seen.add(it.name) && stems.every((w) => searchText(it.name).includes(w)));
      foundEl.textContent = list.length ? T('Найдено: {n}', { n: list.length }) : '';
      label = T('результатов');
    } else {
      list = (book().cats.find((c) => c.name === cat) || book().cats[0]).items;
      foundEl.textContent = '';
      label = T('работ в разделе');
    }
    const show = expanded ? list : list.slice(0, LIMIT);
    itemsEl.innerHTML = show.length
      ? show
          .map(
            (it) =>
              `<button type="button" class="calc__item" data-n="${esc(it.name)}" aria-pressed="${picked.has(it.name)}"><span class="calc__box" aria-hidden="true"></span><span class="calc__nm">${esc(
                it.name
              )}</span><span class="calc__pr num"><small>${T('от')}</small>${fmt.format(it.price)}\u00a0${CUR}</span></button>`
          )
          .join('')
      : `<p class="calc__none">${T('По запросу «{q}» ничего не нашли. Попробуйте другое слово — «колодки», «ГРМ», «сцепление» — или выберите раздел выше.', { q: esc(query.trim()) })}</p>`;
    const rest = list.length - show.length;
    footEl.innerHTML =
      (rest > 0
        ? `<button type="button" data-more>${T('Ещё')} ${rest} ${label} ↓</button>`
        : expanded && list.length > LIMIT
          ? `<button type="button" data-more>${T('Свернуть')} ↑</button>`
          : '<span></span>') + `<span>${T('Не видите нужную работу?')} <a data-to-search>${T('Найдите поиском')}</a> ${T('или спросите мастера')}</span>`;
  };

  /* ── receipt ── */
  const animateSum = (from, to) => {
    const paint = (v) => {
      sumEl.textContent = fmt.format(v);
      if (dockSum) dockSum.textContent = fmt.format(v);
    };
    if (reduce) return paint(to);
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 500);
      paint(Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const renderCheck = () => {
    const pm = priceMap();
    const lines = [...picked].filter(([n]) => pm.has(n));
    linesEl.innerHTML = lines.length
      ? lines
          .map(
            ([n, q]) =>
              `<li data-n="${esc(n)}"><span>${esc(n)}</span><span class="check__qty"><button type="button" data-q="-1" aria-label="${T('Меньше')}: ${esc(
                n
              )}">−</button><b>${q}</b><button type="button" data-q="1" aria-label="${T('Больше')}: ${esc(n)}">+</button></span><span class="check__p">${fmt.format(
                pm.get(n) * q
              )}</span><button type="button" class="check__rm" aria-label="${T('Удалить')}: ${esc(
                n
              )}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></li>`
          )
          .join('')
      : `<li class="check__empty">${T('Отметьте работы слева или нажмите на то, что беспокоит.')}</li>`;
    const sum = total();
    animateSum(shown, sum);
    shown = sum;
    clearBtn.hidden = !lines.length;
    metaEl.textContent = `Rosso Corsa · ${T('работ')}: ${lines.length}`;
    if (dockEmpty && dockFull) {
      dockEmpty.hidden = lines.length > 0;
      dockFull.hidden = lines.length === 0;
    }
  };

  const refresh = () => {
    save();
    renderSym();
    renderCats();
    renderItems();
    renderCheck();
  };

  /* ── events ── */
  catsEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-c]');
    if (!b) return;
    cat = b.dataset.c;
    query = '';
    search.value = '';
    expanded = false;
    renderCats();
    renderItems();
  });

  search.addEventListener('input', () => {
    query = search.value;
    expanded = false;
    renderCats();
    renderItems();
  });

  itemsEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-n]');
    if (!b) return;
    const n = b.dataset.n;
    if (picked.has(n)) picked.delete(n);
    else picked.set(n, 1);
    refresh();
  });

  footEl.addEventListener('click', (e) => {
    if (e.target.closest('[data-more]')) {
      expanded = !expanded;
      renderItems();
    }
    if (e.target.closest('[data-to-search]')) {
      search.focus();
      search.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
    }
  });

  symEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (!b) return;
    const [, works, c] = SYM[Number(b.dataset.i)];
    const pm = priceMap();
    const added = works.filter(([n]) => pm.has(n));
    added.forEach(([n, q]) => picked.set(n, Math.max(q, picked.get(n) || 0)));
    if (book().cats.some((x) => x.name === c)) cat = c;
    query = '';
    search.value = '';
    expanded = true;
    refresh();
    added.forEach(([n]) => itemsEl.querySelector(`[data-n="${CSS.escape(n)}"]`)?.classList.add('is-flash'));
    toast(T('Добавили в расчёт: {v}', { v: added.map(([n]) => n).join(', ') }));
  });

  linesEl.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-n]');
    if (!li) return;
    const n = li.dataset.n;
    if (e.target.closest('.check__rm')) {
      li.classList.add('is-out');
      setTimeout(() => {
        picked.delete(n);
        refresh();
        toast(T('Убрали: {v}', { v: n }));
      }, reduce ? 0 : 220);
      return;
    }
    const b = e.target.closest('[data-q]');
    if (b) {
      const q = picked.get(n) + Number(b.dataset.q);
      if (q < 1) picked.delete(n);
      else picked.set(n, Math.min(q, 20));
      refresh();
    }
  });

  clearBtn.addEventListener('click', () => {
    picked.clear();
    bookEl.hidden = true;
    submitBtn.textContent = T('Записаться с этим расчётом');
    refresh();
    toast(T('Расчёт очищен'));
  });

  root.querySelectorAll('input[name="calc-make"]').forEach((r) => {
    r.checked = r.value === make;
    r.addEventListener('change', () => {
      make = r.value;
      const pm = priceMap();
      const dropped = [...picked.keys()].filter((n) => !pm.has(n));
      dropped.forEach((n) => picked.delete(n));
      if (!book().cats.some((c) => c.name === cat)) cat = book().cats[0].name;
      refresh();
      toast(
        dropped.length
          ? T('Цены пересчитаны для {m}. Нет в прайсе марки: {v}', { m: MAKE_NAMES[make], v: dropped.join(', ') })
          : picked.size
            ? T('Цены пересчитаны для {m}', { m: MAKE_NAMES[make] })
            : T('Прайс {m}', { m: MAKE_NAMES[make] })
      );
    });
  });

  /* ── visit day and part of day (Minsk time); the exact time is agreed by phone ── */
  const daysEl = $('[data-check-days]');
  const slotsEl = $('[data-check-slots]');
  const WD = LANG === 'en' ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
  const minsk = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Minsk' }));
  const startToday = minsk.getHours() < 16;
  const days = [];
  for (let i = startToday ? 0 : 1; days.length < 7; i++) {
    const d = new Date(minsk);
    d.setDate(minsk.getDate() + i);
    const title = i === 0 ? T('Сегодня') : i === 1 ? T('Завтра') : WD[d.getDay()];
    days.push({ title, sub: d.toLocaleDateString(LANG === 'en' ? 'en-GB' : 'ru-RU', { day: 'numeric', month: 'short' }).replace('.', '') });
  }
  daysEl.innerHTML = days.map((d, i) => `<button type="button" aria-pressed="${i === 0}">${d.title}<small>${d.sub}</small></button>`).join('');
  slotsEl.innerHTML = [T('Утро'), T('День'), T('Вечер')]
    .map((s, i) => `<button type="button" aria-pressed="${i === 0}">${s}</button>`)
    .join('');
  [daysEl, slotsEl].forEach((g) =>
    g.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      [...g.children].forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    })
  );

  const receiptText = () => {
    const pm = priceMap();
    const lines = [...picked].filter(([n]) => pm.has(n));
    const model = String(new FormData(check).get('model') || '').trim();
    const day = daysEl.querySelector('[aria-pressed="true"]');
    const slot = slotsEl.querySelector('[aria-pressed="true"]');
    return [
      T('Здравствуйте! Расчёт с сайта Rosso-Corsa.'),
      model ? T('Авто: {v}', { v: model }) : '',
      ...lines.map(([n, q], i) => `${i + 1}. ${n}${q > 1 ? ` × ${q}` : ''} — ${T('от')} ${fmt.format(pm.get(n) * q)} ${CUR}`),
      T('Итого работы: от {v}', { v: `${fmt.format(total())} ${CUR}` }),
      !bookEl.hidden && day && slot ? T('Удобно: {v}', { v: `${day.firstChild.textContent} ${day.querySelector('small').textContent}, ${slot.textContent}` }) : '',
      T('Подскажите точную стоимость и подтвердите время записи.'),
    ]
      .filter(Boolean)
      .join('\n');
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.append(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand('copy');
      } catch (_) {}
      ta.remove();
      return ok;
    }
  };

  $('[data-check-copy]').addEventListener('click', async () => {
    if (!picked.size) return toast(T('Сначала добавьте работы в расчёт'));
    toast((await copy(receiptText())) ? T('Расчёт скопирован — вставьте его в мессенджер') : T('Не получилось скопировать автоматически'));
  });

  check.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!picked.size) {
      toast(T('Сначала добавьте работы в расчёт'));
      return;
    }
    if (bookEl.hidden) {
      bookEl.hidden = false;
      submitBtn.textContent = T('Отправить расчёт мастеру');
      check.querySelector('#check-model').focus();
      return;
    }
    const text = receiptText();
    const ch = String(new FormData(check).get('ch') || 'telegram');
    const copied = await copy(text);
    const enc = encodeURIComponent(text);
    if (ch === 'whatsapp') {
      window.open(`${WA}?text=${enc}`, '_blank', 'noopener');
      toast(T('Открываем WhatsApp с расчётом — остаётся нажать «Отправить»'));
    } else if (ch === 'viber') {
      // Viber keeps only the first 100 characters of a draft: send a compact order that fits, the full one is on the clipboard
      const pm = priceMap();
      const lines = [...picked].filter(([k]) => pm.has(k));
      const model = String(new FormData(check).get('model') || '').trim();
      const tail = ` ${T('от')} ${fmt.format(total())} ${CUR}`;
      const head = model ? `${model}: ` : '';
      let list = lines.map(([k, q]) => (q > 1 ? `${k} ×${q}` : k)).join(', ');
      const room = 100 - head.length - tail.length - 1;
      if (list.length > room) list = list.slice(0, Math.max(0, room - 1)).replace(/[,\s]+[^,]*$/, '') + '…';
      const draft = (head + list + (list.endsWith('…') ? '' : '.') + tail).slice(0, 100);
      const whole = draft.endsWith(`${fmt.format(total())} ${CUR}`) && !list.endsWith('…');
      window.location.href = `viber://chat?number=${encodeURIComponent(SERVICE_TEL)}&draft=${encodeURIComponent(draft)}`;
      toast(
        whole
          ? T('Открываем Viber с готовым расчётом — остаётся нажать «Отправить»')
          : copied
            ? T('Открываем Viber с кратким расчётом. Полный тоже скопирован — можно вставить следом')
            : T('Открываем Viber с кратким расчётом — остаётся нажать «Отправить»')
      );
    } else {
      // t.me/+phone?text= puts the whole estimate into the input bar
      window.open(`https://t.me/+${SERVICE_TEL.replace(/\D/g, '')}?text=${enc}`, '_blank', 'noopener');
      toast(T('Открываем Telegram с готовым расчётом — остаётся нажать «Отправить»'));
    }
  });

  /* ── mobile bottom sheet ── */
  const sheetMq = matchMedia('(max-width: 1000px)');
  let lastFocus = null;
  const open = () => {
    if (!sheetMq.matches) {
      check.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      return;
    }
    lastFocus = document.activeElement;
    check.classList.add('is-open');
    check.setAttribute('role', 'dialog');
    check.setAttribute('aria-modal', 'true');
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('[data-check-close]').focus(), 50);
  };
  const close = () => {
    if (!check.classList.contains('is-open')) return;
    check.classList.remove('is-open');
    check.removeAttribute('role');
    check.removeAttribute('aria-modal');
    backdrop.hidden = true;
    document.body.style.overflow = '';
    lastFocus?.focus?.();
  };
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-check-open]')) {
      e.preventDefault();
      open();
    }
  });
  $('[data-check-close]').addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => e.key === 'Escape' && close());
  sheetMq.addEventListener('change', close);

  cat = book().cats[0].name;
  refresh();
})();

// Price page: make tabs and search
(() => {
const root = document.querySelector("[data-pricelist]");
if (root) {
  const tabs = Array.from(root.querySelectorAll("[data-tab]"));
  const panels = Array.from(root.querySelectorAll("[data-panel]"));
  const search = root.querySelector("[data-search]");
  const select = (id, focus = false) => {
    tabs.forEach((t) => {
      const on = t.dataset.tab === id;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    panels.forEach((p) => p.hidden = p.dataset.panel !== id);
    filter();
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(t.dataset.tab));
    t.addEventListener("keydown", (e) => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      select(tabs[(i + d + tabs.length) % tabs.length].dataset.tab, true);
    });
  });
  const filter = () => {
    const q = searchQuery(search?.value || "");
    const panel = panels.find((p) => !p.hidden);
    if (!panel) return;
    let any = false;
    panel.querySelectorAll("[data-group]").forEach((g) => {
      let shown = 0;
      g.querySelectorAll("[data-row]").forEach((r) => {
        const hit = !q || q.split(/\s+/).map((w) => (w.length > 5 ? w.slice(0, -2) : w)).every((w) => searchText(r.textContent).includes(w));
        r.hidden = !hit;
        if (hit) shown++;
      });
      g.hidden = shown === 0;
      if (shown) any = true;
    });
    const empty = panel.querySelector("[data-empty]");
    if (empty) empty.hidden = any;
  };
  search?.addEventListener("input", filter);
  const fromHash = location.hash.slice(1).split("-")[0];
  if (tabs.some((t) => t.dataset.tab === fromHash)) select(fromHash);
}
})();

// YouTube: the player loads only when asked for (no third-party load before the click)
document.querySelectorAll("[data-yt]").forEach((link) => {
  link.addEventListener("click", (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    if (link.classList.contains("is-playing")) return;
    const f = document.createElement("iframe");
    f.src = `https://www.youtube-nocookie.com/embed/${link.dataset.yt}?autoplay=1&rel=0`;
    f.title = link.dataset.ytTitle || T("Видео");
    f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    f.allowFullscreen = true;
    link.classList.add("is-playing");
    link.removeAttribute("href");
    link.append(f);
    f.focus();
  });
});

// Swipe strips: a finger swipes natively; a mouse drags; arrows and a progress bar follow the position
document.querySelectorAll("[data-swipe]").forEach((root) => {
  const track = root.querySelector("[data-swipe-track]");
  if (!track) return;
  const prev = root.querySelector("[data-swipe-prev]");
  const next = root.querySelector("[data-swipe-next]");
  const bar = root.querySelector(".rail__progress, [data-swipe-bar]");
  const smooth = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  const update = () => {
    const max = track.scrollWidth - track.clientWidth;
    const p = max > 0 ? track.scrollLeft / max : 0;
    if (bar) {
      bar.style.setProperty("--sp", p.toFixed(4));
      bar.style.setProperty("--sv", Math.min(1, track.clientWidth / track.scrollWidth).toFixed(4));
    }
    if (prev) prev.disabled = track.scrollLeft < 4;
    if (next) next.disabled = track.scrollLeft > max - 4;
  };
  const page = (dir) => track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: smooth });
  prev?.addEventListener("click", () => page(-1));
  next?.addEventListener("click", () => page(1));
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); page(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); page(-1); }
  });
  let down = false, moved = false, x0 = 0, l0 = 0;
  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    down = true; moved = false; x0 = e.clientX; l0 = track.scrollLeft;
  });
  window.addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - x0;
    if (!moved && Math.abs(dx) > 5) { moved = true; track.classList.add("is-drag"); }
    if (moved) track.scrollLeft = l0 - dx;
  });
  window.addEventListener("pointerup", () => {
    if (!down) return;
    down = false;
    if (moved) {
      // land on the nearest photo once the hand lets go
      const snap = () => track.classList.remove("is-drag");
      requestAnimationFrame(snap);
    }
  });
  track.addEventListener("click", (e) => {
    if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
  }, true);
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
});

// Price list → order: every price line can go into the order; a pinned subtotal follows the scroll.
// The order is the calculator's own record, so «Оформить» opens the same estimate on the home page.
(() => {
  const root = document.querySelector("[data-pricelist]");
  if (!root) return;
  const STORE = "rosso-precheck-v1" + (LANG === "en" ? "-en" : "");
  const NAMES = { all: "Rosso Corsa" };
  const fmt = new Intl.NumberFormat("ru-RU");
  const clean = (n) => n.replace(/\s+/g, " ").trim();
  const panels = [...root.querySelectorAll("[data-panel]")];
  const prices = {};
  panels.forEach((p) => {
    const id = p.dataset.panel;
    prices[id] = new Map();
    p.querySelectorAll("[data-row]").forEach((tr) => {
      const name = clean(tr.querySelector("th").textContent.trim(), id);
      const m = tr.querySelector("td").textContent.replace(/\s/g, "").match(/[\d.,]+/);
      const price = m ? Number(m[0].replace(",", ".")) : 0;
      if (!price) return;
      prices[id].set(name, price);
      tr.dataset.key = name;
      const td = document.createElement("td");
      td.className = "pl__add";
      td.innerHTML = `<button type="button" aria-pressed="false"><span>${T("В заказ")}</span></button>`;
      td.querySelector("button").setAttribute("aria-label", `${T("В заказ")}: ${name}`);
      tr.append(td);
    });
    p.querySelectorAll("thead tr").forEach((tr) => {
      const th = document.createElement("th");
      th.scope = "col";
      th.textContent = T("Заказ");
      tr.append(th);
    });
  });

  let make = (root.querySelector('[data-tab][aria-selected="true"]') || {}).dataset?.tab || "all";
  let picked = new Map();
  try {
    const s = JSON.parse(localStorage.getItem(STORE) || "null");
    if (s && prices[s.make] && s.picked?.length) {
      make = s.make;
      picked = new Map(s.picked);
      root.querySelector(`[data-tab="${make}"]`)?.click();
    }
  } catch (_) {}

  const bar = document.createElement("div");
  bar.className = "order-bar";
  bar.setAttribute("role", "region");
  bar.setAttribute("aria-label", T("Подытог заказа"));
  bar.innerHTML = `<div class="order-bar__in">
    <p class="order-bar__sum" aria-live="polite"><small data-ob-meta>${T("Ваш заказ")}</small><b class="num" data-ob-total>${T("Добавьте работы из прайса")}</b></p>
    <button type="button" class="order-bar__clear" data-ob-clear hidden>${T("Очистить")}</button>
    <a class="order-bar__go" href="index.html#calc" data-ob-go>${T("Оформить")}<span class="ob-w"> ${T("заказ")}</span> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg></a>
  </div>`;
  document.body.append(bar);
  document.body.classList.add("has-order-bar");

  const words = (n) => LANG === "en" ? (n === 1 ? "job" : "jobs") : (n % 10 === 1 && n % 100 !== 11 ? "работа" : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? "работы" : "работ");
  const render = () => {
    const pm = prices[make];
    let sum = 0;
    picked.forEach((q, n) => (sum += (pm.get(n) || 0) * q));
    root.querySelectorAll("[data-row]").forEach((tr) => {
      const b = tr.querySelector(".pl__add button");
      if (!b) return;
      const on = tr.closest("[data-panel]").dataset.panel === make && picked.has(tr.dataset.key);
      b.setAttribute("aria-pressed", String(on));
      b.firstElementChild.textContent = on ? T("В заказе") : T("В заказ");
      tr.classList.toggle("is-picked", on);
    });
    const n = picked.size;
    bar.querySelector("[data-ob-meta]").textContent = n ? `${T("Ваш заказ")} · ${NAMES[make]} · ${n} ${words(n)}` : T("Ваш заказ");
    bar.querySelector("[data-ob-total]").textContent = n ? `${T("от")} ${fmt.format(sum)} ${CUR}` : T("Добавьте работы из прайса");
    bar.querySelector("[data-ob-clear]").hidden = !n;
    bar.classList.toggle("is-empty", !n);
    try {
      localStorage.setItem(STORE, JSON.stringify({ make, picked: [...picked] }));
    } catch (_) {}
  };

  root.addEventListener("click", (e) => {
    const b = e.target.closest(".pl__add button");
    if (b) {
      const tr = b.closest("[data-row]");
      const id = tr.closest("[data-panel]").dataset.panel;
      if (id !== make) {
        make = id;
        picked = new Map();
      }
      const k = tr.dataset.key;
      if (picked.has(k)) picked.delete(k);
      else picked.set(k, 1);
      render();
      return;
    }
    const tab = e.target.closest("[data-tab]");
    if (tab && tab.dataset.tab !== make && picked.size) {
      // carry the order to the newly chosen make by work name
      const pm = prices[tab.dataset.tab];
      const next = new Map([...picked].filter(([k]) => pm.has(k)));
      make = tab.dataset.tab;
      picked = next;
      render();
    }
  });
  bar.querySelector("[data-ob-clear]").addEventListener("click", () => {
    picked.clear();
    render();
  });
  bar.querySelector("[data-ob-go]").addEventListener("click", (e) => {
    if (!picked.size) {
      e.preventDefault();
      root.querySelector("[data-search]")?.focus();
    }
  });
  render();
})();

// Minsk local time in a tile
document.querySelectorAll("[data-minsk-clock]").forEach((el) => {
  const tick = () => (el.textContent = new Intl.DateTimeFormat("ru-RU", { timeZone: "Europe/Minsk", hour: "2-digit", minute: "2-digit" }).format(new Date()));
  tick();
  setInterval(tick, 30_000);
});
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = String(new Date().getFullYear())));

// Full-screen gallery: tap any photo in a swipe strip to view it whole, then swipe, use the arrows or the keyboard.
(() => {
  const strips = [...document.querySelectorAll("[data-swipe-track]")].filter((t) => t.querySelector("img"));
  if (!strips.length || typeof HTMLDialogElement === "undefined") return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ARROW_L = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12H4m6-6-6 6 6 6"/></svg>';
  const ARROW_R = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>';
  const CLOSE = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19"/></svg>';

  const dlg = document.createElement("dialog");
  dlg.className = "gallery";
  dlg.setAttribute("aria-label", T("Галерея цеха"));
  dlg.innerHTML = `<div class="gallery__stage" data-g-stage><img class="gallery__img" alt="" data-g-img></div>
    <p class="gallery__cap"><span class="gallery__n" data-g-n></span><span data-g-cap></span></p>
    <button type="button" class="gallery__btn gallery__prev" data-g-prev aria-label="${T("Предыдущее фото")}">${ARROW_L}</button>
    <button type="button" class="gallery__btn gallery__next" data-g-next aria-label="${T("Следующее фото")}">${ARROW_R}</button>
    <button type="button" class="gallery__btn gallery__close" data-g-close aria-label="${T("Закрыть галерею")}">${CLOSE}</button>`;
  document.body.append(dlg);
  const img = dlg.querySelector("[data-g-img]");
  const stage = dlg.querySelector("[data-g-stage]");

  let items = [];
  let i = 0;
  const big = (im) => {
    const set = (im.getAttribute("srcset") || "").split(",").map((s) => s.trim().split(/\s+/));
    const best = set.sort((a, b) => parseInt(b[1]) - parseInt(a[1]))[0];
    return best && best[0] ? best[0] : im.currentSrc || im.src;
  };
  const show = (n, dir = 0) => {
    i = (n + items.length) % items.length;
    const it = items[i];
    if (!reduce && dir) {
      img.animate([{ opacity: 0, transform: `translateX(${dir * 40}px)` }, { opacity: 1, transform: "none" }], { duration: 320, easing: "cubic-bezier(.2,.8,.2,1)" });
    }
    img.src = it.src;
    img.alt = it.alt;
    dlg.querySelector("[data-g-n]").textContent = `${i + 1} / ${items.length}`;
    dlg.querySelector("[data-g-cap]").textContent = it.cap;
    [items[(i + 1) % items.length], items[(i - 1 + items.length) % items.length]].forEach((x) => (new Image().src = x.src));
  };
  const open = (track, start) => {
    items = [...track.querySelectorAll("img")].map((im) => ({
      src: big(im),
      alt: im.alt,
      cap: (im.closest("figure")?.querySelector("figcaption")?.textContent || im.alt || "").trim(),
    }));
    show(start);
    dlg.showModal();
    document.documentElement.classList.add("gallery-open");
  };
  dlg.addEventListener("close", () => document.documentElement.classList.remove("gallery-open"));

  strips.forEach((track) => {
    const imgs = [...track.querySelectorAll("img")];
    imgs.forEach((im, n) => {
      const hit = im.closest("figure") || im.parentElement;
      hit.classList.add("is-zoomable");
      hit.setAttribute("role", "button");
      hit.setAttribute("tabindex", "0");
      hit.setAttribute("aria-label", `${T("Открыть фото на весь экран")}: ${(im.alt || T("фото")).replace(/ — Rosso Corsa$/, "")}`);
      // a drag on the strip is not a tap: the strip's own handler swallows that click
      hit.addEventListener("click", () => open(track, n));
      hit.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(track, n);
        }
      });
    });
  });

  dlg.querySelector("[data-g-prev]").addEventListener("click", () => show(i - 1, -1));
  dlg.querySelector("[data-g-next]").addEventListener("click", () => show(i + 1, 1));
  dlg.querySelector("[data-g-close]").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg || e.target === stage) dlg.close();
  });
  dlg.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") show(i + 1, 1);
    if (e.key === "ArrowLeft") show(i - 1, -1);
  });
  // swipe between photos
  let x0 = null, y0 = 0;
  stage.addEventListener("pointerdown", (e) => { x0 = e.clientX; y0 = e.clientY; });
  stage.addEventListener("pointerup", (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0, dy = e.clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? show(i + 1, 1) : show(i - 1, -1);
    }
  });
  stage.addEventListener("pointercancel", () => (x0 = null));
})();
