import express from "express";
import Warehouse from "../models/Warehouse.js";
import MasterProduct from "../models/MasterProduct.js"; // ✅ Import MasterProduct

const router = express.Router();

/* ✅ GET ALL */
router.get("/", async (req, res) => {
  try {
    const warehouses = await Warehouse.find().sort({ createdAt: -1 });
    res.json({ success: true, warehouses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ✅ CREATE */
router.post("/", async (req, res) => {
  try {
    const warehouse = await Warehouse.create(req.body);
    res.json({ success: true, warehouse });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ✅ UPDATE */
router.put("/:id", async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, warehouse });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ✅ DELETE (Updated with Cleanup) */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Delete the Warehouse document
    const warehouse = await Warehouse.findByIdAndDelete(id);

    if (!warehouse) {
      return res.status(404).json({ success: false, message: "Warehouse not found" });
    }

    // 2. ✅ CLEANUP: Remove this warehouse from ALL Master Products
    // This prevents the "Unknown" card issue by removing the inventory entry entirely.
    await MasterProduct.updateMany(
      { "locations.warehouse": id },
      { $pull: { locations: { warehouse: id } } }
    );

    res.json({ success: true, message: "Warehouse deleted and inventory references removed." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ✅ ADD STOCK TO WAREHOUSE
router.post("/:id/add-stock", async (req, res) => {
  try {
    const { warehouseId, quantity } = req.body;

    const product = await MasterProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const existing = product.locations.find(
      (l) => l.warehouse.toString() === warehouseId
    );

    if (existing) {
      existing.available += Number(quantity);
      existing.onHand += Number(quantity);
    } else {
      product.locations.push({
        warehouse: warehouseId,
        available: Number(quantity),
        onHand: Number(quantity),
        reserved: 0,
      });
    }

    await product.save();

    res.json({ success: true, product });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update stock" });
  }
});

export default router;