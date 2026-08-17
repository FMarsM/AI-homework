# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: evidence.spec.js >> BUG-03: ссылка «Контакты» в подвале >> chaika3.html: ссылка в подвале ведёт на contacts.html
- Location: evidence.spec.js:79:5

# Error details

```
Error: на chaika3.html ссылка «Контакты» в подвале имеет href="#"

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
  - generic [ref=e16]:
    - generic [ref=e17]:
      - generic [ref=e18]:
        - generic:
          - article [ref=e19]
          - article [ref=e21]
          - article [ref=e23]
          - article [ref=e25]
          - article [ref=e27]
          - article [ref=e29]
          - article [ref=e31]
          - article [ref=e33]
          - article [ref=e35]
          - article [ref=e37]
          - article [ref=e39]
          - article [ref=e41]
          - article [ref=e43]
          - article [ref=e45]
          - article [ref=e47]
          - article [ref=e49]
      - generic [ref=e51]:
        - generic [ref=e52]: 
        - generic [ref=e53]: 
      - generic [ref=e54]:
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
        - generic [ref=e70] [cursor=pointer]
    - generic [ref=e71]:
      - heading "О коттедже:" [level=2] [ref=e72]
      - paragraph [ref=e73]: Двухэтажный кирпичный дом 120кв.м баварская кладка. Расположен п. Щербаково СНТ Чайка. Первый этаж- гостиная 40кв.м мягкий угловой диван, банкетный стол на 20 персон, современная музыкальная техника, телевизор 43", кухня укомплектована бытовой техникой, санузел. Второй этаж- три спальни (2+2) семейное размещение, холл с диваном, всего в доме 12 спальных мест, санузел, душевая. На территории парковка 4 автомобиля, площадка с мангалом.
    - generic [ref=e74]:
      - heading "Дополнительно:" [level=2] [ref=e75]
      - list [ref=e76]:
        - listitem [ref=e77]:
          - paragraph [ref=e78]: "Количество комнат: 3"
        - listitem [ref=e79]:
          - paragraph [ref=e80]: "Площадь дома: 120 м²"
        - listitem [ref=e81]:
          - paragraph [ref=e82]: "Площадь участка: 8 сот."
        - listitem [ref=e83]:
          - paragraph [ref=e84]: "Этажей в доме: 2"
        - listitem [ref=e85]:
          - paragraph [ref=e86]: "Санузел: в доме"
        - listitem [ref=e87]:
          - paragraph [ref=e88]: "Техника: холодильник, плита, микроволновка, стиральная машина, телевизор, утюг"
        - listitem [ref=e89]:
          - paragraph [ref=e90]: "Интернет и ТВ: Wi-Fi, телевидение"
      - generic [ref=e91]:
        - heading "Правила:" [level=2] [ref=e92]
        - list [ref=e93]:
          - listitem [ref=e94]:
            - paragraph [ref=e95]: "Количество гостей: 8 и больше"
          - listitem [ref=e96]:
            - paragraph [ref=e97]: "Можно с детьми: да"
          - listitem [ref=e98]:
            - paragraph [ref=e99]: "Можно с животными: да"
          - listitem [ref=e100]:
            - paragraph [ref=e101]: "Можно курить: нет"
          - listitem [ref=e102]:
            - paragraph [ref=e103]: "Разрешены вечеринки: да"
          - listitem [ref=e104]:
            - paragraph [ref=e105]: "Есть отчётные документы: да"
    - table [ref=e106]:
      - rowgroup [ref=e107]:
        - row [ref=e108]:
          - columnheader "Количество гостей" [ref=e109]
          - columnheader "Цена(Пн-Чт / Пт-Сб / Вс)" [ref=e110]
        - row [ref=e111]:
          - cell "до 5 человек" [ref=e112]
          - cell "5000 / 7000 / 6000" [ref=e113]
        - row [ref=e114]:
          - cell "до 10 человек" [ref=e115]
          - cell "8000 / 10000 / 9000" [ref=e116]
        - row [ref=e117]:
          - cell "до 15 человек" [ref=e118]
          - cell "10000 / 12000 / 11000" [ref=e119]
        - row [ref=e120]:
          - cell "до 20 человек" [ref=e121]
          - cell "12000 / 14000 / 13000" [ref=e122]
        - row [ref=e123]:
          - cell "до 25 человек" [ref=e124]
          - cell "14000 / 16000 / 15000" [ref=e125]
        - row [ref=e126]:
          - cell "до 30 человек" [ref=e127]
          - cell "15000 / 17000 / 16000" [ref=e128]
  - generic [ref=e129]:
    - link "Контакты" [ref=e130] [cursor=pointer]:
      - /url: "#"
    - link "WhatsApp" [ref=e131] [cursor=pointer]:
      - /url: https://wa.me/79655908129
    - link "Telegram" [ref=e132] [cursor=pointer]:
      - /url: https://t.me/leviy_4el
    - paragraph [ref=e133]: Marsel Fatkhullin 2023
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
     |                                                                                ^ Error: на chaika3.html ссылка «Контакты» в подвале имеет href="#"
  83 |     });
  84 |   }
  85 | });
  86 | 
```