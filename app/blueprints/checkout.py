import re
from flask import Blueprint, current_app, jsonify, make_response, request

from app.db import db
from app.models import Order, OrderItem
from app.services.ecpay import (
    build_auto_submit_form,
    build_checkout_params,
    compute_check_mac,
    create_order_access_token,
    generate_trade_no,
)
from app.services.order_access import set_order_access_cookie
from app.services.pricing import CheckoutError, build_priced_order

bp = Blueprint("checkout", __name__, url_prefix="/checkout")

_SKU_RE = re.compile(r"^[A-Z0-9_-]+$")
_PHONE_RE = re.compile(r"^09\d{8}$")
_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _validate(data: dict) -> tuple[dict | None, str | None]:
    """Returns (parsed, error_message). Mirrors Node Zod schema."""
    items = data.get("items")
    if not isinstance(items, list) or len(items) == 0:
        return None, "Cart is empty"
    if len(items) > 20:
        return None, "Cart contains too many items."
    for item in items:
        sku = str(item.get("sku", "")).strip()
        qty = item.get("qty")
        if not sku or len(sku) > 80 or not _SKU_RE.match(sku):
            return None, "Cart contains an invalid item."
        if not isinstance(qty, int) or qty < 1 or qty > 20:
            return None, "Cart contains an invalid quantity."
        item["sku"] = sku

    customer = data.get("customer", {})
    name = str(customer.get("name", "")).strip()
    phone = str(customer.get("phone", "")).strip()
    email = str(customer.get("email", "")).strip()
    note = str(customer.get("note", "")).strip()
    if not name or len(name) > 80:
        return None, "Missing or invalid name"
    if not _PHONE_RE.match(phone):
        return None, "Invalid mobile number"
    if not _EMAIL_RE.match(email) or len(email) > 254:
        return None, "Invalid email address"
    if len(note) > 300:
        return None, "Note is too long"

    shipping = data.get("shipping", {})
    method = shipping.get("method")
    if method not in ("delivery", "cvs", "store"):
        return None, "Invalid shipping method"
    address = str(shipping.get("address", "")).strip()
    cvs_store = str(shipping.get("cvsStore", "")).strip()
    cvs_store_name = str(shipping.get("cvsStoreName", "")).strip()
    if method == "delivery" and not address:
        return None, "Missing delivery address"
    if method == "cvs" and not cvs_store:
        return None, "Missing convenience store"
    if method == "cvs" and not cvs_store_name:
        return None, "Missing convenience store branch"

    return {
        "items": items,
        "customer": {"name": name, "phone": phone, "email": email, "note": note},
        "shipping": {
            "method": method,
            "address": address,
            "cvs_store": cvs_store,
            "cvs_store_name": cvs_store_name,
        },
    }, None


@bp.post("")
def checkout():
    payload = request.get_json(silent=True)
    if not payload:
        return jsonify({"error": "Invalid request"}), 400

    parsed, err = _validate(payload)
    if err:
        return jsonify({"error": err}), 400

    try:
        cfg = current_app.config
        trade_no = generate_trade_no()
        access_token = create_order_access_token()
        priced = build_priced_order(parsed["items"], parsed["shipping"]["method"])

        params = build_checkout_params(
            trade_no=trade_no,
            total=priced["pricing"]["total"],
            item_name=priced["item_name"],
            site_url=cfg["SITE_URL"],
            merchant_id=cfg["ECPAY_MERCHANT_ID"],
        )
        params["CheckMacValue"] = compute_check_mac(
            params, cfg["ECPAY_HASH_KEY"], cfg["ECPAY_HASH_IV"]
        )

        # Build shipping address string
        s = parsed["shipping"]
        if s["method"] == "delivery":
            shipping_addr = s["address"]
        elif s["method"] == "cvs":
            shipping_addr = f"{s['cvs_store']} {s['cvs_store_name']}".strip()
        else:
            shipping_addr = ""

        # Save order to DB
        order = Order(
            trade_no=trade_no,
            access_token=access_token,
            status="pending",
            customer_name=parsed["customer"]["name"],
            customer_phone=parsed["customer"]["phone"],
            customer_email=parsed["customer"]["email"],
            shipping_method=s["method"],
            shipping_address=shipping_addr,
            note=parsed["customer"]["note"],
            total_ntd=priced["pricing"]["total"],
            shipping_cost_ntd=priced["pricing"]["shipping_cost"],
        )
        for item in priced["items"]:
            order.items.append(
                OrderItem(
                    sku=item["sku"],
                    name=item["name"],
                    price_ntd=item["price"],
                    qty=item["qty"],
                )
            )
        db.session.add(order)
        db.session.commit()

        html = build_auto_submit_form(params, cfg["ECPAY_API_URL"])
        resp = make_response(html, 200)
        resp.headers["Cache-Control"] = "no-store"
        resp.headers["Content-Type"] = "text/html; charset=utf-8"
        set_order_access_cookie(resp, trade_no, access_token)
        return resp

    except CheckoutError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        current_app.logger.error("[checkout] Error: %s", e)
        return jsonify({"error": "Server error"}), 500
