import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: String, // internal code like "UK-HQ"

    // External mappings
    shipstationWarehouseId: String,
    shopifyLocationId: String,
    amazonWarehouseCode: String,
    walmartWarehouseCode: String,

    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Warehouse", warehouseSchema);
