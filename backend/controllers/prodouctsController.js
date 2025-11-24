import { configDotenv } from "dotenv";
import { ssClient } from "../utils/shipstationClient.js";
configDotenv()

export const getProducts = async (req, res) => {

    try {
        const data = await ssClient({
            method: 'get',
            url: `${process.env.SS_URL}/products`
        })

        if(!data?.data){
            res.status(404).json({success: false, message: 'No Products Found!'})
        }
        res.json({products: data?.data?.products, success: true})
        
    } catch (error) {
        console.log("Error fetching products:", error.response?.data || error);
        res.status(500).json({ success: false, message: "Failed to fetch products" });
    }
}