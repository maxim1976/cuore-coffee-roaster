const express = require("express");

const { getOrder } = require("../../storage/orderStore");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const tradeNo = String(req.body.MerchantTradeNo || "")
      .trim()
      .toUpperCase();

    if (!tradeNo) {
      return res.redirect("/order-failed.html?msg=Invalid%20payment%20return");
    }

    const order = await getOrder(tradeNo);

    if (!order) {
      return res.redirect("/order-failed.html?msg=Order%20not%20found");
    }

    if (order.status === "paid") {
      return res.redirect(
        `/order-success.html?order=${encodeURIComponent(tradeNo)}`,
      );
    }

    if (order.status === "failed") {
      return res.redirect(
        `/order-failed.html?order=${encodeURIComponent(tradeNo)}&msg=${encodeURIComponent(order.payment?.rtnMsg || "付款失敗")}`,
      );
    }

    return res.redirect(
      `/order-processing.html?order=${encodeURIComponent(tradeNo)}`,
    );
  } catch (error) {
    console.error("[ECPay return] Error:", error);
    return res.redirect(
      "/order-failed.html?msg=Unable%20to%20verify%20payment%20status",
    );
  }
});

module.exports = router;
