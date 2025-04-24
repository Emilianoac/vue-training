import type { Quiz } from "@/types/quiz";

const quiz: Quiz = {
  "id": "pinia-intermediate",
  "isPublic": true,
  "slug": "pinia-intermediate",
  "level": "intermediate",
  "category": {
    "id": "pinia",
    "name": "Pinia",
    "image": `${import.meta.env.BASE_URL}/images/quizzes/categories/pinia.png`
  },
  "title": {
    "es": "Persistencia y acciones asíncronas en Pinia",
    "en": "Persistence and asynchronous actions in Pinia"
  },
  "levelLabel": {
    "es": "Intermedio",
    "en": "Intermediate"
  },
  "description": {
    "es": "Este cuestionario aborda conceptos intermedios de Pinia, como la persistencia del estado, las acciones asíncronas y otros temas relacionados",
    "en": "This quiz covers intermediate concepts of Pinia, such as state persistence, asynchronous actions, and other related topics."
  },
  "questions": [
    {
      "id": 1,
      "questionText": {
        "es": "¿Cómo puedes llamar una acción de un store de Pinia dentro de un componente de Vue?",
        "en": "How can you call an action from a Pinia store inside a Vue component?"
      },
      "correctAnswerExplanation": {
        "es": "Las acciones en Pinia se llaman directamente desde la instancia del store como funciones normales.",
        "en": "Actions in Pinia are called directly from the store instance like regular functions."
      },
      "correctAnswerCodeExample": {
        "es": [
          {
            "code": `<script setup>\nimport { useCounterStore } from '@/stores/counter';\n\nconst counterStore = useCounterStore();\ncounterStore.increment();\n</script>`,
            "language": "javascript"
          }
        ],
        "en": [
          {
            "code": `<script setup>\nimport { useCounterStore } from '@/stores/counter';\n\nconst counterStore = useCounterStore();\ncounterStore.increment();\n</script>`,
            "language": "javascript"
          }
        ]
      },
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Usando `this.$store.commit('increment')` como en Vuex.",
            "en": "Using `this.$store.commit('increment')` like in Vuex."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Llamando la acción directamente desde la instancia del store.",
            "en": "Calling the action directly from the store instance."
          },
          "isCorrect": true
        },
        {
          "id": 3,
          "answerText": {
            "es": "Creando una nueva función dentro del componente que modifique el estado manualmente.",
            "en": "Creating a new function inside the component that manually modifies the state."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Pasando la acción como una prop desde el padre al hijo.",
            "en": "Passing the action as a prop from the parent to the child."
          },
          "isCorrect": false
        }
      ]
    }, 
    {
      "id": 2,
      "questionText": {
        "es": "¿Cuál es la forma recomendada de reaccionar a cambios en una propiedad del estado de Pinia desde un componente de Vue?",
        "en": "What is the recommended way to react to changes in a Pinia state property from a Vue component?"
      },
      "correctAnswerExplanation": {
        "es": "La mejor opción es `store.$subscribe`, ya que detecta cambios en el estado globalmente y funciona incluso si la mutación ocurre fuera del componente.",
        "en": "The best option is `store.$subscribe`, as it detects changes in the state globally and works even if the mutation occurs outside the component."
      },
      "correctAnswerCodeExample": {
        "es": [
          {
            "code": `<script setup>\nimport { useCounterStore } from '@/stores/counter';\n\nconst counterStore = useCounterStore();\n\ncounterStore.$subscribe((mutation, state) => {\n  console.log('El estado cambió:', state);\n});\n</script>`,
            "language": "handlebars"
          }
        ],
        "en": [
          {
            "code": `<script setup>\nimport { useCounterStore } from '@/stores/counter';\n\nconst counterStore = useCounterStore();\n\ncounterStore.$subscribe((mutation, state) => {\n  console.log('State changed:', state);\n});\n</script>`,
            "language": "handlebars"
          }
        ]
      },
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Usando `store.$subscribe` para detectar cambios en el estado.",
            "en": "Using `store.$subscribe` to detect state changes."
          },
          "isCorrect": true
        },
        {
          "id": 2,
          "answerText": {
            "es": "Usando `watch` para observar la propiedad del estado.",
            "en": "Using `watch` to observe the state property."
          },
          "isCorrect": false
        },
        {
          "id": 3,
          "answerText": {
            "es": "Llamando manualmente una función después de cada actualización.",
            "en": "Manually calling a function after each update."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "No es posible escuchar cambios en el estado de Pinia.",
            "en": "It is not possible to watch for changes in Pinia state."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 3,
      "questionText": {
        "es": "¿Cómo puedes crear un store en Pinia que use acciones asíncronas?",
        "en": "How can you create a store in Pinia that uses asynchronous actions?"
      },
      "correctAnswerExplanation": {
        "es": "Las acciones en Pinia pueden ser asíncronas, y para ello se puede usar la palabra clave `async` dentro de la función que define la acción.",
        "en": "Actions in Pinia can be asynchronous, and to do this, you can use the `async` keyword inside the function defining the action."
      },
      "correctAnswerCodeExample": {
        "es": [
          {
            "code": `// (Setup Syntax)\nexport const useUserStore = defineStore('user', () => {\n  const user = ref(null);\n  const fetchUser = async () => {\n    const response = await fetch('/api/user');\n    user.value = await response.json();\n  }\n  return {\n    user,\n    fetchUser,\n  }\n})`,
            "language": "javascript"
          },
          {
            "code": `// (Options Syntax)\nexport const useUserStore = defineStore('user', {\n  state: () => ({ user: null }),\n  actions: {\n    async fetchUser() {\n      const response = await fetch('/api/user');\n      this.user = await response.json();\n    }\n  }\n})`,
            "language": "javascript"
          },
        ],
        "en": [
          {
            "code": `// (Setup Syntax)\nexport const useUserStore = defineStore('user', () => {\n  const user = ref(null);\n  const fetchUser = async () => {\n    const response = await fetch('/api/user');\n    user.value = await response.json();\n  }\n  return {\n    user,\n    fetchUser,\n  }\n})`,
            "language": "javascript"
          },
          {
            "code": `// (Options Syntax)\nexport const useUserStore = defineStore('user', {\n  state: () => ({ user: null }),\n  actions: {\n    async fetchUser() {\n      const response = await fetch('/api/user');\n      this.user = await response.json();\n    }\n  }\n})`,
            "language": "javascript"
          },
        ]
      },
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Usando un `setTimeout` para simular una espera.",
            "en": "Using a `setTimeout` to simulate a wait."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Marcando la función como `async` y usando `await` para manejar promesas.",
            "en": "Marking the function as `async` and using `await` to handle promises."
          },
          "isCorrect": true
        },
        {
          "id": 3,
          "answerText": {
            "es": "Haciendo la llamada a la API directamente en el componente.",
            "en": "Making the API call directly in the component."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Usando `setState` para realizar la actualización en una sola acción.",
            "en": "Using `setState` to perform the update in one action."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 4,
      "questionText": {
        "es": "¿Cuál es la forma correcta de modificar el estado de un store de Pinia dentro de otro store?",
        "en": "What is the correct way to modify the state of a Pinia store from another store?"
      },
      "correctAnswerExplanation": {
        "es": "Para modificar el estado de un store desde otro, es recomendable usar las acciones definidas en el store objetivo. No se debe modificar el estado directamente fuera del contexto de reactividad de Vue.",
        "en": "To modify the state of a store from another, it is recommended to use the actions defined in the target store. The state should not be modified directly outside the Vue reactivity context."
      },
      "correctAnswerCodeExample": {
        "es": [
          {
            "code": "// logger.js\nimport { useUserStore } from './user';\n\nexport const useLoggerStore = defineStore('logger', {\n  actions: {\n    logUserName() {\n      const userStore = useUserStore();\n      userStore.setName('Bob');  // Forma correcta\n    }\n  }\n});",
            "language": "javascript"
          }
        ],
        "en": [
          {
            "code": "// logger.js\nimport { useUserStore } from './user';\n\nexport const useLoggerStore = defineStore('logger', {\n  actions: {\n    logUserName() {\n      const userStore = useUserStore();\n      userStore.setName('Bob');  // Correct way\n    }\n  }\n});",
            "language": "javascript"
          }
        ]
      },
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Modificando el estado directamente sin usar acciones.",
            "en": "Modifying the state directly without using actions."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Usando las acciones del store objetivo para modificar el estado.",
            "en": "Using the actions from the target store to modify the state."
          },
          "isCorrect": true
        },
        {
          "id": 3,
          "answerText": {
            "es": "Accediendo al estado del store a través de la instancia global de Vue.",
            "en": "Accessing the store state via the global Vue instance."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Usando `this` directamente en el store importado.",
            "en": "Using `this` directly in the imported store."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 5,
      "questionText": {
        "es": "¿Cómo puedes utilizar módulos dentro de un store de Pinia?",
        "en": "How can you use modules within a Pinia store?"
      },
      "correctAnswerExplanation": {
        "es": "En Pinia, puedes organizar tu store en módulos utilizando `defineStore` en diferentes archivos y luego importarlos para gestionar distintas partes del estado de la aplicación. Esto permite una estructura más modular y reutilizable.",
        "en": "In Pinia, you can organize your store into modules by using `defineStore` in different files and importing them to manage different parts of the application state. This allows for a more modular and reusable structure."
      },
      "correctAnswerCodeExample": {
        "es": [
          {
            "code": `// stores/user.js\nimport { defineStore } from 'pinia';\n\nexport const useUserStore = defineStore('user', {\n  state: () => ({ user: null }),\n  actions: {\n    setUser(user) {\n      this.user = user;\n    }\n  }\n})`,
            "language": "javascript"
          },
          {
            "code": `// stores/products.js\nimport { defineStore } from 'pinia';\n\nexport const useProductsStore = defineStore('products', {\n  state: () => ({ products: [] }),\n  actions: {\n    setProducts(products) {\n      this.products = products;\n    }\n  }\n})`,
            "language": "javascript"
          },
          {
            "code": `// main.js\nimport { createPinia } from 'pinia';\nimport { useUserStore } from './stores/user';\nimport { useProductsStore } from './stores/products';\n\nconst pinia = createPinia();\nconst userStore = useUserStore();\nconst productsStore = useProductsStore();\n`,
            "language": "javascript"
          }
        ],
        "en": [
          {
            "code": `// stores/user.js\nimport { defineStore } from 'pinia';\n\nexport const useUserStore = defineStore('user', {\n  state: () => ({ user: null }),\n  actions: {\n    setUser(user) {\n      this.user = user;\n    }\n  }\n})`,
            "language": "javascript"
          },
          {
            "code": `// stores/products.js\nimport { defineStore } from 'pinia';\n\nexport const useProductsStore = defineStore('products', {\n  state: () => ({ products: [] }),\n  actions: {\n    setProducts(products) {\n      this.products = products;\n    }\n  }\n})`,
            "language": "javascript"
          },
          {
            "code": `// main.js\nimport { createPinia } from 'pinia';\nimport { useUserStore } from './stores/user';\nimport { useProductsStore } from './stores/products';\n\nconst pinia = createPinia();\nconst userStore = useUserStore();\nconst productsStore = useProductsStore();\n`,
            "language": "javascript"
          }
        ]
      },
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Usando el sistema de módulos en Vuex.",
            "en": "Using the Vuex module system."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Definiendo stores independientes y luego combinándolos en el archivo principal.",
            "en": "Defining independent stores and then combining them in the main file."
          },
          "isCorrect": true
        },
        {
          "id": 3,
          "answerText": {
            "es": "Utilizando un único store para toda la aplicación.",
            "en": "Using a single store for the entire application."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Modificando directamente el estado de otros stores.",
            "en": "Directly modifying the state of other stores."
          },
          "isCorrect": false
        }
      ]
    },   
    {
      "id": 6,
      "questionText": {
        "es": "¿Qué opción es más eficiente para persistir el estado de un store de Pinia entre recargas de página?",
        "en": "What is the most efficient option to persist the state of a Pinia store between page reloads?"
      },
      "correctAnswerExplanation": {
        "es": "La forma más eficiente de persistir el estado de un store de Pinia es utilizando plugins como `pinia-plugin-persistedstate` o `pinia-plugin-persist`. Estos plugins almacenan automáticamente el estado en `localStorage` o `sessionStorage`.",
        "en": "The most efficient way to persist the state of a Pinia store is by using plugins like `pinia-plugin-persistedstate` or `pinia-plugin-persist`. These plugins automatically store the state in `localStorage` or `sessionStorage`."
      },
      "correctAnswerCodeExample": {
        "es": [
          {
            "code": `import { createPinia } from 'pinia';\nimport piniaPersistedstate from 'pinia-plugin-persistedstate';\n\nconst pinia = createPinia();\npinia.use(piniaPersistedstate);`,
            "language": "javascript"
          }
        ],
        "en": [
          {
            "code": `import { createPinia } from 'pinia';\nimport piniaPersistedstate from 'pinia-plugin-persistedstate';\n\nconst pinia = createPinia();\npinia.use(piniaPersistedstate);`,
            "language": "javascript"
          }
        ]
      },
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Usando `localStorage` manualmente para guardar el estado.",
            "en": "Using `localStorage` manually to save the state."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Utilizando un plugin como `pinia-plugin-persistedstate`.",
            "en": "Using a plugin like `pinia-plugin-persistedstate`."
          },
          "isCorrect": true
        },
        {
          "id": 3,
          "answerText": {
            "es": "No es posible persistir el estado de un store de Pinia.",
            "en": "It is not possible to persist the state of a Pinia store."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Guardando el estado en una base de datos externa.",
            "en": "Saving the state in an external database."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 7,
      "questionText": {
        "es": "¿Cómo puedes utilizar un store de Pinia dentro de una función o archivo que no es un componente de Vue?",
        "en": "How can you use a Pinia store inside a function or file that is not a Vue component?"
      },
      "correctAnswerExplanation": {
        "es": "Para usar un store de Pinia fuera de un componente, debes asegurar que la instancia de Pinia esté creada y disponible. Puedes importar el store directamente y usarlo como lo harías en un componente.",
        "en": "To use a Pinia store outside of a component, you need to ensure that the Pinia instance is created and available. You can import the store directly and use it as you would in a component."
      },
      "correctAnswerCodeExample": {
        "es": [
          {
            "code": `// src/main.ts\n\nimport { useUserStore } from "@/stores/user";\nimport { createPinia } from "pinia";\nimport { createApp } from "vue";\nimport App from "./App.vue";\n\n\n// Aquí falla ya que Pinia no está instalado aún\nconst userStore = useUserStore();\n\nconst pinia = createPinia();\nconst app = createApp(App);\n\n// Añades Pinia a la app\napp.use(pinia);\n\n// Aquí ya funciona correctamente porque Pinia está instalado\nconst userStore = useUserStore();`,
            "language": "javascript"
          }
        ],
        "en": [
          {
            "code": `// src/main.ts\n\nimport { useUserStore } from "@/stores/user";\nimport { createPinia } from "pinia";\nimport { createApp } from "vue";\nimport App from "./App.vue";\n\n\n// Here it fails because Pinia is not installed yet\nconst userStore = useUserStore();\n\nconst pinia = createPinia();\nconst app = createApp(App);\n\n// You add Pinia to the app\napp.use(pinia);\n\n// Here it works correctly because Pinia is installed\nconst userStore = useUserStore();`,
            "language": "javascript"
          }
        ]
      },
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Asegurándote de que la instancia de Pinia esté creada y disponible e importando el store directamente.",
            "en": "Importing the store and using it directly."
          },
          "isCorrect": true
        },
        {
          "id": 2,
          "answerText": {
            "es": "No es posible usar un store de Pinia fuera de un componente.",
            "en": "It is not possible to use a Pinia store outside of a component."
          },
          "isCorrect": false
        },
        {
          "id": 3,
          "answerText": {
            "es": "Usando `this.$store` como en Vuex.",
            "en": "Using `this.$store` like in Vuex."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Creando una nueva instancia de Pinia cada vez que la necesites.",
            "en": "Creating a new instance of Pinia every time you need it."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 8,
      "questionText": {
        "es": "Usando la Setup Syntax, ¿cómo puedes utilizar un composable dentro de un store de Pinia?",
        "en": "Using the Setup Syntax, how can you use a composable inside a Pinia store?"
      },
      "correctAnswerExplanation": {
        "es": "Puedes importar el composable directamente dentro de la función del store y usarlo como lo harías en un componente.",
        "en": "You can import the composable directly inside the store function and use it as you would in a component."
      },
      "correctAnswerCodeExample": {
        "es": [
          {
            "code": `// composables/useCounter.ts\n\nimport { ref } from "vue";\n\nexport function useCounter() {\n  const count = ref(0);\n  const increment = () => count.value++;\n  return { count, increment };\n}`,
            "language": "javascript"
          },
          {
            "code": `// stores/counter.ts\n\nimport { defineStore } from "pinia";\nimport { useCounter } from "@/composables/useCounter";\n\nexport const useCounterStore = defineStore("counter", () => {\n  const { count, increment } = useCounter();\n  return { count, increment };\n});`,
            "language": "javascript"
          }
        ],
        "en": [
          {
            "code": `// composables/useCounter.ts\n\nimport { ref } from "vue";\n\nexport function useCounter() {\n  const count = ref(0);\n  const increment = () => count.value++;\n  return { count, increment };\n}`,
            "language": "javascript"
          },
          {
            "code": `// stores/counter.ts\n\nimport { defineStore } from "pinia";\nimport { useCounter } from "@/composables/useCounter";\n\nexport const useCounterStore = defineStore("counter", () => {\n  const { count, increment } = useCounter();\n  return { count, increment };\n});`,
            "language": "javascript"
          }
        ]
      },
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Importando el composable directamente dentro de la función del store.",
            "en": "Importing the composable directly inside the store function."
          },
          "isCorrect": true
        },
        {
          "id": 2,
          "answerText": {
            "es": "No es posible usar un composable dentro de un store.",
            "en": "It is not possible to use a composable inside a store."
          },
          "isCorrect": false
        },
        {
          "id": 3,
          "answerText": {
            "es": "Usando `this.$composable` como en Vuex.",
            "en": "Using `this.$composable` like in Vuex."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Creando una nueva instancia del composable cada vez que lo necesites.",
            "en": "Creating a new instance of the composable every time you need it."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 9,
      "questionText": {
        "es": "¿Para qué se utiliza un plugin en Pinia y cómo se puede registrar uno?",
        "en": "What is a plugin used for in Pinia and how can you register one?"
      },
      "correctAnswerExplanation": {
        "es": "Los plugins en Pinia se utilizan para extender la funcionalidad del store, como la persistencia del estado o la integración con otras bibliotecas. Se registran usando el método `use` de la instancia de Pinia.",
        "en": "Plugins in Pinia are used to extend the functionality of the store, such as state persistence or integration with other libraries. They are registered using the `use` method of the Pinia instance."
      },
      "correctAnswerCodeExample": {
        "es": [
          {
            "code": `import { createPinia } from "pinia";\nimport piniaPluginPersistedstate from "pinia-plugin-persistedstate";\n\nconst pinia = createPinia();\npinia.use(piniaPluginPersistedstate);`,
            "language": "javascript"
          }
        ],
        "en": [
          {
            "code": `import { createPinia } from "pinia";\nimport piniaPluginPersistedstate from "pinia-plugin-persistedstate";\n\nconst pinia = createPinia();\npinia.use(piniaPluginPersistedstate);`,
            "language": "javascript"
          }
        ]
      },
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Para extender la funcionalidad del store y se registra usando el método `use` de la instancia de Pinia.",
            "en": "To extend the functionality of the store and is registered using the `use` method of the Pinia instance."
          },
          "isCorrect": true
        },
        {
          "id": 2,
          "answerText": {
            "es": "Para crear nuevos stores y se registra usando `createStore`.",
            "en": "To create new stores and is registered using `createStore`."
          },
          "isCorrect": false
        },
        {
          "id": 3,
          "answerText": {
            "es": "Para manejar el ciclo de vida de los componentes y se registra en el componente mismo.",
            "en": "To manage the lifecycle of components and is registered in the component itself."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Para definir acciones y mutaciones y se registra dentro del store.",
            "en": "To define actions and mutations and is registered inside the store."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 10,
      "questionText": {
        "es": "Usando la Setup Syntax, ¿cómo puedes resetear el estado de un store de Pinia?",
        "en": "Using the Setup Syntax, how can you reset the state of a Pinia store?"
      },  
      "correctAnswerExplanation": {
        "es": "Usando la Setup Syntax, debes crear una tu propio metodo $reset que restablezca el estado a su valor inicial. Pinia no proporciona un método de reinicio por defecto.",
        "en": "Using the Setup Syntax, you need to create your own $reset method that resets the state to its initial value. Pinia does not provide a default reset method."
      },
      "correctAnswerCodeExample": {
        "es": [
          {
            "code": `// stores/counter.ts\n\nimport { defineStore } from "pinia";\n\nexport const useCounterStore = defineStore("counter", () => {\n  const count = ref(0);\n  const increment = () => count.value++;\n  const $reset = () => { count.value = 0; };\n  return { count, increment, $reset };\n});`,
            "language": "javascript"
          }
        ],
        "en": [
          {
            "code": `// stores/counter.ts\n\nimport { defineStore } from "pinia";\n\nexport const useCounterStore = defineStore("counter", () => {\n  const count = ref(0);\n  const increment = () => count.value++;\n  const $reset = () => { count.value = 0; };\n  return { count, increment, $reset };\n});`,
            "language": "javascript"
          }
        ]
      },
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Usando el método `$reset` que Pinia proporciona por defecto.",
            "en": "Using the `$reset` method that Pinia provides by default."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Definiendo tu propio método `$reset` dentro del store.",
            "en": "Defining your own `$reset` method inside the store."
          },
          "isCorrect": true
        },
        {
          "id": 3,
          "answerText": {
            "es": "No es posible resetear el estado de un store de Pinia.",
            "en": "It is not possible to reset the state of a Pinia store."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Usando `this.$reset()` como en Vuex.",
            "en": "`this.$reset()` like in Vuex."
          },
          "isCorrect": false
        }
      ]
    }
  ]
};


export default quiz;