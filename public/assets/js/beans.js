(function () {
  const CATALOG_URL = "data/catalog/menu.json";
  const RETAIL_KEY  = "咖啡豆零售 Coffee Beans Retail";

  const ROAST = {
    light:        { zh: "淺焙",   en: "Light",       cls: "roast-light" },
    light_medium: { zh: "淺中焙", en: "Light-Medium", cls: "roast-light-med" },
    medium_light: { zh: "中淺焙", en: "Medium-Light", cls: "roast-light-med" },
    medium:       { zh: "中焙",   en: "Medium",       cls: "roast-medium" },
    medium_dark:  { zh: "中深焙", en: "Med-Dark",     cls: "roast-dark" },
  };

  function getLang() {
    const l = localStorage.getItem("cuore-lang") || "zh-TW";
    return ["zh-TW", "en", "ja", "ko"].includes(l) ? l : "zh-TW";
  }

  function isZh(lang) { return lang === "zh-TW"; }

  function t(key) {
    return window.i18n?.t(key, getLang()) ?? key;
  }

  function renderPromo(promo, lang) {
    if (!promo) return "";
    if (new Date() > new Date(promo.period_end + "T23:59:59")) return "";
    const zh = isZh(lang);
    const tiers = promo.tiers
      .map(tier => `<span class="bp-tier">${zh ? tier.label_zh : tier.label_en}</span>`)
      .join("");
    return `
      <div class="beans-promo">
        <div class="bp-head"><i class="fas fa-tag"></i> <strong>${zh ? promo.name_zh : promo.name_en}</strong></div>
        <p class="bp-desc">${zh ? promo.description_zh : promo.description_en}</p>
        <div class="bp-tiers">${tiers}</div>
        <p class="bp-note">※ ${zh ? promo.excludes_zh : promo.excludes_en}。${zh ? promo.note_zh : promo.note_en}。</p>
      </div>`;
  }

  function renderCard(product, lang) {
    const zh     = isZh(lang);
    const roast  = ROAST[product.roast_level] ?? { zh: product.roast_level_zh, en: product.roast_level, cls: "roast-medium" };
    const name   = zh ? product.name_zh   : product.name_en;
    const nameSub= zh ? product.name_en   : product.name_zh;
    const origin = zh ? product.origin_zh : product.origin_en;
    const process= zh ? product.process_zh: product.process_en;
    const flavor = zh ? product.flavor_zh : product.flavor_en;
    return `
      <article class="bean-card">
        <div class="bc-img-wrap">
          <img src="${product.image}" alt="${name}" class="bc-img"
               onerror="this.closest('.bc-img-wrap').classList.add('bc-img-wrap--empty')">
        </div>
        <div class="bc-body">
          <div class="bc-meta">
            <span class="bc-roast ${roast.cls}">${zh ? roast.zh : roast.en}</span>
            <span class="bc-price">NT$ ${product.price_NTD.toLocaleString()} <small>/200g</small></span>
          </div>
          <h3 class="bc-name">${name}</h3>
          <p class="bc-name-sub">${nameSub}</p>
          <p class="bc-detail"><i class="fas fa-map-marker-alt"></i> ${origin}</p>
          <p class="bc-detail"><i class="fas fa-cog"></i> ${process}</p>
          <p class="bc-flavor">${flavor}</p>
        </div>
      </article>`;
  }

  function render(retail, lang) {
    const promoEl = document.getElementById("beansPromo");
    const gridEl  = document.getElementById("beansGrid");
    if (promoEl) promoEl.innerHTML = renderPromo(retail.promotion, lang);
    if (gridEl)  gridEl.innerHTML  = retail.items.map(p => renderCard(p, lang)).join("");
  }

  async function init() {
    const gridEl = document.getElementById("beansGrid");
    if (!gridEl) return;

    let retail;
    try {
      const res = await fetch(CATALOG_URL);
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      retail = data.menu[RETAIL_KEY];
      if (!retail) throw new Error("retail section missing");
    } catch (e) {
      console.error("[beans] catalog load failed", e);
      gridEl.innerHTML = `<p class="beans-error">${t("beans.error")}</p>`;
      return;
    }

    render(retail, getLang());
    window.addEventListener("cuore-lang-change", () => render(retail, getLang()));
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
