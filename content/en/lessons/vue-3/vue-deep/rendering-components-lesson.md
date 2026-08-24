---
documentId: rendering-components-lesson
title: From VNodes to DOM
level: basic
description: Understand how a renderer mounts, compares, and updates element and component trees through VNodes.
---

## Describe before modifying

A render function does not create DOM directly. It produces an in-memory description of the desired interface:

```js
function render() {
  return h('section', { class: 'profile' }, [
    h('h2', null, user.name),
    h('button', { onClick: save }, 'Save'),
  ]);
}
```

`h()` creates **Virtual Nodes**, or VNodes. The result above can be represented in a reduced form like this:

```js
{
  type: 'section',
  props: { class: 'profile' },
  children: [/* more VNodes */],
  key: null,
  el: null,
}
```

The VNode expresses what should exist, not the steps needed to create it. The renderer receives that description and decides which operations to apply to the real environment.

During the first render, there is no previous tree, so the renderer mounts everything. On later renders, it keeps both trees: it compares the previous VNode with the new one and changes only what is necessary. This process is called `patch`, diffing, or reconciliation.

The following models are pedagogical reductions. They explain the renderer's main decisions while omitting optimizations, built-in components, and platform-specific edge cases from Vue's production implementation.

---

## Recognize VNode anatomy

The main fields serve different responsibilities:

- `type` identifies an element, component, or special node.
- `props` contains attributes, properties, listeners, and reserved data such as `key`.
- `children` describes text, a VNode list, or slots when the type is a component.
- `key` expresses identity between two rendered lists.
- `el` links the description to the host node that was mounted.
- `component` can link a component VNode to its live instance.

```js
function createVNode(type, props = null, children = null) {
  return {
    type,
    props,
    children,
    key: props?.key ?? null,
    el: null,
    component: null,
  };
}
```

`el` starts as `null` and is assigned during mount. During a compatible update, the new VNode inherits the previous reference so the renderer changes the same real node.

A VNode represents one concrete occurrence and must keep its own host relationship. Reusing the exact same VNode object in two positions would produce ambiguous identity; repeated structures use newly created or cloned VNodes.

---

## Normalize different child shapes

Render functions can return values with several shapes. The renderer normalizes them before operating:

```js
const Text = Symbol('Text');
const Comment = Symbol('Comment');
const Fragment = Symbol('Fragment');

function normalizeVNode(value) {
  if (value == null || typeof value === 'boolean') {
    return createVNode(Comment, null, '');
  }

  if (Array.isArray(value)) {
    return createVNode(Fragment, null, value.map(normalizeVNode));
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return createVNode(Text, null, String(value));
  }

  return value;
}
```

A `Text` node gives strings and numbers a uniform representation. A `Comment` can preserve an empty position, while a `Fragment` groups several children without adding a visible element merely to contain them.

In a production implementation, comments, static nodes, and already-mounted VNodes need additional handling. The central idea is that `patch` should not resolve arbitrary combinations in every branch: it receives known, normalized shapes.

---

## Separate the renderer from the host

Creating, inserting, or removing nodes does not necessarily mean calling `document` directly. The renderer can receive host operations:

```js
const renderer = createRenderer({
  createElement: (type) => document.createElement(type),
  createText: (text) => document.createTextNode(text),
  insert: (node, parent, anchor) => parent.insertBefore(node, anchor),
  remove: (node) => node.parentNode?.removeChild(node),
  setElementText: (element, text) => {
    element.textContent = text;
  },
  patchProp: (element, key, previous, next) => {
    patchDomProp(element, key, previous, next);
  },
});
```

The VNode algorithm belongs to runtime core, while concrete operations belong to the host. In the browser, `patchProp` decides whether a key is an attribute, property, class, style, or listener. Another renderer could build objects, draw on canvas, or communicate with a different platform while preserving the same logical traversal.

The `anchor` indicates which node to insert before. Using `null` means inserting at the end. This reference becomes important when moving nodes and representing fragments through boundaries.

---

## Dispatch each type from patch

`patch` receives the previous VNode, the new one, the container, and an optional position:

```js
function patch(oldVNode, newVNode, container, anchor = null) {
  if (oldVNode && !isSameVNodeType(oldVNode, newVNode)) {
    unmount(oldVNode);
    oldVNode = null;
  }

  if (typeof newVNode.type === 'string') {
    processElement(oldVNode, newVNode, container, anchor);
  } else if (newVNode.type === Text) {
    processText(oldVNode, newVNode, container, anchor);
  } else if (newVNode.type === Comment) {
    processComment(oldVNode, newVNode, container, anchor);
  } else if (newVNode.type === Fragment) {
    processFragment(oldVNode, newVNode, container, anchor);
  } else {
    processComponent(oldVNode, newVNode, container, anchor);
  }
}

function isSameVNodeType(first, second) {
  return first.type === second.type && first.key === second.key;
}
```

A null `oldVNode` means mount. When both VNodes have the same `type` and `key`, they can update while preserving host or component identity. Otherwise, the renderer unmounts the previous tree and mounts a new one.

The comparison does not try to discover that a `<button>` “looks similar” to an `<a>`. Different types represent incompatible identities and must be replaced.

---

## Mount an element

Mounting first creates the element, applies its props, mounts its children, and finally inserts it:

```js
function mountElement(vnode, container, anchor) {
  const element = vnode.el = hostCreateElement(vnode.type);

  for (const [key, value] of Object.entries(vnode.props ?? {})) {
    if (key !== 'key') {
      hostPatchProp(element, key, null, value);
    }
  }

  if (typeof vnode.children === 'string') {
    hostSetElementText(element, vnode.children);
  } else if (Array.isArray(vnode.children)) {
    mountChildren(vnode.children, element);
  }

  hostInsert(element, container, anchor);
}
```

Mounting children before inserting the element allows its subtree to be built outside the document and inserted once at the end. Every child is normalized and passed through `patch(null, child, element)` again.

`key` participates in the virtual algorithm but must not become a visible attribute. Other reserved props, such as refs and VNode hooks, also belong to the runtime and follow their own channels.

---

## Update an existing element

When types match, the new VNode reuses `oldVNode.el`. Props and children are then compared:

```js
function patchElement(oldVNode, newVNode) {
  const element = newVNode.el = oldVNode.el;

  patchProps(element, oldVNode.props ?? {}, newVNode.props ?? {});
  patchChildren(oldVNode, newVNode, element);
}

function patchProps(element, oldProps, newProps) {
  for (const [key, next] of Object.entries(newProps)) {
    const previous = oldProps[key];
    if (next !== previous) {
      hostPatchProp(element, key, previous, next);
    }
  }

  for (const key of Object.keys(oldProps)) {
    if (!(key in newProps)) {
      hostPatchProp(element, key, oldProps[key], null);
    }
  }
}
```

The first pass adds or updates. The second removes what no longer exists. Passing previous and next values lets the host update a listener or clear a style without rebuilding the entire element.

Reference comparison works for props normalized by the render function. Mutating and reusing the same props object between two VNodes loses the previous snapshot needed to detect changes; VNodes should describe independent results.

---

## Change the shape of children

Children can transition between text, a list, and absence. Each transition needs a different operation:

```js
function patchChildren(oldVNode, newVNode, container) {
  const oldChildren = oldVNode.children;
  const newChildren = newVNode.children;

  if (typeof newChildren === 'string') {
    if (Array.isArray(oldChildren)) unmountChildren(oldChildren);
    if (newChildren !== oldChildren) {
      hostSetElementText(container, newChildren);
    }
    return;
  }

  if (Array.isArray(newChildren)) {
    if (Array.isArray(oldChildren)) {
      patchArrayChildren(oldChildren, newChildren, container);
    } else {
      if (typeof oldChildren === 'string') hostSetElementText(container, '');
      mountChildren(newChildren, container);
    }
    return;
  }

  if (Array.isArray(oldChildren)) unmountChildren(oldChildren);
  else if (typeof oldChildren === 'string') hostSetElementText(container, '');
}
```

Before mounting a list where text existed, the text must be cleared. Before setting text where VNodes existed, those children must be unmounted to release components, effects, and refs, rather than only disappearing visually.

The list-to-list case leads to child diffing.

---

## Process component VNodes

A VNode whose `type` is a component definition does not produce an element directly. On mount, it creates an instance and renders its `subTree`:

```js
function mountComponent(vnode, container, anchor) {
  const instance = vnode.component = createComponentInstance(vnode);
  setupComponent(instance);

  instance.update = effect(() => {
    if (!instance.isMounted) {
      const subTree = instance.render();
      patch(null, subTree, container, anchor);

      instance.subTree = subTree;
      instance.isMounted = true;
      vnode.el = subTree.el;
    } else {
      const previousTree = instance.subTree;
      const nextTree = instance.render();

      patch(previousTree, nextTree, container, anchor);
      instance.subTree = nextTree;
      vnode.el = nextTree.el;
    }
  }, {
    scheduler: () => queueJob(instance.update),
  });
}
```

The VNode keeps `component`; the instance keeps `subTree`; the subtree ultimately links to host nodes. A component can therefore participate in the virtual tree without being a DOM tag itself.

During an update from the parent, the renderer decides whether new props or slots require the component to run again. If no relevant input changed, it can reuse the instance and skip its render. If an update is required, it gives the new VNode to the same instance and coordinates the update within the parent's traversal. Invalidations originating from the component's own reactive state do go through the instance scheduler.

---

## Compare lists without keys

An unkeyed diff pairs children by position. It updates the shared range and then mounts or unmounts the remainder:

```js
function patchUnkeyedChildren(oldChildren, newChildren, container) {
  const commonLength = Math.min(oldChildren.length, newChildren.length);

  for (let index = 0; index < commonLength; index++) {
    patch(oldChildren[index], newChildren[index], container);
  }

  if (newChildren.length > commonLength) {
    mountChildren(newChildren.slice(commonLength), container);
  } else {
    unmountChildren(oldChildren.slice(commonLength));
  }
}
```

This approach is valid when identity truly depends on position. If an item is inserted at the beginning, every later position is paired with a different VNode. For simple elements this can cause unnecessary updates; for stateful components it can associate existing state with the wrong data.

---

## Preserve identity with key

In a keyed list, `key` states which new child corresponds to which previous child even when its position changes:

```js
const oldChildren = [
  h(Row, { key: 'a', item: first }),
  h(Row, { key: 'b', item: second }),
];

const newChildren = [
  h(Row, { key: 'b', item: second }),
  h(Row, { key: 'a', item: first }),
];
```

An efficient keyed diff commonly follows these stages:

1. Synchronize the prefix while type and key match.
2. Synchronize the suffix.
3. If one list is exhausted, mount or unmount the remainder.
4. Create a `key → new index` map for the middle region.
5. Walk previous children: patch matches and unmount missing entries.
6. Walk the new region backward to mount missing nodes and move nodes using anchors.

```js
const newIndexByKey = new Map();

for (let index = newStart; index <= newEnd; index++) {
  newIndexByKey.set(newChildren[index].key, index);
}
```

Vue can also calculate an increasing subsequence to keep as many already ordered nodes in place as possible and reduce movement. That optimization changes how many nodes move, not the meaning of `key`.

Keys must be stable and unique among siblings. Using the index as a key in a reorderable list describes positions, not data identity.

---

## Move and unmount complete trees

Moving an element calls `hostInsert` with a new anchor; inserting an already-mounted node changes its position. Moving a component means moving the node or range produced by its subtree. A Fragment may need start and end anchors to represent a range without a visible wrapper.

Unmounting also depends on type:

```js
function unmount(vnode) {
  if (vnode.component) {
    stop(vnode.component.update);
    unmount(vnode.component.subTree);
  } else if (vnode.type === Fragment) {
    unmountChildren(vnode.children);
  } else {
    hostRemove(vnode.el);
  }
}
```

Removing only a component's visible element would leave its effects and hooks alive. The renderer must traverse logical ownership of work before removing host nodes.

The complete pipeline therefore preserves a chain of identity:

```text
render function → new VNode tree
                         ↓ patch
previous VNode + new VNode → mount · update · move · unmount
                                     ↓ host operations
                                   updated DOM
```

VNodes describe the desired result; `patch` preserves or replaces identities; child diffing finds correspondences; host operations materialize the decision. The compiler can add hints to accelerate this traversal, but the renderer remains responsible for turning descriptions into real changes.
