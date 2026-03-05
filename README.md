# 科雷精品咖啡館 — Cuore Coffee Roaster

Static brochure site + Express e-commerce shop with ECPay (綠界) payment integration.
Hosted on Railway. Bilingual: zh-TW / EN.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML/CSS/JS — no framework |
| i18n | Custom `data-i18n` attribute system (`assets/js/i18n.js`) |
| Backend | Node.js + Express |
| Payments | ECPay (綠界科技) — HMAC-SHA256 signed form POST |
| Email | Resend |
| Hosting | Railway (Nixpacks, auto-deploy from GitHub) |
| Orders | JSON files in `orders/` (ephemeral — production should use a DB) |

---

## Project Structure

```
├── index.html              # Main brochure site
├── shop.html               # E-commerce shop page
├── order-success.html      # Post-payment success page
├── order-failed.html       # Post-payment failure page
├── server.js               # Express entry point
├── railway.toml            # Railway deployment config
├── menu_2.json             # Product catalogue (11 SKUs, 4 grind variants each)
│
├── api/
│   ├── checkout.js         # POST /api/checkout — builds & signs ECPay form
│   ├── ecpay-notify.js     # POST /api/ecpay/notify — server-side payment result
│   ├── ecpay-return.js     # POST /api/ecpay/return — browser redirect after payment
│   ├── orders.js           # File-based order storage helpers
│   └── mailer.js           # Resend email notification
│
└── assets/
    ├── css/
    │   ├── style.css       # Main site styles + CSS variables
    │   └── shop.css        # Shop-specific styles
    └── js/
        ├── i18n.js         # Full translation system (zh-TW, en, ja, ko)
        ├── cart.js         # Product grid, cart sidebar, lang-aware rendering
        ├── checkout.js     # Form validation, POST to /api/checkout
        └── main.js         # Main site JS
```

---

## Environment Variables

Set these in Railway → your service → Variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `ECPAY_MERCHANT_ID` | Yes | ECPay merchant ID (staging: `2000132`) |
| `ECPAY_HASH_KEY` | Yes | ECPay HashKey (staging: `5294y06JbISpM5x9`) |
| `ECPAY_HASH_IV` | Yes | ECPay HashIV (staging: `v77hoKGq4kWxNNIS`) |
| `ECPAY_API_URL` | Yes | ECPay endpoint — staging or production (see below) |
| `SITE_URL` | Yes | Your public domain, **no trailing slash** |
| `RESEND_API_KEY` | Yes | From resend.com dashboard |
| `NOTIFY_EMAIL` | Yes | Shop owner email — receives order notifications |
| `NOTIFY_FROM` | No | Sender address (default: `onboarding@resend.dev`) |

**ECPay endpoints:**
```
# Staging (test — no real money)
https://payment-stage.ecpay.com.tw/Cashier/AioCheckout/V5

# Production (real payments)
https://payment.ecpay.com.tw/Cashier/AioCheckout/V5
```

---

## ECPay Integration — How It Works

```
Browser          Your Server         ECPay
   |                  |                 |
   |-- POST /api/checkout              |
   |  (cart + customer form)           |
   |                  |                |
   |                  |-- builds params, sorts keys
   |                  |-- HMAC-SHA256 signs CheckMacValue
   |                  |-- saves order (status: pending)
   |                  |-- returns HTML page with hidden form
   |                  |                |
   |<-- auto-submit form               |
   |----------------------- POST ----->|
   |                  |                |-- user pays
   |                  |                |
   |                  |<-- server POST /api/ecpay/notify
   |                  |    (RtnCode=1 = paid)
   |                  |-- verifies CheckMacValue
   |                  |-- updates order (status: paid)
   |                  |-- sends Resend email to shop owner
   |                  |-- responds "1|OK"
   |                  |                |
   |<-- browser redirect /api/ecpay/return
   |-- redirects to order-success.html or order-failed.html
```

### CheckMacValue Algorithm

```js
// 1. Remove CheckMacValue from params
// 2. Sort remaining keys alphabetically
// 3. Build string: HashKey=xxx&key=val&...&HashIV=xxx
// 4. URL-encode with ECPay-specific rules (see below)
// 5. SHA256 → uppercase hex
const raw = `HashKey=${HASH_KEY}&${sorted}&HashIV=${HASH_IV}`;
const mac = crypto.createHash('sha256').update(ecpayEncode(raw)).digest('hex').toUpperCase();
```

### ECPay-specific URL encoding

ECPay's encoding is NOT standard `encodeURIComponent`. Differences:
```js
function ecpayEncode(str) {
  return encodeURIComponent(str)
    .replace(/%20/g, '+')
    .replace(/!/g,   '%21')
    .replace(/'/g,   '%27')
    .replace(/\(/g,  '%28')
    .replace(/\)/g,  '%29')
    .replace(/\*/g,  '%2A')
    .toLowerCase();           // <-- entire string lowercased
}
```

### MerchantTradeNo format
```
CC + yyMMddHHmmss + 4 random alphanumeric chars  =  18 chars total
Example: CC260302083121JJBQ
Max allowed by ECPay: 20 chars, alphanumeric only
```

### ItemName format
```
ProductName#UnitPrice#Qty#Subtotal|ProductName#UnitPrice#Qty#Subtotal
Max 400 chars total
```

---

## i18n System

Translation keys live in `assets/js/i18n.js`. Usage:

```html
<!-- Static text in HTML -->
<p data-i18n="shop.hero.sub">Fallback text</p>
```

```js
// In JavaScript
window.i18n.t('shop.cart.total', 'en')    // → "Total"
window.i18n.t('shop.cart.total', 'zh-TW') // → "合計"
```

- Language stored in `localStorage` key `cuore-lang`
- Shop maps `ja` / `ko` → `en` as fallback (shop is zh-TW and en only)
- Language change triggers re-render of product grid and cart UI

---

## Running Locally

```bash
npm install
npm run dev        # node --watch server.js — auto-restarts on file change
# open http://localhost:3000/shop.html
```

ECPay staging credentials are defaulted in code — no `.env` needed locally.
ECPay's notify webhook cannot reach localhost, so orders stay `pending` locally.
For full local testing use a tunnel:

```bash
npx ngrok http 3000
# then set SITE_URL=https://xxxx.ngrok.io in your shell
```

---

## Deploying to Railway

1. `git push` to `main` → Railway auto-deploys
2. Start command: `node server.js` (set in `railway.toml`)
3. Set all env vars in Railway dashboard
4. `SITE_URL` must have **no trailing slash**

---

## Order Storage — Known Limitation

Orders are stored as JSON files in `orders/` on Railway's filesystem.
**Railway's filesystem resets on every redeploy** — orders will be lost.

For production, replace `api/orders.js` with a proper database:
- Railway PostgreSQL add-on (~$5/month)
- Supabase free tier (PostgreSQL)
- Turso (SQLite-based, generous free tier)

---

## ECPay Staging Test Card

| Field | Value |
|-------|-------|
| Card number | `4311-9522-2222-2222` |
| Expiry | any future date |
| CVV | `222` |

Standard Visa/Mastercard test numbers (`4242 4242...`) do **not** work on ECPay staging.

---

## Going Live Checklist

- [ ] Shop owner's ECPay merchant account approved
- [ ] Credit card, ATM, CVS payment modules enabled in ECPay dashboard
- [ ] 電子發票 (e-invoice) module enabled
- [ ] 超商取貨付款 module enabled (if offering CVS pickup)
- [ ] Real bean product photos added (`assets/images/beans/bean-01.jpg` … `bean-11.jpg`)
- [ ] Railway env vars updated with real `ECPAY_MERCHANT_ID`, `HASH_KEY`, `HASH_IV`
- [ ] `ECPAY_API_URL` switched to production URL
- [ ] `NOTIFY_FROM` updated to a verified sending domain (not `onboarding@resend.dev`)
- [ ] Demo banner removed from `index.html`
- [ ] Order storage migrated from filesystem to a database

---

© 2026 Cuore Coffee Roaster · Hualien, Taiwan
