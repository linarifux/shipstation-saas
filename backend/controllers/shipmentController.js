import { configDotenv } from "dotenv";
import { ssClient } from "../utils/shipstationClient.js";
configDotenv()

export const getShipments = async (req, res) => {
  try {
    const data = await ssClient({
      method: 'get',
      url: `${process.env.SS_URL}/shipments`
    })
    if(!data?.data){
      res.status(404).json({success: false, message: 'No shipments Found!'})
    }
    res.json({shipments: data?.data?.shipments, success: true})
  } catch (error) {
    console.error("Error fetching shipments:", error.response?.data || error);
    res.status(500).json({ success: false, message: "Failed to fetch shipments" });
  }
};
