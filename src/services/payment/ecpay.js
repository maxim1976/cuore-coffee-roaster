const crypto = require("crypto");

const { ecpay, siteUrl } = require("../../config/env");

function generateTradeNo() {
  const now = new Date();
  const timestamp =
    String(now.getFullYear()).slice(-2) +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") +
    String(now.getSeconds()).padStart(2, "0");
  const randomSuffix = crypto.randomBytes(2).toString("hex").toUpperCase();

  return `CC${timestamp}${randomSuffix}`;
}

function createOrderAccessToken() {
  return crypto.randomBytes(24).toString("hex");
}

function getMerchantTradeDate() {
  const now = new Date();
  return (
    `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")} ` +
    `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`
  );
}

function ecpayEncode(value) {
  return encodeURIComponent(value)
    .replace(/%20/g, "+")
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A")
    .toLowerCase();
}

function computeCheckMac(params) {
  const sorted = Object.keys(params)
    .sort()
    .reduce((accumulator, key) => {
      accumulator[key] = params[key];
      return accumulator;
    }, {});

  const raw = `HashKey=${ecpay.hashKey}&${Object.entries(sorted)
    .map(([key, value]) => `${key}=${value}`)
    .join("&")}&HashIV=${ecpay.hashIv}`;

  return crypto
    .createHash("sha256")
    .update(ecpayEncode(raw))
    .digest("hex")
    .toUpperCase();
}

function verifyCheckMac(params) {
  if (!params?.CheckMacValue) {
    return false;
  }

  const { CheckMacValue, ...rest } = params;
  const computed = computeCheckMac(rest);
  const received = String(CheckMacValue).toUpperCase();
  const computedBuffer = Buffer.from(computed);
  const receivedBuffer = Buffer.from(received);

  if (computedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(computedBuffer, receivedBuffer);
}

function buildCheckoutParams({ tradeNo, total, itemName }) {
  return {
    MerchantID: ecpay.merchantId,
    MerchantTradeNo: tradeNo,
    MerchantTradeDate: getMerchantTradeDate(),
    PaymentType: "aio",
    TotalAmount: String(total),
    TradeDesc: encodeURIComponent("科雷精品咖啡豆"),
    ItemName: itemName,
    ReturnURL: `${siteUrl}/api/ecpay/notify`,
    OrderResultURL: `${siteUrl}/api/ecpay/return`,
    ChoosePayment: "ALL",
    EncryptType: "1",
  };
}

function escapeHtmlAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildAutoSubmitForm(params) {
  const fields = Object.entries(params)
    .map(
      ([key, value]) =>
        `<input type="hidden" name="${escapeHtmlAttribute(key)}" value="${escapeHtmlAttribute(value)}">`,
    )
    .join("\n");

  return `<!DOCTYPE html><html lang="zh-TW"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><form id="f" action="${escapeHtmlAttribute(ecpay.apiUrl)}" method="POST">${fields}</form><script>document.getElementById('f').submit();</script></body></html>`;
}

module.exports = {
  buildAutoSubmitForm,
  buildCheckoutParams,
  computeCheckMac,
  createOrderAccessToken,
  generateTradeNo,
  verifyCheckMac,
};
