const express = require("express");
const { z } = require("zod");

const {
  buildAutoSubmitForm,
  buildCheckoutParams,
  computeCheckMac,
  createOrderAccessToken,
  generateTradeNo,
} = require("../services/payment/ecpay");
const { serializeOrderAccessCookie } = require("../services/orderAccess");
const { buildPricedOrder } = require("../services/pricing");
const { saveOrder } = require("../storage/orderStore");

const router = express.Router();

const checkoutSchema = z
  .object({
    items: z
      .array(
        z.object({
          sku: z
            .string()
            .trim()
            .min(1, "Cart contains an invalid item.")
            .max(80)
            .regex(/^[A-Z0-9_-]+$/, "Cart contains an invalid item."),
          qty: z
            .number()
            .int()
            .min(1, "Cart contains an invalid quantity.")
            .max(20, "Cart contains too many units of one item."),
        }),
      )
      .min(1, "Cart is empty")
      .max(20, "Cart contains too many items."),
    customer: z.object({
      name: z
        .string()
        .trim()
        .min(1, "Missing name")
        .max(80, "Name is too long"),
      phone: z
        .string()
        .trim()
        .regex(/^09\d{8}$/, "Invalid mobile number"),
      email: z
        .string()
        .trim()
        .email("Invalid email address")
        .max(254, "Email is too long"),
      note: z
        .string()
        .trim()
        .max(300, "Note is too long")
        .optional()
        .default(""),
    }),
    shipping: z.object({
      method: z.enum(["delivery", "cvs", "store"], {
        message: "Invalid shipping method",
      }),
      address: z.string().trim().max(200, "Address is too long").optional(),
      cvsStore: z
        .string()
        .trim()
        .max(40, "Convenience store is too long")
        .optional(),
      cvsStoreName: z
        .string()
        .trim()
        .max(80, "Store name is too long")
        .optional(),
    }),
  })
  .superRefine((payload, context) => {
    if (payload.shipping.method === "delivery" && !payload.shipping.address) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Missing delivery address",
        path: ["shipping", "address"],
      });
    }

    if (payload.shipping.method === "cvs" && !payload.shipping.cvsStore) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Missing convenience store",
        path: ["shipping", "cvsStore"],
      });
    }

    if (payload.shipping.method === "cvs" && !payload.shipping.cvsStoreName) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Missing convenience store branch",
        path: ["shipping", "cvsStoreName"],
      });
    }
  });

router.post("/", async (req, res) => {
  const parsed = checkoutSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.issues[0]?.message || "Invalid checkout payload",
    });
  }

  try {
    const tradeNo = generateTradeNo();
    const accessToken = createOrderAccessToken();
    const pricedOrder = await buildPricedOrder(
      parsed.data.items,
      parsed.data.shipping.method,
    );
    const params = buildCheckoutParams({
      tradeNo,
      total: pricedOrder.pricing.total,
      itemName: pricedOrder.itemName,
    });

    params.CheckMacValue = computeCheckMac(params);

    await saveOrder({
      tradeNo,
      accessToken,
      customer: parsed.data.customer,
      shipping: parsed.data.shipping,
      items: pricedOrder.items,
      pricing: pricedOrder.pricing,
      total: pricedOrder.pricing.total,
      status: "pending",
      payment: {
        provider: "ECPay",
        status: "pending",
      },
      createdAt: new Date().toISOString(),
    });

    res.setHeader(
      "Set-Cookie",
      serializeOrderAccessCookie(tradeNo, accessToken),
    );
    res.setHeader("Cache-Control", "no-store");
    res.send(buildAutoSubmitForm(params));
  } catch (error) {
    console.error("[checkout] Error:", error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.statusCode ? error.message : "Server error" });
  }
});

module.exports = router;
