import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 1. Async Thunk for Fetching Data
export const fetchMasterProducts = createAsyncThunk(
  "masterProducts/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/master-products`);
      return response.data.products;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
    }
  }
);

// 2. Create the Slice
const masterProductSlice = createSlice({
  name: "masterProducts",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Standard reducers (synchronous updates) go here if needed
    // e.g., clearSelection: (state) => { state.selectedItem = null }
  },
  extraReducers: (builder) => {
    builder
      // Handle Loading
      .addCase(fetchMasterProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle Success
      .addCase(fetchMasterProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      // Handle Error
      .addCase(fetchMasterProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default masterProductSlice.reducer;