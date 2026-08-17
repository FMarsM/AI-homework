// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Стенд поднимается вручную:
 *   python -m http.server 8080 --directory fmarsm.github.io-main
 * Сайт не модифицируется — тесты только читают страницы.
 */
module.exports = defineConfig({
  testDir: '.',
  timeout: 30_000,
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:8080',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
