from flask import Blueprint

bp = Blueprint("orders", __name__, url_prefix="/orders")


@bp.get("/<trade_no>/status")
def order_status(trade_no):
    # Implemented in Phase 4
    return "not implemented", 501
