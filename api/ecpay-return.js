// ECPay browser redirect after payment completion
const express = require('express');
const router  = express.Router();

router.post('/', (req, res) => {
  const { RtnCode, MerchantTradeNo, RtnMsg } = req.body;

  if (RtnCode === '1') {
    res.redirect(`/order-success.html?order=${encodeURIComponent(MerchantTradeNo)}`);
  } else {
    res.redirect(`/order-failed.html?order=${encodeURIComponent(MerchantTradeNo)}&msg=${encodeURIComponent(RtnMsg || '付款失敗')}`);
  }
});

module.exports = router;
