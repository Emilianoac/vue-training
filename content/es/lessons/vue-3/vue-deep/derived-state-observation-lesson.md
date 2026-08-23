---
documentId: derived-state-observation-lesson
title: Estado derivado y observación reactiva
level: basic
description: Comprende cómo computed, watch y watchEffect reaccionan mediante caché, invalidación y limpieza.
---

## Derivar y observar

Un valor reactivo puede participar en dos tipos de trabajo diferentes. A veces se necesita calcular otro valor a partir de él; otras veces se necesita ejecutar un efecto secundario cuando cambia.

- `computed()` produce estado derivado y conserva en caché su último resultado.
- `watch()` observa una fuente explícita y entrega sus valores nuevo y anterior.
- `watchEffect()` ejecuta trabajo inmediatamente y descubre sus dependencias durante esa ejecución.

Estas APIs reaccionan a dependencias, pero no persiguen el mismo objetivo. Un `computed` describe un valor y debería permanecer libre de efectos secundarios. Un watcher coordina trabajo como peticiones, persistencia o integración con APIs externas.

Las implementaciones siguientes son modelos pedagógicos reducidos. Explican las relaciones entre efectos, invalidación y limpieza, pero omiten optimizaciones y casos internos del código de producción de Vue.

---

## Separar invalidación y ejecución

Un efecto básico vuelve a ejecutar su función cuando cambia una dependencia. Para construir estado derivado y watchers se necesita una segunda posibilidad: notificar el cambio sin decidir todavía cuándo ni cómo ejecutar la función.

Un hook `scheduler` ofrece ese punto de control:

```js
function trigger(target, key) {
  const effects = getEffects(target, key);

  new Set(effects).forEach((effect) => {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  });
}
```

Aquí, scheduler no significa necesariamente una cola asíncrona. Es una función que recibe la notificación en lugar de ejecutar directamente el cálculo reactivo. Un `computed` puede usarla para marcar su caché como inválida y un watcher para ejecutar su propio job.

El sistema también necesita efectos `lazy`: su función no se ejecuta al crearlos, sino cuando un consumidor solicita el resultado.

---

## Construir un valor computed

Un `computed` de solo lectura recibe un getter. Su contenedor combina tres responsabilidades:

1. Guardar el último valor calculado.
2. Saber si la caché está sucia.
3. Exponer una propiedad reactiva `.value`.

```js
function computed(getter) {
  let cachedValue;
  let dirty = true;

  const computedRef = {
    get value() {
      track(computedRef, 'value');

      if (dirty) {
        cachedValue = runner();
        dirty = false;
      }

      return cachedValue;
    },
  };

  const runner = effect(getter, {
    lazy: true,
    scheduler() {
      if (dirty) return;
      dirty = true;
      trigger(computedRef, 'value');
    },
  });

  return computedRef;
}
```

La primera lectura ejecuta el getter. Las lecturas posteriores retornan `cachedValue` mientras ninguna dependencia haya cambiado. Cuando una dependencia notifica al scheduler, este solo marca `dirty = true`; el getter no se ejecuta otra vez hasta la siguiente lectura.

Así, invalidar no equivale a recalcular. La invalidación descarta la confianza en la caché y la lectura decide cuándo renovarla.

---

## Ser dependencia y consumidor

Un `computed` ocupa dos posiciones en el grafo reactivo:

```text
estado de origen → efecto del computed → computed.value → efecto consumidor
```

Su runner consume las propiedades leídas por el getter. Al mismo tiempo, `computedRef.value` actúa como una fuente que otros efectos pueden seguir.

```js
const price = ref(10);
const quantity = ref(2);
const total = computed(() => price.value * quantity.value);

effect(() => {
  renderTotal(total.value);
});
```

Si cambia `price`, el computed se invalida y notifica a los consumidores de `total.value`. Cuando uno de ellos vuelve a leerlo, el getter calcula el valor actualizado una sola vez. Varios consumidores pueden compartir esa misma caché.

Esta composición requiere que el sistema de efectos restaure correctamente el efecto consumidor después de ejecutar el getter interno. De lo contrario, las lecturas posteriores podrían asociarse al suscriptor equivocado.

---

## Computed de lectura y escritura

La forma habitual de `computed()` recibe solo un getter y expone un ref readonly. También puede recibir `get` y `set` para crear un valor derivado escribible:

```js
const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`;
  },
  set(value) {
    [firstName.value, lastName.value] = value.split(' ');
  },
});
```

El setter no modifica la caché directamente. Traduce la escritura en cambios sobre las fuentes. Esos cambios invalidan el getter mediante el flujo reactivo normal.

Un computed escribible resulta útil cuando existe una transformación reversible clara. Si la escritura representa una acción con varias reglas o efectos secundarios, una función explícita suele comunicar mejor la intención.

---

## Observar una fuente explícita

`watch()` separa la recopilación de dependencias del efecto secundario. Una función fuente se ejecuta dentro de un efecto lazy; el callback no se usa para descubrir dependencias.

```js
function watch(source, callback, options = {}) {
  const getter = typeof source === 'function'
    ? source
    : () => source.value;

  let oldValue;
  let cleanup;
  let initialized = false;

  function onCleanup(fn) {
    cleanup = fn;
  }

  const job = () => {
    const newValue = runner();
    if (initialized && Object.is(newValue, oldValue)) return;

    cleanup?.();
    cleanup = undefined;
    callback(newValue, initialized ? oldValue : undefined, onCleanup);
    oldValue = newValue;
    initialized = true;
  };

  const runner = effect(getter, {
    lazy: true,
    scheduler: job,
  });

  if (options.immediate) {
    job();
  } else {
    oldValue = runner();
    initialized = true;
  }

  return () => stop(runner);
}
```

Sin `immediate`, la primera ejecución solo establece `oldValue`. Después, cada invalidación obtiene `newValue`, lo compara y llama al callback cuando el resultado cambia. Con `immediate`, el job ejecuta también el callback inicial y el valor anterior todavía es `undefined`.

Vue acepta refs, getters, objetos reactivos y arrays de fuentes. Un getter es especialmente útil para observar una propiedad concreta:

```js
watch(
  () => state.user.id,
  (newId, oldId) => loadUser(newId),
);
```

Leer `state.user.id` antes de pasarlo copiaría su valor y perdería la fuente reactiva; el getter conserva la lectura dentro del contexto de seguimiento.

---

## Observar estructuras profundas

Una fuente getter solo sigue las propiedades que lee. Para detectar mutaciones interiores de una estructura completa, un watcher profundo debe recorrerla y provocar lecturas reactivas:

```js
function traverse(value, seen = new Set()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) {
    return value;
  }

  seen.add(value);
  Object.values(value).forEach((item) => traverse(item, seen));
  return value;
}
```

El `Set` evita ciclos infinitos cuando dos objetos se referencian entre sí. Este recorrido tiene un costo proporcional a la estructura visitada, por lo que observar fuentes específicas suele ser más preciso que activar profundidad sin necesitarla.

En una mutación anidada, `newValue` y `oldValue` pueden ser el mismo proxy porque el objeto no fue reemplazado. El watcher informa que ocurrió una invalidación; no crea automáticamente una copia histórica de toda la estructura.

---

## Descubrir dependencias con watchEffect

`watchEffect()` combina seguimiento y efecto secundario en una sola función. Se ejecuta inmediatamente y todo valor reactivo leído durante su parte síncrona se convierte en dependencia:

```js
const stop = watchEffect((onCleanup) => {
  document.title = `${user.value.name} · ${notifications.value.length}`;
});
```

No necesita una lista de fuentes, pero sus dependencias son menos explícitas. Una implementación reducida puede envolver la función y ejecutar su limpieza antes de cada repetición:

```js
function watchEffect(fn) {
  let cleanup;

  function onCleanup(nextCleanup) {
    cleanup = nextCleanup;
  }

  const runner = effect(() => {
    cleanup?.();
    cleanup = undefined;
    fn(onCleanup);
  });

  return () => {
    cleanup?.();
    stop(runner);
  };
}
```

Con una función `async`, solo las lecturas realizadas antes del primer `await` pertenecen a la ejecución síncrona y se recopilan automáticamente. Una lectura posterior ocurre cuando ya no existe el mismo efecto activo.

---

## Invalidar efectos secundarios obsoletos

Un watcher puede iniciar trabajo que siga activo cuando llega una nueva invalidación. Sin limpieza, una respuesta antigua podría sobrescribir datos más recientes:

```js
watch(userId, async (id, _oldId, onCleanup) => {
  const controller = new AbortController();

  onCleanup(() => controller.abort());

  const response = await fetch(`/api/users/${id}`, {
    signal: controller.signal,
  });

  user.value = await response.json();
});
```

`onCleanup()` registra trabajo que se ejecuta justo antes de la siguiente repetición o al detener el watcher. Limpiar no revierte el callback anterior; cancela o libera los recursos que este dejó activos.

Vue también ofrece `onWatcherCleanup()`. Esa API debe registrarse durante la ejecución síncrona del callback, antes de cualquier `await`. El argumento `onCleanup` está vinculado a la instancia concreta del watcher y resulta natural para el modelo reducido.

---

## Controlar el tiempo de vida

`watch()` y `watchEffect()` retornan un handle. Detenerlo elimina sus suscripciones y ejecuta la limpieza pendiente:

```js
const handle = watchEffect((onCleanup) => {
  const connection = connect(roomId.value);
  onCleanup(() => connection.close());
});

handle.stop();
```

El handle de Vue también puede invocarse como función y ofrece `pause()` y `resume()`. Cuando un watcher se crea de forma síncrona dentro de `setup()`, Vue lo asocia con el componente y lo detiene al desmontarlo. Uno creado fuera de ese contexto necesita una gestión explícita de su vida.

Estado derivado y observación comparten el grafo reactivo, pero responden de manera diferente a una invalidación. `computed` protege una caché y produce un valor; `watch` compara una fuente declarada; `watchEffect` repite el trabajo que descubrió sus propias dependencias. La limpieza impide que ejecuciones ya obsoletas sigan controlando recursos o resultados.
