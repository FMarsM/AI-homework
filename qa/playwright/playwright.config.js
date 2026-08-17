// Конфигурация Playwright для QA-прогона сайта «Коттеджи Чайка».
// Сайт поднимается локальным python-сервером; если он уже запущен — переиспользуется.
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:8080',
    screenshot: 'only-on-failure',
    trace: 'off',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'python -m http.server 8080 --directory ../../fmarsm.github.io-main',
    url: 'http://localhost:8080/index.html',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
