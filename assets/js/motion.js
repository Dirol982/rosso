// Rosso Corsa: анимации и интерактив поверх базовых стилей.
// Проверка гарантии работает всегда; всё остальное движение — только без «уменьшить движение».
(function () {
  'use strict';
  var EN = (document.documentElement.lang || '').slice(0, 2) === 'en';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var fmt = new Intl.NumberFormat(EN ? 'en-GB' : 'ru-RU');

  /* ── Проверка гарантии: что наступит раньше — срок или пробег ── */
  document.querySelectorAll('[data-wc]').forEach(function (root) {
    var km = root.querySelector('[data-wc-km]');
    var mo = root.querySelector('[data-wc-mo]');
    var kmOut = root.querySelector('[data-wc-km-out]');
    var moOut = root.querySelector('[data-wc-mo-out]');
    // data-wc="days": второй ползунок считает дни (у Rosso Corsa гарантия 30 дней), иначе месяцы
    var days = root.dataset.wc === 'days';
    var months = function (n) {
      if (EN) return days ? (n === 1 ? 'day' : 'days') : (n === 1 ? 'month' : 'months');
      var a = n % 10, b = n % 100;
      var f = days ? ['день', 'дня', 'дней'] : ['месяц', 'месяца', 'месяцев'];
      return a === 1 && b !== 11 ? f[0] : a >= 2 && a <= 4 && (b < 12 || b > 14) ? f[1] : f[2];
    };
    var paint = function () {
      var k = +km.value, m = +mo.value;
      kmOut.textContent = fmt.format(k) + (EN ? ' km' : ' км');
      moOut.textContent = m + ' ' + months(m);
      km.style.setProperty('--fill', (k / +km.max * 100) + '%');
      mo.style.setProperty('--fill', (m / +mo.max * 100) + '%');
      root.querySelectorAll('[data-tier]').forEach(function (t) {
        var lk = +t.dataset.km, lm = +t.dataset.mo;
        var on = k < lk && m < lm;
        var left = Math.max(0, Math.min((lk - k) / lk, (lm - m) / lm));
        t.classList.toggle('is-on', on);
        t.classList.toggle('is-off', !on);
        t.style.setProperty('--left', on ? left.toFixed(3) : '0');
        t.querySelector('[data-state]').innerHTML = '<i></i>' + (on
          ? (EN ? 'Valid · ' + fmt.format(lk - k) + ' km or ' + (lm - m) + ' ' + months(lm - m) + ' left'
                : 'Действует · ещё ' + fmt.format(lk - k) + ' км или ' + (lm - m) + ' ' + months(lm - m))
          : (EN ? 'Expired' : 'Закончилась'));
      });
    };
    km.addEventListener('input', paint);
    mo.addEventListener('input', paint);
    paint();
  });

  if (reduce) return;
  var root = document.documentElement;
  root.classList.add('m');

  /* ── Буквы большого слова поднимаются по очереди ── */
  var l1 = document.querySelector('.mega__l1');
  if (l1) {
    var word = l1.textContent;
    l1.setAttribute('aria-hidden', 'true');
    l1.innerHTML = word.split('').map(function (c, i) {
      return '<span class="ch" style="--i:' + i + '">' + (c === ' ' ? '&nbsp;' : c) + '</span>';
    }).join('');
  }

  /* ── Полоса прогресса ── */
  var bar = document.createElement('div');
  bar.className = 'progress';
  bar.setAttribute('aria-hidden', 'true');
  bar.innerHTML = '<span></span>';
  document.body.prepend(bar);

  /* ── Появление при прокрутке, с задержкой внутри группы ── */
  var targets = '.sec__head > *, .bento--three > .tile, .visit > *, .steps li, .bento--svc > *, .rv, .wc > *, .wc__tier, .calc > .calc__panel, .contacts > *, .book__head, .booking, .book__row, .cinfo > div';
  var groups = new Map();
  document.querySelectorAll(targets).forEach(function (el) {
    if (el.closest('.hero')) return;
    var p = el.parentElement;
    var n = groups.get(p) || 0;
    groups.set(p, n + 1);
    el.setAttribute('data-in', '');
    el.style.setProperty('--d', Math.min(n, 8));
  });
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  document.querySelectorAll('[data-in]').forEach(function (el) { io.observe(el); });

  /* ── Прокрутка: прогресс, параллакс DSG, скорость бегущей строки ── */
  var dsgBg = document.querySelector('.tile--dsg .tile__bg');
  var tickerAnim = null;
  var ticker = document.querySelector('.ticker__track');
  if (ticker) {
    ticker.innerHTML += ticker.innerHTML;
    tickerAnim = ticker.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }], { duration: 38000, iterations: Infinity });
  }
  var lastY = scrollY, lastT = performance.now(), boost = 1, ticking = false;
  var frame = function () {
    ticking = false;
    var max = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty('--p', max > 0 ? (scrollY / max).toFixed(4) : 0);
    // скрытые за переходом по меню блоки тоже показываем
    document.querySelectorAll('[data-in]:not(.in)').forEach(function (el) {
      if (el.getBoundingClientRect().top < innerHeight * 0.92) { el.classList.add('in'); io.unobserve(el); }
    });
    if (dsgBg) {
      var r = dsgBg.parentElement.getBoundingClientRect();
      var p = (innerHeight - r.top) / (innerHeight + r.height);
      dsgBg.style.transform = 'translateY(' + ((p - 0.5) * -40).toFixed(1) + 'px) scale(1.12)';
    }
  };
  addEventListener('scroll', function () {
    var t = performance.now(), dy = Math.abs(scrollY - lastY) / Math.max(16, t - lastT);
    lastY = scrollY; lastT = t;
    boost = Math.min(6, 1 + dy * 4);
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }, { passive: true });
  if (tickerAnim) {
    (function decay() {
      tickerAnim.playbackRate += (boost - tickerAnim.playbackRate) * 0.12;
      boost += (1 - boost) * 0.06;
      requestAnimationFrame(decay);
    })();
  }
  frame();

  /* ── Подсветка под курсором и «магнитные» кнопки ── */
  if (fine) {
    document.addEventListener('pointermove', function (e) {
      var t = e.target.closest && e.target.closest('.tile');
      if (!t) return;
      var r = t.getBoundingClientRect();
      t.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      t.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
    document.querySelectorAll('.tile--cta, .top .btn, .check__submit, .booking .btn').forEach(function (b) {
      b.classList.add('magnet');
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / r.width, y = (e.clientY - r.top - r.height / 2) / r.height;
        b.style.transform = 'translate(' + (x * 8).toFixed(1) + 'px,' + (y * 6).toFixed(1) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }

  /* ── Цена добавленной работы «летит» в заказ-наряд ── */
  var items = document.querySelector('[data-calc-items]');
  var total = document.querySelector('.check__total');
  if (items && total) {
    items.addEventListener('click', function (e) {
      var b = e.target.closest('.calc__item');
      if (!b || b.getAttribute('aria-pressed') === 'true') return;
      var tr = total.getBoundingClientRect();
      if (tr.width === 0 || getComputedStyle(total.closest('.check')).visibility === 'hidden') return;
      var pr = b.querySelector('.calc__pr').getBoundingClientRect();
      var f = document.createElement('span');
      f.className = 'fly';
      f.textContent = b.querySelector('.calc__pr').textContent.replace(/\s+/g, ' ').trim();
      f.style.left = pr.left + 'px';
      f.style.top = pr.top + 'px';
      document.body.append(f);
      var dx = tr.right - 90 - pr.left, dy = tr.top - pr.top;
      f.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: 'translate(' + dx * 0.55 + 'px,' + (dy * 0.55 - 70) + 'px) scale(1.05)', opacity: 1, offset: 0.55 },
        { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.6)', opacity: 0 }
      ], { duration: 750, easing: 'cubic-bezier(.4,0,.2,1)' }).onfinish = function () {
        f.remove();
        total.classList.remove('ping');
        void total.offsetWidth;
        total.classList.add('ping');
      };
    }, true);
  }
})();
