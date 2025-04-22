import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AdminAuthServices } from "@/services/admin-auth-services";
import { toast } from "react-toastify";
import apiClient from "@/apiClient/apiClient";
import { fetchUsers } from "../users/usersThunk";
import { apiRoute } from "@/apiClient/apiClient";

export const signinUser = createAsyncThunk(
  "auth/signin",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await AdminAuthServices.signin(credentials);
      // localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to login"
      );
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (token, { rejectWithValue }) => {
    try {
      const response = await apiRoute.post("/api/custom-login", {
        provider: "google",
        token,
      });

      const user = response.data.user;
      const guestId = localStorage.getItem("guestId");

      if (guestId) {
        try {
          await apiClient.post("/api/cart/merge", {
            guestId,
            userId: user.id,
          });
          localStorage.removeItem("guestId");
        } catch (mergeErr) {
          console.error("Cart merge failed:", mergeErr);
        }
      }
      toast.success("Sign In Successfull");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Google login failed");
      return rejectWithValue(
        error.response?.data?.message || "Google login failed"
      );
    }
  }
);

export const add_admin_user = createAsyncThunk(
  "admin/add-admin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AdminAuthServices.add_admin_user(data);
      toast.success("User Added successfully");
      return response.data;
    } catch (error) {
      toast.error(`${error.response.error}` || "something went wrong");
      return rejectWithValue(`${error.response}`);
    }
  }
);

export const change_password = createAsyncThunk(
  "admin/change-password",
  async ({ id, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/api/users?userId=${id}`, {
        password,
      });
      toast.success("Password changed successfully");
      return response.data;
    } catch (error) {
      toast.error(`${error.response.error}` || "something went wrong");
      return rejectWithValue(`${error.response}`);
    }
  }
);

const initialState = {
  add_admin_loading: false,
  loading: false,
  google_loading: false,
  user: {
    id: "",
    name: "",
    email: "",
    role: "",
  },
  token: "",
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // logoutUser: (state) => {
    //   state.user = null;
    //   state.isAuthenticated = false;
    //   state.token = "";
    //   window.localStorage.removeItem("token");
    //   window.localStorage.removeItem("user");
    // },
    // getUser: (state) => {
    //   const user = localStorage.getItem("user");
    //   if (user) {
    //     state.user = JSON.parse(user);
    //     state.isAuthenticated = true;
    //   }
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signinUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signinUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(signinUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginWithGoogle.pending, (state) => {
        state.google_loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.google_loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.google_loading = false;
        state.error = action.payload;
      })

      .addCase(add_admin_user.pending, (state) => {
        state.add_admin_loading = true;
      })
      .addCase(add_admin_user.rejected, (state) => {
        state.add_admin_loading = false;
      })

      .addCase(change_password.pending, (state) => {
        state.loading = true;
      })

      .addCase(change_password.fulfilled, (state) => {
        state.loading = false;
      });
  },
});
export const { logoutUser, getUser } = authSlice.actions;
export default authSlice.reducer;
