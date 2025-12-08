import "highlight.js/styles/stackoverflow-dark.css";

import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import handlebars from "highlight.js/lib/languages/handlebars";
import xml from "highlight.js/lib/languages/xml";
import hljsVuePlugin from "@highlightjs/vue-plugin";

export default defineNuxtPlugin((nuxtApp) => {
  hljs.registerLanguage("javascript", javascript);
  hljs.registerLanguage("handlebars", handlebars);
  hljs.registerLanguage("xml", xml);

  nuxtApp.vueApp.use(hljsVuePlugin);
});
