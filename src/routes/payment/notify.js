const express = require("express");

const { sendOrderNotification } = require("../../services/mailer");
const { verifyCheckMac } = require("../../services/payment/ecpay");
const { getOrder, updateOrder } = require("../../storage/orderStore");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const params = req.body;

    if (!verifyCheckMac(params)) {
      console.error(
        "[ECPay notify] Invalid CheckMacValue",
        params.MerchantTradeNo,
      );
      return res.send("0|ErrorMsg");
    }

    const tradeNo = params.MerchantTradeNo;
    const existingOrder = await getOrder(tradeNo);

    if (!existingOrder) {
      console.error("[ECPay notify] Order not found", tradeNo);
      return res.send("0|ErrorMsg");
    }

    const paid = params.RtnCode === "1";
    const paidAt = paid ? new Date().toISOString() : null;
    const updatedOrder = await updateOrder(tradeNo, {
      status: paid ? "paid" : "failed",
      paidAt,
      payment: {
        ...(existingOrder.payment || {}),
        provider: "ECPay",
        status: paid ? "paid" : "failed",
        rtnCode: params.RtnCode,
        rtnMsg: params.RtnMsg || "",
        tradeNo: params.TradeNo || null,
        paymentDate: params.PaymentDate || null,
        tradeAmount: Number(
          params.TradeAmt || existingOrder.pricing?.total || 0,
        ),
        paidAt,
        lastCallbackAt: new Date().toISOString(),
      },
    });

    if (!updatedOrder) {
      console.error("[ECPay notify] Failed to update order", tradeNo);
      return res.send("0|ErrorMsg");
    }

    if (paid && existingOrder.status !== "paid") {
      sendOrderNotification(updatedOrder).catch(console.error);
    }

    console.log(
      `[ECPay notify] ${tradeNo} -> ${paid ? "PAID" : "FAILED"} (${params.RtnMsg || "No message"})`,
    );
    res.send("1|OK");
  } catch (error) {
    console.error("[ECPay notify] Error:", error);
    res.send("0|ErrorMsg");
  }
});

module.exports = router;
