---
documentId: rendering-components-lesson
title: De VNodes al DOM
level: basic
description: Comprende cómo un renderer monta, compara y actualiza árboles de elementos y componentes mediante VNodes.
---

## Describir antes de modificar

Una función de render no crea DOM directamente. Produce una descripción en memoria de la interfaz deseada:

```js
function render() {
  return h('section', { class: 'profile' }, [
    h('h2', null, user.name),
    h('button', { onClick: save }, 'Guardar'),
  ]);
}
```

`h()` crea **Virtual Nodes** o VNodes. El resultado anterior puede representarse de forma reducida así:

```js
{
  type: 'section',
  props: { class: 'profile' },
  children: [/* más VNodes */],
  key: null,
  el: null,
}
```

El VNode expresa qué debería existir, no los pasos necesarios para crearlo. El renderer recibe esa descripción y decide qué operaciones aplicar al entorno real.

Durante el primer render no existe un árbol anterior, por lo que el renderer monta todo. En los siguientes conserva ambos árboles: compara el VNode anterior con el nuevo y modifica solo lo necesario. Ese proceso se llama `patch`, diff o reconciliation.

Los modelos siguientes son reducciones pedagógicas. Explican las decisiones principales del renderer de Vue, pero omiten optimizaciones, componentes integrados y casos específicos de plataformas.

---

## Reconocer la anatomía de un VNode

Los campos principales cumplen responsabilidades distintas:

- `type` identifica un elemento, componente o nodo especial.
- `props` contiene atributos, propiedades, listeners y datos reservados como `key`.
- `children` describe texto, una lista de VNodes o slots cuando el tipo es un componente.
- `key` expresa identidad entre dos listas renderizadas.
- `el` enlaza la descripción con el nodo host que fue montado.
- `component` puede enlazar un VNode de componente con su instancia viva.

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

`el` comienza en `null` y se asigna al montar. En una actualización compatible, el nuevo VNode hereda la referencia del anterior para que el renderer modifique el mismo nodo real.

Un VNode representa una aparición concreta y debe mantener su propia relación con el host. Reutilizar exactamente el mismo objeto VNode en dos posiciones produciría una identidad ambigua; para repetir una estructura se crean VNodes nuevos o se clonan.

---

## Normalizar distintas formas de children

Las funciones de render pueden retornar valores con varias formas. El renderer los normaliza antes de operar:

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

Un nodo `Text` da una representación uniforme a strings y números. Un `Comment` puede conservar una posición vacía y un `Fragment` agrupa varios hijos sin añadir un elemento visible solo para contenerlos.

En una implementación real, comentarios, nodos estáticos y VNodes ya montados requieren tratamiento adicional. La idea central es que `patch` no tenga que resolver combinaciones arbitrarias en cada rama: recibe formas conocidas y normalizadas.

---

## Separar el renderer del host

Crear, insertar o eliminar nodos no significa necesariamente llamar directamente a `document`. El renderer puede recibir operaciones del host:

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

El algoritmo de VNodes pertenece al runtime core; las operaciones concretas pertenecen al host. En el navegador, `patchProp` decide si una key corresponde a atributo, propiedad, clase, estilo o listener. Otro renderer podría construir objetos, dibujar en canvas o comunicarse con una plataforma distinta conservando el mismo recorrido lógico.

El `anchor` indica insertar antes de qué nodo. Usar `null` significa insertar al final. Esta referencia se vuelve importante al mover nodos y al representar fragments mediante límites.

---

## Despachar cada tipo desde patch

`patch` recibe el VNode anterior, el nuevo, el contenedor y una posición opcional:

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

Un `oldVNode` nulo significa montaje. Si ambos VNodes tienen el mismo `type` y `key`, pueden actualizarse preservando su identidad host o su instancia. Si no coinciden, el renderer desmonta el árbol anterior y monta uno nuevo.

La comparación no intenta descubrir que un `<button>` “se parece” a un `<a>`. Tipos distintos representan identidades incompatibles y deben reemplazarse.

---

## Montar un elemento

Montar crea primero el elemento, aplica sus props, monta sus hijos y finalmente lo inserta:

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

Montar los hijos antes de insertar el elemento permite construir su subárbol fuera del documento y realizar una inserción final. Cada hijo se normaliza y pasa de nuevo por `patch(null, child, element)`.

`key` participa en el algoritmo virtual, pero no debe terminar como atributo visible. Otras props reservadas, como refs y hooks de VNode, también pertenecen al runtime y siguen canales propios.

---

## Actualizar un elemento existente

Cuando los tipos coinciden, el nuevo VNode reutiliza `oldVNode.el`. Después se comparan props y children:

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

El primer recorrido añade o actualiza. El segundo elimina lo que dejó de existir. Entregar los valores anterior y nuevo permite que el host actualice un listener o limpie un estilo sin reconstruir el elemento completo.

Comparar referencias funciona para props normalizadas por la función de render. Si se muta y reutiliza el mismo objeto de props entre dos VNodes, se pierde el snapshot anterior necesario para detectar cambios; los VNodes deberían describir resultados independientes.

---

## Cambiar la forma de children

Los children pueden pasar entre texto, lista y ausencia. Cada transición necesita una operación distinta:

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

Antes de montar una lista donde había texto, el texto debe limpiarse. Antes de establecer texto donde había VNodes, esos hijos deben desmontarse para liberar componentes, efectos y refs, no solo borrarse visualmente.

El caso lista contra lista conduce al diff de children.

---

## Procesar VNodes de componentes

Un VNode cuyo `type` es una definición de componente no produce un elemento directamente. En el montaje crea una instancia y renderiza su `subTree`:

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

El VNode conserva `component`; la instancia conserva `subTree`; el subTree termina enlazado a nodos host. Así un componente participa en el árbol virtual aunque no equivalga por sí mismo a una etiqueta DOM.

En una actualización proveniente del padre, el renderer decide si las nuevas props o slots requieren volver a ejecutar el componente. Si no cambió ninguna entrada relevante, puede reutilizar la instancia y omitir su render. Si debe actualizar, entrega el nuevo VNode a la misma instancia y coordina el update dentro del recorrido del padre. Las invalidaciones nacidas del propio estado reactivo sí pasan por el scheduler de la instancia.

---

## Comparar listas sin keys

Un diff sin keys empareja hijos por posición. Actualiza la parte compartida y luego monta o desmonta el sobrante:

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

Este enfoque es válido cuando la identidad depende realmente de la posición. Si se inserta un elemento al principio, cada posición posterior se empareja con un VNode diferente. En elementos simples puede producir actualizaciones innecesarias; en componentes con estado puede asociar el estado existente con el dato equivocado.

---

## Conservar identidad con key

En una lista keyed, `key` expresa qué hijo nuevo corresponde a qué hijo anterior, aunque cambie de posición:

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

Un diff keyed eficiente suele seguir estas etapas:

1. Sincronizar el prefijo mientras coincidan type y key.
2. Sincronizar el sufijo.
3. Si una lista se agotó, montar o desmontar el resto.
4. Crear un mapa `key → índice nuevo` para la zona central.
5. Recorrer los hijos anteriores: parchear coincidencias y desmontar ausentes.
6. Recorrer la zona nueva en reversa para montar faltantes y mover nodos usando anchors.

```js
const newIndexByKey = new Map();

for (let index = newStart; index <= newEnd; index++) {
  newIndexByKey.set(newChildren[index].key, index);
}
```

Vue también puede calcular una subsecuencia creciente para conservar en su sitio la mayor cantidad posible de nodos ya ordenados y reducir movimientos. Esa optimización cambia cuántos nodos se mueven, no el significado de `key`.

Las keys deben ser estables y únicas entre hermanos. Usar el índice como key en una lista reordenable vuelve a describir posiciones, no la identidad de los datos.

---

## Mover y desmontar árboles completos

Mover un elemento llama a `hostInsert` con un nuevo anchor; insertar un nodo ya montado cambia su posición. Mover un componente significa mover el nodo o rango producido por su subTree. Un Fragment puede necesitar anchors de inicio y fin para representar un rango sin wrapper visible.

Desmontar también depende del tipo:

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

Retirar solo el elemento visible de un componente dejaría vivos sus efectos y hooks. El renderer debe recorrer la propiedad lógica del trabajo antes de eliminar sus nodos host.

El pipeline completo conserva así una cadena de identidad:

```text
render function → nuevo árbol de VNodes
                         ↓ patch
VNode anterior + VNode nuevo → mount · update · move · unmount
                                      ↓ operaciones host
                                  DOM actualizado
```

Los VNodes describen el resultado deseado; `patch` preserva o reemplaza identidades; el diff de children encuentra correspondencias; las operaciones host materializan la decisión. El compilador puede añadir pistas para acelerar este recorrido, pero el renderer sigue siendo quien convierte esas descripciones en cambios reales.
