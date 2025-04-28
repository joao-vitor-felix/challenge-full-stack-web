import { VueQueryPlugin } from "@tanstack/vue-query";
import { createApp } from "vue";
import App from "./App.vue";
import { vuetify } from "./lib/vuetify";
import router from "./router";

const app = createApp(App);

app.use(router);
app.use(vuetify);
app.use(VueQueryPlugin);

app.mount("#app");
