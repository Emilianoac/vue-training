import { createApp } from "vue";
import { createMemoryHistory, createRouter } from "vue-router";
// @ts-ignore These challenge files exist after the source is mounted in WebContainer.
import App from "./App.vue";
// @ts-ignore These challenge files exist after the source is mounted in WebContainer.
import UserProfile from "./UserProfile.vue";

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: "/", redirect: "/users/ada" },
    { path: "/users/:id", name: "user", component: UserProfile },
  ],
});

async function bootstrap() {
  await router.push("/users/ada");
  await router.isReady();
  createApp(App).use(router).mount("#app");
}

void bootstrap();
