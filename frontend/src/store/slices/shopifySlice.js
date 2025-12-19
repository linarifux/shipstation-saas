import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/* -------------------------------- */
/* THUNKS (Async Actions) */
/* -------------------------------- */

// 1. Fetch All Shopify Inventory (Enriched with Locations)
export const fetchShopifyInventory = createAsyncThunk(
  "shopify/fetchInventory",
  async (_, { rejectWithValue }) => {
    try {
      // We fetch the master products which contain the enriched shopify levels (with location names)
      const response = await axios.get(`${BACKEND_URL}/shopify/inventory`);
      return response.data.products; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch inventory");
    }
  }
);

// 2. Update Stock on Shopify
export const updateShopifyStock = createAsyncThunk(
  "shopify/updateStock",
  async ({ inventory_item_id, location_id, available }, { dispatch, rejectWithValue }) => {
    try {
      await axios.post(`${BACKEND_URL}/shopify/inventory/update`, {
        inventory_item_id,
        location_id,
        available: Number(available),
      });
      // Refresh data after update
      dispatch(fetchShopifyInventory());
      return { inventory_item_id, available };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update stock");
    }
  }
);

// 3. Sync from Master
export const syncShopifyToMaster = createAsyncThunk(
  "shopify/sync",
  async (masterProduct, { dispatch, rejectWithValue }) => {
    try {
      if (!masterProduct?.channels?.shopify?.sku) throw new Error("Not linked to Shopify");
      
      await axios.post(`${BACKEND_URL}/shopify/inventory/sync`, {
        sku: masterProduct.channels.shopify.sku,
        quantity: masterProduct.totalAvailable,
      });
      
      dispatch(fetchShopifyInventory());
      return masterProduct._id;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to sync");
    }
  }
);

/* -------------------------------- */
/* SLICE */
/* -------------------------------- */
const shopifySlice = createSlice({
  name: "shopify",
  initialState: {
    products: [],
    locations: {}, // ✅ Stores ID -> Name mapping
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchShopifyInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShopifyInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;

        // ✅ EXTRACT LOCATIONS from the product data
        // We iterate over products -> shopifyLevels to build the location map dynamically
        const locMap = {};
        action.payload.forEach((p) => {
          if (p.shopifyLevels) {
            p.shopifyLevels.forEach((l) => {
              if (l.location_id && l.location_name) {
                locMap[l.location_id] = l.location_name;
              }
            });
          }
        });
        state.locations = locMap;
      })
      .addCase(fetchShopifyInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default shopifySlice.reducer;