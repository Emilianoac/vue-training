export type HostProps = Record<string, unknown>;

export type HostContainer = {
  kind: "container";
  children: HostNode[];
  _vnode: unknown | null;
};

export type HostElement = {
  kind: "element";
  type: string;
  props: HostProps;
  children: HostNode[];
  text: string | null;
  parent: HostParent | null;
};

export type HostText = {
  kind: "text";
  text: string;
  parent: HostParent | null;
};

export type HostNode = HostElement | HostText;
export type HostParent = HostContainer | HostElement;

export function createContainer(): HostContainer {
  return { kind: "container", children: [], _vnode: null };
}

export function createElement(type: string): HostElement {
  return {
    kind: "element",
    type,
    props: {},
    children: [],
    text: null,
    parent: null,
  };
}

export function createText(text: string): HostText {
  return { kind: "text", text, parent: null };
}

export function insert(node: HostNode, parent: HostParent, anchor: HostNode | null = null) {
  if (node.parent) {
    const previousIndex = node.parent.children.indexOf(node);
    if (previousIndex >= 0) node.parent.children.splice(previousIndex, 1);
  }

  if (parent.kind === "element") parent.text = null;

  const anchorIndex = anchor ? parent.children.indexOf(anchor) : -1;
  if (anchorIndex >= 0) parent.children.splice(anchorIndex, 0, node);
  else parent.children.push(node);

  node.parent = parent;
}

export function remove(node: HostNode | null) {
  if (!node?.parent) return;
  const index = node.parent.children.indexOf(node);
  if (index >= 0) node.parent.children.splice(index, 1);
  node.parent = null;
}

export function nextSibling(node: HostNode) {
  if (!node.parent) return null;
  const index = node.parent.children.indexOf(node);
  return node.parent.children[index + 1] ?? null;
}

export function setElementText(element: HostElement, text: string) {
  element.children.forEach((child) => { child.parent = null; });
  element.children.length = 0;
  element.text = text;
}

export function setText(node: HostText, text: string) {
  node.text = text;
}

export function patchProp(
  element: HostElement,
  key: string,
  _previous: unknown,
  next: unknown,
) {
  if (next == null) delete element.props[key];
  else element.props[key] = next;
}

export function snapshot(parent: HostParent): unknown[] {
  return parent.children.map(snapshotNode);
}

function snapshotNode(node: HostNode): unknown {
  if (node.kind === "text") return node.text;
  return {
    type: node.type,
    props: { ...node.props },
    children: node.text ?? node.children.map(snapshotNode),
  };
}
