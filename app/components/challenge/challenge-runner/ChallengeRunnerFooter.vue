<script setup lang="ts">
import { CheckIcon, Loader2Icon, FileCode2, Monitor } from "lucide-vue-next";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const props = defineProps<{
  isReady: boolean;
  isStaticMode: boolean;
  saveFeedback: string;
  setupLabel: string;
}>();

const activeTab = defineModel<string>("activeTab", { required: true });
const { t } = useI18n();
</script>

<template>
  <footer
    class="flex items-center justify-between border-(--editor-panel-border) bg-(--editor-panel-surface-background) p-2"
  >
    <div class="flex items-center gap-1">
      <CheckIcon v-if="props.isReady" :size="10" />
      <Loader2Icon v-else class="animate-spin" :size="10" />
      <span class="text-xs text-muted-foreground">
        {{ props.saveFeedback || props.setupLabel }}
      </span>
    </div>
    <Tabs v-model="activeTab">
      <TabsList class="h-7 rounded-sm bg-(--editor-panel-background)">
        <TabsTrigger class="rounded-sm px-3 text-xs" value="editor">
          <FileCode2 /> {{ t("challenge.runner.tabs.editor") }}
        </TabsTrigger>
        <TabsTrigger v-if="!props.isStaticMode" class="rounded-sm px-3 text-xs" value="preview">
          <Monitor /> {{ t("challenge.runner.tabs.preview") }}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  </footer>
</template>
