import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  masterSku: { type: String, required: true, unique: true },
  name: String,
  inventory: {
    total: Number,
    available: Number,
    reserved: { type: Number, default: 0 }
  }
});

export default mongoose.model("Product", productSchema);
