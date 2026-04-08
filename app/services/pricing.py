from app.services.catalog import get_retail_section, SHIPPING_COSTS


class CheckoutError(Exception):
    status_code = 400


def _free_shipping_threshold(retail):
    return retail.get("section_meta", {}).get("shipping", {}).get("free_shipping_threshold_NTD", 1500)


def _shipping_cost(method: str, subtotal: int, threshold: int) -> int:
    if method not in SHIPPING_COSTS:
        raise CheckoutError("Invalid shipping method")
    cost = SHIPPING_COSTS[method]
    return 0 if subtotal >= threshold else cost


def build_priced_order(requested_items: list, shipping_method: str) -> dict:
    retail = get_retail_section()

    # Build SKU index
    sku_index = {}
    for product in retail.get("items", []):
        for variant in product.get("variants", []):
            sku_index[variant["sku"]] = {"product": product, "variant": variant}

    items = []
    for req in requested_items:
        entry = sku_index.get(req["sku"])
        if not entry:
            raise CheckoutError("Cart contains an unknown product. Please refresh and try again.")

        product = entry["product"]
        variant = entry["variant"]

        if not product.get("in_stock") or not variant.get("in_stock"):
            raise CheckoutError(f"{product['name_zh']} is currently out of stock.")

        price = variant["price_NTD"]
        qty = req["qty"]
        subtotal = price * qty

        items.append({
            "sku": variant["sku"],
            "name": f"{product['name_zh']}（{variant['grind_zh']}/{variant['weight_g']}g）",
            "name_zh": product["name_zh"],
            "name_en": product["name_en"],
            "grind": variant["grind"],
            "grind_zh": variant["grind_zh"],
            "grind_en": variant["grind_en"],
            "weight": variant["weight_g"],
            "price": price,
            "qty": qty,
            "subtotal": subtotal,
            "ecpay_name": product.get("ecpay", {}).get("ItemName") or product["name_zh"],
        })

    subtotal_total = sum(i["subtotal"] for i in items)
    threshold = _free_shipping_threshold(retail)
    shipping_cost = _shipping_cost(shipping_method, subtotal_total, threshold)
    total = subtotal_total + shipping_cost

    item_name = "|".join(
        f"{i['ecpay_name']}#{i['price']}#{i['qty']}#{i['subtotal']}"
        for i in items
    )[:400]

    # Strip ecpay_name from returned items
    clean_items = [{k: v for k, v in i.items() if k != "ecpay_name"} for i in items]

    return {
        "items": clean_items,
        "item_name": item_name,
        "pricing": {
            "subtotal": subtotal_total,
            "shipping_cost": shipping_cost,
            "total": total,
            "free_shipping_threshold": threshold,
            "currency": retail.get("section_meta", {}).get("currency", "NTD"),
        },
    }
