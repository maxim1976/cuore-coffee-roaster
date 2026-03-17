const express = require("express");

const { hasOrderAccess } = require("../services/orderAccess");
const { getOrder } = require("../storage/orderStore");

const router = express.Router();

router.get("/:tradeNo/status", async (req, res) => {
  try {
    const tradeNo = String(req.params.tradeNo || "")
      .trim()
      .toUpperCase();

    if (!tradeNo) {
      return res.status(400).json({ error: "Missing order number" });
    }

    const order = await getOrder(tradeNo);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (!hasOrderAccess(req, order)) {
      return res.status(403).json({ error: "Order access denied" });
    }

    res.setHeader("Cache-Control", "no-store");
    res.json({
      order: order.tradeNo,
      status: order.status,
      message: order.payment?.rtnMsg || null,
      paidAt: order.payment?.paidAt || order.paidAt || null,
    });
  } catch (error) {
    console.error("[orders] Error:", error);
    res.status(500).json({ error: "Unable to load order status" });
  }
});

module.exports = router;
