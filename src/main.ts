import "./assets/main.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { i18n } from "./i18n";
import hljsVuePlugin from "./highlight";
import TopLoaderPlugin from "./plugins/topLoader";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(hljsVuePlugin);
app.use(TopLoaderPlugin);
app.use(router);
app.use(i18n);

app.mount("#app");


