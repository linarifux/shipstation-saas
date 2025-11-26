import express from "express";
import {configDotenv} from "dotenv";
configDotenv()
import cors from "cors";
import shipmentRoutes from "./routes/shipmentRoutes.js";
import productsRoutes from "./routes/prouductsRoutes.js";
import warehousesRoutes from "./routes/warehousesRoutes.js";
import shopifyOrders from "./routes/shopifyOrders.js";
import shopifyInventory from "./routes/shopifyInventory.js";

const app = express();

app.use(cors());
app.use(express.json());


app.use("/shipments", shipmentRoutes);
app.use("/products", productsRoutes)
app.use("/warehouses", warehousesRoutes);


app.use("/api", shopifyOrders);
app.use("/api", shopifyInventory);



app.get('/test', (req, res) => {
    res.send('boom boom express')
})


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
