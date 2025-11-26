import axios from "axios";
import { configDotenv } from "dotenv";
configDotenv()

// ================== CONFIG ==================
const STORE = process.env.SHOPIFY_STORE_URL;
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

// Shopify API client
const shopify = axios.create({
  baseURL: `https://${STORE}/admin/api/2023-10`,
  headers: {
    "X-Shopify-Access-Token": TOKEN,
    "Content-Type": "application/json"
  }
});

// ================== HELPERS ==================

// Get all locations and cache them in memory
let cachedLocations = null;

export async function getShopifyLocations() {
  if (cachedLocations) return cachedLocations;

  const { data } = await shopify.get(`/locations.json`);
  cachedLocations = data.locations;

  return cachedLocations;
}

// Get Shopify inventory item ID by SKU
export async function getInventoryItemIdBySku(sku) {
  if (!sku) return null;

  // Shopify only returns first 250 per page, so for now we keep it simple
  const { data } = await shopify.get(`/products.json?limit=250&fields=id,variants`);

  for (const product of data.products) {
    for (const variant of product.variants) {
      if (variant.sku === sku) {
        return {
          inventory_item_id: variant.inventory_item_id,
          variant_id: variant.id,
          product_id: product.id
        };
      }
    }
  }

  return null;
}

// Enable inventory tracking if not enabled
export async function enableTrackingIfDisabled(inventory_item_id) {
  const { data } = await shopify.get(
    `/inventory_items/${inventory_item_id}.json`
  );

  if (!data.inventory_item.tracked) {
    await shopify.put(`/inventory_items/${inventory_item_id}.json`, {
      inventory_item: {
        id: inventory_item_id,
        tracked: true
      }
    });

    console.log(`✅ Enabled tracking for ${inventory_item_id}`);
  }
}

// ================== INVENTORY ==================

/**
 * Update Shopify inventory quantity using SKU
 */
export async function updateShopifyQtyBySku(sku, quantity) {
  const result = await getInventoryItemIdBySku(sku);

  if (!result) {
    console.warn(`⚠️ SKU NOT FOUND IN SHOPIFY: ${sku}`);
    return null;
  }

  return updateShopifyQtyByInventoryItem(
    result.inventory_item_id,
    quantity
  );
}

/**
 * Update Shopify inventory by inventory_item_id
 */
export async function updateShopifyQtyByInventoryItem(
  inventory_item_id,
  quantity
) {
  const locations = await getShopifyLocations();

  // We will update only the main/default location
  const primaryLocation = locations.find((loc) => loc.active);

  if (!primaryLocation) {
    throw new Error("No active Shopify location found");
  }

  // ✅ Ensure tracking is enabled
  await enableTrackingIfDisabled(inventory_item_id);

  // ✅ Set inventory level
  await shopify.post(`/inventory_levels/set.json`, {
    inventory_item_id,
    location_id: primaryLocation.id,
    available: Number(quantity)
  });

  console.log(
    `✅ Shopify inventory updated: ${inventory_item_id} -> ${quantity} units at location ${primaryLocation.id}`
  );

  return true;
}

// Alias for your Master Sync Service
export async function updateShopifyQty(sku, quantity) {
  return updateShopifyQtyBySku(sku, quantity);
}

// ================== EXPORTS ==================
export default {
  getShopifyLocations,
  getInventoryItemIdBySku,
  enableTrackingIfDisabled,
  updateShopifyQtyBySku,
  updateShopifyQtyByInventoryItem,
  updateShopifyQty
};
