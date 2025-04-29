import apiClient from "@/apiClient/apiClient";

export class UsersServices {
  static async fetchUsers(userType) {
    return await apiClient.get(`/api/users?type=${userType}`);
  }

  static async resetPassword(userId) {
    return await apiClient.put(`/api/users?userId=${userId}`, {
      password: "1234",
    });
  }

  static async deleteUser(userId) {
    return await apiClient.delete(`/api/users?userId=${userId}`);
  }
}
