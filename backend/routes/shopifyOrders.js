import express from "express";
import { getAllShopifyOrders } from "../services/shopifyOrdersService.js";

const router = express.Router();

// GET /api/shopify/orders
router.get("/", async (req, res) => {
  try {
    const orders = await getAllShopifyOrders();
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
