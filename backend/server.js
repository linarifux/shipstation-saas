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
    res.send('checking if server is working or not')
})


// async function run() {
//   const query = new URLSearchParams({
//     shipment_status: 'pending',
//     batch_id: 'se-28529731',
//     pickup_id: 'pik_3YcKU5zdtJuCqoeNwyqqbW',
//     created_at_start: '2019-08-24T14:15:22Z',
//     created_at_end: '2019-08-24T14:15:22Z',
//     modified_at_start: '2019-08-24T14:15:22Z',
//     modified_at_end: '2019-08-24T14:15:22Z',
//     page: '1',
//     page_size: '25',
//     sales_order_id: 'string',
//     sort_dir: 'desc',
//     shipment_number: 'string',
//     ship_to_name: 'string',
//     item_keyword: 'string',
//     payment_date_start: '2019-08-24T14:15:22Z',
//     payment_date_end: '2019-08-24T14:15:22Z',
//     store_id: 'se-28529731',
//     external_shipment_id: 'string',
//     sort_by: 'modified_at'
//   }).toString();

//   const resp = await fetch(
//     `${process.env.SS_URL}/shipments`,
//     {
//       method: 'GET',
//       headers: {
//         'api-key': 'azK4YdHb12OdcsR1S4c2ykvVExU+K4o6HpMDydBhwso'
//       }
//     }
//   );

//   const data = await resp.text();
//   console.log(data);
// }

// run();


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
