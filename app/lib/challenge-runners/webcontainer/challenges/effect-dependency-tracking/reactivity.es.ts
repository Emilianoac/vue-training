type Effect = () => void;

let activeEffect: Effect | undefined;
let targetMap = new WeakMap<object, Map<PropertyKey, Set<Effect>>>();

export function effect(fn: Effect) {
  // TODO: crea un runner que se marque como activo mientras ejecuta `fn`.
}

export function track(target: object, key: PropertyKey) {
  // TODO: conecta el efecto activo con el objeto y la clave.
}

export function trigger(target: object, key: PropertyKey) {
  // TODO: vuelve a ejecutar los efectos conectados con el objeto y la clave.
}

export function reactive<T extends object>(target: T): T {
  // TODO: retorna un Proxy que siga lecturas y dispare escrituras.
  return target;
}

export function resetReactivity() {
  activeEffect = undefined;
  targetMap = new WeakMap();
}
