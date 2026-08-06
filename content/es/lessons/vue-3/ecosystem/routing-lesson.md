---
documentId: routing-lesson
title: Routing con Vue Router
level: basic
description: Aprende a relacionar URLs con vistas, manejar parámetros y navegar de forma declarativa o programática.
---

## Routing en Vue

El routing relaciona una URL con el estado visible de una aplicación. En una SPA, Vue Router actualiza la URL y los componentes activos sin solicitar un documento HTML completo en cada navegación.

Una URL útil permite:

- Acceder directamente a una vista.
- Compartir o guardar una ubicación.
- Usar el historial del navegador.
- Representar parámetros, filtros y secciones activas.

---

## Configurar el router

Una aplicación Vue sin framework define sus rutas y crea una instancia del router.

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

`createWebHistory` usa URLs normales como `/users/42`. El servidor de producción debe devolver la aplicación también cuando recibe directamente una de esas rutas.

---

## Renderizar y enlazar

`RouterView` indica dónde se renderiza el componente de la ruta activa. `RouterLink` crea enlaces que Vue Router puede interceptar para navegar en el cliente.

```vue
<template>
  <nav>
    <RouterLink :to="{ name: 'home' }">Inicio</RouterLink>
    <RouterLink :to="{ name: 'user', params: { id: '42' } }">
      Perfil
    </RouterLink>
  </nav>

  <RouterView />
</template>
```

Los enlaces continúan representándose como elementos `a`, por lo que conservan comportamientos como abrir en una pestaña nueva y copiar su dirección.

---

## Route y router

Los nombres se parecen, pero representan responsabilidades diferentes:

- `useRoute()` entrega información reactiva sobre la ubicación actual.
- `useRouter()` entrega la instancia que permite iniciar navegaciones.

```ts
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

console.log(route.params.id);

function goHome() {
  return router.push({ name: "home" });
}
```

Piensa en `route` como el resultado actual y en `router` como el mecanismo para cambiarlo.

---

## Params y query

Un segmento precedido por `:` define un parámetro dinámico:

```ts
{ path: "/users/:id", name: "user", component: UserPage }
```

La URL `/users/42` produce `route.params.id === "42"`. Los params identifican normalmente el recurso o la sección que forma parte del camino.

La query representa opciones adicionales:

```txt
/users/42?tab=activity&page=2
```

```ts
route.params.id;
route.query.tab;
route.query.page;
```

Filtros, orden y paginación suelen encajar mejor en la query porque la vista principal continúa siendo la misma.

---

## Reaccionar a un cambio de ruta

Al navegar de `/users/42` a `/users/73`, ambas URLs coinciden con el mismo registro de ruta. Vue Router reutiliza la instancia del componente en lugar de desmontarla y crear otra.

Por eso un `onMounted` no vuelve a ejecutarse. Si el contenido depende del identificador, observa esa propiedad concreta:

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

Evita observar el objeto `route` completo: contiene más información reactiva de la que normalmente necesita el efecto.

---

## Rutas anidadas

Las rutas anidadas representan interfaces donde una vista padre permanece mientras cambia una región interior.

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

`UserLayout.vue` necesita su propio `RouterView` para mostrar la ruta hija:

```vue
<template>
  <UserHeader />
  <RouterView />
</template>
```

El path de una ruta hija no comienza con `/` cuando debe continuar el camino del padre.

---

## Navegación programática

Usa navegación programática cuando el cambio depende de una acción o resultado, como completar un formulario.

```ts
async function finishOnboarding() {
  await saveProfile();
  await router.push({ name: "dashboard" });
}
```

- `router.push` agrega una entrada al historial.
- `router.replace` reemplaza la entrada actual.
- `router.back` vuelve a la entrada anterior.

`replace` resulta útil para redirecciones que no deberían devolver al usuario a una pantalla transitoria.

---

## Guards y metadatos

Los guards permiten cancelar o redirigir una navegación. Los metadatos describen políticas de una ruta sin ejecutarlas por sí solos.

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

Retornar una ubicación inicia una redirección; retornar `false` cancela la navegación. Si no se retorna nada, el flujo continúa.

Evita redirigir desde login hacia login: una condición incompleta puede producir un ciclo.

---

## Routing en Nuxt

Nuxt utiliza Vue Router, pero genera los registros a partir de `app/pages`:

| Archivo | URL |
| --- | --- |
| `app/pages/index.vue` | `/` |
| `app/pages/users/[id].vue` | `/users/:id` |
| `app/pages/users/[id]/activity.vue` | `/users/:id/activity` |

En Nuxt, `NuxtPage` ocupa el papel de `RouterView`, `NuxtLink` el de `RouterLink` y `navigateTo` cubre la navegación programática habitual. `useRoute` sigue dando acceso a params y query.

Los route middleware de Nuxt cumplen casos parecidos a los guards, pero siguen las convenciones del framework y no son middleware del servidor.

---

## Regla general

> Usa la URL como estado navegable: params para identificar recursos, query para opciones de la vista, enlaces para recorridos normales y navegación programática o guards cuando el flujo dependa de lógica.
