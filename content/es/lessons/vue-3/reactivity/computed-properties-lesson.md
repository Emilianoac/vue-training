---
documentId: computed-properties-lesson
title: Propiedades Computadas en Vue 3
level: basic
description: Conceptos fundamentales sobre propiedades computadas, caché y diferencias clave con los métodos tradicionales.
---

## ¿Qué es una propiedad computada?

En el desarrollo con Vue, una propiedad computada es una forma de derivar estado a partir de otros datos reactivos. Es decir, permite calcular valores automáticamente basándose en cambios de otras variables, sin necesidad de actualizarlos manualmente.

Imagina que tienes un contador (`count`) y quieres mostrar su valor duplicado (`doubleCount`). En lugar de escribir código para actualizar `doubleCount` cada vez que `count` cambie, puedes definirlo como una propiedad computada.

De esta manera, Vue se encarga de recalcular el valor solo cuando es necesario:

```vue
<script setup>
import { ref, computed } from "vue";

const count = ref(0);

// La función dentro de computed solo se ejecutará cuando count cambie
const doubleCount = computed(() => count.value * 2);
</script>
```

## ¿Cómo funciona computed()?

La función `computed()` toma una función getter y devuelve un ref reactivo de solo lectura para el valor retornado.

Su característica más importante es el almacenamiento en caché (*caching*).

Vue detecta automáticamente qué valores reactivos son utilizados dentro de la función computada y los registra como dependencias. Una propiedad computada solo se volverá a evaluar cuando alguna de esas dependencias cambie.

Si las dependencias no cambian, cualquier acceso a la computada devolverá el resultado almacenado previamente sin ejecutar la lógica nuevamente.

```vue
<script setup>
import { ref, computed } from "vue";

const count = ref(0);

// La función dentro de computed solo se ejecutará cuando count cambie
const doubleCount = computed(() => count.value * 2);
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double Count: {{ doubleCount }}</p>

    <button @click="count++">
      Increment
    </button>
  </div>
</template>
```

## Propiedades computadas vs métodos

Aunque en el template pueden parecer similares, la diferencia aparece cuando Vue actualiza la interfaz: las propiedades computadas se recalculan solo cuando cambian sus dependencias, mientras que los métodos se ejecutan cada vez que el componente se renderiza o el template los necesita.

---

### Propiedades computadas (computed)

Las propiedades computadas están diseñadas para representar valores derivados del estado reactivo.

- Vue almacena su resultado en caché automáticamente.
- Solo se recalculan cuando cambian sus dependencias.
- Son ideales para transformar o derivar datos reactivos.
- No reciben parámetros.
- Deben retornar un valor y evitar efectos secundarios.

---

### Métodos

Los métodos están diseñados para ejecutar lógica o acciones dentro del componente.

- Se ejecutan cada vez que el componente renderiza.
- No almacenan resultados en caché.
- Pueden recibir parámetros.
- Son útiles para manejar eventos o ejecutar acciones.
- Pueden producir efectos secundarios.

---

### Cuándo usar cada uno

| Escenario                             | ¿Computed?        | ¿Method? | Razón                                                         |
|--------------------------------------|-------------------|----------|---------------------------------------------------------------|
| Formatear una fecha única            | Sí                | Opcional | Se beneficia del caché si depende de estado reactivo          |
| Lógica con parámetros dinámicos      | No                | Sí       | Las computed no reciben argumentos                            |
| Filtrar lista por input              | Sí (generalmente) | A veces  | Depende del tamaño de los datos y frecuencia de actualización |
| Enviar datos a backend               | No                | Sí       | Es una acción, no un valor derivado                           |
| Ejecutar acciones del usuario        | No                | Sí       | Los métodos representan comportamiento                        |

## Reglas para usar computed

- **Solo lectura por defecto:** una computada normal no puede modificarse directamente, aunque puedes crear una computed de escritura usando `get` y `set`.
- **Sin efectos secundarios:** no realices peticiones `fetch`, no modifiques el DOM ni cambies otras variables reactivas dentro de una computada. Su única misión es retornar un valor.
- **Evita mutar el estado original:** si vas a ordenar una lista en una computada, usa `.toSorted()` o una copia del array original para no alterar la fuente de verdad.
- **Deben ser deterministas:** evita usar valores como `Math.random()` o `Date.now()` dentro de una computada, ya que no dependen de reactividad y el caché pierde sentido.

## Computed de escritura

Por defecto, una propiedad computada es de solo lectura. Esto significa que puedes leer su valor, pero no asignarle uno nuevo directamente.

```js
const doubleCount = computed(() => count.value * 2);

doubleCount.value = 10; // Error
```

Sin embargo, Vue también permite crear propiedades computadas de escritura usando un `get` y un `set`.

El `get` define cómo se calcula el valor, mientras que el `set` define qué debe pasar cuando alguien intenta modificarlo.

```vue
<script setup>
import { ref, computed } from "vue";

const firstName = ref("Ada");
const lastName = ref("Lovelace");

const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`;
  },
  set(newValue) {
    const [first, last] = newValue.split(" ");

    firstName.value = first;
    lastName.value = last;
  }
});
</script>

<template>
  <div>
    <p>{{ fullName }}</p>

    <input v-model="fullName" />
  </div>
</template>
```

En este ejemplo, `fullName` sigue siendo un valor derivado, pero también puede actualizar las variables originales cuando cambia.

Las computed de escritura son útiles cuando necesitas exponer una interfaz simple para leer y modificar varios valores reactivos relacionados.

## Ejemplo de implementación

```vue
<script setup>
import { ref, computed } from "vue";

const search = ref("");

const users = ref([
  "Alice",
  "Bob",
  "Charlie"
]);

// Eficiente: solo filtra cuando search o users cambian
const filteredUsers = computed(() => {
  return users.value.filter(user =>
    user.toLowerCase().includes(search.value.toLowerCase())
  );
});
</script>

<template>
  <div>
    <input
      v-model="search"
      placeholder="Search users..."
    />

    <ul>
      <li
        v-for="user in filteredUsers"
        :key="user"
      >
        {{ user }}
      </li>
    </ul>
  </div>
</template>
```