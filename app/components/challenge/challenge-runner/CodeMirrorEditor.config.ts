import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { vue } from "@codemirror/lang-vue";
import {
  bracketMatching,
  foldGutter,
  foldKeymap,
  HighlightStyle,
  indentOnInput,
  syntaxHighlighting,
} from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import {
  crosshairCursor,
  drawSelection,
  dropCursor,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection,
  type ViewUpdate,
} from "@codemirror/view";
import { tags as t } from "@lezer/highlight";

const syntaxTheme = HighlightStyle.define([
  { tag: t.comment, color: "var(--editor-syntax-comment)", fontStyle: "italic" },
  { tag: [t.string, t.special(t.string)], color: "var(--editor-syntax-string)" },
  { tag: t.number, color: "var(--editor-syntax-number)" },
  { tag: [t.bool, t.null, t.self], color: "var(--editor-syntax-constant)" },
  { tag: t.keyword, color: "var(--editor-syntax-keyword)" },
  { tag: t.controlKeyword, color: "var(--editor-syntax-control)" },
  { tag: t.moduleKeyword, color: "var(--editor-syntax-module)" },
  { tag: t.definitionKeyword, color: "var(--editor-syntax-definition)" },
  { tag: t.operator, color: "var(--editor-syntax-operator)" },
  { tag: t.punctuation, color: "var(--editor-syntax-punctuation)" },
  { tag: t.derefOperator, color: "var(--editor-syntax-operator)" },
  { tag: t.function(t.variableName), color: "var(--editor-syntax-function)" },
  {
    tag: [t.variableName, t.local(t.variableName), t.definition(t.variableName)],
    color: "var(--editor-syntax-variable)",
  },
  { tag: t.propertyName, color: "var(--editor-syntax-property)" },
  { tag: [t.className, t.typeName], color: "var(--editor-syntax-type)" },
  { tag: t.standard(t.className), color: "var(--editor-syntax-standard)" },
  { tag: t.tagName, color: "var(--editor-syntax-tag)" },
  { tag: t.attributeName, color: "var(--editor-syntax-attribute)" },
  { tag: t.angleBracket, color: "var(--editor-syntax-angle)" },
]);

const editorTheme = EditorView.theme({
  "&": {
    backgroundColor: "var(--editor-background)",
    color: "var(--editor-foreground)",
    fontSize: "0.875rem",
    height: "100%",
  },
  ".cm-scroller": {
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    lineHeight: "1.5rem",
    overflow: "auto",
  },
  ".cm-content": {
    padding: "1rem 0",
  },
  ".cm-gutters": {
    backgroundColor: "var(--editor-gutter-background)",
    borderRight: "1px solid var(--editor-border)",
    color: "var(--editor-gutter-foreground)",
  },
  ".cm-gutters > .cm-foldGutter > .cm-gutterElement": {
    opacity: 0,
    transition: "opacity 0.5s ease-in-out",
    userSelect: "none",
  },
  ".cm-gutters:hover .cm-foldGutter > .cm-gutterElement": {
    opacity: 1,
    color: "var(--editor-cursor)",
  },
  ".cm-line": {
    padding: "0 1rem",
  },
  ".cm-activeLine": {
    backgroundColor: "var(--editor-active-line-background)",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "unset",
    color: "var(--editor-active-line-gutter-foreground)",
  },
  ".cm-selectionBackground": {
    backgroundColor: "var(--editor-selection-background) !important",
  },
  ".cm-searchMatch": {
    backgroundColor: "var(--editor-search-match-background)",
  },
  ".cm-searchMatch-selected": {
    backgroundColor: "var(--editor-search-match-selected-background)",
  },
  ".cm-cursor": {
    borderLeftColor: "var(--editor-cursor)",
  },
  ".cm-tooltip": {
    backgroundColor: "var(--editor-tooltip-background)",
    border: "1px solid var(--editor-tooltip-border)",
    color: "var(--editor-tooltip-foreground)",
  },
  ".cm-tooltip-autocomplete": {
    "& > ul > li[aria-selected]": {
      backgroundColor: "var(--editor-completion-selected-background)",
      color: "var(--editor-completion-selected-foreground)",
    },
  },
  ".cm-completionMatchedText": {
    textDecoration: "none",
    color: "var(--editor-completion-match)",
    fontWeight: "bold",
  },
  ".cm-completionDetail": {
    color: "var(--editor-completion-detail)",
    fontStyle: "italic",
  },
});

const editorSetup = [
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),
  foldGutter(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  rectangularSelection(),
  crosshairCursor(),
  highlightActiveLine(),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...historyKeymap,
    ...foldKeymap,
    ...completionKeymap,
    indentWithTab,
  ]),
];

export function createCodeMirrorExtensions(onChange: (value: string) => void, onSave?: () => void) {
  return [
    ...editorSetup,
    keymap.of([
      {
        key: "Mod-s",
        run() {
          onSave?.();
          return true;
        },
      },
    ]),
    vue(),
    javascript({ typescript: true }),
    editorTheme,
    syntaxHighlighting(syntaxTheme),
    EditorView.updateListener.of((update: ViewUpdate) => {
      if (!update.docChanged) return;
      onChange(update.state.doc.toString());
    }),
  ];
}
