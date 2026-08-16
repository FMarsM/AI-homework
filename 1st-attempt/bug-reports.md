# Баг-репорты — fmarsm.github.io-main (наивный прогон)

Окружение для всех багов: Chromium (движок встроенного Claude Browser MCP),
Windows 10 Pro 10.0.19045, сайт открыт с `http://localhost:8080`
(`python -m http.server 8080 --directory fmarsm.github.io-main`).

Скриншот сделать не удалось — MCP-инструмент `computer/screenshot` в этой
сессии вернул ошибку `the Browser pane is not displayed, so the page is not
compositing frames`. Вместо картинки в качестве подтверждения приведён
фрагмент разметки и вывод, полученный через `javascript_tool`
(выполнение JS в контексте открытой страницы) — то есть реальный
консольный/DOM-лог с этой же страницы, а не пересказ.

---

## Баг #1

- **Среда:** Chromium (Claude Browser MCP), Windows 10 Pro 10.0.19045
- **Предусловия:** открыта страница `http://localhost:8080/contacts.html`, ширина экрана любая, язык — русский
- **Шаги воспроизведения:**
  1. Найти поле «Количество заселяющихся» (`name="Number_of_clients"`)
  2. Ввести в поле нечисловое значение, например `abc`
  3. Вызвать событие `change` (потерять фокус поля / нажать Tab)
- **Ожидаемый результат:** поле принимает только число от 0 до 30;
  некорректный ввод отклоняется или приводится к допустимому значению —
  так же, как для отрицательных чисел и чисел больше 30, которые
  корректно обрезаются функцией `handleChange()`
- **Фактический результат:** значение `abc` остаётся в поле без изменений
  и без блокировки отправки формы, значение уйдёт в Google-таблицу как
  есть. Причина — поле имеет `type="text"` (не `type="number"`), а
  `handleChange()` сравнивает `input.value` с числами (`input.value < 0`,
  `input.value > 30`): для нечисловой строки оба сравнения дают `NaN` и
  условие всегда ложно, обрезка не срабатывает
- **Серьёзность:** Major (обходит единственную клиентскую валидацию
  числового поля, мусорные данные уходят в боевую таблицу заявок)
- **Подтверждение:**
  ```
  fmarsm.github.io-main/contacts.html:71
  <input type="text" id="text" name="Number_of_clients" required autocomplete="off" onchange="handleChange(this)">

  fmarsm.github.io-main/contacts.html:88-91
  function handleChange(input) {
    if (input.value < 0) input.value = 0;
    if (input.value > 30) input.value = 30;
  }
  ```
  Живой прогон через `javascript_tool` (JS в контексте открытой страницы):
  ```js
  numField.value = 'abc'; numField.dispatchEvent(new Event('change'));
  // => numField.value === "abc"   (ожидалось: очищено/обрезано)
  numField.value = '-15'; numField.dispatchEvent(new Event('change'));
  // => numField.value === "0"     (для сравнения — это работает корректно)
  numField.value = '999'; numField.dispatchEvent(new Event('change'));
  // => numField.value === "30"    (для сравнения — это тоже работает)
  ```
  Результат: `{"afterAbc":"abc","afterNegative":"0","afterTooBig":"30"}`

---

## Баг #2

- **Среда:** Chromium (Claude Browser MCP), Windows 10 Pro 10.0.19045
- **Предусловия:** открыта страница `http://localhost:8080/contacts.html`
- **Шаги воспроизведения:**
  1. Открыть DOM страницы (DevTools или `document.querySelectorAll('#text')`)
  2. Посчитать количество элементов с `id="text"`
  3. Проверить, есть ли у `<label>` атрибут `for`, связывающий подпись с полем
- **Ожидаемый результат:** `id` уникален на странице (требование HTML-спеки);
  каждая `<label>` явно связана с полем через `for="..."`/`id="..."`, чтобы
  клик по подписи и скринридеры фокусировали нужное поле
- **Фактический результат:** все 7 полей формы (`Name`, `Phone_number`,
  `Date1`, `Date2`, `Number_of_clients`, `House`, `Commentaries`) используют
  один и тот же `id="text"`; ни у одной из 7 `<label>` нет атрибута `for`.
  Клик по любой подписи не фокусирует поле, `document.getElementById('text')`
  всегда вернёт только первый (`Name`), а не то поле, которое имелось в виду
- **Серьёзность:** Minor (нарушение валидности HTML и доступности; текущий
  JS-код не использует `getElementById('text')`, поэтому явного функционального
  отказа сейчас нет, но это хрупкое место — любой будущий скрипт, полагающийся
  на `id="text"`, получит не тот элемент)
- **Подтверждение:**
  ```
  fmarsm.github.io-main/contacts.html:62-79
  <input type="text" id="text" name="Name" ...>
  <input type="tel"  id="text" name="Phone_number" ...>
  <input type="date" id="text" name="Date1" ...>
  <input type="date" id="text" name="Date2" ...>
  <input type="text" id="text" name="Number_of_clients" ...>
  <select id="text" name="House">...</select>
  <textarea id="text" name="Commentaries">...</textarea>
  ```
  Живой прогон через `javascript_tool`:
  ```js
  document.querySelectorAll('#text').length   // => 7 (ожидалось: 0 или 1)
  document.querySelectorAll('label[for]').length // => 0 из 7 label
  ```
  Результат: `{"countIdText":7,"labelsWithFor":0,"totalLabels":7}`

---

## Баг #3

- **Среда:** Chromium (Claude Browser MCP), Windows 10 Pro 10.0.19045
- **Предусловия:** открыта страница `http://localhost:8080/contacts.html`
  (русская версия), футер сайта виден
- **Шаги воспроизведения:**
  1. Прокрутить страницу `contacts.html` до футера
  2. Навести/кликнуть на ссылку «Контакты» в футере
  3. Сравнить `href` этой ссылки с аналогичной ссылкой на остальных
     9 страницах сайта (включая `contacts-eng.html`)
- **Ожидаемый результат:** ссылка «Контакты» в футере ведёт на
  `contacts.html`, как на всех остальных страницах сайта (на
  `index.html`, `chaika1.html`, `chaika2.html`, `chaika3.html` и их
  `-eng`-версиях ссылка «Контакты»/«Contacts» в футере ведёт на
  `contacts.html`/`contacts-eng.html` соответственно — включая
  `contacts-eng.html`, где self-ссылка на себя же оформлена корректно)
- **Фактический результат:** на `contacts.html` (RU) ссылка «Контакты» в
  футере ведёт на `#` (пустой якорь, клик не выполняет навигацию и не
  делает ничего полезного), а не на `contacts.html`
- **Серьёзность:** Trivial (страница и так открыта, видимого вреда для
  пользователя нет, но это расхождение между RU- и ENG-версией одной и той
  же страницы и единственная ссылка на сайте с таким поведением)
- **Подтверждение:**
  ```
  fmarsm.github.io-main/contacts.html:114
  <a href="#">Контакты</a>

  fmarsm.github.io-main/contacts-eng.html:114
  <a href="contacts-eng.html">Contacts</a>

  fmarsm.github.io-main/index.html:113
  <a href="contacts.html">Контакты</a>
  ```
  Живой прогон через `javascript_tool` на `contacts.html`:
  ```js
  [...document.querySelectorAll('.footer a')].map(a => a.getAttribute('href'))
  // => ["#", "https://wa.me/79655908129", "https://t.me/leviy_4el"]
  ```

---

## Проверено и НЕ является багом (важное расхождение с `SPEC.md`)

`SPEC.md` отмечал как подозрение на баг обратные слэши в путях ресурсов
(`assets\img\...`, `assets\css\style.css`) — по спецификации URL для схем
`http`/`https` браузеры (в т.ч. Chromium) нормализуют `\` в `/`, поэтому
ресурсы грузятся корректно. Проверено автоматически: на всех 10 страницах
собраны все `src`/`href` без `.html` и без `http`, каждый путь запрошен
через `fetch()` — все ответы `200 OK`, ни одного 404. Это пример
расхождения «предполагали баг — проверка не подтвердила».
