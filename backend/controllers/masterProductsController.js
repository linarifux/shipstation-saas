import MasterProduct from "../models/MasterProduct.js";

/**
 * GET /api/master-products
 * Returns all master products with populated warehouse info
 */
export const getAllMasterProducts = async (req, res) => {
  try {
    const products = await MasterProduct.find()
      .populate("locations.warehouse")
      .lean();

    // Add totalAvailable computed
    const enriched = products.map((p) => ({
      ...p,
      totalAvailable: (p.locations || []).reduce(
        (sum, loc) => sum + (loc.available || 0),
        0
      ),
    }));

    res.json({ success: true, products: enriched });
  } catch (err) {
    console.error("Master products fetch error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to load products" });
  }
};


/**
 * POST /api/master-products
 * Create a new master product
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



/* ✅ ADD STOCK TO MASTER PRODUCT */
export const addStockToMasterProduct = async (req, res) => {
  try {
    const { warehouseId, quantity } = req.body;

    const product = await MasterProduct.findById(req.params.id);



    const location = product.locations.find(
      l => String(l.warehouse) === String(warehouseId)
    );

    if (location) {
      location.onHand += quantity;
      location.available += quantity;
    } else {
      product.locations.push({
        warehouse: warehouseId,
        onHand: quantity,
        reserved: 0,
        available: quantity,
        safetyStock: 0
      });
    }

    await product.save();

    res.json({ success: true });
  } catch (err) {
    console.error("Server error:", err.response?.data || err.message);
  }

}

/**
 * PATCH /api/master-products/:id/link-shopify
 * body: { sku, productId, variantId }
 */

export const linkShopifyProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { sku, productId, variantId } = req.body;

    if (!sku) {
      return res.status(400).json({ message: "SKU is required" });
    }

    const product = await MasterProduct.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Master product not found" });
    }

    // ✅ ENSURE channels object exists
    if (!product.channels) {
      product.channels = {};
    }

    // ✅ LINK SHOPIFY DATA
    product.channels.shopify = {
      sku,
      productId,
      variantId,
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
 * PATCH /api/master-products/:id/unlink-shopify
 */
export const unlinkShopifyProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await MasterProduct.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Master product not found" });
    }

    if (!product.channels) {
      product.channels = {};
    }

    // ✅ REMOVE SHOPIFY ONLY
    product.channels.shopify = undefined;

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

