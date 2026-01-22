import DOMPurify from "isomorphic-dompurify";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      dompurify: DOMPurify
    }
  }
})