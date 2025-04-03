import { createRouter, createWebHashHistory } from "vue-router";
import { useTopLoader } from "@/composables/useTopLoader";
import { i18n } from "@/i18n";
import HomeView from "@/views/HomeView.vue";
 
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {titleKey: "general.home"}
    },
    {
      path: "/challenges",
      name: "challenges",
      component: () => import("@/views/challenges/ChallengesView.vue"),
      meta: {titleKey: "general.challenge.many"}
    },
    {
      path: "/challenges/:id",
      name: "challenge",
      component: () => import("@/views/challenges/ChallengeProfileView.vue"),
    },
    {
      path: "/quizzes",
      name: "quizzes",
      component: () => import("@/views/quizzes/QuizzesView.vue"),
      meta: {titleKey: "general.quiz.many"}
    },
    {
      path: "/quizzes/:id",
      name: "quiz",
      component: () => import("@/views/quizzes/QuizProfileView.vue"),
    },
    {   
      path: "/not-found",
      name: "not-found", 
      component: () => import("@/views/NotFoundView.vue"),
      meta: {titleKey: "general.notFound"}
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

router.beforeEach((to, from, next) => {
  const loader = useTopLoader();
  loader.start();
  document.title = to.meta.titleKey ? `${i18n.global.t(to.meta.titleKey as string)} - Vue Training`   : "Vue Training"
  if (to.meta.title) {
    console.log(to.meta.title)
  }
  next()
});


router.afterEach(() => {
  const loader = useTopLoader();
  loader.finish();
});


export default router
