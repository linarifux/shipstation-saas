import mongoose from "mongoose";
const { Schema } = mongoose;

const variantSchema = new Schema(
  {
    name: String,     // e.g. "Size M / Blue"
    sku: String,
    price: Number
  },
  { _id: false }
);


const locationStockSchema = new Schema(
  {
    warehouse: { type: Schema.Types.ObjectId, ref: "Warehouse", required: true },
    onHand: { type: Number, default: 0 },     // physical units
    reserved: { type: Number, default: 0 },   // in orders but not shipped
    available: { type: Number, default: 0 },  // onHand - reserved
    safetyStock: { type: Number, default: 0 },
  },
  { _id: false }
);

const channelMapSchema = new Schema(
  {
    shopify: {
      sku: String,
      productId: String,
      variantId: String,
    },
    amazon: {
      sku: String,
      asin: String,
    },
    walmart: {
      sku: String,
      itemId: String,
    },
    shipstation: {
      sku: String,
      productId: String, // if you use ShipStation products
    },
  },
  { _id: false }
);

const masterProductSchema = new Schema(
  {
    masterSku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    brand: String,
    category: String,

    price: { type: Number, default: 0 },
    unitCost: { type: Number, default: 0 },

    trackInventory: { type: Boolean, default: true },

    variants: [variantSchema],
    channels: channelMapSchema,

    locations: [locationStockSchema],
  },
  { timestamps: true, toJSON: { virtuals: true } }
);


// Convenience virtual: total available across locations
masterProductSchema.virtual("totalAvailable").get(function () {
  return (this.locations || []).reduce((sum, loc) => sum + (loc.available || 0), 0);
});

export default mongoose.model("MasterProduct", masterProductSchema);
