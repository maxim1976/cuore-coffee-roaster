/**
 * Cuore Coffee Roaster - Internationalization (i18n)
 * Supports: Traditional Chinese (zh-TW), English (en), Japanese (ja), Korean (ko)
 */

const translations = {
  "zh-TW": {
    // Navigation
    "nav.home": "首頁",
    "nav.about": "關於我們",
    "nav.single-origin": "單品咖啡",
    "nav.espresso": "義式咖啡",
    "nav.drinks": "其他飲品",
    "nav.dessert": "點心",
    "nav.contact": "聯絡我們",
    "nav.shop": "網路商店",

    // Hero
    "hero.title": "科雷精品咖啡館",
    "hero.subtitle": "CUORE COFFEE ROASTER",
    "hero.tagline": "用心烘焙・品味生活",
    "hero.cta": "瀏覽菜單",

    // About
    "about.title": "關於科雷",
    "about.title.en": "About Us",
    "about.desc1":
      "科雷精品咖啡館座落於花蓮，是一間專注於精品咖啡的自家烘焙咖啡館。我們甄選來自世界各地的優質生豆，以專業的烘焙技術呈現每支咖啡獨特的風味。",
    "about.desc2":
      "無論是追求果香花香的淺焙單品，或是醇厚濃郁的中深焙豆，在科雷都能找到適合您的那一杯。",
    "about.feature1": "精選產區",
    "about.feature2": "自家烘焙",
    "about.feature3": "用心沖煮",

    // Single Origin
    "single-origin.title": "單品咖啡",
    "single-origin.title.en": "Single Origin",
    "single-origin.iced-note": "手沖冰鎮 Iced Pour-Over +NT$20",
    "single-origin.category": "精選單品",
    "single-origin.seasonal": "季節限定・稀有競標",
    "single-origin.seasonal.en": "Seasonal Special",

    // Single Origin Coffee Names
    "coffee.a.name": "科雷獨寶——《2025 西夏之花》",
    "coffee.a.origin": "衣索比亞 西達摩、夏奇索",
    "coffee.a.process": "水洗、日曬",
    "coffee.b.name": "《安提瓜 經典花神》",
    "coffee.b.origin": "瓜地馬拉 安提瓜 貝拉卡摩娜莊園",
    "coffee.b.process": "經典水洗",
    "coffee.c.name": "《肯亞 AA 涅里 蔚藍》",
    "coffee.c.origin": "肯亞｜SL28、SL34",
    "coffee.c.process": "傳統肯亞式水洗",
    "coffee.d.name": "《迦佑黃金曼特寧》20目",
    "coffee.d.origin": "印尼 蘇門答臘 亞齊 迦佐",
    "coffee.d.process": "濕剝法",
    "coffee.d.desc": "濃醇的奶香與堅果",
    "coffee.e.name": "《柏娜小珍珠》74110",
    "coffee.e.origin": "衣索比亞 西達摩 柏娜",
    "coffee.e.process": "山泉水洗",

    // Seasonal Specials
    "special.1.name": "《古吉 布穀瓦特》",
    "special.1.award": "2025 非洲水洗組冠軍",
    "special.1.origin": "衣索比亞 古吉",
    "special.1.process": "水洗",
    "special.2.name": "《紫色克拉摩》",
    "special.2.award": "衣索比亞 日曬組年度冠軍",
    "special.2.origin": "衣索比亞 西達摩 斑莎",
    "special.2.process": "日曬",
    "special.3.name": "《艷夏花荔》",
    "special.3.badge": "本館人氣冠軍",
    "special.3.origin": "哥倫比亞 考卡 天堂莊園",
    "special.3.process": "雙重厭氧",
    "special.3.note": "冰熱皆宜",
    "special.4.name": "《茵赫特 頂級波旁》",
    "special.4.award": "瓜地馬拉最常奪冠莊園",
    "special.4.origin": "瓜地馬拉 微薇特南果 茵赫特莊園 SHB",
    "special.4.process": "水洗",
    "special.5.name": "《艾爾托 大師之作》",
    "special.5.note": "西達摩產區經典日曬豆",
    "special.5.origin": "衣索比亞 西達摩｜品種：74158",
    "special.5.process": "日曬",

    // Espresso
    "espresso.title": "義式咖啡",
    "espresso.title.en": "Espresso Based",

    // Espresso Drinks
    "drink.coldbrew": "精選冷萃",
    "drink.milkbrew": "奶萃咖啡",
    "drink.americano": "美式咖啡",
    "drink.shakerato": "冰搖咖啡",
    "drink.espresso": "濃縮咖啡",
    "drink.piccolo": "短笛",
    "drink.cortado": "西班牙小拿鐵",
    "drink.cappuccino": "卡布奇諾",
    "drink.cappuccino.so": "單品卡布奇諾",
    "drink.cappuccino.marble": "大理石卡布",
    "drink.flatwhite": "澳白",
    "drink.latte": "拿鐵",
    "drink.latte.so": "單品拿鐵",
    "drink.latte.honey": "蜂蜜咖啡拿鐵",
    "drink.romano": "橙香西西里",
    "drink.osmanthus": "桂花咖啡歐蕾",
    "drink.piccolo.note": "100ml 附餅乾，限內用",
    "drink.cortado.note": "100ml 附餅乾，限內用",

    // Other Drinks
    "drinks.title": "其他飲品",
    "drinks.title.en": "Other Drinks",
    "drink.chocolate": "可可",
    "drink.taiwan.tea": "台灣高山茶",
    "drink.taiwan.tea.note": "阿里山金萱、杉林溪凍頂烏龍",
    "drink.wuhe.tea": "舞鶴蜜香紅茶",
    "drink.matcha": "抹茶拿鐵",
    "drink.hojicha": "焙茶拿鐵",
    "drink.apple": "蘋果氣泡飲",

    // Dessert
    "dessert.title": "點心",
    "dessert.title.en": "Dessert",
    "dessert.cheesecake": "烤乳酪蛋糕",
    "dessert.cheesecake.passion": "百香果起司蛋糕",
    "dessert.bagel.cheese": "貝果 (起司)",
    "dessert.bagel.sesame": "貝果 (黑芝麻)",
    "dessert.bagel.grains": "貝果 (雜糧)",
    "dessert.croissant": "可頌",
    "dessert.cinnamon": "肉桂卷",
    "dessert.quiche": "鹹派",
    "dessert.palmiers": "手工蝴蝶酥",

    // Contact
    "contact.title": "聯絡我們",
    "contact.title.en": "Contact",
    "contact.address": "地址",
    "contact.address.value": "花蓮縣花蓮市中美路19號",
    "contact.hours": "營業時間",
    "contact.hours.value": "10:00～18:00（每週二店休）",
    "contact.phone": "電話",

    // Common
    "common.limited": "限量供應",
    "common.dine-in": "限內用",
    "common.hot-cold": "冰熱皆宜",
    "common.popular": "本館人氣冠軍",

    // Roast Levels
    "roast.light": "淺焙",
    "roast.light-medium": "淺中焙",
    "roast.medium": "中焙",

    // Flavor Notes
    "flavor.melon": "甜瓜",
    "flavor.peach": "蜜桃",
    "flavor.bergamot": "佛手柑",
    "flavor.berry": "莓果",
    "flavor.violet": "紫羅蘭",
    "flavor.floral": "淡雅花香",
    "flavor.chocolate": "巧克力",
    "flavor.citrus": "柑橘",
    "flavor.peanut": "炒花生",
    "flavor.blackberry": "黑莓",
    "flavor.grapefruit": "葡萄柚",
    "flavor.hawthorn": "仙楂",
    "flavor.roselle": "洛神",
    "flavor.brown.sugar": "紅糖",
    "flavor.caramel": "焦糖",
    "flavor.almond": "杏仁",
    "flavor.dark.chocolate": "黑巧克力",
    "flavor.butter": "奶油",
    "flavor.grass.jelly": "仙草乾",
    "flavor.strawberry": "草莓",
    "flavor.white.peach": "白桃",
    "flavor.water.peach": "水蜜桃",
    "flavor.tropical": "熱帶水果",
    "flavor.flower": "花香",
    "flavor.jasmine": "茉莉花",
    "flavor.plum": "雪梅",
    "flavor.honey": "蜂蜜",
    "flavor.choco.cream": "巧克力奶油香氣",
    "flavor.cantaloupe": "哈密瓜",
    "flavor.cranberry": "蔓越莓",
    "flavor.raspberry": "覆盆莓",
    "flavor.purple.floral": "紫色花香",
    "flavor.wine": "酒香",
    "flavor.lychee": "荔枝",
    "flavor.yogurt": "乳酸飲料",
    "flavor.rose": "玫瑰香氣",
    "flavor.currant": "黑嘉麗軟糖",
    "flavor.hazelnut": "榛果巧克力",
    "flavor.syrup": "糖漿",

    // Shop page
    "shop.back-home": "回首頁",
    "shop.hero.label": "精選咖啡豆",
    "shop.hero.title": "咖啡豆專區",
    "shop.hero.sub": "自家烘焙・每包 200g・滿 NT$1,500 免運",
    "shop.fb.latest": "查看最新豆單 · Latest Bean Updates",
    "shop.product.coming-soon": "敬請期待線上選購",
    "shop.cart.title": "購物車",
    "shop.cart.empty": "購物車是空的",
    "shop.cart.subtotal": "小計",
    "shop.cart.shipping": "運費",
    "shop.cart.total": "合計",
    "shop.cart.free": "免運",
    "shop.cart.free-ok": "已達免運門檻！",
    "shop.cart.free-note": "再加購 NT$ {diff} 即可免運",
    "shop.checkout.title": "收件資訊",
    "shop.checkout.name": "姓名 *",
    "shop.checkout.phone": "手機 *",
    "shop.checkout.email": "電子郵件 *",
    "shop.checkout.shipping-method": "配送方式 *",
    "shop.checkout.delivery": "宅配到府 NT$100",
    "shop.checkout.cvs": "超商取貨 NT$60",
    "shop.checkout.store": "店取 免費",
    "shop.checkout.address": "收件地址 *",
    "shop.checkout.cvs-store": "超商門市 *",
    "shop.checkout.cvs-select": "-- 請選擇超商 --",
    "shop.checkout.note": "備註",
    "shop.checkout.btn": "前往付款",
    "shop.checkout.processing": "處理中...",
    "shop.checkout.ecpay":
      "付款由 綠界 ECPay 處理・支援信用卡、ATM、超商付款、LINE Pay",
    "shop.product.grind": "研磨",
    "shop.product.add": "加入購物車",
    "shop.product.sold-out": "已售完",
    "shop.grind.whole_bean": "原豆",
    "shop.grind.coarse": "粗研磨（法壓/冷萃）",
    "shop.grind.medium": "中研磨（手沖）",
    "shop.grind.fine": "細研磨（義式）",
  },

  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.single-origin": "Single Origin",
    "nav.espresso": "Espresso",
    "nav.drinks": "Drinks",
    "nav.dessert": "Dessert",
    "nav.contact": "Contact",
    "nav.shop": "Online Shop",

    // Demo Banner
    // Hero
    "hero.title": "Cuore Coffee Roaster",
    "hero.subtitle": "CUORE COFFEE ROASTER",
    "hero.tagline": "Roasted with Heart, Crafted with Soul",
    "hero.cta": "View Menu",

    // About
    "about.title": "About Us",
    "about.title.en": "About Us",
    "about.desc1":
      "Cuore Coffee Roaster is a specialty coffee roastery nestled in Hualien, dedicated to sourcing premium green beans from around the world and bringing out each coffee's unique character through expert roasting.",
    "about.desc2":
      "Whether you crave the fruity, floral notes of a light-roasted single origin or the rich depth of a medium-dark roast, you'll find your perfect cup at Cuore.",
    "about.feature1": "Select Origins",
    "about.feature2": "In-House Roasting",
    "about.feature3": "Brewed with Care",

    // Single Origin
    "single-origin.title": "Single Origin",
    "single-origin.title.en": "Single Origin",
    "single-origin.iced-note": "Iced Pour-Over +NT$20",
    "single-origin.category": "Select Single Origin",
    "single-origin.seasonal": "Seasonal Special",
    "single-origin.seasonal.en": "Seasonal Special",

    // Single Origin Coffee Names
    "coffee.a.name": "Cuore Special Blend Coffee",
    "coffee.a.origin": "Ethiopia Sidamo (Washed), Shakiso (Natural)",
    "coffee.a.process": "Washed / Natural",
    "coffee.b.name": "Guatemala Antigua Bella Carmona Classico",
    "coffee.b.origin": "Guatemala Antigua",
    "coffee.b.process": "Washed",
    "coffee.c.name": "Kenya Nyeri Wakamata Washed AA",
    "coffee.c.origin": "Kenya, Variety: SL28, SL34",
    "coffee.c.process": "Washed AA",
    "coffee.d.name": "Indonesia Sumatra Gayo Golden Mandheling",
    "coffee.d.origin": "Indonesia Sumatra",
    "coffee.d.process": "Giling Basah",
    "coffee.d.desc": "Rich milky aroma with nutty notes",
    "coffee.e.name": "Ethiopia Sidamo Bona Zuria 74110 G1",
    "coffee.e.origin": "Ethiopia Sidamo",
    "coffee.e.process": "Specialized Washed",

    // Seasonal Specials
    "special.1.name": "Ethiopia Guji Dimtu Hambella Wate Buku G1",
    "special.1.award": "2025 Africa Washed Category Champion",
    "special.1.origin": "Ethiopia Guji",
    "special.1.process": "Washed",
    "special.2.name": "Ethiopia Sidamo Bensa Karamo Natural",
    "special.2.award": "Ethiopia Natural Category Annual Champion",
    "special.2.origin": "Ethiopia Sidamo Bensa",
    "special.2.process": "Natural",
    "special.3.name": "Colombia Cauca Finca El Paraiso",
    "special.3.badge": "House Favorite",
    "special.3.origin": "Colombia Cauca",
    "special.3.process": "Double Anaerobic",
    "special.3.note": "Great hot or iced",
    "special.4.name": "Guatemala El Injerto Top Bourbon",
    "special.4.award": "Guatemala's most awarded estate",
    "special.4.origin": "Guatemala Huehuetenango El Injerto SHB",
    "special.4.process": "Bourbon Washed",
    "special.5.name": "Ethiopia Sidamo 74158 Natural",
    "special.5.note": "Classic Sidamo natural process",
    "special.5.origin": "Ethiopia Sidamo",
    "special.5.process": "Natural",

    // Espresso
    "espresso.title": "Espresso",
    "espresso.title.en": "Espresso Based",

    // Espresso Drinks
    "drink.coldbrew": "Cold Brew",
    "drink.milkbrew": "Milk Brew",
    "drink.americano": "Americano",
    "drink.shakerato": "Shakerato",
    "drink.espresso": "Espresso",
    "drink.piccolo": "Piccolo",
    "drink.cortado": "Cortado",
    "drink.cappuccino": "Cappuccino",
    "drink.cappuccino.so": "Cappuccino (Single Origin)",
    "drink.cappuccino.marble": "Marbling Cappuccino",
    "drink.flatwhite": "Flat White",
    "drink.latte": "Coffee Latte",
    "drink.latte.so": "Coffee Latte (Single Origin)",
    "drink.latte.honey": "Cafe Latte Con Miel",
    "drink.romano": "Espresso Romano",
    "drink.osmanthus": "Osmanthus Cafe au Lait",
    "drink.piccolo.note": "100ml with cookies, Dine-in Only",
    "drink.cortado.note": "100ml with cookies, Dine-in Only",

    // Other Drinks
    "drinks.title": "Drinks",
    "drinks.title.en": "Other Drinks",
    "drink.chocolate": "Chocolate Milk",
    "drink.taiwan.tea": "Taiwan High Mountain Tea",
    "drink.taiwan.tea.note": "Alishan Jinxuan, Shanlinxi Frozen Top Oolong",
    "drink.wuhe.tea": "Hualien Wuhe Honey Scented Black Tea",
    "drink.matcha": "Matcha Latte",
    "drink.hojicha": "Hojicha Latte",
    "drink.apple": "Apple Sparkling",

    // Dessert
    "dessert.title": "Dessert",
    "dessert.title.en": "Dessert",
    "dessert.cheesecake": "Cheese Cake",
    "dessert.cheesecake.passion": "Cheese Cake (Passion Fruit)",
    "dessert.bagel.cheese": "Bagel (Cheese)",
    "dessert.bagel.sesame": "Bagel (Black Sesame)",
    "dessert.bagel.grains": "Bagel (Grains)",
    "dessert.croissant": "Croissant",
    "dessert.cinnamon": "Cinnamon Roll",
    "dessert.quiche": "Quiche",
    "dessert.palmiers": "Handmade Palmiers",

    // Contact
    "contact.title": "Contact",
    "contact.title.en": "Contact",
    "contact.address": "Address",
    "contact.address.value":
      "No. 19, Zhongmei Rd., Hualien City, Hualien County",
    "contact.hours": "Hours",
    "contact.hours.value": "10:00–18:00 (Closed on Tuesdays)",
    "contact.phone": "Phone",

    // Common
    "common.limited": "Limited Supply",
    "common.dine-in": "Dine-in Only",
    "common.hot-cold": "Great hot or iced",
    "common.popular": "House Favorite",

    // Roast Levels
    "roast.light": "Light",
    "roast.light-medium": "Light-Medium",
    "roast.medium": "Medium",

    // Flavor Notes
    "flavor.melon": "Melon",
    "flavor.peach": "Peach",
    "flavor.bergamot": "Bergamot",
    "flavor.berry": "Berry",
    "flavor.violet": "Violet",
    "flavor.floral": "Floral",
    "flavor.chocolate": "Chocolate",
    "flavor.citrus": "Citrus",
    "flavor.peanut": "Peanut",
    "flavor.blackberry": "Blackberry",
    "flavor.grapefruit": "Grapefruit",
    "flavor.hawthorn": "Hawthorn",
    "flavor.roselle": "Roselle",
    "flavor.brown.sugar": "Brown Sugar",
    "flavor.caramel": "Caramel",
    "flavor.almond": "Almond",
    "flavor.dark.chocolate": "Dark Chocolate",
    "flavor.butter": "Butter",
    "flavor.grass.jelly": "Grass Jelly",
    "flavor.strawberry": "Strawberry",
    "flavor.white.peach": "White Peach",
    "flavor.water.peach": "Peach",
    "flavor.tropical": "Tropical Fruits",
    "flavor.flower": "Floral",
    "flavor.jasmine": "Jasmine",
    "flavor.plum": "Plum",
    "flavor.honey": "Honey",
    "flavor.choco.cream": "Chocolate Cream",
    "flavor.cantaloupe": "Cantaloupe",
    "flavor.cranberry": "Cranberry",
    "flavor.raspberry": "Raspberry",
    "flavor.purple.floral": "Purple Floral",
    "flavor.wine": "Winey",
    "flavor.lychee": "Lychee",
    "flavor.yogurt": "Lactic Acid Drink",
    "flavor.rose": "Rose",
    "flavor.currant": "Blackcurrant",
    "flavor.hazelnut": "Hazelnut Chocolate",
    "flavor.syrup": "Syrup",

    // Shop page
    "shop.back-home": "Back to Home",
    "shop.hero.label": "Select Coffee Beans",
    "shop.hero.title": "Coffee Beans",
    "shop.hero.sub":
      "In-house roasted · 200g per bag · Free shipping over NT$1,500",
    "shop.fb.latest": "Latest Bean Updates on Facebook",
    "shop.product.coming-soon": "Coming Soon",
    "shop.cart.title": "Cart",
    "shop.cart.empty": "Your cart is empty",
    "shop.cart.subtotal": "Subtotal",
    "shop.cart.shipping": "Shipping",
    "shop.cart.total": "Total",
    "shop.cart.free": "Free",
    "shop.cart.free-ok": "Free shipping applied!",
    "shop.cart.free-note": "Add NT$ {diff} more for free shipping",
    "shop.checkout.title": "Shipping Info",
    "shop.checkout.name": "Name *",
    "shop.checkout.phone": "Mobile *",
    "shop.checkout.email": "Email *",
    "shop.checkout.shipping-method": "Delivery Method *",
    "shop.checkout.delivery": "Home Delivery NT$100",
    "shop.checkout.cvs": "CVS Pickup NT$60",
    "shop.checkout.store": "In-store Pickup Free",
    "shop.checkout.address": "Delivery Address *",
    "shop.checkout.cvs-store": "Convenience Store *",
    "shop.checkout.cvs-select": "-- Select store --",
    "shop.checkout.note": "Notes",
    "shop.checkout.btn": "Proceed to Pay",
    "shop.checkout.processing": "Processing...",
    "shop.checkout.ecpay":
      "Payment by ECPay · Credit card, ATM, CVS payment, LINE Pay",
    "shop.product.grind": "Grind",
    "shop.product.add": "Add to Cart",
    "shop.product.sold-out": "Sold Out",
    "shop.grind.whole_bean": "Whole Bean",
    "shop.grind.coarse": "Coarse (French Press / Cold Brew)",
    "shop.grind.medium": "Medium (Pour Over)",
    "shop.grind.fine": "Fine (Espresso)",
  },

  ja: {
    // Navigation
    "nav.home": "ホーム",
    "nav.about": "私たちについて",
    "nav.single-origin": "シングルオリジン",
    "nav.espresso": "エスプレッソ",
    "nav.drinks": "その他のドリンク",
    "nav.dessert": "デザート",
    "nav.contact": "お問い合わせ",
    "nav.shop": "オンラインショップ",

    // Demo Banner
    // Hero
    "hero.title": "クオーレ スペシャルティコーヒー",
    "hero.subtitle": "CUORE COFFEE ROASTER",
    "hero.tagline": "心を込めて焙煎・味わう暮らし",
    "hero.cta": "メニューを見る",

    // About
    "about.title": "クオーレについて",
    "about.title.en": "About Us",
    "about.desc1":
      "クオーレスペシャルティコーヒーは花蓮にある自家焙煎のスペシャルティコーヒー専門店です。世界各地から厳選した高品質の生豆を、専門的な焙煎技術でそれぞれのコーヒーの独特な風味を引き出します。",
    "about.desc2":
      "フルーティーでフローラルな浅煎りのシングルオリジンから、コクと深みのある中深煎りまで、クオーレであなたにぴったりの一杯を見つけてください。",
    "about.feature1": "厳選産地",
    "about.feature2": "自家焙煎",
    "about.feature3": "丁寧な抽出",

    // Single Origin
    "single-origin.title": "シングルオリジン",
    "single-origin.title.en": "Single Origin",
    "single-origin.iced-note": "アイスプアオーバー +NT$20",
    "single-origin.category": "厳選シングルオリジン",
    "single-origin.seasonal": "季節限定・希少オークション",
    "single-origin.seasonal.en": "Seasonal Special",

    // Single Origin Coffee Names
    "coffee.a.name": "クオーレ特選——《2025 西夏の花》",
    "coffee.a.origin": "エチオピア シダモ、シャキソ",
    "coffee.a.process": "ウォッシュド、ナチュラル",
    "coffee.b.name": "《アンティグア クラシックフローラル》",
    "coffee.b.origin": "グアテマラ アンティグア ベラカルモナ農園",
    "coffee.b.process": "クラシックウォッシュド",
    "coffee.c.name": "《ケニア AA ニエリ ブルー》",
    "coffee.c.origin": "ケニア｜SL28、SL34",
    "coffee.c.process": "ケニア式ウォッシュド",
    "coffee.d.name": "《ガヨ ゴールデン マンデリン》20目",
    "coffee.d.origin": "インドネシア スマトラ アチェ ガヨ",
    "coffee.d.process": "スマトラ式",
    "coffee.d.desc": "濃厚なミルク香とナッツ",
    "coffee.e.name": "《ボナ リトルパール》74110",
    "coffee.e.origin": "エチオピア シダモ ボナ",
    "coffee.e.process": "マウンテンウォーター ウォッシュド",

    // Seasonal Specials
    "special.1.name": "《グジ ブク ワテ》",
    "special.1.award": "2025 アフリカ ウォッシュド部門 チャンピオン",
    "special.1.origin": "エチオピア グジ",
    "special.1.process": "ウォッシュド",
    "special.2.name": "《パープル クラモ》",
    "special.2.award": "エチオピア ナチュラル部門 年間チャンピオン",
    "special.2.origin": "エチオピア シダモ ベンサ",
    "special.2.process": "ナチュラル",
    "special.3.name": "《サマーライチ》",
    "special.3.badge": "当店人気No.1",
    "special.3.origin": "コロンビア カウカ パライソ農園",
    "special.3.process": "ダブル アナエロビック",
    "special.3.note": "ホット・アイス共にOK",
    "special.4.name": "《インヘルト トップバーボン》",
    "special.4.award": "グアテマラ最多受賞農園",
    "special.4.origin": "グアテマラ ウエウエテナンゴ インヘルト農園 SHB",
    "special.4.process": "ウォッシュド",
    "special.5.name": "《エルアルト マスターピース》",
    "special.5.note": "シダモ産地の定番ナチュラル",
    "special.5.origin": "エチオピア シダモ｜品種：74158",
    "special.5.process": "ナチュラル",

    // Espresso
    "espresso.title": "エスプレッソ",
    "espresso.title.en": "Espresso Based",

    // Espresso Drinks
    "drink.coldbrew": "コールドブリュー",
    "drink.milkbrew": "ミルクブリュー",
    "drink.americano": "アメリカーノ",
    "drink.shakerato": "シェケラート",
    "drink.espresso": "エスプレッソ",
    "drink.piccolo": "ピッコロ",
    "drink.cortado": "コルタード",
    "drink.cappuccino": "カプチーノ",
    "drink.cappuccino.so": "シングルオリジン カプチーノ",
    "drink.cappuccino.marble": "マーブルカプチーノ",
    "drink.flatwhite": "フラットホワイト",
    "drink.latte": "カフェラテ",
    "drink.latte.so": "シングルオリジン ラテ",
    "drink.latte.honey": "ハニーカフェラテ",
    "drink.romano": "エスプレッソロマーノ",
    "drink.osmanthus": "金木犀カフェオレ",
    "drink.piccolo.note": "100ml クッキー付き、店内限定",
    "drink.cortado.note": "100ml クッキー付き、店内限定",

    // Other Drinks
    "drinks.title": "その他のドリンク",
    "drinks.title.en": "Other Drinks",
    "drink.chocolate": "ホットチョコレート",
    "drink.taiwan.tea": "台湾高山茶",
    "drink.taiwan.tea.note": "阿里山金萱、杉林渓凍頂ウーロン",
    "drink.wuhe.tea": "舞鶴ハニー紅茶",
    "drink.matcha": "抹茶ラテ",
    "drink.hojicha": "ほうじ茶ラテ",
    "drink.apple": "アップルスパークリング",

    // Dessert
    "dessert.title": "デザート",
    "dessert.title.en": "Dessert",
    "dessert.cheesecake": "ベイクドチーズケーキ",
    "dessert.cheesecake.passion": "パッションフルーツチーズケーキ",
    "dessert.bagel.cheese": "ベーグル (チーズ)",
    "dessert.bagel.sesame": "ベーグル (黒ごま)",
    "dessert.bagel.grains": "ベーグル (雑穀)",
    "dessert.croissant": "クロワッサン",
    "dessert.cinnamon": "シナモンロール",
    "dessert.quiche": "キッシュ",
    "dessert.palmiers": "手作りパルミエ",

    // Contact
    "contact.title": "お問い合わせ",
    "contact.title.en": "Contact",
    "contact.address": "住所",
    "contact.address.value": "花蓮縣花蓮市中美路19號",
    "contact.hours": "営業時間",
    "contact.hours.value": "10:00 - 18:00（毎週火曜定休）",
    "contact.phone": "電話",

    // Common
    "common.limited": "数量限定",
    "common.dine-in": "店内限定",
    "common.hot-cold": "ホット・アイス両方OK",
    "common.popular": "当店人気No.1",

    // Roast Levels
    "roast.light": "浅煎り",
    "roast.light-medium": "浅中煎り",
    "roast.medium": "中煎り",

    // Flavor Notes
    "flavor.melon": "メロン",
    "flavor.peach": "ピーチ",
    "flavor.bergamot": "ベルガモット",
    "flavor.berry": "ベリー",
    "flavor.violet": "バイオレット",
    "flavor.floral": "フローラル",
    "flavor.chocolate": "チョコレート",
    "flavor.citrus": "シトラス",
    "flavor.peanut": "ピーナッツ",
    "flavor.blackberry": "ブラックベリー",
    "flavor.grapefruit": "グレープフルーツ",
    "flavor.hawthorn": "サンザシ",
    "flavor.roselle": "ハイビスカス",
    "flavor.brown.sugar": "黒糖",
    "flavor.caramel": "キャラメル",
    "flavor.almond": "アーモンド",
    "flavor.dark.chocolate": "ダークチョコレート",
    "flavor.butter": "バター",
    "flavor.grass.jelly": "仙草ゼリー",
    "flavor.strawberry": "ストロベリー",
    "flavor.white.peach": "白桃",
    "flavor.water.peach": "ジューシーピーチ",
    "flavor.tropical": "トロピカルフルーツ",
    "flavor.flower": "花の香り",
    "flavor.jasmine": "ジャスミン",
    "flavor.plum": "梅",
    "flavor.honey": "ハチミツ",
    "flavor.choco.cream": "チョコレートクリーム",
    "flavor.cantaloupe": "メロン",
    "flavor.cranberry": "クランベリー",
    "flavor.raspberry": "ラズベリー",
    "flavor.purple.floral": "紫の花",
    "flavor.wine": "ワイン",
    "flavor.lychee": "ライチ",
    "flavor.yogurt": "ヨーグルト",
    "flavor.rose": "ローズ",
    "flavor.currant": "カシス",
    "flavor.hazelnut": "ヘーゼルナッツチョコ",
    "flavor.syrup": "シロップ",
  },

  ko: {
    // Navigation
    "nav.home": "홈",
    "nav.about": "소개",
    "nav.single-origin": "싱글 오리진",
    "nav.espresso": "에스프레소",
    "nav.drinks": "기타 음료",
    "nav.dessert": "디저트",
    "nav.contact": "연락처",
    "nav.shop": "온라인 쇼핑",

    // Demo Banner
    // Hero
    "hero.title": "쿠오레 스페셜티 커피",
    "hero.subtitle": "CUORE COFFEE ROASTER",
    "hero.tagline": "정성을 담아 로스팅・삶의 맛",
    "hero.cta": "메뉴 보기",

    // About
    "about.title": "쿠오레 소개",
    "about.title.en": "About Us",
    "about.desc1":
      "쿠오레 스페셜티 커피는 화롄에 위치한 자가 로스팅 스페셜티 커피 전문점입니다. 전 세계에서 엄선한 고품질 생두를 전문적인 로스팅 기술로 각 커피만의 독특한 풍미를 선보입니다.",
    "about.desc2":
      "과일향과 꽃향이 풍부한 라이트 로스트 싱글 오리진부터 진하고 깊은 미디엄-다크 로스트까지, 쿠오레에서 당신에게 딱 맞는 한 잔을 찾아보세요.",
    "about.feature1": "엄선된 산지",
    "about.feature2": "자가 로스팅",
    "about.feature3": "정성스러운 추출",

    // Single Origin
    "single-origin.title": "싱글 오리진",
    "single-origin.title.en": "Single Origin",
    "single-origin.iced-note": "아이스 핸드드립 +NT$20",
    "single-origin.category": "엄선 싱글 오리진",
    "single-origin.seasonal": "시즌 한정・희귀 경매",
    "single-origin.seasonal.en": "Seasonal Special",

    // Single Origin Coffee Names
    "coffee.a.name": "쿠오레 스페셜——《2025 서하의 꽃》",
    "coffee.a.origin": "에티오피아 시다모, 샤키소",
    "coffee.a.process": "워시드, 내추럴",
    "coffee.b.name": "《안티구아 클래식 플로럴》",
    "coffee.b.origin": "과테말라 안티구아 벨라카르모나 농장",
    "coffee.b.process": "클래식 워시드",
    "coffee.c.name": "《케냐 AA 니에리 블루》",
    "coffee.c.origin": "케냐｜SL28, SL34",
    "coffee.c.process": "케냐식 워시드",
    "coffee.d.name": "《가요 골든 만델링》20목",
    "coffee.d.origin": "인도네시아 수마트라 아체 가요",
    "coffee.d.process": "수마트라 프로세스",
    "coffee.d.desc": "진한 밀크향과 견과류",
    "coffee.e.name": "《보나 리틀펄》74110",
    "coffee.e.origin": "에티오피아 시다모 보나",
    "coffee.e.process": "마운틴 워터 워시드",

    // Seasonal Specials
    "special.1.name": "《구지 부쿠 와테》",
    "special.1.award": "2025 아프리카 워시드 부문 챔피언",
    "special.1.origin": "에티오피아 구지",
    "special.1.process": "워시드",
    "special.2.name": "《퍼플 크라모》",
    "special.2.award": "에티오피아 내추럴 부문 연간 챔피언",
    "special.2.origin": "에티오피아 시다모 벤사",
    "special.2.process": "내추럴",
    "special.3.name": "《썸머 라이치》",
    "special.3.badge": "인기 1위",
    "special.3.origin": "콜롬비아 카우카 파라이소 농장",
    "special.3.process": "더블 애너로빅",
    "special.3.note": "핫/아이스 모두 가능",
    "special.4.name": "《인헤르토 탑 버번》",
    "special.4.award": "과테말라 최다 수상 농장",
    "special.4.origin": "과테말라 우에우에테낭고 인헤르토 농장 SHB",
    "special.4.process": "워시드",
    "special.5.name": "《엘 알토 마스터피스》",
    "special.5.note": "시다모 산지 클래식 내추럴",
    "special.5.origin": "에티오피아 시다모｜품종: 74158",
    "special.5.process": "내추럴",

    // Espresso
    "espresso.title": "에스프레소",
    "espresso.title.en": "Espresso Based",

    // Espresso Drinks
    "drink.coldbrew": "콜드브루",
    "drink.milkbrew": "밀크브루",
    "drink.americano": "아메리카노",
    "drink.shakerato": "쉐케라토",
    "drink.espresso": "에스프레소",
    "drink.piccolo": "피콜로",
    "drink.cortado": "코르타도",
    "drink.cappuccino": "카푸치노",
    "drink.cappuccino.so": "싱글 오리진 카푸치노",
    "drink.cappuccino.marble": "마블 카푸치노",
    "drink.flatwhite": "플랫 화이트",
    "drink.latte": "카페라떼",
    "drink.latte.so": "싱글 오리진 라떼",
    "drink.latte.honey": "허니 카페라떼",
    "drink.romano": "에스프레소 로마노",
    "drink.osmanthus": "금목서 카페오레",
    "drink.piccolo.note": "100ml 쿠키 포함, 매장 전용",
    "drink.cortado.note": "100ml 쿠키 포함, 매장 전용",

    // Other Drinks
    "drinks.title": "기타 음료",
    "drinks.title.en": "Other Drinks",
    "drink.chocolate": "핫초코",
    "drink.taiwan.tea": "대만 고산차",
    "drink.taiwan.tea.note": "아리산 금훤, 삼림계 동정우롱",
    "drink.wuhe.tea": "우허 허니 홍차",
    "drink.matcha": "말차 라떼",
    "drink.hojicha": "호지차 라떼",
    "drink.apple": "애플 스파클링",

    // Dessert
    "dessert.title": "디저트",
    "dessert.title.en": "Dessert",
    "dessert.cheesecake": "베이크드 치즈케이크",
    "dessert.cheesecake.passion": "패션프루트 치즈케이크",
    "dessert.bagel.cheese": "베이글 (치즈)",
    "dessert.bagel.sesame": "베이글 (흑임자)",
    "dessert.bagel.grains": "베이글 (잡곡)",
    "dessert.croissant": "크루아상",
    "dessert.cinnamon": "시나몬롤",
    "dessert.quiche": "키슈",
    "dessert.palmiers": "수제 팔미에",

    // Contact
    "contact.title": "연락처",
    "contact.title.en": "Contact",
    "contact.address": "주소",
    "contact.address.value": "화롄현 화롄시 중메이로 19번지",
    "contact.hours": "영업시간",
    "contact.hours.value": "10:00 - 18:00 (매주 화요일 정기휴무)",
    "contact.phone": "전화",

    // Common
    "common.limited": "한정 수량",
    "common.dine-in": "매장 전용",
    "common.hot-cold": "핫/아이스 모두 가능",
    "common.popular": "인기 1위",

    // Roast Levels
    "roast.light": "라이트 로스트",
    "roast.light-medium": "라이트-미디엄 로스트",
    "roast.medium": "미디엄 로스트",

    // Flavor Notes
    "flavor.melon": "멜론",
    "flavor.peach": "복숭아",
    "flavor.bergamot": "베르가못",
    "flavor.berry": "베리",
    "flavor.violet": "바이올렛",
    "flavor.floral": "꽃향",
    "flavor.chocolate": "초콜릿",
    "flavor.citrus": "시트러스",
    "flavor.peanut": "땅콩",
    "flavor.blackberry": "블랙베리",
    "flavor.grapefruit": "자몽",
    "flavor.hawthorn": "산사",
    "flavor.roselle": "히비스커스",
    "flavor.brown.sugar": "흑설탕",
    "flavor.caramel": "카라멜",
    "flavor.almond": "아몬드",
    "flavor.dark.chocolate": "다크 초콜릿",
    "flavor.butter": "버터",
    "flavor.grass.jelly": "선초 젤리",
    "flavor.strawberry": "딸기",
    "flavor.white.peach": "백도",
    "flavor.water.peach": "물복숭아",
    "flavor.tropical": "열대과일",
    "flavor.flower": "꽃향기",
    "flavor.jasmine": "자스민",
    "flavor.plum": "매실",
    "flavor.honey": "꿀",
    "flavor.choco.cream": "초콜릿 크림",
    "flavor.cantaloupe": "캔탈루프",
    "flavor.cranberry": "크랜베리",
    "flavor.raspberry": "라즈베리",
    "flavor.purple.floral": "보라색 꽃향",
    "flavor.wine": "와인",
    "flavor.lychee": "리치",
    "flavor.yogurt": "요거트",
    "flavor.rose": "장미",
    "flavor.currant": "카시스",
    "flavor.hazelnut": "헤이즐넛 초콜릿",
    "flavor.syrup": "시럽",
  },
};

// Current language
let currentLang = localStorage.getItem("cuore-lang") || "zh-TW";

/**
 * Set the current language and update all translated elements
 * @param {string} lang - Language code (zh-TW, en, ja, ko)
 */
function setLanguage(lang) {
  if (!translations[lang]) {
    console.warn(`Language "${lang}" not supported`);
    return;
  }

  currentLang = lang;
  document.documentElement.lang = lang;
  localStorage.setItem("cuore-lang", lang);

  // Update all elements with data-i18n attribute
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang][key]) {
      // Check if content contains HTML
      if (translations[lang][key].includes("<")) {
        el.innerHTML = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });

  // Update active state of language buttons
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
  });

  // Update document title based on language
  const titles = {
    "zh-TW": "科雷精品咖啡館 Cuore Coffee Roaster",
    en: "Cuore Coffee Roaster | Specialty Coffee in Hualien",
    ja: "クオーレ スペシャルティコーヒー | Cuore Coffee Roaster",
    ko: "쿠오레 스페셜티 커피 | Cuore Coffee Roaster",
  };
  document.title = titles[lang] || titles["zh-TW"];

  // Notify other scripts (e.g. cart.js) that the language changed
  window.dispatchEvent(
    new CustomEvent("cuore-lang-change", { detail: { lang } }),
  );
}

/**
 * Get translation for a key
 * @param {string} key - Translation key
 * @param {string} [lang] - Language code (optional, uses current language if not provided)
 * @returns {string} Translated text or key if not found
 */
function t(key, lang = currentLang) {
  return translations[lang]?.[key] || key;
}

/**
 * Initialize i18n on page load
 */
function initI18n() {
  // Set initial language from localStorage or browser preference
  const savedLang = localStorage.getItem("cuore-lang");
  const browserLang = navigator.language;

  let initialLang = "zh-TW";

  if (savedLang && translations[savedLang]) {
    initialLang = savedLang;
  } else if (browserLang.startsWith("en")) {
    initialLang = "en";
  } else if (browserLang.startsWith("ja")) {
    initialLang = "ja";
  } else if (browserLang.startsWith("ko")) {
    initialLang = "ko";
  }

  // Add click handlers to language buttons
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      setLanguage(lang);
    });
  });

  // Set initial language
  setLanguage(initialLang);
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", initI18n);

// Export for use in other scripts
window.i18n = {
  setLanguage,
  t,
  currentLang: () => currentLang,
  translations,
};
