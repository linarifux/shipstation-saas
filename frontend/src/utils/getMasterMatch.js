export function getMasterMatch(masterProducts = [], sku = "") {
  if (!sku || !Array.isArray(masterProducts)) return null;

  const cleanSku = sku.trim().toLowerCase();

  return masterProducts.find((m) => {
    // 1. Match master SKU
    if (m.masterSku?.toLowerCase() === cleanSku) return true;

    // 2. Match variants
    if (
      Array.isArray(m.variants) &&
      m.variants.some((v) => v.sku?.toLowerCase() === cleanSku)
    ) {
      return true;
    }

    // 3. Match already linked Shopify SKU
    if (
      m.channels?.shopify?.sku &&
      m.channels.shopify.sku.toLowerCase() === cleanSku
    ) {
      return true;
    }

    return false;
  }) || null;
}
