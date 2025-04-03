import type { App } from "vue";
import TopLoader from "../components/TopLoader.vue";
import { useTopLoader } from "../composables/useTopLoader";

export default {
  install(app: App) {
    app.component("TopLoader", TopLoader);
    app.config.globalProperties.$topLoader = useTopLoader();
  }
};
