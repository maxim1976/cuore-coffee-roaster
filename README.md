# 科雷精品咖啡館 — Cuore Coffee Roaster

Static brochure site plus a small Express-powered e-commerce flow for retail coffee bean orders.
Hosted on Railway. Languages: zh-TW and EN for the shop, with broader brochure translations handled in the site i18n file.

---

## Stack

| Layer         | Technology                                              |
| ------------- | ------------------------------------------------------- |
| Frontend      | Vanilla HTML/CSS/JS                                     |
| i18n          | Custom `data-i18n` system in `public/assets/js/i18n.js` |
| Backend       | Node.js + Express                                       |
| Payments      | ECPay (綠界) with SHA256 `CheckMacValue` signing        |
| Email         | Resend                                                  |
| Hosting       | Railway                                                 |
| Order Storage | JSON files in `storage/orders/`                         |

---

## Architecture

The project is now split by responsibility instead of serving the repository root directly.

```text
.
├── public/                 # Browser-accessible files only
│   ├── index.html
│   ├── shop.html
│   ├── order-success.html
│   ├── order-failed.html
│   ├── order-processing.html
│   └── assets/
│       ├── css/
│       ├── images/
│       └── js/
│
├── src/                    # Server application code
│   ├── server.js
│   ├── config/
│   │   └── env.js
│   ├── middleware/
│   │   └── security.js
│   ├── routes/
│   │   ├── catalog.js
│   │   ├── checkout.js
│   │   ├── orders.js
│   │   └── payment/
│   │       ├── notify.js
│   │       └── return.js
│   ├── services/
│   │   ├── catalog.js
│   │   ├── mailer.js
│   │   ├── orderAccess.js
│   │   ├── pricing.js
│   │   └── payment/
│   │       └── ecpay.js
│   └── storage/
│       └── orderStore.js
│
├── data/
│   └── catalog/
│       └── menu.json       # Source-of-truth product catalog
│
├── storage/
│   └── orders/             # Runtime-generated order files, not public
│
├── docs/
│   └── ...
│
├── package.json
├── railway.toml
└── README.md
```

---

## Security Changes

Compared to the original flat-root version, the current structure fixes the main trust and exposure problems:

- The server now serves only `public/`, not the entire repository.
- Order files live in `storage/orders/`, outside the public web root.
- The browser sends only `sku` and `qty`; the server calculates price, shipping, and total from the catalog.
- ECPay browser return no longer decides success directly. It checks persisted order state and falls back to `order-processing.html` while the verified webhook is still pending.
- Order status polling is protected with an order access cookie set during checkout.
- Basic hardening is enabled through Helmet and route rate limits.

This is still a lightweight app. It is safer than before, but file-based storage on Railway remains a temporary solution.

---

## API Surface

| Route                             | Purpose                                                                           |
| --------------------------------- | --------------------------------------------------------------------------------- |
| `GET /api/catalog`                | Public retail catalog for the shop page                                           |
| `POST /api/checkout`              | Validate order, compute totals server-side, save pending order, return ECPay form |
| `POST /api/ecpay/notify`          | Verified server-to-server payment webhook                                         |
| `POST /api/ecpay/return`          | Browser return that redirects by saved order status                               |
| `GET /api/orders/:tradeNo/status` | Protected order status endpoint used by `order-processing.html`                   |

---

## Payment Flow

```text
Browser                 Server                     ECPay
   |                      |                          |
   |-- POST /api/checkout |                          |
   |   sku + qty + form   |                          |
   |                      |-- load catalog           |
   |                      |-- price items server-side|
   |                      |-- save pending order     |
   |                      |-- set order access cookie|
   |                      |-- sign ECPay params      |
   |<-- auto-submit form  |                          |
   |------------------------------ POST -----------> |
   |                      |                          |-- user pays
   |                      |<----- POST /notify ------|
   |                      |-- verify CheckMacValue   |
   |                      |-- update order status    |
   |                      |-- send email             |
   |                      |-- reply 1|OK             |
   |<----- POST /return --|                          |
   |-- redirect to success / failure / processing   |
   |-- processing page polls /api/orders/:id/status |
```

---

## Environment Variables

Set these in Railway or your local shell:

| Variable            | Required | Description                                            |
| ------------------- | -------- | ------------------------------------------------------ |
| `ECPAY_MERCHANT_ID` | Yes      | ECPay merchant ID                                      |
| `ECPAY_HASH_KEY`    | Yes      | ECPay HashKey                                          |
| `ECPAY_HASH_IV`     | Yes      | ECPay HashIV                                           |
| `ECPAY_API_URL`     | Yes      | ECPay endpoint                                         |
| `SITE_URL`          | Yes      | Public site URL, no trailing slash                     |
| `RESEND_API_KEY`    | No       | Required only if order email notifications are enabled |
| `NOTIFY_EMAIL`      | No       | Shop owner email                                       |
| `NOTIFY_FROM`       | No       | Sender email address                                   |

ECPay endpoints:

```text
Staging:    https://payment-stage.ecpay.com.tw/Cashier/AioCheckout/V5
Production: https://payment.ecpay.com.tw/Cashier/AioCheckout/V5
```

---

## Running Locally

```bash
npm install
npm run dev
# open http://localhost:3000/shop.html
```

Local development defaults to ECPay staging credentials if no env vars are set.

Important local caveat:

- `POST /api/ecpay/notify` cannot be reached by ECPay while you are on plain localhost.
- That means payments will remain `pending` unless you expose the app with a public tunnel.

Example with ngrok:

```bash
npx ngrok http 3000
# then set SITE_URL=https://your-ngrok-domain.ngrok.io
```

---

## Deploying to Railway

`railway.toml` now starts the app with:

```text
node src/server.js
```

Deployment checklist:

1. Set all required environment variables.
2. Confirm `SITE_URL` has no trailing slash.
3. Switch `ECPAY_API_URL` to production only after ECPay production credentials are ready.
4. Verify `NOTIFY_FROM` uses a verified sender domain if you use email notifications.

---

## Order Storage Limitation

Orders are still stored as JSON files in `storage/orders/`.

That is now private from the web server, but it is still not ideal for production because Railway filesystem data is ephemeral across redeploys.

Recommended next upgrade:

1. Move orders to Railway PostgreSQL or another hosted database.
2. Keep `data/catalog/menu.json` as the catalog source, or migrate catalog data too if stock management becomes dynamic.

---

## ECPay Staging Test Card

| Field       | Value                 |
| ----------- | --------------------- |
| Card number | `4311-9522-2222-2222` |
| Expiry      | any future date       |
| CVV         | `222`                 |

Standard Visa/Mastercard test numbers such as `4242 4242 ...` do not work on ECPay staging.
