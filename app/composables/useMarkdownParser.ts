import { marked } from "marked";

export default function useMarkdownParser() {
  const { $dompurify } = useNuxtApp();

  function parse(markdown: string) {
    const html = marked(markdown, {async: false});
    return $dompurify.sanitize(html);
  }

  return { 
    parse 
  }
}
