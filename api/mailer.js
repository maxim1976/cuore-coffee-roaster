/* ============================================================
   mailer.js — Resend email notifications
   Requires env vars: RESEND_API_KEY, NOTIFY_EMAIL
   ============================================================ */

const { Resend } = require('resend');

const resend     = new Resend(process.env.RESEND_API_KEY);
const NOTIFY_TO  = process.env.NOTIFY_EMAIL;
const FROM       = process.env.NOTIFY_FROM || 'Cuore Coffee Orders <onboarding@resend.dev>';

/**
 * Send order confirmation to shop owner after successful payment.
 * Silently no-ops if RESEND_API_KEY or NOTIFY_EMAIL are not set.
 */
async function sendOrderNotification(order) {
  if (!process.env.RESEND_API_KEY || !NOTIFY_TO) {
    console.log('[mailer] RESEND_API_KEY or NOTIFY_EMAIL not set — skipping email');
    return;
  }

  const { tradeNo, customer, shipping, items, total, paidAt } = order;

  const itemRows = items.map(i =>
    `<tr>
      <td style="padding:6px 12px;border-bottom:1px solid #f0ebe4">${i.name}</td>
      <td style="padding:6px 12px;border-bottom:1px solid #f0ebe4;text-align:center">${i.qty}</td>
      <td style="padding:6px 12px;border-bottom:1px solid #f0ebe4;text-align:right">NT$ ${(i.price * i.qty).toLocaleString()}</td>
    </tr>`
  ).join('');

  const shippingLine = shipping.method === 'delivery'
    ? `宅配到府 — ${shipping.address}`
    : shipping.method === 'cvs'
    ? `超商取貨 — ${shipping.cvsStore} ${shipping.cvsStoreName}`
    : '店取';

  const html = `
<!DOCTYPE html>
<html lang="zh-TW">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#faf8f5;font-family:'Noto Sans TC',Arial,sans-serif;color:#3a3228">
  <div style="max-width:560px;margin:32px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)">
    <!-- Header -->
    <div style="background:#3a3228;padding:24px 32px;text-align:center">
      <p style="margin:0;color:#c4a574;font-size:11px;letter-spacing:3px;text-transform:uppercase">科雷精品咖啡館</p>
      <h1 style="margin:6px 0 0;color:white;font-size:20px;font-weight:400">新訂單通知</h1>
    </div>
    <!-- Body -->
    <div style="padding:28px 32px">
      <p style="margin:0 0 4px;font-size:13px;color:#8a7b6e">訂單編號</p>
      <p style="margin:0 0 20px;font-size:16px;font-family:monospace;color:#3a3228">${tradeNo}</p>

      <p style="margin:0 0 4px;font-size:13px;color:#8a7b6e">付款時間</p>
      <p style="margin:0 0 20px;font-size:14px">${new Date(paidAt).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}</p>

      <!-- Items -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:8px">
        <thead>
          <tr style="background:#faf8f5">
            <th style="padding:8px 12px;text-align:left;font-size:12px;color:#8a7b6e;font-weight:500">品項</th>
            <th style="padding:8px 12px;text-align:center;font-size:12px;color:#8a7b6e;font-weight:500">數量</th>
            <th style="padding:8px 12px;text-align:right;font-size:12px;color:#8a7b6e;font-weight:500">小計</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
      <p style="text-align:right;font-size:16px;font-weight:700;margin:4px 0 24px;color:#3a3228">合計 NT$ ${total.toLocaleString()}</p>

      <!-- Customer -->
      <div style="background:#faf8f5;border-radius:8px;padding:16px 20px;margin-bottom:16px">
        <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#3a3228">顧客資料</p>
        <p style="margin:0;font-size:13px;line-height:1.9;color:#5a4f47">
          姓名：${customer.name}<br>
          手機：${customer.phone}<br>
          Email：${customer.email}${customer.note ? `<br>備註：${customer.note}` : ''}
        </p>
      </div>

      <!-- Shipping -->
      <div style="background:#faf8f5;border-radius:8px;padding:16px 20px">
        <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#3a3228">配送方式</p>
        <p style="margin:0;font-size:13px;color:#5a4f47">${shippingLine}</p>
      </div>
    </div>
    <!-- Footer -->
    <div style="padding:16px 32px;text-align:center;border-top:1px solid #f0ebe4">
      <p style="margin:0;font-size:11px;color:#b0a090">科雷精品咖啡館 · Cuore Coffee Roaster · Hualien, Taiwan</p>
    </div>
  </div>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from:    FROM,
      to:      NOTIFY_TO,
      subject: `☕ 新訂單 ${tradeNo} — NT$${total.toLocaleString()}`,
      html,
    });
    if (error) console.error('[mailer] Resend error:', error);
    else       console.log(`[mailer] Order notification sent for ${tradeNo}`);
  } catch (err) {
    console.error('[mailer] Unexpected error:', err);
  }
}

module.exports = { sendOrderNotification };
