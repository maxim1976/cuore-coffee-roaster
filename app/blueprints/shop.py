from flask import Blueprint, render_template

bp = Blueprint("shop", __name__)


@bp.get("/health")
def health():
    return "ok", 200


@bp.get("/")
def index():
    return render_template("shop/index.html")


@bp.get("/shop")
def shop():
    return render_template("shop/index.html")
