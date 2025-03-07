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
    },
    {
      path: "/challenges/:id",
      name: "challenge",
      component: () => import("@/views/challenges/ChallengeProfileView.vue"),
    },
    {   
      path: "/not-found",
      name: "not-found", 
      component: () => import("@/views/NotFoundView.vue")
    },
    { 
      path: "/:pathMatch(.*)*", 
      redirect: "/not-found",
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
