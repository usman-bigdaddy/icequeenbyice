import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ProductServices } from "@/services/product-services";

export const create_product = createAsyncThunk(
  "products/create",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await ProductServices.create_product(data);
      toast.success("Product Added Successfully");
      return response.data;
    } catch (error) {
      toast.error(`${error.response.data.error}` || "something went wrong");
      return rejectWithValue(`${error.response}`);
    }
  }
);

export const get_all_products = createAsyncThunk(
  "products/get-all",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ProductServices.get_all_products();
      return response.data;
    } catch (error) {
      toast.error(`${error.response.data.error}` || "something went wrong");
      return rejectWithValue(`${error.response}`);
    }
  }
);

export const get_paginated_products = createAsyncThunk(
  "products/get-paginated",
  async (page, { rejectWithValue }) => {
    try {
      const response = await ProductServices.get_paginated_products(page);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong");
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const get_product = createAsyncThunk(
  "products/get-product",
  async (product_id, { rejectWithValue }) => {
    try {
      const response = await ProductServices.get_product(product_id);
      return response.data;
    } catch (error) {
      toast.error(`${error.response.data.error}` || "something went wrong");
      return rejectWithValue(`${error.response}`);
    }
  }
);

export const edit_product = createAsyncThunk(
  "products/edit",
  async ({ product_id, data }, { rejectWithValue, dispatch }) => {
    try {
      const response = await ProductServices.edit_product(product_id, data);
      toast.success("Product Updated Successfully");
      dispatch(get_all_products());
    } catch (error) {
      toast.error(`${error.response.data.error}` || "something went wrong");
      return rejectWithValue(`${error.response}`);
    }
  }
);

export const delete_product = createAsyncThunk(
  "products/delete",
  async (product_id, { rejectWithValue, dispatch }) => {
    try {
      const response = await ProductServices.delete_product(product_id);
      toast.success(`${response.data}` || "Product deleted successfully");
      dispatch(get_all_products());
    } catch (error) {
      console.log("error", error);
      toast.error(
        `${error.response.data.error}` || "something went wrong in delete"
      );
      return rejectWithValue(`${error.response}`);
    }
  }
);
