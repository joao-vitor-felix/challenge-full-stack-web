import { AuthService } from "@/services/AuthService";
import { authStore } from "@/store/authStore";
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000"
});

api.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem("refresh_token");

    if (originalRequest.url === "/auth/refresh-token" || !refreshToken) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      authStore.isAuthenticated = false;
      return Promise.reject(error);
    }

    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await AuthService.refreshToken(refreshToken);
    localStorage.setItem("access_token", newAccessToken);
    localStorage.setItem("refresh_token", newRefreshToken);
    authStore.isAuthenticated = true;

    return api(originalRequest);
  }
);
