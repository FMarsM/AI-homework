// Вспомогательный тест: делает по одному скриншоту index.html и contacts.html
// на каждой из требуемых ширин (375/768/1024/1440), плюс собирает список
// сетевых запросов со статусом >=400 (проверка на 404 ресурсов, см. SPEC п.11).
const { test, expect } = require('@playwright/test');
const path = require('path');

const widths = [375, 768, 1024, 1440];
const pages = ['index.html', 'contacts.html'];

for (const width of widths) {
  for (const pageName of pages) {
    test(`viewport ${width}px — ${pageName}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const failed = [];
      page.on('response', (res) => {
        if (res.status() >= 400) failed.push(`${res.status()} ${res.url()}`);
      });
      await page.goto(`/${pageName}`);
      await page.waitForLoadState('networkidle');
      const shotPath = path.join(
        __dirname,
        '..',
        'screenshots',
        `${width}-${pageName.replace('.html', '')}.png`
      );
      await page.screenshot({ path: shotPath, fullPage: true });
      expect(failed, `Ресурсы с ошибкой загрузки на ${pageName} @ ${width}px: ${failed.join(', ')}`).toEqual([]);
    });
  }
}
