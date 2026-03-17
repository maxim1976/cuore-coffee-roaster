const express = require("express");

const { getPublicRetailCatalog } = require("../services/pricing");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const catalog = await getPublicRetailCatalog();
    res.setHeader("Cache-Control", "public, max-age=300");
    res.json(catalog);
  } catch (error) {
    console.error("[catalog] Error:", error);
    res.status(500).json({ error: "Catalog unavailable" });
  }
});

module.exports = router;
