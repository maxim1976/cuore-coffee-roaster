import hashlib
import hmac
import os
import secrets
import urllib.parse
from datetime import datetime


def generate_trade_no() -> str:
    now = datetime.now()
    timestamp = (
        str(now.year)[-2:]
        + str(now.month).zfill(2)
        + str(now.day).zfill(2)
        + str(now.hour).zfill(2)
        + str(now.minute).zfill(2)
        + str(now.second).zfill(2)
    )
    suffix = secrets.token_hex(2).upper()
    return f"CC{timestamp}{suffix}"


def create_order_access_token() -> str:
    return secrets.token_hex(24)


def _merchant_trade_date() -> str:
    now = datetime.now()
    return (
        f"{now.year}/{str(now.month).zfill(2)}/{str(now.day).zfill(2)} "
        f"{str(now.hour).zfill(2)}:{str(now.minute).zfill(2)}:{str(now.second).zfill(2)}"
    )


def _ecpay_encode(raw: str) -> str:
    """
    Mirrors JS ecpayEncode:
      encodeURIComponent leaves: ~ - _ . (plus letters/digits)
      ecpayEncode then re-encodes: ! ' ( ) *
    Python quote(safe='~-_.') leaves exactly the same chars unencoded.
    """
    encoded = urllib.parse.quote(raw, safe="~-_.")
    encoded = encoded.replace("%20", "+")
    return encoded.lower()


def compute_check_mac(params: dict, hash_key: str, hash_iv: str) -> str:
    sorted_params = dict(sorted(params.items()))
    raw = (
        f"HashKey={hash_key}&"
        + "&".join(f"{k}={v}" for k, v in sorted_params.items())
        + f"&HashIV={hash_iv}"
    )
    encoded = _ecpay_encode(raw)
    return hashlib.sha256(encoded.encode("utf-8")).hexdigest().upper()


def verify_check_mac(params: dict, hash_key: str, hash_iv: str) -> bool:
    received = str(params.get("CheckMacValue", "")).upper()
    if not received:
        return False
    rest = {k: v for k, v in params.items() if k != "CheckMacValue"}
    computed = compute_check_mac(rest, hash_key, hash_iv)
    # Timing-safe comparison
    return hmac.compare_digest(computed, received)


def build_checkout_params(trade_no: str, total: int, item_name: str, site_url: str, merchant_id: str) -> dict:
    return {
        "MerchantID": merchant_id,
        "MerchantTradeNo": trade_no,
        "MerchantTradeDate": _merchant_trade_date(),
        "PaymentType": "aio",
        "TotalAmount": str(total),
        "TradeDesc": urllib.parse.quote("科雷精品咖啡豆"),
        "ItemName": item_name,
        "ReturnURL": f"{site_url}/ecpay/notify",
        "OrderResultURL": f"{site_url}/ecpay/return",
        "ChoosePayment": "ALL",
        "EncryptType": "1",
    }


def _escape_html(value: str) -> str:
    return (
        str(value)
        .replace("&", "&amp;")
        .replace('"', "&quot;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def build_auto_submit_form(params: dict, api_url: str) -> str:
    fields = "\n".join(
        f'<input type="hidden" name="{_escape_html(k)}" value="{_escape_html(v)}">'
        for k, v in params.items()
    )
    return (
        '<!DOCTYPE html><html lang="zh-TW"><head>'
        '<meta charset="UTF-8">'
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
        f'</head><body><form id="f" action="{_escape_html(api_url)}" method="POST">'
        f"{fields}"
        "</form><script>document.getElementById('f').submit();</script>"
        "</body></html>"
    )
