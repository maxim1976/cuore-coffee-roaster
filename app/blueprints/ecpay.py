import threading
from datetime import datetime, timezone
from urllib.parse import quote

from flask import Blueprint, current_app, redirect, request

from app.db import db
from app.models import Order
from app.services.ecpay import verify_check_mac
from app.services.mailer import send_order_notification

bp = Blueprint("ecpay", __name__, url_prefix="/ecpay")


@bp.post("/notify")
def notify():
    """ECPay server-to-server payment notification. Must return plain text 1|OK or 0|ErrorMsg."""
    try:
        params = request.form.to_dict()
        cfg = current_app.config

        if not verify_check_mac(params, cfg["ECPAY_HASH_KEY"], cfg["ECPAY_HASH_IV"]):
            current_app.logger.error("[ECPay notify] Invalid CheckMacValue: %s", params.get("MerchantTradeNo"))
            return "0|ErrorMsg", 200

        trade_no = str(params.get("MerchantTradeNo", "")).strip().upper()
        order = Order.query.filter_by(trade_no=trade_no).first()
        if not order:
            current_app.logger.error("[ECPay notify] Order not found: %s", trade_no)
            return "0|ErrorMsg", 200

        paid = params.get("RtnCode") == "1"
        if paid:
            order.status = "paid"
            order.paid_at = datetime.now(timezone.utc)
        else:
            order.status = "failed"

        order.ecpay_trade_no = params.get("TradeNo") or None
        order.ecpay_rtn_msg = (params.get("RtnMsg") or "")[:200]
        db.session.commit()

        if paid and order.status == "paid":
            api_key = cfg.get("RESEND_API_KEY")
            notify_to = cfg.get("NOTIFY_EMAIL")
            notify_from = cfg.get("NOTIFY_FROM")
            threading.Thread(
                target=send_order_notification,
                args=(order, api_key, notify_to, notify_from),
                daemon=True,
            ).start()

        current_app.logger.info("[ECPay notify] %s -> %s (%s)", trade_no, order.status, params.get("RtnMsg"))
        return "1|OK", 200

    except Exception as e:
        current_app.logger.error("[ECPay notify] Error: %s", e)
        return "0|ErrorMsg", 200


@bp.post("/return")
def ecpay_return():
    """ECPay browser redirect after payment. Redirects user to success/failed/processing page."""
    try:
        trade_no = str(request.form.get("MerchantTradeNo", "")).strip().upper()
        if not trade_no:
            return redirect(f"/order-failed?msg={quote('Invalid payment return')}")

        order = Order.query.filter_by(trade_no=trade_no).first()
        if not order:
            return redirect(f"/order-failed?msg={quote('Order not found')}")

        if order.status == "paid":
            return redirect(f"/order-success?order={quote(trade_no)}")
        if order.status == "failed":
            msg = order.ecpay_rtn_msg or "付款失敗"
            return redirect(f"/order-failed?order={quote(trade_no)}&msg={quote(msg)}")

        return redirect(f"/order-processing?order={quote(trade_no)}")

    except Exception as e:
        current_app.logger.error("[ECPay return] Error: %s", e)
        return redirect(f"/order-failed?msg={quote('Unable to verify payment status')}")
