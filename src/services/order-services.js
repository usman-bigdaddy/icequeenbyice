import apiClient from "@/apiClient/apiClient";

export class OrderService {
  static async fetchOrder(id) {
    return await apiClient.get(`/api/orders/${id}`);
  }

  static async updateOrderStatus(id, status) {
    return await apiClient.put(`/api/orders/${id}`, { status });
  }

  static async get_pending_orders() {
    return await apiClient.get("/api/orders?status=PENDING");
  }
}
