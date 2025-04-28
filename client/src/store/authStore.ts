import { reactive } from "vue";

export const authStore = reactive({
  isAuthenticated: localStorage.getItem("access_token") ?? false
});
