import logging
from datetime import datetime, timezone

import requests as http

logger = logging.getLogger(__name__)


def _escape(value) -> str:
    return (
        str(value or "")
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&#39;")
    )


def send_order_notification(order, api_key: str, notify_to: str, notify_from: str):
    """Send order notification email via Resend REST API. Silently no-ops if keys missing."""
    if not api_key or not notify_to:
        logger.info("RESEND_API_KEY or NOTIFY_EMAIL not set — skipping email")
        return

    items = order.items
    total = order.total_ntd
    shipping_cost = order.shipping_cost_ntd

    paid_at_str = ""
    if order.paid_at:
        paid_at_str = order.paid_at.astimezone(timezone.utc).strftime("%Y/%m/%d %H:%M:%S")

    item_rows = "".join(
        f"""<tr>
      <td style="padding:6px 12px;border-bottom:1px solid #f0ebe4">{_escape(i.name)}</td>
      <td style="padding:6px 12px;border-bottom:1px solid #f0ebe4;text-align:center">{i.qty}</td>
      <td style="padding:6px 12px;border-bottom:1px solid #f0ebe4;text-align:right">NT$ {i.price_ntd * i.qty:,}</td>
    </tr>"""
        for i in items
    )

    method = order.shipping_method
    if method == "delivery":
        shipping_line = f"宅配到府 — {_escape(order.shipping_address)}"
    elif method == "cvs":
        shipping_line = f"超商取貨 — {_escape(order.shipping_address)}"
    else:
        shipping_line = "店取"

    html = f"""<!DOCTYPE html>
<html lang="zh-TW">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#faf8f5;font-family:'Noto Sans TC',Arial,sans-serif;color:#3a3228">
  <div style="max-width:560px;margin:32px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)">
    <div style="background:#3a3228;padding:24px 32px;text-align:center">
      <p style="margin:0;color:#c4a574;font-size:11px;letter-spacing:3px;text-transform:uppercase">科雷精品咖啡館</p>
      <h1 style="margin:6px 0 0;color:white;font-size:20px;font-weight:400">新訂單通知</h1>
    </div>
    <div style="padding:28px 32px">
      <p style="margin:0 0 4px;font-size:13px;color:#8a7b6e">訂單編號</p>
      <p style="margin:0 0 20px;font-size:16px;font-family:monospace;color:#3a3228">{_escape(order.trade_no)}</p>
      <p style="margin:0 0 4px;font-size:13px;color:#8a7b6e">付款時間</p>
      <p style="margin:0 0 20px;font-size:14px">{paid_at_str}</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:8px">
        <thead>
          <tr style="background:#faf8f5">
            <th style="padding:8px 12px;text-align:left;font-size:12px;color:#8a7b6e;font-weight:500">品項</th>
            <th style="padding:8px 12px;text-align:center;font-size:12px;color:#8a7b6e;font-weight:500">數量</th>
            <th style="padding:8px 12px;text-align:right;font-size:12px;color:#8a7b6e;font-weight:500">小計</th>
          </tr>
        </thead>
        <tbody>{item_rows}</tbody>
      </table>
      <p style="text-align:right;font-size:13px;margin:4px 0;color:#8a7b6e">運費 NT$ {shipping_cost:,}</p>
      <p style="text-align:right;font-size:16px;font-weight:700;margin:4px 0 24px;color:#3a3228">合計 NT$ {total:,}</p>
      <div style="background:#faf8f5;border-radius:8px;padding:16px 20px;margin-bottom:16px">
        <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#3a3228">顧客資料</p>
        <p style="margin:0;font-size:13px;line-height:1.9;color:#5a4f47">
          姓名：{_escape(order.customer_name)}<br>
          手機：{_escape(order.customer_phone)}<br>
          Email：{_escape(order.customer_email)}{'<br>備註：' + _escape(order.note) if order.note else ''}
        </p>
      </div>
      <div style="background:#faf8f5;border-radius:8px;padding:16px 20px">
        <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#3a3228">配送方式</p>
        <p style="margin:0;font-size:13px;color:#5a4f47">{shipping_line}</p>
      </div>
    </div>
    <div style="padding:16px 32px;text-align:center;border-top:1px solid #f0ebe4">
      <p style="margin:0;font-size:11px;color:#b0a090">科雷精品咖啡館 · Cuore Coffee Roaster · Hualien, Taiwan</p>
    </div>
  </div>
</body>
</html>"""

    try:
        resp = http.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json={
                "from": notify_from,
                "to": notify_to,
                "subject": f"☕ 新訂單 {order.trade_no} — NT${total:,}",
                "html": html,
            },
            timeout=10,
        )
        if resp.ok:
            logger.info("Order notification sent for %s", order.trade_no)
        else:
            logger.error("Resend error: %s %s", resp.status_code, resp.text)
    except Exception as e:
        logger.error("Mailer unexpected error: %s", e)
