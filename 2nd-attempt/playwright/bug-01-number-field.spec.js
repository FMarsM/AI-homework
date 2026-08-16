// Автотест на BUG-01: поле «Количество заселяющихся» (input[name="Number_of_clients"])
// клэмпит отрицательные и слишком большие числа через handleChange(), но никак
// не проверяет, что введено вообще число. Нечисловая строка беспрепятственно
// уходит в отправку формы на боевой Google-эндпоинт.
//
// Тест ОЖИДАЕТ корректного поведения (значение либо отклоняется/очищается,
// либо форма не даёт отправиться) — и падает, потому что сайт этого не делает.
const { test, expect } = require('@playwright/test');

test('BUG-01: нечисловое значение в "Количество заселяющихся" должно быть отклонено', async ({ page }) => {
  await page.goto('/contacts.html');

  const numberField = page.locator('input[name="Number_of_clients"]');
  await numberField.fill('abc');
  await numberField.blur(); // триггерит onchange -> handleChange()

  const value = await numberField.inputValue();

  // Ожидаемое поведение: поле не должно содержать нечисловую строку —
  // handleChange() должен был её отклонить/очистить, как он это делает
  // для отрицательных чисел и чисел больше 30.
  expect(value).not.toBe('abc');
});
