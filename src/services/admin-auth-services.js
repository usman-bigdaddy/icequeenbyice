import apiClient from "@/apiClient/apiClient";

export class AdminAuthServices {
  static async signin(credentials) {
    return await apiClient.post("/api/custom-login", credentials);
  }

  static async add_admin_user(data) {
    return await apiClient.post("/api/add-admin", data);
  }

  static async change_password(id) {
    return await apiClient.put(`/api/users?userId=${id}`, password);
  }
}
