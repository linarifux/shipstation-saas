import express from "express";
import { addStockToMasterProduct, createMasterProduct, getAllMasterProducts, linkShopifyProduct, unlinkShopifyProduct } from "../controllers/masterProductsController.js";

const router = express.Router();

router.get("/", getAllMasterProducts)
router.post("/", createMasterProduct)
router.patch("/:id/add-stock", addStockToMasterProduct)

router.patch("/:id/link-shopify", linkShopifyProduct);
router.patch("/:id/unlink-shopify", unlinkShopifyProduct);

export default router;
