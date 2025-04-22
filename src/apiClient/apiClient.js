import axios from "axios";
import { toast } from "react-toastify";
// const API_URL =
//   process.env.NODE_ENV === "development"
//     ? process.env.NEXT_PUBLIC_API_ENDPOINT
//     : process.env.NEXT_PUBLIC_PROD_API_ENDPOINT;
const API_URL = "";

const apiClient = axios.create({
  baseURL: API_URL,
});

export const apiRoute = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  async (config) => {
    let token = null;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/sign-in";
      }
      toast.error("Session expired. Please log in again.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
