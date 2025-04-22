import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UsersServices } from "@/services/users-services";
import { toast } from "react-toastify";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (userType, { rejectWithValue }) => {
    try {
      const response = await UsersServices.fetchUsers(userType);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch users"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "users/resetPassword",
  async (userId, { rejectWithValue, dispatch }) => {
    try {
      await UsersServices.resetPassword(userId);
      toast.success("Password reset successful");
      dispatch(fetchUsers());
    } catch (error) {
      toast.error("Failed to reset password");
      return rejectWithValue(
        error.response?.data?.error || "Failed to reset password"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, { rejectWithValue, dispatch }) => {
    try {
      await UsersServices.deleteUser(userId);
      toast.success("User deleted successfully");
      dispatch(fetchUsers());
    } catch (error) {
      toast.error("Failed to delete user");
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete user"
      );
    }
  }
);
