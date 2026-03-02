// ECPay server-to-server payment notification
// ECPay POSTs here after payment; must reply "1|OK" on success or "0|ErrorMsg" on failure
const express = require('express');
const crypto  = require('crypto');
const { updateOrder } = require('./orders');

const router = express.Router();

const HASH_KEY = process.env.ECPAY_HASH_KEY || '5294y06JbISpM5x9';
const HASH_IV  = process.env.ECPAY_HASH_IV  || 'v77hoKGq4kWxNNIS';

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

function verifyCheckMac(params) {
  const { CheckMacValue, ...rest } = params;
  const sorted = Object.keys(rest).sort()
    .reduce((acc, k) => { acc[k] = rest[k]; return acc; }, {});
  const raw = `HashKey=${HASH_KEY}&`
    + Object.entries(sorted).map(([k, v]) => `${k}=${v}`).join('&')
    + `&HashIV=${HASH_IV}`;
  const computed = crypto.createHash('sha256').update(ecpayEncode(raw)).digest('hex').toUpperCase();
  return computed === CheckMacValue;
}

router.post('/', async (req, res) => {
  try {
    const params = req.body;

    if (!verifyCheckMac(params)) {
      console.error('[ECPay notify] Invalid CheckMacValue', params.MerchantTradeNo);
      return res.send('0|ErrorMsg');
    }

    const { MerchantTradeNo, RtnCode, RtnMsg } = params;
    const paid = RtnCode === '1';

    await updateOrder(MerchantTradeNo, {
      status:       paid ? 'paid' : 'failed',
      ecpayRtnCode: RtnCode,
      ecpayRtnMsg:  RtnMsg,
      paidAt:       paid ? new Date().toISOString() : null,
    });

    console.log(`[ECPay notify] ${MerchantTradeNo} → ${paid ? 'PAID' : 'FAILED'} (${RtnMsg})`);
    res.send('1|OK');

  } catch (err) {
    console.error('[ECPay notify] Error:', err);
    res.send('0|ErrorMsg');
  }
});

module.exports = router;
