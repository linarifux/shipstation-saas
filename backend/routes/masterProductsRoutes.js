import express from "express";
import { linkShopifyProduct, unlinkShopifyProduct } from "../controllers/masterProductsController.js";

const router = express.Router();

router.patch("/master-products/:id/link-shopify", linkShopifyProduct);
router.patch("/master-products/:id/unlink-shopify", unlinkShopifyProduct);

export default router;
