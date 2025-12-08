import type { Challenge } from "@/types/challenge";

const challenge: Challenge = {
  "id": "conditional-message-display",
  "level": "basic",
  "cover": `/images/challenges/conditional-message-display/cover.webp`,
  "images": [
    `/images/challenges/conditional-message-display/image-1.gif`,
  ],
  "levelLabel": {
    "es": "Básico",
    "en": "Basic"
  },
  "title": {
    "es": "Visualización condicional de mensajes",
    "en": "Conditional Message Display"
  },
  "description": {
    "es": "En este desafío, implementarás la lógica para alternar el estado de inicio de sesión de un usuario. Se te proporcionará una interfaz con dos mensajes: uno de bienvenida para usuarios autenticados y otro invitando a iniciar sesión o registrarse. Tu tarea es hacer que, al hacer clic en un botón, el estado de autenticación cambie dinámicamente y solo se muestre el mensaje correspondiente según el estado actual.",
    "en": "In this challenge, you'll implement the logic to toggle a user's login status. You will be given a user interface with two messages: one welcoming authenticated users and another inviting users to sign in or register. Your task is to ensure that clicking a button dynamically changes the authentication state and only displays the appropriate message based on the current status."
  },
  "short_description": {
    "es": "Implementa la lógica para alternar el estado de autenticación y mostrar el mensaje correspondiente.",
    "en": "Implement the logic to toggle authentication state and display the appropriate message."
  },
  "objectives": {
    "es": [
      "Mostrar solo el mensaje que corresponde al estado de autenticación.",
      "Alternar el estado de autenticación al hacer clic en el botón.",
    ],
    "en": [
      "Display only the message that corresponds to the authentication state.",
      "Toggle the authentication state when clicking the button.",
    ]
  },
  "stackblitz": {
    "challenge": "https://stackblitz.com/edit/emi-conditional-message-display-challenge?embed=1&file=src%2Fcomponents%2FConditionalMessageDisplay.vue",
    "solution": "https://stackblitz.com/edit/emi-conditional-message-display-solution?embed=1&file=src%2Fcomponents%2FConditionalMessageDisplay.vue"
  }
}
export default challenge;

