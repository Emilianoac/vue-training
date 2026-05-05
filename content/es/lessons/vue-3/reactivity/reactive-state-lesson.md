---
documentId: reactive-state-lesson
title: Fundamentos de la Reactividad en Vue 3
level: basic
description: Aprende los conceptos fundamentales de la reactividad en Vue 3.
---

## ¿Qué es la reactividad?
La reactividad es el mecanismo que permite que la interfaz de usuario se sincronice automáticamente con el estado de la 
aplicación. 

En términos técnicos, es un patrón de diseño que permite a Vue interceptar el acceso y la modificación de los 
datos para disparar efectos secundarios (como actualizar el DOM).

``` vue
<script setup>
import { reactive } from "vue";
const state = reactive({ count: 0 });
// Cuando haces esto:
state.count++;
// Vue detecta el cambio y actualiza la interfaz automáticamente.
</script>
```

## ¿Cómo funciona la reactividad en Vue?
En JavaScript puro, si tienes `a = 1` y `b = a + 1`, y luego cambias `a = 5`, el valor de `b` seguirá siendo 2. 
No hay un vínculo automático. 

``` javascript
let a = 1;
let b = a + 1; // b es 2
a = 5; // b sigue siendo 2, no cambia automáticamente
```

Vue utiliza Proxies de JavaScript para "envolver" tus datos. De esta forma,
Vue puede interceptar cuando accedes o modificas una propiedad.

Cuando accedes a un valor, Vue usa `track` para guardar qué funciones lo están usando.  
Cuando ese valor cambia, Vue usa `trigger` para volver a ejecutar esas funciones.

**Ejemplo simplificado de cómo funciona internamente:**

```javascript
function reactive(target) {
  return new Proxy(target, {
    get(obj, prop) {
      track(obj, prop); // guarda qué depende de esta propiedad
      return obj[prop];
    },
    set(obj, prop, value) {
      obj[prop] = value;
      trigger(obj, prop); // vuelve a ejecutar esas dependencias
      return true;
    }
  });
}
```

## Estado Reactivo
En Vue, el estado reactivo se refiere a los datos de tu aplicación que pueden cambiar con el tiempo y cuya actualización se refleja automáticamente en la interfaz de usuario.

Existen dos formas principales de declarar estado reactivo con la Composition API: ref y reactive.

### ref()
Es la forma más común. Puede guardar cualquier tipo de dato (primitivos como strings y números, o objetos).

- **Acceso:** En el bloque `<script>`, debes usar siempre .value. En el `<template>`, Vue lo desempaqueta automáticamente.

```vue
<script setup>
import { ref } from "vue";

const count = ref(0);
const name = ref("Vue Developer");

// Para modificar:
count.value++;
</script>
```
---

### reactive()
Solo funciona con objetos o arrays. No permite tipos primitivos.

- **Acceso:** No usa .value. Se comporta como un objeto normal.

- **Limitación:** Si intentas desestructurarlo (ej: const `{ x } = reactive({...})`), pierdes la reactividad 
a menos que uses utilidades como toRefs.

```vue
<script setup>
import { reactive } from "vue";

const user = reactive({
  name: "Vue User",
  score: 10
});

// Para modificar:
user.score += 5;
</script>
```

## Optimización: shallowRef y shallowReactive
A veces, envolver objetos muy grandes o complejos (como una instancia de un mapa o un buffer de datos) en una reactividad profunda puede afectar el rendimiento. Para esto existen las versiones "superficiales" (shallow).

### shallowRef()
A diferencia de `ref`, Vue solo observa el cambio si reasignas el `.value`. **No rastrea cambios** en las 
propiedades internas del objeto.

```vue
<script setup>
const state = shallowRef({ count: 1 });

// Esto NO dispara una actualización en la interfaz:
state.value.count = 2 ;

// Esto SÍ dispara la actualización:
state.value = { count: 2 };
</script>
```
---

### shallowReactive()
Similar a `reactive`, pero solo la raíz del objeto es reactiva. Las propiedades anidadas no son transformadas en proxies. 
Es ideal cuando recibes estructuras de datos de solo lectura o integras librerías externas de terceros.

```vue
<script setup>
const state = shallowReactive({
  user: {
    name: "Vue User",
    score: 10
  }
});

// Esto NO dispara una actualización en la interfaz:
state.user.score += 5;
</script>
```

## Cuadro Comparativo de Uso
| Herramienta        | Tipo de Dato           | Acceso en script | Reactividad Profunda 
|--------------------|------------------------|------------------|---------------------|
| `ref()`            | Primitivos y objetos   | `.value`         | Sí                  |
| `reactive()`       | Solo objetos/arrays    | Directo          | Sí                  |
| `shallowRef()`     | Primitivos y objetos   | `.value `        | No                  |
| `shallowReactive()`| Solo objetos/arrays    | Directo          | No                  |