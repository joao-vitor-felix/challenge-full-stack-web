import Home from "@/pages/Home/Home.vue";
import SignIn from "@/pages/SignIn/SignIn.vue";
import SignUp from "@/pages/SignUp/SignUp.vue";
import { authStore } from "@/store/authStore";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: Home,
      name: "home"
    },
    {
      path: "/sign-up",
      component: SignUp,
      name: "sign-up"
    },
    {
      path: "/sign-in",
      component: SignIn,
      name: "sign-in"
    }
  ]
});

router.beforeEach(to => {
  if (!authStore.isAuthenticated && to.name !== "sign-in" && to.name !== "sign-up") {
    return {
      name: "sign-in"
    };
  }

  if (authStore.isAuthenticated && (to.name === "sign-in" || to.name === "sign-up")) {
    return {
      name: "home"
    };
  }
});

export default router;
