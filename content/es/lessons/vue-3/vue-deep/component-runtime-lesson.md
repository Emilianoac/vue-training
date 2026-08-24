---
documentId: component-runtime-lesson
title: Cómo se ejecuta un componente
level: basic
description: Comprende cómo Vue crea una instancia, ejecuta setup y conecta props, slots, eventos, dependencias y lifecycle.
---

## De una definición a una instancia viva

Un componente comienza como una definición reutilizable, pero cada aparición en la interfaz necesita su propio estado y ciclo de vida. El runtime distingue tres piezas:

- La **definición** describe el tipo de componente: su `setup`, opciones y función de render.
- El **VNode** describe una aparición concreta dentro del árbol: tipo, props, children y key.
- La **instancia** conserva el estado vivo de esa aparición entre un render y el siguiente.

```js
const Counter = {
  props: ['start'],
  setup(props) {
    const count = ref(props.start);
    return { count };
  },
  render() {
    return h('button', null, this.count);
  },
};

const vnode = h(Counter, { start: 2 });
```

`Counter` puede reutilizarse muchas veces y `vnode` solo declara una aparición. El runtime crea una instancia distinta para cada aparición montada. Esa instancia permite que dos contadores compartan una definición sin compartir accidentalmente su `count`.

Los modelos de esta lección son deliberadamente reducidos. Explican las responsabilidades y el orden de ejecución, pero omiten optimizaciones, compatibilidad y casos límite del runtime de producción de Vue.

---

## Crear el registro de la instancia

La instancia reúne todo lo que el runtime necesita para administrar un componente. Una versión pequeña puede comenzar así:

```js
let nextUid = 0;

function createComponentInstance(vnode, parent) {
  const instance = {
    uid: nextUid++,
    type: vnode.type,
    vnode,
    next: null,
    parent,
    root: parent ? parent.root : null,
    provides: parent ? parent.provides : Object.create(null),
    props: {},
    attrs: {},
    slots: {},
    setupState: {},
    render: null,
    subTree: null,
    proxy: null,
    emit: null,
    hooks: {
      beforeMount: [],
      mounted: [],
      beforeUpdate: [],
      updated: [],
      beforeUnmount: [],
      unmounted: [],
    },
    isMounted: false,
    isUnmounted: false,
  };

  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  return instance;
}
```

`type` apunta a la definición, mientras `vnode` representa la entrada actual recibida desde el padre. `subTree` guardará el resultado renderizado por el componente. `next` puede reservar el próximo VNode durante una actualización sin reemplazar prematuramente el actual.

Las relaciones `parent` y `root` forman el árbol lógico de componentes. Ese árbol no es lo mismo que el DOM: un componente puede producir varios nodos, un fragmento o incluso contenido fuera de su posición mediante `Teleport`.

---

## Clasificar la entrada del componente

El objeto que el padre pasa al VNode mezcla posibles props, listeners y atributos. Antes de llamar a `setup`, el runtime lo clasifica usando las declaraciones del componente:

```js
function initProps(instance, rawProps = {}) {
  const declaredProps = new Set(instance.type.props ?? []);
  const declaredEmits = new Set(instance.type.emits ?? []);

  for (const [key, value] of Object.entries(rawProps)) {
    if (declaredProps.has(key)) {
      instance.props[key] = value;
    } else if (isDeclaredListener(key, declaredEmits)) {
      // El listener permanece disponible para emit().
    } else {
      instance.attrs[key] = value;
    }
  }
}
```

Las props declaradas forman la entrada pública del componente. El runtime las mantiene actualizadas cuando el padre vuelve a renderizar y entrega a `setup` una vista readonly superficial: el hijo puede leerlas, pero no debe sobrescribir una decisión del padre.

Los valores no reconocidos quedan en `attrs`. Por defecto pueden caer sobre el elemento raíz del componente. Los listeners de eventos declarados pertenecen al contrato de `emits` y no deben tratarse como listeners nativos residuales.

Declarar `props` y `emits` no es solo documentación. Le permite al runtime decidir a qué canal pertenece cada entrada.

---

## Normalizar slots como funciones

Los children de un VNode de componente representan slots. El runtime los normaliza para que cada slot pueda invocarse como una función:

```js
function initSlots(instance, children = {}) {
  for (const [name, slot] of Object.entries(children)) {
    instance.slots[name] = (slotProps = {}) => {
      const content = typeof slot === 'function'
        ? slot(slotProps)
        : slot;

      return normalizeVNodes(content);
    };
  }
}
```

```js
const vnode = h(Card, null, {
  header: ({ title }) => h('h2', null, title),
  default: () => h('p', null, message.value),
});
```

Una función de slot conserva el contexto de render del padre, aunque el hijo decida dónde y cuándo invocarla. También permite entregar slot props desde el hijo. El hijo controla la disposición; el padre controla el contenido.

Tratar los slots como funciones evita confundirlos con HTML ya terminado. El resultado todavía son VNodes que deben formar parte del árbol renderizado.

---

## Ejecutar setup con una instancia activa

Una vez inicializadas las entradas, el runtime prepara el componente y llama a `setup`:

```js
let currentInstance = null;

function setupComponent(instance) {
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);

  instance.proxy = createPublicProxy(instance);

  const setup = instance.type.setup;
  if (!setup) {
    finishComponentSetup(instance);
    return;
  }

  const previous = currentInstance;
  currentInstance = instance;

  const result = setup(shallowReadonly(instance.props), {
    attrs: instance.attrs,
    slots: instance.slots,
    emit: instance.emit,
    expose: (value) => (instance.exposed = value),
  });

  currentInstance = previous;
  handleSetupResult(instance, result);
}
```

La instancia activa hace posible que APIs como `provide`, `inject` y los hooks de lifecycle sepan qué componente las está llamando sin recibir la instancia como argumento público.

Ese contexto depende de la ejecución síncrona de `setup`. Registrar un hook más tarde desde un `setTimeout` ya no ocurre dentro de la misma instancia activa. Un `async setup` introduce además una frontera que el runtime debe coordinar, normalmente con `Suspense` en el cliente.

`<script setup>` ofrece una sintaxis distinta al autor, pero el compilador la transforma en una función `setup` que el runtime puede ejecutar bajo este mismo modelo.

---

## Interpretar el resultado de setup

`setup` puede devolver bindings para el template o una función de render:

```js
function handleSetupResult(instance, result) {
  if (typeof result === 'function') {
    instance.render = result;
  } else if (result && typeof result === 'object') {
    instance.setupState = proxyRefs(result);
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance) {
  if (!instance.render) {
    instance.render = instance.type.render;
  }
}
```

`proxyRefs` permite que una función de render compilada acceda a un ref retornado sin escribir `.value` en cada lectura. La instancia sigue guardando por separado `props`, `setupState`, `attrs` y otros espacios; un proxy público decide de dónde resolver una propiedad:

```js
function createPublicProxy(instance) {
  return new Proxy({ instance }, {
    get({ instance }, key) {
      if (key in instance.setupState) return instance.setupState[key];
      if (key in instance.props) return instance.props[key];
      if (key === '$attrs') return instance.attrs;
      if (key === '$slots') return instance.slots;
      if (key === '$emit') return instance.emit;
    },
  });
}
```

Este proxy explica cómo `this.count`, `$attrs` o `$slots` pueden parecer propiedades de un solo objeto sin que el runtime pierda la separación interna entre sus fuentes.

`expose()` cumple otra función: limita lo que un padre obtiene mediante un template ref. Los bindings usados internamente para renderizar no tienen que convertirse automáticamente en la API pública imperativa del componente.

---

## Emitir eventos hacia el padre

Un evento de componente no asciende por todo el árbol como un evento DOM. `emit` busca en las props del VNode actual el listener que el padre asignó a esa instancia:

```js
function emit(instance, event, ...args) {
  const handlerName = toHandlerKey(event);
  const handler = instance.vnode.props?.[handlerName];
  handler?.(...args);
}

function toHandlerKey(event) {
  return `on${event[0].toUpperCase()}${event.slice(1)}`;
}
```

```js
h(SaveButton, {
  onSave(payload) {
    persist(payload);
  },
});
```

La implementación real también normaliza nombres, valida eventos declarados y contempla listeners de `v-model`. La relación esencial es más pequeña: el hijo emite una intención y el listener pertenece al VNode creado por el padre.

Props bajan datos; emits notifican hacia arriba. Ninguno de los dos mecanismos requiere que padre e hijo compartan estado mutable.

---

## Resolver dependencias de ancestros

Cada instancia mantiene un registro `provides`. Al principio puede compartir el registro de su padre; solo cuando provee un valor crea una capa propia:

```js
function provide(key, value) {
  const instance = currentInstance;
  const parentProvides = instance.parent?.provides;

  if (instance.provides === parentProvides) {
    instance.provides = Object.create(parentProvides);
  }

  instance.provides[key] = value;
}

function inject(key, fallback) {
  const instance = currentInstance;
  const provides = instance.parent?.provides;

  return key in provides ? provides[key] : fallback;
}
```

La cadena de prototipos modela la búsqueda hacia el ancestro más cercano. Si un descendiente vuelve a proveer la misma key, la oculta solo para su propia rama. Un `Symbol` evita colisiones accidentales entre dependencias con nombres similares.

`provide` e `inject` no vuelven reactivo un valor por sí mismos. Si el proveedor entrega un `ref` o un objeto reactivo, el consumidor conserva esa conexión reactiva porque recibe el mismo valor.

---

## Registrar lifecycle en la instancia

Los hooks de Composition API registran callbacks; no ejecutan inmediatamente el trabajo asociado:

```js
function createHook(name) {
  return (hook) => {
    if (!currentInstance) return;
    currentInstance.hooks[name].push(hook);
  };
}

const onMounted = createHook('mounted');
const onUpdated = createHook('updated');
const onUnmounted = createHook('unmounted');
```

El runtime invoca esas listas alrededor de operaciones concretas:

```js
function runComponentRender(instance) {
  if (!instance.isMounted) {
    invoke(instance.hooks.beforeMount);
    instance.subTree = instance.render.call(instance.proxy, instance.proxy);
    mountSubTree(instance.subTree);
    instance.isMounted = true;
    invoke(instance.hooks.mounted);
    return;
  }

  invoke(instance.hooks.beforeUpdate);
  const nextTree = instance.render.call(instance.proxy, instance.proxy);
  patch(instance.subTree, nextTree);
  instance.subTree = nextTree;
  invoke(instance.hooks.updated);
}
```

`beforeMount` ocurre antes de insertar el subárbol y `mounted` después. En una actualización, `beforeUpdate` observa el DOM anterior y `updated` el resultado ya aplicado. Un hook `updated` no debería mutar incondicionalmente el estado que provoca el mismo render, porque puede crear un ciclo.

El render se ejecuta dentro de un efecto reactivo. Las lecturas realizadas por la función de render se convierten en dependencias de esa instancia. Cuando alguna cambia, Vue programa otra ejecución; la cola y el momento exacto de esa actualización pertenecen al scheduler.

---

## Actualizar y desmontar sin perder identidad

Cuando el padre produce otro VNode del mismo tipo y con la misma key, el runtime reutiliza la instancia. Actualiza sus entradas y vuelve a renderizar, pero conserva `setupState`, los hooks y las dependencias asociadas:

```js
function updateComponent(instance, nextVNode) {
  instance.next = nextVNode;
  instance.vnode = nextVNode;

  updateProps(instance, nextVNode.props);
  updateSlots(instance, nextVNode.children);

  instance.update();
  instance.next = null;
}
```

Si cambia el tipo o la key, esa identidad ya no coincide: el runtime desmonta la instancia anterior y monta otra. Por eso una `key` no es solo una ayuda para ordenar listas; también puede decidir si el estado de un componente se preserva o se reinicia.

El desmontaje cierra el ciclo de vida:

```js
function unmountComponent(instance) {
  invoke(instance.hooks.beforeUnmount);
  stop(instance.renderEffect);
  instance.scope.stop();
  unmount(instance.subTree);
  instance.isUnmounted = true;
  invoke(instance.hooks.unmounted);
}
```

Detener el scope elimina watchers y efectos creados de forma síncrona durante `setup`. Después se desmonta el subárbol y se ejecutan los callbacks finales. Una instancia desmontada no debe seguir reaccionando ni controlando recursos externos.

El runtime de componentes funciona así como una capa de coordinación: convierte una definición y un VNode en una instancia estable, clasifica sus entradas, ejecuta `setup` bajo el contexto correcto, registra lifecycle y conecta un render reactivo con el subárbol. El renderer decide cómo aplicar ese subárbol y el scheduler decide cuándo repetir el trabajo; la instancia conserva quién está ejecutándolo.
