---
documentId: effect-dependency-tracking-lesson
title: Efectos y seguimiento de dependencias
level: basic
description: Comprende cómo Vue conecta lecturas reactivas con el trabajo que debe actualizarse.
---

## ¿Qué es un efecto reactivo?

Cuando cambia un estado reactivo, Vue necesita saber qué trabajo depende de él. El render de un componente, un `computed` y un watcher utilizan efectos reactivos internamente.

Un efecto reactivo es una función cuyas dependencias se recopilan mientras se ejecuta. Si una de esas dependencias cambia, el efecto puede volver a ejecutarse.

```js
let total;

effect(() => {
  total = state.price * state.quantity;
});
```

En este ejemplo, el efecto lee `price` y `quantity`. Ambas propiedades se convierten en sus dependencias.

Esta lesson utiliza implementaciones pedagógicas reducidas. Explican el modelo, pero omiten optimizaciones y casos internos de la implementación real de Vue.

---

## Seguir lecturas y disparar cambios

El sistema realiza dos operaciones fundamentales:

- `track(target, key)` registra que el efecto activo leyó una propiedad.
- `trigger(target, key)` encuentra los efectos asociados cuando esa propiedad cambia.

Vue 3 puede llamar a estas operaciones automáticamente porque `reactive()` envuelve objetos con un `Proxy`:

```js
function reactive(target) {
  return new Proxy(target, {
    get(object, key) {
      track(object, key);
      return object[key];
    },
    set(object, key, value) {
      object[key] = value;
      trigger(object, key);
      return true;
    },
  });
}
```

El trap `get` observa una lectura y el trap `set` observa una escritura. Solo usar el proxy conserva esta conexión: modificar directamente el objeto original evita sus traps.

---

## Identificar el efecto activo

`track()` necesita saber qué función está leyendo la propiedad. Antes de ejecutar un efecto, el modelo lo guarda temporalmente como `activeEffect`:

```js
let activeEffect;

function effect(fn) {
  const runner = () => {
    activeEffect = runner;

    try {
      fn();
    } finally {
      activeEffect = undefined;
    }
  };

  runner();
  return runner;
}
```

Una lectura fuera de la ejecución de un efecto no crea una dependencia, porque no existe trabajo al que suscribirla. `finally` evita conservar por accidente un efecto activo si la función lanza un error.

---

## Construir el grafo de dependencias

Una clave aislada no identifica una propiedad: distintos objetos pueden tener una clave llamada `count`. Por eso el grafo relaciona tres elementos:

```text
objeto objetivo → clave de propiedad → efectos dependientes
```

Un modelo reducido puede representarlo así:

```js
const targetMap = new WeakMap();

function track(target, key) {
  if (!activeEffect) return;

  let dependenciesMap = targetMap.get(target);
  if (!dependenciesMap) {
    dependenciesMap = new Map();
    targetMap.set(target, dependenciesMap);
  }

  let effects = dependenciesMap.get(key);
  if (!effects) {
    effects = new Set();
    dependenciesMap.set(key, effects);
  }

  effects.add(activeEffect);
}
```

El `WeakMap` permite asociar información con cada objeto sin impedir que JavaScript lo libere cuando deja de usarse. El `Map` separa sus propiedades y el `Set` evita registrar dos veces el mismo efecto para una propiedad.

---

## Notificar solo el trabajo relacionado

`trigger()` recorre el grafo en sentido inverso: localiza el objeto, luego la clave modificada y finalmente sus efectos.

```js
function trigger(target, key) {
  const dependenciesMap = targetMap.get(target);
  const effects = dependenciesMap?.get(key);

  if (!effects) return;

  new Set(effects).forEach((effect) => effect());
}
```

La copia del `Set` crea una lista estable antes de ejecutar los efectos. Esto evita que cambios en las suscripciones durante una ejecución alteren el recorrido actual.

Si un efecto depende de `count` y otro de `name`, cambiar `count` solo notifica al primero. Esa selección fina es el propósito del grafo.

---

## Las dependencias pueden cambiar

Un efecto no siempre lee las mismas propiedades:

```js
effect(() => {
  message = state.showDetails ? state.details : state.summary;
});
```

Cuando `showDetails` es `true`, el efecto depende de `details`. Si después pasa a `false`, debería dejar esa dependencia y comenzar a depender de `summary`. Conservar suscripciones antiguas provocaría ejecuciones innecesarias.

Por eso, antes de recopilar las dependencias de una nueva ejecución, un efecto completo elimina sus conexiones anteriores:

```js
function cleanup(effect) {
  effect.dependencies.forEach((effects) => effects.delete(effect));
  effect.dependencies.length = 0;
}
```

Para que esto funcione, `track()` también registra cada `Set` en una lista perteneciente al efecto. Así la relación puede recorrerse en ambas direcciones:

```text
propiedad → efectos
efecto → propiedades seguidas
```

---

## Efectos anidados

Un único `activeEffect` no basta si un efecto ejecuta otro. Al terminar el efecto interior, debe recuperarse el efecto exterior para que sus siguientes lecturas se registren correctamente.

```js
const effectStack = [];

function runEffect(effect) {
  effectStack.push(effect);
  activeEffect = effect;

  try {
    effect.fn();
  } finally {
    effectStack.pop();
    activeEffect = effectStack.at(-1);
  }
}
```

La pila conserva el contexto de ejecución. Sin ella, las lecturas realizadas por el efecto exterior después del efecto interior quedarían sin registrar o se asociarían al efecto equivocado.

---

## Ejecutar y detener un efecto

Retornar un runner permite ejecutar un efecto manualmente sin crear una suscripción nueva cada vez. Un efecto también necesita poder detenerse cuando su trabajo deja de ser necesario.

```js
const run = effect(() => {
  total = state.price * state.quantity;
});

run();
stop(run);
```

Detenerlo significa eliminarlo de todos los `Set`s guardados en `effect.dependencies`. Una ejecución manual posterior puede calcular el resultado, pero no debería volver a suscribirse automáticamente mientras permanezca detenido.

Esta capacidad evita conservar trabajo y referencias que ya no tienen consumidores. Vue gestiona la vida de muchos efectos al desmontar componentes y al detener watchers o scopes.

---

## El modelo completo

El recorrido fundamental queda así:

```text
ejecutar efecto
→ marcarlo como activo
→ interceptar lecturas
→ guardar dependencias
→ interceptar una escritura
→ localizar suscriptores
→ ejecutar el trabajo relacionado
```

La limpieza mantiene correctas las dependencias dinámicas, la pila conserva el contexto de efectos anidados y `stop()` permite finalizar su ciclo de vida.

Las siguientes subcategorías reutilizarán esta base para explicar primitivas como `ref`, estado derivado, scheduling y renderizado. Aquí lo importante es comprender el grafo que conecta una lectura con el trabajo que una escritura posterior debe notificar.
