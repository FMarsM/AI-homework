"""Общие фикстуры для автотестов сайта «Коттеджи Чайка».

Сайт статический, поэтому на время прогона поднимается локальный HTTP-сервер
на свободном порту прямо из каталога проекта. Файлы проекта только читаются.
"""

import functools
import http.server
import pathlib
import socket
import threading

import pytest

# .../4th-attempt/autotests/conftest.py -> .../TestTask
TESTTASK_DIR = pathlib.Path(__file__).resolve().parents[2]
SITE_DIR = TESTTASK_DIR / "fmarsm.github.io-main"


def _free_port() -> int:
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


class _QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):  # не засоряем вывод pytest
        pass


@pytest.fixture(scope="session")
def base_url() -> str:
    """Поднимает статический сервер на время сессии и отдаёт его базовый URL."""
    if not SITE_DIR.is_dir():
        pytest.fail(f"Каталог сайта не найден: {SITE_DIR}")

    port = _free_port()
    handler = functools.partial(_QuietHandler, directory=str(SITE_DIR))
    server = http.server.ThreadingHTTPServer(("127.0.0.1", port), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield f"http://127.0.0.1:{port}"
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=5)


@pytest.fixture
def contacts_page(page, base_url):
    """Страница контактов с заглушенным бэкендом.

    Запросы к Google Apps Script перехватываются и не уходят наружу:
    тесты не должны писать мусорные заявки в реальную таблицу владельца сайта.
    """
    submitted = []

    def _stub(route, request):
        submitted.append(request.url)
        route.fulfill(status=200, content_type="text/plain", body="OK")

    page.route("**script.google.com/**", _stub)
    page.goto(f"{base_url}/contacts.html")
    page.submitted_requests = submitted
    return page
