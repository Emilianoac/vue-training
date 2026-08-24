---
documentId: template-compilation-lesson
title: De templates a estrategias de renderizado
level: basic
description: Comprende cómo Vue analiza un template, genera una función de render y comunica optimizaciones al runtime, además de cómo Vapor cambia el destino de la compilación.
---

## Convertir sintaxis declarativa en instrucciones

Un template describe el resultado que queremos sin detallar cada operación necesaria para producirlo:

```vue
<template>
  <p :class="{ active }">{{ count }}</p>
</template>
```

El navegador no sabe interpretar interpolaciones ni directivas de Vue. Antes de renderizar, el compilador convierte esa sintaxis en JavaScript. En el modo Virtual DOM tradicional, el resultado es una función de render que crea VNodes:

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

Esta es una representación conceptual: los nombres auxiliares y detalles exactos pueden variar entre versiones y modos de compilación. Lo importante es el contrato. El compilador descubre la estructura y genera instrucciones; el runtime ejecuta esas instrucciones con los valores actuales.

El template no es un VNode ni una alternativa que el renderer interprete directamente. Es código fuente para otra etapa del sistema.

---

## Recorrer parse, transform y codegen

Un compilador reducido puede dividir su trabajo en tres fases:

1. **Parse** lee el texto y construye un Abstract Syntax Tree o AST.
2. **Transform** recorre el AST, resuelve el significado de cada nodo y prepara optimizaciones.
3. **Codegen** convierte el árbol transformado en código JavaScript.

Para este template:

```vue
<h1>Hola {{ name }}</h1>
```

un AST pedagógico podría verse así:

```js
{
  type: 'Root',
  children: [{
    type: 'Element',
    tag: 'h1',
    props: [],
    children: [
      { type: 'Text', content: 'Hola ' },
      { type: 'Interpolation', content: 'name' },
    ],
  }],
}
```

El AST conserva significado, no solo caracteres. Gracias a esa estructura, una transformación puede tratar de forma distinta un elemento, una interpolación o una directiva sin volver a analizar el string original.

```js
function compile(template) {
  const ast = parse(template);
  transform(ast);
  return generate(ast);
}
```

Separar las fases también mejora los errores: el parser puede informar una etiqueta sin cerrar con su ubicación, mientras que una transformación puede rechazar una expresión inválida dentro de una directiva.

---

## Resolver expresiones dentro del contexto

Una interpolación no se copia como texto literal. El compilador la convierte en una lectura del contexto de render:

```vue
<p>{{ user.name }}</p>
```

```js
toDisplayString(_ctx.user.name);
```

`_ctx` representa los valores disponibles para el template. En un SFC con `<script setup>`, el compilador conoce además los bindings declarados por el script y puede generar accesos más directos. En ambos casos debe distinguir identificadores locales de nombres globales permitidos.

Los alias creados por `v-for` introducen un scope propio:

```vue
<li v-for="item in items">{{ item.name }}</li>
```

`items` pertenece al contexto del componente, pero `item` es local a la función generada para cada entrada. Añadir `_ctx.item` sería un error conceptual.

El compilador no evalúa `user.name` durante el build. Conserva la expresión para que la función de render la ejecute después con el estado de cada instancia.

---

## Distinguir elementos, componentes y slots

Una etiqueta nativa conocida puede convertirse directamente en un VNode de elemento:

```vue
<article>Perfil</article>
```

```js
createElementVNode('article', null, 'Perfil');
```

Una etiqueta de componente necesita resolverse en el contexto de la aplicación:

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

Los children de un componente se convierten en funciones de slot porque pertenecen al contexto de render del padre, aunque el hijo decida dónde invocarlos. Esta diferencia permite que el mismo lenguaje de templates produzca contratos distintos para elementos host y componentes.

---

## Transformar directivas según su responsabilidad

Las directivas no se procesan todas mediante un único mecanismo runtime. El compilador conoce su semántica y elige una transformación.

- `v-bind` produce props o argumentos dinámicos.
- `v-on` produce listeners y aplica helpers para modifiers cuando corresponde.
- `v-if` y `v-for` cambian la estructura del árbol generado.
- `v-model` expande un contrato de valor y actualización; en elementos nativos también puede necesitar una directiva runtime.
- Una directiva personalizada se conserva como metadata asociada al VNode mediante `withDirectives()`.

Por ejemplo:

```vue
<button :disabled="saving" @click.stop="save">Guardar</button>
```

puede producir conceptualmente:

```js
createElementVNode('button', {
  disabled: _ctx.saving,
  onClick: withModifiers(_ctx.save, ['stop']),
}, 'Guardar');
```

La sintaxis desaparece, pero su comportamiento permanece en props, helpers o ramas de código. Comprender una directiva implica preguntar qué cambia en el programa generado, no imaginar que el runtime vuelve a leer el atributo original.

---

## Convertir v-if en ramas con identidad

`v-if` decide qué subárbol debe existir. Una forma reducida de su salida es una expresión condicional:

```vue
<p v-if="visible">{{ message }}</p>
<p v-else>Oculto</p>
```

```js
return _ctx.visible
  ? createElementBlock('p', { key: 0 }, toDisplayString(_ctx.message))
  : createElementBlock('p', { key: 1 }, 'Oculto');
```

Las ramas reciben identidad distinta para que el renderer no confunda dos resultados estructuralmente parecidos. Cuando no hay rama alternativa, el compilador puede generar un nodo Comment como placeholder y mantener una posición estable dentro del árbol.

Una directiva estructural crea límites que afectan también a los blocks dinámicos. El compilador debe preservar suficiente información para que cambiar de rama monte, actualice o desmonte el subárbol correcto.

---

## Convertir v-for en una lista renderizada

`v-for` combina una fuente, alias locales y una función que produce un VNode por entrada:

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

El resultado suele envolverse en un Fragment porque la directiva puede producir cero, uno o muchos nodos. El compilador puede indicar además si el fragmento es estable, keyed o unkeyed, pero no inventa identidad: la calidad de `:key` continúa dependiendo del dato elegido por quien escribió el template.

El scope de `item` termina al cerrar la función generada. Una implementación reducida del transform debe registrar ese alias mientras recorre los children y retirarlo después.

---

## Evitar trabajo con contenido estático

El compilador puede demostrar que ciertas partes no dependen del contexto:

```vue
<section>
  <h2>Cuenta</h2>
  <p>{{ user.name }}</p>
</section>
```

`<h2>Cuenta</h2>` es estático. Vue puede crearlo una vez, guardarlo en caché y reutilizar el mismo VNode durante renders posteriores. Grupos estáticos suficientemente grandes también pueden condensarse en una representación estática que el renderer monta de forma eficiente.

La misma idea puede aplicarse a handlers cuando es seguro conservar su identidad:

```js
onClick: _cache[0] || (_cache[0] = (...args) => _ctx.save(...args));
```

Cachear requiere una prueba de estabilidad. Una expresión que depende de un alias de `v-for`, por ejemplo, no puede elevarse fuera de la función de esa iteración sin cambiar su significado.

---

## Comunicar cambios mediante patch flags

Un VDOM puramente runtime debe comparar defensivamente cada prop y cada child. Vue puede hacer menos porque el compilador ya conoce qué partes son dinámicas.

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

El número final combina **patch flags**. El renderer usa comprobaciones bitwise para entrar solo en los caminos necesarios:

```js
if (vnode.patchFlag & PatchFlags.TEXT) {
  hostSetElementText(vnode.el, vnode.children);
}

if (vnode.patchFlag & PatchFlags.CLASS) {
  hostPatchProp(vnode.el, 'class', oldProps.class, newProps.class);
}
```

Otros flags pueden señalar props dinámicas concretas, estilos, fragments estables o situaciones donde hace falta un diff más completo. Son un protocolo privado entre compilador y renderer; no una API que normalmente deba escribir una aplicación.

---

## Agrupar nodos dinámicos en blocks

Un block representa una región cuya estructura interna es estable durante una rama concreta. Mientras genera VNodes, Vue registra en el block solo los descendientes dinámicos relevantes:

```text
section (block)
├─ h2 estático
├─ p con texto dinámico
└─ div estático
   └─ span con class dinámica
```

La lista a actualizar queda conceptualmente aplanada:

```js
block.dynamicChildren = [dynamicParagraph, dynamicSpan];
```

En el siguiente render, el renderer puede recorrer esa lista en vez de inspeccionar todo el subárbol. `v-if` y `v-for` abren nuevos blocks porque pueden alterar qué nodos existen o cómo se repiten.

Patch flags describen **qué** puede cambiar en un VNode; los blocks reducen **qué VNodes** es necesario visitar. Ambas optimizaciones nacen del análisis estático y solo funcionan porque compiler y runtime comparten el mismo contrato.

---

## Elegir compilación anticipada o en runtime

En una aplicación con SFCs, el plugin de build procesa cada archivo `.vue`. `@vue/compiler-sfc` separa `template`, `script` y `style`, y el compilador de templates genera el código de render antes de que la aplicación llegue al navegador.

La compilación anticipada ofrece varias ventajas:

- los errores del template aparecen durante desarrollo o build;
- el navegador no descarga el compilador;
- el resultado puede optimizarse junto con información de `<script setup>`;
- el runtime recibe JavaScript listo para ejecutar.

La compilación en runtime sigue siendo posible en builds de Vue que incluyen el compiler, por ejemplo cuando una aplicación recibe un string de template. Ese string se transforma al iniciar, por lo que aumenta el peso y desplaza errores al navegador. Un build runtime-only no puede convertir templates recibidos dinámicamente, aunque sí ejecuta funciones de render ya compiladas.

Compilar en otro momento no cambia el contrato VDOM: en ambos casos el resultado tradicional sigue siendo una función que produce VNodes.

---

## Diseñar un compilador pedagógico reducido

Un ejercicio manejable no necesita aceptar todo HTML ni todas las directivas de Vue. Puede definir una gramática explícita:

```text
Root          → Child*
Child         → Element | Text | Interpolation
Element       → "<" Tag ">" Child* "</" Tag ">"
Interpolation → "{{" Expression "}}"
```

Su parser avanza con un cursor compartido y cada función consume una forma concreta:

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

Después, `transform` puede registrar helpers y preparar una expresión `codegenNode`; `generate` emite una función que recibe `_ctx` y llama a un helper reducido como `h()`.

Los límites también forman parte del diseño. Si la gramática no admite atributos, comentarios o HTML autocerrado, debe rechazarlos claramente en vez de producir código silenciosamente incorrecto. La meta es reconstruir el pipeline y sus invariantes, no copiar el compilador completo de Vue.

---

## Comparar VDOM y Vapor Mode

El pipeline tradicional usa el compilador para producir VNodes optimizados:

```text
template → render function → VNodes → renderer → DOM
```

**Vapor Mode** conserva la idea de analizar el template, pero genera operaciones más directas sobre nodos y efectos reactivos:

```text
template → DOM creation + targeted reactive updates
```

En vez de crear un árbol VNode nuevo para cada render del componente, el código compilado puede crear una estructura DOM una vez y conectar una expresión dinámica con la operación concreta que debe actualizarla. Esto reduce el runtime base y evita parte del trabajo de reconciliación.

No significa que Vapor sea un renderer VDOM más rápido ni que todas las APIs sean intercambiables. Es otro destino de compilación. Las APIs que dependen de VNodes, render functions o del proxy público de la instancia necesitan interop o pueden no estar disponibles.

---

## Activar Vapor según el alcance

En Vue 3.6 RC, un SFC con `<script setup>` puede activar Vapor mediante el atributo `vapor`:

```vue
<script setup vapor>
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

`<script vapor>` es una forma abreviada de `<script setup vapor>`. Un componente que solo contiene template también puede marcar el destino de compilación directamente:

```vue
<template vapor>
  <p>{{ message }}</p>
</template>
```

Marcar el componente decide cómo se compila ese SFC; el punto de entrada decide qué runtime inicia la aplicación. Una aplicación compuesta completamente por componentes Vapor usa `createVaporApp()`:

```js
import { createVaporApp } from 'vue';
import App from './App.vue';

createVaporApp(App).mount('#app');
```

Para renderizar componentes Vapor dentro de una aplicación VDOM existente, creada con `createApp()`, se instala el plugin de interoperabilidad:

```js
import { createApp, vaporInteropPlugin } from 'vue';
import App from './App.vue';

createApp(App)
  .use(vaporInteropPlugin)
  .mount('#app');
```

El plugin también permite introducir componentes VDOM dentro de una aplicación Vapor, pero incorpora el runtime VDOM y reduce el ahorro de bundle. Los componentes escritos con render functions o JSX continúan siendo VDOM. Por eso conviene mantener regiones claras en cada modo y usar interop como puente, no asumir que convierte automáticamente un componente de una estrategia a la otra.

Vapor admite SFCs template-only y `<script setup>`, pero no Options API, y algunas APIs dependientes de VNodes o de la instancia pública no aplican. Activarlo exige revisar la compatibilidad del componente y sus dependencias, no solo agregar un atributo.

Vue Training usa actualmente Vue 3.5.38, donde estas entradas de Vapor todavía no forman parte del flujo estable disponible. Añadir `vapor` a un SFC de este proyecto no basta para activarlo: primero sería necesaria una actualización deliberada de Vue y de la integración del build. Por eso los challenges siguen apoyándose en VDOM y Vapor funciona aquí como comparación final. Muestra que el valor central del template compiler no es producir VNodes específicamente, sino transformar conocimiento estático en instrucciones eficientes para una estrategia de renderizado.
