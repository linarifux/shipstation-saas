import { configDotenv } from "dotenv";
import { ssClient } from "../utils/shipstationClient.js";
configDotenv()

export const getWarehouses = async (req, res) => {

    try {   
        const data = await ssClient({
            method: 'get',
            url: `${process.env.SS_URL}/warehouses`
        })  

        if(!data?.data){
            res.status(404).json({success: false, message: 'No Warehouses Found!'})
        }       

        res.json({warehouses: data?.data?.warehouses, success: true})
        
    } catch (error) {
        console.log("Error fetching warehouses:", error.response?.data || error);
        res.status(500).json({ success: false, message: "Failed to fetch warehouses" });
    }   
}

