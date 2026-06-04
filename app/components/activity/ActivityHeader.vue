<script setup lang="ts">
import { XIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

defineProps<{
  title: string;
  backTo: string;
}>();

const { t } = useI18n();
</script>

<template>
  <header class="flex min-h-12 items-center justify-start border-b bg-background px-4 gap-2">
    <Button
      as-child
      variant="ghost"
      size="icon-sm"
      :title="t('activity.leave')"
      :aria-label="t('activity.leave')"
    >
      <NuxtLink :to="backTo">
        <XIcon />
      </NuxtLink>
    </Button>
    <h1 class="min-w-0 truncate text-sm font-semibold md:text-base">
      {{ title }}
    </h1>
  </header>
</template>
