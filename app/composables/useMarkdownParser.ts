import { marked } from "marked";
import DOMPurify from "dompurify";

export default function useMarkdownParser() {

  function parse(markdown: string) {
    const html = marked(markdown, {async: false});

    if (import.meta.server) {
      return html;
    }

    return DOMPurify.sanitize(html);
  }

  return { 
    parse 
  }
}
