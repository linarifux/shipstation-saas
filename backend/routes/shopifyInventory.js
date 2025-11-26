import express from "express";
import {configDotenv} from 'dotenv'
configDotenv()
import axios from "axios";

const router = express.Router();

const STORE = process.env.SHOPIFY_STORE_URL;
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

/**
 * GET /api/shopify/inventory
 * Returns all products + variant + inventory levels (per location)
 */
router.get("/shopify/inventory", async (req, res) => {
  try {
    const { data } = await axios.get(
      `https://${STORE}/admin/api/2023-10/products.json?fields=id,title,variants`,
      {
        headers: {
          "X-Shopify-Access-Token": TOKEN
        }
      }
    );

    const products = [];

    for (const product of data.products) {
      for (const variant of product.variants) {
        // Get inventory levels per location
        const levels = await axios.get(
          `https://${STORE}/admin/api/2023-10/inventory_levels.json?inventory_item_ids=${variant.inventory_item_id}`,
          {
            headers: { "X-Shopify-Access-Token": TOKEN }
          }
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
    console.error("Inventory fetch error:", error.response?.data || error);
    res.status(500).json({ success: false, message: "Failed to load inventory" });
  }
});


// ✅ NEW AUTO-TRACKING + UPDATE
router.post("/shopify/inventory/update", async (req, res) => {
  try {
    const { inventory_item_id, location_id, available } = req.body;

    // ✅ Step 1 — Check inventory item tracking
    const { data: item } = await axios.get(
      `https://${STORE}/admin/api/2023-10/inventory_items/${inventory_item_id}.json`,
      {
        headers: { "X-Shopify-Access-Token": TOKEN }
      }
    );

    // ✅ Step 2 — Enable tracking if disabled
    if (!item.inventory_item.tracked) {
      await axios.put(
        `https://${STORE}/admin/api/2023-10/inventory_items/${inventory_item_id}.json`,
        {
          inventory_item: {
            id: inventory_item_id,
            tracked: true
          }
        },
        {
          headers: {
            "X-Shopify-Access-Token": TOKEN
          }
        }
      );

    }

    // ✅ Step 3 — Now update quantity
    await axios.post(
      `https://${STORE}/admin/api/2023-10/inventory_levels/set.json`,
      {
        inventory_item_id,
        location_id,
        available: Number(available)
      },
      {
        headers: {
          "X-Shopify-Access-Token": TOKEN
        }
      }
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
});



export default router;
