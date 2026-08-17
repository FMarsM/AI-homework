// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Автотест на BUG-01 — форма бронирования принимает дату отъезда,
 * которая раньше даты заезда, и отправляет такую заявку на сервер.
 *
 * Тест ДОЛЖЕН падать на текущей версии сайта: он фиксирует дефект.
 * После исправления (валидация интервала дат) тест станет зелёным.
 *
 * ВАЖНО: боевой эндпоинт Google Apps Script перехватывается через page.route
 * и НИ ОДИН запрос до него не доходит. Реальные заявки владельцу сайта
 * не отправляются.
 */

const ENDPOINT = '**script.google.com**';

/** Заполняет форму заведомо перевёрнутым интервалом дат. */
async function fillWithInvertedDates(page) {
  await page.fill('input[name="Name"]', 'TEST QA 2026-08-16');
  await page.fill('input[name="Phone_number"]', '+79000000000');
  await page.fill('input[name="Date1"]', '2026-09-10'); // заезд
  await page.fill('input[name="Date2"]', '2026-09-01'); // отъезд — на 9 дней РАНЬШЕ
  await page.fill('input[name="Number_of_clients"]', '4');
}

test.describe('BUG-01: интервал дат в форме бронирования', () => {
  test('форма не должна считаться валидной, если отъезд раньше заезда', async ({ page }) => {
    await page.goto('/contacts.html');
    await fillWithInvertedDates(page);

    const isValid = await page.evaluate(
      () => document.forms['submit-to-google-sheet'].checkValidity()
    );

    // Ожидание: браузерная или собственная валидация блокирует такой интервал.
    // Факт: checkValidity() === true — ограничений на порядок дат нет вообще.
    expect(isValid, 'форма с датой отъезда раньше даты заезда прошла валидацию').toBe(false);
  });

  test('заявка с перевёрнутым интервалом не должна уходить на сервер', async ({ page }) => {
    /** @type {string[]} */
    const sent = [];

    // Перехватываем боевой эндпоинт: запрос обрывается, наружу ничего не уходит.
    await page.route(ENDPOINT, async (route) => {
      sent.push(route.request().postData() ?? '<no body>');
      await route.abort();
    });

    await page.goto('/contacts.html');
    await fillWithInvertedDates(page);
    await page.click('button.form_button');

    // Даём обработчику submit отработать.
    await page.waitForTimeout(1000);

    // Ожидание: запрос не отправлен, потому что данные некорректны.
    // Факт: запрос уходит — в перехваченном теле видны Date1 > Date2.
    expect(
      sent,
      `запрос на боевой эндпоинт был отправлен с некорректным интервалом дат: ${sent.join(' | ')}`
    ).toHaveLength(0);
  });
});
