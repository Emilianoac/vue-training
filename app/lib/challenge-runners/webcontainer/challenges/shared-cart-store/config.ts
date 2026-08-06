import type { WebContainerChallenge } from "../../types";
import appEn from "./App.en.vue?raw";
import appEs from "./App.es.vue?raw";
import cartEn from "./cart.en.ts?raw";
import cartEs from "./cart.es.ts?raw";
import cartSolution from "./cart.solution.ts?raw";
import summaryEn from "./CartSummary.en.vue?raw";
import summaryEs from "./CartSummary.es.vue?raw";
import summarySolutionEn from "./CartSummary.solution.en.vue?raw";
import summarySolutionEs from "./CartSummary.solution.es.vue?raw";
import entry from "./main.ts?raw";
import catalogEn from "./ProductCatalog.en.vue?raw";
import catalogEs from "./ProductCatalog.es.vue?raw";
import testEn from "./SharedCartStore.test.en.ts?raw";
import testEs from "./SharedCartStore.test.es.ts?raw";

export function createSharedCartStoreChallenge(locale: string): WebContainerChallenge {
  const en = locale === "en";

  return {
    id: "shared-cart-store",
    addons: ["pinia"],
    entry,
    files: [
      {
        content: en ? cartEn : cartEs,
        editable: true,
        icon: "ts",
        label: "cart.ts",
        path: "src/stores/cart.ts",
        solution: cartSolution,
      },
      {
        content: en ? summaryEn : summaryEs,
        editable: true,
        icon: "vue",
        label: "CartSummary.vue",
        path: "src/CartSummary.vue",
        solution: en ? summarySolutionEn : summarySolutionEs,
      },
      {
        content: en ? catalogEn : catalogEs,
        editable: false,
        icon: "vue",
        label: "ProductCatalog.vue",
        path: "src/ProductCatalog.vue",
      },
      {
        content: en ? appEn : appEs,
        editable: false,
        icon: "vue",
        label: "App.vue",
        path: "src/App.vue",
        preview: true,
      },
      {
        content: en ? testEn : testEs,
        editable: false,
        icon: "test",
        label: "SharedCartStore.test.ts",
        path: "src/SharedCartStore.test.ts",
      },
    ],
  };
}
