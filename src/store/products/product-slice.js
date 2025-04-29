import {
  create_product,
  get_all_products,
  get_product,
  edit_product,
  delete_product,
  get_paginated_products,
} from "./product-thunk";
import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  isLoading: false,
  error: false,
  product: {},
  isFetched: false,
  all_Products: [],
  paginated_products: [],
};

const productSlice = createSlice({
  name: "product",
  initialState: initialstate,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(create_product.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(create_product.fulfilled, (state, action) => {
      state.isLoading = false;
      state.all_Products.push(action.payload);
    });
    builder.addCase(create_product.rejected, (state) => {
      state.isLoading = false;
      state.error = true;
    });

    builder.addCase(get_all_products.pending, (state) => {
      state.isLoading = true;
      state.error = false;
      state.isFetched = false;
    });
    builder.addCase(get_all_products.fulfilled, (state, action) => {
      state.isLoading = false;
      state.all_Products = action.payload;
      state.isFetched = true;
    });
    builder.addCase(get_all_products.rejected, (state) => {
      state.isLoading = false;
      state.error = true;
      state.isFetched = false;
    });

    // builder.addCase(get_paginated_products.pending, (state) => {
    //   state.isLoading = true;
    //   state.error = false;
    // });

    // builder.addCase(get_paginated_products.fulfilled, (state, action) => {
    //   state.isLoading = false;
    //   state.paginated_products = action.payload;
    // });

    // builder.addCase(get_paginated_products.rejected, (state) => {
    //   state.isLoading = false;
    //   state.error = true;
    // });

    builder.addCase(get_product.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(get_product.fulfilled, (state, action) => {
      state.isLoading = false;
      state.product = action.payload;
    });
    builder.addCase(get_product.rejected, (state) => {
      state.isLoading = false;
      state.error = true;
    });

    builder.addCase(edit_product.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(edit_product.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.all_Products.findIndex(
        (p) => p.id === action.payload.id
      );
      if (index !== -1) {
        state.all_Products[index] = action.payload;
      }
    });
    builder.addCase(edit_product.rejected, (state) => {
      state.isLoading = false;
      state.error = true;
    });

    builder.addCase(delete_product.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(delete_product.fulfilled, (state, action) => {
      state.isLoading = false;
      state.all_Products = state.all_Products.filter(
        (p) => p.id !== action.payload
      );
    });
    builder.addCase(delete_product.rejected, (state) => {
      state.isLoading = false;
      state.error = true;
    });
  },
});

export default productSlice.reducer;
