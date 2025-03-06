import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/challenges",
      name: "challenges",
      component: () => import("@/views/challenges/ChallengesView.vue"),
    }
  ],
})

export default router
