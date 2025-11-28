import MasterProduct from "../models/MasterProduct.js";
import axios from "axios";

const STORE = process.env.SHOPIFY_STORE_URL;
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const BASE = `https://${STORE}/admin/api/2024-01`;

/**
 * ✅ GET /api/master-products
 * - Internal warehouses
 * - Total available
 * - Shopify locations + name + stock
 */
export const getAllMasterProducts = async (req, res) => {
  try {
    const products = await MasterProduct.find()
      .populate("locations.warehouse")
      .lean();

    // ✅ GET ALL SHOPIFY LOCATIONS ONCE (for name lookup)
    let shopifyLocationMap = {};
    try {
      const locRes = await axios.get(`${BASE}/locations.json`, {
        headers: { "X-Shopify-Access-Token": TOKEN },
      });

      locRes.data.locations.forEach((l) => {
        shopifyLocationMap[l.id] = l.name;
      });
    } catch (err) {
      console.error(
        "Shopify location error:",
        err.response?.data || err.message
      );
    }

    const enriched = [];

    for (const p of products) {
      const totalAvailable = (p.locations || []).reduce(
        (sum, loc) => sum + (Number(loc.available) || 0),
        0
      );

      let shopifyLevels = [];

      // ✅ If linked to Shopify, fetch inventory levels
      if (p.channels?.shopify?.inventory_item_id) {
        try {
          const stockRes = await axios.get(
            `${BASE}/inventory_levels.json?inventory_item_ids=${p.channels.shopify.inventory_item_id}`,
            {
              headers: { "X-Shopify-Access-Token": TOKEN },
            }
          );

          // ✅ Attach location name to each level
          shopifyLevels = (stockRes.data.inventory_levels || []).map(
            (l) => ({
              location_id: l.location_id,
              available: l.available,
              location_name:
                shopifyLocationMap[l.location_id] || l.location_id,
              channel: "Shopify",
            })
          );
        } catch (err) {
          console.error(
            "Shopify inventory error:",
            err.response?.data || err.message
          );
        }
      }

      enriched.push({
        ...p,
        totalAvailable,
        shopifyLevels,   // ✅ Location + name + qty
      });
    }

    res.json({ success: true, products: enriched });
  } catch (err) {
    console.error("Master products fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load products",
    });
  }
};

/**
 * ✅ POST /api/master-products
 */
export const createMasterProduct = async (req, res) => {
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
};

/**
 * ✅ PATCH /api/master-products/:id/add-stock
 */
export const addStockToMasterProduct = async (req, res) => {
  try {
    const { warehouseId, quantity } = req.body;

    const product = await MasterProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const location = product.locations.find(
      (l) => String(l.warehouse) === String(warehouseId)
    );

    if (location) {
      location.onHand += Number(quantity);
      location.available += Number(quantity);
    } else {
      product.locations.push({
        warehouse: warehouseId,
        onHand: Number(quantity),
        reserved: 0,
        available: Number(quantity),
        safetyStock: 0,
      });
    }

    await product.save();

    res.json({ success: true, product });
  } catch (err) {
    console.error("Add stock error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to add stock",
    });
  }
};

/**
 * ✅ PATCH /api/master-products/:id/stock
 */
export const updateMasterStock = async (req, res) => {
  try {
    const { warehouseId, available } = req.body;

    const product = await MasterProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const location = product.locations.find(
      (l) => String(l.warehouse) === String(warehouseId)
    );

    if (!location) {
      return res.status(404).json({ message: "Warehouse not linked" });
    }

    location.available = Number(available);
    await product.save();

    res.json({ success: true, product });
  } catch (err) {
    console.error("Update stock error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to update stock",
    });
  }
};

/**
 * ✅ PATCH /api/master-products/:id/link-shopify
 */
export const linkShopifyProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { sku, productId, variantId, inventory_item_id } = req.body;

    if (!sku || !inventory_item_id) {
      return res.status(400).json({
        message: "SKU & inventory_item_id are required",
      });
    }

    const product = await MasterProduct.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Master product not found" });
    }

    if (!product.channels) product.channels = {};

    product.channels.shopify = {
      sku,
      productId,
      variantId,
      inventory_item_id,
    };

    await product.save();

    res.json({
      success: true,
      message: "Shopify product linked successfully",
      product,
    });
  } catch (error) {
    console.error("Link Shopify Error:", error);
    res.status(500).json({
      message: "Failed to link Shopify product",
      error: error.message,
    });
  }
};

/**
 * ✅ PATCH /api/master-products/:id/unlink-shopify
 */
export const unlinkShopifyProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await MasterProduct.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Master product not found" });
    }

    if (!product.channels) product.channels = {};

    delete product.channels.shopify;

    await product.save();

    res.json({
      success: true,
      message: "Shopify product unlinked successfully",
      product,
    });
  } catch (error) {
    console.error("Unlink Shopify Error:", error);
    res.status(500).json({
      message: "Failed to unlink Shopify product",
      error: error.message,
    });
  }
};
