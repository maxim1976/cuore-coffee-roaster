const path = require("path");

const rootDir = path.resolve(__dirname, "..", "..");
const siteUrl = (process.env.SITE_URL || "http://localhost:3000").replace(
  /\/$/,
  "",
);
const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  rootDir,
  publicDir: path.join(rootDir, "public"),
  catalogPath: path.join(rootDir, "data", "catalog", "menu.json"),
  ordersDir: path.join(rootDir, "storage", "orders"),
  port: Number(process.env.PORT) || 3000,
  siteUrl,
  isProduction,
  useSecureCookies: isProduction || siteUrl.startsWith("https://"),
  ecpay: {
    merchantId: process.env.ECPAY_MERCHANT_ID || "2000132",
    hashKey: process.env.ECPAY_HASH_KEY || "5294y06JbISpM5x9",
    hashIv: process.env.ECPAY_HASH_IV || "v77hoKGq4kWxNNIS",
    apiUrl:
      process.env.ECPAY_API_URL ||
      "https://payment-stage.ecpay.com.tw/Cashier/AioCheckout/V5",
  },
};
