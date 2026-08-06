import { createPinia } from "pinia";
import { createApp } from "vue";
// @ts-ignore This challenge file exists after the source is mounted in WebContainer.
import App from "./App.vue";

createApp(App).use(createPinia()).mount("#app");
