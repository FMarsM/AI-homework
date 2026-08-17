# QA-отчёт по проекту «Коттеджи "Чайка"» (fmarsm.github.io-main)

Попытка №4. Тестирование статического сайта аренды коттеджей: 10 HTML-страниц
(5 RU + 5 EN), общий `assets/css/style.css`, форма заявки на странице контактов
с отправкой в Google Apps Script.

## Содержимое

| Файл | Описание |
|---|---|
| [test-plan.md](test-plan.md) | Тест-план, 11 проверок (TC-01…TC-11) + сводка результатов |
| [bugs/BUG-01-departure-date-before-arrival.md](bugs/BUG-01-departure-date-before-arrival.md) | Форма принимает дату отъезда раньше даты заезда |
| [bugs/BUG-02-eng-logo-leads-to-russian-page.md](bugs/BUG-02-eng-logo-leads-to-russian-page.md) | Логотип на английской главной ведёт на русскую версию |
| [bugs/BUG-03-guests-field-accepts-letters.md](bugs/BUG-03-guests-field-accepts-letters.md) | Поле «Количество заселяющихся» принимает буквы и спецсимволы |
| [autotests/](autotests/) | Автотест на BUG-01 (Playwright + pytest) |

## Окружение тестирования

- ОС: Windows 10 Pro 22H2
- Браузер: Chromium (встроенная браузерная панель), viewport 1280×720 и 375×812
- Сайт поднимался локально: `python -m http.server 8777` из корня `fmarsm.github.io-main`
- Дата прогона: 17.08.2026

## Как воспроизвести окружение

```bash
cd fmarsm.github.io-main && python -m http.server 8777
```

Затем открыть `http://127.0.0.1:8777/index.html`.

## Что осталось за рамками

- Реальная отправка формы в Google Apps Script не выполнялась: это запись данных
  в чужую (продовую) таблицу. Проверялась клиентская валидация до отправки и код
  обработчика `fetch`.
- Кросс-браузерность (Firefox/Safari) и реальные мобильные устройства не проверялись —
  только эмуляция viewport в Chromium.
