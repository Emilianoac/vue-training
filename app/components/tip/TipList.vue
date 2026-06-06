<script lang="ts" setup>
import type { Tip } from "~/schemas/tip.schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const props = defineProps<{
  currentTip: Tip;
  tips: Tip[];
}>();

const emit = defineEmits<{
  (e: "select-tip", tip: Tip): void;
}>();
</script>

<template>
  <ScrollArea class="@4xl:h-full @4xl:pr-3">
    <ul v-if="tips.length && currentTip" class="space-y-4 p-1">
      <li v-for="tip in tips" :key="tip.documentId" @click="emit('select-tip', tip)">
        <Button
          variant="ghost"
          class="bg-card w-full h-auto justify-start whitespace-break-spaces border p-4"
          :class="{
            'border-primary bg-accent text-accent-foreground dark:bg-accent/50 ':
              tip.documentId === currentTip.documentId,
          }"
        >
          <div class="text-start space-y-3">
            <h3 class="text-sm font-semibold">{{ tip.title }}</h3>
            <p class="text-sm font-normal text-muted-foreground line-clamp-3">
              {{ tip.short_description }}
            </p>
          </div>
        </Button>
      </li>
    </ul>
  </ScrollArea>
</template>

<style lang="scss"></style>
