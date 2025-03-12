import type { Quiz } from "@/types/quiz";

const quiz: Quiz = {
  "id": "introduction-to-vue-3",
  "isPublic": true,
  "slug": "intoduction-to-vue-3",
  "level": "easy",
  "category": {
    "id": "vue",
    "name": "Vue",
    "image": "public/images/quizzes/categories/vue.png"
  },
  "title": {
    "es": "Introducción a Vue 3",
    "en": "Introduction to Vue 3" 
  },
  "levelLabel": {
    "es": "Fácil",
    "en": "Easy"
  },
  "description": {
    "es": "Este quiz evalúa conocimientos básicos sobre directivas en Vue.js.",
    "en": "This quiz evaluates basic knowledge about directives in Vue.js."
  },
  "questions": [
    {
      "id": 1,
      "questionText": {
        "es": "¿Cuál es el propósito de computed en Vue?",
        "en": "What is the purpose of computed in Vue?"
      },
      "correctAnswerExplanation": {
        "es": "computed permite definir propiedades que se recalculan cuando sus dependencias cambian, ayudando a optimizar el rendimiento.",
        "en": "computed allows you to define properties that are recalculated when their dependencies change, helping to optimize performance."
      },
      "correctAnswerCodeExample": {
        "es" : `<script setup>\nimport { ref } from "vue";\n\nconst message = ref("Hola, Vue 3!");\n</script>`,
        "en": `<script setup>\nimport { ref } from "vue";\n\nconst message = ref("Hello, Vue 3!");\n</script>`
      },
      "codeLanguage": "handlebars",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Ejecutar una acción al montarse el componente.",
            "en": "Run an action when the component is mounted."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Definir propiedades reactivas que se recalculan automáticamente.",
            "en": "Define reactive properties that are recalculated automatically."
          },
          "isCorrect": true
        },
        {
          "id": 3,
          "answerText": {
            "es": "Actualizar el DOM de forma imperativa.",
            "en": "Update the DOM imperatively."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Llamar a una API externa.",
            "en": "Call an external API."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 2,
      "questionText": {
        "es": "¿Cómo defines métodos dentro de <script setup> usando la Composition API?",
        "en": "How do you define methods inside <script setup> using the Composition API?"
      },
      "correctAnswerExplanation": {
        "es": "Los métodos se definen directamente como funciones dentro de <script setup>, donde pueden ser llamados o retornados según se necesiten.",
        "en": "Methods are defined directly as functions inside <script setup>, where they can be called or returned as needed."
      },
      "correctAnswerCodeExample": {
        "es": `<script setup>\nconst sayHello = () => alert("¡Hola desde Vue 3!");\n</script>`,
        "en": `<script setup>\nconst sayHello = () => alert("Hello from Vue 3!");\n</script>`
      },
      "codeLanguage": "handlebars",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Usando la opción methods.",
            "en": "Using the methods option."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Definiéndolos directamente dentro de <script setup>.",
            "en": "Defining them directly inside <script setup>."
          },
          "isCorrect": true
        },
        {
          "id": 3,
          "answerText": {
            "es": "Asignando valores directamente en data.",
            "en": "Assigning values directly in data."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Solo se pueden definir en watch.",
            "en": "They can only be defined in watch."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 3,
      "questionText": {
        "es": "¿Cómo funciona el ciclo de vida onMounted en la Composition API?",
        "en": "How does the onMounted lifecycle work in the Composition API?"
      },
      "correctAnswerExplanation": {
        "es": "onMounted permite ejecutar código cuando el componente se ha añadido al DOM, similar al hook mounted en la Options API.",
        "en": "onMounted allows you to run code when the component has been added to the DOM, similar to the mounted hook in the Options API."
      },
      "correctAnswerCodeExample": {
        "es": `<script setup>\nimport { onMounted } from "vue";\n\nonMounted(() => {\n  console.log("Componente montado");\n});\n</script>`,
        "en": `<script setup>\nimport { onMounted } from "vue";\n\nonMounted(() => {\n  console.log("Component mounted");\n});\n</script>`
      },
      "codeLanguage": "handlebars",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Llama automáticamente a una API.",
            "en": "Automatically calls an API."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Define estilos para el componente.",
            "en": "Define styles for the component."
          },
          "isCorrect": false
        },
        {
          "id": 3,
          "answerText": {
            "es": "Se ejecuta al inicializar un ref.",
            "en": "Runs when initializing a ref."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Ejecuta una función cuando el componente se ha montado.",
            "en": "Runs a function when the component has mounted."
          },
          "isCorrect": true
        }
      ]
    },
    {
      "id": 4,
      "questionText": {
        "es": "¿Cuál es la función principal de reactive en Vue?",
        "en": "What is the main purpose of reactive in Vue?"
      },
      "correctAnswerExplanation": {
        "es": "reactive convierte un objeto en reactivo, permitiendo que Vue detecte y actualice automáticamente los cambios en sus propiedades.",
        "en": "reactive converts an object into reactive, allowing Vue to automatically detect and update changes to its properties."
      },
      "correctAnswerCodeExample": {
        "es": `<script setup>\nimport { reactive } from "vue";\n\nconst state = reactive({ count: 0 });\n</script>`,
        "en": `<script setup>\nimport { reactive } from "vue";\n\nconst state = reactive({ count: 0 });\n</script>`
      },
      "codeLanguage": "handlebars",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Ejecutar funciones del ciclo de vida.",
            "en": "Run lifecycle functions."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Crear una instancia de Vue.",
            "en": "Create a Vue instance."
          },
          "isCorrect": false
        },
        {
          "id": 3,
          "answerText": {
            "es": "Crear un objeto reactivo que detecta cambios en sus propiedades.",
            "en": "Create a reactive object that detects changes to its properties."
          },
          "isCorrect": true
        },
        {
          "id": 4,
          "answerText": {
            "es": "Definir rutas para la aplicación.",
            "en": "Define routes for the application."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 5,
      "questionText": {
        "es": "¿Para qué se utiliza ref en Vue?",
        "en": "What is ref used for in Vue?"
      },
      "correctAnswerExplanation": {
        "es": "ref se usa para crear una referencia reactiva de un valor, como números o strings, permitiendo que Vue reactive estos cambios.",
        "en": "ref is used to create a reactive reference to a value, such as numbers or strings, allowing Vue to react to these changes."
      },
      "correctAnswerCodeExample": {
        "es": `<script setup>\nimport { ref } from "vue";\n\nconst message = ref("Hola, Vue 3!");\n</script>`,
        "en": `<script setup>\nimport { ref } from "vue";\n\nconst message = ref("Hello, Vue 3!");\n</script>`
      },
      "codeLanguage": "handlebars",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Para crear una referencia reactiva de un valor primitivo.",
            "en": "To create a reactive reference to a primitive value."
          },
          "isCorrect": true
        },
        {
          "id": 2,
          "answerText": {
            "es": "Para manipular el DOM directamente.",
            "en": "To manipulate the DOM directly."
          },
          "isCorrect": false
        },
        {
          "id": 3,
          "answerText": {
            "es": "Para ejecutar funciones asíncronas.",
            "en": "To run asynchronous functions."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Para renderizar un componente condicionalmente.",
            "en": "To conditionally render a component."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 6,
      "questionText": {
        "es": "¿Para qué sirve watch en Vue?",
        "en": "What is watch used for in Vue?"
      },
      "correctAnswerExplanation": {
        "es": "watch permite observar cambios en datos reactivos y ejecutar funciones en respuesta a estos cambios.",
        "en": "watch allows you to watch for changes in reactive data and run functions in response to these changes."
      },
      "correctAnswerCodeExample": {
        "es": `<script setup>\nimport { ref, watch } from "vue";\n\nconst count = ref(0);\nwatch(count, (newCount) => {\n console.log("Nuevo valor:", newCount);\n});\n</script>`,
        "en": `<script setup>\nimport { ref, watch } from "vue";\n\nconst count = ref(0);\nwatch(count, (newCount) => {\n console.log("New value:", newCount);\n});\n</script>`
      },
      "codeLanguage": "handlebars",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Para modificar directamente el DOM.",
            "en": "To modify the DOM directly."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Para ejecutar código en respuesta a cambios en valores reactivos.",
            "en": "To run code in response to changes in reactive values."
          },
          "isCorrect": true
        },
        {
          "id": 3,
          "answerText": {
            "es": "Para ejecutar código solo al montar el componente.",
            "en": "To run code only when the component is mounted."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Para definir estilos dinámicos.",
            "en": "To define dynamic styles."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 7,
      "questionText": {
        "es": "¿Cómo se utiliza v-model en la Composition API con <script setup>?",
        "en": "How is v-model used in the Composition API with <script setup>?"
      },
      "correctAnswerExplanation": {
        "es": "v-model puede enlazarse con una variable reactiva creada con ref, permitiendo la reactividad bidireccional en el template.",
        "en": "v-model can be bound to a reactive variable created with ref, allowing for two-way reactivity in the template."
      },
      "correctAnswerCodeExample": {
        "es": `<script setup>\nimport { ref } from "vue";\n\nconst text = ref("");\n</script>\n\n<template>\n<input v-model="text"/>\n</template>`,
        "en": `<script setup>\nimport { ref } from "vue";\n\nconst text = ref("");\n</script>\n\n<template>\n<input v-model="text"/>\n</template>`,
      },
      "codeLanguage": "handlebars",
      answers: [
        {
          "id": 1,
          "answerText": {
            "es": "Definiendo métodos dentro de setup.",
            "en": "Defining methods inside setup."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Aplicando ref en propiedades reactivas.",
            "en": "Applying ref to reactive properties."
          },
          "isCorrect": false
        },
        {
          "id": 3,
          "answerText": {
            "es": "Usando ref con una variable reactiva en el template.",
            "en": "Using ref with a reactive variable in the template."
          },
          "isCorrect": true
        },
        {
          "id": 4,
          "answerText": {
            "es": "Definiendo el estado en data.",
            "en": "Defining state in data."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 8,
      "questionText": {
        "es": "¿Cuál es la diferencia principal entre ref y reactive en Vue 3?",
        "en": "What is the main difference between ref and reactive in Vue 3?"
      },
      "correctAnswerExplanation": {
        "es": "ref es útil para valores primitivos, mientras que reactive convierte objetos enteros en reactivos. Ambos permiten reactividad, pero reactive es preferido para estructuras de datos complejas.",
        "en": "ref is useful for primitive values, while reactive converts entire objects into reactive. Both allow reactivity, but reactive is preferred for complex data structures."
      },
      "correctAnswerCodeExample": {
        "es": `<script setup>\nimport { ref, reactive } from "vue";\n\nconst count = ref(0); // Para valores primitivos\nconst state = reactive({ count: 0, name: "Vue"}); // Para objetos\n</script>`,
        "en": `<script setup>\nimport { ref, reactive } from "vue";\n\nconst count = ref(0); // For primitive values\nconst state = reactive({ count: 0, name: "Vue"}); // For objects\n</script>`,
      },
      "codeLanguage": "handlebars",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "ref solo funciona con tipos de datos primitivos.",
            "en": "ref only works with primitive data types."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "reactive crea una referencia mutable.",
            "en": "reactive creates a mutable reference."
          },
          "isCorrect": false
        },
        {
          "id": 3,
          "answerText": {
            "es": "ref se usa para valores primitivos y reactive para objetos complejos.",
            "en": "ref is used for primitive values and reactive for complex objects."
          },
          "isCorrect": true
        },
        {
          "id": 4,
          "answerText": {
            "es": "reactive no permite reactividad.",
            "en": "reactive does not allow reactivity."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 9,
      "questionText": {
        "es": "¿Cómo defines props en un componente usando <script setup> en Vue 3?",
        "en": "How do you define props in a component using <script setup> in Vue 3?"
      },
      "correctAnswerExplanation": {
        "es": "Con <script setup>, las props se definen usando defineProps, lo cual permite recibir datos desde el componente padre de manera reactiva y fácil.",
        "en": "With <script setup>, props are defined using defineProps, which allows you to receive data from the parent component reactively and easily."
      },
      "correctAnswerCodeExample": {
        "es": `<script setup>\nconst props = defineProps({\n  title: String,\n  count: Number\n});\n</script>\n\n<template>\n  <h1>{{ title }}</h1>\n  <p>Count: {{ count }}</p>\n</template>`,
        "en": `<script setup>\nconst props = defineProps({\n  title: String,\n  count: Number\n});\n</script>\n\n<template>\n  <h1>{{ title }}</h1>\n  <p>Count: {{ count }}</p>\n</template>`,
      },
      "codeLanguage": "handlebars",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Creándolas con ref.",
            "en": "Creating them with ref."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Importando props desde vue.",
            "en": "Importing props from vue."
          },
          "isCorrect": false
        },
        {
          "id": 3,
          "answerText": {
            "es": "Definiendo defineProps dentro de <script setup>.",
            "en": "Defining defineProps inside <script setup>."
          },
          "isCorrect": true
        },
        {
          "id": 4,
          "answerText": {
            "es": "Usando la opción props en export default.",
            "en": "Using the props option in export default."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 10,
      "questionText": {
        "es": "¿Para qué sirve defineEmits en Vue 3?",
        "en": "What is defineEmits used for in Vue 3?"
      },
      "correctAnswerExplanation": {
        "es": "defineEmits permite declarar eventos que un componente puede emitir, facilitando la comunicación desde el componente hijo hacia el componente padre.",
        "en": "defineEmits allows you to declare events that a component can emit, facilitating communication from the child component to the parent component."
      },
      "correctAnswerCodeExample": {
          "es": `<script setup>\nconst emit = defineEmits(["increment"]);\nconst incrementCount = () => {\n emit("increment");\n};\n</script>\n\n<template>\n  <button @click="incrementCount">Incrementar</button>\n</template>`,
          "en": `<script setup>\nconst emit = defineEmits(["increment"]);\nconst incrementCount = () => {\n emit("increment");\n};\n</script>\n\n<template>\n  <button @click="incrementCount">Increment</button>\n</template>`, 
      },
      "codeLanguage": "handlebars",
      answers: [
        {
          "id": 1,
          "answerText": {
            "es": "Para definir propiedades reactivas.",
            "en": "To define reactive properties."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Para capturar eventos emitidos por el componente.",
            "en": "To capture events emitted by the component."
          },
          "isCorrect": false
        },
        {
          "id": 3,
          "answerText": {
            "es": "Para emitir eventos desde un componente hijo hacia su componente padre.",
            "en": "To emit events from a child component to its parent component."
          },
          "isCorrect": true
        },
        {
          "id": 4,
          "answerText": {
            "es": "Para importar variables reactivas desde el componente padre.",
            "en": "To import reactive variables from the parent component."
          },
          "isCorrect": false
        }
      ]
    }
  ]
};

export default quiz;

