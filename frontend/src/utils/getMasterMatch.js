export function getMasterMatch(masterProducts, sku) {
  return masterProducts.find(
    (m) =>
      m.masterSku === sku ||
      m.variants?.some((v) => v.sku === sku)
  );
}
