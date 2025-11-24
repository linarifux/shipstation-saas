import { getProducts } from "../controllers/prodouctsController.js";
import express from "express";
const router = express.Router();

router.get("/", getProducts);

export default router;