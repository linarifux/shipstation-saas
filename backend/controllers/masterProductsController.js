import MasterProduct from "../models/MasterProduct.js";
import axios from "axios";

const STORE = process.env.SHOPIFY_STORE_URL;
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const BASE = `https://${STORE}/admin/api/2024-01`;


/**
 * ✅ GET /api/master-products
 * - Internal warehouses
 * - Shopify locations
 * - GRAND TOTAL (Internal + Unique Shopify Stock)
 */
export const getAllMasterProducts = async (req, res) => {
  try {
    // 1. Fetch all Master Products from DB
    // We populate 'locations.warehouse' to get the internal warehouse NAMES
    const products = await MasterProduct.find()
      .populate("locations.warehouse")
      .lean();

    // 2. Fetch all Shopify Locations (ONCE)
    let shopifyLocationMap = {};
    try {
      const locRes = await axios.get(`${BASE}/locations.json`, {
        headers: { "X-Shopify-Access-Token": TOKEN },
      });

      locRes.data.locations.forEach((l) => {
        shopifyLocationMap[l.id] = l.name;
      });
    } catch (err) {
      console.error("Shopify locations fetch failed:", err.message);
    }

    // 3. Collect all Inventory Item IDs to fetch in bulk
    const inventoryItemIds = products
      .map((p) => p.channels?.shopify?.inventory_item_id)
      .filter((id) => id); // Remove null/undefined

    // 4. Batch Fetch Inventory Levels (Chunk size 50)
    let allShopifyLevels = [];
    const chunkSize = 50;

    for (let i = 0; i < inventoryItemIds.length; i += chunkSize) {
      const chunk = inventoryItemIds.slice(i, i + chunkSize);
      const idsString = chunk.join(",");

      try {
        const stockRes = await axios.get(
          `${BASE}/inventory_levels.json?inventory_item_ids=${idsString}&limit=250`,
          { headers: { "X-Shopify-Access-Token": TOKEN } }
        );

        if (stockRes.data.inventory_levels) {
          allShopifyLevels = [
            ...allShopifyLevels,
            ...stockRes.data.inventory_levels,
          ];
        }
      } catch (err) {
        console.error(
          `Batch fetch error (chunk ${i}):`,
          err.response?.data || err.message
        );
      }
    }

    // 5. Merge & Calculate Grand Total (Updated Logic)
    const enriched = products.map((p) => {
      // A. Calculate Internal Warehouse Total & Get Names
      const internalLocationNames = new Set(); // To track names for exclusion

      const internalTotal = (p.locations || []).reduce((sum, loc) => {
        // Store the warehouse name in our Set (lowercase for safe comparison)
        if (loc.warehouse && loc.warehouse.name) {
          internalLocationNames.add(loc.warehouse.name.toLowerCase().trim());
        }
        return sum + (Number(loc.available) || 0);
      }, 0);

      // B. Process Shopify Levels
      let shopifyLevels = [];
      let shopifyTotal = 0; // Total raw count from Shopify
      let uniqueShopifyStock = 0; // Count only from locations NOT in internal DB

      const shopifyItemId = p.channels?.shopify?.inventory_item_id;

      if (shopifyItemId) {
        // Find levels for this specific product
        const levels = allShopifyLevels.filter(
          (l) => String(l.inventory_item_id) === String(shopifyItemId)
        );

        levels.forEach((l) => {
          const qty = Number(l.available) || 0;
          const locName = shopifyLocationMap[l.location_id] || "";

          // 1. Add to raw Shopify total
          shopifyTotal += qty;

          // 2. CHECK: Is this location name already counted in Internal Warehouse?
          // Only add to "unique" stock if the name is NOT in our internal list
          if (!internalLocationNames.has(locName.toLowerCase().trim())) {
            uniqueShopifyStock += qty;
          }
        });

        // Map for frontend display
        shopifyLevels = levels.map((l) => ({
          location_id: l.location_id,
          available: l.available,
          location_name:
            shopifyLocationMap[l.location_id] || `Loc: ${l.location_id}`,
          channel: "Shopify",
          // Add a flag so frontend knows this is a duplicate/synced location
          isDuplicate: internalLocationNames.has(
            (shopifyLocationMap[l.location_id] || "").toLowerCase().trim()
          ),
        }));
      }

      // C. Grand Total = Internal Stock + Unique (Non-Overlapping) Shopify Stock
      const totalAvailable = internalTotal + uniqueShopifyStock;

      return {
        ...p,
        internalTotal,
        shopifyTotal,
        totalAvailable, // ✅ Correctly excludes duplicates
        shopifyLevels,
      };
    });

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
 * Uses $unset for reliable deletion
 */
export const unlinkShopifyProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await MasterProduct.findByIdAndUpdate(
      id,
      { $unset: { "channels.shopify": "" } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Master product not found" });
    }

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


/**
 * ✅ PATCH /api/master-products/:id/link-shipstation
 */
export const linkShipstationProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { sku, productId } = req.body;

    if (!sku) {
      return res.status(400).json({ message: "ShipStation SKU is required" });
    }

    const product = await MasterProduct.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Master product not found" });
    }

    if (!product.channels) product.channels = {};

    // Update ShipStation channel data
    product.channels.shipstation = {
      sku,
      productId: productId || null, // Optional, depending on if you use SS internal IDs
    };

    await product.save();

    res.json({
      success: true,
      message: "ShipStation product linked successfully",
      product,
    });
  } catch (error) {
    console.error("Link ShipStation Error:", error);
    res.status(500).json({
      message: "Failed to link ShipStation product",
      error: error.message,
    });
  }
};

/**
 * ✅ PATCH /api/master-products/:id/unlink-shipstation
 */
export const unlinkShipstationProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Use $unset to reliably remove the field
    const product = await MasterProduct.findByIdAndUpdate(
      id,
      { $unset: { "channels.shipstation": "" } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Master product not found" });
    }

    res.json({
      success: true,
      message: "ShipStation product unlinked successfully",
      product,
    });
  } catch (error) {
    console.error("Unlink ShipStation Error:", error);
    res.status(500).json({
      message: "Failed to unlink ShipStation product",
      error: error.message,
    });
  }
};
