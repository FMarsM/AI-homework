// Проверки, которые сайт должен проходить: смоук, скриншоты по ширинам,
// навигация, переключатель языка, мобильное меню, HTML5-валидация формы.
// Соответствие тест-плану — в названиях тестов (TC-XX).
const { test, expect } = require('@playwright/test');
const path = require('path');

const SHOTS = path.join(__dirname, '..', 'screenshots');
const SCRIPT_URL = /script\.google\.com/;

const WIDTHS = [375, 768, 1024, 1440];

test.describe('TC-01 — смоук главной на четырёх ширинах', () => {
  for (const w of WIDTHS) {
    test(`главная на ${w}px рендерится, скриншот снят`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto('/index.html');

      await expect(page.locator('.logo_text h1 a')).toBeVisible();
      await expect(page.locator('.language button')).toHaveCount(2);
      await expect(page.locator('#slider_bl article')).toHaveCount(3);
      await expect(page.locator('.footer')).toBeVisible();

      // Горизонтальной прокрутки быть не должно.
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow, `горизонтальный overflow на ${w}px`).toBeLessThanOrEqual(1);

      await page.screenshot({ path: path.join(SHOTS, `viewport-${w}-index.png`), fullPage: true });
    });
  }

  for (const w of WIDTHS) {
    test(`страница контактов на ${w}px рендерится, скриншот снят`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto('/contacts.html');
      await expect(page.locator('form[name="submit-to-google-sheet"]')).toBeVisible();
      await page.screenshot({ path: path.join(SHOTS, `viewport-${w}-contacts.png`), fullPage: true });
    });
  }
});

test('TC-03 — на 1440px все 5 пунктов меню ведут по адресу, активный подсвечен', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const expected = [
    ['index.html', 'Главная'],
    ['chaika1.html', 'Чайка-1'],
    ['chaika2.html', 'Чайка-2'],
    ['chaika3.html', 'Чайка-3'],
    ['contacts.html', 'Контакты'],
  ];

  for (const [file, label] of expected) {
    await page.goto('/index.html');
    await expect(page.locator('#navigation')).toBeHidden();
    await page.locator(`ul.menu li a[href="${file}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${file.replace('.', '\\.')}$`));

    const selected = page.locator('ul.menu li.selected a');
    await expect(selected).toHaveCount(1);
    await expect(selected).toHaveText(label);
    // Подсветка активного пункта отличается от обычного.
    const color = await selected.evaluate(el => getComputedStyle(el).color);
    expect(color).toBe('rgb(214, 123, 123)');
  }
});

test('TC-05 — переключатель языка держит раздел (chaika2 туда-обратно)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/chaika2.html');

  await page.locator('.language button').first().click();      // ENG
  await expect(page).toHaveURL(/chaika2-eng\.html$/);
  await expect(page.locator('ul.menu li.selected a')).toHaveText('Chaika-2');

  await page.locator('.language button').nth(1).click();       // RUS
  await expect(page).toHaveURL(/chaika2\.html$/);
  await expect(page.locator('ul.menu li.selected a')).toHaveText('Чайка-2');
});

test('TC-06 — прямой заход на chaika2.html минуя главную', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/chaika2.html');

  await expect(page.locator('ul.menu li a')).toHaveCount(5);
  await expect(page.locator('.language button')).toHaveCount(2);
  await expect(page.locator('ul.menu li.selected a')).toHaveText('Чайка-2');

  await page.locator('.language button').first().click();
  await expect(page).toHaveURL(/chaika2-eng\.html$/);
  await page.goBack();
  await expect(page).toHaveURL(/chaika2\.html$/);
});

test('TC-07 — мобильное меню на 375px: открыть / закрыть мимо / открыть повторно', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/index.html');

  const menubar = page.locator('.menubar');
  const burger = page.locator('#navigation');

  await expect(burger).toBeVisible();
  await expect(menubar).toBeHidden();

  await burger.click();
  await expect(menubar).toBeVisible();
  await page.screenshot({ path: path.join(SHOTS, 'viewport-375-menu-open.png'), fullPage: false });

  await page.locator('.description_text').click();
  await expect(menubar).toBeHidden();

  await burger.click();
  await expect(menubar).toBeVisible();
});

test('TC-10 — пустая форма не отправляется, POST на Google Apps Script не уходит', async ({ page }) => {
  let posted = 0;
  await page.route(SCRIPT_URL, route => { posted++; route.abort(); });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/contacts.html');

  await page.locator('button.form_button').click();
  await expect(page.locator('#success')).toHaveText('');
  expect(posted, 'запрос ушёл при пустой форме').toBe(0);

  // Браузер должен считать форму невалидной и указать на первое пустое поле.
  const invalid = await page.evaluate(() => {
    const f = document.forms['submit-to-google-sheet'];
    return { formValid: f.checkValidity(), firstInvalid: [...f.elements].find(e => !e.checkValidity())?.name };
  });
  expect(invalid.formValid).toBe(false);
  expect(invalid.firstInvalid).toBe('Name');

  // Заполнили только ФИО — всё равно не отправляется.
  await page.fill('input[name="Name"]', 'TEST QA 2026-08-17');
  await page.locator('button.form_button').click();
  await expect(page.locator('#success')).toHaveText('');
  expect(posted).toBe(0);
});
