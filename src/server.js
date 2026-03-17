const express = require("express");

const { port, publicDir } = require("./config/env");
const {
  applySecurity,
  checkoutRateLimit,
  orderStatusRateLimit,
} = require("./middleware/security");

const app = express();

applySecurity(app);

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));

app.use("/api/catalog", require("./routes/catalog"));
app.use("/api/checkout", checkoutRateLimit, require("./routes/checkout"));
app.use("/api/orders", orderStatusRateLimit, require("./routes/orders"));
app.use("/api/ecpay/notify", require("./routes/payment/notify"));
app.use("/api/ecpay/return", require("./routes/payment/return"));

app.use(express.static(publicDir, { extensions: ["html"] }));

app.listen(port, () => {
  console.log(`Cuore Coffee server running on port ${port}`);
});
