import mongoose from "mongoose";
import {configDotenv} from "dotenv";
import { DB_NAME } from "./constants.js";
configDotenv()
const mongoUri = process.env.MONGO_URI

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${mongoUri}/${DB_NAME}`);
    console.log(`✅ MongoDB Connected to ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Mongo Error:", error.message);
    process.exit(1);
  }
};
