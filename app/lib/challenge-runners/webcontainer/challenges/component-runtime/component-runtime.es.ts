export type Data = Record<PropertyKey, unknown>;
export type RenderFunction = (instance: ComponentInstance) => unknown;
export type Slot = (props?: Data) => unknown[];

export type SetupContext = {
  attrs: Data;
  slots: Record<string, Slot>;
  emit: (event: string, ...args: unknown[]) => void;
};

export type ComponentDefinition = {
  props?: string[];
  emits?: string[];
  setup?: (props: Readonly<Data>, context: SetupContext) => Data | RenderFunction | void;
  render?: RenderFunction;
};

export type ComponentVNode = {
  type: ComponentDefinition;
  key?: PropertyKey | null;
  props?: Data;
  children?: Record<string, unknown | ((props: Data) => unknown)>;
};

export type ComponentInstance = {
  uid: number;
  type: ComponentDefinition;
  vnode: ComponentVNode;
  parent: ComponentInstance | null;
  root: ComponentInstance;
  provides: Data;
  props: Data;
  attrs: Data;
  slots: Record<string, Slot>;
  setupState: Data;
  render: RenderFunction;
  subTree: unknown;
  emit: SetupContext["emit"];
  hooks: { mounted: Array<() => void>; unmounted: Array<() => void> };
  isMounted: boolean;
  isUnmounted: boolean;
};

let nextUid = 0;
let currentInstance: ComponentInstance | null = null;

export function createComponentInstance(
  vnode: ComponentVNode,
  parent: ComponentInstance | null = null,
): ComponentInstance {
  // TODO: conecta root, provides heredado y emit con esta instancia concreta.
  const instance: ComponentInstance = {
    uid: nextUid++,
    type: vnode.type,
    vnode,
    parent,
    root: null as unknown as ComponentInstance,
    provides: Object.create(null) as Data,
    props: {},
    attrs: {},
    slots: {},
    setupState: {},
    render: () => null,
    subTree: null,
    emit: () => {},
    hooks: { mounted: [], unmounted: [] },
    isMounted: false,
    isUnmounted: false,
  };

  instance.root = instance;
  return instance;
}

export function setupComponent(instance: ComponentInstance) {
  initProps(instance);
  initSlots(instance);

  // TODO: ejecuta setup con instance como currentInstance y restaura la anterior.
  // Guarda un objeto en setupState o una función en render.
  instance.render = instance.type.render ?? (() => null);
}

export function emit(instance: ComponentInstance, event: string, ...args: unknown[]) {
  // TODO: encuentra el listener normalizado en instance.vnode.props y ejecútalo.
  void instance;
  void event;
  void args;
}

export function provide(key: PropertyKey, value: unknown) {
  // TODO: escribe mediante currentInstance y crea una capa heredada cuando corresponda.
  void key;
  void value;
}

export function inject<T>(key: PropertyKey, fallback?: T): T | undefined {
  // TODO: busca desde provides del padre de la instancia activa.
  void key;
  return fallback;
}

export function onMounted(hook: () => void) {
  // TODO: registra el hook en la instancia activa.
  void hook;
}

export function onUnmounted(hook: () => void) {
  // TODO: registra el hook en la instancia activa.
  void hook;
}

export function mountComponent(instance: ComponentInstance) {
  // TODO: renderiza el subTree, marca la instancia e invoca los hooks mounted.
  instance.subTree = instance.render(instance);
}

export function unmountComponent(instance: ComponentInstance) {
  // TODO: invoca los hooks unmounted y marca la instancia como desmontada.
  void instance;
}

export function getCurrentInstance() {
  return currentInstance;
}

export function resetRuntime() {
  nextUid = 0;
  currentInstance = null;
}

function initProps(instance: ComponentInstance) {
  const declaredProps = new Set(instance.type.props ?? []);
  const rawProps = instance.vnode.props ?? {};

  for (const [key, value] of Object.entries(rawProps)) {
    if (declaredProps.has(key)) instance.props[key] = value;
    else if (!isDeclaredListener(instance, key)) instance.attrs[key] = value;
  }
}

function initSlots(instance: ComponentInstance) {
  for (const [name, rawSlot] of Object.entries(instance.vnode.children ?? {})) {
    instance.slots[name] = (slotProps = {}) => {
      const value = typeof rawSlot === "function" ? rawSlot(slotProps) : rawSlot;
      return Array.isArray(value) ? value : [value];
    };
  }
}

function isDeclaredListener(instance: ComponentInstance, key: string) {
  return (instance.type.emits ?? []).some((event) => toHandlerKey(event) === key);
}

function toHandlerKey(event: string) {
  return `on${event.charAt(0).toUpperCase()}${event.slice(1)}`;
}
