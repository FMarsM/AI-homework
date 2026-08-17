// Повторная проверка бага 5 (qa/bug-reports.md) после фикса в сессии 6.
// Первый тест — зеркало BUG-03 из bugs.spec.js: он должен позеленеть.
// Остальные — регресс вокруг фикса: корректная пара дат и пустая форма
// обязаны вести себя как раньше.
//
// Скриншоты пишутся под НОВЫМИ именами (fix-bug-05-*), сохранённые доказательства
// к багам не затрагиваются — запрет на перезапись из AGENTS.md остаётся в силе.
const { test, expect } = require('@playwright/test');
const path = require('path');

const SHOTS = path.join(__dirname, '..', 'screenshots');
const SCRIPT_URL = /script\.google\.com/;

/** Заполняет форму валидными данными, кроме дат, которые задаёт вызывающий. */
async function fillForm(page, d1, d2) {
  await page.fill('input[name="Name"]', 'TEST QA 2026-08-17');
  await page.fill('input[name="Phone_number"]', '+79000000000');
  await page.fill('input[name="Date1"]', d1);
  await page.fill('input[name="Date2"]', d2);
  await page.fill('input[name="Number_of_clients"]', '4');
}

const formState = () => {
  const f = document.forms['submit-to-google-sheet'];
  const d2 = f.elements['Date2'];
  return {
    formValid: f.checkValidity(),
    date2Valid: d2.checkValidity(),
    date2Min: d2.getAttribute('min'),
    message: d2.validationMessage,
  };
};

test('FIX-05 — отъезд раньше заезда больше не проходит валидацию (RU)', async ({ page }) => {
  let posted = 0;
  await page.route(SCRIPT_URL, route => { posted++; route.abort(); });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/contacts.html');
  await fillForm(page, '2026-09-10', '2026-09-01');   // отъезд раньше заезда

  const state = await page.evaluate(formState);
  console.log('RU, некорректная пара дат:', JSON.stringify(state, null, 2));

  await page.locator('button.form_button').click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SHOTS, 'fix-bug-05-ru-invalid-pair.png'), fullPage: false });

  expect(state.formValid, 'форма всё ещё считается валидной').toBe(false);
  expect(state.date2Valid, 'поле «Дата отъезда» не помечено как некорректное').toBe(false);
  expect(state.date2Min, 'у Date2 не выставлен min по дате заезда').toBe('2026-09-10');
  expect(state.message, 'у поля нет понятного пояснения').toContain('Дата отъезда');
  expect(posted, 'запрос ушёл на Google Apps Script при некорректных датах').toBe(0);
  await expect(page.locator('#success')).toHaveText('');
});

test('FIX-05 — то же самое на английской версии (ENG)', async ({ page }) => {
  let posted = 0;
  await page.route(SCRIPT_URL, route => { posted++; route.abort(); });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/contacts-eng.html');
  await fillForm(page, '2026-09-10', '2026-09-01');

  const state = await page.evaluate(formState);
  console.log('ENG, некорректная пара дат:', JSON.stringify(state, null, 2));

  await page.locator('button.form_button').click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SHOTS, 'fix-bug-05-eng-invalid-pair.png'), fullPage: false });

  expect(state.formValid).toBe(false);
  expect(state.message, 'сообщение должно быть на языке страницы').toContain('Departure date');
  expect(posted).toBe(0);
});

test('FIX-05/регресс — корректная пара дат по-прежнему отправляется', async ({ page }) => {
  let posted = 0;
  await page.route(SCRIPT_URL, route => {
    posted++;
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"result":"success"}' });
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/contacts.html');
  await fillForm(page, '2026-09-01', '2026-09-05');   // нормальная бронь

  const state = await page.evaluate(formState);
  expect(state.formValid, 'фикс сломал валидную заявку').toBe(true);
  expect(state.message, 'у валидного поля не должно быть текста ошибки').toBe('');

  await page.locator('button.form_button').click();
  await expect(page.locator('#success')).toHaveText('Спасибо, ваша заявка зарегистрирована!');
  await page.screenshot({ path: path.join(SHOTS, 'fix-bug-05-ru-valid-pair.png'), fullPage: false });
  expect(posted, 'запрос не ушёл при корректной паре дат').toBe(1);
});

test('FIX-05/регресс — исправление даты снимает ошибку без перезагрузки', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/contacts.html');
  await fillForm(page, '2026-09-10', '2026-09-01');
  expect((await page.evaluate(formState)).formValid).toBe(false);

  // Пользователь исправляет дату отъезда — форма обязана снова стать валидной.
  await page.fill('input[name="Date2"]', '2026-09-15');
  const after = await page.evaluate(formState);
  expect(after.formValid, 'ошибка залипла после исправления даты').toBe(true);
  expect(after.message).toBe('');

  // И обратный ход: пользователь двигает дату ЗАЕЗДА за дату отъезда.
  await page.fill('input[name="Date1"]', '2026-09-20');
  const back = await page.evaluate(formState);
  expect(back.formValid, 'проверка не срабатывает при правке даты заезда').toBe(false);
});

test('FIX-05/граница — равные даты остаются валидными (открытый вопрос)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/contacts.html');
  await fillForm(page, '2026-09-01', '2026-09-01');

  const state = await page.evaluate(formState);
  console.log('Равные даты (бронь на 0 ночей):', JSON.stringify(state, null, 2));

  // Тест фиксирует ТЕКУЩЕЕ поведение, а не утверждает, что оно правильное:
  // баг 5 сформулирован как «отъезд РАНЬШЕ заезда», равенство под него не подпадает.
  // Нужно ли запрещать бронь на 0 ночей — решает владелец сайта.
  expect(state.formValid).toBe(true);
});
