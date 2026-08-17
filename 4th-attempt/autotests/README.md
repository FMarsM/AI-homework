# Автотест на BUG-01 (тест-кейс TC-08)

Проверяет валидацию дат в форме заявки на `contacts.html`:
дата отъезда не должна быть раньше даты заезда, дата заезда не должна быть в прошлом.

Стек: **pytest + Playwright (sync API)**, Chromium.

## Установка

```bash
pip install -r requirements.txt
```

```bash
python -m playwright install chromium
```

## Запуск

```bash
pytest -v
```

С видимым браузером:

```bash
pytest -v --headed --slowmo 300
```

## Как устроено

- `conftest.py` поднимает `http.server` из каталога `fmarsm.github.io-main`
  на свободном порту (файлы проекта только читаются, ничего не изменяется)
  и перехватывает запросы к `script.google.com`, чтобы тестовые заявки
  **не попадали в реальную Google-таблицу владельца сайта**.
- `test_booking_dates.py` содержит 4 теста: один контрольный (валидный диапазон дат)
  и три, проверяющих отсутствующую валидацию.

## Ожидаемый результат прогона

Тесты написаны от **корректного** поведения, поэтому на текущей версии сайта:

| Тест | Статус сейчас |
|---|---|
| `test_valid_date_range_is_accepted` | ✅ passed |
| `test_departure_before_arrival_is_rejected` | ❌ failed — воспроизводит BUG-01 |
| `test_departure_field_is_limited_by_arrival_date` | ❌ failed — воспроизводит BUG-01 |
| `test_arrival_date_in_the_past_is_rejected` | ❌ failed — воспроизводит BUG-01 |

Итог: `1 passed, 3 failed`. После исправления BUG-01 все 4 теста должны стать зелёными —
это и есть критерий приёмки фикса.

## Фактический прогон 17.08.2026

Полный вывод — в [last-run.log](last-run.log).

```
test_booking_dates.py::test_valid_date_range_is_accepted[chromium] PASSED
test_booking_dates.py::test_departure_before_arrival_is_rejected[chromium] FAILED
test_booking_dates.py::test_departure_field_is_limited_by_arrival_date[chromium] FAILED
test_booking_dates.py::test_arrival_date_in_the_past_is_rejected[chromium] FAILED

=== 3 failed, 1 passed in 2.58s ===
```

Ключевые сообщения об ошибках:

```
BUG-01: форма с датой отъезда 19.08.2026 раньше даты заезда 28.08.2026 считается валидной и отправляется
BUG-01: ожидался min='2026-08-28' у поля «Дата отъезда», получено None
BUG-01: форма с датой заезда 01.01.2000 в прошлом считается валидной
```

Прогон выполнялся на Python 3.13.2, pytest 9.0.2, Playwright (Chromium), Windows 10.
