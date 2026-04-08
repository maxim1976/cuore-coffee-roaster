from flask import Blueprint, current_app, jsonify, render_template, request

from app.models import Order
from app.services.order_access import has_order_access

bp = Blueprint("orders", __name__)


@bp.get("/order-success")
def order_success():
    trade_no = request.args.get("order", "").strip().upper() or None
    return render_template("orders/success.html", trade_no=trade_no)


@bp.get("/order-failed")
def order_failed():
    trade_no = request.args.get("order", "").strip().upper() or None
    error_msg = request.args.get("msg", "").strip() or None
    return render_template("orders/failed.html", trade_no=trade_no, error_msg=error_msg)


@bp.get("/order-processing")
def order_processing():
    trade_no = request.args.get("order", "").strip().upper() or None
    return render_template("orders/processing.html", trade_no=trade_no)


@bp.get("/orders/<trade_no>/status")
def order_status(trade_no):
    trade_no = trade_no.strip().upper()
    if not trade_no:
        return jsonify({"error": "Missing order number"}), 400

    order = Order.query.filter_by(trade_no=trade_no).first()
    if not order:
        return jsonify({"error": "Order not found"}), 404

    if not has_order_access(request, order):
        return jsonify({"error": "Order access denied"}), 403

    resp = jsonify({
        "order": order.trade_no,
        "status": order.status,
        "message": order.ecpay_rtn_msg or None,
        "paid_at": order.paid_at.isoformat() if order.paid_at else None,
    })
    resp.headers["Cache-Control"] = "no-store"
    return resp
