---
documentId: reactive-primitives-lesson
title: Reconstruir primitivas reactivas
level: basic
description: Comprende cómo reactive, ref, readonly, toRef y toRefs reutilizan el seguimiento de dependencias.
---

## Una base, varias primitivas

Vue necesita observar valores con formas distintas: objetos cuyas propiedades cambian, primitivos reemplazables, vistas de solo lectura y propiedades que deben conservar su enlace al transportarse. Sus primitivas reactivas resuelven estas necesidades mediante distintas rutas hacia el mismo modelo de dependencias:

- `reactive()` intercepta las propiedades de un objeto.
- `ref()` representa cualquier valor mediante una propiedad `.value`.
- `readonly()` expone un objeto sin permitir escrituras a través de esa vista.
- `toRef()` crea una referencia enlazada con una propiedad existente.
- `toRefs()` realiza ese enlace para varias propiedades.

Las implementaciones de esta lesson son modelos pedagógicos reducidos. Comparten el comportamiento esencial de estas APIs, pero no reproducen todas las optimizaciones, colecciones ni casos límite del código fuente de Vue.

---

## Construir reactive con un Proxy

`reactive()` recibe un objeto y retorna un `Proxy`. Sus traps conectan cada lectura con `track()` y cada escritura efectiva con `trigger()`:

```js
function isObject(value) {
  return value !== null && typeof value === 'object';
}

function reactive(target) {
  if (!isObject(target)) return target;

  return new Proxy(target, {
    get(object, key, receiver) {
      const value = Reflect.get(object, key, receiver);
      track(object, key);
      return isObject(value) ? reactive(value) : value;
    },
    set(object, key, value, receiver) {
      const previousValue = Reflect.get(object, key, receiver);
      const updated = Reflect.set(object, key, value, receiver);

      if (updated && !Object.is(previousValue, value)) {
        trigger(object, key);
      }

      return updated;
    },
  });
}
```

`Reflect.get()` y `Reflect.set()` conservan la semántica normal de acceso del objeto. La comparación con `Object.is()` evita notificar efectos cuando la asignación no cambia realmente el valor.

El trap `get` convierte los objetos anidados cuando se leen. Esta conversión perezosa evita recorrer por adelantado todo el árbol y hace que una lectura como `state.user.name` pueda seguir tanto `user` como `name`.

---

## Conservar la identidad del proxy

La versión anterior crea un proxy nuevo cada vez que encuentra el mismo objeto anidado. Eso rompe comparaciones de identidad y genera envoltorios innecesarios:

```js
state.user === state.user; // debería ser true
```

Un `WeakMap` puede recordar el proxy creado para cada objeto objetivo:

```js
const reactiveCache = new WeakMap();

function reactive(target) {
  if (!isObject(target)) return target;

  const cachedProxy = reactiveCache.get(target);
  if (cachedProxy) return cachedProxy;

  const proxy = new Proxy(target, reactiveHandlers);
  reactiveCache.set(target, proxy);
  return proxy;
}
```

La caché hace estable la relación `objeto original → proxy`. También permite que el objeto original pueda ser liberado cuando deja de estar en uso, porque las claves de un `WeakMap` no lo retienen por sí solas.

El proxy y el objeto original siguen siendo identidades diferentes. Las lecturas y escrituras reactivas deben realizarse mediante el proxy para pasar por sus traps.

---

## Dar una propiedad reactiva a cualquier valor

Un `Proxy` solo puede envolver objetos. Un número o un string no ofrece propiedades que puedan interceptarse, pero un contenedor sí. `ref()` coloca el valor en `.value` y sigue esa propiedad:

```js
function toReactive(value) {
  return isObject(value) ? reactive(value) : value;
}

function ref(initialValue) {
  let rawValue = initialValue;
  let currentValue = toReactive(initialValue);

  const reference = {
    get value() {
      track(reference, 'value');
      return currentValue;
    },
    set value(nextValue) {
      if (Object.is(rawValue, nextValue)) return;

      rawValue = nextValue;
      currentValue = toReactive(nextValue);
      trigger(reference, 'value');
    },
  };

  return reference;
}
```

El getter y el setter de `.value` cumplen el mismo papel que los traps de un proxy. Guardar por separado `rawValue` permite comparar la nueva asignación antes de convertir un objeto en reactivo.

Si el valor de un ref es un objeto, `toReactive()` lo convierte profundamente al acceder a sus propiedades. Además, el ref puede reemplazar el objeto completo porque la identidad reemplazable vive en `.value`.

---

## Exponer una vista de solo lectura

`readonly()` no congela ni copia el estado. Crea otro proxy que permite leer, pero rechaza escrituras realizadas a través de él:

```js
function readonly(target) {
  if (!isObject(target)) return target;

  return new Proxy(target, {
    get(object, key, receiver) {
      const value = Reflect.get(object, key, receiver);
      return isObject(value) ? readonly(value) : value;
    },
    set(object, key) {
      console.warn(`Cannot set ${String(key)} on readonly state`);
      return true;
    },
  });
}
```

La conversión anidada hace que la restricción también alcance objetos interiores. Una implementación completa conserva estos proxies en su propia caché para mantener su identidad.

Cuando la fuente ya es reactiva, `readonly(state)` conserva una conexión viva con ella: leer la vista alcanza el proxy reactivo subyacente y puede recopilar dependencias. Cambiar `state` actualiza a sus consumidores, mientras que escribir mediante la vista readonly se bloquea.

```js
const state = reactive({ count: 0 });
const publicState = readonly(state);

state.count += 1;       // permitido
publicState.count += 1; // bloqueado
```

Por eso `readonly()` expresa quién puede modificar el estado; no crea una instantánea inmutable.

---

## Mantener el enlace al desestructurar

Desestructurar una propiedad reactiva copia su valor actual en una variable local. La variable ya no pasa por el proxy:

```js
const state = reactive({ count: 0 });
const { count } = state;

state.count += 1;
console.log(count); // 0
```

`toRef()` resuelve este problema con un objeto cuya propiedad `.value` delega sus lecturas y escrituras a la propiedad original:

```js
function toRef(object, key, defaultValue) {
  return {
    get value() {
      const value = object[key];
      return value === undefined ? defaultValue : value;
    },
    set value(nextValue) {
      object[key] = nextValue;
    },
  };
}
```

Este ref no guarda una copia ni necesita un grafo independiente. Leer `count.value` lee realmente `state.count`, y el proxy se encarga de `track()`. Escribir `count.value` modifica `state.count`, y el proxy llama a `trigger()`.

```js
const count = toRef(state, 'count');

count.value += 1;
console.log(state.count); // 1
```

El enlace funciona en ambos sentidos. Si el objeto es readonly, el setter del ref también termina encontrando la restricción de esa vista.

---

## Convertir varias propiedades con toRefs

`toRefs()` aplica `toRef()` a las propiedades enumerables que existen en el momento de la llamada:

```js
function toRefs(object) {
  const result = Array.isArray(object) ? new Array(object.length) : {};

  Object.keys(object).forEach((key) => {
    result[key] = toRef(object, key);
  });

  return result;
}
```

Ahora la desestructuración conserva objetos ref en lugar de copiar valores sueltos:

```js
const state = reactive({ count: 0, label: 'Total' });
const { count, label } = toRefs(state);
```

`count.value` y `label.value` continúan enlazados con sus propiedades correspondientes. Sin embargo, una propiedad añadida a `state` después de llamar a `toRefs()` no aparece automáticamente en el objeto resultante. Para enlazar una clave opcional o futura se puede usar `toRef(state, 'newKey')` directamente.

---

## Elegir la forma del enlace

Estas primitivas no representan cinco sistemas distintos. Todas crean una ruta de lectura y escritura hacia el mismo modelo de dependencias:

```text
reactive → propiedad interceptada por Proxy
ref      → propiedad value con getter y setter
readonly → vista que conserva lecturas y bloquea escrituras
toRef    → value enlazado con una propiedad existente
toRefs   → conjunto de enlaces creado propiedad por propiedad
```

`reactive()` resulta natural para un objeto cuya identidad se conserva mientras cambian sus propiedades. `ref()` añade una identidad reemplazable y también admite primitivos. `readonly()` limita la autoridad de escritura, mientras `toRef()` y `toRefs()` permiten transportar propiedades sin perder su conexión.

Debajo de estas formas siguen estando las mismas preguntas: qué lectura debe llamar a `track()`, qué escritura debe llamar a `trigger()` y qué identidad representa la dependencia. Comprender esas decisiones permite razonar sobre cada primitiva como una variación del mismo mecanismo, no como una API aislada o mágica.
