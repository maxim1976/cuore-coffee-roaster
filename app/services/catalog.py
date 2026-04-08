import json
import os
from functools import lru_cache

RETAIL_MENU_KEY = "咖啡豆零售 Coffee Beans Retail"

ROAST_CLASSES = {
    "light": "product-card__badge--light",
    "light-medium": "product-card__badge--light-medium",
    "medium": "product-card__badge--medium",
    "medium-dark": "product-card__badge--medium-dark",
    "dark": "product-card__badge--dark",
}

ROAST_LABELS = {
    "light":        ("淺焙",   "Light"),
    "light-medium": ("淺中焙", "Light-Medium"),
    "medium":       ("中焙",   "Medium"),
    "medium-dark":  ("中深焙", "Medium-Dark"),
    "dark":         ("深焙",   "Dark"),
}

SHIPPING_COSTS = {"delivery": 100, "cvs": 60, "store": 0}


def _catalog_path():
    from flask import current_app
    return current_app.config["CATALOG_PATH"]


def _load_raw():
    with open(_catalog_path(), encoding="utf-8") as f:
        return json.load(f)


def get_retail_section():
    data = _load_raw()
    retail = data.get("menu", {}).get(RETAIL_MENU_KEY)
    if not retail:
        raise RuntimeError(f"Retail catalog section not found: {RETAIL_MENU_KEY}")
    return retail


def to_public_product(product):
    roast = product.get("roast_level", "medium")
    zh_label, en_label = ROAST_LABELS.get(roast, ("中焙", "Medium"))
    weight = product.get("weight_g", 200)

    variants = [
        {
            "sku": v["sku"],
            "grind": v["grind"],
            "grind_zh": v.get("grind_zh", v["grind"]),
            "grind_en": v.get("grind_en", v["grind"]),
            "weight_g": v.get("weight_g", weight),
            "price": v.get("price_NTD", product.get("price_NTD", 0)),
            "in_stock": bool(v.get("in_stock", True)),
        }
        for v in product.get("variants", [])
    ]

    return {
        "id": product["id"],
        "name_zh": product.get("name_zh", ""),
        "name_en": product.get("name_en", ""),
        "origin_zh": product.get("origin_zh", ""),
        "origin_en": product.get("origin_en", ""),
        "process_zh": product.get("process_zh", ""),
        "process_en": product.get("process_en", ""),
        "flavor_zh": product.get("flavor_zh", ""),
        "flavor_en": product.get("flavor_en", ""),
        "promo_zh": product.get("promo_zh") or None,
        "promo_en": product.get("promo_en") or None,
        "image": product.get("image", "").removeprefix("assets/"),
        "roast_level": roast,
        "roast_class": ROAST_CLASSES.get(roast, ""),
        "roast_label_zh": zh_label,
        "roast_label_en": en_label,
        "weight_label": f"{weight}g",
        "in_stock": bool(product.get("in_stock", True)),
        "variants": variants,
    }


def get_public_catalog():
    retail = get_retail_section()
    meta = retail.get("section_meta", {})
    shipping_meta = meta.get("shipping", {})

    return {
        "items": [to_public_product(p) for p in retail.get("items", [])],
        "shipping": {
            "free_shipping_threshold": shipping_meta.get("free_shipping_threshold_NTD", 1500),
            "costs": SHIPPING_COSTS,
        },
    }
