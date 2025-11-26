import { updateShopifyQty } from "./shopifyService.js";
// You can plug these in later:
// import { submitInventoryUpdateFeed } from "../amazon/amazonFeedsService.js";
// import { updateWalmartQty } from "./walmartService.js";

export async function updateAllChannelsQty(masterProduct, totalQty) {
  const channels = masterProduct.channels || {};
  const sku = masterProduct.masterSku;

  const tasks = [];

  // Shopify
  if (channels.shopify?.sku) {
    tasks.push(updateShopifyQty(channels.shopify.sku, totalQty));
  } else {
    // fallback to masterSku
    tasks.push(updateShopifyQty(sku, totalQty));
  }

//   // Amazon
//   if (channels.amazon?.sku || channels.amazon?.asin) {
//     tasks.push(submitInventoryUpdateFeed(channels.amazon.sku || sku, totalQty));
//   }

  // Walmart
//   if (channels.walmart?.sku || channels.walmart?.itemId) {
//     tasks.push(updateWalmartQty(channels.walmart.sku || sku, totalQty));
//   }

  // ShipStation (optional: if you manage product inventory there)

  await Promise.allSettled(tasks);
}
