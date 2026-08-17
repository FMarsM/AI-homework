// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

/**
 * Сбор доказательств для баг-репортов: скриншоты на четырёх ширинах
 * и проверки BUG-02 / BUG-03. Сайт не модифицируется.
 * Боевой эндпоинт Google везде перехватывается — наружу ничего не уходит.
 */

const SHOTS = path.join(__dirname, '..', 'screenshots');
const WIDTHS = [375, 768, 1024, 1440];
const RU_PAGES = ['index.html', 'chaika1.html', 'chaika2.html', 'chaika3.html', 'contacts.html'];

test.describe('Скриншоты по ширинам', () => {
  for (const width of WIDTHS) {
    test(`ширина ${width}: главная, коттедж, контакты`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const p of ['index.html', 'chaika1.html', 'contacts.html']) {
        await page.goto('/' + p);
        await page.waitForTimeout(400);
        await page.screenshot({
          path: path.join(SHOTS, `viewport-${width}-${p.replace('.html', '')}.png`),
          fullPage: false,
        });
        // Горизонтального скролла быть не должно ни на одной ширине.
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        );
        expect(overflow, `${p} на ${width}px даёт горизонтальный скролл (+${overflow}px)`).toBeLessThanOrEqual(1);
      }
    });
  }
});

test.describe('BUG-02: ложное подтверждение при ошибке сервера', () => {
  test('при HTTP 500 пользователь не должен видеть «заявка зарегистрирована»', async ({ page }) => {
    // Эндпоинт подменяем на ошибку 500 — реальный сервис не вызывается.
    await page.route('**script.google.com**', (route) =>
      route.fulfill({ status: 500, contentType: 'text/plain', body: 'Internal Server Error' })
    );

    await page.goto('/contacts.html');
    await page.fill('input[name="Name"]', 'TEST QA 2026-08-16');
    await page.fill('input[name="Phone_number"]', '+79000000000');
    await page.fill('input[name="Date1"]', '2026-09-01');
    await page.fill('input[name="Date2"]', '2026-09-05');
    await page.fill('input[name="Number_of_clients"]', '4');
    await page.click('button.form_button');
    await page.waitForTimeout(1000);

    const msg = (await page.locator('#success').innerText()).trim();
    await page.screenshot({ path: path.join(SHOTS, 'bug-02-false-success-http-500.png') });

    expect(msg, `сервер ответил 500, а пользователю показано: "${msg}"`).not.toContain('зарегистрирована');
  });

  test('при сетевом сбое пользователь должен получить сообщение об ошибке', async ({ page }) => {
    await page.route('**script.google.com**', (route) => route.abort('failed'));

    await page.goto('/contacts.html');
    await page.fill('input[name="Name"]', 'TEST QA 2026-08-16');
    await page.fill('input[name="Phone_number"]', '+79000000000');
    await page.fill('input[name="Date1"]', '2026-09-01');
    await page.fill('input[name="Date2"]', '2026-09-05');
    await page.fill('input[name="Number_of_clients"]', '4');
    await page.click('button.form_button');
    await page.waitForTimeout(1000);

    const msg = (await page.locator('#success').innerText()).trim();
    await page.screenshot({ path: path.join(SHOTS, 'bug-02-network-fail-silent.png') });

    expect(msg, 'при обрыве сети пользователю не показано ничего — заявка «исчезла» молча').not.toBe('');
  });
});

test.describe('BUG-03: ссылка «Контакты» в подвале', () => {
  for (const p of RU_PAGES) {
    test(`${p}: ссылка в подвале ведёт на contacts.html`, async ({ page }) => {
      await page.goto('/' + p);
      const href = await page.locator('.footer a').first().getAttribute('href');
      expect(href, `на ${p} ссылка «Контакты» в подвале имеет href="${href}"`).toBe('contacts.html');
    });
  }
});
