// Автотест на Баг #1 из qa/../1st-attempt/bug-reports.md:
// поле "Количество заселяющихся" (Number_of_clients) не отклоняет и не
// обрезает нечисловой ввод, хотя handleChange() корректно обрезает
// отрицательные числа и числа больше 30.
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8080';

test.describe('contacts.html — поле "Количество заселяющихся"', () => {
  test('отрицательное число обрезается до 0 (контрольный случай, должен проходить)', async ({ page }) => {
    await page.goto(`${BASE_URL}/contacts.html`);
    const field = page.locator('input[name="Number_of_clients"]');
    await field.fill('-15');
    await field.blur();
    await expect(field).toHaveValue('0');
  });

  test('число больше 30 обрезается до 30 (контрольный случай, должен проходить)', async ({ page }) => {
    await page.goto(`${BASE_URL}/contacts.html`);
    const field = page.locator('input[name="Number_of_clients"]');
    await field.fill('999');
    await field.blur();
    await expect(field).toHaveValue('30');
  });

  test('нечисловой ввод должен отклоняться или обрезаться (падает на Баге #1)', async ({ page }) => {
    await page.goto(`${BASE_URL}/contacts.html`);
    const field = page.locator('input[name="Number_of_clients"]');
    await field.fill('abc');
    await field.blur();

    // Ожидаемое поведение: значение не должно остаться произвольной строкой —
    // handleChange() должен привести его к пустому значению или к числу в [0, 30].
    // Фактическое поведение (баг): значение "abc" проходит без изменений,
    // потому что сравнение строки с числом даёт NaN, и обе проверки
    // (input.value < 0 / > 30) молча пропускаются.
    await expect(field).not.toHaveValue('abc');
  });
});
