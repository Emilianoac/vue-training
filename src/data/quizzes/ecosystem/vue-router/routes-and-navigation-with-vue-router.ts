import type { Quiz } from "@/types/quiz";

const quiz: Quiz = {
  "id": "routes-and-navigation-with-vue-router",
  "isPublic": true,
  "slug": "routes-and-navigation-with-vue-router",
  "level": "medium",
  "category": {
    "id": "vue-router",
    "name": "Vue Router",
    "image": "public/images/quizzes/categories/vue.png"
  },
  "title": {
    "es": "Rutas y navegación con Vue Router",
    "en": "Routes and navigation with Vue Router",
  },
  "levelLabel": {
    "es": "Medio",
    "en": "Medium",
  },
  "description": {
    "es": "Este quiz se centra en la configuración y el uso de Vue Router, incluyendo la definición de rutas, navegación y anidación de rutas en aplicaciones Vue.",
    "en": "This quiz focuses on the configuration and usage of Vue Router, including defining routes, navigation, and nesting routes in Vue applications.",
  },
  "questions": [
    {
      "id": 1,
      "questionText": {
        "es": "¿Cuál de las siguientes opciones permite configurar Vue Router para usar el modo de historial HTML5?",
        "en": "Which of the following options allows you to configure Vue Router to use the HTML5 history mode?"
      },
      "correctAnswerExplanation": {
        "es": "La función createWebHistory permite configurar Vue Router para utilizar el historial HTML5, lo que elimina el hash # en la URL y permite rutas limpias.",
        "en": "The createWebHistory function allows you to configure Vue Router to use the HTML5 history mode, which removes the hash # in the URL and allows for clean routes."
      },
      "correctAnswerCodeExample": {
        "es": `import { createRouter, createWebHistory } from "vue-router";\n\nimport Home from "./views/Home.vue";\nimport About from "./views/About.vue";\n\nconst routes = [\n  { path: "/", component: Home },\n  { path: "/about", component: About }\n];\n\n// Crear el router con historial HTML5\nconst router = createRouter({\n  history: createWebHistory(),\n  routes\n});\n\nexport default router;`,
        "en": `import { createRouter, createWebHistory } from "vue-router";\n\nimport Home from "./views/Home.vue";\nimport About from "./views/About.vue";\n\nconst routes = [\n  { path: "/", component: Home },\n  { path: "/about", component: About }\n];\n\n// Create the router with HTML5 history\nconst router = createRouter({\n  history: createWebHistory(),\n  routes\n});\n\nexport default router;`
      },
      "codeLanguage": "javascript",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "createWebHashHistory",
            "en": "createWebHashHistory"
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "createWebHistory",
            "en": "createWebHistory"
          },
          "isCorrect": true
        },
        {
          "id": 3,
          "answerText": {
            "es": "useHistoryMode",
            "en": "useHistoryMode"
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "historyMode: 'html5'",
            "en": "historyMode: 'html5'"
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 2,
      "questionText": {
        "es": "¿Cómo se navega programáticamente a una ruta en Vue Router?",
        "en": "How do you programmatically navigate to a route in Vue Router?"
      },
      "correctAnswerExplanation": {
        "es": "Para navegar programáticamente, se utiliza router.push(), que permite cambiar la ruta actual a la que se pasa como argumento.",
        "en": "To navigate programmatically, you use router.push(), which allows you to change the current route to the one passed as an argument."
      },
      "correctAnswerCodeExample": {
        "es": `<script setup>\nimport { useRouter } from "vue-router";\n\nconst router = useRouter();\n function gotToAbout() {\n router.push("/about");\n}\n</script>\n\n<template>\n  <div>\n    <h1>Bienvenido a la página principal</h1>\n    <button @click="gotToAbout">Ir a About</button>\n  </div>\n</template>`,
        "en": `<script setup>\nimport { useRouter } from "vue-router";\n\nconst router = useRouter();\n function gotToAbout() {\n router.push("/about");\n}\n</script>\n\n<template>\n  <div>\n    <h1>Welcome to the main page</h1>\n    <button @click="gotToAbout">Go to About</button>\n  </div>\n</template>`
      },
      "codeLanguage": "handlebars",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Usando router.push().",
            "en": "Using router.push()."
          },
          "isCorrect": true
        },
        {
          "id": 2,
          "answerText": {
            "es": "Llamando a navigate().",
            "en": "Calling navigate()."
          },
          "isCorrect": false
        },
        {
          "id": 3,
          "answerText": {
            "es": "Usando this.navigate().",
            "en": "Using this.navigate()."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Modificando window.location.",
            "en": "Modifying window.location."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 3,
      "questionText": {
        "es": "¿Qué opción permite definir rutas anidadas en Vue Router?",
        "en": "Which option allows you to define nested routes in Vue Router?"
      },
      "correctAnswerExplanation": {
        "es": "La opción 'children' permite definir rutas anidadas, donde una ruta padre puede tener varias rutas hijas, facilitando la creación de estructuras de navegación complejas.",
        "en": "The 'children' option allows you to define nested routes, where a parent route can have multiple child routes, making it easier to create complex navigation structures."
      },
      "correctAnswerCodeExample": {
        "es": `const routes = [\n  {\n    path: "/dashboard",\n    component: Dashboard,\n    children: [\n      { path: "profile" component: UserProfile }\n    ]\n  }\n];`,
        "en": `const routes = [\n  {\n    path: "/dashboard",\n    component: Dashboard,\n    children: [\n      { path: "profile" component: UserProfile }\n    ]\n  }\n];`
      },
      "codeLanguage": "javascript",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "children",
            "en": "children"
          },
          "isCorrect": true
        },
        {
          "id": 2,
          "answerText": {
            "es": "nestedRoutes",
            "en": "nestedRoutes"
          },
          "isCorrect": false
        },
        {
          "id": 3,
          "answerText": {
            "es": "subRoutes",
            "en": "subRoutes"
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "parent",
            "en": "parent"
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 4,
      "questionText": {
        "es": "¿Cuál es el propósito principal de Vue Router en una aplicación Vue?",
        "en": "What is the main purpose of Vue Router in a Vue application?"
      },
      "correctAnswerExplanation": {
        "es": "Vue Router permite gestionar la navegación entre diferentes vistas o componentes en una aplicación Vue, facilitando la creación de aplicaciones de una sola página (SPA).",
        "en": "Vue Router allows you to manage navigation between different views or components in a Vue application, making it easier to create single-page applications (SPAs)."
      },
      "correctAnswerCodeExample": {
        "es": "",
        "en": ""
      },
      "codeLanguage": "plaintext",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Manejar el estado global.",
            "en": "Manage global state."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Realizar pruebas unitarias.",
            "en": "Perform unit tests."
          },
          "isCorrect": false
        },
        {
          "id": 3,
          "answerText": {
            "es": "Gestionar la navegación entre diferentes vistas.",
            "en": "Manage navigation between different views."
          },
          "isCorrect": true
        },
        {
          "id": 4,
          "answerText": {
            "es": "Mejorar el rendimiento de la aplicación.",
            "en": "Improve application performance."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 5,
      "questionText": {
        "es": "¿Cómo se define una ruta en Vue Router?",
        "en": "How do you define a route in Vue Router?"
      },
      "correctAnswerExplanation": {
        "es": "Las rutas en Vue Router se definen como objetos dentro de un array, especificando la ruta y el componente que debe renderizarse.",
        "en": "Routes in Vue Router are defined as objects inside an array, specifying the path and the component that should be rendered."
      },
      "correctAnswerCodeExample": {
        "es": `const routes = [\n  { path: "/home", component: Home }\n];`,
        "en": `const routes = [\n  { path: "/home", component: Home }\n];`
      },
      "codeLanguage": "javascript",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Usando defineRoute().",
            "en": "Using defineRoute()."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Mediante un objeto en un array de rutas.",
            "en": "By using an object in an array of routes."
          },
          "isCorrect": true
        },
        {
          "id": 3,
          "answerText": {
            "es": "Con la función createRoute().",
            "en": "Using createRoute()."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Usando addRoute() en el componente.",
            "en": "Using addRoute() in the component."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 6,
      "questionText": {
        "es": "¿Qué función se utiliza para crear una instancia de Vue Router?",
        "en": "Which function is used to create a Vue Router instance?"
      },
      "correctAnswerExplanation": {
        "es": "createRouter() es la función que se utiliza para crear una nueva instancia de Vue Router, permitiendo definir la configuración y las rutas.",
        "en": "createRouter() is the function used to create a new instance of Vue Router, allowing you to define the configuration and routes."
      },
      "correctAnswerCodeExample": {
        "es": `import { createRouter, createWebHistory } from "vue-router";\n\nconst routes = [\n  { path: "/", component: Home },\n  { path: "/about", component: About }\n];\n\nconst router = createRouter({\n  history: createWebHistory(),\n  routes\n});\n\nexport default router;`,
        "en": `import { createRouter, createWebHistory } from "vue-router";\n\nconst routes = [\n  { path: "/", component: Home },\n  { path: "/about", component: About }\n];\n\nconst router = createRouter({\n  history: createWebHistory(),\n  routes\n});\n\nexport default router;`
      },
      "codeLanguage": "javascript",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "createRouter()",
            "en": "createRouter()"
          },
          "isCorrect": true
        },
        {
          "id": 2,
          "answerText": {
            "es": "initRouter()",
            "en": "initRouter()"
          },
          "isCorrect": false
        },
        {
          "id": 3,
          "answerText": {
            "es": "new Router()",
            "en": "new Router()"
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "setupRouter()",
            "en": "setupRouter()"
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 7,
      "questionText": {
        "es": "¿Cómo se implementa la navegación con enlaces en Vue Router?",
        "en": "How is navigation implemented with links in Vue Router?"
      },
      "correctAnswerExplanation": {
        "es": "El componente <router-link> se utiliza para crear enlaces de navegación que permiten cambiar de ruta sin recargar la página.",
        "en": "The <router-link> component is used to create navigation links that allow you to change routes without reloading the page."
      },
      "correctAnswerCodeExample": {
        "es": `<template>\n  <div>\n    <h1>Bienvenido a la página principal</h1>\n    <router-link to="/profile">Ir a mi perfil</router-link>\n  </div>\n</template>\n`,
        "en": `<template>\n  <div>\n    <h1>Welcome to the main page</h1>\n    <router-link to="/profile">Go to my profile</router-link>\n  </div>\n</template>\n`
      },
      "codeLanguage": "handlebars",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Usando <a href='/ruta'>.",
            "en": "Using <a href='/route'>."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Con el componente <router-link>.",
            "en": "Using the <router-link> component."
          },
          "isCorrect": true
        },
        {
          "id": 3,
          "answerText": {
            "es": "Llamando a router.navigate().",
            "en": "Calling router.navigate()."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Modificando window.location.",
            "en": "Modifying window.location."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 8,
      "questionText": {
        "es": "¿Cómo se establece una subruta por defecto en una ruta anidada en Vue Router?",
        "en": "How do you set a default subroute in a nested route in Vue Router?"
      },
      "correctAnswerExplanation": {
        "es": "Para establecer una subruta por defecto en una ruta anidada, se define una subruta con un path vacio (path: '') dentro de children. Esto hace que cuando el usuario acceda a la ruta padre, Vue Router cargue automáticamente la subruta por defecto sin cambiar la URL.",
        "en": "To set a default subroute in a nested route, you define a subroute with an empty path (path: '') inside children. This causes Vue Router to automatically load the default subroute when the user accesses the parent route without changing the URL."
      },
      "correctAnswerCodeExample": {
        "es": `const routes = [\n  {\n    path: "/dashboard",\n    component: Dashboard,\n    children: [\n      { path: "", component: Profile } // Subruta por defecto\n    ]\n  }\n];`,
        "en": `const routes = [\n  {\n    path: "/dashboard",\n    component: Dashboard,\n    children: [\n      { path: "", component: Profile } // Default subroute\n    ]\n  }\n];`
      },
      "codeLanguage": "javascript",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Definiendo una propiedad default: true.",
            "en": "Defining a default: true property."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Usando el atributo default en children.",
            "en": "Using the default attribute in children."
          },
          "isCorrect": false
        },
        {
          "id": 3,
          "answerText": {
            "es": "Definiendo una subruta con un path vacío (path: ' ').",
            "en": "Defining a subroute with an empty path (path: ' ')."
          },
          "isCorrect": true
        },
        {
          "id": 4,
          "answerText": {
            "es": "Usando el atributo defaultRoute.",
            "en": "Using the defaultRoute attribute."
          },
          "isCorrect": false
        }
      ]
    },
    {
      "id": 9,
      "questionText": {
        "es": "¿Cómo puedes definir una ruta dinámica en Vue Router?",
        "en": "How can you define a dynamic route in Vue Router?"
      },
      "correctAnswerExplanation": {
        "es": "En Vue Router, una ruta dinámica se define usando parámetros dinámicos, que se indican con dos puntos : seguidos del nombre del parámetro. ",
        "en": "In Vue Router, a dynamic route is defined using dynamic parameters, which are indicated with a colon : followed by the parameter name."
      },
      "correctAnswerCodeExample": {
        "es": `import { createRouter, createWebHistory } from "vue-router";\n\nconst routes = [\n  {\n    path: "/user/:id" // Ruta dinámica con parámetro :id\n    name: "UserProfile",\n    component: () => import('@/views/UserProfile.vue')\n  },\n];\n\nconst router = createRouter({\n  history: createWebHistory(),\n  routes,\n});\n\nexport default router;\n`,
        "en": `import { createRouter, createWebHistory } from "vue-router";\n\nconst routes = [\n  {\n    path: "/user/:id" // Dynamic route with :id parameter\n    name: "UserProfile",\n    component: () => import('@/views/UserProfile.vue')\n  },\n];\n\nconst router = createRouter({\n  history: createWebHistory(),\n  routes,\n});\n\nexport default router;\n`
      },
      "codeLanguage": "javascript",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Usando corchetes [ ].",
            "en": "Using brackets [ ]."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Con un asterisco *.",
            "en": "With an asterisk *."
          },
          "isCorrect": false
        },
        {
          "id": 3,
          "answerText": {
            "es": "Usando paréntesis ( ).",
            "en": "Using parentheses ( )."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Con dos puntos : seguidos del nombre del parámetro.",
            "en": "With a colon : followed by the parameter name."
          },
          "isCorrect": true
        }
      ]
    },
    {
      "id": 10,
      "questionText": {
        "es": "¿Cómo se puede cargar un componente de forma perezosa (lazy loading) en una ruta de Vue Router?",
        "en": "How can you lazily load a component in a Vue Router route?"
      },
      "correctAnswerExplanation": {
        "es": "Para cargar un componente de forma perezosa en una ruta de Vue Router, se utiliza una función de importación dinámica que devuelve una promesa con el componente.",
        "en": "To lazily load a component in a Vue Router route, you use a dynamic import function that returns a promise with the component."
      },
      "correctAnswerCodeExample": {
        "es": `const routes = [\n  {\n    path: "/about",\n    component: () => import("./views/About.vue") // Carga perezosa\n  }\n];`,
        "en": `const routes = [\n  {\n    path: "/about",\n    component: () => import("./views/About.vue") // Lazy loading\n  }\n];`
      },
      "codeLanguage": "javascript",
      "answers": [
        {
          "id": 1,
          "answerText": {
            "es": "Importando el componente con la función loadComponent().",
            "en": "Importing the component with the loadComponent() function."
          },
          "isCorrect": false
        },
        {
          "id": 2,
          "answerText": {
            "es": "Importando el componente con la función dynamicImport().",
            "en": "Importing the component with the dynamicImport() function."
          },
          "isCorrect": false
        },
        {
          "id": 3,
          "answerText": {
            "es": "Importando el componente con la función import().",
            "en": "Importing the component with the import() function."
          },
          "isCorrect": false
        },
        {
          "id": 4,
          "answerText": {
            "es": "Importado el componente con () => import(...).",
            "en": "Importing the component with () => import(...)."
          },
          "isCorrect": true
        }
      ]
    }
  ]
}

export default quiz;