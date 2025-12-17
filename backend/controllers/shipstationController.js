import axios from "axios";

const SS_KEY = process.env.SS_API_KEY;
const SS_SECRET = process.env.SS_API_SECRET;
const BASE_URL = process.env.SS_URL;

/**
 * ✅ GET /api/shipstation/products
 * Fetches products directly from ShipStation API
 */
export const getShipstationProducts = async (req, res) => {
  try {
    // 1. Create Basic Auth Header (Key:Secret base64 encoded)
    const auth = Buffer.from(`${SS_KEY}:${SS_SECRET}`).toString("base64");

    // 2. Call ShipStation API
    // We fetch 100 items by default. You can add pagination logic later if needed.
    const response = await axios.get(`${BASE_URL}/products`, {
      headers: {
        'api-key': `${process.env.SS_API_KEY}`
      }
    });

    // 3. Return data
    res.json({
      success: true,
      products: response.data.products,
      total: response.data.total,
      pages: response.data.pages,
    });
  } catch (error) {
    console.error("ShipStation API Error:", error.response?.data || error.message);
    res.status(500).json({
      message: "Failed to fetch products from ShipStation",
      error: error.response?.data?.ExceptionMessage || error.message,
    });
  }
};