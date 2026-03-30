/* ============================================================
   cart.js — Product rendering + cart state
   Lang-aware: reads current language from localStorage / window.i18n
   ============================================================ */

const CART_KEY = "cuore_cart";
let shippingConfig = {
  freeShippingThreshold: 1500,
  costs: { delivery: 100, cvs: 60, store: 0 },
};

// Shop supports zh-TW and en; ja/ko visitors fall through to en
function getLang() {
  const l = localStorage.getItem("cuore-lang") || "zh-TW";
  return l === "zh-TW" ? "zh-TW" : "en";
}

// Thin wrapper around window.i18n.t — safe to call before i18n is ready
function t(key) {
  return window.i18n?.t(key, getLang()) || key;
}

// ── Cart state ────────────────────────────────────────────────
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartUI();
}

function addItem(product, variant) {
  const cart = getCart();
  const existing = cart.find((i) => i.sku === variant.sku);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      sku: variant.sku,
      name_zh: product.name_zh,
      name_en: product.name_en,
      grind: variant.grind, // key: whole_bean | coarse | medium | fine
      price: variant.price_NTD,
      weight: variant.weight_g,
      qty: 1,
    });
  }
  saveCart(cart);
  flashCartBadge();
}

function removeItem(sku) {
  saveCart(getCart().filter((i) => i.sku !== sku));
}

function changeQty(sku, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.sku === sku);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
}

function cartSubtotal() {
  return getCart().reduce((s, i) => s + i.price * i.qty, 0);
}

function cartCount() {
  return getCart().reduce((s, i) => s + i.qty, 0);
}

// ── UI update ─────────────────────────────────────────────────
function updateCartUI() {
  const cart = getCart();
  const count = cartCount();
  const sub = cartSubtotal();
  const lang = getLang();

  // Count badges
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });

  const empty = document.getElementById("cartEmpty");
  const itemsEl = document.getElementById("cartItems");
  const summary = document.getElementById("cartSummary");
  const formEl = document.getElementById("checkoutForm");
  if (!empty) return;

  const hasItems = cart.length > 0;
  empty.style.display = hasItems ? "none" : "flex";
  itemsEl.style.display = hasItems ? "block" : "none";
  summary.style.display = hasItems ? "block" : "none";
  formEl.style.display = hasItems ? "block" : "none";

  // Render items
  itemsEl.innerHTML = cart
    .map((item) => {
      const name = lang === "zh-TW" ? item.name_zh : item.name_en;
      const grindLbl = t(`shop.grind.${item.grind}`);
      return `
      <li class="cart-item" data-sku="${item.sku}">
        <div class="cart-item__info">
          <span class="cart-item__name">${name}</span>
          <span class="cart-item__meta">${grindLbl} · ${item.weight}g</span>
        </div>
        <div class="cart-item__controls">
          <button class="qty-btn" onclick="changeQty('${item.sku}', -1)">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.sku}', +1)">+</button>
        </div>
        <div class="cart-item__price">
          NT$ ${(item.price * item.qty).toLocaleString()}
          <button class="remove-btn" onclick="removeItem('${item.sku}')" aria-label="Remove">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </li>`;
    })
    .join("");

  // Totals
  const method =
    document.querySelector('input[name="shipping"]:checked')?.value ||
    "delivery";
  const freeShippingThreshold = shippingConfig.freeShippingThreshold;
  const shippingCost = shippingConfig.costs[method] ?? 0;
  const shipCost = sub >= freeShippingThreshold ? 0 : shippingCost;
  const total = sub + shipCost;

  document.getElementById("cartSubtotal").textContent =
    `NT$ ${sub.toLocaleString()}`;
  document.getElementById("cartShipping").textContent =
    shipCost === 0 ? t("shop.cart.free") : `NT$ ${shipCost}`;
  document.getElementById("cartTotal").textContent =
    `NT$ ${total.toLocaleString()}`;

  const note = document.getElementById("freeShippingNote");
  if (sub >= freeShippingThreshold) {
    note.textContent = t("shop.cart.free-ok");
    note.className = "cart-summary__free cart-summary__free--ok";
  } else {
    const diff = freeShippingThreshold - sub;
    note.textContent = t("shop.cart.free-note").replace(
      "{diff}",
      diff.toLocaleString(),
    );
    note.className = "cart-summary__free";
  }
}

function flashCartBadge() {
  const btn = document.getElementById("cartToggle");
  btn.classList.add("cart-toggle--flash");
  setTimeout(() => btn.classList.remove("cart-toggle--flash"), 600);
}

// ── Product grid rendering ────────────────────────────────────
let _products = []; // cached for re-render on lang change

async function loadProducts() {
  const res = await fetch("/api/catalog", { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Unable to load retail catalog");
  }

  const data = await res.json();

  _products = data.items || [];

  if (data.shipping) {
    shippingConfig = {
      ...shippingConfig,
      ...data.shipping,
      costs: {
        ...shippingConfig.costs,
        ...(data.shipping.costs || {}),
      },
    };
  }

  renderGrid();
  updateCartUI();
}

function renderGrid() {
  const lang = getLang();
  const grid = document.getElementById("productGrid");
  grid.innerHTML = _products.map((p) => renderCard(p, lang)).join("");
  wireCardEvents();
}

function renderCard(product, lang) {
  const dv = product.variants[0];
  const isEn = lang === "en";
  const name = isEn ? product.name_en : product.name_zh;
  const nameSub = isEn ? product.name_zh : product.name_en;
  const origin = isEn ? product.origin_en : product.origin_zh;
  const flavor = isEn ? product.flavor_en : product.flavor_zh;
  const roastLabel = isEn
    ? product.roast_level_zh === "淺焙"
      ? "Light"
      : product.roast_level_zh === "淺中焙"
        ? "Light-Medium"
        : product.roast_level_zh === "中淺焙"
          ? "Medium-Light"
          : product.roast_level_zh === "中焙"
            ? "Medium"
            : "Med-Dark"
    : product.roast_level_zh;

  const roastClass =
    {
      light: "badge--light",
      light_medium: "badge--light-medium",
      medium_light: "badge--light-medium",
      medium: "badge--medium",
      medium_to_medium_dark: "badge--dark",
    }[product.roast_level] || "badge--medium";

  const weightLabel = `${product.weight_g}g`;
  const grindLabel = t("shop.product.grind");
  const addLabel = product.in_stock
    ? `<i class="fas fa-plus"></i> ${t("shop.product.add")}`
    : t("shop.product.sold-out");

  const grindOptions = product.variants
    .map((v) => {
      const label = isEn ? v.grind_en : v.grind_zh;
      return `<label class="grind-label">
      <input type="radio" class="grind-radio" name="grind-${product.id}" value="${v.sku}" ${v === dv ? "checked" : ""}>
      <span>${label}</span>
    </label>`;
    })
    .join("");

  return `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-card__image-wrap">
        <img src="${product.image}" alt="${name}" class="product-card__image"
             onerror="this.closest('.product-card__image-wrap').classList.add('product-card__image-wrap--placeholder')">
        <span class="product-card__badge ${roastClass}">${roastLabel}</span>
        <span class="product-card__weight">${weightLabel}</span>
      </div>
      <div class="product-card__body">
        <h2 class="product-card__name-zh">${name}</h2>
        <p class="product-card__name-en">${nameSub}</p>
        <p class="product-card__origin">${origin}</p>
        <p class="product-card__flavor">${flavor}</p>
        ${product.promo_zh ? `<p class="product-card__promo"><i class="fas fa-tag"></i> ${isEn ? product.promo_en || product.promo_zh : product.promo_zh}</p>` : ""}
        <div class="product-card__grind">
          <span class="product-card__grind-label">${grindLabel}</span>
          <div class="grind-options">${grindOptions}</div>
        </div>
        <div class="product-card__footer">
          <span class="product-card__price">NT$ ${dv.price_NTD.toLocaleString()}</span>
          <button class="add-to-cart add-to-cart--coming-soon" data-sku="${dv.sku}" disabled>
            <i class="fas fa-clock"></i> ${t("shop.product.coming-soon")}
          </button>
        </div>
      </div>
    </article>`;
}

function wireCardEvents() {
  const grid = document.getElementById("productGrid");

  // Grind selection → update price & active sku on card
  grid.querySelectorAll(".grind-radio").forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const card = e.target.closest(".product-card");
      const prodId = card.dataset.productId;
      const sku = e.target.value;
      const product = _products.find((p) => p.id === prodId);
      const variant = product?.variants.find((v) => v.sku === sku);
      if (variant) {
        card.querySelector(".product-card__price").textContent =
          `NT$ ${variant.price_NTD.toLocaleString()}`;
        card.querySelector(".add-to-cart").dataset.sku = sku;
      }
    });
  });

  // Add to cart (currently disabled — online ordering not yet active)
}

// ── Cart sidebar toggle ───────────────────────────────────────
document.getElementById("cartToggle").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
document.getElementById("cartOverlay").addEventListener("click", closeCart);

function openCart() {
  document.getElementById("cartSidebar").classList.add("cart-sidebar--open");
  document.getElementById("cartOverlay").classList.add("cart-overlay--visible");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  document.getElementById("cartSidebar").classList.remove("cart-sidebar--open");
  document
    .getElementById("cartOverlay")
    .classList.remove("cart-overlay--visible");
  document.body.style.overflow = "";
}

// Recalculate shipping when method changes
document.querySelectorAll('input[name="shipping"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    updateCartUI();
    const method = radio.value;
    const addressGroup = document.getElementById("addressGroup");
    const cvsGroup = document.getElementById("cvsGroup");
    addressGroup.style.display = method === "delivery" ? "block" : "none";
    cvsGroup.style.display = method === "cvs" ? "block" : "none";
  });
});

// Re-render grid + cart items when language changes
window.addEventListener("cuore-lang-change", () => {
  if (_products.length) renderGrid();
  updateCartUI();
});

// ── Init ─────────────────────────────────────────────────────
loadProducts().catch((error) => {
  console.error("[catalog] Failed to load products", error);
  const grid = document.getElementById("productGrid");
  if (grid) {
    grid.innerHTML =
      '<p class="shop-catalog-error">Unable to load products right now. Please refresh the page.</p>';
  }
});
updateCartUI();
