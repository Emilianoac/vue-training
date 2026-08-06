---
documentId: routing-lesson
title: Routing with Vue Router
level: basic
description: Learn to connect URLs with views, handle parameters, and navigate declaratively or programmatically.
---

## Routing in Vue

Routing connects a URL to the visible state of an application. In a SPA, Vue Router updates the URL and active components without requesting a complete HTML document for every navigation.

A useful URL lets people:

- Open a view directly.
- Share or bookmark a location.
- Use browser history.
- Represent parameters, filters, and active sections.

---

## Configuring the router

A Vue application without a framework defines its routes and creates a router instance.

```ts
import { createRouter, createWebHistory } from "vue-router";
import HomePage from "./pages/HomePage.vue";
import UserPage from "./pages/UserPage.vue";

const routes = [
  { path: "/", name: "home", component: HomePage },
  { path: "/users/:id", name: "user", component: UserPage },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
```

`createWebHistory` uses regular URLs such as `/users/42`. The production server must also return the application when one of those routes is requested directly.

---

## Rendering and linking

`RouterView` marks where the active route component is rendered. `RouterLink` creates links Vue Router can intercept for client-side navigation.

```vue
<template>
  <nav>
    <RouterLink :to="{ name: 'home' }">Home</RouterLink>
    <RouterLink :to="{ name: 'user', params: { id: '42' } }">
      Profile
    </RouterLink>
  </nav>

  <RouterView />
</template>
```

Links still render as `a` elements, preserving behaviors such as opening a new tab and copying their address.

---

## Route and router

Their names are similar, but they represent different responsibilities:

- `useRoute()` provides reactive information about the current location.
- `useRouter()` provides the instance used to initiate navigation.

```ts
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

console.log(route.params.id);

function goHome() {
  return router.push({ name: "home" });
}
```

Think of `route` as the current result and `router` as the mechanism that changes it.

---

## Params and query

A segment prefixed with `:` defines a dynamic parameter:

```ts
{ path: "/users/:id", name: "user", component: UserPage }
```

The URL `/users/42` produces `route.params.id === "42"`. Params normally identify the resource or section that belongs in the path.

The query represents additional options:

```txt
/users/42?tab=activity&page=2
```

```ts
route.params.id;
route.query.tab;
route.query.page;
```

Filters, sorting, and pagination usually fit better in the query because the main view remains the same.

---

## Reacting to route changes

When navigating from `/users/42` to `/users/73`, both URLs match the same route record. Vue Router reuses the component instance instead of unmounting it and creating another.

This means `onMounted` does not run again. When content depends on the identifier, watch that specific property:

```ts
const route = useRoute();

watch(
  () => route.params.id,
  async (id) => {
    user.value = await fetchUser(String(id));
  },
  { immediate: true },
);
```

Avoid watching the complete `route` object: it contains more reactive information than an effect usually needs.

---

## Nested routes

Nested routes represent interfaces where a parent view remains while an inner region changes.

```ts
const routes = [
  {
    path: "/users/:id",
    component: UserLayout,
    children: [
      { path: "", name: "user", component: UserOverview },
      { path: "activity", name: "user-activity", component: UserActivity },
    ],
  },
];
```

`UserLayout.vue` needs its own `RouterView` to display the child route:

```vue
<template>
  <UserHeader />
  <RouterView />
</template>
```

A child path does not begin with `/` when it should continue the parent's path.

---

## Programmatic navigation

Use programmatic navigation when a route change depends on an action or result, such as completing a form.

```ts
async function finishOnboarding() {
  await saveProfile();
  await router.push({ name: "dashboard" });
}
```

- `router.push` adds a history entry.
- `router.replace` replaces the current entry.
- `router.back` returns to the previous entry.

`replace` is useful for redirects that should not send the user back to a transitional screen.

---

## Guards and metadata

Guards can cancel or redirect navigation. Metadata describes route policies but does not enforce them by itself.

```ts
const routes = [
  {
    path: "/account",
    name: "account",
    component: AccountPage,
    meta: { requiresAuth: true },
  },
];

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {
      name: "login",
      query: { redirect: to.fullPath },
    };
  }
});
```

Returning a location starts a redirect; returning `false` cancels navigation. Returning nothing allows the flow to continue.

Avoid redirecting from login back to login: an incomplete condition can create a loop.

---

## Routing in Nuxt

Nuxt uses Vue Router but generates records from `app/pages`:

| File | URL |
| --- | --- |
| `app/pages/index.vue` | `/` |
| `app/pages/users/[id].vue` | `/users/:id` |
| `app/pages/users/[id]/activity.vue` | `/users/:id/activity` |

In Nuxt, `NuxtPage` fills the role of `RouterView`, `NuxtLink` fills the role of `RouterLink`, and `navigateTo` covers common programmatic navigation. `useRoute` still provides params and query.

Nuxt route middleware handles cases similar to guards, but follows framework conventions and is separate from server middleware.

---

## General rule

> Use the URL as navigable state: params to identify resources, query for view options, links for normal journeys, and programmatic navigation or guards when the flow depends on logic.
