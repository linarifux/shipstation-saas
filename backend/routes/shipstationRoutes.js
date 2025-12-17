import express from "express";
import { getShipstationProducts } from "../controllers/shipstationController.js";

const router = express.Router();

// Route: /api/shipstation/products
router.get("/products", getShipstationProducts);

export default router;