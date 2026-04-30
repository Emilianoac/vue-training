---
documentId: computed-properties
title: Fundamentos de la Reactividad en Vue 3
level: basic
description: Conceptos fundamentales sobre propiedades computadas, caché y diferencias clave con los métodos tradicionales.
---

En el desarrollo con Vue, la derivación de estado es el proceso de calcular valores a partir de otras fuentes de estado existentes. En lugar de mutar manualmente una variable cada vez que otra cambia, utilizamos herramientas que reaccionan y calculan el nuevo valor automáticamente.

Imagina que tienes un contador (`count`) y quieres mostrar su valor duplicado (`doubleCount`). En lugar de escribir código para actualizar `doubleCount` cada vez que `count` cambie, Vue ofrece una solución elegante: las propiedades computadas (computed properties).

---

## ¿Qué es computed?

La función computed() toma una función getter y devuelve un objeto ref reactivo de solo lectura para el valor devuelto. Su característica más importante es el almacenamiento en caché (caching).

Una propiedad computada solo se volverá a evaluar cuando alguna de sus dependencias reactivas haya cambiado. Si las dependencias no cambian, cualquier acceso a la computada devolverá el resultado almacenado previamente sin ejecutar la lógica de nuevo.

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
    <button @click="count++">Increment</button>
  </div>
</template>
```

---

## Computed vs Methods
Aunque visualmente pueden parecer similares en el template, su comportamiento interno define cuándo usar cada uno.

### Propiedades Computadas (computed)

- **Caché inteligente:** Ideal para operaciones costosas (filtrar arrays largos, cálculos complejos).
- **Declarativas:** Representan un valor derivado.
- **Sincronía:** Deben ser funciones puras y sincronas.

### Métodos
- **Sin caché:** Se ejecutan cada vez que se acceden, sin importar si las dependencias han cambiado o no.
- **Imperativos:** Ideales para llamadas a APIs, mutaciones de estado o manejo de eventos (clicks, submit).
- **Argumentos:** Pueden aceptar parámetros, a diferencia de las computadas.


### Cuándo usar cada uno


| Escenario                        | ¿Computed?         | ¿Method? | Razón                                                                 |
|----------------------------------|--------------------|----------|-----------------------------------------------------------------------|
| Formatear una fecha única        | Sí                 | Opcional | Se beneficia del caché si depende de estado reactivo                  |
| Formatear muchas fechas          | No                 | Sí       | Computed no acepta parámetros ni escala bien                          |
| Filtrar lista por input          | Sí (generalmente)  | A veces  | Depende del tamaño de los datos y la frecuencia de actualización      |
| Enviar datos a backend           | No                 | Sí       | Es una acción, no un valor derivado                                   |
| Lógica con parámetros            | No                 | Sí       | Las computed no reciben argumentos 

---

## Reglas para usar computed

- **Solo lectura:** Por defecto, no intentes asignar valores a una computada (myComputed.value = x fallará).

- **Sin efectos secundarios:** No realices peticiones fetch, no modifiques el DOM ni cambies otras variables reactivas dentro de una computada. Su única misión es retornar un valor.

- **Evita mutar el estado original:** Si vas a ordenar una lista en una computada, usa .toSorted() o una copia del array original para no alterar la fuente de verdad.

Ejemplo de implementación:

```vue
<script setup>
import { ref, computed } from "vue";
const search = ref('')
const users = ref(['Alice', 'Bob', 'Charlie'])

// Eficiente: Solo filtra cuando 'search' o 'users' cambian
const filteredUsers = computed(() => {
  return users.value.filter(user => user.toLowerCase().includes(search.value.toLowerCase()));
})
</script>

<template>
  <div>
    <input v-model="search" placeholder="Search users..." />
    <ul>
      <li v-for="user in filteredUsers" :key="user">{{ user }}</li>
    </ul>
  </div>
</template>
```