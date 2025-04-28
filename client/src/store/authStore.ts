import { reactive } from "vue";

export const authStore = reactive({
  isAuthenticated: localStorage.getItem("access_token") ?? false,
  login(accessToken: string, refreshToken: string) {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    this.isAuthenticated = true;
  },
  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    this.isAuthenticated = false;
  }
});
