from flask import Blueprint, render_template, request

bp = Blueprint("catalog", __name__, url_prefix="/catalog")


@bp.get("/fragment")
def fragment():
    lang = request.args.get("lang") or request.cookies.get("cuore-lang", "zh-TW")
    if lang not in ("zh-TW", "en"):
        lang = "en"
    # products will be wired in Phase 2
    return render_template("shop/catalog_fragment.html", products=[], lang=lang)
