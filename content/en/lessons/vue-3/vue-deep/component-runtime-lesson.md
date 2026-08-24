---
documentId: component-runtime-lesson
title: How a Component Runs
level: basic
description: Understand how Vue creates an instance, runs setup, and connects props, slots, events, dependencies, and lifecycle.
---

## From a definition to a live instance

A component begins as a reusable definition, but every occurrence in the interface needs its own state and lifecycle. The runtime distinguishes three pieces:

- The **definition** describes the component type: its `setup`, options, and render function.
- The **VNode** describes one concrete occurrence in the tree: type, props, children, and key.
- The **instance** preserves the live state of that occurrence from one render to the next.

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

`Counter` can be reused many times, while `vnode` only declares one occurrence. The runtime creates a separate instance for every mounted occurrence. This allows two counters to share a definition without accidentally sharing their `count`.

The models in this lesson are deliberately reduced. They explain responsibilities and execution order while omitting optimizations, compatibility behavior, and edge cases from Vue's production runtime.

---

## Create the instance record

The instance gathers everything the runtime needs to manage a component. A small version can begin like this:

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

`type` points to the definition, while `vnode` represents the current input received from the parent. `subTree` will store the result rendered by the component. `next` can hold the next VNode during an update without replacing the current one prematurely.

The `parent` and `root` relationships form the logical component tree. That tree is not the same as the DOM: a component can produce multiple nodes, a fragment, or even content outside its position through `Teleport`.

---

## Classify component input

The object passed by the parent to the VNode mixes possible props, listeners, and attributes. Before calling `setup`, the runtime classifies it using the component declarations:

```js
function initProps(instance, rawProps = {}) {
  const declaredProps = new Set(instance.type.props ?? []);
  const declaredEmits = new Set(instance.type.emits ?? []);

  for (const [key, value] of Object.entries(rawProps)) {
    if (declaredProps.has(key)) {
      instance.props[key] = value;
    } else if (isDeclaredListener(key, declaredEmits)) {
      // The listener remains available to emit().
    } else {
      instance.attrs[key] = value;
    }
  }
}
```

Declared props form the component's public input. The runtime keeps them updated when the parent renders again and gives `setup` a shallow readonly view: the child can read them but should not overwrite a decision made by the parent.

Unrecognized values remain in `attrs`. By default, they can fall through to the component's root element. Listeners for declared events belong to the `emits` contract and should not be treated as residual native listeners.

Declaring `props` and `emits` is not merely documentation. It allows the runtime to decide which channel each input belongs to.

---

## Normalize slots as functions

The children of a component VNode represent slots. The runtime normalizes them so that every slot can be invoked as a function:

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

A slot function preserves the parent's rendering context even though the child decides where and when to invoke it. It also allows the child to provide slot props. The child controls layout; the parent controls content.

Treating slots as functions prevents them from being mistaken for finished HTML. Their result is still a collection of VNodes that must become part of the rendered tree.

---

## Run setup with an active instance

Once the inputs are initialized, the runtime prepares the component and calls `setup`:

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

The active instance allows APIs such as `provide`, `inject`, and lifecycle hooks to know which component is calling them without receiving the instance as a public argument.

That context depends on the synchronous execution of `setup`. Registering a hook later from a `setTimeout` no longer happens inside the same active instance. An `async setup` also introduces a boundary that the runtime must coordinate, normally through `Suspense` on the client.

`<script setup>` gives authors a different syntax, but the compiler transforms it into a `setup` function that the runtime can execute under this same model.

---

## Interpret the setup result

`setup` can return bindings for the template or a render function:

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

`proxyRefs` allows a compiled render function to access a returned ref without writing `.value` for every read. The instance still stores `props`, `setupState`, `attrs`, and other spaces separately; a public proxy decides where a property should be resolved:

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

This proxy explains how `this.count`, `$attrs`, or `$slots` can look like properties of one object without making the runtime lose the internal separation between their sources.

`expose()` serves a different purpose: it limits what a parent obtains through a template ref. Bindings used internally for rendering do not have to become the component's imperative public API automatically.

---

## Emit events to the parent

A component event does not bubble through the whole tree like a DOM event. `emit` looks in the current VNode props for the listener assigned by the parent to that instance:

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

The real implementation also normalizes names, validates declared events, and handles `v-model` listeners. The essential relationship is smaller: the child emits an intention, and the listener belongs to the VNode created by the parent.

Props send data down; emits notify upward. Neither mechanism requires parent and child to share mutable state.

---

## Resolve ancestor dependencies

Every instance keeps a `provides` registry. It can initially share its parent's registry and create its own layer only when it provides a value:

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

The prototype chain models lookup toward the nearest ancestor. If a descendant provides the same key again, it shadows that key only for its own branch. A `Symbol` prevents accidental collisions between dependencies with similar names.

`provide` and `inject` do not make a value reactive by themselves. If the provider passes a `ref` or reactive object, the consumer preserves that reactive connection because it receives the same value.

---

## Register lifecycle on the instance

Composition API lifecycle hooks register callbacks; they do not immediately run the associated work:

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

The runtime invokes those lists around concrete operations:

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

`beforeMount` runs before inserting the subtree and `mounted` afterward. During an update, `beforeUpdate` observes the old DOM and `updated` observes the already applied result. An `updated` hook should not mutate the state that caused the same render unconditionally, as that can create a loop.

Rendering runs inside a reactive effect. Reads performed by the render function become dependencies of that instance. When one changes, Vue schedules another execution; the queue and exact timing of that update belong to the scheduler.

---

## Update and unmount without losing identity

When the parent produces another VNode with the same type and key, the runtime reuses the instance. It updates its inputs and renders again while preserving `setupState`, hooks, and associated dependencies:

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

If the type or key changes, that identity no longer matches: the runtime unmounts the old instance and mounts another one. A `key` is therefore not only an aid for ordering lists; it can also decide whether component state is preserved or reset.

Unmounting closes the lifecycle:

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

Stopping the scope removes watchers and effects created synchronously during `setup`. The subtree is then unmounted and the final callbacks run. An unmounted instance should no longer react or control external resources.

The component runtime therefore acts as a coordination layer: it turns a definition and VNode into a stable instance, classifies its inputs, runs `setup` under the correct context, registers lifecycle, and connects reactive rendering to the subtree. The renderer decides how to apply that subtree, and the scheduler decides when to repeat the work; the instance preserves who is doing it.
