import express from "express";
import {configDotenv} from "dotenv";
configDotenv()
import cors from "cors";
import shipmentRoutes from "./routes/shipmentRoutes.js";
import productsRoutes from "./routes/prouductsRoutes.js";
import shopifyInventory from "./routes/shopifyInventoryRoutes.js";
import masterProductsRoutes from "./routes/masterProductsRoutes.js";
import { connectDB } from "./config/db.js";
import warehouseRoutes from "./routes/warehousesRoutes.js";
import shopifyOrders from './routes/shopifyOrders.js'


const app = express();

connectDB()

app.use(cors());
app.use(express.json());


app.use("/api/shipments", shipmentRoutes);
app.use("/products", productsRoutes)


app.use("/api/shopify", shopifyInventory);


app.use("/api/master-products", masterProductsRoutes);

app.use("/api/warehouse", warehouseRoutes);

app.use("/api/shopify/orders", shopifyOrders)



app.get('/test', (req, res) => {
    res.send('boom boom express')
})


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
