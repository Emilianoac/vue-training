import {
  createElement as hostCreateElement,
  createText as hostCreateText,
  insert as hostInsert,
  nextSibling as hostNextSibling,
  patchProp as hostPatchProp,
  remove as hostRemove,
  setElementText as hostSetElementText,
  setText as hostSetText,
  type HostContainer,
  type HostElement,
  type HostNode,
  type HostParent,
} from "./host";

export const Text = Symbol("Text");
export type Data = Record<string, unknown>;
export type ComponentDefinition = { render: (props: Data) => VNodeChild };
export type VNodeType = string | typeof Text | ComponentDefinition;
export type VNodeChild = VNode | string | number | boolean | null | undefined;
export type VNodeChildren = string | VNode[] | null;

export type ComponentInstance = {
  vnode: VNode;
  subTree: VNode;
};

export type VNode = {
  type: VNodeType;
  props: Data | null;
  children: VNodeChildren;
  key: PropertyKey | null;
  el: HostNode | null;
  component: ComponentInstance | null;
};

export function h(
  type: VNodeType,
  props: Data | null = null,
  children: VNodeChild | VNodeChild[] = null,
): VNode {
  return {
    type,
    props,
    children: normalizeChildren(children),
    key: (props?.key as PropertyKey | undefined) ?? null,
    el: null,
    component: null,
  };
}

export function render(vnode: VNode | null, container: HostContainer) {
  const previous = container._vnode as VNode | null;

  if (vnode) patch(previous, vnode, container);
  else if (previous) unmount(previous);

  container._vnode = vnode;
}

export function resetRenderer() {
  // This reduced renderer keeps its state on VNodes and containers.
}

function patch(
  oldVNode: VNode | null,
  newVNode: VNode,
  container: HostParent,
  anchor: HostNode | null = null,
) {
  if (oldVNode && !isSameVNodeType(oldVNode, newVNode)) {
    anchor = oldVNode.el ? hostNextSibling(oldVNode.el) : anchor;
    unmount(oldVNode);
    oldVNode = null;
  }

  if (newVNode.type === Text) {
    processText(oldVNode, newVNode, container, anchor);
  } else if (typeof newVNode.type === "string") {
    processElement(oldVNode, newVNode, container, anchor);
  } else {
    processComponent(oldVNode, newVNode, container, anchor);
  }
}

function processText(
  oldVNode: VNode | null,
  newVNode: VNode,
  container: HostParent,
  anchor: HostNode | null,
) {
  if (!oldVNode) {
    newVNode.el = hostCreateText(newVNode.children as string);
    hostInsert(newVNode.el, container, anchor);
  } else {
    const text = newVNode.el = oldVNode.el!;
    if (oldVNode.children !== newVNode.children) {
      hostSetText(text as Extract<HostNode, { kind: "text" }>, newVNode.children as string);
    }
  }
}

function processElement(
  oldVNode: VNode | null,
  newVNode: VNode,
  container: HostParent,
  anchor: HostNode | null,
) {
  if (!oldVNode) mountElement(newVNode, container, anchor);
  else patchElement(oldVNode, newVNode);
}

function mountElement(vnode: VNode, container: HostParent, anchor: HostNode | null) {
  const element = vnode.el = hostCreateElement(vnode.type as string);

  for (const [key, value] of Object.entries(vnode.props ?? {})) {
    if (key !== "key") hostPatchProp(element, key, null, value);
  }

  if (typeof vnode.children === "string") {
    hostSetElementText(element, vnode.children);
  } else if (Array.isArray(vnode.children)) {
    mountChildren(vnode.children, element);
  }

  hostInsert(element, container, anchor);
}

function patchElement(oldVNode: VNode, newVNode: VNode) {
  const element = newVNode.el = oldVNode.el as HostElement;
  patchProps(element, oldVNode.props ?? {}, newVNode.props ?? {});
  patchChildren(oldVNode, newVNode, element);
}

function patchProps(element: HostElement, oldProps: Data, newProps: Data) {
  for (const [key, next] of Object.entries(newProps)) {
    if (key === "key") continue;
    const previous = oldProps[key];
    if (next !== previous) hostPatchProp(element, key, previous, next);
  }

  for (const key of Object.keys(oldProps)) {
    if (key !== "key" && !(key in newProps)) {
      hostPatchProp(element, key, oldProps[key], null);
    }
  }
}

function patchChildren(oldVNode: VNode, newVNode: VNode, container: HostElement) {
  const oldChildren = oldVNode.children;
  const newChildren = newVNode.children;

  if (typeof newChildren === "string") {
    if (Array.isArray(oldChildren)) unmountChildren(oldChildren);
    if (newChildren !== oldChildren) hostSetElementText(container, newChildren);
    return;
  }

  if (Array.isArray(newChildren)) {
    if (Array.isArray(oldChildren)) {
      patchKeyedChildren(oldChildren, newChildren, container);
    } else {
      if (typeof oldChildren === "string") hostSetElementText(container, "");
      mountChildren(newChildren, container);
    }
    return;
  }

  if (Array.isArray(oldChildren)) unmountChildren(oldChildren);
  else if (typeof oldChildren === "string") hostSetElementText(container, "");
}

function processComponent(
  oldVNode: VNode | null,
  newVNode: VNode,
  container: HostParent,
  anchor: HostNode | null,
) {
  if (!oldVNode) {
    const subTree = normalizeVNode(
      (newVNode.type as ComponentDefinition).render(componentProps(newVNode.props)),
    );
    const instance = newVNode.component = { vnode: newVNode, subTree };
    patch(null, subTree, container, anchor);
    newVNode.el = subTree.el;
    instance.subTree = subTree;
  } else {
    const instance = newVNode.component = oldVNode.component!;
    const previousTree = instance.subTree;
    const nextTree = normalizeVNode(
      (newVNode.type as ComponentDefinition).render(componentProps(newVNode.props)),
    );

    instance.vnode = newVNode;
    patch(previousTree, nextTree, container, anchor);
    instance.subTree = nextTree;
    newVNode.el = nextTree.el;
  }
}

function patchKeyedChildren(oldChildren: VNode[], newChildren: VNode[], container: HostElement) {
  const oldByKey = new Map<PropertyKey, VNode>();
  const usedOld = new Set<VNode>();

  for (const child of oldChildren) {
    if (child.key != null) oldByKey.set(child.key, child);
  }

  for (const newChild of newChildren) {
    let match = newChild.key != null ? oldByKey.get(newChild.key) : undefined;

    if (!match) {
      match = oldChildren.find((oldChild) =>
        oldChild.key == null
        && !usedOld.has(oldChild)
        && isSameVNodeType(oldChild, newChild));
    }

    if (match && isSameVNodeType(match, newChild)) {
      usedOld.add(match);
      patch(match, newChild, container);
    }
  }

  for (const oldChild of oldChildren) {
    if (!usedOld.has(oldChild)) unmount(oldChild);
  }

  for (let index = newChildren.length - 1; index >= 0; index--) {
    const child = newChildren[index]!;
    const anchor = newChildren[index + 1]?.el ?? null;

    if (!child.el) patch(null, child, container, anchor);
    else hostInsert(child.el, container, anchor);
  }
}

function mountChildren(children: VNode[], container: HostElement) {
  children.forEach((child) => patch(null, child, container));
}

function unmountChildren(children: VNode[]) {
  children.forEach(unmount);
}

function unmount(vnode: VNode) {
  if (vnode.component) unmount(vnode.component.subTree);
  else {
    if (Array.isArray(vnode.children)) unmountChildren(vnode.children);
    hostRemove(vnode.el);
  }
}

function isSameVNodeType(first: VNode, second: VNode) {
  return first.type === second.type && first.key === second.key;
}

function normalizeChildren(children: VNodeChild | VNodeChild[]): VNodeChildren {
  if (Array.isArray(children)) return children.map(normalizeVNode);
  if (children == null || typeof children === "boolean") return null;
  if (typeof children === "string" || typeof children === "number") return String(children);
  return [children];
}

function normalizeVNode(value: VNodeChild): VNode {
  if (isVNode(value)) return value;
  return h(Text, null, value == null || typeof value === "boolean" ? "" : String(value));
}

function isVNode(value: VNodeChild): value is VNode {
  return typeof value === "object" && value !== null && "type" in value;
}

function componentProps(props: Data | null) {
  const result = { ...(props ?? {}) };
  delete result.key;
  return result;
}
