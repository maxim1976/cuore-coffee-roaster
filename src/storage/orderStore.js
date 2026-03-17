const fs = require("fs").promises;
const path = require("path");

const { ordersDir } = require("../config/env");

async function ensureDir() {
  await fs.mkdir(ordersDir, { recursive: true });
}

function getOrderFilePath(tradeNo) {
  const normalized = String(tradeNo || "")
    .trim()
    .toUpperCase();

  if (!/^[A-Z0-9]+$/.test(normalized)) {
    const error = new Error("Invalid trade number");
    error.statusCode = 400;
    throw error;
  }

  return path.join(ordersDir, `${normalized}.json`);
}

async function saveOrder(order) {
  await ensureDir();
  const filePath = getOrderFilePath(order.tradeNo);
  await fs.writeFile(filePath, JSON.stringify(order, null, 2), "utf8");
}

async function getOrder(tradeNo) {
  try {
    const filePath = getOrderFilePath(tradeNo);
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function updateOrder(tradeNo, updatesOrUpdater) {
  const existing = await getOrder(tradeNo);

  if (!existing) {
    return null;
  }

  const updates =
    typeof updatesOrUpdater === "function"
      ? updatesOrUpdater(existing)
      : updatesOrUpdater;
  const updated = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  const filePath = getOrderFilePath(tradeNo);

  await fs.writeFile(filePath, JSON.stringify(updated, null, 2), "utf8");

  return updated;
}

module.exports = {
  getOrder,
  saveOrder,
  updateOrder,
};
