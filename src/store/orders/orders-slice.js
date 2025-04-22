import { createSlice } from "@reduxjs/toolkit";
import {
  fetchOrder,
  updateOrderStatus,
  get_pending_orders,
} from "./orders-thunks";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: null,
    isloading: false,
    fetched: false,
    error: null,
    processing: false,
    shipping: false,
    pending_orders: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.isloading = true;
        state.fetched = false;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.isloading = false;
        state.fetched = true;
        state.order = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.isloading = false;
        state.fetched = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.pending, (state, action) => {
        if (action.meta.arg.status === "DELIVERED") state.processing = true;
        if (action.meta.arg.status === "SHIPPED") state.shipping = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state) => {
        state.processing = false;
        state.shipping = false;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.processing = false;
        state.shipping = false;
        state.error = action.payload;
      })
      .addCase(get_pending_orders.fulfilled, (state, action) => {
        state.isloading = false;
        state.pending_orders = action.payload;
      });
  },
});

export default orderSlice.reducer;
