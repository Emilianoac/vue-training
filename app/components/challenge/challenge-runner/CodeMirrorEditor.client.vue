<script setup lang="ts">
import { EditorView } from "@codemirror/view";
import { createCodeMirrorExtensions } from "./CodeMirrorEditor.config";
import { ScrollArea } from "@/components/ui/scroll-area";

const props = defineProps<{
  filePath?: string;
  modelValue: string;
  onSave?: () => void;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const { t } = useI18n();
const editorRoot = ref<HTMLElement | null>(null);
let editorView: EditorView | null = null;

const language = computed(() => {
  if (props.filePath?.endsWith(".js")) return "javascript" as const;
  if (props.filePath?.endsWith(".ts")) return "typescript" as const;
  return "vue" as const;
});

onMounted(() => {
  if (!editorRoot.value) return;

  editorView = new EditorView({
    doc: props.modelValue,
    parent: editorRoot.value,
    extensions: createCodeMirrorExtensions(
      (value) => emit("update:modelValue", value),
      () => props.onSave?.(),
      {
        language: language.value,
        readonly: props.readonly,
        syntaxErrorMessage: t("challenge.runner.editor.syntaxError"),
      },
    ),
  });
});

watch(
  () => props.modelValue,
  (value) => {
    if (!editorView) return;

    const currentValue = editorView.state.doc.toString();
    if (value === currentValue) return;

    editorView.dispatch({
      changes: {
        from: 0,
        to: currentValue.length,
        insert: value,
      },
    });
  },
);

onBeforeUnmount(() => {
  editorView?.destroy();
  editorView = null;
});
</script>

<template>
  <ScrollArea class="h-full min-h-0 bg-(--editor-background)" type="always">
    <div ref="editorRoot" class="h-full min-h-0 overflow-auto pr-4" />
  </ScrollArea>
</template>
