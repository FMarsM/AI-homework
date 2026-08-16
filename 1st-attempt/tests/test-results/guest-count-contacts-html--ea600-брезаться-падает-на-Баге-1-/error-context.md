# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: guest-count.spec.js >> contacts.html — поле "Количество заселяющихся" >> нечисловой ввод должен отклоняться или обрезаться (падает на Баге #1)
- Location: guest-count.spec.js:26:3

# Error details

```
Error: expect(locator).not.toHaveValue(expected) failed

Locator:  locator('input[name="Number_of_clients"]')
Expected: not "abc"
Received: "abc"
Timeout:  5000ms

Call log:
  - Expect "not toHaveValue" with timeout 5000ms
  - waiting for locator('input[name="Number_of_clients"]')
    14 × locator resolved to <input id="text" type="text" required="" autocomplete="off" name="Number_of_clients" onchange="handleChange(this)"/>
       - unexpected value "abc"

```

```yaml
- textbox: abc
```

# Test source

```ts
  1  | // Автотест на Баг #1 из qa/../1st-attempt/bug-reports.md:
  2  | // поле "Количество заселяющихся" (Number_of_clients) не отклоняет и не
  3  | // обрезает нечисловой ввод, хотя handleChange() корректно обрезает
  4  | // отрицательные числа и числа больше 30.
  5  | const { test, expect } = require('@playwright/test');
  6  | 
  7  | const BASE_URL = 'http://localhost:8080';
  8  | 
  9  | test.describe('contacts.html — поле "Количество заселяющихся"', () => {
  10 |   test('отрицательное число обрезается до 0 (контрольный случай, должен проходить)', async ({ page }) => {
  11 |     await page.goto(`${BASE_URL}/contacts.html`);
  12 |     const field = page.locator('input[name="Number_of_clients"]');
  13 |     await field.fill('-15');
  14 |     await field.blur();
  15 |     await expect(field).toHaveValue('0');
  16 |   });
  17 | 
  18 |   test('число больше 30 обрезается до 30 (контрольный случай, должен проходить)', async ({ page }) => {
  19 |     await page.goto(`${BASE_URL}/contacts.html`);
  20 |     const field = page.locator('input[name="Number_of_clients"]');
  21 |     await field.fill('999');
  22 |     await field.blur();
  23 |     await expect(field).toHaveValue('30');
  24 |   });
  25 | 
  26 |   test('нечисловой ввод должен отклоняться или обрезаться (падает на Баге #1)', async ({ page }) => {
  27 |     await page.goto(`${BASE_URL}/contacts.html`);
  28 |     const field = page.locator('input[name="Number_of_clients"]');
  29 |     await field.fill('abc');
  30 |     await field.blur();
  31 | 
  32 |     // Ожидаемое поведение: значение не должно остаться произвольной строкой —
  33 |     // handleChange() должен привести его к пустому значению или к числу в [0, 30].
  34 |     // Фактическое поведение (баг): значение "abc" проходит без изменений,
  35 |     // потому что сравнение строки с числом даёт NaN, и обе проверки
  36 |     // (input.value < 0 / > 30) молча пропускаются.
> 37 |     await expect(field).not.toHaveValue('abc');
     |                             ^ Error: expect(locator).not.toHaveValue(expected) failed
  38 |   });
  39 | });
  40 | 
```