// Не автотест на баг (см. bug-01-number-field.spec.js для падающего теста).
// Здесь только собираются скриншоты/логи-подтверждения для баг-репортов
// BUG-02 (мёртвая ссылка "Контакты" в футере) и BUG-03 (дублирующиеся id="text").
// Тесты всегда "зелёные" — это фиксация состояния, а не проверка.
const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const shots = path.join(__dirname, '..', 'screenshots');

test('BUG-02 evidence: footer "Контакты" ведёт на href="#" на chaika1.html', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/chaika1.html');
  const link = page.locator('.footer a', { hasText: 'Контакты' });
  const hrefAttr = await link.getAttribute('href');
  const before = page.url();
  await link.click();
  const after = page.url();
  const log = [
    `href атрибут ссылки: "${hrefAttr}"`,
    `URL до клика: ${before}`,
    `URL после клика: ${after}`,
    `Ожидалось: переход на http://localhost:8080/contacts.html`,
    `Факт: остались на той же странице (добавился только "#")`,
  ].join('\n');
  fs.writeFileSync(path.join(shots, 'bug-02-footer-link.log.txt'), log, 'utf-8');
  await page.screenshot({ path: path.join(shots, 'bug-02-footer-link-after-click.png'), fullPage: true });
});

test('BUG-03 evidence: дублирующиеся id="text" на форме contacts.html', async ({ page }) => {
  await page.goto('/contacts.html');
  const ids = await page.locator('#registration input, #registration textarea, #registration select').evaluateAll(
    (els) => els.map((e) => ({ tag: e.tagName, name: e.getAttribute('name'), id: e.id }))
  );
  const log = [
    `Всего полей формы: ${ids.length}`,
    `Уникальных id: ${new Set(ids.map((i) => i.id)).size}`,
    JSON.stringify(ids, null, 2),
  ].join('\n');
  fs.writeFileSync(path.join(shots, 'bug-03-duplicate-ids.log.txt'), log, 'utf-8');
  await page.screenshot({ path: path.join(shots, 'bug-03-contacts-form.png'), fullPage: true });
});
