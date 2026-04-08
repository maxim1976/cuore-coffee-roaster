from flask import Blueprint

bp = Blueprint("ecpay", __name__, url_prefix="/ecpay")


@bp.post("/notify")
def notify():
    # Implemented in Phase 3
    return "0|NotImplemented", 200


@bp.post("/return")
def ecpay_return():
    # Implemented in Phase 3
    return "not implemented", 501
