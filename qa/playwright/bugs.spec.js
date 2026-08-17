// Автотесты на найденные дефекты. Каждый ДОЛЖЕН падать на текущем состоянии сайта —
// это доказательство бага, а не happy-path. Номера соответствуют qa/bug-reports.md.
// Скриншот снимается ДО assert, чтобы файл-доказательство остался и у упавшего теста.
const { test, expect } = require('@playwright/test');
const path = require('path');

const SHOTS = path.join(__dirname, '..', 'screenshots');
const SCRIPT_URL = /script\.google\.com/;

test('BUG-01 — при ошибке сервера (HTTP 500) форма показывает «Спасибо», а не ошибку', async ({ page }) => {
  await page.route(SCRIPT_URL, route =>
    route.fulfill({ status: 500, contentType: 'text/plain', body: 'Internal Server Error' })
  );

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/contacts.html');

  await page.fill('input[name="Name"]', 'TEST QA 2026-08-17');
  await page.fill('input[name="Phone_number"]', '+79000000000');
  await page.fill('input[name="Date1"]', '2026-09-01');
  await page.fill('input[name="Date2"]', '2026-09-05');
  await page.fill('input[name="Number_of_clients"]', '4');
  await page.locator('button.form_button').click();

  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SHOTS, 'bug-01-http-500-shows-success.png'), fullPage: false });

  const text = await page.locator('#success').innerText();
  expect(text, 'при HTTP 500 пользователю показан текст об успехе').not.toContain('Спасибо');
});

test('BUG-02 — «Количество заселяющихся» принимает буквы и дробное число', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/contacts.html');

  const field = page.locator('input[name="Number_of_clients"]');
  const results = {};
  for (const input of ['-5', '0', '31', 'abc', '2.5']) {
    await field.fill(input);
    await field.blur();                 // onchange → handleChange()
    results[input] = await field.inputValue();
  }
  await page.screenshot({ path: path.join(SHOTS, 'bug-02-guests-accepts-letters.png'), fullPage: false });

  // Ожидаем, что нечисловое значение будет отклонено (поле очищено либо форма невалидна).
  const valid = await page.evaluate(() => {
    const f = document.forms['submit-to-google-sheet'];
    f.elements['Number_of_clients'].value = 'abc';
    return f.elements['Number_of_clients'].checkValidity();
  });

  expect({ ...results, abcPassesValidation: valid }).toEqual({
    '-5': '0', '0': '0', '31': '30', 'abc': '', '2.5': '', abcPassesValidation: false,
  });
});

test('BUG-03 — дата отъезда раньше даты заезда проходит валидацию', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/contacts.html');

  await page.fill('input[name="Name"]', 'TEST QA 2026-08-17');
  await page.fill('input[name="Phone_number"]', '+79000000000');
  await page.fill('input[name="Date1"]', '2026-09-10');   // заезд
  await page.fill('input[name="Date2"]', '2026-09-01');   // отъезд раньше заезда
  await page.fill('input[name="Number_of_clients"]', '4');
  await page.locator('input[name="Number_of_clients"]').blur();

  await page.screenshot({ path: path.join(SHOTS, 'bug-03-departure-before-arrival.png'), fullPage: false });

  const state = await page.evaluate(() => {
    const f = document.forms['submit-to-google-sheet'];
    return {
      formValid: f.checkValidity(),
      d1: f.elements['Date1'].value,
      d2: f.elements['Date2'].value,
      date2HasMin: f.elements['Date2'].hasAttribute('min'),
    };
  });

  expect(state.d2 >= state.d1 || state.formValid === false,
    `форма считает валидной заявку с заездом ${state.d1} и отъездом ${state.d2}`).toBe(true);
});

test('BUG-04 — логотип на index-eng.html уводит на русскую главную', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/index-eng.html');

  await page.screenshot({ path: path.join(SHOTS, 'bug-04-eng-logo-href.png'), fullPage: false });
  await page.locator('.logo_text h1 a').click();

  await expect(page, 'логотип английской главной ведёт на index.html').toHaveURL(/index-eng\.html$/);
});

test('BUG-05 — в футере chaika1.html ссылка «Контакты» ведёт в никуда (href="#")', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/chaika1.html');

  const link = page.locator('.footer a', { hasText: 'Контакты' });
  const href = await link.getAttribute('href');
  await page.screenshot({ path: path.join(SHOTS, 'bug-05-footer-dead-link.png'), fullPage: false });

  await link.click();
  await expect(page, `href="${href}" — переход не состоялся`).toHaveURL(/contacts\.html$/);
});

test('BUG-06 — меню остаётся раскрытым после сужения окна 1440 → 375', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/index.html');

  // Любой клик на широком экране проставляет .menubar инлайновый display:block.
  // Кликаем по футеру: .description_text перекрыта картинкой слайдера (inner width:2000%).
  await page.locator('.footer p').click();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(300);

  const state = await page.evaluate(() => {
    const mb = document.querySelector('.menubar');
    return { inline: mb.getAttribute('style'), computed: getComputedStyle(mb).display, height: mb.offsetHeight };
  });
  // Скроллим наверх: клик по футеру уводит вьюпорт вниз, и залипшее меню
  // не попадает в кадр — доказательство должно показывать шапку.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: path.join(SHOTS, 'bug-06-menu-stuck-after-resize.png'), fullPage: false });

  expect(state, 'после ресайза на 375px меню не свернулось под гамбургер')
    .toMatchObject({ computed: 'none' });
});

test('BUG-08 — при сетевом сбое пользователь не видит ни успеха, ни ошибки', async ({ page }) => {
  const consoleErrors = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  await page.route(SCRIPT_URL, route => route.abort('failed'));

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/contacts.html');

  await page.fill('input[name="Name"]', 'TEST QA 2026-08-17');
  await page.fill('input[name="Phone_number"]', '+79000000000');
  await page.fill('input[name="Date1"]', '2026-09-01');
  await page.fill('input[name="Date2"]', '2026-09-05');
  await page.fill('input[name="Number_of_clients"]', '4');
  await page.locator('button.form_button').click();
  await page.waitForTimeout(1000);

  await page.screenshot({ path: path.join(SHOTS, 'bug-08-network-fail-silent.png'), fullPage: false });
  const shown = await page.locator('#success').innerText();

  // Ошибка ушла только в консоль — пользователь остался без обратной связи.
  expect({ visibleToUser: shown, consoleOnly: consoleErrors.length > 0 })
    .toEqual({ visibleToUser: expect.stringContaining('не'), consoleOnly: true });
});

test('BUG-07 — у слайдера на главной цикл стрелок не замкнут (3 слайда против 16 в CSS)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/index.html');

  const arrowsPerSlide = {};
  for (const n of [1, 2, 3]) {
    await page.locator(`#slide${n}`).evaluate(el => { el.checked = true; el.dispatchEvent(new Event('change')); });
    await page.waitForTimeout(200);
    arrowsPerSlide[`slide${n}`] = await page.locator('#slider_bl .slider-prev-next-control label')
      .evaluateAll(els => els.filter(e => getComputedStyle(e).display !== 'none').length);
  }
  await page.screenshot({ path: path.join(SHOTS, 'bug-07-slider-arrows.png'), fullPage: false });

  // Слайдер задуман закольцованным (в CSS slide16 → slide1), значит на каждом
  // слайде должны быть обе стрелки.
  expect(arrowsPerSlide).toEqual({ slide1: 2, slide2: 2, slide3: 2 });
});
