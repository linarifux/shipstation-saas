import MasterProduct from "../models/MasterProduct.js";

/**
 * PATCH /api/master-products/:id/link-shopify
 * body: { sku, productId, variantId }
 */
export const linkShopifyProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { sku, productId, variantId } = req.body;

    const product = await MasterProduct.findById(id);
    if (!product) return res.status(404).json({ message: "Master product not found" });

    product.channels.shopify = {
      sku,
      productId,
      variantId
    };

    await product.save();

    res.json({ success: true, product });

  } catch (err) {
    console.error("Link error:", err.message);
    res.status(500).json({ success: false, message: "Link failed" });
  }
};

/**
 * PATCH /api/master-products/:id/unlink-shopify
 */
export const unlinkShopifyProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await MasterProduct.findById(id);
    if (!product) return res.status(404).json({ message: "Master product not found" });

    product.channels.shopify = null;
    await product.save();

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ message: "Unlink failed" });
  }
};
