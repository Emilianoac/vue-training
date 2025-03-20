import type { Quiz } from "@/types/quiz";

const quiz: Quiz = {
  "id": "pinia-basics",
  "isPublic": true,
  "slug": "pinia-basics",
  "level": "easy",
  "category": {
    "id": "pinia",
    "name": "Pinia",
    "image": "public/images/quizzes/categories/pinia.png"
  },
  "title": {
    "es": "Introducción a Pinia",
    "en": "Introduction to Pinia"
  },
  "levelLabel": {
    "es": "Fácil",
    "en": "Easy"
  },
  "description": {
    "es": "Este cuestionario cubre los conceptos básicos de Pinia, el gestor de estado para Vue 3.",
    "en": "This quiz covers the basics of Pinia, the state manager for Vue 3."
  },
  "questions": [
    {
      "id": 1,
      "questionText": {
        "es": "¿Cuál es el propósito principal de Pinia en Vue 3?",
        "en": "What is the main purpose of Pinia in Vue 3?"
      },
      "correctAnswerExplanation": {
        "es": "Pinia es una biblioteca para la gestión de estado en Vue, que permite almacenar y compartir el estado de la aplicación en diferentes componentes.",
        "en": "Pinia is a library for state management in Vue, which allows storing and sharing the application state across different components."
      },
      "correctAnswerCodeExample": {
        "es": "",
        "en": "",
      },
      "codeLanguage": "plaintext",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Integrar componentes de terceros.",
            "en": "Integrating third-party components."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Gestionar el estado global de la aplicación.",
            "en": "Managing the global state of the application."
          },
          "isCorrect": true
        },
        {
          "id": 3,
          "answerText": {
            "es": "Crear componentes funcionales.",
            "en": "Creating functional components."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Renderizar el DOM del servidor.",
            "en": "Rendering the server-side DOM."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 2,
      "questionText": {
        "es": "¿Qué función se usa para definir un store en Pinia?",
        "en": "Which function is used to define a store in Pinia?"
      },
      "correctAnswerExplanation": {
        "es": "La función defineStore se utiliza para crear un nuevo store en Pinia, que se puede importar y utilizar en diferentes componentes de la aplicación.",
        "en": "The defineStore function is used to create a new store in Pinia, which can be imported and used in different components of the application."
      },
      "correctAnswerCodeExample": {
        "es": `import { defineStore } from "pinia";\n\nexport const useCounterStore = defineStore("counter", {\n  state: () => ({ count: 0 })\n});`,
        "en": `import { defineStore } from "pinia";\n\nexport const useCounterStore = defineStore("counter", {\n  state: () => ({ count: 0 })\n});`
      },
      "codeLanguage": "javascript",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "defineStore",
            "en": "defineStore"
          },
          "isCorrect": true
        },
        {
          "id": 2,
          "answerText": {
            "es": "createStore",
            "en": "createStore"
          },
          "isCorrect": false
        },
        {
          "id": 3,
          "answerText": {
            "es": "define",
            "en": "define"
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "setStore",
            "en": "setStore"
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 3,
      "questionText": {
        "es": "¿Cómo se accede al store desde un componente?",
        "en": "How do you access the store from a component?"
      },
      "correctAnswerExplanation": {
        "es": "Para acceder al store, se importa la función que define el store y luego se llama a esa función dentro del componente.",
        "en": "To access the store, you import the function that defines the store and then call that function inside the component."
      },
      "correctAnswerCodeExample": {
        "es": `<script setup>\n  import { useCounterStore } from "@/stores/counter";\n\n  const counterStore = useCounterStore();\n</script>\n`,
        "en": `<script setup>\n  import { useCounterStore } from "@/stores/counter";\n\n  const counterStore = useCounterStore();\n</script>\n`
      },
      "codeLanguage": "handlebars",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Usando this.store.",
            "en": "Using this.store."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Creando una instancia del store con new.",
            "en": "Creating an instance of the store with new."
          },
          "isCorrect": false
        },
        {
          "id": 3,
          "answerText": {
            "es": "Importando y llamando la función del store directamente.",
            "en": "Importing and calling the store function directly."
          },
          "isCorrect": true
        },
        {
          "id": 4,
          "answerText": {
            "es": "Mediante la opción computed.",
            "en": "Using the computed option."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 4,
      "questionText": {
        "es": "¿Cuál es la ventaja de usar defineStore con Composition API en Pinia?",
        "en": "What is the advantage of using defineStore with Composition API in Pinia?"
      },
      "correctAnswerExplanation": {
        "es": "Con defineStore, los stores de pinia pueden usarse directamente con Composition API, permitiendo un acceso más limpio y sin depender de this.",
        "en": "With defineStore, pinia stores can be used directly with Composition API, allowing cleaner access without relying on this."
      },
      "correctAnswerCodeExample": {
        "es": `import { defineStore } from "pinia";\nimport { ref, computed } from "vue";\n\nexport const useCounterStore = defineStore("counter", () => {\n  const count = ref(0);\n  const increment = () => count.value++;\n  const decrement = () => count.value--;\n  const doubleCount = computed(() => count.value * 2);\n  \n  return { count, increment, decrement, doubleCount };\n});`,
        "en": `import { defineStore } from "pinia";\nimport { ref, computed } from "vue";\n\nexport const useCounterStore = defineStore("counter", () => {\n  const count = ref(0);\n  const increment = () => count.value++;\n  const decrement = () => count.value--;\n  const doubleCount = computed(() => count.value * 2);\n  \n  return { count, increment, decrement, doubleCount };\n});`
      },
      "codeLanguage": "javascript",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Mejora el rendimiento de la aplicación.",
            "en": "Improves application performance."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Simplifica el acceso al estado sin this.",
            "en": "Simplifies state access without this."
          },
          "isCorrect": true
        },
        {
          "id": 3,
          "answerText": {
            "es": "Permite la integración con Vuex.",
            "en": "Allows integration with Vuex."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Permite usar solo datos estáticos.",
            "en": "Allows using only static data."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 5,
      "questionText": {
        "es": "¿Qué permite la opción state dentro de un store en Pinia?",
        "en": "What does the state option inside a store in Pinia allow?"
      },
      "correctAnswerExplanation": {
        "es": "La opción state define el estado inicial del store, que puede ser modificado o consultado por los componentes que lo utilicen.",
        "en": "The state option defines the initial state of the store, which can be modified or accessed by the components that use it."
      },
      "correctAnswerCodeExample": {
        "es": `import { defineStore } from "pinia";\n\nexport const useCounterStore = defineStore("counter", {\n  state: () => ({ \n    count: 0,\n  })\n});`,
        "en": `import { defineStore } from "pinia";\n\nexport const useCounterStore = defineStore("counter", {\n  state: () => ({ \n    count: 0,\n  })\n});`
      },
      "codeLanguage": "javascript",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Definir propiedades computadas.",
            "en": "Defining computed properties."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Definir el estado inicial del store.",
            "en": "Defining the initial state of the store."
          },
          "isCorrect": true
        },
        {
          "id": 3,
          "answerText": {
            "es": "Ejecutar acciones del ciclo de vida.",
            "en": "Executing lifecycle actions."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Establecer rutas de navegación.",
            "en": "Setting navigation routes."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 6,
      "questionText": {
        "es": "¿Cómo se define una acción en un store de Pinia?",
        "en": "How do you define an action in a Pinia store?"
      },
      "correctAnswerExplanation": {
        "es": "Las acciones en Pinia se definen dentro de la opción actions, permitiendo ejecutar métodos que modifican el estado del store.",
        "en": "Actions in Pinia are defined inside the actions option, allowing you to execute methods that modify the store state."
      },
      "correctAnswerCodeExample": {
        "es": `import { defineStore } from "pinia";\n\nexport const useCounterStore = defineStore("counter", {\n  state: () => ({ \n    count: 0 \n  }),\n  actions: {\n    increment() {\n      this.count++;\n    }\n  }\n});`,
        "en": `import { defineStore } from "pinia";\n\nexport const useCounterStore = defineStore("counter", {\n  state: () => ({ \n    count: 0 \n  }),\n  actions: {\n    increment() {\n      this.count++;\n    }\n  }\n});`
      },
      "codeLanguage": "javascript",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Con una propiedad setup.",
            "en": "With a setup property."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Usando computed.",
            "en": "Using computed."
          },
          "isCorrect": false
        },
        {
          "id": 3,
          "answerText": {
            "es": "Dentro de la opción state.",
            "en": "Inside the state option."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Usando la opción actions.",
            "en": "Using the actions option."
          },
          "isCorrect": true
        }
      ]
      
    },
    {
      "id": 7,
      "questionText": {
        "es": "¿Qué es un getter en Pinia?",
        "en": "What is a getter in Pinia?"
      },
      "correctAnswerExplanation": {
        "es": "Los getters en Pinia son propiedades derivadas del estado que se recalculan automáticamente cuando sus dependencias cambian.",
        "en": "Getters in Pinia are derived properties from the state that are automatically recalculated when their dependencies change."
      },
      "correctAnswerCodeExample": {
        "es": `import { defineStore } from "pinia";\n\nexport const useCounterStore = defineStore("counter", {\n  state: () => ({ \n    count: 0 \n  }),\n  getters: {\n    doubleCount: (state) => state.count * 2\n  }\n});`,
        "en": `import { defineStore } from "pinia";\n\nexport const useCounterStore = defineStore("counter", {\n  state: () => ({ \n    count: 0 \n  }),\n  getters: {\n    doubleCount: (state) => state.count * 2\n  }\n});`
      },
      "codeLanguage": "javascript",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Un método para definir rutas.",
            "en": "A method to define routes."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Un valor calculado que depende del estado.",
            "en": "A computed value that depends on the state."
          },
          "isCorrect": true
        },
        {
          "id": 3,
          "answerText": {
            "es": "Una función que inicializa el estado.",
            "en": "A function that initializes the state."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Un método asíncrono para actualizar datos.",
            "en": "An asynchronous method to update data."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 8,
      "questionText": {
        "es": "¿Cómo se define un store para mantener persistente su estado entre recargas de página?",
        "en": "How do you define a store to persist its state between page reloads?"
      },
      "correctAnswerExplanation": {
        "es": "Para mantener el estado persistente, se pueden utilizar librerías de persistencia que almacenan el estado en el navegador, permitiendo su restauración tras una recarga.",
        "en": "To keep the state persistent, you can use persistence libraries that store the state in the browser, allowing its restoration after a reload."
      },
      "correctAnswerCodeExample": {
        "es": "",
        "en": "",
      },
      "codeLanguage": "plaintext",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Usando sessionStorage en el componente.",
            "en": "Using sessionStorage in the component."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Configurando una librería de persistencia compatible con Pinia.",
            "en": "Configuring a persistence library compatible with Pinia."
          },
          "isCorrect": true
        },
        {
          "id": 3,
          "answerText": {
            "es": "Definiendo el store como un ref.",
            "en": "Defining the store as a ref."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Agregando los datos al componente directamente.",
            "en": "Adding the data to the component directly."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 9,
      "questionText": {
        "es": "¿Cómo puedes reiniciar el estado de un store creado con la options API en Pinia?",
        "en": "How can you reset the state of a store created with the options API in Pinia?"
      },
      "correctAnswerExplanation": {
        "es": "Pinia permite definir un método $reset() para restaurar el estado a su configuración inicial.",
        "en": "Pinia allows defining a $reset() method to restore the state to its initial configuration."
      },
      "correctAnswerCodeExample": {
        "es": `<script setup>\n  import { useCounterStore } from "@/stores/counter";\n\n  const counterStore = useCounterStore();\n\n  // Resetear el contador a su valor inicial\n  counterStore.$reset();\n</script>`,
        "en": `<script setup>\n  import { useCounterStore } from "@/stores/counter";\n\n  const counterStore = useCounterStore();\n\n  // Reset the counter to its initial value\n  counterStore.$reset();\n</script>`
      },
      "codeLanguage": "handlebars",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Usando el método $reset() del store.",
            "en": "Using the $reset() method of the store."
          },
          "isCorrect": true
        },
        {
          "id": 2,
          "answerText": {
            "es": "Reasignando el estado directamente.",
            "en": "Reassigning the state directly."
          },
          "isCorrect": false
        },
        {
          "id": 3,
          "answerText": {
            "es": "Definiendo un getter.",
            "en": "Defining a getter."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Utilizando defineStore nuevamente.",
            "en": "Using defineStore again."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 10,
      "questionText": {
        "es": "¿Qué función de Pinia permite realizar acciones asíncronas, como una llamada a una API?",
        "en": "What Pinia function allows performing asynchronous actions, such as an API call?"
      },
      "correctAnswerExplanation": {
        "es": "En Pinia, cualquier función dentro de actions puede ser asíncrona, permitiendo realizar llamadas a APIs o tareas que requieren espera.",
        "en": "In Pinia, any function inside actions can be asynchronous, allowing you to make API calls or tasks that require waiting."
      },
      "correctAnswerCodeExample": {
        "es": `export const useCounterStore = defineStore("counter", {\n  state: () => ({ count: 0 }),\n  actions: {\n    async fetchCount() {\n      const response = await fetch("/api/count");\n      this.count = await response.json();\n    }\n  }\n});`,
        "en": `export const useCounterStore = defineStore("counter", {\n  state: () => ({ count: 0 }),\n  actions: {\n    async fetchCount() {\n      const response = await fetch("/api/count");\n      this.count = await response.json();\n    }\n  }\n});`
      },
      "codeLanguage": "javascript",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "useAsync",
            "en": "useAsync"
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "actionAsync",
            "en": "actionAsync"
          },
          "isCorrect": false
        },
        {
          "id": 3,
          "answerText": {
            "es": "Cualquier función dentro de actions",
            "en": "Any function inside actions"
          },
          "isCorrect": true
        },
        {
          "id": 4,
          "answerText": {
            "es": "watch",
            "en": "watch"
          },
          "isCorrect": false
        }
      ]
    }
  ]
};

export default quiz;
