import { configDotenv } from "dotenv";
configDotenv();

import axios from "axios";
import MasterProduct from "../models/MasterProduct.js";

const SHOP = process.env.SHOPIFY_STORE_URL;
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const BASE = `https://${SHOP}/admin/api/2024-01`;

const headers = {
  "X-Shopify-Access-Token": TOKEN,
  "Content-Type": "application/json"
};

/* --------------------------------------------------
   GET ALL SHOPIFY INVENTORY BY LOCATION
-------------------------------------------------- */
export const getShopifyInventory = async (req, res) => {
  try {
    const { data } = await axios.get(
      `${BASE}/products.json?fields=id,title,variants`,
      { headers }
    );

    const products = [];

    for (const product of data.products) {
      for (const variant of product.variants) {

        if (!variant.inventory_item_id) continue;

        const levels = await axios.get(
          `${BASE}/inventory_levels.json?inventory_item_ids=${variant.inventory_item_id}`,
          { headers }
        );

        products.push({
          product_id: product.id,
          title: product.title,
          variant_id: variant.id,
          sku: variant.sku,
          inventory_item_id: variant.inventory_item_id,
          levels: levels.data.inventory_levels
        });
      }
    }

    res.json({ success: true, products });

  } catch (error) {
    console.error("Inventory fetch error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Failed to load inventory" });
  }
};


/* --------------------------------------------------
   UPDATE SHOPIFY INVENTORY
-------------------------------------------------- */
export const updateShopifyInventory = async (req, res) => {
  try {
    const { inventory_item_id, location_id, available } = req.body;

    if (!inventory_item_id || !location_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1. Check inventory tracking
    const { data: item } = await axios.get(
      `${BASE}/inventory_items/${inventory_item_id}.json`,
      { headers }
    );

    // 2. Enable tracking if needed
    if (!item.inventory_item.tracked) {
      await axios.put(
        `${BASE}/inventory_items/${inventory_item_id}.json`,
        {
          inventory_item: {
            id: inventory_item_id,
            tracked: true
          }
        },
        { headers }
      );
    }

    // 3. Set inventory
    await axios.post(
      `${BASE}/inventory_levels/set.json`,
      {
        inventory_item_id,
        location_id,
        available: Number(available)
      },
      { headers }
    );

    res.json({
      success: true,
      message: "Inventory updated successfully"
    });

  } catch (error) {
    console.error("Inventory update error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.errors || "Inventory update failed"
    });
  }
};


/* --------------------------------------------------
   GET SHOPIFY LOCATIONS
-------------------------------------------------- */
export const getShopifyLocations = async (req, res) => {
  try {
    const response = await axios.get(
      `${BASE}/locations.json`,
      { headers }
    );

    res.json({ success: true, locations: response.data.locations });

  } catch (error) {
    console.error("Location fetch error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch Shopify locations" });
  }
};


/* --------------------------------------------------
   🔥 RESOLVE INVENTORY ITEM BY SKU (IMPORTANT FIX)
-------------------------------------------------- */
async function findInventoryItemBySKU(sku) {
  let page = 1;
  let found = null;

  while (!found) {
    const { data } = await axios.get(
      `${BASE}/products.json?limit=250&page=${page}`,
      { headers }
    );

    if (!data.products.length) break;

    for (const product of data.products) {
      for (const variant of product.variants) {
        if (variant.sku === sku) {
          found = {
            inventory_item_id: variant.inventory_item_id,
            variant_id: variant.id,
            product_id: product.id
          };
        }
      }
    }

    page++;
  }

  return found;
}


/* --------------------------------------------------
   🔗 SYNC INVENTORY FROM MASTER PRODUCT TO SHOPIFY
-------------------------------------------------- */
export const syncInventoryFromMaster = async (req, res) => {
  const { sku } = req.body;

  if (!sku) {
    return res.status(400).json({ message: "SKU is required" });
  }

  try {
    const master = await MasterProduct.findOne({ masterSku: sku }).populate("locations.warehouse");
    if (!master) return res.status(404).json({ message: "Master product not found" });

    const totalQty = master.totalAvailable || 0;

    const found = await findInventoryItemBySKU(sku);

    if (!found) {
      return res.status(404).json({ message: "Shopify product not found with this SKU" });
    }

    const { inventory_item_id } = found;

    const { data: loc } = await axios.get(`${BASE}/locations.json`, { headers });

    for (const l of loc.locations) {
      await axios.post(
        `${BASE}/inventory_levels/set.json`,
        {
          inventory_item_id,
          location_id: l.id,
          available: totalQty
        },
        { headers }
      );
    }

    // save mapping inside master
    await MasterProduct.findOneAndUpdate(
      { masterSku: sku },
      {
        "channels.shopify": {
          sku,
          productId: found.product_id,
          variantId: found.variant_id
        }
      }
    );

    res.json({
      success: true,
      message: "✅ Master Product synced to Shopify",
      sku,
      quantity: totalQty
    });

  } catch (error) {
    console.error("Sync Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to sync inventory" });
  }
};
