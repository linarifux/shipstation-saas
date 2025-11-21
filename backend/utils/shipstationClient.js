import axios from "axios";
import { configDotenv } from "dotenv";
configDotenv()


export const ssClient = axios.create({
  baseURL: `${process.env.SS_URL}`,
  headers: {
        'api-key': `${process.env.SS_API_KEY}`
      }
});
