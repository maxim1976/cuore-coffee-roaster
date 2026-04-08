# Cuore Coffee Roaster — CLAUDE.md

## Project
Small coffee shop website for 科雷精品咖啡館 (Cuore Coffee Roaster), Hualien, Taiwan.
Bilingual (zh-TW / EN). Sells coffee beans online, integrated with ECPay payment gateway.

---

## Target Stack (migration in progress)

| Layer       | Current              | Target               |
|-------------|----------------------|----------------------|
| Backend     | Node.js + Express    | Python + Flask       |
| Frontend    | Vanilla JS + CSS     | HTMX + Jinja2        |
| Database    | JSON files           | PostgreSQL (Railway) |
| ORM         | —                    | SQLAlchemy           |
| Deployment  | Railway              | Railway (same)       |
| Email       | Resend               | Resend (same)        |
| Payments    | ECPay                | ECPay (same)         |

---

## Architecture Decisions

- **Catalog stays as JSON** — `data/catalog/menu.json` is manually curated, rarely changes, no need for a DB table. Load into memory at startup.
- **Orders go into Postgres** — current JSON file storage is ephemeral on Railway (lost on redeploy). Schema: `orders` + `order_items` tables.
- **HTMX replaces JS rendering** — server returns HTML fragments, no more hand-built HTML strings in JS files.
- **Jinja2 for templates** — replaces the current inline HTML in cart.js / checkout.js.
- **i18n via Flask-Babel or simple dict** — current i18n.js pattern maps cleanly to Jinja2 context variables.

---

## Git Workflow

**Always deploy via main:**
```bash
git push origin <branch>
git checkout main
git merge <branch>
git push origin main
```
The live site on Railway deploys from `main`. Pushing only a feature branch does not update the live site.

---

## Key Files

```
data/catalog/menu.json        # Product catalog (source of truth for coffee beans)
storage/orders/               # Legacy order storage (JSON files, being replaced by Postgres)
src/server.js                 # Express entry point (to be replaced by Flask app)
src/routes/catalog.js         # Catalog API route
src/services/pricing.js       # Pricing logic
public/shop.html              # Shop page (HTMX migration target)
public/assets/js/cart.js      # Renders product cards + cart (to be replaced by Jinja2/HTMX)
public/assets/css/shop.css    # Shop styles (keep as-is)
railway.toml                  # Railway deployment config
```

---

## DB Schema (target)

```sql
CREATE TABLE orders (
    id          SERIAL PRIMARY KEY,
    trade_no    VARCHAR(32) UNIQUE NOT NULL,
    access_token VARCHAR(64) NOT NULL,
    status      VARCHAR(20) NOT NULL DEFAULT 'pending',
    customer_name    VARCHAR(100),
    customer_phone   VARCHAR(20),
    customer_email   VARCHAR(100),
    shipping_method  VARCHAR(20),
    shipping_address TEXT,
    note        TEXT,
    total_ntd   INTEGER NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
    id         SERIAL PRIMARY KEY,
    order_id   INTEGER REFERENCES orders(id),
    sku        VARCHAR(64),
    name       VARCHAR(200),
    price_ntd  INTEGER,
    qty        INTEGER
);
```

---

## Environment Variables

```
PORT
NODE_ENV / FLASK_ENV
SITE_URL
ECPAY_MERCHANT_ID
ECPAY_HASH_KEY
ECPAY_HASH_IV
ECPAY_API_URL
RESEND_API_KEY
DATABASE_URL          # Postgres connection string (Railway injects this)
```

---

## Notes

- ECPay callback must be a public HTTPS URL — test locally with ngrok or Railway preview deployments.
- Orders have a cookie-based access token (`cuore_order_access`) for the order confirmation page — no user accounts.
- All prices in NTD (New Taiwan Dollar).
- Free shipping threshold: NT$1,500.
