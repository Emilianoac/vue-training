import type { RandomTip } from "@/types/random-tip";

function dedent(str: string) {
  return str.replace(/^\s+/gm, '')
}

const randomTips: RandomTip[] = [
  {
    "id": 1,
    "mood": "angry",
    "category": {
      "id": "vue",
      "name": "Vue",
      "icon": `/images/quizzes/categories/vue.png`
    },
    "title": {
      "es": "¡No uses v-if y v-for en el mismo elemento!",
      "en": "Don't use v-if and v-for on the same element!"
    },
    "description": {
      "es": "Esto puede generar resultados inesperados porque v-if se evalúa después de v-for.",
      "en": "This can lead to unexpected results because v-if is evaluated after v-for."
    },
    "text": {
      "es": dedent(`
      ## **¡No uses \`v-if\` y \`v-for\` en el mismo elemento!**  
      Esto puede generar resultados inesperados porque \`v-if\` se evalúa después de \`v-for\`.  
      Si necesitas ambas cosas, considera mover \`v-if\` a un elemento \`<template>\` que envuelva al \`v-for\`.
      `),
      "en": dedent(`
      ## **Don't use \`v-if\` and \`v-for\` on the same element!**  
      This can lead to unexpected results because \`v-if\` is evaluated after \`v-for\`.  
      If you need both, consider moving \`v-if\` to a wrapping \`<template>\` element around the \`v-for\`.
      `)
    },
    "codeExamples": [
      {
        "lang": "javascript",
        "code": {
          "es": `<!-- ❌ Esto puede causar problemas -->\n<div v-for="item in items" v-if="item.visible">\n  {{ item.name }}\n</div>\n\n<!-- ✅ Mejor así -->\n<template v-for="item in items" :key="item.id">\n  <div v-if="item.visible">\n    {{ item.name }}\n  </div>\n</template>`,
          "en": `<!-- ❌ This can cause issues -->\n<div v-for="item in items" v-if="item.visible">\n  {{ item.name }}\n</div>\n\n<!-- ✅ Better this way -->\n<template v-for="item in items" :key="item.id">\n  <div v-if="item.visible">\n    {{ item.name }}\n  </div>\n</template>`
        }
      }
    ],
    "source": "https://vuejs.org/guide/essentials/list.html#v-for-with-v-if",
  },
  {
    "id": 2,
    "mood": "surprised",
    "category": {
      "id": "vue",
      "name": "Vue",
      "icon": `/images/quizzes/categories/vue.png`
    },
    "title": {
      "es": "¡Usa defineModel para simplificar el v-model en componentes!",
      "en": "Use defineModel to simplify v-model in components!"
    },
    "description": {
      "es": "Desde Vue 3.4 puedes usar defineModel para vincular v-model de forma más simple.",
      "en": "Since Vue 3.4 you can use defineModel to simplify v-model bindings."
    },
    "text": {
      "es": dedent(`
      ## **¡Usa \`defineModel\` para simplificar el \`v-model\`!**
      Si estás usando \`<script setup>\`, puedes usar la función \`defineModel\` en el componente hijo para recibir y actualizar el valor del \`v-model\` automáticamente.
      <br /> <br />
      Ya no necesitas declarar \`props\` ni emitir eventos manualmente.
      Esto hace tu código más limpio y fácil de mantener, especialmente cuando trabajas con formularios o inputs personalizados.
      <br /> <br />
      Además, \`defineModel\` permite nombrar múltiples modelos para manejar varios \`v-model\` en un mismo componente:
    `),
      "en": dedent(`
      ## **Use \`defineModel\` to simplify \`v-model\`!**
      If you're using \`<script setup>\`, you can use the \`defineModel\` function in the child component to automatically receive and update the value of the \`v-model\` binding.
      <br /> <br />
      You no longer need to declare \`props\` or emit update events manually.  
      It makes your code cleaner and easier to maintain, especially when working with forms or custom inputs.
      <br /> <br />
      Also, \`defineModel\` allows you to name multiple models to handle multiple \`v-model\` bindings in one component:
    `)
    },
    "codeExamples": [
      {
        "lang": "handlebars",
        "code": {
          "es": `<!-- ✅ Componente padre -->\n<script setup>\nimport CustomInput from "./CustomInput.vue";\nimport { ref } from "vue";\n\nconst name = ref("Juan");\n</script>\n\n<template>\n  <CustomInput v-model="name" />\n</template>;`,
          "en": `<!-- ✅ Parent component -->\n<script setup>\nimport CustomInput from "./CustomInput.vue";\nimport { ref } from "vue";\n\nconst name = ref("John");\n</script>\n\n<template>\n  <CustomInput v-model="name" />\n</template>;`
        }
      },
      {
        "lang": "handlebars",
        "code": {
          "es": `<!-- ✅ Componente hijo (CustomInput.vue) -->\n<script setup>\nconst model = defineModel();\n</script>\n\n<template>\n  <input v-model="model" />\n</template>;`,
          "en": `<!-- ✅ Child component (CustomInput.vue) -->\n<script setup>\nconst model = defineModel();\n</script>\n\n<template>\n  <input v-model="model" />\n</template>;`
        }
      },
      {
        "lang": "handlebars",
        "code": {
          "es": `<!-- ✅ Componente padre con múltiples v-model -->\n<script setup>\nimport CustomInput from "./CustomInput.vue";\nimport { ref } from "vue";\n\nconst isChecked = ref(false);\nconst title = ref("Hola");\n</script>\n\n<template>\n  <CustomInput v-model:checked="isChecked" v-model:title="title" />\n</template>;`,
          "en": `<!-- ✅ Parent component with multiple v-model -->\n<script setup>\nimport CustomInput from "./CustomInput.vue";\nimport { ref } from "vue";\n\nconst isChecked = ref(false);\nconst title = ref("Hello");\n</script>\n\n<template>\n  <CustomInput v-model:checked="isChecked" v-model:title="title" />\n</template>;`
        }
      },
      {
        "lang": "handlebars",
        "code": {
          "es": `<!-- ✅ Componente hijo con múltiples defineModel (CustomInput.vue) -->\n<script setup>\nconst checked = defineModel("checked");\nconst title = defineModel("title");\n</script>\n\n<template>\n  <input type="checkbox" v-model="checked" />\n  <input type="text" v-model="title" />\n</template>;`,
          "en": `<!-- ✅ Child component with multiple defineModel (CustomInput.vue) -->\n<script setup>\nconst checked = defineModel("checked");\nconst title = defineModel("title");\n</script>\n\n<template>\n  <input type="checkbox" v-model="checked" />\n  <input type="text" v-model="title" />\n</template>;`
        }
      }
    ],
    "source": "https://vuejs.org/api/sfc-script-setup.html#defineModel"
  },
  {
    "id": 4,
    "mood": "surprised",
    "category": {
      "id": "vue",
      "name": "Vue",
      "icon": `/images/quizzes/categories/vue.png`
    },
    "title": {
      "es": "¡Haz tus componentes más flexibles con scoped slots!",
      "en": "Make your components more flexible with scoped slots!"
    },
    "description": {
      "es": "Los scoped slots permiten que el componente padre controle cómo renderizar cada ítem del hijo.",
      "en": "Scoped slots let the parent control how to render each item of the child component."
    },
    "text": {
      "es": dedent(`
        ## **¡Haz tus componentes más flexibles con scoped slots!**
        Usa scoped slots cuando un componente hijo deba delegar el control visual al padre, como en un listado que carga datos pero deja que el padre decida cómo se muestra cada ítem.
        <br /> <br />
        Esto permite separar la lógica del diseño y reutilizar el mismo componente con distintos estilos.
        <br /> <br />
        Para pasar datos desde el componente hijo al slot, usamos \`v-bind\`, que expone un objeto con los valores que el padre puede usar en su plantilla.
      `),
      "en": dedent(`
        ## **Make your components more flexible with scoped slots!**
        Use scoped slots when a child component should delegate visual control to the parent — for example, in a list that loads data but lets the parent decide how each item is displayed.
        <br /> <br />
        This helps separate logic from layout and allows the same component to be reused with different styles.
        <br /> <br />
        To pass data from the child to the slot, use \`v-bind\`, which exposes an object with values the parent can access in its template.
      `)
    },
    "codeExamples": [
      {
        "lang": "handlebars",
        "code": {
          "es": "<!-- Componente padre -->\n<FancyList :api-url=\"url\">\n  <template #item=\"{ body, username, likes }\">\n    <div class=\"item\">\n      <p>{{ body }}</p>\n      <p>por {{ username }} | {{ likes }} likes</p>\n    </div>\n  </template>\n</FancyList>",
          "en": "<!-- Parent component -->\n<FancyList :api-url=\"url\">\n  <template #item=\"{ body, username, likes }\">\n    <div class=\"item\">\n      <p>{{ body }}</p>\n      <p>by {{ username }} | {{ likes }} likes</p>\n    </div>\n  </template>\n</FancyList>"
        }
      },
      {
        "lang": "handlebars",
        "code": {
          "es": "<!-- FancyList.vue -->\n<ul>\n  <li v-for=\"item in items\" :key=\"item.id\">\n    <slot name=\"item\" v-bind=\"item\" />\n  </li>\n</ul>",
          "en": "<!-- FancyList.vue -->\n<ul>\n  <li v-for=\"item in items\" :key=\"item.id\">\n    <slot name=\"item\" v-bind=\"item\" />\n  </li>\n</ul>"
        }
      }
    ],
    "source": "https://vuejs.org/guide/components/slots.html#scoped-slots"
  }
]

export default randomTips;