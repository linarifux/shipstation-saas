import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// 1. Fetch Warehouses
export const fetchWarehouses = createAsyncThunk(
  "warehouse/fetchWarehouses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/warehouse`);
      return response.data.warehouses || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load warehouses");
    }
  }
);

// 2. Create Warehouse
export const createWarehouse = createAsyncThunk(
  "warehouse/createWarehouse",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      await axios.post(`${BACKEND_URL}/warehouse`, formData);
      dispatch(fetchWarehouses());
      return;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create warehouse");
    }
  }
);

// ✅ 3. Delete Warehouse
export const deleteWarehouse = createAsyncThunk(
  "warehouse/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete(`${BACKEND_URL}/warehouse/${id}`);
      dispatch(fetchWarehouses()); // Refresh list
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete");
    }
  }
);

// ✅ 4. Set Default Warehouse
export const setDefaultWarehouse = createAsyncThunk(
  "warehouse/setDefault",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await axios.put(`${BACKEND_URL}/warehouse/${id}`, { isDefault: true });
      dispatch(fetchWarehouses()); // Refresh list
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to set default");
    }
  }
);

const warehouseSlice = createSlice({
  name: "warehouse",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWarehouses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWarehouses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWarehouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default warehouseSlice.reducer;