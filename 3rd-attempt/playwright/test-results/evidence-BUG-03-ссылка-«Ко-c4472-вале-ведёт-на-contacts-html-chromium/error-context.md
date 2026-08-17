# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: evidence.spec.js >> BUG-03: ссылка «Контакты» в подвале >> chaika1.html: ссылка в подвале ведёт на contacts.html
- Location: evidence.spec.js:79:5

# Error details

```
Error: на chaika1.html ссылка «Контакты» в подвале имеет href="#"

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
    - generic [ref=e16]:
      - generic [ref=e17]:
        - generic:
          - article [ref=e18]
          - article [ref=e20]
          - article [ref=e22]
          - article [ref=e24]
          - article [ref=e26]
          - article [ref=e28]
          - article [ref=e30]
          - article [ref=e32]
          - article [ref=e34]
          - article [ref=e36]
          - article [ref=e38]
          - article [ref=e40]
          - article [ref=e42]
          - article [ref=e44]
          - article [ref=e46]
          - article [ref=e48]
      - generic [ref=e50]:
        - generic [ref=e51]: 
        - generic [ref=e52]: 
      - generic [ref=e53]:
        - generic [ref=e54] [cursor=pointer]
        - generic [ref=e55] [cursor=pointer]
        - generic [ref=e56] [cursor=pointer]
        - generic [ref=e57] [cursor=pointer]
        - generic [ref=e58] [cursor=pointer]
        - generic [ref=e59] [cursor=pointer]
        - generic [ref=e60] [cursor=pointer]
        - generic [ref=e61] [cursor=pointer]
        - generic [ref=e62] [cursor=pointer]
        - generic [ref=e63] [cursor=pointer]
        - generic [ref=e64] [cursor=pointer]
        - generic [ref=e65] [cursor=pointer]
        - generic [ref=e66] [cursor=pointer]
        - generic [ref=e67] [cursor=pointer]
        - generic [ref=e68] [cursor=pointer]
        - generic [ref=e69] [cursor=pointer]
    - generic [ref=e70]:
      - heading "О коттедже:" [level=2] [ref=e71]
      - paragraph [ref=e72]: Просторный банкетный зал вмещает до 20 гостей, есть акустическая система и караоке, а жаркая русская банька согреет и взбодрит дух, также к вашим услугам чистый, большой и теплый бассейн. В доме 3 комфортабельные спальни и 14 спальных мест. Застекленная беседка с мангалом и казаном.
    - generic [ref=e73]:
      - heading "Дополнительно:" [level=2] [ref=e74]
      - list [ref=e75]:
        - listitem [ref=e76]:
          - paragraph [ref=e77]: "Количество комнат: 3"
        - listitem [ref=e78]:
          - paragraph [ref=e79]: "Площадь дома: 215 м²"
        - listitem [ref=e80]:
          - paragraph [ref=e81]: "Площадь участка: 8 сот."
        - listitem [ref=e82]:
          - paragraph [ref=e83]: "Этажей в доме: 2"
        - listitem [ref=e84]:
          - paragraph [ref=e85]: "Санузел: в доме"
        - listitem [ref=e86]:
          - paragraph [ref=e87]: "Техника: холодильник, плита, микроволновка, стиральная машина, телевизор, утюг"
        - listitem [ref=e88]:
          - paragraph [ref=e89]: "Интернет и ТВ: Wi-Fi, телевидение"
      - generic [ref=e90]:
        - heading "Правила:" [level=2] [ref=e91]
        - list [ref=e92]:
          - listitem [ref=e93]:
            - paragraph [ref=e94]: "Количество гостей: 8 и больше"
          - listitem [ref=e95]:
            - paragraph [ref=e96]: "Можно с детьми: да"
          - listitem [ref=e97]:
            - paragraph [ref=e98]: "Можно с животными: да"
          - listitem [ref=e99]:
            - paragraph [ref=e100]: "Можно курить: да"
          - listitem [ref=e101]:
            - paragraph [ref=e102]: "Разрешены вечеринки: да"
          - listitem [ref=e103]:
            - paragraph [ref=e104]: "Есть отчётные документы: да"
    - table [ref=e105]:
      - rowgroup [ref=e106]:
        - row [ref=e107]:
          - columnheader "Количество гостей" [ref=e108]
          - columnheader "Цена(Пн-Чт / Пт-Сб / Вс)" [ref=e109]
        - row [ref=e110]:
          - cell "до 5 человек" [ref=e111]
          - cell "5000 / 7000 / 6000" [ref=e112]
        - row [ref=e113]:
          - cell "до 10 человек" [ref=e114]
          - cell "8000/ 10000 / 9000" [ref=e115]
        - row [ref=e116]:
          - cell "до 15 человек" [ref=e117]
          - cell "10000 / 12000 / 11000" [ref=e118]
        - row [ref=e119]:
          - cell "до 20 человек" [ref=e120]
          - cell "12000 / 14000 / 13000" [ref=e121]
        - row [ref=e122]:
          - cell "до 25 человек" [ref=e123]
          - cell "14000 / 16000 / 15000" [ref=e124]
        - row [ref=e125]:
          - cell "до 30 человек" [ref=e126]
          - cell "15000 / 17000 / 16000" [ref=e127]
  - generic [ref=e128]:
    - link "Контакты" [ref=e129] [cursor=pointer]:
      - /url: "#"
    - link "WhatsApp" [ref=e130] [cursor=pointer]:
      - /url: https://wa.me/79655908129
    - link "Telegram" [ref=e131] [cursor=pointer]:
      - /url: https://t.me/leviy_4el
    - paragraph [ref=e132]: Marsel Fatkhullin 2023
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
     |                                                                                ^ Error: на chaika1.html ссылка «Контакты» в подвале имеет href="#"
  83 |     });
  84 |   }
  85 | });
  86 | 
```