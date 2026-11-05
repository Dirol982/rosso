# Собирает сайт Rosso Corsa: index.html, price.html, en/index.html, en/price.html.
# Все цены, адреса и отзывы взяты с rosso-corsa.by (ноябрь 2026). Запуск из корня репозитория:
#   python3 tools/build.py
import html
import json
import os
import re

BASE = 'https://dirol982.github.io/rosso/'
TEL1, TEL1_H = '+375295072150', '+375 29 507-21-50'   # Лещинского 10, основной
TEL2, TEL2_H = '+375447572150', '+375 44 757-21-50'   # Лещинского 10
TEL3, TEL3_H = '+375293222255', '+375 29 322-22-55'   # Матусевича 35к1
EMAIL = 'info@rosso-corsa.by'
REVIEWS_URL = 'https://goo.gl/maps/Zz1Lnob5kpXm1RcA8'

# Прайс клиента: раздел → [(работа, цена «от», BYN)]
PRICE = [
    ('Техническое обслуживание', 'Maintenance', [
        ('Замена масла двигателя', 'Engine oil change', 40),
        ('Замена масляного фильтра', 'Oil filter replacement', 30),
        ('Замена воздушного фильтра', 'Air filter replacement', 12),
        ('Замена салонного фильтра', 'Cabin filter replacement', 18),
        ('Замена топливного фильтра', 'Fuel filter replacement', 24),
        ('Замена масла МКПП', 'Manual gearbox oil change', 24),
        ('Замена жидкости ГУР', 'Power steering fluid change', 24),
        ('Замена антифриза', 'Coolant change', 36),
        ('Замена тормозной жидкости', 'Brake fluid change', 42),
        ('Замена масла АКПП', 'Automatic gearbox oil change', 60),
        ('Промывка радиатора печки', 'Heater core flush', 90),
    ]),
    ('Ремонт двигателя', 'Engine repair', [
        ('Диагностика ДВС', 'Engine diagnostics', 40),
        ('Замена прокладки клапанной крышки', 'Valve cover gasket replacement', 30),
        ('Замена прокладки поддона', 'Oil pan gasket replacement', 60),
        ('Замена ремня ГРМ', 'Timing belt replacement', 165),
        ('Замена маслосъёмных колпачков', 'Valve stem seal replacement', 180),
        ('Замена цепи ГРМ', 'Timing chain replacement', 360),
        ('Замена прокладки ГБЦ', 'Head gasket replacement', 400),
    ]),
    ('Ремонт подвески', 'Suspension repair', [
        ('Диагностика подвески', 'Suspension diagnostics', 30),
        ('Замена стоек стабилизатора', 'Stabiliser link replacement', 30),
        ('Замена шаровой опоры', 'Ball joint replacement', 30),
        ('Замена втулок стабилизатора', 'Stabiliser bush replacement', 42),
        ('Замена рычага подвески', 'Control arm replacement', 48),
        ('Развал-схождение', 'Wheel alignment', 50),
        ('Замена ступичного подшипника', 'Wheel bearing replacement', 60),
        ('Замена ШРУСа', 'CV joint replacement', 72),
        ('Замена амортизаторов', 'Shock absorber replacement', 120),
        ('Замена опорных подшипников', 'Strut mount bearing replacement', 120),
        ('Замена сайлентблоков рычага', 'Control arm bush replacement', 120),
        ('Замена сайлентблоков подрамника', 'Subframe bush replacement', 132),
    ]),
    ('Ремонт тормозной системы', 'Brake repair', [
        ('Проточка тормозных дисков', 'Brake disc skimming', 30),
        ('Замена тормозных барабанов', 'Brake drum replacement', 36),
        ('Замена тормозных трубок', 'Brake pipe replacement', 40),
        ('Замена тормозной жидкости + прокачка системы', 'Brake fluid change and bleeding', 42),
        ('Замена дисковых тормозных колодок', 'Disc brake pad replacement', 48),
        ('Замена тормозных шлангов', 'Brake hose replacement', 60),
        ('Ремонт суппортов', 'Caliper repair', 60),
        ('Замена барабанных тормозных колодок', 'Drum brake shoe replacement', 72),
        ('Ремонт ручника', 'Handbrake repair', 72),
        ('Замена главного тормозного цилиндра', 'Brake master cylinder replacement', 72),
    ]),
    ('Ремонт выхлопной системы', 'Exhaust repair', [
        ('Диагностика выхлопной системы', 'Exhaust diagnostics', 10),
        ('Замена хомутов/резинок', 'Exhaust clamp and hanger replacement', 12),
        ('Снятие и установка резонатора', 'Resonator removal and fitting', 36),
        ('Замена приёмной трубы', 'Downpipe replacement', 48),
        ('Снятие и установка глушителя', 'Silencer removal and fitting', 60),
        ('Замена гофры глушителя', 'Flex pipe replacement', 60),
        ('Замена катализатора', 'Catalytic converter replacement', 60),
    ]),
    ('Ремонт автоэлектрики', 'Auto electrics', [
        ('Компьютерная диагностика', 'Computer diagnostics', 40),
        ('Ремонт проводки', 'Wiring repair', 40),
        ('Ремонт электронных блоков', 'ECU repair', 40),
        ('Перепрограммирование электронных блоков', 'ECU reprogramming', 40),
        ('Ремонт электрооборудования', 'Electrical equipment repair', 40),
        ('Ремонт стартеров и генераторов', 'Starter and alternator repair', 50),
    ]),
    ('Колёса и шины', 'Wheels and tyres', [
        ('Ремонт шин и проколов', 'Tyre and puncture repair', 40),
        ('Правка и прокатка дисков', 'Wheel straightening', 40),
        ('Балансировка колёс', 'Wheel balancing', 50),
        ('Шиномонтаж', 'Tyre fitting', 100),
    ]),
]
N_WORKS = len({w for _, _, items in PRICE for w, _, _ in items})

BRANDS = ['BMW', 'Audi', 'Mercedes-Benz', 'Volkswagen', 'Ford', 'Renault', 'Peugeot', 'Citroën', 'Opel', 'Škoda',
          'Volvo', 'Porsche', 'Land Rover', 'Chevrolet', 'Geely', 'Haval', 'Chery', 'Alfa Romeo', 'Tesla']
BOOK_MAKES = ['BMW', 'Audi', 'Mercedes-Benz', 'Volkswagen', 'Ford', 'Renault', 'Peugeot', 'Citroën']

REVIEWS = [
    ('Maryna Kuleunich', 'Обслуживаю здесь уже 11 лет все авто — никаких нареканий, всегда быстро и качественно. Никогда не обижали мою старую красную «альфу» 😅',
     'I have been servicing all my cars here for 11 years — no complaints, always quick and well done. They never let down my old red Alfa 😅'),
    ('Aleksey Kharlamenkov', 'Отличный сервис! Обслуживал свою машину на Rosso Corsa, остался очень доволен. Понравился профессиональный подход: ребята знают своё дело, делают всё быстро и аккуратно. Цены адекватные, лишних услуг не навязывают, а запчасти подобрали оперативно. Теперь по вопросам ремонта — только к ним. Рекомендую!',
     'Great service! I had my car serviced at Rosso Corsa and was very pleased. I liked the professional approach: the guys know their job and work fast and neatly. Fair prices, no upselling, and parts were sourced quickly. From now on, only them for repairs. Recommended!'),
    ('Вадим Жигало', 'Ехал из Бреста, пропали тормоза. Алексей с учётом полной загрузки вошёл в положение и быстро поставил авто в ремонт, сделал всё качественно и пошёл навстречу, молодцы!',
     'I was driving from Brest and lost my brakes. Even though they were fully booked, Aleksey understood and got the car in quickly, did a quality job and went out of his way to help. Well done!'),
    ('Женя Василенко', 'Отличный сервис. Весь спектр услуг. С любой проблемой можно обратиться. У нас в семье две машины, и обе там обслуживаются. Огромная благодарность Александру.',
     'Great service. The full range of work — you can come with any problem. We have two cars in the family and both are serviced there. Many thanks to Aleksandr.'),
    ('Андрей Блинов', 'СТО топ! Качество на высоте. Отдельное спасибо мастеру Александру.',
     'Top garage! Excellent quality. Special thanks to Aleksandr the mechanic.'),
]

STRIP = [('w-diag', 'Компьютерная диагностика', 'Computer diagnostics'),
         ('w-team', 'Ремонт подвески', 'Suspension repair'),
         ('w-engine', 'Диагностика ДВС', 'Engine diagnostics'),
         ('w-pads', 'Тормозные колодки', 'Brake pads'),
         ('w-shock', 'Амортизаторы', 'Shock absorbers'),
         ('w-belt', 'Ремень ГРМ', 'Timing belt'),
         ('w-caliper', 'Ремонт суппортов', 'Caliper repair'),
         ('w-alt', 'Стартеры и генераторы', 'Starters and alternators'),
         ('w-cv', 'Замена ШРУСа', 'CV joint replacement'),
         ('w-exhaust', 'Выхлопная система', 'Exhaust system')]

e = html.escape


def price_of(name):
    for _, _, items in PRICE:
        for w, _, p in items:
            if w == name:
                return p
    raise KeyError(name)


def tr_name(name, lang):
    if lang == 'ru':
        return name
    for c, ce, items in PRICE:
        if c == name:
            return ce
        for w, we, _ in items:
            if w == name:
                return we
    raise KeyError(name)


T = {
    'ru': dict(
        skip='К содержанию', home='Rosso Corsa — на главную',
        nav=[('#calc', 'Стоимость'), ('#services', 'Услуги'), ('price.html', 'Прайс'), ('#workshop', 'Работы'), ('#reviews', 'Отзывы'), ('#contacts', 'Контакты')],
        sections='Разделы', status='Минск · с 2005', light='Светлая тема', book='Записаться',
        title='Rosso Corsa — СТО в Минске на Лещинского и Матусевича',
        desc='Автосервис Rosso Corsa в Минске с 2005 года: ТО, ремонт двигателя, подвески, тормозов, выхлопа, автоэлектрики, шиномонтаж. Цены «от» до визита, гарантия 30 дней или 2 000 км.',
        coord='СТО <b>/</b> Минск, ул. Лещинского, 10 <b>/</b> ул. Матусевича, 35к1',
        l1='Rosso Corsa', l2='СТО в Минске <b>с 2005</b>',
        h1_label='Rosso Corsa — СТО в Минске с 2005 года',
        hero_alt='Мастер Rosso Corsa проводит компьютерную диагностику в салоне автомобиля',
        hero_cap='Европейские, американские, корейские, китайские и японские марки. От замены масла до капремонта.',
        season='Сезон', season_t='Подготовка к зиме', season_x='Шиномонтаж, замена антифриза, компьютерная диагностика.',
        war_l='Гарантия', war_n='30', war_u='&nbsp;дней', war_x='или 2 000 км пробега на все виды ремонта',
        addr_l='Два адреса', addr_t='Лещинского 10 · Матусевича 35к1',
        cta_l='Заказ-наряд онлайн', cta='Цена до визита',
        about_l='01 / Подход', about_h='С 2005 года',
        about=[('Опыт', 'Более 20 лет', 'Опытные автомеханики и диагносты, современное оборудование. Обслуживаем большинство популярных марок.'),
               ('Диагностика', 'Сначала причина', 'Перед ремонтом проводим диагностику и согласуем объём и стоимость работ.'),
               ('Смета', 'Без скрытых платежей', 'Понятная смета и заказ-наряд. Можно привезти свои запчасти или подобрать у нас.')],
        calc_l='02 / Стоимость', calc_h='Цена до визита',
        calc_x='Отметьте работы или нажмите на то, что беспокоит. Цены «от», без запчастей, одни для всех марок. Точную стоимость назовём после диагностики.',
        calc_hint='Цены одинаковы для всех марок', search='Поиск работы', search_ph='Колодки, ГРМ, масло, шиномонтаж…',
        sym='Что беспокоит?', cats='Раздел прайса', count='Работ в прайсе',
        check='Заказ-наряд', clear='Очистить', close='Свернуть расчёт', total='Итого',
        fine='От минимальной цены, без запчастей. Согласуем до начала работ.', model='Модель, год, двигатель', model_ph='Ford Focus 2015, 1.6',
        when='Когда удобно', where='Куда отправить', submit='Записаться с этим расчётом', copy='Скопировать',
        visit_l='03 / Порядок', visit_h='Визит', visit_alt='Замена масла в двигателе в Rosso Corsa',
        steps=[('Предложение', 'Расскажите, что нужно автомобилю. Подготовим честную смету.'),
               ('Запись', 'Расчёт на сайте или звонок. Согласуем удобное время.'),
               ('Заезд', 'Лещинского, 10 или Матусевича, 35к1. Вы оставляете авто — мы работаем.'),
               ('Выдача', 'Забираете исправный автомобиль. Гарантия 30 дней или 2 000 км.')],
        svc_l='04 / Услуги', svc_h='Услуги', svc_all='Весь прайс и заказ ↗',
        svc_big=('Диагностика ДВС · ГРМ · ГБЦ', 'Ремонт двигателя', 'Диагностика, ремни и цепи ГРМ, прокладки и колпачки. Объём работ согласуем после диагностики.', 'Записаться на ремонт ↗'),
        svc_big_alt='Компьютерная диагностика автомобиля в Rosso Corsa',
        svc=[('Масло · фильтры · жидкости', 'Техническое обслуживание', ['Замена масла двигателя', 'Замена масляного фильтра', 'Замена антифриза', 'Замена масла АКПП']),
             ('Ходовая · развал', 'Подвеска', ['Диагностика подвески', 'Развал-схождение', 'Замена ШРУСа', 'Замена амортизаторов']),
             ('Колодки · диски · суппорты', 'Тормоза', ['Проточка тормозных дисков', 'Замена дисковых тормозных колодок', 'Ремонт суппортов', 'Ремонт ручника']),
             ('Глушитель · катализатор', 'Выхлоп', ['Диагностика выхлопной системы', 'Замена гофры глушителя', 'Замена катализатора', 'Снятие и установка глушителя']),
             ('Диагностика · блоки · проводка', 'Автоэлектрика', ['Компьютерная диагностика', 'Ремонт проводки', 'Перепрограммирование электронных блоков', 'Ремонт стартеров и генераторов']),
             ('Шиномонтаж · балансировка', 'Колёса и шины', ['Ремонт шин и проколов', 'Правка и прокатка дисков', 'Балансировка колёс', 'Шиномонтаж'])],
        frm='от',
        wc_l='Гарантия', wc_h='Проверьте гарантию',
        wc_x='Сдвиньте ползунки: сколько прошло после ремонта у нас. Действует, пока не наступило одно из двух — 30 дней или 2 000 км.',
        wc_km='Пробег после ремонта', wc_d='Прошло после ремонта', wc_hint='Считается по условиям гарантии Rosso Corsa.',
        wc_tier='Все виды ремонта', wc_terms='2 000 км · 30 дней', wc_kmv='1 500 км', wc_dv='20 дней',
        wc_note='На все виды ремонта Rosso Corsa даёт гарантию 2 000 км пробега или 30 дней — что наступит раньше.',
        ws_l='05 / Работы', ws_h='Работы', ws_prev='Предыдущие фото', ws_next='Следующие фото', ws_region='Фото работ: листайте пальцем, мышью или стрелками',
        rv_l='06 / Отзывы', rv_h='Отзывы', rv_prev='Предыдущие отзывы', rv_next='Следующие отзывы', rv_aria='Отзывы клиентов',
        rv_src='Отзыв в Google', rv_more_l='Google Карты', rv_more='Все отзывы',
        bk_head='В мессенджер · готовый текст заявки', bk_make='Марка', bk_other='Другая марка',
        bk_task='Что нужно сделать', bk_task_ph='ТО, стук в подвеске, колодки…', bk_where='Куда', bk_send='Отправить ↗',
        bk_status='Заявка откроется в мессенджере с готовым текстом.', bk_call='Или позвоните',
        bk_tasks=['Техническое обслуживание', 'Компьютерная диагностика', 'Ремонт двигателя', 'Ремонт подвески', 'Ремонт тормозной системы', 'Ремонт выхлопной системы', 'Ремонт автоэлектрики', 'Шиномонтаж'],
        ct_l='07 / Контакты', ct_h='Лещинского, 10',
        ct=[('Адрес', 'Минск, ул. Лещинского, 10'),
            ('Телефоны', None),
            ('Второй адрес', 'Минск, ул. Матусевича, 35к1'),
            ('Почта', None)],
        ct_map_y='Яндекс Карты', ct_map_g='Google Maps', ct_req='Реквизиты',
        req=[('Организация', 'ООО «Россо Корса»'), ('Адрес', '220140, РБ, г. Минск, ул. Лещинского 10, пом. 3, офис 7'),
             ('УНП', '191257538'), ('ОКПО', '378922525000'), ('Тел/факс', '365-55-33')],
        map_title='Rosso Corsa на карте: Минск, ул. Лещинского, 10',
        map_q='Минск, улица Лещинского, 10',
        brands_l='Марки', foot='© ООО «Россо Корса», УНП 191257538. Марки автомобилей принадлежат их владельцам.',
        quick='Быстрая связь', dock_sum='Ваш расчёт', dock_empty='пока пусто', dock_call='Позвонить', dock_btn='Предчек',
        lang_href='en/', lang_txt='EN', lang_label='English version', lang_attr='en',
        # прайс
        p_title='Прайс Rosso Corsa — стоимость работ СТО в Минске',
        p_desc='Стоимость работ автосервиса Rosso Corsa в Минске: ТО, двигатель, подвеска, тормоза, выхлоп, автоэлектрика, шиномонтаж. Цены от, BYN.',
        p_coord='Прайс <b>/</b> все марки <b>/</b> цены от, BYN', p_l1='Стоимость', p_l2='работ',
        p_x='Цена зависит от модели и состояния автомобиля. Отметьте работы — подытог внизу — и оформите заказ.',
        p_viber='Точная цена в Viber ↗', p_search='Поиск по услугам', p_search_ph='Найти услугу: колодки, ГРМ, шиномонтаж…',
        p_cats='Разделы прайса', p_svc='Услуга', p_price='Цена от, BYN',
        p_empty='Ничего не нашли. Напишите нам в <a href="viber://chat?number=%2B375295072150">Viber</a> или позвоните <a class="num" href="tel:+375295072150">+375 29 507-21-50</a> — подскажем стоимость.',
        p_more_h='Нет нужной работы?', p_more_x='Выполняем ремонт любой сложности. Опишите задачу — назовём стоимость после диагностики.', p_more_btn='Оставить заявку',
        p_lang_href='en/price.html',
    ),
    'en': dict(
        skip='Skip to content', home='Rosso Corsa — home',
        nav=[('#calc', 'Price'), ('#services', 'Services'), ('price.html', 'Price list'), ('#workshop', 'Work'), ('#reviews', 'Reviews'), ('#contacts', 'Contacts')],
        sections='Sections', status='Minsk · since 2005', light='Light theme', book='Book',
        title='Rosso Corsa — car service in Minsk, Leshchinskogo and Matusevicha',
        desc='Rosso Corsa car service in Minsk since 2005: maintenance, engine, suspension, brakes, exhaust, auto electrics, tyre fitting. Prices before you visit, 30 days or 2,000 km warranty.',
        coord='Car service <b>/</b> Minsk, Leshchinskogo 10 <b>/</b> Matusevicha 35k1',
        l1='Rosso Corsa', l2='Car service <b>since 2005</b>',
        h1_label='Rosso Corsa — car service in Minsk since 2005',
        hero_alt='A Rosso Corsa technician running computer diagnostics inside a car',
        hero_cap='European, American, Korean, Chinese and Japanese makes. From an oil change to an engine rebuild.',
        season='Season', season_t='Winter prep', season_x='Tyre fitting, coolant change, computer diagnostics.',
        war_l='Warranty', war_n='30', war_u='&nbsp;days', war_x='or 2,000 km on all repair work',
        addr_l='Two locations', addr_t='Leshchinskogo 10 · Matusevicha 35k1',
        cta_l='Online work order', cta='Price before you visit',
        about_l='01 / Approach', about_h='Since 2005',
        about=[('Experience', 'Over 20 years', 'Experienced mechanics and diagnosticians, modern equipment. We service most popular makes.'),
               ('Diagnostics', 'Cause first', 'Before any repair we diagnose the car and agree the scope and price with you.'),
               ('Estimate', 'No hidden fees', 'A clear estimate and work order. Bring your own parts or let us source them.')],
        calc_l='02 / Price', calc_h='Price before you visit',
        calc_x='Tick jobs or tap what’s wrong. Prices are “from”, labour only, the same for every make. We confirm the exact price after diagnostics.',
        calc_hint='Same prices for every make', search='Search jobs', search_ph='Pads, timing belt, oil, tyres…',
        sym='What’s wrong?', cats='Price list section', count='Jobs in the list',
        check='Work order', clear='Clear', close='Close estimate', total='Total',
        fine='From the minimum price, parts not included. Agreed before work starts.', model='Model, year, engine', model_ph='Ford Focus 2015, 1.6',
        when='Preferred day', where='Send to', submit='Book with this estimate', copy='Copy',
        visit_l='03 / How it works', visit_h='Visit', visit_alt='Engine oil change at Rosso Corsa',
        steps=[('Quote', 'Tell us what your car needs. We prepare an honest estimate.'),
               ('Booking', 'Estimate online or call us. We agree a convenient time.'),
               ('Drop-off', 'Leshchinskogo 10 or Matusevicha 35k1. You leave the car — we get to work.'),
               ('Pick-up', 'Collect your car in working order. 30 days or 2,000 km warranty.')],
        svc_l='04 / Services', svc_h='Services', svc_all='Full price list ↗',
        svc_big=('Diagnostics · timing · head gasket', 'Engine repair', 'Diagnostics, timing belts and chains, gaskets and seals. Scope agreed after diagnostics.', 'Book engine repair ↗'),
        svc_big_alt='Computer diagnostics at Rosso Corsa',
        svc=[('Oil · filters · fluids', 'Maintenance', ['Замена масла двигателя', 'Замена масляного фильтра', 'Замена антифриза', 'Замена масла АКПП']),
             ('Chassis · alignment', 'Suspension', ['Диагностика подвески', 'Развал-схождение', 'Замена ШРУСа', 'Замена амортизаторов']),
             ('Pads · discs · calipers', 'Brakes', ['Проточка тормозных дисков', 'Замена дисковых тормозных колодок', 'Ремонт суппортов', 'Ремонт ручника']),
             ('Silencer · catalyst', 'Exhaust', ['Диагностика выхлопной системы', 'Замена гофры глушителя', 'Замена катализатора', 'Снятие и установка глушителя']),
             ('Diagnostics · ECUs · wiring', 'Auto electrics', ['Компьютерная диагностика', 'Ремонт проводки', 'Перепрограммирование электронных блоков', 'Ремонт стартеров и генераторов']),
             ('Tyre fitting · balancing', 'Wheels and tyres', ['Ремонт шин и проколов', 'Правка и прокатка дисков', 'Балансировка колёс', 'Шиномонтаж'])],
        frm='from',
        wc_l='Warranty', wc_h='Check your warranty',
        wc_x='Move the sliders: how long since your repair with us. It is valid until one of the two comes first — 30 days or 2,000 km.',
        wc_km='Mileage since repair', wc_d='Time since repair', wc_hint='Based on the Rosso Corsa warranty terms.',
        wc_tier='All repair work', wc_terms='2,000 km · 30 days', wc_kmv='1,500 km', wc_dv='20 days',
        wc_note='Rosso Corsa gives a warranty of 2,000 km or 30 days on all repair work — whichever comes first.',
        ws_l='05 / Work', ws_h='Work', ws_prev='Previous photos', ws_next='Next photos', ws_region='Work photos: swipe, drag or use the arrow keys',
        rv_l='06 / Reviews', rv_h='Reviews', rv_prev='Previous reviews', rv_next='Next reviews', rv_aria='Customer reviews',
        rv_src='Google review', rv_more_l='Google Maps', rv_more='All reviews',
        bk_head='To your messenger · request text ready', bk_make='Make', bk_other='Other make',
        bk_task='What needs doing', bk_task_ph='Service, suspension knock, pads…', bk_where='Send to', bk_send='Send ↗',
        bk_status='Your request opens in the messenger, ready to send.', bk_call='Or call',
        bk_tasks=['Maintenance', 'Computer diagnostics', 'Engine repair', 'Suspension repair', 'Brake repair', 'Exhaust repair', 'Auto electrics', 'Tyre fitting'],
        ct_l='07 / Contacts', ct_h='Leshchinskogo 10',
        ct=[('Address', 'Minsk, Leshchinskogo St, 10'),
            ('Phones', None),
            ('Second location', 'Minsk, Matusevicha St, 35k1'),
            ('Email', None)],
        ct_map_y='Yandex Maps', ct_map_g='Google Maps', ct_req='Company details',
        req=[('Company', 'Rosso Korsa LLC (ООО «Россо Корса»)'), ('Address', '220140, Minsk, Leshchinskogo St 10, premises 3, office 7'),
             ('Tax ID (UNP)', '191257538'), ('OKPO', '378922525000'), ('Tel/fax', '365-55-33')],
        map_title='Rosso Corsa on the map: Minsk, Leshchinskogo St, 10',
        map_q='Минск, улица Лещинского, 10',
        brands_l='Makes', foot='© Rosso Korsa LLC, UNP 191257538. Car brands belong to their owners.',
        quick='Quick contact', dock_sum='Your estimate', dock_empty='empty for now', dock_call='Call', dock_btn='Estimate',
        lang_href='../', lang_txt='RU', lang_label='Русская версия', lang_attr='ru',
        p_title='Rosso Corsa price list — car service prices in Minsk',
        p_desc='Rosso Corsa car service prices in Minsk: maintenance, engine, suspension, brakes, exhaust, auto electrics, tyres. Prices from, BYN.',
        p_coord='Price list <b>/</b> all makes <b>/</b> prices from, BYN', p_l1='Prices', p_l2='labour',
        p_x='The price depends on the model and the car’s condition. Tick jobs — the subtotal is at the bottom — and check out.',
        p_viber='Exact price on Viber ↗', p_search='Search services', p_search_ph='Find a job: pads, timing belt, tyres…',
        p_cats='Price list sections', p_svc='Service', p_price='Price from, BYN',
        p_empty='Nothing found. Message us on <a href="viber://chat?number=%2B375295072150">Viber</a> or call <a class="num" href="tel:+375295072150">+375 29 507-21-50</a> — we’ll tell you the price.',
        p_more_h='Can’t find the job?', p_more_x='We take on repairs of any complexity. Describe the problem — we’ll price it after diagnostics.', p_more_btn='Send a request',
        p_lang_href='../price.html',
    ),
}

THEME_BTN = '''<button class="tool tool--theme" type="button" data-theme-toggle aria-label="{light}"><svg class="i-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg><svg class="i-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></svg></button>'''
ARROW = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"></path></svg>'


def head(lang, up, title, desc, path, alt_path):
    other = 'ru' if lang == 'en' else 'en'
    return f'''<!doctype html>
<html class="v4" lang="{lang}" data-currency="BYN">
<head>
<script>try{{var t=localStorage.getItem("rosso-theme");if(t)document.documentElement.dataset.theme=t}}catch(e){{}}</script>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="format-detection" content="telephone=no">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta name="theme-color" content="#0a0a0a">
<link rel="canonical" href="{BASE}{path}">
<meta property="og:type" content="website">
<meta property="og:locale" content="{'en_GB' if lang == 'en' else 'ru_RU'}">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:image" content="{BASE}assets/img/hero.webp">
<link rel="icon" type="image/png" href="{up}favicon.png">
<link rel="apple-touch-icon" href="{up}apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@300;500;700;800&family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">
<link rel="alternate" hreflang="{other}" href="{BASE}{alt_path}">
<link rel="stylesheet" href="{up}assets/css/style.css">
<link rel="stylesheet" href="{up}assets/css/motion.css">
</head>
<body>

<a class="skip" href="#main">{T[lang]['skip']}</a>
'''


def header(lang, up, page):
    t = T[lang]
    pre = '' if page == 'index' else 'index.html'
    nav = '\n'.join(f'      <a href="{h if h.endswith(".html") else pre + h}">{n}</a>' for h, n in t['nav'])
    lang_href = t['lang_href'] if page == 'index' else t['p_lang_href']
    return f'''<header class="top" data-header>
  <div class="top__in">
    <a class="brand" href="./" aria-label="{t['home']}"><img class="logo-on-dark" src="{up}assets/img/logo-light.webp" alt="Rosso Corsa" width="225" height="90"><img class="logo-on-light" src="{up}assets/img/logo-dark.webp" alt="" width="225" height="90"></a>
    <nav class="nav" aria-label="{t['sections']}">
{nav}
    </nav>
    <span class="status"><i></i><span>{t['status']}</span></span>
    <div class="tools">
      <a class="tool tool--lang" href="{lang_href}" hreflang="{t['lang_attr']}" lang="{t['lang_attr']}" aria-label="{t['lang_label']}">{t['lang_txt']}</a>
      {THEME_BTN.format(light=t['light'])}
    </div>
    <a class="btn btn--sm" href="{pre}#book">{t['book']}</a>
  </div>
</header>
'''


def footer(lang, up):
    t = T[lang]
    return f'''<footer class="foot">
  <div class="wrap foot__in">
    <img class="logo-on-dark" src="{up}assets/img/logo-light.webp" alt="Rosso Corsa" width="110" height="44" loading="lazy"><img class="logo-on-light" src="{up}assets/img/logo-dark.webp" alt="Rosso Corsa" width="110" height="44" loading="lazy">
    <p class="partners"><span class="label">{t['brands_l']}</span> {' · '.join(BRANDS[:12])}</p>
    <p class="tiny muted">{t['foot']}<br><a href="mailto:{EMAIL}">{EMAIL}</a> · <a href="tel:{TEL1}">{TEL1_H}</a></p>
  </div>
</footer>
'''


def scripts(up):
    return f'''<script src="{up}assets/js/main.js" defer></script>
<script src="{up}assets/js/tw.js" defer></script>
<script src="{up}assets/js/motion.js" defer></script>
</body>
</html>
'''


def plist(names, lang):
    rows = ''.join(f'<tr><th scope="row">{e(tr_name(n, lang))}</th><td>{T[lang]["frm"]} {price_of(n)}</td></tr>' for n in names)
    return f'<table class="list"><tbody>{rows}</tbody></table>'


def index(lang):
    t = T[lang]
    up = '' if lang == 'ru' else '../'
    path = '' if lang == 'ru' else 'en/'
    calc = [{'id': 'all', 'name': t['calc_hint'], 'cats': [
        {'name': tr_name(c, lang), 'items': [{'name': tr_name(w, lang), 'price': p} for w, _, p in items]} for c, _, items in PRICE]}]
    works = {}
    if lang == 'en':
        for c, ce, items in PRICE:
            works[c] = ce
            for w, we, _ in items:
                works[w] = we
    ticker = ''.join(f'<span>{e(b)}<i>·</i></span>' for b in BRANDS)
    about = ''.join(f'''
      <li class="tile">
        <p class="tile__k mono">{k}</p>
        <h3 class="h3">{h}</h3>
        <p class="muted">{x}</p>
      </li>''' for k, h, x in t['about'])
    steps = ''.join(f'<li><h3>{h}</h3><p>{x}</p></li>' for h, x in t['steps'])
    big = t['svc_big']
    svc = ''.join(f'''
      <article class="tile">
        <p class="label">{lab}</p>
        <h3 class="h3">{h}</h3>
        {plist(names, lang)}
      </article>
''' for lab, h, names in t['svc'])
    strip = ''.join(
        f'<figure><img src="{up}assets/img/{f}.webp" alt="{e(ru if lang == "ru" else en)} — Rosso Corsa" loading="lazy" decoding="async"><figcaption>{e(ru if lang == "ru" else en)}</figcaption></figure>'
        for f, ru, en in STRIP)
    reviews = ''.join(
        f'<blockquote class="rv{" rv--accent" if i == 0 else ""}"><p>{e(ru if lang == "ru" else en)}</p><footer><b>{e(name)}</b><span>{t["rv_src"]}</span></footer></blockquote>'
        for i, (name, ru, en) in enumerate(REVIEWS))
    makes = ''.join(f'<label><input type="radio" name="make" value="{e(m)}"><span>{e(m)}</span></label>' for m in BOOK_MAKES)
    makes += f'<label><input type="radio" name="make" value="{t["bk_other"]}"><span>{t["bk_other"]}</span></label>'
    tasks = ''.join(f'<option value="{e(x)}">' for x in t['bk_tasks'])
    ct = t['ct']
    msg = f'<a href="https://t.me/%2B375295072150" target="_blank" rel="noopener">Telegram</a> · <a href="viber://chat?number=%2B375295072150">Viber</a> · <a href="https://wa.me/375295072150" target="_blank" rel="noopener">WhatsApp</a>'
    req = ''.join(f'<div><dt>{k}</dt><dd{" class=\"mono\"" if k in ("УНП", "ОКПО", "Tax ID (UNP)", "OKPO") else ""}>{v}</dd></div>' for k, v in t['req'])
    import urllib.parse as up_
    mqe = up_.quote(t['map_q'])
    i18n = f'\n<script type="application/json" data-i18n-works>{json.dumps(works, ensure_ascii=False)}</script>' if lang == 'en' else ''

    body = f'''{header(lang, up, 'index')}
<main id="main">

<section class="hero">
  <div class="wrap">
    <p class="coord mono">{t['coord']}</p>
    <h1 class="mega" aria-label="{t['h1_label']}">
      <span class="mega__l1">{t['l1']}</span>
      <span class="mega__l2"><span>{t['l2']}</span><span class="mega__dash" aria-hidden="true"></span></span>
    </h1>

    <div class="bento bento--hero">
      <figure class="tile tile--photo tile--hero">
        <img src="{up}assets/img/hero.webp" srcset="{up}assets/img/hero-720.webp 720w, {up}assets/img/hero.webp 1600w" sizes="(max-width: 1000px) 100vw, 50vw" alt="{t['hero_alt']}" width="1600" height="1066" fetchpriority="high">
        <figcaption class="mono">{t['hero_cap']}</figcaption>
      </figure>

      <div class="tile tile--season">
        <p class="label" data-season-label>{t['season']}</p>
        <p class="tile__big" data-season-title>{t['season_t']}</p>
        <p class="muted" data-season-text>{t['season_x']}</p>
      </div>

      <div class="tile tile--spec">
        <p class="label">{t['war_l']}</p>
        <p class="tile__huge">{t['war_n']}<span>{t['war_u']}</span></p>
        <p class="muted">{t['war_x']}</p>
      </div>

      <div class="tile tile--open">
        <p class="label">{t['addr_l']}</p>
        <p class="tile__big">{t['addr_t']}</p>
        <p class="muted"><a href="tel:{TEL1}">{TEL1_H}</a><br><a href="tel:{TEL3}">{TEL3_H}</a></p>
      </div>

      <a class="tile tile--cta" href="#calc">
        <span class="label">{t['cta_l']}</span>
        <span class="tile__cta">{t['cta']} <span aria-hidden="true">↗</span></span>
      </a>
    </div>
  </div>
</section>

<div class="ticker" aria-hidden="true"><div class="ticker__track">{ticker}</div></div>

<section class="sec" id="about">
  <div class="wrap">
    <div class="sec__head">
      <p class="label">{t['about_l']}</p>
      <h2 class="h2">{t['about_h']}</h2>
    </div>
    <ul class="bento bento--three">{about}
    </ul>
  </div>
</section>

<section class="sec sec--panel" id="calc" data-calc>
  <script type="application/json" data-calc-data>{json.dumps(calc, ensure_ascii=False)}</script>
  <div class="wrap">
    <div class="sec__head">
      <p class="label">{t['calc_l']}</p>
      <h2 class="h2">{t['calc_h']}</h2>
      <p class="muted lede">{t['calc_x']}</p>
    </div>

    <div class="calc">
      <div class="calc__panel">
        <div class="calc__top">
          <small class="calc__hint">{t['calc_hint']}</small>
        </div>
        <label class="calc__search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.4-4.4"/></svg><span class="sr">{t['search']}</span><input type="search" placeholder="{t['search_ph']}" autocomplete="off" data-calc-search><span class="calc__found" data-calc-found aria-live="polite"></span></label>
        <div class="calc__sym"><span class="calc__sym-l">{t['sym']}</span><div class="calc__sym-row" data-calc-sym></div></div>
        <div class="calc__cats" role="tablist" aria-label="{t['cats']}" data-calc-cats></div>
        <div class="calc__items" data-calc-items></div>
        <div class="calc__foot" data-calc-foot></div>
        <p class="sr">{t['count']}: <span data-calc-count>{N_WORKS}</span></p>
      </div>

      <div class="calc__backdrop" data-check-backdrop hidden></div>
      <form class="check" id="precheck" aria-labelledby="check-title" data-check novalidate>
        <div class="check__top">
          <h3 id="check-title">{t['check']}</h3>
          <button type="button" class="check__clear" data-check-clear hidden>{t['clear']}</button>
          <button type="button" class="check__close" data-check-close aria-label="{t['close']}"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19"/></svg></button>
        </div>
        <p class="check__meta" data-check-meta>Rosso Corsa</p>
        <ul class="check__lines" role="list" data-check-lines></ul>
        <div class="check__total"><span>{t['total']}</span><strong class="num"><span data-check-sum>0</span> <small>BYN</small></strong></div>
        <p class="check__fine">{t['fine']}</p>
        <div class="check__book" data-check-book hidden>
          <label class="check__label" for="check-model">{t['model']}</label>
          <input id="check-model" class="check__input" name="model" type="text" placeholder="{t['model_ph']}" autocomplete="off">
          <span class="check__label">{t['when']}</span>
          <div class="check__days" data-check-days></div>
          <div class="check__slots" data-check-slots></div>
          <span class="check__label">{t['where']}</span>
          <div class="check__ch" role="radiogroup" aria-label="{t['where']}">
            <label><input type="radio" name="ch" value="telegram" checked><span>Telegram</span></label>
            <label><input type="radio" name="ch" value="viber"><span>Viber</span></label>
            <label><input type="radio" name="ch" value="whatsapp"><span>WhatsApp</span></label>
          </div>
        </div>
        <button class="btn check__submit" type="submit" data-check-submit>{t['submit']}</button>
        <div class="check__row"><button type="button" class="check__copy" data-check-copy>{t['copy']}</button><a href="tel:{TEL1}">{TEL1_H}</a></div>
      </form>
    </div>
    <div class="toast" data-toast role="status" aria-live="polite"></div>
  </div>
</section>

<section class="sec" id="visit">
  <div class="wrap visit">
    <figure class="visit__fig">
      <img src="{up}assets/img/oil.webp" srcset="{up}assets/img/oil-720.webp 720w, {up}assets/img/oil.webp 1440w" sizes="(max-width: 860px) 100vw, 50vw" alt="{t['visit_alt']}" width="1440" height="960" loading="lazy">
    </figure>
    <div class="visit__body">
      <p class="label">{t['visit_l']}</p>
      <h2 class="h2">{t['visit_h']}</h2>
      <ol class="steps">
        {steps}
      </ol>
    </div>
  </div>
</section>

<section class="sec sec--panel" id="services">
  <div class="wrap">
    <div class="sec__head sec__head--row">
      <div>
        <p class="label">{t['svc_l']}</p>
        <h2 class="h2">{t['svc_h']}</h2>
      </div>
      <a class="btn btn--ghost" href="price.html">{t['svc_all']}</a>
    </div>

    <div class="bento bento--svc">
      <article class="tile tile--storage tile--dsg" id="engine">
        <div class="tile__bg" role="img" aria-label="{t['svc_big_alt']}" style="background-image:url('{up}assets/img/diag.webp')"></div>
        <div class="tile__inner">
          <p class="label">{big[0]}</p>
          <h3 class="h3 h3--lg">{big[1]}</h3>
          <p class="muted">{big[2]}</p>
          {plist(['Диагностика ДВС', 'Замена ремня ГРМ', 'Замена цепи ГРМ', 'Замена прокладки ГБЦ'], lang)}
          <a class="btn" href="#calc" data-pick-task="{e(tr_name('Ремонт двигателя', lang))}">{big[3]}</a>
        </div>
      </article>
{svc}    </div>
  </div>
</section>

<section class="sec" id="warranty">
  <div class="wrap">
    <div class="sec__head">
      <p class="label">{t['wc_l']}</p>
      <h2 class="h2">{t['wc_h']}</h2>
      <p class="muted lede">{t['wc_x']}</p>
    </div>
    <div class="wc" data-wc="days">
      <div class="tile wc__ctrl">
        <div class="wc__row"><div class="wc__top"><label class="label" for="wc-km">{t['wc_km']}</label><output class="wc__val num" for="wc-km" data-wc-km-out>{t['wc_kmv']}</output></div>
          <input type="range" id="wc-km" min="0" max="4000" step="100" value="1500" data-wc-km></div>
        <div class="wc__row"><div class="wc__top"><label class="label" for="wc-mo">{t['wc_d']}</label><output class="wc__val num" for="wc-mo" data-wc-mo-out>{t['wc_dv']}</output></div>
          <input type="range" id="wc-mo" min="0" max="60" step="1" value="20" data-wc-mo></div>
        <p class="wc__hint">{t['wc_hint']}</p>
      </div>
      <div class="wc__tiers" aria-live="polite"><div class="tile wc__tier" data-tier data-km="2000" data-mo="30"><p class="label">{t['wc_tier']}</p><p class="tile__big">{t['wc_terms']}</p><p class="wc__state" data-state><i></i></p><div class="wc__bar"><span></span></div></div></div>
    </div>
    <p class="tiny muted" style="margin-top:14px">{t['wc_note']}</p>
  </div>
</section>

<section class="sec" id="workshop" data-swipe>
  <div class="wrap">
    <div class="sec__head sec__head--row">
      <div>
        <p class="label">{t['ws_l']}</p>
        <h2 class="h2">{t['ws_h']}</h2>
      </div>
      <div class="rv-nav">
        <button class="rv-btn" type="button" data-swipe-prev aria-label="{t['ws_prev']}">←</button>
        <button class="rv-btn" type="button" data-swipe-next aria-label="{t['ws_next']}">→</button>
      </div>
    </div>
  </div>
  <div class="strip" data-swipe-track tabindex="0" role="region" aria-label="{t['ws_region']}">{strip}</div>
  <div class="strip-bar" data-swipe-bar aria-hidden="true"><div class="strip-track"><span></span></div></div>
</section>

<section class="sec sec--panel" id="reviews">
  <div class="wrap">
    <div class="sec__head sec__head--row">
      <div>
        <p class="label">{t['rv_l']}</p>
        <h2 class="h2">{t['rv_h']}</h2>
      </div>
      <div class="rv-nav">
        <button class="rv-btn" type="button" data-rv="-1" aria-label="{t['rv_prev']}">←</button>
        <button class="rv-btn" type="button" data-rv="1" aria-label="{t['rv_next']}">→</button>
      </div>
    </div>
  </div>
  <div class="reviews" id="reviewsTrack" tabindex="0" aria-label="{t['rv_aria']}">
    {reviews}
    <a class="rv rv--more" href="{REVIEWS_URL}" target="_blank" rel="noopener">
      <span class="label">{t['rv_more_l']}</span>
      <span class="rv__more">{t['rv_more']} <span aria-hidden="true">↗</span></span>
    </a>
  </div>
</section>

<section class="book" id="book">
  <div class="wrap">
    <div class="book__head"><span class="label">{t['bk_head']}</span><span class="book__arrow" aria-hidden="true">↗</span></div>
    <h2 class="book__word" id="book-title">{t['book']}</h2>
    <form class="booking" data-booking novalidate aria-labelledby="book-title" style="margin-top:clamp(18px,3vw,32px)">
      <fieldset>
        <legend class="label">{t['bk_make']}</legend>
        <div class="makes-seg" role="radiogroup">
          {makes}
        </div>
      </fieldset>
      <div class="booking__row">
        <div class="fld"><label class="label" for="b-model">{t['model']}</label><input id="b-model" name="model" type="text" autocomplete="off" placeholder="{t['model_ph']}"></div>
        <div class="fld"><label class="label" for="b-task">{t['bk_task']}</label><input id="b-task" name="task" type="text" list="b-tasks" autocomplete="off" placeholder="{t['bk_task_ph']}">
          <datalist id="b-tasks">{tasks}</datalist></div>
        <fieldset class="seg"><legend class="label">{t['bk_where']}</legend>
          <label><input type="radio" name="channel" value="telegram" checked><span>Telegram</span></label>
          <label><input type="radio" name="channel" value="viber"><span>Viber</span></label>
          <label><input type="radio" name="channel" value="whatsapp"><span>WhatsApp</span></label>
        </fieldset>
        <button class="btn" type="submit">{t['bk_send']}</button>
      </div>
      <p class="booking__status" data-booking-status role="status" aria-live="polite">{t['bk_status']}</p>
    </form>
    <div class="book__row">
      <p class="muted">{t['bk_call']}</p>
      <a class="book__tel" href="tel:{TEL1}">{TEL1_H}</a>
    </div>
  </div>
</section>

<section class="sec" id="contacts">
  <div class="wrap contacts">
    <div class="contacts__info">
      <p class="label">{t['ct_l']}</p>
      <h2 class="h2">{t['ct_h']}</h2>
      <dl class="cinfo">
        <div><dt>{ct[0][0]}</dt><dd>{ct[0][1]}</dd></div>
        <div><dt>{ct[1][0]}</dt><dd><a href="tel:{TEL1}">{TEL1_H}</a><br><a href="tel:{TEL2}">{TEL2_H}</a><br><span class="muted">{msg}</span></dd></div>
        <div><dt>{ct[2][0]}</dt><dd>{ct[2][1]}<br><a href="tel:{TEL3}">{TEL3_H}</a></dd></div>
        <div><dt>{ct[3][0]}</dt><dd><a href="mailto:{EMAIL}">{EMAIL}</a></dd></div>
      </dl>
      <div class="contacts__links">
        <a class="btn btn--ghost" href="https://yandex.by/maps/?text={mqe}" target="_blank" rel="noopener">{t['ct_map_y']}</a>
        <a class="btn btn--ghost" href="https://www.google.com/maps/search/?api=1&amp;query={mqe}" target="_blank" rel="noopener">{t['ct_map_g']}</a>
      </div>
      <details class="req"><summary>{t['ct_req']}</summary><dl>
        {req}
      </dl></details>
    </div>
    <div class="map">
      <iframe title="{t['map_title']}" src="https://yandex.by/map-widget/v1/?text={mqe}&amp;z=16" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  </div>
</section>

</main>
{footer(lang, up)}<nav class="dock" aria-label="{t['quick']}">
  <button type="button" class="dock__sum" data-check-open aria-controls="precheck"><small>{t['dock_sum']}</small><b class="num"><span data-dock-empty>{t['dock_empty']}</span><span data-dock-full hidden>{t['frm']} <span data-dock-sum>0</span> BYN</span></b></button>
  <a class="dock__call" href="tel:{TEL1}" aria-label="{t['dock_call']}: {TEL1_H}"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.2 3.5h3l1.6 4.2-2 1.4a11 11 0 0 0 7.1 7.1l1.4-2 4.2 1.6v3a1.7 1.7 0 0 1-1.8 1.7C10.6 20 4 13.4 3.5 5.3a1.7 1.7 0 0 1 1.7-1.8Z"/></svg></a>
  <button type="button" class="dock__book" data-check-open aria-controls="precheck">{t['dock_btn']}</button>
</nav>{i18n}
'''
    return head(lang, up, t['title'], t['desc'], path, 'en/' if lang == 'ru' else '') + body + scripts(up)


def slug(s):
    return 'all-' + re.sub(r'[^\w]+', '-', s.lower()).strip('-')


def price(lang):
    t = T[lang]
    up = '' if lang == 'ru' else '../'
    path = 'price.html' if lang == 'ru' else 'en/price.html'
    cats = '\n'.join(f'                <li><a href="#{slug(tr_name(c, lang))}">{tr_name(c, lang)}</a></li>' for c, _, _ in PRICE)
    groups = ''
    for c, _, items in PRICE:
        cn = tr_name(c, lang)
        rows = ''.join(f'''
                    <tr data-row>
                      <th scope="row">{e(tr_name(w, lang))}</th>
                      <td class="num"><small>{t['frm']}</small> {p} <small>BYN</small></td>
                    </tr>''' for w, _, p in items)
        groups += f'''
              <section class="pl__group" id="{slug(cn)}" data-group>
                <h2>{cn}</h2>
                <table>
                  <caption class="sr-only">{cn}</caption>
                  <thead class="sr-only"><tr><th scope="col">{t['p_svc']}</th><th scope="col">{t['p_price']}</th></tr></thead>
                  <tbody>{rows}
                  </tbody>
                </table>
              </section>'''
    body = f'''{header(lang, up, 'price')}<main id="main">
<section class="ph">
  <div class="wrap">
    <p class="coord mono">{t['p_coord']}</p>
    <h1 class="mega"><span class="mega__l1">{t['p_l1']}</span><span class="mega__l2"><span>{t['p_l2']}</span><span class="mega__dash" aria-hidden="true"></span></span></h1>
    <div class="ph__row">
      <p class="muted lede">{t['p_x']}</p>
      <a class="btn btn--ghost" href="viber://chat?number=%2B375295072150">{t['p_viber']}</a>
    </div>
  </div>
</section>
<section class="pl" data-pricelist>
        <div class="pl__bar">
          <div class="wrap pl__bar-inner">
            <label class="pl__search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="m20 20-4.4-4.4"></path></svg>
              <span class="sr-only">{t['p_search']}</span>
              <input type="search" placeholder="{t['p_search_ph']}" data-search autocomplete="off" />
            </label>
          </div>
        </div>
        <div class="wrap">
          <div class="pl__panel" id="panel-all" data-panel="all">
            <nav class="pl__cats" aria-label="{t['p_cats']}">
              <ul role="list">
{cats}
              </ul>
            </nav>
            <div class="pl__groups">{groups}
              <p class="pl__empty" data-empty hidden>{t['p_empty']}</p>
            </div>
          </div>
          <aside class="pl__more">
            <h2>{t['p_more_h']}</h2>
            <p class="muted">{t['p_more_x']}</p>
            <a class="btn btn--blue" href="index.html#book">{t['p_more_btn']} {ARROW}</a>
          </aside>
        </div>
      </section>
</main>
{footer(lang, up)}<nav class="dock dock--price" aria-label="{t['quick']}">
  <a class="dock__call" href="tel:{TEL1}">{t['dock_call']}</a>
  <a class="dock__book" href="index.html#book">{t['book']}</a>
</nav>
'''
    return head(lang, up, t['p_title'], t['p_desc'], path, 'en/price.html' if lang == 'ru' else 'price.html') + body + scripts(up)


def write(p, s):
    os.makedirs(os.path.dirname(p) or '.', exist_ok=True)
    open(p, 'w', encoding='utf-8').write(s)


write('index.html', index('ru'))
write('en/index.html', index('en'))
write('price.html', price('ru'))
write('en/price.html', price('en'))
print('built: index.html, price.html, en/index.html, en/price.html')
