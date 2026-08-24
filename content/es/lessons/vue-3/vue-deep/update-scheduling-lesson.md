---
documentId: update-scheduling-lesson
title: Programar actualizaciones reactivas
level: basic
description: Comprende cómo Vue agrupa jobs, ordena actualizaciones y coordina nextTick y el flush de watchers.
---

## Separar una invalidación de su ejecución

Cuando cambia una dependencia reactiva, el sistema sabe qué efectos quedaron invalidados. Eso no obliga a ejecutarlos inmediatamente. Entre la notificación y la ejecución puede existir un scheduler:

```js
function triggerEffect(effect) {
  if (effect.scheduler) {
    effect.scheduler(effect.run);
  } else {
    effect.run();
  }
}
```

Un efecto ejecutado de forma síncrona observa cada mutación intermedia. Un efecto programado puede esperar, agruparse con otras invalidaciones y ejecutarse una vez con el estado final del bloque síncrono.

```js
count.value = 1;
count.value = 2;
count.value = 3;
```

Las tres escrituras siguen ocurriendo inmediatamente. Lo que se aplaza es el trabajo derivado, como actualizar un componente. Si su job se deduplica, el render lee directamente `3` y evita producir interfaces intermedias para `1` y `2`.

Los modelos de esta lección son implementaciones pedagógicas reducidas. Conservan las responsabilidades esenciales del scheduler de Vue, pero omiten flags internos, optimizaciones y manejo completo de casos recursivos.

---

## Trabajar con jobs estables

La unidad que entra a la cola es un **job**: una función con identidad estable que representa trabajo pendiente. Para una instancia de componente puede ser su función de actualización:

```js
function setupRenderEffect(instance) {
  const update = () => renderComponent(instance);

  instance.update = update;
  instance.effect = effect(update, {
    scheduler: () => queueJob(update),
  });
}
```

Es importante reutilizar la misma función `update`. Si el scheduler creara un wrapper nuevo en cada invalidación, un `Set` no podría reconocer que todos representan el mismo trabajo:

```js
// Pierde identidad en cada llamada.
queueJob(() => instance.update());

// Conserva una identidad deduplicable.
queueJob(instance.update);
```

Un job también puede guardar metadatos. Un `id` permite ordenar componentes y una marca `pre` ubica un watcher antes del update de su propia instancia.

```js
instance.update.id = instance.uid;
watcherJob.id = instance.uid;
watcherJob.pre = true;
```

---

## Deduplicar una cola

Una cola mantiene el orden de ejecución; un `Set` registra qué jobs ya están pendientes:

```js
const queue = [];
const queuedJobs = new Set();

function queueJob(job) {
  if (queuedJobs.has(job)) return;

  queuedJobs.add(job);
  queue.push(job);
  queueFlush();
}
```

Si cinco propiedades usadas por el mismo componente cambian en el mismo bloque síncrono, las cinco pueden invalidar su efecto. La primera añade `instance.update`; las demás encuentran la misma referencia y no crean entradas duplicadas.

Deduplicar jobs no significa ignorar cambios de estado. El estado ya contiene todas las escrituras cuando el job se ejecuta. La cola evita repetir el consumidor, no descarta las mutaciones que lo invalidaron.

Dos componentes diferentes sí poseen jobs diferentes, aunque hayan reaccionado a la misma fuente. Cada uno conserva su propia entrada porque cada instancia necesita actualizar su subárbol.

---

## Programar una sola microtask

Añadir un job tampoco debería crear una promesa nueva cada vez. El scheduler comparte una promesa mientras exista un flush pendiente:

```js
const resolvedPromise = Promise.resolve();
let currentFlushPromise = null;

function queueFlush() {
  if (currentFlushPromise) return;

  currentFlushPromise = resolvedPromise.then(flushJobs);
}
```

El código síncrono actual termina antes de que se ejecute la callback de `then`. Durante ese intervalo pueden entrar más jobs en la misma cola y compartir la misma microtask.

```text
evento o tarea actual
  ├─ mutación A → queueJob(update)
  ├─ mutación B → el mismo job ya está pendiente
  └─ termina el código síncrono
microtask
  └─ flushJobs() → un update
```

Una microtask ocurre antes de que el navegador avance normalmente a la siguiente tarea. Aun así, la garantía útil de Vue no debería expresarse como “el DOM cambia después de cierta cantidad de milisegundos”, sino como “las actualizaciones pendientes se completan en el siguiente tick”.

---

## Vaciar la cola de forma segura

Antes de ejecutar, el scheduler ordena los jobs. Después recorre la cola y libera su estado incluso si un job falla:

```js
let flushIndex = 0;

function flushJobs() {
  queue.sort(compareJobs);

  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job.disposed) continue;

      job();
      queuedJobs.delete(job);
    }
  } finally {
    queue.length = 0;
    queuedJobs.clear();
    flushIndex = 0;

    flushPostJobs();
    currentFlushPromise = null;

    if (queue.length || pendingPostJobs.length) {
      return flushJobs();
    }
  }
}
```

El índice permite que el recorrido vea jobs añadidos mientras el flush está activo. El bloque `finally` evita que una excepción deje el scheduler marcado para siempre como ocupado. La implementación real de Vue también dirige errores al sistema de manejo del componente y detecta actualizaciones recursivas excesivas.

Un job puede quedar obsoleto antes de su turno. Por ejemplo, si un padre desmonta un hijo, el update pendiente del hijo ya no debería ejecutarse. Una marca `disposed` permite omitir ese trabajo sin alterar el resto de la cola.

---

## Mantener un orden determinista

Vue crea normalmente la instancia padre antes que sus descendientes, por lo que sus identificadores aumentan siguiendo ese orden. Ordenar por `id` produce actualizaciones de padre a hijo:

```js
function compareJobs(first, second) {
  const firstId = first.id ?? Infinity;
  const secondId = second.id ?? Infinity;

  if (firstId !== secondId) return firstId - secondId;
  if (first.pre && !second.pre) return -1;
  if (!first.pre && second.pre) return 1;
  return 0;
}
```

Actualizar primero al padre importa porque este puede cambiar las props del hijo o desmontarlo por completo. En el segundo caso, el scheduler puede saltarse el job del hijo que todavía estaba pendiente.

Un watcher `pre` usa el mismo `id` que el update de su componente, pero se ordena justo antes. Así puede reaccionar al estado más reciente cuando el padre ya tuvo oportunidad de actualizarlo y antes de que cambie el DOM perteneciente a su propia instancia.

El orden no debe depender accidentalmente de qué dependencia llamó primero a `trigger`. Los metadatos convierten la cola en una secuencia predecible.

---

## Ubicar watchers dentro del flush

Los watchers pueden elegir cuándo ejecutar su callback mediante `flush`:

- `pre` es el valor predeterminado. El callback ocurre antes del update DOM de su propio componente.
- `post` ocurre después de que Vue actualiza el DOM y resulta adecuado para leer ese resultado.
- `sync` ejecuta el callback durante el trigger, sin batching.

Un scheduler reducido puede decidir el canal al crear el watcher:

```js
function scheduleWatcher(job, flush, owner) {
  if (flush === 'sync') {
    job();
  } else if (flush === 'post') {
    queuePostJob(job);
  } else {
    job.id = owner.uid;
    job.pre = true;
    queueJob(job);
  }
}
```

Los callbacks `post` usan una cola separada que se vacía después de los updates principales:

```js
const pendingPostJobs = [];
const queuedPostJobs = new Set();

function queuePostJob(job) {
  if (queuedPostJobs.has(job)) return;
  queuedPostJobs.add(job);
  pendingPostJobs.push(job);
  queueFlush();
}
```

Un watcher `sync` puede ser útil para una señal pequeña que exige respuesta inmediata, pero observa cada mutación y pierde la deduplicación. No es una buena opción para una colección que puede modificarse muchas veces de forma síncrona.

---

## Completar la fase post

La fase post también debe deduplicarse y usar una copia estable antes de ejecutar:

```js
function flushPostJobs() {
  if (!pendingPostJobs.length) return;

  const jobs = [...new Set(pendingPostJobs)].sort(compareJobs);
  pendingPostJobs.length = 0;
  queuedPostJobs.clear();

  for (const job of jobs) {
    if (!job.disposed) job();
  }
}
```

En esta fase Vue ejecuta trabajo que necesita el árbol ya actualizado, como watchers `post` y otras callbacks posteriores al render. Una callback post todavía puede cambiar estado y añadir trabajo nuevo. Por eso `flushJobs` vuelve a revisar las colas antes de dar el ciclo por terminado.

Las fases no son tres temporizadores independientes. `pre`, updates y `post` forman partes ordenadas del mismo flush. Esa relación permite razonar sobre qué versión del DOM puede observar cada callback.

---

## Esperar con nextTick

`nextTick` no fuerza un render ni crea por sí mismo una actualización. Retorna la promesa del flush actual; si no existe trabajo pendiente, usa una promesa ya resuelta:

```js
function nextTick(callback) {
  const promise = currentFlushPromise ?? resolvedPromise;
  return callback ? promise.then(callback) : promise;
}
```

```js
count.value++;

console.log(element.textContent); // DOM anterior.
await nextTick();
console.log(element.textContent); // DOM actualizado.
```

La promesa se resuelve después de completar las fases pendientes del flush. Por eso `nextTick` sirve para esperar una actualización provocada por una mutación anterior.

Si no había ninguna actualización encolada, `await nextTick()` solo cede hasta una microtask posterior; no inventa trabajo ni garantiza que una operación asíncrona ajena a Vue haya terminado. Tampoco reemplaza a un watcher `post`: el watcher expresa que una reacción pertenece siempre a la fase posterior, mientras `nextTick` espera puntualmente desde un flujo imperativo.

---

## Evitar ciclos y trabajo obsoleto

Un job puede mutar una dependencia que vuelve a programar el mismo job. Algunas repeticiones son intencionales y se estabilizan; otras crean un ciclo infinito:

```js
watch(count, () => {
  count.value++;
});
```

Un scheduler de producción limita repeticiones recursivas y conserva información suficiente para explicar qué componente o watcher las provocó. La deduplicación dentro de un lote reduce repeticiones accidentales, pero no puede demostrar que toda mutación recursiva sea segura.

También importa el tiempo de vida. Detener un watcher o desmontar una instancia debe impedir que sus jobs pendientes actúen después. Marcar un job como descartado o retirarlo de sus colas mantiene alineadas la planificación y la propiedad del trabajo.

El scheduler coordina así cuatro decisiones separadas: **qué** job representa la actualización, **cuántas veces** debe aparecer en el lote, **en qué orden** se ejecuta y **cuándo** termina el ciclo observable mediante `nextTick`. El estado reactivo cambia de inmediato; la cola convierte sus invalidaciones en una secuencia de trabajo mínima y predecible.
