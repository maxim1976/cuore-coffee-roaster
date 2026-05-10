# Cuore Coffee Roaster — CLAUDE.md

## Project
Static brochure + retail catalog site for 科雷精品咖啡館 (Cuore Coffee Roaster), Hualien, Taiwan.
Bilingual (zh-TW / EN) with Japanese and Korean i18n. Deployed on GitHub Pages — no backend, no server, no payments.

---

## Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | Vanilla HTML + CSS + JS (no frameworks)         |
| i18n       | Custom `data-i18n` system in `i18n.js`          |
| Catalog    | Static JSON — `public/data/catalog/menu.json`   |
| Deployment | GitHub Pages (static files only)                |

---

## Architecture

Single-page site. All content is in `public/index.html`. The coffee beans retail section (`#beans`) is rendered dynamically by `beans.js`, which fetches the catalog JSON at load time. No cart, no checkout — orders are placed by contacting the shop via Facebook or LINE.

---

## Key Files

```
public/index.html                    # The entire site (single page)
public/data/catalog/menu.json        # Product catalog + active promotion (source of truth)
public/assets/js/i18n.js             # All translations (zh-TW, en, ja, ko)
public/assets/js/beans.js            # Loads catalog, renders #beans section
public/assets/js/main.js             # Navigation, scroll effects
public/assets/css/style.css          # All styles
public/assets/images/beans/          # Bean product images (bean-01.jpg … bean-03.jpg)
```

---

## Updating the Catalog

Edit **`public/data/catalog/menu.json`** — this is the only file to touch for product changes.

The retail section lives under `menu["咖啡豆零售 Coffee Beans Retail"]`:

- **`promotion`** — active promotion banner. Set `period_end` (YYYY-MM-DD) and `beans.js` auto-hides it after that date. Set to `null` to disable.
- **`items`** — array of products. Each needs: `id`, `name_zh/en`, `origin_zh/en`, `process_zh/en`, `flavor_zh/en`, `price_NTD`, `roast_level` (light / light_medium / medium / medium_dark), `image`, `variants`.

---

## Adding Translations

Open `public/assets/js/i18n.js`. Add the new key to all four language blocks (`zh-TW`, `en`, `ja`, `ko`), then reference it in HTML with `data-i18n="your.key"`.

---

## Git Workflow

GitHub Pages deploys from `main`. Push to `main` to update the live site.

```bash
git add .
git commit -m "your message"
git push origin main
```

---

## Notes

- All prices in NTD (New Taiwan Dollar).
- Free shipping threshold: NT$1,500 (display only — no payment processing on this site).
- Bean images: `public/assets/images/beans/bean-01.jpg`, `bean-02.jpg`, `bean-03.jpg`. Replace the file to update the image; keep the same filename or update `menu.json` to match.
- The `data/` folder at repo root is legacy (used by the old Express backend) — ignore it; the source of truth is `public/data/catalog/menu.json`.
