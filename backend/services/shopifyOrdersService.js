import axios from "axios";
import { configDotenv } from "dotenv";
configDotenv()

const STORE = process.env.SHOPIFY_STORE_URL;
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

export async function getAllShopifyOrders() {
  try {
    const res = await axios.get(
      `https://${STORE}/admin/api/2023-10/orders.json?status=any&limit=100`,
      {
        headers: {
          "X-Shopify-Access-Token": TOKEN
        }
      }
    );

    return res.data.orders;
  } catch (error) {
    console.error("Shopify Orders Error:", error.response?.data || error.message);
    throw error;
  }
}
