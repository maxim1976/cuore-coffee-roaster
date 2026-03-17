const { getRetailCatalog } = require("./catalog");

const SHIPPING_COSTS = {
  delivery: 100,
  cvs: 60,
  store: 0,
};

function createCheckoutError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function getFreeShippingThreshold(retailCatalog) {
  return (
    retailCatalog.section_meta?.shipping?.free_shipping_threshold_NTD || 1500
  );
}

function getShippingCost(method, subtotal, threshold) {
  const cost = SHIPPING_COSTS[method];

  if (typeof cost !== "number") {
    throw createCheckoutError("Invalid shipping method");
  }

  return subtotal >= threshold ? 0 : cost;
}

function toPublicProduct(product) {
  return {
    id: product.id,
    name_zh: product.name_zh,
    name_en: product.name_en,
    origin_zh: product.origin_zh,
    origin_en: product.origin_en,
    process_zh: product.process_zh,
    process_en: product.process_en,
    flavor_zh: product.flavor_zh,
    flavor_en: product.flavor_en,
    price_NTD: product.price_NTD,
    weight_g: product.weight_g,
    roast_level: product.roast_level,
    roast_level_zh: product.roast_level_zh,
    image: product.image,
    in_stock: Boolean(product.in_stock),
    variants: (product.variants || []).map((variant) => ({
      sku: variant.sku,
      grind: variant.grind,
      grind_zh: variant.grind_zh,
      grind_en: variant.grind_en,
      weight_g: variant.weight_g,
      price_NTD: variant.price_NTD,
      in_stock: Boolean(variant.in_stock),
    })),
  };
}

async function getPublicRetailCatalog() {
  const retailCatalog = await getRetailCatalog();

  return {
    items: retailCatalog.items.map(toPublicProduct),
    shipping: {
      freeShippingThreshold: getFreeShippingThreshold(retailCatalog),
      costs: SHIPPING_COSTS,
      methods_zh: retailCatalog.section_meta?.shipping?.methods_zh || [],
      methods_en: retailCatalog.section_meta?.shipping?.methods_en || [],
    },
  };
}

async function buildPricedOrder(requestedItems, shippingMethod) {
  const retailCatalog = await getRetailCatalog();
  const skuIndex = new Map();

  retailCatalog.items.forEach((product) => {
    (product.variants || []).forEach((variant) => {
      skuIndex.set(variant.sku, { product, variant });
    });
  });

  const items = requestedItems.map((requestedItem) => {
    const entry = skuIndex.get(requestedItem.sku);

    if (!entry) {
      throw createCheckoutError(
        "Cart contains an unknown product. Please refresh and try again.",
      );
    }

    const { product, variant } = entry;

    if (!product.in_stock || !variant.in_stock) {
      throw createCheckoutError(
        `${product.name_zh} is currently out of stock.`,
      );
    }

    const price = variant.price_NTD;
    const subtotal = price * requestedItem.qty;

    return {
      sku: variant.sku,
      productId: product.id,
      name: `${product.name_zh}（${variant.grind_zh}/${variant.weight_g}g）`,
      name_zh: product.name_zh,
      name_en: product.name_en,
      grind: variant.grind,
      grind_zh: variant.grind_zh,
      grind_en: variant.grind_en,
      weight: variant.weight_g,
      price,
      qty: requestedItem.qty,
      subtotal,
      ecpayName: product.ecpay?.ItemName || product.name_zh,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const freeShippingThreshold = getFreeShippingThreshold(retailCatalog);
  const shippingCost = getShippingCost(
    shippingMethod,
    subtotal,
    freeShippingThreshold,
  );
  const total = subtotal + shippingCost;
  const itemName = items
    .map(
      (item) => `${item.ecpayName}#${item.price}#${item.qty}#${item.subtotal}`,
    )
    .join("|")
    .slice(0, 400);

  return {
    items: items.map(({ ecpayName, ...item }) => item),
    itemName,
    pricing: {
      subtotal,
      shippingCost,
      total,
      freeShippingThreshold,
      currency: retailCatalog.section_meta?.currency || "NTD",
    },
  };
}

module.exports = {
  SHIPPING_COSTS,
  buildPricedOrder,
  getPublicRetailCatalog,
};
