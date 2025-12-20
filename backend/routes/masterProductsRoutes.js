import express from "express";
import { addStockToMasterProduct, createMasterProduct, deleteMasterProduct, getAllMasterProducts, linkShipstationProduct, linkShopifyProduct, unlinkShipstationProduct, unlinkShopifyProduct } from "../controllers/masterProductsController.js";

const router = express.Router();

router.get("/", getAllMasterProducts)
router.post("/", createMasterProduct)
router.delete('/:id', deleteMasterProduct)
router.patch("/:id/add-stock", addStockToMasterProduct)

// ✅ Shopify Linking Routes
router.patch("/:id/link-shopify", linkShopifyProduct);
router.patch("/:id/unlink-shopify", unlinkShopifyProduct);

// ✅ ShipStation Linking Routes
router.patch("/:id/link-shipstation", linkShipstationProduct);
router.patch("/:id/unlink-shipstation", unlinkShipstationProduct);

export default router;
