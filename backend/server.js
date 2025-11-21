import express from "express";
import {configDotenv} from "dotenv";
configDotenv()
import cors from "cors";
import shipmentRoutes from "./routes/shipmentRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());


app.use("/shipments", shipmentRoutes);

app.get('/test', (req, res) => {
    res.send('boom boom express')
})


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
