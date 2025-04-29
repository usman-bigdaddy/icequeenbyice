import apiClient from "@/apiClient/apiClient";

export class ProductServices {
  static async create_product(data) {
    return await apiClient.post("/api/products", data);
  }

  static async get_all_products() {
    return await apiClient.get("/api/products");
  }

  static async get_paginated_products(page) {
    return await apiClient.get(`/api/products?page=${page}`);
  }

  static async get_product(product_id) {
    return await apiClient.get(`/api/products?id=${product_id}`);
  }

  static async edit_product(product_id, data) {
    return await apiClient.put(`/api/products?id=${product_id}`, data);
  }

  static async delete_product(product_id) {
    return await apiClient.delete(`/api/products?id=${product_id}`);
  }
}
