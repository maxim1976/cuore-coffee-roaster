from flask import Blueprint, render_template, request
from app.services.catalog import get_public_catalog

bp = Blueprint("catalog", __name__, url_prefix="/catalog")


@bp.get("/fragment")
def fragment():
    lang = request.args.get("lang") or request.cookies.get("cuore-lang", "zh-TW")
    if lang not in ("zh-TW", "en"):
        lang = "en"
    try:
        catalog = get_public_catalog()
        products = catalog["items"]
    except Exception as e:
        products = []
    return render_template("shop/catalog_fragment.html", products=products, lang=lang)
