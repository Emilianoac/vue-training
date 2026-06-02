<script setup lang="ts">
import { EditorView } from "@codemirror/view";
import { createCodeMirrorExtensions } from "./CodeMirrorEditor.config";
import { ScrollArea } from "@/components/ui/scroll-area";

const props = defineProps<{
  modelValue: string;
  onSave?: () => void;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const editorRoot = ref<HTMLElement | null>(null);
let editorView: EditorView | null = null;

onMounted(() => {
  if (!editorRoot.value) return;

  editorView = new EditorView({
    doc: props.modelValue,
    parent: editorRoot.value,
    extensions: createCodeMirrorExtensions(
      (value) => emit("update:modelValue", value),
      () => props.onSave?.(),
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
