import urllib.parse
from flask import request, current_app

COOKIE_NAME = "cuore_order_access"
COOKIE_MAX_AGE = 6 * 60 * 60  # 6 hours


def set_order_access_cookie(response, trade_no: str, token: str):
    value = urllib.parse.quote(f"{trade_no}.{token}")
    response.set_cookie(
        COOKIE_NAME,
        value,
        max_age=COOKIE_MAX_AGE,
        httponly=True,
        samesite="Lax",
        secure=current_app.config.get("USE_SECURE_COOKIES", False),
        path="/",
    )


def get_order_access(req) -> tuple | None:
    raw = req.cookies.get(COOKIE_NAME)
    if not raw:
        return None
    decoded = urllib.parse.unquote(raw)
    parts = decoded.split(".", 1)
    if len(parts) != 2 or not parts[0] or not parts[1]:
        return None
    return parts[0], parts[1]  # (trade_no, token)


def has_order_access(req, order) -> bool:
    access = get_order_access(req)
    return bool(
        access
        and access[0] == order.trade_no
        and access[1] == order.access_token
    )
