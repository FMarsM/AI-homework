# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bug-01-date-range.spec.js >> BUG-01: интервал дат в форме бронирования >> заявка с перевёрнутым интервалом не должна уходить на сервер
- Location: bug-01-date-range.spec.js:41:3

# Error details

```
Error: запрос на боевой эндпоинт был отправлен с некорректным интервалом дат: ------WebKitFormBoundarymUEnpLqTas7hmO7e
Content-Disposition: form-data; name="Name"

TEST QA 2026-08-16
------WebKitFormBoundarymUEnpLqTas7hmO7e
Content-Disposition: form-data; name="Phone_number"

+79000000000
------WebKitFormBoundarymUEnpLqTas7hmO7e
Content-Disposition: form-data; name="Date1"

2026-09-10
------WebKitFormBoundarymUEnpLqTas7hmO7e
Content-Disposition: form-data; name="Date2"

2026-09-01
------WebKitFormBoundarymUEnpLqTas7hmO7e
Content-Disposition: form-data; name="Number_of_clients"

4
------WebKitFormBoundarymUEnpLqTas7hmO7e
Content-Disposition: form-data; name="House"

1
------WebKitFormBoundarymUEnpLqTas7hmO7e
Content-Disposition: form-data; name="Commentaries"


------WebKitFormBoundarymUEnpLqTas7hmO7e--


expect(received).toHaveLength(expected)

Expected length: 0
Received length: 1
Received array:  ["------WebKitFormBoundarymUEnpLqTas7hmO7e·
Content-Disposition: form-data; name=\"Name\"···
TEST QA 2026-08-16·
------WebKitFormBoundarymUEnpLqTas7hmO7e·
Content-Disposition: form-data; name=\"Phone_number\"···
+79000000000·
------WebKitFormBoundarymUEnpLqTas7hmO7e·
Content-Disposition: form-data; name=\"Date1\"···
2026-09-10·
------WebKitFormBoundarymUEnpLqTas7hmO7e·
Content-Disposition: form-data; name=\"Date2\"···
2026-09-01·
------WebKitFormBoundarymUEnpLqTas7hmO7e·
Content-Disposition: form-data; name=\"Number_of_clients\"···
4·
------WebKitFormBoundarymUEnpLqTas7hmO7e·
Content-Disposition: form-data; name=\"House\"···
1·
------WebKitFormBoundarymUEnpLqTas7hmO7e·
Content-Disposition: form-data; name=\"Commentaries\"·····
------WebKitFormBoundarymUEnpLqTas7hmO7e--·
"]
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - heading [level=1] [ref=e6]:
        - link "Коттеджи \"Чайка\" Казань" [ref=e7] [cursor=pointer]:
          - /url: index.html
      - heading "Проведите праздник с комфортом и уютом" [level=2] [ref=e8]
    - generic [ref=e9]:
      - button [ref=e10]
      - button [ref=e12]
    - button [ref=e14]
  - generic [ref=e15]:
    - heading "Оставьте свои данные и мы вам перезвоним!" [level=2] [ref=e16]
    - generic [ref=e18]:
      - generic [ref=e19]: ФИО
      - textbox [ref=e20]: TEST QA 2026-08-16
      - generic [ref=e21]: Номер телефона
      - textbox [ref=e22]: "+79000000000"
      - generic [ref=e23]: Дата заезда
      - textbox [ref=e24]: 2026-09-10
      - generic [ref=e25]: Дата отъезда
      - textbox [ref=e26]: 2026-09-01
      - generic [ref=e27]: Количество заселяющихся
      - textbox [ref=e28]: "4"
      - generic [ref=e29]: Выбранный дом
      - combobox [ref=e30]:
        - option "Чайка-1" [selected]
        - option "Чайка-2"
        - option "Чайка-3"
      - generic [ref=e31]: Дополнительная информация
      - textbox "Комментарий" [ref=e32]
      - button "Отправить" [active] [ref=e33] [cursor=pointer]
  - generic [ref=e34]:
    - link "Контакты" [ref=e35] [cursor=pointer]:
      - /url: "#"
    - link "WhatsApp" [ref=e36] [cursor=pointer]:
      - /url: https://wa.me/79655908129
    - link "Telegram" [ref=e37] [cursor=pointer]:
      - /url: https://t.me/leviy_4el
    - paragraph [ref=e38]: Marsel Fatkhullin 2023
```

# Test source

```ts
  1  | // @ts-check
  2  | const { test, expect } = require('@playwright/test');
  3  | 
  4  | /**
  5  |  * Автотест на BUG-01 — форма бронирования принимает дату отъезда,
  6  |  * которая раньше даты заезда, и отправляет такую заявку на сервер.
  7  |  *
  8  |  * Тест ДОЛЖЕН падать на текущей версии сайта: он фиксирует дефект.
  9  |  * После исправления (валидация интервала дат) тест станет зелёным.
  10 |  *
  11 |  * ВАЖНО: боевой эндпоинт Google Apps Script перехватывается через page.route
  12 |  * и НИ ОДИН запрос до него не доходит. Реальные заявки владельцу сайта
  13 |  * не отправляются.
  14 |  */
  15 | 
  16 | const ENDPOINT = '**script.google.com**';
  17 | 
  18 | /** Заполняет форму заведомо перевёрнутым интервалом дат. */
  19 | async function fillWithInvertedDates(page) {
  20 |   await page.fill('input[name="Name"]', 'TEST QA 2026-08-16');
  21 |   await page.fill('input[name="Phone_number"]', '+79000000000');
  22 |   await page.fill('input[name="Date1"]', '2026-09-10'); // заезд
  23 |   await page.fill('input[name="Date2"]', '2026-09-01'); // отъезд — на 9 дней РАНЬШЕ
  24 |   await page.fill('input[name="Number_of_clients"]', '4');
  25 | }
  26 | 
  27 | test.describe('BUG-01: интервал дат в форме бронирования', () => {
  28 |   test('форма не должна считаться валидной, если отъезд раньше заезда', async ({ page }) => {
  29 |     await page.goto('/contacts.html');
  30 |     await fillWithInvertedDates(page);
  31 | 
  32 |     const isValid = await page.evaluate(
  33 |       () => document.forms['submit-to-google-sheet'].checkValidity()
  34 |     );
  35 | 
  36 |     // Ожидание: браузерная или собственная валидация блокирует такой интервал.
  37 |     // Факт: checkValidity() === true — ограничений на порядок дат нет вообще.
  38 |     expect(isValid, 'форма с датой отъезда раньше даты заезда прошла валидацию').toBe(false);
  39 |   });
  40 | 
  41 |   test('заявка с перевёрнутым интервалом не должна уходить на сервер', async ({ page }) => {
  42 |     /** @type {string[]} */
  43 |     const sent = [];
  44 | 
  45 |     // Перехватываем боевой эндпоинт: запрос обрывается, наружу ничего не уходит.
  46 |     await page.route(ENDPOINT, async (route) => {
  47 |       sent.push(route.request().postData() ?? '<no body>');
  48 |       await route.abort();
  49 |     });
  50 | 
  51 |     await page.goto('/contacts.html');
  52 |     await fillWithInvertedDates(page);
  53 |     await page.click('button.form_button');
  54 | 
  55 |     // Даём обработчику submit отработать.
  56 |     await page.waitForTimeout(1000);
  57 | 
  58 |     // Ожидание: запрос не отправлен, потому что данные некорректны.
  59 |     // Факт: запрос уходит — в перехваченном теле видны Date1 > Date2.
  60 |     expect(
  61 |       sent,
  62 |       `запрос на боевой эндпоинт был отправлен с некорректным интервалом дат: ${sent.join(' | ')}`
> 63 |     ).toHaveLength(0);
     |       ^ Error: запрос на боевой эндпоинт был отправлен с некорректным интервалом дат: ------WebKitFormBoundarymUEnpLqTas7hmO7e
  64 |   });
  65 | });
  66 | 
```