// Rosso Corsa car picker: make + model (one search, Latin and Cyrillic) → year → engine.
// Interface ported from the VAG MOTORS picker; data rewritten for a multi-brand service (Rosso Corsa serves every make).
// Replaces every text field named "model" in the booking form and the work-order with three linked fields.
// The chosen car goes into a hidden field "model" as "BMW X5 E70 2010, 3.0d", so main.js reads it as before.
(function () {
  'use strict';
  var NOW = new Date().getFullYear();

  /* ── Data ────────────────────────────────────────────────────────────────
     Make: [name, search aliases "|", models]
     Model: [name, search aliases "|", generations]
     Generation: [label, first year, last year (0 = still made), engines (optional)]
     Engines: comma separated; "@2016-2020" limits years inside the generation, "@2016-" means to its end.
     Without an engine list the engine field offers fuel types and takes a typed engine ("1.6", "2.0 TDI").
     Engines are listed only where we are sure of them; years follow European and CIS market dates. */
  var MAKES = [
    ['Volkswagen', 'фольксваген|фольцваген|вольксваген|vw|фв', [
      ['Golf', 'гольф', [['4', 1997, 2004, '1.4, 1.6, 1.8 T, 2.0, 1.9 SDI, 1.9 TDI'], ['5', 2003, 2008, '1.4, 1.4 TSI@2006-, 1.6, 1.6 FSI, 2.0 FSI, 1.9 TDI, 2.0 TDI'], ['6', 2008, 2013, '1.2 TSI@2010-, 1.4, 1.4 TSI, 1.6, 2.0 TSI, 1.6 TDI@2009-, 2.0 TDI'], ['7', 2012, 2020, '1.0 TSI@2015-, 1.2 TSI@2012-2018, 1.4 TSI@2012-2018, 1.5 TSI@2017-, 1.6, 2.0 TSI, 1.6 TDI, 2.0 TDI, EV@2014-'], ['8', 2019, 0, '1.0 TSI, 1.5 TSI, 1.5 eTSI, 2.0 TSI, 2.0 TDI']]],
      ['Passat', 'пассат|пасат', [['B5', 1996, 2005, '1.6, 1.8, 1.8 T, 2.0, 2.8 V6, 1.9 TDI, 2.5 TDI'], ['B6', 2005, 2010, '1.4 TSI@2008-, 1.6, 1.6 FSI, 1.8 TSI@2007-, 2.0 FSI, 2.0 TSI, 3.2 V6, 1.9 TDI, 2.0 TDI'], ['B7', 2010, 2015, '1.4 TSI, 1.8 TSI, 2.0 TSI, 1.6 TDI, 2.0 TDI'], ['B8', 2014, 2023, '1.4 TSI, 1.5 TSI@2018-, 1.8 TSI, 2.0 TSI, 1.4 TSI GTE@2015-, 1.6 TDI, 2.0 TDI'], ['B9', 2023, 0], ['CC', 2008, 2016, '1.8 TSI, 2.0 TSI, 3.6 V6, 2.0 TDI']]],
      ['Polo', 'поло', [['IV', 2001, 2009], ['V', 2009, 2017], ['Sedan', 2010, 2020, '1.6, 1.4 TSI@2015-'], ['VI', 2017, 0], ['Liftback', 2020, 0, '1.4 TSI, 1.6']]],
      ['Jetta', 'джетта|жетта', [['5', 2005, 2010], ['6', 2010, 2018, '1.4 TSI, 1.6, 2.0, 1.6 TDI, 2.0 TDI'], ['7', 2018, 0]]],
      ['Tiguan', 'тигуан|тигуант', [['I', 2007, 2016, '1.4 TSI, 2.0 TSI, 2.0 TDI'], ['II', 2016, 2024, '1.4 TSI, 1.5 TSI@2018-, 2.0 TSI, 2.0 TDI'], ['III', 2024, 0]]],
      ['Touareg', 'туарег|таурег', [['I', 2002, 2010, '3.2 V6, 3.6 V6@2006-, 4.2 V8, 2.5 TDI, 3.0 TDI@2004-, 5.0 TDI'], ['II', 2010, 2018, '3.6 V6, 3.0 TDI, 4.2 TDI, 3.0 TSI Hybrid'], ['III', 2018, 0, '3.0 TSI, 3.0 TDI, 3.0 eHybrid@2020-']]],
      ['Touran', 'туран', [['I', 2003, 2015], ['II', 2015, 0]]],
      ['Sharan', 'шаран', [['I', 1995, 2010], ['II', 2010, 2022]]],
      ['Caddy', 'кадди|кади', [['III', 2004, 2020], ['V', 2020, 0]]],
      ['Transporter', 'транспортер|транспортёр|т4|т5|т6|t4|t5|t6|multivan|мультивен|каравелла|caravelle', [['T4', 1990, 2003], ['T5', 2003, 2015], ['T6', 2015, 2024]]],
      ['Crafter', 'крафтер', [['I', 2006, 2016], ['II', 2016, 0]]],
      ['Arteon', 'артеон', [['', 2017, 0]]],
      ['ID.4', 'ид4|id4|ид 4', [['', 2020, 0, 'EV']]]
    ]],
    ['Audi', 'ауди|ауди', [
      ['A3', 'а3', [['8L', 1996, 2003], ['8P', 2003, 2012], ['8V', 2012, 2020], ['8Y', 2020, 0]]],
      ['A4', 'а4', [['B5', 1994, 2001], ['B6', 2000, 2004, '1.6, 1.8 T, 2.0, 3.0 V6, 1.9 TDI, 2.5 TDI'], ['B7', 2004, 2008, '1.6, 1.8 T, 2.0, 2.0 TFSI, 3.2 FSI, 1.9 TDI, 2.0 TDI, 2.7 TDI, 3.0 TDI'], ['B8', 2007, 2015, '1.8 TFSI, 2.0 TFSI, 3.2 FSI, 2.0 TDI, 2.7 TDI, 3.0 TDI'], ['B9', 2015, 2023, '1.4 TFSI, 2.0 TFSI, 2.0 TDI, 3.0 TDI']]],
      ['A5', 'а5', [['8T', 2007, 2016], ['F5', 2016, 0]]],
      ['A6', 'а6', [['C5', 1997, 2004, '1.8 T, 2.4, 2.7 T, 2.8, 3.0, 1.9 TDI, 2.5 TDI'], ['C6', 2004, 2011, '2.0 TFSI, 2.4, 2.8 FSI@2006-, 3.0 TFSI@2008-, 3.2 FSI, 2.0 TDI, 2.7 TDI, 3.0 TDI'], ['C7', 2011, 2018, '1.8 TFSI@2014-, 2.0 TFSI, 2.8 FSI, 3.0 TFSI, 2.0 TDI, 3.0 TDI'], ['C8', 2018, 0, '2.0 TFSI, 3.0 TFSI, 2.0 TDI, 3.0 TDI']]],
      ['A8', 'а8', [['D3', 2002, 2010], ['D4', 2010, 2017], ['D5', 2017, 0]]],
      ['Q3', 'ку3|к3', [['8U', 2011, 2018], ['F3', 2018, 0]]],
      ['Q5', 'ку5|к5', [['8R', 2008, 2017, '2.0 TFSI, 3.2 FSI, 2.0 TDI, 3.0 TDI'], ['FY', 2017, 0, '2.0 TFSI, 3.0 TFSI, 2.0 TDI, 3.0 TDI']]],
      ['Q7', 'ку7|к7', [['4L', 2005, 2015, '3.0 TFSI@2010-, 3.6 FSI, 4.2 FSI, 3.0 TDI, 4.2 TDI'], ['4M', 2015, 0, '2.0 TFSI, 3.0 TFSI, 3.0 TDI']]],
      ['80', '80 б4|ауди 80', [['B4', 1991, 1996]]],
      ['100', 'сотка|ауди 100', [['C4', 1990, 1994]]],
      ['e-tron', 'етрон|е-трон|q8 e-tron', [['', 2018, 0, 'EV']]]
    ]],
    ['BMW', 'бмв|бэмвэ|бумер|bmw', [
      ['1 серии', '1|1 series|единица', [['E87', 2004, 2011], ['F20', 2011, 2019], ['F40', 2019, 0]]],
      ['3 серии', '3|3 series|тройка|трешка|трёшка', [['E46', 1998, 2006, '1.8i, 2.0i, 2.5i, 3.0i, 2.0d, 3.0d'], ['E90', 2005, 2013, '2.0i, 2.5i, 3.0i, 2.0d, 3.0d'], ['F30', 2011, 2019, '2.0i, 3.0i, 2.0d, 3.0d, 2.0i Hybrid@2015-'], ['G20', 2018, 0, '2.0i, 3.0i, 2.0d, 3.0d, 2.0i Hybrid@2019-']]],
      ['5 серии', '5|5 series|пятерка|пятёрка', [['E39', 1995, 2004, '2.0i, 2.5i, 2.8i, 3.0i, 4.4i, 2.5d, 3.0d'], ['E60', 2003, 2010, '2.0i, 2.5i, 3.0i, 4.4i, 4.8i, 2.0d, 2.5d, 3.0d'], ['F10', 2009, 2017, '2.0i, 3.0i, 4.4i, 2.0d, 3.0d'], ['G30', 2016, 2023, '2.0i, 3.0i, 4.4i, 2.0d, 3.0d, 2.0i Hybrid'], ['G60', 2023, 0]]],
      ['7 серии', '7|7 series|семерка|семёрка', [['E65', 2001, 2008], ['F01', 2008, 2015], ['G11', 2015, 2022], ['G70', 2022, 0]]],
      ['X1', 'х1|икс1', [['E84', 2009, 2015], ['F48', 2015, 2022], ['U11', 2022, 0]]],
      ['X3', 'х3|икс3', [['E83', 2003, 2010], ['F25', 2010, 2017], ['G01', 2017, 0]]],
      ['X5', 'х5|икс5', [['E53', 1999, 2006, '3.0i, 4.4i, 4.6is, 4.8is@2004-, 3.0d'], ['E70', 2006, 2013, '3.0i, 4.8i, 3.0d, 3.0sd, 4.4i@2010-'], ['F15', 2013, 2018, '3.0i, 4.4i, 2.0d, 3.0d, 2.0i Hybrid@2015-'], ['G05', 2018, 0, '3.0i, 4.4i, 3.0d, 3.0i Hybrid@2019-']]],
      ['X6', 'х6|икс6', [['E71', 2008, 2014], ['F16', 2014, 2019], ['G06', 2019, 0]]]
    ]],
    ['Mercedes-Benz', 'мерседес|мерс|мерин|mercedes|мб|mb', [
      ['A-класс', 'a|а класс|a class', [['W169', 2004, 2012], ['W176', 2012, 2018], ['W177', 2018, 0]]],
      ['C-класс', 'c|с класс|c class|цешка', [['W202', 1993, 2000], ['W203', 2000, 2007], ['W204', 2007, 2014], ['W205', 2014, 2021], ['W206', 2021, 0]]],
      ['E-класс', 'e|е класс|e class|ешка', [['W210', 1995, 2002], ['W211', 2002, 2009], ['W212', 2009, 2016], ['W213', 2016, 2023], ['W214', 2023, 0]]],
      ['S-класс', 's|с класс|s class|кабан', [['W220', 1998, 2005], ['W221', 2005, 2013], ['W222', 2013, 2020], ['W223', 2020, 0]]],
      ['ML / GLE', 'ml|мл|gle|гле', [['W163', 1997, 2005], ['W164', 2005, 2011], ['W166', 2011, 2019], ['V167', 2019, 0]]],
      ['GLC', 'глц|glc', [['X253', 2015, 2022], ['X254', 2022, 0]]],
      ['GL / GLS', 'gl|gls|гл|глс', [['X164', 2006, 2012], ['X166', 2012, 2019], ['X167', 2019, 0]]],
      ['Sprinter', 'спринтер', [['W901', 1995, 2006], ['W906', 2006, 2018], ['W907', 2018, 0]]],
      ['Vito / V-класс', 'вито|вианo|виано|viano|v class', [['W638', 1996, 2003], ['W639', 2003, 2014], ['W447', 2014, 0]]]
    ]],
    ['Ford', 'форд', [
      ['Focus', 'фокус', [['I', 1998, 2005, '1.4, 1.6, 1.8, 2.0, 1.8 TDCi'], ['II', 2004, 2011, '1.4, 1.6, 1.8, 2.0, 1.6 TDCi, 1.8 TDCi, 2.0 TDCi'], ['III', 2010, 2018, '1.0 EcoBoost@2012-, 1.5 EcoBoost@2014-, 1.6, 1.6 EcoBoost, 2.0, 1.5 TDCi@2014-, 1.6 TDCi, 2.0 TDCi'], ['IV', 2018, 2025]]],
      ['Mondeo', 'мондео', [['III', 2000, 2007], ['IV', 2007, 2014, '1.6, 2.0, 2.3, 2.5 T, 2.0 EcoBoost@2010-, 1.8 TDCi, 2.0 TDCi, 2.2 TDCi'], ['V', 2014, 2022]]],
      ['Fiesta', 'фиеста', [['V', 2001, 2008], ['VI', 2008, 2017]]],
      ['Fusion', 'фьюжн|фюжн', [['', 2002, 2012]]],
      ['Kuga', 'куга', [['I', 2008, 2012], ['II', 2012, 2019], ['III', 2019, 0]]],
      ['C-Max', 'с макс|си макс|cmax', [['I', 2003, 2010], ['II', 2010, 2019]]],
      ['S-Max / Galaxy', 'смакс|галакси|s max|galaxy', [['I', 2006, 2015], ['II', 2015, 2023]]],
      ['Transit', 'транзит', [['V', 2000, 2006], ['VI', 2006, 2014], ['VII', 2014, 0]]],
      ['Explorer', 'эксплорер', [['V', 2010, 2019], ['VI', 2019, 0]]]
    ]],
    ['Renault', 'рено|renault', [
      ['Logan', 'логан', [['I', 2004, 2015, '1.4, 1.6, 1.5 dCi'], ['II', 2012, 2022, '1.6, 1.6 16V, 1.5 dCi']]],
      ['Sandero', 'сандеро|степвей|stepway', [['I', 2007, 2014], ['II', 2012, 2022], ['III', 2020, 0]]],
      ['Duster', 'дастер', [['I', 2010, 2021, '1.6, 2.0, 1.5 dCi'], ['II', 2021, 0, '1.3 TCe, 1.6, 1.5 dCi']]],
      ['Megane', 'меган', [['II', 2002, 2009, '1.4, 1.6, 2.0, 1.5 dCi, 1.9 dCi'], ['III', 2008, 2016, '1.4 TCe, 1.6, 2.0, 1.5 dCi, 1.9 dCi'], ['IV', 2016, 2022]]],
      ['Laguna', 'лагуна', [['II', 2001, 2007], ['III', 2007, 2015]]],
      ['Scenic', 'сценик|сценик|scénic', [['II', 2003, 2009], ['III', 2009, 2016], ['IV', 2016, 2022]]],
      ['Kangoo', 'кангу', [['I', 1997, 2008], ['II', 2008, 2021], ['III', 2021, 0]]],
      ['Fluence', 'флюенс', [['', 2009, 2017]]],
      ['Kaptur', 'каптюр|каптур|captur', [['', 2016, 0]]],
      ['Arkana', 'аркана', [['', 2019, 0]]],
      ['Trafic', 'трафик', [['II', 2001, 2014], ['III', 2014, 0]]]
    ]],
    ['Peugeot', 'пежо|пежот|peugeot', [
      ['206', '', [['', 1998, 2012]]], ['207', '', [['', 2006, 2014]]], ['307', '', [['', 2001, 2008]]],
      ['308', '', [['I', 2007, 2014], ['II', 2013, 2021], ['III', 2021, 0]]],
      ['406', '', [['', 1995, 2004]]], ['407', '', [['', 2004, 2011]]], ['508', '', [['I', 2010, 2018], ['II', 2018, 0]]],
      ['3008', '', [['I', 2008, 2016], ['II', 2016, 0]]], ['5008', '', [['I', 2009, 2017], ['II', 2017, 0]]],
      ['Partner', 'партнер|партнёр', [['I', 1996, 2008], ['II', 2008, 2018]]],
      ['Boxer', 'боксер|боксёр', [['II', 2006, 0]]]
    ]],
    ['Citroën', 'ситроен|ситроэн|citroen', [
      ['C3', 'с3|ц3', [['I', 2002, 2009], ['II', 2009, 2016], ['III', 2016, 0]]],
      ['C4', 'с4|ц4', [['I', 2004, 2010], ['II', 2010, 2018], ['III', 2020, 0]]],
      ['C4 Picasso', 'с4 пикассо|пикассо|grand picasso', [['I', 2006, 2013], ['II', 2013, 2022]]],
      ['C5', 'с5|ц5', [['I', 2001, 2008], ['II', 2008, 2017]]],
      ['Xsara Picasso', 'ксара пикассо|xsara', [['', 1999, 2012]]],
      ['Berlingo', 'берлинго', [['I', 1996, 2008], ['II', 2008, 2018], ['III', 2018, 0]]],
      ['Jumper', 'джампер', [['II', 2006, 0]]]
    ]],
    ['Opel', 'опель', [
      ['Astra', 'астра', [['G', 1998, 2009], ['H', 2004, 2014, '1.4, 1.6, 1.8, 2.0 T, 1.3 CDTI, 1.7 CDTI, 1.9 CDTI'], ['J', 2009, 2015, '1.4, 1.4 T, 1.6, 1.6 T, 1.7 CDTI, 2.0 CDTI'], ['K', 2015, 2021]]],
      ['Vectra', 'вектра', [['B', 1995, 2002], ['C', 2002, 2008]]],
      ['Insignia', 'инсигния', [['A', 2008, 2017], ['B', 2017, 2022]]],
      ['Zafira', 'зафира', [['A', 1999, 2005], ['B', 2005, 2014], ['C', 2011, 2019]]],
      ['Corsa', 'корса', [['C', 2000, 2006], ['D', 2006, 2014], ['E', 2014, 2019], ['F', 2019, 0]]],
      ['Omega', 'омега', [['B', 1994, 2003]]],
      ['Meriva', 'мерива', [['A', 2002, 2010], ['B', 2010, 2017]]],
      ['Mokka', 'мокка', [['I', 2012, 2019], ['II', 2020, 0]]],
      ['Vivaro', 'виваро', [['A', 2001, 2014], ['B', 2014, 2019], ['C', 2019, 0]]]
    ]],
    ['Škoda', 'шкода|skoda', [
      ['Octavia', 'октавия|октавиа|актавия', [['Tour', 1996, 2010, '1.4, 1.6, 1.8 T, 2.0, 1.9 SDI, 1.9 TDI'], ['A5', 2004, 2013, '1.2 TSI@2010-, 1.4, 1.4 TSI@2008-, 1.6, 1.6 FSI, 1.8 TSI@2007-, 2.0 FSI, 2.0 TSI, 1.6 TDI@2009-, 1.9 TDI, 2.0 TDI'], ['A7', 2012, 2020, '1.0 TSI@2016-, 1.2 TSI, 1.4 TSI, 1.6, 1.8 TSI, 2.0 TSI, 1.6 TDI, 2.0 TDI'], ['A8', 2019, 0, '1.0 TSI, 1.4 TSI, 1.5 TSI, 1.6, 2.0 TSI, 1.4 iV@2020-, 2.0 TDI']]],
      ['Fabia', 'фабия|фабиа', [['I', 1999, 2007], ['II', 2007, 2014], ['III', 2014, 2021], ['IV', 2021, 0]]],
      ['Rapid', 'рапид', [['', 2012, 0, '1.2, 1.2 TSI, 1.4 TSI, 1.6, 1.6 TDI']]],
      ['Superb', 'суперб|суперб', [['I', 2001, 2008], ['II', 2008, 2015, '1.4 TSI, 1.8 TSI, 2.0 TSI@2013-, 3.6 V6, 1.6 TDI, 2.0 TDI'], ['III', 2015, 2023, '1.4 TSI, 1.5 TSI@2018-, 1.8 TSI, 2.0 TSI, 1.4 iV@2019-, 1.6 TDI, 2.0 TDI'], ['IV', 2023, 0]]],
      ['Kodiaq', 'кодиак|кодиак', [['I', 2016, 2024, '1.4 TSI, 1.5 TSI@2018-, 2.0 TSI, 2.0 TDI'], ['II', 2024, 0]]],
      ['Karoq', 'карок', [['', 2017, 0]]],
      ['Yeti', 'йети|ети', [['', 2009, 2017]]]
    ]],
    ['Volvo', 'вольво|volvo', [
      ['XC90', 'хс90|xc 90', [['I', 2002, 2014], ['II', 2014, 0]]], ['XC60', 'хс60|xc 60', [['I', 2008, 2017], ['II', 2017, 0]]],
      ['XC70', 'хс70', [['II', 2007, 2016]]], ['S60', 'с60', [['I', 2000, 2009], ['II', 2010, 2018], ['III', 2018, 0]]],
      ['S80', 'с80', [['I', 1998, 2006], ['II', 2006, 2016]]], ['V70', 'в70', [['II', 2000, 2007], ['III', 2007, 2016]]]
    ]],
    ['Porsche', 'порше|порш', [
      ['Cayenne', 'кайен|каен|кайенн', [['955/957', 2002, 2010], ['958', 2010, 2017], ['9Y0', 2017, 0]]],
      ['Macan', 'макан', [['', 2014, 0]]], ['Panamera', 'панамера', [['970', 2009, 2016], ['971', 2016, 0]]], ['911', '911', [['', 1997, 0]]]
    ]],
    ['Land Rover', 'ленд ровер|лэнд ровер|ленд|рендж|рэндж|range rover|range', [
      ['Range Rover', 'рендж ровер|рэндж ровер', [['L322', 2002, 2012], ['L405', 2012, 2021], ['L460', 2021, 0]]],
      ['Range Rover Sport', 'рендж спорт|рр спорт', [['L320', 2005, 2013], ['L494', 2013, 2022], ['L461', 2022, 0]]],
      ['Range Rover Evoque', 'эвок|евок', [['L538', 2011, 2018], ['L551', 2018, 0]]],
      ['Discovery', 'дискавери|дискавери', [['3', 2004, 2009], ['4', 2009, 2016], ['5', 2016, 0]]],
      ['Freelander', 'фрилендер|фрилэндер', [['I', 1997, 2006], ['II', 2006, 2014]]]
    ]],
    ['Chevrolet', 'шевроле|шевролет|шеви', [
      ['Lacetti', 'лачетти|лачети', [['', 2004, 2013]]], ['Cruze', 'круз', [['', 2008, 2016]]], ['Aveo', 'авео', [['T250', 2006, 2011], ['T300', 2011, 2020]]],
      ['Captiva', 'каптива', [['', 2006, 2018]]], ['Malibu', 'малибу', [['', 2012, 0]]], ['Tahoe', 'тахо', [['', 2006, 0]]], ['Niva', 'нива шевроле|шнива', [['', 2002, 2020]]]
    ]],
    ['Toyota', 'тойота|таета', [
      ['Camry', 'камри', [['XV40', 2006, 2011], ['XV50', 2011, 2017], ['XV70', 2017, 0]]], ['Corolla', 'королла|корола', [['E120', 2001, 2007], ['E150', 2006, 2013], ['E170', 2013, 2019], ['E210', 2018, 0]]],
      ['RAV4', 'рав4|рав 4', [['XA30', 2005, 2012], ['XA40', 2012, 2018], ['XA50', 2018, 0]]], ['Land Cruiser', 'ленд крузер|крузак|прадо|prado|lc', [['Prado 120', 2002, 2009], ['Prado 150', 2009, 0], ['200', 2007, 2021], ['300', 2021, 0]]],
      ['Avensis', 'авенсис', [['II', 2003, 2008], ['III', 2008, 2018]]], ['Auris', 'аурис', [['', 2006, 2018]]]
    ]],
    ['Lexus', 'лексус', [['RX', 'рх|rx', [['', 2003, 0]]], ['NX', 'нх|nx', [['', 2014, 0]]], ['ES', 'ес|es', [['', 2006, 0]]], ['GX / LX', 'gx|lx', [['', 2002, 0]]]]],
    ['Nissan', 'ниссан|нисан', [
      ['Qashqai', 'кашкай', [['J10', 2006, 2013], ['J11', 2013, 2021], ['J12', 2021, 0]]], ['X-Trail', 'икс трейл|х трейл|xtrail', [['T31', 2007, 2014], ['T32', 2013, 2022]]],
      ['Almera', 'альмера', [['', 2000, 2018]]], ['Primera', 'примера', [['P12', 2001, 2008]]], ['Note', 'ноут', [['', 2005, 2016]]], ['Juke', 'жук|джук', [['', 2010, 0]]], ['Leaf', 'лиф', [['', 2010, 0, 'EV']]]
    ]],
    ['Mazda', 'мазда', [['3', 'мазда 3|тройка', [['BK', 2003, 2009], ['BL', 2009, 2013], ['BM', 2013, 2019], ['BP', 2019, 0]]], ['6', 'мазда 6|шестерка', [['GG', 2002, 2008], ['GH', 2007, 2012], ['GJ', 2012, 0]]], ['CX-5', 'сх5|cx5', [['KE', 2011, 2017], ['KF', 2017, 0]]]]],
    ['Mitsubishi', 'мицубиси|митсубиши|мицубиши', [['Outlander', 'аутлендер', [['', 2003, 0]]], ['Lancer', 'лансер', [['IX', 2000, 2007], ['X', 2007, 2017]]], ['Pajero', 'паджеро|pajero sport', [['', 1999, 0]]], ['ASX', 'асх', [['', 2010, 0]]]]],
    ['Honda', 'хонда', [['Civic', 'цивик|сивик', [['', 2001, 0]]], ['Accord', 'аккорд', [['', 2002, 0]]], ['CR-V', 'срв|crv', [['', 2001, 0]]]]],
    ['Subaru', 'субару', [['Forester', 'форестер', [['', 2002, 0]]], ['Outback', 'аутбек', [['', 2003, 0]]], ['Impreza', 'импреза', [['', 2000, 0]]]]],
    ['Suzuki', 'сузуки', [['Grand Vitara', 'гранд витара|витара', [['', 2005, 0]]], ['SX4', 'сх4', [['', 2006, 0]]]]],
    ['Hyundai', 'хендай|хендэ|хундай|хюндай', [['Solaris / Accent', 'солярис|акцент|accent', [['', 2006, 0]]], ['Tucson', 'туссан|тусан|ix35', [['', 2004, 0]]], ['Santa Fe', 'санта фе', [['', 2000, 0]]], ['Elantra', 'элантра', [['', 2006, 0]]], ['Creta', 'крета', [['', 2016, 0]]]]],
    ['Kia', 'киа|кия', [['Rio', 'рио', [['', 2005, 0]]], ['Sportage', 'спортейдж|спортаж', [['', 2004, 0]]], ['Ceed', 'сид|cee\'d', [['', 2006, 0]]], ['Sorento', 'соренто', [['', 2002, 0]]], ['Optima / K5', 'оптима|к5|k5', [['', 2010, 0]]]]],
    ['Geely', 'джили|джилли|geely', [
      ['Atlas', 'атлас', [['', 2016, 2022, '1.8, 2.4'], ['Pro', 2021, 0, '1.5 T']]], ['Coolray', 'кулрей|кулрэй', [['', 2019, 0, '1.5 T']]],
      ['Tugella', 'тугелла|тугела', [['', 2019, 0, '2.0 T']]], ['Monjaro', 'монжаро', [['', 2022, 0, '2.0 T']]], ['Emgrand', 'эмгранд', [['', 2009, 0]]], ['Okavango', 'окаванго', [['', 2020, 0]]]
    ]],
    ['Belgee', 'белджи|белжи', [['X50', 'х50', [['', 2023, 0, '1.5 T']]], ['X70', 'х70', [['', 2023, 0, '2.0 T']]], ['S50', 'с50', [['', 2024, 0, '1.5']]]]],
    ['Haval', 'хавал|хавейл|хавэйл', [['Jolion', 'джолион|жолион', [['', 2020, 0, '1.5 T']]], ['F7 / F7x', 'ф7|f7x', [['', 2019, 0, '1.5 T, 2.0 T']]], ['H6', 'н6|аш6', [['', 2011, 0]]], ['Dargo', 'дарго', [['', 2021, 0, '2.0 T']]], ['H9', 'н9|аш9', [['', 2014, 0]]]]],
    ['Chery', 'чери|черри', [['Tiggo 4', 'тигго 4|тиго 4', [['', 2017, 0]]], ['Tiggo 7', 'тигго 7|тиго 7|tiggo 7 pro', [['', 2016, 0]]], ['Tiggo 8', 'тигго 8|тиго 8|tiggo 8 pro', [['', 2018, 0]]], ['Arrizo', 'арризо', [['', 2013, 0]]]]],
    ['Exeed', 'эксид|иксид', [['TXL', '', [['', 2019, 0]]], ['LX', '', [['', 2019, 0]]], ['VX', '', [['', 2021, 0]]]]],
    ['Changan', 'чанган|чангань', [['CS35 Plus', 'cs35', [['', 2018, 0]]], ['CS55 Plus', 'cs55', [['', 2019, 0]]], ['CS75 Plus', 'cs75', [['', 2019, 0]]], ['UNI-K', 'юни к|uni k', [['', 2020, 0]]], ['UNI-V', 'юни в|uni v', [['', 2022, 0]]]]],
    ['Tank', 'танк', [['300', '', [['', 2020, 0]]], ['500', '', [['', 2021, 0]]]]],
    ['Jetour', 'джетур|жетур', [['X70', 'х70', [['', 2018, 0]]], ['Dashing', 'дашинг', [['', 2022, 0]]]]],
    ['Lada', 'лада|ваз|vaz|жигули', [['Vesta', 'веста', [['', 2015, 0, '1.6, 1.8']]], ['Granta', 'гранта', [['', 2011, 0, '1.6']]], ['Largus', 'ларгус', [['', 2012, 0, '1.6']]], ['Niva / 4x4', 'нива|4х4|niva|urban', [['', 1977, 0, '1.7']]], ['XRAY', 'иксрей|х рей', [['', 2015, 2022]]], ['Priora', 'приора', [['', 2007, 2018]]], ['Kalina', 'калина', [['', 2004, 2018]]]]],
    ['Tesla', 'тесла', [['Model 3', 'модель 3|м3', [['', 2017, 0, 'EV']]], ['Model Y', 'модель y|модель игрек', [['', 2020, 0, 'EV']]], ['Model S', 'модель s|модель с', [['', 2012, 0, 'EV']]], ['Model X', 'модель x|модель икс', [['', 2015, 0, 'EV']]]]],
    ['SEAT', 'сеат|сиат|seat', [['Leon', 'леон', [['', 1999, 0]]], ['Ibiza', 'ибица', [['', 2002, 0]]], ['Toledo', 'толедо', [['', 1999, 2019]]], ['Alhambra', 'альхамбра', [['', 1996, 2020]]], ['Ateca', 'атека', [['', 2016, 0]]]]],
    ['Jeep', 'джип', [['Grand Cherokee', 'гранд чероки', [['WK', 2005, 2010], ['WK2', 2010, 2021], ['WL', 2021, 0]]], ['Cherokee', 'чероки', [['KL', 2013, 2023]]], ['Compass', 'компас', [['', 2006, 0]]], ['Wrangler', 'вранглер|рэнглер', [['', 2006, 0]]]]],
    ['Mini', 'мини|mini cooper|купер', [['Cooper', 'купер', [['R56', 2006, 2014], ['F56', 2014, 0]]], ['Countryman', 'кантримен', [['', 2010, 0]]]]],
    ['Fiat', 'фиат', [['Ducato', 'дукато', [['', 2006, 0]]], ['Doblo', 'добло', [['', 2000, 0]]], ['500', '500', [['', 2007, 0]]], ['Punto', 'пунто', [['', 1999, 2018]]]]],
    ['Alfa Romeo', 'альфа ромео|альфа', [['159', '', [['', 2005, 2011]]], ['Giulietta', 'джульетта', [['', 2010, 2020]]], ['Giulia', 'джулия', [['', 2015, 0]]], ['Stelvio', 'стельвио', [['', 2016, 0]]], ['147 / 156', '147|156', [['', 1997, 2010]]]]],
    ['Dacia', 'дачия|дачиа', [['Logan', 'логан', [['', 2004, 0]]], ['Sandero', 'сандеро', [['', 2008, 0]]], ['Duster', 'дастер', [['', 2010, 0]]]]],
    ['Chrysler', 'крайслер', [['Pacifica', 'пацифика', [['', 2016, 0]]], ['300C', '300с|300 с', [['', 2004, 2023]]], ['Voyager / Town & Country', 'вояджер|таун кантри', [['', 2000, 2016]]]]],
    ['Dodge', 'додж', [['Grand Caravan', 'гранд караван|караван', [['', 2007, 2020]]], ['Journey', 'джорни', [['', 2008, 2020]]], ['Charger', 'чарджер', [['', 2010, 0]]], ['Challenger', 'челленджер', [['', 2008, 2023]]]]],
    ['RAM', 'рам|dodge ram', [['1500', '', [['', 2009, 0]]]]],
    ['Cadillac', 'кадиллак|кадилак', [['Escalade', 'эскалейд', [['', 2006, 0]]], ['XT5', '', [['', 2016, 0]]]]],
    ['Lincoln', 'линкольн', [['Navigator', 'навигатор', [['', 2007, 0]]], ['MKX / Nautilus', 'mkx|наутилус', [['', 2007, 0]]]]],
    ['GMC', 'джиэмси|гмс', [['Yukon', 'юкон', [['', 2007, 0]]], ['Sierra', 'сиерра', [['', 2007, 0]]]]],
    ['Buick', 'бьюик', [['Enclave', 'энклейв', [['', 2007, 0]]], ['Encore', 'энкор', [['', 2012, 0]]]]],
    ['Hummer', 'хаммер', [['H2', 'аш2|н2', [['', 2002, 2009]]], ['H3', 'аш3|н3', [['', 2005, 2010]]]]],
    ['Jaguar', 'ягуар', [['XF', 'хф', [['', 2007, 0]]], ['F-Pace', 'ф пейс', [['', 2016, 0]]], ['XJ', 'хж', [['', 2003, 2019]]]]],
    ['Saab', 'сааб', [['9-3', '93', [['', 1998, 2014]]], ['9-5', '95', [['', 1997, 2011]]]]],
    ['Smart', 'смарт', [['Fortwo', 'форту', [['', 1998, 0]]], ['Forfour', 'форфор', [['', 2004, 0]]]]],
    ['Lancia', 'лянча|ланча', [['Delta', 'дельта', [['', 2008, 2014]]], ['Ypsilon', 'ипсилон', [['', 2003, 0]]]]],
    ['Lifan', 'лифан', [['X60', 'х60', [['', 2011, 2020]]], ['Solano', 'солано', [['', 2008, 2020]]]]],
    ['JAC', 'жак|джак', [['JS4', '', [['', 2020, 0]]], ['T6 / T8', 't6|t8', [['', 2015, 0]]]]],
    ['GAC', 'гак|гаc', [['GS8', '', [['', 2016, 0]]], ['GS3', '', [['', 2017, 0]]]]],
    ['Dongfeng', 'донгфенг|дунфэн', [['580', '', [['', 2016, 0]]], ['Shine Max', 'шайн', [['', 2023, 0]]]]],
    ['BAIC', 'баик|байк', [['X35', 'х35', [['', 2017, 0]]], ['BJ40', 'бж40', [['', 2014, 0]]]]],
    ['Maserati', 'мазерати', [['Ghibli', 'гибли', [['', 2013, 0]]], ['Levante', 'леванте', [['', 2016, 0]]], ['Quattroporte', 'кватропорте', [['', 2003, 0]]]]],
    ['Bentley', 'бентли', [['Continental GT', 'континенталь', [['', 2003, 0]]], ['Bentayga', 'бентайга', [['', 2015, 0]]], ['Flying Spur', 'флаинг спур', [['', 2005, 0]]]]],
    ['Aston Martin', 'астон мартин', [['DB11', '', [['', 2016, 0]]], ['Vantage', 'вантаж', [['', 2005, 0]]], ['DBX', '', [['', 2020, 0]]]]],
    ['Ferrari', 'феррари', [['Roma', 'рома', [['', 2020, 0]]], ['Portofino', 'портофино', [['', 2017, 0]]], ['F8 / 488', 'f8|488', [['', 2015, 0]]]]],
    ['Lamborghini', 'ламборгини|ламба', [['Urus', 'урус', [['', 2018, 0]]], ['Huracán', 'уракан|huracan', [['', 2014, 0]]]]],
    ['McLaren', 'макларен', [['720S / 750S', '720s|750s', [['', 2017, 0]]], ['GT', '', [['', 2019, 0]]]]],
    ['Rolls-Royce', 'роллс ройс|ролс ройс', [['Ghost', 'гост', [['', 2009, 0]]], ['Cullinan', 'куллинан', [['', 2018, 0]]]]],
    ['Maybach', 'майбах', [['S-класс', 's class|с класс', [['', 2015, 0]]], ['GLS', 'глс', [['', 2019, 0]]]]]
  ];

  var EN = (document.documentElement.lang || '').slice(0, 2) === 'en';
  var L = function (ru, en) { return EN ? en : ru; };

  /* ── Normalised search ── */
  var TR = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'i', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sh', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya' };
  var norm = function (s) { return String(s).toLowerCase().replace(/ё/g, 'е').replace(/[\s\-.\/!'’]+/g, ''); };
  var translit = function (s) { return norm(s).replace(/[а-я]/g, function (c) { return TR[c] || c; }); };
  var LOOK = { а: 'a', в: 'b', с: 'c', е: 'e', к: 'k', м: 'm', н: 'h', о: 'o', р: 'p', т: 't', х: 'x', у: 'y' };
  var lookAlike = function (s) { return norm(s).replace(/[а-я]/g, function (c) { return LOOK[c] || c; }); };
  var keysOf = function (list) {
    var out = [];
    list.forEach(function (k) { if (!k) return; [norm(k), translit(k), lookAlike(k)].forEach(function (x) { if (x && out.indexOf(x) === -1) out.push(x); }); });
    return out;
  };

  // flat list: one entry per model, with its make
  var MODELS = [];
  MAKES.forEach(function (mk) {
    var makeKeys = keysOf([mk[0]].concat(mk[1].split('|')));
    mk[2].forEach(function (m) {
      var gens = m[2].map(function (g) {
        var to = g[2] || NOW;
        var engines = g[3] ? g[3].split(/\s*,\s*/).map(function (e) {
          var p = e.split('@'), y = (p[1] || '').split('-');
          return { name: p[0], from: +y[0] || g[1], to: y[1] ? +y[1] : to };
        }) : null;
        return { label: g[0], from: g[1], to: to, now: !g[2], engines: engines };
      });
      MODELS.push({
        make: mk[0], makeKeys: makeKeys, name: m[0], gens: gens,
        keys: keysOf([m[0]].concat(m[1].split('|'))),
        genKeys: gens.map(function (g) { return keysOf([g.label]); })
      });
    });
  });

  var FUELS = [L('Бензин', 'Petrol'), L('Дизель', 'Diesel'), L('Гибрид', 'Hybrid'), L('Электро', 'Electric'), L('Газ / ГБО', 'LPG')];
  var fuel = function (e) {
    if (e === 'EV') return L('электро', 'electric');
    if (/GTE|eHybrid|Hybrid|TFSI e\b|e-tron|\biV\b/.test(e)) return L('гибрид', 'hybrid');
    if (/TDI|SDI|TDCi|CDTI|dCi|HDi|CDI|CRDi|\d\.\ds?d\b|\bD\b|\bTD\b/.test(e)) return L('дизель', 'diesel');
    return L('бензин', 'petrol');
  };
  var engName = function (e) { return e === 'EV' ? L('Электро', 'Electric') : e; };
  var modelName = function (m, g) { return m.name + (g && g.label ? ' ' + g.label : ''); };
  var fullName = function (m, g) { return m.make + ' ' + modelName(m, g); };

  // "бмв х5", "x5 e70", "логан", "октавия 2015", "мерседес w211"
  var search = function (q) {
    var words = String(q).trim().toLowerCase().split(/\s+/).filter(Boolean);
    var out = [];
    if (!words.length) return out;
    var hit = function (keys, w) {
      var a = norm(w), b = translit(w), c = lookAlike(w), s = -1;
      keys.forEach(function (k) {
        if (k === a || k === b || k === c) s = Math.max(s, 3);
        else if (k.indexOf(a) === 0 || k.indexOf(b) === 0 || k.indexOf(c) === 0) s = Math.max(s, 2);
        else if (a.length > 2 && k.indexOf(a) > 0) s = Math.max(s, 1);
      });
      return s;
    };
    MODELS.forEach(function (m) {
      var ws = words.slice(), score = 0, makeHit = false;
      // a leading make word ("бмв", "land rover") narrows the list to that make
      for (var n = Math.min(2, ws.length); n >= 1; n--) {
        var mh = hit(m.makeKeys, ws.slice(0, n).join(' '));
        if (mh >= 2) { makeHit = true; score += mh; ws = ws.slice(n); break; }
      }
      if (!ws.length) { if (makeHit) out.push({ m: m, score: score }); return; }
      // longest run of the remaining words as the model, the rest as generation or year
      for (var k = ws.length; k >= 1; k--) {
        var s = hit(m.keys, ws.slice(0, k).join(' '));
        if (s < 0) continue;
        var rest = ws.slice(k).join(' ');
        if (!rest) { out.push({ m: m, score: score + s }); return; }
        if (/^(19|20)\d\d$/.test(rest)) {
          var y = +rest;
          if (m.gens.some(function (g) { return y >= g.from && y <= g.to; })) out.push({ m: m, score: score + s + 1, year: y });
          return;
        }
        m.gens.forEach(function (g, gi) {
          if (g.label && hit(m.genKeys[gi], rest) >= 2) out.push({ m: m, g: g, score: score + s + 1 });
        });
        return;
      }
      // only a generation code typed, with or without the make ("e70", "мерседес w211")
      m.gens.forEach(function (g, gi) { if (g.label && g.label.length > 2 && hit(m.genKeys[gi], ws.join(' ')) === 3) out.push({ m: m, g: g, score: score + 2 }); });
    });
    out.sort(function (a, b) { return b.score - a.score || a.m.make.localeCompare(b.m.make) || a.m.name.localeCompare(b.m.name, 'en', { numeric: true }); });
    return out.slice(0, 40);
  };

  /* ── Styles: sizes and colours come from the site's own input, so both themes match ── */
  var css = document.createElement('style');
  css.textContent = [
    '.carpick{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(0,.7fr) minmax(0,1.2fr);gap:6px;position:relative;width:100%}',
    '.carpick__f{position:relative;min-width:0}',
    '.carpick__f>input{width:100%;padding-right:34px;text-overflow:ellipsis;cursor:pointer}',
    '.carpick__f>input[readonly]{caret-color:transparent}',
    '.carpick__f>input:disabled{opacity:.45;cursor:not-allowed}',
    '.carpick__f::after{content:"";position:absolute;right:14px;top:50%;width:7px;height:7px;border:solid currentColor;border-width:0 1.5px 1.5px 0;transform:translateY(-70%) rotate(45deg);opacity:.55;pointer-events:none}',
    '.carpick__list{position:fixed;z-index:1000;max-height:min(320px,46vh);overflow:auto;overscroll-behavior:contain;margin:0;padding:4px;list-style:none;border:1px solid var(--cp-bd,#888);border-radius:var(--cp-r,5px);background:var(--cp-bg,#fff);color:var(--cp-fg,#111);box-shadow:0 18px 40px rgba(0,0,0,.35)}',
    '.carpick__list[hidden]{display:none}',
    '.carpick__list li{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:10px 12px;border-radius:calc(var(--cp-r,5px) - 1px);cursor:pointer;line-height:1.25}',
    '.carpick__list li small{opacity:.6;font-size:.8em;white-space:nowrap}',
    '.carpick__list li.is-act{background:var(--cp-hi,rgba(127,127,127,.18))}',
    '.carpick__list li[aria-selected="true"]{font-weight:600}',
    '.carpick__list li.carpick__grp{cursor:default;padding:10px 12px 4px;font-size:.72em;letter-spacing:.08em;text-transform:uppercase;opacity:.6}',
    '.carpick__list li.carpick__free{opacity:.8;font-style:italic}',
    '.carpick__mk{opacity:.55;margin-right:6px}',
    '@media (max-width:620px){.carpick{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.carpick__f--model{grid-column:1/-1}}',
    '.carpick--narrow{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.carpick--narrow .carpick__f--model{grid-column:1/-1}'
  ].join('');
  document.head.appendChild(css);

  /* ── One picker per field ── */
  var uid = 0;
  var enhance = function (input) {
    if (input.dataset.carpick) return;
    input.dataset.carpick = '1';
    var id = 'cp' + (++uid);

    var hidden = document.createElement('input');
    hidden.type = 'hidden';
    hidden.name = 'model';
    input.removeAttribute('name');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-controls', id + '-list');
    input.placeholder = L('Марка и модель: BMW X5, Логан, Октавия…', 'Make and model: BMW X5, Logan, Octavia…');

    var wrap = document.createElement('div');
    wrap.className = 'carpick';
    var cell = function (cls) { var d = document.createElement('div'); d.className = 'carpick__f ' + cls; return d; };
    var fModel = cell('carpick__f--model'), fYear = cell('carpick__f--year'), fEng = cell('carpick__f--eng');
    input.parentNode.insertBefore(wrap, input);
    fModel.appendChild(input);
    var mkField = function (ph, label, typed) {
      var s = input.cloneNode(false);
      s.removeAttribute('id');
      s.removeAttribute('data-carpick');
      s.removeAttribute('aria-autocomplete');
      s.readOnly = !typed;
      s.disabled = true;
      s.value = '';
      s.placeholder = ph;
      s.setAttribute('aria-label', label);
      if (!typed) s.setAttribute('inputmode', 'none');
      return s;
    };
    var year = mkField(L('Год', 'Year'), L('Год выпуска', 'Year'));
    // the engine field also takes typing: most makes have no engine list, so "1.6 TDI" or "2.0 газ" can be written in
    var eng = mkField(L('Двигатель', 'Engine'), L('Двигатель', 'Engine'), true);
    fYear.appendChild(year);
    fEng.appendChild(eng);
    wrap.appendChild(fModel); wrap.appendChild(fYear); wrap.appendChild(fEng);
    wrap.appendChild(hidden);
    var list = document.createElement('ul');
    list.className = 'carpick__list';
    list.id = id + '-list';
    list.setAttribute('role', 'listbox');
    list.hidden = true;
    document.body.appendChild(list);
    [year, eng].forEach(function (s) { s.setAttribute('aria-controls', id + '-list'); });

    var fit = function () { wrap.classList.toggle('carpick--narrow', wrap.getBoundingClientRect().width < 460); };
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(wrap); else fit();

    var st = { m: null, g: null, y: 0, e: '', free: '' };

    var compose = function () {
      if (!st.m) { hidden.value = st.free; return; }
      var g = st.g;
      if (!g && st.y) {
        var gs = st.m.gens.filter(function (x) { return st.y >= x.from && st.y <= x.to; });
        if (gs.length === 1) g = gs[0];
      }
      if (!g && st.m.gens.length === 1) g = st.m.gens[0];
      var s = fullName(st.m, g);
      if (st.y) s += ' ' + st.y;
      if (st.e) s += ', ' + st.e;
      hidden.value = s;
    };
    var paint = function () {
      input.value = st.m ? fullName(st.m, st.g) : st.free;
      year.disabled = !st.m;
      year.value = st.y ? String(st.y) : '';
      eng.disabled = !st.m || !st.y;
      eng.value = st.e;
      compose();
    };

    var years = function () {
      var ys = [];
      (st.g ? [st.g] : st.m.gens).forEach(function (g) {
        for (var y = g.to; y >= g.from; y--) {
          var h = ys.filter(function (o) { return o.y === y; })[0];
          if (h) h.gens.push(g); else ys.push({ y: y, gens: [g] });
        }
      });
      return ys.sort(function (a, b) { return b.y - a.y; });
    };
    var gensOfYear = function () { return (st.g ? [st.g] : st.m.gens).filter(function (g) { return st.y >= g.from && st.y <= g.to; }); };

    /* list rendering */
    var owner = null, items = [], act = -1, placed = false;
    var theme = function () {
      var cs = getComputedStyle(owner);
      var solid = function (c) { var a = /rgba\([^)]*,\s*([\d.]+)\)/.exec(c); return c && c !== 'transparent' && (!a || +a[1] > 0.92); };
      var bg = cs.backgroundColor;
      if (!solid(bg)) {
        var rgb = (cs.color.match(/[\d.]+/g) || [0, 0, 0]).slice(0, 3).map(Number);
        bg = rgb[0] + rgb[1] + rgb[2] > 380 ? '#151515' : '#ffffff';
      }
      list.style.setProperty('--cp-bg', bg);
      list.style.setProperty('--cp-fg', cs.color);
      list.style.setProperty('--cp-bd', cs.borderTopColor);
      list.style.setProperty('--cp-r', cs.borderTopLeftRadius);
      list.style.font = cs.font;
    };
    var place = function () {
      var o = owner.getBoundingClientRect();
      if (!placed && innerHeight - o.bottom < Math.min(list.scrollHeight, 260)) { owner.scrollIntoView({ block: 'center' }); o = owner.getBoundingClientRect(); }
      placed = true;
      var w = wrap.getBoundingClientRect();
      var box = o.width < 220 ? w : o;
      list.style.left = box.left + 'px';
      list.style.width = box.width + 'px';
      var below = innerHeight - o.bottom - 8, above = o.top - 8;
      var h = Math.min(list.scrollHeight, 320, innerHeight * 0.46);
      if (below < Math.min(h, 180) && above > below) { list.style.top = 'auto'; list.style.bottom = (innerHeight - o.top + 4) + 'px'; list.style.maxHeight = Math.min(320, above) + 'px'; }
      else { list.style.bottom = 'auto'; list.style.top = (o.bottom + 4) + 'px'; list.style.maxHeight = Math.max(160, Math.min(320, below)) + 'px'; }
    };
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var open = function (el, rows) {
      owner = el;
      placed = false;
      items = [];
      act = -1;
      list.innerHTML = '';
      rows.forEach(function (r) {
        var li = document.createElement('li');
        if (r.group) { li.className = 'carpick__grp'; li.textContent = r.group; li.setAttribute('role', 'presentation'); list.appendChild(li); return; }
        li.id = id + '-o' + items.length;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', String(!!r.sel));
        if (r.cls) li.className = r.cls;
        li.innerHTML = r.html;
        li.addEventListener('mousedown', function (e) { e.preventDefault(); });
        li.addEventListener('click', function () { r.pick(); });
        list.appendChild(li);
        items.push({ li: li, pick: r.pick });
        if (r.sel && act < 0) act = items.length - 1;
      });
      [input, year, eng].forEach(function (x) { x.setAttribute('aria-expanded', String(x === el)); });
      list.hidden = !list.children.length;
      if (list.hidden) { owner = null; return; }
      theme();
      place();
      move(act < 0 && el === input && input.value ? 0 : act);
      list.scrollTop = 0;
      if (act > 0) items[act].li.scrollIntoView({ block: 'nearest' });
    };
    var close = function () {
      list.hidden = true;
      owner = null;
      [input, year, eng].forEach(function (x) { x.setAttribute('aria-expanded', 'false'); x.removeAttribute('aria-activedescendant'); });
    };
    var move = function (i) {
      if (!items.length) return;
      act = Math.max(0, Math.min(items.length - 1, i));
      items.forEach(function (it, k) { it.li.classList.toggle('is-act', k === act); });
      if (owner) owner.setAttribute('aria-activedescendant', items[act].li.id);
      if (act === 0) list.scrollTop = 0; else items[act].li.scrollIntoView({ block: 'nearest' });
    };

    var openModels = function () {
      var q = st.m && input.value === fullName(st.m, st.g) ? '' : input.value;
      var res = search(q);
      var rows = res.map(function (r) {
        var sub = r.g ? r.g.from + '–' + (r.g.now ? L('н. в.', 'now') : r.g.to) : '';
        return {
          html: '<span><span class="carpick__mk">' + esc(r.m.make) + '</span>' + esc(modelName(r.m, r.g) + (r.year ? ' ' + r.year : '')) + '</span>' + (sub ? '<small>' + sub + '</small>' : ''),
          sel: st.m === r.m && st.g === (r.g || null),
          pick: function () { chooseModel(r.m, r.g || null, r.year || 0); }
        };
      });
      var typed = input.value.trim();
      if (typed && !res.some(function (r) { return r.score >= 3; })) {
        rows.push({ cls: 'carpick__free', html: esc(L('Нет в списке — оставить «' + typed + '»', 'Not listed — keep “' + typed + '”')), pick: function () { chooseFree(typed); } });
      }
      if (!typed) rows.push({ cls: 'carpick__free', html: esc(L('Начните вводить марку или модель', 'Start typing a make or model')), pick: function () {} });
      open(input, rows);
    };
    var chooseModel = function (m, g, y) {
      st.m = m; st.g = g; st.free = '';
      st.y = y || 0; st.e = '';
      if (!st.y && g && g.from === g.to) st.y = g.from;
      paint();
      close();
      setTimeout(function () { if (st.y) { eng.focus(); } else { year.focus(); } }, 0);
    };
    var chooseFree = function (t) {
      st.m = null; st.g = null; st.y = 0; st.e = ''; st.free = t;
      paint();
      close();
    };
    var openYears = function () {
      if (!st.m) return;
      var multi = !st.g && st.m.gens.length > 1;
      open(year, years().map(function (o) {
        return {
          html: o.y + (multi ? '<small>' + esc(o.gens.map(function (g) { return g.label; }).filter(Boolean).join(' / ')) + '</small>' : ''),
          sel: o.y === st.y,
          pick: function () {
            st.y = o.y;
            paint();
            close();
            setTimeout(function () { eng.focus(); }, 0);
          }
        };
      }));
    };
    var openEngines = function () {
      if (!st.m || !st.y) return;
      var q = norm(eng.value === st.e ? '' : eng.value);
      var rows = [];
      var gs = gensOfYear().filter(function (g) { return g.engines; });
      gs.forEach(function (g) {
        var ls = g.engines.filter(function (e) { return st.y >= e.from && st.y <= e.to && (!q || norm(e.name).indexOf(q) === 0); });
        if (!ls.length) return;
        if (gs.length > 1) rows.push({ group: modelName(st.m, g) + ' · ' + g.from + '–' + (g.now ? L('н. в.', 'now') : g.to) });
        ls.forEach(function (e) {
          var label = engName(e.name) + (e.name === 'EV' ? '' : ' · ' + fuel(e.name));
          rows.push({ html: esc(engName(e.name)) + (e.name === 'EV' ? '' : '<small>' + fuel(e.name) + '</small>'), sel: st.e === label, pick: function () { st.e = label; paint(); close(); } });
        });
      });
      // no engine list for this car, or nothing matched: fuel types, and whatever was typed
      if (!rows.length) {
        FUELS.forEach(function (f) { if (!q || norm(f).indexOf(q) === 0) rows.push({ html: esc(f), sel: st.e === f, pick: function () { st.e = f; paint(); close(); } }); });
        rows.unshift({ group: L('Топливо — или впишите объём: 1.6, 2.0 TDI', 'Fuel — or type the engine: 1.6, 2.0 TDI') });
      }
      var typed = eng.value.trim();
      if (typed && typed !== st.e) rows.push({ cls: 'carpick__free', html: esc(L('Оставить «' + typed + '»', 'Keep “' + typed + '”')), pick: function () { st.e = typed; paint(); close(); } });
      open(eng, rows);
    };

    /* events */
    input.addEventListener('focus', function () { input.select(); openModels(); });
    input.addEventListener('click', function () { if (list.hidden) openModels(); });
    input.addEventListener('input', function () {
      st.m = null; st.g = null; st.y = 0; st.e = ''; st.free = input.value.trim();
      year.value = ''; eng.value = ''; year.disabled = true; eng.disabled = true;
      compose();
      openModels();
    });
    year.addEventListener('focus', openYears);
    year.addEventListener('click', function () { if (list.hidden) openYears(); });
    eng.addEventListener('focus', openEngines);
    eng.addEventListener('click', function () { if (list.hidden) openEngines(); });
    eng.addEventListener('input', openEngines);
    // a typed engine that was not picked from the list still counts
    eng.addEventListener('change', function () { if (eng.value.trim() !== st.e) { st.e = eng.value.trim(); compose(); } });
    [input, year, eng].forEach(function (el) {
      el.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') { e.preventDefault(); if (list.hidden) el.dispatchEvent(new Event('click')); else move(act + 1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); move(act - 1); }
        else if (e.key === 'Enter') { if (!list.hidden && items[act]) { e.preventDefault(); items[act].pick(); } else if (el === eng) { e.preventDefault(); st.e = eng.value.trim(); paint(); close(); } }
        else if (e.key === 'Escape') { if (!list.hidden) { e.preventDefault(); close(); } }
        else if (e.key === 'Tab') close();
        else if ((e.key === 'Backspace' || e.key === 'Delete') && el === year) {
          e.preventDefault();
          st.y = 0; st.e = '';
          paint(); close();
        }
      });
      el.addEventListener('blur', function () { setTimeout(function () { if (!wrap.contains(document.activeElement)) close(); }, 120); });
    });
    document.addEventListener('pointerdown', function (e) { if (!wrap.contains(e.target) && !list.contains(e.target)) close(); });
    addEventListener('resize', function () { if (owner) place(); });
    addEventListener('scroll', function () { if (owner) place(); }, true);

    paint();
  };

  var run = function () {
    document.querySelectorAll('[data-booking] input[name="model"], [data-check] input[name="model"]').forEach(function (i) {
      if (i.type !== 'hidden') enhance(i);
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
