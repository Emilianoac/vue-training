<script setup lang="ts">
import type { EditorCodeViewerFile } from "@/lib/challenge-runners/webcontainer/types";
import CodeMirrorEditor from "./CodeMirrorEditor.client.vue";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const props = defineProps<{
  description: string;
  files: EditorCodeViewerFile[];
  title: string;
}>();

const open = defineModel<boolean>("open", { required: true });
const activePath = defineModel<string>("activePath", { required: true });
const activeFile = computed(() => props.files.find((file) => file.path === activePath.value));

watch(open, (isOpen) => {
  if (!isOpen || props.files.some((file) => file.path === activePath.value)) return;
  activePath.value = props.files[0]?.path ?? "";
});
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent
      class="flex max-h-[85dvh] w-[min(96vw,1200px)] max-w-none flex-col overflow-hidden p-0 sm:max-w-[1200px]"
      @close-auto-focus.prevent
    >
      <DialogHeader class="border-b border-(--editor-panel-border) px-5 pt-4">
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>{{ description }}</DialogDescription>

        <Tabs v-model="activePath" class="mt-2 gap-0">
          <TabsList class="h-auto justify-start rounded-none bg-transparent p-0">
            <TabsTrigger
              v-for="file in files"
              :key="file.path"
              class="rounded-none border-b-2 border-transparent px-3 py-2 text-xs data-[state=active]:border-(--editor-panel-tab-accent) data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              :value="file.path"
            >
              {{ file.label }}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </DialogHeader>

      <div class="min-h-0 flex-1 basis-[55dvh] bg-(--editor-background)">
        <CodeMirrorEditor
          v-if="activeFile"
          :key="activeFile.path"
          :model-value="activeFile.content"
          :file-path="activeFile.path"
          readonly
        />
      </div>

      <DialogFooter
        v-if="$slots.footer"
        class="shrink-0 border-t border-(--editor-panel-border) px-5 py-4"
      >
        <slot name="footer" />
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
