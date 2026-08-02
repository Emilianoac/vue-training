---
documentId: component-design-lesson
title: Diseño de componentes en Vue 3
level: basic
description: Aprende a distribuir responsabilidades, definir contratos claros y organizar componentes que resulten fáciles de entender y mantener.
---

## Diseño de componentes

Diseñar un componente no consiste solamente en separar una interfaz en archivos pequeños. También implica decidir **qué responsabilidad tendrá cada pieza**, cómo se comunicará con las demás y dónde vivirá la lógica.

Una buena separación permite cambiar una parte de la interfaz sin comprender o modificar todo el sistema.

---

## Una responsabilidad principal

Un componente resulta más fácil de entender cuando cumple un propósito reconocible. Por ejemplo, un formulario puede recopilar datos y emitirlos, mientras otro componente decide qué hacer con ellos.

El número de líneas o props no determina por sí solo si un componente está mal diseñado. La señal importante es que reúna responsabilidades que cambian por razones distintas.

Algunas señales de alerta son:

- Mezclar obtención de datos, reglas de negocio y varias zonas independientes de la interfaz.
- Necesitar conocer detalles internos para reutilizar el componente.
- Romper comportamientos no relacionados al realizar un cambio pequeño.
- Tener dificultades para describir su propósito con una frase breve.

---

## Contenedores y componentes presentacionales

Una forma habitual de distribuir responsabilidades es separar la **orquestación** de la **presentación**. Este patrón también se conoce como componentes inteligentes y tontos, aunque *contenedor* y *presentacional* describen mejor sus funciones.

### Componente contenedor

Coordina el estado y las acciones de una sección. Puede obtener datos, aplicar reglas de la pantalla y entregar información a otros componentes.

```vue
<script setup lang="ts">
import { onMounted, ref } from "vue";
import UserList from "./UserList.vue";

const users = ref([]);
const loading = ref(true);
const selectedUserId = ref<number | null>(null);

onMounted(async () => {
  users.value = await fetch("/api/users").then((response) => response.json());
  loading.value = false;
});

function openProfile(userId: number) {
  selectedUserId.value = userId;
}
</script>

<template>
  <UserList :users="users" :loading="loading" @select="openProfile" />
</template>
```

### Componente presentacional

Recibe los datos necesarios mediante props y comunica las interacciones mediante eventos. No necesita saber de dónde llegaron los usuarios ni qué ocurrirá al seleccionarlos.

```vue
<script setup lang="ts">
defineProps<{
  users: Array<{ id: number; name: string }>;
  loading: boolean;
}>();

const emit = defineEmits<{
  select: [id: number];
}>();
</script>

<template>
  <p v-if="loading">Cargando...</p>
  <template v-else>
    <button v-for="user in users" :key="user.id" @click="emit('select', user.id)">
      {{ user.name }}
    </button>
  </template>
</template>
```

Esta separación es una herramienta, no una obligación para cada componente. Una pieza pequeña puede manejar estado visual local sin necesitar un contenedor adicional.

---

## Contratos explícitos

Las props y los eventos forman la API pública de un componente. Un contrato claro expone solo lo necesario y utiliza nombres que expresan intención.

```vue
<UserList :users="filteredUsers" :loading="loading" @select="openProfile" />
```

En este contrato:

- `users` contiene la información que debe mostrarse.
- `loading` describe un estado de la interfaz.
- `select` comunica una acción del usuario sin decidir su consecuencia.

Una prop genérica como `data` o un evento llamado `change` pueden esconder demasiados significados. Los nombres específicos facilitan el uso correcto del componente.

---

## Cuándo extraer lógica

No toda lógica debe salir del componente. Un estado puramente visual, como abrir un menú, suele pertenecer a la pieza que lo renderiza.

Conviene considerar un composable cuando la lógica:

- Se reutiliza entre varios componentes.
- Tiene un ciclo de vida o estado propio que puede entenderse de forma independiente.
- Hace difícil leer el propósito visual del componente.

Los servicios pueden encargarse de detalles externos, como peticiones HTTP o persistencia. Así, el componente coordina la interfaz sin conocer cada detalle de infraestructura.

```txt
Componente -> composable -> servicio
```

La extracción debe resolver una necesidad concreta. Crear una capa para cada función pequeña también puede dificultar el seguimiento del código.

---

## Nombres con intención

El nombre debe ayudar a anticipar el propósito del componente antes de abrirlo.

- `UserProfileCard` comunica dominio y representación.
- `UserListContainer` indica que coordina una lista de usuarios.
- `UserFilterForm` expresa una interacción específica.
- `Widget` o `DataBox` dejan su responsabilidad abierta a interpretación.

Los sufijos como `Card`, `List`, `Item`, `Form` o `Dialog` son útiles cuando describen una función real, no cuando se aplican de manera automática.

---

## Organización por funcionalidad

Cuando una aplicación crece, agrupar archivos relacionados por funcionalidad reduce la distancia entre las piezas que suelen cambiar juntas.

```txt
features/
  users/
    components/
      UserListContainer.vue
      UserList.vue
      UserListItem.vue
    composables/
      useUserList.ts
    services/
      user.service.ts
```

No existe una estructura universal. Una aplicación pequeña puede comenzar con carpetas simples y reorganizarse cuando aparezcan límites claros entre funcionalidades.

---

## Guía de decisión

| Situación | Posible decisión |
| --- | --- |
| La pieza solo necesita estado visual local | Mantenerlo en el componente |
| Una sección coordina datos y varias piezas visuales | Usar un componente contenedor |
| La misma interfaz debe funcionar en distintos contextos | Crear un componente presentacional con un contrato claro |
| La lógica se repite o tiene un propósito independiente | Extraerla a un composable |
| El componente mezcla responsabilidades que cambian por separado | Dividirlo según esas responsabilidades |

---

## Regla general

> Separa un componente cuando la división haga más claras sus responsabilidades y contratos. El objetivo no es crear más archivos, sino reducir lo que necesitas comprender para realizar un cambio.
