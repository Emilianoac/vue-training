import "./assets/main.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { i18n } from "./i18n";
import "highlight.js/styles/stackoverflow-dark.css";
import "highlight.js/lib/common";
import hljsVuePlugin from "@highlightjs/vue-plugin";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(hljsVuePlugin);
app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount("#app");
