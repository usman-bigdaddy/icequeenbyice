import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRoute } from "@/apiClient/apiClient";
import { toast } from "react-toastify";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const idParam = userId ? `userId=${userId}` : `guestId=${guestId}`;
      const response = await apiRoute.get(`/api/cart?${idParam}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { userId, guestId, productId, action, quantity },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const payload = { productId };
      if (userId) payload.userId = userId;
      if (guestId) payload.guestId = guestId;
      if (action) payload.action = action;
      if (quantity) payload.quantity = quantity;

      await apiRoute.post("/api/cart", payload);

      dispatch(fetchCart(payload));
      toast.success("Item added to cart successfully");
    } catch (error) {
      toast.error("Something went wrong");
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async (
    { userId, guestUserId, productId, action },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await apiRoute.post("/api/cart", {
        userId,
        guestUserId,
        productId,
        action,
      });
      dispatch(fetchCart({ userId, guestUserId }));
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update quantity"
      );
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async ({ userId, guestUserId, productId }, { rejectWithValue }) => {
    try {
      await apiRoute.delete("/api/cart/item", {
        data: { userId, guestUserId, productId },
      });
      return productId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove item"
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async ({ userId, guestUserId }, { rejectWithValue }) => {
    try {
      await apiRoute.delete("/api/cart", {
        data: { userId, guestUserId },
      });
      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    cartLoading: false,
    addLoadingId: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToCart.pending, (state, action) => {
        state.addLoadingId = action.meta.arg.productId;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.addLoadingId = null;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.addLoadingId = null;
        state.error = action.payload;
      })

      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.productId !== action.payload
        );
      })

      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default cartSlice.reducer;
