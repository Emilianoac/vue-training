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
  const instance: ComponentInstance = {
    uid: nextUid++,
    type: vnode.type,
    vnode,
    parent,
    root: null as unknown as ComponentInstance,
    provides: parent ? parent.provides : Object.create(null) as Data,
    props: {},
    attrs: {},
    slots: {},
    setupState: {},
    render: emptyRender,
    subTree: null,
    emit: () => {},
    hooks: { mounted: [], unmounted: [] },
    isMounted: false,
    isUnmounted: false,
  };

  instance.root = parent ? parent.root : instance;
  instance.emit = (event, ...args) => emit(instance, event, ...args);
  return instance;
}

export function setupComponent(instance: ComponentInstance) {
  initProps(instance);
  initSlots(instance);

  const setup = instance.type.setup;
  if (setup) {
    const previous = currentInstance;
    currentInstance = instance;

    try {
      const result = setup(shallowReadonly(instance.props), {
        attrs: instance.attrs,
        slots: instance.slots,
        emit: instance.emit,
      });

      if (typeof result === "function") instance.render = result;
      else if (result && typeof result === "object") instance.setupState = result;
    } finally {
      currentInstance = previous;
    }
  }

  if (instance.render === emptyRender) instance.render = instance.type.render ?? emptyRender;
}

export function emit(instance: ComponentInstance, event: string, ...args: unknown[]) {
  const handler = instance.vnode.props?.[toHandlerKey(event)];
  if (typeof handler === "function") handler(...args);
}

export function provide(key: PropertyKey, value: unknown) {
  if (!currentInstance) return;

  const parentProvides = currentInstance.parent?.provides;
  if (currentInstance.provides === parentProvides) {
    currentInstance.provides = Object.create(parentProvides) as Data;
  }

  currentInstance.provides[key] = value;
}

export function inject<T>(key: PropertyKey, fallback?: T): T | undefined {
  const provides = currentInstance?.parent?.provides;
  if (provides && key in provides) return provides[key] as T;
  return fallback;
}

export function onMounted(hook: () => void) {
  currentInstance?.hooks.mounted.push(hook);
}

export function onUnmounted(hook: () => void) {
  currentInstance?.hooks.unmounted.push(hook);
}

export function mountComponent(instance: ComponentInstance) {
  instance.subTree = instance.render(instance);
  instance.isMounted = true;
  instance.hooks.mounted.forEach((hook) => hook());
}

export function unmountComponent(instance: ComponentInstance) {
  instance.hooks.unmounted.forEach((hook) => hook());
  instance.isUnmounted = true;
}

export function getCurrentInstance() {
  return currentInstance;
}

export function resetRuntime() {
  nextUid = 0;
  currentInstance = null;
}

const emptyRender: RenderFunction = () => null;

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

function shallowReadonly(data: Data): Readonly<Data> {
  return new Proxy(data, {
    set: () => false,
    deleteProperty: () => false,
  });
}
