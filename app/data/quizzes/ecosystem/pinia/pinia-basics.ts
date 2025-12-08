import type { Quiz } from "@/types/quiz";

const quiz: Quiz = {
  "id": "pinia-basics",
  "isPublic": true,
  "slug": "pinia-basics",
  "level": "basic",
  "category": {
    "id": "pinia",
    "name": "Pinia",
    "image": `/images/quizzes/categories/pinia.png`
  },
  "title": {
    "es": "Introducción a Pinia",
    "en": "Introduction to Pinia"
  },
  "levelLabel": {
    "es": "Básico",
    "en": "Basic"
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
        "es": [],
        "en": []
      },
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
        "es": "La función `defineStore()` se utiliza para crear un nuevo store en Pinia, que se puede importar y utilizar en diferentes componentes de la aplicación.",
        "en": "The `defineStore()` function is used to create a new store in Pinia, which can be imported and used in different components of the application."
      },
      "correctAnswerCodeExample": {
        "es": [
          {
            "code": `import { defineStore } from "pinia";\n\nexport const useCounterStore = defineStore("counter", {\n  state: () => ({ count: 0 })\n});`,
            "language": "javascript"
          }
        ],
        "en": [
          {
            "code": `import { defineStore } from "pinia";\n\nexport const useCounterStore = defineStore("counter", {\n  state: () => ({ count: 0 })\n});`,
            "language": "javascript"
          }
        ]
      },
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "`defineStore()`",
            "en": "`defineStore()`"
          },
          "isCorrect": true
        },
        {
          "id": 2,
          "answerText": {
            "es": "`createStore()`",
            "en": "`createStore()`"
          },
          "isCorrect": false
        },
        {
          "id": 3,
          "answerText": {
            "es": "`define()`",
            "en": "`define()`"
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "`setStore()`",
            "en": "`setStore()`"
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 3,
      "questionText": {
        "es": "¿Cuales son las dos sintaxis que ofrece Pinia para definir un store?", 
        "en": "What are the two syntaxes that Pinia offers to define a store?"
      },
      "correctAnswerExplanation": {
        "es": "Pinia ofrece dos sintaxis para definir un store: la options syntax y la setup syntax. La primera es similar a Vuex, mientras que la segunda aprovecha las características de Composition API de Vue 3.",
        "en": "Pinia offers two syntaxes to define a store: the options syntax and the setup syntax. The first is similar to Vuex, while the second takes advantage of Vue 3's Composition API features."
      },
      "correctAnswerCodeExample": {
        "es": [
          {
            "code": `// Options Syntax\n\nimport { defineStore } from "pinia";\n\nexport const useCounterStore = defineStore("counter", {\n  state: () => ({ count: 0 }),\n  actions: {\n    increment() {\n      this.count++;\n    }\n  }\n});\n`,
            "language": "javascript"
          },
          {
            "code": `// Setup Syntax\n\nimport { defineStore } from "pinia";\nimport { ref } from "vue";\n\nexport const useCounterStore = defineStore("counter", () => {\n  const count = ref(0);\n  const increment = () => count.value++;\n  return { count, increment };\n});\n`,
            "language": "javascript"
          }
        ],
        "en": [
          {
            "code": `// Options Syntax\n\nimport { defineStore } from "pinia";\n\nexport const useCounterStore = defineStore("counter", {\n  state: () => ({ count: 0 }),\n  actions: {\n    increment() {\n      this.count++;\n    }\n  }\n});\n`,
            "language": "javascript"
          },
          {
            "code": `// Setup Syntax\n\nimport { defineStore } from "pinia";\nimport { ref } from "vue";\n\nexport const useCounterStore = defineStore("counter", () => {\n  const count = ref(0);\n  const increment = () => count.value++;\n  return { count, increment };\n});\n`,
            "language": "javascript"
          }
        ]
      },
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "options syntax y setup syntax.",
            "en": "options syntax and setup syntax."
          },
          "isCorrect": true
        },
        {
          "id": 2,
          "answerText": {
            "es": "class syntax y functional syntax.",
            "en": "class syntax and functional syntax."
          },
          "isCorrect": false
        },
        {
          "id": 3,
          "answerText": {
            "es": "reactive syntax y ref syntax.",
            "en": "reactive syntax and ref syntax."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "setup syntax y class syntax.",
            "en": "setup syntax and class syntax."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 4,
      "questionText": {
        "es": "Usando la options syntax, ¿qué permite la opción `state` dentro de un store en Pinia?",
        "en": "Using the options syntax, what does the `state` option allow within a store in Pinia?"
      },
      "correctAnswerExplanation": {
        "es": "Usando la options syntax, la opción `state` define el estado inicial del store, que puede ser modificado o accedido por los componentes que lo utilizan.",
        "en": "Using the options syntax, the `state` option defines the initial state of the store, which can be modified or accessed by the components that use it."
      },
      "correctAnswerCodeExample": {
        "es": [
          {
            "code": `import { defineStore } from "pinia";\n\nexport const useCounterStore = defineStore("counter", {\n  state: () => ({ \n    count: 0,\n  })\n});`,
            "language": "javascript"
          }
        ],
        "en": [
          {
            "code": `import { defineStore } from "pinia";\n\nexport const useCounterStore = defineStore("counter", {\n  state: () => ({ \n    count: 0,\n  })\n});`,
            "language": "javascript"
          }
        ]
      },
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
      "id": 5,
      "questionText": {
        "es": "Usando la options syntax, ¿cómo se define una acción en un store de Pinia?",
        "en": "Using the options syntax, how do you define an action in a Pinia store?"
      },
      "correctAnswerExplanation": {
        "es": "Usando la options syntax, las acciones en Pinia se definen dentro de la opción actions, permitiendo ejecutar métodos que modifican el estado del store.",
        "en": "Using the options syntax, actions in Pinia are defined within the actions option, allowing you to execute methods that modify the store's state."
      },
      "correctAnswerCodeExample": {
        "es": [
          {
            "code": `import { defineStore } from "pinia";\n\nexport const useCounterStore = defineStore("counter", {\n  state: () => ({ \n    count: 0 \n  }),\n  actions: {\n    increment() {\n      this.count++;\n    }\n  }\n});`,
            "language": "javascript"
          }
        ],
        "en": [
          {
            "code": `import { defineStore } from "pinia";\n\nexport const useCounterStore = defineStore("counter", {\n  state: () => ({ \n    count: 0 \n  }),\n  actions: {\n    increment() {\n      this.count++;\n    }\n  }\n});`,
          "language": "javascript"
          }
        ]
      },
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Dentro de la propiedad `setupActions`.",
            "en": "Inside the 'setupActions' property."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Usando `computed()`.",
            "en": "Using `computed()`."
          },
          "isCorrect": false
        },
        {
          "id": 3,
          "answerText": {
            "es": "Dentro de la propiedad `option`.",
            "en": "Inside the 'option' property."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Dentro de la propiedad `actions`.",
            "en": "Inside the 'actions' property."
          },
          "isCorrect": true
        }
      ]
      
    },
    {
      "id": 6,
      "questionText": {
        "es": "Usando la setup syntax, ¿como se definen las acciones en un store de Pinia?",
        "en": "Using the setup syntax, how are actions defined in a Pinia store?"
      },
      "correctAnswerExplanation": {
        "es": "En Pinia, usando la setup syntax, las acciones se definen como funciones dentro del store que modifican el estado del store. Estas funciones pueden ser utilizadas en los componentes para cambiar el estado del store.",
        "en": "In Pinia, using the setup syntax, actions are defined as functions inside the store that modify the store's state. These functions can be used in components to change the store"
      },
      "correctAnswerCodeExample": {
        "es": [
          {
            "code": `import { defineStore } from "pinia";\nimport { ref } from "vue";\n\nexport const useCounterStore = defineStore("counter", () => {\n  const count = ref(0);\n\n  function increment() {\n    count.value ++\n  }\n});`,
            "language": "javascript"
          },
        ],
        "en": [
          {
            "code": `import { defineStore } from "pinia";\nimport { ref } from "vue";\n\nexport const useCounterStore = defineStore("counter", () => {\n  const count = ref(0);\n\n  function increment() {\n    count.value ++\n  }\n});`,
            "language": "javascript"
          },
        ]
      },
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Dentro de la propiedad `actions` del store.",
            "en": "Using the 'actions' property inside the store."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Creando funciones dentro del store.",
            "en": "Creating functions inside the store."
          },
          "isCorrect": true
        },
        {
          "id": 3,
          "answerText": {
            "es": "Usando `computed()` dentro del store.",
            "en": "Using `computed()` inside the store."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Dentro de la propiedad `methods` del store.",
            "en": "Inside the 'methods' property of the store."
          },
          "isCorrect": false
        }
      ]
    }, 
    {
      "id": 7,
      "questionText": {
        "es": "Usando la setup syntax, ¿cómo puedes resetear un estado?",
        "en": "Using the setup syntax, how can you reset a state?"
      },
      "correctAnswerExplanation": {
        "es": "Para resetear un estado con la setup syntax necesitas definir tu propio método `$reset()` dentro del store, que restablezca el estado a su configuración inicial.",
        "en": "To reset a state with the setup syntax, you need to define your own `$reset()` method inside the store that resets the state to its initial configuration."
      },
      "correctAnswerCodeExample": {
        "es": [
          {
            "code": `export const useCounterStore = defineStore('counter', () => {\n  const count = ref(0)\n\n  function $reset() {\n    count.value = 0\n  }\n\n  return { count, $reset }\n})`,
            "language": "javascript"
          }
        ],
        "en": [
          {
            "code": `export const useCounterStore = defineStore('counter', () => {\n  const count = ref(0)\n\n  function $reset() {\n    count.value = 0\n  }\n\n  return { count, $reset }\n})`,
          "language": "javascript"
          }
        ]
      },
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Usando el método `$reset()` del store.",
            "en": "Using the `$reset()` method of the store."
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
            "es": "Utilizando `defineStore()` nuevamente.",
            "en": "Using `defineStore()` again."
          },
          "isCorrect": false
        }
      ]
    }, 
    {
      "id": 8,
      "questionText": {
        "es": "¿Cuál es la ventaja de usar la setup syntax en pinia?",
        "en": "What is the advantage of using the setup syntax in pinia?"
      },
      "correctAnswerExplanation": {
        "es": "Con la setup syntax, puedes acceder al estado y acciones del store sin necesidad de usar `this`, lo que simplifica el código y mejora la legibilidad.",
        "en": "With the setup syntax, you can access the store's state and actions without needing to use `this`, which simplifies the code and improves readability."
      },
      "correctAnswerCodeExample": {
        "es": [
          {
            "code": `import { defineStore } from "pinia";\nimport { ref, computed } from "vue";\n\nexport const useCounterStore = defineStore("counter", () => {\n  const count = ref(0);\n  const increment = () => count.value++;\n  const decrement = () => count.value--;\n  const doubleCount = computed(() => count.value * 2);\n  \n  return { count, increment, decrement, doubleCount };\n});`,
            "language": "javascript"
          }
        ],
        "en": [
          {
            "code": `import { defineStore } from "pinia";\nimport { ref, computed } from "vue";\n\nexport const useCounterStore = defineStore("counter", () => {\n  const count = ref(0);\n  const increment = () => count.value++;\n  const decrement = () => count.value--;\n  const doubleCount = computed(() => count.value * 2);\n  \n  return { count, increment, decrement, doubleCount };\n});`,
            "language": "javascript"
          }
        ]
      },
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
            "es": "Simplifica el acceso al estado sin `this`.",
            "en": "Simplifies state access without `this`."
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
      "id": 9,
      "questionText": {
        "es": "Usando la options syntax, ¿cuál es el propósito de un getter en Pinia?",
        "en": "Using the options syntax, what is the purpose of a getter in Pinia?"
      },
      "correctAnswerExplanation": {
        "es": "Los getters en Pinia son propiedades derivadas del estado que se recalculan automáticamente cuando sus dependencias cambian. Permiten acceder a valores computados basados en el estado del store.",
        "en": "Getters in Pinia are derived properties of the state that are automatically recalculated when their dependencies change. They allow access to computed values based on the store's state."
      },
      "correctAnswerCodeExample": {
        "es": [
          {
            "code": `// Options Syntax\nimport { defineStore } from "pinia";\n\nexport const useCounterStore = defineStore("counter", {\n  state: () => ({ \n    count: 0 \n  }),\n  getters: {\n    doubleCount: (state) => state.count * 2\n  }\n});`,
            "language": "javascript"
          },
          {
            "code": `// Setup Syntax\nimport { defineStore } from "pinia";\nimport { computed, ref } from "vue";\n\nexport const useCounterStore = defineStore("counter", () => {\n  const count = ref(0);\n\n  const doubleCount = computed(() => count.value * 2)\n});`,
            "language": "javascript"
          }
        ],
        "en": [
          {
            "code": `// Options Syntax\nimport { defineStore } from "pinia";\n\nexport const useCounterStore = defineStore("counter", {\n  state: () => ({ \n    count: 0 \n  }),\n  getters: {\n    doubleCount: (state) => state.count * 2\n  }\n});`,
            "language": "javascript"
          },
          {
            "code": `// Setup Syntax\nimport { defineStore } from "pinia";\nimport { computed, ref } from "vue";\n\nexport const useCounterStore = defineStore("counter", () => {\n  const count = ref(0);\n\n  const doubleCount = computed(() => count.value * 2)\n});`,
            "language": "javascript"
          }
        ]
      },
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Definir rutas.",
            "en": "Defining routes."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Calcular un valor computado que depende del estado.",
            "en": "Calculating a computed value that depends on the state."
          },
          "isCorrect": true
        },
        {
          "id": 3,
          "answerText": {
            "es": "Inicializar el estado.",
            "en": "Initializing the state."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Actualizar datos de forma asíncrona.",
            "en": "Updating data asynchronously."
          },
          "isCorrect": false
        }
      ]
    },  
    {
      "id": 10,
      "questionText": {
        "es": "¿Cómo se accede al store desde un componente?",
        "en": "How do you access the store from a component?"
      },
      "correctAnswerExplanation": {
        "es": "Para acceder al store, se importa la función que define el store y luego se llama a esa función dentro del componente.",
        "en": "To access the store, you import the function that defines the store and then call that function inside the component."
      },
      "correctAnswerCodeExample": {
        "es": [
          {
            "code": `<script setup>\n  import { useCounterStore } from "@/stores/counter";\n\n  const counterStore = useCounterStore();\n</script>\n`,
            "language": "handlebars",
          }
        ],
        "en": [
          {
            "code": `<script setup>\n  import { useCounterStore } from "@/stores/counter";\n\n  const counterStore = useCounterStore();\n</script>\n`,
            "language": "handlebars"
          }
        ]
      },
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Usando `this.store`.",
            "en": "Using `this.store`."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Creando una instancia del store con `new`.",
            "en": "Creating an instance of the store with `new`."
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
            "es": "Mediante la opción `computed`.",
            "en": "Using the `computed` option."
          },
          "isCorrect": false
        }
      ]
    },   
  ]
};

export default quiz;
