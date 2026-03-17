const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const { isProduction } = require("../config/env");

const ecpayHosts = [
  "https://payment-stage.ecpay.com.tw",
  "https://payment.ecpay.com.tw",
];

function applySecurity(app) {
  app.disable("x-powered-by");

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://cdnjs.cloudflare.com",
          ],
          scriptSrcAttr: ["'unsafe-inline'"],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
            "https://cdnjs.cloudflare.com",
          ],
          fontSrc: [
            "'self'",
            "https://fonts.gstatic.com",
            "https://cdnjs.cloudflare.com",
          ],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"],
          frameSrc: [
            "'self'",
            "https://www.google.com",
            "https://maps.google.com",
          ],
          formAction: ["'self'", ...ecpayHosts],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          frameAncestors: ["'none'"],
          upgradeInsecureRequests: isProduction ? [] : null,
        },
      },
      hsts: isProduction ? undefined : false,
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    }),
  );
}

const checkoutRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error:
      "Too many checkout attempts. Please wait a few minutes and try again.",
  },
});

const orderStatusRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many status checks. Please refresh later." },
});

module.exports = {
  applySecurity,
  checkoutRateLimit,
  orderStatusRateLimit,
};
