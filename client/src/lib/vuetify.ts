import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";

export const vuetify = createVuetify({
  components,
  directives,
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#DB4767",
          primaryLight: "#e67e95",
          secondary: "#47B3B7",
          accent: "#C1BCBD",
          accentLight: "#c1bcbd",
          white: "#fff",
          black: "#000"
        }
      }
    }
  }
});
