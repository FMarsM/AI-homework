"""Автотест на BUG-01: форма заявки принимает дату отъезда раньше даты заезда.

Тест-кейс TC-08 из test-plan.md.

Тесты проверяют ОЖИДАЕМОЕ (корректное) поведение формы, поэтому на текущей версии
сайта два из них падают — это и есть воспроизведение бага. После исправления
BUG-01 весь файл должен стать зелёным.

Запуск:  pytest -v
"""

import datetime as dt

import pytest
from playwright.sync_api import expect

pytestmark = pytest.mark.usefixtures("contacts_page")

FORM = "form[name='submit-to-google-sheet']"
ARRIVAL = f"{FORM} input[name='Date1']"
DEPARTURE = f"{FORM} input[name='Date2']"
SUBMIT = f"{FORM} button[type='submit']"
SUCCESS = "#success"

TOMORROW = dt.date.today() + dt.timedelta(days=1)


def fill_form(page, arrival: str, departure: str, guests: str = "4") -> None:
    """Заполняет форму валидными данными, кроме переданных дат."""
    page.fill(f"{FORM} input[name='Name']", "Иванов Иван Иванович")
    page.fill(f"{FORM} input[name='Phone_number']", "+79000000000")
    page.fill(ARRIVAL, arrival)
    page.fill(DEPARTURE, departure)
    page.fill(f"{FORM} input[name='Number_of_clients']", guests)
    page.select_option(f"{FORM} select[name='House']", "1")


def form_is_valid(page) -> bool:
    """Результат браузерной валидации формы (то, что решает, уйдёт ли заявка)."""
    return page.eval_on_selector(FORM, "form => form.checkValidity()")


def test_valid_date_range_is_accepted(contacts_page):
    """Контрольный тест: корректный диапазон дат проходит валидацию и отправляется."""
    page = contacts_page
    arrival = TOMORROW
    departure = TOMORROW + dt.timedelta(days=5)

    fill_form(page, arrival.isoformat(), departure.isoformat())
    assert form_is_valid(page), "Корректно заполненная форма должна быть валидной"

    page.click(SUBMIT)
    expect(page.locator(SUCCESS)).to_have_text("Спасибо, ваша заявка зарегистрирована!")
    assert page.submitted_requests, "Заявка должна была уйти на бэкенд"


def test_departure_before_arrival_is_rejected(contacts_page):
    """BUG-01: дата отъезда раньше даты заезда не должна проходить валидацию."""
    page = contacts_page
    arrival = TOMORROW + dt.timedelta(days=10)
    departure = TOMORROW + dt.timedelta(days=1)

    fill_form(page, arrival.isoformat(), departure.isoformat())

    assert not form_is_valid(page), (
        "BUG-01: форма с датой отъезда "
        f"{departure:%d.%m.%Y} раньше даты заезда {arrival:%d.%m.%Y} "
        "считается валидной и отправляется"
    )

    page.click(SUBMIT)
    expect(page.locator(SUCCESS)).to_have_text("")
    assert not page.submitted_requests, (
        "BUG-01: заявка с отрицательным сроком проживания ушла на бэкенд"
    )


def test_departure_field_is_limited_by_arrival_date(contacts_page):
    """BUG-01: после выбора даты заезда поле отъезда должно получить min."""
    page = contacts_page
    arrival = TOMORROW + dt.timedelta(days=10)

    page.fill(ARRIVAL, arrival.isoformat())
    page.dispatch_event(ARRIVAL, "change")

    assert page.input_value(DEPARTURE) == "" or page.get_attribute(DEPARTURE, "min"), (
        "BUG-01: у поля «Дата отъезда» не выставляется атрибут min "
        "по выбранной дате заезда"
    )
    assert page.get_attribute(DEPARTURE, "min") == arrival.isoformat(), (
        "BUG-01: ожидался min='%s' у поля «Дата отъезда», получено %r"
        % (arrival.isoformat(), page.get_attribute(DEPARTURE, "min"))
    )


def test_arrival_date_in_the_past_is_rejected(contacts_page):
    """BUG-01 (доп.): бронь на прошедшую дату не должна приниматься."""
    page = contacts_page
    past = dt.date(2000, 1, 1)

    fill_form(page, past.isoformat(), (past + dt.timedelta(days=3)).isoformat())

    assert not form_is_valid(page), (
        f"BUG-01: форма с датой заезда {past:%d.%m.%Y} в прошлом считается валидной"
    )
