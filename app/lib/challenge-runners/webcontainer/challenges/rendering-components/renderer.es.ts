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

export type ComponentInstance = { vnode: VNode; subTree: VNode };

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
  // TODO: aplica patch contra container._vnode y desmonta cuando vnode sea null.
  if (vnode) patch(null, vnode, container);
  container._vnode = vnode;
}

export function resetRenderer() {
  // Este renderer reducido conserva su estado en VNodes y containers.
}

function patch(
  oldVNode: VNode | null,
  newVNode: VNode,
  container: HostParent,
  anchor: HostNode | null = null,
) {
  // TODO: reemplaza identidades type/key incompatibles antes de despachar.
  void hostNextSibling;

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

  if (typeof vnode.children === "string") hostSetElementText(element, vnode.children);
  else if (Array.isArray(vnode.children)) mountChildren(vnode.children, element);

  hostInsert(element, container, anchor);
}

function patchElement(oldVNode: VNode, newVNode: VNode) {
  // TODO: reutiliza oldVNode.el, aplica props en ambas direcciones y actualiza children.
  const element = newVNode.el = oldVNode.el as HostElement;

  for (const [key, next] of Object.entries(newVNode.props ?? {})) {
    if (key !== "key") hostPatchProp(element, key, oldVNode.props?.[key], next);
  }
}

function patchChildren(oldVNode: VNode, newVNode: VNode, container: HostElement) {
  // TODO: maneja transiciones de texto, array y vacío sin filtrar árboles anteriores.
  void oldVNode;
  void newVNode;
  void container;
}

function processComponent(
  oldVNode: VNode | null,
  newVNode: VNode,
  container: HostParent,
  anchor: HostNode | null,
) {
  // TODO: conserva una instancia y parchea sus subTrees anterior y nuevo.
  if (!oldVNode) {
    const subTree = normalizeVNode(
      (newVNode.type as ComponentDefinition).render(newVNode.props ?? {}),
    );
    newVNode.component = { vnode: newVNode, subTree };
    patch(null, subTree, container, anchor);
    newVNode.el = subTree.el;
  }
}

function patchKeyedChildren(oldChildren: VNode[], newChildren: VNode[], container: HostElement) {
  // TODO: empareja type/key, elimina ausentes y monta o mueve al orden final.
  unmountChildren(oldChildren);
  mountChildren(newChildren, container);
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

void patchChildren;
void patchKeyedChildren;
