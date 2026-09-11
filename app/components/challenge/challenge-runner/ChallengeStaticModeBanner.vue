<script setup lang="ts">
import { AlertTriangleIcon, CheckIcon, ChevronDownIcon, RefreshCwIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

defineProps<{
  runnerError: string;
}>();

const emit = defineEmits<{
  completed: [];
  retry: [];
}>();

const { t } = useI18n();
</script>

<template>
  <Collapsible
    v-slot="{ open }"
    class="border-b border-(--editor-panel-border) bg-amber-500/10 text-sm"
    role="status"
  >
    <div class="flex min-h-11 items-center px-3 py-2">
      <CollapsibleTrigger as-child>
        <button
          class="flex w-full min-w-0 items-center gap-2 rounded-sm text-left font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring"
          type="button"
        >
          <AlertTriangleIcon class="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span class="truncate">{{ t("challenge.runner.static.title") }}</span>
          <ChevronDownIcon
            class="ml-auto size-4 shrink-0 text-muted-foreground transition-transform"
            :class="open && 'rotate-180'"
          />
        </button>
      </CollapsibleTrigger>
    </div>

    <CollapsibleContent class="px-3 pb-3 pl-9 text-muted-foreground">
      <p>{{ t("challenge.runner.static.description") }}</p>
      <details v-if="runnerError" class="mt-2 text-xs">
        <summary class="cursor-pointer">{{ t("challenge.runner.static.details") }}</summary>
        <code class="mt-1 block break-all">{{ runnerError }}</code>
      </details>
      <div class="mt-3 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" @click="emit('retry')">
          {{ t("challenge.runner.actions.retry") }}
          <RefreshCwIcon />
        </Button>
        <Button size="sm" @click="emit('completed')">
          {{ t("challenge.runner.actions.markCompleted") }}
          <CheckIcon />
        </Button>
      </div>
    </CollapsibleContent>
  </Collapsible>
</template>
