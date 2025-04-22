import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRoute } from "@/apiClient/apiClient";

export const get_all_products = createAsyncThunk(
  "customerProducts/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRoute.get("/api/homedetails");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const get_customer_paginated_products = createAsyncThunk(
  "customerProducts/get-paginated",
  async (page, { rejectWithValue }) => {
    try {
      const response = await apiRoute.get(`/api/products?page=${page}`);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong");
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const get_single_product = createAsyncThunk(
  "customerProducts/getOne",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiRoute.get(`/api/products?id=${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

const productsSlice = createSlice({
  name: "customerProducts",
  initialState: {
    featuredProducts: [],
    newProducts: [],
    trendingProducts: [],
    bestSellers: [],
    singleProduct: null,
    paginated_products: [],
    isLoading: false,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(get_all_products.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(get_all_products.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProducts = action?.payload?.featuredProducts;
        state.newProducts = action?.payload?.newProducts;
        state.trendingProducts = action?.payload.trendingProducts;
        state.bestSellers = action?.payload?.bestSellers;
      })
      .addCase(get_all_products.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(get_customer_paginated_products.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })

      .addCase(get_customer_paginated_products.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paginated_products = action.payload;
      })

      .addCase(get_customer_paginated_products.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      })

      .addCase(get_single_product.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.singleProduct = null;
      })
      .addCase(get_single_product.fulfilled, (state, action) => {
        state.loading = false;
        state.singleProduct = action.payload;
      })
      .addCase(get_single_product.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
