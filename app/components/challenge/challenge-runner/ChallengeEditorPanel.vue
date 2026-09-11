<script setup lang="ts">
import { Loader2Icon, PlayIcon, RefreshCwIcon } from "lucide-vue-next";
import CodeMirrorEditor from "./CodeMirrorEditor.client.vue";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";

const props = defineProps<{
  activeFilePath: string;
  canLoadPreview: boolean;
  canRunTests: boolean;
  isPreviewStarting: boolean;
  isRunning: boolean;
  isStaticMode: boolean;
  onSave: () => Promise<void>;
  previewFrameKey: number;
  previewUrl: string;
}>();

const emit = defineEmits<{
  loadPreview: [];
  runTests: [];
}>();

const activeTab = defineModel<string>("activeTab", { required: true });
const code = defineModel<string>("code", { required: true });
const { t } = useI18n();
</script>

<template>
  <Tabs v-model="activeTab" class="h-full min-h-0 gap-0">
    <TabsContent value="editor" class="relative m-0 h-full min-h-0 data-[state=inactive]:hidden">
      <CodeMirrorEditor
        :key="props.activeFilePath"
        v-model="code"
        :file-path="props.activeFilePath"
        :on-save="props.onSave"
      />
      <div
        v-if="!props.isStaticMode"
        class="absolute right-4 bottom-4 z-10 flex gap-2 rounded-md bg-(--editor-panel-background) p-2 shadow-(--editor-panel-shadow)"
      >
        <Button :disabled="!props.canRunTests" @click="emit('runTests')">
          <template v-if="props.isRunning">
            {{ t("challenge.runner.actions.runningTests") }}
            <Loader2Icon class="animate-spin" />
          </template>
          <template v-else>
            {{ t("challenge.runner.actions.runTests") }}
            <PlayIcon />
          </template>
        </Button>
      </div>
    </TabsContent>

    <TabsContent
      v-if="!props.isStaticMode"
      value="preview"
      class="m-0 h-full min-h-0 bg-(--editor-background) data-[state=inactive]:hidden"
    >
      <div class="flex h-full min-h-0 flex-col">
        <div class="flex justify-end border-b border-(--editor-panel-border) p-2">
          <Button
            size="sm"
            variant="outline"
            :disabled="!props.canLoadPreview"
            @click="emit('loadPreview')"
          >
            <template v-if="props.isPreviewStarting">
              {{ t("challenge.runner.actions.loadingPreview") }}
              <Loader2Icon class="animate-spin" />
            </template>
            <template v-else>
              {{ t("challenge.runner.actions.reloadPreview") }}
              <RefreshCwIcon />
            </template>
          </Button>
        </div>

        <iframe
          v-if="props.previewUrl"
          :key="props.previewFrameKey"
          class="min-h-0 flex-1 bg-white"
          :src="props.previewUrl"
          :title="t('challenge.runner.preview.title')"
        />

        <div
          v-else
          class="flex min-h-0 flex-1 items-center justify-center p-6 text-sm text-muted-foreground"
        >
          {{
            props.isPreviewStarting
              ? t("challenge.runner.preview.loading")
              : t("challenge.runner.preview.empty")
          }}
        </div>
      </div>
    </TabsContent>
  </Tabs>
</template>
