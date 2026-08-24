---
documentId: template-compilation-lesson
title: From Templates to Rendering Strategies
level: basic
description: Understand how Vue parses a template, generates a render function, and communicates optimizations to the runtime, as well as how Vapor changes the compilation target.
---

## Turn declarative syntax into instructions

A template describes the desired result without detailing every operation required to produce it:

```vue
<template>
  <p :class="{ active }">{{ count }}</p>
</template>
```

The browser does not understand Vue interpolations or directives. Before rendering, the compiler turns that syntax into JavaScript. In the traditional Virtual DOM mode, the result is a render function that creates VNodes:

```js
function render(_ctx) {
  return createElementVNode(
    'p',
    { class: normalizeClass({ active: _ctx.active }) },
    toDisplayString(_ctx.count),
    3, // TEXT | CLASS
  );
}
```

This is a conceptual representation: helper names and exact details can vary between versions and compilation modes. The contract is what matters. The compiler discovers the structure and generates instructions; the runtime executes those instructions with current values.

The template is neither a VNode nor an alternative representation that the renderer interprets directly. It is source code for another stage of the system.

---

## Move through parse, transform, and codegen

A reduced compiler can divide its work into three phases:

1. **Parse** reads the text and builds an Abstract Syntax Tree, or AST.
2. **Transform** walks the AST, resolves the meaning of each node, and prepares optimizations.
3. **Codegen** turns the transformed tree into JavaScript code.

For this template:

```vue
<h1>Hello {{ name }}</h1>
```

a pedagogical AST might look like this:

```js
{
  type: 'Root',
  children: [{
    type: 'Element',
    tag: 'h1',
    props: [],
    children: [
      { type: 'Text', content: 'Hello ' },
      { type: 'Interpolation', content: 'name' },
    ],
  }],
}
```

The AST preserves meaning, not just characters. With that structure, a transform can handle an element, an interpolation, or a directive differently without parsing the original string again.

```js
function compile(template) {
  const ast = parse(template);
  transform(ast);
  return generate(ast);
}
```

Separating the phases also improves errors: the parser can report an unclosed tag with its location, while a transform can reject an invalid expression inside a directive.

---

## Resolve expressions inside the context

An interpolation is not copied as literal text. The compiler turns it into a read from the render context:

```vue
<p>{{ user.name }}</p>
```

```js
toDisplayString(_ctx.user.name);
```

`_ctx` represents the values available to the template. In an SFC with `<script setup>`, the compiler also knows the bindings declared by the script and can generate more direct accesses. In both cases, it must distinguish local identifiers from allowed global names.

Aliases introduced by `v-for` create their own scope:

```vue
<li v-for="item in items">{{ item.name }}</li>
```

`items` belongs to the component context, but `item` is local to the function generated for each entry. Adding `_ctx.item` would be a conceptual error.

The compiler does not evaluate `user.name` during the build. It preserves the expression so the render function can execute it later with the state of each instance.

---

## Distinguish elements, components, and slots

A known native tag can turn directly into an element VNode:

```vue
<article>Profile</article>
```

```js
createElementVNode('article', null, 'Profile');
```

A component tag must be resolved in the application context:

```vue
<UserCard :user="user">
  <span>{{ user.role }}</span>
</UserCard>
```

```js
const UserCard = resolveComponent('UserCard');

createVNode(UserCard, { user: _ctx.user }, {
  default: withCtx(() => [
    createElementVNode('span', null, toDisplayString(_ctx.user.role)),
  ]),
});
```

A component's children become slot functions because they belong to the parent's render context even though the child decides where to invoke them. This distinction lets the same template language produce different contracts for host elements and components.

---

## Transform directives according to their responsibility

Directives are not all processed by one runtime mechanism. The compiler knows their semantics and selects a transform.

- `v-bind` produces props or dynamic arguments.
- `v-on` produces listeners and applies helpers for modifiers when needed.
- `v-if` and `v-for` change the structure of the generated tree.
- `v-model` expands into a value-and-update contract; on native elements, it may also require a runtime directive.
- A custom directive remains as metadata attached to the VNode through `withDirectives()`.

For example:

```vue
<button :disabled="saving" @click.stop="save">Save</button>
```

can conceptually produce:

```js
createElementVNode('button', {
  disabled: _ctx.saving,
  onClick: withModifiers(_ctx.save, ['stop']),
}, 'Save');
```

The syntax disappears, but its behavior remains in props, helpers, or code branches. Understanding a directive means asking what it changes in the generated program, not imagining that the runtime reads the original attribute again.

---

## Turn v-if into branches with identity

`v-if` decides which subtree should exist. A reduced form of its output is a conditional expression:

```vue
<p v-if="visible">{{ message }}</p>
<p v-else>Hidden</p>
```

```js
return _ctx.visible
  ? createElementBlock('p', { key: 0 }, toDisplayString(_ctx.message))
  : createElementBlock('p', { key: 1 }, 'Hidden');
```

The branches receive different identities so the renderer does not confuse two structurally similar results. When there is no alternative branch, the compiler can generate a Comment node as a placeholder and preserve a stable position in the tree.

A structural directive creates boundaries that also affect dynamic blocks. The compiler must preserve enough information for a branch change to mount, update, or unmount the correct subtree.

---

## Turn v-for into a rendered list

`v-for` combines a source, local aliases, and a function that produces one VNode per entry:

```vue
<li v-for="item in items" :key="item.id">
  {{ item.name }}
</li>
```

```js
renderList(_ctx.items, (item) =>
  createElementBlock('li', { key: item.id }, toDisplayString(item.name)),
);
```

The result is usually wrapped in a Fragment because the directive can produce zero, one, or many nodes. The compiler can also indicate whether the fragment is stable, keyed, or unkeyed, but it does not invent identity: the quality of `:key` still depends on the data selected by the template author.

The `item` scope ends when the generated function closes. A reduced transform must register that alias while walking the children and remove it afterward.

---

## Avoid work with static content

The compiler can prove that some parts do not depend on the context:

```vue
<section>
  <h2>Account</h2>
  <p>{{ user.name }}</p>
</section>
```

`<h2>Account</h2>` is static. Vue can create it once, cache it, and reuse the same VNode during later renders. Sufficiently large static groups can also be condensed into a static representation that the renderer mounts efficiently.

The same idea can apply to handlers when preserving their identity is safe:

```js
onClick: _cache[0] || (_cache[0] = (...args) => _ctx.save(...args));
```

Caching requires proof of stability. An expression that depends on a `v-for` alias, for example, cannot be hoisted outside that iteration's function without changing its meaning.

---

## Communicate changes through patch flags

A purely runtime VDOM must defensively compare every prop and child. Vue can do less because the compiler already knows which parts are dynamic.

```vue
<div :class="classes">{{ label }}</div>
```

```js
createElementVNode(
  'div',
  { class: _ctx.classes },
  toDisplayString(_ctx.label),
  3, // TEXT | CLASS
);
```

The final number combines **patch flags**. The renderer uses bitwise checks to enter only the required paths:

```js
if (vnode.patchFlag & PatchFlags.TEXT) {
  hostSetElementText(vnode.el, vnode.children);
}

if (vnode.patchFlag & PatchFlags.CLASS) {
  hostPatchProp(vnode.el, 'class', oldProps.class, newProps.class);
}
```

Other flags can identify particular dynamic props, styles, stable fragments, or situations that require a fuller diff. They are a private protocol between compiler and renderer, not an API that application code normally writes.

---

## Group dynamic nodes into blocks

A block represents a region whose inner structure stays stable within a particular branch. As Vue generates VNodes, it records only relevant dynamic descendants in the block:

```text
section (block)
├─ static h2
├─ p with dynamic text
└─ static div
   └─ span with dynamic class
```

The update list becomes conceptually flattened:

```js
block.dynamicChildren = [dynamicParagraph, dynamicSpan];
```

On the next render, the renderer can walk that list instead of inspecting the entire subtree. `v-if` and `v-for` open new blocks because they can change which nodes exist or how they repeat.

Patch flags describe **what** can change in a VNode; blocks reduce **which VNodes** must be visited. Both optimizations come from static analysis and work only because compiler and runtime share the same contract.

---

## Choose ahead-of-time or runtime compilation

In an SFC application, the build plugin processes each `.vue` file. `@vue/compiler-sfc` separates `template`, `script`, and `style`, and the template compiler generates render code before the application reaches the browser.

Ahead-of-time compilation has several advantages:

- template errors appear during development or build;
- the browser does not download the compiler;
- output can be optimized with information from `<script setup>`;
- the runtime receives JavaScript ready to execute.

Runtime compilation remains possible in Vue builds that include the compiler, for example when an application receives a template string. That string is transformed during startup, which adds weight and moves errors into the browser. A runtime-only build cannot convert dynamically received templates, although it can execute previously compiled render functions.

Compiling at a different time does not change the VDOM contract: in both cases, the traditional result is still a function that produces VNodes.

---

## Design a reduced pedagogical compiler

A manageable exercise does not need to accept all of HTML or every Vue directive. It can define an explicit grammar:

```text
Root          → Child*
Child         → Element | Text | Interpolation
Element       → "<" Tag ">" Child* "</" Tag ">"
Interpolation → "{{" Expression "}}"
```

Its parser advances through a shared cursor, and each function consumes one specific shape:

```js
function parseChildren(context, ancestors) {
  const nodes = [];

  while (!isEnd(context, ancestors)) {
    if (context.source.startsWith('{{')) {
      nodes.push(parseInterpolation(context));
    } else if (context.source[0] === '<') {
      nodes.push(parseElement(context, ancestors));
    } else {
      nodes.push(parseText(context));
    }
  }

  return nodes;
}
```

Next, `transform` can register helpers and prepare a `codegenNode` expression; `generate` emits a function that receives `_ctx` and calls a reduced helper such as `h()`.

Boundaries are part of the design too. If the grammar does not accept attributes, comments, or self-closing HTML, it should reject them clearly instead of silently producing incorrect code. The goal is to reconstruct the pipeline and its invariants, not copy Vue's complete compiler.

---

## Compare VDOM and Vapor Mode

The traditional pipeline uses the compiler to produce optimized VNodes:

```text
template → render function → VNodes → renderer → DOM
```

**Vapor Mode** keeps the idea of analyzing the template but generates more direct operations over nodes and reactive effects:

```text
template → DOM creation + targeted reactive updates
```

Instead of creating a new VNode tree for each component render, compiled code can create a DOM structure once and connect a dynamic expression to the particular operation that must update it. This reduces the baseline runtime and avoids part of the reconciliation work.

That does not make Vapor a faster VDOM renderer or make every API interchangeable. It is a different compilation target. APIs that depend on VNodes, render functions, or the component public instance proxy need interop or may be unavailable.

---

## Enable Vapor according to scope

In Vue 3.6 RC, an SFC with `<script setup>` can opt into Vapor through the `vapor` attribute:

```vue
<script setup vapor>
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

`<script vapor>` is shorthand for `<script setup vapor>`. A template-only component can also mark the compilation target directly:

```vue
<template vapor>
  <p>{{ message }}</p>
</template>
```

Marking the component selects how that SFC is compiled; the entry point selects which runtime starts the application. An application composed entirely of Vapor components uses `createVaporApp()`:

```js
import { createVaporApp } from 'vue';
import App from './App.vue';

createVaporApp(App).mount('#app');
```

To render Vapor components inside an existing VDOM application created with `createApp()`, install the interoperability plugin:

```js
import { createApp, vaporInteropPlugin } from 'vue';
import App from './App.vue';

createApp(App)
  .use(vaporInteropPlugin)
  .mount('#app');
```

The plugin can also introduce VDOM components into a Vapor application, but doing so includes the VDOM runtime and reduces the bundle-size benefit. Components written with render functions or JSX remain VDOM components. It is therefore better to keep clear regions in each mode and use interop as a bridge, rather than assume it automatically converts a component from one strategy to the other.

Vapor supports template-only SFCs and `<script setup>`, but not the Options API, and some APIs that depend on VNodes or the public instance do not apply. Enabling it requires checking the component and its dependencies for compatibility, not merely adding an attribute.

Vue Training currently uses Vue 3.5.38, where these Vapor entry points are not yet part of the available stable flow. Adding `vapor` to an SFC in this project is not enough to enable it: Vue and the build integration would first need a deliberate upgrade. The challenges therefore continue to rely on VDOM, and Vapor serves as a final comparison here. It shows that the template compiler's central value is not producing VNodes specifically, but turning static knowledge into efficient instructions for a rendering strategy.
