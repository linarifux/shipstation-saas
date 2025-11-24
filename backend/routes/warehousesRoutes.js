import { getWarehouses } from "../controllers/warehousesController.js";
import express from "express";

const router = express.Router();
router.get('/', getWarehouses);

export default router;