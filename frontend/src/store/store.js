import { configureStore } from "@reduxjs/toolkit";
import masterProductReducer from "./slices/masterProductSlice";
import shopifyReducer from "./slices/shopifySlice";
import warehouseReducer from "./slices/warehouseSlice"; // 1. Import

export const store = configureStore({
  reducer: {
    masterProducts: masterProductReducer,
    shopify: shopifyReducer,
    warehouse: warehouseReducer, // 2. Add here
  },
});