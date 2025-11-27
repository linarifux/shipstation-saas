import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, unique: true },

    address: {
      name: String,
      company_name: String,
      address_line1: String,
      address_line2: String,
      city: String,
      state: String,
      postal_code: String,
      country: String,
      phone: String,
      email: String,
    },

    isDefault: { type: Boolean, default: false },

    shipstationWarehouseId: { type: String },
    shopifyLocationId: { type: String },
    amazonFulfillmentId: { type: String },
    walmartNodeId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Warehouse", warehouseSchema);
