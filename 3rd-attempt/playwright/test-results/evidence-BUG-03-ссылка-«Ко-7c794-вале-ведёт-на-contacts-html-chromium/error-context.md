# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: evidence.spec.js >> BUG-03: ссылка «Контакты» в подвале >> contacts.html: ссылка в подвале ведёт на contacts.html
- Location: evidence.spec.js:79:5

# Error details

```
Error: на contacts.html ссылка «Контакты» в подвале имеет href="#"

expect(received).toBe(expected) // Object.is equality

Expected: "contacts.html"
Received: "#"
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
      - textbox [ref=e20]
      - generic [ref=e21]: Номер телефона
      - textbox [ref=e22]
      - generic [ref=e23]: Дата заезда
      - textbox [ref=e24]
      - generic [ref=e25]: Дата отъезда
      - textbox [ref=e26]
      - generic [ref=e27]: Количество заселяющихся
      - textbox [ref=e28]
      - generic [ref=e29]: Выбранный дом
      - combobox [ref=e30]:
        - option "Чайка-1" [selected]
        - option "Чайка-2"
        - option "Чайка-3"
      - generic [ref=e31]: Дополнительная информация
      - textbox "Комментарий" [ref=e32]
      - button "Отправить" [ref=e33] [cursor=pointer]
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
  3  | const path = require('path');
  4  | 
  5  | /**
  6  |  * Сбор доказательств для баг-репортов: скриншоты на четырёх ширинах
  7  |  * и проверки BUG-02 / BUG-03. Сайт не модифицируется.
  8  |  * Боевой эндпоинт Google везде перехватывается — наружу ничего не уходит.
  9  |  */
  10 | 
  11 | const SHOTS = path.join(__dirname, '..', 'screenshots');
  12 | const WIDTHS = [375, 768, 1024, 1440];
  13 | const RU_PAGES = ['index.html', 'chaika1.html', 'chaika2.html', 'chaika3.html', 'contacts.html'];
  14 | 
  15 | test.describe('Скриншоты по ширинам', () => {
  16 |   for (const width of WIDTHS) {
  17 |     test(`ширина ${width}: главная, коттедж, контакты`, async ({ page }) => {
  18 |       await page.setViewportSize({ width, height: 900 });
  19 |       for (const p of ['index.html', 'chaika1.html', 'contacts.html']) {
  20 |         await page.goto('/' + p);
  21 |         await page.waitForTimeout(400);
  22 |         await page.screenshot({
  23 |           path: path.join(SHOTS, `viewport-${width}-${p.replace('.html', '')}.png`),
  24 |           fullPage: false,
  25 |         });
  26 |         // Горизонтального скролла быть не должно ни на одной ширине.
  27 |         const overflow = await page.evaluate(
  28 |           () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  29 |         );
  30 |         expect(overflow, `${p} на ${width}px даёт горизонтальный скролл (+${overflow}px)`).toBeLessThanOrEqual(1);
  31 |       }
  32 |     });
  33 |   }
  34 | });
  35 | 
  36 | test.describe('BUG-02: ложное подтверждение при ошибке сервера', () => {
  37 |   test('при HTTP 500 пользователь не должен видеть «заявка зарегистрирована»', async ({ page }) => {
  38 |     // Эндпоинт подменяем на ошибку 500 — реальный сервис не вызывается.
  39 |     await page.route('**script.google.com**', (route) =>
  40 |       route.fulfill({ status: 500, contentType: 'text/plain', body: 'Internal Server Error' })
  41 |     );
  42 | 
  43 |     await page.goto('/contacts.html');
  44 |     await page.fill('input[name="Name"]', 'TEST QA 2026-08-16');
  45 |     await page.fill('input[name="Phone_number"]', '+79000000000');
  46 |     await page.fill('input[name="Date1"]', '2026-09-01');
  47 |     await page.fill('input[name="Date2"]', '2026-09-05');
  48 |     await page.fill('input[name="Number_of_clients"]', '4');
  49 |     await page.click('button.form_button');
  50 |     await page.waitForTimeout(1000);
  51 | 
  52 |     const msg = (await page.locator('#success').innerText()).trim();
  53 |     await page.screenshot({ path: path.join(SHOTS, 'bug-02-false-success-http-500.png') });
  54 | 
  55 |     expect(msg, `сервер ответил 500, а пользователю показано: "${msg}"`).not.toContain('зарегистрирована');
  56 |   });
  57 | 
  58 |   test('при сетевом сбое пользователь должен получить сообщение об ошибке', async ({ page }) => {
  59 |     await page.route('**script.google.com**', (route) => route.abort('failed'));
  60 | 
  61 |     await page.goto('/contacts.html');
  62 |     await page.fill('input[name="Name"]', 'TEST QA 2026-08-16');
  63 |     await page.fill('input[name="Phone_number"]', '+79000000000');
  64 |     await page.fill('input[name="Date1"]', '2026-09-01');
  65 |     await page.fill('input[name="Date2"]', '2026-09-05');
  66 |     await page.fill('input[name="Number_of_clients"]', '4');
  67 |     await page.click('button.form_button');
  68 |     await page.waitForTimeout(1000);
  69 | 
  70 |     const msg = (await page.locator('#success').innerText()).trim();
  71 |     await page.screenshot({ path: path.join(SHOTS, 'bug-02-network-fail-silent.png') });
  72 | 
  73 |     expect(msg, 'при обрыве сети пользователю не показано ничего — заявка «исчезла» молча').not.toBe('');
  74 |   });
  75 | });
  76 | 
  77 | test.describe('BUG-03: ссылка «Контакты» в подвале', () => {
  78 |   for (const p of RU_PAGES) {
  79 |     test(`${p}: ссылка в подвале ведёт на contacts.html`, async ({ page }) => {
  80 |       await page.goto('/' + p);
  81 |       const href = await page.locator('.footer a').first().getAttribute('href');
> 82 |       expect(href, `на ${p} ссылка «Контакты» в подвале имеет href="${href}"`).toBe('contacts.html');
     |                                                                                ^ Error: на contacts.html ссылка «Контакты» в подвале имеет href="#"
  83 |     });
  84 |   }
  85 | });
  86 | 
```