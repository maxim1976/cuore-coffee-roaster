const fs = require('fs').promises;
const path = require('path');

const ORDERS_DIR = path.join(__dirname, '..', 'orders');

async function ensureDir() {
  await fs.mkdir(ORDERS_DIR, { recursive: true });
}

async function saveOrder(order) {
  await ensureDir();
  const file = path.join(ORDERS_DIR, `${order.tradeNo}.json`);
  await fs.writeFile(file, JSON.stringify(order, null, 2), 'utf8');
}

async function updateOrder(tradeNo, updates) {
  const file = path.join(ORDERS_DIR, `${tradeNo}.json`);
  const existing = JSON.parse(await fs.readFile(file, 'utf8'));
  const updated = { ...existing, ...updates };
  await fs.writeFile(file, JSON.stringify(updated, null, 2), 'utf8');
  return updated;
}

async function getOrder(tradeNo) {
  const file = path.join(ORDERS_DIR, `${tradeNo}.json`);
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

module.exports = { saveOrder, updateOrder, getOrder };
