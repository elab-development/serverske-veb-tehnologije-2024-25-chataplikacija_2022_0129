import axios, { Axios, AxiosError } from "axios";
import type { ApiError } from "./types";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api` || "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      const expiresAt = localStorage.getItem("token_expires_at");
      if (expiresAt) {
        const expirationDate = new Date(expiresAt);
        if (expirationDate <= new Date()) {
          localStorage.removeItem("token");
          localStorage.removeItem("token_expires_at");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return Promise.reject(new Error("Token expired"));
        }
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("token_expires_at");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login"){
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
