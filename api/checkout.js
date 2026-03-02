const express = require('express');
const crypto = require('crypto');
const { saveOrder } = require('./orders');

const router = express.Router();

// ECPay credentials — set real values in Railway env vars
const MERCHANT_ID  = process.env.ECPAY_MERCHANT_ID  || '2000132';
const HASH_KEY     = process.env.ECPAY_HASH_KEY      || '5294y06JbISpM5x9';
const HASH_IV      = process.env.ECPAY_HASH_IV       || 'v77hoKGq4kWxNNIS';
const ECPAY_URL    = process.env.ECPAY_API_URL        || 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckout/V5';
const SITE_URL     = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

// Unique trade number: CC + yyMMddHHmmss + 4 random alphanum = 18 chars
function generateTradeNo() {
  const n = new Date();
  const ts = String(n.getFullYear()).slice(-2)
    + String(n.getMonth() + 1).padStart(2, '0')
    + String(n.getDate()).padStart(2, '0')
    + String(n.getHours()).padStart(2, '0')
    + String(n.getMinutes()).padStart(2, '0')
    + String(n.getSeconds()).padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CC${ts}${rand}`;
}

function getMerchantTradeDate() {
  const n = new Date();
  return `${n.getFullYear()}/${String(n.getMonth()+1).padStart(2,'0')}/${String(n.getDate()).padStart(2,'0')} `
       + `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')}`;
}

// ECPay-specific URL encoding (lowercase, preserve some chars)
function ecpayEncode(str) {
  return encodeURIComponent(str)
    .replace(/%20/g, '+')
    .replace(/!/g,   '%21')
    .replace(/'/g,   '%27')
    .replace(/\(/g,  '%28')
    .replace(/\)/g,  '%29')
    .replace(/\*/g,  '%2A')
    .toLowerCase();
}

function computeCheckMac(params) {
  const sorted = Object.keys(params).sort()
    .reduce((acc, k) => { acc[k] = params[k]; return acc; }, {});
  const raw = `HashKey=${HASH_KEY}&`
    + Object.entries(sorted).map(([k, v]) => `${k}=${v}`).join('&')
    + `&HashIV=${HASH_IV}`;
  return crypto.createHash('sha256').update(ecpayEncode(raw)).digest('hex').toUpperCase();
}

router.post('/', async (req, res) => {
  const { items, customer, shipping } = req.body;

  // Basic validation
  if (!items?.length)            return res.status(400).json({ error: 'Cart is empty' });
  if (!customer?.name)           return res.status(400).json({ error: 'Missing name' });
  if (!customer?.phone)          return res.status(400).json({ error: 'Missing phone' });
  if (!customer?.email)          return res.status(400).json({ error: 'Missing email' });
  if (!shipping?.method)         return res.status(400).json({ error: 'Missing shipping method' });
  if (shipping.method === 'delivery' && !shipping.address)
                                 return res.status(400).json({ error: 'Missing delivery address' });

  try {
    const tradeNo = generateTradeNo();
    const total   = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    // ECPay ItemName format: 品名#單價#數量#小計|品名#單價#數量#小計
    // Max 400 chars total
    const itemName = items
      .map(i => `${i.name}#${i.price}#${i.qty}#${i.price * i.qty}`)
      .join('|')
      .slice(0, 400);

    const params = {
      MerchantID:        MERCHANT_ID,
      MerchantTradeNo:   tradeNo,
      MerchantTradeDate: getMerchantTradeDate(),
      PaymentType:       'aio',
      TotalAmount:       String(total),
      TradeDesc:         encodeURIComponent('科雷精品咖啡豆'),
      ItemName:          itemName,
      ReturnURL:         `${SITE_URL}/api/ecpay/notify`,
      OrderResultURL:    `${SITE_URL}/api/ecpay/return`,
      ChoosePayment:     'ALL',
      EncryptType:       '1',
    };

    params.CheckMacValue = computeCheckMac(params);

    await saveOrder({
      tradeNo,
      customer,
      shipping,
      items,
      total,
      status:    'pending',
      createdAt: new Date().toISOString(),
    });

    // Auto-submit form to ECPay
    const fields = Object.entries(params)
      .map(([k, v]) => `<input type="hidden" name="${k}" value="${v}">`)
      .join('\n');

    res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>
<form id="f" action="${ECPAY_URL}" method="POST">${fields}</form>
<script>document.getElementById('f').submit();</script>
</body></html>`);

  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
