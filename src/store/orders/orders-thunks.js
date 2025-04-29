import { createAsyncThunk } from "@reduxjs/toolkit";
import { OrderService } from "@/services/order-services";

export const fetchOrder = createAsyncThunk(
  "order/fetchOrder",
  async (id, { rejectWithValue }) => {
    try {
      const response = await OrderService.fetchOrder(id);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch order details"
      );
    }
  }
);

export const get_pending_orders = createAsyncThunk(
  "order/pending",
  async (_, { rejectWithValue }) => {
    try {
      const response = await OrderService.get_pending_orders();
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch pending orders"
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ id, status }, { dispatch, rejectWithValue }) => {
    try {
      await OrderService.updateOrderStatus(id, status);
      dispatch(fetchOrder(id));
    } catch (err) {
      return rejectWithValue("Failed to update order status");
    }
  }
);
