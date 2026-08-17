// Сценарий 7 из SPEC.md — единственная РЕАЛЬНАЯ отправка формы на боевой
// Google Apps Script. Лимит по AGENTS.md — 10 отправок за всю задачу, израсходована 1.
// Поле ФИО обязательно промаркировано, чтобы владелец сайта нашёл и удалил строку.
//
// Тест намеренно закрыт переменной окружения, чтобы не выстрелить при обычном
// `npx playwright test`. Запуск:
//   $env:QA_REAL_SUBMIT=1; npx playwright test real-submit.spec.js --reporter=list
const { test, expect } = require('@playwright/test');
const path = require('path');

const SHOTS = path.join(__dirname, '..', 'screenshots');
const MARK = 'TEST QA 2026-08-17';

test('TC-07-real — реальная отправка промаркированной заявки (1 из 10)', async ({ page }) => {
  test.skip(process.env.QA_REAL_SUBMIT !== '1', 'нужна переменная QA_REAL_SUBMIT=1');

  const responses = [];
  page.on('response', r => {
    if (r.url().includes('script.google')) responses.push({ url: r.url(), status: r.status() });
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/contacts.html');

  await page.fill('input[name="Name"]', MARK);
  await page.fill('input[name="Phone_number"]', '+79000000000');
  await page.fill('input[name="Date1"]', '2026-09-01');
  await page.fill('input[name="Date2"]', '2026-09-05');
  await page.fill('input[name="Number_of_clients"]', '4');
  await page.selectOption('select[name="House"]', '1');
  await page.fill('textarea[name="Commentaries"]', `Тестовая заявка QA, удалить. ${MARK}`);

  await page.locator('button.form_button').click();

  await expect(page.locator('#success')).toHaveText('Спасибо, ваша заявка зарегистрирована!', { timeout: 15_000 });
  await page.screenshot({ path: path.join(SHOTS, 'tc07-real-submit-success.png'), fullPage: false });

  // Сообщение должно исчезнуть через 3 секунды (состояние из SPEC.md).
  await expect(page.locator('#success')).toHaveText('', { timeout: 6_000 });

  console.log('Ответы боевого эндпоинта:', JSON.stringify(responses, null, 2));
  expect(responses.length, 'запрос на Google Apps Script не ушёл').toBeGreaterThan(0);
});
