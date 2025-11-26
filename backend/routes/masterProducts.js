import express from "express";
import MasterProduct from "../models/MasterProduct.js";
import Warehouse from "../models/Warehouse.js";
import { updateAllChannelsQty } from "../services/channelSyncService.js";

const router = express.Router();

/**
 * GET /api/master-products
 * Returns all master products with populated warehouse info
 */
router.get("/master-products", async (req, res) => {
  try {
    const products = await MasterProduct.find()
      .populate("locations.warehouse")
      .lean();
    
    // Add totalAvailable computed
    const enriched = products.map((p) => ({
      ...p,
      totalAvailable: (p.locations || []).reduce(
        (sum, loc) => sum + (loc.available || 0),
        0
      ),
    }));

    res.json({ success: true, products: enriched });
  } catch (err) {
    console.error("Master products fetch error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to load products" });
  }
});

/**
 * POST /api/master-products
 * Create a new master product
 */
router.post("/master-products", async (req, res) => {
  try {
    const {
      name,
      masterSku,
      price,
      variants = [],
      locations = [],
      channels = {},
    } = req.body;

    const product = await MasterProduct.create({
      name,
      masterSku,
      price,
      variants,
      locations,
      channels,
    });

    res.json({ success: true, product });
  } catch (err) {
    console.error("Master product create error:", err);
    res.status(500).json({ success: false, message: "Create failed" });
  }
});

/**
 * PATCH /api/master-products/:id/stock
 * Update stock for a specific location
 * body: { warehouseId, available, onHand, reserved }
 */
router.patch("/master-products/:id/stock", async (req, res) => {
  try {
    const { id } = req.params;
    const { warehouseId, available, onHand, reserved } = req.body;

    const product = await MasterProduct.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const loc = product.locations.find(
      (l) => l.warehouse.toString() === warehouseId
    );

    if (!loc) {
      return res
        .status(404)
        .json({ success: false, message: "Location not found on product" });
    }

    if (available !== undefined) loc.available = available;
    if (onHand !== undefined) loc.onHand = onHand;
    if (reserved !== undefined) loc.reserved = reserved;

    await product.save();

    // Recalculate total available across all locations
    const totalAvailable = product.locations.reduce(
      (sum, l) => sum + (l.available || 0),
      0
    );

    // 🔁 Push to all channels based on mapping
    await updateAllChannelsQty(product, totalAvailable);

    res.json({
      success: true,
      product,
      totalAvailable,
    });
  } catch (err) {
    console.error("Stock update error:", err);
    res.status(500).json({ success: false, message: "Stock update failed" });
  }
});

export default router;
