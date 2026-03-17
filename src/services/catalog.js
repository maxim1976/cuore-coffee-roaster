const fs = require("fs").promises;

const { catalogPath } = require("../config/env");

const RETAIL_MENU_KEY = "咖啡豆零售 Coffee Beans Retail";

async function getCatalog() {
  const raw = await fs.readFile(catalogPath, "utf8");
  return JSON.parse(raw);
}

async function getRetailCatalog() {
  const catalog = await getCatalog();
  const retail = catalog.menu?.[RETAIL_MENU_KEY];

  if (!retail) {
    throw new Error(`Retail catalog section not found: ${RETAIL_MENU_KEY}`);
  }

  return retail;
}

module.exports = {
  RETAIL_MENU_KEY,
  getCatalog,
  getRetailCatalog,
};
