import { VueQueryPlugin } from "@tanstack/vue-query";
import { createApp } from "vue";
import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import App from "./App.vue";
import { vuetify } from "./lib/vuetify";
import router from "./router";

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.use(VueQueryPlugin);
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: "bottom-right"
} as ToastContainerOptions);

app.mount("#app");
