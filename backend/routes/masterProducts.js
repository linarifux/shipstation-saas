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

/* ✅ ADD STOCK TO MASTER PRODUCT */

router.patch("/master-products/:id/add-stock", async (req, res) => {
  try {
    const { warehouseId, quantity } = req.body;

    const product = await MasterProduct.findById(req.params.id);



    const location = product.locations.find(
      l => String(l.warehouse) === String(warehouseId)
    );

    if (location) {
      location.onHand += quantity;
      location.available += quantity;
    } else {
      product.locations.push({
        warehouse: warehouseId,
        onHand: quantity,
        reserved: 0,
        available: quantity,
        safetyStock: 0
      });
    }

    await product.save();

    res.json({ success: true });
  } catch (err) {
    console.error("Server error:", err.response?.data || err.message);
  }

});


export default router;
