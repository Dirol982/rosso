// Rosso Corsa: тема, сезонная плитка, лента отзывов, копирование координат.
// Запись, калькулятор, прайс с заказом, лента цеха и видео — в общем ../assets/js/main.js.
(function () {
  'use strict';
  var EN = (document.documentElement.lang || '').slice(0, 2) === 'en';
  var L = function (ru, en) { return EN ? en : ru; };

  /* Светлая и тёмная тема: выбор запоминается */
  var root = document.documentElement;
  var themeBtns = document.querySelectorAll('[data-theme-toggle]');
  var paintTheme = function () {
    var light = root.dataset.theme === 'light';
    themeBtns.forEach(function (b) {
      b.setAttribute('aria-label', light ? L('Тёмная тема', 'Dark theme') : L('Светлая тема', 'Light theme'));
      b.setAttribute('aria-pressed', String(light));
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', light ? '#f4f3f0' : '#0a0a0a');
  };
  themeBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
      try { localStorage.setItem('rosso-theme', root.dataset.theme); } catch (e) {}
      paintTheme();
    });
  });
  paintTheme();

  /* Время в Минске (UTC+3, без перехода на летнее время). Часы работы на сайте клиента не указаны,
     поэтому статуса «Открыто до…» нет: только сезонная плитка. */
  var now = new Date(Date.now() + 3 * 3600 * 1000);
  var month = now.getUTCMonth() + 1;

  /* Сезон для СТО */
  var SEASONS = [
    { months: [10, 11, 12], label: L('Сезон · октябрь–декабрь', 'Season · October–December'), title: L('Подготовка к зиме', 'Winter prep'),
      text: L('Шиномонтаж, замена антифриза, компьютерная диагностика.', 'Tyre fitting, coolant change, computer diagnostics.') },
    { months: [1, 2], label: L('Зима', 'Winter'), title: L('ТО и диагностика', 'Service and diagnostics'),
      text: L('Масло и фильтры, проверка электрики и стартера.', 'Oil and filters, electrics and starter check.') },
    { months: [3, 4, 5], label: L('Сезон · март–май', 'Season · March–May'), title: L('Весеннее ТО', 'Spring service'),
      text: L('Шиномонтаж, подвеска и тормоза после зимы.', 'Tyre fitting, suspension and brakes after winter.') },
    { months: [6, 7, 8, 9], label: L('Лето', 'Summer'), title: L('Перед отпуском', 'Before the holidays'),
      text: L('Диагностика подвески, тормоза, развал-схождение.', 'Suspension check, brakes, wheel alignment.') }
  ];
  var season = SEASONS.filter(function (s) { return s.months.indexOf(month) !== -1; })[0];
  if (season) {
    var set = function (sel, v) { var el = document.querySelector(sel); if (el) el.textContent = v; };
    set('[data-season-label]', season.label);
    set('[data-season-title]', season.title);
    set('[data-season-text]', season.text);
  }

  /* Лента отзывов: стрелки */
  var track = document.getElementById('reviewsTrack');
  document.querySelectorAll('[data-rv]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!track) return;
      var card = track.querySelector('.rv');
      var step = card ? card.getBoundingClientRect().width + 8 : 320;
      track.scrollBy({ left: step * +btn.getAttribute('data-rv'), behavior: 'smooth' });
    });
  });

  /* Копирование координат */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var label = btn.textContent;
      var done = function () { btn.textContent = L('Скопировано', 'Copied'); setTimeout(function () { btn.textContent = label; }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
    });
  });
})();
