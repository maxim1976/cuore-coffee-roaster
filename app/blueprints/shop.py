from flask import Blueprint, render_template
from app.services.catalog import get_public_catalog

bp = Blueprint("shop", __name__)


@bp.get("/health")
def health():
    return "ok", 200


@bp.get("/")
@bp.get("/shop")
def shop():
    try:
        catalog = get_public_catalog()
        shipping = catalog["shipping"]
    except Exception:
        shipping = {"free_shipping_threshold": 1500, "costs": {"delivery": 100, "cvs": 60, "store": 0}}
    return render_template("shop/index.html", shipping=shipping)
