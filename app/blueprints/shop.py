from flask import Blueprint, render_template, send_from_directory
from pathlib import Path
from app.services.catalog import get_public_catalog

bp = Blueprint("shop", __name__)

PUBLIC_DIR = Path(__file__).parent.parent.parent / "public"


@bp.get("/health")
def health():
    return "ok", 200


@bp.get("/")
def index():
    return send_from_directory(PUBLIC_DIR, "index.html")


@bp.get("/shop")
@bp.get("/shop.html")
def shop():
    try:
        catalog = get_public_catalog()
        shipping = catalog["shipping"]
    except Exception:
        shipping = {"free_shipping_threshold": 1500, "costs": {"delivery": 100, "cvs": 60, "store": 0}}
    return render_template("shop/index.html", shipping=shipping)
