import SignUpVue from "@/pages/SignUp/SignUp.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/sign-up",
      component: SignUpVue
    }
  ]
});

export default router;
