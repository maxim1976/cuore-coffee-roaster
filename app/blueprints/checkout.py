from flask import Blueprint

bp = Blueprint("checkout", __name__, url_prefix="/checkout")


@bp.post("")
def checkout():
    # Implemented in Phase 3
    return "not implemented", 501
