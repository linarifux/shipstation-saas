import express from "express";

import {
  getShopifyInventory,
  updateShopifyInventory,
  getShopifyLocations,
  syncInventoryFromMaster
} from "../controllers/shopifyController.js";

const router = express.Router();

/* ---------------- INVENTORY ---------------- */

// Get all Shopify products + inventory by location
router.get("/inventory", getShopifyInventory);

// Update a specific product's stock
router.post("/inventory/update", updateShopifyInventory);

// Sync Master Product stock into Shopify by SKU
router.post("/inventory/sync", syncInventoryFromMaster);


/* ---------------- LOCATIONS ---------------- */

// Get Shopify locations
router.get("/locations", getShopifyLocations);

export default router;
